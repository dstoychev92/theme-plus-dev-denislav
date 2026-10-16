"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyEnvironmentSettings = exports.settingsFolder = exports.copyIcons = exports.copyAssets = exports.compileThemeFiles = exports.compileStyles = exports.bundleJavaScript = exports.copyThemeFiles = exports.buildMode = void 0;
const fs_1 = require("fs");
const url_1 = require("url");
const mode_js_1 = require("./mode.js");
var mode_js_2 = require("./mode.js");
Object.defineProperty(exports, "buildMode", { enumerable: true, get: function () { return mode_js_2.buildMode; } });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const module_1 = require("module");
const tinyglobby_1 = require("tinyglobby");
const postcss_1 = __importDefault(require("postcss"));
const transforms_js_1 = require("./transforms.js");
const liquid_js_1 = require("../liquid.js");
const transforms_js_2 = require("./transforms.js");
/**
 * Copy every theme file under src/ unchanged.
 */
async function copyThemeFiles(context) {
    const folders = ['assets', 'blocks', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
    const patterns = [
        ...folders.map((folder) => `src/${folder}/**/*`),
        'src/.shopifyignore',
        'src/AGENTS.md',
        'src/DESIGN.md',
    ];
    const files = await findFiles(context, patterns, { dot: true });
    await Promise.all(files.map(async (file) => {
        const target = path_1.default.relative('src', file);
        await writeStaged(context, target, await promises_1.default.readFile(path_1.default.join(context.themeRoot, file)));
    }));
    return files.length;
}
exports.copyThemeFiles = copyThemeFiles;
function licenseComment(packageName, body) {
    return `\n/*\n* @license\n* ${packageName.toUpperCase()} Theme (c) Groupthought Themes\n*\n${body}\n*/\n`;
}
const CSS_LICENSE_BODY = `* The contents of this file should not be modified.\n* Add any minor changes to assets/custom.css\n*`;
const JS_LICENSE_BODY = `* This file is included for advanced development by\n* Shopify Agencies. Modified versions of the theme\n* code are not supported by Shopify or Groupthought.\n*\n* Add any minor JS changes in assets/custom.js, this\n* will make it easier to update the theme in the future.\n*`;
async function writeStaged(context, relativePath, contents) {
    const destination = path_1.default.join(context.staging, relativePath);
    await promises_1.default.mkdir(path_1.default.dirname(destination), { recursive: true });
    await promises_1.default.writeFile(destination, contents);
}
/**
 * Dotfiles stay out of the build unless a pipeline asks for them, since the
 * store rejects files it does not know and macOS drops .DS_Store everywhere.
 */
async function findFiles(context, patterns, options = {}) {
    return (0, tinyglobby_1.glob)(patterns, {
        cwd: context.themeRoot,
        ignore: [...context.options.ignore, '**/.DS_Store'],
        dot: options.dot ?? false,
        onlyFiles: true,
    });
}
/**
 * Copy files into staging and run the theme-file transform chain over the text
 * ones. `stripPrefix` is removed from each path, so src/snippets/a.liquid lands
 * at snippets/a.liquid.
 */
async function copyWithTransform(context, patterns, stripPrefix, transform, options = {}) {
    const files = await findFiles(context, patterns, options);
    await Promise.all(files.map(async (file) => {
        const source = path_1.default.join(context.themeRoot, file);
        const target = path_1.default.relative(stripPrefix, file);
        if (!(0, transforms_js_1.isTextFile)(file)) {
            await writeStaged(context, target, await promises_1.default.readFile(source));
            return;
        }
        const content = await promises_1.default.readFile(source, 'utf-8');
        await writeStaged(context, target, transform(content, target));
    }));
    return files.length;
}
/**
 * Rolldown covers what these plugins did. node-resolve, commonjs, esbuild and
 * swc rewrite modules into proxies rolldown cannot read, so a config that
 * lists them fails to build until they are removed. terser is dropped because
 * production output is already minified by rolldown, and running terser on
 * top would minify twice.
 */
const PLUGINS_ROLLDOWN_REPLACES = new Set(['node-resolve', 'commonjs', 'esbuild', 'swc', 'terser']);
function stripRedundantPlugins(plugins) {
    return (plugins ?? []).filter((plugin) => plugin && !PLUGINS_ROLLDOWN_REPLACES.has(plugin.name));
}
/**
 * Load a theme's build config again on each build, so a watcher sees an edit. Node caches a CommonJS
 * file by its name and ignores a query string, so CommonJS leaves the require cache. An ES module
 * gets a fresh URL instead.
 */
async function loadConfigFile(file) {
    if (file.endsWith('.mjs'))
        return import(`${(0, url_1.pathToFileURL)(file).href}?mtime=${(0, fs_1.statSync)(file).mtimeMs}`);
    const require = (0, module_1.createRequire)(file);
    delete require.cache[require.resolve(file)];
    try {
        return require(file);
    }
    catch (error) {
        // A .js file in a "type": "module" package is an ES module
        if (error?.code !== 'ERR_REQUIRE_ESM')
            throw error;
        return import(`${(0, url_1.pathToFileURL)(file).href}?mtime=${(0, fs_1.statSync)(file).mtimeMs}`);
    }
}
/**
 * Bundle JavaScript with the theme's own rollup.config.js. The config format is
 * Rollup's, which Rolldown reads, so a theme needs no change.
 */
async function bundleJavaScript(context) {
    const configPath = (0, mode_js_1.configFile)(context.themeRoot, 'rollup');
    if (!configPath)
        return 0;
    const { rolldown } = await import('rolldown');
    const loaded = await loadConfigFile(configPath);
    const configuration = loaded.default ?? loaded;
    const configs = Array.isArray(configuration) ? configuration : [configuration];
    let written = 0;
    for (const config of configs) {
        const outputs = Array.isArray(config.output) ? config.output : [config.output];
        const bundle = await rolldown({
            input: config.input,
            external: config.external,
            plugins: stripRedundantPlugins(config.plugins),
            transform: { define: { 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development') } },
            checks: { preferBuiltinFeature: false },
        });
        for (const output of outputs) {
            const generated = await bundle.generate({
                format: output.format ?? 'es',
                name: output.name,
                globals: output.globals,
                sourcemap: output.sourcemap === 'inline' ? 'inline' : Boolean(output.sourcemap),
                // Drop comments and dead code, keep identifiers. Mangling saves another
                // 15kb over the wire and costs a readable stack trace in support.
                minify: context.options.production ? { compress: true, mangle: false, codegen: true } : false,
                banner: (chunk) => chunk.fileName.includes('theme.') ? licenseComment(context.packageName, JS_LICENSE_BODY) : '',
            });
            for (const chunk of generated.output) {
                // output.file renames only the entry chunk. Anything else in the
                // output (a split chunk, an emitted asset) keeps its own name, or it
                // would overwrite the entry file.
                const rename = chunk.type === 'chunk' && chunk.isEntry && output.file;
                const name = rename ? path_1.default.basename(output.file) : chunk.fileName;
                const contents = chunk.type === 'chunk' ? chunk.code : chunk.source;
                await writeStaged(context, path_1.default.join('assets', name), contents);
                written += 1;
            }
        }
        await bundle.close();
    }
    return written;
}
exports.bundleJavaScript = bundleJavaScript;
/**
 * Run the theme's PostCSS config (Tailwind and friends) over its stylesheets.
 * Every stylesheet lands directly in assets, whatever folder it came from.
 */
async function compileStyles(context) {
    const files = await findFiles(context, ['src/css/theme{,.*}.{css,scss}']);
    const configPath = (0, mode_js_1.configFile)(context.themeRoot, 'postcss');
    if (!configPath) {
        if (files.length)
            throw new Error('Stylesheets in src/css need a postcss.config.js, .cjs, or .mjs file.');
        return 0;
    }
    const require = (0, module_1.createRequire)(configPath);
    const loaded = await loadConfigFile(configPath);
    const loadConfig = loaded.default ?? loaded;
    const header = licenseComment(context.packageName, CSS_LICENSE_BODY);
    for (const file of files) {
        const source = path_1.default.join(context.themeRoot, file);
        const extname = path_1.default.extname(file);
        const settings = typeof loadConfig === 'function' ? loadConfig({ file: { extname, basename: path_1.default.basename(file) } }) : loadConfig;
        const plugins = Array.isArray(settings.plugins)
            ? settings.plugins
            : Object.entries(settings.plugins ?? {})
                .filter(([, options]) => options !== false)
                .map(([name, options]) => {
                const plugin = require(name);
                return (plugin.default ?? plugin)(options === true ? {} : options);
            });
        const result = await (0, postcss_1.default)(plugins).process(await promises_1.default.readFile(source, 'utf-8'), {
            from: source,
            to: path_1.default.join(context.staging, 'assets', `${path_1.default.basename(file, extname)}.css`),
            parser: settings.parser || undefined,
        });
        await writeStaged(context, path_1.default.join('assets', `${path_1.default.basename(file, extname)}.css`), `${header}\n${result.css}`);
    }
    return files.length;
}
exports.compileStyles = compileStyles;
/** Sections, blocks, snippets, templates, locales, config, layout, and the agent context files. */
async function compileThemeFiles(context) {
    const transform = (content, relativePath) => (0, transforms_js_1.transformThemeFile)(content, relativePath, context.options);
    const [themeFiles, shopifyIgnore, agentDocs] = await Promise.all([
        copyWithTransform(context, [
            'src/snippets/**/*.{liquid,json}',
            'src/blocks/*.liquid',
            'src/sections/**/*.{liquid,json}',
            'src/templates/**/*.{liquid,json}',
            'src/locales/*',
            'src/config/*',
            'src/layout/*',
            'src/release-notes.md',
        ], 'src', transform),
        // Named separately with dot on, since the dot default would skip it.
        copyWithTransform(context, ['src/.shopifyignore'], 'src', transform, { dot: true }),
        // Shopify and Sidekick read AGENTS.md and DESIGN.md at the theme root. They ship verbatim,
        // since the static Liquid pass would render a [% tag %] quoted in their prose.
        copyWithTransform(context, ['src/AGENTS.md', 'src/DESIGN.md'], 'src', (content) => content),
    ]);
    return themeFiles + shopifyIgnore + agentDocs;
}
exports.compileThemeFiles = compileThemeFiles;
/** Files served as-is, apart from the static Liquid compile. */
async function copyAssets(context) {
    return copyWithTransform(context, ['src/assets/*'], 'src', (content, relativePath) => (0, transforms_js_2.formatJsonForFile)((0, liquid_js_1.renderStaticLiquid)(content), relativePath));
}
exports.copyAssets = copyAssets;
/** Each icon becomes a snippet, so a template can render it by name. */
async function copyIcons(context) {
    const files = await findFiles(context, ['src/icons/**/*.svg']);
    await Promise.all(files.map(async (file) => {
        const contents = await promises_1.default.readFile(path_1.default.join(context.themeRoot, file), 'utf-8');
        // Keep the path under src/icons, so stroke/x.svg stays snippets/stroke/x.liquid.
        const relative = path_1.default.relative(path_1.default.join('src', 'icons'), file);
        const target = path_1.default.join('snippets', relative.replace(/\.svg$/, '.liquid'));
        await writeStaged(context, target, contents);
    }));
    return files.length;
}
exports.copyIcons = copyIcons;
/** The folder that holds a store's settings: --settings-path, or environments/<-s name> */
function settingsFolder(themeRoot, options) {
    if (options.settingsPath)
        return path_1.default.resolve(themeRoot, options.settingsPath);
    return options.settings ? path_1.default.join(themeRoot, 'environments', options.settings) : null;
}
exports.settingsFolder = settingsFolder;
/** Theme JSON lives in these folders, so notes and records beside them stay out of the theme */
const SETTINGS_PATTERNS = ['config/**/*.json', 'sections/**/*.json', 'templates/**/*.json', 'locales/**/*.json', 'blocks/**/*.json'];
/**
 * Write one store's settings over the files the theme just produced. The
 * settings folder wins, since it holds what that store actually runs.
 */
async function copyEnvironmentSettings(context) {
    const folder = settingsFolder(context.themeRoot, context.options);
    if (!folder)
        return 0;
    // A copied theme takes the store's JSON as the store wrote it
    const transform = context.mode === 'copy'
        ? (content) => content
        : (content, relativePath) => (0, transforms_js_2.formatJsonForFile)((0, liquid_js_1.renderStaticLiquid)(content), relativePath);
    const files = await (0, tinyglobby_1.glob)(SETTINGS_PATTERNS, { cwd: folder, ignore: [...context.options.ignore, '**/.DS_Store'], onlyFiles: true });
    await Promise.all(files.map(async (file) => {
        const content = await promises_1.default.readFile(path_1.default.join(folder, file), 'utf-8');
        await writeStaged(context, file, transform(content, file));
    }));
    return files.length;
}
exports.copyEnvironmentSettings = copyEnvironmentSettings;
