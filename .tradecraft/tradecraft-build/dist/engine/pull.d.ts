import type { BuildOptions } from './options.js';
export type Formatter = (source: string, filePath: string) => Promise<string>;
export type PullResult = {
    written: string[];
    deleted: string[];
    unchanged: number;
    dropped: string[];
};
/** A pull that stopped before it changed the environment folder. */
export declare class PullError extends Error {
    constructor(message: string);
}
/**
 * Write the pulled files over the environment folder's settings files. `format`
 * gets each file's final path, so the theme's prettier config resolves for it.
 */
export declare function writePulledSettings(pulledRoot: string, sourceRoot: string, environmentRoot: string, format: Formatter): Promise<PullResult>;
/** The theme's own prettier and config, so a pull matches the theme's format script. */
export declare function themeFormatter(themeRoot: string): Formatter;
/** Pull the -e store into its settings folder, then print what changed. */
export declare function pull(themeRoot: string, options: BuildOptions): Promise<PullResult>;
