import { readLayoutAfterPaint } from './layout-measure';
export function isFormDataSubmitterSupported() {
    try {
        new FormData(document.createElement('form'), 
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0);
    }
    catch (e) {
        return false;
    }
}
export function isTouchEvent(e) {
    return e.pointerType === 'touch';
}
export function isLeftMouseButton(e) {
    return e.button === 0;
}
/**
 * True for the primary pointer only (left mouse button, or primary touch point).
 * Filters out right-click and secondary touch points so only one press is active.
 * @see https://github.com/motiondivision/motion/blob/main/packages/motion-dom/src/gestures/utils/is-primary-pointer.ts
 */
export function isPrimaryPointer(e) {
    if (e.pointerType === 'mouse') {
        return typeof e.button !== 'number' || e.button <= 0;
    }
    return e.isPrimary !== false;
}
const KEYBOARD_ACCESSIBLE_TAGS = new Set(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A']);
/**
 * True if the element is natively focusable (keyboard accessible without adding tabindex).
 * Used by press gesture to decide whether to set tabIndex = 0.
 */
export function isElementKeyboardAccessible(el) {
    return KEYBOARD_ACCESSIBLE_TAGS.has(el.tagName) || el.isContentEditable === true;
}
/**
 * True if child is the same node as parent or a descendant of parent.
 */
export function isNodeOrChild(parent, child) {
    if (!child)
        return false;
    if (parent === child)
        return true;
    return isNodeOrChild(parent, child.parentElement);
}
export function isPopoverApiSupported() {
    return (typeof HTMLElement !== 'undefined' &&
        typeof HTMLElement.prototype === 'object' &&
        'popover' in HTMLElement.prototype);
}
export function isDialogApiSupported() {
    return typeof HTMLDialogElement === 'function';
}
export function isHoverSupported() {
    return !window.matchMedia('(any-hover: none)').matches;
}
/**
 * True when the device's main pointer cannot hover — a finger on a phone or tablet.
 *
 * Use it to skip setting up work that only means something with a mouse or trackpad,
 * such as an effect that follows the cursor. Check it once, as early as possible, so
 * a touch device pays nothing for the feature.
 *
 * This is the same test as the themes' `touch:` style variant and their
 * `$media.matches.touch` breakpoint, so the JavaScript and the CSS agree on what
 * counts as a touch device. `(pointer: coarse)` is checked alongside `(hover: none)`
 * because Chrome on Ubuntu reports `(hover: none)` even when a mouse is plugged in.
 *
 * @example
 * ```ts
 * Alpine.directive('cursor-position', ($el) => {
 *   if (isTouchOnlyDevice()) return;
 *   // ...set up the cursor-following effect
 * }).before('bind');
 * ```
 */
export function isTouchOnlyDevice() {
    return window.matchMedia('(pointer: coarse) and (hover: none)').matches;
}
/**
 * Returns an array of section IDs that have or contain an element having the data-cart-api-section attribute.
 * This is used to gather up all the sections that need to be updated when the cart API is called.
 */
export function getCartApiSections() {
    return Array.from(document.querySelectorAll('.shopify-section:is(:has([data-cart-api-section]),[data-cart-api-section])')).map((section) => {
        return section.id.split('shopify-section-')[1];
    });
}
// Inspired by https://github.com/remix-run/react-router/blob/9afac15d8cbe30b37d0f9e8b89c9f1e430dfe35a/packages/react-router-dom/dom.ts#L250
export function getFormSubmissionInfo(target, submitter) {
    let method;
    let action;
    let formData = undefined;
    let enctype = null;
    let defaultMethod = 'GET';
    if (isFormElement(target)) {
        action = target.action;
        method = target.getAttribute('method') || defaultMethod;
        enctype = target.getAttribute('enctype') || null;
        formData = new FormData(target, submitter || null);
    }
    else if (isButtonElement(target) ||
        (isInputElement(target) && (target.type === 'submit' || target.type === 'image'))) {
        let form = target.form;
        if (form == null) {
            throw new Error(`Cannot submit a <button> or <input type="submit"> without a <form>`);
        }
        let attr = target.formAction || form.action;
        action = attr;
        method = target.getAttribute('formmethod') || form.getAttribute('method') || defaultMethod;
        enctype = target.getAttribute('formenctype') || form.getAttribute('enctype') || null;
        // Build a FormData object populated from a form and submitter
        formData = new FormData(form, target);
        // If this browser doesn't support the `FormData(el, submitter)` format,
        // then tack on the submitter value at the end.  This is a lightweight
        // solution that is not 100% spec compliant.  For complete support in older
        // browsers, consider using the `formdata-submitter-polyfill` package
        if (!isFormDataSubmitterSupported()) {
            let { name, type, value } = target;
            if (type === 'image') {
                let prefix = name ? `${name}.` : '';
                formData.append(`${prefix}x`, '0');
                formData.append(`${prefix}y`, '0');
            }
            else if (name) {
                formData.append(name, value);
            }
        }
    }
    else if (isHtmlElement(target)) {
        throw new Error(`Cannot submit element that is not <form>, <button>, or ` + `<input type="submit|image">`);
    }
    else {
        method = defaultMethod;
        action = null;
        enctype = null;
    }
    return {
        action,
        method: method.toUpperCase(),
        formData,
        enctype,
    };
}
/**
 * Make a fetch request with the given form data submission info.
 */
export async function submitFormData({ action, formData, method, enctype }, init) {
    switch (method) {
        case 'POST':
            if (enctype === 'application/json') {
                return fetch(action, Object.assign({ method: 'POST', headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        // Required for quantity checking on the cart endpoints....
                        'X-Requested-With': 'XMLHttpRequest',
                    }, body: JSON.stringify(serializeFormData(formData)) }, init));
            }
            else {
                return fetch(action, Object.assign({ method: 'POST', body: formData, headers: {
                        Accept: 'application/javascript',
                        // Required for quantity checking on the cart endpoints....
                        'X-Requested-With': 'XMLHttpRequest',
                    } }, init));
            }
        case 'GET':
            const url = `${action}?${new URLSearchParams(formData).toString()}`;
            return fetch(url, Object.assign({ method: 'GET', headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                } }, init));
        default:
            throw new Error(`Unsupported method: ${method}`);
    }
}
export function parseMultipart(body, contentType) {
    var _a;
    // Extract the boundary from the Content-Type header
    let boundary = (_a = contentType.match(/boundary=(.*)$/)) === null || _a === void 0 ? void 0 : _a[1];
    let formData = new FormData();
    // Split the body by the boundary
    body.split('--' + boundary).forEach((part) => {
        if (part.includes('Content-Disposition')) {
            let nameMatch = part.match(/name="([^"]+)"/);
            if (nameMatch) {
                let name = nameMatch[1];
                let value = part.split('\r\n\r\n')[1].trim();
                formData.append(name, value);
            }
        }
    });
    let data = {};
    let properties = {};
    // Organize the data into a structured object
    for (let [key, value] of formData.entries()) {
        if (key.startsWith('properties[') && key.endsWith(']')) {
            let propName = key.slice(11, -1);
            properties[propName] = value;
        }
        else {
            data[key] = Number(value);
        }
    }
    if (Object.keys(properties).length) {
        data['properties'] = properties;
    }
    return data;
}
export function isModifiedEvent(event) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
// Inspired by https://github.com/remix-run/react-router/blob/9afac15d8cbe30b37d0f9e8b89c9f1e430dfe35a/packages/react-router-dom/dom.ts#L36
export function shouldProcessLinkClick(event, target) {
    return (event.button === 0 && // Ignore everything but left clicks
        (!target || target === '_self') && // Let browser handle "target=_blank" etc.
        !isModifiedEvent(event) // Ignore clicks with modifier keys
    );
}
// Check if clipboard.writeText() can execute to avoid throwing an error.
// Firefox does not support 'clipboard-write' in the permissions API, so default to true if unsupported.
export function isClipboardWriteAllowed() {
    if (navigator.permissions && typeof navigator.permissions.query === 'function') {
        try {
            return navigator.permissions
                .query({ name: 'clipboard-write' })
                .then((result) => {
                // Permission denied
                if (result.state === 'denied')
                    return false;
                return result.state === 'granted' || result.state === 'prompt';
            })
                .catch(() => {
                // Permissions API is available but query failed (e.g. not supported for clipboard)
                // Firefox and others: fallback to assume it is allowed, since writeText will throw if not
                return true;
            });
        }
        catch (_a) {
            // Defensive: if query throws synchronously
            return Promise.resolve(true);
        }
    }
    // permissions API not available at all, assume allowed (since writeText will throw if not)
    return Promise.resolve(true);
}
export function isHtmlElement(node) {
    return node != undefined && node != null && typeof node.tagName === 'string' && node.nodeType === Node.ELEMENT_NODE;
}
export function isImageElement(node) {
    return isHtmlElement(node) && node.nodeName === 'IMG';
}
export function isVideoElement(node) {
    return isHtmlElement(node) && node.nodeName === 'VIDEO';
}
export function isSourceElement(node) {
    return isHtmlElement(node) && node.nodeName === 'SOURCE';
}
export function isScriptElement(node) {
    return isHtmlElement(node) && node.nodeName === 'SCRIPT';
}
export function isAnchorElement(node) {
    return isHtmlElement(node) && node.nodeName === 'A';
}
export function isFormElement(node) {
    return isHtmlElement(node) && node.nodeName === 'FORM';
}
export function isDialogElement(node) {
    return isHtmlElement(node) && node.nodeName === 'DIALOG';
}
/**
 * Close every open `<dialog>` in the subtree, the element itself included.
 *
 * showModal() puts the dialog in the browser's top layer and makes the rest of the page
 * inert. WebKit keeps both when the element leaves the DOM without close() — the page
 * still scrolls, but every tap on it dies. Call this while the markup is still in the
 * document, before removing or replacing it.
 *
 * @example Close before a section morph removes the subtree
 * ```ts
 * removing(el) {
 *   closeOpenDialogs(el);
 * }
 * ```
 */
