/**
 * Calculate grid row and column sizes dynamically for any CSS grid in order to build a grid inspector
 */
export default function (Alpine) {
    Alpine.directive('grid-inspector', ($el, { value, modifiers }) => {
        if (value === 'source') {
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        init() {
                            this.$data.sourceGridEl = $el;
                        },
                    };
                },
            });
        }
        else if (value === null) {
            Alpine.bind($el, {
                ['x-data']() {
                    return {
                        isObserving: false,
                        sourceGridEl: null,
                        resizeObserver: null,
                        mutationObserver: null,
                        debugGridBounds: {
                            top: 0,
                            left: 0,
                            height: 0,
                            width: 0,
                        },
                        debugGridRows: [],
                        debugGridCols: [],
                        destroy() {
                            this.unobserveSourceGrid();
                            this.clearGridLines();
                        },
                        clearGridLines() {
                            this.debugGridRows = [];
                            this.debugGridCols = [];
                        },
                        calculateGridBounds() {
                            if (!this.sourceGridEl)
                                return;
                            const boundingClientRect = this.sourceGridEl.getBoundingClientRect();
                            this.debugGridBounds = {
                                top: boundingClientRect.top,
                                left: boundingClientRect.left,
                                height: boundingClientRect.height,
                                width: boundingClientRect.width,
                            };
                        },
                        calculateGridLines() {
                            if (!this.sourceGridEl)
                                return;
                            const computedStyle = getComputedStyle(this.sourceGridEl);
                            const rows = computedStyle.gridTemplateRows.split(' ');
                            const cols = computedStyle.gridTemplateColumns.split(' ');
                            this.debugGridRows = rows;
                            this.debugGridCols = cols;
                        },
                        calculateDebounced: Alpine.debounce(function () {
                            this.calculateGridBounds();
                            this.calculateGridLines();
                        }, 100),
                        observeSourceGrid() {
                            if (this.isObserving)
                                return;
                            if (!this.sourceGridEl)
                                return;
                            this.isObserving = true;
                            this.calculateDebounced();
                            this.resizeObserver = new ResizeObserver(() => {
                                window.requestAnimationFrame(() => {
                                    window.requestAnimationFrame(() => {
                                        this.calculateDebounced();
                                    });
                                });
                            });
                            this.resizeObserver.observe(this.sourceGridEl);
                            // Observe existing children
                            for (const child of this.sourceGridEl.children) {
                                this.resizeObserver.observe(child);
                            }
                            this.mutationObserver = new MutationObserver((mutations) => {
                                var _a;
                                // Re-observe new children when they're added
                                for (const mutation of mutations) {
                                    if (mutation.type === 'childList') {
                                        for (const addedNode of mutation.addedNodes) {
                                            if (addedNode.nodeType === Node.ELEMENT_NODE) {
                                                (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.observe(addedNode);
                                            }
                                        }
                                    }
                                }
                                window.requestAnimationFrame(() => {
                                    this.calculateDebounced();
                                });
                            });
                            this.mutationObserver.observe(this.sourceGridEl, {
                                childList: true,
                                subtree: true,
                            });
                        },
                        unobserveSourceGrid() {
                            var _a, _b;
                            if (!this.sourceGridEl)
                                return;
                            (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
                            this.resizeObserver = null;
                            (_b = this.mutationObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
                            this.mutationObserver = null;
                            this.isObserving = false;
                        },
                    };
                },
            });
        }
        else {
            throw new Error(`Unknown directive: x-grid-inspector:${value}`);
        }
    }).before('bind');
}
