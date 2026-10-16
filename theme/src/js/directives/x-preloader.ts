import Alpine, {DirectiveData, Magics} from 'alpinejs';
import {isLowPowerDevice} from '@groupthought/tradecraft-ui/utils';
import {isSavingData, isSlowConnection} from '@theme/utils';

const PRELOAD_INTERACT_EVENTS = ['pointerover', 'pointerdown', 'touchstart', 'focusin', 'click'] as const;
const ATTENTION_VIEWPORT_MEDIA = '(max-width: 767px)';
const ATTENTION_VIEWPORT_ROOT_MARGIN = '-30% 0px -30% 0px';
// Mobile attention warming is deliberately patient and bounded. Direct interaction bypasses
// this dwell/budget path, so a touched swatch still starts immediately at high priority.
const ATTENTION_DWELL_MS = 300;
const MAX_ATTENTION_PRELOAD_REQUESTS = 20;
const pendingPreloads = new Map<string, Promise<void>>();
const warmedSelections = new WeakSet<HTMLElement>();
const attentionCallbacks = new WeakMap<Element, (isIntersecting: boolean) => void>();
let attentionObserver: IntersectionObserver | undefined;
let attentionPreloadRequests = 0;

function getAttentionObserver() {
  attentionObserver ??= new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const callback = attentionCallbacks.get(entry.target);
        callback?.(entry.isIntersecting);
      });
    },
    {
      // A tall mobile card reaches this center band while its media is visible,
      // before the selections beneath it are likely to be tapped.
      rootMargin: ATTENTION_VIEWPORT_ROOT_MARGIN,
    },
  );
  return attentionObserver;
}

function observeAttention(element: Element, callback: (isIntersecting: boolean) => void) {
  attentionCallbacks.set(element, callback);
  getAttentionObserver().observe(element);
}

function unobserveAttention(element: Element) {
  attentionObserver?.unobserve(element);
  attentionCallbacks.delete(element);
}

function warmImage(
  source: {src?: string; srcset?: string; sizes?: string; crossOrigin?: string | null; referrerPolicy?: string},
  priority: 'high' | 'low',
) {
  if (!source.src && !source.srcset) return;

  const image = new Image();
  image.fetchPriority = priority;
  if (source.crossOrigin) image.crossOrigin = source.crossOrigin;
  if (source.referrerPolicy) image.referrerPolicy = source.referrerPolicy;
  if (source.sizes) image.sizes = source.sizes;
  if (source.srcset) image.srcset = source.srcset;
  if (source.src) image.src = source.src;
  void image.decode().catch(() => undefined);
}

function warmSelectionImage(selection: HTMLElement) {
  if (warmedSelections.has(selection) || isSavingData() || isSlowConnection()) return;
  warmedSelections.add(selection);
  warmImage(
    {
      src: selection.dataset.preloadImageSrc,
      srcset: selection.dataset.preloadImageSrcset,
      sizes: selection.dataset.preloadImageSizes,
    },
    'high',
  );
}

function warmResponseImage(html: string | null | undefined, priority: 'high' | 'low') {
  if (!html) return;
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  const source = template.content.querySelector<HTMLImageElement>('[data-morph-view-transition] img');
  if (!source) return;

  warmImage(source, priority);
}

