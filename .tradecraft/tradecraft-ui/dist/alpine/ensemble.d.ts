import { AlpineComponent, Alpine as AlpineType } from 'alpinejs';
export type EnsembleData = {
    titleEl: HTMLElement | null;
    selectedIndex: number;
    totalSlides: number;
    get isPlaying(): boolean;
    hasFocus: boolean;
    isInView: boolean;
    autoplay: boolean;
    members: Record<string, HTMLElement>;
    registerMember(id: string, el: HTMLElement): void;
    getPeerIds(id: string): string[];
};
export type EnsembleComponent = AlpineComponent<{
    $ensemble: EnsembleData;
}>;
declare module 'alpinejs' {
    interface Magics<T> {
        $ensemble: EnsembleData;
    }
}
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
export default function ensemble(Alpine: AlpineType): void;
