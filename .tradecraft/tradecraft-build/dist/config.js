"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const find_root_1 = __importDefault(require("find-root"));
const fancy_log_1 = __importDefault(require("fancy-log"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const yargs_1 = __importDefault(require("yargs"));
const argv = yargs_1.default.argv;
const isProduction = process.env.NODE_ENV === 'production';
const workingDirectory = process.cwd();
let stripTestIds = isProduction;
const themeRoot = (0, find_root_1.default)(workingDirectory);
let pkg = {};
if ('stripTestIds' in argv) {
    stripTestIds = argv.stripTestIds !== 'false';
    if (stripTestIds) {
        (0, fancy_log_1.default)(ansi_colors_1.default.red(`️Stripping test ids`));
    }
}
try {
    pkg = require(path_1.default.join(themeRoot, 'package.json'));
}
catch (err) {
    (0, fancy_log_1.default)(ansi_colors_1.default.red(String(err)));
}
/**
 * Walk up from `themeRoot` to the workspace root (the first package.json with a
 * `workspaces` field; the monorepo keeps that field under pnpm for this lookup).
 * In a monorepo the theme runs from e.g. themes/analog, so `themeRoot` is the
 * theme dir, not the repo root where dependencies hoist to.
 */
function findWorkspaceRoot(start) {
    let dir = start;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            const p = require(path_1.default.join(dir, 'package.json'));
            if (p && p.workspaces)
                return dir;
        }
        catch {
            // no package.json here; keep walking up
        }
        const parent = path_1.default.dirname(dir);
        if (parent === dir)
            return null;
        dir = parent;
    }
}
const workspaceRoot = findWorkspaceRoot(themeRoot);
/**
 * Glob of locally linked packages' built output to watch for hot reload.
 * - Monorepo: workspace deps hoist to <workspaceRoot>/node_modules/@scope/*
 *   as symlinks into packages/*; watch their dist (absolute path, chokidar
 *   follows the symlink) so a workspace rebuild (e.g. tradecraft-ui `tsc -w`)
 *   triggers a gulp rebuild + hot reload.
 * - Standalone (no workspaces): fall back to the legacy yalc copy location.
 */
const linkedPackagesGlob = workspaceRoot
    ? // Watch only the consumable build output (.js + templates), not .d.ts —
        // tradecraft-ui's tsc emits .d.ts alongside .js and Rollup ignores them, so
        // watching them would just trigger redundant rebundles.
        path_1.default.join(workspaceRoot, 'node_modules', '@groupthought', '*', 'dist', '**', '*.{js,liquid,json}')
    : '.yalc/**/*.{js,ts,liquid,json}';
exports.default = {
    themeRoot,
    packageJson: pkg,
    yalc: linkedPackagesGlob,
    tailwindConfig: 'tailwind.config.{js,ts}',
    tailwindDistConfig: 'tailwind.config.dist.{js,ts}',
    constants: 'constants.{json,yml}',
    stripTestIds,
    src: {
        root: 'src',
        assets: 'src/assets/*',
        claude: 'src/claude/**/*',
        shopifyIgnore: 'src/.shopifyignore',
        js: 'src/js',
        css: 'src/css',
        jsTemplates: 'src/**/*.js.liquid',
        notes: 'src/release-notes.md',
        cssTemplates: 'src/**/*.css.liquid',
        svgTemplates: 'src/**/*.svg.liquid',
        icons: 'src/icons/**/*.svg',
        templates: 'src/templates/**/*.{liquid,json}',
        static: 'src/static',
        snippets: 'src/snippets/**/*.{liquid,json}',
        sections: 'src/sections/**/*.{liquid,json}',
        blocks: 'src/blocks/*.liquid',
        locales: 'src/locales/*',
        config: 'src/config/*',
        layout: 'src/layout/*',
        liquidTemplates: 'src/**/*.liquid',
        staticLiquidTemplates: 'src/static/**/*.liquid',
        cssTheme: 'src/css/theme.{css,scss}',
        listings: 'src/listings/**/*.json',
    },
    environmentBase: 'environments',
    listingBase: 'src/listings',
    nodeModules: 'node_modules',
    dist: {
        root: 'dist',
        assets: 'dist/assets',
        snippets: 'dist/snippets',
    },
    upload: {
        root: 'upload/',
    },
};
