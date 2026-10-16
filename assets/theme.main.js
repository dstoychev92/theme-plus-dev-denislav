
/*
* @license
* PIPELINE Theme (c) Groupthought Themes
*
* This file is included for advanced development by
* Shopify Agencies. Modified versions of the theme
* code are not supported by Shopify or Groupthought.
*
* Add any minor JS changes in assets/custom.js, this
* will make it easier to update the theme in the future.
*
*/
                  
import Alpine from 'alpinejs';
export * from 'tabbable';
import { animate, inView, transform, styleEffect, transformValue, motionValue, scroll } from 'motion';

(function() {
    const env = {"NODE_ENV":"production"};
    try {
        if (process) {
            process.env = Object.assign({}, process.env);
            Object.assign(process.env, env);
            return;
        }
    } catch (e) {} // avoid ReferenceError: process is not defined
    globalThis.process = { env:env };
})();

// packages/collapse/src/index.js
function src_default$5(Alpine) {
  Alpine.directive("collapse", collapse);
  collapse.inline = (el, { modifiers }) => {
    if (!modifiers.includes("min"))
      return;
    el._x_doShow = () => {
    };
    el._x_doHide = () => {
    };
  };
  function collapse(el, { modifiers }) {
    let duration = modifierValue(modifiers, "duration", 250) / 1e3;
    let floor = modifierValue(modifiers, "min", 0);
    let fullyHide = !modifiers.includes("min");
    if (!el._x_isShown)
      el.style.height = `${floor}px`;
    if (!el._x_isShown && fullyHide)
      el.hidden = true;
    if (!el._x_isShown)
      el.style.overflow = "hidden";
    let setFunction = (el2, styles) => {
      let revertFunction = Alpine.setStyles(el2, styles);
      return styles.height ? () => {
      } : revertFunction;
    };
    let transitionStyles = {
      transitionProperty: "height",
      transitionDuration: `${duration}s`,
      transitionTimingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    };
    el._x_transition = {
      in(before = () => {
      }, after = () => {
      }) {
        if (fullyHide)
          el.hidden = false;
        if (fullyHide)
          el.style.display = null;
        let current = el.getBoundingClientRect().height;
        el.style.height = "auto";
        let full = el.getBoundingClientRect().height;
        if (current === full) {
          current = floor;
        }
        Alpine.transition(el, Alpine.setStyles, {
          during: transitionStyles,
          start: { height: current + "px" },
          end: { height: full + "px" }
        }, () => el._x_isShown = true, () => {
          if (Math.abs(el.getBoundingClientRect().height - full) < 1) {
            el.style.overflow = null;
          }
        });
      },
      out(before = () => {
      }, after = () => {
      }) {
        let full = el.getBoundingClientRect().height;
        Alpine.transition(el, setFunction, {
          during: transitionStyles,
          start: { height: full + "px" },
          end: { height: floor + "px" }
        }, () => el.style.overflow = "hidden", () => {
          el._x_isShown = false;
          if (el.style.height == `${floor}px` && fullyHide) {
            el.style.display = "none";
            el.hidden = true;
          }
        });
      }
    };
  }
}
function modifierValue(modifiers, key, fallback) {
  if (modifiers.indexOf(key) === -1)
    return fallback;
  const rawValue = modifiers[modifiers.indexOf(key) + 1];
  if (!rawValue)
    return fallback;
  if (key === "duration") {
    let match = rawValue.match(/([0-9]+)ms/);
    if (match)
      return match[1];
  }
  if (key === "min") {
    let match = rawValue.match(/([0-9]+)px/);
    if (match)
      return match[1];
  }
  return rawValue;
}

// packages/collapse/builds/module.js
var module_default$5 = src_default$5;

// node_modules/tabbable/dist/index.esm.js
var candidateSelectors = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"];
var candidateSelector = /* @__PURE__ */ candidateSelectors.join(",");
var NoElement = typeof Element === "undefined";
var matches = NoElement ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function(element) {
  return element.getRootNode();
} : function(element) {
  return element.ownerDocument;
};
var getCandidates = function getCandidates2(el, includeContainer, filter) {
  var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
  if (includeContainer && matches.call(el, candidateSelector)) {
    candidates.unshift(el);
  }
  candidates = candidates.filter(filter);
  return candidates;
};
var getCandidatesIteratively = function getCandidatesIteratively2(elements, includeContainer, options) {
  var candidates = [];
  var elementsToCheck = Array.from(elements);
  while (elementsToCheck.length) {
    var element = elementsToCheck.shift();
    if (element.tagName === "SLOT") {
      var assigned = element.assignedElements();
      var content = assigned.length ? assigned : element.children;
      var nestedCandidates = getCandidatesIteratively2(content, true, options);
      if (options.flatten) {
        candidates.push.apply(candidates, nestedCandidates);
      } else {
        candidates.push({
          scope: element,
          candidates: nestedCandidates
        });
      }
    } else {
      var validCandidate = matches.call(element, candidateSelector);
      if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element))) {
        candidates.push(element);
      }
      var shadowRoot = element.shadowRoot || // check for an undisclosed shadow
      typeof options.getShadowRoot === "function" && options.getShadowRoot(element);
      var validShadowRoot = !options.shadowRootFilter || options.shadowRootFilter(element);
      if (shadowRoot && validShadowRoot) {
        var _nestedCandidates = getCandidatesIteratively2(shadowRoot === true ? element.children : shadowRoot.children, true, options);
        if (options.flatten) {
          candidates.push.apply(candidates, _nestedCandidates);
        } else {
          candidates.push({
            scope: element,
            candidates: _nestedCandidates
          });
        }
      } else {
        elementsToCheck.unshift.apply(elementsToCheck, element.children);
      }
    }
  }
  return candidates;
};
var getTabindex = function getTabindex2(node, isScope) {
  if (node.tabIndex < 0) {
    if ((isScope || /^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || node.isContentEditable) && isNaN(parseInt(node.getAttribute("tabindex"), 10))) {
      return 0;
    }
  }
  return node.tabIndex;
};
var sortOrderedTabbables = function sortOrderedTabbables2(a, b) {
  return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
};
var isInput = function isInput2(node) {
  return node.tagName === "INPUT";
};
var isHiddenInput = function isHiddenInput2(node) {
  return isInput(node) && node.type === "hidden";
};
var isDetailsWithSummary = function isDetailsWithSummary2(node) {
  var r = node.tagName === "DETAILS" && Array.prototype.slice.apply(node.children).some(function(child) {
    return child.tagName === "SUMMARY";
  });
  return r;
};
var getCheckedRadio = function getCheckedRadio2(nodes, form) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked && nodes[i].form === form) {
      return nodes[i];
    }
  }
};
var isTabbableRadio = function isTabbableRadio2(node) {
  if (!node.name) {
    return true;
  }
  var radioScope = node.form || getRootNode(node);
  var queryRadios = function queryRadios2(name) {
    return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
  };
  var radioSet;
  if (typeof window !== "undefined" && typeof window.CSS !== "undefined" && typeof window.CSS.escape === "function") {
    radioSet = queryRadios(window.CSS.escape(node.name));
  } else {
    try {
      radioSet = queryRadios(node.name);
    } catch (err) {
      console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", err.message);
      return false;
    }
  }
  var checked = getCheckedRadio(radioSet, node.form);
  return !checked || checked === node;
};
var isRadio = function isRadio2(node) {
  return isInput(node) && node.type === "radio";
};
var isNonTabbableRadio = function isNonTabbableRadio2(node) {
  return isRadio(node) && !isTabbableRadio(node);
};
var isZeroArea = function isZeroArea2(node) {
  var _node$getBoundingClie = node.getBoundingClientRect(), width = _node$getBoundingClie.width, height = _node$getBoundingClie.height;
  return width === 0 && height === 0;
};
var isHidden = function isHidden2(node, _ref) {
  var displayCheck = _ref.displayCheck, getShadowRoot = _ref.getShadowRoot;
  if (getComputedStyle(node).visibility === "hidden") {
    return true;
  }
  var isDirectSummary = matches.call(node, "details>summary:first-of-type");
  var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
  if (matches.call(nodeUnderDetails, "details:not([open]) *")) {
    return true;
  }
  var nodeRootHost = getRootNode(node).host;
  var nodeIsAttached = (nodeRootHost === null || nodeRootHost === void 0 ? void 0 : nodeRootHost.ownerDocument.contains(nodeRootHost)) || node.ownerDocument.contains(node);
  if (!displayCheck || displayCheck === "full") {
    if (typeof getShadowRoot === "function") {
      var originalNode = node;
      while (node) {
        var parentElement = node.parentElement;
        var rootNode = getRootNode(node);
        if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true) {
          return isZeroArea(node);
        } else if (node.assignedSlot) {
          node = node.assignedSlot;
        } else if (!parentElement && rootNode !== node.ownerDocument) {
          node = rootNode.host;
        } else {
          node = parentElement;
        }
      }
      node = originalNode;
    }
    if (nodeIsAttached) {
      return !node.getClientRects().length;
    }
  } else if (displayCheck === "non-zero-area") {
    return isZeroArea(node);
  }
  return false;
};
var isDisabledFromFieldset = function isDisabledFromFieldset2(node) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
    var parentNode = node.parentElement;
    while (parentNode) {
      if (parentNode.tagName === "FIELDSET" && parentNode.disabled) {
        for (var i = 0; i < parentNode.children.length; i++) {
          var child = parentNode.children.item(i);
          if (child.tagName === "LEGEND") {
            return matches.call(parentNode, "fieldset[disabled] *") ? true : !child.contains(node);
          }
        }
        return true;
      }
      parentNode = parentNode.parentElement;
    }
  }
  return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable2(options, node) {
  if (node.disabled || isHiddenInput(node) || isHidden(node, options) || // For a details element with a summary, the summary element gets the focus
  isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
    return false;
  }
  return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable2(options, node) {
  if (isNonTabbableRadio(node) || getTabindex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
    return false;
  }
  return true;
};
var isValidShadowRootTabbable = function isValidShadowRootTabbable2(shadowHostNode) {
  var tabIndex = parseInt(shadowHostNode.getAttribute("tabindex"), 10);
  if (isNaN(tabIndex) || tabIndex >= 0) {
    return true;
  }
  return false;
};
var sortByOrder = function sortByOrder2(candidates) {
  var regularTabbables = [];
  var orderedTabbables = [];
  candidates.forEach(function(item, i) {
    var isScope = !!item.scope;
    var element = isScope ? item.scope : item;
    var candidateTabindex = getTabindex(element, isScope);
    var elements = isScope ? sortByOrder2(item.candidates) : element;
    if (candidateTabindex === 0) {
      isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
    } else {
      orderedTabbables.push({
        documentOrder: i,
        tabIndex: candidateTabindex,
        item,
        isScope,
        content: elements
      });
    }
  });
  return orderedTabbables.sort(sortOrderedTabbables).reduce(function(acc, sortable) {
    sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
    return acc;
  }, []).concat(regularTabbables);
};
var tabbable = function tabbable2(el, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([el], options.includeContainer, {
      filter: isNodeMatchingSelectorTabbable.bind(null, options),
      flatten: false,
      getShadowRoot: options.getShadowRoot,
      shadowRootFilter: isValidShadowRootTabbable
    });
  } else {
    candidates = getCandidates(el, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
  }
  return sortByOrder(candidates);
};
var focusable = function focusable2(el, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([el], options.includeContainer, {
      filter: isNodeMatchingSelectorFocusable.bind(null, options),
      flatten: true,
      getShadowRoot: options.getShadowRoot
    });
  } else {
    candidates = getCandidates(el, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
  }
  return candidates;
};
var isTabbable = function isTabbable2(node, options) {
  options = options || {};
  if (!node) {
    throw new Error("No node provided");
  }
  if (matches.call(node, candidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorTabbable(options, node);
};
var focusableCandidateSelector = /* @__PURE__ */ candidateSelectors.concat("iframe").join(",");
var isFocusable = function isFocusable2(node, options) {
  options = options || {};
  if (!node) {
    throw new Error("No node provided");
  }
  if (matches.call(node, focusableCandidateSelector) === false) {
    return false;
  }
  return isNodeMatchingSelectorFocusable(options, node);
};

// node_modules/focus-trap/dist/focus-trap.esm.js
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var activeFocusTraps = function() {
  var trapQueue = [];
  return {
    activateTrap: function activateTrap(trap) {
      if (trapQueue.length > 0) {
        var activeTrap = trapQueue[trapQueue.length - 1];
        if (activeTrap !== trap) {
          activeTrap.pause();
        }
      }
      var trapIndex = trapQueue.indexOf(trap);
      if (trapIndex === -1) {
        trapQueue.push(trap);
      } else {
        trapQueue.splice(trapIndex, 1);
        trapQueue.push(trap);
      }
    },
    deactivateTrap: function deactivateTrap(trap) {
      var trapIndex = trapQueue.indexOf(trap);
      if (trapIndex !== -1) {
        trapQueue.splice(trapIndex, 1);
      }
      if (trapQueue.length > 0) {
        trapQueue[trapQueue.length - 1].unpause();
      }
    }
  };
}();
var isSelectableInput = function isSelectableInput2(node) {
  return node.tagName && node.tagName.toLowerCase() === "input" && typeof node.select === "function";
};
var isEscapeEvent = function isEscapeEvent2(e) {
  return e.key === "Escape" || e.key === "Esc" || e.keyCode === 27;
};
var isTabEvent = function isTabEvent2(e) {
  return e.key === "Tab" || e.keyCode === 9;
};
var delay = function delay2(fn) {
  return setTimeout(fn, 0);
};
var findIndex = function findIndex2(arr, fn) {
  var idx = -1;
  arr.every(function(value, i) {
    if (fn(value)) {
      idx = i;
      return false;
    }
    return true;
  });
  return idx;
};
var valueOrHandler = function valueOrHandler2(value) {
  for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }
  return typeof value === "function" ? value.apply(void 0, params) : value;
};
var getActualTarget = function getActualTarget2(event) {
  return event.target.shadowRoot && typeof event.composedPath === "function" ? event.composedPath()[0] : event.target;
};
var createFocusTrap = function createFocusTrap2(elements, userOptions) {
  var doc = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.document) || document;
  var config = _objectSpread2({
    returnFocusOnDeactivate: true,
    escapeDeactivates: true,
    delayInitialFocus: true
  }, userOptions);
  var state = {
    // containers given to createFocusTrap()
    // @type {Array<HTMLElement>}
    containers: [],
    // list of objects identifying tabbable nodes in `containers` in the trap
    // NOTE: it's possible that a group has no tabbable nodes if nodes get removed while the trap
    //  is active, but the trap should never get to a state where there isn't at least one group
    //  with at least one tabbable node in it (that would lead to an error condition that would
    //  result in an error being thrown)
    // @type {Array<{
    //   container: HTMLElement,
    //   tabbableNodes: Array<HTMLElement>, // empty if none
    //   focusableNodes: Array<HTMLElement>, // empty if none
    //   firstTabbableNode: HTMLElement|null,
    //   lastTabbableNode: HTMLElement|null,
    //   nextTabbableNode: (node: HTMLElement, forward: boolean) => HTMLElement|undefined
    // }>}
    containerGroups: [],
    // same order/length as `containers` list
    // references to objects in `containerGroups`, but only those that actually have
    //  tabbable nodes in them
    // NOTE: same order as `containers` and `containerGroups`, but __not necessarily__
    //  the same length
    tabbableGroups: [],
    nodeFocusedBeforeActivation: null,
    mostRecentlyFocusedNode: null,
    active: false,
    paused: false,
    // timer ID for when delayInitialFocus is true and initial focus in this trap
    //  has been delayed during activation
    delayInitialFocusTimer: void 0
  };
  var trap;
  var getOption = function getOption2(configOverrideOptions, optionName, configOptionName) {
    return configOverrideOptions && configOverrideOptions[optionName] !== void 0 ? configOverrideOptions[optionName] : config[configOptionName || optionName];
  };
  var findContainerIndex = function findContainerIndex2(element) {
    return state.containerGroups.findIndex(function(_ref) {
      var container = _ref.container, tabbableNodes = _ref.tabbableNodes;
      return container.contains(element) || // fall back to explicit tabbable search which will take into consideration any
      //  web components if the `tabbableOptions.getShadowRoot` option was used for
      //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
      //  look inside web components even if open)
      tabbableNodes.find(function(node) {
        return node === element;
      });
    });
  };
  var getNodeForOption = function getNodeForOption2(optionName) {
    var optionValue = config[optionName];
    if (typeof optionValue === "function") {
      for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        params[_key2 - 1] = arguments[_key2];
      }
      optionValue = optionValue.apply(void 0, params);
    }
    if (optionValue === true) {
      optionValue = void 0;
    }
    if (!optionValue) {
      if (optionValue === void 0 || optionValue === false) {
        return optionValue;
      }
      throw new Error("`".concat(optionName, "` was specified but was not a node, or did not return a node"));
    }
    var node = optionValue;
    if (typeof optionValue === "string") {
      node = doc.querySelector(optionValue);
      if (!node) {
        throw new Error("`".concat(optionName, "` as selector refers to no known node"));
      }
    }
    return node;
  };
  var getInitialFocusNode = function getInitialFocusNode2() {
    var node = getNodeForOption("initialFocus");
    if (node === false) {
      return false;
    }
    if (node === void 0) {
      if (findContainerIndex(doc.activeElement) >= 0) {
        node = doc.activeElement;
      } else {
        var firstTabbableGroup = state.tabbableGroups[0];
        var firstTabbableNode = firstTabbableGroup && firstTabbableGroup.firstTabbableNode;
        node = firstTabbableNode || getNodeForOption("fallbackFocus");
      }
    }
    if (!node) {
      throw new Error("Your focus-trap needs to have at least one focusable element");
    }
    return node;
  };
  var updateTabbableNodes = function updateTabbableNodes2() {
    state.containerGroups = state.containers.map(function(container) {
      var tabbableNodes = tabbable(container, config.tabbableOptions);
      var focusableNodes = focusable(container, config.tabbableOptions);
      return {
        container,
        tabbableNodes,
        focusableNodes,
        firstTabbableNode: tabbableNodes.length > 0 ? tabbableNodes[0] : null,
        lastTabbableNode: tabbableNodes.length > 0 ? tabbableNodes[tabbableNodes.length - 1] : null,
        /**
         * Finds the __tabbable__ node that follows the given node in the specified direction,
         *  in this container, if any.
         * @param {HTMLElement} node
         * @param {boolean} [forward] True if going in forward tab order; false if going
         *  in reverse.
         * @returns {HTMLElement|undefined} The next tabbable node, if any.
         */
        nextTabbableNode: function nextTabbableNode(node) {
          var forward = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
          var nodeIdx = focusableNodes.findIndex(function(n) {
            return n === node;
          });
          if (nodeIdx < 0) {
            return void 0;
          }
          if (forward) {
            return focusableNodes.slice(nodeIdx + 1).find(function(n) {
              return isTabbable(n, config.tabbableOptions);
            });
          }
          return focusableNodes.slice(0, nodeIdx).reverse().find(function(n) {
            return isTabbable(n, config.tabbableOptions);
          });
        }
      };
    });
    state.tabbableGroups = state.containerGroups.filter(function(group) {
      return group.tabbableNodes.length > 0;
    });
    if (state.tabbableGroups.length <= 0 && !getNodeForOption("fallbackFocus")) {
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
    }
  };
  var tryFocus = function tryFocus2(node) {
    if (node === false) {
      return;
    }
    if (node === doc.activeElement) {
      return;
    }
    if (!node || !node.focus) {
      tryFocus2(getInitialFocusNode());
      return;
    }
    node.focus({
      preventScroll: !!config.preventScroll
    });
    state.mostRecentlyFocusedNode = node;
    if (isSelectableInput(node)) {
      node.select();
    }
  };
  var getReturnFocusNode = function getReturnFocusNode2(previousActiveElement) {
    var node = getNodeForOption("setReturnFocus", previousActiveElement);
    return node ? node : node === false ? false : previousActiveElement;
  };
  var checkPointerDown = function checkPointerDown2(e) {
    var target = getActualTarget(e);
    if (findContainerIndex(target) >= 0) {
      return;
    }
    if (valueOrHandler(config.clickOutsideDeactivates, e)) {
      trap.deactivate({
        // if, on deactivation, we should return focus to the node originally-focused
        //  when the trap was activated (or the configured `setReturnFocus` node),
        //  then assume it's also OK to return focus to the outside node that was
        //  just clicked, causing deactivation, as long as that node is focusable;
        //  if it isn't focusable, then return focus to the original node focused
        //  on activation (or the configured `setReturnFocus` node)
        // NOTE: by setting `returnFocus: false`, deactivate() will do nothing,
        //  which will result in the outside click setting focus to the node
        //  that was clicked, whether it's focusable or not; by setting
        //  `returnFocus: true`, we'll attempt to re-focus the node originally-focused
        //  on activation (or the configured `setReturnFocus` node)
        returnFocus: config.returnFocusOnDeactivate && !isFocusable(target, config.tabbableOptions)
      });
      return;
    }
    if (valueOrHandler(config.allowOutsideClick, e)) {
      return;
    }
    e.preventDefault();
  };
  var checkFocusIn = function checkFocusIn2(e) {
    var target = getActualTarget(e);
    var targetContained = findContainerIndex(target) >= 0;
    if (targetContained || target instanceof Document) {
      if (targetContained) {
        state.mostRecentlyFocusedNode = target;
      }
    } else {
      e.stopImmediatePropagation();
      tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
    }
  };
  var checkTab = function checkTab2(e) {
    var target = getActualTarget(e);
    updateTabbableNodes();
    var destinationNode = null;
    if (state.tabbableGroups.length > 0) {
      var containerIndex = findContainerIndex(target);
      var containerGroup = containerIndex >= 0 ? state.containerGroups[containerIndex] : void 0;
      if (containerIndex < 0) {
        if (e.shiftKey) {
          destinationNode = state.tabbableGroups[state.tabbableGroups.length - 1].lastTabbableNode;
        } else {
          destinationNode = state.tabbableGroups[0].firstTabbableNode;
        }
      } else if (e.shiftKey) {
        var startOfGroupIndex = findIndex(state.tabbableGroups, function(_ref2) {
          var firstTabbableNode = _ref2.firstTabbableNode;
          return target === firstTabbableNode;
        });
        if (startOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target, false))) {
          startOfGroupIndex = containerIndex;
        }
        if (startOfGroupIndex >= 0) {
          var destinationGroupIndex = startOfGroupIndex === 0 ? state.tabbableGroups.length - 1 : startOfGroupIndex - 1;
          var destinationGroup = state.tabbableGroups[destinationGroupIndex];
          destinationNode = destinationGroup.lastTabbableNode;
        }
      } else {
        var lastOfGroupIndex = findIndex(state.tabbableGroups, function(_ref3) {
          var lastTabbableNode = _ref3.lastTabbableNode;
          return target === lastTabbableNode;
        });
        if (lastOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target))) {
          lastOfGroupIndex = containerIndex;
        }
        if (lastOfGroupIndex >= 0) {
          var _destinationGroupIndex = lastOfGroupIndex === state.tabbableGroups.length - 1 ? 0 : lastOfGroupIndex + 1;
          var _destinationGroup = state.tabbableGroups[_destinationGroupIndex];
          destinationNode = _destinationGroup.firstTabbableNode;
        }
      }
    } else {
      destinationNode = getNodeForOption("fallbackFocus");
    }
    if (destinationNode) {
      e.preventDefault();
      tryFocus(destinationNode);
    }
  };
  var checkKey = function checkKey2(e) {
    if (isEscapeEvent(e) && valueOrHandler(config.escapeDeactivates, e) !== false) {
      e.preventDefault();
      trap.deactivate();
      return;
    }
    if (isTabEvent(e)) {
      checkTab(e);
      return;
    }
  };
  var checkClick = function checkClick2(e) {
    var target = getActualTarget(e);
    if (findContainerIndex(target) >= 0) {
      return;
    }
    if (valueOrHandler(config.clickOutsideDeactivates, e)) {
      return;
    }
    if (valueOrHandler(config.allowOutsideClick, e)) {
      return;
    }
    e.preventDefault();
    e.stopImmediatePropagation();
  };
  var addListeners = function addListeners2() {
    if (!state.active) {
      return;
    }
    activeFocusTraps.activateTrap(trap);
    state.delayInitialFocusTimer = config.delayInitialFocus ? delay(function() {
      tryFocus(getInitialFocusNode());
    }) : tryFocus(getInitialFocusNode());
    doc.addEventListener("focusin", checkFocusIn, true);
    doc.addEventListener("mousedown", checkPointerDown, {
      capture: true,
      passive: false
    });
    doc.addEventListener("touchstart", checkPointerDown, {
      capture: true,
      passive: false
    });
    doc.addEventListener("click", checkClick, {
      capture: true,
      passive: false
    });
    doc.addEventListener("keydown", checkKey, {
      capture: true,
      passive: false
    });
    return trap;
  };
  var removeListeners = function removeListeners2() {
    if (!state.active) {
      return;
    }
    doc.removeEventListener("focusin", checkFocusIn, true);
    doc.removeEventListener("mousedown", checkPointerDown, true);
    doc.removeEventListener("touchstart", checkPointerDown, true);
    doc.removeEventListener("click", checkClick, true);
    doc.removeEventListener("keydown", checkKey, true);
    return trap;
  };
  trap = {
    get active() {
      return state.active;
    },
    get paused() {
      return state.paused;
    },
    activate: function activate(activateOptions) {
      if (state.active) {
        return this;
      }
      var onActivate = getOption(activateOptions, "onActivate");
      var onPostActivate = getOption(activateOptions, "onPostActivate");
      var checkCanFocusTrap = getOption(activateOptions, "checkCanFocusTrap");
      if (!checkCanFocusTrap) {
        updateTabbableNodes();
      }
      state.active = true;
      state.paused = false;
      state.nodeFocusedBeforeActivation = doc.activeElement;
      if (onActivate) {
        onActivate();
      }
      var finishActivation = function finishActivation2() {
        if (checkCanFocusTrap) {
          updateTabbableNodes();
        }
        addListeners();
        if (onPostActivate) {
          onPostActivate();
        }
      };
      if (checkCanFocusTrap) {
        checkCanFocusTrap(state.containers.concat()).then(finishActivation, finishActivation);
        return this;
      }
      finishActivation();
      return this;
    },
    deactivate: function deactivate(deactivateOptions) {
      if (!state.active) {
        return this;
      }
      var options = _objectSpread2({
        onDeactivate: config.onDeactivate,
        onPostDeactivate: config.onPostDeactivate,
        checkCanReturnFocus: config.checkCanReturnFocus
      }, deactivateOptions);
      clearTimeout(state.delayInitialFocusTimer);
      state.delayInitialFocusTimer = void 0;
      removeListeners();
      state.active = false;
      state.paused = false;
      activeFocusTraps.deactivateTrap(trap);
      var onDeactivate = getOption(options, "onDeactivate");
      var onPostDeactivate = getOption(options, "onPostDeactivate");
      var checkCanReturnFocus = getOption(options, "checkCanReturnFocus");
      var returnFocus = getOption(options, "returnFocus", "returnFocusOnDeactivate");
      if (onDeactivate) {
        onDeactivate();
      }
      var finishDeactivation = function finishDeactivation2() {
        delay(function() {
          if (returnFocus) {
            tryFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation));
          }
          if (onPostDeactivate) {
            onPostDeactivate();
          }
        });
      };
      if (returnFocus && checkCanReturnFocus) {
        checkCanReturnFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation)).then(finishDeactivation, finishDeactivation);
        return this;
      }
      finishDeactivation();
      return this;
    },
    pause: function pause() {
      if (state.paused || !state.active) {
        return this;
      }
      state.paused = true;
      removeListeners();
      return this;
    },
    unpause: function unpause() {
      if (!state.paused || !state.active) {
        return this;
      }
      state.paused = false;
      updateTabbableNodes();
      addListeners();
      return this;
    },
    updateContainerElements: function updateContainerElements(containerElements) {
      var elementsAsArray = [].concat(containerElements).filter(Boolean);
      state.containers = elementsAsArray.map(function(element) {
        return typeof element === "string" ? doc.querySelector(element) : element;
      });
      if (state.active) {
        updateTabbableNodes();
      }
      return this;
    }
  };
  trap.updateContainerElements(elements);
  return trap;
};

// packages/focus/src/index.js
function src_default$4(Alpine) {
  let lastFocused;
  let currentFocused;
  window.addEventListener("focusin", () => {
    lastFocused = currentFocused;
    currentFocused = document.activeElement;
  });
  Alpine.magic("focus", (el) => {
    let within = el;
    return {
      __noscroll: false,
      __wrapAround: false,
      within(el2) {
        within = el2;
        return this;
      },
      withoutScrolling() {
        this.__noscroll = true;
        return this;
      },
      noscroll() {
        this.__noscroll = true;
        return this;
      },
      withWrapAround() {
        this.__wrapAround = true;
        return this;
      },
      wrap() {
        return this.withWrapAround();
      },
      focusable(el2) {
        return isFocusable(el2);
      },
      previouslyFocused() {
        return lastFocused;
      },
      lastFocused() {
        return lastFocused;
      },
      focused() {
        return currentFocused;
      },
      focusables() {
        if (Array.isArray(within))
          return within;
        return focusable(within, { displayCheck: "none" });
      },
      all() {
        return this.focusables();
      },
      isFirst(el2) {
        let els = this.all();
        return els[0] && els[0].isSameNode(el2);
      },
      isLast(el2) {
        let els = this.all();
        return els.length && els.slice(-1)[0].isSameNode(el2);
      },
      getFirst() {
        return this.all()[0];
      },
      getLast() {
        return this.all().slice(-1)[0];
      },
      getNext() {
        let list = this.all();
        let current = document.activeElement;
        if (list.indexOf(current) === -1)
          return;
        if (this.__wrapAround && list.indexOf(current) === list.length - 1) {
          return list[0];
        }
        return list[list.indexOf(current) + 1];
      },
      getPrevious() {
        let list = this.all();
        let current = document.activeElement;
        if (list.indexOf(current) === -1)
          return;
        if (this.__wrapAround && list.indexOf(current) === 0) {
          return list.slice(-1)[0];
        }
        return list[list.indexOf(current) - 1];
      },
      first() {
        this.focus(this.getFirst());
      },
      last() {
        this.focus(this.getLast());
      },
      next() {
        this.focus(this.getNext());
      },
      previous() {
        this.focus(this.getPrevious());
      },
      prev() {
        return this.previous();
      },
      focus(el2) {
        if (!el2)
          return;
        setTimeout(() => {
          if (!el2.hasAttribute("tabindex"))
            el2.setAttribute("tabindex", "0");
          el2.focus({ preventScroll: this.__noscroll });
        });
      }
    };
  });
  Alpine.directive("trap", Alpine.skipDuringClone(
    (el, { expression, modifiers }, { effect, evaluateLater, cleanup }) => {
      let evaluator = evaluateLater(expression);
      let oldValue = false;
      let options = {
        escapeDeactivates: false,
        allowOutsideClick: true,
        fallbackFocus: () => el
      };
      let undoInert = () => {
      };
      if (modifiers.includes("noautofocus")) {
        options.initialFocus = false;
      } else {
        let autofocusEl = el.querySelector("[autofocus]");
        if (autofocusEl)
          options.initialFocus = autofocusEl;
      }
      if (modifiers.includes("inert")) {
        options.onPostActivate = () => {
          Alpine.nextTick(() => {
            undoInert = setInert(el);
          });
        };
      }
      let trap = createFocusTrap(el, options);
      let undoDisableScrolling = () => {
      };
      const releaseFocus = () => {
        undoInert();
        undoInert = () => {
        };
        undoDisableScrolling();
        undoDisableScrolling = () => {
        };
        trap.deactivate({
          returnFocus: !modifiers.includes("noreturn")
        });
      };
      effect(() => evaluator((value) => {
        if (oldValue === value)
          return;
        if (value && !oldValue) {
          if (modifiers.includes("noscroll"))
            undoDisableScrolling = disableScrolling();
          setTimeout(() => {
            trap.activate();
          }, 15);
        }
        if (!value && oldValue) {
          releaseFocus();
        }
        oldValue = !!value;
      }));
      cleanup(releaseFocus);
    },
    // When cloning, we only want to add aria-hidden attributes to the
    // DOM and not try to actually trap, as trapping can mess with the
    // live DOM and isn't just isolated to the cloned DOM.
    (el, { expression, modifiers }, { evaluate }) => {
      if (modifiers.includes("inert") && evaluate(expression))
        setInert(el);
    }
  ));
}
function setInert(el) {
  let undos = [];
  crawlSiblingsUp(el, (sibling) => {
    let cache = sibling.hasAttribute("aria-hidden");
    sibling.setAttribute("aria-hidden", "true");
    undos.push(() => cache || sibling.removeAttribute("aria-hidden"));
  });
  return () => {
    while (undos.length)
      undos.pop()();
  };
}
function crawlSiblingsUp(el, callback) {
  if (el.isSameNode(document.body) || !el.parentNode)
    return;
  Array.from(el.parentNode.children).forEach((sibling) => {
    if (sibling.isSameNode(el)) {
      crawlSiblingsUp(el.parentNode, callback);
    } else {
      callback(sibling);
    }
  });
}
function disableScrolling() {
  let overflow = document.documentElement.style.overflow;
  let paddingRight = document.documentElement.style.paddingRight;
  let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.overflow = "hidden";
  document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
  return () => {
    document.documentElement.style.overflow = overflow;
    document.documentElement.style.paddingRight = paddingRight;
  };
}

// packages/focus/builds/module.js
var module_default$4 = src_default$4;
/*! Bundled license information:

tabbable/dist/index.esm.js:
  (*!
  * tabbable 5.3.3
  * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
  *)

focus-trap/dist/focus-trap.esm.js:
  (*!
  * focus-trap 6.9.4
  * @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
  *)
*/

// packages/morph/src/morph.js
function morph$1(from, toHtml, options) {
  monkeyPatchDomSetAttributeToAllowAtSymbols();
  let context = createMorphContext(options);
  let toEl = typeof toHtml === "string" ? createElement(toHtml) : toHtml;
  if (window.Alpine && window.Alpine.closestDataStack && !from._x_dataStack) {
    toEl._x_dataStack = window.Alpine.closestDataStack(from);
    toEl._x_dataStack && window.Alpine.cloneNode(from, toEl);
  }
  context.patch(from, toEl);
  return from;
}
function morphBetween(startMarker, endMarker, toHtml, options = {}) {
  monkeyPatchDomSetAttributeToAllowAtSymbols();
  let context = createMorphContext(options);
  let fromContainer = startMarker.parentNode;
  let fromBlock = new Block(startMarker, endMarker);
  let toContainer = typeof toHtml === "string" ? (() => {
    let container = document.createElement("div");
    container.insertAdjacentHTML("beforeend", toHtml);
    return container;
  })() : toHtml;
  let toStartMarker = document.createComment("[morph-start]");
  let toEndMarker = document.createComment("[morph-end]");
  toContainer.insertBefore(toStartMarker, toContainer.firstChild);
  toContainer.appendChild(toEndMarker);
  let toBlock = new Block(toStartMarker, toEndMarker);
  if (window.Alpine && window.Alpine.closestDataStack) {
    toContainer._x_dataStack = window.Alpine.closestDataStack(fromContainer);
    toContainer._x_dataStack && window.Alpine.cloneNode(fromContainer, toContainer);
  }
  context.patchChildren(fromBlock, toBlock);
}
function createMorphContext(options = {}) {
  let defaultGetKey = (el) => el.getAttribute("key");
  let noop = () => {
  };
  let context = {
    key: options.key || defaultGetKey,
    lookahead: options.lookahead || false,
    updating: options.updating || noop,
    updated: options.updated || noop,
    removing: options.removing || noop,
    removed: options.removed || noop,
    adding: options.adding || noop,
    added: options.added || noop
  };
  context.patch = function(from, to) {
    if (context.differentElementNamesTypesOrKeys(from, to)) {
      return context.swapElements(from, to);
    }
    let updateChildrenOnly = false;
    let skipChildren = false;
    let skipUntil = (predicate) => context.skipUntilCondition = predicate;
    if (shouldSkipChildren(context.updating, () => skipChildren = true, skipUntil, from, to, () => updateChildrenOnly = true))
      return;
    if (from.nodeType === 1 && window.Alpine) {
      window.Alpine.cloneNode(from, to);
      if (from._x_teleport && to._x_teleport) {
        context.patch(from._x_teleport, to._x_teleport);
      }
    }
    if (textOrComment(to)) {
      context.patchNodeValue(from, to);
      context.updated(from, to);
      return;
    }
    if (!updateChildrenOnly) {
      context.patchAttributes(from, to);
    }
    context.updated(from, to);
    if (!skipChildren) {
      context.patchChildren(from, to);
    }
  };
  context.differentElementNamesTypesOrKeys = function(from, to) {
    return from.nodeType != to.nodeType || from.nodeName != to.nodeName || context.getKey(from) != context.getKey(to);
  };
  context.swapElements = function(from, to) {
    if (shouldSkip(context.removing, from))
      return;
    let toCloned = to.cloneNode(true);
    if (shouldSkip(context.adding, toCloned))
      return;
    from.replaceWith(toCloned);
    context.removed(from);
    context.added(toCloned);
  };
  context.patchNodeValue = function(from, to) {
    let value = to.nodeValue;
    if (from.nodeValue !== value) {
      from.nodeValue = value;
    }
  };
  context.patchAttributes = function(from, to) {
    if (from._x_transitioning)
      return;
    if (from._x_isShown && !to._x_isShown) {
      return;
    }
    if (!from._x_isShown && to._x_isShown) {
      return;
    }
    let domAttributes = Array.from(from.attributes);
    let toAttributes = Array.from(to.attributes);
    for (let i = domAttributes.length - 1; i >= 0; i--) {
      let name = domAttributes[i].name;
      if (!to.hasAttribute(name)) {
        from.removeAttribute(name);
      }
    }
    for (let i = toAttributes.length - 1; i >= 0; i--) {
      let name = toAttributes[i].name;
      let value = toAttributes[i].value;
      if (from.getAttribute(name) !== value) {
        from.setAttribute(name, value);
      }
    }
  };
  context.patchChildren = function(from, to) {
    let fromKeys = context.keyToMap(from.children);
    let fromKeyHoldovers = {};
    let currentTo = getFirstNode(to);
    let currentFrom = getFirstNode(from);
    while (currentTo) {
      seedingMatchingId(currentTo, currentFrom);
      let toKey = context.getKey(currentTo);
      let fromKey = context.getKey(currentFrom);
      if (context.skipUntilCondition) {
        let fromDone = !currentFrom || context.skipUntilCondition(currentFrom);
        let toDone = !currentTo || context.skipUntilCondition(currentTo);
        if (fromDone && toDone) {
          context.skipUntilCondition = null;
        } else {
          if (!fromDone)
            currentFrom = currentFrom && getNextSibling(from, currentFrom);
          if (!toDone)
            currentTo = currentTo && getNextSibling(to, currentTo);
          continue;
        }
      }
      if (!currentFrom) {
        if (toKey && fromKeyHoldovers[toKey]) {
          let holdover = fromKeyHoldovers[toKey];
          from.appendChild(holdover);
          currentFrom = holdover;
          fromKey = context.getKey(currentFrom);
        } else {
          if (!shouldSkip(context.adding, currentTo)) {
            let clone = currentTo.cloneNode(true);
            from.appendChild(clone);
            context.added(clone);
          }
          currentTo = getNextSibling(to, currentTo);
          continue;
        }
      }
      let isIf = (node) => node && node.nodeType === 8 && node.textContent === "[if BLOCK]><![endif]";
      let isEnd = (node) => node && node.nodeType === 8 && node.textContent === "[if ENDBLOCK]><![endif]";
      if (isIf(currentTo) && isIf(currentFrom)) {
        let nestedIfCount = 0;
        let fromBlockStart = currentFrom;
        while (currentFrom) {
          let next = getNextSibling(from, currentFrom);
          if (isIf(next)) {
            nestedIfCount++;
          } else if (isEnd(next) && nestedIfCount > 0) {
            nestedIfCount--;
          } else if (isEnd(next) && nestedIfCount === 0) {
            currentFrom = next;
            break;
          }
          currentFrom = next;
        }
        let fromBlockEnd = currentFrom;
        nestedIfCount = 0;
        let toBlockStart = currentTo;
        while (currentTo) {
          let next = getNextSibling(to, currentTo);
          if (isIf(next)) {
            nestedIfCount++;
          } else if (isEnd(next) && nestedIfCount > 0) {
            nestedIfCount--;
          } else if (isEnd(next) && nestedIfCount === 0) {
            currentTo = next;
            break;
          }
          currentTo = next;
        }
        let toBlockEnd = currentTo;
        let fromBlock = new Block(fromBlockStart, fromBlockEnd);
        let toBlock = new Block(toBlockStart, toBlockEnd);
        context.patchChildren(fromBlock, toBlock);
        continue;
      }
      if (currentFrom.nodeType === 1 && context.lookahead && !currentFrom.isEqualNode(currentTo)) {
        let nextToElementSibling = getNextSibling(to, currentTo);
        let found = false;
        while (!found && nextToElementSibling) {
          if (nextToElementSibling.nodeType === 1 && currentFrom.isEqualNode(nextToElementSibling)) {
            found = true;
            currentFrom = context.addNodeBefore(from, currentTo, currentFrom);
            fromKey = context.getKey(currentFrom);
          }
          nextToElementSibling = getNextSibling(to, nextToElementSibling);
        }
      }
      if (toKey !== fromKey) {
        if (!toKey && fromKey) {
          fromKeyHoldovers[fromKey] = currentFrom;
          currentFrom = context.addNodeBefore(from, currentTo, currentFrom);
          fromKeyHoldovers[fromKey].remove();
          currentFrom = getNextSibling(from, currentFrom);
          currentTo = getNextSibling(to, currentTo);
          continue;
        }
        if (toKey && !fromKey) {
          if (fromKeys[toKey]) {
            currentFrom.replaceWith(fromKeys[toKey]);
            currentFrom = fromKeys[toKey];
            fromKey = context.getKey(currentFrom);
          }
        }
        if (toKey && fromKey) {
          let fromKeyNode = fromKeys[toKey];
          if (fromKeyNode) {
            fromKeyHoldovers[fromKey] = currentFrom;
            currentFrom.replaceWith(fromKeyNode);
            currentFrom = fromKeyNode;
            fromKey = context.getKey(currentFrom);
          } else {
            fromKeyHoldovers[fromKey] = currentFrom;
            currentFrom = context.addNodeBefore(from, currentTo, currentFrom);
            fromKeyHoldovers[fromKey].remove();
            currentFrom = getNextSibling(from, currentFrom);
            currentTo = getNextSibling(to, currentTo);
            continue;
          }
        }
      }
      let currentFromNext = currentFrom && getNextSibling(from, currentFrom);
      context.patch(currentFrom, currentTo);
      currentTo = currentTo && getNextSibling(to, currentTo);
      currentFrom = currentFromNext;
    }
    let removals = [];
    while (currentFrom) {
      if (!shouldSkip(context.removing, currentFrom))
        removals.push(currentFrom);
      currentFrom = getNextSibling(from, currentFrom);
    }
    while (removals.length) {
      let domForRemoval = removals.shift();
      domForRemoval.remove();
      context.removed(domForRemoval);
    }
  };
  context.getKey = function(el) {
    return el && el.nodeType === 1 && context.key(el);
  };
  context.keyToMap = function(els) {
    let map = {};
    for (let el of els) {
      let theKey = context.getKey(el);
      if (theKey) {
        map[theKey] = el;
      }
    }
    return map;
  };
  context.addNodeBefore = function(parent, node, beforeMe) {
    if (!shouldSkip(context.adding, node)) {
      let clone = node.cloneNode(true);
      parent.insertBefore(clone, beforeMe);
      context.added(clone);
      return clone;
    }
    return node;
  };
  return context;
}
morph$1.step = () => {
};
morph$1.log = () => {
};
function shouldSkip(hook, ...args) {
  let skip = false;
  hook(...args, () => skip = true);
  return skip;
}
function shouldSkipChildren(hook, skipChildren, skipUntil, ...args) {
  let skip = false;
  hook(...args, () => skip = true, skipChildren, skipUntil);
  return skip;
}
var patched = false;
function createElement(html) {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.content.firstElementChild;
}
function textOrComment(el) {
  return el.nodeType === 3 || el.nodeType === 8;
}
var Block = class {
  constructor(start, end) {
    this.startComment = start;
    this.endComment = end;
  }
  get children() {
    let children = [];
    let currentNode = this.startComment.nextSibling;
    while (currentNode && currentNode !== this.endComment) {
      children.push(currentNode);
      currentNode = currentNode.nextSibling;
    }
    return children;
  }
  appendChild(child) {
    this.endComment.before(child);
  }
  get firstChild() {
    let first = this.startComment.nextSibling;
    if (first === this.endComment)
      return;
    return first;
  }
  nextNode(reference) {
    let next = reference.nextSibling;
    if (next === this.endComment)
      return;
    return next;
  }
  insertBefore(newNode, reference) {
    reference.before(newNode);
    return newNode;
  }
};
function getFirstNode(parent) {
  return parent.firstChild;
}
function getNextSibling(parent, reference) {
  let next;
  if (parent instanceof Block) {
    next = parent.nextNode(reference);
  } else {
    next = reference.nextSibling;
  }
  return next;
}
function monkeyPatchDomSetAttributeToAllowAtSymbols() {
  if (patched)
    return;
  patched = true;
  let original = Element.prototype.setAttribute;
  let hostDiv = document.createElement("div");
  Element.prototype.setAttribute = function newSetAttribute(name, value) {
    if (!name.includes("@")) {
      return original.call(this, name, value);
    }
    hostDiv.innerHTML = `<span ${name}="${value}"></span>`;
    let attr = hostDiv.firstElementChild.getAttributeNode(name);
    hostDiv.firstElementChild.removeAttributeNode(attr);
    this.setAttributeNode(attr);
  };
}
function seedingMatchingId(to, from) {
  let fromId = from && from._x_bindings && from._x_bindings.id;
  if (!fromId)
    return;
  if (!to.setAttribute)
    return;
  to.setAttribute("id", fromId);
  to.id = fromId;
}

// packages/morph/src/index.js
function src_default$3(Alpine) {
  Alpine.morph = morph$1;
  Alpine.morphBetween = morphBetween;
}

// packages/morph/builds/module.js
var module_default$3 = src_default$3;

// packages/intersect/src/index.js
function src_default$2(Alpine) {
  Alpine.directive("intersect", Alpine.skipDuringClone((el, { value, expression, modifiers }, { evaluateLater, cleanup }) => {
    let evaluate = evaluateLater(expression);
    let options = {
      rootMargin: getRootMargin(modifiers),
      threshold: getThreshold(modifiers)
    };
    let observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting === (value === "leave"))
          return;
        evaluate();
        modifiers.includes("once") && observer.disconnect();
      });
    }, options);
    observer.observe(el);
    cleanup(() => {
      observer.disconnect();
    });
  }));
}
function getThreshold(modifiers) {
  if (modifiers.includes("full"))
    return 0.99;
  if (modifiers.includes("half"))
    return 0.5;
  if (!modifiers.includes("threshold"))
    return 0;
  let threshold = modifiers[modifiers.indexOf("threshold") + 1];
  if (threshold === "100")
    return 1;
  if (threshold === "0")
    return 0;
  return Number(`.${threshold}`);
}
function getLengthValue(rawValue) {
  let match = rawValue.match(/^(-?[0-9]+)(px|%)?$/);
  return match ? match[1] + (match[2] || "px") : void 0;
}
function getRootMargin(modifiers) {
  const key = "margin";
  const fallback = "0px 0px 0px 0px";
  const index = modifiers.indexOf(key);
  if (index === -1)
    return fallback;
  let values = [];
  for (let i = 1; i < 5; i++) {
    values.push(getLengthValue(modifiers[index + i] || ""));
  }
  values = values.filter((v) => v !== void 0);
  return values.length ? values.join(" ").trim() : fallback;
}

// packages/intersect/builds/module.js
var module_default$2 = src_default$2;

// packages/persist/src/index.js
function src_default$1(Alpine) {
  let persist = () => {
    let alias;
    let storage;
    try {
      storage = localStorage;
    } catch (e) {
      console.error(e);
      console.warn("Alpine: $persist is using temporary storage since localStorage is unavailable.");
      let dummy = /* @__PURE__ */ new Map();
      storage = {
        getItem: dummy.get.bind(dummy),
        setItem: dummy.set.bind(dummy)
      };
    }
    return Alpine.interceptor((initialValue, getter, setter, path, key) => {
      let lookup = alias || `_x_${path}`;
      let initial = storageHas(lookup, storage) ? storageGet(lookup, storage) : initialValue;
      setter(initial);
      Alpine.effect(() => {
        let value = getter();
        storageSet(lookup, value, storage);
        setter(value);
      });
      return initial;
    }, (func) => {
      func.as = (key) => {
        alias = key;
        return func;
      }, func.using = (target) => {
        storage = target;
        return func;
      };
    });
  };
  Object.defineProperty(Alpine, "$persist", { get: () => persist() });
  Alpine.magic("persist", persist);
  Alpine.persist = (key, { get, set }, storage = localStorage) => {
    let initial = storageHas(key, storage) ? storageGet(key, storage) : get();
    set(initial);
    Alpine.effect(() => {
      let value = get();
      storageSet(key, value, storage);
      set(value);
    });
  };
}
function storageHas(key, storage) {
  return storage.getItem(key) !== null;
}
function storageGet(key, storage) {
  let value = storage.getItem(key);
  if (value === void 0)
    return;
  return JSON.parse(value);
}
function storageSet(key, value, storage) {
  storage.setItem(key, JSON.stringify(value));
}

// packages/persist/builds/module.js
var module_default$1 = src_default$1;

// packages/resize/src/index.js
function src_default(Alpine) {
  Alpine.directive("resize", Alpine.skipDuringClone((el, { value, expression, modifiers }, { evaluateLater, cleanup }) => {
    let evaluator = evaluateLater(expression);
    let evaluate = (width, height) => {
      evaluator(() => {
      }, { scope: { "$width": width, "$height": height } });
    };
    let off = modifiers.includes("document") ? onDocumentResize(evaluate) : onElResize(el, evaluate);
    cleanup(() => off());
  }));
}
function onElResize(el, callback) {
  let observer = new ResizeObserver((entries) => {
    let [width, height] = dimensions(entries);
    callback(width, height);
  });
  observer.observe(el);
  return () => observer.disconnect();
}
var documentResizeObserver;
var documentResizeObserverCallbacks = /* @__PURE__ */ new Set();
function onDocumentResize(callback) {
  documentResizeObserverCallbacks.add(callback);
  if (!documentResizeObserver) {
    documentResizeObserver = new ResizeObserver((entries) => {
      let [width, height] = dimensions(entries);
      documentResizeObserverCallbacks.forEach((i) => i(width, height));
    });
    documentResizeObserver.observe(document.documentElement);
  }
  return () => {
    documentResizeObserverCallbacks.delete(callback);
  };
}
function dimensions(entries) {
  let width, height;
  for (let entry of entries) {
    width = entry.borderBoxSize[0].inlineSize;
    height = entry.borderBoxSize[0].blockSize;
  }
  return [width, height];
}

// packages/resize/builds/module.js
var module_default = src_default;

function isFormDataSubmitterSupported() {
    try {
        new FormData(document.createElement('form'), 
        // @ts-expect-error if FormData supports the submitter parameter, this will throw
        0);
    }
    catch (e) {
        return false;
    }
}
function isTouchEvent(e) {
    return e.pointerType === 'touch';
}
function isLeftMouseButton(e) {
    return e.button === 0;
}
/**
 * True for the primary pointer only (left mouse button, or primary touch point).
 * Filters out right-click and secondary touch points so only one press is active.
 * @see https://github.com/motiondivision/motion/blob/main/packages/motion-dom/src/gestures/utils/is-primary-pointer.ts
 */
function isPrimaryPointer(e) {
    if (e.pointerType === 'mouse') {
        return typeof e.button !== 'number' || e.button <= 0;
    }
    return e.isPrimary !== false;
}
const KEYBOARD_ACCESSIBLE_TAGS = new Set(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A']);
/**
 * True if the element is natively focusable (keyboard accessible without adding tabindex).
 * Used by press gesture to decide whether to set tabIndex = 0.
 */
function isElementKeyboardAccessible(el) {
    return KEYBOARD_ACCESSIBLE_TAGS.has(el.tagName) || el.isContentEditable === true;
}
/**
 * True if child is the same node as parent or a descendant of parent.
 */
function isNodeOrChild(parent, child) {
    if (!child)
        return false;
    if (parent === child)
        return true;
    return isNodeOrChild(parent, child.parentElement);
}
function isPopoverApiSupported() {
    return (typeof HTMLElement !== 'undefined' &&
        typeof HTMLElement.prototype === 'object' &&
        'popover' in HTMLElement.prototype);
}
function isDialogApiSupported() {
    return typeof HTMLDialogElement === 'function';
}
function isHoverSupported() {
    return !window.matchMedia('(any-hover: none)').matches;
}
/**
 * Returns an array of section IDs that have or contain an element having the data-cart-api-section attribute.
 * This is used to gather up all the sections that need to be updated when the cart API is called.
 */
function getCartApiSections() {
    return Array.from(document.querySelectorAll('.shopify-section:is(:has([data-cart-api-section]),[data-cart-api-section])')).map((section) => {
        return section.id.split('shopify-section-')[1];
    });
}
// Inspired by https://github.com/remix-run/react-router/blob/9afac15d8cbe30b37d0f9e8b89c9f1e430dfe35a/packages/react-router-dom/dom.ts#L250
function getFormSubmissionInfo(target, submitter) {
    let method;
    let action;
    let formData = undefined;
    let enctype = null;
    let defaultMethod = 'GET';
    if (isFormElement(target)) {
        action = target.action;
        method = target.getAttribute('method') || defaultMethod;
        enctype = target.getAttribute('enctype') || null;
        formData = new FormData(target, submitter || null);
    }
    else if (isButtonElement(target) ||
        (isInputElement(target) && (target.type === 'submit' || target.type === 'image'))) {
        let form = target.form;
        if (form == null) {
            throw new Error(`Cannot submit a <button> or <input type="submit"> without a <form>`);
        }
        let attr = target.formAction || form.action;
        action = attr;
        method = target.getAttribute('formmethod') || form.getAttribute('method') || defaultMethod;
        enctype = target.getAttribute('formenctype') || form.getAttribute('enctype') || null;
        // Build a FormData object populated from a form and submitter
        formData = new FormData(form, target);
        // If this browser doesn't support the `FormData(el, submitter)` format,
        // then tack on the submitter value at the end.  This is a lightweight
        // solution that is not 100% spec compliant.  For complete support in older
        // browsers, consider using the `formdata-submitter-polyfill` package
        if (!isFormDataSubmitterSupported()) {
            let { name, type, value } = target;
            if (type === 'image') {
                let prefix = name ? `${name}.` : '';
                formData.append(`${prefix}x`, '0');
                formData.append(`${prefix}y`, '0');
            }
            else if (name) {
                formData.append(name, value);
            }
        }
    }
    else if (isHtmlElement(target)) {
        throw new Error(`Cannot submit element that is not <form>, <button>, or ` + `<input type="submit|image">`);
    }
    else {
        method = defaultMethod;
        action = null;
        enctype = null;
    }
    return {
        action,
        method: method.toUpperCase(),
        formData,
        enctype,
    };
}
/**
 * Make a fetch request with the given form data submission info.
 */
async function submitFormData({ action, formData, method, enctype }, init) {
    switch (method) {
        case 'POST':
            if (enctype === 'application/json') {
                return fetch(action, Object.assign({ method: 'POST', headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        // Required for quantity checking on the cart endpoints....
                        'X-Requested-With': 'XMLHttpRequest',
                    }, body: JSON.stringify(serializeFormData(formData)) }, init));
            }
            else {
                return fetch(action, Object.assign({ method: 'POST', body: formData, headers: {
                        Accept: 'application/javascript',
                        // Required for quantity checking on the cart endpoints....
                        'X-Requested-With': 'XMLHttpRequest',
                    } }, init));
            }
        case 'GET':
            const url = `${action}?${new URLSearchParams(formData).toString()}`;
            return fetch(url, Object.assign({ method: 'GET', headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                } }, init));
        default:
            throw new Error(`Unsupported method: ${method}`);
    }
}
function isModifiedEvent(event) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
// Inspired by https://github.com/remix-run/react-router/blob/9afac15d8cbe30b37d0f9e8b89c9f1e430dfe35a/packages/react-router-dom/dom.ts#L36
function shouldProcessLinkClick(event, target) {
    return (event.button === 0 && // Ignore everything but left clicks
        (!target || target === '_self') && // Let browser handle "target=_blank" etc.
        !isModifiedEvent(event) // Ignore clicks with modifier keys
    );
}
// Check if clipboard.writeText() can execute to avoid throwing an error.
// Firefox does not support 'clipboard-write' in the permissions API, so default to true if unsupported.
function isClipboardWriteAllowed() {
    if (navigator.permissions && typeof navigator.permissions.query === 'function') {
        try {
            return navigator.permissions
                .query({ name: 'clipboard-write' })
                .then((result) => {
                // Permission denied
                if (result.state === 'denied')
                    return false;
                return result.state === 'granted' || result.state === 'prompt';
            })
                .catch(() => {
                // Permissions API is available but query failed (e.g. not supported for clipboard)
                // Firefox and others: fallback to assume it is allowed, since writeText will throw if not
                return true;
            });
        }
        catch (_a) {
            // Defensive: if query throws synchronously
            return Promise.resolve(true);
        }
    }
    // permissions API not available at all, assume allowed (since writeText will throw if not)
    return Promise.resolve(true);
}
function isHtmlElement(node) {
    return node != undefined && node != null && typeof node.tagName === 'string' && node.nodeType === Node.ELEMENT_NODE;
}
function isImageElement(node) {
    return isHtmlElement(node) && node.nodeName === 'IMG';
}
function isAnchorElement(node) {
    return isHtmlElement(node) && node.nodeName === 'A';
}
function isFormElement(node) {
    return isHtmlElement(node) && node.nodeName === 'FORM';
}
function isDialogElement(node) {
    return isHtmlElement(node) && node.nodeName === 'DIALOG';
}
function isInputElement(node) {
    return isHtmlElement(node) && node.nodeName === 'INPUT';
}
function isInputRangeElement(node) {
    return isHtmlElement(node) && node.nodeName === 'INPUT' && node.getAttribute('type') == 'range';
}
function isInputNumberElement(node) {
    return isHtmlElement(node) && node.nodeName === 'INPUT' && node.getAttribute('type') == 'number';
}
function isButtonElement(node) {
    return isHtmlElement(node) && node.nodeName === 'BUTTON';
}
function isTemplateElement(node) {
    return isHtmlElement(node) && node.nodeName === 'TEMPLATE';
}
function isShopifyAppBlock(el) {
    return isHtmlElement(el) && el.classList.contains('shopify-app-block');
}
function isShopifyElement(el) {
    return isHtmlElement(el) && el.hasAttribute('data-shopify');
}
function getWritingDirection(el) {
    return getComputedStyle(el).direction;
}
/**
 * Serializes a FormData object into a JSON object
 * @param formData - The form data to serialize
 * @returns
 */
function serializeFormData(formData) {
    const result = {};
    for (const [key, value] of formData.entries()) {
        // Split the key into parts by brackets
        const parts = key.match(/([^\[\]]+)/g) || [key];
        let current = result;
        // Traverse through all parts except the last one
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            // Create nested object if it doesn't exist
            current[part] = current[part] || {};
            current = current[part];
        }
        // Set the value at the final level
        const lastPart = parts[parts.length - 1];
        current[lastPart] = value;
    }
    return result;
}
/**
 * Checks if a click event is occurring outside of a container element
 * @param event
 * @param container
 * @returns
 */
function isClickingOutside(event, container) {
    // If the event target is not an element, then use it's coordinates to check if it's outside the element
    if (event.target instanceof HTMLDialogElement || !(event.target instanceof Element)) {
        return !isPointWithinElement(event.clientX, event.clientY, container);
    }
    // Using `event.composedPath` tells us whether the element _is or was_ contained in the container
    // when the click event was triggered. This is opposed to e.g. `element.contains(event.target)` which would
    // only check if the element _is_ contained in the container at the time the check is made. This
    // would fail if for instance the contents of the container were changed after the click event was triggered but
    // before the check is made.
    return !event.composedPath().includes(container);
}
/**
 * Checks if a point is within an element
 * @param x - The x coordinate of the point
 * @param y - The y coordinate of the point
 * @param element - The element to check
 * @returns True if the point is within the element, false otherwise
 */
function isPointWithinElement(x, y, element) {
    const { left, right, top, bottom } = element.getBoundingClientRect();
    return x >= left && x <= right && y >= top && y <= bottom;
}

function cache (Alpine) {
    Alpine.store('cache', cacheStore());
    Alpine.directive('cache', ($el, { modifiers, expression }, { Alpine, evaluate }) => {
        var _a;
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if ($el.nodeName !== 'SCRIPT') {
            throw new Error('Can only be used on script tags');
        }
        // Do nothing if the script tag is empty
        if (((_a = $el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) == '') {
            return;
        }
        let json;
        try {
            json = JSON.parse($el.textContent || '{}');
        }
        catch (e) {
            throw new Error(`Could not parse ${$el.textContent} as JSON: ${e}`);
        }
        const resourceName = modifiers[0];
        if (!resourceName) {
            throw new Error('Must specify a store to cache to e.g. x-cache.products');
        }
        const cache = Alpine.store('cache').resources;
        const cacheResource = cache[resourceName];
        if (!cacheResource) {
            throw new Error(`Could not find resource named ${resourceName}. Did you define it in the cache store?`);
        }
        if (expression) {
            const cacheKey = evaluate(expression);
            cacheResource.set(cacheKey, json);
        }
        else {
            if (isSingletonResource(cacheResource)) {
                cacheResource.set(json);
            }
            else {
                cacheResource.upsert(json);
            }
        }
    }).before('bind');
    Alpine.magic('cache', () => {
        return Alpine.store('cache').resources;
    });
}
function isSingletonResource(x) {
    if ('isSingleton' in x && x.isSingleton) {
        return true;
    }
    return false;
}
// TODO test me and document me
function buildResource(builder) {
    return {
        records: {},
        set(key, value) {
            this.records[key] = value;
        },
        populate(records) {
            this.records = records;
        },
        upsert(records) {
            this.records = Object.assign(Object.assign({}, this.records), records);
        },
        evict(key) {
            delete this.records[key];
        },
        reset() {
            this.records = {};
        },
        get(key) {
            const result = this.records[key];
            if (!result) {
                return null;
            }
            if (builder) {
                return builder(result);
            }
            return result;
        },
        get isSingleton() {
            return false;
        },
    };
}
// TODO test me and document me
function buildSingletonResource(builder) {
    return {
        record: null,
        set(value) {
            this.record = value;
        },
        evict() {
            this.record = null;
        },
        reset() {
            this.record = null;
        },
        get() {
            const result = this.record;
            if (!result) {
                return null;
            }
            if (builder) {
                return builder(result);
            }
            return result;
        },
        get isSingleton() {
            return true;
        },
    };
}
function cacheStore() {
    return {
        resources: {},
        reset() {
            Object.keys(this.resources).forEach((key) => {
                this.resources[key].reset();
            });
        },
        addResource(key, options) {
            if (options === null || options === void 0 ? void 0 : options.singleton) {
                this.resources[key] = buildSingletonResource(options === null || options === void 0 ? void 0 : options.builder);
            }
            else {
                this.resources[key] = buildResource(options === null || options === void 0 ? void 0 : options.builder);
            }
        },
    };
}

function isString(x) {
    return typeof x === 'string';
}

function isPlainObject(x) {
    return typeof x === 'object' && x !== null && !Array.isArray(x) && !(x instanceof Date);
}
/**
 * Similar to Object.assign except that it uses property descriptors to copy both enumerable and non-enumerable properties
 * from source objects onto the target object so that getters/setters, etc still work properly
 * @param target
 * @param source
 * @returns
 */
function mergeProperties(target, ...sources) {
    let santizedSources = sources.filter(Boolean).reverse();
    let newObject = Object.defineProperties({}, Object.getOwnPropertyDescriptors(target));
    for (const source of santizedSources) {
        Object.defineProperties(newObject, Object.getOwnPropertyDescriptors(source));
    }
    return newObject;
}
/**
 * Renames a property on an object and deletes the old property, all while preserving the property descriptor (e.g. getters/setters)
 * @param obj
 * @param oldName
 * @param newName
 */
function renameProperty(obj, oldName, newName) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, oldName);
    if (!descriptor)
        throw new Error(`Property ${String(oldName)} not found on object`);
    Object.defineProperty(obj, newName, descriptor);
    delete obj[oldName];
}
/**
 * Copy a property on an object and deletes the old property, all while preserving the property descriptor (e.g. getters/setters)
 * @param obj - The object to copy the property from
 * @param newObj - The object to copy the property to
 * @param oldName - The name of the property to copy
 * @param optionalNewName - The new name of the property (optional, defaults to oldName)
 */
function copyProperty(obj, newObj, oldName, optionalNewName) {
    const newName = optionalNewName !== null && optionalNewName !== void 0 ? optionalNewName : oldName;
    const descriptor = Object.getOwnPropertyDescriptor(obj, oldName);
    if (!descriptor)
        throw new Error(`Property ${String(oldName)} not found on object`);
    Object.defineProperty(newObj, newName, descriptor);
}
function trackProperty(obj, key, trackingKey) {
    return new Proxy(obj, {
        set(target, prop, value, receiver) {
            if (prop == key) {
                receiver[trackingKey] = receiver[key];
            }
            return Reflect.set(target, prop, value, receiver);
        },
    });
}

function isFunction(x) {
    return typeof x === 'function';
}

/**
 * Returns the modulo of n and m handling negative numbers correctly
 *
 * e.g.
 * mod(1, 5) = 1
 * mod(7, 5) = 2
 * mod(-1, 5) = 4
 * @param n
 * @param m
 * @returns
 */
function mod(n, m) {
    return ((n % m) + m) % m;
}
/**
 * Returns the value clamped between min and max
 * @param n
 * @param min
 * @param max
 * @returns
 */
function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
}
/**
 * Emulates how browsers round scroll values which is to the nearest 0 or half integer
 * e.g. 0.1 => 0.0, 0.9 => 0.5..., 0.0 => 0, 1.0 => 1
 */
function toScrollValue(value) {
    return Math.floor(value) + Math.round((value - Math.floor(value)) * 2) / 2;
}
/**
 * Return whether a string is numeric
 * @param value
 * @returns
 */
function isNumeric(value) {
    if (typeof value == 'number')
        return true;
    return (!isNaN(value) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(value))); // ...and ensure strings of whitespace fail
}

/**
 * Returns the containing section element of the current element, or the current element if it is a section
 */
function closestSectionEl($el) {
    if (!isHtmlElement($el)) {
        throw new Error(`Expected HTMLElement but got ${$el}`);
    }
    if ($el.classList.contains('shopify-section')) {
        return $el;
    }
    return $el.closest('.shopify-section');
}

/**
 * StateMachine: A generic finite state machine implementation.
 *
 * A state machine is a conceptual model used to design systems and applications. It consists of a finite set of states and
 * transitions between those states, often driven by events. State machines are ideal for situations where an application or system
 * can be thought of as having distinct states with well-defined transitions, such as user interfaces, protocols, and life cycles.
 *
 * @template TStates A tuple of string literals representing the possible states.
 * @template TTransitions A mapping of each state to an array of states to which it can transition.
 * @template TState The current state of the machine, must be one of TStates.
 *
 * The `StateMachine` class provides mechanisms to manage states, transitions, and listeners that react to state changes.
 *
 * Usage example:
 *
 * // Define states and transitions
 * const states = ['idle', 'loading', 'success', 'error'] as const;
 * const transitions = {
 *   idle: ['loading'],
 *   loading: ['success', 'error'],
 *   success: ['idle'],
 *   error: ['idle'],
 * };
 *
 * // Create a state machine
 * const machine = new StateMachine('idle', states, transitions);
 *
 * // Listen for state changes
 * machine.on((newState, prevState) => {
 *   console.log(`Transitioned from ${prevState} to ${newState}`);
 * });
 *
 * // Change state
 * machine.state = 'loading';
 *
 * Features:
 * - Strongly typed states and transitions ensure only valid state changes are possible.
 * - Event listeners for state changes, to react to or log transitions.
 * - Custom error handling for invalid transitions.
 *
 * The class manages the current state privately and allows state changes only through the state setter,
 * which checks for valid transitions and notifies listeners.
 */
class StateMachine {
    /**
     * Initializes the state machine with the specified initial state, possible states, and valid transitions.
     *
     * @param initialState The starting state of the state machine.
     * @param states An array of possible states the state machine can be in.
     * @param transitions A record mapping each state to an array of states to which it can transition.
     *
     */
    constructor(initialState, states, transitions) {
        this._prevState = null;
        this.listeners = [];
        this._state = initialState;
        this.states = states;
        this.transitions = transitions;
    }
    /**
     *  Attempts to transition the state machine to a new state. Validates the transition against the defined rules
     *  and, if valid, updates the state and triggers the listeners. Throws an error if the transition is invalid.
     */
    set state(newState) {
        const validTransitions = intersectArrays(this.states, this.transitions[this._state] || []);
        if (validTransitions.includes(newState)) {
            let prevState = this._state;
            this._prevState = prevState;
            this._state = newState;
            this.listeners.forEach((listener) => listener(newState, prevState));
        }
        else {
            throw new Error(`Invalid transition from ${this._state} to ${newState}`);
        }
    }
    /**
     * Transitions the state machine to a new state, but only temporarily. After the specified timeout, the state will transition to the next state
     * This method is useful for UI interactions that should only be visible for a short period of time, such as a success message after a form submission.
     */
    setTransientState(transientState, nextState, timeout) {
        return new Promise((resolve) => {
            // Transition to the transient state immediately
            this._state = transientState;
            // Then, after a timeout, transition to the next state
            setTimeout(() => {
                this._state = nextState;
                resolve();
            }, timeout);
        });
    }
    /**
     * Returns the current state of the state machine.
     */
    get state() {
        return this._state;
    }
    /**
     * Returns the previous state of the state machine (if this is the initial state it will return null)
     */
    get prevState() {
        return this._prevState;
    }
    /**
     * Registers a new listener function to be called when the state changes.
     * @param listener
     */
    on(listener) {
        this.listeners.push(listener);
    }
    /**
     * Removes a previously registered listener function so that it will no longer be called on state changes.
     * @param listener
     */
    off(listener) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }
}
function intersectArrays(arr1, arr2) {
    const set2 = new Set(arr2);
    return arr1.filter((x) => set2.has(x));
}

function hasConnection(navigator) {
    return 'connection' in navigator;
}
function isSavingData() {
    var _a;
    if (hasConnection(navigator)) {
        return (_a = navigator.connection) === null || _a === void 0 ? void 0 : _a.saveData;
    }
    return undefined;
}
function isSlowConnection() {
    var _a;
    if (hasConnection(navigator)) {
        return (_a = navigator.connection) === null || _a === void 0 ? void 0 : _a.effectiveType.match(/(2g)/);
    }
    return undefined;
}

/**
 * Returns a promise that resolves after yielding to the main thread.
 * See: https://web.dev/articles/optimize-long-tasks#scheduler-yield
 */
function yieldToMain() {
    var _a;
    if ('scheduler' in window && typeof ((_a = window.scheduler) === null || _a === void 0 ? void 0 : _a.yield) === 'function') {
        return window.scheduler.yield();
    }
    // Fall back to yielding with setTimeout.
    return new Promise((resolve) => {
        setTimeout(resolve, 0);
    });
}

const DEFAULT_LIST_STATE_NAME = 'listState';
/**
 * TODO docs
 */
function listState (Alpine) {
    Alpine.directive('list-state', ($el, { value, expression, modifiers }, { evaluate }) => {
        if (value == 'item') {
            const $data = Alpine.$data($el);
            let scope = `$${DEFAULT_LIST_STATE_NAME}`;
            if (modifiers.includes('for') && modifiers.length >= 2) {
                const forIndex = modifiers.indexOf('for');
                scope = `$${modifiers[forIndex + 1]}`;
            }
            if (!(scope in $data)) {
                throw new Error(`x-list-state:item must be used within x-list-state directive. To register an item in a scoped list state, use $myScopeName.register($el)`);
            }
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        init() {
                            $data[scope].register(this.$el);
                        },
                        destroy() {
                            $data[scope].unregister(this.$el);
                        },
                    };
                },
            });
        }
        else if (value == null) {
            let options = {};
            let scope = `$${DEFAULT_LIST_STATE_NAME}`;
            if (modifiers.includes('as') && modifiers.length >= 2) {
                const asIndex = modifiers.indexOf('as');
                scope = `$${modifiers[asIndex + 1]}`;
            }
            if (expression) {
                let evalutatedExpression = evaluate(expression === '' ? '{}' : expression);
                if (isPlainObject(evalutatedExpression)) {
                    options = evalutatedExpression;
                    if (options.scope) {
                        scope = `$${options.scope}`;
                    }
                }
            }
            let state;
            if (options.multiple || modifiers.includes('multiple')) {
                options = options;
                if (options === null || options === void 0 ? void 0 : options.selectedIndices) {
                    if (!(options.selectedIndices instanceof Set)) {
                        throw new Error('selectedIndices must be a Set');
                    }
                }
                state = buildMultiSelectListState(options);
            }
            else {
                options = options;
                state = buildSingleSelectListState(options);
            }
            Alpine.addScopeToNode($el, {
                [scope]: Alpine.reactive(state),
            });
        }
        else {
            throw new Error(`Unknown directive: x-list-state:${value}`);
        }
    }).before('bind');
}
function buildSingleSelectListState(options) {
    let state = {
        previousSelectedIndex: null,
        selectedIndex: null,
        items: new Set(),
        get totalItems() {
            return this.items.size;
        },
        isSelected(index) {
            return this.selectedIndex == index;
        },
        register(el) {
            this.items.add(el);
        },
        unregister(el) {
            this.items.delete(el);
        },
        indexOf(el) {
            return Array.from(this.items).indexOf(el);
        },
        toggle(index) {
            this.selectedIndex == index ? this.deselect(index) : this.select(index);
        },
        select(index) {
            this.selectedIndex = index;
        },
        deselect(index) {
            if (this.selectedIndex == index) {
                this.selectedIndex = null;
            }
        },
    };
    if ('selectedIndex' in options) {
        copyProperty(options, state, 'selectedIndex');
    }
    return state;
}
function buildMultiSelectListState(options) {
    let state = {
        selectedIndices: new Set(),
        items: new Set(),
        get totalItems() {
            return this.items.size;
        },
        isSelected(index) {
            return this.selectedIndices.has(index);
        },
        register(el) {
            this.items.add(el);
        },
        unregister(el) {
            this.items.delete(el);
        },
        indexOf(el) {
            return Array.from(this.items).indexOf(el);
        },
        toggle(index) {
            this.selectedIndices.has(index) ? this.deselect(index) : this.select(index);
        },
        select(index) {
            const selected = this.selectedIndices;
            selected.add(index);
            // Copy to a new set so that reactivity works
            this.selectedIndices = new Set(Array.from(selected));
        },
        deselect(index) {
            const selected = this.selectedIndices;
            selected.delete(index);
            // Copy to a new set so that reactivity works
            this.selectedIndices = new Set(Array.from(selected));
        },
    };
    if ('selectedIndices' in options) {
        copyProperty(options, state, 'selectedIndices');
    }
    return state;
}

/**
 * Adds roving tab pattern on an elements focusable descendants
 *
 * See https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex for more info about roving tab pattern
 *
 * @example
 *   <div x-roving-tab>
 *     <button>Button 1</button>
 *     <button>Button 2</button>
 *     <button>Button 3</button>
 *   </div>
 * @see https://web.dev/control-focus-with-tabindex/
 */
function rovingTab (Alpine) {
    const tabbablePromise = import('tabbable');
    Alpine.directive('roving-tab', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'list') {
            handleList$1($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot$p($el, Alpine, data, utilities, tabbablePromise);
        }
        else {
            throw new Error(`Unknown directive: x-roving-tab:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('rovingTab', handleRovingTabMagic(Alpine));
}
function handleRovingTabMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            focus(el, options) {
                $data.__rovingTab_focus(el, options);
            },
            setTabbable(el) {
                $data.__rovingTab_setTabbable(el);
            },
            focusNext(options) {
                $data.__rovingTab_focusNext(options);
            },
            focusPrev(options) {
                $data.__rovingTab_focusPrev(options);
            },
            focusFirst(options) {
                $data.__rovingTab_focusFirst(options);
            },
            focusLast(options) {
                $data.__rovingTab_focusLast(options);
            },
        };
    };
}
function handleList$1($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                init() {
                    this.__rovingTab_listElement = this.$el;
                    this.$nextTick(() => {
                        this.__rovingTab_listElement.tabIndex = -1;
                        // Use Alpine.effect here to re-run the effect when the focusables change
                        Alpine.effect(() => {
                            this.__rovingTab_setInitialTabIndicies();
                        });
                    });
                },
            };
        },
        '@keydown': '__rovingTab_onKeyDown',
        '@focusin': '__rovingTab_onFocusIn',
        '@click': '__rovingTab_onClick',
    });
}
function handleRoot$p($el, Alpine, { expression, modifiers }, { evaluate }, tabbablePromise) {
    const focusables = expression ? () => evaluate(expression) : undefined;
    const direction = modifiers.includes('vertical') ? 'vertical' : 'horizontal';
    const wrap = !modifiers.includes('nowrap');
    Alpine.bind($el, {
        ['x-data']() {
            return rovingTab$1(Alpine, { focusables, direction, wrap, tabbablePromise });
        },
    });
}
function rovingTab$1(_Alpine, options) {
    return {
        __rovingTab_direction: (options === null || options === void 0 ? void 0 : options.direction) || 'horizontal',
        __rovingTab_wrap: options === null || options === void 0 ? void 0 : options.wrap,
        __rovingTab_listElement: null,
        __rovingTab_tabbableFocusable: null,
        init() {
            if (options === null || options === void 0 ? void 0 : options.tabbablePromise) {
                options.tabbablePromise
                    .then((m) => {
                    this.__rovingTab_tabbableFocusable = m.focusable;
                    this.__rovingTab_setInitialTabIndicies();
                })
                    .catch((err) => {
                    console.error('Error importing tabbable', err);
                });
            }
        },
        __rovingTab_setInitialTabIndicies() {
            const initialElementTabIndex = this.__rovingTab_getTabbableIndex();
            const initialIndex = (options === null || options === void 0 ? void 0 : options.initialIndex) || (initialElementTabIndex >= 0 ? initialElementTabIndex : 0);
            this.__rovingTab_getFocusables().forEach((el, index) => {
                if (index === initialIndex) {
                    el.tabIndex = 0;
                }
                else {
                    el.tabIndex = -1;
                }
            });
        },
        __rovingTab_setTabbable(el) {
            // Make all other elements "untabbable"
            for (const focusable of this.__rovingTab_getFocusables()) {
                focusable.setAttribute('tabindex', '-1');
            }
            // Make this element tabbable
            el.setAttribute('tabindex', '0');
        },
        __rovingTab_focus(el, options) {
            this.__rovingTab_setTabbable(el);
            // Wait till next event loop to focus to ensure element is focusable
            setTimeout(() => {
                el.focus(options);
            });
        },
        __rovingTab_focusNext(options) {
            let index = this.__rovingTab_getTabbableIndex();
            const focusableElements = this.__rovingTab_getFocusables();
            if (this.__rovingTab_wrap) {
                index = mod(index + 1, focusableElements.length);
            }
            else {
                index = Math.min(index + 1, Math.max(focusableElements.length - 1, 0));
            }
            let nextElement = focusableElements[index];
            if (nextElement)
                this.__rovingTab_focus(nextElement, options);
        },
        __rovingTab_focusPrev(options) {
            let index = this.__rovingTab_getTabbableIndex();
            const focusableElements = this.__rovingTab_getFocusables();
            if (this.__rovingTab_wrap) {
                index = mod(index - 1, focusableElements.length);
            }
            else {
                index = Math.max(index - 1, 0);
            }
            let prevElement = focusableElements[index];
            if (prevElement)
                this.__rovingTab_focus(prevElement, options);
        },
        __rovingTab_focusFirst(options) {
            const focusableElements = this.__rovingTab_getFocusables();
            if (focusableElements.length > 0) {
                this.__rovingTab_focus(focusableElements[0], options);
            }
        },
        __rovingTab_focusLast(options) {
            const focusableElements = this.__rovingTab_getFocusables();
            if (focusableElements.length > 0) {
                this.__rovingTab_focus(focusableElements[focusableElements.length - 1], options);
            }
        },
        __rovingTab_getFocusables() {
            if ((options === null || options === void 0 ? void 0 : options.focusables) && isFunction(options === null || options === void 0 ? void 0 : options.focusables)) {
                return Array.from(options === null || options === void 0 ? void 0 : options.focusables());
            }
            else if ((options === null || options === void 0 ? void 0 : options.focusables) && Array.isArray(options === null || options === void 0 ? void 0 : options.focusables)) {
                return Array.from(options === null || options === void 0 ? void 0 : options.focusables);
            }
            else if (this.__rovingTab_tabbableFocusable && this.__rovingTab_listElement) {
                return Array.from(this.__rovingTab_tabbableFocusable(this.__rovingTab_listElement));
            }
            return [];
        },
        __rovingTab_getTabbableIndex() {
            return this.__rovingTab_getFocusables().findIndex((e) => e.getAttribute('tabindex') === '0');
        },
        __rovingTab_onKeyDown(e) {
            if (e.target && this.__rovingTab_getFocusables().includes(e.target)) {
                switch (e.key) {
                    case 'ArrowRight':
                        if (this.__rovingTab_direction == 'horizontal') {
                            e.preventDefault();
                            e.stopPropagation();
                            this.__rovingTab_focusNext();
                        }
                        break;
                    case 'ArrowLeft':
                        if (this.__rovingTab_direction == 'horizontal') {
                            e.preventDefault();
                            e.stopPropagation();
                            this.__rovingTab_focusPrev();
                        }
                        break;
                    case 'ArrowDown':
                        if (this.__rovingTab_direction == 'vertical') {
                            e.preventDefault();
                            e.stopPropagation();
                            this.__rovingTab_focusNext();
                        }
                        break;
                    case 'ArrowUp':
                        if (this.__rovingTab_direction == 'vertical') {
                            e.preventDefault();
                            e.stopPropagation();
                            this.__rovingTab_focusPrev();
                        }
                        break;
                    case 'Home':
                        e.preventDefault();
                        e.stopPropagation();
                        this.__rovingTab_focusFirst();
                        break;
                    case 'End':
                        e.preventDefault();
                        e.stopPropagation();
                        this.__rovingTab_focusLast();
                        break;
                }
            }
        },
        __rovingTab_onClick(e) {
            if (e.target && this.__rovingTab_getFocusables().includes(e.target)) {
                this.__rovingTab_setTabbable(e.target);
            }
        },
        __rovingTab_onFocusIn(e) {
            if (e.target && this.__rovingTab_getFocusables().includes(e.target)) {
                this.__rovingTab_setTabbable(e.target);
            }
        },
    };
}

function isPrintableCharacter(str) {
    var _a;
    return str.length === 1 && ((_a = str.match(/\S/)) === null || _a === void 0 ? void 0 : _a.length) === 1;
}

function focusMatch (Alpine) {
    const tabbablePromise = import('tabbable');
    Alpine.directive('focus-match', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'list') {
            handleList($el, Alpine, data);
        }
        else if (data.value === null) {
            handleRoot$o($el, Alpine, data, utilities, tabbablePromise);
        }
        else {
            throw new Error(`Unknown directive: x-focus-match:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('focusMatch', handleFocusMatchMagic(Alpine));
}
function handleFocusMatchMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            setFocusByFirstCharacter(char) {
                $data.__focusMatch_setFocusByFirstCharacter(char);
            },
        };
    };
}
function handleList($el, Alpine, { modifiers }) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                init() {
                    this.__focusMatch_listElement = this.$el;
                },
            };
        },
    });
}
function handleRoot$o($el, Alpine, { expression }, { evaluate }, tabbablePromise) {
    const focusables = expression ? () => evaluate(expression) : undefined;
    Alpine.bind($el, {
        ['x-data']() {
            return focusMatch$1({ focusables, tabbablePromise });
        },
        '@keydown': '__focusMatch_onKeyDown',
    });
}
/**
 * Adds the ability to focus an element in a list by typing the first character of the element. Useful in listboxes, menus, etc
 */
function focusMatch$1(options) {
    return {
        __focusMatch_listElement: null,
        __focusMatch_tabbableFocusable: null,
        init() {
            // By default the root element is the list element
            if (this.__focusMatch_listElement === null) {
                this.__focusMatch_listElement = this.$el;
            }
            if (options === null || options === void 0 ? void 0 : options.tabbablePromise) {
                options.tabbablePromise
                    .then((m) => {
                    this.__focusMatch_tabbableFocusable = m.focusable;
                })
                    .catch((err) => {
                    console.error('Error importing tabbable', err);
                });
            }
        },
        __focusMatch_onKeyDown(e) {
            if (isPrintableCharacter(e.key)) {
                this.__focusMatch_setFocusByFirstCharacter(e.key);
            }
        },
        __focusMatch_getFocusables() {
            if ((options === null || options === void 0 ? void 0 : options.focusables) && isFunction(options === null || options === void 0 ? void 0 : options.focusables)) {
                return Array.from(options === null || options === void 0 ? void 0 : options.focusables());
            }
            else if ((options === null || options === void 0 ? void 0 : options.focusables) && Array.isArray(options === null || options === void 0 ? void 0 : options.focusables)) {
                return Array.from(options === null || options === void 0 ? void 0 : options.focusables);
            }
            else if (this.__focusMatch_tabbableFocusable && this.__focusMatch_listElement) {
                return Array.from(this.__focusMatch_tabbableFocusable(this.__focusMatch_listElement));
            }
            return [];
        },
        __focusMatch_setFocusByFirstCharacter(char) {
            var _a, _b, _c, _d;
            let start;
            let index;
            let focusIndex = -1;
            let focusable;
            const focusables = this.__focusMatch_getFocusables();
            char = char.toLowerCase();
            if (this.__focusMatch_listElement === null) {
                throw new Error(`Expected x-focus-match to be applied to an HTMLElement but got ${this.__focusMatch_listElement}`);
            }
            // Get start index for search based on position of treeitem
            start = focusables.indexOf(this.__focusMatch_listElement) + 1;
            if (start >= focusables.length) {
                start = 0;
            }
            // Check remaining items in the tree
            for (index = start; index < focusables.length; index++) {
                focusable = focusables[index];
                if (((_a = focusable.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== '' && char === ((_b = focusable.textContent) === null || _b === void 0 ? void 0 : _b.trim()[0].toLowerCase())) {
                    focusIndex = index;
                    break;
                }
            }
            // If not found in remaining slots, check from beginning
            if (focusIndex === -1) {
                for (index = 0; index < start; index++) {
                    focusable = focusables[index];
                    if (((_c = focusable.textContent) === null || _c === void 0 ? void 0 : _c.trim()) !== '' && char === ((_d = focusable === null || focusable === void 0 ? void 0 : focusable.textContent) === null || _d === void 0 ? void 0 : _d.trim()[0].toLowerCase())) {
                        focusIndex = index;
                        break;
                    }
                }
            }
            // If match was found...
            if (focusIndex > -1) {
                const focusable = focusables[focusIndex];
                if (focusable) {
                    // Set [autofocus] attribute to work with other directives like x-trap
                    focusable.setAttribute('autofocus', '');
                    // Wait till next event loop to focus to ensure element is focusable
                    setTimeout(() => {
                        // Actually focus element
                        focusable.focus();
                    });
                }
            }
        },
    };
}

const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getSide(placement) {
  return placement.split('-')[0];
}
function getAlignment(placement) {
  return placement.split('-')[1];
}
function getOppositeAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
const yAxisSides = /*#__PURE__*/new Set(['top', 'bottom']);
function getSideAxis(placement) {
  return yAxisSides.has(getSide(placement)) ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, side => oppositeSideMap[side]);
}

var __rest$1 = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const DEFAULT_MIN_FIT_HEIGHT = 100; // This is fairly arbitrary but works well for now. We can easily add a `.min.10px` modifier to allow customizing it later if need be
const DEFAULT_MIN_FIT_WIDTH = 0;
const DEFAULT_OFFSET$2 = 20;
const DEFAULT_PADDING = 5;
function float (Alpine) {
    const lazyFloatingUIDomImport = import('@floating-ui/dom');
    async function buildMiddleware(state) {
        const dom = await lazyFloatingUIDomImport;
        const { offset, autoPlacement, flip, shift, size, arrow } = dom;
        function cover() {
            return offset((offsetState) => {
                const axis = getSideAxis(offsetState.placement);
                let o = 0;
                if (axis === 'x')
                    o = -offsetState.rects.reference.width;
                else if (axis === 'y')
                    o = -offsetState.rects.reference.height;
                return o;
            });
        }
        function fitY(strategy, options) {
            return size(Object.assign(Object.assign({}, options), { apply({ availableHeight, elements }) {
                    var _a;
                    const minHeight = (_a = options === null || options === void 0 ? void 0 : options.minHeight) !== null && _a !== void 0 ? _a : DEFAULT_MIN_FIT_HEIGHT;
                    if (availableHeight >= minHeight) {
                        if (strategy === 'css') {
                            elements.floating.style.setProperty('--float-max-height', `${availableHeight}px`);
                        }
                        else {
                            Object.assign(elements.floating.style, { maxHeight: `${availableHeight}px` });
                        }
                    }
                } }));
        }
        function fitX(strategy, options) {
            return size(Object.assign(Object.assign({}, options), { apply({ availableWidth, elements }) {
                    var _a;
                    const minWidth = (_a = options === null || options === void 0 ? void 0 : options.minWidth) !== null && _a !== void 0 ? _a : DEFAULT_MIN_FIT_WIDTH;
                    if (availableWidth >= minWidth) {
                        if (strategy === 'css') {
                            elements.floating.style.setProperty('--float-max-width', `${availableWidth}px`);
                        }
                        else {
                            Object.assign(elements.floating.style, { maxWidth: `${availableWidth}px` });
                        }
                    }
                } }));
        }
        function matchSize(strategy, options) {
            return size(Object.assign({ apply: (_a) => {
                    var { rects, elements } = _a, other = __rest$1(_a, ["rects", "elements"]);
                    const mainAxisPlacement = getAlignmentAxis(other.placement);
                    if (mainAxisPlacement === 'x') {
                        if (strategy === 'css') {
                            elements.floating.style.setProperty('--float-width', `${rects.reference.width}px`);
                        }
                        else {
                            Object.assign(elements.floating.style, { width: `${rects.reference.width}px` });
                        }
                    }
                    else {
                        if (strategy === 'css') {
                            elements.floating.style.setProperty('--float-height', `${rects.reference.height}px`);
                        }
                        else {
                            Object.assign(elements.floating.style, { height: `${rects.reference.height}px` });
                        }
                    }
                } }, options));
        }
        let middleware = [offset(state.__float_offset), ...state.__float_customMiddleware];
        if (state.__float_coverEnabled)
            middleware.push(cover());
        if (state.__float_autoPlacementEnabled === true) {
            middleware.push(autoPlacement({
                rootBoundary: state.__float_rootBoundary,
                alignment: state.__float_alignment,
            }));
        }
        else if (state.__float_autoPlacementEnabled === 'y') {
            middleware.push(autoPlacement({
                rootBoundary: state.__float_rootBoundary,
                alignment: state.__float_alignment,
                allowedPlacements: ['top', 'bottom'],
            }));
        }
        else if (state.__float_autoPlacementEnabled === 'x') {
            middleware.push(autoPlacement({
                rootBoundary: state.__float_rootBoundary,
                alignment: state.__float_alignment,
                allowedPlacements: ['left', 'right'],
            }));
        }
        if (state.__float_fitYEnabled) {
            middleware.push(fitY(state.__float_strategy, {
                padding: state.__float_padding,
                rootBoundary: state.__float_rootBoundary,
            }));
        }
        if (state.__float_fitXEnabled) {
            middleware.push(fitX(state.__float_strategy, {
                padding: state.__float_padding,
                rootBoundary: state.__float_rootBoundary,
            }));
        }
        if (state.__float_flipEnabled) {
            middleware.push(flip({
                padding: state.__float_padding,
                rootBoundary: state.__float_rootBoundary,
            }));
        }
        if (state.__float_shiftEnabled === true) {
            middleware.push(shift({
                padding: state.__float_padding,
                mainAxis: true,
                crossAxis: false,
                rootBoundary: state.__float_rootBoundary,
            }));
        }
        else if (state.__float_shiftEnabled === 'both') {
            middleware.push(shift({
                padding: state.__float_padding,
                mainAxis: true,
                crossAxis: true,
                rootBoundary: state.__float_rootBoundary,
            }));
        }
        else if (state.__float_shiftEnabled === 'cross') {
            middleware.push(shift({
                padding: state.__float_padding,
                mainAxis: false,
                crossAxis: true,
                rootBoundary: state.__float_rootBoundary,
            }));
        }
        if (state.__float_matchSizeEnabled) {
            middleware.push(matchSize(state.__float_strategy, { rootBoundary: state.__float_rootBoundary }));
        }
        if (state.__float_arrowEl !== null) {
            middleware.push(arrow({ element: state.__float_arrowEl }));
        }
        return { dom, middleware };
    }
    Alpine.directive('float', ($el, { value, modifiers, expression }, { evaluateLater, effect }) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (value == 'arrow') {
            const $data = Alpine.$data($el);
            $data.__float_arrowEl = $el;
            Alpine.bind($el, {
                ':style'() {
                    // Dont return styles if the strategy is "css" because the styles are applied via CSS variables
                    if (this.__float_strategy == 'css')
                        return {};
                    if (this.__float_arrowData == null)
                        return {};
                    const side = this.__float_side;
                    const { x, y } = this.__float_arrowData;
                    const oppositeSide = {
                        top: 'bottom',
                        right: 'left',
                        bottom: 'top',
                        left: 'right',
                    }[side];
                    const rotation = {
                        top: '0deg',
                        right: '90deg',
                        bottom: '180deg',
                        left: '-90deg',
                    }[oppositeSide];
                    return {
                        position: 'absolute',
                        // Position arrow at the edge of the floating element
                        left: x != null ? `${roundByDPR(x || 0)}px` : '',
                        top: y != null ? `${roundByDPR(y || 0)}px` : '',
                        // Force arrow over to the positioned side
                        [side]: '100%',
                        // Adjust rotation to point to the target
                        transform: `
                rotate(${rotation})
              `,
                    };
                },
            });
        }
        else if (value == null) {
            const getOptions = evaluateLater(expression);
            let initialPlacement = getPlacementModifier(modifiers);
            ensureFlipAndAutoPlacementAreNotUsedTogether(modifiers);
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        __float_arrowEl: null,
                        __float_positionData: null,
                        __float_arrowData: null,
                        __float_referenceEl: null,
                        __float_initialPlacement: hasCoverModifier(modifiers) && initialPlacement
                            ? getOppositePlacement(initialPlacement)
                            : initialPlacement,
                        __float_cancelAutoUpdate: null,
                        __float_isPositioned: false,
                        __float_placement: null,
                        __float_alignment: null,
                        __float_side: null,
                        __float_rootBoundary: 'viewport',
                        __float_strategy: getStrategyModifier(modifiers) || 'fixed',
                        __float_autoUpdateEnabled: hasAutoUpdateModifier(modifiers),
                        __float_initialUpdate: true,
                        __float_offset: getOffsetModifier(modifiers) || 0,
                        __float_coverEnabled: hasCoverModifier(modifiers),
                        __float_autoPlacementEnabled: getAutoPlacementModifier(modifiers) || initialPlacement == undefined,
                        __float_flipEnabled: hasFlipModifier(modifiers),
                        __float_fitXEnabled: hasFitXModifier(modifiers),
                        __float_fitYEnabled: hasFitYModifier(modifiers),
                        __float_shiftEnabled: getShiftModifier(modifiers),
                        __float_matchSizeEnabled: hasMatchSizeModifier(modifiers),
                        __float_padding: getPaddingModifier(modifiers) || 0,
                        __float_customMiddleware: [],
                        async __float_updatePosition() {
                            if (this.__float_referenceEl == null)
                                return;
                            try {
                                const { dom, middleware } = await buildMiddleware(this);
                                const data = await dom.computePosition(this.__float_referenceEl, $el, {
                                    placement: this.__float_initialPlacement,
                                    strategy: this.__float_strategy == 'absolute' ? 'absolute' : 'fixed',
                                    middleware,
                                });
                                const { placement, middlewareData } = data;
                                this.__float_positionData = data;
                                this.__float_placement = placement;
                                this.__float_alignment = getAlignment(placement) || null;
                                this.__float_side = getSide(placement);
                                if (middlewareData.arrow && this.__float_arrowEl !== null) {
                                    this.__float_arrowData = middlewareData.arrow;
                                }
                            }
                            catch (error) {
                                console.error('Error importing @floating-ui/dom', error);
                            }
                        },
                        async __float_startAutoUpdate() {
                            var _a;
                            if (!this.__float_referenceEl)
                                return;
                            try {
                                const dom = await lazyFloatingUIDomImport;
                                if (this.__float_referenceEl == null)
                                    return;
                                (_a = this.__float_cancelAutoUpdate) === null || _a === void 0 ? void 0 : _a.call(this);
                                await this.__float_updatePosition();
                                if (this.__float_referenceEl == null)
                                    return;
                                this.__float_cancelAutoUpdate = dom.autoUpdate(this.__float_referenceEl, $el, () => {
                                    void this.__float_updatePosition();
                                });
                            }
                            catch (error) {
                                console.error('Error importing @floating-ui/dom', error);
                            }
                        },
                        __float_getStyles() {
                            // If we're not positioned and not floating then reset the styles
                            if (this.__float_positionData == null || !this.__float_referenceEl) {
                                return {};
                            }
                            switch (this.__float_strategy) {
                                case 'absolute':
                                    return {
                                        position: 'absolute',
                                        left: `${this.__float_positionData.x}px`,
                                        top: `${this.__float_positionData.y}px`,
                                    };
                                case 'transform':
                                    return {
                                        transform: `translate(${roundByDPR(this.__float_positionData.x)}px, ${roundByDPR(this.__float_positionData.y)}px)`,
                                        left: '0',
                                        top: '0',
                                    };
                                case 'transform3d':
                                    return {
                                        transform: `translate3d(${roundByDPR(this.__float_positionData.x)}px, ${roundByDPR(this.__float_positionData.y)}px, 0)`,
                                        left: '0',
                                        top: '0',
                                    };
                                case 'fixed':
                                    return {
                                        position: 'fixed',
                                        left: `${this.__float_positionData.x}px`,
                                        top: `${this.__float_positionData.y}px`,
                                    };
                            }
                        },
                        __float_reset() {
                            // Cancel auto-update if active
                            this.__float_autoUpdateEnabled = false;
                            // Reset position data
                            this.__float_positionData = null;
                            this.__float_arrowData = null;
                            this.__float_isPositioned = false;
                            this.__float_placement = null;
                            this.__float_alignment = null;
                            this.__float_side = null;
                        },
                        init() {
                            this.$watch('__float_autoUpdateEnabled', (autoUpdateEnabled) => {
                                var _a;
                                if (autoUpdateEnabled) {
                                    this.__float_startAutoUpdate();
                                }
                                else {
                                    // If the expression does not result in an html element, reset
                                    (_a = this.__float_cancelAutoUpdate) === null || _a === void 0 ? void 0 : _a.call(this);
                                }
                            });
                            this.$watch('__float_positionData', (positionData) => {
                                if (positionData === null)
                                    return;
                                if (this.__float_strategy == 'css') {
                                    if (positionData !== null) {
                                        const { x, y } = positionData;
                                        requestAnimationFrame(() => {
                                            var _a, _b;
                                            this.$el.style.setProperty('--float-x', `${x}px`);
                                            this.$el.style.setProperty('--float-y', `${y}px`);
                                            (_a = this.__float_arrowEl) === null || _a === void 0 ? void 0 : _a.style.setProperty('--float-arrow-x', `${roundByDPR(x || 0)}px`);
                                            (_b = this.__float_arrowEl) === null || _b === void 0 ? void 0 : _b.style.setProperty('--float-arrow-y', `${roundByDPR(y || 0)}px`);
                                            this.__float_isPositioned = true;
                                        });
                                    }
                                }
                                else {
                                    this.__float_isPositioned = true;
                                    Object.assign(this.$el.style, this.__float_getStyles());
                                }
                            });
                            effect(() => {
                                getOptions(async (optionsOrRefererenceEl) => {
                                    let newReferenceEl = null;
                                    let options = {};
                                    // Check whether the expression evaluates to an html element or an options object
                                    if (optionsOrRefererenceEl != null && optionsOrRefererenceEl != false) {
                                        if (isHtmlElement(optionsOrRefererenceEl)) {
                                            newReferenceEl = optionsOrRefererenceEl;
                                        }
                                        else if (isPlainObject(optionsOrRefererenceEl)) {
                                            options = optionsOrRefererenceEl;
                                            if (options.rootBoundary !== undefined) {
                                                this.__float_rootBoundary = options.rootBoundary;
                                            }
                                            if (options.strategy !== undefined) {
                                                this.__float_strategy = options.strategy;
                                            }
                                            if (options.autoUpdate !== undefined) {
                                                this.__float_autoUpdateEnabled = options.autoUpdate;
                                            }
                                            if (options.offset !== undefined) {
                                                this.__float_offset = options.offset;
                                            }
                                            if (options.cover !== undefined) {
                                                this.__float_coverEnabled = options.cover || hasCoverModifier(modifiers) || false;
                                            }
                                            if (options.autoPlacement !== undefined) {
                                                this.__float_autoPlacementEnabled = options.autoPlacement;
                                            }
                                            if (options.flip !== undefined) {
                                                this.__float_flipEnabled = options.flip;
                                            }
                                            if (options.fitX !== undefined) {
                                                this.__float_fitXEnabled = options.fitX;
                                            }
                                            if (options.fitY !== undefined) {
                                                this.__float_fitYEnabled = options.fitY;
                                            }
                                            if (options.shift !== undefined) {
                                                this.__float_shiftEnabled = options.shift;
                                            }
                                            if (options.matchSize !== undefined) {
                                                this.__float_matchSizeEnabled = options.matchSize;
                                            }
                                            if (options.padding !== undefined) {
                                                this.__float_padding = options.padding;
                                            }
                                            if (options.referenceEl !== undefined) {
                                                newReferenceEl = options.referenceEl;
                                            }
                                            if (options.initialUpdate !== undefined) {
                                                this.__float_initialUpdate = options.initialUpdate;
                                            }
                                        }
                                    }
                                    // Wait for next tick until arrow element is available and we can calculate the position
                                    this.$nextTick(() => {
                                        var _a;
                                        if (this.__float_referenceEl && !newReferenceEl) {
                                            // If the reference el has been removed, cancel any auto updating and reset the position
                                            (_a = this.__float_cancelAutoUpdate) === null || _a === void 0 ? void 0 : _a.call(this);
                                            this.__float_isPositioned = false;
                                        }
                                        else if (this.__float_referenceEl != newReferenceEl) {
                                            // If a reference el has been provided, set it and update the position
                                            this.__float_referenceEl = newReferenceEl;
                                            if (this.__float_autoUpdateEnabled) {
                                                this.__float_startAutoUpdate();
                                            }
                                            else if (this.__float_initialUpdate) {
                                                this.__float_updatePosition();
                                            }
                                        }
                                    });
                                });
                            });
                        },
                        destroy() {
                            var _a;
                            (_a = this.__float_cancelAutoUpdate) === null || _a === void 0 ? void 0 : _a.call(this);
                        },
                    };
                },
            });
        }
        else {
            throw new Error(`Unknown directive: x-float:${value}`);
        }
    }).before('bind');
    Alpine.magic('float', handleFloatMagic(Alpine));
}
function handleFloatMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            get referenceEl() {
                return $data.__float_referenceEl;
            },
            set referenceEl(el) {
                $data.__float_referenceEl = el;
            },
            get isPositioned() {
                return $data.__float_isPositioned;
            },
            get placement() {
                return $data.__float_placement;
            },
            get side() {
                return $data.__float_side;
            },
            get alignment() {
                return $data.__float_alignment;
            },
            get matchSizeEnabled() {
                return $data.__float_matchSizeEnabled;
            },
            set matchSizeEnabled(value) {
                $data.__float_matchSizeEnabled = value;
            },
            updatePosition() {
                $data.__float_updatePosition();
            },
            enableAutoUpdate() {
                $data.__float_autoUpdateEnabled = true;
            },
            disableAutoUpdate() {
                $data.__float_autoUpdateEnabled = false;
            },
            reset() {
                $data.__float_reset();
            },
            get middleware() {
                return $data.__float_customMiddleware;
            },
            set middleware(middleware) {
                $data.__float_customMiddleware = middleware;
            },
        };
    };
}
function getOffsetModifier(modifiers) {
    const offsetModifierIndex = modifiers.findIndex((modifier) => modifier == 'offset');
    const offsetAmountModifier = modifiers[offsetModifierIndex + 1];
    if (offsetModifierIndex === -1) {
        return 0;
    }
    let offsetAmount = DEFAULT_OFFSET$2;
    let match = offsetAmountModifier === null || offsetAmountModifier === void 0 ? void 0 : offsetAmountModifier.match(/(-?\d+)px/);
    if (match) {
        offsetAmount = Number(match[1]);
    }
    return Number(offsetAmount);
}
function getPlacementModifier(modifiers) {
    return modifiers.find((modifier) => modifier.match(/^(top|right|bottom|left)(-(start|end))?$/));
}
function hasFlipModifier(modifiers) {
    return modifiers.includes('flip');
}
function getPaddingModifier(modifiers) {
    const paddingModifierIndex = modifiers.findIndex((modifier) => modifier == 'pad');
    const paddingAmountModifier = modifiers[paddingModifierIndex + 1];
    if (paddingModifierIndex === -1) {
        return 0;
    }
    let paddingAmount = DEFAULT_PADDING;
    let match = paddingAmountModifier === null || paddingAmountModifier === void 0 ? void 0 : paddingAmountModifier.match(/(-?\d+)px/);
    if (match) {
        paddingAmount = Number(match[1]);
    }
    return Number(paddingAmount);
}
function hasCoverModifier(modifiers) {
    return modifiers.includes('cover');
}
function hasFitYModifier(modifiers) {
    return modifiers.includes('fit-y');
}
function hasFitXModifier(modifiers) {
    return modifiers.includes('fit-x');
}
function hasMatchSizeModifier(modifiers) {
    return modifiers.includes('match');
}
function getAutoPlacementModifier(modifiers) {
    if (modifiers.includes('auto'))
        return true;
    if (modifiers.includes('auto-x'))
        return 'x';
    if (modifiers.includes('auto-y'))
        return 'y';
    return false;
}
function getShiftModifier(modifiers) {
    if (modifiers.includes('shift'))
        return true;
    if (modifiers.includes('shift-cross'))
        return 'cross';
    if (modifiers.includes('shift-both'))
        return 'both';
    return false;
}
function hasAutoUpdateModifier(modifiers) {
    return modifiers.includes('update');
}
function getStrategyModifier(modifiers) {
    if (modifiers.includes('css'))
        return 'css';
    if (modifiers.includes('transform'))
        return 'transform';
    if (modifiers.includes('transform3d'))
        return 'transform3d';
    if (modifiers.includes('absolute'))
        return 'absolute';
}
function ensureFlipAndAutoPlacementAreNotUsedTogether(modifiers) {
    if (hasFlipModifier(modifiers) && getAutoPlacementModifier(modifiers)) {
        throw new Error(`The \`flip\` and \`auto\` modifiers cannot be used together. Use either \`auto\` or \`flip\`. See https://floating-ui.com/docs/autoPlacement#conflict-with-flip`);
    }
}
function roundByDPR(value) {
    const dpr = window.devicePixelRatio || 1;
    return Math.round(value * dpr) / dpr;
}

const DEFAULT_MAX_REPEAT_TIME_IN_MS = 1500;
/**
 * Allow repeatedly triggering an action while the mouse is held down or while element is being touched
 *
 * e.g.
 *
 * <button x-hold.250ms="console.log('clicked')">Hold me down</button>
 */
function hold (Alpine) {
    Alpine.directive('hold', ($el, { modifiers, expression }, { evaluate }) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        let firstModifier = modifiers[0] || '';
        let time = isNumeric(firstModifier.split('ms')[0]) ? Number(firstModifier.split('ms')[0]) : 25;
        let maxModifierIndex = modifiers.indexOf('max');
        let maxValueModifier = modifiers[maxModifierIndex + 1];
        let maxTime = isNumeric(maxValueModifier === null || maxValueModifier === void 0 ? void 0 : maxValueModifier.split('ms')[0])
            ? Number(maxValueModifier.split('ms')[0])
            : DEFAULT_MAX_REPEAT_TIME_IN_MS;
        Alpine.bind($el, {
            ['x-data']() {
                return {
                    __intervalId: undefined,
                    __onPointerDown(e) {
                        var _a;
                        if (isHtmlElement(e.target)) {
                            if ((_a = e.target) === null || _a === void 0 ? void 0 : _a.hasPointerCapture(e.pointerId)) {
                                e.target.releasePointerCapture(e.pointerId);
                            }
                        }
                        let repeats = 0;
                        this.__intervalId = window.setInterval(() => {
                            evaluate(expression);
                            repeats += 1;
                            if (repeats * time >= maxTime) {
                                // Automatically stop the intervals after a certain amount of time
                                // in case somehow the pointerup event is not triggered or there is some
                                // other bug that causes the interval to not be cleared
                                window.clearInterval(this.__intervalId);
                            }
                        }, time);
                    },
                    __onPointerUp(_e) {
                        window.clearInterval(this.__intervalId);
                    },
                    __onPointerLeave(_e) {
                        window.clearInterval(this.__intervalId);
                    },
                    destroy() {
                        window.clearInterval(this.__intervalId);
                    },
                };
            },
            '@pointerdown': '__onPointerDown',
            '@pointerup.window': '__onPointerUp',
            '@pointerleave': '__onPointerLeave',
        });
    }).before('bind');
}

/**
 * Monitors a container element to check if boundary elements are overflowing using IntersectionObserver.
 *
 * The `x-overflow` directive provides a reactive way to detect when scrollable content overflows its container,
 * allowing you to show/hide navigation buttons, fade effects, or other UI elements based on scroll position.
 *
 * ## Basic Usage
 *
 * **Simplest usage**: Just add `x-overflow` (or `x-overflow.autoregister`) to an element, and it will act as both viewport and container:
 *
 * ```html
 * <div x-overflow.autoregister class="overflow-scroll">
 *   <div>First item</div>
 *   <div>Second item</div>
 *   <div>Last item</div>
 * </div>
 * ```
 *
 * **Advanced usage**: Use `x-overflow:viewport` and/or `x-overflow:container` to specify different elements:
 *
 * 1. Add `x-overflow` to the root container element
 * 2. (Optional) Add `x-overflow:viewport` to the scrollable container element
 * 3. (Optional) Add `x-overflow:container` to specify which element's children to watch for `.autoregister`
 * 4. Register boundaries using `x-overflow:{name}` on elements you want to monitor, or use `.autoregister` modifier
 * 5. Access overflow state via `$overflow.{name}` in your template
 *
 * ## Directives
 *
 * - `x-overflow` - Root directive that initializes the overflow detection system. By default, the element with `x-overflow` acts as both the viewport and container. Use `x-overflow:viewport` and/or `x-overflow:container` to override this behavior.
 * - `x-overflow:viewport` - (Optional) Marks the scrollable container element (the element with overflow CSS). If not specified, the root `x-overflow` element is used as the viewport.
 * - `x-overflow:container` - (Optional) Specifies an alternative container element for `.autoregister` to watch for first/last children. If not specified, the root `x-overflow` element (or viewport if specified) is used as the container.
 * - `x-overflow:{name}` - Registers a named boundary element to monitor (e.g., `x-overflow:start`, `x-overflow:end`, `x-overflow:left`, `x-overflow:right`)
 *
 * ## Modifiers
 *
 * - `.autoregister` - Automatically registers the first and last direct children of the container (or viewport if no container is specified) as 'start' and 'end' boundaries
 * - `.ratio` - Enables ratio mode, where boundaries return numeric values (0.0-1.0) instead of booleans
 *
 * ## $overflow Magic Property
 *
 * The `$overflow` magic provides:
 * - Boolean properties for each registered boundary name (e.g., `$overflow.start`, `$overflow.end`)
 *   - `true` = boundary element is overflowing (not fully visible)
 *   - `false` = boundary element is fully visible
 *
 * With the `.ratio` modifier, boundaries return numeric values (0.0-1.0):
 *   - `1.0` = boundary element is fully visible within the viewport
 *   - `0.0` = boundary element is fully hidden/outside the viewport
 *   - Values between 0.0 and 1.0 = partially visible (e.g., `0.5` = 50% visible)
 *
 * - `registerBoundary(name: string, el: HTMLElement)` - Programmatically register a boundary element
 *
 * ## Overflow Detection
 *
 * The intersection ratio is continuously tracked as elements scroll, providing smooth transitions.
 * Use the ratio value for gradual opacity, mask effects, or other smooth UI transitions.
 * The observer uses granular thresholds (0.1 steps) to provide smooth updates during scrolling.
 *
 * @example Manual boundary registration with custom names
 *
 * <div x-overflow class="relative">
 *   <div x-overflow:viewport class="w-[100px] h-[100px] overflow-scroll">
 *     <div class="w-[1000px] h-[100px] relative">
 *       <!-- Place boundary markers at the edges you want to monitor -->
 *       <div x-overflow:left class="absolute inset-0 right-auto w-[1px] h-full"></div>
 *       <div x-overflow:right class="absolute inset-0 left-auto w-[1px] h-full"></div>
 *     </div>
 *   </div>
 *   <div>
 *     <button x-show="$overflow.left" @click="scrollLeft()">←</button>
 *     <button x-show="$overflow.right" @click="scrollRight()">→</button>
 *   </div>
 * </div>
 *
 * @example Automatic boundary registration with .autoregister modifier
 *
 * The `.autoregister` modifier automatically registers the first and last direct children of the container
 * (or viewport if no container is specified) as 'start' and 'end' boundaries. A MutationObserver watches
 * for changes to the DOM and updates boundaries when children are added or removed.
 *
 * <div x-overflow.autoregister class="relative">
 *   <div x-overflow:viewport class="w-[100px] h-[100px] overflow-scroll flex">
 *     <div class="w-[100px] flex-shrink-0">First item</div>
 *     <div class="w-[100px] flex-shrink-0">Second item</div>
 *     <div class="w-[100px] flex-shrink-0">Last item</div>
 *   </div>
 *   <div>
 *     <button x-show="$overflow.start" @click="scrollToStart()">← Previous</button>
 *     <span x-text="$overflow.start ? 'Can scroll left' : 'At start'"></span>
 *     <span x-text="$overflow.end ? 'Can scroll right' : 'At end'"></span>
 *     <button x-show="$overflow.end" @click="scrollToEnd()">Next →</button>
 *     <!-- Edge mask -->
 *     <div :class="{ 'edge-mask-l': $overflow.start }"></div>
 *   </div>
 * </div>
 *
 * @example Using with dynamic content (x-for)
 *
 * Template elements created by Alpine's x-for directive are automatically filtered out when using `.autoregister`.
 * The mutation observer will automatically update boundaries when items are added or removed.
 *
 * <div x-overflow.autoregister x-data="{ items: [1, 2, 3] }">
 *   <div x-overflow:viewport class="overflow-x-auto">
 *     <template x-for="item in items" :key="item">
 *       <div class="w-[100px] flex-shrink-0" x-text="item"></div>
 *     </template>
 *   </div>
 *   <button @click="items.push(items.length + 1)">Add Item</button>
 *   <div x-show="$overflow.end">More items available</div>
 * </div>
 *
 * @example Ratio mode with gradual transitions
 *
 * Use `.ratio` modifier when you need numeric values for smooth transitions:
 *
 * <div x-overflow.ratio.autoregister class="relative">
 *   <div x-overflow:viewport class="w-[100px] h-[100px] overflow-scroll flex">
 *     <div class="w-[100px] flex-shrink-0">First item</div>
 *     <div class="w-[100px] flex-shrink-0">Second item</div>
 *     <div class="w-[100px] flex-shrink-0">Last item</div>
 *   </div>
 *   <div>
 *     <button x-show="$overflow.start < 1.0" @click="scrollToStart()">← Previous</button>
 *     <!-- Gradual edge mask fade using ratio -->
 *     <div :style="`opacity: ${1 - $overflow.start}`" class="edge-mask-l"></div>
 *   </div>
 * </div>
 *
 * @example Programmatic boundary registration
 *
 * You can also register boundaries programmatically using the `$overflow.registerBoundary()` method:
 *
 * <div x-overflow>
 *   <div x-overflow:viewport class="overflow-scroll">
 *     <div x-init="$overflow.registerBoundary('custom', $el)" class="custom-boundary">
 *       Custom boundary element
 *     </div>
 *   </div>
 *   <div x-text="$overflow.custom ? 'Custom boundary is overflowing' : 'Custom boundary is visible'"></div>
 * </div>
 *
 * ## Notes
 *
 * - The viewport element should have `overflow: auto` or `overflow: scroll` CSS for scrolling to work
 * - Boundary elements should be positioned within the scrollable content area
 * - When using `.autoregister`, only direct children of the container are considered (not nested children)
 * - Elements with `data-overflow-ignore` attribute are excluded from autoregistration boundary detection
 * - If you just use `x-overflow`, it acts as both viewport and container by default
 * - If `x-overflow:viewport` is specified, it overrides the viewport (but container still defaults to the root element unless `x-overflow:container` is also specified)
 * - If `x-overflow:container` is specified, it overrides the container for `.autoregister` boundary detection
 * - Template elements (from x-for) are automatically excluded from boundary detection
 * - The intersection observer uses granular thresholds (0.1 steps) to provide smooth ratio updates during scrolling
 * - Use boolean values directly: `:class="{ 'edge-mask-l': $overflow.start }"`
 * - With `.ratio` modifier, use numeric values for smooth transitions: `:style="\`opacity: ${1 - $overflow.start}\`"`
 */
function overflow (Alpine) {
    Alpine.directive('overflow', ($el, { value, modifiers }, { Alpine, evaluate }) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        // TODO when x-overflow:foo elements are destroyed, unset their value so we can use this with e.g. multi carousels per x-overflow
        if (value == 'viewport') {
            Alpine.bind($el, {
                'x-init': '__overflow_viewportEl = $el',
            });
        }
        else if (value == 'container') {
            Alpine.bind($el, {
                'x-init': '__overflow_containerEl = $el',
            });
        }
        else if (value == null) {
            const hasAutoregister = modifiers.includes('autoregister');
            const hasRatioMode = modifiers.includes('ratio');
            // If using ratio mode, use granular thresholds (0.1 steps) for smooth ratio updates during scrolling
            // This provides 11 thresholds: [0, 0.1, 0.2, ..., 1.0]
            const threshold = hasRatioMode ? Array.from({ length: 11 }, (_, i) => i / 10) : 0.99;
            Alpine.bind($el, {
                ['x-data']() {
                    const component = {
                        __overflow_intersectionObserver: null,
                        __overflow_intersectionEntries: [],
                        __overflow_viewportEl: null,
                        __overflow_containerEl: null,
                        __overflow_boundaryEls: new Map(),
                        __overflow_targetEl: null,
                        __overflow_overflows: {},
                        __overflow_ratioMode: hasRatioMode,
                        init() {
                            this.$nextTick(() => {
                                // Default: use the root element as both viewport and container
                                // x-overflow:viewport and x-overflow:container directives will override these if specified
                                if (!this.__overflow_viewportEl) {
                                    this.__overflow_viewportEl = $el;
                                }
                                if (!this.__overflow_containerEl) {
                                    this.__overflow_containerEl = $el;
                                }
                                this.__overflow_intersectionObserver = new IntersectionObserver(this.__overflow_onIntersect.bind(this), {
                                    root: this.__overflow_viewportEl,
                                    rootMargin: '0px',
                                    threshold,
                                });
                                if (hasAutoregister) {
                                    this.__overflow_itemsMutationObserver = null;
                                    // Wait for next tick to allow x-overflow:viewport and x-overflow:container directives to initialize
                                    this.$nextTick(() => {
                                        // If viewport was set (different from root) and container wasn't explicitly set (still root), use viewport as container
                                        // Note: x-overflow:container's x-init will have already run by now if it exists, so if container is still root,
                                        // it means container wasn't explicitly set, so default to viewport
                                        if (this.__overflow_viewportEl !== $el && this.__overflow_containerEl === $el) {
                                            this.__overflow_containerEl = this.__overflow_viewportEl;
                                        }
                                        if (this.__overflow_setupItemsMutationObserver) {
                                            this.__overflow_setupItemsMutationObserver();
                                        }
                                        // Wait for next tick and then use requestAnimationFrame to ensure DOM is ready
                                        this.$nextTick(() => {
                                            requestAnimationFrame(() => {
                                                var _a;
                                                (_a = this.__overflow_updateOverflowBoundaries) === null || _a === void 0 ? void 0 : _a.call(this);
                                            });
                                        });
                                    });
                                }
                            });
                        },
                        __overflow_registerBoundary(name, el) {
                            if (this.__overflow_boundaryEls.has(el))
                                return;
                            this.__overflow_boundaryEls.set(el, name);
                            // Initialize based on mode: 1.0 (fully visible) for ratio mode, false for normal mode
                            // Will update on first intersection callback
                            this.__overflow_overflows[name] = this.__overflow_ratioMode ? 1.0 : false;
                            this.$nextTick(() => {
                                this.__overflow_intersectionObserver.observe(el);
                                el.setAttribute(`data-overflow-${name}`, '');
                            });
                        },
                        __overflow_unregisterBoundary(el) {
                            var _a;
                            if (!this.__overflow_boundaryEls.has(el))
                                return;
                            const name = this.__overflow_boundaryEls.get(el);
                            this.__overflow_boundaryEls.delete(el);
                            // Create new object to trigger reactivity
                            const newOverflows = Object.assign({}, this.__overflow_overflows);
                            delete newOverflows[name];
                            this.__overflow_overflows = newOverflows;
                            (_a = this.__overflow_intersectionObserver) === null || _a === void 0 ? void 0 : _a.unobserve(el);
                            // Remove data attributes if this was an autoregistered boundary
                            el.removeAttribute(`data-overflow-${name}`);
                        },
                        __overflow_getBoundaryElement(name) {
                            for (const [boundaryEl, boundaryName] of this.__overflow_boundaryEls) {
                                if (boundaryName === name) {
                                    return boundaryEl;
                                }
                            }
                            return null;
                        },
                        __overflow_onIntersect(entries) {
                            this.__overflow_intersectionEntries = entries;
                            // Store the intersection ratio or convert to boolean based on mode
                            for (const entry of entries) {
                                if (this.__overflow_boundaryEls.has(entry.target)) {
                                    const name = this.__overflow_boundaryEls.get(entry.target);
                                    let value;
                                    if (this.__overflow_ratioMode) {
                                        // Ratio mode: round up to 2 decimal places (0.956 => 0.96, 0.823 => 0.82, etc.)
                                        value = Math.ceil(entry.intersectionRatio * 100) / 100;
                                    }
                                    else {
                                        // Normal mode: convert to boolean (true when overflowing, false when fully visible)
                                        value = !entry.isIntersecting;
                                    }
                                    // Store the value (ratio or boolean)
                                    // Need to create a new object for reactive effects to fire
                                    this.__overflow_overflows = Object.assign(Object.assign({}, this.__overflow_overflows), { [name]: value });
                                }
                            }
                            evaluate(() => { }, { scope: { $entries: entries }, params: [entries] });
                        },
                        __overflow_setupItemsMutationObserver() {
                            if (!this.__overflow_containerEl)
                                return;
                            this.__overflow_itemsMutationObserver = new MutationObserver(() => {
                                // Use requestAnimationFrame to ensure DOM has settled after mutation
                                requestAnimationFrame(() => {
                                    var _a;
                                    (_a = this.__overflow_updateOverflowBoundaries) === null || _a === void 0 ? void 0 : _a.call(this);
                                });
                            });
                            this.__overflow_itemsMutationObserver.observe(this.__overflow_containerEl, {
                                childList: true,
                                subtree: true,
                            });
                        },
                        __overflow_updateOverflowBoundaries() {
                            var _a, _b;
                            if (!this.__overflow_containerEl)
                                return;
                            // Find first and last direct child elements, filtering out template elements and ignored elements
                            const children = Array.from(this.__overflow_containerEl.children).filter((child) => child instanceof HTMLElement &&
                                child.tagName !== 'TEMPLATE' &&
                                !child.hasAttribute('data-overflow-ignore'));
                            const firstItem = children[0] || null;
                            const lastItem = children[children.length - 1] || null;
                            const currentStartBoundary = ((_a = this.__overflow_getBoundaryElement) === null || _a === void 0 ? void 0 : _a.call(this, 'start')) || null;
                            const currentEndBoundary = ((_b = this.__overflow_getBoundaryElement) === null || _b === void 0 ? void 0 : _b.call(this, 'end')) || null;
                            if (firstItem === null || firstItem === void 0 ? void 0 : firstItem.isSameNode(lastItem)) {
                                // If there's only one item, unregister both boundaries
                                if (currentStartBoundary) {
                                    this.__overflow_unregisterBoundary(currentStartBoundary);
                                }
                                if (currentEndBoundary) {
                                    this.__overflow_unregisterBoundary(currentEndBoundary);
                                }
                                return;
                            }
                            // Unregister old boundaries if they changed
                            if (currentStartBoundary && currentStartBoundary !== firstItem) {
                                this.__overflow_unregisterBoundary(currentStartBoundary);
                            }
                            if (currentEndBoundary && currentEndBoundary !== lastItem) {
                                this.__overflow_unregisterBoundary(currentEndBoundary);
                            }
                            // Register new boundaries
                            if (firstItem && currentStartBoundary !== firstItem && !firstItem.isSameNode(lastItem)) {
                                this.__overflow_registerBoundary('start', firstItem);
                            }
                            if (lastItem && currentEndBoundary !== lastItem && !firstItem.isSameNode(lastItem)) {
                                this.__overflow_registerBoundary('end', lastItem);
                            }
                        },
                        destroy() {
                            var _a, _b, _c, _d;
                            (_a = this.__overflow_intersectionObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
                            (_b = this.__overflow_itemsMutationObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
                            const currentStartBoundary = ((_c = this.__overflow_getBoundaryElement) === null || _c === void 0 ? void 0 : _c.call(this, 'start')) || null;
                            const currentEndBoundary = ((_d = this.__overflow_getBoundaryElement) === null || _d === void 0 ? void 0 : _d.call(this, 'end')) || null;
                            if (currentStartBoundary) {
                                this.__overflow_unregisterBoundary(currentStartBoundary);
                            }
                            if (currentEndBoundary) {
                                this.__overflow_unregisterBoundary(currentEndBoundary);
                            }
                        },
                    };
                    return component;
                },
            });
        }
        else {
            let $data = Alpine.$data($el);
            if ($data.__overflow_registerBoundary === undefined) {
                throw new Error(`Cannot use $overflow directive without x-overflow directive`);
            }
            // Handle x-overflow:foo directives so users can register named boundaries for overflow detection
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        init() {
                            this.$nextTick(() => {
                                this.__overflow_registerBoundary(value, $el);
                            });
                        },
                        destroy() {
                            this.__overflow_unregisterBoundary($el);
                        },
                    };
                },
            });
        }
    }).before('bind');
    Alpine.magic('overflow', (el) => {
        let $data = Alpine.$data(el);
        // Convert overflow values based on mode for the magic property
        const overflowValues = {};
        if ($data.__overflow_overflows) {
            for (const [name, value] of Object.entries($data.__overflow_overflows)) {
                if (value === undefined) {
                    overflowValues[name] = undefined;
                }
                else if ($data.__overflow_ratioMode) {
                    // Ratio mode: return numeric value as-is (should already be number)
                    overflowValues[name] = typeof value === 'number' ? value : value ? 0.0 : 1.0;
                }
                else {
                    // Normal mode: ensure boolean (should already be boolean, but ensure type safety)
                    overflowValues[name] = typeof value === 'boolean' ? value : value < 1.0;
                }
            }
        }
        return mergeProperties({
            registerBoundary(name, el) {
                if ($data.__overflow_registerBoundary === undefined) {
                    throw new Error(`Cannot use $overflow directive without x-overflow directive`);
                }
                $data.__overflow_registerBoundary(name, el);
            },
        }, overflowValues);
    });
}

/**
 * Manages the state and transformation of pan session data.
 */
class PanSession {
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
class PanGestureRecognizer {
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

/**
 * TODO docs
 */
function scrollList (Alpine) {
    Alpine.directive('scroll-list', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'viewport') {
            handleViewport$2($el, Alpine);
        }
        else if (data.value === 'scroller') {
            handleScroller($el, Alpine);
        }
        else if (data.value === 'item') {
            handleItem$1($el, Alpine);
        }
        else if (data.value === 'next') {
            handleNextButton$2($el, Alpine);
        }
        else if (data.value === 'prev') {
            handlePrevButton$2($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot$n($el, Alpine, data);
        }
        else {
            throw new Error(`Unknown directive: x-scroll-list:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('scrollList', handleScrollListMagic(Alpine));
}
function handleViewport$2($el, Alpine) {
    Alpine.bind($el, {
        ':id': "$id('scrollList')",
        ['x-data']() {
            return {
                init() {
                    this.$data.__viewportElement = this.$el;
                },
            };
        },
    });
}
function handleScroller($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                init() {
                    this.$data.__scrollContainerElement = this.$el;
                },
            };
        },
    });
}
function handleItem$1($el, Alpine) {
    Alpine.bind($el, {
        'x-data'() {
            return {
                init() {
                    this.$data.__items.add(this.$el);
                    this.$nextTick(() => {
                        var _a, _b;
                        (_a = this.$data.__visibleItemsIntersectionObserver) === null || _a === void 0 ? void 0 : _a.observe(this.$el);
                        (_b = this.$data.__centeredItemIntersectionObserver) === null || _b === void 0 ? void 0 : _b.observe(this.$el);
                    });
                },
                destroy() {
                    var _a, _b;
                    (_a = this.$data.__visibleItemsIntersectionObserver) === null || _a === void 0 ? void 0 : _a.unobserve(this.$el);
                    (_b = this.$data.__centeredItemIntersectionObserver) === null || _b === void 0 ? void 0 : _b.unobserve(this.$el);
                    this.$data.__items.delete(this.$el);
                },
            };
        },
    });
}
function handleNextButton$2($el, Alpine) {
    Alpine.bind($el, {
        '@click': '$scrollList.next()',
    });
}
function handlePrevButton$2($el, Alpine) {
    Alpine.bind($el, {
        '@click': '$scrollList.prev()',
    });
}
/** Returns __items in DOM order (order they appear as children of the scroll container). */
function getItemsInDomOrder(container, items) {
    if (!container)
        return [];
    return Array.from(container.children).filter((el) => items.has(el));
}
function handleRoot$n($el, Alpine, { modifiers }, _utilities) {
    let isVertical = modifiers.includes('vertical');
    Alpine.bind($el, {
        ['x-data']() {
            const data = {
                __viewportElement: null,
                __scrollContainerElement: null,
                __isScrolling: false,
                __centeredIndex: 0,
                __items: new Set(),
                __visibleIndices: null,
                __visibleItemsIntersectionObserver: null,
                __centeredItemIntersectionObserver: null,
                __abortController: new AbortController(),
                init() {
                    this.$nextTick(() => {
                        // Watch for items becoming fully intersecting the viewport or not
                        this.__visibleItemsIntersectionObserver = new IntersectionObserver(this.__onIntersect.bind(this), {
                            root: this.__viewportElement,
                            threshold: 0.5,
                        });
                        // Watch for the item that is currently centered in the viewport. Useful in "single item" type carousels
                        this.__centeredItemIntersectionObserver = new IntersectionObserver(this.__onIntersectCenter.bind(this), {
                            root: this.__viewportElement,
                            // places the detection area in the center from top to bottom (or left to right when vertical) of the container so that it can detect images with all kind of heights(or widths when vertical)
                            rootMargin: isVertical ? '-50% 0% -50% 99%' : '0% -50% 99% -50%',
                            threshold: 0.0,
                        });
                        this.__setupScrollListener();
                    });
                },
                destroy() {
                    var _a, _b;
                    (_a = this.__visibleItemsIntersectionObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
                    (_b = this.__centeredItemIntersectionObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
                    this.__abortController.abort();
                },
                __indexOf(item) {
                    const ordered = getItemsInDomOrder(this.__scrollContainerElement, this.__items);
                    return ordered.indexOf(item);
                },
                __scrollToItem(index, options = { behavior: 'smooth' }) {
                    var _a, _b;
                    const ordered = getItemsInDomOrder(this.__scrollContainerElement, this.__items);
                    const item = ordered[index];
                    if (item) {
                        if (isVertical) {
                            (_a = this.__scrollContainerElement) === null || _a === void 0 ? void 0 : _a.scrollTo({
                                left: 0,
                                top: getTargetScrollTop(item, this.__scrollContainerElement, (options === null || options === void 0 ? void 0 : options.align) || 'start'),
                                behavior: (options === null || options === void 0 ? void 0 : options.behavior) || 'smooth',
                            });
                        }
                        else {
                            (_b = this.__scrollContainerElement) === null || _b === void 0 ? void 0 : _b.scrollTo({
                                left: getTargetScrollLeft(item, this.__scrollContainerElement, (options === null || options === void 0 ? void 0 : options.align) || 'start'),
                                top: 0,
                                behavior: (options === null || options === void 0 ? void 0 : options.behavior) || 'smooth',
                            });
                        }
                    }
                },
                __scrollToNextItem() {
                    var _a;
                    const sortedVisibleIndices = Array.from((_a = this.__visibleIndices) !== null && _a !== void 0 ? _a : new Set()).sort((a, b) => a - b);
                    const lastVisibleIndex = sortedVisibleIndices[sortedVisibleIndices.length - 1];
                    if (lastVisibleIndex === undefined) {
                        return;
                    }
                    const firstNonVisibleIndex = Math.min(lastVisibleIndex + 1, this.__totalItems - 1);
                    if (firstNonVisibleIndex === lastVisibleIndex) {
                        return;
                    }
                    this.__scrollToItem(firstNonVisibleIndex, { align: 'start' });
                },
                __scrollToPrevItem() {
                    var _a;
                    const sortedVisibleIndices = Array.from((_a = this.__visibleIndices) !== null && _a !== void 0 ? _a : new Set()).sort((a, b) => a - b);
                    const firstVisibleIndex = sortedVisibleIndices[0];
                    if (firstVisibleIndex === undefined) {
                        return;
                    }
                    const lastNonVisibleIndex = Math.max(firstVisibleIndex - 1, 0);
                    if (lastNonVisibleIndex === firstVisibleIndex) {
                        return;
                    }
                    this.__scrollToItem(lastNonVisibleIndex, { align: 'end' });
                },
                __onIntersect(entries) {
                    if (this.__visibleIndices === null)
                        this.__visibleIndices = new Set();
                    entries.forEach((entry) => {
                        var _a, _b;
                        const itemIndex = this.$data.__indexOf(entry.target);
                        if (entry.isIntersecting) {
                            (_a = this.__visibleIndices) === null || _a === void 0 ? void 0 : _a.add(itemIndex);
                        }
                        else {
                            (_b = this.__visibleIndices) === null || _b === void 0 ? void 0 : _b.delete(itemIndex);
                        }
                    });
                },
                __onIntersectCenter(entries) {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const intersectingIndex = this.$data.__indexOf(entry.target);
                            this.__centeredIndex = intersectingIndex;
                        }
                    });
                },
                __setupScrollListener() {
                    var _a;
                    (_a = this.__scrollContainerElement) === null || _a === void 0 ? void 0 : _a.addEventListener('scroll', () => {
                        if (!this.__isScrolling) {
                            this.__isScrolling = true;
                            this.__setupScrollEndListener();
                        }
                    }, { once: true, passive: true, signal: this.__abortController.signal });
                },
                __setupScrollEndListener() {
                    var _a;
                    (_a = this.__scrollContainerElement) === null || _a === void 0 ? void 0 : _a.addEventListener('scrollend', () => {
                        this.__isScrolling = false;
                        this.__setupScrollListener();
                    }, { once: true, signal: this.__abortController.signal });
                },
                get __totalItems() {
                    return this.__items.size;
                },
            };
            return data;
        },
        'x-id': "['scrollList']",
        'x-scroll-list:viewport': '',
        'x-scroll-list:scroller': '',
    });
}
function handleScrollListMagic(Alpine) {
    return function ($el) {
        let $data = Alpine.$data($el);
        return {
            get isScrolling() {
                return $data.__isScrolling;
            },
            get items() {
                if (!$data.__items)
                    return null;
                return Array.from($data.__items);
            },
            get visibleIndices() {
                if (!$data.__visibleIndices)
                    return null;
                return Array.from($data.__visibleIndices).sort((a, b) => a - b);
            },
            get centeredIndex() {
                return $data.__centeredIndex;
            },
            set centeredIndex(value) {
                $data.__centeredIndex = value;
                $data.__scrollToItem(value);
            },
            scrollTo(index, options) {
                $data.__scrollToItem(index, options);
            },
            next() {
                $data.__scrollToNextItem();
            },
            prev() {
                $data.__scrollToPrevItem();
            },
        };
    };
}
function getTargetScrollTop(item, container, align) {
    switch (align) {
        case 'start':
            return item.offsetTop;
        case 'center':
            return item.offsetTop + item.offsetHeight / 2 - container.offsetHeight / 2;
        case 'end':
            return item.offsetTop + item.offsetHeight - container.offsetHeight;
    }
}
function getTargetScrollLeft(item, container, align) {
    switch (align) {
        case 'start':
            return item.offsetLeft;
        case 'center':
            return item.offsetLeft + item.offsetWidth / 2 - container.offsetWidth / 2;
        case 'end':
            return item.offsetLeft + item.offsetWidth - container.offsetWidth;
    }
}

const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;
/**
 * Enhances an element to allow for iOS-like horizontal/vertical "panning" on desktop
 * with a momentum effect, utilizing mouse drag gestures. The directive is part of a larger suite
 * that enables complex scrolling behaviors including snap-to-grid and independent
 * element movement within a scrollable track.
 *
 * Notes:
 * - Requires method-ui 'scroll-snap' plugin
 *
 * Performance Notes:
 * - It may be neccesary to use `-webkit-transform: translate3d(0,0,0);` on carousel items that contain images
 * in order to prevent jank while scrolling if you're using loading="lazy" on those images
 *
 * Directives:
 *  - x-carousel:viewport: Defines the scrollable viewport area.
 *  - x-carousel:track: Marks an element as the scrollable track containing slide items.
 *  - x-carousel:scroller: Designates an element as a scrollContainer, which moves with user interaction.
 *
 * Usage:
 *
 * 1. Basic Horizontal Carousel:
 * <div x-carousel:viewport>
 *   <div x-carousel:track class="flex ...">
 *     <!-- Slide items here -->
 *   </div>
 * </div>
 *
 * Key Features:
 * - Desktop optimized: Specifically designed for mouse-based interaction on desktop environments.
 * - Momentum scrolling: Implements inertia for a natural sliding experience with mouse dragging.
 * - Snap points support: Works with CSS scroll-snap to align slides on stop.
 * - Independent element sliding: Allows elements to move separately within the track.
 *
 * Implementation Details:
 * The directive utilizes several internal utilities to manage mouse drag gestures,
 * scrolling behavior, and snap-to-grid logic. It leverages Alpine.js reactivity
 * to update the UI state based on user interaction and scrolling position.
 *
 * Note: This directive should be used in conjunction with Alpine.js and assumes
 * the presence of specific CSS classes for styling (e.g., `overflow-hidden`, `flex`).
 * The behavior is designed for non-touch, mouse-driven environments and disables touch-specific interactions.
 */
function carousel (Alpine) {
    Alpine.directive('carousel', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'viewport') {
            handleViewport$1($el, Alpine);
        }
        else if (data.value === 'track') {
            handleTrack($el, Alpine, data);
        }
        else if (data.value === 'item') {
            handleItem($el, Alpine);
        }
        else if (data.value === 'next') {
            handleNextButton$1($el, Alpine);
        }
        else if (data.value === 'prev') {
            handlePrevButton$1($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot$m($el, Alpine);
        }
        else {
            throw new Error(`Unknown directive: x-carousel:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('carousel', handleCarouselMagic(Alpine));
}
/**
 * Binds a track component to an HTML element with Alpine.js.
 * This component handles moving a set of elements together in a performant way in a carousel UI.
 */
function handleTrack($el, Alpine, data, _utilities) {
    const shouldAutoRegisterItems = data.modifiers.includes('autoregister');
    Alpine.bind($el, {
        'x-scroll-list:scroller': '',
        ['x-data']() {
            return {
                __carousel_mutationObserver: null,
                init() {
                    this.$data.__carousel_trackEl = this.$el;
                    if (shouldAutoRegisterItems) {
                        // Automatically register initial children as x-carousel:item's
                        Array.from($el.children).forEach((child) => {
                            if (isTemplateElement(child))
                                return;
                            handleItem(child, Alpine);
                        });
                        // Watch for new children being added to the track
                        this.__carousel_mutationObserver = new MutationObserver((mutations) => {
                            mutations.forEach((mutation) => {
                                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                                    for (const node of mutation.addedNodes) {
                                        if (isTemplateElement(node))
                                            continue;
                                        handleItem(node, Alpine);
                                    }
                                }
                                if (mutation.type === 'childList') {
                                    this.$nextTick(() => {
                                        this.$data.__carousel_updateBounds();
                                    });
                                }
                            });
                        });
                        this.__carousel_mutationObserver.observe($el, {
                            childList: true,
                            subtree: false,
                        });
                    }
                },
                destroy() {
                    var _a;
                    (_a = this.__carousel_mutationObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
                },
            };
        },
    });
}
/**
 * Binds a viewport component to an HTML element with Alpine.js.
 * This component deals with the gestures and the viewport bounds for the carousel.
 *
 * @param {HTMLElement} $el - The element to bind the viewport component to.
 */
function handleViewport$1($el, Alpine) {
    Alpine.bind($el, {
        ':id': "$id('carousel')",
        'x-scroll-list:viewport': '',
        'x-resize': '__carousel_updateBounds',
        'x-resize.document': '__carousel_updateBounds',
        ['x-data']() {
            return {
                init() {
                    this.$data.__carousel_viewportEl = this.$el;
                    // Don't watch for pan events if on a touch device since they have native panning for scrollable elements
                    if (!isTouchDevice()) {
                        this.$data.__carousel_gestureRecognizer = new PanGestureRecognizer(this.$el);
                    }
                },
                destroy() {
                    var _a;
                    (_a = this.__carousel_gestureRecognizer) === null || _a === void 0 ? void 0 : _a.destroy();
                },
            };
        },
        '@panstart'() {
            if (!this.$data.__carousel_isEnabled)
                return;
            if (this.$data.__carousel_state === 'animating')
                return;
            this.$data.__carousel_panSession = this.$event.detail.panSession;
            this.$data.__carousel_beginPan();
            this.$data.__carousel_state = 'panning';
        },
        '@panmove'() {
            if (!this.$data.__carousel_isEnabled)
                return;
            if (this.$data.__carousel_state === 'animating')
                return;
            this.$data.__carousel_panSession = this.$event.detail.panSession;
            if (this.$data.__carousel_state === 'panning') {
                this.$data.__carousel_continuePan();
            }
            else {
                this.$data.__carousel_beginPan();
                this.$data.__carousel_state = 'panning';
            }
        },
        '@panend'() {
            if (!this.$data.__carousel_isEnabled)
                return;
            if (this.$data.__carousel_state === 'animating')
                return;
            this.$data.__carousel_panSession = this.$event.detail.panSession;
            this.$data.__carousel_endPan();
        },
    });
}
function handleItem($el, Alpine) {
    Alpine.bind($el, {
        'x-scroll-list:item': '',
        ':role': '$el.getAttribute("role") || "group"',
        'aria-roledescription': 'slide',
        // Prevent dragging images and links which interfere with the carousel pan gesture
        '@dragstart': '$event.preventDefault()',
    });
}
function handleNextButton$1($el, Alpine) {
    Alpine.bind($el, {
        'x-scroll-list:next': '',
    });
}
function handlePrevButton$1($el, Alpine) {
    Alpine.bind($el, {
        'x-scroll-list:prev': '',
    });
}
/**
 * Binds a root carousel component to an HTML element with Alpine.js.
 * This component controls the overall state and interactions of a carousel UI.
 *
 * @param {HTMLElement} $el - The element to bind the root component to.
 */
function handleRoot$m($el, Alpine) {
    Alpine.bind($el, {
        'x-scroll-list': '',
        ['x-data']() {
            return {
                __carousel_animation: null,
                __carousel_maxScrollLeft: 0,
                __carousel_state: 'initial',
                __carousel_scrollWidth: 0,
                __carousel_viewportWidth: 0,
                __carousel_panSession: null,
                __carousel_initialScrollLeft: null,
                __carousel_trackEl: null,
                __carousel_viewportEl: null,
                __carousel_gestureRecognizer: null,
                init() {
                    this.$watch('$scrollList.isScrolling', (isScrolling) => {
                        this.__carousel_state = isScrolling ? 'scrolling' : 'initial';
                    });
                    this.$nextTick(() => {
                        this.$watch('$carousel.visibleIndices', (visibleIndices, prevVisibleIndices) => {
                            if (this.__carousel_state !== 'initial')
                                return;
                            if ((visibleIndices === null || visibleIndices === void 0 ? void 0 : visibleIndices.length) === (prevVisibleIndices === null || prevVisibleIndices === void 0 ? void 0 : prevVisibleIndices.length))
                                return;
                        });
                    });
                },
                destroy() {
                    var _a;
                    (_a = this.__carousel_animation) === null || _a === void 0 ? void 0 : _a.cancel();
                },
                __carousel_beginPan() {
                    Alpine.stopObservingMutations();
                    this.$data.__carousel_initialScrollLeft =
                        this.__carousel_trackEl.scrollLeft;
                    const panSession = this.$data.__carousel_panSession;
                    const panDeltaXFromInitialScrollLeft = panSession.panDeltaX - this.$data.__carousel_initialScrollLeft;
                    window.requestAnimationFrame(() => {
                        this.__carousel_trackEl.style.overflow = 'visible';
                        this.__carousel_trackEl.style.transform = `translate3d(${panDeltaXFromInitialScrollLeft}px, 0px, 0)`;
                        this.__carousel_trackEl.style.willChange = 'transform';
                        this.__carousel_maxScrollLeft = this.$data.__carousel_scrollWidth - this.$data.__carousel_viewportWidth;
                    });
                },
                __carousel_continuePan() {
                    const panSession = this.$data.__carousel_panSession;
                    const panDeltaXFromInitialScrollLeft = panSession.panDeltaX - this.$data.__carousel_initialScrollLeft;
                    this.__carousel_trackEl.style.transform = `translate3d(${panDeltaXFromInitialScrollLeft}px, 0px, 0)`;
                },
                __carousel_endPan() {
                    this.__carousel_animateToScrollLeft();
                },
                async __carousel_animateToScrollLeft() {
                    this.__carousel_state = 'animating';
                    const panSession = this.$data.__carousel_panSession;
                    const calculatedFinalScrollLeft = toScrollValue(this.$data.__carousel_initialScrollLeft - panSession.panDeltaX);
                    const power = 0.6;
                    const velocity = panSession.panVelocityX;
                    // The extra distance that will be scrolled in the track due to the inertia animation
                    const amplitude = power * velocity;
                    const direction = getWritingDirection(this.$el);
                    const scrollLeftAfterAnimation = direction == 'rtl'
                        ? clamp(toScrollValue(calculatedFinalScrollLeft - amplitude), -this.__carousel_maxScrollLeft, 0)
                        : clamp(toScrollValue(calculatedFinalScrollLeft - amplitude), 0, this.__carousel_maxScrollLeft);
                    // Apply the final scroll position that would be reached with the current animation
                    // in order to figure out where the closest snap point is
                    this.__carousel_trackEl.style.overflow = 'auto';
                    this.__carousel_trackEl.scrollLeft = scrollLeftAfterAnimation;
                    this.__carousel_trackEl.style.transform = `translate3d(0px, 0px, 0)`;
                    window.requestAnimationFrame(async () => {
                        // Now, figure out where the closest snap point is
                        const snappedScrollLeft = this.__carousel_trackEl.scrollLeft;
                        this.__carousel_trackEl.style.overflow = 'visible';
                        // Apply a transform to "reset" the scroll position to where it was when the pan ended
                        this.__carousel_trackEl.style.transform = `translate3d(${-calculatedFinalScrollLeft}px, 0px, 0)`;
                        // Animate the scroll position to the closest snap point
                        this.__carousel_animation = animate(this.__carousel_trackEl, { x: [-calculatedFinalScrollLeft, -snappedScrollLeft] }, {
                            type: 'spring',
                            stiffness: 120,
                            damping: 15,
                            velocity: panSession.panVelocityX,
                        });
                        await this.__carousel_animation.finished;
                        this.__carousel_jumpToScrollLeft(snappedScrollLeft);
                    });
                },
                __carousel_jumpToScrollLeft(scrollLeft) {
                    // Finally, remove the transform and restore the scroll position
                    this.__carousel_trackEl.style.overflow = 'auto';
                    this.__carousel_trackEl.scrollLeft = scrollLeft;
                    this.__carousel_trackEl.style.transform = '';
                    this.__carousel_trackEl.style.willChange = '';
                    this.__carousel_animation = null;
                    this.__carousel_state = 'initial';
                    Alpine.startObservingMutations();
                },
                get __carousel_isScrollable() {
                    if (this.__carousel_trackEl == null)
                        return false;
                    if (this.__carousel_viewportEl == null)
                        return false;
                    return this.__carousel_scrollWidth > this.__carousel_viewportWidth;
                },
                get __carousel_isEnabled() {
                    return this.$carousel.items.length > 1 && this.__carousel_isScrollable;
                },
                __carousel_updateBounds() {
                    var _a, _b;
                    if (this.__carousel_trackEl == null)
                        return;
                    if (this.__carousel_viewportEl == null)
                        return;
                    this.__carousel_scrollWidth = (_a = this.__carousel_trackEl) === null || _a === void 0 ? void 0 : _a.scrollWidth;
                    // getBoundingClientRect().width returns a number with decimals, so we need to round it to avoid miscalculations when comparing it to the scrollWidth of the track
                    this.__carousel_viewportWidth = Math.round((_b = this.__carousel_viewportEl) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect().width);
                },
            };
        },
        'x-id': "['carousel']",
        ':role': '$el.getAttribute("role") || "region"',
        'aria-roledescription': 'carousel',
    });
}
function handleCarouselMagic(Alpine) {
    return function ($el) {
        let $data = Alpine.$data($el);
        return mergeProperties({}, {
            get state() {
                return $data.__carousel_state;
            },
            get isPanning() {
                return $data.__carousel_state == 'panning';
            },
            get isEnabled() {
                return $data.__carousel_isEnabled;
            },
        }, handleScrollListMagic(Alpine)($el));
    };
}

function isReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Scroll range for an element: progress 0 = element top at viewport bottom, 1 = element bottom at viewport top. */
function getElementScrollRange(el) {
    const viewportHeight = window.innerHeight;
    const rect = el.getBoundingClientRect();
    const elementTopDoc = rect.top + window.scrollY;
    const elementHeight = rect.height;
    const scrollYStart = elementTopDoc - viewportHeight;
    const scrollYEnd = elementTopDoc + elementHeight;
    return { scrollYStart, scrollRange: scrollYEnd - scrollYStart };
}
/**
 * Creates a scroll callback that maps page scroll to element-based progress [0,1] and applies
 * initial-render offset so the parallax doesn't jump when the element first enters view.
 */
function createElementScrollListener(options) {
    const { scrollYStart, scrollRange, scrollValue } = options;
    let initialProgress = 0;
    let hasCapturedInitial = false;
    return (_progress, info) => {
        const scrollY = info.y.current;
        const elementProgress = Math.max(0, Math.min(1, (scrollY - scrollYStart) / scrollRange));
        if (!hasCapturedInitial && elementProgress !== 0) {
            initialProgress = elementProgress;
            hasCapturedInitial = true;
        }
        else {
            scrollValue.set(elementProgress - initialProgress);
        }
    };
}
/**
 *
 * Add parallax effect on an element based on the scroll position of its root.
 *
 * NOTE: Parallax elements should have `will-change: transform` improve performance.
 *
 * @example
 *
 * <div
 *   class="relative flex justify-center items-center overflow-hidden h-[200px]"
 *   x-parallax
 * >
 *   <div
 *     class="absolute will-change-transform flex justify-center items-center min-h-full w-full h-[180%] text-white"
 *     x-parallax:element.distance.200px
 *   >
 *     Parallax child
 *   </div>
 * </div>
 */
function parallax (Alpine) {
    Alpine.directive('parallax', ($el, data, { cleanup, effect, evaluate }) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'background') {
            handleBackground($el, Alpine, data);
        }
        else if (data.value === 'child') {
            // DEPRECATED: for backwards compatibility
            handleBackground($el, Alpine, data);
        }
        else if (data.value === 'element') {
            handleElement$1($el, Alpine, data);
        }
        else if (data.value === null) {
            handleRoot$l($el, Alpine);
        }
        else {
            throw new Error(`Unknown directive: x-parallax:${data.value}`);
        }
    }).before('bind');
    /**
     * Magic providing access to the nearest parallax root's scroll state.
     * Use within a parallax root (or any descendant) to read the shared scroll progress.
     *
     * @example
     * <div x-parallax>
     *   <div x-effect="$parallax.scrollValue?.get() && ...">...</div>
     * </div>
     */
    Alpine.magic('parallax', ($el) => {
        const $data = Alpine.$data($el);
        return {
            get scrollValue() {
                return Alpine.raw($data.__parallaxElement_scrollValue);
            },
        };
    });
}
function handleBackground($el, Alpine, data) {
    const reverse = data.modifiers.includes('reverse');
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __parallaxBackground_bounds: [0, 0, 0],
                __parallaxBackground_styleEffect: null,
                __parallaxBackground_cancelInView: null,
                init() {
                    if (isReducedMotion())
                        return;
                    this.$nextTick(() => {
                        // Wait for the element to be in view before measuring / parallaxing so that:
                        // 1. Height measurements are correct. If element is hidden, height will be 0.
                        // 2. The element is initially aligned to the top/bottom of the container so that the image has room to move as the page scrolls.
                        // 3. Not running unnecessary parallax animations if the element is hidden.
                        inView($el, () => {
                            const rootEl = this.__rootEl;
                            if (!rootEl)
                                return;
                            const { top: rootTop, bottom: rootBottom } = rootEl.getBoundingClientRect();
                            const { top: elTop, bottom: elBottom } = $el.getBoundingClientRect();
                            const topDiff = rootTop - elTop;
                            const bottomDiff = elBottom - rootBottom;
                            if (topDiff <= 0 && bottomDiff <= 0) {
                                if (process.env.NODE_ENV === 'development') {
                                    console.warn('Incorrect child element sizing / alignment. The child parallax element must be taller than its container and initially aligned to the top/bottom of the container so that the image has room to move as the page scrolls');
                                }
                                return;
                            }
                            this.__parallaxBackground_bounds = [-bottomDiff, 0, topDiff];
                            this.__parallaxBackground_setupScroll();
                        });
                    });
                },
                __parallaxBackground_setupScroll() {
                    if (this.__parallaxBackground_styleEffect)
                        return;
                    const scrollValue = this.__parallaxElement_scrollValue;
                    const scrollToY = transform(reverse ? [1, 0, -1] : [-1, 0, 1], this.__parallaxBackground_bounds);
                    Alpine.mutateDom(() => {
                        this.__parallaxBackground_styleEffect = styleEffect($el, {
                            y: transformValue(() => scrollToY(scrollValue.get())),
                        });
                    });
                },
                destroy() {
                    var _a, _b;
                    (_a = this.__parallaxBackground_cancelInView) === null || _a === void 0 ? void 0 : _a.call(this);
                    this.__parallaxBackground_cancelInView = null;
                    (_b = this.__parallaxBackground_styleEffect) === null || _b === void 0 ? void 0 : _b.call(this);
                    this.__parallaxBackground_styleEffect = null;
                },
            };
        },
    });
}
function handleElement$1($el, Alpine, data) {
    let parallaxDistance = 10;
    let parallaxUnit = 'px';
    const reverse = data.modifiers.includes('reverse');
    if (data.modifiers.includes('distance')) {
        const rawValue = data.modifiers[data.modifiers.indexOf('distance') + 1];
        // Support x-parallax:element.200px which will move the element up or down by 200px
        let pxMatch = rawValue.match(/(-?[0-9]+)px/);
        if (pxMatch) {
            parallaxDistance = Number(pxMatch[1]);
            parallaxUnit = 'px';
        }
        let percentageMatch = rawValue.match(/(-?[0-9]+)%/);
        if (percentageMatch) {
            parallaxDistance = Number(percentageMatch[1]);
            parallaxUnit = '%';
        }
        let vhMatch = rawValue.match(/(-?[0-9]+)vh/);
        if (vhMatch) {
            parallaxDistance = Number(vhMatch[1]);
            parallaxUnit = 'vh';
        }
    }
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __parallaxElement_styleEffect: null,
                __parallaxElement_cancelInView: null,
                init() {
                    if (isReducedMotion())
                        return;
                    this.$nextTick(() => {
                        // Wait for the element to be in view before measuring / parallaxing so that:
                        // 1. Height measurements are correct. If element is hidden, height will be 0.
                        // 2. The element is initially aligned to the top/bottom of the container so that the image has room to move as the page scrolls.
                        // 3. Not running unnecessary parallax animations if the element is hidden.
                        inView($el, () => {
                            this.__parallaxElement_setupScroll();
                        });
                    });
                },
                __parallaxElement_setupScroll() {
                    const rootEl = this.__rootEl;
                    if (!rootEl)
                        return;
                    if (this.__parallaxElement_styleEffect)
                        return;
                    const scrollValue = this.__parallaxElement_scrollValue;
                    const scrollToY = transform(reverse ? [1, 0, -1] : [-1, 0, 1], [
                        `${parallaxDistance}${parallaxUnit}`,
                        `0${parallaxUnit}`,
                        `${-1 * parallaxDistance}${parallaxUnit}`,
                    ]);
                    Alpine.mutateDom(() => {
                        this.__parallaxElement_styleEffect = styleEffect($el, {
                            y: transformValue(() => scrollToY(scrollValue.get())),
                        });
                    });
                },
                destroy() {
                    var _a, _b;
                    (_a = this.__parallaxElement_cancelInView) === null || _a === void 0 ? void 0 : _a.call(this);
                    this.__parallaxElement_cancelInView = null;
                    (_b = this.__parallaxElement_styleEffect) === null || _b === void 0 ? void 0 : _b.call(this);
                    this.__parallaxElement_styleEffect = null;
                },
            };
        },
    });
}
function handleRoot$l($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __rootEl: $el,
                __parallaxElement_cancelInView: null,
                __parallaxElement_motionCancelFn: null,
                __parallaxElement_scrollValue: motionValue(0),
                init() {
                    if (isReducedMotion())
                        return;
                    this.$nextTick(() => this.__parallaxElement_setupScroll());
                },
                __parallaxElement_setupScroll() {
                    if (this.__parallaxElement_motionCancelFn)
                        return;
                    const { scrollYStart, scrollRange } = getElementScrollRange($el);
                    this.__parallaxElement_motionCancelFn = scroll(createElementScrollListener({
                        scrollYStart,
                        scrollRange,
                        scrollValue: this.__parallaxElement_scrollValue,
                    }), { offset: ['start end', 'end start'] });
                },
                destroy() {
                    var _a, _b;
                    (_a = this.__parallaxElement_cancelInView) === null || _a === void 0 ? void 0 : _a.call(this);
                    this.__parallaxElement_cancelInView = null;
                    (_b = this.__parallaxElement_motionCancelFn) === null || _b === void 0 ? void 0 : _b.call(this);
                    this.__parallaxElement_motionCancelFn = null;
                },
            };
        },
    });
}

/**
 * Enables the creation of disclosure components, commonly known as accordions or collapsible sections.
 * A disclosure component typically consists of a button that controls the visibility of an
 * associated content area.
 *
 * Note: requires method-ui 'animations' plugin
 *
 * See https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/ for more information about disclosures
 *
 * Usage:
 * - x-disclosure - Applied to the root element of a disclosure component. It can optionally accept an expression that
 *   2-way binds to the internal isExpanded state of the disclosure e.g. `x-disclosure="isExpanded"`. If no expression is provided, the disclosure is closed by default
 *   If your disclosure is _not_ animated, use the .noanimate modifier to prevent the disclosure from waiting for animations to complete before transitioning to expanded and vice versa.
 * - x-disclosure:button - Marks an element as the button that toggles the visibility of the
 *   disclosure content. This element is typically a button or a similar interactive element.
 * - `data-skip-animation-wait` - Add this attribute to elements when you don't want to wait for their animations to complete before state transitions.
 *
 * @example
 *
 * <div x-disclosure>
 *   <button x-disclosure:button>Open SESAME</button>
 *   <div x-disclosure:panel>
 *     <p>Hello world</p>
 *   </div>
 * </div>
 *
 * @example Initially expanded
 *
 * <div x-disclosure="true">
 *   <button x-disclosure:button>Open SESAME</button>
 *   <div x-disclosure:panel>
 *     <p>Hello world</p>
 *   </div>
 * </div>
 *
 * or
 *
 * <div x-disclosure="{ isExpanded: true }">
 *   <button x-disclosure:button>Open SESAME</button>
 *   <div x-disclosure:panel>
 *     <p>Hello world</p>
 *   </div>
 * </div>
 *
 * @example Bound to external state
 *
 * <div x-data="{isExpandedExternal: true}">
 *   <div x-show="isExpandedExternal">Im open!</div>
 *
 *   <div x-disclosure="{
 *     get isExpanded() {
 *       return this.isExpandedExternal
 *     },
 *     set isExpanded(value) {
 *       this.isExpandedExternal = value
 *     }
 *   }">
 *     <button x-disclosure:button>Open SESAME</button>
 *     <div x-disclosure:panel>
 *       <p>Hello world</p>
 *     </div>
 *   </div>
 * </div>
 *
 * The '$disclosure' magic property provides an API for managing the state of the disclosure
 * component, including checking its open/closed status and programmatically toggling its state.
 *
 * ## Disclosure Groups
 *
 * Disclosure groups are a collection of disclosures that are managed as a single accordion.
 * This is useful for creating multi-step forms or other UI elements that require the disclosure
 * of multiple sections.
 *
 * @example
 *
 * <div x-disclosure-group>
 *   <div x-disclosure
 *     <button x-disclosure:button>Open SESAME 1</button>
 *     <div x-disclosure:panel>
 *       <p>Hello world 1</p>
 *     </div>
 *   </div>
 *  <div x-disclosure>
 *     <button x-disclosure:button>Open SESAME 2</button>
 *     <div x-disclosure:panel>
 *       <p>Hello world 2</p>
 *     </div>
 *   </div>
 * </div>
 *
 * The '$disclosureGroup' magic property provides an API for managing the state of the disclosure group,
 * including checking the expanded index and programmatically toggling the state of the disclosures.
 *
 */
function disclosure (Alpine) {
    Alpine.directive('disclosure', ($el, data, utilities) => {
        if (data.value === 'panel') {
            handlePanel$3($el, Alpine);
        }
        else if (data.value === 'button') {
            handleButton$6($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot$k($el, Alpine, data, utilities);
        }
        else {
            throw new Error(`Unknown directive: x-disclosure:${data.value}`);
        }
    }).before('bind');
    Alpine.directive('disclosure-group', ($el, data, utilities) => {
        if (data.value === null) {
            handleDisclosureGroup($el, Alpine, data, utilities);
        }
        else {
            throw new Error(`Unknown directive: x-disclosure-group:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('disclosure', handleDisclosureMagic(Alpine));
    Alpine.magic('disclosureGroup', handleDisclosureGroupMagic(Alpine));
}
function handleDisclosureMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            get isExpanded() {
                var _a;
                return (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.isExpanded;
            },
            set isExpanded(value) {
                if (!$data.__disclosure_state)
                    return;
                $data.__disclosure_state.isExpanded = value;
            },
            get isCollapsed() {
                var _a;
                return (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.isCollapsed;
            },
            get isInGroup() {
                return $data.__disclosure_isInGroup;
            },
            get groupIndex() {
                return $data.__disclosure_groupIndex;
            },
            toggle() {
                var _a;
                (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.toggle();
            },
            expand() {
                var _a;
                (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.expand();
            },
            collapse() {
                var _a;
                (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.collapse();
            },
            waitForAnimations() {
                return $data.__disclosure_waitForAnimations();
            },
        };
    };
}
function handleDisclosureGroupMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return $data.__disclosure_group_state || {};
    };
}
function handlePanel$3($el, Alpine) {
    if (!$el._x_doShow) {
        $el._x_doShow = () => { };
    }
    if (!$el._x_doHide) {
        $el._x_doHide = () => { };
    }
    Alpine.bind($el, {
        ':id': `$el.id || $id('disclosure-panel')`,
        role: 'group',
        'x-show': '$disclosure.isExpanded',
        'x-init'() {
            this.__disclosure_contentEl = this.$el;
            // TODO investigate hooking into Alpine's el._x_doShow / el._x_doHide hooks instead of this
            const addHidden = () => {
                Alpine.mutateDom(() => {
                    // TODO add support for `hidden="until-found"`
                    this.$el.setAttribute('hidden', '');
                    this.$el.style.setProperty('display', 'none');
                });
            };
            const removeHidden = () => {
                Alpine.mutateDom(() => {
                    this.$el.removeAttribute('hidden');
                    this.$el.style.removeProperty('display');
                });
            };
            // Set initial hidden state
            if (this.__disclosure_state.isExpanded) {
                removeHidden();
            }
            else {
                addHidden();
            }
            this.$watch('__disclosure_state.isExpanded', async (isExpanded) => {
                if (isExpanded) {
                    removeHidden();
                }
                else {
                    if (this.__disclosure_animated) {
                        await this.__disclosure_waitForAnimations();
                        // If the disclosure re-expanded before the animation completed, don't hide it
                        if (this.__disclosure_state.isExpanded)
                            return;
                        addHidden();
                    }
                    else {
                        addHidden();
                    }
                }
            });
        },
        ':aria-labelledby': '__disclosure_buttonEl?.id',
        'data-morph-children-only': '',
    });
}
function handleButton$6($el, Alpine) {
    Alpine.bind($el, {
        role: 'button',
        ':id': `$el.id || $id('disclosure-button')`,
        'x-init': '__disclosure_buttonEl = $el',
        '@click.stop.prevent': '$disclosure.toggle()',
        ':aria-controls': '__disclosure_contentEl?.id',
        ':aria-expanded': '$disclosure.isExpanded',
    });
}
function handleDisclosureGroup($el, Alpine, { expression, modifiers }, { evaluate }) {
    let options = evaluate(expression === '' ? '{}' : expression);
    if (options !== undefined && options !== null && !isPlainObject(options)) {
        throw new Error(`options must be an object, but got ${options}`);
    }
    let state;
    if (options.multiple || modifiers.includes('multiple')) {
        state = buildMultiSelectDisclosureGroupState(options);
    }
    else {
        state = buildSingleSelectDisclosureGroupState(options);
    }
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __disclosure_group_state: state,
            };
        },
    });
}
function handleRoot$k($el, Alpine, { modifiers, expression }, { evaluate }) {
    const $data = Alpine.$data($el);
    const isInDisclosureGroup = !!$data.__disclosure_group_state;
    // Track the depth of the disclosure group so that we can exclude the children of a grouped disclosure from also having their state controlled by the group state
    let groupDepth = $data.__disclosure_groupDepth;
    if (isInDisclosureGroup) {
        if (groupDepth === undefined || groupDepth === null) {
            groupDepth = 0;
        }
        groupDepth++;
    }
    const isDirectChildOfDisclosureGroup = isInDisclosureGroup && groupDepth === 1;
    const animated = !modifiers.includes('noanimate');
    const expand = modifiers.includes('expand');
    let options = {};
    // Evaluate the x-disclosure expression to get the initial expanded state of the disclosure (e.g. true or false)
    if (expression) {
        let evalutatedExpression = evaluate(expression === '' ? '{}' : expression);
        if (evalutatedExpression === true || evalutatedExpression === false) {
            options.isExpanded = evalutatedExpression;
        }
        else if (isPlainObject(evalutatedExpression)) {
            options = evalutatedExpression;
        }
    }
    else {
        // If there's no expression, but the .expand modifier is used, the disclosure is expanded by default
        if (expand) {
            options.isExpanded = true;
        }
    }
    let state = buildDisclosureState(options);
    // If a x-disclosure is the child of a x-disclosure-group its 'isExpanded' state is derived from the group's expanded state instead of having its own state
    // This allows us to close disclosure when another one in the group is opened
    // For clarity: the groupDepth check here ensures that e.g. if you have a popup inside of a tab
    // that opening or closing the popup doesn't affect the state of the tabs (i.e the disclosure group)
    if (isDirectChildOfDisclosureGroup) {
        state = buildDisclosureState({
            get isExpanded() {
                var _a, _b;
                const index = (_b = (_a = $data.__disclosure_group_state).indexOf) === null || _b === void 0 ? void 0 : _b.call(_a, $el);
                const isExpanded = $data.__disclosure_group_state.isExpanded(index);
                return isExpanded;
            },
            set isExpanded(value) {
                var _a, _b;
                const index = (_b = (_a = $data.__disclosure_group_state).indexOf) === null || _b === void 0 ? void 0 : _b.call(_a, $el);
                if (value) {
                    $data.__disclosure_group_state.expand(index);
                }
                else {
                    $data.__disclosure_group_state.collapse(index);
                }
            },
        });
    }
    Alpine.bind($el, {
        ':id': `$el.id || $id('disclosure')`,
        ['x-data']() {
            return {
                __disclosure_buttonEl: null,
                __disclosure_contentEl: null,
                __disclosure_state: state,
                __disclosure_animated: animated,
                __disclosure_groupDepth: groupDepth,
                init() {
                    this.$watch('__disclosure_state.isExpanded', (isExpanded) => {
                        this.$dispatch(isExpanded ? 'expand' : 'collapse');
                    });
                    if (isDirectChildOfDisclosureGroup) {
                        // Register this element with the disclosure group so we can keep track of it's index
                        this.$data.__disclosure_group_state.register(this.$el);
                        if (options.isExpanded) {
                            this.__disclosure_state.expand();
                        }
                    }
                },
                destroy() {
                    if (isDirectChildOfDisclosureGroup) {
                        this.$data.__disclosure_group_state.unregister(this.$el);
                    }
                },
                async __disclosure_waitForAnimations() {
                    return await this.$waitForAnimations({
                        subtree: true,
                        target: this.__disclosure_contentEl,
                    });
                },
                get __disclosure_isInGroup() {
                    return isInDisclosureGroup;
                },
                get __disclosure_groupIndex() {
                    var _a, _b;
                    if (!this.__disclosure_isInGroup)
                        return null;
                    return (_b = (_a = $data.__disclosure_group_state).indexOf) === null || _b === void 0 ? void 0 : _b.call(_a, this.$el);
                },
            };
        },
        ['x-id']: "['disclosure', 'disclosure-panel', 'disclosure-button']",
    });
}
function buildDisclosureState(options) {
    var _a;
    let state = {
        isExpanded: (_a = options === null || options === void 0 ? void 0 : options.isExpanded) !== null && _a !== void 0 ? _a : false,
        expand() {
            this.isExpanded = true;
        },
        collapse() {
            this.isExpanded = false;
        },
        toggle() {
            this.isExpanded = !this.isExpanded;
        },
        get isCollapsed() {
            return !this.isExpanded;
        },
    };
    if ((options === null || options === void 0 ? void 0 : options.isExpanded) !== undefined) {
        const isExpandedDescriptor = Object.getOwnPropertyDescriptor(options, 'isExpanded');
        Object.defineProperty(state, 'isExpanded', isExpandedDescriptor);
    }
    return state;
}
function buildSingleSelectDisclosureGroupState(options) {
    var _a;
    let state = {
        expandedIndex: (_a = options === null || options === void 0 ? void 0 : options.initiallyExpandedIndex) !== null && _a !== void 0 ? _a : null,
        items: new Set(),
        isExpanded(index) {
            return this.expandedIndex === index;
        },
        register(el) {
            this.items.add(el);
        },
        unregister(el) {
            this.items.delete(el);
        },
        indexOf(el) {
            var _a;
            const explicit = (_a = options === null || options === void 0 ? void 0 : options.getIndex) === null || _a === void 0 ? void 0 : _a.call(options, el);
            if (explicit !== undefined && explicit !== null)
                return explicit;
            return Array.from(this.items).indexOf(el);
        },
        toggle(index) {
            this.expandedIndex === index ? this.collapse(index) : this.expand(index);
        },
        expand(index) {
            this.expandedIndex = index;
        },
        collapse(index) {
            if (this.expandedIndex === index) {
                this.expandedIndex = null;
            }
        },
    };
    if (options && 'expandedIndex' in options) {
        copyProperty(options, state, 'expandedIndex');
    }
    return state;
}
function buildMultiSelectDisclosureGroupState(options) {
    var _a;
    let state = {
        expandedIndices: (_a = options === null || options === void 0 ? void 0 : options.initiallyExpandedIndices) !== null && _a !== void 0 ? _a : new Set(),
        items: new Set(),
        isExpanded(index) {
            return this.expandedIndices.has(index);
        },
        register(el) {
            this.items.add(el);
        },
        unregister(el) {
            this.items.delete(el);
        },
        indexOf(el) {
            return Array.from(this.items).indexOf(el);
        },
        toggle(index) {
            this.expandedIndices.has(index) ? this.collapse(index) : this.expand(index);
        },
        expand(index) {
            const expanded = this.expandedIndices;
            expanded.add(index);
            // Copy to a new set so that reactivity works
            this.expandedIndices = new Set(Array.from(expanded));
        },
        collapse(index) {
            const expanded = this.expandedIndices;
            expanded.delete(index);
            // Copy to a new set so that reactivity works
            this.expandedIndices = new Set(Array.from(expanded));
        },
    };
    if (options && 'expandedIndices' in options) {
        copyProperty(options, state, 'expandedIndices');
    }
    return state;
}

function dialog (Alpine) {
    Alpine.directive('dialog', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'panel') ;
        else if (data.value === 'button') {
            handleButton$5($el, Alpine);
        }
        else if (data.value === 'close') {
            handleCloseButton($el, Alpine);
        }
        else if (data.value === 'backdrop') {
            handleBackdrop($el, Alpine);
        }
        else if (data.value === 'dialog') {
            if (!isDialogElement($el))
                throw new Error('x-dialog must be used on a <dialog> element');
            handleDialog($el, Alpine, data);
        }
        else if (data.value === 'content') {
            handleContent($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot$j($el, Alpine, data, utilities);
        }
        else {
            throw new Error(`Unknown directive: x-dialog:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('dialog', handleDialogMagic(Alpine));
}
function handleDialogMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            waitForAnimations() {
                return $data.__dialog_waitForAnimations();
            },
            get isOpen() {
                return $data.__dialog_state.isOpen;
            },
            set isOpen(value) {
                $data.__dialog_state.isOpen = value;
            },
            get wasOpen() {
                var _a;
                return (_a = $data.__dialog_state) === null || _a === void 0 ? void 0 : _a.wasOpen;
            },
            open() {
                $data.__dialog_state.open();
            },
            close() {
                $data.__dialog_state.close();
            },
        };
    };
}
function handleBackdrop($el, Alpine) {
    Alpine.bind($el, {
        'x-show': '$dialog.isOpen',
        '@click': '$dialog.close()',
    });
}
function handleButton$5($el, Alpine) {
    Alpine.bind($el, {
        ':id': `$id('dialog-button')`,
        'x-init': '__dialog_buttonEl = $el',
        '@click.stop.prevent': '$dialog.open()',
        ':aria-controls': "$id('dialog')",
        ':aria-expanded': '$dialog.isOpen',
        'aria-haspopup': 'dialog',
    });
}
function handleCloseButton($el, Alpine) {
    Alpine.bind($el, {
        '@click': '$dialog.close()',
    });
}
function handleDialog($el, Alpine, { modifiers }) {
    const $data = Alpine.$data($el);
    Alpine.bind($el, {
        ':aria-labelledby': '__dialog_buttonEl?.id',
        'data-morph-children-only': '',
        // Close the dialog on when native close or cancel events fired on element for whatever reason
        '@close.stop.prevent': '$dialog.close()',
        '@cancel.stop.prevent': '$dialog.close()',
        // Close when clicking outside of the dialog panel i.e. the backdrop
        '@click'() {
            if (isClickingOutside(this.$event, $data.__dialog_contentEl || $el)) {
                this.$dialog.close();
            }
        },
        'x-init'() {
            this.__dialog_dialogEl = $el;
        },
        role: 'dialog',
        ':id': `$id('dialog')`,
        '@keydown.escape.window': '$data.__dialog_isModal && $dialog.close()',
    });
}
function handleContent($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            this.__dialog_contentEl = $el;
        },
        ':id': `$id('dialog-panel')`,
    });
}
function handleRoot$j($el, Alpine, { modifiers, expression }, { evaluate }) {
    const modal = modifiers.includes('modal');
    const noautofocus = modifiers.includes('noautofocus');
    const open = modifiers.includes('open');
    let options = {};
    // Evaluate the x-disclosure expression to get the initial expanded state of the disclosure (e.g. true or false)
    if (expression) {
        let evalutatedExpression = evaluate(expression === '' ? '{}' : expression);
        if (evalutatedExpression === true || evalutatedExpression === false) {
            options.isOpen = evalutatedExpression;
        }
        else if (isPlainObject(evalutatedExpression)) {
            options = evalutatedExpression;
        }
    }
    else {
        // If there's no expression, but the .expand modifier is used, the disclosure is expanded by default
        if (open) {
            options.isOpen = true;
        }
    }
    let state = buildDialogState(options);
    Alpine.bind($el, {
        ['x-id']: "['dialog', 'dialog-panel', 'dialog-button']",
        ['x-data']() {
            return {
                __dialog_isModal: modal || false,
                __dialog_dialogEl: null,
                __dialog_contentEl: $el,
                __dialog_autofocus: !noautofocus,
                __dialog_buttonEl: null,
                __dialog_state: state,
                async __dialog_showDialog() {
                    var _a, _b, _c;
                    if (!isDialogApiSupported())
                        return;
                    if ((_a = this.__dialog_dialogEl) === null || _a === void 0 ? void 0 : _a.open)
                        return;
                    if (this.__dialog_isModal) {
                        (_b = this.__dialog_dialogEl) === null || _b === void 0 ? void 0 : _b.showModal();
                    }
                    else {
                        (_c = this.__dialog_dialogEl) === null || _c === void 0 ? void 0 : _c.show();
                    }
                },
                async __dialog_closeDialog() {
                    if (!isDialogApiSupported())
                        return;
                    const animation = this.__dialog_dialogEl.style.animation;
                    // Force browser to restart animation by resetting it and forcing a reflow
                    this.__dialog_dialogEl.style.animation = 'none';
                    void this.__dialog_dialogEl.offsetWidth;
                    this.$nextTick(async () => {
                        var _a;
                        this.__dialog_dialogEl.style.animation = animation;
                        // Wait for animations to complete before closing the dialog (which adds display: none which would kill the animations)
                        await this.__dialog_waitForAnimations();
                        if (this.__dialog_state.isOpen)
                            return;
                        (_a = this.__dialog_dialogEl) === null || _a === void 0 ? void 0 : _a.close();
                    });
                },
                async __dialog_waitForAnimations() {
                    return await this.$waitForAnimations({
                        subtree: true,
                        target: this.__dialog_contentEl,
                    });
                },
                init() {
                    this.$watch('__dialog_state.isOpen', async (isOpen) => {
                        if (isOpen) {
                            this.__dialog_showDialog();
                        }
                        else {
                            this.__dialog_closeDialog();
                        }
                    });
                    this.$nextTick(() => {
                        if (!this.__dialog_dialogEl)
                            return;
                        const hasOpenAttribute = Alpine.bound(this.__dialog_dialogEl, 'open', false);
                        if (hasOpenAttribute || this.__dialog_state.isOpen) {
                            this.__dialog_state.isOpen = true;
                            this.__dialog_showDialog();
                        }
                    });
                },
            };
        },
    });
}
function buildDialogState(options) {
    var _a, _b;
    let state = {
        isOpen: (_a = options === null || options === void 0 ? void 0 : options.isOpen) !== null && _a !== void 0 ? _a : false,
        wasOpen: (_b = options === null || options === void 0 ? void 0 : options.isOpen) !== null && _b !== void 0 ? _b : false,
        open() {
            this.isOpen = true;
        },
        close() {
            this.isOpen = false;
        },
    };
    state = trackProperty(state, 'isOpen', 'wasOpen');
    if ((options === null || options === void 0 ? void 0 : options.isOpen) !== undefined) {
        copyProperty(options, state, 'isOpen');
    }
    return state;
}

/**
 * Plugin allowing the creation of popup elements. Popups are small overlays that open on demand, typically used to display
 * additional information, provide interactive content, or act as dropdown menus.
 *
 * Usage:
 * - x-popup - Applied to the root element of the popup, initializing the  popup functionality and adding a data context for child directives
 * - x-popup:popup - Specifies the actual popup element, which is displayed when the popup is active.
 * - x-popup:target - Specifies the target element that triggers the popup. Interaction with
 *   this element (e.g., click or hover) will control the display of the popup content.
 * - x-popup:float-reference - Optional directive that specifies the element that the popup should float itself in relation to (by default is the x-popup:target)
 * - x-popup:button - Adds the necessary attributes to an element to toggle the popup when clicked
 *
 * The '$popup' magic property provides an API for managing the popup's state, including
 * opening, closing, and querying its visibility. It allows for programmatic control over the
 * popup component.
 *
 * @example
 *
 * <div x-popup>
 *   <button x-popup:target x-popup:button>Toggle Popup</button>
 *   <div x-cloak x-popup:popup>
 *     I'm a popup!
 *   </div>
 * </div>
 *
 * Note: Add .nofloat modifier (e.g. x-popup:popup.nofloat) to disable floating behavior if you want to position the popup manually.
 */
function popup (Alpine) {
    Alpine.directive('popup', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'popup') {
            handlePopup($el, Alpine, data, utilities);
        }
        else if (data.value === 'target') {
            handleTarget$1($el, Alpine);
        }
        else if (data.value === 'float-reference') {
            handleFloatReference($el, Alpine);
        }
        else if (data.value == 'arrow') {
            handleArrow$2($el, Alpine);
        }
        else if (data.value === 'button') {
            handleButton$4($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot$i($el, Alpine, data, utilities);
        }
        else {
            throw new Error(`Unknown directive: x-popup:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('popup', handlePopupMagic(Alpine));
}
function handlePopupMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return mergeProperties({}, {
            get isOpen() {
                var _a;
                return (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.isExpanded;
            },
            set isOpen(value) {
                if (!$data.__disclosure_state)
                    return;
                $data.__disclosure_state.isExpanded = value;
            },
            open() {
                var _a;
                (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.expand();
            },
            close() {
                var _a;
                (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.collapse();
            },
            get targetEl() {
                return $data.__popup_targetEl;
            },
            get popupEl() {
                return $data.__popup_popupEl;
            },
            get floatReferenceEl() {
                return $data.__popup_floatReferenceEl;
            },
            set floatReferenceEl(el) {
                $data.__popup_floatReferenceEl = el;
            },
        }, handleFloatMagic(Alpine)($el));
    };
}
function handleButton$4($el, Alpine) {
    Alpine.bind($el, {
        'x-disclosure:button': '',
        'x-popup:target': '',
        'aria-haspopup': 'true',
    });
}
function handleFloatReference($el, Alpine) {
    Alpine.bind($el, {
        'x-init': '__popup_floatReferenceEl = $el',
    });
}
function handleTarget$1($el, Alpine) {
    Alpine.bind($el, {
        ':id': `$el.id || $id('popup-target')`,
        'x-init': '__popup_targetEl = $el',
        ':aria-expanded': '$popup.isOpen',
        ':aria-controls': '__popup_popupEl?.id',
    });
}
function handlePopup($el, Alpine, { modifiers, expression }, { evaluate }) {
    // Allow disabling x-float
    let shouldFloat = modifiers.includes('nofloat') ? false : true;
    let floatModifiers = modifiers.join('.') || 'bottom.auto';
    const floatOptions = expression ? evaluate(expression) : {};
    const shouldAutoClose = Alpine.$data($el).__popup_autoclose;
    Alpine.bind($el, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ ':id': `$el.id || $id('disclosure-panel')`, 'x-init': '__disclosure_contentEl = $el' }, (shouldFloat
        ? {
            'x-show': '$disclosure.isExpanded && $float.isPositioned',
        }
        : {
            'x-show': '$disclosure.isExpanded',
        })), { ':aria-labelledby': '__disclosure_buttonEl?.id', 'data-morph-children-only': '', 'x-data'() {
            return {
                init() {
                    this.$data.__popup_popupEl = $el;
                    if (shouldFloat) {
                        // TODO investigate hooking into Alpine's el._x_doShow / el._x_doHide hooks to enable / disable floating
                        if (this.$popup.isOpen) {
                            this.__popup_enableAutoUpdating();
                        }
                        this.$watch('$popup.isOpen', (isOpen) => {
                            if (isOpen) {
                                this.__popup_enableAutoUpdating();
                            }
                            else {
                                this.__popup_disableAutoUpdating();
                            }
                        });
                    }
                },
                __popup_enableAutoUpdating() {
                    // Wait until next tick to enable auto update to ensure that the float reference el exists and any other dom updates have been made
                    this.$nextTick(() => {
                        this.$float.referenceEl =
                            this.$data.__popup_floatReferenceEl ||
                                this.$data.__popup_targetEl;
                        this.$float.enableAutoUpdate();
                    });
                },
                __popup_disableAutoUpdating() {
                    this.$nextTick(() => {
                        var _a, _b;
                        this.$float.disableAutoUpdate();
                        (_b = (_a = this.$float).reset) === null || _b === void 0 ? void 0 : _b.call(_a);
                    });
                },
            };
        } }), (shouldFloat
        ? {
            [`x-float.${floatModifiers}`]() {
                return Object.assign(Object.assign({}, floatOptions), { autoUpdate: false, initialUpdate: false });
            },
        }
        : {})), { ':tabindex': '-1' }), (shouldAutoClose
        ? {
            '@keydown.escape.stop.prevent': `
            if (!$popup.isOpen) return

            $popup.close()

            if (__popup_returnFocusAfterClose) {
              await $disclosure.waitForAnimations()
              __popup_targetEl?.focus()
            }
          `,
            '@mousedown.outside': `
            if (!$popup.isOpen) return
            if (!__popup_autoclose) return
            if (__popup_popupEl?.contains($event.target)) return
            if (__popup_targetEl?.contains($event.target)) return
            $popup.close()
          `,
            '@focusin.window': `
            if (!$popup.isOpen) return
            if (!__popup_autoclose) return
            if (__popup_popupEl?.contains($event.target)) return
            if (__popup_targetEl?.contains($event.target)) return
            $popup.close()
          `,
        }
        : {})));
}
function handleArrow$2($el, Alpine) {
    Alpine.bind($el, {
        'x-float:arrow': '',
    });
}
function handleRoot$i($el, Alpine, { modifiers, expression }, { evaluate }) {
    let options = evaluate(expression === '' ? '{}' : expression);
    const disclosureModifiers = modifiers.filter((modifier) => ['open', 'noanimate'].includes(modifier));
    // Prevent popup from returning focus to the target element after closing
    const returnFocusAfterClose = !modifiers.includes('noreturn');
    // Prevent automatically closing the popup when clicking outside of it
    const autoclose = !modifiers.includes('noclose');
    Alpine.bind($el, {
        [`x-disclosure.${disclosureModifiers.join('.')}`]() {
            if (isPlainObject(options)) {
                // Rename isOpen property to isExpanded which is what the disclosure expects
                if ('isOpen' in options) {
                    renameProperty(options, 'isOpen', 'isExpanded');
                }
                if ('isInitiallyOpen' in options) {
                    renameProperty(options, 'isInitiallyOpen', 'isInitiallyExpanded');
                }
            }
            return options;
        },
        ['x-id']: "['popup', 'popup-target']",
        'x-data'() {
            return {
                __popup_returnFocusAfterClose: returnFocusAfterClose,
                __popup_autoclose: autoclose,
                __popup_targetEl: null,
                __popup_floatReferenceEl: null,
                __popup_popupEl: null,
                __popup_rootEl: $el,
            };
        },
    });
}

const selectors$1 = {
    listbox: '[role="listbox"]',
    listboxOption: '[role="option"]',
    enabledListboxOption: '[role="option"]:not([aria-disabled=true])',
};
// TODO consider folding this into select plugin
/**
 * Enables the creation and management of accessible listbox components, following ARIA practices.
 * The 'listbox' directive and '$listbox' magic property provide functionality for managing listbox
 * options, selection state, and keyboard interactions.
 *
 * See https://www.w3.org/WAI/ARIA/apg/patterns/listbox/ for more information about listboxes
 *
 * Note:
 * - Requires method-ui 'roving-tab' plugin
 * - Requires method-ui 'focus-match' plugin
 *
 * Usage:
 * - x-listbox (on <ul>, <ol>, or <div>) - Transforms the element into an Alpine.js-managed listbox.
 * - x-listbox:display - Binds to an element to display the selected value of the listbox.
 * - x-listbox:hidden-input   - Binds to an input element to store the selected value of the listbox.
 * - x-listbox:options - Defines the container for the listbox options.
 * - x-listbox:option  - Assigns to each listbox option, handling selection and keyboard navigation.
 *
 * The '$listbox' magic property provides an API for managing the listbox state, including methods
 * like 'select', 'deselect', and properties like 'selectedValue'
 *
 * @example
 *
 * <div x-listbox>
 *   <input type="hidden" name="my-input" x-listbox:hidden-input></span>
 *   <span x-listbox:display></span>
 *   <ul x-listbox:options>
 *     <li x-listbox:option="1">Option 1</li>
 *     <li x-listbox:option="2">Option 2</li>
 *     <li x-listbox:option="3">Option 3</li>
 *   </ul>
 * </div>
 */
function listbox (Alpine) {
    Alpine.directive('listbox', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'display') {
            handleDisplay$1($el, Alpine);
        }
        else if (data.value === 'hidden-input') {
            handleHiddenInput$1($el, Alpine);
        }
        else if (data.value === 'options') {
            handleOptions$2($el, Alpine);
        }
        else if (data.value === 'option') {
            handleOption$2($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot$h($el, Alpine);
        }
        else {
            throw new Error(`Unknown directive: x-listbox:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('listbox', handleListboxMagic(Alpine));
    Alpine.magic('listboxOption', handleListboxOptionMagic(Alpine));
}
function handleListboxMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        // TODO figure out a way to not have to manually bind these methods to the component like this
        return {
            isSelected(value) {
                return $data.__listbox_isSelected(value);
            },
            select(value, dispatch) {
                return $data.__listbox_select(value, dispatch);
            },
            deselect() {
                return $data.__listbox_deselect();
            },
            get selectedValue() {
                return $data.__listbox_selectedValue;
            },
            get options() {
                return $data.__listbox_options;
            },
            get enabledOptions() {
                return $data.__listbox_enabledOptions;
            },
        };
    };
}
function handleListboxOptionMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            get isSelected() {
                return $data.__listboxOption_isSelected;
            },
            get isDisabled() {
                return $data.__listboxOption_isDisabled;
            },
            select(options) {
                return $data.__listboxOption_select(options);
            },
        };
    };
}
function handleOptions$2($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            this.__listbox_optionsEl = $el;
        },
        'x-roving-tab:list': ``,
        ':id': `$el.id || $id('listbox-options')`,
        role: 'listbox',
        ':tabindex': '-1',
        ':aria-labelledby': '__listbox_displayValue?.id',
    });
}
function handleOption$2($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __listboxOption_isDisabled: false,
                init() {
                    this.__listboxOption_isDisabled = Boolean(Alpine.extractProp(this.$el, 'aria-disabled', false));
                    this.$nextTick(() => {
                        if (this.__listboxOption_isSelected && !this.__listboxOption_isDisabled) {
                            this.$rovingTab.setTabbable(this.$el);
                        }
                        else if (this.__listboxOption_isDisabled) {
                            this.$el.setAttribute('tabindex', '-1');
                        }
                    });
                    this.$watch('__listboxOption_isDisabled', (isDisabled) => {
                        if (isDisabled) {
                            this.$el.setAttribute('tabindex', '-1');
                        }
                    });
                },
                __listboxOption_select(options) {
                    if ((options === null || options === void 0 ? void 0 : options.disabled) !== true && this.__listboxOption_isDisabled)
                        return;
                    this.$data.__listbox_select(this.$el.getAttribute('value'), options === null || options === void 0 ? void 0 : options.dispatch);
                },
                get __listboxOption_isSelected() {
                    return this.$data.__listbox_isSelected(this.$el.getAttribute('value'));
                },
            };
        },
        role: 'option',
        ':aria-selected'() {
            return this.__listboxOption_isSelected;
        },
        ':aria-disabled'() {
            return this.__listboxOption_isDisabled;
        },
        '@click'() {
            if (this.$el.getAttribute('value') == null)
                return;
            this.$event.stopPropagation();
            this.$event.preventDefault();
            this.__listboxOption_select();
        },
        '@keydown.enter'() {
            if (this.$el.getAttribute('value') == null)
                return;
            this.$event.stopPropagation();
            this.$event.preventDefault();
            this.__listboxOption_select();
        },
        '@keydown.space'() {
            if (this.$el.getAttribute('value') == null)
                return;
            this.$event.stopPropagation();
            this.$event.preventDefault();
            this.__listboxOption_select();
        },
    });
}
function handleHiddenInput$1($el, Alpine) {
    Alpine.bind($el, {
        'x-init': `__listbox_hiddenInputEl = $el`,
        'x-model.fill': '$data.__listbox_selectedValue',
        'x-modelable': '$data.__listbox_selectedValue',
    });
}
function handleDisplay$1($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            this.__listbox_displayValue = $el;
        },
        'x-effect'() {
            if (this.__listbox_options.length == 0)
                return;
            if (this.__listbox_selectedOption) {
                Alpine.mutateDom(() => {
                    var _a;
                    const clonedSelectedOption = (_a = this.__listbox_selectedOption) === null || _a === void 0 ? void 0 : _a.cloneNode(true);
                    if (clonedSelectedOption) {
                        this.$el.replaceChildren(...clonedSelectedOption.childNodes);
                    }
                });
            }
            else {
                Alpine.mutateDom(() => {
                    // If there's no selected option, clear out the display value
                    this.$el.replaceChildren();
                });
            }
        },
        ':id': `$el.id || $id('listbox-display')`,
    });
}
function handleRoot$h($el, Alpine) {
    Alpine.bind($el, {
        'x-id': "['listbox', 'listbox-options', 'listbox-display']",
        'x-roving-tab.vertical.nowrap': `__listbox_enabledOptions`,
        ':id': `$el.id || $id('listbox')`,
        ['x-data']() {
            return listbox$1();
        },
    });
}
function listbox$1() {
    return {
        __listbox_displayValue: null,
        __listbox_optionsEl: null,
        __listbox_hiddenInputEl: null,
        __listbox_selectedValue: null,
        get __listbox_selectedOption() {
            var _a;
            return (((_a = this.__listbox_optionsEl) === null || _a === void 0 ? void 0 : _a.querySelector(`[value="${escapeValue(this.__listbox_selectedValue) || ''}"]`)) || null);
        },
        __listbox_select(value, dispatch = true) {
            this.__listbox_selectedValue = value;
            if (dispatch) {
                // Usage of next tick here ensures that the event is being dispatched _after_ the hidden input value has changed so that select integrates properly with forms
                this.$nextTick(() => {
                    this.$dispatch('change', value);
                    this.$dispatch('input', value);
                });
            }
        },
        __listbox_deselect() {
            this.__listbox_selectedValue = null;
        },
        __listbox_isSelected(value) {
            return this.__listbox_selectedValue === value;
        },
        get __listbox_options() {
            var _a;
            return (((_a = this.__listbox_optionsEl) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selectors$1.listboxOption)) ||
                []);
        },
        get __listbox_enabledOptions() {
            var _a;
            return (((_a = this.__listbox_optionsEl) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selectors$1.enabledListboxOption)) || []);
        },
    };
}
function escapeValue(value) {
    if (!isString(value))
        return null;
    return value === null || value === void 0 ? void 0 : value.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
}

/**
 * IMPORTANT: once custom-styled HTML selects have broad support we'll likely burn this in fire and just use that.
 *
 * Enable the creation and management of accessible select-only selects which provide an interface for selecting an
 * item from a list.

 * See https://www.w3.org/WAI/ARIA/apg/patterns/select/examples/select-select-only/ for more information about selects:
 * Partly inspired by https://react-spectrum.adobe.com/react-aria/Select.html
 *
 * Notes:
 * - Requires method-ui 'listbox' plugin
 * - Requires method-ui 'popover' plugin
 *
 * Directives:
 * - x-select - Applied to the root element of the select, initializing the select functionality and adding a data context for child directives
 * - x-select:button  - Binds to an input element to store the selected value of the select.
 * - x-select:options - Defines the container for the select options.
 * - x-select:option  - Assigns to each select option, handling selection and keyboard navigation. The children of the option will be rendered as the selected value of the select when it is closed.
 * - x-select:panel - Specifies the element that acts as the popup content for the select.
 * - x-select:target  - Indicates the target element for the popup, typically the input element.
 * - x-select:display - Renders the selected value of the select when it is closed
 *
 * The '$select' magic property merges the functionalities of '$listbox' and '$popup', providing
 * a comprehensive API for managing the select state, including selection, popup visibility, and
 * keyboard interactions.
 *
 * Usage with <label> elements:
 * x-select may be used in conjunction with HTML <label> elements using the `for` attribute.
 *
 * @example
 *
 * <label for="my-select">My Select</label>
 * <div x-select>
 *   <button x-select:button id="my-select">My Select</button>
 *   ...
 * </div>
 *
 * This will cause x-select to find the <label> element with the matching `for` attribute, add an id attribute
 * to the label element (if it does not already have one), and then add that to the generated aria-labelledby
 * attribute on the button
 * */
function select (Alpine) {
    Alpine.directive('select', ($el, data) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'label') {
            handleLabel($el, Alpine);
        }
        else if (data.value === 'button') {
            handleButton$3($el, Alpine);
        }
        else if (data.value === 'hidden-input') {
            handleHiddenInput($el, Alpine);
        }
        else if (data.value === 'display') {
            handleDisplay($el, Alpine);
        }
        else if (data.value === 'options') {
            handleOptions$1($el, Alpine);
        }
        else if (data.value === 'option') {
            handleOption$1($el, Alpine, data);
        }
        else if (data.value === 'panel') {
            handlePanel$2($el, Alpine, data);
        }
        else if (data.value === null) {
            handleRoot$g($el, Alpine, data);
        }
        else {
            throw new Error(`Unknown directive: x-select:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('select', handleSelectMagic(Alpine));
}
function handleSelectMagic(Alpine) {
    return function ($el) {
        return mergeProperties({}, handleListboxMagic(Alpine)($el), handlePopupMagic(Alpine)($el));
    };
}
function handleButton$3($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __select_onKeyDown(e) {
                    if (isPrintableCharacter(e.key)) {
                        // Mark that we're opening via keydown so autofocus logic can skip
                        this.$data.__select_openingViaKeydown = true;
                        this.$select.open();
                        this.$nextTick(() => {
                            requestAnimationFrame(() => {
                                this.$focusMatch.setFocusByFirstCharacter(e.key);
                                // Clear the flag after focus-match has had a chance to run
                                setTimeout(() => {
                                    this.$data.__select_openingViaKeydown = false;
                                }, 150);
                            });
                        });
                    }
                },
            };
        },
        'x-init': '__select_buttonEl = $el',
        'x-popover:button': '',
        ':tabindex': '0',
        ':id': "$el.id || $id('select-button')",
        ':aria-labelledby': "[__select_displayEl?.id || $el.id, __select_labelEl?.id].filter(Boolean).join(' ')",
        ':aria-controls': '__listbox_optionsEl?.id',
        'aria-haspopup': 'listbox',
        '@keydown.down.stop.prevent': '$popup.open()',
        '@keydown': '__select_onKeyDown',
    });
}
function handleHiddenInput($el, Alpine) {
    Alpine.bind($el, {
        'x-listbox:hidden-input': '',
    });
}
function handleDisplay($el, Alpine) {
    Alpine.bind($el, {
        'x-init': '__select_displayEl = $el',
        'x-listbox:display': '',
    });
}
function handleLabel($el, Alpine) {
    Alpine.bind($el, {
        'x-init': '__select_labelEl = $el',
        ':id': "$el.id || $id('select-label')",
    });
}
function handlePanel$2($el, Alpine, data) {
    Alpine.bind($el, Object.assign(Object.assign({}, (data.modifiers.length
        ? {
            [`x-popover:panel.notrap.${data.modifiers.join('.')}`]: '',
        }
        : {
            [`x-popover:panel.bottom-start.flip.match.update.shift.fit-y.pad.5px.notrap`]: '',
        })), { 'x-trap.noreturn.noautofocus': '$popup.isOpen', 
        // Unset aria-labelledby as we want the listbox to be the thing that is labelled
        ':aria-labelledby': 'null', 'x-init': '__select_panelEl = $el' }));
}
function handleOptions$1($el, Alpine) {
    Alpine.bind($el, {
        'x-init': '__select_optionsEl = $el',
        'x-listbox:options': '',
        'x-focus-match:list': ``,
        ':aria-labelledby': '__select_labelEl?.id || __select_buttonEl?.id',
        tabindex: '-1',
        ['x-data']() {
            return {
                init() {
                    this.$watch('$popup.isOpen', (open) => {
                        if (!open)
                            return;
                        // Skip autofocus if we're opening via keydown (focus-match will handle it)
                        if (this.$data.__select_openingViaKeydown) {
                            return;
                        }
                        // Use the unified focus handler from root component
                        if (this.$data.__select_handleOpenFocus) {
                            this.$data.__select_handleOpenFocus();
                        }
                    });
                },
            };
        },
    });
}
function handleOption$1($el, Alpine, { expression }) {
    Alpine.bind($el, {
        'x-listbox:option': expression,
    });
}
function handleRoot$g($el, Alpine, { modifiers, expression }) {
    Alpine.bind($el, {
        [`x-popover.${modifiers.join('.')}`]: expression || '',
        'x-listbox': '',
        'x-focus-match': `$listbox.enabledOptions`,
        ':aria-labelledby': 'null',
        'x-id': "['select-button', 'select-label']",
        'x-scroll-lock': '$popup.isOpen',
        // Close popup when option is selected and return focus to button
        '@change': `
      if ($popup.isOpen) {
        $popup.close()
        await $disclosure.waitForAnimations()
        __select_buttonEl.focus()
      }
    `,
        ['x-data']() {
            return {
                __select_displayEl: null,
                __select_buttonEl: null,
                __select_panelEl: null,
                __select_optionsEl: null,
                __select_labelEl: null,
                __select_openingViaKeydown: false,
                __select_handleOpenFocus() {
                    const allOptions = Array.from(this.$listbox.options || []);
                    const ariaSelectedOption = allOptions.find((option) => option.getAttribute('aria-selected') === 'true');
                    const firstOption = allOptions[0];
                    const initiallySelectedOption = ariaSelectedOption || firstOption;
                    if (initiallySelectedOption) {
                        setTimeout(() => {
                            initiallySelectedOption.focus();
                        }, 100);
                    }
                },
                init() {
                    this.$nextTick(() => {
                        var _a, _b;
                        // Wait until next animation frame to prevent interfering with initial focus
                        window.requestAnimationFrame(() => {
                            const allOptions = Array.from(this.$listbox.options || []);
                            const ariaSelectedOption = allOptions.find((option) => option.getAttribute('aria-selected') === 'true');
                            const firstOption = allOptions[0];
                            const initiallySelectedOption = ariaSelectedOption || firstOption;
                            if (initiallySelectedOption) {
                                const $optionData = Alpine.$data(initiallySelectedOption);
                                $optionData.__listboxOption_select({ dispatch: false, disabled: true });
                            }
                        });
                        // If no explicit label is provided with `x-select:label`, try to find an label related to the button with for="button-id"
                        // then assign a unique id to that label el
                        if (!this.__select_labelEl && this.__select_buttonEl) {
                            this.__select_labelEl = document.querySelector(`[for="${(_a = this.__select_buttonEl) === null || _a === void 0 ? void 0 : _a.id}"]`);
                            if (this.__select_labelEl && !((_b = this.__select_labelEl) === null || _b === void 0 ? void 0 : _b.id)) {
                                this.__select_labelEl.id = this.$id('select-label');
                            }
                        }
                    });
                },
            };
        },
    });
}

const selectors = {
    tablist: '[role="tablist"]',
    tab: '[role="tab"]',
    tabpanel: '[role="tabpanel"]',
};
function parseExplicitIndex(expression, evaluate) {
    if (expression == null || expression === '')
        return undefined;
    const v = evaluate(expression);
    const n = Number(v);
    return Number.isInteger(n) ? n : undefined;
}
/**
 * Enables the creation and management of accessible tabs components, following ARIA practices.
 * The 'tabs' directive and '$tabs' magic property provide functionality for managing tabs
 * options, selection state, and keyboard interactions.
 *
 * See https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ for more information about listboxes
 *
 * TODO document directives
 *
 * The '$tabs' magic property provides an API for managing the tabs state, including methods
 * like 'select', and properties like 'isSelected'
 *
 * @example
 *
 * <div x-tabs>
 *   <ul x-tabs:tablist>
 *     <li :class="$tabs.isSelected(0) ? 'bg-primary' : 'bg-transparent'">
 *       <button type="button" x-tabs:tab>Tab 1</button>
 *     </li>
 *     <li :class="$tabs.isSelected(1) ? 'bg-primary' : 'bg-transparent'">
 *       <button type="button" x-tabs:tab>Tab 2</button>
 *     </li>
 *     <li :class="$tabs.isSelected(2) ? 'bg-primary' : 'bg-transparent'">
 *       <button type="button" x-tabs:tab>Tab 3</button>
 *     </li>
 *   </ul>
 *   <div x-tabs:tabpanel>Panel 1</div>
 *   <div x-tabs:tabpanel x-cloak>Panel 2</div>
 *   <div x-tabs:tabpanel x-cloak>Panel 3</div>
 * </div>
 *
 * @example With explicit indices (for when DOM order may not match tab order, e.g. section reloads)
 *
 * <div x-tabs>
 *   <ul x-tabs:tablist>
 *     <li><button type="button" x-tabs:tab="0">Tab 1</button></li>
 *     <li><button type="button" x-tabs:tab="1">Tab 2</button></li>
 *   </ul>
 *   <div x-tabs:tabpanel="0">Panel 1</div>
 *   <div x-tabs:tabpanel="1" x-cloak>Panel 2</div>
 * </div>
 */
var tabs = (Alpine) => {
    Alpine.directive('tabs', ($el, data, utilities) => {
        if (data.value == 'tab') {
            handleTab($el, Alpine, data, utilities);
        }
        else if (data.value == 'tablist') {
            handleTabList($el, Alpine, data, utilities);
        }
        else if (data.value == 'tabpanel') {
            handleTabPanel($el, Alpine, data, utilities);
        }
        else if (data.value == null) {
            handleRoot$f($el, Alpine, data, utilities);
        }
        else {
            throw new Error(`Unknown directive: x-tabs:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('tabs', handleTabsMagic(Alpine));
    Alpine.magic('tab', handleTabMagic(Alpine));
};
function handleTabsMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            select(index) {
                var _a;
                (_a = $data.__disclosure_group_state) === null || _a === void 0 ? void 0 : _a.expand(index);
            },
            isSelected(index) {
                var _a;
                return (_a = $data.__disclosure_group_state) === null || _a === void 0 ? void 0 : _a.isExpanded(index);
            },
            get selectedIndex() {
                var _a;
                if (!$data.__disclosure_group_state)
                    return null;
                return (_a = $data.__disclosure_group_state) === null || _a === void 0 ? void 0 : _a.expandedIndex;
            },
            get tabCount() {
                var _a;
                return Array.from((_a = $data.__disclosure_group_state) === null || _a === void 0 ? void 0 : _a.items).length || 0;
            },
        };
    };
}
// This works for both tabs and tab panels
function handleTabMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            select() {
                $data.__tab_select();
            },
            get isSelected() {
                return $data.__tab_isSelected;
            },
            get index() {
                return $data.__tab_index;
            },
        };
    };
}
function handleTab($el, Alpine, { expression }, { evaluate }) {
    const explicitIndex = parseExplicitIndex(expression, evaluate);
    Alpine.bind($el, {
        'x-data'() {
            return {
                get __tab_isSelected() {
                    return this.$disclosureGroup.isExpanded(this.__tab_index);
                },
                __tab_select() {
                    this.$disclosureGroup.expand(this.__tab_index);
                },
                get __tab_index() {
                    if (explicitIndex !== undefined)
                        return explicitIndex;
                    return Array.from(this.__tabs_getTabEls()).indexOf($el);
                },
                get __tab_ariaControls() {
                    var _a;
                    const group = this.$disclosureGroup;
                    const panel = Array.from(group.items).find((el) => group.indexOf(el) === this.__tab_index);
                    return (_a = panel === null || panel === void 0 ? void 0 : panel.id) !== null && _a !== void 0 ? _a : undefined;
                },
            };
        },
        'x-id': "['tab']",
        ':id': `$id('tab')`,
        ':role': "'tab'",
        '@click': `$tab.select()`,
        '@mousedown.prevent': '',
        '@focus': `if (!window.matchMedia('(pointer: coarse)').matches) $tab.select()`, // Disable automatic select on touch devices
        ':tabindex': `$tab.isSelected ? 0 : -1`,
        ':data-tab-index': '__tab_index',
        ':aria-selected': `$disclosureGroup.isExpanded(__tab_index)`,
        ':aria-controls': '__tab_ariaControls',
    });
}
function handleTabList($el, Alpine, {}, {}) {
    Alpine.bind($el, {
        'x-roving-tab:list': ``,
        ':role': "'tablist'",
        ':aria-orientation': `__tabs_orientation`,
        '@keydown.home.prevent.stop': '$focus.first()',
        '@keydown.page-up.prevent.stop': '$focus.first()',
        '@keydown.end.prevent.stop': '$focus.last()',
        '@keydown.page-down.prevent.stop': '$focus.last()',
    });
}
function handleTabPanel($el, Alpine, { modifiers, expression }, { evaluate }) {
    const disclosureModifiers = modifiers.filter((modifier) => ['debug', 'open', 'static'].includes(modifier));
    const explicitIndex = parseExplicitIndex(expression, evaluate);
    if (explicitIndex !== undefined) {
        $el.setAttribute('data-tab-index', String(explicitIndex));
    }
    Alpine.bind($el, Object.assign(Object.assign({ 'x-data'() {
            return {
                get __tab_isSelected() {
                    return this.$disclosure.isExpanded;
                },
                __tab_select() {
                    this.$disclosure.expand();
                },
                get __tab_index() {
                    return this.$disclosure.groupIndex;
                },
                get __tab_ariaLabelledby() {
                    var _a;
                    let el = this.$el.parentElement;
                    while (el) {
                        const data = Alpine.$data(el);
                        if (typeof (data === null || data === void 0 ? void 0 : data.__tabs_getTabListEl) === 'function') {
                            const tabs = Array.from(((_a = data.__tabs_getTabListEl()) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selectors.tab)) || []);
                            const panelIdx = this.$disclosureGroup.indexOf(this.$el);
                            const tab = tabs.find((tabEl, domIdx) => {
                                const e = tabEl.getAttribute('data-tab-index');
                                return (e !== null ? parseInt(e, 10) : domIdx) === panelIdx;
                            });
                            return tab === null || tab === void 0 ? void 0 : tab.id;
                        }
                        el = el.parentElement;
                    }
                    return undefined;
                },
            };
        }, 'x-id': "['tab-panel']", ':id': `$id('tab-panel')`, role: 'tabpanel' }, (disclosureModifiers.length
        ? {
            [`x-disclosure.noanimate.${disclosureModifiers.join('.')}`]: '',
        }
        : {
            'x-disclosure.noanimate': '',
        })), { 'x-disclosure:panel': '', ':aria-labelledby': '__tab_ariaLabelledby', ':tabindex': `$disclosure.isExpanded ? 0 : -1` }));
}
function handleRoot$f($el, Alpine, { modifiers, expression }, { evaluate }) {
    const orientation = modifiers.includes('vertical') ? 'vertical' : 'horizontal';
    let options = evaluate(expression === '' ? '{}' : expression);
    Alpine.bind($el, Object.assign({ ['x-data']() {
            return {
                __tabs_rootEl: $el,
                __tabs_orientation: orientation || 'horizontal',
                __tabs_getTabListEl() {
                    return $el.querySelector(selectors.tablist);
                },
                __tabs_getTabEls() {
                    var _a;
                    return ((_a = this.__tabs_getTabListEl()) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selectors.tab)) || [];
                },
            };
        }, ':data-selected-index': '__disclosure_group_state.expandedIndex', 'x-disclosure-group'() {
            let disclosureGroupOptions = {};
            // Rename selectedIndex property to expandedIndex which is what the disclosure group expects
            if ('selectedIndex' in options) {
                copyProperty(options, disclosureGroupOptions, 'selectedIndex', 'expandedIndex');
            }
            else {
                disclosureGroupOptions.initiallyExpandedIndex = 0;
            }
            // Support explicit tab indices via data-tab-index (set by x-tabs:tabpanel="n")
            disclosureGroupOptions.getIndex = (el) => {
                const idx = el.getAttribute('data-tab-index');
                return idx !== null ? parseInt(idx, 10) : undefined;
            };
            return disclosureGroupOptions;
        } }, (orientation == 'vertical'
        ? {
            'x-roving-tab.vertical': '__tabs_getTabEls',
        }
        : {
            'x-roving-tab': '__tabs_getTabEls',
        })));
    return {};
}

function section (Alpine) {
    Alpine.store('sectionData', {});
    /**
     * Get and set data for the closest ancestor section in a global Alpien store keyed by section id
     * This is most useful for the theme editor when you want to maintain state between section content updates
     */
    Alpine.magic('sectionData', ($el) => {
        var _a;
        const sectionId = (_a = closestSectionEl($el)) === null || _a === void 0 ? void 0 : _a.id;
        return new Proxy({}, {
            get(_target, prop) {
                if (!sectionId)
                    return null;
                if (!(sectionId in Alpine.store('sectionData')))
                    return null;
                return Alpine.store('sectionData')[sectionId][prop];
            },
            set(_target, prop, value) {
                if (!sectionId)
                    return false;
                if (!(sectionId in Alpine.store('sectionData'))) {
                    Alpine.store('sectionData')[sectionId] = {};
                }
                Alpine.store('sectionData')[sectionId][prop] = value;
                return true;
            },
        });
    });
    Alpine.magic('sectionEl', ($el) => {
        return closestSectionEl($el);
    });
    Alpine.magic('sectionId', ($el) => {
        var _a;
        const rawId = (_a = closestSectionEl($el)) === null || _a === void 0 ? void 0 : _a.id;
        if (!rawId)
            return null;
        if (rawId.startsWith('shopify-section-')) {
            return rawId.split('shopify-section-')[1];
        }
        else {
            return rawId;
        }
    });
}

const DATA_EXCLUDE_SUBTREE_ATTRIBUTE = 'data-skip-animation-wait';
const DEFAULT_EXCLUDE_SUBTREE_FILTER = (element) => element.hasAttribute(DATA_EXCLUDE_SUBTREE_ATTRIBUTE);
const ANIMATION_START_TIMEOUT = 50; // ms
const ANIMATION_COMPLETION_TIMEOUT = 2000; // ms
function animationUtils (Alpine) {
    Alpine.magic('waitForAnimations', function ($el) {
        return async function (options) {
            var _a;
            const parentEl = (_a = options === null || options === void 0 ? void 0 : options.target) !== null && _a !== void 0 ? _a : $el;
            const animations = await getPendingAnimations(parentEl, options);
            return getCompletedAnimations(parentEl, animations, options === null || options === void 0 ? void 0 : options.subtree, options === null || options === void 0 ? void 0 : options.excludeSubtree);
        };
    });
}
/**
 * Returns a promise that resolves when all animations on the element have started. Waits for a short period of time, and if no animations have started it will reject with an error
 *
 * @param $el Element to check for animations
 * @returns
 */
async function getPendingAnimations($el, options = {}) {
    return new Promise((resolve, reject) => {
        let startTimeout = ANIMATION_START_TIMEOUT;
        if ((options === null || options === void 0 ? void 0 : options.startTimeout) !== undefined) {
            if (options.startTimeout === false) {
                startTimeout = 0;
            }
            else {
                startTimeout = options.startTimeout;
            }
        }
        // Wait for a short period of time, and if no animations have started output an error
        setTimeout(() => {
            let animations = $el.getAnimations(options);
            if (options.excludeSubtree) {
                animations = filterSubtreeAnimations($el, animations, options.excludeSubtree);
            }
            if (animations.length === 0) {
                warnForNoAnimationsStarted($el, options === null || options === void 0 ? void 0 : options.subtree);
                resolve([]);
            }
            else {
                resolve(animations);
            }
        }, startTimeout);
    });
}
/**
 * Returns a promise that resolves when all animations on the element have finished, or rejects if any animations don't finish within a timeout
 * @param $el Element animations are occuring on
 * @param animations Animations to wait for
 * @param subtree Whether to include animations in subtree
 * @param excludeSubtree Optional filter to exclude certain animations in subtree
 */
async function getCompletedAnimations($el, animations, subtree = false, excludeSubtree = DEFAULT_EXCLUDE_SUBTREE_FILTER) {
    let timedOutAnimations = [];
    let filteredAnimations = filterSubtreeAnimations($el, animations, excludeSubtree);
    const animationPromises = filteredAnimations.map((animation) => animation.finished);
    await promiseAllSettledWithTimeout(animationPromises, ANIMATION_COMPLETION_TIMEOUT).then((results) => {
        results.forEach((result, i) => {
            if (result.status === 'rejected' && result.reason === 'timeout') {
                timedOutAnimations = [...timedOutAnimations, filteredAnimations[i]];
            }
        });
    });
    if (timedOutAnimations.length > 0) {
        warnForNoAnimationsFinished($el, filteredAnimations, timedOutAnimations, subtree);
        return [];
    }
    return filteredAnimations;
}
function warnForNoAnimationsStarted($el, subtree = false) {
    if (process.env.NODE_ENV !== 'development')
        return;
    if (subtree) {
        console.warn(`Expected animations or transitions to start on element or its descendants, but none did after waiting ${ANIMATION_START_TIMEOUT}ms`, $el);
    }
    else {
        console.warn(`Expected animations or transitions to start on element, but none did after waiting ${ANIMATION_START_TIMEOUT}ms`, $el);
    }
}
function warnForNoAnimationsFinished($el, started, unfinished, subtree = false) {
    if (process.env.NODE_ENV !== 'development')
        return;
    if (subtree) {
        console.warn(`Expected all animations or transitions on element and its descendants to finish within ${ANIMATION_COMPLETION_TIMEOUT}ms, but ${unfinished.length} of ${started.length} did not`, $el, unfinished);
    }
    else {
        console.warn(`Expected all animations or transitions on element to finish within ${ANIMATION_COMPLETION_TIMEOUT}ms, but ${unfinished.length} of ${started.length} did not`, $el, unfinished);
    }
}
function promiseAllSettledWithTimeout(promises, timeoutMs) {
    return Promise.allSettled(promises.map((promise) => withTimeout(promise, timeoutMs)));
}
async function withTimeout(promise, timeoutMs) {
    let timeoutHandle;
    const timeoutPromise = new Promise((_resolve, reject) => {
        timeoutHandle = setTimeout(() => {
            reject('timeout');
        }, timeoutMs);
    });
    return Promise.race([promise, timeoutPromise])
        .then((result) => {
        clearTimeout(timeoutHandle);
        return result;
    })
        .catch((error) => {
        clearTimeout(timeoutHandle);
        throw error;
    });
}
function isKeyframeEffect(effect) {
    return effect instanceof KeyframeEffect;
}
/**
 * Filters out any animations who's target element matches the filter or any of its ancestors
 * @param animations
 * @param filter
 */
function filterSubtreeAnimations(rootEl, animations, filter) {
    // Traverse up the tree from the animated element to the root element, and check if any of the ancestors are excluded by the filter
    const hasExcludedAncestor = (animatedElement) => {
        let parent = animatedElement.parentElement;
        if (animatedElement === rootEl) {
            return false;
        }
        if (parent === rootEl) {
            return false;
        }
        while (parent) {
            if (filter(parent))
                return true;
            parent = parent.parentElement;
        }
        return false;
    };
    // Only return animations that are not excluded by the filter
    return animations.filter((animation) => {
        if (isKeyframeEffect(animation.effect)) {
            const target = animation.effect.target;
            if (!target) {
                return true;
            }
            if (filter(target)) {
                return false;
            }
            return !hasExcludedAncestor(target);
        }
        else {
            return true;
        }
    });
}

/**
 * TODO docs
 */
function notification (Alpine) {
    Alpine.directive('notification', ($el, data, utilities) => {
        handleNotification($el, Alpine, data);
    }).before('bind');
    Alpine.magic('notification', handleNotificationMagic(Alpine));
}
function handleNotificationMagic(Alpine) {
    return function ($el) {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        const $data = Alpine.$data($el);
        return {
            dismiss: $data.__notification_dismiss.bind($data),
            startTimer: $data.__notification_startTimer.bind($data),
            cancelTimer: $data.__notification_cancelTimer.bind($data),
            get visible() {
                return $data.__notification_visible;
            },
        };
    };
}
function handleNotification($el, Alpine, { modifiers }, _utilities) {
    let duration = 5000;
    if (modifiers.includes('duration')) {
        const rawValue = modifiers[modifiers.indexOf('duration') + 1];
        let match = rawValue.match(/([0-9]+)ms/);
        if (match)
            duration = Number(match[1]);
    }
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __notification_intervalId: undefined,
                __notification_duration: duration,
                __notification_previousActiveElement: null,
                init() {
                    this.$nextTick(() => {
                        this.$watch('$disclosure.isExpanded', (expanded, wasExpanded) => {
                            if (expanded && !wasExpanded) {
                                this.__notification_previousActiveElement = document.activeElement;
                                if (this.__notification_duration !== Infinity) {
                                    this.__notification_startTimer();
                                }
                            }
                        });
                    });
                },
                destroy() {
                    this.__notification_cancelTimer();
                },
                __notification_cancelTimer() {
                    clearTimeout(this.__notification_intervalId);
                    this.__notification_intervalId = undefined;
                },
                __notification_startTimer() {
                    this.__notification_cancelTimer();
                    this.__notification_intervalId = setTimeout(() => {
                        this.__notification_dismiss();
                    }, this.__notification_duration);
                },
                get __notification_visible() {
                    return this.$disclosure.isExpanded;
                },
                __notification_dismiss() {
                    this.__notification_cancelTimer();
                    this.$disclosure.collapse();
                    if (this.__notification_previousActiveElement) {
                        this.$nextTick(() => {
                            var _a;
                            if (this.$popup.isOpen)
                                return;
                            (_a = this.__notification_previousActiveElement) === null || _a === void 0 ? void 0 : _a.focus();
                            this.__notification_previousActiveElement = null;
                        });
                    }
                },
            };
        },
        role: 'alert',
        'x-popover': '',
        'x-popover:panel.nofloat': '',
        '@focusin': '$isKeyboardActive && $notification.cancelTimer()',
        '@focusout': '$disclosure.isExpanded && $notification.startTimer()',
        'x-hover:start': '$notification.cancelTimer()',
        'x-hover:end': '$disclosure.isExpanded && $notification.startTimer()',
    });
    return {};
}

/**
 * Enables the creation of range components.
 * The 'x-range' directive provides functionality for managing dual-range input fields with synchronized min and max values.
 *
 * Usage:
 * - x-range - The root element of the range component, initializing the range functionality and adding a data context for child directives.
 * - x-range:number-min - A number input element for the minimum value. Automatically syncs with the range slider and enforces min/max constraints.
 * - x-range:number-max - A number input element for the maximum value. Automatically syncs with the range slider and enforces min/max constraints.
 * - x-range:range-min - A range input element for the minimum value. Use the 'fill' modifier (x-range:range-min.fill) to fill the value with the min limit when empty.
 * - x-range:range-max - A range input element for the maximum value. Use the 'fill' modifier (x-range:range-max.fill) to fill the value with the max limit when empty.
 *
 * Note: The 'fill' modifier is not used by default because range inputs automatically set a default value when empty, which would populate number inputs and remove their placeholder state. Use 'fill' when you only have range inputs (no number inputs) and want them to display limit values when empty.
 *
 * The $range magic provides access to:
 * - minLimit - The minimum limit value from the input elements
 * - maxLimit - The maximum limit value from the input elements
 * - minValue - The current minimum value
 * - maxValue - The current maximum value
 * - isDormant - Whether the range is at its default state (min at minLimit and max at maxLimit)
 *
 * @example
 *
 * <div x-range>
 *   <input type="number" min="0" max="100" x-range:number-min>
 *   <input type="range" min="0" max="100" x-range:range-min>
 *   <input type="range" min="0" max="100" x-range:range-max>
 *   <input type="number" min="0" max="100" x-range:number-max>
 * </div>
 *
 * @example
 * Range inputs only (use fill modifier):
 *
 * <div x-range>
 *   <input type="range" min="0" max="100" x-range:range-min.fill>
 *   <input type="range" min="0" max="100" x-range:range-max.fill>
 * </div>
 *
 */
function range (Alpine) {
    Alpine.directive('range', ($el, data) => {
        if (data.value == 'number-min') {
            handleNumberMin($el, Alpine);
        }
        else if (data.value == 'number-max') {
            handleNumberMax($el, Alpine);
        }
        else if (data.value == 'range-min') {
            handleRangeMin($el, data, Alpine);
        }
        else if (data.value == 'range-max') {
            handleRangeMax($el, data, Alpine);
        }
        else if (data.value == null) {
            handleRoot$e($el, Alpine);
        }
        else {
            throw new Error(`Unknown directive: x-range:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('range', ($el) => {
        const $data = Alpine.$data($el);
        return {
            get minLimit() {
                return $data.__range_minLimit;
            },
            get maxLimit() {
                return $data.__range_maxLimit;
            },
            get minValue() {
                return $data.__range_minValue;
            },
            get maxValue() {
                return $data.__range_maxValue;
            },
            get isDormant() {
                return $data.__range_isDormant;
            },
        };
    });
}
function handleNumberMin($el, Alpine) {
    if (isInputNumberElement($el)) {
        Alpine.bind($el, {
            'x-init'() {
                // Use queueMicrotask to ensure Alpine's reactivity system is fully initialized
                // before setting up the effect that reads bound attributes
                queueMicrotask(() => {
                    Alpine.effect(() => {
                        const min = Alpine.bound(this.$el, 'min', null);
                        const max = Alpine.bound(this.$el, 'max', null);
                        const minNum = min !== null ? Number(min) : null;
                        const maxNum = max !== null ? Number(max) : null;
                        // Validate that limits are actual numbers (not NaN) before storing
                        this.$data.__range_minLimit = minNum !== null && !isNaN(minNum) ? minNum : null;
                        this.$data.__range_maxLimit = maxNum !== null && !isNaN(maxNum) ? maxNum : null;
                    });
                });
            },
            'x-model.number.fill': '__range_minValue',
            '@input'() {
                // When min value exceeds or equals max value, adjust max by one step increment
                // to maintain valid range. Uses step value (not hardcoded +1) to respect input's step attribute.
                // Note: <= allows equality to trigger adjustment, preventing min === max edge cases.
                if (this.$data.__range_maxValue !== null &&
                    this.$data.__range_minValue !== null &&
                    this.$data.__range_maxValue <= this.$data.__range_minValue) {
                    const step = getStepValue(this.$el);
                    this.$data.__range_maxValue = getNextStepValue(this.$data.__range_minValue, step, this.$data.__range_maxLimit);
                }
            },
        });
    }
    else {
        throw new Error(`Expected <input type="number"> tag for x-range:number-min but got ${$el}`);
    }
}
function handleNumberMax($el, Alpine) {
    if (isInputNumberElement($el)) {
        Alpine.bind($el, {
            'x-init'() {
                // Use queueMicrotask to ensure Alpine's reactivity system is fully initialized
                // before setting up the effect that reads bound attributes
                queueMicrotask(() => {
                    Alpine.effect(() => {
                        const min = Alpine.bound(this.$el, 'min', null);
                        const max = Alpine.bound(this.$el, 'max', null);
                        const minNum = min !== null ? Number(min) : null;
                        const maxNum = max !== null ? Number(max) : null;
                        // Validate that limits are actual numbers (not NaN) before storing
                        this.$data.__range_minLimit = minNum !== null && !isNaN(minNum) ? minNum : null;
                        this.$data.__range_maxLimit = maxNum !== null && !isNaN(maxNum) ? maxNum : null;
                    });
                });
            },
            'x-model.number.fill': '__range_maxValue',
            '@input'() {
                // When max value falls below or equals min value, adjust min by one step decrement
                // to maintain valid range. Uses step value to respect input's step attribute.
                if (this.$data.__range_maxValue !== null &&
                    this.$data.__range_minValue !== null &&
                    this.$data.__range_maxValue <= this.$data.__range_minValue) {
                    const step = getStepValue(this.$el);
                    this.$data.__range_minValue = getPreviousStepValue(this.$data.__range_maxValue, step, this.$data.__range_minLimit);
                }
            },
        });
    }
    else {
        throw new Error(`Expected <input type="number"> tag for x-range:number-max but got ${$el}`);
    }
}
function handleRangeMin($el, data, Alpine) {
    const fill = data.modifiers.includes('fill');
    if (isInputRangeElement($el)) {
        Alpine.bind($el, {
            'x-init'() {
                // Use queueMicrotask to ensure Alpine's reactivity system is fully initialized
                // before setting up the effect that reads bound attributes
                queueMicrotask(() => {
                    Alpine.effect(() => {
                        const min = Alpine.bound(this.$el, 'min', null);
                        const max = Alpine.bound(this.$el, 'max', null);
                        const minNum = min !== null ? Number(min) : null;
                        const maxNum = max !== null ? Number(max) : null;
                        // Validate that limits are actual numbers (not NaN) before storing
                        this.$data.__range_minLimit = minNum !== null && !isNaN(minNum) ? minNum : null;
                        this.$data.__range_maxLimit = maxNum !== null && !isNaN(maxNum) ? maxNum : null;
                    });
                });
            },
            // Custom getter/setter for range inputs: when value is null/undefined, fallback to minLimit
            // This allows range inputs to display the limit value when empty (with fill modifier)
            // while keeping number inputs empty to preserve their placeholder state
            [`x-model.number${fill ? '.fill' : ''}`]() {
                const $data = Alpine.$data($el);
                return {
                    get() {
                        var _a;
                        return (_a = $data.__range_minValue) !== null && _a !== void 0 ? _a : $data.__range_minLimit;
                    },
                    set(value) {
                        $data.__range_minValue = value;
                    },
                };
            },
            '@input'() {
                // Collision handling: when min range slider exceeds max, adjust max by step increment
                if (this.$data.__range_maxValue !== null &&
                    this.$data.__range_minValue !== null &&
                    this.$data.__range_maxValue <= this.$data.__range_minValue) {
                    const step = getStepValue(this.$el);
                    this.$data.__range_maxValue = getNextStepValue(this.$data.__range_minValue, step, this.$data.__range_maxLimit);
                }
            },
        });
    }
    else {
        throw new Error(`Expected <input type="range"> tag for x-range:range-min but got ${$el}`);
    }
}
function handleRangeMax($el, data, Alpine) {
    const fill = data.modifiers.includes('fill');
    if (isInputRangeElement($el)) {
        Alpine.bind($el, {
            'x-init'() {
                // Use queueMicrotask to ensure Alpine's reactivity system is fully initialized
                // before setting up the effect that reads bound attributes
                queueMicrotask(() => {
                    Alpine.effect(() => {
                        const min = Alpine.bound(this.$el, 'min', null);
                        const max = Alpine.bound(this.$el, 'max', null);
                        const minNum = min !== null ? Number(min) : null;
                        const maxNum = max !== null ? Number(max) : null;
                        // Validate that limits are actual numbers (not NaN) before storing
                        this.$data.__range_minLimit = minNum !== null && !isNaN(minNum) ? minNum : null;
                        this.$data.__range_maxLimit = maxNum !== null && !isNaN(maxNum) ? maxNum : null;
                    });
                });
            },
            // Custom getter/setter for range inputs: when value is null/undefined, fallback to maxLimit
            // This allows range inputs to display the limit value when empty (with fill modifier)
            // while keeping number inputs empty to preserve their placeholder state
            [`x-model.number${fill ? '.fill' : ''}`]() {
                const $data = Alpine.$data($el);
                return {
                    get() {
                        var _a;
                        return (_a = $data.__range_maxValue) !== null && _a !== void 0 ? _a : $data.__range_maxLimit;
                    },
                    set(value) {
                        $data.__range_maxValue = value;
                    },
                };
            },
            '@input'() {
                // Collision handling: when max range slider falls below min, adjust min by step decrement
                if (this.$data.__range_maxValue !== null &&
                    this.$data.__range_minValue !== null &&
                    this.$data.__range_maxValue <= this.$data.__range_minValue) {
                    const step = getStepValue(this.$el);
                    this.$data.__range_minValue = getPreviousStepValue(this.$data.__range_maxValue, step, this.$data.__range_minLimit);
                }
            },
        });
    }
    else {
        throw new Error(`Expected <input type="range"> tag for x-range:range-max but got ${$el}`);
    }
}
function handleRoot$e($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __range_numberMinEl: null,
                __range_numberMaxEl: null,
                __range_rangeMinEl: null,
                __range_rangeMaxEl: null,
                __range_minLimit: null,
                __range_maxLimit: null,
                __range_minValue: null,
                __range_maxValue: null,
                // Range is "dormant" when both values are at their default limits (or null)
                // Uses == null to check for both null and undefined
                get __range_isDormant() {
                    return ((this.__range_minValue == null || this.__range_minValue === this.__range_minLimit) &&
                        (this.__range_maxValue == null || this.__range_maxValue === this.__range_maxLimit));
                },
            };
        },
    });
}
/**
 * Extracts and validates step value from input element.
 * Defaults to 1 for invalid values (empty, 'any', NaN, or <= 0) to ensure
 * collision adjustments always have a valid step increment.
 */
function getStepValue($el) {
    const step = $el.step;
    if (step === '' || step === 'any') {
        return 1;
    }
    const stepNum = Number(step);
    return isNaN(stepNum) || stepNum <= 0 ? 1 : stepNum;
}
/**
 * Calculates next valid step value when adjusting max after collision.
 * Clamps to maxLimit if the step increment would exceed it.
 */
function getNextStepValue(value, step, maxLimit) {
    const next = value + step;
    return maxLimit !== null ? Math.min(next, maxLimit) : next;
}
/**
 * Calculates previous valid step value when adjusting min after collision.
 * Clamps to minLimit if the step decrement would fall below it.
 */
function getPreviousStepValue(value, step, minLimit) {
    const previous = value - step;
    return minLimit !== null ? Math.max(previous, minLimit) : previous;
}

const DEFAULT_OFFSET$1 = 10;
/**
 * Enables the creation of tooltip components.
 * The 'x-tooltip' directive provide functionality for managing tooltips based on the "x-float" directive
 *
 * Directives:
 * - x-tooltip - The root element of the tooltip, initializing the  tooltip functionality and adding a data context for child directives
 * - x-tooltip:trigger - The element that trigger the tooltip
 * - x-tooltip:tooltip - The element that actually floats next to the trigger with the tooltip content
 * - x-tooltip:arrow - The "arrow" element. Should be inside the "content" element
 *
 * @example
 *
  <div x-tooltip class="relative">
    <div x-tooltip:trigger></div>

    <div x-tooltip.bottom.16:panel x-cloak>
      <div x-tooltip:arrow></div>

      <span>lorem ipsum</span>
    </div>
  </div>
 */
function tooltip (Alpine) {
    Alpine.directive('tooltip', ($el, data, utilities) => {
        if (data.value == 'trigger') {
            handleTrigger($el, Alpine);
        }
        else if (data.value == 'panel') {
            handlePanel$1($el, Alpine, data, utilities);
        }
        else if (data.value == 'arrow') {
            handleArrow$1($el, Alpine);
        }
        else if (data.value == null) {
            handleRoot$d($el, Alpine, data);
        }
        else {
            throw new Error(`Unknown directive: x-tooltip:${data.value}`);
        }
    }).before('bind');
}
function handleTrigger($el, Alpine) {
    Alpine.bind($el, {
        'x-hover:start.delay.300ms': '$popup.isOpen = true',
        'x-hover:end.delay.300ms': '$popup.isOpen = false',
        'x-focus-state': '$popup.isOpen = $hasFocus',
        '@keydown.escape.stop.prevent': `$popup.close()`,
        'x-popup:target': '',
        '@mousedown.outside': '$popup.close()',
        '@focusin.window': '$el !== $event.target && $popup.close()',
        ':aria-describedby': '__tooltip_tooltipEl?.id',
    });
}
function handlePanel$1($el, Alpine, { modifiers, expression }, {}) {
    Alpine.bind($el, Object.assign(Object.assign({}, (modifiers.length
        ? {
            [`x-popup:popup.${modifiers.join('.')}`]: expression || '',
        }
        : {
            [`x-popup:popup.absolute.bottom.offset.${DEFAULT_OFFSET$1}px.flip.update.pad.5px`]: expression || '',
        })), { role: 'tooltip', 'x-init': '__tooltip_tooltipEl = $el' }));
}
function handleArrow$1($el, Alpine) {
    Alpine.bind($el, {
        'x-float:arrow': '',
    });
}
function handleRoot$d($el, Alpine, { modifiers, expression }) {
    Alpine.bind($el, {
        [`x-popup.${modifiers.join('.')}`]: expression || '',
        ['x-id']: "['tooltip', 'tooltip-trigger']",
        'x-data'() {
            return {
                __tooltip_triggerEl: null,
                __tooltip_tooltipEl: null,
            };
        },
    });
}

/**
 * Enables the creation of popover components.
 * The 'x-popover' directive provide functionality for managing popovers based on the "x-float" directive
 *
 * - x-popover - The root element of the popover, initializing the  popover functionality and adding a data context for child directives
 * - x-popover:trigger - The element that trigger the popover
 * - x-popover:popover - The element that actually floats next to the trigger with the popover content
 * - x-popover:arrow - The "arrow" element. Should be inside the "content" element
 *
 * @example
 *
  <div x-popover class="relative">
    <div x-popover:trigger></div>

    <div x-popover.bottom.16:panel x-cloak>
      <div x-popover:arrow></div>

      <span>lorem ipsum</span>
    </div>
  </div>
 */
const DEFAULT_OFFSET = 5;
function popover (Alpine) {
    Alpine.directive('popover', ($el, data, utilities) => {
        if (data.value == 'button') {
            handleButton$2($el, Alpine);
        }
        else if (data.value == 'panel') {
            handlePanel($el, Alpine, data, utilities);
        }
        else if (data.value == 'arrow') {
            handleArrow($el, Alpine);
        }
        else if (data.value == null) {
            handleRoot$c($el, Alpine, data);
        }
        else {
            throw new Error(`Unknown directive: x-popover:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('popover', handlePopoverMagic(Alpine));
}
function handlePopoverMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            get isOpen() {
                var _a;
                return (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.isExpanded;
            },
            set isOpen(value) {
                if (!$data.__disclosure_state)
                    return;
                $data.__disclosure_state.isExpanded = value;
            },
            open() {
                var _a;
                (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.expand();
            },
            close() {
                var _a;
                (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.collapse();
            },
        };
    };
}
function handleButton$2($el, Alpine) {
    Alpine.bind($el, {
        'x-popup:button': '',
    });
}
function handlePanel($el, Alpine, { modifiers, expression }, {}) {
    const shouldTrap = !modifiers.includes('notrap');
    Alpine.bind($el, Object.assign(Object.assign(Object.assign({}, (modifiers.length
        ? {
            [`x-popup:popup.${modifiers.join('.')}`]: expression || '',
        }
        : {
            [`x-popup:popup.absolute.bottom.offset.${DEFAULT_OFFSET}px.flip.update.shift.fit-x.pad.5px`]: expression || '',
        })), { role: 'popover', 'x-data'() {
            return {
                init() {
                    this.$data.__popover_popoverEl = $el;
                    // TODO investigate hooking into Alpine's el._x_doShow / el._x_doHide hooks to show / hide popover
                    if (isPopoverApiSupported()) {
                        if (this.$popup.isOpen) {
                            this.$nextTick(() => {
                                // Wait until next tick to ensure that the popover is rendered and positioned
                                this.__popover_showPopover();
                            });
                        }
                        this.$watch('$popup.isOpen', async (isOpen) => {
                            if (isOpen) {
                                this.__popover_showPopover();
                            }
                            else {
                                this.__popover_hidePopover();
                            }
                        });
                    }
                },
                __popover_showPopover() {
                    // Adding 'popover' attribute only when opening popover forces _this_ popover to be at the top of the top layer
                    $el.popover = 'manual';
                    if (isDialogApiSupported() && isDialogElement($el)) {
                        $el.showModal();
                    }
                    else {
                        $el.showPopover();
                    }
                },
                async __popover_hidePopover() {
                    // Wait until animations have completed before hiding the popover to avoid
                    // layout shifting when popover / top-layer styles are removed
                    await this.$disclosure.waitForAnimations();
                    // Ensure popover hasn't been reopened
                    if (this.$popup.isOpen)
                        return;
                    if ($el.popover == 'manual') {
                        if (isDialogApiSupported() && isDialogElement($el)) {
                            if ($el.open) {
                                $el.close();
                            }
                        }
                        else {
                            $el.hidePopover();
                        }
                    }
                    $el.popover = null;
                },
            };
        } }), (shouldTrap
        ? {
            'x-trap.noreturn': '$popup.isOpen && await $disclosure.waitForAnimations()',
        }
        : {})));
}
function handleArrow($el, Alpine) {
    Alpine.bind($el, {
        'x-float:arrow': '',
    });
}
function handleRoot$c($el, Alpine, { modifiers, expression }) {
    Alpine.bind($el, {
        [`x-popup.${modifiers.join('.')}`]: expression || '',
        'x-data'() {
            return {
                __popover_popoverEl: null,
            };
        },
    });
}

/**
 * Creates forms that work with or without JavaScript - traditional form submission when JS is disabled,
 * enhanced async submission when JS is available. Handles form states, errors, request cancellation,
 * and prevents full page reloads for better user experience.
 *
 * Usage:
 * - x-async-form - Applied to the form element, initializing the async form functionality and adding a data context for child directives
 * - x-async-form:context - Defines the context for the async form, allowing sharing of form state with other elements.
 * - x-async-form:form - Binds to the form element to handle form submissions.
 *
 * The '$asyncForm' magic property provides a comprehensive API for managing the form state, including form data, response, parsed body, and error messages.
 *
 * ## Common Usage Scenarios
 *
 * ### Basic product form
 *
 * When JS is disabled, form will submit to the given action URL and the server will handle the success/error.
 * When JS is enabled, form will make a fetch request to the given async-action URL and the async-form plugin will handle the success/pending/error states.
 *
 * ```html
 * <form x-async-form action="/cart" async-action="/cart/add.js" method="POST">
 *   <input type="hidden" name="id" value="123456789">
 *   <select name="quantity">
 *     <option value="1">1</option>
 *     <option value="2">2</option>
 *   </select>
 *
 *   <button type="submit"
 *           :disabled="$asyncForm.state === 'pending'"
 *           :class="{ 'opacity-50': $asyncForm.state === 'pending' }">
 *     <span x-show="$asyncForm.state === 'idle'">Add to Cart</span>
 *     <span x-show="$asyncForm.state === 'pending'">Adding...</span>
 *     <span x-show="$asyncForm.state === 'success'">Added!</span>
 *   </button>
 *
 *   <div x-show="$asyncForm.state === 'error'" class="text-red-500">
 *     <p x-text="$asyncForm.errorMessage"></p>
 *   </div>
 * </form>
 * ```
 *
 * ## Customizing the form submission
 *
 * In more complex scenarios, you may want to customize the form submission. This can be done by passing a function to the x-async-form directive
 * which will be used to submit the form instead just making a fetch request which is the default behavior.
 *
 * For example, if you need to do conditional error checking on the JSON response body:
 *
 * ```html
 * <form
 *   x-data="{
 *     save(info) {
 *        const response = await fetch('/cart/add.js', { method: 'POST', body: info })
 *
 *        if (response.status === 422) {
 *          const body = await response.json()
 *          if (body.message) {
 *            throw new Error(message)
 *          }
 *        }
 *
 *        return response
 *     }
 *   }"
 *  x-async-form="save"
 * >
 *   <input type="text" name="name" value="John Doe">
 *   <button type="submit">Submit</button>
 * </form>
 * ```
 * ## Features
 *
 * - **Request Cancellation**: All fetch requests include an AbortSignal that automatically cancels pending requests when a new submission starts or the component is cleaned up
 * - **State Management**: Tracks form state (idle, pending, success, error) with automatic transitions
 * - **Error Handling**: Parses error responses and provides structured error messages
 * - **Timeout Support**: Configurable timeouts for success and error states
 *
 * ## Events
 *
 * - `form:pending` - Dispatched when the form is pending
 * - `form:success` - Dispatched when the form is successful. Event detail is the parsed body of the response.
 * - `form:error` - Dispatched when the form encounters an error. Event detail is an object with the following properties:
 *   - `message` - The error message
 *   - `description` - The error description
 *
 */
function asyncForm (Alpine) {
    Alpine.directive('async-form', ($el, data, utilities) => {
        if (data.value == 'form') {
            handleForm$5($el, Alpine, data, utilities);
        }
        else if (data.value == 'context') {
            handleContext$3($el, Alpine, data, utilities);
        }
        else if (data.value == null) {
            if (!isFormElement($el)) {
                // Handle the case of x-async-form being applied to a parent of a form element
                // In this case we look for a form element child and apply form directive to that
                const form = $el.querySelector('form');
                Alpine.bind($el, {
                    [`x-async-form:context.${data.modifiers.join('.')}`]: data.expression || '',
                });
                if (form) {
                    Alpine.bind(form, {
                        [`x-async-form:form.${data.modifiers.join('.')}`]: '',
                    });
                }
            }
            else {
                Alpine.bind($el, {
                    [`x-async-form:context.${data.modifiers.join('.')}`]: data.expression || '',
                    [`x-async-form:form.${data.modifiers.join('.')}`]: '',
                });
            }
        }
        else {
            throw new Error(`Unknown directive: x-async-form:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('asyncForm', handleAsyncFormMagic(Alpine));
}
function handleAsyncFormMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            get formData() {
                return $data.__asyncForm_formData;
            },
            get state() {
                return $data.__asyncForm_state;
            },
            get response() {
                return $data.__asyncForm_response;
            },
            get parsedBody() {
                return $data.__asyncForm_parsedBody;
            },
            reset() {
                return $data.__asyncForm_reset();
            },
            submitAsync(info) {
                return $data.__asyncForm_submitAsync(info);
            },
            get errorMessage() {
                return $data.__asyncForm_errorMessage;
            },
            get errorDescription() {
                return $data.__asyncForm_errorDescription;
            },
            get signal() {
                var _a;
                return ((_a = $data.__asyncForm_abortController) === null || _a === void 0 ? void 0 : _a.signal) || null;
            },
        };
    };
}
function handleContext$3($el, Alpine, { expression, modifiers }, { evaluateLater }) {
    let getCallbackFn = expression ? evaluateLater(expression) : null;
    const errorTimeout = getErrorTimeoutModifier(modifiers) || false;
    const successTimeout = getSuccessTimeoutModifier(modifiers) || 1000;
    Alpine.bind($el, {
        'x-data'() {
            return {
                __asyncForm_formEl: null,
                __asyncForm_stateMachine: new StateMachine('idle', ['idle', 'pending', 'success', 'error'], {
                    idle: ['pending'],
                    pending: ['success', 'error', 'pending'],
                    success: ['idle', 'pending'],
                    error: ['idle', 'pending'],
                }),
                __asyncForm_callback: null,
                __asyncForm_abortController: null,
                __asyncForm_formData: null,
                __asyncForm_response: null,
                __asyncForm_parsedBody: null,
                __asyncForm_errorMessage: null,
                __asyncForm_errorDescription: null,
                __asyncForm_successTimeout: successTimeout || false,
                __asyncForm_errorTimeout: errorTimeout || false,
                init() {
                    this.$watch('__asyncForm_state', (state, prevState) => {
                        if ((prevState == 'success' || prevState == 'error') && state == 'idle') {
                            // Wipe form data after a successful or failed submission
                            this.__asyncForm_formData = null;
                        }
                        if (prevState == 'success' && state == 'idle') {
                            // Clear error message after a successful submission
                            this.__asyncForm_errorMessage = null;
                            this.__asyncForm_errorDescription = null;
                        }
                    });
                    Alpine.effect(() => {
                        // Create a function which wraps the passed in callback function / expression and allows us to call it when the user clicks the link
                        this.__asyncForm_callback = (callbackInfo) => {
                            var _a, _b;
                            // If no expression provided, use default fetch behavior
                            if (!getCallbackFn) {
                                const submissionInfo = Object.assign(Object.assign({}, callbackInfo), { action: this.$el.getAttribute('async-action') || (callbackInfo === null || callbackInfo === void 0 ? void 0 : callbackInfo.action) });
                                return submitFormData(submissionInfo, { signal: (_a = this.__asyncForm_abortController) === null || _a === void 0 ? void 0 : _a.signal });
                            }
                            let result;
                            Alpine.dontAutoEvaluateFunctions(() => {
                                getCallbackFn((callbackResult) => {
                                    result = callbackResult;
                                });
                            });
                            if (typeof result === 'function') {
                                const formSubmissionInfoOrPromise = result.bind(this)(callbackInfo);
                                if (formSubmissionInfoOrPromise instanceof Promise) {
                                    return formSubmissionInfoOrPromise;
                                }
                                else if (typeof formSubmissionInfoOrPromise === 'object' && formSubmissionInfoOrPromise !== null) {
                                    const mergedInfo = Object.assign(Object.assign({}, callbackInfo), formSubmissionInfoOrPromise);
                                    return submitFormData(mergedInfo, { signal: (_b = this.__asyncForm_abortController) === null || _b === void 0 ? void 0 : _b.signal });
                                }
                            }
                            else {
                                throw new Error('x-async-form callback must return a Promise, or FormDataSubmissionInfo');
                            }
                            throw new Error('x-async-form callback must return a Promise, partial FormDataSubmissionInfo object, or a function that returns a Promise');
                        };
                    });
                },
                get __asyncForm_state() {
                    return this.__asyncForm_stateMachine.state;
                },
                set __asyncForm_state(state) {
                    this.__asyncForm_stateMachine.state = state;
                },
                get __asyncForm_form() {
                    var _a;
                    let form = null;
                    if (this.$el.tagName === 'FORM') {
                        form = this.$el;
                    }
                    if (this.__asyncForm_formEl && ((_a = this.__asyncForm_formEl) === null || _a === void 0 ? void 0 : _a.tagName) === 'FORM') {
                        form = this.__asyncForm_formEl;
                    }
                    return form;
                },
                async __asyncForm_submitAsync(info) {
                    if (info === null || info === void 0 ? void 0 : info.formData) {
                        this.__asyncForm_formData = info.formData;
                    }
                    this.__asyncForm_state = 'pending';
                    (this.__asyncForm_formEl || this.$el).dispatchEvent(new CustomEvent('form:pending', {
                        bubbles: true,
                        // Allows events to pass the shadow DOM barrier.
                        composed: true,
                        cancelable: true,
                        detail: this.__asyncForm_formData,
                    }));
                    // Yield to main thread to prevent long task
                    await yieldToMain();
                    // Cancel any pending request
                    if (this.__asyncForm_abortController) {
                        this.__asyncForm_abortController.abort('cancelled by user');
                    }
                    // Create new AbortController for this request
                    this.__asyncForm_abortController = new AbortController();
                    try {
                        // Run provided callback function
                        const response = await this.__asyncForm_callback.bind(this)(info);
                        return await this.__asyncForm_handleResponse(response);
                    }
                    catch (e) {
                        if (e.name == 'AbortError') {
                            return null;
                        }
                        else {
                            this.__asyncForm_handleError(String((e === null || e === void 0 ? void 0 : e.message) || e));
                            console.error(e);
                            return Promise.resolve();
                        }
                    }
                },
                async __asyncForm_handleResponse(response) {
                    this.__asyncForm_response = response;
                    this.__asyncForm_parsedBody = await parseResponseBody(response);
                    if (!response || (response === null || response === void 0 ? void 0 : response.status) == undefined) {
                        // Handle the response object not being a fetch request
                        this.__asyncForm_handleSuccess();
                        return response;
                    }
                    else if (response.status === 200) {
                        this.__asyncForm_handleSuccess();
                        return response;
                    }
                    else {
                        let message = getErrorMessage(response, this.__asyncForm_parsedBody);
                        let description = getErrorDescription(this.__asyncForm_parsedBody);
                        this.__asyncForm_handleError(message, description);
                        return response;
                    }
                },
                async __asyncForm_handleSuccess() {
                    (this.__asyncForm_formEl || this.$el).dispatchEvent(new CustomEvent('form:success', {
                        bubbles: true,
                        // Allows events to pass the shadow DOM barrier.
                        composed: true,
                        cancelable: true,
                        detail: this.__asyncForm_parsedBody,
                    }));
                    if (successTimeout) {
                        // Transition to success state then back to initial state after a timeout
                        this.__asyncForm_stateMachine.setTransientState('success', 'idle', successTimeout);
                    }
                    else {
                        this.__asyncForm_state = 'success';
                    }
                },
                async __asyncForm_handleError(message, description) {
                    (this.__asyncForm_formEl || this.$el).dispatchEvent(new CustomEvent('form:error', {
                        bubbles: true,
                        // Allows events to pass the shadow DOM barrier.
                        composed: true,
                        cancelable: true,
                        detail: {
                            message: message,
                            description: description,
                        },
                    }));
                    if (errorTimeout) {
                        // Transition to error state then back to initial state after a timeout
                        this.__asyncForm_stateMachine.setTransientState('error', 'idle', errorTimeout);
                    }
                    else {
                        this.__asyncForm_state = 'error';
                    }
                    this.__asyncForm_errorMessage = message;
                    this.__asyncForm_errorDescription = description;
                },
                __asyncForm_reset() {
                    // Cancel any pending request
                    if (this.__asyncForm_abortController) {
                        this.__asyncForm_abortController.abort('cancelled by user');
                        this.__asyncForm_abortController = null;
                    }
                    this.__asyncForm_state = 'idle';
                    this.__asyncForm_response = null;
                    this.__asyncForm_parsedBody = null;
                    this.__asyncForm_errorMessage = null;
                    this.__asyncForm_errorDescription = null;
                },
            };
        },
    });
}
function handleForm$5($el, Alpine, { expression }, {}) {
    if (!isFormElement($el)) {
        throw new Error('x-async-form:form directive can only be used on form elements');
    }
    Alpine.bind($el, {
        'x-data'() {
            return {
                __asyncForm_form_onSubmit(e) {
                    // Prevent default form submission behaviour so we dont get a full page reload
                    e.preventDefault();
                    this.__asyncForm_submitAsync(getFormSubmissionInfo($el, e.submitter));
                },
                init() {
                    if (this.__asyncForm_submitAsync == undefined) {
                        throw new Error('x-async-form:form directive must be used within an x-async-form:context directive');
                    }
                },
            };
        },
        'x-init': '__asyncForm_formEl = $el',
        '@submit': '__asyncForm_form_onSubmit',
    });
}
function getErrorTimeoutModifier(modifiers) {
    let errorTimeout = false;
    if (modifiers.includes('wait-error')) {
        const rawValue = modifiers[modifiers.indexOf('wait-error') + 1];
        let match = rawValue.match(/([0-9]+)ms/);
        if (match)
            errorTimeout = Number(match[1]);
    }
    return errorTimeout;
}
function getSuccessTimeoutModifier(modifiers) {
    let successTimeout = false;
    if (modifiers.includes('wait-success')) {
        const rawValue = modifiers[modifiers.indexOf('wait-success') + 1];
        let match = rawValue.match(/([0-9]+)ms/);
        if (match)
            successTimeout = Number(match[1]);
    }
    return successTimeout;
}
async function parseResponseBody(response) {
    var _a;
    if (!response)
        return null;
    // Bail out if the response is not similar to a standard fetch Response object
    if (!isPlainObject(response) || !('json' in response)) {
        return null;
    }
    // Note: we clone the response here in case the body has already been read
    if ((_a = response.headers.get('Content-Type')) === null || _a === void 0 ? void 0 : _a.includes('text/html')) {
        return await response.clone().text();
    }
    else {
        // Try to parse the body as json, if it fails, return the original response
        try {
            return await response.clone().json();
        }
        catch (e) {
            return await response.clone().text();
        }
    }
}
function getErrorMessage(response, parsedBody) {
    if (isPlainObject(parsedBody) && parsedBody.message) {
        return parsedBody.message;
    }
    return response.statusText;
}
function getErrorDescription(parsedBody) {
    if (isPlainObject(parsedBody)) {
        if (parsedBody.description) {
            if (isPlainObject(parsedBody.description)) {
                return Object.values(parsedBody.description)
                    .filter((str) => str !== undefined && str !== null)
                    .join(', ');
            }
            return parsedBody.description;
        }
        if (parsedBody.error) {
            return parsedBody.error.toString();
        }
        if (parsedBody.errors) {
            return parsedBody.errors.toString();
        }
    }
    return null;
}

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
 * TODO:
 * - Document events
 */
function asyncLink (Alpine) {
    Alpine.directive('async-link', ($el, data, { evaluateLater }) => {
        if (data.value == 'link') {
            if (!isAnchorElement($el)) {
                throw new Error('x-async-link:link directive can only be used on anchor elements');
            }
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        async __asyncLink_onClick(e) {
                            if (!shouldProcessLinkClick(e, $el.target))
                                return;
                            // If some other function has already prevented the default action, do nothing
                            if (e.defaultPrevented)
                                return;
                            // If the link is not an anchor tag, do nothing
                            if (!this.$el.href)
                                return;
                            e.preventDefault();
                            this.__asyncLink_load(this.$el.href);
                        },
                        init() {
                            if (this.__asyncLink_state == undefined) {
                                throw new Error('x-async-link:link directive must be used within an x-async-link:context directive');
                            }
                        },
                    };
                },
                '@click': '__asyncLink_onClick',
            });
        }
        else if (data.value == 'context') {
            if (!data.expression) {
                throw new Error('x-async-link:context directive requires a an async callback function');
            }
            let getCallbackFn = evaluateLater(data.expression);
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        __asyncLink_pendingHref: null,
                        __asyncLink_stateMachine: new StateMachine('idle', ['idle', 'pending'], {
                            idle: ['pending'],
                            pending: ['pending', 'idle'],
                        }),
                        __asyncLink_callback: null,
                        __asyncLink_errorMessage: null,
                        __asyncLink_errorDescription: null,
                        init() {
                            Alpine.effect(() => {
                                // Create a function which wraps the passed in callback function / expression and allows us to call it when the user clicks the link
                                this.__asyncLink_callback = async (href) => {
                                    let resultPromise;
                                    Alpine.dontAutoEvaluateFunctions(() => {
                                        getCallbackFn(async (result) => {
                                            if (typeof result === 'function') {
                                                resultPromise = result.bind(this)(href);
                                            }
                                            else {
                                                throw new Error(`x-async-link expects an async function as its expression`);
                                            }
                                        }, {
                                            params: [href],
                                            scope: { $href: href },
                                        });
                                    });
                                    return resultPromise;
                                };
                            });
                        },
                        get __asyncLink_state() {
                            return this.__asyncLink_stateMachine.state;
                        },
                        get __asyncLink_prevState() {
                            return this.__asyncLink_stateMachine.prevState;
                        },
                        set __asyncLink_state(state) {
                            this.__asyncLink_stateMachine.state = state;
                        },
                        async __asyncLink_load(href) {
                            this.__asyncLink_state = 'pending';
                            this.__asyncLink_pendingHref = href;
                            this.$dispatch('link:pending', this.__asyncLink_pendingHref);
                            // Yield to main thread to prevent long task
                            await yieldToMain();
                            try {
                                // Run provided callback function
                                const response = await this.__asyncLink_callback.bind(this)(href);
                                if (!response || (response === null || response === void 0 ? void 0 : response.status) == undefined) {
                                    // Handle the response object not being a fetch request
                                    this.__asyncLink_handleSuccess();
                                    return response;
                                }
                                else if (response.status === 200) {
                                    this.__asyncLink_handleSuccess();
                                    return response;
                                }
                                else if (response.status === 422) {
                                    const body = await response.json();
                                    this.__asyncLink_handleError(body.message, body.description);
                                    return response;
                                }
                                else {
                                    this.__asyncLink_handleError(response.statusText);
                                    return response;
                                }
                            }
                            catch (e) {
                                if (e.name == 'AbortError') {
                                    this.__asyncLink_pendingHref = null;
                                    this.__asyncLink_state = 'idle';
                                    return false;
                                }
                                else {
                                    this.__asyncLink_handleError(String((e === null || e === void 0 ? void 0 : e.message) || e));
                                    throw e;
                                }
                            }
                        },
                        async __asyncLink_handleSuccess() {
                            this.$dispatch('link:loaded', this.__asyncLink_pendingHref);
                            this.__asyncLink_state = 'idle';
                            this.__asyncLink_pendingHref = null;
                        },
                        async __asyncLink_handleError(message, description) {
                            this.__asyncLink_state = 'idle';
                            this.__asyncLink_errorMessage = message;
                            this.__asyncLink_errorDescription = description;
                            this.__asyncLink_pendingHref = null;
                        },
                        __asyncLink_reset() {
                            this.__asyncLink_state = 'idle';
                            this.__asyncLink_errorMessage = null;
                            this.__asyncLink_errorDescription = null;
                            this.__asyncLink_pendingHref = null;
                        },
                    };
                },
            });
        }
        else {
            if (!data.expression) {
                throw new Error('x-async-link directive requires a an async callback function');
            }
            if (!isAnchorElement($el)) {
                throw new Error('x-async-link directive can only be used on anchor elements');
            }
            Alpine.bind($el, {
                'x-async-link:context': data.expression,
                [`x-async-link:link.${data.modifiers.join('.')}`]: '',
            });
        }
    }).before('bind');
    Alpine.magic('asyncLink', ($el) => {
        const $data = Alpine.$data($el);
        return {
            get pendingHref() {
                return $data.__asyncLink_pendingHref;
            },
            get state() {
                return $data.__asyncLink_state;
            },
            get reset() {
                return $data.__asyncLink_reset();
            },
            get errorMessage() {
                return $data.__asyncLink_errorMessage;
            },
            get errorDescription() {
                return $data.__asyncLink_errorDescription;
            },
        };
    });
}

const DEFAULT_SLIDE_DURATION = 1000;
/**
 * TODO docs
 */
function slideshow (Alpine) {
    Alpine.directive('slideshow', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'slide') {
            handleSlide($el, Alpine);
        }
        else if (data.value === 'control') {
            handleControl($el, Alpine);
        }
        else if (data.value === 'play') {
            handlePlayButton($el, Alpine);
        }
        else if (data.value === 'pause') {
            handlePauseButton($el, Alpine);
        }
        else if (data.value === 'next') {
            handleNextButton($el, Alpine);
        }
        else if (data.value === 'prev') {
            handlePrevButton($el, Alpine);
        }
        else if (data.value === 'toggle') {
            handleToggleButton($el, Alpine);
        }
        else if (data.value === 'viewport') {
            handleViewport($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot$b($el, Alpine, data, utilities);
        }
        else {
            throw new Error(`Unknown directive: x-slideshow:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('slideshow', function ($el) {
        const $data = Alpine.$data($el);
        // Could probably just rename __slideshow_state to $slideshow and get rid of this magic
        // but I want to think through the implications of that before establishing a precedent
        return $data.__slideshow_state || {};
    });
    Alpine.magic('slide', function ($el) {
        const $data = Alpine.$data($el);
        return {
            get slideIndex() {
                return $data.__slideshowSlide_slideIndex;
            },
            get isCurrentSlide() {
                return $data.__slideshowSlide_isCurrentSlide;
            },
            get wasLastSlide() {
                return $data.__slideshowSlide_wasLastSlide;
            },
        };
    });
}
function handleControl($el, Alpine) {
    Alpine.bind($el, {
        ':aria-controls': '$id("slideshow")',
    });
}
function handlePlayButton($el, Alpine) {
    Alpine.bind($el, {
        '@click': '$slideshow.play()',
        'x-slideshow:control': '',
    });
}
function handlePauseButton($el, Alpine) {
    Alpine.bind($el, {
        '@click': '$slideshow.pause()',
        'x-slideshow:control': '',
    });
}
function handleNextButton($el, Alpine) {
    Alpine.bind($el, {
        '@click': '$slideshow.pause(); $slideshow.next()',
        'x-slideshow:control': '',
    });
}
function handlePrevButton($el, Alpine) {
    Alpine.bind($el, {
        '@click': '$slideshow.pause(); $slideshow.prev()',
        'x-slideshow:control': '',
    });
}
function handleToggleButton($el, Alpine) {
    Alpine.bind($el, {
        '@click': '$slideshow.toggle()',
        'x-slideshow:control': '',
    });
}
function handleSlide($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                init() {
                    this.__slideshow_state.register(this.$el);
                },
                destroy() {
                    this.__slideshow_state.unregister(this.$el);
                },
                get __slideshowSlide_slideIndex() {
                    return Array.from(this.__slideshow_state.slides).indexOf(this.$el);
                },
                get __slideshowSlide_isCurrentSlide() {
                    return (this.__slideshow_state.currentSlideIndex ===
                        this.__slideshowSlide_slideIndex);
                },
                get __slideshowSlide_wasLastSlide() {
                    return (this.__slideshow_state.lastSlideIndex ===
                        this.__slideshowSlide_slideIndex);
                },
            };
        },
        role: 'group',
        'aria-roledescription': 'slide',
    });
}
function handleViewport($el, Alpine) {
    Alpine.bind($el, {
        ':id': `$id('slideshow')`,
        role: 'region',
        'aria-roledescription': 'carousel',
        ':aria-live': '$slideshow.state == "playing" ? "off" : "polite"',
        '@keydown.left.stop.prevent': '$slideshow.prev()',
        '@keydown.right.stop.prevent': '$slideshow.next()',
        '@focus': '$slideshow.pause()',
    });
}
function handleRoot$b($el, Alpine, data, { evaluate }) {
    let slideDuration = DEFAULT_SLIDE_DURATION;
    const autoplay = data.modifiers.includes('autoplay');
    if (data.modifiers.includes('duration')) {
        const rawValue = data.modifiers[data.modifiers.indexOf('duration') + 1];
        // Support x-slideshow.duration.500ms which will wait 500ms before transitioning to next slide
        let match = rawValue.match(/([0-9]+)ms/);
        if (match)
            slideDuration = Number(match[1]);
    }
    let expression = data.expression === '' ? '{}' : data.expression;
    let options = evaluate(expression);
    options.slideDuration = slideDuration;
    options.autoplay = autoplay;
    if (options !== undefined && options !== null && !isPlainObject(options)) {
        throw new Error(`options must be an object, but got ${options}`);
    }
    let state = buildSlideshowState(options);
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __slideshow_autoplayTimeoutId: undefined,
                __slideshow_animationFrameId: undefined,
                __slideshow_state: state,
                init() {
                    let lastTimestamp;
                    const updateProgress = (timestamp) => {
                        if (lastTimestamp === undefined)
                            lastTimestamp = timestamp;
                        const deltaTime = timestamp - lastTimestamp;
                        lastTimestamp = timestamp;
                        // Update the elapsed time
                        this.__slideshow_state.currentSlideElapsedTime = Math.round(this.__slideshow_state.currentSlideElapsedTime + deltaTime);
                        // Request the next frame if playing
                        if (this.__slideshow_state.state === 'playing') {
                            this.__slideshow_animationFrameId = requestAnimationFrame(updateProgress);
                        }
                    };
                    const startProgressUpdates = () => {
                        // Cancel any existing animation frame
                        if (this.__slideshow_animationFrameId !== undefined) {
                            cancelAnimationFrame(this.__slideshow_animationFrameId);
                        }
                        // Start updating progress
                        lastTimestamp = undefined;
                        this.__slideshow_animationFrameId = requestAnimationFrame(updateProgress);
                    };
                    const stopProgressUpdates = () => {
                        if (this.__slideshow_animationFrameId !== undefined) {
                            cancelAnimationFrame(this.__slideshow_animationFrameId);
                            this.__slideshow_animationFrameId = undefined;
                        }
                    };
                    const scheduleNextSlide = () => {
                        // Clear any existing timeout
                        if (this.__slideshow_autoplayTimeoutId !== undefined) {
                            clearTimeout(this.__slideshow_autoplayTimeoutId);
                            this.__slideshow_autoplayTimeoutId = undefined;
                        }
                        if (this.__slideshow_state.state === 'playing') {
                            // Start progress updates
                            startProgressUpdates();
                            // Schedule the next slide
                            const remainingTime = this.__slideshow_state.slideDuration - this.__slideshow_state.currentSlideElapsedTime;
                            this.__slideshow_autoplayTimeoutId = window.setTimeout(() => {
                                // Move to the next slide
                                this.__slideshow_state.next();
                                // Reset elapsed time
                                this.__slideshow_state.currentSlideElapsedTime = 0;
                                // Schedule next slide
                                scheduleNextSlide();
                            }, remainingTime);
                        }
                        else {
                            // Slideshow is paused, stop progress updates
                            stopProgressUpdates();
                        }
                    };
                    // Watch for changes in play state
                    this.$watch('__slideshow_state.state', () => {
                        scheduleNextSlide();
                    });
                    // Watch for slide changes (e.g., manual navigation)
                    this.$watch('__slideshow_state.currentSlideIndex', (_nextIndex, prevIndex) => {
                        // Reset elapsed time and schedule next slide
                        this.__slideshow_state.currentSlideElapsedTime = 0;
                        scheduleNextSlide();
                    });
                    // Initial scheduling
                    scheduleNextSlide();
                },
                destroy() {
                    if (this.__slideshow_autoplayTimeoutId !== undefined) {
                        clearTimeout(this.__slideshow_autoplayTimeoutId);
                    }
                    if (this.__slideshow_animationFrameId !== undefined) {
                        cancelAnimationFrame(this.__slideshow_animationFrameId);
                    }
                },
            };
        },
        'x-id': "['slideshow']",
    });
}
function buildSlideshowState(options = {}) {
    let state = {
        state: options.autoplay ? 'playing' : 'paused',
        slideDuration: options.slideDuration || 1000,
        currentSlideIndex: options.initialSlideIndex || 0,
        currentSlideElapsedTime: 0,
        slides: new Set(),
        lastSlideIndex: null,
        get totalSlides() {
            return this.slides.size;
        },
        get nextSlideIndex() {
            return mod(this.currentSlideIndex + 1, this.totalSlides);
        },
        get prevSlideIndex() {
            return mod(this.currentSlideIndex - 1, this.totalSlides);
        },
        register(el) {
            this.slides.add(el);
        },
        unregister(el) {
            this.slides.delete(el);
        },
        next() {
            this.currentSlideIndex = this.nextSlideIndex;
        },
        prev() {
            this.currentSlideIndex = this.prevSlideIndex;
        },
        play() {
            if (this.state === 'playing')
                return;
            this.state = 'playing';
        },
        pause() {
            if (this.state === 'paused')
                return;
            this.state = 'paused';
        },
        toggle() {
            if (this.state === 'playing') {
                this.pause();
            }
            else {
                this.play();
            }
        },
    };
    state = trackProperty(state, 'currentSlideIndex', 'lastSlideIndex');
    if ((options === null || options === void 0 ? void 0 : options.state) !== undefined) {
        copyProperty(options, state, 'state');
    }
    if ((options === null || options === void 0 ? void 0 : options.currentSlideIndex) !== undefined) {
        copyProperty(options, state, 'currentSlideIndex');
    }
    return state;
}

var ThemeEditorEvent;
(function (ThemeEditorEvent) {
    ThemeEditorEvent["INSPECTOR_ACTIVATED"] = "shopify:inspector:activate";
    ThemeEditorEvent["INSPECTOR_DEACTIVATED"] = "shopify:inspector:deactivate";
    ThemeEditorEvent["SECTION_LOAD"] = "shopify:section:load";
    ThemeEditorEvent["SECTION_UNLOAD"] = "shopify:section:unload";
    ThemeEditorEvent["SECTION_SELECT"] = "shopify:section:select";
    ThemeEditorEvent["SECTION_DESELECT"] = "shopify:section:deselect";
    ThemeEditorEvent["SECTION_REORDER"] = "shopify:section:reorder";
    ThemeEditorEvent["BLOCK_SELECT"] = "shopify:block:select";
    ThemeEditorEvent["BLOCK_DESELECT"] = "shopify:block:deselect";
})(ThemeEditorEvent || (ThemeEditorEvent = {}));

function prettyPrintError(err) {
    let output = '';
    if (typeof err === 'string') {
        output = err;
    }
    else if (err instanceof Error) {
        output = err.message;
    }
    else if (err && typeof err.toString === 'function') {
        output = err.toString();
    }
    else if (err && typeof err.message === 'string') {
        output = err.message;
    }
    else {
        output = 'An unknown error occurred.';
    }
    return output;
}

const DATA_MORPH_SYNC_STATE = 'data-morph-sync';
const DATA_MORPH_CHILDREN_ONLY = 'data-morph-children-only';
const DATA_MORPH_SKIP = 'data-morph-skip';
const DATA_MORPH_SKIP_CHILDREN = 'data-morph-skip-children';
const MORPH_SYNC_EVENT = 'morph:sync';
/**
 * Morph rootEl with html, merging default morph behavior (data-morph-sync, data-morph-skip, etc.)
 * with morphOptions. When rootEl is the element being updated, only its children are morphed.
 *
 * @param rootEl - The root element to morph
 * @param html - The new HTML string to morph into
 * @param morphOptions - Optional AlpineMorphConfig to merge with default behavior
 */
function morph(rootEl, html, morphOptions) {
    const syncedElements = [];
    let flushScheduled = false;
    const scheduleFlush = () => {
        if (flushScheduled)
            return;
        flushScheduled = true;
        queueMicrotask(() => {
            for (const { el, detail } of syncedElements) {
                el.dispatchEvent(new CustomEvent(MORPH_SYNC_EVENT, { bubbles: true, detail }));
            }
            syncedElements.length = 0;
            flushScheduled = false;
        });
    };
    const pushSyncIfChanged = (el, previousValue, value) => {
        if (previousValue !== value) {
            syncedElements.push({ el, detail: { previousValue, value } });
            scheduleFlush();
        }
    };
    const syncInputValue = (newNode, oldNode) => {
        if (oldNode.type === 'file')
            return;
        const previousValue = oldNode.value;
        const value = newNode.value;
        if (value === null) {
            oldNode.value = '';
        }
        else {
            oldNode.value = value;
        }
        pushSyncIfChanged(oldNode, previousValue, value !== null && value !== void 0 ? value : '');
    };
    const syncCheckbox = (newNode, oldNode) => {
        const previousValue = oldNode.checked ? 'true' : 'false';
        const value = newNode.checked ? 'true' : 'false';
        oldNode.checked = newNode.checked;
        if (newNode.indeterminate !== oldNode.indeterminate) {
            oldNode.indeterminate = newNode.indeterminate;
        }
        pushSyncIfChanged(oldNode, previousValue, value);
    };
    const syncRadio = (newNode, oldNode) => {
        const previousValue = oldNode.checked ? oldNode.value : '';
        const value = newNode.checked ? newNode.value : '';
        oldNode.checked = newNode.checked;
        pushSyncIfChanged(oldNode, previousValue, value);
    };
    const syncTextareaValue = (newNode, oldNode) => {
        const previousValue = oldNode.value;
        const value = newNode.value;
        if (value !== oldNode.value) {
            oldNode.value = value;
        }
        const firstChild = oldNode.firstChild;
        if ((firstChild === null || firstChild === void 0 ? void 0 : firstChild.nodeType) === Node.TEXT_NODE) {
            if (value === '' && firstChild.nodeValue === oldNode.placeholder) {
                return;
            }
            firstChild.nodeValue = value;
        }
        pushSyncIfChanged(oldNode, previousValue, value);
    };
    const config = Object.assign(Object.assign({}, morphOptions), { updating(el, toEl, childrenOnly, skip, skipChildren) {
            var _a, _b, _c;
            if (isHtmlElement(el) && isHtmlElement(toEl) && el === rootEl) {
                childrenOnly();
            }
            if (el.hasAttribute && el.hasAttribute(DATA_MORPH_CHILDREN_ONLY)) {
                childrenOnly();
            }
            if (el.hasAttribute && el.hasAttribute(DATA_MORPH_SKIP)) {
                skip();
            }
            if (el.hasAttribute && el.hasAttribute(DATA_MORPH_SKIP_CHILDREN)) {
                skipChildren();
            }
            if (((_a = el.hasAttribute) === null || _a === void 0 ? void 0 : _a.call(el, DATA_MORPH_SYNC_STATE)) && ((_b = toEl === null || toEl === void 0 ? void 0 : toEl.hasAttribute) === null || _b === void 0 ? void 0 : _b.call(toEl, DATA_MORPH_SYNC_STATE))) {
                if (el instanceof HTMLInputElement && toEl instanceof HTMLInputElement) {
                    syncInputValue(toEl, el);
                    if (el.type === 'checkbox') {
                        syncCheckbox(toEl, el);
                    }
                    else if (el.type === 'radio') {
                        syncRadio(toEl, el);
                    }
                }
                else if (el instanceof HTMLTextAreaElement && toEl instanceof HTMLTextAreaElement) {
                    syncTextareaValue(toEl, el);
                }
            }
            (_c = morphOptions === null || morphOptions === void 0 ? void 0 : morphOptions.updating) === null || _c === void 0 ? void 0 : _c.call(morphOptions, el, toEl, childrenOnly, skip, skipChildren);
        },
        updated(el, toEl) {
            var _a;
            (_a = morphOptions === null || morphOptions === void 0 ? void 0 : morphOptions.updated) === null || _a === void 0 ? void 0 : _a.call(morphOptions, el, toEl);
        },
        removing(el, skip) {
            var _a;
            if (el.hasAttribute && el.hasAttribute(DATA_MORPH_SKIP)) {
                skip();
            }
            (_a = morphOptions === null || morphOptions === void 0 ? void 0 : morphOptions.removing) === null || _a === void 0 ? void 0 : _a.call(morphOptions, el, skip);
        } });
    Alpine.morph(rootEl, html, config);
}

class FetchBatcher {
    constructor(timeoutDuration = 100) {
        this.batchMap = new Map();
        this.timeoutMap = new Map();
        this.timeoutDuration = timeoutDuration;
        this.requestPromises = new Map();
    }
    // Main method to handle incoming requests
    request(url) {
        return new Promise((resolve, reject) => {
            const baseUrl = this.getBaseUrl(url);
            const queryParams = this.getQueryParams(url);
            const sectionsParam = queryParams
                .getAll('sections')
                .concat(queryParams.getAll('section_id'))
                .concat(queryParams.getAll('sections[]'));
            if (!this.batchMap.has(baseUrl)) {
                this.batchMap.set(baseUrl, new Set());
            }
            const sectionsSet = this.batchMap.get(baseUrl);
            if (sectionsSet) {
                sectionsParam.forEach((section) => sectionsSet.add(section));
            }
            if (!this.requestPromises.has(baseUrl)) {
                this.requestPromises.set(baseUrl, []);
            }
            const promisesList = this.requestPromises.get(baseUrl);
            if (promisesList) {
                promisesList.push({ resolve, reject });
            }
            // Set a timeout to batch requests
            if (!this.timeoutMap.has(baseUrl)) {
                const timeoutId = setTimeout(() => {
                    this.fetchBatch(baseUrl);
                }, this.timeoutDuration);
                this.timeoutMap.set(baseUrl, timeoutId);
            }
        });
    }
    // Extract base URL from full URL
    getBaseUrl(url) {
        const [baseUrl, _queryParams] = url.split('?');
        return baseUrl;
    }
    // Extract query parameters from full URL
    getQueryParams(url) {
        const [_baseUrl, queryParams] = url.split('?');
        return new URLSearchParams(queryParams);
    }
    // Construct the batched URL with all sections
    buildBatchUrl(baseUrl, sections) {
        return `${baseUrl}?sections=${Array.from(sections).join(',')}`;
    }
    // Fetch batched request
    async fetchBatch(baseUrl) {
        const sections = this.batchMap.get(baseUrl);
        if (!sections)
            return;
        const batchUrl = this.buildBatchUrl(baseUrl, sections);
        this.batchMap.delete(baseUrl);
        this.timeoutMap.delete(baseUrl);
        try {
            const response = await fetch(batchUrl);
            if (response.ok) {
                const data = await response.json();
                const requestPromises = this.requestPromises.get(baseUrl);
                if (requestPromises) {
                    requestPromises.forEach(({ resolve }) => resolve(data));
                    this.requestPromises.delete(baseUrl);
                }
            }
            else {
                throw response.statusText;
            }
        }
        catch (error) {
            const requestPromises = this.requestPromises.get(baseUrl);
            if (requestPromises) {
                requestPromises.forEach(({ reject }) => reject(error));
                this.requestPromises.delete(baseUrl);
            }
        }
    }
}

/**
 * Debug utility for section-api plugin.
 * Enable by setting `window.debugSectionApi = true` or `window.debug = true`
 */
function isDebugEnabled() {
    return typeof window !== 'undefined' && (window.debugSectionApi === true || window.debug === true);
}
function debugLog(message, data) {
    if (!isDebugEnabled())
        return;
    console.log(`[section-api] ${message}`, data !== undefined ? data : '');
}
function debugLogCacheHit(message, data) {
    if (!isDebugEnabled())
        return;
    console.log(`%c[section-api] ${message}`, 'color: #10b981; font-weight: bold;', data !== undefined ? data : '');
}
function debugLogCacheMiss(message, data) {
    if (!isDebugEnabled())
        return;
    console.log(`%c[section-api] ${message}`, 'color: #ef4444; font-weight: bold;', data !== undefined ? data : '');
}
function debugGroup(label) {
    if (!isDebugEnabled())
        return null;
    console.group(`[section-api] ${label}`);
    return () => console.groupEnd();
}
/** Data attribute for morph root elements (used to isolate morph updates). */
const MORPH_ROOT_ATTR = 'data-morph-root';
/** Selector for all elements with morph root attribute. */
const MORPH_ROOT_SELECTOR = `[${MORPH_ROOT_ATTR}]`;
const fetchBatcher = new FetchBatcher();
const DEFAULT_MORPH_CONFIG = {
    updating(el, _toEl, _childrenOnly, skip) {
        // Skip any built-in shopify elements
        if (el.hasAttribute && el.hasAttribute('data-shopify')) {
            skip();
        }
    },
    removing(el, skip) {
        // Skip any built-in shopify elements
        if (el.hasAttribute && el.hasAttribute('data-shopify')) {
            skip();
        }
    },
};
var sectionApi = (options) => {
    let morphConfig = (options === null || options === void 0 ? void 0 : options.morphConfig) || DEFAULT_MORPH_CONFIG;
    return function (Alpine) {
        if (isDebugEnabled()) {
            console.log('%c[section-api] Debug mode enabled', 'color: #10b981; font-weight: bold; font-size: 12px;', 'Set window.debugSectionApi = false or window.debug = false to disable');
        }
        if ('morph' in Alpine === false) {
            throw new Error('The x-section-api directive requires the @alpinejs/morph plugin');
        }
        if (!Alpine.store('cache')) {
            throw new Error('The x-section-api directive requires the method-ui cache plugin');
        }
        if (!Alpine.store('cache').resources.sectionHtml) {
            Alpine.store('cache').addResource('sectionHtml');
        }
        // Initialize router history management once
        if (!window._x_router_initialized) {
            // Add initial state to the history object so that popstate event is fired when the user navigates back/forward
            window.history.replaceState({
                fromRouter: true,
                url: document.location.href,
            }, '', document.location.href);
            // Reload the page when the user navigates back/forward since our usage of pushState/replaceState would cause the browser not to trigger a page reload
            window.addEventListener('popstate', (event) => {
                var _a;
                if ((_a = event.state) === null || _a === void 0 ? void 0 : _a.fromRouter) {
                    // NOTE this is a quick fix in order to get back/forward buttons working as expected with the router,
                    // however a better solution for things like the collection view would probably be to call the callback function
                    // with the correct href and then update the view accordingly without a page reload i.e. when using $sectionApi.
                    // We'll revisit that when we have time
                    window.location.reload();
                }
            });
            window._x_router_initialized = true;
        }
        Alpine.directive('section-api', ($el, data, utilities) => {
            if (!isHtmlElement($el)) {
                throw new Error(`Expected HTMLElement but got ${$el}`);
            }
            if (data.value === 'form') {
                handleForm$4($el, data, utilities, Alpine);
            }
            else if (data.value === 'link') {
                handleLink($el, data, utilities, Alpine);
            }
            else if (data.value === null) {
                handleRoot$a($el, data, utilities, Alpine, morphConfig);
            }
            else {
                throw new Error(`Unknown directive: x-section-api:${data.value}`);
            }
        }).before('bind');
        Alpine.magic('sectionApi', handleSectionMagic(Alpine));
        bindAllThemeSections(Alpine, (el) => {
            // Add x-section-api directive to all sections making it possible to reload them via section rendering API with $sectionApi.load(...)
            const sectionIdForSectionRenderingApi = el.id.split('shopify-section-')[1]; // e.g. section-featured-product from shopify-section-section-featured-product
            el.setAttribute('x-section-api', sectionIdForSectionRenderingApi);
        });
    };
};
function handleSectionMagic(Alpine) {
    return function ($el) {
        const data = Alpine.$data($el);
        if (!(data === null || data === void 0 ? void 0 : data.__sectionApi_morphConfig)) {
            return {};
        }
        return {
            get morphConfig() {
                return data.__sectionApi_morphConfig;
            },
            set morphConfig(value) {
                data.__sectionApi_morphConfig = value;
            },
            get sectionId() {
                return data.__sectionApi_sectionId;
            },
            get state() {
                return data.__sectionApi_state;
            },
            get error() {
                return data.__sectionApi_error;
            },
            update(options) {
                return data.__sectionApi_update(options);
            },
            load(options) {
                return data.__sectionApi_load(options);
            },
            navigate(url, historyMode) {
                return data.__sectionApi_navigate(url, historyMode);
            },
            setHtml(html, options) {
                return data.__sectionApi_setHtml(html, options);
            },
        };
    };
}
function handleForm$4($el, data, _utilities, Alpine) {
    if (!isFormElement($el)) {
        throw new Error('x-section-api:form directive can only be used on form elements');
    }
    if ($el.method.toLowerCase() == 'post') {
        throw new Error('x-section-api:form directive does not support POST requests');
    }
    const historyMode = getHistoryModeModifier(data.modifiers);
    Alpine.bind($el, {
        [`x-async-form`]() {
            return async (info) => {
                const url = getNavigationUrl(info).toString();
                const data = Alpine.$data($el);
                return data === null || data === void 0 ? void 0 : data.__sectionApi_navigate(url, historyMode);
            };
        },
    });
}
function handleLink($el, data, _utilities, Alpine) {
    if (!isAnchorElement($el)) {
        throw new Error('x-section-api:link directive can only be used on anchor elements');
    }
    const historyMode = getHistoryModeModifier(data.modifiers);
    Alpine.bind($el, {
        [`x-async-link`]() {
            return async (href) => {
                const url = getNavigationUrl({ action: href }).toString();
                const data = Alpine.$data($el);
                return data === null || data === void 0 ? void 0 : data.__sectionApi_navigate(url, historyMode);
            };
        },
    });
}
function handleRoot$a($el, data, _utilities, Alpine, morphConfig) {
    // Grab section id from directive expression
    const sectionId = data.expression;
    if (!sectionId) {
        throw new Error(`x-section-api directive requires a section id to be passed`);
    }
    const options = { morphConfig };
    /**
     * Fetch section HTML (optionally via batcher) and write it into the cache.
     *
     * Note: this helper is intentionally context-free so callers (`load()` vs `update()`)
     * can manage their own state/error/abort behaviors.
     */
    const fetchSectionHtml = async (options) => {
        var _a;
        window.dispatchEvent(new CustomEvent('theme:section:load', { detail: { sectionId: options.sectionId, url: options.requestUrl } }));
        if (options.batch) {
            const result = await fetchBatcher.request(options.requestUrl);
            const html = result[options.sectionId];
            Alpine.store('cache').resources.sectionHtml.set(options.cacheKey, html);
            window.dispatchEvent(new CustomEvent('theme:section:loaded', { detail: { sectionId: options.sectionId, url: options.requestUrl } }));
            return html;
        }
        const result = await fetch(options.requestUrl, Object.assign({ signal: options.signal }, ((_a = options.fetchOptions) !== null && _a !== void 0 ? _a : {})));
        // TODO figure out what to do in error cases, right now we just throw an error...
        if (!result.ok) {
            debugLog('✗ Fetch failed', { status: result.status, statusText: result.statusText, url: options.requestUrl });
            throw new Error(result.statusText);
        }
        const responseHtml = await result.text();
        Alpine.store('cache').resources.sectionHtml.set(options.cacheKey, responseHtml);
        window.dispatchEvent(new CustomEvent('theme:section:loaded', { detail: { sectionId: options.sectionId, url: options.requestUrl } }));
        return responseHtml;
    };
    Alpine.bind($el, {
        'x-data'() {
            var _a, _b;
            return {
                __sectionApi_rootEl: (options === null || options === void 0 ? void 0 : options.rootEl) || $el,
                __sectionApi_state: 'idle',
                __sectionApi_error: null,
                __sectionApi_targetId: (_a = options === null || options === void 0 ? void 0 : options.targetId) !== null && _a !== void 0 ? _a : null,
                __sectionApi_sectionId: sectionId,
                __sectionApi_pendingUrl: null,
                __sectionApi_abortController: null,
                __sectionApi_morphConfig: (_b = options === null || options === void 0 ? void 0 : options.morphConfig) !== null && _b !== void 0 ? _b : DEFAULT_MORPH_CONFIG,
                __sectionApi_buildUrl(buildUrlOptions) {
                    var _a;
                    return buildSectionUrl((_a = buildUrlOptions === null || buildUrlOptions === void 0 ? void 0 : buildUrlOptions.sectionId) !== null && _a !== void 0 ? _a : this.__sectionApi_sectionId, Object.assign(Object.assign({}, buildUrlOptions), { targetId: this.__sectionApi_targetId }));
                },
                /**
                 * Update the section either from the cache or the network depending on the cache policy
                 */
                __sectionApi_update: async function (options) {
                    var _a, _b;
                    const endGroup = debugGroup(`update() - ${this.__sectionApi_sectionId}`);
                    const cachePolicy = (_a = options === null || options === void 0 ? void 0 : options.cachePolicy) !== null && _a !== void 0 ? _a : 'cache-and-network';
                    const url = this.__sectionApi_buildUrl(options);
                    const requestUrl = (_b = options === null || options === void 0 ? void 0 : options.url) !== null && _b !== void 0 ? _b : url;
                    debugLog('update()', {
                        sectionId: this.__sectionApi_sectionId,
                        cachePolicy,
                        url: requestUrl,
                        htmlMode: options === null || options === void 0 ? void 0 : options.htmlMode,
                    });
                    const _notify = (url) => {
                        window.dispatchEvent(new CustomEvent('theme:section:update', { detail: { sectionId: this.__sectionApi_sectionId, url } }));
                    };
                    const _update = async () => {
                        var _a, _b, _c;
                        let resultHtml;
                        if (cachePolicy == 'cache-only') {
                            const cachedHtml = Alpine.store('cache').resources.sectionHtml.get(url);
                            if (cachedHtml) {
                                debugLogCacheHit('✓ Cache hit (cache-only)', { url, htmlLength: cachedHtml.length });
                                this.__sectionApi_setHtml(cachedHtml, {
                                    mode: options === null || options === void 0 ? void 0 : options.htmlMode,
                                    morphConfig: options === null || options === void 0 ? void 0 : options.morphConfig,
                                    onlyRoots: options === null || options === void 0 ? void 0 : options.onlyRoots,
                                });
                                _notify(url);
                            }
                            else {
                                debugLogCacheMiss('✗ Cache miss (cache-only)', { url });
                            }
                            resultHtml = cachedHtml;
                        }
                        else if (cachePolicy == 'network-only') {
                            if ((options === null || options === void 0 ? void 0 : options.abortPending) != false) {
                                (_a = this.__sectionApi_abortController) === null || _a === void 0 ? void 0 : _a.abort();
                            }
                            this.__sectionApi_abortController = new AbortController();
                            this.__sectionApi_pendingUrl = requestUrl;
                            this.__sectionApi_state = 'loading';
                            this.__sectionApi_error = null;
                            try {
                                const { url: _url, baseUrl: _baseUrl, sectionId: _sectionId, cacheKey: _cacheKey, batch: _batch, waitForIdle: _waitForIdle, abortPending: _abortPending, force: _force, loadingState: _loadingState, fetchOptions, } = (options || {});
                                const updatedHtml = await fetchSectionHtml({
                                    sectionId: this.__sectionApi_sectionId,
                                    requestUrl,
                                    cacheKey: url,
                                    batch: options === null || options === void 0 ? void 0 : options.batch,
                                    signal: this.__sectionApi_abortController.signal,
                                    fetchOptions,
                                });
                                if (updatedHtml) {
                                    this.__sectionApi_setHtml(updatedHtml, {
                                        mode: options === null || options === void 0 ? void 0 : options.htmlMode,
                                        morphConfig: options === null || options === void 0 ? void 0 : options.morphConfig,
                                        onlyRoots: options === null || options === void 0 ? void 0 : options.onlyRoots,
                                    });
                                    _notify(url);
                                }
                                resultHtml = updatedHtml;
                            }
                            catch (e) {
                                if (e.name == 'AbortError') {
                                    this.__sectionApi_state = 'idle';
                                    return;
                                }
                                this.__sectionApi_state = 'error';
                                this.__sectionApi_error = prettyPrintError(e);
                                debugLog('✗ Fetch error', { error: this.__sectionApi_error });
                                throw e;
                            }
                            finally {
                                this.__sectionApi_pendingUrl = null;
                                if (this.__sectionApi_state !== 'error') {
                                    this.__sectionApi_state = 'idle';
                                }
                            }
                        }
                        else if (cachePolicy == 'cache-first') {
                            const cachedHtml = Alpine.store('cache').resources.sectionHtml.get(url);
                            if (cachedHtml) {
                                debugLogCacheHit('✓ Cache hit', { url, htmlLength: cachedHtml.length });
                                this.__sectionApi_setHtml(cachedHtml, {
                                    mode: options === null || options === void 0 ? void 0 : options.htmlMode,
                                    morphConfig: options === null || options === void 0 ? void 0 : options.morphConfig,
                                    onlyRoots: options === null || options === void 0 ? void 0 : options.onlyRoots,
                                });
                                _notify(url);
                                return cachedHtml;
                            }
                            else {
                                debugLogCacheMiss('✗ Cache miss: fetching', { url });
                                if ((options === null || options === void 0 ? void 0 : options.abortPending) != false) {
                                    (_b = this.__sectionApi_abortController) === null || _b === void 0 ? void 0 : _b.abort();
                                }
                                this.__sectionApi_abortController = new AbortController();
                                this.__sectionApi_pendingUrl = requestUrl;
                                this.__sectionApi_state = 'loading';
                                this.__sectionApi_error = null;
                                try {
                                    const { url: _url, baseUrl: _baseUrl, sectionId: _sectionId, cacheKey: _cacheKey, batch: _batch, waitForIdle: _waitForIdle, abortPending: _abortPending, force: _force, loadingState: _loadingState, fetchOptions, } = (options || {});
                                    const updatedHtml = await fetchSectionHtml({
                                        sectionId: this.__sectionApi_sectionId,
                                        requestUrl,
                                        cacheKey: url,
                                        batch: options === null || options === void 0 ? void 0 : options.batch,
                                        signal: this.__sectionApi_abortController.signal,
                                        fetchOptions,
                                    });
                                    if (updatedHtml) {
                                        _notify(url);
                                        this.__sectionApi_setHtml(updatedHtml, {
                                            mode: options === null || options === void 0 ? void 0 : options.htmlMode,
                                            morphConfig: options === null || options === void 0 ? void 0 : options.morphConfig,
                                            onlyRoots: options === null || options === void 0 ? void 0 : options.onlyRoots,
                                        });
                                    }
                                    resultHtml = updatedHtml;
                                }
                                catch (e) {
                                    if (e.name == 'AbortError') {
                                        this.__sectionApi_state = 'idle';
                                        return;
                                    }
                                    this.__sectionApi_state = 'error';
                                    this.__sectionApi_error = prettyPrintError(e);
                                    debugLog('✗ Fetch error', { error: this.__sectionApi_error });
                                    throw e;
                                }
                                finally {
                                    this.__sectionApi_pendingUrl = null;
                                    if (this.__sectionApi_state !== 'error') {
                                        this.__sectionApi_state = 'idle';
                                    }
                                }
                            }
                        }
                        else if (cachePolicy == 'cache-and-network') {
                            const cachedHtml = Alpine.store('cache').resources.sectionHtml.get(url);
                            if (cachedHtml) {
                                debugLogCacheHit('✓ Cache hit: rendering from cache, then fetching', {
                                    url,
                                    htmlLength: cachedHtml.length,
                                });
                                this.__sectionApi_setHtml(cachedHtml, {
                                    mode: options === null || options === void 0 ? void 0 : options.htmlMode,
                                    morphConfig: options === null || options === void 0 ? void 0 : options.morphConfig,
                                    onlyRoots: options === null || options === void 0 ? void 0 : options.onlyRoots,
                                });
                            }
                            else {
                                debugLogCacheMiss('✗ Cache miss: fetching', { url });
                            }
                            if ((options === null || options === void 0 ? void 0 : options.abortPending) != false) {
                                (_c = this.__sectionApi_abortController) === null || _c === void 0 ? void 0 : _c.abort();
                            }
                            this.__sectionApi_abortController = new AbortController();
                            this.__sectionApi_pendingUrl = requestUrl;
                            this.__sectionApi_state = cachedHtml ? 'refreshing' : 'loading';
                            this.__sectionApi_error = null;
                            try {
                                const { url: _url, baseUrl: _baseUrl, sectionId: _sectionId, cacheKey: _cacheKey, batch: _batch, waitForIdle: _waitForIdle, abortPending: _abortPending, force: _force, loadingState: _loadingState, fetchOptions, } = (options || {});
                                const updatedHtml = await fetchSectionHtml({
                                    sectionId: this.__sectionApi_sectionId,
                                    requestUrl,
                                    cacheKey: url,
                                    batch: options === null || options === void 0 ? void 0 : options.batch,
                                    signal: this.__sectionApi_abortController.signal,
                                    fetchOptions,
                                });
                                if (updatedHtml) {
                                    _notify(url);
                                    this.__sectionApi_setHtml(updatedHtml, {
                                        mode: options === null || options === void 0 ? void 0 : options.htmlMode,
                                        morphConfig: options === null || options === void 0 ? void 0 : options.morphConfig,
                                        onlyRoots: options === null || options === void 0 ? void 0 : options.onlyRoots,
                                    });
                                }
                                resultHtml = updatedHtml;
                            }
                            catch (e) {
                                if (e.name == 'AbortError') {
                                    this.__sectionApi_state = 'idle';
                                    return;
                                }
                                this.__sectionApi_state = 'error';
                                this.__sectionApi_error = prettyPrintError(e);
                                debugLog('✗ Fetch error', { error: this.__sectionApi_error });
                                throw e;
                            }
                            finally {
                                this.__sectionApi_pendingUrl = null;
                                if (this.__sectionApi_state !== 'error') {
                                    this.__sectionApi_state = 'idle';
                                }
                            }
                        }
                        else {
                            throw new Error(`Unknown cache policy: ${cachePolicy}`);
                        }
                        return resultHtml;
                    };
                    if (options === null || options === void 0 ? void 0 : options.waitForIdle) {
                        return new Promise(async (resolve) => {
                            window.requestIdleCallback(async () => {
                                const result = await _update();
                                endGroup === null || endGroup === void 0 ? void 0 : endGroup();
                                resolve(result);
                            });
                        });
                    }
                    else {
                        const result = await _update();
                        endGroup === null || endGroup === void 0 ? void 0 : endGroup();
                        return result;
                    }
                },
                /**
                 * Load data for the section from the network and populate the cache.
                 * Does not update the DOM or return any value.
                 * By default, only fetches if there's no cache entry. Use `force: true` to always fetch.
                 */
                __sectionApi_load: async function (options) {
                    var _a, _b;
                    const endGroup = debugGroup(`load() - ${this.__sectionApi_sectionId}`);
                    const url = (_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : this.__sectionApi_buildUrl(options);
                    const force = (_b = options === null || options === void 0 ? void 0 : options.force) !== null && _b !== void 0 ? _b : false;
                    debugLog('load()', { sectionId: this.__sectionApi_sectionId, url, force });
                    // If not forcing, check cache first
                    if (!force) {
                        const cachedHtml = Alpine.store('cache').resources.sectionHtml.get(url);
                        if (cachedHtml) {
                            debugLogCacheHit('✓ Cache hit: skipping fetch', { url, htmlLength: cachedHtml.length });
                            endGroup === null || endGroup === void 0 ? void 0 : endGroup();
                            return;
                        }
                    }
                    const { url: _url, baseUrl: _baseUrl, sectionId: _sectionId, cacheKey: _cacheKey, batch: _batch, waitForIdle: _waitForIdle, abortPending: _abortPending, force: _force, loadingState: _loadingState, fetchOptions, } = (options || {});
                    try {
                        await fetchSectionHtml({
                            sectionId: this.__sectionApi_sectionId,
                            requestUrl: url,
                            cacheKey: url,
                            batch: options === null || options === void 0 ? void 0 : options.batch,
                            fetchOptions,
                        });
                        endGroup === null || endGroup === void 0 ? void 0 : endGroup();
                    }
                    catch (e) {
                        if (e.name == 'AbortError') {
                            endGroup === null || endGroup === void 0 ? void 0 : endGroup();
                            return;
                        }
                        debugLog('✗ Load error', { error: prettyPrintError(e) });
                        endGroup === null || endGroup === void 0 ? void 0 : endGroup();
                        throw e;
                    }
                },
                /**
                 * Navigates to a new URL by updating the browser history and then updating the section content.
                 *
                 * @param url - The URL to navigate to
                 * @param historyMode - How to update the browser history: 'push' (default), 'replace', or 'none'
                 * @returns A promise that resolves with the updated HTML content (or undefined)
                 */
                __sectionApi_navigate: async function (url, historyMode) {
                    const urlObj = new URL(url, window.location.href);
                    const baseUrl = `${urlObj.pathname}${urlObj.search}`;
                    if (historyMode == 'replace') {
                        window.history.replaceState({ fromRouter: true, url: urlObj.toString() }, '', urlObj.toString());
                    }
                    else if (historyMode == 'push') {
                        window.history.pushState({ fromRouter: true, url: urlObj.toString() }, '', urlObj.toString());
                    }
                    const result = await this.__sectionApi_update({ baseUrl });
                    window.dispatchEvent(new CustomEvent('theme:section:navigate', {
                        detail: {
                            sectionId,
                            url: baseUrl,
                        },
                    }));
                    return result;
                },
                __sectionApi_setHtml(html, options) {
                    var _a, _b, _c, _d, _e;
                    const endGroup = debugGroup(`setHtml() - ${this.__sectionApi_sectionId}`);
                    const mode = (_a = options === null || options === void 0 ? void 0 : options.mode) !== null && _a !== void 0 ? _a : 'morph';
                    // Shopify inserts an extra comment when using section rendering API in the theme editor which
                    // breaks the morphing process. This removes it.
                    const sanitizedHtml = html.replace(/<!--shopify:rendered_by_section_api-->/g, '');
                    const morphConfig = (_b = options === null || options === void 0 ? void 0 : options.morphConfig) !== null && _b !== void 0 ? _b : this.__sectionApi_morphConfig;
                    if ((options === null || options === void 0 ? void 0 : options.mode) == 'replace') {
                        debugLog('setHtml() - replace mode', { htmlLength: html.length });
                        Alpine.mutateDom(() => {
                            // Section API returns the full wrapper (e.g. <div x-section-api="...">...</div>).
                            // Use only the wrapper's innerHTML so we don't nest another section root inside the existing one
                            const doc = new DOMParser().parseFromString(sanitizedHtml, 'text/html');
                            const responseRoot = doc.body.firstElementChild;
                            const content = responseRoot ? responseRoot.innerHTML : sanitizedHtml;
                            this.__sectionApi_rootEl.innerHTML = content;
                            // Re-initialize alpine on cloned node
                            Alpine.skipDuringClone(() => Alpine.initTree(this.__sectionApi_rootEl))();
                        });
                        endGroup === null || endGroup === void 0 ? void 0 : endGroup();
                    }
                    else {
                        const doc = new DOMParser().parseFromString(sanitizedHtml, 'text/html');
                        const newRoot = doc.body.firstElementChild;
                        if (!newRoot)
                            return;
                        const fromRoots = this.__sectionApi_rootEl.querySelectorAll(MORPH_ROOT_SELECTOR);
                        const toRoots = newRoot.querySelectorAll(MORPH_ROOT_SELECTOR);
                        // Only morph deepest (leaf) roots when nesting: skip any root that contains another morph root
                        let leafFromRoots = Array.from(fromRoots).filter((fromEl) => {
                            const containsOtherRoot = Array.from(fromRoots).some((other) => other !== fromEl && fromEl.contains(other));
                            return !containsOtherRoot;
                        });
                        // When onlyRoots is set, only morph roots whose data-morph-root value is in the list
                        if ((_c = options === null || options === void 0 ? void 0 : options.onlyRoots) === null || _c === void 0 ? void 0 : _c.length) {
                            const allowed = new Set(options.onlyRoots);
                            leafFromRoots = leafFromRoots.filter((el) => {
                                const key = el.getAttribute(MORPH_ROOT_ATTR);
                                return key != null && key !== '' && allowed.has(key);
                            });
                        }
                        const hasRoots = leafFromRoots.length && toRoots.length;
                        const onlyRootsProvided = ((_e = (_d = options === null || options === void 0 ? void 0 : options.onlyRoots) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0) > 0;
                        debugLog('setHtml() - morph mode', {
                            mode,
                            htmlLength: html.length,
                            hasMorphRoots: hasRoots,
                            morphRootCount: hasRoots ? leafFromRoots.length : 0,
                            rootKeys: hasRoots ? leafFromRoots.map((el) => el.getAttribute(MORPH_ROOT_ATTR)) : undefined,
                        });
                        const _morph = (rootEl, html) => morph(rootEl, html, morphConfig);
                        if (hasRoots) {
                            leafFromRoots.forEach((fromEl) => {
                                const key = fromEl.getAttribute(MORPH_ROOT_ATTR);
                                if (key == '' || key == null)
                                    return;
                                const toEl = newRoot.querySelector(`[${MORPH_ROOT_ATTR}="${key}"]`);
                                if (!toEl)
                                    return;
                                _morph(fromEl, toEl.outerHTML);
                            });
                        }
                        else if (onlyRootsProvided) {
                            // onlyRoots was provided but none matched (typo, removed root, etc.) — do not morph
                            // the entire section; that would overwrite content the caller explicitly wanted to protect
                            debugLog('setHtml() - onlyRoots provided but no matching roots, skipping morph');
                        }
                        else {
                            _morph(this.__sectionApi_rootEl, sanitizedHtml);
                        }
                        endGroup === null || endGroup === void 0 ? void 0 : endGroup();
                    }
                },
                destroy() {
                    var _a;
                    (_a = this.__sectionApi_abortController) === null || _a === void 0 ? void 0 : _a.abort();
                },
            };
        },
        'aria-atomic': 'true',
    });
}
function buildSectionUrl(sectionId, options) {
    var _a, _b, _c, _d;
    const fullUrl = new URL((_d = (_a = options === null || options === void 0 ? void 0 : options.baseUrl) !== null && _a !== void 0 ? _a : (_c = (_b = window.theme) === null || _b === void 0 ? void 0 : _b.routes) === null || _c === void 0 ? void 0 : _c.root) !== null && _d !== void 0 ? _d : '/', window.location.href);
    let sanitizedSectionId;
    // Handle case of section ID from section DOM element being passed in (i.e. prepended with 'shopify-section-')
    if (sectionId.startsWith('shopify-section-')) {
        sanitizedSectionId = sectionId.split('shopify-section-')[1];
    }
    else {
        sanitizedSectionId = sectionId;
    }
    if (options === null || options === void 0 ? void 0 : options.targetId) {
        fullUrl.hash = options.targetId;
    }
    fullUrl.searchParams.append('section_id', sanitizedSectionId);
    return fullUrl.toString();
}
function getHistoryModeModifier(modifiers, defaultMode = 'push') {
    if (modifiers.includes('replace')) {
        return 'replace';
    }
    else if (modifiers.includes('push')) {
        return 'push';
    }
    else if (modifiers.includes('nopush')) {
        return 'none';
    }
    else {
        return defaultMode;
    }
}
function getNavigationUrl(navigationInfo) {
    let url = new URL(navigationInfo.action);
    if ((navigationInfo === null || navigationInfo === void 0 ? void 0 : navigationInfo.formData) && (navigationInfo === null || navigationInfo === void 0 ? void 0 : navigationInfo.method) === 'GET') {
        let formData = navigationInfo.formData;
        let searchParams = new URLSearchParams(formData);
        url.search = searchParams.toString();
    }
    return url;
}
function bindAllThemeSections(Alpine, cb) {
    document.addEventListener('DOMContentLoaded', () => {
        const sections = document.getElementsByClassName('shopify-section');
        for (const el of sections) {
            if (isHtmlElement(el)) {
                cb(el);
            }
        }
        // Re-bind sections when they are re-loaded by the theme editor
        window.addEventListener(ThemeEditorEvent.SECTION_LOAD, (e) => {
            var _a;
            if ((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode) {
                const loadedEvent = e;
                const section = document.getElementById(`shopify-section-${loadedEvent.detail.sectionId}`);
                if (section) {
                    Alpine.deferMutations();
                    cb(section);
                    Alpine.flushAndStopDeferringMutations();
                }
            }
        });
    });
}

/**
 * Hijacks product form submissions and serializes form data and submits to the `/cart/add.js` endpoint instead of a normal HTTP form submission.
 *
 * Notes:
 * - Looks for sections marked with data-cart-api-section and adds them in the 'sections' form data parameter so that the theme can update the sections in response to the form submission.
 * - Dispatches a theme:cart:add:success event with the parsed body of the response.
 *
 * @example
 *
 * ```liquid
 * {% form 'product', product, x-product-form: '' %}
 *   <input type="hidden" name="id" value="123">
 *   <input type="text" name="name" value="Product Name">
 *   <button type="submit">Add to cart</button>
 * {% endform %}
 * ```
 *
 * @example Applying x-product-form to a parent of a form element. In this case the form directive will be automatically applied to the form element found inside the div.
 * ```liquid
 * <div x-product-form>
 *   {% form 'product', product, x-product-form: '' %}
 *     <input type="hidden" name="id" value="123">
 *     <input type="text" name="name" value="Product Name">
 *     <button type="submit">Add to cart</button>
 *   {% endform %}
 * </div>
 * ```
 *
 * ## Events
 * - `theme:cart:add:success` - Dispatched when the form is successfully submitted. Event detail is the parsed body of the response.
 * - `theme:cart:add:error` - Dispatched when the form encounters an error. Event detail is an object with the following properties:
 *   - `message` - The error message
 *   - `description` - The error description
 */
function productForm (Alpine) {
    Alpine.directive('product-form', ($el, data, utilities) => {
        if (data.value == 'form') {
            handleForm$3($el, Alpine);
        }
        else if (data.value == 'context') {
            handleContext$2($el, Alpine, data);
        }
        else if (data.value == null) {
            handleRoot$9($el, Alpine, data);
        }
        else {
            throw new Error(`Unknown directive: x-product-form:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('productForm', handleAsyncFormMagic(Alpine));
}
function handleForm$3($el, Alpine, data, utilities) {
    Alpine.bind($el, {
        method: 'POST',
    });
}
function handleContext$2($el, Alpine, data, _utilities) {
    const xFormModifiers = data.modifiers.length ? data.modifiers.join('.') : null;
    Alpine.bind($el, {
        'x-data'() {
            return {
                quantity: 1,
                variantId: null,
                __productForm_save(data) {
                    var _a;
                    // Gather up all the sections marked with data-cart-api-section and add them in the 'sections' form data parameter
                    (_a = data.formData) === null || _a === void 0 ? void 0 : _a.append('sections', getCartApiSections().join(','));
                    data.action = `${window.theme.routes.cartAdd}.js`;
                    return submitFormData(data);
                },
            };
        },
        [`x-async-form${xFormModifiers ? `.${xFormModifiers}` : ``}`]: '__productForm_save',
        '@form:success'() {
            (this.__asyncForm_formEl || this.$el).dispatchEvent(new CustomEvent('theme:cart:add:success', {
                bubbles: true,
                // Allows events to pass the shadow DOM barrier.
                composed: true,
                cancelable: true,
                detail: this.$event.detail,
            }));
        },
        '@form:error'() {
            (this.__asyncForm_formEl || this.$el).dispatchEvent(new CustomEvent('theme:cart:add:error', {
                bubbles: true,
                // Allows events to pass the shadow DOM barrier.
                composed: true,
                cancelable: true,
                detail: Object.assign({}, this.$event.detail),
            }));
        },
    });
}
function handleRoot$9($el, Alpine, data, _utilities) {
    var _a, _b;
    const xFormModifiers = data.modifiers.length ? data.modifiers.join('.') : null;
    if (!((_b = (_a = window === null || window === void 0 ? void 0 : window.theme) === null || _a === void 0 ? void 0 : _a.routes) === null || _b === void 0 ? void 0 : _b.cartAdd)) {
        throw new Error('window.theme.routes.cartAdd is not defined');
    }
    if (isFormElement($el)) {
        // If $el is a form element, apply the context and form directives to it directly
        Alpine.bind($el, {
            [`x-product-form:context${xFormModifiers ? `.${xFormModifiers}` : ``}`]: '',
            [`x-product-form:form`]: '',
        });
    }
    else {
        // If $el is not a form element, apply the context directive to it and look for a form element child to apply the form directive to
        Alpine.bind($el, {
            [`x-product-form:context${xFormModifiers ? `.${xFormModifiers}` : ``}`]: '',
        });
        const form = $el.querySelector('form');
        if (form) {
            Alpine.bind(form, {
                [`x-product-form:form`]: '',
            });
        }
    }
}

/**
 * Plugin to show a loading placeholder for an image until it has loaded
 *
 * To use:
 * 1. Create a smaller sized version of your image and place it next to (before or after) the original
 * 2. Style it to be the same size as the original and absolutely positioned above or below the original
 * 3. Add the x-img-loading-placeholder directive on the placeholder image
 *
 * <div class="relative">
 *   <img src="/test?width=1000&height=100.png" class="relative z-10" width="1000" height="1000">
 *   <img src="/test.png?width=4&height=4.png" x-img-loading-placeholder class="absolute inset-0 z-0" role="presentation">
 * </div>
 *
 * Or you can pass a reference directly to the directive
 *
 * <div class="relative">
 *   <img x-ref="original" src="/test?width=1000&height=100.png" class="relative z-10" width="1000" height="1000">
 *   <div>
 *    <img src="/test.png?width=4&height=4.png" x-img-loading-placeholder="$refs.original" class="absolute inset-0 z-0" role="presentation">
 *   </div>
 * </div>
 *
 * You can also force the placeholder to show by default by adding the .show modifier
 *
 * <div class="relative">
 *   <img src="/test?width=1000&height=100.png" class="relative z-10" width="1000" height="1000">
 *   <img src="/test.png?width=4&height=4.png" x-img-loading-placeholder.show class="absolute inset-0 z-0" role="presentation">
 * </div>
 */
var imageLoadingPlaceholder = (Alpine) => {
    Alpine.directive('img-loading-placeholder', ($el, { expression }, { evaluate }) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLImageElement but got ${$el}`);
        }
        let targetImage = null;
        if (expression) {
            targetImage = evaluate(expression) || null;
            if (!isImageElement(targetImage)) {
                throw new Error(`Expected targetImage to be HTMLImageElement but got ${$el}`);
            }
        }
        Alpine.bind($el, {
            'x-data'() {
                return {
                    __imgLoadingPlaceholder_showPlaceholder: true,
                    __imgLoadingPlaceholder_targetImage: targetImage,
                    init() {
                        var _a, _b;
                        // Look at the next and previous siblings to see if they are images and
                        // if so then set the target image to that
                        if (!this.__imgLoadingPlaceholder_targetImage && ((_a = this.$el.nextElementSibling) === null || _a === void 0 ? void 0 : _a.nodeName) === 'IMG') {
                            this.__imgLoadingPlaceholder_targetImage = this.$el.nextElementSibling;
                        }
                        if (!this.__imgLoadingPlaceholder_targetImage && ((_b = this.$el.previousElementSibling) === null || _b === void 0 ? void 0 : _b.nodeName) === 'IMG') {
                            this.__imgLoadingPlaceholder_targetImage = this.$el.previousElementSibling;
                        }
                        // If no target image, don't show a placeholder
                        if (!this.__imgLoadingPlaceholder_targetImage) {
                            this.__imgLoadingPlaceholder_showPlaceholder = false;
                            return;
                        }
                        // If image already loaded, hide the placeholder
                        if (this.__imgLoadingPlaceholder_targetImage.complete) {
                            this.$nextTick(() => {
                                this.__imgLoadingPlaceholder_showPlaceholder = false;
                            });
                        }
                        else {
                            const handleLoad = (_e) => {
                                this.__imgLoadingPlaceholder_showPlaceholder = false;
                            };
                            this.__imgLoadingPlaceholder_targetImage.onload = handleLoad.bind(this);
                        }
                    },
                };
            },
            'x-show': '__imgLoadingPlaceholder_showPlaceholder',
            'aria-hidden': 'true',
            role: 'presentation',
        });
    }).before('bind');
};

const HOVER_CONTEXT_KEY = Symbol('HOVER_CONTEXT_KEY');
/**
 * Plugin for managing hover states on elements. Automatically adds/removes event listeners, ignores touch events,
 * and optionally adds a delay before evaluating the expression for cases like tooltips.
 * Use $isHovering in templates for reactive hover state (boolean).
 *
 * @example
 * <div x-hover:start="console.log('hover started')"></div>
 * <div x-hover:end="console.log('hover ended')"></div>
 * <div x-hover:start.delay.300ms="console.log('hover started with delay')"></div>
 * @example
 * <div x-hover :class="{ 'bg-primary': $isHovering }">Hover me</div>
 * @example
 * <div x-hover="$isHovering ? console.log('hover') : console.log('unhover')">Hover me</div>
 */
var hover = (Alpine) => {
    function getHoverContext(el) {
        var _a;
        return (_a = Alpine.$data(el)) === null || _a === void 0 ? void 0 : _a[HOVER_CONTEXT_KEY];
    }
    // Define the x-hover directive
    Alpine.directive('hover', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value == 'start') {
            handleStart($el, data, utilities);
        }
        else if (data.value == 'end') {
            handleEnd($el, data, utilities);
        }
        else if (data.value == null) {
            handleRoot($el, data, utilities);
        }
        else {
            throw new Error(`Unknown directive: x-press:${data.value}`);
        }
    }).before('bind');
    function ensureHoverContext($el, cleanup) {
        if (getHoverContext($el))
            return;
        const context = Alpine.reactive({ value: false });
        const undo = Alpine.addScopeToNode($el, {
            [HOVER_CONTEXT_KEY]: context,
        });
        cleanup(undo);
    }
    /**
     * Handles x-hover or x-hover="expression" — sets up $isHovering; optionally evaluates expression on enter/leave.
     */
    function handleRoot($el, { expression }, { evaluateLater, cleanup }) {
        ensureHoverContext($el, cleanup);
        const expressionFn = expression ? evaluateLater(expression) : null;
        function runExpression() {
            var _a;
            const context = getHoverContext($el);
            expressionFn === null || expressionFn === void 0 ? void 0 : expressionFn(() => { }, {
                scope: { $isHovering: (_a = context === null || context === void 0 ? void 0 : context.value) !== null && _a !== void 0 ? _a : false },
                params: [],
            });
        }
        function onPointerLeave(e) {
            if (!isHoverSupported())
                return;
            if (isTouchEvent(e))
                return;
            const context = getHoverContext($el);
            if (context)
                context.value = false;
            runExpression();
        }
        function onPointerEnter(e) {
            if (!isHoverSupported())
                return;
            if (isTouchEvent(e))
                return;
            const context = getHoverContext($el);
            if (context)
                context.value = true;
            $el.addEventListener('pointerleave', onPointerLeave, { once: true });
            runExpression();
        }
        Alpine.bind($el, {
            '@pointerenter': onPointerEnter,
        });
        cleanup(() => $el.removeEventListener('pointerleave', onPointerLeave));
    }
    /**
     * Handles the x-hover:start directive
     */
    function handleStart($el, { expression, modifiers }, { evaluateLater, cleanup }) {
        ensureHoverContext($el, cleanup);
        const expressionFn = expression ? evaluateLater(expression) : null;
        // Determine modifiers
        const shouldDelay = modifiers.includes('delay');
        let delayTimeoutId = null;
        $el._x_hover_hasEnterCallback = true;
        let delay = 0;
        if (shouldDelay) {
            delay = getDelayModifier(modifiers);
        }
        /**
         * Evaluates the callback expression provided in the directive
         */
        function evaluateCallbackExpression(e) {
            expressionFn === null || expressionFn === void 0 ? void 0 : expressionFn(() => { }, {
                scope: {
                    $event: e,
                },
                params: [e],
            });
        }
        /**
         * Handles pointer/mouse leave events
         */
        function onPointerLeave(e) {
            var _a;
            if (!isHoverSupported())
                return;
            if (isTouchEvent(e))
                return;
            const context = getHoverContext($el);
            if (context)
                context.value = false;
            if ($el._x_hover_leaveCallback) {
                // If x-hover:end is used on the same element, call the leave callback
                (_a = $el._x_hover_leaveCallback) === null || _a === void 0 ? void 0 : _a.call($el, e);
            }
            // Clear any timeouts
            if (delayTimeoutId !== null) {
                clearTimeout(delayTimeoutId);
                delayTimeoutId = null;
            }
        }
        /**
         * Handles pointer/mouse enter events
         */
        function onPointerEnter(e) {
            if (!isHoverSupported())
                return;
            if (isTouchEvent(e))
                return;
            const context = getHoverContext($el);
            if (context)
                context.value = true;
            $el.addEventListener('pointerleave', onPointerLeave, {
                once: true,
            });
            if (shouldDelay) {
                // Handle delay before triggering the callback
                delayTimeoutId = setTimeout(() => {
                    evaluateCallbackExpression === null || evaluateCallbackExpression === void 0 ? void 0 : evaluateCallbackExpression(e);
                }, delay);
            }
            else {
                // No delay, trigger callback immediately
                evaluateCallbackExpression === null || evaluateCallbackExpression === void 0 ? void 0 : evaluateCallbackExpression(e);
            }
        }
        // Bind the appropriate enter event
        Alpine.bind($el, {
            '@pointerenter': onPointerEnter,
        } /* Remove 'any' when @alpinejs/types is fixed */);
        // Clean up any timeouts and event listeners on cleanup
        cleanup(() => {
            if (delayTimeoutId !== null) {
                clearTimeout(delayTimeoutId);
            }
            $el.removeEventListener('pointerleave', onPointerLeave);
        });
    }
    /**
     * Handles the x-hover:end directive
     */
    function handleEnd($el, { expression, modifiers }, { evaluateLater, cleanup }) {
        ensureHoverContext($el, cleanup);
        const expressionFn = evaluateLater(expression);
        let onPointerReenter = () => { };
        const shouldDelay = modifiers.includes('delay');
        let delayTimeoutId = null;
        let delay = 0;
        if (shouldDelay) {
            delay = getDelayModifier(modifiers);
        }
        /**
         * Evaluates the callback expression provided in the directive
         */
        function evaluateCallbackExpression(e) {
            expressionFn === null || expressionFn === void 0 ? void 0 : expressionFn(() => { }, {
                scope: {
                    $event: e,
                },
                params: [e],
            });
        }
        /**
         * Handles pointer/mouse leave events
         */
        function onPointerLeave(e) {
            if (!isHoverSupported())
                return;
            if (isTouchEvent(e))
                return;
            const context = getHoverContext($el);
            if (context)
                context.value = false;
            if (shouldDelay) {
                onPointerReenter = () => {
                    if (delayTimeoutId !== null) {
                        clearTimeout(delayTimeoutId);
                        delayTimeoutId = null;
                    }
                };
                // Start a timer to execute the expression after the delay
                delayTimeoutId = setTimeout(() => {
                    $el.removeEventListener('pointerenter', onPointerReenter);
                    evaluateCallbackExpression(e);
                }, delay);
                // If pointer re-enters before delay is over, clear the timeout
                $el.addEventListener('pointerenter', onPointerReenter, { once: true });
            }
            else {
                evaluateCallbackExpression(e);
            }
        }
        if ($el._x_hover_hasEnterCallback) {
            // If x-hover:start is already also used on this element, store the leave callback
            $el._x_hover_leaveCallback = onPointerLeave;
        }
        else {
            // If x-hover:end is used alone, add the leave event listener directly
            Alpine.bind($el, {
                '@pointerleave': onPointerLeave,
            } /* Remove 'any' when @alpinejs/types is fixed */);
        }
        cleanup(() => {
            if (delayTimeoutId !== null) {
                clearTimeout(delayTimeoutId);
            }
            $el.removeEventListener('pointerenter', onPointerReenter);
        });
    }
    /**
     * Retrieves the delay value from the modifiers
     */
    function getDelayModifier(modifiers) {
        const delayIndex = modifiers.indexOf('delay');
        const timeModifier = modifiers[delayIndex + 1];
        if (timeModifier) {
            const parsedTime = Number(timeModifier.replace('ms', ''));
            if (!isNaN(parsedTime)) {
                return parsedTime;
            }
        }
        // Default delay value if not specified
        return 0;
    }
    /**
     * Magic that returns reactive hover state for the current element or nearest ancestor with x-hover.
     * Use $isHovering in templates; true while the pointer is over the element.
     */
    Alpine.magic('isHovering', (el) => {
        const context = getHoverContext(el);
        if (context)
            return context.value;
        return false;
    });
};

const PRESS_CONTEXT_KEY = Symbol('PRESS_CONTEXT_KEY');
/**
 * Plugin for managing press state on elements. Listens to pointer down/up/cancel and keydown/keyup
 * (Enter/Space) when focused. Only the primary pointer is used (left mouse or primary touch); right-click
 * and secondary touches are ignored. Pointer up/cancel are listened for on window so release is detected
 * even outside the element. x-press:end and expression callbacks receive $success (true if released over
 * the element or a child, false on pointercancel or release outside). Non-focusable elements get tabIndex=0
 * so they can receive keyboard press. Use $isPressing in templates for reactive press state (boolean).
 *
 * @example
 * <button x-press:start="console.log('press started')">Press me</button>
 * @example
 * <button x-press:end="console.log('press ended')">Press me</button>
 * @example
 * <button x-press :class="{ 'scale-95': $isPressing }">Press me</button>
 * @example
 * <button x-press="$isPressing ? console.log('pressing') : console.log('released')">Press me</button>
 */
var press = (Alpine) => {
    function getPressContext(el) {
        var _a;
        return (_a = Alpine.$data(el)) === null || _a === void 0 ? void 0 : _a[PRESS_CONTEXT_KEY];
    }
    Alpine.directive('press', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value == 'start') {
            handleStart($el, data, utilities);
        }
        else if (data.value == 'end') {
            handleEnd($el, data, utilities);
        }
        else if (data.value == null) {
            handleRoot($el, data, utilities);
        }
        else {
            throw new Error(`Unknown directive: x-hover:${data.value}`);
        }
    }).before('bind');
    function ensurePressContext($el, cleanup) {
        if (getPressContext($el))
            return;
        const context = Alpine.reactive({ value: false });
        const undo = Alpine.addScopeToNode($el, {
            [PRESS_CONTEXT_KEY]: context,
        });
        cleanup(undo);
    }
    /**
     * Handles x-press or x-press="expression" — sets up $isPressing; optionally evaluates expression on press start/end.
     */
    function handleRoot($el, { expression }, { evaluateLater, cleanup }) {
        ensurePressContext($el, cleanup);
        const expressionFn = expression ? evaluateLater(expression) : null;
        function runExpression(success) {
            var _a;
            const context = getPressContext($el);
            expressionFn === null || expressionFn === void 0 ? void 0 : expressionFn(() => { }, {
                scope: { $isPressing: (_a = context === null || context === void 0 ? void 0 : context.value) !== null && _a !== void 0 ? _a : false, $success: success },
                params: [],
            });
        }
        function onPointerUp(e) {
            if (!isPrimaryPointer(e))
                return;
            const context = getPressContext($el);
            if (context)
                context.value = false;
            const success = isNodeOrChild($el, e.target);
            runExpression(success);
        }
        function onPointerCancel(e) {
            if (!isPrimaryPointer(e))
                return;
            const context = getPressContext($el);
            if (context)
                context.value = false;
            runExpression(false);
        }
        function onPointerDown(e) {
            if (!isPrimaryPointer(e))
                return;
            const context = getPressContext($el);
            if (context)
                context.value = true;
            window.addEventListener('pointerup', onPointerUp, { once: true });
            window.addEventListener('pointercancel', onPointerCancel, { once: true });
            runExpression();
        }
        function onKeyUp(e) {
            if (e.key !== 'Enter' && e.key !== ' ')
                return;
            const context = getPressContext($el);
            if (context)
                context.value = false;
            runExpression(true);
        }
        function onKeyDown(e) {
            if (e.key !== 'Enter' && e.key !== ' ')
                return;
            e.preventDefault();
            const context = getPressContext($el);
            if (context)
                context.value = true;
            window.addEventListener('keyup', onKeyUp, { once: true });
            runExpression();
        }
        if (!isElementKeyboardAccessible($el) && !$el.hasAttribute('tabindex')) {
            $el.tabIndex = 0;
        }
        Alpine.bind($el, {
            '@pointerdown': onPointerDown,
            '@keydown': onKeyDown,
        });
        cleanup(() => {
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerCancel);
            window.removeEventListener('keyup', onKeyUp);
        });
    }
    /**
     * Handles the x-press:start directive
     */
    function handleStart($el, { expression }, { evaluateLater, cleanup }) {
        ensurePressContext($el, cleanup);
        const expressionFn = expression ? evaluateLater(expression) : null;
        $el._x_press_hasStartCallback = true;
        function evaluateCallbackExpression(e) {
            expressionFn === null || expressionFn === void 0 ? void 0 : expressionFn(() => { }, {
                scope: { $event: e },
                params: [e],
            });
        }
        function onPointerUp(e) {
            if (!isPrimaryPointer(e))
                return;
            const context = getPressContext($el);
            if (context)
                context.value = false;
            const el = $el;
            const success = isNodeOrChild($el, e.target);
            if (el._x_press_endCallback)
                el._x_press_endCallback(e, success);
        }
        function onPointerCancel(e) {
            if (!isPrimaryPointer(e))
                return;
            const context = getPressContext($el);
            if (context)
                context.value = false;
            const el = $el;
            if (el._x_press_endCallback)
                el._x_press_endCallback(e, false);
        }
        function onKeyUp(e) {
            if (e.key !== 'Enter' && e.key !== ' ')
                return;
            const context = getPressContext($el);
            if (context)
                context.value = false;
            const el = $el;
            if (el._x_press_endCallback)
                el._x_press_endCallback(e, true);
        }
        function onPointerDown(e) {
            if (!isPrimaryPointer(e))
                return;
            const context = getPressContext($el);
            if (context)
                context.value = true;
            window.addEventListener('pointerup', onPointerUp, { once: true });
            window.addEventListener('pointercancel', onPointerCancel, { once: true });
            evaluateCallbackExpression === null || evaluateCallbackExpression === void 0 ? void 0 : evaluateCallbackExpression(e);
        }
        function onKeyDown(e) {
            if (e.key !== 'Enter' && e.key !== ' ')
                return;
            e.preventDefault();
            const context = getPressContext($el);
            if (context)
                context.value = true;
            window.addEventListener('keyup', onKeyUp, { once: true });
            evaluateCallbackExpression === null || evaluateCallbackExpression === void 0 ? void 0 : evaluateCallbackExpression(e);
        }
        if (!isElementKeyboardAccessible($el) && !$el.hasAttribute('tabindex')) {
            $el.tabIndex = 0;
        }
        Alpine.bind($el, {
            '@pointerdown': onPointerDown,
            '@keydown': onKeyDown,
        });
        cleanup(() => {
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerCancel);
            window.removeEventListener('keyup', onKeyUp);
        });
    }
    /**
     * Handles the x-press:end directive
     */
    function handleEnd($el, { expression }, { evaluateLater, cleanup }) {
        ensurePressContext($el, cleanup);
        const expressionFn = evaluateLater(expression);
        function evaluateCallbackExpression(e, success) {
            expressionFn === null || expressionFn === void 0 ? void 0 : expressionFn(() => { }, {
                scope: { $event: e, $success: success },
                params: [e, success],
            });
        }
        function onPointerUp(e, success) {
            if (!isPrimaryPointer(e))
                return;
            const context = getPressContext($el);
            if (context)
                context.value = false;
            const resolvedSuccess = success !== null && success !== void 0 ? success : isNodeOrChild($el, e.target);
            evaluateCallbackExpression(e, resolvedSuccess);
        }
        function onPointerCancel(e) {
            if (!isPrimaryPointer(e))
                return;
            const context = getPressContext($el);
            if (context)
                context.value = false;
            onPointerUp(e, false);
        }
        function onKeyUp(e) {
            if (e.key !== 'Enter' && e.key !== ' ')
                return;
            const context = getPressContext($el);
            if (context)
                context.value = false;
            evaluateCallbackExpression(e, true);
        }
        const el = $el;
        if (el._x_press_hasStartCallback) {
            el._x_press_endCallback = (e, success) => {
                if ('pointerType' in e) {
                    onPointerUp(e, success);
                }
                else {
                    onKeyUp(e);
                }
            };
        }
        else {
            function onPointerUpForEnd(up) {
                onPointerUp(up);
            }
            function onPointerDownForEnd(e) {
                if (!isPrimaryPointer(e))
                    return;
                const context = getPressContext($el);
                if (context)
                    context.value = true;
                window.addEventListener('pointerup', onPointerUpForEnd, { once: true });
                window.addEventListener('pointercancel', onPointerCancel, { once: true });
            }
            function onKeyDownForEnd(e) {
                if (e.key !== 'Enter' && e.key !== ' ')
                    return;
                e.preventDefault();
                const context = getPressContext($el);
                if (context)
                    context.value = true;
                window.addEventListener('keyup', onKeyUp, { once: true });
            }
            if (!isElementKeyboardAccessible($el) && !$el.hasAttribute('tabindex')) {
                $el.tabIndex = 0;
            }
            Alpine.bind($el, {
                '@pointerdown': onPointerDownForEnd,
                '@keydown': onKeyDownForEnd,
            });
            cleanup(() => {
                window.removeEventListener('pointerup', onPointerUpForEnd);
                window.removeEventListener('pointercancel', onPointerCancel);
                window.removeEventListener('keyup', onKeyUp);
            });
        }
    }
    /**
     * Magic that returns reactive press state for the current element or nearest ancestor with x-press.
     * Use $isPressing in templates; true while the element is being pressed.
     */
    Alpine.magic('isPressing', (el) => {
        const context = getPressContext(el);
        if (context)
            return context.value;
        return false;
    });
};

const FOCUS_STATE_CONTEXT_KEY = Symbol('FOCUS_STATE_CONTEXT_KEY');
/**
 * Plugin to allow for easily binding an external x-data variable to the focus state of an element
 *
 * e.g of instead of this
 *
 * <button x-data="{ hasFocus: false }" @focus="hasFocus = true" @blur="hasFocus = false"></button></button>
 *
 * you can just do this:
 *
 * <button x-data="{ hasFocus: false }" x-focus-state="hasFocus = $hasFocus">Focus on me</button>
 *
 * The expression passed to `x-focus-state` is evaluated when it receives the `focus` (`$hasFocus` will be true), and again when it receives the
 * `blur` event (`$hasFocus` will be false).
 *
 * This plugin has the added benefit that the `blur` listener isn't bound until the `focus` element is fired, and also is destroyed when the element is destroyed or `blur` is fired
 */
var focusState = (Alpine) => {
    Alpine.directive('focus-state', ($el, { expression }, { evaluateLater, effect, cleanup }) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        const expressionFn = evaluateLater(expression);
        const context = Alpine.reactive({
            hasFocus: false,
            lastEvent: null,
            abortController: null,
            onFocus(e) {
                this.abortController = new AbortController();
                this.lastEvent = e;
                if (this.hasFocus == true) {
                    return;
                }
                this.hasFocus = true;
                expressionFn(() => { }, {
                    scope: {
                        $event: this.lastEvent,
                        $hasFocus: this.hasFocus,
                    },
                    params: [this.lastEvent, this.hasFocus],
                });
                $el.addEventListener('blur', this.onBlur.bind(this), {
                    signal: this.abortController.signal,
                });
            },
            onBlur(e) {
                this.hasFocus = false;
                this.lastEvent = e;
                expressionFn(() => { }, {
                    scope: {
                        $event: this.lastEvent,
                        $hasFocus: this.hasFocus,
                    },
                    params: [this.lastEvent, this.hasFocus],
                });
                this.abortController.abort();
            },
        });
        Alpine.addScopeToNode($el, {
            [FOCUS_STATE_CONTEXT_KEY]: context,
        });
        Alpine.bind($el, {
            '@focus'(e) {
                return context.onFocus(e);
            },
        } /* TODO remove this one @alpinejs/types is fixed */);
        cleanup(() => {
            var _a;
            (_a = context.abortController) === null || _a === void 0 ? void 0 : _a.abort();
        });
    }).before('bind');
    Alpine.magic('hasFocus', ($el) => {
        const context = Alpine.$data($el)[FOCUS_STATE_CONTEXT_KEY];
        if (!context)
            throw new Error('$hasFocus needs to be used on or inside an element with x-focus-state');
        return context.hasFocus;
    });
};

const FOCUS_IN_STATE_CONTEXT_KEY = Symbol('FOCUS_IN_STATE_CONTEXT_KEY');
/**
 * Plugin to allow for easily binding an external x-data variable to whether an element contains focus or not
 *
 * e.g of instead of this
 *
 * <div x-data="{ hasFocusIn: false }" @focusin="hasFocusIn = true" @focusout="hasFocusIn = false">
 *   </button></button>
 * </div>
 *
 * you can just do this:
 *
 * <button x-data="{ hasFocusIn: false }" x-focusin-state="hasFocusIn = $hasFocusIn">Focus on me</button>
 *
 * The expression passed to `x-focusin-state` is evaluated when it receives the `focusin` (`$hasFocusIn` will be true), and again when it receives the
 * `focusout` event (`$hasFocusIn` will be false).
 *
 * This plugin has a few added benefits in addition to simpler code:
 * - The `focusout` listener isn't bound until the `focusin` element is fired, and also is destroyed when the element is destroyed or `focusout` is fired
 * - This plugin checks that when focusout occurs, the new focused element is actually outside of the wrapper
 */
var focusInState = (Alpine) => {
    Alpine.directive('focusin-state', ($el, { expression }, { evaluateLater, cleanup }) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        const expressionFn = evaluateLater(expression);
        const context = Alpine.reactive({
            hasFocusIn: false,
            lastEvent: null,
            abortController: null,
            onFocusIn(e) {
                this.abortController = new AbortController();
                this.lastEvent = e;
                if (this.hasFocusIn == true) {
                    return;
                }
                this.hasFocusIn = true;
                expressionFn(() => { }, {
                    scope: {
                        $event: this.lastEvent,
                        $hasFocusIn: this.hasFocusIn,
                    },
                    params: [this.lastEvent, this.hasFocusIn],
                });
                $el.addEventListener('focusout', this.onFocusOut.bind(this), {
                    signal: this.abortController.signal,
                });
            },
            onFocusOut(e) {
                if ($el.isSameNode(e.relatedTarget) || $el.contains(e.relatedTarget)) {
                    return;
                }
                this.lastEvent = e;
                this.hasFocusIn = false;
                expressionFn(() => { }, {
                    scope: {
                        $event: this.lastEvent,
                        $hasFocusIn: this.hasFocusIn,
                    },
                    params: [this.lastEvent, this.hasFocusIn],
                });
                this.abortController.abort();
            },
        });
        Alpine.addScopeToNode($el, {
            [FOCUS_IN_STATE_CONTEXT_KEY]: context,
        });
        Alpine.bind($el, {
            '@focusin'(e) {
                return context.onFocusIn(e);
            },
        } /* TODO remove this one @alpinejs/types is fixed */);
        cleanup(() => {
            var _a;
            (_a = context.abortController) === null || _a === void 0 ? void 0 : _a.abort();
        });
    }).before('bind');
    Alpine.magic('hasFocusIn', ($el) => {
        const context = Alpine.$data($el)[FOCUS_IN_STATE_CONTEXT_KEY];
        if (!context)
            throw new Error('$hasFocusIn needs to be used on or inside an element with x-focusin-state');
        return context.hasFocusIn;
    });
};

var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
function motion (Alpine) {
    Alpine.directive('animate-scroll-stagger', ($el, { expression, value }, { evaluate }) => {
        if (value == 'enter') {
            const keyframes = evaluate(expression);
            Alpine.bind($el, {
                'x-init'() {
                    this.$data.__animateScrollStagger_enterKeyframes = keyframes;
                },
            });
        }
        else if (value == 'leave') {
            const keyframes = evaluate(expression);
            Alpine.bind($el, {
                'x-init'() {
                    this.$data.__animateScrollStagger_leaveKeyframes = keyframes;
                },
            });
        }
        else {
            const _a = expression ? evaluate(expression) : {}, { selector: optionalSelector, stagger: optionalStagger, scrollOffset: optionalScrollOffset, target: optionalTarget } = _a, visibleKeyframes = __rest(_a, ["selector", "stagger", "scrollOffset", "target"]);
            const selector = optionalSelector || '[data-animate-stagger-item]';
            let stagger = optionalStagger || 0.2;
            let scrollOffset = optionalScrollOffset || ['25% 100%', '0% 50%', '0% 0%', '75% 0%'];
            let target = optionalTarget || $el;
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        __animateScrollStagger_cancelScroll: null,
                        __animateScrollStagger_fitsInViewport: null,
                        __animateScrollStagger_wasFullyVisible: null,
                        __animateScrollStagger_isFullyVisible: null,
                        __animateScrollStagger_wasPartiallyVisible: null,
                        __animateScrollStagger_isPartiallyVisible: null,
                        __animateScrollStagger_enterKeyframes: {},
                        __animateScrollStagger_visibleKeyframes: visibleKeyframes,
                        __animateScrollStagger_leaveKeyframes: {},
                        get __animateScrollStagger_items() {
                            return Array.from($el.querySelectorAll(selector));
                        },
                        init() {
                            this.$watch('__animateScrollStagger_wasFullyVisible', (isFullyVisible) => {
                                this.__animateScrollStagger_wasFullyVisible = isFullyVisible;
                            });
                            this.$watch('__animateScrollStagger_wasPartiallyVisible', (isPartiallyVisible) => {
                                this.__animateScrollStagger_wasPartiallyVisible = isPartiallyVisible;
                            });
                        },
                        destroy() {
                            this.__animateScrollStagger_cancelScrollAnimation();
                        },
                        async __animateScrollStagger_startScrollAnimation() {
                            if (this.__animateScrollStagger_cancelScroll !== null)
                                return;
                            const { animate: motionAnimate, scroll: motionScroll } = await import('motion');
                            if (this.__animateScrollStagger_cancelScroll !== null)
                                return;
                            const staggerItemDuration = 1.0;
                            const staggerItemOffset = stagger || 0.2;
                            const at = `-${staggerItemDuration * (1 - staggerItemOffset)}`;
                            const entrySequence = this.__animateScrollStagger_items.map((staggerEl) => [
                                staggerEl,
                                this.__animateScrollStagger_enterKeyframes,
                                { ease: 'easeOut', duration: staggerItemDuration, at: at },
                            ]);
                            const visibleKeyframes = this.__animateScrollStagger_visibleKeyframes !== null &&
                                Object.keys(this.__animateScrollStagger_visibleKeyframes).length > 0
                                ? this.__animateScrollStagger_visibleKeyframes
                                : buildStaticKeyframes(this.__animateScrollStagger_enterKeyframes);
                            const visibleSequence = this.__animateScrollStagger_items.map((staggerEl) => [
                                staggerEl,
                                visibleKeyframes,
                                { duration: staggerItemDuration, at: at, ease: 'easeOut' },
                            ]);
                            const exitSequence = this.__animateScrollStagger_items.map((staggerEl) => [
                                staggerEl,
                                this.__animateScrollStagger_leaveKeyframes,
                                { ease: 'easeOut', duration: staggerItemDuration, at: at },
                            ]);
                            if (this.__animateScrollStagger_fitsInViewport == false) {
                                this.__animateScrollStagger_cancelScroll = motionScroll(motionAnimate(entrySequence), {
                                    target: target,
                                    offset: ['0% 100%', '100% 0%'],
                                });
                            }
                            else {
                                this.__animateScrollStagger_cancelScroll = motionScroll(motionAnimate([...entrySequence, ...visibleSequence, ...exitSequence]), { target: target, offset: scrollOffset });
                            }
                        },
                        __animateScrollStagger_cancelScrollAnimation() {
                            var _a;
                            (_a = this.__animateScrollStagger_cancelScroll) === null || _a === void 0 ? void 0 : _a.call(this);
                            this.__animateScrollStagger_cancelScroll = null;
                        },
                    };
                },
                'x-intersect:enter.threshold.0': '__animateScrollStagger_isPartiallyVisible = true',
                'x-intersect:leave.threshold.0': '__animateScrollStagger_isPartiallyVisible = false',
                'x-intersect:enter.full': '__animateScrollStagger_isFullyVisible = true',
                'x-intersect:leave.full': '__animateScrollStagger_isFullyVisible = false',
                async 'x-effect'() {
                    if (this.__animateScrollStagger_wasFullyVisible == null && this.__animateScrollStagger_isFullyVisible) {
                        this.__animateScrollStagger_startScrollAnimation();
                    }
                    else if (this.__animateScrollStagger_isFullyVisible == false) {
                        if (this.__animateScrollStagger_isPartiallyVisible == true) {
                            this.__animateScrollStagger_startScrollAnimation();
                        }
                        else if (this.__animateScrollStagger_wasPartiallyVisible == true &&
                            this.__animateScrollStagger_isPartiallyVisible == false) {
                            this.__animateScrollStagger_cancelScrollAnimation();
                        }
                    }
                },
                'x-resize'() {
                    this.__animateScrollStagger_fitsInViewport = this.$height <= window.innerHeight;
                },
            });
        }
    });
    Alpine.magic('m', () => {
        return {
            loadAnimate: async function () {
                return (await import('motion')).animate;
            },
            loadAnimateLayout: async function () {
                // @ts-ignore
                return (await import('motion-plus/animate-layout')).unstable_animateLayout;
            },
        };
    });
}
function buildStaticKeyframes(enterKeyframes) {
    return Object.entries(enterKeyframes).reduce((keyframes, [key, value]) => {
        return Object.assign(Object.assign({}, keyframes), { [key]: Array.isArray(value) ? (value.length > 1 ? [value[1], value[1]] : value[0]) : [value, value] });
    }, {});
}
/**
 * Creates a reactive motion value that updates Alpine state when the motion value changes.
 * Used by slider-reveal for before-after progress.
 */
function reactiveMotionValue(_Alpine, initialMotionValue) {
    const value = motionValue(initialMotionValue);
    const reactiveValue = _Alpine.reactive({ value: value.get() });
    value.on('change', (newValue) => {
        reactiveValue.value = newValue;
    });
    return new Proxy(value, {
        get(target, prop, receiver) {
            if (prop === 'get') {
                reactiveValue.value;
            }
            return Reflect.get(target, prop, receiver);
        },
    });
}

/**
 * Enables the creation of stepper components.
 * The 'x-stepper' directive provide functionality for managing stepper input fields.
 *
 * x-stepper -  The root element of the stepper, initializing the stepper functionality and adding a data context for child directives. Use the 'modal' modifier (x-dialog.modal) to make the dialog modal.
 * x-stepper:input - The input element
 * x-stepper:minus - The minus button
 * x-stepper:plus - The plus button
 *
 * @example
 *
  <div x-stepper>
    <button type="button" x-stepper:minus>−</button>
    <input type="number" name="stepper" min="1" max="10" value="1" x-stepper:input>
    <button type="button" x-stepper:plus>+</button>
  </div>
 */
function stepper (Alpine) {
    Alpine.directive('stepper', ($el, data) => {
        if (data.value == 'input') {
            handleInput$1($el, Alpine);
        }
        else if (data.value == 'minus') {
            handleButtonMinus($el, Alpine);
        }
        else if (data.value == 'plus') {
            handleButtonPlus($el, Alpine);
        }
        else if (data.value == null) {
            handleRoot$8($el, Alpine);
        }
        else {
            throw new Error(`Unknown directive: x-stepper:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('stepper', ($el) => {
        const $data = Alpine.$data($el);
        return {
            get value() {
                return $data.__stepper_value;
            },
            increment() {
                $data.__stepper_increment();
            },
            decrement() {
                $data.__stepper_decrement();
            },
        };
    });
}
function handleInput$1($el, Alpine) {
    if (isInputNumberElement($el)) {
        Alpine.bind($el, {
            'x-init': '__stepper_inputEl = $el',
        });
    }
    else {
        throw new Error(`Expected <input type="number"> tag for x-stepper:input but got ${$el}`);
    }
}
function handleButtonMinus($el, Alpine) {
    if (isButtonElement($el)) {
        Alpine.bind($el, {
            '@click.prevent': '$stepper.decrement',
        });
    }
    else {
        throw new Error(`Expected <button> tag for x-stepper:minus but got ${$el}`);
    }
}
function handleButtonPlus($el, Alpine) {
    if (isButtonElement($el)) {
        Alpine.bind($el, {
            '@click.prevent': '$stepper.increment',
        });
    }
    else {
        throw new Error(`Expected <button> tag for x-stepper:plus but got ${$el}`);
    }
}
function handleRoot$8($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __stepper_inputEl: null,
                __stepper_value: null,
                init() {
                    queueMicrotask(() => {
                        Alpine.effect(() => {
                            if (this.__stepper_inputEl) {
                                const value = Alpine.bound(this.__stepper_inputEl, 'value', null);
                                this.__stepper_value = value !== null && value !== undefined ? Number(value) : null;
                            }
                        });
                    });
                },
                __stepper_decrement() {
                    var _a, _b, _c, _d;
                    (_a = this.__stepper_inputEl) === null || _a === void 0 ? void 0 : _a.stepDown();
                    // Browsers don't dispatch input/change events when the value is decremented/incremented so we do that
                    // manually so that things like Alpine x-model still work
                    (_b = this.__stepper_inputEl) === null || _b === void 0 ? void 0 : _b.dispatchEvent(new Event('input', { bubbles: true }));
                    (_c = this.__stepper_inputEl) === null || _c === void 0 ? void 0 : _c.dispatchEvent(new Event('change', { bubbles: true }));
                    this.$dispatch('decrement', (_d = this.__stepper_inputEl) === null || _d === void 0 ? void 0 : _d.value);
                },
                __stepper_increment() {
                    var _a, _b, _c, _d;
                    (_a = this.__stepper_inputEl) === null || _a === void 0 ? void 0 : _a.stepUp();
                    (_b = this.__stepper_inputEl) === null || _b === void 0 ? void 0 : _b.dispatchEvent(new Event('input', { bubbles: true }));
                    (_c = this.__stepper_inputEl) === null || _c === void 0 ? void 0 : _c.dispatchEvent(new Event('change', { bubbles: true }));
                    this.$dispatch('increment', (_d = this.__stepper_inputEl) === null || _d === void 0 ? void 0 : _d.value);
                },
            };
        },
        '@click.self'() {
            var _a;
            (_a = this.__stepper_inputEl) === null || _a === void 0 ? void 0 : _a.focus();
        },
    });
}

/**
 * TODO docs
 */
function submittableTextarea (Alpine) {
    Alpine.directive('submittable-textarea', ($el, data) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value == null) {
            handleSubmit($el, Alpine);
        }
        else {
            throw new Error(`Unknown directive: x-submittable-textarea:${data.value}`);
        }
    }).before('bind');
}
function handleSubmit($el, Alpine) {
    const isMac = Boolean(navigator.userAgent.indexOf('Mac OS X') !== -1);
    Alpine.bind($el, {
        ['x-data']() {
            return keyActions(isMac);
        },
        '@keydown': '__onKeyDown',
        '@keyup': '__onKeyUp',
    });
}
function keyActions(isMac) {
    return {
        isMetaKeyPressed: false,
        key: isMac ? 'Meta' : 'Control',
        __onKeyDown(e) {
            var _a;
            if (this.isMetaKeyPressed && e.key === 'Enter' && !e.repeat) {
                const target = e.target;
                (_a = target === null || target === void 0 ? void 0 : target.closest('form')) === null || _a === void 0 ? void 0 : _a.requestSubmit();
            }
            if (e.key === this.key) {
                this.isMetaKeyPressed = true;
            }
        },
        __onKeyUp(e) {
            if (e.key === this.key) {
                this.isMetaKeyPressed = false;
            }
        },
    };
}

function clone (Alpine) {
    Alpine.directive('clone', ($targetEl, { expression }, { effect, evaluate, cleanup }) => {
        if (!isHtmlElement($targetEl)) {
            throw new Error(`Expected HTMLElement but got ${$targetEl}`);
        }
        $targetEl._x_insertClone = (sourceEl) => {
            var _a;
            if (!isHtmlElement(sourceEl))
                return;
            if (!isTemplateElement($targetEl)) {
                throw new Error(`x-clone can only be used on a <template> tag`);
            }
            if ($targetEl._x_clonedElement) {
                (_a = $targetEl._x_undoClone) === null || _a === void 0 ? void 0 : _a.call($targetEl);
            }
            let clone = isTemplateElement(sourceEl)
                ? sourceEl.content.cloneNode(true).firstElementChild
                : sourceEl.cloneNode(true);
            if (!clone)
                return;
            // Add new parent element's scope to cloned element
            Alpine.addScopeToNode(clone, {}, $targetEl);
            Alpine.mutateDom(() => {
                // Insert cloned node after element with x-clone attribute
                $targetEl.after(clone);
                // Re-initialize alpine on cloned node
                Alpine.skipDuringClone(() => Alpine.initTree(clone))();
            });
            $targetEl._x_clonedElement = clone;
            $targetEl._x_undoClone = () => {
                clone.remove();
                Alpine.destroyTree(clone);
                delete $targetEl._x_clonedElement;
            };
        };
        // Evaluate expression to the source element that will be cloned into the target element
        $targetEl._x_insertClone(evaluate(expression));
        cleanup(() => $targetEl._x_undoClone && $targetEl._x_undoClone());
    }).before('bind');
}

function clipboard (Alpine) {
    Alpine.directive('clipboard', ($el, data) => {
        if (data.value == 'target') {
            handleTarget($el, Alpine, data);
        }
        else if (data.value == 'button') {
            handleButton$1($el, Alpine);
        }
        else if (data.value == null) {
            handleRoot$7($el, Alpine);
        }
        else {
            throw new Error(`Unknown directive: x-clipboard:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('clipboard', handleClipboardMagic(Alpine));
}
function handleClipboardMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            save(text) {
                navigator.clipboard.writeText(text);
                $data.handleSuccess();
            },
            get state() {
                return $data.state;
            },
            get isClipboardWriteAllowed() {
                return $data.isClipboardWriteAllowed;
            },
        };
    };
}
function handleTarget($el, Alpine, { expression }) {
    const attributes = {};
    const $data = Alpine.$data($el);
    $data.target = $el;
    if (isInputElement($el)) {
        $data.content = $el.value;
    }
    else if (isHtmlElement($el)) {
        $data.content = expression || $el.textContent || '';
    }
    Alpine.bind($el, attributes);
}
function handleButton$1($el, Alpine) {
    Alpine.bind($el, {
        '@click': 'copyToClipboard',
    });
}
function handleRoot$7($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                state: 'initial',
                target: undefined,
                content: '',
                timeoutDuration: 2500,
                isClipboardWriteAllowed: null,
                async init() {
                    await isClipboardWriteAllowed().then((allowed) => (this.isClipboardWriteAllowed = allowed));
                },
                async copyToClipboard(event) {
                    event.preventDefault();
                    if (this.isClipboardWriteAllowed) {
                        // This doesn't work inside the Shopify's Customizer <iframe> for policy reasons
                        navigator.clipboard.writeText(this.content).then(() => {
                            if (this.state === 'success')
                                return;
                            this.handleSuccess();
                            this.selectText();
                        });
                    }
                    else {
                        console.log('Clipboard access is denied');
                        // Simulate success behavior when in the Theme editor
                        if (window.Shopify.designMode) {
                            if (this.state === 'success')
                                return;
                            this.handleSuccess();
                            this.selectText();
                        }
                        else {
                            this.state = 'denied';
                            setTimeout(() => {
                                if (this.state === 'denied') {
                                    this.state = 'initial';
                                }
                            }, 4000);
                        }
                    }
                },
                handleSuccess() {
                    this.state = 'success';
                    setTimeout(() => {
                        this.state = 'initial';
                    }, this.timeoutDuration);
                },
                selectText() {
                    var _a, _b;
                    if (isInputElement(this.target)) {
                        this.target.select();
                    }
                    else if (isHtmlElement(this.target)) {
                        // Enable this for non-input tags too (<div>, etc.)
                        const range = document.createRange();
                        range.selectNode(this.target);
                        (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
                        (_b = window.getSelection()) === null || _b === void 0 ? void 0 : _b.addRange(range);
                    }
                },
            };
        },
    });
}

/**
 * Detect iOS devices (including iPad on iOS 13+)
 */
function isIOS() {
    if (typeof window === 'undefined')
        return false;
    return (/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
}
/**
 * Check if an element is scrollable (has overflow)
 */
function isScrollable(node, checkForOverflow) {
    if (!node) {
        return false;
    }
    let style = window.getComputedStyle(node);
    let isScrollable = /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
    if (isScrollable && checkForOverflow) {
        isScrollable = node.scrollHeight !== node.clientHeight || node.scrollWidth !== node.clientWidth;
    }
    return isScrollable;
}
/**
 * Like `node.parentElement`, but crosses shadow DOM boundaries by continuing
 * from the shadow host. Needed so scroll containers inside app embeds that
 * render into a shadow root (e.g. the Sendica checkout popup) are found.
 */
function getComposedParentElement(node) {
    if (!node)
        return null;
    if (node.parentElement)
        return node.parentElement;
    const root = typeof node.getRootNode === 'function' ? node.getRootNode() : null;
    return root instanceof ShadowRoot ? root.host : null;
}
/**
 * Get the nearest scrollable parent element
 */
function getScrollParent(node, checkForOverflow) {
    let scrollableNode = node;
    if (isScrollable(scrollableNode, checkForOverflow)) {
        scrollableNode = getComposedParentElement(scrollableNode);
    }
    while (scrollableNode && !isScrollable(scrollableNode, checkForOverflow)) {
        scrollableNode = getComposedParentElement(scrollableNode);
    }
    return scrollableNode || document.scrollingElement || document.documentElement;
}
/**
 * Global set tracking elements that have active scroll locks
 */
const activeLocks = new WeakSet();
/**
 * Track whether we have actually applied a global scroll lock.
 * This prevents cleanup/update paths from "unlocking" when no lock was ever active.
 */
let isScrollLocked = false;
/**
 * Store cleanup functions for iOS event listeners
 */
let iosCleanup = null;
/**
 * Store cleanup functions for standard browser styles
 */
let standardCleanup = null;
/**
 * Get the scrollbar width to compensate for layout shift
 */
function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
}
/**
 * Check if scrollbar-gutter is supported
 */
function supportsScrollbarGutter() {
    return CSS.supports('scrollbar-gutter', 'stable');
}
/**
 * Set a style property and return a cleanup function
 */
function setStyle(element, property, value) {
    const original = element.style.getPropertyValue(property);
    element.style.setProperty(property, value);
    return () => {
        if (original) {
            element.style.setProperty(property, original);
        }
        else {
            element.style.removeProperty(property);
        }
    };
}
/**
 * Add an event listener and return a cleanup function
 */
function addEventListener(target, event, handler, options) {
    target.addEventListener(event, handler, options);
    return () => {
        target.removeEventListener(event, handler, options);
    };
}
/**
 * Prevent scroll on standard browsers (desktop)
 * Based on React Aria's preventScrollStandard
 */
function preventScrollStandard() {
    const cleanups = [];
    const scrollbarWidth = getScrollbarWidth();
    // Compensate for scrollbar width to prevent layout shift
    if (scrollbarWidth > 0) {
        if (supportsScrollbarGutter()) {
            cleanups.push(setStyle(document.documentElement, 'scrollbar-gutter', 'stable'));
        }
        else {
            cleanups.push(setStyle(document.documentElement, 'padding-right', `${scrollbarWidth}px`));
        }
    }
    // Prevent scrolling
    cleanups.push(setStyle(document.documentElement, 'overflow', 'hidden'));
    return () => {
        cleanups.forEach((cleanup) => cleanup());
    };
}
/**
 * Prevent scroll on iOS Safari
 * Based on React Aria's preventScrollMobileSafari (simplified)
 *
 * iOS Safari ignores overflow:hidden, so we prevent touchmove events on the document
 * while allowing them within scrollable elements.
 */
function preventScrollMobileSafari() {
    const cleanups = [];
    let scrollable = null;
    let allowTouchMove = false;
    const isRangeSliderTarget = (el) => {
        return el instanceof HTMLInputElement && el.type === 'range';
    };
    const isSliderEvent = (e) => {
        var _a, _b;
        if (isRangeSliderTarget(e.target))
            return true;
        const target = e.target;
        if (isHtmlElement(target) && target.getAttribute('role') === 'slider')
            return true;
        if (isHtmlElement(target) && target.closest('input[type="range"], [role="slider"]'))
            return true;
        const path = (_b = (_a = e.composedPath) === null || _a === void 0 ? void 0 : _a.call(e)) !== null && _b !== void 0 ? _b : [];
        return path.some((el) => isRangeSliderTarget(el) || (isHtmlElement(el) && el.getAttribute('role') === 'slider'));
    };
    // Inject overscroll-behavior: contain to prevent scroll chaining
    // This must be applied before touchstart as of iOS 26
    const style = document.createElement('style');
    style.textContent = `@layer { * { overscroll-behavior: contain; } }`.trim();
    document.head.prepend(style);
    cleanups.push(() => style.remove());
    const onTouchStart = (e) => {
        const touchEvent = e;
        // Store the nearest scrollable parent element from the element that the user touched.
        // Events coming from inside a shadow DOM are retargeted to the shadow host by the time
        // they reach `document`, so use composedPath() to get the element that was actually touched.
        // Otherwise scrollable containers inside shadow roots (app popups) look like page scrolls
        // and get blocked.
        const composedTarget = typeof touchEvent.composedPath === 'function' ? touchEvent.composedPath()[0] : null;
        let target = composedTarget instanceof Element ? composedTarget : touchEvent.target;
        scrollable = isScrollable(target) ? target : getScrollParent(target, true);
        allowTouchMove = false;
        // If the target is selected, don't preventDefault in touchmove to allow user to adjust selection.
        let selection = target.ownerDocument.defaultView.getSelection();
        if (selection && !selection.isCollapsed && selection.containsNode(target, true)) {
            allowTouchMove = true;
        }
        if (isSliderEvent(e)) {
            allowTouchMove = true;
        }
        // If this is a focused input element with a selected range, allow user to drag the selection handles.
        if ('selectionStart' in target &&
            'selectionEnd' in target &&
            target.selectionStart < target.selectionEnd &&
            target.ownerDocument.activeElement === target) {
            allowTouchMove = true;
        }
    };
    const onTouchMove = (e) => {
        const touchEvent = e;
        // Allow pinch-zooming.
        if (touchEvent.touches.length > 1 || allowTouchMove) {
            return;
        }
        // Prevent scrolling the window.
        if (!scrollable || scrollable === document.documentElement || scrollable === document.body) {
            touchEvent.preventDefault();
            return;
        }
        // overscroll-behavior should prevent scroll chaining, but currently does not
        // if the element doesn't actually overflow. https://bugs.webkit.org/show_bug.cgi?id=243452
        // This checks that both the width and height do not overflow, otherwise we might
        // block horizontal scrolling too. In that case, adding `touch-action: pan-x` to
        // the element will prevent vertical page scrolling. We can't add that automatically
        // because it must be set before the touchstart event.
        if (scrollable.scrollHeight === scrollable.clientHeight && scrollable.scrollWidth === scrollable.clientWidth) {
            touchEvent.preventDefault();
        }
    };
    cleanups.push(addEventListener(document, 'touchstart', onTouchStart, { passive: false, capture: true }));
    cleanups.push(addEventListener(document, 'touchmove', onTouchMove, { passive: false, capture: true }));
    return () => {
        cleanups.forEach((cleanup) => cleanup());
    };
}
/**
 * Apply scroll lock styles to the body
 * Based on React Aria's usePreventScroll approach
 */
function lockScrolling() {
    // Avoid re-locking
    if (isScrollLocked)
        return;
    isScrollLocked = true;
    if (isIOS()) {
        iosCleanup = preventScrollMobileSafari();
    }
    else {
        standardCleanup = preventScrollStandard();
    }
    // Data attribute to track if the body is scroll locked
    document.documentElement.dataset.scrollLocked = 'true';
}
/**
 * Remove scroll lock styles from the body
 */
function unlockScrolling() {
    // If we never locked (or already unlocked), do nothing.
    if (!isScrollLocked)
        return;
    if (iosCleanup) {
        iosCleanup();
        iosCleanup = null;
    }
    if (standardCleanup) {
        standardCleanup();
        standardCleanup = null;
    }
    // Remove data attributes
    document.documentElement.dataset.scrollLocked = 'false';
    isScrollLocked = false;
}
/**
 * Update scroll lock state based on active locks
 */
function updateScrollLock() {
    if (lockCount > 0) {
        lockScrolling();
    }
    else {
        unlockScrolling();
    }
}
/**
 * Counter for active locks (since WeakSet doesn't have size)
 */
let lockCount = 0;
/**
 * TODO docs
 */
function scrollLock (Alpine) {
    Alpine.directive('scroll-lock', Alpine.skipDuringClone(($el, { expression }, { effect, evaluateLater, cleanup }) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        let evaluator = evaluateLater(expression);
        let wasScrollLocked = false;
        effect(() => evaluator((isScrollLocked) => {
            if (wasScrollLocked === isScrollLocked)
                return;
            if (isScrollLocked && !wasScrollLocked) {
                activeLocks.add($el);
                lockCount++;
                setTimeout(() => {
                    updateScrollLock();
                });
            }
            else if (!isScrollLocked && wasScrollLocked) {
                if (activeLocks.has($el)) {
                    activeLocks.delete($el);
                    lockCount--;
                }
                setTimeout(() => {
                    updateScrollLock();
                });
            }
            wasScrollLocked = !!isScrollLocked;
        }));
        cleanup(() => {
            if (activeLocks.has($el)) {
                activeLocks.delete($el);
                lockCount--;
            }
            updateScrollLock();
        });
    }));
}

const SEARCH_FIELDS = [
    'resources[type]',
    'resources[limit]',
    'resources[limit_scope]',
    'resources[options][unavailable_products]',
    'resources[options][fields]',
];
async function predictiveSearch$1(query, sectionId, formData, options) {
    var _a, _b;
    if (!((_b = (_a = window.theme) === null || _a === void 0 ? void 0 : _a.routes) === null || _b === void 0 ? void 0 : _b.predictiveSearch)) {
        throw new Error('window.theme.routes.predictiveSearch is not defined');
    }
    const queryParams = new URLSearchParams();
    queryParams.set('q', query);
    queryParams.set('section_id', sectionId);
    [...formData.entries()]
        .filter(([key]) => key.includes('resources'))
        .forEach(([key, value]) => {
        if (SEARCH_FIELDS.includes(key)) {
            queryParams.set(key, value.toString());
        }
    });
    return fetch(`${window.theme.routes.predictiveSearch}?${queryParams.toString()}`, options);
}

const CANCEL_REQUEST_REASON = 'Cancel request';
const PREDICTIVE_SEARCH_CONTEXT_KEY = Symbol('PREDICTIVE_SEARCH_CONTEXT_KEY');
/**
 * Plugin to add integration with Shopify's predictive search API (GET /{locale}/search/suggest).
 *
 * Usage:
 *
 * - x-predictive-search='your-result-section' - Applied to the root element of the predictive search, initializing the predictive search functionality and adding a data context for child directives. Pass the id of the search results section as the expression.
 * - x-predictive-search:form - Specifies the form element that contains the search input. The data from this form element will be sent to the predictive search API using FormData
 * - x-predictive-search:input - Specifies the input element that will be used to search. When input value changes, the predictive search will be triggered.
 * - x-predictive-search:results - Specifies the element that will contain the search results. The inner HTML of this element will be replaced with the search results
 * - x-predictive-search:options - Specifies the element that will contain the search options
 * - x-predictive-search:option - Specifies the element that will be used to render a search option
 *
 * @example
 *
 * ## Your search form:
 *
 * ```html
 * <div x-data x-predictive-search="some-search-results-section">
 *   <form action="{{ routes.search_url }}" x-predictive-search:form>
 *     <input type="hidden" name="resources[type]" value="product" />
 *     <input type="hidden" name="resources[options][unavailable_products]" value="hide" />
 *     <input x-predictive-search:input type="search" placeholder="Search" />
 *     <button type="submit">Search</button>
 *   </form>
 *   <div x-show="$predictiveSearch.state == 'success'" x-predictive-search:results>
 *   </div>
 * </div>
 * ```
 *
 * ## Your search results section (some-search-results-section):
 *
 * <ul x-predictive-search:options>
 *   {% assign product_results = predictive_search.resources.products %}
 *   {% for result in product_results %}
 *     <li role="presentation">
 *       <a x-predictive-search:option href="{{ result.url }}">{{ result.title }}</a>
 *     </li>
 *   {% endfor %}
 * </ul>
 *
 */
// TODO refactor this to use x-async-form
function predictiveSearch (Alpine) {
    Alpine.directive('predictive-search', ($el, data, utilities) => {
        if (data.value === 'form') {
            handleForm$2($el, Alpine);
        }
        else if (data.value === 'input') {
            handleInput($el, Alpine);
        }
        else if (data.value === 'results') {
            handleResults($el, Alpine, utilities);
        }
        else if (data.value === 'options') {
            handleOptions($el, Alpine);
        }
        else if (data.value === 'option') {
            handleOption($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot$6($el, Alpine, data, utilities);
        }
        else {
            throw new Error(`Unknown directive: x-predictive-search:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('predictiveSearch', ($el) => {
        const context = Alpine.$data($el)[PREDICTIVE_SEARCH_CONTEXT_KEY];
        if (!context) {
            throw new Error('$predictiveSearch needs to be used on or inside an element with x-predictive-search');
        }
        return {
            get state() {
                return context.state;
            },
            get error() {
                return context.error;
            },
            set query(query) {
                context.query = query;
            },
            get query() {
                return context.query;
            },
            get resultHtml() {
                return context.resultHtml;
            },
            search: context.search.bind(context),
            reset: context.reset.bind(context),
        };
    });
}
function handleForm$2($el, Alpine) {
    const context = Alpine.$data($el)[PREDICTIVE_SEARCH_CONTEXT_KEY];
    Alpine.bind($el, {
        'x-init'() {
            context.formEl = $el;
        },
        '@submit'() {
            // Cancel any pending requests when form is submitted since they wont be shown
            context.abort();
        },
    });
}
function handleInput($el, Alpine) {
    const context = Alpine.$data($el)[PREDICTIVE_SEARCH_CONTEXT_KEY];
    Alpine.bind($el, {
        ':id': '$id("predictive-search-input")',
        'x-init'() {
            context.inputEl = $el;
        },
        ':aria-controls': '$id("predictive-search-results")',
        ':aria-owns': '$id("predictive-search-options")',
        'aria-autocomplete': 'list',
        'x-model.fill': '$predictiveSearch.query',
        '@input.debounce.350ms': '$predictiveSearch.search()',
        autocomplete: 'off',
        role: 'combobox',
        '@keydown.down.prevent.stop': '$rovingTab.focusFirst()',
        '@keydown.up.prevent.stop': '$rovingTab.focusLast()',
    });
}
function handleResults($el, Alpine, { effect, cleanup }) {
    const context = Alpine.$data($el)[PREDICTIVE_SEARCH_CONTEXT_KEY];
    let prevHtml = '';
    effect(() => {
        // Unforunatley we cannot use x-html in this plugin as you might expect. x-html does not clean up previous trees which causes errors
        // when we update the HTML and then our fetch promise runs but the old Alpine reactive bindings are still in memory
        // TODO maybe extract this to new directive like x-html-safe or something
        Alpine.mutateDom(() => {
            if (prevHtml !== '') {
                Alpine.destroyTree($el);
            }
            $el.innerHTML = prevHtml = context.resultHtml;
            $el._x_ignoreSelf = true;
            Alpine.initTree($el);
            delete $el._x_ignoreSelf;
        });
    });
    cleanup(() => {
        prevHtml = '';
    });
    Alpine.bind($el, {
        ':id': '$id("predictive-search-results")',
        'x-init'() {
            context.resultsEl = $el;
        },
    });
}
function handleOptions($el, Alpine) {
    const context = Alpine.$data($el)[PREDICTIVE_SEARCH_CONTEXT_KEY];
    Alpine.bind($el, {
        ':id': '$id("predictive-search-options")',
        'x-roving-tab:list': '',
        role: 'listbox',
        'x-init'() {
            context.optionsEl = $el;
        },
    });
}
function handleOption($el, Alpine) {
    Alpine.bind($el, {
        role: 'option',
    });
}
function handleRoot$6($el, Alpine, data, { cleanup }) {
    const resultSectionId = data.expression;
    if (!resultSectionId) {
        throw new Error('predictive search results section id must be passed to x-predictive-search');
    }
    const context = Alpine.reactive({
        formEl: null,
        inputEl: null,
        resultsEl: null,
        optionsEl: null,
        resultSectionId,
        query: '',
        resultHtml: null,
        state: 'idle',
        error: null,
        abortController: null,
        abort() {
            var _a;
            // Abort any existing requests
            (_a = this.abortController) === null || _a === void 0 ? void 0 : _a.abort(CANCEL_REQUEST_REASON);
        },
        reset() {
            this.query = '';
            this.state = 'idle';
            this.resultHtml = null;
            this.abort();
        },
        async search() {
            if (this.query.trim().length == 0) {
                return null;
            }
            if (!this.formEl) {
                throw new Error('Could find a form element. x-predictive-search:form directive must be used on a form element');
            }
            this.state = 'loading';
            // If there's already an abort controller in use, abort it to cancel any pending requests
            if (this.abortController != null) {
                this.abort();
                this.abortController = null;
            }
            this.abortController = new AbortController();
            try {
                const response = await predictiveSearch$1(this.query, this.resultSectionId, new FormData(this.formEl), {
                    signal: this.abortController.signal,
                });
                if (response.status === 200) {
                    const resultHtml = await response.text();
                    this.resultHtml = resultHtml;
                    // Wait results have (presumably) been rendered before setting state to success
                    // so that you can do stuff like x-collapse without any jankiness
                    Alpine.nextTick(() => {
                        this.state = 'success';
                    });
                    return resultHtml;
                }
                else {
                    const resultText = await response.text();
                    this.handleRequestError(new Error(`Request failed with status ${response.status}: ${resultText}`));
                    return null;
                }
            }
            catch (e) {
                if (e == CANCEL_REQUEST_REASON) ;
                else {
                    this.handleRequestError(e);
                }
                return null;
            }
        },
        handleRequestError(e) {
            this.state = 'error';
            this.error = prettyPrintError(e);
            throw e;
        },
    });
    Alpine.effect(() => {
        // Wipe search results when query is cleared
        if (context.query == '') {
            context.reset();
        }
    });
    Alpine.addScopeToNode($el, {
        [PREDICTIVE_SEARCH_CONTEXT_KEY]: context,
    });
    Alpine.bind($el, {
        'x-id': '["predictive-search-results", "predictive-search-options", "predictive-search-input"]',
        'x-roving-tab.vertical.nowrap': '',
    });
    cleanup(() => {
        if (context.abortController != null) {
            context.abortController.abort();
        }
    });
}

/**
 * Plugin which provides various directives and magics for working with responsive design.
 *
 * ## `x-screen:*` directives
 *
 * This directive
 *
 * @example
 *
 * Setup the plugin by passing your screen sizes to the plugin fn. You can pass both pixel values and CSS variables
 *
 * ```js
 * import {screen} from '@groupthought/method-ui/alpine';
 *
 * Alpine.plugin(screen({
 *   sm: '(max-width: 1023px)',
 *   md: '(min-width: 1024px) and (max-width: 1156px)',
 *   // ...
 * }))
 * ```
 *
 * Use the directive to conditionally run code based on the current screen size
 *
 * ```html
 * <div
 *  x-screen:sm="console.log('screen sizes matches small')"
 *  x-screen:md="console.log('screen size matches medium')"
 * >
 * </div>
 * ```
 */
var media = (queries) => {
    return (Alpine) => {
        Alpine.store('media', {
            queries: queries,
            matches: {},
        });
        let abortController = null;
        Alpine.effect(() => {
            if (abortController) {
                abortController.abort();
            }
            abortController = new AbortController();
            Alpine.store('media').matches = {};
            Object.entries(Alpine.store('media').queries).forEach(([key, value]) => {
                const mediaQuery = window.matchMedia(value);
                // Set the initial value for the media query
                Alpine.store('media').matches[key] = mediaQuery.matches;
                // Add event listener to update the store when the media query changes
                mediaQuery.addEventListener('change', (e) => {
                    Alpine.store('media').matches[key] = e.matches;
                }, {
                    signal: abortController === null || abortController === void 0 ? void 0 : abortController.signal,
                });
            });
        });
        Alpine.directive('screen', ($el, { value, expression }, { effect, evaluateLater }) => {
            if (!isHtmlElement($el)) {
                throw new Error(`Expected HTMLElement but got ${$el}`);
            }
            const evaluateExpression = evaluateLater(expression);
            if (value !== null) {
                if (!(value in Alpine.store('media').queries)) {
                    throw new Error(`Unknown screen size: ${value}`);
                }
                Alpine.nextTick(() => {
                    effect(() => {
                        const match = Alpine.store('media').matches[value];
                        if (match) {
                            evaluateExpression(() => { });
                        }
                    });
                });
            }
            else {
                Alpine.nextTick(() => {
                    effect(() => {
                        const matches = Alpine.store('media').matches;
                        if (matches !== null) {
                            evaluateExpression(() => { }, {
                                params: [matches],
                                scope: {
                                    $matches: matches,
                                },
                            });
                        }
                    });
                });
            }
        });
        Alpine.magic('media', () => {
            return Alpine.store('media');
        });
    };
};

/**
 * Enables the creation of a countdown timer component.
 *
 * - x-countdown - The root element of the component, initializing the countdown functionality and adding a data context for child directives. Requires the expiration date in ISO 8601 format to be passed as value
 * - x-countdown:days - The element containing the remaining 'days'
 * - x-countdown:hours - The element containing the remaining 'hours'
 * - x-countdown:minutes - The element containing the remaining 'minutes'
 * - x-countdown:seconds - The element containing the remaining 'seconds'
 *
 * @example
 *
  <time x-countdown="2028-12-31T11:59:00.000-0500">
    <span x-countdown:days></span>
    <span x-countdown:hours></span>
    <span x-countdown:minutes></span>
    <span x-countdown:seconds></span>
  </time>
 */
function countdown (Alpine) {
    Alpine.directive('countdown', ($el, data) => {
        if (data.value == 'days') {
            handleDays($el, Alpine);
        }
        else if (data.value == 'hours') {
            handleHours($el, Alpine);
        }
        else if (data.value == 'minutes') {
            handleMinutes($el, Alpine);
        }
        else if (data.value == 'seconds') {
            handleSeconds($el, Alpine);
        }
        else if (data.value == null) {
            handleRoot$5($el, Alpine, data);
        }
        else {
            throw new Error(`Unknown directive: x-countdown:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('countdown', handleCountdownMagic(Alpine));
}
function handleCountdownMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            days: $data.__countdown_days,
            hours: $data.__countdown_hours,
            minutes: $data.__countdown_minutes,
            seconds: $data.__countdown_seconds,
            endDate(date) {
                $data.__countdown_endDate = date;
            },
            get isExpired() {
                return $data.__countdown_isExpired;
            },
        };
    };
}
function handleDays($el, Alpine) {
    Alpine.bind($el, {
        'x-text': '__countdown_days',
    });
}
function handleHours($el, Alpine) {
    Alpine.bind($el, {
        'x-text': '__countdown_hours',
    });
}
function handleMinutes($el, Alpine) {
    Alpine.bind($el, {
        'x-text': '__countdown_minutes',
    });
}
function handleSeconds($el, Alpine) {
    Alpine.bind($el, {
        'x-text': '__countdown_seconds',
    });
}
function handleRoot$5($el, Alpine, data) {
    Alpine.bind($el, {
        ['x-data']() {
            return countdown$1(data.expression);
        },
    });
}
function countdown$1(endDate) {
    return {
        __countdown_endDate: endDate || '',
        __countdown_msPerDay: 1000 * 60 * 60 * 24,
        __countdown_msPerHour: (1000 * 60 * 60 * 24) / 24, // msPerDay / 24
        __countdown_msPerMinute: (1000 * 60 * 60 * 24) / 24 / 60, // msPerHour / 60
        __countdown_msPerSecond: (1000 * 60 * 60 * 24) / 24 / 60 / 60, // msPerMinute / 60,
        __countdown_intervalTimer: undefined,
        __countdown_remainingTime: 0,
        __countdown_days: '0',
        __countdown_hours: '0',
        __countdown_minutes: '0',
        __countdown_seconds: '0',
        get __countdown_endDateParsed() {
            return Date.parse(this.__countdown_endDate);
        },
        get __countdown_isExpired() {
            return this.__countdown_remainingTime <= 0;
        },
        __countdown_formatDigits(number) {
            let numberAsString = number.toString();
            const numberAsNumber = number;
            if (numberAsNumber < 10)
                numberAsString = '0' + numberAsNumber;
            return numberAsString;
        },
        __countdown_update() {
            this.__countdown_remainingTime = this.__countdown_endDateParsed - Date.now();
            let days = 0;
            let hours = 0;
            let minutes = 0;
            let seconds = 0;
            let tempTime = this.__countdown_remainingTime;
            if (tempTime > 0) {
                days = parseInt((tempTime / this.__countdown_msPerDay).toString(), 10);
                tempTime -= days * this.__countdown_msPerDay;
                hours = parseInt((tempTime / this.__countdown_msPerHour).toString(), 10);
                tempTime -= hours * this.__countdown_msPerHour;
                minutes = parseInt((tempTime / this.__countdown_msPerMinute).toString(), 10);
                tempTime -= minutes * this.__countdown_msPerMinute;
                seconds = parseInt((tempTime / this.__countdown_msPerSecond).toString(), 10);
            }
            this.__countdown_days = this.__countdown_formatDigits(days);
            this.__countdown_hours = this.__countdown_formatDigits(hours);
            this.__countdown_minutes = this.__countdown_formatDigits(minutes);
            this.__countdown_seconds = this.__countdown_formatDigits(seconds);
            if (this.__countdown_isExpired) {
                clearInterval(this.__countdown_intervalTimer);
            }
        },
        init() {
            this.__countdown_update();
            // Update the countdown every second
            this.__countdown_intervalTimer = setInterval(() => {
                this.__countdown_update();
            }, 1000);
        },
    };
}

const KEYBOARD_ACTIVE_CONTEXT_KEY = Symbol('KEYBOARD_ACTIVE_CONTEXT_KEY');
/**
 * Add 'keyboard-active' class to the body when user is navigating with the keyboard
 */
function keyboardActive (Alpine) {
    let isTabKeyDown = false;
    const context = Alpine.reactive({
        isKeyboardActive: false,
    });
    Alpine.addScopeToNode(document.body, {
        [KEYBOARD_ACTIVE_CONTEXT_KEY]: context,
    });
    Alpine.bind(document.body, {
        '@keydown.window.tab'() {
            isTabKeyDown = true;
        },
        '@keyup.window'() {
            isTabKeyDown = false;
        },
        '@focusin.window'() {
            if (isTabKeyDown) {
                context.isKeyboardActive = true;
            }
        },
        '@mousedown'() {
            context.isKeyboardActive = false;
        },
    });
    Alpine.magic('isKeyboardActive', ($el) => {
        return Alpine.$data($el)[KEYBOARD_ACTIVE_CONTEXT_KEY].isKeyboardActive;
    });
    Alpine.magic('hasKeyboardFocus', ($el) => {
        return Alpine.$data($el)[KEYBOARD_ACTIVE_CONTEXT_KEY].isKeyboardActive && document.activeElement === $el;
    });
}

/**
 * Formats a number as currency based on locale and currency settings.
 * Supports displaying currency symbol, code, or name. Allows optional rounding and customization of display.
 * Utilizes the Intl.NumberFormat API to manage currency formatting complexities, providing better consistency
 * across different markets, locales, and currencies, in contrast to Shopify's Liquid limitations.
 *
 * Expects the following code in theme.liquid:
 *  window.theme.currency: {
 *    currencyCode: '{{ cart.currency.iso_code }}',
 *    locale:  '{{ request.locale.iso_code }}'
 *  };
 *  window.theme.translations: {
 *    other: {
 *      free: {{ 'other.free' | t | json }},
 *    }
 *  };
 *
 *
 * Using money_with_trailing_zeros with CurrencyFormat={rounded: true | false | undefined}
 * - true matches `money | rounded`
 * - undefined matches `money_without_trailing_zeros`
 * - false matches `money`
 *
 * References:
 * - ISO 4217 currency codes via Unicode CLDR for currency translation.
 * - Uses browser’s Intl.NumberFormat for better handling across locales, removing Liquid inconsistencies.
 */
function formatCurrency(amount, format = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    // Set up defaults
    let defaultCurrency = 'USD'; // Fallback if nothing is available
    let defaultLocale = 'en-US'; // Fallback if locale isn't provided
    let defaultFreeTranslation;
    // Retrieve defaults from theme/Shopify if present
    if (typeof window !== 'undefined') {
        defaultCurrency = ((_b = (_a = window.theme) === null || _a === void 0 ? void 0 : _a.currency) === null || _b === void 0 ? void 0 : _b.currencyCode) || ((_d = (_c = window.Shopify) === null || _c === void 0 ? void 0 : _c.currency) === null || _d === void 0 ? void 0 : _d.active) || defaultCurrency;
        defaultLocale = ((_f = (_e = window.theme) === null || _e === void 0 ? void 0 : _e.currency) === null || _f === void 0 ? void 0 : _f.locale) || ((_g = window.Shopify) === null || _g === void 0 ? void 0 : _g.locale) || defaultLocale;
        defaultFreeTranslation = (_k = (_j = (_h = window.theme) === null || _h === void 0 ? void 0 : _h.translations) === null || _j === void 0 ? void 0 : _j.other) === null || _k === void 0 ? void 0 : _k.free;
    }
    // Destructure format options, applying defaults
    const { form = 'short', rounded, currency = defaultCurrency, locale = defaultLocale, legacyFormat } = format;
    // Handle null, undefined, or NaN amount
    if (amount == null || isNaN(amount)) {
        return 'x.xx'; // Fallback to generic price with no language context
    }
    // Handle 'Free' case or zero
    if (amount === 0 && form === 'short' && rounded === true && defaultFreeTranslation) {
        return defaultFreeTranslation;
    }
    // Liquid returns cents for all currencies including YEN
    const amountInDollars = amount / 100;
    // Use legacy formatting if specified
    let amountWithSymbol;
    if (legacyFormat) {
        amountWithSymbol = formatCurrencyLegacy(amountInDollars, {
            currency,
            legacyFormat,
            rounded: format.rounded,
        });
    }
    else {
        amountWithSymbol = formatCurrencyNew(amountInDollars, { currency, locale, rounded: format.rounded });
    }
    // Append currency code if explicit form is specified
    const codeString = form === 'explicit' ? ` ${currency}` : '';
    return `${amountWithSymbol}${codeString}`;
}
function formatCurrencyNew(amount, format) {
    // Configure Intl.NumberFormat options
    const options = {
        style: 'currency',
        currency: format.currency,
        currencyDisplay: 'symbol', // Default to symbol for short form
    };
    // Adjust fraction digits based on the amount and rounding option
    if (format.rounded) {
        options.maximumFractionDigits = 0;
    }
    // Use Intl.NumberFormat to format the currency
    let price = new Intl.NumberFormat(format.locale, options).format(amount);
    // Remove decimals if they are zeros and rounding is not specified
    if (typeof format.rounded === 'undefined') {
        // ([.,]00) – matches “.00” or “,00”
        // (?=\D*$) – ensures that only non-digits follow the decimals”
        price = price.replace(/([.,]00)(?=\D*$)/g, '');
    }
    return price;
}
/**
 * Deprecated liquid Currency Helpers
 * -----------------------------------------------------------------------------
 * Based on @shopify/theme-currency but updated with new liquid currency options.
 * This function should be phased out in favor of the new `formatCurrency`.
 */
function formatCurrencyLegacy(amount, format) {
    var _a;
    // Destructure format options, applying defaults
    const legacyFormat = (_a = format.legacyFormat) !== null && _a !== void 0 ? _a : '${{amount}}';
    let precision = 2;
    if (format.rounded)
        precision = 0;
    // Helper to format numbers with thousands and decimal separators
    const formatWithDelimiters = (number, precision = 2, thousands = ',', decimal = '.') => {
        if (isNaN(number) || number == null) {
            return '0';
        }
        number = parseFloat(number.toFixed(precision));
        const parts = number.toFixed(precision).split('.');
        const dollarsAmount = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${thousands}`); // regex adds a ',' for thousands(every 3 digits - 1,234,567)
        const centsAmount = parts[1] ? decimal + parts[1] : '';
        return dollarsAmount + centsAmount;
    };
    // Regex for extracting liquid format placeholder - {{ something }}
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const match = legacyFormat.match(placeholderRegex);
    let formattedValue = '';
    if (match) {
        // Handle different liquid-like formats
        switch (match[1]) {
            case 'amount':
                formattedValue = formatWithDelimiters(amount, precision);
                break;
            case 'amount_no_decimals':
                formattedValue = formatWithDelimiters(amount, precision);
                break;
            case 'amount_with_comma_separator':
                formattedValue = formatWithDelimiters(amount, precision, '.', ',');
                break;
            case 'amount_no_decimals_with_comma_separator':
                formattedValue = formatWithDelimiters(amount, precision, '.', ',');
                break;
            case 'amount_with_apostrophe_separator':
                formattedValue = formatWithDelimiters(amount, precision, "'", '.');
                break;
            case 'amount_no_decimals_with_space_separator':
                formattedValue = formatWithDelimiters(amount, precision, ' ');
                break;
            case 'amount_with_space_separator':
                formattedValue = formatWithDelimiters(amount, precision, ' ', ',');
                break;
            case 'amount_with_period_and_space_separator':
                formattedValue = formatWithDelimiters(amount, precision, ' ', '.');
                break;
            default:
                throw new Error(`Unknown format type: ${match[1]}`);
        }
        // Replace the placeholder in format string with the formatted value
        formattedValue = legacyFormat.replace(placeholderRegex, formattedValue);
        // Remove decimals if they are zeros and rounding is not specified
        if (typeof format.rounded === 'undefined' && legacyFormat.includes('no_decimals')) {
            // ([.,]00) – matches “.00” or “,00”
            // (?=\D*$) – ensures that only non-digits follow the decimals”
            formattedValue = formattedValue.replace(/([.,]00)(?=\D*$)/g, '');
        }
    }
    // Append currency if provided
    return formattedValue;
}
/**
 * Calculates currency for rate
 * -----------------------------------------------------------------------------
 */
function convertCurrency(amount, rate) {
    var _a, _b;
    const currencyRate = rate || ((_b = (_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.currency) === null || _b === void 0 ? void 0 : _b.rate) || 1;
    // Handle null, undefined, or NaN amount
    if (amount == null || isNaN(amount)) {
        amount = 0;
    }
    return amount * currencyRate;
}

// See utils/currency.ts for details on the complexity of currency formatting
function currency (Alpine) {
    Alpine.magic('formatCurrency', () => {
        return formatCurrency;
    });
    Alpine.magic('convertCurrency', () => {
        return convertCurrency;
    });
}

const DATA_ATTR = 'data-photoswipe-json';
function getDataSourceFromRoot(root) {
    const nodes = root.querySelectorAll(`[${DATA_ATTR}]`);
    const result = [];
    nodes.forEach((el) => {
        let raw = el.getAttribute(DATA_ATTR);
        if (!(raw === null || raw === void 0 ? void 0 : raw.trim()) && el.tagName === 'SCRIPT')
            raw = el.textContent;
        if (!(raw === null || raw === void 0 ? void 0 : raw.trim()))
            return;
        try {
            const parsed = JSON.parse(raw);
            if (isPlainObject(parsed))
                result.push(parsed);
            else
                console.warn('data-photoswipe-json expected an object but got', parsed);
        }
        catch (e) {
            console.warn('Invalid data-photoswipe-json', raw, e);
        }
    });
    return result;
}
/**
 * Photoswipe plugin for Alpine.js
 *
 * Adds PhotoSwipe lightbox functionality to Alpine.js applications.
 *
 * **Directives:**
 * - `x-photoswipe`: Root directive that initializes PhotoSwipe (optionally with a config expression)
 * - `x-photoswipe:image`: Marks an image to be included in the lightbox
 * - `x-photoswipe:video`: Marks a video to be included in the lightbox
 * - `x-photoswipe:button`: Creates a button to open the lightbox
 * - `x-photoswipe:counter`: Template for the slide counter
 *
 * **Slide data (lazy):** Mark slide data with the `data-photoswipe-json` attribute. Use either
 * `<script type="application/json" data-photoswipe-json>{"src":"...", ...}</script>` (JSON in
 * script body) or any element with `data-photoswipe-json='{"src":"...", ...}'` (JSON in attribute).
 * When the lightbox is opened, the plugin collects all `[data-photoswipe-json]` nodes within the
 * root, parses each (from attribute or script textContent), and uses that as the dataSource. Order
 * follows DOM order. This avoids duplicate slides after re-renders and defers work until open.
 *
 * **Default configuration (root directive):**
 * When you use the root directive without an expression (`x-photoswipe` with no value), the plugin
 * uses `window.theme.photoswipe` as the config if it exists (e.g. in Pipeline themes that set it in
 * the theme head). If `window.theme.photoswipe` is not defined, it falls back to an empty object.
 * So `x-photoswipe` is equivalent to `x-photoswipe="window.theme.photoswipe"` when the theme
 * provides that object. You can still pass any config expression to override, e.g.
 * `x-photoswipe="{ maxZoomLevel: 2 }"` or `x-photoswipe="myCustomConfig"`.
 *
 * @example Root with default theme config (bare directive)
 * ```html
 * <div x-photoswipe>
 *   <script type="application/json" data-photoswipe-json>{"src":"image.jpg","width":600,"height":400,"alt":"My Image"}</script>
 *   <button x-photoswipe:button="0">Open Lightbox</button>
 *   <template x-photoswipe:counter>
 *     <div><span x-text="currentIndex + 1"></span> of <span x-text="totalSlides"></span></div>
 *   </template>
 * </div>
 * ```
 *
 * @example Root with explicit or custom config
 * ```html
 * <div x-photoswipe="window.theme.photoswipe">
 * <div x-photoswipe="{ maxZoomLevel: 2, zoom: true }">
 * ```
 */
function photoSwipe(defaultConfig = {}) {
    return function (Alpine) {
        Alpine.directive('photoswipe', ($el, data, utilities) => {
            if (!isHtmlElement($el)) {
                throw new Error(`Expected HTMLElement but got ${$el}`);
            }
            if (data.value === 'button') {
                handleButton($el, Alpine, data);
            }
            else if (data.value === 'counter') {
                handleCounter($el, Alpine, data);
            }
            else if (data.value === null) {
                handleRoot$4($el, Alpine, data, utilities, defaultConfig);
            }
            else {
                throw new Error(`Unknown directive: x-photoswipe:${data.value}`);
            }
        }).before('bind');
        Alpine.magic('photoswipe', ($el) => {
            const $data = Alpine.$data($el);
            return $data.__photoswipe_lightbox;
        });
    };
}
function handleCounter($el, Alpine, { expression }) {
    if (!isTemplateElement($el)) {
        throw new Error(`Expected TemplateElement but got ${$el}`);
    }
    Alpine.bind($el, {
        'x-init'() {
            this.__photoswipe_counterEl = $el.content.firstElementChild;
        },
    });
}
function handleButton($el, Alpine, { expression }) {
    if (!expression) {
        throw new Error(`x-photoswipe:button requires an id matching a datasource item`);
    }
    Alpine.bind($el, {
        '@click.stop.prevent'() {
            this.$data.__photoswipe_loadAndOpen(expression);
        },
    });
}
function handleRoot$4($el, Alpine, { expression }, { evaluate }, defaultConfig) {
    Alpine.bind($el, {
        'x-data'() {
            return {
                __photoswipe_lightbox: null,
                __photoswipe_initPromise: new Promise(() => { }),
                __photoswipe_idleId: null,
                __photoswipe_buttonHeight: 0,
                __photoswipe_counterHeight: 0,
                __photoswipe_counterEl: null,
                __photoswipe_root: $el,
                async init() {
                    const [{ default: PhotoSwipeLightbox }, { default: PhotoSwipeVideoPlugin }] = await Promise.all([
                        import('photoswipe/lightbox'),
                        // @ts-ignore: Untyped module TODO
                        import('photoswipe-video-plugin'),
                    ]);
                    this.__photoswipe_initPromise = new Promise((resolve) => {
                        this.__photoswipe_idleId = window.requestIdleCallback(async () => {
                            var _a;
                            const themePhotoswipe = (_a = window.theme) === null || _a === void 0 ? void 0 : _a.photoswipe;
                            const instanceConfig = expression ? evaluate(expression) : themePhotoswipe !== null && themePhotoswipe !== void 0 ? themePhotoswipe : {};
                            const config = Object.assign(Object.assign({}, defaultConfig), instanceConfig);
                            this.__photoswipe_lightbox = new PhotoSwipeLightbox(Object.assign({ dataSource: [] }, config));
                            this.__photoswipe_lightbox.addFilter('thumbEl', (thumbEl, data) => {
                                if (data.thumbEl) {
                                    return this.__photoswipe_root.querySelector(data.thumbEl);
                                }
                                return thumbEl;
                            });
                            this.__photoswipe_lightbox.addFilter('uiElement', (element, data) => {
                                if (!this.__photoswipe_lightbox)
                                    return element;
                                if (data.name === 'counter') {
                                    if (!this.__photoswipe_counterEl)
                                        return element;
                                    const pswp = this.__photoswipe_lightbox.pswp;
                                    if (!pswp)
                                        return element;
                                    const counterClone = this.__photoswipe_counterEl.cloneNode(true);
                                    const counterScope = Alpine.reactive({
                                        currentIndex: pswp.currIndex,
                                        totalSlides: pswp.getNumItems(),
                                    });
                                    Alpine.addScopeToNode(counterClone, counterScope);
                                    Alpine.initTree(counterClone);
                                    this.__photoswipe_lightbox.on('change', () => {
                                        counterScope.currentIndex = pswp.currIndex;
                                        element.replaceChildren(counterClone);
                                    });
                                }
                                return element;
                            });
                            new PhotoSwipeVideoPlugin(this.__photoswipe_lightbox);
                            Alpine.mutateDom(() => {
                                var _a;
                                (_a = this.__photoswipe_lightbox) === null || _a === void 0 ? void 0 : _a.init();
                            });
                            resolve();
                        });
                    });
                },
                async __photoswipe_loadAndOpen(id, _dataSource, initialPoint) {
                    await this.__photoswipe_initPromise;
                    const lightbox = this.__photoswipe_lightbox;
                    if (!lightbox)
                        return false;
                    let result = false;
                    const dataSource = getDataSourceFromRoot(this.__photoswipe_root);
                    const index = dataSource.findIndex((item) => item.id === id);
                    if (index === -1) {
                        console.warn(`Could not find datasource item with id ${id}, defaulting to showing first item`);
                    }
                    Alpine.mutateDom(() => {
                        result = lightbox.loadAndOpen(index, dataSource, initialPoint);
                    });
                    return result;
                },
                destroy() {
                    if (this.__photoswipe_idleId !== null) {
                        window.cancelIdleCallback(this.__photoswipe_idleId);
                        this.__photoswipe_idleId = null;
                    }
                    Alpine.mutateDom(() => {
                        var _a;
                        (_a = this.__photoswipe_lightbox) === null || _a === void 0 ? void 0 : _a.destroy();
                        this.__photoswipe_lightbox = null;
                    });
                },
            };
        },
    });
}

/**
 * Plugin to create a custom cursor that snaps to snap points on mouse enter and unsnap on mouse leave.
 *
 * Inspired by https://medium.com/14islands/developing-a-performant-custom-cursor-89f1688a02eb
 *
 * @example
 *
 * ```
 * <div x-custom-cursor class="absolute inset-[100px] bg-[grey]">
 *   <div x-custom-cursor:element data-test-id="cursor-element" class="absolute w-5 h-5 bg-red-500 z-10 translate-x-[--cursor-x] translate-y-[--cursor-y]"></div>
 *   <div x-custom-cursor:snap-point class="absolute top-1/2 left-1/2 w-[50px] h-[50px] bg-blue-500 z-0"></div>
 * </div>
 * ```
 */
function customCursor (Alpine) {
    Alpine.directive('custom-cursor', ($el, data) => {
        if (data.value === 'element') {
            handleElement($el, Alpine, data);
        }
        else if (data.value === 'snap-point') {
            handleSnapPoint($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot$3($el, Alpine);
        }
        else {
            throw new Error(`Unknown directive: x-custom-cursor:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('customCursor', ($el) => {
        const $data = Alpine.$data($el);
        return {
            get isSnapped() {
                return $data.__customCursor_isSnapped;
            },
            get isActive() {
                return $data.__customCursor_isActive;
            },
            get targetPosition() {
                return $data.__customCursor_targetPosition;
            },
            snap(el) {
                $data.__customCursor_setCurrentSnapPoint(el);
            },
            unsnap() {
                $data.__customCursor_unsetCurrentSnapPoint();
            },
        };
    });
}
function handleElement($el, Alpine, data) {
    let cursorSpeed = 0.5;
    if (data.modifiers.includes('speed')) {
        const rawValue = data.modifiers[data.modifiers.indexOf('speed') + 1];
        let match = rawValue.match(/([0-9]+)%/);
        // Match percentage and clamp between 0% and 100%
        if (match)
            cursorSpeed = Math.max(Math.min(Number(match[1]) / 100, 1), 0);
    }
    Alpine.bind($el, {
        'aria-hidden': 'true',
        'x-data'() {
            return {
                __customCursor_cursorEl_cursorPosition: null,
                __customCursor_cursorEl_rAF: null,
                __customCursor_cursorEl_dimensions: null,
                init() {
                    this.$nextTick(() => {
                        this.__customCursor_cursorEl_dimensions = { width: this.$el.clientWidth, height: this.$el.clientHeight };
                        this.$watch('__customCursor_targetPosition', (targetPosition, previousTargetPosition) => {
                            if (targetPosition != null && previousTargetPosition != null) {
                                if (targetPosition.x != previousTargetPosition.x || targetPosition.y != previousTargetPosition.y) {
                                    if (!this.__customCursor_cursorEl_rAF) {
                                        this.__customCursor_cursorEl_rAF = requestAnimationFrame(this.__customCursor_cursorEl_updatePosition.bind(this));
                                    }
                                }
                            }
                            else if (targetPosition != null) {
                                this.__customCursor_cursorEl_cursorPosition = targetPosition;
                            }
                            else {
                                this.__customCursor_cursorEl_stopUpdatingPosition();
                            }
                        });
                        this.$watch('__customCursor_isActive', (isActive, wasActive) => {
                            if (!isActive && wasActive) {
                                this.__customCursor_cursorEl_stopUpdatingPosition();
                            }
                        });
                    });
                },
                destroy() {
                    this.__customCursor_cursorEl_stopUpdatingPosition();
                },
                __customCursor_cursorEl_stopUpdatingPosition() {
                    if (this.__customCursor_cursorEl_rAF) {
                        cancelAnimationFrame(this.__customCursor_cursorEl_rAF);
                        this.__customCursor_cursorEl_rAF = null;
                    }
                },
                __customCursor_cursorEl_updatePosition() {
                    const targetPosition = this.$data.__customCursor_targetPosition;
                    if (targetPosition == null)
                        return;
                    // Prevent throwing an error when the cursor is not yet initialized
                    if (this.__customCursor_cursorEl_cursorPosition == null) {
                        this.__customCursor_cursorEl_cursorPosition = targetPosition;
                    }
                    const { x: cursorX, y: cursorY } = this.__customCursor_cursorEl_cursorPosition;
                    const { x: targetX, y: targetY } = targetPosition;
                    const cursorNewX = lerp(cursorX, targetX, cursorSpeed);
                    const cursorNewY = lerp(cursorY, targetY, cursorSpeed);
                    const newPosition = buildPosition(cursorNewX, cursorNewY);
                    const delta = Math.sqrt(Math.pow(targetX - cursorX, 2) + Math.pow(targetY - cursorY, 2));
                    // Stop updating position if delta is too small
                    if (delta < 0.001) {
                        this.__customCursor_cursorEl_stopUpdatingPosition();
                        return;
                    }
                    this.__customCursor_cursorEl_cursorPosition = newPosition;
                    this.__customCursor_cursorEl_rAF = requestAnimationFrame(this.__customCursor_cursorEl_updatePosition.bind(this));
                },
            };
        },
        ':style'() {
            if (this.__customCursor_cursorEl_cursorPosition == null ||
                this.__customCursor_cursorEl_dimensions == null ||
                !this.$data.__customCursor_isActive) {
                return {
                    contain: 'layout',
                    visibility: 'hidden',
                };
            }
            const { x, y } = this.__customCursor_cursorEl_cursorPosition;
            const { width, height } = this.__customCursor_cursorEl_dimensions;
            return {
                transformOrigin: '50% 50% 0',
                contain: 'layout',
                'will-change': 'transform',
                transform: `translate3d(${x - width / 2}px, ${y - height / 2}px, 0)`,
            };
        },
    });
}
function handleSnapPoint($el, Alpine) {
    // Bail early if we're not inside of x-custom-cursor
    if (!Alpine.$data($el).__customCursor_rootEl)
        return;
    Alpine.bind($el, {
        'x-data'() {
            return {
                __customCursor_snapPoint_handleMouseEnter() {
                    this.$data.__customCursor_setCurrentSnapPoint(this.$el);
                },
                __customCursor_snapPoint_handleMouseLeave() {
                    this.$data.__customCursor_unsetCurrentSnapPoint();
                },
            };
        },
        'x-hover:start': '__customCursor_snapPoint_handleMouseEnter',
        'x-hover:end': '__customCursor_snapPoint_handleMouseLeave',
    });
}
function buildPosition(x, y) {
    return {
        x,
        y,
    };
}
function handleRoot$3($el, Alpine, data) {
    Alpine.bind($el, {
        'x-data'() {
            return {
                __customCursor_rootEl: $el,
                __customCursor_isActive: false,
                __customCursor_cursorEl: null,
                __customCursor_cursorEl_dimensions: null,
                __customCursor_currentSnapPointEl: null,
                __customCursor_currentSnapPointRect: null,
                __customCursor_targetPosition: null,
                __customCursor_setCurrentSnapPoint(el) {
                    const { x, y, width, height } = el.getBoundingClientRect();
                    this.__customCursor_currentSnapPointEl = el;
                    this.__customCursor_currentSnapPointRect = { x, y, width, height };
                },
                __customCursor_unsetCurrentSnapPoint() {
                    this.__customCursor_currentSnapPointEl = null;
                    this.__customCursor_currentSnapPointRect = null;
                },
                __customCursor_handleMouseEnter(e) {
                    this.__customCursor_targetPosition = buildPosition(e.clientX, e.clientY);
                },
                __customCursor_handleMouseMove(e) {
                    this.__customCursor_isActive = true;
                    if (this.__customCursor_currentSnapPointEl) {
                        const { x: snapX, y: snapY, width: snapWidth, height: snapHeight, } = this.__customCursor_currentSnapPointRect;
                        const snapPosition = {
                            x: snapX + snapWidth / 2,
                            y: snapY + snapHeight / 2,
                        };
                        this.__customCursor_targetPosition = snapPosition;
                    }
                    else {
                        this.__customCursor_targetPosition = buildPosition(e.clientX, e.clientY);
                    }
                },
                __customCursor_handleMouseLeave(e) {
                    this.__customCursor_isActive = false;
                    this.__customCursor_currentSnapPointEl = null;
                    this.__customCursor_targetPosition = null;
                },
                get __customCursor_isSnapped() {
                    return !!this.__customCursor_currentSnapPointEl;
                },
            };
        },
        '@mouseenter': '__customCursor_handleMouseEnter',
        '@mouseleave': '__customCursor_handleMouseLeave',
        '@mousemove.throttle.16ms': '__customCursor_handleMouseMove',
    });
}
// TODO replace with motion
/**
 * Linear interpolation between two values.
 *
 * @param a - The starting value.
 * @param b - The ending value.
 * @param n - The interpolation factor.
 * @returns The interpolated value.
 */
const lerp = (a, b, n) => (1 - n) * a + n * b;

const DEFAULT_SPEED = 60; // px/s
const DEFAULT_ATTRIBUTE_BLACKLIST = ['id'];
/**
 * This plugin provides a smoothly scrolling marquee effect by creating duplicates of items in a
 * “source” element and placing them into a matching “target” container. As the original content
 * scrolls away, the duplicated set seamlessly appears, forming an infinite loop that prevents any
 * abrupt restart.
 *
 * Inspired by: https://ryanmulligan.dev/blog/css-marquee/
 *
 * Modifiers:
 *  - speed.X: Adjusts the scrolling pace (e.g., speed.60 sets 60px per second). Negative value scrolls backwards
 *  - fill: Ensures content is repeated and appended until the visual area is completely covered.
 *  - pause: Begins the marquee in a paused state, requiring a play action to begin moving.
 *
 * General usage:
 *  1. Mark the scrolled content with x-marquee:source.
 *  2. Provide an empty container with x-marquee:target, to receive the duplicated set of items.
 *  3. Attach x-marquee to a parent element with optional modifiers like speed.X, fill, or pause.
 *
 * Programmatic control is available through $marquee, enabling methods like play, pause, or toggle
 * at any time.
 *
 * @example
 *   <div x-data x-marquee.speed.60.fill>
 *     <div x-marquee:source>
 *       <span>First Item</span>
 *       <span>Second Item</span>
 *       <span>Third Item</span>
 *     </div>
 *     <div x-marquee:target aria-hidden="true"></div>
 *   </div>
 *
 */
function marquee (Alpine) {
    Alpine.directive('marquee', ($el, { value, modifiers }) => {
        if (value == 'source') {
            Alpine.bind($el, {
                'x-init': '__marquee_sourceEl = $el',
            });
        }
        else if (value == 'target') {
            Alpine.bind($el, {
                'x-init': '__marquee_targetEl = $el',
            });
        }
        else if (value == null) {
            let speed = DEFAULT_SPEED;
            let fill = modifiers.includes('fill');
            let autoplay = !modifiers.includes('pause');
            if (modifiers.includes('speed')) {
                speed = Number(modifiers[modifiers.indexOf('speed') + 1]);
            }
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        __marquee_state: buildMarqueeState({ isPlaying: autoplay }),
                        __marquee_isInitialized: false,
                        __marquee_isActive: false,
                        __marquee_isRendering: false,
                        __marquee_sourceEl: null,
                        __marquee_targetEl: null,
                        __marquee_originalContentFragment: document.createDocumentFragment(),
                        __marquee_originalContentWidth: 0,
                        __marquee_sourceElWidth: 0,
                        __marquee_viewportWidth: 0,
                        __marquee_sourceAnimation: null,
                        __marquee_targetAnimation: null,
                        __marquee_sentinel: null,
                        __marquee_cancelInView: null,
                        get __marquee_animationDuration() {
                            return (this.__marquee_sourceElWidth / Math.abs(speed)) * 1000;
                        },
                        /**
                         * Clones source el children until source element width is gte to viewport width
                         */
                        __marquee_fillSource() {
                            return new Promise((resolve) => {
                                // When the marquee does not have width, i.e. it was initially hidden
                                if (this.__marquee_originalContentWidth === 0) {
                                    // Measure the width of the original content so we know later how many times to clone it
                                    this.__marquee_originalContentWidth = this.__marquee_sourceEl.clientWidth;
                                    this.__marquee_sourceElWidth = this.__marquee_originalContentWidth;
                                }
                                // If we haven't yet added our sentinel, do it now:
                                Alpine.mutateDom(() => {
                                    if (!this.__marquee_sentinel) {
                                        // Use a comment node or any other marker
                                        this.__marquee_sentinel = document.createComment('marquee-sentinel');
                                        this.__marquee_sourceEl.appendChild(this.__marquee_sentinel);
                                    }
                                    else {
                                        // Remove all nodes after the sentinel, so we don't stack infinite clones when re-rendering
                                        let next = this.__marquee_sentinel.nextSibling;
                                        while (next) {
                                            const toRemove = next;
                                            next = next.nextSibling;
                                            this.__marquee_sourceEl.removeChild(toRemove);
                                        }
                                        // Update the original content width in case screen size has changed it or something
                                        this.__marquee_originalContentWidth = this.__marquee_sourceEl.clientWidth;
                                        // Update the source element width to match the original content width now that we've removed clones
                                        this.__marquee_sourceElWidth = this.__marquee_originalContentWidth;
                                    }
                                });
                                const spaceToFill = Math.max(0, this.__marquee_viewportWidth - this.__marquee_originalContentWidth);
                                if (spaceToFill === 0)
                                    return resolve();
                                // Count how many times we need to clone the original content to fill the screen
                                const timesToClone = Math.ceil(spaceToFill / this.__marquee_originalContentWidth);
                                // Clone the original content until the animation wrapper fills the screen
                                const fragment = document.createDocumentFragment();
                                for (let i = 0; i < timesToClone; i++) {
                                    const clone = this.__marquee_originalContentFragment.cloneNode(true);
                                    fragment.appendChild(clone);
                                }
                                Alpine.mutateDom(() => {
                                    // Insert the new clones after our sentinel:
                                    this.__marquee_sentinel.after(fragment);
                                    Alpine.skipDuringClone(() => Alpine.initTree(this.__marquee_sourceEl))();
                                    // Wait until next paint to measure the new width of the source element so we don't cause a reflow
                                    window.requestAnimationFrame(() => {
                                        this.__marquee_sourceElWidth = this.__marquee_sourceEl.clientWidth;
                                        resolve();
                                    });
                                });
                            });
                        },
                        __marquee_cloneSourceToTarget() {
                            return new Promise((resolve) => {
                                // If the content is smaller than the viewport, don't duplicate the content because we're not
                                if (this.__marquee_sourceElWidth < this.__marquee_viewportWidth) {
                                    return resolve();
                                }
                                Alpine.mutateDom(() => {
                                    // Clone the nodes from the source to the target
                                    const clone = this.__marquee_sourceEl.cloneNode(true);
                                    this.__marquee_targetEl.replaceChildren(...clone.children);
                                    // Re-initialize alpine on cloned nodes
                                    Alpine.skipDuringClone(() => Alpine.initTree(this.__marquee_targetEl))();
                                    resolve();
                                });
                            });
                        },
                        __marquee_setupAnimations() {
                            var _a, _b;
                            const animationDirection = speed < 0 ? 'reverse' : 'normal';
                            const animationDurationInMs = this.__marquee_animationDuration;
                            const keyframes = [{ transform: `translateX(0%)` }, { transform: `translateX(-100%)` }];
                            const animationOptions = {
                                duration: animationDurationInMs,
                                iterations: Infinity,
                                direction: animationDirection,
                            };
                            if (this.__marquee_sourceAnimation == null) {
                                let sourceAnimation = new Animation(new KeyframeEffect(this.__marquee_sourceEl, keyframes, animationOptions));
                                this.__marquee_sourceAnimation = sourceAnimation;
                            }
                            else {
                                (_a = this.__marquee_sourceAnimation.effect) === null || _a === void 0 ? void 0 : _a.updateTiming({
                                    duration: animationDurationInMs,
                                });
                            }
                            if (this.__marquee_targetAnimation == null) {
                                let targetAnimation = new Animation(new KeyframeEffect(this.__marquee_targetEl, keyframes, animationOptions));
                                targetAnimation.startTime = this.__marquee_sourceAnimation.startTime;
                                targetAnimation.currentTime = this.__marquee_sourceAnimation.currentTime;
                                this.__marquee_targetAnimation = targetAnimation;
                            }
                            else {
                                (_b = this.__marquee_targetAnimation.effect) === null || _b === void 0 ? void 0 : _b.updateTiming({
                                    duration: animationDurationInMs,
                                });
                            }
                            if (this.__marquee_state.isPlaying && this.__marquee_sourceElWidth >= this.__marquee_viewportWidth) {
                                this.__marquee_sourceAnimation.play();
                                this.__marquee_targetAnimation.play();
                            }
                        },
                        __marquee_scrollTo(element) {
                            var _a, _b;
                            if (!isFinite(this.__marquee_animationDuration))
                                return;
                            let offset = element.offsetLeft;
                            let leftSpacingBuffer = 24; // (px) To allow for the focus outline to be fully visible when tabbed through
                            // When the animation is reversed
                            if (((_b = (_a = this.__marquee_sourceAnimation) === null || _a === void 0 ? void 0 : _a.effect) === null || _b === void 0 ? void 0 : _b.getComputedTiming().direction) === 'reverse') {
                                offset = this.__marquee_sourceElWidth - offset;
                                leftSpacingBuffer = leftSpacingBuffer * -1;
                            }
                            const elementPositionPercentage = (offset - leftSpacingBuffer) / this.__marquee_sourceElWidth;
                            const elementPositionTime = elementPositionPercentage * this.__marquee_animationDuration;
                            if (isFinite(elementPositionTime)) {
                                // Update animation timing to match the timing position of the selected element
                                this.__marquee_targetAnimation.currentTime = elementPositionTime;
                                this.__marquee_sourceAnimation.currentTime = elementPositionTime;
                            }
                        },
                        async __marquee_render() {
                            var _a;
                            if (!this.__marquee_isActive)
                                return;
                            if (this.__marquee_isRendering)
                                return;
                            try {
                                this.__marquee_isRendering = true;
                                if (fill) {
                                    await this.__marquee_fillSource();
                                }
                                await this.__marquee_cloneSourceToTarget();
                                let focusable;
                                let isFocusable;
                                try {
                                    const tabbable = await import('tabbable');
                                    focusable = tabbable.focusable;
                                    isFocusable = tabbable.isFocusable;
                                }
                                catch (err) {
                                    console.error('Error importing tabbable', err);
                                    focusable = () => [];
                                    isFocusable = () => false;
                                }
                                // Prevent cloned "target" items from being focused by keyboard users
                                focusable(this.__marquee_targetEl).forEach((element) => element.setAttribute('tabindex', '-1'));
                                // Prevent cloned "source" items from being focused by keyboard users
                                const sentinelNextSibling = (_a = this.__marquee_sentinel) === null || _a === void 0 ? void 0 : _a.nextSibling;
                                if (sentinelNextSibling) {
                                    const sourceChildren = [...this.__marquee_sourceEl.children];
                                    const clonedSourceChildren = sourceChildren.splice(sourceChildren.indexOf(sentinelNextSibling));
                                    clonedSourceChildren.forEach((child) => {
                                        child.setAttribute('aria-hidden', 'true');
                                        if (isFocusable(child)) {
                                            child.setAttribute('tabindex', '-1');
                                        }
                                    });
                                }
                                // Don't animate if in reduced motion mode
                                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                                    // Setup animations after the content has been cloned in order to measure the width of the content element without causing reflow
                                    this.__marquee_setupAnimations();
                                }
                                this.__marquee_isInitialized = true;
                                window.requestAnimationFrame(() => {
                                    this.__marquee_isRendering = false;
                                });
                            }
                            finally {
                                this.__marquee_isRendering = false;
                            }
                        },
                        __marquee_teardown() {
                            var _a, _b, _c, _d;
                            // Pause and cancel any running animations
                            (_a = this.__marquee_sourceAnimation) === null || _a === void 0 ? void 0 : _a.pause();
                            (_b = this.__marquee_targetAnimation) === null || _b === void 0 ? void 0 : _b.pause();
                            (_c = this.__marquee_sourceAnimation) === null || _c === void 0 ? void 0 : _c.cancel();
                            (_d = this.__marquee_targetAnimation) === null || _d === void 0 ? void 0 : _d.cancel();
                            this.__marquee_sourceAnimation = null;
                            this.__marquee_targetAnimation = null;
                            this.__marquee_isInitialized = false;
                        },
                        init() {
                            this.$nextTick(() => {
                                if (this.__marquee_sourceEl == null) {
                                    throw new Error('Source element not found, x-marquee:source must be applied to a child element of the x-marquee directive');
                                }
                                if (this.__marquee_targetEl == null) {
                                    throw new Error('Target element not found, x-marquee:target must be applied to a child element of the x-marquee directive');
                                }
                                this.__marquee_targetEl.setAttribute('aria-hidden', 'true');
                                // Clone the contents of the animation wrapper so we can clone it until the animation wrapper fills the screen
                                Array.from(this.__marquee_sourceEl.children).forEach((element) => {
                                    const clone = element.cloneNode(true);
                                    for (const blacklistedAttribute of DEFAULT_ATTRIBUTE_BLACKLIST) {
                                        clone.removeAttribute(blacklistedAttribute);
                                    }
                                    this.__marquee_originalContentFragment.append(clone);
                                });
                                // Measure the width of the original content so we know later how many times to clone it
                                this.__marquee_originalContentWidth = this.__marquee_sourceEl.clientWidth;
                                this.__marquee_sourceElWidth = this.__marquee_originalContentWidth;
                                this.__marquee_viewportWidth = this.$el.clientWidth;
                                // Start/stop when in view similar to parallax
                                this.__marquee_cancelInView = inView(this.$el, () => {
                                    this.__marquee_isActive = true;
                                    window.requestAnimationFrame(() => {
                                        this.__marquee_render();
                                    });
                                    return () => {
                                        this.__marquee_isActive = false;
                                        this.__marquee_teardown();
                                    };
                                });
                            });
                            this.$watch('__marquee_state.isPlaying', (playing) => {
                                var _a, _b, _c, _d;
                                if (playing) {
                                    (_a = this.__marquee_sourceAnimation) === null || _a === void 0 ? void 0 : _a.play();
                                    (_b = this.__marquee_targetAnimation) === null || _b === void 0 ? void 0 : _b.play();
                                }
                                else {
                                    (_c = this.__marquee_sourceAnimation) === null || _c === void 0 ? void 0 : _c.pause();
                                    (_d = this.__marquee_targetAnimation) === null || _d === void 0 ? void 0 : _d.pause();
                                }
                            });
                        },
                        destroy() {
                            var _a, _b, _c, _d, _e;
                            (_a = this.__marquee_cancelInView) === null || _a === void 0 ? void 0 : _a.call(this);
                            (_b = this.__marquee_sourceEl) === null || _b === void 0 ? void 0 : _b.replaceChildren(this.__marquee_originalContentFragment);
                            this.__marquee_originalContentFragment = document.createDocumentFragment();
                            (_c = this.__marquee_sentinel) === null || _c === void 0 ? void 0 : _c.remove();
                            (_d = this.__marquee_sourceAnimation) === null || _d === void 0 ? void 0 : _d.cancel();
                            (_e = this.__marquee_targetAnimation) === null || _e === void 0 ? void 0 : _e.cancel();
                            this.__marquee_sourceAnimation = null;
                            this.__marquee_targetAnimation = null;
                        },
                    };
                },
                'x-resize.document'() {
                    this.__marquee_viewportWidth = this.$el.clientWidth;
                    this.__marquee_render();
                },
            });
        }
        else {
            throw new Error(`Unknown directive: x-marquee:${value}`);
        }
    }).before('bind');
    Alpine.magic('marquee', ($el) => {
        const $data = Alpine.$data($el);
        return {
            get isPlaying() {
                var _a;
                return (_a = $data.__marquee_state) === null || _a === void 0 ? void 0 : _a.isPlaying;
            },
            play() {
                var _a;
                (_a = $data.__marquee_state) === null || _a === void 0 ? void 0 : _a.play();
            },
            pause() {
                var _a;
                (_a = $data.__marquee_state) === null || _a === void 0 ? void 0 : _a.pause();
            },
            toggle() {
                var _a;
                (_a = $data.__marquee_state) === null || _a === void 0 ? void 0 : _a.toggle();
            },
            scrollTo(element) {
                var _a;
                (_a = $data.__marquee_scrollTo) === null || _a === void 0 ? void 0 : _a.call($data, element);
            },
            get isReady() {
                return $data.__marquee_isInitialized;
            },
        };
    });
}
function buildMarqueeState(options) {
    var _a;
    return {
        isPlaying: (_a = options === null || options === void 0 ? void 0 : options.isPlaying) !== null && _a !== void 0 ? _a : false,
        play() {
            this.isPlaying = true;
        },
        pause() {
            this.isPlaying = false;
        },
        toggle() {
            this.isPlaying = !this.isPlaying;
        },
    };
}

/**
 * TODO docs
 */
function sliderReveal (Alpine) {
    Alpine.directive('slider-reveal', ($el, data) => {
        if (data.value == 'handle') {
            handleHandle($el, Alpine);
        }
        else if (data.value == 'reveal') {
            handleReveal($el, Alpine);
        }
        else if (data.value == null) {
            handleRoot$2($el, Alpine, data);
        }
        else {
            throw new Error(`Unknown directive: x-slider-reveal:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('sliderReveal', handleSliderRevealMagic(Alpine));
}
function handleHandle($el, Alpine, _data) {
    Alpine.bind($el, {
        'x-init': '__sliderReveal_handle = $el',
    });
}
function handleReveal($el, Alpine, _data) {
    Alpine.bind($el, {
        'x-init': '__sliderReveal_reveal = $el',
    });
}
function handleRoot$2($el, Alpine, data) {
    const orientation = data.modifiers.includes('vertical') ? 'vertical' : 'horizontal';
    let initialProgress = 0;
    if (data.modifiers.includes('initial')) {
        initialProgress = Number(data.modifiers[data.modifiers.indexOf('initial') + 1]);
    }
    if (data.modifiers.includes('progress')) {
        const rawValue = data.modifiers[data.modifiers.indexOf('progress') + 1];
        if (!rawValue) {
            throw new Error('x-slider-reveal.progress requires a value (e.g. x-slider-reveal.progress.50%)');
        }
        // Support x-slider-reveal.progress.50% which will set the initial progress to 50%
        let match = rawValue.match(/([0-9]+)%/);
        if (match)
            initialProgress = Number(match[1]);
    }
    const progressToPercent = transform([0, 100], ['0%', '100%']);
    Alpine.bind($el, {
        'x-data'() {
            return {
                __sliderReveal_progressMotionValue: reactiveMotionValue(Alpine, initialProgress),
                __sliderReveal_handle: null,
                __sliderReveal_reveal: null,
                __sliderReveal_scrollAnimationFn: null,
                init() {
                    this.$nextTick(() => {
                        // Update elements with initial progress
                        this.__sliderReveal_updateElements(initialProgress);
                        // Update elements on progress change
                        this.__sliderReveal_progressMotionValue.on('change', this.__sliderReveal_updateElements.bind(this));
                    });
                },
                __enableScroll() {
                    if (this.__sliderReveal_scrollAnimationFn)
                        return;
                    this.__sliderReveal_scrollAnimationFn = scroll((scrollProgress) => {
                        const currentProgress = this.__sliderReveal_progressMotionValue.get();
                        let lowerBound = Math.max(0, currentProgress - 15);
                        let upperBound = Math.min(100, currentProgress + 15);
                        const scrollToProgress = transform([0.0, 1.0], [0, 100]);
                        const progressToBoundedProgress = transform([0, 100], [lowerBound, upperBound]);
                        const normalizedScrollProgress = scrollToProgress(scrollProgress);
                        const boundedNewProgress = progressToBoundedProgress(normalizedScrollProgress);
                        this.__sliderReveal_updateElements(boundedNewProgress);
                    }, {
                        target: $el,
                        offset: ['end start', 'start end'],
                    });
                },
                __disableScroll() {
                    var _a;
                    (_a = this.__sliderReveal_scrollAnimationFn) === null || _a === void 0 ? void 0 : _a.call(this);
                    this.__sliderReveal_scrollAnimationFn = null;
                },
                __sliderReveal_updateElements(progress) {
                    const percentProgress = progressToPercent(progress);
                    if (orientation === 'vertical') {
                        if (this.__sliderReveal_handle) {
                            if (document.dir == 'rtl') {
                                this.__sliderReveal_handle.style.transform = `translateY(-${percentProgress})`;
                                this.__sliderReveal_reveal.style.clipPath = `inset(0% 0% ${percentProgress} 0%)`;
                            }
                            else {
                                this.__sliderReveal_handle.style.transform = `translateY(${percentProgress})`;
                                this.__sliderReveal_reveal.style.clipPath = `inset(${percentProgress} 0% 0% 0%)`;
                            }
                        }
                    }
                    else {
                        if (this.__sliderReveal_handle) {
                            if (document.dir == 'rtl') {
                                this.__sliderReveal_handle.style.transform = `translateX(-${percentProgress})`;
                                this.__sliderReveal_reveal.style.clipPath = `inset(0% ${percentProgress} 0% 0%)`;
                            }
                            else {
                                this.__sliderReveal_handle.style.transform = `translateX(${percentProgress})`;
                                this.__sliderReveal_reveal.style.clipPath = `inset(0% 0% 0% ${percentProgress})`;
                            }
                        }
                    }
                },
            };
        },
    });
}
function handleSliderRevealMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            get progressMotionValue() {
                return $data.__sliderReveal_progressMotionValue;
            },
            get progress() {
                return $data.__sliderReveal_progressMotionValue.get();
            },
            set progress(value) {
                $data.__sliderReveal_progressMotionValue.set(value);
            },
            enableScroll() {
                $data.__enableScroll();
            },
            disableScroll() {
                $data.__disableScroll();
            },
        };
    };
}

function load() {
    return {
        script(url) {
            return new Promise((resolve, reject) => {
                const existingScript = document.querySelector(`script[src="${url}"]`);
                if (existingScript) {
                    resolve('Script already exists.');
                    return;
                }
                const newScript = document.createElement('script');
                newScript.src = url;
                newScript.async = true;
                newScript.onload = () => resolve('Script loaded successfully.');
                newScript.onerror = () => reject('Failed to load script.');
                document.head.appendChild(newScript);
                return;
            });
        },
    };
}
/**
 * Magic to read/write/destroy browser cookies
 */
function cookie() {
    const configuration = {
        expires: null,
        path: '/',
        domain: window.location.hostname,
    };
    return {
        write(name, value) {
            document.cookie = `${name}=${value}; expires=${configuration.expires}; path=${configuration.path}; domain=${configuration.domain}`;
        },
        read(name) {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].split('=');
                if (name == cookie[0].trim()) {
                    return decodeURIComponent(cookie[1]);
                }
            }
            return null;
        },
        destroy(name) {
            if (document.cookie.split('; ').find((row) => row.startsWith(name))) {
                document.cookie = `${name}=; Max-Age=0; path=${configuration.path}; domain=${configuration.domain}`;
            }
        },
    };
}
function utils (Alpine) {
    Alpine.magic('debounce', function () {
        return Alpine.debounce;
    });
    Alpine.magic('throttle', function () {
        return Alpine.throttle;
    });
    Alpine.magic('yieldToMain', function () {
        return yieldToMain;
    });
    Alpine.magic('load', load);
    Alpine.magic('cookie', cookie);
}

/**
 * Plugin which improves sticky behaviour in column layouts by allowing
 * the shorter column to scroll independently of the taller column. Instead
 * of having to scroll the taller column to see the shorter column, the
 * shorter column will scroll up immediately.
 *
 * @usage
 *
 * To use this plugin simply, create a column layout and add the `x-sticky-scroll` directive to the sticky column
 *
 * @example
 *
 * <div class="flex flex-row">
 *   <div>
 *     ... Very long content..
 *   </div>
 *
 *   <div x-sticky-scroll class="sticky top-0">
 *     ... Short content ...
 *   </div>
 * </div>
 */
function stickyScroll (Alpine) {
    Alpine.directive('sticky-scroll', ($el) => {
        Alpine.bind($el, {
            'x-data'() {
                return {
                    __stickyScroll_initialTop: 0,
                    __stickyScroll_currentTop: 0,
                    __stickyScroll_lastScrollY: 0,
                    __stickyScroll_isSticky: false,
                    __stickyScroll_canFitInViewport: false,
                    __stickyScroll_cancelScrollListener: null,
                    __stickyScroll_updateBounds() {
                        this.$el.style.removeProperty('top');
                        this.__stickyScroll_canFitInViewport = this.$el.clientHeight < window.innerHeight;
                        const styles = getComputedStyle(this.$el);
                        this.__stickyScroll_initialTop = parseInt(styles.top);
                        this.__stickyScroll_isSticky = styles.position == 'sticky';
                        this.__stickyScroll_updatePosition();
                    },
                    __stickyScroll_updatePosition() {
                        if (!this.__stickyScroll_isSticky || this.__stickyScroll_canFitInViewport) {
                            this.$el.style.removeProperty('top');
                            return;
                        }
                        const bounds = this.$el.getBoundingClientRect();
                        const maxScroll = bounds.top + window.scrollY - this.$el.offsetTop + this.__stickyScroll_initialTop;
                        const minScroll = this.$el.clientHeight - window.innerHeight;
                        const scrollDelta = window.scrollY - this.__stickyScroll_lastScrollY;
                        this.__stickyScroll_currentTop = Math.min(Math.max(this.__stickyScroll_currentTop - scrollDelta, -minScroll), maxScroll, this.__stickyScroll_initialTop);
                        this.__stickyScroll_lastScrollY = window.scrollY;
                        this.$el.style.top = `${Math.round(this.__stickyScroll_currentTop)}px`;
                    },
                    __stickyScroll_setupScrollListener() {
                        var _a;
                        (_a = this.__stickyScroll_cancelScrollListener) === null || _a === void 0 ? void 0 : _a.call(this);
                        this.__stickyScroll_cancelScrollListener = scroll(this.__stickyScroll_updatePosition.bind(this));
                    },
                    destroy() {
                        var _a;
                        (_a = this.__stickyScroll_cancelScrollListener) === null || _a === void 0 ? void 0 : _a.call(this);
                    },
                };
            },
            ['x-resize']() {
                this.__stickyScroll_updateBounds();
            },
            ['x-resize.document']() {
                this.__stickyScroll_updateBounds();
            },
            ['x-effect']() {
                var _a;
                // Only setup the scroll listener if the column is not able to fit in the viewport (and thus can be scrolled)
                if (this.__stickyScroll_canFitInViewport) {
                    (_a = this.__stickyScroll_cancelScrollListener) === null || _a === void 0 ? void 0 : _a.call(this);
                }
                else {
                    this.__stickyScroll_setupScrollListener();
                }
            },
        });
    });
}

/**
 * TODO docs
 */
function pan (Alpine) {
    Alpine.directive('pan', ($el, data, { cleanup }) => {
        const panGestureRecognizer = new PanGestureRecognizer($el);
        cleanup(() => {
            panGestureRecognizer.destroy();
        });
    }).before('bind');
}

/**
 * Hijacks cart form submissions and serializes form data and submits to the cart/add.js endpoint instead of a normal HTTP form submission.
 *
 * - Looks for sections marked with data-cart-api-section and adds them in the 'sections' form data parameter so that the theme can update the sections in response to the form submission.
 * - Dispatches a theme:cart:update:success event with the parsed body of the response.
 *
 * @example
 *
 * ```liquid
 * {% form 'cart', cart, x-cart-form: '' %}
 *   {% for item in cart.items %}
 *     <li>
 *       <span>{{ item.product.title }}</span>
 *       <span>{{ item.quantity }}</span>
 *       <span>{{ item.price | money }}</span>
 *       <input type="number" name="updates[]" value="{{ item.quantity }}">
 *     </li>
 *   {% endfor %}
 *   <button type="submit">Check out</button>
 * {% endform %}
 * ```
 */
function cartForm (Alpine) {
    Alpine.directive('cart-form', ($el, data, utilities) => {
        var _a, _b;
        if (data.value == 'form') {
            handleForm$1($el, Alpine);
        }
        else if (data.value == 'context') {
            handleContext$1($el, Alpine, data);
        }
        else {
            const xFormModifiers = data.modifiers.length ? data.modifiers.join('.') : null;
            if (!((_b = (_a = window === null || window === void 0 ? void 0 : window.theme) === null || _a === void 0 ? void 0 : _a.routes) === null || _b === void 0 ? void 0 : _b.cartUpdate)) {
                throw new Error('window.theme.routes.cartUpdate is not defined');
            }
            if (!isFormElement($el)) {
                // Handle the case of x-async-form being applied to a parent of a form element
                // In this case we look for a form element child and apply form directive to that
                Alpine.bind($el, {
                    [`x-cart-form:context${xFormModifiers ? `.${xFormModifiers}` : ``}`]: '',
                });
                const form = $el.querySelector('form');
                if (form) {
                    Alpine.bind(form, {
                        [`x-cart-form:form`]: '',
                    });
                }
            }
            else {
                Alpine.bind($el, {
                    [`x-cart-form:context${xFormModifiers ? `.${xFormModifiers}` : ``}`]: '',
                    [`x-cart-form:form`]: '',
                });
            }
        }
    }).before('bind');
    Alpine.magic('cartForm', handleAsyncFormMagic(Alpine));
}
function handleForm$1($el, Alpine, data, _utilities) {
    Alpine.bind($el, {
        method: 'POST',
    });
}
function handleContext$1($el, Alpine, data, _utilities) {
    const xFormModifiers = data.modifiers.length ? data.modifiers.join('.') : null;
    Alpine.bind($el, {
        [`x-async-form${xFormModifiers ? `.${xFormModifiers}` : ``}`]: () => {
            return (data) => {
                var _a;
                // Gather up all the sections marked with data-cart-api-section and add them in the 'sections' form data parameter
                (_a = data.formData) === null || _a === void 0 ? void 0 : _a.append('sections', getCartApiSections().join(','));
                data.action = `${window.theme.routes.cartUpdate}.js`;
                return submitFormData(data);
            };
        },
        '@form:success'() {
            this.$dispatch('theme:cart:update:success', this.$event.detail);
        },
        '@form:error'() {
            this.$dispatch('theme:cart:update:error', this.$event.detail);
        },
    });
}

async function get(init) {
    var _a, _b;
    if (!((_b = (_a = window === null || window === void 0 ? void 0 : window.theme) === null || _a === void 0 ? void 0 : _a.routes) === null || _b === void 0 ? void 0 : _b.cart)) {
        throw new Error('window.theme.routes.cart is not defined');
    }
    return fetch(`${window.theme.routes.cart}.js`, Object.assign({ method: 'GET', headers: {
            'Content-Type': 'application/json',
        } }, init));
}

/**
 * Hijacks cart form submissions and serializes form data and submits to the cart/add.js endpoint instead of a normal HTTP form submission.
 *
 * - Looks for sections marked with data-cart-api-section and adds them in the 'sections' form data parameter so that the theme can update the sections in response to the form submission.
 * - Dispatches a theme:cart:change:success event with the parsed body of the response.
 *
 * @example W
 *
 * ```liquid
 * {% for item in cart.items %}
 *   <li>
 *     <span>{{ item.product.title }}</span>
 *     <span>{{ item.quantity }}</span>
 *     <span>{{ item.price | money }}</span>
 *     <form x-cart-item>
 *       <input type="number" x-model.fill.number="$cartItem.quantity" name="updates[]" value="{{ item.quantity }}" @input.debounce.500ms="$cartItem.submitAsync()">
 *     </form>
 *   </li>
 * {% endfor %}
 * ```
 *
 * @example Within another form
 *
 * ```liquid
 * {% form 'cart', cart, x-cart-item: '' %}
 *   {% for item in cart.items %}
 *     <li x-cart-item>
 *       <span>{{ item.product.title }}</span>
 *       <span>{{ item.quantity }}</span>
 *       <span>{{ item.price | money }}</span>
 *       <input type="number" x-model.fill.number="$cartItem.quantity" name="updates[]" value="{{ item.quantity }}" @input.debounce.500ms="$cartItem.submitAsync()">
 *     </li>
 *   {% endfor %}
 *   <button type="submit">Check out</button>
 * {% endform %}
 * ```
 */
function cartItem (Alpine) {
    Alpine.directive('cart-item', ($el, data) => {
        var _a, _b;
        if (data.value == 'form') {
            handleForm($el, Alpine);
        }
        else if (data.value == 'context') {
            handleContext($el, Alpine, data);
        }
        else {
            const xFormModifiers = data.modifiers.length ? data.modifiers.join('.') : null;
            if (!((_b = (_a = window === null || window === void 0 ? void 0 : window.theme) === null || _a === void 0 ? void 0 : _a.routes) === null || _b === void 0 ? void 0 : _b.cartChange)) {
                throw new Error('window.theme.routes.cartChange is not defined');
            }
            if (!isFormElement($el)) {
                // Handle the case of x-async-form being applied to a parent of a form element
                // In this case we look for a form element child and apply form directive to that
                Alpine.bind($el, {
                    [`x-cart-item:context${xFormModifiers ? `.${xFormModifiers}` : ``}`]: data.expression,
                });
                const form = $el.querySelector('form');
                if (form) {
                    Alpine.bind(form, {
                        [`x-cart-item:form`]: '',
                    });
                }
            }
            else {
                Alpine.bind($el, {
                    [`x-cart-item:context${xFormModifiers ? `.${xFormModifiers}` : ``}`]: data.expression,
                    [`x-cart-item:form`]: '',
                });
            }
        }
    }).before('bind');
    Alpine.magic('cartItem', ($el) => {
        const $data = Alpine.$data($el);
        return mergeProperties({}, {
            get quantity() {
                return $data.__cartItem_quantity;
            },
            set quantity(quantity) {
                $data.__cartItem_quantity = quantity;
            },
            get isRemoving() {
                return $data.__cartItem_isRemoving;
            },
            remove: $data.__cartItem_remove.bind($data),
        }, handleAsyncFormMagic(Alpine)($el));
    });
}
function handleForm($el, Alpine) {
    Alpine.bind($el, {
        method: 'POST',
    });
}
function handleContext($el, Alpine, data) {
    const xFormModifiers = data.modifiers.length ? data.modifiers.join('.') : null;
    const line = parseInt(data.expression, 10);
    if (isNaN(line)) {
        throw new Error('x-cart-item requires a line number');
    }
    Alpine.bind($el, {
        'x-data'() {
            return {
                __cartItem_quantity: null,
                get __cartItem_isRemoving() {
                    return this.__cartItem_quantity === 0;
                },
                async __cartItem_remove() {
                    this.__cartItem_quantity = 0;
                    return await this.__asyncForm_submitAsync();
                },
                async __cartItem_save(info) {
                    var _a, _b, _c;
                    const formData = (info === null || info === void 0 ? void 0 : info.formData) || new FormData();
                    formData.append('line', line.toString());
                    // Gather up all the sections marked with data-cart-api-section and add them in the 'sections' form data parameter
                    formData.append('sections', getCartApiSections().join(','));
                    if (!formData.has('quantity')) {
                        formData.append('quantity', this.__cartItem_quantity);
                    }
                    if (isNaN(parseFloat(formData.get('quantity')))) {
                        throw new Error('Quantity must be a number and cannot be empty');
                    }
                    const changeRequest = submitFormData({
                        action: `${window.theme.routes.cartChange}`,
                        method: 'POST',
                        enctype: 'application/json',
                        formData,
                    });
                    const changeResponse = await changeRequest;
                    // If the change request is a 422, we need to get the current cart and update the quantity input to the quantity of the item in the cart
                    // so that the quantity input has the max quantity available for the item
                    if ((changeResponse === null || changeResponse === void 0 ? void 0 : changeResponse.status) == 422) {
                        // Make a new request to find the actual quantity of the item in the cart since the last request errored presumably due to a stockout. Would be nice if the change request returned the quantity of the item in the cart but it does not.
                        // Note: we re-use the same abort controller to get the current cart so that if the user starts changing the quantity input again, the request will be cancelled
                        const cartRequestResponse = await get({ signal: this.$asyncForm.signal });
                        const cartRequestResponseBody = await (cartRequestResponse === null || cartRequestResponse === void 0 ? void 0 : cartRequestResponse.json());
                        const cartItem = (_a = cartRequestResponseBody === null || cartRequestResponseBody === void 0 ? void 0 : cartRequestResponseBody.items) === null || _a === void 0 ? void 0 : _a[line - 1];
                        if (cartItem) {
                            this.__cartItem_quantity = cartItem.quantity;
                        }
                    }
                    else {
                        // Find the item in the cart change response and update the quantity input to the quantity of the item in the cart
                        const cartChangeRequestResponseBody = await ((_b = changeResponse === null || changeResponse === void 0 ? void 0 : changeResponse.clone()) === null || _b === void 0 ? void 0 : _b.json());
                        const cartItem = (_c = cartChangeRequestResponseBody === null || cartChangeRequestResponseBody === void 0 ? void 0 : cartChangeRequestResponseBody.items) === null || _c === void 0 ? void 0 : _c[line - 1];
                        if (cartItem) {
                            this.__cartItem_quantity = cartItem.quantity;
                        }
                    }
                    return changeRequest;
                },
            };
        },
        [`x-async-form${xFormModifiers ? `.${xFormModifiers}` : ``}`]: '__cartItem_save',
        '@form:success'() {
            this.$dispatch('theme:cart:change:success', this.$event.detail);
        },
        '@form:error'() {
            this.$dispatch('theme:cart:change:error', this.$event.detail);
        },
    });
}

/**
 * Pure math/state helpers for header-stack sticky logic.
 * No DOM, no store – safe to unit test and use from any environment.
 */
/**
 * Whether a row with the given mode should be sticky given current scroll state.
 * - always: always sticky
 * - scroll: sticky only when scrolling up and user has scrolled (isScrolled)
 * - never: never sticky
 */
function isStickyActive(mode, scrollDirection, isScrolled) {
    if (mode === 'always')
        return true;
    if (mode === 'scroll')
        return scrollDirection === 'up' && isScrolled;
    return false;
}
/** Top offset for the sticky element at index (sum of heights of sticky elements before it). */
function stickyTopForIndex(elements, index, scrollDirection, isScrolled) {
    let top = 0;
    for (let i = 0; i < index; i++) {
        if (isStickyActive(elements[i].stickyMode, scrollDirection, isScrolled)) {
            top += elements[i].height;
        }
    }
    return top;
}
/** Top offset (px as number) when sticky for each row index. Same length as elements. */
function stickyTopsForAllIndices(elements, scrollDirection, isScrolled) {
    return elements.map((_, i) => stickyTopForIndex(elements, i, scrollDirection, isScrolled));
}
/** For each row: whether it is currently sticky and the top value (stacked offset or negative height when hidden). */
function stickyRowStates(elements, scrollDirection, isScrolled) {
    const tops = stickyTopsForAllIndices(elements, scrollDirection, isScrolled);
    return elements.map((el, i) => {
        const active = isStickyActive(el.stickyMode, scrollDirection, isScrolled);
        const topPx = active ? `${tops[i]}px` : `${-el.height}px`;
        return { active, topPx };
    });
}

const RESIZE_DEBOUNCE_MS = 32;
/** Px past the header we must scroll before the "scroll" row can stick (avoids flicker near top). */
const SCROLL_MODE_THRESHOLD_EXTRA = 20;
function dispatchScrollEvent$1(direction, position) {
    document.dispatchEvent(new CustomEvent(`theme:scroll:${direction}`, { detail: { position } }));
}
function clearStickyStyles(el) {
    el.style.removeProperty('position');
    el.style.removeProperty('top');
}
function getScrollProgress(scrollY) {
    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - doc.clientHeight;
    if (maxScroll <= 0)
        return 0;
    return Math.max(0, Math.min(1, scrollY / maxScroll));
}
/**
 * Manages a stacked sticky header: row registration and scroll-driven layout.
 * Uses callbacks so the host can update its store and set body CSS vars (e.g. in onHeaderResize).
 *
 * @example
 * const manager = new HeaderStackManager(rootEl, {
 *   onScrollState(s) { store.scrollY = s.scrollY; ... },
 *   onHeaderResize(m) { store.headerHeight = m.headerHeight; document.body.style.setProperty('--header-height', m.headerHeight + 'px'); ... },
 *   onStuckChange(stuck) { rootEl.toggleAttribute('data-header-stuck', stuck); },
 * });
 * // on teardown: manager.destroy();
 */
class HeaderStackManager {
    constructor(rootEl, options = {}) {
        this.cancelScroll = null;
        this.resizeObserver = null;
        this.mutationObserver = null;
        this.rafId = null;
        this.scrollRafId = null;
        this.idleId = null;
        this.resizeDebounceId = null;
        this.lastScrollY = 0;
        this.lastDirection = null;
        this.hasScrolledPastThreshold = false;
        this.lastAnyStuck = false;
        this.elements = [];
        this.rootEl = rootEl;
        this.options = options;
        this.idleId = requestIdleCallback(() => this.scheduleRecalculate(), { timeout: 2000 });
        this.resizeObserver = new ResizeObserver(() => {
            if (this.resizeDebounceId !== null)
                clearTimeout(this.resizeDebounceId);
            this.resizeDebounceId = setTimeout(() => {
                this.resizeDebounceId = null;
                this.scheduleRecalculate();
            }, RESIZE_DEBOUNCE_MS);
        });
        this.mutationObserver = new MutationObserver((mutations) => {
            var _a;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                    for (const node of mutation.removedNodes) {
                        if (node instanceof HTMLElement) {
                            (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.unobserve(node);
                            const index = this.elements.findIndex((e) => e.el === node);
                            if (index >= 0)
                                this.elements.splice(index, 1);
                        }
                    }
                    this.scheduleRecalculate();
                    break;
                }
            }
        });
        this.mutationObserver.observe(this.rootEl, { childList: true, subtree: false });
        this.cancelScroll = scroll((_progress, info) => {
            this.handleScroll(info);
        });
    }
    destroy() {
        var _a, _b, _c, _d, _e, _f, _g;
        (_a = this.cancelScroll) === null || _a === void 0 ? void 0 : _a.call(this);
        this.cancelScroll = null;
        if (this.rafId !== null)
            cancelAnimationFrame(this.rafId);
        if (this.scrollRafId !== null)
            cancelAnimationFrame(this.scrollRafId);
        if (this.resizeDebounceId !== null) {
            clearTimeout(this.resizeDebounceId);
            this.resizeDebounceId = null;
        }
        if (this.idleId !== null) {
            cancelIdleCallback(this.idleId);
            this.idleId = null;
        }
        (_b = this.resizeObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
        (_c = this.mutationObserver) === null || _c === void 0 ? void 0 : _c.disconnect();
        (_e = (_d = this.options).onStuckChange) === null || _e === void 0 ? void 0 : _e.call(_d, false);
        (_g = (_f = this.options).onHeaderResize) === null || _g === void 0 ? void 0 : _g.call(_f, { headerHeight: 0, headerBottom: 0 });
    }
    handleScroll(info) {
        var _a, _b;
        const scrollY = info.y.current;
        const velocity = info.y.velocity;
        let direction = null;
        if (velocity != null && velocity !== 0) {
            direction = velocity > 0 ? 'down' : 'up';
        }
        else if (this.lastScrollY !== scrollY) {
            direction = scrollY > this.lastScrollY ? 'down' : 'up';
        }
        const headerHeight = this.elements.length > 0 ? this.elements.reduce((sum, item) => sum + item.height, 0) : 0;
        const min = headerHeight + SCROLL_MODE_THRESHOLD_EXTRA;
        const wasNotAtTop = this.lastScrollY > 0;
        this.lastScrollY = scrollY;
        if (direction != null)
            this.lastDirection = direction;
        const scrollProgress = getScrollProgress(scrollY);
        (_b = (_a = this.options).onScrollState) === null || _b === void 0 ? void 0 : _b.call(_a, {
            scrollY,
            scrollProgress,
            scrollDirection: this.lastDirection,
        });
        if (direction != null) {
            dispatchScrollEvent$1(direction, scrollY);
        }
        if (scrollY === 0)
            this.hasScrolledPastThreshold = false;
        else if (scrollY >= min)
            this.hasScrolledPastThreshold = true;
        if (this.elements.length === 0) {
            this.scheduleRecalculate(scrollY);
            return;
        }
        const justArrivedAtTop = scrollY === 0 && wasNotAtTop;
        if (justArrivedAtTop) {
            this.scheduleRecalculate(0);
        }
        else {
            this.scheduleScrollUpdate();
        }
    }
    registerHeader(el, mode) {
        var _a, _b, _c;
        const idx = this.elements.findIndex((e) => e.el === el);
        if (idx >= 0) {
            this.elements[idx].stickyMode = mode;
        }
        else {
            const registered = new Set(this.elements.map((e) => e.el));
            let insertIndex = 0;
            for (const child of this.rootEl.children) {
                if (child === el)
                    break;
                if (registered.has(child))
                    insertIndex++;
            }
            this.elements.splice(insertIndex, 0, {
                el,
                height: el.offsetHeight,
                stickyMode: mode,
                lastAppliedTop: null,
            });
            (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.observe(el);
            const headerHeight = this.elements.reduce((sum, item) => sum + item.height, 0);
            (_c = (_b = this.options).onHeaderResize) === null || _c === void 0 ? void 0 : _c.call(_b, { headerHeight, headerBottom: headerHeight });
            this.scheduleRecalculate();
        }
    }
    unregisterHeader(el) {
        var _a;
        (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.unobserve(el);
        const index = this.elements.findIndex((e) => e.el === el);
        if (index >= 0)
            this.elements.splice(index, 1);
    }
    scheduleScrollUpdate() {
        if (this.scrollRafId !== null)
            return;
        this.scrollRafId = requestAnimationFrame(() => {
            this.scrollRafId = null;
            this.writeStickyOffset(this.lastScrollY);
            this.applyPositioning(this.lastDirection);
        });
    }
    scheduleRecalculate(scrollY) {
        if (this.rafId !== null)
            cancelAnimationFrame(this.rafId);
        this.rafId = requestAnimationFrame(() => {
            this.rafId = null;
            const scrollYToUse = scrollY !== null && scrollY !== void 0 ? scrollY : this.lastScrollY;
            for (const item of this.elements)
                item.height = item.el.offsetHeight;
            const headerHeight = this.elements.reduce((sum, item) => sum + item.height, 0);
            const min = headerHeight + SCROLL_MODE_THRESHOLD_EXTRA;
            if (scrollYToUse === 0)
                this.hasScrolledPastThreshold = false;
            else if (scrollYToUse >= min)
                this.hasScrolledPastThreshold = true;
            this.writeStickyOffset(scrollYToUse);
            this.applyPositioning(this.lastDirection);
        });
    }
    writeStickyOffset(scrollY) {
        var _a, _b, _c, _d;
        const headerHeight = this.elements.reduce((sum, item) => sum + item.height, 0);
        const scrollProgress = getScrollProgress(scrollY);
        (_b = (_a = this.options).onScrollState) === null || _b === void 0 ? void 0 : _b.call(_a, {
            scrollY,
            scrollProgress,
            scrollDirection: this.lastDirection,
        });
        let bottom;
        if (scrollY === 0) {
            bottom = headerHeight;
        }
        else {
            const minScrollForScrollMode = headerHeight + SCROLL_MODE_THRESHOLD_EXTRA;
            const isScrolledEnough = scrollY >= minScrollForScrollMode || (scrollY > 0 && this.hasScrolledPastThreshold);
            const states = stickyRowStates(this.elements, this.lastDirection, isScrolledEnough);
            bottom = 0;
            for (let i = 0; i < this.elements.length; i++) {
                if (states[i].active)
                    bottom += this.elements[i].height;
            }
        }
        const headerBottom = Math.max(0, bottom);
        (_d = (_c = this.options).onHeaderResize) === null || _d === void 0 ? void 0 : _d.call(_c, { headerHeight, headerBottom });
    }
    applyPositioning(direction) {
        var _a, _b;
        const headerHeight = this.elements.reduce((sum, item) => sum + item.height, 0);
        const scrollY = this.lastScrollY;
        const minScrollForScrollMode = headerHeight + SCROLL_MODE_THRESHOLD_EXTRA;
        const isScrolledEnough = scrollY >= minScrollForScrollMode || (scrollY > 0 && this.hasScrolledPastThreshold);
        const states = stickyRowStates(this.elements, direction, isScrolledEnough);
        let anyStuck = false;
        let cumulativeTop = 0;
        for (let i = 0; i < this.elements.length; i++) {
            const item = this.elements[i];
            const { active, topPx: newTop } = states[i];
            if (item.stickyMode === 'never') {
                if (item.lastAppliedTop !== null) {
                    clearStickyStyles(item.el);
                    item.lastAppliedTop = null;
                }
                cumulativeTop += item.height;
                continue;
            }
            const isStuck = active && scrollY > cumulativeTop;
            if (isStuck)
                anyStuck = true;
            if (item.lastAppliedTop !== newTop) {
                item.el.style.position = 'sticky';
                item.el.style.top = newTop;
                item.lastAppliedTop = newTop;
            }
            cumulativeTop += item.height;
        }
        if (anyStuck !== this.lastAnyStuck) {
            this.lastAnyStuck = anyStuck;
            (_b = (_a = this.options).onStuckChange) === null || _b === void 0 ? void 0 : _b.call(_a, anyStuck);
        }
    }
}

const VISUAL_VIEWPORT_DEBOUNCE_MS = 500;
function dispatchScrollEvent(direction, position) {
    document.dispatchEvent(new CustomEvent(`theme:scroll:${direction}`, { detail: { position } }));
}
function updatePageStoreFromScroll(page, progress, info) {
    const prev = page.scrollProgress;
    const position = info.y.current;
    page.scrollProgress = progress;
    page.scrollY = position;
    // Only set direction when we've actually scrolled (avoids 'down' from noise when at top).
    if (position > 0 && progress > prev) {
        page.scrollDirection = 'down';
        dispatchScrollEvent('down', position);
    }
    else if (position > 0 && progress < prev) {
        page.scrollDirection = 'up';
        dispatchScrollEvent('up', position);
    }
}
function pageLayout(Alpine) {
    var _a, _b;
    const store = {
        scrollY: 0,
        scrollProgress: 0,
        scrollDirection: null,
        visualViewportHeight: typeof window !== 'undefined' ? (_b = (_a = window.visualViewport) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0 : 0,
        headerHeight: 0,
        headerBottom: 0,
        get isScrolled() {
            return this.scrollY > 0;
        },
    };
    Alpine.store('page', store);
    // Subscribe to scroll and visual viewport to keep the page store in sync.
    requestIdleCallback(() => {
        var _a;
        const page = Alpine.store('page');
        if (!page)
            return;
        scroll((progress, info) => {
            updatePageStoreFromScroll(page, progress, info);
        });
        requestAnimationFrame(() => {
            if (window.visualViewport) {
                page.visualViewportHeight = window.visualViewport.height;
            }
        });
        (_a = window.visualViewport) === null || _a === void 0 ? void 0 : _a.addEventListener('resize', Alpine.debounce(() => {
            if (window.visualViewport) {
                Alpine.store('page').visualViewportHeight = window.visualViewport.height;
            }
        }, VISUAL_VIEWPORT_DEBOUNCE_MS), { passive: true });
    }, { timeout: 2000 });
    // x-header-stack (root) vs x-header-stack:header[.always|.scroll] (row).
    Alpine.directive('header-stack', ($el, data, _utilities) => {
        var _a;
        if (data.value === 'header') {
            const modifiers = (_a = data.modifiers) !== null && _a !== void 0 ? _a : [];
            const mode = modifiers.includes('always')
                ? 'always'
                : modifiers.includes('scroll')
                    ? 'scroll'
                    : 'never';
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        stack: null,
                        rowEl: null,
                        init() {
                            this.$nextTick(() => {
                                let parent = this.$el.parentElement;
                                while (parent) {
                                    const parentData = Alpine.$data(parent);
                                    if (parentData === null || parentData === void 0 ? void 0 : parentData.registerHeader) {
                                        this.stack = parentData;
                                        break;
                                    }
                                    parent = parent.parentElement;
                                }
                                if (!this.stack)
                                    return;
                                const root = this.stack.rootEl;
                                // Walk up to the direct child of the stack root (the row we register).
                                let row = this.$el;
                                while (row.parentElement && row.parentElement !== root)
                                    row = row.parentElement;
                                // Not under this stack (e.g. nested in a different stack).
                                if (row.parentElement !== root)
                                    return;
                                this.rowEl = row;
                                this.stack.registerHeader(this.rowEl, mode);
                            });
                        },
                        destroy() {
                            if (this.stack && this.rowEl)
                                this.stack.unregisterHeader(this.rowEl);
                        },
                    };
                },
            });
            return;
        }
        if (data.value == null) {
            Alpine.bind($el, {
                'x-data'() {
                    const rootEl = $el;
                    let manager = null;
                    const store = Alpine.store('page');
                    return {
                        rootEl,
                        manager: null,
                        registerHeader(el, mode) {
                            manager === null || manager === void 0 ? void 0 : manager.registerHeader(el, mode);
                        },
                        unregisterHeader(el) {
                            manager === null || manager === void 0 ? void 0 : manager.unregisterHeader(el);
                        },
                        init() {
                            manager = new HeaderStackManager(rootEl, {
                                onScrollState(state) {
                                    store.scrollY = state.scrollY;
                                    store.scrollProgress = state.scrollProgress;
                                    store.scrollDirection = state.scrollDirection;
                                },
                                onHeaderResize(metrics) {
                                    store.headerHeight = metrics.headerHeight;
                                    store.headerBottom = metrics.headerBottom;
                                    const heightPx = `${metrics.headerHeight}px`;
                                    const bottomPx = `${metrics.headerBottom}px`;
                                    if (document.body.style.getPropertyValue('--header-height') !== heightPx)
                                        document.body.style.setProperty('--header-height', heightPx);
                                    if (document.body.style.getPropertyValue('--header-bottom') !== bottomPx)
                                        document.body.style.setProperty('--header-bottom', bottomPx);
                                },
                                onStuckChange(stuck) {
                                    if (stuck)
                                        rootEl.setAttribute('data-header-stuck', '');
                                    else
                                        rootEl.removeAttribute('data-header-stuck');
                                },
                            });
                            this.manager = manager;
                        },
                        destroy() {
                            manager === null || manager === void 0 ? void 0 : manager.destroy();
                            manager = null;
                        },
                    };
                },
            });
            return;
        }
        throw new Error(`Unknown directive: x-header-stack:${data.value}`);
    }).before('bind');
}

/**
 * Recently viewed products – store-scoped localStorage (product IDs).
 * Exports recordProductView and getRecentlyViewedProducts for import via @theme/recent.
 */
const STORAGE_KEY_PREFIX = 'recentlyViewed';
function getStorageKey() {
    const store = window.theme?.shop?.permanentDomain;
    return [STORAGE_KEY_PREFIX, store].filter(Boolean).join('_');
}
/**
 * Get recently viewed product IDs for the current store.
 */
function getRecentlyViewedProducts() {
    try {
        if (typeof localStorage === 'undefined')
            return [];
        const raw = localStorage.getItem(getStorageKey());
        const list = raw ? JSON.parse(raw) : [];
        return Array.isArray(list) ? list : [];
    }
    catch {
        return [];
    }
}

function sectionRelated(Alpine) {
    Alpine.directive('section-related', ($el, data) => {
        // data.value is the part after the colon (e.g. "recent-products-tab"); null when no colon (root).
        if (data.value === 'recent-products-tab') {
            handleRecentProductsTab($el, Alpine, data);
        }
        else if (data.value === 'related-products-tab') {
            handleRelatedProductsTab($el, Alpine, data);
        }
        else if (data.value == null) {
            handleRoot$1($el, Alpine, data);
        }
        else {
            throw new Error(`Unknown directive: x-section-related:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('sectionRelated', function ($el) {
        const data = Alpine.$data($el);
        return {
            get canShowRecentProducts() {
                return data?.__sectionRelated_canShowRecentProducts ?? false;
            },
            get hasRecentProductsTab() {
                return data?.__sectionRelated_hasRecentProductsTab ?? false;
            },
        };
    });
}
function handleRoot$1($el, Alpine, data) {
    const productId = (data.expression ?? '').trim();
    Alpine.bind($el, {
        'x-data'() {
            return {
                __sectionRelatedRoot: true,
                __sectionRelated_productId: productId,
                __sectionRelated_hasRecentProductsTab: false,
                __sectionRelated_canShowRecentProducts: true,
                /** Build recommendations URL and $sectionApi.update(onlyRoots: ['related-products']). */
                updateRelatedProducts(productId, limit) {
                    const sectionId = this.$sectionId ?? '';
                    const recommendationsUrl = window.theme?.routes?.productRecommendations ?? '';
                    const url = `${recommendationsUrl}?section_id=${sectionId}&product_id=${productId}&limit=${limit}&intent=related`;
                    this.$sectionApi?.update({
                        url,
                        cachePolicy: 'network-only',
                        abortPending: false,
                        onlyRoots: ['related-products'],
                    });
                },
                /** Build search URL for ids (excluding excludeId), then $sectionApi.update(onlyRoots: ['recent-products']). */
                updateRecentProducts(excludeId, limit) {
                    const sectionId = this.$sectionId ?? '';
                    const ids = getRecentlyViewedProducts()
                        .filter((id) => String(id) !== String(excludeId))
                        .slice(0, limit);
                    if (ids.length === 0)
                        return;
                    const query = ids.map((id) => `id:${id}`).join(' OR ');
                    const searchUrl = window.theme?.routes?.search ?? '';
                    const url = `${searchUrl}?type=product&q=${encodeURIComponent(query)}&section_id=${sectionId}`;
                    this.$sectionApi?.update({
                        url,
                        cachePolicy: 'network-only',
                        abortPending: false,
                        onlyRoots: ['recent-products'],
                    });
                },
            };
        },
        /** When a sibling (e.g. product section) fires should-update with a url, reload only the section-title block. */
        '@theme:sibling-section:should-update.window'() {
            if (this.$sectionEl !== this.$event?.target)
                return;
            const baseUrl = this.$event.detail?.url;
            this.$sectionApi?.update({
                waitForIdle: true,
                abortPending: false,
                baseUrl,
                onlyRoots: ['section-title'],
            });
        },
    });
}
/**
 * Recent-products tab: load products by id from store-scoped recent views (@theme/recent), excluding current.
 * Uses search API (id:...) + section_id; onlyRoots: ['recent-products'] so only that block is re-rendered.
 */
function handleRecentProductsTab($el, Alpine, data) {
    const opts = parseModifiers(data.modifiers ?? []);
    const limit = opts.limit;
    const threshold = opts.threshold;
    Alpine.bind($el, {
        'x-data'() {
            return {
                init() {
                    this.__sectionRelated_hasRecentProductsTab = true;
                    const recentProductIds = getRecentlyViewedProducts()
                        .filter((id) => String(id) !== String(this.__sectionRelated_productId ?? '').trim())
                        .slice(0, limit);
                    if (recentProductIds.length >= threshold) {
                        this.__sectionRelated_canShowRecentProducts = true;
                        this.updateRecentProducts(this.__sectionRelated_productId ?? '', limit);
                    }
                    else {
                        this.__sectionRelated_canShowRecentProducts = false;
                    }
                },
            };
        },
        /** When another section (e.g. product) fires sibling-section:should-update, reload for the new product if event target is in our block. */
        '@theme:sibling-section:should-update.window'() {
            if (this.$sectionEl !== this.$event?.target)
                return;
            const excludeId = this?.$event?.detail.siblingId ?? this.__sectionRelated_productId;
            this.updateRecentProducts(excludeId, limit);
        },
    });
}
/**
 * Related-products tab: load Shopify product recommendations by product id.
 * Uses theme.routes.productRecommendations; onlyRoots: ['related-products'] so only that block is re-rendered.
 */
function handleRelatedProductsTab($el, Alpine, data) {
    const opts = parseModifiers(data.modifiers ?? []);
    const limit = opts.limit ?? 6;
    Alpine.bind($el, {
        'x-data'() {
            return {
                init() {
                    const productId = String(this.__sectionRelated_productId ?? '').trim();
                    this.updateRelatedProducts(productId, limit);
                },
            };
        },
        /** On sibling-section:should-update, reload related products for the new product (detail.siblingId or root product id). */
        '@theme:sibling-section:should-update.window'() {
            if (this.$sectionEl !== this.$event?.target)
                return;
            const rootId = String(this.__sectionRelated_productId ?? '').trim();
            const siblingId = this?.$event?.detail?.siblingId ?? rootId;
            this.updateRelatedProducts(siblingId, limit);
        },
    });
}
/**
 * Parses directive modifiers of the form .key.value into a record.
 * e.g. .limit.10.threshold.3 => { limit: 10, threshold: 3 }
 * Values are parsed as numbers when possible.
 */
function parseModifiers(modifiers) {
    const out = {};
    for (let i = 0; i + 1 < modifiers.length; i += 2) {
        const key = modifiers[i];
        const n = parseInt(modifiers[i + 1], 10);
        if (!Number.isNaN(n))
            out[key] = n;
    }
    return out;
}

// Alpine Data for variant-based product cards
function productCardVariantData(productId, initialVariantId) {
    return {
        productId,
        userSelectedVariantId: null,
        autoSelectedVariantId: null,
        get variantId() {
            return this.autoSelectedVariantId ?? this.userSelectedVariantId ?? initialVariantId;
        },
        set variantId(variantId) {
            this.userSelectedVariantId = variantId;
        },
        get product() {
            return this.$cache.products.get(this.productId);
        },
        get productCardUrl() {
            if (!this.variantId)
                return this.product?.url;
            return this.product?.url?.includes(`variant=${this.variantId}`)
                ? this.product?.url
                : `${this.product?.url}?variant=${this.variantId}`;
        },
        get hasSelectedVariant() {
            return this.variantId !== null;
        },
        clearVariant() {
            this.userSelectedVariantId = null;
        },
    };
}
// Alpine Data for sibling-based product cards
function productCardSiblingData(productId) {
    return {
        productId,
        get variantId() {
            return this.product?.selected_or_first_available_variant?.id ?? null;
        },
        get product() {
            return this.$cache.products.get(this.productId);
        },
        get productCardUrl() {
            return this.displayProduct?.url;
        },
        get displayProductId() {
            return this.productId;
        },
        get displayProduct() {
            return this.$cache.products.get(this.productId) || null;
        },
        get hasDisplayProduct() {
            return this.displayProductId !== null;
        },
    };
}
Alpine.data('productCardVariantData', productCardVariantData);
Alpine.data('productCardSiblingData', productCardSiblingData);

Alpine.directive('cursor-position', ($el) => {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                x: motionValue(0),
                y: motionValue(0),
                styleEffect: null,
                width: 0,
                height: 0,
                xAnimation: null,
                yAnimation: null,
                init() {
                    if (!this.styleEffect) {
                        this.styleEffect = styleEffect($el, {
                            '--cursor-x': transformValue(() => `${this.x.get()}%`),
                            '--cursor-y': transformValue(() => `${this.y.get()}%`),
                        });
                    }
                },
            };
        },
        '@pointerenter'() {
            if (this.$media.matches.touch)
                return;
            const { width, height } = $el.getBoundingClientRect();
            this.width = width;
            this.height = height;
            const newX = (this.$event.offsetX / this.width) * 100;
            const newY = (this.$event.offsetY / this.height) * 100;
            Alpine.raw(this.x).jump(newX);
            Alpine.raw(this.y).jump(newY);
        },
        '@pointermove'() {
            if (this.$media.matches.touch)
                return;
            if (this.width === 0 || this.height === 0)
                return;
            const newX = (this.$event.offsetX / this.width) * 100;
            const newY = (this.$event.offsetY / this.height) * 100;
            Alpine.raw(this.x).set(newX);
            Alpine.raw(this.y).set(newY);
        },
        '@pointerleave'() {
            if (this.$media.matches.touch)
                return;
            const finalX = (this.$event.offsetX / this.width) * 100;
            const finalY = (this.$event.offsetY / this.height) * 100;
            Alpine.raw(this.x).set(finalX);
            Alpine.raw(this.y).set(finalY);
        },
    });
}).before('bind');

Alpine.directive('slideshow-mobile-swipe', ($el) => {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                width: 0,
                transitionProgress: motionValue(0),
                styleEffect: null,
                init() {
                    if (!this.$media.matches.touch)
                        return;
                    this.styleEffect = styleEffect($el, {
                        '--slideshow-mobile-swipe-progress': this.transitionProgress,
                    });
                },
                destroy() {
                    this.styleEffect?.();
                    this.styleEffect = null;
                    this.transitionProgress.set(0);
                },
            };
        },
        'x-pan': '',
        '@panstart'() {
            if (!this.$media.matches.touch)
                return;
            this.transitionProgress.set(0);
        },
        '@panmove'() {
            if (!this.$media.matches.touch || this.width === 0)
                return;
            const deltaX = this.$event.detail.panSession.panDeltaX;
            const swipeDistance = this.width / 2;
            const maxProgress = 0.5;
            // Map panDeltaX from [-threshold, 0, threshold] to [maxProgress, 0, maxProgress]
            // This creates a symmetric mapping where swiping in either direction increases progress
            const progress = Math.min(maxProgress, (Math.abs(deltaX) / swipeDistance) * maxProgress);
            this.transitionProgress.set(progress);
        },
        '@panend'() {
            if (!this.$media.matches.touch)
                return;
            // Threshold for swipe to trigger next or previous slide
            const swipeThreshold = this.width / 4;
            if (this.$event.detail.panSession.panDeltaX > swipeThreshold) {
                this.$nextTick(() => {
                    this.$slideshow.pause();
                    this.$slideshow.prev();
                    this.transitionProgress.set(0);
                });
            }
            else if (this.$event.detail.panSession.panDeltaX < -swipeThreshold) {
                this.$nextTick(() => {
                    this.$slideshow.pause();
                    this.$slideshow.next();
                    this.transitionProgress.set(0);
                });
            }
            else {
                this.transitionProgress.set(0);
            }
        },
        'x-resize'() {
            this.width = this.$width;
        },
    });
});

Alpine.directive('cart-api-section', ($el) => {
    Alpine.bind($el, {
        'x-data'() {
            return {
                refresh: Alpine.debounce(() => {
                    this.$sectionApi.update({ batch: true, cachePolicy: 'network-only' });
                }, 500),
            };
        },
        // Mark this section so that it's id is included in the 'sections' parameter of the cart API requests
        'data-cart-api-section': 'true',
        // Look for updated HTML for this section in the cart API response 'sections' parameter and update the section if it is
        '@theme:cart:add:success.window'() {
            if (!this.$sectionId ||
                !this.$event.detail.sections ||
                !(this.$sectionId in this.$event.detail.sections) ||
                typeof this.$event.detail.sections[this.$sectionId] !== 'string') {
                // Fall back to manually updating the section with a seperate section rendering API request
                this.refresh();
                return;
            }
            const updatedSectionHtml = this.$event.detail.sections[this.$sectionId];
            this.$sectionApi.setHtml(updatedSectionHtml, { mode: 'morph' });
        },
        '@theme:cart:add:error.window'() {
            this.refresh();
            return;
        },
        '@theme:cart:update:success.window'() {
            if (!this.$sectionId ||
                !this.$event.detail.sections ||
                !(this.$sectionId in this.$event.detail.sections) ||
                typeof this.$event.detail.sections[this.$sectionId] !== 'string') {
                // Fall back to manually updating the section with a seperate section rendering API request
                this.refresh();
                return;
            }
            const updatedSectionHtml = this.$event.detail.sections[this.$sectionId];
            this.$sectionApi.setHtml(updatedSectionHtml, { mode: 'morph' });
        },
        '@theme:cart:change:success.window'() {
            if (!this.$sectionId ||
                !this.$event.detail.sections ||
                !(this.$sectionId in this.$event.detail.sections) ||
                typeof this.$event.detail.sections[this.$sectionId] !== 'string') {
                // Fall back to manually updating the section with a seperate section rendering API request
                this.refresh();
                return;
            }
            const updatedSectionHtml = this.$event.detail.sections[this.$sectionId];
            this.$sectionApi.setHtml(updatedSectionHtml, { mode: 'morph' });
        },
        '@theme:cart:change:error.window'() {
            this.refresh();
            return;
        },
        '@theme:cart:clear.window'() {
            if (!this.$sectionId ||
                !this.$event.detail.sections ||
                !(this.$sectionId in this.$event.detail.sections) ||
                typeof this.$event.detail.sections[this.$sectionId] !== 'string') {
                // Fall back to manually updating the section with a seperate section rendering API request
                this.refresh();
                return;
            }
            const updatedSectionHtml = this.$event.detail.sections[this.$sectionId];
            this.$sectionApi.setHtml(updatedSectionHtml, { mode: 'morph' });
        },
        // Refresh the section when the page tab becomes active to ensure the cart data is correct when switching between tabs.
        '@visibilitychange.window'() {
            if (document.hidden)
                return;
            this.refresh();
        },
    });
});

const cachedRecommendations = new Map();
Alpine.directive('product-complementary', ($el, { expression, modifiers }) => {
    const productId = expression;
    let limit = 1;
    if (modifiers.includes('limit')) {
        const limitIndex = modifiers.indexOf('limit');
        const rawValue = limitIndex >= 0 && limitIndex < modifiers.length - 1 ? modifiers[limitIndex + 1] : undefined;
        if (rawValue) {
            const match = rawValue.match(/([0-9]+)/);
            if (match)
                limit = Number(match[1]);
        }
    }
    Alpine.bind($el, {
        'x-data'() {
            return {
                abortController: null,
                hasLoaded: false,
                init() {
                    if (!this.$el.id) {
                        throw new Error('Product complementary element must have an id');
                    }
                },
                async fetchProductRecommendations() {
                    const sectionId = this.$sectionEl?.id.split('shopify-section-')[1];
                    if (!sectionId)
                        return;
                    const url = `${window.theme.routes.productRecommendations}?section_id=${sectionId}&product_id=${productId}&limit=${limit}&intent=complementary`;
                    const cachedResult = cachedRecommendations.get(url);
                    if (cachedResult) {
                        this.hasLoaded = true;
                        return cachedResult;
                    }
                    // Abort any in-flight request
                    this.abortController?.abort();
                    const currentController = new AbortController();
                    this.abortController = currentController;
                    try {
                        // Fetch the updated version of this DOM element from the section rendering API
                        const response = await fetch(url, { signal: currentController.signal });
                        const result = await response.text();
                        // Only set hasLoaded after we have a valid result
                        if (!result)
                            return;
                        // Parse the result into a DOM tree and find the updated version of this DOM element
                        const parsedResult = new DOMParser().parseFromString(result, 'text/html');
                        const recommendationHtml = parsedResult.getElementById(this.$el.id)?.outerHTML;
                        if (!recommendationHtml)
                            return;
                        // Only mark as loaded and cache if we got valid HTML
                        this.hasLoaded = true;
                        cachedRecommendations.set(url, recommendationHtml);
                        return recommendationHtml;
                    }
                    catch (error) {
                        // Ignore abort errors, but re-throw other errors
                        if (error instanceof Error && error.name !== 'AbortError') {
                            console.error('Failed to fetch product recommendations:', error);
                        }
                        return undefined;
                    }
                    finally {
                        // Only clear the controller if it's still the current one (wasn't replaced by a new request)
                        if (this.abortController === currentController) {
                            this.abortController = null;
                        }
                    }
                },
                async updateProductRecommendations() {
                    try {
                        const result = await this.fetchProductRecommendations();
                        if (result) {
                            Alpine.morph(this.$el, result);
                        }
                    }
                    catch (error) {
                        console.error('Failed to update product recommendations:', error);
                    }
                },
            };
        },
        'x-intersect.once'() {
            if (this.hasLoaded)
                return;
            window.requestIdleCallback(() => {
                this.updateProductRecommendations();
            });
        },
    });
});

Alpine.directive('header-menu-navigation-item', ($el, { expression, modifiers }, { evaluate }) => {
    const isDesignMode = window.Shopify?.designMode;
    // Expression is the menu id, sublinks modifier indicates if it has sub links
    const menuId = expression;
    const hasSubLinks = modifiers.includes('sublinks');
    Alpine.bind($el, {
        'x-data'() {
            return {
                customMegaMenu: null,
                init() {
                    window.requestIdleCallback(() => {
                        // Grab the first custom mega menu element matching this menu id
                        this.customMegaMenu = document.querySelector(`[data-custom-megamenu="${menuId}"]`);
                    });
                },
                get hasCustomMegaMenu() {
                    return this.customMegaMenu !== null;
                },
                get hasSubLinks() {
                    return hasSubLinks;
                },
                get hasPopup() {
                    return this.hasCustomMegaMenu || this.hasSubLinks;
                },
                get hasActivePopup() {
                    return this.$store.headerMenu.activePopupId == menuId;
                },
                get isSelectedInThemeEditor() {
                    return this.$store.headerMenu.themeEditorSelectedPopupId == menuId;
                },
                selectFromThemeEditor() {
                    this.$store.headerMenu.themeEditorSelectedPopupId = menuId;
                    this.$popover.open();
                },
                deselectFromThemeEditor() {
                    if (this.$store.headerMenu.themeEditorSelectedPopupId == menuId) {
                        this.$store.headerMenu.themeEditorSelectedPopupId = null;
                    }
                    this.$popover.close();
                },
            };
        },
        'x-popover.noreturn.noclose'() {
            return {
                get isOpen() {
                    return Alpine.store('headerMenu').activePopupId == menuId;
                },
                set isOpen(value) {
                    if (value) {
                        Alpine.store('headerMenu').activePopupId = menuId;
                    }
                    else {
                        if (Alpine.store('headerMenu').activePopupId == menuId) {
                            Alpine.store('headerMenu').activePopupId = null;
                        }
                    }
                },
            };
        },
        'x-hover:start.delay.100ms'() {
            const data = this.$data;
            if (data.hasPopup && !data.hasActivePopup) {
                this.$popover.open();
            }
        },
        'x-hover:end.delay.200ms'() {
            const data = this.$data;
            if (isDesignMode && data.isSelectedInThemeEditor)
                return;
            if (data.hasActivePopup) {
                this.$popover.close();
            }
        },
        '@mousedown.outside'() {
            const data = this.$data;
            if (data.hasActivePopup) {
                if (isDesignMode) {
                    data.deselectFromThemeEditor();
                }
                else {
                    this.$popover.close();
                }
            }
        },
    });
}).before('bind');

// Track URLs that have been preloaded or are in progress (global to prevent duplicates across instances)
const preloadedUrls = new Set();
/** Event types used for interact-based preload (delegated on root). */
const PRELOAD_INTERACT_EVENTS = ['click', 'touchstart', 'focusin', 'focus', 'pointerover'];
Alpine.directive('preloader', ($el, { expression, modifiers }) => {
    let preloadOnIntersect = modifiers.includes('intersect');
    let preloadOnInteract = modifiers.includes('interact');
    if (!modifiers.includes('intersect') && !modifiers.includes('interact')) {
        preloadOnIntersect = true;
        preloadOnInteract = true;
    }
    Alpine.bind($el, {
        'x-data'() {
            // Single AbortController for all batch requests
            const sectionId = expression || this.$sectionId;
            return {
                __preloader_batchAbortController: new AbortController(),
                /** AbortController for interact delegation listeners (aborting removes all listeners). */
                __preloader_interactAbortController: undefined,
                __preloader_sectionId: sectionId,
                __preloader_getUrls() {
                    // Collect all URLs from children with data-preload-url attribute
                    const urls = [];
                    $el.querySelectorAll('[data-preload-url]').forEach((child) => {
                        const url = child.dataset.preloadUrl;
                        if (url) {
                            urls.push(url);
                        }
                    });
                    return urls;
                },
                __preloader_cancelBatchRequests() {
                    // Abort all pending batch requests
                    this.__preloader_batchAbortController.abort();
                },
                /**
                 * Preload a single URL (used when user interacts with an element that has data-preload-url).
                 * Uses high priority so the target is ready before navigation.
                 */
                __preloader_preloadOne(url) {
                    if (isSavingData() || isSlowConnection())
                        return;
                    if (!url || preloadedUrls.has(url))
                        return;
                    preloadedUrls.add(url);
                    this.$sectionApi
                        ?.load({
                        sectionId: this.__preloader_sectionId,
                        baseUrl: url,
                        abortPending: false,
                        waitForIdle: false,
                        priority: 'high',
                    })
                        ?.catch(() => {
                        // Ignore load errors (e.g. navigation aborted)
                    });
                },
                /**
                 * Delegated handler: when interaction happens on a descendant with data-preload-url, preload that URL.
                 */
                __preloader_handlePreloadInteract(event) {
                    const root = this.$el;
                    const target = event.target?.nodeType === Node.ELEMENT_NODE
                        ? event.target.closest?.('[data-preload-url]')
                        : null;
                    if (!target || !root.contains(target))
                        return;
                    const url = target.dataset?.preloadUrl;
                    if (url)
                        this.__preloader_preloadOne(url);
                },
                __preloader_preloadAll() {
                    const sectionsStore = this.$store?.sections;
                    if (isSavingData() || isSlowConnection())
                        return;
                    if (!sectionsStore?.intersected?.has(this.$sectionId))
                        return;
                    const urls = this.__preloader_getUrls();
                    const newUrls = [];
                    // Filter out URLs that have already been preloaded
                    urls.forEach((url) => {
                        if (!preloadedUrls.has(url)) {
                            newUrls.push(url);
                            preloadedUrls.add(url);
                        }
                    });
                    const sectionId = this.__preloader_sectionId;
                    // Preload with low priority (batch requests)
                    newUrls.forEach((url) => {
                        this.$sectionApi
                            ?.load({
                            sectionId,
                            baseUrl: url,
                            abortPending: false,
                            waitForIdle: true,
                            priority: 'low',
                            signal: this.__preloader_batchAbortController.signal,
                        })
                            ?.catch(() => {
                            // Ignore abort errors
                        });
                    });
                },
                init() {
                    if (!preloadOnInteract)
                        return;
                    const controller = new AbortController();
                    this.__preloader_interactAbortController = controller;
                    const root = this.$el;
                    const { signal } = controller;
                    PRELOAD_INTERACT_EVENTS.forEach((type) => {
                        root.addEventListener(type, this.__preloader_handlePreloadInteract.bind(this), {
                            passive: type === 'touchstart',
                            signal,
                        });
                    });
                },
                destroy() {
                    // Cancel all pending batch requests when component is destroyed
                    this.__preloader_cancelBatchRequests();
                    // Abort interact delegation (removes all listeners registered with the signal)
                    this.__preloader_interactAbortController?.abort();
                },
            };
        },
        'x-effect'() {
            if (preloadOnIntersect) {
                if (this.$store?.sections?.intersected?.has(this.$sectionId)) {
                    this.__preloader_preloadAll();
                }
            }
        },
    });
});

/**
 * Provides smooth height transitions for elements using the FLIP (First, Last, Invert, Play) technique.
 *
 * This directive animates the height of an element when a reactive boolean value changes to `true`.
 * It uses the FLIP technique to ensure smooth animations by:
 * 1. Capturing the initial (collapsed) height
 * 2. Allowing the element to expand naturally
 * 3. Capturing the final (expanded) height
 * 4. Animating from initial to final height
 *
 * ## Usage
 *
 * Apply `x-transition-height` to the element whose height should be animated, passing a boolean expression:
 *
 * ```html
 * <div x-data="{ isExpanded: false }">
 *   <div x-transition-height="isExpanded" class="overflow-hidden">
 *     <p>Content that will expand/collapse</p>
 *   </div>
 *   <button @click="isExpanded = !isExpanded">Toggle</button>
 * </div>
 * ```
 *
 * ## How it works
 *
 * When the expression evaluates to `true`:
 * 1. The directive captures the current (collapsed) height
 * 2. Uses `requestAnimationFrame` to wait for the next paint
 * 3. Captures the expanded height (after the element has naturally expanded)
 * 4. Sets the height back to the collapsed height and removes transitions
 * 5. Uses another `requestAnimationFrame` to restore the transition and set the expanded height
 * 6. The browser animates the height change smoothly
 *
 * ## Notes
 *
 * - The directive will use an existing CSS transition from computed styles if present, or default to `height 400ms ease`
 * - The directive only animates when the value changes from `false` to `true`
 * - When collapsing (from `true` to `false`), the element should handle its own collapse animation
 *   (e.g., using CSS transitions or Alpine's `x-show` with transitions)
 * - The element's transition property is temporarily removed during the FLIP animation setup
 *   and then restored to allow smooth animation
 *
 * @example Basic usage with read more/less pattern
 *
 * ```html
 * <div x-data="{ isExpanded: false }">
 *   <div
 *     x-transition-height="isExpanded"
 *     class="overflow-hidden transition-height duration-400"
 *     :class="{ 'line-clamp-3': !isExpanded }"
 *   >
 *     <p>Long content that will be truncated and expanded...</p>
 *   </div>
 *   <button @click="isExpanded = !isExpanded">
 *     <span x-show="!isExpanded">Read more</span>
 *     <span x-show="isExpanded">Read less</span>
 *   </button>
 * </div>
 * ```
 */
Alpine.directive('transition-height', ($el, { value, expression }, { Alpine, evaluate }) => {
    if (!($el instanceof HTMLElement)) {
        throw new Error(`Expected HTMLElement but got ${$el}`);
    }
    if (!expression) {
        throw new Error('x-transition-height requires an expression (e.g., x-transition-height="isExpanded")');
    }
    const initialHeight = $el.clientHeight;
    const initialTransition = $el.style.transition || 'height 300ms';
    // Use Alpine.bind to add an x-effect that will be properly scoped to the component
    Alpine.effect(() => {
        // Evaluate the expression in the component context
        // 'this' refers to the Alpine component when called from x-effect
        const isExpanded = evaluate(expression);
        if (isExpanded) {
            // Grab the collapsed height of the element
            window.requestAnimationFrame(() => {
                // Wait until right before the next paint and grab the expanded height of the element
                const finalHeight = $el.clientHeight;
                // Set the height to the collapsed height and remove the transition
                $el.style.height = `${initialHeight}px`;
                $el.style.transition = 'transform 0ms';
                // Now set the height to the expanded height and add the transition
                window.requestAnimationFrame(() => {
                    $el.style.height = `${finalHeight}px`;
                    $el.style.transition = initialTransition;
                });
            });
        }
    });
});

const headerMenuStore = new Proxy({
    prevActivePopupId: null,
    prevActivePopupType: null,
    activePopupId: null,
    popups: new Map(),
    themeEditorSelectedPopupId: null,
    get activePopup() {
        if (this.activePopupId == null)
            return null;
        return this.popups.get(this.activePopupId)?.el || null;
    },
    get activePopupType() {
        if (this.activePopupId == null)
            return null;
        return this.popups.get(this.activePopupId)?.type || null;
    },
}, {
    set(target, prop, value) {
        // Automatically track the previous active popup so that we can smoothly
        // transition between prev and next popups
        if (prop === 'activePopupId' && value !== target.activePopupId) {
            target.prevActivePopupId = target.activePopupId;
            target.prevActivePopupType = target.activePopupType;
        }
        if (prop !== 'prevActivePopupId' && prop !== 'prevActivePopupType') {
            Reflect.set(target, prop, value);
        }
        return true;
    },
});
Alpine.store('headerMenu', headerMenuStore);

const sectionsStore = {
    intersected: new Set(),
    intersecting: new Set(),
    viewing: null,
    viewed: new Set(),
    isIntersecting(id) {
        return this.intersecting?.has(id);
    },
    hasIntersected(id) {
        return this.intersected?.has(id);
    },
};
Alpine.store('sections', sectionsStore);

/**
 * Store the state of the currently active drawer
 */
Alpine.store('drawer', new Proxy({
    isOpen: false,
    type: null,
    data: null,
    prevIsOpen: false,
    prevType: null,
    prevData: null,
}, {
    set(target, prop, value, receiver) {
        if (prop === 'isOpen' && value === false) {
            target.type = null;
            target.data = null;
        }
        if (prop === 'isOpen') {
            target.prevIsOpen = target.isOpen;
        }
        if (prop === 'type') {
            target.prevType = target.type;
        }
        if (prop === 'data') {
            target.prevData = target.data;
        }
        return Reflect.set(target, prop, value, receiver);
    },
}));

/**
 * Ensemble brings together multiple elements and binds them to the same data
 *
 * e.g.
 * <div x-ensemble>
 *   <div x-ensemble:slideshow.duration.{{ section.settings.duration | times: 1000 }}ms>...</div>
 *   <div x-ensemble:accordion>...</div>
 * </div>
 */
function ensemble(Alpine) {
    Alpine.directive('ensemble', ($el, { value, modifiers }) => {
        const { $ensemble } = Alpine.$data($el);
        switch (value) {
            case 'slideshow':
                Alpine.bind($el, {
                    [`x-slideshow.${modifiers.join('.')}`]() {
                        return {
                            get currentSlideIndex() {
                                if (!$ensemble)
                                    return 0;
                                if ($ensemble.selectedIndex === null)
                                    return 0;
                                // If this is the last slide of this particular ensemble members slideshow but there are more slides in the ensemble
                                // then just show the last slide of the ensemble
                                if ($ensemble.selectedIndex >= this.totalSlides) {
                                    return this.totalSlides - 1;
                                }
                                return $ensemble.selectedIndex;
                            },
                            set currentSlideIndex(value) {
                                $ensemble.selectedIndex = value;
                            },
                            get state() {
                                if (!$ensemble)
                                    return 'paused';
                                // If this particular ensemble member's slideshow has less slides than the ensemble itself (i.e. there are other slideshows in the ensemble)
                                // then pause _this_ slideshow and let the other slideshows take over
                                if (this.totalSlides < $ensemble.totalSlides) {
                                    return 'paused';
                                }
                                return $ensemble.isPlaying ? 'playing' : 'paused';
                            },
                        };
                    },
                    'x-effect'() {
                        if (!this.$ensemble)
                            return;
                        if (this.$slideshow.totalSlides > this.$ensemble.totalSlides) {
                            this.$ensemble.totalSlides = this.$slideshow.totalSlides;
                        }
                    },
                });
                break;
            case 'disclosure-group':
                Alpine.bind($el, {
                    [`x-disclosure-group.${modifiers.join('.')}`]() {
                        return {
                            get expandedIndex() {
                                // If there is no selectedIndex for some reason, show the first disclosure
                                if ($ensemble.selectedIndex === null)
                                    return 0;
                                // If the selectedIndex doesn't match any disclosures, show the last disclosure
                                const lastDisclosureIndex = Array.from(this.items).length - 1;
                                if ($ensemble.selectedIndex > lastDisclosureIndex)
                                    return lastDisclosureIndex;
                                return $ensemble.selectedIndex;
                            },
                            set expandedIndex(value) {
                                // Only allow opening new accordion items, not closing them
                                if (Number.isNaN(value) || value === null || value < 0)
                                    return;
                                $ensemble.selectedIndex = value;
                            },
                        };
                    },
                });
                break;
            case 'tabs':
                Alpine.bind($el, {
                    [`x-tabs.${modifiers.join('.')}`]() {
                        return {
                            get selectedIndex() {
                                // If there is no selectedIndex for some reason, show the first tab
                                if ($ensemble.selectedIndex === null)
                                    return 0;
                                // If the selectedIndex doesn't match any tabs, show the last tab
                                const lastTabIndex = Array.from(this.items).length - 1;
                                if ($ensemble.selectedIndex > lastTabIndex)
                                    return lastTabIndex;
                                return $ensemble.selectedIndex;
                            },
                            set selectedIndex(value) {
                                $ensemble.selectedIndex = value;
                            },
                        };
                    },
                });
                break;
            case 'carousel':
                Alpine.bind($el, {
                    [`x-carousel.${modifiers.join('.')}`]: '',
                    ['x-init']() {
                        if (!this.$ensemble)
                            return;
                        this.$watch('$carousel.centeredIndex', (centeredIndex) => {
                            this.$ensemble.selectedIndex = centeredIndex;
                        });
                        this.$watch('$ensemble.selectedIndex', (selectedIndex) => {
                            const centeredIndex = this.$carousel.centeredIndex;
                            if (centeredIndex !== selectedIndex) {
                                this.$carousel.scrollTo(selectedIndex, { align: 'center' });
                            }
                        });
                    },
                });
                break;
            case 'hotspots':
                Alpine.bind($el, {
                    ['x-list-state']() {
                        return {
                            scope: 'hotspots',
                            get selectedIndex() {
                                if ($ensemble.selectedIndex === null) {
                                    return null;
                                }
                                return $ensemble.selectedIndex;
                            },
                            set selectedIndex(value) {
                                $ensemble.hasFocus = true;
                                if (Number.isNaN(value) || value === null || value < 0)
                                    return;
                                $ensemble.selectedIndex = value;
                            },
                        };
                    },
                });
                break;
            case null:
                const autoplay = modifiers.includes('autoplay');
                const $data = Alpine.$data($el);
                const sectionData = $data.$sectionData;
                Alpine.bind($el, {
                    ['x-data']() {
                        const $ensemble = {
                            titleEl: null,
                            // Store the current slide index in $sectionData so that we can restore it when the section is reloaded in the theme editor
                            get selectedIndex() {
                                return sectionData?.selectedIndex ?? 0;
                            },
                            set selectedIndex(value) {
                                sectionData.selectedIndex = value;
                            },
                            totalSlides: 0,
                            autoplay: autoplay,
                            hasFocus: false,
                            isInView: false,
                            get isPlaying() {
                                return this.autoplay && this.isInView && !this.hasFocus;
                            },
                            members: {},
                            registerMember(id, el) {
                                this.members[id] = el;
                            },
                            getPeerIds(id) {
                                return Object.keys(this.members).filter((memberId) => memberId !== id);
                            },
                        };
                        return {
                            $ensemble,
                        };
                    },
                    'x-intersect:enter.half': `$ensemble.isInView = true`,
                    'x-intersect:leave.half': `
            $ensemble.isInView = false
            $ensemble.hasFocus = false
          `,
                    '@focusin': '$ensemble.hasFocus = true',
                    '@pointerdown': '$ensemble.hasFocus = true',
                    ':aria-labelledby': '$ensemble.titleEl?.id || null',
                });
                if (window.Shopify?.designMode) {
                    Alpine.bind($el, {
                        'x-effect': `$ensemble.hasFocus = $isSelectedSection`,
                    });
                }
                break;
            default:
                throw new Error(`Invalid ensemble directive: ${value}`);
        }
    }).before('bind');
}
Alpine.plugin(ensemble);

function productMedia(Alpine) {
    Alpine.directive('product-media', ($el, data) => {
        switch (data.value) {
            case 'model':
                handleModel($el, Alpine);
                break;
            case 'youtube':
                handleYoutubeVideo($el, data, Alpine);
                break;
            case 'vimeo':
                handleVimeoVideo($el, data, Alpine);
                break;
        }
    }).before('bind');
}
function handleModel($el, Alpine) {
    Alpine.bind($el, {
        'x-data'() {
            return {
                state: 'initial',
                pointerStartX: 0,
                pointerStartY: 0,
                get hasLoaded() {
                    return this.state != 'initial' && this.state != 'loading';
                },
                get isLoading() {
                    return this.state == 'loading';
                },
                initModel() {
                    this.state = 'loading';
                    window.Shopify?.loadFeatures?.([
                        {
                            name: 'model-viewer-ui',
                            version: '1.0',
                            onLoad: this.setupModelViewerUI.bind(this),
                        },
                    ]);
                },
                async setupModelViewerUI(errors) {
                    if (errors) {
                        console.error('Failed to load model viewer UI:', errors);
                        this.state = 'initial';
                        return;
                    }
                    if (!window.Shopify?.ModelViewerUI) {
                        await this.waitForModelViewerUIOnSafari();
                    }
                    if (!window.Shopify?.ModelViewerUI) {
                        console.error('ModelViewerUI not available after waiting');
                        this.state = 'initial';
                        return;
                    }
                    this.state = 'ready';
                    this.$nextTick(() => {
                        const element = this.$root.querySelector('model-viewer');
                        if (!element) {
                            console.error('No model-viewer element found');
                            this.state = 'initial';
                            return;
                        }
                        try {
                            this.$el._x_modelViewer = new window.Shopify.ModelViewerUI(element);
                            if (!this.$el._x_modelViewer) {
                                console.error('Failed to create ModelViewerUI instance');
                                this.state = 'initial';
                                return;
                            }
                            this.playModel();
                            this.$dispatch('theme:model:loaded', { details: this.$el._x_modelViewer });
                        }
                        catch (error) {
                            console.error('Error initializing model viewer:', error);
                            this.state = 'initial';
                        }
                    });
                },
                playModel() {
                    if (!this.$el._x_modelViewer || this.state == 'playing')
                        return;
                    try {
                        this.$el._x_modelViewer.play();
                        this.state = 'playing';
                    }
                    catch (error) {
                        console.error('Error playing model:', error);
                    }
                },
                pauseModel() {
                    if (!this.$el._x_modelViewer || this.state == 'paused')
                        return;
                    try {
                        this.$el._x_modelViewer.pause();
                        this.state = 'paused';
                    }
                    catch (error) {
                        console.error('Error pausing model:', error);
                    }
                },
                getPointerCoordinates(event) {
                    if (!this.$el._x_modelViewer)
                        return;
                    this.pointerStartX = event.clientX;
                    this.pointerStartY = event.clientY;
                },
                togglePlayPause(event) {
                    if (!this.$el._x_modelViewer)
                        return;
                    const distanceX = Math.abs(event.clientX - this.pointerStartX);
                    const distanceY = Math.abs(event.clientY - this.pointerStartY);
                    const totalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                    // Try to ensure that this is a tap, not a drag.
                    if (totalDistance < 10) {
                        if (this.state == 'playing') {
                            this.pauseModel();
                        }
                        else {
                            this.playModel();
                        }
                    }
                },
                async waitForModelViewerUIOnSafari() {
                    // Waits for Shopify.ModelViewerUI to be defined.
                    // This seems to be necessary for Safari since Shopify.ModelViewerUI is always undefined on the first try.
                    const maxAttempts = 10;
                    const interval = 50;
                    for (let i = 0; i < maxAttempts; i++) {
                        if (window.Shopify?.ModelViewerUI) {
                            return;
                        }
                        await new Promise((resolve) => setTimeout(resolve, interval));
                    }
                },
            };
        },
    });
}
function handleYoutubeVideo($el, { modifiers, expression }, Alpine) {
    const isLazy = modifiers.includes('lazy');
    const autoplay = modifiers.includes('autoplay');
    if (typeof expression !== 'string') {
        console.warn('Invalid youtube video ID', expression);
        return;
    }
    const videoId = expression;
    Alpine.bind($el, {
        'x-data'() {
            return {
                state: 'initial',
                isLazy,
                videoId,
                autoplay,
                init() {
                    if (!this.isLazy) {
                        this.loadPlayer();
                    }
                },
                destroy() {
                    this.destroyPlayer();
                },
                loadPlayer() {
                    this.$load
                        .script('https://www.youtube.com/iframe_api')
                        .then(() => {
                        // Initialize videos when the API is ready
                        if (window.YT?.loaded) {
                            this.$dispatch('theme:youtube:init');
                        }
                        else {
                            window.onYouTubeIframeAPIReady = () => this.$dispatch('theme:youtube:init');
                        }
                    })
                        .catch((error) => {
                        console.error('Failed to load YouTube API:', error);
                    });
                },
                initVideo() {
                    // Don't initialize the video twice
                    if (this.$el._x_youtubePlayer)
                        return;
                    // Try to find the iframe or element to attach the player to
                    let el = this.$el.querySelector('[data-youtube-player]');
                    if (!el) {
                        console.warn('No element found for YouTube player');
                        return;
                    }
                    this.state = 'loading';
                    try {
                        // We store the player on the element as opposed to in alpine state because that will cause
                        // it to be wrapped in a proxy and not be able to access the original methods.
                        this.$el._x_youtubePlayer = new window.YT.Player(el, {
                            videoId: this.videoId,
                            playerVars: {
                                cc_load_policy: 1,
                                iv_load_policy: 3,
                                modestbranding: 1,
                                autoplay: this.autoplay,
                                playsinline: 1,
                                controls: 1,
                                showinfo: 0,
                                ecver: 2,
                                fs: 1,
                                rel: 0,
                            },
                            events: {
                                onReady: () => {
                                    this.state = 'ready';
                                    this.$dispatch('theme:youtube:loaded', { videoId: this.videoId });
                                },
                                onStateChange: (event) => {
                                    // Map YT states to our state
                                    const YTState = window.YT.PlayerState;
                                    switch (event.data) {
                                        case YTState.PLAYING:
                                            this.state = 'playing';
                                            break;
                                        case YTState.PAUSED:
                                            this.state = 'paused';
                                            break;
                                        case YTState.ENDED:
                                            break;
                                        case YTState.BUFFERING:
                                            this.state = 'loading';
                                            break;
                                        case YTState.CUED:
                                            this.state = 'ready';
                                            break;
                                        default:
                                            this.state = 'initial';
                                    }
                                },
                                onError: (event) => {
                                    console.error('YouTube player error:', event.data);
                                    this.state = 'initial';
                                },
                            },
                        });
                    }
                    catch (error) {
                        console.error('Error initializing YouTube player:', error);
                        this.state = 'initial';
                    }
                },
                playVideo() {
                    try {
                        if (this.$el._x_youtubePlayer && typeof this.$el._x_youtubePlayer.playVideo === 'function') {
                            this.$el._x_youtubePlayer.playVideo();
                        }
                    }
                    catch (e) {
                        console.warn('Error playing YouTube video:', e);
                    }
                },
                async pauseVideo() {
                    try {
                        if (this.$el._x_youtubePlayer && typeof this.$el._x_youtubePlayer.pauseVideo === 'function') {
                            this.$el._x_youtubePlayer.pauseVideo();
                        }
                    }
                    catch (e) {
                        console.warn('Error pausing YouTube video:', e);
                    }
                },
                // Unloads the video to its initial state showing placeholder image
                async unloadPlayer() {
                    try {
                        if (this.$el._x_youtubePlayer && typeof this.$el._x_youtubePlayer.cueVideoById === 'function') {
                            this.$el._x_youtubePlayer.cueVideoById({ videoId: this.videoId });
                            this.state = 'ready';
                        }
                    }
                    catch (e) {
                        console.warn('Error unloading YouTube player:', e);
                    }
                },
                destroyPlayer() {
                    try {
                        if (this.$el._x_youtubePlayer && typeof this.$el._x_youtubePlayer.destroy === 'function') {
                            this.$el._x_youtubePlayer.destroy();
                            this.$el._x_youtubePlayer = undefined;
                            this.state = 'initial';
                        }
                    }
                    catch (e) {
                        console.warn('Error destroying YouTube player:', e);
                        // Clean up even if destroy fails
                        this.$el._x_youtubePlayer = undefined;
                        this.state = 'initial';
                    }
                },
            };
        },
        // Wait for any youtube:init from any component to initialize the video
        '@theme:youtube:init.window': 'initVideo',
    });
}
function handleVimeoVideo($el, { modifiers, expression }, Alpine) {
    const isLazy = modifiers.includes('lazy');
    const autoplay = modifiers.includes('autoplay');
    if (typeof expression !== 'string') {
        console.warn('Invalid vimeo video ID', expression);
        return;
    }
    const videoId = Number(expression);
    if (isNaN(videoId)) {
        console.warn('Invalid vimeo video ID', expression);
        return;
    }
    Alpine.bind($el, {
        'x-data'() {
            return {
                state: 'initial',
                isLazy,
                autoplay,
                videoId,
                init() {
                    if (!this.isLazy) {
                        this.loadPlayer();
                    }
                },
                destroy() {
                    this.destroyPlayer();
                },
                loadPlayer() {
                    this.$load
                        .script('https://player.vimeo.com/api/player.js')
                        .then(() => {
                        this.$dispatch('theme:vimeo:init');
                    })
                        .catch((error) => {
                        console.error('Failed to load Vimeo API:', error);
                    });
                },
                initVideo() {
                    // Don't initialize the video twice
                    if (this.$el._x_vimeoPlayer)
                        return;
                    // Try to find the iframe or element to attach the player to
                    let el = this.$el.querySelector('[data-vimeo-player]');
                    if (!el) {
                        console.warn('No element found for Vimeo player');
                        return;
                    }
                    if (!window.Vimeo)
                        return;
                    this.state = 'loading';
                    try {
                        // We store the player on the element as opposed to in alpine state because that will cause
                        // it to be wrapped in a proxy and not be able to access the original methods.
                        this.$el._x_vimeoPlayer = new window.Vimeo.Player(el, {
                            id: this.videoId,
                            autoplay: this.autoplay,
                            loop: false,
                            controls: true,
                            muted: false,
                            playsinline: true,
                        });
                        const events = ['play', 'pause', 'ended', 'loaded'];
                        events.forEach((event) => {
                            this.$el._x_vimeoPlayer?.on(event, () => {
                                switch (event) {
                                    case 'play':
                                        this.state = 'playing';
                                        break;
                                    case 'pause':
                                        this.state = 'paused';
                                        break;
                                    case 'loaded':
                                        this.state = 'ready';
                                        break;
                                    default:
                                        this.state = event;
                                        break;
                                }
                            });
                        });
                        this.$dispatch('theme:vimeo:loaded', { videoId: this.videoId });
                    }
                    catch (error) {
                        console.error('Error initializing Vimeo player:', error);
                        this.state = 'initial';
                    }
                },
                playVideo() {
                    if (this.$el._x_vimeoPlayer?.play) {
                        // Only play if the video is paused
                        this.$el._x_vimeoPlayer
                            .getPaused()
                            .then((paused) => {
                            if (paused) {
                                this.$el._x_vimeoPlayer?.play().catch((error) => {
                                    console.error('Error playing Vimeo video:', error);
                                });
                            }
                        })
                            .catch((error) => {
                            console.error('Error checking Vimeo player state:', error);
                        });
                    }
                },
                async pauseVideo() {
                    try {
                        const paused = await this.$el._x_vimeoPlayer?.getPaused();
                        if (!paused && this.$el._x_vimeoPlayer?.pause) {
                            await this.$el._x_vimeoPlayer.pause();
                        }
                    }
                    catch (error) {
                        console.error('Error pausing Vimeo video:', error);
                    }
                },
                // Unloads the video to its initial state showing placeholder image
                async unloadPlayer() {
                    try {
                        await this.pauseVideo();
                        await this.$el._x_vimeoPlayer?.setCurrentTime(0);
                        await this.$el._x_vimeoPlayer?.unload();
                        this.state = 'ready';
                    }
                    catch (error) {
                        console.error('Error unloading Vimeo player:', error);
                    }
                },
                destroyPlayer() {
                    try {
                        if (this.$el._x_vimeoPlayer?.destroy) {
                            this.$el._x_vimeoPlayer.destroy().catch((error) => {
                                console.error('Error destroying Vimeo player:', error);
                            });
                        }
                    }
                    catch (e) {
                        console.warn('Error destroying Vimeo player:', e);
                    }
                    finally {
                        // Clean up even if destroy fails
                        this.$el._x_vimeoPlayer = undefined;
                        this.state = 'initial';
                    }
                },
            };
        },
        // Wait for any theme:vimeo:init from any component to initialize the video
        '@theme:vimeo:init.window': 'initVideo',
    });
}
Alpine.plugin(productMedia);

function productCard(Alpine) {
    Alpine.directive('product-card', ($el, data) => {
        if (data.value === 'quick-add') {
            handleQuickAdd($el, Alpine);
        }
        else if (data.value === 'quick-add-button') {
            handleQuickAddButton($el, Alpine);
        }
        else if (data.value === 'quick-add-menu') {
            handleQuickAddMenu($el, Alpine);
        }
        else if (data.value === 'quick-actions') {
            handleQuickActions($el, Alpine);
        }
        else if (data.value === 'media') {
            handleMedia($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot($el, Alpine);
        }
        else {
            throw new Error(`Unknown directive: x-product-card:${data.value}`);
        }
    });
    Alpine.magic('productCard', ($el) => {
        const $data = Alpine.$data($el);
        return {
            get isActive() {
                return $data.__productCard_isActive;
            },
            get wasActive() {
                return $data.__productCard_wasActive;
            },
            get isHovering() {
                return $data.__productCard_isHovering;
            },
            get isHoveringMedia() {
                return $data.__productCard_isHoveringMedia;
            },
            get isQuickAddMenuActive() {
                return $data.__productCard_isQuickAddMenuActive;
            },
            set isQuickAddMenuActive(value) {
                $data.__productCard_isQuickAddMenuActive = value;
            },
            get isQuickAddMenuVisible() {
                return $data.__productCard_isQuickAddMenuVisible;
            },
            get canLoadMedia() {
                return $data.__productCard_canLoadMedia;
            },
        };
    });
}
function handleRoot($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __productCard_isHovering: false,
                __productCard_isHoveringMedia: false,
                __productCard_hasFocusWithin: false,
                __productCard_wasActive: false,
                __productCard_isQuickAddMenuActive: false,
                __productCard_rootEl: null,
                __productCard_quickAddButtonEl: null,
                __productCard_quickAddMenuEl: null,
                __productCard_quickAddContainerEl: null,
                __productCard_quickAddMenuAbortController: null,
                __productCard_leaveObserver: null,
                __productCard_canLoadMedia: false,
                get __productCard_isActive() {
                    return this.__productCard_isHovering || this.__productCard_hasFocusWithin;
                },
                get __productCard_isQuickAddMenuVisible() {
                    // Keep the menu open if the form is submitting so the user can see the loading or error indicator
                    if (this.$productForm?.state !== 'idle') {
                        return true;
                    }
                    return this.__productCard_isQuickAddMenuActive;
                },
                init() {
                    this.__productCard_rootEl = $el;
                    this.$watch('__productCard_isActive', (isActive, wasActive) => {
                        // Close quick add menu when the card is no longer active
                        if (wasActive && !isActive) {
                            this.__productCard_isQuickAddMenuActive = false;
                        }
                        this.__productCard_wasActive = wasActive;
                    });
                    // Hide quick add menu when the form is submitted and the product is added to the cart
                    this.$watch('$productForm.state', (state, prevState) => {
                        if (state === 'idle' && prevState === 'success') {
                            this.__productCard_isQuickAddMenuActive = false;
                        }
                    });
                    this.$watch('__productCard_isQuickAddMenuActive', (isQuickAddMenuActive, wasQuickAddActive) => {
                        if (!wasQuickAddActive && isQuickAddMenuActive) {
                            this.__productCard_setupQuickAddMenuHandlers();
                        }
                        else if (wasQuickAddActive && !isQuickAddMenuActive) {
                            this.__productCard_teardownQuickAddMenuHandlers();
                        }
                    });
                },
                __productCard_setupQuickAddMenuHandlers() {
                    this.__productCard_quickAddMenuAbortController = new AbortController();
                    const signal = this.__productCard_quickAddMenuAbortController.signal;
                    const menuEl = this.__productCard_quickAddMenuEl;
                    // Close when card leaves viewport (one-off, then disconnect)
                    const leaveObserver = new IntersectionObserver((entries) => {
                        const entry = entries[0];
                        if (entry && !entry.isIntersecting) {
                            this.__productCard_isQuickAddMenuActive = false;
                            this.__productCard_leaveObserver?.disconnect();
                            this.__productCard_leaveObserver = null;
                        }
                    }, { threshold: 0, rootMargin: '0px' });
                    this.__productCard_leaveObserver = leaveObserver;
                    leaveObserver.observe(this.__productCard_rootEl);
                    // Close when mouse leaves menu
                    if (menuEl) {
                        menuEl.addEventListener('mouseleave', () => {
                            this.__productCard_isQuickAddMenuActive = false;
                        }, { once: true, signal });
                    }
                    // Close when click is outside menu and button
                    document.addEventListener('click', (event) => {
                        const target = event.target;
                        const buttonEl = this.__productCard_quickAddButtonEl;
                        if (menuEl && buttonEl && !menuEl.contains(target) && !buttonEl.contains(target)) {
                            this.__productCard_isQuickAddMenuActive = false;
                        }
                    }, { signal, capture: true });
                },
                __productCard_teardownQuickAddMenuHandlers() {
                    this.__productCard_leaveObserver?.disconnect();
                    this.__productCard_leaveObserver = null;
                    this.__productCard_quickAddMenuAbortController?.abort();
                    this.__productCard_quickAddMenuAbortController = null;
                },
                destroy() {
                    this.__productCard_teardownQuickAddMenuHandlers();
                },
            };
        },
        'x-focusin-state': `__productCard_hasFocusWithin = $hasFocusIn`,
        'x-hover:start.delay.150ms': `__productCard_isHovering = true`,
        'x-hover:end.delay.200ms': `__productCard_isHovering = false`,
        '@touchstart.once.passive': '__productCard_canLoadMedia = true',
        '@focusin.once': '__productCard_canLoadMedia = true',
        '@pointerenter.once': '__productCard_canLoadMedia = true',
    });
}
function handleMedia($el, Alpine) {
    Alpine.bind($el, {
        'x-hover:start.delay.150ms': `__productCard_isHoveringMedia = true`,
        'x-hover:end.delay.200ms': `__productCard_isHoveringMedia = false`,
    });
}
function handleQuickActions($el, Alpine) {
    Alpine.bind($el, {
        'x-section-api': 'api-card-product-lg-quick-actions',
        ':aria-busy': '$sectionApi.state === "loading"',
        'x-data'() {
            return {
                init() {
                    this.$watch('productCardUrl', (newProductCardUrl, oldProductCardUrl) => {
                        if (newProductCardUrl === oldProductCardUrl || !oldProductCardUrl || !newProductCardUrl)
                            return;
                        this.$sectionApi.update({
                            baseUrl: newProductCardUrl,
                            cachePolicy: 'cache-first',
                            abortPending: false,
                            htmlMode: 'replace',
                        });
                    });
                },
            };
        },
    });
}
function handleQuickAdd($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            // Store reference to quick add container element in root product card component
            this.$data.__productCard_quickAddContainerEl = $el;
        },
    });
}
function handleQuickAddButton($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            this.$data.__productCard_quickAddButtonEl = $el;
        },
        '@click': '$productCard.isQuickAddMenuActive = !$productCard.isQuickAddMenuActive',
        'x-hover:start.delay.50ms': '$productCard.isQuickAddMenuActive = true',
    });
}
function handleQuickAddMenu($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            // Store menu element on root so root can attach mouseleave and click-outside when menu opens
            this.$data.__productCard_quickAddMenuEl = $el;
        },
    });
}
Alpine.plugin(productCard);

/**
 * Returns the track index for a given value.
 */
function getIndexForValue(val, min, step, valuesLength) {
    const idx = Math.round((val - min) / step);
    return Math.max(0, Math.min(idx, valuesLength - 1));
}
/**
 * Returns the translateY target (px) for a given track index.
 */
function getTargetY(index, lineHeight) {
    return -(index * lineHeight);
}
/**
 * Returns the current numeric value from an input, or min if empty/invalid.
 */
function getCurrentValue(input, min) {
    const val = input.value;
    return val === '' || val === null || val === undefined ? min : Number(val);
}
/**
 * Generates an array of values from min to max (inclusive) by step.
 * Handles floating-point safely.
 */
function generateTrackValues(min, max, step) {
    const values = [];
    const epsilon = Math.abs(step) * 1e-10;
    const maxValues = 1000;
    for (let i = 0;; i++) {
        if (values.length >= maxValues)
            break;
        const v = min + i * step;
        if (v > max + epsilon)
            break;
        values.push(Number(v.toPrecision(15)));
    }
    return values;
}
function animatedPicker(Alpine) {
    Alpine.directive('animated-picker', ($el, data) => {
        if (data.value === 'track') {
            // Track: overlay that shows the sliding values during animation. Hidden by default,
            // only visible while animating to avoid displaying invalid/stale values.
            Alpine.bind($el, {
                'x-init'() {
                    this.__animatedPicker_trackEl = $el;
                },
                'x-show'() {
                    return this.__animatedPicker_trackVisible;
                },
                'x-html'() {
                    return this.__animatedPicker_trackValues?.join('\n');
                },
            });
        }
        else if (data.value === 'input') {
            Alpine.bind($el, {
                'x-init'() {
                    this.__animatedPicker_inputEl = $el;
                },
            });
        }
        else if (data.value === null) {
            // Root: x-data component with picker state and methods.
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        __animatedPicker_rootEl: $el,
                        __animatedPicker_trackEl: null,
                        __animatedPicker_inputEl: null,
                        __animatedPicker_trackValues: [],
                        __animatedPicker_motionY: motionValue(0),
                        __animatedPicker_trackVisible: false,
                        __animatedPicker_animationControls: null,
                        __animatedPicker_syncTrack() {
                            const input = this.__animatedPicker_inputEl;
                            if (!input)
                                return;
                            const min = input.min !== undefined ? Number(input.min) : 0;
                            const max = input.max !== undefined ? Number(input.max) : min + 10;
                            const step = Number(input.step) || 1;
                            this.__animatedPicker_trackValues = generateTrackValues(min, max, step);
                        },
                        /**
                         * Update track position. Supports 3 signatures:
                         * - updatePosition(callback): read from input, run callback (await if returns Promise), read to from input, animate
                         * - updatePosition(fromValue, callback): use fromValue, run callback (await if returns Promise), read to from input, animate
                         * - updatePosition(fromValue, toValue): animate from→to directly
                         * - updatePosition(): set position to current input value (no animation)
                         */
                        async __animatedPicker_updatePosition(a, b) {
                            const input = this.__animatedPicker_inputEl;
                            const track = this.__animatedPicker_trackEl;
                            // Make sure this is always set to false before updating the position
                            this.__animatedPicker_trackVisible = false;
                            if (!input || !track)
                                return;
                            this.__animatedPicker_syncTrack();
                            if (this.__animatedPicker_trackValues.length === 0)
                                return;
                            const min = Number(input.min) || 0;
                            const step = Number(input.step) || 1;
                            const lineHeight = parseFloat(getComputedStyle(track).lineHeight) || 24;
                            const values = this.__animatedPicker_trackValues;
                            let fromValue;
                            let toValue;
                            if (typeof a === 'function') {
                                fromValue = getCurrentValue(input, min);
                                const result = a();
                                if (result && typeof result.then === 'function') {
                                    await result;
                                }
                                toValue = getCurrentValue(input, min);
                            }
                            else if (typeof a === 'number' && typeof b === 'function') {
                                fromValue = a;
                                const result = b();
                                if (result && typeof result.then === 'function') {
                                    await result;
                                }
                                toValue = getCurrentValue(input, min);
                            }
                            else if (typeof a === 'number' && typeof b === 'number') {
                                fromValue = a;
                                toValue = b;
                            }
                            else {
                                const value = getCurrentValue(input, min);
                                const index = getIndexForValue(value, min, step, values.length);
                                const targetY = getTargetY(index, lineHeight);
                                this.__animatedPicker_motionY.set(targetY);
                                return;
                            }
                            if (fromValue === toValue)
                                return;
                            const fromIndex = getIndexForValue(fromValue, min, step, values.length);
                            const toIndex = getIndexForValue(toValue, min, step, values.length);
                            const fromY = getTargetY(fromIndex, lineHeight);
                            const toY = getTargetY(toIndex, lineHeight);
                            if (fromY === toY)
                                return;
                            const existing = this.__animatedPicker_animationControls;
                            if (existing?.stop) {
                                existing.stop();
                                this.__animatedPicker_animationControls = null;
                            }
                            this.__animatedPicker_motionY.set(fromY);
                            track.style.transform = `translateY(${fromY}px)`;
                            this.__animatedPicker_trackVisible = true;
                            const duration = 0.3;
                            const controls = animate(this.__animatedPicker_motionY, toY, {
                                duration,
                            });
                            this.__animatedPicker_animationControls = controls;
                            const finished = controls.finished;
                            if (finished) {
                                finished
                                    .then(() => {
                                    this.__animatedPicker_animationControls = null;
                                    this.__animatedPicker_trackVisible = false;
                                })
                                    .catch(() => {
                                    this.__animatedPicker_trackVisible = false;
                                });
                            }
                            else {
                                setTimeout(() => {
                                    this.__animatedPicker_animationControls = null;
                                    this.__animatedPicker_trackVisible = false;
                                }, duration * 1000);
                            }
                        },
                        async init() {
                            await Alpine.nextTick();
                            const input = this.__animatedPicker_inputEl;
                            const track = this.__animatedPicker_trackEl;
                            if (!input || !track)
                                return;
                            styleEffect(track, {
                                transform: transformValue(() => `translateY(${this.__animatedPicker_motionY.get()}px)`),
                            });
                            this.__animatedPicker_updatePosition();
                        },
                    };
                },
            });
        }
        else {
            throw new Error(`Unknown directive: x-animated-picker:${data.value}`);
        }
    });
    Alpine.magic('animatedPicker', ($el) => {
        const $data = Alpine.$data($el);
        return {
            updatePosition(a, b) {
                $data.__animatedPicker_updatePosition(a, b);
            },
        };
    });
}
Alpine.plugin(animatedPicker);

/**
 * Root margin for the middle area observer.
 * Creates a viewport that excludes the top and bottom 30%, effectively
 * tracking when sections enter the middle 40% of the viewport.
 */
const MIDDLE_AREA_MARGIN = '-30% 0% -30% 0%';
/**
 * Root margin for the fully visible observer.
 * No margin means the entire viewport is used as the intersection root.
 */
const FULLY_VISIBLE_MARGIN = '0% 0% 0% 0%';
/**
 * Threshold for the fully visible observer.
 * A value of 1.0 means the entire section must be visible in the viewport.
 */
const FULLY_VISIBLE_THRESHOLD = 1.0;
/**
 * Threshold for the "any visible" observer.
 * A value of 0.01 means any part of the section in the viewport counts.
 */
const ANY_VISIBLE_THRESHOLD = 0.01;
const SECTION_ID_PREFIX = 'shopify-section-';
/** Debounce delay (ms) after last scroll event before treating user as "idle". */
const SCROLL_END_DELAY_MS = 150;
/**
 * Manages IntersectionObserver instances for section tracking.
 *
 * Uses three observers: any-visible (threshold 0), middle 40% of viewport, and
 * fully visible (threshold 1). When the user is scrolling, a section counts as
 * intersecting only if it is in the middle area or fully visible. When the user
 * is idle (not scrolling), any partially visible section counts as intersecting.
 * On scroll end, partially visible sections are re-evaluated and given enter
 * state so content is never blank. Leave only fires when the section is fully
 * off screen.
 */
class IntersectionObserverManager {
    observers = new Map();
    sections = new Map();
    isScrolling = false;
    /**
     * Gets or creates an IntersectionObserver with the given configuration.
     *
     * Observers are cached by their configuration key to avoid creating duplicate
     * observers for the same rootMargin and threshold combination.
     *
     * @param config - The observer configuration
     * @returns An IntersectionObserver instance
     */
    getObserver(config) {
        const key = `${config.rootMargin}:${config.threshold}`;
        if (!this.observers.has(key)) {
            this.observers.set(key, new IntersectionObserver((entries) => this.handleIntersection(entries, config), {
                rootMargin: config.rootMargin,
                threshold: config.threshold,
            }));
        }
        return this.observers.get(key);
    }
    /**
     * Handles intersection observer callbacks and updates section state.
     *
     * This method processes intersection entries from both observers (middle area
     * and fully visible) and determines the overall intersection state. A section
     * is considered intersecting if either:
     * - Any part crosses into the middle 40% of the viewport, OR
     * - The entire section is fully visible in the viewport
     *
     * When a section's intersection state changes, it updates the Alpine store and
     * dispatches custom events (`theme:section:enter` and `theme:section:leave`).
     *
     * @param entries - Array of intersection observer entries
     * @param config - The observer configuration that generated these entries
     */
    handleIntersection(entries, config) {
        const store = Alpine.store('sections');
        for (const entry of entries) {
            const sectionEntry = this.sections.get(entry.target);
            if (!sectionEntry)
                continue;
            const { sectionId } = sectionEntry;
            const isIntersecting = entry.isIntersecting;
            const wasIntersecting = store.intersecting.has(sectionId);
            if (config.rootMargin === MIDDLE_AREA_MARGIN) {
                sectionEntry.middleAreaIntersecting = isIntersecting;
            }
            else if (config.rootMargin === FULLY_VISIBLE_MARGIN && config.threshold === FULLY_VISIBLE_THRESHOLD) {
                sectionEntry.fullyVisibleIntersecting = isIntersecting;
            }
            else if (config.rootMargin === FULLY_VISIBLE_MARGIN && config.threshold === ANY_VISIBLE_THRESHOLD) {
                sectionEntry.anyVisibleIntersecting = isIntersecting;
            }
            // When scrolling: only middle 40% or fully visible counts. When idle: any visible counts.
            // Once intersecting, stay intersecting until the section is fully off screen.
            const isNowIntersecting = sectionEntry.anyVisibleIntersecting &&
                (wasIntersecting ||
                    !this.isScrolling ||
                    sectionEntry.middleAreaIntersecting ||
                    sectionEntry.fullyVisibleIntersecting);
            if (isNowIntersecting && !wasIntersecting) {
                this.applyEnter(sectionEntry, entry.target);
            }
            else if (!isNowIntersecting && wasIntersecting) {
                store.intersecting.delete(sectionId);
                entry.target.dispatchEvent(new CustomEvent('theme:section:leave', {
                    detail: { sectionId },
                    bubbles: true,
                    composed: true,
                    cancelable: true,
                }));
                entry.target.setAttribute('data-is-intersecting', 'false');
            }
            else if (window.Shopify?.designMode && isNowIntersecting && wasIntersecting) {
                entry.target.setAttribute('data-is-intersecting', 'true');
                entry.target.setAttribute('data-has-intersected', 'true');
                sectionEntry.hasIntersected = true;
            }
        }
    }
    /**
     * Applies "enter" state: add to store, dispatch event, set attributes.
     * Used by handleIntersection and applyIdlePass.
     */
    applyEnter(sectionEntry, element) {
        const store = Alpine.store('sections');
        const { sectionId } = sectionEntry;
        store.intersecting.add(sectionId);
        element.dispatchEvent(new CustomEvent('theme:section:enter', {
            detail: { sectionId },
            bubbles: true,
            composed: true,
            cancelable: true,
        }));
        element.setAttribute('data-is-intersecting', 'true');
        if (!sectionEntry.hasIntersected) {
            sectionEntry.hasIntersected = true;
            store.intersected.add(sectionId);
            element.setAttribute('data-has-intersected', 'true');
        }
    }
    /**
     * Called when scroll ends (user idle). Sections that are any-visible but were
     * not considered intersecting during scroll now become intersecting.
     */
    onScrollEnd() {
        const store = Alpine.store('sections');
        for (const sectionEntry of this.sections.values()) {
            if (sectionEntry.anyVisibleIntersecting && !store.intersecting.has(sectionEntry.sectionId)) {
                this.applyEnter(sectionEntry, sectionEntry.element);
            }
        }
    }
    /**
     * Updates scroll state. When set to false, onScrollEnd() is called so
     * partially visible sections become intersecting.
     */
    setScrolling(scrolling) {
        this.isScrolling = scrolling;
        if (!scrolling) {
            this.onScrollEnd();
        }
    }
    /**
     * Starts observing a section element for intersection changes.
     *
     * Sets up three IntersectionObserver instances: any-visible (any part in viewport),
     * middle 40% of viewport, and fully visible. Intersection is determined by scroll
     * state (see class JSDoc).
     *
     * @param element - The section element to observe
     * @param sectionId - The unique identifier for this section
     *
     * @example
     * ```typescript
     * manager.observe(document.querySelector('#section-1'), 'section-1');
     * ```
     */
    observe(element, sectionId) {
        if (this.sections.has(element))
            return;
        const entry = {
            element,
            sectionId,
            hasIntersected: false,
            hasBeenViewed: false,
            anyVisibleIntersecting: false,
            middleAreaIntersecting: false,
            fullyVisibleIntersecting: false,
        };
        this.sections.set(element, entry);
        // Any-visible observer (any part of section in viewport)
        const anyVisibleObserver = this.getObserver({
            rootMargin: FULLY_VISIBLE_MARGIN,
            threshold: ANY_VISIBLE_THRESHOLD,
        });
        anyVisibleObserver.observe(element);
        // Middle area observer (any part crosses into middle 40% of viewport)
        const middleAreaObserver = this.getObserver({
            rootMargin: MIDDLE_AREA_MARGIN,
            threshold: 0.0,
        });
        middleAreaObserver.observe(element);
        // Fully visible observer (entire section visible in viewport)
        const fullyVisibleObserver = this.getObserver({
            rootMargin: FULLY_VISIBLE_MARGIN,
            threshold: FULLY_VISIBLE_THRESHOLD,
        });
        fullyVisibleObserver.observe(element);
    }
    /**
     * Stops observing a section element.
     *
     * Removes the element from all observers and cleans up internal tracking data.
     * This should be called when a section is removed from the DOM to prevent
     * memory leaks.
     *
     * @param element - The section element to stop observing
     */
    unobserve(element) {
        if (!this.sections.has(element))
            return;
        // Unobserve from all observers
        for (const observer of this.observers.values()) {
            observer.unobserve(element);
        }
        this.sections.delete(element);
    }
    /**
     * Disconnects all observers and clears all tracking data.
     *
     * This method is called on page unload to clean up resources. All observers
     * are disconnected and internal maps are cleared.
     */
    disconnect() {
        for (const observer of this.observers.values()) {
            observer.disconnect();
        }
        this.observers.clear();
        this.sections.clear();
    }
}
function getSectionId(element) {
    const id = element.id;
    if (!id || !id.startsWith(SECTION_ID_PREFIX))
        return null;
    return id.slice(SECTION_ID_PREFIX.length) || null;
}
function sectionIntersectionManager(Alpine) {
    document.addEventListener('DOMContentLoaded', () => {
        const manager = new IntersectionObserverManager();
        let scrollEndTimer = null;
        function observeSection(element) {
            const sectionId = getSectionId(element);
            if (sectionId) {
                manager.observe(element, sectionId);
            }
        }
        window.addEventListener('scroll', () => {
            manager.setScrolling(true);
            if (scrollEndTimer !== null)
                clearTimeout(scrollEndTimer);
            scrollEndTimer = setTimeout(() => {
                scrollEndTimer = null;
                manager.setScrolling(false);
            }, SCROLL_END_DELAY_MS);
        }, { passive: true });
        // Register all existing .shopify-section with the intersection manager
        document.querySelectorAll('.shopify-section').forEach(observeSection);
        // Watch for sections added/removed (e.g. theme editor) and observe/unobserve
        const mutationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof Element && node.classList.contains('shopify-section')) {
                        observeSection(node);
                    }
                });
                mutation.removedNodes.forEach((node) => {
                    if (node instanceof HTMLElement && node.classList.contains('shopify-section')) {
                        manager.unobserve(node);
                    }
                });
            }
        });
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}
Alpine.plugin(sectionIntersectionManager);

const ACTIVE_LAYOUT_ID = 'active-megamenu';
function megamenu(Alpine) {
    Alpine.directive('megamenu', async ($el, _data) => {
        const loadAnimate = async () => (await import('motion')).animate;
        const loadAnimateLayout = async () => (await import('motion-plus/animate-layout')).unstable_animateLayout;
        Alpine.bind($el, {
            'x-data'() {
                return {
                    currentAnimations: [],
                    stopCurrentAnimations() {
                        this.currentAnimations.forEach((a) => a.stop?.());
                        this.currentAnimations = [];
                    },
                    getActivePanel() {
                        return $el.querySelector(`[data-layout-id="${ACTIVE_LAYOUT_ID}"]`);
                    },
                    showPanel(el) {
                        if (!el.isConnected)
                            return;
                        el.hidden = false;
                        el.showPopover();
                    },
                    hidePanel(el) {
                        if (!el.isConnected)
                            return;
                        el.hidden = true;
                        el.removeAttribute('data-layout-id');
                        el.hidePopover();
                    },
                    unsetActivePanel(el) {
                        el.removeAttribute('data-layout-id');
                    },
                    setActivePanel(el) {
                        el.setAttribute('data-layout-id', ACTIVE_LAYOUT_ID);
                    },
                    async transitionMegaMenu(previousEl, nextEl) {
                        const animateLayout = await loadAnimateLayout();
                        const animate = await loadAnimate();
                        if (nextEl.firstElementChild)
                            nextEl.firstElementChild.style.opacity = '0';
                        const prevFade = animate(previousEl.firstElementChild, { opacity: [1, 0] }, { duration: 0.2 });
                        if (prevFade && typeof prevFade === 'object')
                            this.currentAnimations.push(prevFade);
                        const megaMenus = $el.querySelectorAll('mega-menu');
                        const layoutAnim = animateLayout(megaMenus, () => {
                            // Always apply DOM update synchronously so next panel is shown regardless of
                            // animateLayout callback timing (avoids race where prev hides but next never shows).
                            this.hidePanel(previousEl);
                            this.showPanel(nextEl);
                            this.setActivePanel(nextEl);
                        }, { duration: 0.2 });
                        if (layoutAnim && typeof layoutAnim === 'object')
                            this.currentAnimations.push(layoutAnim);
                        const nextFade = animate(nextEl.firstElementChild, { opacity: [0, 1] }, { delay: 0.3, duration: 0.2 });
                        if (nextFade && typeof nextFade === 'object')
                            this.currentAnimations.push(nextFade);
                        await nextFade;
                        if (nextEl.firstElementChild)
                            nextEl.firstElementChild.style.opacity = '1';
                    },
                    async openMegaMenu(nextEl) {
                        nextEl.style.opacity = '0';
                        if (nextEl.firstElementChild)
                            nextEl.firstElementChild.style.opacity = '0';
                        this.showPanel(nextEl);
                        this.setActivePanel(nextEl);
                        const animate = await loadAnimate();
                        const anim = animate([
                            [nextEl, { opacity: [0, 1] }, { duration: 0.2 }],
                            [nextEl.firstElementChild, { y: [-5, 0], opacity: [0, 1] }, { duration: 0.3 }],
                        ]);
                        if (anim && typeof anim === 'object')
                            this.currentAnimations.push(anim);
                    },
                    async closeMegaMenu(previousEl) {
                        const animate = await loadAnimate();
                        this.unsetActivePanel(previousEl);
                        const anim = animate([
                            [previousEl.firstElementChild, { y: [0, -5], opacity: [1, 0] }, { duration: 0.2 }],
                            [previousEl, { opacity: [1, 0] }, { duration: 0.2 }],
                        ]);
                        if (anim && typeof anim === 'object')
                            this.currentAnimations.push(anim);
                        await anim;
                        this.hidePanel(previousEl);
                    },
                    async toggleMegaMenu(nextEl) {
                        this.stopCurrentAnimations();
                        const previousEl = this.getActivePanel();
                        if (previousEl && nextEl && nextEl !== previousEl) {
                            await this.transitionMegaMenu(previousEl, nextEl);
                        }
                        else if (!previousEl && nextEl) {
                            await this.openMegaMenu(nextEl);
                        }
                        else if (previousEl && !nextEl) {
                            await this.closeMegaMenu(previousEl);
                        }
                    },
                };
            },
        });
    }).before('bind');
}
Alpine.plugin(megamenu);

/* Method UI plugins */
Alpine.plugin([
    module_default$5,
    module_default$4,
    module_default$3,
    module_default$2,
    module_default$1,
    module_default,
    rovingTab,
    focusMatch,
    parallax,
    popup,
    float,
    overflow,
    hold,
    tabs,
    listbox,
    select,
    scrollList,
    carousel,
    animationUtils,
    range,
    disclosure,
    dialog,
    section,
    cache,
    asyncLink,
    asyncForm,
    slideshow,
    notification,
    productForm,
    imageLoadingPlaceholder,
    tooltip,
    stepper,
    motion,
    marquee,
    hover,
    focusState,
    focusInState,
    clone,
    submittableTextarea,
    predictiveSearch,
    scrollLock,
    countdown,
    currency,
    customCursor,
    listState,
    popover,
    sliderReveal,
    clipboard,
    keyboardActive,
    utils,
    stickyScroll,
    pan,
    cartForm,
    cartItem,
    pageLayout,
    sectionRelated,
    press,
    photoSwipe({
        pswpModule: () => import('photoswipe'),
        // Plugin requires a container element to be present in the DOM preferably at the end of the body tag
        appendToEl: document.querySelector('[data-photoswipe-container]') || undefined,
    }),
]);
Alpine.plugin(sectionApi({
    morphConfig: {
        // Customize theme-wide section morphing behaviour here
        updating(el, toEl, childrenOnly, skip) {
            // Call `skip()` to prevent an element from being removed
            // Call `childrenOnly()` to prevent an element from being updated but allow it's children to be updated
            // Skip any built-in shopify elements
            if (isShopifyElement(el)) {
                skip();
            }
            // Skip updating app blocks to prevent breaking apps like Recharge. You may want to update or remove this logic depending on your theme's needs
            if (isShopifyAppBlock(el)) {
                skip();
            }
        },
        removing(el, skip) {
            // Call `skip()` to prevent an element from being removed
            if (isShopifyElement(el)) {
                skip();
            }
            if (isShopifyAppBlock(el)) {
                skip();
            }
        },
    },
}));
// TODO check if we actually use this for anything anymore and if not then remove it
Alpine.store('cache').addResource('products');
Alpine.store('cache').addResource('models');
Alpine.plugin(
// These breakpoints should match the CSS breakpoint values
media({
    sm: `(max-width: ${window.theme.screen.md - 1}px)`,
    md: `(min-width: ${window.theme.screen.md}px) and (max-width: ${window.theme.screen.lg - 1}px)`,
    lg: `(min-width: ${window.theme.screen.lg}px) and (max-width: ${window.theme.screen.xl - 1}px)`,
    xl: `(min-width: ${window.theme.screen.xl}px) and (max-width: ${window.theme.screen['2xl'] - 1}px)`,
    '2xl': `(min-width: ${window.theme.screen['2xl']}px)`,
    touch: '(pointer: coarse) and (hover: none)',
}));
// Allow global access to Alpine in case things like Alpine.bind or Alpine.store are needed
window.Alpine = Alpine;
// Wait until DOM has loaded before starting Alpine so that any script tags that add plugins, data, stores, etc. have all run
document.addEventListener('DOMContentLoaded', async () => {
    // Reduce the risk of blocking the main thread by yielding to the main thread after the DOM has loaded before starting Alpine
    requestIdleCallback(() => {
        Alpine.start();
    });
});
