/**
 * The theme's own prettier formats the theme's output, so the theme's
 * package.json decides the formatter version, the same as when the themes ran
 * prettier from their own scripts. tradecraft-build's copy is only the fallback
 * for a theme that has no prettier.
 */
export declare function loadPrettier(themeRoot: string): any;
/**
 * Run prettier over the built output. The themes used to do this in their own
 * package.json scripts, which meant every theme repeated the same command and a
 * new theme could forget it.
 */
export declare function formatOutput(root: string, themeRoot: string, production: boolean): Promise<number>;
