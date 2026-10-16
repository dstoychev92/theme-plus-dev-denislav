export declare class PanGestureRecognizer {
    isPanning: boolean;
    target: HTMLElement;
    private __panSession;
    private __initialPointerX;
    private __initialPointerY;
    constructor(targetElement: HTMLElement);
    destroy(): void;
    private _onPointerDown;
    private _onPointerMove;
    private _onPointerUp;
    private _onPointerCancel;
    private _onPointerLeave;
    private _onClick;
    private _onDragStart;
    private _update;
    private _dispatchPanStart;
    private _dispatchPanMove;
    private _dispatchPanEnd;
}
