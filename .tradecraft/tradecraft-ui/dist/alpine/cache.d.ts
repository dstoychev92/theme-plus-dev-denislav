import { Alpine as AlpineType, Stores } from 'alpinejs';
export type CacheMagic = Stores['cache']['resources'];
declare module 'alpinejs' {
    interface Stores {
        cache: {
            resources: Record<string, CacheResource | CacheSingletonResource>;
            reset(): void;
            addResource(key: string, options?: {
                singleton?: boolean;
                builder?: CacheResultBuilder<any>;
            }): void;
        };
    }
    interface Magics<T> {
        /**
         * The cache store's resources, e.g. $cache.products.get(id)
         */
        $cache: CacheMagic;
    }
}
export type CacheRecord = any;
export type CacheKey = number | string;
export type CacheResultBuilder<TInputRecord extends CacheRecord, TOutputRecord extends any = CacheRecord> = (r: TInputRecord) => TOutputRecord;
export type CacheResource<TResource extends CacheRecord = CacheRecord, TBuilder extends CacheResultBuilder<TResource> = (r: TResource) => TResource> = {
    /**
     * The records in the cache
     */
    records: Record<string | number, TResource>;
    /**
     * Populate the cache with records (wiping any existing records)
     * @param records Records to populate the cache with
     */
    populate(records: Record<string | number, TResource>): void;
    /**
     * Shallow update the cache with records (without wiping any existing records)
     * @param records Records to update to the cache
     */
    upsert(records: Record<string | number, TResource>): void;
    /**
     * Insert/overwrite a single record in the cache
     * @param key Cache key to update
     * @param value Value to update the cache with
     */
    set(key: number | string, value: TResource): void;
    /**
     * Remove a record from the cache
     * @param key Cache key to evict
     */
    evict(key: number | string): void;
    /**
     * Reset cache to initial state
     */
    reset(): void;
    /**
     * Retrieve and return a record from the cache
     * @param key Cache key to get
     */
    get(key: number | string): ReturnType<TBuilder> | null;
    isSingleton: boolean;
};
export type CacheSingletonResource<TResource extends CacheRecord = CacheRecord, TBuilder extends CacheResultBuilder<TResource> = (r: TResource) => TResource> = {
    /**
     * The records in the cache
     */
    record: TResource | null;
    /**
     * Insert/update record
     * @param key Cache key to update
     * @param value Value to update the cache with
     */
    set(value: TResource): void;
    /**
     * Remove record from the cache
     */
    evict(): void;
    /**
     * Reset cache to initial state
     */
    reset(): void;
    /**
     * Retrieve and return record from the cache
     * @param key Cache key to get
     */
    get(): ReturnType<TBuilder> | null;
    isSingleton: boolean;
};
export type CacheStore = Stores['cache'];
export type CacheStoreKey = keyof CacheStore['resources'];
export default function (Alpine: AlpineType): void;
