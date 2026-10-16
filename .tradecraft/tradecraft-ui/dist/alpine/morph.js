import Alpine from 'alpinejs';
import { closeOpenDialogs, isDialogElement, isHtmlElement } from '../utils/dom';
import { getMorphUpdatePolicy, usesServerMorphFormState } from '../utils/morph-policy';
import { captureFocus, restoreFocus } from '../utils/preserve-focus';
import { lazyAlpineRuntimeAttributes } from './lazy-alpine';
const DATA_MORPH_VIEW_TRANSITION = 'data-morph-view-transition';
const DATA_MORPH_KEEP_ID = 'data-morph-keep-id';
const MORPH_IMAGE_DECODE_TIMEOUT = 1500;
const MORPH_SYNC_CONTROL_EVENT = 'morph:sync-control';
const DEPRECATED_MORPH_SYNC_EVENT = 'morph:sync';
function decodeImage(image) {
    return new Promise((resolve) => {
        let settled = false;
        const finish = (decoded) => {
            if (settled)
                return;
            settled = true;
            clearTimeout(timeout);
            resolve(decoded);
        };
        const timeout = setTimeout(() => finish(false), MORPH_IMAGE_DECODE_TIMEOUT);
        void image.decode().then(() => finish(true), () => finish(false));
    });
}
/**
 * Decode the first image in each incoming view-transition region before the
 * DOM changes. A failed image skips the transition but never blocks the morph.
 */
function prepareMorphImages(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    const images = Array.from(template.content.querySelectorAll(`[${DATA_MORPH_VIEW_TRANSITION}]`)).flatMap((el) => {
        const image = el.querySelector('img');
        return image ? [image] : [];
    });
    if (!images.length)
        return null;
    return Promise.all(images.map((source) => {
        const image = new Image();
        const sizes = source.getAttribute('sizes');
        const srcset = source.getAttribute('srcset');
        const src = source.getAttribute('src');
        if (source.crossOrigin)
            image.crossOrigin = source.crossOrigin;
        if (source.referrerPolicy)
            image.referrerPolicy = source.referrerPolicy;
        if (sizes)
            image.sizes = sizes;
        if (srcset)
            image.srcset = srcset;
        if (src)
            image.src = src;
        return decodeImage(image);
    })).then((results) => results.every(Boolean));
}
/**
 * Wait for the images in the live, morphed regions before Chromium captures its new snapshot.
 *
 * Decoding the detached response image above warms the resource, but it does not guarantee that
 * the live <img> has produced a paint after its src/srcset attributes change. Keeping the view
 * transition's update callback pending leaves the old snapshot on screen until the replacement
 * image itself is ready, so a product card can never expose its empty media background between
 * sibling or variant images.
 */
async function prepareLiveMorphImage(marked) {
    const image = marked.querySelector('img:not([data-morph-image-hold])');
    if (image)
        await decodeImage(image);
}
/**
 * The live element owns the runtime half of its lazy state.
 *
 * Server markup never carries `data-alpine-loading` or the initialized marker, so
 * patching attributes from it would strip them and re-lazify a component that is already
 * running — the queued init then re-runs directives over data the component still uses.
 * Copy the live values onto the incoming element before the morph compares attributes.
 *
 * The other lazy attributes are server-owned configuration (which roots are lazy, what
 * wakes them, what modules they need) and morph normally, so a section update can change
 * how a stable element initializes.
 */
function keepLazyRuntimeAttributes(el, toEl) {
    for (const name of lazyAlpineRuntimeAttributes) {
        const liveValue = el.getAttribute(name);
        if (liveValue === null) {
            toEl.removeAttribute(name);
        }
        else if (toEl.getAttribute(name) !== liveValue) {
            toEl.setAttribute(name, liveValue);
        }
    }
}
/**
 * The live element owns its id when it carries `data-morph-keep-id`.
 *
 * A Section API response can render with less context than the page render, so its id
 * can collide across instances that show the same resource. Copy the live id onto the
 * incoming element before the morph compares attributes, so the unique first-render id
 * survives every update. An element without a live id still takes the incoming id.
 */
function keepLiveId(el, toEl) {
    if (!el.hasAttribute(DATA_MORPH_KEEP_ID))
        return;
    const liveId = el.getAttribute('id');
    if (liveId === null)
        return;
    if (toEl.getAttribute('id') !== liveId)
        toEl.setAttribute('id', liveId);
}
/** Capture the currently painted image for browsers without scoped view transitions. */
function captureImageHolds(marked) {
    const holds = new Map();
    marked.forEach((region) => {
        var _a;
        const images = Array.from(region.querySelectorAll('img:not([data-morph-image-hold])'));
        const source = (_a = images.find((image) => image.getClientRects().length > 0)) !== null && _a !== void 0 ? _a : images[0];
        const src = (source === null || source === void 0 ? void 0 : source.currentSrc) || (source === null || source === void 0 ? void 0 : source.src);
        if (!source || !src)
            return;
        const style = getComputedStyle(source);
        const hold = document.createElement('img');
        hold.src = src;
        hold.alt = '';
        hold.setAttribute('aria-hidden', 'true');
        hold.setAttribute('data-morph-image-hold', '');
        hold.style.cssText = [
            'position:absolute',
            'inset:0',
            'width:100%',
            'height:100%',
            `object-fit:${style.objectFit}`,
            `object-position:${style.objectPosition}`,
            'z-index:2147483647',
            'pointer-events:none',
        ].join(';');
        holds.set(region, hold);
    });
    return holds;
}
function afterNextPaint() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
/**
 * Update without animation while keeping the old image painted until the connected replacement
 * decodes. This is the fallback for browsers that do not support element-scoped transitions.
 */
