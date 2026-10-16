"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForShopifyDevProcess = exports.pullShopifyTheme = exports.deployShopifyStore = exports.startShopifyDevProcesses = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fancy_log_1 = __importDefault(require("fancy-log"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
/**
 * Stop before the Shopify CLI can fall back to whatever store it last used.
 * Reading the file beats scanning the CLI's output, because a push keeps its
 * terminal and can still ask for confirmation.
 */
function assertEnvironmentExists(env, root = process.cwd()) {
    if (!env)
        return;
    const tomlPath = path_1.default.join(root, 'shopify.theme.toml');
    if (!fs_1.default.existsSync(tomlPath)) {
        (0, fancy_log_1.default)(ansi_colors_1.default.red('shopify.theme.toml is missing.'));
        (0, fancy_log_1.default)(ansi_colors_1.default.red('Copy shopify.theme.toml.example and fill in the stores you can reach.'));
        throw new Error('shopify.theme.toml not found');
    }
    if (!new RegExp(`^\\[environments\\.${env}\\]`, 'm').test(fs_1.default.readFileSync(tomlPath, 'utf8'))) {
        (0, fancy_log_1.default)(ansi_colors_1.default.red(`The environment "${env}" is not defined in shopify.theme.toml.`));
        (0, fancy_log_1.default)(ansi_colors_1.default.red('Stopping rather than let the Shopify CLI guess a store.'));
        throw new Error(`environment "${env}" not found in shopify.theme.toml`);
    }
}
/**
 *  Start Shopify theme development in a new process
 */
async function startShopifyDevProcesses(env, port, initialArgs) {
    // We only start one process for now but we have the option to start multiple in the future which
    // is why this is a seperate function
    await startShopifyDevProcess(env, port, initialArgs);
}
exports.startShopifyDevProcesses = startShopifyDevProcesses;
/** The Shopify CLI's wordings for "that environment does not exist". */
function environmentIsMissing(output) {
    return (output.includes('Environment file not found') ||
        output.includes('Please provide a valid environment') ||
        /environments? .*(not found|do(es)? not exist)/i.test(output));
}
function stopForMissingEnvironment(env, child, reject) {
    (0, fancy_log_1.default)(ansi_colors_1.default.red(`The environment "${env}" is not defined for this theme.`));
    (0, fancy_log_1.default)(ansi_colors_1.default.red('Copy shopify.theme.toml.example to shopify.theme.toml and check the environment name.'));
    (0, fancy_log_1.default)(ansi_colors_1.default.red('Stopping rather than let the Shopify CLI guess a store.'));
    child.kill('SIGTERM');
    process.exitCode = 1;
    reject(new Error(`environment "${env}" not found in shopify.theme.toml`));
}
/**
 * Deploy to one or more Shopify stores
 */
async function deployShopifyStore(env, initialArgs) {
    if (!env) {
        throw new Error('Please specify an environment to deploy to');
    }
    assertEnvironmentExists(env);
    return new Promise((resolve, reject) => {
        const filteredArgs = initialArgs.filter((arg) => !arg.startsWith('--index'));
        const args = ['theme', 'push', '--path=dist', env && `--environment=${env}`, ...filteredArgs].filter(Boolean);
        (0, fancy_log_1.default)(ansi_colors_1.default.grey(['shopify', ...args].join(' ')));
        // Full inherit: the CLI asks before overwriting a live theme, and it only
        // asks when its output is a terminal
        let shopifyProcess = (0, child_process_1.spawn)('shopify', args || [], {
            stdio: 'inherit',
        });
        // Kill child shopify process when parent process is killed
        process.on('SIGINT', handleExit(shopifyProcess));
        process.on('SIGTERM', handleExit(shopifyProcess));
        process.on('SIGQUIT', handleExit(shopifyProcess));
        // Log errors to console
        shopifyProcess.on('error', (error) => {
            (0, fancy_log_1.default)(ansi_colors_1.default.red(error.message));
            reject(error.message);
        });
        // Watch for the process to close and then (since we're passing stdin to the child process) kill
        // the parent process. This allows both process to die when e.g. using Ctrl+C in terminal
        shopifyProcess.on('close', (code) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(`child process exited with code ${code}`);
            }
        });
        // Pass on messages from child process
        shopifyProcess.on('message', (message) => {
            (0, fancy_log_1.default)(`child process message ${message}`);
            resolve();
        });
        return shopifyProcess;
    });
}
exports.deployShopifyStore = deployShopifyStore;
/** Run `shopify theme pull` from the theme root. */
async function pullShopifyTheme(env, root, initialArgs) {
    assertEnvironmentExists(env, root);
    const args = ['theme', 'pull', `--environment=${env}`, ...initialArgs];
    (0, fancy_log_1.default)(ansi_colors_1.default.grey(['shopify', ...args].join(' ')));
    return new Promise((resolve, reject) => {
        // Full inherit: the CLI asks which theme to pull when nothing names one,
        // and asks you to confirm when the Git directory has uncommitted changes
        const shopifyProcess = (0, child_process_1.spawn)('shopify', args, { cwd: root, stdio: 'inherit' });
        // Wait for the CLI to exit, even on Ctrl+C, so the caller can remove its temp folder
        const stop = (signal) => shopifyProcess.kill(signal);
        process.on('SIGINT', stop);
        process.on('SIGTERM', stop);
        const settle = () => {
            process.off('SIGINT', stop);
            process.off('SIGTERM', stop);
        };
        shopifyProcess.on('error', (error) => {
            settle();
            reject(error);
        });
        shopifyProcess.on('close', (code, signal) => {
            settle();
            if (code === 0)
                resolve();
            else
                reject(new Error(`shopify theme pull exited with ${signal ?? `code ${code}`}`));
        });
    });
}
exports.pullShopifyTheme = pullShopifyTheme;
/**
 * Check if a Shopify process is already running on the specified port, if it is, reject the promise
 */
