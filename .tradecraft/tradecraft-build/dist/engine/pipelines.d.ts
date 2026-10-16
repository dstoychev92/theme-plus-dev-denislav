import type { BuildOptions } from './options.js';
export type Context = {
    themeRoot: string;
    staging: string;
    options: BuildOptions;
    packageName: string;
};
/**
 * Bundle JavaScript with the theme's own rollup.config.js. The config format is
 * Rollup's, which Rolldown reads, so a theme needs no change.
 */
export declare function bundleJavaScript(context: Context): Promise<number>;
/**
 * Run the theme's PostCSS config (Tailwind and friends) over its stylesheets.
 * Every stylesheet lands directly in assets, whatever folder it came from.
 */
export declare function compileStyles(context: Context): Promise<number>;
/** Sections, blocks, snippets, templates, locales, config, layout, and the agent context files. */
export declare function compileThemeFiles(context: Context): Promise<number>;
/** Files served as-is, apart from the static Liquid compile. */
export declare function copyAssets(context: Context): Promise<number>;
/** Each icon becomes a snippet, so a template can render it by name. */
export declare function copyIcons(context: Context): Promise<number>;
/**
 * Write one store's settings over the files the theme just produced. The
 * environment folder wins, since it holds what that store actually runs.
 *
 * A method-* folder inside an environment holds our own records, not theme files —
 * environments/listing-analog/method-listing/ holds the rules that generated the
 * listing. No path in a Shopify theme starts with method-, so the folder is skipped.
 */
export declare function copyEnvironmentSettings(context: Context): Promise<number>;
/** Listings ship inside the zip so the theme store can offer each preset. */
export declare function copyListings(context: Context): Promise<number>;
