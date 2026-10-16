/**
 * Get display pixel ratio of the current device
 *
 * Inspired by https://github.com/floating-ui/floating-ui/blob/a6339a7561348de96b8dbb8e3c852efeee6c2049/packages/react-dom/src/utils/getDPR.ts
 */
export declare function getDPR(element: Element): number;
/**
 * Round a number based on the DPR of the current device
 *
 * Inspired by https://github.com/floating-ui/floating-ui/blob/a6339a7561348de96b8dbb8e3c852efeee6c2049/packages/react-dom/src/utils/roundByDPR.ts#L4
 */
export declare function roundByDPR(element: Element, value: number): number;
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
export declare function mod(n: number, m: number): number;
/**
 * Returns the value clamped between min and max
 * @param n
 * @param min
 * @param max
 * @returns
 */
export declare function clamp(n: number, min: number, max: number): number;
/**
 * Emulates how browsers round scroll values which is to the nearest 0 or half integer
 * e.g. 0.1 => 0.0, 0.9 => 0.5..., 0.0 => 0, 1.0 => 1
 */
export declare function toScrollValue(value: number): number;
/**
 * Return whether a string is numeric
 * @param value
 * @returns
 */
export declare function isNumeric(value: string | number): boolean;