async function checkForShopifyDevProcess(port) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(`lsof -i :${port} -sTCP:LISTEN -nP`, (_error, stdout) => {
            if (stdout) {
                reject(new Error(`${port} is already in use. This could mean there is an existing Shopify process running, please exit that process first and try again`));
            }
            else {
                resolve();
            }
        });
    });
}
exports.checkForShopifyDevProcess = checkForShopifyDevProcess;
/**
 * Boot up a `shopify theme dev` process
 *
 * @param env Environment from `shopify.theme.toml` to deploy to e.g. `development`, `chaos`, `demo`
 * @param port Port to run the shopify process on
 * @param initialArgs args to forward to the Shopify CLI
 * @returns
 */
async function startShopifyDevProcess(env, port, initialArgs) {
    assertEnvironmentExists(env);
    await checkForShopifyDevProcess(port);
    return new Promise((resolve, reject) => {
        const filteredArgs = initialArgs.filter((arg) => !arg.startsWith('--index'));
        const args = ['theme', 'dev', '--path=dist', `--port=${port}`, `--environment=${env}`, ...filteredArgs].filter(Boolean);
        (0, fancy_log_1.default)(ansi_colors_1.default.grey(['shopify', ...args].join(' ')));
        // Spawn shopify process and pipe stdout to the console
        let shopifyProcess = (0, child_process_1.spawn)('shopify', args, {
            stdio: ['inherit', 'pipe', 'pipe'],
        });
        // Kill child shopify process when parent process is killed
        process.on('SIGINT', handleExit(shopifyProcess));
        process.on('SIGTERM', handleExit(shopifyProcess));
        process.on('SIGQUIT', handleExit(shopifyProcess));
        // Watch for the parent process to exit so we can resolve/reject
        process.on('exit', (code) => {
            (0, fancy_log_1.default)('exit', code);
            if (code === 0) {
                resolve();
            }
            else {
                reject(`exited with code ${code}`);
            }
        });
        // Watch for data on stdout
        shopifyProcess.stdout.on('data', (data) => {
            const stringData = data.toString();
            // When the named environment is not in shopify.theme.toml, the Shopify
            // CLI only warns and then falls back to whatever store it last used.
            // That has uploaded themes to the wrong store before, so stop instead.
            if (environmentIsMissing(stringData)) {
                process.stdout.write(data);
                stopForMissingEnvironment(env, shopifyProcess, reject);
                return;
            }
            // Once we see the word "success", we know the shopify process has booted up successfully
            // so we can resovle the promise and allow the caller function to continue on it's merry way
            if (stringData.match(/success/)) {
                resolve();
            }
            process.stdout.write(data);
        });
        // The CLI prints its warning boxes on stderr.
        shopifyProcess.stderr.on('data', (data) => {
            process.stderr.write(data);
            if (environmentIsMissing(data.toString()))
                stopForMissingEnvironment(env, shopifyProcess, reject);
        });
        // Watch for data on stderr
        shopifyProcess.on('error', (error) => {
            // Log and reject promise if error occurs
            (0, fancy_log_1.default)(ansi_colors_1.default.red(error.message));
            reject();
        });
        // Watch for the process to close and then (since we're passing stdin to the child process) kill
        // the parent process. This allows both process to die when e.g. using Ctrl+C in terminal
        shopifyProcess.on('close', (code) => {
            reject(`child process exited with code ${code}`);
            if (code === 0) {
                resolve();
                process.exit(0);
            }
            else {
                process.exit(1);
            }
        });
        return shopifyProcess;
    });
}
/**
 * Process to gracefully terminate a child process
 * @returns
 */
async function terminateProcess(childProcess, timeout = 5000) {
    let killed = false;
    return new Promise((resolve) => {
        // Resolve promise when process exits
        process.once('exit', () => {
            killed = true;
            resolve();
        });
        // Send SIGTERM to start a graceful shutdown
        childProcess.kill('SIGTERM');
        setTimeout(() => {
            if (!killed) {
                // If the process hasn't exited, escalate to SIGKILL
                childProcess.kill('SIGKILL');
            }
        }, timeout);
    });
}
function handleExit(shopifyProcess) {
    return function (code) {
        (0, fancy_log_1.default)(ansi_colors_1.default.yellow(`Received exit ${code}`));
        if (shopifyProcess && shopifyProcess.pid !== undefined) {
            (0, fancy_log_1.default)(ansi_colors_1.default.yellow(`Gracefully stopping Shopify process with PID ${-shopifyProcess.pid}...`));
            terminateProcess(shopifyProcess);
        }
        process.exit();
    };
}
