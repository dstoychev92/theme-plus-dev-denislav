"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acquireBuildLock = exports.assertNoExistingWatcher = exports.BuildLockedError = exports.LOCK_DIRECTORY = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const child_process_1 = require("child_process");
exports.LOCK_DIRECTORY = path_1.default.join('.tradecraft-build', 'owner');
class BuildLockedError extends Error {
    constructor(themeRoot, owner) {
        super(`${path_1.default.basename(themeRoot)} is owned by pid ${owner.pid}: ${owner.command}\n` +
            'Keep editing source and let the existing watcher rebuild. Check .tradecraft-build/build.log for completion or errors.\n' +
            'For a watcher started before build logging was added, read its existing terminal or preview log.');
        this.name = 'BuildLockedError';
    }
}
exports.BuildLockedError = BuildLockedError;
function isAlive(pid) {
    try {
        process.kill(pid, 0);
        return true;
    }
    catch (error) {
        return error.code !== 'ESRCH';
    }
}
async function removeClaim(directory, name) {
    await promises_1.default.rm(path_1.default.join(directory, name), { force: true });
    try {
        // A replacement owner has a different filename, so rmdir leaves it alone.
        await promises_1.default.rmdir(directory);
    }
    catch (error) {
        if (!['ENOENT', 'ENOTEMPTY', 'EEXIST'].includes(error.code))
            throw error;
    }
}
/** Detect watchers started before locking existed. Shopify alone does not compile source. */
async function assertNoExistingWatcher(themeRoot) {
    if (process.platform === 'win32')
        return;
    const rows = (0, child_process_1.execFileSync)('ps', ['-axo', 'pid=,ppid=,command='], { encoding: 'utf8' })
        .split('\n')
        .flatMap((line) => {
        const match = line.trim().match(/^(\d+)\s+(\d+)\s+(.+)$/);
        return match ? [{ pid: Number(match[1]), parent: Number(match[2]), command: match[3] }] : [];
    });
    const ancestors = new Set([process.pid]);
    let parent = process.ppid;
    while (parent && !ancestors.has(parent)) {
        ancestors.add(parent);
        parent = rows.find((row) => row.pid === parent)?.parent ?? 0;
    }
    const root = await promises_1.default.realpath(themeRoot);
    for (const owner of rows) {
        if (ancestors.has(owner.pid))
            continue;
        if (!/(?:^|\s)(?:\S*\/)?tradecraft-build(?:\.js)?\s+(?:watch|build|deploy|zip)(?:\s|$)|(?:^|\s)(?:\S*\/)?shopify\s+theme\s+dev(?:\s|$)/.test(owner.command))
            continue;
        let cwd;
        try {
            cwd =
                process.platform === 'linux'
                    ? await promises_1.default.realpath(`/proc/${owner.pid}/cwd`)
                    : ((0, child_process_1.execFileSync)('lsof', ['-a', '-p', String(owner.pid), '-d', 'cwd', '-Fn'], {
                        encoding: 'utf8',
                        stdio: ['ignore', 'pipe', 'ignore'],
                    })
                        .split('\n')
                        .find((line) => line.startsWith('n'))
                        ?.slice(1) ?? '');
        }
        catch (error) {
            if (!isAlive(owner.pid))
                continue;
            throw new Error(`Cannot inspect the working directory of pid ${owner.pid}; check that process before building: ${String(error)}`);
        }
        if (cwd === root)
            throw new BuildLockedError(themeRoot, owner);
    }
}
exports.assertNoExistingWatcher = assertNoExistingWatcher;
/** Publish a populated directory atomically; never reclaim a partially written lock. */
async function acquireBuildLock(themeRoot, command = process.argv.slice(1).join(' ')) {
    const directory = path_1.default.join(themeRoot, exports.LOCK_DIRECTORY);
    await promises_1.default.mkdir(path_1.default.dirname(directory), { recursive: true });
    const candidate = await promises_1.default.mkdtemp(`${directory}-`);
    const name = `${(0, crypto_1.randomUUID)()}.json`;
    await promises_1.default.writeFile(path_1.default.join(candidate, name), JSON.stringify({ pid: process.pid, command }));
    try {
        for (;;) {
            try {
                await promises_1.default.rename(candidate, directory);
                break;
            }
            catch (error) {
                if (!['EEXIST', 'ENOTEMPTY'].includes(error.code))
                    throw error;
            }
            const entries = await promises_1.default.readdir(directory).catch((error) => {
                if (error.code === 'ENOENT')
                    return [];
                throw error;
            });
            if (entries.length === 0)
                continue;
            const existingName = entries[0];
            let owner;
            try {
                owner = JSON.parse(await promises_1.default.readFile(path_1.default.join(directory, existingName), 'utf8'));
            }
            catch (error) {
                if (error.code === 'ENOENT')
                    continue;
                throw new Error(`Cannot read build owner in ${directory}; leave it in place until its owner is checked: ${String(error)}`);
            }
            if (!Number.isSafeInteger(owner.pid) || owner.pid <= 0)
                throw new Error(`Invalid build owner in ${directory}`);
            if (isAlive(owner.pid))
                throw new BuildLockedError(themeRoot, owner);
            await removeClaim(directory, existingName);
        }
    }
    finally {
        await promises_1.default.rm(candidate, { recursive: true, force: true });
    }
    return () => removeClaim(directory, name);
}
exports.acquireBuildLock = acquireBuildLock;
