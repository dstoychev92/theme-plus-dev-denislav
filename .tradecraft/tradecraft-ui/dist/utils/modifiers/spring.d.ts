import { SpringOptions } from 'motion';
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
export declare function getMassModifierValue(modifiers: string[], modifierName: string, minimumMass?: number): number | null;
/**
 * Applies `.mass`, `.stiffness`, and `.damping` directive modifiers to a spring config.
 *
 * @example
 * getSpringModifierConfig(['mass', '20', 'stiffness', '180'], {mass: 0.5, stiffness: 200, damping: 30});
 * // => {mass: 0.2, stiffness: 180, damping: 30}
 */
export declare function getSpringModifierConfig(modifiers: string[], defaultSpringConfig: SpringOptions, minimumMass?: number): SpringOptions;
