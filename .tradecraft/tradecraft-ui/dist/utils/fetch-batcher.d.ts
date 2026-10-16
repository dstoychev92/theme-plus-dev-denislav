/**
 * Batches Section Rendering API requests that have the same page URL and query state.
 */
export default class FetchBatcher {
    private timeoutDuration;
    private batches;
    constructor(timeoutDuration?: number);
    request(url: string, options?: {
        signal?: AbortSignal;
    }): Promise<Record<string, string>>;
    private parseRequestUrl;
    private removeWaiter;
    private buildBatchUrl;
    private settleWaiter;
    private fetchBatch;
}
