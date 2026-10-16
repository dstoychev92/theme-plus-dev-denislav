export const DATA_MORPH_UPDATE = 'data-morph-update';
export const DATA_MORPH_FORM_STATE = 'data-morph-form-state';
const DATA_MORPH_SYNC = 'data-morph-sync';
const DATA_MORPH_CHILDREN_ONLY = 'data-morph-children-only';
const DATA_MORPH_SKIP = 'data-morph-skip';
const DATA_MORPH_SKIP_CHILDREN = 'data-morph-skip-children';
const morphUpdatePolicies = new Set(['all', 'attributes', 'children', 'none', 'regions']);
/**
 * Returns the update policy owned by the live element.
 *
 * The single policy attribute takes precedence over the deprecated flags. The
 * legacy checks are intentionally kept here so every morph entry point provides
 * the same backwards-compatible behavior.
 */
export function getMorphUpdatePolicy(el) {
    const policy = el.getAttribute(DATA_MORPH_UPDATE);
    if (policy !== null) {
        if (morphUpdatePolicies.has(policy)) {
            return policy;
        }
        throw new Error(`${DATA_MORPH_UPDATE} must be one of "all", "attributes", "children", "none", or "regions"; received "${policy}"`);
    }
    // Deprecated aliases. Prefer the most restrictive policy if old flags conflict.
    if (el.hasAttribute(DATA_MORPH_SKIP))
        return 'none';
    if (el.hasAttribute(DATA_MORPH_CHILDREN_ONLY))
        return 'children';
    if (el.hasAttribute(DATA_MORPH_SKIP_CHILDREN))
        return 'attributes';
    return 'all';
}
/**
 * Whether form-control properties should be copied from this server-rendered node.
 * `data-morph-sync` remains a deprecated alias so old and new markup can coexist
 * during a rolling theme migration.
 */
export function usesServerMorphFormState(el) {
    const policy = el.getAttribute(DATA_MORPH_FORM_STATE);
    if (policy !== null) {
        if (policy === 'server')
            return true;
        throw new Error(`${DATA_MORPH_FORM_STATE} currently only supports "server"; received "${policy}"`);
    }
    return el.hasAttribute(DATA_MORPH_SYNC);
}
