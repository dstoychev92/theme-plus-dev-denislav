export declare function isFormDataSubmitterSupported(): false | undefined;
export declare function isTouchEvent(e: PointerEvent): boolean;
export declare function isLeftMouseButton(e: PointerEvent): boolean;
/**
 * True for the primary pointer only (left mouse button, or primary touch point).
 * Filters out right-click and secondary touch points so only one press is active.
 * @see https://github.com/motiondivision/motion/blob/main/packages/motion-dom/src/gestures/utils/is-primary-pointer.ts
 */
export declare function isPrimaryPointer(e: PointerEvent): boolean;
/**
 * True if the element is natively focusable (keyboard accessible without adding tabindex).
 * Used by press gesture to decide whether to set tabIndex = 0.
 */
export declare function isElementKeyboardAccessible(el: Element): boolean;
/**
 * True if child is the same node as parent or a descendant of parent.
 */
export declare function isNodeOrChild(parent: Element | null, child: Element | null | undefined): boolean;
export declare function isPopoverApiSupported(): boolean;
export declare function isDialogApiSupported(): boolean;
export declare function isHoverSupported(): boolean;
/**
 * True when the device's main pointer cannot hover — a finger on a phone or tablet.
 *
 * Use it to skip setting up work that only means something with a mouse or trackpad,
 * such as an effect that follows the cursor. Check it once, as early as possible, so
 * a touch device pays nothing for the feature.
 *
 * This is the same test as the themes' `touch:` style variant and their
 * `$media.matches.touch` breakpoint, so the JavaScript and the CSS agree on what
 * counts as a touch device. `(pointer: coarse)` is checked alongside `(hover: none)`
 * because Chrome on Ubuntu reports `(hover: none)` even when a mouse is plugged in.
 *
 * @example
 * ```ts
 * Alpine.directive('cursor-position', ($el) => {
 *   if (isTouchOnlyDevice()) return;
 *   // ...set up the cursor-following effect
 * }).before('bind');
 * ```
 */
export declare function isTouchOnlyDevice(): boolean;
/**
 * Returns an array of section IDs that have or contain an element having the data-cart-api-section attribute.
 * This is used to gather up all the sections that need to be updated when the cart API is called.
 */
export declare function getCartApiSections(): string[];
export type FormDataSubmissionInfo = {
    action: string | null;
    method: string;
    formData: FormData | undefined;
    enctype: string | null;
};
export declare function getFormSubmissionInfo(target: HTMLElement, submitter?: HTMLElement | null): FormDataSubmissionInfo;
/**
 * Make a fetch request with the given form data submission info.
 */
export declare function submitFormData({ action, formData, method, enctype }: Partial<FormDataSubmissionInfo>, init?: RequestInit): Promise<Response>;
export declare function parseMultipart(body: string, contentType: string): any;
export declare function isModifiedEvent(event: MouseEvent): boolean;
export declare function shouldProcessLinkClick(event: MouseEvent, target?: string): boolean;
export declare function isClipboardWriteAllowed(): Promise<boolean>;
export declare function isHtmlElement(node: any): node is HTMLElement;
export declare function isImageElement(node: any): node is HTMLImageElement;
export declare function isVideoElement(node: any): node is HTMLVideoElement;
export declare function isSourceElement(node: any): node is HTMLSourceElement;
export declare function isScriptElement(node: any): node is HTMLScriptElement;
export declare function isAnchorElement(node: any): node is HTMLAnchorElement;
export declare function isFormElement(node: any): node is HTMLFormElement;
export declare function isDialogElement(node: any): node is HTMLDialogElement;
/**
 * Close every open `<dialog>` in the subtree, the element itself included.
 *
 * showModal() puts the dialog in the browser's top layer and makes the rest of the page
 * inert. WebKit keeps both when the element leaves the DOM without close() — the page
 * still scrolls, but every tap on it dies. Call this while the markup is still in the
 * document, before removing or replacing it.
 *
 * @example Close before a section morph removes the subtree
 * ```ts
 * removing(el) {
 *   closeOpenDialogs(el);
 * }
 * ```
 */