async function heldImageMorph(rootEl, marked, update, waitForImages = true) {
    const holds = captureImageHolds(marked);
    const didUpdate = update();
    if (!didUpdate)
        return false;
    const liveMarked = Array.from(rootEl.querySelectorAll(`[${DATA_MORPH_VIEW_TRANSITION}]`));
    const releases = liveMarked.flatMap((region) => {
        const hold = holds.get(region);
        if (!hold)
            return [];
        region.append(hold);
        return [
            prepareLiveMorphImage(region)
                .then(afterNextPaint)
                .finally(() => hold.remove()),
        ];
    });
    // Multi-region section morphs update immediately and release each old image independently.
    // A slow card must not keep the whole section's pending state or every other hold alive.
    if (waitForImages)
        await Promise.all(releases);
    return true;
}
/**
 * Run the morph on the marked media element itself. The browser keeps the old scoped snapshot
 * visible while the connected replacement image decodes inside the update callback.
 */
function scopedMorph(rootEl, scope, update) {
    let didUpdate = false;
    const transition = scope.startViewTransition(async () => {
        didUpdate = update();
        if (!didUpdate)
            return;
        const liveMarked = rootEl.querySelector(`[${DATA_MORPH_VIEW_TRANSITION}]`);
        if (liveMarked)
            await prepareLiveMorphImage(liveMarked);
    });
    // A newer transition on the same scope may skip this animation. Its DOM update is still valid;
    // consume the animation-only rejections so rapid swatch presses do not create unhandled errors.
    transition.ready.catch(() => undefined);
    transition.finished.catch(() => undefined);
    return transition.updateCallbackDone.then(() => didUpdate);
}
/**
 * Morph rootEl with html, merging default data-morph policies
 * with morphOptions. When rootEl is the element being updated, only its children are morphed.
 * A `data-morph-update="none"` or `data-morph-update="regions"` policy on rootEl itself does not
 * apply, because these policies guard the subtree from an ancestor's morph, not from a morph the
 * caller aims at rootEl.
 *
 * A descendant carrying `data-morph-view-transition` scopes a view transition to that element,
 * rather than capturing the document. Its first incoming image is decoded before the update and
 * the connected replacement finishes decoding before the browser captures the new scoped frame.
 * Browsers without element-scoped transitions keep the old image painted until that point and
 * swap without animation; this never falls back to a document transition.
 *
 * A descendant carrying `data-morph-keep-id` keeps its live id through the morph. Use it when
 * the server response renders with less context than the page render and its id can collide
 * across instances that show the same resource.
 *
 * @param rootEl - The root element to morph
 * @param html - The new HTML string to morph into
 * @param morphOptions - Optional AlpineMorphConfig to merge with default behavior
 * @param shouldUpdate - Checked immediately before changing the DOM
 * @returns Whether this morph still owned and updated the DOM
 */
