"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.basePlugins = void 0;
const autoprefixer_1 = __importDefault(require("autoprefixer"));
const tailwindcss_1 = __importDefault(require("tailwindcss"));
const nesting_1 = __importDefault(require("tailwindcss/nesting"));
const postcss_import_1 = __importDefault(require("postcss-import"));
// @ts-ignore
const postcss_sass_1 = __importDefault(require("@csstools/postcss-sass"));
const postcss_scss_1 = __importDefault(require("postcss-scss"));
// @ts-ignore
const postcss_media_minmax_1 = __importDefault(require("postcss-media-minmax"));
// postcss-sass still calls dart-sass through the old API, which warns on every
// file since sass 1.79. The option quiets the warning until the plugin moves.
exports.basePlugins = [
    (0, postcss_sass_1.default)({ silenceDeprecations: ['legacy-js-api'] }),
    postcss_import_1.default,
    nesting_1.default,
    tailwindcss_1.default,
    autoprefixer_1.default,
    (0, postcss_media_minmax_1.default)(),
];
exports.default = (ctx) => ({
    parser: ctx.file.extname === '.scss' ? postcss_scss_1.default : false,
    plugins: exports.basePlugins,
});
