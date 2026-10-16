
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
import { animate, motionValue, scroll, springValue, styleEffect, transform, transformValue } from "motion";

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
* Runs `fn` once the element has a layout box, inside a ResizeObserver callback:
* after layout (reads are free — no forced reflow) but before paint (style writes
* still land in this frame — no flash of unstyled state).
*
* For an element that is rendered when called, this fires during the current frame's
* rendering steps. For a `display: none` element, it fires when the element first
* gets a box — so measurements are never a meaningless 0×0. Returns a cancel function.
*/
function onFirstLayout(el, fn) {
	const observer = new ResizeObserver((entries) => {
		observer.disconnect();
		fn(entries[0]);
	});
	observer.observe(el);
	return () => observer.disconnect();
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
/**
* Returns a positive numeric modifier value.
*
* @example
* getPositiveNumberModifierValue(['stiffness', '240'], 'stiffness');
* // => 240
*/
function getPositiveNumberModifierValue(modifiers, modifierName) {
	const parsedModifierValue = getNumberModifierValue(modifiers, modifierName);
	if (parsedModifierValue == null || parsedModifierValue <= 0) return null;
	return parsedModifierValue;
}
/**
* Returns a `%` modifier value as a number.
*
* @example
* getPercentageModifierValue(['progress', '50%'], 'progress');
* // => 50
*/
function getPercentageModifierValue(modifiers, modifierName) {
	const rawModifierValue = getModifierValue(modifiers, modifierName);
	if (rawModifierValue == null) return null;
	const percentageMatch = rawModifierValue.match(/^([0-9]+)%$/);
	if (!percentageMatch) return null;
	return Number(percentageMatch[1]);
}
/**
* Returns a `px` modifier value as a number.
*
* @example
* getPixelModifierValue(['offset', '-12px'], 'offset');
* // => -12
*/
function getPixelModifierValue(modifiers, modifierName) {
	const rawModifierValue = getModifierValue(modifiers, modifierName);
	if (rawModifierValue == null) return null;
	const pixelMatch = rawModifierValue.match(/^(-?[0-9]+)px$/);
	if (!pixelMatch) return null;
	return Number(pixelMatch[1]);
}

//#endregion
//#region ../.tradecraft/tradecraft-ui/dist/utils/modifiers/spring.js
const DEFAULT_MIN_SPRING_MASS = .01;
/**
* Returns a spring mass modifier value using a minimum mass as the scale unit.
*
* @example
* getMassModifierValue(['mass', '0'], 'mass');
* // => 0.01
*
* @example
* getMassModifierValue(['mass', '20'], 'mass');
* // => 0.2
*/
function getMassModifierValue(modifiers, modifierName, minimumMass = DEFAULT_MIN_SPRING_MASS) {
	const rawModifierValue = getModifierValue(modifiers, modifierName);
	if (rawModifierValue == null) return null;
	const parsedModifierValue = Number(rawModifierValue);
	if (Number.isNaN(parsedModifierValue) || parsedModifierValue < 0) return null;
	if (parsedModifierValue === 0) return minimumMass;
	return parsedModifierValue * minimumMass;
}
/**
* Applies `.mass`, `.stiffness`, and `.damping` directive modifiers to a spring config.
*
* @example
* getSpringModifierConfig(['mass', '20', 'stiffness', '180'], {mass: 0.5, stiffness: 200, damping: 30});
* // => {mass: 0.2, stiffness: 180, damping: 30}
*/
function getSpringModifierConfig(modifiers, defaultSpringConfig, minimumMass = DEFAULT_MIN_SPRING_MASS) {
	const springConfig = Object.assign({}, defaultSpringConfig);
	const parsedMass = getMassModifierValue(modifiers, "mass", minimumMass);
	if (parsedMass !== null) springConfig.mass = parsedMass;
	const parsedStiffness = getPositiveNumberModifierValue(modifiers, "stiffness");
	if (parsedStiffness !== null) springConfig.stiffness = parsedStiffness;
	const parsedDamping = getPositiveNumberModifierValue(modifiers, "damping");
	if (parsedDamping !== null) springConfig.damping = parsedDamping;
	return springConfig;
}

//#endregion
//#region ../.tradecraft/tradecraft-ui/dist/utils/device.js
function isReducedMotion() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function isLowPowerDevice() {
	return Number(navigator.hardwareConcurrency) <= 2 || Number(navigator.deviceMemory) <= 2;
}

//#endregion
//#region ../.tradecraft/tradecraft-ui/dist/utils/motion.js
/**
* Workaround for an upstream type-identity split in `motion@12.40+`.
*
* The `MotionValue` type that `motion` exports (and that `motionValue()` returns)
* is *not* the same `MotionValue` that motion's own functions (`animate`,
* `springValue`, `transformValue`, `styleEffect`, `scroll`) accept as parameters —
* the exported type is missing `current` / `prev` / `prevFrameValue` /
* `dependents`. The two shapes are mutually un-assignable and neither is nameable,
* so a value created with `motionValue()` cannot be passed to the functions meant
* to consume it without a cast.
*
* This centralizes that unavoidable cast into one named, greppable place instead
* of scattering `as any` across call sites. It is `unknown -> any` (the same
* runtime safety as `as any`); a type-checked signature is impossible here because
* the input type *is* the mismatch. Delete this and its call sites once motion
* ships consistent types.
*/
function motionArg(value) {
	return value;
}

//#endregion
//#region ../.tradecraft/tradecraft-ui/dist/alpine/slider-reveal.js
const SCROLL_PROGRESS_TO_REVEAL_PROGRESS_MULTIPLIER = 30;
const DEFAULT_EDGE_BUFFER_PX = 2;
const MIN_SPRING_MASS = .01;
const SPRING_DEFAULT_CONFIG = {
	stiffness: 300,
	damping: 30,
	mass: .05
};
/**
* Plugin to create an animated before/after slider reveal with optional scroll control.
*
* ## Directives
*
* - `x-slider-reveal` - Root element. Creates the reactive reveal state.
* - `x-slider-reveal:handle` - Handle element translated by the reveal progress.
* - `x-slider-reveal:reveal` - Reveal element clipped by the reveal progress.
*
* ## Root modifiers
*
* - `.vertical` - Uses vertical instead of horizontal movement.
* - `.progress.<n>%` - Sets the resting reveal progress.
* - `.from.<n>%` - Sets the animation's starting progress before it settles to `.progress`.
* - `.mass.<n>` - Spring mass scale for the reveal spring. `.mass.50` equals `0.5`.
* - `.stiffness.<n>` - Spring stiffness. Higher values settle faster.
* - `.damping.<n>` - Spring damping. Higher values reduce overshoot.
* - `.edge-buffer.<n>px` - Keeps the handle this many pixels away from the root edge. Defaults to `2px`.
*
* ## Magic
*
* - `$sliderReveal.progress` - The reveal progress, 0-100. Settable; values clamp to the handle's allowed range.
* - `$sliderReveal.progressValue` - The underlying MotionValue.
* - `$sliderReveal.enableScroll()` / `$sliderReveal.disableScroll()` - Start and stop driving the progress
*   from page scroll. `enableScroll` first animates from `.from` to `.progress`, and does nothing when the
*   user prefers reduced motion or the device reports low power.
*
* @example
*
* ```html
* <div x-slider-reveal.progress.65%.from.10%.stiffness.240.damping.35.mass.50.edge-buffer.4px>
*   <div x-slider-reveal:reveal>After</div>
*   <div x-slider-reveal:handle></div>
* </div>
* ```
*/
function slider_reveal_default(Alpine) {
	Alpine.directive("slider-reveal", ($el, data) => {
		if (data.value == "handle") handleHandle($el, Alpine, data);
		else if (data.value == "reveal") handleReveal($el, Alpine, data);
		else if (data.value == null) handleRoot($el, Alpine, data);
		else throw new Error(`Unknown directive: x-slider-reveal:${data.value}`);
	}).before("bind");
	Alpine.magic("sliderReveal", handleSliderRevealMagic(Alpine));
}
function handleHandle($el, Alpine, _data) {
	Alpine.bind($el, { "x-init"() {
		if (!this.__sliderReveal_isRoot) {
			warnMissingParentDirective("x-slider-reveal:handle", "x-slider-reveal", this.$el);
			return;
		}
		this.__sliderReveal_handle = this.$el;
	} });
}
function handleReveal($el, Alpine, _data) {
	Alpine.bind($el, { "x-init"() {
		if (!this.__sliderReveal_isRoot) {
			warnMissingParentDirective("x-slider-reveal:reveal", "x-slider-reveal", this.$el);
			return;
		}
		this.__sliderReveal_reveal = this.$el;
	} });
}
function handleRoot($el, Alpine, data) {
	var _a, _b;
	const orientation = data.modifiers.includes("vertical") ? "vertical" : "horizontal";
	const edgeBufferPx = (_a = getPixelModifierValue(data.modifiers, "edge-buffer")) !== null && _a !== void 0 ? _a : DEFAULT_EDGE_BUFFER_PX;
	const startProgress = (_b = getPercentageModifierValue(data.modifiers, "progress")) !== null && _b !== void 0 ? _b : 0;
	const fromProgress = getPercentageModifierValue(data.modifiers, "from");
	const springConfig = getSpringModifierConfig(data.modifiers, SPRING_DEFAULT_CONFIG, MIN_SPRING_MASS);
	let initialProgress = startProgress;
	if (fromProgress !== null) initialProgress = Number(fromProgress);
	Alpine.bind($el, { "x-data"() {
		return {
			__sliderReveal_isRoot: true,
			__sliderReveal_rootEl: $el,
			__sliderReveal_progressValue: reactiveMotionValue(Alpine, initialProgress),
			__sliderReveal_progressSpringValue: null,
			__sliderReveal_startProgress: startProgress,
			__sliderReveal_handle: null,
			__sliderReveal_reveal: null,
			__sliderReveal_cancelFirstLayout: null,
			__sliderReveal_scrollAnimationFn: null,
			__sliderReveal_startAnimationFn: null,
			__sliderReveal_stopHandleStyleEffect: null,
			__sliderReveal_stopRevealStyleEffect: null,
			init() {
				this.__sliderReveal_cancelFirstLayout = onFirstLayout(this.$el, () => {
					this.__sliderReveal_cancelFirstLayout = null;
					const effectiveInitialProgress = this.__sliderReveal_getEffectiveProgress(initialProgress);
					this.__sliderReveal_startProgress = this.__sliderReveal_getEffectiveProgress(startProgress);
					this.__sliderReveal_progressValue.set(effectiveInitialProgress);
					this.__sliderReveal_progressSpringValue = springValue(motionArg(this.__sliderReveal_progressValue), springConfig);
					if (this.__sliderReveal_handle) this.__sliderReveal_stopHandleStyleEffect = styleEffect(this.__sliderReveal_handle, { transform: transformValue(() => getHandleTransform(this.__sliderReveal_progressSpringValue.get(), orientation, this.$el, this.__sliderReveal_handle, edgeBufferPx)) });
					if (this.__sliderReveal_reveal) this.__sliderReveal_stopRevealStyleEffect = styleEffect(this.__sliderReveal_reveal, { clipPath: transformValue(() => getRevealClipPath(this.__sliderReveal_getEffectiveProgress(this.__sliderReveal_progressSpringValue.get()), orientation)) });
				});
			},
			destroy() {
				var _a, _b, _c, _d, _e, _f;
				(_a = this.__sliderReveal_cancelFirstLayout) === null || _a === void 0 || _a.call(this);
				this.__sliderReveal_cancelFirstLayout = null;
				this.__sliderReveal_disableScroll();
				(_b = this.__sliderReveal_stopHandleStyleEffect) === null || _b === void 0 || _b.call(this);
				(_c = this.__sliderReveal_stopRevealStyleEffect) === null || _c === void 0 || _c.call(this);
				(_e = (_d = this.__sliderReveal_progressSpringValue) === null || _d === void 0 ? void 0 : _d.stop) === null || _e === void 0 || _e.call(_d);
				(_f = this.__sliderReveal_startAnimationFn) === null || _f === void 0 || _f.stop();
				this.__sliderReveal_startAnimationFn = null;
			},
			__sliderReveal_getEffectiveProgress(progress) {
				return getEffectiveProgress(progress, orientation, this.__sliderReveal_rootEl, this.__sliderReveal_handle, edgeBufferPx);
			},
			async __sliderReveal_enableScroll() {
				if (this.__sliderReveal_scrollAnimationFn) return;
				if (isLowPowerDevice() || isReducedMotion()) return;
				if (this.__sliderReveal_startAnimationFn == null) await this.__sliderReveal_animateToStartProgress();
				else if (this.__sliderReveal_startAnimationFn.state == "running") return;
				let lastScrollProgress = null;
				this.__sliderReveal_scrollAnimationFn = scroll((scrollProgress) => {
					if (lastScrollProgress == null) {
						lastScrollProgress = scrollProgress;
						return;
					}
					const progressDelta = scrollProgress - lastScrollProgress;
					lastScrollProgress = scrollProgress;
					this.__sliderReveal_progressValue.set(this.__sliderReveal_getEffectiveProgress(this.__sliderReveal_progressValue.get() + progressDelta * SCROLL_PROGRESS_TO_REVEAL_PROGRESS_MULTIPLIER));
				}, {
					target: $el,
					offset: ["end start", "start end"]
				});
			},
			__sliderReveal_disableScroll() {
				var _a;
				(_a = this.__sliderReveal_scrollAnimationFn) === null || _a === void 0 || _a.call(this);
				this.__sliderReveal_scrollAnimationFn = null;
			},
			async __sliderReveal_animateToStartProgress() {
				if (this.__sliderReveal_startAnimationFn) return;
				const effectiveFromProgress = fromProgress == null ? this.__sliderReveal_progressValue.get() : this.__sliderReveal_getEffectiveProgress(fromProgress);
				this.__sliderReveal_startAnimationFn = animate(motionArg(this.__sliderReveal_progressValue), [effectiveFromProgress, this.__sliderReveal_startProgress], {
					duration: .3,
					ease: "easeInOut"
				});
				return this.__sliderReveal_startAnimationFn.finished;
			}
		};
	} });
}
function clampProgress(progress) {
	return Math.max(0, Math.min(100, progress));
}
function getEffectiveProgress(progress, orientation, rootEl, handleEl, edgeBufferPx) {
	const boundedProgress = clampProgress(progress);
	if (rootEl == null || handleEl == null) return boundedProgress;
	return getProgressFromHandleTranslateAmount(getClampedHandleTranslateAmount(boundedProgress, orientation, rootEl, handleEl, edgeBufferPx), orientation, rootEl);
}
function getProgressFromHandleTranslateAmount(translateAmount, orientation, rootEl) {
	const rootRect = rootEl.getBoundingClientRect();
	const rootSize = orientation === "vertical" ? rootRect.height : rootRect.width;
	const directionMultiplier = document.dir === "rtl" ? -1 : 1;
	if (rootSize === 0) return 0;
	return clampProgress(translateAmount / (directionMultiplier * rootSize) * 100);
}
function getHandleTransform(progress, orientation, rootEl, handleEl, edgeBufferPx) {
	const translateAmount = getClampedHandleTranslateAmount(progress, orientation, rootEl, handleEl, edgeBufferPx);
	if (orientation === "vertical") return `translateY(${translateAmount}px)`;
	return `translateX(${translateAmount}px)`;
}
function getClampedHandleTranslateAmount(progress, orientation, rootEl, handleEl, edgeBufferPx) {
	const rootRect = rootEl.getBoundingClientRect();
	const rootSize = orientation === "vertical" ? rootRect.height : rootRect.width;
	const directionMultiplier = document.dir === "rtl" ? -1 : 1;
	const progressBasedTranslate = progress / 100 * rootSize;
	const handleContentBounds = getHandleContentBounds(handleEl, orientation);
	if (handleContentBounds == null) return directionMultiplier * progressBasedTranslate;
	const handleRect = handleEl.getBoundingClientRect();
	const handleStart = orientation === "vertical" ? handleRect.top : handleRect.left;
	const contentStartOffset = handleContentBounds.start - handleStart;
	const contentEndOffset = handleContentBounds.end - handleStart;
	const minTranslateAmount = edgeBufferPx - contentStartOffset;
	const maxTranslateAmount = rootSize - edgeBufferPx - contentEndOffset;
	return directionMultiplier * Math.max(minTranslateAmount, Math.min(maxTranslateAmount, progressBasedTranslate));
}
function getHandleContentBounds(handleEl, orientation) {
	const descendantEls = Array.from(handleEl.querySelectorAll("*"));
	if (descendantEls.length === 0) return null;
	let start = Number.POSITIVE_INFINITY;
	let end = Number.NEGATIVE_INFINITY;
	for (const descendantEl of descendantEls) {
		const descendantRect = descendantEl.getBoundingClientRect();
		if (orientation === "vertical") {
			start = Math.min(start, descendantRect.top);
			end = Math.max(end, descendantRect.bottom);
		} else {
			start = Math.min(start, descendantRect.left);
			end = Math.max(end, descendantRect.right);
		}
	}
	return {
		start,
		end
	};
}
function getRevealClipPath(progress, orientation) {
	const percentProgress = transform([0, 100], ["0%", "100%"])(progress);
	if (orientation === "vertical") return document.dir === "rtl" ? `inset(0% 0% ${percentProgress} 0%)` : `inset(${percentProgress} 0% 0% 0%)`;
	return document.dir === "rtl" ? `inset(0% ${percentProgress} 0% 0%)` : `inset(0% 0% 0% ${percentProgress})`;
}
function handleSliderRevealMagic(Alpine) {
	return function($el) {
		const $data = Alpine.$data($el);
		return {
			get progressValue() {
				return $data.__sliderReveal_progressValue;
			},
			get progress() {
				var _a, _b;
				return (_b = (_a = $data.__sliderReveal_progressValue) === null || _a === void 0 ? void 0 : _a.get) === null || _b === void 0 ? void 0 : _b.call(_a);
			},
			set progress(value) {
				var _a, _b;
				(_b = (_a = $data.__sliderReveal_progressValue) === null || _a === void 0 ? void 0 : _a.set) === null || _b === void 0 || _b.call(_a, $data.__sliderReveal_getEffectiveProgress(value));
			},
			enableScroll() {
				$data.__sliderReveal_enableScroll();
			},
			disableScroll() {
				$data.__sliderReveal_disableScroll();
			}
		};
	};
}
/**
* Creates a reactive motion value that updates Alpine state when the motion value changes.
* Used by slider-reveal for before-after progress.
*/
function reactiveMotionValue(_Alpine, initialMotionValue) {
	const value = motionValue(initialMotionValue);
	const reactiveValue = _Alpine.reactive({ value: value.get() });
	value.on("change", (newValue) => {
		reactiveValue.value = newValue;
	});
	return new Proxy(value, { get(target, prop, receiver) {
		if (prop === "get") reactiveValue.value;
		return Reflect.get(target, prop, receiver);
	} });
}

//#endregion
//#region src/js/plugins/before-after-slider-reveal.ts
/**
* Analog wrapper around `x-slider-reveal` for the before/after snippet.
*
* `x-before-after-slider-reveal` forwards its modifiers to `x-slider-reveal` unchanged
* and ties scroll control to section visibility from `$store.sections`: it calls
* `$sliderReveal.enableScroll()` while the section intersects the viewport and
* `$sliderReveal.disableScroll()` when it scrolls out, so offscreen sliders do no
* scroll work.
*
* @example
* <before-after x-before-after-slider-reveal.vertical.from.0%.progress.50%>…</before-after>
*/
function beforeAfterSliderReveal(Alpine) {
	Alpine.directive("before-after-slider-reveal", ($el, data) => {
		Alpine.bind($el, {
			[`x-slider-reveal${data.modifiers.length ? `.${data.modifiers.join(".")}` : ""}`]: "",
			["x-data"]() {
				return {
					get isIntersecting() {
						return this.$store.sections.isIntersecting(this.$sectionId);
					},
					init() {
						this.$nextTick(() => {
							if (this.isIntersecting) this.$sliderReveal.enableScroll();
							this.$watch("isIntersecting", (isVisible) => {
								if (this.$store.sections.hasIntersected(this.$sectionId)) {
									if (isVisible) this.$sliderReveal.enableScroll();
									else this.$sliderReveal.disableScroll();
								}
							});
						});
					}
				};
			}
		});
	}).before("bind");
}

//#endregion
//#region src/js/theme.slider-reveal.ts
Alpine.plugin([slider_reveal_default, beforeAfterSliderReveal]);

//#endregion
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuc2xpZGVyLXJldmVhbC5qcyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyIuLi8uLi8udHJhZGVjcmFmdC90cmFkZWNyYWZ0LXVpL2Rpc3QvdXRpbHMvbGF5b3V0LW1lYXN1cmUuanMiLCIuLi8uLi8udHJhZGVjcmFmdC90cmFkZWNyYWZ0LXVpL2Rpc3QvdXRpbHMvZXJyb3IuanMiLCIuLi8uLi8udHJhZGVjcmFmdC90cmFkZWNyYWZ0LXVpL2Rpc3QvdXRpbHMvbW9kaWZpZXJzL2Jhc2UuanMiLCIuLi8uLi8udHJhZGVjcmFmdC90cmFkZWNyYWZ0LXVpL2Rpc3QvdXRpbHMvbW9kaWZpZXJzL3NwcmluZy5qcyIsIi4uLy4uLy50cmFkZWNyYWZ0L3RyYWRlY3JhZnQtdWkvZGlzdC91dGlscy9kZXZpY2UuanMiLCIuLi8uLi8udHJhZGVjcmFmdC90cmFkZWNyYWZ0LXVpL2Rpc3QvdXRpbHMvbW90aW9uLmpzIiwiLi4vLi4vLnRyYWRlY3JhZnQvdHJhZGVjcmFmdC11aS9kaXN0L2FscGluZS9zbGlkZXItcmV2ZWFsLmpzIiwiLi4vc3JjL2pzL3BsdWdpbnMvYmVmb3JlLWFmdGVyLXNsaWRlci1yZXZlYWwudHMiLCIuLi9zcmMvanMvdGhlbWUuc2xpZGVyLXJldmVhbC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEhlbHBlcnMgZm9yIHJlYWRpbmcgbGF5b3V0IHdpdGhvdXQgZm9yY2luZyBzeW5jaHJvbm91cyByZWZsb3dzLlxuICpcbiAqIEEgZnJhbWUgcmVuZGVycyBpbiB0aGlzIG9yZGVyOiByQUYgY2FsbGJhY2tzIOKGkiBzdHlsZS9sYXlvdXQg4oaSIFJlc2l6ZU9ic2VydmVyXG4gKiBjYWxsYmFja3Mg4oaSIHBhaW50LiBSZWFkaW5nIGdlb21ldHJ5IHdoaWxlIHN0eWxlIGlzIGRpcnR5IChtaWNyb3Rhc2sgZmx1c2hlcywgckFGXG4gKiBjYWxsYmFja3MpIGZvcmNlcyBhIHN5bmNocm9ub3VzIHJlZmxvdy4gVHdvIGNsZWFuIHJlYWQgcG9pbnRzIGV4aXN0OlxuICpcbiAqIC0gKipSZXNpemVPYnNlcnZlciBjYWxsYmFja3MqKiDigJQgbGF5b3V0IGp1c3QgcmFuLCBzbyByZWFkcyBhcmUgZnJlZSwgYW5kIHN0eWxlIHdyaXRlc1xuICogICBzdGlsbCBsYW5kIGluIHRoZSBzYW1lIGZyYW1lJ3MgcGFpbnQgKG5vIGZsYXNoKS4gVXNlIGBvbkZpcnN0TGF5b3V0YCBmb3Igb25lLW9mZlxuICogICBcIm1lYXN1cmUsIHRoZW4gYXBwbHkgaW5pdGlhbCBzdHlsZXNcIiB3b3JrLCBhbmQgYHgtcmVzaXplYCBmb3Igb25nb2luZyBzaXplIHRyYWNraW5nLlxuICogLSAqKkFmdGVyIHBhaW50Kiog4oCUIGBhZnRlck5leHRQYWludGAgLyBgcmVhZExheW91dEFmdGVyUGFpbnRgIHJ1biBpbiBhIHRhc2sgcmlnaHQgYWZ0ZXJcbiAqICAgdGhlIGZyYW1lIGNvbW1pdHMuIFJlYWRzIGFyZSBmcmVlLCBidXQgd3JpdGVzIHJlbmRlciBvbmUgZnJhbWUgbGF0ZXI7IG5ldmVyIHVzZSB0aGVtXG4gKiAgIHRvIGFwcGx5IGluaXRpYWwgdmlzdWFsIHN0YXRlIChpdCBmbGFzaGVzKS4gVXNlIHRoZW0gdG8geWllbGQgdW50aWwgcGVuZGluZyBET01cbiAqICAgbXV0YXRpb25zIGhhdmUgcmVuZGVyZWQgKGUuZy4gbWVhc3VyZSDihpIgbXV0YXRlIOKGkiBtZWFzdXJlIGxvb3BzKS5cbiAqXG4gKiBBbGwgYGFmdGVyTmV4dFBhaW50YC9gcmVhZExheW91dEFmdGVyUGFpbnRgIGNhbGxiYWNrcyBzY2hlZHVsZWQgaW4gdGhlIHNhbWUgZnJhbWUgc2hhcmVcbiAqIGEgc2luZ2xlIGZsdXNoIHdpdGggcmVhZHMgcnVubmluZyBmaXJzdCwgc28gYmF0Y2hlZCByZWFkcyBuZXZlciBpbnRlcmxlYXZlIHdpdGhcbiAqIGJhdGNoZWQgd3JpdGVzLlxuICovXG5sZXQgcGVuZGluZ1JlYWRzID0gW107XG5sZXQgcGVuZGluZ0NhbGxiYWNrcyA9IFtdO1xubGV0IGZsdXNoU2NoZWR1bGVkID0gZmFsc2U7XG5mdW5jdGlvbiBmbHVzaEFmdGVyUGFpbnQoKSB7XG4gICAgZmx1c2hTY2hlZHVsZWQgPSBmYWxzZTtcbiAgICBjb25zdCByZWFkcyA9IHBlbmRpbmdSZWFkcztcbiAgICBjb25zdCBjYWxsYmFja3MgPSBwZW5kaW5nQ2FsbGJhY2tzO1xuICAgIHBlbmRpbmdSZWFkcyA9IFtdO1xuICAgIHBlbmRpbmdDYWxsYmFja3MgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHJlYWRzKSB7XG4gICAgICAgIGlmICghZW50cnkuY2FuY2VsbGVkKVxuICAgICAgICAgICAgZW50cnkuZm4oKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBjYWxsYmFja3MpIHtcbiAgICAgICAgaWYgKCFlbnRyeS5jYW5jZWxsZWQpXG4gICAgICAgICAgICBlbnRyeS5mbigpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNjaGVkdWxlRmx1c2hBZnRlclBhaW50KCkge1xuICAgIGlmIChmbHVzaFNjaGVkdWxlZClcbiAgICAgICAgcmV0dXJuO1xuICAgIGZsdXNoU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAnaGlkZGVuJykge1xuICAgICAgICAvLyBIaWRkZW4gZG9jdW1lbnRzIGRvbid0IHBhaW50LCBzbyByQUYgd291bGQgc3RhbGwgaW5kZWZpbml0ZWx5LlxuICAgICAgICBzZXRUaW1lb3V0KGZsdXNoQWZ0ZXJQYWludCwgMCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyByQUYgYWxvbmUgcnVucyAqYmVmb3JlKiBzdHlsZS9sYXlvdXQvcGFpbnQ7IGEgdGFzayBzY2hlZHVsZWQgZnJvbSBpbnNpZGUgaXQgcnVuc1xuICAgICAgICAvLyByaWdodCBhZnRlciB0aGUgZnJhbWUgY29tbWl0cyDigJQgdGhlIGVhcmxpZXN0IHBvaW50IHdoZXJlIGxheW91dCBpcyBjbGVhbi5cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHNldFRpbWVvdXQoZmx1c2hBZnRlclBhaW50LCAwKSk7XG4gICAgfVxufVxuLyoqXG4gKiBSdW5zIGBmbmAgYWZ0ZXIgdGhlIG5leHQgcGFpbnQuIFJldHVybnMgYSBjYW5jZWwgZnVuY3Rpb24uXG4gKlxuICogTGF5b3V0IGlzIGNsZWFuIGF0IHRoaXMgcG9pbnQsIHNvIGdlb21ldHJ5IHJlYWRzIGFyZSBmcmVlIOKAlCBidXQgc3R5bGUgd3JpdGVzIGhlcmVcbiAqIHJlbmRlciBvbmUgZnJhbWUgbGF0ZXIgdGhhbiB3cml0ZXMgbWFkZSBpbiBhIHJBRi4gUHJlZmVyIGBvbkZpcnN0TGF5b3V0YCB3aGVuIHRoZVxuICogY2FsbGJhY2sgYXBwbGllcyBpbml0aWFsIHZpc3VhbCBzdGF0ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFmdGVyTmV4dFBhaW50KGZuKSB7XG4gICAgY29uc3QgZW50cnkgPSB7IGZuLCBjYW5jZWxsZWQ6IGZhbHNlIH07XG4gICAgcGVuZGluZ0NhbGxiYWNrcy5wdXNoKGVudHJ5KTtcbiAgICBzY2hlZHVsZUZsdXNoQWZ0ZXJQYWludCgpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGVudHJ5LmNhbmNlbGxlZCA9IHRydWU7XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZnRlck5leHRQYWludEFzeW5jKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBhZnRlck5leHRQYWludChyZXNvbHZlKTtcbiAgICB9KTtcbn1cbi8qKlxuICogUnVucyB0aGUgcmVhZCBjYWxsYmFjayBhZnRlciB0aGUgbmV4dCBwYWludCwgYmVmb3JlIGFueSBgYWZ0ZXJOZXh0UGFpbnRgIGNhbGxiYWNrc1xuICogZnJvbSB0aGUgc2FtZSBmcmFtZSwgc28gYmF0Y2hlZCByZWFkcyBjYW4ndCBpbnRlcmxlYXZlIHdpdGggYmF0Y2hlZCB3cml0ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWFkTGF5b3V0QWZ0ZXJQYWludChmbikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBwZW5kaW5nUmVhZHMucHVzaCh7IGZuOiAoKSA9PiByZXNvbHZlKGZuKCkpLCBjYW5jZWxsZWQ6IGZhbHNlIH0pO1xuICAgICAgICBzY2hlZHVsZUZsdXNoQWZ0ZXJQYWludCgpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBSdW5zIGBmbmAgb25jZSB0aGUgZWxlbWVudCBoYXMgYSBsYXlvdXQgYm94LCBpbnNpZGUgYSBSZXNpemVPYnNlcnZlciBjYWxsYmFjazpcbiAqIGFmdGVyIGxheW91dCAocmVhZHMgYXJlIGZyZWUg4oCUIG5vIGZvcmNlZCByZWZsb3cpIGJ1dCBiZWZvcmUgcGFpbnQgKHN0eWxlIHdyaXRlc1xuICogc3RpbGwgbGFuZCBpbiB0aGlzIGZyYW1lIOKAlCBubyBmbGFzaCBvZiB1bnN0eWxlZCBzdGF0ZSkuXG4gKlxuICogRm9yIGFuIGVsZW1lbnQgdGhhdCBpcyByZW5kZXJlZCB3aGVuIGNhbGxlZCwgdGhpcyBmaXJlcyBkdXJpbmcgdGhlIGN1cnJlbnQgZnJhbWUnc1xuICogcmVuZGVyaW5nIHN0ZXBzLiBGb3IgYSBgZGlzcGxheTogbm9uZWAgZWxlbWVudCwgaXQgZmlyZXMgd2hlbiB0aGUgZWxlbWVudCBmaXJzdFxuICogZ2V0cyBhIGJveCDigJQgc28gbWVhc3VyZW1lbnRzIGFyZSBuZXZlciBhIG1lYW5pbmdsZXNzIDDDlzAuIFJldHVybnMgYSBjYW5jZWwgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvbkZpcnN0TGF5b3V0KGVsLCBmbikge1xuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKChlbnRyaWVzKSA9PiB7XG4gICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgZm4oZW50cmllc1swXSk7XG4gICAgfSk7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbCk7XG4gICAgcmV0dXJuICgpID0+IG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbn1cbiIsIi8qKlxuICogTG9ncyBhIGNsZWFyLCBhY3Rpb25hYmxlIGNvbnNvbGUgZXJyb3Igd2hlbiBhIE1ldGhvZCBVSSBkaXJlY3RpdmUgaXMgdXNlZFxuICogd2l0aG91dCBhIHBhcmVudCBkaXJlY3RpdmUgaXQgZGVwZW5kcyBvbi5cbiAqXG4gKiBNYW55IGRpcmVjdGl2ZXMgb25seSB3b3JrIHdoZW4gbmVzdGVkIGluc2lkZSBhIHBhcmVudCBkaXJlY3RpdmUgdGhhdCBzZXRzIHVwXG4gKiBzaGFyZWQgc3RhdGUgb24gdGhlIEFscGluZSBzY29wZSAoZS5nLiBgeC1vdmVyZmxvdzpzdGFydGAgbmVlZHMgYW4gYW5jZXN0b3JcbiAqIGB4LW92ZXJmbG93YCkuIFdoZW4gdGhhdCBwYXJlbnQgaXMgbWlzc2luZywgdGhlIHJhdyBmYWlsdXJlIGlzIGFuIGluc2NydXRhYmxlXG4gKiBgdGhpcy5fX2ZvbyBpcyBub3QgYSBmdW5jdGlvbmAuIENhbGwgdGhpcyBpbnN0ZWFkIHNvIHVzZXJzIGdldCBhIG1lc3NhZ2UgdGhhdFxuICogZXhwbGFpbnMgd2hhdCB0byBkby5cbiAqXG4gKiBAcGFyYW0gY2hpbGREaXJlY3RpdmUgLSBUaGUgZGlyZWN0aXZlIGJlaW5nIHVzZWQsIGUuZy4gYCd4LW92ZXJmbG93OnN0YXJ0J2AuXG4gKiBAcGFyYW0gcGFyZW50RGlyZWN0aXZlIC0gVGhlIHBhcmVudCBkaXJlY3RpdmUgcmVxdWlyZWQsIGUuZy4gYCd4LW92ZXJmbG93J2AuXG4gKiBAcGFyYW0gZWwgLSBUaGUgZWxlbWVudCB0aGUgY2hpbGQgZGlyZWN0aXZlIGlzIG9uLCBsb2dnZWQgZm9yIGNvbnRleHQuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYHRzXG4gKiBpZiAodHlwZW9mIHRoaXMuX19vdmVyZmxvd19yZWdpc3RlckJvdW5kYXJ5ICE9PSAnZnVuY3Rpb24nKSB7XG4gKiAgIHdhcm5NaXNzaW5nUGFyZW50RGlyZWN0aXZlKGB4LW92ZXJmbG93OiR7dmFsdWV9YCwgJ3gtb3ZlcmZsb3cnLCAkZWwpO1xuICogICByZXR1cm47XG4gKiB9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdhcm5NaXNzaW5nUGFyZW50RGlyZWN0aXZlKGNoaWxkRGlyZWN0aXZlLCBwYXJlbnREaXJlY3RpdmUsIGVsKSB7XG4gICAgY29uc29sZS5lcnJvcihgQ2Fubm90IHVzZSAke2NoaWxkRGlyZWN0aXZlfSB3aXRob3V0IGEgcGFyZW50IGVsZW1lbnQgaGF2aW5nICR7cGFyZW50RGlyZWN0aXZlfS5gLCBlbCk7XG59XG5leHBvcnQgZnVuY3Rpb24gcHJldHR5UHJpbnRFcnJvcihlcnIpIHtcbiAgICBsZXQgb3V0cHV0ID0gJyc7XG4gICAgaWYgKHR5cGVvZiBlcnIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG91dHB1dCA9IGVycjtcbiAgICB9XG4gICAgZWxzZSBpZiAoZXJyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgb3V0cHV0ID0gZXJyLm1lc3NhZ2U7XG4gICAgfVxuICAgIGVsc2UgaWYgKGVyciAmJiB0eXBlb2YgZXJyLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG91dHB1dCA9IGVyci50b1N0cmluZygpO1xuICAgIH1cbiAgICBlbHNlIGlmIChlcnIgJiYgdHlwZW9mIGVyci5tZXNzYWdlID09PSAnc3RyaW5nJykge1xuICAgICAgICBvdXRwdXQgPSBlcnIubWVzc2FnZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG91dHB1dCA9ICdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkLic7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG59XG4iLCIvKipcbiAqIFJldHVybnMgdGhlIHRva2VuIHRoYXQgZm9sbG93cyBhIGRpcmVjdGl2ZSBtb2RpZmllciBuYW1lLlxuICpcbiAqIEBleGFtcGxlXG4gKiBnZXRNb2RpZmllclZhbHVlKFsnc3BlZWQnLCAnNjAnXSwgJ3NwZWVkJyk7XG4gKiAvLyA9PiAnNjAnXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IG1vZGlmaWVySW5kZXggPSBtb2RpZmllcnMuaW5kZXhPZihtb2RpZmllck5hbWUpO1xuICAgIGlmIChtb2RpZmllckluZGV4ID09PSAtMSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIChfYSA9IG1vZGlmaWVyc1ttb2RpZmllckluZGV4ICsgMV0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG51bGw7XG59XG4vKipcbiAqIFJldHVybnMgYSBudW1lcmljIG1vZGlmaWVyIHZhbHVlIHdoZW4gaXQgY2FuIGJlIHBhcnNlZCBhcyBhIGZpbml0ZSBudW1iZXIuXG4gKlxuICogQGV4YW1wbGVcbiAqIGdldE51bWJlck1vZGlmaWVyVmFsdWUoWydzcGVlZCcsICctNjAnXSwgJ3NwZWVkJyk7XG4gKiAvLyA9PiAtNjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE51bWJlck1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpIHtcbiAgICBjb25zdCByYXdNb2RpZmllclZhbHVlID0gZ2V0TW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIG1vZGlmaWVyTmFtZSk7XG4gICAgaWYgKHJhd01vZGlmaWVyVmFsdWUgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgcGFyc2VkTW9kaWZpZXJWYWx1ZSA9IE51bWJlcihyYXdNb2RpZmllclZhbHVlKTtcbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShwYXJzZWRNb2RpZmllclZhbHVlKSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHBhcnNlZE1vZGlmaWVyVmFsdWU7XG59XG4vKipcbiAqIFJldHVybnMgYSBwb3NpdGl2ZSBudW1lcmljIG1vZGlmaWVyIHZhbHVlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBnZXRQb3NpdGl2ZU51bWJlck1vZGlmaWVyVmFsdWUoWydzdGlmZm5lc3MnLCAnMjQwJ10sICdzdGlmZm5lc3MnKTtcbiAqIC8vID0+IDI0MFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UG9zaXRpdmVOdW1iZXJNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKSB7XG4gICAgY29uc3QgcGFyc2VkTW9kaWZpZXJWYWx1ZSA9IGdldE51bWJlck1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpO1xuICAgIGlmIChwYXJzZWRNb2RpZmllclZhbHVlID09IG51bGwgfHwgcGFyc2VkTW9kaWZpZXJWYWx1ZSA8PSAwKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gcGFyc2VkTW9kaWZpZXJWYWx1ZTtcbn1cbi8qKlxuICogUmV0dXJucyBhbiBgbXNgIG1vZGlmaWVyIHZhbHVlIGFzIGEgbnVtYmVyLlxuICpcbiAqIEBleGFtcGxlXG4gKiBnZXRNaWxsaXNlY29uZHNNb2RpZmllclZhbHVlKFsnZHVyYXRpb24nLCAnNTAwbXMnXSwgJ2R1cmF0aW9uJyk7XG4gKiAvLyA9PiA1MDBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1pbGxpc2Vjb25kc01vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpIHtcbiAgICBjb25zdCByYXdNb2RpZmllclZhbHVlID0gZ2V0TW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIG1vZGlmaWVyTmFtZSk7XG4gICAgaWYgKHJhd01vZGlmaWVyVmFsdWUgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgbWlsbGlzZWNvbmRzTWF0Y2ggPSByYXdNb2RpZmllclZhbHVlLm1hdGNoKC9eKFswLTldKyltcyQvKTtcbiAgICBpZiAoIW1pbGxpc2Vjb25kc01hdGNoKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gTnVtYmVyKG1pbGxpc2Vjb25kc01hdGNoWzFdKTtcbn1cbi8qKlxuICogUmV0dXJucyBhIGAlYCBtb2RpZmllciB2YWx1ZSBhcyBhIG51bWJlci5cbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0UGVyY2VudGFnZU1vZGlmaWVyVmFsdWUoWydwcm9ncmVzcycsICc1MCUnXSwgJ3Byb2dyZXNzJyk7XG4gKiAvLyA9PiA1MFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGVyY2VudGFnZU1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpIHtcbiAgICBjb25zdCByYXdNb2RpZmllclZhbHVlID0gZ2V0TW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIG1vZGlmaWVyTmFtZSk7XG4gICAgaWYgKHJhd01vZGlmaWVyVmFsdWUgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgcGVyY2VudGFnZU1hdGNoID0gcmF3TW9kaWZpZXJWYWx1ZS5tYXRjaCgvXihbMC05XSspJSQvKTtcbiAgICBpZiAoIXBlcmNlbnRhZ2VNYXRjaClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIE51bWJlcihwZXJjZW50YWdlTWF0Y2hbMV0pO1xufVxuLyoqXG4gKiBSZXR1cm5zIGEgYHB4YCBtb2RpZmllciB2YWx1ZSBhcyBhIG51bWJlci5cbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0UGl4ZWxNb2RpZmllclZhbHVlKFsnb2Zmc2V0JywgJy0xMnB4J10sICdvZmZzZXQnKTtcbiAqIC8vID0+IC0xMlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGl4ZWxNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKSB7XG4gICAgY29uc3QgcmF3TW9kaWZpZXJWYWx1ZSA9IGdldE1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpO1xuICAgIGlmIChyYXdNb2RpZmllclZhbHVlID09IG51bGwpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHBpeGVsTWF0Y2ggPSByYXdNb2RpZmllclZhbHVlLm1hdGNoKC9eKC0/WzAtOV0rKXB4JC8pO1xuICAgIGlmICghcGl4ZWxNYXRjaClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIE51bWJlcihwaXhlbE1hdGNoWzFdKTtcbn1cbiIsImltcG9ydCB7IGdldE1vZGlmaWVyVmFsdWUsIGdldFBvc2l0aXZlTnVtYmVyTW9kaWZpZXJWYWx1ZSB9IGZyb20gJy4vYmFzZSc7XG5jb25zdCBERUZBVUxUX01JTl9TUFJJTkdfTUFTUyA9IDAuMDE7XG4vKipcbiAqIFJldHVybnMgYSBzcHJpbmcgbWFzcyBtb2RpZmllciB2YWx1ZSB1c2luZyBhIG1pbmltdW0gbWFzcyBhcyB0aGUgc2NhbGUgdW5pdC5cbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0TWFzc01vZGlmaWVyVmFsdWUoWydtYXNzJywgJzAnXSwgJ21hc3MnKTtcbiAqIC8vID0+IDAuMDFcbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0TWFzc01vZGlmaWVyVmFsdWUoWydtYXNzJywgJzIwJ10sICdtYXNzJyk7XG4gKiAvLyA9PiAwLjJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hc3NNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lLCBtaW5pbXVtTWFzcyA9IERFRkFVTFRfTUlOX1NQUklOR19NQVNTKSB7XG4gICAgY29uc3QgcmF3TW9kaWZpZXJWYWx1ZSA9IGdldE1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpO1xuICAgIGlmIChyYXdNb2RpZmllclZhbHVlID09IG51bGwpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHBhcnNlZE1vZGlmaWVyVmFsdWUgPSBOdW1iZXIocmF3TW9kaWZpZXJWYWx1ZSk7XG4gICAgaWYgKE51bWJlci5pc05hTihwYXJzZWRNb2RpZmllclZhbHVlKSB8fCBwYXJzZWRNb2RpZmllclZhbHVlIDwgMClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgaWYgKHBhcnNlZE1vZGlmaWVyVmFsdWUgPT09IDApXG4gICAgICAgIHJldHVybiBtaW5pbXVtTWFzcztcbiAgICByZXR1cm4gcGFyc2VkTW9kaWZpZXJWYWx1ZSAqIG1pbmltdW1NYXNzO1xufVxuLyoqXG4gKiBBcHBsaWVzIGAubWFzc2AsIGAuc3RpZmZuZXNzYCwgYW5kIGAuZGFtcGluZ2AgZGlyZWN0aXZlIG1vZGlmaWVycyB0byBhIHNwcmluZyBjb25maWcuXG4gKlxuICogQGV4YW1wbGVcbiAqIGdldFNwcmluZ01vZGlmaWVyQ29uZmlnKFsnbWFzcycsICcyMCcsICdzdGlmZm5lc3MnLCAnMTgwJ10sIHttYXNzOiAwLjUsIHN0aWZmbmVzczogMjAwLCBkYW1waW5nOiAzMH0pO1xuICogLy8gPT4ge21hc3M6IDAuMiwgc3RpZmZuZXNzOiAxODAsIGRhbXBpbmc6IDMwfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3ByaW5nTW9kaWZpZXJDb25maWcobW9kaWZpZXJzLCBkZWZhdWx0U3ByaW5nQ29uZmlnLCBtaW5pbXVtTWFzcyA9IERFRkFVTFRfTUlOX1NQUklOR19NQVNTKSB7XG4gICAgY29uc3Qgc3ByaW5nQ29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdFNwcmluZ0NvbmZpZyk7XG4gICAgY29uc3QgcGFyc2VkTWFzcyA9IGdldE1hc3NNb2RpZmllclZhbHVlKG1vZGlmaWVycywgJ21hc3MnLCBtaW5pbXVtTWFzcyk7XG4gICAgaWYgKHBhcnNlZE1hc3MgIT09IG51bGwpXG4gICAgICAgIHNwcmluZ0NvbmZpZy5tYXNzID0gcGFyc2VkTWFzcztcbiAgICBjb25zdCBwYXJzZWRTdGlmZm5lc3MgPSBnZXRQb3NpdGl2ZU51bWJlck1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCAnc3RpZmZuZXNzJyk7XG4gICAgaWYgKHBhcnNlZFN0aWZmbmVzcyAhPT0gbnVsbClcbiAgICAgICAgc3ByaW5nQ29uZmlnLnN0aWZmbmVzcyA9IHBhcnNlZFN0aWZmbmVzcztcbiAgICBjb25zdCBwYXJzZWREYW1waW5nID0gZ2V0UG9zaXRpdmVOdW1iZXJNb2RpZmllclZhbHVlKG1vZGlmaWVycywgJ2RhbXBpbmcnKTtcbiAgICBpZiAocGFyc2VkRGFtcGluZyAhPT0gbnVsbClcbiAgICAgICAgc3ByaW5nQ29uZmlnLmRhbXBpbmcgPSBwYXJzZWREYW1waW5nO1xuICAgIHJldHVybiBzcHJpbmdDb25maWc7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gaXNSZWR1Y2VkTW90aW9uKCkge1xuICAgIHJldHVybiB3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSknKS5tYXRjaGVzO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzTG93UG93ZXJEZXZpY2UoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbXBhdC9jb21wYXQgLS0gdW5kZWZpbmVkIG9uIGlPUyBTYWZhcmkgMTMuNC0xMy43LCB3aGVyZSBOYU4gPD0gMiBpcyBmYWxzZSBhbmQgdGhlIGRldmljZSByZWFkcyBhcyBub3JtYWwtcG93ZXJcbiAgICByZXR1cm4gTnVtYmVyKG5hdmlnYXRvci5oYXJkd2FyZUNvbmN1cnJlbmN5KSA8PSAyIHx8IE51bWJlcihuYXZpZ2F0b3IuZGV2aWNlTWVtb3J5KSA8PSAyO1xufVxuIiwiLyoqXG4gKiBXb3JrYXJvdW5kIGZvciBhbiB1cHN0cmVhbSB0eXBlLWlkZW50aXR5IHNwbGl0IGluIGBtb3Rpb25AMTIuNDArYC5cbiAqXG4gKiBUaGUgYE1vdGlvblZhbHVlYCB0eXBlIHRoYXQgYG1vdGlvbmAgZXhwb3J0cyAoYW5kIHRoYXQgYG1vdGlvblZhbHVlKClgIHJldHVybnMpXG4gKiBpcyAqbm90KiB0aGUgc2FtZSBgTW90aW9uVmFsdWVgIHRoYXQgbW90aW9uJ3Mgb3duIGZ1bmN0aW9ucyAoYGFuaW1hdGVgLFxuICogYHNwcmluZ1ZhbHVlYCwgYHRyYW5zZm9ybVZhbHVlYCwgYHN0eWxlRWZmZWN0YCwgYHNjcm9sbGApIGFjY2VwdCBhcyBwYXJhbWV0ZXJzIOKAlFxuICogdGhlIGV4cG9ydGVkIHR5cGUgaXMgbWlzc2luZyBgY3VycmVudGAgLyBgcHJldmAgLyBgcHJldkZyYW1lVmFsdWVgIC9cbiAqIGBkZXBlbmRlbnRzYC4gVGhlIHR3byBzaGFwZXMgYXJlIG11dHVhbGx5IHVuLWFzc2lnbmFibGUgYW5kIG5laXRoZXIgaXMgbmFtZWFibGUsXG4gKiBzbyBhIHZhbHVlIGNyZWF0ZWQgd2l0aCBgbW90aW9uVmFsdWUoKWAgY2Fubm90IGJlIHBhc3NlZCB0byB0aGUgZnVuY3Rpb25zIG1lYW50XG4gKiB0byBjb25zdW1lIGl0IHdpdGhvdXQgYSBjYXN0LlxuICpcbiAqIFRoaXMgY2VudHJhbGl6ZXMgdGhhdCB1bmF2b2lkYWJsZSBjYXN0IGludG8gb25lIG5hbWVkLCBncmVwcGFibGUgcGxhY2UgaW5zdGVhZFxuICogb2Ygc2NhdHRlcmluZyBgYXMgYW55YCBhY3Jvc3MgY2FsbCBzaXRlcy4gSXQgaXMgYHVua25vd24gLT4gYW55YCAodGhlIHNhbWVcbiAqIHJ1bnRpbWUgc2FmZXR5IGFzIGBhcyBhbnlgKTsgYSB0eXBlLWNoZWNrZWQgc2lnbmF0dXJlIGlzIGltcG9zc2libGUgaGVyZSBiZWNhdXNlXG4gKiB0aGUgaW5wdXQgdHlwZSAqaXMqIHRoZSBtaXNtYXRjaC4gRGVsZXRlIHRoaXMgYW5kIGl0cyBjYWxsIHNpdGVzIG9uY2UgbW90aW9uXG4gKiBzaGlwcyBjb25zaXN0ZW50IHR5cGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbW90aW9uQXJnKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuIiwiaW1wb3J0IHsgc3ByaW5nVmFsdWUsIHN0eWxlRWZmZWN0LCB0cmFuc2Zvcm0sIHRyYW5zZm9ybVZhbHVlLCBzY3JvbGwsIG1vdGlvblZhbHVlLCBhbmltYXRlLCB9IGZyb20gJ21vdGlvbic7XG5pbXBvcnQgeyBtb3Rpb25BcmcgfSBmcm9tICcuLi91dGlscy9tb3Rpb24nO1xuaW1wb3J0IHsgaXNMb3dQb3dlckRldmljZSwgaXNSZWR1Y2VkTW90aW9uIH0gZnJvbSAnLi4vdXRpbHMvZGV2aWNlJztcbmltcG9ydCB7IGdldFBlcmNlbnRhZ2VNb2RpZmllclZhbHVlLCBnZXRQaXhlbE1vZGlmaWVyVmFsdWUsIGdldFNwcmluZ01vZGlmaWVyQ29uZmlnIH0gZnJvbSAnLi4vdXRpbHMvbW9kaWZpZXJzJztcbmltcG9ydCB7IG9uRmlyc3RMYXlvdXQgfSBmcm9tICcuLi91dGlscy9sYXlvdXQtbWVhc3VyZSc7XG5pbXBvcnQgeyB3YXJuTWlzc2luZ1BhcmVudERpcmVjdGl2ZSB9IGZyb20gJy4uL3V0aWxzL2Vycm9yJztcbmNvbnN0IFNDUk9MTF9QUk9HUkVTU19UT19SRVZFQUxfUFJPR1JFU1NfTVVMVElQTElFUiA9IDMwO1xuY29uc3QgREVGQVVMVF9FREdFX0JVRkZFUl9QWCA9IDI7XG5jb25zdCBNSU5fU1BSSU5HX01BU1MgPSAwLjAxO1xuY29uc3QgU1BSSU5HX0RFRkFVTFRfQ09ORklHID0ge1xuICAgIHN0aWZmbmVzczogMzAwLFxuICAgIGRhbXBpbmc6IDMwLFxuICAgIG1hc3M6IDAuMDUsXG59O1xuLyoqXG4gKiBQbHVnaW4gdG8gY3JlYXRlIGFuIGFuaW1hdGVkIGJlZm9yZS9hZnRlciBzbGlkZXIgcmV2ZWFsIHdpdGggb3B0aW9uYWwgc2Nyb2xsIGNvbnRyb2wuXG4gKlxuICogIyMgRGlyZWN0aXZlc1xuICpcbiAqIC0gYHgtc2xpZGVyLXJldmVhbGAgLSBSb290IGVsZW1lbnQuIENyZWF0ZXMgdGhlIHJlYWN0aXZlIHJldmVhbCBzdGF0ZS5cbiAqIC0gYHgtc2xpZGVyLXJldmVhbDpoYW5kbGVgIC0gSGFuZGxlIGVsZW1lbnQgdHJhbnNsYXRlZCBieSB0aGUgcmV2ZWFsIHByb2dyZXNzLlxuICogLSBgeC1zbGlkZXItcmV2ZWFsOnJldmVhbGAgLSBSZXZlYWwgZWxlbWVudCBjbGlwcGVkIGJ5IHRoZSByZXZlYWwgcHJvZ3Jlc3MuXG4gKlxuICogIyMgUm9vdCBtb2RpZmllcnNcbiAqXG4gKiAtIGAudmVydGljYWxgIC0gVXNlcyB2ZXJ0aWNhbCBpbnN0ZWFkIG9mIGhvcml6b250YWwgbW92ZW1lbnQuXG4gKiAtIGAucHJvZ3Jlc3MuPG4+JWAgLSBTZXRzIHRoZSByZXN0aW5nIHJldmVhbCBwcm9ncmVzcy5cbiAqIC0gYC5mcm9tLjxuPiVgIC0gU2V0cyB0aGUgYW5pbWF0aW9uJ3Mgc3RhcnRpbmcgcHJvZ3Jlc3MgYmVmb3JlIGl0IHNldHRsZXMgdG8gYC5wcm9ncmVzc2AuXG4gKiAtIGAubWFzcy48bj5gIC0gU3ByaW5nIG1hc3Mgc2NhbGUgZm9yIHRoZSByZXZlYWwgc3ByaW5nLiBgLm1hc3MuNTBgIGVxdWFscyBgMC41YC5cbiAqIC0gYC5zdGlmZm5lc3MuPG4+YCAtIFNwcmluZyBzdGlmZm5lc3MuIEhpZ2hlciB2YWx1ZXMgc2V0dGxlIGZhc3Rlci5cbiAqIC0gYC5kYW1waW5nLjxuPmAgLSBTcHJpbmcgZGFtcGluZy4gSGlnaGVyIHZhbHVlcyByZWR1Y2Ugb3ZlcnNob290LlxuICogLSBgLmVkZ2UtYnVmZmVyLjxuPnB4YCAtIEtlZXBzIHRoZSBoYW5kbGUgdGhpcyBtYW55IHBpeGVscyBhd2F5IGZyb20gdGhlIHJvb3QgZWRnZS4gRGVmYXVsdHMgdG8gYDJweGAuXG4gKlxuICogIyMgTWFnaWNcbiAqXG4gKiAtIGAkc2xpZGVyUmV2ZWFsLnByb2dyZXNzYCAtIFRoZSByZXZlYWwgcHJvZ3Jlc3MsIDAtMTAwLiBTZXR0YWJsZTsgdmFsdWVzIGNsYW1wIHRvIHRoZSBoYW5kbGUncyBhbGxvd2VkIHJhbmdlLlxuICogLSBgJHNsaWRlclJldmVhbC5wcm9ncmVzc1ZhbHVlYCAtIFRoZSB1bmRlcmx5aW5nIE1vdGlvblZhbHVlLlxuICogLSBgJHNsaWRlclJldmVhbC5lbmFibGVTY3JvbGwoKWAgLyBgJHNsaWRlclJldmVhbC5kaXNhYmxlU2Nyb2xsKClgIC0gU3RhcnQgYW5kIHN0b3AgZHJpdmluZyB0aGUgcHJvZ3Jlc3NcbiAqICAgZnJvbSBwYWdlIHNjcm9sbC4gYGVuYWJsZVNjcm9sbGAgZmlyc3QgYW5pbWF0ZXMgZnJvbSBgLmZyb21gIHRvIGAucHJvZ3Jlc3NgLCBhbmQgZG9lcyBub3RoaW5nIHdoZW4gdGhlXG4gKiAgIHVzZXIgcHJlZmVycyByZWR1Y2VkIG1vdGlvbiBvciB0aGUgZGV2aWNlIHJlcG9ydHMgbG93IHBvd2VyLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogYGBgaHRtbFxuICogPGRpdiB4LXNsaWRlci1yZXZlYWwucHJvZ3Jlc3MuNjUlLmZyb20uMTAlLnN0aWZmbmVzcy4yNDAuZGFtcGluZy4zNS5tYXNzLjUwLmVkZ2UtYnVmZmVyLjRweD5cbiAqICAgPGRpdiB4LXNsaWRlci1yZXZlYWw6cmV2ZWFsPkFmdGVyPC9kaXY+XG4gKiAgIDxkaXYgeC1zbGlkZXItcmV2ZWFsOmhhbmRsZT48L2Rpdj5cbiAqIDwvZGl2PlxuICogYGBgXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChBbHBpbmUpIHtcbiAgICBBbHBpbmUuZGlyZWN0aXZlKCdzbGlkZXItcmV2ZWFsJywgKCRlbCwgZGF0YSkgPT4ge1xuICAgICAgICBpZiAoZGF0YS52YWx1ZSA9PSAnaGFuZGxlJykge1xuICAgICAgICAgICAgaGFuZGxlSGFuZGxlKCRlbCwgQWxwaW5lLCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkYXRhLnZhbHVlID09ICdyZXZlYWwnKSB7XG4gICAgICAgICAgICBoYW5kbGVSZXZlYWwoJGVsLCBBbHBpbmUsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRhdGEudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgaGFuZGxlUm9vdCgkZWwsIEFscGluZSwgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gZGlyZWN0aXZlOiB4LXNsaWRlci1yZXZlYWw6JHtkYXRhLnZhbHVlfWApO1xuICAgICAgICB9XG4gICAgfSkuYmVmb3JlKCdiaW5kJyk7XG4gICAgQWxwaW5lLm1hZ2ljKCdzbGlkZXJSZXZlYWwnLCBoYW5kbGVTbGlkZXJSZXZlYWxNYWdpYyhBbHBpbmUpKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZUhhbmRsZSgkZWwsIEFscGluZSwgX2RhdGEpIHtcbiAgICBBbHBpbmUuYmluZCgkZWwsIHtcbiAgICAgICAgJ3gtaW5pdCcoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX19zbGlkZXJSZXZlYWxfaXNSb290KSB7XG4gICAgICAgICAgICAgICAgd2Fybk1pc3NpbmdQYXJlbnREaXJlY3RpdmUoJ3gtc2xpZGVyLXJldmVhbDpoYW5kbGUnLCAneC1zbGlkZXItcmV2ZWFsJywgdGhpcy4kZWwpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX19zbGlkZXJSZXZlYWxfaGFuZGxlID0gdGhpcy4kZWw7XG4gICAgICAgIH0sXG4gICAgfSk7XG59XG5mdW5jdGlvbiBoYW5kbGVSZXZlYWwoJGVsLCBBbHBpbmUsIF9kYXRhKSB7XG4gICAgQWxwaW5lLmJpbmQoJGVsLCB7XG4gICAgICAgICd4LWluaXQnKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9fc2xpZGVyUmV2ZWFsX2lzUm9vdCkge1xuICAgICAgICAgICAgICAgIHdhcm5NaXNzaW5nUGFyZW50RGlyZWN0aXZlKCd4LXNsaWRlci1yZXZlYWw6cmV2ZWFsJywgJ3gtc2xpZGVyLXJldmVhbCcsIHRoaXMuJGVsKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9fc2xpZGVyUmV2ZWFsX3JldmVhbCA9IHRoaXMuJGVsO1xuICAgICAgICB9LFxuICAgIH0pO1xufVxuZnVuY3Rpb24gaGFuZGxlUm9vdCgkZWwsIEFscGluZSwgZGF0YSkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSBkYXRhLm1vZGlmaWVycy5pbmNsdWRlcygndmVydGljYWwnKSA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XG4gICAgY29uc3QgZWRnZUJ1ZmZlclB4ID0gKF9hID0gZ2V0UGl4ZWxNb2RpZmllclZhbHVlKGRhdGEubW9kaWZpZXJzLCAnZWRnZS1idWZmZXInKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogREVGQVVMVF9FREdFX0JVRkZFUl9QWDtcbiAgICBjb25zdCBzdGFydFByb2dyZXNzID0gKF9iID0gZ2V0UGVyY2VudGFnZU1vZGlmaWVyVmFsdWUoZGF0YS5tb2RpZmllcnMsICdwcm9ncmVzcycpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAwO1xuICAgIGNvbnN0IGZyb21Qcm9ncmVzcyA9IGdldFBlcmNlbnRhZ2VNb2RpZmllclZhbHVlKGRhdGEubW9kaWZpZXJzLCAnZnJvbScpO1xuICAgIGNvbnN0IHNwcmluZ0NvbmZpZyA9IGdldFNwcmluZ01vZGlmaWVyQ29uZmlnKGRhdGEubW9kaWZpZXJzLCBTUFJJTkdfREVGQVVMVF9DT05GSUcsIE1JTl9TUFJJTkdfTUFTUyk7XG4gICAgbGV0IGluaXRpYWxQcm9ncmVzcyA9IHN0YXJ0UHJvZ3Jlc3M7XG4gICAgaWYgKGZyb21Qcm9ncmVzcyAhPT0gbnVsbCkge1xuICAgICAgICBpbml0aWFsUHJvZ3Jlc3MgPSBOdW1iZXIoZnJvbVByb2dyZXNzKTtcbiAgICB9XG4gICAgQWxwaW5lLmJpbmQoJGVsLCB7XG4gICAgICAgICd4LWRhdGEnKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBfX3NsaWRlclJldmVhbF9pc1Jvb3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgX19zbGlkZXJSZXZlYWxfcm9vdEVsOiAkZWwsXG4gICAgICAgICAgICAgICAgX19zbGlkZXJSZXZlYWxfcHJvZ3Jlc3NWYWx1ZTogcmVhY3RpdmVNb3Rpb25WYWx1ZShBbHBpbmUsIGluaXRpYWxQcm9ncmVzcyksXG4gICAgICAgICAgICAgICAgX19zbGlkZXJSZXZlYWxfcHJvZ3Jlc3NTcHJpbmdWYWx1ZTogbnVsbCxcbiAgICAgICAgICAgICAgICBfX3NsaWRlclJldmVhbF9zdGFydFByb2dyZXNzOiBzdGFydFByb2dyZXNzLFxuICAgICAgICAgICAgICAgIF9fc2xpZGVyUmV2ZWFsX2hhbmRsZTogbnVsbCxcbiAgICAgICAgICAgICAgICBfX3NsaWRlclJldmVhbF9yZXZlYWw6IG51bGwsXG4gICAgICAgICAgICAgICAgX19zbGlkZXJSZXZlYWxfY2FuY2VsRmlyc3RMYXlvdXQ6IG51bGwsXG4gICAgICAgICAgICAgICAgX19zbGlkZXJSZXZlYWxfc2Nyb2xsQW5pbWF0aW9uRm46IG51bGwsXG4gICAgICAgICAgICAgICAgX19zbGlkZXJSZXZlYWxfc3RhcnRBbmltYXRpb25GbjogbnVsbCxcbiAgICAgICAgICAgICAgICBfX3NsaWRlclJldmVhbF9zdG9wSGFuZGxlU3R5bGVFZmZlY3Q6IG51bGwsXG4gICAgICAgICAgICAgICAgX19zbGlkZXJSZXZlYWxfc3RvcFJldmVhbFN0eWxlRWZmZWN0OiBudWxsLFxuICAgICAgICAgICAgICAgIGluaXQoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG9uRmlyc3RMYXlvdXQgZmlyZXMgcG9zdC1sYXlvdXQsIHByZS1wYWludDogdGhlIG1lYXN1cmVtZW50cyBiZWxvdyBhcmUgZnJlZVxuICAgICAgICAgICAgICAgICAgICAvLyBhbmQgdGhlIHN0eWxlRWZmZWN0cyBzdGlsbCBhcHBseSBpbiB0aGUgc2FtZSBmcmFtZSdzIHBhaW50LlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fc2xpZGVyUmV2ZWFsX2NhbmNlbEZpcnN0TGF5b3V0ID0gb25GaXJzdExheW91dCh0aGlzLiRlbCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3NsaWRlclJldmVhbF9jYW5jZWxGaXJzdExheW91dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBOb3JtYWxpemUgdGhlIGNvbmZpZ3VyZWQgc3RhcnQgdmFsdWVzIG9uY2UgbGF5b3V0IGV4aXN0cyBzbyBoYW5kbGUgb3ZlcmZsb3cgY2xhbXBzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYW4gYmUgYXBwbGllZCBiZWZvcmUgZWl0aGVyIHRoZSBzcHJpbmcgb3IgcmV2ZWFsIGVmZmVjdCBzdGFydHMgcmVuZGVyaW5nLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZWZmZWN0aXZlSW5pdGlhbFByb2dyZXNzID0gdGhpcy5fX3NsaWRlclJldmVhbF9nZXRFZmZlY3RpdmVQcm9ncmVzcyhpbml0aWFsUHJvZ3Jlc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3NsaWRlclJldmVhbF9zdGFydFByb2dyZXNzID0gdGhpcy5fX3NsaWRlclJldmVhbF9nZXRFZmZlY3RpdmVQcm9ncmVzcyhzdGFydFByb2dyZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19zbGlkZXJSZXZlYWxfcHJvZ3Jlc3NWYWx1ZS5zZXQoZWZmZWN0aXZlSW5pdGlhbFByb2dyZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19zbGlkZXJSZXZlYWxfcHJvZ3Jlc3NTcHJpbmdWYWx1ZSA9IHNwcmluZ1ZhbHVlKG1vdGlvbkFyZyh0aGlzLl9fc2xpZGVyUmV2ZWFsX3Byb2dyZXNzVmFsdWUpLCBzcHJpbmdDb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX19zbGlkZXJSZXZlYWxfaGFuZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3NsaWRlclJldmVhbF9zdG9wSGFuZGxlU3R5bGVFZmZlY3QgPSBzdHlsZUVmZmVjdCh0aGlzLl9fc2xpZGVyUmV2ZWFsX2hhbmRsZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zZm9ybVZhbHVlKCgpID0+IGdldEhhbmRsZVRyYW5zZm9ybSh0aGlzLl9fc2xpZGVyUmV2ZWFsX3Byb2dyZXNzU3ByaW5nVmFsdWUuZ2V0KCksIG9yaWVudGF0aW9uLCB0aGlzLiRlbCwgdGhpcy5fX3NsaWRlclJldmVhbF9oYW5kbGUsIGVkZ2VCdWZmZXJQeCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX19zbGlkZXJSZXZlYWxfcmV2ZWFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3NsaWRlclJldmVhbF9zdG9wUmV2ZWFsU3R5bGVFZmZlY3QgPSBzdHlsZUVmZmVjdCh0aGlzLl9fc2xpZGVyUmV2ZWFsX3JldmVhbCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBVc2UgdGhlIHNhbWUgY2xhbXBlZCBwcm9ncmVzcyBhcyB0aGUgaGFuZGxlIHNvIHNwcmluZyBvdmVyc2hvb3QgbmV2ZXIgbGV0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgcmV2ZWFsIGRyaWZ0IHBhc3QgdGhlIHN0b3BwZWQgaGFuZGxlIHBvc2l0aW9uIGF0IHRoZSByb290IGVkZ2UuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaXBQYXRoOiB0cmFuc2Zvcm1WYWx1ZSgoKSA9PiBnZXRSZXZlYWxDbGlwUGF0aCh0aGlzLl9fc2xpZGVyUmV2ZWFsX2dldEVmZmVjdGl2ZVByb2dyZXNzKHRoaXMuX19zbGlkZXJSZXZlYWxfcHJvZ3Jlc3NTcHJpbmdWYWx1ZS5nZXQoKSksIG9yaWVudGF0aW9uKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGVzdHJveSgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2Y7XG4gICAgICAgICAgICAgICAgICAgIChfYSA9IHRoaXMuX19zbGlkZXJSZXZlYWxfY2FuY2VsRmlyc3RMYXlvdXQpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fc2xpZGVyUmV2ZWFsX2NhbmNlbEZpcnN0TGF5b3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3NsaWRlclJldmVhbF9kaXNhYmxlU2Nyb2xsKCk7XG4gICAgICAgICAgICAgICAgICAgIChfYiA9IHRoaXMuX19zbGlkZXJSZXZlYWxfc3RvcEhhbmRsZVN0eWxlRWZmZWN0KSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgKF9jID0gdGhpcy5fX3NsaWRlclJldmVhbF9zdG9wUmV2ZWFsU3R5bGVFZmZlY3QpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAoX2UgPSAoX2QgPSB0aGlzLl9fc2xpZGVyUmV2ZWFsX3Byb2dyZXNzU3ByaW5nVmFsdWUpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5zdG9wKSA9PT0gbnVsbCB8fCBfZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2UuY2FsbChfZCk7XG4gICAgICAgICAgICAgICAgICAgIChfZiA9IHRoaXMuX19zbGlkZXJSZXZlYWxfc3RhcnRBbmltYXRpb25GbikgPT09IG51bGwgfHwgX2YgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9mLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3NsaWRlclJldmVhbF9zdGFydEFuaW1hdGlvbkZuID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF9fc2xpZGVyUmV2ZWFsX2dldEVmZmVjdGl2ZVByb2dyZXNzKHByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRFZmZlY3RpdmVQcm9ncmVzcyhwcm9ncmVzcywgb3JpZW50YXRpb24sIHRoaXMuX19zbGlkZXJSZXZlYWxfcm9vdEVsLCB0aGlzLl9fc2xpZGVyUmV2ZWFsX2hhbmRsZSwgZWRnZUJ1ZmZlclB4KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFzeW5jIF9fc2xpZGVyUmV2ZWFsX2VuYWJsZVNjcm9sbCgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX19zbGlkZXJSZXZlYWxfc2Nyb2xsQW5pbWF0aW9uRm4pXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0xvd1Bvd2VyRGV2aWNlKCkgfHwgaXNSZWR1Y2VkTW90aW9uKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fc2xpZGVyUmV2ZWFsX3N0YXJ0QW5pbWF0aW9uRm4gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fX3NsaWRlclJldmVhbF9hbmltYXRlVG9TdGFydFByb2dyZXNzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fX3NsaWRlclJldmVhbF9zdGFydEFuaW1hdGlvbkZuLnN0YXRlID09ICdydW5uaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBsYXN0U2Nyb2xsUHJvZ3Jlc3MgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fc2xpZGVyUmV2ZWFsX3Njcm9sbEFuaW1hdGlvbkZuID0gc2Nyb2xsKChzY3JvbGxQcm9ncmVzcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RTY3JvbGxQcm9ncmVzcyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFNjcm9sbFByb2dyZXNzID0gc2Nyb2xsUHJvZ3Jlc3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJvZ3Jlc3NEZWx0YSA9IHNjcm9sbFByb2dyZXNzIC0gbGFzdFNjcm9sbFByb2dyZXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFNjcm9sbFByb2dyZXNzID0gc2Nyb2xsUHJvZ3Jlc3M7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fc2xpZGVyUmV2ZWFsX3Byb2dyZXNzVmFsdWUuc2V0KFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2xhbXAgdGhlIG1vZGVsIHZhbHVlIGl0c2VsZiBzbyB0aGUgYm91bmQgcmFuZ2UgaW5wdXQsIGhhbmRsZSwgYW5kIHJldmVhbFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxsIGFncmVlIG9uY2UgdGhlIGhhbmRsZSByZWFjaGVzIGl0cyB2aXNpYmxlIGVkZ2UuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fc2xpZGVyUmV2ZWFsX2dldEVmZmVjdGl2ZVByb2dyZXNzKHRoaXMuX19zbGlkZXJSZXZlYWxfcHJvZ3Jlc3NWYWx1ZS5nZXQoKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3NEZWx0YSAqIFNDUk9MTF9QUk9HUkVTU19UT19SRVZFQUxfUFJPR1JFU1NfTVVMVElQTElFUikpO1xuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6ICRlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldDogWydlbmQgc3RhcnQnLCAnc3RhcnQgZW5kJ10sXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgX19zbGlkZXJSZXZlYWxfZGlzYWJsZVNjcm9sbCgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgICAgICAoX2EgPSB0aGlzLl9fc2xpZGVyUmV2ZWFsX3Njcm9sbEFuaW1hdGlvbkZuKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3NsaWRlclJldmVhbF9zY3JvbGxBbmltYXRpb25GbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhc3luYyBfX3NsaWRlclJldmVhbF9hbmltYXRlVG9TdGFydFByb2dyZXNzKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fX3NsaWRlclJldmVhbF9zdGFydEFuaW1hdGlvbkZuKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlZmZlY3RpdmVGcm9tUHJvZ3Jlc3MgPSBmcm9tUHJvZ3Jlc3MgPT0gbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgPyB0aGlzLl9fc2xpZGVyUmV2ZWFsX3Byb2dyZXNzVmFsdWUuZ2V0KClcbiAgICAgICAgICAgICAgICAgICAgICAgIDogdGhpcy5fX3NsaWRlclJldmVhbF9nZXRFZmZlY3RpdmVQcm9ncmVzcyhmcm9tUHJvZ3Jlc3MpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fc2xpZGVyUmV2ZWFsX3N0YXJ0QW5pbWF0aW9uRm4gPSBhbmltYXRlKG1vdGlvbkFyZyh0aGlzLl9fc2xpZGVyUmV2ZWFsX3Byb2dyZXNzVmFsdWUpLCBbZWZmZWN0aXZlRnJvbVByb2dyZXNzLCB0aGlzLl9fc2xpZGVyUmV2ZWFsX3N0YXJ0UHJvZ3Jlc3NdLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMC4zLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWFzZTogJ2Vhc2VJbk91dCcsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fX3NsaWRlclJldmVhbF9zdGFydEFuaW1hdGlvbkZuLmZpbmlzaGVkO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgIH0pO1xufVxuZnVuY3Rpb24gY2xhbXBQcm9ncmVzcyhwcm9ncmVzcykge1xuICAgIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigxMDAsIHByb2dyZXNzKSk7XG59XG5mdW5jdGlvbiBnZXRFZmZlY3RpdmVQcm9ncmVzcyhwcm9ncmVzcywgb3JpZW50YXRpb24sIHJvb3RFbCwgaGFuZGxlRWwsIGVkZ2VCdWZmZXJQeCkge1xuICAgIGNvbnN0IGJvdW5kZWRQcm9ncmVzcyA9IGNsYW1wUHJvZ3Jlc3MocHJvZ3Jlc3MpO1xuICAgIGlmIChyb290RWwgPT0gbnVsbCB8fCBoYW5kbGVFbCA9PSBudWxsKVxuICAgICAgICByZXR1cm4gYm91bmRlZFByb2dyZXNzO1xuICAgIC8vIENsYW1wIGluIGhhbmRsZS1zcGFjZSBmaXJzdCwgdGhlbiBjb252ZXJ0IGJhY2sgdG8gcHJvZ3Jlc3Mgc28gZXZlcnkgY29uc3VtZXJcbiAgICAvLyBjYW4gc2hhcmUgb25lIFwiZWZmZWN0aXZlXCIgcHJvZ3Jlc3MgdmFsdWUuXG4gICAgY29uc3QgdHJhbnNsYXRlQW1vdW50ID0gZ2V0Q2xhbXBlZEhhbmRsZVRyYW5zbGF0ZUFtb3VudChib3VuZGVkUHJvZ3Jlc3MsIG9yaWVudGF0aW9uLCByb290RWwsIGhhbmRsZUVsLCBlZGdlQnVmZmVyUHgpO1xuICAgIHJldHVybiBnZXRQcm9ncmVzc0Zyb21IYW5kbGVUcmFuc2xhdGVBbW91bnQodHJhbnNsYXRlQW1vdW50LCBvcmllbnRhdGlvbiwgcm9vdEVsKTtcbn1cbmZ1bmN0aW9uIGdldFByb2dyZXNzRnJvbUhhbmRsZVRyYW5zbGF0ZUFtb3VudCh0cmFuc2xhdGVBbW91bnQsIG9yaWVudGF0aW9uLCByb290RWwpIHtcbiAgICBjb25zdCByb290UmVjdCA9IHJvb3RFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCByb290U2l6ZSA9IG9yaWVudGF0aW9uID09PSAndmVydGljYWwnID8gcm9vdFJlY3QuaGVpZ2h0IDogcm9vdFJlY3Qud2lkdGg7XG4gICAgY29uc3QgZGlyZWN0aW9uTXVsdGlwbGllciA9IGRvY3VtZW50LmRpciA9PT0gJ3J0bCcgPyAtMSA6IDE7XG4gICAgaWYgKHJvb3RTaXplID09PSAwKVxuICAgICAgICByZXR1cm4gMDtcbiAgICByZXR1cm4gY2xhbXBQcm9ncmVzcygodHJhbnNsYXRlQW1vdW50IC8gKGRpcmVjdGlvbk11bHRpcGxpZXIgKiByb290U2l6ZSkpICogMTAwKTtcbn1cbmZ1bmN0aW9uIGdldEhhbmRsZVRyYW5zZm9ybShwcm9ncmVzcywgb3JpZW50YXRpb24sIHJvb3RFbCwgaGFuZGxlRWwsIGVkZ2VCdWZmZXJQeCkge1xuICAgIGNvbnN0IHRyYW5zbGF0ZUFtb3VudCA9IGdldENsYW1wZWRIYW5kbGVUcmFuc2xhdGVBbW91bnQocHJvZ3Jlc3MsIG9yaWVudGF0aW9uLCByb290RWwsIGhhbmRsZUVsLCBlZGdlQnVmZmVyUHgpO1xuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICByZXR1cm4gYHRyYW5zbGF0ZVkoJHt0cmFuc2xhdGVBbW91bnR9cHgpYDtcbiAgICB9XG4gICAgcmV0dXJuIGB0cmFuc2xhdGVYKCR7dHJhbnNsYXRlQW1vdW50fXB4KWA7XG59XG5mdW5jdGlvbiBnZXRDbGFtcGVkSGFuZGxlVHJhbnNsYXRlQW1vdW50KHByb2dyZXNzLCBvcmllbnRhdGlvbiwgcm9vdEVsLCBoYW5kbGVFbCwgZWRnZUJ1ZmZlclB4KSB7XG4gICAgY29uc3Qgcm9vdFJlY3QgPSByb290RWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3Qgcm9vdFNpemUgPSBvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJyA/IHJvb3RSZWN0LmhlaWdodCA6IHJvb3RSZWN0LndpZHRoO1xuICAgIGNvbnN0IGRpcmVjdGlvbk11bHRpcGxpZXIgPSBkb2N1bWVudC5kaXIgPT09ICdydGwnID8gLTEgOiAxO1xuICAgIC8vIENsYW1wIGluIExUUi1lcXVpdmFsZW50IHNwYWNlICgw4oCmcm9vdFNpemUpLiBSVEwgYXBwbGllcyBhIHNpZ24gYWZ0ZXIgY2xhbXBpbmc7IG90aGVyd2lzZVxuICAgIC8vIG5lZ2F0aXZlIGRlc2lyZWQgdmFsdWVzIGFsd2F5cyBoaXQgTWF0aC5tYXgobWluLCDigKYpIHdoZW4gbWluL21heCBhcmUgcG9zaXRpdmUgZWRnZSBib3VuZHMuXG4gICAgY29uc3QgcHJvZ3Jlc3NCYXNlZFRyYW5zbGF0ZSA9IChwcm9ncmVzcyAvIDEwMCkgKiByb290U2l6ZTtcbiAgICBjb25zdCBoYW5kbGVDb250ZW50Qm91bmRzID0gZ2V0SGFuZGxlQ29udGVudEJvdW5kcyhoYW5kbGVFbCwgb3JpZW50YXRpb24pO1xuICAgIGlmIChoYW5kbGVDb250ZW50Qm91bmRzID09IG51bGwpXG4gICAgICAgIHJldHVybiBkaXJlY3Rpb25NdWx0aXBsaWVyICogcHJvZ3Jlc3NCYXNlZFRyYW5zbGF0ZTtcbiAgICBjb25zdCBoYW5kbGVSZWN0ID0gaGFuZGxlRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgaGFuZGxlU3RhcnQgPSBvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJyA/IGhhbmRsZVJlY3QudG9wIDogaGFuZGxlUmVjdC5sZWZ0O1xuICAgIGNvbnN0IGNvbnRlbnRTdGFydE9mZnNldCA9IGhhbmRsZUNvbnRlbnRCb3VuZHMuc3RhcnQgLSBoYW5kbGVTdGFydDtcbiAgICBjb25zdCBjb250ZW50RW5kT2Zmc2V0ID0gaGFuZGxlQ29udGVudEJvdW5kcy5lbmQgLSBoYW5kbGVTdGFydDtcbiAgICBjb25zdCBtaW5UcmFuc2xhdGVBbW91bnQgPSBlZGdlQnVmZmVyUHggLSBjb250ZW50U3RhcnRPZmZzZXQ7XG4gICAgY29uc3QgbWF4VHJhbnNsYXRlQW1vdW50ID0gcm9vdFNpemUgLSBlZGdlQnVmZmVyUHggLSBjb250ZW50RW5kT2Zmc2V0O1xuICAgIGNvbnN0IGNsYW1wZWRQcm9ncmVzc0Jhc2VkVHJhbnNsYXRlID0gTWF0aC5tYXgobWluVHJhbnNsYXRlQW1vdW50LCBNYXRoLm1pbihtYXhUcmFuc2xhdGVBbW91bnQsIHByb2dyZXNzQmFzZWRUcmFuc2xhdGUpKTtcbiAgICByZXR1cm4gZGlyZWN0aW9uTXVsdGlwbGllciAqIGNsYW1wZWRQcm9ncmVzc0Jhc2VkVHJhbnNsYXRlO1xufVxuZnVuY3Rpb24gZ2V0SGFuZGxlQ29udGVudEJvdW5kcyhoYW5kbGVFbCwgb3JpZW50YXRpb24pIHtcbiAgICBjb25zdCBkZXNjZW5kYW50RWxzID0gQXJyYXkuZnJvbShoYW5kbGVFbC5xdWVyeVNlbGVjdG9yQWxsKCcqJykpO1xuICAgIGlmIChkZXNjZW5kYW50RWxzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgbGV0IHN0YXJ0ID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIGxldCBlbmQgPSBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFk7XG4gICAgZm9yIChjb25zdCBkZXNjZW5kYW50RWwgb2YgZGVzY2VuZGFudEVscykge1xuICAgICAgICBjb25zdCBkZXNjZW5kYW50UmVjdCA9IGRlc2NlbmRhbnRFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAgICAgICBzdGFydCA9IE1hdGgubWluKHN0YXJ0LCBkZXNjZW5kYW50UmVjdC50b3ApO1xuICAgICAgICAgICAgZW5kID0gTWF0aC5tYXgoZW5kLCBkZXNjZW5kYW50UmVjdC5ib3R0b20pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3RhcnQgPSBNYXRoLm1pbihzdGFydCwgZGVzY2VuZGFudFJlY3QubGVmdCk7XG4gICAgICAgICAgICBlbmQgPSBNYXRoLm1heChlbmQsIGRlc2NlbmRhbnRSZWN0LnJpZ2h0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyBzdGFydCwgZW5kIH07XG59XG5mdW5jdGlvbiBnZXRSZXZlYWxDbGlwUGF0aChwcm9ncmVzcywgb3JpZW50YXRpb24pIHtcbiAgICBjb25zdCBwcm9ncmVzc1RvUGVyY2VudCA9IHRyYW5zZm9ybShbMCwgMTAwXSwgWycwJScsICcxMDAlJ10pO1xuICAgIGNvbnN0IHBlcmNlbnRQcm9ncmVzcyA9IHByb2dyZXNzVG9QZXJjZW50KHByb2dyZXNzKTtcbiAgICBpZiAob3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmRpciA9PT0gJ3J0bCcgPyBgaW5zZXQoMCUgMCUgJHtwZXJjZW50UHJvZ3Jlc3N9IDAlKWAgOiBgaW5zZXQoJHtwZXJjZW50UHJvZ3Jlc3N9IDAlIDAlIDAlKWA7XG4gICAgfVxuICAgIHJldHVybiBkb2N1bWVudC5kaXIgPT09ICdydGwnID8gYGluc2V0KDAlICR7cGVyY2VudFByb2dyZXNzfSAwJSAwJSlgIDogYGluc2V0KDAlIDAlIDAlICR7cGVyY2VudFByb2dyZXNzfSlgO1xufVxuZnVuY3Rpb24gaGFuZGxlU2xpZGVyUmV2ZWFsTWFnaWMoQWxwaW5lKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgkZWwpIHtcbiAgICAgICAgY29uc3QgJGRhdGEgPSBBbHBpbmUuJGRhdGEoJGVsKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldCBwcm9ncmVzc1ZhbHVlKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkZGF0YS5fX3NsaWRlclJldmVhbF9wcm9ncmVzc1ZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldCBwcm9ncmVzcygpIHtcbiAgICAgICAgICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAgICAgICAgIHJldHVybiAoX2IgPSAoX2EgPSAkZGF0YS5fX3NsaWRlclJldmVhbF9wcm9ncmVzc1ZhbHVlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZ2V0KSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChfYSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0IHByb2dyZXNzKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgICAgICAoX2IgPSAoX2EgPSAkZGF0YS5fX3NsaWRlclJldmVhbF9wcm9ncmVzc1ZhbHVlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc2V0KSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChfYSwgJGRhdGEuX19zbGlkZXJSZXZlYWxfZ2V0RWZmZWN0aXZlUHJvZ3Jlc3ModmFsdWUpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbmFibGVTY3JvbGwoKSB7XG4gICAgICAgICAgICAgICAgJGRhdGEuX19zbGlkZXJSZXZlYWxfZW5hYmxlU2Nyb2xsKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGlzYWJsZVNjcm9sbCgpIHtcbiAgICAgICAgICAgICAgICAkZGF0YS5fX3NsaWRlclJldmVhbF9kaXNhYmxlU2Nyb2xsKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH07XG59XG4vKipcbiAqIENyZWF0ZXMgYSByZWFjdGl2ZSBtb3Rpb24gdmFsdWUgdGhhdCB1cGRhdGVzIEFscGluZSBzdGF0ZSB3aGVuIHRoZSBtb3Rpb24gdmFsdWUgY2hhbmdlcy5cbiAqIFVzZWQgYnkgc2xpZGVyLXJldmVhbCBmb3IgYmVmb3JlLWFmdGVyIHByb2dyZXNzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVhY3RpdmVNb3Rpb25WYWx1ZShfQWxwaW5lLCBpbml0aWFsTW90aW9uVmFsdWUpIHtcbiAgICBjb25zdCB2YWx1ZSA9IG1vdGlvblZhbHVlKGluaXRpYWxNb3Rpb25WYWx1ZSk7XG4gICAgY29uc3QgcmVhY3RpdmVWYWx1ZSA9IF9BbHBpbmUucmVhY3RpdmUoeyB2YWx1ZTogdmFsdWUuZ2V0KCkgfSk7XG4gICAgdmFsdWUub24oJ2NoYW5nZScsIChuZXdWYWx1ZSkgPT4ge1xuICAgICAgICByZWFjdGl2ZVZhbHVlLnZhbHVlID0gbmV3VmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5ldyBQcm94eSh2YWx1ZSwge1xuICAgICAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdnZXQnKSB7XG4gICAgICAgICAgICAgICAgcmVhY3RpdmVWYWx1ZS52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKTtcbiAgICAgICAgfSxcbiAgICB9KTtcbn1cbiIsImltcG9ydCB7QWxwaW5lQ29tcG9uZW50LCBBbHBpbmUgYXMgQWxwaW5lVHlwZSwgRGlyZWN0aXZlRGF0YX0gZnJvbSAnYWxwaW5lanMnO1xuXG4vKipcbiAqIEFuYWxvZyB3cmFwcGVyIGFyb3VuZCBgeC1zbGlkZXItcmV2ZWFsYCBmb3IgdGhlIGJlZm9yZS9hZnRlciBzbmlwcGV0LlxuICpcbiAqIGB4LWJlZm9yZS1hZnRlci1zbGlkZXItcmV2ZWFsYCBmb3J3YXJkcyBpdHMgbW9kaWZpZXJzIHRvIGB4LXNsaWRlci1yZXZlYWxgIHVuY2hhbmdlZFxuICogYW5kIHRpZXMgc2Nyb2xsIGNvbnRyb2wgdG8gc2VjdGlvbiB2aXNpYmlsaXR5IGZyb20gYCRzdG9yZS5zZWN0aW9uc2A6IGl0IGNhbGxzXG4gKiBgJHNsaWRlclJldmVhbC5lbmFibGVTY3JvbGwoKWAgd2hpbGUgdGhlIHNlY3Rpb24gaW50ZXJzZWN0cyB0aGUgdmlld3BvcnQgYW5kXG4gKiBgJHNsaWRlclJldmVhbC5kaXNhYmxlU2Nyb2xsKClgIHdoZW4gaXQgc2Nyb2xscyBvdXQsIHNvIG9mZnNjcmVlbiBzbGlkZXJzIGRvIG5vXG4gKiBzY3JvbGwgd29yay5cbiAqXG4gKiBAZXhhbXBsZVxuICogPGJlZm9yZS1hZnRlciB4LWJlZm9yZS1hZnRlci1zbGlkZXItcmV2ZWFsLnZlcnRpY2FsLmZyb20uMCUucHJvZ3Jlc3MuNTAlPuKApjwvYmVmb3JlLWFmdGVyPlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBiZWZvcmVBZnRlclNsaWRlclJldmVhbChBbHBpbmU6IEFscGluZVR5cGUpIHtcbiAgQWxwaW5lLmRpcmVjdGl2ZSgnYmVmb3JlLWFmdGVyLXNsaWRlci1yZXZlYWwnLCAoJGVsOiBIVE1MRWxlbWVudCwgZGF0YTogRGlyZWN0aXZlRGF0YSkgPT4ge1xuICAgIEFscGluZS5iaW5kKCRlbCwge1xuICAgICAgW2B4LXNsaWRlci1yZXZlYWwke2RhdGEubW9kaWZpZXJzLmxlbmd0aCA/IGAuJHtkYXRhLm1vZGlmaWVycy5qb2luKCcuJyl9YCA6ICcnfWBdOiAnJyxcbiAgICAgIFsneC1kYXRhJ10oKTogQWxwaW5lQ29tcG9uZW50PHtcbiAgICAgICAgaXNJbnRlcnNlY3Rpbmc6IGJvb2xlYW47XG4gICAgICB9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZ2V0IGlzSW50ZXJzZWN0aW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJHN0b3JlLnNlY3Rpb25zLmlzSW50ZXJzZWN0aW5nKHRoaXMuJHNlY3Rpb25JZCEpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgaW5pdCh0aGlzOiBhbnkpIHtcbiAgICAgICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuaXNJbnRlcnNlY3RpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRzbGlkZXJSZXZlYWwuZW5hYmxlU2Nyb2xsKCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB0aGlzLiR3YXRjaCgnaXNJbnRlcnNlY3RpbmcnLCAoaXNWaXNpYmxlOiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuJHN0b3JlLnNlY3Rpb25zLmhhc0ludGVyc2VjdGVkKHRoaXMuJHNlY3Rpb25JZCkpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChpc1Zpc2libGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kc2xpZGVyUmV2ZWFsLmVuYWJsZVNjcm9sbCgpO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kc2xpZGVyUmV2ZWFsLmRpc2FibGVTY3JvbGwoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pLmJlZm9yZSgnYmluZCcpO1xufVxuIiwiaW1wb3J0IEFscGluZSBmcm9tICdhbHBpbmVqcyc7XG5pbXBvcnQge3NsaWRlclJldmVhbH0gZnJvbSAnQGdyb3VwdGhvdWdodC90cmFkZWNyYWZ0LXVpL2FscGluZSc7XG5pbXBvcnQgYmVmb3JlQWZ0ZXJTbGlkZXJSZXZlYWwgZnJvbSAnLi9wbHVnaW5zL2JlZm9yZS1hZnRlci1zbGlkZXItcmV2ZWFsJztcblxuQWxwaW5lLnBsdWdpbihbc2xpZGVyUmV2ZWFsLCBiZWZvcmVBZnRlclNsaWRlclJldmVhbF0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBGQSxTQUFnQixjQUFjLElBQUksSUFBSTtDQUNsQyxNQUFNLFdBQVcsSUFBSSxnQkFBZ0IsWUFBWTtFQUM3QyxTQUFTLFdBQVc7RUFDcEIsR0FBRyxRQUFRLEVBQUU7Q0FDakIsQ0FBQztDQUNELFNBQVMsUUFBUSxFQUFFO0NBQ25CLGFBQWEsU0FBUyxXQUFXO0FBQ3JDOzs7Ozs7Ozs7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