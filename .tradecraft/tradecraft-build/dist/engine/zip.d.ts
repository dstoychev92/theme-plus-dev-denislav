/**
 * Pack dist into a zip for the theme store, or for handing a build to someone.
 * A development zip carries the git commit instead of a version, since it does
 * not correspond to a release.
 */
export declare function createZip(themeRoot: string, packageName: string, version: string, development: boolean): Promise<string>;
