import type { BuildOptions } from './options.js';
import { type Context } from './pipelines.js';
import { type SyncResult } from './sync.js';
/** Staging sits inside the theme so a rename into dist stays on one filesystem. */
export declare const STAGING_DIRECTORY: string;
export declare function createContext(themeRoot: string, options: BuildOptions, packageName: string): Context;
export type BuildReport = SyncResult & {
    milliseconds: number;
};
/** Refuse incomplete output before the sync can delete files from dist. */
export declare function assertCompleteStaging(staging: string): Promise<void>;
/**
 * Build the theme into staging, then copy the changed files into dist.
 *
 * Nothing writes to dist until every pipeline has finished, so a failed build
 * leaves the last good output in place and the Shopify CLI keeps serving it.
 */
export declare function build(context: Context): Promise<BuildReport>;
