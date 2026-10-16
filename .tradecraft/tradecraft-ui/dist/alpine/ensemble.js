import { warnMissingParentDirective } from '../utils/error';
const ENSEMBLE_MEMBERS = ['slideshow', 'disclosure-group', 'tabs', 'carousel', 'hotspots'];
/**
 * Ensemble brings together multiple elements and binds them to the same data
 *
 * e.g.
 * <div x-ensemble>
 *   <div x-ensemble:slideshow.duration.{{ section.settings.duration | times: 1000 }}ms>...</div>
 *   <div x-ensemble:accordion>...</div>
 * </div>
 *
 * When an x-ensemble:* directive is nested inside another x-ensemble:* directive,
 * the inner one does not participate in the shared ensemble state — it falls back
 * to the underlying directive's own independent state. Nesting is detected via a
 * `__ensemble_member` owner added to the Alpine scope chain on the outer member.
 */
export default function ensemble(Alpine) {
    Alpine.directive('ensemble', ($el, { value, modifiers }) => {
        var _a;
        const $data = Alpine.$data($el);
        const { $ensemble } = $data;
        // Detect nesting via the Alpine scope chain: an outer x-ensemble:* member marks
        // its subtree with the member element so a descendant x-ensemble:* can opt out of
        // shared $ensemble wiring. Comparing the owner also allows multiple member
        // directives on one element (for example an accordion group that is both a
        // disclosure group and a slideshow) to participate in the same ensemble.
        const memberOwner = $data.__ensemble_member;
        const isNested = value !== null && memberOwner !== undefined && memberOwner !== $el;
        // A member used outside any x-ensemble has no shared $ensemble. Warn and bail before binding the
        // underlying directive — its $ensemble-backed getters/setters (e.g. reading $ensemble.selectedIndex)
        // would otherwise throw. Nested members legitimately run without $ensemble, so this only targets the
        // truly parent-less case.
        if (value !== null && !isNested && !$ensemble && ENSEMBLE_MEMBERS.includes(value)) {
            warnMissingParentDirective(`x-ensemble:${value}`, 'x-ensemble', $el);
            return;
        }
        if (value !== null && !isNested && memberOwner !== $el) {
            Alpine.addScopeToNode($el, { __ensemble_member: $el });
        }
        switch (value) {
            case 'slideshow':
                if (isNested) {
                    Alpine.bind($el, {
                        [`x-slideshow${modifiers.length ? `.${modifiers.join('.')}` : ''}`]: '',
                    });
                    break;
                }
                Alpine.bind($el, {
                    [`x-slideshow${modifiers.length ? `.${modifiers.join('.')}` : ''}`]() {
                        return {
                            get currentSlideIndex() {
                                if (!$ensemble)
                                    return 0;
                                if ($ensemble.selectedIndex === null)
                                    return 0;
                                // If this is the last slide of this particular ensemble members slideshow but there are more slides in the ensemble
                                // then just show the last slide of the ensemble
                                if ($ensemble.selectedIndex >= this.totalSlides) {
                                    return this.totalSlides - 1;
                                }
                                return $ensemble.selectedIndex;
                            },
                            set currentSlideIndex(value) {
                                $ensemble.selectedIndex = value;
                            },
                            get state() {
                                if (!$ensemble)
                                    return 'paused';
                                // If this particular ensemble member's slideshow has less slides than the ensemble itself (i.e. there are other slideshows in the ensemble)
                                // then pause _this_ slideshow and let the other slideshows take over
                                if (this.totalSlides < $ensemble.totalSlides) {
                                    return 'paused';
                                }
                                return $ensemble.isPlaying ? 'playing' : 'paused';
                            },
                        };
                    },
                    'x-effect'() {
                        if (!this.$ensemble)
                            return;
                        if (this.$slideshow.totalSlides > this.$ensemble.totalSlides) {
                            this.$ensemble.totalSlides = this.$slideshow.totalSlides;
                        }
                    },
                });
                break;
            case 'disclosure-group':
                if (isNested) {
                    Alpine.bind($el, {
                        [`x-disclosure-group${modifiers.length ? `.${modifiers.join('.')}` : ''}`]: '',
                    });
                    break;
                }
                Alpine.bind($el, {
                    [`x-disclosure-group${modifiers.length ? `.${modifiers.join('.')}` : ''}`]() {
                        return {
                            get expandedIndex() {
                                // If there is no selectedIndex for some reason, show the first disclosure
                                if ($ensemble.selectedIndex === null)
                                    return 0;
                                // If the selectedIndex doesn't match any disclosures, show the last disclosure
                                const lastDisclosureIndex = Array.from(this.items).length - 1;
                                if ($ensemble.selectedIndex > lastDisclosureIndex)
                                    return lastDisclosureIndex;
                                return $ensemble.selectedIndex;
                            },
                            set expandedIndex(value) {
                                // Only allow opening new accordion items, not closing them
                                if (Number.isNaN(value) || value === null || value < 0)
                                    return;
                                $ensemble.selectedIndex = value;
                            },
                        };
                    },
                });
                break;
            case 'tabs':
                if (isNested) {
                    Alpine.bind($el, {
                        [`x-tabs${modifiers.length ? `.${modifiers.join('.')}` : ''}`]: '',
                    });
                    break;
                }
                Alpine.bind($el, {
                    [`x-tabs${modifiers.length ? `.${modifiers.join('.')}` : ''}`]() {
                        return {
                            get selectedIndex() {
                                // If there is no selectedIndex for some reason, show the first tab
                                if ($ensemble.selectedIndex === null)
                                    return 0;
                                // If the selectedIndex doesn't match any tabs, show the last tab
                                const lastTabIndex = Array.from(this.items).length - 1;
                                if ($ensemble.selectedIndex > lastTabIndex)
                                    return lastTabIndex;
                                return $ensemble.selectedIndex;
                            },
                            set selectedIndex(value) {
                                $ensemble.selectedIndex = value;
                            },
                        };
                    },
                });
                break;
            case 'carousel':
                if (isNested) {
                    Alpine.bind($el, {
                        [`x-carousel${modifiers.length ? `${modifiers.length ? `.${modifiers.join('.')}` : ''}` : ''}`]: '',
                    });
                    break;
                }
                Alpine.bind($el, {
                    [`x-carousel${modifiers.length ? `.${modifiers.join('.')}` : ''}`]: '',
                    ['x-init']() {
                        if (!this.$ensemble)
                            return;
                        this.$watch('$carousel.centeredIndex', (centeredIndex) => {
                            this.$ensemble.selectedIndex = centeredIndex;
                        });
                        this.$watch('$ensemble.selectedIndex', (selectedIndex) => {
                            const centeredIndex = this.$carousel.centeredIndex;
                            if (centeredIndex !== selectedIndex) {
                                this.$carousel.scrollTo(selectedIndex, { align: 'center' });
                            }
                        });
                    },
                });
                break;
            case 'hotspots':
                if (isNested) {
                    Alpine.bind($el, {
                        ['x-list-state']() {
                            return {
                                scope: 'hotspots',
                            };
                        },
                    });
                    break;
                }
                Alpine.bind($el, {
                    ['x-list-state']() {
                        return {
                            scope: 'hotspots',
                            get selectedIndex() {
                                if ($ensemble.selectedIndex === null) {
                                    return null;
                                }
                                return $ensemble.selectedIndex;
                            },
                            set selectedIndex(value) {
                                $ensemble.hasFocus = true;
                                if (Number.isNaN(value) || value === null || value < 0)
                                    return;
                                $ensemble.selectedIndex = value;
                            },
                        };
                    },
                });
                break;
            case null:
                const autoplay = modifiers.includes('autoplay');
                const sectionData = $data.$sectionData;
                Alpine.bind($el, {
                    ['x-data']() {
                        const $ensemble = {
                            titleEl: null,
                            // Store the current slide index in $sectionData so that we can restore it when the section is reloaded in the theme editor
                            get selectedIndex() {
                                var _a;
                                return (_a = sectionData === null || sectionData === void 0 ? void 0 : sectionData.selectedIndex) !== null && _a !== void 0 ? _a : 0;
                            },
                            set selectedIndex(value) {
                                sectionData.selectedIndex = value;
                            },
                            totalSlides: 0,
                            autoplay: autoplay,
                            hasFocus: false,
                            isInView: false,
                            get isPlaying() {
                                return this.autoplay && this.isInView && !this.hasFocus;
                            },
                            members: {},
                            registerMember(id, el) {
                                this.members[id] = el;
                            },
                            getPeerIds(id) {
                                return Object.keys(this.members).filter((memberId) => memberId !== id);
                            },
                        };
                        return {
                            $ensemble,
                        };
                    },
                    'x-intersect:enter.half': `$ensemble.isInView = true`,
                    'x-intersect:leave.half': `
            $ensemble.isInView = false
            $ensemble.hasFocus = false
          `,
                    '@focusin': '$ensemble.hasFocus = true',
                    '@pointerdown': '$ensemble.hasFocus = true',
                    ':aria-labelledby': '$ensemble.titleEl?.id || null',
                });
                if ((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode) {
                    Alpine.bind($el, {
                        'x-effect': `$ensemble.hasFocus = $isSelectedSection`,
                    });
                }
                break;
            default:
                throw new Error(`Invalid ensemble directive: ${value}`);
        }
    }).before('bind');
}
