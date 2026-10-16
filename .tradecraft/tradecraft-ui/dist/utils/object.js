import { toCamelCase } from './string';
export function camelizeKeys(record, upperCamel = false) {
    return Object.entries(record).reduce((memo, [key, value]) => {
        return Object.assign(Object.assign({}, memo), { [toCamelCase(key, upperCamel)]: value });
    }, {});
}
export function isPlainObject(x) {
    return typeof x === 'object' && x !== null && !Array.isArray(x) && !(x instanceof Date);
}
/**
 * Similar to Object.assign except that it uses property descriptors to copy both enumerable and non-enumerable properties
 * from source objects onto the target object so that getters/setters, etc still work properly
 * @param target
 * @param source
 * @returns
 */
export function mergeProperties(target, ...sources) {
    let santizedSources = sources.filter(Boolean).reverse();
    let newObject = Object.defineProperties({}, Object.getOwnPropertyDescriptors(target));
    for (const source of santizedSources) {
        Object.defineProperties(newObject, Object.getOwnPropertyDescriptors(source));
    }
    return newObject;
}
/**
 * Renames a property on an object and deletes the old property, all while preserving the property descriptor (e.g. getters/setters)
 * @param obj
 * @param oldName
 * @param newName
 */
export function renameProperty(obj, oldName, newName) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, oldName);
    if (!descriptor)
        throw new Error(`Property ${String(oldName)} not found on object`);
    Object.defineProperty(obj, newName, descriptor);
    delete obj[oldName];
}
/**
 * Copy a property on an object and deletes the old property, all while preserving the property descriptor (e.g. getters/setters)
 * @param obj - The object to copy the property from
 * @param newObj - The object to copy the property to
 * @param oldName - The name of the property to copy
 * @param optionalNewName - The new name of the property (optional, defaults to oldName)
 */
export function copyProperty(obj, newObj, oldName, optionalNewName) {
    const newName = optionalNewName !== null && optionalNewName !== void 0 ? optionalNewName : oldName;
    const descriptor = Object.getOwnPropertyDescriptor(obj, oldName);
    if (!descriptor)
        throw new Error(`Property ${String(oldName)} not found on object`);
    Object.defineProperty(newObj, newName, descriptor);
}
export function trackProperty(obj, key, trackingKey) {
    return new Proxy(obj, {
        set(target, prop, value, receiver) {
            // Only update the tracking key when the tracked value actually changes — otherwise
            // redundant assignments (e.g. close() called twice for one Escape press because both
            // @keydown.escape.window and the native cancel event fire) zero out the previous value.
            if (prop == key && receiver[key] !== value) {
                receiver[trackingKey] = receiver[key];
            }
            return Reflect.set(target, prop, value, receiver);
        },
    });
}
