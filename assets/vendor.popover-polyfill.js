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
//#region ../../node_modules/@oddbird/popover-polyfill/dist/popover.js
var ToggleEvent = class extends Event {
	oldState;
	newState;
	constructor(type, { oldState = "", newState = "", ...init } = {}) {
		super(type, init);
		this.oldState = String(oldState || "");
		this.newState = String(newState || "");
	}
};
var popoverToggleTaskQueue = /* @__PURE__ */ new WeakMap();
function queuePopoverToggleEventTask(element, oldState, newState) {
	popoverToggleTaskQueue.set(element, setTimeout(() => {
		if (!popoverToggleTaskQueue.has(element)) return;
		element.dispatchEvent(new ToggleEvent("toggle", {
			cancelable: false,
			oldState,
			newState
		}));
	}, 0));
}
var ShadowRoot = globalThis.ShadowRoot || function() {};
var HTMLDialogElement = globalThis.HTMLDialogElement || function() {};
var topLayerElements = /* @__PURE__ */ new WeakMap();
var autoPopoverList = /* @__PURE__ */ new WeakMap();
var hintPopoverList = /* @__PURE__ */ new WeakMap();
var visibilityState = /* @__PURE__ */ new WeakMap();
function getPopoverVisibilityState(popover) {
	return visibilityState.get(popover) || "hidden";
}
var popoverInvoker = /* @__PURE__ */ new WeakMap();
function lastSetElement(set) {
	return [...set].pop();
}
function popoverTargetAttributeActivationBehavior(element) {
	const popover = element.popoverTargetElement;
	if (!(popover instanceof HTMLElement)) return;
	const visibility = getPopoverVisibilityState(popover);
	if (element.popoverTargetAction === "show" && visibility === "showing") return;
	if (element.popoverTargetAction === "hide" && visibility === "hidden") return;
	if (visibility === "showing") hidePopover(popover, true, true);
	else if (checkPopoverValidity(popover, false)) {
		popoverInvoker.set(popover, element);
		showPopover(popover);
	}
}
function checkPopoverValidity(element, expectedToBeShowing) {
	if (element.popover !== "auto" && element.popover !== "manual" && element.popover !== "hint") return false;
	if (!element.isConnected) return false;
	if (expectedToBeShowing && getPopoverVisibilityState(element) !== "showing") return false;
	if (!expectedToBeShowing && getPopoverVisibilityState(element) !== "hidden") return false;
	if (element instanceof HTMLDialogElement && element.hasAttribute("open")) return false;
	if (document.fullscreenElement === element) return false;
	return true;
}
function getStackPosition(popover) {
	if (!popover) return 0;
	const autoPopovers = autoPopoverList.get(document) || /* @__PURE__ */ new Set();
	const hintPopovers = hintPopoverList.get(document) || /* @__PURE__ */ new Set();
	if (hintPopovers.has(popover)) return [...hintPopovers].indexOf(popover) + autoPopovers.size + 1;
	if (autoPopovers.has(popover)) return [...autoPopovers].indexOf(popover) + 1;
	return 0;
}
function topMostClickedPopover(target) {
	const clickedPopover = nearestInclusiveOpenPopover(target);
	const invokerPopover = nearestInclusiveTargetPopoverForInvoker(target);
	if (getStackPosition(clickedPopover) > getStackPosition(invokerPopover)) return clickedPopover;
	return invokerPopover;
}
function topmostAutoOrHintPopover(document2) {
	let topmostPopover;
	const hintPopovers = hintPopoverList.get(document2) || /* @__PURE__ */ new Set();
	const autoPopovers = autoPopoverList.get(document2) || /* @__PURE__ */ new Set();
	const usedStack = hintPopovers.size > 0 ? hintPopovers : autoPopovers.size > 0 ? autoPopovers : null;
	if (usedStack) {
		topmostPopover = lastSetElement(usedStack);
		if (!topmostPopover.isConnected) {
			usedStack.delete(topmostPopover);
			return topmostAutoOrHintPopover(document2);
		}
		return topmostPopover;
	}
	return null;
}
function topMostPopoverInList(list) {
	for (const popover of list || []) if (!popover.isConnected) list.delete(popover);
	else return popover;
	return null;
}
function getRootNode(node) {
	if (typeof node.getRootNode === "function") return node.getRootNode();
	if (node.parentNode) return getRootNode(node.parentNode);
	return node;
}
function nearestInclusiveOpenPopover(node) {
	while (node) {
		if (node instanceof HTMLElement && node.popover === "auto" && visibilityState.get(node) === "showing") return node;
		node = node instanceof Element && node.assignedSlot || node.parentElement || getRootNode(node);
		if (node instanceof ShadowRoot) node = node.host;
		if (node instanceof Document) return;
	}
}
function nearestInclusiveTargetPopoverForInvoker(node) {
	while (node) {
		const nodePopover = node.popoverTargetElement;
		if (nodePopover instanceof HTMLElement) return nodePopover;
		node = node.parentElement || getRootNode(node);
		if (node instanceof ShadowRoot) node = node.host;
		if (node instanceof Document) return;
	}
}
function topMostPopoverAncestor(newPopover, list) {
	const popoverPositions = /* @__PURE__ */ new Map();
	let i = 0;
	for (const popover of list || []) {
		popoverPositions.set(popover, i);
		i += 1;
	}
	popoverPositions.set(newPopover, i);
	i += 1;
	let topMostPopoverAncestor2 = null;
	function checkAncestor(candidate) {
		if (!candidate) return;
		let okNesting = false;
		let candidateAncestor = null;
		let candidatePosition = null;
		while (!okNesting) {
			candidateAncestor = nearestInclusiveOpenPopover(candidate) || null;
			if (candidateAncestor === null) return;
			if (!popoverPositions.has(candidateAncestor)) return;
			if (newPopover.popover === "hint" || candidateAncestor.popover === "auto") okNesting = true;
			if (!okNesting) candidate = candidateAncestor.parentElement;
		}
		candidatePosition = popoverPositions.get(candidateAncestor);
		if (topMostPopoverAncestor2 === null || popoverPositions.get(topMostPopoverAncestor2) < candidatePosition) topMostPopoverAncestor2 = candidateAncestor;
	}
	checkAncestor(newPopover.parentElement || getRootNode(newPopover));
	return topMostPopoverAncestor2;
}
function isFocusable(focusTarget) {
	if (focusTarget.hidden || focusTarget instanceof ShadowRoot) return false;
	if (focusTarget instanceof HTMLButtonElement || focusTarget instanceof HTMLInputElement || focusTarget instanceof HTMLSelectElement || focusTarget instanceof HTMLTextAreaElement || focusTarget instanceof HTMLOptGroupElement || focusTarget instanceof HTMLOptionElement || focusTarget instanceof HTMLFieldSetElement) {
		if (focusTarget.disabled) return false;
	}
	if (focusTarget instanceof HTMLInputElement && focusTarget.type === "hidden") return false;
	if (focusTarget instanceof HTMLAnchorElement && focusTarget.href === "") return false;
	return typeof focusTarget.tabIndex === "number" && focusTarget.tabIndex !== -1;
}
function focusDelegate(focusTarget) {
	if (focusTarget.shadowRoot && focusTarget.shadowRoot.delegatesFocus !== true) return null;
	let whereToLook = focusTarget;
	if (whereToLook.shadowRoot) whereToLook = whereToLook.shadowRoot;
	let autoFocusDelegate = whereToLook.querySelector("[autofocus]");
	if (autoFocusDelegate) return autoFocusDelegate;
	else {
		const slots = whereToLook.querySelectorAll("slot");
		for (const slot of slots) {
			const assignedElements = slot.assignedElements({ flatten: true });
			for (const el of assignedElements) if (el.hasAttribute("autofocus")) return el;
			else {
				autoFocusDelegate = el.querySelector("[autofocus]");
				if (autoFocusDelegate) return autoFocusDelegate;
			}
		}
	}
	const walker = focusTarget.ownerDocument.createTreeWalker(whereToLook, NodeFilter.SHOW_ELEMENT);
	let descendant = walker.currentNode;
	while (descendant) {
		if (isFocusable(descendant)) return descendant;
		descendant = walker.nextNode();
	}
}
function popoverFocusingSteps(subject) {
	var _a;
	(_a = focusDelegate(subject)) == null || _a.focus();
}
var previouslyFocusedElements = /* @__PURE__ */ new WeakMap();
function showPopover(element) {
	if (!checkPopoverValidity(element, false)) return;
	const document2 = element.ownerDocument;
	if (!element.dispatchEvent(new ToggleEvent("beforetoggle", {
		cancelable: true,
		oldState: "closed",
		newState: "open"
	}))) return;
	if (!checkPopoverValidity(element, false)) return;
	let shouldRestoreFocus = false;
	const originalType = element.popover;
	let stackToAppendTo = null;
	const autoAncestor = topMostPopoverAncestor(element, autoPopoverList.get(document2) || /* @__PURE__ */ new Set());
	const hintAncestor = topMostPopoverAncestor(element, hintPopoverList.get(document2) || /* @__PURE__ */ new Set());
	if (originalType === "auto") {
		closeAllOpenPopoversInList(hintPopoverList.get(document2) || /* @__PURE__ */ new Set(), shouldRestoreFocus, true);
		hideAllPopoversUntil(autoAncestor || document2, shouldRestoreFocus, true);
		stackToAppendTo = "auto";
	}
	if (originalType === "hint") {
		if (hintAncestor) {
			hideAllPopoversUntil(hintAncestor, shouldRestoreFocus, true);
			stackToAppendTo = "hint";
		} else {
			closeAllOpenPopoversInList(hintPopoverList.get(document2) || /* @__PURE__ */ new Set(), shouldRestoreFocus, true);
			if (autoAncestor) {
				hideAllPopoversUntil(autoAncestor, shouldRestoreFocus, true);
				stackToAppendTo = "auto";
			} else stackToAppendTo = "hint";
		}
	}
	if (originalType === "auto" || originalType === "hint") {
		if (originalType !== element.popover || !checkPopoverValidity(element, false)) return;
		if (!topmostAutoOrHintPopover(document2)) shouldRestoreFocus = true;
		if (stackToAppendTo === "auto") {
			if (!autoPopoverList.has(document2)) autoPopoverList.set(document2, /* @__PURE__ */ new Set());
			autoPopoverList.get(document2).add(element);
		} else if (stackToAppendTo === "hint") {
			if (!hintPopoverList.has(document2)) hintPopoverList.set(document2, /* @__PURE__ */ new Set());
			hintPopoverList.get(document2).add(element);
		}
	}
	previouslyFocusedElements.delete(element);
	const originallyFocusedElement = document2.activeElement;
	element.classList.add(":popover-open");
	visibilityState.set(element, "showing");
	if (!topLayerElements.has(document2)) topLayerElements.set(document2, /* @__PURE__ */ new Set());
	topLayerElements.get(document2).add(element);
	setInvokerAriaExpanded(popoverInvoker.get(element), true);
	popoverFocusingSteps(element);
	if (shouldRestoreFocus && originallyFocusedElement && element.popover === "auto") previouslyFocusedElements.set(element, originallyFocusedElement);
	queuePopoverToggleEventTask(element, "closed", "open");
}
function hidePopover(element, focusPreviousElement = false, fireEvents = false) {
	var _a, _b;
	if (!checkPopoverValidity(element, true)) return;
	const document2 = element.ownerDocument;
	if (["auto", "hint"].includes(element.popover)) {
		hideAllPopoversUntil(element, focusPreviousElement, fireEvents);
		if (!checkPopoverValidity(element, true)) return;
	}
	const autoList = autoPopoverList.get(document2) || /* @__PURE__ */ new Set();
	const autoPopoverListContainsElement = autoList.has(element) && lastSetElement(autoList) === element;
	setInvokerAriaExpanded(popoverInvoker.get(element), false);
	popoverInvoker.delete(element);
	if (fireEvents) {
		element.dispatchEvent(new ToggleEvent("beforetoggle", {
			oldState: "open",
			newState: "closed"
		}));
		if (autoPopoverListContainsElement && lastSetElement(autoList) !== element) hideAllPopoversUntil(element, focusPreviousElement, fireEvents);
		if (!checkPopoverValidity(element, true)) return;
	}
	(_a = topLayerElements.get(document2)) == null || _a.delete(element);
	autoList.delete(element);
	(_b = hintPopoverList.get(document2)) == null || _b.delete(element);
	element.classList.remove(":popover-open");
	visibilityState.set(element, "hidden");
	if (fireEvents) queuePopoverToggleEventTask(element, "open", "closed");
	const previouslyFocusedElement = previouslyFocusedElements.get(element);
	if (previouslyFocusedElement) {
		previouslyFocusedElements.delete(element);
		if (focusPreviousElement) previouslyFocusedElement.focus();
	}
}
function closeAllOpenPopovers(document2, focusPreviousElement = false, fireEvents = false) {
	let popover = topmostAutoOrHintPopover(document2);
	while (popover) {
		hidePopover(popover, focusPreviousElement, fireEvents);
		popover = topmostAutoOrHintPopover(document2);
	}
}
function closeAllOpenPopoversInList(list, focusPreviousElement = false, fireEvents = false) {
	let popover = topMostPopoverInList(list);
	while (popover) {
		hidePopover(popover, focusPreviousElement, fireEvents);
		popover = topMostPopoverInList(list);
	}
}
function hidePopoverStackUntil(endpoint, set, focusPreviousElement, fireEvents) {
	let repeatingHide = false;
	let hasRunOnce = false;
	while (repeatingHide || !hasRunOnce) {
		hasRunOnce = true;
		let lastToHide = null;
		let foundEndpoint = false;
		for (const popover of set) if (popover === endpoint) foundEndpoint = true;
		else if (foundEndpoint) {
			lastToHide = popover;
			break;
		}
		if (!lastToHide) return;
		while (getPopoverVisibilityState(lastToHide) === "showing" && set.size) hidePopover(lastSetElement(set), focusPreviousElement, fireEvents);
		if (set.has(endpoint) && lastSetElement(set) !== endpoint) repeatingHide = true;
		if (repeatingHide) fireEvents = false;
	}
}
function hideAllPopoversUntil(endpoint, focusPreviousElement, fireEvents) {
	var _a, _b;
	const document2 = endpoint.ownerDocument || endpoint;
	if (endpoint instanceof Document) return closeAllOpenPopovers(document2, focusPreviousElement, fireEvents);
	if ((_a = hintPopoverList.get(document2)) == null ? void 0 : _a.has(endpoint)) {
		hidePopoverStackUntil(endpoint, hintPopoverList.get(document2), focusPreviousElement, fireEvents);
		return;
	}
	closeAllOpenPopoversInList(hintPopoverList.get(document2) || /* @__PURE__ */ new Set(), focusPreviousElement, fireEvents);
	if (!((_b = autoPopoverList.get(document2)) == null ? void 0 : _b.has(endpoint))) return;
	hidePopoverStackUntil(endpoint, autoPopoverList.get(document2), focusPreviousElement, fireEvents);
}
var popoverPointerDownTargets = /* @__PURE__ */ new WeakMap();
function lightDismissOpenPopovers(event) {
	if (!event.isTrusted) return;
	const target = event.composedPath()[0];
	if (!target) return;
	const document2 = target.ownerDocument;
	if (!topmostAutoOrHintPopover(document2)) return;
	const ancestor = topMostClickedPopover(target);
	if (ancestor && event.type === "pointerdown") popoverPointerDownTargets.set(document2, ancestor);
	else if (event.type === "pointerup") {
		const sameTarget = popoverPointerDownTargets.get(document2) === ancestor;
		popoverPointerDownTargets.delete(document2);
		if (sameTarget) hideAllPopoversUntil(ancestor || document2, false, true);
	}
}
var initialAriaExpandedValue = /* @__PURE__ */ new WeakMap();
function setInvokerAriaExpanded(el, force = false) {
	if (!el) return;
	if (!initialAriaExpandedValue.has(el)) initialAriaExpandedValue.set(el, el.getAttribute("aria-expanded"));
	const popover = el.popoverTargetElement;
	if (popover instanceof HTMLElement && popover.popover === "auto") el.setAttribute("aria-expanded", String(force));
	else {
		const initialValue = initialAriaExpandedValue.get(el);
		if (!initialValue) el.removeAttribute("aria-expanded");
		else el.setAttribute("aria-expanded", initialValue);
	}
}
var ShadowRoot2 = globalThis.ShadowRoot || function() {};
function isSupported() {
	return typeof HTMLElement !== "undefined" && typeof HTMLElement.prototype === "object" && "popover" in HTMLElement.prototype;
}
function patchSelectorFn(object, name, mapper) {
	const original = object[name];
	Object.defineProperty(object, name, { value(selector) {
		return original.call(this, mapper(selector));
	} });
}
var nonEscapedPopoverSelector = /(^|[^\\]):popover-open\b/g;
function hasLayerSupport() {
	return typeof globalThis.CSSLayerBlockRule === "function";
}
function getStyles() {
	const useLayer = hasLayerSupport();
	return `
${useLayer ? "@layer popover-polyfill {" : ""}
  :where([popover]) {
    position: fixed;
    z-index: 2147483647;
    inset: 0;
    padding: 0.25em;
    width: fit-content;
    height: fit-content;
    border-width: initial;
    border-color: initial;
    border-image: initial;
    border-style: solid;
    background-color: canvas;
    color: canvastext;
    overflow: auto;
    margin: auto;
  }

  :where([popover]:not(.\\:popover-open)) {
    display: none;
  }

  :where(dialog[popover].\\:popover-open) {
    display: block;
  }

  :where(dialog[popover][open]) {
    display: revert;
  }

  :where([anchor].\\:popover-open) {
    inset: auto;
  }

  :where([anchor]:popover-open) {
    inset: auto;
  }

  @supports not (background-color: canvas) {
    :where([popover]) {
      background-color: white;
      color: black;
    }
  }

  @supports (width: -moz-fit-content) {
    :where([popover]) {
      width: -moz-fit-content;
      height: -moz-fit-content;
    }
  }

  @supports not (inset: 0) {
    :where([popover]) {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
${useLayer ? "}" : ""}
`;
}
var popoverStyleSheet = null;
function injectStyles(root) {
	const styles = getStyles();
	if (popoverStyleSheet === null) try {
		popoverStyleSheet = new CSSStyleSheet();
		popoverStyleSheet.replaceSync(styles);
	} catch {
		popoverStyleSheet = false;
	}
	if (popoverStyleSheet === false) {
		const sheet = document.createElement("style");
		sheet.textContent = styles;
		if (root instanceof Document) root.head.prepend(sheet);
		else root.prepend(sheet);
	} else root.adoptedStyleSheets = [popoverStyleSheet, ...root.adoptedStyleSheets];
}
function apply() {
	if (typeof window === "undefined") return;
	window.ToggleEvent = window.ToggleEvent || ToggleEvent;
	function rewriteSelector(selector) {
		if (selector == null ? void 0 : selector.includes(":popover-open")) selector = selector.replace(nonEscapedPopoverSelector, "$1.\\:popover-open");
		return selector;
	}
	patchSelectorFn(Document.prototype, "querySelector", rewriteSelector);
	patchSelectorFn(Document.prototype, "querySelectorAll", rewriteSelector);
	patchSelectorFn(Element.prototype, "querySelector", rewriteSelector);
	patchSelectorFn(Element.prototype, "querySelectorAll", rewriteSelector);
	patchSelectorFn(Element.prototype, "matches", rewriteSelector);
	patchSelectorFn(Element.prototype, "closest", rewriteSelector);
	patchSelectorFn(DocumentFragment.prototype, "querySelectorAll", rewriteSelector);
	Object.defineProperties(HTMLElement.prototype, {
		popover: {
			enumerable: true,
			configurable: true,
			get() {
				if (!this.hasAttribute("popover")) return null;
				const value = (this.getAttribute("popover") || "").toLowerCase();
				if (value === "" || value == "auto") return "auto";
				if (value == "hint") return "hint";
				return "manual";
			},
			set(value) {
				if (value === null) this.removeAttribute("popover");
				else this.setAttribute("popover", value);
			}
		},
		showPopover: {
			enumerable: true,
			configurable: true,
			value(options = {}) {
				showPopover(this);
			}
		},
		hidePopover: {
			enumerable: true,
			configurable: true,
			value() {
				hidePopover(this, true, true);
			}
		},
		togglePopover: {
			enumerable: true,
			configurable: true,
			value(options = {}) {
				if (typeof options === "boolean") options = { force: options };
				if (visibilityState.get(this) === "showing" && options.force === void 0 || options.force === false) hidePopover(this, true, true);
				else if (options.force === void 0 || options.force === true) showPopover(this);
				return visibilityState.get(this) === "showing";
			}
		}
	});
	const originalAttachShadow = Element.prototype.attachShadow;
	if (originalAttachShadow) Object.defineProperties(Element.prototype, { attachShadow: {
		enumerable: true,
		configurable: true,
		writable: true,
		value(options) {
			const shadowRoot = originalAttachShadow.call(this, options);
			injectStyles(shadowRoot);
			return shadowRoot;
		}
	} });
	const originalAttachInternals = HTMLElement.prototype.attachInternals;
	if (originalAttachInternals) Object.defineProperties(HTMLElement.prototype, { attachInternals: {
		enumerable: true,
		configurable: true,
		writable: true,
		value() {
			const internals = originalAttachInternals.call(this);
			if (internals.shadowRoot) injectStyles(internals.shadowRoot);
			return internals;
		}
	} });
	const popoverTargetAssociatedElements = /* @__PURE__ */ new WeakMap();
	function applyPopoverInvokerElementMixin(ElementClass) {
		Object.defineProperties(ElementClass.prototype, {
			popoverTargetElement: {
				enumerable: true,
				configurable: true,
				set(targetElement) {
					if (targetElement === null) {
						this.removeAttribute("popovertarget");
						popoverTargetAssociatedElements.delete(this);
					} else if (!(targetElement instanceof Element)) throw new TypeError(`popoverTargetElement must be an element or null`);
					else {
						this.setAttribute("popovertarget", "");
						popoverTargetAssociatedElements.set(this, targetElement);
					}
				},
				get() {
					if (this.localName !== "button" && this.localName !== "input") return null;
					if (this.localName === "input" && this.type !== "reset" && this.type !== "image" && this.type !== "button") return null;
					if (this.disabled) return null;
					if (this.form && this.type === "submit") return null;
					const targetElement = popoverTargetAssociatedElements.get(this);
					if (targetElement && targetElement.isConnected) return targetElement;
					else if (targetElement && !targetElement.isConnected) {
						popoverTargetAssociatedElements.delete(this);
						return null;
					}
					const root = getRootNode(this);
					const idref = this.getAttribute("popovertarget");
					if ((root instanceof Document || root instanceof ShadowRoot2) && idref) return root.getElementById(idref) || null;
					return null;
				}
			},
			popoverTargetAction: {
				enumerable: true,
				configurable: true,
				get() {
					const value = (this.getAttribute("popovertargetaction") || "").toLowerCase();
					if (value === "show" || value === "hide") return value;
					return "toggle";
				},
				set(value) {
					this.setAttribute("popovertargetaction", value);
				}
			}
		});
	}
	applyPopoverInvokerElementMixin(HTMLButtonElement);
	applyPopoverInvokerElementMixin(HTMLInputElement);
	const handleInvokerActivation = (event) => {
		if (event.defaultPrevented) return;
		const composedPath = event.composedPath();
		const target = composedPath[0];
		if (!(target instanceof Element) || (target == null ? void 0 : target.shadowRoot)) return;
		const root = getRootNode(target);
		if (!(root instanceof ShadowRoot2 || root instanceof Document)) return;
		const invoker = composedPath.find((el) => {
			var _a;
			return (_a = el.matches) == null ? void 0 : _a.call(el, "[popovertargetaction],[popovertarget]");
		});
		if (invoker) {
			popoverTargetAttributeActivationBehavior(invoker);
			event.preventDefault();
			return;
		}
	};
	const onKeydown = (event) => {
		const key = event.key;
		const target = event.target;
		if (!event.defaultPrevented && target && (key === "Escape" || key === "Esc")) hideAllPopoversUntil(target.ownerDocument, true, true);
	};
	const addEventListeners = (root) => {
		root.addEventListener("click", handleInvokerActivation);
		root.addEventListener("keydown", onKeydown);
		root.addEventListener("pointerdown", lightDismissOpenPopovers);
		root.addEventListener("pointerup", lightDismissOpenPopovers);
	};
	addEventListeners(document);
	injectStyles(document);
}
if (!isSupported()) apply();

