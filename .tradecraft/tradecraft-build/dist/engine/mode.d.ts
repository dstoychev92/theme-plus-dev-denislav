export type BuildMode = 'compile' | 'copy';
export declare function configFile(themeRoot: string, name: 'rollup' | 'postcss'): string | undefined;
export declare function buildMode(themeRoot: string, packageJson?: {
    tradecraft?: {
        build?: string;
    };
}): BuildMode;
