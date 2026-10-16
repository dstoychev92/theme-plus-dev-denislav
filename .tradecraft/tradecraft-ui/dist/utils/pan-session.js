/**
 * Manages the state and transformation of pan session data.
 */
export class PanSession {
    /**
     * Creates an instance of PanSession.
     * @param {Object} options - Configuration options for the pan session.
     * @param {number} [options.panX=0] - Initial horizontal pan position.
     * @param {number} [options.panY=0] - Initial vertical pan position.
     */
    constructor(options) {
        this._startPanX = 0;
        this._startPanY = 0;
        this._lastPanX = 0;
        this._lastPanY = 0;
        this._panVelocityX = 0; // px/s
        this._panVelocityY = 0; // px/s
        this._updatedAt = 0;
        this._startPanX = (options === null || options === void 0 ? void 0 : options.startPanX) || 0;
        this._startPanY = (options === null || options === void 0 ? void 0 : options.startPanY) || 0;
        this._lastPanX = (options === null || options === void 0 ? void 0 : options.lastPanX) || (options === null || options === void 0 ? void 0 : options.startPanX) || 0;
        this._lastPanY = (options === null || options === void 0 ? void 0 : options.lastPanY) || (options === null || options === void 0 ? void 0 : options.lastPanY) || 0;
        this._updatedAt = (options === null || options === void 0 ? void 0 : options.updatedAt) || Date.now();
    }
    /**
     * Updates the pan session with new coordinates and calculates velocity.
     * @param {number} x - The new horizontal pan position.
     * @param {number} y - The new vertical pan position.
     * @param {number} [currentTime=Date.now()] - The current timestamp.
     */
    update(x, y, currentTime = Date.now()) {
        const lastUpdatedAt = this._updatedAt;
        const panDeltaX = x - this._lastPanX;
        const panDeltaY = y - this._lastPanY;
        const deltaTInS = (currentTime - lastUpdatedAt) / 1000;
        const newPanSession = new PanSession({
            startPanX: this._startPanX,
            startPanY: this._startPanY,
            lastPanX: x,
            lastPanY: y,
            updatedAt: currentTime,
        });
        if (deltaTInS > 0.0) {
            newPanSession._panVelocityX = Math.round(panDeltaX / deltaTInS);
            newPanSession._panVelocityY = Math.round(panDeltaY / deltaTInS);
        }
        return newPanSession;
    }
    /**
     * Serializes the current state of the pan session to a JSON object.
     * @returns {PanSessionJSON} The JSON representation of the pan session.
     */
    toJSON() {
        return {
            lastPanX: this.lastPanX,
            lastPanY: this.lastPanY,
            panVelocityX: this.panVelocityX,
            panVelocityY: this.panVelocityY,
        };
    }
    /** The last recorded horizontal pan position. */
    get lastPanX() {
        return this._lastPanX;
    }
    /** The last recorded vertical pan position. */
    get lastPanY() {
        return this._lastPanY;
    }
    get startPanX() {
        return this._startPanX;
    }
    get startPanY() {
        return this._startPanY;
    }
    /** The current horizontal pan velocity (px/s). */
    get panVelocityX() {
        return this._panVelocityX;
    }
    /** The current vertical pan velocity (px/s). */
    get panVelocityY() {
        return this._panVelocityY;
    }
    /** The total horizontal distance moved from the start pan position. */
    get panDeltaX() {
        return this._lastPanX - this._startPanX;
    }
    /** The total vertical distance moved from the start pan position. */
    get panDeltaY() {
        return this._lastPanY - this._startPanY;
    }
}
