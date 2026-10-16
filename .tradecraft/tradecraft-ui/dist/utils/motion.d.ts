/**
 * Workaround for an upstream type-identity split in `motion@12.40+`.
 *
 * The `MotionValue` type that `motion` exports (and that `motionValue()` returns)
 * is *not* the same `MotionValue` that motion's own functions (`animate`,
 * `springValue`, `transformValue`, `styleEffect`, `scroll`) accept as parameters —
 * the exported type is missing `current` / `prev` / `prevFrameValue` /
 * `dependents`. The two shapes are mutually un-assignable and neither is nameable,
 * so a value created with `motionValue()` cannot be passed to the functions meant
 * to consume it without a cast.
 *
 * This centralizes that unavoidable cast into one named, greppable place instead
 * of scattering `as any` across call sites. It is `unknown -> any` (the same
 * runtime safety as `as any`); a type-checked signature is impossible here because
 * the input type *is* the mismatch. Delete this and its call sites once motion
 * ships consistent types.
 */
export declare function motionArg(value: unknown): any;
