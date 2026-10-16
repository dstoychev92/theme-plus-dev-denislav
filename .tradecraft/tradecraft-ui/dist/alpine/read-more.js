import { isHtmlElement, onFirstLayout } from '../utils';
import { warnMissingParentDirective } from '../utils/error';
/**
 * Truncated "read more" content with a smooth height expand animation.
 *
 * Owns expanded state, animates height when expanding (FLIP), and expands when:
 * - the read-more button is clicked
 * - focus enters the truncated content (e.g. tabbing to a link inside)
 * - the page is printed (`beforeprint`)
 * - the URL hash / `:target` points at something inside the root
 * - find-in-page or fragment navigation hits `x-read-more:content` (`beforematch`)
 *
 * ## Directives
 *
 * - `x-read-more` — Root. Holds expanded state and runs the height animation.
 * - `x-read-more:button` — Click expands the content.
 * - `x-read-more:preview` — Optional. Line-clamped preview shown while collapsed.
 *   Strips `id` attributes so a paired `x-read-more:content` can keep the real ids.
 * - `x-read-more:content` — Optional. Full content marked `hidden="until-found"` while
 *   collapsed so find-in-page / text fragments can reveal it via `beforematch`.
 *
 * ## Find-in-page hybrid
 *
 * Line-clamp alone cannot receive `beforematch`. Pair a clamped preview with a full
 * copy on `x-read-more:content`:
 *
 * ```html
 * <div x-read-more class="overflow-clip">
 *   <div x-read-more:preview class="line-clamp-3">…</div>
 *   <!-- hidden must be in the HTML (not only set by JS) to avoid a flash of full text -->
 *   <div x-read-more:content hidden="until-found">…</div>
 *   <button type="button" x-read-more:button x-show="!$readMore.isExpanded">Read more</button>
 * </div>
 * ```
 *
 * ## $readMore Magic
 *
 * - `$readMore.isExpanded` — Whether the content is expanded
 * - `$readMore.expand()` — Expand programmatically
 *
 * @example Basic usage (no find-in-page)
 *
 * ```html
 * <div x-read-more class="overflow-clip">
 *   <div
 *     class="line-clamp-[--truncate-lines]"
 *     :style="{ '--truncate-lines': $readMore.isExpanded ? 'none' : 3 }"
 *   >
 *     Long content…
 *   </div>
 *   <button type="button" x-read-more:button x-show="!$readMore.isExpanded">
 *     Read more
 *   </button>
 * </div>
 * ```
 */
