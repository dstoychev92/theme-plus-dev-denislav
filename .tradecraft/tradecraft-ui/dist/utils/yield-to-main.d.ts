/**
 * Returns a promise that resolves after yielding to the main thread.
 * See: https://web.dev/articles/optimize-long-tasks#scheduler-yield
 */
export declare function yieldToMain(): void | Promise<unknown>;
