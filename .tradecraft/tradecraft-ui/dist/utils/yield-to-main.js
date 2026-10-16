/**
 * Returns a promise that resolves after yielding to the main thread.
 * See: https://web.dev/articles/optimize-long-tasks#scheduler-yield
 */
export function yieldToMain() {
    var _a;
    if ('scheduler' in window && typeof ((_a = window.scheduler) === null || _a === void 0 ? void 0 : _a.yield) === 'function') {
        return window.scheduler.yield();
    }
    // Fall back to yielding with setTimeout.
    return new Promise((resolve) => {
        setTimeout(resolve, 0);
    });
}