export function closeOpenDialogs(root) {
    if (!isDialogApiSupported())
        return;
    if (isDialogElement(root) && root.open)
        root.close();
    root.querySelectorAll('dialog[open]').forEach((el) => {
        if (isDialogElement(el))
            el.close();
    });
}
export function isInputElement(node) {
    return isHtmlElement(node) && node.nodeName === 'INPUT';
}
export function isInputRangeElement(node) {
    return isHtmlElement(node) && node.nodeName === 'INPUT' && node.getAttribute('type') == 'range';
}
export function isInputNumberElement(node) {
    return isHtmlElement(node) && node.nodeName === 'INPUT' && node.getAttribute('type') == 'number';
}
export function isButtonElement(node) {
    return isHtmlElement(node) && node.nodeName === 'BUTTON';
}
export function isSummaryElement(node) {
    return isHtmlElement(node) && node.nodeName === 'SUMMARY';
}
export function isTemplateElement(node) {
    return isHtmlElement(node) && node.nodeName === 'TEMPLATE';
}
export function isProductForm(el) {
    var _a;
    return isFormElement(el) && ((_a = el.getAttribute('action')) === null || _a === void 0 ? void 0 : _a.includes('cart/add'));
}
export function isInProductForm(el) {
    return isHtmlElement(el) && !isProductForm(el) && el.closest('form[action*="cart/add"]');
}
export function isHiddenInput(el) {
    return isInputElement(el) && el.type === 'hidden';
}
export function isShopifyAppBlock(el) {
    return isHtmlElement(el) && el.classList.contains('shopify-app-block');
}
export function isShopifyElement(el) {
    return isHtmlElement(el) && el.hasAttribute('data-shopify');
}
export function getWritingDirection(el) {
    return getComputedStyle(el).direction;
}
/**
 * Serializes a FormData object into a JSON object
 * @param formData - The form data to serialize
 * @returns
 */
