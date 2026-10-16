"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOptions = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ALIASES = {
    e: 'env',
    environment: 'env',
    s: 'settings',
    l: 'listing',
    p: 'port',
};
/**
 * Commands that accept `--index=false`. Only a demo-store release needs the tag,
 * and every other command writes files a merchant can install.
 */
const NO_INDEX_COMMANDS = new Set(['deploy']);
/** The flags `pull` reads. Every other flag goes to `shopify theme pull`, -l (--live) included. */
const PULL_FLAGS = new Set(['env', 'settings']);
const PULL_USAGE = 'tradecraft-build pull -e <environment> [-s <settings folder>] [shopify theme pull flags]';
/**
 * A pull replaces files in environments/<folder>, so it needs a named store and
 * a folder that stays inside environments/.
 */
function assertPullTarget(values) {
    const { env, settings } = values;
    if (typeof env !== 'string' || env === '') {
        throw new Error(`tradecraft-build pull: name the environment to pull from with -e <environment>.\nUsage: ${PULL_USAGE}`);
    }
    const folder = settings ?? env;
    if (typeof folder !== 'string' || !/^[^/\\]+$/.test(folder) || folder === '.' || folder === '..') {
        throw new Error(`tradecraft-build pull: -s needs one folder name inside environments/, not "${String(folder)}".`);
    }
}
/**
 * Refuse `--index=false` outside a deploy, since a zip or a dist built with the
 * tag hides the merchant's whole store from search engines.
 */
function assertNoIndexIsAllowed(command, noIndex) {
    if (!noIndex || NO_INDEX_COMMANDS.has(command))
        return;
    throw new Error([
        `tradecraft-build ${command}: --index=false works on the deploy command only.`,
        'The flag adds <meta name="robots" content="noindex, nofollow"> to every page.',
        `A ${command} writes files a merchant can install, so this command refuses the flag.`,
        'Release a Shopify Theme Store demo store with: tradecraft-build deploy --index=false',
    ].join('\n'));
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
        if (command === 'pull' && !PULL_FLAGS.has(name)) {
            passthrough.push(argument);
            continue;
        }
        // A following bare word is this flag's value for the flags that take one.
        if (value === true && ['env', 'settings', 'listing', 'port', 'ignore', 'ignore-path'].includes(name)) {
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
        if (['env', 'settings', 'listing', 'port', 'dev', 'index', 'stripTestIds', 'vis'].includes(name)) {
            values[name] = value;
            continue;
        }
        passthrough.push(argument);
    }
    const production = process.env.NODE_ENV === 'production';
    const noIndex = values.index === 'false';
    assertNoIndexIsAllowed(command, noIndex);
    if (command === 'pull')
        assertPullTarget(values);
    return {
        command,
        environment: values.env ?? 'development',
        settings: values.settings,
        listing: values.listing,
        port: Number(values.port ?? 9000),
        dev: values.dev === true || values.dev === 'true',
        production,
        noIndex,
        stripTestIds: 'stripTestIds' in values ? values.stripTestIds !== 'false' : production,
        ignore,
        passthrough,
    };
}
exports.parseOptions = parseOptions;
