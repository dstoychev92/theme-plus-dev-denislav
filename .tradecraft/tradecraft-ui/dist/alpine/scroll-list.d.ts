import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
export type ScrollListRootComponent = AlpineComponent<{
    __scrollList_isRoot: boolean;
    __scrollList_rootElement: HTMLElement | null;
    __isScrolling: boolean;
    __viewportElement: HTMLElement | null;
    __scrollContainerElement: HTMLElement | null;
    __items: Set<HTMLElement>;
    __visibleItems: Set<HTMLElement> | null;
    __sortedVisibleIndices(): number[];
    __centeredIndex: number;
    __visibleItemsIntersectionObserver: IntersectionObserver | null;
    __centeredItemIntersectionObserver: IntersectionObserver | null;
    __registerItem(item: HTMLElement): void;
    __unregisterItem(item: HTMLElement): void;
    __indexOf(item: HTMLElement): number;
    __scrollToItem(index: number, options?: ScrollToOptions & {
        align?: 'start' | 'center' | 'end';
    }): void;
    __scrollToNextItem(): void;
    __scrollToPrevItem(): void;
    get __totalItems(): number;
    __onIntersect(entries: IntersectionObserverEntry[]): void;
    __onIntersectCenter(entries: IntersectionObserverEntry[]): void;
    __setupScrollListener(): void;
    __setupScrollEndListener(): void;
    __abortController: AbortController;
}>;
declare module 'alpinejs' {
    interface Magics<T> {
        $scrollList: ScrollListMagic;
    }
}
export type ScrollListMagic = {
    get isScrolling(): boolean | null;
    get items(): HTMLElement[] | null;
    get visibleIndices(): number[] | null;
    get centeredIndex(): number | null;
    scrollTo(index: number, options?: ScrollToOptions & {
        align?: 'start' | 'center' | 'end';
    }): void;
    next(): void;
    prev(): void;
};
/**
 * Registers the `x-scroll-list` directive and its sub-directives (`:viewport`,
 * `:scroller`, `:item`, `:next`, `:prev`) plus the `$scrollList` magic.
 *
 * The root directive accepts an optional {@link ScrollListOptions} expression
 * and the `.vertical` modifier for column-oriented lists.
 *
 * @example
 *   <!-- Horizontal list that starts at item index 2 on mount -->
 *   <div x-scroll-list="{initialItemIndex: 2}">
 *     <div x-scroll-list:scroller class="flex overflow-x-auto">
 *       <div x-scroll-list:item>Item 0</div>
 *       <div x-scroll-list:item>Item 1</div>
 *       <div x-scroll-list:item>Item 2</div>
 *     </div>
 *     <button x-scroll-list:prev>Prev</button>
 *     <button x-scroll-list:next>Next</button>
 *   </div>
 *
 * @example
 *   <!-- Vertical variant -->
 *   <div x-scroll-list.vertical="{initialItemIndex: 1}">
 *     <div x-scroll-list:scroller class="flex flex-col overflow-y-auto">...</div>
 *   </div>
 */
export default function (Alpine: AlpineType): void;
export declare function handleScrollListMagic(Alpine: AlpineType): ($el: HTMLElement) => ScrollListMagic;
