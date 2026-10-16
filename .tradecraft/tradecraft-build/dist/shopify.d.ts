/** The nearest shopify.theme.toml at or above `start` */
export declare function findToml(start: string): string | null;
/**
 *  Start Shopify theme development in a new process
 */
export declare function startShopifyDevProcesses(env: string, port: number, initialArgs: string[]): Promise<void>;
/** Run `shopify theme pull` from the theme root. */
export declare function pullShopifyTheme(env: string, root: string, initialArgs: string[]): Promise<void>;
/**
 * Check if a Shopify process is already running on the specified port, if it is, reject the promise
 */
export declare function checkForShopifyDevProcess(port: number): Promise<void>;
