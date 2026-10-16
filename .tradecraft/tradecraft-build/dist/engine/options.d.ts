export type BuildOptions = {
    command: string;
    environment: string;
    settings?: string;
    listing?: string;
    port: number;
    dev: boolean;
    production: boolean;
    noIndex: boolean;
    stripTestIds: boolean;
    ignore: string[];
    /** Arguments the engine does not use, forwarded to the Shopify CLI. */
    passthrough: string[];
};
/**
 * Parse the flags the themes use. Anything unrecognised goes to `passthrough`,
 * since `tradecraft-build watch -- --theme-editor-sync` must reach the Shopify CLI.
 */
export declare function parseOptions(argv: string[]): BuildOptions;
