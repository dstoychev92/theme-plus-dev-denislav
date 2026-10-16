
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
//#region ../.tradecraft/tradecraft-ui/dist/utils/layout-measure.js
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
//#region ../.tradecraft/tradecraft-ui/dist/utils/error.js
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
//#region ../.tradecraft/tradecraft-ui/dist/utils/modifiers/base.js
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
//#region ../.tradecraft/tradecraft-ui/dist/utils/device.js
function isReducedMotion() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

//#endregion
//#region ../.tradecraft/tradecraft-ui/dist/alpine/marquee.js
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUubWFycXVlZS5qcyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyIuLi8uLi8udHJhZGVjcmFmdC90cmFkZWNyYWZ0LXVpL2Rpc3QvdXRpbHMvbGF5b3V0LW1lYXN1cmUuanMiLCIuLi8uLi8udHJhZGVjcmFmdC90cmFkZWNyYWZ0LXVpL2Rpc3QvdXRpbHMvZXJyb3IuanMiLCIuLi8uLi8udHJhZGVjcmFmdC90cmFkZWNyYWZ0LXVpL2Rpc3QvdXRpbHMvbW9kaWZpZXJzL2Jhc2UuanMiLCIuLi8uLi8udHJhZGVjcmFmdC90cmFkZWNyYWZ0LXVpL2Rpc3QvdXRpbHMvZGV2aWNlLmpzIiwiLi4vLi4vLnRyYWRlY3JhZnQvdHJhZGVjcmFmdC11aS9kaXN0L2FscGluZS9tYXJxdWVlLmpzIiwiLi4vc3JjL2pzL3RoZW1lLm1hcnF1ZWUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBIZWxwZXJzIGZvciByZWFkaW5nIGxheW91dCB3aXRob3V0IGZvcmNpbmcgc3luY2hyb25vdXMgcmVmbG93cy5cbiAqXG4gKiBBIGZyYW1lIHJlbmRlcnMgaW4gdGhpcyBvcmRlcjogckFGIGNhbGxiYWNrcyDihpIgc3R5bGUvbGF5b3V0IOKGkiBSZXNpemVPYnNlcnZlclxuICogY2FsbGJhY2tzIOKGkiBwYWludC4gUmVhZGluZyBnZW9tZXRyeSB3aGlsZSBzdHlsZSBpcyBkaXJ0eSAobWljcm90YXNrIGZsdXNoZXMsIHJBRlxuICogY2FsbGJhY2tzKSBmb3JjZXMgYSBzeW5jaHJvbm91cyByZWZsb3cuIFR3byBjbGVhbiByZWFkIHBvaW50cyBleGlzdDpcbiAqXG4gKiAtICoqUmVzaXplT2JzZXJ2ZXIgY2FsbGJhY2tzKiog4oCUIGxheW91dCBqdXN0IHJhbiwgc28gcmVhZHMgYXJlIGZyZWUsIGFuZCBzdHlsZSB3cml0ZXNcbiAqICAgc3RpbGwgbGFuZCBpbiB0aGUgc2FtZSBmcmFtZSdzIHBhaW50IChubyBmbGFzaCkuIFVzZSBgb25GaXJzdExheW91dGAgZm9yIG9uZS1vZmZcbiAqICAgXCJtZWFzdXJlLCB0aGVuIGFwcGx5IGluaXRpYWwgc3R5bGVzXCIgd29yaywgYW5kIGB4LXJlc2l6ZWAgZm9yIG9uZ29pbmcgc2l6ZSB0cmFja2luZy5cbiAqIC0gKipBZnRlciBwYWludCoqIOKAlCBgYWZ0ZXJOZXh0UGFpbnRgIC8gYHJlYWRMYXlvdXRBZnRlclBhaW50YCBydW4gaW4gYSB0YXNrIHJpZ2h0IGFmdGVyXG4gKiAgIHRoZSBmcmFtZSBjb21taXRzLiBSZWFkcyBhcmUgZnJlZSwgYnV0IHdyaXRlcyByZW5kZXIgb25lIGZyYW1lIGxhdGVyOyBuZXZlciB1c2UgdGhlbVxuICogICB0byBhcHBseSBpbml0aWFsIHZpc3VhbCBzdGF0ZSAoaXQgZmxhc2hlcykuIFVzZSB0aGVtIHRvIHlpZWxkIHVudGlsIHBlbmRpbmcgRE9NXG4gKiAgIG11dGF0aW9ucyBoYXZlIHJlbmRlcmVkIChlLmcuIG1lYXN1cmUg4oaSIG11dGF0ZSDihpIgbWVhc3VyZSBsb29wcykuXG4gKlxuICogQWxsIGBhZnRlck5leHRQYWludGAvYHJlYWRMYXlvdXRBZnRlclBhaW50YCBjYWxsYmFja3Mgc2NoZWR1bGVkIGluIHRoZSBzYW1lIGZyYW1lIHNoYXJlXG4gKiBhIHNpbmdsZSBmbHVzaCB3aXRoIHJlYWRzIHJ1bm5pbmcgZmlyc3QsIHNvIGJhdGNoZWQgcmVhZHMgbmV2ZXIgaW50ZXJsZWF2ZSB3aXRoXG4gKiBiYXRjaGVkIHdyaXRlcy5cbiAqL1xubGV0IHBlbmRpbmdSZWFkcyA9IFtdO1xubGV0IHBlbmRpbmdDYWxsYmFja3MgPSBbXTtcbmxldCBmbHVzaFNjaGVkdWxlZCA9IGZhbHNlO1xuZnVuY3Rpb24gZmx1c2hBZnRlclBhaW50KCkge1xuICAgIGZsdXNoU2NoZWR1bGVkID0gZmFsc2U7XG4gICAgY29uc3QgcmVhZHMgPSBwZW5kaW5nUmVhZHM7XG4gICAgY29uc3QgY2FsbGJhY2tzID0gcGVuZGluZ0NhbGxiYWNrcztcbiAgICBwZW5kaW5nUmVhZHMgPSBbXTtcbiAgICBwZW5kaW5nQ2FsbGJhY2tzID0gW107XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiByZWFkcykge1xuICAgICAgICBpZiAoIWVudHJ5LmNhbmNlbGxlZClcbiAgICAgICAgICAgIGVudHJ5LmZuKCk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZW50cnkgb2YgY2FsbGJhY2tzKSB7XG4gICAgICAgIGlmICghZW50cnkuY2FuY2VsbGVkKVxuICAgICAgICAgICAgZW50cnkuZm4oKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzY2hlZHVsZUZsdXNoQWZ0ZXJQYWludCgpIHtcbiAgICBpZiAoZmx1c2hTY2hlZHVsZWQpXG4gICAgICAgIHJldHVybjtcbiAgICBmbHVzaFNjaGVkdWxlZCA9IHRydWU7XG4gICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ2hpZGRlbicpIHtcbiAgICAgICAgLy8gSGlkZGVuIGRvY3VtZW50cyBkb24ndCBwYWludCwgc28gckFGIHdvdWxkIHN0YWxsIGluZGVmaW5pdGVseS5cbiAgICAgICAgc2V0VGltZW91dChmbHVzaEFmdGVyUGFpbnQsIDApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gckFGIGFsb25lIHJ1bnMgKmJlZm9yZSogc3R5bGUvbGF5b3V0L3BhaW50OyBhIHRhc2sgc2NoZWR1bGVkIGZyb20gaW5zaWRlIGl0IHJ1bnNcbiAgICAgICAgLy8gcmlnaHQgYWZ0ZXIgdGhlIGZyYW1lIGNvbW1pdHMg4oCUIHRoZSBlYXJsaWVzdCBwb2ludCB3aGVyZSBsYXlvdXQgaXMgY2xlYW4uXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBzZXRUaW1lb3V0KGZsdXNoQWZ0ZXJQYWludCwgMCkpO1xuICAgIH1cbn1cbi8qKlxuICogUnVucyBgZm5gIGFmdGVyIHRoZSBuZXh0IHBhaW50LiBSZXR1cm5zIGEgY2FuY2VsIGZ1bmN0aW9uLlxuICpcbiAqIExheW91dCBpcyBjbGVhbiBhdCB0aGlzIHBvaW50LCBzbyBnZW9tZXRyeSByZWFkcyBhcmUgZnJlZSDigJQgYnV0IHN0eWxlIHdyaXRlcyBoZXJlXG4gKiByZW5kZXIgb25lIGZyYW1lIGxhdGVyIHRoYW4gd3JpdGVzIG1hZGUgaW4gYSByQUYuIFByZWZlciBgb25GaXJzdExheW91dGAgd2hlbiB0aGVcbiAqIGNhbGxiYWNrIGFwcGxpZXMgaW5pdGlhbCB2aXN1YWwgc3RhdGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZnRlck5leHRQYWludChmbikge1xuICAgIGNvbnN0IGVudHJ5ID0geyBmbiwgY2FuY2VsbGVkOiBmYWxzZSB9O1xuICAgIHBlbmRpbmdDYWxsYmFja3MucHVzaChlbnRyeSk7XG4gICAgc2NoZWR1bGVGbHVzaEFmdGVyUGFpbnQoKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBlbnRyeS5jYW5jZWxsZWQgPSB0cnVlO1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gYWZ0ZXJOZXh0UGFpbnRBc3luYygpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgYWZ0ZXJOZXh0UGFpbnQocmVzb2x2ZSk7XG4gICAgfSk7XG59XG4vKipcbiAqIFJ1bnMgdGhlIHJlYWQgY2FsbGJhY2sgYWZ0ZXIgdGhlIG5leHQgcGFpbnQsIGJlZm9yZSBhbnkgYGFmdGVyTmV4dFBhaW50YCBjYWxsYmFja3NcbiAqIGZyb20gdGhlIHNhbWUgZnJhbWUsIHNvIGJhdGNoZWQgcmVhZHMgY2FuJ3QgaW50ZXJsZWF2ZSB3aXRoIGJhdGNoZWQgd3JpdGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVhZExheW91dEFmdGVyUGFpbnQoZm4pIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgcGVuZGluZ1JlYWRzLnB1c2goeyBmbjogKCkgPT4gcmVzb2x2ZShmbigpKSwgY2FuY2VsbGVkOiBmYWxzZSB9KTtcbiAgICAgICAgc2NoZWR1bGVGbHVzaEFmdGVyUGFpbnQoKTtcbiAgICB9KTtcbn1cbi8qKlxuICogUnVucyBgZm5gIG9uY2UgdGhlIGVsZW1lbnQgaGFzIGEgbGF5b3V0IGJveCwgaW5zaWRlIGEgUmVzaXplT2JzZXJ2ZXIgY2FsbGJhY2s6XG4gKiBhZnRlciBsYXlvdXQgKHJlYWRzIGFyZSBmcmVlIOKAlCBubyBmb3JjZWQgcmVmbG93KSBidXQgYmVmb3JlIHBhaW50IChzdHlsZSB3cml0ZXNcbiAqIHN0aWxsIGxhbmQgaW4gdGhpcyBmcmFtZSDigJQgbm8gZmxhc2ggb2YgdW5zdHlsZWQgc3RhdGUpLlxuICpcbiAqIEZvciBhbiBlbGVtZW50IHRoYXQgaXMgcmVuZGVyZWQgd2hlbiBjYWxsZWQsIHRoaXMgZmlyZXMgZHVyaW5nIHRoZSBjdXJyZW50IGZyYW1lJ3NcbiAqIHJlbmRlcmluZyBzdGVwcy4gRm9yIGEgYGRpc3BsYXk6IG5vbmVgIGVsZW1lbnQsIGl0IGZpcmVzIHdoZW4gdGhlIGVsZW1lbnQgZmlyc3RcbiAqIGdldHMgYSBib3gg4oCUIHNvIG1lYXN1cmVtZW50cyBhcmUgbmV2ZXIgYSBtZWFuaW5nbGVzcyAww5cwLiBSZXR1cm5zIGEgY2FuY2VsIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gb25GaXJzdExheW91dChlbCwgZm4pIHtcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcigoZW50cmllcykgPT4ge1xuICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIGZuKGVudHJpZXNbMF0pO1xuICAgIH0pO1xuICAgIG9ic2VydmVyLm9ic2VydmUoZWwpO1xuICAgIHJldHVybiAoKSA9PiBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG59XG4iLCIvKipcbiAqIExvZ3MgYSBjbGVhciwgYWN0aW9uYWJsZSBjb25zb2xlIGVycm9yIHdoZW4gYSBNZXRob2QgVUkgZGlyZWN0aXZlIGlzIHVzZWRcbiAqIHdpdGhvdXQgYSBwYXJlbnQgZGlyZWN0aXZlIGl0IGRlcGVuZHMgb24uXG4gKlxuICogTWFueSBkaXJlY3RpdmVzIG9ubHkgd29yayB3aGVuIG5lc3RlZCBpbnNpZGUgYSBwYXJlbnQgZGlyZWN0aXZlIHRoYXQgc2V0cyB1cFxuICogc2hhcmVkIHN0YXRlIG9uIHRoZSBBbHBpbmUgc2NvcGUgKGUuZy4gYHgtb3ZlcmZsb3c6c3RhcnRgIG5lZWRzIGFuIGFuY2VzdG9yXG4gKiBgeC1vdmVyZmxvd2ApLiBXaGVuIHRoYXQgcGFyZW50IGlzIG1pc3NpbmcsIHRoZSByYXcgZmFpbHVyZSBpcyBhbiBpbnNjcnV0YWJsZVxuICogYHRoaXMuX19mb28gaXMgbm90IGEgZnVuY3Rpb25gLiBDYWxsIHRoaXMgaW5zdGVhZCBzbyB1c2VycyBnZXQgYSBtZXNzYWdlIHRoYXRcbiAqIGV4cGxhaW5zIHdoYXQgdG8gZG8uXG4gKlxuICogQHBhcmFtIGNoaWxkRGlyZWN0aXZlIC0gVGhlIGRpcmVjdGl2ZSBiZWluZyB1c2VkLCBlLmcuIGAneC1vdmVyZmxvdzpzdGFydCdgLlxuICogQHBhcmFtIHBhcmVudERpcmVjdGl2ZSAtIFRoZSBwYXJlbnQgZGlyZWN0aXZlIHJlcXVpcmVkLCBlLmcuIGAneC1vdmVyZmxvdydgLlxuICogQHBhcmFtIGVsIC0gVGhlIGVsZW1lbnQgdGhlIGNoaWxkIGRpcmVjdGl2ZSBpcyBvbiwgbG9nZ2VkIGZvciBjb250ZXh0LlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGB0c1xuICogaWYgKHR5cGVvZiB0aGlzLl9fb3ZlcmZsb3dfcmVnaXN0ZXJCb3VuZGFyeSAhPT0gJ2Z1bmN0aW9uJykge1xuICogICB3YXJuTWlzc2luZ1BhcmVudERpcmVjdGl2ZShgeC1vdmVyZmxvdzoke3ZhbHVlfWAsICd4LW92ZXJmbG93JywgJGVsKTtcbiAqICAgcmV0dXJuO1xuICogfVxuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3YXJuTWlzc2luZ1BhcmVudERpcmVjdGl2ZShjaGlsZERpcmVjdGl2ZSwgcGFyZW50RGlyZWN0aXZlLCBlbCkge1xuICAgIGNvbnNvbGUuZXJyb3IoYENhbm5vdCB1c2UgJHtjaGlsZERpcmVjdGl2ZX0gd2l0aG91dCBhIHBhcmVudCBlbGVtZW50IGhhdmluZyAke3BhcmVudERpcmVjdGl2ZX0uYCwgZWwpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHByZXR0eVByaW50RXJyb3IoZXJyKSB7XG4gICAgbGV0IG91dHB1dCA9ICcnO1xuICAgIGlmICh0eXBlb2YgZXJyID09PSAnc3RyaW5nJykge1xuICAgICAgICBvdXRwdXQgPSBlcnI7XG4gICAgfVxuICAgIGVsc2UgaWYgKGVyciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIG91dHB1dCA9IGVyci5tZXNzYWdlO1xuICAgIH1cbiAgICBlbHNlIGlmIChlcnIgJiYgdHlwZW9mIGVyci50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBvdXRwdXQgPSBlcnIudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZXJyICYmIHR5cGVvZiBlcnIubWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgb3V0cHV0ID0gZXJyLm1lc3NhZ2U7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvdXRwdXQgPSAnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZC4nO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xufVxuIiwiLyoqXG4gKiBSZXR1cm5zIHRoZSB0b2tlbiB0aGF0IGZvbGxvd3MgYSBkaXJlY3RpdmUgbW9kaWZpZXIgbmFtZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0TW9kaWZpZXJWYWx1ZShbJ3NwZWVkJywgJzYwJ10sICdzcGVlZCcpO1xuICogLy8gPT4gJzYwJ1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIG1vZGlmaWVyTmFtZSkge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCBtb2RpZmllckluZGV4ID0gbW9kaWZpZXJzLmluZGV4T2YobW9kaWZpZXJOYW1lKTtcbiAgICBpZiAobW9kaWZpZXJJbmRleCA9PT0gLTEpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIHJldHVybiAoX2EgPSBtb2RpZmllcnNbbW9kaWZpZXJJbmRleCArIDFdKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBudWxsO1xufVxuLyoqXG4gKiBSZXR1cm5zIGEgbnVtZXJpYyBtb2RpZmllciB2YWx1ZSB3aGVuIGl0IGNhbiBiZSBwYXJzZWQgYXMgYSBmaW5pdGUgbnVtYmVyLlxuICpcbiAqIEBleGFtcGxlXG4gKiBnZXROdW1iZXJNb2RpZmllclZhbHVlKFsnc3BlZWQnLCAnLTYwJ10sICdzcGVlZCcpO1xuICogLy8gPT4gLTYwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXROdW1iZXJNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKSB7XG4gICAgY29uc3QgcmF3TW9kaWZpZXJWYWx1ZSA9IGdldE1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpO1xuICAgIGlmIChyYXdNb2RpZmllclZhbHVlID09IG51bGwpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHBhcnNlZE1vZGlmaWVyVmFsdWUgPSBOdW1iZXIocmF3TW9kaWZpZXJWYWx1ZSk7XG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUocGFyc2VkTW9kaWZpZXJWYWx1ZSkpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIHJldHVybiBwYXJzZWRNb2RpZmllclZhbHVlO1xufVxuLyoqXG4gKiBSZXR1cm5zIGEgcG9zaXRpdmUgbnVtZXJpYyBtb2RpZmllciB2YWx1ZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0UG9zaXRpdmVOdW1iZXJNb2RpZmllclZhbHVlKFsnc3RpZmZuZXNzJywgJzI0MCddLCAnc3RpZmZuZXNzJyk7XG4gKiAvLyA9PiAyNDBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFBvc2l0aXZlTnVtYmVyTW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIG1vZGlmaWVyTmFtZSkge1xuICAgIGNvbnN0IHBhcnNlZE1vZGlmaWVyVmFsdWUgPSBnZXROdW1iZXJNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKTtcbiAgICBpZiAocGFyc2VkTW9kaWZpZXJWYWx1ZSA9PSBudWxsIHx8IHBhcnNlZE1vZGlmaWVyVmFsdWUgPD0gMClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHBhcnNlZE1vZGlmaWVyVmFsdWU7XG59XG4vKipcbiAqIFJldHVybnMgYW4gYG1zYCBtb2RpZmllciB2YWx1ZSBhcyBhIG51bWJlci5cbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0TWlsbGlzZWNvbmRzTW9kaWZpZXJWYWx1ZShbJ2R1cmF0aW9uJywgJzUwMG1zJ10sICdkdXJhdGlvbicpO1xuICogLy8gPT4gNTAwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNaWxsaXNlY29uZHNNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKSB7XG4gICAgY29uc3QgcmF3TW9kaWZpZXJWYWx1ZSA9IGdldE1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpO1xuICAgIGlmIChyYXdNb2RpZmllclZhbHVlID09IG51bGwpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIGNvbnN0IG1pbGxpc2Vjb25kc01hdGNoID0gcmF3TW9kaWZpZXJWYWx1ZS5tYXRjaCgvXihbMC05XSspbXMkLyk7XG4gICAgaWYgKCFtaWxsaXNlY29uZHNNYXRjaClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIE51bWJlcihtaWxsaXNlY29uZHNNYXRjaFsxXSk7XG59XG4vKipcbiAqIFJldHVybnMgYSBgJWAgbW9kaWZpZXIgdmFsdWUgYXMgYSBudW1iZXIuXG4gKlxuICogQGV4YW1wbGVcbiAqIGdldFBlcmNlbnRhZ2VNb2RpZmllclZhbHVlKFsncHJvZ3Jlc3MnLCAnNTAlJ10sICdwcm9ncmVzcycpO1xuICogLy8gPT4gNTBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFBlcmNlbnRhZ2VNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKSB7XG4gICAgY29uc3QgcmF3TW9kaWZpZXJWYWx1ZSA9IGdldE1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpO1xuICAgIGlmIChyYXdNb2RpZmllclZhbHVlID09IG51bGwpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHBlcmNlbnRhZ2VNYXRjaCA9IHJhd01vZGlmaWVyVmFsdWUubWF0Y2goL14oWzAtOV0rKSUkLyk7XG4gICAgaWYgKCFwZXJjZW50YWdlTWF0Y2gpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIHJldHVybiBOdW1iZXIocGVyY2VudGFnZU1hdGNoWzFdKTtcbn1cbi8qKlxuICogUmV0dXJucyBhIGBweGAgbW9kaWZpZXIgdmFsdWUgYXMgYSBudW1iZXIuXG4gKlxuICogQGV4YW1wbGVcbiAqIGdldFBpeGVsTW9kaWZpZXJWYWx1ZShbJ29mZnNldCcsICctMTJweCddLCAnb2Zmc2V0Jyk7XG4gKiAvLyA9PiAtMTJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFBpeGVsTW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIG1vZGlmaWVyTmFtZSkge1xuICAgIGNvbnN0IHJhd01vZGlmaWVyVmFsdWUgPSBnZXRNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKTtcbiAgICBpZiAocmF3TW9kaWZpZXJWYWx1ZSA9PSBudWxsKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBwaXhlbE1hdGNoID0gcmF3TW9kaWZpZXJWYWx1ZS5tYXRjaCgvXigtP1swLTldKylweCQvKTtcbiAgICBpZiAoIXBpeGVsTWF0Y2gpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIHJldHVybiBOdW1iZXIocGl4ZWxNYXRjaFsxXSk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gaXNSZWR1Y2VkTW90aW9uKCkge1xuICAgIHJldHVybiB3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSknKS5tYXRjaGVzO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzTG93UG93ZXJEZXZpY2UoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbXBhdC9jb21wYXQgLS0gdW5kZWZpbmVkIG9uIGlPUyBTYWZhcmkgMTMuNC0xMy43LCB3aGVyZSBOYU4gPD0gMiBpcyBmYWxzZSBhbmQgdGhlIGRldmljZSByZWFkcyBhcyBub3JtYWwtcG93ZXJcbiAgICByZXR1cm4gTnVtYmVyKG5hdmlnYXRvci5oYXJkd2FyZUNvbmN1cnJlbmN5KSA8PSAyIHx8IE51bWJlcihuYXZpZ2F0b3IuZGV2aWNlTWVtb3J5KSA8PSAyO1xufVxuIiwiaW1wb3J0IHsgZm9jdXNhYmxlLCBpc0ZvY3VzYWJsZSB9IGZyb20gJ3RhYmJhYmxlJztcbmltcG9ydCB7IGdldE51bWJlck1vZGlmaWVyVmFsdWUgfSBmcm9tICcuLi91dGlscy9tb2RpZmllcnMnO1xuaW1wb3J0IHsgaXNSZWR1Y2VkTW90aW9uIH0gZnJvbSAnLi4vdXRpbHMvZGV2aWNlJztcbmltcG9ydCB7IGFmdGVyTmV4dFBhaW50LCByZWFkTGF5b3V0QWZ0ZXJQYWludCB9IGZyb20gJy4uL3V0aWxzL2xheW91dC1tZWFzdXJlJztcbmltcG9ydCB7IHdhcm5NaXNzaW5nUGFyZW50RGlyZWN0aXZlIH0gZnJvbSAnLi4vdXRpbHMvZXJyb3InO1xuY29uc3QgREVGQVVMVF9TUEVFRCA9IDYwOyAvLyBweC9zXG5jb25zdCBERUZBVUxUX0FUVFJJQlVURV9CTEFDS0xJU1QgPSBbJ2lkJ107XG5jb25zdCBWSUVXUE9SVF9SRVNJWkVfREVCT1VOQ0VfTVMgPSAxMDA7XG4vKipcbiAqIFRoaXMgcGx1Z2luIHByb3ZpZGVzIGEgc21vb3RobHkgc2Nyb2xsaW5nIG1hcnF1ZWUgZWZmZWN0IGJ5IHRyYW5zbGF0aW5nIHR3byBtYXRjaGluZyByb3dzOlxuICogdGhlIG9yaWdpbmFsIFwic291cmNlXCIgcm93IGFuZCBhIGNsb25lZCBcInRhcmdldFwiIHJvdy4gVGhlIHRhcmdldCBzdGFydHMgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlXG4gKiBzb3VyY2UsIHNvIGFzIHRoZSBzb3VyY2Ugc2Nyb2xscyBhd2F5IHRoZSB0YXJnZXQgdGFrZXMgaXRzIHBsYWNlIGFuZCB0aGUgYW5pbWF0aW9uIGNhbiBsb29wXG4gKiBiYWNrIGFyb3VuZCB3aXRob3V0IGEgdmlzaWJsZSBqdW1wLlxuICpcbiAqIFRoZSByZW5kZXIgZmxvdyBpczpcbiAqICAxLiBNZWFzdXJlIHRoZSBzb3VyY2UgYW5kIHZpZXdwb3J0LlxuICogIDIuIElmIGAuZmlsbGAgaXMgZW5hYmxlZCwgYXBwZW5kIHNhbml0aXplZCBzb3VyY2UgY2xvbmVzIHVudGlsIHRoZSBzb3VyY2Ugcm93IGlzIHdpZGUgZW5vdWdoLlxuICogIDMuIENsb25lIHRoZSBmaW5hbGl6ZWQgc291cmNlIHJvdyBpbnRvIHRoZSB0YXJnZXQgcm93LlxuICogIDQuIFN0YXJ0IG9yIHJlZnJlc2ggYSBXZWIgQW5pbWF0aW9ucyBBUEkgYW5pbWF0aW9uIG9uIGJvdGggcm93cy5cbiAqXG4gKiBUaGUgbW92ZW1lbnQgaXRzZWxmIGlzIGEgcGxhaW4gbG9vcGluZyBgdHJhbnNsYXRlWCgwJSkg4oaSIHRyYW5zbGF0ZVgoLTEwMCUpYCB0cmFuc2Zvcm1cbiAqIGFuaW1hdGlvbiBjcmVhdGVkIHdpdGggYGVsZW1lbnQuYW5pbWF0ZSgpYC4gVGhlIGJyb3dzZXIgcnVucyBpdCBvbiB0aGUgY29tcG9zaXRvciwgc28gb25jZSBhXG4gKiBtYXJxdWVlIGlzIHJlbmRlcmVkIHRoZXJlIGlzIHplcm8gcGVyLWZyYW1lIEphdmFTY3JpcHQg4oCUIG5vIGFuaW1hdGlvbiBsaWJyYXJ5LCBubyByQUYgbG9vcCxcbiAqIG5vIHN0eWxlIHdyaXRlcyBmcm9tIHRoZSBtYWluIHRocmVhZC4gUGxheWJhY2sgKHBhdXNlLCByZXN1bWUsIGp1bXBpbmcgdG8gYSBwb3NpdGlvbikgZ29lc1xuICogdGhyb3VnaCB0aGUgQW5pbWF0aW9uIG9iamVjdHMgdGhlIGJyb3dzZXIgaGFuZHMgYmFjay5cbiAqXG4gKiBJbnNwaXJlZCBieTogaHR0cHM6Ly9yeWFubXVsbGlnYW4uZGV2L2Jsb2cvY3NzLW1hcnF1ZWUvXG4gKlxuICogTW9kaWZpZXJzOlxuICogIC0gc3BlZWQuWDogQWRqdXN0cyB0aGUgc2Nyb2xsaW5nIHBhY2UgKGUuZy4sIHNwZWVkLjYwIHNldHMgNjBweCBwZXIgc2Vjb25kKS4gTmVnYXRpdmUgdmFsdWUgc2Nyb2xscyBiYWNrd2FyZHNcbiAqICAtIGZpbGw6IEVuc3VyZXMgY29udGVudCBpcyByZXBlYXRlZCBhbmQgYXBwZW5kZWQgdW50aWwgdGhlIHZpc3VhbCBhcmVhIGlzIGNvbXBsZXRlbHkgY292ZXJlZC5cbiAqICAtIHBhdXNlOiBCZWdpbnMgdGhlIG1hcnF1ZWUgaW4gYSBwYXVzZWQgc3RhdGUsIHJlcXVpcmluZyBhIHBsYXkgYWN0aW9uIHRvIGJlZ2luIG1vdmluZy5cbiAqXG4gKiBHZW5lcmFsIHVzYWdlOlxuICogIDEuIE1hcmsgdGhlIHNjcm9sbGVkIGNvbnRlbnQgd2l0aCB4LW1hcnF1ZWU6c291cmNlLlxuICogIDIuIFByb3ZpZGUgYW4gZW1wdHkgY29udGFpbmVyIHdpdGggeC1tYXJxdWVlOnRhcmdldCwgdG8gcmVjZWl2ZSB0aGUgZHVwbGljYXRlZCBzZXQgb2YgaXRlbXMuXG4gKiAgMy4gQXR0YWNoIHgtbWFycXVlZSB0byBhIHBhcmVudCBlbGVtZW50IHdpdGggb3B0aW9uYWwgbW9kaWZpZXJzIGxpa2Ugc3BlZWQuWCwgZmlsbCwgb3IgcGF1c2UuXG4gKlxuICogUHJvZ3JhbW1hdGljIGNvbnRyb2wgaXMgYXZhaWxhYmxlIHRocm91Z2ggJG1hcnF1ZWU6IGlzUGxheWluZywgcGxheSgpLCBwYXVzZSgpLCB0b2dnbGUoKSxcbiAqIHNjcm9sbFRvKGVsZW1lbnQpIHRvIGp1bXAgdGhlIGxvb3Agc28gYW4gZWxlbWVudCBzaXRzIGF0IHRoZSB2aXNpYmxlIGxlZnQgZWRnZSwgaXNSZWFkeVxuICogKHRydWUgYWZ0ZXIgdGhlIGZpcnN0IHJlbmRlciksIGFuZCBvZmZzZXRWYWx1ZSAodGhlIHJhdyBNb3Rpb24gdmFsdWUgdGhhdCBkcml2ZXMgYm90aCByb3dzKS5cbiAqXG4gKiBBY2Nlc3NpYmlsaXR5OiBrZXlib2FyZCBmb2N1cyBpbnNpZGUgdGhlIG1hcnF1ZWUgcGF1c2VzIGl0IGFuZCBzY3JvbGxzIHRoZSBmb2N1c2VkIGVsZW1lbnRcbiAqIGludG8gdmlldzsgZm9jdXMgbGVhdmluZyByZXN1bWVzIHBsYXliYWNrIG9ubHkgaWYgZm9jdXMgY2F1c2VkIHRoZSBwYXVzZS4gQ2xvbmVzIGFyZVxuICogYXJpYS1oaWRkZW4gYW5kIHJlbW92ZWQgZnJvbSB0aGUgdGFiIG9yZGVyLCBhbmQgaWRzIGFyZSBzdHJpcHBlZCBmcm9tIHRoZW0uIFdpdGhcbiAqIHByZWZlcnMtcmVkdWNlZC1tb3Rpb24gdGhlIHJvd3MgZG8gbm90IGFuaW1hdGUsIGFuZCB0aGUgc2Nyb2xsIG1vZGlmaWVyIGlzIGFsc28gZGlzYWJsZWRcbiAqIG9uIGxvdy1wb3dlciBkZXZpY2VzLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgIDxkaXYgeC1kYXRhIHgtbWFycXVlZS5zcGVlZC42MC5maWxsPlxuICogICAgIDxkaXYgeC1tYXJxdWVlOnNvdXJjZT5cbiAqICAgICAgIDxzcGFuPkZpcnN0IEl0ZW08L3NwYW4+XG4gKiAgICAgICA8c3Bhbj5TZWNvbmQgSXRlbTwvc3Bhbj5cbiAqICAgICAgIDxzcGFuPlRoaXJkIEl0ZW08L3NwYW4+XG4gKiAgICAgPC9kaXY+XG4gKiAgICAgPGRpdiB4LW1hcnF1ZWU6dGFyZ2V0IGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvZGl2PlxuICogICA8L2Rpdj5cbiAqXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChBbHBpbmUpIHtcbiAgICBBbHBpbmUuZGlyZWN0aXZlKCdtYXJxdWVlJywgKCRlbCwgeyB2YWx1ZSwgbW9kaWZpZXJzIH0pID0+IHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBpZiAodmFsdWUgPT0gJ3NvdXJjZScpIHtcbiAgICAgICAgICAgIC8vIENoaWxkIGRpcmVjdGl2ZXMgcmVnaXN0ZXIgdGhlIHR3byBtb3Zpbmcgcm93cyBvbiB0aGUgcGFyZW50IHgtZGF0YSBpbnN0YW5jZS5cbiAgICAgICAgICAgIEFscGluZS5iaW5kKCRlbCwge1xuICAgICAgICAgICAgICAgICd4LWluaXQnKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX19tYXJxdWVlX2lzUm9vdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2Fybk1pc3NpbmdQYXJlbnREaXJlY3RpdmUoJ3gtbWFycXVlZTpzb3VyY2UnLCAneC1tYXJxdWVlJywgdGhpcy4kZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX3NvdXJjZUVsID0gdGhpcy4kZWw7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbHVlID09ICd0YXJnZXQnKSB7XG4gICAgICAgICAgICBBbHBpbmUuYmluZCgkZWwsIHtcbiAgICAgICAgICAgICAgICAneC1pbml0JygpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9fbWFycXVlZV9pc1Jvb3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhcm5NaXNzaW5nUGFyZW50RGlyZWN0aXZlKCd4LW1hcnF1ZWU6dGFyZ2V0JywgJ3gtbWFycXVlZScsIHRoaXMuJGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV90YXJnZXRFbCA9IHRoaXMuJGVsO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBzcGVlZCA9IChfYSA9IGdldE51bWJlck1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCAnc3BlZWQnKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogREVGQVVMVF9TUEVFRDtcbiAgICAgICAgICAgIGxldCBmaWxsID0gbW9kaWZpZXJzLmluY2x1ZGVzKCdmaWxsJyk7XG4gICAgICAgICAgICBsZXQgYXV0b3BsYXkgPSAhbW9kaWZpZXJzLmluY2x1ZGVzKCdwYXVzZScpO1xuICAgICAgICAgICAgQWxwaW5lLmJpbmQoJGVsLCB7XG4gICAgICAgICAgICAgICAgJ3gtZGF0YScoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfaXNSb290OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX3N0YXRlOiBidWlsZE1hcnF1ZWVTdGF0ZSh7IGlzUGxheWluZzogYXV0b3BsYXkgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfaXNJbml0aWFsaXplZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfaXNBY3RpdmU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX2lzUmVuZGVyaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV93YXNQbGF5aW5nQmVmb3JlS2V5Ym9hcmRGb2N1czogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfc291cmNlRWw6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfdGFyZ2V0RWw6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfb3JpZ2luYWxDb250ZW50RnJhZ21lbnQ6IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV9vcmlnaW5hbENvbnRlbnRXaWR0aDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV9zb3VyY2VFbFdpZHRoOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX3ZpZXdwb3J0V2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfYW5pbWF0aW9uczogW10sXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfY29udGVudEhhc0FscGluZURpcmVjdGl2ZXM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX2NhbmNlbEFmdGVyTmV4dFBhaW50OiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX2FmdGVyTmV4dFBhaW50UmVzb2x2ZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV9yZW5kZXJGcmFtZUlkOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX2lzUmVzaXplTWVhc3VyZW1lbnRTY2hlZHVsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX2lzRGVzdHJveWVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV9yZXNldFJlbmRlcmluZ0ZyYW1lSWQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfc2VudGluZWw6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfY2FuY2VsSW5WaWV3OiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX21lYXN1cmVXaWR0aHMoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVhZHMgYXJlIGRlZmVycmVkIHVudGlsIGFmdGVyIHBhaW50IHNvIG11dGF0aW9ucyBmcm9tIGluaXQvcmVuZGVyIGhhdmUgc2V0dGxlZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVhZExheW91dEFmdGVyUGFpbnQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9vcmlnaW5hbENvbnRlbnRXaWR0aCA9IHRoaXMuX19tYXJxdWVlX3NvdXJjZUVsLmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9zb3VyY2VFbFdpZHRoID0gdGhpcy5fX21hcnF1ZWVfb3JpZ2luYWxDb250ZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX3ZpZXdwb3J0V2lkdGggPSB0aGlzLiRlbC5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXQgX19tYXJxdWVlX2FuaW1hdGlvbkR1cmF0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9fbWFycXVlZV9zb3VyY2VFbFdpZHRoIC8gTWF0aC5hYnMoc3BlZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICogRXh0ZW5kcyB0aGUgc291cmNlIHJvdyBpdHNlbGYgZm9yIHNob3J0IGNvbnRlbnQuIFRoZSBzZW50aW5lbCBzZXBhcmF0ZXMgb3JpZ2luYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGNvbnRlbnQgZnJvbSBmaWxsIGNsb25lcyBzbyBsYXRlciByZW5kZXJzIGNhbiBkZWxldGUgb25seSBnZW5lcmF0ZWQgbm9kZXMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV9maWxsU291cmNlKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fX21hcnF1ZWVfb3JpZ2luYWxDb250ZW50V2lkdGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHJlYWRMYXlvdXRBZnRlclBhaW50KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9vcmlnaW5hbENvbnRlbnRXaWR0aCA9IHRoaXMuX19tYXJxdWVlX3NvdXJjZUVsLmNsaWVudFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX3NvdXJjZUVsV2lkdGggPSB0aGlzLl9fbWFycXVlZV9vcmlnaW5hbENvbnRlbnRXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZWVkc1dpZHRoQWZ0ZXJEb21DaGFuZ2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWxwaW5lLm11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX19tYXJxdWVlX3NlbnRpbmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXZlcnl0aGluZyBhZnRlciB0aGlzIG1hcmtlciBpcyBnZW5lcmF0ZWQgYW5kIGNhbiBiZSByZXBsYWNlZCBvbiByZXNpemUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfc2VudGluZWwgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCdtYXJxdWVlLXNlbnRpbmVsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfc291cmNlRWwuYXBwZW5kQ2hpbGQodGhpcy5fX21hcnF1ZWVfc2VudGluZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5leHQgPSB0aGlzLl9fbWFycXVlZV9zZW50aW5lbC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAobmV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0b1JlbW92ZSA9IG5leHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHQgPSBuZXh0Lm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9zb3VyY2VFbC5yZW1vdmVDaGlsZCh0b1JlbW92ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5lZWRzV2lkdGhBZnRlckRvbUNoYW5nZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmVlZHNXaWR0aEFmdGVyRG9tQ2hhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCByZWFkTGF5b3V0QWZ0ZXJQYWludCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfb3JpZ2luYWxDb250ZW50V2lkdGggPSB0aGlzLl9fbWFycXVlZV9zb3VyY2VFbC5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9zb3VyY2VFbFdpZHRoID0gdGhpcy5fX21hcnF1ZWVfb3JpZ2luYWxDb250ZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzcGFjZVRvRmlsbCA9IE1hdGgubWF4KDAsIHRoaXMuX19tYXJxdWVlX3ZpZXdwb3J0V2lkdGggLSB0aGlzLl9fbWFycXVlZV9vcmlnaW5hbENvbnRlbnRXaWR0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzcGFjZVRvRmlsbCA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gWmVybyAob3Igbm90LXlldC1sYWlkLW91dCkgY29udGVudCB3aWR0aCBtYWtlcyB0aW1lc1RvQ2xvbmUgSW5maW5pdHkgYW5kIGZyZWV6ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIG1haW4gdGhyZWFkIGluIHRoZSBjbG9uZSBsb29wIOKAlCBDeXByZXNzIHRoZW4gY2FuJ3QgZXZlbiBmaXJlIGNvbW1hbmQgdGltZW91dHMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKHRoaXMuX19tYXJxdWVlX29yaWdpbmFsQ29udGVudFdpZHRoKSB8fCB0aGlzLl9fbWFycXVlZV9vcmlnaW5hbENvbnRlbnRXaWR0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGltZXNUb0Nsb25lID0gTWF0aC5jZWlsKHNwYWNlVG9GaWxsIC8gdGhpcy5fX21hcnF1ZWVfb3JpZ2luYWxDb250ZW50V2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIU51bWJlci5pc0Zpbml0ZSh0aW1lc1RvQ2xvbmUpIHx8IHRpbWVzVG9DbG9uZSA8PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aW1lc1RvQ2xvbmU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xvbmUgPSB0aGlzLl9fbWFycXVlZV9vcmlnaW5hbENvbnRlbnRGcmFnbWVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBQcmVwYXJlIGRldGFjaGVkIGNsb25lcyBvbmNlIGluc3RlYWQgb2YgcmUtc2Nhbm5pbmcgcmVuZGVyZWQgbm9kZXMgZXZlcnkgcmVuZGVyLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShjbG9uZS5jaGlsZHJlbikuZm9yRWFjaCgoY2hpbGQpID0+IHByZXBhcmVDbG9uZWRTb3VyY2VFbGVtZW50KGNoaWxkKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFscGluZS5tdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX3NlbnRpbmVsLmFmdGVyKGZyYWdtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fX21hcnF1ZWVfY29udGVudEhhc0FscGluZURpcmVjdGl2ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWxwaW5lLnNraXBEdXJpbmdDbG9uZSgoKSA9PiBBbHBpbmUuaW5pdFRyZWUodGhpcy5fX21hcnF1ZWVfc291cmNlRWwpKSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9hZnRlck5leHRQYWludFJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX2NhbmNlbEFmdGVyTmV4dFBhaW50ID0gYWZ0ZXJOZXh0UGFpbnQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9jYW5jZWxBZnRlck5leHRQYWludCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX2FmdGVyTmV4dFBhaW50UmVzb2x2ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX3NvdXJjZUVsV2lkdGggPSB0aGlzLl9fbWFycXVlZV9zb3VyY2VFbC5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX2Nsb25lU291cmNlVG9UYXJnZXQoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdpdGhvdXQgZW5vdWdoIGNvbnRlbnQgdG8gbG9vcCwgdGhlIHRhcmdldCB3b3VsZCBvbmx5IHJlcGVhdCBzdGF0aWMgY29udGVudC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXF1YWwgd2lkdGggaXMgbm90IGVub3VnaCDigJQgY29udGVudCBtdXN0IGJlIHN0cmljdGx5IHdpZGVyIHRoYW4gdGhlIHZpZXdwb3J0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fX21hcnF1ZWVfc291cmNlRWxXaWR0aCA8PSB0aGlzLl9fbWFycXVlZV92aWV3cG9ydFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFscGluZS5tdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGFyZ2V0IGlzIHJlYnVpbHQgZnJvbSB0aGUgZmluYWxpemVkIHNvdXJjZSBzbyBmaWxsIGNsb25lcyBhcmUgaW5jbHVkZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjbG9uZSA9IHRoaXMuX19tYXJxdWVlX3NvdXJjZUVsLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LmZyb20oY2xvbmUuY2hpbGRyZW4pLmZvckVhY2goKGNoaWxkKSA9PiBwcmVwYXJlQ2xvbmVkVGFyZ2V0RWxlbWVudChjaGlsZCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfdGFyZ2V0RWwucmVwbGFjZUNoaWxkcmVuKC4uLmNsb25lLmNoaWxkcmVuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlLWluaXRpYWxpemUgYWxwaW5lIG9uIGNsb25lZCBub2Rlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX19tYXJxdWVlX2NvbnRlbnRIYXNBbHBpbmVEaXJlY3RpdmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWxwaW5lLnNraXBEdXJpbmdDbG9uZSgoKSA9PiBBbHBpbmUuaW5pdFRyZWUodGhpcy5fX21hcnF1ZWVfdGFyZ2V0RWwpKSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfc2V0dXBBbmltYXRpb25zKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkdXJhdGlvbk1zID0gdGhpcy5fX21hcnF1ZWVfYW5pbWF0aW9uRHVyYXRpb24gKiAxMDAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNGaW5pdGUoZHVyYXRpb25NcykgfHwgZHVyYXRpb25NcyA8PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hvdWxkUGxheSA9IHRoaXMuX19tYXJxdWVlX3N0YXRlLmlzUGxheWluZyAmJiB0aGlzLl9fbWFycXVlZV9zb3VyY2VFbFdpZHRoID4gdGhpcy5fX21hcnF1ZWVfdmlld3BvcnRXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDYXJyeSB0aGUgbG9vcCBwb3NpdGlvbiBhY3Jvc3MgcmVidWlsZHMgKHJlc2l6ZSwgc2Nyb2xsaW5nIGJhY2sgaW50b1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZpZXcpIHNvIHRoZSBjb250ZW50IGRvZXNuJ3QgdmlzaWJseSBqdW1wIGJhY2sgdG8gdGhlIHN0YXJ0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsb29wUHJvZ3Jlc3MgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzQW5pbWF0aW9uID0gdGhpcy5fX21hcnF1ZWVfYW5pbWF0aW9uc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldmlvdXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldmlvdXNUaW1lID0gcHJldmlvdXNBbmltYXRpb24uY3VycmVudFRpbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzRHVyYXRpb24gPSAoX2EgPSBwcmV2aW91c0FuaW1hdGlvbi5lZmZlY3QpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRUaW1pbmcoKS5kdXJhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcmV2aW91c1RpbWUgPT09ICdudW1iZXInICYmIHR5cGVvZiBwcmV2aW91c0R1cmF0aW9uID09PSAnbnVtYmVyJyAmJiBwcmV2aW91c0R1cmF0aW9uID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9vcFByb2dyZXNzID0gKCgocHJldmlvdXNUaW1lIC8gcHJldmlvdXNEdXJhdGlvbikgJSAxKSArIDEpICUgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9jYW5jZWxBbmltYXRpb25zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT25lIGl0ZXJhdGlvbiBtb3ZlcyBhIHJvdyBleGFjdGx5IGl0cyBvd24gd2lkdGggdG8gdGhlIGxlZnQ7IHRoZSB0YXJnZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByb3cgc2xpZGluZyBpbiBiZWhpbmQgbWFrZXMgdGhlIHdyYXAtYXJvdW5kIGludmlzaWJsZS4gYGRpcmVjdGlvbjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXZlcnNlYCBwbGF5cyB0aGUgc2FtZSBrZXlmcmFtZXMgYmFja3dhcmRzIGZvciBuZWdhdGl2ZSBzcGVlZHMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ZnJhbWVzID0gW3sgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwJSknIH0sIHsgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtMTAwJSknIH1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbk1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRpb25zOiBJbmZpbml0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFzaW5nOiAnbGluZWFyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBzcGVlZCA8IDAgPyAncmV2ZXJzZScgOiAnbm9ybWFsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJvdGggcm93cyBnZXQgdGhlaXIgb3duIEFuaW1hdGlvbiB3aXRoIGlkZW50aWNhbCB0aW1pbmcuIFRoZSBzaGFyZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkb2N1bWVudCB0aW1lbGluZSBrZWVwcyB0aGVtIGxvY2tlZCB0b2dldGhlcjsgdGhlIGV4cGxpY2l0IGN1cnJlbnRUaW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYmVsb3cgc3RhcnRzIHRoZW0gYXQgdGhlIHNhbWUgcG9pbnQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfYW5pbWF0aW9ucyA9IFt0aGlzLl9fbWFycXVlZV9zb3VyY2VFbCwgdGhpcy5fX21hcnF1ZWVfdGFyZ2V0RWxdLm1hcCgocm93RWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5pbWF0aW9uID0gcm93RWwuYW5pbWF0ZShrZXlmcmFtZXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24uY3VycmVudFRpbWUgPSBsb29wUHJvZ3Jlc3MgKiBkdXJhdGlvbk1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNob3VsZFBsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtlZXAgdGhlIGFuaW1hdGlvbiByZWFkeSBldmVuIHdoZW4gdGhlcmUgaXMgbm90IGVub3VnaCBjb250ZW50IHRvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmltYXRlLCBzbyBwbGF5KCkgYW5kIHNjcm9sbFRvKCkgc3RpbGwgaGF2ZSBzb21ldGhpbmcgdG8gZHJpdmUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24ucGF1c2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV9jYW5jZWxBbmltYXRpb25zKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYW5pbWF0aW9uIG9mIHRoaXMuX19tYXJxdWVlX2FuaW1hdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uLmNhbmNlbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9hbmltYXRpb25zID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX3Njcm9sbFRvKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkdXJhdGlvbk1zID0gdGhpcy5fX21hcnF1ZWVfYW5pbWF0aW9uRHVyYXRpb24gKiAxMDAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNGaW5pdGUoZHVyYXRpb25NcykgfHwgZHVyYXRpb25NcyA8PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSnVtcCB0aGUgYW5pbWF0aW9uIHRpbWVsaW5lIHNvIGtleWJvYXJkIGZvY3VzIGxhbmRzIG5lYXIgdGhlIHZpc2libGUgbGVmdCBlZGdlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXQgPSBlbGVtZW50Lm9mZnNldExlZnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxlZnRTcGFjaW5nQnVmZmVyID0gMjQ7IC8vIChweCkgVG8gYWxsb3cgZm9yIHRoZSBmb2N1cyBvdXRsaW5lIHRvIGJlIGZ1bGx5IHZpc2libGUgd2hlbiB0YWJiZWQgdGhyb3VnaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gdGhlIGFuaW1hdGlvbiBpcyByZXZlcnNlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzcGVlZCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0gdGhpcy5fX21hcnF1ZWVfc291cmNlRWxXaWR0aCAtIG9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdFNwYWNpbmdCdWZmZXIgPSBsZWZ0U3BhY2luZ0J1ZmZlciAqIC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50UG9zaXRpb25QZXJjZW50YWdlID0gKG9mZnNldCAtIGxlZnRTcGFjaW5nQnVmZmVyKSAvIHRoaXMuX19tYXJxdWVlX3NvdXJjZUVsV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudFBvc2l0aW9uVGltZSA9IGVsZW1lbnRQb3NpdGlvblBlcmNlbnRhZ2UgKiBkdXJhdGlvbk1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNGaW5pdGUoZWxlbWVudFBvc2l0aW9uVGltZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXcmFwcGVkIGludG8gb25lIGxvb3Agc28gYSBwb3NpdGlvbiBqdXN0IGJlZm9yZSB0aGUgcm93IHN0YXJ0IGRvZXNuJ3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsYW5kIGluIHRoZSBhbmltYXRpb24ncyBiZWZvcmUtcGhhc2UsIHdoZXJlIG5vIHRyYW5zZm9ybSBhcHBsaWVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdyYXBwZWRUaW1lID0gKChlbGVtZW50UG9zaXRpb25UaW1lICUgZHVyYXRpb25NcykgKyBkdXJhdGlvbk1zKSAlIGR1cmF0aW9uTXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBhbmltYXRpb24gb2YgdGhpcy5fX21hcnF1ZWVfYW5pbWF0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24uY3VycmVudFRpbWUgPSB3cmFwcGVkVGltZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgX19tYXJxdWVlX3JlbmRlcigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX19tYXJxdWVlX2lzQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX19tYXJxdWVlX2lzUmVuZGVyaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfaXNSZW5kZXJpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSZW5kZXIgaXMgdGhlIG9ubHkgcGF0aCB0aGF0IG11dGF0ZXMgZ2VuZXJhdGVkIG1hcnF1ZWUgY29udGVudC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fX21hcnF1ZWVfbWVhc3VyZVdpZHRocygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmlsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fX21hcnF1ZWVfZmlsbFNvdXJjZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX19tYXJxdWVlX2Nsb25lU291cmNlVG9UYXJnZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9uJ3QgYW5pbWF0ZSBpZiBpbiByZWR1Y2VkIG1vdGlvbiBtb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNSZWR1Y2VkTW90aW9uKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNldHVwIGFuaW1hdGlvbnMgYWZ0ZXIgdGhlIGNvbnRlbnQgaGFzIGJlZW4gY2xvbmVkIGluIG9yZGVyIHRvIG1lYXN1cmUgdGhlIHdpZHRoIG9mIHRoZSBjb250ZW50IGVsZW1lbnQgd2l0aG91dCBjYXVzaW5nIHJlZmxvd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfc2V0dXBBbmltYXRpb25zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfaXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX3Jlc2V0UmVuZGVyaW5nRnJhbWVJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfcmVzZXRSZW5kZXJpbmdGcmFtZUlkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX2lzUmVuZGVyaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfaXNSZW5kZXJpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgX19tYXJxdWVlX3VwZGF0ZVZpZXdwb3J0V2lkdGgoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX19tYXJxdWVlX2lzUmVzaXplTWVhc3VyZW1lbnRTY2hlZHVsZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9pc1Jlc2l6ZU1lYXN1cmVtZW50U2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgcmVhZCBpcyBkZWZlcnJlZCB0byByZWFkTGF5b3V0QWZ0ZXJQYWludCBzbyBpdCBsYW5kcyBpbiB0aGUgc2hhcmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVhZCBiYXRjaCDigJQgbWVhc3VyZWQgYWxvbmdzaWRlIGV2ZXJ5IG90aGVyIGNvbXBvbmVudCBhc2tpbmcgdGhhdCBmcmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBiZWZvcmUgYW55IG9mIHRoZW0gc3RvcmUgYSByZXN1bHQuIFJlYWRpbmcgaGVyZSAob3IgaW4gYSByQUYpIHdvdWxkIGZvcmNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYSByZWZsb3cgd2hlbmV2ZXIgc29tZXRoaW5nIGVsc2UgaGFkIGFscmVhZHkgd3JpdHRlbiBzdHlsZXMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZExheW91dEFmdGVyUGFpbnQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9pc1Jlc2l6ZU1lYXN1cmVtZW50U2NoZWR1bGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fbWFycXVlZV9pc0Rlc3Ryb3llZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kZWwuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigodmlld3BvcnRXaWR0aCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmlld3BvcnRXaWR0aCA9PSBudWxsIHx8IHRoaXMuX19tYXJxdWVlX2lzRGVzdHJveWVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgZG9jdW1lbnQgcmVzaXplcyBjb25zdGFudGx5IHdoaWxlIHRoZSBwYWdlIGxvYWRzIOKAlCBldmVyeSBpbWFnZSBhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2VjdGlvbiBhcnJpdmluZyBtYWtlcyBpdCB0YWxsZXIg4oCUIGFuZCB4LXJlc2l6ZS5kb2N1bWVudCByZXBvcnRzIGFsbCBvZlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpdC4gVGhlIG1hcnF1ZWUgb25seSBjYXJlcyBhYm91dCBpdHMgd2lkdGguIFJlLXJlbmRlcmluZyBpcyB0aGUgZnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZWJ1aWxkIChkZWxldGUgY2xvbmVzLCByZS1jbG9uZSwgcmUtaW5pdGlhbGl6ZSksIHNvIGl0IG11c3Qgbm90IHJ1blxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGVuIHRoZSB3aWR0aCBpcyB0aGUgc2FtZSBhcyBsYXN0IHRpbWUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fbWFycXVlZV9pc0luaXRpYWxpemVkICYmIHZpZXdwb3J0V2lkdGggPT09IHRoaXMuX19tYXJxdWVlX3ZpZXdwb3J0V2lkdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX3ZpZXdwb3J0V2lkdGggPSB2aWV3cG9ydFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9yZW5kZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBfX21hcnF1ZWVfcGF1c2VGb3JLZXlib2FyZEZvY3VzKHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFByZXNlcnZlIG1hbnVhbCBwYXVzZWQgc3RhdGU6IGZvY3Vzb3V0IHNob3VsZCBvbmx5IHJlc3VtZSBpZiBmb2N1cyBwYXVzZWQgcGxheWJhY2suXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfd2FzUGxheWluZ0JlZm9yZUtleWJvYXJkRm9jdXMgPSB0aGlzLl9fbWFycXVlZV9zdGF0ZS5pc1BsYXlpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfc3RhdGUucGF1c2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9zY3JvbGxUbyh0YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV9yZXN1bWVBZnRlcktleWJvYXJkRm9jdXMoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9fbWFycXVlZV93YXNQbGF5aW5nQmVmb3JlS2V5Ym9hcmRGb2N1cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19tYXJxdWVlX3dhc1BsYXlpbmdCZWZvcmVLZXlib2FyZEZvY3VzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfc3RhdGUucGxheSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9fbWFycXVlZV90ZWFyZG93bigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9jYW5jZWxBbmltYXRpb25zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfaXNJbml0aWFsaXplZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluaXQoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fX21hcnF1ZWVfc291cmNlRWwgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTb3VyY2UgZWxlbWVudCBub3QgZm91bmQsIHgtbWFycXVlZTpzb3VyY2UgbXVzdCBiZSBhcHBsaWVkIHRvIGEgY2hpbGQgZWxlbWVudCBvZiB0aGUgeC1tYXJxdWVlIGRpcmVjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fbWFycXVlZV90YXJnZXRFbCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RhcmdldCBlbGVtZW50IG5vdCBmb3VuZCwgeC1tYXJxdWVlOnRhcmdldCBtdXN0IGJlIGFwcGxpZWQgdG8gYSBjaGlsZCBlbGVtZW50IG9mIHRoZSB4LW1hcnF1ZWUgZGlyZWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfdGFyZ2V0RWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEtlZXAgYSBjbGVhbiBjb3B5IG9mIHRoZSBhdXRob3ItcHJvdmlkZWQgY29udGVudDsgZmlsbCBjbG9uZXMgYXJlIGdlbmVyYXRlZCBmcm9tIHRoaXMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LmZyb20odGhpcy5fX21hcnF1ZWVfc291cmNlRWwuY2hpbGRyZW4pLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNsb25lID0gZWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVCbGFja2xpc3RlZEF0dHJpYnV0ZXMoY2xvbmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfb3JpZ2luYWxDb250ZW50RnJhZ21lbnQuYXBwZW5kKGNsb25lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlY2lkZWQgb25jZSBoZXJlIHNvIGV2ZXJ5IHJlbmRlciBjYW4gc2tpcCBpbml0aWFsaXppbmcgQWxwaW5lIG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNsb25lcyBvZiBjb250ZW50IHRoYXQgaGFzIG5vdGhpbmcgZm9yIEFscGluZSB0byBpbml0aWFsaXplLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9jb250ZW50SGFzQWxwaW5lRGlyZWN0aXZlcyA9IGhhc0FscGluZURpcmVjdGl2ZXModGhpcy5fX21hcnF1ZWVfb3JpZ2luYWxDb250ZW50RnJhZ21lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSZW5kZXJpbmcgaXMgbGF6eTogZG8gdGhlIGV4cGVuc2l2ZSBjbG9uZS9tZWFzdXJlIHdvcmsgb25seSB3aGlsZSB0aGUgbWFycXVlZSBpcyB2aXNpYmxlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcigoZW50cmllcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVudHJ5LmlzSW50ZXJzZWN0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fbWFycXVlZV9pc0FjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fbWFycXVlZV9yZW5kZXJGcmFtZUlkICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl9fbWFycXVlZV9yZW5kZXJGcmFtZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9yZW5kZXJGcmFtZUlkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9yZW5kZXJGcmFtZUlkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fX21hcnF1ZWVfaXNBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfcmVuZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9fbWFycXVlZV9pc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fX21hcnF1ZWVfcmVuZGVyRnJhbWVJZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5fX21hcnF1ZWVfcmVuZGVyRnJhbWVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9yZW5kZXJGcmFtZUlkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV90ZWFyZG93bigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUodGhpcy4kZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9jYW5jZWxJblZpZXcgPSAoKSA9PiBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kd2F0Y2goJ19fbWFycXVlZV9zdGF0ZS5pc1BsYXlpbmcnLCAocGxheWluZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGFuaW1hdGlvbiBvZiB0aGlzLl9fbWFycXVlZV9hbmltYXRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGxheWluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbi5wbGF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24ucGF1c2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3Ryb3koKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKF9hID0gdGhpcy5fX21hcnF1ZWVfY2FuY2VsSW5WaWV3KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoX2IgPSB0aGlzLl9fbWFycXVlZV9jYW5jZWxBZnRlck5leHRQYWludCkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfY2FuY2VsQWZ0ZXJOZXh0UGFpbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChfYyA9IHRoaXMuX19tYXJxdWVlX2FmdGVyTmV4dFBhaW50UmVzb2x2ZSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmNhbGwodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfYWZ0ZXJOZXh0UGFpbnRSZXNvbHZlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fX21hcnF1ZWVfcmVuZGVyRnJhbWVJZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl9fbWFycXVlZV9yZW5kZXJGcmFtZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfcmVuZGVyRnJhbWVJZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fbWFycXVlZV9yZXNldFJlbmRlcmluZ0ZyYW1lSWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5fX21hcnF1ZWVfcmVzZXRSZW5kZXJpbmdGcmFtZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfcmVzZXRSZW5kZXJpbmdGcmFtZUlkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfY2FuY2VsQW5pbWF0aW9ucygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChfZCA9IHRoaXMuX19tYXJxdWVlX3NvdXJjZUVsKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QucmVwbGFjZUNoaWxkcmVuKHRoaXMuX19tYXJxdWVlX29yaWdpbmFsQ29udGVudEZyYWdtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fbWFycXVlZV9vcmlnaW5hbENvbnRlbnRGcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoX2UgPSB0aGlzLl9fbWFycXVlZV9zZW50aW5lbCkgPT09IG51bGwgfHwgX2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9lLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdAZm9jdXNpbic6ICdfX21hcnF1ZWVfcGF1c2VGb3JLZXlib2FyZEZvY3VzKCRldmVudC50YXJnZXQpJyxcbiAgICAgICAgICAgICAgICAnQGZvY3Vzb3V0JzogJ19fbWFycXVlZV9yZXN1bWVBZnRlcktleWJvYXJkRm9jdXMoKScsXG4gICAgICAgICAgICAgICAgJ3gtcmVzaXplLmRvY3VtZW50JzogQWxwaW5lLmRlYm91bmNlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX21hcnF1ZWVfdXBkYXRlVmlld3BvcnRXaWR0aCgpO1xuICAgICAgICAgICAgICAgIH0sIFZJRVdQT1JUX1JFU0laRV9ERUJPVU5DRV9NUyksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBkaXJlY3RpdmU6IHgtbWFycXVlZToke3ZhbHVlfWApO1xuICAgICAgICB9XG4gICAgfSkuYmVmb3JlKCdiaW5kJyk7XG4gICAgQWxwaW5lLm1hZ2ljKCdtYXJxdWVlJywgKCRlbCkgPT4ge1xuICAgICAgICBjb25zdCAkZGF0YSA9IEFscGluZS4kZGF0YSgkZWwpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0IGlzUGxheWluZygpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChfYSA9ICRkYXRhLl9fbWFycXVlZV9zdGF0ZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmlzUGxheWluZztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwbGF5KCkge1xuICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICAoX2EgPSAkZGF0YS5fX21hcnF1ZWVfc3RhdGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wbGF5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGF1c2UoKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIChfYSA9ICRkYXRhLl9fbWFycXVlZV9zdGF0ZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnBhdXNlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9nZ2xlKCkge1xuICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICAoX2EgPSAkZGF0YS5fX21hcnF1ZWVfc3RhdGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50b2dnbGUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzY3JvbGxUbyhlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIChfYSA9ICRkYXRhLl9fbWFycXVlZV9zY3JvbGxUbykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwoJGRhdGEsIGVsZW1lbnQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldCBpc1JlYWR5KCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkZGF0YS5fX21hcnF1ZWVfaXNJbml0aWFsaXplZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5mdW5jdGlvbiBidWlsZE1hcnF1ZWVTdGF0ZShvcHRpb25zKSB7XG4gICAgdmFyIF9hO1xuICAgIHJldHVybiB7XG4gICAgICAgIGlzUGxheWluZzogKF9hID0gb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmlzUGxheWluZykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogZmFsc2UsXG4gICAgICAgIHBsYXkoKSB7XG4gICAgICAgICAgICB0aGlzLmlzUGxheWluZyA9IHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIHBhdXNlKCkge1xuICAgICAgICAgICAgdGhpcy5pc1BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgdG9nZ2xlKCkge1xuICAgICAgICAgICAgdGhpcy5pc1BsYXlpbmcgPSAhdGhpcy5pc1BsYXlpbmc7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbi8qKlxuICogVHJ1ZSB3aGVuIGFueSBlbGVtZW50IGluIHRoZSBjb250ZW50IGNhcnJpZXMgc29tZXRoaW5nIEFscGluZSB3b3VsZCBuZWVkIHRvXG4gKiBpbml0aWFsaXplOiBhbiBgeC1gIGRpcmVjdGl2ZSwgYSBgOmAvYEBgIHNob3J0aGFuZCBiaW5kaW5nLCBvciBhIGxhenktQWxwaW5lIG1hcmtlci5cbiAqXG4gKiBNb3N0IG1hcnF1ZWUgY29udGVudCBpcyBwbGFpbiBtYXJrdXAg4oCUIGxvZ29zLCB0ZXh0LCBsaW5rcyDigJQgYW5kIGluaXRpYWxpemluZyBBbHBpbmUgb25cbiAqIGV2ZXJ5IGNsb25lIG9mIGl0IGlzIHRoZSBtb3N0IGV4cGVuc2l2ZSBwYXJ0IG9mIGEgcmVuZGVyLCBmb3Igbm90aGluZy4gQ2hlY2tlZCBvbmNlIG9uXG4gKiB0aGUgYXV0aG9yZWQgY29udGVudCwgc28gZWFjaCByZW5kZXIgY2FuIHNraXAgdGhhdCB3b3JrIG91dHJpZ2h0LlxuICovXG5mdW5jdGlvbiBoYXNBbHBpbmVEaXJlY3RpdmVzKGNvbnRlbnQpIHtcbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCcqJykpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuaGFzQXR0cmlidXRlKCdkYXRhLWxhenktYWxwaW5lJykpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgZm9yIChjb25zdCBhdHRyaWJ1dGUgb2YgZWxlbWVudC5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gYXR0cmlidXRlLm5hbWU7XG4gICAgICAgICAgICBpZiAobmFtZS5zdGFydHNXaXRoKCd4LScpIHx8IG5hbWUuc3RhcnRzV2l0aCgnOicpIHx8IG5hbWUuc3RhcnRzV2l0aCgnQCcpKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIHByZXBhcmVDbG9uZWRTb3VyY2VFbGVtZW50KGVsZW1lbnQpIHtcbiAgICAvLyBTb3VyY2UgZmlsbCBjbG9uZXMgcmVtYWluIGluIHRoZSB2aXNpYmxlIHJvdywgYnV0IHNob3VsZCBub3QgYmUgYW5ub3VuY2VkIG9yIHRhYmJlZCB0by5cbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIHJlbW92ZUNsb25lZEVsZW1lbnRGcm9tVGFiT3JkZXIoZWxlbWVudCk7XG59XG5mdW5jdGlvbiBwcmVwYXJlQ2xvbmVkVGFyZ2V0RWxlbWVudChlbGVtZW50KSB7XG4gICAgLy8gVGFyZ2V0IGNsb25lcyBkdXBsaWNhdGUgbGl2ZSBzb3VyY2Ugbm9kZXMsIHNvIGJsYWNrbGlzdGVkIGF0dHJpYnV0ZXMgKGlkcykgbXVzdCBiZVxuICAgIC8vIHN0cmlwcGVkIGhlcmUg4oCUIHVubGlrZSBmaWxsIGNsb25lcywgd2hpY2ggY29tZSBmcm9tIHRoZSBhbHJlYWR5LXNhbml0aXplZCBmcmFnbWVudC5cbiAgICByZW1vdmVCbGFja2xpc3RlZEF0dHJpYnV0ZXMoZWxlbWVudCk7XG4gICAgcmVtb3ZlQ2xvbmVkRWxlbWVudEZyb21UYWJPcmRlcihlbGVtZW50KTtcbn1cbmZ1bmN0aW9uIHJlbW92ZUJsYWNrbGlzdGVkQXR0cmlidXRlcyhlbGVtZW50KSB7XG4gICAgZm9yIChjb25zdCBibGFja2xpc3RlZEF0dHJpYnV0ZSBvZiBERUZBVUxUX0FUVFJJQlVURV9CTEFDS0xJU1QpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYmxhY2tsaXN0ZWRBdHRyaWJ1dGUpO1xuICAgICAgICBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFske2JsYWNrbGlzdGVkQXR0cmlidXRlfV1gKS5mb3JFYWNoKChkZXNjZW5kYW50KSA9PiB7XG4gICAgICAgICAgICBkZXNjZW5kYW50LnJlbW92ZUF0dHJpYnV0ZShibGFja2xpc3RlZEF0dHJpYnV0ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHJlbW92ZUNsb25lZEVsZW1lbnRGcm9tVGFiT3JkZXIoZWxlbWVudCkge1xuICAgIC8vIENsb25lcyBhcmUgZGV0YWNoZWQgd2hlbiBwcmVwYXJlZCwgc28gdGFiYmFibGUgY2Fubm90IHJlbHkgb24gbGF5b3V0IHZpc2liaWxpdHkgY2hlY2tzLlxuICAgIGlmIChpc0ZvY3VzYWJsZShlbGVtZW50LCB7IGRpc3BsYXlDaGVjazogJ25vbmUnIH0pKSB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgIH1cbiAgICBmb2N1c2FibGUoZWxlbWVudCwgeyBkaXNwbGF5Q2hlY2s6ICdub25lJyB9KS5mb3JFYWNoKChmb2N1c2FibGVFbGVtZW50KSA9PiB7XG4gICAgICAgIGZvY3VzYWJsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICctMScpO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IEFscGluZSBmcm9tICdhbHBpbmVqcyc7XG5pbXBvcnQge21hcnF1ZWV9IGZyb20gJ0Bncm91cHRob3VnaHQvdHJhZGVjcmFmdC11aS9hbHBpbmUnO1xuXG5BbHBpbmUucGx1Z2luKG1hcnF1ZWUpO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsSUFBSSxlQUFlLENBQUM7QUFDcEIsSUFBSSxtQkFBbUIsQ0FBQztBQUN4QixJQUFJLGlCQUFpQjtBQUNyQixTQUFTLGtCQUFrQjtDQUN2QixpQkFBaUI7Q0FDakIsTUFBTSxRQUFRO0NBQ2QsTUFBTSxZQUFZO0NBQ2xCLGVBQWUsQ0FBQztD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