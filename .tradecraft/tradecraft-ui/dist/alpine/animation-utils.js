const DATA_EXCLUDE_SUBTREE_ATTRIBUTE = 'data-skip-animation-wait';
const DEFAULT_EXCLUDE_SUBTREE_FILTER = (element) => element.hasAttribute(DATA_EXCLUDE_SUBTREE_ATTRIBUTE);
export const ANIMATION_START_TIMEOUT = 50; // ms
export const ANIMATION_COMPLETION_TIMEOUT = 2000; // ms
export default function (Alpine) {
    Alpine.magic('waitForAnimations', function ($el) {
        return async function (options) {
            var _a;
            const parentEl = (_a = options === null || options === void 0 ? void 0 : options.target) !== null && _a !== void 0 ? _a : $el;
            const animations = await getPendingAnimations(parentEl, options);
            return getCompletedAnimations(parentEl, animations, options === null || options === void 0 ? void 0 : options.subtree, options === null || options === void 0 ? void 0 : options.excludeSubtree);
        };
    });
}
/**
 * Returns a promise that resolves when all animations on the element have started. Waits for a short period of time, and if no animations have started it will reject with an error
 *
 * @param $el Element to check for animations
 * @returns
 */
async function getPendingAnimations($el, options = {}) {
    return new Promise((resolve, reject) => {
        let startTimeout = ANIMATION_START_TIMEOUT;
        if ((options === null || options === void 0 ? void 0 : options.startTimeout) !== undefined) {
            if (options.startTimeout === false) {
                startTimeout = 0;
            }
            else {
                startTimeout = options.startTimeout;
            }
        }
        // Wait for a short period of time, and if no animations have started output an error
        setTimeout(() => {
            let animations = $el.getAnimations(options);
            if (options.excludeSubtree) {
                animations = filterSubtreeAnimations($el, animations, options.excludeSubtree);
            }
            if (animations.length === 0) {
                warnForNoAnimationsStarted($el, options === null || options === void 0 ? void 0 : options.subtree);
                resolve([]);
            }
            else {
                resolve(animations);
            }
        }, startTimeout);
    });
}
/**
 * Returns a promise that resolves when all animations on the element have finished, or rejects if any animations don't finish within a timeout
 * @param $el Element animations are occuring on
 * @param animations Animations to wait for
 * @param subtree Whether to include animations in subtree
 * @param excludeSubtree Optional filter to exclude certain animations in subtree
 */
async function getCompletedAnimations($el, animations, subtree = false, excludeSubtree = DEFAULT_EXCLUDE_SUBTREE_FILTER) {
    let timedOutAnimations = [];
    let filteredAnimations = filterSubtreeAnimations($el, animations, excludeSubtree);
    const animationPromises = filteredAnimations.map((animation) => animation.finished);
    await promiseAllSettledWithTimeout(animationPromises, ANIMATION_COMPLETION_TIMEOUT).then((results) => {
        results.forEach((result, i) => {
            if (result.status === 'rejected' && result.reason === 'timeout') {
                timedOutAnimations = [...timedOutAnimations, filteredAnimations[i]];
            }
        });
    });
    if (timedOutAnimations.length > 0) {
        warnForNoAnimationsFinished($el, filteredAnimations, timedOutAnimations, subtree);
        return [];
    }
    return filteredAnimations;
}
function warnForNoAnimationsStarted($el, subtree = false) {
    if (process.env.NODE_ENV !== 'development')
        return;
    // Skip elements that are not rendered since animations cannot start inside display:none
    // (e.g. a closed cart drawer re-runs its accordion x-effect waits after a section update).
    // The typeof guard since iOS Safari below 17.4 lacks checkVisibility, and a throw inside
    // getPendingAnimations' timeout would leave the wait's promise pending forever
    if (typeof $el.checkVisibility === 'function' && !$el.checkVisibility())
        return;
    if (subtree) {
        console.warn(`Expected animations or transitions to start on element or its descendants, but none did after waiting ${ANIMATION_START_TIMEOUT}ms`, $el);
    }
    else {
        console.warn(`Expected animations or transitions to start on element, but none did after waiting ${ANIMATION_START_TIMEOUT}ms`, $el);
    }
}
function warnForNoAnimationsFinished($el, started, unfinished, subtree = false) {
    if (process.env.NODE_ENV !== 'development')
        return;
    if (subtree) {
        console.warn(`Expected all animations or transitions on element and its descendants to finish within ${ANIMATION_COMPLETION_TIMEOUT}ms, but ${unfinished.length} of ${started.length} did not`, $el, unfinished);
    }
    else {
        console.warn(`Expected all animations or transitions on element to finish within ${ANIMATION_COMPLETION_TIMEOUT}ms, but ${unfinished.length} of ${started.length} did not`, $el, unfinished);
    }
}
function promiseAllSettledWithTimeout(promises, timeoutMs) {
    return Promise.allSettled(promises.map((promise) => withTimeout(promise, timeoutMs)));
}
async function withTimeout(promise, timeoutMs) {
    let timeoutHandle;
    const timeoutPromise = new Promise((_resolve, reject) => {
        timeoutHandle = setTimeout(() => {
            reject('timeout');
        }, timeoutMs);
    });
    return Promise.race([promise, timeoutPromise])
        .then((result) => {
        clearTimeout(timeoutHandle);
        return result;
    })
        .catch((error) => {
        clearTimeout(timeoutHandle);
        throw error;
    });
}
function isKeyframeEffect(effect) {
    return effect instanceof KeyframeEffect;
}
/**
 * Filters out any animations who's target element matches the filter or any of its ancestors
 * @param animations
 * @param filter
 */
function filterSubtreeAnimations(rootEl, animations, filter) {
    // Traverse up the tree from the animated element to the root element, and check if any of the ancestors are excluded by the filter
    const hasExcludedAncestor = (animatedElement) => {
        let parent = animatedElement.parentElement;
        if (animatedElement === rootEl) {
            return false;
        }
        if (parent === rootEl) {
            return false;
        }
        while (parent) {
            if (filter(parent))
                return true;
            parent = parent.parentElement;
        }
        return false;
    };
    // Only return animations that are not excluded by the filter
    return animations.filter((animation) => {
        if (isKeyframeEffect(animation.effect)) {
            const target = animation.effect.target;
            if (!target) {
                return true;
            }
            if (filter(target)) {
                return false;
            }
            return !hasExcludedAncestor(target);
        }
        else {
            return true;
        }
    });
}
