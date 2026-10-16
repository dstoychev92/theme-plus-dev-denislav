/**
 * Get display pixel ratio of the current device
 *
 * Inspired by https://github.com/floating-ui/floating-ui/blob/a6339a7561348de96b8dbb8e3c852efeee6c2049/packages/react-dom/src/utils/getDPR.ts
 */
export function getDPR(element) {
    if (typeof window === 'undefined') {
        return 1;
    }
    const win = element.ownerDocument.defaultView || window;
    return win.devicePixelRatio || 1;
}
/**
 * Round a number based on the DPR of the current device
 *
 * Inspired by https://github.com/floating-ui/floating-ui/blob/a6339a7561348de96b8dbb8e3c852efeee6c2049/packages/react-dom/src/utils/roundByDPR.ts#L4
 */
export function roundByDPR(element, value) {
    const dpr = getDPR(element);
    return Math.round(value * dpr) / dpr;
}
/**
 * Returns the modulo of n and m handling negative numbers correctly
 *
 * e.g.
 * mod(1, 5) = 1
 * mod(7, 5) = 2
 * mod(-1, 5) = 4
 * @param n
 * @param m
 * @returns
 */
export function mod(n, m) {
    return ((n % m) + m) % m;
}
/**
 * Returns the value clamped between min and max
 * @param n
 * @param min
 * @param max
 * @returns
 */
export function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
}
/**
 * Emulates how browsers round scroll values which is to the nearest 0 or half integer
 * e.g. 0.1 => 0.0, 0.9 => 0.5..., 0.0 => 0, 1.0 => 1
 */
export function toScrollValue(value) {
    return Math.floor(value) + Math.round((value - Math.floor(value)) * 2) / 2;
}
/**
 * Return whether a string is numeric
 * @param value
 * @returns
 */
export function isNumeric(value) {
    if (typeof value == 'number')
        return true;
    return (!isNaN(value) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(value))); // ...and ensure strings of whitespace fail
}