//#endregion
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVuZG9yLnBvcG92ZXItcG9seWZpbGwuanMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BvZGRiaXJkL3BvcG92ZXItcG9seWZpbGwvZGlzdC9wb3BvdmVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHNyYy9ldmVudHMudHNcbnZhciBUb2dnbGVFdmVudCA9IGNsYXNzIGV4dGVuZHMgRXZlbnQge1xuICBvbGRTdGF0ZTtcbiAgbmV3U3RhdGU7XG4gIGNvbnN0cnVjdG9yKHR5cGUsIHsgb2xkU3RhdGUgPSBcIlwiLCBuZXdTdGF0ZSA9IFwiXCIsIC4uLmluaXQgfSA9IHt9KSB7XG4gICAgc3VwZXIodHlwZSwgaW5pdCk7XG4gICAgdGhpcy5vbGRTdGF0ZSA9IFN0cmluZyhvbGRTdGF0ZSB8fCBcIlwiKTtcbiAgICB0aGlzLm5ld1N0YXRlID0gU3RyaW5nKG5ld1N0YXRlIHx8IFwiXCIpO1xuICB9XG59O1xudmFyIHBvcG92ZXJUb2dnbGVUYXNrUXVldWUgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbmZ1bmN0aW9uIHF1ZXVlUG9wb3ZlclRvZ2dsZUV2ZW50VGFzayhlbGVtZW50LCBvbGRTdGF0ZSwgbmV3U3RhdGUpIHtcbiAgcG9wb3ZlclRvZ2dsZVRhc2tRdWV1ZS5zZXQoXG4gICAgZWxlbWVudCxcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICghcG9wb3ZlclRvZ2dsZVRhc2tRdWV1ZS5oYXMoZWxlbWVudCkpIHJldHVybjtcbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgbmV3IFRvZ2dsZUV2ZW50KFwidG9nZ2xlXCIsIHtcbiAgICAgICAgICBjYW5jZWxhYmxlOiBmYWxzZSxcbiAgICAgICAgICBvbGRTdGF0ZSxcbiAgICAgICAgICBuZXdTdGF0ZVxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9LCAwKVxuICApO1xufVxuXG4vLyBzcmMvcG9wb3Zlci1oZWxwZXJzLnRzXG52YXIgU2hhZG93Um9vdCA9IGdsb2JhbFRoaXMuU2hhZG93Um9vdCB8fCBmdW5jdGlvbigpIHtcbn07XG52YXIgSFRNTERpYWxvZ0VsZW1lbnQgPSBnbG9iYWxUaGlzLkhUTUxEaWFsb2dFbGVtZW50IHx8IGZ1bmN0aW9uKCkge1xufTtcbnZhciB0b3BMYXllckVsZW1lbnRzID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgYXV0b1BvcG92ZXJMaXN0ID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgaGludFBvcG92ZXJMaXN0ID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG52YXIgdmlzaWJpbGl0eVN0YXRlID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5mdW5jdGlvbiBnZXRQb3BvdmVyVmlzaWJpbGl0eVN0YXRlKHBvcG92ZXIpIHtcbiAgcmV0dXJuIHZpc2liaWxpdHlTdGF0ZS5nZXQocG9wb3ZlcikgfHwgXCJoaWRkZW5cIjtcbn1cbnZhciBwb3BvdmVySW52b2tlciA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuZnVuY3Rpb24gbGFzdFNldEVsZW1lbnQoc2V0KSB7XG4gIHJldHVybiBbLi4uc2V0XS5wb3AoKTtcbn1cbmZ1bmN0aW9uIHBvcG92ZXJUYXJnZXRBdHRyaWJ1dGVBY3RpdmF0aW9uQmVoYXZpb3IoZWxlbWVudCkge1xuICBjb25zdCBwb3BvdmVyID0gZWxlbWVudC5wb3BvdmVyVGFyZ2V0RWxlbWVudDtcbiAgaWYgKCEocG9wb3ZlciBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB2aXNpYmlsaXR5ID0gZ2V0UG9wb3ZlclZpc2liaWxpdHlTdGF0ZShwb3BvdmVyKTtcbiAgaWYgKGVsZW1lbnQucG9wb3ZlclRhcmdldEFjdGlvbiA9PT0gXCJzaG93XCIgJiYgdmlzaWJpbGl0eSA9PT0gXCJzaG93aW5nXCIpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGVsZW1lbnQucG9wb3ZlclRhcmdldEFjdGlvbiA9PT0gXCJoaWRlXCIgJiYgdmlzaWJpbGl0eSA9PT0gXCJoaWRkZW5cIikgcmV0dXJuO1xuICBpZiAodmlzaWJpbGl0eSA9PT0gXCJzaG93aW5nXCIpIHtcbiAgICBoaWRlUG9wb3Zlcihwb3BvdmVyLCB0cnVlLCB0cnVlKTtcbiAgfSBlbHNlIGlmIChjaGVja1BvcG92ZXJWYWxpZGl0eShwb3BvdmVyLCBmYWxzZSkpIHtcbiAgICBwb3BvdmVySW52b2tlci5zZXQocG9wb3ZlciwgZWxlbWVudCk7XG4gICAgc2hvd1BvcG92ZXIocG9wb3Zlcik7XG4gIH1cbn1cbmZ1bmN0aW9uIGNoZWNrUG9wb3ZlclZhbGlkaXR5KGVsZW1lbnQsIGV4cGVjdGVkVG9CZVNob3dpbmcpIHtcbiAgaWYgKGVsZW1lbnQucG9wb3ZlciAhPT0gXCJhdXRvXCIgJiYgZWxlbWVudC5wb3BvdmVyICE9PSBcIm1hbnVhbFwiICYmIGVsZW1lbnQucG9wb3ZlciAhPT0gXCJoaW50XCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKCFlbGVtZW50LmlzQ29ubmVjdGVkKSByZXR1cm4gZmFsc2U7XG4gIGlmIChleHBlY3RlZFRvQmVTaG93aW5nICYmIGdldFBvcG92ZXJWaXNpYmlsaXR5U3RhdGUoZWxlbWVudCkgIT09IFwic2hvd2luZ1wiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICghZXhwZWN0ZWRUb0JlU2hvd2luZyAmJiBnZXRQb3BvdmVyVmlzaWJpbGl0eVN0YXRlKGVsZW1lbnQpICE9PSBcImhpZGRlblwiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTERpYWxvZ0VsZW1lbnQgJiYgZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJvcGVuXCIpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCA9PT0gZWxlbWVudCkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGdldFN0YWNrUG9zaXRpb24ocG9wb3Zlcikge1xuICBpZiAoIXBvcG92ZXIpIHJldHVybiAwO1xuICBjb25zdCBhdXRvUG9wb3ZlcnMgPSBhdXRvUG9wb3Zlckxpc3QuZ2V0KGRvY3VtZW50KSB8fCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuICBjb25zdCBoaW50UG9wb3ZlcnMgPSBoaW50UG9wb3Zlckxpc3QuZ2V0KGRvY3VtZW50KSB8fCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuICBpZiAoaGludFBvcG92ZXJzLmhhcyhwb3BvdmVyKSkge1xuICAgIHJldHVybiBbLi4uaGludFBvcG92ZXJzXS5pbmRleE9mKHBvcG92ZXIpICsgYXV0b1BvcG92ZXJzLnNpemUgKyAxO1xuICB9XG4gIGlmIChhdXRvUG9wb3ZlcnMuaGFzKHBvcG92ZXIpKSB7XG4gICAgcmV0dXJuIFsuLi5hdXRvUG9wb3ZlcnNdLmluZGV4T2YocG9wb3ZlcikgKyAxO1xuICB9XG4gIHJldHVybiAwO1xufVxuZnVuY3Rpb24gdG9wTW9zdENsaWNrZWRQb3BvdmVyKHRhcmdldCkge1xuICBjb25zdCBjbGlja2VkUG9wb3ZlciA9IG5lYXJlc3RJbmNsdXNpdmVPcGVuUG9wb3Zlcih0YXJnZXQpO1xuICBjb25zdCBpbnZva2VyUG9wb3ZlciA9IG5lYXJlc3RJbmNsdXNpdmVUYXJnZXRQb3BvdmVyRm9ySW52b2tlcih0YXJnZXQpO1xuICBpZiAoZ2V0U3RhY2tQb3NpdGlvbihjbGlja2VkUG9wb3ZlcikgPiBnZXRTdGFja1Bvc2l0aW9uKGludm9rZXJQb3BvdmVyKSkge1xuICAgIHJldHVybiBjbGlja2VkUG9wb3ZlcjtcbiAgfVxuICByZXR1cm4gaW52b2tlclBvcG92ZXI7XG59XG5mdW5jdGlvbiB0b3Btb3N0QXV0b09ySGludFBvcG92ZXIoZG9jdW1lbnQyKSB7XG4gIGxldCB0b3Btb3N0UG9wb3ZlcjtcbiAgY29uc3QgaGludFBvcG92ZXJzID0gaGludFBvcG92ZXJMaXN0LmdldChkb2N1bWVudDIpIHx8IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG4gIGNvbnN0IGF1dG9Qb3BvdmVycyA9IGF1dG9Qb3BvdmVyTGlzdC5nZXQoZG9jdW1lbnQyKSB8fCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuICBjb25zdCB1c2VkU3RhY2sgPSBoaW50UG9wb3ZlcnMuc2l6ZSA+IDAgPyBoaW50UG9wb3ZlcnMgOiBhdXRvUG9wb3ZlcnMuc2l6ZSA+IDAgPyBhdXRvUG9wb3ZlcnMgOiBudWxsO1xuICBpZiAodXNlZFN0YWNrKSB7XG4gICAgdG9wbW9zdFBvcG92ZXIgPSBsYXN0U2V0RWxlbWVudCh1c2VkU3RhY2spO1xuICAgIGlmICghdG9wbW9zdFBvcG92ZXIuaXNDb25uZWN0ZWQpIHtcbiAgICAgIHVzZWRTdGFjay5kZWxldGUodG9wbW9zdFBvcG92ZXIpO1xuICAgICAgcmV0dXJuIHRvcG1vc3RBdXRvT3JIaW50UG9wb3Zlcihkb2N1bWVudDIpO1xuICAgIH1cbiAgICByZXR1cm4gdG9wbW9zdFBvcG92ZXI7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5mdW5jdGlvbiB0b3BNb3N0UG9wb3ZlckluTGlzdChsaXN0KSB7XG4gIGZvciAoY29uc3QgcG9wb3ZlciBvZiBsaXN0IHx8IFtdKSB7XG4gICAgaWYgKCFwb3BvdmVyLmlzQ29ubmVjdGVkKSB7XG4gICAgICBsaXN0LmRlbGV0ZShwb3BvdmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBvcG92ZXI7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gZ2V0Um9vdE5vZGUobm9kZSkge1xuICBpZiAodHlwZW9mIG5vZGUuZ2V0Um9vdE5vZGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiBub2RlLmdldFJvb3ROb2RlKCk7XG4gIH1cbiAgaWYgKG5vZGUucGFyZW50Tm9kZSkgcmV0dXJuIGdldFJvb3ROb2RlKG5vZGUucGFyZW50Tm9kZSk7XG4gIHJldHVybiBub2RlO1xufVxuZnVuY3Rpb24gbmVhcmVzdEluY2x1c2l2ZU9wZW5Qb3BvdmVyKG5vZGUpIHtcbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmIG5vZGUucG9wb3ZlciA9PT0gXCJhdXRvXCIgJiYgdmlzaWJpbGl0eVN0YXRlLmdldChub2RlKSA9PT0gXCJzaG93aW5nXCIpIHtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICBub2RlID0gbm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQgJiYgbm9kZS5hc3NpZ25lZFNsb3QgfHwgbm9kZS5wYXJlbnRFbGVtZW50IHx8IGdldFJvb3ROb2RlKG5vZGUpO1xuICAgIGlmIChub2RlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkgbm9kZSA9IG5vZGUuaG9zdDtcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIERvY3VtZW50KSByZXR1cm47XG4gIH1cbn1cbmZ1bmN0aW9uIG5lYXJlc3RJbmNsdXNpdmVUYXJnZXRQb3BvdmVyRm9ySW52b2tlcihub2RlKSB7XG4gIHdoaWxlIChub2RlKSB7XG4gICAgY29uc3Qgbm9kZVBvcG92ZXIgPSBub2RlLnBvcG92ZXJUYXJnZXRFbGVtZW50O1xuICAgIGlmIChub2RlUG9wb3ZlciBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSByZXR1cm4gbm9kZVBvcG92ZXI7XG4gICAgbm9kZSA9IG5vZGUucGFyZW50RWxlbWVudCB8fCBnZXRSb290Tm9kZShub2RlKTtcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpIG5vZGUgPSBub2RlLmhvc3Q7XG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBEb2N1bWVudCkgcmV0dXJuO1xuICB9XG59XG5mdW5jdGlvbiB0b3BNb3N0UG9wb3ZlckFuY2VzdG9yKG5ld1BvcG92ZXIsIGxpc3QpIHtcbiAgY29uc3QgcG9wb3ZlclBvc2l0aW9ucyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG4gIGxldCBpID0gMDtcbiAgZm9yIChjb25zdCBwb3BvdmVyIG9mIGxpc3QgfHwgW10pIHtcbiAgICBwb3BvdmVyUG9zaXRpb25zLnNldChwb3BvdmVyLCBpKTtcbiAgICBpICs9IDE7XG4gIH1cbiAgcG9wb3ZlclBvc2l0aW9ucy5zZXQobmV3UG9wb3ZlciwgaSk7XG4gIGkgKz0gMTtcbiAgbGV0IHRvcE1vc3RQb3BvdmVyQW5jZXN0b3IyID0gbnVsbDtcbiAgZnVuY3Rpb24gY2hlY2tBbmNlc3RvcihjYW5kaWRhdGUpIHtcbiAgICBpZiAoIWNhbmRpZGF0ZSkgcmV0dXJuO1xuICAgIGxldCBva05lc3RpbmcgPSBmYWxzZTtcbiAgICBsZXQgY2FuZGlkYXRlQW5jZXN0b3IgPSBudWxsO1xuICAgIGxldCBjYW5kaWRhdGVQb3NpdGlvbiA9IG51bGw7XG4gICAgd2hpbGUgKCFva05lc3RpbmcpIHtcbiAgICAgIGNhbmRpZGF0ZUFuY2VzdG9yID0gbmVhcmVzdEluY2x1c2l2ZU9wZW5Qb3BvdmVyKGNhbmRpZGF0ZSkgfHwgbnVsbDtcbiAgICAgIGlmIChjYW5kaWRhdGVBbmNlc3RvciA9PT0gbnVsbCkgcmV0dXJuO1xuICAgICAgaWYgKCFwb3BvdmVyUG9zaXRpb25zLmhhcyhjYW5kaWRhdGVBbmNlc3RvcikpIHJldHVybjtcbiAgICAgIGlmIChuZXdQb3BvdmVyLnBvcG92ZXIgPT09IFwiaGludFwiIHx8IGNhbmRpZGF0ZUFuY2VzdG9yLnBvcG92ZXIgPT09IFwiYXV0b1wiKSB7XG4gICAgICAgIG9rTmVzdGluZyA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoIW9rTmVzdGluZykge1xuICAgICAgICBjYW5kaWRhdGUgPSBjYW5kaWRhdGVBbmNlc3Rvci5wYXJlbnRFbGVtZW50O1xuICAgICAgfVxuICAgIH1cbiAgICBjYW5kaWRhdGVQb3NpdGlvbiA9IHBvcG92ZXJQb3NpdGlvbnMuZ2V0KGNhbmRpZGF0ZUFuY2VzdG9yKTtcbiAgICBpZiAodG9wTW9zdFBvcG92ZXJBbmNlc3RvcjIgPT09IG51bGwgfHwgcG9wb3ZlclBvc2l0aW9ucy5nZXQodG9wTW9zdFBvcG92ZXJBbmNlc3RvcjIpIDwgY2FuZGlkYXRlUG9zaXRpb24pIHtcbiAgICAgIHRvcE1vc3RQb3BvdmVyQW5jZXN0b3IyID0gY2FuZGlkYXRlQW5jZXN0b3I7XG4gICAgfVxuICB9XG4gIGNoZWNrQW5jZXN0b3IobmV3UG9wb3Zlci5wYXJlbnRFbGVtZW50IHx8IGdldFJvb3ROb2RlKG5ld1BvcG92ZXIpKTtcbiAgcmV0dXJuIHRvcE1vc3RQb3BvdmVyQW5jZXN0b3IyO1xufVxuZnVuY3Rpb24gaXNGb2N1c2FibGUoZm9jdXNUYXJnZXQpIHtcbiAgaWYgKGZvY3VzVGFyZ2V0LmhpZGRlbiB8fCBmb2N1c1RhcmdldCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QpIHJldHVybiBmYWxzZTtcbiAgaWYgKGZvY3VzVGFyZ2V0IGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQgfHwgZm9jdXNUYXJnZXQgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50IHx8IGZvY3VzVGFyZ2V0IGluc3RhbmNlb2YgSFRNTFNlbGVjdEVsZW1lbnQgfHwgZm9jdXNUYXJnZXQgaW5zdGFuY2VvZiBIVE1MVGV4dEFyZWFFbGVtZW50IHx8IGZvY3VzVGFyZ2V0IGluc3RhbmNlb2YgSFRNTE9wdEdyb3VwRWxlbWVudCB8fCBmb2N1c1RhcmdldCBpbnN0YW5jZW9mIEhUTUxPcHRpb25FbGVtZW50IHx8IGZvY3VzVGFyZ2V0IGluc3RhbmNlb2YgSFRNTEZpZWxkU2V0RWxlbWVudCkge1xuICAgIGlmIChmb2N1c1RhcmdldC5kaXNhYmxlZCkgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChmb2N1c1RhcmdldCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgZm9jdXNUYXJnZXQudHlwZSA9PT0gXCJoaWRkZW5cIikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoZm9jdXNUYXJnZXQgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCAmJiBmb2N1c1RhcmdldC5ocmVmID09PSBcIlwiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0eXBlb2YgZm9jdXNUYXJnZXQudGFiSW5kZXggPT09IFwibnVtYmVyXCIgJiYgZm9jdXNUYXJnZXQudGFiSW5kZXggIT09IC0xO1xufVxuZnVuY3Rpb24gZm9jdXNEZWxlZ2F0ZShmb2N1c1RhcmdldCkge1xuICBpZiAoZm9jdXNUYXJnZXQuc2hhZG93Um9vdCAmJiBmb2N1c1RhcmdldC5zaGFkb3dSb290LmRlbGVnYXRlc0ZvY3VzICE9PSB0cnVlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgbGV0IHdoZXJlVG9Mb29rID0gZm9jdXNUYXJnZXQ7XG4gIGlmICh3aGVyZVRvTG9vay5zaGFkb3dSb290KSB7XG4gICAgd2hlcmVUb0xvb2sgPSB3aGVyZVRvTG9vay5zaGFkb3dSb290O1xuICB9XG4gIGxldCBhdXRvRm9jdXNEZWxlZ2F0ZSA9IHdoZXJlVG9Mb29rLnF1ZXJ5U2VsZWN0b3IoXCJbYXV0b2ZvY3VzXVwiKTtcbiAgaWYgKGF1dG9Gb2N1c0RlbGVnYXRlKSB7XG4gICAgcmV0dXJuIGF1dG9Gb2N1c0RlbGVnYXRlO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHNsb3RzID0gd2hlcmVUb0xvb2sucXVlcnlTZWxlY3RvckFsbChcInNsb3RcIik7XG4gICAgZm9yIChjb25zdCBzbG90IG9mIHNsb3RzKSB7XG4gICAgICBjb25zdCBhc3NpZ25lZEVsZW1lbnRzID0gc2xvdC5hc3NpZ25lZEVsZW1lbnRzKHsgZmxhdHRlbjogdHJ1ZSB9KTtcbiAgICAgIGZvciAoY29uc3QgZWwgb2YgYXNzaWduZWRFbGVtZW50cykge1xuICAgICAgICBpZiAoZWwuaGFzQXR0cmlidXRlKFwiYXV0b2ZvY3VzXCIpKSB7XG4gICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGF1dG9Gb2N1c0RlbGVnYXRlID0gZWwucXVlcnlTZWxlY3RvcihcIlthdXRvZm9jdXNdXCIpO1xuICAgICAgICAgIGlmIChhdXRvRm9jdXNEZWxlZ2F0ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGF1dG9Gb2N1c0RlbGVnYXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBjb25zdCB3YWxrZXIgPSBmb2N1c1RhcmdldC5vd25lckRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIoXG4gICAgd2hlcmVUb0xvb2ssXG4gICAgTm9kZUZpbHRlci5TSE9XX0VMRU1FTlRcbiAgKTtcbiAgbGV0IGRlc2NlbmRhbnQgPSB3YWxrZXIuY3VycmVudE5vZGU7XG4gIHdoaWxlIChkZXNjZW5kYW50KSB7XG4gICAgaWYgKGlzRm9jdXNhYmxlKGRlc2NlbmRhbnQpKSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGFudDtcbiAgICB9XG4gICAgZGVzY2VuZGFudCA9IHdhbGtlci5uZXh0Tm9kZSgpO1xuICB9XG59XG5mdW5jdGlvbiBwb3BvdmVyRm9jdXNpbmdTdGVwcyhzdWJqZWN0KSB7XG4gIHZhciBfYTtcbiAgKF9hID0gZm9jdXNEZWxlZ2F0ZShzdWJqZWN0KSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9hLmZvY3VzKCk7XG59XG52YXIgcHJldmlvdXNseUZvY3VzZWRFbGVtZW50cyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuZnVuY3Rpb24gc2hvd1BvcG92ZXIoZWxlbWVudCkge1xuICBpZiAoIWNoZWNrUG9wb3ZlclZhbGlkaXR5KGVsZW1lbnQsIGZhbHNlKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBkb2N1bWVudDIgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQ7XG4gIGlmICghZWxlbWVudC5kaXNwYXRjaEV2ZW50KFxuICAgIG5ldyBUb2dnbGVFdmVudChcImJlZm9yZXRvZ2dsZVwiLCB7XG4gICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgb2xkU3RhdGU6IFwiY2xvc2VkXCIsXG4gICAgICBuZXdTdGF0ZTogXCJvcGVuXCJcbiAgICB9KVxuICApKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghY2hlY2tQb3BvdmVyVmFsaWRpdHkoZWxlbWVudCwgZmFsc2UpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBzaG91bGRSZXN0b3JlRm9jdXMgPSBmYWxzZTtcbiAgY29uc3Qgb3JpZ2luYWxUeXBlID0gZWxlbWVudC5wb3BvdmVyO1xuICBsZXQgc3RhY2tUb0FwcGVuZFRvID0gbnVsbDtcbiAgY29uc3QgYXV0b0FuY2VzdG9yID0gdG9wTW9zdFBvcG92ZXJBbmNlc3RvcihcbiAgICBlbGVtZW50LFxuICAgIGF1dG9Qb3BvdmVyTGlzdC5nZXQoZG9jdW1lbnQyKSB8fCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpXG4gICk7XG4gIGNvbnN0IGhpbnRBbmNlc3RvciA9IHRvcE1vc3RQb3BvdmVyQW5jZXN0b3IoXG4gICAgZWxlbWVudCxcbiAgICBoaW50UG9wb3Zlckxpc3QuZ2V0KGRvY3VtZW50MikgfHwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKVxuICApO1xuICBpZiAob3JpZ2luYWxUeXBlID09PSBcImF1dG9cIikge1xuICAgIGNsb3NlQWxsT3BlblBvcG92ZXJzSW5MaXN0KFxuICAgICAgaGludFBvcG92ZXJMaXN0LmdldChkb2N1bWVudDIpIHx8IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCksXG4gICAgICBzaG91bGRSZXN0b3JlRm9jdXMsXG4gICAgICB0cnVlXG4gICAgKTtcbiAgICBjb25zdCBhbmNlc3RvciA9IGF1dG9BbmNlc3RvciB8fCBkb2N1bWVudDI7XG4gICAgaGlkZUFsbFBvcG92ZXJzVW50aWwoYW5jZXN0b3IsIHNob3VsZFJlc3RvcmVGb2N1cywgdHJ1ZSk7XG4gICAgc3RhY2tUb0FwcGVuZFRvID0gXCJhdXRvXCI7XG4gIH1cbiAgaWYgKG9yaWdpbmFsVHlwZSA9PT0gXCJoaW50XCIpIHtcbiAgICBpZiAoaGludEFuY2VzdG9yKSB7XG4gICAgICBoaWRlQWxsUG9wb3ZlcnNVbnRpbChoaW50QW5jZXN0b3IsIHNob3VsZFJlc3RvcmVGb2N1cywgdHJ1ZSk7XG4gICAgICBzdGFja1RvQXBwZW5kVG8gPSBcImhpbnRcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgY2xvc2VBbGxPcGVuUG9wb3ZlcnNJbkxpc3QoXG4gICAgICAgIGhpbnRQb3BvdmVyTGlzdC5nZXQoZG9jdW1lbnQyKSB8fCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpLFxuICAgICAgICBzaG91bGRSZXN0b3JlRm9jdXMsXG4gICAgICAgIHRydWVcbiAgICAgICk7XG4gICAgICBpZiAoYXV0b0FuY2VzdG9yKSB7XG4gICAgICAgIGhpZGVBbGxQb3BvdmVyc1VudGlsKGF1dG9BbmNlc3Rvciwgc2hvdWxkUmVzdG9yZUZvY3VzLCB0cnVlKTtcbiAgICAgICAgc3RhY2tUb0FwcGVuZFRvID0gXCJhdXRvXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGFja1RvQXBwZW5kVG8gPSBcImhpbnRcIjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKG9yaWdpbmFsVHlwZSA9PT0gXCJhdXRvXCIgfHwgb3JpZ2luYWxUeXBlID09PSBcImhpbnRcIikge1xuICAgIGlmIChvcmlnaW5hbFR5cGUgIT09IGVsZW1lbnQucG9wb3ZlciB8fCAhY2hlY2tQb3BvdmVyVmFsaWRpdHkoZWxlbWVudCwgZmFsc2UpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdG9wbW9zdEF1dG9PckhpbnRQb3BvdmVyKGRvY3VtZW50MikpIHtcbiAgICAgIHNob3VsZFJlc3RvcmVGb2N1cyA9IHRydWU7XG4gICAgfVxuICAgIGlmIChzdGFja1RvQXBwZW5kVG8gPT09IFwiYXV0b1wiKSB7XG4gICAgICBpZiAoIWF1dG9Qb3BvdmVyTGlzdC5oYXMoZG9jdW1lbnQyKSkge1xuICAgICAgICBhdXRvUG9wb3Zlckxpc3Quc2V0KGRvY3VtZW50MiwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSk7XG4gICAgICB9XG4gICAgICBhdXRvUG9wb3Zlckxpc3QuZ2V0KGRvY3VtZW50MikuYWRkKGVsZW1lbnQpO1xuICAgIH0gZWxzZSBpZiAoc3RhY2tUb0FwcGVuZFRvID09PSBcImhpbnRcIikge1xuICAgICAgaWYgKCFoaW50UG9wb3Zlckxpc3QuaGFzKGRvY3VtZW50MikpIHtcbiAgICAgICAgaGludFBvcG92ZXJMaXN0LnNldChkb2N1bWVudDIsIC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpO1xuICAgICAgfVxuICAgICAgaGludFBvcG92ZXJMaXN0LmdldChkb2N1bWVudDIpLmFkZChlbGVtZW50KTtcbiAgICB9XG4gIH1cbiAgcHJldmlvdXNseUZvY3VzZWRFbGVtZW50cy5kZWxldGUoZWxlbWVudCk7XG4gIGNvbnN0IG9yaWdpbmFsbHlGb2N1c2VkRWxlbWVudCA9IGRvY3VtZW50Mi5hY3RpdmVFbGVtZW50O1xuICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCI6cG9wb3Zlci1vcGVuXCIpO1xuICB2aXNpYmlsaXR5U3RhdGUuc2V0KGVsZW1lbnQsIFwic2hvd2luZ1wiKTtcbiAgaWYgKCF0b3BMYXllckVsZW1lbnRzLmhhcyhkb2N1bWVudDIpKSB7XG4gICAgdG9wTGF5ZXJFbGVtZW50cy5zZXQoZG9jdW1lbnQyLCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpKTtcbiAgfVxuICB0b3BMYXllckVsZW1lbnRzLmdldChkb2N1bWVudDIpLmFkZChlbGVtZW50KTtcbiAgc2V0SW52b2tlckFyaWFFeHBhbmRlZChwb3BvdmVySW52b2tlci5nZXQoZWxlbWVudCksIHRydWUpO1xuICBwb3BvdmVyRm9jdXNpbmdTdGVwcyhlbGVtZW50KTtcbiAgaWYgKHNob3VsZFJlc3RvcmVGb2N1cyAmJiBvcmlnaW5hbGx5Rm9jdXNlZEVsZW1lbnQgJiYgZWxlbWVudC5wb3BvdmVyID09PSBcImF1dG9cIikge1xuICAgIHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudHMuc2V0KGVsZW1lbnQsIG9yaWdpbmFsbHlGb2N1c2VkRWxlbWVudCk7XG4gIH1cbiAgcXVldWVQb3BvdmVyVG9nZ2xlRXZlbnRUYXNrKGVsZW1lbnQsIFwiY2xvc2VkXCIsIFwib3BlblwiKTtcbn1cbmZ1bmN0aW9uIGhpZGVQb3BvdmVyKGVsZW1lbnQsIGZvY3VzUHJldmlvdXNFbGVtZW50ID0gZmFsc2UsIGZpcmVFdmVudHMgPSBmYWxzZSkge1xuICB2YXIgX2EsIF9iO1xuICBpZiAoIWNoZWNrUG9wb3ZlclZhbGlkaXR5KGVsZW1lbnQsIHRydWUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGRvY3VtZW50MiA9IGVsZW1lbnQub3duZXJEb2N1bWVudDtcbiAgaWYgKFtcImF1dG9cIiwgXCJoaW50XCJdLmluY2x1ZGVzKGVsZW1lbnQucG9wb3ZlcikpIHtcbiAgICBoaWRlQWxsUG9wb3ZlcnNVbnRpbChlbGVtZW50LCBmb2N1c1ByZXZpb3VzRWxlbWVudCwgZmlyZUV2ZW50cyk7XG4gICAgaWYgKCFjaGVja1BvcG92ZXJWYWxpZGl0eShlbGVtZW50LCB0cnVlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICBjb25zdCBhdXRvTGlzdCA9IGF1dG9Qb3BvdmVyTGlzdC5nZXQoZG9jdW1lbnQyKSB8fCAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuICBjb25zdCBhdXRvUG9wb3Zlckxpc3RDb250YWluc0VsZW1lbnQgPSBhdXRvTGlzdC5oYXMoZWxlbWVudCkgJiYgbGFzdFNldEVsZW1lbnQoYXV0b0xpc3QpID09PSBlbGVtZW50O1xuICBzZXRJbnZva2VyQXJpYUV4cGFuZGVkKHBvcG92ZXJJbnZva2VyLmdldChlbGVtZW50KSwgZmFsc2UpO1xuICBwb3BvdmVySW52b2tlci5kZWxldGUoZWxlbWVudCk7XG4gIGlmIChmaXJlRXZlbnRzKSB7XG4gICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IFRvZ2dsZUV2ZW50KFwiYmVmb3JldG9nZ2xlXCIsIHtcbiAgICAgICAgb2xkU3RhdGU6IFwib3BlblwiLFxuICAgICAgICBuZXdTdGF0ZTogXCJjbG9zZWRcIlxuICAgICAgfSlcbiAgICApO1xuICAgIGlmIChhdXRvUG9wb3Zlckxpc3RDb250YWluc0VsZW1lbnQgJiYgbGFzdFNldEVsZW1lbnQoYXV0b0xpc3QpICE9PSBlbGVtZW50KSB7XG4gICAgICBoaWRlQWxsUG9wb3ZlcnNVbnRpbChlbGVtZW50LCBmb2N1c1ByZXZpb3VzRWxlbWVudCwgZmlyZUV2ZW50cyk7XG4gICAgfVxuICAgIGlmICghY2hlY2tQb3BvdmVyVmFsaWRpdHkoZWxlbWVudCwgdHJ1ZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgKF9hID0gdG9wTGF5ZXJFbGVtZW50cy5nZXQoZG9jdW1lbnQyKSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9hLmRlbGV0ZShlbGVtZW50KTtcbiAgYXV0b0xpc3QuZGVsZXRlKGVsZW1lbnQpO1xuICAoX2IgPSBoaW50UG9wb3Zlckxpc3QuZ2V0KGRvY3VtZW50MikpID09IG51bGwgPyB2b2lkIDAgOiBfYi5kZWxldGUoZWxlbWVudCk7XG4gIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcIjpwb3BvdmVyLW9wZW5cIik7XG4gIHZpc2liaWxpdHlTdGF0ZS5zZXQoZWxlbWVudCwgXCJoaWRkZW5cIik7XG4gIGlmIChmaXJlRXZlbnRzKSB7XG4gICAgcXVldWVQb3BvdmVyVG9nZ2xlRXZlbnRUYXNrKGVsZW1lbnQsIFwib3BlblwiLCBcImNsb3NlZFwiKTtcbiAgfVxuICBjb25zdCBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnRzLmdldChlbGVtZW50KTtcbiAgaWYgKHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCkge1xuICAgIHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudHMuZGVsZXRlKGVsZW1lbnQpO1xuICAgIGlmIChmb2N1c1ByZXZpb3VzRWxlbWVudCkge1xuICAgICAgcHJldmlvdXNseUZvY3VzZWRFbGVtZW50LmZvY3VzKCk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBjbG9zZUFsbE9wZW5Qb3BvdmVycyhkb2N1bWVudDIsIGZvY3VzUHJldmlvdXNFbGVtZW50ID0gZmFsc2UsIGZpcmVFdmVudHMgPSBmYWxzZSkge1xuICBsZXQgcG9wb3ZlciA9IHRvcG1vc3RBdXRvT3JIaW50UG9wb3Zlcihkb2N1bWVudDIpO1xuICB3aGlsZSAocG9wb3Zlcikge1xuICAgIGhpZGVQb3BvdmVyKHBvcG92ZXIsIGZvY3VzUHJldmlvdXNFbGVtZW50LCBmaXJlRXZlbnRzKTtcbiAgICBwb3BvdmVyID0gdG9wbW9zdEF1dG9PckhpbnRQb3BvdmVyKGRvY3VtZW50Mik7XG4gIH1cbn1cbmZ1bmN0aW9uIGNsb3NlQWxsT3BlblBvcG92ZXJzSW5MaXN0KGxpc3QsIGZvY3VzUHJldmlvdXNFbGVtZW50ID0gZmFsc2UsIGZpcmVFdmVudHMgPSBmYWxzZSkge1xuICBsZXQgcG9wb3ZlciA9IHRvcE1vc3RQb3BvdmVySW5MaXN0KGxpc3QpO1xuICB3aGlsZSAocG9wb3Zlcikge1xuICAgIGhpZGVQb3BvdmVyKHBvcG92ZXIsIGZvY3VzUHJldmlvdXNFbGVtZW50LCBmaXJlRXZlbnRzKTtcbiAgICBwb3BvdmVyID0gdG9wTW9zdFBvcG92ZXJJbkxpc3QobGlzdCk7XG4gIH1cbn1cbmZ1bmN0aW9uIGhpZGVQb3BvdmVyU3RhY2tVbnRpbChlbmRwb2ludCwgc2V0LCBmb2N1c1ByZXZpb3VzRWxlbWVudCwgZmlyZUV2ZW50cykge1xuICBsZXQgcmVwZWF0aW5nSGlkZSA9IGZhbHNlO1xuICBsZXQgaGFzUnVuT25jZSA9IGZhbHNlO1xuICB3aGlsZSAocmVwZWF0aW5nSGlkZSB8fCAhaGFzUnVuT25jZSkge1xuICAgIGhhc1J1bk9uY2UgPSB0cnVlO1xuICAgIGxldCBsYXN0VG9IaWRlID0gbnVsbDtcbiAgICBsZXQgZm91bmRFbmRwb2ludCA9IGZhbHNlO1xuICAgIGZvciAoY29uc3QgcG9wb3ZlciBvZiBzZXQpIHtcbiAgICAgIGlmIChwb3BvdmVyID09PSBlbmRwb2ludCkge1xuICAgICAgICBmb3VuZEVuZHBvaW50ID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoZm91bmRFbmRwb2ludCkge1xuICAgICAgICBsYXN0VG9IaWRlID0gcG9wb3ZlcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghbGFzdFRvSGlkZSkgcmV0dXJuO1xuICAgIHdoaWxlIChnZXRQb3BvdmVyVmlzaWJpbGl0eVN0YXRlKGxhc3RUb0hpZGUpID09PSBcInNob3dpbmdcIiAmJiBzZXQuc2l6ZSkge1xuICAgICAgaGlkZVBvcG92ZXIobGFzdFNldEVsZW1lbnQoc2V0KSwgZm9jdXNQcmV2aW91c0VsZW1lbnQsIGZpcmVFdmVudHMpO1xuICAgIH1cbiAgICBpZiAoc2V0LmhhcyhlbmRwb2ludCkgJiYgbGFzdFNldEVsZW1lbnQoc2V0KSAhPT0gZW5kcG9pbnQpIHtcbiAgICAgIHJlcGVhdGluZ0hpZGUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAocmVwZWF0aW5nSGlkZSkge1xuICAgICAgZmlyZUV2ZW50cyA9IGZhbHNlO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gaGlkZUFsbFBvcG92ZXJzVW50aWwoZW5kcG9pbnQsIGZvY3VzUHJldmlvdXNFbGVtZW50LCBmaXJlRXZlbnRzKSB7XG4gIHZhciBfYSwgX2I7XG4gIGNvbnN0IGRvY3VtZW50MiA9IGVuZHBvaW50Lm93bmVyRG9jdW1lbnQgfHwgZW5kcG9pbnQ7XG4gIGlmIChlbmRwb2ludCBpbnN0YW5jZW9mIERvY3VtZW50KSB7XG4gICAgcmV0dXJuIGNsb3NlQWxsT3BlblBvcG92ZXJzKGRvY3VtZW50MiwgZm9jdXNQcmV2aW91c0VsZW1lbnQsIGZpcmVFdmVudHMpO1xuICB9XG4gIGlmICgoX2EgPSBoaW50UG9wb3Zlckxpc3QuZ2V0KGRvY3VtZW50MikpID09IG51bGwgPyB2b2lkIDAgOiBfYS5oYXMoZW5kcG9pbnQpKSB7XG4gICAgaGlkZVBvcG92ZXJTdGFja1VudGlsKFxuICAgICAgZW5kcG9pbnQsXG4gICAgICBoaW50UG9wb3Zlckxpc3QuZ2V0KGRvY3VtZW50MiksXG4gICAgICBmb2N1c1ByZXZpb3VzRWxlbWVudCxcbiAgICAgIGZpcmVFdmVudHNcbiAgICApO1xuICAgIHJldHVybjtcbiAgfVxuICBjbG9zZUFsbE9wZW5Qb3BvdmVyc0luTGlzdChcbiAgICBoaW50UG9wb3Zlckxpc3QuZ2V0KGRvY3VtZW50MikgfHwgLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKSxcbiAgICBmb2N1c1ByZXZpb3VzRWxlbWVudCxcbiAgICBmaXJlRXZlbnRzXG4gICk7XG4gIGlmICghKChfYiA9IGF1dG9Qb3BvdmVyTGlzdC5nZXQoZG9jdW1lbnQyKSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9iLmhhcyhlbmRwb2ludCkpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGhpZGVQb3BvdmVyU3RhY2tVbnRpbChcbiAgICBlbmRwb2ludCxcbiAgICBhdXRvUG9wb3Zlckxpc3QuZ2V0KGRvY3VtZW50MiksXG4gICAgZm9jdXNQcmV2aW91c0VsZW1lbnQsXG4gICAgZmlyZUV2ZW50c1xuICApO1xufVxudmFyIHBvcG92ZXJQb2ludGVyRG93blRhcmdldHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbmZ1bmN0aW9uIGxpZ2h0RGlzbWlzc09wZW5Qb3BvdmVycyhldmVudCkge1xuICBpZiAoIWV2ZW50LmlzVHJ1c3RlZCkgcmV0dXJuO1xuICBjb25zdCB0YXJnZXQgPSBldmVudC5jb21wb3NlZFBhdGgoKVswXTtcbiAgaWYgKCF0YXJnZXQpIHJldHVybjtcbiAgY29uc3QgZG9jdW1lbnQyID0gdGFyZ2V0Lm93bmVyRG9jdW1lbnQ7XG4gIGNvbnN0IHRvcE1vc3RQb3BvdmVyID0gdG9wbW9zdEF1dG9PckhpbnRQb3BvdmVyKGRvY3VtZW50Mik7XG4gIGlmICghdG9wTW9zdFBvcG92ZXIpIHJldHVybjtcbiAgY29uc3QgYW5jZXN0b3IgPSB0b3BNb3N0Q2xpY2tlZFBvcG92ZXIodGFyZ2V0KTtcbiAgaWYgKGFuY2VzdG9yICYmIGV2ZW50LnR5cGUgPT09IFwicG9pbnRlcmRvd25cIikge1xuICAgIHBvcG92ZXJQb2ludGVyRG93blRhcmdldHMuc2V0KGRvY3VtZW50MiwgYW5jZXN0b3IpO1xuICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09IFwicG9pbnRlcnVwXCIpIHtcbiAgICBjb25zdCBzYW1lVGFyZ2V0ID0gcG9wb3ZlclBvaW50ZXJEb3duVGFyZ2V0cy5nZXQoZG9jdW1lbnQyKSA9PT0gYW5jZXN0b3I7XG4gICAgcG9wb3ZlclBvaW50ZXJEb3duVGFyZ2V0cy5kZWxldGUoZG9jdW1lbnQyKTtcbiAgICBpZiAoc2FtZVRhcmdldCkge1xuICAgICAgaGlkZUFsbFBvcG92ZXJzVW50aWwoYW5jZXN0b3IgfHwgZG9jdW1lbnQyLCBmYWxzZSwgdHJ1ZSk7XG4gICAgfVxuICB9XG59XG52YXIgaW5pdGlhbEFyaWFFeHBhbmRlZFZhbHVlID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG5mdW5jdGlvbiBzZXRJbnZva2VyQXJpYUV4cGFuZGVkKGVsLCBmb3JjZSA9IGZhbHNlKSB7XG4gIGlmICghZWwpIHJldHVybjtcbiAgaWYgKCFpbml0aWFsQXJpYUV4cGFuZGVkVmFsdWUuaGFzKGVsKSkge1xuICAgIGluaXRpYWxBcmlhRXhwYW5kZWRWYWx1ZS5zZXQoZWwsIGVsLmdldEF0dHJpYnV0ZShcImFyaWEtZXhwYW5kZWRcIikpO1xuICB9XG4gIGNvbnN0IHBvcG92ZXIgPSBlbC5wb3BvdmVyVGFyZ2V0RWxlbWVudDtcbiAgaWYgKHBvcG92ZXIgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBwb3BvdmVyLnBvcG92ZXIgPT09IFwiYXV0b1wiKSB7XG4gICAgZWwuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBTdHJpbmcoZm9yY2UpKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBpbml0aWFsVmFsdWUgPSBpbml0aWFsQXJpYUV4cGFuZGVkVmFsdWUuZ2V0KGVsKTtcbiAgICBpZiAoIWluaXRpYWxWYWx1ZSkge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKFwiYXJpYS1leHBhbmRlZFwiLCBpbml0aWFsVmFsdWUpO1xuICAgIH1cbiAgfVxufVxuXG4vLyBzcmMvcG9wb3Zlci50c1xudmFyIFNoYWRvd1Jvb3QyID0gZ2xvYmFsVGhpcy5TaGFkb3dSb290IHx8IGZ1bmN0aW9uKCkge1xufTtcbmZ1bmN0aW9uIGlzU3VwcG9ydGVkKCkge1xuICByZXR1cm4gdHlwZW9mIEhUTUxFbGVtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBIVE1MRWxlbWVudC5wcm90b3R5cGUgPT09IFwib2JqZWN0XCIgJiYgXCJwb3BvdmVyXCIgaW4gSFRNTEVsZW1lbnQucHJvdG90eXBlO1xufVxuZnVuY3Rpb24gcGF0Y2hTZWxlY3RvckZuKG9iamVjdCwgbmFtZSwgbWFwcGVyKSB7XG4gIGNvbnN0IG9yaWdpbmFsID0gb2JqZWN0W25hbWVdO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCB7XG4gICAgdmFsdWUoc2VsZWN0b3IpIHtcbiAgICAgIHJldHVybiBvcmlnaW5hbC5jYWxsKHRoaXMsIG1hcHBlcihzZWxlY3RvcikpO1xuICAgIH1cbiAgfSk7XG59XG52YXIgbm9uRXNjYXBlZFBvcG92ZXJTZWxlY3RvciA9IC8oXnxbXlxcXFxdKTpwb3BvdmVyLW9wZW5cXGIvZztcbmZ1bmN0aW9uIGhhc0xheWVyU3VwcG9ydCgpIHtcbiAgcmV0dXJuIHR5cGVvZiBnbG9iYWxUaGlzLkNTU0xheWVyQmxvY2tSdWxlID09PSBcImZ1bmN0aW9uXCI7XG59XG5mdW5jdGlvbiBnZXRTdHlsZXMoKSB7XG4gIGNvbnN0IHVzZUxheWVyID0gaGFzTGF5ZXJTdXBwb3J0KCk7XG4gIHJldHVybiBgXG4ke3VzZUxheWVyID8gXCJAbGF5ZXIgcG9wb3Zlci1wb2x5ZmlsbCB7XCIgOiBcIlwifVxuICA6d2hlcmUoW3BvcG92ZXJdKSB7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIHotaW5kZXg6IDIxNDc0ODM2NDc7XG4gICAgaW5zZXQ6IDA7XG4gICAgcGFkZGluZzogMC4yNWVtO1xuICAgIHdpZHRoOiBmaXQtY29udGVudDtcbiAgICBoZWlnaHQ6IGZpdC1jb250ZW50O1xuICAgIGJvcmRlci13aWR0aDogaW5pdGlhbDtcbiAgICBib3JkZXItY29sb3I6IGluaXRpYWw7XG4gICAgYm9yZGVyLWltYWdlOiBpbml0aWFsO1xuICAgIGJvcmRlci1zdHlsZTogc29saWQ7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogY2FudmFzO1xuICAgIGNvbG9yOiBjYW52YXN0ZXh0O1xuICAgIG92ZXJmbG93OiBhdXRvO1xuICAgIG1hcmdpbjogYXV0bztcbiAgfVxuXG4gIDp3aGVyZShbcG9wb3Zlcl06bm90KC5cXFxcOnBvcG92ZXItb3BlbikpIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG5cbiAgOndoZXJlKGRpYWxvZ1twb3BvdmVyXS5cXFxcOnBvcG92ZXItb3Blbikge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICB9XG5cbiAgOndoZXJlKGRpYWxvZ1twb3BvdmVyXVtvcGVuXSkge1xuICAgIGRpc3BsYXk6IHJldmVydDtcbiAgfVxuXG4gIDp3aGVyZShbYW5jaG9yXS5cXFxcOnBvcG92ZXItb3Blbikge1xuICAgIGluc2V0OiBhdXRvO1xuICB9XG5cbiAgOndoZXJlKFthbmNob3JdOnBvcG92ZXItb3Blbikge1xuICAgIGluc2V0OiBhdXRvO1xuICB9XG5cbiAgQHN1cHBvcnRzIG5vdCAoYmFja2dyb3VuZC1jb2xvcjogY2FudmFzKSB7XG4gICAgOndoZXJlKFtwb3BvdmVyXSkge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gICAgICBjb2xvcjogYmxhY2s7XG4gICAgfVxuICB9XG5cbiAgQHN1cHBvcnRzICh3aWR0aDogLW1vei1maXQtY29udGVudCkge1xuICAgIDp3aGVyZShbcG9wb3Zlcl0pIHtcbiAgICAgIHdpZHRoOiAtbW96LWZpdC1jb250ZW50O1xuICAgICAgaGVpZ2h0OiAtbW96LWZpdC1jb250ZW50O1xuICAgIH1cbiAgfVxuXG4gIEBzdXBwb3J0cyBub3QgKGluc2V0OiAwKSB7XG4gICAgOndoZXJlKFtwb3BvdmVyXSkge1xuICAgICAgdG9wOiAwO1xuICAgICAgbGVmdDogMDtcbiAgICAgIHJpZ2h0OiAwO1xuICAgICAgYm90dG9tOiAwO1xuICAgIH1cbiAgfVxuJHt1c2VMYXllciA/IFwifVwiIDogXCJcIn1cbmA7XG59XG52YXIgcG9wb3ZlclN0eWxlU2hlZXQgPSBudWxsO1xuZnVuY3Rpb24gaW5qZWN0U3R5bGVzKHJvb3QpIHtcbiAgY29uc3Qgc3R5bGVzID0gZ2V0U3R5bGVzKCk7XG4gIGlmIChwb3BvdmVyU3R5bGVTaGVldCA9PT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICBwb3BvdmVyU3R5bGVTaGVldCA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG4gICAgICBwb3BvdmVyU3R5bGVTaGVldC5yZXBsYWNlU3luYyhzdHlsZXMpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcG9wb3ZlclN0eWxlU2hlZXQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgaWYgKHBvcG92ZXJTdHlsZVNoZWV0ID09PSBmYWxzZSkge1xuICAgIGNvbnN0IHNoZWV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICAgIHNoZWV0LnRleHRDb250ZW50ID0gc3R5bGVzO1xuICAgIGlmIChyb290IGluc3RhbmNlb2YgRG9jdW1lbnQpIHtcbiAgICAgIHJvb3QuaGVhZC5wcmVwZW5kKHNoZWV0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm9vdC5wcmVwZW5kKHNoZWV0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5hZG9wdGVkU3R5bGVTaGVldHMgPSBbcG9wb3ZlclN0eWxlU2hlZXQsIC4uLnJvb3QuYWRvcHRlZFN0eWxlU2hlZXRzXTtcbiAgfVxufVxuZnVuY3Rpb24gYXBwbHkoKSB7XG4gIGlmICh0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm47XG4gIHdpbmRvdy5Ub2dnbGVFdmVudCA9IHdpbmRvdy5Ub2dnbGVFdmVudCB8fCBUb2dnbGVFdmVudDtcbiAgZnVuY3Rpb24gcmV3cml0ZVNlbGVjdG9yKHNlbGVjdG9yKSB7XG4gICAgaWYgKHNlbGVjdG9yID09IG51bGwgPyB2b2lkIDAgOiBzZWxlY3Rvci5pbmNsdWRlcyhcIjpwb3BvdmVyLW9wZW5cIikpIHtcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZShcbiAgICAgICAgbm9uRXNjYXBlZFBvcG92ZXJTZWxlY3RvcixcbiAgICAgICAgXCIkMS5cXFxcOnBvcG92ZXItb3BlblwiXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3I7XG4gIH1cbiAgcGF0Y2hTZWxlY3RvckZuKERvY3VtZW50LnByb3RvdHlwZSwgXCJxdWVyeVNlbGVjdG9yXCIsIHJld3JpdGVTZWxlY3Rvcik7XG4gIHBhdGNoU2VsZWN0b3JGbihEb2N1bWVudC5wcm90b3R5cGUsIFwicXVlcnlTZWxlY3RvckFsbFwiLCByZXdyaXRlU2VsZWN0b3IpO1xuICBwYXRjaFNlbGVjdG9yRm4oRWxlbWVudC5wcm90b3R5cGUsIFwicXVlcnlTZWxlY3RvclwiLCByZXdyaXRlU2VsZWN0b3IpO1xuICBwYXRjaFNlbGVjdG9yRm4oRWxlbWVudC5wcm90b3R5cGUsIFwicXVlcnlTZWxlY3RvckFsbFwiLCByZXdyaXRlU2VsZWN0b3IpO1xuICBwYXRjaFNlbGVjdG9yRm4oRWxlbWVudC5wcm90b3R5cGUsIFwibWF0Y2hlc1wiLCByZXdyaXRlU2VsZWN0b3IpO1xuICBwYXRjaFNlbGVjdG9yRm4oRWxlbWVudC5wcm90b3R5cGUsIFwiY2xvc2VzdFwiLCByZXdyaXRlU2VsZWN0b3IpO1xuICBwYXRjaFNlbGVjdG9yRm4oXG4gICAgRG9jdW1lbnRGcmFnbWVudC5wcm90b3R5cGUsXG4gICAgXCJxdWVyeVNlbGVjdG9yQWxsXCIsXG4gICAgcmV3cml0ZVNlbGVjdG9yXG4gICk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEhUTUxFbGVtZW50LnByb3RvdHlwZSwge1xuICAgIHBvcG92ZXI6IHtcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghdGhpcy5oYXNBdHRyaWJ1dGUoXCJwb3BvdmVyXCIpKSByZXR1cm4gbnVsbDtcbiAgICAgICAgY29uc3QgdmFsdWUgPSAodGhpcy5nZXRBdHRyaWJ1dGUoXCJwb3BvdmVyXCIpIHx8IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gXCJcIiB8fCB2YWx1ZSA9PSBcImF1dG9cIikgcmV0dXJuIFwiYXV0b1wiO1xuICAgICAgICBpZiAodmFsdWUgPT0gXCJoaW50XCIpIHJldHVybiBcImhpbnRcIjtcbiAgICAgICAgcmV0dXJuIFwibWFudWFsXCI7XG4gICAgICB9LFxuICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKFwicG9wb3ZlclwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcInBvcG92ZXJcIiwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBzaG93UG9wb3Zlcjoge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcbiAgICAgIHZhbHVlKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBzaG93UG9wb3Zlcih0aGlzKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGhpZGVQb3BvdmVyOiB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgdmFsdWUoKSB7XG4gICAgICAgIGhpZGVQb3BvdmVyKHRoaXMsIHRydWUsIHRydWUpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdG9nZ2xlUG9wb3Zlcjoge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHZhbHVlKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgb3B0aW9ucyA9IHsgZm9yY2U6IG9wdGlvbnMgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmlzaWJpbGl0eVN0YXRlLmdldCh0aGlzKSA9PT0gXCJzaG93aW5nXCIgJiYgb3B0aW9ucy5mb3JjZSA9PT0gdm9pZCAwIHx8IG9wdGlvbnMuZm9yY2UgPT09IGZhbHNlKSB7XG4gICAgICAgICAgaGlkZVBvcG92ZXIodGhpcywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5mb3JjZSA9PT0gdm9pZCAwIHx8IG9wdGlvbnMuZm9yY2UgPT09IHRydWUpIHtcbiAgICAgICAgICBzaG93UG9wb3Zlcih0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmlzaWJpbGl0eVN0YXRlLmdldCh0aGlzKSA9PT0gXCJzaG93aW5nXCI7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgY29uc3Qgb3JpZ2luYWxBdHRhY2hTaGFkb3cgPSBFbGVtZW50LnByb3RvdHlwZS5hdHRhY2hTaGFkb3c7XG4gIGlmIChvcmlnaW5hbEF0dGFjaFNoYWRvdykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEVsZW1lbnQucHJvdG90eXBlLCB7XG4gICAgICBhdHRhY2hTaGFkb3c6IHtcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWUob3B0aW9ucykge1xuICAgICAgICAgIGNvbnN0IHNoYWRvd1Jvb3QgPSBvcmlnaW5hbEF0dGFjaFNoYWRvdy5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICAgIGluamVjdFN0eWxlcyhzaGFkb3dSb290KTtcbiAgICAgICAgICByZXR1cm4gc2hhZG93Um9vdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGNvbnN0IG9yaWdpbmFsQXR0YWNoSW50ZXJuYWxzID0gSFRNTEVsZW1lbnQucHJvdG90eXBlLmF0dGFjaEludGVybmFscztcbiAgaWYgKG9yaWdpbmFsQXR0YWNoSW50ZXJuYWxzKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoSFRNTEVsZW1lbnQucHJvdG90eXBlLCB7XG4gICAgICBhdHRhY2hJbnRlcm5hbHM6IHtcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWUoKSB7XG4gICAgICAgICAgY29uc3QgaW50ZXJuYWxzID0gb3JpZ2luYWxBdHRhY2hJbnRlcm5hbHMuY2FsbCh0aGlzKTtcbiAgICAgICAgICBpZiAoaW50ZXJuYWxzLnNoYWRvd1Jvb3QpIHtcbiAgICAgICAgICAgIGluamVjdFN0eWxlcyhpbnRlcm5hbHMuc2hhZG93Um9vdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBpbnRlcm5hbHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBjb25zdCBwb3BvdmVyVGFyZ2V0QXNzb2NpYXRlZEVsZW1lbnRzID0gLyogQF9fUFVSRV9fICovIG5ldyBXZWFrTWFwKCk7XG4gIGZ1bmN0aW9uIGFwcGx5UG9wb3Zlckludm9rZXJFbGVtZW50TWl4aW4oRWxlbWVudENsYXNzKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoRWxlbWVudENsYXNzLnByb3RvdHlwZSwge1xuICAgICAgcG9wb3ZlclRhcmdldEVsZW1lbnQ6IHtcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBzZXQodGFyZ2V0RWxlbWVudCkge1xuICAgICAgICAgIGlmICh0YXJnZXRFbGVtZW50ID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShcInBvcG92ZXJ0YXJnZXRcIik7XG4gICAgICAgICAgICBwb3BvdmVyVGFyZ2V0QXNzb2NpYXRlZEVsZW1lbnRzLmRlbGV0ZSh0aGlzKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCEodGFyZ2V0RWxlbWVudCBpbnN0YW5jZW9mIEVsZW1lbnQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgICBgcG9wb3ZlclRhcmdldEVsZW1lbnQgbXVzdCBiZSBhbiBlbGVtZW50IG9yIG51bGxgXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcInBvcG92ZXJ0YXJnZXRcIiwgXCJcIik7XG4gICAgICAgICAgICBwb3BvdmVyVGFyZ2V0QXNzb2NpYXRlZEVsZW1lbnRzLnNldCh0aGlzLCB0YXJnZXRFbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICBpZiAodGhpcy5sb2NhbE5hbWUgIT09IFwiYnV0dG9uXCIgJiYgdGhpcy5sb2NhbE5hbWUgIT09IFwiaW5wdXRcIikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLmxvY2FsTmFtZSA9PT0gXCJpbnB1dFwiICYmIHRoaXMudHlwZSAhPT0gXCJyZXNldFwiICYmIHRoaXMudHlwZSAhPT0gXCJpbWFnZVwiICYmIHRoaXMudHlwZSAhPT0gXCJidXR0b25cIikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMuZm9ybSAmJiB0aGlzLnR5cGUgPT09IFwic3VibWl0XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gcG9wb3ZlclRhcmdldEFzc29jaWF0ZWRFbGVtZW50cy5nZXQodGhpcyk7XG4gICAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQgJiYgdGFyZ2V0RWxlbWVudC5pc0Nvbm5lY3RlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRhcmdldEVsZW1lbnQ7XG4gICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRFbGVtZW50ICYmICF0YXJnZXRFbGVtZW50LmlzQ29ubmVjdGVkKSB7XG4gICAgICAgICAgICBwb3BvdmVyVGFyZ2V0QXNzb2NpYXRlZEVsZW1lbnRzLmRlbGV0ZSh0aGlzKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCByb290ID0gZ2V0Um9vdE5vZGUodGhpcyk7XG4gICAgICAgICAgY29uc3QgaWRyZWYgPSB0aGlzLmdldEF0dHJpYnV0ZShcInBvcG92ZXJ0YXJnZXRcIik7XG4gICAgICAgICAgaWYgKChyb290IGluc3RhbmNlb2YgRG9jdW1lbnQgfHwgcm9vdCBpbnN0YW5jZW9mIFNoYWRvd1Jvb3QyKSAmJiBpZHJlZikge1xuICAgICAgICAgICAgcmV0dXJuIHJvb3QuZ2V0RWxlbWVudEJ5SWQoaWRyZWYpIHx8IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcG9wb3ZlclRhcmdldEFjdGlvbjoge1xuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9ICh0aGlzLmdldEF0dHJpYnV0ZShcInBvcG92ZXJ0YXJnZXRhY3Rpb25cIikgfHwgXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICBpZiAodmFsdWUgPT09IFwic2hvd1wiIHx8IHZhbHVlID09PSBcImhpZGVcIikgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIHJldHVybiBcInRvZ2dsZVwiO1xuICAgICAgICB9LFxuICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcInBvcG92ZXJ0YXJnZXRhY3Rpb25cIiwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgYXBwbHlQb3BvdmVySW52b2tlckVsZW1lbnRNaXhpbihIVE1MQnV0dG9uRWxlbWVudCk7XG4gIGFwcGx5UG9wb3Zlckludm9rZXJFbGVtZW50TWl4aW4oSFRNTElucHV0RWxlbWVudCk7XG4gIGNvbnN0IGhhbmRsZUludm9rZXJBY3RpdmF0aW9uID0gKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY29tcG9zZWRQYXRoID0gZXZlbnQuY29tcG9zZWRQYXRoKCk7XG4gICAgY29uc3QgdGFyZ2V0ID0gY29tcG9zZWRQYXRoWzBdO1xuICAgIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIEVsZW1lbnQpIHx8ICh0YXJnZXQgPT0gbnVsbCA/IHZvaWQgMCA6IHRhcmdldC5zaGFkb3dSb290KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCByb290ID0gZ2V0Um9vdE5vZGUodGFyZ2V0KTtcbiAgICBpZiAoIShyb290IGluc3RhbmNlb2YgU2hhZG93Um9vdDIgfHwgcm9vdCBpbnN0YW5jZW9mIERvY3VtZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBpbnZva2VyID0gY29tcG9zZWRQYXRoLmZpbmQoXG4gICAgICAoZWwpID0+IHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gKF9hID0gZWwubWF0Y2hlcykgPT0gbnVsbCA/IHZvaWQgMCA6IF9hLmNhbGwoZWwsIFwiW3BvcG92ZXJ0YXJnZXRhY3Rpb25dLFtwb3BvdmVydGFyZ2V0XVwiKTtcbiAgICAgIH1cbiAgICApO1xuICAgIGlmIChpbnZva2VyKSB7XG4gICAgICBwb3BvdmVyVGFyZ2V0QXR0cmlidXRlQWN0aXZhdGlvbkJlaGF2aW9yKGludm9rZXIpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG9uS2V5ZG93biA9IChldmVudCkgPT4ge1xuICAgIGNvbnN0IGtleSA9IGV2ZW50LmtleTtcbiAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgaWYgKCFldmVudC5kZWZhdWx0UHJldmVudGVkICYmIHRhcmdldCAmJiAoa2V5ID09PSBcIkVzY2FwZVwiIHx8IGtleSA9PT0gXCJFc2NcIikpIHtcbiAgICAgIGhpZGVBbGxQb3BvdmVyc1VudGlsKHRhcmdldC5vd25lckRvY3VtZW50LCB0cnVlLCB0cnVlKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGFkZEV2ZW50TGlzdGVuZXJzID0gKHJvb3QpID0+IHtcbiAgICByb290LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVJbnZva2VyQWN0aXZhdGlvbik7XG4gICAgcm9vdC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBvbktleWRvd24pO1xuICAgIHJvb3QuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIGxpZ2h0RGlzbWlzc09wZW5Qb3BvdmVycyk7XG4gICAgcm9vdC5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIGxpZ2h0RGlzbWlzc09wZW5Qb3BvdmVycyk7XG4gIH07XG4gIGFkZEV2ZW50TGlzdGVuZXJzKGRvY3VtZW50KTtcbiAgaW5qZWN0U3R5bGVzKGRvY3VtZW50KTtcbn1cblxuLy8gc3JjL2luZGV4LnRzXG5pZiAoIWlzU3VwcG9ydGVkKCkpIGFwcGx5KCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wb3BvdmVyLmpzLm1hcFxuIl0sInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLElBQUksY0FBYyxjQUFjLE1BQU07Q0FDcEM7Q0FDQTtDQUNBLFlBQVksTUFBTSxFQUFFLFdBQVcsSUFBSSxXQUFXLElBQUksR0FBRyxTQUFTLENBQUMsR0FBRztFQUNoRSxNQUFNLE1BQU0sSUFBSTtFQUNoQixLQUFLLFdBQVcsT0FBTyxZQUFZLEVBQUU7RUFDckMsS0FBSyxXQUFXLE9BQU8sWUFBWSxFQUFFO0NBQ3ZDO0FBQ0Y7QUFDQSxJQUFJLHlDQUF5QyxJQUFJLFFBQVE7QUFDekQsU0FBUyw0QkFBNEIsU0FBUyxVQUFVLFVBQVU7Q0FDaEUsdUJBQXVCLElBQ3JCLFNBQ0EsaUJBQWlCO0VBQ2YsSUFBSSxDQUFDLHVCQUF1QixJQUFJLE9BQU8sR0FBRztFQUMxQyxRQUFRLGNBQ04sSUFBSSxZQUFZLFVBQVU7R0FDeEIsWUFBWTtHQUNaO0dBQ0E7RUFDRixDQUFDLENBQ0g7Q0FDRixHQUFHLENBQUMsQ0FDTjtBQUNGO0FBR0EsSUFBSSxhQUFhLFdBQVcsY0FBYyxXQUFXLENBQ3JEO0FBQ0EsSUFBSSxvQkFBb0IsV0FBVyxxQkFBcUIsV0FBVyxDQUNuRTtBQUNBLElBQUksbUNBQW1DLElBQUksUUFBUTtBQUNuRCxJQUFJLGtDQUFrQyxJQUFJLFFBQVE7QUFDbEQsSUFBSSxrQ0FBa0MsSUFBSSxRQUFRO0FBQ2xELElBQUksa0NBQWtDLElBQUksUUFBUTtBQUNsRCxTQUFTLDBCQUEwQixTQUFTO0NBQzFDLE9BQU8sZ0JBQWdCLElBQUksT0FBTyxLQUFLO0FBQ3pDO0FBQ0EsSUFBSSxpQ0FBaUMsSUFBSSxRQUFRO0FBQ2pELFNBQVMsZUFBZSxL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