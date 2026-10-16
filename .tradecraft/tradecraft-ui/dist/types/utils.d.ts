type IsObject<T> = T extends object ? (T extends Array<any> ? false : true) : false;
export type SnakeToCamelCase<Key extends string | number | symbol> = Key extends `${infer Prefix}_${infer First}${infer Rest}` ? `${Prefix}${Uppercase<First>}${SnakeToCamelCase<Rest>}` : Key;
export type SnakeCaseToCamelCaseKeys<T> = {
    [K in keyof T as SnakeToCamelCase<K>]: IsObject<T[K]> extends true ? SnakeCaseToCamelCaseKeys<T[K]> : T[K];
};
export type CamelToSnakeCase<S extends string | number | symbol> = S extends `${infer P1}${infer P2}${infer P3}` ? P2 extends Uppercase<P2> ? `${Lowercase<P1>}_${Lowercase<P2>}${CamelToSnakeCase<P3>}` : `${P1}${CamelToSnakeCase<`${P2}${P3}`>}` : S;
export type CamelCaseToSnakeCaseKeys<T> = {
    [K in keyof T as CamelToSnakeCase<K>]: IsObject<T[K]> extends true ? CamelCaseToSnakeCaseKeys<T[K]> : T[K];
};
export type ArrayToUnion<T extends string[]> = T extends (infer U)[] ? U : never;
export {};
