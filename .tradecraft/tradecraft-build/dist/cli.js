"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const module_1 = require("module");
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const options_js_1 = require("./engine/options.js");
const build_js_1 = require("./engine/build.js");
const watch_js_1 = require("./engine/watch.js");
const lock_js_1 = require("./engine/lock.js");
const zip_js_1 = require("./engine/zip.js");
const pull_js_1 = require("./engine/pull.js");
const shopify_js_1 = require("./shopify.js");
const USAGE = `tradecraft-build <command> [options]

  build     compile the theme into dist
  watch     compile, then rebuild on change and run \`shopify theme dev\`
  deploy    compile, then run \`shopify theme push\`
  zip       compile with listings and write a zip into upload/
  pull      run \`shopify theme pull\`, then write the store's JSON into environments/

  -e, --env <name>        Shopify CLI environment (default: development, required by pull)
  -s, --settings <name>   environment settings folder to copy over the theme,
                          or the folder pull writes into (default: the -e name)
  -l, --listing <name>    listing settings folder to copy over the theme
  -p, --port <number>     port for \`shopify theme dev\` (default: 9000)
      --ignore <glob>     exclude files from the build (repeatable)
      --ignore-path <file>  read excludes from a gitignore-style file
      --index=false       add a noindex meta tag (deploy to a demo store only)

  pull reads -e and -s only. It passes every other flag to \`shopify theme pull\`,
  for example --theme=<id> or --live.
`;
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
const RULE = '='.repeat(62);
/**
 * Say it loudly, and name the store. The tag hides every page from search
 * engines, so a deploy aimed at the wrong environment costs that store its
 * search traffic.
 */
function warnAboutNoIndex(environment) {
    console.error(ansi_colors_1.default.red(RULE));
    console.error(ansi_colors_1.default.red("  Found '--index=false' in your command."));
    console.error(ansi_colors_1.default.white(`  Deploying to the "${environment}" environment.`));
    console.error('');
    console.error(ansi_colors_1.default.white('  This goes into the <head> of every page:'));
    console.error(ansi_colors_1.default.yellow('  <meta name="robots" content="noindex, nofollow">'));
    console.error('');
    console.error(ansi_colors_1.default.red('  ==== USE INDEX=FALSE FOR THEME DEMOS ONLY ===='));
    console.error(ansi_colors_1.default.red(RULE));
}
/** List the built files that carry the tag, so the report proves it landed. */
async function findNoIndexFiles(distRoot) {
    const entries = await promises_1.default.readdir(distRoot, { recursive: true, withFileTypes: true });
    const found = [];
    await Promise.all(entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.liquid'))
        .map(async (entry) => {
        const full = path_1.default.join(entry.parentPath ?? entry.path, entry.name);
        const contents = await promises_1.default.readFile(full, 'utf8');
        if (contents.includes('name="robots"'))
            found.push(path_1.default.relative(distRoot, full));
    }));
    return found.sort();
}
/**
 * Report what the build actually produced. The opening banner states an intent,
 * and a page with no <head> never receives the tag, so read dist back instead of
 * repeating the flag.
 */
async function reportNoIndex(themeRoot, environment) {
    const files = await findNoIndexFiles(path_1.default.join(themeRoot, 'dist'));
    console.error(ansi_colors_1.default.red(RULE));
    if (files.length === 0) {
        console.error(ansi_colors_1.default.yellow('  NOINDEX: the build produced no page carrying the tag.'));
        console.error(ansi_colors_1.default.white('  Check layout/theme.liquid for its <head> before you push.'));
    }
    else {
        console.error(ansi_colors_1.default.red(`  NOINDEX: ${files.length} built page(s) carry the tag.`));
        for (const file of files)
            console.error(ansi_colors_1.default.white(`    ${file}`));
        console.error('');
        console.error(ansi_colors_1.default.white(`  Pushing them to "${environment}" hides that store from search engines.`));
    }
    console.error(ansi_colors_1.default.red(RULE));
}
async function run(argv) {
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
    if (options.noIndex)
        warnAboutNoIndex(options.environment);
    const themeRoot = findThemeRoot(process.cwd());
    // A pull writes only environments/, which a watcher rebuilds from like any
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
    if (!['build', 'watch', 'deploy', 'zip'].includes(options.command)) {
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
            case 'deploy': {
                await (0, build_js_1.build)(context);
                if (options.noIndex)
                    await reportNoIndex(themeRoot, options.environment);
                await (0, shopify_js_1.deployShopifyStore)(options.environment, options.passthrough);
                return;
            }
            case 'zip': {
                await (0, build_js_1.build)(context, { listings: true });
                const target = await (0, zip_js_1.createZip)(themeRoot, packageJson.name, packageJson.version, options.dev);
                console.log(`wrote ${path_1.default.relative(themeRoot, target)}`);
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
