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
//#region ../node_modules/alpinejs/dist/module.esm.js
var flushPending = false;
var flushing = false;
var queue = [];
var lastFlushedIndex = -1;
var transactionActive = false;
function scheduler(callback) {
	queueJob(callback);
}
function startTransaction() {
	transactionActive = true;
}
function commitTransaction() {
	transactionActive = false;
	queueFlush();
}
function queueJob(job) {
	if (!queue.includes(job)) queue.push(job);
	queueFlush();
}
function dequeueJob(job) {
	let index = queue.indexOf(job);
	if (index !== -1 && index > lastFlushedIndex) queue.splice(index, 1);
}
function queueFlush() {
	if (!flushing && !flushPending) {
		if (transactionActive) return;
		flushPending = true;
		queueMicrotask(flushJobs);
	}
}
function flushJobs() {
	flushPending = false;
	flushing = true;
	for (let i = 0; i < queue.length; i++) {
		queue[i]();
		lastFlushedIndex = i;
	}
	queue.length = 0;
	lastFlushedIndex = -1;
	flushing = false;
}
var reactive;
var effect;
var release;
var raw;
var shouldSchedule = true;
function disableEffectScheduling(callback) {
	shouldSchedule = false;
	callback();
	shouldSchedule = true;
}
function setReactivityEngine(engine) {
	reactive = engine.reactive;
	release = engine.release;
	effect = (callback) => engine.effect(callback, { scheduler: (task) => {
		if (shouldSchedule) scheduler(task);
		else task();
	} });
	raw = engine.raw;
}
function overrideEffect(override) {
	effect = override;
}
function elementBoundEffect(el) {
	let cleanup2 = () => {};
	let wrappedEffect = (callback) => {
		let effectReference = effect(callback);
		if (!el._x_effects) {
			el._x_effects = /* @__PURE__ */ new Set();
			el._x_runEffects = () => {
				el._x_effects.forEach((i) => i());
			};
		}
		el._x_effects.add(effectReference);
		cleanup2 = () => {
			if (effectReference === void 0) return;
			el._x_effects.delete(effectReference);
			release(effectReference);
		};
		return effectReference;
	};
	return [wrappedEffect, () => {
		cleanup2();
	}];
}
function watch(getter, callback) {
	let firstTime = true;
	let oldValue;
	let oldValueJSON;
	let effectReference = effect(() => {
		let value = getter();
		let newJSON = JSON.stringify(value);
		if (!firstTime) {
			if (typeof value === "object" || value !== oldValue) {
				let previousValue = typeof oldValue === "object" ? JSON.parse(oldValueJSON) : oldValue;
				queueMicrotask(() => {
					callback(value, previousValue);
				});
			}
		}
		oldValue = value;
		oldValueJSON = newJSON;
		firstTime = false;
	});
	return () => release(effectReference);
}
async function transaction(callback) {
	startTransaction();
	try {
		await callback();
		await Promise.resolve();
	} finally {
		commitTransaction();
	}
}
var onAttributeAddeds = [];
var onElRemoveds = [];
var onElAddeds = [];
function onElAdded(callback) {
	onElAddeds.push(callback);
}
function onElRemoved(el, callback) {
	if (typeof callback === "function") {
		if (!el._x_cleanups) el._x_cleanups = [];
		el._x_cleanups.push(callback);
	} else {
		callback = el;
		onElRemoveds.push(callback);
	}
}
function onAttributesAdded(callback) {
	onAttributeAddeds.push(callback);
}
function onAttributeRemoved(el, name, callback) {
	if (!el._x_attributeCleanups) el._x_attributeCleanups = {};
	if (!el._x_attributeCleanups[name]) el._x_attributeCleanups[name] = [];
	el._x_attributeCleanups[name].push(callback);
}
function cleanupAttributes(el, names) {
	if (!el._x_attributeCleanups) return;
	Object.entries(el._x_attributeCleanups).forEach(([name, value]) => {
		if (names === void 0 || names.includes(name)) {
			value.forEach((i) => i());
			delete el._x_attributeCleanups[name];
		}
	});
}
function cleanupElement(el) {
	el._x_effects?.forEach(dequeueJob);
	while (el._x_cleanups?.length) el._x_cleanups.pop()();
}
var observer = new MutationObserver(onMutate);
var currentlyObserving = false;
function startObservingMutations() {
	observer.observe(document, {
		subtree: true,
		childList: true,
		attributes: true,
		attributeOldValue: true
	});
	currentlyObserving = true;
}
function stopObservingMutations() {
	flushObserver();
	observer.disconnect();
	currentlyObserving = false;
}
var queuedMutations = [];
function flushObserver() {
	let records = observer.takeRecords();
	queuedMutations.push(() => records.length > 0 && onMutate(records));
	let queueLengthWhenTriggered = queuedMutations.length;
	queueMicrotask(() => {
		if (queuedMutations.length === queueLengthWhenTriggered) while (queuedMutations.length > 0) queuedMutations.shift()();
	});
}
function mutateDom(callback) {
	if (!currentlyObserving) return callback();
	stopObservingMutations();
	let result = callback();
	startObservingMutations();
	return result;
}
var isCollecting = false;
var deferredMutations = [];
function deferMutations() {
	isCollecting = true;
}
function flushAndStopDeferringMutations() {
	isCollecting = false;
	onMutate(deferredMutations);
	deferredMutations = [];
}
function onMutate(mutations) {
	if (isCollecting) {
		deferredMutations = deferredMutations.concat(mutations);
		return;
	}
	let addedNodes = [];
	let removedNodes = /* @__PURE__ */ new Set();
	let addedAttributes = /* @__PURE__ */ new Map();
	let removedAttributes = /* @__PURE__ */ new Map();
	for (let i = 0; i < mutations.length; i++) {
		if (mutations[i].target._x_ignoreMutationObserver) continue;
		if (mutations[i].type === "childList") {
			mutations[i].removedNodes.forEach((node) => {
				if (node.nodeType !== 1) return;
				if (!node._x_marker) return;
				removedNodes.add(node);
			});
			mutations[i].addedNodes.forEach((node) => {
				if (node.nodeType !== 1) return;
				if (removedNodes.has(node)) {
					removedNodes.delete(node);
					return;
				}
				if (node._x_marker) return;
				addedNodes.push(node);
			});
		}
		if (mutations[i].type === "attributes") {
			let el = mutations[i].target;
			let name = mutations[i].attributeName;
			let oldValue = mutations[i].oldValue;
			let add2 = () => {
				if (!addedAttributes.has(el)) addedAttributes.set(el, []);
				addedAttributes.get(el).push({
					name,
					value: el.getAttribute(name)
				});
			};
			let remove = () => {
				if (!removedAttributes.has(el)) removedAttributes.set(el, []);
				removedAttributes.get(el).push(name);
			};
			if (el.hasAttribute(name) && oldValue === null) add2();
			else if (el.hasAttribute(name)) {
				remove();
				add2();
			} else remove();
		}
	}
	removedAttributes.forEach((attrs, el) => {
		cleanupAttributes(el, attrs);
	});
	addedAttributes.forEach((attrs, el) => {
		onAttributeAddeds.forEach((i) => i(el, attrs));
	});
	for (let node of removedNodes) {
		if (addedNodes.some((i) => i.contains(node))) continue;
		onElRemoveds.forEach((i) => i(node));
	}
	for (let node of addedNodes) {
		if (!node.isConnected) continue;
		onElAddeds.forEach((i) => i(node));
	}
	addedNodes = null;
	removedNodes = null;
	addedAttributes = null;
	removedAttributes = null;
}
function scope(node) {
	return mergeProxies(closestDataStack(node));
}
function addScopeToNode(node, data2, referenceNode) {
	node._x_dataStack = [data2, ...closestDataStack(referenceNode || node)];
	return () => {
		node._x_dataStack = node._x_dataStack.filter((i) => i !== data2);
	};
}
function closestDataStack(node) {
	if (node._x_dataStack) return node._x_dataStack;
	if (typeof ShadowRoot === "function" && node instanceof ShadowRoot) return closestDataStack(node.host);
	if (!node.parentNode) return [];
	return closestDataStack(node.parentNode);
}
function mergeProxies(objects) {
	return new Proxy({ objects }, mergeProxyTrap);
}
function keyInPrototypeChain(obj, key) {
	if (obj === null || obj === Object.prototype) return null;
	if (Object.prototype.hasOwnProperty.call(obj, key)) return obj;
	return keyInPrototypeChain(Object.getPrototypeOf(obj), key);
}
var mergeProxyTrap = {
	ownKeys({ objects }) {
		return Array.from(new Set(objects.flatMap((i) => Object.keys(i))));
	},
	has({ objects }, name) {
		if (name == Symbol.unscopables) return false;
		return objects.some((obj) => Object.prototype.hasOwnProperty.call(obj, name) || Reflect.has(obj, name));
	},
	get({ objects }, name, thisProxy) {
		if (name == "toJSON") return collapseProxies;
		return Reflect.get(objects.find((obj) => Reflect.has(obj, name)) || {}, name, thisProxy);
	},
	set({ objects }, name, value, thisProxy) {
		let target;
		for (const obj of objects) {
			target = keyInPrototypeChain(obj, name);
			if (target) break;
		}
		if (!target) target = objects[objects.length - 1];
		const descriptor = Object.getOwnPropertyDescriptor(target, name);
		if (descriptor?.set && descriptor?.get) return descriptor.set.call(thisProxy, value) || true;
		return Reflect.set(target, name, value);
	}
};
function collapseProxies() {
	return Reflect.ownKeys(this).reduce((acc, key) => {
		acc[key] = Reflect.get(this, key);
		return acc;
	}, {});
}
function initInterceptors(data2) {
	let isObject3 = (val) => typeof val === "object" && !Array.isArray(val) && val !== null;
	let recurse = (obj, basePath = "") => {
		Object.entries(Object.getOwnPropertyDescriptors(obj)).forEach(([key, { value, enumerable }]) => {
			if (enumerable === false || value === void 0) return;
			if (typeof value === "object" && value !== null && value.__v_skip) return;
			let path = basePath === "" ? key : `${basePath}.${key}`;
			if (typeof value === "object" && value !== null && value._x_interceptor) obj[key] = value.initialize(data2, path, key);
			else if (isObject3(value) && value !== obj && !(value instanceof Element)) recurse(value, path);
		});
	};
	return recurse(data2);
}
function interceptor(callback, mutateObj = () => {}) {
	let obj = {
		initialValue: void 0,
		_x_interceptor: true,
		initialize(data2, path, key) {
			return callback(this.initialValue, () => get(data2, path), (value) => set(data2, path, value), path, key);
		}
	};
	mutateObj(obj);
	return (initialValue) => {
		if (typeof initialValue === "object" && initialValue !== null && initialValue._x_interceptor) {
			let initialize = obj.initialize.bind(obj);
			obj.initialize = (data2, path, key) => {
				let innerValue = initialValue.initialize(data2, path, key);
				obj.initialValue = innerValue;
				return initialize(data2, path, key);
			};
		} else obj.initialValue = initialValue;
		return obj;
	};
}
function get(obj, path) {
	return path.split(".").reduce((carry, segment) => carry[segment], obj);
}
function set(obj, path, value) {
	if (typeof path === "string") path = path.split(".");
	if (path.length === 1) obj[path[0]] = value;
	else if (path.length === 0) throw error;
	else if (obj[path[0]]) return set(obj[path[0]], path.slice(1), value);
	else {
		obj[path[0]] = {};
		return set(obj[path[0]], path.slice(1), value);
	}
}
var magics = {};
function magic(name, callback) {
	magics[name] = callback;
}
function injectMagics(obj, el) {
	let memoizedUtilities = getUtilities(el);
	Object.entries(magics).forEach(([name, callback]) => {
		Object.defineProperty(obj, `$${name}`, {
			get() {
				return callback(el, memoizedUtilities);
			},
			enumerable: false
		});
	});
	return obj;
}
function getUtilities(el) {
	let [utilities, cleanup2] = getElementBoundUtilities(el);
	let utils = {
		interceptor,
		...utilities
	};
	onElRemoved(el, cleanup2);
	return utils;
}
function tryCatch(el, expression, callback, ...args) {
	try {
		return callback(...args);
	} catch (e) {
		handleError(e, el, expression);
	}
}
function handleError(...args) {
	return errorHandler(...args);
}
var errorHandler = normalErrorHandler;
function setErrorHandler(handler4) {
	errorHandler = handler4;
}
function normalErrorHandler(error2, el, expression = void 0) {
	error2 = Object.assign(error2 ?? { message: "No error message given." }, {
		el,
		expression
	});
	console.warn(`Alpine Expression Error: ${error2.message}

${expression ? "Expression: \"" + expression + "\"\n\n" : ""}`, el);
	setTimeout(() => {
		throw error2;
	}, 0);
}
var shouldAutoEvaluateFunctions = true;
function dontAutoEvaluateFunctions(callback) {
	let cache = shouldAutoEvaluateFunctions;
	shouldAutoEvaluateFunctions = false;
	let result = callback();
	shouldAutoEvaluateFunctions = cache;
	return result;
}
function evaluate(el, expression, extras = {}) {
	let result;
	evaluateLater(el, expression)((value) => result = value, extras);
	return result;
}
function evaluateLater(...args) {
	return theEvaluatorFunction(...args);
}
var theEvaluatorFunction = () => {};
function setEvaluator(newEvaluator) {
	theEvaluatorFunction = newEvaluator;
}
var theRawEvaluatorFunction;
function setRawEvaluator(newEvaluator) {
	theRawEvaluatorFunction = newEvaluator;
}
function normalEvaluator(el, expression) {
	let overriddenMagics = {};
	injectMagics(overriddenMagics, el);
	let dataStack = [overriddenMagics, ...closestDataStack(el)];
	let evaluator = typeof expression === "function" ? generateEvaluatorFromFunction(dataStack, expression) : generateEvaluatorFromString(dataStack, expression, el);
	return tryCatch.bind(null, el, expression, evaluator);
}
function generateEvaluatorFromFunction(dataStack, func) {
	return (receiver = () => {}, { scope: scope2 = {}, params = [], context } = {}) => {
		if (!shouldAutoEvaluateFunctions) {
			runIfTypeOfFunction(receiver, func, mergeProxies([scope2, ...dataStack]), params);
			return;
		}
		runIfTypeOfFunction(receiver, func.apply(mergeProxies([scope2, ...dataStack]), params));
	};
}
var evaluatorMemo = {};
function generateFunctionFromString(expression, el) {
	if (evaluatorMemo[expression]) return evaluatorMemo[expression];
	let AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
	let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression.trim()) || /^(let|const)\s/.test(expression.trim()) ? `(async()=>{ ${expression} })()` : expression;
	const safeAsyncFunction = () => {
		try {
			let func2 = new AsyncFunction(["__self", "scope"], `with (scope) { __self.result = ${rightSideSafeExpression} }; __self.finished = true; return __self.result;`);
			Object.defineProperty(func2, "name", { value: `[Alpine] ${expression}` });
			return func2;
		} catch (error2) {
			handleError(error2, el, expression);
			return Promise.resolve();
		}
	};
	let func = safeAsyncFunction();
	evaluatorMemo[expression] = func;
	return func;
}
function generateEvaluatorFromString(dataStack, expression, el) {
	let func = generateFunctionFromString(expression, el);
	return (receiver = () => {}, { scope: scope2 = {}, params = [], context } = {}) => {
		func.result = void 0;
		func.finished = false;
		let completeScope = mergeProxies([scope2, ...dataStack]);
		if (typeof func === "function") {
			let promise = func.call(context, func, completeScope).catch((error2) => handleError(error2, el, expression));
			if (func.finished) {
				runIfTypeOfFunction(receiver, func.result, completeScope, params, el);
				func.result = void 0;
			} else promise.then((result) => {
				runIfTypeOfFunction(receiver, result, completeScope, params, el);
			}).catch((error2) => handleError(error2, el, expression)).finally(() => func.result = void 0);
		}
	};
}
function runIfTypeOfFunction(receiver, value, scope2, params, el) {
	if (shouldAutoEvaluateFunctions && typeof value === "function") {
		let result = value.apply(scope2, params);
		if (result instanceof Promise) result.then((i) => runIfTypeOfFunction(receiver, i, scope2, params)).catch((error2) => handleError(error2, el, value));
		else receiver(result);
	} else if (typeof value === "object" && value instanceof Promise) value.then((i) => receiver(i));
	else receiver(value);
}
function evaluateRaw(...args) {
	return theRawEvaluatorFunction(...args);
}
function normalRawEvaluator(el, expression, extras = {}) {
	let overriddenMagics = {};
	injectMagics(overriddenMagics, el);
	let dataStack = [overriddenMagics, ...closestDataStack(el)];
	let scope2 = mergeProxies([extras.scope ?? {}, ...dataStack]);
	let params = extras.params ?? [];
	if (expression.includes("await")) {
		let AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
		return new AsyncFunction(["scope"], `with (scope) { let __result = ${/^[\n\s]*if.*\(.*\)/.test(expression.trim()) || /^(let|const)\s/.test(expression.trim()) ? `(async()=>{ ${expression} })()` : expression}; return __result }`).call(extras.context, scope2);
	} else {
		let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression.trim()) || /^(let|const)\s/.test(expression.trim()) ? `(()=>{ ${expression} })()` : expression;
		let result = new Function(["scope"], `with (scope) { let __result = ${rightSideSafeExpression}; return __result }`).call(extras.context, scope2);
		if (typeof result === "function" && shouldAutoEvaluateFunctions) return result.apply(scope2, params);
		return result;
	}
}
var prefixAsString = "x-";
function prefix(subject = "") {
	return prefixAsString + subject;
}
function setPrefix(newPrefix) {
	prefixAsString = newPrefix;
}
var directiveHandlers = {};
function directive(name, callback) {
	directiveHandlers[name] = callback;
	return { before(directive2) {
		if (!directiveHandlers[directive2]) {
			console.warn(String.raw`Cannot find directive \`${directive2}\`. \`${name}\` will use the default order of execution`);
			return;
		}
		const pos = directiveOrder.indexOf(directive2);
		directiveOrder.splice(pos >= 0 ? pos : directiveOrder.indexOf("DEFAULT"), 0, name);
	} };
}
function directiveExists(name) {
	return Object.keys(directiveHandlers).includes(name);
}
function directives(el, attributes, originalAttributeOverride) {
	attributes = Array.from(attributes);
	if (el._x_virtualDirectives) {
		let vAttributes = Object.entries(el._x_virtualDirectives).map(([name, value]) => ({
			name,
			value
		}));
		let staticAttributes = attributesOnly(vAttributes);
		vAttributes = vAttributes.map((attribute) => {
			if (staticAttributes.find((attr) => attr.name === attribute.name)) return {
				name: `x-bind:${attribute.name}`,
				value: `"${attribute.value}"`
			};
			return attribute;
		});
		attributes = attributes.concat(vAttributes);
	}
	let transformedAttributeMap = {};
	return attributes.map(toTransformedAttributes((newName, oldName) => transformedAttributeMap[newName] = oldName)).filter(outNonAlpineAttributes).map(toParsedDirectives(transformedAttributeMap, originalAttributeOverride)).sort(byPriority).map((directive2) => {
		return getDirectiveHandler(el, directive2);
	});
}
function attributesOnly(attributes) {
	return Array.from(attributes).map(toTransformedAttributes()).filter((attr) => !outNonAlpineAttributes(attr));
}
var isDeferringHandlers = false;
var directiveHandlerStacks = /* @__PURE__ */ new Map();
var currentHandlerStackKey = Symbol();
function deferHandlingDirectives(callback) {
	isDeferringHandlers = true;
	let key = Symbol();
	currentHandlerStackKey = key;
	directiveHandlerStacks.set(key, []);
	let flushHandlers = () => {
		while (directiveHandlerStacks.get(key).length) directiveHandlerStacks.get(key).shift()();
		directiveHandlerStacks.delete(key);
	};
	let stopDeferring = () => {
		isDeferringHandlers = false;
		flushHandlers();
	};
	callback(flushHandlers);
	stopDeferring();
}
function getElementBoundUtilities(el) {
	let cleanups = [];
	let cleanup2 = (callback) => cleanups.push(callback);
	let [effect3, cleanupEffect] = elementBoundEffect(el);
	cleanups.push(cleanupEffect);
	let utilities = {
		Alpine: alpine_default,
		effect: effect3,
		cleanup: cleanup2,
		evaluateLater: evaluateLater.bind(evaluateLater, el),
		evaluate: evaluate.bind(evaluate, el)
	};
	let doCleanup = () => cleanups.forEach((i) => i());
	return [utilities, doCleanup];
}
function getDirectiveHandler(el, directive2) {
	let noop = () => {};
	let handler4 = directiveHandlers[directive2.type] || noop;
	let [utilities, cleanup2] = getElementBoundUtilities(el);
	onAttributeRemoved(el, directive2.original, cleanup2);
	let fullHandler = () => {
		if (el._x_ignore || el._x_ignoreSelf) return;
		handler4.inline && handler4.inline(el, directive2, utilities);
		handler4 = handler4.bind(handler4, el, directive2, utilities);
		isDeferringHandlers ? directiveHandlerStacks.get(currentHandlerStackKey).push(handler4) : handler4();
	};
	fullHandler.runCleanups = cleanup2;
	return fullHandler;
}
var startingWith = (subject, replacement) => ({ name, value }) => {
	if (name.startsWith(subject)) name = name.replace(subject, replacement);
	return {
		name,
		value
	};
};
var into = (i) => i;
function toTransformedAttributes(callback = () => {}) {
	return ({ name, value }) => {
		let { name: newName, value: newValue } = attributeTransformers.reduce((carry, transform) => {
			return transform(carry);
		}, {
			name,
			value
		});
		if (newName !== name) callback(newName, name);
		return {
			name: newName,
			value: newValue
		};
	};
}
var attributeTransformers = [];
function mapAttributes(callback) {
	attributeTransformers.push(callback);
}
function outNonAlpineAttributes({ name }) {
	return alpineAttributeRegex().test(name);
}
var alpineAttributeRegex = () => new RegExp(`^${prefixAsString}([^:^.]+)\\b`);
function toParsedDirectives(transformedAttributeMap, originalAttributeOverride) {
	return ({ name, value }) => {
		if (name === value) value = "";
		let typeMatch = name.match(alpineAttributeRegex());
		let valueMatch = name.match(/:([a-zA-Z0-9\-_:]+)/);
		let modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
		let original = originalAttributeOverride || transformedAttributeMap[name] || name;
		return {
			type: typeMatch ? typeMatch[1] : null,
			value: valueMatch ? valueMatch[1] : null,
			modifiers: modifiers.map((i) => i.replace(".", "")),
			expression: value,
			original
		};
	};
}
var DEFAULT = "DEFAULT";
var directiveOrder = [
	"ignore",
	"ref",
	"data",
	"id",
	"anchor",
	"bind",
	"init",
	"for",
	"model",
	"modelable",
	"transition",
	"show",
	"if",
	DEFAULT,
	"teleport"
];
function byPriority(a, b) {
	let typeA = directiveOrder.indexOf(a.type) === -1 ? DEFAULT : a.type;
	let typeB = directiveOrder.indexOf(b.type) === -1 ? DEFAULT : b.type;
	return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB);
}
function dispatch(el, name, detail = {}, options = {}) {
	return el.dispatchEvent(new CustomEvent(name, {
		detail,
		bubbles: true,
		composed: true,
		cancelable: true,
		...options
	}));
}
function walk(el, callback) {
	if (typeof ShadowRoot === "function" && el instanceof ShadowRoot) {
		Array.from(el.children).forEach((el2) => walk(el2, callback));
		return;
	}
	let skip = false;
	callback(el, () => skip = true);
	if (skip) return;
	let node = el.firstElementChild;
	while (node) {
		walk(node, callback, false);
		node = node.nextElementSibling;
	}
}
function warn(message, ...args) {
	console.warn(`Alpine Warning: ${message}`, ...args);
}
var started = false;
function start() {
	if (started) warn("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems.");
	started = true;
	if (!document.body) warn("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?");
	dispatch(document, "alpine:init");
	dispatch(document, "alpine:initializing");
	startObservingMutations();
	onElAdded((el) => initTree(el, walk));
	onElRemoved((el) => destroyTree(el));
	onAttributesAdded((el, attrs) => {
		directives(el, attrs).forEach((handle) => handle());
	});
	let outNestedComponents = (el) => !closestRoot(el.parentElement, true);
	Array.from(document.querySelectorAll(allSelectors().join(","))).filter(outNestedComponents).forEach((el) => {
		initTree(el);
	});
	dispatch(document, "alpine:initialized");
	setTimeout(() => {
		warnAboutMissingPlugins();
	});
}
var rootSelectorCallbacks = [];
var initSelectorCallbacks = [];
function rootSelectors() {
	return rootSelectorCallbacks.map((fn) => fn());
}
function allSelectors() {
	return rootSelectorCallbacks.concat(initSelectorCallbacks).map((fn) => fn());
}
function addRootSelector(selectorCallback) {
	rootSelectorCallbacks.push(selectorCallback);
}
function addInitSelector(selectorCallback) {
	initSelectorCallbacks.push(selectorCallback);
}
function closestRoot(el, includeInitSelectors = false) {
	return findClosest(el, (element) => {
		if ((includeInitSelectors ? allSelectors() : rootSelectors()).some((selector) => element.matches(selector))) return true;
	});
}
function findClosest(el, callback) {
	if (!el) return;
	if (callback(el)) return el;
	if (el._x_teleportBack) return findClosest(el._x_teleportBack, callback);
	if (el.parentNode instanceof ShadowRoot) return findClosest(el.parentNode.host, callback);
	if (!el.parentElement) return;
	return findClosest(el.parentElement, callback);
}
function isRoot(el) {
	return rootSelectors().some((selector) => el.matches(selector));
}
var initInterceptors2 = [];
function interceptInit(callback) {
	initInterceptors2.push(callback);
}
var markerDispenser = 1;
function initTree(el, walker = walk, intercept = () => {}) {
	if (findClosest(el, (i) => i._x_ignore)) return;
	deferHandlingDirectives(() => {
		walker(el, (el2, skip) => {
			if (el2._x_marker) return;
			intercept(el2, skip);
			initInterceptors2.forEach((i) => i(el2, skip));
			directives(el2, el2.attributes).forEach((handle) => handle());
			if (!el2._x_ignore) el2._x_marker = markerDispenser++;
			el2._x_ignore && skip();
		});
	});
}
function destroyTree(root, walker = walk) {
	walker(root, (el) => {
		cleanupElement(el);
		cleanupAttributes(el);
		delete el._x_marker;
	});
}
function warnAboutMissingPlugins() {
	[
		[
			"ui",
			"dialog",
			["[x-dialog], [x-popover]"]
		],
		[
			"anchor",
			"anchor",
			["[x-anchor]"]
		],
		[
			"sort",
			"sort",
			["[x-sort]"]
		]
	].forEach(([plugin2, directive2, selectors]) => {
		if (directiveExists(directive2)) return;
		selectors.some((selector) => {
			if (document.querySelector(selector)) {
				warn(`found "${selector}", but missing ${plugin2} plugin`);
				return true;
			}
		});
	});
}
var tickStack = [];
var isHolding = false;
function nextTick(callback = () => {}) {
	queueMicrotask(() => {
		isHolding || setTimeout(() => {
			releaseNextTicks();
		});
	});
	return new Promise((res) => {
		tickStack.push(() => {
			callback();
			res();
		});
	});
}
function releaseNextTicks() {
	isHolding = false;
	while (tickStack.length) tickStack.shift()();
}
function holdNextTicks() {
	isHolding = true;
}
function setClasses(el, value) {
	if (Array.isArray(value)) return setClassesFromString(el, value.join(" "));
	else if (typeof value === "object" && value !== null) return setClassesFromObject(el, value);
	else if (typeof value === "function") return setClasses(el, value());
	return setClassesFromString(el, value);
}
function splitClasses(classString) {
	return classString.split(/\s/).filter(Boolean);
}
function setClassesFromString(el, classString) {
	let missingClasses = (classString2) => splitClasses(classString2).filter((i) => !el.classList.contains(i)).filter(Boolean);
	let addClassesAndReturnUndo = (classes) => {
		el.classList.add(...classes);
		return () => {
			el.classList.remove(...classes);
		};
	};
	classString = classString === true ? classString = "" : classString || "";
	return addClassesAndReturnUndo(missingClasses(classString));
}
function setClassesFromObject(el, classObject) {
	let forAdd = Object.entries(classObject).flatMap(([classString, bool]) => bool ? splitClasses(classString) : false).filter(Boolean);
	let forRemove = Object.entries(classObject).flatMap(([classString, bool]) => !bool ? splitClasses(classString) : false).filter(Boolean);
	let added = [];
	let removed = [];
	forRemove.forEach((i) => {
		if (el.classList.contains(i)) {
			el.classList.remove(i);
			removed.push(i);
		}
	});
	forAdd.forEach((i) => {
		if (!el.classList.contains(i)) {
			el.classList.add(i);
			added.push(i);
		}
	});
	return () => {
		removed.forEach((i) => el.classList.add(i));
		added.forEach((i) => el.classList.remove(i));
	};
}
function setStyles(el, value) {
	if (typeof value === "object" && value !== null) return setStylesFromObject(el, value);
	return setStylesFromString(el, value);
}
function setStylesFromObject(el, value) {
	let previousStyles = {};
	Object.entries(value).forEach(([key, value2]) => {
		previousStyles[key] = el.style[key];
		if (!key.startsWith("--")) key = kebabCase(key);
		el.style.setProperty(key, value2);
	});
	setTimeout(() => {
		if (el.style.length === 0) el.removeAttribute("style");
	});
	return () => {
		setStyles(el, previousStyles);
	};
}
function setStylesFromString(el, value) {
	let cache = el.getAttribute("style", value);
	el.setAttribute("style", value);
	return () => {
		el.setAttribute("style", cache || "");
	};
}
function kebabCase(subject) {
	return subject.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function once(callback, fallback = () => {}) {
	let called = false;
	return function() {
		if (!called) {
			called = true;
			callback.apply(this, arguments);
		} else fallback.apply(this, arguments);
	};
}
directive("transition", (el, { value, modifiers, expression }, { evaluate: evaluate2 }) => {
	if (typeof expression === "function") expression = evaluate2(expression);
	if (expression === false) return;
	if (!expression || typeof expression === "boolean") registerTransitionsFromHelper(el, modifiers, value);
	else registerTransitionsFromClassString(el, expression, value);
});
function registerTransitionsFromClassString(el, classString, stage) {
	registerTransitionObject(el, setClasses, "");
	({
		"enter": (classes) => {
			el._x_transition.enter.during = classes;
		},
		"enter-start": (classes) => {
			el._x_transition.enter.start = classes;
		},
		"enter-end": (classes) => {
			el._x_transition.enter.end = classes;
		},
		"leave": (classes) => {
			el._x_transition.leave.during = classes;
		},
		"leave-start": (classes) => {
			el._x_transition.leave.start = classes;
		},
		"leave-end": (classes) => {
			el._x_transition.leave.end = classes;
		}
	})[stage](classString);
}
function registerTransitionsFromHelper(el, modifiers, stage) {
	registerTransitionObject(el, setStyles);
	let doesntSpecify = !modifiers.includes("in") && !modifiers.includes("out") && !stage;
	let transitioningIn = doesntSpecify || modifiers.includes("in") || ["enter"].includes(stage);
	let transitioningOut = doesntSpecify || modifiers.includes("out") || ["leave"].includes(stage);
	if (modifiers.includes("in") && !doesntSpecify) modifiers = modifiers.filter((i, index) => index < modifiers.indexOf("out"));
	if (modifiers.includes("out") && !doesntSpecify) modifiers = modifiers.filter((i, index) => index > modifiers.indexOf("out"));
	let wantsAll = !modifiers.includes("opacity") && !modifiers.includes("scale");
	let wantsOpacity = wantsAll || modifiers.includes("opacity");
	let wantsScale = wantsAll || modifiers.includes("scale");
	let opacityValue = wantsOpacity ? 0 : 1;
	let scaleValue = wantsScale ? modifierValue(modifiers, "scale", 95) / 100 : 1;
	let delay = modifierValue(modifiers, "delay", 0) / 1e3;
	let origin = modifierValue(modifiers, "origin", "center");
	let property = "opacity, transform";
	let durationIn = modifierValue(modifiers, "duration", 150) / 1e3;
	let durationOut = modifierValue(modifiers, "duration", 75) / 1e3;
	let easing = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
	if (transitioningIn) {
		el._x_transition.enter.during = {
			transformOrigin: origin,
			transitionDelay: `${delay}s`,
			transitionProperty: property,
			transitionDuration: `${durationIn}s`,
			transitionTimingFunction: easing
		};
		el._x_transition.enter.start = {
			opacity: opacityValue,
			transform: `scale(${scaleValue})`
		};
		el._x_transition.enter.end = {
			opacity: 1,
			transform: `scale(1)`
		};
	}
	if (transitioningOut) {
		el._x_transition.leave.during = {
			transformOrigin: origin,
			transitionDelay: `${delay}s`,
			transitionProperty: property,
			transitionDuration: `${durationOut}s`,
			transitionTimingFunction: easing
		};
		el._x_transition.leave.start = {
			opacity: 1,
			transform: `scale(1)`
		};
		el._x_transition.leave.end = {
			opacity: opacityValue,
			transform: `scale(${scaleValue})`
		};
	}
}
function registerTransitionObject(el, setFunction, defaultValue = {}) {
	if (!el._x_transition) el._x_transition = {
		enter: {
			during: defaultValue,
			start: defaultValue,
			end: defaultValue
		},
		leave: {
			during: defaultValue,
			start: defaultValue,
			end: defaultValue
		},
		in(before = () => {}, after = () => {}) {
			transition(el, setFunction, {
				during: this.enter.during,
				start: this.enter.start,
				end: this.enter.end
			}, before, after);
		},
		out(before = () => {}, after = () => {}) {
			transition(el, setFunction, {
				during: this.leave.during,
				start: this.leave.start,
				end: this.leave.end
			}, before, after);
		}
	};
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(el, value, show, hide) {
	const nextTick2 = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
	let clickAwayCompatibleShow = () => nextTick2(show);
	if (value) {
		if (el._x_transition && (el._x_transition.enter || el._x_transition.leave)) el._x_transition.enter && (Object.entries(el._x_transition.enter.during).length || Object.entries(el._x_transition.enter.start).length || Object.entries(el._x_transition.enter.end).length) ? el._x_transition.in(show) : clickAwayCompatibleShow();
		else el._x_transition ? el._x_transition.in(show) : clickAwayCompatibleShow();
		return;
	}
	el._x_hidePromise = el._x_transition ? new Promise((resolve, reject) => {
		el._x_transition.out(() => {}, () => resolve(hide));
		el._x_transitioning && el._x_transitioning.beforeCancel(() => reject({ isFromCancelledTransition: true }));
	}) : Promise.resolve(hide);
	queueMicrotask(() => {
		let closest = closestHide(el);
		if (closest) {
			if (!closest._x_hideChildren) closest._x_hideChildren = [];
			closest._x_hideChildren.push(el);
		} else nextTick2(() => {
			let hideAfterChildren = (el2) => {
				let carry = Promise.all([el2._x_hidePromise, ...(el2._x_hideChildren || []).map(hideAfterChildren)]).then(([i]) => i?.());
				delete el2._x_hidePromise;
				delete el2._x_hideChildren;
				return carry;
			};
			hideAfterChildren(el).catch((e) => {
				if (!e.isFromCancelledTransition) throw e;
			});
		});
	});
};
function closestHide(el) {
	let parent = el.parentNode;
	if (!parent) return;
	return parent._x_hidePromise ? parent : closestHide(parent);
}
function transition(el, setFunction, { during, start: start2, end } = {}, before = () => {}, after = () => {}) {
	if (el._x_transitioning) el._x_transitioning.cancel();
	if (Object.keys(during).length === 0 && Object.keys(start2).length === 0 && Object.keys(end).length === 0) {
		before();
		after();
		return;
	}
	let undoStart, undoDuring, undoEnd;
	performTransition(el, {
		start() {
			undoStart = setFunction(el, start2);
		},
		during() {
			undoDuring = setFunction(el, during);
		},
		before,
		end() {
			undoStart();
			undoEnd = setFunction(el, end);
		},
		after,
		cleanup() {
			undoDuring();
			undoEnd();
		}
	});
}
function performTransition(el, stages) {
	let interrupted, reachedBefore, reachedEnd;
	let finish = once(() => {
		mutateDom(() => {
			interrupted = true;
			if (!reachedBefore) stages.before();
			if (!reachedEnd) {
				stages.end();
				releaseNextTicks();
			}
			stages.after();
			if (el.isConnected) stages.cleanup();
			delete el._x_transitioning;
		});
	});
	el._x_transitioning = {
		beforeCancels: [],
		beforeCancel(callback) {
			this.beforeCancels.push(callback);
		},
		cancel: once(function() {
			while (this.beforeCancels.length) this.beforeCancels.shift()();
			finish();
		}),
		finish
	};
	mutateDom(() => {
		stages.start();
		stages.during();
	});
	holdNextTicks();
	requestAnimationFrame(() => {
		if (interrupted) return;
		let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3;
		let delay = Number(getComputedStyle(el).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
		if (duration === 0) duration = Number(getComputedStyle(el).animationDuration.replace("s", "")) * 1e3;
		mutateDom(() => {
			stages.before();
		});
		reachedBefore = true;
		requestAnimationFrame(() => {
			if (interrupted) return;
			mutateDom(() => {
				stages.end();
			});
			releaseNextTicks();
			setTimeout(el._x_transitioning.finish, duration + delay);
			reachedEnd = true;
		});
	});
}
function modifierValue(modifiers, key, fallback) {
	if (modifiers.indexOf(key) === -1) return fallback;
	const rawValue = modifiers[modifiers.indexOf(key) + 1];
	if (!rawValue) return fallback;
	if (key === "scale") {
		if (isNaN(rawValue)) return fallback;
	}
	if (key === "duration" || key === "delay") {
		let match = rawValue.match(/([0-9]+)ms/);
		if (match) return match[1];
	}
	if (key === "origin") {
		if ([
			"top",
			"right",
			"left",
			"center",
			"bottom"
		].includes(modifiers[modifiers.indexOf(key) + 2])) return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(" ");
	}
	return rawValue;
}
var isCloning = false;
function skipDuringClone(callback, fallback = () => {}) {
	return (...args) => isCloning ? fallback(...args) : callback(...args);
}
function onlyDuringClone(callback) {
	return (...args) => isCloning && callback(...args);
}
var interceptors = [];
function interceptClone(callback) {
	interceptors.push(callback);
}
function cloneNode(from, to) {
	interceptors.forEach((i) => i(from, to));
	isCloning = true;
	dontRegisterReactiveSideEffects(() => {
		initTree(to, (el, callback) => {
			callback(el, () => {});
		});
	});
	isCloning = false;
}
var isCloningLegacy = false;
function clone(oldEl, newEl) {
	if (!newEl._x_dataStack) newEl._x_dataStack = oldEl._x_dataStack;
	isCloning = true;
	isCloningLegacy = true;
	dontRegisterReactiveSideEffects(() => {
		cloneTree(newEl);
	});
	isCloning = false;
	isCloningLegacy = false;
}
function cloneTree(el) {
	let hasRunThroughFirstEl = false;
	let shallowWalker = (el2, callback) => {
		walk(el2, (el3, skip) => {
			if (hasRunThroughFirstEl && isRoot(el3)) return skip();
			hasRunThroughFirstEl = true;
			callback(el3, skip);
		});
	};
	initTree(el, shallowWalker);
}
function dontRegisterReactiveSideEffects(callback) {
	let cache = effect;
	overrideEffect((callback2, el) => {
		let storedEffect = cache(callback2);
		release(storedEffect);
		return () => {};
	});
	callback();
	overrideEffect(cache);
}
function bind(el, name, value, modifiers = []) {
	if (!el._x_bindings) el._x_bindings = reactive({});
	el._x_bindings[name] = value;
	name = modifiers.includes("camel") ? camelCase(name) : name;
	switch (name) {
		case "value":
			bindInputValue(el, value);
			break;
		case "style":
			bindStyles(el, value);
			break;
		case "class":
			bindClasses(el, value);
			break;
		case "selected":
		case "checked":
			bindAttributeAndProperty(el, name, value);
			break;
		default: bindAttribute(el, name, value);
	}
}
function bindInputValue(el, value) {
	if (isRadio(el)) {
		if (el.attributes.value === void 0) el.value = value;
	} else if (isCheckbox(el)) {
		if (Number.isInteger(value)) el.value = value;
		else if (!Array.isArray(value) && typeof value !== "boolean" && ![null, void 0].includes(value)) el.value = String(value);
		else if (Array.isArray(value)) el.checked = value.some((val) => checkedAttrLooseCompare(val, el.value));
		else el.checked = !!value;
	} else if (el.tagName === "SELECT") updateSelect(el, value);
	else {
		if (el.value === value) return;
		el.value = value === void 0 ? "" : value;
	}
}
function bindClasses(el, value) {
	if (el._x_undoAddedClasses) el._x_undoAddedClasses();
	el._x_undoAddedClasses = setClasses(el, value);
}
function bindStyles(el, value) {
	if (el._x_undoAddedStyles) el._x_undoAddedStyles();
	el._x_undoAddedStyles = setStyles(el, value);
}
function bindAttributeAndProperty(el, name, value) {
	bindAttribute(el, name, value);
	setPropertyIfChanged(el, name, value);
}
function bindAttribute(el, name, value) {
	if ([
		null,
		void 0,
		false
	].includes(value) && attributeShouldntBePreservedIfFalsy(name)) el.removeAttribute(name);
	else {
		if (isBooleanAttr(name)) value = name;
		setIfChanged(el, name, value);
	}
}
function setIfChanged(el, attrName, value) {
	if (el.getAttribute(attrName) != value) el.setAttribute(attrName, value);
}
function setPropertyIfChanged(el, propName, value) {
	if (el[propName] !== value) el[propName] = value;
}
function updateSelect(el, value) {
	const arrayWrappedValue = [].concat(value).map((value2) => {
		return value2 + "";
	});
	Array.from(el.options).forEach((option) => {
		option.selected = arrayWrappedValue.includes(option.value);
	});
}
function camelCase(subject) {
	return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
}
function checkedAttrLooseCompare(valueA, valueB) {
	return valueA == valueB;
}
function safeParseBoolean(rawValue) {
	if ([
		1,
		"1",
		"true",
		"on",
		"yes",
		true
	].includes(rawValue)) return true;
	if ([
		0,
		"0",
		"false",
		"off",
		"no",
		false
	].includes(rawValue)) return false;
	return rawValue ? Boolean(rawValue) : null;
}
var booleanAttributes = /* @__PURE__ */ new Set([
	"allowfullscreen",
	"async",
	"autofocus",
	"autoplay",
	"checked",
	"controls",
	"default",
	"defer",
	"disabled",
	"formnovalidate",
	"inert",
	"ismap",
	"itemscope",
	"loop",
	"multiple",
	"muted",
	"nomodule",
	"novalidate",
	"open",
	"playsinline",
	"readonly",
	"required",
	"reversed",
	"selected",
	"shadowrootclonable",
	"shadowrootdelegatesfocus",
	"shadowrootserializable"
]);
function isBooleanAttr(attrName) {
	return booleanAttributes.has(attrName);
}
function attributeShouldntBePreservedIfFalsy(name) {
	return ![
		"aria-pressed",
		"aria-checked",
		"aria-expanded",
		"aria-selected"
	].includes(name);
}
function getBinding(el, name, fallback) {
	if (el._x_bindings && el._x_bindings[name] !== void 0) return el._x_bindings[name];
	return getAttributeBinding(el, name, fallback);
}
function extractProp(el, name, fallback, extract = true) {
	if (el._x_bindings && el._x_bindings[name] !== void 0) return el._x_bindings[name];
	if (el._x_inlineBindings && el._x_inlineBindings[name] !== void 0) {
		let binding = el._x_inlineBindings[name];
		binding.extract = extract;
		return dontAutoEvaluateFunctions(() => {
			return evaluate(el, binding.expression);
		});
	}
	return getAttributeBinding(el, name, fallback);
}
function getAttributeBinding(el, name, fallback) {
	let attr = el.getAttribute(name);
	if (attr === null) return typeof fallback === "function" ? fallback() : fallback;
	if (attr === "") return true;
	if (isBooleanAttr(name)) return !![name, "true"].includes(attr);
	return attr;
}
function isCheckbox(el) {
	return el.type === "checkbox" || el.localName === "ui-checkbox" || el.localName === "ui-switch";
}
function isRadio(el) {
	return el.type === "radio" || el.localName === "ui-radio";
}
function debounce(func, wait) {
	let timeout;
	return function() {
		const context = this, args = arguments;
		const later = function() {
			timeout = null;
			func.apply(context, args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}
function throttle(func, limit) {
	let inThrottle;
	return function() {
		let context = this, args = arguments;
		if (!inThrottle) {
			func.apply(context, args);
			inThrottle = true;
			setTimeout(() => inThrottle = false, limit);
		}
	};
}
function entangle({ get: outerGet, set: outerSet }, { get: innerGet, set: innerSet }) {
	let firstRun = true;
	let outerHash;
	let reference = effect(() => {
		let outer = outerGet();
		let inner = innerGet();
		if (firstRun) {
			innerSet(cloneIfObject(outer));
			firstRun = false;
		} else {
			let outerHashLatest = JSON.stringify(outer);
			let innerHashLatest = JSON.stringify(inner);
			if (outerHashLatest !== outerHash) innerSet(cloneIfObject(outer));
			else if (outerHashLatest !== innerHashLatest) outerSet(cloneIfObject(inner));
		}
		outerHash = JSON.stringify(outerGet());
		JSON.stringify(innerGet());
	});
	return () => {
		release(reference);
	};
}
function cloneIfObject(value) {
	return typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value;
}
function plugin(callback) {
	(Array.isArray(callback) ? callback : [callback]).forEach((i) => i(alpine_default));
}
var stores = {};
var isReactive = false;
function store(name, value) {
	if (!isReactive) {
		stores = reactive(stores);
		isReactive = true;
	}
	if (value === void 0) return stores[name];
	stores[name] = value;
	initInterceptors(stores[name]);
	if (typeof value === "object" && value !== null && value.hasOwnProperty("init") && typeof value.init === "function") stores[name].init();
}
function getStores() {
	return stores;
}
var binds = {};
function bind2(name, bindings) {
	let getBindings = typeof bindings !== "function" ? () => bindings : bindings;
	if (name instanceof Element) return applyBindingsObject(name, getBindings());
	else binds[name] = getBindings;
	return () => {};
}
function injectBindingProviders(obj) {
	Object.entries(binds).forEach(([name, callback]) => {
		Object.defineProperty(obj, name, { get() {
			return (...args) => {
				return callback(...args);
			};
		} });
	});
	return obj;
}
function applyBindingsObject(el, obj, original) {
	let cleanupRunners = [];
	while (cleanupRunners.length) cleanupRunners.pop()();
	let attributes = Object.entries(obj).map(([name, value]) => ({
		name,
		value
	}));
	let staticAttributes = attributesOnly(attributes);
	attributes = attributes.map((attribute) => {
		if (staticAttributes.find((attr) => attr.name === attribute.name)) return {
			name: `x-bind:${attribute.name}`,
			value: `"${attribute.value}"`
		};
		return attribute;
	});
	directives(el, attributes, original).map((handle) => {
		cleanupRunners.push(handle.runCleanups);
		handle();
	});
	return () => {
		while (cleanupRunners.length) cleanupRunners.pop()();
	};
}
var datas = {};
function data(name, callback) {
	datas[name] = callback;
}
function injectDataProviders(obj, context) {
	Object.entries(datas).forEach(([name, callback]) => {
		Object.defineProperty(obj, name, {
			get() {
				return (...args) => {
					return callback.bind(context)(...args);
				};
			},
			enumerable: false
		});
	});
	return obj;
}
var alpine_default = {
	get reactive() {
		return reactive;
	},
	get release() {
		return release;
	},
	get effect() {
		return effect;
	},
	get raw() {
		return raw;
	},
	get transaction() {
		return transaction;
	},
	version: "3.15.11",
	flushAndStopDeferringMutations,
	dontAutoEvaluateFunctions,
	disableEffectScheduling,
	startObservingMutations,
	stopObservingMutations,
	setReactivityEngine,
	onAttributeRemoved,
	onAttributesAdded,
	closestDataStack,
	skipDuringClone,
	onlyDuringClone,
	addRootSelector,
	addInitSelector,
	setErrorHandler,
	interceptClone,
	addScopeToNode,
	deferMutations,
	mapAttributes,
	evaluateLater,
	interceptInit,
	initInterceptors,
	injectMagics,
	setEvaluator,
	setRawEvaluator,
	mergeProxies,
	extractProp,
	findClosest,
	onElRemoved,
	closestRoot,
	destroyTree,
	interceptor,
	transition,
	setStyles,
	mutateDom,
	directive,
	entangle,
	throttle,
	debounce,
	evaluate,
	evaluateRaw,
	initTree,
	nextTick,
	prefixed: prefix,
	prefix: setPrefix,
	plugin,
	magic,
	store,
	start,
	clone,
	cloneNode,
	bound: getBinding,
	$data: scope,
	watch,
	walk,
	data,
	bind: bind2
};
function makeMap(str, expectsLowerCase) {
	const map = /* @__PURE__ */ Object.create(null);
	const list = str.split(",");
	for (let i = 0; i < list.length; i++) map[list[i]] = true;
	return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
var EMPTY_OBJ = Object.freeze({});
Object.freeze([]);
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = (val, key) => hasOwnProperty.call(val, key);
var isArray = Array.isArray;
var isMap = (val) => toTypeString(val) === "[object Map]";
var isString = (val) => typeof val === "string";
var isSymbol = (val) => typeof val === "symbol";
var isObject = (val) => val !== null && typeof val === "object";
var objectToString = Object.prototype.toString;
var toTypeString = (value) => objectToString.call(value);
var toRawType = (value) => {
	return toTypeString(value).slice(8, -1);
};
var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
var cacheStringFunction = (fn) => {
	const cache = /* @__PURE__ */ Object.create(null);
	return (str) => {
		return cache[str] || (cache[str] = fn(str));
	};
};
var capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
var hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);
var targetMap = /* @__PURE__ */ new WeakMap();
var effectStack = [];
var activeEffect;
var ITERATE_KEY = Symbol("iterate");
var MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
function isEffect(fn) {
	return fn && fn._isEffect === true;
}
function effect2(fn, options = EMPTY_OBJ) {
	if (isEffect(fn)) fn = fn.raw;
	const effect3 = createReactiveEffect(fn, options);
	if (!options.lazy) effect3();
	return effect3;
}
function stop(effect3) {
	if (effect3.active) {
		cleanup(effect3);
		if (effect3.options.onStop) effect3.options.onStop();
		effect3.active = false;
	}
}
var uid = 0;
function createReactiveEffect(fn, options) {
	const effect3 = function reactiveEffect() {
		if (!effect3.active) return fn();
		if (!effectStack.includes(effect3)) {
			cleanup(effect3);
			try {
				enableTracking();
				effectStack.push(effect3);
				activeEffect = effect3;
				return fn();
			} finally {
				effectStack.pop();
				resetTracking();
				activeEffect = effectStack[effectStack.length - 1];
			}
		}
	};
	effect3.id = uid++;
	effect3.allowRecurse = !!options.allowRecurse;
	effect3._isEffect = true;
	effect3.active = true;
	effect3.raw = fn;
	effect3.deps = [];
	effect3.options = options;
	return effect3;
}
function cleanup(effect3) {
	const { deps } = effect3;
	if (deps.length) {
		for (let i = 0; i < deps.length; i++) deps[i].delete(effect3);
		deps.length = 0;
	}
}
var shouldTrack = true;
var trackStack = [];
function pauseTracking() {
	trackStack.push(shouldTrack);
	shouldTrack = false;
}
function enableTracking() {
	trackStack.push(shouldTrack);
	shouldTrack = true;
}
function resetTracking() {
	const last = trackStack.pop();
	shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
	if (!shouldTrack || activeEffect === void 0) return;
	let depsMap = targetMap.get(target);
	if (!depsMap) targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
	let dep = depsMap.get(key);
	if (!dep) depsMap.set(key, dep = /* @__PURE__ */ new Set());
	if (!dep.has(activeEffect)) {
		dep.add(activeEffect);
		activeEffect.deps.push(dep);
		if (activeEffect.options.onTrack) activeEffect.options.onTrack({
			effect: activeEffect,
			target,
			type,
			key
		});
	}
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
	const depsMap = targetMap.get(target);
	if (!depsMap) return;
	const effects = /* @__PURE__ */ new Set();
	const add2 = (effectsToAdd) => {
		if (effectsToAdd) effectsToAdd.forEach((effect3) => {
			if (effect3 !== activeEffect || effect3.allowRecurse) effects.add(effect3);
		});
	};
	if (type === "clear") depsMap.forEach(add2);
	else if (key === "length" && isArray(target)) depsMap.forEach((dep, key2) => {
		if (key2 === "length" || key2 >= newValue) add2(dep);
	});
	else {
		if (key !== void 0) add2(depsMap.get(key));
		switch (type) {
			case "add":
				if (!isArray(target)) {
					add2(depsMap.get(ITERATE_KEY));
					if (isMap(target)) add2(depsMap.get(MAP_KEY_ITERATE_KEY));
				} else if (isIntegerKey(key)) add2(depsMap.get("length"));
				break;
			case "delete":
				if (!isArray(target)) {
					add2(depsMap.get(ITERATE_KEY));
					if (isMap(target)) add2(depsMap.get(MAP_KEY_ITERATE_KEY));
				}
				break;
			case "set": if (isMap(target)) add2(depsMap.get(ITERATE_KEY));
		}
	}
	const run = (effect3) => {
		if (effect3.options.onTrigger) effect3.options.onTrigger({
			effect: effect3,
			target,
			key,
			type,
			newValue,
			oldValue,
			oldTarget
		});
		if (effect3.options.scheduler) effect3.options.scheduler(effect3);
		else effect3();
	};
	effects.forEach(run);
}
var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol));
var get2 = /* @__PURE__ */ createGetter();
var readonlyGet = /* @__PURE__ */ createGetter(true);
var arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
	const instrumentations = {};
	[
		"includes",
		"indexOf",
		"lastIndexOf"
	].forEach((key) => {
		instrumentations[key] = function(...args) {
			const arr = toRaw(this);
			for (let i = 0, l = this.length; i < l; i++) track(arr, "get", i + "");
			const res = arr[key](...args);
			if (res === -1 || res === false) return arr[key](...args.map(toRaw));
			else return res;
		};
	});
	[
		"push",
		"pop",
		"shift",
		"unshift",
		"splice"
	].forEach((key) => {
		instrumentations[key] = function(...args) {
			pauseTracking();
			const res = toRaw(this)[key].apply(this, args);
			resetTracking();
			return res;
		};
	});
	return instrumentations;
}
function createGetter(isReadonly = false, shallow = false) {
	return function get3(target, key, receiver) {
		if (key === "__v_isReactive") return !isReadonly;
		else if (key === "__v_isReadonly") return isReadonly;
		else if (key === "__v_raw" && receiver === (isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) return target;
		const targetIsArray = isArray(target);
		if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) return Reflect.get(arrayInstrumentations, key, receiver);
		const res = Reflect.get(target, key, receiver);
		if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) return res;
		if (!isReadonly) track(target, "get", key);
		if (shallow) return res;
		if (isRef(res)) return !targetIsArray || !isIntegerKey(key) ? res.value : res;
		if (isObject(res)) return isReadonly ? readonly(res) : reactive2(res);
		return res;
	};
}
var set2 = /* @__PURE__ */ createSetter();
function createSetter(shallow = false) {
	return function set3(target, key, value, receiver) {
		let oldValue = target[key];
		if (!shallow) {
			value = toRaw(value);
			oldValue = toRaw(oldValue);
			if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
				oldValue.value = value;
				return true;
			}
		}
		const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
		const result = Reflect.set(target, key, value, receiver);
		if (target === toRaw(receiver)) {
			if (!hadKey) trigger(target, "add", key, value);
			else if (hasChanged(value, oldValue)) trigger(target, "set", key, value, oldValue);
		}
		return result;
	};
}
function deleteProperty(target, key) {
	const hadKey = hasOwn(target, key);
	const oldValue = target[key];
	const result = Reflect.deleteProperty(target, key);
	if (result && hadKey) trigger(target, "delete", key, void 0, oldValue);
	return result;
}
function has(target, key) {
	const result = Reflect.has(target, key);
	if (!isSymbol(key) || !builtInSymbols.has(key)) track(target, "has", key);
	return result;
}
function ownKeys(target) {
	track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
	return Reflect.ownKeys(target);
}
var mutableHandlers = {
	get: get2,
	set: set2,
	deleteProperty,
	has,
	ownKeys
};
var readonlyHandlers = {
	get: readonlyGet,
	set(target, key) {
		console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
		return true;
	},
	deleteProperty(target, key) {
		console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
		return true;
	}
};
var toReactive = (value) => isObject(value) ? reactive2(value) : value;
var toReadonly = (value) => isObject(value) ? readonly(value) : value;
var toShallow = (value) => value;
var getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target, key, isReadonly = false, isShallow = false) {
	target = target["__v_raw"];
	const rawTarget = toRaw(target);
	const rawKey = toRaw(key);
	if (key !== rawKey) !isReadonly && track(rawTarget, "get", key);
	!isReadonly && track(rawTarget, "get", rawKey);
	const { has: has2 } = getProto(rawTarget);
	const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
	if (has2.call(rawTarget, key)) return wrap(target.get(key));
	else if (has2.call(rawTarget, rawKey)) return wrap(target.get(rawKey));
	else if (target !== rawTarget) target.get(key);
}
function has$1(key, isReadonly = false) {
	const target = this["__v_raw"];
	const rawTarget = toRaw(target);
	const rawKey = toRaw(key);
	if (key !== rawKey) !isReadonly && track(rawTarget, "has", key);
	!isReadonly && track(rawTarget, "has", rawKey);
	return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly = false) {
	target = target["__v_raw"];
	!isReadonly && track(toRaw(target), "iterate", ITERATE_KEY);
	return Reflect.get(target, "size", target);
}
function add(value) {
	value = toRaw(value);
	const target = toRaw(this);
	if (!getProto(target).has.call(target, value)) {
		target.add(value);
		trigger(target, "add", value, value);
	}
	return this;
}
function set$1(key, value) {
	value = toRaw(value);
	const target = toRaw(this);
	const { has: has2, get: get3 } = getProto(target);
	let hadKey = has2.call(target, key);
	if (!hadKey) {
		key = toRaw(key);
		hadKey = has2.call(target, key);
	} else checkIdentityKeys(target, has2, key);
	const oldValue = get3.call(target, key);
	target.set(key, value);
	if (!hadKey) trigger(target, "add", key, value);
	else if (hasChanged(value, oldValue)) trigger(target, "set", key, value, oldValue);
	return this;
}
function deleteEntry(key) {
	const target = toRaw(this);
	const { has: has2, get: get3 } = getProto(target);
	let hadKey = has2.call(target, key);
	if (!hadKey) {
		key = toRaw(key);
		hadKey = has2.call(target, key);
	} else checkIdentityKeys(target, has2, key);
	const oldValue = get3 ? get3.call(target, key) : void 0;
	const result = target.delete(key);
	if (hadKey) trigger(target, "delete", key, void 0, oldValue);
	return result;
}
function clear() {
	const target = toRaw(this);
	const hadItems = target.size !== 0;
	const oldTarget = isMap(target) ? new Map(target) : new Set(target);
	const result = target.clear();
	if (hadItems) trigger(target, "clear", void 0, void 0, oldTarget);
	return result;
}
function createForEach(isReadonly, isShallow) {
	return function forEach(callback, thisArg) {
		const observed = this;
		const target = observed["__v_raw"];
		const rawTarget = toRaw(target);
		const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
		!isReadonly && track(rawTarget, "iterate", ITERATE_KEY);
		return target.forEach((value, key) => {
			return callback.call(thisArg, wrap(value), wrap(key), observed);
		});
	};
}
function createIterableMethod(method, isReadonly, isShallow) {
	return function(...args) {
		const target = this["__v_raw"];
		const rawTarget = toRaw(target);
		const targetIsMap = isMap(rawTarget);
		const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
		const isKeyOnly = method === "keys" && targetIsMap;
		const innerIterator = target[method](...args);
		const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
		!isReadonly && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
		return {
			next() {
				const { value, done } = innerIterator.next();
				return done ? {
					value,
					done
				} : {
					value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
					done
				};
			},
			[Symbol.iterator]() {
				return this;
			}
		};
	};
}
function createReadonlyMethod(type) {
	return function(...args) {
		{
			const key = args[0] ? `on key "${args[0]}" ` : ``;
			console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
		}
		return type === "delete" ? false : this;
	};
}
function createInstrumentations() {
	const mutableInstrumentations2 = {
		get(key) {
			return get$1(this, key);
		},
		get size() {
			return size(this);
		},
		has: has$1,
		add,
		set: set$1,
		delete: deleteEntry,
		clear,
		forEach: createForEach(false, false)
	};
	const shallowInstrumentations2 = {
		get(key) {
			return get$1(this, key, false, true);
		},
		get size() {
			return size(this);
		},
		has: has$1,
		add,
		set: set$1,
		delete: deleteEntry,
		clear,
		forEach: createForEach(false, true)
	};
	const readonlyInstrumentations2 = {
		get(key) {
			return get$1(this, key, true);
		},
		get size() {
			return size(this, true);
		},
		has(key) {
			return has$1.call(this, key, true);
		},
		add: createReadonlyMethod("add"),
		set: createReadonlyMethod("set"),
		delete: createReadonlyMethod("delete"),
		clear: createReadonlyMethod("clear"),
		forEach: createForEach(true, false)
	};
	const shallowReadonlyInstrumentations2 = {
		get(key) {
			return get$1(this, key, true, true);
		},
		get size() {
			return size(this, true);
		},
		has(key) {
			return has$1.call(this, key, true);
		},
		add: createReadonlyMethod("add"),
		set: createReadonlyMethod("set"),
		delete: createReadonlyMethod("delete"),
		clear: createReadonlyMethod("clear"),
		forEach: createForEach(true, true)
	};
	[
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((method) => {
		mutableInstrumentations2[method] = createIterableMethod(method, false, false);
		readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
		shallowInstrumentations2[method] = createIterableMethod(method, false, true);
		shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
	});
	return [
		mutableInstrumentations2,
		readonlyInstrumentations2,
		shallowInstrumentations2,
		shallowReadonlyInstrumentations2
	];
}
var [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly, shallow) {
	const instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
	return (target, key, receiver) => {
		if (key === "__v_isReactive") return !isReadonly;
		else if (key === "__v_isReadonly") return isReadonly;
		else if (key === "__v_raw") return target;
		return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
	};
}
var mutableCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(false, false) };
var readonlyCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(true, false) };
function checkIdentityKeys(target, has2, key) {
	const rawKey = toRaw(key);
	if (rawKey !== key && has2.call(target, rawKey)) {
		const type = toRawType(target);
		console.warn(`Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
	}
}
var reactiveMap = /* @__PURE__ */ new WeakMap();
var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
var readonlyMap = /* @__PURE__ */ new WeakMap();
var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
	switch (rawType) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
function getTargetType(value) {
	return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive2(target) {
	if (target && target["__v_isReadonly"]) return target;
	return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function readonly(target) {
	return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
	if (!isObject(target)) {
		console.warn(`value cannot be made reactive: ${String(target)}`);
		return target;
	}
	if (target["__v_raw"] && !(isReadonly && target["__v_isReactive"])) return target;
	const existingProxy = proxyMap.get(target);
	if (existingProxy) return existingProxy;
	const targetType = getTargetType(target);
	if (targetType === 0) return target;
	const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
	proxyMap.set(target, proxy);
	return proxy;
}
function toRaw(observed) {
	return observed && toRaw(observed["__v_raw"]) || observed;
}
function isRef(r) {
	return Boolean(r && r.__v_isRef === true);
}
magic("nextTick", () => nextTick);
magic("dispatch", (el) => dispatch.bind(dispatch, el));
magic("watch", (el, { evaluateLater: evaluateLater2, cleanup: cleanup2 }) => (key, callback) => {
	let evaluate2 = evaluateLater2(key);
	let getter = () => {
		let value;
		evaluate2((i) => value = i);
		return value;
	};
	cleanup2(watch(getter, callback));
});
magic("store", getStores);
magic("data", (el) => scope(el));
magic("root", (el) => closestRoot(el));
magic("refs", (el) => {
	if (el._x_refs_proxy) return el._x_refs_proxy;
	el._x_refs_proxy = mergeProxies(getArrayOfRefObject(el));
	return el._x_refs_proxy;
});
function getArrayOfRefObject(el) {
	let refObjects = [];
	findClosest(el, (i) => {
		if (i._x_refs) refObjects.push(i._x_refs);
	});
	return refObjects;
}
var globalIdMemo = {};
function findAndIncrementId(name) {
	if (!globalIdMemo[name]) globalIdMemo[name] = 0;
	return ++globalIdMemo[name];
}
function closestIdRoot(el, name) {
	return findClosest(el, (element) => {
		if (element._x_ids && element._x_ids[name]) return true;
	});
}
function setIdRoot(el, name) {
	if (!el._x_ids) el._x_ids = {};
	if (!el._x_ids[name]) el._x_ids[name] = findAndIncrementId(name);
}
magic("id", (el, { cleanup: cleanup2 }) => (name, key = null) => {
	return cacheIdByNameOnElement(el, `${name}${key ? `-${key}` : ""}`, cleanup2, () => {
		let root = closestIdRoot(el, name);
		let id = root ? root._x_ids[name] : findAndIncrementId(name);
		return key ? `${name}-${id}-${key}` : `${name}-${id}`;
	});
});
interceptClone((from, to) => {
	if (from._x_id) to._x_id = from._x_id;
});
function cacheIdByNameOnElement(el, cacheKey, cleanup2, callback) {
	if (!el._x_id) el._x_id = {};
	if (el._x_id[cacheKey]) return el._x_id[cacheKey];
	let output = callback();
	el._x_id[cacheKey] = output;
	cleanup2(() => {
		delete el._x_id[cacheKey];
	});
	return output;
}
magic("el", (el) => el);
warnMissingPluginMagic("Focus", "focus", "focus");
warnMissingPluginMagic("Persist", "persist", "persist");
function warnMissingPluginMagic(name, magicName, slug) {
	magic(magicName, (el) => warn(`You can't use [$${magicName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
}
directive("modelable", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2, cleanup: cleanup2 }) => {
	let func = evaluateLater2(expression);
	let innerGet = () => {
		let result;
		func((i) => result = i);
		return result;
	};
	let evaluateInnerSet = evaluateLater2(`${expression} = __placeholder`);
	let innerSet = (val) => evaluateInnerSet(() => {}, { scope: { "__placeholder": val } });
	innerSet(innerGet());
	queueMicrotask(() => {
		if (!el._x_model) return;
		el._x_removeModelListeners["default"]();
		let outerGet = el._x_model.get;
		let outerSet = el._x_model.setWithModifiers;
		cleanup2(entangle({
			get() {
				return outerGet();
			},
			set(value) {
				outerSet(value);
			}
		}, {
			get() {
				return innerGet();
			},
			set(value) {
				innerSet(value);
			}
		}));
	});
});
directive("teleport", (el, { modifiers, expression }, { cleanup: cleanup2 }) => {
	if (el.tagName.toLowerCase() !== "template") warn("x-teleport can only be used on a <template> tag", el);
	let target = getTarget(expression);
	let clone2 = el.content.cloneNode(true).firstElementChild;
	el._x_teleport = clone2;
	clone2._x_teleportBack = el;
	el.setAttribute("data-teleport-template", true);
	clone2.setAttribute("data-teleport-target", true);
	if (el._x_forwardEvents) el._x_forwardEvents.forEach((eventName) => {
		clone2.addEventListener(eventName, (e) => {
			e.stopPropagation();
			el.dispatchEvent(new e.constructor(e.type, e));
		});
	});
	addScopeToNode(clone2, {}, el);
	let placeInDom = (clone3, target2, modifiers2) => {
		if (modifiers2.includes("prepend")) target2.parentNode.insertBefore(clone3, target2);
		else if (modifiers2.includes("append")) target2.parentNode.insertBefore(clone3, target2.nextSibling);
		else target2.appendChild(clone3);
	};
	mutateDom(() => {
		placeInDom(clone2, target, modifiers);
		skipDuringClone(() => {
			initTree(clone2);
		})();
	});
	el._x_teleportPutBack = () => {
		let target2 = getTarget(expression);
		mutateDom(() => {
			placeInDom(el._x_teleport, target2, modifiers);
		});
	};
	cleanup2(() => mutateDom(() => {
		clone2.remove();
		destroyTree(clone2);
	}));
});
var teleportContainerDuringClone = document.createElement("div");
function getTarget(expression) {
	let target = skipDuringClone(() => {
		return document.querySelector(expression);
	}, () => {
		return teleportContainerDuringClone;
	})();
	if (!target) warn(`Cannot find x-teleport element for selector: "${expression}"`);
	return target;
}
var handler = () => {};
handler.inline = (el, { modifiers }, { cleanup: cleanup2 }) => {
	modifiers.includes("self") ? el._x_ignoreSelf = true : el._x_ignore = true;
	cleanup2(() => {
		modifiers.includes("self") ? delete el._x_ignoreSelf : delete el._x_ignore;
	});
};
directive("ignore", handler);
directive("effect", skipDuringClone((el, { expression }, { effect: effect3 }) => {
	effect3(evaluateLater(el, expression));
}));
function on(el, event, modifiers, callback) {
	let listenerTarget = el;
	let handler4 = (e) => callback(e);
	let options = {};
	let wrapHandler = (callback2, wrapper) => (e) => wrapper(callback2, e);
	if (modifiers.includes("dot")) event = dotSyntax(event);
	if (modifiers.includes("camel")) event = camelCase2(event);
	if (modifiers.includes("capture")) options.capture = true;
	if (modifiers.includes("window")) listenerTarget = window;
	if (modifiers.includes("document")) listenerTarget = document;
	if (modifiers.includes("passive")) options.passive = modifiers[modifiers.indexOf("passive") + 1] !== "false";
	handler4 = addDebounceOrThrottle(modifiers, handler4);
	if (modifiers.includes("prevent")) handler4 = wrapHandler(handler4, (next, e) => {
		e.preventDefault();
		next(e);
	});
	if (modifiers.includes("stop")) handler4 = wrapHandler(handler4, (next, e) => {
		e.stopPropagation();
		next(e);
	});
	if (modifiers.includes("once")) handler4 = wrapHandler(handler4, (next, e) => {
		next(e);
		listenerTarget.removeEventListener(event, handler4, options);
	});
	if (modifiers.includes("away") || modifiers.includes("outside")) {
		listenerTarget = document;
		handler4 = wrapHandler(handler4, (next, e) => {
			if (el.contains(e.target)) return;
			if (e.target.isConnected === false) return;
			if (el.offsetWidth < 1 && el.offsetHeight < 1) return;
			if (el._x_isShown === false) return;
			next(e);
		});
	}
	if (modifiers.includes("self")) handler4 = wrapHandler(handler4, (next, e) => {
		e.target === el && next(e);
	});
	if (event === "submit") handler4 = wrapHandler(handler4, (next, e) => {
		if (e.target._x_pendingModelUpdates) e.target._x_pendingModelUpdates.forEach((fn) => fn());
		next(e);
	});
	if (isKeyEvent(event) || isClickEvent(event)) handler4 = wrapHandler(handler4, (next, e) => {
		if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) return;
		next(e);
	});
	listenerTarget.addEventListener(event, handler4, options);
	return () => {
		listenerTarget.removeEventListener(event, handler4, options);
	};
}
function addDebounceOrThrottle(modifiers, handler4) {
	if (modifiers.includes("debounce")) {
		let nextModifier = modifiers[modifiers.indexOf("debounce") + 1] || "invalid-wait";
		let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
		handler4 = debounce(handler4, wait);
	}
	if (modifiers.includes("throttle")) {
		let nextModifier = modifiers[modifiers.indexOf("throttle") + 1] || "invalid-wait";
		let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
		handler4 = throttle(handler4, wait);
	}
	return handler4;
}
function dotSyntax(subject) {
	return subject.replace(/-/g, ".");
}
function camelCase2(subject) {
	return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
}
function isNumeric(subject) {
	return !Array.isArray(subject) && !isNaN(subject);
}
function kebabCase2(subject) {
	if ([" ", "_"].includes(subject)) return subject;
	return subject.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function isKeyEvent(event) {
	return ["keydown", "keyup"].includes(event);
}
function isClickEvent(event) {
	return [
		"contextmenu",
		"click",
		"mouse"
	].some((i) => event.includes(i));
}
function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
	let keyModifiers = modifiers.filter((i) => {
		return ![
			"window",
			"document",
			"prevent",
			"stop",
			"once",
			"capture",
			"self",
			"away",
			"outside",
			"passive",
			"preserve-scroll",
			"blur",
			"change",
			"lazy"
		].includes(i);
	});
	if (keyModifiers.includes("debounce")) {
		let debounceIndex = keyModifiers.indexOf("debounce");
		keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
	}
	if (keyModifiers.includes("throttle")) {
		let debounceIndex = keyModifiers.indexOf("throttle");
		keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
	}
	if (keyModifiers.length === 0) return false;
	if (keyModifiers.length === 1 && keyToModifiers(e.key).includes(keyModifiers[0])) return false;
	const selectedSystemKeyModifiers = [
		"ctrl",
		"shift",
		"alt",
		"meta",
		"cmd",
		"super"
	].filter((modifier) => keyModifiers.includes(modifier));
	keyModifiers = keyModifiers.filter((i) => !selectedSystemKeyModifiers.includes(i));
	if (selectedSystemKeyModifiers.length > 0) {
		if (selectedSystemKeyModifiers.filter((modifier) => {
			if (modifier === "cmd" || modifier === "super") modifier = "meta";
			return e[`${modifier}Key`];
		}).length === selectedSystemKeyModifiers.length) {
			if (isClickEvent(e.type)) return false;
			if (keyToModifiers(e.key).includes(keyModifiers[0])) return false;
		}
	}
	return true;
}
function keyToModifiers(key) {
	if (!key) return [];
	key = kebabCase2(key);
	let modifierToKeyMap = {
		"ctrl": "control",
		"slash": "/",
		"space": " ",
		"spacebar": " ",
		"cmd": "meta",
		"esc": "escape",
		"up": "arrow-up",
		"down": "arrow-down",
		"left": "arrow-left",
		"right": "arrow-right",
		"period": ".",
		"comma": ",",
		"equal": "=",
		"minus": "-",
		"underscore": "_"
	};
	modifierToKeyMap[key] = key;
	return Object.keys(modifierToKeyMap).map((modifier) => {
		if (modifierToKeyMap[modifier] === key) return modifier;
	}).filter((modifier) => modifier);
}
directive("model", (el, { modifiers, expression }, { effect: effect3, cleanup: cleanup2 }) => {
	let scopeTarget = el;
	if (modifiers.includes("parent")) scopeTarget = findClosest(el, (element) => element !== el);
	let evaluateGet = evaluateLater(scopeTarget, expression);
	let evaluateSet;
	if (typeof expression === "string") evaluateSet = evaluateLater(scopeTarget, `${expression} = __placeholder`);
	else if (typeof expression === "function" && typeof expression() === "string") evaluateSet = evaluateLater(scopeTarget, `${expression()} = __placeholder`);
	else evaluateSet = () => {};
	let getValue = () => {
		let result;
		evaluateGet((value) => result = value);
		return isGetterSetter(result) ? result.get() : result;
	};
	let setValue = (value) => {
		let result;
		evaluateGet((value2) => result = value2);
		if (isGetterSetter(result)) result.set(value);
		else evaluateSet(() => {}, { scope: { "__placeholder": value } });
	};
	if (typeof expression === "string" && el.type === "radio") mutateDom(() => {
		if (!el.hasAttribute("name")) el.setAttribute("name", expression);
	});
	let hasChangeModifier = modifiers.includes("change") || modifiers.includes("lazy");
	let hasBlurModifier = modifiers.includes("blur");
	let hasEnterModifier = modifiers.includes("enter");
	let hasExplicitEventModifiers = hasChangeModifier || hasBlurModifier || hasEnterModifier;
	let removeListener;
	if (isCloning) removeListener = () => {};
	else if (hasExplicitEventModifiers) {
		let listeners = [];
		let syncValue = (e) => setValue(getInputValue(el, modifiers, e, getValue()));
		if (hasChangeModifier) listeners.push(on(el, "change", modifiers, syncValue));
		if (hasBlurModifier) {
			listeners.push(on(el, "blur", modifiers, syncValue));
			if (el.form) {
				let form = el.form;
				let syncCallback = () => syncValue({ target: el });
				if (!form._x_pendingModelUpdates) form._x_pendingModelUpdates = [];
				form._x_pendingModelUpdates.push(syncCallback);
				cleanup2(() => {
					if (form._x_pendingModelUpdates) form._x_pendingModelUpdates.splice(form._x_pendingModelUpdates.indexOf(syncCallback), 1);
				});
			}
		}
		if (hasEnterModifier) listeners.push(on(el, "keydown", modifiers, (e) => {
			if (e.key === "Enter") syncValue(e);
		}));
		removeListener = () => listeners.forEach((remove) => remove());
	} else removeListener = on(el, el.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(el.type) ? "change" : "input", modifiers, (e) => {
		setValue(getInputValue(el, modifiers, e, getValue()));
	});
	if (modifiers.includes("fill")) {
		if ([
			void 0,
			null,
			""
		].includes(getValue()) || isCheckbox(el) && Array.isArray(getValue()) || el.tagName.toLowerCase() === "select" && el.multiple) setValue(getInputValue(el, modifiers, { target: el }, getValue()));
	}
	if (!el._x_removeModelListeners) el._x_removeModelListeners = {};
	el._x_removeModelListeners["default"] = removeListener;
	cleanup2(() => el._x_removeModelListeners["default"]());
	if (el.form) {
		let removeResetListener = on(el.form, "reset", [], (e) => {
			nextTick(() => el._x_model && el._x_model.set(getInputValue(el, modifiers, { target: el }, getValue())));
		});
		cleanup2(() => removeResetListener());
	}
	el._x_model = {
		get() {
			return getValue();
		},
		set(value) {
			setValue(value);
		},
		setWithModifiers: addDebounceOrThrottle(modifiers, setValue)
	};
	el._x_forceModelUpdate = (value) => {
		if (value === void 0 && typeof expression === "string" && expression.match(/\./)) value = "";
		mutateDom(() => {
			if (isCheckbox(el)) {
				if (Array.isArray(value)) el.checked = value.some((val) => val == el.value);
				else el.checked = !!value;
			} else if (isRadio(el)) {
				if (typeof value === "boolean") el.checked = safeParseBoolean(el.value) === value;
				else el.checked = el.value == value;
			} else bind(el, "value", value);
		});
	};
	effect3(() => {
		let value = getValue();
		if (modifiers.includes("unintrusive") && document.activeElement.isSameNode(el)) return;
		el._x_forceModelUpdate(value);
	});
});
function getInputValue(el, modifiers, event, currentValue) {
	return mutateDom(() => {
		if (event instanceof CustomEvent && event.detail !== void 0) return event.detail !== null && event.detail !== void 0 ? event.detail : event.target.value;
		else if (isCheckbox(el)) {
			if (Array.isArray(currentValue)) {
				let newValue = null;
				if (modifiers.includes("number")) newValue = safeParseNumber(event.target.value);
				else if (modifiers.includes("boolean")) newValue = safeParseBoolean(event.target.value);
				else newValue = event.target.value;
				return event.target.checked ? currentValue.includes(newValue) ? currentValue : currentValue.concat([newValue]) : currentValue.filter((el2) => !checkedAttrLooseCompare2(el2, newValue));
			} else return event.target.checked;
		} else if (el.tagName.toLowerCase() === "select" && el.multiple) {
			if (modifiers.includes("number")) return Array.from(event.target.selectedOptions).map((option) => {
				return safeParseNumber(option.value || option.text);
			});
			else if (modifiers.includes("boolean")) return Array.from(event.target.selectedOptions).map((option) => {
				return safeParseBoolean(option.value || option.text);
			});
			return Array.from(event.target.selectedOptions).map((option) => {
				return option.value || option.text;
			});
		} else {
			let newValue;
			if (isRadio(el)) {
				if (event.target.checked) newValue = event.target.value;
				else newValue = currentValue;
			} else newValue = event.target.value;
			if (modifiers.includes("number")) return safeParseNumber(newValue);
			else if (modifiers.includes("boolean")) return safeParseBoolean(newValue);
			else if (modifiers.includes("trim")) return newValue.trim();
			else return newValue;
		}
	});
}
function safeParseNumber(rawValue) {
	let number = rawValue ? parseFloat(rawValue) : null;
	return isNumeric2(number) ? number : rawValue;
}
function checkedAttrLooseCompare2(valueA, valueB) {
	return valueA == valueB;
}
function isNumeric2(subject) {
	return !Array.isArray(subject) && !isNaN(subject);
}
function isGetterSetter(value) {
	return value !== null && typeof value === "object" && typeof value.get === "function" && typeof value.set === "function";
}
directive("cloak", (el) => queueMicrotask(() => mutateDom(() => el.removeAttribute(prefix("cloak")))));
addInitSelector(() => `[${prefix("init")}]`);
directive("init", skipDuringClone((el, { expression }, { evaluate: evaluate2 }) => {
	if (typeof expression === "string") return !!expression.trim() && evaluate2(expression, {}, false);
	return evaluate2(expression, {}, false);
}));
directive("text", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
	let evaluate2 = evaluateLater2(expression);
	effect3(() => {
		evaluate2((value) => {
			mutateDom(() => {
				el.textContent = value;
			});
		});
	});
});
directive("html", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
	let evaluate2 = evaluateLater2(expression);
	effect3(() => {
		evaluate2((value) => {
			mutateDom(() => {
				el.innerHTML = value ?? "";
				el._x_ignoreSelf = true;
				initTree(el);
				delete el._x_ignoreSelf;
			});
		});
	});
});
mapAttributes(startingWith(":", into(prefix("bind:"))));
var handler2 = (el, { value, modifiers, expression, original }, { effect: effect3, cleanup: cleanup2 }) => {
	if (!value) {
		let bindingProviders = {};
		injectBindingProviders(bindingProviders);
		evaluateLater(el, expression)((bindings) => {
			applyBindingsObject(el, bindings, original);
		}, { scope: bindingProviders });
		return;
	}
	if (value === "key") return storeKeyForXFor(el, expression);
	if (el._x_inlineBindings && el._x_inlineBindings[value] && el._x_inlineBindings[value].extract) return;
	let evaluate2 = evaluateLater(el, expression);
	effect3(() => evaluate2((result) => {
		if (result === void 0 && typeof expression === "string" && expression.match(/\./)) result = "";
		mutateDom(() => bind(el, value, result, modifiers));
	}));
	cleanup2(() => {
		el._x_undoAddedClasses && el._x_undoAddedClasses();
		el._x_undoAddedStyles && el._x_undoAddedStyles();
	});
};
handler2.inline = (el, { value, modifiers, expression }) => {
	if (!value) return;
	if (!el._x_inlineBindings) el._x_inlineBindings = {};
	el._x_inlineBindings[value] = {
		expression,
		extract: false
	};
};
directive("bind", handler2);
function storeKeyForXFor(el, expression) {
	el._x_keyExpression = expression;
}
addRootSelector(() => `[${prefix("data")}]`);
directive("data", (el, { expression }, { cleanup: cleanup2 }) => {
	if (shouldSkipRegisteringDataDuringClone(el)) return;
	expression = expression === "" ? "{}" : expression;
	let magicContext = {};
	injectMagics(magicContext, el);
	let dataProviderContext = {};
	injectDataProviders(dataProviderContext, magicContext);
	let data2 = evaluate(el, expression, { scope: dataProviderContext });
	if (data2 === void 0 || data2 === true) data2 = {};
	injectMagics(data2, el);
	let reactiveData = reactive(data2);
	initInterceptors(reactiveData);
	let undo = addScopeToNode(el, reactiveData);
	reactiveData["init"] && evaluate(el, reactiveData["init"]);
	cleanup2(() => {
		reactiveData["destroy"] && evaluate(el, reactiveData["destroy"]);
		undo();
	});
});
interceptClone((from, to) => {
	if (from._x_dataStack) {
		to._x_dataStack = from._x_dataStack;
		to.setAttribute("data-has-alpine-state", true);
	}
});
function shouldSkipRegisteringDataDuringClone(el) {
	if (!isCloning) return false;
	if (isCloningLegacy) return true;
	return el.hasAttribute("data-has-alpine-state");
}
directive("show", (el, { modifiers, expression }, { effect: effect3 }) => {
	let evaluate2 = evaluateLater(el, expression);
	if (!el._x_doHide) el._x_doHide = () => {
		mutateDom(() => {
			el.style.setProperty("display", "none", modifiers.includes("important") ? "important" : void 0);
		});
	};
	if (!el._x_doShow) el._x_doShow = () => {
		mutateDom(() => {
			if (el.style.length === 1 && el.style.display === "none") el.removeAttribute("style");
			else el.style.removeProperty("display");
		});
	};
	let hide = () => {
		el._x_doHide();
		el._x_isShown = false;
	};
	let show = () => {
		el._x_doShow();
		el._x_isShown = true;
	};
	let clickAwayCompatibleShow = () => setTimeout(show);
	let toggle = once((value) => value ? show() : hide(), (value) => {
		if (typeof el._x_toggleAndCascadeWithTransitions === "function") el._x_toggleAndCascadeWithTransitions(el, value, show, hide);
		else value ? clickAwayCompatibleShow() : hide();
	});
	let oldValue;
	let firstTime = true;
	effect3(() => evaluate2((value) => {
		if (!firstTime && value === oldValue) return;
		if (modifiers.includes("immediate")) value ? clickAwayCompatibleShow() : hide();
		toggle(value);
		oldValue = value;
		firstTime = false;
	}));
});
directive("for", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
	let iteratorNames = parseForExpression(expression);
	let evaluateItems = evaluateLater(el, iteratorNames.items);
	let evaluateKey = evaluateLater(el, el._x_keyExpression || "index");
	el._x_lookup = /* @__PURE__ */ new Map();
	effect3(() => loop(el, iteratorNames, evaluateItems, evaluateKey));
	cleanup2(() => {
		el._x_lookup.forEach((el2) => mutateDom(() => {
			destroyTree(el2);
			el2.remove();
		}));
		delete el._x_lookup;
	});
});
function refreshScope(scope2) {
	return (newScope) => {
		Object.entries(newScope).forEach(([key, value]) => {
			scope2[key] = value;
		});
	};
}
function loop(templateEl, iteratorNames, evaluateItems, evaluateKey) {
	evaluateItems((items) => {
		if (isNumeric3(items)) items = Array.from({ length: items }, (_, i) => i + 1);
		if (items === void 0) items = [];
		if (items instanceof Set) items = Array.from(items);
		if (items instanceof Map) items = Array.from(items);
		let oldLookup = templateEl._x_lookup;
		let lookup = /* @__PURE__ */ new Map();
		templateEl._x_lookup = lookup;
		let hasStringKeys = isObject2(items);
		let scopeEntries = Object.entries(items).map(([index, item]) => {
			if (!hasStringKeys) index = parseInt(index);
			let scope2 = getIterationScopeVariables(iteratorNames, item, index, items);
			let key;
			evaluateKey((innerKey) => {
				if (typeof innerKey === "object") warn("x-for key cannot be an object, it must be a string or an integer", templateEl);
				if (oldLookup.has(innerKey)) {
					lookup.set(innerKey, oldLookup.get(innerKey));
					oldLookup.delete(innerKey);
				}
				key = innerKey;
			}, { scope: {
				index,
				...scope2
			} });
			return [key, scope2];
		});
		mutateDom(() => {
			oldLookup.forEach((el) => {
				destroyTree(el);
				el.remove();
			});
			let added = /* @__PURE__ */ new Set();
			let prev = templateEl;
			scopeEntries.forEach(([key, scope2]) => {
				if (lookup.has(key)) {
					let el = lookup.get(key);
					el._x_refreshXForScope(scope2);
					if (prev.nextElementSibling !== el) {
						if (prev.nextElementSibling) el.replaceWith(prev.nextElementSibling);
						prev.after(el);
					}
					prev = el;
					if (el._x_currentIfEl) {
						if (el.nextElementSibling !== el._x_currentIfEl) prev.after(el._x_currentIfEl);
						prev = el._x_currentIfEl;
					}
					return;
				}
				if (templateEl.content.children.length > 1) warn("x-for templates require a single root element, additional elements will be ignored.", templateEl);
				let clone2 = document.importNode(templateEl.content, true).firstElementChild;
				let reactiveScope = reactive(scope2);
				addScopeToNode(clone2, reactiveScope, templateEl);
				clone2._x_refreshXForScope = refreshScope(reactiveScope);
				lookup.set(key, clone2);
				added.add(clone2);
				prev.after(clone2);
				prev = clone2;
			});
			skipDuringClone(() => added.forEach((clone2) => initTree(clone2)))();
		});
	});
}
function parseForExpression(expression) {
	let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
	let stripParensRE = /^\s*\(|\)\s*$/g;
	let inMatch = expression.match(/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/);
	if (!inMatch) return;
	let res = {};
	res.items = inMatch[2].trim();
	let item = inMatch[1].replace(stripParensRE, "").trim();
	let iteratorMatch = item.match(forIteratorRE);
	if (iteratorMatch) {
		res.item = item.replace(forIteratorRE, "").trim();
		res.index = iteratorMatch[1].trim();
		if (iteratorMatch[2]) res.collection = iteratorMatch[2].trim();
	} else res.item = item;
	return res;
}
function getIterationScopeVariables(iteratorNames, item, index, items) {
	let scopeVariables = {};
	if (/^\[.*\]$/.test(iteratorNames.item) && Array.isArray(item)) iteratorNames.item.replace("[", "").replace("]", "").split(",").map((i) => i.trim()).forEach((name, i) => {
		scopeVariables[name] = item[i];
	});
	else if (/^\{.*\}$/.test(iteratorNames.item) && !Array.isArray(item) && typeof item === "object") iteratorNames.item.replace("{", "").replace("}", "").split(",").map((i) => i.trim()).forEach((name) => {
		scopeVariables[name] = item[name];
	});
	else scopeVariables[iteratorNames.item] = item;
	if (iteratorNames.index) scopeVariables[iteratorNames.index] = index;
	if (iteratorNames.collection) scopeVariables[iteratorNames.collection] = items;
	return scopeVariables;
}
function isNumeric3(subject) {
	return !Array.isArray(subject) && !isNaN(subject);
}
function isObject2(subject) {
	return typeof subject === "object" && !Array.isArray(subject);
}
function handler3() {}
handler3.inline = (el, { expression }, { cleanup: cleanup2 }) => {
	let root = closestRoot(el);
	if (!root) return;
	if (!root._x_refs) root._x_refs = {};
	root._x_refs[expression] = el;
	cleanup2(() => delete root._x_refs[expression]);
};
directive("ref", handler3);
directive("if", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
	if (el.tagName.toLowerCase() !== "template") warn("x-if can only be used on a <template> tag", el);
	let evaluate2 = evaluateLater(el, expression);
	let show = () => {
		if (el._x_currentIfEl) return el._x_currentIfEl;
		let clone2 = el.content.cloneNode(true).firstElementChild;
		addScopeToNode(clone2, {}, el);
		mutateDom(() => {
			el.after(clone2);
			skipDuringClone(() => initTree(clone2))();
		});
		el._x_currentIfEl = clone2;
		el._x_undoIf = () => {
			mutateDom(() => {
				destroyTree(clone2);
				clone2.remove();
			});
			delete el._x_currentIfEl;
		};
		return clone2;
	};
	let hide = () => {
		if (!el._x_undoIf) return;
		el._x_undoIf();
		delete el._x_undoIf;
	};
	effect3(() => evaluate2((value) => {
		value ? show() : hide();
	}));
	cleanup2(() => el._x_undoIf && el._x_undoIf());
});
directive("id", (el, { expression }, { evaluate: evaluate2 }) => {
	evaluate2(expression).forEach((name) => setIdRoot(el, name));
});
interceptClone((from, to) => {
	if (from._x_ids) to._x_ids = from._x_ids;
});
mapAttributes(startingWith("@", into(prefix("on:"))));
directive("on", skipDuringClone((el, { value, modifiers, expression }, { cleanup: cleanup2 }) => {
	let evaluate2 = expression ? evaluateLater(el, expression) : () => {};
	if (el.tagName.toLowerCase() === "template") {
		if (!el._x_forwardEvents) el._x_forwardEvents = [];
		if (!el._x_forwardEvents.includes(value)) el._x_forwardEvents.push(value);
	}
	let removeListener = on(el, value, modifiers, (e) => {
		evaluate2(() => {}, {
			scope: { "$event": e },
			params: [e]
		});
	});
	cleanup2(() => removeListener());
}));
warnMissingPluginDirective("Collapse", "collapse", "collapse");
warnMissingPluginDirective("Intersect", "intersect", "intersect");
warnMissingPluginDirective("Focus", "trap", "focus");
warnMissingPluginDirective("Mask", "mask", "mask");
function warnMissingPluginDirective(name, directiveName, slug) {
	directive(directiveName, (el) => warn(`You can't use [x-${directiveName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
}
alpine_default.setEvaluator(normalEvaluator);
alpine_default.setRawEvaluator(normalRawEvaluator);
alpine_default.setReactivityEngine({
	reactive: reactive2,
	effect: effect2,
	release: stop,
	raw: toRaw
});
var src_default = alpine_default;
var module_default = src_default;

//#endregion
//#region src/js/vendor.alpinejs.ts
var vendor_alpinejs_default = module_default;

//#endregion
export { src_default as Alpine, vendor_alpinejs_default as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVuZG9yLmFscGluZWpzLmpzIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9hbHBpbmVqcy9kaXN0L21vZHVsZS5lc20uanMiLCIuLi9zcmMvanMvdmVuZG9yLmFscGluZWpzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9zY2hlZHVsZXIuanNcbnZhciBmbHVzaFBlbmRpbmcgPSBmYWxzZTtcbnZhciBmbHVzaGluZyA9IGZhbHNlO1xudmFyIHF1ZXVlID0gW107XG52YXIgbGFzdEZsdXNoZWRJbmRleCA9IC0xO1xudmFyIHRyYW5zYWN0aW9uQWN0aXZlID0gZmFsc2U7XG5mdW5jdGlvbiBzY2hlZHVsZXIoY2FsbGJhY2spIHtcbiAgcXVldWVKb2IoY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gc3RhcnRUcmFuc2FjdGlvbigpIHtcbiAgdHJhbnNhY3Rpb25BY3RpdmUgPSB0cnVlO1xufVxuZnVuY3Rpb24gY29tbWl0VHJhbnNhY3Rpb24oKSB7XG4gIHRyYW5zYWN0aW9uQWN0aXZlID0gZmFsc2U7XG4gIHF1ZXVlRmx1c2goKTtcbn1cbmZ1bmN0aW9uIHF1ZXVlSm9iKGpvYikge1xuICBpZiAoIXF1ZXVlLmluY2x1ZGVzKGpvYikpXG4gICAgcXVldWUucHVzaChqb2IpO1xuICBxdWV1ZUZsdXNoKCk7XG59XG5mdW5jdGlvbiBkZXF1ZXVlSm9iKGpvYikge1xuICBsZXQgaW5kZXggPSBxdWV1ZS5pbmRleE9mKGpvYik7XG4gIGlmIChpbmRleCAhPT0gLTEgJiYgaW5kZXggPiBsYXN0Rmx1c2hlZEluZGV4KVxuICAgIHF1ZXVlLnNwbGljZShpbmRleCwgMSk7XG59XG5mdW5jdGlvbiBxdWV1ZUZsdXNoKCkge1xuICBpZiAoIWZsdXNoaW5nICYmICFmbHVzaFBlbmRpbmcpIHtcbiAgICBpZiAodHJhbnNhY3Rpb25BY3RpdmUpXG4gICAgICByZXR1cm47XG4gICAgZmx1c2hQZW5kaW5nID0gdHJ1ZTtcbiAgICBxdWV1ZU1pY3JvdGFzayhmbHVzaEpvYnMpO1xuICB9XG59XG5mdW5jdGlvbiBmbHVzaEpvYnMoKSB7XG4gIGZsdXNoUGVuZGluZyA9IGZhbHNlO1xuICBmbHVzaGluZyA9IHRydWU7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICBxdWV1ZVtpXSgpO1xuICAgIGxhc3RGbHVzaGVkSW5kZXggPSBpO1xuICB9XG4gIHF1ZXVlLmxlbmd0aCA9IDA7XG4gIGxhc3RGbHVzaGVkSW5kZXggPSAtMTtcbiAgZmx1c2hpbmcgPSBmYWxzZTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3JlYWN0aXZpdHkuanNcbnZhciByZWFjdGl2ZTtcbnZhciBlZmZlY3Q7XG52YXIgcmVsZWFzZTtcbnZhciByYXc7XG52YXIgc2hvdWxkU2NoZWR1bGUgPSB0cnVlO1xuZnVuY3Rpb24gZGlzYWJsZUVmZmVjdFNjaGVkdWxpbmcoY2FsbGJhY2spIHtcbiAgc2hvdWxkU2NoZWR1bGUgPSBmYWxzZTtcbiAgY2FsbGJhY2soKTtcbiAgc2hvdWxkU2NoZWR1bGUgPSB0cnVlO1xufVxuZnVuY3Rpb24gc2V0UmVhY3Rpdml0eUVuZ2luZShlbmdpbmUpIHtcbiAgcmVhY3RpdmUgPSBlbmdpbmUucmVhY3RpdmU7XG4gIHJlbGVhc2UgPSBlbmdpbmUucmVsZWFzZTtcbiAgZWZmZWN0ID0gKGNhbGxiYWNrKSA9PiBlbmdpbmUuZWZmZWN0KGNhbGxiYWNrLCB7IHNjaGVkdWxlcjogKHRhc2spID0+IHtcbiAgICBpZiAoc2hvdWxkU2NoZWR1bGUpIHtcbiAgICAgIHNjaGVkdWxlcih0YXNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFzaygpO1xuICAgIH1cbiAgfSB9KTtcbiAgcmF3ID0gZW5naW5lLnJhdztcbn1cbmZ1bmN0aW9uIG92ZXJyaWRlRWZmZWN0KG92ZXJyaWRlKSB7XG4gIGVmZmVjdCA9IG92ZXJyaWRlO1xufVxuZnVuY3Rpb24gZWxlbWVudEJvdW5kRWZmZWN0KGVsKSB7XG4gIGxldCBjbGVhbnVwMiA9ICgpID0+IHtcbiAgfTtcbiAgbGV0IHdyYXBwZWRFZmZlY3QgPSAoY2FsbGJhY2spID0+IHtcbiAgICBsZXQgZWZmZWN0UmVmZXJlbmNlID0gZWZmZWN0KGNhbGxiYWNrKTtcbiAgICBpZiAoIWVsLl94X2VmZmVjdHMpIHtcbiAgICAgIGVsLl94X2VmZmVjdHMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuICAgICAgZWwuX3hfcnVuRWZmZWN0cyA9ICgpID0+IHtcbiAgICAgICAgZWwuX3hfZWZmZWN0cy5mb3JFYWNoKChpKSA9PiBpKCkpO1xuICAgICAgfTtcbiAgICB9XG4gICAgZWwuX3hfZWZmZWN0cy5hZGQoZWZmZWN0UmVmZXJlbmNlKTtcbiAgICBjbGVhbnVwMiA9ICgpID0+IHtcbiAgICAgIGlmIChlZmZlY3RSZWZlcmVuY2UgPT09IHZvaWQgMClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgZWwuX3hfZWZmZWN0cy5kZWxldGUoZWZmZWN0UmVmZXJlbmNlKTtcbiAgICAgIHJlbGVhc2UoZWZmZWN0UmVmZXJlbmNlKTtcbiAgICB9O1xuICAgIHJldHVybiBlZmZlY3RSZWZlcmVuY2U7XG4gIH07XG4gIHJldHVybiBbd3JhcHBlZEVmZmVjdCwgKCkgPT4ge1xuICAgIGNsZWFudXAyKCk7XG4gIH1dO1xufVxuZnVuY3Rpb24gd2F0Y2goZ2V0dGVyLCBjYWxsYmFjaykge1xuICBsZXQgZmlyc3RUaW1lID0gdHJ1ZTtcbiAgbGV0IG9sZFZhbHVlO1xuICBsZXQgb2xkVmFsdWVKU09OO1xuICBsZXQgZWZmZWN0UmVmZXJlbmNlID0gZWZmZWN0KCgpID0+IHtcbiAgICBsZXQgdmFsdWUgPSBnZXR0ZXIoKTtcbiAgICBsZXQgbmV3SlNPTiA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICBpZiAoIWZpcnN0VGltZSkge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiB8fCB2YWx1ZSAhPT0gb2xkVmFsdWUpIHtcbiAgICAgICAgbGV0IHByZXZpb3VzVmFsdWUgPSB0eXBlb2Ygb2xkVmFsdWUgPT09IFwib2JqZWN0XCIgPyBKU09OLnBhcnNlKG9sZFZhbHVlSlNPTikgOiBvbGRWYWx1ZTtcbiAgICAgICAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgICAgICAgIGNhbGxiYWNrKHZhbHVlLCBwcmV2aW91c1ZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIG9sZFZhbHVlID0gdmFsdWU7XG4gICAgb2xkVmFsdWVKU09OID0gbmV3SlNPTjtcbiAgICBmaXJzdFRpbWUgPSBmYWxzZTtcbiAgfSk7XG4gIHJldHVybiAoKSA9PiByZWxlYXNlKGVmZmVjdFJlZmVyZW5jZSk7XG59XG5hc3luYyBmdW5jdGlvbiB0cmFuc2FjdGlvbihjYWxsYmFjaykge1xuICBzdGFydFRyYW5zYWN0aW9uKCk7XG4gIHRyeSB7XG4gICAgYXdhaXQgY2FsbGJhY2soKTtcbiAgICBhd2FpdCBQcm9taXNlLnJlc29sdmUoKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjb21taXRUcmFuc2FjdGlvbigpO1xuICB9XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tdXRhdGlvbi5qc1xudmFyIG9uQXR0cmlidXRlQWRkZWRzID0gW107XG52YXIgb25FbFJlbW92ZWRzID0gW107XG52YXIgb25FbEFkZGVkcyA9IFtdO1xuZnVuY3Rpb24gb25FbEFkZGVkKGNhbGxiYWNrKSB7XG4gIG9uRWxBZGRlZHMucHVzaChjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBvbkVsUmVtb3ZlZChlbCwgY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgaWYgKCFlbC5feF9jbGVhbnVwcylcbiAgICAgIGVsLl94X2NsZWFudXBzID0gW107XG4gICAgZWwuX3hfY2xlYW51cHMucHVzaChjYWxsYmFjayk7XG4gIH0gZWxzZSB7XG4gICAgY2FsbGJhY2sgPSBlbDtcbiAgICBvbkVsUmVtb3ZlZHMucHVzaChjYWxsYmFjayk7XG4gIH1cbn1cbmZ1bmN0aW9uIG9uQXR0cmlidXRlc0FkZGVkKGNhbGxiYWNrKSB7XG4gIG9uQXR0cmlidXRlQWRkZWRzLnB1c2goY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gb25BdHRyaWJ1dGVSZW1vdmVkKGVsLCBuYW1lLCBjYWxsYmFjaykge1xuICBpZiAoIWVsLl94X2F0dHJpYnV0ZUNsZWFudXBzKVxuICAgIGVsLl94X2F0dHJpYnV0ZUNsZWFudXBzID0ge307XG4gIGlmICghZWwuX3hfYXR0cmlidXRlQ2xlYW51cHNbbmFtZV0pXG4gICAgZWwuX3hfYXR0cmlidXRlQ2xlYW51cHNbbmFtZV0gPSBbXTtcbiAgZWwuX3hfYXR0cmlidXRlQ2xlYW51cHNbbmFtZV0ucHVzaChjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBjbGVhbnVwQXR0cmlidXRlcyhlbCwgbmFtZXMpIHtcbiAgaWYgKCFlbC5feF9hdHRyaWJ1dGVDbGVhbnVwcylcbiAgICByZXR1cm47XG4gIE9iamVjdC5lbnRyaWVzKGVsLl94X2F0dHJpYnV0ZUNsZWFudXBzKS5mb3JFYWNoKChbbmFtZSwgdmFsdWVdKSA9PiB7XG4gICAgaWYgKG5hbWVzID09PSB2b2lkIDAgfHwgbmFtZXMuaW5jbHVkZXMobmFtZSkpIHtcbiAgICAgIHZhbHVlLmZvckVhY2goKGkpID0+IGkoKSk7XG4gICAgICBkZWxldGUgZWwuX3hfYXR0cmlidXRlQ2xlYW51cHNbbmFtZV07XG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIGNsZWFudXBFbGVtZW50KGVsKSB7XG4gIGVsLl94X2VmZmVjdHM/LmZvckVhY2goZGVxdWV1ZUpvYik7XG4gIHdoaWxlIChlbC5feF9jbGVhbnVwcz8ubGVuZ3RoKVxuICAgIGVsLl94X2NsZWFudXBzLnBvcCgpKCk7XG59XG52YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihvbk11dGF0ZSk7XG52YXIgY3VycmVudGx5T2JzZXJ2aW5nID0gZmFsc2U7XG5mdW5jdGlvbiBzdGFydE9ic2VydmluZ011dGF0aW9ucygpIHtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudCwgeyBzdWJ0cmVlOiB0cnVlLCBjaGlsZExpc3Q6IHRydWUsIGF0dHJpYnV0ZXM6IHRydWUsIGF0dHJpYnV0ZU9sZFZhbHVlOiB0cnVlIH0pO1xuICBjdXJyZW50bHlPYnNlcnZpbmcgPSB0cnVlO1xufVxuZnVuY3Rpb24gc3RvcE9ic2VydmluZ011dGF0aW9ucygpIHtcbiAgZmx1c2hPYnNlcnZlcigpO1xuICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gIGN1cnJlbnRseU9ic2VydmluZyA9IGZhbHNlO1xufVxudmFyIHF1ZXVlZE11dGF0aW9ucyA9IFtdO1xuZnVuY3Rpb24gZmx1c2hPYnNlcnZlcigpIHtcbiAgbGV0IHJlY29yZHMgPSBvYnNlcnZlci50YWtlUmVjb3JkcygpO1xuICBxdWV1ZWRNdXRhdGlvbnMucHVzaCgoKSA9PiByZWNvcmRzLmxlbmd0aCA+IDAgJiYgb25NdXRhdGUocmVjb3JkcykpO1xuICBsZXQgcXVldWVMZW5ndGhXaGVuVHJpZ2dlcmVkID0gcXVldWVkTXV0YXRpb25zLmxlbmd0aDtcbiAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgIGlmIChxdWV1ZWRNdXRhdGlvbnMubGVuZ3RoID09PSBxdWV1ZUxlbmd0aFdoZW5UcmlnZ2VyZWQpIHtcbiAgICAgIHdoaWxlIChxdWV1ZWRNdXRhdGlvbnMubGVuZ3RoID4gMClcbiAgICAgICAgcXVldWVkTXV0YXRpb25zLnNoaWZ0KCkoKTtcbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gbXV0YXRlRG9tKGNhbGxiYWNrKSB7XG4gIGlmICghY3VycmVudGx5T2JzZXJ2aW5nKVxuICAgIHJldHVybiBjYWxsYmFjaygpO1xuICBzdG9wT2JzZXJ2aW5nTXV0YXRpb25zKCk7XG4gIGxldCByZXN1bHQgPSBjYWxsYmFjaygpO1xuICBzdGFydE9ic2VydmluZ011dGF0aW9ucygpO1xuICByZXR1cm4gcmVzdWx0O1xufVxudmFyIGlzQ29sbGVjdGluZyA9IGZhbHNlO1xudmFyIGRlZmVycmVkTXV0YXRpb25zID0gW107XG5mdW5jdGlvbiBkZWZlck11dGF0aW9ucygpIHtcbiAgaXNDb2xsZWN0aW5nID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGZsdXNoQW5kU3RvcERlZmVycmluZ011dGF0aW9ucygpIHtcbiAgaXNDb2xsZWN0aW5nID0gZmFsc2U7XG4gIG9uTXV0YXRlKGRlZmVycmVkTXV0YXRpb25zKTtcbiAgZGVmZXJyZWRNdXRhdGlvbnMgPSBbXTtcbn1cbmZ1bmN0aW9uIG9uTXV0YXRlKG11dGF0aW9ucykge1xuICBpZiAoaXNDb2xsZWN0aW5nKSB7XG4gICAgZGVmZXJyZWRNdXRhdGlvbnMgPSBkZWZlcnJlZE11dGF0aW9ucy5jb25jYXQobXV0YXRpb25zKTtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IGFkZGVkTm9kZXMgPSBbXTtcbiAgbGV0IHJlbW92ZWROb2RlcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG4gIGxldCBhZGRlZEF0dHJpYnV0ZXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuICBsZXQgcmVtb3ZlZEF0dHJpYnV0ZXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG11dGF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChtdXRhdGlvbnNbaV0udGFyZ2V0Ll94X2lnbm9yZU11dGF0aW9uT2JzZXJ2ZXIpXG4gICAgICBjb250aW51ZTtcbiAgICBpZiAobXV0YXRpb25zW2ldLnR5cGUgPT09IFwiY2hpbGRMaXN0XCIpIHtcbiAgICAgIG11dGF0aW9uc1tpXS5yZW1vdmVkTm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gMSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmICghbm9kZS5feF9tYXJrZXIpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICByZW1vdmVkTm9kZXMuYWRkKG5vZGUpO1xuICAgICAgfSk7XG4gICAgICBtdXRhdGlvbnNbaV0uYWRkZWROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgIGlmIChub2RlLm5vZGVUeXBlICE9PSAxKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHJlbW92ZWROb2Rlcy5oYXMobm9kZSkpIHtcbiAgICAgICAgICByZW1vdmVkTm9kZXMuZGVsZXRlKG5vZGUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5feF9tYXJrZXIpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICBhZGRlZE5vZGVzLnB1c2gobm9kZSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG11dGF0aW9uc1tpXS50eXBlID09PSBcImF0dHJpYnV0ZXNcIikge1xuICAgICAgbGV0IGVsID0gbXV0YXRpb25zW2ldLnRhcmdldDtcbiAgICAgIGxldCBuYW1lID0gbXV0YXRpb25zW2ldLmF0dHJpYnV0ZU5hbWU7XG4gICAgICBsZXQgb2xkVmFsdWUgPSBtdXRhdGlvbnNbaV0ub2xkVmFsdWU7XG4gICAgICBsZXQgYWRkMiA9ICgpID0+IHtcbiAgICAgICAgaWYgKCFhZGRlZEF0dHJpYnV0ZXMuaGFzKGVsKSlcbiAgICAgICAgICBhZGRlZEF0dHJpYnV0ZXMuc2V0KGVsLCBbXSk7XG4gICAgICAgIGFkZGVkQXR0cmlidXRlcy5nZXQoZWwpLnB1c2goeyBuYW1lLCB2YWx1ZTogZWwuZ2V0QXR0cmlidXRlKG5hbWUpIH0pO1xuICAgICAgfTtcbiAgICAgIGxldCByZW1vdmUgPSAoKSA9PiB7XG4gICAgICAgIGlmICghcmVtb3ZlZEF0dHJpYnV0ZXMuaGFzKGVsKSlcbiAgICAgICAgICByZW1vdmVkQXR0cmlidXRlcy5zZXQoZWwsIFtdKTtcbiAgICAgICAgcmVtb3ZlZEF0dHJpYnV0ZXMuZ2V0KGVsKS5wdXNoKG5hbWUpO1xuICAgICAgfTtcbiAgICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUobmFtZSkgJiYgb2xkVmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgYWRkMigpO1xuICAgICAgfSBlbHNlIGlmIChlbC5oYXNBdHRyaWJ1dGUobmFtZSkpIHtcbiAgICAgICAgcmVtb3ZlKCk7XG4gICAgICAgIGFkZDIoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbW92ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZW1vdmVkQXR0cmlidXRlcy5mb3JFYWNoKChhdHRycywgZWwpID0+IHtcbiAgICBjbGVhbnVwQXR0cmlidXRlcyhlbCwgYXR0cnMpO1xuICB9KTtcbiAgYWRkZWRBdHRyaWJ1dGVzLmZvckVhY2goKGF0dHJzLCBlbCkgPT4ge1xuICAgIG9uQXR0cmlidXRlQWRkZWRzLmZvckVhY2goKGkpID0+IGkoZWwsIGF0dHJzKSk7XG4gIH0pO1xuICBmb3IgKGxldCBub2RlIG9mIHJlbW92ZWROb2Rlcykge1xuICAgIGlmIChhZGRlZE5vZGVzLnNvbWUoKGkpID0+IGkuY29udGFpbnMobm9kZSkpKVxuICAgICAgY29udGludWU7XG4gICAgb25FbFJlbW92ZWRzLmZvckVhY2goKGkpID0+IGkobm9kZSkpO1xuICB9XG4gIGZvciAobGV0IG5vZGUgb2YgYWRkZWROb2Rlcykge1xuICAgIGlmICghbm9kZS5pc0Nvbm5lY3RlZClcbiAgICAgIGNvbnRpbnVlO1xuICAgIG9uRWxBZGRlZHMuZm9yRWFjaCgoaSkgPT4gaShub2RlKSk7XG4gIH1cbiAgYWRkZWROb2RlcyA9IG51bGw7XG4gIHJlbW92ZWROb2RlcyA9IG51bGw7XG4gIGFkZGVkQXR0cmlidXRlcyA9IG51bGw7XG4gIHJlbW92ZWRBdHRyaWJ1dGVzID0gbnVsbDtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3Njb3BlLmpzXG5mdW5jdGlvbiBzY29wZShub2RlKSB7XG4gIHJldHVybiBtZXJnZVByb3hpZXMoY2xvc2VzdERhdGFTdGFjayhub2RlKSk7XG59XG5mdW5jdGlvbiBhZGRTY29wZVRvTm9kZShub2RlLCBkYXRhMiwgcmVmZXJlbmNlTm9kZSkge1xuICBub2RlLl94X2RhdGFTdGFjayA9IFtkYXRhMiwgLi4uY2xvc2VzdERhdGFTdGFjayhyZWZlcmVuY2VOb2RlIHx8IG5vZGUpXTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBub2RlLl94X2RhdGFTdGFjayA9IG5vZGUuX3hfZGF0YVN0YWNrLmZpbHRlcigoaSkgPT4gaSAhPT0gZGF0YTIpO1xuICB9O1xufVxuZnVuY3Rpb24gY2xvc2VzdERhdGFTdGFjayhub2RlKSB7XG4gIGlmIChub2RlLl94X2RhdGFTdGFjaylcbiAgICByZXR1cm4gbm9kZS5feF9kYXRhU3RhY2s7XG4gIGlmICh0eXBlb2YgU2hhZG93Um9vdCA9PT0gXCJmdW5jdGlvblwiICYmIG5vZGUgaW5zdGFuY2VvZiBTaGFkb3dSb290KSB7XG4gICAgcmV0dXJuIGNsb3Nlc3REYXRhU3RhY2sobm9kZS5ob3N0KTtcbiAgfVxuICBpZiAoIW5vZGUucGFyZW50Tm9kZSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICByZXR1cm4gY2xvc2VzdERhdGFTdGFjayhub2RlLnBhcmVudE5vZGUpO1xufVxuZnVuY3Rpb24gbWVyZ2VQcm94aWVzKG9iamVjdHMpIHtcbiAgcmV0dXJuIG5ldyBQcm94eSh7IG9iamVjdHMgfSwgbWVyZ2VQcm94eVRyYXApO1xufVxuZnVuY3Rpb24ga2V5SW5Qcm90b3R5cGVDaGFpbihvYmosIGtleSkge1xuICBpZiAob2JqID09PSBudWxsIHx8IG9iaiA9PT0gT2JqZWN0LnByb3RvdHlwZSlcbiAgICByZXR1cm4gbnVsbDtcbiAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpXG4gICAgcmV0dXJuIG9iajtcbiAgcmV0dXJuIGtleUluUHJvdG90eXBlQ2hhaW4oT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaiksIGtleSk7XG59XG52YXIgbWVyZ2VQcm94eVRyYXAgPSB7XG4gIG93bktleXMoeyBvYmplY3RzIH0pIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShcbiAgICAgIG5ldyBTZXQob2JqZWN0cy5mbGF0TWFwKChpKSA9PiBPYmplY3Qua2V5cyhpKSkpXG4gICAgKTtcbiAgfSxcbiAgaGFzKHsgb2JqZWN0cyB9LCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgPT0gU3ltYm9sLnVuc2NvcGFibGVzKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiBvYmplY3RzLnNvbWUoXG4gICAgICAob2JqKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBuYW1lKSB8fCBSZWZsZWN0LmhhcyhvYmosIG5hbWUpXG4gICAgKTtcbiAgfSxcbiAgZ2V0KHsgb2JqZWN0cyB9LCBuYW1lLCB0aGlzUHJveHkpIHtcbiAgICBpZiAobmFtZSA9PSBcInRvSlNPTlwiKVxuICAgICAgcmV0dXJuIGNvbGxhcHNlUHJveGllcztcbiAgICByZXR1cm4gUmVmbGVjdC5nZXQoXG4gICAgICBvYmplY3RzLmZpbmQoXG4gICAgICAgIChvYmopID0+IFJlZmxlY3QuaGFzKG9iaiwgbmFtZSlcbiAgICAgICkgfHwge30sXG4gICAgICBuYW1lLFxuICAgICAgdGhpc1Byb3h5XG4gICAgKTtcbiAgfSxcbiAgc2V0KHsgb2JqZWN0cyB9LCBuYW1lLCB2YWx1ZSwgdGhpc1Byb3h5KSB7XG4gICAgbGV0IHRhcmdldDtcbiAgICBmb3IgKGNvbnN0IG9iaiBvZiBvYmplY3RzKSB7XG4gICAgICB0YXJnZXQgPSBrZXlJblByb3RvdHlwZUNoYWluKG9iaiwgbmFtZSk7XG4gICAgICBpZiAodGFyZ2V0KVxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKCF0YXJnZXQpXG4gICAgICB0YXJnZXQgPSBvYmplY3RzW29iamVjdHMubGVuZ3RoIC0gMV07XG4gICAgY29uc3QgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKTtcbiAgICBpZiAoZGVzY3JpcHRvcj8uc2V0ICYmIGRlc2NyaXB0b3I/LmdldClcbiAgICAgIHJldHVybiBkZXNjcmlwdG9yLnNldC5jYWxsKHRoaXNQcm94eSwgdmFsdWUpIHx8IHRydWU7XG4gICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpO1xuICB9XG59O1xuZnVuY3Rpb24gY29sbGFwc2VQcm94aWVzKCkge1xuICBsZXQga2V5cyA9IFJlZmxlY3Qub3duS2V5cyh0aGlzKTtcbiAgcmV0dXJuIGtleXMucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgIGFjY1trZXldID0gUmVmbGVjdC5nZXQodGhpcywga2V5KTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9pbnRlcmNlcHRvci5qc1xuZnVuY3Rpb24gaW5pdEludGVyY2VwdG9ycyhkYXRhMikge1xuICBsZXQgaXNPYmplY3QzID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWwpICYmIHZhbCAhPT0gbnVsbDtcbiAgbGV0IHJlY3Vyc2UgPSAob2JqLCBiYXNlUGF0aCA9IFwiXCIpID0+IHtcbiAgICBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhvYmopKS5mb3JFYWNoKChba2V5LCB7IHZhbHVlLCBlbnVtZXJhYmxlIH1dKSA9PiB7XG4gICAgICBpZiAoZW51bWVyYWJsZSA9PT0gZmFsc2UgfHwgdmFsdWUgPT09IHZvaWQgMClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZS5fX3Zfc2tpcClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgbGV0IHBhdGggPSBiYXNlUGF0aCA9PT0gXCJcIiA/IGtleSA6IGAke2Jhc2VQYXRofS4ke2tleX1gO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZS5feF9pbnRlcmNlcHRvcikge1xuICAgICAgICBvYmpba2V5XSA9IHZhbHVlLmluaXRpYWxpemUoZGF0YTIsIHBhdGgsIGtleSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNPYmplY3QzKHZhbHVlKSAmJiB2YWx1ZSAhPT0gb2JqICYmICEodmFsdWUgaW5zdGFuY2VvZiBFbGVtZW50KSkge1xuICAgICAgICAgIHJlY3Vyc2UodmFsdWUsIHBhdGgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiByZWN1cnNlKGRhdGEyKTtcbn1cbmZ1bmN0aW9uIGludGVyY2VwdG9yKGNhbGxiYWNrLCBtdXRhdGVPYmogPSAoKSA9PiB7XG59KSB7XG4gIGxldCBvYmogPSB7XG4gICAgaW5pdGlhbFZhbHVlOiB2b2lkIDAsXG4gICAgX3hfaW50ZXJjZXB0b3I6IHRydWUsXG4gICAgaW5pdGlhbGl6ZShkYXRhMiwgcGF0aCwga2V5KSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2sodGhpcy5pbml0aWFsVmFsdWUsICgpID0+IGdldChkYXRhMiwgcGF0aCksICh2YWx1ZSkgPT4gc2V0KGRhdGEyLCBwYXRoLCB2YWx1ZSksIHBhdGgsIGtleSk7XG4gICAgfVxuICB9O1xuICBtdXRhdGVPYmoob2JqKTtcbiAgcmV0dXJuIChpbml0aWFsVmFsdWUpID0+IHtcbiAgICBpZiAodHlwZW9mIGluaXRpYWxWYWx1ZSA9PT0gXCJvYmplY3RcIiAmJiBpbml0aWFsVmFsdWUgIT09IG51bGwgJiYgaW5pdGlhbFZhbHVlLl94X2ludGVyY2VwdG9yKSB7XG4gICAgICBsZXQgaW5pdGlhbGl6ZSA9IG9iai5pbml0aWFsaXplLmJpbmQob2JqKTtcbiAgICAgIG9iai5pbml0aWFsaXplID0gKGRhdGEyLCBwYXRoLCBrZXkpID0+IHtcbiAgICAgICAgbGV0IGlubmVyVmFsdWUgPSBpbml0aWFsVmFsdWUuaW5pdGlhbGl6ZShkYXRhMiwgcGF0aCwga2V5KTtcbiAgICAgICAgb2JqLmluaXRpYWxWYWx1ZSA9IGlubmVyVmFsdWU7XG4gICAgICAgIHJldHVybiBpbml0aWFsaXplKGRhdGEyLCBwYXRoLCBrZXkpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqLmluaXRpYWxWYWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcbn1cbmZ1bmN0aW9uIGdldChvYmosIHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguc3BsaXQoXCIuXCIpLnJlZHVjZSgoY2FycnksIHNlZ21lbnQpID0+IGNhcnJ5W3NlZ21lbnRdLCBvYmopO1xufVxuZnVuY3Rpb24gc2V0KG9iaiwgcGF0aCwgdmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBwYXRoID09PSBcInN0cmluZ1wiKVxuICAgIHBhdGggPSBwYXRoLnNwbGl0KFwiLlwiKTtcbiAgaWYgKHBhdGgubGVuZ3RoID09PSAxKVxuICAgIG9ialtwYXRoWzBdXSA9IHZhbHVlO1xuICBlbHNlIGlmIChwYXRoLmxlbmd0aCA9PT0gMClcbiAgICB0aHJvdyBlcnJvcjtcbiAgZWxzZSB7XG4gICAgaWYgKG9ialtwYXRoWzBdXSlcbiAgICAgIHJldHVybiBzZXQob2JqW3BhdGhbMF1dLCBwYXRoLnNsaWNlKDEpLCB2YWx1ZSk7XG4gICAgZWxzZSB7XG4gICAgICBvYmpbcGF0aFswXV0gPSB7fTtcbiAgICAgIHJldHVybiBzZXQob2JqW3BhdGhbMF1dLCBwYXRoLnNsaWNlKDEpLCB2YWx1ZSk7XG4gICAgfVxuICB9XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MuanNcbnZhciBtYWdpY3MgPSB7fTtcbmZ1bmN0aW9uIG1hZ2ljKG5hbWUsIGNhbGxiYWNrKSB7XG4gIG1hZ2ljc1tuYW1lXSA9IGNhbGxiYWNrO1xufVxuZnVuY3Rpb24gaW5qZWN0TWFnaWNzKG9iaiwgZWwpIHtcbiAgbGV0IG1lbW9pemVkVXRpbGl0aWVzID0gZ2V0VXRpbGl0aWVzKGVsKTtcbiAgT2JqZWN0LmVudHJpZXMobWFnaWNzKS5mb3JFYWNoKChbbmFtZSwgY2FsbGJhY2tdKSA9PiB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgYCQke25hbWV9YCwge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZWwsIG1lbW9pemVkVXRpbGl0aWVzKTtcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIG9iajtcbn1cbmZ1bmN0aW9uIGdldFV0aWxpdGllcyhlbCkge1xuICBsZXQgW3V0aWxpdGllcywgY2xlYW51cDJdID0gZ2V0RWxlbWVudEJvdW5kVXRpbGl0aWVzKGVsKTtcbiAgbGV0IHV0aWxzID0geyBpbnRlcmNlcHRvciwgLi4udXRpbGl0aWVzIH07XG4gIG9uRWxSZW1vdmVkKGVsLCBjbGVhbnVwMik7XG4gIHJldHVybiB1dGlscztcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL2Vycm9yLmpzXG5mdW5jdGlvbiB0cnlDYXRjaChlbCwgZXhwcmVzc2lvbiwgY2FsbGJhY2ssIC4uLmFyZ3MpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gY2FsbGJhY2soLi4uYXJncyk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBoYW5kbGVFcnJvcihlLCBlbCwgZXhwcmVzc2lvbik7XG4gIH1cbn1cbmZ1bmN0aW9uIGhhbmRsZUVycm9yKC4uLmFyZ3MpIHtcbiAgcmV0dXJuIGVycm9ySGFuZGxlciguLi5hcmdzKTtcbn1cbnZhciBlcnJvckhhbmRsZXIgPSBub3JtYWxFcnJvckhhbmRsZXI7XG5mdW5jdGlvbiBzZXRFcnJvckhhbmRsZXIoaGFuZGxlcjQpIHtcbiAgZXJyb3JIYW5kbGVyID0gaGFuZGxlcjQ7XG59XG5mdW5jdGlvbiBub3JtYWxFcnJvckhhbmRsZXIoZXJyb3IyLCBlbCwgZXhwcmVzc2lvbiA9IHZvaWQgMCkge1xuICBlcnJvcjIgPSBPYmplY3QuYXNzaWduKFxuICAgIGVycm9yMiA/PyB7IG1lc3NhZ2U6IFwiTm8gZXJyb3IgbWVzc2FnZSBnaXZlbi5cIiB9LFxuICAgIHsgZWwsIGV4cHJlc3Npb24gfVxuICApO1xuICBjb25zb2xlLndhcm4oYEFscGluZSBFeHByZXNzaW9uIEVycm9yOiAke2Vycm9yMi5tZXNzYWdlfVxuXG4ke2V4cHJlc3Npb24gPyAnRXhwcmVzc2lvbjogXCInICsgZXhwcmVzc2lvbiArICdcIlxcblxcbicgOiBcIlwifWAsIGVsKTtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgdGhyb3cgZXJyb3IyO1xuICB9LCAwKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2V2YWx1YXRvci5qc1xudmFyIHNob3VsZEF1dG9FdmFsdWF0ZUZ1bmN0aW9ucyA9IHRydWU7XG5mdW5jdGlvbiBkb250QXV0b0V2YWx1YXRlRnVuY3Rpb25zKGNhbGxiYWNrKSB7XG4gIGxldCBjYWNoZSA9IHNob3VsZEF1dG9FdmFsdWF0ZUZ1bmN0aW9ucztcbiAgc2hvdWxkQXV0b0V2YWx1YXRlRnVuY3Rpb25zID0gZmFsc2U7XG4gIGxldCByZXN1bHQgPSBjYWxsYmFjaygpO1xuICBzaG91bGRBdXRvRXZhbHVhdGVGdW5jdGlvbnMgPSBjYWNoZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGV2YWx1YXRlKGVsLCBleHByZXNzaW9uLCBleHRyYXMgPSB7fSkge1xuICBsZXQgcmVzdWx0O1xuICBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKSgodmFsdWUpID0+IHJlc3VsdCA9IHZhbHVlLCBleHRyYXMpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZXZhbHVhdGVMYXRlciguLi5hcmdzKSB7XG4gIHJldHVybiB0aGVFdmFsdWF0b3JGdW5jdGlvbiguLi5hcmdzKTtcbn1cbnZhciB0aGVFdmFsdWF0b3JGdW5jdGlvbiA9ICgpID0+IHtcbn07XG5mdW5jdGlvbiBzZXRFdmFsdWF0b3IobmV3RXZhbHVhdG9yKSB7XG4gIHRoZUV2YWx1YXRvckZ1bmN0aW9uID0gbmV3RXZhbHVhdG9yO1xufVxudmFyIHRoZVJhd0V2YWx1YXRvckZ1bmN0aW9uO1xuZnVuY3Rpb24gc2V0UmF3RXZhbHVhdG9yKG5ld0V2YWx1YXRvcikge1xuICB0aGVSYXdFdmFsdWF0b3JGdW5jdGlvbiA9IG5ld0V2YWx1YXRvcjtcbn1cbmZ1bmN0aW9uIG5vcm1hbEV2YWx1YXRvcihlbCwgZXhwcmVzc2lvbikge1xuICBsZXQgb3ZlcnJpZGRlbk1hZ2ljcyA9IHt9O1xuICBpbmplY3RNYWdpY3Mob3ZlcnJpZGRlbk1hZ2ljcywgZWwpO1xuICBsZXQgZGF0YVN0YWNrID0gW292ZXJyaWRkZW5NYWdpY3MsIC4uLmNsb3Nlc3REYXRhU3RhY2soZWwpXTtcbiAgbGV0IGV2YWx1YXRvciA9IHR5cGVvZiBleHByZXNzaW9uID09PSBcImZ1bmN0aW9uXCIgPyBnZW5lcmF0ZUV2YWx1YXRvckZyb21GdW5jdGlvbihkYXRhU3RhY2ssIGV4cHJlc3Npb24pIDogZ2VuZXJhdGVFdmFsdWF0b3JGcm9tU3RyaW5nKGRhdGFTdGFjaywgZXhwcmVzc2lvbiwgZWwpO1xuICByZXR1cm4gdHJ5Q2F0Y2guYmluZChudWxsLCBlbCwgZXhwcmVzc2lvbiwgZXZhbHVhdG9yKTtcbn1cbmZ1bmN0aW9uIGdlbmVyYXRlRXZhbHVhdG9yRnJvbUZ1bmN0aW9uKGRhdGFTdGFjaywgZnVuYykge1xuICByZXR1cm4gKHJlY2VpdmVyID0gKCkgPT4ge1xuICB9LCB7IHNjb3BlOiBzY29wZTIgPSB7fSwgcGFyYW1zID0gW10sIGNvbnRleHQgfSA9IHt9KSA9PiB7XG4gICAgaWYgKCFzaG91bGRBdXRvRXZhbHVhdGVGdW5jdGlvbnMpIHtcbiAgICAgIHJ1bklmVHlwZU9mRnVuY3Rpb24ocmVjZWl2ZXIsIGZ1bmMsIG1lcmdlUHJveGllcyhbc2NvcGUyLCAuLi5kYXRhU3RhY2tdKSwgcGFyYW1zKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHJlc3VsdCA9IGZ1bmMuYXBwbHkobWVyZ2VQcm94aWVzKFtzY29wZTIsIC4uLmRhdGFTdGFja10pLCBwYXJhbXMpO1xuICAgIHJ1bklmVHlwZU9mRnVuY3Rpb24ocmVjZWl2ZXIsIHJlc3VsdCk7XG4gIH07XG59XG52YXIgZXZhbHVhdG9yTWVtbyA9IHt9O1xuZnVuY3Rpb24gZ2VuZXJhdGVGdW5jdGlvbkZyb21TdHJpbmcoZXhwcmVzc2lvbiwgZWwpIHtcbiAgaWYgKGV2YWx1YXRvck1lbW9bZXhwcmVzc2lvbl0pIHtcbiAgICByZXR1cm4gZXZhbHVhdG9yTWVtb1tleHByZXNzaW9uXTtcbiAgfVxuICBsZXQgQXN5bmNGdW5jdGlvbiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihhc3luYyBmdW5jdGlvbigpIHtcbiAgfSkuY29uc3RydWN0b3I7XG4gIGxldCByaWdodFNpZGVTYWZlRXhwcmVzc2lvbiA9IC9eW1xcblxcc10qaWYuKlxcKC4qXFwpLy50ZXN0KGV4cHJlc3Npb24udHJpbSgpKSB8fCAvXihsZXR8Y29uc3QpXFxzLy50ZXN0KGV4cHJlc3Npb24udHJpbSgpKSA/IGAoYXN5bmMoKT0+eyAke2V4cHJlc3Npb259IH0pKClgIDogZXhwcmVzc2lvbjtcbiAgY29uc3Qgc2FmZUFzeW5jRnVuY3Rpb24gPSAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBmdW5jMiA9IG5ldyBBc3luY0Z1bmN0aW9uKFxuICAgICAgICBbXCJfX3NlbGZcIiwgXCJzY29wZVwiXSxcbiAgICAgICAgYHdpdGggKHNjb3BlKSB7IF9fc2VsZi5yZXN1bHQgPSAke3JpZ2h0U2lkZVNhZmVFeHByZXNzaW9ufSB9OyBfX3NlbGYuZmluaXNoZWQgPSB0cnVlOyByZXR1cm4gX19zZWxmLnJlc3VsdDtgXG4gICAgICApO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGZ1bmMyLCBcIm5hbWVcIiwge1xuICAgICAgICB2YWx1ZTogYFtBbHBpbmVdICR7ZXhwcmVzc2lvbn1gXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmdW5jMjtcbiAgICB9IGNhdGNoIChlcnJvcjIpIHtcbiAgICAgIGhhbmRsZUVycm9yKGVycm9yMiwgZWwsIGV4cHJlc3Npb24pO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgfTtcbiAgbGV0IGZ1bmMgPSBzYWZlQXN5bmNGdW5jdGlvbigpO1xuICBldmFsdWF0b3JNZW1vW2V4cHJlc3Npb25dID0gZnVuYztcbiAgcmV0dXJuIGZ1bmM7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZUV2YWx1YXRvckZyb21TdHJpbmcoZGF0YVN0YWNrLCBleHByZXNzaW9uLCBlbCkge1xuICBsZXQgZnVuYyA9IGdlbmVyYXRlRnVuY3Rpb25Gcm9tU3RyaW5nKGV4cHJlc3Npb24sIGVsKTtcbiAgcmV0dXJuIChyZWNlaXZlciA9ICgpID0+IHtcbiAgfSwgeyBzY29wZTogc2NvcGUyID0ge30sIHBhcmFtcyA9IFtdLCBjb250ZXh0IH0gPSB7fSkgPT4ge1xuICAgIGZ1bmMucmVzdWx0ID0gdm9pZCAwO1xuICAgIGZ1bmMuZmluaXNoZWQgPSBmYWxzZTtcbiAgICBsZXQgY29tcGxldGVTY29wZSA9IG1lcmdlUHJveGllcyhbc2NvcGUyLCAuLi5kYXRhU3RhY2tdKTtcbiAgICBpZiAodHlwZW9mIGZ1bmMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgbGV0IHByb21pc2UgPSBmdW5jLmNhbGwoY29udGV4dCwgZnVuYywgY29tcGxldGVTY29wZSkuY2F0Y2goKGVycm9yMikgPT4gaGFuZGxlRXJyb3IoZXJyb3IyLCBlbCwgZXhwcmVzc2lvbikpO1xuICAgICAgaWYgKGZ1bmMuZmluaXNoZWQpIHtcbiAgICAgICAgcnVuSWZUeXBlT2ZGdW5jdGlvbihyZWNlaXZlciwgZnVuYy5yZXN1bHQsIGNvbXBsZXRlU2NvcGUsIHBhcmFtcywgZWwpO1xuICAgICAgICBmdW5jLnJlc3VsdCA9IHZvaWQgMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb21pc2UudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgcnVuSWZUeXBlT2ZGdW5jdGlvbihyZWNlaXZlciwgcmVzdWx0LCBjb21wbGV0ZVNjb3BlLCBwYXJhbXMsIGVsKTtcbiAgICAgICAgfSkuY2F0Y2goKGVycm9yMikgPT4gaGFuZGxlRXJyb3IoZXJyb3IyLCBlbCwgZXhwcmVzc2lvbikpLmZpbmFsbHkoKCkgPT4gZnVuYy5yZXN1bHQgPSB2b2lkIDApO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIHJ1bklmVHlwZU9mRnVuY3Rpb24ocmVjZWl2ZXIsIHZhbHVlLCBzY29wZTIsIHBhcmFtcywgZWwpIHtcbiAgaWYgKHNob3VsZEF1dG9FdmFsdWF0ZUZ1bmN0aW9ucyAmJiB0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGxldCByZXN1bHQgPSB2YWx1ZS5hcHBseShzY29wZTIsIHBhcmFtcyk7XG4gICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgIHJlc3VsdC50aGVuKChpKSA9PiBydW5JZlR5cGVPZkZ1bmN0aW9uKHJlY2VpdmVyLCBpLCBzY29wZTIsIHBhcmFtcykpLmNhdGNoKChlcnJvcjIpID0+IGhhbmRsZUVycm9yKGVycm9yMiwgZWwsIHZhbHVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlY2VpdmVyKHJlc3VsdCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICB2YWx1ZS50aGVuKChpKSA9PiByZWNlaXZlcihpKSk7XG4gIH0gZWxzZSB7XG4gICAgcmVjZWl2ZXIodmFsdWUpO1xuICB9XG59XG5mdW5jdGlvbiBldmFsdWF0ZVJhdyguLi5hcmdzKSB7XG4gIHJldHVybiB0aGVSYXdFdmFsdWF0b3JGdW5jdGlvbiguLi5hcmdzKTtcbn1cbmZ1bmN0aW9uIG5vcm1hbFJhd0V2YWx1YXRvcihlbCwgZXhwcmVzc2lvbiwgZXh0cmFzID0ge30pIHtcbiAgbGV0IG92ZXJyaWRkZW5NYWdpY3MgPSB7fTtcbiAgaW5qZWN0TWFnaWNzKG92ZXJyaWRkZW5NYWdpY3MsIGVsKTtcbiAgbGV0IGRhdGFTdGFjayA9IFtvdmVycmlkZGVuTWFnaWNzLCAuLi5jbG9zZXN0RGF0YVN0YWNrKGVsKV07XG4gIGxldCBzY29wZTIgPSBtZXJnZVByb3hpZXMoW2V4dHJhcy5zY29wZSA/PyB7fSwgLi4uZGF0YVN0YWNrXSk7XG4gIGxldCBwYXJhbXMgPSBleHRyYXMucGFyYW1zID8/IFtdO1xuICBpZiAoZXhwcmVzc2lvbi5pbmNsdWRlcyhcImF3YWl0XCIpKSB7XG4gICAgbGV0IEFzeW5jRnVuY3Rpb24gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgfSkuY29uc3RydWN0b3I7XG4gICAgbGV0IHJpZ2h0U2lkZVNhZmVFeHByZXNzaW9uID0gL15bXFxuXFxzXSppZi4qXFwoLipcXCkvLnRlc3QoZXhwcmVzc2lvbi50cmltKCkpIHx8IC9eKGxldHxjb25zdClcXHMvLnRlc3QoZXhwcmVzc2lvbi50cmltKCkpID8gYChhc3luYygpPT57ICR7ZXhwcmVzc2lvbn0gfSkoKWAgOiBleHByZXNzaW9uO1xuICAgIGxldCBmdW5jID0gbmV3IEFzeW5jRnVuY3Rpb24oXG4gICAgICBbXCJzY29wZVwiXSxcbiAgICAgIGB3aXRoIChzY29wZSkgeyBsZXQgX19yZXN1bHQgPSAke3JpZ2h0U2lkZVNhZmVFeHByZXNzaW9ufTsgcmV0dXJuIF9fcmVzdWx0IH1gXG4gICAgKTtcbiAgICBsZXQgcmVzdWx0ID0gZnVuYy5jYWxsKGV4dHJhcy5jb250ZXh0LCBzY29wZTIpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSB7XG4gICAgbGV0IHJpZ2h0U2lkZVNhZmVFeHByZXNzaW9uID0gL15bXFxuXFxzXSppZi4qXFwoLipcXCkvLnRlc3QoZXhwcmVzc2lvbi50cmltKCkpIHx8IC9eKGxldHxjb25zdClcXHMvLnRlc3QoZXhwcmVzc2lvbi50cmltKCkpID8gYCgoKT0+eyAke2V4cHJlc3Npb259IH0pKClgIDogZXhwcmVzc2lvbjtcbiAgICBsZXQgZnVuYyA9IG5ldyBGdW5jdGlvbihcbiAgICAgIFtcInNjb3BlXCJdLFxuICAgICAgYHdpdGggKHNjb3BlKSB7IGxldCBfX3Jlc3VsdCA9ICR7cmlnaHRTaWRlU2FmZUV4cHJlc3Npb259OyByZXR1cm4gX19yZXN1bHQgfWBcbiAgICApO1xuICAgIGxldCByZXN1bHQgPSBmdW5jLmNhbGwoZXh0cmFzLmNvbnRleHQsIHNjb3BlMik7XG4gICAgaWYgKHR5cGVvZiByZXN1bHQgPT09IFwiZnVuY3Rpb25cIiAmJiBzaG91bGRBdXRvRXZhbHVhdGVGdW5jdGlvbnMpIHtcbiAgICAgIHJldHVybiByZXN1bHQuYXBwbHkoc2NvcGUyLCBwYXJhbXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzLmpzXG52YXIgcHJlZml4QXNTdHJpbmcgPSBcIngtXCI7XG5mdW5jdGlvbiBwcmVmaXgoc3ViamVjdCA9IFwiXCIpIHtcbiAgcmV0dXJuIHByZWZpeEFzU3RyaW5nICsgc3ViamVjdDtcbn1cbmZ1bmN0aW9uIHNldFByZWZpeChuZXdQcmVmaXgpIHtcbiAgcHJlZml4QXNTdHJpbmcgPSBuZXdQcmVmaXg7XG59XG52YXIgZGlyZWN0aXZlSGFuZGxlcnMgPSB7fTtcbmZ1bmN0aW9uIGRpcmVjdGl2ZShuYW1lLCBjYWxsYmFjaykge1xuICBkaXJlY3RpdmVIYW5kbGVyc1tuYW1lXSA9IGNhbGxiYWNrO1xuICByZXR1cm4ge1xuICAgIGJlZm9yZShkaXJlY3RpdmUyKSB7XG4gICAgICBpZiAoIWRpcmVjdGl2ZUhhbmRsZXJzW2RpcmVjdGl2ZTJdKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihTdHJpbmcucmF3YENhbm5vdCBmaW5kIGRpcmVjdGl2ZSBcXGAke2RpcmVjdGl2ZTJ9XFxgLiBcXGAke25hbWV9XFxgIHdpbGwgdXNlIHRoZSBkZWZhdWx0IG9yZGVyIG9mIGV4ZWN1dGlvbmApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBwb3MgPSBkaXJlY3RpdmVPcmRlci5pbmRleE9mKGRpcmVjdGl2ZTIpO1xuICAgICAgZGlyZWN0aXZlT3JkZXIuc3BsaWNlKHBvcyA+PSAwID8gcG9zIDogZGlyZWN0aXZlT3JkZXIuaW5kZXhPZihcIkRFRkFVTFRcIiksIDAsIG5hbWUpO1xuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIGRpcmVjdGl2ZUV4aXN0cyhuYW1lKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhkaXJlY3RpdmVIYW5kbGVycykuaW5jbHVkZXMobmFtZSk7XG59XG5mdW5jdGlvbiBkaXJlY3RpdmVzKGVsLCBhdHRyaWJ1dGVzLCBvcmlnaW5hbEF0dHJpYnV0ZU92ZXJyaWRlKSB7XG4gIGF0dHJpYnV0ZXMgPSBBcnJheS5mcm9tKGF0dHJpYnV0ZXMpO1xuICBpZiAoZWwuX3hfdmlydHVhbERpcmVjdGl2ZXMpIHtcbiAgICBsZXQgdkF0dHJpYnV0ZXMgPSBPYmplY3QuZW50cmllcyhlbC5feF92aXJ0dWFsRGlyZWN0aXZlcykubWFwKChbbmFtZSwgdmFsdWVdKSA9PiAoeyBuYW1lLCB2YWx1ZSB9KSk7XG4gICAgbGV0IHN0YXRpY0F0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzT25seSh2QXR0cmlidXRlcyk7XG4gICAgdkF0dHJpYnV0ZXMgPSB2QXR0cmlidXRlcy5tYXAoKGF0dHJpYnV0ZSkgPT4ge1xuICAgICAgaWYgKHN0YXRpY0F0dHJpYnV0ZXMuZmluZCgoYXR0cikgPT4gYXR0ci5uYW1lID09PSBhdHRyaWJ1dGUubmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lOiBgeC1iaW5kOiR7YXR0cmlidXRlLm5hbWV9YCxcbiAgICAgICAgICB2YWx1ZTogYFwiJHthdHRyaWJ1dGUudmFsdWV9XCJgXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gYXR0cmlidXRlO1xuICAgIH0pO1xuICAgIGF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzLmNvbmNhdCh2QXR0cmlidXRlcyk7XG4gIH1cbiAgbGV0IHRyYW5zZm9ybWVkQXR0cmlidXRlTWFwID0ge307XG4gIGxldCBkaXJlY3RpdmVzMiA9IGF0dHJpYnV0ZXMubWFwKHRvVHJhbnNmb3JtZWRBdHRyaWJ1dGVzKChuZXdOYW1lLCBvbGROYW1lKSA9PiB0cmFuc2Zvcm1lZEF0dHJpYnV0ZU1hcFtuZXdOYW1lXSA9IG9sZE5hbWUpKS5maWx0ZXIob3V0Tm9uQWxwaW5lQXR0cmlidXRlcykubWFwKHRvUGFyc2VkRGlyZWN0aXZlcyh0cmFuc2Zvcm1lZEF0dHJpYnV0ZU1hcCwgb3JpZ2luYWxBdHRyaWJ1dGVPdmVycmlkZSkpLnNvcnQoYnlQcmlvcml0eSk7XG4gIHJldHVybiBkaXJlY3RpdmVzMi5tYXAoKGRpcmVjdGl2ZTIpID0+IHtcbiAgICByZXR1cm4gZ2V0RGlyZWN0aXZlSGFuZGxlcihlbCwgZGlyZWN0aXZlMik7XG4gIH0pO1xufVxuZnVuY3Rpb24gYXR0cmlidXRlc09ubHkoYXR0cmlidXRlcykge1xuICByZXR1cm4gQXJyYXkuZnJvbShhdHRyaWJ1dGVzKS5tYXAodG9UcmFuc2Zvcm1lZEF0dHJpYnV0ZXMoKSkuZmlsdGVyKChhdHRyKSA9PiAhb3V0Tm9uQWxwaW5lQXR0cmlidXRlcyhhdHRyKSk7XG59XG52YXIgaXNEZWZlcnJpbmdIYW5kbGVycyA9IGZhbHNlO1xudmFyIGRpcmVjdGl2ZUhhbmRsZXJTdGFja3MgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xudmFyIGN1cnJlbnRIYW5kbGVyU3RhY2tLZXkgPSBTeW1ib2woKTtcbmZ1bmN0aW9uIGRlZmVySGFuZGxpbmdEaXJlY3RpdmVzKGNhbGxiYWNrKSB7XG4gIGlzRGVmZXJyaW5nSGFuZGxlcnMgPSB0cnVlO1xuICBsZXQga2V5ID0gU3ltYm9sKCk7XG4gIGN1cnJlbnRIYW5kbGVyU3RhY2tLZXkgPSBrZXk7XG4gIGRpcmVjdGl2ZUhhbmRsZXJTdGFja3Muc2V0KGtleSwgW10pO1xuICBsZXQgZmx1c2hIYW5kbGVycyA9ICgpID0+IHtcbiAgICB3aGlsZSAoZGlyZWN0aXZlSGFuZGxlclN0YWNrcy5nZXQoa2V5KS5sZW5ndGgpXG4gICAgICBkaXJlY3RpdmVIYW5kbGVyU3RhY2tzLmdldChrZXkpLnNoaWZ0KCkoKTtcbiAgICBkaXJlY3RpdmVIYW5kbGVyU3RhY2tzLmRlbGV0ZShrZXkpO1xuICB9O1xuICBsZXQgc3RvcERlZmVycmluZyA9ICgpID0+IHtcbiAgICBpc0RlZmVycmluZ0hhbmRsZXJzID0gZmFsc2U7XG4gICAgZmx1c2hIYW5kbGVycygpO1xuICB9O1xuICBjYWxsYmFjayhmbHVzaEhhbmRsZXJzKTtcbiAgc3RvcERlZmVycmluZygpO1xufVxuZnVuY3Rpb24gZ2V0RWxlbWVudEJvdW5kVXRpbGl0aWVzKGVsKSB7XG4gIGxldCBjbGVhbnVwcyA9IFtdO1xuICBsZXQgY2xlYW51cDIgPSAoY2FsbGJhY2spID0+IGNsZWFudXBzLnB1c2goY2FsbGJhY2spO1xuICBsZXQgW2VmZmVjdDMsIGNsZWFudXBFZmZlY3RdID0gZWxlbWVudEJvdW5kRWZmZWN0KGVsKTtcbiAgY2xlYW51cHMucHVzaChjbGVhbnVwRWZmZWN0KTtcbiAgbGV0IHV0aWxpdGllcyA9IHtcbiAgICBBbHBpbmU6IGFscGluZV9kZWZhdWx0LFxuICAgIGVmZmVjdDogZWZmZWN0MyxcbiAgICBjbGVhbnVwOiBjbGVhbnVwMixcbiAgICBldmFsdWF0ZUxhdGVyOiBldmFsdWF0ZUxhdGVyLmJpbmQoZXZhbHVhdGVMYXRlciwgZWwpLFxuICAgIGV2YWx1YXRlOiBldmFsdWF0ZS5iaW5kKGV2YWx1YXRlLCBlbClcbiAgfTtcbiAgbGV0IGRvQ2xlYW51cCA9ICgpID0+IGNsZWFudXBzLmZvckVhY2goKGkpID0+IGkoKSk7XG4gIHJldHVybiBbdXRpbGl0aWVzLCBkb0NsZWFudXBdO1xufVxuZnVuY3Rpb24gZ2V0RGlyZWN0aXZlSGFuZGxlcihlbCwgZGlyZWN0aXZlMikge1xuICBsZXQgbm9vcCA9ICgpID0+IHtcbiAgfTtcbiAgbGV0IGhhbmRsZXI0ID0gZGlyZWN0aXZlSGFuZGxlcnNbZGlyZWN0aXZlMi50eXBlXSB8fCBub29wO1xuICBsZXQgW3V0aWxpdGllcywgY2xlYW51cDJdID0gZ2V0RWxlbWVudEJvdW5kVXRpbGl0aWVzKGVsKTtcbiAgb25BdHRyaWJ1dGVSZW1vdmVkKGVsLCBkaXJlY3RpdmUyLm9yaWdpbmFsLCBjbGVhbnVwMik7XG4gIGxldCBmdWxsSGFuZGxlciA9ICgpID0+IHtcbiAgICBpZiAoZWwuX3hfaWdub3JlIHx8IGVsLl94X2lnbm9yZVNlbGYpXG4gICAgICByZXR1cm47XG4gICAgaGFuZGxlcjQuaW5saW5lICYmIGhhbmRsZXI0LmlubGluZShlbCwgZGlyZWN0aXZlMiwgdXRpbGl0aWVzKTtcbiAgICBoYW5kbGVyNCA9IGhhbmRsZXI0LmJpbmQoaGFuZGxlcjQsIGVsLCBkaXJlY3RpdmUyLCB1dGlsaXRpZXMpO1xuICAgIGlzRGVmZXJyaW5nSGFuZGxlcnMgPyBkaXJlY3RpdmVIYW5kbGVyU3RhY2tzLmdldChjdXJyZW50SGFuZGxlclN0YWNrS2V5KS5wdXNoKGhhbmRsZXI0KSA6IGhhbmRsZXI0KCk7XG4gIH07XG4gIGZ1bGxIYW5kbGVyLnJ1bkNsZWFudXBzID0gY2xlYW51cDI7XG4gIHJldHVybiBmdWxsSGFuZGxlcjtcbn1cbnZhciBzdGFydGluZ1dpdGggPSAoc3ViamVjdCwgcmVwbGFjZW1lbnQpID0+ICh7IG5hbWUsIHZhbHVlIH0pID0+IHtcbiAgaWYgKG5hbWUuc3RhcnRzV2l0aChzdWJqZWN0KSlcbiAgICBuYW1lID0gbmFtZS5yZXBsYWNlKHN1YmplY3QsIHJlcGxhY2VtZW50KTtcbiAgcmV0dXJuIHsgbmFtZSwgdmFsdWUgfTtcbn07XG52YXIgaW50byA9IChpKSA9PiBpO1xuZnVuY3Rpb24gdG9UcmFuc2Zvcm1lZEF0dHJpYnV0ZXMoY2FsbGJhY2sgPSAoKSA9PiB7XG59KSB7XG4gIHJldHVybiAoeyBuYW1lLCB2YWx1ZSB9KSA9PiB7XG4gICAgbGV0IHsgbmFtZTogbmV3TmFtZSwgdmFsdWU6IG5ld1ZhbHVlIH0gPSBhdHRyaWJ1dGVUcmFuc2Zvcm1lcnMucmVkdWNlKChjYXJyeSwgdHJhbnNmb3JtKSA9PiB7XG4gICAgICByZXR1cm4gdHJhbnNmb3JtKGNhcnJ5KTtcbiAgICB9LCB7IG5hbWUsIHZhbHVlIH0pO1xuICAgIGlmIChuZXdOYW1lICE9PSBuYW1lKVxuICAgICAgY2FsbGJhY2sobmV3TmFtZSwgbmFtZSk7XG4gICAgcmV0dXJuIHsgbmFtZTogbmV3TmFtZSwgdmFsdWU6IG5ld1ZhbHVlIH07XG4gIH07XG59XG52YXIgYXR0cmlidXRlVHJhbnNmb3JtZXJzID0gW107XG5mdW5jdGlvbiBtYXBBdHRyaWJ1dGVzKGNhbGxiYWNrKSB7XG4gIGF0dHJpYnV0ZVRyYW5zZm9ybWVycy5wdXNoKGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIG91dE5vbkFscGluZUF0dHJpYnV0ZXMoeyBuYW1lIH0pIHtcbiAgcmV0dXJuIGFscGluZUF0dHJpYnV0ZVJlZ2V4KCkudGVzdChuYW1lKTtcbn1cbnZhciBhbHBpbmVBdHRyaWJ1dGVSZWdleCA9ICgpID0+IG5ldyBSZWdFeHAoYF4ke3ByZWZpeEFzU3RyaW5nfShbXjpeLl0rKVxcXFxiYCk7XG5mdW5jdGlvbiB0b1BhcnNlZERpcmVjdGl2ZXModHJhbnNmb3JtZWRBdHRyaWJ1dGVNYXAsIG9yaWdpbmFsQXR0cmlidXRlT3ZlcnJpZGUpIHtcbiAgcmV0dXJuICh7IG5hbWUsIHZhbHVlIH0pID0+IHtcbiAgICBpZiAobmFtZSA9PT0gdmFsdWUpXG4gICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgbGV0IHR5cGVNYXRjaCA9IG5hbWUubWF0Y2goYWxwaW5lQXR0cmlidXRlUmVnZXgoKSk7XG4gICAgbGV0IHZhbHVlTWF0Y2ggPSBuYW1lLm1hdGNoKC86KFthLXpBLVowLTlcXC1fOl0rKS8pO1xuICAgIGxldCBtb2RpZmllcnMgPSBuYW1lLm1hdGNoKC9cXC5bXi5cXF1dKyg/PVteXFxdXSokKS9nKSB8fCBbXTtcbiAgICBsZXQgb3JpZ2luYWwgPSBvcmlnaW5hbEF0dHJpYnV0ZU92ZXJyaWRlIHx8IHRyYW5zZm9ybWVkQXR0cmlidXRlTWFwW25hbWVdIHx8IG5hbWU7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IHR5cGVNYXRjaCA/IHR5cGVNYXRjaFsxXSA6IG51bGwsXG4gICAgICB2YWx1ZTogdmFsdWVNYXRjaCA/IHZhbHVlTWF0Y2hbMV0gOiBudWxsLFxuICAgICAgbW9kaWZpZXJzOiBtb2RpZmllcnMubWFwKChpKSA9PiBpLnJlcGxhY2UoXCIuXCIsIFwiXCIpKSxcbiAgICAgIGV4cHJlc3Npb246IHZhbHVlLFxuICAgICAgb3JpZ2luYWxcbiAgICB9O1xuICB9O1xufVxudmFyIERFRkFVTFQgPSBcIkRFRkFVTFRcIjtcbnZhciBkaXJlY3RpdmVPcmRlciA9IFtcbiAgXCJpZ25vcmVcIixcbiAgXCJyZWZcIixcbiAgXCJkYXRhXCIsXG4gIFwiaWRcIixcbiAgXCJhbmNob3JcIixcbiAgXCJiaW5kXCIsXG4gIFwiaW5pdFwiLFxuICBcImZvclwiLFxuICBcIm1vZGVsXCIsXG4gIFwibW9kZWxhYmxlXCIsXG4gIFwidHJhbnNpdGlvblwiLFxuICBcInNob3dcIixcbiAgXCJpZlwiLFxuICBERUZBVUxULFxuICBcInRlbGVwb3J0XCJcbl07XG5mdW5jdGlvbiBieVByaW9yaXR5KGEsIGIpIHtcbiAgbGV0IHR5cGVBID0gZGlyZWN0aXZlT3JkZXIuaW5kZXhPZihhLnR5cGUpID09PSAtMSA/IERFRkFVTFQgOiBhLnR5cGU7XG4gIGxldCB0eXBlQiA9IGRpcmVjdGl2ZU9yZGVyLmluZGV4T2YoYi50eXBlKSA9PT0gLTEgPyBERUZBVUxUIDogYi50eXBlO1xuICByZXR1cm4gZGlyZWN0aXZlT3JkZXIuaW5kZXhPZih0eXBlQSkgLSBkaXJlY3RpdmVPcmRlci5pbmRleE9mKHR5cGVCKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL2Rpc3BhdGNoLmpzXG5mdW5jdGlvbiBkaXNwYXRjaChlbCwgbmFtZSwgZGV0YWlsID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICByZXR1cm4gZWwuZGlzcGF0Y2hFdmVudChcbiAgICBuZXcgQ3VzdG9tRXZlbnQobmFtZSwge1xuICAgICAgZGV0YWlsLFxuICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgIC8vIEFsbG93cyBldmVudHMgdG8gcGFzcyB0aGUgc2hhZG93IERPTSBiYXJyaWVyLlxuICAgICAgY29tcG9zZWQ6IHRydWUsXG4gICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgLy8gQWxsb3dzIG92ZXJyaWRpbmcgdGhlIGRlZmF1bHQgZXZlbnQgb3B0aW9ucy5cbiAgICAgIC4uLm9wdGlvbnNcbiAgICB9KVxuICApO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvd2Fsay5qc1xuZnVuY3Rpb24gd2FsayhlbCwgY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBTaGFkb3dSb290ID09PSBcImZ1bmN0aW9uXCIgJiYgZWwgaW5zdGFuY2VvZiBTaGFkb3dSb290KSB7XG4gICAgQXJyYXkuZnJvbShlbC5jaGlsZHJlbikuZm9yRWFjaCgoZWwyKSA9PiB3YWxrKGVsMiwgY2FsbGJhY2spKTtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IHNraXAgPSBmYWxzZTtcbiAgY2FsbGJhY2soZWwsICgpID0+IHNraXAgPSB0cnVlKTtcbiAgaWYgKHNraXApXG4gICAgcmV0dXJuO1xuICBsZXQgbm9kZSA9IGVsLmZpcnN0RWxlbWVudENoaWxkO1xuICB3aGlsZSAobm9kZSkge1xuICAgIHdhbGsobm9kZSwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICBub2RlID0gbm9kZS5uZXh0RWxlbWVudFNpYmxpbmc7XG4gIH1cbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL3dhcm4uanNcbmZ1bmN0aW9uIHdhcm4obWVzc2FnZSwgLi4uYXJncykge1xuICBjb25zb2xlLndhcm4oYEFscGluZSBXYXJuaW5nOiAke21lc3NhZ2V9YCwgLi4uYXJncyk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9saWZlY3ljbGUuanNcbnZhciBzdGFydGVkID0gZmFsc2U7XG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgaWYgKHN0YXJ0ZWQpXG4gICAgd2FybihcIkFscGluZSBoYXMgYWxyZWFkeSBiZWVuIGluaXRpYWxpemVkIG9uIHRoaXMgcGFnZS4gQ2FsbGluZyBBbHBpbmUuc3RhcnQoKSBtb3JlIHRoYW4gb25jZSBjYW4gY2F1c2UgcHJvYmxlbXMuXCIpO1xuICBzdGFydGVkID0gdHJ1ZTtcbiAgaWYgKCFkb2N1bWVudC5ib2R5KVxuICAgIHdhcm4oXCJVbmFibGUgdG8gaW5pdGlhbGl6ZS4gVHJ5aW5nIHRvIGxvYWQgQWxwaW5lIGJlZm9yZSBgPGJvZHk+YCBpcyBhdmFpbGFibGUuIERpZCB5b3UgZm9yZ2V0IHRvIGFkZCBgZGVmZXJgIGluIEFscGluZSdzIGA8c2NyaXB0PmAgdGFnP1wiKTtcbiAgZGlzcGF0Y2goZG9jdW1lbnQsIFwiYWxwaW5lOmluaXRcIik7XG4gIGRpc3BhdGNoKGRvY3VtZW50LCBcImFscGluZTppbml0aWFsaXppbmdcIik7XG4gIHN0YXJ0T2JzZXJ2aW5nTXV0YXRpb25zKCk7XG4gIG9uRWxBZGRlZCgoZWwpID0+IGluaXRUcmVlKGVsLCB3YWxrKSk7XG4gIG9uRWxSZW1vdmVkKChlbCkgPT4gZGVzdHJveVRyZWUoZWwpKTtcbiAgb25BdHRyaWJ1dGVzQWRkZWQoKGVsLCBhdHRycykgPT4ge1xuICAgIGRpcmVjdGl2ZXMoZWwsIGF0dHJzKS5mb3JFYWNoKChoYW5kbGUpID0+IGhhbmRsZSgpKTtcbiAgfSk7XG4gIGxldCBvdXROZXN0ZWRDb21wb25lbnRzID0gKGVsKSA9PiAhY2xvc2VzdFJvb3QoZWwucGFyZW50RWxlbWVudCwgdHJ1ZSk7XG4gIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChhbGxTZWxlY3RvcnMoKS5qb2luKFwiLFwiKSkpLmZpbHRlcihvdXROZXN0ZWRDb21wb25lbnRzKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgIGluaXRUcmVlKGVsKTtcbiAgfSk7XG4gIGRpc3BhdGNoKGRvY3VtZW50LCBcImFscGluZTppbml0aWFsaXplZFwiKTtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgd2FybkFib3V0TWlzc2luZ1BsdWdpbnMoKTtcbiAgfSk7XG59XG52YXIgcm9vdFNlbGVjdG9yQ2FsbGJhY2tzID0gW107XG52YXIgaW5pdFNlbGVjdG9yQ2FsbGJhY2tzID0gW107XG5mdW5jdGlvbiByb290U2VsZWN0b3JzKCkge1xuICByZXR1cm4gcm9vdFNlbGVjdG9yQ2FsbGJhY2tzLm1hcCgoZm4pID0+IGZuKCkpO1xufVxuZnVuY3Rpb24gYWxsU2VsZWN0b3JzKCkge1xuICByZXR1cm4gcm9vdFNlbGVjdG9yQ2FsbGJhY2tzLmNvbmNhdChpbml0U2VsZWN0b3JDYWxsYmFja3MpLm1hcCgoZm4pID0+IGZuKCkpO1xufVxuZnVuY3Rpb24gYWRkUm9vdFNlbGVjdG9yKHNlbGVjdG9yQ2FsbGJhY2spIHtcbiAgcm9vdFNlbGVjdG9yQ2FsbGJhY2tzLnB1c2goc2VsZWN0b3JDYWxsYmFjayk7XG59XG5mdW5jdGlvbiBhZGRJbml0U2VsZWN0b3Ioc2VsZWN0b3JDYWxsYmFjaykge1xuICBpbml0U2VsZWN0b3JDYWxsYmFja3MucHVzaChzZWxlY3RvckNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGNsb3Nlc3RSb290KGVsLCBpbmNsdWRlSW5pdFNlbGVjdG9ycyA9IGZhbHNlKSB7XG4gIHJldHVybiBmaW5kQ2xvc2VzdChlbCwgKGVsZW1lbnQpID0+IHtcbiAgICBjb25zdCBzZWxlY3RvcnMgPSBpbmNsdWRlSW5pdFNlbGVjdG9ycyA/IGFsbFNlbGVjdG9ycygpIDogcm9vdFNlbGVjdG9ycygpO1xuICAgIGlmIChzZWxlY3RvcnMuc29tZSgoc2VsZWN0b3IpID0+IGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpKVxuICAgICAgcmV0dXJuIHRydWU7XG4gIH0pO1xufVxuZnVuY3Rpb24gZmluZENsb3Nlc3QoZWwsIGNhbGxiYWNrKSB7XG4gIGlmICghZWwpXG4gICAgcmV0dXJuO1xuICBpZiAoY2FsbGJhY2soZWwpKVxuICAgIHJldHVybiBlbDtcbiAgaWYgKGVsLl94X3RlbGVwb3J0QmFjaylcbiAgICByZXR1cm4gZmluZENsb3Nlc3QoZWwuX3hfdGVsZXBvcnRCYWNrLCBjYWxsYmFjayk7XG4gIGlmIChlbC5wYXJlbnROb2RlIGluc3RhbmNlb2YgU2hhZG93Um9vdCkge1xuICAgIHJldHVybiBmaW5kQ2xvc2VzdChlbC5wYXJlbnROb2RlLmhvc3QsIGNhbGxiYWNrKTtcbiAgfVxuICBpZiAoIWVsLnBhcmVudEVsZW1lbnQpXG4gICAgcmV0dXJuO1xuICByZXR1cm4gZmluZENsb3Nlc3QoZWwucGFyZW50RWxlbWVudCwgY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gaXNSb290KGVsKSB7XG4gIHJldHVybiByb290U2VsZWN0b3JzKCkuc29tZSgoc2VsZWN0b3IpID0+IGVsLm1hdGNoZXMoc2VsZWN0b3IpKTtcbn1cbnZhciBpbml0SW50ZXJjZXB0b3JzMiA9IFtdO1xuZnVuY3Rpb24gaW50ZXJjZXB0SW5pdChjYWxsYmFjaykge1xuICBpbml0SW50ZXJjZXB0b3JzMi5wdXNoKGNhbGxiYWNrKTtcbn1cbnZhciBtYXJrZXJEaXNwZW5zZXIgPSAxO1xuZnVuY3Rpb24gaW5pdFRyZWUoZWwsIHdhbGtlciA9IHdhbGssIGludGVyY2VwdCA9ICgpID0+IHtcbn0pIHtcbiAgaWYgKGZpbmRDbG9zZXN0KGVsLCAoaSkgPT4gaS5feF9pZ25vcmUpKVxuICAgIHJldHVybjtcbiAgZGVmZXJIYW5kbGluZ0RpcmVjdGl2ZXMoKCkgPT4ge1xuICAgIHdhbGtlcihlbCwgKGVsMiwgc2tpcCkgPT4ge1xuICAgICAgaWYgKGVsMi5feF9tYXJrZXIpXG4gICAgICAgIHJldHVybjtcbiAgICAgIGludGVyY2VwdChlbDIsIHNraXApO1xuICAgICAgaW5pdEludGVyY2VwdG9yczIuZm9yRWFjaCgoaSkgPT4gaShlbDIsIHNraXApKTtcbiAgICAgIGRpcmVjdGl2ZXMoZWwyLCBlbDIuYXR0cmlidXRlcykuZm9yRWFjaCgoaGFuZGxlKSA9PiBoYW5kbGUoKSk7XG4gICAgICBpZiAoIWVsMi5feF9pZ25vcmUpXG4gICAgICAgIGVsMi5feF9tYXJrZXIgPSBtYXJrZXJEaXNwZW5zZXIrKztcbiAgICAgIGVsMi5feF9pZ25vcmUgJiYgc2tpcCgpO1xuICAgIH0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGRlc3Ryb3lUcmVlKHJvb3QsIHdhbGtlciA9IHdhbGspIHtcbiAgd2Fsa2VyKHJvb3QsIChlbCkgPT4ge1xuICAgIGNsZWFudXBFbGVtZW50KGVsKTtcbiAgICBjbGVhbnVwQXR0cmlidXRlcyhlbCk7XG4gICAgZGVsZXRlIGVsLl94X21hcmtlcjtcbiAgfSk7XG59XG5mdW5jdGlvbiB3YXJuQWJvdXRNaXNzaW5nUGx1Z2lucygpIHtcbiAgbGV0IHBsdWdpbkRpcmVjdGl2ZXMgPSBbXG4gICAgW1widWlcIiwgXCJkaWFsb2dcIiwgW1wiW3gtZGlhbG9nXSwgW3gtcG9wb3Zlcl1cIl1dLFxuICAgIFtcImFuY2hvclwiLCBcImFuY2hvclwiLCBbXCJbeC1hbmNob3JdXCJdXSxcbiAgICBbXCJzb3J0XCIsIFwic29ydFwiLCBbXCJbeC1zb3J0XVwiXV1cbiAgXTtcbiAgcGx1Z2luRGlyZWN0aXZlcy5mb3JFYWNoKChbcGx1Z2luMiwgZGlyZWN0aXZlMiwgc2VsZWN0b3JzXSkgPT4ge1xuICAgIGlmIChkaXJlY3RpdmVFeGlzdHMoZGlyZWN0aXZlMikpXG4gICAgICByZXR1cm47XG4gICAgc2VsZWN0b3JzLnNvbWUoKHNlbGVjdG9yKSA9PiB7XG4gICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikpIHtcbiAgICAgICAgd2FybihgZm91bmQgXCIke3NlbGVjdG9yfVwiLCBidXQgbWlzc2luZyAke3BsdWdpbjJ9IHBsdWdpbmApO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9uZXh0VGljay5qc1xudmFyIHRpY2tTdGFjayA9IFtdO1xudmFyIGlzSG9sZGluZyA9IGZhbHNlO1xuZnVuY3Rpb24gbmV4dFRpY2soY2FsbGJhY2sgPSAoKSA9PiB7XG59KSB7XG4gIHF1ZXVlTWljcm90YXNrKCgpID0+IHtcbiAgICBpc0hvbGRpbmcgfHwgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICByZWxlYXNlTmV4dFRpY2tzKCk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlcykgPT4ge1xuICAgIHRpY2tTdGFjay5wdXNoKCgpID0+IHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgICByZXMoKTtcbiAgICB9KTtcbiAgfSk7XG59XG5mdW5jdGlvbiByZWxlYXNlTmV4dFRpY2tzKCkge1xuICBpc0hvbGRpbmcgPSBmYWxzZTtcbiAgd2hpbGUgKHRpY2tTdGFjay5sZW5ndGgpXG4gICAgdGlja1N0YWNrLnNoaWZ0KCkoKTtcbn1cbmZ1bmN0aW9uIGhvbGROZXh0VGlja3MoKSB7XG4gIGlzSG9sZGluZyA9IHRydWU7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy9jbGFzc2VzLmpzXG5mdW5jdGlvbiBzZXRDbGFzc2VzKGVsLCB2YWx1ZSkge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gc2V0Q2xhc3Nlc0Zyb21TdHJpbmcoZWwsIHZhbHVlLmpvaW4oXCIgXCIpKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICByZXR1cm4gc2V0Q2xhc3Nlc0Zyb21PYmplY3QoZWwsIHZhbHVlKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiBzZXRDbGFzc2VzKGVsLCB2YWx1ZSgpKTtcbiAgfVxuICByZXR1cm4gc2V0Q2xhc3Nlc0Zyb21TdHJpbmcoZWwsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHNwbGl0Q2xhc3NlcyhjbGFzc1N0cmluZykge1xuICByZXR1cm4gY2xhc3NTdHJpbmcuc3BsaXQoL1xccy8pLmZpbHRlcihCb29sZWFuKTtcbn1cbmZ1bmN0aW9uIHNldENsYXNzZXNGcm9tU3RyaW5nKGVsLCBjbGFzc1N0cmluZykge1xuICBsZXQgbWlzc2luZ0NsYXNzZXMgPSAoY2xhc3NTdHJpbmcyKSA9PiBzcGxpdENsYXNzZXMoY2xhc3NTdHJpbmcyKS5maWx0ZXIoKGkpID0+ICFlbC5jbGFzc0xpc3QuY29udGFpbnMoaSkpLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGFkZENsYXNzZXNBbmRSZXR1cm5VbmRvID0gKGNsYXNzZXMpID0+IHtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzZXMpO1xuICAgIH07XG4gIH07XG4gIGNsYXNzU3RyaW5nID0gY2xhc3NTdHJpbmcgPT09IHRydWUgPyBjbGFzc1N0cmluZyA9IFwiXCIgOiBjbGFzc1N0cmluZyB8fCBcIlwiO1xuICByZXR1cm4gYWRkQ2xhc3Nlc0FuZFJldHVyblVuZG8obWlzc2luZ0NsYXNzZXMoY2xhc3NTdHJpbmcpKTtcbn1cbmZ1bmN0aW9uIHNldENsYXNzZXNGcm9tT2JqZWN0KGVsLCBjbGFzc09iamVjdCkge1xuICBsZXQgZm9yQWRkID0gT2JqZWN0LmVudHJpZXMoY2xhc3NPYmplY3QpLmZsYXRNYXAoKFtjbGFzc1N0cmluZywgYm9vbF0pID0+IGJvb2wgPyBzcGxpdENsYXNzZXMoY2xhc3NTdHJpbmcpIDogZmFsc2UpLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGZvclJlbW92ZSA9IE9iamVjdC5lbnRyaWVzKGNsYXNzT2JqZWN0KS5mbGF0TWFwKChbY2xhc3NTdHJpbmcsIGJvb2xdKSA9PiAhYm9vbCA/IHNwbGl0Q2xhc3NlcyhjbGFzc1N0cmluZykgOiBmYWxzZSkuZmlsdGVyKEJvb2xlYW4pO1xuICBsZXQgYWRkZWQgPSBbXTtcbiAgbGV0IHJlbW92ZWQgPSBbXTtcbiAgZm9yUmVtb3ZlLmZvckVhY2goKGkpID0+IHtcbiAgICBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGkpKSB7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGkpO1xuICAgICAgcmVtb3ZlZC5wdXNoKGkpO1xuICAgIH1cbiAgfSk7XG4gIGZvckFkZC5mb3JFYWNoKChpKSA9PiB7XG4gICAgaWYgKCFlbC5jbGFzc0xpc3QuY29udGFpbnMoaSkpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoaSk7XG4gICAgICBhZGRlZC5wdXNoKGkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgcmVtb3ZlZC5mb3JFYWNoKChpKSA9PiBlbC5jbGFzc0xpc3QuYWRkKGkpKTtcbiAgICBhZGRlZC5mb3JFYWNoKChpKSA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKGkpKTtcbiAgfTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL3N0eWxlcy5qc1xuZnVuY3Rpb24gc2V0U3R5bGVzKGVsLCB2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIHNldFN0eWxlc0Zyb21PYmplY3QoZWwsIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gc2V0U3R5bGVzRnJvbVN0cmluZyhlbCwgdmFsdWUpO1xufVxuZnVuY3Rpb24gc2V0U3R5bGVzRnJvbU9iamVjdChlbCwgdmFsdWUpIHtcbiAgbGV0IHByZXZpb3VzU3R5bGVzID0ge307XG4gIE9iamVjdC5lbnRyaWVzKHZhbHVlKS5mb3JFYWNoKChba2V5LCB2YWx1ZTJdKSA9PiB7XG4gICAgcHJldmlvdXNTdHlsZXNba2V5XSA9IGVsLnN0eWxlW2tleV07XG4gICAgaWYgKCFrZXkuc3RhcnRzV2l0aChcIi0tXCIpKSB7XG4gICAgICBrZXkgPSBrZWJhYkNhc2Uoa2V5KTtcbiAgICB9XG4gICAgZWwuc3R5bGUuc2V0UHJvcGVydHkoa2V5LCB2YWx1ZTIpO1xuICB9KTtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgaWYgKGVsLnN0eWxlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBzZXRTdHlsZXMoZWwsIHByZXZpb3VzU3R5bGVzKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIHNldFN0eWxlc0Zyb21TdHJpbmcoZWwsIHZhbHVlKSB7XG4gIGxldCBjYWNoZSA9IGVsLmdldEF0dHJpYnV0ZShcInN0eWxlXCIsIHZhbHVlKTtcbiAgZWwuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgdmFsdWUpO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGVsLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIGNhY2hlIHx8IFwiXCIpO1xuICB9O1xufVxuZnVuY3Rpb24ga2ViYWJDYXNlKHN1YmplY3QpIHtcbiAgcmV0dXJuIHN1YmplY3QucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgXCIkMS0kMlwiKS50b0xvd2VyQ2FzZSgpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvb25jZS5qc1xuZnVuY3Rpb24gb25jZShjYWxsYmFjaywgZmFsbGJhY2sgPSAoKSA9PiB7XG59KSB7XG4gIGxldCBjYWxsZWQgPSBmYWxzZTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGlmICghY2FsbGVkKSB7XG4gICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmFsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH07XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtdHJhbnNpdGlvbi5qc1xuZGlyZWN0aXZlKFwidHJhbnNpdGlvblwiLCAoZWwsIHsgdmFsdWUsIG1vZGlmaWVycywgZXhwcmVzc2lvbiB9LCB7IGV2YWx1YXRlOiBldmFsdWF0ZTIgfSkgPT4ge1xuICBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09IFwiZnVuY3Rpb25cIilcbiAgICBleHByZXNzaW9uID0gZXZhbHVhdGUyKGV4cHJlc3Npb24pO1xuICBpZiAoZXhwcmVzc2lvbiA9PT0gZmFsc2UpXG4gICAgcmV0dXJuO1xuICBpZiAoIWV4cHJlc3Npb24gfHwgdHlwZW9mIGV4cHJlc3Npb24gPT09IFwiYm9vbGVhblwiKSB7XG4gICAgcmVnaXN0ZXJUcmFuc2l0aW9uc0Zyb21IZWxwZXIoZWwsIG1vZGlmaWVycywgdmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIHJlZ2lzdGVyVHJhbnNpdGlvbnNGcm9tQ2xhc3NTdHJpbmcoZWwsIGV4cHJlc3Npb24sIHZhbHVlKTtcbiAgfVxufSk7XG5mdW5jdGlvbiByZWdpc3RlclRyYW5zaXRpb25zRnJvbUNsYXNzU3RyaW5nKGVsLCBjbGFzc1N0cmluZywgc3RhZ2UpIHtcbiAgcmVnaXN0ZXJUcmFuc2l0aW9uT2JqZWN0KGVsLCBzZXRDbGFzc2VzLCBcIlwiKTtcbiAgbGV0IGRpcmVjdGl2ZVN0b3JhZ2VNYXAgPSB7XG4gICAgXCJlbnRlclwiOiAoY2xhc3NlcykgPT4ge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5kdXJpbmcgPSBjbGFzc2VzO1xuICAgIH0sXG4gICAgXCJlbnRlci1zdGFydFwiOiAoY2xhc3NlcykgPT4ge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5zdGFydCA9IGNsYXNzZXM7XG4gICAgfSxcbiAgICBcImVudGVyLWVuZFwiOiAoY2xhc3NlcykgPT4ge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5lbmQgPSBjbGFzc2VzO1xuICAgIH0sXG4gICAgXCJsZWF2ZVwiOiAoY2xhc3NlcykgPT4ge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5sZWF2ZS5kdXJpbmcgPSBjbGFzc2VzO1xuICAgIH0sXG4gICAgXCJsZWF2ZS1zdGFydFwiOiAoY2xhc3NlcykgPT4ge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5sZWF2ZS5zdGFydCA9IGNsYXNzZXM7XG4gICAgfSxcbiAgICBcImxlYXZlLWVuZFwiOiAoY2xhc3NlcykgPT4ge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5sZWF2ZS5lbmQgPSBjbGFzc2VzO1xuICAgIH1cbiAgfTtcbiAgZGlyZWN0aXZlU3RvcmFnZU1hcFtzdGFnZV0oY2xhc3NTdHJpbmcpO1xufVxuZnVuY3Rpb24gcmVnaXN0ZXJUcmFuc2l0aW9uc0Zyb21IZWxwZXIoZWwsIG1vZGlmaWVycywgc3RhZ2UpIHtcbiAgcmVnaXN0ZXJUcmFuc2l0aW9uT2JqZWN0KGVsLCBzZXRTdHlsZXMpO1xuICBsZXQgZG9lc250U3BlY2lmeSA9ICFtb2RpZmllcnMuaW5jbHVkZXMoXCJpblwiKSAmJiAhbW9kaWZpZXJzLmluY2x1ZGVzKFwib3V0XCIpICYmICFzdGFnZTtcbiAgbGV0IHRyYW5zaXRpb25pbmdJbiA9IGRvZXNudFNwZWNpZnkgfHwgbW9kaWZpZXJzLmluY2x1ZGVzKFwiaW5cIikgfHwgW1wiZW50ZXJcIl0uaW5jbHVkZXMoc3RhZ2UpO1xuICBsZXQgdHJhbnNpdGlvbmluZ091dCA9IGRvZXNudFNwZWNpZnkgfHwgbW9kaWZpZXJzLmluY2x1ZGVzKFwib3V0XCIpIHx8IFtcImxlYXZlXCJdLmluY2x1ZGVzKHN0YWdlKTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImluXCIpICYmICFkb2VzbnRTcGVjaWZ5KSB7XG4gICAgbW9kaWZpZXJzID0gbW9kaWZpZXJzLmZpbHRlcigoaSwgaW5kZXgpID0+IGluZGV4IDwgbW9kaWZpZXJzLmluZGV4T2YoXCJvdXRcIikpO1xuICB9XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJvdXRcIikgJiYgIWRvZXNudFNwZWNpZnkpIHtcbiAgICBtb2RpZmllcnMgPSBtb2RpZmllcnMuZmlsdGVyKChpLCBpbmRleCkgPT4gaW5kZXggPiBtb2RpZmllcnMuaW5kZXhPZihcIm91dFwiKSk7XG4gIH1cbiAgbGV0IHdhbnRzQWxsID0gIW1vZGlmaWVycy5pbmNsdWRlcyhcIm9wYWNpdHlcIikgJiYgIW1vZGlmaWVycy5pbmNsdWRlcyhcInNjYWxlXCIpO1xuICBsZXQgd2FudHNPcGFjaXR5ID0gd2FudHNBbGwgfHwgbW9kaWZpZXJzLmluY2x1ZGVzKFwib3BhY2l0eVwiKTtcbiAgbGV0IHdhbnRzU2NhbGUgPSB3YW50c0FsbCB8fCBtb2RpZmllcnMuaW5jbHVkZXMoXCJzY2FsZVwiKTtcbiAgbGV0IG9wYWNpdHlWYWx1ZSA9IHdhbnRzT3BhY2l0eSA/IDAgOiAxO1xuICBsZXQgc2NhbGVWYWx1ZSA9IHdhbnRzU2NhbGUgPyBtb2RpZmllclZhbHVlKG1vZGlmaWVycywgXCJzY2FsZVwiLCA5NSkgLyAxMDAgOiAxO1xuICBsZXQgZGVsYXkgPSBtb2RpZmllclZhbHVlKG1vZGlmaWVycywgXCJkZWxheVwiLCAwKSAvIDFlMztcbiAgbGV0IG9yaWdpbiA9IG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBcIm9yaWdpblwiLCBcImNlbnRlclwiKTtcbiAgbGV0IHByb3BlcnR5ID0gXCJvcGFjaXR5LCB0cmFuc2Zvcm1cIjtcbiAgbGV0IGR1cmF0aW9uSW4gPSBtb2RpZmllclZhbHVlKG1vZGlmaWVycywgXCJkdXJhdGlvblwiLCAxNTApIC8gMWUzO1xuICBsZXQgZHVyYXRpb25PdXQgPSBtb2RpZmllclZhbHVlKG1vZGlmaWVycywgXCJkdXJhdGlvblwiLCA3NSkgLyAxZTM7XG4gIGxldCBlYXNpbmcgPSBgY3ViaWMtYmV6aWVyKDAuNCwgMC4wLCAwLjIsIDEpYDtcbiAgaWYgKHRyYW5zaXRpb25pbmdJbikge1xuICAgIGVsLl94X3RyYW5zaXRpb24uZW50ZXIuZHVyaW5nID0ge1xuICAgICAgdHJhbnNmb3JtT3JpZ2luOiBvcmlnaW4sXG4gICAgICB0cmFuc2l0aW9uRGVsYXk6IGAke2RlbGF5fXNgLFxuICAgICAgdHJhbnNpdGlvblByb3BlcnR5OiBwcm9wZXJ0eSxcbiAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogYCR7ZHVyYXRpb25Jbn1zYCxcbiAgICAgIHRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbjogZWFzaW5nXG4gICAgfTtcbiAgICBlbC5feF90cmFuc2l0aW9uLmVudGVyLnN0YXJ0ID0ge1xuICAgICAgb3BhY2l0eTogb3BhY2l0eVZhbHVlLFxuICAgICAgdHJhbnNmb3JtOiBgc2NhbGUoJHtzY2FsZVZhbHVlfSlgXG4gICAgfTtcbiAgICBlbC5feF90cmFuc2l0aW9uLmVudGVyLmVuZCA9IHtcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICB0cmFuc2Zvcm06IGBzY2FsZSgxKWBcbiAgICB9O1xuICB9XG4gIGlmICh0cmFuc2l0aW9uaW5nT3V0KSB7XG4gICAgZWwuX3hfdHJhbnNpdGlvbi5sZWF2ZS5kdXJpbmcgPSB7XG4gICAgICB0cmFuc2Zvcm1PcmlnaW46IG9yaWdpbixcbiAgICAgIHRyYW5zaXRpb25EZWxheTogYCR7ZGVsYXl9c2AsXG4gICAgICB0cmFuc2l0aW9uUHJvcGVydHk6IHByb3BlcnR5LFxuICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiBgJHtkdXJhdGlvbk91dH1zYCxcbiAgICAgIHRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbjogZWFzaW5nXG4gICAgfTtcbiAgICBlbC5feF90cmFuc2l0aW9uLmxlYXZlLnN0YXJ0ID0ge1xuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIHRyYW5zZm9ybTogYHNjYWxlKDEpYFxuICAgIH07XG4gICAgZWwuX3hfdHJhbnNpdGlvbi5sZWF2ZS5lbmQgPSB7XG4gICAgICBvcGFjaXR5OiBvcGFjaXR5VmFsdWUsXG4gICAgICB0cmFuc2Zvcm06IGBzY2FsZSgke3NjYWxlVmFsdWV9KWBcbiAgICB9O1xuICB9XG59XG5mdW5jdGlvbiByZWdpc3RlclRyYW5zaXRpb25PYmplY3QoZWwsIHNldEZ1bmN0aW9uLCBkZWZhdWx0VmFsdWUgPSB7fSkge1xuICBpZiAoIWVsLl94X3RyYW5zaXRpb24pXG4gICAgZWwuX3hfdHJhbnNpdGlvbiA9IHtcbiAgICAgIGVudGVyOiB7IGR1cmluZzogZGVmYXVsdFZhbHVlLCBzdGFydDogZGVmYXVsdFZhbHVlLCBlbmQ6IGRlZmF1bHRWYWx1ZSB9LFxuICAgICAgbGVhdmU6IHsgZHVyaW5nOiBkZWZhdWx0VmFsdWUsIHN0YXJ0OiBkZWZhdWx0VmFsdWUsIGVuZDogZGVmYXVsdFZhbHVlIH0sXG4gICAgICBpbihiZWZvcmUgPSAoKSA9PiB7XG4gICAgICB9LCBhZnRlciA9ICgpID0+IHtcbiAgICAgIH0pIHtcbiAgICAgICAgdHJhbnNpdGlvbihlbCwgc2V0RnVuY3Rpb24sIHtcbiAgICAgICAgICBkdXJpbmc6IHRoaXMuZW50ZXIuZHVyaW5nLFxuICAgICAgICAgIHN0YXJ0OiB0aGlzLmVudGVyLnN0YXJ0LFxuICAgICAgICAgIGVuZDogdGhpcy5lbnRlci5lbmRcbiAgICAgICAgfSwgYmVmb3JlLCBhZnRlcik7XG4gICAgICB9LFxuICAgICAgb3V0KGJlZm9yZSA9ICgpID0+IHtcbiAgICAgIH0sIGFmdGVyID0gKCkgPT4ge1xuICAgICAgfSkge1xuICAgICAgICB0cmFuc2l0aW9uKGVsLCBzZXRGdW5jdGlvbiwge1xuICAgICAgICAgIGR1cmluZzogdGhpcy5sZWF2ZS5kdXJpbmcsXG4gICAgICAgICAgc3RhcnQ6IHRoaXMubGVhdmUuc3RhcnQsXG4gICAgICAgICAgZW5kOiB0aGlzLmxlYXZlLmVuZFxuICAgICAgICB9LCBiZWZvcmUsIGFmdGVyKTtcbiAgICAgIH1cbiAgICB9O1xufVxud2luZG93LkVsZW1lbnQucHJvdG90eXBlLl94X3RvZ2dsZUFuZENhc2NhZGVXaXRoVHJhbnNpdGlvbnMgPSBmdW5jdGlvbihlbCwgdmFsdWUsIHNob3csIGhpZGUpIHtcbiAgY29uc3QgbmV4dFRpY2syID0gZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSBcInZpc2libGVcIiA/IHJlcXVlc3RBbmltYXRpb25GcmFtZSA6IHNldFRpbWVvdXQ7XG4gIGxldCBjbGlja0F3YXlDb21wYXRpYmxlU2hvdyA9ICgpID0+IG5leHRUaWNrMihzaG93KTtcbiAgaWYgKHZhbHVlKSB7XG4gICAgaWYgKGVsLl94X3RyYW5zaXRpb24gJiYgKGVsLl94X3RyYW5zaXRpb24uZW50ZXIgfHwgZWwuX3hfdHJhbnNpdGlvbi5sZWF2ZSkpIHtcbiAgICAgIGVsLl94X3RyYW5zaXRpb24uZW50ZXIgJiYgKE9iamVjdC5lbnRyaWVzKGVsLl94X3RyYW5zaXRpb24uZW50ZXIuZHVyaW5nKS5sZW5ndGggfHwgT2JqZWN0LmVudHJpZXMoZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5zdGFydCkubGVuZ3RoIHx8IE9iamVjdC5lbnRyaWVzKGVsLl94X3RyYW5zaXRpb24uZW50ZXIuZW5kKS5sZW5ndGgpID8gZWwuX3hfdHJhbnNpdGlvbi5pbihzaG93KSA6IGNsaWNrQXdheUNvbXBhdGlibGVTaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLl94X3RyYW5zaXRpb24gPyBlbC5feF90cmFuc2l0aW9uLmluKHNob3cpIDogY2xpY2tBd2F5Q29tcGF0aWJsZVNob3coKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG4gIGVsLl94X2hpZGVQcm9taXNlID0gZWwuX3hfdHJhbnNpdGlvbiA/IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBlbC5feF90cmFuc2l0aW9uLm91dCgoKSA9PiB7XG4gICAgfSwgKCkgPT4gcmVzb2x2ZShoaWRlKSk7XG4gICAgZWwuX3hfdHJhbnNpdGlvbmluZyAmJiBlbC5feF90cmFuc2l0aW9uaW5nLmJlZm9yZUNhbmNlbCgoKSA9PiByZWplY3QoeyBpc0Zyb21DYW5jZWxsZWRUcmFuc2l0aW9uOiB0cnVlIH0pKTtcbiAgfSkgOiBQcm9taXNlLnJlc29sdmUoaGlkZSk7XG4gIHF1ZXVlTWljcm90YXNrKCgpID0+IHtcbiAgICBsZXQgY2xvc2VzdCA9IGNsb3Nlc3RIaWRlKGVsKTtcbiAgICBpZiAoY2xvc2VzdCkge1xuICAgICAgaWYgKCFjbG9zZXN0Ll94X2hpZGVDaGlsZHJlbilcbiAgICAgICAgY2xvc2VzdC5feF9oaWRlQ2hpbGRyZW4gPSBbXTtcbiAgICAgIGNsb3Nlc3QuX3hfaGlkZUNoaWxkcmVuLnB1c2goZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0VGljazIoKCkgPT4ge1xuICAgICAgICBsZXQgaGlkZUFmdGVyQ2hpbGRyZW4gPSAoZWwyKSA9PiB7XG4gICAgICAgICAgbGV0IGNhcnJ5ID0gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgZWwyLl94X2hpZGVQcm9taXNlLFxuICAgICAgICAgICAgLi4uKGVsMi5feF9oaWRlQ2hpbGRyZW4gfHwgW10pLm1hcChoaWRlQWZ0ZXJDaGlsZHJlbilcbiAgICAgICAgICBdKS50aGVuKChbaV0pID0+IGk/LigpKTtcbiAgICAgICAgICBkZWxldGUgZWwyLl94X2hpZGVQcm9taXNlO1xuICAgICAgICAgIGRlbGV0ZSBlbDIuX3hfaGlkZUNoaWxkcmVuO1xuICAgICAgICAgIHJldHVybiBjYXJyeTtcbiAgICAgICAgfTtcbiAgICAgICAgaGlkZUFmdGVyQ2hpbGRyZW4oZWwpLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgaWYgKCFlLmlzRnJvbUNhbmNlbGxlZFRyYW5zaXRpb24pXG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59O1xuZnVuY3Rpb24gY2xvc2VzdEhpZGUoZWwpIHtcbiAgbGV0IHBhcmVudCA9IGVsLnBhcmVudE5vZGU7XG4gIGlmICghcGFyZW50KVxuICAgIHJldHVybjtcbiAgcmV0dXJuIHBhcmVudC5feF9oaWRlUHJvbWlzZSA/IHBhcmVudCA6IGNsb3Nlc3RIaWRlKHBhcmVudCk7XG59XG5mdW5jdGlvbiB0cmFuc2l0aW9uKGVsLCBzZXRGdW5jdGlvbiwgeyBkdXJpbmcsIHN0YXJ0OiBzdGFydDIsIGVuZCB9ID0ge30sIGJlZm9yZSA9ICgpID0+IHtcbn0sIGFmdGVyID0gKCkgPT4ge1xufSkge1xuICBpZiAoZWwuX3hfdHJhbnNpdGlvbmluZylcbiAgICBlbC5feF90cmFuc2l0aW9uaW5nLmNhbmNlbCgpO1xuICBpZiAoT2JqZWN0LmtleXMoZHVyaW5nKS5sZW5ndGggPT09IDAgJiYgT2JqZWN0LmtleXMoc3RhcnQyKS5sZW5ndGggPT09IDAgJiYgT2JqZWN0LmtleXMoZW5kKS5sZW5ndGggPT09IDApIHtcbiAgICBiZWZvcmUoKTtcbiAgICBhZnRlcigpO1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgdW5kb1N0YXJ0LCB1bmRvRHVyaW5nLCB1bmRvRW5kO1xuICBwZXJmb3JtVHJhbnNpdGlvbihlbCwge1xuICAgIHN0YXJ0KCkge1xuICAgICAgdW5kb1N0YXJ0ID0gc2V0RnVuY3Rpb24oZWwsIHN0YXJ0Mik7XG4gICAgfSxcbiAgICBkdXJpbmcoKSB7XG4gICAgICB1bmRvRHVyaW5nID0gc2V0RnVuY3Rpb24oZWwsIGR1cmluZyk7XG4gICAgfSxcbiAgICBiZWZvcmUsXG4gICAgZW5kKCkge1xuICAgICAgdW5kb1N0YXJ0KCk7XG4gICAgICB1bmRvRW5kID0gc2V0RnVuY3Rpb24oZWwsIGVuZCk7XG4gICAgfSxcbiAgICBhZnRlcixcbiAgICBjbGVhbnVwKCkge1xuICAgICAgdW5kb0R1cmluZygpO1xuICAgICAgdW5kb0VuZCgpO1xuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBwZXJmb3JtVHJhbnNpdGlvbihlbCwgc3RhZ2VzKSB7XG4gIGxldCBpbnRlcnJ1cHRlZCwgcmVhY2hlZEJlZm9yZSwgcmVhY2hlZEVuZDtcbiAgbGV0IGZpbmlzaCA9IG9uY2UoKCkgPT4ge1xuICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICBpbnRlcnJ1cHRlZCA9IHRydWU7XG4gICAgICBpZiAoIXJlYWNoZWRCZWZvcmUpXG4gICAgICAgIHN0YWdlcy5iZWZvcmUoKTtcbiAgICAgIGlmICghcmVhY2hlZEVuZCkge1xuICAgICAgICBzdGFnZXMuZW5kKCk7XG4gICAgICAgIHJlbGVhc2VOZXh0VGlja3MoKTtcbiAgICAgIH1cbiAgICAgIHN0YWdlcy5hZnRlcigpO1xuICAgICAgaWYgKGVsLmlzQ29ubmVjdGVkKVxuICAgICAgICBzdGFnZXMuY2xlYW51cCgpO1xuICAgICAgZGVsZXRlIGVsLl94X3RyYW5zaXRpb25pbmc7XG4gICAgfSk7XG4gIH0pO1xuICBlbC5feF90cmFuc2l0aW9uaW5nID0ge1xuICAgIGJlZm9yZUNhbmNlbHM6IFtdLFxuICAgIGJlZm9yZUNhbmNlbChjYWxsYmFjaykge1xuICAgICAgdGhpcy5iZWZvcmVDYW5jZWxzLnB1c2goY2FsbGJhY2spO1xuICAgIH0sXG4gICAgY2FuY2VsOiBvbmNlKGZ1bmN0aW9uKCkge1xuICAgICAgd2hpbGUgKHRoaXMuYmVmb3JlQ2FuY2Vscy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5iZWZvcmVDYW5jZWxzLnNoaWZ0KCkoKTtcbiAgICAgIH1cbiAgICAgIDtcbiAgICAgIGZpbmlzaCgpO1xuICAgIH0pLFxuICAgIGZpbmlzaFxuICB9O1xuICBtdXRhdGVEb20oKCkgPT4ge1xuICAgIHN0YWdlcy5zdGFydCgpO1xuICAgIHN0YWdlcy5kdXJpbmcoKTtcbiAgfSk7XG4gIGhvbGROZXh0VGlja3MoKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICBpZiAoaW50ZXJydXB0ZWQpXG4gICAgICByZXR1cm47XG4gICAgbGV0IGR1cmF0aW9uID0gTnVtYmVyKGdldENvbXB1dGVkU3R5bGUoZWwpLnRyYW5zaXRpb25EdXJhdGlvbi5yZXBsYWNlKC8sLiovLCBcIlwiKS5yZXBsYWNlKFwic1wiLCBcIlwiKSkgKiAxZTM7XG4gICAgbGV0IGRlbGF5ID0gTnVtYmVyKGdldENvbXB1dGVkU3R5bGUoZWwpLnRyYW5zaXRpb25EZWxheS5yZXBsYWNlKC8sLiovLCBcIlwiKS5yZXBsYWNlKFwic1wiLCBcIlwiKSkgKiAxZTM7XG4gICAgaWYgKGR1cmF0aW9uID09PSAwKVxuICAgICAgZHVyYXRpb24gPSBOdW1iZXIoZ2V0Q29tcHV0ZWRTdHlsZShlbCkuYW5pbWF0aW9uRHVyYXRpb24ucmVwbGFjZShcInNcIiwgXCJcIikpICogMWUzO1xuICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICBzdGFnZXMuYmVmb3JlKCk7XG4gICAgfSk7XG4gICAgcmVhY2hlZEJlZm9yZSA9IHRydWU7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGlmIChpbnRlcnJ1cHRlZClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgICAgc3RhZ2VzLmVuZCgpO1xuICAgICAgfSk7XG4gICAgICByZWxlYXNlTmV4dFRpY2tzKCk7XG4gICAgICBzZXRUaW1lb3V0KGVsLl94X3RyYW5zaXRpb25pbmcuZmluaXNoLCBkdXJhdGlvbiArIGRlbGF5KTtcbiAgICAgIHJlYWNoZWRFbmQgPSB0cnVlO1xuICAgIH0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBrZXksIGZhbGxiYWNrKSB7XG4gIGlmIChtb2RpZmllcnMuaW5kZXhPZihrZXkpID09PSAtMSlcbiAgICByZXR1cm4gZmFsbGJhY2s7XG4gIGNvbnN0IHJhd1ZhbHVlID0gbW9kaWZpZXJzW21vZGlmaWVycy5pbmRleE9mKGtleSkgKyAxXTtcbiAgaWYgKCFyYXdWYWx1ZSlcbiAgICByZXR1cm4gZmFsbGJhY2s7XG4gIGlmIChrZXkgPT09IFwic2NhbGVcIikge1xuICAgIGlmIChpc05hTihyYXdWYWx1ZSkpXG4gICAgICByZXR1cm4gZmFsbGJhY2s7XG4gIH1cbiAgaWYgKGtleSA9PT0gXCJkdXJhdGlvblwiIHx8IGtleSA9PT0gXCJkZWxheVwiKSB7XG4gICAgbGV0IG1hdGNoID0gcmF3VmFsdWUubWF0Y2goLyhbMC05XSspbXMvKTtcbiAgICBpZiAobWF0Y2gpXG4gICAgICByZXR1cm4gbWF0Y2hbMV07XG4gIH1cbiAgaWYgKGtleSA9PT0gXCJvcmlnaW5cIikge1xuICAgIGlmIChbXCJ0b3BcIiwgXCJyaWdodFwiLCBcImxlZnRcIiwgXCJjZW50ZXJcIiwgXCJib3R0b21cIl0uaW5jbHVkZXMobW9kaWZpZXJzW21vZGlmaWVycy5pbmRleE9mKGtleSkgKyAyXSkpIHtcbiAgICAgIHJldHVybiBbcmF3VmFsdWUsIG1vZGlmaWVyc1ttb2RpZmllcnMuaW5kZXhPZihrZXkpICsgMl1dLmpvaW4oXCIgXCIpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmF3VmFsdWU7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9jbG9uZS5qc1xudmFyIGlzQ2xvbmluZyA9IGZhbHNlO1xuZnVuY3Rpb24gc2tpcER1cmluZ0Nsb25lKGNhbGxiYWNrLCBmYWxsYmFjayA9ICgpID0+IHtcbn0pIHtcbiAgcmV0dXJuICguLi5hcmdzKSA9PiBpc0Nsb25pbmcgPyBmYWxsYmFjayguLi5hcmdzKSA6IGNhbGxiYWNrKC4uLmFyZ3MpO1xufVxuZnVuY3Rpb24gb25seUR1cmluZ0Nsb25lKGNhbGxiYWNrKSB7XG4gIHJldHVybiAoLi4uYXJncykgPT4gaXNDbG9uaW5nICYmIGNhbGxiYWNrKC4uLmFyZ3MpO1xufVxudmFyIGludGVyY2VwdG9ycyA9IFtdO1xuZnVuY3Rpb24gaW50ZXJjZXB0Q2xvbmUoY2FsbGJhY2spIHtcbiAgaW50ZXJjZXB0b3JzLnB1c2goY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gY2xvbmVOb2RlKGZyb20sIHRvKSB7XG4gIGludGVyY2VwdG9ycy5mb3JFYWNoKChpKSA9PiBpKGZyb20sIHRvKSk7XG4gIGlzQ2xvbmluZyA9IHRydWU7XG4gIGRvbnRSZWdpc3RlclJlYWN0aXZlU2lkZUVmZmVjdHMoKCkgPT4ge1xuICAgIGluaXRUcmVlKHRvLCAoZWwsIGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayhlbCwgKCkgPT4ge1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuICBpc0Nsb25pbmcgPSBmYWxzZTtcbn1cbnZhciBpc0Nsb25pbmdMZWdhY3kgPSBmYWxzZTtcbmZ1bmN0aW9uIGNsb25lKG9sZEVsLCBuZXdFbCkge1xuICBpZiAoIW5ld0VsLl94X2RhdGFTdGFjaylcbiAgICBuZXdFbC5feF9kYXRhU3RhY2sgPSBvbGRFbC5feF9kYXRhU3RhY2s7XG4gIGlzQ2xvbmluZyA9IHRydWU7XG4gIGlzQ2xvbmluZ0xlZ2FjeSA9IHRydWU7XG4gIGRvbnRSZWdpc3RlclJlYWN0aXZlU2lkZUVmZmVjdHMoKCkgPT4ge1xuICAgIGNsb25lVHJlZShuZXdFbCk7XG4gIH0pO1xuICBpc0Nsb25pbmcgPSBmYWxzZTtcbiAgaXNDbG9uaW5nTGVnYWN5ID0gZmFsc2U7XG59XG5mdW5jdGlvbiBjbG9uZVRyZWUoZWwpIHtcbiAgbGV0IGhhc1J1blRocm91Z2hGaXJzdEVsID0gZmFsc2U7XG4gIGxldCBzaGFsbG93V2Fsa2VyID0gKGVsMiwgY2FsbGJhY2spID0+IHtcbiAgICB3YWxrKGVsMiwgKGVsMywgc2tpcCkgPT4ge1xuICAgICAgaWYgKGhhc1J1blRocm91Z2hGaXJzdEVsICYmIGlzUm9vdChlbDMpKVxuICAgICAgICByZXR1cm4gc2tpcCgpO1xuICAgICAgaGFzUnVuVGhyb3VnaEZpcnN0RWwgPSB0cnVlO1xuICAgICAgY2FsbGJhY2soZWwzLCBza2lwKTtcbiAgICB9KTtcbiAgfTtcbiAgaW5pdFRyZWUoZWwsIHNoYWxsb3dXYWxrZXIpO1xufVxuZnVuY3Rpb24gZG9udFJlZ2lzdGVyUmVhY3RpdmVTaWRlRWZmZWN0cyhjYWxsYmFjaykge1xuICBsZXQgY2FjaGUgPSBlZmZlY3Q7XG4gIG92ZXJyaWRlRWZmZWN0KChjYWxsYmFjazIsIGVsKSA9PiB7XG4gICAgbGV0IHN0b3JlZEVmZmVjdCA9IGNhY2hlKGNhbGxiYWNrMik7XG4gICAgcmVsZWFzZShzdG9yZWRFZmZlY3QpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgfTtcbiAgfSk7XG4gIGNhbGxiYWNrKCk7XG4gIG92ZXJyaWRlRWZmZWN0KGNhY2hlKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL2JpbmQuanNcbmZ1bmN0aW9uIGJpbmQoZWwsIG5hbWUsIHZhbHVlLCBtb2RpZmllcnMgPSBbXSkge1xuICBpZiAoIWVsLl94X2JpbmRpbmdzKVxuICAgIGVsLl94X2JpbmRpbmdzID0gcmVhY3RpdmUoe30pO1xuICBlbC5feF9iaW5kaW5nc1tuYW1lXSA9IHZhbHVlO1xuICBuYW1lID0gbW9kaWZpZXJzLmluY2x1ZGVzKFwiY2FtZWxcIikgPyBjYW1lbENhc2UobmFtZSkgOiBuYW1lO1xuICBzd2l0Y2ggKG5hbWUpIHtcbiAgICBjYXNlIFwidmFsdWVcIjpcbiAgICAgIGJpbmRJbnB1dFZhbHVlKGVsLCB2YWx1ZSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwic3R5bGVcIjpcbiAgICAgIGJpbmRTdHlsZXMoZWwsIHZhbHVlKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJjbGFzc1wiOlxuICAgICAgYmluZENsYXNzZXMoZWwsIHZhbHVlKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJzZWxlY3RlZFwiOlxuICAgIGNhc2UgXCJjaGVja2VkXCI6XG4gICAgICBiaW5kQXR0cmlidXRlQW5kUHJvcGVydHkoZWwsIG5hbWUsIHZhbHVlKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBiaW5kQXR0cmlidXRlKGVsLCBuYW1lLCB2YWx1ZSk7XG4gICAgICBicmVhaztcbiAgfVxufVxuZnVuY3Rpb24gYmluZElucHV0VmFsdWUoZWwsIHZhbHVlKSB7XG4gIGlmIChpc1JhZGlvKGVsKSkge1xuICAgIGlmIChlbC5hdHRyaWJ1dGVzLnZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIGVsLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzQ2hlY2tib3goZWwpKSB7XG4gICAgaWYgKE51bWJlci5pc0ludGVnZXIodmFsdWUpKSB7XG4gICAgICBlbC52YWx1ZSA9IHZhbHVlO1xuICAgIH0gZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpICYmIHR5cGVvZiB2YWx1ZSAhPT0gXCJib29sZWFuXCIgJiYgIVtudWxsLCB2b2lkIDBdLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgZWwudmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgZWwuY2hlY2tlZCA9IHZhbHVlLnNvbWUoKHZhbCkgPT4gY2hlY2tlZEF0dHJMb29zZUNvbXBhcmUodmFsLCBlbC52YWx1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuY2hlY2tlZCA9ICEhdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKGVsLnRhZ05hbWUgPT09IFwiU0VMRUNUXCIpIHtcbiAgICB1cGRhdGVTZWxlY3QoZWwsIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoZWwudmFsdWUgPT09IHZhbHVlKVxuICAgICAgcmV0dXJuO1xuICAgIGVsLnZhbHVlID0gdmFsdWUgPT09IHZvaWQgMCA/IFwiXCIgOiB2YWx1ZTtcbiAgfVxufVxuZnVuY3Rpb24gYmluZENsYXNzZXMoZWwsIHZhbHVlKSB7XG4gIGlmIChlbC5feF91bmRvQWRkZWRDbGFzc2VzKVxuICAgIGVsLl94X3VuZG9BZGRlZENsYXNzZXMoKTtcbiAgZWwuX3hfdW5kb0FkZGVkQ2xhc3NlcyA9IHNldENsYXNzZXMoZWwsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGJpbmRTdHlsZXMoZWwsIHZhbHVlKSB7XG4gIGlmIChlbC5feF91bmRvQWRkZWRTdHlsZXMpXG4gICAgZWwuX3hfdW5kb0FkZGVkU3R5bGVzKCk7XG4gIGVsLl94X3VuZG9BZGRlZFN0eWxlcyA9IHNldFN0eWxlcyhlbCwgdmFsdWUpO1xufVxuZnVuY3Rpb24gYmluZEF0dHJpYnV0ZUFuZFByb3BlcnR5KGVsLCBuYW1lLCB2YWx1ZSkge1xuICBiaW5kQXR0cmlidXRlKGVsLCBuYW1lLCB2YWx1ZSk7XG4gIHNldFByb3BlcnR5SWZDaGFuZ2VkKGVsLCBuYW1lLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiBiaW5kQXR0cmlidXRlKGVsLCBuYW1lLCB2YWx1ZSkge1xuICBpZiAoW251bGwsIHZvaWQgMCwgZmFsc2VdLmluY2x1ZGVzKHZhbHVlKSAmJiBhdHRyaWJ1dGVTaG91bGRudEJlUHJlc2VydmVkSWZGYWxzeShuYW1lKSkge1xuICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoaXNCb29sZWFuQXR0cihuYW1lKSlcbiAgICAgIHZhbHVlID0gbmFtZTtcbiAgICBzZXRJZkNoYW5nZWQoZWwsIG5hbWUsIHZhbHVlKTtcbiAgfVxufVxuZnVuY3Rpb24gc2V0SWZDaGFuZ2VkKGVsLCBhdHRyTmFtZSwgdmFsdWUpIHtcbiAgaWYgKGVsLmdldEF0dHJpYnV0ZShhdHRyTmFtZSkgIT0gdmFsdWUpIHtcbiAgICBlbC5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIHZhbHVlKTtcbiAgfVxufVxuZnVuY3Rpb24gc2V0UHJvcGVydHlJZkNoYW5nZWQoZWwsIHByb3BOYW1lLCB2YWx1ZSkge1xuICBpZiAoZWxbcHJvcE5hbWVdICE9PSB2YWx1ZSkge1xuICAgIGVsW3Byb3BOYW1lXSA9IHZhbHVlO1xuICB9XG59XG5mdW5jdGlvbiB1cGRhdGVTZWxlY3QoZWwsIHZhbHVlKSB7XG4gIGNvbnN0IGFycmF5V3JhcHBlZFZhbHVlID0gW10uY29uY2F0KHZhbHVlKS5tYXAoKHZhbHVlMikgPT4ge1xuICAgIHJldHVybiB2YWx1ZTIgKyBcIlwiO1xuICB9KTtcbiAgQXJyYXkuZnJvbShlbC5vcHRpb25zKS5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICBvcHRpb24uc2VsZWN0ZWQgPSBhcnJheVdyYXBwZWRWYWx1ZS5pbmNsdWRlcyhvcHRpb24udmFsdWUpO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGNhbWVsQ2FzZShzdWJqZWN0KSB7XG4gIHJldHVybiBzdWJqZWN0LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvLShcXHcpL2csIChtYXRjaCwgY2hhcikgPT4gY2hhci50b1VwcGVyQ2FzZSgpKTtcbn1cbmZ1bmN0aW9uIGNoZWNrZWRBdHRyTG9vc2VDb21wYXJlKHZhbHVlQSwgdmFsdWVCKSB7XG4gIHJldHVybiB2YWx1ZUEgPT0gdmFsdWVCO1xufVxuZnVuY3Rpb24gc2FmZVBhcnNlQm9vbGVhbihyYXdWYWx1ZSkge1xuICBpZiAoWzEsIFwiMVwiLCBcInRydWVcIiwgXCJvblwiLCBcInllc1wiLCB0cnVlXS5pbmNsdWRlcyhyYXdWYWx1ZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoWzAsIFwiMFwiLCBcImZhbHNlXCIsIFwib2ZmXCIsIFwibm9cIiwgZmFsc2VdLmluY2x1ZGVzKHJhd1ZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gcmF3VmFsdWUgPyBCb29sZWFuKHJhd1ZhbHVlKSA6IG51bGw7XG59XG52YXIgYm9vbGVhbkF0dHJpYnV0ZXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXG4gIFwiYWxsb3dmdWxsc2NyZWVuXCIsXG4gIFwiYXN5bmNcIixcbiAgXCJhdXRvZm9jdXNcIixcbiAgXCJhdXRvcGxheVwiLFxuICBcImNoZWNrZWRcIixcbiAgXCJjb250cm9sc1wiLFxuICBcImRlZmF1bHRcIixcbiAgXCJkZWZlclwiLFxuICBcImRpc2FibGVkXCIsXG4gIFwiZm9ybW5vdmFsaWRhdGVcIixcbiAgXCJpbmVydFwiLFxuICBcImlzbWFwXCIsXG4gIFwiaXRlbXNjb3BlXCIsXG4gIFwibG9vcFwiLFxuICBcIm11bHRpcGxlXCIsXG4gIFwibXV0ZWRcIixcbiAgXCJub21vZHVsZVwiLFxuICBcIm5vdmFsaWRhdGVcIixcbiAgXCJvcGVuXCIsXG4gIFwicGxheXNpbmxpbmVcIixcbiAgXCJyZWFkb25seVwiLFxuICBcInJlcXVpcmVkXCIsXG4gIFwicmV2ZXJzZWRcIixcbiAgXCJzZWxlY3RlZFwiLFxuICBcInNoYWRvd3Jvb3RjbG9uYWJsZVwiLFxuICBcInNoYWRvd3Jvb3RkZWxlZ2F0ZXNmb2N1c1wiLFxuICBcInNoYWRvd3Jvb3RzZXJpYWxpemFibGVcIlxuXSk7XG5mdW5jdGlvbiBpc0Jvb2xlYW5BdHRyKGF0dHJOYW1lKSB7XG4gIHJldHVybiBib29sZWFuQXR0cmlidXRlcy5oYXMoYXR0ck5hbWUpO1xufVxuZnVuY3Rpb24gYXR0cmlidXRlU2hvdWxkbnRCZVByZXNlcnZlZElmRmFsc3kobmFtZSkge1xuICByZXR1cm4gIVtcImFyaWEtcHJlc3NlZFwiLCBcImFyaWEtY2hlY2tlZFwiLCBcImFyaWEtZXhwYW5kZWRcIiwgXCJhcmlhLXNlbGVjdGVkXCJdLmluY2x1ZGVzKG5hbWUpO1xufVxuZnVuY3Rpb24gZ2V0QmluZGluZyhlbCwgbmFtZSwgZmFsbGJhY2spIHtcbiAgaWYgKGVsLl94X2JpbmRpbmdzICYmIGVsLl94X2JpbmRpbmdzW25hbWVdICE9PSB2b2lkIDApXG4gICAgcmV0dXJuIGVsLl94X2JpbmRpbmdzW25hbWVdO1xuICByZXR1cm4gZ2V0QXR0cmlidXRlQmluZGluZyhlbCwgbmFtZSwgZmFsbGJhY2spO1xufVxuZnVuY3Rpb24gZXh0cmFjdFByb3AoZWwsIG5hbWUsIGZhbGxiYWNrLCBleHRyYWN0ID0gdHJ1ZSkge1xuICBpZiAoZWwuX3hfYmluZGluZ3MgJiYgZWwuX3hfYmluZGluZ3NbbmFtZV0gIT09IHZvaWQgMClcbiAgICByZXR1cm4gZWwuX3hfYmluZGluZ3NbbmFtZV07XG4gIGlmIChlbC5feF9pbmxpbmVCaW5kaW5ncyAmJiBlbC5feF9pbmxpbmVCaW5kaW5nc1tuYW1lXSAhPT0gdm9pZCAwKSB7XG4gICAgbGV0IGJpbmRpbmcgPSBlbC5feF9pbmxpbmVCaW5kaW5nc1tuYW1lXTtcbiAgICBiaW5kaW5nLmV4dHJhY3QgPSBleHRyYWN0O1xuICAgIHJldHVybiBkb250QXV0b0V2YWx1YXRlRnVuY3Rpb25zKCgpID0+IHtcbiAgICAgIHJldHVybiBldmFsdWF0ZShlbCwgYmluZGluZy5leHByZXNzaW9uKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZ2V0QXR0cmlidXRlQmluZGluZyhlbCwgbmFtZSwgZmFsbGJhY2spO1xufVxuZnVuY3Rpb24gZ2V0QXR0cmlidXRlQmluZGluZyhlbCwgbmFtZSwgZmFsbGJhY2spIHtcbiAgbGV0IGF0dHIgPSBlbC5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gIGlmIChhdHRyID09PSBudWxsKVxuICAgIHJldHVybiB0eXBlb2YgZmFsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiA/IGZhbGxiYWNrKCkgOiBmYWxsYmFjaztcbiAgaWYgKGF0dHIgPT09IFwiXCIpXG4gICAgcmV0dXJuIHRydWU7XG4gIGlmIChpc0Jvb2xlYW5BdHRyKG5hbWUpKSB7XG4gICAgcmV0dXJuICEhW25hbWUsIFwidHJ1ZVwiXS5pbmNsdWRlcyhhdHRyKTtcbiAgfVxuICByZXR1cm4gYXR0cjtcbn1cbmZ1bmN0aW9uIGlzQ2hlY2tib3goZWwpIHtcbiAgcmV0dXJuIGVsLnR5cGUgPT09IFwiY2hlY2tib3hcIiB8fCBlbC5sb2NhbE5hbWUgPT09IFwidWktY2hlY2tib3hcIiB8fCBlbC5sb2NhbE5hbWUgPT09IFwidWktc3dpdGNoXCI7XG59XG5mdW5jdGlvbiBpc1JhZGlvKGVsKSB7XG4gIHJldHVybiBlbC50eXBlID09PSBcInJhZGlvXCIgfHwgZWwubG9jYWxOYW1lID09PSBcInVpLXJhZGlvXCI7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy9kZWJvdW5jZS5qc1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCkge1xuICBsZXQgdGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuICAgIGNvbnN0IGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICB9O1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvdGhyb3R0bGUuanNcbmZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIGxpbWl0KSB7XG4gIGxldCBpblRocm90dGxlO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgbGV0IGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuICAgIGlmICghaW5UaHJvdHRsZSkge1xuICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGluVGhyb3R0bGUgPSB0cnVlO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiBpblRocm90dGxlID0gZmFsc2UsIGxpbWl0KTtcbiAgICB9XG4gIH07XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9lbnRhbmdsZS5qc1xuZnVuY3Rpb24gZW50YW5nbGUoeyBnZXQ6IG91dGVyR2V0LCBzZXQ6IG91dGVyU2V0IH0sIHsgZ2V0OiBpbm5lckdldCwgc2V0OiBpbm5lclNldCB9KSB7XG4gIGxldCBmaXJzdFJ1biA9IHRydWU7XG4gIGxldCBvdXRlckhhc2g7XG4gIGxldCBpbm5lckhhc2g7XG4gIGxldCByZWZlcmVuY2UgPSBlZmZlY3QoKCkgPT4ge1xuICAgIGxldCBvdXRlciA9IG91dGVyR2V0KCk7XG4gICAgbGV0IGlubmVyID0gaW5uZXJHZXQoKTtcbiAgICBpZiAoZmlyc3RSdW4pIHtcbiAgICAgIGlubmVyU2V0KGNsb25lSWZPYmplY3Qob3V0ZXIpKTtcbiAgICAgIGZpcnN0UnVuID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBvdXRlckhhc2hMYXRlc3QgPSBKU09OLnN0cmluZ2lmeShvdXRlcik7XG4gICAgICBsZXQgaW5uZXJIYXNoTGF0ZXN0ID0gSlNPTi5zdHJpbmdpZnkoaW5uZXIpO1xuICAgICAgaWYgKG91dGVySGFzaExhdGVzdCAhPT0gb3V0ZXJIYXNoKSB7XG4gICAgICAgIGlubmVyU2V0KGNsb25lSWZPYmplY3Qob3V0ZXIpKTtcbiAgICAgIH0gZWxzZSBpZiAob3V0ZXJIYXNoTGF0ZXN0ICE9PSBpbm5lckhhc2hMYXRlc3QpIHtcbiAgICAgICAgb3V0ZXJTZXQoY2xvbmVJZk9iamVjdChpbm5lcikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgIH1cbiAgICB9XG4gICAgb3V0ZXJIYXNoID0gSlNPTi5zdHJpbmdpZnkob3V0ZXJHZXQoKSk7XG4gICAgaW5uZXJIYXNoID0gSlNPTi5zdHJpbmdpZnkoaW5uZXJHZXQoKSk7XG4gIH0pO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIHJlbGVhc2UocmVmZXJlbmNlKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGNsb25lSWZPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiA/IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodmFsdWUpKSA6IHZhbHVlO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvcGx1Z2luLmpzXG5mdW5jdGlvbiBwbHVnaW4oY2FsbGJhY2spIHtcbiAgbGV0IGNhbGxiYWNrcyA9IEFycmF5LmlzQXJyYXkoY2FsbGJhY2spID8gY2FsbGJhY2sgOiBbY2FsbGJhY2tdO1xuICBjYWxsYmFja3MuZm9yRWFjaCgoaSkgPT4gaShhbHBpbmVfZGVmYXVsdCkpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvc3RvcmUuanNcbnZhciBzdG9yZXMgPSB7fTtcbnZhciBpc1JlYWN0aXZlID0gZmFsc2U7XG5mdW5jdGlvbiBzdG9yZShuYW1lLCB2YWx1ZSkge1xuICBpZiAoIWlzUmVhY3RpdmUpIHtcbiAgICBzdG9yZXMgPSByZWFjdGl2ZShzdG9yZXMpO1xuICAgIGlzUmVhY3RpdmUgPSB0cnVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgcmV0dXJuIHN0b3Jlc1tuYW1lXTtcbiAgfVxuICBzdG9yZXNbbmFtZV0gPSB2YWx1ZTtcbiAgaW5pdEludGVyY2VwdG9ycyhzdG9yZXNbbmFtZV0pO1xuICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlLmhhc093blByb3BlcnR5KFwiaW5pdFwiKSAmJiB0eXBlb2YgdmFsdWUuaW5pdCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgc3RvcmVzW25hbWVdLmluaXQoKTtcbiAgfVxufVxuZnVuY3Rpb24gZ2V0U3RvcmVzKCkge1xuICByZXR1cm4gc3RvcmVzO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvYmluZHMuanNcbnZhciBiaW5kcyA9IHt9O1xuZnVuY3Rpb24gYmluZDIobmFtZSwgYmluZGluZ3MpIHtcbiAgbGV0IGdldEJpbmRpbmdzID0gdHlwZW9mIGJpbmRpbmdzICE9PSBcImZ1bmN0aW9uXCIgPyAoKSA9PiBiaW5kaW5ncyA6IGJpbmRpbmdzO1xuICBpZiAobmFtZSBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICByZXR1cm4gYXBwbHlCaW5kaW5nc09iamVjdChuYW1lLCBnZXRCaW5kaW5ncygpKTtcbiAgfSBlbHNlIHtcbiAgICBiaW5kc1tuYW1lXSA9IGdldEJpbmRpbmdzO1xuICB9XG4gIHJldHVybiAoKSA9PiB7XG4gIH07XG59XG5mdW5jdGlvbiBpbmplY3RCaW5kaW5nUHJvdmlkZXJzKG9iaikge1xuICBPYmplY3QuZW50cmllcyhiaW5kcykuZm9yRWFjaCgoW25hbWUsIGNhbGxiYWNrXSkgPT4ge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIG9iajtcbn1cbmZ1bmN0aW9uIGFwcGx5QmluZGluZ3NPYmplY3QoZWwsIG9iaiwgb3JpZ2luYWwpIHtcbiAgbGV0IGNsZWFudXBSdW5uZXJzID0gW107XG4gIHdoaWxlIChjbGVhbnVwUnVubmVycy5sZW5ndGgpXG4gICAgY2xlYW51cFJ1bm5lcnMucG9wKCkoKTtcbiAgbGV0IGF0dHJpYnV0ZXMgPSBPYmplY3QuZW50cmllcyhvYmopLm1hcCgoW25hbWUsIHZhbHVlXSkgPT4gKHsgbmFtZSwgdmFsdWUgfSkpO1xuICBsZXQgc3RhdGljQXR0cmlidXRlcyA9IGF0dHJpYnV0ZXNPbmx5KGF0dHJpYnV0ZXMpO1xuICBhdHRyaWJ1dGVzID0gYXR0cmlidXRlcy5tYXAoKGF0dHJpYnV0ZSkgPT4ge1xuICAgIGlmIChzdGF0aWNBdHRyaWJ1dGVzLmZpbmQoKGF0dHIpID0+IGF0dHIubmFtZSA9PT0gYXR0cmlidXRlLm5hbWUpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBgeC1iaW5kOiR7YXR0cmlidXRlLm5hbWV9YCxcbiAgICAgICAgdmFsdWU6IGBcIiR7YXR0cmlidXRlLnZhbHVlfVwiYFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJpYnV0ZTtcbiAgfSk7XG4gIGRpcmVjdGl2ZXMoZWwsIGF0dHJpYnV0ZXMsIG9yaWdpbmFsKS5tYXAoKGhhbmRsZSkgPT4ge1xuICAgIGNsZWFudXBSdW5uZXJzLnB1c2goaGFuZGxlLnJ1bkNsZWFudXBzKTtcbiAgICBoYW5kbGUoKTtcbiAgfSk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgd2hpbGUgKGNsZWFudXBSdW5uZXJzLmxlbmd0aClcbiAgICAgIGNsZWFudXBSdW5uZXJzLnBvcCgpKCk7XG4gIH07XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kYXRhcy5qc1xudmFyIGRhdGFzID0ge307XG5mdW5jdGlvbiBkYXRhKG5hbWUsIGNhbGxiYWNrKSB7XG4gIGRhdGFzW25hbWVdID0gY2FsbGJhY2s7XG59XG5mdW5jdGlvbiBpbmplY3REYXRhUHJvdmlkZXJzKG9iaiwgY29udGV4dCkge1xuICBPYmplY3QuZW50cmllcyhkYXRhcykuZm9yRWFjaCgoW25hbWUsIGNhbGxiYWNrXSkgPT4ge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmJpbmQoY29udGV4dCkoLi4uYXJncyk7XG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBvYmo7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9hbHBpbmUuanNcbnZhciBBbHBpbmUgPSB7XG4gIGdldCByZWFjdGl2ZSgpIHtcbiAgICByZXR1cm4gcmVhY3RpdmU7XG4gIH0sXG4gIGdldCByZWxlYXNlKCkge1xuICAgIHJldHVybiByZWxlYXNlO1xuICB9LFxuICBnZXQgZWZmZWN0KCkge1xuICAgIHJldHVybiBlZmZlY3Q7XG4gIH0sXG4gIGdldCByYXcoKSB7XG4gICAgcmV0dXJuIHJhdztcbiAgfSxcbiAgZ2V0IHRyYW5zYWN0aW9uKCkge1xuICAgIHJldHVybiB0cmFuc2FjdGlvbjtcbiAgfSxcbiAgdmVyc2lvbjogXCIzLjE1LjExXCIsXG4gIGZsdXNoQW5kU3RvcERlZmVycmluZ011dGF0aW9ucyxcbiAgZG9udEF1dG9FdmFsdWF0ZUZ1bmN0aW9ucyxcbiAgZGlzYWJsZUVmZmVjdFNjaGVkdWxpbmcsXG4gIHN0YXJ0T2JzZXJ2aW5nTXV0YXRpb25zLFxuICBzdG9wT2JzZXJ2aW5nTXV0YXRpb25zLFxuICBzZXRSZWFjdGl2aXR5RW5naW5lLFxuICBvbkF0dHJpYnV0ZVJlbW92ZWQsXG4gIG9uQXR0cmlidXRlc0FkZGVkLFxuICBjbG9zZXN0RGF0YVN0YWNrLFxuICBza2lwRHVyaW5nQ2xvbmUsXG4gIG9ubHlEdXJpbmdDbG9uZSxcbiAgYWRkUm9vdFNlbGVjdG9yLFxuICBhZGRJbml0U2VsZWN0b3IsXG4gIHNldEVycm9ySGFuZGxlcixcbiAgaW50ZXJjZXB0Q2xvbmUsXG4gIGFkZFNjb3BlVG9Ob2RlLFxuICBkZWZlck11dGF0aW9ucyxcbiAgbWFwQXR0cmlidXRlcyxcbiAgZXZhbHVhdGVMYXRlcixcbiAgaW50ZXJjZXB0SW5pdCxcbiAgaW5pdEludGVyY2VwdG9ycyxcbiAgaW5qZWN0TWFnaWNzLFxuICBzZXRFdmFsdWF0b3IsXG4gIHNldFJhd0V2YWx1YXRvcixcbiAgbWVyZ2VQcm94aWVzLFxuICBleHRyYWN0UHJvcCxcbiAgZmluZENsb3Nlc3QsXG4gIG9uRWxSZW1vdmVkLFxuICBjbG9zZXN0Um9vdCxcbiAgZGVzdHJveVRyZWUsXG4gIGludGVyY2VwdG9yLFxuICAvLyBJTlRFUk5BTDogbm90IHB1YmxpYyBBUEkgYW5kIGlzIHN1YmplY3QgdG8gY2hhbmdlIHdpdGhvdXQgbWFqb3IgcmVsZWFzZS5cbiAgdHJhbnNpdGlvbixcbiAgLy8gSU5URVJOQUxcbiAgc2V0U3R5bGVzLFxuICAvLyBJTlRFUk5BTFxuICBtdXRhdGVEb20sXG4gIGRpcmVjdGl2ZSxcbiAgZW50YW5nbGUsXG4gIHRocm90dGxlLFxuICBkZWJvdW5jZSxcbiAgZXZhbHVhdGUsXG4gIGV2YWx1YXRlUmF3LFxuICBpbml0VHJlZSxcbiAgbmV4dFRpY2ssXG4gIHByZWZpeGVkOiBwcmVmaXgsXG4gIHByZWZpeDogc2V0UHJlZml4LFxuICBwbHVnaW4sXG4gIG1hZ2ljLFxuICBzdG9yZSxcbiAgc3RhcnQsXG4gIGNsb25lLFxuICAvLyBJTlRFUk5BTFxuICBjbG9uZU5vZGUsXG4gIC8vIElOVEVSTkFMXG4gIGJvdW5kOiBnZXRCaW5kaW5nLFxuICAkZGF0YTogc2NvcGUsXG4gIHdhdGNoLFxuICB3YWxrLFxuICBkYXRhLFxuICBiaW5kOiBiaW5kMlxufTtcbnZhciBhbHBpbmVfZGVmYXVsdCA9IEFscGluZTtcblxuLy8gbm9kZV9tb2R1bGVzL0B2dWUvc2hhcmVkL2Rpc3Qvc2hhcmVkLmVzbS1idW5kbGVyLmpzXG5mdW5jdGlvbiBtYWtlTWFwKHN0ciwgZXhwZWN0c0xvd2VyQ2FzZSkge1xuICBjb25zdCBtYXAgPSAvKiBAX19QVVJFX18gKi8gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgY29uc3QgbGlzdCA9IHN0ci5zcGxpdChcIixcIik7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIG1hcFtsaXN0W2ldXSA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIGV4cGVjdHNMb3dlckNhc2UgPyAodmFsKSA9PiAhIW1hcFt2YWwudG9Mb3dlckNhc2UoKV0gOiAodmFsKSA9PiAhIW1hcFt2YWxdO1xufVxudmFyIHNwZWNpYWxCb29sZWFuQXR0cnMgPSBgaXRlbXNjb3BlLGFsbG93ZnVsbHNjcmVlbixmb3Jtbm92YWxpZGF0ZSxpc21hcCxub21vZHVsZSxub3ZhbGlkYXRlLHJlYWRvbmx5YDtcbnZhciBpc0Jvb2xlYW5BdHRyMiA9IC8qIEBfX1BVUkVfXyAqLyBtYWtlTWFwKHNwZWNpYWxCb29sZWFuQXR0cnMgKyBgLGFzeW5jLGF1dG9mb2N1cyxhdXRvcGxheSxjb250cm9scyxkZWZhdWx0LGRlZmVyLGRpc2FibGVkLGhpZGRlbixsb29wLG9wZW4scmVxdWlyZWQscmV2ZXJzZWQsc2NvcGVkLHNlYW1sZXNzLGNoZWNrZWQsbXV0ZWQsbXVsdGlwbGUsc2VsZWN0ZWRgKTtcbnZhciBFTVBUWV9PQkogPSB0cnVlID8gT2JqZWN0LmZyZWV6ZSh7fSkgOiB7fTtcbnZhciBFTVBUWV9BUlIgPSB0cnVlID8gT2JqZWN0LmZyZWV6ZShbXSkgOiBbXTtcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgaGFzT3duID0gKHZhbCwga2V5KSA9PiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbCwga2V5KTtcbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbnZhciBpc01hcCA9ICh2YWwpID0+IHRvVHlwZVN0cmluZyh2YWwpID09PSBcIltvYmplY3QgTWFwXVwiO1xudmFyIGlzU3RyaW5nID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gXCJzdHJpbmdcIjtcbnZhciBpc1N5bWJvbCA9ICh2YWwpID0+IHR5cGVvZiB2YWwgPT09IFwic3ltYm9sXCI7XG52YXIgaXNPYmplY3QgPSAodmFsKSA9PiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIjtcbnZhciBvYmplY3RUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgdG9UeXBlU3RyaW5nID0gKHZhbHVlKSA9PiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbnZhciB0b1Jhd1R5cGUgPSAodmFsdWUpID0+IHtcbiAgcmV0dXJuIHRvVHlwZVN0cmluZyh2YWx1ZSkuc2xpY2UoOCwgLTEpO1xufTtcbnZhciBpc0ludGVnZXJLZXkgPSAoa2V5KSA9PiBpc1N0cmluZyhrZXkpICYmIGtleSAhPT0gXCJOYU5cIiAmJiBrZXlbMF0gIT09IFwiLVwiICYmIFwiXCIgKyBwYXJzZUludChrZXksIDEwKSA9PT0ga2V5O1xudmFyIGNhY2hlU3RyaW5nRnVuY3Rpb24gPSAoZm4pID0+IHtcbiAgY29uc3QgY2FjaGUgPSAvKiBAX19QVVJFX18gKi8gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgcmV0dXJuIChzdHIpID0+IHtcbiAgICBjb25zdCBoaXQgPSBjYWNoZVtzdHJdO1xuICAgIHJldHVybiBoaXQgfHwgKGNhY2hlW3N0cl0gPSBmbihzdHIpKTtcbiAgfTtcbn07XG52YXIgY2FtZWxpemVSRSA9IC8tKFxcdykvZztcbnZhciBjYW1lbGl6ZSA9IGNhY2hlU3RyaW5nRnVuY3Rpb24oKHN0cikgPT4ge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoY2FtZWxpemVSRSwgKF8sIGMpID0+IGMgPyBjLnRvVXBwZXJDYXNlKCkgOiBcIlwiKTtcbn0pO1xudmFyIGh5cGhlbmF0ZVJFID0gL1xcQihbQS1aXSkvZztcbnZhciBoeXBoZW5hdGUgPSBjYWNoZVN0cmluZ0Z1bmN0aW9uKChzdHIpID0+IHN0ci5yZXBsYWNlKGh5cGhlbmF0ZVJFLCBcIi0kMVwiKS50b0xvd2VyQ2FzZSgpKTtcbnZhciBjYXBpdGFsaXplID0gY2FjaGVTdHJpbmdGdW5jdGlvbigoc3RyKSA9PiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSkpO1xudmFyIHRvSGFuZGxlcktleSA9IGNhY2hlU3RyaW5nRnVuY3Rpb24oKHN0cikgPT4gc3RyID8gYG9uJHtjYXBpdGFsaXplKHN0cil9YCA6IGBgKTtcbnZhciBoYXNDaGFuZ2VkID0gKHZhbHVlLCBvbGRWYWx1ZSkgPT4gdmFsdWUgIT09IG9sZFZhbHVlICYmICh2YWx1ZSA9PT0gdmFsdWUgfHwgb2xkVmFsdWUgPT09IG9sZFZhbHVlKTtcblxuLy8gbm9kZV9tb2R1bGVzL0B2dWUvcmVhY3Rpdml0eS9kaXN0L3JlYWN0aXZpdHkuZXNtLWJ1bmRsZXIuanNcbnZhciB0YXJnZXRNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBlZmZlY3RTdGFjayA9IFtdO1xudmFyIGFjdGl2ZUVmZmVjdDtcbnZhciBJVEVSQVRFX0tFWSA9IFN5bWJvbCh0cnVlID8gXCJpdGVyYXRlXCIgOiBcIlwiKTtcbnZhciBNQVBfS0VZX0lURVJBVEVfS0VZID0gU3ltYm9sKHRydWUgPyBcIk1hcCBrZXkgaXRlcmF0ZVwiIDogXCJcIik7XG5mdW5jdGlvbiBpc0VmZmVjdChmbikge1xuICByZXR1cm4gZm4gJiYgZm4uX2lzRWZmZWN0ID09PSB0cnVlO1xufVxuZnVuY3Rpb24gZWZmZWN0Mihmbiwgb3B0aW9ucyA9IEVNUFRZX09CSikge1xuICBpZiAoaXNFZmZlY3QoZm4pKSB7XG4gICAgZm4gPSBmbi5yYXc7XG4gIH1cbiAgY29uc3QgZWZmZWN0MyA9IGNyZWF0ZVJlYWN0aXZlRWZmZWN0KGZuLCBvcHRpb25zKTtcbiAgaWYgKCFvcHRpb25zLmxhenkpIHtcbiAgICBlZmZlY3QzKCk7XG4gIH1cbiAgcmV0dXJuIGVmZmVjdDM7XG59XG5mdW5jdGlvbiBzdG9wKGVmZmVjdDMpIHtcbiAgaWYgKGVmZmVjdDMuYWN0aXZlKSB7XG4gICAgY2xlYW51cChlZmZlY3QzKTtcbiAgICBpZiAoZWZmZWN0My5vcHRpb25zLm9uU3RvcCkge1xuICAgICAgZWZmZWN0My5vcHRpb25zLm9uU3RvcCgpO1xuICAgIH1cbiAgICBlZmZlY3QzLmFjdGl2ZSA9IGZhbHNlO1xuICB9XG59XG52YXIgdWlkID0gMDtcbmZ1bmN0aW9uIGNyZWF0ZVJlYWN0aXZlRWZmZWN0KGZuLCBvcHRpb25zKSB7XG4gIGNvbnN0IGVmZmVjdDMgPSBmdW5jdGlvbiByZWFjdGl2ZUVmZmVjdCgpIHtcbiAgICBpZiAoIWVmZmVjdDMuYWN0aXZlKSB7XG4gICAgICByZXR1cm4gZm4oKTtcbiAgICB9XG4gICAgaWYgKCFlZmZlY3RTdGFjay5pbmNsdWRlcyhlZmZlY3QzKSkge1xuICAgICAgY2xlYW51cChlZmZlY3QzKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGVuYWJsZVRyYWNraW5nKCk7XG4gICAgICAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0Myk7XG4gICAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDM7XG4gICAgICAgIHJldHVybiBmbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICAgICAgIHJlc2V0VHJhY2tpbmcoKTtcbiAgICAgICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV07XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBlZmZlY3QzLmlkID0gdWlkKys7XG4gIGVmZmVjdDMuYWxsb3dSZWN1cnNlID0gISFvcHRpb25zLmFsbG93UmVjdXJzZTtcbiAgZWZmZWN0My5faXNFZmZlY3QgPSB0cnVlO1xuICBlZmZlY3QzLmFjdGl2ZSA9IHRydWU7XG4gIGVmZmVjdDMucmF3ID0gZm47XG4gIGVmZmVjdDMuZGVwcyA9IFtdO1xuICBlZmZlY3QzLm9wdGlvbnMgPSBvcHRpb25zO1xuICByZXR1cm4gZWZmZWN0Mztcbn1cbmZ1bmN0aW9uIGNsZWFudXAoZWZmZWN0Mykge1xuICBjb25zdCB7IGRlcHMgfSA9IGVmZmVjdDM7XG4gIGlmIChkZXBzLmxlbmd0aCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGVwcy5sZW5ndGg7IGkrKykge1xuICAgICAgZGVwc1tpXS5kZWxldGUoZWZmZWN0Myk7XG4gICAgfVxuICAgIGRlcHMubGVuZ3RoID0gMDtcbiAgfVxufVxudmFyIHNob3VsZFRyYWNrID0gdHJ1ZTtcbnZhciB0cmFja1N0YWNrID0gW107XG5mdW5jdGlvbiBwYXVzZVRyYWNraW5nKCkge1xuICB0cmFja1N0YWNrLnB1c2goc2hvdWxkVHJhY2spO1xuICBzaG91bGRUcmFjayA9IGZhbHNlO1xufVxuZnVuY3Rpb24gZW5hYmxlVHJhY2tpbmcoKSB7XG4gIHRyYWNrU3RhY2sucHVzaChzaG91bGRUcmFjayk7XG4gIHNob3VsZFRyYWNrID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIHJlc2V0VHJhY2tpbmcoKSB7XG4gIGNvbnN0IGxhc3QgPSB0cmFja1N0YWNrLnBvcCgpO1xuICBzaG91bGRUcmFjayA9IGxhc3QgPT09IHZvaWQgMCA/IHRydWUgOiBsYXN0O1xufVxuZnVuY3Rpb24gdHJhY2sodGFyZ2V0LCB0eXBlLCBrZXkpIHtcbiAgaWYgKCFzaG91bGRUcmFjayB8fCBhY3RpdmVFZmZlY3QgPT09IHZvaWQgMCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgZGVwc01hcCA9IHRhcmdldE1hcC5nZXQodGFyZ2V0KTtcbiAgaWYgKCFkZXBzTWFwKSB7XG4gICAgdGFyZ2V0TWFwLnNldCh0YXJnZXQsIGRlcHNNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpKTtcbiAgfVxuICBsZXQgZGVwID0gZGVwc01hcC5nZXQoa2V5KTtcbiAgaWYgKCFkZXApIHtcbiAgICBkZXBzTWFwLnNldChrZXksIGRlcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCkpO1xuICB9XG4gIGlmICghZGVwLmhhcyhhY3RpdmVFZmZlY3QpKSB7XG4gICAgZGVwLmFkZChhY3RpdmVFZmZlY3QpO1xuICAgIGFjdGl2ZUVmZmVjdC5kZXBzLnB1c2goZGVwKTtcbiAgICBpZiAoYWN0aXZlRWZmZWN0Lm9wdGlvbnMub25UcmFjaykge1xuICAgICAgYWN0aXZlRWZmZWN0Lm9wdGlvbnMub25UcmFjayh7XG4gICAgICAgIGVmZmVjdDogYWN0aXZlRWZmZWN0LFxuICAgICAgICB0YXJnZXQsXG4gICAgICAgIHR5cGUsXG4gICAgICAgIGtleVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiB0cmlnZ2VyKHRhcmdldCwgdHlwZSwga2V5LCBuZXdWYWx1ZSwgb2xkVmFsdWUsIG9sZFRhcmdldCkge1xuICBjb25zdCBkZXBzTWFwID0gdGFyZ2V0TWFwLmdldCh0YXJnZXQpO1xuICBpZiAoIWRlcHNNYXApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgZWZmZWN0cyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG4gIGNvbnN0IGFkZDIgPSAoZWZmZWN0c1RvQWRkKSA9PiB7XG4gICAgaWYgKGVmZmVjdHNUb0FkZCkge1xuICAgICAgZWZmZWN0c1RvQWRkLmZvckVhY2goKGVmZmVjdDMpID0+IHtcbiAgICAgICAgaWYgKGVmZmVjdDMgIT09IGFjdGl2ZUVmZmVjdCB8fCBlZmZlY3QzLmFsbG93UmVjdXJzZSkge1xuICAgICAgICAgIGVmZmVjdHMuYWRkKGVmZmVjdDMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIGlmICh0eXBlID09PSBcImNsZWFyXCIpIHtcbiAgICBkZXBzTWFwLmZvckVhY2goYWRkMik7XG4gIH0gZWxzZSBpZiAoa2V5ID09PSBcImxlbmd0aFwiICYmIGlzQXJyYXkodGFyZ2V0KSkge1xuICAgIGRlcHNNYXAuZm9yRWFjaCgoZGVwLCBrZXkyKSA9PiB7XG4gICAgICBpZiAoa2V5MiA9PT0gXCJsZW5ndGhcIiB8fCBrZXkyID49IG5ld1ZhbHVlKSB7XG4gICAgICAgIGFkZDIoZGVwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoa2V5ICE9PSB2b2lkIDApIHtcbiAgICAgIGFkZDIoZGVwc01hcC5nZXQoa2V5KSk7XG4gICAgfVxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBcImFkZFwiOlxuICAgICAgICBpZiAoIWlzQXJyYXkodGFyZ2V0KSkge1xuICAgICAgICAgIGFkZDIoZGVwc01hcC5nZXQoSVRFUkFURV9LRVkpKTtcbiAgICAgICAgICBpZiAoaXNNYXAodGFyZ2V0KSkge1xuICAgICAgICAgICAgYWRkMihkZXBzTWFwLmdldChNQVBfS0VZX0lURVJBVEVfS0VZKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGlzSW50ZWdlcktleShrZXkpKSB7XG4gICAgICAgICAgYWRkMihkZXBzTWFwLmdldChcImxlbmd0aFwiKSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZGVsZXRlXCI6XG4gICAgICAgIGlmICghaXNBcnJheSh0YXJnZXQpKSB7XG4gICAgICAgICAgYWRkMihkZXBzTWFwLmdldChJVEVSQVRFX0tFWSkpO1xuICAgICAgICAgIGlmIChpc01hcCh0YXJnZXQpKSB7XG4gICAgICAgICAgICBhZGQyKGRlcHNNYXAuZ2V0KE1BUF9LRVlfSVRFUkFURV9LRVkpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwic2V0XCI6XG4gICAgICAgIGlmIChpc01hcCh0YXJnZXQpKSB7XG4gICAgICAgICAgYWRkMihkZXBzTWFwLmdldChJVEVSQVRFX0tFWSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBjb25zdCBydW4gPSAoZWZmZWN0MykgPT4ge1xuICAgIGlmIChlZmZlY3QzLm9wdGlvbnMub25UcmlnZ2VyKSB7XG4gICAgICBlZmZlY3QzLm9wdGlvbnMub25UcmlnZ2VyKHtcbiAgICAgICAgZWZmZWN0OiBlZmZlY3QzLFxuICAgICAgICB0YXJnZXQsXG4gICAgICAgIGtleSxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgbmV3VmFsdWUsXG4gICAgICAgIG9sZFZhbHVlLFxuICAgICAgICBvbGRUYXJnZXRcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZWZmZWN0My5vcHRpb25zLnNjaGVkdWxlcikge1xuICAgICAgZWZmZWN0My5vcHRpb25zLnNjaGVkdWxlcihlZmZlY3QzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWZmZWN0MygpO1xuICAgIH1cbiAgfTtcbiAgZWZmZWN0cy5mb3JFYWNoKHJ1bik7XG59XG52YXIgaXNOb25UcmFja2FibGVLZXlzID0gLyogQF9fUFVSRV9fICovIG1ha2VNYXAoYF9fcHJvdG9fXyxfX3ZfaXNSZWYsX19pc1Z1ZWApO1xudmFyIGJ1aWx0SW5TeW1ib2xzID0gbmV3IFNldChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhTeW1ib2wpLm1hcCgoa2V5KSA9PiBTeW1ib2xba2V5XSkuZmlsdGVyKGlzU3ltYm9sKSk7XG52YXIgZ2V0MiA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVHZXR0ZXIoKTtcbnZhciByZWFkb25seUdldCA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVHZXR0ZXIodHJ1ZSk7XG52YXIgYXJyYXlJbnN0cnVtZW50YXRpb25zID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZUFycmF5SW5zdHJ1bWVudGF0aW9ucygpO1xuZnVuY3Rpb24gY3JlYXRlQXJyYXlJbnN0cnVtZW50YXRpb25zKCkge1xuICBjb25zdCBpbnN0cnVtZW50YXRpb25zID0ge307XG4gIFtcImluY2x1ZGVzXCIsIFwiaW5kZXhPZlwiLCBcImxhc3RJbmRleE9mXCJdLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGluc3RydW1lbnRhdGlvbnNba2V5XSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgIGNvbnN0IGFyciA9IHRvUmF3KHRoaXMpO1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB0cmFjayhhcnIsIFwiZ2V0XCIsIGkgKyBcIlwiKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlcyA9IGFycltrZXldKC4uLmFyZ3MpO1xuICAgICAgaWYgKHJlcyA9PT0gLTEgfHwgcmVzID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gYXJyW2tleV0oLi4uYXJncy5tYXAodG9SYXcpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4gIFtcInB1c2hcIiwgXCJwb3BcIiwgXCJzaGlmdFwiLCBcInVuc2hpZnRcIiwgXCJzcGxpY2VcIl0uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgaW5zdHJ1bWVudGF0aW9uc1trZXldID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgcGF1c2VUcmFja2luZygpO1xuICAgICAgY29uc3QgcmVzID0gdG9SYXcodGhpcylba2V5XS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIHJlc2V0VHJhY2tpbmcoKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfTtcbiAgfSk7XG4gIHJldHVybiBpbnN0cnVtZW50YXRpb25zO1xufVxuZnVuY3Rpb24gY3JlYXRlR2V0dGVyKGlzUmVhZG9ubHkgPSBmYWxzZSwgc2hhbGxvdyA9IGZhbHNlKSB7XG4gIHJldHVybiBmdW5jdGlvbiBnZXQzKHRhcmdldCwga2V5LCByZWNlaXZlcikge1xuICAgIGlmIChrZXkgPT09IFwiX192X2lzUmVhY3RpdmVcIikge1xuICAgICAgcmV0dXJuICFpc1JlYWRvbmx5O1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcIl9fdl9pc1JlYWRvbmx5XCIpIHtcbiAgICAgIHJldHVybiBpc1JlYWRvbmx5O1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcIl9fdl9yYXdcIiAmJiByZWNlaXZlciA9PT0gKGlzUmVhZG9ubHkgPyBzaGFsbG93ID8gc2hhbGxvd1JlYWRvbmx5TWFwIDogcmVhZG9ubHlNYXAgOiBzaGFsbG93ID8gc2hhbGxvd1JlYWN0aXZlTWFwIDogcmVhY3RpdmVNYXApLmdldCh0YXJnZXQpKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cbiAgICBjb25zdCB0YXJnZXRJc0FycmF5ID0gaXNBcnJheSh0YXJnZXQpO1xuICAgIGlmICghaXNSZWFkb25seSAmJiB0YXJnZXRJc0FycmF5ICYmIGhhc093bihhcnJheUluc3RydW1lbnRhdGlvbnMsIGtleSkpIHtcbiAgICAgIHJldHVybiBSZWZsZWN0LmdldChhcnJheUluc3RydW1lbnRhdGlvbnMsIGtleSwgcmVjZWl2ZXIpO1xuICAgIH1cbiAgICBjb25zdCByZXMgPSBSZWZsZWN0LmdldCh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpO1xuICAgIGlmIChpc1N5bWJvbChrZXkpID8gYnVpbHRJblN5bWJvbHMuaGFzKGtleSkgOiBpc05vblRyYWNrYWJsZUtleXMoa2V5KSkge1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgaWYgKCFpc1JlYWRvbmx5KSB7XG4gICAgICB0cmFjayh0YXJnZXQsIFwiZ2V0XCIsIGtleSk7XG4gICAgfVxuICAgIGlmIChzaGFsbG93KSB7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBpZiAoaXNSZWYocmVzKSkge1xuICAgICAgY29uc3Qgc2hvdWxkVW53cmFwID0gIXRhcmdldElzQXJyYXkgfHwgIWlzSW50ZWdlcktleShrZXkpO1xuICAgICAgcmV0dXJuIHNob3VsZFVud3JhcCA/IHJlcy52YWx1ZSA6IHJlcztcbiAgICB9XG4gICAgaWYgKGlzT2JqZWN0KHJlcykpIHtcbiAgICAgIHJldHVybiBpc1JlYWRvbmx5ID8gcmVhZG9ubHkocmVzKSA6IHJlYWN0aXZlMihyZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9O1xufVxudmFyIHNldDIgPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlU2V0dGVyKCk7XG5mdW5jdGlvbiBjcmVhdGVTZXR0ZXIoc2hhbGxvdyA9IGZhbHNlKSB7XG4gIHJldHVybiBmdW5jdGlvbiBzZXQzKHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICBsZXQgb2xkVmFsdWUgPSB0YXJnZXRba2V5XTtcbiAgICBpZiAoIXNoYWxsb3cpIHtcbiAgICAgIHZhbHVlID0gdG9SYXcodmFsdWUpO1xuICAgICAgb2xkVmFsdWUgPSB0b1JhdyhvbGRWYWx1ZSk7XG4gICAgICBpZiAoIWlzQXJyYXkodGFyZ2V0KSAmJiBpc1JlZihvbGRWYWx1ZSkgJiYgIWlzUmVmKHZhbHVlKSkge1xuICAgICAgICBvbGRWYWx1ZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgaGFkS2V5ID0gaXNBcnJheSh0YXJnZXQpICYmIGlzSW50ZWdlcktleShrZXkpID8gTnVtYmVyKGtleSkgPCB0YXJnZXQubGVuZ3RoIDogaGFzT3duKHRhcmdldCwga2V5KTtcbiAgICBjb25zdCByZXN1bHQgPSBSZWZsZWN0LnNldCh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKTtcbiAgICBpZiAodGFyZ2V0ID09PSB0b1JhdyhyZWNlaXZlcikpIHtcbiAgICAgIGlmICghaGFkS2V5KSB7XG4gICAgICAgIHRyaWdnZXIodGFyZ2V0LCBcImFkZFwiLCBrZXksIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoaGFzQ2hhbmdlZCh2YWx1ZSwgb2xkVmFsdWUpKSB7XG4gICAgICAgIHRyaWdnZXIodGFyZ2V0LCBcInNldFwiLCBrZXksIHZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5mdW5jdGlvbiBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIGtleSkge1xuICBjb25zdCBoYWRLZXkgPSBoYXNPd24odGFyZ2V0LCBrZXkpO1xuICBjb25zdCBvbGRWYWx1ZSA9IHRhcmdldFtrZXldO1xuICBjb25zdCByZXN1bHQgPSBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwga2V5KTtcbiAgaWYgKHJlc3VsdCAmJiBoYWRLZXkpIHtcbiAgICB0cmlnZ2VyKHRhcmdldCwgXCJkZWxldGVcIiwga2V5LCB2b2lkIDAsIG9sZFZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gaGFzKHRhcmdldCwga2V5KSB7XG4gIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuaGFzKHRhcmdldCwga2V5KTtcbiAgaWYgKCFpc1N5bWJvbChrZXkpIHx8ICFidWlsdEluU3ltYm9scy5oYXMoa2V5KSkge1xuICAgIHRyYWNrKHRhcmdldCwgXCJoYXNcIiwga2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gb3duS2V5cyh0YXJnZXQpIHtcbiAgdHJhY2sodGFyZ2V0LCBcIml0ZXJhdGVcIiwgaXNBcnJheSh0YXJnZXQpID8gXCJsZW5ndGhcIiA6IElURVJBVEVfS0VZKTtcbiAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xufVxudmFyIG11dGFibGVIYW5kbGVycyA9IHtcbiAgZ2V0OiBnZXQyLFxuICBzZXQ6IHNldDIsXG4gIGRlbGV0ZVByb3BlcnR5LFxuICBoYXMsXG4gIG93bktleXNcbn07XG52YXIgcmVhZG9ubHlIYW5kbGVycyA9IHtcbiAgZ2V0OiByZWFkb25seUdldCxcbiAgc2V0KHRhcmdldCwga2V5KSB7XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIGNvbnNvbGUud2FybihgU2V0IG9wZXJhdGlvbiBvbiBrZXkgXCIke1N0cmluZyhrZXkpfVwiIGZhaWxlZDogdGFyZ2V0IGlzIHJlYWRvbmx5LmAsIHRhcmdldCk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIGtleSkge1xuICAgIGlmICh0cnVlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYERlbGV0ZSBvcGVyYXRpb24gb24ga2V5IFwiJHtTdHJpbmcoa2V5KX1cIiBmYWlsZWQ6IHRhcmdldCBpcyByZWFkb25seS5gLCB0YXJnZXQpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbnZhciB0b1JlYWN0aXZlID0gKHZhbHVlKSA9PiBpc09iamVjdCh2YWx1ZSkgPyByZWFjdGl2ZTIodmFsdWUpIDogdmFsdWU7XG52YXIgdG9SZWFkb25seSA9ICh2YWx1ZSkgPT4gaXNPYmplY3QodmFsdWUpID8gcmVhZG9ubHkodmFsdWUpIDogdmFsdWU7XG52YXIgdG9TaGFsbG93ID0gKHZhbHVlKSA9PiB2YWx1ZTtcbnZhciBnZXRQcm90byA9ICh2KSA9PiBSZWZsZWN0LmdldFByb3RvdHlwZU9mKHYpO1xuZnVuY3Rpb24gZ2V0JDEodGFyZ2V0LCBrZXksIGlzUmVhZG9ubHkgPSBmYWxzZSwgaXNTaGFsbG93ID0gZmFsc2UpIHtcbiAgdGFyZ2V0ID0gdGFyZ2V0W1xuICAgIFwiX192X3Jhd1wiXG4gICAgLyogUkFXICovXG4gIF07XG4gIGNvbnN0IHJhd1RhcmdldCA9IHRvUmF3KHRhcmdldCk7XG4gIGNvbnN0IHJhd0tleSA9IHRvUmF3KGtleSk7XG4gIGlmIChrZXkgIT09IHJhd0tleSkge1xuICAgICFpc1JlYWRvbmx5ICYmIHRyYWNrKHJhd1RhcmdldCwgXCJnZXRcIiwga2V5KTtcbiAgfVxuICAhaXNSZWFkb25seSAmJiB0cmFjayhyYXdUYXJnZXQsIFwiZ2V0XCIsIHJhd0tleSk7XG4gIGNvbnN0IHsgaGFzOiBoYXMyIH0gPSBnZXRQcm90byhyYXdUYXJnZXQpO1xuICBjb25zdCB3cmFwID0gaXNTaGFsbG93ID8gdG9TaGFsbG93IDogaXNSZWFkb25seSA/IHRvUmVhZG9ubHkgOiB0b1JlYWN0aXZlO1xuICBpZiAoaGFzMi5jYWxsKHJhd1RhcmdldCwga2V5KSkge1xuICAgIHJldHVybiB3cmFwKHRhcmdldC5nZXQoa2V5KSk7XG4gIH0gZWxzZSBpZiAoaGFzMi5jYWxsKHJhd1RhcmdldCwgcmF3S2V5KSkge1xuICAgIHJldHVybiB3cmFwKHRhcmdldC5nZXQocmF3S2V5KSk7XG4gIH0gZWxzZSBpZiAodGFyZ2V0ICE9PSByYXdUYXJnZXQpIHtcbiAgICB0YXJnZXQuZ2V0KGtleSk7XG4gIH1cbn1cbmZ1bmN0aW9uIGhhcyQxKGtleSwgaXNSZWFkb25seSA9IGZhbHNlKSB7XG4gIGNvbnN0IHRhcmdldCA9IHRoaXNbXG4gICAgXCJfX3ZfcmF3XCJcbiAgICAvKiBSQVcgKi9cbiAgXTtcbiAgY29uc3QgcmF3VGFyZ2V0ID0gdG9SYXcodGFyZ2V0KTtcbiAgY29uc3QgcmF3S2V5ID0gdG9SYXcoa2V5KTtcbiAgaWYgKGtleSAhPT0gcmF3S2V5KSB7XG4gICAgIWlzUmVhZG9ubHkgJiYgdHJhY2socmF3VGFyZ2V0LCBcImhhc1wiLCBrZXkpO1xuICB9XG4gICFpc1JlYWRvbmx5ICYmIHRyYWNrKHJhd1RhcmdldCwgXCJoYXNcIiwgcmF3S2V5KTtcbiAgcmV0dXJuIGtleSA9PT0gcmF3S2V5ID8gdGFyZ2V0LmhhcyhrZXkpIDogdGFyZ2V0LmhhcyhrZXkpIHx8IHRhcmdldC5oYXMocmF3S2V5KTtcbn1cbmZ1bmN0aW9uIHNpemUodGFyZ2V0LCBpc1JlYWRvbmx5ID0gZmFsc2UpIHtcbiAgdGFyZ2V0ID0gdGFyZ2V0W1xuICAgIFwiX192X3Jhd1wiXG4gICAgLyogUkFXICovXG4gIF07XG4gICFpc1JlYWRvbmx5ICYmIHRyYWNrKHRvUmF3KHRhcmdldCksIFwiaXRlcmF0ZVwiLCBJVEVSQVRFX0tFWSk7XG4gIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIFwic2l6ZVwiLCB0YXJnZXQpO1xufVxuZnVuY3Rpb24gYWRkKHZhbHVlKSB7XG4gIHZhbHVlID0gdG9SYXcodmFsdWUpO1xuICBjb25zdCB0YXJnZXQgPSB0b1Jhdyh0aGlzKTtcbiAgY29uc3QgcHJvdG8gPSBnZXRQcm90byh0YXJnZXQpO1xuICBjb25zdCBoYWRLZXkgPSBwcm90by5oYXMuY2FsbCh0YXJnZXQsIHZhbHVlKTtcbiAgaWYgKCFoYWRLZXkpIHtcbiAgICB0YXJnZXQuYWRkKHZhbHVlKTtcbiAgICB0cmlnZ2VyKHRhcmdldCwgXCJhZGRcIiwgdmFsdWUsIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cbmZ1bmN0aW9uIHNldCQxKGtleSwgdmFsdWUpIHtcbiAgdmFsdWUgPSB0b1Jhdyh2YWx1ZSk7XG4gIGNvbnN0IHRhcmdldCA9IHRvUmF3KHRoaXMpO1xuICBjb25zdCB7IGhhczogaGFzMiwgZ2V0OiBnZXQzIH0gPSBnZXRQcm90byh0YXJnZXQpO1xuICBsZXQgaGFkS2V5ID0gaGFzMi5jYWxsKHRhcmdldCwga2V5KTtcbiAgaWYgKCFoYWRLZXkpIHtcbiAgICBrZXkgPSB0b1JhdyhrZXkpO1xuICAgIGhhZEtleSA9IGhhczIuY2FsbCh0YXJnZXQsIGtleSk7XG4gIH0gZWxzZSBpZiAodHJ1ZSkge1xuICAgIGNoZWNrSWRlbnRpdHlLZXlzKHRhcmdldCwgaGFzMiwga2V5KTtcbiAgfVxuICBjb25zdCBvbGRWYWx1ZSA9IGdldDMuY2FsbCh0YXJnZXQsIGtleSk7XG4gIHRhcmdldC5zZXQoa2V5LCB2YWx1ZSk7XG4gIGlmICghaGFkS2V5KSB7XG4gICAgdHJpZ2dlcih0YXJnZXQsIFwiYWRkXCIsIGtleSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKGhhc0NoYW5nZWQodmFsdWUsIG9sZFZhbHVlKSkge1xuICAgIHRyaWdnZXIodGFyZ2V0LCBcInNldFwiLCBrZXksIHZhbHVlLCBvbGRWYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5mdW5jdGlvbiBkZWxldGVFbnRyeShrZXkpIHtcbiAgY29uc3QgdGFyZ2V0ID0gdG9SYXcodGhpcyk7XG4gIGNvbnN0IHsgaGFzOiBoYXMyLCBnZXQ6IGdldDMgfSA9IGdldFByb3RvKHRhcmdldCk7XG4gIGxldCBoYWRLZXkgPSBoYXMyLmNhbGwodGFyZ2V0LCBrZXkpO1xuICBpZiAoIWhhZEtleSkge1xuICAgIGtleSA9IHRvUmF3KGtleSk7XG4gICAgaGFkS2V5ID0gaGFzMi5jYWxsKHRhcmdldCwga2V5KTtcbiAgfSBlbHNlIGlmICh0cnVlKSB7XG4gICAgY2hlY2tJZGVudGl0eUtleXModGFyZ2V0LCBoYXMyLCBrZXkpO1xuICB9XG4gIGNvbnN0IG9sZFZhbHVlID0gZ2V0MyA/IGdldDMuY2FsbCh0YXJnZXQsIGtleSkgOiB2b2lkIDA7XG4gIGNvbnN0IHJlc3VsdCA9IHRhcmdldC5kZWxldGUoa2V5KTtcbiAgaWYgKGhhZEtleSkge1xuICAgIHRyaWdnZXIodGFyZ2V0LCBcImRlbGV0ZVwiLCBrZXksIHZvaWQgMCwgb2xkVmFsdWUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBjbGVhcigpIHtcbiAgY29uc3QgdGFyZ2V0ID0gdG9SYXcodGhpcyk7XG4gIGNvbnN0IGhhZEl0ZW1zID0gdGFyZ2V0LnNpemUgIT09IDA7XG4gIGNvbnN0IG9sZFRhcmdldCA9IHRydWUgPyBpc01hcCh0YXJnZXQpID8gbmV3IE1hcCh0YXJnZXQpIDogbmV3IFNldCh0YXJnZXQpIDogdm9pZCAwO1xuICBjb25zdCByZXN1bHQgPSB0YXJnZXQuY2xlYXIoKTtcbiAgaWYgKGhhZEl0ZW1zKSB7XG4gICAgdHJpZ2dlcih0YXJnZXQsIFwiY2xlYXJcIiwgdm9pZCAwLCB2b2lkIDAsIG9sZFRhcmdldCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUZvckVhY2goaXNSZWFkb25seSwgaXNTaGFsbG93KSB7XG4gIHJldHVybiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgY29uc3Qgb2JzZXJ2ZWQgPSB0aGlzO1xuICAgIGNvbnN0IHRhcmdldCA9IG9ic2VydmVkW1xuICAgICAgXCJfX3ZfcmF3XCJcbiAgICAgIC8qIFJBVyAqL1xuICAgIF07XG4gICAgY29uc3QgcmF3VGFyZ2V0ID0gdG9SYXcodGFyZ2V0KTtcbiAgICBjb25zdCB3cmFwID0gaXNTaGFsbG93ID8gdG9TaGFsbG93IDogaXNSZWFkb25seSA/IHRvUmVhZG9ubHkgOiB0b1JlYWN0aXZlO1xuICAgICFpc1JlYWRvbmx5ICYmIHRyYWNrKHJhd1RhcmdldCwgXCJpdGVyYXRlXCIsIElURVJBVEVfS0VZKTtcbiAgICByZXR1cm4gdGFyZ2V0LmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIHJldHVybiBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHdyYXAodmFsdWUpLCB3cmFwKGtleSksIG9ic2VydmVkKTtcbiAgICB9KTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUl0ZXJhYmxlTWV0aG9kKG1ldGhvZCwgaXNSZWFkb25seSwgaXNTaGFsbG93KSB7XG4gIHJldHVybiBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpc1tcbiAgICAgIFwiX192X3Jhd1wiXG4gICAgICAvKiBSQVcgKi9cbiAgICBdO1xuICAgIGNvbnN0IHJhd1RhcmdldCA9IHRvUmF3KHRhcmdldCk7XG4gICAgY29uc3QgdGFyZ2V0SXNNYXAgPSBpc01hcChyYXdUYXJnZXQpO1xuICAgIGNvbnN0IGlzUGFpciA9IG1ldGhvZCA9PT0gXCJlbnRyaWVzXCIgfHwgbWV0aG9kID09PSBTeW1ib2wuaXRlcmF0b3IgJiYgdGFyZ2V0SXNNYXA7XG4gICAgY29uc3QgaXNLZXlPbmx5ID0gbWV0aG9kID09PSBcImtleXNcIiAmJiB0YXJnZXRJc01hcDtcbiAgICBjb25zdCBpbm5lckl0ZXJhdG9yID0gdGFyZ2V0W21ldGhvZF0oLi4uYXJncyk7XG4gICAgY29uc3Qgd3JhcCA9IGlzU2hhbGxvdyA/IHRvU2hhbGxvdyA6IGlzUmVhZG9ubHkgPyB0b1JlYWRvbmx5IDogdG9SZWFjdGl2ZTtcbiAgICAhaXNSZWFkb25seSAmJiB0cmFjayhyYXdUYXJnZXQsIFwiaXRlcmF0ZVwiLCBpc0tleU9ubHkgPyBNQVBfS0VZX0lURVJBVEVfS0VZIDogSVRFUkFURV9LRVkpO1xuICAgIHJldHVybiB7XG4gICAgICAvLyBpdGVyYXRvciBwcm90b2NvbFxuICAgICAgbmV4dCgpIHtcbiAgICAgICAgY29uc3QgeyB2YWx1ZSwgZG9uZSB9ID0gaW5uZXJJdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIHJldHVybiBkb25lID8geyB2YWx1ZSwgZG9uZSB9IDoge1xuICAgICAgICAgIHZhbHVlOiBpc1BhaXIgPyBbd3JhcCh2YWx1ZVswXSksIHdyYXAodmFsdWVbMV0pXSA6IHdyYXAodmFsdWUpLFxuICAgICAgICAgIGRvbmVcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICAvLyBpdGVyYWJsZSBwcm90b2NvbFxuICAgICAgW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH07XG4gIH07XG59XG5mdW5jdGlvbiBjcmVhdGVSZWFkb25seU1ldGhvZCh0eXBlKSB7XG4gIHJldHVybiBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIGNvbnN0IGtleSA9IGFyZ3NbMF0gPyBgb24ga2V5IFwiJHthcmdzWzBdfVwiIGAgOiBgYDtcbiAgICAgIGNvbnNvbGUud2FybihgJHtjYXBpdGFsaXplKHR5cGUpfSBvcGVyYXRpb24gJHtrZXl9ZmFpbGVkOiB0YXJnZXQgaXMgcmVhZG9ubHkuYCwgdG9SYXcodGhpcykpO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZSA9PT0gXCJkZWxldGVcIiA/IGZhbHNlIDogdGhpcztcbiAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUluc3RydW1lbnRhdGlvbnMoKSB7XG4gIGNvbnN0IG11dGFibGVJbnN0cnVtZW50YXRpb25zMiA9IHtcbiAgICBnZXQoa2V5KSB7XG4gICAgICByZXR1cm4gZ2V0JDEodGhpcywga2V5KTtcbiAgICB9LFxuICAgIGdldCBzaXplKCkge1xuICAgICAgcmV0dXJuIHNpemUodGhpcyk7XG4gICAgfSxcbiAgICBoYXM6IGhhcyQxLFxuICAgIGFkZCxcbiAgICBzZXQ6IHNldCQxLFxuICAgIGRlbGV0ZTogZGVsZXRlRW50cnksXG4gICAgY2xlYXIsXG4gICAgZm9yRWFjaDogY3JlYXRlRm9yRWFjaChmYWxzZSwgZmFsc2UpXG4gIH07XG4gIGNvbnN0IHNoYWxsb3dJbnN0cnVtZW50YXRpb25zMiA9IHtcbiAgICBnZXQoa2V5KSB7XG4gICAgICByZXR1cm4gZ2V0JDEodGhpcywga2V5LCBmYWxzZSwgdHJ1ZSk7XG4gICAgfSxcbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgIHJldHVybiBzaXplKHRoaXMpO1xuICAgIH0sXG4gICAgaGFzOiBoYXMkMSxcbiAgICBhZGQsXG4gICAgc2V0OiBzZXQkMSxcbiAgICBkZWxldGU6IGRlbGV0ZUVudHJ5LFxuICAgIGNsZWFyLFxuICAgIGZvckVhY2g6IGNyZWF0ZUZvckVhY2goZmFsc2UsIHRydWUpXG4gIH07XG4gIGNvbnN0IHJlYWRvbmx5SW5zdHJ1bWVudGF0aW9uczIgPSB7XG4gICAgZ2V0KGtleSkge1xuICAgICAgcmV0dXJuIGdldCQxKHRoaXMsIGtleSwgdHJ1ZSk7XG4gICAgfSxcbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgIHJldHVybiBzaXplKHRoaXMsIHRydWUpO1xuICAgIH0sXG4gICAgaGFzKGtleSkge1xuICAgICAgcmV0dXJuIGhhcyQxLmNhbGwodGhpcywga2V5LCB0cnVlKTtcbiAgICB9LFxuICAgIGFkZDogY3JlYXRlUmVhZG9ubHlNZXRob2QoXG4gICAgICBcImFkZFwiXG4gICAgICAvKiBBREQgKi9cbiAgICApLFxuICAgIHNldDogY3JlYXRlUmVhZG9ubHlNZXRob2QoXG4gICAgICBcInNldFwiXG4gICAgICAvKiBTRVQgKi9cbiAgICApLFxuICAgIGRlbGV0ZTogY3JlYXRlUmVhZG9ubHlNZXRob2QoXG4gICAgICBcImRlbGV0ZVwiXG4gICAgICAvKiBERUxFVEUgKi9cbiAgICApLFxuICAgIGNsZWFyOiBjcmVhdGVSZWFkb25seU1ldGhvZChcbiAgICAgIFwiY2xlYXJcIlxuICAgICAgLyogQ0xFQVIgKi9cbiAgICApLFxuICAgIGZvckVhY2g6IGNyZWF0ZUZvckVhY2godHJ1ZSwgZmFsc2UpXG4gIH07XG4gIGNvbnN0IHNoYWxsb3dSZWFkb25seUluc3RydW1lbnRhdGlvbnMyID0ge1xuICAgIGdldChrZXkpIHtcbiAgICAgIHJldHVybiBnZXQkMSh0aGlzLCBrZXksIHRydWUsIHRydWUpO1xuICAgIH0sXG4gICAgZ2V0IHNpemUoKSB7XG4gICAgICByZXR1cm4gc2l6ZSh0aGlzLCB0cnVlKTtcbiAgICB9LFxuICAgIGhhcyhrZXkpIHtcbiAgICAgIHJldHVybiBoYXMkMS5jYWxsKHRoaXMsIGtleSwgdHJ1ZSk7XG4gICAgfSxcbiAgICBhZGQ6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFxuICAgICAgXCJhZGRcIlxuICAgICAgLyogQUREICovXG4gICAgKSxcbiAgICBzZXQ6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFxuICAgICAgXCJzZXRcIlxuICAgICAgLyogU0VUICovXG4gICAgKSxcbiAgICBkZWxldGU6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFxuICAgICAgXCJkZWxldGVcIlxuICAgICAgLyogREVMRVRFICovXG4gICAgKSxcbiAgICBjbGVhcjogY3JlYXRlUmVhZG9ubHlNZXRob2QoXG4gICAgICBcImNsZWFyXCJcbiAgICAgIC8qIENMRUFSICovXG4gICAgKSxcbiAgICBmb3JFYWNoOiBjcmVhdGVGb3JFYWNoKHRydWUsIHRydWUpXG4gIH07XG4gIGNvbnN0IGl0ZXJhdG9yTWV0aG9kcyA9IFtcImtleXNcIiwgXCJ2YWx1ZXNcIiwgXCJlbnRyaWVzXCIsIFN5bWJvbC5pdGVyYXRvcl07XG4gIGl0ZXJhdG9yTWV0aG9kcy5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgICBtdXRhYmxlSW5zdHJ1bWVudGF0aW9uczJbbWV0aG9kXSA9IGNyZWF0ZUl0ZXJhYmxlTWV0aG9kKG1ldGhvZCwgZmFsc2UsIGZhbHNlKTtcbiAgICByZWFkb25seUluc3RydW1lbnRhdGlvbnMyW21ldGhvZF0gPSBjcmVhdGVJdGVyYWJsZU1ldGhvZChtZXRob2QsIHRydWUsIGZhbHNlKTtcbiAgICBzaGFsbG93SW5zdHJ1bWVudGF0aW9uczJbbWV0aG9kXSA9IGNyZWF0ZUl0ZXJhYmxlTWV0aG9kKG1ldGhvZCwgZmFsc2UsIHRydWUpO1xuICAgIHNoYWxsb3dSZWFkb25seUluc3RydW1lbnRhdGlvbnMyW21ldGhvZF0gPSBjcmVhdGVJdGVyYWJsZU1ldGhvZChtZXRob2QsIHRydWUsIHRydWUpO1xuICB9KTtcbiAgcmV0dXJuIFtcbiAgICBtdXRhYmxlSW5zdHJ1bWVudGF0aW9uczIsXG4gICAgcmVhZG9ubHlJbnN0cnVtZW50YXRpb25zMixcbiAgICBzaGFsbG93SW5zdHJ1bWVudGF0aW9uczIsXG4gICAgc2hhbGxvd1JlYWRvbmx5SW5zdHJ1bWVudGF0aW9uczJcbiAgXTtcbn1cbnZhciBbbXV0YWJsZUluc3RydW1lbnRhdGlvbnMsIHJlYWRvbmx5SW5zdHJ1bWVudGF0aW9ucywgc2hhbGxvd0luc3RydW1lbnRhdGlvbnMsIHNoYWxsb3dSZWFkb25seUluc3RydW1lbnRhdGlvbnNdID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZUluc3RydW1lbnRhdGlvbnMoKTtcbmZ1bmN0aW9uIGNyZWF0ZUluc3RydW1lbnRhdGlvbkdldHRlcihpc1JlYWRvbmx5LCBzaGFsbG93KSB7XG4gIGNvbnN0IGluc3RydW1lbnRhdGlvbnMgPSBzaGFsbG93ID8gaXNSZWFkb25seSA/IHNoYWxsb3dSZWFkb25seUluc3RydW1lbnRhdGlvbnMgOiBzaGFsbG93SW5zdHJ1bWVudGF0aW9ucyA6IGlzUmVhZG9ubHkgPyByZWFkb25seUluc3RydW1lbnRhdGlvbnMgOiBtdXRhYmxlSW5zdHJ1bWVudGF0aW9ucztcbiAgcmV0dXJuICh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpID0+IHtcbiAgICBpZiAoa2V5ID09PSBcIl9fdl9pc1JlYWN0aXZlXCIpIHtcbiAgICAgIHJldHVybiAhaXNSZWFkb25seTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJfX3ZfaXNSZWFkb25seVwiKSB7XG4gICAgICByZXR1cm4gaXNSZWFkb25seTtcbiAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJfX3ZfcmF3XCIpIHtcbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICAgIHJldHVybiBSZWZsZWN0LmdldChoYXNPd24oaW5zdHJ1bWVudGF0aW9ucywga2V5KSAmJiBrZXkgaW4gdGFyZ2V0ID8gaW5zdHJ1bWVudGF0aW9ucyA6IHRhcmdldCwga2V5LCByZWNlaXZlcik7XG4gIH07XG59XG52YXIgbXV0YWJsZUNvbGxlY3Rpb25IYW5kbGVycyA9IHtcbiAgZ2V0OiAvKiBAX19QVVJFX18gKi8gY3JlYXRlSW5zdHJ1bWVudGF0aW9uR2V0dGVyKGZhbHNlLCBmYWxzZSlcbn07XG52YXIgcmVhZG9ubHlDb2xsZWN0aW9uSGFuZGxlcnMgPSB7XG4gIGdldDogLyogQF9fUFVSRV9fICovIGNyZWF0ZUluc3RydW1lbnRhdGlvbkdldHRlcih0cnVlLCBmYWxzZSlcbn07XG5mdW5jdGlvbiBjaGVja0lkZW50aXR5S2V5cyh0YXJnZXQsIGhhczIsIGtleSkge1xuICBjb25zdCByYXdLZXkgPSB0b1JhdyhrZXkpO1xuICBpZiAocmF3S2V5ICE9PSBrZXkgJiYgaGFzMi5jYWxsKHRhcmdldCwgcmF3S2V5KSkge1xuICAgIGNvbnN0IHR5cGUgPSB0b1Jhd1R5cGUodGFyZ2V0KTtcbiAgICBjb25zb2xlLndhcm4oYFJlYWN0aXZlICR7dHlwZX0gY29udGFpbnMgYm90aCB0aGUgcmF3IGFuZCByZWFjdGl2ZSB2ZXJzaW9ucyBvZiB0aGUgc2FtZSBvYmplY3Qke3R5cGUgPT09IGBNYXBgID8gYCBhcyBrZXlzYCA6IGBgfSwgd2hpY2ggY2FuIGxlYWQgdG8gaW5jb25zaXN0ZW5jaWVzLiBBdm9pZCBkaWZmZXJlbnRpYXRpbmcgYmV0d2VlbiB0aGUgcmF3IGFuZCByZWFjdGl2ZSB2ZXJzaW9ucyBvZiBhbiBvYmplY3QgYW5kIG9ubHkgdXNlIHRoZSByZWFjdGl2ZSB2ZXJzaW9uIGlmIHBvc3NpYmxlLmApO1xuICB9XG59XG52YXIgcmVhY3RpdmVNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciBzaGFsbG93UmVhY3RpdmVNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IFdlYWtNYXAoKTtcbnZhciByZWFkb25seU1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xudmFyIHNoYWxsb3dSZWFkb25seU1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgV2Vha01hcCgpO1xuZnVuY3Rpb24gdGFyZ2V0VHlwZU1hcChyYXdUeXBlKSB7XG4gIHN3aXRjaCAocmF3VHlwZSkge1xuICAgIGNhc2UgXCJPYmplY3RcIjpcbiAgICBjYXNlIFwiQXJyYXlcIjpcbiAgICAgIHJldHVybiAxO1xuICAgIGNhc2UgXCJNYXBcIjpcbiAgICBjYXNlIFwiU2V0XCI6XG4gICAgY2FzZSBcIldlYWtNYXBcIjpcbiAgICBjYXNlIFwiV2Vha1NldFwiOlxuICAgICAgcmV0dXJuIDI7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAwO1xuICB9XG59XG5mdW5jdGlvbiBnZXRUYXJnZXRUeXBlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZVtcbiAgICBcIl9fdl9za2lwXCJcbiAgICAvKiBTS0lQICovXG4gIF0gfHwgIU9iamVjdC5pc0V4dGVuc2libGUodmFsdWUpID8gMCA6IHRhcmdldFR5cGVNYXAodG9SYXdUeXBlKHZhbHVlKSk7XG59XG5mdW5jdGlvbiByZWFjdGl2ZTIodGFyZ2V0KSB7XG4gIGlmICh0YXJnZXQgJiYgdGFyZ2V0W1xuICAgIFwiX192X2lzUmVhZG9ubHlcIlxuICAgIC8qIElTX1JFQURPTkxZICovXG4gIF0pIHtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG4gIHJldHVybiBjcmVhdGVSZWFjdGl2ZU9iamVjdCh0YXJnZXQsIGZhbHNlLCBtdXRhYmxlSGFuZGxlcnMsIG11dGFibGVDb2xsZWN0aW9uSGFuZGxlcnMsIHJlYWN0aXZlTWFwKTtcbn1cbmZ1bmN0aW9uIHJlYWRvbmx5KHRhcmdldCkge1xuICByZXR1cm4gY3JlYXRlUmVhY3RpdmVPYmplY3QodGFyZ2V0LCB0cnVlLCByZWFkb25seUhhbmRsZXJzLCByZWFkb25seUNvbGxlY3Rpb25IYW5kbGVycywgcmVhZG9ubHlNYXApO1xufVxuZnVuY3Rpb24gY3JlYXRlUmVhY3RpdmVPYmplY3QodGFyZ2V0LCBpc1JlYWRvbmx5LCBiYXNlSGFuZGxlcnMsIGNvbGxlY3Rpb25IYW5kbGVycywgcHJveHlNYXApIHtcbiAgaWYgKCFpc09iamVjdCh0YXJnZXQpKSB7XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIGNvbnNvbGUud2FybihgdmFsdWUgY2Fubm90IGJlIG1hZGUgcmVhY3RpdmU6ICR7U3RyaW5nKHRhcmdldCl9YCk7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgaWYgKHRhcmdldFtcbiAgICBcIl9fdl9yYXdcIlxuICAgIC8qIFJBVyAqL1xuICBdICYmICEoaXNSZWFkb25seSAmJiB0YXJnZXRbXG4gICAgXCJfX3ZfaXNSZWFjdGl2ZVwiXG4gICAgLyogSVNfUkVBQ1RJVkUgKi9cbiAgXSkpIHtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG4gIGNvbnN0IGV4aXN0aW5nUHJveHkgPSBwcm94eU1hcC5nZXQodGFyZ2V0KTtcbiAgaWYgKGV4aXN0aW5nUHJveHkpIHtcbiAgICByZXR1cm4gZXhpc3RpbmdQcm94eTtcbiAgfVxuICBjb25zdCB0YXJnZXRUeXBlID0gZ2V0VGFyZ2V0VHlwZSh0YXJnZXQpO1xuICBpZiAodGFyZ2V0VHlwZSA9PT0gMCkge1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgY29uc3QgcHJveHkgPSBuZXcgUHJveHkodGFyZ2V0LCB0YXJnZXRUeXBlID09PSAyID8gY29sbGVjdGlvbkhhbmRsZXJzIDogYmFzZUhhbmRsZXJzKTtcbiAgcHJveHlNYXAuc2V0KHRhcmdldCwgcHJveHkpO1xuICByZXR1cm4gcHJveHk7XG59XG5mdW5jdGlvbiB0b1JhdyhvYnNlcnZlZCkge1xuICByZXR1cm4gb2JzZXJ2ZWQgJiYgdG9SYXcob2JzZXJ2ZWRbXG4gICAgXCJfX3ZfcmF3XCJcbiAgICAvKiBSQVcgKi9cbiAgXSkgfHwgb2JzZXJ2ZWQ7XG59XG5mdW5jdGlvbiBpc1JlZihyKSB7XG4gIHJldHVybiBCb29sZWFuKHIgJiYgci5fX3ZfaXNSZWYgPT09IHRydWUpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzLyRuZXh0VGljay5qc1xubWFnaWMoXCJuZXh0VGlja1wiLCAoKSA9PiBuZXh0VGljayk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJGRpc3BhdGNoLmpzXG5tYWdpYyhcImRpc3BhdGNoXCIsIChlbCkgPT4gZGlzcGF0Y2guYmluZChkaXNwYXRjaCwgZWwpKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kd2F0Y2guanNcbm1hZ2ljKFwid2F0Y2hcIiwgKGVsLCB7IGV2YWx1YXRlTGF0ZXI6IGV2YWx1YXRlTGF0ZXIyLCBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiAoa2V5LCBjYWxsYmFjaykgPT4ge1xuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcjIoa2V5KTtcbiAgbGV0IGdldHRlciA9ICgpID0+IHtcbiAgICBsZXQgdmFsdWU7XG4gICAgZXZhbHVhdGUyKChpKSA9PiB2YWx1ZSA9IGkpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbiAgbGV0IHVud2F0Y2ggPSB3YXRjaChnZXR0ZXIsIGNhbGxiYWNrKTtcbiAgY2xlYW51cDIodW53YXRjaCk7XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kc3RvcmUuanNcbm1hZ2ljKFwic3RvcmVcIiwgZ2V0U3RvcmVzKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kZGF0YS5qc1xubWFnaWMoXCJkYXRhXCIsIChlbCkgPT4gc2NvcGUoZWwpKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kcm9vdC5qc1xubWFnaWMoXCJyb290XCIsIChlbCkgPT4gY2xvc2VzdFJvb3QoZWwpKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kcmVmcy5qc1xubWFnaWMoXCJyZWZzXCIsIChlbCkgPT4ge1xuICBpZiAoZWwuX3hfcmVmc19wcm94eSlcbiAgICByZXR1cm4gZWwuX3hfcmVmc19wcm94eTtcbiAgZWwuX3hfcmVmc19wcm94eSA9IG1lcmdlUHJveGllcyhnZXRBcnJheU9mUmVmT2JqZWN0KGVsKSk7XG4gIHJldHVybiBlbC5feF9yZWZzX3Byb3h5O1xufSk7XG5mdW5jdGlvbiBnZXRBcnJheU9mUmVmT2JqZWN0KGVsKSB7XG4gIGxldCByZWZPYmplY3RzID0gW107XG4gIGZpbmRDbG9zZXN0KGVsLCAoaSkgPT4ge1xuICAgIGlmIChpLl94X3JlZnMpXG4gICAgICByZWZPYmplY3RzLnB1c2goaS5feF9yZWZzKTtcbiAgfSk7XG4gIHJldHVybiByZWZPYmplY3RzO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvaWRzLmpzXG52YXIgZ2xvYmFsSWRNZW1vID0ge307XG5mdW5jdGlvbiBmaW5kQW5kSW5jcmVtZW50SWQobmFtZSkge1xuICBpZiAoIWdsb2JhbElkTWVtb1tuYW1lXSlcbiAgICBnbG9iYWxJZE1lbW9bbmFtZV0gPSAwO1xuICByZXR1cm4gKytnbG9iYWxJZE1lbW9bbmFtZV07XG59XG5mdW5jdGlvbiBjbG9zZXN0SWRSb290KGVsLCBuYW1lKSB7XG4gIHJldHVybiBmaW5kQ2xvc2VzdChlbCwgKGVsZW1lbnQpID0+IHtcbiAgICBpZiAoZWxlbWVudC5feF9pZHMgJiYgZWxlbWVudC5feF9pZHNbbmFtZV0pXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG5mdW5jdGlvbiBzZXRJZFJvb3QoZWwsIG5hbWUpIHtcbiAgaWYgKCFlbC5feF9pZHMpXG4gICAgZWwuX3hfaWRzID0ge307XG4gIGlmICghZWwuX3hfaWRzW25hbWVdKVxuICAgIGVsLl94X2lkc1tuYW1lXSA9IGZpbmRBbmRJbmNyZW1lbnRJZChuYW1lKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kaWQuanNcbm1hZ2ljKFwiaWRcIiwgKGVsLCB7IGNsZWFudXA6IGNsZWFudXAyIH0pID0+IChuYW1lLCBrZXkgPSBudWxsKSA9PiB7XG4gIGxldCBjYWNoZUtleSA9IGAke25hbWV9JHtrZXkgPyBgLSR7a2V5fWAgOiBcIlwifWA7XG4gIHJldHVybiBjYWNoZUlkQnlOYW1lT25FbGVtZW50KGVsLCBjYWNoZUtleSwgY2xlYW51cDIsICgpID0+IHtcbiAgICBsZXQgcm9vdCA9IGNsb3Nlc3RJZFJvb3QoZWwsIG5hbWUpO1xuICAgIGxldCBpZCA9IHJvb3QgPyByb290Ll94X2lkc1tuYW1lXSA6IGZpbmRBbmRJbmNyZW1lbnRJZChuYW1lKTtcbiAgICByZXR1cm4ga2V5ID8gYCR7bmFtZX0tJHtpZH0tJHtrZXl9YCA6IGAke25hbWV9LSR7aWR9YDtcbiAgfSk7XG59KTtcbmludGVyY2VwdENsb25lKChmcm9tLCB0bykgPT4ge1xuICBpZiAoZnJvbS5feF9pZCkge1xuICAgIHRvLl94X2lkID0gZnJvbS5feF9pZDtcbiAgfVxufSk7XG5mdW5jdGlvbiBjYWNoZUlkQnlOYW1lT25FbGVtZW50KGVsLCBjYWNoZUtleSwgY2xlYW51cDIsIGNhbGxiYWNrKSB7XG4gIGlmICghZWwuX3hfaWQpXG4gICAgZWwuX3hfaWQgPSB7fTtcbiAgaWYgKGVsLl94X2lkW2NhY2hlS2V5XSlcbiAgICByZXR1cm4gZWwuX3hfaWRbY2FjaGVLZXldO1xuICBsZXQgb3V0cHV0ID0gY2FsbGJhY2soKTtcbiAgZWwuX3hfaWRbY2FjaGVLZXldID0gb3V0cHV0O1xuICBjbGVhbnVwMigoKSA9PiB7XG4gICAgZGVsZXRlIGVsLl94X2lkW2NhY2hlS2V5XTtcbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJGVsLmpzXG5tYWdpYyhcImVsXCIsIChlbCkgPT4gZWwpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzL2luZGV4LmpzXG53YXJuTWlzc2luZ1BsdWdpbk1hZ2ljKFwiRm9jdXNcIiwgXCJmb2N1c1wiLCBcImZvY3VzXCIpO1xud2Fybk1pc3NpbmdQbHVnaW5NYWdpYyhcIlBlcnNpc3RcIiwgXCJwZXJzaXN0XCIsIFwicGVyc2lzdFwiKTtcbmZ1bmN0aW9uIHdhcm5NaXNzaW5nUGx1Z2luTWFnaWMobmFtZSwgbWFnaWNOYW1lLCBzbHVnKSB7XG4gIG1hZ2ljKG1hZ2ljTmFtZSwgKGVsKSA9PiB3YXJuKGBZb3UgY2FuJ3QgdXNlIFskJHttYWdpY05hbWV9XSB3aXRob3V0IGZpcnN0IGluc3RhbGxpbmcgdGhlIFwiJHtuYW1lfVwiIHBsdWdpbiBoZXJlOiBodHRwczovL2FscGluZWpzLmRldi9wbHVnaW5zLyR7c2x1Z31gLCBlbCkpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LW1vZGVsYWJsZS5qc1xuZGlyZWN0aXZlKFwibW9kZWxhYmxlXCIsIChlbCwgeyBleHByZXNzaW9uIH0sIHsgZWZmZWN0OiBlZmZlY3QzLCBldmFsdWF0ZUxhdGVyOiBldmFsdWF0ZUxhdGVyMiwgY2xlYW51cDogY2xlYW51cDIgfSkgPT4ge1xuICBsZXQgZnVuYyA9IGV2YWx1YXRlTGF0ZXIyKGV4cHJlc3Npb24pO1xuICBsZXQgaW5uZXJHZXQgPSAoKSA9PiB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBmdW5jKChpKSA9PiByZXN1bHQgPSBpKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBsZXQgZXZhbHVhdGVJbm5lclNldCA9IGV2YWx1YXRlTGF0ZXIyKGAke2V4cHJlc3Npb259ID0gX19wbGFjZWhvbGRlcmApO1xuICBsZXQgaW5uZXJTZXQgPSAodmFsKSA9PiBldmFsdWF0ZUlubmVyU2V0KCgpID0+IHtcbiAgfSwgeyBzY29wZTogeyBcIl9fcGxhY2Vob2xkZXJcIjogdmFsIH0gfSk7XG4gIGxldCBpbml0aWFsVmFsdWUgPSBpbm5lckdldCgpO1xuICBpbm5lclNldChpbml0aWFsVmFsdWUpO1xuICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG4gICAgaWYgKCFlbC5feF9tb2RlbClcbiAgICAgIHJldHVybjtcbiAgICBlbC5feF9yZW1vdmVNb2RlbExpc3RlbmVyc1tcImRlZmF1bHRcIl0oKTtcbiAgICBsZXQgb3V0ZXJHZXQgPSBlbC5feF9tb2RlbC5nZXQ7XG4gICAgbGV0IG91dGVyU2V0ID0gZWwuX3hfbW9kZWwuc2V0V2l0aE1vZGlmaWVycztcbiAgICBsZXQgcmVsZWFzZUVudGFuZ2xlbWVudCA9IGVudGFuZ2xlKFxuICAgICAge1xuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIG91dGVyR2V0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgIG91dGVyU2V0KHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgIHJldHVybiBpbm5lckdldCgpO1xuICAgICAgICB9LFxuICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICBpbm5lclNldCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuICAgIGNsZWFudXAyKHJlbGVhc2VFbnRhbmdsZW1lbnQpO1xuICB9KTtcbn0pO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LXRlbGVwb3J0LmpzXG5kaXJlY3RpdmUoXCJ0ZWxlcG9ydFwiLCAoZWwsIHsgbW9kaWZpZXJzLCBleHByZXNzaW9uIH0sIHsgY2xlYW51cDogY2xlYW51cDIgfSkgPT4ge1xuICBpZiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSBcInRlbXBsYXRlXCIpXG4gICAgd2FybihcIngtdGVsZXBvcnQgY2FuIG9ubHkgYmUgdXNlZCBvbiBhIDx0ZW1wbGF0ZT4gdGFnXCIsIGVsKTtcbiAgbGV0IHRhcmdldCA9IGdldFRhcmdldChleHByZXNzaW9uKTtcbiAgbGV0IGNsb25lMiA9IGVsLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpLmZpcnN0RWxlbWVudENoaWxkO1xuICBlbC5feF90ZWxlcG9ydCA9IGNsb25lMjtcbiAgY2xvbmUyLl94X3RlbGVwb3J0QmFjayA9IGVsO1xuICBlbC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRlbGVwb3J0LXRlbXBsYXRlXCIsIHRydWUpO1xuICBjbG9uZTIuc2V0QXR0cmlidXRlKFwiZGF0YS10ZWxlcG9ydC10YXJnZXRcIiwgdHJ1ZSk7XG4gIGlmIChlbC5feF9mb3J3YXJkRXZlbnRzKSB7XG4gICAgZWwuX3hfZm9yd2FyZEV2ZW50cy5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgIGNsb25lMi5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgKGUpID0+IHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgZS5jb25zdHJ1Y3RvcihlLnR5cGUsIGUpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIGFkZFNjb3BlVG9Ob2RlKGNsb25lMiwge30sIGVsKTtcbiAgbGV0IHBsYWNlSW5Eb20gPSAoY2xvbmUzLCB0YXJnZXQyLCBtb2RpZmllcnMyKSA9PiB7XG4gICAgaWYgKG1vZGlmaWVyczIuaW5jbHVkZXMoXCJwcmVwZW5kXCIpKSB7XG4gICAgICB0YXJnZXQyLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNsb25lMywgdGFyZ2V0Mik7XG4gICAgfSBlbHNlIGlmIChtb2RpZmllcnMyLmluY2x1ZGVzKFwiYXBwZW5kXCIpKSB7XG4gICAgICB0YXJnZXQyLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNsb25lMywgdGFyZ2V0Mi5uZXh0U2libGluZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldDIuYXBwZW5kQ2hpbGQoY2xvbmUzKTtcbiAgICB9XG4gIH07XG4gIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgcGxhY2VJbkRvbShjbG9uZTIsIHRhcmdldCwgbW9kaWZpZXJzKTtcbiAgICBza2lwRHVyaW5nQ2xvbmUoKCkgPT4ge1xuICAgICAgaW5pdFRyZWUoY2xvbmUyKTtcbiAgICB9KSgpO1xuICB9KTtcbiAgZWwuX3hfdGVsZXBvcnRQdXRCYWNrID0gKCkgPT4ge1xuICAgIGxldCB0YXJnZXQyID0gZ2V0VGFyZ2V0KGV4cHJlc3Npb24pO1xuICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICBwbGFjZUluRG9tKGVsLl94X3RlbGVwb3J0LCB0YXJnZXQyLCBtb2RpZmllcnMpO1xuICAgIH0pO1xuICB9O1xuICBjbGVhbnVwMihcbiAgICAoKSA9PiBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgY2xvbmUyLnJlbW92ZSgpO1xuICAgICAgZGVzdHJveVRyZWUoY2xvbmUyKTtcbiAgICB9KVxuICApO1xufSk7XG52YXIgdGVsZXBvcnRDb250YWluZXJEdXJpbmdDbG9uZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5mdW5jdGlvbiBnZXRUYXJnZXQoZXhwcmVzc2lvbikge1xuICBsZXQgdGFyZ2V0ID0gc2tpcER1cmluZ0Nsb25lKCgpID0+IHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihleHByZXNzaW9uKTtcbiAgfSwgKCkgPT4ge1xuICAgIHJldHVybiB0ZWxlcG9ydENvbnRhaW5lckR1cmluZ0Nsb25lO1xuICB9KSgpO1xuICBpZiAoIXRhcmdldClcbiAgICB3YXJuKGBDYW5ub3QgZmluZCB4LXRlbGVwb3J0IGVsZW1lbnQgZm9yIHNlbGVjdG9yOiBcIiR7ZXhwcmVzc2lvbn1cImApO1xuICByZXR1cm4gdGFyZ2V0O1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWlnbm9yZS5qc1xudmFyIGhhbmRsZXIgPSAoKSA9PiB7XG59O1xuaGFuZGxlci5pbmxpbmUgPSAoZWwsIHsgbW9kaWZpZXJzIH0sIHsgY2xlYW51cDogY2xlYW51cDIgfSkgPT4ge1xuICBtb2RpZmllcnMuaW5jbHVkZXMoXCJzZWxmXCIpID8gZWwuX3hfaWdub3JlU2VsZiA9IHRydWUgOiBlbC5feF9pZ25vcmUgPSB0cnVlO1xuICBjbGVhbnVwMigoKSA9PiB7XG4gICAgbW9kaWZpZXJzLmluY2x1ZGVzKFwic2VsZlwiKSA/IGRlbGV0ZSBlbC5feF9pZ25vcmVTZWxmIDogZGVsZXRlIGVsLl94X2lnbm9yZTtcbiAgfSk7XG59O1xuZGlyZWN0aXZlKFwiaWdub3JlXCIsIGhhbmRsZXIpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWVmZmVjdC5qc1xuZGlyZWN0aXZlKFwiZWZmZWN0XCIsIHNraXBEdXJpbmdDbG9uZSgoZWwsIHsgZXhwcmVzc2lvbiB9LCB7IGVmZmVjdDogZWZmZWN0MyB9KSA9PiB7XG4gIGVmZmVjdDMoZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbikpO1xufSkpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvb24uanNcbmZ1bmN0aW9uIG9uKGVsLCBldmVudCwgbW9kaWZpZXJzLCBjYWxsYmFjaykge1xuICBsZXQgbGlzdGVuZXJUYXJnZXQgPSBlbDtcbiAgbGV0IGhhbmRsZXI0ID0gKGUpID0+IGNhbGxiYWNrKGUpO1xuICBsZXQgb3B0aW9ucyA9IHt9O1xuICBsZXQgd3JhcEhhbmRsZXIgPSAoY2FsbGJhY2syLCB3cmFwcGVyKSA9PiAoZSkgPT4gd3JhcHBlcihjYWxsYmFjazIsIGUpO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiZG90XCIpKVxuICAgIGV2ZW50ID0gZG90U3ludGF4KGV2ZW50KTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImNhbWVsXCIpKVxuICAgIGV2ZW50ID0gY2FtZWxDYXNlMihldmVudCk7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJjYXB0dXJlXCIpKVxuICAgIG9wdGlvbnMuY2FwdHVyZSA9IHRydWU7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJ3aW5kb3dcIikpXG4gICAgbGlzdGVuZXJUYXJnZXQgPSB3aW5kb3c7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJkb2N1bWVudFwiKSlcbiAgICBsaXN0ZW5lclRhcmdldCA9IGRvY3VtZW50O1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicGFzc2l2ZVwiKSkge1xuICAgIG9wdGlvbnMucGFzc2l2ZSA9IG1vZGlmaWVyc1ttb2RpZmllcnMuaW5kZXhPZihcInBhc3NpdmVcIikgKyAxXSAhPT0gXCJmYWxzZVwiO1xuICB9XG4gIGhhbmRsZXI0ID0gYWRkRGVib3VuY2VPclRocm90dGxlKG1vZGlmaWVycywgaGFuZGxlcjQpO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicHJldmVudFwiKSlcbiAgICBoYW5kbGVyNCA9IHdyYXBIYW5kbGVyKGhhbmRsZXI0LCAobmV4dCwgZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgbmV4dChlKTtcbiAgICB9KTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInN0b3BcIikpXG4gICAgaGFuZGxlcjQgPSB3cmFwSGFuZGxlcihoYW5kbGVyNCwgKG5leHQsIGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBuZXh0KGUpO1xuICAgIH0pO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwib25jZVwiKSkge1xuICAgIGhhbmRsZXI0ID0gd3JhcEhhbmRsZXIoaGFuZGxlcjQsIChuZXh0LCBlKSA9PiB7XG4gICAgICBuZXh0KGUpO1xuICAgICAgbGlzdGVuZXJUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlcjQsIG9wdGlvbnMpO1xuICAgIH0pO1xuICB9XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJhd2F5XCIpIHx8IG1vZGlmaWVycy5pbmNsdWRlcyhcIm91dHNpZGVcIikpIHtcbiAgICBsaXN0ZW5lclRhcmdldCA9IGRvY3VtZW50O1xuICAgIGhhbmRsZXI0ID0gd3JhcEhhbmRsZXIoaGFuZGxlcjQsIChuZXh0LCBlKSA9PiB7XG4gICAgICBpZiAoZWwuY29udGFpbnMoZS50YXJnZXQpKVxuICAgICAgICByZXR1cm47XG4gICAgICBpZiAoZS50YXJnZXQuaXNDb25uZWN0ZWQgPT09IGZhbHNlKVxuICAgICAgICByZXR1cm47XG4gICAgICBpZiAoZWwub2Zmc2V0V2lkdGggPCAxICYmIGVsLm9mZnNldEhlaWdodCA8IDEpXG4gICAgICAgIHJldHVybjtcbiAgICAgIGlmIChlbC5feF9pc1Nob3duID09PSBmYWxzZSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgbmV4dChlKTtcbiAgICB9KTtcbiAgfVxuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwic2VsZlwiKSlcbiAgICBoYW5kbGVyNCA9IHdyYXBIYW5kbGVyKGhhbmRsZXI0LCAobmV4dCwgZSkgPT4ge1xuICAgICAgZS50YXJnZXQgPT09IGVsICYmIG5leHQoZSk7XG4gICAgfSk7XG4gIGlmIChldmVudCA9PT0gXCJzdWJtaXRcIikge1xuICAgIGhhbmRsZXI0ID0gd3JhcEhhbmRsZXIoaGFuZGxlcjQsIChuZXh0LCBlKSA9PiB7XG4gICAgICBpZiAoZS50YXJnZXQuX3hfcGVuZGluZ01vZGVsVXBkYXRlcykge1xuICAgICAgICBlLnRhcmdldC5feF9wZW5kaW5nTW9kZWxVcGRhdGVzLmZvckVhY2goKGZuKSA9PiBmbigpKTtcbiAgICAgIH1cbiAgICAgIG5leHQoZSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKGlzS2V5RXZlbnQoZXZlbnQpIHx8IGlzQ2xpY2tFdmVudChldmVudCkpIHtcbiAgICBoYW5kbGVyNCA9IHdyYXBIYW5kbGVyKGhhbmRsZXI0LCAobmV4dCwgZSkgPT4ge1xuICAgICAgaWYgKGlzTGlzdGVuaW5nRm9yQVNwZWNpZmljS2V5VGhhdEhhc250QmVlblByZXNzZWQoZSwgbW9kaWZpZXJzKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBuZXh0KGUpO1xuICAgIH0pO1xuICB9XG4gIGxpc3RlbmVyVGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXI0LCBvcHRpb25zKTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBsaXN0ZW5lclRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyNCwgb3B0aW9ucyk7XG4gIH07XG59XG5mdW5jdGlvbiBhZGREZWJvdW5jZU9yVGhyb3R0bGUobW9kaWZpZXJzLCBoYW5kbGVyNCkge1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiZGVib3VuY2VcIikpIHtcbiAgICBsZXQgbmV4dE1vZGlmaWVyID0gbW9kaWZpZXJzW21vZGlmaWVycy5pbmRleE9mKFwiZGVib3VuY2VcIikgKyAxXSB8fCBcImludmFsaWQtd2FpdFwiO1xuICAgIGxldCB3YWl0ID0gaXNOdW1lcmljKG5leHRNb2RpZmllci5zcGxpdChcIm1zXCIpWzBdKSA/IE51bWJlcihuZXh0TW9kaWZpZXIuc3BsaXQoXCJtc1wiKVswXSkgOiAyNTA7XG4gICAgaGFuZGxlcjQgPSBkZWJvdW5jZShoYW5kbGVyNCwgd2FpdCk7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInRocm90dGxlXCIpKSB7XG4gICAgbGV0IG5leHRNb2RpZmllciA9IG1vZGlmaWVyc1ttb2RpZmllcnMuaW5kZXhPZihcInRocm90dGxlXCIpICsgMV0gfHwgXCJpbnZhbGlkLXdhaXRcIjtcbiAgICBsZXQgd2FpdCA9IGlzTnVtZXJpYyhuZXh0TW9kaWZpZXIuc3BsaXQoXCJtc1wiKVswXSkgPyBOdW1iZXIobmV4dE1vZGlmaWVyLnNwbGl0KFwibXNcIilbMF0pIDogMjUwO1xuICAgIGhhbmRsZXI0ID0gdGhyb3R0bGUoaGFuZGxlcjQsIHdhaXQpO1xuICB9XG4gIHJldHVybiBoYW5kbGVyNDtcbn1cbmZ1bmN0aW9uIGRvdFN5bnRheChzdWJqZWN0KSB7XG4gIHJldHVybiBzdWJqZWN0LnJlcGxhY2UoLy0vZywgXCIuXCIpO1xufVxuZnVuY3Rpb24gY2FtZWxDYXNlMihzdWJqZWN0KSB7XG4gIHJldHVybiBzdWJqZWN0LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvLShcXHcpL2csIChtYXRjaCwgY2hhcikgPT4gY2hhci50b1VwcGVyQ2FzZSgpKTtcbn1cbmZ1bmN0aW9uIGlzTnVtZXJpYyhzdWJqZWN0KSB7XG4gIHJldHVybiAhQXJyYXkuaXNBcnJheShzdWJqZWN0KSAmJiAhaXNOYU4oc3ViamVjdCk7XG59XG5mdW5jdGlvbiBrZWJhYkNhc2UyKHN1YmplY3QpIHtcbiAgaWYgKFtcIiBcIiwgXCJfXCJdLmluY2x1ZGVzKFxuICAgIHN1YmplY3RcbiAgKSlcbiAgICByZXR1cm4gc3ViamVjdDtcbiAgcmV0dXJuIHN1YmplY3QucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgXCIkMS0kMlwiKS5yZXBsYWNlKC9bX1xcc10vLCBcIi1cIikudG9Mb3dlckNhc2UoKTtcbn1cbmZ1bmN0aW9uIGlzS2V5RXZlbnQoZXZlbnQpIHtcbiAgcmV0dXJuIFtcImtleWRvd25cIiwgXCJrZXl1cFwiXS5pbmNsdWRlcyhldmVudCk7XG59XG5mdW5jdGlvbiBpc0NsaWNrRXZlbnQoZXZlbnQpIHtcbiAgcmV0dXJuIFtcImNvbnRleHRtZW51XCIsIFwiY2xpY2tcIiwgXCJtb3VzZVwiXS5zb21lKChpKSA9PiBldmVudC5pbmNsdWRlcyhpKSk7XG59XG5mdW5jdGlvbiBpc0xpc3RlbmluZ0ZvckFTcGVjaWZpY0tleVRoYXRIYXNudEJlZW5QcmVzc2VkKGUsIG1vZGlmaWVycykge1xuICBsZXQga2V5TW9kaWZpZXJzID0gbW9kaWZpZXJzLmZpbHRlcigoaSkgPT4ge1xuICAgIHJldHVybiAhW1wid2luZG93XCIsIFwiZG9jdW1lbnRcIiwgXCJwcmV2ZW50XCIsIFwic3RvcFwiLCBcIm9uY2VcIiwgXCJjYXB0dXJlXCIsIFwic2VsZlwiLCBcImF3YXlcIiwgXCJvdXRzaWRlXCIsIFwicGFzc2l2ZVwiLCBcInByZXNlcnZlLXNjcm9sbFwiLCBcImJsdXJcIiwgXCJjaGFuZ2VcIiwgXCJsYXp5XCJdLmluY2x1ZGVzKGkpO1xuICB9KTtcbiAgaWYgKGtleU1vZGlmaWVycy5pbmNsdWRlcyhcImRlYm91bmNlXCIpKSB7XG4gICAgbGV0IGRlYm91bmNlSW5kZXggPSBrZXlNb2RpZmllcnMuaW5kZXhPZihcImRlYm91bmNlXCIpO1xuICAgIGtleU1vZGlmaWVycy5zcGxpY2UoZGVib3VuY2VJbmRleCwgaXNOdW1lcmljKChrZXlNb2RpZmllcnNbZGVib3VuY2VJbmRleCArIDFdIHx8IFwiaW52YWxpZC13YWl0XCIpLnNwbGl0KFwibXNcIilbMF0pID8gMiA6IDEpO1xuICB9XG4gIGlmIChrZXlNb2RpZmllcnMuaW5jbHVkZXMoXCJ0aHJvdHRsZVwiKSkge1xuICAgIGxldCBkZWJvdW5jZUluZGV4ID0ga2V5TW9kaWZpZXJzLmluZGV4T2YoXCJ0aHJvdHRsZVwiKTtcbiAgICBrZXlNb2RpZmllcnMuc3BsaWNlKGRlYm91bmNlSW5kZXgsIGlzTnVtZXJpYygoa2V5TW9kaWZpZXJzW2RlYm91bmNlSW5kZXggKyAxXSB8fCBcImludmFsaWQtd2FpdFwiKS5zcGxpdChcIm1zXCIpWzBdKSA/IDIgOiAxKTtcbiAgfVxuICBpZiAoa2V5TW9kaWZpZXJzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gZmFsc2U7XG4gIGlmIChrZXlNb2RpZmllcnMubGVuZ3RoID09PSAxICYmIGtleVRvTW9kaWZpZXJzKGUua2V5KS5pbmNsdWRlcyhrZXlNb2RpZmllcnNbMF0pKVxuICAgIHJldHVybiBmYWxzZTtcbiAgY29uc3Qgc3lzdGVtS2V5TW9kaWZpZXJzID0gW1wiY3RybFwiLCBcInNoaWZ0XCIsIFwiYWx0XCIsIFwibWV0YVwiLCBcImNtZFwiLCBcInN1cGVyXCJdO1xuICBjb25zdCBzZWxlY3RlZFN5c3RlbUtleU1vZGlmaWVycyA9IHN5c3RlbUtleU1vZGlmaWVycy5maWx0ZXIoKG1vZGlmaWVyKSA9PiBrZXlNb2RpZmllcnMuaW5jbHVkZXMobW9kaWZpZXIpKTtcbiAga2V5TW9kaWZpZXJzID0ga2V5TW9kaWZpZXJzLmZpbHRlcigoaSkgPT4gIXNlbGVjdGVkU3lzdGVtS2V5TW9kaWZpZXJzLmluY2x1ZGVzKGkpKTtcbiAgaWYgKHNlbGVjdGVkU3lzdGVtS2V5TW9kaWZpZXJzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBhY3RpdmVseVByZXNzZWRLZXlNb2RpZmllcnMgPSBzZWxlY3RlZFN5c3RlbUtleU1vZGlmaWVycy5maWx0ZXIoKG1vZGlmaWVyKSA9PiB7XG4gICAgICBpZiAobW9kaWZpZXIgPT09IFwiY21kXCIgfHwgbW9kaWZpZXIgPT09IFwic3VwZXJcIilcbiAgICAgICAgbW9kaWZpZXIgPSBcIm1ldGFcIjtcbiAgICAgIHJldHVybiBlW2Ake21vZGlmaWVyfUtleWBdO1xuICAgIH0pO1xuICAgIGlmIChhY3RpdmVseVByZXNzZWRLZXlNb2RpZmllcnMubGVuZ3RoID09PSBzZWxlY3RlZFN5c3RlbUtleU1vZGlmaWVycy5sZW5ndGgpIHtcbiAgICAgIGlmIChpc0NsaWNrRXZlbnQoZS50eXBlKSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgaWYgKGtleVRvTW9kaWZpZXJzKGUua2V5KS5pbmNsdWRlcyhrZXlNb2RpZmllcnNbMF0pKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24ga2V5VG9Nb2RpZmllcnMoa2V5KSB7XG4gIGlmICgha2V5KVxuICAgIHJldHVybiBbXTtcbiAga2V5ID0ga2ViYWJDYXNlMihrZXkpO1xuICBsZXQgbW9kaWZpZXJUb0tleU1hcCA9IHtcbiAgICBcImN0cmxcIjogXCJjb250cm9sXCIsXG4gICAgXCJzbGFzaFwiOiBcIi9cIixcbiAgICBcInNwYWNlXCI6IFwiIFwiLFxuICAgIFwic3BhY2ViYXJcIjogXCIgXCIsXG4gICAgXCJjbWRcIjogXCJtZXRhXCIsXG4gICAgXCJlc2NcIjogXCJlc2NhcGVcIixcbiAgICBcInVwXCI6IFwiYXJyb3ctdXBcIixcbiAgICBcImRvd25cIjogXCJhcnJvdy1kb3duXCIsXG4gICAgXCJsZWZ0XCI6IFwiYXJyb3ctbGVmdFwiLFxuICAgIFwicmlnaHRcIjogXCJhcnJvdy1yaWdodFwiLFxuICAgIFwicGVyaW9kXCI6IFwiLlwiLFxuICAgIFwiY29tbWFcIjogXCIsXCIsXG4gICAgXCJlcXVhbFwiOiBcIj1cIixcbiAgICBcIm1pbnVzXCI6IFwiLVwiLFxuICAgIFwidW5kZXJzY29yZVwiOiBcIl9cIlxuICB9O1xuICBtb2RpZmllclRvS2V5TWFwW2tleV0gPSBrZXk7XG4gIHJldHVybiBPYmplY3Qua2V5cyhtb2RpZmllclRvS2V5TWFwKS5tYXAoKG1vZGlmaWVyKSA9PiB7XG4gICAgaWYgKG1vZGlmaWVyVG9LZXlNYXBbbW9kaWZpZXJdID09PSBrZXkpXG4gICAgICByZXR1cm4gbW9kaWZpZXI7XG4gIH0pLmZpbHRlcigobW9kaWZpZXIpID0+IG1vZGlmaWVyKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1tb2RlbC5qc1xuZGlyZWN0aXZlKFwibW9kZWxcIiwgKGVsLCB7IG1vZGlmaWVycywgZXhwcmVzc2lvbiB9LCB7IGVmZmVjdDogZWZmZWN0MywgY2xlYW51cDogY2xlYW51cDIgfSkgPT4ge1xuICBsZXQgc2NvcGVUYXJnZXQgPSBlbDtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInBhcmVudFwiKSkge1xuICAgIHNjb3BlVGFyZ2V0ID0gZmluZENsb3Nlc3QoZWwsIChlbGVtZW50KSA9PiBlbGVtZW50ICE9PSBlbCk7XG4gIH1cbiAgbGV0IGV2YWx1YXRlR2V0ID0gZXZhbHVhdGVMYXRlcihzY29wZVRhcmdldCwgZXhwcmVzc2lvbik7XG4gIGxldCBldmFsdWF0ZVNldDtcbiAgaWYgKHR5cGVvZiBleHByZXNzaW9uID09PSBcInN0cmluZ1wiKSB7XG4gICAgZXZhbHVhdGVTZXQgPSBldmFsdWF0ZUxhdGVyKHNjb3BlVGFyZ2V0LCBgJHtleHByZXNzaW9ufSA9IF9fcGxhY2Vob2xkZXJgKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBleHByZXNzaW9uKCkgPT09IFwic3RyaW5nXCIpIHtcbiAgICBldmFsdWF0ZVNldCA9IGV2YWx1YXRlTGF0ZXIoc2NvcGVUYXJnZXQsIGAke2V4cHJlc3Npb24oKX0gPSBfX3BsYWNlaG9sZGVyYCk7XG4gIH0gZWxzZSB7XG4gICAgZXZhbHVhdGVTZXQgPSAoKSA9PiB7XG4gICAgfTtcbiAgfVxuICBsZXQgZ2V0VmFsdWUgPSAoKSA9PiB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBldmFsdWF0ZUdldCgodmFsdWUpID0+IHJlc3VsdCA9IHZhbHVlKTtcbiAgICByZXR1cm4gaXNHZXR0ZXJTZXR0ZXIocmVzdWx0KSA/IHJlc3VsdC5nZXQoKSA6IHJlc3VsdDtcbiAgfTtcbiAgbGV0IHNldFZhbHVlID0gKHZhbHVlKSA9PiB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBldmFsdWF0ZUdldCgodmFsdWUyKSA9PiByZXN1bHQgPSB2YWx1ZTIpO1xuICAgIGlmIChpc0dldHRlclNldHRlcihyZXN1bHQpKSB7XG4gICAgICByZXN1bHQuc2V0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXZhbHVhdGVTZXQoKCkgPT4ge1xuICAgICAgfSwge1xuICAgICAgICBzY29wZTogeyBcIl9fcGxhY2Vob2xkZXJcIjogdmFsdWUgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09IFwic3RyaW5nXCIgJiYgZWwudHlwZSA9PT0gXCJyYWRpb1wiKSB7XG4gICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgIGlmICghZWwuaGFzQXR0cmlidXRlKFwibmFtZVwiKSlcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBleHByZXNzaW9uKTtcbiAgICB9KTtcbiAgfVxuICBsZXQgaGFzQ2hhbmdlTW9kaWZpZXIgPSBtb2RpZmllcnMuaW5jbHVkZXMoXCJjaGFuZ2VcIikgfHwgbW9kaWZpZXJzLmluY2x1ZGVzKFwibGF6eVwiKTtcbiAgbGV0IGhhc0JsdXJNb2RpZmllciA9IG1vZGlmaWVycy5pbmNsdWRlcyhcImJsdXJcIik7XG4gIGxldCBoYXNFbnRlck1vZGlmaWVyID0gbW9kaWZpZXJzLmluY2x1ZGVzKFwiZW50ZXJcIik7XG4gIGxldCBoYXNFeHBsaWNpdEV2ZW50TW9kaWZpZXJzID0gaGFzQ2hhbmdlTW9kaWZpZXIgfHwgaGFzQmx1ck1vZGlmaWVyIHx8IGhhc0VudGVyTW9kaWZpZXI7XG4gIGxldCByZW1vdmVMaXN0ZW5lcjtcbiAgaWYgKGlzQ2xvbmluZykge1xuICAgIHJlbW92ZUxpc3RlbmVyID0gKCkgPT4ge1xuICAgIH07XG4gIH0gZWxzZSBpZiAoaGFzRXhwbGljaXRFdmVudE1vZGlmaWVycykge1xuICAgIGxldCBsaXN0ZW5lcnMgPSBbXTtcbiAgICBsZXQgc3luY1ZhbHVlID0gKGUpID0+IHNldFZhbHVlKGdldElucHV0VmFsdWUoZWwsIG1vZGlmaWVycywgZSwgZ2V0VmFsdWUoKSkpO1xuICAgIGlmIChoYXNDaGFuZ2VNb2RpZmllcikge1xuICAgICAgbGlzdGVuZXJzLnB1c2gob24oZWwsIFwiY2hhbmdlXCIsIG1vZGlmaWVycywgc3luY1ZhbHVlKSk7XG4gICAgfVxuICAgIGlmIChoYXNCbHVyTW9kaWZpZXIpIHtcbiAgICAgIGxpc3RlbmVycy5wdXNoKG9uKGVsLCBcImJsdXJcIiwgbW9kaWZpZXJzLCBzeW5jVmFsdWUpKTtcbiAgICAgIGlmIChlbC5mb3JtKSB7XG4gICAgICAgIGxldCBmb3JtID0gZWwuZm9ybTtcbiAgICAgICAgbGV0IHN5bmNDYWxsYmFjayA9ICgpID0+IHN5bmNWYWx1ZSh7IHRhcmdldDogZWwgfSk7XG4gICAgICAgIGlmICghZm9ybS5feF9wZW5kaW5nTW9kZWxVcGRhdGVzKVxuICAgICAgICAgIGZvcm0uX3hfcGVuZGluZ01vZGVsVXBkYXRlcyA9IFtdO1xuICAgICAgICBmb3JtLl94X3BlbmRpbmdNb2RlbFVwZGF0ZXMucHVzaChzeW5jQ2FsbGJhY2spO1xuICAgICAgICBjbGVhbnVwMigoKSA9PiB7XG4gICAgICAgICAgaWYgKGZvcm0uX3hfcGVuZGluZ01vZGVsVXBkYXRlcykge1xuICAgICAgICAgICAgZm9ybS5feF9wZW5kaW5nTW9kZWxVcGRhdGVzLnNwbGljZShmb3JtLl94X3BlbmRpbmdNb2RlbFVwZGF0ZXMuaW5kZXhPZihzeW5jQ2FsbGJhY2spLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaGFzRW50ZXJNb2RpZmllcikge1xuICAgICAgbGlzdGVuZXJzLnB1c2gob24oZWwsIFwia2V5ZG93blwiLCBtb2RpZmllcnMsIChlKSA9PiB7XG4gICAgICAgIGlmIChlLmtleSA9PT0gXCJFbnRlclwiKVxuICAgICAgICAgIHN5bmNWYWx1ZShlKTtcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgcmVtb3ZlTGlzdGVuZXIgPSAoKSA9PiBsaXN0ZW5lcnMuZm9yRWFjaCgocmVtb3ZlKSA9PiByZW1vdmUoKSk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGV2ZW50ID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcInNlbGVjdFwiIHx8IFtcImNoZWNrYm94XCIsIFwicmFkaW9cIl0uaW5jbHVkZXMoZWwudHlwZSkgPyBcImNoYW5nZVwiIDogXCJpbnB1dFwiO1xuICAgIHJlbW92ZUxpc3RlbmVyID0gb24oZWwsIGV2ZW50LCBtb2RpZmllcnMsIChlKSA9PiB7XG4gICAgICBzZXRWYWx1ZShnZXRJbnB1dFZhbHVlKGVsLCBtb2RpZmllcnMsIGUsIGdldFZhbHVlKCkpKTtcbiAgICB9KTtcbiAgfVxuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiZmlsbFwiKSkge1xuICAgIGlmIChbdm9pZCAwLCBudWxsLCBcIlwiXS5pbmNsdWRlcyhnZXRWYWx1ZSgpKSB8fCBpc0NoZWNrYm94KGVsKSAmJiBBcnJheS5pc0FycmF5KGdldFZhbHVlKCkpIHx8IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJzZWxlY3RcIiAmJiBlbC5tdWx0aXBsZSkge1xuICAgICAgc2V0VmFsdWUoXG4gICAgICAgIGdldElucHV0VmFsdWUoZWwsIG1vZGlmaWVycywgeyB0YXJnZXQ6IGVsIH0sIGdldFZhbHVlKCkpXG4gICAgICApO1xuICAgIH1cbiAgfVxuICBpZiAoIWVsLl94X3JlbW92ZU1vZGVsTGlzdGVuZXJzKVxuICAgIGVsLl94X3JlbW92ZU1vZGVsTGlzdGVuZXJzID0ge307XG4gIGVsLl94X3JlbW92ZU1vZGVsTGlzdGVuZXJzW1wiZGVmYXVsdFwiXSA9IHJlbW92ZUxpc3RlbmVyO1xuICBjbGVhbnVwMigoKSA9PiBlbC5feF9yZW1vdmVNb2RlbExpc3RlbmVyc1tcImRlZmF1bHRcIl0oKSk7XG4gIGlmIChlbC5mb3JtKSB7XG4gICAgbGV0IHJlbW92ZVJlc2V0TGlzdGVuZXIgPSBvbihlbC5mb3JtLCBcInJlc2V0XCIsIFtdLCAoZSkgPT4ge1xuICAgICAgbmV4dFRpY2soKCkgPT4gZWwuX3hfbW9kZWwgJiYgZWwuX3hfbW9kZWwuc2V0KGdldElucHV0VmFsdWUoZWwsIG1vZGlmaWVycywgeyB0YXJnZXQ6IGVsIH0sIGdldFZhbHVlKCkpKSk7XG4gICAgfSk7XG4gICAgY2xlYW51cDIoKCkgPT4gcmVtb3ZlUmVzZXRMaXN0ZW5lcigpKTtcbiAgfVxuICBlbC5feF9tb2RlbCA9IHtcbiAgICBnZXQoKSB7XG4gICAgICByZXR1cm4gZ2V0VmFsdWUoKTtcbiAgICB9LFxuICAgIHNldCh2YWx1ZSkge1xuICAgICAgc2V0VmFsdWUodmFsdWUpO1xuICAgIH0sXG4gICAgc2V0V2l0aE1vZGlmaWVyczogYWRkRGVib3VuY2VPclRocm90dGxlKG1vZGlmaWVycywgc2V0VmFsdWUpXG4gIH07XG4gIGVsLl94X2ZvcmNlTW9kZWxVcGRhdGUgPSAodmFsdWUpID0+IHtcbiAgICBpZiAodmFsdWUgPT09IHZvaWQgMCAmJiB0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJzdHJpbmdcIiAmJiBleHByZXNzaW9uLm1hdGNoKC9cXC4vKSlcbiAgICAgIHZhbHVlID0gXCJcIjtcbiAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgaWYgKGlzQ2hlY2tib3goZWwpKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIGVsLmNoZWNrZWQgPSB2YWx1ZS5zb21lKCh2YWwpID0+IHZhbCA9PSBlbC52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWwuY2hlY2tlZCA9ICEhdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaXNSYWRpbyhlbCkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICBlbC5jaGVja2VkID0gc2FmZVBhcnNlQm9vbGVhbihlbC52YWx1ZSkgPT09IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsLmNoZWNrZWQgPSBlbC52YWx1ZSA9PSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmluZChlbCwgXCJ2YWx1ZVwiLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIGVmZmVjdDMoKCkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IGdldFZhbHVlKCk7XG4gICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInVuaW50cnVzaXZlXCIpICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuaXNTYW1lTm9kZShlbCkpXG4gICAgICByZXR1cm47XG4gICAgZWwuX3hfZm9yY2VNb2RlbFVwZGF0ZSh2YWx1ZSk7XG4gIH0pO1xufSk7XG5mdW5jdGlvbiBnZXRJbnB1dFZhbHVlKGVsLCBtb2RpZmllcnMsIGV2ZW50LCBjdXJyZW50VmFsdWUpIHtcbiAgcmV0dXJuIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgQ3VzdG9tRXZlbnQgJiYgZXZlbnQuZGV0YWlsICE9PSB2b2lkIDApXG4gICAgICByZXR1cm4gZXZlbnQuZGV0YWlsICE9PSBudWxsICYmIGV2ZW50LmRldGFpbCAhPT0gdm9pZCAwID8gZXZlbnQuZGV0YWlsIDogZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgIGVsc2UgaWYgKGlzQ2hlY2tib3goZWwpKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShjdXJyZW50VmFsdWUpKSB7XG4gICAgICAgIGxldCBuZXdWYWx1ZSA9IG51bGw7XG4gICAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJudW1iZXJcIikpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IHNhZmVQYXJzZU51bWJlcihldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImJvb2xlYW5cIikpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IHNhZmVQYXJzZUJvb2xlYW4oZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXZlbnQudGFyZ2V0LmNoZWNrZWQgPyBjdXJyZW50VmFsdWUuaW5jbHVkZXMobmV3VmFsdWUpID8gY3VycmVudFZhbHVlIDogY3VycmVudFZhbHVlLmNvbmNhdChbbmV3VmFsdWVdKSA6IGN1cnJlbnRWYWx1ZS5maWx0ZXIoKGVsMikgPT4gIWNoZWNrZWRBdHRyTG9vc2VDb21wYXJlMihlbDIsIG5ld1ZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZXZlbnQudGFyZ2V0LmNoZWNrZWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwic2VsZWN0XCIgJiYgZWwubXVsdGlwbGUpIHtcbiAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJudW1iZXJcIikpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oZXZlbnQudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucykubWFwKChvcHRpb24pID0+IHtcbiAgICAgICAgICBsZXQgcmF3VmFsdWUgPSBvcHRpb24udmFsdWUgfHwgb3B0aW9uLnRleHQ7XG4gICAgICAgICAgcmV0dXJuIHNhZmVQYXJzZU51bWJlcihyYXdWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJib29sZWFuXCIpKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKGV2ZW50LnRhcmdldC5zZWxlY3RlZE9wdGlvbnMpLm1hcCgob3B0aW9uKSA9PiB7XG4gICAgICAgICAgbGV0IHJhd1ZhbHVlID0gb3B0aW9uLnZhbHVlIHx8IG9wdGlvbi50ZXh0O1xuICAgICAgICAgIHJldHVybiBzYWZlUGFyc2VCb29sZWFuKHJhd1ZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShldmVudC50YXJnZXQuc2VsZWN0ZWRPcHRpb25zKS5tYXAoKG9wdGlvbikgPT4ge1xuICAgICAgICByZXR1cm4gb3B0aW9uLnZhbHVlIHx8IG9wdGlvbi50ZXh0O1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZXdWYWx1ZTtcbiAgICAgIGlmIChpc1JhZGlvKGVsKSkge1xuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LmNoZWNrZWQpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IGN1cnJlbnRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwibnVtYmVyXCIpKSB7XG4gICAgICAgIHJldHVybiBzYWZlUGFyc2VOdW1iZXIobmV3VmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJib29sZWFuXCIpKSB7XG4gICAgICAgIHJldHVybiBzYWZlUGFyc2VCb29sZWFuKG5ld1ZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwidHJpbVwiKSkge1xuICAgICAgICByZXR1cm4gbmV3VmFsdWUudHJpbSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ld1ZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBzYWZlUGFyc2VOdW1iZXIocmF3VmFsdWUpIHtcbiAgbGV0IG51bWJlciA9IHJhd1ZhbHVlID8gcGFyc2VGbG9hdChyYXdWYWx1ZSkgOiBudWxsO1xuICByZXR1cm4gaXNOdW1lcmljMihudW1iZXIpID8gbnVtYmVyIDogcmF3VmFsdWU7XG59XG5mdW5jdGlvbiBjaGVja2VkQXR0ckxvb3NlQ29tcGFyZTIodmFsdWVBLCB2YWx1ZUIpIHtcbiAgcmV0dXJuIHZhbHVlQSA9PSB2YWx1ZUI7XG59XG5mdW5jdGlvbiBpc051bWVyaWMyKHN1YmplY3QpIHtcbiAgcmV0dXJuICFBcnJheS5pc0FycmF5KHN1YmplY3QpICYmICFpc05hTihzdWJqZWN0KTtcbn1cbmZ1bmN0aW9uIGlzR2V0dGVyU2V0dGVyKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHZhbHVlLmdldCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiB2YWx1ZS5zZXQgPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1jbG9hay5qc1xuZGlyZWN0aXZlKFwiY2xvYWtcIiwgKGVsKSA9PiBxdWV1ZU1pY3JvdGFzaygoKSA9PiBtdXRhdGVEb20oKCkgPT4gZWwucmVtb3ZlQXR0cmlidXRlKHByZWZpeChcImNsb2FrXCIpKSkpKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1pbml0LmpzXG5hZGRJbml0U2VsZWN0b3IoKCkgPT4gYFske3ByZWZpeChcImluaXRcIil9XWApO1xuZGlyZWN0aXZlKFwiaW5pdFwiLCBza2lwRHVyaW5nQ2xvbmUoKGVsLCB7IGV4cHJlc3Npb24gfSwgeyBldmFsdWF0ZTogZXZhbHVhdGUyIH0pID0+IHtcbiAgaWYgKHR5cGVvZiBleHByZXNzaW9uID09PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuICEhZXhwcmVzc2lvbi50cmltKCkgJiYgZXZhbHVhdGUyKGV4cHJlc3Npb24sIHt9LCBmYWxzZSk7XG4gIH1cbiAgcmV0dXJuIGV2YWx1YXRlMihleHByZXNzaW9uLCB7fSwgZmFsc2UpO1xufSkpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LXRleHQuanNcbmRpcmVjdGl2ZShcInRleHRcIiwgKGVsLCB7IGV4cHJlc3Npb24gfSwgeyBlZmZlY3Q6IGVmZmVjdDMsIGV2YWx1YXRlTGF0ZXI6IGV2YWx1YXRlTGF0ZXIyIH0pID0+IHtcbiAgbGV0IGV2YWx1YXRlMiA9IGV2YWx1YXRlTGF0ZXIyKGV4cHJlc3Npb24pO1xuICBlZmZlY3QzKCgpID0+IHtcbiAgICBldmFsdWF0ZTIoKHZhbHVlKSA9PiB7XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBlbC50ZXh0Q29udGVudCA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtaHRtbC5qc1xuZGlyZWN0aXZlKFwiaHRtbFwiLCAoZWwsIHsgZXhwcmVzc2lvbiB9LCB7IGVmZmVjdDogZWZmZWN0MywgZXZhbHVhdGVMYXRlcjogZXZhbHVhdGVMYXRlcjIgfSkgPT4ge1xuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcjIoZXhwcmVzc2lvbik7XG4gIGVmZmVjdDMoKCkgPT4ge1xuICAgIGV2YWx1YXRlMigodmFsdWUpID0+IHtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGVsLmlubmVySFRNTCA9IHZhbHVlID8/IFwiXCI7XG4gICAgICAgIGVsLl94X2lnbm9yZVNlbGYgPSB0cnVlO1xuICAgICAgICBpbml0VHJlZShlbCk7XG4gICAgICAgIGRlbGV0ZSBlbC5feF9pZ25vcmVTZWxmO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtYmluZC5qc1xubWFwQXR0cmlidXRlcyhzdGFydGluZ1dpdGgoXCI6XCIsIGludG8ocHJlZml4KFwiYmluZDpcIikpKSk7XG52YXIgaGFuZGxlcjIgPSAoZWwsIHsgdmFsdWUsIG1vZGlmaWVycywgZXhwcmVzc2lvbiwgb3JpZ2luYWwgfSwgeyBlZmZlY3Q6IGVmZmVjdDMsIGNsZWFudXA6IGNsZWFudXAyIH0pID0+IHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIGxldCBiaW5kaW5nUHJvdmlkZXJzID0ge307XG4gICAgaW5qZWN0QmluZGluZ1Byb3ZpZGVycyhiaW5kaW5nUHJvdmlkZXJzKTtcbiAgICBsZXQgZ2V0QmluZGluZ3MgPSBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKTtcbiAgICBnZXRCaW5kaW5ncygoYmluZGluZ3MpID0+IHtcbiAgICAgIGFwcGx5QmluZGluZ3NPYmplY3QoZWwsIGJpbmRpbmdzLCBvcmlnaW5hbCk7XG4gICAgfSwgeyBzY29wZTogYmluZGluZ1Byb3ZpZGVycyB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHZhbHVlID09PSBcImtleVwiKVxuICAgIHJldHVybiBzdG9yZUtleUZvclhGb3IoZWwsIGV4cHJlc3Npb24pO1xuICBpZiAoZWwuX3hfaW5saW5lQmluZGluZ3MgJiYgZWwuX3hfaW5saW5lQmluZGluZ3NbdmFsdWVdICYmIGVsLl94X2lubGluZUJpbmRpbmdzW3ZhbHVlXS5leHRyYWN0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBldmFsdWF0ZTIgPSBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKTtcbiAgZWZmZWN0MygoKSA9PiBldmFsdWF0ZTIoKHJlc3VsdCkgPT4ge1xuICAgIGlmIChyZXN1bHQgPT09IHZvaWQgMCAmJiB0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJzdHJpbmdcIiAmJiBleHByZXNzaW9uLm1hdGNoKC9cXC4vKSkge1xuICAgICAgcmVzdWx0ID0gXCJcIjtcbiAgICB9XG4gICAgbXV0YXRlRG9tKCgpID0+IGJpbmQoZWwsIHZhbHVlLCByZXN1bHQsIG1vZGlmaWVycykpO1xuICB9KSk7XG4gIGNsZWFudXAyKCgpID0+IHtcbiAgICBlbC5feF91bmRvQWRkZWRDbGFzc2VzICYmIGVsLl94X3VuZG9BZGRlZENsYXNzZXMoKTtcbiAgICBlbC5feF91bmRvQWRkZWRTdHlsZXMgJiYgZWwuX3hfdW5kb0FkZGVkU3R5bGVzKCk7XG4gIH0pO1xufTtcbmhhbmRsZXIyLmlubGluZSA9IChlbCwgeyB2YWx1ZSwgbW9kaWZpZXJzLCBleHByZXNzaW9uIH0pID0+IHtcbiAgaWYgKCF2YWx1ZSlcbiAgICByZXR1cm47XG4gIGlmICghZWwuX3hfaW5saW5lQmluZGluZ3MpXG4gICAgZWwuX3hfaW5saW5lQmluZGluZ3MgPSB7fTtcbiAgZWwuX3hfaW5saW5lQmluZGluZ3NbdmFsdWVdID0geyBleHByZXNzaW9uLCBleHRyYWN0OiBmYWxzZSB9O1xufTtcbmRpcmVjdGl2ZShcImJpbmRcIiwgaGFuZGxlcjIpO1xuZnVuY3Rpb24gc3RvcmVLZXlGb3JYRm9yKGVsLCBleHByZXNzaW9uKSB7XG4gIGVsLl94X2tleUV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWRhdGEuanNcbmFkZFJvb3RTZWxlY3RvcigoKSA9PiBgWyR7cHJlZml4KFwiZGF0YVwiKX1dYCk7XG5kaXJlY3RpdmUoXCJkYXRhXCIsIChlbCwgeyBleHByZXNzaW9uIH0sIHsgY2xlYW51cDogY2xlYW51cDIgfSkgPT4ge1xuICBpZiAoc2hvdWxkU2tpcFJlZ2lzdGVyaW5nRGF0YUR1cmluZ0Nsb25lKGVsKSlcbiAgICByZXR1cm47XG4gIGV4cHJlc3Npb24gPSBleHByZXNzaW9uID09PSBcIlwiID8gXCJ7fVwiIDogZXhwcmVzc2lvbjtcbiAgbGV0IG1hZ2ljQ29udGV4dCA9IHt9O1xuICBpbmplY3RNYWdpY3MobWFnaWNDb250ZXh0LCBlbCk7XG4gIGxldCBkYXRhUHJvdmlkZXJDb250ZXh0ID0ge307XG4gIGluamVjdERhdGFQcm92aWRlcnMoZGF0YVByb3ZpZGVyQ29udGV4dCwgbWFnaWNDb250ZXh0KTtcbiAgbGV0IGRhdGEyID0gZXZhbHVhdGUoZWwsIGV4cHJlc3Npb24sIHsgc2NvcGU6IGRhdGFQcm92aWRlckNvbnRleHQgfSk7XG4gIGlmIChkYXRhMiA9PT0gdm9pZCAwIHx8IGRhdGEyID09PSB0cnVlKVxuICAgIGRhdGEyID0ge307XG4gIGluamVjdE1hZ2ljcyhkYXRhMiwgZWwpO1xuICBsZXQgcmVhY3RpdmVEYXRhID0gcmVhY3RpdmUoZGF0YTIpO1xuICBpbml0SW50ZXJjZXB0b3JzKHJlYWN0aXZlRGF0YSk7XG4gIGxldCB1bmRvID0gYWRkU2NvcGVUb05vZGUoZWwsIHJlYWN0aXZlRGF0YSk7XG4gIHJlYWN0aXZlRGF0YVtcImluaXRcIl0gJiYgZXZhbHVhdGUoZWwsIHJlYWN0aXZlRGF0YVtcImluaXRcIl0pO1xuICBjbGVhbnVwMigoKSA9PiB7XG4gICAgcmVhY3RpdmVEYXRhW1wiZGVzdHJveVwiXSAmJiBldmFsdWF0ZShlbCwgcmVhY3RpdmVEYXRhW1wiZGVzdHJveVwiXSk7XG4gICAgdW5kbygpO1xuICB9KTtcbn0pO1xuaW50ZXJjZXB0Q2xvbmUoKGZyb20sIHRvKSA9PiB7XG4gIGlmIChmcm9tLl94X2RhdGFTdGFjaykge1xuICAgIHRvLl94X2RhdGFTdGFjayA9IGZyb20uX3hfZGF0YVN0YWNrO1xuICAgIHRvLnNldEF0dHJpYnV0ZShcImRhdGEtaGFzLWFscGluZS1zdGF0ZVwiLCB0cnVlKTtcbiAgfVxufSk7XG5mdW5jdGlvbiBzaG91bGRTa2lwUmVnaXN0ZXJpbmdEYXRhRHVyaW5nQ2xvbmUoZWwpIHtcbiAgaWYgKCFpc0Nsb25pbmcpXG4gICAgcmV0dXJuIGZhbHNlO1xuICBpZiAoaXNDbG9uaW5nTGVnYWN5KVxuICAgIHJldHVybiB0cnVlO1xuICByZXR1cm4gZWwuaGFzQXR0cmlidXRlKFwiZGF0YS1oYXMtYWxwaW5lLXN0YXRlXCIpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LXNob3cuanNcbmRpcmVjdGl2ZShcInNob3dcIiwgKGVsLCB7IG1vZGlmaWVycywgZXhwcmVzc2lvbiB9LCB7IGVmZmVjdDogZWZmZWN0MyB9KSA9PiB7XG4gIGxldCBldmFsdWF0ZTIgPSBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKTtcbiAgaWYgKCFlbC5feF9kb0hpZGUpXG4gICAgZWwuX3hfZG9IaWRlID0gKCkgPT4ge1xuICAgICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgICAgZWwuc3R5bGUuc2V0UHJvcGVydHkoXCJkaXNwbGF5XCIsIFwibm9uZVwiLCBtb2RpZmllcnMuaW5jbHVkZXMoXCJpbXBvcnRhbnRcIikgPyBcImltcG9ydGFudFwiIDogdm9pZCAwKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIGlmICghZWwuX3hfZG9TaG93KVxuICAgIGVsLl94X2RvU2hvdyA9ICgpID0+IHtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGlmIChlbC5zdHlsZS5sZW5ndGggPT09IDEgJiYgZWwuc3R5bGUuZGlzcGxheSA9PT0gXCJub25lXCIpIHtcbiAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImRpc3BsYXlcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIGxldCBoaWRlID0gKCkgPT4ge1xuICAgIGVsLl94X2RvSGlkZSgpO1xuICAgIGVsLl94X2lzU2hvd24gPSBmYWxzZTtcbiAgfTtcbiAgbGV0IHNob3cgPSAoKSA9PiB7XG4gICAgZWwuX3hfZG9TaG93KCk7XG4gICAgZWwuX3hfaXNTaG93biA9IHRydWU7XG4gIH07XG4gIGxldCBjbGlja0F3YXlDb21wYXRpYmxlU2hvdyA9ICgpID0+IHNldFRpbWVvdXQoc2hvdyk7XG4gIGxldCB0b2dnbGUgPSBvbmNlKFxuICAgICh2YWx1ZSkgPT4gdmFsdWUgPyBzaG93KCkgOiBoaWRlKCksXG4gICAgKHZhbHVlKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGVsLl94X3RvZ2dsZUFuZENhc2NhZGVXaXRoVHJhbnNpdGlvbnMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBlbC5feF90b2dnbGVBbmRDYXNjYWRlV2l0aFRyYW5zaXRpb25zKGVsLCB2YWx1ZSwgc2hvdywgaGlkZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA/IGNsaWNrQXdheUNvbXBhdGlibGVTaG93KCkgOiBoaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICApO1xuICBsZXQgb2xkVmFsdWU7XG4gIGxldCBmaXJzdFRpbWUgPSB0cnVlO1xuICBlZmZlY3QzKCgpID0+IGV2YWx1YXRlMigodmFsdWUpID0+IHtcbiAgICBpZiAoIWZpcnN0VGltZSAmJiB2YWx1ZSA9PT0gb2xkVmFsdWUpXG4gICAgICByZXR1cm47XG4gICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImltbWVkaWF0ZVwiKSlcbiAgICAgIHZhbHVlID8gY2xpY2tBd2F5Q29tcGF0aWJsZVNob3coKSA6IGhpZGUoKTtcbiAgICB0b2dnbGUodmFsdWUpO1xuICAgIG9sZFZhbHVlID0gdmFsdWU7XG4gICAgZmlyc3RUaW1lID0gZmFsc2U7XG4gIH0pKTtcbn0pO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWZvci5qc1xuZGlyZWN0aXZlKFwiZm9yXCIsIChlbCwgeyBleHByZXNzaW9uIH0sIHsgZWZmZWN0OiBlZmZlY3QzLCBjbGVhbnVwOiBjbGVhbnVwMiB9KSA9PiB7XG4gIGxldCBpdGVyYXRvck5hbWVzID0gcGFyc2VGb3JFeHByZXNzaW9uKGV4cHJlc3Npb24pO1xuICBsZXQgZXZhbHVhdGVJdGVtcyA9IGV2YWx1YXRlTGF0ZXIoZWwsIGl0ZXJhdG9yTmFtZXMuaXRlbXMpO1xuICBsZXQgZXZhbHVhdGVLZXkgPSBldmFsdWF0ZUxhdGVyKFxuICAgIGVsLFxuICAgIC8vIHRoZSB4LWJpbmQ6a2V5IGV4cHJlc3Npb24gaXMgc3RvcmVkIGZvciBvdXIgdXNlIGluc3RlYWQgb2YgZXZhbHVhdGVkLlxuICAgIGVsLl94X2tleUV4cHJlc3Npb24gfHwgXCJpbmRleFwiXG4gICk7XG4gIGVsLl94X2xvb2t1cCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG4gIGVmZmVjdDMoKCkgPT4gbG9vcChlbCwgaXRlcmF0b3JOYW1lcywgZXZhbHVhdGVJdGVtcywgZXZhbHVhdGVLZXkpKTtcbiAgY2xlYW51cDIoKCkgPT4ge1xuICAgIGVsLl94X2xvb2t1cC5mb3JFYWNoKFxuICAgICAgKGVsMikgPT4gbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgICAgZGVzdHJveVRyZWUoZWwyKTtcbiAgICAgICAgZWwyLnJlbW92ZSgpO1xuICAgICAgfSlcbiAgICApO1xuICAgIGRlbGV0ZSBlbC5feF9sb29rdXA7XG4gIH0pO1xufSk7XG5mdW5jdGlvbiByZWZyZXNoU2NvcGUoc2NvcGUyKSB7XG4gIHJldHVybiAobmV3U2NvcGUpID0+IHtcbiAgICBPYmplY3QuZW50cmllcyhuZXdTY29wZSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICBzY29wZTJba2V5XSA9IHZhbHVlO1xuICAgIH0pO1xuICB9O1xufVxuZnVuY3Rpb24gbG9vcCh0ZW1wbGF0ZUVsLCBpdGVyYXRvck5hbWVzLCBldmFsdWF0ZUl0ZW1zLCBldmFsdWF0ZUtleSkge1xuICBldmFsdWF0ZUl0ZW1zKChpdGVtcykgPT4ge1xuICAgIGlmIChpc051bWVyaWMzKGl0ZW1zKSlcbiAgICAgIGl0ZW1zID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogaXRlbXMgfSwgKF8sIGkpID0+IGkgKyAxKTtcbiAgICBpZiAoaXRlbXMgPT09IHZvaWQgMClcbiAgICAgIGl0ZW1zID0gW107XG4gICAgaWYgKGl0ZW1zIGluc3RhbmNlb2YgU2V0KVxuICAgICAgaXRlbXMgPSBBcnJheS5mcm9tKGl0ZW1zKTtcbiAgICBpZiAoaXRlbXMgaW5zdGFuY2VvZiBNYXApXG4gICAgICBpdGVtcyA9IEFycmF5LmZyb20oaXRlbXMpO1xuICAgIGxldCBvbGRMb29rdXAgPSB0ZW1wbGF0ZUVsLl94X2xvb2t1cDtcbiAgICBsZXQgbG9va3VwID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbiAgICB0ZW1wbGF0ZUVsLl94X2xvb2t1cCA9IGxvb2t1cDtcbiAgICBsZXQgaGFzU3RyaW5nS2V5cyA9IGlzT2JqZWN0MihpdGVtcyk7XG4gICAgbGV0IHNjb3BlRW50cmllcyA9IE9iamVjdC5lbnRyaWVzKGl0ZW1zKS5tYXAoKFtpbmRleCwgaXRlbV0pID0+IHtcbiAgICAgIGlmICghaGFzU3RyaW5nS2V5cylcbiAgICAgICAgaW5kZXggPSBwYXJzZUludChpbmRleCk7XG4gICAgICBsZXQgc2NvcGUyID0gZ2V0SXRlcmF0aW9uU2NvcGVWYXJpYWJsZXMoaXRlcmF0b3JOYW1lcywgaXRlbSwgaW5kZXgsIGl0ZW1zKTtcbiAgICAgIGxldCBrZXk7XG4gICAgICBldmFsdWF0ZUtleSgoaW5uZXJLZXkpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbm5lcktleSA9PT0gXCJvYmplY3RcIilcbiAgICAgICAgICB3YXJuKFwieC1mb3Iga2V5IGNhbm5vdCBiZSBhbiBvYmplY3QsIGl0IG11c3QgYmUgYSBzdHJpbmcgb3IgYW4gaW50ZWdlclwiLCB0ZW1wbGF0ZUVsKTtcbiAgICAgICAgaWYgKG9sZExvb2t1cC5oYXMoaW5uZXJLZXkpKSB7XG4gICAgICAgICAgbG9va3VwLnNldChpbm5lcktleSwgb2xkTG9va3VwLmdldChpbm5lcktleSkpO1xuICAgICAgICAgIG9sZExvb2t1cC5kZWxldGUoaW5uZXJLZXkpO1xuICAgICAgICB9XG4gICAgICAgIGtleSA9IGlubmVyS2V5O1xuICAgICAgfSwgeyBzY29wZTogeyBpbmRleCwgLi4uc2NvcGUyIH0gfSk7XG4gICAgICByZXR1cm4gW2tleSwgc2NvcGUyXTtcbiAgICB9KTtcbiAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgb2xkTG9va3VwLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIGRlc3Ryb3lUcmVlKGVsKTtcbiAgICAgICAgZWwucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICAgIGxldCBhZGRlZCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG4gICAgICBsZXQgcHJldiA9IHRlbXBsYXRlRWw7XG4gICAgICBzY29wZUVudHJpZXMuZm9yRWFjaCgoW2tleSwgc2NvcGUyXSkgPT4ge1xuICAgICAgICBpZiAobG9va3VwLmhhcyhrZXkpKSB7XG4gICAgICAgICAgbGV0IGVsID0gbG9va3VwLmdldChrZXkpO1xuICAgICAgICAgIGVsLl94X3JlZnJlc2hYRm9yU2NvcGUoc2NvcGUyKTtcbiAgICAgICAgICBpZiAocHJldi5uZXh0RWxlbWVudFNpYmxpbmcgIT09IGVsKSB7XG4gICAgICAgICAgICBpZiAocHJldi5uZXh0RWxlbWVudFNpYmxpbmcpXG4gICAgICAgICAgICAgIGVsLnJlcGxhY2VXaXRoKHByZXYubmV4dEVsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgICAgIHByZXYuYWZ0ZXIoZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwcmV2ID0gZWw7XG4gICAgICAgICAgaWYgKGVsLl94X2N1cnJlbnRJZkVsKSB7XG4gICAgICAgICAgICBpZiAoZWwubmV4dEVsZW1lbnRTaWJsaW5nICE9PSBlbC5feF9jdXJyZW50SWZFbClcbiAgICAgICAgICAgICAgcHJldi5hZnRlcihlbC5feF9jdXJyZW50SWZFbCk7XG4gICAgICAgICAgICBwcmV2ID0gZWwuX3hfY3VycmVudElmRWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGVtcGxhdGVFbC5jb250ZW50LmNoaWxkcmVuLmxlbmd0aCA+IDEpXG4gICAgICAgICAgd2FybihcIngtZm9yIHRlbXBsYXRlcyByZXF1aXJlIGEgc2luZ2xlIHJvb3QgZWxlbWVudCwgYWRkaXRpb25hbCBlbGVtZW50cyB3aWxsIGJlIGlnbm9yZWQuXCIsIHRlbXBsYXRlRWwpO1xuICAgICAgICBsZXQgY2xvbmUyID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZUVsLmNvbnRlbnQsIHRydWUpLmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgICBsZXQgcmVhY3RpdmVTY29wZSA9IHJlYWN0aXZlKHNjb3BlMik7XG4gICAgICAgIGFkZFNjb3BlVG9Ob2RlKGNsb25lMiwgcmVhY3RpdmVTY29wZSwgdGVtcGxhdGVFbCk7XG4gICAgICAgIGNsb25lMi5feF9yZWZyZXNoWEZvclNjb3BlID0gcmVmcmVzaFNjb3BlKHJlYWN0aXZlU2NvcGUpO1xuICAgICAgICBsb29rdXAuc2V0KGtleSwgY2xvbmUyKTtcbiAgICAgICAgYWRkZWQuYWRkKGNsb25lMik7XG4gICAgICAgIHByZXYuYWZ0ZXIoY2xvbmUyKTtcbiAgICAgICAgcHJldiA9IGNsb25lMjtcbiAgICAgIH0pO1xuICAgICAgc2tpcER1cmluZ0Nsb25lKCgpID0+IGFkZGVkLmZvckVhY2goKGNsb25lMikgPT4gaW5pdFRyZWUoY2xvbmUyKSkpKCk7XG4gICAgfSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gcGFyc2VGb3JFeHByZXNzaW9uKGV4cHJlc3Npb24pIHtcbiAgbGV0IGZvckl0ZXJhdG9yUkUgPSAvLChbXixcXH1cXF1dKikoPzosKFteLFxcfVxcXV0qKSk/JC87XG4gIGxldCBzdHJpcFBhcmVuc1JFID0gL15cXHMqXFwofFxcKVxccyokL2c7XG4gIGxldCBmb3JBbGlhc1JFID0gLyhbXFxzXFxTXSo/KVxccysoPzppbnxvZilcXHMrKFtcXHNcXFNdKikvO1xuICBsZXQgaW5NYXRjaCA9IGV4cHJlc3Npb24ubWF0Y2goZm9yQWxpYXNSRSk7XG4gIGlmICghaW5NYXRjaClcbiAgICByZXR1cm47XG4gIGxldCByZXMgPSB7fTtcbiAgcmVzLml0ZW1zID0gaW5NYXRjaFsyXS50cmltKCk7XG4gIGxldCBpdGVtID0gaW5NYXRjaFsxXS5yZXBsYWNlKHN0cmlwUGFyZW5zUkUsIFwiXCIpLnRyaW0oKTtcbiAgbGV0IGl0ZXJhdG9yTWF0Y2ggPSBpdGVtLm1hdGNoKGZvckl0ZXJhdG9yUkUpO1xuICBpZiAoaXRlcmF0b3JNYXRjaCkge1xuICAgIHJlcy5pdGVtID0gaXRlbS5yZXBsYWNlKGZvckl0ZXJhdG9yUkUsIFwiXCIpLnRyaW0oKTtcbiAgICByZXMuaW5kZXggPSBpdGVyYXRvck1hdGNoWzFdLnRyaW0oKTtcbiAgICBpZiAoaXRlcmF0b3JNYXRjaFsyXSkge1xuICAgICAgcmVzLmNvbGxlY3Rpb24gPSBpdGVyYXRvck1hdGNoWzJdLnRyaW0oKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVzLml0ZW0gPSBpdGVtO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5mdW5jdGlvbiBnZXRJdGVyYXRpb25TY29wZVZhcmlhYmxlcyhpdGVyYXRvck5hbWVzLCBpdGVtLCBpbmRleCwgaXRlbXMpIHtcbiAgbGV0IHNjb3BlVmFyaWFibGVzID0ge307XG4gIGlmICgvXlxcWy4qXFxdJC8udGVzdChpdGVyYXRvck5hbWVzLml0ZW0pICYmIEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICBsZXQgbmFtZXMgPSBpdGVyYXRvck5hbWVzLml0ZW0ucmVwbGFjZShcIltcIiwgXCJcIikucmVwbGFjZShcIl1cIiwgXCJcIikuc3BsaXQoXCIsXCIpLm1hcCgoaSkgPT4gaS50cmltKCkpO1xuICAgIG5hbWVzLmZvckVhY2goKG5hbWUsIGkpID0+IHtcbiAgICAgIHNjb3BlVmFyaWFibGVzW25hbWVdID0gaXRlbVtpXTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICgvXlxcey4qXFx9JC8udGVzdChpdGVyYXRvck5hbWVzLml0ZW0pICYmICFBcnJheS5pc0FycmF5KGl0ZW0pICYmIHR5cGVvZiBpdGVtID09PSBcIm9iamVjdFwiKSB7XG4gICAgbGV0IG5hbWVzID0gaXRlcmF0b3JOYW1lcy5pdGVtLnJlcGxhY2UoXCJ7XCIsIFwiXCIpLnJlcGxhY2UoXCJ9XCIsIFwiXCIpLnNwbGl0KFwiLFwiKS5tYXAoKGkpID0+IGkudHJpbSgpKTtcbiAgICBuYW1lcy5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBzY29wZVZhcmlhYmxlc1tuYW1lXSA9IGl0ZW1bbmFtZV07XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgc2NvcGVWYXJpYWJsZXNbaXRlcmF0b3JOYW1lcy5pdGVtXSA9IGl0ZW07XG4gIH1cbiAgaWYgKGl0ZXJhdG9yTmFtZXMuaW5kZXgpXG4gICAgc2NvcGVWYXJpYWJsZXNbaXRlcmF0b3JOYW1lcy5pbmRleF0gPSBpbmRleDtcbiAgaWYgKGl0ZXJhdG9yTmFtZXMuY29sbGVjdGlvbilcbiAgICBzY29wZVZhcmlhYmxlc1tpdGVyYXRvck5hbWVzLmNvbGxlY3Rpb25dID0gaXRlbXM7XG4gIHJldHVybiBzY29wZVZhcmlhYmxlcztcbn1cbmZ1bmN0aW9uIGlzTnVtZXJpYzMoc3ViamVjdCkge1xuICByZXR1cm4gIUFycmF5LmlzQXJyYXkoc3ViamVjdCkgJiYgIWlzTmFOKHN1YmplY3QpO1xufVxuZnVuY3Rpb24gaXNPYmplY3QyKHN1YmplY3QpIHtcbiAgcmV0dXJuIHR5cGVvZiBzdWJqZWN0ID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHN1YmplY3QpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LXJlZi5qc1xuZnVuY3Rpb24gaGFuZGxlcjMoKSB7XG59XG5oYW5kbGVyMy5pbmxpbmUgPSAoZWwsIHsgZXhwcmVzc2lvbiB9LCB7IGNsZWFudXA6IGNsZWFudXAyIH0pID0+IHtcbiAgbGV0IHJvb3QgPSBjbG9zZXN0Um9vdChlbCk7XG4gIGlmICghcm9vdClcbiAgICByZXR1cm47XG4gIGlmICghcm9vdC5feF9yZWZzKVxuICAgIHJvb3QuX3hfcmVmcyA9IHt9O1xuICByb290Ll94X3JlZnNbZXhwcmVzc2lvbl0gPSBlbDtcbiAgY2xlYW51cDIoKCkgPT4gZGVsZXRlIHJvb3QuX3hfcmVmc1tleHByZXNzaW9uXSk7XG59O1xuZGlyZWN0aXZlKFwicmVmXCIsIGhhbmRsZXIzKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1pZi5qc1xuZGlyZWN0aXZlKFwiaWZcIiwgKGVsLCB7IGV4cHJlc3Npb24gfSwgeyBlZmZlY3Q6IGVmZmVjdDMsIGNsZWFudXA6IGNsZWFudXAyIH0pID0+IHtcbiAgaWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gXCJ0ZW1wbGF0ZVwiKVxuICAgIHdhcm4oXCJ4LWlmIGNhbiBvbmx5IGJlIHVzZWQgb24gYSA8dGVtcGxhdGU+IHRhZ1wiLCBlbCk7XG4gIGxldCBldmFsdWF0ZTIgPSBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKTtcbiAgbGV0IHNob3cgPSAoKSA9PiB7XG4gICAgaWYgKGVsLl94X2N1cnJlbnRJZkVsKVxuICAgICAgcmV0dXJuIGVsLl94X2N1cnJlbnRJZkVsO1xuICAgIGxldCBjbG9uZTIgPSBlbC5jb250ZW50LmNsb25lTm9kZSh0cnVlKS5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICBhZGRTY29wZVRvTm9kZShjbG9uZTIsIHt9LCBlbCk7XG4gICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgIGVsLmFmdGVyKGNsb25lMik7XG4gICAgICBza2lwRHVyaW5nQ2xvbmUoKCkgPT4gaW5pdFRyZWUoY2xvbmUyKSkoKTtcbiAgICB9KTtcbiAgICBlbC5feF9jdXJyZW50SWZFbCA9IGNsb25lMjtcbiAgICBlbC5feF91bmRvSWYgPSAoKSA9PiB7XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBkZXN0cm95VHJlZShjbG9uZTIpO1xuICAgICAgICBjbG9uZTIucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICAgIGRlbGV0ZSBlbC5feF9jdXJyZW50SWZFbDtcbiAgICB9O1xuICAgIHJldHVybiBjbG9uZTI7XG4gIH07XG4gIGxldCBoaWRlID0gKCkgPT4ge1xuICAgIGlmICghZWwuX3hfdW5kb0lmKVxuICAgICAgcmV0dXJuO1xuICAgIGVsLl94X3VuZG9JZigpO1xuICAgIGRlbGV0ZSBlbC5feF91bmRvSWY7XG4gIH07XG4gIGVmZmVjdDMoKCkgPT4gZXZhbHVhdGUyKCh2YWx1ZSkgPT4ge1xuICAgIHZhbHVlID8gc2hvdygpIDogaGlkZSgpO1xuICB9KSk7XG4gIGNsZWFudXAyKCgpID0+IGVsLl94X3VuZG9JZiAmJiBlbC5feF91bmRvSWYoKSk7XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1pZC5qc1xuZGlyZWN0aXZlKFwiaWRcIiwgKGVsLCB7IGV4cHJlc3Npb24gfSwgeyBldmFsdWF0ZTogZXZhbHVhdGUyIH0pID0+IHtcbiAgbGV0IG5hbWVzID0gZXZhbHVhdGUyKGV4cHJlc3Npb24pO1xuICBuYW1lcy5mb3JFYWNoKChuYW1lKSA9PiBzZXRJZFJvb3QoZWwsIG5hbWUpKTtcbn0pO1xuaW50ZXJjZXB0Q2xvbmUoKGZyb20sIHRvKSA9PiB7XG4gIGlmIChmcm9tLl94X2lkcykge1xuICAgIHRvLl94X2lkcyA9IGZyb20uX3hfaWRzO1xuICB9XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1vbi5qc1xubWFwQXR0cmlidXRlcyhzdGFydGluZ1dpdGgoXCJAXCIsIGludG8ocHJlZml4KFwib246XCIpKSkpO1xuZGlyZWN0aXZlKFwib25cIiwgc2tpcER1cmluZ0Nsb25lKChlbCwgeyB2YWx1ZSwgbW9kaWZpZXJzLCBleHByZXNzaW9uIH0sIHsgY2xlYW51cDogY2xlYW51cDIgfSkgPT4ge1xuICBsZXQgZXZhbHVhdGUyID0gZXhwcmVzc2lvbiA/IGV2YWx1YXRlTGF0ZXIoZWwsIGV4cHJlc3Npb24pIDogKCkgPT4ge1xuICB9O1xuICBpZiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcInRlbXBsYXRlXCIpIHtcbiAgICBpZiAoIWVsLl94X2ZvcndhcmRFdmVudHMpXG4gICAgICBlbC5feF9mb3J3YXJkRXZlbnRzID0gW107XG4gICAgaWYgKCFlbC5feF9mb3J3YXJkRXZlbnRzLmluY2x1ZGVzKHZhbHVlKSlcbiAgICAgIGVsLl94X2ZvcndhcmRFdmVudHMucHVzaCh2YWx1ZSk7XG4gIH1cbiAgbGV0IHJlbW92ZUxpc3RlbmVyID0gb24oZWwsIHZhbHVlLCBtb2RpZmllcnMsIChlKSA9PiB7XG4gICAgZXZhbHVhdGUyKCgpID0+IHtcbiAgICB9LCB7IHNjb3BlOiB7IFwiJGV2ZW50XCI6IGUgfSwgcGFyYW1zOiBbZV0gfSk7XG4gIH0pO1xuICBjbGVhbnVwMigoKSA9PiByZW1vdmVMaXN0ZW5lcigpKTtcbn0pKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMvaW5kZXguanNcbndhcm5NaXNzaW5nUGx1Z2luRGlyZWN0aXZlKFwiQ29sbGFwc2VcIiwgXCJjb2xsYXBzZVwiLCBcImNvbGxhcHNlXCIpO1xud2Fybk1pc3NpbmdQbHVnaW5EaXJlY3RpdmUoXCJJbnRlcnNlY3RcIiwgXCJpbnRlcnNlY3RcIiwgXCJpbnRlcnNlY3RcIik7XG53YXJuTWlzc2luZ1BsdWdpbkRpcmVjdGl2ZShcIkZvY3VzXCIsIFwidHJhcFwiLCBcImZvY3VzXCIpO1xud2Fybk1pc3NpbmdQbHVnaW5EaXJlY3RpdmUoXCJNYXNrXCIsIFwibWFza1wiLCBcIm1hc2tcIik7XG5mdW5jdGlvbiB3YXJuTWlzc2luZ1BsdWdpbkRpcmVjdGl2ZShuYW1lLCBkaXJlY3RpdmVOYW1lLCBzbHVnKSB7XG4gIGRpcmVjdGl2ZShkaXJlY3RpdmVOYW1lLCAoZWwpID0+IHdhcm4oYFlvdSBjYW4ndCB1c2UgW3gtJHtkaXJlY3RpdmVOYW1lfV0gd2l0aG91dCBmaXJzdCBpbnN0YWxsaW5nIHRoZSBcIiR7bmFtZX1cIiBwbHVnaW4gaGVyZTogaHR0cHM6Ly9hbHBpbmVqcy5kZXYvcGx1Z2lucy8ke3NsdWd9YCwgZWwpKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2luZGV4LmpzXG5hbHBpbmVfZGVmYXVsdC5zZXRFdmFsdWF0b3Iobm9ybWFsRXZhbHVhdG9yKTtcbmFscGluZV9kZWZhdWx0LnNldFJhd0V2YWx1YXRvcihub3JtYWxSYXdFdmFsdWF0b3IpO1xuYWxwaW5lX2RlZmF1bHQuc2V0UmVhY3Rpdml0eUVuZ2luZSh7IHJlYWN0aXZlOiByZWFjdGl2ZTIsIGVmZmVjdDogZWZmZWN0MiwgcmVsZWFzZTogc3RvcCwgcmF3OiB0b1JhdyB9KTtcbnZhciBzcmNfZGVmYXVsdCA9IGFscGluZV9kZWZhdWx0O1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9idWlsZHMvbW9kdWxlLmpzXG52YXIgbW9kdWxlX2RlZmF1bHQgPSBzcmNfZGVmYXVsdDtcbmV4cG9ydCB7XG4gIHNyY19kZWZhdWx0IGFzIEFscGluZSxcbiAgbW9kdWxlX2RlZmF1bHQgYXMgZGVmYXVsdFxufTtcbiIsIi8vIEB0cy1ub2NoZWNrXG5pbXBvcnQgQWxwaW5lIGZyb20gJ2FscGluZWpzJztcbmV4cG9ydCAqIGZyb20gJ2FscGluZWpzJztcbmV4cG9ydCBkZWZhdWx0IEFscGluZTtcbiJdLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMF0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFJLGVBQWU7QUFDbkIsSUFBSSxXQUFXO0FBQ2YsSUFBSSxRQUFRLENBQUM7QUFDYixJQUFJLG1CQUFtQjtBQUN2QixJQUFJLG9CQUFvQjtBQUN4QixTQUFTLFVBQVUsVUFBVTtDQUMzQixTQUFTLFFBQVE7QUFDbkI7QUFDQSxTQUFTLG1CQUFtQjtDQUMxQixvQkFBb0I7QUFDdEI7QUFDQSxTQUFTLG9CQUFvQjtDQUMzQixvQkFBb0I7Q0FDcEIsV0FBVztBQUNiO0FBQ0EsU0FBUyxTQUFTLEtBQUs7Q0FDckIsSUFBSSxDQUFDLE1BQU0sU0FBUyxHQUFHLEdBQ3JCLE1BQU0sS0FBSyxHQUFHO0NBQ2hCLFdBQVc7QUFDYjtBQUNB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