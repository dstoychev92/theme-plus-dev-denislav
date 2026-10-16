
/*
* @license
* ANALOG Theme (c) Groupthought Themes
*
* This file is included for advanced development by
* Shopify Agencies. Modified versions of the theme
* code are not supported by Shopify or Groupthought.
*
* Add any minor JS changes in assets/custom.js, this
* will make it easier to update the theme in the future.
*
*/

import Alpine from "alpinejs";
import { focusable, isFocusable } from "tabbable";

//#region \0rollup-plugin-inject-process-env
(function() {
	const env = {};
	try {
		if (process) {
			process.env = Object.assign({}, process.env);
			Object.assign(process.env, env);
			return;
		}
	} catch (e) {}
	globalThis.process = { env };
})();

//#endregion
//#region ../../packages/assembly-ui/dist/utils/layout-measure.js
/**
* Helpers for reading layout without forcing synchronous reflows.
*
* A frame renders in this order: rAF callbacks → style/layout → ResizeObserver
* callbacks → paint. Reading geometry while style is dirty (microtask flushes, rAF
* callbacks) forces a synchronous reflow. Two clean read points exist:
*
* - **ResizeObserver callbacks** — layout just ran, so reads are free, and style writes
*   still land in the same frame's paint (no flash). Use `onFirstLayout` for one-off
*   "measure, then apply initial styles" work, and `x-resize` for ongoing size tracking.
* - **After paint** — `afterNextPaint` / `readLayoutAfterPaint` run in a task right after
*   the frame commits. Reads are free, but writes render one frame later; never use them
*   to apply initial visual state (it flashes). Use them to yield until pending DOM
*   mutations have rendered (e.g. measure → mutate → measure loops).
*
* All `afterNextPaint`/`readLayoutAfterPaint` callbacks scheduled in the same frame share
* a single flush with reads running first, so batched reads never interleave with
* batched writes.
*/
let pendingReads = [];
let pendingCallbacks = [];
let flushScheduled = false;
function flushAfterPaint() {
	flushScheduled = false;
	const reads = pendingReads;
	const callbacks = pendingCallbacks;
	pendingReads = [];
	pendingCallbacks = [];
	for (const entry of reads) if (!entry.cancelled) entry.fn();
	for (const entry of callbacks) if (!entry.cancelled) entry.fn();
}
function scheduleFlushAfterPaint() {
	if (flushScheduled) return;
	flushScheduled = true;
	if (document.visibilityState === "hidden") setTimeout(flushAfterPaint, 0);
	else requestAnimationFrame(() => setTimeout(flushAfterPaint, 0));
}
/**
* Runs `fn` after the next paint. Returns a cancel function.
*
* Layout is clean at this point, so geometry reads are free — but style writes here
* render one frame later than writes made in a rAF. Prefer `onFirstLayout` when the
* callback applies initial visual state.
*/
function afterNextPaint(fn) {
	const entry = {
		fn,
		cancelled: false
	};
	pendingCallbacks.push(entry);
	scheduleFlushAfterPaint();
	return () => {
		entry.cancelled = true;
	};
}
/**
* Runs the read callback after the next paint, before any `afterNextPaint` callbacks
* from the same frame, so batched reads can't interleave with batched writes.
*/
function readLayoutAfterPaint(fn) {
	return new Promise((resolve) => {
		pendingReads.push({
			fn: () => resolve(fn()),
			cancelled: false
		});
		scheduleFlushAfterPaint();
	});
}

//#endregion
//#region ../../packages/assembly-ui/dist/utils/error.js
/**
* Logs a clear, actionable console error when a Method UI directive is used
* without a parent directive it depends on.
*
* Many directives only work when nested inside a parent directive that sets up
* shared state on the Alpine scope (e.g. `x-overflow:start` needs an ancestor
* `x-overflow`). When that parent is missing, the raw failure is an inscrutable
* `this.__foo is not a function`. Call this instead so users get a message that
* explains what to do.
*
* @param childDirective - The directive being used, e.g. `'x-overflow:start'`.
* @param parentDirective - The parent directive required, e.g. `'x-overflow'`.
* @param el - The element the child directive is on, logged for context.
*
* @example
* ```ts
* if (typeof this.__overflow_registerBoundary !== 'function') {
*   warnMissingParentDirective(`x-overflow:${value}`, 'x-overflow', $el);
*   return;
* }
* ```
*/
function warnMissingParentDirective(childDirective, parentDirective, el) {
	console.error(`Cannot use ${childDirective} without a parent element having ${parentDirective}.`, el);
}

//#endregion
//#region ../../packages/assembly-ui/dist/utils/modifiers/base.js
/**
* Returns the token that follows a directive modifier name.
*
* @example
* getModifierValue(['speed', '60'], 'speed');
* // => '60'
*/
function getModifierValue(modifiers, modifierName) {
	var _a;
	const modifierIndex = modifiers.indexOf(modifierName);
	if (modifierIndex === -1) return null;
	return (_a = modifiers[modifierIndex + 1]) !== null && _a !== void 0 ? _a : null;
}
/**
* Returns a numeric modifier value when it can be parsed as a finite number.
*
* @example
* getNumberModifierValue(['speed', '-60'], 'speed');
* // => -60
*/
function getNumberModifierValue(modifiers, modifierName) {
	const rawModifierValue = getModifierValue(modifiers, modifierName);
	if (rawModifierValue == null) return null;
	const parsedModifierValue = Number(rawModifierValue);
	if (!Number.isFinite(parsedModifierValue)) return null;
	return parsedModifierValue;
}

//#endregion
//#region ../../packages/assembly-ui/dist/utils/device.js
function isReducedMotion() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

