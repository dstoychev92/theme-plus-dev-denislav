"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConstants = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
const CONSTANTS_FILES = ['constants.json', 'constants.yml'];
/**
 * Walk up from `startDir` to the filesystem root, returning the first directory
 * that contains a constants file. Returns null if none is found.
 */
function findConstantsDir(startDir) {
    let dir = path_1.default.resolve(startDir);
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (CONSTANTS_FILES.some((file) => fs_1.default.existsSync(path_1.default.join(dir, file)))) {
            return dir;
        }
        const parent = path_1.default.dirname(dir);
        if (parent === dir)
            return null;
        dir = parent;
    }
}
/**
 * Directories of the source files currently on the call stack, nearest caller
 * first and de-duplicated. Used to locate the theme that imported us when the
 * process cwd is not the theme dir.
 *
 * We read file paths off `Error.stack` (a string) rather than the V8-only
 * `Error.prepareStackTrace`/`CallSite` API so we don't assume a particular host
 * and so we respect whatever sourcemap mapping is already installed — under the
 * Tailwind IntelliSense extension the stack reports the original `.ts` paths.
 */
function callerDirs() {
    const stack = new Error().stack ?? '';
    const dirs = [];
    const seen = new Set();
    for (const rawLine of stack.split('\n')) {
        const line = rawLine.trim();
        if (!line.startsWith('at '))
            continue;
        // A frame is either "at <fn> (<location>)" or a bare "at <location>". Take
        // the parenthesised group when present, else everything after "at ".
        const open = line.indexOf('(');
        let location = open !== -1 && line.endsWith(')') ? line.slice(open + 1, -1) : line.slice(3);
        // Drop an ESM file:// scheme, then peel only the trailing ":line:col" — the
        // path itself is captured greedily so spaces, parens, etc. (common in macOS
        // paths like "~/Library/Mobile Documents") are preserved rather than
        // truncating the path and resolving the wrong directory.
        location = location.replace(/^file:\/\//, '');
        const match = /^(.*\.[cm]?[jt]sx?):\d+:\d+$/.exec(location);
        if (!match)
            continue;
        const dir = path_1.default.dirname(match[1]);
        if (!seen.has(dir)) {
            seen.add(dir);
            dirs.push(dir);
        }
    }
    return dirs;
}
/**
 * Load and return the merged constants object from a theme's
 * constants.{json,yml} files.
 *
 * The theme directory is resolved here so callers never have to pass `__dirname`
 * or otherwise care which directory the process was launched from. Candidates
 * are tried in order, each walked up to the filesystem root:
 *
 *   1. `process.cwd()` — the gulp build, postcss config, and liquid rendering
 *      all run with cwd set to the theme dir.
 *   2. The directories of the files that called us — covers tooling that loads a
 *      theme's `tailwind.config.ts` out-of-context, e.g. the Tailwind CSS
 *      IntelliSense extension, whose cwd is the editor workspace root rather
 *      than the theme.
 *
 * Returns an empty object only when no constants file exists anywhere above any
 * candidate.
 */
function loadConstants() {
    let dir = null;
    for (const candidate of [process.cwd(), ...callerDirs()]) {
        dir = findConstantsDir(candidate);
        if (dir)
            break;
    }
    let constants = {};
    if (!dir)
        return constants;
    // Read out the contents of constants.{json,yml}, parse em and merge em
    for (const file of CONSTANTS_FILES) {
        const filePath = path_1.default.join(dir, file);
        if (!fs_1.default.existsSync(filePath))
            continue;
        const contents = fs_1.default.readFileSync(filePath, 'utf8');
        constants = {
            ...constants,
            ...(file.endsWith('.json') ? JSON.parse(contents) : yaml_1.default.parse(contents)),
        };
    }
    return constants;
}
exports.loadConstants = loadConstants;
