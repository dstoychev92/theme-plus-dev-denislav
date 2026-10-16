
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
import { springValue, styleEffect } from "motion";

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
//#region ../../packages/assembly-ui/dist/utils/dom.js
/**
* True when the device's main pointer cannot hover — a finger on a phone or tablet.
*
* Use it to skip setting up work that only means something with a mouse or trackpad,
* such as an effect that follows the cursor. Check it once, as early as possible, so
* a touch device pays nothing for the feature.
*
* This is the same test as the themes' `touch:` style variant and their
* `$media.matches.touch` breakpoint, so the JavaScript and the CSS agree on what
* counts as a touch device. `(pointer: coarse)` is checked alongside `(hover: none)`
* because Chrome on Ubuntu reports `(hover: none)` even when a mouse is plugged in.
*
* @example
* ```ts
* Alpine.directive('cursor-position', ($el) => {
*   if (isTouchOnlyDevice()) return;
*   // ...set up the cursor-following effect
* }).before('bind');
* ```
*/
function isTouchOnlyDevice() {
	return window.matchMedia("(pointer: coarse) and (hover: none)").matches;
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
//#region ../../packages/assembly-ui/dist/alpine/custom-cursor.js
const MIN_MASS = .01;
const SPRING_DEFAULT_CONFIG = {
	stiffness: 120,
	mass: MIN_MASS
};
/**
* Plugin to create a custom cursor that follows the mouse with spring physics,
* snaps to snap points, and supports named cursor variants.
*
* Inspired by https://medium.com/14islands/developing-a-performant-custom-cursor-89f1688a02eb
*
* ## Touch devices
*
* On a device whose main pointer cannot hover (a phone or tablet) every directive below
* does nothing at all — no state, no spring animations, no mouse listeners. `$customCursor`
* still reads safely there, returning `undefined` for each value, so markup that binds to
* it keeps working. Hide the cursor elements themselves with CSS for those devices.
*
* ## Directives
*
* - `x-custom-cursor` — Root element. Tracks mouse enter/leave/move.
* - `x-custom-cursor:element` — Cursor element, positioned via spring-animated translateX/Y.
*   Accepts an optional name (e.g. `x-custom-cursor:element="plus"`) for named cursors.
*   Unnamed elements act as the default cursor.
* - `x-custom-cursor:snap-point` — Snaps the cursor to this element's center on hover.
*
* ## Spring modifiers (on `x-custom-cursor:element`)
*
* - `.mass.<n>` — Spring mass (default: {@link SPRING_DEFAULT_CONFIG}). Higher = heavier/slower.
* - `.stiffness.<n>` — Spring stiffness. Higher = snappier.
* - `.damping.<n>` — Spring damping. Higher = less oscillation.
*
* ## Data attributes (on descendant elements inside the root)
*
* - `data-custom-cursor="<name>"` — Shows the named cursor when hovering this element.
* - `data-hide-custom-cursor` — Hides all cursors when hovering this element.
*
* ## Reactive data attributes (set automatically on cursor/snap-point elements)
*
* - `data-active` — Present on a cursor element when it is the currently active cursor.
* - `data-hidden` — Present when the cursor is over a `data-hide-custom-cursor` zone
*   or when the cursor element would overflow the root bounds.
* - `data-snapped` — Present when the cursor is snapped to a snap point.
*
* ## Magic: `$customCursor`
*
* - `$customCursor.isActive` — Whether the cursor is inside the root.
* - `$customCursor.isSnapped` — Whether the cursor is snapped to a snap point.
* - `$customCursor.isHidden` — Whether the cursor is in a hide zone.
* - `$customCursor.targetPosition` — Current target `{x, y}` in viewport coordinates.
* - `$customCursor.snap(el)` — Programmatically snap to an element.
* - `$customCursor.unsnap()` — Programmatically unsnap.
*
* @example
*
* ```html
* <div x-custom-cursor>
*   <div x-custom-cursor:element class="fixed top-0 left-0 w-5 h-5 bg-red-500"></div>
*   <div x-custom-cursor:element.mass.20="plus" class="fixed top-0 left-0 w-8 h-8 bg-blue-500"></div>
*   <div x-custom-cursor:snap-point class="absolute top-1/2 left-1/2 w-12 h-12"></div>
*   <div data-custom-cursor="plus">Hover for plus cursor</div>
*   <div data-hide-custom-cursor>Hover to hide cursor</div>
* </div>
* ```
*/
function custom_cursor_default(Alpine) {
	Alpine.directive("custom-cursor", ($el, data) => {
		if (isTouchOnlyDevice()) return;
		if (data.value === "element") handleElement($el, Alpine, data);
		else if (data.value === "snap-point") handleSnapPoint($el, Alpine);
		else if (data.value === null) handleRoot($el, Alpine, data);
		else throw new Error(`Unknown directive: x-custom-cursor:${data.value}`);
	}).before("bind");
	Alpine.magic("customCursor", ($el) => {
		const $data = Alpine.$data($el);
		return {
			get isSnapped() {
				return $data.__customCursor_isSnapped;
			},
			get isHidden() {
				return $data.__customCursor_isHidden;
			},
			get isActive() {
				return $data.__customCursor_isActive;
			},
			get targetPosition() {
				return $data.__customCursor_targetPosition;
			},
			snap(el) {
				$data.__customCursor_setCurrentSnapPoint(el);
			},
			unsnap() {
				$data.__customCursor_unsetCurrentSnapPoint();
			}
		};
	});
}
function handleElement($el, Alpine, data) {
	const cursorName = data.expression || null;
	const springConfig = getSpringModifierConfig(data.modifiers, SPRING_DEFAULT_CONFIG, MIN_MASS);
	Alpine.bind($el, {
		"aria-hidden": "true",
		"x-data"() {
			return {
				__customCursor_cursorEl_xValue: null,
				__customCursor_cursorEl_yValue: null,
				__customCursor_cursorEl_stopStyleEffect: null,
				__customCursor_cursorEl_dimensions: null,
				__customCursor_cursorEl_cancelFirstLayout: null,
				init() {
					if (!this.$data.__customCursor_rootEl) {
						warnMissingParentDirective("x-custom-cursor:element", "x-custom-cursor", this.$el);
						return;
					}
					this.__customCursor_cursorEl_cancelFirstLayout = onFirstLayout(this.$el, () => {
						this.__customCursor_cursorEl_cancelFirstLayout = null;
						this.__customCursor_cursorEl_dimensions = {
							width: this.$el.clientWidth,
							height: this.$el.clientHeight
						};
						const xValue = springValue(0, springConfig);
						const yValue = springValue(0, springConfig);
						this.__customCursor_cursorEl_xValue = xValue;
						this.__customCursor_cursorEl_yValue = yValue;
						this.__customCursor_cursorEl_stopStyleEffect = styleEffect(this.$el, {
							x: xValue,
							y: yValue
						});
						this.$watch("__customCursor_targetPosition", (targetPosition, previousTargetPosition) => {
							if (targetPosition == null) {
								xValue.stop();
								yValue.stop();
								return;
							}
							const { width, height } = this.__customCursor_cursorEl_dimensions;
							const x = targetPosition.x - width / 2;
							const y = targetPosition.y - height / 2;
							if (previousTargetPosition == null) {
								xValue.jump(x);
								yValue.jump(y);
							} else {
								xValue.set(x);
								yValue.set(y);
							}
						});
					});
				},
				destroy() {
					var _a, _b, _c, _d;
					(_a = this.__customCursor_cursorEl_cancelFirstLayout) === null || _a === void 0 || _a.call(this);
					this.__customCursor_cursorEl_cancelFirstLayout = null;
					(_b = this.__customCursor_cursorEl_xValue) === null || _b === void 0 || _b.stop();
					(_c = this.__customCursor_cursorEl_yValue) === null || _c === void 0 || _c.stop();
					(_d = this.__customCursor_cursorEl_stopStyleEffect) === null || _d === void 0 || _d.call(this);
				},
				get __customCursor_isAtEdge() {
					const rootData = this.$data;
					const targetPosition = rootData.__customCursor_targetPosition;
					const dimensions = this.__customCursor_cursorEl_dimensions;
					const rootRect = rootData.__customCursor_rootRect;
					if (!targetPosition || !dimensions || !rootRect) return false;
					const halfW = dimensions.width / 2;
					const halfH = dimensions.height / 2;
					return targetPosition.x - halfW < rootRect.left || targetPosition.x + halfW > rootRect.right || targetPosition.y - halfH < rootRect.top || targetPosition.y + halfH > rootRect.bottom;
				}
			};
		},
		":data-active"() {
			const rootData = this.$data;
			const isNameMatch = cursorName == null ? rootData.__customCursor_activeCursorName == null : rootData.__customCursor_activeCursorName === cursorName;
			if (!rootData.__customCursor_isActive || !isNameMatch) return null;
			return "";
		},
		":data-hidden"() {
			return this.$data.__customCursor_isHidden;
		},
		":data-edge"() {
			return this.__customCursor_isAtEdge;
		},
		":data-snapped"() {
			return this.$data.__customCursor_isSnapped;
		},
		":style"() {
			const rootData = this.$data;
			const isNameMatch = cursorName == null ? rootData.__customCursor_activeCursorName == null : rootData.__customCursor_activeCursorName === cursorName;
			if (this.__customCursor_cursorEl_xValue == null || this.__customCursor_cursorEl_dimensions == null || !rootData.__customCursor_isActive || !isNameMatch) return {
				contain: "layout",
				visibility: "hidden",
				"pointer-events": "none"
			};
			return {
				transformOrigin: "50% 50% 0",
				"will-change": "transform",
				contain: "layout",
				"pointer-events": "none"
			};
		}
	});
}
function handleSnapPoint($el, Alpine) {
	if (!Alpine.$data($el).__customCursor_rootEl) {
		warnMissingParentDirective("x-custom-cursor:snap-point", "x-custom-cursor", $el);
		return;
	}
	Alpine.bind($el, {
		"x-data"() {
			return {
				__customCursor_snapPoint_handleMouseEnter() {
					this.$data.__customCursor_setCurrentSnapPoint(this.$el);
				},
				__customCursor_snapPoint_handleMouseLeave() {
					this.$data.__customCursor_unsetCurrentSnapPoint();
				}
			};
		},
		":data-snapped"() {
			return this.$data.__customCursor_currentSnapPointEl === this.$el;
		},
		"x-hover:start": "__customCursor_snapPoint_handleMouseEnter",
		"x-hover:end": "__customCursor_snapPoint_handleMouseLeave"
	});
}
function buildPosition(x, y) {
	return {
		x,
		y
	};
}
function handleRoot($el, Alpine, data) {
	Alpine.bind($el, {
		"x-data"() {
			return {
				__customCursor_rootEl: $el,
				__customCursor_rootRect: null,
				__customCursor_isActive: false,
				__customCursor_isHidden: false,
				__customCursor_activeCursorName: null,
				__customCursor_cursorEl: null,
				__customCursor_cursorEl_dimensions: null,
				__customCursor_currentSnapPointEl: null,
				__customCursor_currentSnapPointRect: null,
				__customCursor_targetPosition: null,
				__customCursor_abortController: null,
				init() {
					if ($el.matches(":hover")) this.__customCursor_attachActiveListeners();
				},
				destroy() {
					var _a;
					(_a = this.__customCursor_abortController) === null || _a === void 0 || _a.abort();
				},
				__customCursor_updateRootRect() {
					const { left, right, top, bottom } = $el.getBoundingClientRect();
					this.__customCursor_rootRect = {
						left,
						right,
						top,
						bottom
					};
				},
				__customCursor_setCurrentSnapPoint(el) {
					const { x, y, width, height } = el.getBoundingClientRect();
					this.__customCursor_currentSnapPointEl = el;
					this.__customCursor_currentSnapPointRect = {
						x,
						y,
						width,
						height
					};
				},
				__customCursor_unsetCurrentSnapPoint() {
					this.__customCursor_currentSnapPointEl = null;
					this.__customCursor_currentSnapPointRect = null;
				},
				__customCursor_handleMouseOver(e) {
					const target = e.target;
					const hideEl = target.closest("[data-hide-custom-cursor]");
					const customCursorEl = target.closest("[data-custom-cursor]");
					if (hideEl) {
						this.__customCursor_isHidden = true;
						this.__customCursor_activeCursorName = null;
					} else if (customCursorEl) {
						this.__customCursor_isHidden = false;
						this.__customCursor_activeCursorName = customCursorEl.getAttribute("data-custom-cursor");
					} else {
						this.__customCursor_isHidden = false;
						this.__customCursor_activeCursorName = null;
					}
				},
				__customCursor_handleMouseEnter(e) {
					this.__customCursor_attachActiveListeners();
					this.__customCursor_targetPosition = buildPosition(e.clientX, e.clientY);
				},
				__customCursor_attachActiveListeners() {
					if (this.__customCursor_abortController) return;
					const ac = new AbortController();
					this.__customCursor_abortController = ac;
					this.__customCursor_updateRootRect();
					window.addEventListener("scroll", () => this.__customCursor_updateRootRect(), {
						signal: ac.signal,
						capture: true,
						passive: true
					});
					const resizeObserver = new ResizeObserver(() => this.__customCursor_updateRootRect());
					resizeObserver.observe($el);
					ac.signal.addEventListener("abort", () => resizeObserver.disconnect());
					let lastMoveTime = 0;
					$el.addEventListener("mousemove", (e) => {
						const now = Date.now();
						if (now - lastMoveTime < 16) return;
						lastMoveTime = now;
						this.__customCursor_handleMouseMove(e);
					}, { signal: ac.signal });
					$el.addEventListener("mouseover", (e) => this.__customCursor_handleMouseOver(e), { signal: ac.signal });
					$el.addEventListener("mouseleave", (e) => this.__customCursor_handleMouseLeave(e), { signal: ac.signal });
				},
				__customCursor_handleMouseMove(e) {
					this.__customCursor_isActive = true;
					if (this.__customCursor_currentSnapPointEl) {
						const { x: snapX, y: snapY, width: snapWidth, height: snapHeight } = this.__customCursor_currentSnapPointRect;
						const snapPosition = {
							x: snapX + snapWidth / 2,
							y: snapY + snapHeight / 2
						};
						this.__customCursor_targetPosition = snapPosition;
					} else this.__customCursor_targetPosition = buildPosition(e.clientX, e.clientY);
				},
				__customCursor_handleMouseLeave(e) {
					var _a;
					(_a = this.__customCursor_abortController) === null || _a === void 0 || _a.abort();
					this.__customCursor_abortController = null;
					this.__customCursor_isActive = false;
					this.__customCursor_isHidden = false;
					this.__customCursor_activeCursorName = null;
					this.__customCursor_currentSnapPointEl = null;
					this.__customCursor_targetPosition = null;
					this.__customCursor_rootRect = null;
				},
				get __customCursor_isSnapped() {
					return !!this.__customCursor_currentSnapPointEl;
				}
			};
		},
		"@mouseenter": "__customCursor_handleMouseEnter"
	});
}

//#endregion
//#region src/js/theme.custom-cursor.ts
Alpine.plugin(custom_cursor_default);

//#endregion
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuY3VzdG9tLWN1cnNvci5qcyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyIuLi8uLi8uLi9wYWNrYWdlcy9hc3NlbWJseS11aS9kaXN0L3V0aWxzL2xheW91dC1tZWFzdXJlLmpzIiwiLi4vLi4vLi4vcGFja2FnZXMvYXNzZW1ibHktdWkvZGlzdC91dGlscy9kb20uanMiLCIuLi8uLi8uLi9wYWNrYWdlcy9hc3NlbWJseS11aS9kaXN0L3V0aWxzL2Vycm9yLmpzIiwiLi4vLi4vLi4vcGFja2FnZXMvYXNzZW1ibHktdWkvZGlzdC91dGlscy9tb2RpZmllcnMvYmFzZS5qcyIsIi4uLy4uLy4uL3BhY2thZ2VzL2Fzc2VtYmx5LXVpL2Rpc3QvdXRpbHMvbW9kaWZpZXJzL3NwcmluZy5qcyIsIi4uLy4uLy4uL3BhY2thZ2VzL2Fzc2VtYmx5LXVpL2Rpc3QvYWxwaW5lL2N1c3RvbS1jdXJzb3IuanMiLCIuLi9zcmMvanMvdGhlbWUuY3VzdG9tLWN1cnNvci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEhlbHBlcnMgZm9yIHJlYWRpbmcgbGF5b3V0IHdpdGhvdXQgZm9yY2luZyBzeW5jaHJvbm91cyByZWZsb3dzLlxuICpcbiAqIEEgZnJhbWUgcmVuZGVycyBpbiB0aGlzIG9yZGVyOiByQUYgY2FsbGJhY2tzIOKGkiBzdHlsZS9sYXlvdXQg4oaSIFJlc2l6ZU9ic2VydmVyXG4gKiBjYWxsYmFja3Mg4oaSIHBhaW50LiBSZWFkaW5nIGdlb21ldHJ5IHdoaWxlIHN0eWxlIGlzIGRpcnR5IChtaWNyb3Rhc2sgZmx1c2hlcywgckFGXG4gKiBjYWxsYmFja3MpIGZvcmNlcyBhIHN5bmNocm9ub3VzIHJlZmxvdy4gVHdvIGNsZWFuIHJlYWQgcG9pbnRzIGV4aXN0OlxuICpcbiAqIC0gKipSZXNpemVPYnNlcnZlciBjYWxsYmFja3MqKiDigJQgbGF5b3V0IGp1c3QgcmFuLCBzbyByZWFkcyBhcmUgZnJlZSwgYW5kIHN0eWxlIHdyaXRlc1xuICogICBzdGlsbCBsYW5kIGluIHRoZSBzYW1lIGZyYW1lJ3MgcGFpbnQgKG5vIGZsYXNoKS4gVXNlIGBvbkZpcnN0TGF5b3V0YCBmb3Igb25lLW9mZlxuICogICBcIm1lYXN1cmUsIHRoZW4gYXBwbHkgaW5pdGlhbCBzdHlsZXNcIiB3b3JrLCBhbmQgYHgtcmVzaXplYCBmb3Igb25nb2luZyBzaXplIHRyYWNraW5nLlxuICogLSAqKkFmdGVyIHBhaW50Kiog4oCUIGBhZnRlck5leHRQYWludGAgLyBgcmVhZExheW91dEFmdGVyUGFpbnRgIHJ1biBpbiBhIHRhc2sgcmlnaHQgYWZ0ZXJcbiAqICAgdGhlIGZyYW1lIGNvbW1pdHMuIFJlYWRzIGFyZSBmcmVlLCBidXQgd3JpdGVzIHJlbmRlciBvbmUgZnJhbWUgbGF0ZXI7IG5ldmVyIHVzZSB0aGVtXG4gKiAgIHRvIGFwcGx5IGluaXRpYWwgdmlzdWFsIHN0YXRlIChpdCBmbGFzaGVzKS4gVXNlIHRoZW0gdG8geWllbGQgdW50aWwgcGVuZGluZyBET01cbiAqICAgbXV0YXRpb25zIGhhdmUgcmVuZGVyZWQgKGUuZy4gbWVhc3VyZSDihpIgbXV0YXRlIOKGkiBtZWFzdXJlIGxvb3BzKS5cbiAqXG4gKiBBbGwgYGFmdGVyTmV4dFBhaW50YC9gcmVhZExheW91dEFmdGVyUGFpbnRgIGNhbGxiYWNrcyBzY2hlZHVsZWQgaW4gdGhlIHNhbWUgZnJhbWUgc2hhcmVcbiAqIGEgc2luZ2xlIGZsdXNoIHdpdGggcmVhZHMgcnVubmluZyBmaXJzdCwgc28gYmF0Y2hlZCByZWFkcyBuZXZlciBpbnRlcmxlYXZlIHdpdGhcbiAqIGJhdGNoZWQgd3JpdGVzLlxuICovXG5sZXQgcGVuZGluZ1JlYWRzID0gW107XG5sZXQgcGVuZGluZ0NhbGxiYWNrcyA9IFtdO1xubGV0IGZsdXNoU2NoZWR1bGVkID0gZmFsc2U7XG5mdW5jdGlvbiBmbHVzaEFmdGVyUGFpbnQoKSB7XG4gICAgZmx1c2hTY2hlZHVsZWQgPSBmYWxzZTtcbiAgICBjb25zdCByZWFkcyA9IHBlbmRpbmdSZWFkcztcbiAgICBjb25zdCBjYWxsYmFja3MgPSBwZW5kaW5nQ2FsbGJhY2tzO1xuICAgIHBlbmRpbmdSZWFkcyA9IFtdO1xuICAgIHBlbmRpbmdDYWxsYmFja3MgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHJlYWRzKSB7XG4gICAgICAgIGlmICghZW50cnkuY2FuY2VsbGVkKVxuICAgICAgICAgICAgZW50cnkuZm4oKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBjYWxsYmFja3MpIHtcbiAgICAgICAgaWYgKCFlbnRyeS5jYW5jZWxsZWQpXG4gICAgICAgICAgICBlbnRyeS5mbigpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNjaGVkdWxlRmx1c2hBZnRlclBhaW50KCkge1xuICAgIGlmIChmbHVzaFNjaGVkdWxlZClcbiAgICAgICAgcmV0dXJuO1xuICAgIGZsdXNoU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSAnaGlkZGVuJykge1xuICAgICAgICAvLyBIaWRkZW4gZG9jdW1lbnRzIGRvbid0IHBhaW50LCBzbyByQUYgd291bGQgc3RhbGwgaW5kZWZpbml0ZWx5LlxuICAgICAgICBzZXRUaW1lb3V0KGZsdXNoQWZ0ZXJQYWludCwgMCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyByQUYgYWxvbmUgcnVucyAqYmVmb3JlKiBzdHlsZS9sYXlvdXQvcGFpbnQ7IGEgdGFzayBzY2hlZHVsZWQgZnJvbSBpbnNpZGUgaXQgcnVuc1xuICAgICAgICAvLyByaWdodCBhZnRlciB0aGUgZnJhbWUgY29tbWl0cyDigJQgdGhlIGVhcmxpZXN0IHBvaW50IHdoZXJlIGxheW91dCBpcyBjbGVhbi5cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHNldFRpbWVvdXQoZmx1c2hBZnRlclBhaW50LCAwKSk7XG4gICAgfVxufVxuLyoqXG4gKiBSdW5zIGBmbmAgYWZ0ZXIgdGhlIG5leHQgcGFpbnQuIFJldHVybnMgYSBjYW5jZWwgZnVuY3Rpb24uXG4gKlxuICogTGF5b3V0IGlzIGNsZWFuIGF0IHRoaXMgcG9pbnQsIHNvIGdlb21ldHJ5IHJlYWRzIGFyZSBmcmVlIOKAlCBidXQgc3R5bGUgd3JpdGVzIGhlcmVcbiAqIHJlbmRlciBvbmUgZnJhbWUgbGF0ZXIgdGhhbiB3cml0ZXMgbWFkZSBpbiBhIHJBRi4gUHJlZmVyIGBvbkZpcnN0TGF5b3V0YCB3aGVuIHRoZVxuICogY2FsbGJhY2sgYXBwbGllcyBpbml0aWFsIHZpc3VhbCBzdGF0ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFmdGVyTmV4dFBhaW50KGZuKSB7XG4gICAgY29uc3QgZW50cnkgPSB7IGZuLCBjYW5jZWxsZWQ6IGZhbHNlIH07XG4gICAgcGVuZGluZ0NhbGxiYWNrcy5wdXNoKGVudHJ5KTtcbiAgICBzY2hlZHVsZUZsdXNoQWZ0ZXJQYWludCgpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGVudHJ5LmNhbmNlbGxlZCA9IHRydWU7XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZnRlck5leHRQYWludEFzeW5jKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBhZnRlck5leHRQYWludChyZXNvbHZlKTtcbiAgICB9KTtcbn1cbi8qKlxuICogUnVucyB0aGUgcmVhZCBjYWxsYmFjayBhZnRlciB0aGUgbmV4dCBwYWludCwgYmVmb3JlIGFueSBgYWZ0ZXJOZXh0UGFpbnRgIGNhbGxiYWNrc1xuICogZnJvbSB0aGUgc2FtZSBmcmFtZSwgc28gYmF0Y2hlZCByZWFkcyBjYW4ndCBpbnRlcmxlYXZlIHdpdGggYmF0Y2hlZCB3cml0ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWFkTGF5b3V0QWZ0ZXJQYWludChmbikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBwZW5kaW5nUmVhZHMucHVzaCh7IGZuOiAoKSA9PiByZXNvbHZlKGZuKCkpLCBjYW5jZWxsZWQ6IGZhbHNlIH0pO1xuICAgICAgICBzY2hlZHVsZUZsdXNoQWZ0ZXJQYWludCgpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBSdW5zIGBmbmAgb25jZSB0aGUgZWxlbWVudCBoYXMgYSBsYXlvdXQgYm94LCBpbnNpZGUgYSBSZXNpemVPYnNlcnZlciBjYWxsYmFjazpcbiAqIGFmdGVyIGxheW91dCAocmVhZHMgYXJlIGZyZWUg4oCUIG5vIGZvcmNlZCByZWZsb3cpIGJ1dCBiZWZvcmUgcGFpbnQgKHN0eWxlIHdyaXRlc1xuICogc3RpbGwgbGFuZCBpbiB0aGlzIGZyYW1lIOKAlCBubyBmbGFzaCBvZiB1bnN0eWxlZCBzdGF0ZSkuXG4gKlxuICogRm9yIGFuIGVsZW1lbnQgdGhhdCBpcyByZW5kZXJlZCB3aGVuIGNhbGxlZCwgdGhpcyBmaXJlcyBkdXJpbmcgdGhlIGN1cnJlbnQgZnJhbWUnc1xuICogcmVuZGVyaW5nIHN0ZXBzLiBGb3IgYSBgZGlzcGxheTogbm9uZWAgZWxlbWVudCwgaXQgZmlyZXMgd2hlbiB0aGUgZWxlbWVudCBmaXJzdFxuICogZ2V0cyBhIGJveCDigJQgc28gbWVhc3VyZW1lbnRzIGFyZSBuZXZlciBhIG1lYW5pbmdsZXNzIDDDlzAuIFJldHVybnMgYSBjYW5jZWwgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvbkZpcnN0TGF5b3V0KGVsLCBmbikge1xuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKChlbnRyaWVzKSA9PiB7XG4gICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgZm4oZW50cmllc1swXSk7XG4gICAgfSk7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShlbCk7XG4gICAgcmV0dXJuICgpID0+IG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbn1cbiIsImltcG9ydCB7IHJlYWRMYXlvdXRBZnRlclBhaW50IH0gZnJvbSAnLi9sYXlvdXQtbWVhc3VyZSc7XG5leHBvcnQgZnVuY3Rpb24gaXNGb3JtRGF0YVN1Ym1pdHRlclN1cHBvcnRlZCgpIHtcbiAgICB0cnkge1xuICAgICAgICBuZXcgRm9ybURhdGEoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpLCBcbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBpZiBGb3JtRGF0YSBzdXBwb3J0cyB0aGUgc3VibWl0dGVyIHBhcmFtZXRlciwgdGhpcyB3aWxsIHRocm93XG4gICAgICAgIDApO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGlzVG91Y2hFdmVudChlKSB7XG4gICAgcmV0dXJuIGUucG9pbnRlclR5cGUgPT09ICd0b3VjaCc7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNMZWZ0TW91c2VCdXR0b24oZSkge1xuICAgIHJldHVybiBlLmJ1dHRvbiA9PT0gMDtcbn1cbi8qKlxuICogVHJ1ZSBmb3IgdGhlIHByaW1hcnkgcG9pbnRlciBvbmx5IChsZWZ0IG1vdXNlIGJ1dHRvbiwgb3IgcHJpbWFyeSB0b3VjaCBwb2ludCkuXG4gKiBGaWx0ZXJzIG91dCByaWdodC1jbGljayBhbmQgc2Vjb25kYXJ5IHRvdWNoIHBvaW50cyBzbyBvbmx5IG9uZSBwcmVzcyBpcyBhY3RpdmUuXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3Rpb25kaXZpc2lvbi9tb3Rpb24vYmxvYi9tYWluL3BhY2thZ2VzL21vdGlvbi1kb20vc3JjL2dlc3R1cmVzL3V0aWxzL2lzLXByaW1hcnktcG9pbnRlci50c1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNQcmltYXJ5UG9pbnRlcihlKSB7XG4gICAgaWYgKGUucG9pbnRlclR5cGUgPT09ICdtb3VzZScpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBlLmJ1dHRvbiAhPT0gJ251bWJlcicgfHwgZS5idXR0b24gPD0gMDtcbiAgICB9XG4gICAgcmV0dXJuIGUuaXNQcmltYXJ5ICE9PSBmYWxzZTtcbn1cbmNvbnN0IEtFWUJPQVJEX0FDQ0VTU0lCTEVfVEFHUyA9IG5ldyBTZXQoWydCVVRUT04nLCAnSU5QVVQnLCAnU0VMRUNUJywgJ1RFWFRBUkVBJywgJ0EnXSk7XG4vKipcbiAqIFRydWUgaWYgdGhlIGVsZW1lbnQgaXMgbmF0aXZlbHkgZm9jdXNhYmxlIChrZXlib2FyZCBhY2Nlc3NpYmxlIHdpdGhvdXQgYWRkaW5nIHRhYmluZGV4KS5cbiAqIFVzZWQgYnkgcHJlc3MgZ2VzdHVyZSB0byBkZWNpZGUgd2hldGhlciB0byBzZXQgdGFiSW5kZXggPSAwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNFbGVtZW50S2V5Ym9hcmRBY2Nlc3NpYmxlKGVsKSB7XG4gICAgcmV0dXJuIEtFWUJPQVJEX0FDQ0VTU0lCTEVfVEFHUy5oYXMoZWwudGFnTmFtZSkgfHwgZWwuaXNDb250ZW50RWRpdGFibGUgPT09IHRydWU7XG59XG4vKipcbiAqIFRydWUgaWYgY2hpbGQgaXMgdGhlIHNhbWUgbm9kZSBhcyBwYXJlbnQgb3IgYSBkZXNjZW5kYW50IG9mIHBhcmVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTm9kZU9yQ2hpbGQocGFyZW50LCBjaGlsZCkge1xuICAgIGlmICghY2hpbGQpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAocGFyZW50ID09PSBjaGlsZClcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGlzTm9kZU9yQ2hpbGQocGFyZW50LCBjaGlsZC5wYXJlbnRFbGVtZW50KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1BvcG92ZXJBcGlTdXBwb3J0ZWQoKSB7XG4gICAgcmV0dXJuICh0eXBlb2YgSFRNTEVsZW1lbnQgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgIHR5cGVvZiBIVE1MRWxlbWVudC5wcm90b3R5cGUgPT09ICdvYmplY3QnICYmXG4gICAgICAgICdwb3BvdmVyJyBpbiBIVE1MRWxlbWVudC5wcm90b3R5cGUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlhbG9nQXBpU3VwcG9ydGVkKCkge1xuICAgIHJldHVybiB0eXBlb2YgSFRNTERpYWxvZ0VsZW1lbnQgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNIb3ZlclN1cHBvcnRlZCgpIHtcbiAgICByZXR1cm4gIXdpbmRvdy5tYXRjaE1lZGlhKCcoYW55LWhvdmVyOiBub25lKScpLm1hdGNoZXM7XG59XG4vKipcbiAqIFRydWUgd2hlbiB0aGUgZGV2aWNlJ3MgbWFpbiBwb2ludGVyIGNhbm5vdCBob3ZlciDigJQgYSBmaW5nZXIgb24gYSBwaG9uZSBvciB0YWJsZXQuXG4gKlxuICogVXNlIGl0IHRvIHNraXAgc2V0dGluZyB1cCB3b3JrIHRoYXQgb25seSBtZWFucyBzb21ldGhpbmcgd2l0aCBhIG1vdXNlIG9yIHRyYWNrcGFkLFxuICogc3VjaCBhcyBhbiBlZmZlY3QgdGhhdCBmb2xsb3dzIHRoZSBjdXJzb3IuIENoZWNrIGl0IG9uY2UsIGFzIGVhcmx5IGFzIHBvc3NpYmxlLCBzb1xuICogYSB0b3VjaCBkZXZpY2UgcGF5cyBub3RoaW5nIGZvciB0aGUgZmVhdHVyZS5cbiAqXG4gKiBUaGlzIGlzIHRoZSBzYW1lIHRlc3QgYXMgdGhlIHRoZW1lcycgYHRvdWNoOmAgc3R5bGUgdmFyaWFudCBhbmQgdGhlaXJcbiAqIGAkbWVkaWEubWF0Y2hlcy50b3VjaGAgYnJlYWtwb2ludCwgc28gdGhlIEphdmFTY3JpcHQgYW5kIHRoZSBDU1MgYWdyZWUgb24gd2hhdFxuICogY291bnRzIGFzIGEgdG91Y2ggZGV2aWNlLiBgKHBvaW50ZXI6IGNvYXJzZSlgIGlzIGNoZWNrZWQgYWxvbmdzaWRlIGAoaG92ZXI6IG5vbmUpYFxuICogYmVjYXVzZSBDaHJvbWUgb24gVWJ1bnR1IHJlcG9ydHMgYChob3Zlcjogbm9uZSlgIGV2ZW4gd2hlbiBhIG1vdXNlIGlzIHBsdWdnZWQgaW4uXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYHRzXG4gKiBBbHBpbmUuZGlyZWN0aXZlKCdjdXJzb3ItcG9zaXRpb24nLCAoJGVsKSA9PiB7XG4gKiAgIGlmIChpc1RvdWNoT25seURldmljZSgpKSByZXR1cm47XG4gKiAgIC8vIC4uLnNldCB1cCB0aGUgY3Vyc29yLWZvbGxvd2luZyBlZmZlY3RcbiAqIH0pLmJlZm9yZSgnYmluZCcpO1xuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1RvdWNoT25seURldmljZSgpIHtcbiAgICByZXR1cm4gd2luZG93Lm1hdGNoTWVkaWEoJyhwb2ludGVyOiBjb2Fyc2UpIGFuZCAoaG92ZXI6IG5vbmUpJykubWF0Y2hlcztcbn1cbi8qKlxuICogUmV0dXJucyBhbiBhcnJheSBvZiBzZWN0aW9uIElEcyB0aGF0IGhhdmUgb3IgY29udGFpbiBhbiBlbGVtZW50IGhhdmluZyB0aGUgZGF0YS1jYXJ0LWFwaS1zZWN0aW9uIGF0dHJpYnV0ZS5cbiAqIFRoaXMgaXMgdXNlZCB0byBnYXRoZXIgdXAgYWxsIHRoZSBzZWN0aW9ucyB0aGF0IG5lZWQgdG8gYmUgdXBkYXRlZCB3aGVuIHRoZSBjYXJ0IEFQSSBpcyBjYWxsZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDYXJ0QXBpU2VjdGlvbnMoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNob3BpZnktc2VjdGlvbjppcyg6aGFzKFtkYXRhLWNhcnQtYXBpLXNlY3Rpb25dKSxbZGF0YS1jYXJ0LWFwaS1zZWN0aW9uXSknKSkubWFwKChzZWN0aW9uKSA9PiB7XG4gICAgICAgIHJldHVybiBzZWN0aW9uLmlkLnNwbGl0KCdzaG9waWZ5LXNlY3Rpb24tJylbMV07XG4gICAgfSk7XG59XG4vLyBJbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vcmVtaXgtcnVuL3JlYWN0LXJvdXRlci9ibG9iLzlhZmFjMTVkOGNiZTMwYjM3ZDBmOWU4Yjg5YzlmMWU0MzBkZmUzNWEvcGFja2FnZXMvcmVhY3Qtcm91dGVyLWRvbS9kb20udHMjTDI1MFxuZXhwb3J0IGZ1bmN0aW9uIGdldEZvcm1TdWJtaXNzaW9uSW5mbyh0YXJnZXQsIHN1Ym1pdHRlcikge1xuICAgIGxldCBtZXRob2Q7XG4gICAgbGV0IGFjdGlvbjtcbiAgICBsZXQgZm9ybURhdGEgPSB1bmRlZmluZWQ7XG4gICAgbGV0IGVuY3R5cGUgPSBudWxsO1xuICAgIGxldCBkZWZhdWx0TWV0aG9kID0gJ0dFVCc7XG4gICAgaWYgKGlzRm9ybUVsZW1lbnQodGFyZ2V0KSkge1xuICAgICAgICBhY3Rpb24gPSB0YXJnZXQuYWN0aW9uO1xuICAgICAgICBtZXRob2QgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdtZXRob2QnKSB8fCBkZWZhdWx0TWV0aG9kO1xuICAgICAgICBlbmN0eXBlID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnZW5jdHlwZScpIHx8IG51bGw7XG4gICAgICAgIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKHRhcmdldCwgc3VibWl0dGVyIHx8IG51bGwpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc0J1dHRvbkVsZW1lbnQodGFyZ2V0KSB8fFxuICAgICAgICAoaXNJbnB1dEVsZW1lbnQodGFyZ2V0KSAmJiAodGFyZ2V0LnR5cGUgPT09ICdzdWJtaXQnIHx8IHRhcmdldC50eXBlID09PSAnaW1hZ2UnKSkpIHtcbiAgICAgICAgbGV0IGZvcm0gPSB0YXJnZXQuZm9ybTtcbiAgICAgICAgaWYgKGZvcm0gPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3Qgc3VibWl0IGEgPGJ1dHRvbj4gb3IgPGlucHV0IHR5cGU9XCJzdWJtaXRcIj4gd2l0aG91dCBhIDxmb3JtPmApO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhdHRyID0gdGFyZ2V0LmZvcm1BY3Rpb24gfHwgZm9ybS5hY3Rpb247XG4gICAgICAgIGFjdGlvbiA9IGF0dHI7XG4gICAgICAgIG1ldGhvZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2Zvcm1tZXRob2QnKSB8fCBmb3JtLmdldEF0dHJpYnV0ZSgnbWV0aG9kJykgfHwgZGVmYXVsdE1ldGhvZDtcbiAgICAgICAgZW5jdHlwZSA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2Zvcm1lbmN0eXBlJykgfHwgZm9ybS5nZXRBdHRyaWJ1dGUoJ2VuY3R5cGUnKSB8fCBudWxsO1xuICAgICAgICAvLyBCdWlsZCBhIEZvcm1EYXRhIG9iamVjdCBwb3B1bGF0ZWQgZnJvbSBhIGZvcm0gYW5kIHN1Ym1pdHRlclxuICAgICAgICBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtLCB0YXJnZXQpO1xuICAgICAgICAvLyBJZiB0aGlzIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IHRoZSBgRm9ybURhdGEoZWwsIHN1Ym1pdHRlcilgIGZvcm1hdCxcbiAgICAgICAgLy8gdGhlbiB0YWNrIG9uIHRoZSBzdWJtaXR0ZXIgdmFsdWUgYXQgdGhlIGVuZC4gIFRoaXMgaXMgYSBsaWdodHdlaWdodFxuICAgICAgICAvLyBzb2x1dGlvbiB0aGF0IGlzIG5vdCAxMDAlIHNwZWMgY29tcGxpYW50LiAgRm9yIGNvbXBsZXRlIHN1cHBvcnQgaW4gb2xkZXJcbiAgICAgICAgLy8gYnJvd3NlcnMsIGNvbnNpZGVyIHVzaW5nIHRoZSBgZm9ybWRhdGEtc3VibWl0dGVyLXBvbHlmaWxsYCBwYWNrYWdlXG4gICAgICAgIGlmICghaXNGb3JtRGF0YVN1Ym1pdHRlclN1cHBvcnRlZCgpKSB7XG4gICAgICAgICAgICBsZXQgeyBuYW1lLCB0eXBlLCB2YWx1ZSB9ID0gdGFyZ2V0O1xuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdpbWFnZScpIHtcbiAgICAgICAgICAgICAgICBsZXQgcHJlZml4ID0gbmFtZSA/IGAke25hbWV9LmAgOiAnJztcbiAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoYCR7cHJlZml4fXhgLCAnMCcpO1xuICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChgJHtwcmVmaXh9eWAsICcwJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChpc0h0bWxFbGVtZW50KHRhcmdldCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3Qgc3VibWl0IGVsZW1lbnQgdGhhdCBpcyBub3QgPGZvcm0+LCA8YnV0dG9uPiwgb3IgYCArIGA8aW5wdXQgdHlwZT1cInN1Ym1pdHxpbWFnZVwiPmApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbWV0aG9kID0gZGVmYXVsdE1ldGhvZDtcbiAgICAgICAgYWN0aW9uID0gbnVsbDtcbiAgICAgICAgZW5jdHlwZSA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGFjdGlvbixcbiAgICAgICAgbWV0aG9kOiBtZXRob2QudG9VcHBlckNhc2UoKSxcbiAgICAgICAgZm9ybURhdGEsXG4gICAgICAgIGVuY3R5cGUsXG4gICAgfTtcbn1cbi8qKlxuICogTWFrZSBhIGZldGNoIHJlcXVlc3Qgd2l0aCB0aGUgZ2l2ZW4gZm9ybSBkYXRhIHN1Ym1pc3Npb24gaW5mby5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN1Ym1pdEZvcm1EYXRhKHsgYWN0aW9uLCBmb3JtRGF0YSwgbWV0aG9kLCBlbmN0eXBlIH0sIGluaXQpIHtcbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgICBjYXNlICdQT1NUJzpcbiAgICAgICAgICAgIGlmIChlbmN0eXBlID09PSAnYXBwbGljYXRpb24vanNvbicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmV0Y2goYWN0aW9uLCBPYmplY3QuYXNzaWduKHsgbWV0aG9kOiAnUE9TVCcsIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlcXVpcmVkIGZvciBxdWFudGl0eSBjaGVja2luZyBvbiB0aGUgY2FydCBlbmRwb2ludHMuLi4uXG4gICAgICAgICAgICAgICAgICAgICAgICAnWC1SZXF1ZXN0ZWQtV2l0aCc6ICdYTUxIdHRwUmVxdWVzdCcsXG4gICAgICAgICAgICAgICAgICAgIH0sIGJvZHk6IEpTT04uc3RyaW5naWZ5KHNlcmlhbGl6ZUZvcm1EYXRhKGZvcm1EYXRhKSkgfSwgaW5pdCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZldGNoKGFjdGlvbiwgT2JqZWN0LmFzc2lnbih7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBmb3JtRGF0YSwgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgQWNjZXB0OiAnYXBwbGljYXRpb24vamF2YXNjcmlwdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZXF1aXJlZCBmb3IgcXVhbnRpdHkgY2hlY2tpbmcgb24gdGhlIGNhcnQgZW5kcG9pbnRzLi4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgJ1gtUmVxdWVzdGVkLVdpdGgnOiAnWE1MSHR0cFJlcXVlc3QnLFxuICAgICAgICAgICAgICAgICAgICB9IH0sIGluaXQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgY2FzZSAnR0VUJzpcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGAke2FjdGlvbn0/JHtuZXcgVVJMU2VhcmNoUGFyYW1zKGZvcm1EYXRhKS50b1N0cmluZygpfWA7XG4gICAgICAgICAgICByZXR1cm4gZmV0Y2godXJsLCBPYmplY3QuYXNzaWduKHsgbWV0aG9kOiAnR0VUJywgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICB9IH0sIGluaXQpKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgbWV0aG9kOiAke21ldGhvZH1gKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gcGFyc2VNdWx0aXBhcnQoYm9keSwgY29udGVudFR5cGUpIHtcbiAgICB2YXIgX2E7XG4gICAgLy8gRXh0cmFjdCB0aGUgYm91bmRhcnkgZnJvbSB0aGUgQ29udGVudC1UeXBlIGhlYWRlclxuICAgIGxldCBib3VuZGFyeSA9IChfYSA9IGNvbnRlbnRUeXBlLm1hdGNoKC9ib3VuZGFyeT0oLiopJC8pKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2FbMV07XG4gICAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgLy8gU3BsaXQgdGhlIGJvZHkgYnkgdGhlIGJvdW5kYXJ5XG4gICAgYm9keS5zcGxpdCgnLS0nICsgYm91bmRhcnkpLmZvckVhY2goKHBhcnQpID0+IHtcbiAgICAgICAgaWYgKHBhcnQuaW5jbHVkZXMoJ0NvbnRlbnQtRGlzcG9zaXRpb24nKSkge1xuICAgICAgICAgICAgbGV0IG5hbWVNYXRjaCA9IHBhcnQubWF0Y2goL25hbWU9XCIoW15cIl0rKVwiLyk7XG4gICAgICAgICAgICBpZiAobmFtZU1hdGNoKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBuYW1lTWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gcGFydC5zcGxpdCgnXFxyXFxuXFxyXFxuJylbMV0udHJpbSgpO1xuICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChuYW1lLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBsZXQgZGF0YSA9IHt9O1xuICAgIGxldCBwcm9wZXJ0aWVzID0ge307XG4gICAgLy8gT3JnYW5pemUgdGhlIGRhdGEgaW50byBhIHN0cnVjdHVyZWQgb2JqZWN0XG4gICAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIGZvcm1EYXRhLmVudHJpZXMoKSkge1xuICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoJ3Byb3BlcnRpZXNbJykgJiYga2V5LmVuZHNXaXRoKCddJykpIHtcbiAgICAgICAgICAgIGxldCBwcm9wTmFtZSA9IGtleS5zbGljZSgxMSwgLTEpO1xuICAgICAgICAgICAgcHJvcGVydGllc1twcm9wTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRhdGFba2V5XSA9IE51bWJlcih2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKE9iamVjdC5rZXlzKHByb3BlcnRpZXMpLmxlbmd0aCkge1xuICAgICAgICBkYXRhWydwcm9wZXJ0aWVzJ10gPSBwcm9wZXJ0aWVzO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc01vZGlmaWVkRXZlbnQoZXZlbnQpIHtcbiAgICByZXR1cm4gISEoZXZlbnQubWV0YUtleSB8fCBldmVudC5hbHRLZXkgfHwgZXZlbnQuY3RybEtleSB8fCBldmVudC5zaGlmdEtleSk7XG59XG4vLyBJbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vcmVtaXgtcnVuL3JlYWN0LXJvdXRlci9ibG9iLzlhZmFjMTVkOGNiZTMwYjM3ZDBmOWU4Yjg5YzlmMWU0MzBkZmUzNWEvcGFja2FnZXMvcmVhY3Qtcm91dGVyLWRvbS9kb20udHMjTDM2XG5leHBvcnQgZnVuY3Rpb24gc2hvdWxkUHJvY2Vzc0xpbmtDbGljayhldmVudCwgdGFyZ2V0KSB7XG4gICAgcmV0dXJuIChldmVudC5idXR0b24gPT09IDAgJiYgLy8gSWdub3JlIGV2ZXJ5dGhpbmcgYnV0IGxlZnQgY2xpY2tzXG4gICAgICAgICghdGFyZ2V0IHx8IHRhcmdldCA9PT0gJ19zZWxmJykgJiYgLy8gTGV0IGJyb3dzZXIgaGFuZGxlIFwidGFyZ2V0PV9ibGFua1wiIGV0Yy5cbiAgICAgICAgIWlzTW9kaWZpZWRFdmVudChldmVudCkgLy8gSWdub3JlIGNsaWNrcyB3aXRoIG1vZGlmaWVyIGtleXNcbiAgICApO1xufVxuLy8gQ2hlY2sgaWYgY2xpcGJvYXJkLndyaXRlVGV4dCgpIGNhbiBleGVjdXRlIHRvIGF2b2lkIHRocm93aW5nIGFuIGVycm9yLlxuLy8gRmlyZWZveCBkb2VzIG5vdCBzdXBwb3J0ICdjbGlwYm9hcmQtd3JpdGUnIGluIHRoZSBwZXJtaXNzaW9ucyBBUEksIHNvIGRlZmF1bHQgdG8gdHJ1ZSBpZiB1bnN1cHBvcnRlZC5cbmV4cG9ydCBmdW5jdGlvbiBpc0NsaXBib2FyZFdyaXRlQWxsb3dlZCgpIHtcbiAgICBpZiAobmF2aWdhdG9yLnBlcm1pc3Npb25zICYmIHR5cGVvZiBuYXZpZ2F0b3IucGVybWlzc2lvbnMucXVlcnkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBuYXZpZ2F0b3IucGVybWlzc2lvbnNcbiAgICAgICAgICAgICAgICAucXVlcnkoeyBuYW1lOiAnY2xpcGJvYXJkLXdyaXRlJyB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBQZXJtaXNzaW9uIGRlbmllZFxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdGUgPT09ICdkZW5pZWQnKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5zdGF0ZSA9PT0gJ2dyYW50ZWQnIHx8IHJlc3VsdC5zdGF0ZSA9PT0gJ3Byb21wdCc7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gUGVybWlzc2lvbnMgQVBJIGlzIGF2YWlsYWJsZSBidXQgcXVlcnkgZmFpbGVkIChlLmcuIG5vdCBzdXBwb3J0ZWQgZm9yIGNsaXBib2FyZClcbiAgICAgICAgICAgICAgICAvLyBGaXJlZm94IGFuZCBvdGhlcnM6IGZhbGxiYWNrIHRvIGFzc3VtZSBpdCBpcyBhbGxvd2VkLCBzaW5jZSB3cml0ZVRleHQgd2lsbCB0aHJvdyBpZiBub3RcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChfYSkge1xuICAgICAgICAgICAgLy8gRGVmZW5zaXZlOiBpZiBxdWVyeSB0aHJvd3Mgc3luY2hyb25vdXNseVxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBwZXJtaXNzaW9ucyBBUEkgbm90IGF2YWlsYWJsZSBhdCBhbGwsIGFzc3VtZSBhbGxvd2VkIChzaW5jZSB3cml0ZVRleHQgd2lsbCB0aHJvdyBpZiBub3QpXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0h0bWxFbGVtZW50KG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZSAhPSB1bmRlZmluZWQgJiYgbm9kZSAhPSBudWxsICYmIHR5cGVvZiBub2RlLnRhZ05hbWUgPT09ICdzdHJpbmcnICYmIG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzSW1hZ2VFbGVtZW50KG5vZGUpIHtcbiAgICByZXR1cm4gaXNIdG1sRWxlbWVudChub2RlKSAmJiBub2RlLm5vZGVOYW1lID09PSAnSU1HJztcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1ZpZGVvRWxlbWVudChub2RlKSB7XG4gICAgcmV0dXJuIGlzSHRtbEVsZW1lbnQobm9kZSkgJiYgbm9kZS5ub2RlTmFtZSA9PT0gJ1ZJREVPJztcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1NvdXJjZUVsZW1lbnQobm9kZSkge1xuICAgIHJldHVybiBpc0h0bWxFbGVtZW50KG5vZGUpICYmIG5vZGUubm9kZU5hbWUgPT09ICdTT1VSQ0UnO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzU2NyaXB0RWxlbWVudChub2RlKSB7XG4gICAgcmV0dXJuIGlzSHRtbEVsZW1lbnQobm9kZSkgJiYgbm9kZS5ub2RlTmFtZSA9PT0gJ1NDUklQVCc7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNBbmNob3JFbGVtZW50KG5vZGUpIHtcbiAgICByZXR1cm4gaXNIdG1sRWxlbWVudChub2RlKSAmJiBub2RlLm5vZGVOYW1lID09PSAnQSc7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNGb3JtRWxlbWVudChub2RlKSB7XG4gICAgcmV0dXJuIGlzSHRtbEVsZW1lbnQobm9kZSkgJiYgbm9kZS5ub2RlTmFtZSA9PT0gJ0ZPUk0nO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlhbG9nRWxlbWVudChub2RlKSB7XG4gICAgcmV0dXJuIGlzSHRtbEVsZW1lbnQobm9kZSkgJiYgbm9kZS5ub2RlTmFtZSA9PT0gJ0RJQUxPRyc7XG59XG4vKipcbiAqIENsb3NlIGV2ZXJ5IG9wZW4gYDxkaWFsb2c+YCBpbiB0aGUgc3VidHJlZSwgdGhlIGVsZW1lbnQgaXRzZWxmIGluY2x1ZGVkLlxuICpcbiAqIHNob3dNb2RhbCgpIHB1dHMgdGhlIGRpYWxvZyBpbiB0aGUgYnJvd3NlcidzIHRvcCBsYXllciBhbmQgbWFrZXMgdGhlIHJlc3Qgb2YgdGhlIHBhZ2VcbiAqIGluZXJ0LiBXZWJLaXQga2VlcHMgYm90aCB3aGVuIHRoZSBlbGVtZW50IGxlYXZlcyB0aGUgRE9NIHdpdGhvdXQgY2xvc2UoKSDigJQgdGhlIHBhZ2VcbiAqIHN0aWxsIHNjcm9sbHMsIGJ1dCBldmVyeSB0YXAgb24gaXQgZGllcy4gQ2FsbCB0aGlzIHdoaWxlIHRoZSBtYXJrdXAgaXMgc3RpbGwgaW4gdGhlXG4gKiBkb2N1bWVudCwgYmVmb3JlIHJlbW92aW5nIG9yIHJlcGxhY2luZyBpdC5cbiAqXG4gKiBAZXhhbXBsZSBDbG9zZSBiZWZvcmUgYSBzZWN0aW9uIG1vcnBoIHJlbW92ZXMgdGhlIHN1YnRyZWVcbiAqIGBgYHRzXG4gKiByZW1vdmluZyhlbCkge1xuICogICBjbG9zZU9wZW5EaWFsb2dzKGVsKTtcbiAqIH1cbiAqIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VPcGVuRGlhbG9ncyhyb290KSB7XG4gICAgaWYgKCFpc0RpYWxvZ0FwaVN1cHBvcnRlZCgpKVxuICAgICAgICByZXR1cm47XG4gICAgaWYgKGlzRGlhbG9nRWxlbWVudChyb290KSAmJiByb290Lm9wZW4pXG4gICAgICAgIHJvb3QuY2xvc2UoKTtcbiAgICByb290LnF1ZXJ5U2VsZWN0b3JBbGwoJ2RpYWxvZ1tvcGVuXScpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIGlmIChpc0RpYWxvZ0VsZW1lbnQoZWwpKVxuICAgICAgICAgICAgZWwuY2xvc2UoKTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0lucHV0RWxlbWVudChub2RlKSB7XG4gICAgcmV0dXJuIGlzSHRtbEVsZW1lbnQobm9kZSkgJiYgbm9kZS5ub2RlTmFtZSA9PT0gJ0lOUFVUJztcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0lucHV0UmFuZ2VFbGVtZW50KG5vZGUpIHtcbiAgICByZXR1cm4gaXNIdG1sRWxlbWVudChub2RlKSAmJiBub2RlLm5vZGVOYW1lID09PSAnSU5QVVQnICYmIG5vZGUuZ2V0QXR0cmlidXRlKCd0eXBlJykgPT0gJ3JhbmdlJztcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0lucHV0TnVtYmVyRWxlbWVudChub2RlKSB7XG4gICAgcmV0dXJuIGlzSHRtbEVsZW1lbnQobm9kZSkgJiYgbm9kZS5ub2RlTmFtZSA9PT0gJ0lOUFVUJyAmJiBub2RlLmdldEF0dHJpYnV0ZSgndHlwZScpID09ICdudW1iZXInO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzQnV0dG9uRWxlbWVudChub2RlKSB7XG4gICAgcmV0dXJuIGlzSHRtbEVsZW1lbnQobm9kZSkgJiYgbm9kZS5ub2RlTmFtZSA9PT0gJ0JVVFRPTic7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNTdW1tYXJ5RWxlbWVudChub2RlKSB7XG4gICAgcmV0dXJuIGlzSHRtbEVsZW1lbnQobm9kZSkgJiYgbm9kZS5ub2RlTmFtZSA9PT0gJ1NVTU1BUlknO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzVGVtcGxhdGVFbGVtZW50KG5vZGUpIHtcbiAgICByZXR1cm4gaXNIdG1sRWxlbWVudChub2RlKSAmJiBub2RlLm5vZGVOYW1lID09PSAnVEVNUExBVEUnO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvZHVjdEZvcm0oZWwpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIGlzRm9ybUVsZW1lbnQoZWwpICYmICgoX2EgPSBlbC5nZXRBdHRyaWJ1dGUoJ2FjdGlvbicpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaW5jbHVkZXMoJ2NhcnQvYWRkJykpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzSW5Qcm9kdWN0Rm9ybShlbCkge1xuICAgIHJldHVybiBpc0h0bWxFbGVtZW50KGVsKSAmJiAhaXNQcm9kdWN0Rm9ybShlbCkgJiYgZWwuY2xvc2VzdCgnZm9ybVthY3Rpb24qPVwiY2FydC9hZGRcIl0nKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0hpZGRlbklucHV0KGVsKSB7XG4gICAgcmV0dXJuIGlzSW5wdXRFbGVtZW50KGVsKSAmJiBlbC50eXBlID09PSAnaGlkZGVuJztcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1Nob3BpZnlBcHBCbG9jayhlbCkge1xuICAgIHJldHVybiBpc0h0bWxFbGVtZW50KGVsKSAmJiBlbC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3BpZnktYXBwLWJsb2NrJyk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNTaG9waWZ5RWxlbWVudChlbCkge1xuICAgIHJldHVybiBpc0h0bWxFbGVtZW50KGVsKSAmJiBlbC5oYXNBdHRyaWJ1dGUoJ2RhdGEtc2hvcGlmeScpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFdyaXRpbmdEaXJlY3Rpb24oZWwpIHtcbiAgICByZXR1cm4gZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZGlyZWN0aW9uO1xufVxuLyoqXG4gKiBTZXJpYWxpemVzIGEgRm9ybURhdGEgb2JqZWN0IGludG8gYSBKU09OIG9iamVjdFxuICogQHBhcmFtIGZvcm1EYXRhIC0gVGhlIGZvcm0gZGF0YSB0byBzZXJpYWxpemVcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemVGb3JtRGF0YShmb3JtRGF0YSkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIGZvcm1EYXRhLmVudHJpZXMoKSkge1xuICAgICAgICAvLyBTcGxpdCB0aGUga2V5IGludG8gcGFydHMgYnkgYnJhY2tldHNcbiAgICAgICAgY29uc3QgcGFydHMgPSBrZXkubWF0Y2goLyhbXlxcW1xcXV0rKS9nKSB8fCBba2V5XTtcbiAgICAgICAgbGV0IGN1cnJlbnQgPSByZXN1bHQ7XG4gICAgICAgIC8vIFRyYXZlcnNlIHRocm91Z2ggYWxsIHBhcnRzIGV4Y2VwdCB0aGUgbGFzdCBvbmVcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnQgPSBwYXJ0c1tpXTtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBuZXN0ZWQgb2JqZWN0IGlmIGl0IGRvZXNuJ3QgZXhpc3RcbiAgICAgICAgICAgIGN1cnJlbnRbcGFydF0gPSBjdXJyZW50W3BhcnRdIHx8IHt9O1xuICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnRbcGFydF07XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2V0IHRoZSB2YWx1ZSBhdCB0aGUgZmluYWwgbGV2ZWxcbiAgICAgICAgY29uc3QgbGFzdFBhcnQgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcbiAgICAgICAgY3VycmVudFtsYXN0UGFydF0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICogQ2hlY2tzIGlmIGEgY2xpY2sgZXZlbnQgaXMgb2NjdXJyaW5nIG91dHNpZGUgb2YgYSBjb250YWluZXIgZWxlbWVudFxuICogQHBhcmFtIGV2ZW50XG4gKiBAcGFyYW0gY29udGFpbmVyXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNDbGlja2luZ091dHNpZGUoZXZlbnQsIGNvbnRhaW5lcikge1xuICAgIC8vIElmIHRoZSBldmVudCB0YXJnZXQgaXMgbm90IGFuIGVsZW1lbnQsIHRoZW4gdXNlIGl0J3MgY29vcmRpbmF0ZXMgdG8gY2hlY2sgaWYgaXQncyBvdXRzaWRlIHRoZSBlbGVtZW50XG4gICAgaWYgKGV2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxEaWFsb2dFbGVtZW50IHx8ICEoZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgRWxlbWVudCkpIHtcbiAgICAgICAgcmV0dXJuICFpc1BvaW50V2l0aGluRWxlbWVudChldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZLCBjb250YWluZXIpO1xuICAgIH1cbiAgICAvLyBVc2luZyBgZXZlbnQuY29tcG9zZWRQYXRoYCB0ZWxscyB1cyB3aGV0aGVyIHRoZSBlbGVtZW50IF9pcyBvciB3YXNfIGNvbnRhaW5lZCBpbiB0aGUgY29udGFpbmVyXG4gICAgLy8gd2hlbiB0aGUgY2xpY2sgZXZlbnQgd2FzIHRyaWdnZXJlZC4gVGhpcyBpcyBvcHBvc2VkIHRvIGUuZy4gYGVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KWAgd2hpY2ggd291bGRcbiAgICAvLyBvbmx5IGNoZWNrIGlmIHRoZSBlbGVtZW50IF9pc18gY29udGFpbmVkIGluIHRoZSBjb250YWluZXIgYXQgdGhlIHRpbWUgdGhlIGNoZWNrIGlzIG1hZGUuIFRoaXNcbiAgICAvLyB3b3VsZCBmYWlsIGlmIGZvciBpbnN0YW5jZSB0aGUgY29udGVudHMgb2YgdGhlIGNvbnRhaW5lciB3ZXJlIGNoYW5nZWQgYWZ0ZXIgdGhlIGNsaWNrIGV2ZW50IHdhcyB0cmlnZ2VyZWQgYnV0XG4gICAgLy8gYmVmb3JlIHRoZSBjaGVjayBpcyBtYWRlLlxuICAgIHJldHVybiAhZXZlbnQuY29tcG9zZWRQYXRoKCkuaW5jbHVkZXMoY29udGFpbmVyKTtcbn1cbi8qKlxuICogQ2hlY2tzIGlmIGEgcG9pbnQgaXMgd2l0aGluIGFuIGVsZW1lbnRcbiAqIEBwYXJhbSB4IC0gVGhlIHggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRcbiAqIEBwYXJhbSB5IC0gVGhlIHkgY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnRcbiAqIEBwYXJhbSBlbGVtZW50IC0gVGhlIGVsZW1lbnQgdG8gY2hlY2tcbiAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHBvaW50IGlzIHdpdGhpbiB0aGUgZWxlbWVudCwgZmFsc2Ugb3RoZXJ3aXNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1BvaW50V2l0aGluRWxlbWVudCh4LCB5LCBlbGVtZW50KSB7XG4gICAgY29uc3QgeyBsZWZ0LCByaWdodCwgdG9wLCBib3R0b20gfSA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHggPj0gbGVmdCAmJiB4IDw9IHJpZ2h0ICYmIHkgPj0gdG9wICYmIHkgPD0gYm90dG9tO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG9uRG9jdW1lbnRSZWFkeShjYWxsYmFjaykge1xuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlICE9PSAnY29tcGxldGUnKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBjYWxsYmFjayk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgIH1cbn1cbi8qKlxuICogUnVuIGBjYWxsYmFja2Agd2hlbiB0aGUgYnJvd3NlciBpcyBuZXh0IGlkbGUuXG4gKlxuICogQWx3YXlzIHBhc3MgYSBgdGltZW91dGAuIFdpdGhvdXQgb25lIHRoZSBicm93c2VyIGlzIGZyZWUgdG8gcHV0IHRoZSBjYWxsYmFjayBvZmYgZm9yIGFzIGxvbmcgYXNcbiAqIHRoZSBtYWluIHRocmVhZCBzdGF5cyBidXN5IOKAlCBvbiBhIGdlbnVpbmVseSBsb2FkZWQgZGV2aWNlIHRoYXQgY2FuIG1lYW4gaXQgbmV2ZXIgcnVucyBhdCBhbGwsIHNvXG4gKiB3aGF0ZXZlciB0aGUgY2FsbGJhY2sgd2FzIGRlZmVycmluZyBzaWxlbnRseSBuZXZlciBoYXBwZW5zLiBBIHRpbWVvdXQgbWFrZXMgaXQgcnVuIGFueXdheSBvbmNlIHRoZVxuICogZGVhZGxpbmUgcGFzc2VzLiBPdXIgcGx1Z2lucyB1c2UgMjAwMG1zIHVubGVzcyB0aGVyZSdzIGEgcmVhc29uIHRvIGJlIHF1aWNrZXIuXG4gKlxuICogQHBhcmFtIGNhbGxiYWNrIC0gV29yayB0byBkZWZlciB1bnRpbCB0aGUgYnJvd3NlciBpcyBpZGxlLlxuICogQHBhcmFtIG9wdGlvbnMgLSBJZGxlIG9wdGlvbnMsIG1vc3QgaW1wb3J0YW50bHkgYHRpbWVvdXRgIGluIG1pbGxpc2Vjb25kcy5cbiAqIEByZXR1cm5zIEFuIGlkIHRvIHBhc3MgdG8ge0BsaW5rIGNhbmNlbElkbGVDYWxsYmFja30uXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGlkbGVDYWxsYmFja0lkID0gcmVxdWVzdElkbGVDYWxsYmFjaygoKSA9PiBzZXR1cEV4cGVuc2l2ZVRoaW5nKCksIHt0aW1lb3V0OiAyMDAwfSk7XG4gKiBjbGVhbnVwKCgpID0+IGNhbmNlbElkbGVDYWxsYmFjayhpZGxlQ2FsbGJhY2tJZCkpO1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmVxdWVzdElkbGVDYWxsYmFjayhjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGlmICh0eXBlb2Ygd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrKGNhbGxiYWNrLCBvcHRpb25zKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGxldCBzdGFydCA9IERhdGUubm93KCk7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgICAgICAgICBkaWRUaW1lb3V0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0aW1lUmVtYWluaW5nOiAoKSA9PiB7IHZhciBfYTsgcmV0dXJuIE1hdGgubWF4KDAsICgoX2EgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMudGltZW91dCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogNTApIC0gKERhdGUubm93KCkgLSBzdGFydCkpOyB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIDEpO1xuICAgIH1cbn1cbi8qKlxuICogUnVucyBgY2FsbGJhY2tgIG9uY2UgdGhlIHBhZ2UgaGFzIHNjcm9sbGVkIOKAlCBvciByaWdodCBhZnRlciB0aGUgbmV4dCBwYWludCwgaWYgYnkgdGhlblxuICogaXQgYWxyZWFkeSBoYXMuXG4gKlxuICogU29tZSBzZXR1cCBvbmx5IHN0YXJ0cyBtYXR0ZXJpbmcgb25jZSB0aGUgcGFnZSBpcyBhd2F5IGZyb20gdGhlIHRvcDogdHJhY2tpbmcgdGhlXG4gKiBzY3JvbGwgcG9zaXRpb24sIHdvcmtpbmcgb3V0IHdoZXJlIGEgc3RpY2t5IGhlYWRlciBzaXRzLiBEb2luZyBpdCBkdXJpbmcgcGFnZSBsb2FkIGlzXG4gKiB3YXN0ZWQgZWZmb3J0LCBiZWNhdXNlIGEgcGFnZSBhdCB0aGUgdG9wIGFscmVhZHkgYmVoYXZlcyB0aGUgd2F5IFwibm90IHNjcm9sbGVkXCIgc2F5cyBpdFxuICogc2hvdWxkLCBhbmQgdGhhdCBzZXR1cCB1c3VhbGx5IG1lYW5zIG1lYXN1cmluZyB0aGUgcGFnZSwgd2hpY2ggaXMgdGhlIG1vc3QgZXhwZW5zaXZlXG4gKiB0aGluZyB0byBhc2sgZm9yIHdoaWxlIHRoZSBwYWdlIGlzIHN0aWxsIHNldHRsaW5nLlxuICpcbiAqIFdhaXRpbmcgZm9yIHRoZSBmaXJzdCBzY3JvbGwgZXZlbnQgaXMgbm90IGVub3VnaCBvbiBpdHMgb3duOiBhIHBhZ2Ugb3BlbmVkIGF0IGFuIGFuY2hvclxuICogbGluaywgb3IgcmVzdG9yZWQgYnkgdGhlIGJhY2sgYnV0dG9uLCBjYW4gc2Nyb2xsIGJlZm9yZSBvdXIgc2NyaXB0cyBydW4gYXQgYWxsLCBhbmQgdGhhdFxuICogZXZlbnQgaXMgbG9uZyBnb25lIGJ5IHRoZSB0aW1lIGEgbGlzdGVuZXIgY291bGQgYmUgYXR0YWNoZWQuIFNvIHRoZSBwb3NpdGlvbiBpcyBhbHNvXG4gKiBjaGVja2VkIG9uY2Ug4oCUIGJ1dCBub3QgaGVyZSBhbmQgbm93LiBUaGlzIGZ1bmN0aW9uIGlzIHR5cGljYWxseSBjYWxsZWQgaW4gdGhlIG1pZGRsZSBvZlxuICogcGFnZSBzZXR1cCwgd2hlbiBzdHlsZSBjaGFuZ2VzIGFyZSBzdGlsbCBwZW5kaW5nLCBhbmQgYXNraW5nIGZvciB0aGUgc2Nyb2xsIHBvc2l0aW9uXG4gKiB0aGVuIGZvcmNlcyB0aGUgYnJvd3NlciB0byByZWNhbGN1bGF0ZSB0aGUgd2hvbGUgcGFnZSdzIHN0eWxlcyBqdXN0IHRvIGFuc3dlci4gVGhlXG4gKiBjaGVjayBpbnN0ZWFkIHdhaXRzIGZvciB0aGUgbmV4dCBwYWludCAocmVhZExheW91dEFmdGVyUGFpbnQpLCB3aGVuIHRoZSBhbnN3ZXIgaXMgZnJlZS5cbiAqXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBTZXR1cCB0byBydW4gYXQgdGhlIGZpcnN0IHNjcm9sbCwgb3Igc2hvcnRseSBhZnRlciB0aGUgbmV4dCBwYWludCBpZlxuICogdGhlIHBhZ2UgaXMgYWxyZWFkeSBzY3JvbGxlZCBieSB0aGVuLlxuICogQHJldHVybnMgQSBmdW5jdGlvbiB0aGF0IGNhbmNlbHMgdGhlIHdhaXQsIGlmIHRoZSBzY3JvbGwgaGFzIG5vdCBoYXBwZW5lZCB5ZXQuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGNhbmNlbFdhaXQgPSBvbkZpcnN0U2Nyb2xsKCgpID0+IHN0YXJ0VHJhY2tpbmdTY3JvbGxQb3NpdGlvbigpKTtcbiAqIGNsZWFudXAoKCkgPT4gY2FuY2VsV2FpdCgpKTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9uRmlyc3RTY3JvbGwoY2FsbGJhY2spIHtcbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIGNvbnN0IHJ1biA9ICgpID0+IHtcbiAgICAgICAgaWYgKGRvbmUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgcnVuKTtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICB9O1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBydW4sIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcbiAgICAvLyBUaGUgcG9zaXRpb24gaXMgcmVhZCBpbiB0aGUgc2hhcmVkIHJlYWQgYmF0Y2ggKHdoZXJlIGl0IGlzIGZyZWUpLCBidXQgdGhlIGNhbGxiYWNrXG4gICAgLy8gcnVucyBhZnRlciB0aGUgd2hvbGUgYmF0Y2gg4oCUIGl0IHVzdWFsbHkga2lja3Mgb2ZmIHN0eWxlIHdyaXRlcywgd2hpY2ggbXVzdCBub3QgbGFuZFxuICAgIC8vIGJldHdlZW4gb3RoZXIgY29tcG9uZW50cycgYmF0Y2hlZCByZWFkcy5cbiAgICByZWFkTGF5b3V0QWZ0ZXJQYWludCgoKSA9PiB3aW5kb3cuc2Nyb2xsWSAhPT0gMCkudGhlbigoaGFzU2Nyb2xsZWQpID0+IHtcbiAgICAgICAgaWYgKGhhc1Njcm9sbGVkKVxuICAgICAgICAgICAgcnVuKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBydW4pO1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gY2FuY2VsSWRsZUNhbGxiYWNrKGlkKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuY2FuY2VsSWRsZUNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuY2FuY2VsSWRsZUNhbGxiYWNrKGlkKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQoaWQpO1xuICAgIH1cbn1cbiIsIi8qKlxuICogTG9ncyBhIGNsZWFyLCBhY3Rpb25hYmxlIGNvbnNvbGUgZXJyb3Igd2hlbiBhIE1ldGhvZCBVSSBkaXJlY3RpdmUgaXMgdXNlZFxuICogd2l0aG91dCBhIHBhcmVudCBkaXJlY3RpdmUgaXQgZGVwZW5kcyBvbi5cbiAqXG4gKiBNYW55IGRpcmVjdGl2ZXMgb25seSB3b3JrIHdoZW4gbmVzdGVkIGluc2lkZSBhIHBhcmVudCBkaXJlY3RpdmUgdGhhdCBzZXRzIHVwXG4gKiBzaGFyZWQgc3RhdGUgb24gdGhlIEFscGluZSBzY29wZSAoZS5nLiBgeC1vdmVyZmxvdzpzdGFydGAgbmVlZHMgYW4gYW5jZXN0b3JcbiAqIGB4LW92ZXJmbG93YCkuIFdoZW4gdGhhdCBwYXJlbnQgaXMgbWlzc2luZywgdGhlIHJhdyBmYWlsdXJlIGlzIGFuIGluc2NydXRhYmxlXG4gKiBgdGhpcy5fX2ZvbyBpcyBub3QgYSBmdW5jdGlvbmAuIENhbGwgdGhpcyBpbnN0ZWFkIHNvIHVzZXJzIGdldCBhIG1lc3NhZ2UgdGhhdFxuICogZXhwbGFpbnMgd2hhdCB0byBkby5cbiAqXG4gKiBAcGFyYW0gY2hpbGREaXJlY3RpdmUgLSBUaGUgZGlyZWN0aXZlIGJlaW5nIHVzZWQsIGUuZy4gYCd4LW92ZXJmbG93OnN0YXJ0J2AuXG4gKiBAcGFyYW0gcGFyZW50RGlyZWN0aXZlIC0gVGhlIHBhcmVudCBkaXJlY3RpdmUgcmVxdWlyZWQsIGUuZy4gYCd4LW92ZXJmbG93J2AuXG4gKiBAcGFyYW0gZWwgLSBUaGUgZWxlbWVudCB0aGUgY2hpbGQgZGlyZWN0aXZlIGlzIG9uLCBsb2dnZWQgZm9yIGNvbnRleHQuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYHRzXG4gKiBpZiAodHlwZW9mIHRoaXMuX19vdmVyZmxvd19yZWdpc3RlckJvdW5kYXJ5ICE9PSAnZnVuY3Rpb24nKSB7XG4gKiAgIHdhcm5NaXNzaW5nUGFyZW50RGlyZWN0aXZlKGB4LW92ZXJmbG93OiR7dmFsdWV9YCwgJ3gtb3ZlcmZsb3cnLCAkZWwpO1xuICogICByZXR1cm47XG4gKiB9XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdhcm5NaXNzaW5nUGFyZW50RGlyZWN0aXZlKGNoaWxkRGlyZWN0aXZlLCBwYXJlbnREaXJlY3RpdmUsIGVsKSB7XG4gICAgY29uc29sZS5lcnJvcihgQ2Fubm90IHVzZSAke2NoaWxkRGlyZWN0aXZlfSB3aXRob3V0IGEgcGFyZW50IGVsZW1lbnQgaGF2aW5nICR7cGFyZW50RGlyZWN0aXZlfS5gLCBlbCk7XG59XG5leHBvcnQgZnVuY3Rpb24gcHJldHR5UHJpbnRFcnJvcihlcnIpIHtcbiAgICBsZXQgb3V0cHV0ID0gJyc7XG4gICAgaWYgKHR5cGVvZiBlcnIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG91dHB1dCA9IGVycjtcbiAgICB9XG4gICAgZWxzZSBpZiAoZXJyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgb3V0cHV0ID0gZXJyLm1lc3NhZ2U7XG4gICAgfVxuICAgIGVsc2UgaWYgKGVyciAmJiB0eXBlb2YgZXJyLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG91dHB1dCA9IGVyci50b1N0cmluZygpO1xuICAgIH1cbiAgICBlbHNlIGlmIChlcnIgJiYgdHlwZW9mIGVyci5tZXNzYWdlID09PSAnc3RyaW5nJykge1xuICAgICAgICBvdXRwdXQgPSBlcnIubWVzc2FnZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG91dHB1dCA9ICdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkLic7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG59XG4iLCIvKipcbiAqIFJldHVybnMgdGhlIHRva2VuIHRoYXQgZm9sbG93cyBhIGRpcmVjdGl2ZSBtb2RpZmllciBuYW1lLlxuICpcbiAqIEBleGFtcGxlXG4gKiBnZXRNb2RpZmllclZhbHVlKFsnc3BlZWQnLCAnNjAnXSwgJ3NwZWVkJyk7XG4gKiAvLyA9PiAnNjAnXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKSB7XG4gICAgdmFyIF9hO1xuICAgIGNvbnN0IG1vZGlmaWVySW5kZXggPSBtb2RpZmllcnMuaW5kZXhPZihtb2RpZmllck5hbWUpO1xuICAgIGlmIChtb2RpZmllckluZGV4ID09PSAtMSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIChfYSA9IG1vZGlmaWVyc1ttb2RpZmllckluZGV4ICsgMV0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG51bGw7XG59XG4vKipcbiAqIFJldHVybnMgYSBudW1lcmljIG1vZGlmaWVyIHZhbHVlIHdoZW4gaXQgY2FuIGJlIHBhcnNlZCBhcyBhIGZpbml0ZSBudW1iZXIuXG4gKlxuICogQGV4YW1wbGVcbiAqIGdldE51bWJlck1vZGlmaWVyVmFsdWUoWydzcGVlZCcsICctNjAnXSwgJ3NwZWVkJyk7XG4gKiAvLyA9PiAtNjBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE51bWJlck1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpIHtcbiAgICBjb25zdCByYXdNb2RpZmllclZhbHVlID0gZ2V0TW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIG1vZGlmaWVyTmFtZSk7XG4gICAgaWYgKHJhd01vZGlmaWVyVmFsdWUgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgcGFyc2VkTW9kaWZpZXJWYWx1ZSA9IE51bWJlcihyYXdNb2RpZmllclZhbHVlKTtcbiAgICBpZiAoIU51bWJlci5pc0Zpbml0ZShwYXJzZWRNb2RpZmllclZhbHVlKSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHBhcnNlZE1vZGlmaWVyVmFsdWU7XG59XG4vKipcbiAqIFJldHVybnMgYSBwb3NpdGl2ZSBudW1lcmljIG1vZGlmaWVyIHZhbHVlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBnZXRQb3NpdGl2ZU51bWJlck1vZGlmaWVyVmFsdWUoWydzdGlmZm5lc3MnLCAnMjQwJ10sICdzdGlmZm5lc3MnKTtcbiAqIC8vID0+IDI0MFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UG9zaXRpdmVOdW1iZXJNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKSB7XG4gICAgY29uc3QgcGFyc2VkTW9kaWZpZXJWYWx1ZSA9IGdldE51bWJlck1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpO1xuICAgIGlmIChwYXJzZWRNb2RpZmllclZhbHVlID09IG51bGwgfHwgcGFyc2VkTW9kaWZpZXJWYWx1ZSA8PSAwKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gcGFyc2VkTW9kaWZpZXJWYWx1ZTtcbn1cbi8qKlxuICogUmV0dXJucyBhbiBgbXNgIG1vZGlmaWVyIHZhbHVlIGFzIGEgbnVtYmVyLlxuICpcbiAqIEBleGFtcGxlXG4gKiBnZXRNaWxsaXNlY29uZHNNb2RpZmllclZhbHVlKFsnZHVyYXRpb24nLCAnNTAwbXMnXSwgJ2R1cmF0aW9uJyk7XG4gKiAvLyA9PiA1MDBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1pbGxpc2Vjb25kc01vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpIHtcbiAgICBjb25zdCByYXdNb2RpZmllclZhbHVlID0gZ2V0TW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIG1vZGlmaWVyTmFtZSk7XG4gICAgaWYgKHJhd01vZGlmaWVyVmFsdWUgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgbWlsbGlzZWNvbmRzTWF0Y2ggPSByYXdNb2RpZmllclZhbHVlLm1hdGNoKC9eKFswLTldKyltcyQvKTtcbiAgICBpZiAoIW1pbGxpc2Vjb25kc01hdGNoKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gTnVtYmVyKG1pbGxpc2Vjb25kc01hdGNoWzFdKTtcbn1cbi8qKlxuICogUmV0dXJucyBhIGAlYCBtb2RpZmllciB2YWx1ZSBhcyBhIG51bWJlci5cbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0UGVyY2VudGFnZU1vZGlmaWVyVmFsdWUoWydwcm9ncmVzcycsICc1MCUnXSwgJ3Byb2dyZXNzJyk7XG4gKiAvLyA9PiA1MFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGVyY2VudGFnZU1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpIHtcbiAgICBjb25zdCByYXdNb2RpZmllclZhbHVlID0gZ2V0TW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIG1vZGlmaWVyTmFtZSk7XG4gICAgaWYgKHJhd01vZGlmaWVyVmFsdWUgPT0gbnVsbClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgcGVyY2VudGFnZU1hdGNoID0gcmF3TW9kaWZpZXJWYWx1ZS5tYXRjaCgvXihbMC05XSspJSQvKTtcbiAgICBpZiAoIXBlcmNlbnRhZ2VNYXRjaClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIE51bWJlcihwZXJjZW50YWdlTWF0Y2hbMV0pO1xufVxuLyoqXG4gKiBSZXR1cm5zIGEgYHB4YCBtb2RpZmllciB2YWx1ZSBhcyBhIG51bWJlci5cbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0UGl4ZWxNb2RpZmllclZhbHVlKFsnb2Zmc2V0JywgJy0xMnB4J10sICdvZmZzZXQnKTtcbiAqIC8vID0+IC0xMlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGl4ZWxNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lKSB7XG4gICAgY29uc3QgcmF3TW9kaWZpZXJWYWx1ZSA9IGdldE1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpO1xuICAgIGlmIChyYXdNb2RpZmllclZhbHVlID09IG51bGwpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHBpeGVsTWF0Y2ggPSByYXdNb2RpZmllclZhbHVlLm1hdGNoKC9eKC0/WzAtOV0rKXB4JC8pO1xuICAgIGlmICghcGl4ZWxNYXRjaClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIE51bWJlcihwaXhlbE1hdGNoWzFdKTtcbn1cbiIsImltcG9ydCB7IGdldE1vZGlmaWVyVmFsdWUsIGdldFBvc2l0aXZlTnVtYmVyTW9kaWZpZXJWYWx1ZSB9IGZyb20gJy4vYmFzZSc7XG5jb25zdCBERUZBVUxUX01JTl9TUFJJTkdfTUFTUyA9IDAuMDE7XG4vKipcbiAqIFJldHVybnMgYSBzcHJpbmcgbWFzcyBtb2RpZmllciB2YWx1ZSB1c2luZyBhIG1pbmltdW0gbWFzcyBhcyB0aGUgc2NhbGUgdW5pdC5cbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0TWFzc01vZGlmaWVyVmFsdWUoWydtYXNzJywgJzAnXSwgJ21hc3MnKTtcbiAqIC8vID0+IDAuMDFcbiAqXG4gKiBAZXhhbXBsZVxuICogZ2V0TWFzc01vZGlmaWVyVmFsdWUoWydtYXNzJywgJzIwJ10sICdtYXNzJyk7XG4gKiAvLyA9PiAwLjJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hc3NNb2RpZmllclZhbHVlKG1vZGlmaWVycywgbW9kaWZpZXJOYW1lLCBtaW5pbXVtTWFzcyA9IERFRkFVTFRfTUlOX1NQUklOR19NQVNTKSB7XG4gICAgY29uc3QgcmF3TW9kaWZpZXJWYWx1ZSA9IGdldE1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBtb2RpZmllck5hbWUpO1xuICAgIGlmIChyYXdNb2RpZmllclZhbHVlID09IG51bGwpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHBhcnNlZE1vZGlmaWVyVmFsdWUgPSBOdW1iZXIocmF3TW9kaWZpZXJWYWx1ZSk7XG4gICAgaWYgKE51bWJlci5pc05hTihwYXJzZWRNb2RpZmllclZhbHVlKSB8fCBwYXJzZWRNb2RpZmllclZhbHVlIDwgMClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgaWYgKHBhcnNlZE1vZGlmaWVyVmFsdWUgPT09IDApXG4gICAgICAgIHJldHVybiBtaW5pbXVtTWFzcztcbiAgICByZXR1cm4gcGFyc2VkTW9kaWZpZXJWYWx1ZSAqIG1pbmltdW1NYXNzO1xufVxuLyoqXG4gKiBBcHBsaWVzIGAubWFzc2AsIGAuc3RpZmZuZXNzYCwgYW5kIGAuZGFtcGluZ2AgZGlyZWN0aXZlIG1vZGlmaWVycyB0byBhIHNwcmluZyBjb25maWcuXG4gKlxuICogQGV4YW1wbGVcbiAqIGdldFNwcmluZ01vZGlmaWVyQ29uZmlnKFsnbWFzcycsICcyMCcsICdzdGlmZm5lc3MnLCAnMTgwJ10sIHttYXNzOiAwLjUsIHN0aWZmbmVzczogMjAwLCBkYW1waW5nOiAzMH0pO1xuICogLy8gPT4ge21hc3M6IDAuMiwgc3RpZmZuZXNzOiAxODAsIGRhbXBpbmc6IDMwfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3ByaW5nTW9kaWZpZXJDb25maWcobW9kaWZpZXJzLCBkZWZhdWx0U3ByaW5nQ29uZmlnLCBtaW5pbXVtTWFzcyA9IERFRkFVTFRfTUlOX1NQUklOR19NQVNTKSB7XG4gICAgY29uc3Qgc3ByaW5nQ29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdFNwcmluZ0NvbmZpZyk7XG4gICAgY29uc3QgcGFyc2VkTWFzcyA9IGdldE1hc3NNb2RpZmllclZhbHVlKG1vZGlmaWVycywgJ21hc3MnLCBtaW5pbXVtTWFzcyk7XG4gICAgaWYgKHBhcnNlZE1hc3MgIT09IG51bGwpXG4gICAgICAgIHNwcmluZ0NvbmZpZy5tYXNzID0gcGFyc2VkTWFzcztcbiAgICBjb25zdCBwYXJzZWRTdGlmZm5lc3MgPSBnZXRQb3NpdGl2ZU51bWJlck1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCAnc3RpZmZuZXNzJyk7XG4gICAgaWYgKHBhcnNlZFN0aWZmbmVzcyAhPT0gbnVsbClcbiAgICAgICAgc3ByaW5nQ29uZmlnLnN0aWZmbmVzcyA9IHBhcnNlZFN0aWZmbmVzcztcbiAgICBjb25zdCBwYXJzZWREYW1waW5nID0gZ2V0UG9zaXRpdmVOdW1iZXJNb2RpZmllclZhbHVlKG1vZGlmaWVycywgJ2RhbXBpbmcnKTtcbiAgICBpZiAocGFyc2VkRGFtcGluZyAhPT0gbnVsbClcbiAgICAgICAgc3ByaW5nQ29uZmlnLmRhbXBpbmcgPSBwYXJzZWREYW1waW5nO1xuICAgIHJldHVybiBzcHJpbmdDb25maWc7XG59XG4iLCJpbXBvcnQgeyBzcHJpbmdWYWx1ZSwgc3R5bGVFZmZlY3QgfSBmcm9tICdtb3Rpb24nO1xuaW1wb3J0IHsgZ2V0U3ByaW5nTW9kaWZpZXJDb25maWcgfSBmcm9tICcuLi91dGlscy9tb2RpZmllcnMnO1xuaW1wb3J0IHsgb25GaXJzdExheW91dCB9IGZyb20gJy4uL3V0aWxzL2xheW91dC1tZWFzdXJlJztcbmltcG9ydCB7IGlzVG91Y2hPbmx5RGV2aWNlIH0gZnJvbSAnLi4vdXRpbHMvZG9tJztcbmltcG9ydCB7IHdhcm5NaXNzaW5nUGFyZW50RGlyZWN0aXZlIH0gZnJvbSAnLi4vdXRpbHMvZXJyb3InO1xuY29uc3QgTUlOX01BU1MgPSAwLjAxO1xuY29uc3QgU1BSSU5HX0RFRkFVTFRfQ09ORklHID0ge1xuICAgIHN0aWZmbmVzczogMTIwLFxuICAgIG1hc3M6IE1JTl9NQVNTLFxufTtcbi8qKlxuICogUGx1Z2luIHRvIGNyZWF0ZSBhIGN1c3RvbSBjdXJzb3IgdGhhdCBmb2xsb3dzIHRoZSBtb3VzZSB3aXRoIHNwcmluZyBwaHlzaWNzLFxuICogc25hcHMgdG8gc25hcCBwb2ludHMsIGFuZCBzdXBwb3J0cyBuYW1lZCBjdXJzb3IgdmFyaWFudHMuXG4gKlxuICogSW5zcGlyZWQgYnkgaHR0cHM6Ly9tZWRpdW0uY29tLzE0aXNsYW5kcy9kZXZlbG9waW5nLWEtcGVyZm9ybWFudC1jdXN0b20tY3Vyc29yLTg5ZjE2ODhhMDJlYlxuICpcbiAqICMjIFRvdWNoIGRldmljZXNcbiAqXG4gKiBPbiBhIGRldmljZSB3aG9zZSBtYWluIHBvaW50ZXIgY2Fubm90IGhvdmVyIChhIHBob25lIG9yIHRhYmxldCkgZXZlcnkgZGlyZWN0aXZlIGJlbG93XG4gKiBkb2VzIG5vdGhpbmcgYXQgYWxsIOKAlCBubyBzdGF0ZSwgbm8gc3ByaW5nIGFuaW1hdGlvbnMsIG5vIG1vdXNlIGxpc3RlbmVycy4gYCRjdXN0b21DdXJzb3JgXG4gKiBzdGlsbCByZWFkcyBzYWZlbHkgdGhlcmUsIHJldHVybmluZyBgdW5kZWZpbmVkYCBmb3IgZWFjaCB2YWx1ZSwgc28gbWFya3VwIHRoYXQgYmluZHMgdG9cbiAqIGl0IGtlZXBzIHdvcmtpbmcuIEhpZGUgdGhlIGN1cnNvciBlbGVtZW50cyB0aGVtc2VsdmVzIHdpdGggQ1NTIGZvciB0aG9zZSBkZXZpY2VzLlxuICpcbiAqICMjIERpcmVjdGl2ZXNcbiAqXG4gKiAtIGB4LWN1c3RvbS1jdXJzb3JgIOKAlCBSb290IGVsZW1lbnQuIFRyYWNrcyBtb3VzZSBlbnRlci9sZWF2ZS9tb3ZlLlxuICogLSBgeC1jdXN0b20tY3Vyc29yOmVsZW1lbnRgIOKAlCBDdXJzb3IgZWxlbWVudCwgcG9zaXRpb25lZCB2aWEgc3ByaW5nLWFuaW1hdGVkIHRyYW5zbGF0ZVgvWS5cbiAqICAgQWNjZXB0cyBhbiBvcHRpb25hbCBuYW1lIChlLmcuIGB4LWN1c3RvbS1jdXJzb3I6ZWxlbWVudD1cInBsdXNcImApIGZvciBuYW1lZCBjdXJzb3JzLlxuICogICBVbm5hbWVkIGVsZW1lbnRzIGFjdCBhcyB0aGUgZGVmYXVsdCBjdXJzb3IuXG4gKiAtIGB4LWN1c3RvbS1jdXJzb3I6c25hcC1wb2ludGAg4oCUIFNuYXBzIHRoZSBjdXJzb3IgdG8gdGhpcyBlbGVtZW50J3MgY2VudGVyIG9uIGhvdmVyLlxuICpcbiAqICMjIFNwcmluZyBtb2RpZmllcnMgKG9uIGB4LWN1c3RvbS1jdXJzb3I6ZWxlbWVudGApXG4gKlxuICogLSBgLm1hc3MuPG4+YCDigJQgU3ByaW5nIG1hc3MgKGRlZmF1bHQ6IHtAbGluayBTUFJJTkdfREVGQVVMVF9DT05GSUd9KS4gSGlnaGVyID0gaGVhdmllci9zbG93ZXIuXG4gKiAtIGAuc3RpZmZuZXNzLjxuPmAg4oCUIFNwcmluZyBzdGlmZm5lc3MuIEhpZ2hlciA9IHNuYXBwaWVyLlxuICogLSBgLmRhbXBpbmcuPG4+YCDigJQgU3ByaW5nIGRhbXBpbmcuIEhpZ2hlciA9IGxlc3Mgb3NjaWxsYXRpb24uXG4gKlxuICogIyMgRGF0YSBhdHRyaWJ1dGVzIChvbiBkZXNjZW5kYW50IGVsZW1lbnRzIGluc2lkZSB0aGUgcm9vdClcbiAqXG4gKiAtIGBkYXRhLWN1c3RvbS1jdXJzb3I9XCI8bmFtZT5cImAg4oCUIFNob3dzIHRoZSBuYW1lZCBjdXJzb3Igd2hlbiBob3ZlcmluZyB0aGlzIGVsZW1lbnQuXG4gKiAtIGBkYXRhLWhpZGUtY3VzdG9tLWN1cnNvcmAg4oCUIEhpZGVzIGFsbCBjdXJzb3JzIHdoZW4gaG92ZXJpbmcgdGhpcyBlbGVtZW50LlxuICpcbiAqICMjIFJlYWN0aXZlIGRhdGEgYXR0cmlidXRlcyAoc2V0IGF1dG9tYXRpY2FsbHkgb24gY3Vyc29yL3NuYXAtcG9pbnQgZWxlbWVudHMpXG4gKlxuICogLSBgZGF0YS1hY3RpdmVgIOKAlCBQcmVzZW50IG9uIGEgY3Vyc29yIGVsZW1lbnQgd2hlbiBpdCBpcyB0aGUgY3VycmVudGx5IGFjdGl2ZSBjdXJzb3IuXG4gKiAtIGBkYXRhLWhpZGRlbmAg4oCUIFByZXNlbnQgd2hlbiB0aGUgY3Vyc29yIGlzIG92ZXIgYSBgZGF0YS1oaWRlLWN1c3RvbS1jdXJzb3JgIHpvbmVcbiAqICAgb3Igd2hlbiB0aGUgY3Vyc29yIGVsZW1lbnQgd291bGQgb3ZlcmZsb3cgdGhlIHJvb3QgYm91bmRzLlxuICogLSBgZGF0YS1zbmFwcGVkYCDigJQgUHJlc2VudCB3aGVuIHRoZSBjdXJzb3IgaXMgc25hcHBlZCB0byBhIHNuYXAgcG9pbnQuXG4gKlxuICogIyMgTWFnaWM6IGAkY3VzdG9tQ3Vyc29yYFxuICpcbiAqIC0gYCRjdXN0b21DdXJzb3IuaXNBY3RpdmVgIOKAlCBXaGV0aGVyIHRoZSBjdXJzb3IgaXMgaW5zaWRlIHRoZSByb290LlxuICogLSBgJGN1c3RvbUN1cnNvci5pc1NuYXBwZWRgIOKAlCBXaGV0aGVyIHRoZSBjdXJzb3IgaXMgc25hcHBlZCB0byBhIHNuYXAgcG9pbnQuXG4gKiAtIGAkY3VzdG9tQ3Vyc29yLmlzSGlkZGVuYCDigJQgV2hldGhlciB0aGUgY3Vyc29yIGlzIGluIGEgaGlkZSB6b25lLlxuICogLSBgJGN1c3RvbUN1cnNvci50YXJnZXRQb3NpdGlvbmAg4oCUIEN1cnJlbnQgdGFyZ2V0IGB7eCwgeX1gIGluIHZpZXdwb3J0IGNvb3JkaW5hdGVzLlxuICogLSBgJGN1c3RvbUN1cnNvci5zbmFwKGVsKWAg4oCUIFByb2dyYW1tYXRpY2FsbHkgc25hcCB0byBhbiBlbGVtZW50LlxuICogLSBgJGN1c3RvbUN1cnNvci51bnNuYXAoKWAg4oCUIFByb2dyYW1tYXRpY2FsbHkgdW5zbmFwLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogYGBgaHRtbFxuICogPGRpdiB4LWN1c3RvbS1jdXJzb3I+XG4gKiAgIDxkaXYgeC1jdXN0b20tY3Vyc29yOmVsZW1lbnQgY2xhc3M9XCJmaXhlZCB0b3AtMCBsZWZ0LTAgdy01IGgtNSBiZy1yZWQtNTAwXCI+PC9kaXY+XG4gKiAgIDxkaXYgeC1jdXN0b20tY3Vyc29yOmVsZW1lbnQubWFzcy4yMD1cInBsdXNcIiBjbGFzcz1cImZpeGVkIHRvcC0wIGxlZnQtMCB3LTggaC04IGJnLWJsdWUtNTAwXCI+PC9kaXY+XG4gKiAgIDxkaXYgeC1jdXN0b20tY3Vyc29yOnNuYXAtcG9pbnQgY2xhc3M9XCJhYnNvbHV0ZSB0b3AtMS8yIGxlZnQtMS8yIHctMTIgaC0xMlwiPjwvZGl2PlxuICogICA8ZGl2IGRhdGEtY3VzdG9tLWN1cnNvcj1cInBsdXNcIj5Ib3ZlciBmb3IgcGx1cyBjdXJzb3I8L2Rpdj5cbiAqICAgPGRpdiBkYXRhLWhpZGUtY3VzdG9tLWN1cnNvcj5Ib3ZlciB0byBoaWRlIGN1cnNvcjwvZGl2PlxuICogPC9kaXY+XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKEFscGluZSkge1xuICAgIEFscGluZS5kaXJlY3RpdmUoJ2N1c3RvbS1jdXJzb3InLCAoJGVsLCBkYXRhKSA9PiB7XG4gICAgICAgIC8vIEEgY3VzdG9tIGN1cnNvciBleGlzdHMgb25seSB0byBzdGFuZCBpbiBmb3IgYSBtb3VzZSBwb2ludGVyLCBzbyB0aGVyZSBpcyBub3RoaW5nXG4gICAgICAgIC8vIGZvciBpdCB0byBkbyBvbiBhIHRvdWNoIGRldmljZS4gRXZlcnkgcGFydCBvZiB0aGUgZGlyZWN0aXZlIGJhaWxzIG91dCBoZXJlLCBiZWZvcmVcbiAgICAgICAgLy8gYW55IG9mIHRoZW0gc2V0IHVwIHNwcmluZyBhbmltYXRpb25zLCBzdHlsZSBlZmZlY3RzLCBsYXlvdXQgcmVhZHMgb3IgbW91c2VcbiAgICAgICAgLy8gbGlzdGVuZXJzLiBUaGVtZXMgYWxyZWFkeSBoaWRlIHRoZSBjdXJzb3IgZWxlbWVudHMgdGhlbXNlbHZlcyBvbiB0b3VjaCBkZXZpY2VzXG4gICAgICAgIC8vIHdpdGggQ1NTLCBzbyBub3RoaW5nIGJlY29tZXMgdmlzaWJsZSBhcyBhIHJlc3VsdC5cbiAgICAgICAgaWYgKGlzVG91Y2hPbmx5RGV2aWNlKCkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmIChkYXRhLnZhbHVlID09PSAnZWxlbWVudCcpIHtcbiAgICAgICAgICAgIGhhbmRsZUVsZW1lbnQoJGVsLCBBbHBpbmUsIGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRhdGEudmFsdWUgPT09ICdzbmFwLXBvaW50Jykge1xuICAgICAgICAgICAgaGFuZGxlU25hcFBvaW50KCRlbCwgQWxwaW5lKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkYXRhLnZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICBoYW5kbGVSb290KCRlbCwgQWxwaW5lLCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBkaXJlY3RpdmU6IHgtY3VzdG9tLWN1cnNvcjoke2RhdGEudmFsdWV9YCk7XG4gICAgICAgIH1cbiAgICB9KS5iZWZvcmUoJ2JpbmQnKTtcbiAgICBBbHBpbmUubWFnaWMoJ2N1c3RvbUN1cnNvcicsICgkZWwpID0+IHtcbiAgICAgICAgY29uc3QgJGRhdGEgPSBBbHBpbmUuJGRhdGEoJGVsKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGdldCBpc1NuYXBwZWQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRkYXRhLl9fY3VzdG9tQ3Vyc29yX2lzU25hcHBlZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXQgaXNIaWRkZW4oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRkYXRhLl9fY3VzdG9tQ3Vyc29yX2lzSGlkZGVuO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldCBpc0FjdGl2ZSgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGRhdGEuX19jdXN0b21DdXJzb3JfaXNBY3RpdmU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0IHRhcmdldFBvc2l0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkZGF0YS5fX2N1c3RvbUN1cnNvcl90YXJnZXRQb3NpdGlvbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzbmFwKGVsKSB7XG4gICAgICAgICAgICAgICAgJGRhdGEuX19jdXN0b21DdXJzb3Jfc2V0Q3VycmVudFNuYXBQb2ludChlbCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdW5zbmFwKCkge1xuICAgICAgICAgICAgICAgICRkYXRhLl9fY3VzdG9tQ3Vyc29yX3Vuc2V0Q3VycmVudFNuYXBQb2ludCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGhhbmRsZUVsZW1lbnQoJGVsLCBBbHBpbmUsIGRhdGEpIHtcbiAgICBjb25zdCBjdXJzb3JOYW1lID0gZGF0YS5leHByZXNzaW9uIHx8IG51bGw7XG4gICAgY29uc3Qgc3ByaW5nQ29uZmlnID0gZ2V0U3ByaW5nTW9kaWZpZXJDb25maWcoZGF0YS5tb2RpZmllcnMsIFNQUklOR19ERUZBVUxUX0NPTkZJRywgTUlOX01BU1MpO1xuICAgIEFscGluZS5iaW5kKCRlbCwge1xuICAgICAgICAnYXJpYS1oaWRkZW4nOiAndHJ1ZScsXG4gICAgICAgICd4LWRhdGEnKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBfX2N1c3RvbUN1cnNvcl9jdXJzb3JFbF94VmFsdWU6IG51bGwsXG4gICAgICAgICAgICAgICAgX19jdXN0b21DdXJzb3JfY3Vyc29yRWxfeVZhbHVlOiBudWxsLFxuICAgICAgICAgICAgICAgIF9fY3VzdG9tQ3Vyc29yX2N1cnNvckVsX3N0b3BTdHlsZUVmZmVjdDogbnVsbCxcbiAgICAgICAgICAgICAgICBfX2N1c3RvbUN1cnNvcl9jdXJzb3JFbF9kaW1lbnNpb25zOiBudWxsLFxuICAgICAgICAgICAgICAgIF9fY3VzdG9tQ3Vyc29yX2N1cnNvckVsX2NhbmNlbEZpcnN0TGF5b3V0OiBudWxsLFxuICAgICAgICAgICAgICAgIGluaXQoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy4kZGF0YS5fX2N1c3RvbUN1cnNvcl9yb290RWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhcm5NaXNzaW5nUGFyZW50RGlyZWN0aXZlKCd4LWN1c3RvbS1jdXJzb3I6ZWxlbWVudCcsICd4LWN1c3RvbS1jdXJzb3InLCB0aGlzLiRlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gb25GaXJzdExheW91dCBmaXJlcyBwb3N0LWxheW91dCwgcHJlLXBhaW50OiByZWFkcyBhcmUgZnJlZSBhbmQgdGhlIHN0eWxlRWZmZWN0XG4gICAgICAgICAgICAgICAgICAgIC8vIGJlbG93IHN0aWxsIGFwcGxpZXMgaW4gdGhlIHNhbWUgZnJhbWUncyBwYWludC5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2N1c3RvbUN1cnNvcl9jdXJzb3JFbF9jYW5jZWxGaXJzdExheW91dCA9IG9uRmlyc3RMYXlvdXQodGhpcy4kZWwsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19jdXN0b21DdXJzb3JfY3Vyc29yRWxfY2FuY2VsRmlyc3RMYXlvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2N1c3RvbUN1cnNvcl9jdXJzb3JFbF9kaW1lbnNpb25zID0geyB3aWR0aDogdGhpcy4kZWwuY2xpZW50V2lkdGgsIGhlaWdodDogdGhpcy4kZWwuY2xpZW50SGVpZ2h0IH07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB4VmFsdWUgPSBzcHJpbmdWYWx1ZSgwLCBzcHJpbmdDb25maWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeVZhbHVlID0gc3ByaW5nVmFsdWUoMCwgc3ByaW5nQ29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19jdXN0b21DdXJzb3JfY3Vyc29yRWxfeFZhbHVlID0geFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2N1c3RvbUN1cnNvcl9jdXJzb3JFbF95VmFsdWUgPSB5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fY3VzdG9tQ3Vyc29yX2N1cnNvckVsX3N0b3BTdHlsZUVmZmVjdCA9IHN0eWxlRWZmZWN0KHRoaXMuJGVsLCB7IHg6IHhWYWx1ZSwgeTogeVZhbHVlIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kd2F0Y2goJ19fY3VzdG9tQ3Vyc29yX3RhcmdldFBvc2l0aW9uJywgKHRhcmdldFBvc2l0aW9uLCBwcmV2aW91c1RhcmdldFBvc2l0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldFBvc2l0aW9uID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeFZhbHVlLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeVZhbHVlLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuX19jdXN0b21DdXJzb3JfY3Vyc29yRWxfZGltZW5zaW9ucztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gdGFyZ2V0UG9zaXRpb24ueCAtIHdpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB5ID0gdGFyZ2V0UG9zaXRpb24ueSAtIGhlaWdodCAvIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzVGFyZ2V0UG9zaXRpb24gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4VmFsdWUuanVtcCh4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeVZhbHVlLmp1bXAoeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4VmFsdWUuc2V0KHgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5VmFsdWUuc2V0KHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlc3Ryb3koKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZDtcbiAgICAgICAgICAgICAgICAgICAgKF9hID0gdGhpcy5fX2N1c3RvbUN1cnNvcl9jdXJzb3JFbF9jYW5jZWxGaXJzdExheW91dCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19jdXN0b21DdXJzb3JfY3Vyc29yRWxfY2FuY2VsRmlyc3RMYXlvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAoX2IgPSB0aGlzLl9fY3VzdG9tQ3Vyc29yX2N1cnNvckVsX3hWYWx1ZSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgKF9jID0gdGhpcy5fX2N1c3RvbUN1cnNvcl9jdXJzb3JFbF95VmFsdWUpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIChfZCA9IHRoaXMuX19jdXN0b21DdXJzb3JfY3Vyc29yRWxfc3RvcFN0eWxlRWZmZWN0KSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldCBfX2N1c3RvbUN1cnNvcl9pc0F0RWRnZSgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm9vdERhdGEgPSB0aGlzLiRkYXRhO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRQb3NpdGlvbiA9IHJvb3REYXRhLl9fY3VzdG9tQ3Vyc29yX3RhcmdldFBvc2l0aW9uO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaW1lbnNpb25zID0gdGhpcy5fX2N1c3RvbUN1cnNvcl9jdXJzb3JFbF9kaW1lbnNpb25zO1xuICAgICAgICAgICAgICAgICAgICAvLyBVc2UgdGhlIHJvb3QncyBjYWNoZWQgcmVjdCDigJQgbmV2ZXIgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGhlcmUuIEFscGluZVxuICAgICAgICAgICAgICAgICAgICAvLyByZS1ydW5zIHRoaXMgZ2V0dGVyIG9uIGV2ZXJ5IHRhcmdldFBvc2l0aW9uIGNoYW5nZSAoZWFjaCBtb3VzZW1vdmUpLCBhbmQgYVxuICAgICAgICAgICAgICAgICAgICAvLyBsYXlvdXQgcmVhZCBhZnRlciBgOnN0eWxlYCB3cml0ZXMgd291bGQgZm9yY2UgYSByZWZsb3cgZXZlcnkgZnJhbWUuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvb3RSZWN0ID0gcm9vdERhdGEuX19jdXN0b21DdXJzb3Jfcm9vdFJlY3Q7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0UG9zaXRpb24gfHwgIWRpbWVuc2lvbnMgfHwgIXJvb3RSZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBoYWxmVyA9IGRpbWVuc2lvbnMud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBoYWxmSCA9IGRpbWVuc2lvbnMuaGVpZ2h0IC8gMjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh0YXJnZXRQb3NpdGlvbi54IC0gaGFsZlcgPCByb290UmVjdC5sZWZ0IHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRQb3NpdGlvbi54ICsgaGFsZlcgPiByb290UmVjdC5yaWdodCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0UG9zaXRpb24ueSAtIGhhbGZIIDwgcm9vdFJlY3QudG9wIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRQb3NpdGlvbi55ICsgaGFsZkggPiByb290UmVjdC5ib3R0b20pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICAnOmRhdGEtYWN0aXZlJygpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvb3REYXRhID0gdGhpcy4kZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGlzTmFtZU1hdGNoID0gY3Vyc29yTmFtZSA9PSBudWxsXG4gICAgICAgICAgICAgICAgPyByb290RGF0YS5fX2N1c3RvbUN1cnNvcl9hY3RpdmVDdXJzb3JOYW1lID09IG51bGxcbiAgICAgICAgICAgICAgICA6IHJvb3REYXRhLl9fY3VzdG9tQ3Vyc29yX2FjdGl2ZUN1cnNvck5hbWUgPT09IGN1cnNvck5hbWU7XG4gICAgICAgICAgICBpZiAoIXJvb3REYXRhLl9fY3VzdG9tQ3Vyc29yX2lzQWN0aXZlIHx8ICFpc05hbWVNYXRjaClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfSxcbiAgICAgICAgJzpkYXRhLWhpZGRlbicoKSB7XG4gICAgICAgICAgICBjb25zdCByb290RGF0YSA9IHRoaXMuJGRhdGE7XG4gICAgICAgICAgICByZXR1cm4gcm9vdERhdGEuX19jdXN0b21DdXJzb3JfaXNIaWRkZW47XG4gICAgICAgIH0sXG4gICAgICAgICc6ZGF0YS1lZGdlJygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9fY3VzdG9tQ3Vyc29yX2lzQXRFZGdlO1xuICAgICAgICB9LFxuICAgICAgICAnOmRhdGEtc25hcHBlZCcoKSB7XG4gICAgICAgICAgICBjb25zdCByb290RGF0YSA9IHRoaXMuJGRhdGE7XG4gICAgICAgICAgICByZXR1cm4gcm9vdERhdGEuX19jdXN0b21DdXJzb3JfaXNTbmFwcGVkO1xuICAgICAgICB9LFxuICAgICAgICAnOnN0eWxlJygpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvb3REYXRhID0gdGhpcy4kZGF0YTtcbiAgICAgICAgICAgIGNvbnN0IGlzTmFtZU1hdGNoID0gY3Vyc29yTmFtZSA9PSBudWxsXG4gICAgICAgICAgICAgICAgPyByb290RGF0YS5fX2N1c3RvbUN1cnNvcl9hY3RpdmVDdXJzb3JOYW1lID09IG51bGxcbiAgICAgICAgICAgICAgICA6IHJvb3REYXRhLl9fY3VzdG9tQ3Vyc29yX2FjdGl2ZUN1cnNvck5hbWUgPT09IGN1cnNvck5hbWU7XG4gICAgICAgICAgICBpZiAodGhpcy5fX2N1c3RvbUN1cnNvcl9jdXJzb3JFbF94VmFsdWUgPT0gbnVsbCB8fFxuICAgICAgICAgICAgICAgIHRoaXMuX19jdXN0b21DdXJzb3JfY3Vyc29yRWxfZGltZW5zaW9ucyA9PSBudWxsIHx8XG4gICAgICAgICAgICAgICAgIXJvb3REYXRhLl9fY3VzdG9tQ3Vyc29yX2lzQWN0aXZlIHx8XG4gICAgICAgICAgICAgICAgIWlzTmFtZU1hdGNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbjogJ2xheW91dCcsXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6ICdoaWRkZW4nLFxuICAgICAgICAgICAgICAgICAgICAncG9pbnRlci1ldmVudHMnOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiAnNTAlIDUwJSAwJyxcbiAgICAgICAgICAgICAgICAnd2lsbC1jaGFuZ2UnOiAndHJhbnNmb3JtJyxcbiAgICAgICAgICAgICAgICBjb250YWluOiAnbGF5b3V0JyxcbiAgICAgICAgICAgICAgICAncG9pbnRlci1ldmVudHMnOiAnbm9uZScsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgIH0pO1xufVxuZnVuY3Rpb24gaGFuZGxlU25hcFBvaW50KCRlbCwgQWxwaW5lKSB7XG4gICAgLy8gQmFpbCBlYXJseSBpZiB3ZSdyZSBub3QgaW5zaWRlIG9mIHgtY3VzdG9tLWN1cnNvclxuICAgIGlmICghQWxwaW5lLiRkYXRhKCRlbCkuX19jdXN0b21DdXJzb3Jfcm9vdEVsKSB7XG4gICAgICAgIHdhcm5NaXNzaW5nUGFyZW50RGlyZWN0aXZlKCd4LWN1c3RvbS1jdXJzb3I6c25hcC1wb2ludCcsICd4LWN1c3RvbS1jdXJzb3InLCAkZWwpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIEFscGluZS5iaW5kKCRlbCwge1xuICAgICAgICAneC1kYXRhJygpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgX19jdXN0b21DdXJzb3Jfc25hcFBvaW50X2hhbmRsZU1vdXNlRW50ZXIoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGRhdGEuX19jdXN0b21DdXJzb3Jfc2V0Q3VycmVudFNuYXBQb2ludCh0aGlzLiRlbCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBfX2N1c3RvbUN1cnNvcl9zbmFwUG9pbnRfaGFuZGxlTW91c2VMZWF2ZSgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kZGF0YS5fX2N1c3RvbUN1cnNvcl91bnNldEN1cnJlbnRTbmFwUG9pbnQoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgJzpkYXRhLXNuYXBwZWQnKCkge1xuICAgICAgICAgICAgY29uc3Qgcm9vdERhdGEgPSB0aGlzLiRkYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHJvb3REYXRhLl9fY3VzdG9tQ3Vyc29yX2N1cnJlbnRTbmFwUG9pbnRFbCA9PT0gdGhpcy4kZWw7XG4gICAgICAgIH0sXG4gICAgICAgICd4LWhvdmVyOnN0YXJ0JzogJ19fY3VzdG9tQ3Vyc29yX3NuYXBQb2ludF9oYW5kbGVNb3VzZUVudGVyJyxcbiAgICAgICAgJ3gtaG92ZXI6ZW5kJzogJ19fY3VzdG9tQ3Vyc29yX3NuYXBQb2ludF9oYW5kbGVNb3VzZUxlYXZlJyxcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGJ1aWxkUG9zaXRpb24oeCwgeSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGhhbmRsZVJvb3QoJGVsLCBBbHBpbmUsIGRhdGEpIHtcbiAgICBBbHBpbmUuYmluZCgkZWwsIHtcbiAgICAgICAgJ3gtZGF0YScoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIF9fY3VzdG9tQ3Vyc29yX3Jvb3RFbDogJGVsLFxuICAgICAgICAgICAgICAgIF9fY3VzdG9tQ3Vyc29yX3Jvb3RSZWN0OiBudWxsLFxuICAgICAgICAgICAgICAgIF9fY3VzdG9tQ3Vyc29yX2lzQWN0aXZlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBfX2N1c3RvbUN1cnNvcl9pc0hpZGRlbjogZmFsc2UsXG4gICAgICAgICAgICAgICAgX19jdXN0b21DdXJzb3JfYWN0aXZlQ3Vyc29yTmFtZTogbnVsbCxcbiAgICAgICAgICAgICAgICBfX2N1c3RvbUN1cnNvcl9jdXJzb3JFbDogbnVsbCxcbiAgICAgICAgICAgICAgICBfX2N1c3RvbUN1cnNvcl9jdXJzb3JFbF9kaW1lbnNpb25zOiBudWxsLFxuICAgICAgICAgICAgICAgIF9fY3VzdG9tQ3Vyc29yX2N1cnJlbnRTbmFwUG9pbnRFbDogbnVsbCxcbiAgICAgICAgICAgICAgICBfX2N1c3RvbUN1cnNvcl9jdXJyZW50U25hcFBvaW50UmVjdDogbnVsbCxcbiAgICAgICAgICAgICAgICBfX2N1c3RvbUN1cnNvcl90YXJnZXRQb3NpdGlvbjogbnVsbCxcbiAgICAgICAgICAgICAgICBfX2N1c3RvbUN1cnNvcl9hYm9ydENvbnRyb2xsZXI6IG51bGwsXG4gICAgICAgICAgICAgICAgaW5pdCgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRmlyZSBldmVudHMgaWYgdGhlIHBvaW50ZXIgaXMgYWxyZWFkeSBpbnNpZGUgdGhlIGAkZWxgIG9uIG1vdW50XG4gICAgICAgICAgICAgICAgICAgIGlmICgkZWwubWF0Y2hlcygnOmhvdmVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19jdXN0b21DdXJzb3JfYXR0YWNoQWN0aXZlTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlc3Ryb3koKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICAgICAgKF9hID0gdGhpcy5fX2N1c3RvbUN1cnNvcl9hYm9ydENvbnRyb2xsZXIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hYm9ydCgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLy8gU2FmZSBpbiBwb2ludGVyIC8gc2Nyb2xsIC8gUmVzaXplT2JzZXJ2ZXIgaGFuZGxlcnMg4oCUIGxheW91dCBpcyBjbGVhbiBhdCB0aG9zZVxuICAgICAgICAgICAgICAgIC8vIHRpbWVzLiBLZXB0IG9mZiB0aGUgQWxwaW5lIHJlbmRlciBwYXRoIHNvIGA6ZGF0YS1lZGdlYCBuZXZlciBmb3JjZXMgYSByZWZsb3cuXG4gICAgICAgICAgICAgICAgX19jdXN0b21DdXJzb3JfdXBkYXRlUm9vdFJlY3QoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgbGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tIH0gPSAkZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19jdXN0b21DdXJzb3Jfcm9vdFJlY3QgPSB7IGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSB9O1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgX19jdXN0b21DdXJzb3Jfc2V0Q3VycmVudFNuYXBQb2ludChlbCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHgsIHksIHdpZHRoLCBoZWlnaHQgfSA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fY3VzdG9tQ3Vyc29yX2N1cnJlbnRTbmFwUG9pbnRFbCA9IGVsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fY3VzdG9tQ3Vyc29yX2N1cnJlbnRTbmFwUG9pbnRSZWN0ID0geyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH07XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBfX2N1c3RvbUN1cnNvcl91bnNldEN1cnJlbnRTbmFwUG9pbnQoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19jdXN0b21DdXJzb3JfY3VycmVudFNuYXBQb2ludEVsID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2N1c3RvbUN1cnNvcl9jdXJyZW50U25hcFBvaW50UmVjdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBfX2N1c3RvbUN1cnNvcl9oYW5kbGVNb3VzZU92ZXIoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGlkZUVsID0gdGFyZ2V0LmNsb3Nlc3QoJ1tkYXRhLWhpZGUtY3VzdG9tLWN1cnNvcl0nKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VzdG9tQ3Vyc29yRWwgPSB0YXJnZXQuY2xvc2VzdCgnW2RhdGEtY3VzdG9tLWN1cnNvcl0nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhpZGVFbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2N1c3RvbUN1cnNvcl9pc0hpZGRlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fY3VzdG9tQ3Vyc29yX2FjdGl2ZUN1cnNvck5hbWUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGN1c3RvbUN1cnNvckVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fY3VzdG9tQ3Vyc29yX2lzSGlkZGVuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fY3VzdG9tQ3Vyc29yX2FjdGl2ZUN1cnNvck5hbWUgPSBjdXN0b21DdXJzb3JFbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY3VzdG9tLWN1cnNvcicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2N1c3RvbUN1cnNvcl9pc0hpZGRlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2N1c3RvbUN1cnNvcl9hY3RpdmVDdXJzb3JOYW1lID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgX19jdXN0b21DdXJzb3JfaGFuZGxlTW91c2VFbnRlcihlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENhY2hlIHRoZSByb290IHJlY3QgYmVmb3JlIHdyaXRpbmcgdGFyZ2V0UG9zaXRpb24gc28gdGhlIGZpcnN0IGA6ZGF0YS1lZGdlYFxuICAgICAgICAgICAgICAgICAgICAvLyBldmFsdWF0aW9uIG5ldmVyIG1lYXN1cmVzIGxheW91dCBvbiB0aGUgQWxwaW5lIHJlbmRlciBwYXRoLlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fY3VzdG9tQ3Vyc29yX2F0dGFjaEFjdGl2ZUxpc3RlbmVycygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fY3VzdG9tQ3Vyc29yX3RhcmdldFBvc2l0aW9uID0gYnVpbGRQb3NpdGlvbihlLmNsaWVudFgsIGUuY2xpZW50WSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBfX2N1c3RvbUN1cnNvcl9hdHRhY2hBY3RpdmVMaXN0ZW5lcnMoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fY3VzdG9tQ3Vyc29yX2Fib3J0Q29udHJvbGxlcilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWMgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19jdXN0b21DdXJzb3JfYWJvcnRDb250cm9sbGVyID0gYWM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19jdXN0b21DdXJzb3JfdXBkYXRlUm9vdFJlY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVmlld3BvcnQtcmVsYXRpdmUgYm91bmRzIG1vdmUgb24gc2Nyb2xsIHdpdGhvdXQgYSBzaXplIGNoYW5nZSwgc29cbiAgICAgICAgICAgICAgICAgICAgLy8gUmVzaXplT2JzZXJ2ZXIgYWxvbmUgaXMgbm90IGVub3VnaC5cbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHRoaXMuX19jdXN0b21DdXJzb3JfdXBkYXRlUm9vdFJlY3QoKSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbmFsOiBhYy5zaWduYWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXB0dXJlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIENhdGNoZXMgdGhlIHJvb3QncyBvd24gc2l6ZSBjaGFuZ2VzICh3aW5kb3cgcmVzaXplLCBjb250ZW50LCBsYXlvdXQpLlxuICAgICAgICAgICAgICAgICAgICAvLyBSZXNpemVPYnNlcnZlciBjYWxsYmFja3MgcnVuIGFmdGVyIGxheW91dCDigJQgcmVhZHMgYXJlIGZyZWUuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc2l6ZU9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKCgpID0+IHRoaXMuX19jdXN0b21DdXJzb3JfdXBkYXRlUm9vdFJlY3QoKSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc2l6ZU9ic2VydmVyLm9ic2VydmUoJGVsKTtcbiAgICAgICAgICAgICAgICAgICAgYWMuc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgKCkgPT4gcmVzaXplT2JzZXJ2ZXIuZGlzY29ubmVjdCgpKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhc3RNb3ZlVGltZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICRlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub3cgLSBsYXN0TW92ZVRpbWUgPCAxNilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0TW92ZVRpbWUgPSBub3c7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fY3VzdG9tQ3Vyc29yX2hhbmRsZU1vdXNlTW92ZShlKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgeyBzaWduYWw6IGFjLnNpZ25hbCB9KTtcbiAgICAgICAgICAgICAgICAgICAgJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIChlKSA9PiB0aGlzLl9fY3VzdG9tQ3Vyc29yX2hhbmRsZU1vdXNlT3ZlcihlKSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbmFsOiBhYy5zaWduYWwsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIChlKSA9PiB0aGlzLl9fY3VzdG9tQ3Vyc29yX2hhbmRsZU1vdXNlTGVhdmUoZSksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ25hbDogYWMuc2lnbmFsLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF9fY3VzdG9tQ3Vyc29yX2hhbmRsZU1vdXNlTW92ZShlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19jdXN0b21DdXJzb3JfaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fX2N1c3RvbUN1cnNvcl9jdXJyZW50U25hcFBvaW50RWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgeDogc25hcFgsIHk6IHNuYXBZLCB3aWR0aDogc25hcFdpZHRoLCBoZWlnaHQ6IHNuYXBIZWlnaHQsIH0gPSB0aGlzLl9fY3VzdG9tQ3Vyc29yX2N1cnJlbnRTbmFwUG9pbnRSZWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc25hcFBvc2l0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IHNuYXBYICsgc25hcFdpZHRoIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBzbmFwWSArIHNuYXBIZWlnaHQgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19jdXN0b21DdXJzb3JfdGFyZ2V0UG9zaXRpb24gPSBzbmFwUG9zaXRpb247XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fY3VzdG9tQ3Vyc29yX3RhcmdldFBvc2l0aW9uID0gYnVpbGRQb3NpdGlvbihlLmNsaWVudFgsIGUuY2xpZW50WSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF9fY3VzdG9tQ3Vyc29yX2hhbmRsZU1vdXNlTGVhdmUoZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgICAgIChfYSA9IHRoaXMuX19jdXN0b21DdXJzb3JfYWJvcnRDb250cm9sbGVyKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuYWJvcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2N1c3RvbUN1cnNvcl9hYm9ydENvbnRyb2xsZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fY3VzdG9tQ3Vyc29yX2lzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19jdXN0b21DdXJzb3JfaXNIaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2N1c3RvbUN1cnNvcl9hY3RpdmVDdXJzb3JOYW1lID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2N1c3RvbUN1cnNvcl9jdXJyZW50U25hcFBvaW50RWwgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fY3VzdG9tQ3Vyc29yX3RhcmdldFBvc2l0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2N1c3RvbUN1cnNvcl9yb290UmVjdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXQgX19jdXN0b21DdXJzb3JfaXNTbmFwcGVkKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gISF0aGlzLl9fY3VzdG9tQ3Vyc29yX2N1cnJlbnRTbmFwUG9pbnRFbDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgJ0Btb3VzZWVudGVyJzogJ19fY3VzdG9tQ3Vyc29yX2hhbmRsZU1vdXNlRW50ZXInLFxuICAgIH0pO1xufVxuIiwiaW1wb3J0IEFscGluZSBmcm9tICdhbHBpbmVqcyc7XG5pbXBvcnQge2N1c3RvbUN1cnNvcn0gZnJvbSAnQGdyb3VwdGhvdWdodC9hc3NlbWJseS11aS9hbHBpbmUnO1xuXG5BbHBpbmUucGx1Z2luKGN1c3RvbUN1cnNvcik7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEZBLFNBQWdCLGNBQWMsSUFBSSxJQUFJO0NBQ2xDLE1BQU0sV0FBVyxJQUFJLGdCQUFnQixZQUFZO0VBQzdDLFNBQVMsV0FBVztFQUNwQixHQUFHLFFBQVEsRUFBRTtDQUNqQixDQUFDO0NBQ0QsU0FBUyxRQUFRLEVBQUU7Q0FDbkIsYUFBYSxTQUFTLFdBQVc7QUFDckM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BCQSxTQUFnQixvQkFBb0I7Q0FDaEMsT0FBTyxPQUFPLFdBQVcscUNBQXFDLENBQUMsQ0FBQztBQUNwRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6REEsU0FBZ0IsMkJBQTJCLGdCQUFnQixpQkFBaUIsSUFBSTtDQUM1RSxRQUFRLE1BQU0sY0FBYyxlQUFlLG1DQUFtQyxnQkFBZ0IsSUFBSSxFQUFFO0FBQ3hHOzs7Ozs7Ozs7OztBQ2pCQSxTQUFnQixpQkFBaUIsV0FBVyxjQUFjO0NBQ3RELElBQUk7Q0FDSixNQUFNLGdCQUFnQixVQUFVLFFBQVEsWUFBWTtDQUNwRCxJQUFJLGtCQUFrQixJQUNsQixPQUFPO0NBQ1gsUUFBUSxLQUFLLFVBQVUsZ0JBQWdCLFFBQVEsUUFBUSxPQUFPLEtBQUssSUFBSSxLQUFLO0FBQ2hGOzs7Ozs7OztBQVFBLFNBQWdCLHVCQUF1QixXQUFXLGNBQWM7Q0FDNUQsTUFBTSxtQkFBbUIsaUJBQWlCLFdBQVcsWUFBWTtDQUNqRSxJQUFJLG9CQUFvQixNQUNwQixPQUFPO0NBQ1gsTUFBTSxzQkFBc0IsT0FBTyxnQkFBZ0I7Q0FDbkQsSUFBSSxDQUFDLE9BQU8sU0FBUyxtQkFBbUIsR0FDcEMsT0FBTztDQUNYLE9BQU87QUFDWDs7Ozs7Ozs7QUFRQSxTQUFnQiwrQkFBK0IsV0FBVyxjQUFjO0NBQ3BF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