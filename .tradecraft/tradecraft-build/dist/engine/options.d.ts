export type BuildOptions = {
    command: string;
    environment: string;
    settings?: string;
    /** A store's settings folder anywhere, such as ../store, in place of environments/<settings> */
    settingsPath?: string;
    port: number;
    dev: boolean;
    production: boolean;
    stripTestIds: boolean;
    ignore: string[];
    /** Arguments the engine does not use, forwarded to the Shopify CLI. */
    passthrough: string[];
};
/** Groupthought release options, which method-tools handles in this monorepo */
export declare const INTERNAL_FLAGS: Set<string>;
/**
 * Parse the flags the themes use. Anything unrecognised goes to `passthrough`,
 * since `tradecraft-build watch -- --theme-editor-sync` must reach the Shopify CLI.
 */
export declare function parseOptions(argv: string[]): BuildOptions;
