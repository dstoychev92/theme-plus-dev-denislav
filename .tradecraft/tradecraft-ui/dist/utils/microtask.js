// Little utility to defer a callback into the microtask queue
// Adapted from https://github.com/alpinejs/alpine/blob/b24d8be127e6b0d885a1d10e6ff2e6d2dbaee42a/packages/ui/src/combobox.js#L500
export function microtask(callback) {
    return new Promise((resolve) => queueMicrotask(() => resolve(callback())));
}