export declare function closeOpenDialogs(root: Element): void;
export declare function isInputElement(node: any): node is HTMLInputElement;
export declare function isInputRangeElement(node: any): node is HTMLInputElement;
export declare function isInputNumberElement(node: any): node is HTMLInputElement;
export declare function isButtonElement(node: any): node is HTMLButtonElement;
export declare function isSummaryElement(node: any): node is HTMLElement;
export declare function isTemplateElement(node: any): node is HTMLTemplateElement;
export declare function isProductForm(el: Node): boolean | undefined;
export declare function isInProductForm(el: Node): false | Element | null;
export declare function isHiddenInput(el: Node): el is HTMLInputElement;
export declare function isShopifyAppBlock(el: Node): el is HTMLElement;
export declare function isShopifyElement(el: Node): el is HTMLElement;
export type WritingDirection = 'ltr' | 'rtl';
export declare function getWritingDirection(el: HTMLElement): WritingDirection;
/**
 * Serializes a FormData object into a JSON object
 * @param formData - The form data to serialize
 * @returns
 */
export declare function serializeFormData(formData: FormData): Record<string, any>;
/**
 * Checks if a click event is occurring outside of a container element
 * @param event
 * @param container
 * @returns
 */
export declare function isClickingOutside(event: MouseEvent, container: HTMLElement): boolean;
/**
 * Checks if a point is within an element
 * @param x - The x coordinate of the point
 * @param y - The y coordinate of the point
 * @param element - The element to check
 * @returns True if the point is within the element, false otherwise
 */
export declare function isPointWithinElement(x: number, y: number, element: HTMLElement): boolean;
export declare function onDocumentReady(callback: () => void): void;
/**
 * Run `callback` when the browser is next idle.
 *
 * Always pass a `timeout`. Without one the browser is free to put the callback off for as long as
 * the main thread stays busy — on a genuinely loaded device that can mean it never runs at all, so
 * whatever the callback was deferring silently never happens. A timeout makes it run anyway once the
 * deadline passes. Our plugins use 2000ms unless there's a reason to be quicker.
 *
 * @param callback - Work to defer until the browser is idle.
 * @param options - Idle options, most importantly `timeout` in milliseconds.
 * @returns An id to pass to {@link cancelIdleCallback}.
 *
 * @example
 * const idleCallbackId = requestIdleCallback(() => setupExpensiveThing(), {timeout: 2000});
 * cleanup(() => cancelIdleCallback(idleCallbackId));
 */
export declare function requestIdleCallback(callback: (info: IdleDeadline) => void, options?: IdleRequestOptions): number;
/**
 * Runs `callback` once the page has scrolled — or right after the next paint, if by then
 * it already has.
 *
 * Some setup only starts mattering once the page is away from the top: tracking the
 * scroll position, working out where a sticky header sits. Doing it during page load is
 * wasted effort, because a page at the top already behaves the way "not scrolled" says it
 * should, and that setup usually means measuring the page, which is the most expensive
 * thing to ask for while the page is still settling.
 *
 * Waiting for the first scroll event is not enough on its own: a page opened at an anchor
 * link, or restored by the back button, can scroll before our scripts run at all, and that
 * event is long gone by the time a listener could be attached. So the position is also
 * checked once — but not here and now. This function is typically called in the middle of
 * page setup, when style changes are still pending, and asking for the scroll position
 * then forces the browser to recalculate the whole page's styles just to answer. The
 * check instead waits for the next paint (readLayoutAfterPaint), when the answer is free.
 *
 * @param callback - Setup to run at the first scroll, or shortly after the next paint if
 * the page is already scrolled by then.
 * @returns A function that cancels the wait, if the scroll has not happened yet.
 *
 * @example
 * const cancelWait = onFirstScroll(() => startTrackingScrollPosition());
 * cleanup(() => cancelWait());
 */
export declare function onFirstScroll(callback: VoidFunction): VoidFunction;
export declare function cancelIdleCallback(id: number): void;