export default function (Alpine) {
    Alpine.directive('read-more', ($el, data) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value == 'button') {
            handleButton($el, Alpine);
        }
        else if (data.value == 'preview') {
            handlePreview($el, Alpine);
        }
        else if (data.value == 'content') {
            handleContent($el, Alpine);
        }
        else if (data.value == null) {
            handleRoot($el, Alpine);
        }
        else {
            throw new Error(`Unknown directive: x-read-more:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('readMore', ($el) => {
        const $data = Alpine.$data($el);
        return {
            get isExpanded() {
                var _a;
                return (_a = $data.__read_more_isExpanded) !== null && _a !== void 0 ? _a : false;
            },
            expand() {
                if (!$data.__read_more_isRoot) {
                    warnMissingParentDirective('$readMore', 'x-read-more', $el);
                    return;
                }
                $data.__read_more_expand();
            },
        };
    });
}
function handleButton($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__read_more_isRoot) {
                warnMissingParentDirective('x-read-more:button', 'x-read-more', this.$el);
            }
        },
        '@click.prevent.stop': '$readMore.expand()',
    });
}
function handlePreview($el, Alpine) {
    Alpine.bind($el, {
        'x-show'() {
            return !this.__read_more_isExpanded;
        },
        'x-init'() {
            if (!this.__read_more_isRoot) {
                warnMissingParentDirective('x-read-more:preview', 'x-read-more', this.$el);
                return;
            }
            // Avoid duplicate ids when the full copy lives on x-read-more:content.
            this.$el.querySelectorAll('[id]').forEach((node) => {
                node.removeAttribute('id');
            });
        },
    });
}
function handleContent($el, Alpine) {
    // Prefer the attribute in the HTML for first paint; set here as a fallback when omitted.
    if (!$el.hasAttribute('hidden')) {
        $el.setAttribute('hidden', 'until-found');
    }
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__read_more_isRoot) {
                warnMissingParentDirective('x-read-more:content', 'x-read-more', this.$el);
                return;
            }
            this.__read_more_contentEl = this.$el;
            this.__read_more_syncContentHidden();
            this.$watch('__read_more_isExpanded', () => {
                this.__read_more_syncContentHidden();
            });
        },
        '@beforematch'() {
            this.__read_more_expand({ animate: false });
        },
    });
}
function handleRoot($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __read_more_isRoot: true,
                __read_more_isExpanded: false,
                __read_more_collapsedHeight: null,
                __read_more_transition: 'height 300ms',
                __read_more_cancelFirstLayout: null,
                __read_more_rafIds: [],
                __read_more_skipAnimation: false,
                __read_more_wasExpandedBeforePrint: false,
                __read_more_contentEl: null,
                init() {
                    const inlineTransition = this.$el.style.transition;
                    this.__read_more_transition = inlineTransition || 'height 300ms';
                    this.__read_more_cancelFirstLayout = onFirstLayout(this.$el, () => {
                        this.__read_more_collapsedHeight = this.$el.clientHeight;
                    });
                    this.$watch('__read_more_isExpanded', (isExpanded) => {
                        if (isExpanded) {
                            if (this.__read_more_skipAnimation) {
                                this.__read_more_skipAnimation = false;
                                this.$el.style.height = '';
                                this.$el.style.transition = '';
                                return;
                            }
                            this.__read_more_animateExpand();
                        }
                    });
                    // Bind so window listeners keep the Alpine component as `this`.
                    this.__read_more_onBeforePrint = this.__read_more_onBeforePrint.bind(this);
                    this.__read_more_onAfterPrint = this.__read_more_onAfterPrint.bind(this);
                    this.__read_more_onHashChange = this.__read_more_onHashChange.bind(this);
                    this.__read_more_expandIfHashTarget();
                    window.addEventListener('beforeprint', this.__read_more_onBeforePrint);
                    window.addEventListener('afterprint', this.__read_more_onAfterPrint);
                    window.addEventListener('hashchange', this.__read_more_onHashChange);
                },
                destroy() {
                    var _a;
                    (_a = this.__read_more_cancelFirstLayout) === null || _a === void 0 ? void 0 : _a.call(this);
                    for (const rafId of this.__read_more_rafIds) {
                        cancelAnimationFrame(rafId);
                    }
                    this.__read_more_rafIds = [];
                    window.removeEventListener('beforeprint', this.__read_more_onBeforePrint);
                    window.removeEventListener('afterprint', this.__read_more_onAfterPrint);
                    window.removeEventListener('hashchange', this.__read_more_onHashChange);
                },
                __read_more_onBeforePrint() {
                    this.__read_more_wasExpandedBeforePrint = this.__read_more_isExpanded;
                    this.__read_more_expand({ animate: false });
                },
                __read_more_onAfterPrint() {
                    if (!this.__read_more_wasExpandedBeforePrint) {
                        this.__read_more_collapse();
                    }
                },
                __read_more_onHashChange() {
                    this.__read_more_expandIfHashTarget();
                },
                __read_more_expandIfHashTarget() {
                    if (hashTargetIsInside(this.$el)) {
                        this.__read_more_expand({ animate: false });
                    }
                },
                __read_more_expand(options = {}) {
                    if (this.__read_more_isExpanded)
                        return;
                    this.__read_more_skipAnimation = options.animate === false;
                    this.__read_more_isExpanded = true;
                },
                __read_more_collapse() {
                    if (!this.__read_more_isExpanded)
                        return;
                    this.__read_more_isExpanded = false;
                    this.$el.style.height = '';
                    this.$el.style.transition = '';
                },
                __read_more_syncContentHidden() {
                    const contentEl = this.__read_more_contentEl;
                    if (!contentEl)
                        return;
                    Alpine.mutateDom(() => {
                        if (this.__read_more_isExpanded) {
                            contentEl.removeAttribute('hidden');
                        }
                        else {
                            contentEl.setAttribute('hidden', 'until-found');
                        }
                    });
                },
                __read_more_animateExpand() {
                    const collapsedHeight = this.__read_more_collapsedHeight;
                    if (collapsedHeight == null)
                        return;
                    const el = this.$el;
                    const transition = this.__read_more_transition;
                    const outerRaf = requestAnimationFrame(() => {
                        const expandedHeight = el.clientHeight;
                        el.style.height = `${collapsedHeight}px`;
                        el.style.transition = 'transform 0ms';
                        const innerRaf = requestAnimationFrame(() => {
                            el.style.height = `${expandedHeight}px`;
                            el.style.transition = transition;
                        });
                        this.__read_more_rafIds.push(innerRaf);
                    });
                    this.__read_more_rafIds.push(outerRaf);
                },
            };
        },
        '@focusin'() {
            this.__read_more_expand();
        },
    });
}
/**
 * True when the URL hash (or `:target`) points at a node inside `root`.
 * Ignores text-fragment hashes (`#:~:text=`), which use `beforematch` instead.
 */
function hashTargetIsInside(root) {
    var _a, _b;
    const hash = window.location.hash;
    if (!hash || hash === '#' || hash.startsWith('#:~:')) {
        return root.querySelector(':target') != null;
    }
    const rawId = (_b = (_a = hash.slice(1).split('&')[0]) === null || _a === void 0 ? void 0 : _a.split(':~:')[0]) !== null && _b !== void 0 ? _b : '';
    if (!rawId) {
        return root.querySelector(':target') != null;
    }
    let target = null;
    try {
        const id = decodeURIComponent(rawId);
        target = document.getElementById(id);
    }
    catch (_c) {
        target = null;
    }
    if (target && root.contains(target)) {
        return true;
    }
    return root.querySelector(':target') != null;
}
