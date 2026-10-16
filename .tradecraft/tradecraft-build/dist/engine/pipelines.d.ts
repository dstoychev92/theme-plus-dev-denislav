import { type BuildMode } from './mode.js';
export { buildMode, type BuildMode } from './mode.js';
import type { BuildOptions } from './options.js';
/**
 * compile: the Tradecraft pipelines (Tailwind, Rolldown, static Liquid, formatting).
 * copy: a theme from another vendor, such as Horizon. Its files ship byte for byte,
 * so the build output stays comparable with the vendor's release.
 */
export type Context = {
    themeRoot: string;
    staging: string;
    options: BuildOptions;
    packageName: string;
    mode?: BuildMode;
};
/**
 * Copy every theme file under src/ unchanged.
 */
export declare function copyThemeFiles(context: Context): Promise<number>;
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
/** The folder that holds a store's settings: --settings-path, or environments/<-s name> */
export declare function settingsFolder(themeRoot: string, options: {
    settings?: string;
    settingsPath?: string;
}): string | null;
/**
 * Write one store's settings over the files the theme just produced. The
 * settings folder wins, since it holds what that store actually runs.
 */
export declare function copyEnvironmentSettings(context: Context): Promise<number>;
