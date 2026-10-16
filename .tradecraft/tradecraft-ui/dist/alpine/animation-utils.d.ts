import { Alpine as AlpineType } from 'alpinejs';
export type WaitForAnimationsOptions = GetAnimationsOptions & {
    target?: HTMLElement;
    /**
     * Number of milliseconds to wait for animations to start before rejecting
     */
    startTimeout?: number | false;
    /**
     * Whether to include animations on descendants of the target element
     */
    subtree?: boolean;
    /**
     * Function that can optionally exclude any animations for an element, or any of its descendants
     */
    excludeSubtree?: (element: Element) => boolean;
};
export type WaitForAnimationsMagic = (options?: WaitForAnimationsOptions) => Promise<Animation[]>;
declare module 'alpinejs' {
    interface Magics<T> {
        /**
         * Async function that will wait for all animations on the element to start, and then wait for them to finish.
         * If not animations start, or finish within a timeout, an error will be thrown.
         */
        $waitForAnimations: WaitForAnimationsMagic;
    }
}
export declare const ANIMATION_START_TIMEOUT = 50;
export declare const ANIMATION_COMPLETION_TIMEOUT = 2000;
export default function (Alpine: AlpineType): void;
