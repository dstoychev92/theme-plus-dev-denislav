import { morph } from '../alpine/morph';
import { closeOpenDialogs } from '../utils/dom';
import { getMorphUpdatePolicy } from '../utils/morph-policy';
import { captureFocus, restoreFocus } from '../utils/preserve-focus';
export const MORPH_ROOT_ATTR = 'data-morph-root';
export const RENDER_REGION_ATTR = 'data-render-region';
export const RENDER_REGION_MODE_ATTR = 'data-render-mode';
export const RENDER_REGION_SELECTOR = `[${RENDER_REGION_ATTR}], [${MORPH_ROOT_ATTR}]`;
const SECTION_API_SELECTOR = '[x-section-api]';
const SECTION_API_COMMENT = /<!--shopify:rendered_by_section_api-->/g;
export function sanitizeSectionHtml(html) {
    return html.replace(SECTION_API_COMMENT, '');
}
export function parseSectionRoot(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.firstElementChild;
}
/** Section API responses usually contain the existing section wrapper. */
export function getReplacementContent(sanitizedHtml, responseRoot) {
    var _a;
    return (_a = responseRoot === null || responseRoot === void 0 ? void 0 : responseRoot.innerHTML) !== null && _a !== void 0 ? _a : sanitizedHtml;
}
function getRenderRegionName(region) {
    var _a;
    return (_a = region.getAttribute(RENDER_REGION_ATTR)) !== null && _a !== void 0 ? _a : region.getAttribute(MORPH_ROOT_ATTR);
}
function getRenderRegionMode(region, defaultMode) {
    var _a;
    const mode = region.getAttribute(RENDER_REGION_MODE_ATTR);
    if (mode == null || mode === '')
        return defaultMode;
    if (mode === 'morph' || mode === 'replace')
        return mode;
    throw new Error(`Unknown render mode for region "${(_a = getRenderRegionName(region)) !== null && _a !== void 0 ? _a : ''}": ${mode}`);
}
function allowsNestedRenderRegions(region, ancestor) {
    let current = region;
    while (current && current !== ancestor) {
        if (getMorphUpdatePolicy(current) === 'regions')
            return true;
        current = current.parentElement;
    }
    return false;
}
/**
 * Return the deepest regions owned by this Section API controller. A
 * `data-morph-update="regions"` boundary explicitly keeps a morph-mode ancestor
 * eligible while its nested region updates in a separate pass. Regions in a
 * nested controller belong to that controller and must not affect its parent.
 */
export function findOwnedLeafRenderRegions(root, defaultMode = 'morph') {
    const regions = findOwnedRenderRegions(root);
    return regions.filter((candidate) => !regions.some((other) => other !== candidate &&
        candidate.contains(other) &&
        !(getRenderRegionMode(candidate, defaultMode) === 'morph' && allowsNestedRenderRegions(other, candidate))));
}
/** Return every render region owned by this Section API controller, including nested regions. */
function findOwnedRenderRegions(root) {
    const rootIsController = root.matches(SECTION_API_SELECTOR);
    const candidates = [
        ...(root.matches(RENDER_REGION_SELECTOR) ? [root] : []),
        ...Array.from(root.querySelectorAll(RENDER_REGION_SELECTOR)),
    ];
    return candidates.filter((region) => {
        const owner = region.closest(SECTION_API_SELECTOR);
        return rootIsController ? owner === root : owner === null;
    });
}
/** Find the copy of the live controller inside a wrapped Section API response. */
function findResponseControllerRoot(currentRoot, responseRoot) {
    var _a;
    const sectionId = currentRoot.getAttribute('x-section-api');
    if (!sectionId)
        return responseRoot;
    const matches = [
        responseRoot,
        ...Array.from(responseRoot.querySelectorAll(SECTION_API_SELECTOR)),
    ].filter((candidate) => candidate.getAttribute('x-section-api') === sectionId);
    if (matches.length > 1) {
        throw new Error(`Section API response contains multiple controllers for "${sectionId}"`);
    }
    return (_a = matches[0]) !== null && _a !== void 0 ? _a : responseRoot;
}
function indexRenderRegions(regions, source) {
    const byName = new Map();
    for (const region of regions) {
        const name = getRenderRegionName(region);
        if (!name)
            throw new Error(`Section API ${source} render region must have a name`);
        if (byName.has(name))
            throw new Error(`Section API ${source} contains duplicate render region "${name}"`);
        byName.set(name, region);
    }
    return byName;
}
/**
 * Pair corresponding live and response regions before any DOM is changed.
 * `data-morph-root` participates as a compatibility alias for
 * `data-render-region`; new markup can additionally choose morph or replace per
 * region through `data-render-mode`. Explicit region requests are atomic, while
 * an implicit all-region update can continue when conditional regions disappear.
 */
