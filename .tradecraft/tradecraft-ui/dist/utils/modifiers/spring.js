import { getModifierValue, getPositiveNumberModifierValue } from './base';
const DEFAULT_MIN_SPRING_MASS = 0.01;
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
export function getMassModifierValue(modifiers, modifierName, minimumMass = DEFAULT_MIN_SPRING_MASS) {
    const rawModifierValue = getModifierValue(modifiers, modifierName);
    if (rawModifierValue == null)
        return null;
    const parsedModifierValue = Number(rawModifierValue);
    if (Number.isNaN(parsedModifierValue) || parsedModifierValue < 0)
        return null;
    if (parsedModifierValue === 0)
        return minimumMass;
    return parsedModifierValue * minimumMass;
}
/**
 * Applies `.mass`, `.stiffness`, and `.damping` directive modifiers to a spring config.
 *
 * @example
 * getSpringModifierConfig(['mass', '20', 'stiffness', '180'], {mass: 0.5, stiffness: 200, damping: 30});
 * // => {mass: 0.2, stiffness: 180, damping: 30}
 */
export function getSpringModifierConfig(modifiers, defaultSpringConfig, minimumMass = DEFAULT_MIN_SPRING_MASS) {
    const springConfig = Object.assign({}, defaultSpringConfig);
    const parsedMass = getMassModifierValue(modifiers, 'mass', minimumMass);
    if (parsedMass !== null)
        springConfig.mass = parsedMass;
    const parsedStiffness = getPositiveNumberModifierValue(modifiers, 'stiffness');
    if (parsedStiffness !== null)
        springConfig.stiffness = parsedStiffness;
    const parsedDamping = getPositiveNumberModifierValue(modifiers, 'damping');
    if (parsedDamping !== null)
        springConfig.damping = parsedDamping;
    return springConfig;
}
