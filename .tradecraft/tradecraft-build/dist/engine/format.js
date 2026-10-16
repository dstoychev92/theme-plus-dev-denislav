"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatOutput = exports.loadPrettier = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const module_1 = require("module");
const tinyglobby_1 = require("tinyglobby");
/**
 * The theme's own prettier formats the theme's output, so the theme's
 * package.json decides the formatter version, the same as when the themes ran
 * prettier from their own scripts. tradecraft-build's copy is only the fallback
 * for a theme that has no prettier.
 */
function loadPrettier(themeRoot) {
    const requireFromTheme = (0, module_1.createRequire)(path_1.default.join(themeRoot, 'package.json'));
    try {
        return requireFromTheme('prettier');
    }
    catch {
        return require('prettier');
    }
}
exports.loadPrettier = loadPrettier;
/**
 * Run prettier over the built output. The themes used to do this in their own
 * package.json scripts, which meant every theme repeated the same command and a
 * new theme could forget it.
 */
async function formatOutput(root, themeRoot, production) {
    const prettier = loadPrettier(themeRoot);
    const patterns = production ? ['**/*.{liquid,json}'] : ['**/*.json'];
    const files = await (0, tinyglobby_1.glob)(patterns, { cwd: root, onlyFiles: true });
    if (files.length === 0)
        return 0;
    // The theme's config names the plugins (the liquid one). getFileInfo needs
    // them up front, because without them it sees no parser for .liquid and
    // skips the file. Config overrides cannot add plugins, so one lookup serves.
    // Development formats only JSON, which needs no plugin, so prettier loads none.
    const firstConfig = (await prettier.resolveConfig(path_1.default.join(root, files[0]))) ?? {};
    const plugins = production ? (firstConfig.plugins ?? []) : [];
    // A theme keeps a separate ignore file for built output, since dist holds
    // generated files that the source ignore list says nothing about.
    const ignorePath = path_1.default.join(themeRoot, '.prettierignore.build');
    const hasIgnoreFile = await promises_1.default
        .access(ignorePath)
        .then(() => true)
        .catch(() => false);
    let formatted = 0;
    await Promise.all(files.map(async (file) => {
        const full = path_1.default.join(root, file);
        const info = await prettier.getFileInfo(full, {
            ...(hasIgnoreFile ? { ignorePath } : {}),
            plugins,
        });
        if (info.ignored || !info.inferredParser)
            return;
        const source = await promises_1.default.readFile(full, 'utf-8');
        // Resolved per file, because the config's overrides differ by file:
        // settings_schema.json gets its own print width, other JSON another.
        const config = (await prettier.resolveConfig(full)) ?? {};
        const output = await prettier.format(source, {
            ...config,
            filepath: full,
            parser: info.inferredParser,
        });
        if (output !== source) {
            await promises_1.default.writeFile(full, output);
            formatted += 1;
        }
    }));
    return formatted;
}
exports.formatOutput = formatOutput;
