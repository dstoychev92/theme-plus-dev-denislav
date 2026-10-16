/**
 * Returns the token that follows a directive modifier name.
 *
 * @example
 * getModifierValue(['speed', '60'], 'speed');
 * // => '60'
 */
export declare function getModifierValue(modifiers: string[], modifierName: string): string | null;
/**
 * Returns a numeric modifier value when it can be parsed as a finite number.
 *
 * @example
 * getNumberModifierValue(['speed', '-60'], 'speed');
 * // => -60
 */
export declare function getNumberModifierValue(modifiers: string[], modifierName: string): number | null;
/**
 * Returns a positive numeric modifier value.
 *
 * @example
 * getPositiveNumberModifierValue(['stiffness', '240'], 'stiffness');
 * // => 240
 */
export declare function getPositiveNumberModifierValue(modifiers: string[], modifierName: string): number | null;
/**
 * Returns an `ms` modifier value as a number.
 *
 * @example
 * getMillisecondsModifierValue(['duration', '500ms'], 'duration');
 * // => 500
 */
export declare function getMillisecondsModifierValue(modifiers: string[], modifierName: string): number | null;
/**
 * Returns a `%` modifier value as a number.
 *
 * @example
 * getPercentageModifierValue(['progress', '50%'], 'progress');
 * // => 50
 */
export declare function getPercentageModifierValue(modifiers: string[], modifierName: string): number | null;
/**
 * Returns a `px` modifier value as a number.
 *
 * @example
 * getPixelModifierValue(['offset', '-12px'], 'offset');
 * // => -12
 */
export declare function getPixelModifierValue(modifiers: string[], modifierName: string): number | null;
