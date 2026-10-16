"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncIntoDist = void 0;
const crypto_1 = __importDefault(require("crypto"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
async function hashFile(filePath) {
    const contents = await promises_1.default.readFile(filePath);
    return crypto_1.default.createHash('sha256').update(contents).digest('hex');
}
async function listFiles(root) {
    const found = [];
    async function walk(directory) {
        let entries;
        try {
            entries = await promises_1.default.readdir(directory, { withFileTypes: true });
        }
        catch (error) {
            if (error.code === 'ENOENT')
                return;
            throw error;
        }
        for (const entry of entries) {
            const full = path_1.default.join(directory, entry.name);
            if (entry.isDirectory())
                await walk(full);
            else if (entry.isFile())
                found.push(path_1.default.relative(root, full));
        }
    }
    await walk(root);
    return found;
}
async function writeAtomic(source, destination) {
    await promises_1.default.mkdir(path_1.default.dirname(destination), { recursive: true });
    // Keep the temp copy beside the staged source, since the Shopify CLI watches
    // dist and uploads any name that appears there, temp names included
    const temporary = `${source}.analog-tmp-${process.pid}`;
    await promises_1.default.copyFile(source, temporary);
    await promises_1.default.rename(temporary, destination);
}
/** Remove directories that the deletions left empty. */
async function pruneEmptyDirectories(root, startedFrom) {
    const directories = new Set();
    for (const file of startedFrom) {
        let directory = path_1.default.dirname(file);
        while (directory && directory !== '.') {
            directories.add(directory);
            directory = path_1.default.dirname(directory);
        }
    }
    // Deepest first, so a parent sees its children already gone.
    for (const directory of [...directories].sort((a, b) => b.length - a.length)) {
        try {
            await promises_1.default.rmdir(path_1.default.join(root, directory));
        }
        catch {
            // Not empty, or already gone. Both are fine.
        }
    }
}
async function syncIntoDist(stagingRoot, distRoot) {
    const [allStagingFiles, distFiles] = await Promise.all([listFiles(stagingRoot), listFiles(distRoot)]);
    // A crashed run can leave its temp copies in staging. They are partial
    // writes, never theme files, so they must not reach dist.
    const stagingFiles = allStagingFiles.filter((relative) => !relative.includes('.analog-tmp-'));
    const distSet = new Set(distFiles);
    const result = { written: [], deleted: [], unchanged: 0 };
    await Promise.all(stagingFiles.map(async (relative) => {
        const from = path_1.default.join(stagingRoot, relative);
        const to = path_1.default.join(distRoot, relative);
        if (distSet.has(relative)) {
            const [fromHash, toHash] = await Promise.all([hashFile(from), hashFile(to)]);
            if (fromHash === toHash) {
                result.unchanged += 1;
                return;
            }
        }
        await writeAtomic(from, to);
        result.written.push(relative);
    }));
    const stagingSet = new Set(stagingFiles);
    const obsolete = distFiles.filter((relative) => !stagingSet.has(relative));
    await Promise.all(obsolete.map((relative) => promises_1.default.rm(path_1.default.join(distRoot, relative), { force: true })));
    result.deleted = obsolete;
    if (obsolete.length > 0)
        await pruneEmptyDirectories(distRoot, obsolete);
    return result;
}
exports.syncIntoDist = syncIntoDist;
