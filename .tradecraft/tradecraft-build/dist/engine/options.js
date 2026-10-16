"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOptions = exports.INTERNAL_FLAGS = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ALIASES = {
    e: 'env',
    environment: 'env',
    s: 'settings',
    p: 'port',
};
/** Groupthought release options, which method-tools handles in this monorepo */
exports.INTERNAL_FLAGS = new Set(['l', 'listing', 'index']);
/** The flags `pull` reads. Every other flag goes to `shopify theme pull`, -l (--live) included. */
const PULL_FLAGS = new Set(['env', 'settings', 'settings-path']);
const PULL_USAGE = 'tradecraft-build pull -e <environment> [-s <settings folder> | --settings-path <folder>] [shopify theme pull flags]';
/**
 * A pull replaces files in environments/<folder>, so it needs a named store and
 * a folder that stays inside environments/.
 */
function assertPullTarget(values) {
    const { env, settings } = values;
    if (typeof env !== 'string' || env === '') {
        throw new Error(`tradecraft-build pull: name the environment to pull from with -e <environment>.\nUsage: ${PULL_USAGE}`);
    }
    if (typeof values['settings-path'] === 'string')
        return;
    const folder = settings ?? env;
    if (typeof folder !== 'string' || !/^[^/\\]+$/.test(folder) || folder === '.' || folder === '..') {
        throw new Error(`tradecraft-build pull: -s needs one folder name inside environments/, not "${String(folder)}".`);
    }
}
/** Read a gitignore-style file into a list of glob patterns. */
function readIgnoreFile(filePath) {
    const contents = fs_1.default.readFileSync(path_1.default.resolve(filePath), 'utf-8');
    return contents
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith('#'));
}
/**
 * Parse the flags the themes use. Anything unrecognised goes to `passthrough`,
 * since `tradecraft-build watch -- --theme-editor-sync` must reach the Shopify CLI.
 */
function parseOptions(argv) {
    const [command = 'build', ...rest] = argv;
    const values = {};
    const ignore = [];
    const passthrough = [];
    for (let index = 0; index < rest.length; index += 1) {
        const argument = rest[index];
        if (!argument.startsWith('-')) {
            passthrough.push(argument);
            continue;
        }
        const withoutDashes = argument.replace(/^-+/, '');
        const equals = withoutDashes.indexOf('=');
        let name = equals === -1 ? withoutDashes : withoutDashes.slice(0, equals);
        let value = equals === -1 ? true : withoutDashes.slice(equals + 1);
        name = ALIASES[name] ?? name;
        if (command !== 'pull' && exports.INTERNAL_FLAGS.has(name)) {
            throw new Error(`tradecraft-build: --${name} is a Groupthought release option. It runs only inside the Groupthought monorepo.`);
        }
        if (command === 'pull' && !PULL_FLAGS.has(name)) {
            passthrough.push(argument);
            continue;
        }
        // A following bare word is this flag's value for the flags that take one.
        if (value === true && ['env', 'settings', 'settings-path', 'port', 'ignore', 'ignore-path'].includes(name)) {
            const next = rest[index + 1];
            if (next && !next.startsWith('-')) {
                value = next;
                index += 1;
            }
        }
        if (name === 'ignore') {
            ignore.push(String(value));
            continue;
        }
        if (name === 'ignore-path') {
            ignore.push(...readIgnoreFile(String(value)));
            continue;
        }
        if (['env', 'settings', 'settings-path', 'port', 'dev', 'stripTestIds', 'vis'].includes(name)) {
            values[name] = value;
            continue;
        }
        passthrough.push(argument);
    }
    const production = process.env.NODE_ENV === 'production';
    if (command === 'pull')
        assertPullTarget(values);
    return {
        command,
        environment: values.env ?? 'development',
        settings: values.settings,
        settingsPath: values['settings-path'],
        port: Number(values.port ?? 9000),
        dev: values.dev === true || values.dev === 'true',
        production,
        stripTestIds: 'stripTestIds' in values ? values.stripTestIds !== 'false' : production,
        ignore,
        passthrough,
    };
}
exports.parseOptions = parseOptions;
