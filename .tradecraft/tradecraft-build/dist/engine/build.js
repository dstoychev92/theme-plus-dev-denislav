"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.assertCompleteStaging = exports.createContext = exports.STAGING_DIRECTORY = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const pipelines_js_1 = require("./pipelines.js");
const format_js_1 = require("./format.js");
const sync_js_1 = require("./sync.js");
/** Staging sits inside the theme so a rename into dist stays on one filesystem. */
exports.STAGING_DIRECTORY = path_1.default.join('.tradecraft-build', 'staging');
function createContext(themeRoot, options, packageName) {
    return { themeRoot, staging: path_1.default.join(themeRoot, exports.STAGING_DIRECTORY), options, packageName };
}
exports.createContext = createContext;
function label(name, count) {
    return `${name} ${count}`;
}
/** Refuse incomplete output before the sync can delete files from dist. */
async function assertCompleteStaging(staging) {
    let entries = [];
    try {
        entries = await promises_1.default.readdir(path_1.default.join(staging, 'layout'));
    }
    catch {
        entries = [];
    }
    if (entries.some((name) => name.endsWith('.liquid')))
        return;
    throw new Error('staging has no layout/*.liquid, so dist was left untouched.');
}
exports.assertCompleteStaging = assertCompleteStaging;
/**
 * Build the theme into staging, then copy the changed files into dist.
 *
 * Nothing writes to dist until every pipeline has finished, so a failed build
 * leaves the last good output in place and the Shopify CLI keeps serving it.
 */
async function build(context, options = {}) {
    const startedAt = Date.now();
    const logPath = path_1.default.join(context.themeRoot, '.tradecraft-build', 'build.log');
    await promises_1.default.mkdir(path_1.default.dirname(logPath), { recursive: true });
    const record = (message) => promises_1.default.appendFile(logPath, `${new Date().toISOString()} pid=${process.pid} ${message}\n`);
    const { command, environment, settings, listing, production } = context.options;
    await record(`START ${JSON.stringify({ command, environment, settings, listing, production })}`);
    // Older watchers still use staging. A private folder keeps their cleanup away.
    context = { ...context, staging: await promises_1.default.mkdtemp(`${context.staging}-`) };
    try {
        return await compile(context, options, startedAt, record);
    }
    catch (error) {
        await record(`ERROR ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
    finally {
        await promises_1.default.rm(context.staging, { recursive: true, force: true });
    }
}
exports.build = build;
async function compile(context, options, startedAt, record) {
    const pipelines = [
        (0, pipelines_js_1.compileStyles)(context),
        (0, pipelines_js_1.bundleJavaScript)(context),
        (0, pipelines_js_1.copyAssets)(context),
        (0, pipelines_js_1.copyIcons)(context),
        // Settings must land on top of the theme's own files, so these two run in order.
        (0, pipelines_js_1.compileThemeFiles)(context).then(async (count) => count + (await (0, pipelines_js_1.copyEnvironmentSettings)(context))),
    ];
    const [styles, javascript, assets, icons, themeFiles] = await Promise.all(pipelines).catch(async (error) => {
        // Let every writer finish before removing this build's private staging folder.
        await Promise.allSettled(pipelines);
        throw error;
    });
    if (options.listings)
        await (0, pipelines_js_1.copyListings)(context);
    await (0, format_js_1.formatOutput)(context.staging, context.themeRoot, context.options.production);
    await assertCompleteStaging(context.staging);
    const distRoot = path_1.default.join(context.themeRoot, 'dist');
    await promises_1.default.mkdir(distRoot, { recursive: true });
    const result = await (0, sync_js_1.syncIntoDist)(context.staging, distRoot);
    console.log([
        label('css', styles),
        label('js', javascript),
        label('theme', themeFiles),
        label('assets', assets),
        label('icons', icons),
        `| written ${result.written.length}, deleted ${result.deleted.length}, unchanged ${result.unchanged}`,
    ].join(' '));
    await record(`OK written=${result.written.length} deleted=${result.deleted.length} unchanged=${result.unchanged}`);
    return { ...result, milliseconds: Date.now() - startedAt };
}
