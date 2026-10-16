"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMode = exports.configFile = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function configFile(themeRoot, name) {
    return ['js', 'cjs', 'mjs'].map((extension) => path_1.default.join(themeRoot, `${name}.config.${extension}`)).find(fs_1.existsSync);
}
exports.configFile = configFile;
function buildMode(themeRoot, packageJson = {}) {
    const mode = packageJson.tradecraft?.build;
    if (mode === 'copy' || mode === 'compile')
        return mode;
    // Only the .js configs that Tradecraft themes ship switch a theme to compile mode on their own. A
    // vendor theme with a stray postcss.config.mjs keeps its files byte for byte until it opts in.
    const has = (file) => (0, fs_1.existsSync)(path_1.default.join(themeRoot, file));
    return has('rollup.config.js') || has('postcss.config.js') ? 'compile' : 'copy';
}
exports.buildMode = buildMode;
