/**
 * Load and return the merged constants object from a theme's
 * constants.{json,yml} files.
 *
 * The theme directory is resolved here so callers never have to pass `__dirname`
 * or otherwise care which directory the process was launched from. Candidates
 * are tried in order, each walked up to the filesystem root:
 *
 *   1. `process.cwd()` — the gulp build, postcss config, and liquid rendering
 *      all run with cwd set to the theme dir.
 *   2. The directories of the files that called us — covers tooling that loads a
 *      theme's `tailwind.config.ts` out-of-context, e.g. the Tailwind CSS
 *      IntelliSense extension, whose cwd is the editor workspace root rather
 *      than the theme.
 *
 * Returns an empty object only when no constants file exists anywhere above any
 * candidate.
 */
export declare function loadConstants(): Record<any, any>;
