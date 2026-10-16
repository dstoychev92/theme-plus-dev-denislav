import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
export type HoldComponent = AlpineComponent<{
    __intervalId: number | undefined;
    __onPointerDown(e: PointerEvent): void;
    __onPointerUp(e: PointerEvent): void;
    __onPointerLeave(e: PointerEvent): void;
}>;
/**
 * Allow repeatedly triggering an action while the mouse is held down or while element is being touched
 *
 * e.g.
 *
 * <button x-hold.250ms="console.log('clicked')">Hold me down</button>
 */
export default function (Alpine: AlpineType): void;
