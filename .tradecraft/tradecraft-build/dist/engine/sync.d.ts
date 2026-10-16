/**
 * Copy a staging folder into dist by writing only the files that changed.
 *
 * The Shopify CLI watches dist and mirrors it to a real theme on a real store.
 * It uploads a truncated file and deletes a store file whose local copy is gone,
 * so a build that empties dist can strip a live shop
 * (https://github.com/Shopify/cli/issues/4764). This never empties dist, never
 * rewrites an unchanged file, and writes through a temp file plus rename so the
 * watcher only ever sees a complete file.
 */
export type SyncResult = {
    written: string[];
    deleted: string[];
    unchanged: number;
};
export declare function syncIntoDist(stagingRoot: string, distRoot: string): Promise<SyncResult>;