//#endregion
//#region ../../packages/assembly-ui/dist/alpine/marquee.js
const DEFAULT_SPEED = 60;
const DEFAULT_ATTRIBUTE_BLACKLIST = ["id"];
const VIEWPORT_RESIZE_DEBOUNCE_MS = 100;
/**
* This plugin provides a smoothly scrolling marquee effect by translating two matching rows:
* the original "source" row and a cloned "target" row. The target starts immediately after the
* source, so as the source scrolls away the target takes its place and the animation can loop
* back around without a visible jump.
*
* The render flow is:
*  1. Measure the source and viewport.
*  2. If `.fill` is enabled, append sanitized source clones until the source row is wide enough.
*  3. Clone the finalized source row into the target row.
*  4. Start or refresh a Web Animations API animation on both rows.
*
* The movement itself is a plain looping `translateX(0%) → translateX(-100%)` transform
* animation created with `element.animate()`. The browser runs it on the compositor, so once a
* marquee is rendered there is zero per-frame JavaScript — no animation library, no rAF loop,
* no style writes from the main thread. Playback (pause, resume, jumping to a position) goes
* through the Animation objects the browser hands back.
*
* Inspired by: https://ryanmulligan.dev/blog/css-marquee/
*
* Modifiers:
*  - speed.X: Adjusts the scrolling pace (e.g., speed.60 sets 60px per second). Negative value scrolls backwards
*  - fill: Ensures content is repeated and appended until the visual area is completely covered.
*  - pause: Begins the marquee in a paused state, requiring a play action to begin moving.
*
* General usage:
*  1. Mark the scrolled content with x-marquee:source.
*  2. Provide an empty container with x-marquee:target, to receive the duplicated set of items.
*  3. Attach x-marquee to a parent element with optional modifiers like speed.X, fill, or pause.
*
* Programmatic control is available through $marquee: isPlaying, play(), pause(), toggle(),
* scrollTo(element) to jump the loop so an element sits at the visible left edge, isReady
* (true after the first render), and offsetValue (the raw Motion value that drives both rows).
*
* Accessibility: keyboard focus inside the marquee pauses it and scrolls the focused element
* into view; focus leaving resumes playback only if focus caused the pause. Clones are
* aria-hidden and removed from the tab order, and ids are stripped from them. With
* prefers-reduced-motion the rows do not animate, and the scroll modifier is also disabled
* on low-power devices.
*
* @example
*   <div x-data x-marquee.speed.60.fill>
*     <div x-marquee:source>
*       <span>First Item</span>
*       <span>Second Item</span>
*       <span>Third Item</span>
*     </div>
*     <div x-marquee:target aria-hidden="true"></div>
*   </div>
*
*/
function marquee_default(Alpine) {
	Alpine.directive("marquee", ($el, { value, modifiers }) => {
		var _a;
		if (value == "source") Alpine.bind($el, { "x-init"() {
			if (!this.__marquee_isRoot) {
				warnMissingParentDirective("x-marquee:source", "x-marquee", this.$el);
				return;
			}
			this.__marquee_sourceEl = this.$el;
		} });
		else if (value == "target") Alpine.bind($el, { "x-init"() {
			if (!this.__marquee_isRoot) {
				warnMissingParentDirective("x-marquee:target", "x-marquee", this.$el);
				return;
			}
			this.__marquee_targetEl = this.$el;
		} });
		else if (value == null) {
			const speed = (_a = getNumberModifierValue(modifiers, "speed")) !== null && _a !== void 0 ? _a : DEFAULT_SPEED;
			let fill = modifiers.includes("fill");
			let autoplay = !modifiers.includes("pause");
			Alpine.bind($el, {
				"x-data"() {
					return {
						__marquee_isRoot: true,
						__marquee_state: buildMarqueeState({ isPlaying: autoplay }),
						__marquee_isInitialized: false,
						__marquee_isActive: false,
						__marquee_isRendering: false,
						__marquee_wasPlayingBeforeKeyboardFocus: false,
						__marquee_sourceEl: null,
						__marquee_targetEl: null,
						__marquee_originalContentFragment: document.createDocumentFragment(),
						__marquee_originalContentWidth: 0,
						__marquee_sourceElWidth: 0,
						__marquee_viewportWidth: 0,
						__marquee_animations: [],
						__marquee_contentHasAlpineDirectives: false,
						__marquee_cancelAfterNextPaint: null,
						__marquee_afterNextPaintResolve: null,
						__marquee_renderFrameId: null,
						__marquee_isResizeMeasurementScheduled: false,
						__marquee_isDestroyed: false,
						__marquee_resetRenderingFrameId: null,
						__marquee_sentinel: null,
						__marquee_cancelInView: null,
						__marquee_measureWidths() {
							return readLayoutAfterPaint(() => {
								this.__marquee_originalContentWidth = this.__marquee_sourceEl.clientWidth;
								this.__marquee_sourceElWidth = this.__marquee_originalContentWidth;
								this.__marquee_viewportWidth = this.$el.clientWidth;
							});
						},
						get __marquee_animationDuration() {
							return this.__marquee_sourceElWidth / Math.abs(speed);
						},
						/**
						* Extends the source row itself for short content. The sentinel separates original
						* content from fill clones so later renders can delete only generated nodes.
						*/
						__marquee_fillSource() {
							return (async () => {
								if (this.__marquee_originalContentWidth === 0) await readLayoutAfterPaint(() => {
									this.__marquee_originalContentWidth = this.__marquee_sourceEl.clientWidth;
									this.__marquee_sourceElWidth = this.__marquee_originalContentWidth;
								});
								let needsWidthAfterDomChange = false;
								Alpine.mutateDom(() => {
									if (!this.__marquee_sentinel) {
										this.__marquee_sentinel = document.createComment("marquee-sentinel");
										this.__marquee_sourceEl.appendChild(this.__marquee_sentinel);
									} else {
										let next = this.__marquee_sentinel.nextSibling;
										while (next) {
											const toRemove = next;
											next = next.nextSibling;
											this.__marquee_sourceEl.removeChild(toRemove);
										}
										needsWidthAfterDomChange = true;
									}
								});
								if (needsWidthAfterDomChange) await readLayoutAfterPaint(() => {
									this.__marquee_originalContentWidth = this.__marquee_sourceEl.clientWidth;
									this.__marquee_sourceElWidth = this.__marquee_originalContentWidth;
								});
								const spaceToFill = Math.max(0, this.__marquee_viewportWidth - this.__marquee_originalContentWidth);
								if (spaceToFill === 0) return;
								if (!Number.isFinite(this.__marquee_originalContentWidth) || this.__marquee_originalContentWidth <= 0) return;
								const timesToClone = Math.ceil(spaceToFill / this.__marquee_originalContentWidth);
								if (!Number.isFinite(timesToClone) || timesToClone <= 0) return;
								const fragment = document.createDocumentFragment();
								for (let i = 0; i < timesToClone; i++) {
									const clone = this.__marquee_originalContentFragment.cloneNode(true);
									Array.from(clone.children).forEach((child) => prepareClonedSourceElement(child));
									fragment.appendChild(clone);
								}
								await new Promise((resolve) => {
									Alpine.mutateDom(() => {
										this.__marquee_sentinel.after(fragment);
										if (this.__marquee_contentHasAlpineDirectives) Alpine.skipDuringClone(() => Alpine.initTree(this.__marquee_sourceEl))();
										this.__marquee_afterNextPaintResolve = resolve;
										this.__marquee_cancelAfterNextPaint = afterNextPaint(() => {
											this.__marquee_cancelAfterNextPaint = null;
											this.__marquee_afterNextPaintResolve = null;
											this.__marquee_sourceElWidth = this.__marquee_sourceEl.clientWidth;
											resolve();
										});
									});
								});
							})();
						},
						__marquee_cloneSourceToTarget() {
							return new Promise((resolve) => {
								if (this.__marquee_sourceElWidth <= this.__marquee_viewportWidth) return resolve();
								Alpine.mutateDom(() => {
									const clone = this.__marquee_sourceEl.cloneNode(true);
									Array.from(clone.children).forEach((child) => prepareClonedTargetElement(child));
									this.__marquee_targetEl.replaceChildren(...clone.children);
									if (this.__marquee_contentHasAlpineDirectives) Alpine.skipDuringClone(() => Alpine.initTree(this.__marquee_targetEl))();
									resolve();
								});
							});
						},
						__marquee_setupAnimations() {
							var _a;
							const durationMs = this.__marquee_animationDuration * 1e3;
							if (!isFinite(durationMs) || durationMs <= 0) return;
							const shouldPlay = this.__marquee_state.isPlaying && this.__marquee_sourceElWidth > this.__marquee_viewportWidth;
							let loopProgress = 0;
							const previousAnimation = this.__marquee_animations[0];
							if (previousAnimation) {
								const previousTime = previousAnimation.currentTime;
								const previousDuration = (_a = previousAnimation.effect) === null || _a === void 0 ? void 0 : _a.getTiming().duration;
								if (typeof previousTime === "number" && typeof previousDuration === "number" && previousDuration > 0) loopProgress = (previousTime / previousDuration % 1 + 1) % 1;
							}
							this.__marquee_cancelAnimations();
							const keyframes = [{ transform: "translateX(0%)" }, { transform: "translateX(-100%)" }];
							const options = {
								duration: durationMs,
								iterations: Infinity,
								easing: "linear",
								direction: speed < 0 ? "reverse" : "normal"
							};
							this.__marquee_animations = [this.__marquee_sourceEl, this.__marquee_targetEl].map((rowEl) => {
								const animation = rowEl.animate(keyframes, options);
								animation.currentTime = loopProgress * durationMs;
								if (!shouldPlay) animation.pause();
								return animation;
							});
						},
						__marquee_cancelAnimations() {
							for (const animation of this.__marquee_animations) animation.cancel();
							this.__marquee_animations = [];
						},
						__marquee_scrollTo(element) {
							const durationMs = this.__marquee_animationDuration * 1e3;
							if (!isFinite(durationMs) || durationMs <= 0) return;
							let offset = element.offsetLeft;
							let leftSpacingBuffer = 24;
							if (speed < 0) {
								offset = this.__marquee_sourceElWidth - offset;
								leftSpacingBuffer = leftSpacingBuffer * -1;
							}
							const elementPositionTime = (offset - leftSpacingBuffer) / this.__marquee_sourceElWidth * durationMs;
							if (!isFinite(elementPositionTime)) return;
							const wrappedTime = (elementPositionTime % durationMs + durationMs) % durationMs;
							for (const animation of this.__marquee_animations) animation.currentTime = wrappedTime;
						},
						async __marquee_render() {
							if (!this.__marquee_isActive) return;
							if (this.__marquee_isRendering) return;
							try {
								this.__marquee_isRendering = true;
								await this.__marquee_measureWidths();
								if (fill) await this.__marquee_fillSource();
								await this.__marquee_cloneSourceToTarget();
								if (!isReducedMotion()) this.__marquee_setupAnimations();
								this.__marquee_isInitialized = true;
								this.__marquee_resetRenderingFrameId = window.requestAnimationFrame(() => {
									this.__marquee_resetRenderingFrameId = null;
									this.__marquee_isRendering = false;
								});
							} finally {
								this.__marquee_isRendering = false;
							}
						},
						__marquee_updateViewportWidth() {
							if (this.__marquee_isResizeMeasurementScheduled) return;
							this.__marquee_isResizeMeasurementScheduled = true;
							readLayoutAfterPaint(() => {
								this.__marquee_isResizeMeasurementScheduled = false;
								if (this.__marquee_isDestroyed) return null;
								return this.$el.clientWidth;
							}).then((viewportWidth) => {
								if (viewportWidth == null || this.__marquee_isDestroyed) return;
								if (this.__marquee_isInitialized && viewportWidth === this.__marquee_viewportWidth) return;
								this.__marquee_viewportWidth = viewportWidth;
								this.__marquee_render();
							});
						},
						__marquee_pauseForKeyboardFocus(target) {
							if (!(target instanceof HTMLElement)) return;
							this.__marquee_wasPlayingBeforeKeyboardFocus = this.__marquee_state.isPlaying;
							this.__marquee_state.pause();
							this.__marquee_scrollTo(target);
						},
						__marquee_resumeAfterKeyboardFocus() {
							if (!this.__marquee_wasPlayingBeforeKeyboardFocus) return;
							this.__marquee_wasPlayingBeforeKeyboardFocus = false;
							this.__marquee_state.play();
						},
						__marquee_teardown() {
							this.__marquee_cancelAnimations();
							this.__marquee_isInitialized = false;
						},
						init() {
							this.$nextTick(() => {
								if (this.__marquee_sourceEl == null) throw new Error("Source element not found, x-marquee:source must be applied to a child element of the x-marquee directive");
								if (this.__marquee_targetEl == null) throw new Error("Target element not found, x-marquee:target must be applied to a child element of the x-marquee directive");
								this.__marquee_targetEl.setAttribute("aria-hidden", "true");
								Array.from(this.__marquee_sourceEl.children).forEach((element) => {
									const clone = element.cloneNode(true);
									removeBlacklistedAttributes(clone);
									this.__marquee_originalContentFragment.append(clone);
								});
								this.__marquee_contentHasAlpineDirectives = hasAlpineDirectives(this.__marquee_originalContentFragment);
								const observer = new IntersectionObserver((entries) => {
									for (const entry of entries) if (entry.isIntersecting) {
										if (this.__marquee_isActive) continue;
										this.__marquee_isActive = true;
										if (this.__marquee_renderFrameId !== null) cancelAnimationFrame(this.__marquee_renderFrameId);
										this.__marquee_renderFrameId = window.requestAnimationFrame(() => {
											this.__marquee_renderFrameId = null;
											if (!this.__marquee_isActive) return;
											this.__marquee_render();
										});
									} else if (this.__marquee_isActive) {
										if (this.__marquee_renderFrameId !== null) {
											cancelAnimationFrame(this.__marquee_renderFrameId);
											this.__marquee_renderFrameId = null;
										}
										this.__marquee_isActive = false;
										this.__marquee_teardown();
									}
								});
								observer.observe(this.$el);
								this.__marquee_cancelInView = () => observer.disconnect();
							});
							this.$watch("__marquee_state.isPlaying", (playing) => {
								for (const animation of this.__marquee_animations) if (playing) animation.play();
								else animation.pause();
							});
						},
						destroy() {
							var _a, _b, _c, _d, _e;
							this.__marquee_isDestroyed = true;
							(_a = this.__marquee_cancelInView) === null || _a === void 0 || _a.call(this);
							(_b = this.__marquee_cancelAfterNextPaint) === null || _b === void 0 || _b.call(this);
							this.__marquee_cancelAfterNextPaint = null;
							(_c = this.__marquee_afterNextPaintResolve) === null || _c === void 0 || _c.call(this);
							this.__marquee_afterNextPaintResolve = null;
							if (this.__marquee_renderFrameId !== null) {
								cancelAnimationFrame(this.__marquee_renderFrameId);
								this.__marquee_renderFrameId = null;
							}
							if (this.__marquee_resetRenderingFrameId !== null) {
								cancelAnimationFrame(this.__marquee_resetRenderingFrameId);
								this.__marquee_resetRenderingFrameId = null;
							}
							this.__marquee_cancelAnimations();
							(_d = this.__marquee_sourceEl) === null || _d === void 0 || _d.replaceChildren(this.__marquee_originalContentFragment);
							this.__marquee_originalContentFragment = document.createDocumentFragment();
							(_e = this.__marquee_sentinel) === null || _e === void 0 || _e.remove();
						}
					};
				},
				"@focusin": "__marquee_pauseForKeyboardFocus($event.target)",
				"@focusout": "__marquee_resumeAfterKeyboardFocus()",
				"x-resize.document": Alpine.debounce(function() {
					this.__marquee_updateViewportWidth();
				}, VIEWPORT_RESIZE_DEBOUNCE_MS)
			});
		} else throw new Error(`Unknown directive: x-marquee:${value}`);
	}).before("bind");
	Alpine.magic("marquee", ($el) => {
		const $data = Alpine.$data($el);
		return {
			get isPlaying() {
				var _a;
				return (_a = $data.__marquee_state) === null || _a === void 0 ? void 0 : _a.isPlaying;
			},
			play() {
				var _a;
				(_a = $data.__marquee_state) === null || _a === void 0 || _a.play();
			},
			pause() {
				var _a;
				(_a = $data.__marquee_state) === null || _a === void 0 || _a.pause();
			},
			toggle() {
				var _a;
				(_a = $data.__marquee_state) === null || _a === void 0 || _a.toggle();
			},
			scrollTo(element) {
				var _a;
				(_a = $data.__marquee_scrollTo) === null || _a === void 0 || _a.call($data, element);
			},
			get isReady() {
				return $data.__marquee_isInitialized;
			}
		};
	});
}
function buildMarqueeState(options) {
	var _a;
	return {
		isPlaying: (_a = options === null || options === void 0 ? void 0 : options.isPlaying) !== null && _a !== void 0 ? _a : false,
		play() {
			this.isPlaying = true;
		},
		pause() {
			this.isPlaying = false;
		},
		toggle() {
			this.isPlaying = !this.isPlaying;
		}
	};
}
/**
* True when any element in the content carries something Alpine would need to
* initialize: an `x-` directive, a `:`/`@` shorthand binding, or a lazy-Alpine marker.
*
* Most marquee content is plain markup — logos, text, links — and initializing Alpine on
* every clone of it is the most expensive part of a render, for nothing. Checked once on
* the authored content, so each render can skip that work outright.
*/
function hasAlpineDirectives(content) {
	for (const element of content.querySelectorAll("*")) {
		if (element.hasAttribute("data-lazy-alpine")) return true;
		for (const attribute of element.attributes) {
			const name = attribute.name;
			if (name.startsWith("x-") || name.startsWith(":") || name.startsWith("@")) return true;
		}
	}
	return false;
}
function prepareClonedSourceElement(element) {
	element.setAttribute("aria-hidden", "true");
	removeClonedElementFromTabOrder(element);
}
function prepareClonedTargetElement(element) {
	removeBlacklistedAttributes(element);
	removeClonedElementFromTabOrder(element);
}
function removeBlacklistedAttributes(element) {
	for (const blacklistedAttribute of DEFAULT_ATTRIBUTE_BLACKLIST) {
		element.removeAttribute(blacklistedAttribute);
		element.querySelectorAll(`[${blacklistedAttribute}]`).forEach((descendant) => {
			descendant.removeAttribute(blacklistedAttribute);
		});
	}
}
function removeClonedElementFromTabOrder(element) {
	if (isFocusable(element, { displayCheck: "none" })) element.setAttribute("tabindex", "-1");
	focusable(element, { displayCheck: "none" }).forEach((focusableElement) => {
		focusableElement.setAttribute("tabindex", "-1");
	});
}

