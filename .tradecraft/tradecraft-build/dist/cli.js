"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const fs_1 = __importDefault(require("fs"));
const url_1 = require("url");
const path_1 = __importDefault(require("path"));
const module_1 = require("module");
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const options_js_1 = require("./engine/options.js");
const build_js_1 = require("./engine/build.js");
const watch_js_1 = require("./engine/watch.js");
const lock_js_1 = require("./engine/lock.js");
const pull_js_1 = require("./engine/pull.js");
const shopify_js_1 = require("./shopify.js");
const USAGE = `tradecraft-build <command> [options]

  build     compile the theme into dist
  watch     compile, then rebuild on change and run \`shopify theme dev\`
  pull      run \`shopify theme pull\`, then write the store's JSON into its settings folder

  -e, --env <name>          Shopify CLI environment (default: development, required by pull)
  -s, --settings <name>     settings folder environments/<name> to copy over the theme,
                            or the folder pull writes into (default: the -e name)
      --settings-path <dir> a settings folder anywhere, such as ../store, in place of -s
  -p, --port <number>       port for \`shopify theme dev\` (default: 9000)
      --ignore <glob>       exclude files from the build (repeatable)
      --ignore-path <file>  read excludes from a gitignore-style file

  pull reads -e, -s, and --settings-path only. It passes every other flag to
  \`shopify theme pull\`, for example --theme=<id> or --live.

  Upload a project with the Tradecraft CLI: tradecraft preview, tradecraft ship.
`;
/** The commands and flags that belong to Groupthought's release tools, in method-tools */
const INTERNAL_COMMANDS = new Set(['deploy', 'zip']);
function usesInternalTools(argv) {
    if (INTERNAL_COMMANDS.has(argv[0]))
        return true;
    if (argv[0] === 'pull')
        return false;
    return argv.slice(1).some((argument) => options_js_1.INTERNAL_FLAGS.has(argument.replace(/^-+/, '').split('=')[0]));
}
/**
 * The Groupthought monorepo's method-tools, found by walking up from the theme. A project
 * outside the monorepo has none.
 */
function internalTools(startDirectory) {
    for (let directory = startDirectory;; directory = path_1.default.dirname(directory)) {
        const candidate = path_1.default.join(directory, 'packages', 'method-tools', 'build', 'internal.mjs');
        if (fs_1.default.existsSync(candidate))
            return candidate;
        if (path_1.default.dirname(directory) === directory)
            return null;
    }
}
function findThemeRoot(startDirectory) {
    let directory = startDirectory;
    while (true) {
        if (fs_1.default.existsSync(path_1.default.join(directory, 'package.json')))
            return directory;
        const parent = path_1.default.dirname(directory);
        if (parent === directory)
            throw new Error('no package.json found above the working directory');
        directory = parent;
    }
}
async function run(argv) {
    if (usesInternalTools(argv)) {
        const tools = internalTools(process.cwd());
        if (!tools) {
            console.error(`tradecraft-build ${argv[0]}: deploy, zip, --listing, and --index are Groupthought release tools, and this project does not have them.\nUpload a project with the Tradecraft CLI: tradecraft preview, or tradecraft ship for the live theme.`);
            process.exitCode = 2;
            return;
        }
        const internal = await import((0, url_1.pathToFileURL)(tools).href);
        await internal.run(argv, { themeRoot: findThemeRoot(process.cwd()) });
        return;
    }
    let options;
    // A parse error means the command line is wrong, so print the reason alone.
    // A stack trace here buries the one sentence that says how to fix it.
    try {
        options = (0, options_js_1.parseOptions)(argv);
    }
    catch (error) {
        console.error(error instanceof Error ? error.message : String(error));
        process.exitCode = 2;
        return;
    }
    if (options.command === 'help' || options.command === '--help') {
        console.log(USAGE);
        return;
    }
    const themeRoot = findThemeRoot(process.cwd());
    // A pull writes only the settings folder, which a watcher rebuilds from like any
    // source edit, so it takes no build lock
    if (options.command === 'pull') {
        try {
            await (0, pull_js_1.pull)(themeRoot, options);
        }
        catch (error) {
            if (!(error instanceof pull_js_1.PullError))
                throw error;
            console.error(ansi_colors_1.default.red(error.message));
            process.exitCode = 1;
        }
        return;
    }
    const require = (0, module_1.createRequire)(path_1.default.join(themeRoot, 'package.json'));
    const packageJson = require(path_1.default.join(themeRoot, 'package.json'));
    const context = (0, build_js_1.createContext)(themeRoot, options, packageJson.name);
    if (!['build', 'watch'].includes(options.command)) {
        console.error(`unknown command: ${options.command}\n`);
        console.log(USAGE);
        process.exitCode = 2;
        return;
    }
    // One owner per theme keeps competing settings out of the same dist folder.
    let release = async () => { };
    try {
        release = await (0, lock_js_1.acquireBuildLock)(themeRoot);
        await (0, lock_js_1.assertNoExistingWatcher)(themeRoot);
        switch (options.command) {
            case 'build': {
                await (0, build_js_1.build)(context);
                return;
            }
            case 'watch': {
                // The Shopify CLI deletes store files whose local copy disappears, so a
                // second dev server on this port would fight this one over the theme.
                await (0, shopify_js_1.checkForShopifyDevProcess)(options.port);
                await (0, build_js_1.build)(context);
                await (0, watch_js_1.watch)(context);
                // The watcher keeps the lock until it exits.
                release = async () => { };
                await (0, shopify_js_1.startShopifyDevProcesses)(options.environment, options.port, options.passthrough);
                return;
            }
        }
    }
    catch (error) {
        if (!(error instanceof lock_js_1.BuildLockedError))
            throw error;
        console.error(ansi_colors_1.default.red(error.message));
        process.exitCode = 3;
    }
    finally {
        await release();
    }
}
exports.run = run;
