import { getMorphUpdatePolicy, usesServerMorphFormState } from './morph-policy';
const MORPH_SYNC_CONTROL_EVENT = 'morph:sync-control';
const DEPRECATED_MORPH_SYNC_EVENT = 'morph:sync';
let syncedElements = [];
let flushScheduled = false;
function scheduleFlush() {
    if (flushScheduled)
        return;
    flushScheduled = true;
    queueMicrotask(() => {
        for (const { el, detail } of syncedElements) {
            el.dispatchEvent(new CustomEvent(MORPH_SYNC_CONTROL_EVENT, { bubbles: true, detail }));
            el.dispatchEvent(new CustomEvent(DEPRECATED_MORPH_SYNC_EVENT, { bubbles: true, detail }));
        }
        syncedElements = [];
        flushScheduled = false;
    });
}
/**
 * Sync .value from the incoming node to the existing node.
 * Alpine.morph only updates attributes by default; this keeps the live property in sync.
 */
function syncInputValue(newNode, oldNode) {
    if (oldNode.type === 'file')
        return;
    const previousValue = oldNode.value;
    const newValue = newNode.value;
    if (newValue === null) {
        oldNode.value = '';
    }
    else {
        oldNode.value = newValue;
    }
    syncedElements.push({
        el: oldNode,
        detail: { previousValue, value: newValue !== null && newValue !== void 0 ? newValue : '' },
    });
    scheduleFlush();
}
/**
 * Sync checkbox .checked and .indeterminate from the incoming node to the existing node.
 */
function syncCheckbox(newNode, oldNode) {
    oldNode.checked = newNode.checked;
    if (newNode.indeterminate !== oldNode.indeterminate) {
        oldNode.indeterminate = newNode.indeterminate;
    }
}
/**
 * Sync radio .checked from the incoming node to the existing node.
 */
function syncRadio(newNode, oldNode) {
    oldNode.checked = newNode.checked;
}
/**
 * Sync textarea value from the incoming node to the existing node, including the first text child
 * so the DOM stays consistent (e.g. for placeholder edge case).
 */
function syncTextareaValue(newNode, oldNode) {
    const previousValue = oldNode.value;
    const newValue = newNode.value;
    if (newValue !== oldNode.value) {
        oldNode.value = newValue;
    }
    const firstChild = oldNode.firstChild;
    if ((firstChild === null || firstChild === void 0 ? void 0 : firstChild.nodeType) === Node.TEXT_NODE) {
        if (newValue === '' && firstChild.nodeValue === oldNode.placeholder) {
            return;
        }
        firstChild.nodeValue = newValue;
    }
    syncedElements.push({
        el: oldNode,
        detail: { previousValue, value: newValue },
    });
    scheduleFlush();
}
/**
 * Function that combines some default morph behavior with custom behavior
 * @param options - The custom behavior to combine with the default behavior
 * @returns The combined morph behavior
 */
export function buildMorphConfig(options) {
    return Object.assign(Object.assign({}, options), { updating(el, toEl, childrenOnly, skip, skipChildren) {
            var _a;
            if (el instanceof Element && toEl instanceof Element) {
                switch (getMorphUpdatePolicy(el)) {
                    case 'attributes':
                        skipChildren();
                        break;
                    case 'children':
                        childrenOnly();
                        break;
                    case 'none':
                    case 'regions':
                        skip();
                        break;
                }
                // Sync .value / .checked / .indeterminate from incoming node to existing node when opted in
                if (usesServerMorphFormState(el) && usesServerMorphFormState(toEl)) {
                    if (el instanceof HTMLInputElement && toEl instanceof HTMLInputElement) {
                        syncInputValue(toEl, el);
                        if (el.type === 'checkbox') {
                            syncCheckbox(toEl, el);
                        }
                        else if (el.type === 'radio') {
                            syncRadio(toEl, el);
                        }
                    }
                    else if (el instanceof HTMLTextAreaElement && toEl instanceof HTMLTextAreaElement) {
                        syncTextareaValue(toEl, el);
                    }
                }
            }
            (_a = options === null || options === void 0 ? void 0 : options.updating) === null || _a === void 0 ? void 0 : _a.call(options, el, toEl, childrenOnly, skip, skipChildren);
        },
        updated(el, toEl) {
            var _a;
            (_a = options === null || options === void 0 ? void 0 : options.updated) === null || _a === void 0 ? void 0 : _a.call(options, el, toEl);
        },
        removing(el, skip) {
            var _a;
            if (el instanceof Element) {
                const policy = getMorphUpdatePolicy(el);
                if (policy === 'none' || policy === 'regions')
                    skip();
            }
            (_a = options === null || options === void 0 ? void 0 : options.removing) === null || _a === void 0 ? void 0 : _a.call(options, el, skip);
        } });
}
