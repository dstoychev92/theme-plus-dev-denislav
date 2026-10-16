"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pull = exports.themeFormatter = exports.writePulledSettings = exports.PullError = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const tinyglobby_1 = require("tinyglobby");
const format_js_1 = require("./format.js");
const shopify_js_1 = require("../shopify.js");
const pipelines_js_1 = require("./pipelines.js");
/**
 * Pull a store's theme editor JSON into environments/<folder>.
 *
 * The repo is the only record of the store, so the pulled files replace the
 * folder's settings files. The Shopify CLI writes into a temp folder, and the
 * environment folder changes only after every pulled file has parsed.
 */
/** The patterns for `shopify theme pull --only`. */
const ONLY = ['sections/*.json', 'templates/*.json', 'templates/customers/*.json', 'config/settings_data.json'];
/**
 * Every path those patterns return, so every path a pull replaces. The Shopify
 * CLI also matches templates/*.json one folder down: customers and metaobject.
 */
const PULLED_FILES = ['config/settings_data.json', 'sections/*.json', 'templates/*.json', 'templates/*/*.json'];
const SETTINGS_DATA = 'config/settings_data.json';
/** The auto-generated comment block Shopify puts at the top of a JSON file. */
const BANNER = /^\s*\/\*[\s\S]*?\*\/\s*/;
/** A pull that stopped before it changed the environment folder. */
class PullError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PullError';
    }
}
exports.PullError = PullError;
function parseJson(text) {
    return JSON.parse(text.replace(BANNER, ''));
}
function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function removeEmptySettings(value) {
    if (Array.isArray(value))
        return value.map(removeEmptySettings);
    if (!isObject(value))
        return value;
    return Object.fromEntries(Object.entries(value)
        .map(([key, child]) => [key, removeEmptySettings(child)])
        .filter(([key, child]) => !(key === 'settings' && isObject(child) && Object.keys(child).length === 0)));
}
/** A src file that is missing or does not parse never matches a pulled file. */
async function readSource(filePath) {
    try {
        return removeEmptySettings(parseJson(await promises_1.default.readFile(filePath, 'utf-8')));
    }
    catch {
        return undefined;
    }
}
/**
 * Write the pulled files over the environment folder's settings files. `format`
 * gets each file's final path, so the theme's prettier config resolves for it.
 */
async function writePulledSettings(pulledRoot, sourceRoot, environmentRoot, format) {
    const pulled = (await (0, tinyglobby_1.glob)(PULLED_FILES, { cwd: pulledRoot, onlyFiles: true })).sort();
    // The CLI exits 0 with no files when you decline its prompt, and an empty
    // pull would delete every settings file in the folder
    if (pulled.length === 0)
        throw new PullError('The pull returned no settings files.');
    const outputs = new Map();
    const dropped = [];
    for (const file of pulled) {
        const text = await promises_1.default.readFile(path_1.default.join(pulledRoot, file), 'utf-8');
        let value;
        try {
            value = parseJson(text);
        }
        catch (error) {
            throw new PullError(`${file} from the store is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
        }
        if (file === SETTINGS_DATA) {
            // A string names the preset that holds the store's values, so the presets stay
            if (isObject(value) && typeof value.current !== 'string')
                delete value.presets;
        }
        else {
            value = removeEmptySettings(value);
            // readSource cleans src the same way, since src files carry empty settings too
            if ((0, util_1.isDeepStrictEqual)(value, await readSource(path_1.default.join(sourceRoot, file)))) {
                dropped.push(file);
                continue;
            }
        }
        outputs.set(file, await format(JSON.stringify(value, null, 2), path_1.default.join(environmentRoot, file)));
    }
    const result = { written: [], deleted: [], unchanged: 0, dropped };
    const existing = await (0, tinyglobby_1.glob)(PULLED_FILES, { cwd: environmentRoot, onlyFiles: true });
    for (const file of existing.filter((name) => !outputs.has(name)).sort()) {
        await promises_1.default.rm(path_1.default.join(environmentRoot, file), { force: true });
        result.deleted.push(file);
    }
    for (const [file, contents] of outputs) {
        const destination = path_1.default.join(environmentRoot, file);
        const current = await promises_1.default.readFile(destination, 'utf-8').catch(() => undefined);
        if (current === contents) {
            result.unchanged += 1;
            continue;
        }
        await promises_1.default.mkdir(path_1.default.dirname(destination), { recursive: true });
        await promises_1.default.writeFile(destination, contents);
        result.written.push(file);
    }
    return result;
}
exports.writePulledSettings = writePulledSettings;
/** The theme's own prettier and config, so a pull matches the theme's format script. */
function themeFormatter(themeRoot) {
    const prettier = (0, format_js_1.loadPrettier)(themeRoot);
    return async (source, filePath) => {
        const config = (await prettier.resolveConfig(filePath)) ?? {};
        return prettier.format(source, { ...config, filepath: filePath });
    };
}
exports.themeFormatter = themeFormatter;
/** Pull the -e store into its settings folder, then print what changed. */
async function pull(themeRoot, options) {
    const absolute = (0, pipelines_js_1.settingsFolder)(themeRoot, { settings: options.settings ?? options.environment, settingsPath: options.settingsPath });
    const folder = path_1.default.relative(themeRoot, absolute);
    const scratch = path_1.default.join(themeRoot, '.tradecraft-build');
    await promises_1.default.mkdir(scratch, { recursive: true });
    // Inside the theme, since the CLI finds shopify.theme.toml by walking up from --path
    const pulledRoot = await promises_1.default.mkdtemp(path_1.default.join(scratch, 'pull-'));
    try {
        await (0, shopify_js_1.pullShopifyTheme)(options.environment, themeRoot, [
            // A command-line --ignore replaces the environment's toml ignore list,
            // which often skips exactly these files
            '--ignore=false',
            ...ONLY.map((pattern) => `--only=${pattern}`),
            `--path=${path_1.default.relative(themeRoot, pulledRoot)}`,
            ...options.passthrough,
        ]).catch((error) => {
            throw new PullError(error instanceof Error ? error.message : String(error));
        });
        const result = await writePulledSettings(pulledRoot, path_1.default.join(themeRoot, 'src'), path_1.default.join(themeRoot, folder), themeFormatter(themeRoot));
        console.log(`${folder} | written ${result.written.length}, deleted ${result.deleted.length}, ` +
            `unchanged ${result.unchanged}, dropped ${result.dropped.length} identical to src/`);
        return result;
    }
    catch (error) {
        if (error instanceof PullError)
            throw new PullError(`${error.message}\n${folder} is unchanged.`);
        throw error;
    }
    finally {
        await promises_1.default.rm(pulledRoot, { recursive: true, force: true });
    }
}
exports.pull = pull;
