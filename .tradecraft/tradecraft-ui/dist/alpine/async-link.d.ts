import { AlpineComponent, Alpine as AlpineType } from 'alpinejs';
import { StateMachine } from '../utils/state-machine';
import { ArrayToUnion } from '../types/utils';
export type AsyncLinkRequestState = ['idle', 'pending'];
export type AsyncLinkStateMachine = StateMachine<AsyncLinkRequestState>;
export type AsyncLinkSubmitCallback = (href: string) => Promise<Response | any>;
export type AsyncLinkComponent = AlpineComponent<{
    /**
     * The state machine for the component
     */
    __asyncLink_stateMachine: AsyncLinkStateMachine;
    /**
     * The current state of the component
     */
    __asyncLink_state: ArrayToUnion<AsyncLinkRequestState>;
    /**
     * The current state of the component
     */
    __asyncLink_prevState: ArrayToUnion<AsyncLinkRequestState> | null;
    /**
     * The href of the last clicked link
     */
    __asyncLink_pendingHref: string | null;
    /**
     * Error message from previous submission attempt. This maps to body.message when a 422 response occurs
     */
    __asyncLink_errorMessage: string | null;
    /**
     * Error description from previous submission attempt. This maps to body.description when a 422 response occurs
     */
    __asyncLink_errorDescription: any;
    __asyncLink_callback: AsyncLinkSubmitCallback | null;
    __asyncLink_load(href: string): Promise<Response | false>;
    __asyncLink_handleSuccess(): void;
    __asyncLink_handleError(message: string, description?: string | undefined): void;
    __asyncLink_reset(): void;
}>;
/**
 * A plugin that makes it easy to progressively enhance links so that they can be
 * call endpoints via the fetch API and display pending states
 * while the request is in progress
 *
 * The x-async-link expects a either a promise or a function that returns a promise.
 *
 * @example
 *
 * <a
 *   href="/some-page"
 *   x-async-link="fetchSomeData"
 *   :class="{ 'opacity-50': $asyncLink.state == 'pending' }"
 * >Click Me</a>
 *
 * @example
 *
 * <div x-async-link:context="fetch(`${$url}.js`)">
 *   <div x-show="$asyncLink.state == 'pending'">Loading!</div>
 *   <a href="/some-page" x-async-link:link >Click Me</a>
 * </div>
 *
 * Dispatches `link:pending` when a request starts and `link:loaded` when it succeeds,
 * each with the pending href as the event detail. Dispatches `link:error` with the
 * href, message, and description when a request fails. Dispatches `link:aborted`
 * with the pending href when a request is aborted.
 */
export default function (Alpine: AlpineType): void;
