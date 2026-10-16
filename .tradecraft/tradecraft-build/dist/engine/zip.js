"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createZip = void 0;
const fs_1 = require("fs");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
// archiver 8 exports classes and ships no types.
const { ZipArchive } = require('archiver');
/**
 * Pack dist into a zip for the theme store, or for handing a build to someone.
 * A development zip carries the git commit instead of a version, since it does
 * not correspond to a release.
 */
async function createZip(themeRoot, packageName, version, development) {
    const stamp = development ? (0, child_process_1.execSync)('git rev-parse --short HEAD').toString().trim() : version;
    const uploadDirectory = path_1.default.join(themeRoot, 'upload');
    await promises_1.default.mkdir(uploadDirectory, { recursive: true });
    const target = path_1.default.join(uploadDirectory, `${packageName}-${stamp}.zip`);
    const output = (0, fs_1.createWriteStream)(target);
    const archive = new ZipArchive({ zlib: { level: 9 } });
    const finished = new Promise((resolve, reject) => {
        output.on('close', resolve);
        archive.on('error', reject);
    });
    archive.pipe(output);
    // Dotfiles ship only in a development zip. A theme-store zip must hold
    // nothing Shopify does not recognise.
    archive.glob('**/*', { cwd: path_1.default.join(themeRoot, 'dist'), dot: development });
    await archive.finalize();
    await finished;
    return target;
}
exports.createZip = createZip;
