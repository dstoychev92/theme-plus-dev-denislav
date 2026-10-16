/**
 * Returns the token that follows a directive modifier name.
 *
 * @example
 * getModifierValue(['speed', '60'], 'speed');
 * // => '60'
 */
export function getModifierValue(modifiers, modifierName) {
    var _a;
    const modifierIndex = modifiers.indexOf(modifierName);
    if (modifierIndex === -1)
        return null;
    return (_a = modifiers[modifierIndex + 1]) !== null && _a !== void 0 ? _a : null;
}
/**
 * Returns a numeric modifier value when it can be parsed as a finite number.
 *
 * @example
 * getNumberModifierValue(['speed', '-60'], 'speed');
 * // => -60
 */
export function getNumberModifierValue(modifiers, modifierName) {
    const rawModifierValue = getModifierValue(modifiers, modifierName);
    if (rawModifierValue == null)
        return null;
    const parsedModifierValue = Number(rawModifierValue);
    if (!Number.isFinite(parsedModifierValue))
        return null;
    return parsedModifierValue;
}
/**
 * Returns a positive numeric modifier value.
 *
 * @example
 * getPositiveNumberModifierValue(['stiffness', '240'], 'stiffness');
 * // => 240
 */
export function getPositiveNumberModifierValue(modifiers, modifierName) {
    const parsedModifierValue = getNumberModifierValue(modifiers, modifierName);
    if (parsedModifierValue == null || parsedModifierValue <= 0)
        return null;
    return parsedModifierValue;
}
/**
 * Returns an `ms` modifier value as a number.
 *
 * @example
 * getMillisecondsModifierValue(['duration', '500ms'], 'duration');
 * // => 500
 */
export function getMillisecondsModifierValue(modifiers, modifierName) {
    const rawModifierValue = getModifierValue(modifiers, modifierName);
    if (rawModifierValue == null)
        return null;
    const millisecondsMatch = rawModifierValue.match(/^([0-9]+)ms$/);
    if (!millisecondsMatch)
        return null;
    return Number(millisecondsMatch[1]);
}
/**
 * Returns a `%` modifier value as a number.
 *
 * @example
 * getPercentageModifierValue(['progress', '50%'], 'progress');
 * // => 50
 */
export function getPercentageModifierValue(modifiers, modifierName) {
    const rawModifierValue = getModifierValue(modifiers, modifierName);
    if (rawModifierValue == null)
        return null;
    const percentageMatch = rawModifierValue.match(/^([0-9]+)%$/);
    if (!percentageMatch)
        return null;
    return Number(percentageMatch[1]);
}
/**
 * Returns a `px` modifier value as a number.
 *
 * @example
 * getPixelModifierValue(['offset', '-12px'], 'offset');
 * // => -12
 */
export function getPixelModifierValue(modifiers, modifierName) {
    const rawModifierValue = getModifierValue(modifiers, modifierName);
    if (rawModifierValue == null)
        return null;
    const pixelMatch = rawModifierValue.match(/^(-?[0-9]+)px$/);
    if (!pixelMatch)
        return null;
    return Number(pixelMatch[1]);
}
