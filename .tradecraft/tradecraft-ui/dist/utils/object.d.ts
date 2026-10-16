import { SnakeCaseToCamelCaseKeys } from '../types/utils';
export declare function camelizeKeys<TRecord extends Record<string, any>>(record: TRecord, upperCamel?: boolean): SnakeCaseToCamelCaseKeys<TRecord>;
export declare function isPlainObject(x: unknown): x is Record<string, any>;
type IntersectRecords<T extends Record<string, any>[]> = T extends [
    infer First extends Record<string, any>,
    ...infer Rest extends Record<string, any>[]
] ? First & IntersectRecords<Rest> : unknown;
/**
 * Similar to Object.assign except that it uses property descriptors to copy both enumerable and non-enumerable properties
 * from source objects onto the target object so that getters/setters, etc still work properly
 * @param target
 * @param source
 * @returns
 */
export declare function mergeProperties<T extends Record<any, any>, S extends Record<any, any>[]>(target: T, ...sources: S): T & IntersectRecords<S>;
/**
 * Renames a property on an object and deletes the old property, all while preserving the property descriptor (e.g. getters/setters)
 * @param obj
 * @param oldName
 * @param newName
 */
export declare function renameProperty<TObj extends Record<string, any>, TOldName extends keyof TObj, TNewName extends string>(obj: TObj, oldName: TOldName, newName: TNewName): void;
/**
 * Copy a property on an object and deletes the old property, all while preserving the property descriptor (e.g. getters/setters)
 * @param obj - The object to copy the property from
 * @param newObj - The object to copy the property to
 * @param oldName - The name of the property to copy
 * @param optionalNewName - The new name of the property (optional, defaults to oldName)
 */
export declare function copyProperty<TOldObj extends Record<string, any>, TNewObj extends Record<string, any>, TObj extends Record<string, any>, TOldName extends keyof TObj, TNewName extends string>(obj: TOldObj, newObj: TNewObj, oldName: TOldName, optionalNewName?: TNewName): void;
export declare function trackProperty<TObj extends Record<string, any>, TKey extends keyof TObj>(obj: TObj, key: TKey, trackingKey: TKey): TObj;
export {};
