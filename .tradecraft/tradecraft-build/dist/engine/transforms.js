"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTextFile = exports.transformThemeFile = exports.formatJsonForFile = exports.autoCommentLiquid = exports.insertNoIndexHeader = exports.stripDataTestId = void 0;
const path_1 = __importDefault(require("path"));
const json_js_1 = require("../json.js");
const liquid_js_1 = require("../liquid.js");
/**
 * Every content transform the build applies to a file, as plain string functions.
 * The gulp build wrapped these in streams. The engine calls them directly.
 */
function stripDataTestId(content) {
    return content.replace(/([\n\r\s]*)data-test-id=['"][^"']*['"]/gm, '');
}
exports.stripDataTestId = stripDataTestId;
// WARNING: demo stores only.
function insertNoIndexHeader(content) {
    return content.replace(/<head>/m, '<head>\n<meta name="robots" content="noindex, nofollow">');
}
exports.insertNoIndexHeader = insertNoIndexHeader;
/**
 * Name the source file at the top of the rendered HTML so you can find a
 * section, block, or snippet by reading page source. Snippets opt in with an
 * `<!-- [autocomment] -->` marker since most snippets render inside a tag.
 */
function autoCommentLiquid(content, relativePath) {
    if (!relativePath.endsWith('.liquid'))
        return content;
    const dir = relativePath.split(path_1.default.sep)[0];
    const basename = path_1.default.basename(relativePath);
    if (dir === 'blocks' || dir === 'sections') {
        if (content.trimStart().startsWith('<!--'))
            return content;
        return `<!-- ${dir}/${basename} -->\n\n${content}`;
    }
    if (dir === 'snippets' && content.trimStart().startsWith('<!-- [autocomment] -->')) {
        return `<!-- snippets/${basename} -->\n\n${content.replace('<!-- [autocomment] -->', '')}`;
    }
    return content;
}
exports.autoCommentLiquid = autoCommentLiquid;
function formatJsonForFile(content, relativePath) {
    if (relativePath.endsWith('.json') || relativePath.endsWith('.jsonc'))
        return (0, json_js_1.formatJsonc)(content);
    if (relativePath.endsWith('.liquid'))
        return (0, json_js_1.formatSchemaJsonc)(content);
    return content;
}
exports.formatJsonForFile = formatJsonForFile;
/**
 * The theme-file transform chain, in the order the gulp build ran it.
 */
function transformThemeFile(content, relativePath, options) {
    let output = (0, liquid_js_1.renderStaticLiquid)(content);
    output = autoCommentLiquid(output, relativePath);
    output = formatJsonForFile(output, relativePath);
    if (options.stripTestIds)
        output = stripDataTestId(output);
    if (options.noIndex)
        output = insertNoIndexHeader(output);
    return output;
}
exports.transformThemeFile = transformThemeFile;
const TEXT_EXTENSIONS = new Set([
    '.liquid',
    '.json',
    '.jsonc',
    '.js',
    '.css',
    '.md',
    '.txt',
    '.svg',
    '.html',
    '.ts',
    '.yml',
    '.yaml',
]);
/** Files with no extension (.shopifyignore) are text too. */
function isTextFile(filePath) {
    const extension = path_1.default.extname(filePath);
    return extension === '' || TEXT_EXTENSIONS.has(extension);
}
exports.isTextFile = isTextFile;
