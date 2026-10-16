//#region \0rollup-plugin-inject-process-env
(function() {
	const env = {};
	try {
		if (process) {
			process.env = Object.assign({}, process.env);
			Object.assign(process.env, env);
			return;
		}
	} catch (e) {}
	globalThis.process = { env };
})();

//#endregion
//#region ../../node_modules/photoswipe/dist/photoswipe.esm.js
/*!
* PhotoSwipe 5.4.4 - https://photoswipe.com
* (c) 2024 Dmytro Semenov
*/
/** @typedef {import('../photoswipe.js').Point} Point */
/**
* @template {keyof HTMLElementTagNameMap} T
* @param {string} className
* @param {T} tagName
* @param {Node} [appendToEl]
* @returns {HTMLElementTagNameMap[T]}
*/
function createElement(className, tagName, appendToEl) {
	const el = document.createElement(tagName);
	if (className) el.className = className;
	if (appendToEl) appendToEl.appendChild(el);
	return el;
}
/**
* @param {Point} p1
* @param {Point} p2
* @returns {Point}
*/
function equalizePoints(p1, p2) {
	p1.x = p2.x;
	p1.y = p2.y;
	if (p2.id !== void 0) p1.id = p2.id;
	return p1;
}
/**
* @param {Point} p
*/
function roundPoint(p) {
	p.x = Math.round(p.x);
	p.y = Math.round(p.y);
}
/**
* Returns distance between two points.
*
* @param {Point} p1
* @param {Point} p2
* @returns {number}
*/
function getDistanceBetween(p1, p2) {
	const x = Math.abs(p1.x - p2.x);
	const y = Math.abs(p1.y - p2.y);
	return Math.sqrt(x * x + y * y);
}
/**
* Whether X and Y positions of points are equal
*
* @param {Point} p1
* @param {Point} p2
* @returns {boolean}
*/
function pointsEqual(p1, p2) {
	return p1.x === p2.x && p1.y === p2.y;
}
/**
* The float result between the min and max values.
*
* @param {number} val
* @param {number} min
* @param {number} max
* @returns {number}
*/
function clamp(val, min, max) {
	return Math.min(Math.max(val, min), max);
}
/**
* Get transform string
*
* @param {number} x
* @param {number} [y]
* @param {number} [scale]
* @returns {string}
*/
function toTransformString(x, y, scale) {
	let propValue = `translate3d(${x}px,${y || 0}px,0)`;
	if (scale !== void 0) propValue += ` scale3d(${scale},${scale},1)`;
	return propValue;
}
/**
* Apply transform:translate(x, y) scale(scale) to element
*
* @param {HTMLElement} el
* @param {number} x
* @param {number} [y]
* @param {number} [scale]
*/
function setTransform(el, x, y, scale) {
	el.style.transform = toTransformString(x, y, scale);
}
const defaultCSSEasing = "cubic-bezier(.4,0,.22,1)";
/**
* Apply CSS transition to element
*
* @param {HTMLElement} el
* @param {string} [prop] CSS property to animate
* @param {number} [duration] in ms
* @param {string} [ease] CSS easing function
*/
function setTransitionStyle(el, prop, duration, ease) {
	el.style.transition = prop ? `${prop} ${duration}ms ${ease || defaultCSSEasing}` : "none";
}
/**
* Apply width and height CSS properties to element
*
* @param {HTMLElement} el
* @param {string | number} w
* @param {string | number} h
*/
function setWidthHeight(el, w, h) {
	el.style.width = typeof w === "number" ? `${w}px` : w;
	el.style.height = typeof h === "number" ? `${h}px` : h;
}
/**
* @param {HTMLElement} el
*/
function removeTransitionStyle(el) {
	setTransitionStyle(el);
}
/**
* @param {HTMLImageElement} img
* @returns {Promise<HTMLImageElement | void>}
*/
function decodeImage(img) {
	if ("decode" in img) return img.decode().catch(() => {});
	if (img.complete) return Promise.resolve(img);
	return new Promise((resolve, reject) => {
		img.onload = () => resolve(img);
		img.onerror = reject;
	});
}
/** @typedef {LOAD_STATE[keyof LOAD_STATE]} LoadState */
/** @type {{ IDLE: 'idle'; LOADING: 'loading'; LOADED: 'loaded'; ERROR: 'error' }} */
const LOAD_STATE = {
	IDLE: "idle",
	LOADING: "loading",
	LOADED: "loaded",
	ERROR: "error"
};
/**
* Check if click or keydown event was dispatched
* with a special key or via mouse wheel.
*
* @param {MouseEvent | KeyboardEvent} e
* @returns {boolean}
*/
function specialKeyUsed(e) {
	return "button" in e && e.button === 1 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;
}
/**
* Parse `gallery` or `children` options.
*
* @param {import('../photoswipe.js').ElementProvider} [option]
* @param {string} [legacySelector]
* @param {HTMLElement | Document} [parent]
* @returns HTMLElement[]
*/
function getElementsFromOption(option, legacySelector, parent = document) {
	/** @type {HTMLElement[]} */
	let elements = [];
	if (option instanceof Element) elements = [option];
	else if (option instanceof NodeList || Array.isArray(option)) elements = Array.from(option);
	else {
		const selector = typeof option === "string" ? option : legacySelector;
		if (selector) elements = Array.from(parent.querySelectorAll(selector));
	}
	return elements;
}
/**
* Check if browser is Safari
*
* @returns {boolean}
*/
function isSafari() {
	return !!(navigator.vendor && navigator.vendor.match(/apple/i));
}
let supportsPassive = false;
try {
	window.addEventListener("test", null, Object.defineProperty({}, "passive", { get: () => {
		supportsPassive = true;
	} }));
} catch (e) {}
/**
* @typedef {Object} PoolItem
* @prop {HTMLElement | Window | Document | undefined | null} target
* @prop {string} type
* @prop {EventListenerOrEventListenerObject} listener
* @prop {boolean} [passive]
*/
var DOMEvents = class {
	constructor() {
		/**
		* @type {PoolItem[]}
		* @private
		*/
		this._pool = [];
	}
	/**
	* Adds event listeners
	*
	* @param {PoolItem['target']} target
	* @param {PoolItem['type']} type Can be multiple, separated by space.
	* @param {PoolItem['listener']} listener
	* @param {PoolItem['passive']} [passive]
	*/
	add(target, type, listener, passive) {
		this._toggleListener(target, type, listener, passive);
	}
	/**
	* Removes event listeners
	*
	* @param {PoolItem['target']} target
	* @param {PoolItem['type']} type
	* @param {PoolItem['listener']} listener
	* @param {PoolItem['passive']} [passive]
	*/
	remove(target, type, listener, passive) {
		this._toggleListener(target, type, listener, passive, true);
	}
	/**
	* Removes all bound events
	*/
	removeAll() {
		this._pool.forEach((poolItem) => {
			this._toggleListener(poolItem.target, poolItem.type, poolItem.listener, poolItem.passive, true, true);
		});
		this._pool = [];
	}
	/**
	* Adds or removes event
	*
	* @private
	* @param {PoolItem['target']} target
	* @param {PoolItem['type']} type
	* @param {PoolItem['listener']} listener
	* @param {PoolItem['passive']} [passive]
	* @param {boolean} [unbind] Whether the event should be added or removed
	* @param {boolean} [skipPool] Whether events pool should be skipped
	*/
	_toggleListener(target, type, listener, passive, unbind, skipPool) {
		if (!target) return;
		const methodName = unbind ? "removeEventListener" : "addEventListener";
		type.split(" ").forEach((eType) => {
			if (eType) {
				if (!skipPool) {
					if (unbind) this._pool = this._pool.filter((poolItem) => {
						return poolItem.type !== eType || poolItem.listener !== listener || poolItem.target !== target;
					});
					else this._pool.push({
						target,
						type: eType,
						listener,
						passive
					});
				}
				const eventOptions = supportsPassive ? { passive: passive || false } : false;
				target[methodName](eType, listener, eventOptions);
			}
		});
	}
};
/** @typedef {import('../photoswipe.js').PhotoSwipeOptions} PhotoSwipeOptions */
/** @typedef {import('../core/base.js').default} PhotoSwipeBase */
/** @typedef {import('../photoswipe.js').Point} Point */
/** @typedef {import('../slide/slide.js').SlideData} SlideData */
/**
* @param {PhotoSwipeOptions} options
* @param {PhotoSwipeBase} pswp
* @returns {Point}
*/
function getViewportSize(options, pswp) {
	if (options.getViewportSizeFn) {
		const newViewportSize = options.getViewportSizeFn(options, pswp);
		if (newViewportSize) return newViewportSize;
	}
	return {
		x: document.documentElement.clientWidth,
		y: window.innerHeight
	};
}
/**
* Parses padding option.
* Supported formats:
*
* // Object
* padding: {
*  top: 0,
*  bottom: 0,
*  left: 0,
*  right: 0
* }
*
* // A function that returns the object
* paddingFn: (viewportSize, itemData, index) => {
*  return {
*    top: 0,
*    bottom: 0,
*    left: 0,
*    right: 0
*  };
* }
*
* // Legacy variant
* paddingLeft: 0,
* paddingRight: 0,
* paddingTop: 0,
* paddingBottom: 0,
*
* @param {'left' | 'top' | 'bottom' | 'right'} prop
* @param {PhotoSwipeOptions} options PhotoSwipe options
* @param {Point} viewportSize PhotoSwipe viewport size, for example: { x:800, y:600 }
* @param {SlideData} itemData Data about the slide
* @param {number} index Slide index
* @returns {number}
*/
function parsePaddingOption(prop, options, viewportSize, itemData, index) {
	let paddingValue = 0;
	if (options.paddingFn) paddingValue = options.paddingFn(viewportSize, itemData, index)[prop];
	else if (options.padding) paddingValue = options.padding[prop];
	else {
		const legacyPropName = "padding" + prop[0].toUpperCase() + prop.slice(1);
		if (options[legacyPropName]) paddingValue = options[legacyPropName];
	}
	return Number(paddingValue) || 0;
}
/**
* @param {PhotoSwipeOptions} options
* @param {Point} viewportSize
* @param {SlideData} itemData
* @param {number} index
* @returns {Point}
*/
function getPanAreaSize(options, viewportSize, itemData, index) {
	return {
		x: viewportSize.x - parsePaddingOption("left", options, viewportSize, itemData, index) - parsePaddingOption("right", options, viewportSize, itemData, index),
		y: viewportSize.y - parsePaddingOption("top", options, viewportSize, itemData, index) - parsePaddingOption("bottom", options, viewportSize, itemData, index)
	};
}
/** @typedef {import('./slide.js').default} Slide */
/** @typedef {Record<Axis, number>} Point */
/** @typedef {'x' | 'y'} Axis */
/**
* Calculates minimum, maximum and initial (center) bounds of a slide
*/
var PanBounds = class {
	/**
	* @param {Slide} slide
	*/
	constructor(slide) {
		this.slide = slide;
		this.currZoomLevel = 1;
		this.center = (
		/** @type {Point} */
		{
			x: 0,
			y: 0
		});
		this.max = (
		/** @type {Point} */
		{
			x: 0,
			y: 0
		});
		this.min = (
		/** @type {Point} */
		{
			x: 0,
			y: 0
		});
	}
	/**
	* _getItemBounds
	*
	* @param {number} currZoomLevel
	*/
	update(currZoomLevel) {
		this.currZoomLevel = currZoomLevel;
		if (!this.slide.width) this.reset();
		else {
			this._updateAxis("x");
			this._updateAxis("y");
			this.slide.pswp.dispatch("calcBounds", { slide: this.slide });
		}
	}
	/**
	* _calculateItemBoundsForAxis
	*
	* @param {Axis} axis
	*/
	_updateAxis(axis) {
		const { pswp } = this.slide;
		const elSize = this.slide[axis === "x" ? "width" : "height"] * this.currZoomLevel;
		const padding = parsePaddingOption(axis === "x" ? "left" : "top", pswp.options, pswp.viewportSize, this.slide.data, this.slide.index);
		const panAreaSize = this.slide.panAreaSize[axis];
		this.center[axis] = Math.round((panAreaSize - elSize) / 2) + padding;
		this.max[axis] = elSize > panAreaSize ? Math.round(panAreaSize - elSize) + padding : this.center[axis];
		this.min[axis] = elSize > panAreaSize ? padding : this.center[axis];
	}
	reset() {
		this.center.x = 0;
		this.center.y = 0;
		this.max.x = 0;
		this.max.y = 0;
		this.min.x = 0;
		this.min.y = 0;
	}
	/**
	* Correct pan position if it's beyond the bounds
	*
	* @param {Axis} axis x or y
	* @param {number} panOffset
	* @returns {number}
	*/
	correctPan(axis, panOffset) {
		return clamp(panOffset, this.max[axis], this.min[axis]);
	}
};
const MAX_IMAGE_WIDTH = 4e3;
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/** @typedef {import('../photoswipe.js').PhotoSwipeOptions} PhotoSwipeOptions */
/** @typedef {import('../photoswipe.js').Point} Point */
/** @typedef {import('../slide/slide.js').SlideData} SlideData */
/** @typedef {'fit' | 'fill' | number | ((zoomLevelObject: ZoomLevel) => number)} ZoomLevelOption */
/**
* Calculates zoom levels for specific slide.
* Depends on viewport size and image size.
*/
var ZoomLevel = class {
	/**
	* @param {PhotoSwipeOptions} options PhotoSwipe options
	* @param {SlideData} itemData Slide data
	* @param {number} index Slide index
	* @param {PhotoSwipe} [pswp] PhotoSwipe instance, can be undefined if not initialized yet
	*/
	constructor(options, itemData, index, pswp) {
		this.pswp = pswp;
		this.options = options;
		this.itemData = itemData;
		this.index = index;
		/** @type { Point | null } */
		this.panAreaSize = null;
		/** @type { Point | null } */
		this.elementSize = null;
		this.fit = 1;
		this.fill = 1;
		this.vFill = 1;
		this.initial = 1;
		this.secondary = 1;
		this.max = 1;
		this.min = 1;
	}
	/**
	* Calculate initial, secondary and maximum zoom level for the specified slide.
	*
	* It should be called when either image or viewport size changes.
	*
	* @param {number} maxWidth
	* @param {number} maxHeight
	* @param {Point} panAreaSize
	*/
	update(maxWidth, maxHeight, panAreaSize) {
		/** @type {Point} */
		const elementSize = {
			x: maxWidth,
			y: maxHeight
		};
		this.elementSize = elementSize;
		this.panAreaSize = panAreaSize;
		const hRatio = panAreaSize.x / elementSize.x;
		const vRatio = panAreaSize.y / elementSize.y;
		this.fit = Math.min(1, hRatio < vRatio ? hRatio : vRatio);
		this.fill = Math.min(1, hRatio > vRatio ? hRatio : vRatio);
		this.vFill = Math.min(1, vRatio);
		this.initial = this._getInitial();
		this.secondary = this._getSecondary();
		this.max = Math.max(this.initial, this.secondary, this._getMax());
		this.min = Math.min(this.fit, this.initial, this.secondary);
		if (this.pswp) this.pswp.dispatch("zoomLevelsUpdate", {
			zoomLevels: this,
			slideData: this.itemData
		});
	}
	/**
	* Parses user-defined zoom option.
	*
	* @private
	* @param {'initial' | 'secondary' | 'max'} optionPrefix Zoom level option prefix (initial, secondary, max)
	* @returns { number | undefined }
	*/
	_parseZoomLevelOption(optionPrefix) {
		const optionName = optionPrefix + "ZoomLevel";
		const optionValue = this.options[optionName];
		if (!optionValue) return;
		if (typeof optionValue === "function") return optionValue(this);
		if (optionValue === "fill") return this.fill;
		if (optionValue === "fit") return this.fit;
		return Number(optionValue);
	}
	/**
	* Get zoom level to which image will be zoomed after double-tap gesture,
	* or when user clicks on zoom icon,
	* or mouse-click on image itself.
	* If you return 1 image will be zoomed to its original size.
	*
	* @private
	* @return {number}
	*/
	_getSecondary() {
		let currZoomLevel = this._parseZoomLevelOption("secondary");
		if (currZoomLevel) return currZoomLevel;
		currZoomLevel = Math.min(1, this.fit * 3);
		if (this.elementSize && currZoomLevel * this.elementSize.x > MAX_IMAGE_WIDTH) currZoomLevel = MAX_IMAGE_WIDTH / this.elementSize.x;
		return currZoomLevel;
	}
	/**
	* Get initial image zoom level.
	*
	* @private
	* @return {number}
	*/
	_getInitial() {
		return this._parseZoomLevelOption("initial") || this.fit;
	}
	/**
	* Maximum zoom level when user zooms
	* via zoom/pinch gesture,
	* via cmd/ctrl-wheel or via trackpad.
	*
	* @private
	* @return {number}
	*/
	_getMax() {
		return this._parseZoomLevelOption("max") || Math.max(1, this.fit * 4);
	}
};
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/**
* Renders and allows to control a single slide
*/
var Slide = class {
	/**
	* @param {SlideData} data
	* @param {number} index
	* @param {PhotoSwipe} pswp
	*/
	constructor(data, index, pswp) {
		this.data = data;
		this.index = index;
		this.pswp = pswp;
		this.isActive = index === pswp.currIndex;
		this.currentResolution = 0;
		/** @type {Point} */
		this.panAreaSize = {
			x: 0,
			y: 0
		};
		/** @type {Point} */
		this.pan = {
			x: 0,
			y: 0
		};
		this.isFirstSlide = this.isActive && !pswp.opener.isOpen;
		this.zoomLevels = new ZoomLevel(pswp.options, data, index, pswp);
		this.pswp.dispatch("gettingData", {
			slide: this,
			data: this.data,
			index
		});
		this.content = this.pswp.contentLoader.getContentBySlide(this);
		this.container = createElement("pswp__zoom-wrap", "div");
		/** @type {HTMLElement | null} */
		this.holderElement = null;
		this.currZoomLevel = 1;
		/** @type {number} */
		this.width = this.content.width;
		/** @type {number} */
		this.height = this.content.height;
		this.heavyAppended = false;
		this.bounds = new PanBounds(this);
		this.prevDisplayedWidth = -1;
		this.prevDisplayedHeight = -1;
		this.pswp.dispatch("slideInit", { slide: this });
	}
	/**
	* If this slide is active/current/visible
	*
	* @param {boolean} isActive
	*/
	setIsActive(isActive) {
		if (isActive && !this.isActive) this.activate();
		else if (!isActive && this.isActive) this.deactivate();
	}
	/**
	* Appends slide content to DOM
	*
	* @param {HTMLElement} holderElement
	*/
	append(holderElement) {
		this.holderElement = holderElement;
		this.container.style.transformOrigin = "0 0";
		if (!this.data) return;
		this.calculateSize();
		this.load();
		this.updateContentSize();
		this.appendHeavy();
		this.holderElement.appendChild(this.container);
		this.zoomAndPanToInitial();
		this.pswp.dispatch("firstZoomPan", { slide: this });
		this.applyCurrentZoomPan();
		this.pswp.dispatch("afterSetContent", { slide: this });
		if (this.isActive) this.activate();
	}
	load() {
		this.content.load(false);
		this.pswp.dispatch("slideLoad", { slide: this });
	}
	/**
	* Append "heavy" DOM elements
	*
	* This may depend on a type of slide,
	* but generally these are large images.
	*/
	appendHeavy() {
		const { pswp } = this;
		if (this.heavyAppended || !pswp.opener.isOpen || pswp.mainScroll.isShifted() || !this.isActive && false) return;
		if (this.pswp.dispatch("appendHeavy", { slide: this }).defaultPrevented) return;
		this.heavyAppended = true;
		this.content.append();
		this.pswp.dispatch("appendHeavyContent", { slide: this });
	}
	/**
	* Triggered when this slide is active (selected).
	*
	* If it's part of opening/closing transition -
	* activate() will trigger after the transition is ended.
	*/
	activate() {
		this.isActive = true;
		this.appendHeavy();
		this.content.activate();
		this.pswp.dispatch("slideActivate", { slide: this });
	}
	/**
	* Triggered when this slide becomes inactive.
	*
	* Slide can become inactive only after it was active.
	*/
	deactivate() {
		this.isActive = false;
		this.content.deactivate();
		if (this.currZoomLevel !== this.zoomLevels.initial) this.calculateSize();
		this.currentResolution = 0;
		this.zoomAndPanToInitial();
		this.applyCurrentZoomPan();
		this.updateContentSize();
		this.pswp.dispatch("slideDeactivate", { slide: this });
	}
	/**
	* The slide should destroy itself, it will never be used again.
	* (unbind all events and destroy internal components)
	*/
	destroy() {
		this.content.hasSlide = false;
		this.content.remove();
		this.container.remove();
		this.pswp.dispatch("slideDestroy", { slide: this });
	}
	resize() {
		if (this.currZoomLevel === this.zoomLevels.initial || !this.isActive) {
			this.calculateSize();
			this.currentResolution = 0;
			this.zoomAndPanToInitial();
			this.applyCurrentZoomPan();
			this.updateContentSize();
		} else {
			this.calculateSize();
			this.bounds.update(this.currZoomLevel);
			this.panTo(this.pan.x, this.pan.y);
		}
	}
	/**
	* Apply size to current slide content,
	* based on the current resolution and scale.
	*
	* @param {boolean} [force] if size should be updated even if dimensions weren't changed
	*/
	updateContentSize(force) {
		const scaleMultiplier = this.currentResolution || this.zoomLevels.initial;
		if (!scaleMultiplier) return;
		const width = Math.round(this.width * scaleMultiplier) || this.pswp.viewportSize.x;
		const height = Math.round(this.height * scaleMultiplier) || this.pswp.viewportSize.y;
		if (!this.sizeChanged(width, height) && !force) return;
		this.content.setDisplayedSize(width, height);
	}
	/**
	* @param {number} width
	* @param {number} height
	*/
	sizeChanged(width, height) {
		if (width !== this.prevDisplayedWidth || height !== this.prevDisplayedHeight) {
			this.prevDisplayedWidth = width;
			this.prevDisplayedHeight = height;
			return true;
		}
		return false;
	}
	/** @returns {HTMLImageElement | HTMLDivElement | null | undefined} */
	getPlaceholderElement() {
		var _this$content$placeho;
		return (_this$content$placeho = this.content.placeholder) === null || _this$content$placeho === void 0 ? void 0 : _this$content$placeho.element;
	}
	/**
	* Zoom current slide image to...
	*
	* @param {number} destZoomLevel Destination zoom level.
	* @param {Point} [centerPoint]
	* Transform origin center point, or false if viewport center should be used.
	* @param {number | false} [transitionDuration] Transition duration, may be set to 0.
	* @param {boolean} [ignoreBounds] Minimum and maximum zoom levels will be ignored.
	*/
	zoomTo(destZoomLevel, centerPoint, transitionDuration, ignoreBounds) {
		const { pswp } = this;
		if (!this.isZoomable() || pswp.mainScroll.isShifted()) return;
		pswp.dispatch("beforeZoomTo", {
			destZoomLevel,
			centerPoint,
			transitionDuration
		});
		pswp.animations.stopAllPan();
		const prevZoomLevel = this.currZoomLevel;
		if (!ignoreBounds) destZoomLevel = clamp(destZoomLevel, this.zoomLevels.min, this.zoomLevels.max);
		this.setZoomLevel(destZoomLevel);
		this.pan.x = this.calculateZoomToPanOffset("x", centerPoint, prevZoomLevel);
		this.pan.y = this.calculateZoomToPanOffset("y", centerPoint, prevZoomLevel);
		roundPoint(this.pan);
		const finishTransition = () => {
			this._setResolution(destZoomLevel);
			this.applyCurrentZoomPan();
		};
		if (!transitionDuration) finishTransition();
		else pswp.animations.startTransition({
			isPan: true,
			name: "zoomTo",
			target: this.container,
			transform: this.getCurrentTransform(),
			onComplete: finishTransition,
			duration: transitionDuration,
			easing: pswp.options.easing
		});
	}
	/**
	* @param {Point} [centerPoint]
	*/
	toggleZoom(centerPoint) {
		this.zoomTo(this.currZoomLevel === this.zoomLevels.initial ? this.zoomLevels.secondary : this.zoomLevels.initial, centerPoint, this.pswp.options.zoomAnimationDuration);
	}
	/**
	* Updates zoom level property and recalculates new pan bounds,
	* unlike zoomTo it does not apply transform (use applyCurrentZoomPan)
	*
	* @param {number} currZoomLevel
	*/
	setZoomLevel(currZoomLevel) {
		this.currZoomLevel = currZoomLevel;
		this.bounds.update(this.currZoomLevel);
	}
	/**
	* Get pan position after zoom at a given `point`.
	*
	* Always call setZoomLevel(newZoomLevel) beforehand to recalculate
	* pan bounds according to the new zoom level.
	*
	* @param {'x' | 'y'} axis
	* @param {Point} [point]
	* point based on which zoom is performed, usually refers to the current mouse position,
	* if false - viewport center will be used.
	* @param {number} [prevZoomLevel] Zoom level before new zoom was applied.
	* @returns {number}
	*/
	calculateZoomToPanOffset(axis, point, prevZoomLevel) {
		if (this.bounds.max[axis] - this.bounds.min[axis] === 0) return this.bounds.center[axis];
		if (!point) point = this.pswp.getViewportCenterPoint();
		if (!prevZoomLevel) prevZoomLevel = this.zoomLevels.initial;
		const zoomFactor = this.currZoomLevel / prevZoomLevel;
		return this.bounds.correctPan(axis, (this.pan[axis] - point[axis]) * zoomFactor + point[axis]);
	}
	/**
	* Apply pan and keep it within bounds.
	*
	* @param {number} panX
	* @param {number} panY
	*/
	panTo(panX, panY) {
		this.pan.x = this.bounds.correctPan("x", panX);
		this.pan.y = this.bounds.correctPan("y", panY);
		this.applyCurrentZoomPan();
	}
	/**
	* If the slide in the current state can be panned by the user
	* @returns {boolean}
	*/
	isPannable() {
		return Boolean(this.width) && this.currZoomLevel > this.zoomLevels.fit;
	}
	/**
	* If the slide can be zoomed
	* @returns {boolean}
	*/
	isZoomable() {
		return Boolean(this.width) && this.content.isZoomable();
	}
	/**
	* Apply transform and scale based on
	* the current pan position (this.pan) and zoom level (this.currZoomLevel)
	*/
	applyCurrentZoomPan() {
		this._applyZoomTransform(this.pan.x, this.pan.y, this.currZoomLevel);
		if (this === this.pswp.currSlide) this.pswp.dispatch("zoomPanUpdate", { slide: this });
	}
	zoomAndPanToInitial() {
		this.currZoomLevel = this.zoomLevels.initial;
		this.bounds.update(this.currZoomLevel);
		equalizePoints(this.pan, this.bounds.center);
		this.pswp.dispatch("initialZoomPan", { slide: this });
	}
	/**
	* Set translate and scale based on current resolution
	*
	* @param {number} x
	* @param {number} y
	* @param {number} zoom
	* @private
	*/
	_applyZoomTransform(x, y, zoom) {
		zoom /= this.currentResolution || this.zoomLevels.initial;
		setTransform(this.container, x, y, zoom);
	}
	calculateSize() {
		const { pswp } = this;
		equalizePoints(this.panAreaSize, getPanAreaSize(pswp.options, pswp.viewportSize, this.data, this.index));
		this.zoomLevels.update(this.width, this.height, this.panAreaSize);
		pswp.dispatch("calcSlideSize", { slide: this });
	}
	/** @returns {string} */
	getCurrentTransform() {
		const scale = this.currZoomLevel / (this.currentResolution || this.zoomLevels.initial);
		return toTransformString(this.pan.x, this.pan.y, scale);
	}
	/**
	* Set resolution and re-render the image.
	*
	* For example, if the real image size is 2000x1500,
	* and resolution is 0.5 - it will be rendered as 1000x750.
	*
	* Image with zoom level 2 and resolution 0.5 is
	* the same as image with zoom level 1 and resolution 1.
	*
	* Used to optimize animations and make
	* sure that browser renders image in the highest quality.
	* Also used by responsive images to load the correct one.
	*
	* @param {number} newResolution
	*/
	_setResolution(newResolution) {
		if (newResolution === this.currentResolution) return;
		this.currentResolution = newResolution;
		this.updateContentSize();
		this.pswp.dispatch("resolutionChanged");
	}
};
/** @typedef {import('../photoswipe.js').Point} Point */
/** @typedef {import('./gestures.js').default} Gestures */
const PAN_END_FRICTION = .35;
const VERTICAL_DRAG_FRICTION = .6;
const MIN_RATIO_TO_CLOSE = .4;
const MIN_NEXT_SLIDE_SPEED = .5;
/**
* @param {number} initialVelocity
* @param {number} decelerationRate
* @returns {number}
*/
function project(initialVelocity, decelerationRate) {
	return initialVelocity * decelerationRate / (1 - decelerationRate);
}
/**
* Handles single pointer dragging
*/
var DragHandler = class {
	/**
	* @param {Gestures} gestures
	*/
	constructor(gestures) {
		this.gestures = gestures;
		this.pswp = gestures.pswp;
		/** @type {Point} */
		this.startPan = {
			x: 0,
			y: 0
		};
	}
	start() {
		if (this.pswp.currSlide) equalizePoints(this.startPan, this.pswp.currSlide.pan);
		this.pswp.animations.stopAll();
	}
	change() {
		const { p1, prevP1, dragAxis } = this.gestures;
		const { currSlide } = this.pswp;
		if (dragAxis === "y" && this.pswp.options.closeOnVerticalDrag && currSlide && currSlide.currZoomLevel <= currSlide.zoomLevels.fit && !this.gestures.isMultitouch) {
			const panY = currSlide.pan.y + (p1.y - prevP1.y);
			if (!this.pswp.dispatch("verticalDrag", { panY }).defaultPrevented) {
				this._setPanWithFriction("y", panY, VERTICAL_DRAG_FRICTION);
				const bgOpacity = 1 - Math.abs(this._getVerticalDragRatio(currSlide.pan.y));
				this.pswp.applyBgOpacity(bgOpacity);
				currSlide.applyCurrentZoomPan();
			}
		} else if (!this._panOrMoveMainScroll("x")) {
			this._panOrMoveMainScroll("y");
			if (currSlide) {
				roundPoint(currSlide.pan);
				currSlide.applyCurrentZoomPan();
			}
		}
	}
	end() {
		const { velocity } = this.gestures;
		const { mainScroll, currSlide } = this.pswp;
		let indexDiff = 0;
		this.pswp.animations.stopAll();
		if (mainScroll.isShifted()) {
			const currentSlideVisibilityRatio = (mainScroll.x - mainScroll.getCurrSlideX()) / this.pswp.viewportSize.x;
			if (velocity.x < -.5 && currentSlideVisibilityRatio < 0 || velocity.x < .1 && currentSlideVisibilityRatio < -.5) {
				indexDiff = 1;
				velocity.x = Math.min(velocity.x, 0);
			} else if (velocity.x > MIN_NEXT_SLIDE_SPEED && currentSlideVisibilityRatio > 0 || velocity.x > -.1 && currentSlideVisibilityRatio > .5) {
				indexDiff = -1;
				velocity.x = Math.max(velocity.x, 0);
			}
			mainScroll.moveIndexBy(indexDiff, true, velocity.x);
		}
		if (currSlide && currSlide.currZoomLevel > currSlide.zoomLevels.max || this.gestures.isMultitouch) this.gestures.zoomLevels.correctZoomPan(true);
		else {
			this._finishPanGestureForAxis("x");
			this._finishPanGestureForAxis("y");
		}
	}
	/**
	* @private
	* @param {'x' | 'y'} axis
	*/
	_finishPanGestureForAxis(axis) {
		const { velocity } = this.gestures;
		const { currSlide } = this.pswp;
		if (!currSlide) return;
		const { pan, bounds } = currSlide;
		const panPos = pan[axis];
		const restoreBgOpacity = this.pswp.bgOpacity < 1 && axis === "y";
		const projectedPosition = panPos + project(velocity[axis], .995);
		if (restoreBgOpacity) {
			const vDragRatio = this._getVerticalDragRatio(panPos);
			const projectedVDragRatio = this._getVerticalDragRatio(projectedPosition);
			if (vDragRatio < 0 && projectedVDragRatio < -.4 || vDragRatio > 0 && projectedVDragRatio > MIN_RATIO_TO_CLOSE) {
				this.pswp.close();
				return;
			}
		}
		const correctedPanPosition = bounds.correctPan(axis, projectedPosition);
		if (panPos === correctedPanPosition) return;
		const dampingRatio = correctedPanPosition === projectedPosition ? 1 : .82;
		const initialBgOpacity = this.pswp.bgOpacity;
		const totalPanDist = correctedPanPosition - panPos;
		this.pswp.animations.startSpring({
			name: "panGesture" + axis,
			isPan: true,
			start: panPos,
			end: correctedPanPosition,
			velocity: velocity[axis],
			dampingRatio,
			onUpdate: (pos) => {
				if (restoreBgOpacity && this.pswp.bgOpacity < 1) {
					const animationProgressRatio = 1 - (correctedPanPosition - pos) / totalPanDist;
					this.pswp.applyBgOpacity(clamp(initialBgOpacity + (1 - initialBgOpacity) * animationProgressRatio, 0, 1));
				}
				pan[axis] = Math.floor(pos);
				currSlide.applyCurrentZoomPan();
			}
		});
	}
	/**
	* Update position of the main scroll,
	* or/and update pan position of the current slide.
	*
	* Should return true if it changes (or can change) main scroll.
	*
	* @private
	* @param {'x' | 'y'} axis
	* @returns {boolean}
	*/
	_panOrMoveMainScroll(axis) {
		const { p1, dragAxis, prevP1, isMultitouch } = this.gestures;
		const { currSlide, mainScroll } = this.pswp;
		const delta = p1[axis] - prevP1[axis];
		const newMainScrollX = mainScroll.x + delta;
		if (!delta || !currSlide) return false;
		if (axis === "x" && !currSlide.isPannable() && !isMultitouch) {
			mainScroll.moveTo(newMainScrollX, true);
			return true;
		}
		const { bounds } = currSlide;
		const newPan = currSlide.pan[axis] + delta;
		if (this.pswp.options.allowPanToNext && dragAxis === "x" && axis === "x" && !isMultitouch) {
			const currSlideMainScrollX = mainScroll.getCurrSlideX();
			const mainScrollShiftDiff = mainScroll.x - currSlideMainScrollX;
			const isLeftToRight = delta > 0;
			const isRightToLeft = !isLeftToRight;
			if (newPan > bounds.min[axis] && isLeftToRight) {
				if (bounds.min[axis] <= this.startPan[axis]) {
					mainScroll.moveTo(newMainScrollX, true);
					return true;
				} else this._setPanWithFriction(axis, newPan);
			} else if (newPan < bounds.max[axis] && isRightToLeft) {
				if (this.startPan[axis] <= bounds.max[axis]) {
					mainScroll.moveTo(newMainScrollX, true);
					return true;
				} else this._setPanWithFriction(axis, newPan);
			} else if (mainScrollShiftDiff !== 0) {
				if (mainScrollShiftDiff > 0) {
					mainScroll.moveTo(Math.max(newMainScrollX, currSlideMainScrollX), true);
					return true;
				} else if (mainScrollShiftDiff < 0) {
					mainScroll.moveTo(Math.min(newMainScrollX, currSlideMainScrollX), true);
					return true;
				}
			} else this._setPanWithFriction(axis, newPan);
		} else if (axis === "y") {
			if (!mainScroll.isShifted() && bounds.min.y !== bounds.max.y) this._setPanWithFriction(axis, newPan);
		} else this._setPanWithFriction(axis, newPan);
		return false;
	}
	/**
	* Relation between pan Y position and third of viewport height.
	*
	* When we are at initial position (center bounds) - the ratio is 0,
	* if position is shifted upwards - the ratio is negative,
	* if position is shifted downwards - the ratio is positive.
	*
	* @private
	* @param {number} panY The current pan Y position.
	* @returns {number}
	*/
	_getVerticalDragRatio(panY) {
		var _this$pswp$currSlide$, _this$pswp$currSlide;
		return (panY - ((_this$pswp$currSlide$ = (_this$pswp$currSlide = this.pswp.currSlide) === null || _this$pswp$currSlide === void 0 ? void 0 : _this$pswp$currSlide.bounds.center.y) !== null && _this$pswp$currSlide$ !== void 0 ? _this$pswp$currSlide$ : 0)) / (this.pswp.viewportSize.y / 3);
	}
	/**
	* Set pan position of the current slide.
	* Apply friction if the position is beyond the pan bounds,
	* or if custom friction is defined.
	*
	* @private
	* @param {'x' | 'y'} axis
	* @param {number} potentialPan
	* @param {number} [customFriction] (0.1 - 1)
	*/
	_setPanWithFriction(axis, potentialPan, customFriction) {
		const { currSlide } = this.pswp;
		if (!currSlide) return;
		const { pan, bounds } = currSlide;
		if (bounds.correctPan(axis, potentialPan) !== potentialPan || customFriction) {
			const delta = Math.round(potentialPan - pan[axis]);
			pan[axis] += delta * (customFriction || PAN_END_FRICTION);
		} else pan[axis] = potentialPan;
	}
};
/** @typedef {import('../photoswipe.js').Point} Point */
/** @typedef {import('./gestures.js').default} Gestures */
const UPPER_ZOOM_FRICTION = .05;
const LOWER_ZOOM_FRICTION = .15;
/**
* Get center point between two points
*
* @param {Point} p
* @param {Point} p1
* @param {Point} p2
* @returns {Point}
*/
function getZoomPointsCenter(p, p1, p2) {
	p.x = (p1.x + p2.x) / 2;
	p.y = (p1.y + p2.y) / 2;
	return p;
}
var ZoomHandler = class {
	/**
	* @param {Gestures} gestures
	*/
	constructor(gestures) {
		this.gestures = gestures;
		/**
		* @private
		* @type {Point}
		*/
		this._startPan = {
			x: 0,
			y: 0
		};
		/**
		* @private
		* @type {Point}
		*/
		this._startZoomPoint = {
			x: 0,
			y: 0
		};
		/**
		* @private
		* @type {Point}
		*/
		this._zoomPoint = {
			x: 0,
			y: 0
		};
		/** @private */
		this._wasOverFitZoomLevel = false;
		/** @private */
		this._startZoomLevel = 1;
	}
	start() {
		const { currSlide } = this.gestures.pswp;
		if (currSlide) {
			this._startZoomLevel = currSlide.currZoomLevel;
			equalizePoints(this._startPan, currSlide.pan);
		}
		this.gestures.pswp.animations.stopAllPan();
		this._wasOverFitZoomLevel = false;
	}
	change() {
		const { p1, startP1, p2, startP2, pswp } = this.gestures;
		const { currSlide } = pswp;
		if (!currSlide) return;
		const minZoomLevel = currSlide.zoomLevels.min;
		const maxZoomLevel = currSlide.zoomLevels.max;
		if (!currSlide.isZoomable() || pswp.mainScroll.isShifted()) return;
		getZoomPointsCenter(this._startZoomPoint, startP1, startP2);
		getZoomPointsCenter(this._zoomPoint, p1, p2);
		let currZoomLevel = 1 / getDistanceBetween(startP1, startP2) * getDistanceBetween(p1, p2) * this._startZoomLevel;
		if (currZoomLevel > currSlide.zoomLevels.initial + currSlide.zoomLevels.initial / 15) this._wasOverFitZoomLevel = true;
		if (currZoomLevel < minZoomLevel) {
			if (pswp.options.pinchToClose && !this._wasOverFitZoomLevel && this._startZoomLevel <= currSlide.zoomLevels.initial) {
				const bgOpacity = 1 - (minZoomLevel - currZoomLevel) / (minZoomLevel / 1.2);
				if (!pswp.dispatch("pinchClose", { bgOpacity }).defaultPrevented) pswp.applyBgOpacity(bgOpacity);
			} else currZoomLevel = minZoomLevel - (minZoomLevel - currZoomLevel) * LOWER_ZOOM_FRICTION;
		} else if (currZoomLevel > maxZoomLevel) currZoomLevel = maxZoomLevel + (currZoomLevel - maxZoomLevel) * UPPER_ZOOM_FRICTION;
		currSlide.pan.x = this._calculatePanForZoomLevel("x", currZoomLevel);
		currSlide.pan.y = this._calculatePanForZoomLevel("y", currZoomLevel);
		currSlide.setZoomLevel(currZoomLevel);
		currSlide.applyCurrentZoomPan();
	}
	end() {
		const { pswp } = this.gestures;
		const { currSlide } = pswp;
		if ((!currSlide || currSlide.currZoomLevel < currSlide.zoomLevels.initial) && !this._wasOverFitZoomLevel && pswp.options.pinchToClose) pswp.close();
		else this.correctZoomPan();
	}
	/**
	* @private
	* @param {'x' | 'y'} axis
	* @param {number} currZoomLevel
	* @returns {number}
	*/
	_calculatePanForZoomLevel(axis, currZoomLevel) {
		const zoomFactor = currZoomLevel / this._startZoomLevel;
		return this._zoomPoint[axis] - (this._startZoomPoint[axis] - this._startPan[axis]) * zoomFactor;
	}
	/**
	* Correct currZoomLevel and pan if they are
	* beyond minimum or maximum values.
	* With animation.
	*
	* @param {boolean} [ignoreGesture]
	* Wether gesture coordinates should be ignored when calculating destination pan position.
	*/
	correctZoomPan(ignoreGesture) {
		const { pswp } = this.gestures;
		const { currSlide } = pswp;
		if (!(currSlide !== null && currSlide !== void 0 && currSlide.isZoomable())) return;
		if (this._zoomPoint.x === 0) ignoreGesture = true;
		const prevZoomLevel = currSlide.currZoomLevel;
		/** @type {number} */
		let destinationZoomLevel;
		let currZoomLevelNeedsChange = true;
		if (prevZoomLevel < currSlide.zoomLevels.initial) destinationZoomLevel = currSlide.zoomLevels.initial;
		else if (prevZoomLevel > currSlide.zoomLevels.max) destinationZoomLevel = currSlide.zoomLevels.max;
		else {
			currZoomLevelNeedsChange = false;
			destinationZoomLevel = prevZoomLevel;
		}
		const initialBgOpacity = pswp.bgOpacity;
		const restoreBgOpacity = pswp.bgOpacity < 1;
		const initialPan = equalizePoints({
			x: 0,
			y: 0
		}, currSlide.pan);
		let destinationPan = equalizePoints({
			x: 0,
			y: 0
		}, initialPan);
		if (ignoreGesture) {
			this._zoomPoint.x = 0;
			this._zoomPoint.y = 0;
			this._startZoomPoint.x = 0;
			this._startZoomPoint.y = 0;
			this._startZoomLevel = prevZoomLevel;
			equalizePoints(this._startPan, initialPan);
		}
		if (currZoomLevelNeedsChange) destinationPan = {
			x: this._calculatePanForZoomLevel("x", destinationZoomLevel),
			y: this._calculatePanForZoomLevel("y", destinationZoomLevel)
		};
		currSlide.setZoomLevel(destinationZoomLevel);
		destinationPan = {
			x: currSlide.bounds.correctPan("x", destinationPan.x),
			y: currSlide.bounds.correctPan("y", destinationPan.y)
		};
		currSlide.setZoomLevel(prevZoomLevel);
		const panNeedsChange = !pointsEqual(destinationPan, initialPan);
		if (!panNeedsChange && !currZoomLevelNeedsChange && !restoreBgOpacity) {
			currSlide._setResolution(destinationZoomLevel);
			currSlide.applyCurrentZoomPan();
			return;
		}
		pswp.animations.stopAllPan();
		pswp.animations.startSpring({
			isPan: true,
			start: 0,
			end: 1e3,
			velocity: 0,
			dampingRatio: 1,
			naturalFrequency: 40,
			onUpdate: (now) => {
				now /= 1e3;
				if (panNeedsChange || currZoomLevelNeedsChange) {
					if (panNeedsChange) {
						currSlide.pan.x = initialPan.x + (destinationPan.x - initialPan.x) * now;
						currSlide.pan.y = initialPan.y + (destinationPan.y - initialPan.y) * now;
					}
					if (currZoomLevelNeedsChange) {
						const newZoomLevel = prevZoomLevel + (destinationZoomLevel - prevZoomLevel) * now;
						currSlide.setZoomLevel(newZoomLevel);
					}
					currSlide.applyCurrentZoomPan();
				}
				if (restoreBgOpacity && pswp.bgOpacity < 1) pswp.applyBgOpacity(clamp(initialBgOpacity + (1 - initialBgOpacity) * now, 0, 1));
			},
			onComplete: () => {
				currSlide._setResolution(destinationZoomLevel);
				currSlide.applyCurrentZoomPan();
			}
		});
	}
};
/**
* @template {string} T
* @template {string} P
* @typedef {import('../types.js').AddPostfix<T, P>} AddPostfix<T, P>
*/
/** @typedef {import('./gestures.js').default} Gestures */
/** @typedef {import('../photoswipe.js').Point} Point */
/** @typedef {'imageClick' | 'bgClick' | 'tap' | 'doubleTap'} Actions */
/**
* Whether the tap was performed on the main slide
* (rather than controls or caption).
*
* @param {PointerEvent} event
* @returns {boolean}
*/
function didTapOnMainContent(event) {
	return !!event.target.closest(".pswp__container");
}
/**
* Tap, double-tap handler.
*/
var TapHandler = class {
	/**
	* @param {Gestures} gestures
	*/
	constructor(gestures) {
		this.gestures = gestures;
	}
	/**
	* @param {Point} point
	* @param {PointerEvent} originalEvent
	*/
	click(point, originalEvent) {
		const targetClassList = originalEvent.target.classList;
		const isImageClick = targetClassList.contains("pswp__img");
		const isBackgroundClick = targetClassList.contains("pswp__item") || targetClassList.contains("pswp__zoom-wrap");
		if (isImageClick) this._doClickOrTapAction("imageClick", point, originalEvent);
		else if (isBackgroundClick) this._doClickOrTapAction("bgClick", point, originalEvent);
	}
	/**
	* @param {Point} point
	* @param {PointerEvent} originalEvent
	*/
	tap(point, originalEvent) {
		if (didTapOnMainContent(originalEvent)) this._doClickOrTapAction("tap", point, originalEvent);
	}
	/**
	* @param {Point} point
	* @param {PointerEvent} originalEvent
	*/
	doubleTap(point, originalEvent) {
		if (didTapOnMainContent(originalEvent)) this._doClickOrTapAction("doubleTap", point, originalEvent);
	}
	/**
	* @private
	* @param {Actions} actionName
	* @param {Point} point
	* @param {PointerEvent} originalEvent
	*/
	_doClickOrTapAction(actionName, point, originalEvent) {
		var _this$gestures$pswp$e;
		const { pswp } = this.gestures;
		const { currSlide } = pswp;
		const actionFullName = actionName + "Action";
		const optionValue = pswp.options[actionFullName];
		if (pswp.dispatch(actionFullName, {
			point,
			originalEvent
		}).defaultPrevented) return;
		if (typeof optionValue === "function") {
			optionValue.call(pswp, point, originalEvent);
			return;
		}
		switch (optionValue) {
			case "close":
			case "next":
				pswp[optionValue]();
				break;
			case "zoom":
				currSlide === null || currSlide === void 0 || currSlide.toggleZoom(point);
				break;
			case "zoom-or-close":
				if (currSlide !== null && currSlide !== void 0 && currSlide.isZoomable() && currSlide.zoomLevels.secondary !== currSlide.zoomLevels.initial) currSlide.toggleZoom(point);
				else if (pswp.options.clickToCloseNonZoomable) pswp.close();
				break;
			case "toggle-controls": (_this$gestures$pswp$e = this.gestures.pswp.element) === null || _this$gestures$pswp$e === void 0 || _this$gestures$pswp$e.classList.toggle("pswp--ui-visible");
		}
	}
};
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/** @typedef {import('../photoswipe.js').Point} Point */
const AXIS_SWIPE_HYSTERISIS = 10;
const DOUBLE_TAP_DELAY = 300;
const MIN_TAP_DISTANCE = 25;
/**
* Gestures class bind touch, pointer or mouse events
* and emits drag to drag-handler and zoom events zoom-handler.
*
* Drag and zoom events are emited in requestAnimationFrame,
* and only when one of pointers was actually changed.
*/
var Gestures = class {
	/**
	* @param {PhotoSwipe} pswp
	*/
	constructor(pswp) {
		this.pswp = pswp;
		/** @type {'x' | 'y' | null} */
		this.dragAxis = null;
		/** @type {Point} */
		this.p1 = {
			x: 0,
			y: 0
		};
		/** @type {Point} */
		this.p2 = {
			x: 0,
			y: 0
		};
		/** @type {Point} */
		this.prevP1 = {
			x: 0,
			y: 0
		};
		/** @type {Point} */
		this.prevP2 = {
			x: 0,
			y: 0
		};
		/** @type {Point} */
		this.startP1 = {
			x: 0,
			y: 0
		};
		/** @type {Point} */
		this.startP2 = {
			x: 0,
			y: 0
		};
		/** @type {Point} */
		this.velocity = {
			x: 0,
			y: 0
		};
		/** @type {Point}
		* @private
		*/
		this._lastStartP1 = {
			x: 0,
			y: 0
		};
		/** @type {Point}
		* @private
		*/
		this._intervalP1 = {
			x: 0,
			y: 0
		};
		/** @private */
		this._numActivePoints = 0;
		/** @type {Point[]}
		* @private
		*/
		this._ongoingPointers = [];
		/** @private */
		this._touchEventEnabled = "ontouchstart" in window;
		/** @private */
		this._pointerEventEnabled = !!window.PointerEvent;
		this.supportsTouch = this._touchEventEnabled || this._pointerEventEnabled && navigator.maxTouchPoints > 1;
		/** @private */
		this._numActivePoints = 0;
		/** @private */
		this._intervalTime = 0;
		/** @private */
		this._velocityCalculated = false;
		this.isMultitouch = false;
		this.isDragging = false;
		this.isZooming = false;
		/** @type {number | null} */
		this.raf = null;
		/** @type {NodeJS.Timeout | null}
		* @private
		*/
		this._tapTimer = null;
		if (!this.supportsTouch) pswp.options.allowPanToNext = false;
		this.drag = new DragHandler(this);
		this.zoomLevels = new ZoomHandler(this);
		this.tapHandler = new TapHandler(this);
		pswp.on("bindEvents", () => {
			pswp.events.add(
				pswp.scrollWrap,
				"click",
				/** @type EventListener */
				this._onClick.bind(this)
			);
			if (this._pointerEventEnabled) this._bindEvents("pointer", "down", "up", "cancel");
			else if (this._touchEventEnabled) {
				this._bindEvents("touch", "start", "end", "cancel");
				if (pswp.scrollWrap) {
					pswp.scrollWrap.ontouchmove = () => {};
					pswp.scrollWrap.ontouchend = () => {};
				}
			} else this._bindEvents("mouse", "down", "up");
		});
	}
	/**
	* @private
	* @param {'mouse' | 'touch' | 'pointer'} pref
	* @param {'down' | 'start'} down
	* @param {'up' | 'end'} up
	* @param {'cancel'} [cancel]
	*/
	_bindEvents(pref, down, up, cancel) {
		const { pswp } = this;
		const { events } = pswp;
		const cancelEvent = cancel ? pref + cancel : "";
		events.add(
			pswp.scrollWrap,
			pref + down,
			/** @type EventListener */
			this.onPointerDown.bind(this)
		);
		events.add(
			window,
			pref + "move",
			/** @type EventListener */
			this.onPointerMove.bind(this)
		);
		events.add(
			window,
			pref + up,
			/** @type EventListener */
			this.onPointerUp.bind(this)
		);
		if (cancelEvent) events.add(
			pswp.scrollWrap,
			cancelEvent,
			/** @type EventListener */
			this.onPointerUp.bind(this)
		);
	}
	/**
	* @param {PointerEvent} e
	*/
	onPointerDown(e) {
		const isMousePointer = e.type === "mousedown" || e.pointerType === "mouse";
		if (isMousePointer && e.button > 0) return;
		const { pswp } = this;
		if (!pswp.opener.isOpen) {
			e.preventDefault();
			return;
		}
		if (pswp.dispatch("pointerDown", { originalEvent: e }).defaultPrevented) return;
		if (isMousePointer) {
			pswp.mouseDetected();
			this._preventPointerEventBehaviour(e, "down");
		}
		pswp.animations.stopAll();
		this._updatePoints(e, "down");
		if (this._numActivePoints === 1) {
			this.dragAxis = null;
			equalizePoints(this.startP1, this.p1);
		}
		if (this._numActivePoints > 1) {
			this._clearTapTimer();
			this.isMultitouch = true;
		} else this.isMultitouch = false;
	}
	/**
	* @param {PointerEvent} e
	*/
	onPointerMove(e) {
		this._preventPointerEventBehaviour(e, "move");
		if (!this._numActivePoints) return;
		this._updatePoints(e, "move");
		if (this.pswp.dispatch("pointerMove", { originalEvent: e }).defaultPrevented) return;
		if (this._numActivePoints === 1 && !this.isDragging) {
			if (!this.dragAxis) this._calculateDragDirection();
			if (this.dragAxis && !this.isDragging) {
				if (this.isZooming) {
					this.isZooming = false;
					this.zoomLevels.end();
				}
				this.isDragging = true;
				this._clearTapTimer();
				this._updateStartPoints();
				this._intervalTime = Date.now();
				this._velocityCalculated = false;
				equalizePoints(this._intervalP1, this.p1);
				this.velocity.x = 0;
				this.velocity.y = 0;
				this.drag.start();
				this._rafStopLoop();
				this._rafRenderLoop();
			}
		} else if (this._numActivePoints > 1 && !this.isZooming) {
			this._finishDrag();
			this.isZooming = true;
			this._updateStartPoints();
			this.zoomLevels.start();
			this._rafStopLoop();
			this._rafRenderLoop();
		}
	}
	/**
	* @private
	*/
	_finishDrag() {
		if (this.isDragging) {
			this.isDragging = false;
			if (!this._velocityCalculated) this._updateVelocity(true);
			this.drag.end();
			this.dragAxis = null;
		}
	}
	/**
	* @param {PointerEvent} e
	*/
	onPointerUp(e) {
		if (!this._numActivePoints) return;
		this._updatePoints(e, "up");
		if (this.pswp.dispatch("pointerUp", { originalEvent: e }).defaultPrevented) return;
		if (this._numActivePoints === 0) {
			this._rafStopLoop();
			if (this.isDragging) this._finishDrag();
			else if (!this.isZooming && !this.isMultitouch) this._finishTap(e);
		}
		if (this._numActivePoints < 2 && this.isZooming) {
			this.isZooming = false;
			this.zoomLevels.end();
			if (this._numActivePoints === 1) {
				this.dragAxis = null;
				this._updateStartPoints();
			}
		}
	}
	/**
	* @private
	*/
	_rafRenderLoop() {
		if (this.isDragging || this.isZooming) {
			this._updateVelocity();
			if (this.isDragging) {
				if (!pointsEqual(this.p1, this.prevP1)) this.drag.change();
			} else if (!pointsEqual(this.p1, this.prevP1) || !pointsEqual(this.p2, this.prevP2)) this.zoomLevels.change();
			this._updatePrevPoints();
			this.raf = requestAnimationFrame(this._rafRenderLoop.bind(this));
		}
	}
	/**
	* Update velocity at 50ms interval
	*
	* @private
	* @param {boolean} [force]
	*/
	_updateVelocity(force) {
		const time = Date.now();
		const duration = time - this._intervalTime;
		if (duration < 50 && !force) return;
		this.velocity.x = this._getVelocity("x", duration);
		this.velocity.y = this._getVelocity("y", duration);
		this._intervalTime = time;
		equalizePoints(this._intervalP1, this.p1);
		this._velocityCalculated = true;
	}
	/**
	* @private
	* @param {PointerEvent} e
	*/
	_finishTap(e) {
		const { mainScroll } = this.pswp;
		if (mainScroll.isShifted()) {
			mainScroll.moveIndexBy(0, true);
			return;
		}
		if (e.type.indexOf("cancel") > 0) return;
		if (e.type === "mouseup" || e.pointerType === "mouse") {
			this.tapHandler.click(this.startP1, e);
			return;
		}
		const tapDelay = this.pswp.options.doubleTapAction ? DOUBLE_TAP_DELAY : 0;
		if (this._tapTimer) {
			this._clearTapTimer();
			if (getDistanceBetween(this._lastStartP1, this.startP1) < MIN_TAP_DISTANCE) this.tapHandler.doubleTap(this.startP1, e);
		} else {
			equalizePoints(this._lastStartP1, this.startP1);
			this._tapTimer = setTimeout(() => {
				this.tapHandler.tap(this.startP1, e);
				this._clearTapTimer();
			}, tapDelay);
		}
	}
	/**
	* @private
	*/
	_clearTapTimer() {
		if (this._tapTimer) {
			clearTimeout(this._tapTimer);
			this._tapTimer = null;
		}
	}
	/**
	* Get velocity for axis
	*
	* @private
	* @param {'x' | 'y'} axis
	* @param {number} duration
	* @returns {number}
	*/
	_getVelocity(axis, duration) {
		const displacement = this.p1[axis] - this._intervalP1[axis];
		if (Math.abs(displacement) > 1 && duration > 5) return displacement / duration;
		return 0;
	}
	/**
	* @private
	*/
	_rafStopLoop() {
		if (this.raf) {
			cancelAnimationFrame(this.raf);
			this.raf = null;
		}
	}
	/**
	* @private
	* @param {PointerEvent} e
	* @param {'up' | 'down' | 'move'} pointerType Normalized pointer type
	*/
	_preventPointerEventBehaviour(e, pointerType) {
		if (this.pswp.applyFilters("preventPointerEvent", true, e, pointerType)) e.preventDefault();
	}
	/**
	* Parses and normalizes points from the touch, mouse or pointer event.
	* Updates p1 and p2.
	*
	* @private
	* @param {PointerEvent | TouchEvent} e
	* @param {'up' | 'down' | 'move'} pointerType Normalized pointer type
	*/
	_updatePoints(e, pointerType) {
		if (this._pointerEventEnabled) {
			const pointerEvent = e;
			const pointerIndex = this._ongoingPointers.findIndex((ongoingPointer) => {
				return ongoingPointer.id === pointerEvent.pointerId;
			});
			if (pointerType === "up" && pointerIndex > -1) this._ongoingPointers.splice(pointerIndex, 1);
			else if (pointerType === "down" && pointerIndex === -1) this._ongoingPointers.push(this._convertEventPosToPoint(pointerEvent, {
				x: 0,
				y: 0
			}));
			else if (pointerIndex > -1) this._convertEventPosToPoint(pointerEvent, this._ongoingPointers[pointerIndex]);
			this._numActivePoints = this._ongoingPointers.length;
			if (this._numActivePoints > 0) equalizePoints(this.p1, this._ongoingPointers[0]);
			if (this._numActivePoints > 1) equalizePoints(this.p2, this._ongoingPointers[1]);
		} else {
			const touchEvent = e;
			this._numActivePoints = 0;
			if (touchEvent.type.indexOf("touch") > -1) {
				if (touchEvent.touches && touchEvent.touches.length > 0) {
					this._convertEventPosToPoint(touchEvent.touches[0], this.p1);
					this._numActivePoints++;
					if (touchEvent.touches.length > 1) {
						this._convertEventPosToPoint(touchEvent.touches[1], this.p2);
						this._numActivePoints++;
					}
				}
			} else {
				this._convertEventPosToPoint(
					/** @type {PointerEvent} */
					e,
					this.p1
				);
				if (pointerType === "up") this._numActivePoints = 0;
				else this._numActivePoints++;
			}
		}
	}
	/** update points that were used during previous rAF tick
	* @private
	*/
	_updatePrevPoints() {
		equalizePoints(this.prevP1, this.p1);
		equalizePoints(this.prevP2, this.p2);
	}
	/** update points at the start of gesture
	* @private
	*/
	_updateStartPoints() {
		equalizePoints(this.startP1, this.p1);
		equalizePoints(this.startP2, this.p2);
		this._updatePrevPoints();
	}
	/** @private */
	_calculateDragDirection() {
		if (this.pswp.mainScroll.isShifted()) this.dragAxis = "x";
		else {
			const diff = Math.abs(this.p1.x - this.startP1.x) - Math.abs(this.p1.y - this.startP1.y);
			if (diff !== 0) {
				const axisToCheck = diff > 0 ? "x" : "y";
				if (Math.abs(this.p1[axisToCheck] - this.startP1[axisToCheck]) >= AXIS_SWIPE_HYSTERISIS) this.dragAxis = axisToCheck;
			}
		}
	}
	/**
	* Converts touch, pointer or mouse event
	* to PhotoSwipe point.
	*
	* @private
	* @param {Touch | PointerEvent} e
	* @param {Point} p
	* @returns {Point}
	*/
	_convertEventPosToPoint(e, p) {
		p.x = e.pageX - this.pswp.offset.x;
		p.y = e.pageY - this.pswp.offset.y;
		if ("pointerId" in e) p.id = e.pointerId;
		else if (e.identifier !== void 0) p.id = e.identifier;
		return p;
	}
	/**
	* @private
	* @param {PointerEvent} e
	*/
	_onClick(e) {
		if (this.pswp.mainScroll.isShifted()) {
			e.preventDefault();
			e.stopPropagation();
		}
	}
};
/** @typedef {import('./photoswipe.js').default} PhotoSwipe */
/** @typedef {import('./slide/slide.js').default} Slide */
/** @typedef {{ el: HTMLDivElement; slide?: Slide }} ItemHolder */
const MAIN_SCROLL_END_FRICTION = .35;
/**
* Handles movement of the main scrolling container
* (for example, it repositions when user swipes left or right).
*
* Also stores its state.
*/
var MainScroll = class {
	/**
	* @param {PhotoSwipe} pswp
	*/
	constructor(pswp) {
		this.pswp = pswp;
		this.x = 0;
		this.slideWidth = 0;
		/** @private */
		this._currPositionIndex = 0;
		/** @private */
		this._prevPositionIndex = 0;
		/** @private */
		this._containerShiftIndex = -1;
		/** @type {ItemHolder[]} */
		this.itemHolders = [];
	}
	/**
	* Position the scroller and slide containers
	* according to viewport size.
	*
	* @param {boolean} [resizeSlides] Whether slides content should resized
	*/
	resize(resizeSlides) {
		const { pswp } = this;
		const newSlideWidth = Math.round(pswp.viewportSize.x + pswp.viewportSize.x * pswp.options.spacing);
		const slideWidthChanged = newSlideWidth !== this.slideWidth;
		if (slideWidthChanged) {
			this.slideWidth = newSlideWidth;
			this.moveTo(this.getCurrSlideX());
		}
		this.itemHolders.forEach((itemHolder, index) => {
			if (slideWidthChanged) setTransform(itemHolder.el, (index + this._containerShiftIndex) * this.slideWidth);
			if (resizeSlides && itemHolder.slide) itemHolder.slide.resize();
		});
	}
	/**
	* Reset X position of the main scroller to zero
	*/
	resetPosition() {
		this._currPositionIndex = 0;
		this._prevPositionIndex = 0;
		this.slideWidth = 0;
		this._containerShiftIndex = -1;
	}
	/**
	* Create and append array of three items
	* that hold data about slides in DOM
	*/
	appendHolders() {
		this.itemHolders = [];
		for (let i = 0; i < 3; i++) {
			const el = createElement("pswp__item", "div", this.pswp.container);
			el.setAttribute("role", "group");
			el.setAttribute("aria-roledescription", "slide");
			el.setAttribute("aria-hidden", "true");
			el.style.display = i === 1 ? "block" : "none";
			this.itemHolders.push({ el });
		}
	}
	/**
	* Whether the main scroll can be horizontally swiped to the next or previous slide.
	* @returns {boolean}
	*/
	canBeSwiped() {
		return this.pswp.getNumItems() > 1;
	}
	/**
	* Move main scroll by X amount of slides.
	* For example:
	*   `-1` will move to the previous slide,
	*    `0` will reset the scroll position of the current slide,
	*    `3` will move three slides forward
	*
	* If loop option is enabled - index will be automatically looped too,
	* (for example `-1` will move to the last slide of the gallery).
	*
	* @param {number} diff
	* @param {boolean} [animate]
	* @param {number} [velocityX]
	* @returns {boolean} whether index was changed or not
	*/
	moveIndexBy(diff, animate, velocityX) {
		const { pswp } = this;
		let newIndex = pswp.potentialIndex + diff;
		const numSlides = pswp.getNumItems();
		if (pswp.canLoop()) {
			newIndex = pswp.getLoopedIndex(newIndex);
			const distance = (diff + numSlides) % numSlides;
			if (distance <= numSlides / 2) diff = distance;
			else diff = distance - numSlides;
		} else {
			if (newIndex < 0) newIndex = 0;
			else if (newIndex >= numSlides) newIndex = numSlides - 1;
			diff = newIndex - pswp.potentialIndex;
		}
		pswp.potentialIndex = newIndex;
		this._currPositionIndex -= diff;
		pswp.animations.stopMainScroll();
		const destinationX = this.getCurrSlideX();
		if (!animate) {
			this.moveTo(destinationX);
			this.updateCurrItem();
		} else {
			pswp.animations.startSpring({
				isMainScroll: true,
				start: this.x,
				end: destinationX,
				velocity: velocityX || 0,
				naturalFrequency: 30,
				dampingRatio: 1,
				onUpdate: (x) => {
					this.moveTo(x);
				},
				onComplete: () => {
					this.updateCurrItem();
					pswp.appendHeavy();
				}
			});
			let currDiff = pswp.potentialIndex - pswp.currIndex;
			if (pswp.canLoop()) {
				const currDistance = (currDiff + numSlides) % numSlides;
				if (currDistance <= numSlides / 2) currDiff = currDistance;
				else currDiff = currDistance - numSlides;
			}
			if (Math.abs(currDiff) > 1) this.updateCurrItem();
		}
		return Boolean(diff);
	}
	/**
	* X position of the main scroll for the current slide
	* (ignores position during dragging)
	* @returns {number}
	*/
	getCurrSlideX() {
		return this.slideWidth * this._currPositionIndex;
	}
	/**
	* Whether scroll position is shifted.
	* For example, it will return true if the scroll is being dragged or animated.
	* @returns {boolean}
	*/
	isShifted() {
		return this.x !== this.getCurrSlideX();
	}
	/**
	* Update slides X positions and set their content
	*/
	updateCurrItem() {
		var _this$itemHolders$;
		const { pswp } = this;
		const positionDifference = this._prevPositionIndex - this._currPositionIndex;
		if (!positionDifference) return;
		this._prevPositionIndex = this._currPositionIndex;
		pswp.currIndex = pswp.potentialIndex;
		let diffAbs = Math.abs(positionDifference);
		/** @type {ItemHolder | undefined} */
		let tempHolder;
		if (diffAbs >= 3) {
			this._containerShiftIndex += positionDifference + (positionDifference > 0 ? -3 : 3);
			diffAbs = 3;
			this.itemHolders.forEach((itemHolder) => {
				var _itemHolder$slide;
				(_itemHolder$slide = itemHolder.slide) === null || _itemHolder$slide === void 0 || _itemHolder$slide.destroy();
				itemHolder.slide = void 0;
			});
		}
		for (let i = 0; i < diffAbs; i++) if (positionDifference > 0) {
			tempHolder = this.itemHolders.shift();
			if (tempHolder) {
				this.itemHolders[2] = tempHolder;
				this._containerShiftIndex++;
				setTransform(tempHolder.el, (this._containerShiftIndex + 2) * this.slideWidth);
				pswp.setContent(tempHolder, pswp.currIndex - diffAbs + i + 2);
			}
		} else {
			tempHolder = this.itemHolders.pop();
			if (tempHolder) {
				this.itemHolders.unshift(tempHolder);
				this._containerShiftIndex--;
				setTransform(tempHolder.el, this._containerShiftIndex * this.slideWidth);
				pswp.setContent(tempHolder, pswp.currIndex + diffAbs - i - 2);
			}
		}
		if (Math.abs(this._containerShiftIndex) > 50 && !this.isShifted()) {
			this.resetPosition();
			this.resize();
		}
		pswp.animations.stopAllPan();
		this.itemHolders.forEach((itemHolder, i) => {
			if (itemHolder.slide) itemHolder.slide.setIsActive(i === 1);
		});
		pswp.currSlide = (_this$itemHolders$ = this.itemHolders[1]) === null || _this$itemHolders$ === void 0 ? void 0 : _this$itemHolders$.slide;
		pswp.contentLoader.updateLazy(positionDifference);
		if (pswp.currSlide) pswp.currSlide.applyCurrentZoomPan();
		pswp.dispatch("change");
	}
	/**
	* Move the X position of the main scroll container
	*
	* @param {number} x
	* @param {boolean} [dragging]
	*/
	moveTo(x, dragging) {
		if (!this.pswp.canLoop() && dragging) {
			let newSlideIndexOffset = (this.slideWidth * this._currPositionIndex - x) / this.slideWidth;
			newSlideIndexOffset += this.pswp.currIndex;
			const delta = Math.round(x - this.x);
			if (newSlideIndexOffset < 0 && delta > 0 || newSlideIndexOffset >= this.pswp.getNumItems() - 1 && delta < 0) x = this.x + delta * MAIN_SCROLL_END_FRICTION;
		}
		this.x = x;
		if (this.pswp.container) setTransform(this.pswp.container, x);
		this.pswp.dispatch("moveMainScroll", {
			x,
			dragging: dragging !== null && dragging !== void 0 ? dragging : false
		});
	}
};
/** @typedef {import('./photoswipe.js').default} PhotoSwipe */
/**
* @template T
* @typedef {import('./types.js').Methods<T>} Methods<T>
*/
const KeyboardKeyCodesMap = {
	Escape: 27,
	z: 90,
	ArrowLeft: 37,
	ArrowUp: 38,
	ArrowRight: 39,
	ArrowDown: 40,
	Tab: 9
};
/**
* @template {keyof KeyboardKeyCodesMap} T
* @param {T} key
* @param {boolean} isKeySupported
* @returns {T | number | undefined}
*/
const getKeyboardEventKey = (key, isKeySupported) => {
	return isKeySupported ? key : KeyboardKeyCodesMap[key];
};
/**
* - Manages keyboard shortcuts.
* - Helps trap focus within photoswipe.
*/
var Keyboard = class {
	/**
	* @param {PhotoSwipe} pswp
	*/
	constructor(pswp) {
		this.pswp = pswp;
		/** @private */
		this._wasFocused = false;
		pswp.on("bindEvents", () => {
			if (pswp.options.trapFocus) {
				if (!pswp.options.initialPointerPos) this._focusRoot();
				pswp.events.add(
					document,
					"focusin",
					/** @type EventListener */
					this._onFocusIn.bind(this)
				);
			}
			pswp.events.add(
				document,
				"keydown",
				/** @type EventListener */
				this._onKeyDown.bind(this)
			);
		});
		const lastActiveElement = document.activeElement;
		pswp.on("destroy", () => {
			if (pswp.options.returnFocus && lastActiveElement && this._wasFocused) lastActiveElement.focus();
		});
	}
	/** @private */
	_focusRoot() {
		if (!this._wasFocused && this.pswp.element) {
			this.pswp.element.focus();
			this._wasFocused = true;
		}
	}
	/**
	* @private
	* @param {KeyboardEvent} e
	*/
	_onKeyDown(e) {
		const { pswp } = this;
		if (pswp.dispatch("keydown", { originalEvent: e }).defaultPrevented) return;
		if (specialKeyUsed(e)) return;
		/** @type {Methods<PhotoSwipe> | undefined} */
		let keydownAction;
		/** @type {'x' | 'y' | undefined} */
		let axis;
		let isForward = false;
		const isKeySupported = "key" in e;
		switch (isKeySupported ? e.key : e.keyCode) {
			case getKeyboardEventKey("Escape", isKeySupported):
				if (pswp.options.escKey) keydownAction = "close";
				break;
			case getKeyboardEventKey("z", isKeySupported):
				keydownAction = "toggleZoom";
				break;
			case getKeyboardEventKey("ArrowLeft", isKeySupported):
				axis = "x";
				break;
			case getKeyboardEventKey("ArrowUp", isKeySupported):
				axis = "y";
				break;
			case getKeyboardEventKey("ArrowRight", isKeySupported):
				axis = "x";
				isForward = true;
				break;
			case getKeyboardEventKey("ArrowDown", isKeySupported):
				isForward = true;
				axis = "y";
				break;
			case getKeyboardEventKey("Tab", isKeySupported): this._focusRoot();
		}
		if (axis) {
			e.preventDefault();
			const { currSlide } = pswp;
			if (pswp.options.arrowKeys && axis === "x" && pswp.getNumItems() > 1) keydownAction = isForward ? "next" : "prev";
			else if (currSlide && currSlide.currZoomLevel > currSlide.zoomLevels.fit) {
				currSlide.pan[axis] += isForward ? -80 : 80;
				currSlide.panTo(currSlide.pan.x, currSlide.pan.y);
			}
		}
		if (keydownAction) {
			e.preventDefault();
			pswp[keydownAction]();
		}
	}
	/**
	* Trap focus inside photoswipe
	*
	* @private
	* @param {FocusEvent} e
	*/
	_onFocusIn(e) {
		const { template } = this.pswp;
		if (template && document !== e.target && template !== e.target && !template.contains(
			/** @type {Node} */
			e.target
		)) template.focus();
	}
};
const DEFAULT_EASING = "cubic-bezier(.4,0,.22,1)";
/** @typedef {import('./animations.js').SharedAnimationProps} SharedAnimationProps */
/** @typedef {Object} DefaultCssAnimationProps
*
* @prop {HTMLElement} target
* @prop {number} [duration]
* @prop {string} [easing]
* @prop {string} [transform]
* @prop {string} [opacity]
* */
/** @typedef {SharedAnimationProps & DefaultCssAnimationProps} CssAnimationProps */
/**
* Runs CSS transition.
*/
var CSSAnimation = class {
	/**
	* onComplete can be unpredictable, be careful about current state
	*
	* @param {CssAnimationProps} props
	*/
	constructor(props) {
		var _props$prop;
		this.props = props;
		const { target, onComplete, transform, onFinish = () => {}, duration = 333, easing = DEFAULT_EASING } = props;
		this.onFinish = onFinish;
		const prop = transform ? "transform" : "opacity";
		const propValue = (_props$prop = props[prop]) !== null && _props$prop !== void 0 ? _props$prop : "";
		/** @private */
		this._target = target;
		/** @private */
		this._onComplete = onComplete;
		/** @private */
		this._finished = false;
		/** @private */
		this._onTransitionEnd = this._onTransitionEnd.bind(this);
		/** @private */
		this._helperTimeout = setTimeout(() => {
			setTransitionStyle(target, prop, duration, easing);
			this._helperTimeout = setTimeout(() => {
				target.addEventListener("transitionend", this._onTransitionEnd, false);
				target.addEventListener("transitioncancel", this._onTransitionEnd, false);
				this._helperTimeout = setTimeout(() => {
					this._finalizeAnimation();
				}, duration + 500);
				target.style[prop] = propValue;
			}, 30);
		}, 0);
	}
	/**
	* @private
	* @param {TransitionEvent} e
	*/
	_onTransitionEnd(e) {
		if (e.target === this._target) this._finalizeAnimation();
	}
	/**
	* @private
	*/
	_finalizeAnimation() {
		if (!this._finished) {
			this._finished = true;
			this.onFinish();
			if (this._onComplete) this._onComplete();
		}
	}
	destroy() {
		if (this._helperTimeout) clearTimeout(this._helperTimeout);
		removeTransitionStyle(this._target);
		this._target.removeEventListener("transitionend", this._onTransitionEnd, false);
		this._target.removeEventListener("transitioncancel", this._onTransitionEnd, false);
		if (!this._finished) this._finalizeAnimation();
	}
};
const DEFAULT_NATURAL_FREQUENCY = 12;
const DEFAULT_DAMPING_RATIO = .75;
/**
* Spring easing helper
*/
var SpringEaser = class {
	/**
	* @param {number} initialVelocity Initial velocity, px per ms.
	*
	* @param {number} [dampingRatio]
	* Determines how bouncy animation will be.
	* From 0 to 1, 0 - always overshoot, 1 - do not overshoot.
	* "overshoot" refers to part of animation that
	* goes beyond the final value.
	*
	* @param {number} [naturalFrequency]
	* Determines how fast animation will slow down.
	* The higher value - the stiffer the transition will be,
	* and the faster it will slow down.
	* Recommended value from 10 to 50
	*/
	constructor(initialVelocity, dampingRatio, naturalFrequency) {
		this.velocity = initialVelocity * 1e3;
		this._dampingRatio = dampingRatio || DEFAULT_DAMPING_RATIO;
		this._naturalFrequency = naturalFrequency || DEFAULT_NATURAL_FREQUENCY;
		this._dampedFrequency = this._naturalFrequency;
		if (this._dampingRatio < 1) this._dampedFrequency *= Math.sqrt(1 - this._dampingRatio * this._dampingRatio);
	}
	/**
	* @param {number} deltaPosition Difference between current and end position of the animation
	* @param {number} deltaTime Frame duration in milliseconds
	*
	* @returns {number} Displacement, relative to the end position.
	*/
	easeFrame(deltaPosition, deltaTime) {
		let displacement = 0;
		let coeff;
		deltaTime /= 1e3;
		const naturalDumpingPow = Math.E ** (-this._dampingRatio * this._naturalFrequency * deltaTime);
		if (this._dampingRatio === 1) {
			coeff = this.velocity + this._naturalFrequency * deltaPosition;
			displacement = (deltaPosition + coeff * deltaTime) * naturalDumpingPow;
			this.velocity = displacement * -this._naturalFrequency + coeff * naturalDumpingPow;
		} else if (this._dampingRatio < 1) {
			coeff = 1 / this._dampedFrequency * (this._dampingRatio * this._naturalFrequency * deltaPosition + this.velocity);
			const dumpedFCos = Math.cos(this._dampedFrequency * deltaTime);
			const dumpedFSin = Math.sin(this._dampedFrequency * deltaTime);
			displacement = naturalDumpingPow * (deltaPosition * dumpedFCos + coeff * dumpedFSin);
			this.velocity = displacement * -this._naturalFrequency * this._dampingRatio + naturalDumpingPow * (-this._dampedFrequency * deltaPosition * dumpedFSin + this._dampedFrequency * coeff * dumpedFCos);
		}
		return displacement;
	}
};
/** @typedef {import('./animations.js').SharedAnimationProps} SharedAnimationProps */
/**
* @typedef {Object} DefaultSpringAnimationProps
*
* @prop {number} start
* @prop {number} end
* @prop {number} velocity
* @prop {number} [dampingRatio]
* @prop {number} [naturalFrequency]
* @prop {(end: number) => void} onUpdate
*/
/** @typedef {SharedAnimationProps & DefaultSpringAnimationProps} SpringAnimationProps */
var SpringAnimation = class {
	/**
	* @param {SpringAnimationProps} props
	*/
	constructor(props) {
		this.props = props;
		this._raf = 0;
		const { start, end, velocity, onUpdate, onComplete, onFinish = () => {}, dampingRatio, naturalFrequency } = props;
		this.onFinish = onFinish;
		const easer = new SpringEaser(velocity, dampingRatio, naturalFrequency);
		let prevTime = Date.now();
		let deltaPosition = start - end;
		const animationLoop = () => {
			if (this._raf) {
				deltaPosition = easer.easeFrame(deltaPosition, Date.now() - prevTime);
				if (Math.abs(deltaPosition) < 1 && Math.abs(easer.velocity) < 50) {
					onUpdate(end);
					if (onComplete) onComplete();
					this.onFinish();
				} else {
					prevTime = Date.now();
					onUpdate(deltaPosition + end);
					this._raf = requestAnimationFrame(animationLoop);
				}
			}
		};
		this._raf = requestAnimationFrame(animationLoop);
	}
	destroy() {
		if (this._raf >= 0) cancelAnimationFrame(this._raf);
		this._raf = 0;
	}
};
/** @typedef {import('./css-animation.js').CssAnimationProps} CssAnimationProps */
/** @typedef {import('./spring-animation.js').SpringAnimationProps} SpringAnimationProps */
/** @typedef {Object} SharedAnimationProps
* @prop {string} [name]
* @prop {boolean} [isPan]
* @prop {boolean} [isMainScroll]
* @prop {VoidFunction} [onComplete]
* @prop {VoidFunction} [onFinish]
*/
/** @typedef {SpringAnimation | CSSAnimation} Animation */
/** @typedef {SpringAnimationProps | CssAnimationProps} AnimationProps */
/**
* Manages animations
*/
var Animations = class {
	constructor() {
		/** @type {Animation[]} */
		this.activeAnimations = [];
	}
	/**
	* @param {SpringAnimationProps} props
	*/
	startSpring(props) {
		this._start(props, true);
	}
	/**
	* @param {CssAnimationProps} props
	*/
	startTransition(props) {
		this._start(props);
	}
	/**
	* @private
	* @param {AnimationProps} props
	* @param {boolean} [isSpring]
	* @returns {Animation}
	*/
	_start(props, isSpring) {
		const animation = isSpring ? new SpringAnimation(
			/** @type SpringAnimationProps */
			props
		) : new CSSAnimation(
			/** @type CssAnimationProps */
			props
		);
		this.activeAnimations.push(animation);
		animation.onFinish = () => this.stop(animation);
		return animation;
	}
	/**
	* @param {Animation} animation
	*/
	stop(animation) {
		animation.destroy();
		const index = this.activeAnimations.indexOf(animation);
		if (index > -1) this.activeAnimations.splice(index, 1);
	}
	stopAll() {
		this.activeAnimations.forEach((animation) => {
			animation.destroy();
		});
		this.activeAnimations = [];
	}
	/**
	* Stop all pan or zoom transitions
	*/
	stopAllPan() {
		this.activeAnimations = this.activeAnimations.filter((animation) => {
			if (animation.props.isPan) {
				animation.destroy();
				return false;
			}
			return true;
		});
	}
	stopMainScroll() {
		this.activeAnimations = this.activeAnimations.filter((animation) => {
			if (animation.props.isMainScroll) {
				animation.destroy();
				return false;
			}
			return true;
		});
	}
	/**
	* Returns true if main scroll transition is running
	*/
	/**
	* Returns true if any pan or zoom transition is running
	*/
	isPanRunning() {
		return this.activeAnimations.some((animation) => {
			return animation.props.isPan;
		});
	}
};
/** @typedef {import('./photoswipe.js').default} PhotoSwipe */
/**
* Handles scroll wheel.
* Can pan and zoom current slide image.
*/
var ScrollWheel = class {
	/**
	* @param {PhotoSwipe} pswp
	*/
	constructor(pswp) {
		this.pswp = pswp;
		pswp.events.add(
			pswp.element,
			"wheel",
			/** @type EventListener */
			this._onWheel.bind(this)
		);
	}
	/**
	* @private
	* @param {WheelEvent} e
	*/
	_onWheel(e) {
		e.preventDefault();
		const { currSlide } = this.pswp;
		let { deltaX, deltaY } = e;
		if (!currSlide) return;
		if (this.pswp.dispatch("wheel", { originalEvent: e }).defaultPrevented) return;
		if (e.ctrlKey || this.pswp.options.wheelToZoom) {
			if (currSlide.isZoomable()) {
				let zoomFactor = -deltaY;
				if (e.deltaMode === 1) zoomFactor *= .05;
				else zoomFactor *= e.deltaMode ? 1 : .002;
				zoomFactor = 2 ** zoomFactor;
				const destZoomLevel = currSlide.currZoomLevel * zoomFactor;
				currSlide.zoomTo(destZoomLevel, {
					x: e.clientX,
					y: e.clientY
				});
			}
		} else if (currSlide.isPannable()) {
			if (e.deltaMode === 1) {
				deltaX *= 18;
				deltaY *= 18;
			}
			currSlide.panTo(currSlide.pan.x - deltaX, currSlide.pan.y - deltaY);
		}
	}
};
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/**
* @template T
* @typedef {import('../types.js').Methods<T>} Methods<T>
*/
/**
* @typedef {Object} UIElementMarkupProps
* @prop {boolean} [isCustomSVG]
* @prop {string} inner
* @prop {string} [outlineID]
* @prop {number | string} [size]
*/
/**
* @typedef {Object} UIElementData
* @prop {DefaultUIElements | string} [name]
* @prop {string} [className]
* @prop {UIElementMarkup} [html]
* @prop {boolean} [isButton]
* @prop {keyof HTMLElementTagNameMap} [tagName]
* @prop {string} [title]
* @prop {string} [ariaLabel]
* @prop {(element: HTMLElement, pswp: PhotoSwipe) => void} [onInit]
* @prop {Methods<PhotoSwipe> | ((e: MouseEvent, element: HTMLElement, pswp: PhotoSwipe) => void)} [onClick]
* @prop {'bar' | 'wrapper' | 'root'} [appendTo]
* @prop {number} [order]
*/
/** @typedef {'arrowPrev' | 'arrowNext' | 'close' | 'zoom' | 'counter'} DefaultUIElements */
/** @typedef {string | UIElementMarkupProps} UIElementMarkup */
/**
* @param {UIElementMarkup} [htmlData]
* @returns {string}
*/
function addElementHTML(htmlData) {
	if (typeof htmlData === "string") return htmlData;
	if (!htmlData || !htmlData.isCustomSVG) return "";
	const svgData = htmlData;
	let out = "<svg aria-hidden=\"true\" class=\"pswp__icn\" viewBox=\"0 0 %d %d\" width=\"%d\" height=\"%d\">";
	out = out.split("%d").join(
		/** @type {string} */
		svgData.size || 32
	);
	if (svgData.outlineID) out += "<use class=\"pswp__icn-shadow\" xlink:href=\"#" + svgData.outlineID + "\"/>";
	out += svgData.inner;
	out += "</svg>";
	return out;
}
var UIElement = class {
	/**
	* @param {PhotoSwipe} pswp
	* @param {UIElementData} data
	*/
	constructor(pswp, data) {
		var _container;
		const name = data.name || data.className;
		let elementHTML = data.html;
		if (pswp.options[name] === false) return;
		if (typeof pswp.options[name + "SVG"] === "string") elementHTML = pswp.options[name + "SVG"];
		pswp.dispatch("uiElementCreate", { data });
		let className = "";
		if (data.isButton) {
			className += "pswp__button ";
			className += data.className || `pswp__button--${data.name}`;
		} else className += data.className || `pswp__${data.name}`;
		let tagName = data.isButton ? data.tagName || "button" : data.tagName || "div";
		tagName = tagName.toLowerCase();
		/** @type {HTMLElement} */
		const element = createElement(className, tagName);
		if (data.isButton) {
			if (tagName === "button")
 /** @type {HTMLButtonElement} */
			element.type = "button";
			let { title } = data;
			const { ariaLabel } = data;
			if (typeof pswp.options[name + "Title"] === "string") title = pswp.options[name + "Title"];
			if (title) element.title = title;
			const ariaText = ariaLabel || title;
			if (ariaText) element.setAttribute("aria-label", ariaText);
		}
		element.innerHTML = addElementHTML(elementHTML);
		if (data.onInit) data.onInit(element, pswp);
		if (data.onClick) element.onclick = (e) => {
			if (typeof data.onClick === "string") pswp[data.onClick]();
			else if (typeof data.onClick === "function") data.onClick(e, element, pswp);
		};
		const appendTo = data.appendTo || "bar";
		/** @type {HTMLElement | undefined} root element by default */
		let container = pswp.element;
		if (appendTo === "bar") {
			if (!pswp.topBar) pswp.topBar = createElement("pswp__top-bar pswp__hide-on-close", "div", pswp.scrollWrap);
			container = pswp.topBar;
		} else {
			element.classList.add("pswp__hide-on-close");
			if (appendTo === "wrapper") container = pswp.scrollWrap;
		}
		(_container = container) === null || _container === void 0 || _container.appendChild(pswp.applyFilters("uiElement", element, data));
	}
};
/** @typedef {import('./ui-element.js').UIElementData} UIElementData */
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/**
*
* @param {HTMLElement} element
* @param {PhotoSwipe} pswp
* @param {boolean} [isNextButton]
*/
function initArrowButton(element, pswp, isNextButton) {
	element.classList.add("pswp__button--arrow");
	element.setAttribute("aria-controls", "pswp__items");
	pswp.on("change", () => {
		if (!pswp.options.loop) {
			if (isNextButton)
 /** @type {HTMLButtonElement} */
			element.disabled = !(pswp.currIndex < pswp.getNumItems() - 1);
			else
 /** @type {HTMLButtonElement} */
			element.disabled = !(pswp.currIndex > 0);
		}
	});
}
/** @type {UIElementData} */
const arrowPrev = {
	name: "arrowPrev",
	className: "pswp__button--arrow--prev",
	title: "Previous",
	order: 10,
	isButton: true,
	appendTo: "wrapper",
	html: {
		isCustomSVG: true,
		size: 60,
		inner: "<path d=\"M29 43l-3 3-16-16 16-16 3 3-13 13 13 13z\" id=\"pswp__icn-arrow\"/>",
		outlineID: "pswp__icn-arrow"
	},
	onClick: "prev",
	onInit: initArrowButton
};
/** @type {UIElementData} */
const arrowNext = {
	name: "arrowNext",
	className: "pswp__button--arrow--next",
	title: "Next",
	order: 11,
	isButton: true,
	appendTo: "wrapper",
	html: {
		isCustomSVG: true,
		size: 60,
		inner: "<use xlink:href=\"#pswp__icn-arrow\"/>",
		outlineID: "pswp__icn-arrow"
	},
	onClick: "next",
	onInit: (el, pswp) => {
		initArrowButton(el, pswp, true);
	}
};
/** @type {import('./ui-element.js').UIElementData} UIElementData */
const closeButton = {
	name: "close",
	title: "Close",
	order: 20,
	isButton: true,
	html: {
		isCustomSVG: true,
		inner: "<path d=\"M24 10l-2-2-6 6-6-6-2 2 6 6-6 6 2 2 6-6 6 6 2-2-6-6z\" id=\"pswp__icn-close\"/>",
		outlineID: "pswp__icn-close"
	},
	onClick: "close"
};
/** @type {import('./ui-element.js').UIElementData} UIElementData */
const zoomButton = {
	name: "zoom",
	title: "Zoom",
	order: 10,
	isButton: true,
	html: {
		isCustomSVG: true,
		inner: "<path d=\"M17.426 19.926a6 6 0 1 1 1.5-1.5L23 22.5 21.5 24l-4.074-4.074z\" id=\"pswp__icn-zoom\"/><path fill=\"currentColor\" class=\"pswp__zoom-icn-bar-h\" d=\"M11 16v-2h6v2z\"/><path fill=\"currentColor\" class=\"pswp__zoom-icn-bar-v\" d=\"M13 12h2v6h-2z\"/>",
		outlineID: "pswp__icn-zoom"
	},
	onClick: "toggleZoom"
};
/** @type {import('./ui-element.js').UIElementData} UIElementData */
const loadingIndicator = {
	name: "preloader",
	appendTo: "bar",
	order: 7,
	html: {
		isCustomSVG: true,
		inner: "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M21.2 16a5.2 5.2 0 1 1-5.2-5.2V8a8 8 0 1 0 8 8h-2.8Z\" id=\"pswp__icn-loading\"/>",
		outlineID: "pswp__icn-loading"
	},
	onInit: (indicatorElement, pswp) => {
		/** @type {boolean | undefined} */
		let isVisible;
		/** @type {NodeJS.Timeout | null} */
		let delayTimeout = null;
		/**
		* @param {string} className
		* @param {boolean} add
		*/
		const toggleIndicatorClass = (className, add) => {
			indicatorElement.classList.toggle("pswp__preloader--" + className, add);
		};
		/**
		* @param {boolean} visible
		*/
		const setIndicatorVisibility = (visible) => {
			if (isVisible !== visible) {
				isVisible = visible;
				toggleIndicatorClass("active", visible);
			}
		};
		const updatePreloaderVisibility = () => {
			var _pswp$currSlide;
			if (!((_pswp$currSlide = pswp.currSlide) !== null && _pswp$currSlide !== void 0 && _pswp$currSlide.content.isLoading())) {
				setIndicatorVisibility(false);
				if (delayTimeout) {
					clearTimeout(delayTimeout);
					delayTimeout = null;
				}
				return;
			}
			if (!delayTimeout) delayTimeout = setTimeout(() => {
				var _pswp$currSlide2;
				setIndicatorVisibility(Boolean((_pswp$currSlide2 = pswp.currSlide) === null || _pswp$currSlide2 === void 0 ? void 0 : _pswp$currSlide2.content.isLoading()));
				delayTimeout = null;
			}, pswp.options.preloaderDelay);
		};
		pswp.on("change", updatePreloaderVisibility);
		pswp.on("loadComplete", (e) => {
			if (pswp.currSlide === e.slide) updatePreloaderVisibility();
		});
		if (pswp.ui) pswp.ui.updatePreloaderVisibility = updatePreloaderVisibility;
	}
};
/** @type {import('./ui-element.js').UIElementData} UIElementData */
const counterIndicator = {
	name: "counter",
	order: 5,
	onInit: (counterElement, pswp) => {
		pswp.on("change", () => {
			counterElement.innerText = pswp.currIndex + 1 + pswp.options.indexIndicatorSep + pswp.getNumItems();
		});
	}
};
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/** @typedef {import('./ui-element.js').UIElementData} UIElementData */
/**
* Set special class on element when image is zoomed.
*
* By default, it is used to adjust
* zoom icon and zoom cursor via CSS.
*
* @param {HTMLElement} el
* @param {boolean} isZoomedIn
*/
function setZoomedIn(el, isZoomedIn) {
	el.classList.toggle("pswp--zoomed-in", isZoomedIn);
}
var UI = class {
	/**
	* @param {PhotoSwipe} pswp
	*/
	constructor(pswp) {
		this.pswp = pswp;
		this.isRegistered = false;
		/** @type {UIElementData[]} */
		this.uiElementsData = [];
		/** @type {(UIElement | UIElementData)[]} */
		this.items = [];
		/** @type {() => void} */
		this.updatePreloaderVisibility = () => {};
		/**
		* @private
		* @type {number | undefined}
		*/
		this._lastUpdatedZoomLevel = void 0;
	}
	init() {
		const { pswp } = this;
		this.isRegistered = false;
		this.uiElementsData = [
			closeButton,
			arrowPrev,
			arrowNext,
			zoomButton,
			loadingIndicator,
			counterIndicator
		];
		pswp.dispatch("uiRegister");
		this.uiElementsData.sort((a, b) => {
			return (a.order || 0) - (b.order || 0);
		});
		this.items = [];
		this.isRegistered = true;
		this.uiElementsData.forEach((uiElementData) => {
			this.registerElement(uiElementData);
		});
		pswp.on("change", () => {
			var _pswp$element;
			(_pswp$element = pswp.element) === null || _pswp$element === void 0 || _pswp$element.classList.toggle("pswp--one-slide", pswp.getNumItems() === 1);
		});
		pswp.on("zoomPanUpdate", () => this._onZoomPanUpdate());
	}
	/**
	* @param {UIElementData} elementData
	*/
	registerElement(elementData) {
		if (this.isRegistered) this.items.push(new UIElement(this.pswp, elementData));
		else this.uiElementsData.push(elementData);
	}
	/**
	* Fired each time zoom or pan position is changed.
	* Update classes that control visibility of zoom button and cursor icon.
	*
	* @private
	*/
	_onZoomPanUpdate() {
		const { template, currSlide, options } = this.pswp;
		if (this.pswp.opener.isClosing || !template || !currSlide) return;
		let { currZoomLevel } = currSlide;
		if (!this.pswp.opener.isOpen) currZoomLevel = currSlide.zoomLevels.initial;
		if (currZoomLevel === this._lastUpdatedZoomLevel) return;
		this._lastUpdatedZoomLevel = currZoomLevel;
		const currZoomLevelDiff = currSlide.zoomLevels.initial - currSlide.zoomLevels.secondary;
		if (Math.abs(currZoomLevelDiff) < .01 || !currSlide.isZoomable()) {
			setZoomedIn(template, false);
			template.classList.remove("pswp--zoom-allowed");
			return;
		}
		template.classList.add("pswp--zoom-allowed");
		setZoomedIn(template, (currZoomLevel === currSlide.zoomLevels.initial ? currSlide.zoomLevels.secondary : currSlide.zoomLevels.initial) <= currZoomLevel);
		if (options.imageClickAction === "zoom" || options.imageClickAction === "zoom-or-close") template.classList.add("pswp--click-to-zoom");
	}
};
/** @typedef {import('./slide.js').SlideData} SlideData */
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/** @typedef {{ x: number; y: number; w: number; innerRect?: { w: number; h: number; x: number; y: number } }} Bounds */
/**
* @param {HTMLElement} el
* @returns Bounds
*/
function getBoundsByElement(el) {
	const thumbAreaRect = el.getBoundingClientRect();
	return {
		x: thumbAreaRect.left,
		y: thumbAreaRect.top,
		w: thumbAreaRect.width
	};
}
/**
* @param {HTMLElement} el
* @param {number} imageWidth
* @param {number} imageHeight
* @returns Bounds
*/
function getCroppedBoundsByElement(el, imageWidth, imageHeight) {
	const thumbAreaRect = el.getBoundingClientRect();
	const hRatio = thumbAreaRect.width / imageWidth;
	const vRatio = thumbAreaRect.height / imageHeight;
	const fillZoomLevel = hRatio > vRatio ? hRatio : vRatio;
	const offsetX = (thumbAreaRect.width - imageWidth * fillZoomLevel) / 2;
	const offsetY = (thumbAreaRect.height - imageHeight * fillZoomLevel) / 2;
	/**
	* Coordinates of the image,
	* as if it was not cropped,
	* height is calculated automatically
	*
	* @type {Bounds}
	*/
	const bounds = {
		x: thumbAreaRect.left + offsetX,
		y: thumbAreaRect.top + offsetY,
		w: imageWidth * fillZoomLevel
	};
	bounds.innerRect = {
		w: thumbAreaRect.width,
		h: thumbAreaRect.height,
		x: offsetX,
		y: offsetY
	};
	return bounds;
}
/**
* Get dimensions of thumbnail image
* (click on which opens photoswipe or closes photoswipe to)
*
* @param {number} index
* @param {SlideData} itemData
* @param {PhotoSwipe} instance PhotoSwipe instance
* @returns {Bounds | undefined}
*/
function getThumbBounds(index, itemData, instance) {
	const event = instance.dispatch("thumbBounds", {
		index,
		itemData,
		instance
	});
	if (event.thumbBounds) return event.thumbBounds;
	const { element } = itemData;
	/** @type {Bounds | undefined} */
	let thumbBounds;
	/** @type {HTMLElement | null | undefined} */
	let thumbnail;
	if (element && instance.options.thumbSelector !== false) {
		const thumbSelector = instance.options.thumbSelector || "img";
		thumbnail = element.matches(thumbSelector) ? element : 
		/** @type {HTMLElement | null} */
		element.querySelector(thumbSelector);
	}
	thumbnail = instance.applyFilters("thumbEl", thumbnail, itemData, index);
	if (thumbnail) {
		if (!itemData.thumbCropped) thumbBounds = getBoundsByElement(thumbnail);
		else thumbBounds = getCroppedBoundsByElement(thumbnail, itemData.width || itemData.w || 0, itemData.height || itemData.h || 0);
	}
	return instance.applyFilters("thumbBounds", thumbBounds, itemData, index);
}
/** @typedef {import('../lightbox/lightbox.js').default} PhotoSwipeLightbox */
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/** @typedef {import('../photoswipe.js').PhotoSwipeOptions} PhotoSwipeOptions */
/** @typedef {import('../photoswipe.js').DataSource} DataSource */
/** @typedef {import('../ui/ui-element.js').UIElementData} UIElementData */
/** @typedef {import('../slide/content.js').default} ContentDefault */
/** @typedef {import('../slide/slide.js').default} Slide */
/** @typedef {import('../slide/slide.js').SlideData} SlideData */
/** @typedef {import('../slide/zoom-level.js').default} ZoomLevel */
/** @typedef {import('../slide/get-thumb-bounds.js').Bounds} Bounds */
/**
* Allow adding an arbitrary props to the Content
* https://photoswipe.com/custom-content/#using-webp-image-format
* @typedef {ContentDefault & Record<string, any>} Content
*/
/** @typedef {{ x?: number; y?: number }} Point */
/**
* @typedef {Object} PhotoSwipeEventsMap https://photoswipe.com/events/
*
*
* https://photoswipe.com/adding-ui-elements/
*
* @prop {undefined} uiRegister
* @prop {{ data: UIElementData }} uiElementCreate
*
*
* https://photoswipe.com/events/#initialization-events
*
* @prop {undefined} beforeOpen
* @prop {undefined} firstUpdate
* @prop {undefined} initialLayout
* @prop {undefined} change
* @prop {undefined} afterInit
* @prop {undefined} bindEvents
*
*
* https://photoswipe.com/events/#opening-or-closing-transition-events
*
* @prop {undefined} openingAnimationStart
* @prop {undefined} openingAnimationEnd
* @prop {undefined} closingAnimationStart
* @prop {undefined} closingAnimationEnd
*
*
* https://photoswipe.com/events/#closing-events
*
* @prop {undefined} close
* @prop {undefined} destroy
*
*
* https://photoswipe.com/events/#pointer-and-gesture-events
*
* @prop {{ originalEvent: PointerEvent }} pointerDown
* @prop {{ originalEvent: PointerEvent }} pointerMove
* @prop {{ originalEvent: PointerEvent }} pointerUp
* @prop {{ bgOpacity: number }} pinchClose can be default prevented
* @prop {{ panY: number }} verticalDrag can be default prevented
*
*
* https://photoswipe.com/events/#slide-content-events
*
* @prop {{ content: Content }} contentInit
* @prop {{ content: Content; isLazy: boolean }} contentLoad can be default prevented
* @prop {{ content: Content; isLazy: boolean }} contentLoadImage can be default prevented
* @prop {{ content: Content; slide: Slide; isError?: boolean }} loadComplete
* @prop {{ content: Content; slide: Slide }} loadError
* @prop {{ content: Content; width: number; height: number }} contentResize can be default prevented
* @prop {{ content: Content; width: number; height: number; slide: Slide }} imageSizeChange
* @prop {{ content: Content }} contentLazyLoad can be default prevented
* @prop {{ content: Content }} contentAppend can be default prevented
* @prop {{ content: Content }} contentActivate can be default prevented
* @prop {{ content: Content }} contentDeactivate can be default prevented
* @prop {{ content: Content }} contentRemove can be default prevented
* @prop {{ content: Content }} contentDestroy can be default prevented
*
*
* undocumented
*
* @prop {{ point: Point; originalEvent: PointerEvent }} imageClickAction can be default prevented
* @prop {{ point: Point; originalEvent: PointerEvent }} bgClickAction can be default prevented
* @prop {{ point: Point; originalEvent: PointerEvent }} tapAction can be default prevented
* @prop {{ point: Point; originalEvent: PointerEvent }} doubleTapAction can be default prevented
*
* @prop {{ originalEvent: KeyboardEvent }} keydown can be default prevented
* @prop {{ x: number; dragging: boolean }} moveMainScroll
* @prop {{ slide: Slide }} firstZoomPan
* @prop {{ slide: Slide | undefined, data: SlideData, index: number }} gettingData
* @prop {undefined} beforeResize
* @prop {undefined} resize
* @prop {undefined} viewportSize
* @prop {undefined} updateScrollOffset
* @prop {{ slide: Slide }} slideInit
* @prop {{ slide: Slide }} afterSetContent
* @prop {{ slide: Slide }} slideLoad
* @prop {{ slide: Slide }} appendHeavy can be default prevented
* @prop {{ slide: Slide }} appendHeavyContent
* @prop {{ slide: Slide }} slideActivate
* @prop {{ slide: Slide }} slideDeactivate
* @prop {{ slide: Slide }} slideDestroy
* @prop {{ destZoomLevel: number, centerPoint: Point | undefined, transitionDuration: number | false | undefined }} beforeZoomTo
* @prop {{ slide: Slide }} zoomPanUpdate
* @prop {{ slide: Slide }} initialZoomPan
* @prop {{ slide: Slide }} calcSlideSize
* @prop {undefined} resolutionChanged
* @prop {{ originalEvent: WheelEvent }} wheel can be default prevented
* @prop {{ content: Content }} contentAppendImage can be default prevented
* @prop {{ index: number; itemData: SlideData }} lazyLoadSlide can be default prevented
* @prop {undefined} lazyLoad
* @prop {{ slide: Slide }} calcBounds
* @prop {{ zoomLevels: ZoomLevel, slideData: SlideData }} zoomLevelsUpdate
*
*
* legacy
*
* @prop {undefined} init
* @prop {undefined} initialZoomIn
* @prop {undefined} initialZoomOut
* @prop {undefined} initialZoomInEnd
* @prop {undefined} initialZoomOutEnd
* @prop {{ dataSource: DataSource | undefined, numItems: number }} numItems
* @prop {{ itemData: SlideData; index: number }} itemData
* @prop {{ index: number, itemData: SlideData, instance: PhotoSwipe }} thumbBounds
*/
/**
* @typedef {Object} PhotoSwipeFiltersMap https://photoswipe.com/filters/
*
* @prop {(numItems: number, dataSource: DataSource | undefined) => number} numItems
* Modify the total amount of slides. Example on Data sources page.
* https://photoswipe.com/filters/#numitems
*
* @prop {(itemData: SlideData, index: number) => SlideData} itemData
* Modify slide item data. Example on Data sources page.
* https://photoswipe.com/filters/#itemdata
*
* @prop {(itemData: SlideData, element: HTMLElement, linkEl: HTMLAnchorElement) => SlideData} domItemData
* Modify item data when it's parsed from DOM element. Example on Data sources page.
* https://photoswipe.com/filters/#domitemdata
*
* @prop {(clickedIndex: number, e: MouseEvent, instance: PhotoSwipeLightbox) => number} clickedIndex
* Modify clicked gallery item index.
* https://photoswipe.com/filters/#clickedindex
*
* @prop {(placeholderSrc: string | false, content: Content) => string | false} placeholderSrc
* Modify placeholder image source.
* https://photoswipe.com/filters/#placeholdersrc
*
* @prop {(isContentLoading: boolean, content: Content) => boolean} isContentLoading
* Modify if the content is currently loading.
* https://photoswipe.com/filters/#iscontentloading
*
* @prop {(isContentZoomable: boolean, content: Content) => boolean} isContentZoomable
* Modify if the content can be zoomed.
* https://photoswipe.com/filters/#iscontentzoomable
*
* @prop {(useContentPlaceholder: boolean, content: Content) => boolean} useContentPlaceholder
* Modify if the placeholder should be used for the content.
* https://photoswipe.com/filters/#usecontentplaceholder
*
* @prop {(isKeepingPlaceholder: boolean, content: Content) => boolean} isKeepingPlaceholder
* Modify if the placeholder should be kept after the content is loaded.
* https://photoswipe.com/filters/#iskeepingplaceholder
*
*
* @prop {(contentErrorElement: HTMLElement, content: Content) => HTMLElement} contentErrorElement
* Modify an element when the content has error state (for example, if image cannot be loaded).
* https://photoswipe.com/filters/#contenterrorelement
*
* @prop {(element: HTMLElement, data: UIElementData) => HTMLElement} uiElement
* Modify a UI element that's being created.
* https://photoswipe.com/filters/#uielement
*
* @prop {(thumbnail: HTMLElement | null | undefined, itemData: SlideData, index: number) => HTMLElement} thumbEl
* Modify the thumbnail element from which opening zoom animation starts or ends.
* https://photoswipe.com/filters/#thumbel
*
* @prop {(thumbBounds: Bounds | undefined, itemData: SlideData, index: number) => Bounds} thumbBounds
* Modify the thumbnail bounds from which opening zoom animation starts or ends.
* https://photoswipe.com/filters/#thumbbounds
*
* @prop {(srcsetSizesWidth: number, content: Content) => number} srcsetSizesWidth
*
* @prop {(preventPointerEvent: boolean, event: PointerEvent, pointerType: string) => boolean} preventPointerEvent
*
*/
/**
* @template {keyof PhotoSwipeFiltersMap} T
* @typedef {{ fn: PhotoSwipeFiltersMap[T], priority: number }} Filter
*/
/**
* @template {keyof PhotoSwipeEventsMap} T
* @typedef {PhotoSwipeEventsMap[T] extends undefined ? PhotoSwipeEvent<T> : PhotoSwipeEvent<T> & PhotoSwipeEventsMap[T]} AugmentedEvent
*/
/**
* @template {keyof PhotoSwipeEventsMap} T
* @typedef {(event: AugmentedEvent<T>) => void} EventCallback
*/
/**
* Base PhotoSwipe event object
*
* @template {keyof PhotoSwipeEventsMap} T
*/
var PhotoSwipeEvent = class {
	/**
	* @param {T} type
	* @param {PhotoSwipeEventsMap[T]} [details]
	*/
	constructor(type, details) {
		this.type = type;
		this.defaultPrevented = false;
		if (details) Object.assign(this, details);
	}
	preventDefault() {
		this.defaultPrevented = true;
	}
};
/**
* PhotoSwipe base class that can listen and dispatch for events.
* Shared by PhotoSwipe Core and PhotoSwipe Lightbox, extended by base.js
*/
var Eventable = class {
	constructor() {
		/**
		* @type {{ [T in keyof PhotoSwipeEventsMap]?: ((event: AugmentedEvent<T>) => void)[] }}
		*/
		this._listeners = {};
		/**
		* @type {{ [T in keyof PhotoSwipeFiltersMap]?: Filter<T>[] }}
		*/
		this._filters = {};
		/** @type {PhotoSwipe | undefined} */
		this.pswp = void 0;
		/** @type {PhotoSwipeOptions | undefined} */
		this.options = void 0;
	}
	/**
	* @template {keyof PhotoSwipeFiltersMap} T
	* @param {T} name
	* @param {PhotoSwipeFiltersMap[T]} fn
	* @param {number} priority
	*/
	addFilter(name, fn, priority = 100) {
		var _this$_filters$name, _this$_filters$name2, _this$pswp;
		if (!this._filters[name]) this._filters[name] = [];
		(_this$_filters$name = this._filters[name]) === null || _this$_filters$name === void 0 || _this$_filters$name.push({
			fn,
			priority
		});
		(_this$_filters$name2 = this._filters[name]) === null || _this$_filters$name2 === void 0 || _this$_filters$name2.sort((f1, f2) => f1.priority - f2.priority);
		(_this$pswp = this.pswp) === null || _this$pswp === void 0 || _this$pswp.addFilter(name, fn, priority);
	}
	/**
	* @template {keyof PhotoSwipeFiltersMap} T
	* @param {T} name
	* @param {PhotoSwipeFiltersMap[T]} fn
	*/
	removeFilter(name, fn) {
		if (this._filters[name]) this._filters[name] = this._filters[name].filter((filter) => filter.fn !== fn);
		if (this.pswp) this.pswp.removeFilter(name, fn);
	}
	/**
	* @template {keyof PhotoSwipeFiltersMap} T
	* @param {T} name
	* @param {Parameters<PhotoSwipeFiltersMap[T]>} args
	* @returns {Parameters<PhotoSwipeFiltersMap[T]>[0]}
	*/
	applyFilters(name, ...args) {
		var _this$_filters$name3;
		(_this$_filters$name3 = this._filters[name]) === null || _this$_filters$name3 === void 0 || _this$_filters$name3.forEach((filter) => {
			args[0] = filter.fn.apply(this, args);
		});
		return args[0];
	}
	/**
	* @template {keyof PhotoSwipeEventsMap} T
	* @param {T} name
	* @param {EventCallback<T>} fn
	*/
	on(name, fn) {
		var _this$_listeners$name, _this$pswp2;
		if (!this._listeners[name]) this._listeners[name] = [];
		(_this$_listeners$name = this._listeners[name]) === null || _this$_listeners$name === void 0 || _this$_listeners$name.push(fn);
		(_this$pswp2 = this.pswp) === null || _this$pswp2 === void 0 || _this$pswp2.on(name, fn);
	}
	/**
	* @template {keyof PhotoSwipeEventsMap} T
	* @param {T} name
	* @param {EventCallback<T>} fn
	*/
	off(name, fn) {
		var _this$pswp3;
		if (this._listeners[name]) this._listeners[name] = this._listeners[name].filter((listener) => fn !== listener);
		(_this$pswp3 = this.pswp) === null || _this$pswp3 === void 0 || _this$pswp3.off(name, fn);
	}
	/**
	* @template {keyof PhotoSwipeEventsMap} T
	* @param {T} name
	* @param {PhotoSwipeEventsMap[T]} [details]
	* @returns {AugmentedEvent<T>}
	*/
	dispatch(name, details) {
		var _this$_listeners$name2;
		if (this.pswp) return this.pswp.dispatch(name, details);
		const event = new PhotoSwipeEvent(name, details);
		(_this$_listeners$name2 = this._listeners[name]) === null || _this$_listeners$name2 === void 0 || _this$_listeners$name2.forEach((listener) => {
			listener.call(this, event);
		});
		return event;
	}
};
var Placeholder = class {
	/**
	* @param {string | false} imageSrc
	* @param {HTMLElement} container
	*/
	constructor(imageSrc, container) {
		/** @type {HTMLImageElement | HTMLDivElement | null} */
		this.element = createElement("pswp__img pswp__img--placeholder", imageSrc ? "img" : "div", container);
		if (imageSrc) {
			const imgEl = this.element;
			imgEl.decoding = "async";
			imgEl.alt = "";
			imgEl.src = imageSrc;
			imgEl.setAttribute("role", "presentation");
		}
		this.element.setAttribute("aria-hidden", "true");
	}
	/**
	* @param {number} width
	* @param {number} height
	*/
	setDisplayedSize(width, height) {
		if (!this.element) return;
		if (this.element.tagName === "IMG") {
			setWidthHeight(this.element, 250, "auto");
			this.element.style.transformOrigin = "0 0";
			this.element.style.transform = toTransformString(0, 0, width / 250);
		} else setWidthHeight(this.element, width, height);
	}
	destroy() {
		var _this$element;
		if ((_this$element = this.element) !== null && _this$element !== void 0 && _this$element.parentNode) this.element.remove();
		this.element = null;
	}
};
/** @typedef {import('./slide.js').default} Slide */
/** @typedef {import('./slide.js').SlideData} SlideData */
/** @typedef {import('../core/base.js').default} PhotoSwipeBase */
/** @typedef {import('../util/util.js').LoadState} LoadState */
var Content = class {
	/**
	* @param {SlideData} itemData Slide data
	* @param {PhotoSwipeBase} instance PhotoSwipe or PhotoSwipeLightbox instance
	* @param {number} index
	*/
	constructor(itemData, instance, index) {
		this.instance = instance;
		this.data = itemData;
		this.index = index;
		/** @type {HTMLImageElement | HTMLDivElement | undefined} */
		this.element = void 0;
		/** @type {Placeholder | undefined} */
		this.placeholder = void 0;
		/** @type {Slide | undefined} */
		this.slide = void 0;
		this.displayedImageWidth = 0;
		this.displayedImageHeight = 0;
		this.width = Number(this.data.w) || Number(this.data.width) || 0;
		this.height = Number(this.data.h) || Number(this.data.height) || 0;
		this.isAttached = false;
		this.hasSlide = false;
		this.isDecoding = false;
		/** @type {LoadState} */
		this.state = LOAD_STATE.IDLE;
		if (this.data.type) this.type = this.data.type;
		else if (this.data.src) this.type = "image";
		else this.type = "html";
		this.instance.dispatch("contentInit", { content: this });
	}
	removePlaceholder() {
		if (this.placeholder && !this.keepPlaceholder()) setTimeout(() => {
			if (this.placeholder) {
				this.placeholder.destroy();
				this.placeholder = void 0;
			}
		}, 1e3);
	}
	/**
	* Preload content
	*
	* @param {boolean} isLazy
	* @param {boolean} [reload]
	*/
	load(isLazy, reload) {
		if (this.slide && this.usePlaceholder()) {
			if (!this.placeholder) {
				const placeholderSrc = this.instance.applyFilters("placeholderSrc", this.data.msrc && this.slide.isFirstSlide ? this.data.msrc : false, this);
				this.placeholder = new Placeholder(placeholderSrc, this.slide.container);
			} else {
				const placeholderEl = this.placeholder.element;
				if (placeholderEl && !placeholderEl.parentElement) this.slide.container.prepend(placeholderEl);
			}
		}
		if (this.element && !reload) return;
		if (this.instance.dispatch("contentLoad", {
			content: this,
			isLazy
		}).defaultPrevented) return;
		if (this.isImageContent()) {
			this.element = createElement("pswp__img", "img");
			if (this.displayedImageWidth) this.loadImage(isLazy);
		} else {
			this.element = createElement("pswp__content", "div");
			this.element.innerHTML = this.data.html || "";
		}
		if (reload && this.slide) this.slide.updateContentSize(true);
	}
	/**
	* Preload image
	*
	* @param {boolean} isLazy
	*/
	loadImage(isLazy) {
		var _this$data$src, _this$data$alt;
		if (!this.isImageContent() || !this.element || this.instance.dispatch("contentLoadImage", {
			content: this,
			isLazy
		}).defaultPrevented) return;
		const imageElement = this.element;
		this.updateSrcsetSizes();
		if (this.data.srcset) imageElement.srcset = this.data.srcset;
		imageElement.src = (_this$data$src = this.data.src) !== null && _this$data$src !== void 0 ? _this$data$src : "";
		imageElement.alt = (_this$data$alt = this.data.alt) !== null && _this$data$alt !== void 0 ? _this$data$alt : "";
		this.state = LOAD_STATE.LOADING;
		if (imageElement.complete) this.onLoaded();
		else {
			imageElement.onload = () => {
				this.onLoaded();
			};
			imageElement.onerror = () => {
				this.onError();
			};
		}
	}
	/**
	* Assign slide to content
	*
	* @param {Slide} slide
	*/
	setSlide(slide) {
		this.slide = slide;
		this.hasSlide = true;
		this.instance = slide.pswp;
	}
	/**
	* Content load success handler
	*/
	onLoaded() {
		this.state = LOAD_STATE.LOADED;
		if (this.slide && this.element) {
			this.instance.dispatch("loadComplete", {
				slide: this.slide,
				content: this
			});
			if (this.slide.isActive && this.slide.heavyAppended && !this.element.parentNode) {
				this.append();
				this.slide.updateContentSize(true);
			}
			if (this.state === LOAD_STATE.LOADED || this.state === LOAD_STATE.ERROR) this.removePlaceholder();
		}
	}
	/**
	* Content load error handler
	*/
	onError() {
		this.state = LOAD_STATE.ERROR;
		if (this.slide) {
			this.displayError();
			this.instance.dispatch("loadComplete", {
				slide: this.slide,
				isError: true,
				content: this
			});
			this.instance.dispatch("loadError", {
				slide: this.slide,
				content: this
			});
		}
	}
	/**
	* @returns {Boolean} If the content is currently loading
	*/
	isLoading() {
		return this.instance.applyFilters("isContentLoading", this.state === LOAD_STATE.LOADING, this);
	}
	/**
	* @returns {Boolean} If the content is in error state
	*/
	isError() {
		return this.state === LOAD_STATE.ERROR;
	}
	/**
	* @returns {boolean} If the content is image
	*/
	isImageContent() {
		return this.type === "image";
	}
	/**
	* Update content size
	*
	* @param {Number} width
	* @param {Number} height
	*/
	setDisplayedSize(width, height) {
		if (!this.element) return;
		if (this.placeholder) this.placeholder.setDisplayedSize(width, height);
		if (this.instance.dispatch("contentResize", {
			content: this,
			width,
			height
		}).defaultPrevented) return;
		setWidthHeight(this.element, width, height);
		if (this.isImageContent() && !this.isError()) {
			const isInitialSizeUpdate = !this.displayedImageWidth && width;
			this.displayedImageWidth = width;
			this.displayedImageHeight = height;
			if (isInitialSizeUpdate) this.loadImage(false);
			else this.updateSrcsetSizes();
			if (this.slide) this.instance.dispatch("imageSizeChange", {
				slide: this.slide,
				width,
				height,
				content: this
			});
		}
	}
	/**
	* @returns {boolean} If the content can be zoomed
	*/
	isZoomable() {
		return this.instance.applyFilters("isContentZoomable", this.isImageContent() && this.state !== LOAD_STATE.ERROR, this);
	}
	/**
	* Update image srcset sizes attribute based on width and height
	*/
	updateSrcsetSizes() {
		if (!this.isImageContent() || !this.element || !this.data.srcset) return;
		const image = this.element;
		const sizesWidth = this.instance.applyFilters("srcsetSizesWidth", this.displayedImageWidth, this);
		if (!image.dataset.largestUsedSize || sizesWidth > parseInt(image.dataset.largestUsedSize, 10)) {
			image.sizes = sizesWidth + "px";
			image.dataset.largestUsedSize = String(sizesWidth);
		}
	}
	/**
	* @returns {boolean} If content should use a placeholder (from msrc by default)
	*/
	usePlaceholder() {
		return this.instance.applyFilters("useContentPlaceholder", this.isImageContent(), this);
	}
	/**
	* Preload content with lazy-loading param
	*/
	lazyLoad() {
		if (this.instance.dispatch("contentLazyLoad", { content: this }).defaultPrevented) return;
		this.load(true);
	}
	/**
	* @returns {boolean} If placeholder should be kept after content is loaded
	*/
	keepPlaceholder() {
		return this.instance.applyFilters("isKeepingPlaceholder", this.isLoading(), this);
	}
	/**
	* Destroy the content
	*/
	destroy() {
		this.hasSlide = false;
		this.slide = void 0;
		if (this.instance.dispatch("contentDestroy", { content: this }).defaultPrevented) return;
		this.remove();
		if (this.placeholder) {
			this.placeholder.destroy();
			this.placeholder = void 0;
		}
		if (this.isImageContent() && this.element) {
			this.element.onload = null;
			this.element.onerror = null;
			this.element = void 0;
		}
	}
	/**
	* Display error message
	*/
	displayError() {
		if (this.slide) {
			var _this$instance$option, _this$instance$option2;
			let errorMsgEl = createElement("pswp__error-msg", "div");
			errorMsgEl.innerText = (_this$instance$option = (_this$instance$option2 = this.instance.options) === null || _this$instance$option2 === void 0 ? void 0 : _this$instance$option2.errorMsg) !== null && _this$instance$option !== void 0 ? _this$instance$option : "";
			errorMsgEl = this.instance.applyFilters("contentErrorElement", errorMsgEl, this);
			this.element = createElement("pswp__content pswp__error-msg-container", "div");
			this.element.appendChild(errorMsgEl);
			this.slide.container.innerText = "";
			this.slide.container.appendChild(this.element);
			this.slide.updateContentSize(true);
			this.removePlaceholder();
		}
	}
	/**
	* Append the content
	*/
	append() {
		if (this.isAttached || !this.element) return;
		this.isAttached = true;
		if (this.state === LOAD_STATE.ERROR) {
			this.displayError();
			return;
		}
		if (this.instance.dispatch("contentAppend", { content: this }).defaultPrevented) return;
		const supportsDecode = "decode" in this.element;
		if (this.isImageContent()) {
			if (supportsDecode && this.slide && (!this.slide.isActive || isSafari())) {
				this.isDecoding = true;
				/** @type {HTMLImageElement} */
				this.element.decode().catch(() => {}).finally(() => {
					this.isDecoding = false;
					this.appendImage();
				});
			} else this.appendImage();
		} else if (this.slide && !this.element.parentNode) this.slide.container.appendChild(this.element);
	}
	/**
	* Activate the slide,
	* active slide is generally the current one,
	* meaning the user can see it.
	*/
	activate() {
		if (this.instance.dispatch("contentActivate", { content: this }).defaultPrevented || !this.slide) return;
		if (this.isImageContent() && this.isDecoding && !isSafari()) this.appendImage();
		else if (this.isError()) this.load(false, true);
		if (this.slide.holderElement) this.slide.holderElement.setAttribute("aria-hidden", "false");
	}
	/**
	* Deactivate the content
	*/
	deactivate() {
		this.instance.dispatch("contentDeactivate", { content: this });
		if (this.slide && this.slide.holderElement) this.slide.holderElement.setAttribute("aria-hidden", "true");
	}
	/**
	* Remove the content from DOM
	*/
	remove() {
		this.isAttached = false;
		if (this.instance.dispatch("contentRemove", { content: this }).defaultPrevented) return;
		if (this.element && this.element.parentNode) this.element.remove();
		if (this.placeholder && this.placeholder.element) this.placeholder.element.remove();
	}
	/**
	* Append the image content to slide container
	*/
	appendImage() {
		if (!this.isAttached) return;
		if (this.instance.dispatch("contentAppendImage", { content: this }).defaultPrevented) return;
		if (this.slide && this.element && !this.element.parentNode) this.slide.container.appendChild(this.element);
		if (this.state === LOAD_STATE.LOADED || this.state === LOAD_STATE.ERROR) this.removePlaceholder();
	}
};
/** @typedef {import('./content.js').default} Content */
/** @typedef {import('./slide.js').default} Slide */
/** @typedef {import('./slide.js').SlideData} SlideData */
/** @typedef {import('../core/base.js').default} PhotoSwipeBase */
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
const MIN_SLIDES_TO_CACHE = 5;
/**
* Lazy-load an image
* This function is used both by Lightbox and PhotoSwipe core,
* thus it can be called before dialog is opened.
*
* @param {SlideData} itemData Data about the slide
* @param {PhotoSwipeBase} instance PhotoSwipe or PhotoSwipeLightbox instance
* @param {number} index
* @returns {Content} Image that is being decoded or false.
*/
function lazyLoadData(itemData, instance, index) {
	const content = instance.createContentFromData(itemData, index);
	/** @type {ZoomLevel | undefined} */
	let zoomLevel;
	const { options } = instance;
	if (options) {
		zoomLevel = new ZoomLevel(options, itemData, -1);
		let viewportSize;
		if (instance.pswp) viewportSize = instance.pswp.viewportSize;
		else viewportSize = getViewportSize(options, instance);
		const panAreaSize = getPanAreaSize(options, viewportSize, itemData, index);
		zoomLevel.update(content.width, content.height, panAreaSize);
	}
	content.lazyLoad();
	if (zoomLevel) content.setDisplayedSize(Math.ceil(content.width * zoomLevel.initial), Math.ceil(content.height * zoomLevel.initial));
	return content;
}
/**
* Lazy-loads specific slide.
* This function is used both by Lightbox and PhotoSwipe core,
* thus it can be called before dialog is opened.
*
* By default, it loads image based on viewport size and initial zoom level.
*
* @param {number} index Slide index
* @param {PhotoSwipeBase} instance PhotoSwipe or PhotoSwipeLightbox eventable instance
* @returns {Content | undefined}
*/
function lazyLoadSlide(index, instance) {
	const itemData = instance.getItemData(index);
	if (instance.dispatch("lazyLoadSlide", {
		index,
		itemData
	}).defaultPrevented) return;
	return lazyLoadData(itemData, instance, index);
}
var ContentLoader = class {
	/**
	* @param {PhotoSwipe} pswp
	*/
	constructor(pswp) {
		this.pswp = pswp;
		this.limit = Math.max(pswp.options.preload[0] + pswp.options.preload[1] + 1, MIN_SLIDES_TO_CACHE);
		/** @type {Content[]} */
		this._cachedItems = [];
	}
	/**
	* Lazy load nearby slides based on `preload` option.
	*
	* @param {number} [diff] Difference between slide indexes that was changed recently, or 0.
	*/
	updateLazy(diff) {
		const { pswp } = this;
		if (pswp.dispatch("lazyLoad").defaultPrevented) return;
		const { preload } = pswp.options;
		const isForward = diff === void 0 ? true : diff >= 0;
		let i;
		for (i = 0; i <= preload[1]; i++) this.loadSlideByIndex(pswp.currIndex + (isForward ? i : -i));
		for (i = 1; i <= preload[0]; i++) this.loadSlideByIndex(pswp.currIndex + (isForward ? -i : i));
	}
	/**
	* @param {number} initialIndex
	*/
	loadSlideByIndex(initialIndex) {
		const index = this.pswp.getLoopedIndex(initialIndex);
		let content = this.getContentByIndex(index);
		if (!content) {
			content = lazyLoadSlide(index, this.pswp);
			if (content) this.addToCache(content);
		}
	}
	/**
	* @param {Slide} slide
	* @returns {Content}
	*/
	getContentBySlide(slide) {
		let content = this.getContentByIndex(slide.index);
		if (!content) {
			content = this.pswp.createContentFromData(slide.data, slide.index);
			this.addToCache(content);
		}
		content.setSlide(slide);
		return content;
	}
	/**
	* @param {Content} content
	*/
	addToCache(content) {
		this.removeByIndex(content.index);
		this._cachedItems.push(content);
		if (this._cachedItems.length > this.limit) {
			const indexToRemove = this._cachedItems.findIndex((item) => {
				return !item.isAttached && !item.hasSlide;
			});
			if (indexToRemove !== -1) this._cachedItems.splice(indexToRemove, 1)[0].destroy();
		}
	}
	/**
	* Removes an image from cache, does not destroy() it, just removes.
	*
	* @param {number} index
	*/
	removeByIndex(index) {
		const indexToRemove = this._cachedItems.findIndex((item) => item.index === index);
		if (indexToRemove !== -1) this._cachedItems.splice(indexToRemove, 1);
	}
	/**
	* @param {number} index
	* @returns {Content | undefined}
	*/
	getContentByIndex(index) {
		return this._cachedItems.find((content) => content.index === index);
	}
	destroy() {
		this._cachedItems.forEach((content) => content.destroy());
		this._cachedItems = [];
	}
};
/** @typedef {import("../photoswipe.js").default} PhotoSwipe */
/** @typedef {import("../slide/slide.js").SlideData} SlideData */
/**
* PhotoSwipe base class that can retrieve data about every slide.
* Shared by PhotoSwipe Core and PhotoSwipe Lightbox
*/
var PhotoSwipeBase = class extends Eventable {
	/**
	* Get total number of slides
	*
	* @returns {number}
	*/
	getNumItems() {
		var _this$options;
		let numItems = 0;
		const dataSource = (_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.dataSource;
		if (dataSource && "length" in dataSource) numItems = dataSource.length;
		else if (dataSource && "gallery" in dataSource) {
			if (!dataSource.items) dataSource.items = this._getGalleryDOMElements(dataSource.gallery);
			if (dataSource.items) numItems = dataSource.items.length;
		}
		const event = this.dispatch("numItems", {
			dataSource,
			numItems
		});
		return this.applyFilters("numItems", event.numItems, dataSource);
	}
	/**
	* @param {SlideData} slideData
	* @param {number} index
	* @returns {Content}
	*/
	createContentFromData(slideData, index) {
		return new Content(slideData, this, index);
	}
	/**
	* Get item data by index.
	*
	* "item data" should contain normalized information that PhotoSwipe needs to generate a slide.
	* For example, it may contain properties like
	* `src`, `srcset`, `w`, `h`, which will be used to generate a slide with image.
	*
	* @param {number} index
	* @returns {SlideData}
	*/
	getItemData(index) {
		var _this$options2;
		const dataSource = (_this$options2 = this.options) === null || _this$options2 === void 0 ? void 0 : _this$options2.dataSource;
		/** @type {SlideData | HTMLElement} */
		let dataSourceItem = {};
		if (Array.isArray(dataSource)) dataSourceItem = dataSource[index];
		else if (dataSource && "gallery" in dataSource) {
			if (!dataSource.items) dataSource.items = this._getGalleryDOMElements(dataSource.gallery);
			dataSourceItem = dataSource.items[index];
		}
		let itemData = dataSourceItem;
		if (itemData instanceof Element) itemData = this._domElementToItemData(itemData);
		const event = this.dispatch("itemData", {
			itemData: itemData || {},
			index
		});
		return this.applyFilters("itemData", event.itemData, index);
	}
	/**
	* Get array of gallery DOM elements,
	* based on childSelector and gallery element.
	*
	* @param {HTMLElement} galleryElement
	* @returns {HTMLElement[]}
	*/
	_getGalleryDOMElements(galleryElement) {
		var _this$options3, _this$options4;
		if ((_this$options3 = this.options) !== null && _this$options3 !== void 0 && _this$options3.children || (_this$options4 = this.options) !== null && _this$options4 !== void 0 && _this$options4.childSelector) return getElementsFromOption(this.options.children, this.options.childSelector, galleryElement) || [];
		return [galleryElement];
	}
	/**
	* Converts DOM element to item data object.
	*
	* @param {HTMLElement} element DOM element
	* @returns {SlideData}
	*/
	_domElementToItemData(element) {
		/** @type {SlideData} */
		const itemData = { element };
		const linkEl = element.tagName === "A" ? element : element.querySelector("a");
		if (linkEl) {
			itemData.src = linkEl.dataset.pswpSrc || linkEl.href;
			if (linkEl.dataset.pswpSrcset) itemData.srcset = linkEl.dataset.pswpSrcset;
			itemData.width = linkEl.dataset.pswpWidth ? parseInt(linkEl.dataset.pswpWidth, 10) : 0;
			itemData.height = linkEl.dataset.pswpHeight ? parseInt(linkEl.dataset.pswpHeight, 10) : 0;
			itemData.w = itemData.width;
			itemData.h = itemData.height;
			if (linkEl.dataset.pswpType) itemData.type = linkEl.dataset.pswpType;
			const thumbnailEl = element.querySelector("img");
			if (thumbnailEl) {
				var _thumbnailEl$getAttri;
				itemData.msrc = thumbnailEl.currentSrc || thumbnailEl.src;
				itemData.alt = (_thumbnailEl$getAttri = thumbnailEl.getAttribute("alt")) !== null && _thumbnailEl$getAttri !== void 0 ? _thumbnailEl$getAttri : "";
			}
			if (linkEl.dataset.pswpCropped || linkEl.dataset.cropped) itemData.thumbCropped = true;
		}
		return this.applyFilters("domItemData", itemData, element, linkEl);
	}
	/**
	* Lazy-load by slide data
	*
	* @param {SlideData} itemData Data about the slide
	* @param {number} index
	* @returns {Content} Image that is being decoded or false.
	*/
	lazyLoadData(itemData, index) {
		return lazyLoadData(itemData, this, index);
	}
};
/** @typedef {import('./photoswipe.js').default} PhotoSwipe */
/** @typedef {import('./slide/get-thumb-bounds.js').Bounds} Bounds */
/** @typedef {import('./util/animations.js').AnimationProps} AnimationProps */
const MIN_OPACITY = .003;
/**
* Manages opening and closing transitions of the PhotoSwipe.
*
* It can perform zoom, fade or no transition.
*/
var Opener = class {
	/**
	* @param {PhotoSwipe} pswp
	*/
	constructor(pswp) {
		this.pswp = pswp;
		this.isClosed = true;
		this.isOpen = false;
		this.isClosing = false;
		this.isOpening = false;
		/**
		* @private
		* @type {number | false | undefined}
		*/
		this._duration = void 0;
		/** @private */
		this._useAnimation = false;
		/** @private */
		this._croppedZoom = false;
		/** @private */
		this._animateRootOpacity = false;
		/** @private */
		this._animateBgOpacity = false;
		/**
		* @private
		* @type { HTMLDivElement | HTMLImageElement | null | undefined }
		*/
		this._placeholder = void 0;
		/**
		* @private
		* @type { HTMLDivElement | undefined }
		*/
		this._opacityElement = void 0;
		/**
		* @private
		* @type { HTMLDivElement | undefined }
		*/
		this._cropContainer1 = void 0;
		/**
		* @private
		* @type { HTMLElement | null | undefined }
		*/
		this._cropContainer2 = void 0;
		/**
		* @private
		* @type {Bounds | undefined}
		*/
		this._thumbBounds = void 0;
		this._prepareOpen = this._prepareOpen.bind(this);
		pswp.on("firstZoomPan", this._prepareOpen);
	}
	open() {
		this._prepareOpen();
		this._start();
	}
	close() {
		if (this.isClosed || this.isClosing || this.isOpening) return;
		const slide = this.pswp.currSlide;
		this.isOpen = false;
		this.isOpening = false;
		this.isClosing = true;
		this._duration = this.pswp.options.hideAnimationDuration;
		if (slide && slide.currZoomLevel * slide.width >= this.pswp.options.maxWidthToAnimate) this._duration = 0;
		this._applyStartProps();
		setTimeout(() => {
			this._start();
		}, this._croppedZoom ? 30 : 0);
	}
	/** @private */
	_prepareOpen() {
		this.pswp.off("firstZoomPan", this._prepareOpen);
		if (!this.isOpening) {
			const slide = this.pswp.currSlide;
			this.isOpening = true;
			this.isClosing = false;
			this._duration = this.pswp.options.showAnimationDuration;
			if (slide && slide.zoomLevels.initial * slide.width >= this.pswp.options.maxWidthToAnimate) this._duration = 0;
			this._applyStartProps();
		}
	}
	/** @private */
	_applyStartProps() {
		const { pswp } = this;
		const slide = this.pswp.currSlide;
		const { options } = pswp;
		if (options.showHideAnimationType === "fade") {
			options.showHideOpacity = true;
			this._thumbBounds = void 0;
		} else if (options.showHideAnimationType === "none") {
			options.showHideOpacity = false;
			this._duration = 0;
			this._thumbBounds = void 0;
		} else if (this.isOpening && pswp._initialThumbBounds) this._thumbBounds = pswp._initialThumbBounds;
		else this._thumbBounds = this.pswp.getThumbBounds();
		this._placeholder = slide === null || slide === void 0 ? void 0 : slide.getPlaceholderElement();
		pswp.animations.stopAll();
		this._useAnimation = Boolean(this._duration && this._duration > 50);
		this._animateZoom = Boolean(this._thumbBounds) && (slide === null || slide === void 0 ? void 0 : slide.content.usePlaceholder()) && (!this.isClosing || !pswp.mainScroll.isShifted());
		if (!this._animateZoom) {
			this._animateRootOpacity = true;
			if (this.isOpening && slide) {
				slide.zoomAndPanToInitial();
				slide.applyCurrentZoomPan();
			}
		} else {
			var _options$showHideOpac;
			this._animateRootOpacity = (_options$showHideOpac = options.showHideOpacity) !== null && _options$showHideOpac !== void 0 ? _options$showHideOpac : false;
		}
		this._animateBgOpacity = !this._animateRootOpacity && this.pswp.options.bgOpacity > MIN_OPACITY;
		this._opacityElement = this._animateRootOpacity ? pswp.element : pswp.bg;
		if (!this._useAnimation) {
			this._duration = 0;
			this._animateZoom = false;
			this._animateBgOpacity = false;
			this._animateRootOpacity = true;
			if (this.isOpening) {
				if (pswp.element) pswp.element.style.opacity = String(MIN_OPACITY);
				pswp.applyBgOpacity(1);
			}
			return;
		}
		if (this._animateZoom && this._thumbBounds && this._thumbBounds.innerRect) {
			var _this$pswp$currSlide;
			this._croppedZoom = true;
			this._cropContainer1 = this.pswp.container;
			this._cropContainer2 = (_this$pswp$currSlide = this.pswp.currSlide) === null || _this$pswp$currSlide === void 0 ? void 0 : _this$pswp$currSlide.holderElement;
			if (pswp.container) {
				pswp.container.style.overflow = "hidden";
				pswp.container.style.width = pswp.viewportSize.x + "px";
			}
		} else this._croppedZoom = false;
		if (this.isOpening) {
			if (this._animateRootOpacity) {
				if (pswp.element) pswp.element.style.opacity = String(MIN_OPACITY);
				pswp.applyBgOpacity(1);
			} else {
				if (this._animateBgOpacity && pswp.bg) pswp.bg.style.opacity = String(MIN_OPACITY);
				if (pswp.element) pswp.element.style.opacity = "1";
			}
			if (this._animateZoom) {
				this._setClosedStateZoomPan();
				if (this._placeholder) {
					this._placeholder.style.willChange = "transform";
					this._placeholder.style.opacity = String(MIN_OPACITY);
				}
			}
		} else if (this.isClosing) {
			if (pswp.mainScroll.itemHolders[0]) pswp.mainScroll.itemHolders[0].el.style.display = "none";
			if (pswp.mainScroll.itemHolders[2]) pswp.mainScroll.itemHolders[2].el.style.display = "none";
			if (this._croppedZoom) {
				if (pswp.mainScroll.x !== 0) {
					pswp.mainScroll.resetPosition();
					pswp.mainScroll.resize();
				}
			}
		}
	}
	/** @private */
	_start() {
		if (this.isOpening && this._useAnimation && this._placeholder && this._placeholder.tagName === "IMG") new Promise((resolve) => {
			let decoded = false;
			let isDelaying = true;
			decodeImage(
				/** @type {HTMLImageElement} */
				this._placeholder
			).finally(() => {
				decoded = true;
				if (!isDelaying) resolve(true);
			});
			setTimeout(() => {
				isDelaying = false;
				if (decoded) resolve(true);
			}, 50);
			setTimeout(resolve, 250);
		}).finally(() => this._initiate());
		else this._initiate();
	}
	/** @private */
	_initiate() {
		var _this$pswp$element, _this$pswp$element2;
		(_this$pswp$element = this.pswp.element) === null || _this$pswp$element === void 0 || _this$pswp$element.style.setProperty("--pswp-transition-duration", this._duration + "ms");
		this.pswp.dispatch(this.isOpening ? "openingAnimationStart" : "closingAnimationStart");
		this.pswp.dispatch(
			/** @type {'initialZoomIn' | 'initialZoomOut'} */
			"initialZoom" + (this.isOpening ? "In" : "Out")
		);
		(_this$pswp$element2 = this.pswp.element) === null || _this$pswp$element2 === void 0 || _this$pswp$element2.classList.toggle("pswp--ui-visible", this.isOpening);
		if (this.isOpening) {
			if (this._placeholder) this._placeholder.style.opacity = "1";
			this._animateToOpenState();
		} else if (this.isClosing) this._animateToClosedState();
		if (!this._useAnimation) this._onAnimationComplete();
	}
	/** @private */
	_onAnimationComplete() {
		const { pswp } = this;
		this.isOpen = this.isOpening;
		this.isClosed = this.isClosing;
		this.isOpening = false;
		this.isClosing = false;
		pswp.dispatch(this.isOpen ? "openingAnimationEnd" : "closingAnimationEnd");
		pswp.dispatch(
			/** @type {'initialZoomInEnd' | 'initialZoomOutEnd'} */
			"initialZoom" + (this.isOpen ? "InEnd" : "OutEnd")
		);
		if (this.isClosed) pswp.destroy();
		else if (this.isOpen) {
			var _pswp$currSlide;
			if (this._animateZoom && pswp.container) {
				pswp.container.style.overflow = "visible";
				pswp.container.style.width = "100%";
			}
			(_pswp$currSlide = pswp.currSlide) === null || _pswp$currSlide === void 0 || _pswp$currSlide.applyCurrentZoomPan();
		}
	}
	/** @private */
	_animateToOpenState() {
		const { pswp } = this;
		if (this._animateZoom) {
			if (this._croppedZoom && this._cropContainer1 && this._cropContainer2) {
				this._animateTo(this._cropContainer1, "transform", "translate3d(0,0,0)");
				this._animateTo(this._cropContainer2, "transform", "none");
			}
			if (pswp.currSlide) {
				pswp.currSlide.zoomAndPanToInitial();
				this._animateTo(pswp.currSlide.container, "transform", pswp.currSlide.getCurrentTransform());
			}
		}
		if (this._animateBgOpacity && pswp.bg) this._animateTo(pswp.bg, "opacity", String(pswp.options.bgOpacity));
		if (this._animateRootOpacity && pswp.element) this._animateTo(pswp.element, "opacity", "1");
	}
	/** @private */
	_animateToClosedState() {
		const { pswp } = this;
		if (this._animateZoom) this._setClosedStateZoomPan(true);
		if (this._animateBgOpacity && pswp.bgOpacity > .01 && pswp.bg) this._animateTo(pswp.bg, "opacity", "0");
		if (this._animateRootOpacity && pswp.element) this._animateTo(pswp.element, "opacity", "0");
	}
	/**
	* @private
	* @param {boolean} [animate]
	*/
	_setClosedStateZoomPan(animate) {
		if (!this._thumbBounds) return;
		const { pswp } = this;
		const { innerRect } = this._thumbBounds;
		const { currSlide, viewportSize } = pswp;
		if (this._croppedZoom && innerRect && this._cropContainer1 && this._cropContainer2) {
			const containerOnePanX = -viewportSize.x + (this._thumbBounds.x - innerRect.x) + innerRect.w;
			const containerOnePanY = -viewportSize.y + (this._thumbBounds.y - innerRect.y) + innerRect.h;
			const containerTwoPanX = viewportSize.x - innerRect.w;
			const containerTwoPanY = viewportSize.y - innerRect.h;
			if (animate) {
				this._animateTo(this._cropContainer1, "transform", toTransformString(containerOnePanX, containerOnePanY));
				this._animateTo(this._cropContainer2, "transform", toTransformString(containerTwoPanX, containerTwoPanY));
			} else {
				setTransform(this._cropContainer1, containerOnePanX, containerOnePanY);
				setTransform(this._cropContainer2, containerTwoPanX, containerTwoPanY);
			}
		}
		if (currSlide) {
			equalizePoints(currSlide.pan, innerRect || this._thumbBounds);
			currSlide.currZoomLevel = this._thumbBounds.w / currSlide.width;
			if (animate) this._animateTo(currSlide.container, "transform", currSlide.getCurrentTransform());
			else currSlide.applyCurrentZoomPan();
		}
	}
	/**
	* @private
	* @param {HTMLElement} target
	* @param {'transform' | 'opacity'} prop
	* @param {string} propValue
	*/
	_animateTo(target, prop, propValue) {
		if (!this._duration) {
			target.style[prop] = propValue;
			return;
		}
		const { animations } = this.pswp;
		/** @type {AnimationProps} */
		const animProps = {
			duration: this._duration,
			easing: this.pswp.options.easing,
			onComplete: () => {
				if (!animations.activeAnimations.length) this._onAnimationComplete();
			},
			target
		};
		animProps[prop] = propValue;
		animations.startTransition(animProps);
	}
};
/**
* @template T
* @typedef {import('./types.js').Type<T>} Type<T>
*/
/** @typedef {import('./slide/slide.js').SlideData} SlideData */
/** @typedef {import('./slide/zoom-level.js').ZoomLevelOption} ZoomLevelOption */
/** @typedef {import('./ui/ui-element.js').UIElementData} UIElementData */
/** @typedef {import('./main-scroll.js').ItemHolder} ItemHolder */
/** @typedef {import('./core/eventable.js').PhotoSwipeEventsMap} PhotoSwipeEventsMap */
/** @typedef {import('./core/eventable.js').PhotoSwipeFiltersMap} PhotoSwipeFiltersMap */
/** @typedef {import('./slide/get-thumb-bounds').Bounds} Bounds */
/**
* @template {keyof PhotoSwipeEventsMap} T
* @typedef {import('./core/eventable.js').EventCallback<T>} EventCallback<T>
*/
/**
* @template {keyof PhotoSwipeEventsMap} T
* @typedef {import('./core/eventable.js').AugmentedEvent<T>} AugmentedEvent<T>
*/
/** @typedef {{ x: number; y: number; id?: string | number }} Point */
/** @typedef {{ top: number; bottom: number; left: number; right: number }} Padding */
/** @typedef {SlideData[]} DataSourceArray */
/** @typedef {{ gallery: HTMLElement; items?: HTMLElement[] }} DataSourceObject */
/** @typedef {DataSourceArray | DataSourceObject} DataSource */
/** @typedef {(point: Point, originalEvent: PointerEvent) => void} ActionFn */
/** @typedef {'close' | 'next' | 'zoom' | 'zoom-or-close' | 'toggle-controls'} ActionType */
/** @typedef {Type<PhotoSwipe> | { default: Type<PhotoSwipe> }} PhotoSwipeModule */
/** @typedef {PhotoSwipeModule | Promise<PhotoSwipeModule> | (() => Promise<PhotoSwipeModule>)} PhotoSwipeModuleOption */
/**
* @typedef {string | NodeListOf<HTMLElement> | HTMLElement[] | HTMLElement} ElementProvider
*/
/** @typedef {Partial<PreparedPhotoSwipeOptions>} PhotoSwipeOptions https://photoswipe.com/options/ */
/**
* @typedef {Object} PreparedPhotoSwipeOptions
*
* @prop {DataSource} [dataSource]
* Pass an array of any items via dataSource option. Its length will determine amount of slides
* (which may be modified further from numItems event).
*
* Each item should contain data that you need to generate slide
* (for image slide it would be src (image URL), width (image width), height, srcset, alt).
*
* If these properties are not present in your initial array, you may "pre-parse" each item from itemData filter.
*
* @prop {number} bgOpacity
* Background backdrop opacity, always define it via this option and not via CSS rgba color.
*
* @prop {number} spacing
* Spacing between slides. Defined as ratio relative to the viewport width (0.1 = 10% of viewport).
*
* @prop {boolean} allowPanToNext
* Allow swipe navigation to the next slide when the current slide is zoomed. Does not apply to mouse events.
*
* @prop {boolean} loop
* If set to true you'll be able to swipe from the last to the first image.
* Option is always false when there are less than 3 slides.
*
* @prop {boolean} [wheelToZoom]
* By default PhotoSwipe zooms image with ctrl-wheel, if you enable this option - image will zoom just via wheel.
*
* @prop {boolean} pinchToClose
* Pinch touch gesture to close the gallery.
*
* @prop {boolean} closeOnVerticalDrag
* Vertical drag gesture to close the PhotoSwipe.
*
* @prop {Padding} [padding]
* Slide area padding (in pixels).
*
* @prop {(viewportSize: Point, itemData: SlideData, index: number) => Padding} [paddingFn]
* The option is checked frequently, so make sure it's performant. Overrides padding option if defined. For example:
*
* @prop {number | false} hideAnimationDuration
* Transition duration in milliseconds, can be 0.
*
* @prop {number | false} showAnimationDuration
* Transition duration in milliseconds, can be 0.
*
* @prop {number | false} zoomAnimationDuration
* Transition duration in milliseconds, can be 0.
*
* @prop {string} easing
* String, 'cubic-bezier(.4,0,.22,1)'. CSS easing function for open/close/zoom transitions.
*
* @prop {boolean} escKey
* Esc key to close.
*
* @prop {boolean} arrowKeys
* Left/right arrow keys for navigation.
*
* @prop {boolean} trapFocus
* Trap focus within PhotoSwipe element while it's open.
*
* @prop {boolean} returnFocus
* Restore focus the last active element after PhotoSwipe is closed.
*
* @prop {boolean} clickToCloseNonZoomable
* If image is not zoomable (for example, smaller than viewport) it can be closed by clicking on it.
*
* @prop {ActionType | ActionFn | false} imageClickAction
* Refer to click and tap actions page.
*
* @prop {ActionType | ActionFn | false} bgClickAction
* Refer to click and tap actions page.
*
* @prop {ActionType | ActionFn | false} tapAction
* Refer to click and tap actions page.
*
* @prop {ActionType | ActionFn | false} doubleTapAction
* Refer to click and tap actions page.
*
* @prop {number} preloaderDelay
* Delay before the loading indicator will be displayed,
* if image is loaded during it - the indicator will not be displayed at all. Can be zero.
*
* @prop {string} indexIndicatorSep
* Used for slide count indicator ("1 of 10 ").
*
* @prop {(options: PhotoSwipeOptions, pswp: PhotoSwipeBase) => Point} [getViewportSizeFn]
* A function that should return slide viewport width and height, in format {x: 100, y: 100}.
*
* @prop {string} errorMsg
* Message to display when the image wasn't able to load. If you need to display HTML - use contentErrorElement filter.
*
* @prop {[number, number]} preload
* Lazy loading of nearby slides based on direction of movement. Should be an array with two integers,
* first one - number of items to preload before the current image, second one - after the current image.
* Two nearby images are always loaded.
*
* @prop {string} [mainClass]
* Class that will be added to the root element of PhotoSwipe, may contain multiple separated by space.
* Example on Styling page.
*
* @prop {HTMLElement} [appendToEl]
* Element to which PhotoSwipe dialog will be appended when it opens.
*
* @prop {number} maxWidthToAnimate
* Maximum width of image to animate, if initial rendered image width
* is larger than this value - the opening/closing transition will be automatically disabled.
*
* @prop {string} [closeTitle]
* Translating
*
* @prop {string} [zoomTitle]
* Translating
*
* @prop {string} [arrowPrevTitle]
* Translating
*
* @prop {string} [arrowNextTitle]
* Translating
*
* @prop {'zoom' | 'fade' | 'none'} [showHideAnimationType]
* To adjust opening or closing transition type use lightbox option `showHideAnimationType` (`String`).
* It supports three values - `zoom` (default), `fade` (default if there is no thumbnail) and `none`.
*
* Animations are automatically disabled if user `(prefers-reduced-motion: reduce)`.
*
* @prop {number} index
* Defines start slide index.
*
* @prop {(e: MouseEvent) => number} [getClickedIndexFn]
*
* @prop {boolean} [arrowPrev]
* @prop {boolean} [arrowNext]
* @prop {boolean} [zoom]
* @prop {boolean} [close]
* @prop {boolean} [counter]
*
* @prop {string} [arrowPrevSVG]
* @prop {string} [arrowNextSVG]
* @prop {string} [zoomSVG]
* @prop {string} [closeSVG]
* @prop {string} [counterSVG]
*
* @prop {string} [arrowPrevTitle]
* @prop {string} [arrowNextTitle]
* @prop {string} [zoomTitle]
* @prop {string} [closeTitle]
* @prop {string} [counterTitle]
*
* @prop {ZoomLevelOption} [initialZoomLevel]
* @prop {ZoomLevelOption} [secondaryZoomLevel]
* @prop {ZoomLevelOption} [maxZoomLevel]
*
* @prop {boolean} [mouseMovePan]
* @prop {Point | null} [initialPointerPos]
* @prop {boolean} [showHideOpacity]
*
* @prop {PhotoSwipeModuleOption} [pswpModule]
* @prop {() => Promise<any>} [openPromise]
* @prop {boolean} [preloadFirstSlide]
* @prop {ElementProvider} [gallery]
* @prop {string} [gallerySelector]
* @prop {ElementProvider} [children]
* @prop {string} [childSelector]
* @prop {string | false} [thumbSelector]
*/
/** @type {PreparedPhotoSwipeOptions} */
const defaultOptions = {
	allowPanToNext: true,
	spacing: .1,
	loop: true,
	pinchToClose: true,
	closeOnVerticalDrag: true,
	hideAnimationDuration: 333,
	showAnimationDuration: 333,
	zoomAnimationDuration: 333,
	escKey: true,
	arrowKeys: true,
	trapFocus: true,
	returnFocus: true,
	maxWidthToAnimate: 4e3,
	clickToCloseNonZoomable: true,
	imageClickAction: "zoom-or-close",
	bgClickAction: "close",
	tapAction: "toggle-controls",
	doubleTapAction: "zoom",
	indexIndicatorSep: " / ",
	preloaderDelay: 2e3,
	bgOpacity: .8,
	index: 0,
	errorMsg: "The image cannot be loaded",
	preload: [1, 2],
	easing: "cubic-bezier(.4,0,.22,1)"
};
/**
* PhotoSwipe Core
*/
var PhotoSwipe = class extends PhotoSwipeBase {
	/**
	* @param {PhotoSwipeOptions} [options]
	*/
	constructor(options) {
		super();
		this.options = this._prepareOptions(options || {});
		/**
		* offset of viewport relative to document
		*
		* @type {Point}
		*/
		this.offset = {
			x: 0,
			y: 0
		};
		/**
		* @type {Point}
		* @private
		*/
		this._prevViewportSize = {
			x: 0,
			y: 0
		};
		/**
		* Size of scrollable PhotoSwipe viewport
		*
		* @type {Point}
		*/
		this.viewportSize = {
			x: 0,
			y: 0
		};
		/**
		* background (backdrop) opacity
		*/
		this.bgOpacity = 1;
		this.currIndex = 0;
		this.potentialIndex = 0;
		this.isOpen = false;
		this.isDestroying = false;
		this.hasMouse = false;
		/**
		* @private
		* @type {SlideData}
		*/
		this._initialItemData = {};
		/** @type {Bounds | undefined} */
		this._initialThumbBounds = void 0;
		/** @type {HTMLDivElement | undefined} */
		this.topBar = void 0;
		/** @type {HTMLDivElement | undefined} */
		this.element = void 0;
		/** @type {HTMLDivElement | undefined} */
		this.template = void 0;
		/** @type {HTMLDivElement | undefined} */
		this.container = void 0;
		/** @type {HTMLElement | undefined} */
		this.scrollWrap = void 0;
		/** @type {Slide | undefined} */
		this.currSlide = void 0;
		this.events = new DOMEvents();
		this.animations = new Animations();
		this.mainScroll = new MainScroll(this);
		this.gestures = new Gestures(this);
		this.opener = new Opener(this);
		this.keyboard = new Keyboard(this);
		this.contentLoader = new ContentLoader(this);
	}
	/** @returns {boolean} */
	init() {
		if (this.isOpen || this.isDestroying) return false;
		this.isOpen = true;
		this.dispatch("init");
		this.dispatch("beforeOpen");
		this._createMainStructure();
		let rootClasses = "pswp--open";
		if (this.gestures.supportsTouch) rootClasses += " pswp--touch";
		if (this.options.mainClass) rootClasses += " " + this.options.mainClass;
		if (this.element) this.element.className += " " + rootClasses;
		this.currIndex = this.options.index || 0;
		this.potentialIndex = this.currIndex;
		this.dispatch("firstUpdate");
		this.scrollWheel = new ScrollWheel(this);
		if (Number.isNaN(this.currIndex) || this.currIndex < 0 || this.currIndex >= this.getNumItems()) this.currIndex = 0;
		if (!this.gestures.supportsTouch) this.mouseDetected();
		this.updateSize();
		this.offset.y = window.pageYOffset;
		this._initialItemData = this.getItemData(this.currIndex);
		this.dispatch("gettingData", {
			index: this.currIndex,
			data: this._initialItemData,
			slide: void 0
		});
		this._initialThumbBounds = this.getThumbBounds();
		this.dispatch("initialLayout");
		this.on("openingAnimationEnd", () => {
			const { itemHolders } = this.mainScroll;
			if (itemHolders[0]) {
				itemHolders[0].el.style.display = "block";
				this.setContent(itemHolders[0], this.currIndex - 1);
			}
			if (itemHolders[2]) {
				itemHolders[2].el.style.display = "block";
				this.setContent(itemHolders[2], this.currIndex + 1);
			}
			this.appendHeavy();
			this.contentLoader.updateLazy();
			this.events.add(window, "resize", this._handlePageResize.bind(this));
			this.events.add(window, "scroll", this._updatePageScrollOffset.bind(this));
			this.dispatch("bindEvents");
		});
		if (this.mainScroll.itemHolders[1]) this.setContent(this.mainScroll.itemHolders[1], this.currIndex);
		this.dispatch("change");
		this.opener.open();
		this.dispatch("afterInit");
		return true;
	}
	/**
	* Get looped slide index
	* (for example, -1 will return the last slide)
	*
	* @param {number} index
	* @returns {number}
	*/
	getLoopedIndex(index) {
		const numSlides = this.getNumItems();
		if (this.options.loop) {
			if (index > numSlides - 1) index -= numSlides;
			if (index < 0) index += numSlides;
		}
		return clamp(index, 0, numSlides - 1);
	}
	appendHeavy() {
		this.mainScroll.itemHolders.forEach((itemHolder) => {
			var _itemHolder$slide;
			(_itemHolder$slide = itemHolder.slide) === null || _itemHolder$slide === void 0 || _itemHolder$slide.appendHeavy();
		});
	}
	/**
	* Change the slide
	* @param {number} index New index
	*/
	goTo(index) {
		this.mainScroll.moveIndexBy(this.getLoopedIndex(index) - this.potentialIndex);
	}
	/**
	* Go to the next slide.
	*/
	next() {
		this.goTo(this.potentialIndex + 1);
	}
	/**
	* Go to the previous slide.
	*/
	prev() {
		this.goTo(this.potentialIndex - 1);
	}
	/**
	* @see slide/slide.js zoomTo
	*
	* @param {Parameters<Slide['zoomTo']>} args
	*/
	zoomTo(...args) {
		var _this$currSlide;
		(_this$currSlide = this.currSlide) === null || _this$currSlide === void 0 || _this$currSlide.zoomTo(...args);
	}
	/**
	* @see slide/slide.js toggleZoom
	*/
	toggleZoom() {
		var _this$currSlide2;
		(_this$currSlide2 = this.currSlide) === null || _this$currSlide2 === void 0 || _this$currSlide2.toggleZoom();
	}
	/**
	* Close the gallery.
	* After closing transition ends - destroy it
	*/
	close() {
		if (!this.opener.isOpen || this.isDestroying) return;
		this.isDestroying = true;
		this.dispatch("close");
		this.events.removeAll();
		this.opener.close();
	}
	/**
	* Destroys the gallery:
	* - instantly closes the gallery
	* - unbinds events,
	* - cleans intervals and timeouts
	* - removes elements from DOM
	*/
	destroy() {
		var _this$element;
		if (!this.isDestroying) {
			this.options.showHideAnimationType = "none";
			this.close();
			return;
		}
		this.dispatch("destroy");
		this._listeners = {};
		if (this.scrollWrap) {
			this.scrollWrap.ontouchmove = null;
			this.scrollWrap.ontouchend = null;
		}
		(_this$element = this.element) === null || _this$element === void 0 || _this$element.remove();
		this.mainScroll.itemHolders.forEach((itemHolder) => {
			var _itemHolder$slide2;
			(_itemHolder$slide2 = itemHolder.slide) === null || _itemHolder$slide2 === void 0 || _itemHolder$slide2.destroy();
		});
		this.contentLoader.destroy();
		this.events.removeAll();
	}
	/**
	* Refresh/reload content of a slide by its index
	*
	* @param {number} slideIndex
	*/
	refreshSlideContent(slideIndex) {
		this.contentLoader.removeByIndex(slideIndex);
		this.mainScroll.itemHolders.forEach((itemHolder, i) => {
			var _this$currSlide$index, _this$currSlide3;
			let potentialHolderIndex = ((_this$currSlide$index = (_this$currSlide3 = this.currSlide) === null || _this$currSlide3 === void 0 ? void 0 : _this$currSlide3.index) !== null && _this$currSlide$index !== void 0 ? _this$currSlide$index : 0) - 1 + i;
			if (this.canLoop()) potentialHolderIndex = this.getLoopedIndex(potentialHolderIndex);
			if (potentialHolderIndex === slideIndex) {
				this.setContent(itemHolder, slideIndex, true);
				if (i === 1) {
					var _itemHolder$slide3;
					this.currSlide = itemHolder.slide;
					(_itemHolder$slide3 = itemHolder.slide) === null || _itemHolder$slide3 === void 0 || _itemHolder$slide3.setIsActive(true);
				}
			}
		});
		this.dispatch("change");
	}
	/**
	* Set slide content
	*
	* @param {ItemHolder} holder mainScroll.itemHolders array item
	* @param {number} index Slide index
	* @param {boolean} [force] If content should be set even if index wasn't changed
	*/
	setContent(holder, index, force) {
		if (this.canLoop()) index = this.getLoopedIndex(index);
		if (holder.slide) {
			if (holder.slide.index === index && !force) return;
			holder.slide.destroy();
			holder.slide = void 0;
		}
		if (!this.canLoop() && (index < 0 || index >= this.getNumItems())) return;
		const itemData = this.getItemData(index);
		holder.slide = new Slide(itemData, index, this);
		if (index === this.currIndex) this.currSlide = holder.slide;
		holder.slide.append(holder.el);
	}
	/** @returns {Point} */
	getViewportCenterPoint() {
		return {
			x: this.viewportSize.x / 2,
			y: this.viewportSize.y / 2
		};
	}
	/**
	* Update size of all elements.
	* Executed on init and on page resize.
	*
	* @param {boolean} [force] Update size even if size of viewport was not changed.
	*/
	updateSize(force) {
		if (this.isDestroying) return;
		const newViewportSize = getViewportSize(this.options, this);
		if (!force && pointsEqual(newViewportSize, this._prevViewportSize)) return;
		equalizePoints(this._prevViewportSize, newViewportSize);
		this.dispatch("beforeResize");
		equalizePoints(this.viewportSize, this._prevViewportSize);
		this._updatePageScrollOffset();
		this.dispatch("viewportSize");
		this.mainScroll.resize(this.opener.isOpen);
		if (!this.hasMouse && window.matchMedia("(any-hover: hover)").matches) this.mouseDetected();
		this.dispatch("resize");
	}
	/**
	* @param {number} opacity
	*/
	applyBgOpacity(opacity) {
		this.bgOpacity = Math.max(opacity, 0);
		if (this.bg) this.bg.style.opacity = String(this.bgOpacity * this.options.bgOpacity);
	}
	/**
	* Whether mouse is detected
	*/
	mouseDetected() {
		if (!this.hasMouse) {
			var _this$element2;
			this.hasMouse = true;
			(_this$element2 = this.element) === null || _this$element2 === void 0 || _this$element2.classList.add("pswp--has_mouse");
		}
	}
	/**
	* Page resize event handler
	*
	* @private
	*/
	_handlePageResize() {
		this.updateSize();
		if (/iPhone|iPad|iPod/i.test(window.navigator.userAgent)) setTimeout(() => {
			this.updateSize();
		}, 500);
	}
	/**
	* Page scroll offset is used
	* to get correct coordinates
	* relative to PhotoSwipe viewport.
	*
	* @private
	*/
	_updatePageScrollOffset() {
		this.setScrollOffset(0, window.pageYOffset);
	}
	/**
	* @param {number} x
	* @param {number} y
	*/
	setScrollOffset(x, y) {
		this.offset.x = x;
		this.offset.y = y;
		this.dispatch("updateScrollOffset");
	}
	/**
	* Create main HTML structure of PhotoSwipe,
	* and add it to DOM
	*
	* @private
	*/
	_createMainStructure() {
		this.element = createElement("pswp", "div");
		this.element.setAttribute("tabindex", "-1");
		this.element.setAttribute("role", "dialog");
		this.template = this.element;
		this.bg = createElement("pswp__bg", "div", this.element);
		this.scrollWrap = createElement("pswp__scroll-wrap", "section", this.element);
		this.container = createElement("pswp__container", "div", this.scrollWrap);
		this.scrollWrap.setAttribute("aria-roledescription", "carousel");
		this.container.setAttribute("aria-live", "off");
		this.container.setAttribute("id", "pswp__items");
		this.mainScroll.appendHolders();
		this.ui = new UI(this);
		this.ui.init();
		(this.options.appendToEl || document.body).appendChild(this.element);
	}
	/**
	* Get position and dimensions of small thumbnail
	*   {x:,y:,w:}
	*
	* Height is optional (calculated based on the large image)
	*
	* @returns {Bounds | undefined}
	*/
	getThumbBounds() {
		return getThumbBounds(this.currIndex, this.currSlide ? this.currSlide.data : this._initialItemData, this);
	}
	/**
	* If the PhotoSwipe can have continuous loop
	* @returns Boolean
	*/
	canLoop() {
		return this.options.loop && this.getNumItems() > 2;
	}
	/**
	* @private
	* @param {PhotoSwipeOptions} options
	* @returns {PreparedPhotoSwipeOptions}
	*/
	_prepareOptions(options) {
		if (window.matchMedia("(prefers-reduced-motion), (update: slow)").matches) {
			options.showHideAnimationType = "none";
			options.zoomAnimationDuration = 0;
		}
		/** @type {PreparedPhotoSwipeOptions} */
		return {
			...defaultOptions,
			...options
		};
	}
};

//#endregion
//#region src/js/vendor.photoswipe.ts
var vendor_photoswipe_default = PhotoSwipe;

//#endregion
export { vendor_photoswipe_default as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVuZG9yLnBob3Rvc3dpcGUuanMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bob3Rvc3dpcGUvZGlzdC9waG90b3N3aXBlLmVzbS5qcyIsIi4uL3NyYy9qcy92ZW5kb3IucGhvdG9zd2lwZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAgKiBQaG90b1N3aXBlIDUuNC40IC0gaHR0cHM6Ly9waG90b3N3aXBlLmNvbVxuICAqIChjKSAyMDI0IERteXRybyBTZW1lbm92XG4gICovXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4vcGhvdG9zd2lwZS5qcycpLlBvaW50fSBQb2ludCAqL1xuXG4vKipcclxuICogQHRlbXBsYXRlIHtrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXB9IFRcclxuICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxyXG4gKiBAcGFyYW0ge1R9IHRhZ05hbWVcclxuICogQHBhcmFtIHtOb2RlfSBbYXBwZW5kVG9FbF1cclxuICogQHJldHVybnMge0hUTUxFbGVtZW50VGFnTmFtZU1hcFtUXX1cclxuICovXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50KGNsYXNzTmFtZSwgdGFnTmFtZSwgYXBwZW5kVG9FbCkge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG5cbiAgaWYgKGNsYXNzTmFtZSkge1xuICAgIGVsLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgfVxuXG4gIGlmIChhcHBlbmRUb0VsKSB7XG4gICAgYXBwZW5kVG9FbC5hcHBlbmRDaGlsZChlbCk7XG4gIH1cblxuICByZXR1cm4gZWw7XG59XG4vKipcclxuICogQHBhcmFtIHtQb2ludH0gcDFcclxuICogQHBhcmFtIHtQb2ludH0gcDJcclxuICogQHJldHVybnMge1BvaW50fVxyXG4gKi9cblxuZnVuY3Rpb24gZXF1YWxpemVQb2ludHMocDEsIHAyKSB7XG4gIHAxLnggPSBwMi54O1xuICBwMS55ID0gcDIueTtcblxuICBpZiAocDIuaWQgIT09IHVuZGVmaW5lZCkge1xuICAgIHAxLmlkID0gcDIuaWQ7XG4gIH1cblxuICByZXR1cm4gcDE7XG59XG4vKipcclxuICogQHBhcmFtIHtQb2ludH0gcFxyXG4gKi9cblxuZnVuY3Rpb24gcm91bmRQb2ludChwKSB7XG4gIHAueCA9IE1hdGgucm91bmQocC54KTtcbiAgcC55ID0gTWF0aC5yb3VuZChwLnkpO1xufVxuLyoqXHJcbiAqIFJldHVybnMgZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1BvaW50fSBwMVxyXG4gKiBAcGFyYW0ge1BvaW50fSBwMlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gKi9cblxuZnVuY3Rpb24gZ2V0RGlzdGFuY2VCZXR3ZWVuKHAxLCBwMikge1xuICBjb25zdCB4ID0gTWF0aC5hYnMocDEueCAtIHAyLngpO1xuICBjb25zdCB5ID0gTWF0aC5hYnMocDEueSAtIHAyLnkpO1xuICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xufVxuLyoqXHJcbiAqIFdoZXRoZXIgWCBhbmQgWSBwb3NpdGlvbnMgb2YgcG9pbnRzIGFyZSBlcXVhbFxyXG4gKlxyXG4gKiBAcGFyYW0ge1BvaW50fSBwMVxyXG4gKiBAcGFyYW0ge1BvaW50fSBwMlxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXG5cbmZ1bmN0aW9uIHBvaW50c0VxdWFsKHAxLCBwMikge1xuICByZXR1cm4gcDEueCA9PT0gcDIueCAmJiBwMS55ID09PSBwMi55O1xufVxuLyoqXHJcbiAqIFRoZSBmbG9hdCByZXN1bHQgYmV0d2VlbiB0aGUgbWluIGFuZCBtYXggdmFsdWVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdmFsXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gKi9cblxuZnVuY3Rpb24gY2xhbXAodmFsLCBtaW4sIG1heCkge1xuICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgodmFsLCBtaW4pLCBtYXgpO1xufVxuLyoqXHJcbiAqIEdldCB0cmFuc2Zvcm0gc3RyaW5nXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeV1cclxuICogQHBhcmFtIHtudW1iZXJ9IFtzY2FsZV1cclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXG5cbmZ1bmN0aW9uIHRvVHJhbnNmb3JtU3RyaW5nKHgsIHksIHNjYWxlKSB7XG4gIGxldCBwcm9wVmFsdWUgPSBgdHJhbnNsYXRlM2QoJHt4fXB4LCR7eSB8fCAwfXB4LDApYDtcblxuICBpZiAoc2NhbGUgIT09IHVuZGVmaW5lZCkge1xuICAgIHByb3BWYWx1ZSArPSBgIHNjYWxlM2QoJHtzY2FsZX0sJHtzY2FsZX0sMSlgO1xuICB9XG5cbiAgcmV0dXJuIHByb3BWYWx1ZTtcbn1cbi8qKlxyXG4gKiBBcHBseSB0cmFuc2Zvcm06dHJhbnNsYXRlKHgsIHkpIHNjYWxlKHNjYWxlKSB0byBlbGVtZW50XHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbeV1cclxuICogQHBhcmFtIHtudW1iZXJ9IFtzY2FsZV1cclxuICovXG5cbmZ1bmN0aW9uIHNldFRyYW5zZm9ybShlbCwgeCwgeSwgc2NhbGUpIHtcbiAgZWwuc3R5bGUudHJhbnNmb3JtID0gdG9UcmFuc2Zvcm1TdHJpbmcoeCwgeSwgc2NhbGUpO1xufVxuY29uc3QgZGVmYXVsdENTU0Vhc2luZyA9ICdjdWJpYy1iZXppZXIoLjQsMCwuMjIsMSknO1xuLyoqXHJcbiAqIEFwcGx5IENTUyB0cmFuc2l0aW9uIHRvIGVsZW1lbnRcclxuICpcclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcclxuICogQHBhcmFtIHtzdHJpbmd9IFtwcm9wXSBDU1MgcHJvcGVydHkgdG8gYW5pbWF0ZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gW2R1cmF0aW9uXSBpbiBtc1xyXG4gKiBAcGFyYW0ge3N0cmluZ30gW2Vhc2VdIENTUyBlYXNpbmcgZnVuY3Rpb25cclxuICovXG5cbmZ1bmN0aW9uIHNldFRyYW5zaXRpb25TdHlsZShlbCwgcHJvcCwgZHVyYXRpb24sIGVhc2UpIHtcbiAgLy8gaW5PdXQ6ICdjdWJpYy1iZXppZXIoLjQsIDAsIC4yMiwgMSknLCAvLyBmb3IgXCJ0b2dnbGUgc3RhdGVcIiB0cmFuc2l0aW9uc1xuICAvLyBvdXQ6ICdjdWJpYy1iZXppZXIoMCwgMCwgLjIyLCAxKScsIC8vIGZvciBcInNob3dcIiB0cmFuc2l0aW9uc1xuICAvLyBpbjogJ2N1YmljLWJlemllciguNCwgMCwgMSwgMSknLy8gZm9yIFwiaGlkZVwiIHRyYW5zaXRpb25zXG4gIGVsLnN0eWxlLnRyYW5zaXRpb24gPSBwcm9wID8gYCR7cHJvcH0gJHtkdXJhdGlvbn1tcyAke2Vhc2UgfHwgZGVmYXVsdENTU0Vhc2luZ31gIDogJ25vbmUnO1xufVxuLyoqXHJcbiAqIEFwcGx5IHdpZHRoIGFuZCBoZWlnaHQgQ1NTIHByb3BlcnRpZXMgdG8gZWxlbWVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxyXG4gKiBAcGFyYW0ge3N0cmluZyB8IG51bWJlcn0gd1xyXG4gKiBAcGFyYW0ge3N0cmluZyB8IG51bWJlcn0gaFxyXG4gKi9cblxuZnVuY3Rpb24gc2V0V2lkdGhIZWlnaHQoZWwsIHcsIGgpIHtcbiAgZWwuc3R5bGUud2lkdGggPSB0eXBlb2YgdyA9PT0gJ251bWJlcicgPyBgJHt3fXB4YCA6IHc7XG4gIGVsLnN0eWxlLmhlaWdodCA9IHR5cGVvZiBoID09PSAnbnVtYmVyJyA/IGAke2h9cHhgIDogaDtcbn1cbi8qKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxyXG4gKi9cblxuZnVuY3Rpb24gcmVtb3ZlVHJhbnNpdGlvblN0eWxlKGVsKSB7XG4gIHNldFRyYW5zaXRpb25TdHlsZShlbCk7XG59XG4vKipcclxuICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBpbWdcclxuICogQHJldHVybnMge1Byb21pc2U8SFRNTEltYWdlRWxlbWVudCB8IHZvaWQ+fVxyXG4gKi9cblxuZnVuY3Rpb24gZGVjb2RlSW1hZ2UoaW1nKSB7XG4gIGlmICgnZGVjb2RlJyBpbiBpbWcpIHtcbiAgICByZXR1cm4gaW1nLmRlY29kZSgpLmNhdGNoKCgpID0+IHt9KTtcbiAgfVxuXG4gIGlmIChpbWcuY29tcGxldGUpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGltZyk7XG4gIH1cblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGltZy5vbmxvYWQgPSAoKSA9PiByZXNvbHZlKGltZyk7XG5cbiAgICBpbWcub25lcnJvciA9IHJlamVjdDtcbiAgfSk7XG59XG4vKiogQHR5cGVkZWYge0xPQURfU1RBVEVba2V5b2YgTE9BRF9TVEFURV19IExvYWRTdGF0ZSAqL1xuXG4vKiogQHR5cGUge3sgSURMRTogJ2lkbGUnOyBMT0FESU5HOiAnbG9hZGluZyc7IExPQURFRDogJ2xvYWRlZCc7IEVSUk9SOiAnZXJyb3InIH19ICovXG5cbmNvbnN0IExPQURfU1RBVEUgPSB7XG4gIElETEU6ICdpZGxlJyxcbiAgTE9BRElORzogJ2xvYWRpbmcnLFxuICBMT0FERUQ6ICdsb2FkZWQnLFxuICBFUlJPUjogJ2Vycm9yJ1xufTtcbi8qKlxyXG4gKiBDaGVjayBpZiBjbGljayBvciBrZXlkb3duIGV2ZW50IHdhcyBkaXNwYXRjaGVkXHJcbiAqIHdpdGggYSBzcGVjaWFsIGtleSBvciB2aWEgbW91c2Ugd2hlZWwuXHJcbiAqXHJcbiAqIEBwYXJhbSB7TW91c2VFdmVudCB8IEtleWJvYXJkRXZlbnR9IGVcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xuXG5mdW5jdGlvbiBzcGVjaWFsS2V5VXNlZChlKSB7XG4gIHJldHVybiAnYnV0dG9uJyBpbiBlICYmIGUuYnV0dG9uID09PSAxIHx8IGUuY3RybEtleSB8fCBlLm1ldGFLZXkgfHwgZS5hbHRLZXkgfHwgZS5zaGlmdEtleTtcbn1cbi8qKlxyXG4gKiBQYXJzZSBgZ2FsbGVyeWAgb3IgYGNoaWxkcmVuYCBvcHRpb25zLlxyXG4gKlxyXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi4vcGhvdG9zd2lwZS5qcycpLkVsZW1lbnRQcm92aWRlcn0gW29wdGlvbl1cclxuICogQHBhcmFtIHtzdHJpbmd9IFtsZWdhY3lTZWxlY3Rvcl1cclxuICogQHBhcmFtIHtIVE1MRWxlbWVudCB8IERvY3VtZW50fSBbcGFyZW50XVxyXG4gKiBAcmV0dXJucyBIVE1MRWxlbWVudFtdXHJcbiAqL1xuXG5mdW5jdGlvbiBnZXRFbGVtZW50c0Zyb21PcHRpb24ob3B0aW9uLCBsZWdhY3lTZWxlY3RvciwgcGFyZW50ID0gZG9jdW1lbnQpIHtcbiAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudFtdfSAqL1xuICBsZXQgZWxlbWVudHMgPSBbXTtcblxuICBpZiAob3B0aW9uIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgIGVsZW1lbnRzID0gW29wdGlvbl07XG4gIH0gZWxzZSBpZiAob3B0aW9uIGluc3RhbmNlb2YgTm9kZUxpc3QgfHwgQXJyYXkuaXNBcnJheShvcHRpb24pKSB7XG4gICAgZWxlbWVudHMgPSBBcnJheS5mcm9tKG9wdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgc2VsZWN0b3IgPSB0eXBlb2Ygb3B0aW9uID09PSAnc3RyaW5nJyA/IG9wdGlvbiA6IGxlZ2FjeVNlbGVjdG9yO1xuXG4gICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICBlbGVtZW50cyA9IEFycmF5LmZyb20ocGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWxlbWVudHM7XG59XG4vKipcclxuICogQ2hlY2sgaWYgYnJvd3NlciBpcyBTYWZhcmlcclxuICpcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xuXG5mdW5jdGlvbiBpc1NhZmFyaSgpIHtcbiAgcmV0dXJuICEhKG5hdmlnYXRvci52ZW5kb3IgJiYgbmF2aWdhdG9yLnZlbmRvci5tYXRjaCgvYXBwbGUvaSkpO1xufVxuXG4vLyBEZXRlY3QgcGFzc2l2ZSBldmVudCBsaXN0ZW5lciBzdXBwb3J0XG5sZXQgc3VwcG9ydHNQYXNzaXZlID0gZmFsc2U7XG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG50cnkge1xuICAvKiBAdHMtaWdub3JlICovXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0ZXN0JywgbnVsbCwgT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAncGFzc2l2ZScsIHtcbiAgICBnZXQ6ICgpID0+IHtcbiAgICAgIHN1cHBvcnRzUGFzc2l2ZSA9IHRydWU7XG4gICAgfVxuICB9KSk7XG59IGNhdGNoIChlKSB7fVxuLyogZXNsaW50LWVuYWJsZSAqL1xuXG4vKipcclxuICogQHR5cGVkZWYge09iamVjdH0gUG9vbEl0ZW1cclxuICogQHByb3Age0hUTUxFbGVtZW50IHwgV2luZG93IHwgRG9jdW1lbnQgfCB1bmRlZmluZWQgfCBudWxsfSB0YXJnZXRcclxuICogQHByb3Age3N0cmluZ30gdHlwZVxyXG4gKiBAcHJvcCB7RXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdH0gbGlzdGVuZXJcclxuICogQHByb3Age2Jvb2xlYW59IFtwYXNzaXZlXVxyXG4gKi9cblxuXG5jbGFzcyBET01FdmVudHMge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHtQb29sSXRlbVtdfVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xuICAgIHRoaXMuX3Bvb2wgPSBbXTtcbiAgfVxuICAvKipcclxuICAgKiBBZGRzIGV2ZW50IGxpc3RlbmVyc1xyXG4gICAqXHJcbiAgICogQHBhcmFtIHtQb29sSXRlbVsndGFyZ2V0J119IHRhcmdldFxyXG4gICAqIEBwYXJhbSB7UG9vbEl0ZW1bJ3R5cGUnXX0gdHlwZSBDYW4gYmUgbXVsdGlwbGUsIHNlcGFyYXRlZCBieSBzcGFjZS5cclxuICAgKiBAcGFyYW0ge1Bvb2xJdGVtWydsaXN0ZW5lciddfSBsaXN0ZW5lclxyXG4gICAqIEBwYXJhbSB7UG9vbEl0ZW1bJ3Bhc3NpdmUnXX0gW3Bhc3NpdmVdXHJcbiAgICovXG5cblxuICBhZGQodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lciwgcGFzc2l2ZSkge1xuICAgIHRoaXMuX3RvZ2dsZUxpc3RlbmVyKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIsIHBhc3NpdmUpO1xuICB9XG4gIC8qKlxyXG4gICAqIFJlbW92ZXMgZXZlbnQgbGlzdGVuZXJzXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1Bvb2xJdGVtWyd0YXJnZXQnXX0gdGFyZ2V0XHJcbiAgICogQHBhcmFtIHtQb29sSXRlbVsndHlwZSddfSB0eXBlXHJcbiAgICogQHBhcmFtIHtQb29sSXRlbVsnbGlzdGVuZXInXX0gbGlzdGVuZXJcclxuICAgKiBAcGFyYW0ge1Bvb2xJdGVtWydwYXNzaXZlJ119IFtwYXNzaXZlXVxyXG4gICAqL1xuXG5cbiAgcmVtb3ZlKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIsIHBhc3NpdmUpIHtcbiAgICB0aGlzLl90b2dnbGVMaXN0ZW5lcih0YXJnZXQsIHR5cGUsIGxpc3RlbmVyLCBwYXNzaXZlLCB0cnVlKTtcbiAgfVxuICAvKipcclxuICAgKiBSZW1vdmVzIGFsbCBib3VuZCBldmVudHNcclxuICAgKi9cblxuXG4gIHJlbW92ZUFsbCgpIHtcbiAgICB0aGlzLl9wb29sLmZvckVhY2gocG9vbEl0ZW0gPT4ge1xuICAgICAgdGhpcy5fdG9nZ2xlTGlzdGVuZXIocG9vbEl0ZW0udGFyZ2V0LCBwb29sSXRlbS50eXBlLCBwb29sSXRlbS5saXN0ZW5lciwgcG9vbEl0ZW0ucGFzc2l2ZSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9wb29sID0gW107XG4gIH1cbiAgLyoqXHJcbiAgICogQWRkcyBvciByZW1vdmVzIGV2ZW50XHJcbiAgICpcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEBwYXJhbSB7UG9vbEl0ZW1bJ3RhcmdldCddfSB0YXJnZXRcclxuICAgKiBAcGFyYW0ge1Bvb2xJdGVtWyd0eXBlJ119IHR5cGVcclxuICAgKiBAcGFyYW0ge1Bvb2xJdGVtWydsaXN0ZW5lciddfSBsaXN0ZW5lclxyXG4gICAqIEBwYXJhbSB7UG9vbEl0ZW1bJ3Bhc3NpdmUnXX0gW3Bhc3NpdmVdXHJcbiAgICogQHBhcmFtIHtib29sZWFufSBbdW5iaW5kXSBXaGV0aGVyIHRoZSBldmVudCBzaG91bGQgYmUgYWRkZWQgb3IgcmVtb3ZlZFxyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3NraXBQb29sXSBXaGV0aGVyIGV2ZW50cyBwb29sIHNob3VsZCBiZSBza2lwcGVkXHJcbiAgICovXG5cblxuICBfdG9nZ2xlTGlzdGVuZXIodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lciwgcGFzc2l2ZSwgdW5iaW5kLCBza2lwUG9vbCkge1xuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbWV0aG9kTmFtZSA9IHVuYmluZCA/ICdyZW1vdmVFdmVudExpc3RlbmVyJyA6ICdhZGRFdmVudExpc3RlbmVyJztcbiAgICBjb25zdCB0eXBlcyA9IHR5cGUuc3BsaXQoJyAnKTtcbiAgICB0eXBlcy5mb3JFYWNoKGVUeXBlID0+IHtcbiAgICAgIGlmIChlVHlwZSkge1xuICAgICAgICAvLyBFdmVudHMgcG9vbCBpcyB1c2VkIHRvIGVhc2lseSB1bmJpbmQgYWxsIGV2ZW50cyB3aGVuIFBob3RvU3dpcGUgaXMgY2xvc2VkLFxuICAgICAgICAvLyBzbyBkZXZlbG9wZXIgZG9lc24ndCBuZWVkIHRvIGRvIHRoaXMgbWFudWFsbHlcbiAgICAgICAgaWYgKCFza2lwUG9vbCkge1xuICAgICAgICAgIGlmICh1bmJpbmQpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBmcm9tIHRoZSBldmVudHMgcG9vbFxuICAgICAgICAgICAgdGhpcy5fcG9vbCA9IHRoaXMuX3Bvb2wuZmlsdGVyKHBvb2xJdGVtID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHBvb2xJdGVtLnR5cGUgIT09IGVUeXBlIHx8IHBvb2xJdGVtLmxpc3RlbmVyICE9PSBsaXN0ZW5lciB8fCBwb29sSXRlbS50YXJnZXQgIT09IHRhcmdldDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBBZGQgdG8gdGhlIGV2ZW50cyBwb29sXG4gICAgICAgICAgICB0aGlzLl9wb29sLnB1c2goe1xuICAgICAgICAgICAgICB0YXJnZXQsXG4gICAgICAgICAgICAgIHR5cGU6IGVUeXBlLFxuICAgICAgICAgICAgICBsaXN0ZW5lcixcbiAgICAgICAgICAgICAgcGFzc2l2ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IC8vIG1vc3QgUGhvdG9Td2lwZSBldmVudHMgY2FsbCBwcmV2ZW50RGVmYXVsdCxcbiAgICAgICAgLy8gYW5kIHdlIGRvIG5vdCBuZWVkIGJyb3dzZXIgdG8gc2Nyb2xsIHRoZSBwYWdlXG5cblxuICAgICAgICBjb25zdCBldmVudE9wdGlvbnMgPSBzdXBwb3J0c1Bhc3NpdmUgPyB7XG4gICAgICAgICAgcGFzc2l2ZTogcGFzc2l2ZSB8fCBmYWxzZVxuICAgICAgICB9IDogZmFsc2U7XG4gICAgICAgIHRhcmdldFttZXRob2ROYW1lXShlVHlwZSwgbGlzdGVuZXIsIGV2ZW50T3B0aW9ucyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufVxuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4vcGhvdG9zd2lwZS5qcycpLlBob3RvU3dpcGVPcHRpb25zfSBQaG90b1N3aXBlT3B0aW9ucyAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4vY29yZS9iYXNlLmpzJykuZGVmYXVsdH0gUGhvdG9Td2lwZUJhc2UgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3Bob3Rvc3dpcGUuanMnKS5Qb2ludH0gUG9pbnQgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3NsaWRlL3NsaWRlLmpzJykuU2xpZGVEYXRhfSBTbGlkZURhdGEgKi9cblxuLyoqXHJcbiAqIEBwYXJhbSB7UGhvdG9Td2lwZU9wdGlvbnN9IG9wdGlvbnNcclxuICogQHBhcmFtIHtQaG90b1N3aXBlQmFzZX0gcHN3cFxyXG4gKiBAcmV0dXJucyB7UG9pbnR9XHJcbiAqL1xuZnVuY3Rpb24gZ2V0Vmlld3BvcnRTaXplKG9wdGlvbnMsIHBzd3ApIHtcbiAgaWYgKG9wdGlvbnMuZ2V0Vmlld3BvcnRTaXplRm4pIHtcbiAgICBjb25zdCBuZXdWaWV3cG9ydFNpemUgPSBvcHRpb25zLmdldFZpZXdwb3J0U2l6ZUZuKG9wdGlvbnMsIHBzd3ApO1xuXG4gICAgaWYgKG5ld1ZpZXdwb3J0U2l6ZSkge1xuICAgICAgcmV0dXJuIG5ld1ZpZXdwb3J0U2l6ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCxcbiAgICAvLyBUT0RPOiBoZWlnaHQgb24gbW9iaWxlIGlzIHZlcnkgaW5jb3Npc3RlbnQgZHVlIHRvIHRvb2xiYXJcbiAgICAvLyBmaW5kIGEgd2F5IHRvIGltcHJvdmUgdGhpc1xuICAgIC8vXG4gICAgLy8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCAtIGRvZXNuJ3Qgc2VlbSB0byB3b3JrIHdlbGxcbiAgICB5OiB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgfTtcbn1cbi8qKlxyXG4gKiBQYXJzZXMgcGFkZGluZyBvcHRpb24uXHJcbiAqIFN1cHBvcnRlZCBmb3JtYXRzOlxyXG4gKlxyXG4gKiAvLyBPYmplY3RcclxuICogcGFkZGluZzoge1xyXG4gKiAgdG9wOiAwLFxyXG4gKiAgYm90dG9tOiAwLFxyXG4gKiAgbGVmdDogMCxcclxuICogIHJpZ2h0OiAwXHJcbiAqIH1cclxuICpcclxuICogLy8gQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIG9iamVjdFxyXG4gKiBwYWRkaW5nRm46ICh2aWV3cG9ydFNpemUsIGl0ZW1EYXRhLCBpbmRleCkgPT4ge1xyXG4gKiAgcmV0dXJuIHtcclxuICogICAgdG9wOiAwLFxyXG4gKiAgICBib3R0b206IDAsXHJcbiAqICAgIGxlZnQ6IDAsXHJcbiAqICAgIHJpZ2h0OiAwXHJcbiAqICB9O1xyXG4gKiB9XHJcbiAqXHJcbiAqIC8vIExlZ2FjeSB2YXJpYW50XHJcbiAqIHBhZGRpbmdMZWZ0OiAwLFxyXG4gKiBwYWRkaW5nUmlnaHQ6IDAsXHJcbiAqIHBhZGRpbmdUb3A6IDAsXHJcbiAqIHBhZGRpbmdCb3R0b206IDAsXHJcbiAqXHJcbiAqIEBwYXJhbSB7J2xlZnQnIHwgJ3RvcCcgfCAnYm90dG9tJyB8ICdyaWdodCd9IHByb3BcclxuICogQHBhcmFtIHtQaG90b1N3aXBlT3B0aW9uc30gb3B0aW9ucyBQaG90b1N3aXBlIG9wdGlvbnNcclxuICogQHBhcmFtIHtQb2ludH0gdmlld3BvcnRTaXplIFBob3RvU3dpcGUgdmlld3BvcnQgc2l6ZSwgZm9yIGV4YW1wbGU6IHsgeDo4MDAsIHk6NjAwIH1cclxuICogQHBhcmFtIHtTbGlkZURhdGF9IGl0ZW1EYXRhIERhdGEgYWJvdXQgdGhlIHNsaWRlXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBTbGlkZSBpbmRleFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gKi9cblxuZnVuY3Rpb24gcGFyc2VQYWRkaW5nT3B0aW9uKHByb3AsIG9wdGlvbnMsIHZpZXdwb3J0U2l6ZSwgaXRlbURhdGEsIGluZGV4KSB7XG4gIGxldCBwYWRkaW5nVmFsdWUgPSAwO1xuXG4gIGlmIChvcHRpb25zLnBhZGRpbmdGbikge1xuICAgIHBhZGRpbmdWYWx1ZSA9IG9wdGlvbnMucGFkZGluZ0ZuKHZpZXdwb3J0U2l6ZSwgaXRlbURhdGEsIGluZGV4KVtwcm9wXTtcbiAgfSBlbHNlIGlmIChvcHRpb25zLnBhZGRpbmcpIHtcbiAgICBwYWRkaW5nVmFsdWUgPSBvcHRpb25zLnBhZGRpbmdbcHJvcF07XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgbGVnYWN5UHJvcE5hbWUgPSAncGFkZGluZycgKyBwcm9wWzBdLnRvVXBwZXJDYXNlKCkgKyBwcm9wLnNsaWNlKDEpOyAvLyBAdHMtZXhwZWN0LWVycm9yXG5cbiAgICBpZiAob3B0aW9uc1tsZWdhY3lQcm9wTmFtZV0pIHtcbiAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgIHBhZGRpbmdWYWx1ZSA9IG9wdGlvbnNbbGVnYWN5UHJvcE5hbWVdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBOdW1iZXIocGFkZGluZ1ZhbHVlKSB8fCAwO1xufVxuLyoqXHJcbiAqIEBwYXJhbSB7UGhvdG9Td2lwZU9wdGlvbnN9IG9wdGlvbnNcclxuICogQHBhcmFtIHtQb2ludH0gdmlld3BvcnRTaXplXHJcbiAqIEBwYXJhbSB7U2xpZGVEYXRhfSBpdGVtRGF0YVxyXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcclxuICogQHJldHVybnMge1BvaW50fVxyXG4gKi9cblxuZnVuY3Rpb24gZ2V0UGFuQXJlYVNpemUob3B0aW9ucywgdmlld3BvcnRTaXplLCBpdGVtRGF0YSwgaW5kZXgpIHtcbiAgcmV0dXJuIHtcbiAgICB4OiB2aWV3cG9ydFNpemUueCAtIHBhcnNlUGFkZGluZ09wdGlvbignbGVmdCcsIG9wdGlvbnMsIHZpZXdwb3J0U2l6ZSwgaXRlbURhdGEsIGluZGV4KSAtIHBhcnNlUGFkZGluZ09wdGlvbigncmlnaHQnLCBvcHRpb25zLCB2aWV3cG9ydFNpemUsIGl0ZW1EYXRhLCBpbmRleCksXG4gICAgeTogdmlld3BvcnRTaXplLnkgLSBwYXJzZVBhZGRpbmdPcHRpb24oJ3RvcCcsIG9wdGlvbnMsIHZpZXdwb3J0U2l6ZSwgaXRlbURhdGEsIGluZGV4KSAtIHBhcnNlUGFkZGluZ09wdGlvbignYm90dG9tJywgb3B0aW9ucywgdmlld3BvcnRTaXplLCBpdGVtRGF0YSwgaW5kZXgpXG4gIH07XG59XG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NsaWRlLmpzJykuZGVmYXVsdH0gU2xpZGUgKi9cblxuLyoqIEB0eXBlZGVmIHtSZWNvcmQ8QXhpcywgbnVtYmVyPn0gUG9pbnQgKi9cblxuLyoqIEB0eXBlZGVmIHsneCcgfCAneSd9IEF4aXMgKi9cblxuLyoqXHJcbiAqIENhbGN1bGF0ZXMgbWluaW11bSwgbWF4aW11bSBhbmQgaW5pdGlhbCAoY2VudGVyKSBib3VuZHMgb2YgYSBzbGlkZVxyXG4gKi9cblxuY2xhc3MgUGFuQm91bmRzIHtcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtTbGlkZX0gc2xpZGVcclxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2xpZGUpIHtcbiAgICB0aGlzLnNsaWRlID0gc2xpZGU7XG4gICAgdGhpcy5jdXJyWm9vbUxldmVsID0gMTtcbiAgICB0aGlzLmNlbnRlciA9XG4gICAgLyoqIEB0eXBlIHtQb2ludH0gKi9cbiAgICB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH07XG4gICAgdGhpcy5tYXggPVxuICAgIC8qKiBAdHlwZSB7UG9pbnR9ICovXG4gICAge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9O1xuICAgIHRoaXMubWluID1cbiAgICAvKiogQHR5cGUge1BvaW50fSAqL1xuICAgIHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfTtcbiAgfVxuICAvKipcclxuICAgKiBfZ2V0SXRlbUJvdW5kc1xyXG4gICAqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGN1cnJab29tTGV2ZWxcclxuICAgKi9cblxuXG4gIHVwZGF0ZShjdXJyWm9vbUxldmVsKSB7XG4gICAgdGhpcy5jdXJyWm9vbUxldmVsID0gY3Vyclpvb21MZXZlbDtcblxuICAgIGlmICghdGhpcy5zbGlkZS53aWR0aCkge1xuICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl91cGRhdGVBeGlzKCd4Jyk7XG5cbiAgICAgIHRoaXMuX3VwZGF0ZUF4aXMoJ3knKTtcblxuICAgICAgdGhpcy5zbGlkZS5wc3dwLmRpc3BhdGNoKCdjYWxjQm91bmRzJywge1xuICAgICAgICBzbGlkZTogdGhpcy5zbGlkZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIF9jYWxjdWxhdGVJdGVtQm91bmRzRm9yQXhpc1xyXG4gICAqXHJcbiAgICogQHBhcmFtIHtBeGlzfSBheGlzXHJcbiAgICovXG5cblxuICBfdXBkYXRlQXhpcyhheGlzKSB7XG4gICAgY29uc3Qge1xuICAgICAgcHN3cFxuICAgIH0gPSB0aGlzLnNsaWRlO1xuICAgIGNvbnN0IGVsU2l6ZSA9IHRoaXMuc2xpZGVbYXhpcyA9PT0gJ3gnID8gJ3dpZHRoJyA6ICdoZWlnaHQnXSAqIHRoaXMuY3Vyclpvb21MZXZlbDtcbiAgICBjb25zdCBwYWRkaW5nUHJvcCA9IGF4aXMgPT09ICd4JyA/ICdsZWZ0JyA6ICd0b3AnO1xuICAgIGNvbnN0IHBhZGRpbmcgPSBwYXJzZVBhZGRpbmdPcHRpb24ocGFkZGluZ1Byb3AsIHBzd3Aub3B0aW9ucywgcHN3cC52aWV3cG9ydFNpemUsIHRoaXMuc2xpZGUuZGF0YSwgdGhpcy5zbGlkZS5pbmRleCk7XG4gICAgY29uc3QgcGFuQXJlYVNpemUgPSB0aGlzLnNsaWRlLnBhbkFyZWFTaXplW2F4aXNdOyAvLyBEZWZhdWx0IHBvc2l0aW9uIG9mIGVsZW1lbnQuXG4gICAgLy8gQnkgZGVmYXVsdCwgaXQgaXMgY2VudGVyIG9mIHZpZXdwb3J0OlxuXG4gICAgdGhpcy5jZW50ZXJbYXhpc10gPSBNYXRoLnJvdW5kKChwYW5BcmVhU2l6ZSAtIGVsU2l6ZSkgLyAyKSArIHBhZGRpbmc7IC8vIG1heGltdW0gcGFuIHBvc2l0aW9uXG5cbiAgICB0aGlzLm1heFtheGlzXSA9IGVsU2l6ZSA+IHBhbkFyZWFTaXplID8gTWF0aC5yb3VuZChwYW5BcmVhU2l6ZSAtIGVsU2l6ZSkgKyBwYWRkaW5nIDogdGhpcy5jZW50ZXJbYXhpc107IC8vIG1pbmltdW0gcGFuIHBvc2l0aW9uXG5cbiAgICB0aGlzLm1pbltheGlzXSA9IGVsU2l6ZSA+IHBhbkFyZWFTaXplID8gcGFkZGluZyA6IHRoaXMuY2VudGVyW2F4aXNdO1xuICB9IC8vIF9nZXRaZXJvQm91bmRzXG5cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmNlbnRlci54ID0gMDtcbiAgICB0aGlzLmNlbnRlci55ID0gMDtcbiAgICB0aGlzLm1heC54ID0gMDtcbiAgICB0aGlzLm1heC55ID0gMDtcbiAgICB0aGlzLm1pbi54ID0gMDtcbiAgICB0aGlzLm1pbi55ID0gMDtcbiAgfVxuICAvKipcclxuICAgKiBDb3JyZWN0IHBhbiBwb3NpdGlvbiBpZiBpdCdzIGJleW9uZCB0aGUgYm91bmRzXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0F4aXN9IGF4aXMgeCBvciB5XHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHBhbk9mZnNldFxyXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICovXG5cblxuICBjb3JyZWN0UGFuKGF4aXMsIHBhbk9mZnNldCkge1xuICAgIC8vIGNoZWNrUGFuQm91bmRzXG4gICAgcmV0dXJuIGNsYW1wKHBhbk9mZnNldCwgdGhpcy5tYXhbYXhpc10sIHRoaXMubWluW2F4aXNdKTtcbiAgfVxuXG59XG5cbmNvbnN0IE1BWF9JTUFHRV9XSURUSCA9IDQwMDA7XG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4vcGhvdG9zd2lwZS5qcycpLmRlZmF1bHR9IFBob3RvU3dpcGUgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3Bob3Rvc3dpcGUuanMnKS5QaG90b1N3aXBlT3B0aW9uc30gUGhvdG9Td2lwZU9wdGlvbnMgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3Bob3Rvc3dpcGUuanMnKS5Qb2ludH0gUG9pbnQgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3NsaWRlL3NsaWRlLmpzJykuU2xpZGVEYXRhfSBTbGlkZURhdGEgKi9cblxuLyoqIEB0eXBlZGVmIHsnZml0JyB8ICdmaWxsJyB8IG51bWJlciB8ICgoem9vbUxldmVsT2JqZWN0OiBab29tTGV2ZWwpID0+IG51bWJlcil9IFpvb21MZXZlbE9wdGlvbiAqL1xuXG4vKipcclxuICogQ2FsY3VsYXRlcyB6b29tIGxldmVscyBmb3Igc3BlY2lmaWMgc2xpZGUuXHJcbiAqIERlcGVuZHMgb24gdmlld3BvcnQgc2l6ZSBhbmQgaW1hZ2Ugc2l6ZS5cclxuICovXG5cbmNsYXNzIFpvb21MZXZlbCB7XG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7UGhvdG9Td2lwZU9wdGlvbnN9IG9wdGlvbnMgUGhvdG9Td2lwZSBvcHRpb25zXHJcbiAgICogQHBhcmFtIHtTbGlkZURhdGF9IGl0ZW1EYXRhIFNsaWRlIGRhdGFcclxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggU2xpZGUgaW5kZXhcclxuICAgKiBAcGFyYW0ge1Bob3RvU3dpcGV9IFtwc3dwXSBQaG90b1N3aXBlIGluc3RhbmNlLCBjYW4gYmUgdW5kZWZpbmVkIGlmIG5vdCBpbml0aWFsaXplZCB5ZXRcclxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucywgaXRlbURhdGEsIGluZGV4LCBwc3dwKSB7XG4gICAgdGhpcy5wc3dwID0gcHN3cDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuaXRlbURhdGEgPSBpdGVtRGF0YTtcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgLyoqIEB0eXBlIHsgUG9pbnQgfCBudWxsIH0gKi9cblxuICAgIHRoaXMucGFuQXJlYVNpemUgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7IFBvaW50IHwgbnVsbCB9ICovXG5cbiAgICB0aGlzLmVsZW1lbnRTaXplID0gbnVsbDtcbiAgICB0aGlzLmZpdCA9IDE7XG4gICAgdGhpcy5maWxsID0gMTtcbiAgICB0aGlzLnZGaWxsID0gMTtcbiAgICB0aGlzLmluaXRpYWwgPSAxO1xuICAgIHRoaXMuc2Vjb25kYXJ5ID0gMTtcbiAgICB0aGlzLm1heCA9IDE7XG4gICAgdGhpcy5taW4gPSAxO1xuICB9XG4gIC8qKlxyXG4gICAqIENhbGN1bGF0ZSBpbml0aWFsLCBzZWNvbmRhcnkgYW5kIG1heGltdW0gem9vbSBsZXZlbCBmb3IgdGhlIHNwZWNpZmllZCBzbGlkZS5cclxuICAgKlxyXG4gICAqIEl0IHNob3VsZCBiZSBjYWxsZWQgd2hlbiBlaXRoZXIgaW1hZ2Ugb3Igdmlld3BvcnQgc2l6ZSBjaGFuZ2VzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IG1heFdpZHRoXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IG1heEhlaWdodFxyXG4gICAqIEBwYXJhbSB7UG9pbnR9IHBhbkFyZWFTaXplXHJcbiAgICovXG5cblxuICB1cGRhdGUobWF4V2lkdGgsIG1heEhlaWdodCwgcGFuQXJlYVNpemUpIHtcbiAgICAvKiogQHR5cGUge1BvaW50fSAqL1xuICAgIGNvbnN0IGVsZW1lbnRTaXplID0ge1xuICAgICAgeDogbWF4V2lkdGgsXG4gICAgICB5OiBtYXhIZWlnaHRcbiAgICB9O1xuICAgIHRoaXMuZWxlbWVudFNpemUgPSBlbGVtZW50U2l6ZTtcbiAgICB0aGlzLnBhbkFyZWFTaXplID0gcGFuQXJlYVNpemU7XG4gICAgY29uc3QgaFJhdGlvID0gcGFuQXJlYVNpemUueCAvIGVsZW1lbnRTaXplLng7XG4gICAgY29uc3QgdlJhdGlvID0gcGFuQXJlYVNpemUueSAvIGVsZW1lbnRTaXplLnk7XG4gICAgdGhpcy5maXQgPSBNYXRoLm1pbigxLCBoUmF0aW8gPCB2UmF0aW8gPyBoUmF0aW8gOiB2UmF0aW8pO1xuICAgIHRoaXMuZmlsbCA9IE1hdGgubWluKDEsIGhSYXRpbyA+IHZSYXRpbyA/IGhSYXRpbyA6IHZSYXRpbyk7IC8vIHpvb20udkZpbGwgZGVmaW5lcyB6b29tIGxldmVsIG9mIHRoZSBpbWFnZVxuICAgIC8vIHdoZW4gaXQgaGFzIDEwMCUgb2Ygdmlld3BvcnQgdmVydGljYWwgc3BhY2UgKGhlaWdodClcblxuICAgIHRoaXMudkZpbGwgPSBNYXRoLm1pbigxLCB2UmF0aW8pO1xuICAgIHRoaXMuaW5pdGlhbCA9IHRoaXMuX2dldEluaXRpYWwoKTtcbiAgICB0aGlzLnNlY29uZGFyeSA9IHRoaXMuX2dldFNlY29uZGFyeSgpO1xuICAgIHRoaXMubWF4ID0gTWF0aC5tYXgodGhpcy5pbml0aWFsLCB0aGlzLnNlY29uZGFyeSwgdGhpcy5fZ2V0TWF4KCkpO1xuICAgIHRoaXMubWluID0gTWF0aC5taW4odGhpcy5maXQsIHRoaXMuaW5pdGlhbCwgdGhpcy5zZWNvbmRhcnkpO1xuXG4gICAgaWYgKHRoaXMucHN3cCkge1xuICAgICAgdGhpcy5wc3dwLmRpc3BhdGNoKCd6b29tTGV2ZWxzVXBkYXRlJywge1xuICAgICAgICB6b29tTGV2ZWxzOiB0aGlzLFxuICAgICAgICBzbGlkZURhdGE6IHRoaXMuaXRlbURhdGFcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBQYXJzZXMgdXNlci1kZWZpbmVkIHpvb20gb3B0aW9uLlxyXG4gICAqXHJcbiAgICogQHByaXZhdGVcclxuICAgKiBAcGFyYW0geydpbml0aWFsJyB8ICdzZWNvbmRhcnknIHwgJ21heCd9IG9wdGlvblByZWZpeCBab29tIGxldmVsIG9wdGlvbiBwcmVmaXggKGluaXRpYWwsIHNlY29uZGFyeSwgbWF4KVxyXG4gICAqIEByZXR1cm5zIHsgbnVtYmVyIHwgdW5kZWZpbmVkIH1cclxuICAgKi9cblxuXG4gIF9wYXJzZVpvb21MZXZlbE9wdGlvbihvcHRpb25QcmVmaXgpIHtcbiAgICBjb25zdCBvcHRpb25OYW1lID1cbiAgICAvKiogQHR5cGUgeydpbml0aWFsWm9vbUxldmVsJyB8ICdzZWNvbmRhcnlab29tTGV2ZWwnIHwgJ21heFpvb21MZXZlbCd9ICovXG4gICAgb3B0aW9uUHJlZml4ICsgJ1pvb21MZXZlbCc7XG4gICAgY29uc3Qgb3B0aW9uVmFsdWUgPSB0aGlzLm9wdGlvbnNbb3B0aW9uTmFtZV07XG5cbiAgICBpZiAoIW9wdGlvblZhbHVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25WYWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIG9wdGlvblZhbHVlKHRoaXMpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25WYWx1ZSA9PT0gJ2ZpbGwnKSB7XG4gICAgICByZXR1cm4gdGhpcy5maWxsO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25WYWx1ZSA9PT0gJ2ZpdCcpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpdDtcbiAgICB9XG5cbiAgICByZXR1cm4gTnVtYmVyKG9wdGlvblZhbHVlKTtcbiAgfVxuICAvKipcclxuICAgKiBHZXQgem9vbSBsZXZlbCB0byB3aGljaCBpbWFnZSB3aWxsIGJlIHpvb21lZCBhZnRlciBkb3VibGUtdGFwIGdlc3R1cmUsXHJcbiAgICogb3Igd2hlbiB1c2VyIGNsaWNrcyBvbiB6b29tIGljb24sXHJcbiAgICogb3IgbW91c2UtY2xpY2sgb24gaW1hZ2UgaXRzZWxmLlxyXG4gICAqIElmIHlvdSByZXR1cm4gMSBpbWFnZSB3aWxsIGJlIHpvb21lZCB0byBpdHMgb3JpZ2luYWwgc2l6ZS5cclxuICAgKlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogQHJldHVybiB7bnVtYmVyfVxyXG4gICAqL1xuXG5cbiAgX2dldFNlY29uZGFyeSgpIHtcbiAgICBsZXQgY3Vyclpvb21MZXZlbCA9IHRoaXMuX3BhcnNlWm9vbUxldmVsT3B0aW9uKCdzZWNvbmRhcnknKTtcblxuICAgIGlmIChjdXJyWm9vbUxldmVsKSB7XG4gICAgICByZXR1cm4gY3Vyclpvb21MZXZlbDtcbiAgICB9IC8vIDN4IG9mIFwiZml0XCIgc3RhdGUsIGJ1dCBub3QgbGFyZ2VyIHRoYW4gb3JpZ2luYWxcblxuXG4gICAgY3Vyclpvb21MZXZlbCA9IE1hdGgubWluKDEsIHRoaXMuZml0ICogMyk7XG5cbiAgICBpZiAodGhpcy5lbGVtZW50U2l6ZSAmJiBjdXJyWm9vbUxldmVsICogdGhpcy5lbGVtZW50U2l6ZS54ID4gTUFYX0lNQUdFX1dJRFRIKSB7XG4gICAgICBjdXJyWm9vbUxldmVsID0gTUFYX0lNQUdFX1dJRFRIIC8gdGhpcy5lbGVtZW50U2l6ZS54O1xuICAgIH1cblxuICAgIHJldHVybiBjdXJyWm9vbUxldmVsO1xuICB9XG4gIC8qKlxyXG4gICAqIEdldCBpbml0aWFsIGltYWdlIHpvb20gbGV2ZWwuXHJcbiAgICpcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgKi9cblxuXG4gIF9nZXRJbml0aWFsKCkge1xuICAgIHJldHVybiB0aGlzLl9wYXJzZVpvb21MZXZlbE9wdGlvbignaW5pdGlhbCcpIHx8IHRoaXMuZml0O1xuICB9XG4gIC8qKlxyXG4gICAqIE1heGltdW0gem9vbSBsZXZlbCB3aGVuIHVzZXIgem9vbXNcclxuICAgKiB2aWEgem9vbS9waW5jaCBnZXN0dXJlLFxyXG4gICAqIHZpYSBjbWQvY3RybC13aGVlbCBvciB2aWEgdHJhY2twYWQuXHJcbiAgICpcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgKi9cblxuXG4gIF9nZXRNYXgoKSB7XG4gICAgLy8gbWF4IHpvb20gbGV2ZWwgaXMgeDQgZnJvbSBcImZpdCBzdGF0ZVwiLFxuICAgIC8vIHVzZWQgZm9yIHpvb20gZ2VzdHVyZSBhbmQgY3RybC90cmFja3BhZCB6b29tXG4gICAgcmV0dXJuIHRoaXMuX3BhcnNlWm9vbUxldmVsT3B0aW9uKCdtYXgnKSB8fCBNYXRoLm1heCgxLCB0aGlzLmZpdCAqIDQpO1xuICB9XG5cbn1cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3Bob3Rvc3dpcGUuanMnKS5kZWZhdWx0fSBQaG90b1N3aXBlICovXG4vKipcclxuICogUmVuZGVycyBhbmQgYWxsb3dzIHRvIGNvbnRyb2wgYSBzaW5nbGUgc2xpZGVcclxuICovXG5cbmNsYXNzIFNsaWRlIHtcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtTbGlkZURhdGF9IGRhdGFcclxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcclxuICAgKiBAcGFyYW0ge1Bob3RvU3dpcGV9IHBzd3BcclxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YSwgaW5kZXgsIHBzd3ApIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICB0aGlzLnBzd3AgPSBwc3dwO1xuICAgIHRoaXMuaXNBY3RpdmUgPSBpbmRleCA9PT0gcHN3cC5jdXJySW5kZXg7XG4gICAgdGhpcy5jdXJyZW50UmVzb2x1dGlvbiA9IDA7XG4gICAgLyoqIEB0eXBlIHtQb2ludH0gKi9cblxuICAgIHRoaXMucGFuQXJlYVNpemUgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH07XG4gICAgLyoqIEB0eXBlIHtQb2ludH0gKi9cblxuICAgIHRoaXMucGFuID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9O1xuICAgIHRoaXMuaXNGaXJzdFNsaWRlID0gdGhpcy5pc0FjdGl2ZSAmJiAhcHN3cC5vcGVuZXIuaXNPcGVuO1xuICAgIHRoaXMuem9vbUxldmVscyA9IG5ldyBab29tTGV2ZWwocHN3cC5vcHRpb25zLCBkYXRhLCBpbmRleCwgcHN3cCk7XG4gICAgdGhpcy5wc3dwLmRpc3BhdGNoKCdnZXR0aW5nRGF0YScsIHtcbiAgICAgIHNsaWRlOiB0aGlzLFxuICAgICAgZGF0YTogdGhpcy5kYXRhLFxuICAgICAgaW5kZXhcbiAgICB9KTtcbiAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLnBzd3AuY29udGVudExvYWRlci5nZXRDb250ZW50QnlTbGlkZSh0aGlzKTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNyZWF0ZUVsZW1lbnQoJ3Bzd3BfX3pvb20td3JhcCcsICdkaXYnKTtcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50IHwgbnVsbH0gKi9cblxuICAgIHRoaXMuaG9sZGVyRWxlbWVudCA9IG51bGw7XG4gICAgdGhpcy5jdXJyWm9vbUxldmVsID0gMTtcbiAgICAvKiogQHR5cGUge251bWJlcn0gKi9cblxuICAgIHRoaXMud2lkdGggPSB0aGlzLmNvbnRlbnQud2lkdGg7XG4gICAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXG5cbiAgICB0aGlzLmhlaWdodCA9IHRoaXMuY29udGVudC5oZWlnaHQ7XG4gICAgdGhpcy5oZWF2eUFwcGVuZGVkID0gZmFsc2U7XG4gICAgdGhpcy5ib3VuZHMgPSBuZXcgUGFuQm91bmRzKHRoaXMpO1xuICAgIHRoaXMucHJldkRpc3BsYXllZFdpZHRoID0gLTE7XG4gICAgdGhpcy5wcmV2RGlzcGxheWVkSGVpZ2h0ID0gLTE7XG4gICAgdGhpcy5wc3dwLmRpc3BhdGNoKCdzbGlkZUluaXQnLCB7XG4gICAgICBzbGlkZTogdGhpc1xuICAgIH0pO1xuICB9XG4gIC8qKlxyXG4gICAqIElmIHRoaXMgc2xpZGUgaXMgYWN0aXZlL2N1cnJlbnQvdmlzaWJsZVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtib29sZWFufSBpc0FjdGl2ZVxyXG4gICAqL1xuXG5cbiAgc2V0SXNBY3RpdmUoaXNBY3RpdmUpIHtcbiAgICBpZiAoaXNBY3RpdmUgJiYgIXRoaXMuaXNBY3RpdmUpIHtcbiAgICAgIC8vIHNsaWRlIGp1c3QgYmVjYW1lIGFjdGl2ZVxuICAgICAgdGhpcy5hY3RpdmF0ZSgpO1xuICAgIH0gZWxzZSBpZiAoIWlzQWN0aXZlICYmIHRoaXMuaXNBY3RpdmUpIHtcbiAgICAgIC8vIHNsaWRlIGp1c3QgYmVjYW1lIG5vbi1hY3RpdmVcbiAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBBcHBlbmRzIHNsaWRlIGNvbnRlbnQgdG8gRE9NXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBob2xkZXJFbGVtZW50XHJcbiAgICovXG5cblxuICBhcHBlbmQoaG9sZGVyRWxlbWVudCkge1xuICAgIHRoaXMuaG9sZGVyRWxlbWVudCA9IGhvbGRlckVsZW1lbnQ7XG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gJzAgMCc7IC8vIFNsaWRlIGFwcGVuZGVkIHRvIERPTVxuXG4gICAgaWYgKCF0aGlzLmRhdGEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNhbGN1bGF0ZVNpemUoKTtcbiAgICB0aGlzLmxvYWQoKTtcbiAgICB0aGlzLnVwZGF0ZUNvbnRlbnRTaXplKCk7XG4gICAgdGhpcy5hcHBlbmRIZWF2eSgpO1xuICAgIHRoaXMuaG9sZGVyRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XG4gICAgdGhpcy56b29tQW5kUGFuVG9Jbml0aWFsKCk7XG4gICAgdGhpcy5wc3dwLmRpc3BhdGNoKCdmaXJzdFpvb21QYW4nLCB7XG4gICAgICBzbGlkZTogdGhpc1xuICAgIH0pO1xuICAgIHRoaXMuYXBwbHlDdXJyZW50Wm9vbVBhbigpO1xuICAgIHRoaXMucHN3cC5kaXNwYXRjaCgnYWZ0ZXJTZXRDb250ZW50Jywge1xuICAgICAgc2xpZGU6IHRoaXNcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmlzQWN0aXZlKSB7XG4gICAgICB0aGlzLmFjdGl2YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgbG9hZCgpIHtcbiAgICB0aGlzLmNvbnRlbnQubG9hZChmYWxzZSk7XG4gICAgdGhpcy5wc3dwLmRpc3BhdGNoKCdzbGlkZUxvYWQnLCB7XG4gICAgICBzbGlkZTogdGhpc1xuICAgIH0pO1xuICB9XG4gIC8qKlxyXG4gICAqIEFwcGVuZCBcImhlYXZ5XCIgRE9NIGVsZW1lbnRzXHJcbiAgICpcclxuICAgKiBUaGlzIG1heSBkZXBlbmQgb24gYSB0eXBlIG9mIHNsaWRlLFxyXG4gICAqIGJ1dCBnZW5lcmFsbHkgdGhlc2UgYXJlIGxhcmdlIGltYWdlcy5cclxuICAgKi9cblxuXG4gIGFwcGVuZEhlYXZ5KCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHBzd3BcbiAgICB9ID0gdGhpcztcbiAgICBjb25zdCBhcHBlbmRIZWF2eU5lYXJieSA9IHRydWU7IC8vIHRvZG9cbiAgICAvLyBBdm9pZCBhcHBlbmRpbmcgaGVhdnkgZWxlbWVudHMgZHVyaW5nIGFuaW1hdGlvbnNcblxuICAgIGlmICh0aGlzLmhlYXZ5QXBwZW5kZWQgfHwgIXBzd3Aub3BlbmVyLmlzT3BlbiB8fCBwc3dwLm1haW5TY3JvbGwuaXNTaGlmdGVkKCkgfHwgIXRoaXMuaXNBY3RpdmUgJiYgIWFwcGVuZEhlYXZ5TmVhcmJ5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHN3cC5kaXNwYXRjaCgnYXBwZW5kSGVhdnknLCB7XG4gICAgICBzbGlkZTogdGhpc1xuICAgIH0pLmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmhlYXZ5QXBwZW5kZWQgPSB0cnVlO1xuICAgIHRoaXMuY29udGVudC5hcHBlbmQoKTtcbiAgICB0aGlzLnBzd3AuZGlzcGF0Y2goJ2FwcGVuZEhlYXZ5Q29udGVudCcsIHtcbiAgICAgIHNsaWRlOiB0aGlzXG4gICAgfSk7XG4gIH1cbiAgLyoqXHJcbiAgICogVHJpZ2dlcmVkIHdoZW4gdGhpcyBzbGlkZSBpcyBhY3RpdmUgKHNlbGVjdGVkKS5cclxuICAgKlxyXG4gICAqIElmIGl0J3MgcGFydCBvZiBvcGVuaW5nL2Nsb3NpbmcgdHJhbnNpdGlvbiAtXHJcbiAgICogYWN0aXZhdGUoKSB3aWxsIHRyaWdnZXIgYWZ0ZXIgdGhlIHRyYW5zaXRpb24gaXMgZW5kZWQuXHJcbiAgICovXG5cblxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZTtcbiAgICB0aGlzLmFwcGVuZEhlYXZ5KCk7XG4gICAgdGhpcy5jb250ZW50LmFjdGl2YXRlKCk7XG4gICAgdGhpcy5wc3dwLmRpc3BhdGNoKCdzbGlkZUFjdGl2YXRlJywge1xuICAgICAgc2xpZGU6IHRoaXNcbiAgICB9KTtcbiAgfVxuICAvKipcclxuICAgKiBUcmlnZ2VyZWQgd2hlbiB0aGlzIHNsaWRlIGJlY29tZXMgaW5hY3RpdmUuXHJcbiAgICpcclxuICAgKiBTbGlkZSBjYW4gYmVjb21lIGluYWN0aXZlIG9ubHkgYWZ0ZXIgaXQgd2FzIGFjdGl2ZS5cclxuICAgKi9cblxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuY29udGVudC5kZWFjdGl2YXRlKCk7XG5cbiAgICBpZiAodGhpcy5jdXJyWm9vbUxldmVsICE9PSB0aGlzLnpvb21MZXZlbHMuaW5pdGlhbCkge1xuICAgICAgLy8gYWxsb3cgZmlsdGVyaW5nXG4gICAgICB0aGlzLmNhbGN1bGF0ZVNpemUoKTtcbiAgICB9IC8vIHJlc2V0IHpvb20gbGV2ZWxcblxuXG4gICAgdGhpcy5jdXJyZW50UmVzb2x1dGlvbiA9IDA7XG4gICAgdGhpcy56b29tQW5kUGFuVG9Jbml0aWFsKCk7XG4gICAgdGhpcy5hcHBseUN1cnJlbnRab29tUGFuKCk7XG4gICAgdGhpcy51cGRhdGVDb250ZW50U2l6ZSgpO1xuICAgIHRoaXMucHN3cC5kaXNwYXRjaCgnc2xpZGVEZWFjdGl2YXRlJywge1xuICAgICAgc2xpZGU6IHRoaXNcbiAgICB9KTtcbiAgfVxuICAvKipcclxuICAgKiBUaGUgc2xpZGUgc2hvdWxkIGRlc3Ryb3kgaXRzZWxmLCBpdCB3aWxsIG5ldmVyIGJlIHVzZWQgYWdhaW4uXHJcbiAgICogKHVuYmluZCBhbGwgZXZlbnRzIGFuZCBkZXN0cm95IGludGVybmFsIGNvbXBvbmVudHMpXHJcbiAgICovXG5cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuY29udGVudC5oYXNTbGlkZSA9IGZhbHNlO1xuICAgIHRoaXMuY29udGVudC5yZW1vdmUoKTtcbiAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmUoKTtcbiAgICB0aGlzLnBzd3AuZGlzcGF0Y2goJ3NsaWRlRGVzdHJveScsIHtcbiAgICAgIHNsaWRlOiB0aGlzXG4gICAgfSk7XG4gIH1cblxuICByZXNpemUoKSB7XG4gICAgaWYgKHRoaXMuY3Vyclpvb21MZXZlbCA9PT0gdGhpcy56b29tTGV2ZWxzLmluaXRpYWwgfHwgIXRoaXMuaXNBY3RpdmUpIHtcbiAgICAgIC8vIEtlZXAgaW5pdGlhbCB6b29tIGxldmVsIGlmIGl0IHdhcyBiZWZvcmUgdGhlIHJlc2l6ZSxcbiAgICAgIC8vIGFzIHdlbGwgYXMgd2hlbiB0aGlzIHNsaWRlIGlzIG5vdCBhY3RpdmVcbiAgICAgIC8vIFJlc2V0IHBvc2l0aW9uIGFuZCBzY2FsZSB0byBvcmlnaW5hbCBzdGF0ZVxuICAgICAgdGhpcy5jYWxjdWxhdGVTaXplKCk7XG4gICAgICB0aGlzLmN1cnJlbnRSZXNvbHV0aW9uID0gMDtcbiAgICAgIHRoaXMuem9vbUFuZFBhblRvSW5pdGlhbCgpO1xuICAgICAgdGhpcy5hcHBseUN1cnJlbnRab29tUGFuKCk7XG4gICAgICB0aGlzLnVwZGF0ZUNvbnRlbnRTaXplKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJlYWRqdXN0IHBhbiBwb3NpdGlvbiBpZiBpdCdzIGJleW9uZCB0aGUgYm91bmRzXG4gICAgICB0aGlzLmNhbGN1bGF0ZVNpemUoKTtcbiAgICAgIHRoaXMuYm91bmRzLnVwZGF0ZSh0aGlzLmN1cnJab29tTGV2ZWwpO1xuICAgICAgdGhpcy5wYW5Ubyh0aGlzLnBhbi54LCB0aGlzLnBhbi55KTtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogQXBwbHkgc2l6ZSB0byBjdXJyZW50IHNsaWRlIGNvbnRlbnQsXHJcbiAgICogYmFzZWQgb24gdGhlIGN1cnJlbnQgcmVzb2x1dGlvbiBhbmQgc2NhbGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtmb3JjZV0gaWYgc2l6ZSBzaG91bGQgYmUgdXBkYXRlZCBldmVuIGlmIGRpbWVuc2lvbnMgd2VyZW4ndCBjaGFuZ2VkXHJcbiAgICovXG5cblxuICB1cGRhdGVDb250ZW50U2l6ZShmb3JjZSkge1xuICAgIC8vIFVzZSBpbml0aWFsIHpvb20gbGV2ZWxcbiAgICAvLyBpZiByZXNvbHV0aW9uIGlzIG5vdCBkZWZpbmVkICh1c2VyIGRpZG4ndCB6b29tIHlldClcbiAgICBjb25zdCBzY2FsZU11bHRpcGxpZXIgPSB0aGlzLmN1cnJlbnRSZXNvbHV0aW9uIHx8IHRoaXMuem9vbUxldmVscy5pbml0aWFsO1xuXG4gICAgaWYgKCFzY2FsZU11bHRpcGxpZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB3aWR0aCA9IE1hdGgucm91bmQodGhpcy53aWR0aCAqIHNjYWxlTXVsdGlwbGllcikgfHwgdGhpcy5wc3dwLnZpZXdwb3J0U2l6ZS54O1xuICAgIGNvbnN0IGhlaWdodCA9IE1hdGgucm91bmQodGhpcy5oZWlnaHQgKiBzY2FsZU11bHRpcGxpZXIpIHx8IHRoaXMucHN3cC52aWV3cG9ydFNpemUueTtcblxuICAgIGlmICghdGhpcy5zaXplQ2hhbmdlZCh3aWR0aCwgaGVpZ2h0KSAmJiAhZm9yY2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnRlbnQuc2V0RGlzcGxheWVkU2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgfVxuICAvKipcclxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcclxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XHJcbiAgICovXG5cblxuICBzaXplQ2hhbmdlZCh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgaWYgKHdpZHRoICE9PSB0aGlzLnByZXZEaXNwbGF5ZWRXaWR0aCB8fCBoZWlnaHQgIT09IHRoaXMucHJldkRpc3BsYXllZEhlaWdodCkge1xuICAgICAgdGhpcy5wcmV2RGlzcGxheWVkV2lkdGggPSB3aWR0aDtcbiAgICAgIHRoaXMucHJldkRpc3BsYXllZEhlaWdodCA9IGhlaWdodDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvKiogQHJldHVybnMge0hUTUxJbWFnZUVsZW1lbnQgfCBIVE1MRGl2RWxlbWVudCB8IG51bGwgfCB1bmRlZmluZWR9ICovXG5cblxuICBnZXRQbGFjZWhvbGRlckVsZW1lbnQoKSB7XG4gICAgdmFyIF90aGlzJGNvbnRlbnQkcGxhY2VobztcblxuICAgIHJldHVybiAoX3RoaXMkY29udGVudCRwbGFjZWhvID0gdGhpcy5jb250ZW50LnBsYWNlaG9sZGVyKSA9PT0gbnVsbCB8fCBfdGhpcyRjb250ZW50JHBsYWNlaG8gPT09IHZvaWQgMCA/IHZvaWQgMCA6IF90aGlzJGNvbnRlbnQkcGxhY2Voby5lbGVtZW50O1xuICB9XG4gIC8qKlxyXG4gICAqIFpvb20gY3VycmVudCBzbGlkZSBpbWFnZSB0by4uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGRlc3Rab29tTGV2ZWwgRGVzdGluYXRpb24gem9vbSBsZXZlbC5cclxuICAgKiBAcGFyYW0ge1BvaW50fSBbY2VudGVyUG9pbnRdXHJcbiAgICogVHJhbnNmb3JtIG9yaWdpbiBjZW50ZXIgcG9pbnQsIG9yIGZhbHNlIGlmIHZpZXdwb3J0IGNlbnRlciBzaG91bGQgYmUgdXNlZC5cclxuICAgKiBAcGFyYW0ge251bWJlciB8IGZhbHNlfSBbdHJhbnNpdGlvbkR1cmF0aW9uXSBUcmFuc2l0aW9uIGR1cmF0aW9uLCBtYXkgYmUgc2V0IHRvIDAuXHJcbiAgICogQHBhcmFtIHtib29sZWFufSBbaWdub3JlQm91bmRzXSBNaW5pbXVtIGFuZCBtYXhpbXVtIHpvb20gbGV2ZWxzIHdpbGwgYmUgaWdub3JlZC5cclxuICAgKi9cblxuXG4gIHpvb21UbyhkZXN0Wm9vbUxldmVsLCBjZW50ZXJQb2ludCwgdHJhbnNpdGlvbkR1cmF0aW9uLCBpZ25vcmVCb3VuZHMpIHtcbiAgICBjb25zdCB7XG4gICAgICBwc3dwXG4gICAgfSA9IHRoaXM7XG5cbiAgICBpZiAoIXRoaXMuaXNab29tYWJsZSgpIHx8IHBzd3AubWFpblNjcm9sbC5pc1NoaWZ0ZWQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBzd3AuZGlzcGF0Y2goJ2JlZm9yZVpvb21UbycsIHtcbiAgICAgIGRlc3Rab29tTGV2ZWwsXG4gICAgICBjZW50ZXJQb2ludCxcbiAgICAgIHRyYW5zaXRpb25EdXJhdGlvblxuICAgIH0pOyAvLyBzdG9wIGFsbCBwYW4gYW5kIHpvb20gdHJhbnNpdGlvbnNcblxuICAgIHBzd3AuYW5pbWF0aW9ucy5zdG9wQWxsUGFuKCk7IC8vIGlmICghY2VudGVyUG9pbnQpIHtcbiAgICAvLyAgIGNlbnRlclBvaW50ID0gcHN3cC5nZXRWaWV3cG9ydENlbnRlclBvaW50KCk7XG4gICAgLy8gfVxuXG4gICAgY29uc3QgcHJldlpvb21MZXZlbCA9IHRoaXMuY3Vyclpvb21MZXZlbDtcblxuICAgIGlmICghaWdub3JlQm91bmRzKSB7XG4gICAgICBkZXN0Wm9vbUxldmVsID0gY2xhbXAoZGVzdFpvb21MZXZlbCwgdGhpcy56b29tTGV2ZWxzLm1pbiwgdGhpcy56b29tTGV2ZWxzLm1heCk7XG4gICAgfSAvLyBpZiAodHJhbnNpdGlvbkR1cmF0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAvLyAgIHRyYW5zaXRpb25EdXJhdGlvbiA9IHRoaXMucHN3cC5vcHRpb25zLnpvb21BbmltYXRpb25EdXJhdGlvbjtcbiAgICAvLyB9XG5cblxuICAgIHRoaXMuc2V0Wm9vbUxldmVsKGRlc3Rab29tTGV2ZWwpO1xuICAgIHRoaXMucGFuLnggPSB0aGlzLmNhbGN1bGF0ZVpvb21Ub1Bhbk9mZnNldCgneCcsIGNlbnRlclBvaW50LCBwcmV2Wm9vbUxldmVsKTtcbiAgICB0aGlzLnBhbi55ID0gdGhpcy5jYWxjdWxhdGVab29tVG9QYW5PZmZzZXQoJ3knLCBjZW50ZXJQb2ludCwgcHJldlpvb21MZXZlbCk7XG4gICAgcm91bmRQb2ludCh0aGlzLnBhbik7XG5cbiAgICBjb25zdCBmaW5pc2hUcmFuc2l0aW9uID0gKCkgPT4ge1xuICAgICAgdGhpcy5fc2V0UmVzb2x1dGlvbihkZXN0Wm9vbUxldmVsKTtcblxuICAgICAgdGhpcy5hcHBseUN1cnJlbnRab29tUGFuKCk7XG4gICAgfTtcblxuICAgIGlmICghdHJhbnNpdGlvbkR1cmF0aW9uKSB7XG4gICAgICBmaW5pc2hUcmFuc2l0aW9uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBzd3AuYW5pbWF0aW9ucy5zdGFydFRyYW5zaXRpb24oe1xuICAgICAgICBpc1BhbjogdHJ1ZSxcbiAgICAgICAgbmFtZTogJ3pvb21UbycsXG4gICAgICAgIHRhcmdldDogdGhpcy5jb250YWluZXIsXG4gICAgICAgIHRyYW5zZm9ybTogdGhpcy5nZXRDdXJyZW50VHJhbnNmb3JtKCksXG4gICAgICAgIG9uQ29tcGxldGU6IGZpbmlzaFRyYW5zaXRpb24sXG4gICAgICAgIGR1cmF0aW9uOiB0cmFuc2l0aW9uRHVyYXRpb24sXG4gICAgICAgIGVhc2luZzogcHN3cC5vcHRpb25zLmVhc2luZ1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7UG9pbnR9IFtjZW50ZXJQb2ludF1cclxuICAgKi9cblxuXG4gIHRvZ2dsZVpvb20oY2VudGVyUG9pbnQpIHtcbiAgICB0aGlzLnpvb21Ubyh0aGlzLmN1cnJab29tTGV2ZWwgPT09IHRoaXMuem9vbUxldmVscy5pbml0aWFsID8gdGhpcy56b29tTGV2ZWxzLnNlY29uZGFyeSA6IHRoaXMuem9vbUxldmVscy5pbml0aWFsLCBjZW50ZXJQb2ludCwgdGhpcy5wc3dwLm9wdGlvbnMuem9vbUFuaW1hdGlvbkR1cmF0aW9uKTtcbiAgfVxuICAvKipcclxuICAgKiBVcGRhdGVzIHpvb20gbGV2ZWwgcHJvcGVydHkgYW5kIHJlY2FsY3VsYXRlcyBuZXcgcGFuIGJvdW5kcyxcclxuICAgKiB1bmxpa2Ugem9vbVRvIGl0IGRvZXMgbm90IGFwcGx5IHRyYW5zZm9ybSAodXNlIGFwcGx5Q3VycmVudFpvb21QYW4pXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge251bWJlcn0gY3Vyclpvb21MZXZlbFxyXG4gICAqL1xuXG5cbiAgc2V0Wm9vbUxldmVsKGN1cnJab29tTGV2ZWwpIHtcbiAgICB0aGlzLmN1cnJab29tTGV2ZWwgPSBjdXJyWm9vbUxldmVsO1xuICAgIHRoaXMuYm91bmRzLnVwZGF0ZSh0aGlzLmN1cnJab29tTGV2ZWwpO1xuICB9XG4gIC8qKlxyXG4gICAqIEdldCBwYW4gcG9zaXRpb24gYWZ0ZXIgem9vbSBhdCBhIGdpdmVuIGBwb2ludGAuXHJcbiAgICpcclxuICAgKiBBbHdheXMgY2FsbCBzZXRab29tTGV2ZWwobmV3Wm9vbUxldmVsKSBiZWZvcmVoYW5kIHRvIHJlY2FsY3VsYXRlXHJcbiAgICogcGFuIGJvdW5kcyBhY2NvcmRpbmcgdG8gdGhlIG5ldyB6b29tIGxldmVsLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHsneCcgfCAneSd9IGF4aXNcclxuICAgKiBAcGFyYW0ge1BvaW50fSBbcG9pbnRdXHJcbiAgICogcG9pbnQgYmFzZWQgb24gd2hpY2ggem9vbSBpcyBwZXJmb3JtZWQsIHVzdWFsbHkgcmVmZXJzIHRvIHRoZSBjdXJyZW50IG1vdXNlIHBvc2l0aW9uLFxyXG4gICAqIGlmIGZhbHNlIC0gdmlld3BvcnQgY2VudGVyIHdpbGwgYmUgdXNlZC5cclxuICAgKiBAcGFyYW0ge251bWJlcn0gW3ByZXZab29tTGV2ZWxdIFpvb20gbGV2ZWwgYmVmb3JlIG5ldyB6b29tIHdhcyBhcHBsaWVkLlxyXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICovXG5cblxuICBjYWxjdWxhdGVab29tVG9QYW5PZmZzZXQoYXhpcywgcG9pbnQsIHByZXZab29tTGV2ZWwpIHtcbiAgICBjb25zdCB0b3RhbFBhbkRpc3RhbmNlID0gdGhpcy5ib3VuZHMubWF4W2F4aXNdIC0gdGhpcy5ib3VuZHMubWluW2F4aXNdO1xuXG4gICAgaWYgKHRvdGFsUGFuRGlzdGFuY2UgPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLmJvdW5kcy5jZW50ZXJbYXhpc107XG4gICAgfVxuXG4gICAgaWYgKCFwb2ludCkge1xuICAgICAgcG9pbnQgPSB0aGlzLnBzd3AuZ2V0Vmlld3BvcnRDZW50ZXJQb2ludCgpO1xuICAgIH1cblxuICAgIGlmICghcHJldlpvb21MZXZlbCkge1xuICAgICAgcHJldlpvb21MZXZlbCA9IHRoaXMuem9vbUxldmVscy5pbml0aWFsO1xuICAgIH1cblxuICAgIGNvbnN0IHpvb21GYWN0b3IgPSB0aGlzLmN1cnJab29tTGV2ZWwgLyBwcmV2Wm9vbUxldmVsO1xuICAgIHJldHVybiB0aGlzLmJvdW5kcy5jb3JyZWN0UGFuKGF4aXMsICh0aGlzLnBhbltheGlzXSAtIHBvaW50W2F4aXNdKSAqIHpvb21GYWN0b3IgKyBwb2ludFtheGlzXSk7XG4gIH1cbiAgLyoqXHJcbiAgICogQXBwbHkgcGFuIGFuZCBrZWVwIGl0IHdpdGhpbiBib3VuZHMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge251bWJlcn0gcGFuWFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwYW5ZXHJcbiAgICovXG5cblxuICBwYW5UbyhwYW5YLCBwYW5ZKSB7XG4gICAgdGhpcy5wYW4ueCA9IHRoaXMuYm91bmRzLmNvcnJlY3RQYW4oJ3gnLCBwYW5YKTtcbiAgICB0aGlzLnBhbi55ID0gdGhpcy5ib3VuZHMuY29ycmVjdFBhbigneScsIHBhblkpO1xuICAgIHRoaXMuYXBwbHlDdXJyZW50Wm9vbVBhbigpO1xuICB9XG4gIC8qKlxyXG4gICAqIElmIHRoZSBzbGlkZSBpbiB0aGUgY3VycmVudCBzdGF0ZSBjYW4gYmUgcGFubmVkIGJ5IHRoZSB1c2VyXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXG5cblxuICBpc1Bhbm5hYmxlKCkge1xuICAgIHJldHVybiBCb29sZWFuKHRoaXMud2lkdGgpICYmIHRoaXMuY3Vyclpvb21MZXZlbCA+IHRoaXMuem9vbUxldmVscy5maXQ7XG4gIH1cbiAgLyoqXHJcbiAgICogSWYgdGhlIHNsaWRlIGNhbiBiZSB6b29tZWRcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cblxuXG4gIGlzWm9vbWFibGUoKSB7XG4gICAgcmV0dXJuIEJvb2xlYW4odGhpcy53aWR0aCkgJiYgdGhpcy5jb250ZW50LmlzWm9vbWFibGUoKTtcbiAgfVxuICAvKipcclxuICAgKiBBcHBseSB0cmFuc2Zvcm0gYW5kIHNjYWxlIGJhc2VkIG9uXHJcbiAgICogdGhlIGN1cnJlbnQgcGFuIHBvc2l0aW9uICh0aGlzLnBhbikgYW5kIHpvb20gbGV2ZWwgKHRoaXMuY3Vyclpvb21MZXZlbClcclxuICAgKi9cblxuXG4gIGFwcGx5Q3VycmVudFpvb21QYW4oKSB7XG4gICAgdGhpcy5fYXBwbHlab29tVHJhbnNmb3JtKHRoaXMucGFuLngsIHRoaXMucGFuLnksIHRoaXMuY3Vyclpvb21MZXZlbCk7XG5cbiAgICBpZiAodGhpcyA9PT0gdGhpcy5wc3dwLmN1cnJTbGlkZSkge1xuICAgICAgdGhpcy5wc3dwLmRpc3BhdGNoKCd6b29tUGFuVXBkYXRlJywge1xuICAgICAgICBzbGlkZTogdGhpc1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgem9vbUFuZFBhblRvSW5pdGlhbCgpIHtcbiAgICB0aGlzLmN1cnJab29tTGV2ZWwgPSB0aGlzLnpvb21MZXZlbHMuaW5pdGlhbDsgLy8gcGFuIGFjY29yZGluZyB0byB0aGUgem9vbSBsZXZlbFxuXG4gICAgdGhpcy5ib3VuZHMudXBkYXRlKHRoaXMuY3Vyclpvb21MZXZlbCk7XG4gICAgZXF1YWxpemVQb2ludHModGhpcy5wYW4sIHRoaXMuYm91bmRzLmNlbnRlcik7XG4gICAgdGhpcy5wc3dwLmRpc3BhdGNoKCdpbml0aWFsWm9vbVBhbicsIHtcbiAgICAgIHNsaWRlOiB0aGlzXG4gICAgfSk7XG4gIH1cbiAgLyoqXHJcbiAgICogU2V0IHRyYW5zbGF0ZSBhbmQgc2NhbGUgYmFzZWQgb24gY3VycmVudCByZXNvbHV0aW9uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge251bWJlcn0geFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB5XHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHpvb21cclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xuXG5cbiAgX2FwcGx5Wm9vbVRyYW5zZm9ybSh4LCB5LCB6b29tKSB7XG4gICAgem9vbSAvPSB0aGlzLmN1cnJlbnRSZXNvbHV0aW9uIHx8IHRoaXMuem9vbUxldmVscy5pbml0aWFsO1xuICAgIHNldFRyYW5zZm9ybSh0aGlzLmNvbnRhaW5lciwgeCwgeSwgem9vbSk7XG4gIH1cblxuICBjYWxjdWxhdGVTaXplKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHBzd3BcbiAgICB9ID0gdGhpcztcbiAgICBlcXVhbGl6ZVBvaW50cyh0aGlzLnBhbkFyZWFTaXplLCBnZXRQYW5BcmVhU2l6ZShwc3dwLm9wdGlvbnMsIHBzd3Audmlld3BvcnRTaXplLCB0aGlzLmRhdGEsIHRoaXMuaW5kZXgpKTtcbiAgICB0aGlzLnpvb21MZXZlbHMudXBkYXRlKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCB0aGlzLnBhbkFyZWFTaXplKTtcbiAgICBwc3dwLmRpc3BhdGNoKCdjYWxjU2xpZGVTaXplJywge1xuICAgICAgc2xpZGU6IHRoaXNcbiAgICB9KTtcbiAgfVxuICAvKiogQHJldHVybnMge3N0cmluZ30gKi9cblxuXG4gIGdldEN1cnJlbnRUcmFuc2Zvcm0oKSB7XG4gICAgY29uc3Qgc2NhbGUgPSB0aGlzLmN1cnJab29tTGV2ZWwgLyAodGhpcy5jdXJyZW50UmVzb2x1dGlvbiB8fCB0aGlzLnpvb21MZXZlbHMuaW5pdGlhbCk7XG4gICAgcmV0dXJuIHRvVHJhbnNmb3JtU3RyaW5nKHRoaXMucGFuLngsIHRoaXMucGFuLnksIHNjYWxlKTtcbiAgfVxuICAvKipcclxuICAgKiBTZXQgcmVzb2x1dGlvbiBhbmQgcmUtcmVuZGVyIHRoZSBpbWFnZS5cclxuICAgKlxyXG4gICAqIEZvciBleGFtcGxlLCBpZiB0aGUgcmVhbCBpbWFnZSBzaXplIGlzIDIwMDB4MTUwMCxcclxuICAgKiBhbmQgcmVzb2x1dGlvbiBpcyAwLjUgLSBpdCB3aWxsIGJlIHJlbmRlcmVkIGFzIDEwMDB4NzUwLlxyXG4gICAqXHJcbiAgICogSW1hZ2Ugd2l0aCB6b29tIGxldmVsIDIgYW5kIHJlc29sdXRpb24gMC41IGlzXHJcbiAgICogdGhlIHNhbWUgYXMgaW1hZ2Ugd2l0aCB6b29tIGxldmVsIDEgYW5kIHJlc29sdXRpb24gMS5cclxuICAgKlxyXG4gICAqIFVzZWQgdG8gb3B0aW1pemUgYW5pbWF0aW9ucyBhbmQgbWFrZVxyXG4gICAqIHN1cmUgdGhhdCBicm93c2VyIHJlbmRlcnMgaW1hZ2UgaW4gdGhlIGhpZ2hlc3QgcXVhbGl0eS5cclxuICAgKiBBbHNvIHVzZWQgYnkgcmVzcG9uc2l2ZSBpbWFnZXMgdG8gbG9hZCB0aGUgY29ycmVjdCBvbmUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge251bWJlcn0gbmV3UmVzb2x1dGlvblxyXG4gICAqL1xuXG5cbiAgX3NldFJlc29sdXRpb24obmV3UmVzb2x1dGlvbikge1xuICAgIGlmIChuZXdSZXNvbHV0aW9uID09PSB0aGlzLmN1cnJlbnRSZXNvbHV0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50UmVzb2x1dGlvbiA9IG5ld1Jlc29sdXRpb247XG4gICAgdGhpcy51cGRhdGVDb250ZW50U2l6ZSgpO1xuICAgIHRoaXMucHN3cC5kaXNwYXRjaCgncmVzb2x1dGlvbkNoYW5nZWQnKTtcbiAgfVxuXG59XG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi9waG90b3N3aXBlLmpzJykuUG9pbnR9IFBvaW50ICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL2dlc3R1cmVzLmpzJykuZGVmYXVsdH0gR2VzdHVyZXMgKi9cblxuY29uc3QgUEFOX0VORF9GUklDVElPTiA9IDAuMzU7XG5jb25zdCBWRVJUSUNBTF9EUkFHX0ZSSUNUSU9OID0gMC42OyAvLyAxIGNvcnJlc3BvbmRzIHRvIHRoZSB0aGlyZCBvZiB2aWV3cG9ydCBoZWlnaHRcblxuY29uc3QgTUlOX1JBVElPX1RPX0NMT1NFID0gMC40OyAvLyBNaW5pbXVtIHNwZWVkIHJlcXVpcmVkIHRvIG5hdmlnYXRlXG4vLyB0byBuZXh0IG9yIHByZXZpb3VzIHNsaWRlXG5cbmNvbnN0IE1JTl9ORVhUX1NMSURFX1NQRUVEID0gMC41O1xuLyoqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbml0aWFsVmVsb2NpdHlcclxuICogQHBhcmFtIHtudW1iZXJ9IGRlY2VsZXJhdGlvblJhdGVcclxuICogQHJldHVybnMge251bWJlcn1cclxuICovXG5cbmZ1bmN0aW9uIHByb2plY3QoaW5pdGlhbFZlbG9jaXR5LCBkZWNlbGVyYXRpb25SYXRlKSB7XG4gIHJldHVybiBpbml0aWFsVmVsb2NpdHkgKiBkZWNlbGVyYXRpb25SYXRlIC8gKDEgLSBkZWNlbGVyYXRpb25SYXRlKTtcbn1cbi8qKlxyXG4gKiBIYW5kbGVzIHNpbmdsZSBwb2ludGVyIGRyYWdnaW5nXHJcbiAqL1xuXG5cbmNsYXNzIERyYWdIYW5kbGVyIHtcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtHZXN0dXJlc30gZ2VzdHVyZXNcclxuICAgKi9cbiAgY29uc3RydWN0b3IoZ2VzdHVyZXMpIHtcbiAgICB0aGlzLmdlc3R1cmVzID0gZ2VzdHVyZXM7XG4gICAgdGhpcy5wc3dwID0gZ2VzdHVyZXMucHN3cDtcbiAgICAvKiogQHR5cGUge1BvaW50fSAqL1xuXG4gICAgdGhpcy5zdGFydFBhbiA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmICh0aGlzLnBzd3AuY3VyclNsaWRlKSB7XG4gICAgICBlcXVhbGl6ZVBvaW50cyh0aGlzLnN0YXJ0UGFuLCB0aGlzLnBzd3AuY3VyclNsaWRlLnBhbik7XG4gICAgfVxuXG4gICAgdGhpcy5wc3dwLmFuaW1hdGlvbnMuc3RvcEFsbCgpO1xuICB9XG5cbiAgY2hhbmdlKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHAxLFxuICAgICAgcHJldlAxLFxuICAgICAgZHJhZ0F4aXNcbiAgICB9ID0gdGhpcy5nZXN0dXJlcztcbiAgICBjb25zdCB7XG4gICAgICBjdXJyU2xpZGVcbiAgICB9ID0gdGhpcy5wc3dwO1xuXG4gICAgaWYgKGRyYWdBeGlzID09PSAneScgJiYgdGhpcy5wc3dwLm9wdGlvbnMuY2xvc2VPblZlcnRpY2FsRHJhZyAmJiBjdXJyU2xpZGUgJiYgY3VyclNsaWRlLmN1cnJab29tTGV2ZWwgPD0gY3VyclNsaWRlLnpvb21MZXZlbHMuZml0ICYmICF0aGlzLmdlc3R1cmVzLmlzTXVsdGl0b3VjaCkge1xuICAgICAgLy8gSGFuZGxlIHZlcnRpY2FsIGRyYWcgdG8gY2xvc2VcbiAgICAgIGNvbnN0IHBhblkgPSBjdXJyU2xpZGUucGFuLnkgKyAocDEueSAtIHByZXZQMS55KTtcblxuICAgICAgaWYgKCF0aGlzLnBzd3AuZGlzcGF0Y2goJ3ZlcnRpY2FsRHJhZycsIHtcbiAgICAgICAgcGFuWVxuICAgICAgfSkuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICB0aGlzLl9zZXRQYW5XaXRoRnJpY3Rpb24oJ3knLCBwYW5ZLCBWRVJUSUNBTF9EUkFHX0ZSSUNUSU9OKTtcblxuICAgICAgICBjb25zdCBiZ09wYWNpdHkgPSAxIC0gTWF0aC5hYnModGhpcy5fZ2V0VmVydGljYWxEcmFnUmF0aW8oY3VyclNsaWRlLnBhbi55KSk7XG4gICAgICAgIHRoaXMucHN3cC5hcHBseUJnT3BhY2l0eShiZ09wYWNpdHkpO1xuICAgICAgICBjdXJyU2xpZGUuYXBwbHlDdXJyZW50Wm9vbVBhbigpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBtYWluU2Nyb2xsQ2hhbmdlZCA9IHRoaXMuX3Bhbk9yTW92ZU1haW5TY3JvbGwoJ3gnKTtcblxuICAgICAgaWYgKCFtYWluU2Nyb2xsQ2hhbmdlZCkge1xuICAgICAgICB0aGlzLl9wYW5Pck1vdmVNYWluU2Nyb2xsKCd5Jyk7XG5cbiAgICAgICAgaWYgKGN1cnJTbGlkZSkge1xuICAgICAgICAgIHJvdW5kUG9pbnQoY3VyclNsaWRlLnBhbik7XG4gICAgICAgICAgY3VyclNsaWRlLmFwcGx5Q3VycmVudFpvb21QYW4oKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVuZCgpIHtcbiAgICBjb25zdCB7XG4gICAgICB2ZWxvY2l0eVxuICAgIH0gPSB0aGlzLmdlc3R1cmVzO1xuICAgIGNvbnN0IHtcbiAgICAgIG1haW5TY3JvbGwsXG4gICAgICBjdXJyU2xpZGVcbiAgICB9ID0gdGhpcy5wc3dwO1xuICAgIGxldCBpbmRleERpZmYgPSAwO1xuICAgIHRoaXMucHN3cC5hbmltYXRpb25zLnN0b3BBbGwoKTsgLy8gSGFuZGxlIG1haW4gc2Nyb2xsIGlmIGl0J3Mgc2hpZnRlZFxuXG4gICAgaWYgKG1haW5TY3JvbGwuaXNTaGlmdGVkKCkpIHtcbiAgICAgIC8vIFBvc2l0aW9uIG9mIHRoZSBtYWluIHNjcm9sbCByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnRcbiAgICAgIGNvbnN0IG1haW5TY3JvbGxTaGlmdERpZmYgPSBtYWluU2Nyb2xsLnggLSBtYWluU2Nyb2xsLmdldEN1cnJTbGlkZVgoKTsgLy8gUmF0aW8gYmV0d2VlbiAwIGFuZCAxOlxuICAgICAgLy8gMCAtIHNsaWRlIGlzIG5vdCB2aXNpYmxlIGF0IGFsbCxcbiAgICAgIC8vIDAuNSAtIGhhbGYgb2YgdGhlIHNsaWRlIGlzIHZpc2libGVcbiAgICAgIC8vIDEgLSBzbGlkZSBpcyBmdWxseSB2aXNpYmxlXG5cbiAgICAgIGNvbnN0IGN1cnJlbnRTbGlkZVZpc2liaWxpdHlSYXRpbyA9IG1haW5TY3JvbGxTaGlmdERpZmYgLyB0aGlzLnBzd3Audmlld3BvcnRTaXplLng7IC8vIEdvIG5leHQgc2xpZGUuXG4gICAgICAvL1xuICAgICAgLy8gLSBpZiB2ZWxvY2l0eSBhbmQgaXRzIGRpcmVjdGlvbiBpcyBtYXRjaGVkLFxuICAgICAgLy8gICBhbmQgd2Ugc2VlIGF0IGxlYXN0IHRpbnkgcGFydCBvZiB0aGUgbmV4dCBzbGlkZVxuICAgICAgLy9cbiAgICAgIC8vIC0gb3IgaWYgd2Ugc2VlIGxlc3MgdGhhbiA1MCUgb2YgdGhlIGN1cnJlbnQgc2xpZGVcbiAgICAgIC8vICAgYW5kIHZlbG9jaXR5IGlzIGNsb3NlIHRvIDBcbiAgICAgIC8vXG5cbiAgICAgIGlmICh2ZWxvY2l0eS54IDwgLU1JTl9ORVhUX1NMSURFX1NQRUVEICYmIGN1cnJlbnRTbGlkZVZpc2liaWxpdHlSYXRpbyA8IDAgfHwgdmVsb2NpdHkueCA8IDAuMSAmJiBjdXJyZW50U2xpZGVWaXNpYmlsaXR5UmF0aW8gPCAtMC41KSB7XG4gICAgICAgIC8vIEdvIHRvIG5leHQgc2xpZGVcbiAgICAgICAgaW5kZXhEaWZmID0gMTtcbiAgICAgICAgdmVsb2NpdHkueCA9IE1hdGgubWluKHZlbG9jaXR5LngsIDApO1xuICAgICAgfSBlbHNlIGlmICh2ZWxvY2l0eS54ID4gTUlOX05FWFRfU0xJREVfU1BFRUQgJiYgY3VycmVudFNsaWRlVmlzaWJpbGl0eVJhdGlvID4gMCB8fCB2ZWxvY2l0eS54ID4gLTAuMSAmJiBjdXJyZW50U2xpZGVWaXNpYmlsaXR5UmF0aW8gPiAwLjUpIHtcbiAgICAgICAgLy8gR28gdG8gcHJldiBzbGlkZVxuICAgICAgICBpbmRleERpZmYgPSAtMTtcbiAgICAgICAgdmVsb2NpdHkueCA9IE1hdGgubWF4KHZlbG9jaXR5LngsIDApO1xuICAgICAgfVxuXG4gICAgICBtYWluU2Nyb2xsLm1vdmVJbmRleEJ5KGluZGV4RGlmZiwgdHJ1ZSwgdmVsb2NpdHkueCk7XG4gICAgfSAvLyBSZXN0b3JlIHpvb20gbGV2ZWxcblxuXG4gICAgaWYgKGN1cnJTbGlkZSAmJiBjdXJyU2xpZGUuY3Vyclpvb21MZXZlbCA+IGN1cnJTbGlkZS56b29tTGV2ZWxzLm1heCB8fCB0aGlzLmdlc3R1cmVzLmlzTXVsdGl0b3VjaCkge1xuICAgICAgdGhpcy5nZXN0dXJlcy56b29tTGV2ZWxzLmNvcnJlY3Rab29tUGFuKHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB3ZSBydW4gdHdvIGFuaW1hdGlvbnMgaW5zdGVhZCBvZiBvbmUsXG4gICAgICAvLyBhcyBlYWNoIGF4aXMgaGFzIG93biBwYW4gYm91bmRhcmllcyBhbmQgdGh1cyBkaWZmZXJlbnQgc3ByaW5nIGZ1bmN0aW9uXG4gICAgICAvLyAoY29ycmVjdFpvb21QYW4gZG9lcyBub3QgaGF2ZSB0aGlzIGZ1bmN0aW9uYWxpdHksXG4gICAgICAvLyAgaXQgYW5pbWF0ZXMgYWxsIHByb3BlcnRpZXMgd2l0aCBzaW5nbGUgdGltaW5nIGZ1bmN0aW9uKVxuICAgICAgdGhpcy5fZmluaXNoUGFuR2VzdHVyZUZvckF4aXMoJ3gnKTtcblxuICAgICAgdGhpcy5fZmluaXNoUGFuR2VzdHVyZUZvckF4aXMoJ3knKTtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogQHByaXZhdGVcclxuICAgKiBAcGFyYW0geyd4JyB8ICd5J30gYXhpc1xyXG4gICAqL1xuXG5cbiAgX2ZpbmlzaFBhbkdlc3R1cmVGb3JBeGlzKGF4aXMpIHtcbiAgICBjb25zdCB7XG4gICAgICB2ZWxvY2l0eVxuICAgIH0gPSB0aGlzLmdlc3R1cmVzO1xuICAgIGNvbnN0IHtcbiAgICAgIGN1cnJTbGlkZVxuICAgIH0gPSB0aGlzLnBzd3A7XG5cbiAgICBpZiAoIWN1cnJTbGlkZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHtcbiAgICAgIHBhbixcbiAgICAgIGJvdW5kc1xuICAgIH0gPSBjdXJyU2xpZGU7XG4gICAgY29uc3QgcGFuUG9zID0gcGFuW2F4aXNdO1xuICAgIGNvbnN0IHJlc3RvcmVCZ09wYWNpdHkgPSB0aGlzLnBzd3AuYmdPcGFjaXR5IDwgMSAmJiBheGlzID09PSAneSc7IC8vIDAuOTk1IG1lYW5zIC0gc2Nyb2xsIHZpZXcgbG9zZXMgMC41JSBvZiBpdHMgdmVsb2NpdHkgcGVyIG1pbGxpc2Vjb25kXG4gICAgLy8gSW5jcmVhc2luZyB0aGlzIG51bWJlciB3aWxsIHJlZHVjZSB0cmF2ZWwgZGlzdGFuY2VcblxuICAgIGNvbnN0IGRlY2VsZXJhdGlvblJhdGUgPSAwLjk5NTsgLy8gMC45OVxuICAgIC8vIFBhbiBwb3NpdGlvbiBpZiB0aGVyZSBpcyBubyBib3VuZHNcblxuICAgIGNvbnN0IHByb2plY3RlZFBvc2l0aW9uID0gcGFuUG9zICsgcHJvamVjdCh2ZWxvY2l0eVtheGlzXSwgZGVjZWxlcmF0aW9uUmF0ZSk7XG5cbiAgICBpZiAocmVzdG9yZUJnT3BhY2l0eSkge1xuICAgICAgY29uc3QgdkRyYWdSYXRpbyA9IHRoaXMuX2dldFZlcnRpY2FsRHJhZ1JhdGlvKHBhblBvcyk7XG5cbiAgICAgIGNvbnN0IHByb2plY3RlZFZEcmFnUmF0aW8gPSB0aGlzLl9nZXRWZXJ0aWNhbERyYWdSYXRpbyhwcm9qZWN0ZWRQb3NpdGlvbik7IC8vIElmIHdlIGFyZSBhYm92ZSBhbmQgbW92aW5nIHVwd2FyZHMsXG4gICAgICAvLyBvciBpZiB3ZSBhcmUgYmVsb3cgYW5kIG1vdmluZyBkb3dud2FyZHNcblxuXG4gICAgICBpZiAodkRyYWdSYXRpbyA8IDAgJiYgcHJvamVjdGVkVkRyYWdSYXRpbyA8IC1NSU5fUkFUSU9fVE9fQ0xPU0UgfHwgdkRyYWdSYXRpbyA+IDAgJiYgcHJvamVjdGVkVkRyYWdSYXRpbyA+IE1JTl9SQVRJT19UT19DTE9TRSkge1xuICAgICAgICB0aGlzLnBzd3AuY2xvc2UoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gLy8gUGFuIHBvc2l0aW9uIHdpdGggY29ycmVjdGVkIGJvdW5kc1xuXG5cbiAgICBjb25zdCBjb3JyZWN0ZWRQYW5Qb3NpdGlvbiA9IGJvdW5kcy5jb3JyZWN0UGFuKGF4aXMsIHByb2plY3RlZFBvc2l0aW9uKTsgLy8gRXhpdCBpZiBwYW4gcG9zaXRpb24gc2hvdWxkIG5vdCBiZSBjaGFuZ2VkXG4gICAgLy8gb3IgaWYgc3BlZWQgaXQgdG9vIGxvd1xuXG4gICAgaWYgKHBhblBvcyA9PT0gY29ycmVjdGVkUGFuUG9zaXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9IC8vIE92ZXJzaG9vdCBpZiB0aGUgZmluYWwgcG9zaXRpb24gaXMgb3V0IG9mIHBhbiBib3VuZHNcblxuXG4gICAgY29uc3QgZGFtcGluZ1JhdGlvID0gY29ycmVjdGVkUGFuUG9zaXRpb24gPT09IHByb2plY3RlZFBvc2l0aW9uID8gMSA6IDAuODI7XG4gICAgY29uc3QgaW5pdGlhbEJnT3BhY2l0eSA9IHRoaXMucHN3cC5iZ09wYWNpdHk7XG4gICAgY29uc3QgdG90YWxQYW5EaXN0ID0gY29ycmVjdGVkUGFuUG9zaXRpb24gLSBwYW5Qb3M7XG4gICAgdGhpcy5wc3dwLmFuaW1hdGlvbnMuc3RhcnRTcHJpbmcoe1xuICAgICAgbmFtZTogJ3Bhbkdlc3R1cmUnICsgYXhpcyxcbiAgICAgIGlzUGFuOiB0cnVlLFxuICAgICAgc3RhcnQ6IHBhblBvcyxcbiAgICAgIGVuZDogY29ycmVjdGVkUGFuUG9zaXRpb24sXG4gICAgICB2ZWxvY2l0eTogdmVsb2NpdHlbYXhpc10sXG4gICAgICBkYW1waW5nUmF0aW8sXG4gICAgICBvblVwZGF0ZTogcG9zID0+IHtcbiAgICAgICAgLy8gQW5pbWF0ZSBvcGFjaXR5IG9mIGJhY2tncm91bmQgcmVsYXRpdmUgdG8gWSBwYW4gcG9zaXRpb24gb2YgYW4gaW1hZ2VcbiAgICAgICAgaWYgKHJlc3RvcmVCZ09wYWNpdHkgJiYgdGhpcy5wc3dwLmJnT3BhY2l0eSA8IDEpIHtcbiAgICAgICAgICAvLyAwIC0gc3RhcnQgb2YgYW5pbWF0aW9uLCAxIC0gZW5kIG9mIGFuaW1hdGlvblxuICAgICAgICAgIGNvbnN0IGFuaW1hdGlvblByb2dyZXNzUmF0aW8gPSAxIC0gKGNvcnJlY3RlZFBhblBvc2l0aW9uIC0gcG9zKSAvIHRvdGFsUGFuRGlzdDsgLy8gV2UgY2xhbXAgb3BhY2l0eSB0byBrZWVwIGl0IGJldHdlZW4gMCBhbmQgMS5cbiAgICAgICAgICAvLyBBcyBwcm9ncmVzcyByYXRpbyBjYW4gYmUgbGFyZ2VyIHRoYW4gMSBkdWUgdG8gb3ZlcnNob290LFxuICAgICAgICAgIC8vIGFuZCB3ZSBkbyBub3Qgd2FudCB0byBib3VuY2Ugb3BhY2l0eS5cblxuICAgICAgICAgIHRoaXMucHN3cC5hcHBseUJnT3BhY2l0eShjbGFtcChpbml0aWFsQmdPcGFjaXR5ICsgKDEgLSBpbml0aWFsQmdPcGFjaXR5KSAqIGFuaW1hdGlvblByb2dyZXNzUmF0aW8sIDAsIDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhbltheGlzXSA9IE1hdGguZmxvb3IocG9zKTtcbiAgICAgICAgY3VyclNsaWRlLmFwcGx5Q3VycmVudFpvb21QYW4oKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvKipcclxuICAgKiBVcGRhdGUgcG9zaXRpb24gb2YgdGhlIG1haW4gc2Nyb2xsLFxyXG4gICAqIG9yL2FuZCB1cGRhdGUgcGFuIHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IHNsaWRlLlxyXG4gICAqXHJcbiAgICogU2hvdWxkIHJldHVybiB0cnVlIGlmIGl0IGNoYW5nZXMgKG9yIGNhbiBjaGFuZ2UpIG1haW4gc2Nyb2xsLlxyXG4gICAqXHJcbiAgICogQHByaXZhdGVcclxuICAgKiBAcGFyYW0geyd4JyB8ICd5J30gYXhpc1xyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xuXG5cbiAgX3Bhbk9yTW92ZU1haW5TY3JvbGwoYXhpcykge1xuICAgIGNvbnN0IHtcbiAgICAgIHAxLFxuICAgICAgZHJhZ0F4aXMsXG4gICAgICBwcmV2UDEsXG4gICAgICBpc011bHRpdG91Y2hcbiAgICB9ID0gdGhpcy5nZXN0dXJlcztcbiAgICBjb25zdCB7XG4gICAgICBjdXJyU2xpZGUsXG4gICAgICBtYWluU2Nyb2xsXG4gICAgfSA9IHRoaXMucHN3cDtcbiAgICBjb25zdCBkZWx0YSA9IHAxW2F4aXNdIC0gcHJldlAxW2F4aXNdO1xuICAgIGNvbnN0IG5ld01haW5TY3JvbGxYID0gbWFpblNjcm9sbC54ICsgZGVsdGE7XG5cbiAgICBpZiAoIWRlbHRhIHx8ICFjdXJyU2xpZGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IC8vIEFsd2F5cyBtb3ZlIG1haW4gc2Nyb2xsIGlmIGltYWdlIGNhbiBub3QgYmUgcGFubmVkXG5cblxuICAgIGlmIChheGlzID09PSAneCcgJiYgIWN1cnJTbGlkZS5pc1Bhbm5hYmxlKCkgJiYgIWlzTXVsdGl0b3VjaCkge1xuICAgICAgbWFpblNjcm9sbC5tb3ZlVG8obmV3TWFpblNjcm9sbFgsIHRydWUpO1xuICAgICAgcmV0dXJuIHRydWU7IC8vIGNoYW5nZWQgbWFpbiBzY3JvbGxcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICBib3VuZHNcbiAgICB9ID0gY3VyclNsaWRlO1xuICAgIGNvbnN0IG5ld1BhbiA9IGN1cnJTbGlkZS5wYW5bYXhpc10gKyBkZWx0YTtcblxuICAgIGlmICh0aGlzLnBzd3Aub3B0aW9ucy5hbGxvd1BhblRvTmV4dCAmJiBkcmFnQXhpcyA9PT0gJ3gnICYmIGF4aXMgPT09ICd4JyAmJiAhaXNNdWx0aXRvdWNoKSB7XG4gICAgICBjb25zdCBjdXJyU2xpZGVNYWluU2Nyb2xsWCA9IG1haW5TY3JvbGwuZ2V0Q3VyclNsaWRlWCgpOyAvLyBQb3NpdGlvbiBvZiB0aGUgbWFpbiBzY3JvbGwgcmVsYXRpdmUgdG8gdGhlIHZpZXdwb3J0XG5cbiAgICAgIGNvbnN0IG1haW5TY3JvbGxTaGlmdERpZmYgPSBtYWluU2Nyb2xsLnggLSBjdXJyU2xpZGVNYWluU2Nyb2xsWDtcbiAgICAgIGNvbnN0IGlzTGVmdFRvUmlnaHQgPSBkZWx0YSA+IDA7XG4gICAgICBjb25zdCBpc1JpZ2h0VG9MZWZ0ID0gIWlzTGVmdFRvUmlnaHQ7XG5cbiAgICAgIGlmIChuZXdQYW4gPiBib3VuZHMubWluW2F4aXNdICYmIGlzTGVmdFRvUmlnaHQpIHtcbiAgICAgICAgLy8gUGFubmluZyBmcm9tIGxlZnQgdG8gcmlnaHQsIGJleW9uZCB0aGUgbGVmdCBlZGdlXG4gICAgICAgIC8vIFdldGhlciB0aGUgaW1hZ2Ugd2FzIGF0IG1pbmltdW0gcGFuIHBvc2l0aW9uIChvciBsZXNzKVxuICAgICAgICAvLyB3aGVuIHRoaXMgZHJhZyBnZXN0dXJlIHN0YXJ0ZWQuXG4gICAgICAgIC8vIE1pbmltdW0gcGFuIHBvc2l0aW9uIHJlZmVycyB0byB0aGUgbGVmdCBlZGdlIG9mIHRoZSBpbWFnZS5cbiAgICAgICAgY29uc3Qgd2FzQXRNaW5QYW5Qb3NpdGlvbiA9IGJvdW5kcy5taW5bYXhpc10gPD0gdGhpcy5zdGFydFBhbltheGlzXTtcblxuICAgICAgICBpZiAod2FzQXRNaW5QYW5Qb3NpdGlvbikge1xuICAgICAgICAgIG1haW5TY3JvbGwubW92ZVRvKG5ld01haW5TY3JvbGxYLCB0cnVlKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9zZXRQYW5XaXRoRnJpY3Rpb24oYXhpcywgbmV3UGFuKTsgLy9jdXJyU2xpZGUucGFuW2F4aXNdID0gbmV3UGFuO1xuXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobmV3UGFuIDwgYm91bmRzLm1heFtheGlzXSAmJiBpc1JpZ2h0VG9MZWZ0KSB7XG4gICAgICAgIC8vIFBhbmluZyBmcm9tIHJpZ2h0IHRvIGxlZnQsIGJleW9uZCB0aGUgcmlnaHQgZWRnZVxuICAgICAgICAvLyBNYXhpbXVtIHBhbiBwb3NpdGlvbiByZWZlcnMgdG8gdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIGltYWdlLlxuICAgICAgICBjb25zdCB3YXNBdE1heFBhblBvc2l0aW9uID0gdGhpcy5zdGFydFBhbltheGlzXSA8PSBib3VuZHMubWF4W2F4aXNdO1xuXG4gICAgICAgIGlmICh3YXNBdE1heFBhblBvc2l0aW9uKSB7XG4gICAgICAgICAgbWFpblNjcm9sbC5tb3ZlVG8obmV3TWFpblNjcm9sbFgsIHRydWUpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3NldFBhbldpdGhGcmljdGlvbihheGlzLCBuZXdQYW4pOyAvL2N1cnJTbGlkZS5wYW5bYXhpc10gPSBuZXdQYW47XG5cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSWYgbWFpbiBzY3JvbGwgaXMgc2hpZnRlZFxuICAgICAgICBpZiAobWFpblNjcm9sbFNoaWZ0RGlmZiAhPT0gMCkge1xuICAgICAgICAgIC8vIElmIG1haW4gc2Nyb2xsIGlzIHNoaWZ0ZWQgcmlnaHRcbiAgICAgICAgICBpZiAobWFpblNjcm9sbFNoaWZ0RGlmZiA+IDBcbiAgICAgICAgICAvKiYmIGlzUmlnaHRUb0xlZnQqL1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgbWFpblNjcm9sbC5tb3ZlVG8oTWF0aC5tYXgobmV3TWFpblNjcm9sbFgsIGN1cnJTbGlkZU1haW5TY3JvbGxYKSwgdHJ1ZSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG1haW5TY3JvbGxTaGlmdERpZmYgPCAwXG4gICAgICAgICAgLyomJiBpc0xlZnRUb1JpZ2h0Ki9cbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIE1haW4gc2Nyb2xsIGlzIHNoaWZ0ZWQgbGVmdCAoUG9zaXRpb24gaXMgbGVzcyB0aGFuIDAgY29tcGFyaW5nIHRvIHRoZSB2aWV3cG9ydCAwKVxuICAgICAgICAgICAgbWFpblNjcm9sbC5tb3ZlVG8oTWF0aC5taW4obmV3TWFpblNjcm9sbFgsIGN1cnJTbGlkZU1haW5TY3JvbGxYKSwgdHJ1ZSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gV2UgYXJlIHdpdGhpbiBwYW4gYm91bmRzLCBzbyBqdXN0IHBhblxuICAgICAgICAgIHRoaXMuX3NldFBhbldpdGhGcmljdGlvbihheGlzLCBuZXdQYW4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChheGlzID09PSAneScpIHtcbiAgICAgICAgLy8gRG8gbm90IHBhbiB2ZXJ0aWNhbGx5IGlmIG1haW4gc2Nyb2xsIGlzIHNoaWZ0ZWQgb1xuICAgICAgICBpZiAoIW1haW5TY3JvbGwuaXNTaGlmdGVkKCkgJiYgYm91bmRzLm1pbi55ICE9PSBib3VuZHMubWF4LnkpIHtcbiAgICAgICAgICB0aGlzLl9zZXRQYW5XaXRoRnJpY3Rpb24oYXhpcywgbmV3UGFuKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2V0UGFuV2l0aEZyaWN0aW9uKGF4aXMsIG5ld1Bhbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IC8vIElmIHdlIG1vdmUgYWJvdmUgLSB0aGUgcmF0aW8gaXMgbmVnYXRpdmVcbiAgLy8gSWYgd2UgbW92ZSBiZWxvdyB0aGUgcmF0aW8gaXMgcG9zaXRpdmVcblxuICAvKipcclxuICAgKiBSZWxhdGlvbiBiZXR3ZWVuIHBhbiBZIHBvc2l0aW9uIGFuZCB0aGlyZCBvZiB2aWV3cG9ydCBoZWlnaHQuXHJcbiAgICpcclxuICAgKiBXaGVuIHdlIGFyZSBhdCBpbml0aWFsIHBvc2l0aW9uIChjZW50ZXIgYm91bmRzKSAtIHRoZSByYXRpbyBpcyAwLFxyXG4gICAqIGlmIHBvc2l0aW9uIGlzIHNoaWZ0ZWQgdXB3YXJkcyAtIHRoZSByYXRpbyBpcyBuZWdhdGl2ZSxcclxuICAgKiBpZiBwb3NpdGlvbiBpcyBzaGlmdGVkIGRvd253YXJkcyAtIHRoZSByYXRpbyBpcyBwb3NpdGl2ZS5cclxuICAgKlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHBhblkgVGhlIGN1cnJlbnQgcGFuIFkgcG9zaXRpb24uXHJcbiAgICogQHJldHVybnMge251bWJlcn1cclxuICAgKi9cblxuXG4gIF9nZXRWZXJ0aWNhbERyYWdSYXRpbyhwYW5ZKSB7XG4gICAgdmFyIF90aGlzJHBzd3AkY3VyclNsaWRlJCwgX3RoaXMkcHN3cCRjdXJyU2xpZGU7XG5cbiAgICByZXR1cm4gKHBhblkgLSAoKF90aGlzJHBzd3AkY3VyclNsaWRlJCA9IChfdGhpcyRwc3dwJGN1cnJTbGlkZSA9IHRoaXMucHN3cC5jdXJyU2xpZGUpID09PSBudWxsIHx8IF90aGlzJHBzd3AkY3VyclNsaWRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfdGhpcyRwc3dwJGN1cnJTbGlkZS5ib3VuZHMuY2VudGVyLnkpICE9PSBudWxsICYmIF90aGlzJHBzd3AkY3VyclNsaWRlJCAhPT0gdm9pZCAwID8gX3RoaXMkcHN3cCRjdXJyU2xpZGUkIDogMCkpIC8gKHRoaXMucHN3cC52aWV3cG9ydFNpemUueSAvIDMpO1xuICB9XG4gIC8qKlxyXG4gICAqIFNldCBwYW4gcG9zaXRpb24gb2YgdGhlIGN1cnJlbnQgc2xpZGUuXHJcbiAgICogQXBwbHkgZnJpY3Rpb24gaWYgdGhlIHBvc2l0aW9uIGlzIGJleW9uZCB0aGUgcGFuIGJvdW5kcyxcclxuICAgKiBvciBpZiBjdXN0b20gZnJpY3Rpb24gaXMgZGVmaW5lZC5cclxuICAgKlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogQHBhcmFtIHsneCcgfCAneSd9IGF4aXNcclxuICAgKiBAcGFyYW0ge251bWJlcn0gcG90ZW50aWFsUGFuXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtjdXN0b21GcmljdGlvbl0gKDAuMSAtIDEpXHJcbiAgICovXG5cblxuICBfc2V0UGFuV2l0aEZyaWN0aW9uKGF4aXMsIHBvdGVudGlhbFBhbiwgY3VzdG9tRnJpY3Rpb24pIHtcbiAgICBjb25zdCB7XG4gICAgICBjdXJyU2xpZGVcbiAgICB9ID0gdGhpcy5wc3dwO1xuXG4gICAgaWYgKCFjdXJyU2xpZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICBwYW4sXG4gICAgICBib3VuZHNcbiAgICB9ID0gY3VyclNsaWRlO1xuICAgIGNvbnN0IGNvcnJlY3RlZFBhbiA9IGJvdW5kcy5jb3JyZWN0UGFuKGF4aXMsIHBvdGVudGlhbFBhbik7IC8vIElmIHdlIGFyZSBvdXQgb2YgcGFuIGJvdW5kc1xuXG4gICAgaWYgKGNvcnJlY3RlZFBhbiAhPT0gcG90ZW50aWFsUGFuIHx8IGN1c3RvbUZyaWN0aW9uKSB7XG4gICAgICBjb25zdCBkZWx0YSA9IE1hdGgucm91bmQocG90ZW50aWFsUGFuIC0gcGFuW2F4aXNdKTtcbiAgICAgIHBhbltheGlzXSArPSBkZWx0YSAqIChjdXN0b21GcmljdGlvbiB8fCBQQU5fRU5EX0ZSSUNUSU9OKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFuW2F4aXNdID0gcG90ZW50aWFsUGFuO1xuICAgIH1cbiAgfVxuXG59XG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi9waG90b3N3aXBlLmpzJykuUG9pbnR9IFBvaW50ICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL2dlc3R1cmVzLmpzJykuZGVmYXVsdH0gR2VzdHVyZXMgKi9cblxuY29uc3QgVVBQRVJfWk9PTV9GUklDVElPTiA9IDAuMDU7XG5jb25zdCBMT1dFUl9aT09NX0ZSSUNUSU9OID0gMC4xNTtcbi8qKlxyXG4gKiBHZXQgY2VudGVyIHBvaW50IGJldHdlZW4gdHdvIHBvaW50c1xyXG4gKlxyXG4gKiBAcGFyYW0ge1BvaW50fSBwXHJcbiAqIEBwYXJhbSB7UG9pbnR9IHAxXHJcbiAqIEBwYXJhbSB7UG9pbnR9IHAyXHJcbiAqIEByZXR1cm5zIHtQb2ludH1cclxuICovXG5cbmZ1bmN0aW9uIGdldFpvb21Qb2ludHNDZW50ZXIocCwgcDEsIHAyKSB7XG4gIHAueCA9IChwMS54ICsgcDIueCkgLyAyO1xuICBwLnkgPSAocDEueSArIHAyLnkpIC8gMjtcbiAgcmV0dXJuIHA7XG59XG5cbmNsYXNzIFpvb21IYW5kbGVyIHtcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtHZXN0dXJlc30gZ2VzdHVyZXNcclxuICAgKi9cbiAgY29uc3RydWN0b3IoZ2VzdHVyZXMpIHtcbiAgICB0aGlzLmdlc3R1cmVzID0gZ2VzdHVyZXM7XG4gICAgLyoqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHR5cGUge1BvaW50fVxyXG4gICAgICovXG5cbiAgICB0aGlzLl9zdGFydFBhbiA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfTtcbiAgICAvKipcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAdHlwZSB7UG9pbnR9XHJcbiAgICAgKi9cblxuICAgIHRoaXMuX3N0YXJ0Wm9vbVBvaW50ID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9O1xuICAgIC8qKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEB0eXBlIHtQb2ludH1cclxuICAgICAqL1xuXG4gICAgdGhpcy5fem9vbVBvaW50ID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9O1xuICAgIC8qKiBAcHJpdmF0ZSAqL1xuXG4gICAgdGhpcy5fd2FzT3ZlckZpdFpvb21MZXZlbCA9IGZhbHNlO1xuICAgIC8qKiBAcHJpdmF0ZSAqL1xuXG4gICAgdGhpcy5fc3RhcnRab29tTGV2ZWwgPSAxO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgY29uc3Qge1xuICAgICAgY3VyclNsaWRlXG4gICAgfSA9IHRoaXMuZ2VzdHVyZXMucHN3cDtcblxuICAgIGlmIChjdXJyU2xpZGUpIHtcbiAgICAgIHRoaXMuX3N0YXJ0Wm9vbUxldmVsID0gY3VyclNsaWRlLmN1cnJab29tTGV2ZWw7XG4gICAgICBlcXVhbGl6ZVBvaW50cyh0aGlzLl9zdGFydFBhbiwgY3VyclNsaWRlLnBhbik7XG4gICAgfVxuXG4gICAgdGhpcy5nZXN0dXJlcy5wc3dwLmFuaW1hdGlvbnMuc3RvcEFsbFBhbigpO1xuICAgIHRoaXMuX3dhc092ZXJGaXRab29tTGV2ZWwgPSBmYWxzZTtcbiAgfVxuXG4gIGNoYW5nZSgpIHtcbiAgICBjb25zdCB7XG4gICAgICBwMSxcbiAgICAgIHN0YXJ0UDEsXG4gICAgICBwMixcbiAgICAgIHN0YXJ0UDIsXG4gICAgICBwc3dwXG4gICAgfSA9IHRoaXMuZ2VzdHVyZXM7XG4gICAgY29uc3Qge1xuICAgICAgY3VyclNsaWRlXG4gICAgfSA9IHBzd3A7XG5cbiAgICBpZiAoIWN1cnJTbGlkZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1pblpvb21MZXZlbCA9IGN1cnJTbGlkZS56b29tTGV2ZWxzLm1pbjtcbiAgICBjb25zdCBtYXhab29tTGV2ZWwgPSBjdXJyU2xpZGUuem9vbUxldmVscy5tYXg7XG5cbiAgICBpZiAoIWN1cnJTbGlkZS5pc1pvb21hYmxlKCkgfHwgcHN3cC5tYWluU2Nyb2xsLmlzU2hpZnRlZCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZ2V0Wm9vbVBvaW50c0NlbnRlcih0aGlzLl9zdGFydFpvb21Qb2ludCwgc3RhcnRQMSwgc3RhcnRQMik7XG4gICAgZ2V0Wm9vbVBvaW50c0NlbnRlcih0aGlzLl96b29tUG9pbnQsIHAxLCBwMik7XG5cbiAgICBsZXQgY3Vyclpvb21MZXZlbCA9IDEgLyBnZXREaXN0YW5jZUJldHdlZW4oc3RhcnRQMSwgc3RhcnRQMikgKiBnZXREaXN0YW5jZUJldHdlZW4ocDEsIHAyKSAqIHRoaXMuX3N0YXJ0Wm9vbUxldmVsOyAvLyBzbGlnaHRseSBvdmVyIHRoZSB6b29tLmZpdFxuXG5cbiAgICBpZiAoY3Vyclpvb21MZXZlbCA+IGN1cnJTbGlkZS56b29tTGV2ZWxzLmluaXRpYWwgKyBjdXJyU2xpZGUuem9vbUxldmVscy5pbml0aWFsIC8gMTUpIHtcbiAgICAgIHRoaXMuX3dhc092ZXJGaXRab29tTGV2ZWwgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChjdXJyWm9vbUxldmVsIDwgbWluWm9vbUxldmVsKSB7XG4gICAgICBpZiAocHN3cC5vcHRpb25zLnBpbmNoVG9DbG9zZSAmJiAhdGhpcy5fd2FzT3ZlckZpdFpvb21MZXZlbCAmJiB0aGlzLl9zdGFydFpvb21MZXZlbCA8PSBjdXJyU2xpZGUuem9vbUxldmVscy5pbml0aWFsKSB7XG4gICAgICAgIC8vIGZhZGUgb3V0IGJhY2tncm91bmQgaWYgem9vbWluZyBvdXRcbiAgICAgICAgY29uc3QgYmdPcGFjaXR5ID0gMSAtIChtaW5ab29tTGV2ZWwgLSBjdXJyWm9vbUxldmVsKSAvIChtaW5ab29tTGV2ZWwgLyAxLjIpO1xuXG4gICAgICAgIGlmICghcHN3cC5kaXNwYXRjaCgncGluY2hDbG9zZScsIHtcbiAgICAgICAgICBiZ09wYWNpdHlcbiAgICAgICAgfSkuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgIHBzd3AuYXBwbHlCZ09wYWNpdHkoYmdPcGFjaXR5KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXBwbHkgdGhlIGZyaWN0aW9uIGlmIHpvb20gbGV2ZWwgaXMgYmVsb3cgdGhlIG1pblxuICAgICAgICBjdXJyWm9vbUxldmVsID0gbWluWm9vbUxldmVsIC0gKG1pblpvb21MZXZlbCAtIGN1cnJab29tTGV2ZWwpICogTE9XRVJfWk9PTV9GUklDVElPTjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGN1cnJab29tTGV2ZWwgPiBtYXhab29tTGV2ZWwpIHtcbiAgICAgIC8vIEFwcGx5IHRoZSBmcmljdGlvbiBpZiB6b29tIGxldmVsIGlzIGFib3ZlIHRoZSBtYXhcbiAgICAgIGN1cnJab29tTGV2ZWwgPSBtYXhab29tTGV2ZWwgKyAoY3Vyclpvb21MZXZlbCAtIG1heFpvb21MZXZlbCkgKiBVUFBFUl9aT09NX0ZSSUNUSU9OO1xuICAgIH1cblxuICAgIGN1cnJTbGlkZS5wYW4ueCA9IHRoaXMuX2NhbGN1bGF0ZVBhbkZvclpvb21MZXZlbCgneCcsIGN1cnJab29tTGV2ZWwpO1xuICAgIGN1cnJTbGlkZS5wYW4ueSA9IHRoaXMuX2NhbGN1bGF0ZVBhbkZvclpvb21MZXZlbCgneScsIGN1cnJab29tTGV2ZWwpO1xuICAgIGN1cnJTbGlkZS5zZXRab29tTGV2ZWwoY3Vyclpvb21MZXZlbCk7XG4gICAgY3VyclNsaWRlLmFwcGx5Q3VycmVudFpvb21QYW4oKTtcbiAgfVxuXG4gIGVuZCgpIHtcbiAgICBjb25zdCB7XG4gICAgICBwc3dwXG4gICAgfSA9IHRoaXMuZ2VzdHVyZXM7XG4gICAgY29uc3Qge1xuICAgICAgY3VyclNsaWRlXG4gICAgfSA9IHBzd3A7XG5cbiAgICBpZiAoKCFjdXJyU2xpZGUgfHwgY3VyclNsaWRlLmN1cnJab29tTGV2ZWwgPCBjdXJyU2xpZGUuem9vbUxldmVscy5pbml0aWFsKSAmJiAhdGhpcy5fd2FzT3ZlckZpdFpvb21MZXZlbCAmJiBwc3dwLm9wdGlvbnMucGluY2hUb0Nsb3NlKSB7XG4gICAgICBwc3dwLmNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29ycmVjdFpvb21QYW4oKTtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogQHByaXZhdGVcclxuICAgKiBAcGFyYW0geyd4JyB8ICd5J30gYXhpc1xyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyWm9vbUxldmVsXHJcbiAgICogQHJldHVybnMge251bWJlcn1cclxuICAgKi9cblxuXG4gIF9jYWxjdWxhdGVQYW5Gb3Jab29tTGV2ZWwoYXhpcywgY3Vyclpvb21MZXZlbCkge1xuICAgIGNvbnN0IHpvb21GYWN0b3IgPSBjdXJyWm9vbUxldmVsIC8gdGhpcy5fc3RhcnRab29tTGV2ZWw7XG4gICAgcmV0dXJuIHRoaXMuX3pvb21Qb2ludFtheGlzXSAtICh0aGlzLl9zdGFydFpvb21Qb2ludFtheGlzXSAtIHRoaXMuX3N0YXJ0UGFuW2F4aXNdKSAqIHpvb21GYWN0b3I7XG4gIH1cbiAgLyoqXHJcbiAgICogQ29ycmVjdCBjdXJyWm9vbUxldmVsIGFuZCBwYW4gaWYgdGhleSBhcmVcclxuICAgKiBiZXlvbmQgbWluaW11bSBvciBtYXhpbXVtIHZhbHVlcy5cclxuICAgKiBXaXRoIGFuaW1hdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lnbm9yZUdlc3R1cmVdXHJcbiAgICogV2V0aGVyIGdlc3R1cmUgY29vcmRpbmF0ZXMgc2hvdWxkIGJlIGlnbm9yZWQgd2hlbiBjYWxjdWxhdGluZyBkZXN0aW5hdGlvbiBwYW4gcG9zaXRpb24uXHJcbiAgICovXG5cblxuICBjb3JyZWN0Wm9vbVBhbihpZ25vcmVHZXN0dXJlKSB7XG4gICAgY29uc3Qge1xuICAgICAgcHN3cFxuICAgIH0gPSB0aGlzLmdlc3R1cmVzO1xuICAgIGNvbnN0IHtcbiAgICAgIGN1cnJTbGlkZVxuICAgIH0gPSBwc3dwO1xuXG4gICAgaWYgKCEoY3VyclNsaWRlICE9PSBudWxsICYmIGN1cnJTbGlkZSAhPT0gdm9pZCAwICYmIGN1cnJTbGlkZS5pc1pvb21hYmxlKCkpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3pvb21Qb2ludC54ID09PSAwKSB7XG4gICAgICBpZ25vcmVHZXN0dXJlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBwcmV2Wm9vbUxldmVsID0gY3VyclNsaWRlLmN1cnJab29tTGV2ZWw7XG4gICAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXG5cbiAgICBsZXQgZGVzdGluYXRpb25ab29tTGV2ZWw7XG4gICAgbGV0IGN1cnJab29tTGV2ZWxOZWVkc0NoYW5nZSA9IHRydWU7XG5cbiAgICBpZiAocHJldlpvb21MZXZlbCA8IGN1cnJTbGlkZS56b29tTGV2ZWxzLmluaXRpYWwpIHtcbiAgICAgIGRlc3RpbmF0aW9uWm9vbUxldmVsID0gY3VyclNsaWRlLnpvb21MZXZlbHMuaW5pdGlhbDsgLy8gem9vbSB0byBtaW5cbiAgICB9IGVsc2UgaWYgKHByZXZab29tTGV2ZWwgPiBjdXJyU2xpZGUuem9vbUxldmVscy5tYXgpIHtcbiAgICAgIGRlc3RpbmF0aW9uWm9vbUxldmVsID0gY3VyclNsaWRlLnpvb21MZXZlbHMubWF4OyAvLyB6b29tIHRvIG1heFxuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyWm9vbUxldmVsTmVlZHNDaGFuZ2UgPSBmYWxzZTtcbiAgICAgIGRlc3RpbmF0aW9uWm9vbUxldmVsID0gcHJldlpvb21MZXZlbDtcbiAgICB9XG5cbiAgICBjb25zdCBpbml0aWFsQmdPcGFjaXR5ID0gcHN3cC5iZ09wYWNpdHk7XG4gICAgY29uc3QgcmVzdG9yZUJnT3BhY2l0eSA9IHBzd3AuYmdPcGFjaXR5IDwgMTtcbiAgICBjb25zdCBpbml0aWFsUGFuID0gZXF1YWxpemVQb2ludHMoe1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9LCBjdXJyU2xpZGUucGFuKTtcbiAgICBsZXQgZGVzdGluYXRpb25QYW4gPSBlcXVhbGl6ZVBvaW50cyh7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH0sIGluaXRpYWxQYW4pO1xuXG4gICAgaWYgKGlnbm9yZUdlc3R1cmUpIHtcbiAgICAgIHRoaXMuX3pvb21Qb2ludC54ID0gMDtcbiAgICAgIHRoaXMuX3pvb21Qb2ludC55ID0gMDtcbiAgICAgIHRoaXMuX3N0YXJ0Wm9vbVBvaW50LnggPSAwO1xuICAgICAgdGhpcy5fc3RhcnRab29tUG9pbnQueSA9IDA7XG4gICAgICB0aGlzLl9zdGFydFpvb21MZXZlbCA9IHByZXZab29tTGV2ZWw7XG4gICAgICBlcXVhbGl6ZVBvaW50cyh0aGlzLl9zdGFydFBhbiwgaW5pdGlhbFBhbik7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJab29tTGV2ZWxOZWVkc0NoYW5nZSkge1xuICAgICAgZGVzdGluYXRpb25QYW4gPSB7XG4gICAgICAgIHg6IHRoaXMuX2NhbGN1bGF0ZVBhbkZvclpvb21MZXZlbCgneCcsIGRlc3RpbmF0aW9uWm9vbUxldmVsKSxcbiAgICAgICAgeTogdGhpcy5fY2FsY3VsYXRlUGFuRm9yWm9vbUxldmVsKCd5JywgZGVzdGluYXRpb25ab29tTGV2ZWwpXG4gICAgICB9O1xuICAgIH0gLy8gc2V0IHpvb20gbGV2ZWwsIHNvIHBhbiBib3VuZHMgYXJlIHVwZGF0ZWQgYWNjb3JkaW5nIHRvIGl0XG5cblxuICAgIGN1cnJTbGlkZS5zZXRab29tTGV2ZWwoZGVzdGluYXRpb25ab29tTGV2ZWwpO1xuICAgIGRlc3RpbmF0aW9uUGFuID0ge1xuICAgICAgeDogY3VyclNsaWRlLmJvdW5kcy5jb3JyZWN0UGFuKCd4JywgZGVzdGluYXRpb25QYW4ueCksXG4gICAgICB5OiBjdXJyU2xpZGUuYm91bmRzLmNvcnJlY3RQYW4oJ3knLCBkZXN0aW5hdGlvblBhbi55KVxuICAgIH07IC8vIHJldHVybiB6b29tIGxldmVsIGFuZCBpdHMgYm91bmRzIHRvIGluaXRpYWxcblxuICAgIGN1cnJTbGlkZS5zZXRab29tTGV2ZWwocHJldlpvb21MZXZlbCk7XG4gICAgY29uc3QgcGFuTmVlZHNDaGFuZ2UgPSAhcG9pbnRzRXF1YWwoZGVzdGluYXRpb25QYW4sIGluaXRpYWxQYW4pO1xuXG4gICAgaWYgKCFwYW5OZWVkc0NoYW5nZSAmJiAhY3Vyclpvb21MZXZlbE5lZWRzQ2hhbmdlICYmICFyZXN0b3JlQmdPcGFjaXR5KSB7XG4gICAgICAvLyB1cGRhdGUgcmVzb2x1dGlvbiBhZnRlciBnZXN0dXJlXG4gICAgICBjdXJyU2xpZGUuX3NldFJlc29sdXRpb24oZGVzdGluYXRpb25ab29tTGV2ZWwpO1xuXG4gICAgICBjdXJyU2xpZGUuYXBwbHlDdXJyZW50Wm9vbVBhbigpOyAvLyBub3RoaW5nIHRvIGFuaW1hdGVcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBzd3AuYW5pbWF0aW9ucy5zdG9wQWxsUGFuKCk7XG4gICAgcHN3cC5hbmltYXRpb25zLnN0YXJ0U3ByaW5nKHtcbiAgICAgIGlzUGFuOiB0cnVlLFxuICAgICAgc3RhcnQ6IDAsXG4gICAgICBlbmQ6IDEwMDAsXG4gICAgICB2ZWxvY2l0eTogMCxcbiAgICAgIGRhbXBpbmdSYXRpbzogMSxcbiAgICAgIG5hdHVyYWxGcmVxdWVuY3k6IDQwLFxuICAgICAgb25VcGRhdGU6IG5vdyA9PiB7XG4gICAgICAgIG5vdyAvPSAxMDAwOyAvLyAwIC0gc3RhcnQsIDEgLSBlbmRcblxuICAgICAgICBpZiAocGFuTmVlZHNDaGFuZ2UgfHwgY3Vyclpvb21MZXZlbE5lZWRzQ2hhbmdlKSB7XG4gICAgICAgICAgaWYgKHBhbk5lZWRzQ2hhbmdlKSB7XG4gICAgICAgICAgICBjdXJyU2xpZGUucGFuLnggPSBpbml0aWFsUGFuLnggKyAoZGVzdGluYXRpb25QYW4ueCAtIGluaXRpYWxQYW4ueCkgKiBub3c7XG4gICAgICAgICAgICBjdXJyU2xpZGUucGFuLnkgPSBpbml0aWFsUGFuLnkgKyAoZGVzdGluYXRpb25QYW4ueSAtIGluaXRpYWxQYW4ueSkgKiBub3c7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGN1cnJab29tTGV2ZWxOZWVkc0NoYW5nZSkge1xuICAgICAgICAgICAgY29uc3QgbmV3Wm9vbUxldmVsID0gcHJldlpvb21MZXZlbCArIChkZXN0aW5hdGlvblpvb21MZXZlbCAtIHByZXZab29tTGV2ZWwpICogbm93O1xuICAgICAgICAgICAgY3VyclNsaWRlLnNldFpvb21MZXZlbChuZXdab29tTGV2ZWwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1cnJTbGlkZS5hcHBseUN1cnJlbnRab29tUGFuKCk7XG4gICAgICAgIH0gLy8gUmVzdG9yZSBiYWNrZ3JvdW5kIG9wYWNpdHlcblxuXG4gICAgICAgIGlmIChyZXN0b3JlQmdPcGFjaXR5ICYmIHBzd3AuYmdPcGFjaXR5IDwgMSkge1xuICAgICAgICAgIC8vIFdlIGNsYW1wIG9wYWNpdHkgdG8ga2VlcCBpdCBiZXR3ZWVuIDAgYW5kIDEuXG4gICAgICAgICAgLy8gQXMgcHJvZ3Jlc3MgcmF0aW8gY2FuIGJlIGxhcmdlciB0aGFuIDEgZHVlIHRvIG92ZXJzaG9vdCxcbiAgICAgICAgICAvLyBhbmQgd2UgZG8gbm90IHdhbnQgdG8gYm91bmNlIG9wYWNpdHkuXG4gICAgICAgICAgcHN3cC5hcHBseUJnT3BhY2l0eShjbGFtcChpbml0aWFsQmdPcGFjaXR5ICsgKDEgLSBpbml0aWFsQmdPcGFjaXR5KSAqIG5vdywgMCwgMSkpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb25Db21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAvLyB1cGRhdGUgcmVzb2x1dGlvbiBhZnRlciB0cmFuc2l0aW9uIGVuZHNcbiAgICAgICAgY3VyclNsaWRlLl9zZXRSZXNvbHV0aW9uKGRlc3RpbmF0aW9uWm9vbUxldmVsKTtcblxuICAgICAgICBjdXJyU2xpZGUuYXBwbHlDdXJyZW50Wm9vbVBhbigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn1cblxuLyoqXHJcbiAqIEB0ZW1wbGF0ZSB7c3RyaW5nfSBUXHJcbiAqIEB0ZW1wbGF0ZSB7c3RyaW5nfSBQXHJcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3R5cGVzLmpzJykuQWRkUG9zdGZpeDxULCBQPn0gQWRkUG9zdGZpeDxULCBQPlxyXG4gKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4vZ2VzdHVyZXMuanMnKS5kZWZhdWx0fSBHZXN0dXJlcyAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4vcGhvdG9zd2lwZS5qcycpLlBvaW50fSBQb2ludCAqL1xuXG4vKiogQHR5cGVkZWYgeydpbWFnZUNsaWNrJyB8ICdiZ0NsaWNrJyB8ICd0YXAnIHwgJ2RvdWJsZVRhcCd9IEFjdGlvbnMgKi9cblxuLyoqXHJcbiAqIFdoZXRoZXIgdGhlIHRhcCB3YXMgcGVyZm9ybWVkIG9uIHRoZSBtYWluIHNsaWRlXHJcbiAqIChyYXRoZXIgdGhhbiBjb250cm9scyBvciBjYXB0aW9uKS5cclxuICpcclxuICogQHBhcmFtIHtQb2ludGVyRXZlbnR9IGV2ZW50XHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cbmZ1bmN0aW9uIGRpZFRhcE9uTWFpbkNvbnRlbnQoZXZlbnQpIHtcbiAgcmV0dXJuICEhXG4gIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG4gIGV2ZW50LnRhcmdldC5jbG9zZXN0KCcucHN3cF9fY29udGFpbmVyJyk7XG59XG4vKipcclxuICogVGFwLCBkb3VibGUtdGFwIGhhbmRsZXIuXHJcbiAqL1xuXG5cbmNsYXNzIFRhcEhhbmRsZXIge1xuICAvKipcclxuICAgKiBAcGFyYW0ge0dlc3R1cmVzfSBnZXN0dXJlc1xyXG4gICAqL1xuICBjb25zdHJ1Y3RvcihnZXN0dXJlcykge1xuICAgIHRoaXMuZ2VzdHVyZXMgPSBnZXN0dXJlcztcbiAgfVxuICAvKipcclxuICAgKiBAcGFyYW0ge1BvaW50fSBwb2ludFxyXG4gICAqIEBwYXJhbSB7UG9pbnRlckV2ZW50fSBvcmlnaW5hbEV2ZW50XHJcbiAgICovXG5cblxuICBjbGljayhwb2ludCwgb3JpZ2luYWxFdmVudCkge1xuICAgIGNvbnN0IHRhcmdldENsYXNzTGlzdCA9XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudH0gKi9cbiAgICBvcmlnaW5hbEV2ZW50LnRhcmdldC5jbGFzc0xpc3Q7XG4gICAgY29uc3QgaXNJbWFnZUNsaWNrID0gdGFyZ2V0Q2xhc3NMaXN0LmNvbnRhaW5zKCdwc3dwX19pbWcnKTtcbiAgICBjb25zdCBpc0JhY2tncm91bmRDbGljayA9IHRhcmdldENsYXNzTGlzdC5jb250YWlucygncHN3cF9faXRlbScpIHx8IHRhcmdldENsYXNzTGlzdC5jb250YWlucygncHN3cF9fem9vbS13cmFwJyk7XG5cbiAgICBpZiAoaXNJbWFnZUNsaWNrKSB7XG4gICAgICB0aGlzLl9kb0NsaWNrT3JUYXBBY3Rpb24oJ2ltYWdlQ2xpY2snLCBwb2ludCwgb3JpZ2luYWxFdmVudCk7XG4gICAgfSBlbHNlIGlmIChpc0JhY2tncm91bmRDbGljaykge1xuICAgICAgdGhpcy5fZG9DbGlja09yVGFwQWN0aW9uKCdiZ0NsaWNrJywgcG9pbnQsIG9yaWdpbmFsRXZlbnQpO1xuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBAcGFyYW0ge1BvaW50fSBwb2ludFxyXG4gICAqIEBwYXJhbSB7UG9pbnRlckV2ZW50fSBvcmlnaW5hbEV2ZW50XHJcbiAgICovXG5cblxuICB0YXAocG9pbnQsIG9yaWdpbmFsRXZlbnQpIHtcbiAgICBpZiAoZGlkVGFwT25NYWluQ29udGVudChvcmlnaW5hbEV2ZW50KSkge1xuICAgICAgdGhpcy5fZG9DbGlja09yVGFwQWN0aW9uKCd0YXAnLCBwb2ludCwgb3JpZ2luYWxFdmVudCk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7UG9pbnR9IHBvaW50XHJcbiAgICogQHBhcmFtIHtQb2ludGVyRXZlbnR9IG9yaWdpbmFsRXZlbnRcclxuICAgKi9cblxuXG4gIGRvdWJsZVRhcChwb2ludCwgb3JpZ2luYWxFdmVudCkge1xuICAgIGlmIChkaWRUYXBPbk1haW5Db250ZW50KG9yaWdpbmFsRXZlbnQpKSB7XG4gICAgICB0aGlzLl9kb0NsaWNrT3JUYXBBY3Rpb24oJ2RvdWJsZVRhcCcsIHBvaW50LCBvcmlnaW5hbEV2ZW50KTtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogQHByaXZhdGVcclxuICAgKiBAcGFyYW0ge0FjdGlvbnN9IGFjdGlvbk5hbWVcclxuICAgKiBAcGFyYW0ge1BvaW50fSBwb2ludFxyXG4gICAqIEBwYXJhbSB7UG9pbnRlckV2ZW50fSBvcmlnaW5hbEV2ZW50XHJcbiAgICovXG5cblxuICBfZG9DbGlja09yVGFwQWN0aW9uKGFjdGlvbk5hbWUsIHBvaW50LCBvcmlnaW5hbEV2ZW50KSB7XG4gICAgdmFyIF90aGlzJGdlc3R1cmVzJHBzd3AkZTtcblxuICAgIGNvbnN0IHtcbiAgICAgIHBzd3BcbiAgICB9ID0gdGhpcy5nZXN0dXJlcztcbiAgICBjb25zdCB7XG4gICAgICBjdXJyU2xpZGVcbiAgICB9ID0gcHN3cDtcbiAgICBjb25zdCBhY3Rpb25GdWxsTmFtZSA9XG4gICAgLyoqIEB0eXBlIHtBZGRQb3N0Zml4PEFjdGlvbnMsICdBY3Rpb24nPn0gKi9cbiAgICBhY3Rpb25OYW1lICsgJ0FjdGlvbic7XG4gICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBwc3dwLm9wdGlvbnNbYWN0aW9uRnVsbE5hbWVdO1xuXG4gICAgaWYgKHBzd3AuZGlzcGF0Y2goYWN0aW9uRnVsbE5hbWUsIHtcbiAgICAgIHBvaW50LFxuICAgICAgb3JpZ2luYWxFdmVudFxuICAgIH0pLmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvblZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBvcHRpb25WYWx1ZS5jYWxsKHBzd3AsIHBvaW50LCBvcmlnaW5hbEV2ZW50KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKG9wdGlvblZhbHVlKSB7XG4gICAgICBjYXNlICdjbG9zZSc6XG4gICAgICBjYXNlICduZXh0JzpcbiAgICAgICAgcHN3cFtvcHRpb25WYWx1ZV0oKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3pvb20nOlxuICAgICAgICBjdXJyU2xpZGUgPT09IG51bGwgfHwgY3VyclNsaWRlID09PSB2b2lkIDAgfHwgY3VyclNsaWRlLnRvZ2dsZVpvb20ocG9pbnQpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnem9vbS1vci1jbG9zZSc6XG4gICAgICAgIC8vIGJ5IGRlZmF1bHQgY2xpY2sgem9vbXMgY3VycmVudCBpbWFnZSxcbiAgICAgICAgLy8gaWYgaXQgY2FuIG5vdCBiZSB6b29tZWQgLSBnYWxsZXJ5IHdpbGwgYmUgY2xvc2VkXG4gICAgICAgIGlmIChjdXJyU2xpZGUgIT09IG51bGwgJiYgY3VyclNsaWRlICE9PSB2b2lkIDAgJiYgY3VyclNsaWRlLmlzWm9vbWFibGUoKSAmJiBjdXJyU2xpZGUuem9vbUxldmVscy5zZWNvbmRhcnkgIT09IGN1cnJTbGlkZS56b29tTGV2ZWxzLmluaXRpYWwpIHtcbiAgICAgICAgICBjdXJyU2xpZGUudG9nZ2xlWm9vbShwb2ludCk7XG4gICAgICAgIH0gZWxzZSBpZiAocHN3cC5vcHRpb25zLmNsaWNrVG9DbG9zZU5vblpvb21hYmxlKSB7XG4gICAgICAgICAgcHN3cC5jbG9zZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ3RvZ2dsZS1jb250cm9scyc6XG4gICAgICAgIChfdGhpcyRnZXN0dXJlcyRwc3dwJGUgPSB0aGlzLmdlc3R1cmVzLnBzd3AuZWxlbWVudCkgPT09IG51bGwgfHwgX3RoaXMkZ2VzdHVyZXMkcHN3cCRlID09PSB2b2lkIDAgfHwgX3RoaXMkZ2VzdHVyZXMkcHN3cCRlLmNsYXNzTGlzdC50b2dnbGUoJ3Bzd3AtLXVpLXZpc2libGUnKTsgLy8gaWYgKF9jb250cm9sc1Zpc2libGUpIHtcbiAgICAgICAgLy8gICBfdWkuaGlkZUNvbnRyb2xzKCk7XG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vICAgX3VpLnNob3dDb250cm9scygpO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbn1cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3Bob3Rvc3dpcGUuanMnKS5kZWZhdWx0fSBQaG90b1N3aXBlICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi9waG90b3N3aXBlLmpzJykuUG9pbnR9IFBvaW50ICovXG4vLyBIb3cgZmFyIHNob3VsZCB1c2VyIHNob3VsZCBkcmFnXG4vLyB1bnRpbCB3ZSBjYW4gZGV0ZXJtaW5lIHRoYXQgdGhlIGdlc3R1cmUgaXMgc3dpcGUgYW5kIGl0cyBkaXJlY3Rpb25cblxuY29uc3QgQVhJU19TV0lQRV9IWVNURVJJU0lTID0gMTA7IC8vY29uc3QgUEFOX0VORF9GUklDVElPTiA9IDAuMzU7XG5cbmNvbnN0IERPVUJMRV9UQVBfREVMQVkgPSAzMDA7IC8vIG1zXG5cbmNvbnN0IE1JTl9UQVBfRElTVEFOQ0UgPSAyNTsgLy8gcHhcblxuLyoqXHJcbiAqIEdlc3R1cmVzIGNsYXNzIGJpbmQgdG91Y2gsIHBvaW50ZXIgb3IgbW91c2UgZXZlbnRzXHJcbiAqIGFuZCBlbWl0cyBkcmFnIHRvIGRyYWctaGFuZGxlciBhbmQgem9vbSBldmVudHMgem9vbS1oYW5kbGVyLlxyXG4gKlxyXG4gKiBEcmFnIGFuZCB6b29tIGV2ZW50cyBhcmUgZW1pdGVkIGluIHJlcXVlc3RBbmltYXRpb25GcmFtZSxcclxuICogYW5kIG9ubHkgd2hlbiBvbmUgb2YgcG9pbnRlcnMgd2FzIGFjdHVhbGx5IGNoYW5nZWQuXHJcbiAqL1xuXG5jbGFzcyBHZXN0dXJlcyB7XG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7UGhvdG9Td2lwZX0gcHN3cFxyXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwc3dwKSB7XG4gICAgdGhpcy5wc3dwID0gcHN3cDtcbiAgICAvKiogQHR5cGUgeyd4JyB8ICd5JyB8IG51bGx9ICovXG5cbiAgICB0aGlzLmRyYWdBeGlzID0gbnVsbDsgLy8gcG9pbnQgb2JqZWN0cyBhcmUgZGVmaW5lZCBvbmNlIGFuZCByZXVzZWRcbiAgICAvLyBQaG90b1N3aXBlIGtlZXBzIHRyYWNrIG9ubHkgb2YgdHdvIHBvaW50ZXJzLCBvdGhlcnMgYXJlIGlnbm9yZWRcblxuICAgIC8qKiBAdHlwZSB7UG9pbnR9ICovXG5cbiAgICB0aGlzLnAxID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9OyAvLyB0aGUgZmlyc3QgcHJlc3NlZCBwb2ludGVyXG5cbiAgICAvKiogQHR5cGUge1BvaW50fSAqL1xuXG4gICAgdGhpcy5wMiA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfTsgLy8gdGhlIHNlY29uZCBwcmVzc2VkIHBvaW50ZXJcblxuICAgIC8qKiBAdHlwZSB7UG9pbnR9ICovXG5cbiAgICB0aGlzLnByZXZQMSA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfTtcbiAgICAvKiogQHR5cGUge1BvaW50fSAqL1xuXG4gICAgdGhpcy5wcmV2UDIgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH07XG4gICAgLyoqIEB0eXBlIHtQb2ludH0gKi9cblxuICAgIHRoaXMuc3RhcnRQMSA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfTtcbiAgICAvKiogQHR5cGUge1BvaW50fSAqL1xuXG4gICAgdGhpcy5zdGFydFAyID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9O1xuICAgIC8qKiBAdHlwZSB7UG9pbnR9ICovXG5cbiAgICB0aGlzLnZlbG9jaXR5ID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9O1xuICAgIC8qKiBAdHlwZSB7UG9pbnR9XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXG5cbiAgICB0aGlzLl9sYXN0U3RhcnRQMSA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfTtcbiAgICAvKiogQHR5cGUge1BvaW50fVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xuXG4gICAgdGhpcy5faW50ZXJ2YWxQMSA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfTtcbiAgICAvKiogQHByaXZhdGUgKi9cblxuICAgIHRoaXMuX251bUFjdGl2ZVBvaW50cyA9IDA7XG4gICAgLyoqIEB0eXBlIHtQb2ludFtdfVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xuXG4gICAgdGhpcy5fb25nb2luZ1BvaW50ZXJzID0gW107XG4gICAgLyoqIEBwcml2YXRlICovXG5cbiAgICB0aGlzLl90b3VjaEV2ZW50RW5hYmxlZCA9ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdztcbiAgICAvKiogQHByaXZhdGUgKi9cblxuICAgIHRoaXMuX3BvaW50ZXJFdmVudEVuYWJsZWQgPSAhIXdpbmRvdy5Qb2ludGVyRXZlbnQ7XG4gICAgdGhpcy5zdXBwb3J0c1RvdWNoID0gdGhpcy5fdG91Y2hFdmVudEVuYWJsZWQgfHwgdGhpcy5fcG9pbnRlckV2ZW50RW5hYmxlZCAmJiBuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgPiAxO1xuICAgIC8qKiBAcHJpdmF0ZSAqL1xuXG4gICAgdGhpcy5fbnVtQWN0aXZlUG9pbnRzID0gMDtcbiAgICAvKiogQHByaXZhdGUgKi9cblxuICAgIHRoaXMuX2ludGVydmFsVGltZSA9IDA7XG4gICAgLyoqIEBwcml2YXRlICovXG5cbiAgICB0aGlzLl92ZWxvY2l0eUNhbGN1bGF0ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmlzTXVsdGl0b3VjaCA9IGZhbHNlO1xuICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgIHRoaXMuaXNab29taW5nID0gZmFsc2U7XG4gICAgLyoqIEB0eXBlIHtudW1iZXIgfCBudWxsfSAqL1xuXG4gICAgdGhpcy5yYWYgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7Tm9kZUpTLlRpbWVvdXQgfCBudWxsfVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xuXG4gICAgdGhpcy5fdGFwVGltZXIgPSBudWxsO1xuXG4gICAgaWYgKCF0aGlzLnN1cHBvcnRzVG91Y2gpIHtcbiAgICAgIC8vIGRpc2FibGUgcGFuIHRvIG5leHQgc2xpZGUgZm9yIG5vbi10b3VjaCBkZXZpY2VzXG4gICAgICBwc3dwLm9wdGlvbnMuYWxsb3dQYW5Ub05leHQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLmRyYWcgPSBuZXcgRHJhZ0hhbmRsZXIodGhpcyk7XG4gICAgdGhpcy56b29tTGV2ZWxzID0gbmV3IFpvb21IYW5kbGVyKHRoaXMpO1xuICAgIHRoaXMudGFwSGFuZGxlciA9IG5ldyBUYXBIYW5kbGVyKHRoaXMpO1xuICAgIHBzd3Aub24oJ2JpbmRFdmVudHMnLCAoKSA9PiB7XG4gICAgICBwc3dwLmV2ZW50cy5hZGQocHN3cC5zY3JvbGxXcmFwLCAnY2xpY2snLFxuICAgICAgLyoqIEB0eXBlIEV2ZW50TGlzdGVuZXIgKi9cbiAgICAgIHRoaXMuX29uQ2xpY2suYmluZCh0aGlzKSk7XG5cbiAgICAgIGlmICh0aGlzLl9wb2ludGVyRXZlbnRFbmFibGVkKSB7XG4gICAgICAgIHRoaXMuX2JpbmRFdmVudHMoJ3BvaW50ZXInLCAnZG93bicsICd1cCcsICdjYW5jZWwnKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fdG91Y2hFdmVudEVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5fYmluZEV2ZW50cygndG91Y2gnLCAnc3RhcnQnLCAnZW5kJywgJ2NhbmNlbCcpOyAvLyBJbiBwcmV2aW91cyB2ZXJzaW9ucyB3ZSBhbHNvIGJvdW5kIG1vdXNlIGV2ZW50IGhlcmUsXG4gICAgICAgIC8vIGluIGNhc2UgZGV2aWNlIHN1cHBvcnRzIGJvdGggdG91Y2ggYW5kIG1vdXNlIGV2ZW50cyxcbiAgICAgICAgLy8gYnV0IG5ld2VyIHZlcnNpb25zIG9mIGJyb3dzZXJzIG5vdyBzdXBwb3J0IFBvaW50ZXJFdmVudC5cbiAgICAgICAgLy8gb24gaU9TMTAgaWYgeW91IGJpbmQgdG91Y2htb3ZlL2VuZCBhZnRlciB0b3VjaHN0YXJ0LFxuICAgICAgICAvLyBhbmQgeW91IGRvbid0IHByZXZlbnREZWZhdWx0IHRvdWNoc3RhcnQgKHdoaWNoIFBob3RvU3dpcGUgZG9lcyksXG4gICAgICAgIC8vIHByZXZlbnREZWZhdWx0IHdpbGwgaGF2ZSBubyBlZmZlY3Qgb24gdG91Y2htb3ZlIGFuZCB0b3VjaGVuZC5cbiAgICAgICAgLy8gVW5sZXNzIHlvdSBiaW5kIGl0IHByZXZpb3VzbHkuXG5cblxuICAgICAgICBpZiAocHN3cC5zY3JvbGxXcmFwKSB7XG4gICAgICAgICAgcHN3cC5zY3JvbGxXcmFwLm9udG91Y2htb3ZlID0gKCkgPT4ge307XG5cbiAgICAgICAgICBwc3dwLnNjcm9sbFdyYXAub250b3VjaGVuZCA9ICgpID0+IHt9O1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9iaW5kRXZlbnRzKCdtb3VzZScsICdkb3duJywgJ3VwJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXHJcbiAgICogQHByaXZhdGVcclxuICAgKiBAcGFyYW0geydtb3VzZScgfCAndG91Y2gnIHwgJ3BvaW50ZXInfSBwcmVmXHJcbiAgICogQHBhcmFtIHsnZG93bicgfCAnc3RhcnQnfSBkb3duXHJcbiAgICogQHBhcmFtIHsndXAnIHwgJ2VuZCd9IHVwXHJcbiAgICogQHBhcmFtIHsnY2FuY2VsJ30gW2NhbmNlbF1cclxuICAgKi9cblxuXG4gIF9iaW5kRXZlbnRzKHByZWYsIGRvd24sIHVwLCBjYW5jZWwpIHtcbiAgICBjb25zdCB7XG4gICAgICBwc3dwXG4gICAgfSA9IHRoaXM7XG4gICAgY29uc3Qge1xuICAgICAgZXZlbnRzXG4gICAgfSA9IHBzd3A7XG4gICAgY29uc3QgY2FuY2VsRXZlbnQgPSBjYW5jZWwgPyBwcmVmICsgY2FuY2VsIDogJyc7XG4gICAgZXZlbnRzLmFkZChwc3dwLnNjcm9sbFdyYXAsIHByZWYgKyBkb3duLFxuICAgIC8qKiBAdHlwZSBFdmVudExpc3RlbmVyICovXG4gICAgdGhpcy5vblBvaW50ZXJEb3duLmJpbmQodGhpcykpO1xuICAgIGV2ZW50cy5hZGQod2luZG93LCBwcmVmICsgJ21vdmUnLFxuICAgIC8qKiBAdHlwZSBFdmVudExpc3RlbmVyICovXG4gICAgdGhpcy5vblBvaW50ZXJNb3ZlLmJpbmQodGhpcykpO1xuICAgIGV2ZW50cy5hZGQod2luZG93LCBwcmVmICsgdXAsXG4gICAgLyoqIEB0eXBlIEV2ZW50TGlzdGVuZXIgKi9cbiAgICB0aGlzLm9uUG9pbnRlclVwLmJpbmQodGhpcykpO1xuXG4gICAgaWYgKGNhbmNlbEV2ZW50KSB7XG4gICAgICBldmVudHMuYWRkKHBzd3Auc2Nyb2xsV3JhcCwgY2FuY2VsRXZlbnQsXG4gICAgICAvKiogQHR5cGUgRXZlbnRMaXN0ZW5lciAqL1xuICAgICAgdGhpcy5vblBvaW50ZXJVcC5iaW5kKHRoaXMpKTtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogQHBhcmFtIHtQb2ludGVyRXZlbnR9IGVcclxuICAgKi9cblxuXG4gIG9uUG9pbnRlckRvd24oZSkge1xuICAgIC8vIFdlIGRvIG5vdCBjYWxsIHByZXZlbnREZWZhdWx0IGZvciB0b3VjaCBldmVudHNcbiAgICAvLyB0byBhbGxvdyBicm93c2VyIHRvIHNob3cgbmF0aXZlIGRpYWxvZyBvbiBsb25ncHJlc3NcbiAgICAvLyAodGhlIG9uZSB0aGF0IGFsbG93cyB0byBzYXZlIGltYWdlIG9yIG9wZW4gaXQgaW4gbmV3IHRhYikuXG4gICAgLy9cbiAgICAvLyBEZXNrdG9wIFNhZmFyaSBhbGxvd3MgdG8gZHJhZyBpbWFnZXMgd2hlbiBwcmV2ZW50RGVmYXVsdCBpc24ndCBjYWxsZWQgb24gbW91c2Vkb3duLFxuICAgIC8vIGV2ZW4gdGhvdWdoIHByZXZlbnREZWZhdWx0IElTIGNhbGxlZCBvbiBtb3VzZW1vdmUuIFRoYXQncyB3aHkgd2UgcHJldmVudERlZmF1bHQgbW91c2Vkb3duLlxuICAgIGNvbnN0IGlzTW91c2VQb2ludGVyID0gZS50eXBlID09PSAnbW91c2Vkb3duJyB8fCBlLnBvaW50ZXJUeXBlID09PSAnbW91c2UnOyAvLyBBbGxvdyBkcmFnZ2luZyBvbmx5IHZpYSBsZWZ0IG1vdXNlIGJ1dHRvbi5cbiAgICAvLyBodHRwOi8vd3d3LnF1aXJrc21vZGUub3JnL2pzL2V2ZW50c19wcm9wZXJ0aWVzLmh0bWxcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvZXZlbnQuYnV0dG9uXG5cbiAgICBpZiAoaXNNb3VzZVBvaW50ZXIgJiYgZS5idXR0b24gPiAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge1xuICAgICAgcHN3cFxuICAgIH0gPSB0aGlzOyAvLyBpZiBQaG90b1N3aXBlIGlzIG9wZW5pbmcgb3IgY2xvc2luZ1xuXG4gICAgaWYgKCFwc3dwLm9wZW5lci5pc09wZW4pIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocHN3cC5kaXNwYXRjaCgncG9pbnRlckRvd24nLCB7XG4gICAgICBvcmlnaW5hbEV2ZW50OiBlXG4gICAgfSkuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc01vdXNlUG9pbnRlcikge1xuICAgICAgcHN3cC5tb3VzZURldGVjdGVkKCk7IC8vIHByZXZlbnREZWZhdWx0IG1vdXNlIGV2ZW50IHRvIHByZXZlbnRcbiAgICAgIC8vIGJyb3dzZXIgaW1hZ2UgZHJhZyBmZWF0dXJlXG5cbiAgICAgIHRoaXMuX3ByZXZlbnRQb2ludGVyRXZlbnRCZWhhdmlvdXIoZSwgJ2Rvd24nKTtcbiAgICB9XG5cbiAgICBwc3dwLmFuaW1hdGlvbnMuc3RvcEFsbCgpO1xuXG4gICAgdGhpcy5fdXBkYXRlUG9pbnRzKGUsICdkb3duJyk7XG5cbiAgICBpZiAodGhpcy5fbnVtQWN0aXZlUG9pbnRzID09PSAxKSB7XG4gICAgICB0aGlzLmRyYWdBeGlzID0gbnVsbDsgLy8gd2UgbmVlZCB0byBzdG9yZSBpbml0aWFsIHBvaW50IHRvIGRldGVybWluZSB0aGUgbWFpbiBheGlzLFxuICAgICAgLy8gZHJhZyBpcyBhY3RpdmF0ZWQgb25seSBhZnRlciB0aGUgYXhpcyBpcyBkZXRlcm1pbmVkXG5cbiAgICAgIGVxdWFsaXplUG9pbnRzKHRoaXMuc3RhcnRQMSwgdGhpcy5wMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX251bUFjdGl2ZVBvaW50cyA+IDEpIHtcbiAgICAgIC8vIFRhcCBvciBkb3VibGUgdGFwIHNob3VsZCBub3QgdHJpZ2dlciBpZiBtb3JlIHRoYW4gb25lIHBvaW50ZXJcbiAgICAgIHRoaXMuX2NsZWFyVGFwVGltZXIoKTtcblxuICAgICAgdGhpcy5pc011bHRpdG91Y2ggPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmlzTXVsdGl0b3VjaCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBAcGFyYW0ge1BvaW50ZXJFdmVudH0gZVxyXG4gICAqL1xuXG5cbiAgb25Qb2ludGVyTW92ZShlKSB7XG4gICAgdGhpcy5fcHJldmVudFBvaW50ZXJFdmVudEJlaGF2aW91cihlLCAnbW92ZScpO1xuXG4gICAgaWYgKCF0aGlzLl9udW1BY3RpdmVQb2ludHMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVQb2ludHMoZSwgJ21vdmUnKTtcblxuICAgIGlmICh0aGlzLnBzd3AuZGlzcGF0Y2goJ3BvaW50ZXJNb3ZlJywge1xuICAgICAgb3JpZ2luYWxFdmVudDogZVxuICAgIH0pLmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbnVtQWN0aXZlUG9pbnRzID09PSAxICYmICF0aGlzLmlzRHJhZ2dpbmcpIHtcbiAgICAgIGlmICghdGhpcy5kcmFnQXhpcykge1xuICAgICAgICB0aGlzLl9jYWxjdWxhdGVEcmFnRGlyZWN0aW9uKCk7XG4gICAgICB9IC8vIERyYWcgYXhpcyB3YXMgZGV0ZWN0ZWQsIGVtaXQgZHJhZy5zdGFydFxuXG5cbiAgICAgIGlmICh0aGlzLmRyYWdBeGlzICYmICF0aGlzLmlzRHJhZ2dpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNab29taW5nKSB7XG4gICAgICAgICAgdGhpcy5pc1pvb21pbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLnpvb21MZXZlbHMuZW5kKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuX2NsZWFyVGFwVGltZXIoKTsgLy8gVGFwIGNhbiBub3QgdHJpZ2dlciBhZnRlciBkcmFnXG4gICAgICAgIC8vIEFkanVzdCBzdGFydGluZyBwb2ludFxuXG5cbiAgICAgICAgdGhpcy5fdXBkYXRlU3RhcnRQb2ludHMoKTtcblxuICAgICAgICB0aGlzLl9pbnRlcnZhbFRpbWUgPSBEYXRlLm5vdygpOyAvL3RoaXMuX3N0YXJ0VGltZSA9IHRoaXMuX2ludGVydmFsVGltZTtcblxuICAgICAgICB0aGlzLl92ZWxvY2l0eUNhbGN1bGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgZXF1YWxpemVQb2ludHModGhpcy5faW50ZXJ2YWxQMSwgdGhpcy5wMSk7XG4gICAgICAgIHRoaXMudmVsb2NpdHkueCA9IDA7XG4gICAgICAgIHRoaXMudmVsb2NpdHkueSA9IDA7XG4gICAgICAgIHRoaXMuZHJhZy5zdGFydCgpO1xuXG4gICAgICAgIHRoaXMuX3JhZlN0b3BMb29wKCk7XG5cbiAgICAgICAgdGhpcy5fcmFmUmVuZGVyTG9vcCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5fbnVtQWN0aXZlUG9pbnRzID4gMSAmJiAhdGhpcy5pc1pvb21pbmcpIHtcbiAgICAgIHRoaXMuX2ZpbmlzaERyYWcoKTtcblxuICAgICAgdGhpcy5pc1pvb21pbmcgPSB0cnVlOyAvLyBBZGp1c3Qgc3RhcnRpbmcgcG9pbnRzXG5cbiAgICAgIHRoaXMuX3VwZGF0ZVN0YXJ0UG9pbnRzKCk7XG5cbiAgICAgIHRoaXMuem9vbUxldmVscy5zdGFydCgpO1xuXG4gICAgICB0aGlzLl9yYWZTdG9wTG9vcCgpO1xuXG4gICAgICB0aGlzLl9yYWZSZW5kZXJMb29wKCk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXG5cblxuICBfZmluaXNoRHJhZygpIHtcbiAgICBpZiAodGhpcy5pc0RyYWdnaW5nKSB7XG4gICAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTsgLy8gVHJ5IHRvIGNhbGN1bGF0ZSB2ZWxvY2l0eSxcbiAgICAgIC8vIGlmIGl0IHdhc24ndCBjYWxjdWxhdGVkIHlldCBpbiBkcmFnLmNoYW5nZVxuXG4gICAgICBpZiAoIXRoaXMuX3ZlbG9jaXR5Q2FsY3VsYXRlZCkge1xuICAgICAgICB0aGlzLl91cGRhdGVWZWxvY2l0eSh0cnVlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5kcmFnLmVuZCgpO1xuICAgICAgdGhpcy5kcmFnQXhpcyA9IG51bGw7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7UG9pbnRlckV2ZW50fSBlXHJcbiAgICovXG5cblxuICBvblBvaW50ZXJVcChlKSB7XG4gICAgaWYgKCF0aGlzLl9udW1BY3RpdmVQb2ludHMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVQb2ludHMoZSwgJ3VwJyk7XG5cbiAgICBpZiAodGhpcy5wc3dwLmRpc3BhdGNoKCdwb2ludGVyVXAnLCB7XG4gICAgICBvcmlnaW5hbEV2ZW50OiBlXG4gICAgfSkuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9udW1BY3RpdmVQb2ludHMgPT09IDApIHtcbiAgICAgIHRoaXMuX3JhZlN0b3BMb29wKCk7XG5cbiAgICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcbiAgICAgICAgdGhpcy5fZmluaXNoRHJhZygpO1xuICAgICAgfSBlbHNlIGlmICghdGhpcy5pc1pvb21pbmcgJiYgIXRoaXMuaXNNdWx0aXRvdWNoKSB7XG4gICAgICAgIC8vdGhpcy56b29tTGV2ZWxzLmNvcnJlY3Rab29tUGFuKCk7XG4gICAgICAgIHRoaXMuX2ZpbmlzaFRhcChlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbnVtQWN0aXZlUG9pbnRzIDwgMiAmJiB0aGlzLmlzWm9vbWluZykge1xuICAgICAgdGhpcy5pc1pvb21pbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuem9vbUxldmVscy5lbmQoKTtcblxuICAgICAgaWYgKHRoaXMuX251bUFjdGl2ZVBvaW50cyA9PT0gMSkge1xuICAgICAgICAvLyBTaW5jZSB3ZSBoYXZlIDEgcG9pbnQgbGVmdCwgd2UgbmVlZCB0byByZWluaXRpYXRlIGRyYWdcbiAgICAgICAgdGhpcy5kcmFnQXhpcyA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fdXBkYXRlU3RhcnRQb2ludHMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cblxuXG4gIF9yYWZSZW5kZXJMb29wKCkge1xuICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcgfHwgdGhpcy5pc1pvb21pbmcpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVZlbG9jaXR5KCk7XG5cbiAgICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoYXQgcG9pbnRlciBtb3ZlZCBzaW5jZSB0aGUgbGFzdCB1cGRhdGVcbiAgICAgICAgaWYgKCFwb2ludHNFcXVhbCh0aGlzLnAxLCB0aGlzLnByZXZQMSkpIHtcbiAgICAgICAgICB0aGlzLmRyYWcuY2hhbmdlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZVxuICAgICAgICAvKiBpZiAodGhpcy5pc1pvb21pbmcpICovXG4gICAgICAgIHtcbiAgICAgICAgICBpZiAoIXBvaW50c0VxdWFsKHRoaXMucDEsIHRoaXMucHJldlAxKSB8fCAhcG9pbnRzRXF1YWwodGhpcy5wMiwgdGhpcy5wcmV2UDIpKSB7XG4gICAgICAgICAgICB0aGlzLnpvb21MZXZlbHMuY2hhbmdlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgIHRoaXMuX3VwZGF0ZVByZXZQb2ludHMoKTtcblxuICAgICAgdGhpcy5yYWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fcmFmUmVuZGVyTG9vcC5iaW5kKHRoaXMpKTtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogVXBkYXRlIHZlbG9jaXR5IGF0IDUwbXMgaW50ZXJ2YWxcclxuICAgKlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogQHBhcmFtIHtib29sZWFufSBbZm9yY2VdXHJcbiAgICovXG5cblxuICBfdXBkYXRlVmVsb2NpdHkoZm9yY2UpIHtcbiAgICBjb25zdCB0aW1lID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRpbWUgLSB0aGlzLl9pbnRlcnZhbFRpbWU7XG5cbiAgICBpZiAoZHVyYXRpb24gPCA1MCAmJiAhZm9yY2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnZlbG9jaXR5LnggPSB0aGlzLl9nZXRWZWxvY2l0eSgneCcsIGR1cmF0aW9uKTtcbiAgICB0aGlzLnZlbG9jaXR5LnkgPSB0aGlzLl9nZXRWZWxvY2l0eSgneScsIGR1cmF0aW9uKTtcbiAgICB0aGlzLl9pbnRlcnZhbFRpbWUgPSB0aW1lO1xuICAgIGVxdWFsaXplUG9pbnRzKHRoaXMuX2ludGVydmFsUDEsIHRoaXMucDEpO1xuICAgIHRoaXMuX3ZlbG9jaXR5Q2FsY3VsYXRlZCA9IHRydWU7XG4gIH1cbiAgLyoqXHJcbiAgICogQHByaXZhdGVcclxuICAgKiBAcGFyYW0ge1BvaW50ZXJFdmVudH0gZVxyXG4gICAqL1xuXG5cbiAgX2ZpbmlzaFRhcChlKSB7XG4gICAgY29uc3Qge1xuICAgICAgbWFpblNjcm9sbFxuICAgIH0gPSB0aGlzLnBzd3A7IC8vIERvIG5vdCB0cmlnZ2VyIHRhcCBldmVudHMgaWYgbWFpbiBzY3JvbGwgaXMgc2hpZnRlZFxuXG4gICAgaWYgKG1haW5TY3JvbGwuaXNTaGlmdGVkKCkpIHtcbiAgICAgIC8vIHJlc3RvcmUgbWFpbiBzY3JvbGwgcG9zaXRpb25cbiAgICAgIC8vICh1c3VhbGx5IGhhcHBlbnMgaWYgc3RvcHBlZCBpbiB0aGUgbWlkZGxlIG9mIGFuaW1hdGlvbilcbiAgICAgIG1haW5TY3JvbGwubW92ZUluZGV4QnkoMCwgdHJ1ZSk7XG4gICAgICByZXR1cm47XG4gICAgfSAvLyBEbyBub3QgdHJpZ2dlciB0YXAgZm9yIHRvdWNoY2FuY2VsIG9yIHBvaW50ZXJjYW5jZWxcblxuXG4gICAgaWYgKGUudHlwZS5pbmRleE9mKCdjYW5jZWwnKSA+IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9IC8vIFRyaWdnZXIgY2xpY2sgaW5zdGVhZCBvZiB0YXAgZm9yIG1vdXNlIGV2ZW50c1xuXG5cbiAgICBpZiAoZS50eXBlID09PSAnbW91c2V1cCcgfHwgZS5wb2ludGVyVHlwZSA9PT0gJ21vdXNlJykge1xuICAgICAgdGhpcy50YXBIYW5kbGVyLmNsaWNrKHRoaXMuc3RhcnRQMSwgZSk7XG4gICAgICByZXR1cm47XG4gICAgfSAvLyBEaXNhYmxlIGRlbGF5IGlmIHRoZXJlIGlzIG5vIGRvdWJsZVRhcEFjdGlvblxuXG5cbiAgICBjb25zdCB0YXBEZWxheSA9IHRoaXMucHN3cC5vcHRpb25zLmRvdWJsZVRhcEFjdGlvbiA/IERPVUJMRV9UQVBfREVMQVkgOiAwOyAvLyBJZiB0YXBUaW1lciBpcyBkZWZpbmVkIC0gd2UgdGFwcGVkIHJlY2VudGx5LFxuICAgIC8vIGNoZWNrIGlmIHRoZSBjdXJyZW50IHRhcCBpcyBjbG9zZSB0byB0aGUgcHJldmlvdXMgb25lLFxuICAgIC8vIGlmIHllcyAtIHRyaWdnZXIgZG91YmxlIHRhcFxuXG4gICAgaWYgKHRoaXMuX3RhcFRpbWVyKSB7XG4gICAgICB0aGlzLl9jbGVhclRhcFRpbWVyKCk7IC8vIENoZWNrIGlmIHR3byB0YXBzIHdlcmUgbW9yZSBvciBsZXNzIG9uIHRoZSBzYW1lIHBsYWNlXG5cblxuICAgICAgaWYgKGdldERpc3RhbmNlQmV0d2Vlbih0aGlzLl9sYXN0U3RhcnRQMSwgdGhpcy5zdGFydFAxKSA8IE1JTl9UQVBfRElTVEFOQ0UpIHtcbiAgICAgICAgdGhpcy50YXBIYW5kbGVyLmRvdWJsZVRhcCh0aGlzLnN0YXJ0UDEsIGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlcXVhbGl6ZVBvaW50cyh0aGlzLl9sYXN0U3RhcnRQMSwgdGhpcy5zdGFydFAxKTtcbiAgICAgIHRoaXMuX3RhcFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMudGFwSGFuZGxlci50YXAodGhpcy5zdGFydFAxLCBlKTtcblxuICAgICAgICB0aGlzLl9jbGVhclRhcFRpbWVyKCk7XG4gICAgICB9LCB0YXBEZWxheSk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXG5cblxuICBfY2xlYXJUYXBUaW1lcigpIHtcbiAgICBpZiAodGhpcy5fdGFwVGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90YXBUaW1lcik7XG4gICAgICB0aGlzLl90YXBUaW1lciA9IG51bGw7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIEdldCB2ZWxvY2l0eSBmb3IgYXhpc1xyXG4gICAqXHJcbiAgICogQHByaXZhdGVcclxuICAgKiBAcGFyYW0geyd4JyB8ICd5J30gYXhpc1xyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvblxyXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICovXG5cblxuICBfZ2V0VmVsb2NpdHkoYXhpcywgZHVyYXRpb24pIHtcbiAgICAvLyBkaXNwbGFjZW1lbnQgaXMgbGlrZSBkaXN0YW5jZSwgYnV0IGNhbiBiZSBuZWdhdGl2ZS5cbiAgICBjb25zdCBkaXNwbGFjZW1lbnQgPSB0aGlzLnAxW2F4aXNdIC0gdGhpcy5faW50ZXJ2YWxQMVtheGlzXTtcblxuICAgIGlmIChNYXRoLmFicyhkaXNwbGFjZW1lbnQpID4gMSAmJiBkdXJhdGlvbiA+IDUpIHtcbiAgICAgIHJldHVybiBkaXNwbGFjZW1lbnQgLyBkdXJhdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuICAvKipcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xuXG5cbiAgX3JhZlN0b3BMb29wKCkge1xuICAgIGlmICh0aGlzLnJhZikge1xuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpO1xuICAgICAgdGhpcy5yYWYgPSBudWxsO1xuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEBwYXJhbSB7UG9pbnRlckV2ZW50fSBlXHJcbiAgICogQHBhcmFtIHsndXAnIHwgJ2Rvd24nIHwgJ21vdmUnfSBwb2ludGVyVHlwZSBOb3JtYWxpemVkIHBvaW50ZXIgdHlwZVxyXG4gICAqL1xuXG5cbiAgX3ByZXZlbnRQb2ludGVyRXZlbnRCZWhhdmlvdXIoZSwgcG9pbnRlclR5cGUpIHtcbiAgICBjb25zdCBwcmV2ZW50UG9pbnRlckV2ZW50ID0gdGhpcy5wc3dwLmFwcGx5RmlsdGVycygncHJldmVudFBvaW50ZXJFdmVudCcsIHRydWUsIGUsIHBvaW50ZXJUeXBlKTtcblxuICAgIGlmIChwcmV2ZW50UG9pbnRlckV2ZW50KSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIFBhcnNlcyBhbmQgbm9ybWFsaXplcyBwb2ludHMgZnJvbSB0aGUgdG91Y2gsIG1vdXNlIG9yIHBvaW50ZXIgZXZlbnQuXHJcbiAgICogVXBkYXRlcyBwMSBhbmQgcDIuXHJcbiAgICpcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEBwYXJhbSB7UG9pbnRlckV2ZW50IHwgVG91Y2hFdmVudH0gZVxyXG4gICAqIEBwYXJhbSB7J3VwJyB8ICdkb3duJyB8ICdtb3ZlJ30gcG9pbnRlclR5cGUgTm9ybWFsaXplZCBwb2ludGVyIHR5cGVcclxuICAgKi9cblxuXG4gIF91cGRhdGVQb2ludHMoZSwgcG9pbnRlclR5cGUpIHtcbiAgICBpZiAodGhpcy5fcG9pbnRlckV2ZW50RW5hYmxlZCkge1xuICAgICAgY29uc3QgcG9pbnRlckV2ZW50ID1cbiAgICAgIC8qKiBAdHlwZSB7UG9pbnRlckV2ZW50fSAqL1xuICAgICAgZTsgLy8gVHJ5IHRvIGZpbmQgdGhlIGN1cnJlbnQgcG9pbnRlciBpbiBvbmdvaW5nIHBvaW50ZXJzIGJ5IGl0cyBJRFxuXG4gICAgICBjb25zdCBwb2ludGVySW5kZXggPSB0aGlzLl9vbmdvaW5nUG9pbnRlcnMuZmluZEluZGV4KG9uZ29pbmdQb2ludGVyID0+IHtcbiAgICAgICAgcmV0dXJuIG9uZ29pbmdQb2ludGVyLmlkID09PSBwb2ludGVyRXZlbnQucG9pbnRlcklkO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChwb2ludGVyVHlwZSA9PT0gJ3VwJyAmJiBwb2ludGVySW5kZXggPiAtMSkge1xuICAgICAgICAvLyByZWxlYXNlIHRoZSBwb2ludGVyIC0gcmVtb3ZlIGl0IGZyb20gb25nb2luZ1xuICAgICAgICB0aGlzLl9vbmdvaW5nUG9pbnRlcnMuc3BsaWNlKHBvaW50ZXJJbmRleCwgMSk7XG4gICAgICB9IGVsc2UgaWYgKHBvaW50ZXJUeXBlID09PSAnZG93bicgJiYgcG9pbnRlckluZGV4ID09PSAtMSkge1xuICAgICAgICAvLyBhZGQgbmV3IHBvaW50ZXJcbiAgICAgICAgdGhpcy5fb25nb2luZ1BvaW50ZXJzLnB1c2godGhpcy5fY29udmVydEV2ZW50UG9zVG9Qb2ludChwb2ludGVyRXZlbnQsIHtcbiAgICAgICAgICB4OiAwLFxuICAgICAgICAgIHk6IDBcbiAgICAgICAgfSkpO1xuICAgICAgfSBlbHNlIGlmIChwb2ludGVySW5kZXggPiAtMSkge1xuICAgICAgICAvLyB1cGRhdGUgZXhpc3RpbmcgcG9pbnRlclxuICAgICAgICB0aGlzLl9jb252ZXJ0RXZlbnRQb3NUb1BvaW50KHBvaW50ZXJFdmVudCwgdGhpcy5fb25nb2luZ1BvaW50ZXJzW3BvaW50ZXJJbmRleF0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9udW1BY3RpdmVQb2ludHMgPSB0aGlzLl9vbmdvaW5nUG9pbnRlcnMubGVuZ3RoOyAvLyB1cGRhdGUgcG9pbnRzIHRoYXQgUGhvdG9Td2lwZSB1c2VzXG4gICAgICAvLyB0byBjYWxjdWxhdGUgcG9zaXRpb24gYW5kIHNjYWxlXG5cbiAgICAgIGlmICh0aGlzLl9udW1BY3RpdmVQb2ludHMgPiAwKSB7XG4gICAgICAgIGVxdWFsaXplUG9pbnRzKHRoaXMucDEsIHRoaXMuX29uZ29pbmdQb2ludGVyc1swXSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9udW1BY3RpdmVQb2ludHMgPiAxKSB7XG4gICAgICAgIGVxdWFsaXplUG9pbnRzKHRoaXMucDIsIHRoaXMuX29uZ29pbmdQb2ludGVyc1sxXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHRvdWNoRXZlbnQgPVxuICAgICAgLyoqIEB0eXBlIHtUb3VjaEV2ZW50fSAqL1xuICAgICAgZTtcbiAgICAgIHRoaXMuX251bUFjdGl2ZVBvaW50cyA9IDA7XG5cbiAgICAgIGlmICh0b3VjaEV2ZW50LnR5cGUuaW5kZXhPZigndG91Y2gnKSA+IC0xKSB7XG4gICAgICAgIC8vIFRvdWNoIEV2ZW50XG4gICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ub3VjaEV2ZW50XG4gICAgICAgIGlmICh0b3VjaEV2ZW50LnRvdWNoZXMgJiYgdG91Y2hFdmVudC50b3VjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLl9jb252ZXJ0RXZlbnRQb3NUb1BvaW50KHRvdWNoRXZlbnQudG91Y2hlc1swXSwgdGhpcy5wMSk7XG5cbiAgICAgICAgICB0aGlzLl9udW1BY3RpdmVQb2ludHMrKztcblxuICAgICAgICAgIGlmICh0b3VjaEV2ZW50LnRvdWNoZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdGhpcy5fY29udmVydEV2ZW50UG9zVG9Qb2ludCh0b3VjaEV2ZW50LnRvdWNoZXNbMV0sIHRoaXMucDIpO1xuXG4gICAgICAgICAgICB0aGlzLl9udW1BY3RpdmVQb2ludHMrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE1vdXNlIEV2ZW50XG4gICAgICAgIHRoaXMuX2NvbnZlcnRFdmVudFBvc1RvUG9pbnQoXG4gICAgICAgIC8qKiBAdHlwZSB7UG9pbnRlckV2ZW50fSAqL1xuICAgICAgICBlLCB0aGlzLnAxKTtcblxuICAgICAgICBpZiAocG9pbnRlclR5cGUgPT09ICd1cCcpIHtcbiAgICAgICAgICAvLyBjbGVhciBhbGwgcG9pbnRzIG9uIG1vdXNldXBcbiAgICAgICAgICB0aGlzLl9udW1BY3RpdmVQb2ludHMgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX251bUFjdGl2ZVBvaW50cysrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qKiB1cGRhdGUgcG9pbnRzIHRoYXQgd2VyZSB1c2VkIGR1cmluZyBwcmV2aW91cyByQUYgdGlja1xyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXG5cblxuICBfdXBkYXRlUHJldlBvaW50cygpIHtcbiAgICBlcXVhbGl6ZVBvaW50cyh0aGlzLnByZXZQMSwgdGhpcy5wMSk7XG4gICAgZXF1YWxpemVQb2ludHModGhpcy5wcmV2UDIsIHRoaXMucDIpO1xuICB9XG4gIC8qKiB1cGRhdGUgcG9pbnRzIGF0IHRoZSBzdGFydCBvZiBnZXN0dXJlXHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cblxuXG4gIF91cGRhdGVTdGFydFBvaW50cygpIHtcbiAgICBlcXVhbGl6ZVBvaW50cyh0aGlzLnN0YXJ0UDEsIHRoaXMucDEpO1xuICAgIGVxdWFsaXplUG9pbnRzKHRoaXMuc3RhcnRQMiwgdGhpcy5wMik7XG5cbiAgICB0aGlzLl91cGRhdGVQcmV2UG9pbnRzKCk7XG4gIH1cbiAgLyoqIEBwcml2YXRlICovXG5cblxuICBfY2FsY3VsYXRlRHJhZ0RpcmVjdGlvbigpIHtcbiAgICBpZiAodGhpcy5wc3dwLm1haW5TY3JvbGwuaXNTaGlmdGVkKCkpIHtcbiAgICAgIC8vIGlmIG1haW4gc2Nyb2xsIHBvc2l0aW9uIGlzIHNoaWZ0ZWQg4oCTIGRpcmVjdGlvbiBpcyBhbHdheXMgaG9yaXpvbnRhbFxuICAgICAgdGhpcy5kcmFnQXhpcyA9ICd4JztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY2FsY3VsYXRlIGRlbHRhIG9mIHRoZSBsYXN0IHRvdWNobW92ZSB0aWNrXG4gICAgICBjb25zdCBkaWZmID0gTWF0aC5hYnModGhpcy5wMS54IC0gdGhpcy5zdGFydFAxLngpIC0gTWF0aC5hYnModGhpcy5wMS55IC0gdGhpcy5zdGFydFAxLnkpO1xuXG4gICAgICBpZiAoZGlmZiAhPT0gMCkge1xuICAgICAgICAvLyBjaGVjayBpZiBwb2ludGVyIHdhcyBzaGlmdGVkIGhvcml6b250YWxseSBvciB2ZXJ0aWNhbGx5XG4gICAgICAgIGNvbnN0IGF4aXNUb0NoZWNrID0gZGlmZiA+IDAgPyAneCcgOiAneSc7XG5cbiAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMucDFbYXhpc1RvQ2hlY2tdIC0gdGhpcy5zdGFydFAxW2F4aXNUb0NoZWNrXSkgPj0gQVhJU19TV0lQRV9IWVNURVJJU0lTKSB7XG4gICAgICAgICAgdGhpcy5kcmFnQXhpcyA9IGF4aXNUb0NoZWNrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIENvbnZlcnRzIHRvdWNoLCBwb2ludGVyIG9yIG1vdXNlIGV2ZW50XHJcbiAgICogdG8gUGhvdG9Td2lwZSBwb2ludC5cclxuICAgKlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogQHBhcmFtIHtUb3VjaCB8IFBvaW50ZXJFdmVudH0gZVxyXG4gICAqIEBwYXJhbSB7UG9pbnR9IHBcclxuICAgKiBAcmV0dXJucyB7UG9pbnR9XHJcbiAgICovXG5cblxuICBfY29udmVydEV2ZW50UG9zVG9Qb2ludChlLCBwKSB7XG4gICAgcC54ID0gZS5wYWdlWCAtIHRoaXMucHN3cC5vZmZzZXQueDtcbiAgICBwLnkgPSBlLnBhZ2VZIC0gdGhpcy5wc3dwLm9mZnNldC55O1xuXG4gICAgaWYgKCdwb2ludGVySWQnIGluIGUpIHtcbiAgICAgIHAuaWQgPSBlLnBvaW50ZXJJZDtcbiAgICB9IGVsc2UgaWYgKGUuaWRlbnRpZmllciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBwLmlkID0gZS5pZGVudGlmaWVyO1xuICAgIH1cblxuICAgIHJldHVybiBwO1xuICB9XG4gIC8qKlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogQHBhcmFtIHtQb2ludGVyRXZlbnR9IGVcclxuICAgKi9cblxuXG4gIF9vbkNsaWNrKGUpIHtcbiAgICAvLyBEbyBub3QgYWxsb3cgY2xpY2sgZXZlbnQgdG8gcGFzcyB0aHJvdWdoIGFmdGVyIGRyYWdcbiAgICBpZiAodGhpcy5wc3dwLm1haW5TY3JvbGwuaXNTaGlmdGVkKCkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9XG5cbn1cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4vcGhvdG9zd2lwZS5qcycpLmRlZmF1bHR9IFBob3RvU3dpcGUgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4vc2xpZGUvc2xpZGUuanMnKS5kZWZhdWx0fSBTbGlkZSAqL1xuXG4vKiogQHR5cGVkZWYge3sgZWw6IEhUTUxEaXZFbGVtZW50OyBzbGlkZT86IFNsaWRlIH19IEl0ZW1Ib2xkZXIgKi9cblxuY29uc3QgTUFJTl9TQ1JPTExfRU5EX0ZSSUNUSU9OID0gMC4zNTsgLy8gY29uc3QgTUlOX1NXSVBFX1RSQU5TSVRJT05fRFVSQVRJT04gPSAyNTA7XG4vLyBjb25zdCBNQVhfU1dJUEVfVFJBQlNJVElPTl9EVVJBVElPTiA9IDUwMDtcbi8vIGNvbnN0IERFRkFVTFRfU1dJUEVfVFJBTlNJVElPTl9EVVJBVElPTiA9IDMzMztcblxuLyoqXHJcbiAqIEhhbmRsZXMgbW92ZW1lbnQgb2YgdGhlIG1haW4gc2Nyb2xsaW5nIGNvbnRhaW5lclxyXG4gKiAoZm9yIGV4YW1wbGUsIGl0IHJlcG9zaXRpb25zIHdoZW4gdXNlciBzd2lwZXMgbGVmdCBvciByaWdodCkuXHJcbiAqXHJcbiAqIEFsc28gc3RvcmVzIGl0cyBzdGF0ZS5cclxuICovXG5cbmNsYXNzIE1haW5TY3JvbGwge1xuICAvKipcclxuICAgKiBAcGFyYW0ge1Bob3RvU3dpcGV9IHBzd3BcclxuICAgKi9cbiAgY29uc3RydWN0b3IocHN3cCkge1xuICAgIHRoaXMucHN3cCA9IHBzd3A7XG4gICAgdGhpcy54ID0gMDtcbiAgICB0aGlzLnNsaWRlV2lkdGggPSAwO1xuICAgIC8qKiBAcHJpdmF0ZSAqL1xuXG4gICAgdGhpcy5fY3VyclBvc2l0aW9uSW5kZXggPSAwO1xuICAgIC8qKiBAcHJpdmF0ZSAqL1xuXG4gICAgdGhpcy5fcHJldlBvc2l0aW9uSW5kZXggPSAwO1xuICAgIC8qKiBAcHJpdmF0ZSAqL1xuXG4gICAgdGhpcy5fY29udGFpbmVyU2hpZnRJbmRleCA9IC0xO1xuICAgIC8qKiBAdHlwZSB7SXRlbUhvbGRlcltdfSAqL1xuXG4gICAgdGhpcy5pdGVtSG9sZGVycyA9IFtdO1xuICB9XG4gIC8qKlxyXG4gICAqIFBvc2l0aW9uIHRoZSBzY3JvbGxlciBhbmQgc2xpZGUgY29udGFpbmVyc1xyXG4gICAqIGFjY29yZGluZyB0byB2aWV3cG9ydCBzaXplLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtib29sZWFufSBbcmVzaXplU2xpZGVzXSBXaGV0aGVyIHNsaWRlcyBjb250ZW50IHNob3VsZCByZXNpemVkXHJcbiAgICovXG5cblxuICByZXNpemUocmVzaXplU2xpZGVzKSB7XG4gICAgY29uc3Qge1xuICAgICAgcHN3cFxuICAgIH0gPSB0aGlzO1xuICAgIGNvbnN0IG5ld1NsaWRlV2lkdGggPSBNYXRoLnJvdW5kKHBzd3Audmlld3BvcnRTaXplLnggKyBwc3dwLnZpZXdwb3J0U2l6ZS54ICogcHN3cC5vcHRpb25zLnNwYWNpbmcpOyAvLyBNb2JpbGUgYnJvd3NlcnMgbWlnaHQgdHJpZ2dlciBhIHJlc2l6ZSBldmVudCBkdXJpbmcgYSBnZXN0dXJlLlxuICAgIC8vIChkdWUgdG8gdG9vbGJhciBhcHBlYXJpbmcgb3IgaGlkaW5nKS5cbiAgICAvLyBBdm9pZCByZS1hZGp1c3RpbmcgbWFpbiBzY3JvbGwgcG9zaXRpb24gaWYgd2lkdGggd2Fzbid0IGNoYW5nZWRcblxuICAgIGNvbnN0IHNsaWRlV2lkdGhDaGFuZ2VkID0gbmV3U2xpZGVXaWR0aCAhPT0gdGhpcy5zbGlkZVdpZHRoO1xuXG4gICAgaWYgKHNsaWRlV2lkdGhDaGFuZ2VkKSB7XG4gICAgICB0aGlzLnNsaWRlV2lkdGggPSBuZXdTbGlkZVdpZHRoO1xuICAgICAgdGhpcy5tb3ZlVG8odGhpcy5nZXRDdXJyU2xpZGVYKCkpO1xuICAgIH1cblxuICAgIHRoaXMuaXRlbUhvbGRlcnMuZm9yRWFjaCgoaXRlbUhvbGRlciwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChzbGlkZVdpZHRoQ2hhbmdlZCkge1xuICAgICAgICBzZXRUcmFuc2Zvcm0oaXRlbUhvbGRlci5lbCwgKGluZGV4ICsgdGhpcy5fY29udGFpbmVyU2hpZnRJbmRleCkgKiB0aGlzLnNsaWRlV2lkdGgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzaXplU2xpZGVzICYmIGl0ZW1Ib2xkZXIuc2xpZGUpIHtcbiAgICAgICAgaXRlbUhvbGRlci5zbGlkZS5yZXNpemUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvKipcclxuICAgKiBSZXNldCBYIHBvc2l0aW9uIG9mIHRoZSBtYWluIHNjcm9sbGVyIHRvIHplcm9cclxuICAgKi9cblxuXG4gIHJlc2V0UG9zaXRpb24oKSB7XG4gICAgLy8gUG9zaXRpb24gb24gdGhlIG1haW4gc2Nyb2xsZXIgKG9mZnNldClcbiAgICAvLyBpdCBpcyBpbmRlcGVuZGVudCBmcm9tIHNsaWRlIGluZGV4XG4gICAgdGhpcy5fY3VyclBvc2l0aW9uSW5kZXggPSAwO1xuICAgIHRoaXMuX3ByZXZQb3NpdGlvbkluZGV4ID0gMDsgLy8gVGhpcyB3aWxsIGZvcmNlIHJlY2FsY3VsYXRpb24gb2Ygc2l6ZSBvbiBuZXh0IHJlc2l6ZSgpXG5cbiAgICB0aGlzLnNsaWRlV2lkdGggPSAwOyAvLyBfY29udGFpbmVyU2hpZnRJbmRleCp2aWV3cG9ydFNpemUgd2lsbCBnaXZlIHlvdSBhbW91bnQgb2YgdHJhbnNmb3JtIG9mIHRoZSBjdXJyZW50IHNsaWRlXG5cbiAgICB0aGlzLl9jb250YWluZXJTaGlmdEluZGV4ID0gLTE7XG4gIH1cbiAgLyoqXHJcbiAgICogQ3JlYXRlIGFuZCBhcHBlbmQgYXJyYXkgb2YgdGhyZWUgaXRlbXNcclxuICAgKiB0aGF0IGhvbGQgZGF0YSBhYm91dCBzbGlkZXMgaW4gRE9NXHJcbiAgICovXG5cblxuICBhcHBlbmRIb2xkZXJzKCkge1xuICAgIHRoaXMuaXRlbUhvbGRlcnMgPSBbXTsgLy8gYXBwZW5kIG91ciB0aHJlZSBzbGlkZSBob2xkZXJzIC1cbiAgICAvLyBwcmV2aW91cywgY3VycmVudCwgYW5kIG5leHRcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICBjb25zdCBlbCA9IGNyZWF0ZUVsZW1lbnQoJ3Bzd3BfX2l0ZW0nLCAnZGl2JywgdGhpcy5wc3dwLmNvbnRhaW5lcik7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnZ3JvdXAnKTtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1yb2xlZGVzY3JpcHRpb24nLCAnc2xpZGUnKTtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpOyAvLyBoaWRlIG5lYXJieSBpdGVtIGhvbGRlcnMgdW50aWwgaW5pdGlhbCB6b29tIGFuaW1hdGlvbiBmaW5pc2hlcyAodG8gYXZvaWQgZXh0cmEgUGFpbnRzKVxuXG4gICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gaSA9PT0gMSA/ICdibG9jaycgOiAnbm9uZSc7XG4gICAgICB0aGlzLml0ZW1Ib2xkZXJzLnB1c2goe1xuICAgICAgICBlbCAvL2luZGV4OiAtMVxuXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogV2hldGhlciB0aGUgbWFpbiBzY3JvbGwgY2FuIGJlIGhvcml6b250YWxseSBzd2lwZWQgdG8gdGhlIG5leHQgb3IgcHJldmlvdXMgc2xpZGUuXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXG5cblxuICBjYW5CZVN3aXBlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wc3dwLmdldE51bUl0ZW1zKCkgPiAxO1xuICB9XG4gIC8qKlxyXG4gICAqIE1vdmUgbWFpbiBzY3JvbGwgYnkgWCBhbW91bnQgb2Ygc2xpZGVzLlxyXG4gICAqIEZvciBleGFtcGxlOlxyXG4gICAqICAgYC0xYCB3aWxsIG1vdmUgdG8gdGhlIHByZXZpb3VzIHNsaWRlLFxyXG4gICAqICAgIGAwYCB3aWxsIHJlc2V0IHRoZSBzY3JvbGwgcG9zaXRpb24gb2YgdGhlIGN1cnJlbnQgc2xpZGUsXHJcbiAgICogICAgYDNgIHdpbGwgbW92ZSB0aHJlZSBzbGlkZXMgZm9yd2FyZFxyXG4gICAqXHJcbiAgICogSWYgbG9vcCBvcHRpb24gaXMgZW5hYmxlZCAtIGluZGV4IHdpbGwgYmUgYXV0b21hdGljYWxseSBsb29wZWQgdG9vLFxyXG4gICAqIChmb3IgZXhhbXBsZSBgLTFgIHdpbGwgbW92ZSB0byB0aGUgbGFzdCBzbGlkZSBvZiB0aGUgZ2FsbGVyeSkuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge251bWJlcn0gZGlmZlxyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2FuaW1hdGVdXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IFt2ZWxvY2l0eVhdXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHdoZXRoZXIgaW5kZXggd2FzIGNoYW5nZWQgb3Igbm90XHJcbiAgICovXG5cblxuICBtb3ZlSW5kZXhCeShkaWZmLCBhbmltYXRlLCB2ZWxvY2l0eVgpIHtcbiAgICBjb25zdCB7XG4gICAgICBwc3dwXG4gICAgfSA9IHRoaXM7XG4gICAgbGV0IG5ld0luZGV4ID0gcHN3cC5wb3RlbnRpYWxJbmRleCArIGRpZmY7XG4gICAgY29uc3QgbnVtU2xpZGVzID0gcHN3cC5nZXROdW1JdGVtcygpO1xuXG4gICAgaWYgKHBzd3AuY2FuTG9vcCgpKSB7XG4gICAgICBuZXdJbmRleCA9IHBzd3AuZ2V0TG9vcGVkSW5kZXgobmV3SW5kZXgpO1xuICAgICAgY29uc3QgZGlzdGFuY2UgPSAoZGlmZiArIG51bVNsaWRlcykgJSBudW1TbGlkZXM7XG5cbiAgICAgIGlmIChkaXN0YW5jZSA8PSBudW1TbGlkZXMgLyAyKSB7XG4gICAgICAgIC8vIGdvIGZvcndhcmRcbiAgICAgICAgZGlmZiA9IGRpc3RhbmNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZ28gYmFja3dhcmRzXG4gICAgICAgIGRpZmYgPSBkaXN0YW5jZSAtIG51bVNsaWRlcztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG5ld0luZGV4IDwgMCkge1xuICAgICAgICBuZXdJbmRleCA9IDA7XG4gICAgICB9IGVsc2UgaWYgKG5ld0luZGV4ID49IG51bVNsaWRlcykge1xuICAgICAgICBuZXdJbmRleCA9IG51bVNsaWRlcyAtIDE7XG4gICAgICB9XG5cbiAgICAgIGRpZmYgPSBuZXdJbmRleCAtIHBzd3AucG90ZW50aWFsSW5kZXg7XG4gICAgfVxuXG4gICAgcHN3cC5wb3RlbnRpYWxJbmRleCA9IG5ld0luZGV4O1xuICAgIHRoaXMuX2N1cnJQb3NpdGlvbkluZGV4IC09IGRpZmY7XG4gICAgcHN3cC5hbmltYXRpb25zLnN0b3BNYWluU2Nyb2xsKCk7XG4gICAgY29uc3QgZGVzdGluYXRpb25YID0gdGhpcy5nZXRDdXJyU2xpZGVYKCk7XG5cbiAgICBpZiAoIWFuaW1hdGUpIHtcbiAgICAgIHRoaXMubW92ZVRvKGRlc3RpbmF0aW9uWCk7XG4gICAgICB0aGlzLnVwZGF0ZUN1cnJJdGVtKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBzd3AuYW5pbWF0aW9ucy5zdGFydFNwcmluZyh7XG4gICAgICAgIGlzTWFpblNjcm9sbDogdHJ1ZSxcbiAgICAgICAgc3RhcnQ6IHRoaXMueCxcbiAgICAgICAgZW5kOiBkZXN0aW5hdGlvblgsXG4gICAgICAgIHZlbG9jaXR5OiB2ZWxvY2l0eVggfHwgMCxcbiAgICAgICAgbmF0dXJhbEZyZXF1ZW5jeTogMzAsXG4gICAgICAgIGRhbXBpbmdSYXRpbzogMSxcbiAgICAgICAgLy8wLjcsXG4gICAgICAgIG9uVXBkYXRlOiB4ID0+IHtcbiAgICAgICAgICB0aGlzLm1vdmVUbyh4KTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Db21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgIHRoaXMudXBkYXRlQ3Vyckl0ZW0oKTtcbiAgICAgICAgICBwc3dwLmFwcGVuZEhlYXZ5KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbGV0IGN1cnJEaWZmID0gcHN3cC5wb3RlbnRpYWxJbmRleCAtIHBzd3AuY3VyckluZGV4O1xuXG4gICAgICBpZiAocHN3cC5jYW5Mb29wKCkpIHtcbiAgICAgICAgY29uc3QgY3VyckRpc3RhbmNlID0gKGN1cnJEaWZmICsgbnVtU2xpZGVzKSAlIG51bVNsaWRlcztcblxuICAgICAgICBpZiAoY3VyckRpc3RhbmNlIDw9IG51bVNsaWRlcyAvIDIpIHtcbiAgICAgICAgICAvLyBnbyBmb3J3YXJkXG4gICAgICAgICAgY3VyckRpZmYgPSBjdXJyRGlzdGFuY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZ28gYmFja3dhcmRzXG4gICAgICAgICAgY3VyckRpZmYgPSBjdXJyRGlzdGFuY2UgLSBudW1TbGlkZXM7XG4gICAgICAgIH1cbiAgICAgIH0gLy8gRm9yY2UtYXBwZW5kIG5ldyBzbGlkZXMgZHVyaW5nIHRyYW5zaXRpb25cbiAgICAgIC8vIGlmIGRpZmZlcmVuY2UgYmV0d2VlbiBzbGlkZXMgaXMgbW9yZSB0aGFuIDFcblxuXG4gICAgICBpZiAoTWF0aC5hYnMoY3VyckRpZmYpID4gMSkge1xuICAgICAgICB0aGlzLnVwZGF0ZUN1cnJJdGVtKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIEJvb2xlYW4oZGlmZik7XG4gIH1cbiAgLyoqXHJcbiAgICogWCBwb3NpdGlvbiBvZiB0aGUgbWFpbiBzY3JvbGwgZm9yIHRoZSBjdXJyZW50IHNsaWRlXHJcbiAgICogKGlnbm9yZXMgcG9zaXRpb24gZHVyaW5nIGRyYWdnaW5nKVxyXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICovXG5cblxuICBnZXRDdXJyU2xpZGVYKCkge1xuICAgIHJldHVybiB0aGlzLnNsaWRlV2lkdGggKiB0aGlzLl9jdXJyUG9zaXRpb25JbmRleDtcbiAgfVxuICAvKipcclxuICAgKiBXaGV0aGVyIHNjcm9sbCBwb3NpdGlvbiBpcyBzaGlmdGVkLlxyXG4gICAqIEZvciBleGFtcGxlLCBpdCB3aWxsIHJldHVybiB0cnVlIGlmIHRoZSBzY3JvbGwgaXMgYmVpbmcgZHJhZ2dlZCBvciBhbmltYXRlZC5cclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cblxuXG4gIGlzU2hpZnRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy54ICE9PSB0aGlzLmdldEN1cnJTbGlkZVgoKTtcbiAgfVxuICAvKipcclxuICAgKiBVcGRhdGUgc2xpZGVzIFggcG9zaXRpb25zIGFuZCBzZXQgdGhlaXIgY29udGVudFxyXG4gICAqL1xuXG5cbiAgdXBkYXRlQ3Vyckl0ZW0oKSB7XG4gICAgdmFyIF90aGlzJGl0ZW1Ib2xkZXJzJDtcblxuICAgIGNvbnN0IHtcbiAgICAgIHBzd3BcbiAgICB9ID0gdGhpcztcbiAgICBjb25zdCBwb3NpdGlvbkRpZmZlcmVuY2UgPSB0aGlzLl9wcmV2UG9zaXRpb25JbmRleCAtIHRoaXMuX2N1cnJQb3NpdGlvbkluZGV4O1xuXG4gICAgaWYgKCFwb3NpdGlvbkRpZmZlcmVuY2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9wcmV2UG9zaXRpb25JbmRleCA9IHRoaXMuX2N1cnJQb3NpdGlvbkluZGV4O1xuICAgIHBzd3AuY3VyckluZGV4ID0gcHN3cC5wb3RlbnRpYWxJbmRleDtcbiAgICBsZXQgZGlmZkFicyA9IE1hdGguYWJzKHBvc2l0aW9uRGlmZmVyZW5jZSk7XG4gICAgLyoqIEB0eXBlIHtJdGVtSG9sZGVyIHwgdW5kZWZpbmVkfSAqL1xuXG4gICAgbGV0IHRlbXBIb2xkZXI7XG5cbiAgICBpZiAoZGlmZkFicyA+PSAzKSB7XG4gICAgICB0aGlzLl9jb250YWluZXJTaGlmdEluZGV4ICs9IHBvc2l0aW9uRGlmZmVyZW5jZSArIChwb3NpdGlvbkRpZmZlcmVuY2UgPiAwID8gLTMgOiAzKTtcbiAgICAgIGRpZmZBYnMgPSAzOyAvLyBJZiBzbGlkZXMgYXJlIGNoYW5nZWQgYnkgMyBzY3JlZW5zIG9yIG1vcmUgLSBjbGVhbiB1cCBwcmV2aW91cyBzbGlkZXNcblxuICAgICAgdGhpcy5pdGVtSG9sZGVycy5mb3JFYWNoKGl0ZW1Ib2xkZXIgPT4ge1xuICAgICAgICB2YXIgX2l0ZW1Ib2xkZXIkc2xpZGU7XG5cbiAgICAgICAgKF9pdGVtSG9sZGVyJHNsaWRlID0gaXRlbUhvbGRlci5zbGlkZSkgPT09IG51bGwgfHwgX2l0ZW1Ib2xkZXIkc2xpZGUgPT09IHZvaWQgMCB8fCBfaXRlbUhvbGRlciRzbGlkZS5kZXN0cm95KCk7XG4gICAgICAgIGl0ZW1Ib2xkZXIuc2xpZGUgPSB1bmRlZmluZWQ7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpZmZBYnM7IGkrKykge1xuICAgICAgaWYgKHBvc2l0aW9uRGlmZmVyZW5jZSA+IDApIHtcbiAgICAgICAgdGVtcEhvbGRlciA9IHRoaXMuaXRlbUhvbGRlcnMuc2hpZnQoKTtcblxuICAgICAgICBpZiAodGVtcEhvbGRlcikge1xuICAgICAgICAgIHRoaXMuaXRlbUhvbGRlcnNbMl0gPSB0ZW1wSG9sZGVyOyAvLyBtb3ZlIGZpcnN0IHRvIGxhc3RcblxuICAgICAgICAgIHRoaXMuX2NvbnRhaW5lclNoaWZ0SW5kZXgrKztcbiAgICAgICAgICBzZXRUcmFuc2Zvcm0odGVtcEhvbGRlci5lbCwgKHRoaXMuX2NvbnRhaW5lclNoaWZ0SW5kZXggKyAyKSAqIHRoaXMuc2xpZGVXaWR0aCk7XG4gICAgICAgICAgcHN3cC5zZXRDb250ZW50KHRlbXBIb2xkZXIsIHBzd3AuY3VyckluZGV4IC0gZGlmZkFicyArIGkgKyAyKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGVtcEhvbGRlciA9IHRoaXMuaXRlbUhvbGRlcnMucG9wKCk7XG5cbiAgICAgICAgaWYgKHRlbXBIb2xkZXIpIHtcbiAgICAgICAgICB0aGlzLml0ZW1Ib2xkZXJzLnVuc2hpZnQodGVtcEhvbGRlcik7IC8vIG1vdmUgbGFzdCB0byBmaXJzdFxuXG4gICAgICAgICAgdGhpcy5fY29udGFpbmVyU2hpZnRJbmRleC0tO1xuICAgICAgICAgIHNldFRyYW5zZm9ybSh0ZW1wSG9sZGVyLmVsLCB0aGlzLl9jb250YWluZXJTaGlmdEluZGV4ICogdGhpcy5zbGlkZVdpZHRoKTtcbiAgICAgICAgICBwc3dwLnNldENvbnRlbnQodGVtcEhvbGRlciwgcHN3cC5jdXJySW5kZXggKyBkaWZmQWJzIC0gaSAtIDIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSAvLyBSZXNldCB0cmFuc2Zyb20gZXZlcnkgNTBpc2ggbmF2aWdhdGlvbnMgaW4gb25lIGRpcmVjdGlvbi5cbiAgICAvL1xuICAgIC8vIE90aGVyd2lzZSB0cmFuc2Zvcm0gd2lsbCBrZWVwIGdyb3dpbmcgaW5kZWZpbml0ZWx5LFxuICAgIC8vIHdoaWNoIG1pZ2h0IGNhdXNlIGlzc3VlcyBhcyBicm93c2VycyBoYXZlIGEgbWF4aW11bSB0cmFuc2Zvcm0gbGltaXQuXG4gICAgLy8gSSB3YXNuJ3QgYWJsZSB0byByZWFjaCBpdCwgYnV0IGp1c3QgdG8gYmUgc2FmZS5cbiAgICAvLyBUaGlzIHNob3VsZCBub3QgY2F1c2Ugbm90aWNhYmxlIGxhZy5cblxuXG4gICAgaWYgKE1hdGguYWJzKHRoaXMuX2NvbnRhaW5lclNoaWZ0SW5kZXgpID4gNTAgJiYgIXRoaXMuaXNTaGlmdGVkKCkpIHtcbiAgICAgIHRoaXMucmVzZXRQb3NpdGlvbigpO1xuICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICB9IC8vIFBhbiB0cmFuc2l0aW9uIG1pZ2h0IGJlIHJ1bm5pbmcgKGFuZCBjb25zbnRhbnRseSB1cGRhdGluZyBwYW4gcG9zaXRpb24pXG5cblxuICAgIHBzd3AuYW5pbWF0aW9ucy5zdG9wQWxsUGFuKCk7XG4gICAgdGhpcy5pdGVtSG9sZGVycy5mb3JFYWNoKChpdGVtSG9sZGVyLCBpKSA9PiB7XG4gICAgICBpZiAoaXRlbUhvbGRlci5zbGlkZSkge1xuICAgICAgICAvLyBTbGlkZSBpbiB0aGUgMm5kIGhvbGRlciBpcyBhbHdheXMgYWN0aXZlXG4gICAgICAgIGl0ZW1Ib2xkZXIuc2xpZGUuc2V0SXNBY3RpdmUoaSA9PT0gMSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcHN3cC5jdXJyU2xpZGUgPSAoX3RoaXMkaXRlbUhvbGRlcnMkID0gdGhpcy5pdGVtSG9sZGVyc1sxXSkgPT09IG51bGwgfHwgX3RoaXMkaXRlbUhvbGRlcnMkID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfdGhpcyRpdGVtSG9sZGVycyQuc2xpZGU7XG4gICAgcHN3cC5jb250ZW50TG9hZGVyLnVwZGF0ZUxhenkocG9zaXRpb25EaWZmZXJlbmNlKTtcblxuICAgIGlmIChwc3dwLmN1cnJTbGlkZSkge1xuICAgICAgcHN3cC5jdXJyU2xpZGUuYXBwbHlDdXJyZW50Wm9vbVBhbigpO1xuICAgIH1cblxuICAgIHBzd3AuZGlzcGF0Y2goJ2NoYW5nZScpO1xuICB9XG4gIC8qKlxyXG4gICAqIE1vdmUgdGhlIFggcG9zaXRpb24gb2YgdGhlIG1haW4gc2Nyb2xsIGNvbnRhaW5lclxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtkcmFnZ2luZ11cclxuICAgKi9cblxuXG4gIG1vdmVUbyh4LCBkcmFnZ2luZykge1xuICAgIGlmICghdGhpcy5wc3dwLmNhbkxvb3AoKSAmJiBkcmFnZ2luZykge1xuICAgICAgLy8gQXBwbHkgZnJpY3Rpb25cbiAgICAgIGxldCBuZXdTbGlkZUluZGV4T2Zmc2V0ID0gKHRoaXMuc2xpZGVXaWR0aCAqIHRoaXMuX2N1cnJQb3NpdGlvbkluZGV4IC0geCkgLyB0aGlzLnNsaWRlV2lkdGg7XG4gICAgICBuZXdTbGlkZUluZGV4T2Zmc2V0ICs9IHRoaXMucHN3cC5jdXJySW5kZXg7XG4gICAgICBjb25zdCBkZWx0YSA9IE1hdGgucm91bmQoeCAtIHRoaXMueCk7XG5cbiAgICAgIGlmIChuZXdTbGlkZUluZGV4T2Zmc2V0IDwgMCAmJiBkZWx0YSA+IDAgfHwgbmV3U2xpZGVJbmRleE9mZnNldCA+PSB0aGlzLnBzd3AuZ2V0TnVtSXRlbXMoKSAtIDEgJiYgZGVsdGEgPCAwKSB7XG4gICAgICAgIHggPSB0aGlzLnggKyBkZWx0YSAqIE1BSU5fU0NST0xMX0VORF9GUklDVElPTjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnggPSB4O1xuXG4gICAgaWYgKHRoaXMucHN3cC5jb250YWluZXIpIHtcbiAgICAgIHNldFRyYW5zZm9ybSh0aGlzLnBzd3AuY29udGFpbmVyLCB4KTtcbiAgICB9XG5cbiAgICB0aGlzLnBzd3AuZGlzcGF0Y2goJ21vdmVNYWluU2Nyb2xsJywge1xuICAgICAgeCxcbiAgICAgIGRyYWdnaW5nOiBkcmFnZ2luZyAhPT0gbnVsbCAmJiBkcmFnZ2luZyAhPT0gdm9pZCAwID8gZHJhZ2dpbmcgOiBmYWxzZVxuICAgIH0pO1xuICB9XG5cbn1cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4vcGhvdG9zd2lwZS5qcycpLmRlZmF1bHR9IFBob3RvU3dpcGUgKi9cblxuLyoqXHJcbiAqIEB0ZW1wbGF0ZSBUXHJcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vdHlwZXMuanMnKS5NZXRob2RzPFQ+fSBNZXRob2RzPFQ+XHJcbiAqL1xuXG5jb25zdCBLZXlib2FyZEtleUNvZGVzTWFwID0ge1xuICBFc2NhcGU6IDI3LFxuICB6OiA5MCxcbiAgQXJyb3dMZWZ0OiAzNyxcbiAgQXJyb3dVcDogMzgsXG4gIEFycm93UmlnaHQ6IDM5LFxuICBBcnJvd0Rvd246IDQwLFxuICBUYWI6IDlcbn07XG4vKipcclxuICogQHRlbXBsYXRlIHtrZXlvZiBLZXlib2FyZEtleUNvZGVzTWFwfSBUXHJcbiAqIEBwYXJhbSB7VH0ga2V5XHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNLZXlTdXBwb3J0ZWRcclxuICogQHJldHVybnMge1QgfCBudW1iZXIgfCB1bmRlZmluZWR9XHJcbiAqL1xuXG5jb25zdCBnZXRLZXlib2FyZEV2ZW50S2V5ID0gKGtleSwgaXNLZXlTdXBwb3J0ZWQpID0+IHtcbiAgcmV0dXJuIGlzS2V5U3VwcG9ydGVkID8ga2V5IDogS2V5Ym9hcmRLZXlDb2Rlc01hcFtrZXldO1xufTtcbi8qKlxyXG4gKiAtIE1hbmFnZXMga2V5Ym9hcmQgc2hvcnRjdXRzLlxyXG4gKiAtIEhlbHBzIHRyYXAgZm9jdXMgd2l0aGluIHBob3Rvc3dpcGUuXHJcbiAqL1xuXG5cbmNsYXNzIEtleWJvYXJkIHtcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtQaG90b1N3aXBlfSBwc3dwXHJcbiAgICovXG4gIGNvbnN0cnVjdG9yKHBzd3ApIHtcbiAgICB0aGlzLnBzd3AgPSBwc3dwO1xuICAgIC8qKiBAcHJpdmF0ZSAqL1xuXG4gICAgdGhpcy5fd2FzRm9jdXNlZCA9IGZhbHNlO1xuICAgIHBzd3Aub24oJ2JpbmRFdmVudHMnLCAoKSA9PiB7XG4gICAgICBpZiAocHN3cC5vcHRpb25zLnRyYXBGb2N1cykge1xuICAgICAgICAvLyBEaWFsb2cgd2FzIGxpa2VseSBvcGVuZWQgYnkga2V5Ym9hcmQgaWYgaW5pdGlhbCBwb2ludCBpcyBub3QgZGVmaW5lZFxuICAgICAgICBpZiAoIXBzd3Aub3B0aW9ucy5pbml0aWFsUG9pbnRlclBvcykge1xuICAgICAgICAgIC8vIGZvY3VzIGNhdXNlcyBsYXlvdXQsXG4gICAgICAgICAgLy8gd2hpY2ggY2F1c2VzIGxhZyBkdXJpbmcgdGhlIGFuaW1hdGlvbixcbiAgICAgICAgICAvLyB0aGF0J3Mgd2h5IHdlIGRlbGF5IGl0IHVudGlsIHRoZSBvcGVuZXIgdHJhbnNpdGlvbiBlbmRzXG4gICAgICAgICAgdGhpcy5fZm9jdXNSb290KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwc3dwLmV2ZW50cy5hZGQoZG9jdW1lbnQsICdmb2N1c2luJyxcbiAgICAgICAgLyoqIEB0eXBlIEV2ZW50TGlzdGVuZXIgKi9cbiAgICAgICAgdGhpcy5fb25Gb2N1c0luLmJpbmQodGhpcykpO1xuICAgICAgfVxuXG4gICAgICBwc3dwLmV2ZW50cy5hZGQoZG9jdW1lbnQsICdrZXlkb3duJyxcbiAgICAgIC8qKiBAdHlwZSBFdmVudExpc3RlbmVyICovXG4gICAgICB0aGlzLl9vbktleURvd24uYmluZCh0aGlzKSk7XG4gICAgfSk7XG4gICAgY29uc3QgbGFzdEFjdGl2ZUVsZW1lbnQgPVxuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG4gICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICBwc3dwLm9uKCdkZXN0cm95JywgKCkgPT4ge1xuICAgICAgaWYgKHBzd3Aub3B0aW9ucy5yZXR1cm5Gb2N1cyAmJiBsYXN0QWN0aXZlRWxlbWVudCAmJiB0aGlzLl93YXNGb2N1c2VkKSB7XG4gICAgICAgIGxhc3RBY3RpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqIEBwcml2YXRlICovXG5cblxuICBfZm9jdXNSb290KCkge1xuICAgIGlmICghdGhpcy5fd2FzRm9jdXNlZCAmJiB0aGlzLnBzd3AuZWxlbWVudCkge1xuICAgICAgdGhpcy5wc3dwLmVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHRoaXMuX3dhc0ZvY3VzZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEBwYXJhbSB7S2V5Ym9hcmRFdmVudH0gZVxyXG4gICAqL1xuXG5cbiAgX29uS2V5RG93bihlKSB7XG4gICAgY29uc3Qge1xuICAgICAgcHN3cFxuICAgIH0gPSB0aGlzO1xuXG4gICAgaWYgKHBzd3AuZGlzcGF0Y2goJ2tleWRvd24nLCB7XG4gICAgICBvcmlnaW5hbEV2ZW50OiBlXG4gICAgfSkuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChzcGVjaWFsS2V5VXNlZChlKSkge1xuICAgICAgLy8gZG9uJ3QgZG8gYW55dGhpbmcgaWYgc3BlY2lhbCBrZXkgcHJlc3NlZFxuICAgICAgLy8gdG8gcHJldmVudCBmcm9tIG92ZXJyaWRpbmcgZGVmYXVsdCBicm93c2VyIGFjdGlvbnNcbiAgICAgIC8vIGZvciBleGFtcGxlLCBpbiBDaHJvbWUgb24gTWFjIGNtZCthcnJvdy1sZWZ0IHJldHVybnMgdG8gcHJldmlvdXMgcGFnZVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvKiogQHR5cGUge01ldGhvZHM8UGhvdG9Td2lwZT4gfCB1bmRlZmluZWR9ICovXG5cblxuICAgIGxldCBrZXlkb3duQWN0aW9uO1xuICAgIC8qKiBAdHlwZSB7J3gnIHwgJ3knIHwgdW5kZWZpbmVkfSAqL1xuXG4gICAgbGV0IGF4aXM7XG4gICAgbGV0IGlzRm9yd2FyZCA9IGZhbHNlO1xuICAgIGNvbnN0IGlzS2V5U3VwcG9ydGVkID0gKCdrZXknIGluIGUpO1xuXG4gICAgc3dpdGNoIChpc0tleVN1cHBvcnRlZCA/IGUua2V5IDogZS5rZXlDb2RlKSB7XG4gICAgICBjYXNlIGdldEtleWJvYXJkRXZlbnRLZXkoJ0VzY2FwZScsIGlzS2V5U3VwcG9ydGVkKTpcbiAgICAgICAgaWYgKHBzd3Aub3B0aW9ucy5lc2NLZXkpIHtcbiAgICAgICAgICBrZXlkb3duQWN0aW9uID0gJ2Nsb3NlJztcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIGdldEtleWJvYXJkRXZlbnRLZXkoJ3onLCBpc0tleVN1cHBvcnRlZCk6XG4gICAgICAgIGtleWRvd25BY3Rpb24gPSAndG9nZ2xlWm9vbSc7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIGdldEtleWJvYXJkRXZlbnRLZXkoJ0Fycm93TGVmdCcsIGlzS2V5U3VwcG9ydGVkKTpcbiAgICAgICAgYXhpcyA9ICd4JztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgZ2V0S2V5Ym9hcmRFdmVudEtleSgnQXJyb3dVcCcsIGlzS2V5U3VwcG9ydGVkKTpcbiAgICAgICAgYXhpcyA9ICd5JztcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgZ2V0S2V5Ym9hcmRFdmVudEtleSgnQXJyb3dSaWdodCcsIGlzS2V5U3VwcG9ydGVkKTpcbiAgICAgICAgYXhpcyA9ICd4JztcbiAgICAgICAgaXNGb3J3YXJkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgZ2V0S2V5Ym9hcmRFdmVudEtleSgnQXJyb3dEb3duJywgaXNLZXlTdXBwb3J0ZWQpOlxuICAgICAgICBpc0ZvcndhcmQgPSB0cnVlO1xuICAgICAgICBheGlzID0gJ3knO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBnZXRLZXlib2FyZEV2ZW50S2V5KCdUYWInLCBpc0tleVN1cHBvcnRlZCk6XG4gICAgICAgIHRoaXMuX2ZvY3VzUm9vdCgpO1xuXG4gICAgICAgIGJyZWFrO1xuICAgIH0gLy8gaWYgbGVmdC9yaWdodC90b3AvYm90dG9tIGtleVxuXG5cbiAgICBpZiAoYXhpcykge1xuICAgICAgLy8gcHJldmVudCBwYWdlIHNjcm9sbFxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3Qge1xuICAgICAgICBjdXJyU2xpZGVcbiAgICAgIH0gPSBwc3dwO1xuXG4gICAgICBpZiAocHN3cC5vcHRpb25zLmFycm93S2V5cyAmJiBheGlzID09PSAneCcgJiYgcHN3cC5nZXROdW1JdGVtcygpID4gMSkge1xuICAgICAgICBrZXlkb3duQWN0aW9uID0gaXNGb3J3YXJkID8gJ25leHQnIDogJ3ByZXYnO1xuICAgICAgfSBlbHNlIGlmIChjdXJyU2xpZGUgJiYgY3VyclNsaWRlLmN1cnJab29tTGV2ZWwgPiBjdXJyU2xpZGUuem9vbUxldmVscy5maXQpIHtcbiAgICAgICAgLy8gdXAvZG93biBhcnJvdyBrZXlzIHBhbiB0aGUgaW1hZ2UgdmVydGljYWxseVxuICAgICAgICAvLyBsZWZ0L3JpZ2h0IGFycm93IGtleXMgcGFuIGhvcml6b250YWxseS5cbiAgICAgICAgLy8gVW5sZXNzIHRoZXJlIGlzIG9ubHkgb25lIGltYWdlLFxuICAgICAgICAvLyBvciBhcnJvd0tleXMgb3B0aW9uIGlzIGRpc2FibGVkXG4gICAgICAgIGN1cnJTbGlkZS5wYW5bYXhpc10gKz0gaXNGb3J3YXJkID8gLTgwIDogODA7XG4gICAgICAgIGN1cnJTbGlkZS5wYW5UbyhjdXJyU2xpZGUucGFuLngsIGN1cnJTbGlkZS5wYW4ueSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGtleWRvd25BY3Rpb24pIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTsgLy8gQHRzLWlnbm9yZVxuXG4gICAgICBwc3dwW2tleWRvd25BY3Rpb25dKCk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIFRyYXAgZm9jdXMgaW5zaWRlIHBob3Rvc3dpcGVcclxuICAgKlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogQHBhcmFtIHtGb2N1c0V2ZW50fSBlXHJcbiAgICovXG5cblxuICBfb25Gb2N1c0luKGUpIHtcbiAgICBjb25zdCB7XG4gICAgICB0ZW1wbGF0ZVxuICAgIH0gPSB0aGlzLnBzd3A7XG5cbiAgICBpZiAodGVtcGxhdGUgJiYgZG9jdW1lbnQgIT09IGUudGFyZ2V0ICYmIHRlbXBsYXRlICE9PSBlLnRhcmdldCAmJiAhdGVtcGxhdGUuY29udGFpbnMoXG4gICAgLyoqIEB0eXBlIHtOb2RlfSAqL1xuICAgIGUudGFyZ2V0KSkge1xuICAgICAgLy8gZm9jdXMgcm9vdCBlbGVtZW50XG4gICAgICB0ZW1wbGF0ZS5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG59XG5cbmNvbnN0IERFRkFVTFRfRUFTSU5HID0gJ2N1YmljLWJlemllciguNCwwLC4yMiwxKSc7XG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi9hbmltYXRpb25zLmpzJykuU2hhcmVkQW5pbWF0aW9uUHJvcHN9IFNoYXJlZEFuaW1hdGlvblByb3BzICovXG5cbi8qKiBAdHlwZWRlZiB7T2JqZWN0fSBEZWZhdWx0Q3NzQW5pbWF0aW9uUHJvcHNcclxuICpcclxuICogQHByb3Age0hUTUxFbGVtZW50fSB0YXJnZXRcclxuICogQHByb3Age251bWJlcn0gW2R1cmF0aW9uXVxyXG4gKiBAcHJvcCB7c3RyaW5nfSBbZWFzaW5nXVxyXG4gKiBAcHJvcCB7c3RyaW5nfSBbdHJhbnNmb3JtXVxyXG4gKiBAcHJvcCB7c3RyaW5nfSBbb3BhY2l0eV1cclxuICogKi9cblxuLyoqIEB0eXBlZGVmIHtTaGFyZWRBbmltYXRpb25Qcm9wcyAmIERlZmF1bHRDc3NBbmltYXRpb25Qcm9wc30gQ3NzQW5pbWF0aW9uUHJvcHMgKi9cblxuLyoqXHJcbiAqIFJ1bnMgQ1NTIHRyYW5zaXRpb24uXHJcbiAqL1xuXG5jbGFzcyBDU1NBbmltYXRpb24ge1xuICAvKipcclxuICAgKiBvbkNvbXBsZXRlIGNhbiBiZSB1bnByZWRpY3RhYmxlLCBiZSBjYXJlZnVsIGFib3V0IGN1cnJlbnQgc3RhdGVcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Q3NzQW5pbWF0aW9uUHJvcHN9IHByb3BzXHJcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgdmFyIF9wcm9wcyRwcm9wO1xuXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgIGNvbnN0IHtcbiAgICAgIHRhcmdldCxcbiAgICAgIG9uQ29tcGxldGUsXG4gICAgICB0cmFuc2Zvcm0sXG4gICAgICBvbkZpbmlzaCA9ICgpID0+IHt9LFxuICAgICAgZHVyYXRpb24gPSAzMzMsXG4gICAgICBlYXNpbmcgPSBERUZBVUxUX0VBU0lOR1xuICAgIH0gPSBwcm9wcztcbiAgICB0aGlzLm9uRmluaXNoID0gb25GaW5pc2g7IC8vIHN1cHBvcnQgb25seSB0cmFuc2Zvcm0gYW5kIG9wYWNpdHlcblxuICAgIGNvbnN0IHByb3AgPSB0cmFuc2Zvcm0gPyAndHJhbnNmb3JtJyA6ICdvcGFjaXR5JztcbiAgICBjb25zdCBwcm9wVmFsdWUgPSAoX3Byb3BzJHByb3AgPSBwcm9wc1twcm9wXSkgIT09IG51bGwgJiYgX3Byb3BzJHByb3AgIT09IHZvaWQgMCA/IF9wcm9wcyRwcm9wIDogJyc7XG4gICAgLyoqIEBwcml2YXRlICovXG5cbiAgICB0aGlzLl90YXJnZXQgPSB0YXJnZXQ7XG4gICAgLyoqIEBwcml2YXRlICovXG5cbiAgICB0aGlzLl9vbkNvbXBsZXRlID0gb25Db21wbGV0ZTtcbiAgICAvKiogQHByaXZhdGUgKi9cblxuICAgIHRoaXMuX2ZpbmlzaGVkID0gZmFsc2U7XG4gICAgLyoqIEBwcml2YXRlICovXG5cbiAgICB0aGlzLl9vblRyYW5zaXRpb25FbmQgPSB0aGlzLl9vblRyYW5zaXRpb25FbmQuYmluZCh0aGlzKTsgLy8gVXNpbmcgdGltZW91dCBoYWNrIHRvIG1ha2Ugc3VyZSB0aGF0IGFuaW1hdGlvblxuICAgIC8vIHN0YXJ0cyBldmVuIGlmIHRoZSBhbmltYXRlZCBwcm9wZXJ0eSB3YXMgY2hhbmdlZCByZWNlbnRseSxcbiAgICAvLyBvdGhlcndpc2UgdHJhbnNpdGlvbmVuZCBtaWdodCBub3QgZmlyZSBvciB0cmFuc2l0aW9uIHdvbid0IHN0YXJ0LlxuICAgIC8vIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtdHJhbnNpdGlvbnMvI3N0YXJ0aW5nXG4gICAgLy9cbiAgICAvLyDCr1xcXyjjg4QpXy/Cr1xuXG4gICAgLyoqIEBwcml2YXRlICovXG5cbiAgICB0aGlzLl9oZWxwZXJUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBzZXRUcmFuc2l0aW9uU3R5bGUodGFyZ2V0LCBwcm9wLCBkdXJhdGlvbiwgZWFzaW5nKTtcbiAgICAgIHRoaXMuX2hlbHBlclRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCB0aGlzLl9vblRyYW5zaXRpb25FbmQsIGZhbHNlKTtcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25jYW5jZWwnLCB0aGlzLl9vblRyYW5zaXRpb25FbmQsIGZhbHNlKTsgLy8gU2FmYXJpIG9jY2FzaW9uYWxseSBkb2VzIG5vdCBlbWl0IHRyYW5zaXRpb25lbmQgZXZlbnRcbiAgICAgICAgLy8gaWYgZWxlbWVudCBwcm9wZXJ0eSB3YXMgbW9kaWZpZWQgZHVyaW5nIHRoZSB0cmFuc2l0aW9uLFxuICAgICAgICAvLyB3aGljaCBtYXkgYmUgY2F1c2VkIGJ5IHJlc2l6ZSBvciB0aGlyZCBwYXJ0eSBjb21wb25lbnQsXG4gICAgICAgIC8vIHVzaW5nIHRpbWVvdXQgYXMgYSBzYWZldHkgZmFsbGJhY2tcblxuICAgICAgICB0aGlzLl9oZWxwZXJUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fZmluYWxpemVBbmltYXRpb24oKTtcbiAgICAgICAgfSwgZHVyYXRpb24gKyA1MDApO1xuICAgICAgICB0YXJnZXQuc3R5bGVbcHJvcF0gPSBwcm9wVmFsdWU7XG4gICAgICB9LCAzMCk7IC8vIERvIG5vdCByZWR1Y2UgdGhpcyBudW1iZXJcbiAgICB9LCAwKTtcbiAgfVxuICAvKipcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEBwYXJhbSB7VHJhbnNpdGlvbkV2ZW50fSBlXHJcbiAgICovXG5cblxuICBfb25UcmFuc2l0aW9uRW5kKGUpIHtcbiAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMuX3RhcmdldCkge1xuICAgICAgdGhpcy5fZmluYWxpemVBbmltYXRpb24oKTtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cblxuXG4gIF9maW5hbGl6ZUFuaW1hdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuX2ZpbmlzaGVkKSB7XG4gICAgICB0aGlzLl9maW5pc2hlZCA9IHRydWU7XG4gICAgICB0aGlzLm9uRmluaXNoKCk7XG5cbiAgICAgIGlmICh0aGlzLl9vbkNvbXBsZXRlKSB7XG4gICAgICAgIHRoaXMuX29uQ29tcGxldGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gLy8gRGVzdHJveSBpcyBjYWxsZWQgYXV0b21hdGljYWxseSBvbkZpbmlzaFxuXG5cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5faGVscGVyVGltZW91dCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2hlbHBlclRpbWVvdXQpO1xuICAgIH1cblxuICAgIHJlbW92ZVRyYW5zaXRpb25TdHlsZSh0aGlzLl90YXJnZXQpO1xuXG4gICAgdGhpcy5fdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCB0aGlzLl9vblRyYW5zaXRpb25FbmQsIGZhbHNlKTtcblxuICAgIHRoaXMuX3RhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uY2FuY2VsJywgdGhpcy5fb25UcmFuc2l0aW9uRW5kLCBmYWxzZSk7XG5cbiAgICBpZiAoIXRoaXMuX2ZpbmlzaGVkKSB7XG4gICAgICB0aGlzLl9maW5hbGl6ZUFuaW1hdGlvbigpO1xuICAgIH1cbiAgfVxuXG59XG5cbmNvbnN0IERFRkFVTFRfTkFUVVJBTF9GUkVRVUVOQ1kgPSAxMjtcbmNvbnN0IERFRkFVTFRfREFNUElOR19SQVRJTyA9IDAuNzU7XG4vKipcclxuICogU3ByaW5nIGVhc2luZyBoZWxwZXJcclxuICovXG5cbmNsYXNzIFNwcmluZ0Vhc2VyIHtcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluaXRpYWxWZWxvY2l0eSBJbml0aWFsIHZlbG9jaXR5LCBweCBwZXIgbXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge251bWJlcn0gW2RhbXBpbmdSYXRpb11cclxuICAgKiBEZXRlcm1pbmVzIGhvdyBib3VuY3kgYW5pbWF0aW9uIHdpbGwgYmUuXHJcbiAgICogRnJvbSAwIHRvIDEsIDAgLSBhbHdheXMgb3ZlcnNob290LCAxIC0gZG8gbm90IG92ZXJzaG9vdC5cclxuICAgKiBcIm92ZXJzaG9vdFwiIHJlZmVycyB0byBwYXJ0IG9mIGFuaW1hdGlvbiB0aGF0XHJcbiAgICogZ29lcyBiZXlvbmQgdGhlIGZpbmFsIHZhbHVlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IFtuYXR1cmFsRnJlcXVlbmN5XVxyXG4gICAqIERldGVybWluZXMgaG93IGZhc3QgYW5pbWF0aW9uIHdpbGwgc2xvdyBkb3duLlxyXG4gICAqIFRoZSBoaWdoZXIgdmFsdWUgLSB0aGUgc3RpZmZlciB0aGUgdHJhbnNpdGlvbiB3aWxsIGJlLFxyXG4gICAqIGFuZCB0aGUgZmFzdGVyIGl0IHdpbGwgc2xvdyBkb3duLlxyXG4gICAqIFJlY29tbWVuZGVkIHZhbHVlIGZyb20gMTAgdG8gNTBcclxuICAgKi9cbiAgY29uc3RydWN0b3IoaW5pdGlhbFZlbG9jaXR5LCBkYW1waW5nUmF0aW8sIG5hdHVyYWxGcmVxdWVuY3kpIHtcbiAgICB0aGlzLnZlbG9jaXR5ID0gaW5pdGlhbFZlbG9jaXR5ICogMTAwMDsgLy8gY29udmVydCB0byBcInBpeGVscyBwZXIgc2Vjb25kXCJcbiAgICAvLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9EYW1waW5nX3JhdGlvXG5cbiAgICB0aGlzLl9kYW1waW5nUmF0aW8gPSBkYW1waW5nUmF0aW8gfHwgREVGQVVMVF9EQU1QSU5HX1JBVElPOyAvLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9OYXR1cmFsX2ZyZXF1ZW5jeVxuXG4gICAgdGhpcy5fbmF0dXJhbEZyZXF1ZW5jeSA9IG5hdHVyYWxGcmVxdWVuY3kgfHwgREVGQVVMVF9OQVRVUkFMX0ZSRVFVRU5DWTtcbiAgICB0aGlzLl9kYW1wZWRGcmVxdWVuY3kgPSB0aGlzLl9uYXR1cmFsRnJlcXVlbmN5O1xuXG4gICAgaWYgKHRoaXMuX2RhbXBpbmdSYXRpbyA8IDEpIHtcbiAgICAgIHRoaXMuX2RhbXBlZEZyZXF1ZW5jeSAqPSBNYXRoLnNxcnQoMSAtIHRoaXMuX2RhbXBpbmdSYXRpbyAqIHRoaXMuX2RhbXBpbmdSYXRpbyk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkZWx0YVBvc2l0aW9uIERpZmZlcmVuY2UgYmV0d2VlbiBjdXJyZW50IGFuZCBlbmQgcG9zaXRpb24gb2YgdGhlIGFuaW1hdGlvblxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkZWx0YVRpbWUgRnJhbWUgZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBEaXNwbGFjZW1lbnQsIHJlbGF0aXZlIHRvIHRoZSBlbmQgcG9zaXRpb24uXHJcbiAgICovXG5cblxuICBlYXNlRnJhbWUoZGVsdGFQb3NpdGlvbiwgZGVsdGFUaW1lKSB7XG4gICAgLy8gSW5zcGlyZWQgYnkgQXBwbGUgV2Via2l0IGFuZCBBbmRyb2lkIHNwcmluZyBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvblxuICAgIC8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL09zY2lsbGF0aW9uXG4gICAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRGFtcGluZ19yYXRpb1xuICAgIC8vIHdlIGlnbm9yZSBtYXNzIChhc3N1bWUgdGhhdCBpdCdzIDFrZylcbiAgICBsZXQgZGlzcGxhY2VtZW50ID0gMDtcbiAgICBsZXQgY29lZmY7XG4gICAgZGVsdGFUaW1lIC89IDEwMDA7XG4gICAgY29uc3QgbmF0dXJhbER1bXBpbmdQb3cgPSBNYXRoLkUgKiogKC10aGlzLl9kYW1waW5nUmF0aW8gKiB0aGlzLl9uYXR1cmFsRnJlcXVlbmN5ICogZGVsdGFUaW1lKTtcblxuICAgIGlmICh0aGlzLl9kYW1waW5nUmF0aW8gPT09IDEpIHtcbiAgICAgIGNvZWZmID0gdGhpcy52ZWxvY2l0eSArIHRoaXMuX25hdHVyYWxGcmVxdWVuY3kgKiBkZWx0YVBvc2l0aW9uO1xuICAgICAgZGlzcGxhY2VtZW50ID0gKGRlbHRhUG9zaXRpb24gKyBjb2VmZiAqIGRlbHRhVGltZSkgKiBuYXR1cmFsRHVtcGluZ1BvdztcbiAgICAgIHRoaXMudmVsb2NpdHkgPSBkaXNwbGFjZW1lbnQgKiAtdGhpcy5fbmF0dXJhbEZyZXF1ZW5jeSArIGNvZWZmICogbmF0dXJhbER1bXBpbmdQb3c7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9kYW1waW5nUmF0aW8gPCAxKSB7XG4gICAgICBjb2VmZiA9IDEgLyB0aGlzLl9kYW1wZWRGcmVxdWVuY3kgKiAodGhpcy5fZGFtcGluZ1JhdGlvICogdGhpcy5fbmF0dXJhbEZyZXF1ZW5jeSAqIGRlbHRhUG9zaXRpb24gKyB0aGlzLnZlbG9jaXR5KTtcbiAgICAgIGNvbnN0IGR1bXBlZEZDb3MgPSBNYXRoLmNvcyh0aGlzLl9kYW1wZWRGcmVxdWVuY3kgKiBkZWx0YVRpbWUpO1xuICAgICAgY29uc3QgZHVtcGVkRlNpbiA9IE1hdGguc2luKHRoaXMuX2RhbXBlZEZyZXF1ZW5jeSAqIGRlbHRhVGltZSk7XG4gICAgICBkaXNwbGFjZW1lbnQgPSBuYXR1cmFsRHVtcGluZ1BvdyAqIChkZWx0YVBvc2l0aW9uICogZHVtcGVkRkNvcyArIGNvZWZmICogZHVtcGVkRlNpbik7XG4gICAgICB0aGlzLnZlbG9jaXR5ID0gZGlzcGxhY2VtZW50ICogLXRoaXMuX25hdHVyYWxGcmVxdWVuY3kgKiB0aGlzLl9kYW1waW5nUmF0aW8gKyBuYXR1cmFsRHVtcGluZ1BvdyAqICgtdGhpcy5fZGFtcGVkRnJlcXVlbmN5ICogZGVsdGFQb3NpdGlvbiAqIGR1bXBlZEZTaW4gKyB0aGlzLl9kYW1wZWRGcmVxdWVuY3kgKiBjb2VmZiAqIGR1bXBlZEZDb3MpO1xuICAgIH0gLy8gT3ZlcmRhbXBlZCAoPjEpIGRhbXBpbmcgcmF0aW8gaXMgbm90IHN1cHBvcnRlZFxuXG5cbiAgICByZXR1cm4gZGlzcGxhY2VtZW50O1xuICB9XG5cbn1cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4vYW5pbWF0aW9ucy5qcycpLlNoYXJlZEFuaW1hdGlvblByb3BzfSBTaGFyZWRBbmltYXRpb25Qcm9wcyAqL1xuXG4vKipcclxuICogQHR5cGVkZWYge09iamVjdH0gRGVmYXVsdFNwcmluZ0FuaW1hdGlvblByb3BzXHJcbiAqXHJcbiAqIEBwcm9wIHtudW1iZXJ9IHN0YXJ0XHJcbiAqIEBwcm9wIHtudW1iZXJ9IGVuZFxyXG4gKiBAcHJvcCB7bnVtYmVyfSB2ZWxvY2l0eVxyXG4gKiBAcHJvcCB7bnVtYmVyfSBbZGFtcGluZ1JhdGlvXVxyXG4gKiBAcHJvcCB7bnVtYmVyfSBbbmF0dXJhbEZyZXF1ZW5jeV1cclxuICogQHByb3AgeyhlbmQ6IG51bWJlcikgPT4gdm9pZH0gb25VcGRhdGVcclxuICovXG5cbi8qKiBAdHlwZWRlZiB7U2hhcmVkQW5pbWF0aW9uUHJvcHMgJiBEZWZhdWx0U3ByaW5nQW5pbWF0aW9uUHJvcHN9IFNwcmluZ0FuaW1hdGlvblByb3BzICovXG5cbmNsYXNzIFNwcmluZ0FuaW1hdGlvbiB7XG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7U3ByaW5nQW5pbWF0aW9uUHJvcHN9IHByb3BzXHJcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgIHRoaXMuX3JhZiA9IDA7XG4gICAgY29uc3Qge1xuICAgICAgc3RhcnQsXG4gICAgICBlbmQsXG4gICAgICB2ZWxvY2l0eSxcbiAgICAgIG9uVXBkYXRlLFxuICAgICAgb25Db21wbGV0ZSxcbiAgICAgIG9uRmluaXNoID0gKCkgPT4ge30sXG4gICAgICBkYW1waW5nUmF0aW8sXG4gICAgICBuYXR1cmFsRnJlcXVlbmN5XG4gICAgfSA9IHByb3BzO1xuICAgIHRoaXMub25GaW5pc2ggPSBvbkZpbmlzaDtcbiAgICBjb25zdCBlYXNlciA9IG5ldyBTcHJpbmdFYXNlcih2ZWxvY2l0eSwgZGFtcGluZ1JhdGlvLCBuYXR1cmFsRnJlcXVlbmN5KTtcbiAgICBsZXQgcHJldlRpbWUgPSBEYXRlLm5vdygpO1xuICAgIGxldCBkZWx0YVBvc2l0aW9uID0gc3RhcnQgLSBlbmQ7XG5cbiAgICBjb25zdCBhbmltYXRpb25Mb29wID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX3JhZikge1xuICAgICAgICBkZWx0YVBvc2l0aW9uID0gZWFzZXIuZWFzZUZyYW1lKGRlbHRhUG9zaXRpb24sIERhdGUubm93KCkgLSBwcmV2VGltZSk7IC8vIFN0b3AgdGhlIGFuaW1hdGlvbiBpZiB2ZWxvY2l0eSBpcyBsb3cgYW5kIHBvc2l0aW9uIGlzIGNsb3NlIHRvIGVuZFxuXG4gICAgICAgIGlmIChNYXRoLmFicyhkZWx0YVBvc2l0aW9uKSA8IDEgJiYgTWF0aC5hYnMoZWFzZXIudmVsb2NpdHkpIDwgNTApIHtcbiAgICAgICAgICAvLyBGaW5hbGl6ZSB0aGUgYW5pbWF0aW9uXG4gICAgICAgICAgb25VcGRhdGUoZW5kKTtcblxuICAgICAgICAgIGlmIChvbkNvbXBsZXRlKSB7XG4gICAgICAgICAgICBvbkNvbXBsZXRlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5vbkZpbmlzaCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByZXZUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICBvblVwZGF0ZShkZWx0YVBvc2l0aW9uICsgZW5kKTtcbiAgICAgICAgICB0aGlzLl9yYWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uTG9vcCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5fcmFmID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbkxvb3ApO1xuICB9IC8vIERlc3Ryb3kgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkgb25GaW5pc2hcblxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuX3JhZiA+PSAwKSB7XG4gICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLl9yYWYpO1xuICAgIH1cblxuICAgIHRoaXMuX3JhZiA9IDA7XG4gIH1cblxufVxuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi9jc3MtYW5pbWF0aW9uLmpzJykuQ3NzQW5pbWF0aW9uUHJvcHN9IENzc0FuaW1hdGlvblByb3BzICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NwcmluZy1hbmltYXRpb24uanMnKS5TcHJpbmdBbmltYXRpb25Qcm9wc30gU3ByaW5nQW5pbWF0aW9uUHJvcHMgKi9cblxuLyoqIEB0eXBlZGVmIHtPYmplY3R9IFNoYXJlZEFuaW1hdGlvblByb3BzXHJcbiAqIEBwcm9wIHtzdHJpbmd9IFtuYW1lXVxyXG4gKiBAcHJvcCB7Ym9vbGVhbn0gW2lzUGFuXVxyXG4gKiBAcHJvcCB7Ym9vbGVhbn0gW2lzTWFpblNjcm9sbF1cclxuICogQHByb3Age1ZvaWRGdW5jdGlvbn0gW29uQ29tcGxldGVdXHJcbiAqIEBwcm9wIHtWb2lkRnVuY3Rpb259IFtvbkZpbmlzaF1cclxuICovXG5cbi8qKiBAdHlwZWRlZiB7U3ByaW5nQW5pbWF0aW9uIHwgQ1NTQW5pbWF0aW9ufSBBbmltYXRpb24gKi9cblxuLyoqIEB0eXBlZGVmIHtTcHJpbmdBbmltYXRpb25Qcm9wcyB8IENzc0FuaW1hdGlvblByb3BzfSBBbmltYXRpb25Qcm9wcyAqL1xuXG4vKipcclxuICogTWFuYWdlcyBhbmltYXRpb25zXHJcbiAqL1xuXG5jbGFzcyBBbmltYXRpb25zIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgLyoqIEB0eXBlIHtBbmltYXRpb25bXX0gKi9cbiAgICB0aGlzLmFjdGl2ZUFuaW1hdGlvbnMgPSBbXTtcbiAgfVxuICAvKipcclxuICAgKiBAcGFyYW0ge1NwcmluZ0FuaW1hdGlvblByb3BzfSBwcm9wc1xyXG4gICAqL1xuXG5cbiAgc3RhcnRTcHJpbmcocHJvcHMpIHtcbiAgICB0aGlzLl9zdGFydChwcm9wcywgdHJ1ZSk7XG4gIH1cbiAgLyoqXHJcbiAgICogQHBhcmFtIHtDc3NBbmltYXRpb25Qcm9wc30gcHJvcHNcclxuICAgKi9cblxuXG4gIHN0YXJ0VHJhbnNpdGlvbihwcm9wcykge1xuICAgIHRoaXMuX3N0YXJ0KHByb3BzKTtcbiAgfVxuICAvKipcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEBwYXJhbSB7QW5pbWF0aW9uUHJvcHN9IHByb3BzXHJcbiAgICogQHBhcmFtIHtib29sZWFufSBbaXNTcHJpbmddXHJcbiAgICogQHJldHVybnMge0FuaW1hdGlvbn1cclxuICAgKi9cblxuXG4gIF9zdGFydChwcm9wcywgaXNTcHJpbmcpIHtcbiAgICBjb25zdCBhbmltYXRpb24gPSBpc1NwcmluZyA/IG5ldyBTcHJpbmdBbmltYXRpb24oXG4gICAgLyoqIEB0eXBlIFNwcmluZ0FuaW1hdGlvblByb3BzICovXG4gICAgcHJvcHMpIDogbmV3IENTU0FuaW1hdGlvbihcbiAgICAvKiogQHR5cGUgQ3NzQW5pbWF0aW9uUHJvcHMgKi9cbiAgICBwcm9wcyk7XG4gICAgdGhpcy5hY3RpdmVBbmltYXRpb25zLnB1c2goYW5pbWF0aW9uKTtcblxuICAgIGFuaW1hdGlvbi5vbkZpbmlzaCA9ICgpID0+IHRoaXMuc3RvcChhbmltYXRpb24pO1xuXG4gICAgcmV0dXJuIGFuaW1hdGlvbjtcbiAgfVxuICAvKipcclxuICAgKiBAcGFyYW0ge0FuaW1hdGlvbn0gYW5pbWF0aW9uXHJcbiAgICovXG5cblxuICBzdG9wKGFuaW1hdGlvbikge1xuICAgIGFuaW1hdGlvbi5kZXN0cm95KCk7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmFjdGl2ZUFuaW1hdGlvbnMuaW5kZXhPZihhbmltYXRpb24pO1xuXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHRoaXMuYWN0aXZlQW5pbWF0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIHN0b3BBbGwoKSB7XG4gICAgLy8gX3N0b3BBbGxBbmltYXRpb25zXG4gICAgdGhpcy5hY3RpdmVBbmltYXRpb25zLmZvckVhY2goYW5pbWF0aW9uID0+IHtcbiAgICAgIGFuaW1hdGlvbi5kZXN0cm95KCk7XG4gICAgfSk7XG4gICAgdGhpcy5hY3RpdmVBbmltYXRpb25zID0gW107XG4gIH1cbiAgLyoqXHJcbiAgICogU3RvcCBhbGwgcGFuIG9yIHpvb20gdHJhbnNpdGlvbnNcclxuICAgKi9cblxuXG4gIHN0b3BBbGxQYW4oKSB7XG4gICAgdGhpcy5hY3RpdmVBbmltYXRpb25zID0gdGhpcy5hY3RpdmVBbmltYXRpb25zLmZpbHRlcihhbmltYXRpb24gPT4ge1xuICAgICAgaWYgKGFuaW1hdGlvbi5wcm9wcy5pc1Bhbikge1xuICAgICAgICBhbmltYXRpb24uZGVzdHJveSgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgc3RvcE1haW5TY3JvbGwoKSB7XG4gICAgdGhpcy5hY3RpdmVBbmltYXRpb25zID0gdGhpcy5hY3RpdmVBbmltYXRpb25zLmZpbHRlcihhbmltYXRpb24gPT4ge1xuICAgICAgaWYgKGFuaW1hdGlvbi5wcm9wcy5pc01haW5TY3JvbGwpIHtcbiAgICAgICAgYW5pbWF0aW9uLmRlc3Ryb3koKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuICAvKipcclxuICAgKiBSZXR1cm5zIHRydWUgaWYgbWFpbiBzY3JvbGwgdHJhbnNpdGlvbiBpcyBydW5uaW5nXHJcbiAgICovXG4gIC8vIGlzTWFpblNjcm9sbFJ1bm5pbmcoKSB7XG4gIC8vICAgcmV0dXJuIHRoaXMuYWN0aXZlQW5pbWF0aW9ucy5zb21lKChhbmltYXRpb24pID0+IHtcbiAgLy8gICAgIHJldHVybiBhbmltYXRpb24ucHJvcHMuaXNNYWluU2Nyb2xsO1xuICAvLyAgIH0pO1xuICAvLyB9XG5cbiAgLyoqXHJcbiAgICogUmV0dXJucyB0cnVlIGlmIGFueSBwYW4gb3Igem9vbSB0cmFuc2l0aW9uIGlzIHJ1bm5pbmdcclxuICAgKi9cblxuXG4gIGlzUGFuUnVubmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVBbmltYXRpb25zLnNvbWUoYW5pbWF0aW9uID0+IHtcbiAgICAgIHJldHVybiBhbmltYXRpb24ucHJvcHMuaXNQYW47XG4gICAgfSk7XG4gIH1cblxufVxuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi9waG90b3N3aXBlLmpzJykuZGVmYXVsdH0gUGhvdG9Td2lwZSAqL1xuXG4vKipcclxuICogSGFuZGxlcyBzY3JvbGwgd2hlZWwuXHJcbiAqIENhbiBwYW4gYW5kIHpvb20gY3VycmVudCBzbGlkZSBpbWFnZS5cclxuICovXG5jbGFzcyBTY3JvbGxXaGVlbCB7XG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7UGhvdG9Td2lwZX0gcHN3cFxyXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwc3dwKSB7XG4gICAgdGhpcy5wc3dwID0gcHN3cDtcbiAgICBwc3dwLmV2ZW50cy5hZGQocHN3cC5lbGVtZW50LCAnd2hlZWwnLFxuICAgIC8qKiBAdHlwZSBFdmVudExpc3RlbmVyICovXG4gICAgdGhpcy5fb25XaGVlbC5iaW5kKHRoaXMpKTtcbiAgfVxuICAvKipcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEBwYXJhbSB7V2hlZWxFdmVudH0gZVxyXG4gICAqL1xuXG5cbiAgX29uV2hlZWwoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjb25zdCB7XG4gICAgICBjdXJyU2xpZGVcbiAgICB9ID0gdGhpcy5wc3dwO1xuICAgIGxldCB7XG4gICAgICBkZWx0YVgsXG4gICAgICBkZWx0YVlcbiAgICB9ID0gZTtcblxuICAgIGlmICghY3VyclNsaWRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHN3cC5kaXNwYXRjaCgnd2hlZWwnLCB7XG4gICAgICBvcmlnaW5hbEV2ZW50OiBlXG4gICAgfSkuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChlLmN0cmxLZXkgfHwgdGhpcy5wc3dwLm9wdGlvbnMud2hlZWxUb1pvb20pIHtcbiAgICAgIC8vIHpvb21cbiAgICAgIGlmIChjdXJyU2xpZGUuaXNab29tYWJsZSgpKSB7XG4gICAgICAgIGxldCB6b29tRmFjdG9yID0gLWRlbHRhWTtcblxuICAgICAgICBpZiAoZS5kZWx0YU1vZGUgPT09IDFcbiAgICAgICAgLyogRE9NX0RFTFRBX0xJTkUgKi9cbiAgICAgICAgKSB7XG4gICAgICAgICAgem9vbUZhY3RvciAqPSAwLjA1O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHpvb21GYWN0b3IgKj0gZS5kZWx0YU1vZGUgPyAxIDogMC4wMDI7XG4gICAgICAgIH1cblxuICAgICAgICB6b29tRmFjdG9yID0gMiAqKiB6b29tRmFjdG9yO1xuICAgICAgICBjb25zdCBkZXN0Wm9vbUxldmVsID0gY3VyclNsaWRlLmN1cnJab29tTGV2ZWwgKiB6b29tRmFjdG9yO1xuICAgICAgICBjdXJyU2xpZGUuem9vbVRvKGRlc3Rab29tTGV2ZWwsIHtcbiAgICAgICAgICB4OiBlLmNsaWVudFgsXG4gICAgICAgICAgeTogZS5jbGllbnRZXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBwYW5cbiAgICAgIGlmIChjdXJyU2xpZGUuaXNQYW5uYWJsZSgpKSB7XG4gICAgICAgIGlmIChlLmRlbHRhTW9kZSA9PT0gMVxuICAgICAgICAvKiBET01fREVMVEFfTElORSAqL1xuICAgICAgICApIHtcbiAgICAgICAgICAvLyAxOCAtIGF2ZXJhZ2UgbGluZSBoZWlnaHRcbiAgICAgICAgICBkZWx0YVggKj0gMTg7XG4gICAgICAgICAgZGVsdGFZICo9IDE4O1xuICAgICAgICB9XG5cbiAgICAgICAgY3VyclNsaWRlLnBhblRvKGN1cnJTbGlkZS5wYW4ueCAtIGRlbHRhWCwgY3VyclNsaWRlLnBhbi55IC0gZGVsdGFZKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufVxuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4vcGhvdG9zd2lwZS5qcycpLmRlZmF1bHR9IFBob3RvU3dpcGUgKi9cblxuLyoqXHJcbiAqIEB0ZW1wbGF0ZSBUXHJcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3R5cGVzLmpzJykuTWV0aG9kczxUPn0gTWV0aG9kczxUPlxyXG4gKi9cblxuLyoqXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFVJRWxlbWVudE1hcmt1cFByb3BzXHJcbiAqIEBwcm9wIHtib29sZWFufSBbaXNDdXN0b21TVkddXHJcbiAqIEBwcm9wIHtzdHJpbmd9IGlubmVyXHJcbiAqIEBwcm9wIHtzdHJpbmd9IFtvdXRsaW5lSURdXHJcbiAqIEBwcm9wIHtudW1iZXIgfCBzdHJpbmd9IFtzaXplXVxyXG4gKi9cblxuLyoqXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFVJRWxlbWVudERhdGFcclxuICogQHByb3Age0RlZmF1bHRVSUVsZW1lbnRzIHwgc3RyaW5nfSBbbmFtZV1cclxuICogQHByb3Age3N0cmluZ30gW2NsYXNzTmFtZV1cclxuICogQHByb3Age1VJRWxlbWVudE1hcmt1cH0gW2h0bWxdXHJcbiAqIEBwcm9wIHtib29sZWFufSBbaXNCdXR0b25dXHJcbiAqIEBwcm9wIHtrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXB9IFt0YWdOYW1lXVxyXG4gKiBAcHJvcCB7c3RyaW5nfSBbdGl0bGVdXHJcbiAqIEBwcm9wIHtzdHJpbmd9IFthcmlhTGFiZWxdXHJcbiAqIEBwcm9wIHsoZWxlbWVudDogSFRNTEVsZW1lbnQsIHBzd3A6IFBob3RvU3dpcGUpID0+IHZvaWR9IFtvbkluaXRdXHJcbiAqIEBwcm9wIHtNZXRob2RzPFBob3RvU3dpcGU+IHwgKChlOiBNb3VzZUV2ZW50LCBlbGVtZW50OiBIVE1MRWxlbWVudCwgcHN3cDogUGhvdG9Td2lwZSkgPT4gdm9pZCl9IFtvbkNsaWNrXVxyXG4gKiBAcHJvcCB7J2JhcicgfCAnd3JhcHBlcicgfCAncm9vdCd9IFthcHBlbmRUb11cclxuICogQHByb3Age251bWJlcn0gW29yZGVyXVxyXG4gKi9cblxuLyoqIEB0eXBlZGVmIHsnYXJyb3dQcmV2JyB8ICdhcnJvd05leHQnIHwgJ2Nsb3NlJyB8ICd6b29tJyB8ICdjb3VudGVyJ30gRGVmYXVsdFVJRWxlbWVudHMgKi9cblxuLyoqIEB0eXBlZGVmIHtzdHJpbmcgfCBVSUVsZW1lbnRNYXJrdXBQcm9wc30gVUlFbGVtZW50TWFya3VwICovXG5cbi8qKlxyXG4gKiBAcGFyYW0ge1VJRWxlbWVudE1hcmt1cH0gW2h0bWxEYXRhXVxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKi9cblxuZnVuY3Rpb24gYWRkRWxlbWVudEhUTUwoaHRtbERhdGEpIHtcbiAgaWYgKHR5cGVvZiBodG1sRGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBBbGxvdyBkZXZlbG9wZXJzIHRvIHByb3ZpZGUgZnVsbCBzdmcsXG4gICAgLy8gRm9yIGV4YW1wbGU6XG4gICAgLy8gPHN2ZyB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgY2xhc3M9XCJwc3dwX19pY25cIj5cbiAgICAvLyAgIDxwYXRoIGQ9XCIuLi5cIiAvPlxuICAgIC8vICAgPGNpcmNsZSAuLi4gLz5cbiAgICAvLyA8L3N2Zz5cbiAgICAvLyBDYW4gYWxzbyBiZSBhbnkgSFRNTCBzdHJpbmcuXG4gICAgcmV0dXJuIGh0bWxEYXRhO1xuICB9XG5cbiAgaWYgKCFodG1sRGF0YSB8fCAhaHRtbERhdGEuaXNDdXN0b21TVkcpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBjb25zdCBzdmdEYXRhID0gaHRtbERhdGE7XG4gIGxldCBvdXQgPSAnPHN2ZyBhcmlhLWhpZGRlbj1cInRydWVcIiBjbGFzcz1cInBzd3BfX2ljblwiIHZpZXdCb3g9XCIwIDAgJWQgJWRcIiB3aWR0aD1cIiVkXCIgaGVpZ2h0PVwiJWRcIj4nOyAvLyByZXBsYWNlIGFsbCAlZCB3aXRoIHNpemVcblxuICBvdXQgPSBvdXQuc3BsaXQoJyVkJykuam9pbihcbiAgLyoqIEB0eXBlIHtzdHJpbmd9ICovXG4gIHN2Z0RhdGEuc2l6ZSB8fCAzMik7IC8vIEljb25zIG1heSBjb250YWluIG91dGxpbmUvc2hhZG93LFxuICAvLyB0byBtYWtlIGl0IHdlIFwiY2xvbmVcIiBiYXNlIGljb24gc2hhcGUgYW5kIGFkZCBib3JkZXIgdG8gaXQuXG4gIC8vIEljb24gaXRzZWxmIGFuZCBib3JkZXIgYXJlIHN0eWxlZCB2aWEgQ1NTLlxuICAvL1xuICAvLyBQcm9wZXJ0eSBzaGFkb3dJRCBkZWZpbmVzIElEIG9mIGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgY2xvbmVkLlxuXG4gIGlmIChzdmdEYXRhLm91dGxpbmVJRCkge1xuICAgIG91dCArPSAnPHVzZSBjbGFzcz1cInBzd3BfX2ljbi1zaGFkb3dcIiB4bGluazpocmVmPVwiIycgKyBzdmdEYXRhLm91dGxpbmVJRCArICdcIi8+JztcbiAgfVxuXG4gIG91dCArPSBzdmdEYXRhLmlubmVyO1xuICBvdXQgKz0gJzwvc3ZnPic7XG4gIHJldHVybiBvdXQ7XG59XG5cbmNsYXNzIFVJRWxlbWVudCB7XG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7UGhvdG9Td2lwZX0gcHN3cFxyXG4gICAqIEBwYXJhbSB7VUlFbGVtZW50RGF0YX0gZGF0YVxyXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwc3dwLCBkYXRhKSB7XG4gICAgdmFyIF9jb250YWluZXI7XG5cbiAgICBjb25zdCBuYW1lID0gZGF0YS5uYW1lIHx8IGRhdGEuY2xhc3NOYW1lO1xuICAgIGxldCBlbGVtZW50SFRNTCA9IGRhdGEuaHRtbDsgLy8gQHRzLWV4cGVjdC1lcnJvciBsb29rdXAgb25seSBieSBgZGF0YS5uYW1lYCBtYXliZT9cblxuICAgIGlmIChwc3dwLm9wdGlvbnNbbmFtZV0gPT09IGZhbHNlKSB7XG4gICAgICAvLyBleGl0IGlmIGVsZW1lbnQgaXMgZGlzYWJsZWQgZnJvbSBvcHRpb25zXG4gICAgICByZXR1cm47XG4gICAgfSAvLyBBbGxvdyB0byBvdmVycmlkZSBTVkcgaWNvbnMgZnJvbSBvcHRpb25zXG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvciBsb29rdXAgb25seSBieSBgZGF0YS5uYW1lYCBtYXliZT9cblxuXG4gICAgaWYgKHR5cGVvZiBwc3dwLm9wdGlvbnNbbmFtZSArICdTVkcnXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIGFycm93UHJldlNWR1xuICAgICAgLy8gYXJyb3dOZXh0U1ZHXG4gICAgICAvLyBjbG9zZVNWR1xuICAgICAgLy8gem9vbVNWR1xuICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBsb29rdXAgb25seSBieSBgZGF0YS5uYW1lYCBtYXliZT9cbiAgICAgIGVsZW1lbnRIVE1MID0gcHN3cC5vcHRpb25zW25hbWUgKyAnU1ZHJ107XG4gICAgfVxuXG4gICAgcHN3cC5kaXNwYXRjaCgndWlFbGVtZW50Q3JlYXRlJywge1xuICAgICAgZGF0YVxuICAgIH0pO1xuICAgIGxldCBjbGFzc05hbWUgPSAnJztcblxuICAgIGlmIChkYXRhLmlzQnV0dG9uKSB7XG4gICAgICBjbGFzc05hbWUgKz0gJ3Bzd3BfX2J1dHRvbiAnO1xuICAgICAgY2xhc3NOYW1lICs9IGRhdGEuY2xhc3NOYW1lIHx8IGBwc3dwX19idXR0b24tLSR7ZGF0YS5uYW1lfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsYXNzTmFtZSArPSBkYXRhLmNsYXNzTmFtZSB8fCBgcHN3cF9fJHtkYXRhLm5hbWV9YDtcbiAgICB9XG5cbiAgICBsZXQgdGFnTmFtZSA9IGRhdGEuaXNCdXR0b24gPyBkYXRhLnRhZ05hbWUgfHwgJ2J1dHRvbicgOiBkYXRhLnRhZ05hbWUgfHwgJ2Rpdic7XG4gICAgdGFnTmFtZSA9XG4gICAgLyoqIEB0eXBlIHtrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXB9ICovXG4gICAgdGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG5cbiAgICBjb25zdCBlbGVtZW50ID0gY3JlYXRlRWxlbWVudChjbGFzc05hbWUsIHRhZ05hbWUpO1xuXG4gICAgaWYgKGRhdGEuaXNCdXR0b24pIHtcbiAgICAgIGlmICh0YWdOYW1lID09PSAnYnV0dG9uJykge1xuICAgICAgICAvKiogQHR5cGUge0hUTUxCdXR0b25FbGVtZW50fSAqL1xuICAgICAgICBlbGVtZW50LnR5cGUgPSAnYnV0dG9uJztcbiAgICAgIH1cblxuICAgICAgbGV0IHtcbiAgICAgICAgdGl0bGVcbiAgICAgIH0gPSBkYXRhO1xuICAgICAgY29uc3Qge1xuICAgICAgICBhcmlhTGFiZWxcbiAgICAgIH0gPSBkYXRhOyAvLyBAdHMtZXhwZWN0LWVycm9yIGxvb2t1cCBvbmx5IGJ5IGBkYXRhLm5hbWVgIG1heWJlP1xuXG4gICAgICBpZiAodHlwZW9mIHBzd3Aub3B0aW9uc1tuYW1lICsgJ1RpdGxlJ10gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgbG9va3VwIG9ubHkgYnkgYGRhdGEubmFtZWAgbWF5YmU/XG4gICAgICAgIHRpdGxlID0gcHN3cC5vcHRpb25zW25hbWUgKyAnVGl0bGUnXTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRpdGxlKSB7XG4gICAgICAgIGVsZW1lbnQudGl0bGUgPSB0aXRsZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYXJpYVRleHQgPSBhcmlhTGFiZWwgfHwgdGl0bGU7XG5cbiAgICAgIGlmIChhcmlhVGV4dCkge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGFyaWFUZXh0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbGVtZW50LmlubmVySFRNTCA9IGFkZEVsZW1lbnRIVE1MKGVsZW1lbnRIVE1MKTtcblxuICAgIGlmIChkYXRhLm9uSW5pdCkge1xuICAgICAgZGF0YS5vbkluaXQoZWxlbWVudCwgcHN3cCk7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEub25DbGljaykge1xuICAgICAgZWxlbWVudC5vbmNsaWNrID0gZSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YS5vbkNsaWNrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBwc3dwW2RhdGEub25DbGlja10oKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZGF0YS5vbkNsaWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgZGF0YS5vbkNsaWNrKGUsIGVsZW1lbnQsIHBzd3ApO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gLy8gVG9wIGJhciBpcyBkZWZhdWx0IHBvc2l0aW9uXG5cblxuICAgIGNvbnN0IGFwcGVuZFRvID0gZGF0YS5hcHBlbmRUbyB8fCAnYmFyJztcbiAgICAvKiogQHR5cGUge0hUTUxFbGVtZW50IHwgdW5kZWZpbmVkfSByb290IGVsZW1lbnQgYnkgZGVmYXVsdCAqL1xuXG4gICAgbGV0IGNvbnRhaW5lciA9IHBzd3AuZWxlbWVudDtcblxuICAgIGlmIChhcHBlbmRUbyA9PT0gJ2JhcicpIHtcbiAgICAgIGlmICghcHN3cC50b3BCYXIpIHtcbiAgICAgICAgcHN3cC50b3BCYXIgPSBjcmVhdGVFbGVtZW50KCdwc3dwX190b3AtYmFyIHBzd3BfX2hpZGUtb24tY2xvc2UnLCAnZGl2JywgcHN3cC5zY3JvbGxXcmFwKTtcbiAgICAgIH1cblxuICAgICAgY29udGFpbmVyID0gcHN3cC50b3BCYXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGVsZW1lbnQgb3V0c2lkZSBvZiB0b3AgYmFyIGdldHMgYSBzZWNvbmRhcnkgY2xhc3NcbiAgICAgIC8vIHRoYXQgbWFrZXMgZWxlbWVudCBmYWRlIG91dCBvbiBjbG9zZVxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdwc3dwX19oaWRlLW9uLWNsb3NlJyk7XG5cbiAgICAgIGlmIChhcHBlbmRUbyA9PT0gJ3dyYXBwZXInKSB7XG4gICAgICAgIGNvbnRhaW5lciA9IHBzd3Auc2Nyb2xsV3JhcDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAoX2NvbnRhaW5lciA9IGNvbnRhaW5lcikgPT09IG51bGwgfHwgX2NvbnRhaW5lciA9PT0gdm9pZCAwIHx8IF9jb250YWluZXIuYXBwZW5kQ2hpbGQocHN3cC5hcHBseUZpbHRlcnMoJ3VpRWxlbWVudCcsIGVsZW1lbnQsIGRhdGEpKTtcbiAgfVxuXG59XG5cbi8qXHJcbiAgQmFja3dhcmQgYW5kIGZvcndhcmQgYXJyb3cgYnV0dG9uc1xyXG4gKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4vdWktZWxlbWVudC5qcycpLlVJRWxlbWVudERhdGF9IFVJRWxlbWVudERhdGEgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3Bob3Rvc3dpcGUuanMnKS5kZWZhdWx0fSBQaG90b1N3aXBlICovXG5cbi8qKlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAqIEBwYXJhbSB7UGhvdG9Td2lwZX0gcHN3cFxyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc05leHRCdXR0b25dXHJcbiAqL1xuZnVuY3Rpb24gaW5pdEFycm93QnV0dG9uKGVsZW1lbnQsIHBzd3AsIGlzTmV4dEJ1dHRvbikge1xuICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Bzd3BfX2J1dHRvbi0tYXJyb3cnKTsgLy8gVE9ETzogdGhpcyBzaG91bGQgcG9pbnQgdG8gYSB1bmlxdWUgaWQgZm9yIHRoaXMgaW5zdGFuY2VcblxuICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycsICdwc3dwX19pdGVtcycpO1xuICBwc3dwLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgaWYgKCFwc3dwLm9wdGlvbnMubG9vcCkge1xuICAgICAgaWYgKGlzTmV4dEJ1dHRvbikge1xuICAgICAgICAvKiogQHR5cGUge0hUTUxCdXR0b25FbGVtZW50fSAqL1xuICAgICAgICBlbGVtZW50LmRpc2FibGVkID0gIShwc3dwLmN1cnJJbmRleCA8IHBzd3AuZ2V0TnVtSXRlbXMoKSAtIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLyoqIEB0eXBlIHtIVE1MQnV0dG9uRWxlbWVudH0gKi9cbiAgICAgICAgZWxlbWVudC5kaXNhYmxlZCA9ICEocHN3cC5jdXJySW5kZXggPiAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuLyoqIEB0eXBlIHtVSUVsZW1lbnREYXRhfSAqL1xuXG5cbmNvbnN0IGFycm93UHJldiA9IHtcbiAgbmFtZTogJ2Fycm93UHJldicsXG4gIGNsYXNzTmFtZTogJ3Bzd3BfX2J1dHRvbi0tYXJyb3ctLXByZXYnLFxuICB0aXRsZTogJ1ByZXZpb3VzJyxcbiAgb3JkZXI6IDEwLFxuICBpc0J1dHRvbjogdHJ1ZSxcbiAgYXBwZW5kVG86ICd3cmFwcGVyJyxcbiAgaHRtbDoge1xuICAgIGlzQ3VzdG9tU1ZHOiB0cnVlLFxuICAgIHNpemU6IDYwLFxuICAgIGlubmVyOiAnPHBhdGggZD1cIk0yOSA0M2wtMyAzLTE2LTE2IDE2LTE2IDMgMy0xMyAxMyAxMyAxM3pcIiBpZD1cInBzd3BfX2ljbi1hcnJvd1wiLz4nLFxuICAgIG91dGxpbmVJRDogJ3Bzd3BfX2ljbi1hcnJvdydcbiAgfSxcbiAgb25DbGljazogJ3ByZXYnLFxuICBvbkluaXQ6IGluaXRBcnJvd0J1dHRvblxufTtcbi8qKiBAdHlwZSB7VUlFbGVtZW50RGF0YX0gKi9cblxuY29uc3QgYXJyb3dOZXh0ID0ge1xuICBuYW1lOiAnYXJyb3dOZXh0JyxcbiAgY2xhc3NOYW1lOiAncHN3cF9fYnV0dG9uLS1hcnJvdy0tbmV4dCcsXG4gIHRpdGxlOiAnTmV4dCcsXG4gIG9yZGVyOiAxMSxcbiAgaXNCdXR0b246IHRydWUsXG4gIGFwcGVuZFRvOiAnd3JhcHBlcicsXG4gIGh0bWw6IHtcbiAgICBpc0N1c3RvbVNWRzogdHJ1ZSxcbiAgICBzaXplOiA2MCxcbiAgICBpbm5lcjogJzx1c2UgeGxpbms6aHJlZj1cIiNwc3dwX19pY24tYXJyb3dcIi8+JyxcbiAgICBvdXRsaW5lSUQ6ICdwc3dwX19pY24tYXJyb3cnXG4gIH0sXG4gIG9uQ2xpY2s6ICduZXh0JyxcbiAgb25Jbml0OiAoZWwsIHBzd3ApID0+IHtcbiAgICBpbml0QXJyb3dCdXR0b24oZWwsIHBzd3AsIHRydWUpO1xuICB9XG59O1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi91aS1lbGVtZW50LmpzJykuVUlFbGVtZW50RGF0YX0gVUlFbGVtZW50RGF0YSAqL1xuY29uc3QgY2xvc2VCdXR0b24gPSB7XG4gIG5hbWU6ICdjbG9zZScsXG4gIHRpdGxlOiAnQ2xvc2UnLFxuICBvcmRlcjogMjAsXG4gIGlzQnV0dG9uOiB0cnVlLFxuICBodG1sOiB7XG4gICAgaXNDdXN0b21TVkc6IHRydWUsXG4gICAgaW5uZXI6ICc8cGF0aCBkPVwiTTI0IDEwbC0yLTItNiA2LTYtNi0yIDIgNiA2LTYgNiAyIDIgNi02IDYgNiAyLTItNi02elwiIGlkPVwicHN3cF9faWNuLWNsb3NlXCIvPicsXG4gICAgb3V0bGluZUlEOiAncHN3cF9faWNuLWNsb3NlJ1xuICB9LFxuICBvbkNsaWNrOiAnY2xvc2UnXG59O1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi91aS1lbGVtZW50LmpzJykuVUlFbGVtZW50RGF0YX0gVUlFbGVtZW50RGF0YSAqL1xuY29uc3Qgem9vbUJ1dHRvbiA9IHtcbiAgbmFtZTogJ3pvb20nLFxuICB0aXRsZTogJ1pvb20nLFxuICBvcmRlcjogMTAsXG4gIGlzQnV0dG9uOiB0cnVlLFxuICBodG1sOiB7XG4gICAgaXNDdXN0b21TVkc6IHRydWUsXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICBpbm5lcjogJzxwYXRoIGQ9XCJNMTcuNDI2IDE5LjkyNmE2IDYgMCAxIDEgMS41LTEuNUwyMyAyMi41IDIxLjUgMjRsLTQuMDc0LTQuMDc0elwiIGlkPVwicHN3cF9faWNuLXpvb21cIi8+JyArICc8cGF0aCBmaWxsPVwiY3VycmVudENvbG9yXCIgY2xhc3M9XCJwc3dwX196b29tLWljbi1iYXItaFwiIGQ9XCJNMTEgMTZ2LTJoNnYyelwiLz4nICsgJzxwYXRoIGZpbGw9XCJjdXJyZW50Q29sb3JcIiBjbGFzcz1cInBzd3BfX3pvb20taWNuLWJhci12XCIgZD1cIk0xMyAxMmgydjZoLTJ6XCIvPicsXG4gICAgb3V0bGluZUlEOiAncHN3cF9faWNuLXpvb20nXG4gIH0sXG4gIG9uQ2xpY2s6ICd0b2dnbGVab29tJ1xufTtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vdWktZWxlbWVudC5qcycpLlVJRWxlbWVudERhdGF9IFVJRWxlbWVudERhdGEgKi9cbmNvbnN0IGxvYWRpbmdJbmRpY2F0b3IgPSB7XG4gIG5hbWU6ICdwcmVsb2FkZXInLFxuICBhcHBlbmRUbzogJ2JhcicsXG4gIG9yZGVyOiA3LFxuICBodG1sOiB7XG4gICAgaXNDdXN0b21TVkc6IHRydWUsXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICBpbm5lcjogJzxwYXRoIGZpbGwtcnVsZT1cImV2ZW5vZGRcIiBjbGlwLXJ1bGU9XCJldmVub2RkXCIgZD1cIk0yMS4yIDE2YTUuMiA1LjIgMCAxIDEtNS4yLTUuMlY4YTggOCAwIDEgMCA4IDhoLTIuOFpcIiBpZD1cInBzd3BfX2ljbi1sb2FkaW5nXCIvPicsXG4gICAgb3V0bGluZUlEOiAncHN3cF9faWNuLWxvYWRpbmcnXG4gIH0sXG4gIG9uSW5pdDogKGluZGljYXRvckVsZW1lbnQsIHBzd3ApID0+IHtcbiAgICAvKiogQHR5cGUge2Jvb2xlYW4gfCB1bmRlZmluZWR9ICovXG4gICAgbGV0IGlzVmlzaWJsZTtcbiAgICAvKiogQHR5cGUge05vZGVKUy5UaW1lb3V0IHwgbnVsbH0gKi9cblxuICAgIGxldCBkZWxheVRpbWVvdXQgPSBudWxsO1xuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBhZGRcclxuICAgICAqL1xuXG4gICAgY29uc3QgdG9nZ2xlSW5kaWNhdG9yQ2xhc3MgPSAoY2xhc3NOYW1lLCBhZGQpID0+IHtcbiAgICAgIGluZGljYXRvckVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgncHN3cF9fcHJlbG9hZGVyLS0nICsgY2xhc3NOYW1lLCBhZGQpO1xuICAgIH07XG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZpc2libGVcclxuICAgICAqL1xuXG5cbiAgICBjb25zdCBzZXRJbmRpY2F0b3JWaXNpYmlsaXR5ID0gdmlzaWJsZSA9PiB7XG4gICAgICBpZiAoaXNWaXNpYmxlICE9PSB2aXNpYmxlKSB7XG4gICAgICAgIGlzVmlzaWJsZSA9IHZpc2libGU7XG4gICAgICAgIHRvZ2dsZUluZGljYXRvckNsYXNzKCdhY3RpdmUnLCB2aXNpYmxlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgdXBkYXRlUHJlbG9hZGVyVmlzaWJpbGl0eSA9ICgpID0+IHtcbiAgICAgIHZhciBfcHN3cCRjdXJyU2xpZGU7XG5cbiAgICAgIGlmICghKChfcHN3cCRjdXJyU2xpZGUgPSBwc3dwLmN1cnJTbGlkZSkgIT09IG51bGwgJiYgX3Bzd3AkY3VyclNsaWRlICE9PSB2b2lkIDAgJiYgX3Bzd3AkY3VyclNsaWRlLmNvbnRlbnQuaXNMb2FkaW5nKCkpKSB7XG4gICAgICAgIHNldEluZGljYXRvclZpc2liaWxpdHkoZmFsc2UpO1xuXG4gICAgICAgIGlmIChkZWxheVRpbWVvdXQpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQoZGVsYXlUaW1lb3V0KTtcbiAgICAgICAgICBkZWxheVRpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWRlbGF5VGltZW91dCkge1xuICAgICAgICAvLyBkaXNwbGF5IGxvYWRpbmcgaW5kaWNhdG9yIHdpdGggZGVsYXlcbiAgICAgICAgZGVsYXlUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdmFyIF9wc3dwJGN1cnJTbGlkZTI7XG5cbiAgICAgICAgICBzZXRJbmRpY2F0b3JWaXNpYmlsaXR5KEJvb2xlYW4oKF9wc3dwJGN1cnJTbGlkZTIgPSBwc3dwLmN1cnJTbGlkZSkgPT09IG51bGwgfHwgX3Bzd3AkY3VyclNsaWRlMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3Bzd3AkY3VyclNsaWRlMi5jb250ZW50LmlzTG9hZGluZygpKSk7XG4gICAgICAgICAgZGVsYXlUaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfSwgcHN3cC5vcHRpb25zLnByZWxvYWRlckRlbGF5KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcHN3cC5vbignY2hhbmdlJywgdXBkYXRlUHJlbG9hZGVyVmlzaWJpbGl0eSk7XG4gICAgcHN3cC5vbignbG9hZENvbXBsZXRlJywgZSA9PiB7XG4gICAgICBpZiAocHN3cC5jdXJyU2xpZGUgPT09IGUuc2xpZGUpIHtcbiAgICAgICAgdXBkYXRlUHJlbG9hZGVyVmlzaWJpbGl0eSgpO1xuICAgICAgfVxuICAgIH0pOyAvLyBleHBvc2UgdGhlIG1ldGhvZFxuXG4gICAgaWYgKHBzd3AudWkpIHtcbiAgICAgIHBzd3AudWkudXBkYXRlUHJlbG9hZGVyVmlzaWJpbGl0eSA9IHVwZGF0ZVByZWxvYWRlclZpc2liaWxpdHk7XG4gICAgfVxuICB9XG59O1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi91aS1lbGVtZW50LmpzJykuVUlFbGVtZW50RGF0YX0gVUlFbGVtZW50RGF0YSAqL1xuY29uc3QgY291bnRlckluZGljYXRvciA9IHtcbiAgbmFtZTogJ2NvdW50ZXInLFxuICBvcmRlcjogNSxcbiAgb25Jbml0OiAoY291bnRlckVsZW1lbnQsIHBzd3ApID0+IHtcbiAgICBwc3dwLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBjb3VudGVyRWxlbWVudC5pbm5lclRleHQgPSBwc3dwLmN1cnJJbmRleCArIDEgKyBwc3dwLm9wdGlvbnMuaW5kZXhJbmRpY2F0b3JTZXAgKyBwc3dwLmdldE51bUl0ZW1zKCk7XG4gICAgfSk7XG4gIH1cbn07XG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi9waG90b3N3aXBlLmpzJykuZGVmYXVsdH0gUGhvdG9Td2lwZSAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi91aS1lbGVtZW50LmpzJykuVUlFbGVtZW50RGF0YX0gVUlFbGVtZW50RGF0YSAqL1xuXG4vKipcclxuICogU2V0IHNwZWNpYWwgY2xhc3Mgb24gZWxlbWVudCB3aGVuIGltYWdlIGlzIHpvb21lZC5cclxuICpcclxuICogQnkgZGVmYXVsdCwgaXQgaXMgdXNlZCB0byBhZGp1c3RcclxuICogem9vbSBpY29uIGFuZCB6b29tIGN1cnNvciB2aWEgQ1NTLlxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGlzWm9vbWVkSW5cclxuICovXG5cbmZ1bmN0aW9uIHNldFpvb21lZEluKGVsLCBpc1pvb21lZEluKSB7XG4gIGVsLmNsYXNzTGlzdC50b2dnbGUoJ3Bzd3AtLXpvb21lZC1pbicsIGlzWm9vbWVkSW4pO1xufVxuXG5jbGFzcyBVSSB7XG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7UGhvdG9Td2lwZX0gcHN3cFxyXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwc3dwKSB7XG4gICAgdGhpcy5wc3dwID0gcHN3cDtcbiAgICB0aGlzLmlzUmVnaXN0ZXJlZCA9IGZhbHNlO1xuICAgIC8qKiBAdHlwZSB7VUlFbGVtZW50RGF0YVtdfSAqL1xuXG4gICAgdGhpcy51aUVsZW1lbnRzRGF0YSA9IFtdO1xuICAgIC8qKiBAdHlwZSB7KFVJRWxlbWVudCB8IFVJRWxlbWVudERhdGEpW119ICovXG5cbiAgICB0aGlzLml0ZW1zID0gW107XG4gICAgLyoqIEB0eXBlIHsoKSA9PiB2b2lkfSAqL1xuXG4gICAgdGhpcy51cGRhdGVQcmVsb2FkZXJWaXNpYmlsaXR5ID0gKCkgPT4ge307XG4gICAgLyoqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHR5cGUge251bWJlciB8IHVuZGVmaW5lZH1cclxuICAgICAqL1xuXG5cbiAgICB0aGlzLl9sYXN0VXBkYXRlZFpvb21MZXZlbCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgY29uc3Qge1xuICAgICAgcHN3cFxuICAgIH0gPSB0aGlzO1xuICAgIHRoaXMuaXNSZWdpc3RlcmVkID0gZmFsc2U7XG4gICAgdGhpcy51aUVsZW1lbnRzRGF0YSA9IFtjbG9zZUJ1dHRvbiwgYXJyb3dQcmV2LCBhcnJvd05leHQsIHpvb21CdXR0b24sIGxvYWRpbmdJbmRpY2F0b3IsIGNvdW50ZXJJbmRpY2F0b3JdO1xuICAgIHBzd3AuZGlzcGF0Y2goJ3VpUmVnaXN0ZXInKTsgLy8gc29ydCBieSBvcmRlclxuXG4gICAgdGhpcy51aUVsZW1lbnRzRGF0YS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAvLyBkZWZhdWx0IG9yZGVyIGlzIDBcbiAgICAgIHJldHVybiAoYS5vcmRlciB8fCAwKSAtIChiLm9yZGVyIHx8IDApO1xuICAgIH0pO1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICB0aGlzLmlzUmVnaXN0ZXJlZCA9IHRydWU7XG4gICAgdGhpcy51aUVsZW1lbnRzRGF0YS5mb3JFYWNoKHVpRWxlbWVudERhdGEgPT4ge1xuICAgICAgdGhpcy5yZWdpc3RlckVsZW1lbnQodWlFbGVtZW50RGF0YSk7XG4gICAgfSk7XG4gICAgcHN3cC5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgdmFyIF9wc3dwJGVsZW1lbnQ7XG5cbiAgICAgIChfcHN3cCRlbGVtZW50ID0gcHN3cC5lbGVtZW50KSA9PT0gbnVsbCB8fCBfcHN3cCRlbGVtZW50ID09PSB2b2lkIDAgfHwgX3Bzd3AkZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdwc3dwLS1vbmUtc2xpZGUnLCBwc3dwLmdldE51bUl0ZW1zKCkgPT09IDEpO1xuICAgIH0pO1xuICAgIHBzd3Aub24oJ3pvb21QYW5VcGRhdGUnLCAoKSA9PiB0aGlzLl9vblpvb21QYW5VcGRhdGUoKSk7XG4gIH1cbiAgLyoqXHJcbiAgICogQHBhcmFtIHtVSUVsZW1lbnREYXRhfSBlbGVtZW50RGF0YVxyXG4gICAqL1xuXG5cbiAgcmVnaXN0ZXJFbGVtZW50KGVsZW1lbnREYXRhKSB7XG4gICAgaWYgKHRoaXMuaXNSZWdpc3RlcmVkKSB7XG4gICAgICB0aGlzLml0ZW1zLnB1c2gobmV3IFVJRWxlbWVudCh0aGlzLnBzd3AsIGVsZW1lbnREYXRhKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudWlFbGVtZW50c0RhdGEucHVzaChlbGVtZW50RGF0YSk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIEZpcmVkIGVhY2ggdGltZSB6b29tIG9yIHBhbiBwb3NpdGlvbiBpcyBjaGFuZ2VkLlxyXG4gICAqIFVwZGF0ZSBjbGFzc2VzIHRoYXQgY29udHJvbCB2aXNpYmlsaXR5IG9mIHpvb20gYnV0dG9uIGFuZCBjdXJzb3IgaWNvbi5cclxuICAgKlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXG5cblxuICBfb25ab29tUGFuVXBkYXRlKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHRlbXBsYXRlLFxuICAgICAgY3VyclNsaWRlLFxuICAgICAgb3B0aW9uc1xuICAgIH0gPSB0aGlzLnBzd3A7XG5cbiAgICBpZiAodGhpcy5wc3dwLm9wZW5lci5pc0Nsb3NpbmcgfHwgIXRlbXBsYXRlIHx8ICFjdXJyU2xpZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQge1xuICAgICAgY3Vyclpvb21MZXZlbFxuICAgIH0gPSBjdXJyU2xpZGU7IC8vIGlmIG5vdCBvcGVuIHlldCAtIGNoZWNrIGFnYWluc3QgaW5pdGlhbCB6b29tIGxldmVsXG5cbiAgICBpZiAoIXRoaXMucHN3cC5vcGVuZXIuaXNPcGVuKSB7XG4gICAgICBjdXJyWm9vbUxldmVsID0gY3VyclNsaWRlLnpvb21MZXZlbHMuaW5pdGlhbDtcbiAgICB9XG5cbiAgICBpZiAoY3Vyclpvb21MZXZlbCA9PT0gdGhpcy5fbGFzdFVwZGF0ZWRab29tTGV2ZWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9sYXN0VXBkYXRlZFpvb21MZXZlbCA9IGN1cnJab29tTGV2ZWw7XG4gICAgY29uc3QgY3Vyclpvb21MZXZlbERpZmYgPSBjdXJyU2xpZGUuem9vbUxldmVscy5pbml0aWFsIC0gY3VyclNsaWRlLnpvb21MZXZlbHMuc2Vjb25kYXJ5OyAvLyBJbml0aWFsIGFuZCBzZWNvbmRhcnkgem9vbSBsZXZlbHMgYXJlIGFsbW9zdCBlcXVhbFxuXG4gICAgaWYgKE1hdGguYWJzKGN1cnJab29tTGV2ZWxEaWZmKSA8IDAuMDEgfHwgIWN1cnJTbGlkZS5pc1pvb21hYmxlKCkpIHtcbiAgICAgIC8vIGRpc2FibGUgem9vbVxuICAgICAgc2V0Wm9vbWVkSW4odGVtcGxhdGUsIGZhbHNlKTtcbiAgICAgIHRlbXBsYXRlLmNsYXNzTGlzdC5yZW1vdmUoJ3Bzd3AtLXpvb20tYWxsb3dlZCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRlbXBsYXRlLmNsYXNzTGlzdC5hZGQoJ3Bzd3AtLXpvb20tYWxsb3dlZCcpO1xuICAgIGNvbnN0IHBvdGVudGlhbFpvb21MZXZlbCA9IGN1cnJab29tTGV2ZWwgPT09IGN1cnJTbGlkZS56b29tTGV2ZWxzLmluaXRpYWwgPyBjdXJyU2xpZGUuem9vbUxldmVscy5zZWNvbmRhcnkgOiBjdXJyU2xpZGUuem9vbUxldmVscy5pbml0aWFsO1xuICAgIHNldFpvb21lZEluKHRlbXBsYXRlLCBwb3RlbnRpYWxab29tTGV2ZWwgPD0gY3Vyclpvb21MZXZlbCk7XG5cbiAgICBpZiAob3B0aW9ucy5pbWFnZUNsaWNrQWN0aW9uID09PSAnem9vbScgfHwgb3B0aW9ucy5pbWFnZUNsaWNrQWN0aW9uID09PSAnem9vbS1vci1jbG9zZScpIHtcbiAgICAgIHRlbXBsYXRlLmNsYXNzTGlzdC5hZGQoJ3Bzd3AtLWNsaWNrLXRvLXpvb20nKTtcbiAgICB9XG4gIH1cblxufVxuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi9zbGlkZS5qcycpLlNsaWRlRGF0YX0gU2xpZGVEYXRhICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi9waG90b3N3aXBlLmpzJykuZGVmYXVsdH0gUGhvdG9Td2lwZSAqL1xuXG4vKiogQHR5cGVkZWYge3sgeDogbnVtYmVyOyB5OiBudW1iZXI7IHc6IG51bWJlcjsgaW5uZXJSZWN0PzogeyB3OiBudW1iZXI7IGg6IG51bWJlcjsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSB9fSBCb3VuZHMgKi9cblxuLyoqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXHJcbiAqIEByZXR1cm5zIEJvdW5kc1xyXG4gKi9cbmZ1bmN0aW9uIGdldEJvdW5kc0J5RWxlbWVudChlbCkge1xuICBjb25zdCB0aHVtYkFyZWFSZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHJldHVybiB7XG4gICAgeDogdGh1bWJBcmVhUmVjdC5sZWZ0LFxuICAgIHk6IHRodW1iQXJlYVJlY3QudG9wLFxuICAgIHc6IHRodW1iQXJlYVJlY3Qud2lkdGhcbiAgfTtcbn1cbi8qKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxyXG4gKiBAcGFyYW0ge251bWJlcn0gaW1hZ2VXaWR0aFxyXG4gKiBAcGFyYW0ge251bWJlcn0gaW1hZ2VIZWlnaHRcclxuICogQHJldHVybnMgQm91bmRzXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldENyb3BwZWRCb3VuZHNCeUVsZW1lbnQoZWwsIGltYWdlV2lkdGgsIGltYWdlSGVpZ2h0KSB7XG4gIGNvbnN0IHRodW1iQXJlYVJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTsgLy8gZmlsbCBpbWFnZSBpbnRvIHRoZSBhcmVhXG4gIC8vIChkbyB0aGV5IHNhbWUgYXMgb2JqZWN0LWZpdDpjb3ZlciBkb2VzIHRvIHJldHJpZXZlIGNvb3JkaW5hdGVzKVxuXG4gIGNvbnN0IGhSYXRpbyA9IHRodW1iQXJlYVJlY3Qud2lkdGggLyBpbWFnZVdpZHRoO1xuICBjb25zdCB2UmF0aW8gPSB0aHVtYkFyZWFSZWN0LmhlaWdodCAvIGltYWdlSGVpZ2h0O1xuICBjb25zdCBmaWxsWm9vbUxldmVsID0gaFJhdGlvID4gdlJhdGlvID8gaFJhdGlvIDogdlJhdGlvO1xuICBjb25zdCBvZmZzZXRYID0gKHRodW1iQXJlYVJlY3Qud2lkdGggLSBpbWFnZVdpZHRoICogZmlsbFpvb21MZXZlbCkgLyAyO1xuICBjb25zdCBvZmZzZXRZID0gKHRodW1iQXJlYVJlY3QuaGVpZ2h0IC0gaW1hZ2VIZWlnaHQgKiBmaWxsWm9vbUxldmVsKSAvIDI7XG4gIC8qKlxyXG4gICAqIENvb3JkaW5hdGVzIG9mIHRoZSBpbWFnZSxcclxuICAgKiBhcyBpZiBpdCB3YXMgbm90IGNyb3BwZWQsXHJcbiAgICogaGVpZ2h0IGlzIGNhbGN1bGF0ZWQgYXV0b21hdGljYWxseVxyXG4gICAqXHJcbiAgICogQHR5cGUge0JvdW5kc31cclxuICAgKi9cblxuICBjb25zdCBib3VuZHMgPSB7XG4gICAgeDogdGh1bWJBcmVhUmVjdC5sZWZ0ICsgb2Zmc2V0WCxcbiAgICB5OiB0aHVtYkFyZWFSZWN0LnRvcCArIG9mZnNldFksXG4gICAgdzogaW1hZ2VXaWR0aCAqIGZpbGxab29tTGV2ZWxcbiAgfTsgLy8gQ29vcmRpbmF0ZXMgb2YgaW5uZXIgY3JvcCBhcmVhXG4gIC8vIHJlbGF0aXZlIHRvIHRoZSBpbWFnZVxuXG4gIGJvdW5kcy5pbm5lclJlY3QgPSB7XG4gICAgdzogdGh1bWJBcmVhUmVjdC53aWR0aCxcbiAgICBoOiB0aHVtYkFyZWFSZWN0LmhlaWdodCxcbiAgICB4OiBvZmZzZXRYLFxuICAgIHk6IG9mZnNldFlcbiAgfTtcbiAgcmV0dXJuIGJvdW5kcztcbn1cbi8qKlxyXG4gKiBHZXQgZGltZW5zaW9ucyBvZiB0aHVtYm5haWwgaW1hZ2VcclxuICogKGNsaWNrIG9uIHdoaWNoIG9wZW5zIHBob3Rvc3dpcGUgb3IgY2xvc2VzIHBob3Rvc3dpcGUgdG8pXHJcbiAqXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFxyXG4gKiBAcGFyYW0ge1NsaWRlRGF0YX0gaXRlbURhdGFcclxuICogQHBhcmFtIHtQaG90b1N3aXBlfSBpbnN0YW5jZSBQaG90b1N3aXBlIGluc3RhbmNlXHJcbiAqIEByZXR1cm5zIHtCb3VuZHMgfCB1bmRlZmluZWR9XHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldFRodW1iQm91bmRzKGluZGV4LCBpdGVtRGF0YSwgaW5zdGFuY2UpIHtcbiAgLy8gbGVnYWN5IGV2ZW50LCBiZWZvcmUgZmlsdGVycyB3ZXJlIGludHJvZHVjZWRcbiAgY29uc3QgZXZlbnQgPSBpbnN0YW5jZS5kaXNwYXRjaCgndGh1bWJCb3VuZHMnLCB7XG4gICAgaW5kZXgsXG4gICAgaXRlbURhdGEsXG4gICAgaW5zdGFuY2VcbiAgfSk7IC8vIEB0cy1leHBlY3QtZXJyb3JcblxuICBpZiAoZXZlbnQudGh1bWJCb3VuZHMpIHtcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgcmV0dXJuIGV2ZW50LnRodW1iQm91bmRzO1xuICB9XG5cbiAgY29uc3Qge1xuICAgIGVsZW1lbnRcbiAgfSA9IGl0ZW1EYXRhO1xuICAvKiogQHR5cGUge0JvdW5kcyB8IHVuZGVmaW5lZH0gKi9cblxuICBsZXQgdGh1bWJCb3VuZHM7XG4gIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnQgfCBudWxsIHwgdW5kZWZpbmVkfSAqL1xuXG4gIGxldCB0aHVtYm5haWw7XG5cbiAgaWYgKGVsZW1lbnQgJiYgaW5zdGFuY2Uub3B0aW9ucy50aHVtYlNlbGVjdG9yICE9PSBmYWxzZSkge1xuICAgIGNvbnN0IHRodW1iU2VsZWN0b3IgPSBpbnN0YW5jZS5vcHRpb25zLnRodW1iU2VsZWN0b3IgfHwgJ2ltZyc7XG4gICAgdGh1bWJuYWlsID0gZWxlbWVudC5tYXRjaGVzKHRodW1iU2VsZWN0b3IpID8gZWxlbWVudCA6XG4gICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudCB8IG51bGx9ICovXG4gICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yKHRodW1iU2VsZWN0b3IpO1xuICB9XG5cbiAgdGh1bWJuYWlsID0gaW5zdGFuY2UuYXBwbHlGaWx0ZXJzKCd0aHVtYkVsJywgdGh1bWJuYWlsLCBpdGVtRGF0YSwgaW5kZXgpO1xuXG4gIGlmICh0aHVtYm5haWwpIHtcbiAgICBpZiAoIWl0ZW1EYXRhLnRodW1iQ3JvcHBlZCkge1xuICAgICAgdGh1bWJCb3VuZHMgPSBnZXRCb3VuZHNCeUVsZW1lbnQodGh1bWJuYWlsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGh1bWJCb3VuZHMgPSBnZXRDcm9wcGVkQm91bmRzQnlFbGVtZW50KHRodW1ibmFpbCwgaXRlbURhdGEud2lkdGggfHwgaXRlbURhdGEudyB8fCAwLCBpdGVtRGF0YS5oZWlnaHQgfHwgaXRlbURhdGEuaCB8fCAwKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gaW5zdGFuY2UuYXBwbHlGaWx0ZXJzKCd0aHVtYkJvdW5kcycsIHRodW1iQm91bmRzLCBpdGVtRGF0YSwgaW5kZXgpO1xufVxuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4vbGlnaHRib3gvbGlnaHRib3guanMnKS5kZWZhdWx0fSBQaG90b1N3aXBlTGlnaHRib3ggKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3Bob3Rvc3dpcGUuanMnKS5kZWZhdWx0fSBQaG90b1N3aXBlICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi9waG90b3N3aXBlLmpzJykuUGhvdG9Td2lwZU9wdGlvbnN9IFBob3RvU3dpcGVPcHRpb25zICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi9waG90b3N3aXBlLmpzJykuRGF0YVNvdXJjZX0gRGF0YVNvdXJjZSAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4vdWkvdWktZWxlbWVudC5qcycpLlVJRWxlbWVudERhdGF9IFVJRWxlbWVudERhdGEgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3NsaWRlL2NvbnRlbnQuanMnKS5kZWZhdWx0fSBDb250ZW50RGVmYXVsdCAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4vc2xpZGUvc2xpZGUuanMnKS5kZWZhdWx0fSBTbGlkZSAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4vc2xpZGUvc2xpZGUuanMnKS5TbGlkZURhdGF9IFNsaWRlRGF0YSAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4vc2xpZGUvem9vbS1sZXZlbC5qcycpLmRlZmF1bHR9IFpvb21MZXZlbCAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4vc2xpZGUvZ2V0LXRodW1iLWJvdW5kcy5qcycpLkJvdW5kc30gQm91bmRzICovXG5cbi8qKlxyXG4gKiBBbGxvdyBhZGRpbmcgYW4gYXJiaXRyYXJ5IHByb3BzIHRvIHRoZSBDb250ZW50XHJcbiAqIGh0dHBzOi8vcGhvdG9zd2lwZS5jb20vY3VzdG9tLWNvbnRlbnQvI3VzaW5nLXdlYnAtaW1hZ2UtZm9ybWF0XHJcbiAqIEB0eXBlZGVmIHtDb250ZW50RGVmYXVsdCAmIFJlY29yZDxzdHJpbmcsIGFueT59IENvbnRlbnRcclxuICovXG5cbi8qKiBAdHlwZWRlZiB7eyB4PzogbnVtYmVyOyB5PzogbnVtYmVyIH19IFBvaW50ICovXG5cbi8qKlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBQaG90b1N3aXBlRXZlbnRzTWFwIGh0dHBzOi8vcGhvdG9zd2lwZS5jb20vZXZlbnRzL1xyXG4gKlxyXG4gKlxyXG4gKiBodHRwczovL3Bob3Rvc3dpcGUuY29tL2FkZGluZy11aS1lbGVtZW50cy9cclxuICpcclxuICogQHByb3Age3VuZGVmaW5lZH0gdWlSZWdpc3RlclxyXG4gKiBAcHJvcCB7eyBkYXRhOiBVSUVsZW1lbnREYXRhIH19IHVpRWxlbWVudENyZWF0ZVxyXG4gKlxyXG4gKlxyXG4gKiBodHRwczovL3Bob3Rvc3dpcGUuY29tL2V2ZW50cy8jaW5pdGlhbGl6YXRpb24tZXZlbnRzXHJcbiAqXHJcbiAqIEBwcm9wIHt1bmRlZmluZWR9IGJlZm9yZU9wZW5cclxuICogQHByb3Age3VuZGVmaW5lZH0gZmlyc3RVcGRhdGVcclxuICogQHByb3Age3VuZGVmaW5lZH0gaW5pdGlhbExheW91dFxyXG4gKiBAcHJvcCB7dW5kZWZpbmVkfSBjaGFuZ2VcclxuICogQHByb3Age3VuZGVmaW5lZH0gYWZ0ZXJJbml0XHJcbiAqIEBwcm9wIHt1bmRlZmluZWR9IGJpbmRFdmVudHNcclxuICpcclxuICpcclxuICogaHR0cHM6Ly9waG90b3N3aXBlLmNvbS9ldmVudHMvI29wZW5pbmctb3ItY2xvc2luZy10cmFuc2l0aW9uLWV2ZW50c1xyXG4gKlxyXG4gKiBAcHJvcCB7dW5kZWZpbmVkfSBvcGVuaW5nQW5pbWF0aW9uU3RhcnRcclxuICogQHByb3Age3VuZGVmaW5lZH0gb3BlbmluZ0FuaW1hdGlvbkVuZFxyXG4gKiBAcHJvcCB7dW5kZWZpbmVkfSBjbG9zaW5nQW5pbWF0aW9uU3RhcnRcclxuICogQHByb3Age3VuZGVmaW5lZH0gY2xvc2luZ0FuaW1hdGlvbkVuZFxyXG4gKlxyXG4gKlxyXG4gKiBodHRwczovL3Bob3Rvc3dpcGUuY29tL2V2ZW50cy8jY2xvc2luZy1ldmVudHNcclxuICpcclxuICogQHByb3Age3VuZGVmaW5lZH0gY2xvc2VcclxuICogQHByb3Age3VuZGVmaW5lZH0gZGVzdHJveVxyXG4gKlxyXG4gKlxyXG4gKiBodHRwczovL3Bob3Rvc3dpcGUuY29tL2V2ZW50cy8jcG9pbnRlci1hbmQtZ2VzdHVyZS1ldmVudHNcclxuICpcclxuICogQHByb3Age3sgb3JpZ2luYWxFdmVudDogUG9pbnRlckV2ZW50IH19IHBvaW50ZXJEb3duXHJcbiAqIEBwcm9wIHt7IG9yaWdpbmFsRXZlbnQ6IFBvaW50ZXJFdmVudCB9fSBwb2ludGVyTW92ZVxyXG4gKiBAcHJvcCB7eyBvcmlnaW5hbEV2ZW50OiBQb2ludGVyRXZlbnQgfX0gcG9pbnRlclVwXHJcbiAqIEBwcm9wIHt7IGJnT3BhY2l0eTogbnVtYmVyIH19IHBpbmNoQ2xvc2UgY2FuIGJlIGRlZmF1bHQgcHJldmVudGVkXHJcbiAqIEBwcm9wIHt7IHBhblk6IG51bWJlciB9fSB2ZXJ0aWNhbERyYWcgY2FuIGJlIGRlZmF1bHQgcHJldmVudGVkXHJcbiAqXHJcbiAqXHJcbiAqIGh0dHBzOi8vcGhvdG9zd2lwZS5jb20vZXZlbnRzLyNzbGlkZS1jb250ZW50LWV2ZW50c1xyXG4gKlxyXG4gKiBAcHJvcCB7eyBjb250ZW50OiBDb250ZW50IH19IGNvbnRlbnRJbml0XHJcbiAqIEBwcm9wIHt7IGNvbnRlbnQ6IENvbnRlbnQ7IGlzTGF6eTogYm9vbGVhbiB9fSBjb250ZW50TG9hZCBjYW4gYmUgZGVmYXVsdCBwcmV2ZW50ZWRcclxuICogQHByb3Age3sgY29udGVudDogQ29udGVudDsgaXNMYXp5OiBib29sZWFuIH19IGNvbnRlbnRMb2FkSW1hZ2UgY2FuIGJlIGRlZmF1bHQgcHJldmVudGVkXHJcbiAqIEBwcm9wIHt7IGNvbnRlbnQ6IENvbnRlbnQ7IHNsaWRlOiBTbGlkZTsgaXNFcnJvcj86IGJvb2xlYW4gfX0gbG9hZENvbXBsZXRlXHJcbiAqIEBwcm9wIHt7IGNvbnRlbnQ6IENvbnRlbnQ7IHNsaWRlOiBTbGlkZSB9fSBsb2FkRXJyb3JcclxuICogQHByb3Age3sgY29udGVudDogQ29udGVudDsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfX0gY29udGVudFJlc2l6ZSBjYW4gYmUgZGVmYXVsdCBwcmV2ZW50ZWRcclxuICogQHByb3Age3sgY29udGVudDogQ29udGVudDsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXI7IHNsaWRlOiBTbGlkZSB9fSBpbWFnZVNpemVDaGFuZ2VcclxuICogQHByb3Age3sgY29udGVudDogQ29udGVudCB9fSBjb250ZW50TGF6eUxvYWQgY2FuIGJlIGRlZmF1bHQgcHJldmVudGVkXHJcbiAqIEBwcm9wIHt7IGNvbnRlbnQ6IENvbnRlbnQgfX0gY29udGVudEFwcGVuZCBjYW4gYmUgZGVmYXVsdCBwcmV2ZW50ZWRcclxuICogQHByb3Age3sgY29udGVudDogQ29udGVudCB9fSBjb250ZW50QWN0aXZhdGUgY2FuIGJlIGRlZmF1bHQgcHJldmVudGVkXHJcbiAqIEBwcm9wIHt7IGNvbnRlbnQ6IENvbnRlbnQgfX0gY29udGVudERlYWN0aXZhdGUgY2FuIGJlIGRlZmF1bHQgcHJldmVudGVkXHJcbiAqIEBwcm9wIHt7IGNvbnRlbnQ6IENvbnRlbnQgfX0gY29udGVudFJlbW92ZSBjYW4gYmUgZGVmYXVsdCBwcmV2ZW50ZWRcclxuICogQHByb3Age3sgY29udGVudDogQ29udGVudCB9fSBjb250ZW50RGVzdHJveSBjYW4gYmUgZGVmYXVsdCBwcmV2ZW50ZWRcclxuICpcclxuICpcclxuICogdW5kb2N1bWVudGVkXHJcbiAqXHJcbiAqIEBwcm9wIHt7IHBvaW50OiBQb2ludDsgb3JpZ2luYWxFdmVudDogUG9pbnRlckV2ZW50IH19IGltYWdlQ2xpY2tBY3Rpb24gY2FuIGJlIGRlZmF1bHQgcHJldmVudGVkXHJcbiAqIEBwcm9wIHt7IHBvaW50OiBQb2ludDsgb3JpZ2luYWxFdmVudDogUG9pbnRlckV2ZW50IH19IGJnQ2xpY2tBY3Rpb24gY2FuIGJlIGRlZmF1bHQgcHJldmVudGVkXHJcbiAqIEBwcm9wIHt7IHBvaW50OiBQb2ludDsgb3JpZ2luYWxFdmVudDogUG9pbnRlckV2ZW50IH19IHRhcEFjdGlvbiBjYW4gYmUgZGVmYXVsdCBwcmV2ZW50ZWRcclxuICogQHByb3Age3sgcG9pbnQ6IFBvaW50OyBvcmlnaW5hbEV2ZW50OiBQb2ludGVyRXZlbnQgfX0gZG91YmxlVGFwQWN0aW9uIGNhbiBiZSBkZWZhdWx0IHByZXZlbnRlZFxyXG4gKlxyXG4gKiBAcHJvcCB7eyBvcmlnaW5hbEV2ZW50OiBLZXlib2FyZEV2ZW50IH19IGtleWRvd24gY2FuIGJlIGRlZmF1bHQgcHJldmVudGVkXHJcbiAqIEBwcm9wIHt7IHg6IG51bWJlcjsgZHJhZ2dpbmc6IGJvb2xlYW4gfX0gbW92ZU1haW5TY3JvbGxcclxuICogQHByb3Age3sgc2xpZGU6IFNsaWRlIH19IGZpcnN0Wm9vbVBhblxyXG4gKiBAcHJvcCB7eyBzbGlkZTogU2xpZGUgfCB1bmRlZmluZWQsIGRhdGE6IFNsaWRlRGF0YSwgaW5kZXg6IG51bWJlciB9fSBnZXR0aW5nRGF0YVxyXG4gKiBAcHJvcCB7dW5kZWZpbmVkfSBiZWZvcmVSZXNpemVcclxuICogQHByb3Age3VuZGVmaW5lZH0gcmVzaXplXHJcbiAqIEBwcm9wIHt1bmRlZmluZWR9IHZpZXdwb3J0U2l6ZVxyXG4gKiBAcHJvcCB7dW5kZWZpbmVkfSB1cGRhdGVTY3JvbGxPZmZzZXRcclxuICogQHByb3Age3sgc2xpZGU6IFNsaWRlIH19IHNsaWRlSW5pdFxyXG4gKiBAcHJvcCB7eyBzbGlkZTogU2xpZGUgfX0gYWZ0ZXJTZXRDb250ZW50XHJcbiAqIEBwcm9wIHt7IHNsaWRlOiBTbGlkZSB9fSBzbGlkZUxvYWRcclxuICogQHByb3Age3sgc2xpZGU6IFNsaWRlIH19IGFwcGVuZEhlYXZ5IGNhbiBiZSBkZWZhdWx0IHByZXZlbnRlZFxyXG4gKiBAcHJvcCB7eyBzbGlkZTogU2xpZGUgfX0gYXBwZW5kSGVhdnlDb250ZW50XHJcbiAqIEBwcm9wIHt7IHNsaWRlOiBTbGlkZSB9fSBzbGlkZUFjdGl2YXRlXHJcbiAqIEBwcm9wIHt7IHNsaWRlOiBTbGlkZSB9fSBzbGlkZURlYWN0aXZhdGVcclxuICogQHByb3Age3sgc2xpZGU6IFNsaWRlIH19IHNsaWRlRGVzdHJveVxyXG4gKiBAcHJvcCB7eyBkZXN0Wm9vbUxldmVsOiBudW1iZXIsIGNlbnRlclBvaW50OiBQb2ludCB8IHVuZGVmaW5lZCwgdHJhbnNpdGlvbkR1cmF0aW9uOiBudW1iZXIgfCBmYWxzZSB8IHVuZGVmaW5lZCB9fSBiZWZvcmVab29tVG9cclxuICogQHByb3Age3sgc2xpZGU6IFNsaWRlIH19IHpvb21QYW5VcGRhdGVcclxuICogQHByb3Age3sgc2xpZGU6IFNsaWRlIH19IGluaXRpYWxab29tUGFuXHJcbiAqIEBwcm9wIHt7IHNsaWRlOiBTbGlkZSB9fSBjYWxjU2xpZGVTaXplXHJcbiAqIEBwcm9wIHt1bmRlZmluZWR9IHJlc29sdXRpb25DaGFuZ2VkXHJcbiAqIEBwcm9wIHt7IG9yaWdpbmFsRXZlbnQ6IFdoZWVsRXZlbnQgfX0gd2hlZWwgY2FuIGJlIGRlZmF1bHQgcHJldmVudGVkXHJcbiAqIEBwcm9wIHt7IGNvbnRlbnQ6IENvbnRlbnQgfX0gY29udGVudEFwcGVuZEltYWdlIGNhbiBiZSBkZWZhdWx0IHByZXZlbnRlZFxyXG4gKiBAcHJvcCB7eyBpbmRleDogbnVtYmVyOyBpdGVtRGF0YTogU2xpZGVEYXRhIH19IGxhenlMb2FkU2xpZGUgY2FuIGJlIGRlZmF1bHQgcHJldmVudGVkXHJcbiAqIEBwcm9wIHt1bmRlZmluZWR9IGxhenlMb2FkXHJcbiAqIEBwcm9wIHt7IHNsaWRlOiBTbGlkZSB9fSBjYWxjQm91bmRzXHJcbiAqIEBwcm9wIHt7IHpvb21MZXZlbHM6IFpvb21MZXZlbCwgc2xpZGVEYXRhOiBTbGlkZURhdGEgfX0gem9vbUxldmVsc1VwZGF0ZVxyXG4gKlxyXG4gKlxyXG4gKiBsZWdhY3lcclxuICpcclxuICogQHByb3Age3VuZGVmaW5lZH0gaW5pdFxyXG4gKiBAcHJvcCB7dW5kZWZpbmVkfSBpbml0aWFsWm9vbUluXHJcbiAqIEBwcm9wIHt1bmRlZmluZWR9IGluaXRpYWxab29tT3V0XHJcbiAqIEBwcm9wIHt1bmRlZmluZWR9IGluaXRpYWxab29tSW5FbmRcclxuICogQHByb3Age3VuZGVmaW5lZH0gaW5pdGlhbFpvb21PdXRFbmRcclxuICogQHByb3Age3sgZGF0YVNvdXJjZTogRGF0YVNvdXJjZSB8IHVuZGVmaW5lZCwgbnVtSXRlbXM6IG51bWJlciB9fSBudW1JdGVtc1xyXG4gKiBAcHJvcCB7eyBpdGVtRGF0YTogU2xpZGVEYXRhOyBpbmRleDogbnVtYmVyIH19IGl0ZW1EYXRhXHJcbiAqIEBwcm9wIHt7IGluZGV4OiBudW1iZXIsIGl0ZW1EYXRhOiBTbGlkZURhdGEsIGluc3RhbmNlOiBQaG90b1N3aXBlIH19IHRodW1iQm91bmRzXHJcbiAqL1xuXG4vKipcclxuICogQHR5cGVkZWYge09iamVjdH0gUGhvdG9Td2lwZUZpbHRlcnNNYXAgaHR0cHM6Ly9waG90b3N3aXBlLmNvbS9maWx0ZXJzL1xyXG4gKlxyXG4gKiBAcHJvcCB7KG51bUl0ZW1zOiBudW1iZXIsIGRhdGFTb3VyY2U6IERhdGFTb3VyY2UgfCB1bmRlZmluZWQpID0+IG51bWJlcn0gbnVtSXRlbXNcclxuICogTW9kaWZ5IHRoZSB0b3RhbCBhbW91bnQgb2Ygc2xpZGVzLiBFeGFtcGxlIG9uIERhdGEgc291cmNlcyBwYWdlLlxyXG4gKiBodHRwczovL3Bob3Rvc3dpcGUuY29tL2ZpbHRlcnMvI251bWl0ZW1zXHJcbiAqXHJcbiAqIEBwcm9wIHsoaXRlbURhdGE6IFNsaWRlRGF0YSwgaW5kZXg6IG51bWJlcikgPT4gU2xpZGVEYXRhfSBpdGVtRGF0YVxyXG4gKiBNb2RpZnkgc2xpZGUgaXRlbSBkYXRhLiBFeGFtcGxlIG9uIERhdGEgc291cmNlcyBwYWdlLlxyXG4gKiBodHRwczovL3Bob3Rvc3dpcGUuY29tL2ZpbHRlcnMvI2l0ZW1kYXRhXHJcbiAqXHJcbiAqIEBwcm9wIHsoaXRlbURhdGE6IFNsaWRlRGF0YSwgZWxlbWVudDogSFRNTEVsZW1lbnQsIGxpbmtFbDogSFRNTEFuY2hvckVsZW1lbnQpID0+IFNsaWRlRGF0YX0gZG9tSXRlbURhdGFcclxuICogTW9kaWZ5IGl0ZW0gZGF0YSB3aGVuIGl0J3MgcGFyc2VkIGZyb20gRE9NIGVsZW1lbnQuIEV4YW1wbGUgb24gRGF0YSBzb3VyY2VzIHBhZ2UuXHJcbiAqIGh0dHBzOi8vcGhvdG9zd2lwZS5jb20vZmlsdGVycy8jZG9taXRlbWRhdGFcclxuICpcclxuICogQHByb3AgeyhjbGlja2VkSW5kZXg6IG51bWJlciwgZTogTW91c2VFdmVudCwgaW5zdGFuY2U6IFBob3RvU3dpcGVMaWdodGJveCkgPT4gbnVtYmVyfSBjbGlja2VkSW5kZXhcclxuICogTW9kaWZ5IGNsaWNrZWQgZ2FsbGVyeSBpdGVtIGluZGV4LlxyXG4gKiBodHRwczovL3Bob3Rvc3dpcGUuY29tL2ZpbHRlcnMvI2NsaWNrZWRpbmRleFxyXG4gKlxyXG4gKiBAcHJvcCB7KHBsYWNlaG9sZGVyU3JjOiBzdHJpbmcgfCBmYWxzZSwgY29udGVudDogQ29udGVudCkgPT4gc3RyaW5nIHwgZmFsc2V9IHBsYWNlaG9sZGVyU3JjXHJcbiAqIE1vZGlmeSBwbGFjZWhvbGRlciBpbWFnZSBzb3VyY2UuXHJcbiAqIGh0dHBzOi8vcGhvdG9zd2lwZS5jb20vZmlsdGVycy8jcGxhY2Vob2xkZXJzcmNcclxuICpcclxuICogQHByb3Ageyhpc0NvbnRlbnRMb2FkaW5nOiBib29sZWFuLCBjb250ZW50OiBDb250ZW50KSA9PiBib29sZWFufSBpc0NvbnRlbnRMb2FkaW5nXHJcbiAqIE1vZGlmeSBpZiB0aGUgY29udGVudCBpcyBjdXJyZW50bHkgbG9hZGluZy5cclxuICogaHR0cHM6Ly9waG90b3N3aXBlLmNvbS9maWx0ZXJzLyNpc2NvbnRlbnRsb2FkaW5nXHJcbiAqXHJcbiAqIEBwcm9wIHsoaXNDb250ZW50Wm9vbWFibGU6IGJvb2xlYW4sIGNvbnRlbnQ6IENvbnRlbnQpID0+IGJvb2xlYW59IGlzQ29udGVudFpvb21hYmxlXHJcbiAqIE1vZGlmeSBpZiB0aGUgY29udGVudCBjYW4gYmUgem9vbWVkLlxyXG4gKiBodHRwczovL3Bob3Rvc3dpcGUuY29tL2ZpbHRlcnMvI2lzY29udGVudHpvb21hYmxlXHJcbiAqXHJcbiAqIEBwcm9wIHsodXNlQ29udGVudFBsYWNlaG9sZGVyOiBib29sZWFuLCBjb250ZW50OiBDb250ZW50KSA9PiBib29sZWFufSB1c2VDb250ZW50UGxhY2Vob2xkZXJcclxuICogTW9kaWZ5IGlmIHRoZSBwbGFjZWhvbGRlciBzaG91bGQgYmUgdXNlZCBmb3IgdGhlIGNvbnRlbnQuXHJcbiAqIGh0dHBzOi8vcGhvdG9zd2lwZS5jb20vZmlsdGVycy8jdXNlY29udGVudHBsYWNlaG9sZGVyXHJcbiAqXHJcbiAqIEBwcm9wIHsoaXNLZWVwaW5nUGxhY2Vob2xkZXI6IGJvb2xlYW4sIGNvbnRlbnQ6IENvbnRlbnQpID0+IGJvb2xlYW59IGlzS2VlcGluZ1BsYWNlaG9sZGVyXHJcbiAqIE1vZGlmeSBpZiB0aGUgcGxhY2Vob2xkZXIgc2hvdWxkIGJlIGtlcHQgYWZ0ZXIgdGhlIGNvbnRlbnQgaXMgbG9hZGVkLlxyXG4gKiBodHRwczovL3Bob3Rvc3dpcGUuY29tL2ZpbHRlcnMvI2lza2VlcGluZ3BsYWNlaG9sZGVyXHJcbiAqXHJcbiAqXHJcbiAqIEBwcm9wIHsoY29udGVudEVycm9yRWxlbWVudDogSFRNTEVsZW1lbnQsIGNvbnRlbnQ6IENvbnRlbnQpID0+IEhUTUxFbGVtZW50fSBjb250ZW50RXJyb3JFbGVtZW50XHJcbiAqIE1vZGlmeSBhbiBlbGVtZW50IHdoZW4gdGhlIGNvbnRlbnQgaGFzIGVycm9yIHN0YXRlIChmb3IgZXhhbXBsZSwgaWYgaW1hZ2UgY2Fubm90IGJlIGxvYWRlZCkuXHJcbiAqIGh0dHBzOi8vcGhvdG9zd2lwZS5jb20vZmlsdGVycy8jY29udGVudGVycm9yZWxlbWVudFxyXG4gKlxyXG4gKiBAcHJvcCB7KGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBkYXRhOiBVSUVsZW1lbnREYXRhKSA9PiBIVE1MRWxlbWVudH0gdWlFbGVtZW50XHJcbiAqIE1vZGlmeSBhIFVJIGVsZW1lbnQgdGhhdCdzIGJlaW5nIGNyZWF0ZWQuXHJcbiAqIGh0dHBzOi8vcGhvdG9zd2lwZS5jb20vZmlsdGVycy8jdWllbGVtZW50XHJcbiAqXHJcbiAqIEBwcm9wIHsodGh1bWJuYWlsOiBIVE1MRWxlbWVudCB8IG51bGwgfCB1bmRlZmluZWQsIGl0ZW1EYXRhOiBTbGlkZURhdGEsIGluZGV4OiBudW1iZXIpID0+IEhUTUxFbGVtZW50fSB0aHVtYkVsXHJcbiAqIE1vZGlmeSB0aGUgdGh1bWJuYWlsIGVsZW1lbnQgZnJvbSB3aGljaCBvcGVuaW5nIHpvb20gYW5pbWF0aW9uIHN0YXJ0cyBvciBlbmRzLlxyXG4gKiBodHRwczovL3Bob3Rvc3dpcGUuY29tL2ZpbHRlcnMvI3RodW1iZWxcclxuICpcclxuICogQHByb3Ageyh0aHVtYkJvdW5kczogQm91bmRzIHwgdW5kZWZpbmVkLCBpdGVtRGF0YTogU2xpZGVEYXRhLCBpbmRleDogbnVtYmVyKSA9PiBCb3VuZHN9IHRodW1iQm91bmRzXHJcbiAqIE1vZGlmeSB0aGUgdGh1bWJuYWlsIGJvdW5kcyBmcm9tIHdoaWNoIG9wZW5pbmcgem9vbSBhbmltYXRpb24gc3RhcnRzIG9yIGVuZHMuXHJcbiAqIGh0dHBzOi8vcGhvdG9zd2lwZS5jb20vZmlsdGVycy8jdGh1bWJib3VuZHNcclxuICpcclxuICogQHByb3AgeyhzcmNzZXRTaXplc1dpZHRoOiBudW1iZXIsIGNvbnRlbnQ6IENvbnRlbnQpID0+IG51bWJlcn0gc3Jjc2V0U2l6ZXNXaWR0aFxyXG4gKlxyXG4gKiBAcHJvcCB7KHByZXZlbnRQb2ludGVyRXZlbnQ6IGJvb2xlYW4sIGV2ZW50OiBQb2ludGVyRXZlbnQsIHBvaW50ZXJUeXBlOiBzdHJpbmcpID0+IGJvb2xlYW59IHByZXZlbnRQb2ludGVyRXZlbnRcclxuICpcclxuICovXG5cbi8qKlxyXG4gKiBAdGVtcGxhdGUge2tleW9mIFBob3RvU3dpcGVGaWx0ZXJzTWFwfSBUXHJcbiAqIEB0eXBlZGVmIHt7IGZuOiBQaG90b1N3aXBlRmlsdGVyc01hcFtUXSwgcHJpb3JpdHk6IG51bWJlciB9fSBGaWx0ZXJcclxuICovXG5cbi8qKlxyXG4gKiBAdGVtcGxhdGUge2tleW9mIFBob3RvU3dpcGVFdmVudHNNYXB9IFRcclxuICogQHR5cGVkZWYge1Bob3RvU3dpcGVFdmVudHNNYXBbVF0gZXh0ZW5kcyB1bmRlZmluZWQgPyBQaG90b1N3aXBlRXZlbnQ8VD4gOiBQaG90b1N3aXBlRXZlbnQ8VD4gJiBQaG90b1N3aXBlRXZlbnRzTWFwW1RdfSBBdWdtZW50ZWRFdmVudFxyXG4gKi9cblxuLyoqXHJcbiAqIEB0ZW1wbGF0ZSB7a2V5b2YgUGhvdG9Td2lwZUV2ZW50c01hcH0gVFxyXG4gKiBAdHlwZWRlZiB7KGV2ZW50OiBBdWdtZW50ZWRFdmVudDxUPikgPT4gdm9pZH0gRXZlbnRDYWxsYmFja1xyXG4gKi9cblxuLyoqXHJcbiAqIEJhc2UgUGhvdG9Td2lwZSBldmVudCBvYmplY3RcclxuICpcclxuICogQHRlbXBsYXRlIHtrZXlvZiBQaG90b1N3aXBlRXZlbnRzTWFwfSBUXHJcbiAqL1xuY2xhc3MgUGhvdG9Td2lwZUV2ZW50IHtcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtUfSB0eXBlXHJcbiAgICogQHBhcmFtIHtQaG90b1N3aXBlRXZlbnRzTWFwW1RdfSBbZGV0YWlsc11cclxuICAgKi9cbiAgY29uc3RydWN0b3IodHlwZSwgZGV0YWlscykge1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5kZWZhdWx0UHJldmVudGVkID0gZmFsc2U7XG5cbiAgICBpZiAoZGV0YWlscykge1xuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBkZXRhaWxzKTtcbiAgICB9XG4gIH1cblxuICBwcmV2ZW50RGVmYXVsdCgpIHtcbiAgICB0aGlzLmRlZmF1bHRQcmV2ZW50ZWQgPSB0cnVlO1xuICB9XG5cbn1cbi8qKlxyXG4gKiBQaG90b1N3aXBlIGJhc2UgY2xhc3MgdGhhdCBjYW4gbGlzdGVuIGFuZCBkaXNwYXRjaCBmb3IgZXZlbnRzLlxyXG4gKiBTaGFyZWQgYnkgUGhvdG9Td2lwZSBDb3JlIGFuZCBQaG90b1N3aXBlIExpZ2h0Ym94LCBleHRlbmRlZCBieSBiYXNlLmpzXHJcbiAqL1xuXG5cbmNsYXNzIEV2ZW50YWJsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8qKlxyXG4gICAgICogQHR5cGUge3sgW1QgaW4ga2V5b2YgUGhvdG9Td2lwZUV2ZW50c01hcF0/OiAoKGV2ZW50OiBBdWdtZW50ZWRFdmVudDxUPikgPT4gdm9pZClbXSB9fVxyXG4gICAgICovXG4gICAgdGhpcy5fbGlzdGVuZXJzID0ge307XG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSB7eyBbVCBpbiBrZXlvZiBQaG90b1N3aXBlRmlsdGVyc01hcF0/OiBGaWx0ZXI8VD5bXSB9fVxyXG4gICAgICovXG5cbiAgICB0aGlzLl9maWx0ZXJzID0ge307XG4gICAgLyoqIEB0eXBlIHtQaG90b1N3aXBlIHwgdW5kZWZpbmVkfSAqL1xuXG4gICAgdGhpcy5wc3dwID0gdW5kZWZpbmVkO1xuICAgIC8qKiBAdHlwZSB7UGhvdG9Td2lwZU9wdGlvbnMgfCB1bmRlZmluZWR9ICovXG5cbiAgICB0aGlzLm9wdGlvbnMgPSB1bmRlZmluZWQ7XG4gIH1cbiAgLyoqXHJcbiAgICogQHRlbXBsYXRlIHtrZXlvZiBQaG90b1N3aXBlRmlsdGVyc01hcH0gVFxyXG4gICAqIEBwYXJhbSB7VH0gbmFtZVxyXG4gICAqIEBwYXJhbSB7UGhvdG9Td2lwZUZpbHRlcnNNYXBbVF19IGZuXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHByaW9yaXR5XHJcbiAgICovXG5cblxuICBhZGRGaWx0ZXIobmFtZSwgZm4sIHByaW9yaXR5ID0gMTAwKSB7XG4gICAgdmFyIF90aGlzJF9maWx0ZXJzJG5hbWUsIF90aGlzJF9maWx0ZXJzJG5hbWUyLCBfdGhpcyRwc3dwO1xuXG4gICAgaWYgKCF0aGlzLl9maWx0ZXJzW25hbWVdKSB7XG4gICAgICB0aGlzLl9maWx0ZXJzW25hbWVdID0gW107XG4gICAgfVxuXG4gICAgKF90aGlzJF9maWx0ZXJzJG5hbWUgPSB0aGlzLl9maWx0ZXJzW25hbWVdKSA9PT0gbnVsbCB8fCBfdGhpcyRfZmlsdGVycyRuYW1lID09PSB2b2lkIDAgfHwgX3RoaXMkX2ZpbHRlcnMkbmFtZS5wdXNoKHtcbiAgICAgIGZuLFxuICAgICAgcHJpb3JpdHlcbiAgICB9KTtcbiAgICAoX3RoaXMkX2ZpbHRlcnMkbmFtZTIgPSB0aGlzLl9maWx0ZXJzW25hbWVdKSA9PT0gbnVsbCB8fCBfdGhpcyRfZmlsdGVycyRuYW1lMiA9PT0gdm9pZCAwIHx8IF90aGlzJF9maWx0ZXJzJG5hbWUyLnNvcnQoKGYxLCBmMikgPT4gZjEucHJpb3JpdHkgLSBmMi5wcmlvcml0eSk7XG4gICAgKF90aGlzJHBzd3AgPSB0aGlzLnBzd3ApID09PSBudWxsIHx8IF90aGlzJHBzd3AgPT09IHZvaWQgMCB8fCBfdGhpcyRwc3dwLmFkZEZpbHRlcihuYW1lLCBmbiwgcHJpb3JpdHkpO1xuICB9XG4gIC8qKlxyXG4gICAqIEB0ZW1wbGF0ZSB7a2V5b2YgUGhvdG9Td2lwZUZpbHRlcnNNYXB9IFRcclxuICAgKiBAcGFyYW0ge1R9IG5hbWVcclxuICAgKiBAcGFyYW0ge1Bob3RvU3dpcGVGaWx0ZXJzTWFwW1RdfSBmblxyXG4gICAqL1xuXG5cbiAgcmVtb3ZlRmlsdGVyKG5hbWUsIGZuKSB7XG4gICAgaWYgKHRoaXMuX2ZpbHRlcnNbbmFtZV0pIHtcbiAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgIHRoaXMuX2ZpbHRlcnNbbmFtZV0gPSB0aGlzLl9maWx0ZXJzW25hbWVdLmZpbHRlcihmaWx0ZXIgPT4gZmlsdGVyLmZuICE9PSBmbik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHN3cCkge1xuICAgICAgdGhpcy5wc3dwLnJlbW92ZUZpbHRlcihuYW1lLCBmbik7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIEB0ZW1wbGF0ZSB7a2V5b2YgUGhvdG9Td2lwZUZpbHRlcnNNYXB9IFRcclxuICAgKiBAcGFyYW0ge1R9IG5hbWVcclxuICAgKiBAcGFyYW0ge1BhcmFtZXRlcnM8UGhvdG9Td2lwZUZpbHRlcnNNYXBbVF0+fSBhcmdzXHJcbiAgICogQHJldHVybnMge1BhcmFtZXRlcnM8UGhvdG9Td2lwZUZpbHRlcnNNYXBbVF0+WzBdfVxyXG4gICAqL1xuXG5cbiAgYXBwbHlGaWx0ZXJzKG5hbWUsIC4uLmFyZ3MpIHtcbiAgICB2YXIgX3RoaXMkX2ZpbHRlcnMkbmFtZTM7XG5cbiAgICAoX3RoaXMkX2ZpbHRlcnMkbmFtZTMgPSB0aGlzLl9maWx0ZXJzW25hbWVdKSA9PT0gbnVsbCB8fCBfdGhpcyRfZmlsdGVycyRuYW1lMyA9PT0gdm9pZCAwIHx8IF90aGlzJF9maWx0ZXJzJG5hbWUzLmZvckVhY2goZmlsdGVyID0+IHtcbiAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgIGFyZ3NbMF0gPSBmaWx0ZXIuZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFyZ3NbMF07XG4gIH1cbiAgLyoqXHJcbiAgICogQHRlbXBsYXRlIHtrZXlvZiBQaG90b1N3aXBlRXZlbnRzTWFwfSBUXHJcbiAgICogQHBhcmFtIHtUfSBuYW1lXHJcbiAgICogQHBhcmFtIHtFdmVudENhbGxiYWNrPFQ+fSBmblxyXG4gICAqL1xuXG5cbiAgb24obmFtZSwgZm4pIHtcbiAgICB2YXIgX3RoaXMkX2xpc3RlbmVycyRuYW1lLCBfdGhpcyRwc3dwMjtcblxuICAgIGlmICghdGhpcy5fbGlzdGVuZXJzW25hbWVdKSB7XG4gICAgICB0aGlzLl9saXN0ZW5lcnNbbmFtZV0gPSBbXTtcbiAgICB9XG5cbiAgICAoX3RoaXMkX2xpc3RlbmVycyRuYW1lID0gdGhpcy5fbGlzdGVuZXJzW25hbWVdKSA9PT0gbnVsbCB8fCBfdGhpcyRfbGlzdGVuZXJzJG5hbWUgPT09IHZvaWQgMCB8fCBfdGhpcyRfbGlzdGVuZXJzJG5hbWUucHVzaChmbik7IC8vIFdoZW4gYmluZGluZyBldmVudHMgdG8gbGlnaHRib3gsXG4gICAgLy8gYWxzbyBiaW5kIGV2ZW50cyB0byBQaG90b1N3aXBlIENvcmUsXG4gICAgLy8gaWYgaXQncyBvcGVuLlxuXG4gICAgKF90aGlzJHBzd3AyID0gdGhpcy5wc3dwKSA9PT0gbnVsbCB8fCBfdGhpcyRwc3dwMiA9PT0gdm9pZCAwIHx8IF90aGlzJHBzd3AyLm9uKG5hbWUsIGZuKTtcbiAgfVxuICAvKipcclxuICAgKiBAdGVtcGxhdGUge2tleW9mIFBob3RvU3dpcGVFdmVudHNNYXB9IFRcclxuICAgKiBAcGFyYW0ge1R9IG5hbWVcclxuICAgKiBAcGFyYW0ge0V2ZW50Q2FsbGJhY2s8VD59IGZuXHJcbiAgICovXG5cblxuICBvZmYobmFtZSwgZm4pIHtcbiAgICB2YXIgX3RoaXMkcHN3cDM7XG5cbiAgICBpZiAodGhpcy5fbGlzdGVuZXJzW25hbWVdKSB7XG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICB0aGlzLl9saXN0ZW5lcnNbbmFtZV0gPSB0aGlzLl9saXN0ZW5lcnNbbmFtZV0uZmlsdGVyKGxpc3RlbmVyID0+IGZuICE9PSBsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgKF90aGlzJHBzd3AzID0gdGhpcy5wc3dwKSA9PT0gbnVsbCB8fCBfdGhpcyRwc3dwMyA9PT0gdm9pZCAwIHx8IF90aGlzJHBzd3AzLm9mZihuYW1lLCBmbik7XG4gIH1cbiAgLyoqXHJcbiAgICogQHRlbXBsYXRlIHtrZXlvZiBQaG90b1N3aXBlRXZlbnRzTWFwfSBUXHJcbiAgICogQHBhcmFtIHtUfSBuYW1lXHJcbiAgICogQHBhcmFtIHtQaG90b1N3aXBlRXZlbnRzTWFwW1RdfSBbZGV0YWlsc11cclxuICAgKiBAcmV0dXJucyB7QXVnbWVudGVkRXZlbnQ8VD59XHJcbiAgICovXG5cblxuICBkaXNwYXRjaChuYW1lLCBkZXRhaWxzKSB7XG4gICAgdmFyIF90aGlzJF9saXN0ZW5lcnMkbmFtZTI7XG5cbiAgICBpZiAodGhpcy5wc3dwKSB7XG4gICAgICByZXR1cm4gdGhpcy5wc3dwLmRpc3BhdGNoKG5hbWUsIGRldGFpbHMpO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50ID1cbiAgICAvKiogQHR5cGUge0F1Z21lbnRlZEV2ZW50PFQ+fSAqL1xuICAgIG5ldyBQaG90b1N3aXBlRXZlbnQobmFtZSwgZGV0YWlscyk7XG4gICAgKF90aGlzJF9saXN0ZW5lcnMkbmFtZTIgPSB0aGlzLl9saXN0ZW5lcnNbbmFtZV0pID09PSBudWxsIHx8IF90aGlzJF9saXN0ZW5lcnMkbmFtZTIgPT09IHZvaWQgMCB8fCBfdGhpcyRfbGlzdGVuZXJzJG5hbWUyLmZvckVhY2gobGlzdGVuZXIgPT4ge1xuICAgICAgbGlzdGVuZXIuY2FsbCh0aGlzLCBldmVudCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbn1cblxuY2xhc3MgUGxhY2Vob2xkZXIge1xuICAvKipcclxuICAgKiBAcGFyYW0ge3N0cmluZyB8IGZhbHNlfSBpbWFnZVNyY1xyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lclxyXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpbWFnZVNyYywgY29udGFpbmVyKSB7XG4gICAgLy8gQ3JlYXRlIHBsYWNlaG9sZGVyXG4gICAgLy8gKHN0cmV0Y2hlZCB0aHVtYm5haWwgb3Igc2ltcGxlIGRpdiBiZWhpbmQgdGhlIG1haW4gaW1hZ2UpXG5cbiAgICAvKiogQHR5cGUge0hUTUxJbWFnZUVsZW1lbnQgfCBIVE1MRGl2RWxlbWVudCB8IG51bGx9ICovXG4gICAgdGhpcy5lbGVtZW50ID0gY3JlYXRlRWxlbWVudCgncHN3cF9faW1nIHBzd3BfX2ltZy0tcGxhY2Vob2xkZXInLCBpbWFnZVNyYyA/ICdpbWcnIDogJ2RpdicsIGNvbnRhaW5lcik7XG5cbiAgICBpZiAoaW1hZ2VTcmMpIHtcbiAgICAgIGNvbnN0IGltZ0VsID1cbiAgICAgIC8qKiBAdHlwZSB7SFRNTEltYWdlRWxlbWVudH0gKi9cbiAgICAgIHRoaXMuZWxlbWVudDtcbiAgICAgIGltZ0VsLmRlY29kaW5nID0gJ2FzeW5jJztcbiAgICAgIGltZ0VsLmFsdCA9ICcnO1xuICAgICAgaW1nRWwuc3JjID0gaW1hZ2VTcmM7XG4gICAgICBpbWdFbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJlc2VudGF0aW9uJyk7XG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICB9XG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHRcclxuICAgKi9cblxuXG4gIHNldERpc3BsYXllZFNpemUod2lkdGgsIGhlaWdodCkge1xuICAgIGlmICghdGhpcy5lbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZWxlbWVudC50YWdOYW1lID09PSAnSU1HJykge1xuICAgICAgLy8gVXNlIHRyYW5zZm9ybSBzY2FsZSgpIHRvIG1vZGlmeSBpbWcgcGxhY2Vob2xkZXIgc2l6ZVxuICAgICAgLy8gKGluc3RlYWQgb2YgY2hhbmdpbmcgd2lkdGgvaGVpZ2h0IGRpcmVjdGx5KS5cbiAgICAgIC8vIFRoaXMgaGVscHMgd2l0aCBwZXJmb3JtYW5jZSwgc3BlY2lmaWNhbGx5IGluIGlPUzE1IFNhZmFyaS5cbiAgICAgIHNldFdpZHRoSGVpZ2h0KHRoaXMuZWxlbWVudCwgMjUwLCAnYXV0bycpO1xuICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICcwIDAnO1xuICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IHRvVHJhbnNmb3JtU3RyaW5nKDAsIDAsIHdpZHRoIC8gMjUwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0V2lkdGhIZWlnaHQodGhpcy5lbGVtZW50LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHZhciBfdGhpcyRlbGVtZW50O1xuXG4gICAgaWYgKChfdGhpcyRlbGVtZW50ID0gdGhpcy5lbGVtZW50KSAhPT0gbnVsbCAmJiBfdGhpcyRlbGVtZW50ICE9PSB2b2lkIDAgJiYgX3RoaXMkZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcbiAgfVxuXG59XG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NsaWRlLmpzJykuZGVmYXVsdH0gU2xpZGUgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4vc2xpZGUuanMnKS5TbGlkZURhdGF9IFNsaWRlRGF0YSAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4vY29yZS9iYXNlLmpzJykuZGVmYXVsdH0gUGhvdG9Td2lwZUJhc2UgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3V0aWwvdXRpbC5qcycpLkxvYWRTdGF0ZX0gTG9hZFN0YXRlICovXG5cbmNsYXNzIENvbnRlbnQge1xuICAvKipcclxuICAgKiBAcGFyYW0ge1NsaWRlRGF0YX0gaXRlbURhdGEgU2xpZGUgZGF0YVxyXG4gICAqIEBwYXJhbSB7UGhvdG9Td2lwZUJhc2V9IGluc3RhbmNlIFBob3RvU3dpcGUgb3IgUGhvdG9Td2lwZUxpZ2h0Ym94IGluc3RhbmNlXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XHJcbiAgICovXG4gIGNvbnN0cnVjdG9yKGl0ZW1EYXRhLCBpbnN0YW5jZSwgaW5kZXgpIHtcbiAgICB0aGlzLmluc3RhbmNlID0gaW5zdGFuY2U7XG4gICAgdGhpcy5kYXRhID0gaXRlbURhdGE7XG4gICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgIC8qKiBAdHlwZSB7SFRNTEltYWdlRWxlbWVudCB8IEhUTUxEaXZFbGVtZW50IHwgdW5kZWZpbmVkfSAqL1xuXG4gICAgdGhpcy5lbGVtZW50ID0gdW5kZWZpbmVkO1xuICAgIC8qKiBAdHlwZSB7UGxhY2Vob2xkZXIgfCB1bmRlZmluZWR9ICovXG5cbiAgICB0aGlzLnBsYWNlaG9sZGVyID0gdW5kZWZpbmVkO1xuICAgIC8qKiBAdHlwZSB7U2xpZGUgfCB1bmRlZmluZWR9ICovXG5cbiAgICB0aGlzLnNsaWRlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZGlzcGxheWVkSW1hZ2VXaWR0aCA9IDA7XG4gICAgdGhpcy5kaXNwbGF5ZWRJbWFnZUhlaWdodCA9IDA7XG4gICAgdGhpcy53aWR0aCA9IE51bWJlcih0aGlzLmRhdGEudykgfHwgTnVtYmVyKHRoaXMuZGF0YS53aWR0aCkgfHwgMDtcbiAgICB0aGlzLmhlaWdodCA9IE51bWJlcih0aGlzLmRhdGEuaCkgfHwgTnVtYmVyKHRoaXMuZGF0YS5oZWlnaHQpIHx8IDA7XG4gICAgdGhpcy5pc0F0dGFjaGVkID0gZmFsc2U7XG4gICAgdGhpcy5oYXNTbGlkZSA9IGZhbHNlO1xuICAgIHRoaXMuaXNEZWNvZGluZyA9IGZhbHNlO1xuICAgIC8qKiBAdHlwZSB7TG9hZFN0YXRlfSAqL1xuXG4gICAgdGhpcy5zdGF0ZSA9IExPQURfU1RBVEUuSURMRTtcblxuICAgIGlmICh0aGlzLmRhdGEudHlwZSkge1xuICAgICAgdGhpcy50eXBlID0gdGhpcy5kYXRhLnR5cGU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmRhdGEuc3JjKSB7XG4gICAgICB0aGlzLnR5cGUgPSAnaW1hZ2UnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnR5cGUgPSAnaHRtbCc7XG4gICAgfVxuXG4gICAgdGhpcy5pbnN0YW5jZS5kaXNwYXRjaCgnY29udGVudEluaXQnLCB7XG4gICAgICBjb250ZW50OiB0aGlzXG4gICAgfSk7XG4gIH1cblxuICByZW1vdmVQbGFjZWhvbGRlcigpIHtcbiAgICBpZiAodGhpcy5wbGFjZWhvbGRlciAmJiAhdGhpcy5rZWVwUGxhY2Vob2xkZXIoKSkge1xuICAgICAgLy8gV2l0aCBkZWxheSwgYXMgaW1hZ2UgbWlnaHQgYmUgbG9hZGVkLCBidXQgbm90IHJlbmRlcmVkXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMucGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICB0aGlzLnBsYWNlaG9sZGVyLmRlc3Ryb3koKTtcbiAgICAgICAgICB0aGlzLnBsYWNlaG9sZGVyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9LCAxMDAwKTtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogUHJlbG9hZCBjb250ZW50XHJcbiAgICpcclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzTGF6eVxyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3JlbG9hZF1cclxuICAgKi9cblxuXG4gIGxvYWQoaXNMYXp5LCByZWxvYWQpIHtcbiAgICBpZiAodGhpcy5zbGlkZSAmJiB0aGlzLnVzZVBsYWNlaG9sZGVyKCkpIHtcbiAgICAgIGlmICghdGhpcy5wbGFjZWhvbGRlcikge1xuICAgICAgICBjb25zdCBwbGFjZWhvbGRlclNyYyA9IHRoaXMuaW5zdGFuY2UuYXBwbHlGaWx0ZXJzKCdwbGFjZWhvbGRlclNyYycsIC8vIHVzZSAgaW1hZ2UtYmFzZWQgcGxhY2Vob2xkZXIgb25seSBmb3IgdGhlIGZpcnN0IHNsaWRlLFxuICAgICAgICAvLyBhcyByZW5kZXJpbmcgKGV2ZW4gc21hbGwgc3RyZXRjaGVkIHRodW1ibmFpbCkgaXMgYW4gZXhwZW5zaXZlIG9wZXJhdGlvblxuICAgICAgICB0aGlzLmRhdGEubXNyYyAmJiB0aGlzLnNsaWRlLmlzRmlyc3RTbGlkZSA/IHRoaXMuZGF0YS5tc3JjIDogZmFsc2UsIHRoaXMpO1xuICAgICAgICB0aGlzLnBsYWNlaG9sZGVyID0gbmV3IFBsYWNlaG9sZGVyKHBsYWNlaG9sZGVyU3JjLCB0aGlzLnNsaWRlLmNvbnRhaW5lcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBwbGFjZWhvbGRlckVsID0gdGhpcy5wbGFjZWhvbGRlci5lbGVtZW50OyAvLyBBZGQgcGxhY2Vob2xkZXIgdG8gRE9NIGlmIGl0IHdhcyBhbHJlYWR5IGNyZWF0ZWRcblxuICAgICAgICBpZiAocGxhY2Vob2xkZXJFbCAmJiAhcGxhY2Vob2xkZXJFbC5wYXJlbnRFbGVtZW50KSB7XG4gICAgICAgICAgdGhpcy5zbGlkZS5jb250YWluZXIucHJlcGVuZChwbGFjZWhvbGRlckVsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmVsZW1lbnQgJiYgIXJlbG9hZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmluc3RhbmNlLmRpc3BhdGNoKCdjb250ZW50TG9hZCcsIHtcbiAgICAgIGNvbnRlbnQ6IHRoaXMsXG4gICAgICBpc0xhenlcbiAgICB9KS5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNJbWFnZUNvbnRlbnQoKSkge1xuICAgICAgdGhpcy5lbGVtZW50ID0gY3JlYXRlRWxlbWVudCgncHN3cF9faW1nJywgJ2ltZycpOyAvLyBTdGFydCBsb2FkaW5nIG9ubHkgYWZ0ZXIgd2lkdGggaXMgZGVmaW5lZCwgYXMgc2l6ZXMgbWlnaHQgZGVwZW5kIG9uIGl0LlxuICAgICAgLy8gRHVlIHRvIFNhZmFyaSBmZWF0dXJlLCB3ZSBtdXN0IGRlZmluZSBzaXplcyBiZWZvcmUgc3Jjc2V0LlxuXG4gICAgICBpZiAodGhpcy5kaXNwbGF5ZWRJbWFnZVdpZHRoKSB7XG4gICAgICAgIHRoaXMubG9hZEltYWdlKGlzTGF6eSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoJ3Bzd3BfX2NvbnRlbnQnLCAnZGl2Jyk7XG4gICAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy5kYXRhLmh0bWwgfHwgJyc7XG4gICAgfVxuXG4gICAgaWYgKHJlbG9hZCAmJiB0aGlzLnNsaWRlKSB7XG4gICAgICB0aGlzLnNsaWRlLnVwZGF0ZUNvbnRlbnRTaXplKHRydWUpO1xuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBQcmVsb2FkIGltYWdlXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzTGF6eVxyXG4gICAqL1xuXG5cbiAgbG9hZEltYWdlKGlzTGF6eSkge1xuICAgIHZhciBfdGhpcyRkYXRhJHNyYywgX3RoaXMkZGF0YSRhbHQ7XG5cbiAgICBpZiAoIXRoaXMuaXNJbWFnZUNvbnRlbnQoKSB8fCAhdGhpcy5lbGVtZW50IHx8IHRoaXMuaW5zdGFuY2UuZGlzcGF0Y2goJ2NvbnRlbnRMb2FkSW1hZ2UnLCB7XG4gICAgICBjb250ZW50OiB0aGlzLFxuICAgICAgaXNMYXp5XG4gICAgfSkuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGltYWdlRWxlbWVudCA9XG4gICAgLyoqIEB0eXBlIEhUTUxJbWFnZUVsZW1lbnQgKi9cbiAgICB0aGlzLmVsZW1lbnQ7XG4gICAgdGhpcy51cGRhdGVTcmNzZXRTaXplcygpO1xuXG4gICAgaWYgKHRoaXMuZGF0YS5zcmNzZXQpIHtcbiAgICAgIGltYWdlRWxlbWVudC5zcmNzZXQgPSB0aGlzLmRhdGEuc3Jjc2V0O1xuICAgIH1cblxuICAgIGltYWdlRWxlbWVudC5zcmMgPSAoX3RoaXMkZGF0YSRzcmMgPSB0aGlzLmRhdGEuc3JjKSAhPT0gbnVsbCAmJiBfdGhpcyRkYXRhJHNyYyAhPT0gdm9pZCAwID8gX3RoaXMkZGF0YSRzcmMgOiAnJztcbiAgICBpbWFnZUVsZW1lbnQuYWx0ID0gKF90aGlzJGRhdGEkYWx0ID0gdGhpcy5kYXRhLmFsdCkgIT09IG51bGwgJiYgX3RoaXMkZGF0YSRhbHQgIT09IHZvaWQgMCA/IF90aGlzJGRhdGEkYWx0IDogJyc7XG4gICAgdGhpcy5zdGF0ZSA9IExPQURfU1RBVEUuTE9BRElORztcblxuICAgIGlmIChpbWFnZUVsZW1lbnQuY29tcGxldGUpIHtcbiAgICAgIHRoaXMub25Mb2FkZWQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW1hZ2VFbGVtZW50Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5vbkxvYWRlZCgpO1xuICAgICAgfTtcblxuICAgICAgaW1hZ2VFbGVtZW50Lm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMub25FcnJvcigpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogQXNzaWduIHNsaWRlIHRvIGNvbnRlbnRcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7U2xpZGV9IHNsaWRlXHJcbiAgICovXG5cblxuICBzZXRTbGlkZShzbGlkZSkge1xuICAgIHRoaXMuc2xpZGUgPSBzbGlkZTtcbiAgICB0aGlzLmhhc1NsaWRlID0gdHJ1ZTtcbiAgICB0aGlzLmluc3RhbmNlID0gc2xpZGUucHN3cDsgLy8gdG9kbzogZG8gd2UgbmVlZCB0byB1bnNldCBzbGlkZT9cbiAgfVxuICAvKipcclxuICAgKiBDb250ZW50IGxvYWQgc3VjY2VzcyBoYW5kbGVyXHJcbiAgICovXG5cblxuICBvbkxvYWRlZCgpIHtcbiAgICB0aGlzLnN0YXRlID0gTE9BRF9TVEFURS5MT0FERUQ7XG5cbiAgICBpZiAodGhpcy5zbGlkZSAmJiB0aGlzLmVsZW1lbnQpIHtcbiAgICAgIHRoaXMuaW5zdGFuY2UuZGlzcGF0Y2goJ2xvYWRDb21wbGV0ZScsIHtcbiAgICAgICAgc2xpZGU6IHRoaXMuc2xpZGUsXG4gICAgICAgIGNvbnRlbnQ6IHRoaXNcbiAgICAgIH0pOyAvLyBpZiBjb250ZW50IGlzIHJlbG9hZGVkXG5cbiAgICAgIGlmICh0aGlzLnNsaWRlLmlzQWN0aXZlICYmIHRoaXMuc2xpZGUuaGVhdnlBcHBlbmRlZCAmJiAhdGhpcy5lbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQoKTtcbiAgICAgICAgdGhpcy5zbGlkZS51cGRhdGVDb250ZW50U2l6ZSh0cnVlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IExPQURfU1RBVEUuTE9BREVEIHx8IHRoaXMuc3RhdGUgPT09IExPQURfU1RBVEUuRVJST1IpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVQbGFjZWhvbGRlcigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBDb250ZW50IGxvYWQgZXJyb3IgaGFuZGxlclxyXG4gICAqL1xuXG5cbiAgb25FcnJvcigpIHtcbiAgICB0aGlzLnN0YXRlID0gTE9BRF9TVEFURS5FUlJPUjtcblxuICAgIGlmICh0aGlzLnNsaWRlKSB7XG4gICAgICB0aGlzLmRpc3BsYXlFcnJvcigpO1xuICAgICAgdGhpcy5pbnN0YW5jZS5kaXNwYXRjaCgnbG9hZENvbXBsZXRlJywge1xuICAgICAgICBzbGlkZTogdGhpcy5zbGlkZSxcbiAgICAgICAgaXNFcnJvcjogdHJ1ZSxcbiAgICAgICAgY29udGVudDogdGhpc1xuICAgICAgfSk7XG4gICAgICB0aGlzLmluc3RhbmNlLmRpc3BhdGNoKCdsb2FkRXJyb3InLCB7XG4gICAgICAgIHNsaWRlOiB0aGlzLnNsaWRlLFxuICAgICAgICBjb250ZW50OiB0aGlzXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogQHJldHVybnMge0Jvb2xlYW59IElmIHRoZSBjb250ZW50IGlzIGN1cnJlbnRseSBsb2FkaW5nXHJcbiAgICovXG5cblxuICBpc0xvYWRpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuYXBwbHlGaWx0ZXJzKCdpc0NvbnRlbnRMb2FkaW5nJywgdGhpcy5zdGF0ZSA9PT0gTE9BRF9TVEFURS5MT0FESU5HLCB0aGlzKTtcbiAgfVxuICAvKipcclxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gSWYgdGhlIGNvbnRlbnQgaXMgaW4gZXJyb3Igc3RhdGVcclxuICAgKi9cblxuXG4gIGlzRXJyb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUgPT09IExPQURfU1RBVEUuRVJST1I7XG4gIH1cbiAgLyoqXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59IElmIHRoZSBjb250ZW50IGlzIGltYWdlXHJcbiAgICovXG5cblxuICBpc0ltYWdlQ29udGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlID09PSAnaW1hZ2UnO1xuICB9XG4gIC8qKlxyXG4gICAqIFVwZGF0ZSBjb250ZW50IHNpemVcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcclxuICAgKi9cblxuXG4gIHNldERpc3BsYXllZFNpemUod2lkdGgsIGhlaWdodCkge1xuICAgIGlmICghdGhpcy5lbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGxhY2Vob2xkZXIpIHtcbiAgICAgIHRoaXMucGxhY2Vob2xkZXIuc2V0RGlzcGxheWVkU2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pbnN0YW5jZS5kaXNwYXRjaCgnY29udGVudFJlc2l6ZScsIHtcbiAgICAgIGNvbnRlbnQ6IHRoaXMsXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodFxuICAgIH0pLmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzZXRXaWR0aEhlaWdodCh0aGlzLmVsZW1lbnQsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgaWYgKHRoaXMuaXNJbWFnZUNvbnRlbnQoKSAmJiAhdGhpcy5pc0Vycm9yKCkpIHtcbiAgICAgIGNvbnN0IGlzSW5pdGlhbFNpemVVcGRhdGUgPSAhdGhpcy5kaXNwbGF5ZWRJbWFnZVdpZHRoICYmIHdpZHRoO1xuICAgICAgdGhpcy5kaXNwbGF5ZWRJbWFnZVdpZHRoID0gd2lkdGg7XG4gICAgICB0aGlzLmRpc3BsYXllZEltYWdlSGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgICBpZiAoaXNJbml0aWFsU2l6ZVVwZGF0ZSkge1xuICAgICAgICB0aGlzLmxvYWRJbWFnZShmYWxzZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnVwZGF0ZVNyY3NldFNpemVzKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNsaWRlKSB7XG4gICAgICAgIHRoaXMuaW5zdGFuY2UuZGlzcGF0Y2goJ2ltYWdlU2l6ZUNoYW5nZScsIHtcbiAgICAgICAgICBzbGlkZTogdGhpcy5zbGlkZSxcbiAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgY29udGVudDogdGhpc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59IElmIHRoZSBjb250ZW50IGNhbiBiZSB6b29tZWRcclxuICAgKi9cblxuXG4gIGlzWm9vbWFibGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuYXBwbHlGaWx0ZXJzKCdpc0NvbnRlbnRab29tYWJsZScsIHRoaXMuaXNJbWFnZUNvbnRlbnQoKSAmJiB0aGlzLnN0YXRlICE9PSBMT0FEX1NUQVRFLkVSUk9SLCB0aGlzKTtcbiAgfVxuICAvKipcclxuICAgKiBVcGRhdGUgaW1hZ2Ugc3Jjc2V0IHNpemVzIGF0dHJpYnV0ZSBiYXNlZCBvbiB3aWR0aCBhbmQgaGVpZ2h0XHJcbiAgICovXG5cblxuICB1cGRhdGVTcmNzZXRTaXplcygpIHtcbiAgICAvLyBIYW5kbGUgc3Jjc2V0IHNpemVzIGF0dHJpYnV0ZS5cbiAgICAvL1xuICAgIC8vIE5ldmVyIGxvd2VyIHF1YWxpdHksIGlmIGl0IHdhcyBpbmNyZWFzZWQgcHJldmlvdXNseS5cbiAgICAvLyBDaHJvbWUgZG9lcyB0aGlzIGF1dG9tYXRpY2FsbHksIEZpcmVmb3ggYW5kIFNhZmFyaSBkbyBub3QsXG4gICAgLy8gc28gd2Ugc3RvcmUgbGFyZ2VzdCB1c2VkIHNpemUgaW4gZGF0YXNldC5cbiAgICBpZiAoIXRoaXMuaXNJbWFnZUNvbnRlbnQoKSB8fCAhdGhpcy5lbGVtZW50IHx8ICF0aGlzLmRhdGEuc3Jjc2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW1hZ2UgPVxuICAgIC8qKiBAdHlwZSBIVE1MSW1hZ2VFbGVtZW50ICovXG4gICAgdGhpcy5lbGVtZW50O1xuICAgIGNvbnN0IHNpemVzV2lkdGggPSB0aGlzLmluc3RhbmNlLmFwcGx5RmlsdGVycygnc3Jjc2V0U2l6ZXNXaWR0aCcsIHRoaXMuZGlzcGxheWVkSW1hZ2VXaWR0aCwgdGhpcyk7XG5cbiAgICBpZiAoIWltYWdlLmRhdGFzZXQubGFyZ2VzdFVzZWRTaXplIHx8IHNpemVzV2lkdGggPiBwYXJzZUludChpbWFnZS5kYXRhc2V0Lmxhcmdlc3RVc2VkU2l6ZSwgMTApKSB7XG4gICAgICBpbWFnZS5zaXplcyA9IHNpemVzV2lkdGggKyAncHgnO1xuICAgICAgaW1hZ2UuZGF0YXNldC5sYXJnZXN0VXNlZFNpemUgPSBTdHJpbmcoc2l6ZXNXaWR0aCk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBJZiBjb250ZW50IHNob3VsZCB1c2UgYSBwbGFjZWhvbGRlciAoZnJvbSBtc3JjIGJ5IGRlZmF1bHQpXHJcbiAgICovXG5cblxuICB1c2VQbGFjZWhvbGRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5hcHBseUZpbHRlcnMoJ3VzZUNvbnRlbnRQbGFjZWhvbGRlcicsIHRoaXMuaXNJbWFnZUNvbnRlbnQoKSwgdGhpcyk7XG4gIH1cbiAgLyoqXHJcbiAgICogUHJlbG9hZCBjb250ZW50IHdpdGggbGF6eS1sb2FkaW5nIHBhcmFtXHJcbiAgICovXG5cblxuICBsYXp5TG9hZCgpIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5kaXNwYXRjaCgnY29udGVudExhenlMb2FkJywge1xuICAgICAgY29udGVudDogdGhpc1xuICAgIH0pLmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmxvYWQodHJ1ZSk7XG4gIH1cbiAgLyoqXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59IElmIHBsYWNlaG9sZGVyIHNob3VsZCBiZSBrZXB0IGFmdGVyIGNvbnRlbnQgaXMgbG9hZGVkXHJcbiAgICovXG5cblxuICBrZWVwUGxhY2Vob2xkZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuYXBwbHlGaWx0ZXJzKCdpc0tlZXBpbmdQbGFjZWhvbGRlcicsIHRoaXMuaXNMb2FkaW5nKCksIHRoaXMpO1xuICB9XG4gIC8qKlxyXG4gICAqIERlc3Ryb3kgdGhlIGNvbnRlbnRcclxuICAgKi9cblxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5oYXNTbGlkZSA9IGZhbHNlO1xuICAgIHRoaXMuc2xpZGUgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAodGhpcy5pbnN0YW5jZS5kaXNwYXRjaCgnY29udGVudERlc3Ryb3knLCB7XG4gICAgICBjb250ZW50OiB0aGlzXG4gICAgfSkuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucmVtb3ZlKCk7XG5cbiAgICBpZiAodGhpcy5wbGFjZWhvbGRlcikge1xuICAgICAgdGhpcy5wbGFjZWhvbGRlci5kZXN0cm95KCk7XG4gICAgICB0aGlzLnBsYWNlaG9sZGVyID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzSW1hZ2VDb250ZW50KCkgJiYgdGhpcy5lbGVtZW50KSB7XG4gICAgICB0aGlzLmVsZW1lbnQub25sb2FkID0gbnVsbDtcbiAgICAgIHRoaXMuZWxlbWVudC5vbmVycm9yID0gbnVsbDtcbiAgICAgIHRoaXMuZWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogRGlzcGxheSBlcnJvciBtZXNzYWdlXHJcbiAgICovXG5cblxuICBkaXNwbGF5RXJyb3IoKSB7XG4gICAgaWYgKHRoaXMuc2xpZGUpIHtcbiAgICAgIHZhciBfdGhpcyRpbnN0YW5jZSRvcHRpb24sIF90aGlzJGluc3RhbmNlJG9wdGlvbjI7XG5cbiAgICAgIGxldCBlcnJvck1zZ0VsID0gY3JlYXRlRWxlbWVudCgncHN3cF9fZXJyb3ItbXNnJywgJ2RpdicpO1xuICAgICAgZXJyb3JNc2dFbC5pbm5lclRleHQgPSAoX3RoaXMkaW5zdGFuY2Ukb3B0aW9uID0gKF90aGlzJGluc3RhbmNlJG9wdGlvbjIgPSB0aGlzLmluc3RhbmNlLm9wdGlvbnMpID09PSBudWxsIHx8IF90aGlzJGluc3RhbmNlJG9wdGlvbjIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF90aGlzJGluc3RhbmNlJG9wdGlvbjIuZXJyb3JNc2cpICE9PSBudWxsICYmIF90aGlzJGluc3RhbmNlJG9wdGlvbiAhPT0gdm9pZCAwID8gX3RoaXMkaW5zdGFuY2Ukb3B0aW9uIDogJyc7XG4gICAgICBlcnJvck1zZ0VsID1cbiAgICAgIC8qKiBAdHlwZSB7SFRNTERpdkVsZW1lbnR9ICovXG4gICAgICB0aGlzLmluc3RhbmNlLmFwcGx5RmlsdGVycygnY29udGVudEVycm9yRWxlbWVudCcsIGVycm9yTXNnRWwsIHRoaXMpO1xuICAgICAgdGhpcy5lbGVtZW50ID0gY3JlYXRlRWxlbWVudCgncHN3cF9fY29udGVudCBwc3dwX19lcnJvci1tc2ctY29udGFpbmVyJywgJ2RpdicpO1xuICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGVycm9yTXNnRWwpO1xuICAgICAgdGhpcy5zbGlkZS5jb250YWluZXIuaW5uZXJUZXh0ID0gJyc7XG4gICAgICB0aGlzLnNsaWRlLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpO1xuICAgICAgdGhpcy5zbGlkZS51cGRhdGVDb250ZW50U2l6ZSh0cnVlKTtcbiAgICAgIHRoaXMucmVtb3ZlUGxhY2Vob2xkZXIoKTtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogQXBwZW5kIHRoZSBjb250ZW50XHJcbiAgICovXG5cblxuICBhcHBlbmQoKSB7XG4gICAgaWYgKHRoaXMuaXNBdHRhY2hlZCB8fCAhdGhpcy5lbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5pc0F0dGFjaGVkID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLnN0YXRlID09PSBMT0FEX1NUQVRFLkVSUk9SKSB7XG4gICAgICB0aGlzLmRpc3BsYXlFcnJvcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmluc3RhbmNlLmRpc3BhdGNoKCdjb250ZW50QXBwZW5kJywge1xuICAgICAgY29udGVudDogdGhpc1xuICAgIH0pLmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdXBwb3J0c0RlY29kZSA9ICgnZGVjb2RlJyBpbiB0aGlzLmVsZW1lbnQpO1xuXG4gICAgaWYgKHRoaXMuaXNJbWFnZUNvbnRlbnQoKSkge1xuICAgICAgLy8gVXNlIGRlY29kZSgpIG9uIG5lYXJieSBzbGlkZXNcbiAgICAgIC8vXG4gICAgICAvLyBOZWFyYnkgc2xpZGUgaW1hZ2VzIGFyZSBpbiBET00gYW5kIG5vdCBoaWRkZW4gdmlhIGRpc3BsYXk6bm9uZS5cbiAgICAgIC8vIEhvd2V2ZXIsIHRoZXkgYXJlIHBsYWNlZCBvZmZzY3JlZW4gKHRvIHRoZSBsZWZ0IGFuZCByaWdodCBzaWRlKS5cbiAgICAgIC8vXG4gICAgICAvLyBTb21lIGJyb3dzZXJzIGRvIG5vdCBjb21wb3NpdGUgdGhlIGltYWdlIHVudGlsIGl0J3MgYWN0dWFsbHkgdmlzaWJsZSxcbiAgICAgIC8vIHVzaW5nIGRlY29kZSgpIGhlbHBzLlxuICAgICAgLy9cbiAgICAgIC8vIFlvdSBtaWdodCBhc2sgXCJ3aHkgZG9udCB5b3UganVzdCBkZWNvZGUoKSBhbmQgdGhlbiBhcHBlbmQgYWxsIGltYWdlc1wiLFxuICAgICAgLy8gdGhhdCdzIGJlY2F1c2UgSSB3YW50IHRvIHNob3cgaW1hZ2UgYmVmb3JlIGl0J3MgZnVsbHkgbG9hZGVkLFxuICAgICAgLy8gYXMgYnJvd3NlciBjYW4gcmVuZGVyIHBhcnRzIG9mIGltYWdlIHdoaWxlIGl0IGlzIGxvYWRpbmcuXG4gICAgICAvLyBXZSBkbyBub3QgZG8gdGhpcyBpbiBTYWZhcmkgZHVlIHRvIHBhcnRpYWwgbG9hZGluZyBidWcuXG4gICAgICBpZiAoc3VwcG9ydHNEZWNvZGUgJiYgdGhpcy5zbGlkZSAmJiAoIXRoaXMuc2xpZGUuaXNBY3RpdmUgfHwgaXNTYWZhcmkoKSkpIHtcbiAgICAgICAgdGhpcy5pc0RlY29kaW5nID0gdHJ1ZTsgLy8gcHVycG9zZWZ1bGx5IHVzaW5nIGZpbmFsbHkgaW5zdGVhZCBvZiB0aGVuLFxuICAgICAgICAvLyBhcyBpZiBzcmNzZXQgc2l6ZXMgY2hhbmdlcyBkeW5hbWljYWxseSAtIGl0IG1heSBjYXVzZSBkZWNvZGUgZXJyb3JcblxuICAgICAgICAvKiogQHR5cGUge0hUTUxJbWFnZUVsZW1lbnR9ICovXG5cbiAgICAgICAgdGhpcy5lbGVtZW50LmRlY29kZSgpLmNhdGNoKCgpID0+IHt9KS5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgICB0aGlzLmlzRGVjb2RpbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmFwcGVuZEltYWdlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hcHBlbmRJbWFnZSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5zbGlkZSAmJiAhdGhpcy5lbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgIHRoaXMuc2xpZGUuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIEFjdGl2YXRlIHRoZSBzbGlkZSxcclxuICAgKiBhY3RpdmUgc2xpZGUgaXMgZ2VuZXJhbGx5IHRoZSBjdXJyZW50IG9uZSxcclxuICAgKiBtZWFuaW5nIHRoZSB1c2VyIGNhbiBzZWUgaXQuXHJcbiAgICovXG5cblxuICBhY3RpdmF0ZSgpIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5kaXNwYXRjaCgnY29udGVudEFjdGl2YXRlJywge1xuICAgICAgY29udGVudDogdGhpc1xuICAgIH0pLmRlZmF1bHRQcmV2ZW50ZWQgfHwgIXRoaXMuc2xpZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0ltYWdlQ29udGVudCgpICYmIHRoaXMuaXNEZWNvZGluZyAmJiAhaXNTYWZhcmkoKSkge1xuICAgICAgLy8gYWRkIGltYWdlIHRvIHNsaWRlIHdoZW4gaXQgYmVjb21lcyBhY3RpdmUsXG4gICAgICAvLyBldmVuIGlmIGl0J3Mgbm90IGZpbmlzaGVkIGRlY29kaW5nXG4gICAgICB0aGlzLmFwcGVuZEltYWdlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzRXJyb3IoKSkge1xuICAgICAgdGhpcy5sb2FkKGZhbHNlLCB0cnVlKTsgLy8gdHJ5IHRvIHJlbG9hZFxuICAgIH1cblxuICAgIGlmICh0aGlzLnNsaWRlLmhvbGRlckVsZW1lbnQpIHtcbiAgICAgIHRoaXMuc2xpZGUuaG9sZGVyRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIERlYWN0aXZhdGUgdGhlIGNvbnRlbnRcclxuICAgKi9cblxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5pbnN0YW5jZS5kaXNwYXRjaCgnY29udGVudERlYWN0aXZhdGUnLCB7XG4gICAgICBjb250ZW50OiB0aGlzXG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5zbGlkZSAmJiB0aGlzLnNsaWRlLmhvbGRlckVsZW1lbnQpIHtcbiAgICAgIHRoaXMuc2xpZGUuaG9sZGVyRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogUmVtb3ZlIHRoZSBjb250ZW50IGZyb20gRE9NXHJcbiAgICovXG5cblxuICByZW1vdmUoKSB7XG4gICAgdGhpcy5pc0F0dGFjaGVkID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5pbnN0YW5jZS5kaXNwYXRjaCgnY29udGVudFJlbW92ZScsIHtcbiAgICAgIGNvbnRlbnQ6IHRoaXNcbiAgICB9KS5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZWxlbWVudCAmJiB0aGlzLmVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyICYmIHRoaXMucGxhY2Vob2xkZXIuZWxlbWVudCkge1xuICAgICAgdGhpcy5wbGFjZWhvbGRlci5lbGVtZW50LnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBBcHBlbmQgdGhlIGltYWdlIGNvbnRlbnQgdG8gc2xpZGUgY29udGFpbmVyXHJcbiAgICovXG5cblxuICBhcHBlbmRJbWFnZSgpIHtcbiAgICBpZiAoIXRoaXMuaXNBdHRhY2hlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmluc3RhbmNlLmRpc3BhdGNoKCdjb250ZW50QXBwZW5kSW1hZ2UnLCB7XG4gICAgICBjb250ZW50OiB0aGlzXG4gICAgfSkuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH0gLy8gZW5zdXJlIHRoYXQgZWxlbWVudCBleGlzdHMgYW5kIGlzIG5vdCBhbHJlYWR5IGFwcGVuZGVkXG5cblxuICAgIGlmICh0aGlzLnNsaWRlICYmIHRoaXMuZWxlbWVudCAmJiAhdGhpcy5lbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgIHRoaXMuc2xpZGUuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUgPT09IExPQURfU1RBVEUuTE9BREVEIHx8IHRoaXMuc3RhdGUgPT09IExPQURfU1RBVEUuRVJST1IpIHtcbiAgICAgIHRoaXMucmVtb3ZlUGxhY2Vob2xkZXIoKTtcbiAgICB9XG4gIH1cblxufVxuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi9jb250ZW50LmpzJykuZGVmYXVsdH0gQ29udGVudCAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi9zbGlkZS5qcycpLmRlZmF1bHR9IFNsaWRlICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NsaWRlLmpzJykuU2xpZGVEYXRhfSBTbGlkZURhdGEgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL2NvcmUvYmFzZS5qcycpLmRlZmF1bHR9IFBob3RvU3dpcGVCYXNlICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi9waG90b3N3aXBlLmpzJykuZGVmYXVsdH0gUGhvdG9Td2lwZSAqL1xuXG5jb25zdCBNSU5fU0xJREVTX1RPX0NBQ0hFID0gNTtcbi8qKlxyXG4gKiBMYXp5LWxvYWQgYW4gaW1hZ2VcclxuICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIGJvdGggYnkgTGlnaHRib3ggYW5kIFBob3RvU3dpcGUgY29yZSxcclxuICogdGh1cyBpdCBjYW4gYmUgY2FsbGVkIGJlZm9yZSBkaWFsb2cgaXMgb3BlbmVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1NsaWRlRGF0YX0gaXRlbURhdGEgRGF0YSBhYm91dCB0aGUgc2xpZGVcclxuICogQHBhcmFtIHtQaG90b1N3aXBlQmFzZX0gaW5zdGFuY2UgUGhvdG9Td2lwZSBvciBQaG90b1N3aXBlTGlnaHRib3ggaW5zdGFuY2VcclxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XHJcbiAqIEByZXR1cm5zIHtDb250ZW50fSBJbWFnZSB0aGF0IGlzIGJlaW5nIGRlY29kZWQgb3IgZmFsc2UuXHJcbiAqL1xuXG5mdW5jdGlvbiBsYXp5TG9hZERhdGEoaXRlbURhdGEsIGluc3RhbmNlLCBpbmRleCkge1xuICBjb25zdCBjb250ZW50ID0gaW5zdGFuY2UuY3JlYXRlQ29udGVudEZyb21EYXRhKGl0ZW1EYXRhLCBpbmRleCk7XG4gIC8qKiBAdHlwZSB7Wm9vbUxldmVsIHwgdW5kZWZpbmVkfSAqL1xuXG4gIGxldCB6b29tTGV2ZWw7XG4gIGNvbnN0IHtcbiAgICBvcHRpb25zXG4gIH0gPSBpbnN0YW5jZTsgLy8gV2UgbmVlZCB0byBrbm93IGRpbWVuc2lvbnMgb2YgdGhlIGltYWdlIHRvIHByZWxvYWQgaXQsXG4gIC8vIGFzIGl0IG1pZ2h0IHVzZSBzcmNzZXQsIGFuZCB3ZSBuZWVkIHRvIGRlZmluZSBzaXplc1xuXG4gIGlmIChvcHRpb25zKSB7XG4gICAgem9vbUxldmVsID0gbmV3IFpvb21MZXZlbChvcHRpb25zLCBpdGVtRGF0YSwgLTEpO1xuICAgIGxldCB2aWV3cG9ydFNpemU7XG5cbiAgICBpZiAoaW5zdGFuY2UucHN3cCkge1xuICAgICAgdmlld3BvcnRTaXplID0gaW5zdGFuY2UucHN3cC52aWV3cG9ydFNpemU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXdwb3J0U2l6ZSA9IGdldFZpZXdwb3J0U2l6ZShvcHRpb25zLCBpbnN0YW5jZSk7XG4gICAgfVxuXG4gICAgY29uc3QgcGFuQXJlYVNpemUgPSBnZXRQYW5BcmVhU2l6ZShvcHRpb25zLCB2aWV3cG9ydFNpemUsIGl0ZW1EYXRhLCBpbmRleCk7XG4gICAgem9vbUxldmVsLnVwZGF0ZShjb250ZW50LndpZHRoLCBjb250ZW50LmhlaWdodCwgcGFuQXJlYVNpemUpO1xuICB9XG5cbiAgY29udGVudC5sYXp5TG9hZCgpO1xuXG4gIGlmICh6b29tTGV2ZWwpIHtcbiAgICBjb250ZW50LnNldERpc3BsYXllZFNpemUoTWF0aC5jZWlsKGNvbnRlbnQud2lkdGggKiB6b29tTGV2ZWwuaW5pdGlhbCksIE1hdGguY2VpbChjb250ZW50LmhlaWdodCAqIHpvb21MZXZlbC5pbml0aWFsKSk7XG4gIH1cblxuICByZXR1cm4gY29udGVudDtcbn1cbi8qKlxyXG4gKiBMYXp5LWxvYWRzIHNwZWNpZmljIHNsaWRlLlxyXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgYm90aCBieSBMaWdodGJveCBhbmQgUGhvdG9Td2lwZSBjb3JlLFxyXG4gKiB0aHVzIGl0IGNhbiBiZSBjYWxsZWQgYmVmb3JlIGRpYWxvZyBpcyBvcGVuZWQuXHJcbiAqXHJcbiAqIEJ5IGRlZmF1bHQsIGl0IGxvYWRzIGltYWdlIGJhc2VkIG9uIHZpZXdwb3J0IHNpemUgYW5kIGluaXRpYWwgem9vbSBsZXZlbC5cclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFNsaWRlIGluZGV4XHJcbiAqIEBwYXJhbSB7UGhvdG9Td2lwZUJhc2V9IGluc3RhbmNlIFBob3RvU3dpcGUgb3IgUGhvdG9Td2lwZUxpZ2h0Ym94IGV2ZW50YWJsZSBpbnN0YW5jZVxyXG4gKiBAcmV0dXJucyB7Q29udGVudCB8IHVuZGVmaW5lZH1cclxuICovXG5cbmZ1bmN0aW9uIGxhenlMb2FkU2xpZGUoaW5kZXgsIGluc3RhbmNlKSB7XG4gIGNvbnN0IGl0ZW1EYXRhID0gaW5zdGFuY2UuZ2V0SXRlbURhdGEoaW5kZXgpO1xuXG4gIGlmIChpbnN0YW5jZS5kaXNwYXRjaCgnbGF6eUxvYWRTbGlkZScsIHtcbiAgICBpbmRleCxcbiAgICBpdGVtRGF0YVxuICB9KS5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIGxhenlMb2FkRGF0YShpdGVtRGF0YSwgaW5zdGFuY2UsIGluZGV4KTtcbn1cblxuY2xhc3MgQ29udGVudExvYWRlciB7XG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7UGhvdG9Td2lwZX0gcHN3cFxyXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwc3dwKSB7XG4gICAgdGhpcy5wc3dwID0gcHN3cDsgLy8gVG90YWwgYW1vdW50IG9mIGNhY2hlZCBpbWFnZXNcblxuICAgIHRoaXMubGltaXQgPSBNYXRoLm1heChwc3dwLm9wdGlvbnMucHJlbG9hZFswXSArIHBzd3Aub3B0aW9ucy5wcmVsb2FkWzFdICsgMSwgTUlOX1NMSURFU19UT19DQUNIRSk7XG4gICAgLyoqIEB0eXBlIHtDb250ZW50W119ICovXG5cbiAgICB0aGlzLl9jYWNoZWRJdGVtcyA9IFtdO1xuICB9XG4gIC8qKlxyXG4gICAqIExhenkgbG9hZCBuZWFyYnkgc2xpZGVzIGJhc2VkIG9uIGBwcmVsb2FkYCBvcHRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge251bWJlcn0gW2RpZmZdIERpZmZlcmVuY2UgYmV0d2VlbiBzbGlkZSBpbmRleGVzIHRoYXQgd2FzIGNoYW5nZWQgcmVjZW50bHksIG9yIDAuXHJcbiAgICovXG5cblxuICB1cGRhdGVMYXp5KGRpZmYpIHtcbiAgICBjb25zdCB7XG4gICAgICBwc3dwXG4gICAgfSA9IHRoaXM7XG5cbiAgICBpZiAocHN3cC5kaXNwYXRjaCgnbGF6eUxvYWQnKS5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qge1xuICAgICAgcHJlbG9hZFxuICAgIH0gPSBwc3dwLm9wdGlvbnM7XG4gICAgY29uc3QgaXNGb3J3YXJkID0gZGlmZiA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IGRpZmYgPj0gMDtcbiAgICBsZXQgaTsgLy8gcHJlbG9hZFsxXSAtIG51bSBpdGVtcyB0byBwcmVsb2FkIGluIGZvcndhcmQgZGlyZWN0aW9uXG5cbiAgICBmb3IgKGkgPSAwOyBpIDw9IHByZWxvYWRbMV07IGkrKykge1xuICAgICAgdGhpcy5sb2FkU2xpZGVCeUluZGV4KHBzd3AuY3VyckluZGV4ICsgKGlzRm9yd2FyZCA/IGkgOiAtaSkpO1xuICAgIH0gLy8gcHJlbG9hZFswXSAtIG51bSBpdGVtcyB0byBwcmVsb2FkIGluIGJhY2t3YXJkIGRpcmVjdGlvblxuXG5cbiAgICBmb3IgKGkgPSAxOyBpIDw9IHByZWxvYWRbMF07IGkrKykge1xuICAgICAgdGhpcy5sb2FkU2xpZGVCeUluZGV4KHBzd3AuY3VyckluZGV4ICsgKGlzRm9yd2FyZCA/IC1pIDogaSkpO1xuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5pdGlhbEluZGV4XHJcbiAgICovXG5cblxuICBsb2FkU2xpZGVCeUluZGV4KGluaXRpYWxJbmRleCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5wc3dwLmdldExvb3BlZEluZGV4KGluaXRpYWxJbmRleCk7IC8vIHRyeSB0byBnZXQgY2FjaGVkIGNvbnRlbnRcblxuICAgIGxldCBjb250ZW50ID0gdGhpcy5nZXRDb250ZW50QnlJbmRleChpbmRleCk7XG5cbiAgICBpZiAoIWNvbnRlbnQpIHtcbiAgICAgIC8vIG5vIGNhY2hlZCBjb250ZW50LCBzbyB0cnkgdG8gbG9hZCBmcm9tIHNjcmF0Y2g6XG4gICAgICBjb250ZW50ID0gbGF6eUxvYWRTbGlkZShpbmRleCwgdGhpcy5wc3dwKTsgLy8gaWYgY29udGVudCBjYW4gYmUgbG9hZGVkLCBhZGQgaXQgdG8gY2FjaGU6XG5cbiAgICAgIGlmIChjb250ZW50KSB7XG4gICAgICAgIHRoaXMuYWRkVG9DYWNoZShjb250ZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogQHBhcmFtIHtTbGlkZX0gc2xpZGVcclxuICAgKiBAcmV0dXJucyB7Q29udGVudH1cclxuICAgKi9cblxuXG4gIGdldENvbnRlbnRCeVNsaWRlKHNsaWRlKSB7XG4gICAgbGV0IGNvbnRlbnQgPSB0aGlzLmdldENvbnRlbnRCeUluZGV4KHNsaWRlLmluZGV4KTtcblxuICAgIGlmICghY29udGVudCkge1xuICAgICAgLy8gY3JlYXRlIGNvbnRlbnQgaWYgbm90IGZvdW5kIGluIGNhY2hlXG4gICAgICBjb250ZW50ID0gdGhpcy5wc3dwLmNyZWF0ZUNvbnRlbnRGcm9tRGF0YShzbGlkZS5kYXRhLCBzbGlkZS5pbmRleCk7XG4gICAgICB0aGlzLmFkZFRvQ2FjaGUoY29udGVudCk7XG4gICAgfSAvLyBhc3NpZ24gc2xpZGUgdG8gY29udGVudFxuXG5cbiAgICBjb250ZW50LnNldFNsaWRlKHNsaWRlKTtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICAvKipcclxuICAgKiBAcGFyYW0ge0NvbnRlbnR9IGNvbnRlbnRcclxuICAgKi9cblxuXG4gIGFkZFRvQ2FjaGUoY29udGVudCkge1xuICAgIC8vIG1vdmUgdG8gdGhlIGVuZCBvZiBhcnJheVxuICAgIHRoaXMucmVtb3ZlQnlJbmRleChjb250ZW50LmluZGV4KTtcblxuICAgIHRoaXMuX2NhY2hlZEl0ZW1zLnB1c2goY29udGVudCk7XG5cbiAgICBpZiAodGhpcy5fY2FjaGVkSXRlbXMubGVuZ3RoID4gdGhpcy5saW1pdCkge1xuICAgICAgLy8gRGVzdHJveSB0aGUgZmlyc3QgY29udGVudCB0aGF0J3Mgbm90IGF0dGFjaGVkXG4gICAgICBjb25zdCBpbmRleFRvUmVtb3ZlID0gdGhpcy5fY2FjaGVkSXRlbXMuZmluZEluZGV4KGl0ZW0gPT4ge1xuICAgICAgICByZXR1cm4gIWl0ZW0uaXNBdHRhY2hlZCAmJiAhaXRlbS5oYXNTbGlkZTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoaW5kZXhUb1JlbW92ZSAhPT0gLTEpIHtcbiAgICAgICAgY29uc3QgcmVtb3ZlZEl0ZW0gPSB0aGlzLl9jYWNoZWRJdGVtcy5zcGxpY2UoaW5kZXhUb1JlbW92ZSwgMSlbMF07XG5cbiAgICAgICAgcmVtb3ZlZEl0ZW0uZGVzdHJveSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBSZW1vdmVzIGFuIGltYWdlIGZyb20gY2FjaGUsIGRvZXMgbm90IGRlc3Ryb3koKSBpdCwganVzdCByZW1vdmVzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XHJcbiAgICovXG5cblxuICByZW1vdmVCeUluZGV4KGluZGV4KSB7XG4gICAgY29uc3QgaW5kZXhUb1JlbW92ZSA9IHRoaXMuX2NhY2hlZEl0ZW1zLmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaW5kZXggPT09IGluZGV4KTtcblxuICAgIGlmIChpbmRleFRvUmVtb3ZlICE9PSAtMSkge1xuICAgICAgdGhpcy5fY2FjaGVkSXRlbXMuc3BsaWNlKGluZGV4VG9SZW1vdmUsIDEpO1xuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcclxuICAgKiBAcmV0dXJucyB7Q29udGVudCB8IHVuZGVmaW5lZH1cclxuICAgKi9cblxuXG4gIGdldENvbnRlbnRCeUluZGV4KGluZGV4KSB7XG4gICAgcmV0dXJuIHRoaXMuX2NhY2hlZEl0ZW1zLmZpbmQoY29udGVudCA9PiBjb250ZW50LmluZGV4ID09PSBpbmRleCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuX2NhY2hlZEl0ZW1zLmZvckVhY2goY29udGVudCA9PiBjb250ZW50LmRlc3Ryb3koKSk7XG5cbiAgICB0aGlzLl9jYWNoZWRJdGVtcyA9IFtdO1xuICB9XG5cbn1cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoXCIuLi9waG90b3N3aXBlLmpzXCIpLmRlZmF1bHR9IFBob3RvU3dpcGUgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoXCIuLi9zbGlkZS9zbGlkZS5qc1wiKS5TbGlkZURhdGF9IFNsaWRlRGF0YSAqL1xuXG4vKipcclxuICogUGhvdG9Td2lwZSBiYXNlIGNsYXNzIHRoYXQgY2FuIHJldHJpZXZlIGRhdGEgYWJvdXQgZXZlcnkgc2xpZGUuXHJcbiAqIFNoYXJlZCBieSBQaG90b1N3aXBlIENvcmUgYW5kIFBob3RvU3dpcGUgTGlnaHRib3hcclxuICovXG5cbmNsYXNzIFBob3RvU3dpcGVCYXNlIGV4dGVuZHMgRXZlbnRhYmxlIHtcbiAgLyoqXHJcbiAgICogR2V0IHRvdGFsIG51bWJlciBvZiBzbGlkZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICovXG4gIGdldE51bUl0ZW1zKCkge1xuICAgIHZhciBfdGhpcyRvcHRpb25zO1xuXG4gICAgbGV0IG51bUl0ZW1zID0gMDtcbiAgICBjb25zdCBkYXRhU291cmNlID0gKF90aGlzJG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMpID09PSBudWxsIHx8IF90aGlzJG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF90aGlzJG9wdGlvbnMuZGF0YVNvdXJjZTtcblxuICAgIGlmIChkYXRhU291cmNlICYmICdsZW5ndGgnIGluIGRhdGFTb3VyY2UpIHtcbiAgICAgIC8vIG1heSBiZSBhbiBhcnJheSBvciBqdXN0IG9iamVjdCB3aXRoIGxlbmd0aCBwcm9wZXJ0eVxuICAgICAgbnVtSXRlbXMgPSBkYXRhU291cmNlLmxlbmd0aDtcbiAgICB9IGVsc2UgaWYgKGRhdGFTb3VyY2UgJiYgJ2dhbGxlcnknIGluIGRhdGFTb3VyY2UpIHtcbiAgICAgIC8vIHF1ZXJ5IERPTSBlbGVtZW50c1xuICAgICAgaWYgKCFkYXRhU291cmNlLml0ZW1zKSB7XG4gICAgICAgIGRhdGFTb3VyY2UuaXRlbXMgPSB0aGlzLl9nZXRHYWxsZXJ5RE9NRWxlbWVudHMoZGF0YVNvdXJjZS5nYWxsZXJ5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGFTb3VyY2UuaXRlbXMpIHtcbiAgICAgICAgbnVtSXRlbXMgPSBkYXRhU291cmNlLml0ZW1zLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9IC8vIGxlZ2FjeSBldmVudCwgYmVmb3JlIGZpbHRlcnMgd2VyZSBpbnRyb2R1Y2VkXG5cblxuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5kaXNwYXRjaCgnbnVtSXRlbXMnLCB7XG4gICAgICBkYXRhU291cmNlLFxuICAgICAgbnVtSXRlbXNcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5hcHBseUZpbHRlcnMoJ251bUl0ZW1zJywgZXZlbnQubnVtSXRlbXMsIGRhdGFTb3VyY2UpO1xuICB9XG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7U2xpZGVEYXRhfSBzbGlkZURhdGFcclxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcclxuICAgKiBAcmV0dXJucyB7Q29udGVudH1cclxuICAgKi9cblxuXG4gIGNyZWF0ZUNvbnRlbnRGcm9tRGF0YShzbGlkZURhdGEsIGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBDb250ZW50KHNsaWRlRGF0YSwgdGhpcywgaW5kZXgpO1xuICB9XG4gIC8qKlxyXG4gICAqIEdldCBpdGVtIGRhdGEgYnkgaW5kZXguXHJcbiAgICpcclxuICAgKiBcIml0ZW0gZGF0YVwiIHNob3VsZCBjb250YWluIG5vcm1hbGl6ZWQgaW5mb3JtYXRpb24gdGhhdCBQaG90b1N3aXBlIG5lZWRzIHRvIGdlbmVyYXRlIGEgc2xpZGUuXHJcbiAgICogRm9yIGV4YW1wbGUsIGl0IG1heSBjb250YWluIHByb3BlcnRpZXMgbGlrZVxyXG4gICAqIGBzcmNgLCBgc3Jjc2V0YCwgYHdgLCBgaGAsIHdoaWNoIHdpbGwgYmUgdXNlZCB0byBnZW5lcmF0ZSBhIHNsaWRlIHdpdGggaW1hZ2UuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcclxuICAgKiBAcmV0dXJucyB7U2xpZGVEYXRhfVxyXG4gICAqL1xuXG5cbiAgZ2V0SXRlbURhdGEoaW5kZXgpIHtcbiAgICB2YXIgX3RoaXMkb3B0aW9uczI7XG5cbiAgICBjb25zdCBkYXRhU291cmNlID0gKF90aGlzJG9wdGlvbnMyID0gdGhpcy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfdGhpcyRvcHRpb25zMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3RoaXMkb3B0aW9uczIuZGF0YVNvdXJjZTtcbiAgICAvKiogQHR5cGUge1NsaWRlRGF0YSB8IEhUTUxFbGVtZW50fSAqL1xuXG4gICAgbGV0IGRhdGFTb3VyY2VJdGVtID0ge307XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhU291cmNlKSkge1xuICAgICAgLy8gRGF0YXNvdXJjZSBpcyBhbiBhcnJheSBvZiBlbGVtZW50c1xuICAgICAgZGF0YVNvdXJjZUl0ZW0gPSBkYXRhU291cmNlW2luZGV4XTtcbiAgICB9IGVsc2UgaWYgKGRhdGFTb3VyY2UgJiYgJ2dhbGxlcnknIGluIGRhdGFTb3VyY2UpIHtcbiAgICAgIC8vIGRhdGFTb3VyY2UgaGFzIGdhbGxlcnkgcHJvcGVydHksXG4gICAgICAvLyB0aHVzIGl0IHdhcyBjcmVhdGVkIGJ5IExpZ2h0Ym94LCBiYXNlZCBvblxuICAgICAgLy8gZ2FsbGVyeSBhbmQgY2hpbGRyZW4gb3B0aW9uc1xuICAgICAgLy8gcXVlcnkgRE9NIGVsZW1lbnRzXG4gICAgICBpZiAoIWRhdGFTb3VyY2UuaXRlbXMpIHtcbiAgICAgICAgZGF0YVNvdXJjZS5pdGVtcyA9IHRoaXMuX2dldEdhbGxlcnlET01FbGVtZW50cyhkYXRhU291cmNlLmdhbGxlcnkpO1xuICAgICAgfVxuXG4gICAgICBkYXRhU291cmNlSXRlbSA9IGRhdGFTb3VyY2UuaXRlbXNbaW5kZXhdO1xuICAgIH1cblxuICAgIGxldCBpdGVtRGF0YSA9IGRhdGFTb3VyY2VJdGVtO1xuXG4gICAgaWYgKGl0ZW1EYXRhIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgaXRlbURhdGEgPSB0aGlzLl9kb21FbGVtZW50VG9JdGVtRGF0YShpdGVtRGF0YSk7XG4gICAgfSAvLyBEaXNwYXRjaGluZyB0aGUgaXRlbURhdGEgZXZlbnQsXG4gICAgLy8gaXQncyBhIGxlZ2FjeSB2ZXJpb24gYmVmb3JlIGZpbHRlcnMgd2VyZSBpbnRyb2R1Y2VkXG5cblxuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5kaXNwYXRjaCgnaXRlbURhdGEnLCB7XG4gICAgICBpdGVtRGF0YTogaXRlbURhdGEgfHwge30sXG4gICAgICBpbmRleFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmFwcGx5RmlsdGVycygnaXRlbURhdGEnLCBldmVudC5pdGVtRGF0YSwgaW5kZXgpO1xuICB9XG4gIC8qKlxyXG4gICAqIEdldCBhcnJheSBvZiBnYWxsZXJ5IERPTSBlbGVtZW50cyxcclxuICAgKiBiYXNlZCBvbiBjaGlsZFNlbGVjdG9yIGFuZCBnYWxsZXJ5IGVsZW1lbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBnYWxsZXJ5RWxlbWVudFxyXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudFtdfVxyXG4gICAqL1xuXG5cbiAgX2dldEdhbGxlcnlET01FbGVtZW50cyhnYWxsZXJ5RWxlbWVudCkge1xuICAgIHZhciBfdGhpcyRvcHRpb25zMywgX3RoaXMkb3B0aW9uczQ7XG5cbiAgICBpZiAoKF90aGlzJG9wdGlvbnMzID0gdGhpcy5vcHRpb25zKSAhPT0gbnVsbCAmJiBfdGhpcyRvcHRpb25zMyAhPT0gdm9pZCAwICYmIF90aGlzJG9wdGlvbnMzLmNoaWxkcmVuIHx8IChfdGhpcyRvcHRpb25zNCA9IHRoaXMub3B0aW9ucykgIT09IG51bGwgJiYgX3RoaXMkb3B0aW9uczQgIT09IHZvaWQgMCAmJiBfdGhpcyRvcHRpb25zNC5jaGlsZFNlbGVjdG9yKSB7XG4gICAgICByZXR1cm4gZ2V0RWxlbWVudHNGcm9tT3B0aW9uKHRoaXMub3B0aW9ucy5jaGlsZHJlbiwgdGhpcy5vcHRpb25zLmNoaWxkU2VsZWN0b3IsIGdhbGxlcnlFbGVtZW50KSB8fCBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4gW2dhbGxlcnlFbGVtZW50XTtcbiAgfVxuICAvKipcclxuICAgKiBDb252ZXJ0cyBET00gZWxlbWVudCB0byBpdGVtIGRhdGEgb2JqZWN0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBET00gZWxlbWVudFxyXG4gICAqIEByZXR1cm5zIHtTbGlkZURhdGF9XHJcbiAgICovXG5cblxuICBfZG9tRWxlbWVudFRvSXRlbURhdGEoZWxlbWVudCkge1xuICAgIC8qKiBAdHlwZSB7U2xpZGVEYXRhfSAqL1xuICAgIGNvbnN0IGl0ZW1EYXRhID0ge1xuICAgICAgZWxlbWVudFxuICAgIH07XG4gICAgY29uc3QgbGlua0VsID1cbiAgICAvKiogQHR5cGUge0hUTUxBbmNob3JFbGVtZW50fSAqL1xuICAgIGVsZW1lbnQudGFnTmFtZSA9PT0gJ0EnID8gZWxlbWVudCA6IGVsZW1lbnQucXVlcnlTZWxlY3RvcignYScpO1xuXG4gICAgaWYgKGxpbmtFbCkge1xuICAgICAgLy8gc3JjIGNvbWVzIGZyb20gZGF0YS1wc3dwLXNyYyBhdHRyaWJ1dGUsXG4gICAgICAvLyBpZiBpdCdzIGVtcHR5IGxpbmsgaHJlZiBpcyB1c2VkXG4gICAgICBpdGVtRGF0YS5zcmMgPSBsaW5rRWwuZGF0YXNldC5wc3dwU3JjIHx8IGxpbmtFbC5ocmVmO1xuXG4gICAgICBpZiAobGlua0VsLmRhdGFzZXQucHN3cFNyY3NldCkge1xuICAgICAgICBpdGVtRGF0YS5zcmNzZXQgPSBsaW5rRWwuZGF0YXNldC5wc3dwU3Jjc2V0O1xuICAgICAgfVxuXG4gICAgICBpdGVtRGF0YS53aWR0aCA9IGxpbmtFbC5kYXRhc2V0LnBzd3BXaWR0aCA/IHBhcnNlSW50KGxpbmtFbC5kYXRhc2V0LnBzd3BXaWR0aCwgMTApIDogMDtcbiAgICAgIGl0ZW1EYXRhLmhlaWdodCA9IGxpbmtFbC5kYXRhc2V0LnBzd3BIZWlnaHQgPyBwYXJzZUludChsaW5rRWwuZGF0YXNldC5wc3dwSGVpZ2h0LCAxMCkgOiAwOyAvLyBzdXBwb3J0IGxlZ2FjeSB3ICYgaCBwcm9wZXJ0aWVzXG5cbiAgICAgIGl0ZW1EYXRhLncgPSBpdGVtRGF0YS53aWR0aDtcbiAgICAgIGl0ZW1EYXRhLmggPSBpdGVtRGF0YS5oZWlnaHQ7XG5cbiAgICAgIGlmIChsaW5rRWwuZGF0YXNldC5wc3dwVHlwZSkge1xuICAgICAgICBpdGVtRGF0YS50eXBlID0gbGlua0VsLmRhdGFzZXQucHN3cFR5cGU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRodW1ibmFpbEVsID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcblxuICAgICAgaWYgKHRodW1ibmFpbEVsKSB7XG4gICAgICAgIHZhciBfdGh1bWJuYWlsRWwkZ2V0QXR0cmk7XG5cbiAgICAgICAgLy8gbXNyYyBpcyBVUkwgdG8gcGxhY2Vob2xkZXIgaW1hZ2UgdGhhdCdzIGRpc3BsYXllZCBiZWZvcmUgbGFyZ2UgaW1hZ2UgaXMgbG9hZGVkXG4gICAgICAgIC8vIGJ5IGRlZmF1bHQgaXQncyBkaXNwbGF5ZWQgb25seSBmb3IgdGhlIGZpcnN0IHNsaWRlXG4gICAgICAgIGl0ZW1EYXRhLm1zcmMgPSB0aHVtYm5haWxFbC5jdXJyZW50U3JjIHx8IHRodW1ibmFpbEVsLnNyYztcbiAgICAgICAgaXRlbURhdGEuYWx0ID0gKF90aHVtYm5haWxFbCRnZXRBdHRyaSA9IHRodW1ibmFpbEVsLmdldEF0dHJpYnV0ZSgnYWx0JykpICE9PSBudWxsICYmIF90aHVtYm5haWxFbCRnZXRBdHRyaSAhPT0gdm9pZCAwID8gX3RodW1ibmFpbEVsJGdldEF0dHJpIDogJyc7XG4gICAgICB9XG5cbiAgICAgIGlmIChsaW5rRWwuZGF0YXNldC5wc3dwQ3JvcHBlZCB8fCBsaW5rRWwuZGF0YXNldC5jcm9wcGVkKSB7XG4gICAgICAgIGl0ZW1EYXRhLnRodW1iQ3JvcHBlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuYXBwbHlGaWx0ZXJzKCdkb21JdGVtRGF0YScsIGl0ZW1EYXRhLCBlbGVtZW50LCBsaW5rRWwpO1xuICB9XG4gIC8qKlxyXG4gICAqIExhenktbG9hZCBieSBzbGlkZSBkYXRhXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1NsaWRlRGF0YX0gaXRlbURhdGEgRGF0YSBhYm91dCB0aGUgc2xpZGVcclxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcclxuICAgKiBAcmV0dXJucyB7Q29udGVudH0gSW1hZ2UgdGhhdCBpcyBiZWluZyBkZWNvZGVkIG9yIGZhbHNlLlxyXG4gICAqL1xuXG5cbiAgbGF6eUxvYWREYXRhKGl0ZW1EYXRhLCBpbmRleCkge1xuICAgIHJldHVybiBsYXp5TG9hZERhdGEoaXRlbURhdGEsIHRoaXMsIGluZGV4KTtcbiAgfVxuXG59XG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3Bob3Rvc3dpcGUuanMnKS5kZWZhdWx0fSBQaG90b1N3aXBlICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NsaWRlL2dldC10aHVtYi1ib3VuZHMuanMnKS5Cb3VuZHN9IEJvdW5kcyAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi91dGlsL2FuaW1hdGlvbnMuanMnKS5BbmltYXRpb25Qcm9wc30gQW5pbWF0aW9uUHJvcHMgKi9cbi8vIHNvbWUgYnJvd3NlcnMgZG8gbm90IHBhaW50XG4vLyBlbGVtZW50cyB3aGljaCBvcGFjaXR5IGlzIHNldCB0byAwLFxuLy8gc2luY2Ugd2UgbmVlZCB0byBwcmUtcmVuZGVyIGVsZW1lbnRzIGZvciB0aGUgYW5pbWF0aW9uIC1cbi8vIHdlIHNldCBpdCB0byB0aGUgbWluaW11bSBhbW91bnRcblxuY29uc3QgTUlOX09QQUNJVFkgPSAwLjAwMztcbi8qKlxyXG4gKiBNYW5hZ2VzIG9wZW5pbmcgYW5kIGNsb3NpbmcgdHJhbnNpdGlvbnMgb2YgdGhlIFBob3RvU3dpcGUuXHJcbiAqXHJcbiAqIEl0IGNhbiBwZXJmb3JtIHpvb20sIGZhZGUgb3Igbm8gdHJhbnNpdGlvbi5cclxuICovXG5cbmNsYXNzIE9wZW5lciB7XG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7UGhvdG9Td2lwZX0gcHN3cFxyXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwc3dwKSB7XG4gICAgdGhpcy5wc3dwID0gcHN3cDtcbiAgICB0aGlzLmlzQ2xvc2VkID0gdHJ1ZTtcbiAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgIHRoaXMuaXNDbG9zaW5nID0gZmFsc2U7XG4gICAgdGhpcy5pc09wZW5pbmcgPSBmYWxzZTtcbiAgICAvKipcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyIHwgZmFsc2UgfCB1bmRlZmluZWR9XHJcbiAgICAgKi9cblxuICAgIHRoaXMuX2R1cmF0aW9uID0gdW5kZWZpbmVkO1xuICAgIC8qKiBAcHJpdmF0ZSAqL1xuXG4gICAgdGhpcy5fdXNlQW5pbWF0aW9uID0gZmFsc2U7XG4gICAgLyoqIEBwcml2YXRlICovXG5cbiAgICB0aGlzLl9jcm9wcGVkWm9vbSA9IGZhbHNlO1xuICAgIC8qKiBAcHJpdmF0ZSAqL1xuXG4gICAgdGhpcy5fYW5pbWF0ZVJvb3RPcGFjaXR5ID0gZmFsc2U7XG4gICAgLyoqIEBwcml2YXRlICovXG5cbiAgICB0aGlzLl9hbmltYXRlQmdPcGFjaXR5ID0gZmFsc2U7XG4gICAgLyoqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHR5cGUgeyBIVE1MRGl2RWxlbWVudCB8IEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsIHwgdW5kZWZpbmVkIH1cclxuICAgICAqL1xuXG4gICAgdGhpcy5fcGxhY2Vob2xkZXIgPSB1bmRlZmluZWQ7XG4gICAgLyoqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHR5cGUgeyBIVE1MRGl2RWxlbWVudCB8IHVuZGVmaW5lZCB9XHJcbiAgICAgKi9cblxuICAgIHRoaXMuX29wYWNpdHlFbGVtZW50ID0gdW5kZWZpbmVkO1xuICAgIC8qKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEB0eXBlIHsgSFRNTERpdkVsZW1lbnQgfCB1bmRlZmluZWQgfVxyXG4gICAgICovXG5cbiAgICB0aGlzLl9jcm9wQ29udGFpbmVyMSA9IHVuZGVmaW5lZDtcbiAgICAvKipcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAdHlwZSB7IEhUTUxFbGVtZW50IHwgbnVsbCB8IHVuZGVmaW5lZCB9XHJcbiAgICAgKi9cblxuICAgIHRoaXMuX2Nyb3BDb250YWluZXIyID0gdW5kZWZpbmVkO1xuICAgIC8qKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEB0eXBlIHtCb3VuZHMgfCB1bmRlZmluZWR9XHJcbiAgICAgKi9cblxuICAgIHRoaXMuX3RodW1iQm91bmRzID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3ByZXBhcmVPcGVuID0gdGhpcy5fcHJlcGFyZU9wZW4uYmluZCh0aGlzKTsgLy8gT3ZlcnJpZGUgaW5pdGlhbCB6b29tIGFuZCBwYW4gcG9zaXRpb25cblxuICAgIHBzd3Aub24oJ2ZpcnN0Wm9vbVBhbicsIHRoaXMuX3ByZXBhcmVPcGVuKTtcbiAgfVxuXG4gIG9wZW4oKSB7XG4gICAgdGhpcy5fcHJlcGFyZU9wZW4oKTtcblxuICAgIHRoaXMuX3N0YXJ0KCk7XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICBpZiAodGhpcy5pc0Nsb3NlZCB8fCB0aGlzLmlzQ2xvc2luZyB8fCB0aGlzLmlzT3BlbmluZykge1xuICAgICAgLy8gaWYgd2UgY2xvc2UgZHVyaW5nIG9wZW5pbmcgYW5pbWF0aW9uXG4gICAgICAvLyBmb3Igbm93IGRvIG5vdGhpbmcsXG4gICAgICAvLyBicm93c2VycyBhcmVuJ3QgZ29vZCBhdCBjaGFuZ2luZyB0aGUgZGlyZWN0aW9uIG9mIHRoZSBDU1MgdHJhbnNpdGlvblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNsaWRlID0gdGhpcy5wc3dwLmN1cnJTbGlkZTtcbiAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xuICAgIHRoaXMuaXNPcGVuaW5nID0gZmFsc2U7XG4gICAgdGhpcy5pc0Nsb3NpbmcgPSB0cnVlO1xuICAgIHRoaXMuX2R1cmF0aW9uID0gdGhpcy5wc3dwLm9wdGlvbnMuaGlkZUFuaW1hdGlvbkR1cmF0aW9uO1xuXG4gICAgaWYgKHNsaWRlICYmIHNsaWRlLmN1cnJab29tTGV2ZWwgKiBzbGlkZS53aWR0aCA+PSB0aGlzLnBzd3Aub3B0aW9ucy5tYXhXaWR0aFRvQW5pbWF0ZSkge1xuICAgICAgdGhpcy5fZHVyYXRpb24gPSAwO1xuICAgIH1cblxuICAgIHRoaXMuX2FwcGx5U3RhcnRQcm9wcygpO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLl9zdGFydCgpO1xuICAgIH0sIHRoaXMuX2Nyb3BwZWRab29tID8gMzAgOiAwKTtcbiAgfVxuICAvKiogQHByaXZhdGUgKi9cblxuXG4gIF9wcmVwYXJlT3BlbigpIHtcbiAgICB0aGlzLnBzd3Aub2ZmKCdmaXJzdFpvb21QYW4nLCB0aGlzLl9wcmVwYXJlT3Blbik7XG5cbiAgICBpZiAoIXRoaXMuaXNPcGVuaW5nKSB7XG4gICAgICBjb25zdCBzbGlkZSA9IHRoaXMucHN3cC5jdXJyU2xpZGU7XG4gICAgICB0aGlzLmlzT3BlbmluZyA9IHRydWU7XG4gICAgICB0aGlzLmlzQ2xvc2luZyA9IGZhbHNlO1xuICAgICAgdGhpcy5fZHVyYXRpb24gPSB0aGlzLnBzd3Aub3B0aW9ucy5zaG93QW5pbWF0aW9uRHVyYXRpb247XG5cbiAgICAgIGlmIChzbGlkZSAmJiBzbGlkZS56b29tTGV2ZWxzLmluaXRpYWwgKiBzbGlkZS53aWR0aCA+PSB0aGlzLnBzd3Aub3B0aW9ucy5tYXhXaWR0aFRvQW5pbWF0ZSkge1xuICAgICAgICB0aGlzLl9kdXJhdGlvbiA9IDA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2FwcGx5U3RhcnRQcm9wcygpO1xuICAgIH1cbiAgfVxuICAvKiogQHByaXZhdGUgKi9cblxuXG4gIF9hcHBseVN0YXJ0UHJvcHMoKSB7XG4gICAgY29uc3Qge1xuICAgICAgcHN3cFxuICAgIH0gPSB0aGlzO1xuICAgIGNvbnN0IHNsaWRlID0gdGhpcy5wc3dwLmN1cnJTbGlkZTtcbiAgICBjb25zdCB7XG4gICAgICBvcHRpb25zXG4gICAgfSA9IHBzd3A7XG5cbiAgICBpZiAob3B0aW9ucy5zaG93SGlkZUFuaW1hdGlvblR5cGUgPT09ICdmYWRlJykge1xuICAgICAgb3B0aW9ucy5zaG93SGlkZU9wYWNpdHkgPSB0cnVlO1xuICAgICAgdGhpcy5fdGh1bWJCb3VuZHMgPSB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLnNob3dIaWRlQW5pbWF0aW9uVHlwZSA9PT0gJ25vbmUnKSB7XG4gICAgICBvcHRpb25zLnNob3dIaWRlT3BhY2l0eSA9IGZhbHNlO1xuICAgICAgdGhpcy5fZHVyYXRpb24gPSAwO1xuICAgICAgdGhpcy5fdGh1bWJCb3VuZHMgPSB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzT3BlbmluZyAmJiBwc3dwLl9pbml0aWFsVGh1bWJCb3VuZHMpIHtcbiAgICAgIC8vIFVzZSBpbml0aWFsIGJvdW5kcyBpZiBkZWZpbmVkXG4gICAgICB0aGlzLl90aHVtYkJvdW5kcyA9IHBzd3AuX2luaXRpYWxUaHVtYkJvdW5kcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdGh1bWJCb3VuZHMgPSB0aGlzLnBzd3AuZ2V0VGh1bWJCb3VuZHMoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9wbGFjZWhvbGRlciA9IHNsaWRlID09PSBudWxsIHx8IHNsaWRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBzbGlkZS5nZXRQbGFjZWhvbGRlckVsZW1lbnQoKTtcbiAgICBwc3dwLmFuaW1hdGlvbnMuc3RvcEFsbCgpOyAvLyBEaXNjYXJkIGFuaW1hdGlvbnMgd2hlbiBkdXJhdGlvbiBpcyBsZXNzIHRoYW4gNTBtc1xuXG4gICAgdGhpcy5fdXNlQW5pbWF0aW9uID0gQm9vbGVhbih0aGlzLl9kdXJhdGlvbiAmJiB0aGlzLl9kdXJhdGlvbiA+IDUwKTtcbiAgICB0aGlzLl9hbmltYXRlWm9vbSA9IEJvb2xlYW4odGhpcy5fdGh1bWJCb3VuZHMpICYmIChzbGlkZSA9PT0gbnVsbCB8fCBzbGlkZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogc2xpZGUuY29udGVudC51c2VQbGFjZWhvbGRlcigpKSAmJiAoIXRoaXMuaXNDbG9zaW5nIHx8ICFwc3dwLm1haW5TY3JvbGwuaXNTaGlmdGVkKCkpO1xuXG4gICAgaWYgKCF0aGlzLl9hbmltYXRlWm9vbSkge1xuICAgICAgdGhpcy5fYW5pbWF0ZVJvb3RPcGFjaXR5ID0gdHJ1ZTtcblxuICAgICAgaWYgKHRoaXMuaXNPcGVuaW5nICYmIHNsaWRlKSB7XG4gICAgICAgIHNsaWRlLnpvb21BbmRQYW5Ub0luaXRpYWwoKTtcbiAgICAgICAgc2xpZGUuYXBwbHlDdXJyZW50Wm9vbVBhbigpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgX29wdGlvbnMkc2hvd0hpZGVPcGFjO1xuXG4gICAgICB0aGlzLl9hbmltYXRlUm9vdE9wYWNpdHkgPSAoX29wdGlvbnMkc2hvd0hpZGVPcGFjID0gb3B0aW9ucy5zaG93SGlkZU9wYWNpdHkpICE9PSBudWxsICYmIF9vcHRpb25zJHNob3dIaWRlT3BhYyAhPT0gdm9pZCAwID8gX29wdGlvbnMkc2hvd0hpZGVPcGFjIDogZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5fYW5pbWF0ZUJnT3BhY2l0eSA9ICF0aGlzLl9hbmltYXRlUm9vdE9wYWNpdHkgJiYgdGhpcy5wc3dwLm9wdGlvbnMuYmdPcGFjaXR5ID4gTUlOX09QQUNJVFk7XG4gICAgdGhpcy5fb3BhY2l0eUVsZW1lbnQgPSB0aGlzLl9hbmltYXRlUm9vdE9wYWNpdHkgPyBwc3dwLmVsZW1lbnQgOiBwc3dwLmJnO1xuXG4gICAgaWYgKCF0aGlzLl91c2VBbmltYXRpb24pIHtcbiAgICAgIHRoaXMuX2R1cmF0aW9uID0gMDtcbiAgICAgIHRoaXMuX2FuaW1hdGVab29tID0gZmFsc2U7XG4gICAgICB0aGlzLl9hbmltYXRlQmdPcGFjaXR5ID0gZmFsc2U7XG4gICAgICB0aGlzLl9hbmltYXRlUm9vdE9wYWNpdHkgPSB0cnVlO1xuXG4gICAgICBpZiAodGhpcy5pc09wZW5pbmcpIHtcbiAgICAgICAgaWYgKHBzd3AuZWxlbWVudCkge1xuICAgICAgICAgIHBzd3AuZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gU3RyaW5nKE1JTl9PUEFDSVRZKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBzd3AuYXBwbHlCZ09wYWNpdHkoMSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fYW5pbWF0ZVpvb20gJiYgdGhpcy5fdGh1bWJCb3VuZHMgJiYgdGhpcy5fdGh1bWJCb3VuZHMuaW5uZXJSZWN0KSB7XG4gICAgICB2YXIgX3RoaXMkcHN3cCRjdXJyU2xpZGU7XG5cbiAgICAgIC8vIFByb3BlcnRpZXMgYXJlIHVzZWQgd2hlbiBhbmltYXRpb24gZnJvbSBjcm9wcGVkIHRodW1ibmFpbFxuICAgICAgdGhpcy5fY3JvcHBlZFpvb20gPSB0cnVlO1xuICAgICAgdGhpcy5fY3JvcENvbnRhaW5lcjEgPSB0aGlzLnBzd3AuY29udGFpbmVyO1xuICAgICAgdGhpcy5fY3JvcENvbnRhaW5lcjIgPSAoX3RoaXMkcHN3cCRjdXJyU2xpZGUgPSB0aGlzLnBzd3AuY3VyclNsaWRlKSA9PT0gbnVsbCB8fCBfdGhpcyRwc3dwJGN1cnJTbGlkZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3RoaXMkcHN3cCRjdXJyU2xpZGUuaG9sZGVyRWxlbWVudDtcblxuICAgICAgaWYgKHBzd3AuY29udGFpbmVyKSB7XG4gICAgICAgIHBzd3AuY29udGFpbmVyLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAgIHBzd3AuY29udGFpbmVyLnN0eWxlLndpZHRoID0gcHN3cC52aWV3cG9ydFNpemUueCArICdweCc7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2Nyb3BwZWRab29tID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNPcGVuaW5nKSB7XG4gICAgICAvLyBBcHBseSBzdHlsZXMgYmVmb3JlIG9wZW5pbmcgdHJhbnNpdGlvblxuICAgICAgaWYgKHRoaXMuX2FuaW1hdGVSb290T3BhY2l0eSkge1xuICAgICAgICBpZiAocHN3cC5lbGVtZW50KSB7XG4gICAgICAgICAgcHN3cC5lbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBTdHJpbmcoTUlOX09QQUNJVFkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHN3cC5hcHBseUJnT3BhY2l0eSgxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLl9hbmltYXRlQmdPcGFjaXR5ICYmIHBzd3AuYmcpIHtcbiAgICAgICAgICBwc3dwLmJnLnN0eWxlLm9wYWNpdHkgPSBTdHJpbmcoTUlOX09QQUNJVFkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBzd3AuZWxlbWVudCkge1xuICAgICAgICAgIHBzd3AuZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9hbmltYXRlWm9vbSkge1xuICAgICAgICB0aGlzLl9zZXRDbG9zZWRTdGF0ZVpvb21QYW4oKTtcblxuICAgICAgICBpZiAodGhpcy5fcGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAvLyB0ZWxsIGJyb3dzZXIgdGhhdCB3ZSBwbGFuIHRvIGFuaW1hdGUgdGhlIHBsYWNlaG9sZGVyXG4gICAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXIuc3R5bGUud2lsbENoYW5nZSA9ICd0cmFuc2Zvcm0nOyAvLyBoaWRlIHBsYWNlaG9sZGVyIHRvIGFsbG93IGhpZGluZyBvZlxuICAgICAgICAgIC8vIGVsZW1lbnRzIHRoYXQgb3ZlcmxhcCBpdCAoc3VjaCBhcyBpY29ucyBvdmVyIHRoZSB0aHVtYm5haWwpXG5cbiAgICAgICAgICB0aGlzLl9wbGFjZWhvbGRlci5zdHlsZS5vcGFjaXR5ID0gU3RyaW5nKE1JTl9PUEFDSVRZKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5pc0Nsb3NpbmcpIHtcbiAgICAgIC8vIGhpZGUgbmVhcmJ5IHNsaWRlcyB0byBtYWtlIHN1cmUgdGhhdFxuICAgICAgLy8gdGhleSBhcmUgbm90IHBhaW50ZWQgZHVyaW5nIHRoZSB0cmFuc2l0aW9uXG4gICAgICBpZiAocHN3cC5tYWluU2Nyb2xsLml0ZW1Ib2xkZXJzWzBdKSB7XG4gICAgICAgIHBzd3AubWFpblNjcm9sbC5pdGVtSG9sZGVyc1swXS5lbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgfVxuXG4gICAgICBpZiAocHN3cC5tYWluU2Nyb2xsLml0ZW1Ib2xkZXJzWzJdKSB7XG4gICAgICAgIHBzd3AubWFpblNjcm9sbC5pdGVtSG9sZGVyc1syXS5lbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fY3JvcHBlZFpvb20pIHtcbiAgICAgICAgaWYgKHBzd3AubWFpblNjcm9sbC54ICE9PSAwKSB7XG4gICAgICAgICAgLy8gc2hpZnQgdGhlIG1haW4gc2Nyb2xsZXIgdG8gemVybyBwb3NpdGlvblxuICAgICAgICAgIHBzd3AubWFpblNjcm9sbC5yZXNldFBvc2l0aW9uKCk7XG4gICAgICAgICAgcHN3cC5tYWluU2Nyb2xsLnJlc2l6ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qKiBAcHJpdmF0ZSAqL1xuXG5cbiAgX3N0YXJ0KCkge1xuICAgIGlmICh0aGlzLmlzT3BlbmluZyAmJiB0aGlzLl91c2VBbmltYXRpb24gJiYgdGhpcy5fcGxhY2Vob2xkZXIgJiYgdGhpcy5fcGxhY2Vob2xkZXIudGFnTmFtZSA9PT0gJ0lNRycpIHtcbiAgICAgIC8vIFRvIGVuc3VyZSBzbW9vdGggYW5pbWF0aW9uXG4gICAgICAvLyB3ZSB3YWl0IHRpbGwgdGhlIGN1cnJlbnQgc2xpZGUgaW1hZ2UgcGxhY2Vob2xkZXIgaXMgZGVjb2RlZCxcbiAgICAgIC8vIGJ1dCBubyBsb25nZXIgdGhhbiAyNTBtcyxcbiAgICAgIC8vIGFuZCBubyBzaG9ydGVyIHRoYW4gNTBtc1xuICAgICAgLy8gKGp1c3QgdXNpbmcgcmVxdWVzdGFuaW1hdGlvbmZyYW1lIGlzIG5vdCBlbm91Z2ggaW4gRmlyZWZveCxcbiAgICAgIC8vIGZvciBzb21lIHJlYXNvbilcbiAgICAgIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICBsZXQgZGVjb2RlZCA9IGZhbHNlO1xuICAgICAgICBsZXQgaXNEZWxheWluZyA9IHRydWU7XG4gICAgICAgIGRlY29kZUltYWdlKFxuICAgICAgICAvKiogQHR5cGUge0hUTUxJbWFnZUVsZW1lbnR9ICovXG4gICAgICAgIHRoaXMuX3BsYWNlaG9sZGVyKS5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgICBkZWNvZGVkID0gdHJ1ZTtcblxuICAgICAgICAgIGlmICghaXNEZWxheWluZykge1xuICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpc0RlbGF5aW5nID0gZmFsc2U7XG5cbiAgICAgICAgICBpZiAoZGVjb2RlZCkge1xuICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDUwKTtcbiAgICAgICAgc2V0VGltZW91dChyZXNvbHZlLCAyNTApO1xuICAgICAgfSkuZmluYWxseSgoKSA9PiB0aGlzLl9pbml0aWF0ZSgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faW5pdGlhdGUoKTtcbiAgICB9XG4gIH1cbiAgLyoqIEBwcml2YXRlICovXG5cblxuICBfaW5pdGlhdGUoKSB7XG4gICAgdmFyIF90aGlzJHBzd3AkZWxlbWVudCwgX3RoaXMkcHN3cCRlbGVtZW50MjtcblxuICAgIChfdGhpcyRwc3dwJGVsZW1lbnQgPSB0aGlzLnBzd3AuZWxlbWVudCkgPT09IG51bGwgfHwgX3RoaXMkcHN3cCRlbGVtZW50ID09PSB2b2lkIDAgfHwgX3RoaXMkcHN3cCRlbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCctLXBzd3AtdHJhbnNpdGlvbi1kdXJhdGlvbicsIHRoaXMuX2R1cmF0aW9uICsgJ21zJyk7XG4gICAgdGhpcy5wc3dwLmRpc3BhdGNoKHRoaXMuaXNPcGVuaW5nID8gJ29wZW5pbmdBbmltYXRpb25TdGFydCcgOiAnY2xvc2luZ0FuaW1hdGlvblN0YXJ0Jyk7IC8vIGxlZ2FjeSBldmVudFxuXG4gICAgdGhpcy5wc3dwLmRpc3BhdGNoKFxuICAgIC8qKiBAdHlwZSB7J2luaXRpYWxab29tSW4nIHwgJ2luaXRpYWxab29tT3V0J30gKi9cbiAgICAnaW5pdGlhbFpvb20nICsgKHRoaXMuaXNPcGVuaW5nID8gJ0luJyA6ICdPdXQnKSk7XG4gICAgKF90aGlzJHBzd3AkZWxlbWVudDIgPSB0aGlzLnBzd3AuZWxlbWVudCkgPT09IG51bGwgfHwgX3RoaXMkcHN3cCRlbGVtZW50MiA9PT0gdm9pZCAwIHx8IF90aGlzJHBzd3AkZWxlbWVudDIuY2xhc3NMaXN0LnRvZ2dsZSgncHN3cC0tdWktdmlzaWJsZScsIHRoaXMuaXNPcGVuaW5nKTtcblxuICAgIGlmICh0aGlzLmlzT3BlbmluZykge1xuICAgICAgaWYgKHRoaXMuX3BsYWNlaG9sZGVyKSB7XG4gICAgICAgIC8vIHVuaGlkZSB0aGUgcGxhY2Vob2xkZXJcbiAgICAgICAgdGhpcy5fcGxhY2Vob2xkZXIuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICAgIH1cblxuICAgICAgdGhpcy5fYW5pbWF0ZVRvT3BlblN0YXRlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzQ2xvc2luZykge1xuICAgICAgdGhpcy5fYW5pbWF0ZVRvQ2xvc2VkU3RhdGUoKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX3VzZUFuaW1hdGlvbikge1xuICAgICAgdGhpcy5fb25BbmltYXRpb25Db21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuICAvKiogQHByaXZhdGUgKi9cblxuXG4gIF9vbkFuaW1hdGlvbkNvbXBsZXRlKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHBzd3BcbiAgICB9ID0gdGhpcztcbiAgICB0aGlzLmlzT3BlbiA9IHRoaXMuaXNPcGVuaW5nO1xuICAgIHRoaXMuaXNDbG9zZWQgPSB0aGlzLmlzQ2xvc2luZztcbiAgICB0aGlzLmlzT3BlbmluZyA9IGZhbHNlO1xuICAgIHRoaXMuaXNDbG9zaW5nID0gZmFsc2U7XG4gICAgcHN3cC5kaXNwYXRjaCh0aGlzLmlzT3BlbiA/ICdvcGVuaW5nQW5pbWF0aW9uRW5kJyA6ICdjbG9zaW5nQW5pbWF0aW9uRW5kJyk7IC8vIGxlZ2FjeSBldmVudFxuXG4gICAgcHN3cC5kaXNwYXRjaChcbiAgICAvKiogQHR5cGUgeydpbml0aWFsWm9vbUluRW5kJyB8ICdpbml0aWFsWm9vbU91dEVuZCd9ICovXG4gICAgJ2luaXRpYWxab29tJyArICh0aGlzLmlzT3BlbiA/ICdJbkVuZCcgOiAnT3V0RW5kJykpO1xuXG4gICAgaWYgKHRoaXMuaXNDbG9zZWQpIHtcbiAgICAgIHBzd3AuZGVzdHJveSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgIHZhciBfcHN3cCRjdXJyU2xpZGU7XG5cbiAgICAgIGlmICh0aGlzLl9hbmltYXRlWm9vbSAmJiBwc3dwLmNvbnRhaW5lcikge1xuICAgICAgICBwc3dwLmNvbnRhaW5lci5zdHlsZS5vdmVyZmxvdyA9ICd2aXNpYmxlJztcbiAgICAgICAgcHN3cC5jb250YWluZXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICB9XG5cbiAgICAgIChfcHN3cCRjdXJyU2xpZGUgPSBwc3dwLmN1cnJTbGlkZSkgPT09IG51bGwgfHwgX3Bzd3AkY3VyclNsaWRlID09PSB2b2lkIDAgfHwgX3Bzd3AkY3VyclNsaWRlLmFwcGx5Q3VycmVudFpvb21QYW4oKTtcbiAgICB9XG4gIH1cbiAgLyoqIEBwcml2YXRlICovXG5cblxuICBfYW5pbWF0ZVRvT3BlblN0YXRlKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHBzd3BcbiAgICB9ID0gdGhpcztcblxuICAgIGlmICh0aGlzLl9hbmltYXRlWm9vbSkge1xuICAgICAgaWYgKHRoaXMuX2Nyb3BwZWRab29tICYmIHRoaXMuX2Nyb3BDb250YWluZXIxICYmIHRoaXMuX2Nyb3BDb250YWluZXIyKSB7XG4gICAgICAgIHRoaXMuX2FuaW1hdGVUbyh0aGlzLl9jcm9wQ29udGFpbmVyMSwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUzZCgwLDAsMCknKTtcblxuICAgICAgICB0aGlzLl9hbmltYXRlVG8odGhpcy5fY3JvcENvbnRhaW5lcjIsICd0cmFuc2Zvcm0nLCAnbm9uZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAocHN3cC5jdXJyU2xpZGUpIHtcbiAgICAgICAgcHN3cC5jdXJyU2xpZGUuem9vbUFuZFBhblRvSW5pdGlhbCgpO1xuXG4gICAgICAgIHRoaXMuX2FuaW1hdGVUbyhwc3dwLmN1cnJTbGlkZS5jb250YWluZXIsICd0cmFuc2Zvcm0nLCBwc3dwLmN1cnJTbGlkZS5nZXRDdXJyZW50VHJhbnNmb3JtKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9hbmltYXRlQmdPcGFjaXR5ICYmIHBzd3AuYmcpIHtcbiAgICAgIHRoaXMuX2FuaW1hdGVUbyhwc3dwLmJnLCAnb3BhY2l0eScsIFN0cmluZyhwc3dwLm9wdGlvbnMuYmdPcGFjaXR5KSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2FuaW1hdGVSb290T3BhY2l0eSAmJiBwc3dwLmVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2FuaW1hdGVUbyhwc3dwLmVsZW1lbnQsICdvcGFjaXR5JywgJzEnKTtcbiAgICB9XG4gIH1cbiAgLyoqIEBwcml2YXRlICovXG5cblxuICBfYW5pbWF0ZVRvQ2xvc2VkU3RhdGUoKSB7XG4gICAgY29uc3Qge1xuICAgICAgcHN3cFxuICAgIH0gPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuX2FuaW1hdGVab29tKSB7XG4gICAgICB0aGlzLl9zZXRDbG9zZWRTdGF0ZVpvb21QYW4odHJ1ZSk7XG4gICAgfSAvLyBkbyBub3QgYW5pbWF0ZSBvcGFjaXR5IGlmIGl0J3MgYWxyZWFkeSBhdCAwXG5cblxuICAgIGlmICh0aGlzLl9hbmltYXRlQmdPcGFjaXR5ICYmIHBzd3AuYmdPcGFjaXR5ID4gMC4wMSAmJiBwc3dwLmJnKSB7XG4gICAgICB0aGlzLl9hbmltYXRlVG8ocHN3cC5iZywgJ29wYWNpdHknLCAnMCcpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9hbmltYXRlUm9vdE9wYWNpdHkgJiYgcHN3cC5lbGVtZW50KSB7XG4gICAgICB0aGlzLl9hbmltYXRlVG8ocHN3cC5lbGVtZW50LCAnb3BhY2l0eScsICcwJyk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogQHBhcmFtIHtib29sZWFufSBbYW5pbWF0ZV1cclxuICAgKi9cblxuXG4gIF9zZXRDbG9zZWRTdGF0ZVpvb21QYW4oYW5pbWF0ZSkge1xuICAgIGlmICghdGhpcy5fdGh1bWJCb3VuZHMpIHJldHVybjtcbiAgICBjb25zdCB7XG4gICAgICBwc3dwXG4gICAgfSA9IHRoaXM7XG4gICAgY29uc3Qge1xuICAgICAgaW5uZXJSZWN0XG4gICAgfSA9IHRoaXMuX3RodW1iQm91bmRzO1xuICAgIGNvbnN0IHtcbiAgICAgIGN1cnJTbGlkZSxcbiAgICAgIHZpZXdwb3J0U2l6ZVxuICAgIH0gPSBwc3dwO1xuXG4gICAgaWYgKHRoaXMuX2Nyb3BwZWRab29tICYmIGlubmVyUmVjdCAmJiB0aGlzLl9jcm9wQ29udGFpbmVyMSAmJiB0aGlzLl9jcm9wQ29udGFpbmVyMikge1xuICAgICAgY29uc3QgY29udGFpbmVyT25lUGFuWCA9IC12aWV3cG9ydFNpemUueCArICh0aGlzLl90aHVtYkJvdW5kcy54IC0gaW5uZXJSZWN0LngpICsgaW5uZXJSZWN0Lnc7XG4gICAgICBjb25zdCBjb250YWluZXJPbmVQYW5ZID0gLXZpZXdwb3J0U2l6ZS55ICsgKHRoaXMuX3RodW1iQm91bmRzLnkgLSBpbm5lclJlY3QueSkgKyBpbm5lclJlY3QuaDtcbiAgICAgIGNvbnN0IGNvbnRhaW5lclR3b1BhblggPSB2aWV3cG9ydFNpemUueCAtIGlubmVyUmVjdC53O1xuICAgICAgY29uc3QgY29udGFpbmVyVHdvUGFuWSA9IHZpZXdwb3J0U2l6ZS55IC0gaW5uZXJSZWN0Lmg7XG5cbiAgICAgIGlmIChhbmltYXRlKSB7XG4gICAgICAgIHRoaXMuX2FuaW1hdGVUbyh0aGlzLl9jcm9wQ29udGFpbmVyMSwgJ3RyYW5zZm9ybScsIHRvVHJhbnNmb3JtU3RyaW5nKGNvbnRhaW5lck9uZVBhblgsIGNvbnRhaW5lck9uZVBhblkpKTtcblxuICAgICAgICB0aGlzLl9hbmltYXRlVG8odGhpcy5fY3JvcENvbnRhaW5lcjIsICd0cmFuc2Zvcm0nLCB0b1RyYW5zZm9ybVN0cmluZyhjb250YWluZXJUd29QYW5YLCBjb250YWluZXJUd29QYW5ZKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRUcmFuc2Zvcm0odGhpcy5fY3JvcENvbnRhaW5lcjEsIGNvbnRhaW5lck9uZVBhblgsIGNvbnRhaW5lck9uZVBhblkpO1xuICAgICAgICBzZXRUcmFuc2Zvcm0odGhpcy5fY3JvcENvbnRhaW5lcjIsIGNvbnRhaW5lclR3b1BhblgsIGNvbnRhaW5lclR3b1BhblkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjdXJyU2xpZGUpIHtcbiAgICAgIGVxdWFsaXplUG9pbnRzKGN1cnJTbGlkZS5wYW4sIGlubmVyUmVjdCB8fCB0aGlzLl90aHVtYkJvdW5kcyk7XG4gICAgICBjdXJyU2xpZGUuY3Vyclpvb21MZXZlbCA9IHRoaXMuX3RodW1iQm91bmRzLncgLyBjdXJyU2xpZGUud2lkdGg7XG5cbiAgICAgIGlmIChhbmltYXRlKSB7XG4gICAgICAgIHRoaXMuX2FuaW1hdGVUbyhjdXJyU2xpZGUuY29udGFpbmVyLCAndHJhbnNmb3JtJywgY3VyclNsaWRlLmdldEN1cnJlbnRUcmFuc2Zvcm0oKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyU2xpZGUuYXBwbHlDdXJyZW50Wm9vbVBhbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFxyXG4gICAqIEBwYXJhbSB7J3RyYW5zZm9ybScgfCAnb3BhY2l0eSd9IHByb3BcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcFZhbHVlXHJcbiAgICovXG5cblxuICBfYW5pbWF0ZVRvKHRhcmdldCwgcHJvcCwgcHJvcFZhbHVlKSB7XG4gICAgaWYgKCF0aGlzLl9kdXJhdGlvbikge1xuICAgICAgdGFyZ2V0LnN0eWxlW3Byb3BdID0gcHJvcFZhbHVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHtcbiAgICAgIGFuaW1hdGlvbnNcbiAgICB9ID0gdGhpcy5wc3dwO1xuICAgIC8qKiBAdHlwZSB7QW5pbWF0aW9uUHJvcHN9ICovXG5cbiAgICBjb25zdCBhbmltUHJvcHMgPSB7XG4gICAgICBkdXJhdGlvbjogdGhpcy5fZHVyYXRpb24sXG4gICAgICBlYXNpbmc6IHRoaXMucHN3cC5vcHRpb25zLmVhc2luZyxcbiAgICAgIG9uQ29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgaWYgKCFhbmltYXRpb25zLmFjdGl2ZUFuaW1hdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5fb25BbmltYXRpb25Db21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdGFyZ2V0XG4gICAgfTtcbiAgICBhbmltUHJvcHNbcHJvcF0gPSBwcm9wVmFsdWU7XG4gICAgYW5pbWF0aW9ucy5zdGFydFRyYW5zaXRpb24oYW5pbVByb3BzKTtcbiAgfVxuXG59XG5cbi8qKlxyXG4gKiBAdGVtcGxhdGUgVFxyXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3R5cGVzLmpzJykuVHlwZTxUPn0gVHlwZTxUPlxyXG4gKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4vc2xpZGUvc2xpZGUuanMnKS5TbGlkZURhdGF9IFNsaWRlRGF0YSAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi9zbGlkZS96b29tLWxldmVsLmpzJykuWm9vbUxldmVsT3B0aW9ufSBab29tTGV2ZWxPcHRpb24gKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4vdWkvdWktZWxlbWVudC5qcycpLlVJRWxlbWVudERhdGF9IFVJRWxlbWVudERhdGEgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4vbWFpbi1zY3JvbGwuanMnKS5JdGVtSG9sZGVyfSBJdGVtSG9sZGVyICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL2NvcmUvZXZlbnRhYmxlLmpzJykuUGhvdG9Td2lwZUV2ZW50c01hcH0gUGhvdG9Td2lwZUV2ZW50c01hcCAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi9jb3JlL2V2ZW50YWJsZS5qcycpLlBob3RvU3dpcGVGaWx0ZXJzTWFwfSBQaG90b1N3aXBlRmlsdGVyc01hcCAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi9zbGlkZS9nZXQtdGh1bWItYm91bmRzJykuQm91bmRzfSBCb3VuZHMgKi9cblxuLyoqXHJcbiAqIEB0ZW1wbGF0ZSB7a2V5b2YgUGhvdG9Td2lwZUV2ZW50c01hcH0gVFxyXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL2NvcmUvZXZlbnRhYmxlLmpzJykuRXZlbnRDYWxsYmFjazxUPn0gRXZlbnRDYWxsYmFjazxUPlxyXG4gKi9cblxuLyoqXHJcbiAqIEB0ZW1wbGF0ZSB7a2V5b2YgUGhvdG9Td2lwZUV2ZW50c01hcH0gVFxyXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL2NvcmUvZXZlbnRhYmxlLmpzJykuQXVnbWVudGVkRXZlbnQ8VD59IEF1Z21lbnRlZEV2ZW50PFQ+XHJcbiAqL1xuXG4vKiogQHR5cGVkZWYge3sgeDogbnVtYmVyOyB5OiBudW1iZXI7IGlkPzogc3RyaW5nIHwgbnVtYmVyIH19IFBvaW50ICovXG5cbi8qKiBAdHlwZWRlZiB7eyB0b3A6IG51bWJlcjsgYm90dG9tOiBudW1iZXI7IGxlZnQ6IG51bWJlcjsgcmlnaHQ6IG51bWJlciB9fSBQYWRkaW5nICovXG5cbi8qKiBAdHlwZWRlZiB7U2xpZGVEYXRhW119IERhdGFTb3VyY2VBcnJheSAqL1xuXG4vKiogQHR5cGVkZWYge3sgZ2FsbGVyeTogSFRNTEVsZW1lbnQ7IGl0ZW1zPzogSFRNTEVsZW1lbnRbXSB9fSBEYXRhU291cmNlT2JqZWN0ICovXG5cbi8qKiBAdHlwZWRlZiB7RGF0YVNvdXJjZUFycmF5IHwgRGF0YVNvdXJjZU9iamVjdH0gRGF0YVNvdXJjZSAqL1xuXG4vKiogQHR5cGVkZWYgeyhwb2ludDogUG9pbnQsIG9yaWdpbmFsRXZlbnQ6IFBvaW50ZXJFdmVudCkgPT4gdm9pZH0gQWN0aW9uRm4gKi9cblxuLyoqIEB0eXBlZGVmIHsnY2xvc2UnIHwgJ25leHQnIHwgJ3pvb20nIHwgJ3pvb20tb3ItY2xvc2UnIHwgJ3RvZ2dsZS1jb250cm9scyd9IEFjdGlvblR5cGUgKi9cblxuLyoqIEB0eXBlZGVmIHtUeXBlPFBob3RvU3dpcGU+IHwgeyBkZWZhdWx0OiBUeXBlPFBob3RvU3dpcGU+IH19IFBob3RvU3dpcGVNb2R1bGUgKi9cblxuLyoqIEB0eXBlZGVmIHtQaG90b1N3aXBlTW9kdWxlIHwgUHJvbWlzZTxQaG90b1N3aXBlTW9kdWxlPiB8ICgoKSA9PiBQcm9taXNlPFBob3RvU3dpcGVNb2R1bGU+KX0gUGhvdG9Td2lwZU1vZHVsZU9wdGlvbiAqL1xuXG4vKipcclxuICogQHR5cGVkZWYge3N0cmluZyB8IE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+IHwgSFRNTEVsZW1lbnRbXSB8IEhUTUxFbGVtZW50fSBFbGVtZW50UHJvdmlkZXJcclxuICovXG5cbi8qKiBAdHlwZWRlZiB7UGFydGlhbDxQcmVwYXJlZFBob3RvU3dpcGVPcHRpb25zPn0gUGhvdG9Td2lwZU9wdGlvbnMgaHR0cHM6Ly9waG90b3N3aXBlLmNvbS9vcHRpb25zLyAqL1xuXG4vKipcclxuICogQHR5cGVkZWYge09iamVjdH0gUHJlcGFyZWRQaG90b1N3aXBlT3B0aW9uc1xyXG4gKlxyXG4gKiBAcHJvcCB7RGF0YVNvdXJjZX0gW2RhdGFTb3VyY2VdXHJcbiAqIFBhc3MgYW4gYXJyYXkgb2YgYW55IGl0ZW1zIHZpYSBkYXRhU291cmNlIG9wdGlvbi4gSXRzIGxlbmd0aCB3aWxsIGRldGVybWluZSBhbW91bnQgb2Ygc2xpZGVzXHJcbiAqICh3aGljaCBtYXkgYmUgbW9kaWZpZWQgZnVydGhlciBmcm9tIG51bUl0ZW1zIGV2ZW50KS5cclxuICpcclxuICogRWFjaCBpdGVtIHNob3VsZCBjb250YWluIGRhdGEgdGhhdCB5b3UgbmVlZCB0byBnZW5lcmF0ZSBzbGlkZVxyXG4gKiAoZm9yIGltYWdlIHNsaWRlIGl0IHdvdWxkIGJlIHNyYyAoaW1hZ2UgVVJMKSwgd2lkdGggKGltYWdlIHdpZHRoKSwgaGVpZ2h0LCBzcmNzZXQsIGFsdCkuXHJcbiAqXHJcbiAqIElmIHRoZXNlIHByb3BlcnRpZXMgYXJlIG5vdCBwcmVzZW50IGluIHlvdXIgaW5pdGlhbCBhcnJheSwgeW91IG1heSBcInByZS1wYXJzZVwiIGVhY2ggaXRlbSBmcm9tIGl0ZW1EYXRhIGZpbHRlci5cclxuICpcclxuICogQHByb3Age251bWJlcn0gYmdPcGFjaXR5XHJcbiAqIEJhY2tncm91bmQgYmFja2Ryb3Agb3BhY2l0eSwgYWx3YXlzIGRlZmluZSBpdCB2aWEgdGhpcyBvcHRpb24gYW5kIG5vdCB2aWEgQ1NTIHJnYmEgY29sb3IuXHJcbiAqXHJcbiAqIEBwcm9wIHtudW1iZXJ9IHNwYWNpbmdcclxuICogU3BhY2luZyBiZXR3ZWVuIHNsaWRlcy4gRGVmaW5lZCBhcyByYXRpbyByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnQgd2lkdGggKDAuMSA9IDEwJSBvZiB2aWV3cG9ydCkuXHJcbiAqXHJcbiAqIEBwcm9wIHtib29sZWFufSBhbGxvd1BhblRvTmV4dFxyXG4gKiBBbGxvdyBzd2lwZSBuYXZpZ2F0aW9uIHRvIHRoZSBuZXh0IHNsaWRlIHdoZW4gdGhlIGN1cnJlbnQgc2xpZGUgaXMgem9vbWVkLiBEb2VzIG5vdCBhcHBseSB0byBtb3VzZSBldmVudHMuXHJcbiAqXHJcbiAqIEBwcm9wIHtib29sZWFufSBsb29wXHJcbiAqIElmIHNldCB0byB0cnVlIHlvdSdsbCBiZSBhYmxlIHRvIHN3aXBlIGZyb20gdGhlIGxhc3QgdG8gdGhlIGZpcnN0IGltYWdlLlxyXG4gKiBPcHRpb24gaXMgYWx3YXlzIGZhbHNlIHdoZW4gdGhlcmUgYXJlIGxlc3MgdGhhbiAzIHNsaWRlcy5cclxuICpcclxuICogQHByb3Age2Jvb2xlYW59IFt3aGVlbFRvWm9vbV1cclxuICogQnkgZGVmYXVsdCBQaG90b1N3aXBlIHpvb21zIGltYWdlIHdpdGggY3RybC13aGVlbCwgaWYgeW91IGVuYWJsZSB0aGlzIG9wdGlvbiAtIGltYWdlIHdpbGwgem9vbSBqdXN0IHZpYSB3aGVlbC5cclxuICpcclxuICogQHByb3Age2Jvb2xlYW59IHBpbmNoVG9DbG9zZVxyXG4gKiBQaW5jaCB0b3VjaCBnZXN0dXJlIHRvIGNsb3NlIHRoZSBnYWxsZXJ5LlxyXG4gKlxyXG4gKiBAcHJvcCB7Ym9vbGVhbn0gY2xvc2VPblZlcnRpY2FsRHJhZ1xyXG4gKiBWZXJ0aWNhbCBkcmFnIGdlc3R1cmUgdG8gY2xvc2UgdGhlIFBob3RvU3dpcGUuXHJcbiAqXHJcbiAqIEBwcm9wIHtQYWRkaW5nfSBbcGFkZGluZ11cclxuICogU2xpZGUgYXJlYSBwYWRkaW5nIChpbiBwaXhlbHMpLlxyXG4gKlxyXG4gKiBAcHJvcCB7KHZpZXdwb3J0U2l6ZTogUG9pbnQsIGl0ZW1EYXRhOiBTbGlkZURhdGEsIGluZGV4OiBudW1iZXIpID0+IFBhZGRpbmd9IFtwYWRkaW5nRm5dXHJcbiAqIFRoZSBvcHRpb24gaXMgY2hlY2tlZCBmcmVxdWVudGx5LCBzbyBtYWtlIHN1cmUgaXQncyBwZXJmb3JtYW50LiBPdmVycmlkZXMgcGFkZGluZyBvcHRpb24gaWYgZGVmaW5lZC4gRm9yIGV4YW1wbGU6XHJcbiAqXHJcbiAqIEBwcm9wIHtudW1iZXIgfCBmYWxzZX0gaGlkZUFuaW1hdGlvbkR1cmF0aW9uXHJcbiAqIFRyYW5zaXRpb24gZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzLCBjYW4gYmUgMC5cclxuICpcclxuICogQHByb3Age251bWJlciB8IGZhbHNlfSBzaG93QW5pbWF0aW9uRHVyYXRpb25cclxuICogVHJhbnNpdGlvbiBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMsIGNhbiBiZSAwLlxyXG4gKlxyXG4gKiBAcHJvcCB7bnVtYmVyIHwgZmFsc2V9IHpvb21BbmltYXRpb25EdXJhdGlvblxyXG4gKiBUcmFuc2l0aW9uIGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kcywgY2FuIGJlIDAuXHJcbiAqXHJcbiAqIEBwcm9wIHtzdHJpbmd9IGVhc2luZ1xyXG4gKiBTdHJpbmcsICdjdWJpYy1iZXppZXIoLjQsMCwuMjIsMSknLiBDU1MgZWFzaW5nIGZ1bmN0aW9uIGZvciBvcGVuL2Nsb3NlL3pvb20gdHJhbnNpdGlvbnMuXHJcbiAqXHJcbiAqIEBwcm9wIHtib29sZWFufSBlc2NLZXlcclxuICogRXNjIGtleSB0byBjbG9zZS5cclxuICpcclxuICogQHByb3Age2Jvb2xlYW59IGFycm93S2V5c1xyXG4gKiBMZWZ0L3JpZ2h0IGFycm93IGtleXMgZm9yIG5hdmlnYXRpb24uXHJcbiAqXHJcbiAqIEBwcm9wIHtib29sZWFufSB0cmFwRm9jdXNcclxuICogVHJhcCBmb2N1cyB3aXRoaW4gUGhvdG9Td2lwZSBlbGVtZW50IHdoaWxlIGl0J3Mgb3Blbi5cclxuICpcclxuICogQHByb3Age2Jvb2xlYW59IHJldHVybkZvY3VzXHJcbiAqIFJlc3RvcmUgZm9jdXMgdGhlIGxhc3QgYWN0aXZlIGVsZW1lbnQgYWZ0ZXIgUGhvdG9Td2lwZSBpcyBjbG9zZWQuXHJcbiAqXHJcbiAqIEBwcm9wIHtib29sZWFufSBjbGlja1RvQ2xvc2VOb25ab29tYWJsZVxyXG4gKiBJZiBpbWFnZSBpcyBub3Qgem9vbWFibGUgKGZvciBleGFtcGxlLCBzbWFsbGVyIHRoYW4gdmlld3BvcnQpIGl0IGNhbiBiZSBjbG9zZWQgYnkgY2xpY2tpbmcgb24gaXQuXHJcbiAqXHJcbiAqIEBwcm9wIHtBY3Rpb25UeXBlIHwgQWN0aW9uRm4gfCBmYWxzZX0gaW1hZ2VDbGlja0FjdGlvblxyXG4gKiBSZWZlciB0byBjbGljayBhbmQgdGFwIGFjdGlvbnMgcGFnZS5cclxuICpcclxuICogQHByb3Age0FjdGlvblR5cGUgfCBBY3Rpb25GbiB8IGZhbHNlfSBiZ0NsaWNrQWN0aW9uXHJcbiAqIFJlZmVyIHRvIGNsaWNrIGFuZCB0YXAgYWN0aW9ucyBwYWdlLlxyXG4gKlxyXG4gKiBAcHJvcCB7QWN0aW9uVHlwZSB8IEFjdGlvbkZuIHwgZmFsc2V9IHRhcEFjdGlvblxyXG4gKiBSZWZlciB0byBjbGljayBhbmQgdGFwIGFjdGlvbnMgcGFnZS5cclxuICpcclxuICogQHByb3Age0FjdGlvblR5cGUgfCBBY3Rpb25GbiB8IGZhbHNlfSBkb3VibGVUYXBBY3Rpb25cclxuICogUmVmZXIgdG8gY2xpY2sgYW5kIHRhcCBhY3Rpb25zIHBhZ2UuXHJcbiAqXHJcbiAqIEBwcm9wIHtudW1iZXJ9IHByZWxvYWRlckRlbGF5XHJcbiAqIERlbGF5IGJlZm9yZSB0aGUgbG9hZGluZyBpbmRpY2F0b3Igd2lsbCBiZSBkaXNwbGF5ZWQsXHJcbiAqIGlmIGltYWdlIGlzIGxvYWRlZCBkdXJpbmcgaXQgLSB0aGUgaW5kaWNhdG9yIHdpbGwgbm90IGJlIGRpc3BsYXllZCBhdCBhbGwuIENhbiBiZSB6ZXJvLlxyXG4gKlxyXG4gKiBAcHJvcCB7c3RyaW5nfSBpbmRleEluZGljYXRvclNlcFxyXG4gKiBVc2VkIGZvciBzbGlkZSBjb3VudCBpbmRpY2F0b3IgKFwiMSBvZiAxMCBcIikuXHJcbiAqXHJcbiAqIEBwcm9wIHsob3B0aW9uczogUGhvdG9Td2lwZU9wdGlvbnMsIHBzd3A6IFBob3RvU3dpcGVCYXNlKSA9PiBQb2ludH0gW2dldFZpZXdwb3J0U2l6ZUZuXVxyXG4gKiBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIHJldHVybiBzbGlkZSB2aWV3cG9ydCB3aWR0aCBhbmQgaGVpZ2h0LCBpbiBmb3JtYXQge3g6IDEwMCwgeTogMTAwfS5cclxuICpcclxuICogQHByb3Age3N0cmluZ30gZXJyb3JNc2dcclxuICogTWVzc2FnZSB0byBkaXNwbGF5IHdoZW4gdGhlIGltYWdlIHdhc24ndCBhYmxlIHRvIGxvYWQuIElmIHlvdSBuZWVkIHRvIGRpc3BsYXkgSFRNTCAtIHVzZSBjb250ZW50RXJyb3JFbGVtZW50IGZpbHRlci5cclxuICpcclxuICogQHByb3Age1tudW1iZXIsIG51bWJlcl19IHByZWxvYWRcclxuICogTGF6eSBsb2FkaW5nIG9mIG5lYXJieSBzbGlkZXMgYmFzZWQgb24gZGlyZWN0aW9uIG9mIG1vdmVtZW50LiBTaG91bGQgYmUgYW4gYXJyYXkgd2l0aCB0d28gaW50ZWdlcnMsXHJcbiAqIGZpcnN0IG9uZSAtIG51bWJlciBvZiBpdGVtcyB0byBwcmVsb2FkIGJlZm9yZSB0aGUgY3VycmVudCBpbWFnZSwgc2Vjb25kIG9uZSAtIGFmdGVyIHRoZSBjdXJyZW50IGltYWdlLlxyXG4gKiBUd28gbmVhcmJ5IGltYWdlcyBhcmUgYWx3YXlzIGxvYWRlZC5cclxuICpcclxuICogQHByb3Age3N0cmluZ30gW21haW5DbGFzc11cclxuICogQ2xhc3MgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSByb290IGVsZW1lbnQgb2YgUGhvdG9Td2lwZSwgbWF5IGNvbnRhaW4gbXVsdGlwbGUgc2VwYXJhdGVkIGJ5IHNwYWNlLlxyXG4gKiBFeGFtcGxlIG9uIFN0eWxpbmcgcGFnZS5cclxuICpcclxuICogQHByb3Age0hUTUxFbGVtZW50fSBbYXBwZW5kVG9FbF1cclxuICogRWxlbWVudCB0byB3aGljaCBQaG90b1N3aXBlIGRpYWxvZyB3aWxsIGJlIGFwcGVuZGVkIHdoZW4gaXQgb3BlbnMuXHJcbiAqXHJcbiAqIEBwcm9wIHtudW1iZXJ9IG1heFdpZHRoVG9BbmltYXRlXHJcbiAqIE1heGltdW0gd2lkdGggb2YgaW1hZ2UgdG8gYW5pbWF0ZSwgaWYgaW5pdGlhbCByZW5kZXJlZCBpbWFnZSB3aWR0aFxyXG4gKiBpcyBsYXJnZXIgdGhhbiB0aGlzIHZhbHVlIC0gdGhlIG9wZW5pbmcvY2xvc2luZyB0cmFuc2l0aW9uIHdpbGwgYmUgYXV0b21hdGljYWxseSBkaXNhYmxlZC5cclxuICpcclxuICogQHByb3Age3N0cmluZ30gW2Nsb3NlVGl0bGVdXHJcbiAqIFRyYW5zbGF0aW5nXHJcbiAqXHJcbiAqIEBwcm9wIHtzdHJpbmd9IFt6b29tVGl0bGVdXHJcbiAqIFRyYW5zbGF0aW5nXHJcbiAqXHJcbiAqIEBwcm9wIHtzdHJpbmd9IFthcnJvd1ByZXZUaXRsZV1cclxuICogVHJhbnNsYXRpbmdcclxuICpcclxuICogQHByb3Age3N0cmluZ30gW2Fycm93TmV4dFRpdGxlXVxyXG4gKiBUcmFuc2xhdGluZ1xyXG4gKlxyXG4gKiBAcHJvcCB7J3pvb20nIHwgJ2ZhZGUnIHwgJ25vbmUnfSBbc2hvd0hpZGVBbmltYXRpb25UeXBlXVxyXG4gKiBUbyBhZGp1c3Qgb3BlbmluZyBvciBjbG9zaW5nIHRyYW5zaXRpb24gdHlwZSB1c2UgbGlnaHRib3ggb3B0aW9uIGBzaG93SGlkZUFuaW1hdGlvblR5cGVgIChgU3RyaW5nYCkuXHJcbiAqIEl0IHN1cHBvcnRzIHRocmVlIHZhbHVlcyAtIGB6b29tYCAoZGVmYXVsdCksIGBmYWRlYCAoZGVmYXVsdCBpZiB0aGVyZSBpcyBubyB0aHVtYm5haWwpIGFuZCBgbm9uZWAuXHJcbiAqXHJcbiAqIEFuaW1hdGlvbnMgYXJlIGF1dG9tYXRpY2FsbHkgZGlzYWJsZWQgaWYgdXNlciBgKHByZWZlcnMtcmVkdWNlZC1tb3Rpb246IHJlZHVjZSlgLlxyXG4gKlxyXG4gKiBAcHJvcCB7bnVtYmVyfSBpbmRleFxyXG4gKiBEZWZpbmVzIHN0YXJ0IHNsaWRlIGluZGV4LlxyXG4gKlxyXG4gKiBAcHJvcCB7KGU6IE1vdXNlRXZlbnQpID0+IG51bWJlcn0gW2dldENsaWNrZWRJbmRleEZuXVxyXG4gKlxyXG4gKiBAcHJvcCB7Ym9vbGVhbn0gW2Fycm93UHJldl1cclxuICogQHByb3Age2Jvb2xlYW59IFthcnJvd05leHRdXHJcbiAqIEBwcm9wIHtib29sZWFufSBbem9vbV1cclxuICogQHByb3Age2Jvb2xlYW59IFtjbG9zZV1cclxuICogQHByb3Age2Jvb2xlYW59IFtjb3VudGVyXVxyXG4gKlxyXG4gKiBAcHJvcCB7c3RyaW5nfSBbYXJyb3dQcmV2U1ZHXVxyXG4gKiBAcHJvcCB7c3RyaW5nfSBbYXJyb3dOZXh0U1ZHXVxyXG4gKiBAcHJvcCB7c3RyaW5nfSBbem9vbVNWR11cclxuICogQHByb3Age3N0cmluZ30gW2Nsb3NlU1ZHXVxyXG4gKiBAcHJvcCB7c3RyaW5nfSBbY291bnRlclNWR11cclxuICpcclxuICogQHByb3Age3N0cmluZ30gW2Fycm93UHJldlRpdGxlXVxyXG4gKiBAcHJvcCB7c3RyaW5nfSBbYXJyb3dOZXh0VGl0bGVdXHJcbiAqIEBwcm9wIHtzdHJpbmd9IFt6b29tVGl0bGVdXHJcbiAqIEBwcm9wIHtzdHJpbmd9IFtjbG9zZVRpdGxlXVxyXG4gKiBAcHJvcCB7c3RyaW5nfSBbY291bnRlclRpdGxlXVxyXG4gKlxyXG4gKiBAcHJvcCB7Wm9vbUxldmVsT3B0aW9ufSBbaW5pdGlhbFpvb21MZXZlbF1cclxuICogQHByb3Age1pvb21MZXZlbE9wdGlvbn0gW3NlY29uZGFyeVpvb21MZXZlbF1cclxuICogQHByb3Age1pvb21MZXZlbE9wdGlvbn0gW21heFpvb21MZXZlbF1cclxuICpcclxuICogQHByb3Age2Jvb2xlYW59IFttb3VzZU1vdmVQYW5dXHJcbiAqIEBwcm9wIHtQb2ludCB8IG51bGx9IFtpbml0aWFsUG9pbnRlclBvc11cclxuICogQHByb3Age2Jvb2xlYW59IFtzaG93SGlkZU9wYWNpdHldXHJcbiAqXHJcbiAqIEBwcm9wIHtQaG90b1N3aXBlTW9kdWxlT3B0aW9ufSBbcHN3cE1vZHVsZV1cclxuICogQHByb3AgeygpID0+IFByb21pc2U8YW55Pn0gW29wZW5Qcm9taXNlXVxyXG4gKiBAcHJvcCB7Ym9vbGVhbn0gW3ByZWxvYWRGaXJzdFNsaWRlXVxyXG4gKiBAcHJvcCB7RWxlbWVudFByb3ZpZGVyfSBbZ2FsbGVyeV1cclxuICogQHByb3Age3N0cmluZ30gW2dhbGxlcnlTZWxlY3Rvcl1cclxuICogQHByb3Age0VsZW1lbnRQcm92aWRlcn0gW2NoaWxkcmVuXVxyXG4gKiBAcHJvcCB7c3RyaW5nfSBbY2hpbGRTZWxlY3Rvcl1cclxuICogQHByb3Age3N0cmluZyB8IGZhbHNlfSBbdGh1bWJTZWxlY3Rvcl1cclxuICovXG5cbi8qKiBAdHlwZSB7UHJlcGFyZWRQaG90b1N3aXBlT3B0aW9uc30gKi9cblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGFsbG93UGFuVG9OZXh0OiB0cnVlLFxuICBzcGFjaW5nOiAwLjEsXG4gIGxvb3A6IHRydWUsXG4gIHBpbmNoVG9DbG9zZTogdHJ1ZSxcbiAgY2xvc2VPblZlcnRpY2FsRHJhZzogdHJ1ZSxcbiAgaGlkZUFuaW1hdGlvbkR1cmF0aW9uOiAzMzMsXG4gIHNob3dBbmltYXRpb25EdXJhdGlvbjogMzMzLFxuICB6b29tQW5pbWF0aW9uRHVyYXRpb246IDMzMyxcbiAgZXNjS2V5OiB0cnVlLFxuICBhcnJvd0tleXM6IHRydWUsXG4gIHRyYXBGb2N1czogdHJ1ZSxcbiAgcmV0dXJuRm9jdXM6IHRydWUsXG4gIG1heFdpZHRoVG9BbmltYXRlOiA0MDAwLFxuICBjbGlja1RvQ2xvc2VOb25ab29tYWJsZTogdHJ1ZSxcbiAgaW1hZ2VDbGlja0FjdGlvbjogJ3pvb20tb3ItY2xvc2UnLFxuICBiZ0NsaWNrQWN0aW9uOiAnY2xvc2UnLFxuICB0YXBBY3Rpb246ICd0b2dnbGUtY29udHJvbHMnLFxuICBkb3VibGVUYXBBY3Rpb246ICd6b29tJyxcbiAgaW5kZXhJbmRpY2F0b3JTZXA6ICcgLyAnLFxuICBwcmVsb2FkZXJEZWxheTogMjAwMCxcbiAgYmdPcGFjaXR5OiAwLjgsXG4gIGluZGV4OiAwLFxuICBlcnJvck1zZzogJ1RoZSBpbWFnZSBjYW5ub3QgYmUgbG9hZGVkJyxcbiAgcHJlbG9hZDogWzEsIDJdLFxuICBlYXNpbmc6ICdjdWJpYy1iZXppZXIoLjQsMCwuMjIsMSknXG59O1xuLyoqXHJcbiAqIFBob3RvU3dpcGUgQ29yZVxyXG4gKi9cblxuY2xhc3MgUGhvdG9Td2lwZSBleHRlbmRzIFBob3RvU3dpcGVCYXNlIHtcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtQaG90b1N3aXBlT3B0aW9uc30gW29wdGlvbnNdXHJcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMuX3ByZXBhcmVPcHRpb25zKG9wdGlvbnMgfHwge30pO1xuICAgIC8qKlxyXG4gICAgICogb2Zmc2V0IG9mIHZpZXdwb3J0IHJlbGF0aXZlIHRvIGRvY3VtZW50XHJcbiAgICAgKlxyXG4gICAgICogQHR5cGUge1BvaW50fVxyXG4gICAgICovXG5cbiAgICB0aGlzLm9mZnNldCA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfTtcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHtQb2ludH1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cblxuICAgIHRoaXMuX3ByZXZWaWV3cG9ydFNpemUgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH07XG4gICAgLyoqXHJcbiAgICAgKiBTaXplIG9mIHNjcm9sbGFibGUgUGhvdG9Td2lwZSB2aWV3cG9ydFxyXG4gICAgICpcclxuICAgICAqIEB0eXBlIHtQb2ludH1cclxuICAgICAqL1xuXG4gICAgdGhpcy52aWV3cG9ydFNpemUgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH07XG4gICAgLyoqXHJcbiAgICAgKiBiYWNrZ3JvdW5kIChiYWNrZHJvcCkgb3BhY2l0eVxyXG4gICAgICovXG5cbiAgICB0aGlzLmJnT3BhY2l0eSA9IDE7XG4gICAgdGhpcy5jdXJySW5kZXggPSAwO1xuICAgIHRoaXMucG90ZW50aWFsSW5kZXggPSAwO1xuICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gICAgdGhpcy5pc0Rlc3Ryb3lpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmhhc01vdXNlID0gZmFsc2U7XG4gICAgLyoqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHR5cGUge1NsaWRlRGF0YX1cclxuICAgICAqL1xuXG4gICAgdGhpcy5faW5pdGlhbEl0ZW1EYXRhID0ge307XG4gICAgLyoqIEB0eXBlIHtCb3VuZHMgfCB1bmRlZmluZWR9ICovXG5cbiAgICB0aGlzLl9pbml0aWFsVGh1bWJCb3VuZHMgPSB1bmRlZmluZWQ7XG4gICAgLyoqIEB0eXBlIHtIVE1MRGl2RWxlbWVudCB8IHVuZGVmaW5lZH0gKi9cblxuICAgIHRoaXMudG9wQmFyID0gdW5kZWZpbmVkO1xuICAgIC8qKiBAdHlwZSB7SFRNTERpdkVsZW1lbnQgfCB1bmRlZmluZWR9ICovXG5cbiAgICB0aGlzLmVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgLyoqIEB0eXBlIHtIVE1MRGl2RWxlbWVudCB8IHVuZGVmaW5lZH0gKi9cblxuICAgIHRoaXMudGVtcGxhdGUgPSB1bmRlZmluZWQ7XG4gICAgLyoqIEB0eXBlIHtIVE1MRGl2RWxlbWVudCB8IHVuZGVmaW5lZH0gKi9cblxuICAgIHRoaXMuY29udGFpbmVyID0gdW5kZWZpbmVkO1xuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnQgfCB1bmRlZmluZWR9ICovXG5cbiAgICB0aGlzLnNjcm9sbFdyYXAgPSB1bmRlZmluZWQ7XG4gICAgLyoqIEB0eXBlIHtTbGlkZSB8IHVuZGVmaW5lZH0gKi9cblxuICAgIHRoaXMuY3VyclNsaWRlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZXZlbnRzID0gbmV3IERPTUV2ZW50cygpO1xuICAgIHRoaXMuYW5pbWF0aW9ucyA9IG5ldyBBbmltYXRpb25zKCk7XG4gICAgdGhpcy5tYWluU2Nyb2xsID0gbmV3IE1haW5TY3JvbGwodGhpcyk7XG4gICAgdGhpcy5nZXN0dXJlcyA9IG5ldyBHZXN0dXJlcyh0aGlzKTtcbiAgICB0aGlzLm9wZW5lciA9IG5ldyBPcGVuZXIodGhpcyk7XG4gICAgdGhpcy5rZXlib2FyZCA9IG5ldyBLZXlib2FyZCh0aGlzKTtcbiAgICB0aGlzLmNvbnRlbnRMb2FkZXIgPSBuZXcgQ29udGVudExvYWRlcih0aGlzKTtcbiAgfVxuICAvKiogQHJldHVybnMge2Jvb2xlYW59ICovXG5cblxuICBpbml0KCkge1xuICAgIGlmICh0aGlzLmlzT3BlbiB8fCB0aGlzLmlzRGVzdHJveWluZykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcbiAgICB0aGlzLmRpc3BhdGNoKCdpbml0Jyk7IC8vIGxlZ2FjeVxuXG4gICAgdGhpcy5kaXNwYXRjaCgnYmVmb3JlT3BlbicpO1xuXG4gICAgdGhpcy5fY3JlYXRlTWFpblN0cnVjdHVyZSgpOyAvLyBhZGQgY2xhc3NlcyB0byB0aGUgcm9vdCBlbGVtZW50IG9mIFBob3RvU3dpcGVcblxuXG4gICAgbGV0IHJvb3RDbGFzc2VzID0gJ3Bzd3AtLW9wZW4nO1xuXG4gICAgaWYgKHRoaXMuZ2VzdHVyZXMuc3VwcG9ydHNUb3VjaCkge1xuICAgICAgcm9vdENsYXNzZXMgKz0gJyBwc3dwLS10b3VjaCc7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5tYWluQ2xhc3MpIHtcbiAgICAgIHJvb3RDbGFzc2VzICs9ICcgJyArIHRoaXMub3B0aW9ucy5tYWluQ2xhc3M7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZWxlbWVudCkge1xuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZSArPSAnICcgKyByb290Q2xhc3NlcztcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJJbmRleCA9IHRoaXMub3B0aW9ucy5pbmRleCB8fCAwO1xuICAgIHRoaXMucG90ZW50aWFsSW5kZXggPSB0aGlzLmN1cnJJbmRleDtcbiAgICB0aGlzLmRpc3BhdGNoKCdmaXJzdFVwZGF0ZScpOyAvLyBzdGFydGluZyBpbmRleCBjYW4gYmUgbW9kaWZpZWQgaGVyZVxuICAgIC8vIGluaXRpYWxpemUgc2Nyb2xsIHdoZWVsIGhhbmRsZXIgdG8gYmxvY2sgdGhlIHNjcm9sbFxuXG4gICAgdGhpcy5zY3JvbGxXaGVlbCA9IG5ldyBTY3JvbGxXaGVlbCh0aGlzKTsgLy8gc2FuaXRpemUgaW5kZXhcblxuICAgIGlmIChOdW1iZXIuaXNOYU4odGhpcy5jdXJySW5kZXgpIHx8IHRoaXMuY3VyckluZGV4IDwgMCB8fCB0aGlzLmN1cnJJbmRleCA+PSB0aGlzLmdldE51bUl0ZW1zKCkpIHtcbiAgICAgIHRoaXMuY3VyckluZGV4ID0gMDtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZ2VzdHVyZXMuc3VwcG9ydHNUb3VjaCkge1xuICAgICAgLy8gZW5hYmxlIG1vdXNlIGZlYXR1cmVzIGlmIG5vIHRvdWNoIHN1cHBvcnQgZGV0ZWN0ZWRcbiAgICAgIHRoaXMubW91c2VEZXRlY3RlZCgpO1xuICAgIH0gLy8gY2F1c2VzIGZvcmNlZCBzeW5jaHJvbm91cyBsYXlvdXRcblxuXG4gICAgdGhpcy51cGRhdGVTaXplKCk7XG4gICAgdGhpcy5vZmZzZXQueSA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICB0aGlzLl9pbml0aWFsSXRlbURhdGEgPSB0aGlzLmdldEl0ZW1EYXRhKHRoaXMuY3VyckluZGV4KTtcbiAgICB0aGlzLmRpc3BhdGNoKCdnZXR0aW5nRGF0YScsIHtcbiAgICAgIGluZGV4OiB0aGlzLmN1cnJJbmRleCxcbiAgICAgIGRhdGE6IHRoaXMuX2luaXRpYWxJdGVtRGF0YSxcbiAgICAgIHNsaWRlOiB1bmRlZmluZWRcbiAgICB9KTsgLy8gKkxheW91dCogLSBjYWxjdWxhdGUgc2l6ZSBhbmQgcG9zaXRpb24gb2YgZWxlbWVudHMgaGVyZVxuXG4gICAgdGhpcy5faW5pdGlhbFRodW1iQm91bmRzID0gdGhpcy5nZXRUaHVtYkJvdW5kcygpO1xuICAgIHRoaXMuZGlzcGF0Y2goJ2luaXRpYWxMYXlvdXQnKTtcbiAgICB0aGlzLm9uKCdvcGVuaW5nQW5pbWF0aW9uRW5kJywgKCkgPT4ge1xuICAgICAgY29uc3Qge1xuICAgICAgICBpdGVtSG9sZGVyc1xuICAgICAgfSA9IHRoaXMubWFpblNjcm9sbDsgLy8gQWRkIGNvbnRlbnQgdG8gdGhlIHByZXZpb3VzIGFuZCBuZXh0IHNsaWRlXG5cbiAgICAgIGlmIChpdGVtSG9sZGVyc1swXSkge1xuICAgICAgICBpdGVtSG9sZGVyc1swXS5lbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgdGhpcy5zZXRDb250ZW50KGl0ZW1Ib2xkZXJzWzBdLCB0aGlzLmN1cnJJbmRleCAtIDEpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbUhvbGRlcnNbMl0pIHtcbiAgICAgICAgaXRlbUhvbGRlcnNbMl0uZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIHRoaXMuc2V0Q29udGVudChpdGVtSG9sZGVyc1syXSwgdGhpcy5jdXJySW5kZXggKyAxKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hcHBlbmRIZWF2eSgpO1xuICAgICAgdGhpcy5jb250ZW50TG9hZGVyLnVwZGF0ZUxhenkoKTtcbiAgICAgIHRoaXMuZXZlbnRzLmFkZCh3aW5kb3csICdyZXNpemUnLCB0aGlzLl9oYW5kbGVQYWdlUmVzaXplLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5ldmVudHMuYWRkKHdpbmRvdywgJ3Njcm9sbCcsIHRoaXMuX3VwZGF0ZVBhZ2VTY3JvbGxPZmZzZXQuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLmRpc3BhdGNoKCdiaW5kRXZlbnRzJyk7XG4gICAgfSk7IC8vIHNldCBjb250ZW50IGZvciBjZW50ZXIgc2xpZGUgKGZpcnN0IHRpbWUpXG5cbiAgICBpZiAodGhpcy5tYWluU2Nyb2xsLml0ZW1Ib2xkZXJzWzFdKSB7XG4gICAgICB0aGlzLnNldENvbnRlbnQodGhpcy5tYWluU2Nyb2xsLml0ZW1Ib2xkZXJzWzFdLCB0aGlzLmN1cnJJbmRleCk7XG4gICAgfVxuXG4gICAgdGhpcy5kaXNwYXRjaCgnY2hhbmdlJyk7XG4gICAgdGhpcy5vcGVuZXIub3BlbigpO1xuICAgIHRoaXMuZGlzcGF0Y2goJ2FmdGVySW5pdCcpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIC8qKlxyXG4gICAqIEdldCBsb29wZWQgc2xpZGUgaW5kZXhcclxuICAgKiAoZm9yIGV4YW1wbGUsIC0xIHdpbGwgcmV0dXJuIHRoZSBsYXN0IHNsaWRlKVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XHJcbiAgICogQHJldHVybnMge251bWJlcn1cclxuICAgKi9cblxuXG4gIGdldExvb3BlZEluZGV4KGluZGV4KSB7XG4gICAgY29uc3QgbnVtU2xpZGVzID0gdGhpcy5nZXROdW1JdGVtcygpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5sb29wKSB7XG4gICAgICBpZiAoaW5kZXggPiBudW1TbGlkZXMgLSAxKSB7XG4gICAgICAgIGluZGV4IC09IG51bVNsaWRlcztcbiAgICAgIH1cblxuICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICBpbmRleCArPSBudW1TbGlkZXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNsYW1wKGluZGV4LCAwLCBudW1TbGlkZXMgLSAxKTtcbiAgfVxuXG4gIGFwcGVuZEhlYXZ5KCkge1xuICAgIHRoaXMubWFpblNjcm9sbC5pdGVtSG9sZGVycy5mb3JFYWNoKGl0ZW1Ib2xkZXIgPT4ge1xuICAgICAgdmFyIF9pdGVtSG9sZGVyJHNsaWRlO1xuXG4gICAgICAoX2l0ZW1Ib2xkZXIkc2xpZGUgPSBpdGVtSG9sZGVyLnNsaWRlKSA9PT0gbnVsbCB8fCBfaXRlbUhvbGRlciRzbGlkZSA9PT0gdm9pZCAwIHx8IF9pdGVtSG9sZGVyJHNsaWRlLmFwcGVuZEhlYXZ5KCk7XG4gICAgfSk7XG4gIH1cbiAgLyoqXHJcbiAgICogQ2hhbmdlIHRoZSBzbGlkZVxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBOZXcgaW5kZXhcclxuICAgKi9cblxuXG4gIGdvVG8oaW5kZXgpIHtcbiAgICB0aGlzLm1haW5TY3JvbGwubW92ZUluZGV4QnkodGhpcy5nZXRMb29wZWRJbmRleChpbmRleCkgLSB0aGlzLnBvdGVudGlhbEluZGV4KTtcbiAgfVxuICAvKipcclxuICAgKiBHbyB0byB0aGUgbmV4dCBzbGlkZS5cclxuICAgKi9cblxuXG4gIG5leHQoKSB7XG4gICAgdGhpcy5nb1RvKHRoaXMucG90ZW50aWFsSW5kZXggKyAxKTtcbiAgfVxuICAvKipcclxuICAgKiBHbyB0byB0aGUgcHJldmlvdXMgc2xpZGUuXHJcbiAgICovXG5cblxuICBwcmV2KCkge1xuICAgIHRoaXMuZ29Ubyh0aGlzLnBvdGVudGlhbEluZGV4IC0gMSk7XG4gIH1cbiAgLyoqXHJcbiAgICogQHNlZSBzbGlkZS9zbGlkZS5qcyB6b29tVG9cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7UGFyYW1ldGVyczxTbGlkZVsnem9vbVRvJ10+fSBhcmdzXHJcbiAgICovXG5cblxuICB6b29tVG8oLi4uYXJncykge1xuICAgIHZhciBfdGhpcyRjdXJyU2xpZGU7XG5cbiAgICAoX3RoaXMkY3VyclNsaWRlID0gdGhpcy5jdXJyU2xpZGUpID09PSBudWxsIHx8IF90aGlzJGN1cnJTbGlkZSA9PT0gdm9pZCAwIHx8IF90aGlzJGN1cnJTbGlkZS56b29tVG8oLi4uYXJncyk7XG4gIH1cbiAgLyoqXHJcbiAgICogQHNlZSBzbGlkZS9zbGlkZS5qcyB0b2dnbGVab29tXHJcbiAgICovXG5cblxuICB0b2dnbGVab29tKCkge1xuICAgIHZhciBfdGhpcyRjdXJyU2xpZGUyO1xuXG4gICAgKF90aGlzJGN1cnJTbGlkZTIgPSB0aGlzLmN1cnJTbGlkZSkgPT09IG51bGwgfHwgX3RoaXMkY3VyclNsaWRlMiA9PT0gdm9pZCAwIHx8IF90aGlzJGN1cnJTbGlkZTIudG9nZ2xlWm9vbSgpO1xuICB9XG4gIC8qKlxyXG4gICAqIENsb3NlIHRoZSBnYWxsZXJ5LlxyXG4gICAqIEFmdGVyIGNsb3NpbmcgdHJhbnNpdGlvbiBlbmRzIC0gZGVzdHJveSBpdFxyXG4gICAqL1xuXG5cbiAgY2xvc2UoKSB7XG4gICAgaWYgKCF0aGlzLm9wZW5lci5pc09wZW4gfHwgdGhpcy5pc0Rlc3Ryb3lpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmlzRGVzdHJveWluZyA9IHRydWU7XG4gICAgdGhpcy5kaXNwYXRjaCgnY2xvc2UnKTtcbiAgICB0aGlzLmV2ZW50cy5yZW1vdmVBbGwoKTtcbiAgICB0aGlzLm9wZW5lci5jbG9zZSgpO1xuICB9XG4gIC8qKlxyXG4gICAqIERlc3Ryb3lzIHRoZSBnYWxsZXJ5OlxyXG4gICAqIC0gaW5zdGFudGx5IGNsb3NlcyB0aGUgZ2FsbGVyeVxyXG4gICAqIC0gdW5iaW5kcyBldmVudHMsXHJcbiAgICogLSBjbGVhbnMgaW50ZXJ2YWxzIGFuZCB0aW1lb3V0c1xyXG4gICAqIC0gcmVtb3ZlcyBlbGVtZW50cyBmcm9tIERPTVxyXG4gICAqL1xuXG5cbiAgZGVzdHJveSgpIHtcbiAgICB2YXIgX3RoaXMkZWxlbWVudDtcblxuICAgIGlmICghdGhpcy5pc0Rlc3Ryb3lpbmcpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5zaG93SGlkZUFuaW1hdGlvblR5cGUgPSAnbm9uZSc7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5kaXNwYXRjaCgnZGVzdHJveScpO1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuXG4gICAgaWYgKHRoaXMuc2Nyb2xsV3JhcCkge1xuICAgICAgdGhpcy5zY3JvbGxXcmFwLm9udG91Y2htb3ZlID0gbnVsbDtcbiAgICAgIHRoaXMuc2Nyb2xsV3JhcC5vbnRvdWNoZW5kID0gbnVsbDtcbiAgICB9XG5cbiAgICAoX3RoaXMkZWxlbWVudCA9IHRoaXMuZWxlbWVudCkgPT09IG51bGwgfHwgX3RoaXMkZWxlbWVudCA9PT0gdm9pZCAwIHx8IF90aGlzJGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgdGhpcy5tYWluU2Nyb2xsLml0ZW1Ib2xkZXJzLmZvckVhY2goaXRlbUhvbGRlciA9PiB7XG4gICAgICB2YXIgX2l0ZW1Ib2xkZXIkc2xpZGUyO1xuXG4gICAgICAoX2l0ZW1Ib2xkZXIkc2xpZGUyID0gaXRlbUhvbGRlci5zbGlkZSkgPT09IG51bGwgfHwgX2l0ZW1Ib2xkZXIkc2xpZGUyID09PSB2b2lkIDAgfHwgX2l0ZW1Ib2xkZXIkc2xpZGUyLmRlc3Ryb3koKTtcbiAgICB9KTtcbiAgICB0aGlzLmNvbnRlbnRMb2FkZXIuZGVzdHJveSgpO1xuICAgIHRoaXMuZXZlbnRzLnJlbW92ZUFsbCgpO1xuICB9XG4gIC8qKlxyXG4gICAqIFJlZnJlc2gvcmVsb2FkIGNvbnRlbnQgb2YgYSBzbGlkZSBieSBpdHMgaW5kZXhcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzbGlkZUluZGV4XHJcbiAgICovXG5cblxuICByZWZyZXNoU2xpZGVDb250ZW50KHNsaWRlSW5kZXgpIHtcbiAgICB0aGlzLmNvbnRlbnRMb2FkZXIucmVtb3ZlQnlJbmRleChzbGlkZUluZGV4KTtcbiAgICB0aGlzLm1haW5TY3JvbGwuaXRlbUhvbGRlcnMuZm9yRWFjaCgoaXRlbUhvbGRlciwgaSkgPT4ge1xuICAgICAgdmFyIF90aGlzJGN1cnJTbGlkZSRpbmRleCwgX3RoaXMkY3VyclNsaWRlMztcblxuICAgICAgbGV0IHBvdGVudGlhbEhvbGRlckluZGV4ID0gKChfdGhpcyRjdXJyU2xpZGUkaW5kZXggPSAoX3RoaXMkY3VyclNsaWRlMyA9IHRoaXMuY3VyclNsaWRlKSA9PT0gbnVsbCB8fCBfdGhpcyRjdXJyU2xpZGUzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfdGhpcyRjdXJyU2xpZGUzLmluZGV4KSAhPT0gbnVsbCAmJiBfdGhpcyRjdXJyU2xpZGUkaW5kZXggIT09IHZvaWQgMCA/IF90aGlzJGN1cnJTbGlkZSRpbmRleCA6IDApIC0gMSArIGk7XG5cbiAgICAgIGlmICh0aGlzLmNhbkxvb3AoKSkge1xuICAgICAgICBwb3RlbnRpYWxIb2xkZXJJbmRleCA9IHRoaXMuZ2V0TG9vcGVkSW5kZXgocG90ZW50aWFsSG9sZGVySW5kZXgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocG90ZW50aWFsSG9sZGVySW5kZXggPT09IHNsaWRlSW5kZXgpIHtcbiAgICAgICAgLy8gc2V0IHRoZSBuZXcgc2xpZGUgY29udGVudFxuICAgICAgICB0aGlzLnNldENvbnRlbnQoaXRlbUhvbGRlciwgc2xpZGVJbmRleCwgdHJ1ZSk7IC8vIGFjdGl2YXRlIHRoZSBuZXcgc2xpZGUgaWYgaXQncyBjdXJyZW50XG5cbiAgICAgICAgaWYgKGkgPT09IDEpIHtcbiAgICAgICAgICB2YXIgX2l0ZW1Ib2xkZXIkc2xpZGUzO1xuXG4gICAgICAgICAgdGhpcy5jdXJyU2xpZGUgPSBpdGVtSG9sZGVyLnNsaWRlO1xuICAgICAgICAgIChfaXRlbUhvbGRlciRzbGlkZTMgPSBpdGVtSG9sZGVyLnNsaWRlKSA9PT0gbnVsbCB8fCBfaXRlbUhvbGRlciRzbGlkZTMgPT09IHZvaWQgMCB8fCBfaXRlbUhvbGRlciRzbGlkZTMuc2V0SXNBY3RpdmUodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmRpc3BhdGNoKCdjaGFuZ2UnKTtcbiAgfVxuICAvKipcclxuICAgKiBTZXQgc2xpZGUgY29udGVudFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtJdGVtSG9sZGVyfSBob2xkZXIgbWFpblNjcm9sbC5pdGVtSG9sZGVycyBhcnJheSBpdGVtXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFNsaWRlIGluZGV4XHJcbiAgICogQHBhcmFtIHtib29sZWFufSBbZm9yY2VdIElmIGNvbnRlbnQgc2hvdWxkIGJlIHNldCBldmVuIGlmIGluZGV4IHdhc24ndCBjaGFuZ2VkXHJcbiAgICovXG5cblxuICBzZXRDb250ZW50KGhvbGRlciwgaW5kZXgsIGZvcmNlKSB7XG4gICAgaWYgKHRoaXMuY2FuTG9vcCgpKSB7XG4gICAgICBpbmRleCA9IHRoaXMuZ2V0TG9vcGVkSW5kZXgoaW5kZXgpO1xuICAgIH1cblxuICAgIGlmIChob2xkZXIuc2xpZGUpIHtcbiAgICAgIGlmIChob2xkZXIuc2xpZGUuaW5kZXggPT09IGluZGV4ICYmICFmb3JjZSkge1xuICAgICAgICAvLyBleGl0IGlmIGhvbGRlciBhbHJlYWR5IGNvbnRhaW5zIHRoaXMgc2xpZGVcbiAgICAgICAgLy8gdGhpcyBjb3VsZCBiZSBjb21tb24gd2hlbiBqdXN0IHRocmVlIHNsaWRlcyBhcmUgdXNlZFxuICAgICAgICByZXR1cm47XG4gICAgICB9IC8vIGRlc3Ryb3kgcHJldmlvdXMgc2xpZGVcblxuXG4gICAgICBob2xkZXIuc2xpZGUuZGVzdHJveSgpO1xuICAgICAgaG9sZGVyLnNsaWRlID0gdW5kZWZpbmVkO1xuICAgIH0gLy8gZXhpdCBpZiBubyBsb29wIGFuZCBpbmRleCBpcyBvdXQgb2YgYm91bmRzXG5cblxuICAgIGlmICghdGhpcy5jYW5Mb29wKCkgJiYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLmdldE51bUl0ZW1zKCkpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXRlbURhdGEgPSB0aGlzLmdldEl0ZW1EYXRhKGluZGV4KTtcbiAgICBob2xkZXIuc2xpZGUgPSBuZXcgU2xpZGUoaXRlbURhdGEsIGluZGV4LCB0aGlzKTsgLy8gc2V0IGN1cnJlbnQgc2xpZGVcblxuICAgIGlmIChpbmRleCA9PT0gdGhpcy5jdXJySW5kZXgpIHtcbiAgICAgIHRoaXMuY3VyclNsaWRlID0gaG9sZGVyLnNsaWRlO1xuICAgIH1cblxuICAgIGhvbGRlci5zbGlkZS5hcHBlbmQoaG9sZGVyLmVsKTtcbiAgfVxuICAvKiogQHJldHVybnMge1BvaW50fSAqL1xuXG5cbiAgZ2V0Vmlld3BvcnRDZW50ZXJQb2ludCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgeDogdGhpcy52aWV3cG9ydFNpemUueCAvIDIsXG4gICAgICB5OiB0aGlzLnZpZXdwb3J0U2l6ZS55IC8gMlxuICAgIH07XG4gIH1cbiAgLyoqXHJcbiAgICogVXBkYXRlIHNpemUgb2YgYWxsIGVsZW1lbnRzLlxyXG4gICAqIEV4ZWN1dGVkIG9uIGluaXQgYW5kIG9uIHBhZ2UgcmVzaXplLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtib29sZWFufSBbZm9yY2VdIFVwZGF0ZSBzaXplIGV2ZW4gaWYgc2l6ZSBvZiB2aWV3cG9ydCB3YXMgbm90IGNoYW5nZWQuXHJcbiAgICovXG5cblxuICB1cGRhdGVTaXplKGZvcmNlKSB7XG4gICAgLy8gbGV0IGl0ZW07XG4gICAgLy8gbGV0IGl0ZW1JbmRleDtcbiAgICBpZiAodGhpcy5pc0Rlc3Ryb3lpbmcpIHtcbiAgICAgIC8vIGV4aXQgaWYgUGhvdG9Td2lwZSBpcyBjbG9zZWQgb3IgY2xvc2luZ1xuICAgICAgLy8gKHRvIGF2b2lkIGVycm9ycywgYXMgcmVzaXplIGV2ZW50IG1pZ2h0IGJlIGRlbGF5ZWQpXG4gICAgICByZXR1cm47XG4gICAgfSAvL2NvbnN0IG5ld1dpZHRoID0gdGhpcy5zY3JvbGxXcmFwLmNsaWVudFdpZHRoO1xuICAgIC8vY29uc3QgbmV3SGVpZ2h0ID0gdGhpcy5zY3JvbGxXcmFwLmNsaWVudEhlaWdodDtcblxuXG4gICAgY29uc3QgbmV3Vmlld3BvcnRTaXplID0gZ2V0Vmlld3BvcnRTaXplKHRoaXMub3B0aW9ucywgdGhpcyk7XG5cbiAgICBpZiAoIWZvcmNlICYmIHBvaW50c0VxdWFsKG5ld1ZpZXdwb3J0U2l6ZSwgdGhpcy5fcHJldlZpZXdwb3J0U2l6ZSkpIHtcbiAgICAgIC8vIEV4aXQgaWYgZGltZW5zaW9ucyB3ZXJlIG5vdCBjaGFuZ2VkXG4gICAgICByZXR1cm47XG4gICAgfSAvL3RoaXMuX3ByZXZWaWV3cG9ydFNpemUueCA9IG5ld1dpZHRoO1xuICAgIC8vdGhpcy5fcHJldlZpZXdwb3J0U2l6ZS55ID0gbmV3SGVpZ2h0O1xuXG5cbiAgICBlcXVhbGl6ZVBvaW50cyh0aGlzLl9wcmV2Vmlld3BvcnRTaXplLCBuZXdWaWV3cG9ydFNpemUpO1xuICAgIHRoaXMuZGlzcGF0Y2goJ2JlZm9yZVJlc2l6ZScpO1xuICAgIGVxdWFsaXplUG9pbnRzKHRoaXMudmlld3BvcnRTaXplLCB0aGlzLl9wcmV2Vmlld3BvcnRTaXplKTtcblxuICAgIHRoaXMuX3VwZGF0ZVBhZ2VTY3JvbGxPZmZzZXQoKTtcblxuICAgIHRoaXMuZGlzcGF0Y2goJ3ZpZXdwb3J0U2l6ZScpOyAvLyBSZXNpemUgc2xpZGVzIG9ubHkgYWZ0ZXIgb3BlbmVyIGFuaW1hdGlvbiBpcyBmaW5pc2hlZFxuICAgIC8vIGFuZCBkb24ndCByZS1jYWxjdWxhdGUgc2l6ZSBvbiBpbml0YWwgc2l6ZSB1cGRhdGVcblxuICAgIHRoaXMubWFpblNjcm9sbC5yZXNpemUodGhpcy5vcGVuZXIuaXNPcGVuKTtcblxuICAgIGlmICghdGhpcy5oYXNNb3VzZSAmJiB3aW5kb3cubWF0Y2hNZWRpYSgnKGFueS1ob3ZlcjogaG92ZXIpJykubWF0Y2hlcykge1xuICAgICAgdGhpcy5tb3VzZURldGVjdGVkKCk7XG4gICAgfVxuXG4gICAgdGhpcy5kaXNwYXRjaCgncmVzaXplJyk7XG4gIH1cbiAgLyoqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IG9wYWNpdHlcclxuICAgKi9cblxuXG4gIGFwcGx5QmdPcGFjaXR5KG9wYWNpdHkpIHtcbiAgICB0aGlzLmJnT3BhY2l0eSA9IE1hdGgubWF4KG9wYWNpdHksIDApO1xuXG4gICAgaWYgKHRoaXMuYmcpIHtcbiAgICAgIHRoaXMuYmcuc3R5bGUub3BhY2l0eSA9IFN0cmluZyh0aGlzLmJnT3BhY2l0eSAqIHRoaXMub3B0aW9ucy5iZ09wYWNpdHkpO1xuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBXaGV0aGVyIG1vdXNlIGlzIGRldGVjdGVkXHJcbiAgICovXG5cblxuICBtb3VzZURldGVjdGVkKCkge1xuICAgIGlmICghdGhpcy5oYXNNb3VzZSkge1xuICAgICAgdmFyIF90aGlzJGVsZW1lbnQyO1xuXG4gICAgICB0aGlzLmhhc01vdXNlID0gdHJ1ZTtcbiAgICAgIChfdGhpcyRlbGVtZW50MiA9IHRoaXMuZWxlbWVudCkgPT09IG51bGwgfHwgX3RoaXMkZWxlbWVudDIgPT09IHZvaWQgMCB8fCBfdGhpcyRlbGVtZW50Mi5jbGFzc0xpc3QuYWRkKCdwc3dwLS1oYXNfbW91c2UnKTtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogUGFnZSByZXNpemUgZXZlbnQgaGFuZGxlclxyXG4gICAqXHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cblxuXG4gIF9oYW5kbGVQYWdlUmVzaXplKCkge1xuICAgIHRoaXMudXBkYXRlU2l6ZSgpOyAvLyBJbiBpT1Mgd2VidmlldywgaWYgZWxlbWVudCBzaXplIGRlcGVuZHMgb24gZG9jdW1lbnQgc2l6ZSxcbiAgICAvLyBpdCdsbCBiZSBtZWFzdXJlZCBpbmNvcnJlY3RseSBpbiByZXNpemUgZXZlbnRcbiAgICAvL1xuICAgIC8vIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNzA1OTVcbiAgICAvLyBodHRwczovL2hhY2tlcm5vb24uY29tL29ucmVzaXplLWV2ZW50LWJyb2tlbi1pbi1tb2JpbGUtc2FmYXJpLWQ4NDY5MDI3YmY0ZFxuXG4gICAgaWYgKC9pUGhvbmV8aVBhZHxpUG9kL2kudGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVNpemUoKTtcbiAgICAgIH0sIDUwMCk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIFBhZ2Ugc2Nyb2xsIG9mZnNldCBpcyB1c2VkXHJcbiAgICogdG8gZ2V0IGNvcnJlY3QgY29vcmRpbmF0ZXNcclxuICAgKiByZWxhdGl2ZSB0byBQaG90b1N3aXBlIHZpZXdwb3J0LlxyXG4gICAqXHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cblxuXG4gIF91cGRhdGVQYWdlU2Nyb2xsT2Zmc2V0KCkge1xuICAgIHRoaXMuc2V0U2Nyb2xsT2Zmc2V0KDAsIHdpbmRvdy5wYWdlWU9mZnNldCk7XG4gIH1cbiAgLyoqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICAgKiBAcGFyYW0ge251bWJlcn0geVxyXG4gICAqL1xuXG5cbiAgc2V0U2Nyb2xsT2Zmc2V0KHgsIHkpIHtcbiAgICB0aGlzLm9mZnNldC54ID0geDtcbiAgICB0aGlzLm9mZnNldC55ID0geTtcbiAgICB0aGlzLmRpc3BhdGNoKCd1cGRhdGVTY3JvbGxPZmZzZXQnKTtcbiAgfVxuICAvKipcclxuICAgKiBDcmVhdGUgbWFpbiBIVE1MIHN0cnVjdHVyZSBvZiBQaG90b1N3aXBlLFxyXG4gICAqIGFuZCBhZGQgaXQgdG8gRE9NXHJcbiAgICpcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xuXG5cbiAgX2NyZWF0ZU1haW5TdHJ1Y3R1cmUoKSB7XG4gICAgLy8gcm9vdCBET00gZWxlbWVudCBvZiBQaG90b1N3aXBlICgucHN3cClcbiAgICB0aGlzLmVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCdwc3dwJywgJ2RpdicpO1xuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdkaWFsb2cnKTsgLy8gdGVtcGxhdGUgaXMgbGVnYWN5IHByb3BcblxuICAgIHRoaXMudGVtcGxhdGUgPSB0aGlzLmVsZW1lbnQ7IC8vIEJhY2tncm91bmQgaXMgYWRkZWQgYXMgYSBzZXBhcmF0ZSBlbGVtZW50LFxuICAgIC8vIGFzIGFuaW1hdGluZyBvcGFjaXR5IGlzIGZhc3RlciB0aGFuIGFuaW1hdGluZyByZ2JhKClcblxuICAgIHRoaXMuYmcgPSBjcmVhdGVFbGVtZW50KCdwc3dwX19iZycsICdkaXYnLCB0aGlzLmVsZW1lbnQpO1xuICAgIHRoaXMuc2Nyb2xsV3JhcCA9IGNyZWF0ZUVsZW1lbnQoJ3Bzd3BfX3Njcm9sbC13cmFwJywgJ3NlY3Rpb24nLCB0aGlzLmVsZW1lbnQpO1xuICAgIHRoaXMuY29udGFpbmVyID0gY3JlYXRlRWxlbWVudCgncHN3cF9fY29udGFpbmVyJywgJ2RpdicsIHRoaXMuc2Nyb2xsV3JhcCk7IC8vIGFyaWEgcGF0dGVybjogY2Fyb3VzZWxcblxuICAgIHRoaXMuc2Nyb2xsV3JhcC5zZXRBdHRyaWJ1dGUoJ2FyaWEtcm9sZWRlc2NyaXB0aW9uJywgJ2Nhcm91c2VsJyk7XG4gICAgdGhpcy5jb250YWluZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCAnb2ZmJyk7XG4gICAgdGhpcy5jb250YWluZXIuc2V0QXR0cmlidXRlKCdpZCcsICdwc3dwX19pdGVtcycpO1xuICAgIHRoaXMubWFpblNjcm9sbC5hcHBlbmRIb2xkZXJzKCk7XG4gICAgdGhpcy51aSA9IG5ldyBVSSh0aGlzKTtcbiAgICB0aGlzLnVpLmluaXQoKTsgLy8gYXBwZW5kIHRvIERPTVxuXG4gICAgKHRoaXMub3B0aW9ucy5hcHBlbmRUb0VsIHx8IGRvY3VtZW50LmJvZHkpLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XG4gIH1cbiAgLyoqXHJcbiAgICogR2V0IHBvc2l0aW9uIGFuZCBkaW1lbnNpb25zIG9mIHNtYWxsIHRodW1ibmFpbFxyXG4gICAqICAge3g6LHk6LHc6fVxyXG4gICAqXHJcbiAgICogSGVpZ2h0IGlzIG9wdGlvbmFsIChjYWxjdWxhdGVkIGJhc2VkIG9uIHRoZSBsYXJnZSBpbWFnZSlcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtCb3VuZHMgfCB1bmRlZmluZWR9XHJcbiAgICovXG5cblxuICBnZXRUaHVtYkJvdW5kcygpIHtcbiAgICByZXR1cm4gZ2V0VGh1bWJCb3VuZHModGhpcy5jdXJySW5kZXgsIHRoaXMuY3VyclNsaWRlID8gdGhpcy5jdXJyU2xpZGUuZGF0YSA6IHRoaXMuX2luaXRpYWxJdGVtRGF0YSwgdGhpcyk7XG4gIH1cbiAgLyoqXHJcbiAgICogSWYgdGhlIFBob3RvU3dpcGUgY2FuIGhhdmUgY29udGludW91cyBsb29wXHJcbiAgICogQHJldHVybnMgQm9vbGVhblxyXG4gICAqL1xuXG5cbiAgY2FuTG9vcCgpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmxvb3AgJiYgdGhpcy5nZXROdW1JdGVtcygpID4gMjtcbiAgfVxuICAvKipcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEBwYXJhbSB7UGhvdG9Td2lwZU9wdGlvbnN9IG9wdGlvbnNcclxuICAgKiBAcmV0dXJucyB7UHJlcGFyZWRQaG90b1N3aXBlT3B0aW9uc31cclxuICAgKi9cblxuXG4gIF9wcmVwYXJlT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1yZWR1Y2VkLW1vdGlvbiksICh1cGRhdGU6IHNsb3cpJykubWF0Y2hlcykge1xuICAgICAgb3B0aW9ucy5zaG93SGlkZUFuaW1hdGlvblR5cGUgPSAnbm9uZSc7XG4gICAgICBvcHRpb25zLnpvb21BbmltYXRpb25EdXJhdGlvbiA9IDA7XG4gICAgfVxuICAgIC8qKiBAdHlwZSB7UHJlcGFyZWRQaG90b1N3aXBlT3B0aW9uc30gKi9cblxuXG4gICAgcmV0dXJuIHsgLi4uZGVmYXVsdE9wdGlvbnMsXG4gICAgICAuLi5vcHRpb25zXG4gICAgfTtcbiAgfVxuXG59XG5cbmV4cG9ydCB7IFBob3RvU3dpcGUgYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGhvdG9zd2lwZS5lc20uanMubWFwXG4iLCIvLyBAdHMtbm9jaGVja1xuaW1wb3J0IHBob3Rvc3dpcGUgZnJvbSAncGhvdG9zd2lwZSc7XG5leHBvcnQgZGVmYXVsdCBwaG90b3N3aXBlO1xuIl0sInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7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