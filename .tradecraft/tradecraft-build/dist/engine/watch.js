"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const picomatch_1 = __importDefault(require("picomatch"));
const build_js_1 = require("./build.js");
/**
 * Rebuild when a source file changes.
 *
 * chokidar 5 removed glob support, so the watcher takes directories and every
 * pattern is matched here instead.
 */
const WATCHED_DIRECTORIES = ['src', 'environments', 'tailwind'];
const WATCHED_FILES = ['tailwind.config.ts', 'tailwind.config.js', 'constants.yml', 'constants.json', 'postcss.config.js', 'rollup.config.js'];
/**
 * The dist folder of every @groupthought package the theme can see.
 *
 * A theme inside this monorepo resolves the packages two levels up; a theme
 * installed on its own resolves its own node_modules, so both are looked at.
 *
 * Each package's dist rather than the package: in the monorepo these entries
 * are symlinks into packages/, so watching the package means watching its src
 * and its node_modules as well. A save in tradecraft-ui's src would then rebuild
 * the theme before tradecraft-ui had written the output the theme actually reads.
 */
function sharedPackageOutputs(themeRoot) {
    const roots = [
        path_1.default.join(themeRoot, '..', '..', 'node_modules', '@groupthought'),
        path_1.default.join(themeRoot, 'node_modules', '@groupthought'),
    ].filter((candidate) => fs_1.default.existsSync(candidate));
    return roots.flatMap((root) => fs_1.default
        .readdirSync(root)
        .map((packageName) => path_1.default.join(root, packageName, 'dist'))
        .filter((candidate) => fs_1.default.existsSync(candidate)));
}
/** A rebuild takes seconds, so collapse a burst of saves into one run. */
function debounce(run, milliseconds) {
    let timer;
    return () => {
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(run, milliseconds);
    };
}
async function watch(context) {
    // chokidar 5 ships as an ES module, and this package still builds to CommonJS.
    const chokidar = await import('chokidar');
    const isIgnored = context.options.ignore.length > 0 ? (0, picomatch_1.default)(context.options.ignore) : () => false;
    const targets = [
        ...WATCHED_DIRECTORIES.map((directory) => path_1.default.join(context.themeRoot, directory)),
        ...WATCHED_FILES.map((file) => path_1.default.join(context.themeRoot, file)),
        // A shared package rebuild must reach the theme, so watch what they publish
        ...sharedPackageOutputs(context.themeRoot),
    ];
    let building = false;
    let queued = false;
    async function rebuild() {
        if (building) {
            queued = true;
            return;
        }
        building = true;
        try {
            const report = await (0, build_js_1.build)(context);
            console.log(`rebuilt in ${report.milliseconds}ms`);
        }
        catch (error) {
            // Keep watching. The last good output stays in dist.
            console.error(String(error instanceof Error ? error.message : error));
        }
        finally {
            building = false;
            if (queued) {
                queued = false;
                void rebuild();
            }
        }
    }
    const watcher = chokidar.watch(targets, {
        ignoreInitial: true,
        ignored: (file) => {
            const relative = path_1.default.relative(context.themeRoot, file);
            // Match the folder itself or something inside it. A bare prefix check
            // would also catch a source file named dist-anything.
            const inside = (folder) => relative === folder || relative.startsWith(folder + path_1.default.sep);
            if (inside('.tradecraft-build') || inside('dist'))
                return true;
            if (/(^|[\\/])(node_modules|\.git)([\\/]|$)/.test(relative) && !relative.includes('@groupthought'))
                return true;
            return isIgnored(relative);
        },
    });
    const trigger = debounce(() => void rebuild(), 60);
    watcher.on('add', trigger).on('change', trigger).on('unlink', trigger);
    console.log('watching for changes');
}
exports.watch = watch;