export function selectRenderRegions(currentRoot, responseRoot, { regions: requestedRegions, defaultMode = 'morph' } = {}) {
    if (!responseRoot)
        return { strategy: 'skip', reason: 'missing-response-root' };
    const currentRegions = findOwnedLeafRenderRegions(currentRoot, defaultMode);
    const requestedRegionNames = (requestedRegions === null || requestedRegions === void 0 ? void 0 : requestedRegions.length) ? new Set(requestedRegions) : null;
    if (currentRegions.length === 0) {
        return requestedRegionNames
            ? { strategy: 'skip', reason: 'no-matching-regions', regionNames: [...requestedRegionNames] }
            : { strategy: 'render-section' };
    }
    const currentByName = indexRenderRegions(currentRegions, 'live');
    const selectedNames = requestedRegionNames ? [...requestedRegionNames] : [...currentByName.keys()];
    const unknownNames = selectedNames.filter((name) => !currentByName.has(name));
    if (unknownNames.length > 0) {
        return { strategy: 'skip', reason: 'no-matching-regions', regionNames: unknownNames };
    }
    const responseControllerRoot = findResponseControllerRoot(currentRoot, responseRoot);
    // A response can populate an initially empty live region with nested regions.
    // Match the live leaf targets against all response regions so their same-named
    // response ancestors remain eligible during that transition.
    const responseByName = indexRenderRegions(findOwnedRenderRegions(responseControllerRoot).filter((region) => {
        const name = getRenderRegionName(region);
        return name != null && selectedNames.includes(name);
    }), 'response');
    const missingNames = selectedNames.filter((name) => !responseByName.has(name));
    if (requestedRegionNames && missingNames.length > 0) {
        return { strategy: 'skip', reason: 'missing-response-regions', regionNames: missingNames };
    }
    const matchedNames = selectedNames.filter((name) => responseByName.has(name));
    if (matchedNames.length === 0) {
        return { strategy: 'skip', reason: 'missing-response-regions', regionNames: missingNames };
    }
    return {
        strategy: 'render-regions',
        regions: matchedNames.map((name) => {
            const current = currentByName.get(name);
            return {
                name,
                mode: getRenderRegionMode(current, defaultMode),
                current,
                replacement: responseByName.get(name),
            };
        }),
    };
}
/** Replace a section's contents and restore the Alpine and focus lifecycle around the DOM swap. */
export function replaceSectionHtml(Alpine, root, html) {
    const sanitizedHtml = sanitizeSectionHtml(html);
    const responseRoot = parseSectionRoot(sanitizedHtml);
    const replacementRoot = responseRoot ? findResponseControllerRoot(root, responseRoot) : null;
    const content = getReplacementContent(sanitizedHtml, replacementRoot);
    const focusSnapshot = captureFocus(root);
    Alpine.mutateDom(() => {
        // WebKit can retain a removed open dialog in the top layer, leaving the page inert.
        closeOpenDialogs(root);
        root.innerHTML = content;
        Alpine.skipDuringClone(() => Alpine.initTree(root))();
    });
    restoreFocus(root, focusSnapshot);
}
/**
 * Replace a render region, including its root element. Unlike a whole-section
 * replacement, a region has no controller state that must survive on its root.
 * Destroying the outgoing Alpine tree before initializing the incoming one
 * prevents stale refs, effects, and plugin state from leaking across the swap.
 */
export function replaceRegionHtml(Alpine, root, replacement) {
    const focusSnapshot = captureFocus(root);
    Alpine.mutateDom(() => {
        // WebKit can retain a removed open dialog in the top layer, leaving the page inert.
        closeOpenDialogs(root);
        Alpine.destroyTree(root);
        root.replaceWith(replacement);
        Alpine.skipDuringClone(() => Alpine.initTree(replacement))();
    });
    restoreFocus(replacement, focusSnapshot);
}
/** Morph one already-paired render region without re-running section target selection. */
export function morphRegionHtml(root, replacement, morphConfig, shouldUpdate) {
    return morph(root, replacement.outerHTML, morphConfig, shouldUpdate);
}
/** Morph a complete section after region selection has chosen the fallback. */
export function morphSectionHtml(root, html, morphConfig, shouldUpdate) {
    var _a;
    const sanitizedHtml = sanitizeSectionHtml(html);
    const responseRoot = parseSectionRoot(sanitizedHtml);
    const replacementRoot = responseRoot ? findResponseControllerRoot(root, responseRoot) : null;
    return morph(root, (_a = replacementRoot === null || replacementRoot === void 0 ? void 0 : replacementRoot.outerHTML) !== null && _a !== void 0 ? _a : sanitizedHtml, morphConfig, shouldUpdate);
}
