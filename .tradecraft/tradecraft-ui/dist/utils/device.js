export function isReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
export function isLowPowerDevice() {
    // eslint-disable-next-line compat/compat -- undefined on iOS Safari 13.4-13.7, where NaN <= 2 is false and the device reads as normal-power
    return Number(navigator.hardwareConcurrency) <= 2 || Number(navigator.deviceMemory) <= 2;
}
