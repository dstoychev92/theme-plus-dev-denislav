/**
 * The standard storefront events reserve `detail` for theme-specific data.
 * This augments the (empty) detail interfaces from `@shopify/events` with the
 * data the tradecraft-ui directives put there, so every theme in the repository
 * shares one contract.
 */
declare module '@shopify/events' {
    interface CartLinesUpdateResultDetail {
        /** Section-rendering HTML keyed by section id, from the request's `sections` parameter. */
        sections?: Record<string, string>;
        /** True when the request failed. The promise still resolves so listeners settle. */
        didError?: boolean;
        /** True when the theme cancelled this request because a newer one replaced it. */
        aborted?: boolean;
        /** Which directive dispatched: 'product-form' | 'cart-item' | 'cart-form'. */
        source?: string;
        /** DOM id of the dispatching form, so a component can skip its own events. */
        sourceId?: string;
        /** Quantity involved in this update. */
        itemCount?: number;
        /** Items of the full ajax cart after the update. */
        items?: CartAjaxResponse['items'];
        /** The added line item as returned by /cart/add.js (add action only). Carries `url`. */
        item?: Record<string, unknown>;
    }
    interface CartErrorPayloadDetail {
        description?: unknown;
        errors?: unknown;
    }
    interface CartNoteUpdateResultDetail {
        /** Section-rendering HTML keyed by section id, from the request's `sections` parameter. */
        sections?: Record<string, string>;
        didError?: boolean;
        source?: string;
        sourceId?: string;
    }
}
export {};
