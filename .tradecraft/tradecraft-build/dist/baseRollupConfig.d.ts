import { RollupOptions } from 'rollup';
export type BaseRollupConfigOptions = {
    /** Package names (and subpaths like 'photoswipe/lightbox') to treat as external. */
    externalPackages?: string[];
};
/**
 * Returns Rollup configs for theme and vendor bundles. Pass `externalPackages`
 * to control which imports are treated as external (loaded at runtime instead of bundled).
 */
export declare function getBaseRollupConfig(options?: BaseRollupConfigOptions): RollupOptions[];
declare const _default: RollupOptions[];
export default _default;
