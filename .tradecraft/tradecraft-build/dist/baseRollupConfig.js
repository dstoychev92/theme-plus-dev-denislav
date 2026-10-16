"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBaseRollupConfig = void 0;
/* eslint-disable no-process-env */
const path_1 = __importDefault(require("path"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const rollup_plugin_esbuild_1 = __importDefault(require("rollup-plugin-esbuild"));
const rollup_plugin_inject_process_env_1 = __importDefault(require("rollup-plugin-inject-process-env"));
const config_1 = __importDefault(require("./config"));
const glob_1 = require("glob");
// Transpile-only via esbuild — ~10x faster than re-type-checking the whole
// program on every rebuild (which @rollup/plugin-typescript did). Type safety
// is enforced separately by `pnpm lint:types` / CI, not in the hot reload loop.
const esbuildConfig = {
    target: 'esnext',
    sourceMap: true,
};
// Match all theme.ts and theme.*.ts files, and output separate entry points for them
const themeEntries = [
    path_1.default.join(config_1.default.themeRoot, config_1.default.src.js, 'theme.ts'),
    path_1.default.join(config_1.default.themeRoot, config_1.default.src.js, 'theme.*.ts'),
];
// Match vendor.ts and vendor.*.ts files (except for tradecraft-ui as that has special handling),
// and output separate entry points for them
const vendorEntries = glob_1.glob.sync(path_1.default.join(config_1.default.themeRoot, config_1.default.src.js, 'vendor{,.*}.ts'));
const themeImportExternalPattern = /^(\.{1,2}\/)?theme\.[^.]+(\.[^.]+)?(\.js)?$/;
function makeExternal(externalPackages) {
    return (source) => externalPackages.includes(source) || themeImportExternalPattern.test(source);
}
function buildEnvironmentConfigs(externalPackages) {
    const external = makeExternal(externalPackages);
    return {
        development: [
            ...glob_1.glob.sync(themeEntries).map((file) => ({
                input: file,
                external,
                output: [
                    {
                        dir: path_1.default.join(config_1.default.themeRoot, config_1.default.dist.assets),
                        format: 'es',
                        interop: 'auto',
                        name: 'themeDevelopment',
                        sourcemap: 'inline',
                        entryFileNames: '[name].js',
                    },
                ],
                plugins: [
                    (0, rollup_plugin_esbuild_1.default)(esbuildConfig),
                    (0, plugin_node_resolve_1.default)({
                        rootDir: path_1.default.join(config_1.default.themeRoot, config_1.default.nodeModules),
                        browser: true,
                    }),
                    (0, rollup_plugin_inject_process_env_1.default)({
                        NODE_ENV: process.env.NODE_ENV,
                    }),
                ],
            })),
            // Dynamically build vendor bundles discovered via vendor.*.ts
            ...glob_1.glob.sync(vendorEntries).map((file) => {
                const base = path_1.default.basename(file).replace(/\.ts$/, '');
                return {
                    input: file,
                    output: [
                        {
                            dir: path_1.default.join(config_1.default.themeRoot, config_1.default.dist.assets),
                            format: 'es',
                            interop: 'auto',
                            name: base,
                            sourcemap: 'inline',
                            entryFileNames: '[name].js',
                        },
                    ],
                    plugins: [
                        (0, rollup_plugin_esbuild_1.default)(esbuildConfig),
                        (0, plugin_node_resolve_1.default)({
                            rootDir: path_1.default.join(config_1.default.themeRoot, config_1.default.nodeModules),
                            browser: true,
                        }),
                        (0, rollup_plugin_inject_process_env_1.default)({
                            NODE_ENV: process.env.NODE_ENV,
                        }),
                    ],
                };
            }),
        ],
        production: [
            ...glob_1.glob.sync(themeEntries).map((file) => ({
                input: file,
                external,
                output: [
                    {
                        dir: path_1.default.join(config_1.default.themeRoot, config_1.default.dist.assets),
                        format: 'es',
                        interop: 'auto',
                        name: 'themeDevelopment',
                        sourcemap: false,
                        entryFileNames: '[name].js',
                    },
                ],
                plugins: [
                    (0, rollup_plugin_esbuild_1.default)(esbuildConfig),
                    (0, plugin_node_resolve_1.default)({
                        rootDir: path_1.default.join(config_1.default.themeRoot, config_1.default.nodeModules),
                        browser: true,
                    }),
                    (0, rollup_plugin_inject_process_env_1.default)({
                        NODE_ENV: process.env.NODE_ENV,
                    }),
                ],
            })),
            // Dynamically build vendor bundles in production
            ...glob_1.glob.sync(vendorEntries).map((file) => {
                const base = path_1.default.basename(file).replace(/\.ts$/, '');
                return {
                    input: file,
                    output: [
                        {
                            dir: path_1.default.join(config_1.default.themeRoot, config_1.default.dist.assets),
                            format: 'es',
                            interop: 'auto',
                            name: base,
                            sourcemap: false,
                            entryFileNames: '[name].js',
                        },
                    ],
                    plugins: [
                        (0, rollup_plugin_esbuild_1.default)(esbuildConfig),
                        (0, plugin_node_resolve_1.default)({
                            rootDir: path_1.default.join(config_1.default.themeRoot, config_1.default.nodeModules),
                            browser: true,
                        }),
                        (0, rollup_plugin_inject_process_env_1.default)({
                            NODE_ENV: process.env.NODE_ENV,
                        }),
                    ],
                };
            }),
        ],
    };
}
/**
 * Returns Rollup configs for theme and vendor bundles. Pass `externalPackages`
 * to control which imports are treated as external (loaded at runtime instead of bundled).
 */
function getBaseRollupConfig(options) {
    const externalPackages = options?.externalPackages ?? [];
    const environmentConfigs = buildEnvironmentConfigs(externalPackages);
    const env = process.env.NODE_ENV || 'development';
    return environmentConfigs[env] || environmentConfigs.development;
}
exports.getBaseRollupConfig = getBaseRollupConfig;
exports.default = getBaseRollupConfig();
