import { isInputElement } from '../utils/dom';
import { isLowPowerDevice, isReducedMotion } from '../utils/device';
import { animate, motionValue, styleEffect, transformValue } from 'motion';
/**
 * Returns the track index for a given value.
 */
function getIndexForValue(val, min, max, step, valuesLength, reversed) {
    const idx = reversed ? Math.round((max - val) / step) : Math.round((val - min) / step);
    return Math.max(0, Math.min(idx, valuesLength - 1));
}
/**
 * Returns the translateY target (px) for a given track index.
 */
function getTargetY(index, lineHeight) {
    return -(index * lineHeight);
}
/**
 * Returns the current numeric value from an input, or min if empty/invalid.
 */
function getCurrentValue(element, min) {
    if (isInputElement(element)) {
        return element.value === '' ? min : Number(element.value);
    }
    if (element.dataset.value != null && element.dataset.value !== '') {
        return Number(element.dataset.value);
    }
    return element.textContent !== '' ? Number(element.textContent) : min;
}
/**
 * Generates an array of values from min to max (inclusive) by step.
 * Handles floating-point safely.
 */
function generateTrackValues(min, max, step) {
    const values = [];
    const epsilon = Math.abs(step) * 1e-10;
    const maxValues = 1000;
    for (let i = 0;; i++) {
        if (values.length >= maxValues)
            break;
        const v = min + i * step;
        if (v > max + epsilon)
            break;
        values.push(Number(v.toPrecision(15)));
    }
    return values;
}
function formatTrackHtml(values, padDigits) {
    if (!padDigits)
        return values.join('\n');
    return values.map((num) => (num > -10 && num < 10 ? `0${num}` : String(num))).join('\n');
}
export default function animatedWheel(Alpine) {
    Alpine.directive('animated-wheel', ($el, data) => {
        if (data.value === 'track') {
            // Track: overlay that shows the sliding values. Hidden until it animates, so it never
            // shows an invalid or stale value — unless the root has `.always-visible`.
            Alpine.bind($el, {
                'x-init'() {
                    const trackEl = $el;
                    this.__animatedWheel_trackEl = trackEl;
                    // visibility, not x-show, since display:none drops the layout box and the
                    // compositor layer, so every show repaints the area around the wheel
                    trackEl.style.visibility = this.__animatedWheel_trackVisible ? 'visible' : 'hidden';
                },
                'x-html'() {
                    return this.__animatedWheel_trackHtml;
                },
            });
        }
        else if (data.value === 'input') {
            Alpine.bind($el, {
                'x-init'() {
                    this.__animatedWheel_inputEl = $el;
                },
                'x-resize'() {
                    this.__animatedWheel_syncInputHeight(this.$height);
                },
            });
        }
        else if (data.value === null) {
            // Root: x-data component with state and methods.
            Alpine.bind($el, {
                'x-data'() {
                    var _a, _b, _c;
                    const padDigits = ((_a = data.modifiers) !== null && _a !== void 0 ? _a : []).includes('pad');
                    const reversed = ((_b = data.modifiers) !== null && _b !== void 0 ? _b : []).includes('reverse');
                    const alwaysVisible = ((_c = data.modifiers) !== null && _c !== void 0 ? _c : []).includes('always-visible');
                    return {
                        __animatedWheel_rootEl: $el,
                        __animatedWheel_trackEl: null,
                        __animatedWheel_inputEl: null,
                        __animatedWheel_min: 0,
                        __animatedWheel_max: 10,
                        __animatedWheel_step: 1,
                        __animatedWheel_trackValues: [],
                        __animatedWheel_trackHtml: '',
                        __animatedWheel_trackConfigKey: null,
                        __animatedWheel_appliedLineHeight: null,
                        __animatedWheel_baseTrackLength: 0,
                        __animatedWheel_spins: 0,
                        __animatedWheel_padDigits: padDigits,
                        __animatedWheel_reversed: reversed,
                        __animatedWheel_alwaysVisible: alwaysVisible,
                        __animatedWheel_motionY: motionValue(0),
                        __animatedWheel_inputHeight: null,
                        __animatedWheel_trackVisible: false,
                        __animatedWheel_animationControls: null,
                        __animatedWheel_styleEffect: null,
                        __animatedWheel_setTrackVisible(visible) {
                            if (this.__animatedWheel_trackVisible === visible)
                                return;
                            this.__animatedWheel_trackVisible = visible;
                            if (this.__animatedWheel_trackEl) {
                                this.__animatedWheel_trackEl.style.visibility = visible ? 'visible' : 'hidden';
                            }
                        },
                        __animatedWheel_setTrackY(y) {
                            this.__animatedWheel_motionY.set(y);
                            // motion writes the transform on its next frame, so write it here too —
                            // a track that becomes visible in between would show the wrong value
                            if (this.__animatedWheel_trackEl) {
                                this.__animatedWheel_trackEl.style.transform = `translateY(${y}px)`;
                            }
                        },
                        __animatedWheel_syncInputHeight(height) {
                            if (!this.__animatedWheel_inputEl)
                                return;
                            const nextHeight = height !== null && height !== void 0 ? height : 0;
                            if (this.__animatedWheel_inputHeight === nextHeight)
                                return;
                            const previousHeight = this.__animatedWheel_inputHeight;
                            this.__animatedWheel_inputHeight = nextHeight;
                            // First usable measurement (initial ResizeObserver fire, or the wheel just
                            // became visible): snap the track to the current value.
                            if (!previousHeight && nextHeight) {
                                this.__animatedWheel_updatePosition();
                            }
                        },
                        __animatedWheel_syncTrack() {
                            var _a, _b, _c;
                            if (!this.__animatedWheel_inputEl)
                                return;
                            let inputMin;
                            let inputMax;
                            let inputStep;
                            if (isInputElement(this.__animatedWheel_inputEl)) {
                                // Input .min/.max properties are '' (never undefined) when the attribute is absent.
                                inputMin = this.__animatedWheel_inputEl.min !== '' ? Number(this.__animatedWheel_inputEl.min) : 0;
                                inputMax =
                                    this.__animatedWheel_inputEl.max !== ''
                                        ? Number(this.__animatedWheel_inputEl.max)
                                        : Math.max(inputMin + 10, getCurrentValue(this.__animatedWheel_inputEl, inputMin) + 10);
                                inputStep = Number(this.__animatedWheel_inputEl.step) || 1;
                            }
                            const min = inputMin !== null && inputMin !== void 0 ? inputMin : Number((_a = this.__animatedWheel_inputEl.dataset.min) !== null && _a !== void 0 ? _a : 0);
                            const max = inputMax !== null && inputMax !== void 0 ? inputMax : Number((_b = this.__animatedWheel_inputEl.dataset.max) !== null && _b !== void 0 ? _b : min + 10);
                            const step = inputStep !== null && inputStep !== void 0 ? inputStep : (Number(this.__animatedWheel_inputEl.dataset.step) || 1);
                            const spins = Math.max(0, Math.round(Number((_c = this.__animatedWheel_rootEl.dataset.spins) !== null && _c !== void 0 ? _c : 0)));
                            // `min` can be 0, `max` and `step` cannot
                            if (typeof min !== 'number' || !max || !step) {
                                return;
                            }
                            const configKey = `${min}|${max}|${step}|${spins}|${this.__animatedWheel_reversed}|${this.__animatedWheel_padDigits}`;
                            if (this.__animatedWheel_trackConfigKey === configKey && this.__animatedWheel_trackValues.length > 0) {
                                return;
                            }
                            this.__animatedWheel_min = min;
                            this.__animatedWheel_max = max;
                            this.__animatedWheel_step = step;
                            this.__animatedWheel_spins = spins;
                            const trackValues = generateTrackValues(min, max, step);
                            if (this.__animatedWheel_reversed) {
                                trackValues.reverse();
                            }
                            this.__animatedWheel_baseTrackLength = trackValues.length;
                            if (spins > 0) {
                                // Extend track with repeated rotations for multi-spin animation
                                const baseValues = [...trackValues];
                                for (let i = 0; i < spins + 1; i++) {
                                    trackValues.push(...baseValues);
                                }
                            }
                            else if (this.__animatedWheel_reversed) {
                                // Append wrap target so the wheel can continue forward on wrap
                                // instead of rewinding backwards through all values
                                trackValues.push(trackValues[0]);
                            }
                            this.__animatedWheel_trackValues = trackValues;
                            this.__animatedWheel_trackHtml = formatTrackHtml(trackValues, this.__animatedWheel_padDigits);
                            this.__animatedWheel_trackConfigKey = configKey;
                        },
                        /**
                         * Update track position. Supports 3 signatures:
                         * - updatePosition(callback): read from input, run callback (await if returns Promise), read to from input, animate
                         * - updatePosition(fromValue, callback): use fromValue, run callback (await if returns Promise), read to from input, animate
                         * - updatePosition(fromValue, toValue): animate from→to directly
                         * - updatePosition(): set position to current input value/data-value (no animation)
                         */
                        async __animatedWheel_updatePosition(a, b) {
                            if (!this.__animatedWheel_trackEl || !this.__animatedWheel_inputEl)
                                return;
                            if (!this.__animatedWheel_inputHeight)
                                return;
                            if (this.__animatedWheel_styleEffect === null) {
                                this.__animatedWheel_styleEffect = styleEffect(this.__animatedWheel_trackEl, {
                                    transform: transformValue(() => `translateY(${this.__animatedWheel_motionY.get()}px)`),
                                });
                            }
                            const lineHeight = this.__animatedWheel_inputHeight;
                            if (this.__animatedWheel_appliedLineHeight !== lineHeight) {
                                this.__animatedWheel_trackEl.style.lineHeight = `${lineHeight}px`;
                                this.__animatedWheel_appliedLineHeight = lineHeight;
                            }
                            this.__animatedWheel_syncTrack();
                            if (this.__animatedWheel_trackValues.length === 0)
                                return;
                            const values = this.__animatedWheel_trackValues;
                            let fromValue;
                            let toValue;
                            if (typeof a === 'function') {
                                fromValue = getCurrentValue(this.__animatedWheel_inputEl, this.__animatedWheel_min);
                                const result = a();
                                if (result && typeof result.then === 'function') {
                                    await result;
                                }
                                toValue = getCurrentValue(this.__animatedWheel_inputEl, this.__animatedWheel_min);
                            }
                            else if (typeof a === 'number' && typeof b === 'function') {
                                fromValue = a;
                                const result = b();
                                if (result && typeof result.then === 'function') {
                                    await result;
                                }
                                toValue = getCurrentValue(this.__animatedWheel_inputEl, this.__animatedWheel_min);
                            }
                            else if (typeof a === 'number' && typeof b === 'number') {
                                fromValue = a;
                                toValue = b;
                            }
                            else {
                                const value = getCurrentValue(this.__animatedWheel_inputEl, this.__animatedWheel_min);
                                const index = getIndexForValue(value, this.__animatedWheel_min, this.__animatedWheel_max, this.__animatedWheel_step, this.__animatedWheel_baseTrackLength, this.__animatedWheel_reversed);
                                const targetY = getTargetY(index, lineHeight);
                                if (this.__animatedWheel_motionY.get() !== targetY) {
                                    this.__animatedWheel_setTrackY(targetY);
                                }
                                this.__animatedWheel_setTrackVisible(this.__animatedWheel_alwaysVisible);
                                return;
                            }
                            const spins = this.__animatedWheel_spins;
                            const baseLen = this.__animatedWheel_baseTrackLength;
                            if (fromValue === toValue && spins === 0)
                                return;
                            let fromIndex = getIndexForValue(fromValue, this.__animatedWheel_min, this.__animatedWheel_max, this.__animatedWheel_step, baseLen, this.__animatedWheel_reversed);
                            let toIndex = getIndexForValue(toValue, this.__animatedWheel_min, this.__animatedWheel_max, this.__animatedWheel_step, baseLen, this.__animatedWheel_reversed);
                            // Low-power devices jump to the value since a wheel animation runs a
                            // transform every frame for its whole duration, and a countdown starts
                            // one per digit every second. Reduced-motion visitors get the same jump
                            if (isLowPowerDevice() || isReducedMotion()) {
                                this.__animatedWheel_setTrackY(getTargetY(toIndex, lineHeight));
                                this.__animatedWheel_setTrackVisible(this.__animatedWheel_alwaysVisible);
                                return;
                            }
                            if (spins > 0) {
                                // Multi-spin: start from the opposite side of the wheel so every digit
                                // travels the same distance (spins * full rotation + half rotation)
                                const halfLen = Math.floor(baseLen / 2);
                                fromIndex = (toIndex + halfLen) % baseLen;
                                toIndex = fromIndex + spins * baseLen + halfLen;
                            }
                            else if (this.__animatedWheel_reversed && toIndex === 0 && fromIndex > 0) {
                                // On reversed tracks, prevent backward scrolling on wrap — use the wrap
                                // target appended at the end of the track instead. It repeats the first
                                // value, so it only lands right when that value is the target
                                toIndex = values.length - 1;
                            }
                            const fromY = getTargetY(fromIndex, lineHeight);
                            const toY = getTargetY(toIndex, lineHeight);
                            if (fromY === toY)
                                return;
                            const existing = this.__animatedWheel_animationControls;
                            if (existing === null || existing === void 0 ? void 0 : existing.stop) {
                                existing.stop();
                                this.__animatedWheel_animationControls = null;
                            }
                            if (this.__animatedWheel_motionY.get() !== fromY) {
                                this.__animatedWheel_setTrackY(fromY);
                            }
                            this.__animatedWheel_setTrackVisible(true);
                            // Multi-spin: longer duration with aggressive ease-out deceleration
                            const duration = spins > 0 ? 0.6 + spins * 0.25 : 0.3;
                            const ease = spins > 0 ? [0.12, 0, 0.04, 1] : undefined;
                            const controls = animate(this.__animatedWheel_motionY, toY, Object.assign({ duration }, (ease ? { ease } : {})));
                            this.__animatedWheel_animationControls = controls;
                            const settle = () => this.__animatedWheel_setTrackVisible(this.__animatedWheel_alwaysVisible);
                            const finished = controls.finished;
                            if (finished) {
                                finished
                                    .then(() => {
                                    this.__animatedWheel_animationControls = null;
                                    settle();
                                })
                                    .catch(settle);
                            }
                            else {
                                setTimeout(() => {
                                    this.__animatedWheel_animationControls = null;
                                    settle();
                                }, duration * 1000);
                            }
                        },
                        destroy() {
                            var _a, _b;
                            if (this.__animatedWheel_animationControls) {
                                (_b = (_a = this.__animatedWheel_animationControls) === null || _a === void 0 ? void 0 : _a.stop) === null || _b === void 0 ? void 0 : _b.call(_a);
                                this.__animatedWheel_animationControls = null;
                            }
                            if (this.__animatedWheel_styleEffect) {
                                this.__animatedWheel_styleEffect();
                                this.__animatedWheel_styleEffect = null;
                            }
                        },
                    };
                },
            });
        }
        else {
            throw new Error(`Unknown directive: x-animated-wheel:${data.value}`);
        }
    });
    Alpine.magic('animatedWheel', ($el) => {
        const $data = Alpine.$data($el);
        return {
            get isTrackVisible() {
                return $data.__animatedWheel_trackVisible;
            },
            updatePosition(a, b) {
                $data.__animatedWheel_updatePosition(a, b);
            },
        };
    });
}