export function morph(rootEl, html, morphOptions, shouldUpdate = () => true) {
    const syncedElements = [];
    let flushScheduled = false;
    const scheduleFlush = () => {
        if (flushScheduled)
            return;
        flushScheduled = true;
        queueMicrotask(() => {
            for (const { el, detail } of syncedElements) {
                el.dispatchEvent(new CustomEvent(MORPH_SYNC_CONTROL_EVENT, { bubbles: true, detail }));
                el.dispatchEvent(new CustomEvent(DEPRECATED_MORPH_SYNC_EVENT, { bubbles: true, detail }));
            }
            syncedElements.length = 0;
            flushScheduled = false;
        });
    };
    const pushSync = (el, previousValue, value, alwaysNotify = false) => {
        if (alwaysNotify || previousValue !== value) {
            syncedElements.push({ el, detail: { previousValue, value } });
            scheduleFlush();
        }
    };
    const syncInputValue = (newNode, oldNode, alwaysNotify = false) => {
        if (oldNode.type === 'file')
            return;
        const previousValue = oldNode.value;
        const value = newNode.value;
        if (value === null) {
            oldNode.value = '';
        }
        else {
            oldNode.value = value;
        }
        pushSync(oldNode, previousValue, value !== null && value !== void 0 ? value : '', alwaysNotify);
    };
    const syncCheckbox = (newNode, oldNode) => {
        const previousValue = oldNode.checked ? 'true' : 'false';
        const value = newNode.checked ? 'true' : 'false';
        oldNode.checked = newNode.checked;
        if (newNode.indeterminate !== oldNode.indeterminate) {
            oldNode.indeterminate = newNode.indeterminate;
        }
        pushSync(oldNode, previousValue, value);
    };
    const syncRadio = (newNode, oldNode) => {
        const previousValue = oldNode.checked ? oldNode.value : '';
        const value = newNode.checked ? newNode.value : '';
        oldNode.checked = newNode.checked;
        pushSync(oldNode, previousValue, value);
    };
    const syncTextareaValue = (newNode, oldNode) => {
        const previousValue = oldNode.value;
        const value = newNode.value;
        if (value !== oldNode.value) {
            oldNode.value = value;
        }
        const firstChild = oldNode.firstChild;
        if ((firstChild === null || firstChild === void 0 ? void 0 : firstChild.nodeType) === Node.TEXT_NODE) {
            if (value === '' && firstChild.nodeValue === oldNode.placeholder) {
                return;
            }
            firstChild.nodeValue = value;
        }
        pushSync(oldNode, previousValue, value);
    };
    const config = Object.assign(Object.assign({}, morphOptions), { updating(el, toEl, childrenOnly, skip, skipChildren) {
            var _a;
            if (el instanceof Element && toEl instanceof Element) {
                keepLazyRuntimeAttributes(el, toEl);
                keepLiveId(el, toEl);
                // The wrapper is always a children-only morph target. Descendant policies
                // protect their subtree from this ancestor-driven morph.
                if (isHtmlElement(el) && isHtmlElement(toEl) && el === rootEl) {
                    childrenOnly();
                }
                else {
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
                }
                if (usesServerMorphFormState(el) && usesServerMorphFormState(toEl)) {
                    if (el instanceof HTMLInputElement && toEl instanceof HTMLInputElement) {
                        // Hidden inputs often back richer client-side controls. Notify those controls
                        // after every morph because their option markup can change while the value stays equal.
                        const alwaysNotify = el.type === 'hidden' && toEl.type === 'hidden';
                        syncInputValue(toEl, el, alwaysNotify);
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
            (_a = morphOptions === null || morphOptions === void 0 ? void 0 : morphOptions.updating) === null || _a === void 0 ? void 0 : _a.call(morphOptions, el, toEl, childrenOnly, skip, skipChildren);
        },
        updated(el, toEl) {
            var _a;
            (_a = morphOptions === null || morphOptions === void 0 ? void 0 : morphOptions.updated) === null || _a === void 0 ? void 0 : _a.call(morphOptions, el, toEl);
        },
        removing(el, skip) {
            var _a;
            let isSkipped = false;
            const skipRemoval = () => {
                isSkipped = true;
                skip();
            };
            if (el instanceof Element) {
                const policy = getMorphUpdatePolicy(el);
                if (policy === 'none' || policy === 'regions')
                    skipRemoval();
            }
            (_a = morphOptions === null || morphOptions === void 0 ? void 0 : morphOptions.removing) === null || _a === void 0 ? void 0 : _a.call(morphOptions, el, skipRemoval);
            // Alpine's morph detaches the node before it destroys the Alpine tree on it, so this
            // is the last moment an open modal <dialog> is still in the document and can give up
            // the top layer. A skipped element stays put, so it keeps its dialogs.
            if (!isSkipped && isHtmlElement(el)) {
                closeOpenDialogs(el);
            }
        } });
    const update = () => {
        if (!shouldUpdate())
            return false;
        // Morphing can replace or remove the focused element, dropping focus to <body> —
        // capture it up front and restore it (or the closest equivalent) afterwards
        const focusSnapshot = captureFocus(rootEl);
        // Alpine's morph drops a keyed element with a bare remove() or replaceWith(), which never
        // reaches the removing() hook above. An open modal <dialog> detached that way holds the
        // top layer and leaves every tap on the page dead, so collect them and check afterwards.
        const openDialogs = Array.from(rootEl.querySelectorAll('dialog[open]'));
        Alpine.morph(rootEl, html, config);
        // close() takes the dialog out of the document's top layer whether or not the element is
        // still attached, so a stranded one gives the page back
        openDialogs.forEach((el) => {
            if (isDialogElement(el) && el.open && !el.isConnected)
                el.close();
        });
        restoreFocus(rootEl, focusSnapshot);
        return true;
    };
    const liveMarked = Array.from(rootEl.querySelectorAll(`[${DATA_MORPH_VIEW_TRANSITION}]`));
    if (!liveMarked.length)
        return Promise.resolve(update());
    // A section can contain several product cards. Element-scoped transitions cannot span them,
    // so morph immediately and keep each retained card's old image until its own replacement paints.
    if (liveMarked.length > 1)
        return heldImageMorph(rootEl, liveMarked, update, false);
    const run = (imagesReady) => {
        if (!shouldUpdate())
            return Promise.resolve(false);
        const scope = liveMarked[0];
        if (imagesReady && typeof scope.startViewTransition === 'function') {
            return scopedMorph(rootEl, scope, update);
        }
        return heldImageMorph(rootEl, liveMarked, update);
    };
    const prepared = prepareMorphImages(html);
    if (prepared) {
        return prepared.then(run);
    }
    return run(true);
}
