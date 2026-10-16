export declare const LOCK_DIRECTORY: string;
type Owner = {
    pid: number;
    command: string;
};
export declare class BuildLockedError extends Error {
    constructor(themeRoot: string, owner: Owner);
}
/** Detect watchers started before locking existed. Shopify alone does not compile source. */
export declare function assertNoExistingWatcher(themeRoot: string): Promise<void>;
/** Publish a populated directory atomically; never reclaim a partially written lock. */
export declare function acquireBuildLock(themeRoot: string, command?: string): Promise<() => Promise<void>>;
export {};
