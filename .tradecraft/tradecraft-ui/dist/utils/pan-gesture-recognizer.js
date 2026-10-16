import { isLeftMouseButton } from './dom';
import { PanSession } from './pan-session';
/**
 * Detect a "pan" gesture on an element, e.g. a user clicks / touches, moves their pointer/finger, then stops clicking / lifts finger up
 *
 * When a pan is detected a "panstart" event will be dispatched, followed by a "panmove" event for each move, and then a "panend" event when the pan is complete
 *
 * @example
 *
 * const pannableEl = document.querySelector('...')
 * new PanGestureRecognizer(pannableEl)
 *
 * pannableEl.addEventListener('panstart', () => {})
 * pannableEl.addEventListener('panmove', () => {})
 * pannableEl.addEventListener('panend', () => {})
 */
const PAN_THRESHOLD = 5; // pixels - minimum movement to start panning
export class PanGestureRecognizer {
    constructor(targetElement) {
        this.isPanning = false;
        this.__panSession = null;
        this.__initialPointerX = 0;
        this.__initialPointerY = 0;
        this._onPointerDown = (e) => {
            if (!isLeftMouseButton(e))
                return;
            // Store initial position to calculate movement distance
            this.__initialPointerX = e.pageX;
            this.__initialPointerY = e.pageY;
            this.target.addEventListener('pointermove', this._onPointerMove);
            this.target.addEventListener('pointerup', this._onPointerUp);
            this.target.addEventListener('pointercancel', this._onPointerCancel);
            this.target.addEventListener('pointerleave', this._onPointerLeave);
            this.target.addEventListener('click', this._onClick);
            this.target.addEventListener('dragstart', this._onDragStart);
        };
        this._onPointerMove = (e) => {
            // Calculate distance moved from initial pointer down position
            const deltaX = Math.abs(e.pageX - this.__initialPointerX);
            const deltaY = Math.abs(e.pageY - this.__initialPointerY);
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            if (!this.isPanning) {
                // Only start panning if movement exceeds threshold
                if (distance < PAN_THRESHOLD) {
                    return;
                }
                // Now we know it's a pan gesture - prevent default dragging behavior
                e.preventDefault();
                this.isPanning = true;
                this.__panSession = new PanSession({
                    startPanX: this.__initialPointerX,
                    startPanY: this.__initialPointerY,
                });
                this._dispatchPanStart(e);
                // Capture pointer events so we can continue panning even if the mouse is moved outside of the target element
                this.target.setPointerCapture(e.pointerId);
            }
            else {
                // Prevent default dragging behavior during pan
                e.preventDefault();
                this.__panSession = this.__panSession.update(e.pageX, e.pageY);
            }
            this._update(e);
        };
        this._onPointerUp = (e) => {
            this.target.removeEventListener('pointerup', this._onPointerUp);
            this.target.removeEventListener('pointermove', this._onPointerMove);
            this.target.removeEventListener('pointercancel', this._onPointerCancel);
            this.target.removeEventListener('pointerleave', this._onPointerLeave);
            this.target.removeEventListener('dragstart', this._onDragStart);
            if (this.isPanning) {
                e.stopPropagation();
                this.target.releasePointerCapture(e.pointerId);
                this._dispatchPanEnd(e);
                this._update.cancel();
            }
            // Wait for the event to be processed before resetting the pan state so that we can still cancel the click event
            setTimeout(() => {
                this.isPanning = false;
            });
        };
        this._onPointerCancel = (e) => {
            this._onPointerUp(e);
        };
        this._onPointerLeave = (e) => {
            this._onPointerUp(e);
        };
        this._onClick = (e) => {
            if (this.isPanning) {
                e.preventDefault();
                e.stopPropagation();
            }
        };
        // Dragging the pointer across a link or an image starts a native HTML drag,
        // and Chrome then fires pointercancel, which ends the pan mid-gesture. Only
        // bound while the pointer is down, so an ordinary drag still works.
        this._onDragStart = (e) => {
            e.preventDefault();
        };
        this._update = frameThrottle((e) => {
            this._dispatchPanMove(e);
        });
        this.target = targetElement;
        this.target.addEventListener('pointerdown', this._onPointerDown);
    }
    destroy() {
        this.target.removeEventListener('pointerdown', this._onPointerDown);
        this.target.removeEventListener('pointermove', this._onPointerMove);
        this.target.removeEventListener('pointerup', this._onPointerUp);
        this.target.removeEventListener('pointercancel', this._onPointerCancel);
        this.target.removeEventListener('pointerleave', this._onPointerLeave);
        this.target.removeEventListener('click', this._onClick);
        this.target.removeEventListener('dragstart', this._onDragStart);
        this._update.cancel();
    }
    _dispatchPanStart(e) {
        this.target.dispatchEvent(new CustomEvent('panstart', { detail: { originalEvent: e, panSession: this.__panSession }, bubbles: true }));
    }
    _dispatchPanMove(e) {
        this.target.dispatchEvent(new CustomEvent('panmove', { detail: { originalEvent: e, panSession: this.__panSession }, bubbles: true }));
    }
    _dispatchPanEnd(e) {
        this.target.dispatchEvent(new CustomEvent('panend', { detail: { originalEvent: e, panSession: this.__panSession }, bubbles: true }));
    }
}
function frameThrottle(fn) {
    let frameId = null;
    const callback = (...args) => {
        if (frameId)
            return;
        frameId = requestAnimationFrame(() => {
            fn(...args);
            frameId = null;
        });
    };
    callback.cancel = () => {
        if (frameId) {
            cancelAnimationFrame(frameId);
            frameId = null;
        }
    };
    return callback;
}