export function serializeFormData(formData) {
    const result = {};
    for (const [key, value] of formData.entries()) {
        // Split the key into parts by brackets
        const parts = key.match(/([^\[\]]+)/g) || [key];
        let current = result;
        // Traverse through all parts except the last one
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            // Create nested object if it doesn't exist
            current[part] = current[part] || {};
            current = current[part];
        }
        // Set the value at the final level
        const lastPart = parts[parts.length - 1];
        current[lastPart] = value;
    }
    return result;
}
/**
 * Checks if a click event is occurring outside of a container element
 * @param event
 * @param container
 * @returns
 */
export function isClickingOutside(event, container) {
    // If the event target is not an element, then use it's coordinates to check if it's outside the element
    if (event.target instanceof HTMLDialogElement || !(event.target instanceof Element)) {
        return !isPointWithinElement(event.clientX, event.clientY, container);
    }
    // Using `event.composedPath` tells us whether the element _is or was_ contained in the container
    // when the click event was triggered. This is opposed to e.g. `element.contains(event.target)` which would
    // only check if the element _is_ contained in the container at the time the check is made. This
    // would fail if for instance the contents of the container were changed after the click event was triggered but
    // before the check is made.
    return !event.composedPath().includes(container);
}
/**
 * Checks if a point is within an element
 * @param x - The x coordinate of the point
 * @param y - The y coordinate of the point
 * @param element - The element to check
 * @returns True if the point is within the element, false otherwise
 */