//#endregion
//#region src/js/theme.marquee.ts
Alpine.plugin(marquee_default);

//#endregion
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUubWFycXVlZS5qcyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyIuLi8uLi8uLi9wYWNrYWdlcy9hc3NlbWJseS11aS9kaXN0L3V0aWxzL2xheW91dC1tZWFzdXJlLmpzIiwiLi4vLi4vLi4vcGFja2FnZXMvYXNzZW1ibHktdWkvZGlzdC91dGlscy9lcnJvci5qcyIsIi4uLy4uLy4uL3BhY2thZ2VzL2Fzc2VtYmx5LXVpL2Rpc3QvdXRpbHMvbW9kaWZpZXJzL2Jhc2UuanMiLCIuLi8uLi8uLi9wYWNrYWdlcy9hc3NlbWJseS11aS9kaXN0L3V0aWxzL2RldmljZS5qcyIsIi4uLy4uLy4uL3BhY2thZ2VzL2Fzc2VtYmx5LXVpL2Rpc3QvYWxwaW5lL21hcnF1ZWUuanMiLCIuLi9zcmMvanMvdGhlbWUubWFycXVlZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEhlbHBlcnMgZm9yIHJlYWRpbmcgbGF5b3V0IHdpdGhvdXQgZm9yY2luZyBzeW5jaHJvbm91cyByZWZsb3dzLlxuICpcbiAqIEEgZnJhbWUgcmVuZGVycyBpbiB0aGlzIG9yZGVyOiByQUYgY2FsbGJhY2tzIOKGkiBzdHlsZS9sYXlvdXQg4oaSIFJlc2l6ZU9ic2VydmVyXG4gKiBjYWxsYmFja3Mg4oaSIHBhaW50LiBSZWFkaW5nIGdlb21ldHJ5IHdoaWxlIHN0eWxlIGlzIGRpcnR5IChtaWNyb3Rhc2sgZmx1c2hlcywgckFGXG4gKiBjYWxsYmFja3MpIGZvcmNlcyBhIHN5bmNocm9ub3VzIHJlZmxvdy4gVHdvIGNsZWFuIHJlYWQgcG9pbnRzIGV4aXN0OlxuICpcbiAqIC0gKipSZXNpemVPYnNlcnZlciBjYWxsYmFja3MqKiDigJQgbGF5b3V0IGp1c3QgcmFuLCBzbyByZWFkcyBhcmUgZnJlZSwgYW5kIHN0eWxlIHdyaXRlc1xuICogICBzdGlsbCBsYW5kIGluIHRoZSBzYW1lIGZyYW1lJ3MgcGFpbnQgKG5vIGZsYXNoKS4gVXNlIGBvbkZpcnN0TGF5b3V0YCBmb3Igb25lLW9mZlxuICogICBcIm1lYXN1cmUsIHRoZW4gYXBwbHkgaW5pdGlhbCBzdHlsZXNcIiB3b3JrLCBhbmQgYHgtcmVzaXplYCBmb3Igb25nb2luZyBzaXplIHRyYWNraW5nLlxuICogLSAqKkFmdGVyIHBhaW50Kiog4oCUIGBhZnRlck5leHRQYWludGAgLyBgcmVhZExheW91dEFmdGVyUGFpbnRgIHJ1biBpbiBhIHRhc2sgcmlnaHQgYWZ0ZXJcbiAqICAgdGhlIGZyYW1lIGNvbW1pdHMuIFJlYWRzIGFyZSBmcmVlLCBidXQgd3JpdGVzIHJlbmRlciBvbmUgZnJhbWUgbGF0ZXI7IG5ldmVyIHVzZSB0aGVtXG4gKiAgIHRvIGFwcGx5IGluaXRpYWwgdmlzdWFsIHN0YXRlIChpdCBmbGFzaGVzKS4gVXNlIHRoZW0gdG8geWllbGQgdW50aWwgcGVuZGluZyBET01cbiAqICAgbXV0YXRpb25zIGhhdmUgcmVuZGVyZWQgKGUuZy4gbWVhc3VyZSDihpIgbXV0YXRlIOKGkiBtZWFzdXJlIGxvb3BzKS5cbiAqXG4gKiBBbGwgYGFmdGVyTmV4dFBhaW50YC9gcmVhZExheW91dEFmdGVyUGFpbnRgIGNhbGxiYWNrcyBzY2hlZHVsZWQgaW4gdGhlIHNhbWUgZnJhbWUgc2hhcmVcbiAqIGEgc2luZ2xlIGZsdXNoIHdpdGggcmVhZHMgcnVubmluZyBmaXJzdCwgc28gYmF0Y2hlZCByZWFkcyBuZXZlciBpbnRlcmxlYXZlIHdpdGhcbiAqIGJhdGNoZWQgd3JpdGVzLlxuICovXG5sZXQgcGVuZGluZ1JlYWRzID0gW107XG5sZXQgcGVuZGluZ0NhbGxiYWNrcyA9IFtdO1xubGV0IGZsdXNoU2NoZWR1bGVkID0gZmFsc2U7XG5mdW5jdGlvbiBmbHVzaEFmdGVyUGFpbnQoKSB7XG4gICAgZmx1c2hTY2hlZHVsZWQgPSBmYWxzZTtcbiAgICBjb25zdCByZWFkcyA9IHBlbmRpbmdSZWFkcztcbiAgICBjb25zdCBjYWxsYmFja3MgPSBwZW5kaW5nQ2FsbGJhY2tzO1xuICAgIHBlbmRpbmdSZWFkcyA9IFtdO1xuICAgIHBlbmRpbmdDYWxsYmFja3MgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHJlYWRzKSB7XG4gICAgICAgIGlmICghZW50cnkuY2FuY2VsbGVkKVxuICAgICAgICAgICAgZW50cnkuZm4oKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBjYWxsYmFja3MpIHtcbiAgICAgICAgaWYgKCFlbnRyeS5jYW5jZWxsZWQpXG4gICAgICAgICAgICBlbnRyeS5mbigpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNjaGVkdWxlRmx1c2hBZnRlclBhaW50KCkge1xuICAgIGlmIChmbHVzaFNjaGVkdWxlZClcbiAgICAgICAgcmV0dXJuO1xuICAgIGZsdXNoU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAnaGlkZGVuJykge1xuICAgICAgICAvLyBIaWRkZW4gZG9jdW1lbnRzIGRvbid0IHBhaW50LCBzbyByQUYgd291bGQgc3RhbGwgaW5kZWZpbml0ZWx5LlxuICAgICAgICBzZXRUaW1lb3V0KGZsdXNoQWZ0ZXJQYWludCwgMCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyByQUYgYWxvbmUgcnVucyAqYmVmb3JlKiBzdHlsZS9sYXlvdXQvcGFpbnQ7IGEgdGFzayBzY2hlZHVsZWQgZnJvbSBpbnNpZGUgaXQgcnVuc1xuICAgICAgICAvLyByaWdodCBhZnRlciB0aGUgZnJhbWUgY29tbWl0cyDigJQgdGhlIGVhcmxpZXN0IHBvaW50IHdoZXJlIGxheW91dCBpcyBjbGVhbi5cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHNldFRpbWVvdXQoZmx1c2hBZnRlclBhaW50LCAwKSk7XG4gICAgfVxufVxuLyoqXG4gKiBSdW5zIGBmbmAgYWZ0ZXIgdGhlIG5leHQgcGFpbnQuIFJldHVybnMgYSBjYW5jZWwgZnVuY3Rpb24uXG4gKlxuICogTGF5b3V0IGlzIGNsZWFuIGF0IHRoaXMgcG9pbnQsIHNvIGdlb21ldHJ5IHJlYWRzIGFyZSBmcmVlIOKAlCBidXQgc3R5bGUgd3JpdGVzIGhlcmVcbiAqIHJlbmRlciBvbmUgZnJhbWUgbGF0ZXIgdGhhbiB3cml0ZXMgbWFkZSBpbiBhIHJBRi4gUHJlZmVyIGBvbkZpcnN0TGF5b3V0YCB3aGVuIHRoZVxuICogY2FsbGJhY2sgYXBwbGllcyBpbml0aWFsIHZpc3VhbCBzdGF0ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFmdGVyTmV4dFBhaW50KGZuKSB7XG4gICAgY29uc3QgZW50cnkgPSB7IGZuLCBjYW5jZWxsZWQ6IGZhbHNlIH07XG4gICAgcGVuZGluZ0NhbGxiYWNrcy5wdXNoKGVudHJ5KTtcbiAgICBzY2hlZHVsZUZsdXNoQWZ0ZXJQYWludCgpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGVudHJ5LmNhbmNlbGxlZCA9IHRydWU7XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZnRlck5leHRQYWludEFzeW5jKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBhZnRlck5leHRQYWludChyZXNvbHZlKTtcbiAgICB9KTtcbn1cbi8qKlxuICogUnVucyB0aGUgcmVhZCBjYWxsYmFjayBhZnRlciB0aGUgbmV4dCBwYWludCwgYmVmb3JlIGFueSBgYWZ0ZXJOZXh0UGFpbnRgIGNhbGxiYWNrc1xuICogZnJvbSB0aGUgc2FtZSBmcmFtZSwgc28gYmF0Y2hlZCByZWFkcyBjYW4ndCBpbnRlcmxlYXZlIHdpdGggYmF0Y2hlZCB3cml0ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWFkTGF5b3V0QWZ0ZXJQYWludChmbikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBwZW5kaW5nUmVhZHMucHVzaCh7IGZuOiAoKSA9PiByZXNvbHZlKGZuKCkpLCBjYW5jZWxsZWQ6IGZhbHNlIH0pO1xuICAgICAgICBzY2hlZHVsZUZsdXNoQWZ0ZXJQYWludCgpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBSdW5zIGBmbmAgb25jZSB0aGUgZWxlbWVudCBoYXMgYSBsYXlvdXQgYm94LCBpbnNpZGUgYSBSZXNpemVPYnNlcnZlciBjYWxsYmFjazpcbiAqIGFmdGVyIGxheW91dCAocmVhZHMgYXJlIGZyZWUg4oCUIG5vIGZvcmNlZCByZWZsb3cpIGJ1dCBiZWZvcmUgcGFpbnQgKHN0eWxlIHdyaXRlc1xuICogc3RpbGwgbGFuZCBpbiB0aGlzIGZyYW1lIOKAlCBubyBmbGFzaCBvZiB1bnN0eWxlZCBzdGF0ZSkuXG4gKlxuICogRm9yIGFuIGVsZW1lbnQgdGhhdCBpcyByZW5kZXJlZCB3aGVuIGNhbGxlZCwgdGhpcyBmaXJlcyBkdXJpbmcgdGhlIGN1cnJlbnQgZnJhbWUnc1xuICogcmVuZGVyaW5nIHN0ZXBzLiBGb3IgYSBgZGlzcGxheTogbm9uZWAgZWxlbWVudCwgaXQgZmlyZXMgd2hlbiB0aGUgZWxlbWVudCBmaXJzdFxuICogZ2V0cyBhIGJveCDigJQgc28gbWVhc3VyZW1lbnRzIGFyZSBuZXZlciBhIG1lYW5pbmdsZXNzIDDDlzAuIFJldHVybnMgYSBjYW5jZWwgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvbkZpcnN0TGF5b3V0KGVsLCBmbikge1xuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKChlbnRyaWVzKSA9PiB7XG4gICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgZm4oZW50cmllc1swXSk7XG4gICAgfSk7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbCk7XG4gICAgcmV0dXJuICgpID0+IG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbn1cbiIsIi8qKlxuICogTG9ncyBhIGNsZWFyLCBhY3Rpb25hYmxlIGNvbnNvbGUgZXJyb3Igd2hlbiBhIE1ldGhvZCBVSSBkaXJlY3RpdmUgaXMgdXNlZFxuICogd2l0aG91dCBhIHBhcmVudCBkaXJlY3RpdmUgaXQgZGVwZW5kcyBvbi5cbiAqXG4gKiBNYW55IGRpcmVjdGl2ZXMgb25seSB3b3JrIHdoZW4gbmVzdGVkIGluc2lkZSBhIHBhcmVudCBkaXJlY3RpdmUgdGhhdCBzZXRzIHVwXG4gKiBzaGFyZWQgc3RhdGUgb24gdGhlIEFscGluZSBzY29wZSAoZS5nLiBgeC1vdmVyZmxvdzpzdGFydGAgbmVlZHMgYW4gYW5jZXN0b3JcbiAqIGB4LW92ZXJmbG93YCkuIFdoZW4gdGhhdCBwYXJlbnQgaXMgbWlzc2luZywgdGhlIHJhdyBmYWlsdXJlIGlzIGFuIGluc2NydXRhYmxlXG4gKiBgdGhpcy5fX2ZvbyBpcyBub3QgYSBmdW5jdGlvbmAuIENhbGwgdGhpcyBpbnN0ZWFkIHNvIHVzZXJzIGdldCBhIG1lc3NhZ2UgdGhhdFxuICogZXhwbGFpbnMgd2hhdCB0byBkby5cbiAqXG4gKiBAcGFyYW0gY2hpbGREaXJlY3RpdmUgLSBUaGUgZGlyZWN0aXZlIGJlaW5nIHVzZWQsIGUuZy4gYCd4LW92ZXJmbG93OnN0YXJ0J2AuXG4gKiBAcGFyYW0gcGFyZW50RGlyZWN0aXZlIC0gVGhlIHBhcmVudCBkaXJlY3RpdmUgcmVxdWlyZWQsIGUuZy4gYCd4LW92ZXJmbG93J2AuXG4gKiBAcGFyYW0gZWwgLSBUaGUgZWxlbWVudCB0aGUgY2hpbGQgZGlyZWN0aXZlIGlzIG9uLCBsb2dnZWQgZm9yIGNvbnRleHQuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYHRzXG4gKiBpZiAodHlwZW9mIHRoaXMuX19vdmVyZmxvd19yZWdpc3RlckJvdW5kYXJ5ICE9PSAnZnVuY3Rpb24nKSB7XG4gKiAgIHdhcm5NaXNzaW5nUGFyZW50RGlyZWN0aXZlKGB4LW92ZXJmbG93OiR7dmFsdWV9YCwgJ3gtb3ZlcmZsb3cnLCAkZWwpO1xuICogICByZXR1cm47XG4gKiB9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdhcm5NaXNzaW5nUGFyZW50RGlyZWN0aXZlKGNoaWxkRGlyZWN0aXZlLCBwYXJlbnREaXJlY3RpdmUsIGVsKSB7XG4gICAgY29uc29sZS5lcnJvcihgQ2Fubm90IHVzZSAke2NoaWxkRGlyZWN0aXZlfSB3aXRob3V0IGEgcGFyZW50IGVsZW1lbnQgaGF2aW5nICR7cGFyZW50RGlyZWN0aXZlfS5gLCBlbCk7XG59XG5leHBvcnQgZnVuY3Rpb24gcHJldHR5UHJpbnRFcnJvcihlcnIpIHtcbiAgICBsZXQgb3V0cHV0ID0gJyc7XG4gICAgaWYgKHR5cGVvZiBlcnIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG91dHB1dCA9IGVycjtcbiAgICB9XG4gICAgZWxzZSBpZiAoZXJyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgb3V0cHV0ID0gZXJyLm1lc3NhZ2U7XG4gICAgfVxuICAgIGVsc2UgaWYgKGVyciAmJiB0eXBlb2YgZXJyLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG91dHB1dCA9IGVyci50b1N0cmluZygpO1xuICAgIH1cbiAgICBlbHNlIGlmIChlcnIgJiYgdHlwZW9mIGVyci5tZXNzYWdlID09PSAnc3RyaW5nJykge1xuICAgICAgICBvdXRwdXQgPSBlcnIubWVzc2FnZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG91dHB1dCA9ICdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkLic7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG59XG4iLCIvKipcbiAqIFJldHVybnMgdGhlIHRva2VuIHRoYXQgZm9sbG93cyBhIGRpcmVjdGl2ZSBtb2RpZmllciBuYW1lLlxuICpcbiAqIEBleGFtcGxlXG4gKiBnZXRNb2RpZmllclZhbHVlKFsnc3BlZWQnLCAnNjAnXSwgJ3NwZWVkJyk7XG4gKiAvLyA9PiAnNjAnXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IG1vZGlmaWVySW5kZXggPSBtb2RpZmllcnMuaW5kZXhPZihtb2RpZmllck5hbWUpO1xuICAgIGlmIChtb2RpZmllckluZGV4ID09PSAtMSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIChfYSA9IG1vZGlmaWVyc1ttb2RpZmllckluZGV4ICsgMV0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG51bGw7XG59XG4vKipcbiAqIFJldHVybnMgYSBudW1lcmljIG1vZGlmaWVyIHZhbHVlIHdoZW4gaXQgY2FuIGJlIHBhcnNlZCBhcyBhIGZpbml0ZSBudW1iZXIuXG4gKlxuICogQGV4YW1wbGVcbiAqIGdldE51bWJlck1vZGlmaWVyVmFsdWUoWydzcGVlZCcsICctNjAnXSwgJ3NwZWVkJyk7XG4gKiAvLyA9PiAtNjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE51bWJlck1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpIHtcbiAgICBjb25zdCByYXdNb2RpZmllclZhbHVlID0gZ2V0TW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIG1vZGlmaWVyTmFtZSk7XG4gICAgaWYgKHJhd01vZGlmaWVyVmFsdWUgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgcGFyc2VkTW9kaWZpZXJWYWx1ZSA9IE51bWJlcihyYXdNb2RpZmllclZhbHVlKTtcbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShwYXJzZWRNb2RpZmllclZhbHVlKSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHBhcnNlZE1vZGlmaWVyVmFsdWU7XG59XG4vKipcbiAqIFJldHVybnMgYSBwb3NpdGl2ZSBudW1lcmljIG1vZGlmaWVyIHZhbHVlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBnZXRQb3NpdGl2ZU51bWJlck1vZGlmaWVyVmFsdWUoWydzdGlmZm5lc3MnLCAnMjQwJ10sICdzdGlmZm5lc3MnKTtcbiAqIC8vID0+IDI0MFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UG9zaXRpdmVOdW1iZXJNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKSB7XG4gICAgY29uc3QgcGFyc2VkTW9kaWZpZXJWYWx1ZSA9IGdldE51bWJlck1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpO1xuICAgIGlmIChwYXJzZWRNb2RpZmllclZhbHVlID09IG51bGwgfHwgcGFyc2VkTW9kaWZpZXJWYWx1ZSA8PSAwKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gcGFyc2VkTW9kaWZpZXJWYWx1ZTtcbn1cbi8qKlxuICogUmV0dXJucyBhbiBgbXNgIG1vZGlmaWVyIHZhbHVlIGFzIGEgbnVtYmVyLlxuICpcbiAqIEBleGFtcGxlXG4gKiBnZXRNaWxsaXNlY29uZHNNb2RpZmllclZhbHVlKFsnZHVyYXRpb24nLCAnNTAwbXMnXSwgJ2R1cmF0aW9uJyk7XG4gKiAvLyA9PiA1MDBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1pbGxpc2Vjb25kc01vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpIHtcbiAgICBjb25zdCByYXdNb2RpZmllclZhbHVlID0gZ2V0TW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIG1vZGlmaWVyTmFtZSk7XG4gICAgaWYgKHJhd01vZGlmaWVyVmFsdWUgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgbWlsbGlzZWNvbmRzTWF0Y2ggPSByYXdNb2RpZmllclZhbHVlLm1hdGNoKC9eKFswLTldKyltcyQvKTtcbiAgICBpZiAoIW1pbGxpc2Vjb25kc01hdGNoKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gTnVtYmVyKG1pbGxpc2Vjb25kc01hdGNoWzFdKTtcbn1cbi8qKlxuICogUmV0dXJucyBhIGAlYCBtb2RpZmllciB2YWx1ZSBhcyBhIG51bWJlci5cbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0UGVyY2VudGFnZU1vZGlmaWVyVmFsdWUoWydwcm9ncmVzcycsICc1MCUnXSwgJ3Byb2dyZXNzJyk7XG4gKiAvLyA9PiA1MFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGVyY2VudGFnZU1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpIHtcbiAgICBjb25zdCByYXdNb2RpZmllclZhbHVlID0gZ2V0TW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIG1vZGlmaWVyTmFtZSk7XG4gICAgaWYgKHJhd01vZGlmaWVyVmFsdWUgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgcGVyY2VudGFnZU1hdGNoID0gcmF3TW9kaWZpZXJWYWx1ZS5tYXRjaCgvXihbMC05XSspJSQvKTtcbiAgICBpZiAoIXBlcmNlbnRhZ2VNYXRjaClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIE51bWJlcihwZXJjZW50YWdlTWF0Y2hbMV0pO1xufVxuLyoqXG4gKiBSZXR1cm5zIGEgYHB4YCBtb2RpZmllciB2YWx1ZSBhcyBhIG51bWJlci5cbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0UGl4ZWxNb2RpZmllclZhbHVlKFsnb2Zmc2V0JywgJy0xMnB4J10sICdvZmZzZXQnKTtcbiAqIC8vID0+IC0xMlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGl4ZWxNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKSB7XG4gICAgY29uc3QgcmF3TW9kaWZpZXJWYWx1ZSA9IGdldE1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpO1xuICAgIGlmIChyYXdNb2RpZmllclZhbHVlID09IG51bGwpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHBpeGVsTWF0Y2ggPSByYXdNb2RpZmllclZhbHVlLm1hdGNoKC9eKC0/WzAtOV0rKXB4JC8pO1xuICAgIGlmICghcGl4ZWxNYXRjaClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIE51bWJlcihwaXhlbE1hdGNoWzFdKTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBpc1JlZHVjZWRNb3Rpb24oKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKScpLm1hdGNoZXM7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNMb3dQb3dlckRldmljZSgpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29tcGF0L2NvbXBhdCAtLSB1bmRlZmluZWQgb24gaU9TIFNhZmFyaSAxMy40LTEzLjcsIHdoZXJlIE5hTiA8PSAyIGlzIGZhbHNlIGFuZCB0aGUgZGV2aWNlIHJlYWRzIGFzIG5vcm1hbC1wb3dlclxuICAgIHJldHVybiBOdW1iZXIobmF2aWdhdG9yLmhhcmR3YXJlQ29uY3VycmVuY3kpIDw9IDIgfHwgTnVtYmVyKG5hdmlnYXRvci5kZXZpY2VNZW1vcnkpIDw9IDI7XG59XG4iLCJpbXBvcnQgeyBmb2N1c2FibGUsIGlzRm9jdXNhYmxlIH0gZnJvbSAndGFiYmFibGUnO1xuaW1wb3J0IHsgZ2V0TnVtYmVyTW9kaWZpZXJWYWx1ZSB9IGZyb20gJy4uL3V0aWxzL21vZGlmaWVycyc7XG5pbXBvcnQgeyBpc1JlZHVjZWRNb3Rpb24gfSBmcm9tICcuLi91dGlscy9kZXZpY2UnO1xuaW1wb3J0IHsgYWZ0ZXJOZXh0UGFpbnQsIHJlYWRMYXlvdXRBZnRlclBhaW50IH0gZnJvbSAnLi4vdXRpbHMvbGF5b3V0LW1lYXN1cmUnO1xuaW1wb3J0IHsgd2Fybk1pc3NpbmdQYXJlbnREaXJlY3RpdmUgfSBmcm9tICcuLi91dGlscy9lcnJvcic7XG5jb25zdCBERUZBVUxUX1NQRUVEID0gNjA7IC8vIHB4L3NcbmNvbnN0IERFRkFVTFRfQVRUUklCVVRFX0JMQUNLTElTVCA9IFsnaWQnXTtcbmNvbnN0IFZJRVdQT1JUX1JFU0laRV9ERUJPVU5DRV9NUyA9IDEwMDtcbi8qKlxuICogVGhpcyBwbHVnaW4gcHJvdmlkZXMgYSBzbW9vdGhseSBzY3JvbGxpbmcgbWFycXVlZSBlZmZlY3QgYnkgdHJhbnNsYXRpbmcgdHdvIG1hdGNoaW5nIHJvd3M6XG4gKiB0aGUgb3JpZ2luYWwgXCJzb3VyY2VcIiByb3cgYW5kIGEgY2xvbmVkIFwidGFyZ2V0XCIgcm93LiBUaGUgdGFyZ2V0IHN0YXJ0cyBpbW1lZGlhdGVseSBhZnRlciB0aGVcbiAqIHNvdXJjZSwgc28gYXMgdGhlIHNvdXJjZSBzY3JvbGxzIGF3YXkgdGhlIHRhcmdldCB0YWtlcyBpdHMgcGxhY2UgYW5kIHRoZSBhbmltYXRpb24gY2FuIGxvb3BcbiAqIGJhY2sgYXJvdW5kIHdpdGhvdXQgYSB2aXNpYmxlIGp1bXAuXG4gKlxuICogVGhlIHJlbmRlciBmbG93IGlzOlxuICogIDEuIE1lYXN1cmUgdGhlIHNvdXJjZSBhbmQgdmlld3BvcnQuXG4gKiAgMi4gSWYgYC5maWxsYCBpcyBlbmFibGVkLCBhcHBlbmQgc2FuaXRpemVkIHNvdXJjZSBjbG9uZXMgdW50aWwgdGhlIHNvdXJjZSByb3cgaXMgd2lkZSBlbm91Z2guXG4gKiAgMy4gQ2xvbmUgdGhlIGZpbmFsaXplZCBzb3VyY2Ugcm93IGludG8gdGhlIHRhcmdldCByb3cuXG4gKiAgNC4gU3RhcnQgb3IgcmVmcmVzaCBhIFdlYiBBbmltYXRpb25zIEFQSSBhbmltYXRpb24gb24gYm90aCByb3dzLlxuICpcbiAqIFRoZSBtb3ZlbWVudCBpdHNlbGYgaXMgYSBwbGFpbiBsb29waW5nIGB0cmFuc2xhdGVYKDAlKSDihpIgdHJhbnNsYXRlWCgtMTAwJSlgIHRyYW5zZm9ybVxuICogYW5pbWF0aW9uIGNyZWF0ZWQgd2l0aCBgZWxlbWVudC5hbmltYXRlKClgLiBUaGUgYnJvd3NlciBydW5zIGl0IG9uIHRoZSBjb21wb3NpdG9yLCBzbyBvbmNlIGFcbiAqIG1hcnF1ZWUgaXMgcmVuZGVyZWQgdGhlcmUgaXMgemVybyBwZXItZnJhbWUgSmF2YVNjcmlwdCDigJQgbm8gYW5pbWF0aW9uIGxpYnJhcnksIG5vIHJBRiBsb29wLFxuICogbm8gc3R5bGUgd3JpdGVzIGZyb20gdGhlIG1haW4gdGhyZWFkLiBQbGF5YmFjayAocGF1c2UsIHJlc3VtZSwganVtcGluZyB0byBhIHBvc2l0aW9uKSBnb2VzXG4gKiB0aHJvdWdoIHRoZSBBbmltYXRpb24gb2JqZWN0cyB0aGUgYnJvd3NlciBoYW5kcyBiYWNrLlxuICpcbiAqIEluc3BpcmVkIGJ5OiBodHRwczovL3J5YW5tdWxsaWdhbi5kZXYvYmxvZy9jc3MtbWFycXVlZS9cbiAqXG4gKiBNb2RpZmllcnM6XG4gKiAgLSBzcGVlZC5YOiBBZGp1c3RzIHRoZSBzY3JvbGxpbmcgcGFjZSAoZS5nLiwgc3BlZWQuNjAgc2V0cyA2MHB4IHBlciBzZWNvbmQpLiBOZWdhdGl2ZSB2YWx1ZSBzY3JvbGxzIGJhY2t3YXJkc1xuICogIC0gZmlsbDogRW5zdXJlcyBjb250ZW50IGlzIHJlcGVhdGVkIGFuZCBhcHBlbmRlZCB1bnRpbCB0aGUgdmlzdWFsIGFyZWEgaXMgY29tcGxldGVseSBjb3ZlcmVkLlxuICogIC0gcGF1c2U6IEJlZ2lucyB0aGUgbWFycXVlZSBpbiBhIHBhdXNlZCBzdGF0ZSwgcmVxdWlyaW5nIGEgcGxheSBhY3Rpb24gdG8gYmVnaW4gbW92aW5nLlxuICpcbiAqIEdlbmVyYWwgdXNhZ2U6XG4gKiAgMS4gTWFyayB0aGUgc2Nyb2xsZWQgY29udGVudCB3aXRoIHgtbWFycXVlZTpzb3VyY2UuXG4gKiAgMi4gUHJvdmlkZSBhbiBlbXB0eSBjb250YWluZXIgd2l0aCB4LW1hcnF1ZWU6dGFyZ2V0LCB0byByZWNlaXZlIHRoZSBkdXBsaWNhdGVkIHNldCBvZiBpdGVtcy5cbiAqICAzLiBBdHRhY2ggeC1tYXJxdWVlIHRvIGEgcGFyZW50IGVsZW1lbnQgd2l0aCBvcHRpb25hbCBtb2RpZmllcnMgbGlrZSBzcGVlZC5YLCBmaWxsLCBvciBwYXVzZS5cbiAqXG4gKiBQcm9ncmFtbWF0aWMgY29udHJvbCBpcyBhdmFpbGFibGUgdGhyb3VnaCAkbWFycXVlZTogaXNQbGF5aW5nLCBwbGF5KCksIHBhdXNlKCksIHRvZ2dsZSgpLFxuICogc2Nyb2xsVG8oZWxlbWVudCkgdG8ganVtcCB0aGUgbG9vcCBzbyBhbiBlbGVtZW50IHNpdHMgYXQgdGhlIHZpc2libGUgbGVmdCBlZGdlLCBpc1JlYWR5XG4gKiAodHJ1ZSBhZnRlciB0aGUgZmlyc3QgcmVuZGVyKSwgYW5kIG9mZnNldFZhbHVlICh0aGUgcmF3IE1vdGlvbiB2YWx1ZSB0aGF0IGRyaXZlcyBib3RoIHJvd3MpLlxuICpcbiAqIEFjY2Vzc2liaWxpdHk6IGtleWJvYXJkIGZvY3VzIGluc2lkZSB0aGUgbWFycXVlZSBwYXVzZXMgaXQgYW5kIHNjcm9sbHMgdGhlIGZvY3VzZWQgZWxlbWVudFxuICogaW50byB2aWV3OyBmb2N1cyBsZWF2aW5nIHJlc3VtZXMgcGxheWJhY2sgb25seSBpZiBmb2N1cyBjYXVzZWQgdGhlIHBhdXNlLiBDbG9uZXMgYXJlXG4gKiBhcmlhLWhpZGRlbiBhbmQgcmVtb3ZlZCBmcm9tIHRoZSB0YWIgb3JkZXIsIGFuZCBpZHMgYXJlIHN0cmlwcGVkIGZyb20gdGhlbS4gV2l0aFxuICogcHJlZmVycy1yZWR1Y2VkLW1vdGlvbiB0aGUgcm93cyBkbyBub3QgYW5pbWF0ZSwgYW5kIHRoZSBzY3JvbGwgbW9kaWZpZXIgaXMgYWxzbyBkaXNhYmxlZFxuICogb24gbG93LXBvd2VyIGRldmljZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqICAgPGRpdiB4LWRhdGEgeC1tYXJxdWVlLnNwZWVkLjYwLmZpbGw+XG4gKiAgICAgPGRpdiB4LW1hcnF1ZWU6c291cmNlPlxuICogICAgICAgPHNwYW4+Rmlyc3QgSXRlbTwvc3Bhbj5cbiAqICAgICAgIDxzcGFuPlNlY29uZCBJdGVtPC9zcGFuPlxuICogICAgICAgPHNwYW4+VGhpcmQgSXRlbTwvc3Bhbj5cbiAqICAgICA8L2Rpdj5cbiAqICAgICA8ZGl2IHgtbWFycXVlZTp0YXJnZXQgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9kaXY+XG4gKiAgIDwvZGl2PlxuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKEFscGluZSkge1xuICAgIEFscGluZS5kaXJlY3RpdmUoJ21hcnF1ZWUnLCAoJGVsLCB7IHZhbHVlLCBtb2RpZmllcnMgfSkgPT4ge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICh2YWx1ZSA9PSAnc291cmNlJykge1xuICAgICAgICAgICAgLy8gQ2hpbGQgZGlyZWN0aXZlcyByZWdpc3RlciB0aGUgdHdvIG1vdmluZyByb3dzIG9uIHRoZSBwYXJlbnQgeC1kYXRhIGluc3RhbmNlLlxuICAgICAgICAgICAgQWxwaW5lLmJpbmQoJGVsLCB7XG4gICAgICAgICAgICAgICAgJ3gtaW5pdCcoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fX21hcnF1ZWVfaXNSb290KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3YXJuTWlzc2luZ1BhcmVudERpcmVjdGl2ZSgneC1tYXJxdWVlOnNvdXJjZScsICd4LW1hcnF1ZWUnLCB0aGlzLiRlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfc291cmNlRWwgPSB0aGlzLiRlbDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodmFsdWUgPT0gJ3RhcmdldCcpIHtcbiAgICAgICAgICAgIEFscGluZS5iaW5kKCRlbCwge1xuICAgICAgICAgICAgICAgICd4LWluaXQnKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX19tYXJxdWVlX2lzUm9vdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2Fybk1pc3NpbmdQYXJlbnREaXJlY3RpdmUoJ3gtbWFycXVlZTp0YXJnZXQnLCAneC1tYXJxdWVlJywgdGhpcy4kZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX3RhcmdldEVsID0gdGhpcy4kZWw7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHNwZWVkID0gKF9hID0gZ2V0TnVtYmVyTW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsICdzcGVlZCcpKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBERUZBVUxUX1NQRUVEO1xuICAgICAgICAgICAgbGV0IGZpbGwgPSBtb2RpZmllcnMuaW5jbHVkZXMoJ2ZpbGwnKTtcbiAgICAgICAgICAgIGxldCBhdXRvcGxheSA9ICFtb2RpZmllcnMuaW5jbHVkZXMoJ3BhdXNlJyk7XG4gICAgICAgICAgICBBbHBpbmUuYmluZCgkZWwsIHtcbiAgICAgICAgICAgICAgICAneC1kYXRhJygpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV9pc1Jvb3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfc3RhdGU6IGJ1aWxkTWFycXVlZVN0YXRlKHsgaXNQbGF5aW5nOiBhdXRvcGxheSB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV9pc0luaXRpYWxpemVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV9pc0FjdGl2ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfaXNSZW5kZXJpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX3dhc1BsYXlpbmdCZWZvcmVLZXlib2FyZEZvY3VzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV9zb3VyY2VFbDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV90YXJnZXRFbDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV9vcmlnaW5hbENvbnRlbnRGcmFnbWVudDogZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX29yaWdpbmFsQ29udGVudFdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX3NvdXJjZUVsV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfdmlld3BvcnRXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV9hbmltYXRpb25zOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV9jb250ZW50SGFzQWxwaW5lRGlyZWN0aXZlczogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfY2FuY2VsQWZ0ZXJOZXh0UGFpbnQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfYWZ0ZXJOZXh0UGFpbnRSZXNvbHZlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX3JlbmRlckZyYW1lSWQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfaXNSZXNpemVNZWFzdXJlbWVudFNjaGVkdWxlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfaXNEZXN0cm95ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX3Jlc2V0UmVuZGVyaW5nRnJhbWVJZDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV9zZW50aW5lbDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV9jYW5jZWxJblZpZXc6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfbWVhc3VyZVdpZHRocygpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSZWFkcyBhcmUgZGVmZXJyZWQgdW50aWwgYWZ0ZXIgcGFpbnQgc28gbXV0YXRpb25zIGZyb20gaW5pdC9yZW5kZXIgaGF2ZSBzZXR0bGVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWFkTGF5b3V0QWZ0ZXJQYWludCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX29yaWdpbmFsQ29udGVudFdpZHRoID0gdGhpcy5fX21hcnF1ZWVfc291cmNlRWwuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX3NvdXJjZUVsV2lkdGggPSB0aGlzLl9fbWFycXVlZV9vcmlnaW5hbENvbnRlbnRXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfdmlld3BvcnRXaWR0aCA9IHRoaXMuJGVsLmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldCBfX21hcnF1ZWVfYW5pbWF0aW9uRHVyYXRpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19tYXJxdWVlX3NvdXJjZUVsV2lkdGggLyBNYXRoLmFicyhzcGVlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBFeHRlbmRzIHRoZSBzb3VyY2Ugcm93IGl0c2VsZiBmb3Igc2hvcnQgY29udGVudC4gVGhlIHNlbnRpbmVsIHNlcGFyYXRlcyBvcmlnaW5hbFxuICAgICAgICAgICAgICAgICAgICAgICAgICogY29udGVudCBmcm9tIGZpbGwgY2xvbmVzIHNvIGxhdGVyIHJlbmRlcnMgY2FuIGRlbGV0ZSBvbmx5IGdlbmVyYXRlZCBub2Rlcy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX2ZpbGxTb3VyY2UoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fbWFycXVlZV9vcmlnaW5hbENvbnRlbnRXaWR0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgcmVhZExheW91dEFmdGVyUGFpbnQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX29yaWdpbmFsQ29udGVudFdpZHRoID0gdGhpcy5fX21hcnF1ZWVfc291cmNlRWwuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfc291cmNlRWxXaWR0aCA9IHRoaXMuX19tYXJxdWVlX29yaWdpbmFsQ29udGVudFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5lZWRzV2lkdGhBZnRlckRvbUNoYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBbHBpbmUubXV0YXRlRG9tKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fX21hcnF1ZWVfc2VudGluZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFdmVyeXRoaW5nIGFmdGVyIHRoaXMgbWFya2VyIGlzIGdlbmVyYXRlZCBhbmQgY2FuIGJlIHJlcGxhY2VkIG9uIHJlc2l6ZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9zZW50aW5lbCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ21hcnF1ZWUtc2VudGluZWwnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9zb3VyY2VFbC5hcHBlbmRDaGlsZCh0aGlzLl9fbWFycXVlZV9zZW50aW5lbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV4dCA9IHRoaXMuX19tYXJxdWVlX3NlbnRpbmVsLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChuZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvUmVtb3ZlID0gbmV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dCA9IG5leHQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX3NvdXJjZUVsLnJlbW92ZUNoaWxkKHRvUmVtb3ZlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmVlZHNXaWR0aEFmdGVyRG9tQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZWVkc1dpZHRoQWZ0ZXJEb21DaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHJlYWRMYXlvdXRBZnRlclBhaW50KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9vcmlnaW5hbENvbnRlbnRXaWR0aCA9IHRoaXMuX19tYXJxdWVlX3NvdXJjZUVsLmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX3NvdXJjZUVsV2lkdGggPSB0aGlzLl9fbWFycXVlZV9vcmlnaW5hbENvbnRlbnRXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNwYWNlVG9GaWxsID0gTWF0aC5tYXgoMCwgdGhpcy5fX21hcnF1ZWVfdmlld3BvcnRXaWR0aCAtIHRoaXMuX19tYXJxdWVlX29yaWdpbmFsQ29udGVudFdpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNwYWNlVG9GaWxsID09PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBaZXJvIChvciBub3QteWV0LWxhaWQtb3V0KSBjb250ZW50IHdpZHRoIG1ha2VzIHRpbWVzVG9DbG9uZSBJbmZpbml0eSBhbmQgZnJlZXplc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgbWFpbiB0aHJlYWQgaW4gdGhlIGNsb25lIGxvb3Ag4oCUIEN5cHJlc3MgdGhlbiBjYW4ndCBldmVuIGZpcmUgY29tbWFuZCB0aW1lb3V0cy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUodGhpcy5fX21hcnF1ZWVfb3JpZ2luYWxDb250ZW50V2lkdGgpIHx8IHRoaXMuX19tYXJxdWVlX29yaWdpbmFsQ29udGVudFdpZHRoIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0aW1lc1RvQ2xvbmUgPSBNYXRoLmNlaWwoc3BhY2VUb0ZpbGwgLyB0aGlzLl9fbWFycXVlZV9vcmlnaW5hbENvbnRlbnRXaWR0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKHRpbWVzVG9DbG9uZSkgfHwgdGltZXNUb0Nsb25lIDw9IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbWVzVG9DbG9uZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjbG9uZSA9IHRoaXMuX19tYXJxdWVlX29yaWdpbmFsQ29udGVudEZyYWdtZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFByZXBhcmUgZGV0YWNoZWQgY2xvbmVzIG9uY2UgaW5zdGVhZCBvZiByZS1zY2FubmluZyByZW5kZXJlZCBub2RlcyBldmVyeSByZW5kZXIuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGNsb25lLmNoaWxkcmVuKS5mb3JFYWNoKChjaGlsZCkgPT4gcHJlcGFyZUNsb25lZFNvdXJjZUVsZW1lbnQoY2hpbGQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWxwaW5lLm11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfc2VudGluZWwuYWZ0ZXIoZnJhZ21lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fbWFycXVlZV9jb250ZW50SGFzQWxwaW5lRGlyZWN0aXZlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBbHBpbmUuc2tpcER1cmluZ0Nsb25lKCgpID0+IEFscGluZS5pbml0VHJlZSh0aGlzLl9fbWFycXVlZV9zb3VyY2VFbCkpKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX2FmdGVyTmV4dFBhaW50UmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfY2FuY2VsQWZ0ZXJOZXh0UGFpbnQgPSBhZnRlck5leHRQYWludCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX2NhbmNlbEFmdGVyTmV4dFBhaW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfYWZ0ZXJOZXh0UGFpbnRSZXNvbHZlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfc291cmNlRWxXaWR0aCA9IHRoaXMuX19tYXJxdWVlX3NvdXJjZUVsLmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfY2xvbmVTb3VyY2VUb1RhcmdldCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2l0aG91dCBlbm91Z2ggY29udGVudCB0byBsb29wLCB0aGUgdGFyZ2V0IHdvdWxkIG9ubHkgcmVwZWF0IHN0YXRpYyBjb250ZW50LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFcXVhbCB3aWR0aCBpcyBub3QgZW5vdWdoIOKAlCBjb250ZW50IG11c3QgYmUgc3RyaWN0bHkgd2lkZXIgdGhhbiB0aGUgdmlld3BvcnQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fbWFycXVlZV9zb3VyY2VFbFdpZHRoIDw9IHRoaXMuX19tYXJxdWVlX3ZpZXdwb3J0V2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWxwaW5lLm11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUYXJnZXQgaXMgcmVidWlsdCBmcm9tIHRoZSBmaW5hbGl6ZWQgc291cmNlIHNvIGZpbGwgY2xvbmVzIGFyZSBpbmNsdWRlZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNsb25lID0gdGhpcy5fX21hcnF1ZWVfc291cmNlRWwuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShjbG9uZS5jaGlsZHJlbikuZm9yRWFjaCgoY2hpbGQpID0+IHByZXBhcmVDbG9uZWRUYXJnZXRFbGVtZW50KGNoaWxkKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV90YXJnZXRFbC5yZXBsYWNlQ2hpbGRyZW4oLi4uY2xvbmUuY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmUtaW5pdGlhbGl6ZSBhbHBpbmUgb24gY2xvbmVkIG5vZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fX21hcnF1ZWVfY29udGVudEhhc0FscGluZURpcmVjdGl2ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBbHBpbmUuc2tpcER1cmluZ0Nsb25lKCgpID0+IEFscGluZS5pbml0VHJlZSh0aGlzLl9fbWFycXVlZV90YXJnZXRFbCkpKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV9zZXR1cEFuaW1hdGlvbnMoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGR1cmF0aW9uTXMgPSB0aGlzLl9fbWFycXVlZV9hbmltYXRpb25EdXJhdGlvbiAqIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0Zpbml0ZShkdXJhdGlvbk1zKSB8fCBkdXJhdGlvbk1zIDw9IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzaG91bGRQbGF5ID0gdGhpcy5fX21hcnF1ZWVfc3RhdGUuaXNQbGF5aW5nICYmIHRoaXMuX19tYXJxdWVlX3NvdXJjZUVsV2lkdGggPiB0aGlzLl9fbWFycXVlZV92aWV3cG9ydFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENhcnJ5IHRoZSBsb29wIHBvc2l0aW9uIGFjcm9zcyByZWJ1aWxkcyAocmVzaXplLCBzY3JvbGxpbmcgYmFjayBpbnRvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmlldykgc28gdGhlIGNvbnRlbnQgZG9lc24ndCB2aXNpYmx5IGp1bXAgYmFjayB0byB0aGUgc3RhcnQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxvb3BQcm9ncmVzcyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNBbmltYXRpb24gPSB0aGlzLl9fbWFycXVlZV9hbmltYXRpb25zWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c0FuaW1hdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c1RpbWUgPSBwcmV2aW91c0FuaW1hdGlvbi5jdXJyZW50VGltZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNEdXJhdGlvbiA9IChfYSA9IHByZXZpb3VzQW5pbWF0aW9uLmVmZmVjdCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldFRpbWluZygpLmR1cmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByZXZpb3VzVGltZSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHByZXZpb3VzRHVyYXRpb24gPT09ICdudW1iZXInICYmIHByZXZpb3VzRHVyYXRpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb29wUHJvZ3Jlc3MgPSAoKChwcmV2aW91c1RpbWUgLyBwcmV2aW91c0R1cmF0aW9uKSAlIDEpICsgMSkgJSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX2NhbmNlbEFuaW1hdGlvbnMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBPbmUgaXRlcmF0aW9uIG1vdmVzIGEgcm93IGV4YWN0bHkgaXRzIG93biB3aWR0aCB0byB0aGUgbGVmdDsgdGhlIHRhcmdldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJvdyBzbGlkaW5nIGluIGJlaGluZCBtYWtlcyB0aGUgd3JhcC1hcm91bmQgaW52aXNpYmxlLiBgZGlyZWN0aW9uOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJldmVyc2VgIHBsYXlzIHRoZSBzYW1lIGtleWZyYW1lcyBiYWNrd2FyZHMgZm9yIG5lZ2F0aXZlIHNwZWVkcy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXlmcmFtZXMgPSBbeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDAlKScgfSwgeyB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0xMDAlKScgfV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uTXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZXJhdGlvbnM6IEluZmluaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmc6ICdsaW5lYXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246IHNwZWVkIDwgMCA/ICdyZXZlcnNlJyA6ICdub3JtYWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQm90aCByb3dzIGdldCB0aGVpciBvd24gQW5pbWF0aW9uIHdpdGggaWRlbnRpY2FsIHRpbWluZy4gVGhlIHNoYXJlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50IHRpbWVsaW5lIGtlZXBzIHRoZW0gbG9ja2VkIHRvZ2V0aGVyOyB0aGUgZXhwbGljaXQgY3VycmVudFRpbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBiZWxvdyBzdGFydHMgdGhlbSBhdCB0aGUgc2FtZSBwb2ludC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9hbmltYXRpb25zID0gW3RoaXMuX19tYXJxdWVlX3NvdXJjZUVsLCB0aGlzLl9fbWFycXVlZV90YXJnZXRFbF0ubWFwKChyb3dFbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmltYXRpb24gPSByb3dFbC5hbmltYXRlKGtleWZyYW1lcywgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5jdXJyZW50VGltZSA9IGxvb3BQcm9ncmVzcyAqIGR1cmF0aW9uTXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2hvdWxkUGxheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS2VlcCB0aGUgYW5pbWF0aW9uIHJlYWR5IGV2ZW4gd2hlbiB0aGVyZSBpcyBub3QgZW5vdWdoIGNvbnRlbnQgdG9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFuaW1hdGUsIHNvIHBsYXkoKSBhbmQgc2Nyb2xsVG8oKSBzdGlsbCBoYXZlIHNvbWV0aGluZyB0byBkcml2ZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5wYXVzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhbmltYXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX2NhbmNlbEFuaW1hdGlvbnMoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBhbmltYXRpb24gb2YgdGhpcy5fX21hcnF1ZWVfYW5pbWF0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24uY2FuY2VsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX2FuaW1hdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfc2Nyb2xsVG8oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGR1cmF0aW9uTXMgPSB0aGlzLl9fbWFycXVlZV9hbmltYXRpb25EdXJhdGlvbiAqIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0Zpbml0ZShkdXJhdGlvbk1zKSB8fCBkdXJhdGlvbk1zIDw9IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBKdW1wIHRoZSBhbmltYXRpb24gdGltZWxpbmUgc28ga2V5Ym9hcmQgZm9jdXMgbGFuZHMgbmVhciB0aGUgdmlzaWJsZSBsZWZ0IGVkZ2UuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldCA9IGVsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGVmdFNwYWNpbmdCdWZmZXIgPSAyNDsgLy8gKHB4KSBUbyBhbGxvdyBmb3IgdGhlIGZvY3VzIG91dGxpbmUgdG8gYmUgZnVsbHkgdmlzaWJsZSB3aGVuIHRhYmJlZCB0aHJvdWdoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiB0aGUgYW5pbWF0aW9uIGlzIHJldmVyc2VkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNwZWVkIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSB0aGlzLl9fbWFycXVlZV9zb3VyY2VFbFdpZHRoIC0gb2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0U3BhY2luZ0J1ZmZlciA9IGxlZnRTcGFjaW5nQnVmZmVyICogLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRQb3NpdGlvblBlcmNlbnRhZ2UgPSAob2Zmc2V0IC0gbGVmdFNwYWNpbmdCdWZmZXIpIC8gdGhpcy5fX21hcnF1ZWVfc291cmNlRWxXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50UG9zaXRpb25UaW1lID0gZWxlbWVudFBvc2l0aW9uUGVyY2VudGFnZSAqIGR1cmF0aW9uTXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0Zpbml0ZShlbGVtZW50UG9zaXRpb25UaW1lKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdyYXBwZWQgaW50byBvbmUgbG9vcCBzbyBhIHBvc2l0aW9uIGp1c3QgYmVmb3JlIHRoZSByb3cgc3RhcnQgZG9lc24ndFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxhbmQgaW4gdGhlIGFuaW1hdGlvbidzIGJlZm9yZS1waGFzZSwgd2hlcmUgbm8gdHJhbnNmb3JtIGFwcGxpZXMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd3JhcHBlZFRpbWUgPSAoKGVsZW1lbnRQb3NpdGlvblRpbWUgJSBkdXJhdGlvbk1zKSArIGR1cmF0aW9uTXMpICUgZHVyYXRpb25NcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGFuaW1hdGlvbiBvZiB0aGlzLl9fbWFycXVlZV9hbmltYXRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5jdXJyZW50VGltZSA9IHdyYXBwZWRUaW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3luYyBfX21hcnF1ZWVfcmVuZGVyKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fX21hcnF1ZWVfaXNBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fX21hcnF1ZWVfaXNSZW5kZXJpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9pc1JlbmRlcmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbmRlciBpcyB0aGUgb25seSBwYXRoIHRoYXQgbXV0YXRlcyBnZW5lcmF0ZWQgbWFycXVlZSBjb250ZW50LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9fbWFycXVlZV9tZWFzdXJlV2lkdGhzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9fbWFycXVlZV9maWxsU291cmNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fX21hcnF1ZWVfY2xvbmVTb3VyY2VUb1RhcmdldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb24ndCBhbmltYXRlIGlmIGluIHJlZHVjZWQgbW90aW9uIG1vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1JlZHVjZWRNb3Rpb24oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2V0dXAgYW5pbWF0aW9ucyBhZnRlciB0aGUgY29udGVudCBoYXMgYmVlbiBjbG9uZWQgaW4gb3JkZXIgdG8gbWVhc3VyZSB0aGUgd2lkdGggb2YgdGhlIGNvbnRlbnQgZWxlbWVudCB3aXRob3V0IGNhdXNpbmcgcmVmbG93XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9zZXR1cEFuaW1hdGlvbnMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfcmVzZXRSZW5kZXJpbmdGcmFtZUlkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9yZXNldFJlbmRlcmluZ0ZyYW1lSWQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfaXNSZW5kZXJpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9pc1JlbmRlcmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfdXBkYXRlVmlld3BvcnRXaWR0aCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fX21hcnF1ZWVfaXNSZXNpemVNZWFzdXJlbWVudFNjaGVkdWxlZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX2lzUmVzaXplTWVhc3VyZW1lbnRTY2hlZHVsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSByZWFkIGlzIGRlZmVycmVkIHRvIHJlYWRMYXlvdXRBZnRlclBhaW50IHNvIGl0IGxhbmRzIGluIHRoZSBzaGFyZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZWFkIGJhdGNoIOKAlCBtZWFzdXJlZCBhbG9uZ3NpZGUgZXZlcnkgb3RoZXIgY29tcG9uZW50IGFza2luZyB0aGF0IGZyYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJlZm9yZSBhbnkgb2YgdGhlbSBzdG9yZSBhIHJlc3VsdC4gUmVhZGluZyBoZXJlIChvciBpbiBhIHJBRikgd291bGQgZm9yY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhIHJlZmxvdyB3aGVuZXZlciBzb21ldGhpbmcgZWxzZSBoYWQgYWxyZWFkeSB3cml0dGVuIHN0eWxlcy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkTGF5b3V0QWZ0ZXJQYWludCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX2lzUmVzaXplTWVhc3VyZW1lbnRTY2hlZHVsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX19tYXJxdWVlX2lzRGVzdHJveWVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLiRlbC5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCh2aWV3cG9ydFdpZHRoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2aWV3cG9ydFdpZHRoID09IG51bGwgfHwgdGhpcy5fX21hcnF1ZWVfaXNEZXN0cm95ZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBkb2N1bWVudCByZXNpemVzIGNvbnN0YW50bHkgd2hpbGUgdGhlIHBhZ2UgbG9hZHMg4oCUIGV2ZXJ5IGltYWdlIGFuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzZWN0aW9uIGFycml2aW5nIG1ha2VzIGl0IHRhbGxlciDigJQgYW5kIHgtcmVzaXplLmRvY3VtZW50IHJlcG9ydHMgYWxsIG9mXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0LiBUaGUgbWFycXVlZSBvbmx5IGNhcmVzIGFib3V0IGl0cyB3aWR0aC4gUmUtcmVuZGVyaW5nIGlzIHRoZSBmdWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlYnVpbGQgKGRlbGV0ZSBjbG9uZXMsIHJlLWNsb25lLCByZS1pbml0aWFsaXplKSwgc28gaXQgbXVzdCBub3QgcnVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdoZW4gdGhlIHdpZHRoIGlzIHRoZSBzYW1lIGFzIGxhc3QgdGltZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX19tYXJxdWVlX2lzSW5pdGlhbGl6ZWQgJiYgdmlld3BvcnRXaWR0aCA9PT0gdGhpcy5fX21hcnF1ZWVfdmlld3BvcnRXaWR0aClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfdmlld3BvcnRXaWR0aCA9IHZpZXdwb3J0V2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX3JlbmRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV9wYXVzZUZvcktleWJvYXJkRm9jdXModGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEodGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHJlc2VydmUgbWFudWFsIHBhdXNlZCBzdGF0ZTogZm9jdXNvdXQgc2hvdWxkIG9ubHkgcmVzdW1lIGlmIGZvY3VzIHBhdXNlZCBwbGF5YmFjay5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV93YXNQbGF5aW5nQmVmb3JlS2V5Ym9hcmRGb2N1cyA9IHRoaXMuX19tYXJxdWVlX3N0YXRlLmlzUGxheWluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9zdGF0ZS5wYXVzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX3Njcm9sbFRvKHRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX3Jlc3VtZUFmdGVyS2V5Ym9hcmRGb2N1cygpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX19tYXJxdWVlX3dhc1BsYXlpbmdCZWZvcmVLZXlib2FyZEZvY3VzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfd2FzUGxheWluZ0JlZm9yZUtleWJvYXJkRm9jdXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9zdGF0ZS5wbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX3RlYXJkb3duKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX2NhbmNlbEFuaW1hdGlvbnMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9pc0luaXRpYWxpemVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fbWFycXVlZV9zb3VyY2VFbCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvdXJjZSBlbGVtZW50IG5vdCBmb3VuZCwgeC1tYXJxdWVlOnNvdXJjZSBtdXN0IGJlIGFwcGxpZWQgdG8gYSBjaGlsZCBlbGVtZW50IG9mIHRoZSB4LW1hcnF1ZWUgZGlyZWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX19tYXJxdWVlX3RhcmdldEVsID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGFyZ2V0IGVsZW1lbnQgbm90IGZvdW5kLCB4LW1hcnF1ZWU6dGFyZ2V0IG11c3QgYmUgYXBwbGllZCB0byBhIGNoaWxkIGVsZW1lbnQgb2YgdGhlIHgtbWFycXVlZSBkaXJlY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV90YXJnZXRFbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gS2VlcCBhIGNsZWFuIGNvcHkgb2YgdGhlIGF1dGhvci1wcm92aWRlZCBjb250ZW50OyBmaWxsIGNsb25lcyBhcmUgZ2VuZXJhdGVkIGZyb20gdGhpcy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbSh0aGlzLl9fbWFycXVlZV9zb3VyY2VFbC5jaGlsZHJlbikuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xvbmUgPSBlbGVtZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUJsYWNrbGlzdGVkQXR0cmlidXRlcyhjbG9uZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9vcmlnaW5hbENvbnRlbnRGcmFnbWVudC5hcHBlbmQoY2xvbmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGVjaWRlZCBvbmNlIGhlcmUgc28gZXZlcnkgcmVuZGVyIGNhbiBza2lwIGluaXRpYWxpemluZyBBbHBpbmUgb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2xvbmVzIG9mIGNvbnRlbnQgdGhhdCBoYXMgbm90aGluZyBmb3IgQWxwaW5lIHRvIGluaXRpYWxpemUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX2NvbnRlbnRIYXNBbHBpbmVEaXJlY3RpdmVzID0gaGFzQWxwaW5lRGlyZWN0aXZlcyh0aGlzLl9fbWFycXVlZV9vcmlnaW5hbENvbnRlbnRGcmFnbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbmRlcmluZyBpcyBsYXp5OiBkbyB0aGUgZXhwZW5zaXZlIGNsb25lL21lYXN1cmUgd29yayBvbmx5IHdoaWxlIHRoZSBtYXJxdWVlIGlzIHZpc2libGUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKChlbnRyaWVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGVudHJpZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW50cnkuaXNJbnRlcnNlY3RpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX19tYXJxdWVlX2lzQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX2lzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX19tYXJxdWVlX3JlbmRlckZyYW1lSWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuX19tYXJxdWVlX3JlbmRlckZyYW1lSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX3JlbmRlckZyYW1lSWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX3JlbmRlckZyYW1lSWQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9fbWFycXVlZV9pc0FjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9yZW5kZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX19tYXJxdWVlX2lzQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fbWFycXVlZV9yZW5kZXJGcmFtZUlkICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl9fbWFycXVlZV9yZW5kZXJGcmFtZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX3JlbmRlckZyYW1lSWQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX2lzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX3RlYXJkb3duKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLiRlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX2NhbmNlbEluVmlldyA9ICgpID0+IG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiR3YXRjaCgnX19tYXJxdWVlX3N0YXRlLmlzUGxheWluZycsIChwbGF5aW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYW5pbWF0aW9uIG9mIHRoaXMuX19tYXJxdWVlX2FuaW1hdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwbGF5aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5wYXVzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdHJveSgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2QsIF9lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX2lzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoX2EgPSB0aGlzLl9fbWFycXVlZV9jYW5jZWxJblZpZXcpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChfYiA9IHRoaXMuX19tYXJxdWVlX2NhbmNlbEFmdGVyTmV4dFBhaW50KSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9jYW5jZWxBZnRlck5leHRQYWludCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKF9jID0gdGhpcy5fX21hcnF1ZWVfYWZ0ZXJOZXh0UGFpbnRSZXNvbHZlKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9hZnRlck5leHRQYWludFJlc29sdmUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fbWFycXVlZV9yZW5kZXJGcmFtZUlkICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuX19tYXJxdWVlX3JlbmRlckZyYW1lSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9yZW5kZXJGcmFtZUlkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX19tYXJxdWVlX3Jlc2V0UmVuZGVyaW5nRnJhbWVJZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl9fbWFycXVlZV9yZXNldFJlbmRlcmluZ0ZyYW1lSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9yZXNldFJlbmRlcmluZ0ZyYW1lSWQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9jYW5jZWxBbmltYXRpb25zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKF9kID0gdGhpcy5fX21hcnF1ZWVfc291cmNlRWwpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5yZXBsYWNlQ2hpbGRyZW4odGhpcy5fX21hcnF1ZWVfb3JpZ2luYWxDb250ZW50RnJhZ21lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX29yaWdpbmFsQ29udGVudEZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChfZSA9IHRoaXMuX19tYXJxdWVlX3NlbnRpbmVsKSA9PT0gbnVsbCB8fCBfZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2UucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ0Bmb2N1c2luJzogJ19fbWFycXVlZV9wYXVzZUZvcktleWJvYXJkRm9jdXMoJGV2ZW50LnRhcmdldCknLFxuICAgICAgICAgICAgICAgICdAZm9jdXNvdXQnOiAnX19tYXJxdWVlX3Jlc3VtZUFmdGVyS2V5Ym9hcmRGb2N1cygpJyxcbiAgICAgICAgICAgICAgICAneC1yZXNpemUuZG9jdW1lbnQnOiBBbHBpbmUuZGVib3VuY2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV91cGRhdGVWaWV3cG9ydFdpZHRoKCk7XG4gICAgICAgICAgICAgICAgfSwgVklFV1BPUlRfUkVTSVpFX0RFQk9VTkNFX01TKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGRpcmVjdGl2ZTogeC1tYXJxdWVlOiR7dmFsdWV9YCk7XG4gICAgICAgIH1cbiAgICB9KS5iZWZvcmUoJ2JpbmQnKTtcbiAgICBBbHBpbmUubWFnaWMoJ21hcnF1ZWUnLCAoJGVsKSA9PiB7XG4gICAgICAgIGNvbnN0ICRkYXRhID0gQWxwaW5lLiRkYXRhKCRlbCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXQgaXNQbGF5aW5nKCkge1xuICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKF9hID0gJGRhdGEuX19tYXJxdWVlX3N0YXRlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaXNQbGF5aW5nO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBsYXkoKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIChfYSA9ICRkYXRhLl9fbWFycXVlZV9zdGF0ZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnBsYXkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXVzZSgpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgKF9hID0gJGRhdGEuX19tYXJxdWVlX3N0YXRlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucGF1c2UoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b2dnbGUoKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIChfYSA9ICRkYXRhLl9fbWFycXVlZV9zdGF0ZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnRvZ2dsZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNjcm9sbFRvKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgKF9hID0gJGRhdGEuX19tYXJxdWVlX3Njcm9sbFRvKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbCgkZGF0YSwgZWxlbWVudCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0IGlzUmVhZHkoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRkYXRhLl9fbWFycXVlZV9pc0luaXRpYWxpemVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGJ1aWxkTWFycXVlZVN0YXRlKG9wdGlvbnMpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaXNQbGF5aW5nOiAoX2EgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuaXNQbGF5aW5nKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBmYWxzZSxcbiAgICAgICAgcGxheSgpIHtcbiAgICAgICAgICAgIHRoaXMuaXNQbGF5aW5nID0gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgcGF1c2UoKSB7XG4gICAgICAgICAgICB0aGlzLmlzUGxheWluZyA9IGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICB0b2dnbGUoKSB7XG4gICAgICAgICAgICB0aGlzLmlzUGxheWluZyA9ICF0aGlzLmlzUGxheWluZztcbiAgICAgICAgfSxcbiAgICB9O1xufVxuLyoqXG4gKiBUcnVlIHdoZW4gYW55IGVsZW1lbnQgaW4gdGhlIGNvbnRlbnQgY2FycmllcyBzb21ldGhpbmcgQWxwaW5lIHdvdWxkIG5lZWQgdG9cbiAqIGluaXRpYWxpemU6IGFuIGB4LWAgZGlyZWN0aXZlLCBhIGA6YC9gQGAgc2hvcnRoYW5kIGJpbmRpbmcsIG9yIGEgbGF6eS1BbHBpbmUgbWFya2VyLlxuICpcbiAqIE1vc3QgbWFycXVlZSBjb250ZW50IGlzIHBsYWluIG1hcmt1cCDigJQgbG9nb3MsIHRleHQsIGxpbmtzIOKAlCBhbmQgaW5pdGlhbGl6aW5nIEFscGluZSBvblxuICogZXZlcnkgY2xvbmUgb2YgaXQgaXMgdGhlIG1vc3QgZXhwZW5zaXZlIHBhcnQgb2YgYSByZW5kZXIsIGZvciBub3RoaW5nLiBDaGVja2VkIG9uY2Ugb25cbiAqIHRoZSBhdXRob3JlZCBjb250ZW50LCBzbyBlYWNoIHJlbmRlciBjYW4gc2tpcCB0aGF0IHdvcmsgb3V0cmlnaHQuXG4gKi9cbmZ1bmN0aW9uIGhhc0FscGluZURpcmVjdGl2ZXMoY29udGVudCkge1xuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBjb250ZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyonKSkge1xuICAgICAgICBpZiAoZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2RhdGEtbGF6eS1hbHBpbmUnKSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBmb3IgKGNvbnN0IGF0dHJpYnV0ZSBvZiBlbGVtZW50LmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBhdHRyaWJ1dGUubmFtZTtcbiAgICAgICAgICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ3gtJykgfHwgbmFtZS5zdGFydHNXaXRoKCc6JykgfHwgbmFtZS5zdGFydHNXaXRoKCdAJykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gcHJlcGFyZUNsb25lZFNvdXJjZUVsZW1lbnQoZWxlbWVudCkge1xuICAgIC8vIFNvdXJjZSBmaWxsIGNsb25lcyByZW1haW4gaW4gdGhlIHZpc2libGUgcm93LCBidXQgc2hvdWxkIG5vdCBiZSBhbm5vdW5jZWQgb3IgdGFiYmVkIHRvLlxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgcmVtb3ZlQ2xvbmVkRWxlbWVudEZyb21UYWJPcmRlcihlbGVtZW50KTtcbn1cbmZ1bmN0aW9uIHByZXBhcmVDbG9uZWRUYXJnZXRFbGVtZW50KGVsZW1lbnQpIHtcbiAgICAvLyBUYXJnZXQgY2xvbmVzIGR1cGxpY2F0ZSBsaXZlIHNvdXJjZSBub2Rlcywgc28gYmxhY2tsaXN0ZWQgYXR0cmlidXRlcyAoaWRzKSBtdXN0IGJlXG4gICAgLy8gc3RyaXBwZWQgaGVyZSDigJQgdW5saWtlIGZpbGwgY2xvbmVzLCB3aGljaCBjb21lIGZyb20gdGhlIGFscmVhZHktc2FuaXRpemVkIGZyYWdtZW50LlxuICAgIHJlbW92ZUJsYWNrbGlzdGVkQXR0cmlidXRlcyhlbGVtZW50KTtcbiAgICByZW1vdmVDbG9uZWRFbGVtZW50RnJvbVRhYk9yZGVyKGVsZW1lbnQpO1xufVxuZnVuY3Rpb24gcmVtb3ZlQmxhY2tsaXN0ZWRBdHRyaWJ1dGVzKGVsZW1lbnQpIHtcbiAgICBmb3IgKGNvbnN0IGJsYWNrbGlzdGVkQXR0cmlidXRlIG9mIERFRkFVTFRfQVRUUklCVVRFX0JMQUNLTElTVCkge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShibGFja2xpc3RlZEF0dHJpYnV0ZSk7XG4gICAgICAgIGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChgWyR7YmxhY2tsaXN0ZWRBdHRyaWJ1dGV9XWApLmZvckVhY2goKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgICAgIGRlc2NlbmRhbnQucmVtb3ZlQXR0cmlidXRlKGJsYWNrbGlzdGVkQXR0cmlidXRlKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gcmVtb3ZlQ2xvbmVkRWxlbWVudEZyb21UYWJPcmRlcihlbGVtZW50KSB7XG4gICAgLy8gQ2xvbmVzIGFyZSBkZXRhY2hlZCB3aGVuIHByZXBhcmVkLCBzbyB0YWJiYWJsZSBjYW5ub3QgcmVseSBvbiBsYXlvdXQgdmlzaWJpbGl0eSBjaGVja3MuXG4gICAgaWYgKGlzRm9jdXNhYmxlKGVsZW1lbnQsIHsgZGlzcGxheUNoZWNrOiAnbm9uZScgfSkpIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgfVxuICAgIGZvY3VzYWJsZShlbGVtZW50LCB7IGRpc3BsYXlDaGVjazogJ25vbmUnIH0pLmZvckVhY2goKGZvY3VzYWJsZUVsZW1lbnQpID0+IHtcbiAgICAgICAgZm9jdXNhYmxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgQWxwaW5lIGZyb20gJ2FscGluZWpzJztcbmltcG9ydCB7bWFycXVlZX0gZnJvbSAnQGdyb3VwdGhvdWdodC9hc3NlbWJseS11aS9hbHBpbmUnO1xuXG5BbHBpbmUucGx1Z2luKG1hcnF1ZWUpO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsSUFBSSxlQUFlLENBQUM7QUFDcEIsSUFBSSxtQkFBbUIsQ0FBQztBQUN4QixJQUFJLGlCQUFpQjtBQUNyQixTQUFTLGtCQUFrQjtDQUN2QixpQkFBaUI7Q0FDakIsTUFBTSxRQUFRO0NBQ2QsTUFBTSxZQUFZO0NBQ2xCLGVBQWUsQ0FBQztDQUNoQixtQkFBbUIs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