Alpine.directive('preloader', ($el, {expression, modifiers}: DirectiveData) => {
  let preloadOnIntersect = modifiers.includes('intersect');
  let preloadOnInteract = modifiers.includes('interact');
  const preloadOnAttention = modifiers.includes('attention');
  const preloadAllOnInteract = modifiers.includes('all');

  if (!modifiers.includes('intersect') && !modifiers.includes('interact') && !preloadOnAttention) {
    preloadOnIntersect = true;
    preloadOnInteract = true;
  }

  Alpine.bind($el, {
    'x-data'(this: Magics<any> & {__preloader_sectionId: string}) {
      const sectionId = expression || this.$sectionId!;

      return {
        __preloader_interactAbortController: undefined as AbortController | undefined,
        __preloader_attentionMediaQuery: undefined as MediaQueryList | undefined,
        __preloader_attentionMediaListener: undefined as (() => void) | undefined,
        __preloader_attentionTimeout: undefined as number | undefined,
        __preloader_attentionGeneration: 0,
        __preloader_attentionActive: false,
        __preloader_attentionAttemptedUrls: new Set<string>(),

        __preloader_sectionId: sectionId,
        __preloader_getUrls(): string[] {
          const urls: string[] = [];
          $el.querySelectorAll('[data-preload-url]').forEach((child) => {
            const url = (child as HTMLElement).dataset.preloadUrl;
            if (url) {
              urls.push(url);
            }
          });
          return urls;
        },

        __preloader_preloadOne(this: any, url: string, priority: 'high' | 'low' = 'low') {
          if (isSavingData() || isSlowConnection() || !url || !this.$sectionApi?.load) return Promise.resolve();

          const preloadKey = `${this.__preloader_sectionId}\n${url}`;
          const pendingPreload = pendingPreloads.get(preloadKey);
          if (pendingPreload) return pendingPreload;

          const preload = Promise.resolve(
            this.$sectionApi.load({
              sectionId: this.__preloader_sectionId,
              baseUrl: url,
              abortPending: false,
              fetchOptions: {priority} as RequestInit,
            }),
          )
            .then(() => {
              const cacheUrl = this.$sectionApi.controller?.buildUrl({
                sectionId: this.__preloader_sectionId,
                baseUrl: url,
              });
              const html = cacheUrl ? this.$store?.cache?.resources?.sectionHtml?.get(cacheUrl) : null;
              warmResponseImage(html, priority);
            })
            .catch(() => {
              // Navigation retries a failed preload
            })
            .finally(() => {
              if (pendingPreloads.get(preloadKey) === preload) pendingPreloads.delete(preloadKey);
            });
          pendingPreloads.set(preloadKey, preload);
          return preload;
        },

        __preloader_handlePreloadInteract(this: any, event: Event) {
          if (preloadAllOnInteract) {
            const eventTarget =
              (event.target as Node)?.nodeType === Node.ELEMENT_NODE
                ? (event.target as Element)
                : (event.target as Node)?.parentElement;
            const prioritySelection = eventTarget?.closest<HTMLElement>('[data-preload-url]');
            if (prioritySelection && $el.contains(prioritySelection)) warmSelectionImage(prioritySelection);
            const priorityUrl = prioritySelection?.dataset.preloadUrl;
            const excludedUrl = event.type === 'click' ? priorityUrl : undefined;
            this.__preloader_preloadAll(false, priorityUrl, excludedUrl);
            return;
          }

          const root = this.$el as HTMLElement;
          const target =
            (event.target as Node)?.nodeType === Node.ELEMENT_NODE
              ? (event.target as HTMLElement).closest?.('[data-preload-url]')
              : null;
          if (!target || !root.contains(target)) return;
          const url = (target as HTMLElement).dataset?.preloadUrl;
          if (url) this.__preloader_preloadOne(url);
        },

        __preloader_preloadAll(this: any, requireIntersection = true, priorityUrl?: string, excludedUrl?: string) {
          const sectionsStore = this.$store?.sections as any;
          if (isSavingData() || isSlowConnection()) return;
          if (requireIntersection && !sectionsStore?.intersected?.has(this.$sectionId)) return;

          const urls = this.__preloader_getUrls();
          if (!this.$sectionApi?.load) return;

          if (priorityUrl && priorityUrl !== excludedUrl) void this.__preloader_preloadOne(priorityUrl, 'high');
          urls
            .filter((url: string) => url !== excludedUrl && url !== priorityUrl)
            .forEach((url: string) => void this.__preloader_preloadOne(url, 'low'));
        },

        async __preloader_preloadAttention(this: any, generation: number) {
          for (const url of this.__preloader_getUrls()) {
            if (generation !== this.__preloader_attentionGeneration || !this.__preloader_attentionActive) return;
            if (attentionPreloadRequests >= MAX_ATTENTION_PRELOAD_REQUESTS) return;
            if (this.__preloader_attentionAttemptedUrls.has(url)) continue;

            this.__preloader_attentionAttemptedUrls.add(url);
            attentionPreloadRequests += 1;
            await this.__preloader_preloadOne(url, 'low');
          }
        },

        __preloader_setAttention(this: any, isIntersecting: boolean) {
          if (this.__preloader_attentionTimeout !== undefined) {
            clearTimeout(this.__preloader_attentionTimeout);
            this.__preloader_attentionTimeout = undefined;
          }

          this.__preloader_attentionActive = isIntersecting;
          const generation = ++this.__preloader_attentionGeneration;
          if (!isIntersecting) return;

          this.__preloader_attentionTimeout = window.setTimeout(() => {
            this.__preloader_attentionTimeout = undefined;
            if (generation === this.__preloader_attentionGeneration && this.__preloader_attentionActive) {
              void this.__preloader_preloadAttention(generation);
            }
          }, ATTENTION_DWELL_MS);
        },

        __preloader_syncAttention(this: any) {
          if (
            !this.__preloader_attentionMediaQuery?.matches ||
            isSavingData() ||
            isSlowConnection() ||
            isLowPowerDevice()
          ) {
            this.__preloader_setAttention(false);
            unobserveAttention($el);
            return;
          }

          observeAttention($el, this.__preloader_setAttention.bind(this));
        },

        init(this: any) {
          if (preloadOnInteract) {
            const controller = new AbortController();
            this.__preloader_interactAbortController = controller;
            const root = this.$el as HTMLElement;
            const {signal} = controller;
            PRELOAD_INTERACT_EVENTS.forEach((type) => {
              root.addEventListener(type, this.__preloader_handlePreloadInteract.bind(this), {
                capture: true,
                passive: type === 'touchstart',
                signal,
              });
            });
          }

          if (preloadOnAttention) {
            this.__preloader_attentionMediaQuery = window.matchMedia(ATTENTION_VIEWPORT_MEDIA);
            this.__preloader_attentionMediaListener = this.__preloader_syncAttention.bind(this);
            this.__preloader_attentionMediaQuery.addEventListener('change', this.__preloader_attentionMediaListener);
            this.__preloader_syncAttention();
          }
        },

        destroy(this: any) {
          this.__preloader_interactAbortController?.abort();
          this.__preloader_attentionMediaQuery?.removeEventListener('change', this.__preloader_attentionMediaListener);
          this.__preloader_setAttention(false);
          unobserveAttention($el);
        },
      };
    },

    'x-effect'(this: Magics<any> & {__preloader_preloadAll(): void}) {
      if (preloadOnIntersect) {
        if (this.$store?.sections?.intersected?.has(this.$sectionId!)) {
          this.__preloader_preloadAll();
        }
      }
    },
  });
});
