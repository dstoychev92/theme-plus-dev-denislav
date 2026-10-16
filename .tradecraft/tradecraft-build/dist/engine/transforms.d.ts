/**
 * Every content transform the build applies to a file, as plain string functions.
 * The gulp build wrapped these in streams. The engine calls them directly.
 */
export declare function stripDataTestId(content: string): string;
/**
 * Name the source file at the top of the rendered HTML so you can find a
 * section, block, or snippet by reading page source. Snippets opt in with an
 * `<!-- [autocomment] -->` marker since most snippets render inside a tag.
 */
export declare function autoCommentLiquid(content: string, relativePath: string): string;
export declare function formatJsonForFile(content: string, relativePath: string): string;
export type TransformOptions = {
    stripTestIds: boolean;
};
/**
 * The theme-file transform chain, in the order the gulp build ran it.
 */
export declare function transformThemeFile(content: string, relativePath: string, options: TransformOptions): string;
/** Files with no extension (.shopifyignore) are text too. */
export declare function isTextFile(filePath: string): boolean;
