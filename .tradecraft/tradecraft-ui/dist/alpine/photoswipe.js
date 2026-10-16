import { cancelIdleCallback, requestIdleCallback } from '../utils/dom';
import { isHtmlElement, isImageElement, isPlainObject, isScriptElement, isTemplateElement, isVideoElement, } from '../utils';
import { warnMissingParentDirective } from '../utils/error';
const MEDIA_ATTR = 'data-photoswipe-media';
const JSON_ATTR = 'data-photoswipe-json';
function getSlideDataFromImage(id, el) {
    return {
        id: id,
        type: 'image',
        src: el.src,
        msrc: el.currentSrc || el.src,
        srcset: el.srcset,
        width: parseInt(el.getAttribute('width')),
        height: parseInt(el.getAttribute('height')),
        thumbEl: el,
        alt: el.alt,
        thumbCropped: false,
    };
}
function getSlideDataFromVideo(id, el) {
    var _a;
    const posterEl = el.querySelector('img');
    return {
        id: id,
        type: 'video',
        videoSrc: (_a = el.querySelector('source')) === null || _a === void 0 ? void 0 : _a.src,
        msrc: (posterEl === null || posterEl === void 0 ? void 0 : posterEl.currentSrc) || (posterEl === null || posterEl === void 0 ? void 0 : posterEl.src),
        width: parseInt(posterEl === null || posterEl === void 0 ? void 0 : posterEl.getAttribute('width')),
        height: parseInt(posterEl === null || posterEl === void 0 ? void 0 : posterEl.getAttribute('height')),
        thumbEl: posterEl,
        alt: (posterEl === null || posterEl === void 0 ? void 0 : posterEl.getAttribute('alt')) || el.getAttribute('aria-label') || '',
        thumbCropped: false,
    };
}
function getSlideDataFromJson(el) {
    let raw = el.textContent;
    let result = {};
    if (!raw)
        return result;
    try {
        const parsed = JSON.parse(raw);
        if (isPlainObject(parsed))
            result = parsed;
        else
            console.warn('data-photoswipe-json expected an object but got', parsed);
    }
    catch (e) {
        console.warn('Invalid data-photoswipe-json', raw, e);
    }
    return result;
}
function getDataSourceFromRoot(root) {
    const nodes = root.querySelectorAll(`[${MEDIA_ATTR}], [${JSON_ATTR}]`);
    const result = [];
    nodes.forEach((el) => {
        if (isImageElement(el)) {
            result.push(getSlideDataFromImage(el.getAttribute(MEDIA_ATTR), el));
        }
        else if (isVideoElement(el)) {
            result.push(getSlideDataFromVideo(el.getAttribute(MEDIA_ATTR), el));
        }
        else if (isScriptElement(el) && el.type === 'application/json') {
            result.push(getSlideDataFromJson(el));
        }
        else {
            const videoEl = el.querySelector('video');
            if (videoEl) {
                console.log({ videoEl });
                result.push(getSlideDataFromVideo(el.getAttribute(MEDIA_ATTR), videoEl));
                return;
            }
            const imageEl = el.querySelector('img');
            if (imageEl) {
                result.push(getSlideDataFromImage(el.getAttribute(MEDIA_ATTR), imageEl));
                return;
            }
        }
    });
    return result;
}
/**
 * Photoswipe plugin for Alpine.js
 *
 * Adds PhotoSwipe lightbox functionality to Alpine.js applications.
 *
 * **Directives:**
 * - `x-photoswipe`: Root directive that initializes PhotoSwipe (optionally with a config expression)
 * - `x-photoswipe:button="id"`: Creates a button that opens the lightbox at the slide with that id
 * - `x-photoswipe:counter`: Template for the slide counter
 *
 * **Magics:**
 * - `$photoswipe`: The lightbox instance (null until initialized)
 * - `$photoswipeOpen(id)`: Open the lightbox at a slide id resolved at call time
 *
 * **Slide data (lazy):** When the lightbox opens, the plugin collects every
 * `[data-photoswipe-media]` and `[data-photoswipe-json]` node inside the root, in DOM order,
 * and uses that as the dataSource. This avoids duplicate slides after re-renders and defers
 * the work until open. Each node contributes one slide:
 * - `<img data-photoswipe-media="id">` — image slide built from the img's src, srcset,
 *   width/height attributes, and alt
 * - `<video data-photoswipe-media="id">` — video slide; the `<source>` gives the video URL
 *   and the poster `<img>` inside gives size and thumbnail
 * - any other element with `data-photoswipe-media="id"` — reads the first `<video>` or
 *   `<img>` inside it
 * - `<script type="application/json" data-photoswipe-json>{"id":"...","src":"...",...}</script>`
 *   — a raw PhotoSwipe SlideData object in the script body
 *
 * **Default configuration (root directive):**
 * When you use the root directive without an expression (`x-photoswipe` with no value), the plugin
 * uses `window.theme.photoswipe` as the config if it exists (e.g. in themes that set it in
 * the theme head). If `window.theme.photoswipe` is not defined, it falls back to an empty object.
 * So `x-photoswipe` is equivalent to `x-photoswipe="window.theme.photoswipe"` when the theme
 * provides that object. You can still pass any config expression to override, e.g.
 * `x-photoswipe="{ maxZoomLevel: 2 }"` or `x-photoswipe="myCustomConfig"`.
 *
 * @example Root with default theme config (bare directive)
 * ```html
 * <div x-photoswipe>
 *   <script type="application/json" data-photoswipe-json>{"src":"image.jpg","width":600,"height":400,"alt":"My Image"}</script>
 *   <button x-photoswipe:button="0">Open Lightbox</button>
 *   <template x-photoswipe:counter>
 *     <div><span x-text="currentIndex + 1"></span> of <span x-text="totalSlides"></span></div>
 *   </template>
 * </div>
 * ```
 *
 * @example Root with explicit or custom config
 * ```html
 * <div x-photoswipe="window.theme.photoswipe">
 * <div x-photoswipe="{ maxZoomLevel: 2, zoom: true }">
 * ```
 */
