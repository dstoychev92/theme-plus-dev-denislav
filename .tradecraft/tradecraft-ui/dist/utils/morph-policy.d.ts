export declare const DATA_MORPH_UPDATE = "data-morph-update";
export declare const DATA_MORPH_FORM_STATE = "data-morph-form-state";
export type MorphUpdatePolicy = 'all' | 'attributes' | 'children' | 'none' | 'regions';
/**
 * Returns the update policy owned by the live element.
 *
 * The single policy attribute takes precedence over the deprecated flags. The
 * legacy checks are intentionally kept here so every morph entry point provides
 * the same backwards-compatible behavior.
 */
export declare function getMorphUpdatePolicy(el: Element): MorphUpdatePolicy;
/**
 * Whether form-control properties should be copied from this server-rendered node.
 * `data-morph-sync` remains a deprecated alias so old and new markup can coexist
 * during a rolling theme migration.
 */
export declare function usesServerMorphFormState(el: Element): boolean;
