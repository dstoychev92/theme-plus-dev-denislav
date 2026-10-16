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
//#region ../node_modules/photoswipe/dist/photoswipe-lightbox.esm.js
/*!
* PhotoSwipe Lightbox 5.4.4 - https://photoswipe.com
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
* Check if variable is PhotoSwipe class
*
* @param {any} fn
* @returns {boolean}
*/
function isPswpClass(fn) {
	return typeof fn === "function" && fn.prototype && fn.prototype.goTo;
}
/**
* Check if browser is Safari
*
* @returns {boolean}
*/
function isSafari() {
	return !!(navigator.vendor && navigator.vendor.match(/apple/i));
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
/**
* @template T
* @typedef {import('../types.js').Type<T>} Type<T>
*/
/** @typedef {import('../photoswipe.js').default} PhotoSwipe */
/** @typedef {import('../photoswipe.js').PhotoSwipeOptions} PhotoSwipeOptions */
/** @typedef {import('../photoswipe.js').DataSource} DataSource */
/** @typedef {import('../photoswipe.js').Point} Point */
/** @typedef {import('../slide/content.js').default} Content */
/** @typedef {import('../core/eventable.js').PhotoSwipeEventsMap} PhotoSwipeEventsMap */
/** @typedef {import('../core/eventable.js').PhotoSwipeFiltersMap} PhotoSwipeFiltersMap */
/**
* @template {keyof PhotoSwipeEventsMap} T
* @typedef {import('../core/eventable.js').EventCallback<T>} EventCallback<T>
*/
/**
* PhotoSwipe Lightbox
*
* - If user has unsupported browser it falls back to default browser action (just opens URL)
* - Binds click event to links that should open PhotoSwipe
* - parses DOM strcture for PhotoSwipe (retrieves large image URLs and sizes)
* - Initializes PhotoSwipe
*
*
* Loader options use the same object as PhotoSwipe, and supports such options:
*
* gallery - Element | Element[] | NodeList | string selector for the gallery element
* children - Element | Element[] | NodeList | string selector for the gallery children
*
*/
var PhotoSwipeLightbox = class extends PhotoSwipeBase {
	/**
	* @param {PhotoSwipeOptions} [options]
	*/
	constructor(options) {
		super();
		/** @type {PhotoSwipeOptions} */
		this.options = options || {};
		this._uid = 0;
		this.shouldOpen = false;
		/**
		* @private
		* @type {Content | undefined}
		*/
		this._preloadedContent = void 0;
		this.onThumbnailsClick = this.onThumbnailsClick.bind(this);
	}
	/**
	* Initialize lightbox, should be called only once.
	* It's not included in the main constructor, so you may bind events before it.
	*/
	init() {
		getElementsFromOption(this.options.gallery, this.options.gallerySelector).forEach((galleryElement) => {
			galleryElement.addEventListener("click", this.onThumbnailsClick, false);
		});
	}
	/**
	* @param {MouseEvent} e
	*/
	onThumbnailsClick(e) {
		if (specialKeyUsed(e) || window.pswp) return;
		/** @type {Point | null} */
		let initialPoint = {
			x: e.clientX,
			y: e.clientY
		};
		if (!initialPoint.x && !initialPoint.y) initialPoint = null;
		let clickedIndex = this.getClickedIndex(e);
		clickedIndex = this.applyFilters("clickedIndex", clickedIndex, e, this);
		/** @type {DataSource} */
		const dataSource = { gallery: 
		/** @type {HTMLElement} */
		e.currentTarget };
		if (clickedIndex >= 0) {
			e.preventDefault();
			this.loadAndOpen(clickedIndex, dataSource, initialPoint);
		}
	}
	/**
	* Get index of gallery item that was clicked.
	*
	* @param {MouseEvent} e click event
	* @returns {number}
	*/
	getClickedIndex(e) {
		if (this.options.getClickedIndexFn) return this.options.getClickedIndexFn.call(this, e);
		const clickedTarget = e.target;
		const clickedChildIndex = getElementsFromOption(
			this.options.children,
			this.options.childSelector,
			/** @type {HTMLElement} */
			e.currentTarget
		).findIndex((child) => child === clickedTarget || child.contains(clickedTarget));
		if (clickedChildIndex !== -1) return clickedChildIndex;
		else if (this.options.children || this.options.childSelector) return -1;
		return 0;
	}
	/**
	* Load and open PhotoSwipe
	*
	* @param {number} index
	* @param {DataSource} [dataSource]
	* @param {Point | null} [initialPoint]
	* @returns {boolean}
	*/
	loadAndOpen(index, dataSource, initialPoint) {
		if (window.pswp || !this.options) return false;
		if (!dataSource && this.options.gallery && this.options.children) {
			const galleryElements = getElementsFromOption(this.options.gallery);
			if (galleryElements[0]) dataSource = { gallery: galleryElements[0] };
		}
		this.options.index = index;
		this.options.initialPointerPos = initialPoint;
		this.shouldOpen = true;
		this.preload(index, dataSource);
		return true;
	}
	/**
	* Load the main module and the slide content by index
	*
	* @param {number} index
	* @param {DataSource} [dataSource]
	*/
	preload(index, dataSource) {
		const { options } = this;
		if (dataSource) options.dataSource = dataSource;
		/** @type {Promise<Type<PhotoSwipe>>[]} */
		const promiseArray = [];
		const pswpModuleType = typeof options.pswpModule;
		if (isPswpClass(options.pswpModule)) promiseArray.push(Promise.resolve(
			/** @type {Type<PhotoSwipe>} */
			options.pswpModule
		));
		else if (pswpModuleType === "string") throw new Error("pswpModule as string is no longer supported");
		else if (pswpModuleType === "function") promiseArray.push(
			/** @type {() => Promise<Type<PhotoSwipe>>} */
			options.pswpModule()
		);
		else throw new Error("pswpModule is not valid");
		if (typeof options.openPromise === "function") promiseArray.push(options.openPromise());
		if (options.preloadFirstSlide !== false && index >= 0) this._preloadedContent = lazyLoadSlide(index, this);
		const uid = ++this._uid;
		Promise.all(promiseArray).then((iterableModules) => {
			if (this.shouldOpen) {
				const mainModule = iterableModules[0];
				this._openPhotoswipe(mainModule, uid);
			}
		});
	}
	/**
	* @private
	* @param {Type<PhotoSwipe> | { default: Type<PhotoSwipe> }} module
	* @param {number} uid
	*/
	_openPhotoswipe(module, uid) {
		if (uid !== this._uid && this.shouldOpen) return;
		this.shouldOpen = false;
		if (window.pswp) return;
		/**
		* Pass data to PhotoSwipe and open init
		*
		* @type {PhotoSwipe}
		*/
		const pswp = typeof module === "object" ? new module.default(this.options) : new module(this.options);
		this.pswp = pswp;
		window.pswp = pswp;
		/** @type {(keyof PhotoSwipeEventsMap)[]} */
		Object.keys(this._listeners).forEach((name) => {
			var _this$_listeners$name;
			(_this$_listeners$name = this._listeners[name]) === null || _this$_listeners$name === void 0 || _this$_listeners$name.forEach((fn) => {
				pswp.on(
					name,
					/** @type {EventCallback<typeof name>} */
					fn
				);
			});
		});
		/** @type {(keyof PhotoSwipeFiltersMap)[]} */
		Object.keys(this._filters).forEach((name) => {
			var _this$_filters$name;
			(_this$_filters$name = this._filters[name]) === null || _this$_filters$name === void 0 || _this$_filters$name.forEach((filter) => {
				pswp.addFilter(name, filter.fn, filter.priority);
			});
		});
		if (this._preloadedContent) {
			pswp.contentLoader.addToCache(this._preloadedContent);
			this._preloadedContent = void 0;
		}
		pswp.on("destroy", () => {
			this.pswp = void 0;
			delete window.pswp;
		});
		pswp.init();
	}
	/**
	* Unbinds all events, closes PhotoSwipe if it's open.
	*/
	destroy() {
		var _this$pswp;
		(_this$pswp = this.pswp) === null || _this$pswp === void 0 || _this$pswp.destroy();
		this.shouldOpen = false;
		this._listeners = {};
		getElementsFromOption(this.options.gallery, this.options.gallerySelector).forEach((galleryElement) => {
			galleryElement.removeEventListener("click", this.onThumbnailsClick, false);
		});
	}
};

//#endregion
export { PhotoSwipeLightbox as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVuZG9yLnBob3Rvc3dpcGUubGlnaHRib3guanMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL3Bob3Rvc3dpcGUvZGlzdC9waG90b3N3aXBlLWxpZ2h0Ym94LmVzbS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAgKiBQaG90b1N3aXBlIExpZ2h0Ym94IDUuNC40IC0gaHR0cHM6Ly9waG90b3N3aXBlLmNvbVxuICAqIChjKSAyMDI0IERteXRybyBTZW1lbm92XG4gICovXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4vcGhvdG9zd2lwZS5qcycpLlBvaW50fSBQb2ludCAqL1xuXG4vKipcclxuICogQHRlbXBsYXRlIHtrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXB9IFRcclxuICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxyXG4gKiBAcGFyYW0ge1R9IHRhZ05hbWVcclxuICogQHBhcmFtIHtOb2RlfSBbYXBwZW5kVG9FbF1cclxuICogQHJldHVybnMge0hUTUxFbGVtZW50VGFnTmFtZU1hcFtUXX1cclxuICovXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50KGNsYXNzTmFtZSwgdGFnTmFtZSwgYXBwZW5kVG9FbCkge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG5cbiAgaWYgKGNsYXNzTmFtZSkge1xuICAgIGVsLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgfVxuXG4gIGlmIChhcHBlbmRUb0VsKSB7XG4gICAgYXBwZW5kVG9FbC5hcHBlbmRDaGlsZChlbCk7XG4gIH1cblxuICByZXR1cm4gZWw7XG59XG4vKipcclxuICogR2V0IHRyYW5zZm9ybSBzdHJpbmdcclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IHhcclxuICogQHBhcmFtIHtudW1iZXJ9IFt5XVxyXG4gKiBAcGFyYW0ge251bWJlcn0gW3NjYWxlXVxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKi9cblxuZnVuY3Rpb24gdG9UcmFuc2Zvcm1TdHJpbmcoeCwgeSwgc2NhbGUpIHtcbiAgbGV0IHByb3BWYWx1ZSA9IGB0cmFuc2xhdGUzZCgke3h9cHgsJHt5IHx8IDB9cHgsMClgO1xuXG4gIGlmIChzY2FsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcHJvcFZhbHVlICs9IGAgc2NhbGUzZCgke3NjYWxlfSwke3NjYWxlfSwxKWA7XG4gIH1cblxuICByZXR1cm4gcHJvcFZhbHVlO1xufVxuLyoqXHJcbiAqIEFwcGx5IHdpZHRoIGFuZCBoZWlnaHQgQ1NTIHByb3BlcnRpZXMgdG8gZWxlbWVudFxyXG4gKlxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxyXG4gKiBAcGFyYW0ge3N0cmluZyB8IG51bWJlcn0gd1xyXG4gKiBAcGFyYW0ge3N0cmluZyB8IG51bWJlcn0gaFxyXG4gKi9cblxuZnVuY3Rpb24gc2V0V2lkdGhIZWlnaHQoZWwsIHcsIGgpIHtcbiAgZWwuc3R5bGUud2lkdGggPSB0eXBlb2YgdyA9PT0gJ251bWJlcicgPyBgJHt3fXB4YCA6IHc7XG4gIGVsLnN0eWxlLmhlaWdodCA9IHR5cGVvZiBoID09PSAnbnVtYmVyJyA/IGAke2h9cHhgIDogaDtcbn1cbi8qKiBAdHlwZWRlZiB7TE9BRF9TVEFURVtrZXlvZiBMT0FEX1NUQVRFXX0gTG9hZFN0YXRlICovXG5cbi8qKiBAdHlwZSB7eyBJRExFOiAnaWRsZSc7IExPQURJTkc6ICdsb2FkaW5nJzsgTE9BREVEOiAnbG9hZGVkJzsgRVJST1I6ICdlcnJvcicgfX0gKi9cblxuY29uc3QgTE9BRF9TVEFURSA9IHtcbiAgSURMRTogJ2lkbGUnLFxuICBMT0FESU5HOiAnbG9hZGluZycsXG4gIExPQURFRDogJ2xvYWRlZCcsXG4gIEVSUk9SOiAnZXJyb3InXG59O1xuLyoqXHJcbiAqIENoZWNrIGlmIGNsaWNrIG9yIGtleWRvd24gZXZlbnQgd2FzIGRpc3BhdGNoZWRcclxuICogd2l0aCBhIHNwZWNpYWwga2V5IG9yIHZpYSBtb3VzZSB3aGVlbC5cclxuICpcclxuICogQHBhcmFtIHtNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudH0gZVxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXG5cbmZ1bmN0aW9uIHNwZWNpYWxLZXlVc2VkKGUpIHtcbiAgcmV0dXJuICdidXR0b24nIGluIGUgJiYgZS5idXR0b24gPT09IDEgfHwgZS5jdHJsS2V5IHx8IGUubWV0YUtleSB8fCBlLmFsdEtleSB8fCBlLnNoaWZ0S2V5O1xufVxuLyoqXHJcbiAqIFBhcnNlIGBnYWxsZXJ5YCBvciBgY2hpbGRyZW5gIG9wdGlvbnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7aW1wb3J0KCcuLi9waG90b3N3aXBlLmpzJykuRWxlbWVudFByb3ZpZGVyfSBbb3B0aW9uXVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW2xlZ2FjeVNlbGVjdG9yXVxyXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50IHwgRG9jdW1lbnR9IFtwYXJlbnRdXHJcbiAqIEByZXR1cm5zIEhUTUxFbGVtZW50W11cclxuICovXG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRzRnJvbU9wdGlvbihvcHRpb24sIGxlZ2FjeVNlbGVjdG9yLCBwYXJlbnQgPSBkb2N1bWVudCkge1xuICAvKiogQHR5cGUge0hUTUxFbGVtZW50W119ICovXG4gIGxldCBlbGVtZW50cyA9IFtdO1xuXG4gIGlmIChvcHRpb24gaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgZWxlbWVudHMgPSBbb3B0aW9uXTtcbiAgfSBlbHNlIGlmIChvcHRpb24gaW5zdGFuY2VvZiBOb2RlTGlzdCB8fCBBcnJheS5pc0FycmF5KG9wdGlvbikpIHtcbiAgICBlbGVtZW50cyA9IEFycmF5LmZyb20ob3B0aW9uKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBzZWxlY3RvciA9IHR5cGVvZiBvcHRpb24gPT09ICdzdHJpbmcnID8gb3B0aW9uIDogbGVnYWN5U2VsZWN0b3I7XG5cbiAgICBpZiAoc2VsZWN0b3IpIHtcbiAgICAgIGVsZW1lbnRzID0gQXJyYXkuZnJvbShwYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50cztcbn1cbi8qKlxyXG4gKiBDaGVjayBpZiB2YXJpYWJsZSBpcyBQaG90b1N3aXBlIGNsYXNzXHJcbiAqXHJcbiAqIEBwYXJhbSB7YW55fSBmblxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXG5cbmZ1bmN0aW9uIGlzUHN3cENsYXNzKGZuKSB7XG4gIHJldHVybiB0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicgJiYgZm4ucHJvdG90eXBlICYmIGZuLnByb3RvdHlwZS5nb1RvO1xufVxuLyoqXHJcbiAqIENoZWNrIGlmIGJyb3dzZXIgaXMgU2FmYXJpXHJcbiAqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cblxuZnVuY3Rpb24gaXNTYWZhcmkoKSB7XG4gIHJldHVybiAhIShuYXZpZ2F0b3IudmVuZG9yICYmIG5hdmlnYXRvci52ZW5kb3IubWF0Y2goL2FwcGxlL2kpKTtcbn1cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL2xpZ2h0Ym94L2xpZ2h0Ym94LmpzJykuZGVmYXVsdH0gUGhvdG9Td2lwZUxpZ2h0Ym94ICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi9waG90b3N3aXBlLmpzJykuZGVmYXVsdH0gUGhvdG9Td2lwZSAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4vcGhvdG9zd2lwZS5qcycpLlBob3RvU3dpcGVPcHRpb25zfSBQaG90b1N3aXBlT3B0aW9ucyAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4vcGhvdG9zd2lwZS5qcycpLkRhdGFTb3VyY2V9IERhdGFTb3VyY2UgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3VpL3VpLWVsZW1lbnQuanMnKS5VSUVsZW1lbnREYXRhfSBVSUVsZW1lbnREYXRhICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi9zbGlkZS9jb250ZW50LmpzJykuZGVmYXVsdH0gQ29udGVudERlZmF1bHQgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3NsaWRlL3NsaWRlLmpzJykuZGVmYXVsdH0gU2xpZGUgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3NsaWRlL3NsaWRlLmpzJykuU2xpZGVEYXRhfSBTbGlkZURhdGEgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3NsaWRlL3pvb20tbGV2ZWwuanMnKS5kZWZhdWx0fSBab29tTGV2ZWwgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3NsaWRlL2dldC10aHVtYi1ib3VuZHMuanMnKS5Cb3VuZHN9IEJvdW5kcyAqL1xuXG4vKipcclxuICogQWxsb3cgYWRkaW5nIGFuIGFyYml0cmFyeSBwcm9wcyB0byB0aGUgQ29udGVudFxyXG4gKiBodHRwczovL3Bob3Rvc3dpcGUuY29tL2N1c3RvbS1jb250ZW50LyN1c2luZy13ZWJwLWltYWdlLWZvcm1hdFxyXG4gKiBAdHlwZWRlZiB7Q29udGVudERlZmF1bHQgJiBSZWNvcmQ8c3RyaW5nLCBhbnk+fSBDb250ZW50XHJcbiAqL1xuXG4vKiogQHR5cGVkZWYge3sgeD86IG51bWJlcjsgeT86IG51bWJlciB9fSBQb2ludCAqL1xuXG4vKipcclxuICogQHR5cGVkZWYge09iamVjdH0gUGhvdG9Td2lwZUV2ZW50c01hcCBodHRwczovL3Bob3Rvc3dpcGUuY29tL2V2ZW50cy9cclxuICpcclxuICpcclxuICogaHR0cHM6Ly9waG90b3N3aXBlLmNvbS9hZGRpbmctdWktZWxlbWVudHMvXHJcbiAqXHJcbiAqIEBwcm9wIHt1bmRlZmluZWR9IHVpUmVnaXN0ZXJcclxuICogQHByb3Age3sgZGF0YTogVUlFbGVtZW50RGF0YSB9fSB1aUVsZW1lbnRDcmVhdGVcclxuICpcclxuICpcclxuICogaHR0cHM6Ly9waG90b3N3aXBlLmNvbS9ldmVudHMvI2luaXRpYWxpemF0aW9uLWV2ZW50c1xyXG4gKlxyXG4gKiBAcHJvcCB7dW5kZWZpbmVkfSBiZWZvcmVPcGVuXHJcbiAqIEBwcm9wIHt1bmRlZmluZWR9IGZpcnN0VXBkYXRlXHJcbiAqIEBwcm9wIHt1bmRlZmluZWR9IGluaXRpYWxMYXlvdXRcclxuICogQHByb3Age3VuZGVmaW5lZH0gY2hhbmdlXHJcbiAqIEBwcm9wIHt1bmRlZmluZWR9IGFmdGVySW5pdFxyXG4gKiBAcHJvcCB7dW5kZWZpbmVkfSBiaW5kRXZlbnRzXHJcbiAqXHJcbiAqXHJcbiAqIGh0dHBzOi8vcGhvdG9zd2lwZS5jb20vZXZlbnRzLyNvcGVuaW5nLW9yLWNsb3NpbmctdHJhbnNpdGlvbi1ldmVudHNcclxuICpcclxuICogQHByb3Age3VuZGVmaW5lZH0gb3BlbmluZ0FuaW1hdGlvblN0YXJ0XHJcbiAqIEBwcm9wIHt1bmRlZmluZWR9IG9wZW5pbmdBbmltYXRpb25FbmRcclxuICogQHByb3Age3VuZGVmaW5lZH0gY2xvc2luZ0FuaW1hdGlvblN0YXJ0XHJcbiAqIEBwcm9wIHt1bmRlZmluZWR9IGNsb3NpbmdBbmltYXRpb25FbmRcclxuICpcclxuICpcclxuICogaHR0cHM6Ly9waG90b3N3aXBlLmNvbS9ldmVudHMvI2Nsb3NpbmctZXZlbnRzXHJcbiAqXHJcbiAqIEBwcm9wIHt1bmRlZmluZWR9IGNsb3NlXHJcbiAqIEBwcm9wIHt1bmRlZmluZWR9IGRlc3Ryb3lcclxuICpcclxuICpcclxuICogaHR0cHM6Ly9waG90b3N3aXBlLmNvbS9ldmVudHMvI3BvaW50ZXItYW5kLWdlc3R1cmUtZXZlbnRzXHJcbiAqXHJcbiAqIEBwcm9wIHt7IG9yaWdpbmFsRXZlbnQ6IFBvaW50ZXJFdmVudCB9fSBwb2ludGVyRG93blxyXG4gKiBAcHJvcCB7eyBvcmlnaW5hbEV2ZW50OiBQb2ludGVyRXZlbnQgfX0gcG9pbnRlck1vdmVcclxuICogQHByb3Age3sgb3JpZ2luYWxFdmVudDogUG9pbnRlckV2ZW50IH19IHBvaW50ZXJVcFxyXG4gKiBAcHJvcCB7eyBiZ09wYWNpdHk6IG51bWJlciB9fSBwaW5jaENsb3NlIGNhbiBiZSBkZWZhdWx0IHByZXZlbnRlZFxyXG4gKiBAcHJvcCB7eyBwYW5ZOiBudW1iZXIgfX0gdmVydGljYWxEcmFnIGNhbiBiZSBkZWZhdWx0IHByZXZlbnRlZFxyXG4gKlxyXG4gKlxyXG4gKiBodHRwczovL3Bob3Rvc3dpcGUuY29tL2V2ZW50cy8jc2xpZGUtY29udGVudC1ldmVudHNcclxuICpcclxuICogQHByb3Age3sgY29udGVudDogQ29udGVudCB9fSBjb250ZW50SW5pdFxyXG4gKiBAcHJvcCB7eyBjb250ZW50OiBDb250ZW50OyBpc0xhenk6IGJvb2xlYW4gfX0gY29udGVudExvYWQgY2FuIGJlIGRlZmF1bHQgcHJldmVudGVkXHJcbiAqIEBwcm9wIHt7IGNvbnRlbnQ6IENvbnRlbnQ7IGlzTGF6eTogYm9vbGVhbiB9fSBjb250ZW50TG9hZEltYWdlIGNhbiBiZSBkZWZhdWx0IHByZXZlbnRlZFxyXG4gKiBAcHJvcCB7eyBjb250ZW50OiBDb250ZW50OyBzbGlkZTogU2xpZGU7IGlzRXJyb3I/OiBib29sZWFuIH19IGxvYWRDb21wbGV0ZVxyXG4gKiBAcHJvcCB7eyBjb250ZW50OiBDb250ZW50OyBzbGlkZTogU2xpZGUgfX0gbG9hZEVycm9yXHJcbiAqIEBwcm9wIHt7IGNvbnRlbnQ6IENvbnRlbnQ7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH19IGNvbnRlbnRSZXNpemUgY2FuIGJlIGRlZmF1bHQgcHJldmVudGVkXHJcbiAqIEBwcm9wIHt7IGNvbnRlbnQ6IENvbnRlbnQ7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyOyBzbGlkZTogU2xpZGUgfX0gaW1hZ2VTaXplQ2hhbmdlXHJcbiAqIEBwcm9wIHt7IGNvbnRlbnQ6IENvbnRlbnQgfX0gY29udGVudExhenlMb2FkIGNhbiBiZSBkZWZhdWx0IHByZXZlbnRlZFxyXG4gKiBAcHJvcCB7eyBjb250ZW50OiBDb250ZW50IH19IGNvbnRlbnRBcHBlbmQgY2FuIGJlIGRlZmF1bHQgcHJldmVudGVkXHJcbiAqIEBwcm9wIHt7IGNvbnRlbnQ6IENvbnRlbnQgfX0gY29udGVudEFjdGl2YXRlIGNhbiBiZSBkZWZhdWx0IHByZXZlbnRlZFxyXG4gKiBAcHJvcCB7eyBjb250ZW50OiBDb250ZW50IH19IGNvbnRlbnREZWFjdGl2YXRlIGNhbiBiZSBkZWZhdWx0IHByZXZlbnRlZFxyXG4gKiBAcHJvcCB7eyBjb250ZW50OiBDb250ZW50IH19IGNvbnRlbnRSZW1vdmUgY2FuIGJlIGRlZmF1bHQgcHJldmVudGVkXHJcbiAqIEBwcm9wIHt7IGNvbnRlbnQ6IENvbnRlbnQgfX0gY29udGVudERlc3Ryb3kgY2FuIGJlIGRlZmF1bHQgcHJldmVudGVkXHJcbiAqXHJcbiAqXHJcbiAqIHVuZG9jdW1lbnRlZFxyXG4gKlxyXG4gKiBAcHJvcCB7eyBwb2ludDogUG9pbnQ7IG9yaWdpbmFsRXZlbnQ6IFBvaW50ZXJFdmVudCB9fSBpbWFnZUNsaWNrQWN0aW9uIGNhbiBiZSBkZWZhdWx0IHByZXZlbnRlZFxyXG4gKiBAcHJvcCB7eyBwb2ludDogUG9pbnQ7IG9yaWdpbmFsRXZlbnQ6IFBvaW50ZXJFdmVudCB9fSBiZ0NsaWNrQWN0aW9uIGNhbiBiZSBkZWZhdWx0IHByZXZlbnRlZFxyXG4gKiBAcHJvcCB7eyBwb2ludDogUG9pbnQ7IG9yaWdpbmFsRXZlbnQ6IFBvaW50ZXJFdmVudCB9fSB0YXBBY3Rpb24gY2FuIGJlIGRlZmF1bHQgcHJldmVudGVkXHJcbiAqIEBwcm9wIHt7IHBvaW50OiBQb2ludDsgb3JpZ2luYWxFdmVudDogUG9pbnRlckV2ZW50IH19IGRvdWJsZVRhcEFjdGlvbiBjYW4gYmUgZGVmYXVsdCBwcmV2ZW50ZWRcclxuICpcclxuICogQHByb3Age3sgb3JpZ2luYWxFdmVudDogS2V5Ym9hcmRFdmVudCB9fSBrZXlkb3duIGNhbiBiZSBkZWZhdWx0IHByZXZlbnRlZFxyXG4gKiBAcHJvcCB7eyB4OiBudW1iZXI7IGRyYWdnaW5nOiBib29sZWFuIH19IG1vdmVNYWluU2Nyb2xsXHJcbiAqIEBwcm9wIHt7IHNsaWRlOiBTbGlkZSB9fSBmaXJzdFpvb21QYW5cclxuICogQHByb3Age3sgc2xpZGU6IFNsaWRlIHwgdW5kZWZpbmVkLCBkYXRhOiBTbGlkZURhdGEsIGluZGV4OiBudW1iZXIgfX0gZ2V0dGluZ0RhdGFcclxuICogQHByb3Age3VuZGVmaW5lZH0gYmVmb3JlUmVzaXplXHJcbiAqIEBwcm9wIHt1bmRlZmluZWR9IHJlc2l6ZVxyXG4gKiBAcHJvcCB7dW5kZWZpbmVkfSB2aWV3cG9ydFNpemVcclxuICogQHByb3Age3VuZGVmaW5lZH0gdXBkYXRlU2Nyb2xsT2Zmc2V0XHJcbiAqIEBwcm9wIHt7IHNsaWRlOiBTbGlkZSB9fSBzbGlkZUluaXRcclxuICogQHByb3Age3sgc2xpZGU6IFNsaWRlIH19IGFmdGVyU2V0Q29udGVudFxyXG4gKiBAcHJvcCB7eyBzbGlkZTogU2xpZGUgfX0gc2xpZGVMb2FkXHJcbiAqIEBwcm9wIHt7IHNsaWRlOiBTbGlkZSB9fSBhcHBlbmRIZWF2eSBjYW4gYmUgZGVmYXVsdCBwcmV2ZW50ZWRcclxuICogQHByb3Age3sgc2xpZGU6IFNsaWRlIH19IGFwcGVuZEhlYXZ5Q29udGVudFxyXG4gKiBAcHJvcCB7eyBzbGlkZTogU2xpZGUgfX0gc2xpZGVBY3RpdmF0ZVxyXG4gKiBAcHJvcCB7eyBzbGlkZTogU2xpZGUgfX0gc2xpZGVEZWFjdGl2YXRlXHJcbiAqIEBwcm9wIHt7IHNsaWRlOiBTbGlkZSB9fSBzbGlkZURlc3Ryb3lcclxuICogQHByb3Age3sgZGVzdFpvb21MZXZlbDogbnVtYmVyLCBjZW50ZXJQb2ludDogUG9pbnQgfCB1bmRlZmluZWQsIHRyYW5zaXRpb25EdXJhdGlvbjogbnVtYmVyIHwgZmFsc2UgfCB1bmRlZmluZWQgfX0gYmVmb3JlWm9vbVRvXHJcbiAqIEBwcm9wIHt7IHNsaWRlOiBTbGlkZSB9fSB6b29tUGFuVXBkYXRlXHJcbiAqIEBwcm9wIHt7IHNsaWRlOiBTbGlkZSB9fSBpbml0aWFsWm9vbVBhblxyXG4gKiBAcHJvcCB7eyBzbGlkZTogU2xpZGUgfX0gY2FsY1NsaWRlU2l6ZVxyXG4gKiBAcHJvcCB7dW5kZWZpbmVkfSByZXNvbHV0aW9uQ2hhbmdlZFxyXG4gKiBAcHJvcCB7eyBvcmlnaW5hbEV2ZW50OiBXaGVlbEV2ZW50IH19IHdoZWVsIGNhbiBiZSBkZWZhdWx0IHByZXZlbnRlZFxyXG4gKiBAcHJvcCB7eyBjb250ZW50OiBDb250ZW50IH19IGNvbnRlbnRBcHBlbmRJbWFnZSBjYW4gYmUgZGVmYXVsdCBwcmV2ZW50ZWRcclxuICogQHByb3Age3sgaW5kZXg6IG51bWJlcjsgaXRlbURhdGE6IFNsaWRlRGF0YSB9fSBsYXp5TG9hZFNsaWRlIGNhbiBiZSBkZWZhdWx0IHByZXZlbnRlZFxyXG4gKiBAcHJvcCB7dW5kZWZpbmVkfSBsYXp5TG9hZFxyXG4gKiBAcHJvcCB7eyBzbGlkZTogU2xpZGUgfX0gY2FsY0JvdW5kc1xyXG4gKiBAcHJvcCB7eyB6b29tTGV2ZWxzOiBab29tTGV2ZWwsIHNsaWRlRGF0YTogU2xpZGVEYXRhIH19IHpvb21MZXZlbHNVcGRhdGVcclxuICpcclxuICpcclxuICogbGVnYWN5XHJcbiAqXHJcbiAqIEBwcm9wIHt1bmRlZmluZWR9IGluaXRcclxuICogQHByb3Age3VuZGVmaW5lZH0gaW5pdGlhbFpvb21JblxyXG4gKiBAcHJvcCB7dW5kZWZpbmVkfSBpbml0aWFsWm9vbU91dFxyXG4gKiBAcHJvcCB7dW5kZWZpbmVkfSBpbml0aWFsWm9vbUluRW5kXHJcbiAqIEBwcm9wIHt1bmRlZmluZWR9IGluaXRpYWxab29tT3V0RW5kXHJcbiAqIEBwcm9wIHt7IGRhdGFTb3VyY2U6IERhdGFTb3VyY2UgfCB1bmRlZmluZWQsIG51bUl0ZW1zOiBudW1iZXIgfX0gbnVtSXRlbXNcclxuICogQHByb3Age3sgaXRlbURhdGE6IFNsaWRlRGF0YTsgaW5kZXg6IG51bWJlciB9fSBpdGVtRGF0YVxyXG4gKiBAcHJvcCB7eyBpbmRleDogbnVtYmVyLCBpdGVtRGF0YTogU2xpZGVEYXRhLCBpbnN0YW5jZTogUGhvdG9Td2lwZSB9fSB0aHVtYkJvdW5kc1xyXG4gKi9cblxuLyoqXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFBob3RvU3dpcGVGaWx0ZXJzTWFwIGh0dHBzOi8vcGhvdG9zd2lwZS5jb20vZmlsdGVycy9cclxuICpcclxuICogQHByb3AgeyhudW1JdGVtczogbnVtYmVyLCBkYXRhU291cmNlOiBEYXRhU291cmNlIHwgdW5kZWZpbmVkKSA9PiBudW1iZXJ9IG51bUl0ZW1zXHJcbiAqIE1vZGlmeSB0aGUgdG90YWwgYW1vdW50IG9mIHNsaWRlcy4gRXhhbXBsZSBvbiBEYXRhIHNvdXJjZXMgcGFnZS5cclxuICogaHR0cHM6Ly9waG90b3N3aXBlLmNvbS9maWx0ZXJzLyNudW1pdGVtc1xyXG4gKlxyXG4gKiBAcHJvcCB7KGl0ZW1EYXRhOiBTbGlkZURhdGEsIGluZGV4OiBudW1iZXIpID0+IFNsaWRlRGF0YX0gaXRlbURhdGFcclxuICogTW9kaWZ5IHNsaWRlIGl0ZW0gZGF0YS4gRXhhbXBsZSBvbiBEYXRhIHNvdXJjZXMgcGFnZS5cclxuICogaHR0cHM6Ly9waG90b3N3aXBlLmNvbS9maWx0ZXJzLyNpdGVtZGF0YVxyXG4gKlxyXG4gKiBAcHJvcCB7KGl0ZW1EYXRhOiBTbGlkZURhdGEsIGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBsaW5rRWw6IEhUTUxBbmNob3JFbGVtZW50KSA9PiBTbGlkZURhdGF9IGRvbUl0ZW1EYXRhXHJcbiAqIE1vZGlmeSBpdGVtIGRhdGEgd2hlbiBpdCdzIHBhcnNlZCBmcm9tIERPTSBlbGVtZW50LiBFeGFtcGxlIG9uIERhdGEgc291cmNlcyBwYWdlLlxyXG4gKiBodHRwczovL3Bob3Rvc3dpcGUuY29tL2ZpbHRlcnMvI2RvbWl0ZW1kYXRhXHJcbiAqXHJcbiAqIEBwcm9wIHsoY2xpY2tlZEluZGV4OiBudW1iZXIsIGU6IE1vdXNlRXZlbnQsIGluc3RhbmNlOiBQaG90b1N3aXBlTGlnaHRib3gpID0+IG51bWJlcn0gY2xpY2tlZEluZGV4XHJcbiAqIE1vZGlmeSBjbGlja2VkIGdhbGxlcnkgaXRlbSBpbmRleC5cclxuICogaHR0cHM6Ly9waG90b3N3aXBlLmNvbS9maWx0ZXJzLyNjbGlja2VkaW5kZXhcclxuICpcclxuICogQHByb3AgeyhwbGFjZWhvbGRlclNyYzogc3RyaW5nIHwgZmFsc2UsIGNvbnRlbnQ6IENvbnRlbnQpID0+IHN0cmluZyB8IGZhbHNlfSBwbGFjZWhvbGRlclNyY1xyXG4gKiBNb2RpZnkgcGxhY2Vob2xkZXIgaW1hZ2Ugc291cmNlLlxyXG4gKiBodHRwczovL3Bob3Rvc3dpcGUuY29tL2ZpbHRlcnMvI3BsYWNlaG9sZGVyc3JjXHJcbiAqXHJcbiAqIEBwcm9wIHsoaXNDb250ZW50TG9hZGluZzogYm9vbGVhbiwgY29udGVudDogQ29udGVudCkgPT4gYm9vbGVhbn0gaXNDb250ZW50TG9hZGluZ1xyXG4gKiBNb2RpZnkgaWYgdGhlIGNvbnRlbnQgaXMgY3VycmVudGx5IGxvYWRpbmcuXHJcbiAqIGh0dHBzOi8vcGhvdG9zd2lwZS5jb20vZmlsdGVycy8jaXNjb250ZW50bG9hZGluZ1xyXG4gKlxyXG4gKiBAcHJvcCB7KGlzQ29udGVudFpvb21hYmxlOiBib29sZWFuLCBjb250ZW50OiBDb250ZW50KSA9PiBib29sZWFufSBpc0NvbnRlbnRab29tYWJsZVxyXG4gKiBNb2RpZnkgaWYgdGhlIGNvbnRlbnQgY2FuIGJlIHpvb21lZC5cclxuICogaHR0cHM6Ly9waG90b3N3aXBlLmNvbS9maWx0ZXJzLyNpc2NvbnRlbnR6b29tYWJsZVxyXG4gKlxyXG4gKiBAcHJvcCB7KHVzZUNvbnRlbnRQbGFjZWhvbGRlcjogYm9vbGVhbiwgY29udGVudDogQ29udGVudCkgPT4gYm9vbGVhbn0gdXNlQ29udGVudFBsYWNlaG9sZGVyXHJcbiAqIE1vZGlmeSBpZiB0aGUgcGxhY2Vob2xkZXIgc2hvdWxkIGJlIHVzZWQgZm9yIHRoZSBjb250ZW50LlxyXG4gKiBodHRwczovL3Bob3Rvc3dpcGUuY29tL2ZpbHRlcnMvI3VzZWNvbnRlbnRwbGFjZWhvbGRlclxyXG4gKlxyXG4gKiBAcHJvcCB7KGlzS2VlcGluZ1BsYWNlaG9sZGVyOiBib29sZWFuLCBjb250ZW50OiBDb250ZW50KSA9PiBib29sZWFufSBpc0tlZXBpbmdQbGFjZWhvbGRlclxyXG4gKiBNb2RpZnkgaWYgdGhlIHBsYWNlaG9sZGVyIHNob3VsZCBiZSBrZXB0IGFmdGVyIHRoZSBjb250ZW50IGlzIGxvYWRlZC5cclxuICogaHR0cHM6Ly9waG90b3N3aXBlLmNvbS9maWx0ZXJzLyNpc2tlZXBpbmdwbGFjZWhvbGRlclxyXG4gKlxyXG4gKlxyXG4gKiBAcHJvcCB7KGNvbnRlbnRFcnJvckVsZW1lbnQ6IEhUTUxFbGVtZW50LCBjb250ZW50OiBDb250ZW50KSA9PiBIVE1MRWxlbWVudH0gY29udGVudEVycm9yRWxlbWVudFxyXG4gKiBNb2RpZnkgYW4gZWxlbWVudCB3aGVuIHRoZSBjb250ZW50IGhhcyBlcnJvciBzdGF0ZSAoZm9yIGV4YW1wbGUsIGlmIGltYWdlIGNhbm5vdCBiZSBsb2FkZWQpLlxyXG4gKiBodHRwczovL3Bob3Rvc3dpcGUuY29tL2ZpbHRlcnMvI2NvbnRlbnRlcnJvcmVsZW1lbnRcclxuICpcclxuICogQHByb3AgeyhlbGVtZW50OiBIVE1MRWxlbWVudCwgZGF0YTogVUlFbGVtZW50RGF0YSkgPT4gSFRNTEVsZW1lbnR9IHVpRWxlbWVudFxyXG4gKiBNb2RpZnkgYSBVSSBlbGVtZW50IHRoYXQncyBiZWluZyBjcmVhdGVkLlxyXG4gKiBodHRwczovL3Bob3Rvc3dpcGUuY29tL2ZpbHRlcnMvI3VpZWxlbWVudFxyXG4gKlxyXG4gKiBAcHJvcCB7KHRodW1ibmFpbDogSFRNTEVsZW1lbnQgfCBudWxsIHwgdW5kZWZpbmVkLCBpdGVtRGF0YTogU2xpZGVEYXRhLCBpbmRleDogbnVtYmVyKSA9PiBIVE1MRWxlbWVudH0gdGh1bWJFbFxyXG4gKiBNb2RpZnkgdGhlIHRodW1ibmFpbCBlbGVtZW50IGZyb20gd2hpY2ggb3BlbmluZyB6b29tIGFuaW1hdGlvbiBzdGFydHMgb3IgZW5kcy5cclxuICogaHR0cHM6Ly9waG90b3N3aXBlLmNvbS9maWx0ZXJzLyN0aHVtYmVsXHJcbiAqXHJcbiAqIEBwcm9wIHsodGh1bWJCb3VuZHM6IEJvdW5kcyB8IHVuZGVmaW5lZCwgaXRlbURhdGE6IFNsaWRlRGF0YSwgaW5kZXg6IG51bWJlcikgPT4gQm91bmRzfSB0aHVtYkJvdW5kc1xyXG4gKiBNb2RpZnkgdGhlIHRodW1ibmFpbCBib3VuZHMgZnJvbSB3aGljaCBvcGVuaW5nIHpvb20gYW5pbWF0aW9uIHN0YXJ0cyBvciBlbmRzLlxyXG4gKiBodHRwczovL3Bob3Rvc3dpcGUuY29tL2ZpbHRlcnMvI3RodW1iYm91bmRzXHJcbiAqXHJcbiAqIEBwcm9wIHsoc3Jjc2V0U2l6ZXNXaWR0aDogbnVtYmVyLCBjb250ZW50OiBDb250ZW50KSA9PiBudW1iZXJ9IHNyY3NldFNpemVzV2lkdGhcclxuICpcclxuICogQHByb3AgeyhwcmV2ZW50UG9pbnRlckV2ZW50OiBib29sZWFuLCBldmVudDogUG9pbnRlckV2ZW50LCBwb2ludGVyVHlwZTogc3RyaW5nKSA9PiBib29sZWFufSBwcmV2ZW50UG9pbnRlckV2ZW50XHJcbiAqXHJcbiAqL1xuXG4vKipcclxuICogQHRlbXBsYXRlIHtrZXlvZiBQaG90b1N3aXBlRmlsdGVyc01hcH0gVFxyXG4gKiBAdHlwZWRlZiB7eyBmbjogUGhvdG9Td2lwZUZpbHRlcnNNYXBbVF0sIHByaW9yaXR5OiBudW1iZXIgfX0gRmlsdGVyXHJcbiAqL1xuXG4vKipcclxuICogQHRlbXBsYXRlIHtrZXlvZiBQaG90b1N3aXBlRXZlbnRzTWFwfSBUXHJcbiAqIEB0eXBlZGVmIHtQaG90b1N3aXBlRXZlbnRzTWFwW1RdIGV4dGVuZHMgdW5kZWZpbmVkID8gUGhvdG9Td2lwZUV2ZW50PFQ+IDogUGhvdG9Td2lwZUV2ZW50PFQ+ICYgUGhvdG9Td2lwZUV2ZW50c01hcFtUXX0gQXVnbWVudGVkRXZlbnRcclxuICovXG5cbi8qKlxyXG4gKiBAdGVtcGxhdGUge2tleW9mIFBob3RvU3dpcGVFdmVudHNNYXB9IFRcclxuICogQHR5cGVkZWYgeyhldmVudDogQXVnbWVudGVkRXZlbnQ8VD4pID0+IHZvaWR9IEV2ZW50Q2FsbGJhY2tcclxuICovXG5cbi8qKlxyXG4gKiBCYXNlIFBob3RvU3dpcGUgZXZlbnQgb2JqZWN0XHJcbiAqXHJcbiAqIEB0ZW1wbGF0ZSB7a2V5b2YgUGhvdG9Td2lwZUV2ZW50c01hcH0gVFxyXG4gKi9cbmNsYXNzIFBob3RvU3dpcGVFdmVudCB7XG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7VH0gdHlwZVxyXG4gICAqIEBwYXJhbSB7UGhvdG9Td2lwZUV2ZW50c01hcFtUXX0gW2RldGFpbHNdXHJcbiAgICovXG4gIGNvbnN0cnVjdG9yKHR5cGUsIGRldGFpbHMpIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMuZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlO1xuXG4gICAgaWYgKGRldGFpbHMpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgZGV0YWlscyk7XG4gICAgfVxuICB9XG5cbiAgcHJldmVudERlZmF1bHQoKSB7XG4gICAgdGhpcy5kZWZhdWx0UHJldmVudGVkID0gdHJ1ZTtcbiAgfVxuXG59XG4vKipcclxuICogUGhvdG9Td2lwZSBiYXNlIGNsYXNzIHRoYXQgY2FuIGxpc3RlbiBhbmQgZGlzcGF0Y2ggZm9yIGV2ZW50cy5cclxuICogU2hhcmVkIGJ5IFBob3RvU3dpcGUgQ29yZSBhbmQgUGhvdG9Td2lwZSBMaWdodGJveCwgZXh0ZW5kZWQgYnkgYmFzZS5qc1xyXG4gKi9cblxuXG5jbGFzcyBFdmVudGFibGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvKipcclxuICAgICAqIEB0eXBlIHt7IFtUIGluIGtleW9mIFBob3RvU3dpcGVFdmVudHNNYXBdPzogKChldmVudDogQXVnbWVudGVkRXZlbnQ8VD4pID0+IHZvaWQpW10gfX1cclxuICAgICAqL1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuICAgIC8qKlxyXG4gICAgICogQHR5cGUge3sgW1QgaW4ga2V5b2YgUGhvdG9Td2lwZUZpbHRlcnNNYXBdPzogRmlsdGVyPFQ+W10gfX1cclxuICAgICAqL1xuXG4gICAgdGhpcy5fZmlsdGVycyA9IHt9O1xuICAgIC8qKiBAdHlwZSB7UGhvdG9Td2lwZSB8IHVuZGVmaW5lZH0gKi9cblxuICAgIHRoaXMucHN3cCA9IHVuZGVmaW5lZDtcbiAgICAvKiogQHR5cGUge1Bob3RvU3dpcGVPcHRpb25zIHwgdW5kZWZpbmVkfSAqL1xuXG4gICAgdGhpcy5vcHRpb25zID0gdW5kZWZpbmVkO1xuICB9XG4gIC8qKlxyXG4gICAqIEB0ZW1wbGF0ZSB7a2V5b2YgUGhvdG9Td2lwZUZpbHRlcnNNYXB9IFRcclxuICAgKiBAcGFyYW0ge1R9IG5hbWVcclxuICAgKiBAcGFyYW0ge1Bob3RvU3dpcGVGaWx0ZXJzTWFwW1RdfSBmblxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwcmlvcml0eVxyXG4gICAqL1xuXG5cbiAgYWRkRmlsdGVyKG5hbWUsIGZuLCBwcmlvcml0eSA9IDEwMCkge1xuICAgIHZhciBfdGhpcyRfZmlsdGVycyRuYW1lLCBfdGhpcyRfZmlsdGVycyRuYW1lMiwgX3RoaXMkcHN3cDtcblxuICAgIGlmICghdGhpcy5fZmlsdGVyc1tuYW1lXSkge1xuICAgICAgdGhpcy5fZmlsdGVyc1tuYW1lXSA9IFtdO1xuICAgIH1cblxuICAgIChfdGhpcyRfZmlsdGVycyRuYW1lID0gdGhpcy5fZmlsdGVyc1tuYW1lXSkgPT09IG51bGwgfHwgX3RoaXMkX2ZpbHRlcnMkbmFtZSA9PT0gdm9pZCAwIHx8IF90aGlzJF9maWx0ZXJzJG5hbWUucHVzaCh7XG4gICAgICBmbixcbiAgICAgIHByaW9yaXR5XG4gICAgfSk7XG4gICAgKF90aGlzJF9maWx0ZXJzJG5hbWUyID0gdGhpcy5fZmlsdGVyc1tuYW1lXSkgPT09IG51bGwgfHwgX3RoaXMkX2ZpbHRlcnMkbmFtZTIgPT09IHZvaWQgMCB8fCBfdGhpcyRfZmlsdGVycyRuYW1lMi5zb3J0KChmMSwgZjIpID0+IGYxLnByaW9yaXR5IC0gZjIucHJpb3JpdHkpO1xuICAgIChfdGhpcyRwc3dwID0gdGhpcy5wc3dwKSA9PT0gbnVsbCB8fCBfdGhpcyRwc3dwID09PSB2b2lkIDAgfHwgX3RoaXMkcHN3cC5hZGRGaWx0ZXIobmFtZSwgZm4sIHByaW9yaXR5KTtcbiAgfVxuICAvKipcclxuICAgKiBAdGVtcGxhdGUge2tleW9mIFBob3RvU3dpcGVGaWx0ZXJzTWFwfSBUXHJcbiAgICogQHBhcmFtIHtUfSBuYW1lXHJcbiAgICogQHBhcmFtIHtQaG90b1N3aXBlRmlsdGVyc01hcFtUXX0gZm5cclxuICAgKi9cblxuXG4gIHJlbW92ZUZpbHRlcihuYW1lLCBmbikge1xuICAgIGlmICh0aGlzLl9maWx0ZXJzW25hbWVdKSB7XG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICB0aGlzLl9maWx0ZXJzW25hbWVdID0gdGhpcy5fZmlsdGVyc1tuYW1lXS5maWx0ZXIoZmlsdGVyID0+IGZpbHRlci5mbiAhPT0gZm4pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBzd3ApIHtcbiAgICAgIHRoaXMucHN3cC5yZW1vdmVGaWx0ZXIobmFtZSwgZm4pO1xuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBAdGVtcGxhdGUge2tleW9mIFBob3RvU3dpcGVGaWx0ZXJzTWFwfSBUXHJcbiAgICogQHBhcmFtIHtUfSBuYW1lXHJcbiAgICogQHBhcmFtIHtQYXJhbWV0ZXJzPFBob3RvU3dpcGVGaWx0ZXJzTWFwW1RdPn0gYXJnc1xyXG4gICAqIEByZXR1cm5zIHtQYXJhbWV0ZXJzPFBob3RvU3dpcGVGaWx0ZXJzTWFwW1RdPlswXX1cclxuICAgKi9cblxuXG4gIGFwcGx5RmlsdGVycyhuYW1lLCAuLi5hcmdzKSB7XG4gICAgdmFyIF90aGlzJF9maWx0ZXJzJG5hbWUzO1xuXG4gICAgKF90aGlzJF9maWx0ZXJzJG5hbWUzID0gdGhpcy5fZmlsdGVyc1tuYW1lXSkgPT09IG51bGwgfHwgX3RoaXMkX2ZpbHRlcnMkbmFtZTMgPT09IHZvaWQgMCB8fCBfdGhpcyRfZmlsdGVycyRuYW1lMy5mb3JFYWNoKGZpbHRlciA9PiB7XG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICBhcmdzWzBdID0gZmlsdGVyLmZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH0pO1xuICAgIHJldHVybiBhcmdzWzBdO1xuICB9XG4gIC8qKlxyXG4gICAqIEB0ZW1wbGF0ZSB7a2V5b2YgUGhvdG9Td2lwZUV2ZW50c01hcH0gVFxyXG4gICAqIEBwYXJhbSB7VH0gbmFtZVxyXG4gICAqIEBwYXJhbSB7RXZlbnRDYWxsYmFjazxUPn0gZm5cclxuICAgKi9cblxuXG4gIG9uKG5hbWUsIGZuKSB7XG4gICAgdmFyIF90aGlzJF9saXN0ZW5lcnMkbmFtZSwgX3RoaXMkcHN3cDI7XG5cbiAgICBpZiAoIXRoaXMuX2xpc3RlbmVyc1tuYW1lXSkge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzW25hbWVdID0gW107XG4gICAgfVxuXG4gICAgKF90aGlzJF9saXN0ZW5lcnMkbmFtZSA9IHRoaXMuX2xpc3RlbmVyc1tuYW1lXSkgPT09IG51bGwgfHwgX3RoaXMkX2xpc3RlbmVycyRuYW1lID09PSB2b2lkIDAgfHwgX3RoaXMkX2xpc3RlbmVycyRuYW1lLnB1c2goZm4pOyAvLyBXaGVuIGJpbmRpbmcgZXZlbnRzIHRvIGxpZ2h0Ym94LFxuICAgIC8vIGFsc28gYmluZCBldmVudHMgdG8gUGhvdG9Td2lwZSBDb3JlLFxuICAgIC8vIGlmIGl0J3Mgb3Blbi5cblxuICAgIChfdGhpcyRwc3dwMiA9IHRoaXMucHN3cCkgPT09IG51bGwgfHwgX3RoaXMkcHN3cDIgPT09IHZvaWQgMCB8fCBfdGhpcyRwc3dwMi5vbihuYW1lLCBmbik7XG4gIH1cbiAgLyoqXHJcbiAgICogQHRlbXBsYXRlIHtrZXlvZiBQaG90b1N3aXBlRXZlbnRzTWFwfSBUXHJcbiAgICogQHBhcmFtIHtUfSBuYW1lXHJcbiAgICogQHBhcmFtIHtFdmVudENhbGxiYWNrPFQ+fSBmblxyXG4gICAqL1xuXG5cbiAgb2ZmKG5hbWUsIGZuKSB7XG4gICAgdmFyIF90aGlzJHBzd3AzO1xuXG4gICAgaWYgKHRoaXMuX2xpc3RlbmVyc1tuYW1lXSkge1xuICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgdGhpcy5fbGlzdGVuZXJzW25hbWVdID0gdGhpcy5fbGlzdGVuZXJzW25hbWVdLmZpbHRlcihsaXN0ZW5lciA9PiBmbiAhPT0gbGlzdGVuZXIpO1xuICAgIH1cblxuICAgIChfdGhpcyRwc3dwMyA9IHRoaXMucHN3cCkgPT09IG51bGwgfHwgX3RoaXMkcHN3cDMgPT09IHZvaWQgMCB8fCBfdGhpcyRwc3dwMy5vZmYobmFtZSwgZm4pO1xuICB9XG4gIC8qKlxyXG4gICAqIEB0ZW1wbGF0ZSB7a2V5b2YgUGhvdG9Td2lwZUV2ZW50c01hcH0gVFxyXG4gICAqIEBwYXJhbSB7VH0gbmFtZVxyXG4gICAqIEBwYXJhbSB7UGhvdG9Td2lwZUV2ZW50c01hcFtUXX0gW2RldGFpbHNdXHJcbiAgICogQHJldHVybnMge0F1Z21lbnRlZEV2ZW50PFQ+fVxyXG4gICAqL1xuXG5cbiAgZGlzcGF0Y2gobmFtZSwgZGV0YWlscykge1xuICAgIHZhciBfdGhpcyRfbGlzdGVuZXJzJG5hbWUyO1xuXG4gICAgaWYgKHRoaXMucHN3cCkge1xuICAgICAgcmV0dXJuIHRoaXMucHN3cC5kaXNwYXRjaChuYW1lLCBkZXRhaWxzKTtcbiAgICB9XG5cbiAgICBjb25zdCBldmVudCA9XG4gICAgLyoqIEB0eXBlIHtBdWdtZW50ZWRFdmVudDxUPn0gKi9cbiAgICBuZXcgUGhvdG9Td2lwZUV2ZW50KG5hbWUsIGRldGFpbHMpO1xuICAgIChfdGhpcyRfbGlzdGVuZXJzJG5hbWUyID0gdGhpcy5fbGlzdGVuZXJzW25hbWVdKSA9PT0gbnVsbCB8fCBfdGhpcyRfbGlzdGVuZXJzJG5hbWUyID09PSB2b2lkIDAgfHwgX3RoaXMkX2xpc3RlbmVycyRuYW1lMi5mb3JFYWNoKGxpc3RlbmVyID0+IHtcbiAgICAgIGxpc3RlbmVyLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH0pO1xuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG59XG5cbmNsYXNzIFBsYWNlaG9sZGVyIHtcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBmYWxzZX0gaW1hZ2VTcmNcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJcclxuICAgKi9cbiAgY29uc3RydWN0b3IoaW1hZ2VTcmMsIGNvbnRhaW5lcikge1xuICAgIC8vIENyZWF0ZSBwbGFjZWhvbGRlclxuICAgIC8vIChzdHJldGNoZWQgdGh1bWJuYWlsIG9yIHNpbXBsZSBkaXYgYmVoaW5kIHRoZSBtYWluIGltYWdlKVxuXG4gICAgLyoqIEB0eXBlIHtIVE1MSW1hZ2VFbGVtZW50IHwgSFRNTERpdkVsZW1lbnQgfCBudWxsfSAqL1xuICAgIHRoaXMuZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoJ3Bzd3BfX2ltZyBwc3dwX19pbWctLXBsYWNlaG9sZGVyJywgaW1hZ2VTcmMgPyAnaW1nJyA6ICdkaXYnLCBjb250YWluZXIpO1xuXG4gICAgaWYgKGltYWdlU3JjKSB7XG4gICAgICBjb25zdCBpbWdFbCA9XG4gICAgICAvKiogQHR5cGUge0hUTUxJbWFnZUVsZW1lbnR9ICovXG4gICAgICB0aGlzLmVsZW1lbnQ7XG4gICAgICBpbWdFbC5kZWNvZGluZyA9ICdhc3luYyc7XG4gICAgICBpbWdFbC5hbHQgPSAnJztcbiAgICAgIGltZ0VsLnNyYyA9IGltYWdlU3JjO1xuICAgICAgaW1nRWwuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3ByZXNlbnRhdGlvbicpO1xuICAgIH1cblxuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgfVxuICAvKipcclxuICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcclxuICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0XHJcbiAgICovXG5cblxuICBzZXREaXNwbGF5ZWRTaXplKHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIXRoaXMuZWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmVsZW1lbnQudGFnTmFtZSA9PT0gJ0lNRycpIHtcbiAgICAgIC8vIFVzZSB0cmFuc2Zvcm0gc2NhbGUoKSB0byBtb2RpZnkgaW1nIHBsYWNlaG9sZGVyIHNpemVcbiAgICAgIC8vIChpbnN0ZWFkIG9mIGNoYW5naW5nIHdpZHRoL2hlaWdodCBkaXJlY3RseSkuXG4gICAgICAvLyBUaGlzIGhlbHBzIHdpdGggcGVyZm9ybWFuY2UsIHNwZWNpZmljYWxseSBpbiBpT1MxNSBTYWZhcmkuXG4gICAgICBzZXRXaWR0aEhlaWdodCh0aGlzLmVsZW1lbnQsIDI1MCwgJ2F1dG8nKTtcbiAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSAnMCAwJztcbiAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSB0b1RyYW5zZm9ybVN0cmluZygwLCAwLCB3aWR0aCAvIDI1MCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFdpZHRoSGVpZ2h0KHRoaXMuZWxlbWVudCwgd2lkdGgsIGhlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB2YXIgX3RoaXMkZWxlbWVudDtcblxuICAgIGlmICgoX3RoaXMkZWxlbWVudCA9IHRoaXMuZWxlbWVudCkgIT09IG51bGwgJiYgX3RoaXMkZWxlbWVudCAhPT0gdm9pZCAwICYmIF90aGlzJGVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XG4gIH1cblxufVxuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi9zbGlkZS5qcycpLmRlZmF1bHR9IFNsaWRlICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NsaWRlLmpzJykuU2xpZGVEYXRhfSBTbGlkZURhdGEgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL2NvcmUvYmFzZS5qcycpLmRlZmF1bHR9IFBob3RvU3dpcGVCYXNlICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi91dGlsL3V0aWwuanMnKS5Mb2FkU3RhdGV9IExvYWRTdGF0ZSAqL1xuXG5jbGFzcyBDb250ZW50IHtcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtTbGlkZURhdGF9IGl0ZW1EYXRhIFNsaWRlIGRhdGFcclxuICAgKiBAcGFyYW0ge1Bob3RvU3dpcGVCYXNlfSBpbnN0YW5jZSBQaG90b1N3aXBlIG9yIFBob3RvU3dpcGVMaWdodGJveCBpbnN0YW5jZVxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFxyXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpdGVtRGF0YSwgaW5zdGFuY2UsIGluZGV4KSB7XG4gICAgdGhpcy5pbnN0YW5jZSA9IGluc3RhbmNlO1xuICAgIHRoaXMuZGF0YSA9IGl0ZW1EYXRhO1xuICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAvKiogQHR5cGUge0hUTUxJbWFnZUVsZW1lbnQgfCBIVE1MRGl2RWxlbWVudCB8IHVuZGVmaW5lZH0gKi9cblxuICAgIHRoaXMuZWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgICAvKiogQHR5cGUge1BsYWNlaG9sZGVyIHwgdW5kZWZpbmVkfSAqL1xuXG4gICAgdGhpcy5wbGFjZWhvbGRlciA9IHVuZGVmaW5lZDtcbiAgICAvKiogQHR5cGUge1NsaWRlIHwgdW5kZWZpbmVkfSAqL1xuXG4gICAgdGhpcy5zbGlkZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmRpc3BsYXllZEltYWdlV2lkdGggPSAwO1xuICAgIHRoaXMuZGlzcGxheWVkSW1hZ2VIZWlnaHQgPSAwO1xuICAgIHRoaXMud2lkdGggPSBOdW1iZXIodGhpcy5kYXRhLncpIHx8IE51bWJlcih0aGlzLmRhdGEud2lkdGgpIHx8IDA7XG4gICAgdGhpcy5oZWlnaHQgPSBOdW1iZXIodGhpcy5kYXRhLmgpIHx8IE51bWJlcih0aGlzLmRhdGEuaGVpZ2h0KSB8fCAwO1xuICAgIHRoaXMuaXNBdHRhY2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuaGFzU2xpZGUgPSBmYWxzZTtcbiAgICB0aGlzLmlzRGVjb2RpbmcgPSBmYWxzZTtcbiAgICAvKiogQHR5cGUge0xvYWRTdGF0ZX0gKi9cblxuICAgIHRoaXMuc3RhdGUgPSBMT0FEX1NUQVRFLklETEU7XG5cbiAgICBpZiAodGhpcy5kYXRhLnR5cGUpIHtcbiAgICAgIHRoaXMudHlwZSA9IHRoaXMuZGF0YS50eXBlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5kYXRhLnNyYykge1xuICAgICAgdGhpcy50eXBlID0gJ2ltYWdlJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50eXBlID0gJ2h0bWwnO1xuICAgIH1cblxuICAgIHRoaXMuaW5zdGFuY2UuZGlzcGF0Y2goJ2NvbnRlbnRJbml0Jywge1xuICAgICAgY29udGVudDogdGhpc1xuICAgIH0pO1xuICB9XG5cbiAgcmVtb3ZlUGxhY2Vob2xkZXIoKSB7XG4gICAgaWYgKHRoaXMucGxhY2Vob2xkZXIgJiYgIXRoaXMua2VlcFBsYWNlaG9sZGVyKCkpIHtcbiAgICAgIC8vIFdpdGggZGVsYXksIGFzIGltYWdlIG1pZ2h0IGJlIGxvYWRlZCwgYnV0IG5vdCByZW5kZXJlZFxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgdGhpcy5wbGFjZWhvbGRlci5kZXN0cm95KCk7XG4gICAgICAgICAgdGhpcy5wbGFjZWhvbGRlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSwgMTAwMCk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIFByZWxvYWQgY29udGVudFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtib29sZWFufSBpc0xhenlcclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtyZWxvYWRdXHJcbiAgICovXG5cblxuICBsb2FkKGlzTGF6eSwgcmVsb2FkKSB7XG4gICAgaWYgKHRoaXMuc2xpZGUgJiYgdGhpcy51c2VQbGFjZWhvbGRlcigpKSB7XG4gICAgICBpZiAoIXRoaXMucGxhY2Vob2xkZXIpIHtcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXJTcmMgPSB0aGlzLmluc3RhbmNlLmFwcGx5RmlsdGVycygncGxhY2Vob2xkZXJTcmMnLCAvLyB1c2UgIGltYWdlLWJhc2VkIHBsYWNlaG9sZGVyIG9ubHkgZm9yIHRoZSBmaXJzdCBzbGlkZSxcbiAgICAgICAgLy8gYXMgcmVuZGVyaW5nIChldmVuIHNtYWxsIHN0cmV0Y2hlZCB0aHVtYm5haWwpIGlzIGFuIGV4cGVuc2l2ZSBvcGVyYXRpb25cbiAgICAgICAgdGhpcy5kYXRhLm1zcmMgJiYgdGhpcy5zbGlkZS5pc0ZpcnN0U2xpZGUgPyB0aGlzLmRhdGEubXNyYyA6IGZhbHNlLCB0aGlzKTtcbiAgICAgICAgdGhpcy5wbGFjZWhvbGRlciA9IG5ldyBQbGFjZWhvbGRlcihwbGFjZWhvbGRlclNyYywgdGhpcy5zbGlkZS5jb250YWluZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXJFbCA9IHRoaXMucGxhY2Vob2xkZXIuZWxlbWVudDsgLy8gQWRkIHBsYWNlaG9sZGVyIHRvIERPTSBpZiBpdCB3YXMgYWxyZWFkeSBjcmVhdGVkXG5cbiAgICAgICAgaWYgKHBsYWNlaG9sZGVyRWwgJiYgIXBsYWNlaG9sZGVyRWwucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgIHRoaXMuc2xpZGUuY29udGFpbmVyLnByZXBlbmQocGxhY2Vob2xkZXJFbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbGVtZW50ICYmICFyZWxvYWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pbnN0YW5jZS5kaXNwYXRjaCgnY29udGVudExvYWQnLCB7XG4gICAgICBjb250ZW50OiB0aGlzLFxuICAgICAgaXNMYXp5XG4gICAgfSkuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzSW1hZ2VDb250ZW50KCkpIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoJ3Bzd3BfX2ltZycsICdpbWcnKTsgLy8gU3RhcnQgbG9hZGluZyBvbmx5IGFmdGVyIHdpZHRoIGlzIGRlZmluZWQsIGFzIHNpemVzIG1pZ2h0IGRlcGVuZCBvbiBpdC5cbiAgICAgIC8vIER1ZSB0byBTYWZhcmkgZmVhdHVyZSwgd2UgbXVzdCBkZWZpbmUgc2l6ZXMgYmVmb3JlIHNyY3NldC5cblxuICAgICAgaWYgKHRoaXMuZGlzcGxheWVkSW1hZ2VXaWR0aCkge1xuICAgICAgICB0aGlzLmxvYWRJbWFnZShpc0xhenkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBjcmVhdGVFbGVtZW50KCdwc3dwX19jb250ZW50JywgJ2RpdicpO1xuICAgICAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9IHRoaXMuZGF0YS5odG1sIHx8ICcnO1xuICAgIH1cblxuICAgIGlmIChyZWxvYWQgJiYgdGhpcy5zbGlkZSkge1xuICAgICAgdGhpcy5zbGlkZS51cGRhdGVDb250ZW50U2l6ZSh0cnVlKTtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogUHJlbG9hZCBpbWFnZVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtib29sZWFufSBpc0xhenlcclxuICAgKi9cblxuXG4gIGxvYWRJbWFnZShpc0xhenkpIHtcbiAgICB2YXIgX3RoaXMkZGF0YSRzcmMsIF90aGlzJGRhdGEkYWx0O1xuXG4gICAgaWYgKCF0aGlzLmlzSW1hZ2VDb250ZW50KCkgfHwgIXRoaXMuZWxlbWVudCB8fCB0aGlzLmluc3RhbmNlLmRpc3BhdGNoKCdjb250ZW50TG9hZEltYWdlJywge1xuICAgICAgY29udGVudDogdGhpcyxcbiAgICAgIGlzTGF6eVxuICAgIH0pLmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbWFnZUVsZW1lbnQgPVxuICAgIC8qKiBAdHlwZSBIVE1MSW1hZ2VFbGVtZW50ICovXG4gICAgdGhpcy5lbGVtZW50O1xuICAgIHRoaXMudXBkYXRlU3Jjc2V0U2l6ZXMoKTtcblxuICAgIGlmICh0aGlzLmRhdGEuc3Jjc2V0KSB7XG4gICAgICBpbWFnZUVsZW1lbnQuc3Jjc2V0ID0gdGhpcy5kYXRhLnNyY3NldDtcbiAgICB9XG5cbiAgICBpbWFnZUVsZW1lbnQuc3JjID0gKF90aGlzJGRhdGEkc3JjID0gdGhpcy5kYXRhLnNyYykgIT09IG51bGwgJiYgX3RoaXMkZGF0YSRzcmMgIT09IHZvaWQgMCA/IF90aGlzJGRhdGEkc3JjIDogJyc7XG4gICAgaW1hZ2VFbGVtZW50LmFsdCA9IChfdGhpcyRkYXRhJGFsdCA9IHRoaXMuZGF0YS5hbHQpICE9PSBudWxsICYmIF90aGlzJGRhdGEkYWx0ICE9PSB2b2lkIDAgPyBfdGhpcyRkYXRhJGFsdCA6ICcnO1xuICAgIHRoaXMuc3RhdGUgPSBMT0FEX1NUQVRFLkxPQURJTkc7XG5cbiAgICBpZiAoaW1hZ2VFbGVtZW50LmNvbXBsZXRlKSB7XG4gICAgICB0aGlzLm9uTG9hZGVkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGltYWdlRWxlbWVudC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMub25Mb2FkZWQoKTtcbiAgICAgIH07XG5cbiAgICAgIGltYWdlRWxlbWVudC5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICB0aGlzLm9uRXJyb3IoKTtcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIEFzc2lnbiBzbGlkZSB0byBjb250ZW50XHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1NsaWRlfSBzbGlkZVxyXG4gICAqL1xuXG5cbiAgc2V0U2xpZGUoc2xpZGUpIHtcbiAgICB0aGlzLnNsaWRlID0gc2xpZGU7XG4gICAgdGhpcy5oYXNTbGlkZSA9IHRydWU7XG4gICAgdGhpcy5pbnN0YW5jZSA9IHNsaWRlLnBzd3A7IC8vIHRvZG86IGRvIHdlIG5lZWQgdG8gdW5zZXQgc2xpZGU/XG4gIH1cbiAgLyoqXHJcbiAgICogQ29udGVudCBsb2FkIHN1Y2Nlc3MgaGFuZGxlclxyXG4gICAqL1xuXG5cbiAgb25Mb2FkZWQoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IExPQURfU1RBVEUuTE9BREVEO1xuXG4gICAgaWYgKHRoaXMuc2xpZGUgJiYgdGhpcy5lbGVtZW50KSB7XG4gICAgICB0aGlzLmluc3RhbmNlLmRpc3BhdGNoKCdsb2FkQ29tcGxldGUnLCB7XG4gICAgICAgIHNsaWRlOiB0aGlzLnNsaWRlLFxuICAgICAgICBjb250ZW50OiB0aGlzXG4gICAgICB9KTsgLy8gaWYgY29udGVudCBpcyByZWxvYWRlZFxuXG4gICAgICBpZiAodGhpcy5zbGlkZS5pc0FjdGl2ZSAmJiB0aGlzLnNsaWRlLmhlYXZ5QXBwZW5kZWQgJiYgIXRoaXMuZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKCk7XG4gICAgICAgIHRoaXMuc2xpZGUudXBkYXRlQ29udGVudFNpemUodHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnN0YXRlID09PSBMT0FEX1NUQVRFLkxPQURFRCB8fCB0aGlzLnN0YXRlID09PSBMT0FEX1NUQVRFLkVSUk9SKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlUGxhY2Vob2xkZXIoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogQ29udGVudCBsb2FkIGVycm9yIGhhbmRsZXJcclxuICAgKi9cblxuXG4gIG9uRXJyb3IoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IExPQURfU1RBVEUuRVJST1I7XG5cbiAgICBpZiAodGhpcy5zbGlkZSkge1xuICAgICAgdGhpcy5kaXNwbGF5RXJyb3IoKTtcbiAgICAgIHRoaXMuaW5zdGFuY2UuZGlzcGF0Y2goJ2xvYWRDb21wbGV0ZScsIHtcbiAgICAgICAgc2xpZGU6IHRoaXMuc2xpZGUsXG4gICAgICAgIGlzRXJyb3I6IHRydWUsXG4gICAgICAgIGNvbnRlbnQ6IHRoaXNcbiAgICAgIH0pO1xuICAgICAgdGhpcy5pbnN0YW5jZS5kaXNwYXRjaCgnbG9hZEVycm9yJywge1xuICAgICAgICBzbGlkZTogdGhpcy5zbGlkZSxcbiAgICAgICAgY29udGVudDogdGhpc1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSBJZiB0aGUgY29udGVudCBpcyBjdXJyZW50bHkgbG9hZGluZ1xyXG4gICAqL1xuXG5cbiAgaXNMb2FkaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmFwcGx5RmlsdGVycygnaXNDb250ZW50TG9hZGluZycsIHRoaXMuc3RhdGUgPT09IExPQURfU1RBVEUuTE9BRElORywgdGhpcyk7XG4gIH1cbiAgLyoqXHJcbiAgICogQHJldHVybnMge0Jvb2xlYW59IElmIHRoZSBjb250ZW50IGlzIGluIGVycm9yIHN0YXRlXHJcbiAgICovXG5cblxuICBpc0Vycm9yKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlID09PSBMT0FEX1NUQVRFLkVSUk9SO1xuICB9XG4gIC8qKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBJZiB0aGUgY29udGVudCBpcyBpbWFnZVxyXG4gICAqL1xuXG5cbiAgaXNJbWFnZUNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ2ltYWdlJztcbiAgfVxuICAvKipcclxuICAgKiBVcGRhdGUgY29udGVudCBzaXplXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGhcclxuICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0XHJcbiAgICovXG5cblxuICBzZXREaXNwbGF5ZWRTaXplKHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIXRoaXMuZWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyKSB7XG4gICAgICB0aGlzLnBsYWNlaG9sZGVyLnNldERpc3BsYXllZFNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuZGlzcGF0Y2goJ2NvbnRlbnRSZXNpemUnLCB7XG4gICAgICBjb250ZW50OiB0aGlzLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHRcbiAgICB9KS5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2V0V2lkdGhIZWlnaHQodGhpcy5lbGVtZW50LCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGlmICh0aGlzLmlzSW1hZ2VDb250ZW50KCkgJiYgIXRoaXMuaXNFcnJvcigpKSB7XG4gICAgICBjb25zdCBpc0luaXRpYWxTaXplVXBkYXRlID0gIXRoaXMuZGlzcGxheWVkSW1hZ2VXaWR0aCAmJiB3aWR0aDtcbiAgICAgIHRoaXMuZGlzcGxheWVkSW1hZ2VXaWR0aCA9IHdpZHRoO1xuICAgICAgdGhpcy5kaXNwbGF5ZWRJbWFnZUhlaWdodCA9IGhlaWdodDtcblxuICAgICAgaWYgKGlzSW5pdGlhbFNpemVVcGRhdGUpIHtcbiAgICAgICAgdGhpcy5sb2FkSW1hZ2UoZmFsc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51cGRhdGVTcmNzZXRTaXplcygpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zbGlkZSkge1xuICAgICAgICB0aGlzLmluc3RhbmNlLmRpc3BhdGNoKCdpbWFnZVNpemVDaGFuZ2UnLCB7XG4gICAgICAgICAgc2xpZGU6IHRoaXMuc2xpZGUsXG4gICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgIGNvbnRlbnQ6IHRoaXNcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBJZiB0aGUgY29udGVudCBjYW4gYmUgem9vbWVkXHJcbiAgICovXG5cblxuICBpc1pvb21hYmxlKCkge1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmFwcGx5RmlsdGVycygnaXNDb250ZW50Wm9vbWFibGUnLCB0aGlzLmlzSW1hZ2VDb250ZW50KCkgJiYgdGhpcy5zdGF0ZSAhPT0gTE9BRF9TVEFURS5FUlJPUiwgdGhpcyk7XG4gIH1cbiAgLyoqXHJcbiAgICogVXBkYXRlIGltYWdlIHNyY3NldCBzaXplcyBhdHRyaWJ1dGUgYmFzZWQgb24gd2lkdGggYW5kIGhlaWdodFxyXG4gICAqL1xuXG5cbiAgdXBkYXRlU3Jjc2V0U2l6ZXMoKSB7XG4gICAgLy8gSGFuZGxlIHNyY3NldCBzaXplcyBhdHRyaWJ1dGUuXG4gICAgLy9cbiAgICAvLyBOZXZlciBsb3dlciBxdWFsaXR5LCBpZiBpdCB3YXMgaW5jcmVhc2VkIHByZXZpb3VzbHkuXG4gICAgLy8gQ2hyb21lIGRvZXMgdGhpcyBhdXRvbWF0aWNhbGx5LCBGaXJlZm94IGFuZCBTYWZhcmkgZG8gbm90LFxuICAgIC8vIHNvIHdlIHN0b3JlIGxhcmdlc3QgdXNlZCBzaXplIGluIGRhdGFzZXQuXG4gICAgaWYgKCF0aGlzLmlzSW1hZ2VDb250ZW50KCkgfHwgIXRoaXMuZWxlbWVudCB8fCAhdGhpcy5kYXRhLnNyY3NldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGltYWdlID1cbiAgICAvKiogQHR5cGUgSFRNTEltYWdlRWxlbWVudCAqL1xuICAgIHRoaXMuZWxlbWVudDtcbiAgICBjb25zdCBzaXplc1dpZHRoID0gdGhpcy5pbnN0YW5jZS5hcHBseUZpbHRlcnMoJ3NyY3NldFNpemVzV2lkdGgnLCB0aGlzLmRpc3BsYXllZEltYWdlV2lkdGgsIHRoaXMpO1xuXG4gICAgaWYgKCFpbWFnZS5kYXRhc2V0Lmxhcmdlc3RVc2VkU2l6ZSB8fCBzaXplc1dpZHRoID4gcGFyc2VJbnQoaW1hZ2UuZGF0YXNldC5sYXJnZXN0VXNlZFNpemUsIDEwKSkge1xuICAgICAgaW1hZ2Uuc2l6ZXMgPSBzaXplc1dpZHRoICsgJ3B4JztcbiAgICAgIGltYWdlLmRhdGFzZXQubGFyZ2VzdFVzZWRTaXplID0gU3RyaW5nKHNpemVzV2lkdGgpO1xuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gSWYgY29udGVudCBzaG91bGQgdXNlIGEgcGxhY2Vob2xkZXIgKGZyb20gbXNyYyBieSBkZWZhdWx0KVxyXG4gICAqL1xuXG5cbiAgdXNlUGxhY2Vob2xkZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuYXBwbHlGaWx0ZXJzKCd1c2VDb250ZW50UGxhY2Vob2xkZXInLCB0aGlzLmlzSW1hZ2VDb250ZW50KCksIHRoaXMpO1xuICB9XG4gIC8qKlxyXG4gICAqIFByZWxvYWQgY29udGVudCB3aXRoIGxhenktbG9hZGluZyBwYXJhbVxyXG4gICAqL1xuXG5cbiAgbGF6eUxvYWQoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuZGlzcGF0Y2goJ2NvbnRlbnRMYXp5TG9hZCcsIHtcbiAgICAgIGNvbnRlbnQ6IHRoaXNcbiAgICB9KS5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sb2FkKHRydWUpO1xuICB9XG4gIC8qKlxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBJZiBwbGFjZWhvbGRlciBzaG91bGQgYmUga2VwdCBhZnRlciBjb250ZW50IGlzIGxvYWRlZFxyXG4gICAqL1xuXG5cbiAga2VlcFBsYWNlaG9sZGVyKCkge1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmFwcGx5RmlsdGVycygnaXNLZWVwaW5nUGxhY2Vob2xkZXInLCB0aGlzLmlzTG9hZGluZygpLCB0aGlzKTtcbiAgfVxuICAvKipcclxuICAgKiBEZXN0cm95IHRoZSBjb250ZW50XHJcbiAgICovXG5cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuaGFzU2xpZGUgPSBmYWxzZTtcbiAgICB0aGlzLnNsaWRlID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuZGlzcGF0Y2goJ2NvbnRlbnREZXN0cm95Jywge1xuICAgICAgY29udGVudDogdGhpc1xuICAgIH0pLmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnJlbW92ZSgpO1xuXG4gICAgaWYgKHRoaXMucGxhY2Vob2xkZXIpIHtcbiAgICAgIHRoaXMucGxhY2Vob2xkZXIuZGVzdHJveSgpO1xuICAgICAgdGhpcy5wbGFjZWhvbGRlciA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0ltYWdlQ29udGVudCgpICYmIHRoaXMuZWxlbWVudCkge1xuICAgICAgdGhpcy5lbGVtZW50Lm9ubG9hZCA9IG51bGw7XG4gICAgICB0aGlzLmVsZW1lbnQub25lcnJvciA9IG51bGw7XG4gICAgICB0aGlzLmVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIERpc3BsYXkgZXJyb3IgbWVzc2FnZVxyXG4gICAqL1xuXG5cbiAgZGlzcGxheUVycm9yKCkge1xuICAgIGlmICh0aGlzLnNsaWRlKSB7XG4gICAgICB2YXIgX3RoaXMkaW5zdGFuY2Ukb3B0aW9uLCBfdGhpcyRpbnN0YW5jZSRvcHRpb24yO1xuXG4gICAgICBsZXQgZXJyb3JNc2dFbCA9IGNyZWF0ZUVsZW1lbnQoJ3Bzd3BfX2Vycm9yLW1zZycsICdkaXYnKTtcbiAgICAgIGVycm9yTXNnRWwuaW5uZXJUZXh0ID0gKF90aGlzJGluc3RhbmNlJG9wdGlvbiA9IChfdGhpcyRpbnN0YW5jZSRvcHRpb24yID0gdGhpcy5pbnN0YW5jZS5vcHRpb25zKSA9PT0gbnVsbCB8fCBfdGhpcyRpbnN0YW5jZSRvcHRpb24yID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfdGhpcyRpbnN0YW5jZSRvcHRpb24yLmVycm9yTXNnKSAhPT0gbnVsbCAmJiBfdGhpcyRpbnN0YW5jZSRvcHRpb24gIT09IHZvaWQgMCA/IF90aGlzJGluc3RhbmNlJG9wdGlvbiA6ICcnO1xuICAgICAgZXJyb3JNc2dFbCA9XG4gICAgICAvKiogQHR5cGUge0hUTUxEaXZFbGVtZW50fSAqL1xuICAgICAgdGhpcy5pbnN0YW5jZS5hcHBseUZpbHRlcnMoJ2NvbnRlbnRFcnJvckVsZW1lbnQnLCBlcnJvck1zZ0VsLCB0aGlzKTtcbiAgICAgIHRoaXMuZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoJ3Bzd3BfX2NvbnRlbnQgcHN3cF9fZXJyb3ItbXNnLWNvbnRhaW5lcicsICdkaXYnKTtcbiAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChlcnJvck1zZ0VsKTtcbiAgICAgIHRoaXMuc2xpZGUuY29udGFpbmVyLmlubmVyVGV4dCA9ICcnO1xuICAgICAgdGhpcy5zbGlkZS5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50KTtcbiAgICAgIHRoaXMuc2xpZGUudXBkYXRlQ29udGVudFNpemUodHJ1ZSk7XG4gICAgICB0aGlzLnJlbW92ZVBsYWNlaG9sZGVyKCk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIEFwcGVuZCB0aGUgY29udGVudFxyXG4gICAqL1xuXG5cbiAgYXBwZW5kKCkge1xuICAgIGlmICh0aGlzLmlzQXR0YWNoZWQgfHwgIXRoaXMuZWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuaXNBdHRhY2hlZCA9IHRydWU7XG5cbiAgICBpZiAodGhpcy5zdGF0ZSA9PT0gTE9BRF9TVEFURS5FUlJPUikge1xuICAgICAgdGhpcy5kaXNwbGF5RXJyb3IoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pbnN0YW5jZS5kaXNwYXRjaCgnY29udGVudEFwcGVuZCcsIHtcbiAgICAgIGNvbnRlbnQ6IHRoaXNcbiAgICB9KS5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc3VwcG9ydHNEZWNvZGUgPSAoJ2RlY29kZScgaW4gdGhpcy5lbGVtZW50KTtcblxuICAgIGlmICh0aGlzLmlzSW1hZ2VDb250ZW50KCkpIHtcbiAgICAgIC8vIFVzZSBkZWNvZGUoKSBvbiBuZWFyYnkgc2xpZGVzXG4gICAgICAvL1xuICAgICAgLy8gTmVhcmJ5IHNsaWRlIGltYWdlcyBhcmUgaW4gRE9NIGFuZCBub3QgaGlkZGVuIHZpYSBkaXNwbGF5Om5vbmUuXG4gICAgICAvLyBIb3dldmVyLCB0aGV5IGFyZSBwbGFjZWQgb2Zmc2NyZWVuICh0byB0aGUgbGVmdCBhbmQgcmlnaHQgc2lkZSkuXG4gICAgICAvL1xuICAgICAgLy8gU29tZSBicm93c2VycyBkbyBub3QgY29tcG9zaXRlIHRoZSBpbWFnZSB1bnRpbCBpdCdzIGFjdHVhbGx5IHZpc2libGUsXG4gICAgICAvLyB1c2luZyBkZWNvZGUoKSBoZWxwcy5cbiAgICAgIC8vXG4gICAgICAvLyBZb3UgbWlnaHQgYXNrIFwid2h5IGRvbnQgeW91IGp1c3QgZGVjb2RlKCkgYW5kIHRoZW4gYXBwZW5kIGFsbCBpbWFnZXNcIixcbiAgICAgIC8vIHRoYXQncyBiZWNhdXNlIEkgd2FudCB0byBzaG93IGltYWdlIGJlZm9yZSBpdCdzIGZ1bGx5IGxvYWRlZCxcbiAgICAgIC8vIGFzIGJyb3dzZXIgY2FuIHJlbmRlciBwYXJ0cyBvZiBpbWFnZSB3aGlsZSBpdCBpcyBsb2FkaW5nLlxuICAgICAgLy8gV2UgZG8gbm90IGRvIHRoaXMgaW4gU2FmYXJpIGR1ZSB0byBwYXJ0aWFsIGxvYWRpbmcgYnVnLlxuICAgICAgaWYgKHN1cHBvcnRzRGVjb2RlICYmIHRoaXMuc2xpZGUgJiYgKCF0aGlzLnNsaWRlLmlzQWN0aXZlIHx8IGlzU2FmYXJpKCkpKSB7XG4gICAgICAgIHRoaXMuaXNEZWNvZGluZyA9IHRydWU7IC8vIHB1cnBvc2VmdWxseSB1c2luZyBmaW5hbGx5IGluc3RlYWQgb2YgdGhlbixcbiAgICAgICAgLy8gYXMgaWYgc3Jjc2V0IHNpemVzIGNoYW5nZXMgZHluYW1pY2FsbHkgLSBpdCBtYXkgY2F1c2UgZGVjb2RlIGVycm9yXG5cbiAgICAgICAgLyoqIEB0eXBlIHtIVE1MSW1hZ2VFbGVtZW50fSAqL1xuXG4gICAgICAgIHRoaXMuZWxlbWVudC5kZWNvZGUoKS5jYXRjaCgoKSA9PiB7fSkuZmluYWxseSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5pc0RlY29kaW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5hcHBlbmRJbWFnZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYXBwZW5kSW1hZ2UoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuc2xpZGUgJiYgIXRoaXMuZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICB0aGlzLnNsaWRlLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpO1xuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBBY3RpdmF0ZSB0aGUgc2xpZGUsXHJcbiAgICogYWN0aXZlIHNsaWRlIGlzIGdlbmVyYWxseSB0aGUgY3VycmVudCBvbmUsXHJcbiAgICogbWVhbmluZyB0aGUgdXNlciBjYW4gc2VlIGl0LlxyXG4gICAqL1xuXG5cbiAgYWN0aXZhdGUoKSB7XG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuZGlzcGF0Y2goJ2NvbnRlbnRBY3RpdmF0ZScsIHtcbiAgICAgIGNvbnRlbnQ6IHRoaXNcbiAgICB9KS5kZWZhdWx0UHJldmVudGVkIHx8ICF0aGlzLnNsaWRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNJbWFnZUNvbnRlbnQoKSAmJiB0aGlzLmlzRGVjb2RpbmcgJiYgIWlzU2FmYXJpKCkpIHtcbiAgICAgIC8vIGFkZCBpbWFnZSB0byBzbGlkZSB3aGVuIGl0IGJlY29tZXMgYWN0aXZlLFxuICAgICAgLy8gZXZlbiBpZiBpdCdzIG5vdCBmaW5pc2hlZCBkZWNvZGluZ1xuICAgICAgdGhpcy5hcHBlbmRJbWFnZSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0Vycm9yKCkpIHtcbiAgICAgIHRoaXMubG9hZChmYWxzZSwgdHJ1ZSk7IC8vIHRyeSB0byByZWxvYWRcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zbGlkZS5ob2xkZXJFbGVtZW50KSB7XG4gICAgICB0aGlzLnNsaWRlLmhvbGRlckVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBEZWFjdGl2YXRlIHRoZSBjb250ZW50XHJcbiAgICovXG5cblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuaW5zdGFuY2UuZGlzcGF0Y2goJ2NvbnRlbnREZWFjdGl2YXRlJywge1xuICAgICAgY29udGVudDogdGhpc1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuc2xpZGUgJiYgdGhpcy5zbGlkZS5ob2xkZXJFbGVtZW50KSB7XG4gICAgICB0aGlzLnNsaWRlLmhvbGRlckVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgfVxuICB9XG4gIC8qKlxyXG4gICAqIFJlbW92ZSB0aGUgY29udGVudCBmcm9tIERPTVxyXG4gICAqL1xuXG5cbiAgcmVtb3ZlKCkge1xuICAgIHRoaXMuaXNBdHRhY2hlZCA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuaW5zdGFuY2UuZGlzcGF0Y2goJ2NvbnRlbnRSZW1vdmUnLCB7XG4gICAgICBjb250ZW50OiB0aGlzXG4gICAgfSkuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmVsZW1lbnQgJiYgdGhpcy5lbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wbGFjZWhvbGRlciAmJiB0aGlzLnBsYWNlaG9sZGVyLmVsZW1lbnQpIHtcbiAgICAgIHRoaXMucGxhY2Vob2xkZXIuZWxlbWVudC5yZW1vdmUoKTtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogQXBwZW5kIHRoZSBpbWFnZSBjb250ZW50IHRvIHNsaWRlIGNvbnRhaW5lclxyXG4gICAqL1xuXG5cbiAgYXBwZW5kSW1hZ2UoKSB7XG4gICAgaWYgKCF0aGlzLmlzQXR0YWNoZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pbnN0YW5jZS5kaXNwYXRjaCgnY29udGVudEFwcGVuZEltYWdlJywge1xuICAgICAgY29udGVudDogdGhpc1xuICAgIH0pLmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9IC8vIGVuc3VyZSB0aGF0IGVsZW1lbnQgZXhpc3RzIGFuZCBpcyBub3QgYWxyZWFkeSBhcHBlbmRlZFxuXG5cbiAgICBpZiAodGhpcy5zbGlkZSAmJiB0aGlzLmVsZW1lbnQgJiYgIXRoaXMuZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICB0aGlzLnNsaWRlLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRlID09PSBMT0FEX1NUQVRFLkxPQURFRCB8fCB0aGlzLnN0YXRlID09PSBMT0FEX1NUQVRFLkVSUk9SKSB7XG4gICAgICB0aGlzLnJlbW92ZVBsYWNlaG9sZGVyKCk7XG4gICAgfVxuICB9XG5cbn1cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3Bob3Rvc3dpcGUuanMnKS5QaG90b1N3aXBlT3B0aW9uc30gUGhvdG9Td2lwZU9wdGlvbnMgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL2NvcmUvYmFzZS5qcycpLmRlZmF1bHR9IFBob3RvU3dpcGVCYXNlICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi9waG90b3N3aXBlLmpzJykuUG9pbnR9IFBvaW50ICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi9zbGlkZS9zbGlkZS5qcycpLlNsaWRlRGF0YX0gU2xpZGVEYXRhICovXG5cbi8qKlxyXG4gKiBAcGFyYW0ge1Bob3RvU3dpcGVPcHRpb25zfSBvcHRpb25zXHJcbiAqIEBwYXJhbSB7UGhvdG9Td2lwZUJhc2V9IHBzd3BcclxuICogQHJldHVybnMge1BvaW50fVxyXG4gKi9cbmZ1bmN0aW9uIGdldFZpZXdwb3J0U2l6ZShvcHRpb25zLCBwc3dwKSB7XG4gIGlmIChvcHRpb25zLmdldFZpZXdwb3J0U2l6ZUZuKSB7XG4gICAgY29uc3QgbmV3Vmlld3BvcnRTaXplID0gb3B0aW9ucy5nZXRWaWV3cG9ydFNpemVGbihvcHRpb25zLCBwc3dwKTtcblxuICAgIGlmIChuZXdWaWV3cG9ydFNpemUpIHtcbiAgICAgIHJldHVybiBuZXdWaWV3cG9ydFNpemU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB4OiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsXG4gICAgLy8gVE9ETzogaGVpZ2h0IG9uIG1vYmlsZSBpcyB2ZXJ5IGluY29zaXN0ZW50IGR1ZSB0byB0b29sYmFyXG4gICAgLy8gZmluZCBhIHdheSB0byBpbXByb3ZlIHRoaXNcbiAgICAvL1xuICAgIC8vIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgLSBkb2Vzbid0IHNlZW0gdG8gd29yayB3ZWxsXG4gICAgeTogd2luZG93LmlubmVySGVpZ2h0XG4gIH07XG59XG4vKipcclxuICogUGFyc2VzIHBhZGRpbmcgb3B0aW9uLlxyXG4gKiBTdXBwb3J0ZWQgZm9ybWF0czpcclxuICpcclxuICogLy8gT2JqZWN0XHJcbiAqIHBhZGRpbmc6IHtcclxuICogIHRvcDogMCxcclxuICogIGJvdHRvbTogMCxcclxuICogIGxlZnQ6IDAsXHJcbiAqICByaWdodDogMFxyXG4gKiB9XHJcbiAqXHJcbiAqIC8vIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBvYmplY3RcclxuICogcGFkZGluZ0ZuOiAodmlld3BvcnRTaXplLCBpdGVtRGF0YSwgaW5kZXgpID0+IHtcclxuICogIHJldHVybiB7XHJcbiAqICAgIHRvcDogMCxcclxuICogICAgYm90dG9tOiAwLFxyXG4gKiAgICBsZWZ0OiAwLFxyXG4gKiAgICByaWdodDogMFxyXG4gKiAgfTtcclxuICogfVxyXG4gKlxyXG4gKiAvLyBMZWdhY3kgdmFyaWFudFxyXG4gKiBwYWRkaW5nTGVmdDogMCxcclxuICogcGFkZGluZ1JpZ2h0OiAwLFxyXG4gKiBwYWRkaW5nVG9wOiAwLFxyXG4gKiBwYWRkaW5nQm90dG9tOiAwLFxyXG4gKlxyXG4gKiBAcGFyYW0geydsZWZ0JyB8ICd0b3AnIHwgJ2JvdHRvbScgfCAncmlnaHQnfSBwcm9wXHJcbiAqIEBwYXJhbSB7UGhvdG9Td2lwZU9wdGlvbnN9IG9wdGlvbnMgUGhvdG9Td2lwZSBvcHRpb25zXHJcbiAqIEBwYXJhbSB7UG9pbnR9IHZpZXdwb3J0U2l6ZSBQaG90b1N3aXBlIHZpZXdwb3J0IHNpemUsIGZvciBleGFtcGxlOiB7IHg6ODAwLCB5OjYwMCB9XHJcbiAqIEBwYXJhbSB7U2xpZGVEYXRhfSBpdGVtRGF0YSBEYXRhIGFib3V0IHRoZSBzbGlkZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggU2xpZGUgaW5kZXhcclxuICogQHJldHVybnMge251bWJlcn1cclxuICovXG5cbmZ1bmN0aW9uIHBhcnNlUGFkZGluZ09wdGlvbihwcm9wLCBvcHRpb25zLCB2aWV3cG9ydFNpemUsIGl0ZW1EYXRhLCBpbmRleCkge1xuICBsZXQgcGFkZGluZ1ZhbHVlID0gMDtcblxuICBpZiAob3B0aW9ucy5wYWRkaW5nRm4pIHtcbiAgICBwYWRkaW5nVmFsdWUgPSBvcHRpb25zLnBhZGRpbmdGbih2aWV3cG9ydFNpemUsIGl0ZW1EYXRhLCBpbmRleClbcHJvcF07XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5wYWRkaW5nKSB7XG4gICAgcGFkZGluZ1ZhbHVlID0gb3B0aW9ucy5wYWRkaW5nW3Byb3BdO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGxlZ2FjeVByb3BOYW1lID0gJ3BhZGRpbmcnICsgcHJvcFswXS50b1VwcGVyQ2FzZSgpICsgcHJvcC5zbGljZSgxKTsgLy8gQHRzLWV4cGVjdC1lcnJvclxuXG4gICAgaWYgKG9wdGlvbnNbbGVnYWN5UHJvcE5hbWVdKSB7XG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICBwYWRkaW5nVmFsdWUgPSBvcHRpb25zW2xlZ2FjeVByb3BOYW1lXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gTnVtYmVyKHBhZGRpbmdWYWx1ZSkgfHwgMDtcbn1cbi8qKlxyXG4gKiBAcGFyYW0ge1Bob3RvU3dpcGVPcHRpb25zfSBvcHRpb25zXHJcbiAqIEBwYXJhbSB7UG9pbnR9IHZpZXdwb3J0U2l6ZVxyXG4gKiBAcGFyYW0ge1NsaWRlRGF0YX0gaXRlbURhdGFcclxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XHJcbiAqIEByZXR1cm5zIHtQb2ludH1cclxuICovXG5cbmZ1bmN0aW9uIGdldFBhbkFyZWFTaXplKG9wdGlvbnMsIHZpZXdwb3J0U2l6ZSwgaXRlbURhdGEsIGluZGV4KSB7XG4gIHJldHVybiB7XG4gICAgeDogdmlld3BvcnRTaXplLnggLSBwYXJzZVBhZGRpbmdPcHRpb24oJ2xlZnQnLCBvcHRpb25zLCB2aWV3cG9ydFNpemUsIGl0ZW1EYXRhLCBpbmRleCkgLSBwYXJzZVBhZGRpbmdPcHRpb24oJ3JpZ2h0Jywgb3B0aW9ucywgdmlld3BvcnRTaXplLCBpdGVtRGF0YSwgaW5kZXgpLFxuICAgIHk6IHZpZXdwb3J0U2l6ZS55IC0gcGFyc2VQYWRkaW5nT3B0aW9uKCd0b3AnLCBvcHRpb25zLCB2aWV3cG9ydFNpemUsIGl0ZW1EYXRhLCBpbmRleCkgLSBwYXJzZVBhZGRpbmdPcHRpb24oJ2JvdHRvbScsIG9wdGlvbnMsIHZpZXdwb3J0U2l6ZSwgaXRlbURhdGEsIGluZGV4KVxuICB9O1xufVxuXG5jb25zdCBNQVhfSU1BR0VfV0lEVEggPSA0MDAwO1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3Bob3Rvc3dpcGUuanMnKS5kZWZhdWx0fSBQaG90b1N3aXBlICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi9waG90b3N3aXBlLmpzJykuUGhvdG9Td2lwZU9wdGlvbnN9IFBob3RvU3dpcGVPcHRpb25zICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi9waG90b3N3aXBlLmpzJykuUG9pbnR9IFBvaW50ICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi9zbGlkZS9zbGlkZS5qcycpLlNsaWRlRGF0YX0gU2xpZGVEYXRhICovXG5cbi8qKiBAdHlwZWRlZiB7J2ZpdCcgfCAnZmlsbCcgfCBudW1iZXIgfCAoKHpvb21MZXZlbE9iamVjdDogWm9vbUxldmVsKSA9PiBudW1iZXIpfSBab29tTGV2ZWxPcHRpb24gKi9cblxuLyoqXHJcbiAqIENhbGN1bGF0ZXMgem9vbSBsZXZlbHMgZm9yIHNwZWNpZmljIHNsaWRlLlxyXG4gKiBEZXBlbmRzIG9uIHZpZXdwb3J0IHNpemUgYW5kIGltYWdlIHNpemUuXHJcbiAqL1xuXG5jbGFzcyBab29tTGV2ZWwge1xuICAvKipcclxuICAgKiBAcGFyYW0ge1Bob3RvU3dpcGVPcHRpb25zfSBvcHRpb25zIFBob3RvU3dpcGUgb3B0aW9uc1xyXG4gICAqIEBwYXJhbSB7U2xpZGVEYXRhfSBpdGVtRGF0YSBTbGlkZSBkYXRhXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFNsaWRlIGluZGV4XHJcbiAgICogQHBhcmFtIHtQaG90b1N3aXBlfSBbcHN3cF0gUGhvdG9Td2lwZSBpbnN0YW5jZSwgY2FuIGJlIHVuZGVmaW5lZCBpZiBub3QgaW5pdGlhbGl6ZWQgeWV0XHJcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMsIGl0ZW1EYXRhLCBpbmRleCwgcHN3cCkge1xuICAgIHRoaXMucHN3cCA9IHBzd3A7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLml0ZW1EYXRhID0gaXRlbURhdGE7XG4gICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgIC8qKiBAdHlwZSB7IFBvaW50IHwgbnVsbCB9ICovXG5cbiAgICB0aGlzLnBhbkFyZWFTaXplID0gbnVsbDtcbiAgICAvKiogQHR5cGUgeyBQb2ludCB8IG51bGwgfSAqL1xuXG4gICAgdGhpcy5lbGVtZW50U2l6ZSA9IG51bGw7XG4gICAgdGhpcy5maXQgPSAxO1xuICAgIHRoaXMuZmlsbCA9IDE7XG4gICAgdGhpcy52RmlsbCA9IDE7XG4gICAgdGhpcy5pbml0aWFsID0gMTtcbiAgICB0aGlzLnNlY29uZGFyeSA9IDE7XG4gICAgdGhpcy5tYXggPSAxO1xuICAgIHRoaXMubWluID0gMTtcbiAgfVxuICAvKipcclxuICAgKiBDYWxjdWxhdGUgaW5pdGlhbCwgc2Vjb25kYXJ5IGFuZCBtYXhpbXVtIHpvb20gbGV2ZWwgZm9yIHRoZSBzcGVjaWZpZWQgc2xpZGUuXHJcbiAgICpcclxuICAgKiBJdCBzaG91bGQgYmUgY2FsbGVkIHdoZW4gZWl0aGVyIGltYWdlIG9yIHZpZXdwb3J0IHNpemUgY2hhbmdlcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBtYXhXaWR0aFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBtYXhIZWlnaHRcclxuICAgKiBAcGFyYW0ge1BvaW50fSBwYW5BcmVhU2l6ZVxyXG4gICAqL1xuXG5cbiAgdXBkYXRlKG1heFdpZHRoLCBtYXhIZWlnaHQsIHBhbkFyZWFTaXplKSB7XG4gICAgLyoqIEB0eXBlIHtQb2ludH0gKi9cbiAgICBjb25zdCBlbGVtZW50U2l6ZSA9IHtcbiAgICAgIHg6IG1heFdpZHRoLFxuICAgICAgeTogbWF4SGVpZ2h0XG4gICAgfTtcbiAgICB0aGlzLmVsZW1lbnRTaXplID0gZWxlbWVudFNpemU7XG4gICAgdGhpcy5wYW5BcmVhU2l6ZSA9IHBhbkFyZWFTaXplO1xuICAgIGNvbnN0IGhSYXRpbyA9IHBhbkFyZWFTaXplLnggLyBlbGVtZW50U2l6ZS54O1xuICAgIGNvbnN0IHZSYXRpbyA9IHBhbkFyZWFTaXplLnkgLyBlbGVtZW50U2l6ZS55O1xuICAgIHRoaXMuZml0ID0gTWF0aC5taW4oMSwgaFJhdGlvIDwgdlJhdGlvID8gaFJhdGlvIDogdlJhdGlvKTtcbiAgICB0aGlzLmZpbGwgPSBNYXRoLm1pbigxLCBoUmF0aW8gPiB2UmF0aW8gPyBoUmF0aW8gOiB2UmF0aW8pOyAvLyB6b29tLnZGaWxsIGRlZmluZXMgem9vbSBsZXZlbCBvZiB0aGUgaW1hZ2VcbiAgICAvLyB3aGVuIGl0IGhhcyAxMDAlIG9mIHZpZXdwb3J0IHZlcnRpY2FsIHNwYWNlIChoZWlnaHQpXG5cbiAgICB0aGlzLnZGaWxsID0gTWF0aC5taW4oMSwgdlJhdGlvKTtcbiAgICB0aGlzLmluaXRpYWwgPSB0aGlzLl9nZXRJbml0aWFsKCk7XG4gICAgdGhpcy5zZWNvbmRhcnkgPSB0aGlzLl9nZXRTZWNvbmRhcnkoKTtcbiAgICB0aGlzLm1heCA9IE1hdGgubWF4KHRoaXMuaW5pdGlhbCwgdGhpcy5zZWNvbmRhcnksIHRoaXMuX2dldE1heCgpKTtcbiAgICB0aGlzLm1pbiA9IE1hdGgubWluKHRoaXMuZml0LCB0aGlzLmluaXRpYWwsIHRoaXMuc2Vjb25kYXJ5KTtcblxuICAgIGlmICh0aGlzLnBzd3ApIHtcbiAgICAgIHRoaXMucHN3cC5kaXNwYXRjaCgnem9vbUxldmVsc1VwZGF0ZScsIHtcbiAgICAgICAgem9vbUxldmVsczogdGhpcyxcbiAgICAgICAgc2xpZGVEYXRhOiB0aGlzLml0ZW1EYXRhXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgLyoqXHJcbiAgICogUGFyc2VzIHVzZXItZGVmaW5lZCB6b29tIG9wdGlvbi5cclxuICAgKlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICogQHBhcmFtIHsnaW5pdGlhbCcgfCAnc2Vjb25kYXJ5JyB8ICdtYXgnfSBvcHRpb25QcmVmaXggWm9vbSBsZXZlbCBvcHRpb24gcHJlZml4IChpbml0aWFsLCBzZWNvbmRhcnksIG1heClcclxuICAgKiBAcmV0dXJucyB7IG51bWJlciB8IHVuZGVmaW5lZCB9XHJcbiAgICovXG5cblxuICBfcGFyc2Vab29tTGV2ZWxPcHRpb24ob3B0aW9uUHJlZml4KSB7XG4gICAgY29uc3Qgb3B0aW9uTmFtZSA9XG4gICAgLyoqIEB0eXBlIHsnaW5pdGlhbFpvb21MZXZlbCcgfCAnc2Vjb25kYXJ5Wm9vbUxldmVsJyB8ICdtYXhab29tTGV2ZWwnfSAqL1xuICAgIG9wdGlvblByZWZpeCArICdab29tTGV2ZWwnO1xuICAgIGNvbnN0IG9wdGlvblZhbHVlID0gdGhpcy5vcHRpb25zW29wdGlvbk5hbWVdO1xuXG4gICAgaWYgKCFvcHRpb25WYWx1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0aW9uVmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBvcHRpb25WYWx1ZSh0aGlzKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9uVmFsdWUgPT09ICdmaWxsJykge1xuICAgICAgcmV0dXJuIHRoaXMuZmlsbDtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9uVmFsdWUgPT09ICdmaXQnKSB7XG4gICAgICByZXR1cm4gdGhpcy5maXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIE51bWJlcihvcHRpb25WYWx1ZSk7XG4gIH1cbiAgLyoqXHJcbiAgICogR2V0IHpvb20gbGV2ZWwgdG8gd2hpY2ggaW1hZ2Ugd2lsbCBiZSB6b29tZWQgYWZ0ZXIgZG91YmxlLXRhcCBnZXN0dXJlLFxyXG4gICAqIG9yIHdoZW4gdXNlciBjbGlja3Mgb24gem9vbSBpY29uLFxyXG4gICAqIG9yIG1vdXNlLWNsaWNrIG9uIGltYWdlIGl0c2VsZi5cclxuICAgKiBJZiB5b3UgcmV0dXJuIDEgaW1hZ2Ugd2lsbCBiZSB6b29tZWQgdG8gaXRzIG9yaWdpbmFsIHNpemUuXHJcbiAgICpcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEByZXR1cm4ge251bWJlcn1cclxuICAgKi9cblxuXG4gIF9nZXRTZWNvbmRhcnkoKSB7XG4gICAgbGV0IGN1cnJab29tTGV2ZWwgPSB0aGlzLl9wYXJzZVpvb21MZXZlbE9wdGlvbignc2Vjb25kYXJ5Jyk7XG5cbiAgICBpZiAoY3Vyclpvb21MZXZlbCkge1xuICAgICAgcmV0dXJuIGN1cnJab29tTGV2ZWw7XG4gICAgfSAvLyAzeCBvZiBcImZpdFwiIHN0YXRlLCBidXQgbm90IGxhcmdlciB0aGFuIG9yaWdpbmFsXG5cblxuICAgIGN1cnJab29tTGV2ZWwgPSBNYXRoLm1pbigxLCB0aGlzLmZpdCAqIDMpO1xuXG4gICAgaWYgKHRoaXMuZWxlbWVudFNpemUgJiYgY3Vyclpvb21MZXZlbCAqIHRoaXMuZWxlbWVudFNpemUueCA+IE1BWF9JTUFHRV9XSURUSCkge1xuICAgICAgY3Vyclpvb21MZXZlbCA9IE1BWF9JTUFHRV9XSURUSCAvIHRoaXMuZWxlbWVudFNpemUueDtcbiAgICB9XG5cbiAgICByZXR1cm4gY3Vyclpvb21MZXZlbDtcbiAgfVxuICAvKipcclxuICAgKiBHZXQgaW5pdGlhbCBpbWFnZSB6b29tIGxldmVsLlxyXG4gICAqXHJcbiAgICogQHByaXZhdGVcclxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICovXG5cblxuICBfZ2V0SW5pdGlhbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyc2Vab29tTGV2ZWxPcHRpb24oJ2luaXRpYWwnKSB8fCB0aGlzLmZpdDtcbiAgfVxuICAvKipcclxuICAgKiBNYXhpbXVtIHpvb20gbGV2ZWwgd2hlbiB1c2VyIHpvb21zXHJcbiAgICogdmlhIHpvb20vcGluY2ggZ2VzdHVyZSxcclxuICAgKiB2aWEgY21kL2N0cmwtd2hlZWwgb3IgdmlhIHRyYWNrcGFkLlxyXG4gICAqXHJcbiAgICogQHByaXZhdGVcclxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICovXG5cblxuICBfZ2V0TWF4KCkge1xuICAgIC8vIG1heCB6b29tIGxldmVsIGlzIHg0IGZyb20gXCJmaXQgc3RhdGVcIixcbiAgICAvLyB1c2VkIGZvciB6b29tIGdlc3R1cmUgYW5kIGN0cmwvdHJhY2twYWQgem9vbVxuICAgIHJldHVybiB0aGlzLl9wYXJzZVpvb21MZXZlbE9wdGlvbignbWF4JykgfHwgTWF0aC5tYXgoMSwgdGhpcy5maXQgKiA0KTtcbiAgfVxuXG59XG5cbi8qKlxyXG4gKiBMYXp5LWxvYWQgYW4gaW1hZ2VcclxuICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIGJvdGggYnkgTGlnaHRib3ggYW5kIFBob3RvU3dpcGUgY29yZSxcclxuICogdGh1cyBpdCBjYW4gYmUgY2FsbGVkIGJlZm9yZSBkaWFsb2cgaXMgb3BlbmVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1NsaWRlRGF0YX0gaXRlbURhdGEgRGF0YSBhYm91dCB0aGUgc2xpZGVcclxuICogQHBhcmFtIHtQaG90b1N3aXBlQmFzZX0gaW5zdGFuY2UgUGhvdG9Td2lwZSBvciBQaG90b1N3aXBlTGlnaHRib3ggaW5zdGFuY2VcclxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XHJcbiAqIEByZXR1cm5zIHtDb250ZW50fSBJbWFnZSB0aGF0IGlzIGJlaW5nIGRlY29kZWQgb3IgZmFsc2UuXHJcbiAqL1xuXG5mdW5jdGlvbiBsYXp5TG9hZERhdGEoaXRlbURhdGEsIGluc3RhbmNlLCBpbmRleCkge1xuICBjb25zdCBjb250ZW50ID0gaW5zdGFuY2UuY3JlYXRlQ29udGVudEZyb21EYXRhKGl0ZW1EYXRhLCBpbmRleCk7XG4gIC8qKiBAdHlwZSB7Wm9vbUxldmVsIHwgdW5kZWZpbmVkfSAqL1xuXG4gIGxldCB6b29tTGV2ZWw7XG4gIGNvbnN0IHtcbiAgICBvcHRpb25zXG4gIH0gPSBpbnN0YW5jZTsgLy8gV2UgbmVlZCB0byBrbm93IGRpbWVuc2lvbnMgb2YgdGhlIGltYWdlIHRvIHByZWxvYWQgaXQsXG4gIC8vIGFzIGl0IG1pZ2h0IHVzZSBzcmNzZXQsIGFuZCB3ZSBuZWVkIHRvIGRlZmluZSBzaXplc1xuXG4gIGlmIChvcHRpb25zKSB7XG4gICAgem9vbUxldmVsID0gbmV3IFpvb21MZXZlbChvcHRpb25zLCBpdGVtRGF0YSwgLTEpO1xuICAgIGxldCB2aWV3cG9ydFNpemU7XG5cbiAgICBpZiAoaW5zdGFuY2UucHN3cCkge1xuICAgICAgdmlld3BvcnRTaXplID0gaW5zdGFuY2UucHN3cC52aWV3cG9ydFNpemU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXdwb3J0U2l6ZSA9IGdldFZpZXdwb3J0U2l6ZShvcHRpb25zLCBpbnN0YW5jZSk7XG4gICAgfVxuXG4gICAgY29uc3QgcGFuQXJlYVNpemUgPSBnZXRQYW5BcmVhU2l6ZShvcHRpb25zLCB2aWV3cG9ydFNpemUsIGl0ZW1EYXRhLCBpbmRleCk7XG4gICAgem9vbUxldmVsLnVwZGF0ZShjb250ZW50LndpZHRoLCBjb250ZW50LmhlaWdodCwgcGFuQXJlYVNpemUpO1xuICB9XG5cbiAgY29udGVudC5sYXp5TG9hZCgpO1xuXG4gIGlmICh6b29tTGV2ZWwpIHtcbiAgICBjb250ZW50LnNldERpc3BsYXllZFNpemUoTWF0aC5jZWlsKGNvbnRlbnQud2lkdGggKiB6b29tTGV2ZWwuaW5pdGlhbCksIE1hdGguY2VpbChjb250ZW50LmhlaWdodCAqIHpvb21MZXZlbC5pbml0aWFsKSk7XG4gIH1cblxuICByZXR1cm4gY29udGVudDtcbn1cbi8qKlxyXG4gKiBMYXp5LWxvYWRzIHNwZWNpZmljIHNsaWRlLlxyXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgYm90aCBieSBMaWdodGJveCBhbmQgUGhvdG9Td2lwZSBjb3JlLFxyXG4gKiB0aHVzIGl0IGNhbiBiZSBjYWxsZWQgYmVmb3JlIGRpYWxvZyBpcyBvcGVuZWQuXHJcbiAqXHJcbiAqIEJ5IGRlZmF1bHQsIGl0IGxvYWRzIGltYWdlIGJhc2VkIG9uIHZpZXdwb3J0IHNpemUgYW5kIGluaXRpYWwgem9vbSBsZXZlbC5cclxuICpcclxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFNsaWRlIGluZGV4XHJcbiAqIEBwYXJhbSB7UGhvdG9Td2lwZUJhc2V9IGluc3RhbmNlIFBob3RvU3dpcGUgb3IgUGhvdG9Td2lwZUxpZ2h0Ym94IGV2ZW50YWJsZSBpbnN0YW5jZVxyXG4gKiBAcmV0dXJucyB7Q29udGVudCB8IHVuZGVmaW5lZH1cclxuICovXG5cbmZ1bmN0aW9uIGxhenlMb2FkU2xpZGUoaW5kZXgsIGluc3RhbmNlKSB7XG4gIGNvbnN0IGl0ZW1EYXRhID0gaW5zdGFuY2UuZ2V0SXRlbURhdGEoaW5kZXgpO1xuXG4gIGlmIChpbnN0YW5jZS5kaXNwYXRjaCgnbGF6eUxvYWRTbGlkZScsIHtcbiAgICBpbmRleCxcbiAgICBpdGVtRGF0YVxuICB9KS5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIGxhenlMb2FkRGF0YShpdGVtRGF0YSwgaW5zdGFuY2UsIGluZGV4KTtcbn1cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoXCIuLi9waG90b3N3aXBlLmpzXCIpLmRlZmF1bHR9IFBob3RvU3dpcGUgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoXCIuLi9zbGlkZS9zbGlkZS5qc1wiKS5TbGlkZURhdGF9IFNsaWRlRGF0YSAqL1xuXG4vKipcclxuICogUGhvdG9Td2lwZSBiYXNlIGNsYXNzIHRoYXQgY2FuIHJldHJpZXZlIGRhdGEgYWJvdXQgZXZlcnkgc2xpZGUuXHJcbiAqIFNoYXJlZCBieSBQaG90b1N3aXBlIENvcmUgYW5kIFBob3RvU3dpcGUgTGlnaHRib3hcclxuICovXG5cbmNsYXNzIFBob3RvU3dpcGVCYXNlIGV4dGVuZHMgRXZlbnRhYmxlIHtcbiAgLyoqXHJcbiAgICogR2V0IHRvdGFsIG51bWJlciBvZiBzbGlkZXNcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICovXG4gIGdldE51bUl0ZW1zKCkge1xuICAgIHZhciBfdGhpcyRvcHRpb25zO1xuXG4gICAgbGV0IG51bUl0ZW1zID0gMDtcbiAgICBjb25zdCBkYXRhU291cmNlID0gKF90aGlzJG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMpID09PSBudWxsIHx8IF90aGlzJG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF90aGlzJG9wdGlvbnMuZGF0YVNvdXJjZTtcblxuICAgIGlmIChkYXRhU291cmNlICYmICdsZW5ndGgnIGluIGRhdGFTb3VyY2UpIHtcbiAgICAgIC8vIG1heSBiZSBhbiBhcnJheSBvciBqdXN0IG9iamVjdCB3aXRoIGxlbmd0aCBwcm9wZXJ0eVxuICAgICAgbnVtSXRlbXMgPSBkYXRhU291cmNlLmxlbmd0aDtcbiAgICB9IGVsc2UgaWYgKGRhdGFTb3VyY2UgJiYgJ2dhbGxlcnknIGluIGRhdGFTb3VyY2UpIHtcbiAgICAgIC8vIHF1ZXJ5IERPTSBlbGVtZW50c1xuICAgICAgaWYgKCFkYXRhU291cmNlLml0ZW1zKSB7XG4gICAgICAgIGRhdGFTb3VyY2UuaXRlbXMgPSB0aGlzLl9nZXRHYWxsZXJ5RE9NRWxlbWVudHMoZGF0YVNvdXJjZS5nYWxsZXJ5KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGFTb3VyY2UuaXRlbXMpIHtcbiAgICAgICAgbnVtSXRlbXMgPSBkYXRhU291cmNlLml0ZW1zLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9IC8vIGxlZ2FjeSBldmVudCwgYmVmb3JlIGZpbHRlcnMgd2VyZSBpbnRyb2R1Y2VkXG5cblxuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5kaXNwYXRjaCgnbnVtSXRlbXMnLCB7XG4gICAgICBkYXRhU291cmNlLFxuICAgICAgbnVtSXRlbXNcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5hcHBseUZpbHRlcnMoJ251bUl0ZW1zJywgZXZlbnQubnVtSXRlbXMsIGRhdGFTb3VyY2UpO1xuICB9XG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7U2xpZGVEYXRhfSBzbGlkZURhdGFcclxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcclxuICAgKiBAcmV0dXJucyB7Q29udGVudH1cclxuICAgKi9cblxuXG4gIGNyZWF0ZUNvbnRlbnRGcm9tRGF0YShzbGlkZURhdGEsIGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBDb250ZW50KHNsaWRlRGF0YSwgdGhpcywgaW5kZXgpO1xuICB9XG4gIC8qKlxyXG4gICAqIEdldCBpdGVtIGRhdGEgYnkgaW5kZXguXHJcbiAgICpcclxuICAgKiBcIml0ZW0gZGF0YVwiIHNob3VsZCBjb250YWluIG5vcm1hbGl6ZWQgaW5mb3JtYXRpb24gdGhhdCBQaG90b1N3aXBlIG5lZWRzIHRvIGdlbmVyYXRlIGEgc2xpZGUuXHJcbiAgICogRm9yIGV4YW1wbGUsIGl0IG1heSBjb250YWluIHByb3BlcnRpZXMgbGlrZVxyXG4gICAqIGBzcmNgLCBgc3Jjc2V0YCwgYHdgLCBgaGAsIHdoaWNoIHdpbGwgYmUgdXNlZCB0byBnZW5lcmF0ZSBhIHNsaWRlIHdpdGggaW1hZ2UuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcclxuICAgKiBAcmV0dXJucyB7U2xpZGVEYXRhfVxyXG4gICAqL1xuXG5cbiAgZ2V0SXRlbURhdGEoaW5kZXgpIHtcbiAgICB2YXIgX3RoaXMkb3B0aW9uczI7XG5cbiAgICBjb25zdCBkYXRhU291cmNlID0gKF90aGlzJG9wdGlvbnMyID0gdGhpcy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfdGhpcyRvcHRpb25zMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3RoaXMkb3B0aW9uczIuZGF0YVNvdXJjZTtcbiAgICAvKiogQHR5cGUge1NsaWRlRGF0YSB8IEhUTUxFbGVtZW50fSAqL1xuXG4gICAgbGV0IGRhdGFTb3VyY2VJdGVtID0ge307XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhU291cmNlKSkge1xuICAgICAgLy8gRGF0YXNvdXJjZSBpcyBhbiBhcnJheSBvZiBlbGVtZW50c1xuICAgICAgZGF0YVNvdXJjZUl0ZW0gPSBkYXRhU291cmNlW2luZGV4XTtcbiAgICB9IGVsc2UgaWYgKGRhdGFTb3VyY2UgJiYgJ2dhbGxlcnknIGluIGRhdGFTb3VyY2UpIHtcbiAgICAgIC8vIGRhdGFTb3VyY2UgaGFzIGdhbGxlcnkgcHJvcGVydHksXG4gICAgICAvLyB0aHVzIGl0IHdhcyBjcmVhdGVkIGJ5IExpZ2h0Ym94LCBiYXNlZCBvblxuICAgICAgLy8gZ2FsbGVyeSBhbmQgY2hpbGRyZW4gb3B0aW9uc1xuICAgICAgLy8gcXVlcnkgRE9NIGVsZW1lbnRzXG4gICAgICBpZiAoIWRhdGFTb3VyY2UuaXRlbXMpIHtcbiAgICAgICAgZGF0YVNvdXJjZS5pdGVtcyA9IHRoaXMuX2dldEdhbGxlcnlET01FbGVtZW50cyhkYXRhU291cmNlLmdhbGxlcnkpO1xuICAgICAgfVxuXG4gICAgICBkYXRhU291cmNlSXRlbSA9IGRhdGFTb3VyY2UuaXRlbXNbaW5kZXhdO1xuICAgIH1cblxuICAgIGxldCBpdGVtRGF0YSA9IGRhdGFTb3VyY2VJdGVtO1xuXG4gICAgaWYgKGl0ZW1EYXRhIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgaXRlbURhdGEgPSB0aGlzLl9kb21FbGVtZW50VG9JdGVtRGF0YShpdGVtRGF0YSk7XG4gICAgfSAvLyBEaXNwYXRjaGluZyB0aGUgaXRlbURhdGEgZXZlbnQsXG4gICAgLy8gaXQncyBhIGxlZ2FjeSB2ZXJpb24gYmVmb3JlIGZpbHRlcnMgd2VyZSBpbnRyb2R1Y2VkXG5cblxuICAgIGNvbnN0IGV2ZW50ID0gdGhpcy5kaXNwYXRjaCgnaXRlbURhdGEnLCB7XG4gICAgICBpdGVtRGF0YTogaXRlbURhdGEgfHwge30sXG4gICAgICBpbmRleFxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLmFwcGx5RmlsdGVycygnaXRlbURhdGEnLCBldmVudC5pdGVtRGF0YSwgaW5kZXgpO1xuICB9XG4gIC8qKlxyXG4gICAqIEdldCBhcnJheSBvZiBnYWxsZXJ5IERPTSBlbGVtZW50cyxcclxuICAgKiBiYXNlZCBvbiBjaGlsZFNlbGVjdG9yIGFuZCBnYWxsZXJ5IGVsZW1lbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBnYWxsZXJ5RWxlbWVudFxyXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudFtdfVxyXG4gICAqL1xuXG5cbiAgX2dldEdhbGxlcnlET01FbGVtZW50cyhnYWxsZXJ5RWxlbWVudCkge1xuICAgIHZhciBfdGhpcyRvcHRpb25zMywgX3RoaXMkb3B0aW9uczQ7XG5cbiAgICBpZiAoKF90aGlzJG9wdGlvbnMzID0gdGhpcy5vcHRpb25zKSAhPT0gbnVsbCAmJiBfdGhpcyRvcHRpb25zMyAhPT0gdm9pZCAwICYmIF90aGlzJG9wdGlvbnMzLmNoaWxkcmVuIHx8IChfdGhpcyRvcHRpb25zNCA9IHRoaXMub3B0aW9ucykgIT09IG51bGwgJiYgX3RoaXMkb3B0aW9uczQgIT09IHZvaWQgMCAmJiBfdGhpcyRvcHRpb25zNC5jaGlsZFNlbGVjdG9yKSB7XG4gICAgICByZXR1cm4gZ2V0RWxlbWVudHNGcm9tT3B0aW9uKHRoaXMub3B0aW9ucy5jaGlsZHJlbiwgdGhpcy5vcHRpb25zLmNoaWxkU2VsZWN0b3IsIGdhbGxlcnlFbGVtZW50KSB8fCBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4gW2dhbGxlcnlFbGVtZW50XTtcbiAgfVxuICAvKipcclxuICAgKiBDb252ZXJ0cyBET00gZWxlbWVudCB0byBpdGVtIGRhdGEgb2JqZWN0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBET00gZWxlbWVudFxyXG4gICAqIEByZXR1cm5zIHtTbGlkZURhdGF9XHJcbiAgICovXG5cblxuICBfZG9tRWxlbWVudFRvSXRlbURhdGEoZWxlbWVudCkge1xuICAgIC8qKiBAdHlwZSB7U2xpZGVEYXRhfSAqL1xuICAgIGNvbnN0IGl0ZW1EYXRhID0ge1xuICAgICAgZWxlbWVudFxuICAgIH07XG4gICAgY29uc3QgbGlua0VsID1cbiAgICAvKiogQHR5cGUge0hUTUxBbmNob3JFbGVtZW50fSAqL1xuICAgIGVsZW1lbnQudGFnTmFtZSA9PT0gJ0EnID8gZWxlbWVudCA6IGVsZW1lbnQucXVlcnlTZWxlY3RvcignYScpO1xuXG4gICAgaWYgKGxpbmtFbCkge1xuICAgICAgLy8gc3JjIGNvbWVzIGZyb20gZGF0YS1wc3dwLXNyYyBhdHRyaWJ1dGUsXG4gICAgICAvLyBpZiBpdCdzIGVtcHR5IGxpbmsgaHJlZiBpcyB1c2VkXG4gICAgICBpdGVtRGF0YS5zcmMgPSBsaW5rRWwuZGF0YXNldC5wc3dwU3JjIHx8IGxpbmtFbC5ocmVmO1xuXG4gICAgICBpZiAobGlua0VsLmRhdGFzZXQucHN3cFNyY3NldCkge1xuICAgICAgICBpdGVtRGF0YS5zcmNzZXQgPSBsaW5rRWwuZGF0YXNldC5wc3dwU3Jjc2V0O1xuICAgICAgfVxuXG4gICAgICBpdGVtRGF0YS53aWR0aCA9IGxpbmtFbC5kYXRhc2V0LnBzd3BXaWR0aCA/IHBhcnNlSW50KGxpbmtFbC5kYXRhc2V0LnBzd3BXaWR0aCwgMTApIDogMDtcbiAgICAgIGl0ZW1EYXRhLmhlaWdodCA9IGxpbmtFbC5kYXRhc2V0LnBzd3BIZWlnaHQgPyBwYXJzZUludChsaW5rRWwuZGF0YXNldC5wc3dwSGVpZ2h0LCAxMCkgOiAwOyAvLyBzdXBwb3J0IGxlZ2FjeSB3ICYgaCBwcm9wZXJ0aWVzXG5cbiAgICAgIGl0ZW1EYXRhLncgPSBpdGVtRGF0YS53aWR0aDtcbiAgICAgIGl0ZW1EYXRhLmggPSBpdGVtRGF0YS5oZWlnaHQ7XG5cbiAgICAgIGlmIChsaW5rRWwuZGF0YXNldC5wc3dwVHlwZSkge1xuICAgICAgICBpdGVtRGF0YS50eXBlID0gbGlua0VsLmRhdGFzZXQucHN3cFR5cGU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRodW1ibmFpbEVsID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcblxuICAgICAgaWYgKHRodW1ibmFpbEVsKSB7XG4gICAgICAgIHZhciBfdGh1bWJuYWlsRWwkZ2V0QXR0cmk7XG5cbiAgICAgICAgLy8gbXNyYyBpcyBVUkwgdG8gcGxhY2Vob2xkZXIgaW1hZ2UgdGhhdCdzIGRpc3BsYXllZCBiZWZvcmUgbGFyZ2UgaW1hZ2UgaXMgbG9hZGVkXG4gICAgICAgIC8vIGJ5IGRlZmF1bHQgaXQncyBkaXNwbGF5ZWQgb25seSBmb3IgdGhlIGZpcnN0IHNsaWRlXG4gICAgICAgIGl0ZW1EYXRhLm1zcmMgPSB0aHVtYm5haWxFbC5jdXJyZW50U3JjIHx8IHRodW1ibmFpbEVsLnNyYztcbiAgICAgICAgaXRlbURhdGEuYWx0ID0gKF90aHVtYm5haWxFbCRnZXRBdHRyaSA9IHRodW1ibmFpbEVsLmdldEF0dHJpYnV0ZSgnYWx0JykpICE9PSBudWxsICYmIF90aHVtYm5haWxFbCRnZXRBdHRyaSAhPT0gdm9pZCAwID8gX3RodW1ibmFpbEVsJGdldEF0dHJpIDogJyc7XG4gICAgICB9XG5cbiAgICAgIGlmIChsaW5rRWwuZGF0YXNldC5wc3dwQ3JvcHBlZCB8fCBsaW5rRWwuZGF0YXNldC5jcm9wcGVkKSB7XG4gICAgICAgIGl0ZW1EYXRhLnRodW1iQ3JvcHBlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuYXBwbHlGaWx0ZXJzKCdkb21JdGVtRGF0YScsIGl0ZW1EYXRhLCBlbGVtZW50LCBsaW5rRWwpO1xuICB9XG4gIC8qKlxyXG4gICAqIExhenktbG9hZCBieSBzbGlkZSBkYXRhXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1NsaWRlRGF0YX0gaXRlbURhdGEgRGF0YSBhYm91dCB0aGUgc2xpZGVcclxuICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcclxuICAgKiBAcmV0dXJucyB7Q29udGVudH0gSW1hZ2UgdGhhdCBpcyBiZWluZyBkZWNvZGVkIG9yIGZhbHNlLlxyXG4gICAqL1xuXG5cbiAgbGF6eUxvYWREYXRhKGl0ZW1EYXRhLCBpbmRleCkge1xuICAgIHJldHVybiBsYXp5TG9hZERhdGEoaXRlbURhdGEsIHRoaXMsIGluZGV4KTtcbiAgfVxuXG59XG5cbi8qKlxyXG4gKiBAdGVtcGxhdGUgVFxyXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi90eXBlcy5qcycpLlR5cGU8VD59IFR5cGU8VD5cclxuICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi9waG90b3N3aXBlLmpzJykuZGVmYXVsdH0gUGhvdG9Td2lwZSAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4vcGhvdG9zd2lwZS5qcycpLlBob3RvU3dpcGVPcHRpb25zfSBQaG90b1N3aXBlT3B0aW9ucyAqL1xuXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi4vcGhvdG9zd2lwZS5qcycpLkRhdGFTb3VyY2V9IERhdGFTb3VyY2UgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3Bob3Rvc3dpcGUuanMnKS5Qb2ludH0gUG9pbnQgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL3NsaWRlL2NvbnRlbnQuanMnKS5kZWZhdWx0fSBDb250ZW50ICovXG5cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuLi9jb3JlL2V2ZW50YWJsZS5qcycpLlBob3RvU3dpcGVFdmVudHNNYXB9IFBob3RvU3dpcGVFdmVudHNNYXAgKi9cblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoJy4uL2NvcmUvZXZlbnRhYmxlLmpzJykuUGhvdG9Td2lwZUZpbHRlcnNNYXB9IFBob3RvU3dpcGVGaWx0ZXJzTWFwICovXG5cbi8qKlxyXG4gKiBAdGVtcGxhdGUge2tleW9mIFBob3RvU3dpcGVFdmVudHNNYXB9IFRcclxuICogQHR5cGVkZWYge2ltcG9ydCgnLi4vY29yZS9ldmVudGFibGUuanMnKS5FdmVudENhbGxiYWNrPFQ+fSBFdmVudENhbGxiYWNrPFQ+XHJcbiAqL1xuXG4vKipcclxuICogUGhvdG9Td2lwZSBMaWdodGJveFxyXG4gKlxyXG4gKiAtIElmIHVzZXIgaGFzIHVuc3VwcG9ydGVkIGJyb3dzZXIgaXQgZmFsbHMgYmFjayB0byBkZWZhdWx0IGJyb3dzZXIgYWN0aW9uIChqdXN0IG9wZW5zIFVSTClcclxuICogLSBCaW5kcyBjbGljayBldmVudCB0byBsaW5rcyB0aGF0IHNob3VsZCBvcGVuIFBob3RvU3dpcGVcclxuICogLSBwYXJzZXMgRE9NIHN0cmN0dXJlIGZvciBQaG90b1N3aXBlIChyZXRyaWV2ZXMgbGFyZ2UgaW1hZ2UgVVJMcyBhbmQgc2l6ZXMpXHJcbiAqIC0gSW5pdGlhbGl6ZXMgUGhvdG9Td2lwZVxyXG4gKlxyXG4gKlxyXG4gKiBMb2FkZXIgb3B0aW9ucyB1c2UgdGhlIHNhbWUgb2JqZWN0IGFzIFBob3RvU3dpcGUsIGFuZCBzdXBwb3J0cyBzdWNoIG9wdGlvbnM6XHJcbiAqXHJcbiAqIGdhbGxlcnkgLSBFbGVtZW50IHwgRWxlbWVudFtdIHwgTm9kZUxpc3QgfCBzdHJpbmcgc2VsZWN0b3IgZm9yIHRoZSBnYWxsZXJ5IGVsZW1lbnRcclxuICogY2hpbGRyZW4gLSBFbGVtZW50IHwgRWxlbWVudFtdIHwgTm9kZUxpc3QgfCBzdHJpbmcgc2VsZWN0b3IgZm9yIHRoZSBnYWxsZXJ5IGNoaWxkcmVuXHJcbiAqXHJcbiAqL1xuXG5jbGFzcyBQaG90b1N3aXBlTGlnaHRib3ggZXh0ZW5kcyBQaG90b1N3aXBlQmFzZSB7XG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7UGhvdG9Td2lwZU9wdGlvbnN9IFtvcHRpb25zXVxyXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoKTtcbiAgICAvKiogQHR5cGUge1Bob3RvU3dpcGVPcHRpb25zfSAqL1xuXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLl91aWQgPSAwO1xuICAgIHRoaXMuc2hvdWxkT3BlbiA9IGZhbHNlO1xuICAgIC8qKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEB0eXBlIHtDb250ZW50IHwgdW5kZWZpbmVkfVxyXG4gICAgICovXG5cbiAgICB0aGlzLl9wcmVsb2FkZWRDb250ZW50ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMub25UaHVtYm5haWxzQ2xpY2sgPSB0aGlzLm9uVGh1bWJuYWlsc0NsaWNrLmJpbmQodGhpcyk7XG4gIH1cbiAgLyoqXHJcbiAgICogSW5pdGlhbGl6ZSBsaWdodGJveCwgc2hvdWxkIGJlIGNhbGxlZCBvbmx5IG9uY2UuXHJcbiAgICogSXQncyBub3QgaW5jbHVkZWQgaW4gdGhlIG1haW4gY29uc3RydWN0b3IsIHNvIHlvdSBtYXkgYmluZCBldmVudHMgYmVmb3JlIGl0LlxyXG4gICAqL1xuXG5cbiAgaW5pdCgpIHtcbiAgICAvLyBCaW5kIGNsaWNrIGV2ZW50cyB0byBlYWNoIGdhbGxlcnlcbiAgICBnZXRFbGVtZW50c0Zyb21PcHRpb24odGhpcy5vcHRpb25zLmdhbGxlcnksIHRoaXMub3B0aW9ucy5nYWxsZXJ5U2VsZWN0b3IpLmZvckVhY2goZ2FsbGVyeUVsZW1lbnQgPT4ge1xuICAgICAgZ2FsbGVyeUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uVGh1bWJuYWlsc0NsaWNrLCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cbiAgLyoqXHJcbiAgICogQHBhcmFtIHtNb3VzZUV2ZW50fSBlXHJcbiAgICovXG5cblxuICBvblRodW1ibmFpbHNDbGljayhlKSB7XG4gICAgLy8gRXhpdCBhbmQgYWxsb3cgZGVmYXVsdCBicm93c2VyIGFjdGlvbiBpZjpcbiAgICBpZiAoc3BlY2lhbEtleVVzZWQoZSkgLy8gLi4uIGlmIGNsaWNrZWQgd2l0aCBhIHNwZWNpYWwga2V5IChjdHJsL2NtZC4uLilcbiAgICB8fCB3aW5kb3cucHN3cCkge1xuICAgICAgLy8gLi4uIGlmIFBob3RvU3dpcGUgaXMgYWxyZWFkeSBvcGVuXG4gICAgICByZXR1cm47XG4gICAgfSAvLyBJZiBib3RoIGNsaWVudFggYW5kIGNsaWVudFkgYXJlIDAgb3Igbm90IGRlZmluZWQsXG4gICAgLy8gdGhlIGV2ZW50IGlzIGxpa2VseSB0cmlnZ2VyZWQgYnkga2V5Ym9hcmQsXG4gICAgLy8gc28gd2UgZG8gbm90IHBhc3MgdGhlIGluaXRpYWxQb2ludFxuICAgIC8vXG4gICAgLy8gTm90ZSB0aGF0IHNvbWUgc2NyZWVuIHJlYWRlcnMgZW11bGF0ZSB0aGUgbW91c2UgcG9zaXRpb24sXG4gICAgLy8gc28gaXQncyBub3QgdGhlIGlkZWFsIHdheSB0byBkZXRlY3QgdGhlbS5cbiAgICAvL1xuXG4gICAgLyoqIEB0eXBlIHtQb2ludCB8IG51bGx9ICovXG5cblxuICAgIGxldCBpbml0aWFsUG9pbnQgPSB7XG4gICAgICB4OiBlLmNsaWVudFgsXG4gICAgICB5OiBlLmNsaWVudFlcbiAgICB9O1xuXG4gICAgaWYgKCFpbml0aWFsUG9pbnQueCAmJiAhaW5pdGlhbFBvaW50LnkpIHtcbiAgICAgIGluaXRpYWxQb2ludCA9IG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGNsaWNrZWRJbmRleCA9IHRoaXMuZ2V0Q2xpY2tlZEluZGV4KGUpO1xuICAgIGNsaWNrZWRJbmRleCA9IHRoaXMuYXBwbHlGaWx0ZXJzKCdjbGlja2VkSW5kZXgnLCBjbGlja2VkSW5kZXgsIGUsIHRoaXMpO1xuICAgIC8qKiBAdHlwZSB7RGF0YVNvdXJjZX0gKi9cblxuICAgIGNvbnN0IGRhdGFTb3VyY2UgPSB7XG4gICAgICBnYWxsZXJ5OlxuICAgICAgLyoqIEB0eXBlIHtIVE1MRWxlbWVudH0gKi9cbiAgICAgIGUuY3VycmVudFRhcmdldFxuICAgIH07XG5cbiAgICBpZiAoY2xpY2tlZEluZGV4ID49IDApIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMubG9hZEFuZE9wZW4oY2xpY2tlZEluZGV4LCBkYXRhU291cmNlLCBpbml0aWFsUG9pbnQpO1xuICAgIH1cbiAgfVxuICAvKipcclxuICAgKiBHZXQgaW5kZXggb2YgZ2FsbGVyeSBpdGVtIHRoYXQgd2FzIGNsaWNrZWQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge01vdXNlRXZlbnR9IGUgY2xpY2sgZXZlbnRcclxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAqL1xuXG5cbiAgZ2V0Q2xpY2tlZEluZGV4KGUpIHtcbiAgICAvLyBsZWdhY3kgb3B0aW9uXG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXRDbGlja2VkSW5kZXhGbikge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5nZXRDbGlja2VkSW5kZXhGbi5jYWxsKHRoaXMsIGUpO1xuICAgIH1cblxuICAgIGNvbnN0IGNsaWNrZWRUYXJnZXQgPVxuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG4gICAgZS50YXJnZXQ7XG4gICAgY29uc3QgY2hpbGRFbGVtZW50cyA9IGdldEVsZW1lbnRzRnJvbU9wdGlvbih0aGlzLm9wdGlvbnMuY2hpbGRyZW4sIHRoaXMub3B0aW9ucy5jaGlsZFNlbGVjdG9yLFxuICAgIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovXG4gICAgZS5jdXJyZW50VGFyZ2V0KTtcbiAgICBjb25zdCBjbGlja2VkQ2hpbGRJbmRleCA9IGNoaWxkRWxlbWVudHMuZmluZEluZGV4KGNoaWxkID0+IGNoaWxkID09PSBjbGlja2VkVGFyZ2V0IHx8IGNoaWxkLmNvbnRhaW5zKGNsaWNrZWRUYXJnZXQpKTtcblxuICAgIGlmIChjbGlja2VkQ2hpbGRJbmRleCAhPT0gLTEpIHtcbiAgICAgIHJldHVybiBjbGlja2VkQ2hpbGRJbmRleDtcbiAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5jaGlsZHJlbiB8fCB0aGlzLm9wdGlvbnMuY2hpbGRTZWxlY3Rvcikge1xuICAgICAgLy8gY2xpY2sgd2Fzbid0IG9uIGEgY2hpbGQgZWxlbWVudFxuICAgICAgcmV0dXJuIC0xO1xuICAgIH0gLy8gVGhlcmUgaXMgb25seSBvbmUgaXRlbSAod2hpY2ggaXMgdGhlIGdhbGxlcnkpXG5cblxuICAgIHJldHVybiAwO1xuICB9XG4gIC8qKlxyXG4gICAqIExvYWQgYW5kIG9wZW4gUGhvdG9Td2lwZVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XHJcbiAgICogQHBhcmFtIHtEYXRhU291cmNlfSBbZGF0YVNvdXJjZV1cclxuICAgKiBAcGFyYW0ge1BvaW50IHwgbnVsbH0gW2luaXRpYWxQb2ludF1cclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cblxuXG4gIGxvYWRBbmRPcGVuKGluZGV4LCBkYXRhU291cmNlLCBpbml0aWFsUG9pbnQpIHtcbiAgICAvLyBDaGVjayBpZiB0aGUgZ2FsbGVyeSBpcyBhbHJlYWR5IG9wZW5cbiAgICBpZiAod2luZG93LnBzd3AgfHwgIXRoaXMub3B0aW9ucykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gLy8gVXNlIHRoZSBmaXJzdCBnYWxsZXJ5IGVsZW1lbnQgaWYgZGF0YVNvdXJjZSBpcyBub3QgcHJvdmlkZWRcblxuXG4gICAgaWYgKCFkYXRhU291cmNlICYmIHRoaXMub3B0aW9ucy5nYWxsZXJ5ICYmIHRoaXMub3B0aW9ucy5jaGlsZHJlbikge1xuICAgICAgY29uc3QgZ2FsbGVyeUVsZW1lbnRzID0gZ2V0RWxlbWVudHNGcm9tT3B0aW9uKHRoaXMub3B0aW9ucy5nYWxsZXJ5KTtcblxuICAgICAgaWYgKGdhbGxlcnlFbGVtZW50c1swXSkge1xuICAgICAgICBkYXRhU291cmNlID0ge1xuICAgICAgICAgIGdhbGxlcnk6IGdhbGxlcnlFbGVtZW50c1swXVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gLy8gc2V0IGluaXRpYWwgaW5kZXhcblxuXG4gICAgdGhpcy5vcHRpb25zLmluZGV4ID0gaW5kZXg7IC8vIGRlZmluZSBvcHRpb25zIGZvciBQaG90b1N3aXBlIGNvbnN0cnVjdG9yXG5cbiAgICB0aGlzLm9wdGlvbnMuaW5pdGlhbFBvaW50ZXJQb3MgPSBpbml0aWFsUG9pbnQ7XG4gICAgdGhpcy5zaG91bGRPcGVuID0gdHJ1ZTtcbiAgICB0aGlzLnByZWxvYWQoaW5kZXgsIGRhdGFTb3VyY2UpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIC8qKlxyXG4gICAqIExvYWQgdGhlIG1haW4gbW9kdWxlIGFuZCB0aGUgc2xpZGUgY29udGVudCBieSBpbmRleFxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XHJcbiAgICogQHBhcmFtIHtEYXRhU291cmNlfSBbZGF0YVNvdXJjZV1cclxuICAgKi9cblxuXG4gIHByZWxvYWQoaW5kZXgsIGRhdGFTb3VyY2UpIHtcbiAgICBjb25zdCB7XG4gICAgICBvcHRpb25zXG4gICAgfSA9IHRoaXM7XG5cbiAgICBpZiAoZGF0YVNvdXJjZSkge1xuICAgICAgb3B0aW9ucy5kYXRhU291cmNlID0gZGF0YVNvdXJjZTtcbiAgICB9IC8vIEFkZCB0aGUgbWFpbiBtb2R1bGVcblxuICAgIC8qKiBAdHlwZSB7UHJvbWlzZTxUeXBlPFBob3RvU3dpcGU+PltdfSAqL1xuXG5cbiAgICBjb25zdCBwcm9taXNlQXJyYXkgPSBbXTtcbiAgICBjb25zdCBwc3dwTW9kdWxlVHlwZSA9IHR5cGVvZiBvcHRpb25zLnBzd3BNb2R1bGU7XG5cbiAgICBpZiAoaXNQc3dwQ2xhc3Mob3B0aW9ucy5wc3dwTW9kdWxlKSkge1xuICAgICAgcHJvbWlzZUFycmF5LnB1c2goUHJvbWlzZS5yZXNvbHZlKFxuICAgICAgLyoqIEB0eXBlIHtUeXBlPFBob3RvU3dpcGU+fSAqL1xuICAgICAgb3B0aW9ucy5wc3dwTW9kdWxlKSk7XG4gICAgfSBlbHNlIGlmIChwc3dwTW9kdWxlVHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigncHN3cE1vZHVsZSBhcyBzdHJpbmcgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCcpO1xuICAgIH0gZWxzZSBpZiAocHN3cE1vZHVsZVR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHByb21pc2VBcnJheS5wdXNoKFxuICAgICAgLyoqIEB0eXBlIHsoKSA9PiBQcm9taXNlPFR5cGU8UGhvdG9Td2lwZT4+fSAqL1xuICAgICAgb3B0aW9ucy5wc3dwTW9kdWxlKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Bzd3BNb2R1bGUgaXMgbm90IHZhbGlkJyk7XG4gICAgfSAvLyBBZGQgY3VzdG9tLWRlZmluZWQgcHJvbWlzZSwgaWYgYW55XG5cblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5vcGVuUHJvbWlzZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gYWxsb3cgZGV2ZWxvcGVycyB0byBwZXJmb3JtIHNvbWUgdGFzayBiZWZvcmUgb3BlbmluZ1xuICAgICAgcHJvbWlzZUFycmF5LnB1c2gob3B0aW9ucy5vcGVuUHJvbWlzZSgpKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5wcmVsb2FkRmlyc3RTbGlkZSAhPT0gZmFsc2UgJiYgaW5kZXggPj0gMCkge1xuICAgICAgdGhpcy5fcHJlbG9hZGVkQ29udGVudCA9IGxhenlMb2FkU2xpZGUoaW5kZXgsIHRoaXMpO1xuICAgIH0gLy8gV2FpdCB0aWxsIGFsbCBwcm9taXNlcyByZXNvbHZlIGFuZCBvcGVuIFBob3RvU3dpcGVcblxuXG4gICAgY29uc3QgdWlkID0gKyt0aGlzLl91aWQ7XG4gICAgUHJvbWlzZS5hbGwocHJvbWlzZUFycmF5KS50aGVuKGl0ZXJhYmxlTW9kdWxlcyA9PiB7XG4gICAgICBpZiAodGhpcy5zaG91bGRPcGVuKSB7XG4gICAgICAgIGNvbnN0IG1haW5Nb2R1bGUgPSBpdGVyYWJsZU1vZHVsZXNbMF07XG5cbiAgICAgICAgdGhpcy5fb3BlblBob3Rvc3dpcGUobWFpbk1vZHVsZSwgdWlkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvKipcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqIEBwYXJhbSB7VHlwZTxQaG90b1N3aXBlPiB8IHsgZGVmYXVsdDogVHlwZTxQaG90b1N3aXBlPiB9fSBtb2R1bGVcclxuICAgKiBAcGFyYW0ge251bWJlcn0gdWlkXHJcbiAgICovXG5cblxuICBfb3BlblBob3Rvc3dpcGUobW9kdWxlLCB1aWQpIHtcbiAgICAvLyBDYW5jZWwgb3BlbmluZyBpZiBVSUQgZG9lc24ndCBtYXRjaCB0aGUgY3VycmVudCBvbmVcbiAgICAvLyAoaWYgdXNlciBjbGlja2VkIG9uIGFub3RoZXIgZ2FsbGVyeSBpdGVtIGJlZm9yZSBjdXJyZW50IHdhcyBsb2FkZWQpLlxuICAgIC8vXG4gICAgLy8gT3IgaWYgc2hvdWxkT3BlbiBmbGFnIGlzIHNldCB0byBmYWxzZVxuICAgIC8vIChkZXZlbG9wZXIgbWF5IG1vZGlmeSBpdCB2aWEgcHVibGljIEFQSSlcbiAgICBpZiAodWlkICE9PSB0aGlzLl91aWQgJiYgdGhpcy5zaG91bGRPcGVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zaG91bGRPcGVuID0gZmFsc2U7IC8vIFBob3RvU3dpcGUgaXMgYWxyZWFkeSBvcGVuXG5cbiAgICBpZiAod2luZG93LnBzd3ApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBQYXNzIGRhdGEgdG8gUGhvdG9Td2lwZSBhbmQgb3BlbiBpbml0XHJcbiAgICAgKlxyXG4gICAgICogQHR5cGUge1Bob3RvU3dpcGV9XHJcbiAgICAgKi9cblxuXG4gICAgY29uc3QgcHN3cCA9IHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnID8gbmV3IG1vZHVsZS5kZWZhdWx0KHRoaXMub3B0aW9ucykgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIDogbmV3IG1vZHVsZSh0aGlzLm9wdGlvbnMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cbiAgICB0aGlzLnBzd3AgPSBwc3dwO1xuICAgIHdpbmRvdy5wc3dwID0gcHN3cDsgLy8gbWFwIGxpc3RlbmVycyBmcm9tIExpZ2h0Ym94IHRvIFBob3RvU3dpcGUgQ29yZVxuXG4gICAgLyoqIEB0eXBlIHsoa2V5b2YgUGhvdG9Td2lwZUV2ZW50c01hcClbXX0gKi9cblxuICAgIE9iamVjdC5rZXlzKHRoaXMuX2xpc3RlbmVycykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIHZhciBfdGhpcyRfbGlzdGVuZXJzJG5hbWU7XG5cbiAgICAgIChfdGhpcyRfbGlzdGVuZXJzJG5hbWUgPSB0aGlzLl9saXN0ZW5lcnNbbmFtZV0pID09PSBudWxsIHx8IF90aGlzJF9saXN0ZW5lcnMkbmFtZSA9PT0gdm9pZCAwIHx8IF90aGlzJF9saXN0ZW5lcnMkbmFtZS5mb3JFYWNoKGZuID0+IHtcbiAgICAgICAgcHN3cC5vbihuYW1lLFxuICAgICAgICAvKiogQHR5cGUge0V2ZW50Q2FsbGJhY2s8dHlwZW9mIG5hbWU+fSAqL1xuICAgICAgICBmbik7XG4gICAgICB9KTtcbiAgICB9KTsgLy8gc2FtZSB3aXRoIGZpbHRlcnNcblxuICAgIC8qKiBAdHlwZSB7KGtleW9mIFBob3RvU3dpcGVGaWx0ZXJzTWFwKVtdfSAqL1xuXG4gICAgT2JqZWN0LmtleXModGhpcy5fZmlsdGVycykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIHZhciBfdGhpcyRfZmlsdGVycyRuYW1lO1xuXG4gICAgICAoX3RoaXMkX2ZpbHRlcnMkbmFtZSA9IHRoaXMuX2ZpbHRlcnNbbmFtZV0pID09PSBudWxsIHx8IF90aGlzJF9maWx0ZXJzJG5hbWUgPT09IHZvaWQgMCB8fCBfdGhpcyRfZmlsdGVycyRuYW1lLmZvckVhY2goZmlsdGVyID0+IHtcbiAgICAgICAgcHN3cC5hZGRGaWx0ZXIobmFtZSwgZmlsdGVyLmZuLCBmaWx0ZXIucHJpb3JpdHkpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fcHJlbG9hZGVkQ29udGVudCkge1xuICAgICAgcHN3cC5jb250ZW50TG9hZGVyLmFkZFRvQ2FjaGUodGhpcy5fcHJlbG9hZGVkQ29udGVudCk7XG4gICAgICB0aGlzLl9wcmVsb2FkZWRDb250ZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHBzd3Aub24oJ2Rlc3Ryb3knLCAoKSA9PiB7XG4gICAgICAvLyBjbGVhbiB1cCBwdWJsaWMgdmFyaWFibGVzXG4gICAgICB0aGlzLnBzd3AgPSB1bmRlZmluZWQ7XG4gICAgICBkZWxldGUgd2luZG93LnBzd3A7XG4gICAgfSk7XG4gICAgcHN3cC5pbml0KCk7XG4gIH1cbiAgLyoqXHJcbiAgICogVW5iaW5kcyBhbGwgZXZlbnRzLCBjbG9zZXMgUGhvdG9Td2lwZSBpZiBpdCdzIG9wZW4uXHJcbiAgICovXG5cblxuICBkZXN0cm95KCkge1xuICAgIHZhciBfdGhpcyRwc3dwO1xuXG4gICAgKF90aGlzJHBzd3AgPSB0aGlzLnBzd3ApID09PSBudWxsIHx8IF90aGlzJHBzd3AgPT09IHZvaWQgMCB8fCBfdGhpcyRwc3dwLmRlc3Ryb3koKTtcbiAgICB0aGlzLnNob3VsZE9wZW4gPSBmYWxzZTtcbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbiAgICBnZXRFbGVtZW50c0Zyb21PcHRpb24odGhpcy5vcHRpb25zLmdhbGxlcnksIHRoaXMub3B0aW9ucy5nYWxsZXJ5U2VsZWN0b3IpLmZvckVhY2goZ2FsbGVyeUVsZW1lbnQgPT4ge1xuICAgICAgZ2FsbGVyeUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uVGh1bWJuYWlsc0NsaWNrLCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5leHBvcnQgeyBQaG90b1N3aXBlTGlnaHRib3ggYXMgZGVmYXVsdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGhvdG9zd2lwZS1saWdodGJveC5lc20uanMubWFwXG4iXSwieF9nb29nbGVfaWdub3JlTGlzdCI6WzBdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBYUEsU0FBUyxjQUFjLFdBQVcsU0FBUyxZQUFZO0NBQ3JELE1BQU0sS0FBSyxTQUFTLGNBQWMsT0FBTztDQUV6QyxJQUFJLFdBQ0YsR0FBRyxZQUFZO0NBR2pCLElBQUksWUFDRixXQUFXLFlBQVksRUFBRTtDQUczQixPQUFPO0FBQ1Q7Ozs7Ozs7OztBQVVBLFNBQVMsa0JBQWtCLEdBQUcsR0FBRyxPQUFPO0NBQ3RDLElBQUksWUFBWSxlQUFlLEVBQUUsS0FBSyxLQUFLLEVBQUU7Q0FFN0MsSUFBSSxVQUFVLFFBQ1osYUFBYSxZQUFZLE1BQU0sR0FBRyxNQUFNO0NBRzFDLE9BQU87QUFDVDs7Ozs7Ozs7QUFTQSxTQUFTLGVBQWUsSUFBSSxHQUFHLEdBQUc7Q0FDaEMsR0FBRyxNQUFNLFFBQVEsT0FBTyxNQUFNLFdBQVcsR0FBRyxFQUFFLE1BQU07Q0FDcEQsR0FBRyxNQUFNLFNBQVMsT0FBTyxNQUFNLFdBQVcsR0FBRyxFQUFFLE1BQU07QUFDdkQ7OztBQUtBLE1BQU0sYUFBYTtDQUNqQixNQUFNO0NBQ04sU0FBUztDQUNULFFBQVE7Q0FDUixPQUFPO0FBQ1Q7Ozs7Ozs7O0FBU0EsU0FBUyxlQUFlLEdBQUc7Q0FDekIsT0FBTyxZQUFZLEtBQUssRUFBRSxXQUFXLEtBQUssRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRTtBQUNwRjs7Ozs7Ozs7O0FBVUEsU0FBUyxzQkFBc0IsUUFBUSxnQkFBZ0IsU0FBUyxVQUFVOztDQUV4RSxJQUFJLFdBQVcsQ0FBQztDQUVoQixJQUFJLGtCQUFrQixTQUNwQixXQUFXLENBQUMsTUFBTTtN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