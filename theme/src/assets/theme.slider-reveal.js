
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
//#region ../../packages/assembly-ui/dist/utils/layout-measure.js
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
//#region ../../packages/assembly-ui/dist/utils/modifiers/spring.js
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
//#region ../../packages/assembly-ui/dist/utils/device.js
function isReducedMotion() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function isLowPowerDevice() {
	return Number(navigator.hardwareConcurrency) <= 2 || Number(navigator.deviceMemory) <= 2;
}

//#endregion
//#region ../../packages/assembly-ui/dist/utils/motion.js
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
//#region ../../packages/assembly-ui/dist/alpine/slider-reveal.js
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuc2xpZGVyLXJldmVhbC5qcyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyIuLi8uLi8uLi9wYWNrYWdlcy9hc3NlbWJseS11aS9kaXN0L3V0aWxzL2xheW91dC1tZWFzdXJlLmpzIiwiLi4vLi4vLi4vcGFja2FnZXMvYXNzZW1ibHktdWkvZGlzdC91dGlscy9lcnJvci5qcyIsIi4uLy4uLy4uL3BhY2thZ2VzL2Fzc2VtYmx5LXVpL2Rpc3QvdXRpbHMvbW9kaWZpZXJzL2Jhc2UuanMiLCIuLi8uLi8uLi9wYWNrYWdlcy9hc3NlbWJseS11aS9kaXN0L3V0aWxzL21vZGlmaWVycy9zcHJpbmcuanMiLCIuLi8uLi8uLi9wYWNrYWdlcy9hc3NlbWJseS11aS9kaXN0L3V0aWxzL2RldmljZS5qcyIsIi4uLy4uLy4uL3BhY2thZ2VzL2Fzc2VtYmx5LXVpL2Rpc3QvdXRpbHMvbW90aW9uLmpzIiwiLi4vLi4vLi4vcGFja2FnZXMvYXNzZW1ibHktdWkvZGlzdC9hbHBpbmUvc2xpZGVyLXJldmVhbC5qcyIsIi4uL3NyYy9qcy9wbHVnaW5zL2JlZm9yZS1hZnRlci1zbGlkZXItcmV2ZWFsLnRzIiwiLi4vc3JjL2pzL3RoZW1lLnNsaWRlci1yZXZlYWwudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBIZWxwZXJzIGZvciByZWFkaW5nIGxheW91dCB3aXRob3V0IGZvcmNpbmcgc3luY2hyb25vdXMgcmVmbG93cy5cbiAqXG4gKiBBIGZyYW1lIHJlbmRlcnMgaW4gdGhpcyBvcmRlcjogckFGIGNhbGxiYWNrcyDihpIgc3R5bGUvbGF5b3V0IOKGkiBSZXNpemVPYnNlcnZlclxuICogY2FsbGJhY2tzIOKGkiBwYWludC4gUmVhZGluZyBnZW9tZXRyeSB3aGlsZSBzdHlsZSBpcyBkaXJ0eSAobWljcm90YXNrIGZsdXNoZXMsIHJBRlxuICogY2FsbGJhY2tzKSBmb3JjZXMgYSBzeW5jaHJvbm91cyByZWZsb3cuIFR3byBjbGVhbiByZWFkIHBvaW50cyBleGlzdDpcbiAqXG4gKiAtICoqUmVzaXplT2JzZXJ2ZXIgY2FsbGJhY2tzKiog4oCUIGxheW91dCBqdXN0IHJhbiwgc28gcmVhZHMgYXJlIGZyZWUsIGFuZCBzdHlsZSB3cml0ZXNcbiAqICAgc3RpbGwgbGFuZCBpbiB0aGUgc2FtZSBmcmFtZSdzIHBhaW50IChubyBmbGFzaCkuIFVzZSBgb25GaXJzdExheW91dGAgZm9yIG9uZS1vZmZcbiAqICAgXCJtZWFzdXJlLCB0aGVuIGFwcGx5IGluaXRpYWwgc3R5bGVzXCIgd29yaywgYW5kIGB4LXJlc2l6ZWAgZm9yIG9uZ29pbmcgc2l6ZSB0cmFja2luZy5cbiAqIC0gKipBZnRlciBwYWludCoqIOKAlCBgYWZ0ZXJOZXh0UGFpbnRgIC8gYHJlYWRMYXlvdXRBZnRlclBhaW50YCBydW4gaW4gYSB0YXNrIHJpZ2h0IGFmdGVyXG4gKiAgIHRoZSBmcmFtZSBjb21taXRzLiBSZWFkcyBhcmUgZnJlZSwgYnV0IHdyaXRlcyByZW5kZXIgb25lIGZyYW1lIGxhdGVyOyBuZXZlciB1c2UgdGhlbVxuICogICB0byBhcHBseSBpbml0aWFsIHZpc3VhbCBzdGF0ZSAoaXQgZmxhc2hlcykuIFVzZSB0aGVtIHRvIHlpZWxkIHVudGlsIHBlbmRpbmcgRE9NXG4gKiAgIG11dGF0aW9ucyBoYXZlIHJlbmRlcmVkIChlLmcuIG1lYXN1cmUg4oaSIG11dGF0ZSDihpIgbWVhc3VyZSBsb29wcykuXG4gKlxuICogQWxsIGBhZnRlck5leHRQYWludGAvYHJlYWRMYXlvdXRBZnRlclBhaW50YCBjYWxsYmFja3Mgc2NoZWR1bGVkIGluIHRoZSBzYW1lIGZyYW1lIHNoYXJlXG4gKiBhIHNpbmdsZSBmbHVzaCB3aXRoIHJlYWRzIHJ1bm5pbmcgZmlyc3QsIHNvIGJhdGNoZWQgcmVhZHMgbmV2ZXIgaW50ZXJsZWF2ZSB3aXRoXG4gKiBiYXRjaGVkIHdyaXRlcy5cbiAqL1xubGV0IHBlbmRpbmdSZWFkcyA9IFtdO1xubGV0IHBlbmRpbmdDYWxsYmFja3MgPSBbXTtcbmxldCBmbHVzaFNjaGVkdWxlZCA9IGZhbHNlO1xuZnVuY3Rpb24gZmx1c2hBZnRlclBhaW50KCkge1xuICAgIGZsdXNoU2NoZWR1bGVkID0gZmFsc2U7XG4gICAgY29uc3QgcmVhZHMgPSBwZW5kaW5nUmVhZHM7XG4gICAgY29uc3QgY2FsbGJhY2tzID0gcGVuZGluZ0NhbGxiYWNrcztcbiAgICBwZW5kaW5nUmVhZHMgPSBbXTtcbiAgICBwZW5kaW5nQ2FsbGJhY2tzID0gW107XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiByZWFkcykge1xuICAgICAgICBpZiAoIWVudHJ5LmNhbmNlbGxlZClcbiAgICAgICAgICAgIGVudHJ5LmZuKCk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZW50cnkgb2YgY2FsbGJhY2tzKSB7XG4gICAgICAgIGlmICghZW50cnkuY2FuY2VsbGVkKVxuICAgICAgICAgICAgZW50cnkuZm4oKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzY2hlZHVsZUZsdXNoQWZ0ZXJQYWludCgpIHtcbiAgICBpZiAoZmx1c2hTY2hlZHVsZWQpXG4gICAgICAgIHJldHVybjtcbiAgICBmbHVzaFNjaGVkdWxlZCA9IHRydWU7XG4gICAgaWYgKGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gJ2hpZGRlbicpIHtcbiAgICAgICAgLy8gSGlkZGVuIGRvY3VtZW50cyBkb24ndCBwYWludCwgc28gckFGIHdvdWxkIHN0YWxsIGluZGVmaW5pdGVseS5cbiAgICAgICAgc2V0VGltZW91dChmbHVzaEFmdGVyUGFpbnQsIDApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gckFGIGFsb25lIHJ1bnMgKmJlZm9yZSogc3R5bGUvbGF5b3V0L3BhaW50OyBhIHRhc2sgc2NoZWR1bGVkIGZyb20gaW5zaWRlIGl0IHJ1bnNcbiAgICAgICAgLy8gcmlnaHQgYWZ0ZXIgdGhlIGZyYW1lIGNvbW1pdHMg4oCUIHRoZSBlYXJsaWVzdCBwb2ludCB3aGVyZSBsYXlvdXQgaXMgY2xlYW4uXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBzZXRUaW1lb3V0KGZsdXNoQWZ0ZXJQYWludCwgMCkpO1xuICAgIH1cbn1cbi8qKlxuICogUnVucyBgZm5gIGFmdGVyIHRoZSBuZXh0IHBhaW50LiBSZXR1cm5zIGEgY2FuY2VsIGZ1bmN0aW9uLlxuICpcbiAqIExheW91dCBpcyBjbGVhbiBhdCB0aGlzIHBvaW50LCBzbyBnZW9tZXRyeSByZWFkcyBhcmUgZnJlZSDigJQgYnV0IHN0eWxlIHdyaXRlcyBoZXJlXG4gKiByZW5kZXIgb25lIGZyYW1lIGxhdGVyIHRoYW4gd3JpdGVzIG1hZGUgaW4gYSByQUYuIFByZWZlciBgb25GaXJzdExheW91dGAgd2hlbiB0aGVcbiAqIGNhbGxiYWNrIGFwcGxpZXMgaW5pdGlhbCB2aXN1YWwgc3RhdGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZnRlck5leHRQYWludChmbikge1xuICAgIGNvbnN0IGVudHJ5ID0geyBmbiwgY2FuY2VsbGVkOiBmYWxzZSB9O1xuICAgIHBlbmRpbmdDYWxsYmFja3MucHVzaChlbnRyeSk7XG4gICAgc2NoZWR1bGVGbHVzaEFmdGVyUGFpbnQoKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBlbnRyeS5jYW5jZWxsZWQgPSB0cnVlO1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gYWZ0ZXJOZXh0UGFpbnRBc3luYygpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgYWZ0ZXJOZXh0UGFpbnQocmVzb2x2ZSk7XG4gICAgfSk7XG59XG4vKipcbiAqIFJ1bnMgdGhlIHJlYWQgY2FsbGJhY2sgYWZ0ZXIgdGhlIG5leHQgcGFpbnQsIGJlZm9yZSBhbnkgYGFmdGVyTmV4dFBhaW50YCBjYWxsYmFja3NcbiAqIGZyb20gdGhlIHNhbWUgZnJhbWUsIHNvIGJhdGNoZWQgcmVhZHMgY2FuJ3QgaW50ZXJsZWF2ZSB3aXRoIGJhdGNoZWQgd3JpdGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVhZExheW91dEFmdGVyUGFpbnQoZm4pIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgcGVuZGluZ1JlYWRzLnB1c2goeyBmbjogKCkgPT4gcmVzb2x2ZShmbigpKSwgY2FuY2VsbGVkOiBmYWxzZSB9KTtcbiAgICAgICAgc2NoZWR1bGVGbHVzaEFmdGVyUGFpbnQoKTtcbiAgICB9KTtcbn1cbi8qKlxuICogUnVucyBgZm5gIG9uY2UgdGhlIGVsZW1lbnQgaGFzIGEgbGF5b3V0IGJveCwgaW5zaWRlIGEgUmVzaXplT2JzZXJ2ZXIgY2FsbGJhY2s6XG4gKiBhZnRlciBsYXlvdXQgKHJlYWRzIGFyZSBmcmVlIOKAlCBubyBmb3JjZWQgcmVmbG93KSBidXQgYmVmb3JlIHBhaW50IChzdHlsZSB3cml0ZXNcbiAqIHN0aWxsIGxhbmQgaW4gdGhpcyBmcmFtZSDigJQgbm8gZmxhc2ggb2YgdW5zdHlsZWQgc3RhdGUpLlxuICpcbiAqIEZvciBhbiBlbGVtZW50IHRoYXQgaXMgcmVuZGVyZWQgd2hlbiBjYWxsZWQsIHRoaXMgZmlyZXMgZHVyaW5nIHRoZSBjdXJyZW50IGZyYW1lJ3NcbiAqIHJlbmRlcmluZyBzdGVwcy4gRm9yIGEgYGRpc3BsYXk6IG5vbmVgIGVsZW1lbnQsIGl0IGZpcmVzIHdoZW4gdGhlIGVsZW1lbnQgZmlyc3RcbiAqIGdldHMgYSBib3gg4oCUIHNvIG1lYXN1cmVtZW50cyBhcmUgbmV2ZXIgYSBtZWFuaW5nbGVzcyAww5cwLiBSZXR1cm5zIGEgY2FuY2VsIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gb25GaXJzdExheW91dChlbCwgZm4pIHtcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcigoZW50cmllcykgPT4ge1xuICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIGZuKGVudHJpZXNbMF0pO1xuICAgIH0pO1xuICAgIG9ic2VydmVyLm9ic2VydmUoZWwpO1xuICAgIHJldHVybiAoKSA9PiBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG59XG4iLCIvKipcbiAqIExvZ3MgYSBjbGVhciwgYWN0aW9uYWJsZSBjb25zb2xlIGVycm9yIHdoZW4gYSBNZXRob2QgVUkgZGlyZWN0aXZlIGlzIHVzZWRcbiAqIHdpdGhvdXQgYSBwYXJlbnQgZGlyZWN0aXZlIGl0IGRlcGVuZHMgb24uXG4gKlxuICogTWFueSBkaXJlY3RpdmVzIG9ubHkgd29yayB3aGVuIG5lc3RlZCBpbnNpZGUgYSBwYXJlbnQgZGlyZWN0aXZlIHRoYXQgc2V0cyB1cFxuICogc2hhcmVkIHN0YXRlIG9uIHRoZSBBbHBpbmUgc2NvcGUgKGUuZy4gYHgtb3ZlcmZsb3c6c3RhcnRgIG5lZWRzIGFuIGFuY2VzdG9yXG4gKiBgeC1vdmVyZmxvd2ApLiBXaGVuIHRoYXQgcGFyZW50IGlzIG1pc3NpbmcsIHRoZSByYXcgZmFpbHVyZSBpcyBhbiBpbnNjcnV0YWJsZVxuICogYHRoaXMuX19mb28gaXMgbm90IGEgZnVuY3Rpb25gLiBDYWxsIHRoaXMgaW5zdGVhZCBzbyB1c2VycyBnZXQgYSBtZXNzYWdlIHRoYXRcbiAqIGV4cGxhaW5zIHdoYXQgdG8gZG8uXG4gKlxuICogQHBhcmFtIGNoaWxkRGlyZWN0aXZlIC0gVGhlIGRpcmVjdGl2ZSBiZWluZyB1c2VkLCBlLmcuIGAneC1vdmVyZmxvdzpzdGFydCdgLlxuICogQHBhcmFtIHBhcmVudERpcmVjdGl2ZSAtIFRoZSBwYXJlbnQgZGlyZWN0aXZlIHJlcXVpcmVkLCBlLmcuIGAneC1vdmVyZmxvdydgLlxuICogQHBhcmFtIGVsIC0gVGhlIGVsZW1lbnQgdGhlIGNoaWxkIGRpcmVjdGl2ZSBpcyBvbiwgbG9nZ2VkIGZvciBjb250ZXh0LlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGB0c1xuICogaWYgKHR5cGVvZiB0aGlzLl9fb3ZlcmZsb3dfcmVnaXN0ZXJCb3VuZGFyeSAhPT0gJ2Z1bmN0aW9uJykge1xuICogICB3YXJuTWlzc2luZ1BhcmVudERpcmVjdGl2ZShgeC1vdmVyZmxvdzoke3ZhbHVlfWAsICd4LW92ZXJmbG93JywgJGVsKTtcbiAqICAgcmV0dXJuO1xuICogfVxuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3YXJuTWlzc2luZ1BhcmVudERpcmVjdGl2ZShjaGlsZERpcmVjdGl2ZSwgcGFyZW50RGlyZWN0aXZlLCBlbCkge1xuICAgIGNvbnNvbGUuZXJyb3IoYENhbm5vdCB1c2UgJHtjaGlsZERpcmVjdGl2ZX0gd2l0aG91dCBhIHBhcmVudCBlbGVtZW50IGhhdmluZyAke3BhcmVudERpcmVjdGl2ZX0uYCwgZWwpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHByZXR0eVByaW50RXJyb3IoZXJyKSB7XG4gICAgbGV0IG91dHB1dCA9ICcnO1xuICAgIGlmICh0eXBlb2YgZXJyID09PSAnc3RyaW5nJykge1xuICAgICAgICBvdXRwdXQgPSBlcnI7XG4gICAgfVxuICAgIGVsc2UgaWYgKGVyciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIG91dHB1dCA9IGVyci5tZXNzYWdlO1xuICAgIH1cbiAgICBlbHNlIGlmIChlcnIgJiYgdHlwZW9mIGVyci50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBvdXRwdXQgPSBlcnIudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZXJyICYmIHR5cGVvZiBlcnIubWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgb3V0cHV0ID0gZXJyLm1lc3NhZ2U7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvdXRwdXQgPSAnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZC4nO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xufVxuIiwiLyoqXG4gKiBSZXR1cm5zIHRoZSB0b2tlbiB0aGF0IGZvbGxvd3MgYSBkaXJlY3RpdmUgbW9kaWZpZXIgbmFtZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0TW9kaWZpZXJWYWx1ZShbJ3NwZWVkJywgJzYwJ10sICdzcGVlZCcpO1xuICogLy8gPT4gJzYwJ1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIG1vZGlmaWVyTmFtZSkge1xuICAgIHZhciBfYTtcbiAgICBjb25zdCBtb2RpZmllckluZGV4ID0gbW9kaWZpZXJzLmluZGV4T2YobW9kaWZpZXJOYW1lKTtcbiAgICBpZiAobW9kaWZpZXJJbmRleCA9PT0gLTEpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIHJldHVybiAoX2EgPSBtb2RpZmllcnNbbW9kaWZpZXJJbmRleCArIDFdKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBudWxsO1xufVxuLyoqXG4gKiBSZXR1cm5zIGEgbnVtZXJpYyBtb2RpZmllciB2YWx1ZSB3aGVuIGl0IGNhbiBiZSBwYXJzZWQgYXMgYSBmaW5pdGUgbnVtYmVyLlxuICpcbiAqIEBleGFtcGxlXG4gKiBnZXROdW1iZXJNb2RpZmllclZhbHVlKFsnc3BlZWQnLCAnLTYwJ10sICdzcGVlZCcpO1xuICogLy8gPT4gLTYwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXROdW1iZXJNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKSB7XG4gICAgY29uc3QgcmF3TW9kaWZpZXJWYWx1ZSA9IGdldE1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpO1xuICAgIGlmIChyYXdNb2RpZmllclZhbHVlID09IG51bGwpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHBhcnNlZE1vZGlmaWVyVmFsdWUgPSBOdW1iZXIocmF3TW9kaWZpZXJWYWx1ZSk7XG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUocGFyc2VkTW9kaWZpZXJWYWx1ZSkpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIHJldHVybiBwYXJzZWRNb2RpZmllclZhbHVlO1xufVxuLyoqXG4gKiBSZXR1cm5zIGEgcG9zaXRpdmUgbnVtZXJpYyBtb2RpZmllciB2YWx1ZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0UG9zaXRpdmVOdW1iZXJNb2RpZmllclZhbHVlKFsnc3RpZmZuZXNzJywgJzI0MCddLCAnc3RpZmZuZXNzJyk7XG4gKiAvLyA9PiAyNDBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFBvc2l0aXZlTnVtYmVyTW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIG1vZGlmaWVyTmFtZSkge1xuICAgIGNvbnN0IHBhcnNlZE1vZGlmaWVyVmFsdWUgPSBnZXROdW1iZXJNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKTtcbiAgICBpZiAocGFyc2VkTW9kaWZpZXJWYWx1ZSA9PSBudWxsIHx8IHBhcnNlZE1vZGlmaWVyVmFsdWUgPD0gMClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHBhcnNlZE1vZGlmaWVyVmFsdWU7XG59XG4vKipcbiAqIFJldHVybnMgYW4gYG1zYCBtb2RpZmllciB2YWx1ZSBhcyBhIG51bWJlci5cbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0TWlsbGlzZWNvbmRzTW9kaWZpZXJWYWx1ZShbJ2R1cmF0aW9uJywgJzUwMG1zJ10sICdkdXJhdGlvbicpO1xuICogLy8gPT4gNTAwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNaWxsaXNlY29uZHNNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKSB7XG4gICAgY29uc3QgcmF3TW9kaWZpZXJWYWx1ZSA9IGdldE1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpO1xuICAgIGlmIChyYXdNb2RpZmllclZhbHVlID09IG51bGwpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIGNvbnN0IG1pbGxpc2Vjb25kc01hdGNoID0gcmF3TW9kaWZpZXJWYWx1ZS5tYXRjaCgvXihbMC05XSspbXMkLyk7XG4gICAgaWYgKCFtaWxsaXNlY29uZHNNYXRjaClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIE51bWJlcihtaWxsaXNlY29uZHNNYXRjaFsxXSk7XG59XG4vKipcbiAqIFJldHVybnMgYSBgJWAgbW9kaWZpZXIgdmFsdWUgYXMgYSBudW1iZXIuXG4gKlxuICogQGV4YW1wbGVcbiAqIGdldFBlcmNlbnRhZ2VNb2RpZmllclZhbHVlKFsncHJvZ3Jlc3MnLCAnNTAlJ10sICdwcm9ncmVzcycpO1xuICogLy8gPT4gNTBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFBlcmNlbnRhZ2VNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKSB7XG4gICAgY29uc3QgcmF3TW9kaWZpZXJWYWx1ZSA9IGdldE1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpO1xuICAgIGlmIChyYXdNb2RpZmllclZhbHVlID09IG51bGwpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHBlcmNlbnRhZ2VNYXRjaCA9IHJhd01vZGlmaWVyVmFsdWUubWF0Y2goL14oWzAtOV0rKSUkLyk7XG4gICAgaWYgKCFwZXJjZW50YWdlTWF0Y2gpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIHJldHVybiBOdW1iZXIocGVyY2VudGFnZU1hdGNoWzFdKTtcbn1cbi8qKlxuICogUmV0dXJucyBhIGBweGAgbW9kaWZpZXIgdmFsdWUgYXMgYSBudW1iZXIuXG4gKlxuICogQGV4YW1wbGVcbiAqIGdldFBpeGVsTW9kaWZpZXJWYWx1ZShbJ29mZnNldCcsICctMTJweCddLCAnb2Zmc2V0Jyk7XG4gKiAvLyA9PiAtMTJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFBpeGVsTW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIG1vZGlmaWVyTmFtZSkge1xuICAgIGNvbnN0IHJhd01vZGlmaWVyVmFsdWUgPSBnZXRNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKTtcbiAgICBpZiAocmF3TW9kaWZpZXJWYWx1ZSA9PSBudWxsKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBwaXhlbE1hdGNoID0gcmF3TW9kaWZpZXJWYWx1ZS5tYXRjaCgvXigtP1swLTldKylweCQvKTtcbiAgICBpZiAoIXBpeGVsTWF0Y2gpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIHJldHVybiBOdW1iZXIocGl4ZWxNYXRjaFsxXSk7XG59XG4iLCJpbXBvcnQgeyBnZXRNb2RpZmllclZhbHVlLCBnZXRQb3NpdGl2ZU51bWJlck1vZGlmaWVyVmFsdWUgfSBmcm9tICcuL2Jhc2UnO1xuY29uc3QgREVGQVVMVF9NSU5fU1BSSU5HX01BU1MgPSAwLjAxO1xuLyoqXG4gKiBSZXR1cm5zIGEgc3ByaW5nIG1hc3MgbW9kaWZpZXIgdmFsdWUgdXNpbmcgYSBtaW5pbXVtIG1hc3MgYXMgdGhlIHNjYWxlIHVuaXQuXG4gKlxuICogQGV4YW1wbGVcbiAqIGdldE1hc3NNb2RpZmllclZhbHVlKFsnbWFzcycsICcwJ10sICdtYXNzJyk7XG4gKiAvLyA9PiAwLjAxXG4gKlxuICogQGV4YW1wbGVcbiAqIGdldE1hc3NNb2RpZmllclZhbHVlKFsnbWFzcycsICcyMCddLCAnbWFzcycpO1xuICogLy8gPT4gMC4yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXNzTW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIG1vZGlmaWVyTmFtZSwgbWluaW11bU1hc3MgPSBERUZBVUxUX01JTl9TUFJJTkdfTUFTUykge1xuICAgIGNvbnN0IHJhd01vZGlmaWVyVmFsdWUgPSBnZXRNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKTtcbiAgICBpZiAocmF3TW9kaWZpZXJWYWx1ZSA9PSBudWxsKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBwYXJzZWRNb2RpZmllclZhbHVlID0gTnVtYmVyKHJhd01vZGlmaWVyVmFsdWUpO1xuICAgIGlmIChOdW1iZXIuaXNOYU4ocGFyc2VkTW9kaWZpZXJWYWx1ZSkgfHwgcGFyc2VkTW9kaWZpZXJWYWx1ZSA8IDApXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIGlmIChwYXJzZWRNb2RpZmllclZhbHVlID09PSAwKVxuICAgICAgICByZXR1cm4gbWluaW11bU1hc3M7XG4gICAgcmV0dXJuIHBhcnNlZE1vZGlmaWVyVmFsdWUgKiBtaW5pbXVtTWFzcztcbn1cbi8qKlxuICogQXBwbGllcyBgLm1hc3NgLCBgLnN0aWZmbmVzc2AsIGFuZCBgLmRhbXBpbmdgIGRpcmVjdGl2ZSBtb2RpZmllcnMgdG8gYSBzcHJpbmcgY29uZmlnLlxuICpcbiAqIEBleGFtcGxlXG4gKiBnZXRTcHJpbmdNb2RpZmllckNvbmZpZyhbJ21hc3MnLCAnMjAnLCAnc3RpZmZuZXNzJywgJzE4MCddLCB7bWFzczogMC41LCBzdGlmZm5lc3M6IDIwMCwgZGFtcGluZzogMzB9KTtcbiAqIC8vID0+IHttYXNzOiAwLjIsIHN0aWZmbmVzczogMTgwLCBkYW1waW5nOiAzMH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNwcmluZ01vZGlmaWVyQ29uZmlnKG1vZGlmaWVycywgZGVmYXVsdFNwcmluZ0NvbmZpZywgbWluaW11bU1hc3MgPSBERUZBVUxUX01JTl9TUFJJTkdfTUFTUykge1xuICAgIGNvbnN0IHNwcmluZ0NvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRTcHJpbmdDb25maWcpO1xuICAgIGNvbnN0IHBhcnNlZE1hc3MgPSBnZXRNYXNzTW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsICdtYXNzJywgbWluaW11bU1hc3MpO1xuICAgIGlmIChwYXJzZWRNYXNzICE9PSBudWxsKVxuICAgICAgICBzcHJpbmdDb25maWcubWFzcyA9IHBhcnNlZE1hc3M7XG4gICAgY29uc3QgcGFyc2VkU3RpZmZuZXNzID0gZ2V0UG9zaXRpdmVOdW1iZXJNb2RpZmllclZhbHVlKG1vZGlmaWVycywgJ3N0aWZmbmVzcycpO1xuICAgIGlmIChwYXJzZWRTdGlmZm5lc3MgIT09IG51bGwpXG4gICAgICAgIHNwcmluZ0NvbmZpZy5zdGlmZm5lc3MgPSBwYXJzZWRTdGlmZm5lc3M7XG4gICAgY29uc3QgcGFyc2VkRGFtcGluZyA9IGdldFBvc2l0aXZlTnVtYmVyTW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsICdkYW1waW5nJyk7XG4gICAgaWYgKHBhcnNlZERhbXBpbmcgIT09IG51bGwpXG4gICAgICAgIHNwcmluZ0NvbmZpZy5kYW1waW5nID0gcGFyc2VkRGFtcGluZztcbiAgICByZXR1cm4gc3ByaW5nQ29uZmlnO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzUmVkdWNlZE1vdGlvbigpIHtcbiAgICByZXR1cm4gd2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpJykubWF0Y2hlcztcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0xvd1Bvd2VyRGV2aWNlKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb21wYXQvY29tcGF0IC0tIHVuZGVmaW5lZCBvbiBpT1MgU2FmYXJpIDEzLjQtMTMuNywgd2hlcmUgTmFOIDw9IDIgaXMgZmFsc2UgYW5kIHRoZSBkZXZpY2UgcmVhZHMgYXMgbm9ybWFsLXBvd2VyXG4gICAgcmV0dXJuIE51bWJlcihuYXZpZ2F0b3IuaGFyZHdhcmVDb25jdXJyZW5jeSkgPD0gMiB8fCBOdW1iZXIobmF2aWdhdG9yLmRldmljZU1lbW9yeSkgPD0gMjtcbn1cbiIsIi8qKlxuICogV29ya2Fyb3VuZCBmb3IgYW4gdXBzdHJlYW0gdHlwZS1pZGVudGl0eSBzcGxpdCBpbiBgbW90aW9uQDEyLjQwK2AuXG4gKlxuICogVGhlIGBNb3Rpb25WYWx1ZWAgdHlwZSB0aGF0IGBtb3Rpb25gIGV4cG9ydHMgKGFuZCB0aGF0IGBtb3Rpb25WYWx1ZSgpYCByZXR1cm5zKVxuICogaXMgKm5vdCogdGhlIHNhbWUgYE1vdGlvblZhbHVlYCB0aGF0IG1vdGlvbidzIG93biBmdW5jdGlvbnMgKGBhbmltYXRlYCxcbiAqIGBzcHJpbmdWYWx1ZWAsIGB0cmFuc2Zvcm1WYWx1ZWAsIGBzdHlsZUVmZmVjdGAsIGBzY3JvbGxgKSBhY2NlcHQgYXMgcGFyYW1ldGVycyDigJRcbiAqIHRoZSBleHBvcnRlZCB0eXBlIGlzIG1pc3NpbmcgYGN1cnJlbnRgIC8gYHByZXZgIC8gYHByZXZGcmFtZVZhbHVlYCAvXG4gKiBgZGVwZW5kZW50c2AuIFRoZSB0d28gc2hhcGVzIGFyZSBtdXR1YWxseSB1bi1hc3NpZ25hYmxlIGFuZCBuZWl0aGVyIGlzIG5hbWVhYmxlLFxuICogc28gYSB2YWx1ZSBjcmVhdGVkIHdpdGggYG1vdGlvblZhbHVlKClgIGNhbm5vdCBiZSBwYXNzZWQgdG8gdGhlIGZ1bmN0aW9ucyBtZWFudFxuICogdG8gY29uc3VtZSBpdCB3aXRob3V0IGEgY2FzdC5cbiAqXG4gKiBUaGlzIGNlbnRyYWxpemVzIHRoYXQgdW5hdm9pZGFibGUgY2FzdCBpbnRvIG9uZSBuYW1lZCwgZ3JlcHBhYmxlIHBsYWNlIGluc3RlYWRcbiAqIG9mIHNjYXR0ZXJpbmcgYGFzIGFueWAgYWNyb3NzIGNhbGwgc2l0ZXMuIEl0IGlzIGB1bmtub3duIC0+IGFueWAgKHRoZSBzYW1lXG4gKiBydW50aW1lIHNhZmV0eSBhcyBgYXMgYW55YCk7IGEgdHlwZS1jaGVja2VkIHNpZ25hdHVyZSBpcyBpbXBvc3NpYmxlIGhlcmUgYmVjYXVzZVxuICogdGhlIGlucHV0IHR5cGUgKmlzKiB0aGUgbWlzbWF0Y2guIERlbGV0ZSB0aGlzIGFuZCBpdHMgY2FsbCBzaXRlcyBvbmNlIG1vdGlvblxuICogc2hpcHMgY29uc2lzdGVudCB0eXBlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1vdGlvbkFyZyh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbn1cbiIsImltcG9ydCB7IHNwcmluZ1ZhbHVlLCBzdHlsZUVmZmVjdCwgdHJhbnNmb3JtLCB0cmFuc2Zvcm1WYWx1ZSwgc2Nyb2xsLCBtb3Rpb25WYWx1ZSwgYW5pbWF0ZSwgfSBmcm9tICdtb3Rpb24nO1xuaW1wb3J0IHsgbW90aW9uQXJnIH0gZnJvbSAnLi4vdXRpbHMvbW90aW9uJztcbmltcG9ydCB7IGlzTG93UG93ZXJEZXZpY2UsIGlzUmVkdWNlZE1vdGlvbiB9IGZyb20gJy4uL3V0aWxzL2RldmljZSc7XG5pbXBvcnQgeyBnZXRQZXJjZW50YWdlTW9kaWZpZXJWYWx1ZSwgZ2V0UGl4ZWxNb2RpZmllclZhbHVlLCBnZXRTcHJpbmdNb2RpZmllckNvbmZpZyB9IGZyb20gJy4uL3V0aWxzL21vZGlmaWVycyc7XG5pbXBvcnQgeyBvbkZpcnN0TGF5b3V0IH0gZnJvbSAnLi4vdXRpbHMvbGF5b3V0LW1lYXN1cmUnO1xuaW1wb3J0IHsgd2Fybk1pc3NpbmdQYXJlbnREaXJlY3RpdmUgfSBmcm9tICcuLi91dGlscy9lcnJvcic7XG5jb25zdCBTQ1JPTExfUFJPR1JFU1NfVE9fUkVWRUFMX1BST0dSRVNTX01VTFRJUExJRVIgPSAzMDtcbmNvbnN0IERFRkFVTFRfRURHRV9CVUZGRVJfUFggPSAyO1xuY29uc3QgTUlOX1NQUklOR19NQVNTID0gMC4wMTtcbmNvbnN0IFNQUklOR19ERUZBVUxUX0NPTkZJRyA9IHtcbiAgICBzdGlmZm5lc3M6IDMwMCxcbiAgICBkYW1waW5nOiAzMCxcbiAgICBtYXNzOiAwLjA1LFxufTtcbi8qKlxuICogUGx1Z2luIHRvIGNyZWF0ZSBhbiBhbmltYXRlZCBiZWZvcmUvYWZ0ZXIgc2xpZGVyIHJldmVhbCB3aXRoIG9wdGlvbmFsIHNjcm9sbCBjb250cm9sLlxuICpcbiAqICMjIERpcmVjdGl2ZXNcbiAqXG4gKiAtIGB4LXNsaWRlci1yZXZlYWxgIC0gUm9vdCBlbGVtZW50LiBDcmVhdGVzIHRoZSByZWFjdGl2ZSByZXZlYWwgc3RhdGUuXG4gKiAtIGB4LXNsaWRlci1yZXZlYWw6aGFuZGxlYCAtIEhhbmRsZSBlbGVtZW50IHRyYW5zbGF0ZWQgYnkgdGhlIHJldmVhbCBwcm9ncmVzcy5cbiAqIC0gYHgtc2xpZGVyLXJldmVhbDpyZXZlYWxgIC0gUmV2ZWFsIGVsZW1lbnQgY2xpcHBlZCBieSB0aGUgcmV2ZWFsIHByb2dyZXNzLlxuICpcbiAqICMjIFJvb3QgbW9kaWZpZXJzXG4gKlxuICogLSBgLnZlcnRpY2FsYCAtIFVzZXMgdmVydGljYWwgaW5zdGVhZCBvZiBob3Jpem9udGFsIG1vdmVtZW50LlxuICogLSBgLnByb2dyZXNzLjxuPiVgIC0gU2V0cyB0aGUgcmVzdGluZyByZXZlYWwgcHJvZ3Jlc3MuXG4gKiAtIGAuZnJvbS48bj4lYCAtIFNldHMgdGhlIGFuaW1hdGlvbidzIHN0YXJ0aW5nIHByb2dyZXNzIGJlZm9yZSBpdCBzZXR0bGVzIHRvIGAucHJvZ3Jlc3NgLlxuICogLSBgLm1hc3MuPG4+YCAtIFNwcmluZyBtYXNzIHNjYWxlIGZvciB0aGUgcmV2ZWFsIHNwcmluZy4gYC5tYXNzLjUwYCBlcXVhbHMgYDAuNWAuXG4gKiAtIGAuc3RpZmZuZXNzLjxuPmAgLSBTcHJpbmcgc3RpZmZuZXNzLiBIaWdoZXIgdmFsdWVzIHNldHRsZSBmYXN0ZXIuXG4gKiAtIGAuZGFtcGluZy48bj5gIC0gU3ByaW5nIGRhbXBpbmcuIEhpZ2hlciB2YWx1ZXMgcmVkdWNlIG92ZXJzaG9vdC5cbiAqIC0gYC5lZGdlLWJ1ZmZlci48bj5weGAgLSBLZWVwcyB0aGUgaGFuZGxlIHRoaXMgbWFueSBwaXhlbHMgYXdheSBmcm9tIHRoZSByb290IGVkZ2UuIERlZmF1bHRzIHRvIGAycHhgLlxuICpcbiAqICMjIE1hZ2ljXG4gKlxuICogLSBgJHNsaWRlclJldmVhbC5wcm9ncmVzc2AgLSBUaGUgcmV2ZWFsIHByb2dyZXNzLCAwLTEwMC4gU2V0dGFibGU7IHZhbHVlcyBjbGFtcCB0byB0aGUgaGFuZGxlJ3MgYWxsb3dlZCByYW5nZS5cbiAqIC0gYCRzbGlkZXJSZXZlYWwucHJvZ3Jlc3NWYWx1ZWAgLSBUaGUgdW5kZXJseWluZyBNb3Rpb25WYWx1ZS5cbiAqIC0gYCRzbGlkZXJSZXZlYWwuZW5hYmxlU2Nyb2xsKClgIC8gYCRzbGlkZXJSZXZlYWwuZGlzYWJsZVNjcm9sbCgpYCAtIFN0YXJ0IGFuZCBzdG9wIGRyaXZpbmcgdGhlIHByb2dyZXNzXG4gKiAgIGZyb20gcGFnZSBzY3JvbGwuIGBlbmFibGVTY3JvbGxgIGZpcnN0IGFuaW1hdGVzIGZyb20gYC5mcm9tYCB0byBgLnByb2dyZXNzYCwgYW5kIGRvZXMgbm90aGluZyB3aGVuIHRoZVxuICogICB1c2VyIHByZWZlcnMgcmVkdWNlZCBtb3Rpb24gb3IgdGhlIGRldmljZSByZXBvcnRzIGxvdyBwb3dlci5cbiAqXG4gKiBAZXhhbXBsZVxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXYgeC1zbGlkZXItcmV2ZWFsLnByb2dyZXNzLjY1JS5mcm9tLjEwJS5zdGlmZm5lc3MuMjQwLmRhbXBpbmcuMzUubWFzcy41MC5lZGdlLWJ1ZmZlci40cHg+XG4gKiAgIDxkaXYgeC1zbGlkZXItcmV2ZWFsOnJldmVhbD5BZnRlcjwvZGl2PlxuICogICA8ZGl2IHgtc2xpZGVyLXJldmVhbDpoYW5kbGU+PC9kaXY+XG4gKiA8L2Rpdj5cbiAqIGBgYFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoQWxwaW5lKSB7XG4gICAgQWxwaW5lLmRpcmVjdGl2ZSgnc2xpZGVyLXJldmVhbCcsICgkZWwsIGRhdGEpID0+IHtcbiAgICAgICAgaWYgKGRhdGEudmFsdWUgPT0gJ2hhbmRsZScpIHtcbiAgICAgICAgICAgIGhhbmRsZUhhbmRsZSgkZWwsIEFscGluZSwgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGF0YS52YWx1ZSA9PSAncmV2ZWFsJykge1xuICAgICAgICAgICAgaGFuZGxlUmV2ZWFsKCRlbCwgQWxwaW5lLCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkYXRhLnZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgIGhhbmRsZVJvb3QoJGVsLCBBbHBpbmUsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGRpcmVjdGl2ZTogeC1zbGlkZXItcmV2ZWFsOiR7ZGF0YS52YWx1ZX1gKTtcbiAgICAgICAgfVxuICAgIH0pLmJlZm9yZSgnYmluZCcpO1xuICAgIEFscGluZS5tYWdpYygnc2xpZGVyUmV2ZWFsJywgaGFuZGxlU2xpZGVyUmV2ZWFsTWFnaWMoQWxwaW5lKSk7XG59XG5mdW5jdGlvbiBoYW5kbGVIYW5kbGUoJGVsLCBBbHBpbmUsIF9kYXRhKSB7XG4gICAgQWxwaW5lLmJpbmQoJGVsLCB7XG4gICAgICAgICd4LWluaXQnKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9fc2xpZGVyUmV2ZWFsX2lzUm9vdCkge1xuICAgICAgICAgICAgICAgIHdhcm5NaXNzaW5nUGFyZW50RGlyZWN0aXZlKCd4LXNsaWRlci1yZXZlYWw6aGFuZGxlJywgJ3gtc2xpZGVyLXJldmVhbCcsIHRoaXMuJGVsKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9fc2xpZGVyUmV2ZWFsX2hhbmRsZSA9IHRoaXMuJGVsO1xuICAgICAgICB9LFxuICAgIH0pO1xufVxuZnVuY3Rpb24gaGFuZGxlUmV2ZWFsKCRlbCwgQWxwaW5lLCBfZGF0YSkge1xuICAgIEFscGluZS5iaW5kKCRlbCwge1xuICAgICAgICAneC1pbml0JygpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fX3NsaWRlclJldmVhbF9pc1Jvb3QpIHtcbiAgICAgICAgICAgICAgICB3YXJuTWlzc2luZ1BhcmVudERpcmVjdGl2ZSgneC1zbGlkZXItcmV2ZWFsOnJldmVhbCcsICd4LXNsaWRlci1yZXZlYWwnLCB0aGlzLiRlbCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fX3NsaWRlclJldmVhbF9yZXZlYWwgPSB0aGlzLiRlbDtcbiAgICAgICAgfSxcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGhhbmRsZVJvb3QoJGVsLCBBbHBpbmUsIGRhdGEpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gZGF0YS5tb2RpZmllcnMuaW5jbHVkZXMoJ3ZlcnRpY2FsJykgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xuICAgIGNvbnN0IGVkZ2VCdWZmZXJQeCA9IChfYSA9IGdldFBpeGVsTW9kaWZpZXJWYWx1ZShkYXRhLm1vZGlmaWVycywgJ2VkZ2UtYnVmZmVyJykpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IERFRkFVTFRfRURHRV9CVUZGRVJfUFg7XG4gICAgY29uc3Qgc3RhcnRQcm9ncmVzcyA9IChfYiA9IGdldFBlcmNlbnRhZ2VNb2RpZmllclZhbHVlKGRhdGEubW9kaWZpZXJzLCAncHJvZ3Jlc3MnKSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogMDtcbiAgICBjb25zdCBmcm9tUHJvZ3Jlc3MgPSBnZXRQZXJjZW50YWdlTW9kaWZpZXJWYWx1ZShkYXRhLm1vZGlmaWVycywgJ2Zyb20nKTtcbiAgICBjb25zdCBzcHJpbmdDb25maWcgPSBnZXRTcHJpbmdNb2RpZmllckNvbmZpZyhkYXRhLm1vZGlmaWVycywgU1BSSU5HX0RFRkFVTFRfQ09ORklHLCBNSU5fU1BSSU5HX01BU1MpO1xuICAgIGxldCBpbml0aWFsUHJvZ3Jlc3MgPSBzdGFydFByb2dyZXNzO1xuICAgIGlmIChmcm9tUHJvZ3Jlc3MgIT09IG51bGwpIHtcbiAgICAgICAgaW5pdGlhbFByb2dyZXNzID0gTnVtYmVyKGZyb21Qcm9ncmVzcyk7XG4gICAgfVxuICAgIEFscGluZS5iaW5kKCRlbCwge1xuICAgICAgICAneC1kYXRhJygpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgX19zbGlkZXJSZXZlYWxfaXNSb290OiB0cnVlLFxuICAgICAgICAgICAgICAgIF9fc2xpZGVyUmV2ZWFsX3Jvb3RFbDogJGVsLFxuICAgICAgICAgICAgICAgIF9fc2xpZGVyUmV2ZWFsX3Byb2dyZXNzVmFsdWU6IHJlYWN0aXZlTW90aW9uVmFsdWUoQWxwaW5lLCBpbml0aWFsUHJvZ3Jlc3MpLFxuICAgICAgICAgICAgICAgIF9fc2xpZGVyUmV2ZWFsX3Byb2dyZXNzU3ByaW5nVmFsdWU6IG51bGwsXG4gICAgICAgICAgICAgICAgX19zbGlkZXJSZXZlYWxfc3RhcnRQcm9ncmVzczogc3RhcnRQcm9ncmVzcyxcbiAgICAgICAgICAgICAgICBfX3NsaWRlclJldmVhbF9oYW5kbGU6IG51bGwsXG4gICAgICAgICAgICAgICAgX19zbGlkZXJSZXZlYWxfcmV2ZWFsOiBudWxsLFxuICAgICAgICAgICAgICAgIF9fc2xpZGVyUmV2ZWFsX2NhbmNlbEZpcnN0TGF5b3V0OiBudWxsLFxuICAgICAgICAgICAgICAgIF9fc2xpZGVyUmV2ZWFsX3Njcm9sbEFuaW1hdGlvbkZuOiBudWxsLFxuICAgICAgICAgICAgICAgIF9fc2xpZGVyUmV2ZWFsX3N0YXJ0QW5pbWF0aW9uRm46IG51bGwsXG4gICAgICAgICAgICAgICAgX19zbGlkZXJSZXZlYWxfc3RvcEhhbmRsZVN0eWxlRWZmZWN0OiBudWxsLFxuICAgICAgICAgICAgICAgIF9fc2xpZGVyUmV2ZWFsX3N0b3BSZXZlYWxTdHlsZUVmZmVjdDogbnVsbCxcbiAgICAgICAgICAgICAgICBpbml0KCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBvbkZpcnN0TGF5b3V0IGZpcmVzIHBvc3QtbGF5b3V0LCBwcmUtcGFpbnQ6IHRoZSBtZWFzdXJlbWVudHMgYmVsb3cgYXJlIGZyZWVcbiAgICAgICAgICAgICAgICAgICAgLy8gYW5kIHRoZSBzdHlsZUVmZmVjdHMgc3RpbGwgYXBwbHkgaW4gdGhlIHNhbWUgZnJhbWUncyBwYWludC5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3NsaWRlclJldmVhbF9jYW5jZWxGaXJzdExheW91dCA9IG9uRmlyc3RMYXlvdXQodGhpcy4kZWwsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19zbGlkZXJSZXZlYWxfY2FuY2VsRmlyc3RMYXlvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm9ybWFsaXplIHRoZSBjb25maWd1cmVkIHN0YXJ0IHZhbHVlcyBvbmNlIGxheW91dCBleGlzdHMgc28gaGFuZGxlIG92ZXJmbG93IGNsYW1wc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FuIGJlIGFwcGxpZWQgYmVmb3JlIGVpdGhlciB0aGUgc3ByaW5nIG9yIHJldmVhbCBlZmZlY3Qgc3RhcnRzIHJlbmRlcmluZy5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVmZmVjdGl2ZUluaXRpYWxQcm9ncmVzcyA9IHRoaXMuX19zbGlkZXJSZXZlYWxfZ2V0RWZmZWN0aXZlUHJvZ3Jlc3MoaW5pdGlhbFByb2dyZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19zbGlkZXJSZXZlYWxfc3RhcnRQcm9ncmVzcyA9IHRoaXMuX19zbGlkZXJSZXZlYWxfZ2V0RWZmZWN0aXZlUHJvZ3Jlc3Moc3RhcnRQcm9ncmVzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fc2xpZGVyUmV2ZWFsX3Byb2dyZXNzVmFsdWUuc2V0KGVmZmVjdGl2ZUluaXRpYWxQcm9ncmVzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fc2xpZGVyUmV2ZWFsX3Byb2dyZXNzU3ByaW5nVmFsdWUgPSBzcHJpbmdWYWx1ZShtb3Rpb25BcmcodGhpcy5fX3NsaWRlclJldmVhbF9wcm9ncmVzc1ZhbHVlKSwgc3ByaW5nQ29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fc2xpZGVyUmV2ZWFsX2hhbmRsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19zbGlkZXJSZXZlYWxfc3RvcEhhbmRsZVN0eWxlRWZmZWN0ID0gc3R5bGVFZmZlY3QodGhpcy5fX3NsaWRlclJldmVhbF9oYW5kbGUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2Zvcm1WYWx1ZSgoKSA9PiBnZXRIYW5kbGVUcmFuc2Zvcm0odGhpcy5fX3NsaWRlclJldmVhbF9wcm9ncmVzc1NwcmluZ1ZhbHVlLmdldCgpLCBvcmllbnRhdGlvbiwgdGhpcy4kZWwsIHRoaXMuX19zbGlkZXJSZXZlYWxfaGFuZGxlLCBlZGdlQnVmZmVyUHgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fc2xpZGVyUmV2ZWFsX3JldmVhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19zbGlkZXJSZXZlYWxfc3RvcFJldmVhbFN0eWxlRWZmZWN0ID0gc3R5bGVFZmZlY3QodGhpcy5fX3NsaWRlclJldmVhbF9yZXZlYWwsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVXNlIHRoZSBzYW1lIGNsYW1wZWQgcHJvZ3Jlc3MgYXMgdGhlIGhhbmRsZSBzbyBzcHJpbmcgb3ZlcnNob290IG5ldmVyIGxldHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHJldmVhbCBkcmlmdCBwYXN0IHRoZSBzdG9wcGVkIGhhbmRsZSBwb3NpdGlvbiBhdCB0aGUgcm9vdCBlZGdlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlwUGF0aDogdHJhbnNmb3JtVmFsdWUoKCkgPT4gZ2V0UmV2ZWFsQ2xpcFBhdGgodGhpcy5fX3NsaWRlclJldmVhbF9nZXRFZmZlY3RpdmVQcm9ncmVzcyh0aGlzLl9fc2xpZGVyUmV2ZWFsX3Byb2dyZXNzU3ByaW5nVmFsdWUuZ2V0KCkpLCBvcmllbnRhdGlvbikpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlc3Ryb3koKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZCwgX2UsIF9mO1xuICAgICAgICAgICAgICAgICAgICAoX2EgPSB0aGlzLl9fc2xpZGVyUmV2ZWFsX2NhbmNlbEZpcnN0TGF5b3V0KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3NsaWRlclJldmVhbF9jYW5jZWxGaXJzdExheW91dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19zbGlkZXJSZXZlYWxfZGlzYWJsZVNjcm9sbCgpO1xuICAgICAgICAgICAgICAgICAgICAoX2IgPSB0aGlzLl9fc2xpZGVyUmV2ZWFsX3N0b3BIYW5kbGVTdHlsZUVmZmVjdCkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIChfYyA9IHRoaXMuX19zbGlkZXJSZXZlYWxfc3RvcFJldmVhbFN0eWxlRWZmZWN0KSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgKF9lID0gKF9kID0gdGhpcy5fX3NsaWRlclJldmVhbF9wcm9ncmVzc1NwcmluZ1ZhbHVlKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Quc3RvcCkgPT09IG51bGwgfHwgX2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9lLmNhbGwoX2QpO1xuICAgICAgICAgICAgICAgICAgICAoX2YgPSB0aGlzLl9fc2xpZGVyUmV2ZWFsX3N0YXJ0QW5pbWF0aW9uRm4pID09PSBudWxsIHx8IF9mID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZi5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19zbGlkZXJSZXZlYWxfc3RhcnRBbmltYXRpb25GbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBfX3NsaWRlclJldmVhbF9nZXRFZmZlY3RpdmVQcm9ncmVzcyhwcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0RWZmZWN0aXZlUHJvZ3Jlc3MocHJvZ3Jlc3MsIG9yaWVudGF0aW9uLCB0aGlzLl9fc2xpZGVyUmV2ZWFsX3Jvb3RFbCwgdGhpcy5fX3NsaWRlclJldmVhbF9oYW5kbGUsIGVkZ2VCdWZmZXJQeCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhc3luYyBfX3NsaWRlclJldmVhbF9lbmFibGVTY3JvbGwoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fc2xpZGVyUmV2ZWFsX3Njcm9sbEFuaW1hdGlvbkZuKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNMb3dQb3dlckRldmljZSgpIHx8IGlzUmVkdWNlZE1vdGlvbigpKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fX3NsaWRlclJldmVhbF9zdGFydEFuaW1hdGlvbkZuID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX19zbGlkZXJSZXZlYWxfYW5pbWF0ZVRvU3RhcnRQcm9ncmVzcygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX19zbGlkZXJSZXZlYWxfc3RhcnRBbmltYXRpb25Gbi5zdGF0ZSA9PSAncnVubmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgbGFzdFNjcm9sbFByb2dyZXNzID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3NsaWRlclJldmVhbF9zY3JvbGxBbmltYXRpb25GbiA9IHNjcm9sbCgoc2Nyb2xsUHJvZ3Jlc3MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsYXN0U2Nyb2xsUHJvZ3Jlc3MgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RTY3JvbGxQcm9ncmVzcyA9IHNjcm9sbFByb2dyZXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHByb2dyZXNzRGVsdGEgPSBzY3JvbGxQcm9ncmVzcyAtIGxhc3RTY3JvbGxQcm9ncmVzcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RTY3JvbGxQcm9ncmVzcyA9IHNjcm9sbFByb2dyZXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3NsaWRlclJldmVhbF9wcm9ncmVzc1ZhbHVlLnNldChcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENsYW1wIHRoZSBtb2RlbCB2YWx1ZSBpdHNlbGYgc28gdGhlIGJvdW5kIHJhbmdlIGlucHV0LCBoYW5kbGUsIGFuZCByZXZlYWxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsbCBhZ3JlZSBvbmNlIHRoZSBoYW5kbGUgcmVhY2hlcyBpdHMgdmlzaWJsZSBlZGdlLlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3NsaWRlclJldmVhbF9nZXRFZmZlY3RpdmVQcm9ncmVzcyh0aGlzLl9fc2xpZGVyUmV2ZWFsX3Byb2dyZXNzVmFsdWUuZ2V0KCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzRGVsdGEgKiBTQ1JPTExfUFJPR1JFU1NfVE9fUkVWRUFMX1BST0dSRVNTX01VTFRJUExJRVIpKTtcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiAkZWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IFsnZW5kIHN0YXJ0JywgJ3N0YXJ0IGVuZCddLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF9fc2xpZGVyUmV2ZWFsX2Rpc2FibGVTY3JvbGwoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICAgICAgKF9hID0gdGhpcy5fX3NsaWRlclJldmVhbF9zY3JvbGxBbmltYXRpb25GbikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19zbGlkZXJSZXZlYWxfc2Nyb2xsQW5pbWF0aW9uRm4gPSBudWxsO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYXN5bmMgX19zbGlkZXJSZXZlYWxfYW5pbWF0ZVRvU3RhcnRQcm9ncmVzcygpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX19zbGlkZXJSZXZlYWxfc3RhcnRBbmltYXRpb25GbilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZWZmZWN0aXZlRnJvbVByb2dyZXNzID0gZnJvbVByb2dyZXNzID09IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5fX3NsaWRlclJldmVhbF9wcm9ncmVzc1ZhbHVlLmdldCgpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHRoaXMuX19zbGlkZXJSZXZlYWxfZ2V0RWZmZWN0aXZlUHJvZ3Jlc3MoZnJvbVByb2dyZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3NsaWRlclJldmVhbF9zdGFydEFuaW1hdGlvbkZuID0gYW5pbWF0ZShtb3Rpb25BcmcodGhpcy5fX3NsaWRlclJldmVhbF9wcm9ncmVzc1ZhbHVlKSwgW2VmZmVjdGl2ZUZyb21Qcm9ncmVzcywgdGhpcy5fX3NsaWRlclJldmVhbF9zdGFydFByb2dyZXNzXSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDAuMyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhc2U6ICdlYXNlSW5PdXQnLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19zbGlkZXJSZXZlYWxfc3RhcnRBbmltYXRpb25Gbi5maW5pc2hlZDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGNsYW1wUHJvZ3Jlc3MocHJvZ3Jlc3MpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgTWF0aC5taW4oMTAwLCBwcm9ncmVzcykpO1xufVxuZnVuY3Rpb24gZ2V0RWZmZWN0aXZlUHJvZ3Jlc3MocHJvZ3Jlc3MsIG9yaWVudGF0aW9uLCByb290RWwsIGhhbmRsZUVsLCBlZGdlQnVmZmVyUHgpIHtcbiAgICBjb25zdCBib3VuZGVkUHJvZ3Jlc3MgPSBjbGFtcFByb2dyZXNzKHByb2dyZXNzKTtcbiAgICBpZiAocm9vdEVsID09IG51bGwgfHwgaGFuZGxlRWwgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuIGJvdW5kZWRQcm9ncmVzcztcbiAgICAvLyBDbGFtcCBpbiBoYW5kbGUtc3BhY2UgZmlyc3QsIHRoZW4gY29udmVydCBiYWNrIHRvIHByb2dyZXNzIHNvIGV2ZXJ5IGNvbnN1bWVyXG4gICAgLy8gY2FuIHNoYXJlIG9uZSBcImVmZmVjdGl2ZVwiIHByb2dyZXNzIHZhbHVlLlxuICAgIGNvbnN0IHRyYW5zbGF0ZUFtb3VudCA9IGdldENsYW1wZWRIYW5kbGVUcmFuc2xhdGVBbW91bnQoYm91bmRlZFByb2dyZXNzLCBvcmllbnRhdGlvbiwgcm9vdEVsLCBoYW5kbGVFbCwgZWRnZUJ1ZmZlclB4KTtcbiAgICByZXR1cm4gZ2V0UHJvZ3Jlc3NGcm9tSGFuZGxlVHJhbnNsYXRlQW1vdW50KHRyYW5zbGF0ZUFtb3VudCwgb3JpZW50YXRpb24sIHJvb3RFbCk7XG59XG5mdW5jdGlvbiBnZXRQcm9ncmVzc0Zyb21IYW5kbGVUcmFuc2xhdGVBbW91bnQodHJhbnNsYXRlQW1vdW50LCBvcmllbnRhdGlvbiwgcm9vdEVsKSB7XG4gICAgY29uc3Qgcm9vdFJlY3QgPSByb290RWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3Qgcm9vdFNpemUgPSBvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJyA/IHJvb3RSZWN0LmhlaWdodCA6IHJvb3RSZWN0LndpZHRoO1xuICAgIGNvbnN0IGRpcmVjdGlvbk11bHRpcGxpZXIgPSBkb2N1bWVudC5kaXIgPT09ICdydGwnID8gLTEgOiAxO1xuICAgIGlmIChyb290U2l6ZSA9PT0gMClcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgcmV0dXJuIGNsYW1wUHJvZ3Jlc3MoKHRyYW5zbGF0ZUFtb3VudCAvIChkaXJlY3Rpb25NdWx0aXBsaWVyICogcm9vdFNpemUpKSAqIDEwMCk7XG59XG5mdW5jdGlvbiBnZXRIYW5kbGVUcmFuc2Zvcm0ocHJvZ3Jlc3MsIG9yaWVudGF0aW9uLCByb290RWwsIGhhbmRsZUVsLCBlZGdlQnVmZmVyUHgpIHtcbiAgICBjb25zdCB0cmFuc2xhdGVBbW91bnQgPSBnZXRDbGFtcGVkSGFuZGxlVHJhbnNsYXRlQW1vdW50KHByb2dyZXNzLCBvcmllbnRhdGlvbiwgcm9vdEVsLCBoYW5kbGVFbCwgZWRnZUJ1ZmZlclB4KTtcbiAgICBpZiAob3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgcmV0dXJuIGB0cmFuc2xhdGVZKCR7dHJhbnNsYXRlQW1vdW50fXB4KWA7XG4gICAgfVxuICAgIHJldHVybiBgdHJhbnNsYXRlWCgke3RyYW5zbGF0ZUFtb3VudH1weClgO1xufVxuZnVuY3Rpb24gZ2V0Q2xhbXBlZEhhbmRsZVRyYW5zbGF0ZUFtb3VudChwcm9ncmVzcywgb3JpZW50YXRpb24sIHJvb3RFbCwgaGFuZGxlRWwsIGVkZ2VCdWZmZXJQeCkge1xuICAgIGNvbnN0IHJvb3RSZWN0ID0gcm9vdEVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHJvb3RTaXplID0gb3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgPyByb290UmVjdC5oZWlnaHQgOiByb290UmVjdC53aWR0aDtcbiAgICBjb25zdCBkaXJlY3Rpb25NdWx0aXBsaWVyID0gZG9jdW1lbnQuZGlyID09PSAncnRsJyA/IC0xIDogMTtcbiAgICAvLyBDbGFtcCBpbiBMVFItZXF1aXZhbGVudCBzcGFjZSAoMOKApnJvb3RTaXplKS4gUlRMIGFwcGxpZXMgYSBzaWduIGFmdGVyIGNsYW1waW5nOyBvdGhlcndpc2VcbiAgICAvLyBuZWdhdGl2ZSBkZXNpcmVkIHZhbHVlcyBhbHdheXMgaGl0IE1hdGgubWF4KG1pbiwg4oCmKSB3aGVuIG1pbi9tYXggYXJlIHBvc2l0aXZlIGVkZ2UgYm91bmRzLlxuICAgIGNvbnN0IHByb2dyZXNzQmFzZWRUcmFuc2xhdGUgPSAocHJvZ3Jlc3MgLyAxMDApICogcm9vdFNpemU7XG4gICAgY29uc3QgaGFuZGxlQ29udGVudEJvdW5kcyA9IGdldEhhbmRsZUNvbnRlbnRCb3VuZHMoaGFuZGxlRWwsIG9yaWVudGF0aW9uKTtcbiAgICBpZiAoaGFuZGxlQ29udGVudEJvdW5kcyA9PSBudWxsKVxuICAgICAgICByZXR1cm4gZGlyZWN0aW9uTXVsdGlwbGllciAqIHByb2dyZXNzQmFzZWRUcmFuc2xhdGU7XG4gICAgY29uc3QgaGFuZGxlUmVjdCA9IGhhbmRsZUVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGhhbmRsZVN0YXJ0ID0gb3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgPyBoYW5kbGVSZWN0LnRvcCA6IGhhbmRsZVJlY3QubGVmdDtcbiAgICBjb25zdCBjb250ZW50U3RhcnRPZmZzZXQgPSBoYW5kbGVDb250ZW50Qm91bmRzLnN0YXJ0IC0gaGFuZGxlU3RhcnQ7XG4gICAgY29uc3QgY29udGVudEVuZE9mZnNldCA9IGhhbmRsZUNvbnRlbnRCb3VuZHMuZW5kIC0gaGFuZGxlU3RhcnQ7XG4gICAgY29uc3QgbWluVHJhbnNsYXRlQW1vdW50ID0gZWRnZUJ1ZmZlclB4IC0gY29udGVudFN0YXJ0T2Zmc2V0O1xuICAgIGNvbnN0IG1heFRyYW5zbGF0ZUFtb3VudCA9IHJvb3RTaXplIC0gZWRnZUJ1ZmZlclB4IC0gY29udGVudEVuZE9mZnNldDtcbiAgICBjb25zdCBjbGFtcGVkUHJvZ3Jlc3NCYXNlZFRyYW5zbGF0ZSA9IE1hdGgubWF4KG1pblRyYW5zbGF0ZUFtb3VudCwgTWF0aC5taW4obWF4VHJhbnNsYXRlQW1vdW50LCBwcm9ncmVzc0Jhc2VkVHJhbnNsYXRlKSk7XG4gICAgcmV0dXJuIGRpcmVjdGlvbk11bHRpcGxpZXIgKiBjbGFtcGVkUHJvZ3Jlc3NCYXNlZFRyYW5zbGF0ZTtcbn1cbmZ1bmN0aW9uIGdldEhhbmRsZUNvbnRlbnRCb3VuZHMoaGFuZGxlRWwsIG9yaWVudGF0aW9uKSB7XG4gICAgY29uc3QgZGVzY2VuZGFudEVscyA9IEFycmF5LmZyb20oaGFuZGxlRWwucXVlcnlTZWxlY3RvckFsbCgnKicpKTtcbiAgICBpZiAoZGVzY2VuZGFudEVscy5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIGxldCBzdGFydCA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbiAgICBsZXQgZW5kID0gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZO1xuICAgIGZvciAoY29uc3QgZGVzY2VuZGFudEVsIG9mIGRlc2NlbmRhbnRFbHMpIHtcbiAgICAgICAgY29uc3QgZGVzY2VuZGFudFJlY3QgPSBkZXNjZW5kYW50RWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgc3RhcnQgPSBNYXRoLm1pbihzdGFydCwgZGVzY2VuZGFudFJlY3QudG9wKTtcbiAgICAgICAgICAgIGVuZCA9IE1hdGgubWF4KGVuZCwgZGVzY2VuZGFudFJlY3QuYm90dG9tKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gTWF0aC5taW4oc3RhcnQsIGRlc2NlbmRhbnRSZWN0LmxlZnQpO1xuICAgICAgICAgICAgZW5kID0gTWF0aC5tYXgoZW5kLCBkZXNjZW5kYW50UmVjdC5yaWdodCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgc3RhcnQsIGVuZCB9O1xufVxuZnVuY3Rpb24gZ2V0UmV2ZWFsQ2xpcFBhdGgocHJvZ3Jlc3MsIG9yaWVudGF0aW9uKSB7XG4gICAgY29uc3QgcHJvZ3Jlc3NUb1BlcmNlbnQgPSB0cmFuc2Zvcm0oWzAsIDEwMF0sIFsnMCUnLCAnMTAwJSddKTtcbiAgICBjb25zdCBwZXJjZW50UHJvZ3Jlc3MgPSBwcm9ncmVzc1RvUGVyY2VudChwcm9ncmVzcyk7XG4gICAgaWYgKG9yaWVudGF0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5kaXIgPT09ICdydGwnID8gYGluc2V0KDAlIDAlICR7cGVyY2VudFByb2dyZXNzfSAwJSlgIDogYGluc2V0KCR7cGVyY2VudFByb2dyZXNzfSAwJSAwJSAwJSlgO1xuICAgIH1cbiAgICByZXR1cm4gZG9jdW1lbnQuZGlyID09PSAncnRsJyA/IGBpbnNldCgwJSAke3BlcmNlbnRQcm9ncmVzc30gMCUgMCUpYCA6IGBpbnNldCgwJSAwJSAwJSAke3BlcmNlbnRQcm9ncmVzc30pYDtcbn1cbmZ1bmN0aW9uIGhhbmRsZVNsaWRlclJldmVhbE1hZ2ljKEFscGluZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoJGVsKSB7XG4gICAgICAgIGNvbnN0ICRkYXRhID0gQWxwaW5lLiRkYXRhKCRlbCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXQgcHJvZ3Jlc3NWYWx1ZSgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGRhdGEuX19zbGlkZXJSZXZlYWxfcHJvZ3Jlc3NWYWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXQgcHJvZ3Jlc3MoKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgICAgICByZXR1cm4gKF9iID0gKF9hID0gJGRhdGEuX19zbGlkZXJSZXZlYWxfcHJvZ3Jlc3NWYWx1ZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldCkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoX2EpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCBwcm9ncmVzcyh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICAgICAgKF9iID0gKF9hID0gJGRhdGEuX19zbGlkZXJSZXZlYWxfcHJvZ3Jlc3NWYWx1ZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnNldCkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoX2EsICRkYXRhLl9fc2xpZGVyUmV2ZWFsX2dldEVmZmVjdGl2ZVByb2dyZXNzKHZhbHVlKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW5hYmxlU2Nyb2xsKCkge1xuICAgICAgICAgICAgICAgICRkYXRhLl9fc2xpZGVyUmV2ZWFsX2VuYWJsZVNjcm9sbCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRpc2FibGVTY3JvbGwoKSB7XG4gICAgICAgICAgICAgICAgJGRhdGEuX19zbGlkZXJSZXZlYWxfZGlzYWJsZVNjcm9sbCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9O1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgcmVhY3RpdmUgbW90aW9uIHZhbHVlIHRoYXQgdXBkYXRlcyBBbHBpbmUgc3RhdGUgd2hlbiB0aGUgbW90aW9uIHZhbHVlIGNoYW5nZXMuXG4gKiBVc2VkIGJ5IHNsaWRlci1yZXZlYWwgZm9yIGJlZm9yZS1hZnRlciBwcm9ncmVzcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlYWN0aXZlTW90aW9uVmFsdWUoX0FscGluZSwgaW5pdGlhbE1vdGlvblZhbHVlKSB7XG4gICAgY29uc3QgdmFsdWUgPSBtb3Rpb25WYWx1ZShpbml0aWFsTW90aW9uVmFsdWUpO1xuICAgIGNvbnN0IHJlYWN0aXZlVmFsdWUgPSBfQWxwaW5lLnJlYWN0aXZlKHsgdmFsdWU6IHZhbHVlLmdldCgpIH0pO1xuICAgIHZhbHVlLm9uKCdjaGFuZ2UnLCAobmV3VmFsdWUpID0+IHtcbiAgICAgICAgcmVhY3RpdmVWYWx1ZS52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIH0pO1xuICAgIHJldHVybiBuZXcgUHJveHkodmFsdWUsIHtcbiAgICAgICAgZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wID09PSAnZ2V0Jykge1xuICAgICAgICAgICAgICAgIHJlYWN0aXZlVmFsdWUudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XG4gICAgICAgIH0sXG4gICAgfSk7XG59XG4iLCJpbXBvcnQge0FscGluZUNvbXBvbmVudCwgQWxwaW5lIGFzIEFscGluZVR5cGUsIERpcmVjdGl2ZURhdGF9IGZyb20gJ2FscGluZWpzJztcblxuLyoqXG4gKiBBbmFsb2cgd3JhcHBlciBhcm91bmQgYHgtc2xpZGVyLXJldmVhbGAgZm9yIHRoZSBiZWZvcmUvYWZ0ZXIgc25pcHBldC5cbiAqXG4gKiBgeC1iZWZvcmUtYWZ0ZXItc2xpZGVyLXJldmVhbGAgZm9yd2FyZHMgaXRzIG1vZGlmaWVycyB0byBgeC1zbGlkZXItcmV2ZWFsYCB1bmNoYW5nZWRcbiAqIGFuZCB0aWVzIHNjcm9sbCBjb250cm9sIHRvIHNlY3Rpb24gdmlzaWJpbGl0eSBmcm9tIGAkc3RvcmUuc2VjdGlvbnNgOiBpdCBjYWxsc1xuICogYCRzbGlkZXJSZXZlYWwuZW5hYmxlU2Nyb2xsKClgIHdoaWxlIHRoZSBzZWN0aW9uIGludGVyc2VjdHMgdGhlIHZpZXdwb3J0IGFuZFxuICogYCRzbGlkZXJSZXZlYWwuZGlzYWJsZVNjcm9sbCgpYCB3aGVuIGl0IHNjcm9sbHMgb3V0LCBzbyBvZmZzY3JlZW4gc2xpZGVycyBkbyBub1xuICogc2Nyb2xsIHdvcmsuXG4gKlxuICogQGV4YW1wbGVcbiAqIDxiZWZvcmUtYWZ0ZXIgeC1iZWZvcmUtYWZ0ZXItc2xpZGVyLXJldmVhbC52ZXJ0aWNhbC5mcm9tLjAlLnByb2dyZXNzLjUwJT7igKY8L2JlZm9yZS1hZnRlcj5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYmVmb3JlQWZ0ZXJTbGlkZXJSZXZlYWwoQWxwaW5lOiBBbHBpbmVUeXBlKSB7XG4gIEFscGluZS5kaXJlY3RpdmUoJ2JlZm9yZS1hZnRlci1zbGlkZXItcmV2ZWFsJywgKCRlbDogSFRNTEVsZW1lbnQsIGRhdGE6IERpcmVjdGl2ZURhdGEpID0+IHtcbiAgICBBbHBpbmUuYmluZCgkZWwsIHtcbiAgICAgIFtgeC1zbGlkZXItcmV2ZWFsJHtkYXRhLm1vZGlmaWVycy5sZW5ndGggPyBgLiR7ZGF0YS5tb2RpZmllcnMuam9pbignLicpfWAgOiAnJ31gXTogJycsXG4gICAgICBbJ3gtZGF0YSddKCk6IEFscGluZUNvbXBvbmVudDx7XG4gICAgICAgIGlzSW50ZXJzZWN0aW5nOiBib29sZWFuO1xuICAgICAgfT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGdldCBpc0ludGVyc2VjdGluZygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRzdG9yZS5zZWN0aW9ucy5pc0ludGVyc2VjdGluZyh0aGlzLiRzZWN0aW9uSWQhKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGluaXQodGhpczogYW55KSB7XG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLmlzSW50ZXJzZWN0aW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kc2xpZGVyUmV2ZWFsLmVuYWJsZVNjcm9sbCgpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdGhpcy4kd2F0Y2goJ2lzSW50ZXJzZWN0aW5nJywgKGlzVmlzaWJsZTogYm9vbGVhbikgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLiRzdG9yZS5zZWN0aW9ucy5oYXNJbnRlcnNlY3RlZCh0aGlzLiRzZWN0aW9uSWQpKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoaXNWaXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHNsaWRlclJldmVhbC5lbmFibGVTY3JvbGwoKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHNsaWRlclJldmVhbC5kaXNhYmxlU2Nyb2xsKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgIH0pO1xuICB9KS5iZWZvcmUoJ2JpbmQnKTtcbn1cbiIsImltcG9ydCBBbHBpbmUgZnJvbSAnYWxwaW5lanMnO1xuaW1wb3J0IHtzbGlkZXJSZXZlYWx9IGZyb20gJ0Bncm91cHRob3VnaHQvYXNzZW1ibHktdWkvYWxwaW5lJztcbmltcG9ydCBiZWZvcmVBZnRlclNsaWRlclJldmVhbCBmcm9tICcuL3BsdWdpbnMvYmVmb3JlLWFmdGVyLXNsaWRlci1yZXZlYWwnO1xuXG5BbHBpbmUucGx1Z2luKFtzbGlkZXJSZXZlYWwsIGJlZm9yZUFmdGVyU2xpZGVyUmV2ZWFsXSk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEZBLFNBQWdCLGNBQWMsSUFBSSxJQUFJO0NBQ2xDLE1BQU0sV0FBVyxJQUFJLGdCQUFnQixZQUFZO0VBQzdDLFNBQVMsV0FBVztFQUNwQixHQUFHLFFBQVEsRUFBRTtDQUNqQixDQUFDO0NBQ0QsU0FBUyxRQUFRLEVBQUU7Q0FDbkIsYUFBYSxTQUFTLFdBQVc7QUFDckM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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