/**
 * Logs a clear, actionable console error when a Method UI directive is used
 * without a parent directive it depends on.
 *
 * Many directives only work when nested inside a parent directive that sets up
 * shared state on the Alpine scope (e.g. `x-overflow:start` needs an ancestor
 * `x-overflow`). When that parent is missing, the raw failure is an inscrutable
 * `this.__foo is not a function`. Call this instead so users get a message that
 * explains what to do.
 *
 * @param childDirective - The directive being used, e.g. `'x-overflow:start'`.
 * @param parentDirective - The parent directive required, e.g. `'x-overflow'`.
 * @param el - The element the child directive is on, logged for context.
 *
 * @example
 * ```ts
 * if (typeof this.__overflow_registerBoundary !== 'function') {
 *   warnMissingParentDirective(`x-overflow:${value}`, 'x-overflow', $el);
 *   return;
 * }
 * ```
 */
export function warnMissingParentDirective(childDirective, parentDirective, el) {
    console.error(`Cannot use ${childDirective} without a parent element having ${parentDirective}.`, el);
}
export function prettyPrintError(err) {
    let output = '';
    if (typeof err === 'string') {
        output = err;
    }
    else if (err instanceof Error) {
        output = err.message;
    }
    else if (err && typeof err.toString === 'function') {
        output = err.toString();
    }
    else if (err && typeof err.message === 'string') {
        output = err.message;
    }
    else {
        output = 'An unknown error occurred.';
    }
    return output;
}