export function isPointWithinElement(x, y, element) {
    const { left, right, top, bottom } = element.getBoundingClientRect();
    return x >= left && x <= right && y >= top && y <= bottom;
}
export function onDocumentReady(callback) {
    if (document.readyState !== 'complete') {
        document.addEventListener('DOMContentLoaded', callback);
    }
    else {
        callback();
    }
}
/**
 * Run `callback` when the browser is next idle.
 *
 * Always pass a `timeout`. Without one the browser is free to put the callback off for as long as
 * the main thread stays busy — on a genuinely loaded device that can mean it never runs at all, so
 * whatever the callback was deferring silently never happens. A timeout makes it run anyway once the
 * deadline passes. Our plugins use 2000ms unless there's a reason to be quicker.
 *
 * @param callback - Work to defer until the browser is idle.
 * @param options - Idle options, most importantly `timeout` in milliseconds.
 * @returns An id to pass to {@link cancelIdleCallback}.
 *
 * @example
 * const idleCallbackId = requestIdleCallback(() => setupExpensiveThing(), {timeout: 2000});
 * cleanup(() => cancelIdleCallback(idleCallbackId));
 */
export function requestIdleCallback(callback, options) {
    if (typeof window.requestIdleCallback === 'function') {
        return window.requestIdleCallback(callback, options);
    }
    else {
        let start = Date.now();
        return setTimeout(() => {
            callback({
                didTimeout: false,
                timeRemaining: () => { var _a; return Math.max(0, ((_a = options === null || options === void 0 ? void 0 : options.timeout) !== null && _a !== void 0 ? _a : 50) - (Date.now() - start)); },
            });
        }, 1);
    }
}
/**
 * Runs `callback` once the page has scrolled — or right after the next paint, if by then
 * it already has.
 *
 * Some setup only starts mattering once the page is away from the top: tracking the
 * scroll position, working out where a sticky header sits. Doing it during page load is
 * wasted effort, because a page at the top already behaves the way "not scrolled" says it
 * should, and that setup usually means measuring the page, which is the most expensive
 * thing to ask for while the page is still settling.
 *
 * Waiting for the first scroll event is not enough on its own: a page opened at an anchor
 * link, or restored by the back button, can scroll before our scripts run at all, and that
 * event is long gone by the time a listener could be attached. So the position is also
 * checked once — but not here and now. This function is typically called in the middle of
 * page setup, when style changes are still pending, and asking for the scroll position
 * then forces the browser to recalculate the whole page's styles just to answer. The
 * check instead waits for the next paint (readLayoutAfterPaint), when the answer is free.
 *
 * @param callback - Setup to run at the first scroll, or shortly after the next paint if
 * the page is already scrolled by then.
 * @returns A function that cancels the wait, if the scroll has not happened yet.
 *
 * @example
 * const cancelWait = onFirstScroll(() => startTrackingScrollPosition());
 * cleanup(() => cancelWait());
 */
export function onFirstScroll(callback) {
    let done = false;
    const run = () => {
        if (done)
            return;
        done = true;
        window.removeEventListener('scroll', run);
        callback();
    };
    window.addEventListener('scroll', run, { passive: true });
    // The position is read in the shared read batch (where it is free), but the callback
    // runs after the whole batch — it usually kicks off style writes, which must not land
    // between other components' batched reads.
    readLayoutAfterPaint(() => window.scrollY !== 0).then((hasScrolled) => {
        if (hasScrolled)
            run();
    });
    return () => {
        done = true;
        window.removeEventListener('scroll', run);
    };
}
export function cancelIdleCallback(id) {
    if (typeof window.cancelIdleCallback === 'function') {
        return window.cancelIdleCallback(id);
    }
    else {
        return clearTimeout(id);
    }
}