export default function photoSwipe(defaultConfig = {}) {
    return function (Alpine) {
        Alpine.directive('photoswipe', ($el, data, utilities) => {
            if (!isHtmlElement($el)) {
                throw new Error(`Expected HTMLElement but got ${$el}`);
            }
            if (data.value === 'button') {
                handleButton($el, Alpine, data);
            }
            else if (data.value === 'counter') {
                handleCounter($el, Alpine, data);
            }
            else if (data.value === null) {
                handleRoot($el, Alpine, data, utilities, defaultConfig);
            }
            else {
                throw new Error(`Unknown directive: x-photoswipe:${data.value}`);
            }
        }).before('bind');
        Alpine.magic('photoswipe', ($el) => {
            const $data = Alpine.$data($el);
            return $data.__photoswipe_lightbox;
        });
        Alpine.magic('photoswipeOpen', ($el) => {
            const $data = Alpine.$data($el);
            return async (id) => {
                if ($data.__photoswipe_loadAndOpen == undefined) {
                    warnMissingParentDirective('$photoswipeOpen', 'x-photoswipe', $el);
                    return false;
                }
                return $data.__photoswipe_loadAndOpen(String(id));
            };
        });
    };
}
function handleCounter($el, Alpine, { expression }) {
    if (!isTemplateElement($el)) {
        throw new Error(`Expected TemplateElement but got ${$el}`);
    }
    Alpine.bind($el, {
        'x-init'() {
            if (this.$data.__photoswipe_loadAndOpen == undefined) {
                warnMissingParentDirective('x-photoswipe:counter', 'x-photoswipe', this.$el);
                return;
            }
            this.__photoswipe_counterEl = $el.content.firstElementChild;
        },
    });
}
function handleButton($el, Alpine, { expression }) {
    if (!expression) {
        throw new Error(`x-photoswipe:button requires an id matching a datasource item`);
    }
    Alpine.bind($el, {
        'x-init'() {
            if (this.$data.__photoswipe_loadAndOpen == undefined) {
                warnMissingParentDirective('x-photoswipe:button', 'x-photoswipe', this.$el);
            }
        },
        '@click.stop.prevent'() {
            // Guard so a button outside x-photoswipe logs a helpful error (via x-init) instead of throwing on click.
            if (this.$data.__photoswipe_loadAndOpen == undefined)
                return;
            this.$data.__photoswipe_loadAndOpen(expression);
        },
    });
}
function handleRoot($el, Alpine, { expression }, { evaluate }, defaultConfig) {
    Alpine.bind($el, {
        'x-data'() {
            return {
                __photoswipe_lightbox: null,
                __photoswipe_initPromise: new Promise(() => { }),
                __photoswipe_resolveInit: null,
                __photoswipe_idleId: null,
                __photoswipe_destroyed: false,
                __photoswipe_buttonHeight: 0,
                __photoswipe_counterHeight: 0,
                __photoswipe_counterEl: null,
                __photoswipe_root: $el,
                async init() {
                    const [{ default: PhotoSwipeLightbox }, { default: PhotoSwipeVideoPlugin }] = await Promise.all([
                        import('photoswipe/lightbox'),
                        // @ts-ignore: Untyped module TODO
                        import('photoswipe-video-plugin'),
                    ]);
                    // The component may have been destroyed while the dynamic imports were in flight.
                    // If so, don't schedule the idle callback or construct a lightbox after cleanup.
                    if (this.__photoswipe_destroyed)
                        return;
                    this.__photoswipe_initPromise = new Promise((resolve) => {
                        this.__photoswipe_resolveInit = resolve;
                        // The timeout matters here: until this runs there is no lightbox, and anything awaiting
                        // `__photoswipe_initPromise` (i.e. opening an image) waits with it.
                        this.__photoswipe_idleId = requestIdleCallback(async () => {
                            var _a;
                            const themePhotoswipe = (_a = window.theme) === null || _a === void 0 ? void 0 : _a.photoswipe;
                            const instanceConfig = expression
                                ? evaluate(expression)
                                : (themePhotoswipe !== null && themePhotoswipe !== void 0 ? themePhotoswipe : {});
                            const config = Object.assign(Object.assign({}, defaultConfig), instanceConfig);
                            this.__photoswipe_lightbox = new PhotoSwipeLightbox(Object.assign({ dataSource: [] }, config));
                            this.__photoswipe_lightbox.addFilter('thumbEl', (thumbEl, data) => {
                                if (isHtmlElement(data.thumbEl)) {
                                    return data.thumbEl;
                                }
                                else if (data.thumbEl) {
                                    return this.__photoswipe_root.querySelector(data.thumbEl);
                                }
                                else {
                                    return thumbEl;
                                }
                            });
                            this.__photoswipe_lightbox.addFilter('uiElement', (element, data) => {
                                if (!this.__photoswipe_lightbox)
                                    return element;
                                if (data.name === 'counter') {
                                    if (!this.__photoswipe_counterEl)
                                        return element;
                                    const pswp = this.__photoswipe_lightbox.pswp;
                                    if (!pswp)
                                        return element;
                                    const counterClone = this.__photoswipe_counterEl.cloneNode(true);
                                    const counterScope = Alpine.reactive({
                                        currentIndex: pswp.currIndex,
                                        totalSlides: pswp.getNumItems(),
                                    });
                                    Alpine.addScopeToNode(counterClone, counterScope);
                                    Alpine.initTree(counterClone);
                                    this.__photoswipe_lightbox.on('change', () => {
                                        counterScope.currentIndex = pswp.currIndex;
                                        element.replaceChildren(counterClone);
                                    });
                                }
                                return element;
                            });
                            new PhotoSwipeVideoPlugin(this.__photoswipe_lightbox);
                            Alpine.mutateDom(() => {
                                var _a;
                                (_a = this.__photoswipe_lightbox) === null || _a === void 0 ? void 0 : _a.init();
                            });
                            this.__photoswipe_idleId = null;
                            this.__photoswipe_resolveInit = null;
                            resolve();
                        }, { timeout: 2000 });
                    });
                },
                async __photoswipe_loadAndOpen(id) {
                    await this.__photoswipe_initPromise;
                    const lightbox = this.__photoswipe_lightbox;
                    if (!lightbox)
                        return false;
                    let result = false;
                    const dataSource = getDataSourceFromRoot(this.__photoswipe_root);
                    const index = dataSource.findIndex((item) => item.id === id);
                    if (index === -1) {
                        console.warn(`Could not find datasource item with id ${id}, defaulting to showing first item`);
                    }
                    Alpine.mutateDom(() => {
                        result = lightbox.loadAndOpen(index, dataSource);
                    });
                    return result;
                },
                destroy() {
                    this.__photoswipe_destroyed = true;
                    if (this.__photoswipe_idleId !== null) {
                        cancelIdleCallback(this.__photoswipe_idleId);
                        this.__photoswipe_idleId = null;
                    }
                    // Settle the init promise so callers awaiting loadAndOpen don't hang
                    // when teardown happens before the idle init callback runs.
                    if (this.__photoswipe_resolveInit !== null) {
                        this.__photoswipe_resolveInit();
                        this.__photoswipe_resolveInit = null;
                    }
                    Alpine.mutateDom(() => {
                        var _a;
                        (_a = this.__photoswipe_lightbox) === null || _a === void 0 ? void 0 : _a.destroy();
                        this.__photoswipe_lightbox = null;
                    });
                },
            };
        },
    });
}
