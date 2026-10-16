export type PanSessionJSON = {
    lastPanX: number;
    lastPanY: number;
    panVelocityX: number;
    panVelocityY: number;
};
/**
 * Manages the state and transformation of pan session data.
 */
export declare class PanSession {
    private _startPanX;
    private _startPanY;
    private _lastPanX;
    private _lastPanY;
    private _panVelocityX;
    private _panVelocityY;
    private _updatedAt;
    /**
     * Creates an instance of PanSession.
     * @param {Object} options - Configuration options for the pan session.
     * @param {number} [options.panX=0] - Initial horizontal pan position.
     * @param {number} [options.panY=0] - Initial vertical pan position.
     */
    constructor(options?: {
        startPanX?: number;
        startPanY?: number;
        lastPanX?: number;
        lastPanY?: number;
        updatedAt?: number;
    });
    /**
     * Updates the pan session with new coordinates and calculates velocity.
     * @param {number} x - The new horizontal pan position.
     * @param {number} y - The new vertical pan position.
     * @param {number} [currentTime=Date.now()] - The current timestamp.
     */
    update(x: number, y: number, currentTime?: number): PanSession;
    /**
     * Serializes the current state of the pan session to a JSON object.
     * @returns {PanSessionJSON} The JSON representation of the pan session.
     */
    toJSON(): PanSessionJSON;
    /** The last recorded horizontal pan position. */
    get lastPanX(): number;
    /** The last recorded vertical pan position. */
    get lastPanY(): number;
    get startPanX(): number;
    get startPanY(): number;
    /** The current horizontal pan velocity (px/s). */
    get panVelocityX(): number;
    /** The current vertical pan velocity (px/s). */
    get panVelocityY(): number;
    /** The total horizontal distance moved from the start pan position. */
    get panDeltaX(): number;
    /** The total vertical distance moved from the start pan position. */
    get panDeltaY(): number;
}
