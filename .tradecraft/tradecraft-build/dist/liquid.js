"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderStaticLiquid = void 0;
const path_1 = __importDefault(require("path"));
const liquidjs_1 = require("liquidjs");
const jsonc_parser_1 = require("jsonc-parser");
const config_1 = __importDefault(require("./config"));
const loadConstants_1 = require("./loadConstants");
const fs_1 = __importDefault(require("fs"));
// Initialize Liquid instance with custom delimiters and file system configuration
const liquid = new liquidjs_1.Liquid({
    outputDelimiterLeft: '[=',
    outputDelimiterRight: '=]',
    tagDelimiterLeft: '[%',
    tagDelimiterRight: '%]',
    root: [config_1.default.src.static],
    extname: '.liquid',
    fs: {
        dirname: (file) => path_1.default.dirname(file),
        sep: path_1.default.sep,
        readFileSync: (file) => {
            return fs_1.default.readFileSync(file, 'utf-8');
        },
        readFile: async (file) => {
            return await fs_1.default.promises.readFile(file, 'utf-8');
        },
        exists: async (file) => !!(await fs_1.default.promises.readFile(file)),
        existsSync: (file) => !!fs_1.default.readFileSync(file),
        resolve: resolveFilePath,
    },
    strictVariables: false,
    strictFilters: true,
    lenientIf: true,
});
/**
 * Tag that allows you to insert a JSON file into an array or object
 * in another template. If the json file contains an array, the array contents
 * will be inserted as a comma separated list.
 */
liquid.registerTag('json', {
    parse: function (tagToken) {
        // Parse file path
        const args = tagToken.args.split(',').map((arg) => arg.trim());
        this.filePath = args[0].replace(/['"]/g, ''); // Remove quotes
        // @ts-ignore
        const tokenizer = this.tokenizer;
        // Read tokens until args
        [...tokenizer.readFileNameTemplate(liquid.options)];
        // Parse arguments
        const remaining = tokenizer.remaining();
        this.hash = new liquidjs_1.Hash(remaining, liquid.options.keyValueSeparator);
    },
    *render(context) {
        const filePath = resolveFilePath(config_1.default.src.static, this.filePath, '.jsonc');
        const content = fs_1.default.readFileSync(filePath, 'utf8');
        // @ts-ignore
        const args = yield this.hash.render(context);
        const parsedContent = renderStaticLiquid(content, args);
        const json = (0, jsonc_parser_1.parse)(parsedContent);
        let output = '';
        if (Array.isArray(json)) {
            // Convert array items to comma separated list
            output = json.map((item) => JSON.stringify(item)).join(',');
        }
        else {
            output = JSON.stringify(json);
        }
        return `${output},\n`;
    },
});
/**
 * Resolves the file path, assuming liquid file extension if not provided.
 * @param dir - Directory path
 * @param file - File name
 * @param ext - Extension
 * @returns Resolved file path
 */
function resolveFilePath(dir, file, ext) {
    const extname = path_1.default.extname(file);
    if (!extname) {
        // If file doesn't have an extension, assume it's a liquid file
        return path_1.default.resolve(dir, [file, ext].join(''));
    }
    // Check if a file with the bare extension name exists first (e.g. myfile.json), if not assume it's "myfile.json.liquid"
    const filePath = path_1.default.resolve(dir, file);
    const liquidPath = path_1.default.resolve(dir, `${file}.liquid`);
    if (fs_1.default.existsSync(filePath)) {
        return filePath;
    }
    else {
        return liquidPath;
    }
}
/**
 * Render templates using custom liquid delimiters (e.g. [= and =] and [% and %]) during compilation stage.
 * @param content - Template content
 * @param params - Parameters for rendering
 * @returns Rendered content
 */
function renderStaticLiquid(content, params = {}) {
    let globals = (0, loadConstants_1.loadConstants)();
    return liquid.parseAndRenderSync(content, params, {
        // Make all global constants available to the template e.g. <<my_constant>>
        globals,
    });
}
exports.renderStaticLiquid = renderStaticLiquid;
