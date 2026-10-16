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
//#region ../node_modules/motion-utils/dist/es/array.mjs
function addUniqueItem(arr, item) {
	if (arr.indexOf(item) === -1) arr.push(item);
}
function removeItem(arr, item) {
	const index = arr.indexOf(item);
	if (index > -1) arr.splice(index, 1);
}

//#endregion
//#region ../node_modules/motion-utils/dist/es/clamp.mjs
const clamp = (min, max, v) => {
	if (v > max) return max;
	if (v < min) return min;
	return v;
};

//#endregion
//#region ../node_modules/motion-utils/dist/es/format-error-message.mjs
function formatErrorMessage(message, errorCode) {
	return errorCode ? `${message}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${errorCode}` : message;
}

//#endregion
//#region ../node_modules/motion-utils/dist/es/errors.mjs
let warning = () => {};
let invariant = () => {};
if (typeof process !== "undefined" && true) {
	warning = (check, message, errorCode) => {
		if (!check && typeof console !== "undefined") console.warn(formatErrorMessage(message, errorCode));
	};
	invariant = (check, message, errorCode) => {
		if (!check) throw new Error(formatErrorMessage(message, errorCode));
	};
}

//#endregion
//#region ../node_modules/motion-utils/dist/es/global-config.mjs
const MotionGlobalConfig = {};

//#endregion
//#region ../node_modules/motion-utils/dist/es/is-numerical-string.mjs
/**
* Check if value is a numerical string, ie a string that is purely a number eg "100" or "-100.1"
*/
const isNumericalString = (v) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);

//#endregion
//#region ../node_modules/motion-utils/dist/es/is-object.mjs
const isObject = (value) => typeof value === "object" && value !== null;

//#endregion
//#region ../node_modules/motion-utils/dist/es/is-zero-value-string.mjs
/**
* Check if the value is a zero value string like "0px" or "0%"
*/
const isZeroValueString = (v) => /^0[^.\s]+$/u.test(v);

//#endregion
//#region ../node_modules/motion-utils/dist/es/memo.mjs
/*#__NO_SIDE_EFFECTS__*/
function memo(callback) {
	let result;
	return () => {
		if (result === void 0) result = callback();
		return result;
	};
}

//#endregion
//#region ../node_modules/motion-utils/dist/es/noop.mjs
const noop = /* @__NO_SIDE_EFFECTS__ */ (any) => any;

//#endregion
//#region ../node_modules/motion-utils/dist/es/pipe.mjs
/**
* Pipe
* Compose other transformers to run linearily
* pipe(min(20), max(40))
* @param  {...functions} transformers
* @return {function}
*/
const pipe = (...transformers) => transformers.reduce((a, b) => (v) => b(a(v)));

//#endregion
//#region ../node_modules/motion-utils/dist/es/progress.mjs
const progress = /* @__NO_SIDE_EFFECTS__ */ (from, to, value) => {
	const range = to - from;
	return range ? (value - from) / range : 1;
};

//#endregion
//#region ../node_modules/motion-utils/dist/es/subscription-manager.mjs
var SubscriptionManager = class {
	constructor() {
		this.subscriptions = [];
	}
	add(handler) {
		addUniqueItem(this.subscriptions, handler);
		return () => removeItem(this.subscriptions, handler);
	}
	notify(a, b, c) {
		const numSubscriptions = this.subscriptions.length;
		if (!numSubscriptions) return;
		if (numSubscriptions === 1)
 /**
		* If there's only a single handler we can just call it without invoking a loop.
		*/
		this.subscriptions[0](a, b, c);
		else for (let i = 0; i < numSubscriptions; i++) {
			/**
			* Check whether the handler exists before firing as it's possible
			* the subscriptions were modified during this loop running.
			*/
			const handler = this.subscriptions[i];
			handler && handler(a, b, c);
		}
	}
	getSize() {
		return this.subscriptions.length;
	}
	clear() {
		this.subscriptions.length = 0;
	}
};

//#endregion
//#region ../node_modules/motion-utils/dist/es/time-conversion.mjs
/**
* Converts seconds to milliseconds
*
* @param seconds - Time in seconds.
* @return milliseconds - Converted time in milliseconds.
*/
const secondsToMilliseconds = /* @__NO_SIDE_EFFECTS__ */ (seconds) => seconds * 1e3;
const millisecondsToSeconds = /* @__NO_SIDE_EFFECTS__ */ (milliseconds) => milliseconds / 1e3;

//#endregion
//#region ../node_modules/motion-utils/dist/es/velocity-per-second.mjs
const velocityPerSecond = /* @__NO_SIDE_EFFECTS__ */ (velocity, frameDuration) => frameDuration ? velocity * (1e3 / frameDuration) : 0;

//#endregion
//#region ../node_modules/motion-utils/dist/es/warn-once.mjs
const warned = /* @__PURE__ */ new Set();
function warnOnce(condition, message, errorCode) {
	if (condition || warned.has(message)) return;
	console.warn(formatErrorMessage(message, errorCode));
	warned.add(message);
}

//#endregion
//#region ../node_modules/motion-utils/dist/es/wrap.mjs
const wrap = (min, max, v) => {
	const rangeSize = max - min;
	return ((v - min) % rangeSize + rangeSize) % rangeSize + min;
};

//#endregion
//#region ../node_modules/motion-utils/dist/es/easing/cubic-bezier.mjs
const calcBezier = (t, a1, a2) => (((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t + 3 * a1) * t;
const subdivisionPrecision = 1e-7;
const subdivisionMaxIterations = 12;
function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
	let currentX;
	let currentT;
	let i = 0;
	do {
		currentT = lowerBound + (upperBound - lowerBound) / 2;
		currentX = calcBezier(currentT, mX1, mX2) - x;
		if (currentX > 0) upperBound = currentT;
		else lowerBound = currentT;
	} while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
	return currentT;
}
/*#__NO_SIDE_EFFECTS__*/
function cubicBezier(mX1, mY1, mX2, mY2) {
	if (mX1 === mY1 && mX2 === mY2) return noop;
	const getTForX = (aX) => binarySubdivide(aX, 0, 1, mX1, mX2);
	return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
}

//#endregion
//#region ../node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs
const mirrorEasing = /* @__NO_SIDE_EFFECTS__ */ (easing) => (p) => p <= .5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;

//#endregion
//#region ../node_modules/motion-utils/dist/es/easing/modifiers/reverse.mjs
const reverseEasing = /* @__NO_SIDE_EFFECTS__ */ (easing) => (p) => 1 - easing(1 - p);

//#endregion
//#region ../node_modules/motion-utils/dist/es/easing/back.mjs
const backOut = /*@__PURE__*/ cubicBezier(.33, 1.53, .69, .99);
const backIn = /*@__PURE__*/ reverseEasing(backOut);
const backInOut = /*@__PURE__*/ mirrorEasing(backIn);

//#endregion
//#region ../node_modules/motion-utils/dist/es/easing/anticipate.mjs
const anticipate = (p) => p >= 1 ? 1 : (p *= 2) < 1 ? .5 * backIn(p) : .5 * (2 - Math.pow(2, -10 * (p - 1)));

//#endregion
//#region ../node_modules/motion-utils/dist/es/easing/circ.mjs
const circIn = (p) => 1 - Math.sin(Math.acos(p));
const circOut = reverseEasing(circIn);
const circInOut = mirrorEasing(circIn);

//#endregion
//#region ../node_modules/motion-utils/dist/es/easing/ease.mjs
const easeIn = /*@__PURE__*/ cubicBezier(.42, 0, 1, 1);
const easeOut = /*@__PURE__*/ cubicBezier(0, 0, .58, 1);
const easeInOut = /*@__PURE__*/ cubicBezier(.42, 0, .58, 1);

//#endregion
//#region ../node_modules/motion-utils/dist/es/easing/utils/is-easing-array.mjs
const isEasingArray = /* @__NO_SIDE_EFFECTS__ */ (ease) => {
	return Array.isArray(ease) && typeof ease[0] !== "number";
};

//#endregion
//#region ../node_modules/motion-utils/dist/es/easing/utils/get-easing-for-segment.mjs
/*#__NO_SIDE_EFFECTS__*/
function getEasingForSegment(easing, i) {
	return isEasingArray(easing) ? easing[wrap(0, easing.length, i)] : easing;
}

//#endregion
//#region ../node_modules/motion-utils/dist/es/easing/utils/is-bezier-definition.mjs
const isBezierDefinition = /* @__NO_SIDE_EFFECTS__ */ (easing) => Array.isArray(easing) && typeof easing[0] === "number";

//#endregion
//#region ../node_modules/motion-utils/dist/es/easing/utils/map.mjs
const easingLookup = {
	linear: noop,
	easeIn,
	easeInOut,
	easeOut,
	circIn,
	circInOut,
	circOut,
	backIn,
	backInOut,
	backOut,
	anticipate
};
const isValidEasing = (easing) => {
	return typeof easing === "string";
};
const easingDefinitionToFunction = (definition) => {
	if (isBezierDefinition(definition)) {
		invariant(definition.length === 4, `Cubic bezier arrays must contain four numerical values.`, "cubic-bezier-length");
		const [x1, y1, x2, y2] = definition;
		return cubicBezier(x1, y1, x2, y2);
	} else if (isValidEasing(definition)) {
		invariant(easingLookup[definition] !== void 0, `Invalid easing type '${definition}'`, "invalid-easing-type");
		return easingLookup[definition];
	}
	return definition;
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/frameloop/order.mjs
const stepsOrder = [
	"setup",
	"read",
	"resolveKeyframes",
	"preUpdate",
	"update",
	"preRender",
	"render",
	"postRender"
];

//#endregion
//#region ../node_modules/motion-dom/dist/es/stats/buffer.mjs
const statsBuffer = {
	value: null,
	addProjectionMetrics: null
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/frameloop/render-step.mjs
function createRenderStep(runNextFrame, stepName) {
	/**
	* We create and reuse two queues, one to queue jobs for the current frame
	* and one for the next. We reuse to avoid triggering GC after x frames.
	*/
	let thisFrame = /* @__PURE__ */ new Set();
	let nextFrame = /* @__PURE__ */ new Set();
	/**
	* Track whether we're currently processing jobs in this step. This way
	* we can decide whether to schedule new jobs for this frame or next.
	*/
	let isProcessing = false;
	let flushNextFrame = false;
	/**
	* A set of processes which were marked keepAlive when scheduled.
	*/
	const toKeepAlive = /* @__PURE__ */ new WeakSet();
	let latestFrameData = {
		delta: 0,
		timestamp: 0,
		isProcessing: false
	};
	let numCalls = 0;
	function triggerCallback(callback) {
		if (toKeepAlive.has(callback)) {
			step.schedule(callback);
			runNextFrame();
		}
		numCalls++;
		callback(latestFrameData);
	}
	const step = {
		/**
		* Schedule a process to run on the next frame.
		*/
		schedule: (callback, keepAlive = false, immediate = false) => {
			const queue = immediate && isProcessing ? thisFrame : nextFrame;
			if (keepAlive) toKeepAlive.add(callback);
			queue.add(callback);
			return callback;
		},
		/**
		* Cancel the provided callback from running on the next frame.
		*/
		cancel: (callback) => {
			nextFrame.delete(callback);
			toKeepAlive.delete(callback);
		},
		/**
		* Execute all schedule callbacks.
		*/
		process: (frameData) => {
			latestFrameData = frameData;
			/**
			* If we're already processing we've probably been triggered by a flushSync
			* inside an existing process. Instead of executing, mark flushNextFrame
			* as true and ensure we flush the following frame at the end of this one.
			*/
			if (isProcessing) {
				flushNextFrame = true;
				return;
			}
			isProcessing = true;
			const prevFrame = thisFrame;
			thisFrame = nextFrame;
			nextFrame = prevFrame;
			thisFrame.forEach(triggerCallback);
			/**
			* If we're recording stats then
			*/
			if (stepName && statsBuffer.value) statsBuffer.value.frameloop[stepName].push(numCalls);
			numCalls = 0;
			thisFrame.clear();
			isProcessing = false;
			if (flushNextFrame) {
				flushNextFrame = false;
				step.process(frameData);
			}
		}
	};
	return step;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/frameloop/batcher.mjs
const maxElapsed$1 = 40;
function createRenderBatcher(scheduleNextBatch, allowKeepAlive) {
	let runNextFrame = false;
	let useDefaultElapsed = true;
	const state = {
		delta: 0,
		timestamp: 0,
		isProcessing: false
	};
	const flagRunNextFrame = () => runNextFrame = true;
	const steps = stepsOrder.reduce((acc, key) => {
		acc[key] = createRenderStep(flagRunNextFrame, allowKeepAlive ? key : void 0);
		return acc;
	}, {});
	const { setup, read, resolveKeyframes, preUpdate, update, preRender, render, postRender } = steps;
	const processBatch = () => {
		const useManualTiming = MotionGlobalConfig.useManualTiming;
		const timestamp = useManualTiming ? state.timestamp : performance.now();
		runNextFrame = false;
		if (!useManualTiming) state.delta = useDefaultElapsed ? 1e3 / 60 : Math.max(Math.min(timestamp - state.timestamp, maxElapsed$1), 1);
		state.timestamp = timestamp;
		state.isProcessing = true;
		setup.process(state);
		read.process(state);
		resolveKeyframes.process(state);
		preUpdate.process(state);
		update.process(state);
		preRender.process(state);
		render.process(state);
		postRender.process(state);
		state.isProcessing = false;
		if (runNextFrame && allowKeepAlive) {
			useDefaultElapsed = false;
			scheduleNextBatch(processBatch);
		}
	};
	const wake = () => {
		runNextFrame = true;
		useDefaultElapsed = true;
		if (!state.isProcessing) scheduleNextBatch(processBatch);
	};
	const schedule = stepsOrder.reduce((acc, key) => {
		const step = steps[key];
		acc[key] = (process, keepAlive = false, immediate = false) => {
			if (!runNextFrame) wake();
			return step.schedule(process, keepAlive, immediate);
		};
		return acc;
	}, {});
	const cancel = (process) => {
		for (let i = 0; i < stepsOrder.length; i++) steps[stepsOrder[i]].cancel(process);
	};
	return {
		schedule,
		cancel,
		state,
		steps
	};
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/frameloop/frame.mjs
const { schedule: frame, cancel: cancelFrame, state: frameData, steps: frameSteps } = /* @__PURE__ */ createRenderBatcher(typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : noop, true);

//#endregion
//#region ../node_modules/motion-dom/dist/es/frameloop/sync-time.mjs
let now;
function clearTime() {
	now = void 0;
}
/**
* An eventloop-synchronous alternative to performance.now().
*
* Ensures that time measurements remain consistent within a synchronous context.
* Usually calling performance.now() twice within the same synchronous context
* will return different values which isn't useful for animations when we're usually
* trying to sync animations to the same frame.
*/
const time = {
	now: () => {
		if (now === void 0) time.set(frameData.isProcessing || MotionGlobalConfig.useManualTiming ? frameData.timestamp : performance.now());
		return now;
	},
	set: (newTime) => {
		now = newTime;
		queueMicrotask(clearTime);
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/stats/animation-count.mjs
const activeAnimations = {
	layout: 0,
	mainThread: 0,
	waapi: 0
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/utils/is-css-variable.mjs
const checkStringStartsWith = (token) => (key) => typeof key === "string" && key.startsWith(token);
const isCSSVariableName = /*@__PURE__*/ checkStringStartsWith("--");
const startsAsVariableToken = /*@__PURE__*/ checkStringStartsWith("var(--");
const isCSSVariableToken = (value) => {
	if (!startsAsVariableToken(value)) return false;
	return singleCssVariableRegex.test(value.split("/*")[0].trim());
};
const singleCssVariableRegex = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
/**
* Check if a value contains a CSS variable anywhere (e.g. inside calc()).
* Unlike isCSSVariableToken which checks if the value IS a var() token,
* this checks if the value CONTAINS var() somewhere in the string.
*/
function containsCSSVariable(value) {
	if (typeof value !== "string") return false;
	return value.split("/*")[0].includes("var(--");
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/numbers/index.mjs
const number = {
	test: (v) => typeof v === "number",
	parse: parseFloat,
	transform: (v) => v
};
const alpha = {
	...number,
	transform: (v) => clamp(0, 1, v)
};
const scale = {
	...number,
	default: 1
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/utils/sanitize.mjs
const sanitize = (v) => Math.round(v * 1e5) / 1e5;

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/utils/float-regex.mjs
const floatRegex = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/utils/is-nullish.mjs
function isNullish(v) {
	return v == null;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/utils/single-color-regex.mjs
const singleColorRegex = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/color/utils.mjs
/**
* Returns true if the provided string is a color, ie rgba(0,0,0,0) or #000,
* but false if a number or multiple colors
*/
const isColorString = (type, testProp) => (v) => {
	return Boolean(typeof v === "string" && singleColorRegex.test(v) && v.startsWith(type) || testProp && !isNullish(v) && Object.prototype.hasOwnProperty.call(v, testProp));
};
const splitColor = (aName, bName, cName) => (v) => {
	if (typeof v !== "string") return v;
	const [a, b, c, alpha] = v.match(floatRegex);
	return {
		[aName]: parseFloat(a),
		[bName]: parseFloat(b),
		[cName]: parseFloat(c),
		alpha: alpha !== void 0 ? parseFloat(alpha) : 1
	};
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/color/rgba.mjs
const clampRgbUnit = (v) => clamp(0, 255, v);
const rgbUnit = {
	...number,
	transform: (v) => Math.round(clampRgbUnit(v))
};
const rgba = {
	test: /*@__PURE__*/ isColorString("rgb", "red"),
	parse: /*@__PURE__*/ splitColor("red", "green", "blue"),
	transform: ({ red, green, blue, alpha: alpha$1 = 1 }) => "rgba(" + rgbUnit.transform(red) + ", " + rgbUnit.transform(green) + ", " + rgbUnit.transform(blue) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/color/hex.mjs
function parseHex(v) {
	let r = "";
	let g = "";
	let b = "";
	let a = "";
	if (v.length > 5) {
		r = v.substring(1, 3);
		g = v.substring(3, 5);
		b = v.substring(5, 7);
		a = v.substring(7, 9);
	} else {
		r = v.substring(1, 2);
		g = v.substring(2, 3);
		b = v.substring(3, 4);
		a = v.substring(4, 5);
		r += r;
		g += g;
		b += b;
		a += a;
	}
	return {
		red: parseInt(r, 16),
		green: parseInt(g, 16),
		blue: parseInt(b, 16),
		alpha: a ? parseInt(a, 16) / 255 : 1
	};
}
const hex = {
	test: /*@__PURE__*/ isColorString("#"),
	parse: parseHex,
	transform: rgba.transform
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/numbers/units.mjs
const createUnitType = /* @__NO_SIDE_EFFECTS__ */ (unit) => ({
	test: (v) => typeof v === "string" && v.endsWith(unit) && v.split(" ").length === 1,
	parse: parseFloat,
	transform: (v) => `${v}${unit}`
});
const degrees = /*@__PURE__*/ createUnitType("deg");
const percent = /*@__PURE__*/ createUnitType("%");
const px = /*@__PURE__*/ createUnitType("px");
const vh = /*@__PURE__*/ createUnitType("vh");
const vw = /*@__PURE__*/ createUnitType("vw");
const progressPercentage = /*@__PURE__*/ (() => ({
	...percent,
	parse: (v) => percent.parse(v) / 100,
	transform: (v) => percent.transform(v * 100)
}))();

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/color/hsla.mjs
const hsla = {
	test: /*@__PURE__*/ isColorString("hsl", "hue"),
	parse: /*@__PURE__*/ splitColor("hue", "saturation", "lightness"),
	transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
		return "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/color/index.mjs
const color = {
	test: (v) => rgba.test(v) || hex.test(v) || hsla.test(v),
	parse: (v) => {
		if (rgba.test(v)) return rgba.parse(v);
		else if (hsla.test(v)) return hsla.parse(v);
		else return hex.parse(v);
	},
	transform: (v) => {
		return typeof v === "string" ? v : v.hasOwnProperty("red") ? rgba.transform(v) : hsla.transform(v);
	},
	getAnimatableNone: (v) => {
		const parsed = color.parse(v);
		parsed.alpha = 0;
		return color.transform(parsed);
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/utils/color-regex.mjs
const colorRegex = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/complex/index.mjs
function test(v) {
	return isNaN(v) && typeof v === "string" && (v.match(floatRegex)?.length || 0) + (v.match(colorRegex)?.length || 0) > 0;
}
const NUMBER_TOKEN = "number";
const COLOR_TOKEN = "color";
const VAR_TOKEN = "var";
const VAR_FUNCTION_TOKEN = "var(";
const SPLIT_TOKEN = "${}";
const complexRegex = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function analyseComplexValue(value) {
	const originalValue = value.toString();
	const values = [];
	const indexes = {
		color: [],
		number: [],
		var: []
	};
	const types = [];
	let i = 0;
	return {
		values,
		split: originalValue.replace(complexRegex, (parsedValue) => {
			if (color.test(parsedValue)) {
				indexes.color.push(i);
				types.push(COLOR_TOKEN);
				values.push(color.parse(parsedValue));
			} else if (parsedValue.startsWith(VAR_FUNCTION_TOKEN)) {
				indexes.var.push(i);
				types.push(VAR_TOKEN);
				values.push(parsedValue);
			} else {
				indexes.number.push(i);
				types.push(NUMBER_TOKEN);
				values.push(parseFloat(parsedValue));
			}
			++i;
			return SPLIT_TOKEN;
		}).split(SPLIT_TOKEN),
		indexes,
		types
	};
}
function parseComplexValue(v) {
	return analyseComplexValue(v).values;
}
function buildTransformer({ split, types }) {
	const numSections = split.length;
	return (v) => {
		let output = "";
		for (let i = 0; i < numSections; i++) {
			output += split[i];
			if (v[i] !== void 0) {
				const type = types[i];
				if (type === NUMBER_TOKEN) output += sanitize(v[i]);
				else if (type === COLOR_TOKEN) output += color.transform(v[i]);
				else output += v[i];
			}
		}
		return output;
	};
}
function createTransformer(source) {
	return buildTransformer(analyseComplexValue(source));
}
const convertNumbersToZero = (v) => typeof v === "number" ? 0 : color.test(v) ? color.getAnimatableNone(v) : v;
/**
* Convert a parsed value to its zero equivalent, but preserve numbers
* that act as divisors in CSS calc() expressions.
*
* analyseComplexValue extracts numbers from CSS strings and puts the
* surrounding text into a `split` template array. For example:
*   "calc(var(--gap) / 5)"  →  values: [var(--gap), 5]
*                               split:  ["calc(", " / ", ")"]
*
* When building a zero-equivalent for animation, naively zeroing all
* numbers turns the divisor into 0 → "calc(var(--gap) / 0)" → NaN.
* We detect this by checking whether the text preceding a number
* (split[i]) ends with "/" — the CSS calc division operator.
*/
const convertToZero = (value, splitBefore) => {
	if (typeof value === "number") return splitBefore?.trim().endsWith("/") ? value : 0;
	return convertNumbersToZero(value);
};
function getAnimatableNone$1(v) {
	const info = analyseComplexValue(v);
	return buildTransformer(info)(info.values.map((value, i) => convertToZero(value, info.split[i])));
}
const complex = {
	test,
	parse: parseComplexValue,
	createTransformer,
	getAnimatableNone: getAnimatableNone$1
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/color/hsla-to-rgba.mjs
function hueToRgb(p, q, t) {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
}
function hslaToRgba({ hue, saturation, lightness, alpha }) {
	hue /= 360;
	saturation /= 100;
	lightness /= 100;
	let red = 0;
	let green = 0;
	let blue = 0;
	if (!saturation) red = green = blue = lightness;
	else {
		const q = lightness < .5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
		const p = 2 * lightness - q;
		red = hueToRgb(p, q, hue + 1 / 3);
		green = hueToRgb(p, q, hue);
		blue = hueToRgb(p, q, hue - 1 / 3);
	}
	return {
		red: Math.round(red * 255),
		green: Math.round(green * 255),
		blue: Math.round(blue * 255),
		alpha
	};
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/utils/mix/immediate.mjs
function mixImmediate(a, b) {
	return (p) => p > 0 ? b : a;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/utils/mix/number.mjs
const mixNumber$1 = (from, to, progress) => {
	return from + (to - from) * progress;
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/utils/mix/color.mjs
const mixLinearColor = (from, to, v) => {
	const fromExpo = from * from;
	const expo = v * (to * to - fromExpo) + fromExpo;
	return expo < 0 ? 0 : Math.sqrt(expo);
};
const colorTypes = [
	hex,
	rgba,
	hsla
];
const getColorType = (v) => colorTypes.find((type) => type.test(v));
function asRGBA(color) {
	const type = getColorType(color);
	warning(Boolean(type), `'${color}' is not an animatable color. Use the equivalent color code instead.`, "color-not-animatable");
	if (!Boolean(type)) return false;
	let model = type.parse(color);
	if (type === hsla) model = hslaToRgba(model);
	return model;
}
const mixColor = (from, to) => {
	const fromRGBA = asRGBA(from);
	const toRGBA = asRGBA(to);
	if (!fromRGBA || !toRGBA) return mixImmediate(from, to);
	const blended = { ...fromRGBA };
	return (v) => {
		blended.red = mixLinearColor(fromRGBA.red, toRGBA.red, v);
		blended.green = mixLinearColor(fromRGBA.green, toRGBA.green, v);
		blended.blue = mixLinearColor(fromRGBA.blue, toRGBA.blue, v);
		blended.alpha = mixNumber$1(fromRGBA.alpha, toRGBA.alpha, v);
		return rgba.transform(blended);
	};
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/utils/mix/visibility.mjs
const invisibleValues = /* @__PURE__ */ new Set(["none", "hidden"]);
/**
* Returns a function that, when provided a progress value between 0 and 1,
* will return the "none" or "hidden" string only when the progress is that of
* the origin or target.
*/
function mixVisibility(origin, target) {
	if (invisibleValues.has(origin)) return (p) => p <= 0 ? origin : target;
	else return (p) => p >= 1 ? target : origin;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/utils/mix/complex.mjs
function mixNumber(a, b) {
	return (p) => mixNumber$1(a, b, p);
}
function getMixer(a) {
	if (typeof a === "number") return mixNumber;
	else if (typeof a === "string") return isCSSVariableToken(a) ? mixImmediate : color.test(a) ? mixColor : mixComplex;
	else if (Array.isArray(a)) return mixArray;
	else if (typeof a === "object") return color.test(a) ? mixColor : mixObject;
	return mixImmediate;
}
function mixArray(a, b) {
	const output = [...a];
	const numValues = output.length;
	const blendValue = a.map((v, i) => getMixer(v)(v, b[i]));
	return (p) => {
		for (let i = 0; i < numValues; i++) output[i] = blendValue[i](p);
		return output;
	};
}
function mixObject(a, b) {
	const output = {
		...a,
		...b
	};
	const blendValue = {};
	for (const key in output) if (a[key] !== void 0 && b[key] !== void 0) blendValue[key] = getMixer(a[key])(a[key], b[key]);
	return (v) => {
		for (const key in blendValue) output[key] = blendValue[key](v);
		return output;
	};
}
function matchOrder(origin, target) {
	const orderedOrigin = [];
	const pointers = {
		color: 0,
		var: 0,
		number: 0
	};
	for (let i = 0; i < target.values.length; i++) {
		const type = target.types[i];
		const originIndex = origin.indexes[type][pointers[type]];
		const originValue = origin.values[originIndex] ?? 0;
		orderedOrigin[i] = originValue;
		pointers[type]++;
	}
	return orderedOrigin;
}
const mixComplex = (origin, target) => {
	const template = complex.createTransformer(target);
	const originStats = analyseComplexValue(origin);
	const targetStats = analyseComplexValue(target);
	if (originStats.indexes.var.length === targetStats.indexes.var.length && originStats.indexes.color.length === targetStats.indexes.color.length && originStats.indexes.number.length >= targetStats.indexes.number.length) {
		if (invisibleValues.has(origin) && !targetStats.values.length || invisibleValues.has(target) && !originStats.values.length) return mixVisibility(origin, target);
		return pipe(mixArray(matchOrder(originStats, targetStats), targetStats.values), template);
	} else {
		warning(true, `Complex values '${origin}' and '${target}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`, "complex-values-different");
		return mixImmediate(origin, target);
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/utils/mix/index.mjs
function mix(from, to, p) {
	if (typeof from === "number" && typeof to === "number" && typeof p === "number") return mixNumber$1(from, to, p);
	return getMixer(from)(from, to);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/drivers/frame.mjs
const frameloopDriver = (update) => {
	const passTimestamp = ({ timestamp }) => update(timestamp);
	return {
		start: (keepAlive = true) => frame.update(passTimestamp, keepAlive),
		stop: () => cancelFrame(passTimestamp),
		/**
		* If we're processing this frame we can use the
		* framelocked timestamp to keep things in sync.
		*/
		now: () => frameData.isProcessing ? frameData.timestamp : time.now()
	};
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/waapi/utils/linear.mjs
const generateLinearEasing = (easing, duration, resolution = 10) => {
	let points = "";
	const numPoints = Math.max(Math.round(duration / resolution), 2);
	for (let i = 0; i < numPoints; i++) points += Math.round(easing(i / (numPoints - 1)) * 1e4) / 1e4 + ", ";
	return `linear(${points.substring(0, points.length - 2)})`;
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/generators/utils/calc-duration.mjs
/**
* Implement a practical max duration for keyframe generation
* to prevent infinite loops
*/
const maxGeneratorDuration = 2e4;
function calcGeneratorDuration(generator) {
	let duration = 0;
	const timeStep = 50;
	let state = generator.next(duration);
	while (!state.done && duration < 2e4) {
		duration += timeStep;
		state = generator.next(duration);
	}
	return duration >= 2e4 ? Infinity : duration;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/generators/utils/create-generator-easing.mjs
/**
* Create a progress => progress easing function from a generator.
*/
function createGeneratorEasing(options, scale = 100, createGenerator) {
	const generator = createGenerator({
		...options,
		keyframes: [0, scale]
	});
	const duration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
	return {
		type: "keyframes",
		ease: (progress) => {
			return generator.next(duration * progress).value / scale;
		},
		duration: millisecondsToSeconds(duration)
	};
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/generators/spring.mjs
const springDefaults = {
	stiffness: 100,
	damping: 10,
	mass: 1,
	velocity: 0,
	duration: 800,
	bounce: .3,
	visualDuration: .3,
	restSpeed: {
		granular: .01,
		default: 2
	},
	restDelta: {
		granular: .005,
		default: .5
	},
	minDuration: .01,
	maxDuration: 10,
	minDamping: .05,
	maxDamping: 1
};
function calcAngularFreq(undampedFreq, dampingRatio) {
	return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
}
const rootIterations = 12;
function approximateRoot(envelope, derivative, initialGuess) {
	let result = initialGuess;
	for (let i = 1; i < rootIterations; i++) result = result - envelope(result) / derivative(result);
	return result;
}
/**
* This is ported from the Framer implementation of duration-based spring resolution.
*/
const safeMin = .001;
function findSpring({ duration = springDefaults.duration, bounce = springDefaults.bounce, velocity = springDefaults.velocity, mass = springDefaults.mass }) {
	let envelope;
	let derivative;
	warning(duration <= secondsToMilliseconds(springDefaults.maxDuration), "Spring duration must be 10 seconds or less", "spring-duration-limit");
	let dampingRatio = 1 - bounce;
	/**
	* Restrict dampingRatio and duration to within acceptable ranges.
	*/
	dampingRatio = clamp(springDefaults.minDamping, springDefaults.maxDamping, dampingRatio);
	duration = clamp(springDefaults.minDuration, springDefaults.maxDuration, millisecondsToSeconds(duration));
	if (dampingRatio < 1) {
		/**
		* Underdamped spring
		*/
		envelope = (undampedFreq) => {
			const exponentialDecay = undampedFreq * dampingRatio;
			const delta = exponentialDecay * duration;
			const a = exponentialDecay - velocity;
			const b = calcAngularFreq(undampedFreq, dampingRatio);
			const c = Math.exp(-delta);
			return safeMin - a / b * c;
		};
		derivative = (undampedFreq) => {
			const delta = undampedFreq * dampingRatio * duration;
			const d = delta * velocity + velocity;
			const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq, 2) * duration;
			const f = Math.exp(-delta);
			const g = calcAngularFreq(Math.pow(undampedFreq, 2), dampingRatio);
			return (-envelope(undampedFreq) + safeMin > 0 ? -1 : 1) * ((d - e) * f) / g;
		};
	} else {
		/**
		* Critically-damped spring
		*/
		envelope = (undampedFreq) => {
			return -.001 + Math.exp(-undampedFreq * duration) * ((undampedFreq - velocity) * duration + 1);
		};
		derivative = (undampedFreq) => {
			return Math.exp(-undampedFreq * duration) * ((velocity - undampedFreq) * (duration * duration));
		};
	}
	const initialGuess = 5 / duration;
	const undampedFreq = approximateRoot(envelope, derivative, initialGuess);
	duration = secondsToMilliseconds(duration);
	if (isNaN(undampedFreq)) return {
		stiffness: springDefaults.stiffness,
		damping: springDefaults.damping,
		duration
	};
	else {
		const stiffness = Math.pow(undampedFreq, 2) * mass;
		return {
			stiffness,
			damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
			duration
		};
	}
}
const durationKeys = ["duration", "bounce"];
const physicsKeys = [
	"stiffness",
	"damping",
	"mass"
];
function isSpringType(options, keys) {
	return keys.some((key) => options[key] !== void 0);
}
function getSpringOptions(options) {
	let springOptions = {
		velocity: springDefaults.velocity,
		stiffness: springDefaults.stiffness,
		damping: springDefaults.damping,
		mass: springDefaults.mass,
		isResolvedFromDuration: false,
		...options
	};
	if (!isSpringType(options, physicsKeys) && isSpringType(options, durationKeys)) {
		springOptions.velocity = 0;
		if (options.visualDuration) {
			const visualDuration = options.visualDuration;
			const root = 2 * Math.PI / (visualDuration * 1.2);
			const stiffness = root * root;
			const damping = 2 * clamp(.05, 1, 1 - (options.bounce || 0)) * Math.sqrt(stiffness);
			springOptions = {
				...springOptions,
				mass: springDefaults.mass,
				stiffness,
				damping
			};
		} else {
			const derived = findSpring({
				...options,
				velocity: 0
			});
			springOptions = {
				...springOptions,
				...derived,
				mass: springDefaults.mass
			};
			springOptions.isResolvedFromDuration = true;
		}
	}
	return springOptions;
}
function spring(optionsOrVisualDuration = springDefaults.visualDuration, bounce = springDefaults.bounce) {
	const options = typeof optionsOrVisualDuration !== "object" ? {
		visualDuration: optionsOrVisualDuration,
		keyframes: [0, 1],
		bounce
	} : optionsOrVisualDuration;
	let { restSpeed, restDelta } = options;
	const origin = options.keyframes[0];
	const target = options.keyframes[options.keyframes.length - 1];
	/**
	* This is the Iterator-spec return value. We ensure it's mutable rather than using a generator
	* to reduce GC during animation.
	*/
	const state = {
		done: false,
		value: origin
	};
	const { stiffness, damping, mass, duration, velocity, isResolvedFromDuration } = getSpringOptions({
		...options,
		velocity: -millisecondsToSeconds(options.velocity || 0)
	});
	const initialVelocity = velocity || 0;
	const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
	const initialDelta = target - origin;
	const undampedAngularFreq = millisecondsToSeconds(Math.sqrt(stiffness / mass));
	/**
	* If we're working on a granular scale, use smaller defaults for determining
	* when the spring is finished.
	*
	* These defaults have been selected emprically based on what strikes a good
	* ratio between feeling good and finishing as soon as changes are imperceptible.
	*/
	const isGranularScale = Math.abs(initialDelta) < 5;
	restSpeed || (restSpeed = isGranularScale ? springDefaults.restSpeed.granular : springDefaults.restSpeed.default);
	restDelta || (restDelta = isGranularScale ? springDefaults.restDelta.granular : springDefaults.restDelta.default);
	let resolveSpring;
	let resolveVelocity;
	let angularFreq;
	let A;
	let sinCoeff;
	let cosCoeff;
	if (dampingRatio < 1) {
		angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
		A = (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq;
		resolveSpring = (t) => {
			const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
			return target - envelope * (A * Math.sin(angularFreq * t) + initialDelta * Math.cos(angularFreq * t));
		};
		sinCoeff = dampingRatio * undampedAngularFreq * A + initialDelta * angularFreq;
		cosCoeff = dampingRatio * undampedAngularFreq * initialDelta - A * angularFreq;
		resolveVelocity = (t) => {
			return Math.exp(-dampingRatio * undampedAngularFreq * t) * (sinCoeff * Math.sin(angularFreq * t) + cosCoeff * Math.cos(angularFreq * t));
		};
	} else if (dampingRatio === 1) {
		resolveSpring = (t) => target - Math.exp(-undampedAngularFreq * t) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t);
		const C = initialVelocity + undampedAngularFreq * initialDelta;
		resolveVelocity = (t) => Math.exp(-undampedAngularFreq * t) * (undampedAngularFreq * C * t - initialVelocity);
	} else {
		const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
		resolveSpring = (t) => {
			const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
			const freqForT = Math.min(dampedAngularFreq * t, 300);
			return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) + dampedAngularFreq * initialDelta * Math.cosh(freqForT)) / dampedAngularFreq;
		};
		const P = (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / dampedAngularFreq;
		const sinhCoeff = dampingRatio * undampedAngularFreq * P - initialDelta * dampedAngularFreq;
		const coshCoeff = dampingRatio * undampedAngularFreq * initialDelta - P * dampedAngularFreq;
		resolveVelocity = (t) => {
			const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
			const freqForT = Math.min(dampedAngularFreq * t, 300);
			return envelope * (sinhCoeff * Math.sinh(freqForT) + coshCoeff * Math.cosh(freqForT));
		};
	}
	const generator = {
		calculatedDuration: isResolvedFromDuration ? duration || null : null,
		velocity: (t) => secondsToMilliseconds(resolveVelocity(t)),
		next: (t) => {
			/**
			* For underdamped physics springs we need both position and
			* velocity each tick. Compute shared trig values once to avoid
			* duplicate Math.exp/sin/cos calls on the hot path.
			*/
			if (!isResolvedFromDuration && dampingRatio < 1) {
				const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
				const sin = Math.sin(angularFreq * t);
				const cos = Math.cos(angularFreq * t);
				const current = target - envelope * (A * sin + initialDelta * cos);
				const currentVelocity = secondsToMilliseconds(envelope * (sinCoeff * sin + cosCoeff * cos));
				state.done = Math.abs(currentVelocity) <= restSpeed && Math.abs(target - current) <= restDelta;
				state.value = state.done ? target : current;
				return state;
			}
			const current = resolveSpring(t);
			if (!isResolvedFromDuration) {
				const currentVelocity = secondsToMilliseconds(resolveVelocity(t));
				state.done = Math.abs(currentVelocity) <= restSpeed && Math.abs(target - current) <= restDelta;
			} else state.done = t >= duration;
			state.value = state.done ? target : current;
			return state;
		},
		toString: () => {
			const calculatedDuration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
			const easing = generateLinearEasing((progress) => generator.next(calculatedDuration * progress).value, calculatedDuration, 30);
			return calculatedDuration + "ms " + easing;
		},
		toTransition: () => {}
	};
	return generator;
}
spring.applyToOptions = (options) => {
	const generatorOptions = createGeneratorEasing(options, 100, spring);
	options.ease = generatorOptions.ease;
	options.duration = secondsToMilliseconds(generatorOptions.duration);
	options.type = "keyframes";
	return options;
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/generators/utils/velocity.mjs
const velocitySampleDuration = 5;
function getGeneratorVelocity(resolveValue, t, current) {
	const prevT = Math.max(t - velocitySampleDuration, 0);
	return velocityPerSecond(current - resolveValue(prevT), t - prevT);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/generators/inertia.mjs
function inertia({ keyframes, velocity = 0, power = .8, timeConstant = 325, bounceDamping = 10, bounceStiffness = 500, modifyTarget, min, max, restDelta = .5, restSpeed }) {
	const origin = keyframes[0];
	const state = {
		done: false,
		value: origin
	};
	const isOutOfBounds = (v) => min !== void 0 && v < min || max !== void 0 && v > max;
	const nearestBoundary = (v) => {
		if (min === void 0) return max;
		if (max === void 0) return min;
		return Math.abs(min - v) < Math.abs(max - v) ? min : max;
	};
	let amplitude = power * velocity;
	const ideal = origin + amplitude;
	const target = modifyTarget === void 0 ? ideal : modifyTarget(ideal);
	/**
	* If the target has changed we need to re-calculate the amplitude, otherwise
	* the animation will start from the wrong position.
	*/
	if (target !== ideal) amplitude = target - origin;
	const calcDelta = (t) => -amplitude * Math.exp(-t / timeConstant);
	const calcLatest = (t) => target + calcDelta(t);
	const applyFriction = (t) => {
		const delta = calcDelta(t);
		const latest = calcLatest(t);
		state.done = Math.abs(delta) <= restDelta;
		state.value = state.done ? target : latest;
	};
	/**
	* Ideally this would resolve for t in a stateless way, we could
	* do that by always precalculating the animation but as we know
	* this will be done anyway we can assume that spring will
	* be discovered during that.
	*/
	let timeReachedBoundary;
	let spring$1;
	const checkCatchBoundary = (t) => {
		if (!isOutOfBounds(state.value)) return;
		timeReachedBoundary = t;
		spring$1 = spring({
			keyframes: [state.value, nearestBoundary(state.value)],
			velocity: getGeneratorVelocity(calcLatest, t, state.value),
			damping: bounceDamping,
			stiffness: bounceStiffness,
			restDelta,
			restSpeed
		});
	};
	checkCatchBoundary(0);
	return {
		calculatedDuration: null,
		next: (t) => {
			/**
			* We need to resolve the friction to figure out if we need a
			* spring but we don't want to do this twice per frame. So here
			* we flag if we updated for this frame and later if we did
			* we can skip doing it again.
			*/
			let hasUpdatedFrame = false;
			if (!spring$1 && timeReachedBoundary === void 0) {
				hasUpdatedFrame = true;
				applyFriction(t);
				checkCatchBoundary(t);
			}
			/**
			* If we have a spring and the provided t is beyond the moment the friction
			* animation crossed the min/max boundary, use the spring.
			*/
			if (timeReachedBoundary !== void 0 && t >= timeReachedBoundary) return spring$1.next(t - timeReachedBoundary);
			else {
				!hasUpdatedFrame && applyFriction(t);
				return state;
			}
		}
	};
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/utils/interpolate.mjs
function createMixers(output, ease, customMixer) {
	const mixers = [];
	const mixerFactory = customMixer || MotionGlobalConfig.mix || mix;
	const numMixers = output.length - 1;
	for (let i = 0; i < numMixers; i++) {
		let mixer = mixerFactory(output[i], output[i + 1]);
		if (ease) {
			const easingFunction = Array.isArray(ease) ? ease[i] || noop : ease;
			mixer = pipe(easingFunction, mixer);
		}
		mixers.push(mixer);
	}
	return mixers;
}
/**
* Create a function that maps from a numerical input array to a generic output array.
*
* Accepts:
*   - Numbers
*   - Colors (hex, hsl, hsla, rgb, rgba)
*   - Complex (combinations of one or more numbers or strings)
*
* ```jsx
* const mixColor = interpolate([0, 1], ['#fff', '#000'])
*
* mixColor(0.5) // 'rgba(128, 128, 128, 1)'
* ```
*
* TODO Revisit this approach once we've moved to data models for values,
* probably not needed to pregenerate mixer functions.
*
* @public
*/
function interpolate(input, output, { clamp: isClamp = true, ease, mixer } = {}) {
	const inputLength = input.length;
	invariant(inputLength === output.length, "Both input and output ranges must be the same length", "range-length");
	/**
	* If we're only provided a single input, we can just make a function
	* that returns the output.
	*/
	if (inputLength === 1) return () => output[0];
	if (inputLength === 2 && output[0] === output[1]) return () => output[1];
	const isZeroDeltaRange = input[0] === input[1];
	if (input[0] > input[inputLength - 1]) {
		input = [...input].reverse();
		output = [...output].reverse();
	}
	const mixers = createMixers(output, ease, mixer);
	const numMixers = mixers.length;
	const interpolator = (v) => {
		if (isZeroDeltaRange && v < input[0]) return output[0];
		let i = 0;
		if (numMixers > 1) {
			for (; i < input.length - 2; i++) if (v < input[i + 1]) break;
		}
		const progressInRange = progress(input[i], input[i + 1], v);
		return mixers[i](progressInRange);
	};
	return isClamp ? (v) => interpolator(clamp(input[0], input[inputLength - 1], v)) : interpolator;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/keyframes/offsets/fill.mjs
function fillOffset(offset, remaining) {
	const min = offset[offset.length - 1];
	for (let i = 1; i <= remaining; i++) {
		const offsetProgress = progress(0, remaining, i);
		offset.push(mixNumber$1(min, 1, offsetProgress));
	}
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/keyframes/offsets/default.mjs
function defaultOffset$1(arr) {
	const offset = [0];
	fillOffset(offset, arr.length - 1);
	return offset;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/keyframes/offsets/time.mjs
function convertOffsetToTimes(offset, duration) {
	return offset.map((o) => o * duration);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/generators/keyframes.mjs
function defaultEasing(values, easing) {
	return values.map(() => easing || easeInOut).splice(0, values.length - 1);
}
function keyframes({ duration = 300, keyframes: keyframeValues, times, ease = "easeInOut" }) {
	/**
	* Easing functions can be externally defined as strings. Here we convert them
	* into actual functions.
	*/
	const easingFunctions = isEasingArray(ease) ? ease.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease);
	/**
	* This is the Iterator-spec return value. We ensure it's mutable rather than using a generator
	* to reduce GC during animation.
	*/
	const state = {
		done: false,
		value: keyframeValues[0]
	};
	/**
	* Create a times array based on the provided 0-1 offsets
	*/
	const absoluteTimes = convertOffsetToTimes(times && times.length === keyframeValues.length ? times : defaultOffset$1(keyframeValues), duration);
	const mapTimeToKeyframe = interpolate(absoluteTimes, keyframeValues, { ease: Array.isArray(easingFunctions) ? easingFunctions : defaultEasing(keyframeValues, easingFunctions) });
	return {
		calculatedDuration: duration,
		next: (t) => {
			state.value = mapTimeToKeyframe(t);
			state.done = t >= duration;
			return state;
		}
	};
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/keyframes/get-final.mjs
const isNotNull$1 = (value) => value !== null;
function getFinalKeyframe$1(keyframes, { repeat, repeatType = "loop" }, finalKeyframe, speed = 1) {
	const resolvedKeyframes = keyframes.filter(isNotNull$1);
	const index = speed < 0 || repeat && repeatType !== "loop" && repeat % 2 === 1 ? 0 : resolvedKeyframes.length - 1;
	return !index || finalKeyframe === void 0 ? resolvedKeyframes[index] : finalKeyframe;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/utils/replace-transition-type.mjs
const transitionTypeMap = {
	decay: inertia,
	inertia,
	tween: keyframes,
	keyframes,
	spring
};
function replaceTransitionType(transition) {
	if (typeof transition.type === "string") transition.type = transitionTypeMap[transition.type];
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/utils/WithPromise.mjs
var WithPromise = class {
	constructor() {
		this.updateFinished();
	}
	get finished() {
		return this._finished;
	}
	updateFinished() {
		this._finished = new Promise((resolve) => {
			this.resolve = resolve;
		});
	}
	notifyFinished() {
		this.resolve();
	}
	/**
	* Allows the animation to be awaited.
	*
	* @deprecated Use `finished` instead.
	*/
	then(onResolve, onReject) {
		return this.finished.then(onResolve, onReject);
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/JSAnimation.mjs
const percentToProgress = (percent) => percent / 100;
var JSAnimation = class extends WithPromise {
	constructor(options) {
		super();
		this.state = "idle";
		this.startTime = null;
		this.isStopped = false;
		/**
		* The current time of the animation.
		*/
		this.currentTime = 0;
		/**
		* The time at which the animation was paused.
		*/
		this.holdTime = null;
		/**
		* Playback speed as a factor. 0 would be stopped, -1 reverse and 2 double speed.
		*/
		this.playbackSpeed = 1;
		/**
		* This method is bound to the instance to fix a pattern where
		* animation.stop is returned as a reference from a useEffect.
		*/
		this.stop = () => {
			const { motionValue } = this.options;
			if (motionValue && motionValue.updatedAt !== time.now()) this.tick(time.now());
			this.isStopped = true;
			if (this.state === "idle") return;
			this.teardown();
			this.options.onStop?.();
		};
		activeAnimations.mainThread++;
		this.options = options;
		this.initAnimation();
		this.play();
		if (options.autoplay === false) this.pause();
	}
	initAnimation() {
		const { options } = this;
		replaceTransitionType(options);
		const { type = keyframes, repeat = 0, repeatDelay = 0, repeatType, velocity = 0 } = options;
		let { keyframes: keyframes$1 } = options;
		const generatorFactory = type || keyframes;
		if (generatorFactory !== keyframes) invariant(keyframes$1.length <= 2, `Only two keyframes currently supported with spring and inertia animations. Trying to animate ${keyframes$1}`, "spring-two-frames");
		if (generatorFactory !== keyframes && typeof keyframes$1[0] !== "number") {
			this.mixKeyframes = pipe(percentToProgress, mix(keyframes$1[0], keyframes$1[1]));
			keyframes$1 = [0, 100];
		}
		const generator = generatorFactory({
			...options,
			keyframes: keyframes$1
		});
		/**
		* If we have a mirror repeat type we need to create a second generator that outputs the
		* mirrored (not reversed) animation and later ping pong between the two generators.
		*/
		if (repeatType === "mirror") this.mirroredGenerator = generatorFactory({
			...options,
			keyframes: [...keyframes$1].reverse(),
			velocity: -velocity
		});
		/**
		* If duration is undefined and we have repeat options,
		* we need to calculate a duration from the generator.
		*
		* We set it to the generator itself to cache the duration.
		* Any timeline resolver will need to have already precalculated
		* the duration by this step.
		*/
		if (generator.calculatedDuration === null) generator.calculatedDuration = calcGeneratorDuration(generator);
		const { calculatedDuration } = generator;
		this.calculatedDuration = calculatedDuration;
		this.resolvedDuration = calculatedDuration + repeatDelay;
		this.totalDuration = this.resolvedDuration * (repeat + 1) - repeatDelay;
		this.generator = generator;
	}
	updateTime(timestamp) {
		const animationTime = Math.round(timestamp - this.startTime) * this.playbackSpeed;
		if (this.holdTime !== null) this.currentTime = this.holdTime;
		else this.currentTime = animationTime;
	}
	tick(timestamp, sample = false) {
		const { generator, totalDuration, mixKeyframes, mirroredGenerator, resolvedDuration, calculatedDuration } = this;
		if (this.startTime === null) return generator.next(0);
		const { delay = 0, keyframes, repeat, repeatType, repeatDelay, type, onUpdate, finalKeyframe } = this.options;
		/**
		* requestAnimationFrame timestamps can come through as lower than
		* the startTime as set by performance.now(). Here we prevent this,
		* though in the future it could be possible to make setting startTime
		* a pending operation that gets resolved here.
		*/
		if (this.speed > 0) this.startTime = Math.min(this.startTime, timestamp);
		else if (this.speed < 0) this.startTime = Math.min(timestamp - totalDuration / this.speed, this.startTime);
		if (sample) this.currentTime = timestamp;
		else this.updateTime(timestamp);
		const timeWithoutDelay = this.currentTime - delay * (this.playbackSpeed >= 0 ? 1 : -1);
		const isInDelayPhase = this.playbackSpeed >= 0 ? timeWithoutDelay < 0 : timeWithoutDelay > totalDuration;
		this.currentTime = Math.max(timeWithoutDelay, 0);
		if (this.state === "finished" && this.holdTime === null) this.currentTime = totalDuration;
		let elapsed = this.currentTime;
		let frameGenerator = generator;
		if (repeat) {
			/**
			* Get the current progress (0-1) of the animation. If t is >
			* than duration we'll get values like 2.5 (midway through the
			* third iteration)
			*/
			const progress = Math.min(this.currentTime, totalDuration) / resolvedDuration;
			/**
			* Get the current iteration (0 indexed). For instance the floor of
			* 2.5 is 2.
			*/
			let currentIteration = Math.floor(progress);
			/**
			* Get the current progress of the iteration by taking the remainder
			* so 2.5 is 0.5 through iteration 2
			*/
			let iterationProgress = progress % 1;
			/**
			* If iteration progress is 1 we count that as the end
			* of the previous iteration.
			*/
			if (!iterationProgress && progress >= 1) iterationProgress = 1;
			iterationProgress === 1 && currentIteration--;
			currentIteration = Math.min(currentIteration, repeat + 1);
			if (Boolean(currentIteration % 2)) {
				if (repeatType === "reverse") {
					iterationProgress = 1 - iterationProgress;
					if (repeatDelay) iterationProgress -= repeatDelay / resolvedDuration;
				} else if (repeatType === "mirror") frameGenerator = mirroredGenerator;
			}
			elapsed = clamp(0, 1, iterationProgress) * resolvedDuration;
		}
		/**
		* If we're in negative time, set state as the initial keyframe.
		* This prevents delay: x, duration: 0 animations from finishing
		* instantly.
		*/
		const state = isInDelayPhase ? {
			done: false,
			value: keyframes[0]
		} : frameGenerator.next(elapsed);
		if (mixKeyframes && !isInDelayPhase) state.value = mixKeyframes(state.value);
		let { done } = state;
		if (!isInDelayPhase && calculatedDuration !== null) done = this.playbackSpeed >= 0 ? this.currentTime >= totalDuration : this.currentTime <= 0;
		const isAnimationFinished = this.holdTime === null && (this.state === "finished" || this.state === "running" && done);
		if (isAnimationFinished && type !== inertia) state.value = getFinalKeyframe$1(keyframes, this.options, finalKeyframe, this.speed);
		if (onUpdate) onUpdate(state.value);
		if (isAnimationFinished) this.finish();
		return state;
	}
	/**
	* Allows the returned animation to be awaited or promise-chained. Currently
	* resolves when the animation finishes at all but in a future update could/should
	* reject if its cancels.
	*/
	then(resolve, reject) {
		return this.finished.then(resolve, reject);
	}
	get duration() {
		return millisecondsToSeconds(this.calculatedDuration);
	}
	get iterationDuration() {
		const { delay = 0 } = this.options || {};
		return this.duration + millisecondsToSeconds(delay);
	}
	get time() {
		return millisecondsToSeconds(this.currentTime);
	}
	set time(newTime) {
		newTime = secondsToMilliseconds(newTime);
		this.currentTime = newTime;
		if (this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0) this.holdTime = newTime;
		else if (this.driver) this.startTime = this.driver.now() - newTime / this.playbackSpeed;
		if (this.driver) this.driver.start(false);
		else {
			this.startTime = 0;
			this.state = "paused";
			this.holdTime = newTime;
			this.tick(newTime);
		}
	}
	/**
	* Returns the generator's velocity at the current time in units/second.
	* Uses the analytical derivative when available (springs), avoiding
	* the MotionValue's frame-dependent velocity estimation.
	*/
	getGeneratorVelocity() {
		const t = this.currentTime;
		if (t <= 0) return this.options.velocity || 0;
		if (this.generator.velocity) return this.generator.velocity(t);
		const current = this.generator.next(t).value;
		return getGeneratorVelocity((s) => this.generator.next(s).value, t, current);
	}
	get speed() {
		return this.playbackSpeed;
	}
	set speed(newSpeed) {
		const hasChanged = this.playbackSpeed !== newSpeed;
		if (hasChanged && this.driver) this.updateTime(time.now());
		this.playbackSpeed = newSpeed;
		if (hasChanged && this.driver) this.time = millisecondsToSeconds(this.currentTime);
	}
	play() {
		if (this.isStopped) return;
		const { driver = frameloopDriver, startTime } = this.options;
		if (!this.driver) this.driver = driver((timestamp) => this.tick(timestamp));
		this.options.onPlay?.();
		const now = this.driver.now();
		if (this.state === "finished") {
			this.updateFinished();
			this.startTime = now;
		} else if (this.holdTime !== null) this.startTime = now - this.holdTime;
		else if (!this.startTime) this.startTime = startTime ?? now;
		if (this.state === "finished" && this.speed < 0) this.startTime += this.calculatedDuration;
		this.holdTime = null;
		/**
		* Set playState to running only after we've used it in
		* the previous logic.
		*/
		this.state = "running";
		this.driver.start();
	}
	pause() {
		this.state = "paused";
		this.updateTime(time.now());
		this.holdTime = this.currentTime;
	}
	complete() {
		if (this.state !== "running") this.play();
		this.state = "finished";
		this.holdTime = null;
	}
	finish() {
		this.notifyFinished();
		this.teardown();
		this.state = "finished";
		this.options.onComplete?.();
	}
	cancel() {
		this.holdTime = null;
		this.startTime = 0;
		this.tick(0);
		this.teardown();
		this.options.onCancel?.();
	}
	teardown() {
		this.state = "idle";
		this.stopDriver();
		this.startTime = this.holdTime = null;
		activeAnimations.mainThread--;
	}
	stopDriver() {
		if (!this.driver) return;
		this.driver.stop();
		this.driver = void 0;
	}
	sample(sampleTime) {
		this.startTime = 0;
		return this.tick(sampleTime, true);
	}
	attachTimeline(timeline) {
		if (this.options.allowFlatten) {
			this.options.type = "keyframes";
			this.options.ease = "linear";
			this.initAnimation();
		}
		this.driver?.stop();
		return timeline.observe(this);
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/keyframes/utils/fill-wildcards.mjs
function fillWildcards(keyframes) {
	for (let i = 1; i < keyframes.length; i++) keyframes[i] ?? (keyframes[i] = keyframes[i - 1]);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/dom/parse-transform.mjs
const radToDeg = (rad) => rad * 180 / Math.PI;
const rotate = (v) => {
	const angle = radToDeg(Math.atan2(v[1], v[0]));
	return rebaseAngle(angle);
};
const matrix2dParsers = {
	x: 4,
	y: 5,
	translateX: 4,
	translateY: 5,
	scaleX: 0,
	scaleY: 3,
	scale: (v) => (Math.abs(v[0]) + Math.abs(v[3])) / 2,
	rotate,
	rotateZ: rotate,
	skewX: (v) => radToDeg(Math.atan(v[1])),
	skewY: (v) => radToDeg(Math.atan(v[2])),
	skew: (v) => (Math.abs(v[1]) + Math.abs(v[2])) / 2
};
const rebaseAngle = (angle) => {
	angle = angle % 360;
	if (angle < 0) angle += 360;
	return angle;
};
const rotateZ = rotate;
const scaleX = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
const scaleY = (v) => Math.sqrt(v[4] * v[4] + v[5] * v[5]);
const matrix3dParsers = {
	x: 12,
	y: 13,
	z: 14,
	translateX: 12,
	translateY: 13,
	translateZ: 14,
	scaleX,
	scaleY,
	scale: (v) => (scaleX(v) + scaleY(v)) / 2,
	rotateX: (v) => rebaseAngle(radToDeg(Math.atan2(v[6], v[5]))),
	rotateY: (v) => rebaseAngle(radToDeg(Math.atan2(-v[2], v[0]))),
	rotateZ,
	rotate: rotateZ,
	skewX: (v) => radToDeg(Math.atan(v[4])),
	skewY: (v) => radToDeg(Math.atan(v[1])),
	skew: (v) => (Math.abs(v[1]) + Math.abs(v[4])) / 2
};
function defaultTransformValue(name) {
	return name.includes("scale") ? 1 : 0;
}
function parseValueFromTransform(transform, name) {
	if (!transform || transform === "none") return defaultTransformValue(name);
	const matrix3dMatch = transform.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
	let parsers;
	let match;
	if (matrix3dMatch) {
		parsers = matrix3dParsers;
		match = matrix3dMatch;
	} else {
		const matrix2dMatch = transform.match(/^matrix\(([-\d.e\s,]+)\)$/u);
		parsers = matrix2dParsers;
		match = matrix2dMatch;
	}
	if (!match) return defaultTransformValue(name);
	const valueParser = parsers[name];
	const values = match[1].split(",").map(convertTransformToNumber);
	return typeof valueParser === "function" ? valueParser(values) : values[valueParser];
}
const readTransformValue = (instance, name) => {
	const { transform = "none" } = getComputedStyle(instance);
	return parseValueFromTransform(transform, name);
};
function convertTransformToNumber(value) {
	return parseFloat(value.trim());
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/utils/keys-transform.mjs
/**
* Generate a list of every possible transform key.
*/
const transformPropOrder = [
	"transformPerspective",
	"x",
	"y",
	"z",
	"translateX",
	"translateY",
	"translateZ",
	"scale",
	"scaleX",
	"scaleY",
	"rotate",
	"rotateX",
	"rotateY",
	"rotateZ",
	"skew",
	"skewX",
	"skewY"
];
/**
* A quick lookup for transform props.
*/
const transformProps = /*@__PURE__*/ (() => new Set(transformPropOrder))();

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/keyframes/utils/unit-conversion.mjs
const isNumOrPxType = (v) => v === number || v === px;
const transformKeys = /* @__PURE__ */ new Set([
	"x",
	"y",
	"z"
]);
const nonTranslationalTransformKeys = transformPropOrder.filter((key) => !transformKeys.has(key));
function removeNonTranslationalTransform(visualElement) {
	const removedTransforms = [];
	nonTranslationalTransformKeys.forEach((key) => {
		const value = visualElement.getValue(key);
		if (value !== void 0) {
			removedTransforms.push([key, value.get()]);
			value.set(key.startsWith("scale") ? 1 : 0);
		}
	});
	return removedTransforms;
}
const positionalValues = {
	width: ({ x }, { paddingLeft = "0", paddingRight = "0", boxSizing }) => {
		const width = x.max - x.min;
		return boxSizing === "border-box" ? width : width - parseFloat(paddingLeft) - parseFloat(paddingRight);
	},
	height: ({ y }, { paddingTop = "0", paddingBottom = "0", boxSizing }) => {
		const height = y.max - y.min;
		return boxSizing === "border-box" ? height : height - parseFloat(paddingTop) - parseFloat(paddingBottom);
	},
	top: (_bbox, { top }) => parseFloat(top),
	left: (_bbox, { left }) => parseFloat(left),
	bottom: ({ y }, { top }) => parseFloat(top) + (y.max - y.min),
	right: ({ x }, { left }) => parseFloat(left) + (x.max - x.min),
	x: (_bbox, { transform }) => parseValueFromTransform(transform, "x"),
	y: (_bbox, { transform }) => parseValueFromTransform(transform, "y")
};
positionalValues.translateX = positionalValues.x;
positionalValues.translateY = positionalValues.y;

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/keyframes/KeyframesResolver.mjs
const toResolve = /* @__PURE__ */ new Set();
let isScheduled = false;
let anyNeedsMeasurement = false;
let isForced = false;
function measureAllKeyframes() {
	if (anyNeedsMeasurement) {
		const resolversToMeasure = Array.from(toResolve).filter((resolver) => resolver.needsMeasurement);
		const elementsToMeasure = new Set(resolversToMeasure.map((resolver) => resolver.element));
		const transformsToRestore = /* @__PURE__ */ new Map();
		/**
		* Write pass
		* If we're measuring elements we want to remove bounding box-changing transforms.
		*/
		elementsToMeasure.forEach((element) => {
			const removedTransforms = removeNonTranslationalTransform(element);
			if (!removedTransforms.length) return;
			transformsToRestore.set(element, removedTransforms);
			element.render();
		});
		resolversToMeasure.forEach((resolver) => resolver.measureInitialState());
		elementsToMeasure.forEach((element) => {
			element.render();
			const restore = transformsToRestore.get(element);
			if (restore) restore.forEach(([key, value]) => {
				element.getValue(key)?.set(value);
			});
		});
		resolversToMeasure.forEach((resolver) => resolver.measureEndState());
		resolversToMeasure.forEach((resolver) => {
			if (resolver.suspendedScrollY !== void 0) window.scrollTo(0, resolver.suspendedScrollY);
		});
	}
	anyNeedsMeasurement = false;
	isScheduled = false;
	toResolve.forEach((resolver) => resolver.complete(isForced));
	toResolve.clear();
}
function readAllKeyframes() {
	toResolve.forEach((resolver) => {
		resolver.readKeyframes();
		if (resolver.needsMeasurement) anyNeedsMeasurement = true;
	});
}
function flushKeyframeResolvers() {
	isForced = true;
	readAllKeyframes();
	measureAllKeyframes();
	isForced = false;
}
var KeyframeResolver = class {
	constructor(unresolvedKeyframes, onComplete, name, motionValue, element, isAsync = false) {
		this.state = "pending";
		/**
		* Track whether this resolver is async. If it is, it'll be added to the
		* resolver queue and flushed in the next frame. Resolvers that aren't going
		* to trigger read/write thrashing don't need to be async.
		*/
		this.isAsync = false;
		/**
		* Track whether this resolver needs to perform a measurement
		* to resolve its keyframes.
		*/
		this.needsMeasurement = false;
		this.unresolvedKeyframes = [...unresolvedKeyframes];
		this.onComplete = onComplete;
		this.name = name;
		this.motionValue = motionValue;
		this.element = element;
		this.isAsync = isAsync;
	}
	scheduleResolve() {
		this.state = "scheduled";
		if (this.isAsync) {
			toResolve.add(this);
			if (!isScheduled) {
				isScheduled = true;
				frame.read(readAllKeyframes);
				frame.resolveKeyframes(measureAllKeyframes);
			}
		} else {
			this.readKeyframes();
			this.complete();
		}
	}
	readKeyframes() {
		const { unresolvedKeyframes, name, element, motionValue } = this;
		if (unresolvedKeyframes[0] === null) {
			const currentValue = motionValue?.get();
			const finalKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
			if (currentValue !== void 0) unresolvedKeyframes[0] = currentValue;
			else if (element && name) {
				const valueAsRead = element.readValue(name, finalKeyframe);
				if (valueAsRead !== void 0 && valueAsRead !== null) unresolvedKeyframes[0] = valueAsRead;
			}
			if (unresolvedKeyframes[0] === void 0) unresolvedKeyframes[0] = finalKeyframe;
			if (motionValue && currentValue === void 0) motionValue.set(unresolvedKeyframes[0]);
		}
		fillWildcards(unresolvedKeyframes);
	}
	setFinalKeyframe() {}
	measureInitialState() {}
	renderEndStyles() {}
	measureEndState() {}
	complete(isForcedComplete = false) {
		this.state = "complete";
		this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, isForcedComplete);
		toResolve.delete(this);
	}
	cancel() {
		if (this.state === "scheduled") {
			toResolve.delete(this);
			this.state = "pending";
		}
	}
	resume() {
		if (this.state === "pending") this.scheduleResolve();
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/dom/is-css-var.mjs
const isCSSVar = (name) => name.startsWith("--");

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/dom/style-set.mjs
function setStyle(element, name, value) {
	isCSSVar(name) ? element.style.setProperty(name, value) : element.style[name] = value;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/utils/supports/flags.mjs
/**
* Add the ability for test suites to manually set support flags
* to better test more environments.
*/
const supportsFlags = {};

//#endregion
//#region ../node_modules/motion-dom/dist/es/utils/supports/memo.mjs
function memoSupports(callback, supportsFlag) {
	const memoized = memo(callback);
	return () => supportsFlags[supportsFlag] ?? memoized();
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/utils/supports/scroll-timeline.mjs
const supportsScrollTimeline = /* @__PURE__ */ memoSupports(() => window.ScrollTimeline !== void 0, "scrollTimeline");
const supportsViewTimeline = /* @__PURE__ */ memoSupports(() => window.ViewTimeline !== void 0, "viewTimeline");

//#endregion
//#region ../node_modules/motion-dom/dist/es/utils/supports/linear-easing.mjs
const supportsLinearEasing = /*@__PURE__*/ memoSupports(() => {
	try {
		document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
	} catch (e) {
		return false;
	}
	return true;
}, "linearEasing");

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/waapi/easing/cubic-bezier.mjs
const cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/waapi/easing/supported.mjs
const supportedWaapiEasing = {
	linear: "linear",
	ease: "ease",
	easeIn: "ease-in",
	easeOut: "ease-out",
	easeInOut: "ease-in-out",
	circIn: /*@__PURE__*/ cubicBezierAsString([
		0,
		.65,
		.55,
		1
	]),
	circOut: /*@__PURE__*/ cubicBezierAsString([
		.55,
		0,
		1,
		.45
	]),
	backIn: /*@__PURE__*/ cubicBezierAsString([
		.31,
		.01,
		.66,
		-.59
	]),
	backOut: /*@__PURE__*/ cubicBezierAsString([
		.33,
		1.53,
		.69,
		.99
	])
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/waapi/easing/map-easing.mjs
function mapEasingToNativeEasing(easing, duration) {
	if (!easing) return;
	else if (typeof easing === "function") return supportsLinearEasing() ? generateLinearEasing(easing, duration) : "ease-out";
	else if (isBezierDefinition(easing)) return cubicBezierAsString(easing);
	else if (Array.isArray(easing)) return easing.map((segmentEasing) => mapEasingToNativeEasing(segmentEasing, duration) || supportedWaapiEasing.easeOut);
	else return supportedWaapiEasing[easing];
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/waapi/start-waapi-animation.mjs
function startWaapiAnimation(element, valueName, keyframes, { delay = 0, duration = 300, repeat = 0, repeatType = "loop", ease = "easeOut", times } = {}, pseudoElement = void 0) {
	const keyframeOptions = { [valueName]: keyframes };
	if (times) keyframeOptions.offset = times;
	const easing = mapEasingToNativeEasing(ease, duration);
	/**
	* If this is an easing array, apply to keyframes, not animation as a whole
	*/
	if (Array.isArray(easing)) keyframeOptions.easing = easing;
	if (statsBuffer.value) activeAnimations.waapi++;
	const options = {
		delay,
		duration,
		easing: !Array.isArray(easing) ? easing : "linear",
		fill: "both",
		iterations: repeat + 1,
		direction: repeatType === "reverse" ? "alternate" : "normal"
	};
	if (pseudoElement) options.pseudoElement = pseudoElement;
	const animation = element.animate(keyframeOptions, options);
	if (statsBuffer.value) animation.finished.finally(() => {
		activeAnimations.waapi--;
	});
	return animation;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/generators/utils/is-generator.mjs
function isGenerator(type) {
	return typeof type === "function" && "applyToOptions" in type;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/waapi/utils/apply-generator.mjs
function applyGeneratorOptions({ type, ...options }) {
	if (isGenerator(type) && supportsLinearEasing()) return type.applyToOptions(options);
	else {
		options.duration ?? (options.duration = 300);
		options.ease ?? (options.ease = "easeOut");
	}
	return options;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/NativeAnimation.mjs
/**
* NativeAnimation implements AnimationPlaybackControls for the browser's Web Animations API.
*/
var NativeAnimation = class extends WithPromise {
	constructor(options) {
		super();
		this.finishedTime = null;
		this.isStopped = false;
		/**
		* Tracks a manually-set start time that takes precedence over WAAPI's
		* dynamic startTime. This is cleared when play() or time setter is called,
		* allowing WAAPI to take over timing.
		*/
		this.manualStartTime = null;
		if (!options) return;
		const { element, name, keyframes, pseudoElement, allowFlatten = false, finalKeyframe, onComplete } = options;
		this.isPseudoElement = Boolean(pseudoElement);
		this.allowFlatten = allowFlatten;
		this.options = options;
		invariant(typeof options.type !== "string", `Mini animate() doesn't support "type" as a string.`, "mini-spring");
		const transition = applyGeneratorOptions(options);
		this.animation = startWaapiAnimation(element, name, keyframes, transition, pseudoElement);
		if (transition.autoplay === false) this.animation.pause();
		this.animation.onfinish = () => {
			this.finishedTime = this.time;
			if (!pseudoElement) {
				const keyframe = getFinalKeyframe$1(keyframes, this.options, finalKeyframe, this.speed);
				if (this.updateMotionValue) this.updateMotionValue(keyframe);
				/**
				* If we can, we want to commit the final style as set by the user,
				* rather than the computed keyframe value supplied by the animation.
				* We always do this, even when a motion value is present, to prevent
				* a visual flash in Firefox where the WAAPI animation's fill is removed
				* during cancel() before the scheduled render can apply the correct value.
				*/
				setStyle(element, name, keyframe);
				this.animation.cancel();
			}
			onComplete?.();
			this.notifyFinished();
		};
	}
	play() {
		if (this.isStopped) return;
		this.manualStartTime = null;
		this.animation.play();
		if (this.state === "finished") this.updateFinished();
	}
	pause() {
		this.animation.pause();
	}
	complete() {
		this.animation.finish?.();
	}
	cancel() {
		try {
			this.animation.cancel();
		} catch (e) {}
	}
	stop() {
		if (this.isStopped) return;
		this.isStopped = true;
		const { state } = this;
		if (state === "idle" || state === "finished") return;
		if (this.updateMotionValue) this.updateMotionValue();
		else this.commitStyles();
		if (!this.isPseudoElement) this.cancel();
	}
	/**
	* WAAPI doesn't natively have any interruption capabilities.
	*
	* In this method, we commit styles back to the DOM before cancelling
	* the animation.
	*
	* This is designed to be overridden by NativeAnimationExtended, which
	* will create a renderless JS animation and sample it twice to calculate
	* its current value, "previous" value, and therefore allow
	* Motion to also correctly calculate velocity for any subsequent animation
	* while deferring the commit until the next animation frame.
	*/
	commitStyles() {
		const element = this.options?.element;
		if (!this.isPseudoElement && element?.isConnected) this.animation.commitStyles?.();
	}
	get duration() {
		const duration = this.animation.effect?.getComputedTiming?.().duration || 0;
		return millisecondsToSeconds(Number(duration));
	}
	get iterationDuration() {
		const { delay = 0 } = this.options || {};
		return this.duration + millisecondsToSeconds(delay);
	}
	get time() {
		return millisecondsToSeconds(Number(this.animation.currentTime) || 0);
	}
	set time(newTime) {
		const wasFinished = this.finishedTime !== null;
		this.manualStartTime = null;
		this.finishedTime = null;
		this.animation.currentTime = secondsToMilliseconds(newTime);
		if (wasFinished) this.animation.pause();
	}
	/**
	* The playback speed of the animation.
	* 1 = normal speed, 2 = double speed, 0.5 = half speed.
	*/
	get speed() {
		return this.animation.playbackRate;
	}
	set speed(newSpeed) {
		if (newSpeed < 0) this.finishedTime = null;
		this.animation.playbackRate = newSpeed;
	}
	get state() {
		return this.finishedTime !== null ? "finished" : this.animation.playState;
	}
	get startTime() {
		return this.manualStartTime ?? Number(this.animation.startTime);
	}
	set startTime(newStartTime) {
		this.manualStartTime = this.animation.startTime = newStartTime;
	}
	/**
	* Attaches a timeline to the animation, for instance the `ScrollTimeline`.
	*/
	attachTimeline({ timeline, rangeStart, rangeEnd, observe }) {
		if (this.allowFlatten) this.animation.effect?.updateTiming({ easing: "linear" });
		this.animation.onfinish = null;
		if (timeline && supportsScrollTimeline()) {
			this.animation.timeline = timeline;
			if (rangeStart) this.animation.rangeStart = rangeStart;
			if (rangeEnd) this.animation.rangeEnd = rangeEnd;
			return noop;
		} else return observe(this);
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/waapi/utils/unsupported-easing.mjs
const unsupportedEasingFunctions = {
	anticipate,
	backInOut,
	circInOut
};
function isUnsupportedEase(key) {
	return key in unsupportedEasingFunctions;
}
function replaceStringEasing(transition) {
	if (typeof transition.ease === "string" && isUnsupportedEase(transition.ease)) transition.ease = unsupportedEasingFunctions[transition.ease];
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/NativeAnimationExtended.mjs
/**
* 10ms is chosen here as it strikes a balance between smooth
* results (more than one keyframe per frame at 60fps) and
* keyframe quantity.
*/
const sampleDelta = 10;
var NativeAnimationExtended = class extends NativeAnimation {
	constructor(options) {
		/**
		* The base NativeAnimation function only supports a subset
		* of Motion easings, and WAAPI also only supports some
		* easing functions via string/cubic-bezier definitions.
		*
		* This function replaces those unsupported easing functions
		* with a JS easing function. This will later get compiled
		* to a linear() easing function.
		*/
		replaceStringEasing(options);
		/**
		* Ensure we replace the transition type with a generator function
		* before passing to WAAPI.
		*
		* TODO: Does this have a better home? It could be shared with
		* JSAnimation.
		*/
		replaceTransitionType(options);
		super(options);
		/**
		* Only set startTime when the animation should autoplay.
		* Setting startTime on a paused WAAPI animation unpauses it
		* (per the WAAPI spec), which breaks autoplay: false.
		*/
		if (options.startTime !== void 0 && options.autoplay !== false) this.startTime = options.startTime;
		this.options = options;
	}
	/**
	* WAAPI doesn't natively have any interruption capabilities.
	*
	* Rather than read committed styles back out of the DOM, we can
	* create a renderless JS animation and sample it twice to calculate
	* its current value, "previous" value, and therefore allow
	* Motion to calculate velocity for any subsequent animation.
	*/
	updateMotionValue(value) {
		const { motionValue, onUpdate, onComplete, element, ...options } = this.options;
		if (!motionValue) return;
		if (value !== void 0) {
			motionValue.set(value);
			return;
		}
		const sampleAnimation = new JSAnimation({
			...options,
			autoplay: false
		});
		/**
		* Use wall-clock elapsed time for sampling.
		* Under CPU load, WAAPI's currentTime may not reflect actual
		* elapsed time, causing incorrect sampling and visual jumps.
		*/
		const sampleTime = Math.max(sampleDelta, time.now() - this.startTime);
		const delta = clamp(0, sampleDelta, sampleTime - sampleDelta);
		const current = sampleAnimation.sample(sampleTime).value;
		/**
		* Write the estimated value to inline style so it persists
		* after cancel(), covering the async gap before the next
		* animation starts.
		*/
		const { name } = this.options;
		if (element && name) setStyle(element, name, current);
		motionValue.setWithVelocity(sampleAnimation.sample(Math.max(0, sampleTime - delta)).value, current, delta);
		sampleAnimation.stop();
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/utils/is-animatable.mjs
/**
* Check if a value is animatable. Examples:
*
* ✅: 100, "100px", "#fff"
* ❌: "block", "url(2.jpg)"
* @param value
*
* @internal
*/
const isAnimatable = (value, name) => {
	if (name === "zIndex") return false;
	if (typeof value === "number" || Array.isArray(value)) return true;
	if (typeof value === "string" && (complex.test(value) || value === "0") && !value.startsWith("url(")) return true;
	return false;
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/utils/can-animate.mjs
function hasKeyframesChanged(keyframes) {
	const current = keyframes[0];
	if (keyframes.length === 1) return true;
	for (let i = 0; i < keyframes.length; i++) if (keyframes[i] !== current) return true;
}
function canAnimate(keyframes, name, type, velocity) {
	/**
	* Check if we're able to animate between the start and end keyframes,
	* and throw a warning if we're attempting to animate between one that's
	* animatable and another that isn't.
	*/
	const originKeyframe = keyframes[0];
	if (originKeyframe === null) return false;
	/**
	* These aren't traditionally animatable but we do support them.
	* In future we could look into making this more generic or replacing
	* this function with mix() === mixImmediate
	*/
	if (name === "display" || name === "visibility") return true;
	const targetKeyframe = keyframes[keyframes.length - 1];
	const isOriginAnimatable = isAnimatable(originKeyframe, name);
	const isTargetAnimatable = isAnimatable(targetKeyframe, name);
	warning(isOriginAnimatable === isTargetAnimatable, `You are trying to animate ${name} from "${originKeyframe}" to "${targetKeyframe}". "${isOriginAnimatable ? targetKeyframe : originKeyframe}" is not an animatable value.`, "value-not-animatable");
	if (!isOriginAnimatable || !isTargetAnimatable) return false;
	return hasKeyframesChanged(keyframes) || (type === "spring" || isGenerator(type)) && velocity;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/utils/make-animation-instant.mjs
function makeAnimationInstant(options) {
	options.duration = 0;
	options.type = "keyframes";
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/waapi/supports/waapi.mjs
/**
* A list of values that can be hardware-accelerated.
*/
const acceleratedValues$1 = /* @__PURE__ */ new Set([
	"opacity",
	"clipPath",
	"filter",
	"transform"
]);
const supportsWaapi = /*@__PURE__*/ memo(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function supportsBrowserAnimation(options) {
	const { motionValue, name, repeatDelay, repeatType, damping, type } = options;
	/**
	* We use this check instead of isHTMLElement() because we explicitly
	* **don't** want elements in different timing contexts (i.e. popups)
	* to be accelerated, as it's not possible to sync these animations
	* properly with those driven from the main window frameloop.
	*/
	if (!(motionValue?.owner?.current instanceof HTMLElement)) return false;
	const { onUpdate, transformTemplate } = motionValue.owner.getProps();
	return supportsWaapi() && name && acceleratedValues$1.has(name) && (name !== "transform" || !transformTemplate) && !onUpdate && !repeatDelay && repeatType !== "mirror" && damping !== 0 && type !== "inertia";
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/AsyncMotionValueAnimation.mjs
/**
* Maximum time allowed between an animation being created and it being
* resolved for us to use the latter as the start time.
*
* This is to ensure that while we prefer to "start" an animation as soon
* as it's triggered, we also want to avoid a visual jump if there's a big delay
* between these two moments.
*/
const MAX_RESOLVE_DELAY = 40;
var AsyncMotionValueAnimation = class extends WithPromise {
	constructor({ autoplay = true, delay = 0, type = "keyframes", repeat = 0, repeatDelay = 0, repeatType = "loop", keyframes, name, motionValue, element, ...options }) {
		super();
		/**
		* Bound to support return animation.stop pattern
		*/
		this.stop = () => {
			if (this._animation) {
				this._animation.stop();
				this.stopTimeline?.();
			}
			this.keyframeResolver?.cancel();
		};
		this.createdAt = time.now();
		const optionsWithDefaults = {
			autoplay,
			delay,
			type,
			repeat,
			repeatDelay,
			repeatType,
			name,
			motionValue,
			element,
			...options
		};
		const KeyframeResolver$1 = element?.KeyframeResolver || KeyframeResolver;
		this.keyframeResolver = new KeyframeResolver$1(keyframes, (resolvedKeyframes, finalKeyframe, forced) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe, optionsWithDefaults, !forced), name, motionValue, element);
		this.keyframeResolver?.scheduleResolve();
	}
	onKeyframesResolved(keyframes, finalKeyframe, options, sync) {
		this.keyframeResolver = void 0;
		const { name, type, velocity, delay, isHandoff, onUpdate } = options;
		this.resolvedAt = time.now();
		/**
		* If we can't animate this value with the resolved keyframes
		* then we should complete it immediately.
		*/
		let canAnimateValue = true;
		if (!canAnimate(keyframes, name, type, velocity)) {
			canAnimateValue = false;
			if (MotionGlobalConfig.instantAnimations || !delay) onUpdate?.(getFinalKeyframe$1(keyframes, options, finalKeyframe));
			keyframes[0] = keyframes[keyframes.length - 1];
			makeAnimationInstant(options);
			options.repeat = 0;
		}
		const resolvedOptions = {
			startTime: sync ? !this.resolvedAt ? this.createdAt : this.resolvedAt - this.createdAt > MAX_RESOLVE_DELAY ? this.resolvedAt : this.createdAt : void 0,
			finalKeyframe,
			...options,
			keyframes
		};
		/**
		* Animate via WAAPI if possible. If this is a handoff animation, the optimised animation will be running via
		* WAAPI. Therefore, this animation must be JS to ensure it runs "under" the
		* optimised animation.
		*
		* Also skip WAAPI when keyframes aren't animatable, as the resolved
		* values may not be valid CSS and would trigger browser warnings.
		*/
		const useWaapi = canAnimateValue && !isHandoff && supportsBrowserAnimation(resolvedOptions);
		const element = resolvedOptions.motionValue?.owner?.current;
		const animation = useWaapi ? new NativeAnimationExtended({
			...resolvedOptions,
			element
		}) : new JSAnimation(resolvedOptions);
		animation.finished.then(() => {
			this.notifyFinished();
		}).catch(noop);
		if (this.pendingTimeline) {
			this.stopTimeline = animation.attachTimeline(this.pendingTimeline);
			this.pendingTimeline = void 0;
		}
		this._animation = animation;
	}
	get finished() {
		if (!this._animation) return this._finished;
		else return this.animation.finished;
	}
	then(onResolve, _onReject) {
		return this.finished.finally(onResolve).then(() => {});
	}
	get animation() {
		if (!this._animation) {
			this.keyframeResolver?.resume();
			flushKeyframeResolvers();
		}
		return this._animation;
	}
	get duration() {
		return this.animation.duration;
	}
	get iterationDuration() {
		return this.animation.iterationDuration;
	}
	get time() {
		return this.animation.time;
	}
	set time(newTime) {
		this.animation.time = newTime;
	}
	get speed() {
		return this.animation.speed;
	}
	get state() {
		return this.animation.state;
	}
	set speed(newSpeed) {
		this.animation.speed = newSpeed;
	}
	get startTime() {
		return this.animation.startTime;
	}
	attachTimeline(timeline) {
		if (this._animation) this.stopTimeline = this.animation.attachTimeline(timeline);
		else this.pendingTimeline = timeline;
		return () => this.stop();
	}
	play() {
		this.animation.play();
	}
	pause() {
		this.animation.pause();
	}
	complete() {
		this.animation.complete();
	}
	cancel() {
		if (this._animation) this.animation.cancel();
		this.keyframeResolver?.cancel();
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/GroupAnimation.mjs
var GroupAnimation = class {
	constructor(animations) {
		this.stop = () => this.runAll("stop");
		this.animations = animations.filter(Boolean);
	}
	get finished() {
		return Promise.all(this.animations.map((animation) => animation.finished));
	}
	/**
	* TODO: Filter out cancelled or stopped animations before returning
	*/
	getAll(propName) {
		return this.animations[0][propName];
	}
	setAll(propName, newValue) {
		for (let i = 0; i < this.animations.length; i++) this.animations[i][propName] = newValue;
	}
	attachTimeline(timeline) {
		const subscriptions = this.animations.map((animation) => animation.attachTimeline(timeline));
		return () => {
			subscriptions.forEach((cancel, i) => {
				cancel && cancel();
				this.animations[i].stop();
			});
		};
	}
	get time() {
		return this.getAll("time");
	}
	set time(time) {
		this.setAll("time", time);
	}
	get speed() {
		return this.getAll("speed");
	}
	set speed(speed) {
		this.setAll("speed", speed);
	}
	get state() {
		return this.getAll("state");
	}
	get startTime() {
		return this.getAll("startTime");
	}
	get duration() {
		return getMax(this.animations, "duration");
	}
	get iterationDuration() {
		return getMax(this.animations, "iterationDuration");
	}
	runAll(methodName) {
		this.animations.forEach((controls) => controls[methodName]());
	}
	play() {
		this.runAll("play");
	}
	pause() {
		this.runAll("pause");
	}
	cancel() {
		this.runAll("cancel");
	}
	complete() {
		this.runAll("complete");
	}
};
function getMax(animations, propName) {
	let max = 0;
	for (let i = 0; i < animations.length; i++) {
		const value = animations[i][propName];
		if (value !== null && value > max) max = value;
	}
	return max;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/GroupAnimationWithThen.mjs
var GroupAnimationWithThen = class extends GroupAnimation {
	then(onResolve, _onReject) {
		return this.finished.finally(onResolve).then(() => {});
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/NativeAnimationWrapper.mjs
var NativeAnimationWrapper = class extends NativeAnimation {
	constructor(animation) {
		super();
		this.animation = animation;
		animation.onfinish = () => {
			this.finishedTime = this.time;
			this.notifyFinished();
		};
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/utils/css-variables-conversion.mjs
/**
* Parse Framer's special CSS variable format into a CSS token and a fallback.
*
* ```
* `var(--foo, #fff)` => [`--foo`, '#fff']
* ```
*
* @param current
*/
const splitCSSVariableRegex = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function parseCSSVariable(current) {
	const match = splitCSSVariableRegex.exec(current);
	if (!match) return [,];
	const [, token1, token2, fallback] = match;
	return [`--${token1 ?? token2}`, fallback];
}
const maxDepth = 4;
function getVariableValue(current, element, depth = 1) {
	invariant(depth <= maxDepth, `Max CSS variable fallback depth detected in property "${current}". This may indicate a circular fallback dependency.`, "max-css-var-depth");
	const [token, fallback] = parseCSSVariable(current);
	if (!token) return;
	const resolved = window.getComputedStyle(element).getPropertyValue(token);
	if (resolved) {
		const trimmed = resolved.trim();
		return isNumericalString(trimmed) ? parseFloat(trimmed) : trimmed;
	}
	return isCSSVariableToken(fallback) ? getVariableValue(fallback, element, depth + 1) : fallback;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/utils/default-transitions.mjs
const underDampedSpring = {
	type: "spring",
	stiffness: 500,
	damping: 25,
	restSpeed: 10
};
const criticallyDampedSpring = (target) => ({
	type: "spring",
	stiffness: 550,
	damping: target === 0 ? 2 * Math.sqrt(550) : 30,
	restSpeed: 10
});
const keyframesTransition = {
	type: "keyframes",
	duration: .8
};
/**
* Default easing curve is a slightly shallower version of
* the default browser easing curve.
*/
const ease = {
	type: "keyframes",
	ease: [
		.25,
		.1,
		.35,
		1
	],
	duration: .3
};
const getDefaultTransition = (valueKey, { keyframes }) => {
	if (keyframes.length > 2) return keyframesTransition;
	else if (transformProps.has(valueKey)) return valueKey.startsWith("scale") ? criticallyDampedSpring(keyframes[1]) : underDampedSpring;
	return ease;
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/utils/get-final-keyframe.mjs
const isNotNull = (value) => value !== null;
function getFinalKeyframe(keyframes, { repeat, repeatType = "loop" }, finalKeyframe) {
	const resolvedKeyframes = keyframes.filter(isNotNull);
	const index = repeat && repeatType !== "loop" && repeat % 2 === 1 ? 0 : resolvedKeyframes.length - 1;
	return !index || finalKeyframe === void 0 ? resolvedKeyframes[index] : finalKeyframe;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/utils/resolve-transition.mjs
/**
* If `transition` has `inherit: true`, shallow-merge it with
* `parentTransition` (child keys win) and strip the `inherit` key.
* Otherwise return `transition` unchanged.
*/
function resolveTransition(transition, parentTransition) {
	if (transition?.inherit && parentTransition) {
		const { inherit: _, ...rest } = transition;
		return {
			...parentTransition,
			...rest
		};
	}
	return transition;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/utils/get-value-transition.mjs
function getValueTransition$1(transition, key) {
	const valueTransition = transition?.[key] ?? transition?.["default"] ?? transition;
	if (valueTransition !== transition) return resolveTransition(valueTransition, transition);
	return valueTransition;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/utils/is-transition-defined.mjs
/**
* Decide whether a transition is defined on a given Transition.
* This filters out orchestration options and returns true
* if any options are left.
*/
function isTransitionDefined({ when, delay: _delay, delayChildren, staggerChildren, staggerDirection, repeat, repeatType, repeatDelay, from, elapsed, ...transition }) {
	return !!Object.keys(transition).length;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/interfaces/motion-value.mjs
const animateMotionValue = (name, value, target, transition = {}, element, isHandoff) => (onComplete) => {
	const valueTransition = getValueTransition$1(transition, name) || {};
	/**
	* Most transition values are currently completely overwritten by value-specific
	* transitions. In the future it'd be nicer to blend these transitions. But for now
	* delay actually does inherit from the root transition if not value-specific.
	*/
	const delay = valueTransition.delay || transition.delay || 0;
	/**
	* Elapsed isn't a public transition option but can be passed through from
	* optimized appear effects in milliseconds.
	*/
	let { elapsed = 0 } = transition;
	elapsed = elapsed - secondsToMilliseconds(delay);
	const options = {
		keyframes: Array.isArray(target) ? target : [null, target],
		ease: "easeOut",
		velocity: value.getVelocity(),
		...valueTransition,
		delay: -elapsed,
		onUpdate: (v) => {
			value.set(v);
			valueTransition.onUpdate && valueTransition.onUpdate(v);
		},
		onComplete: () => {
			onComplete();
			valueTransition.onComplete && valueTransition.onComplete();
		},
		name,
		motionValue: value,
		element: isHandoff ? void 0 : element
	};
	/**
	* If there's no transition defined for this value, we can generate
	* unique transition settings for this value.
	*/
	if (!isTransitionDefined(valueTransition)) Object.assign(options, getDefaultTransition(name, options));
	/**
	* Both WAAPI and our internal animation functions use durations
	* as defined by milliseconds, while our external API defines them
	* as seconds.
	*/
	options.duration && (options.duration = secondsToMilliseconds(options.duration));
	options.repeatDelay && (options.repeatDelay = secondsToMilliseconds(options.repeatDelay));
	/**
	* Support deprecated way to set initial value. Prefer keyframe syntax.
	*/
	if (options.from !== void 0) options.keyframes[0] = options.from;
	let shouldSkip = false;
	if (options.type === false || options.duration === 0 && !options.repeatDelay) {
		makeAnimationInstant(options);
		if (options.delay === 0) shouldSkip = true;
	}
	if (MotionGlobalConfig.instantAnimations || MotionGlobalConfig.skipAnimations || element?.shouldSkipAnimations) {
		shouldSkip = true;
		makeAnimationInstant(options);
		options.delay = 0;
	}
	/**
	* If the transition type or easing has been explicitly set by the user
	* then we don't want to allow flattening the animation.
	*/
	options.allowFlatten = !valueTransition.type && !valueTransition.ease;
	/**
	* If we can or must skip creating the animation, and apply only
	* the final keyframe, do so. We also check once keyframes are resolved but
	* this early check prevents the need to create an animation at all.
	*/
	if (shouldSkip && !isHandoff && value.get() !== void 0) {
		const finalKeyframe = getFinalKeyframe(options.keyframes, valueTransition);
		if (finalKeyframe !== void 0) {
			frame.update(() => {
				options.onUpdate(finalKeyframe);
				options.onComplete();
			});
			return;
		}
	}
	return valueTransition.isSync ? new JSAnimation(options) : new AsyncMotionValueAnimation(options);
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/utils/resolve-variants.mjs
function getValueState(visualElement) {
	const state = [{}, {}];
	visualElement?.values.forEach((value, key) => {
		state[0][key] = value.get();
		state[1][key] = value.getVelocity();
	});
	return state;
}
function resolveVariantFromProps(props, definition, custom, visualElement) {
	/**
	* If the variant definition is a function, resolve.
	*/
	if (typeof definition === "function") {
		const [current, velocity] = getValueState(visualElement);
		definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
	}
	/**
	* If the variant definition is a variant label, or
	* the function returned a variant label, resolve.
	*/
	if (typeof definition === "string") definition = props.variants && props.variants[definition];
	/**
	* At this point we've resolved both functions and variant labels,
	* but the resolved variant label might itself have been a function.
	* If so, resolve. This can only have returned a valid target object.
	*/
	if (typeof definition === "function") {
		const [current, velocity] = getValueState(visualElement);
		definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
	}
	return definition;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/utils/resolve-dynamic-variants.mjs
function resolveVariant(visualElement, definition, custom) {
	const props = visualElement.getProps();
	return resolveVariantFromProps(props, definition, custom !== void 0 ? custom : props.custom, visualElement);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/utils/keys-position.mjs
const positionalKeys = /* @__PURE__ */ new Set([
	"width",
	"height",
	"top",
	"left",
	"right",
	"bottom",
	...transformPropOrder
]);

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/index.mjs
/**
* Maximum time between the value of two frames, beyond which we
* assume the velocity has since been 0.
*/
const MAX_VELOCITY_DELTA = 30;
const isFloat = (value) => {
	return !isNaN(parseFloat(value));
};
const collectMotionValues = { current: void 0 };
/**
* `MotionValue` is used to track the state and velocity of motion values.
*
* @public
*/
var MotionValue = class {
	/**
	* @param init - The initiating value
	* @param config - Optional configuration options
	*
	* -  `transformer`: A function to transform incoming values with.
	*/
	constructor(init, options = {}) {
		/**
		* Tracks whether this value can output a velocity. Currently this is only true
		* if the value is numerical, but we might be able to widen the scope here and support
		* other value types.
		*
		* @internal
		*/
		this.canTrackVelocity = null;
		/**
		* An object containing a SubscriptionManager for each active event.
		*/
		this.events = {};
		this.updateAndNotify = (v) => {
			const currentTime = time.now();
			/**
			* If we're updating the value during another frame or eventloop
			* than the previous frame, then the we set the previous frame value
			* to current.
			*/
			if (this.updatedAt !== currentTime) this.setPrevFrameValue();
			this.prev = this.current;
			this.setCurrent(v);
			if (this.current !== this.prev) {
				this.events.change?.notify(this.current);
				if (this.dependents) for (const dependent of this.dependents) dependent.dirty();
			}
		};
		this.hasAnimated = false;
		this.setCurrent(init);
		this.owner = options.owner;
	}
	setCurrent(current) {
		this.current = current;
		this.updatedAt = time.now();
		if (this.canTrackVelocity === null && current !== void 0) this.canTrackVelocity = isFloat(this.current);
	}
	setPrevFrameValue(prevFrameValue = this.current) {
		this.prevFrameValue = prevFrameValue;
		this.prevUpdatedAt = this.updatedAt;
	}
	/**
	* Adds a function that will be notified when the `MotionValue` is updated.
	*
	* It returns a function that, when called, will cancel the subscription.
	*
	* When calling `onChange` inside a React component, it should be wrapped with the
	* `useEffect` hook. As it returns an unsubscribe function, this should be returned
	* from the `useEffect` function to ensure you don't add duplicate subscribers..
	*
	* ```jsx
	* export const MyComponent = () => {
	*   const x = useMotionValue(0)
	*   const y = useMotionValue(0)
	*   const opacity = useMotionValue(1)
	*
	*   useEffect(() => {
	*     function updateOpacity() {
	*       const maxXY = Math.max(x.get(), y.get())
	*       const newOpacity = transform(maxXY, [0, 100], [1, 0])
	*       opacity.set(newOpacity)
	*     }
	*
	*     const unsubscribeX = x.on("change", updateOpacity)
	*     const unsubscribeY = y.on("change", updateOpacity)
	*
	*     return () => {
	*       unsubscribeX()
	*       unsubscribeY()
	*     }
	*   }, [])
	*
	*   return <motion.div style={{ x }} />
	* }
	* ```
	*
	* @param subscriber - A function that receives the latest value.
	* @returns A function that, when called, will cancel this subscription.
	*
	* @deprecated
	*/
	onChange(subscription) {
		warnOnce(false, `value.onChange(callback) is deprecated. Switch to value.on("change", callback).`);
		return this.on("change", subscription);
	}
	on(eventName, callback) {
		if (!this.events[eventName]) this.events[eventName] = new SubscriptionManager();
		const unsubscribe = this.events[eventName].add(callback);
		if (eventName === "change") return () => {
			unsubscribe();
			/**
			* If we have no more change listeners by the start
			* of the next frame, stop active animations.
			*/
			frame.read(() => {
				if (!this.events.change.getSize()) this.stop();
			});
		};
		return unsubscribe;
	}
	clearListeners() {
		for (const eventManagers in this.events) this.events[eventManagers].clear();
	}
	/**
	* Attaches a passive effect to the `MotionValue`.
	*/
	attach(passiveEffect, stopPassiveEffect) {
		this.passiveEffect = passiveEffect;
		this.stopPassiveEffect = stopPassiveEffect;
	}
	/**
	* Sets the state of the `MotionValue`.
	*
	* @remarks
	*
	* ```jsx
	* const x = useMotionValue(0)
	* x.set(10)
	* ```
	*
	* @param latest - Latest value to set.
	* @param render - Whether to notify render subscribers. Defaults to `true`
	*
	* @public
	*/
	set(v) {
		if (!this.passiveEffect) this.updateAndNotify(v);
		else this.passiveEffect(v, this.updateAndNotify);
	}
	setWithVelocity(prev, current, delta) {
		this.set(current);
		this.prev = void 0;
		this.prevFrameValue = prev;
		this.prevUpdatedAt = this.updatedAt - delta;
	}
	/**
	* Set the state of the `MotionValue`, stopping any active animations,
	* effects, and resets velocity to `0`.
	*/
	jump(v, endAnimation = true) {
		this.updateAndNotify(v);
		this.prev = v;
		this.prevUpdatedAt = this.prevFrameValue = void 0;
		endAnimation && this.stop();
		if (this.stopPassiveEffect) this.stopPassiveEffect();
	}
	dirty() {
		this.events.change?.notify(this.current);
	}
	addDependent(dependent) {
		if (!this.dependents) this.dependents = /* @__PURE__ */ new Set();
		this.dependents.add(dependent);
	}
	removeDependent(dependent) {
		if (this.dependents) this.dependents.delete(dependent);
	}
	/**
	* Returns the latest state of `MotionValue`
	*
	* @returns - The latest state of `MotionValue`
	*
	* @public
	*/
	get() {
		if (collectMotionValues.current) collectMotionValues.current.push(this);
		return this.current;
	}
	/**
	* @public
	*/
	getPrevious() {
		return this.prev;
	}
	/**
	* Returns the latest velocity of `MotionValue`
	*
	* @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
	*
	* @public
	*/
	getVelocity() {
		const currentTime = time.now();
		if (!this.canTrackVelocity || this.prevFrameValue === void 0 || currentTime - this.updatedAt > MAX_VELOCITY_DELTA) return 0;
		const delta = Math.min(this.updatedAt - this.prevUpdatedAt, MAX_VELOCITY_DELTA);
		return velocityPerSecond(parseFloat(this.current) - parseFloat(this.prevFrameValue), delta);
	}
	/**
	* Registers a new animation to control this `MotionValue`. Only one
	* animation can drive a `MotionValue` at one time.
	*
	* ```jsx
	* value.start()
	* ```
	*
	* @param animation - A function that starts the provided animation
	*/
	start(startAnimation) {
		this.stop();
		return new Promise((resolve) => {
			this.hasAnimated = true;
			this.animation = startAnimation(resolve);
			if (this.events.animationStart) this.events.animationStart.notify();
		}).then(() => {
			if (this.events.animationComplete) this.events.animationComplete.notify();
			this.clearAnimation();
		});
	}
	/**
	* Stop the currently active animation.
	*
	* @public
	*/
	stop() {
		if (this.animation) {
			this.animation.stop();
			if (this.events.animationCancel) this.events.animationCancel.notify();
		}
		this.clearAnimation();
	}
	/**
	* Returns `true` if this value is currently animating.
	*
	* @public
	*/
	isAnimating() {
		return !!this.animation;
	}
	clearAnimation() {
		delete this.animation;
	}
	/**
	* Destroy and clean up subscribers to this `MotionValue`.
	*
	* The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
	* handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
	* created a `MotionValue` via the `motionValue` function.
	*
	* @public
	*/
	destroy() {
		this.dependents?.clear();
		this.events.destroy?.notify();
		this.clearListeners();
		this.stop();
		if (this.stopPassiveEffect) this.stopPassiveEffect();
	}
};
function motionValue(init, options) {
	return new MotionValue(init, options);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/utils/is-keyframes-target.mjs
const isKeyframesTarget = (v) => {
	return Array.isArray(v);
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/utils/setters.mjs
/**
* Set VisualElement's MotionValue, creating a new MotionValue for it if
* it doesn't exist.
*/
function setMotionValue(visualElement, key, value) {
	if (visualElement.hasValue(key)) visualElement.getValue(key).set(value);
	else visualElement.addValue(key, motionValue(value));
}
function resolveFinalValueInKeyframes(v) {
	return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
}
function setTarget(visualElement, definition) {
	let { transitionEnd = {}, transition = {}, ...target } = resolveVariant(visualElement, definition) || {};
	target = {
		...target,
		...transitionEnd
	};
	for (const key in target) setMotionValue(visualElement, key, resolveFinalValueInKeyframes(target[key]));
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/utils/is-motion-value.mjs
const isMotionValue = (value) => Boolean(value && value.getVelocity);

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/will-change/is.mjs
function isWillChangeMotionValue(value) {
	return Boolean(isMotionValue(value) && value.add);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/will-change/add-will-change.mjs
function addValueToWillChange(visualElement, key) {
	const willChange = visualElement.getValue("willChange");
	/**
	* It could be that a user has set willChange to a regular MotionValue,
	* in which case we can't add the value to it.
	*/
	if (isWillChangeMotionValue(willChange)) return willChange.add(key);
	else if (!willChange && MotionGlobalConfig.WillChange) {
		const newWillChange = new MotionGlobalConfig.WillChange("auto");
		visualElement.addValue("willChange", newWillChange);
		newWillChange.add(key);
	}
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/dom/utils/camel-to-dash.mjs
function camelToDash(str) {
	return str.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/optimized-appear/data-id.mjs
const optimizedAppearDataId = "framerAppearId";
const optimizedAppearDataAttribute = "data-" + camelToDash(optimizedAppearDataId);

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/optimized-appear/get-appear-id.mjs
function getOptimisedAppearId(visualElement) {
	return visualElement.props[optimizedAppearDataAttribute];
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/interfaces/visual-element-target.mjs
/**
* Decide whether we should block this animation. Previously, we achieved this
* just by checking whether the key was listed in protectedKeys, but this
* posed problems if an animation was triggered by afterChildren and protectedKeys
* had been set to true in the meantime.
*/
function shouldBlockAnimation({ protectedKeys, needsAnimating }, key) {
	const shouldBlock = protectedKeys.hasOwnProperty(key) && needsAnimating[key] !== true;
	needsAnimating[key] = false;
	return shouldBlock;
}
function animateTarget(visualElement, targetAndTransition, { delay = 0, transitionOverride, type } = {}) {
	let { transition, transitionEnd, ...target } = targetAndTransition;
	const defaultTransition = visualElement.getDefaultTransition();
	transition = transition ? resolveTransition(transition, defaultTransition) : defaultTransition;
	const reduceMotion = transition?.reduceMotion;
	if (transitionOverride) transition = transitionOverride;
	const animations = [];
	const animationTypeState = type && visualElement.animationState && visualElement.animationState.getState()[type];
	for (const key in target) {
		const value = visualElement.getValue(key, visualElement.latestValues[key] ?? null);
		const valueTarget = target[key];
		if (valueTarget === void 0 || animationTypeState && shouldBlockAnimation(animationTypeState, key)) continue;
		const valueTransition = {
			delay,
			...getValueTransition$1(transition || {}, key)
		};
		/**
		* If the value is already at the defined target, skip the animation.
		*/
		const currentValue = value.get();
		if (currentValue !== void 0 && !value.isAnimating && !Array.isArray(valueTarget) && valueTarget === currentValue && !valueTransition.velocity) continue;
		/**
		* If this is the first time a value is being animated, check
		* to see if we're handling off from an existing animation.
		*/
		let isHandoff = false;
		if (window.MotionHandoffAnimation) {
			const appearId = getOptimisedAppearId(visualElement);
			if (appearId) {
				const startTime = window.MotionHandoffAnimation(appearId, key, frame);
				if (startTime !== null) {
					valueTransition.startTime = startTime;
					isHandoff = true;
				}
			}
		}
		addValueToWillChange(visualElement, key);
		const shouldReduceMotion = reduceMotion ?? visualElement.shouldReduceMotion;
		value.start(animateMotionValue(key, value, valueTarget, shouldReduceMotion && positionalKeys.has(key) ? { type: false } : valueTransition, visualElement, isHandoff));
		const animation = value.animation;
		if (animation) animations.push(animation);
	}
	if (transitionEnd) {
		const applyTransitionEnd = () => frame.update(() => {
			transitionEnd && setTarget(visualElement, transitionEnd);
		});
		if (animations.length) Promise.all(animations).then(applyTransitionEnd);
		else applyTransitionEnd();
	}
	return animations;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/auto.mjs
/**
* ValueType for "auto"
*/
const auto = {
	test: (v) => v === "auto",
	parse: (v) => v
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/test.mjs
/**
* Tests a provided value against a ValueType
*/
const testValueType = (v) => (type) => type.test(v);

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/dimensions.mjs
/**
* A list of value types commonly used for dimensions
*/
const dimensionValueTypes = [
	number,
	px,
	percent,
	degrees,
	vw,
	vh,
	auto
];
/**
* Tests a dimensional value against the list of dimension ValueTypes
*/
const findDimensionValueType = (v) => dimensionValueTypes.find(testValueType(v));

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/keyframes/utils/is-none.mjs
function isNone(value) {
	if (typeof value === "number") return value === 0;
	else if (value !== null) return value === "none" || value === "0" || isZeroValueString(value);
	else return true;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/complex/filter.mjs
/**
* Properties that should default to 1 or 100%
*/
const maxDefaults = /* @__PURE__ */ new Set([
	"brightness",
	"contrast",
	"saturate",
	"opacity"
]);
function applyDefaultFilter(v) {
	const [name, value] = v.slice(0, -1).split("(");
	if (name === "drop-shadow") return v;
	const [number] = value.match(floatRegex) || [];
	if (!number) return v;
	const unit = value.replace(number, "");
	let defaultValue = maxDefaults.has(name) ? 1 : 0;
	if (number !== value) defaultValue *= 100;
	return name + "(" + defaultValue + unit + ")";
}
const functionRegex = /\b([a-z-]*)\(.*?\)/gu;
const filter = {
	...complex,
	getAnimatableNone: (v) => {
		const functions = v.match(functionRegex);
		return functions ? functions.map(applyDefaultFilter).join(" ") : v;
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/complex/mask.mjs
const mask = {
	...complex,
	getAnimatableNone: (v) => {
		const parsed = complex.parse(v);
		return complex.createTransformer(v)(parsed.map((v) => typeof v === "number" ? 0 : typeof v === "object" ? {
			...v,
			alpha: 1
		} : v));
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/int.mjs
const int = {
	...number,
	transform: Math.round
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/maps/transform.mjs
const transformValueTypes = {
	rotate: degrees,
	rotateX: degrees,
	rotateY: degrees,
	rotateZ: degrees,
	scale,
	scaleX: scale,
	scaleY: scale,
	scaleZ: scale,
	skew: degrees,
	skewX: degrees,
	skewY: degrees,
	distance: px,
	translateX: px,
	translateY: px,
	translateZ: px,
	x: px,
	y: px,
	z: px,
	perspective: px,
	transformPerspective: px,
	opacity: alpha,
	originX: progressPercentage,
	originY: progressPercentage,
	originZ: px
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/maps/number.mjs
const numberValueTypes = {
	borderWidth: px,
	borderTopWidth: px,
	borderRightWidth: px,
	borderBottomWidth: px,
	borderLeftWidth: px,
	borderRadius: px,
	borderTopLeftRadius: px,
	borderTopRightRadius: px,
	borderBottomRightRadius: px,
	borderBottomLeftRadius: px,
	width: px,
	maxWidth: px,
	height: px,
	maxHeight: px,
	top: px,
	right: px,
	bottom: px,
	left: px,
	inset: px,
	insetBlock: px,
	insetBlockStart: px,
	insetBlockEnd: px,
	insetInline: px,
	insetInlineStart: px,
	insetInlineEnd: px,
	padding: px,
	paddingTop: px,
	paddingRight: px,
	paddingBottom: px,
	paddingLeft: px,
	paddingBlock: px,
	paddingBlockStart: px,
	paddingBlockEnd: px,
	paddingInline: px,
	paddingInlineStart: px,
	paddingInlineEnd: px,
	margin: px,
	marginTop: px,
	marginRight: px,
	marginBottom: px,
	marginLeft: px,
	marginBlock: px,
	marginBlockStart: px,
	marginBlockEnd: px,
	marginInline: px,
	marginInlineStart: px,
	marginInlineEnd: px,
	fontSize: px,
	backgroundPositionX: px,
	backgroundPositionY: px,
	...transformValueTypes,
	zIndex: int,
	fillOpacity: alpha,
	strokeOpacity: alpha,
	numOctaves: int
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/maps/defaults.mjs
/**
* A map of default value types for common values
*/
const defaultValueTypes = {
	...numberValueTypes,
	color,
	backgroundColor: color,
	outlineColor: color,
	fill: color,
	stroke: color,
	borderColor: color,
	borderTopColor: color,
	borderRightColor: color,
	borderBottomColor: color,
	borderLeftColor: color,
	filter,
	WebkitFilter: filter,
	mask,
	WebkitMask: mask
};
/**
* Gets the default ValueType for the provided value key
*/
const getDefaultValueType = (key) => defaultValueTypes[key];

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/utils/animatable-none.mjs
const customTypes = /*@__PURE__*/ new Set([filter, mask]);
function getAnimatableNone(key, value) {
	let defaultValueType = getDefaultValueType(key);
	if (!customTypes.has(defaultValueType)) defaultValueType = complex;
	return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : void 0;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/keyframes/utils/make-none-animatable.mjs
/**
* If we encounter keyframes like "none" or "0" and we also have keyframes like
* "#fff" or "200px 200px" we want to find a keyframe to serve as a template for
* the "none" keyframes. In this case "#fff" or "200px 200px" - then these get turned into
* zero equivalents, i.e. "#fff0" or "0px 0px".
*/
const invalidTemplates = /* @__PURE__ */ new Set([
	"auto",
	"none",
	"0"
]);
function makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name) {
	let i = 0;
	let animatableTemplate = void 0;
	while (i < unresolvedKeyframes.length && !animatableTemplate) {
		const keyframe = unresolvedKeyframes[i];
		if (typeof keyframe === "string" && !invalidTemplates.has(keyframe) && analyseComplexValue(keyframe).values.length) animatableTemplate = unresolvedKeyframes[i];
		i++;
	}
	if (animatableTemplate && name) for (const noneIndex of noneKeyframeIndexes) unresolvedKeyframes[noneIndex] = getAnimatableNone(name, animatableTemplate);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/keyframes/DOMKeyframesResolver.mjs
var DOMKeyframesResolver = class extends KeyframeResolver {
	constructor(unresolvedKeyframes, onComplete, name, motionValue, element) {
		super(unresolvedKeyframes, onComplete, name, motionValue, element, true);
	}
	readKeyframes() {
		const { unresolvedKeyframes, element, name } = this;
		if (!element || !element.current) return;
		super.readKeyframes();
		/**
		* If any keyframe is a CSS variable, we need to find its value by sampling the element
		*/
		for (let i = 0; i < unresolvedKeyframes.length; i++) {
			let keyframe = unresolvedKeyframes[i];
			if (typeof keyframe === "string") {
				keyframe = keyframe.trim();
				if (isCSSVariableToken(keyframe)) {
					const resolved = getVariableValue(keyframe, element.current);
					if (resolved !== void 0) unresolvedKeyframes[i] = resolved;
					if (i === unresolvedKeyframes.length - 1) this.finalKeyframe = keyframe;
				}
			}
		}
		/**
		* Resolve "none" values. We do this potentially twice - once before and once after measuring keyframes.
		* This could be seen as inefficient but it's a trade-off to avoid measurements in more situations, which
		* have a far bigger performance impact.
		*/
		this.resolveNoneKeyframes();
		/**
		* Check to see if unit type has changed. If so schedule jobs that will
		* temporarily set styles to the destination keyframes.
		* Skip if we have more than two keyframes or this isn't a positional value.
		* TODO: We can throw if there are multiple keyframes and the value type changes.
		*/
		if (!positionalKeys.has(name) || unresolvedKeyframes.length !== 2) return;
		const [origin, target] = unresolvedKeyframes;
		const originType = findDimensionValueType(origin);
		const targetType = findDimensionValueType(target);
		if (containsCSSVariable(origin) !== containsCSSVariable(target) && positionalValues[name]) {
			this.needsMeasurement = true;
			return;
		}
		/**
		* Either we don't recognise these value types or we can animate between them.
		*/
		if (originType === targetType) return;
		/**
		* If both values are numbers or pixels, we can animate between them by
		* converting them to numbers.
		*/
		if (isNumOrPxType(originType) && isNumOrPxType(targetType)) for (let i = 0; i < unresolvedKeyframes.length; i++) {
			const value = unresolvedKeyframes[i];
			if (typeof value === "string") unresolvedKeyframes[i] = parseFloat(value);
		}
		else if (positionalValues[name])
 /**
		* Else, the only way to resolve this is by measuring the element.
		*/
		this.needsMeasurement = true;
	}
	resolveNoneKeyframes() {
		const { unresolvedKeyframes, name } = this;
		const noneKeyframeIndexes = [];
		for (let i = 0; i < unresolvedKeyframes.length; i++) if (unresolvedKeyframes[i] === null || isNone(unresolvedKeyframes[i])) noneKeyframeIndexes.push(i);
		if (noneKeyframeIndexes.length) makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name);
	}
	measureInitialState() {
		const { element, unresolvedKeyframes, name } = this;
		if (!element || !element.current) return;
		if (name === "height") this.suspendedScrollY = window.pageYOffset;
		this.measuredOrigin = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
		unresolvedKeyframes[0] = this.measuredOrigin;
		const measureKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
		if (measureKeyframe !== void 0) element.getValue(name, measureKeyframe).jump(measureKeyframe, false);
	}
	measureEndState() {
		const { element, name, unresolvedKeyframes } = this;
		if (!element || !element.current) return;
		const value = element.getValue(name);
		value && value.jump(this.measuredOrigin, false);
		const finalKeyframeIndex = unresolvedKeyframes.length - 1;
		const finalKeyframe = unresolvedKeyframes[finalKeyframeIndex];
		unresolvedKeyframes[finalKeyframeIndex] = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
		if (finalKeyframe !== null && this.finalKeyframe === void 0) this.finalKeyframe = finalKeyframe;
		if (this.removedTransforms?.length) this.removedTransforms.forEach(([unsetTransformName, unsetTransformValue]) => {
			element.getValue(unsetTransformName).set(unsetTransformValue);
		});
		this.resolveNoneKeyframes();
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/waapi/utils/accelerated-values.mjs
/**
* A list of values that can be hardware-accelerated.
*/
const acceleratedValues = /* @__PURE__ */ new Set([
	"opacity",
	"clipPath",
	"filter",
	"transform"
]);

//#endregion
//#region ../node_modules/motion-dom/dist/es/utils/resolve-elements.mjs
function resolveElements(elementOrSelector, scope, selectorCache) {
	if (elementOrSelector == null) return [];
	if (elementOrSelector instanceof EventTarget) return [elementOrSelector];
	else if (typeof elementOrSelector === "string") {
		let root = document;
		if (scope) root = scope.current;
		const elements = selectorCache?.[elementOrSelector] ?? root.querySelectorAll(elementOrSelector);
		return elements ? Array.from(elements) : [];
	}
	return Array.from(elementOrSelector).filter((element) => element != null);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/effects/utils/create-dom-effect.mjs
function createSelectorEffect(subjectEffect) {
	return (subject, values) => {
		const elements = resolveElements(subject);
		const subscriptions = [];
		for (const element of elements) {
			const remove = subjectEffect(element, values);
			subscriptions.push(remove);
		}
		return () => {
			for (const remove of subscriptions) remove();
		};
	};
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/utils/get-as-type.mjs
/**
* Provided a value and a ValueType, returns the value as that value type.
*/
const getValueAsType = (value, type) => {
	return type && typeof value === "number" ? type.transform(value) : value;
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/effects/MotionValueState.mjs
var MotionValueState = class {
	constructor() {
		this.latest = {};
		this.values = /* @__PURE__ */ new Map();
	}
	set(name, value, render, computed, useDefaultValueType = true) {
		const existingValue = this.values.get(name);
		if (existingValue) existingValue.onRemove();
		const onChange = () => {
			const v = value.get();
			if (useDefaultValueType) this.latest[name] = getValueAsType(v, numberValueTypes[name]);
			else this.latest[name] = v;
			render && frame.render(render);
		};
		onChange();
		const cancelOnChange = value.on("change", onChange);
		computed && value.addDependent(computed);
		const remove = () => {
			cancelOnChange();
			render && cancelFrame(render);
			this.values.delete(name);
			computed && value.removeDependent(computed);
		};
		this.values.set(name, {
			value,
			onRemove: remove
		});
		return remove;
	}
	get(name) {
		return this.values.get(name)?.value;
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/effects/utils/create-effect.mjs
function createEffect(addValue) {
	const stateCache = /* @__PURE__ */ new WeakMap();
	return (subject, values) => {
		const state = stateCache.get(subject) ?? new MotionValueState();
		stateCache.set(subject, state);
		const subscriptions = [];
		for (const key in values) {
			const value = values[key];
			const remove = addValue(subject, state, key, value);
			subscriptions.push(remove);
		}
		return () => {
			for (const cancel of subscriptions) cancel();
		};
	};
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/utils/is-html-element.mjs
/**
* Checks if an element is an HTML element in a way
* that works across iframes
*/
function isHTMLElement(element) {
	return isObject(element) && "offsetHeight" in element && !("ownerSVGElement" in element);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/effects/style/transform.mjs
const translateAlias$1 = {
	x: "translateX",
	y: "translateY",
	z: "translateZ",
	transformPerspective: "perspective"
};
function buildTransform$1(state) {
	let transform = "";
	let transformIsDefault = true;
	/**
	* Loop over all possible transforms in order, adding the ones that
	* are present to the transform string.
	*/
	for (let i = 0; i < transformPropOrder.length; i++) {
		const key = transformPropOrder[i];
		const value = state.latest[key];
		if (value === void 0) continue;
		let valueIsDefault = true;
		if (typeof value === "number") valueIsDefault = value === (key.startsWith("scale") ? 1 : 0);
		else {
			const parsed = parseFloat(value);
			valueIsDefault = key.startsWith("scale") ? parsed === 1 : parsed === 0;
		}
		if (!valueIsDefault) {
			transformIsDefault = false;
			const transformName = translateAlias$1[key] || key;
			transform += `${transformName}(${value}) `;
		}
	}
	return transformIsDefault ? "none" : transform.trim();
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/effects/style/index.mjs
const originProps = /* @__PURE__ */ new Set([
	"originX",
	"originY",
	"originZ"
]);
const addStyleValue = (element, state, key, value) => {
	let render = void 0;
	let computed = void 0;
	if (transformProps.has(key)) {
		if (!state.get("transform")) {
			if (!isHTMLElement(element) && !state.get("transformBox")) addStyleValue(element, state, "transformBox", new MotionValue("fill-box"));
			state.set("transform", new MotionValue("none"), () => {
				element.style.transform = buildTransform$1(state);
			});
		}
		computed = state.get("transform");
	} else if (originProps.has(key)) {
		if (!state.get("transformOrigin")) state.set("transformOrigin", new MotionValue(""), () => {
			const originX = state.latest.originX ?? "50%";
			const originY = state.latest.originY ?? "50%";
			const originZ = state.latest.originZ ?? 0;
			element.style.transformOrigin = `${originX} ${originY} ${originZ}`;
		});
		computed = state.get("transformOrigin");
	} else if (isCSSVar(key)) render = () => {
		element.style.setProperty(key, state.latest[key]);
	};
	else render = () => {
		element.style[key] = state.latest[key];
	};
	return state.set(key, value, render, computed);
};
const styleEffect = /*@__PURE__*/ createSelectorEffect(/*@__PURE__*/ createEffect(addStyleValue));

//#endregion
//#region ../node_modules/motion-dom/dist/es/frameloop/microtask.mjs
const { schedule: microtask, cancel: cancelMicrotask } = /* @__PURE__ */ createRenderBatcher(queueMicrotask, false);

//#endregion
//#region ../node_modules/motion-dom/dist/es/utils/is-svg-element.mjs
/**
* Checks if an element is an SVG element in a way
* that works across iframes
*/
function isSVGElement(element) {
	return isObject(element) && "ownerSVGElement" in element;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/resize/handle-element.mjs
const resizeHandlers = /* @__PURE__ */ new WeakMap();
let observer;
const getSize = (borderBoxAxis, svgAxis, htmlAxis) => (target, borderBoxSize) => {
	if (borderBoxSize && borderBoxSize[0]) return borderBoxSize[0][borderBoxAxis + "Size"];
	else if (isSVGElement(target) && "getBBox" in target) return target.getBBox()[svgAxis];
	else return target[htmlAxis];
};
const getWidth = /*@__PURE__*/ getSize("inline", "width", "offsetWidth");
const getHeight = /*@__PURE__*/ getSize("block", "height", "offsetHeight");
function notifyTarget({ target, borderBoxSize }) {
	resizeHandlers.get(target)?.forEach((handler) => {
		handler(target, {
			get width() {
				return getWidth(target, borderBoxSize);
			},
			get height() {
				return getHeight(target, borderBoxSize);
			}
		});
	});
}
function notifyAll(entries) {
	entries.forEach(notifyTarget);
}
function createResizeObserver() {
	if (typeof ResizeObserver === "undefined") return;
	observer = new ResizeObserver(notifyAll);
}
function resizeElement(target, handler) {
	if (!observer) createResizeObserver();
	const elements = resolveElements(target);
	elements.forEach((element) => {
		let elementHandlers = resizeHandlers.get(element);
		if (!elementHandlers) {
			elementHandlers = /* @__PURE__ */ new Set();
			resizeHandlers.set(element, elementHandlers);
		}
		elementHandlers.add(handler);
		observer?.observe(element);
	});
	return () => {
		elements.forEach((element) => {
			const elementHandlers = resizeHandlers.get(element);
			elementHandlers?.delete(handler);
			if (!elementHandlers?.size) observer?.unobserve(element);
		});
	};
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/resize/handle-window.mjs
const windowCallbacks = /* @__PURE__ */ new Set();
let windowResizeHandler;
function createWindowResizeHandler() {
	windowResizeHandler = () => {
		const info = {
			get width() {
				return window.innerWidth;
			},
			get height() {
				return window.innerHeight;
			}
		};
		windowCallbacks.forEach((callback) => callback(info));
	};
	window.addEventListener("resize", windowResizeHandler);
}
function resizeWindow(callback) {
	windowCallbacks.add(callback);
	if (!windowResizeHandler) createWindowResizeHandler();
	return () => {
		windowCallbacks.delete(callback);
		if (!windowCallbacks.size && typeof windowResizeHandler === "function") {
			window.removeEventListener("resize", windowResizeHandler);
			windowResizeHandler = void 0;
		}
	};
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/resize/index.mjs
function resize(a, b) {
	return typeof a === "function" ? resizeWindow(a) : resizeElement(a, b);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/scroll/observe.mjs
function observeTimeline(update, timeline) {
	let prevProgress;
	const onFrame = () => {
		const { currentTime } = timeline;
		const progress = (currentTime === null ? 0 : currentTime.value) / 100;
		if (prevProgress !== progress) update(progress);
		prevProgress = progress;
	};
	frame.preUpdate(onFrame, true);
	return () => cancelFrame(onFrame);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/utils/is-svg-svg-element.mjs
/**
* Checks if an element is specifically an SVGSVGElement (the root SVG element)
* in a way that works across iframes
*/
function isSVGSVGElement(element) {
	return isSVGElement(element) && element.tagName === "svg";
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/utils/transform.mjs
function transform(...args) {
	const useImmediate = !Array.isArray(args[0]);
	const argOffset = useImmediate ? 0 : -1;
	const inputValue = args[0 + argOffset];
	const inputRange = args[1 + argOffset];
	const outputRange = args[2 + argOffset];
	const options = args[3 + argOffset];
	const interpolator = interpolate(inputRange, outputRange, options);
	return useImmediate ? interpolator(inputValue) : interpolator;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/follow-value.mjs
/**
* Create a `MotionValue` that animates to its latest value using any transition type.
* Can either be a value or track another `MotionValue`.
*
* ```jsx
* const x = motionValue(0)
* const y = followValue(x, { type: "spring", stiffness: 300 })
* // or with tween
* const z = followValue(x, { type: "tween", duration: 0.5, ease: "easeOut" })
* ```
*
* @param source - Initial value or MotionValue to track
* @param options - Animation transition options
* @returns `MotionValue`
*
* @public
*/
function followValue(source, options) {
	const initialValue = isMotionValue(source) ? source.get() : source;
	const value = motionValue(initialValue);
	attachFollow(value, source, options);
	return value;
}
/**
* Attach an animation to a MotionValue that will animate whenever the value changes.
* Similar to attachSpring but supports any transition type (spring, tween, inertia, etc.)
*
* @param value - The MotionValue to animate
* @param source - Initial value or MotionValue to track
* @param options - Animation transition options
* @returns Cleanup function
*
* @public
*/
function attachFollow(value, source, options = {}) {
	const initialValue = value.get();
	let activeAnimation = null;
	let latestValue = initialValue;
	let latestSetter;
	const unit = typeof initialValue === "string" ? initialValue.replace(/[\d.-]/g, "") : void 0;
	const stopAnimation = () => {
		if (activeAnimation) {
			activeAnimation.stop();
			activeAnimation = null;
		}
	};
	const startAnimation = () => {
		const currentValue = asNumber(value.get());
		const targetValue = asNumber(latestValue);
		if (currentValue === targetValue) {
			stopAnimation();
			return;
		}
		const velocity = activeAnimation ? activeAnimation.getGeneratorVelocity() : value.getVelocity();
		stopAnimation();
		activeAnimation = new JSAnimation({
			keyframes: [currentValue, targetValue],
			velocity,
			type: "spring",
			restDelta: .001,
			restSpeed: .01,
			...options,
			onUpdate: latestSetter
		});
	};
	const scheduleAnimation = () => {
		startAnimation();
		value["events"].animationStart?.notify();
		activeAnimation?.then(() => {
			value["events"].animationComplete?.notify();
		});
	};
	value.attach((v, set) => {
		latestValue = v;
		latestSetter = (latest) => set(parseValue(latest, unit));
		frame.postRender(scheduleAnimation);
	}, stopAnimation);
	if (isMotionValue(source)) {
		let skipNextAnimation = options.skipInitialAnimation === true;
		const removeSourceOnChange = source.on("change", (v) => {
			if (skipNextAnimation) {
				skipNextAnimation = false;
				value.jump(parseValue(v, unit), false);
			} else value.set(parseValue(v, unit));
		});
		const removeValueOnDestroy = value.on("destroy", removeSourceOnChange);
		return () => {
			removeSourceOnChange();
			removeValueOnDestroy();
		};
	}
	return stopAnimation;
}
function parseValue(v, unit) {
	return unit ? v + unit : v;
}
function asNumber(v) {
	return typeof v === "number" ? v : parseFloat(v);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/subscribe-value.mjs
function subscribeValue(inputValues, outputValue, getLatest) {
	const update = () => outputValue.set(getLatest());
	const scheduleUpdate = () => frame.preRender(update, false, true);
	const subscriptions = inputValues.map((v) => v.on("change", scheduleUpdate));
	outputValue.on("destroy", () => {
		subscriptions.forEach((unsubscribe) => unsubscribe());
		cancelFrame(update);
	});
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/transform-value.mjs
/**
* Create a `MotionValue` that transforms the output of other `MotionValue`s by
* passing their latest values through a transform function.
*
* Whenever a `MotionValue` referred to in the provided function is updated,
* it will be re-evaluated.
*
* ```jsx
* const x = motionValue(0)
* const y = transformValue(() => x.get() * 2) // double x
* ```
*
* @param transformer - A transform function. This function must be pure with no side-effects or conditional statements.
* @returns `MotionValue`
*
* @public
*/
function transformValue(transform) {
	const collectedValues = [];
	/**
	* Open session of collectMotionValues. Any MotionValue that calls get()
	* inside transform will be saved into this array.
	*/
	collectMotionValues.current = collectedValues;
	const initialValue = transform();
	collectMotionValues.current = void 0;
	const value = motionValue(initialValue);
	subscribeValue(collectedValues, value, transform);
	return value;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/spring-value.mjs
/**
* Create a `MotionValue` that animates to its latest value using a spring.
* Can either be a value or track another `MotionValue`.
*
* ```jsx
* const x = motionValue(0)
* const y = springValue(x, { stiffness: 300 })
* ```
*
* @param source - Initial value or MotionValue to track
* @param options - Spring configuration options
* @returns `MotionValue`
*
* @public
*/
function springValue(source, options) {
	return followValue(source, {
		type: "spring",
		...options
	});
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/value/types/utils/find.mjs
/**
* A list of all ValueTypes
*/
const valueTypes = [
	...dimensionValueTypes,
	color,
	complex
];
/**
* Tests a value against the list of ValueTypes
*/
const findValueType = (v) => valueTypes.find(testValueType(v));

//#endregion
//#region ../node_modules/motion-dom/dist/es/view/utils/choose-layer-type.mjs
function chooseLayerType(valueName) {
	if (valueName === "layout") return "group";
	if (valueName === "enter" || valueName === "new") return "new";
	if (valueName === "exit" || valueName === "old") return "old";
	return "group";
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/view/utils/css.mjs
let pendingRules = {};
let style = null;
const css = {
	set: (selector, values) => {
		pendingRules[selector] = values;
	},
	commit: () => {
		if (!style) {
			style = document.createElement("style");
			style.id = "motion-view";
		}
		let cssText = "";
		for (const selector in pendingRules) {
			const rule = pendingRules[selector];
			cssText += `${selector} {\n`;
			for (const [property, value] of Object.entries(rule)) cssText += `  ${property}: ${value};\n`;
			cssText += "}\n";
		}
		style.textContent = cssText;
		document.head.appendChild(style);
		pendingRules = {};
	},
	remove: () => {
		if (style && style.parentElement) style.parentElement.removeChild(style);
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/view/utils/get-layer-info.mjs
function getViewAnimationLayerInfo(pseudoElement) {
	const match = pseudoElement.match(/::view-transition-(old|new|group|image-pair)\((.*?)\)/);
	if (!match) return null;
	return {
		layer: match[2],
		type: match[1]
	};
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/view/utils/get-view-animations.mjs
function filterViewAnimations(animation) {
	const { effect } = animation;
	if (!effect) return false;
	return effect.target === document.documentElement && effect.pseudoElement?.startsWith("::view-transition");
}
function getViewAnimations() {
	return document.getAnimations().filter(filterViewAnimations);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/view/utils/has-target.mjs
function hasTarget(target, targets) {
	return targets.has(target) && Object.keys(targets.get(target)).length > 0;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/view/start.mjs
const definitionNames = [
	"layout",
	"enter",
	"exit",
	"new",
	"old"
];
function startViewAnimation(builder) {
	const { update, targets, options: defaultOptions } = builder;
	if (!document.startViewTransition) return new Promise(async (resolve) => {
		await update();
		resolve(new GroupAnimation([]));
	});
	/**
	* If we don't have any animations defined for the root target,
	* remove it from being captured.
	*/
	if (!hasTarget("root", targets)) css.set(":root", { "view-transition-name": "none" });
	/**
	* Set the timing curve to linear for all view transition layers.
	* This gets baked into the keyframes, which can't be changed
	* without breaking the generated animation.
	*
	* This allows us to set easing via updateTiming - which can be changed.
	*/
	css.set("::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*)", { "animation-timing-function": "linear !important" });
	css.commit();
	const transition = document.startViewTransition(async () => {
		await update();
	});
	transition.finished.finally(() => {
		css.remove();
	});
	return new Promise((resolve) => {
		transition.ready.then(() => {
			const generatedViewAnimations = getViewAnimations();
			const animations = [];
			/**
			* Create animations for each of our explicitly-defined subjects.
			*/
			targets.forEach((definition, target) => {
				for (const key of definitionNames) {
					if (!definition[key]) continue;
					const { keyframes, options } = definition[key];
					for (let [valueName, valueKeyframes] of Object.entries(keyframes)) {
						if (!valueKeyframes) continue;
						const valueOptions = {
							...getValueTransition$1(defaultOptions, valueName),
							...getValueTransition$1(options, valueName)
						};
						const type = chooseLayerType(key);
						/**
						* If this is an opacity animation, and keyframes are not an array,
						* we need to convert them into an array and set an initial value.
						*/
						if (valueName === "opacity" && !Array.isArray(valueKeyframes)) valueKeyframes = [type === "new" ? 0 : 1, valueKeyframes];
						/**
						* Resolve stagger function if provided.
						*/
						if (typeof valueOptions.delay === "function") valueOptions.delay = valueOptions.delay(0, 1);
						valueOptions.duration && (valueOptions.duration = secondsToMilliseconds(valueOptions.duration));
						valueOptions.delay && (valueOptions.delay = secondsToMilliseconds(valueOptions.delay));
						const animation = new NativeAnimation({
							...valueOptions,
							element: document.documentElement,
							name: valueName,
							pseudoElement: `::view-transition-${type}(${target})`,
							keyframes: valueKeyframes
						});
						animations.push(animation);
					}
				}
			});
			/**
			* Handle browser generated animations
			*/
			for (const animation of generatedViewAnimations) {
				if (animation.playState === "finished") continue;
				const { effect } = animation;
				if (!effect || !(effect instanceof KeyframeEffect)) continue;
				const { pseudoElement } = effect;
				if (!pseudoElement) continue;
				const name = getViewAnimationLayerInfo(pseudoElement);
				if (!name) continue;
				const targetDefinition = targets.get(name.layer);
				if (!targetDefinition) {
					/**
					* If transition name is group then update the timing of the animation
					* whereas if it's old or new then we could possibly replace it using
					* the above method.
					*/
					const transitionName = name.type === "group" ? "layout" : "";
					let animationTransition = { ...getValueTransition$1(defaultOptions, transitionName) };
					animationTransition.duration && (animationTransition.duration = secondsToMilliseconds(animationTransition.duration));
					animationTransition = applyGeneratorOptions(animationTransition);
					const easing = mapEasingToNativeEasing(animationTransition.ease, animationTransition.duration);
					effect.updateTiming({
						delay: secondsToMilliseconds(animationTransition.delay ?? 0),
						duration: animationTransition.duration,
						easing
					});
					animations.push(new NativeAnimationWrapper(animation));
				} else if (hasOpacity(targetDefinition, "enter") && hasOpacity(targetDefinition, "exit") && effect.getKeyframes().some((keyframe) => keyframe.mixBlendMode)) animations.push(new NativeAnimationWrapper(animation));
				else animation.cancel();
			}
			resolve(new GroupAnimation(animations));
		});
	});
}
function hasOpacity(target, key) {
	return target?.[key]?.keyframes.opacity;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/view/queue.mjs
let builders = [];
let current = null;
function next() {
	current = null;
	const [nextBuilder] = builders;
	if (nextBuilder) start(nextBuilder);
}
function start(builder) {
	removeItem(builders, builder);
	current = builder;
	startViewAnimation(builder).then((animation) => {
		builder.notifyReady(animation);
		animation.finished.finally(next);
	});
}
function processQueue() {
	/**
	* Iterate backwards over the builders array. We can ignore the
	* "wait" animations. If we have an interrupting animation in the
	* queue then we need to batch all preceeding animations into it.
	* Currently this only batches the update functions but will also
	* need to batch the targets.
	*/
	for (let i = builders.length - 1; i >= 0; i--) {
		const builder = builders[i];
		const { interrupt } = builder.options;
		if (interrupt === "immediate") {
			const batchedUpdates = builders.slice(0, i + 1).map((b) => b.update);
			const remaining = builders.slice(i + 1);
			builder.update = () => {
				batchedUpdates.forEach((update) => update());
			};
			builders = [builder, ...remaining];
			break;
		}
	}
	if (!current || builders[0]?.options.interrupt === "immediate") next();
}
function addToQueue(builder) {
	builders.push(builder);
	microtask.render(processQueue);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/view/index.mjs
var ViewTransitionBuilder = class {
	constructor(update, options = {}) {
		this.currentSubject = "root";
		this.targets = /* @__PURE__ */ new Map();
		this.notifyReady = noop;
		this.readyPromise = new Promise((resolve) => {
			this.notifyReady = resolve;
		});
		this.update = update;
		this.options = {
			interrupt: "wait",
			...options
		};
		addToQueue(this);
	}
	get(subject) {
		this.currentSubject = subject;
		return this;
	}
	layout(keyframes, options) {
		this.updateTarget("layout", keyframes, options);
		return this;
	}
	new(keyframes, options) {
		this.updateTarget("new", keyframes, options);
		return this;
	}
	old(keyframes, options) {
		this.updateTarget("old", keyframes, options);
		return this;
	}
	enter(keyframes, options) {
		this.updateTarget("enter", keyframes, options);
		return this;
	}
	exit(keyframes, options) {
		this.updateTarget("exit", keyframes, options);
		return this;
	}
	crossfade(options) {
		this.updateTarget("enter", { opacity: 1 }, options);
		this.updateTarget("exit", { opacity: 0 }, options);
		return this;
	}
	updateTarget(target, keyframes, options = {}) {
		const { currentSubject, targets } = this;
		if (!targets.has(currentSubject)) targets.set(currentSubject, {});
		const targetData = targets.get(currentSubject);
		targetData[target] = {
			keyframes,
			options
		};
	}
	then(resolve, reject) {
		return this.readyPromise.then(resolve, reject);
	}
};
function animateView(update, defaultOptions = {}) {
	return new ViewTransitionBuilder(update, defaultOptions);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/projection/geometry/models.mjs
const createAxis = () => ({
	min: 0,
	max: 0
});
const createBox = () => ({
	x: createAxis(),
	y: createAxis()
});

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/store.mjs
const visualElementStore = /* @__PURE__ */ new WeakMap();

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/utils/is-animation-controls.mjs
function isAnimationControls(v) {
	return v !== null && typeof v === "object" && typeof v.start === "function";
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/utils/is-variant-label.mjs
/**
* Decides if the supplied variable is variant label
*/
function isVariantLabel(v) {
	return typeof v === "string" || Array.isArray(v);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/utils/variant-props.mjs
const variantPriorityOrder = [
	"animate",
	"whileInView",
	"whileFocus",
	"whileHover",
	"whileTap",
	"whileDrag",
	"exit"
];
const variantProps = ["initial", ...variantPriorityOrder];

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/utils/is-controlling-variants.mjs
function isControllingVariants(props) {
	return isAnimationControls(props.animate) || variantProps.some((name) => isVariantLabel(props[name]));
}
function isVariantNode(props) {
	return Boolean(isControllingVariants(props) || props.variants);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/utils/motion-values.mjs
/**
* Updates motion values from props changes.
* Uses `any` type for element to avoid circular dependencies with VisualElement.
*/
function updateMotionValuesFromProps(element, next, prev) {
	for (const key in next) {
		const nextValue = next[key];
		const prevValue = prev[key];
		if (isMotionValue(nextValue))
 /**
		* If this is a motion value found in props or style, we want to add it
		* to our visual element's motion value map.
		*/
		element.addValue(key, nextValue);
		else if (isMotionValue(prevValue))
 /**
		* If we're swapping from a motion value to a static value,
		* create a new motion value from that
		*/
		element.addValue(key, motionValue(nextValue, { owner: element }));
		else if (prevValue !== nextValue) {
			/**
			* If this is a flat value that has changed, update the motion value
			* or create one if it doesn't exist. We only want to do this if we're
			* not handling the value with our animation state.
			*/
			if (element.hasValue(key)) {
				const existingValue = element.getValue(key);
				if (existingValue.liveStyle === true) existingValue.jump(nextValue);
				else if (!existingValue.hasAnimated) existingValue.set(nextValue);
			} else {
				const latestValue = element.getStaticValue(key);
				element.addValue(key, motionValue(latestValue !== void 0 ? latestValue : nextValue, { owner: element }));
			}
		}
	}
	for (const key in prev) if (next[key] === void 0) element.removeValue(key);
	return next;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/utils/reduced-motion/state.mjs
const prefersReducedMotion = { current: null };
const hasReducedMotionListener = { current: false };

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/utils/reduced-motion/index.mjs
const isBrowser = typeof window !== "undefined";
function initPrefersReducedMotion() {
	hasReducedMotionListener.current = true;
	if (!isBrowser) return;
	if (window.matchMedia) {
		const motionMediaQuery = window.matchMedia("(prefers-reduced-motion)");
		const setReducedMotionPreferences = () => prefersReducedMotion.current = motionMediaQuery.matches;
		motionMediaQuery.addEventListener("change", setReducedMotionPreferences);
		setReducedMotionPreferences();
	} else prefersReducedMotion.current = false;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/VisualElement.mjs
const propEventHandlers = [
	"AnimationStart",
	"AnimationComplete",
	"Update",
	"BeforeLayoutMeasure",
	"LayoutMeasure",
	"LayoutAnimationStart",
	"LayoutAnimationComplete"
];
/**
* Static feature definitions - can be injected by framework layer
*/
let featureDefinitions = {};
/**
* A VisualElement is an imperative abstraction around UI elements such as
* HTMLElement, SVGElement, Three.Object3D etc.
*/
var VisualElement = class {
	/**
	* This method takes React props and returns found MotionValues. For example, HTML
	* MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
	*
	* This isn't an abstract method as it needs calling in the constructor, but it is
	* intended to be one.
	*/
	scrapeMotionValuesFromProps(_props, _prevProps, _visualElement) {
		return {};
	}
	constructor({ parent, props, presenceContext, reducedMotionConfig, skipAnimations, blockInitialAnimation, visualState }, options = {}) {
		/**
		* A reference to the current underlying Instance, e.g. a HTMLElement
		* or Three.Mesh etc.
		*/
		this.current = null;
		/**
		* A set containing references to this VisualElement's children.
		*/
		this.children = /* @__PURE__ */ new Set();
		/**
		* Determine what role this visual element should take in the variant tree.
		*/
		this.isVariantNode = false;
		this.isControllingVariants = false;
		/**
		* Decides whether this VisualElement should animate in reduced motion
		* mode.
		*
		* TODO: This is currently set on every individual VisualElement but feels
		* like it could be set globally.
		*/
		this.shouldReduceMotion = null;
		/**
		* Decides whether animations should be skipped for this VisualElement.
		* Useful for E2E tests and visual regression testing.
		*/
		this.shouldSkipAnimations = false;
		/**
		* A map of all motion values attached to this visual element. Motion
		* values are source of truth for any given animated value. A motion
		* value might be provided externally by the component via props.
		*/
		this.values = /* @__PURE__ */ new Map();
		this.KeyframeResolver = KeyframeResolver;
		/**
		* Cleanup functions for active features (hover/tap/exit etc)
		*/
		this.features = {};
		/**
		* A map of every subscription that binds the provided or generated
		* motion values onChange listeners to this visual element.
		*/
		this.valueSubscriptions = /* @__PURE__ */ new Map();
		/**
		* A reference to the previously-provided motion values as returned
		* from scrapeMotionValuesFromProps. We use the keys in here to determine
		* if any motion values need to be removed after props are updated.
		*/
		this.prevMotionValues = {};
		/**
		* Track whether this element has been mounted before, to detect
		* remounts after Suspense unmount/remount cycles.
		*/
		this.hasBeenMounted = false;
		/**
		* An object containing a SubscriptionManager for each active event.
		*/
		this.events = {};
		/**
		* An object containing an unsubscribe function for each prop event subscription.
		* For example, every "Update" event can have multiple subscribers via
		* VisualElement.on(), but only one of those can be defined via the onUpdate prop.
		*/
		this.propEventSubscriptions = {};
		this.notifyUpdate = () => this.notify("Update", this.latestValues);
		this.render = () => {
			if (!this.current) return;
			this.triggerBuild();
			this.renderInstance(this.current, this.renderState, this.props.style, this.projection);
		};
		this.renderScheduledAt = 0;
		this.scheduleRender = () => {
			const now = time.now();
			if (this.renderScheduledAt < now) {
				this.renderScheduledAt = now;
				frame.render(this.render, false, true);
			}
		};
		const { latestValues, renderState } = visualState;
		this.latestValues = latestValues;
		this.baseTarget = { ...latestValues };
		this.initialValues = props.initial ? { ...latestValues } : {};
		this.renderState = renderState;
		this.parent = parent;
		this.props = props;
		this.presenceContext = presenceContext;
		this.depth = parent ? parent.depth + 1 : 0;
		this.reducedMotionConfig = reducedMotionConfig;
		this.skipAnimationsConfig = skipAnimations;
		this.options = options;
		this.blockInitialAnimation = Boolean(blockInitialAnimation);
		this.isControllingVariants = isControllingVariants(props);
		this.isVariantNode = isVariantNode(props);
		if (this.isVariantNode) this.variantChildren = /* @__PURE__ */ new Set();
		this.manuallyAnimateOnMount = Boolean(parent && parent.current);
		/**
		* Any motion values that are provided to the element when created
		* aren't yet bound to the element, as this would technically be impure.
		* However, we iterate through the motion values and set them to the
		* initial values for this component.
		*
		* TODO: This is impure and we should look at changing this to run on mount.
		* Doing so will break some tests but this isn't necessarily a breaking change,
		* more a reflection of the test.
		*/
		const { willChange, ...initialMotionValues } = this.scrapeMotionValuesFromProps(props, {}, this);
		for (const key in initialMotionValues) {
			const value = initialMotionValues[key];
			if (latestValues[key] !== void 0 && isMotionValue(value)) value.set(latestValues[key]);
		}
	}
	mount(instance) {
		/**
		* If this element has been mounted before (e.g. after a Suspense
		* unmount/remount), reset motion values to their initial state
		* so animations replay correctly from initial → animate.
		*/
		if (this.hasBeenMounted) for (const key in this.initialValues) {
			this.values.get(key)?.jump(this.initialValues[key]);
			this.latestValues[key] = this.initialValues[key];
		}
		this.current = instance;
		visualElementStore.set(instance, this);
		if (this.projection && !this.projection.instance) this.projection.mount(instance);
		if (this.parent && this.isVariantNode && !this.isControllingVariants) this.removeFromVariantTree = this.parent.addVariantChild(this);
		this.values.forEach((value, key) => this.bindToMotionValue(key, value));
		/**
		* Determine reduced motion preference. Only initialize the matchMedia
		* listener if we actually need the dynamic value (i.e., when config
		* is neither "never" nor "always").
		*/
		if (this.reducedMotionConfig === "never") this.shouldReduceMotion = false;
		else if (this.reducedMotionConfig === "always") this.shouldReduceMotion = true;
		else {
			if (!hasReducedMotionListener.current) initPrefersReducedMotion();
			this.shouldReduceMotion = prefersReducedMotion.current;
		}
		warnOnce(this.shouldReduceMotion !== true, "You have Reduced Motion enabled on your device. Animations may not appear as expected.", "reduced-motion-disabled");
		/**
		* Set whether animations should be skipped based on the config.
		*/
		this.shouldSkipAnimations = this.skipAnimationsConfig ?? false;
		this.parent?.addChild(this);
		this.update(this.props, this.presenceContext);
		this.hasBeenMounted = true;
	}
	unmount() {
		this.projection && this.projection.unmount();
		cancelFrame(this.notifyUpdate);
		cancelFrame(this.render);
		this.valueSubscriptions.forEach((remove) => remove());
		this.valueSubscriptions.clear();
		this.removeFromVariantTree && this.removeFromVariantTree();
		this.parent?.removeChild(this);
		for (const key in this.events) this.events[key].clear();
		for (const key in this.features) {
			const feature = this.features[key];
			if (feature) {
				feature.unmount();
				feature.isMounted = false;
			}
		}
		this.current = null;
	}
	addChild(child) {
		this.children.add(child);
		this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set());
		this.enteringChildren.add(child);
	}
	removeChild(child) {
		this.children.delete(child);
		this.enteringChildren && this.enteringChildren.delete(child);
	}
	bindToMotionValue(key, value) {
		if (this.valueSubscriptions.has(key)) this.valueSubscriptions.get(key)();
		if (value.accelerate && acceleratedValues.has(key) && this.current instanceof HTMLElement) {
			const { factory, keyframes, times, ease, duration } = value.accelerate;
			const animation = new NativeAnimation({
				element: this.current,
				name: key,
				keyframes,
				times,
				ease,
				duration: secondsToMilliseconds(duration)
			});
			const cleanup = factory(animation);
			this.valueSubscriptions.set(key, () => {
				cleanup();
				animation.cancel();
			});
			return;
		}
		const valueIsTransform = transformProps.has(key);
		if (valueIsTransform && this.onBindTransform) this.onBindTransform();
		const removeOnChange = value.on("change", (latestValue) => {
			this.latestValues[key] = latestValue;
			this.props.onUpdate && frame.preRender(this.notifyUpdate);
			if (valueIsTransform && this.projection) this.projection.isTransformDirty = true;
			this.scheduleRender();
		});
		let removeSyncCheck;
		if (typeof window !== "undefined" && window.MotionCheckAppearSync) removeSyncCheck = window.MotionCheckAppearSync(this, key, value);
		this.valueSubscriptions.set(key, () => {
			removeOnChange();
			if (removeSyncCheck) removeSyncCheck();
			if (value.owner) value.stop();
		});
	}
	sortNodePosition(other) {
		/**
		* If these nodes aren't even of the same type we can't compare their depth.
		*/
		if (!this.current || !this.sortInstanceNodePosition || this.type !== other.type) return 0;
		return this.sortInstanceNodePosition(this.current, other.current);
	}
	updateFeatures() {
		let key = "animation";
		for (key in featureDefinitions) {
			const featureDefinition = featureDefinitions[key];
			if (!featureDefinition) continue;
			const { isEnabled, Feature: FeatureConstructor } = featureDefinition;
			/**
			* If this feature is enabled but not active, make a new instance.
			*/
			if (!this.features[key] && FeatureConstructor && isEnabled(this.props)) this.features[key] = new FeatureConstructor(this);
			/**
			* If we have a feature, mount or update it.
			*/
			if (this.features[key]) {
				const feature = this.features[key];
				if (feature.isMounted) feature.update();
				else {
					feature.mount();
					feature.isMounted = true;
				}
			}
		}
	}
	triggerBuild() {
		this.build(this.renderState, this.latestValues, this.props);
	}
	/**
	* Measure the current viewport box with or without transforms.
	* Only measures axis-aligned boxes, rotate and skew must be manually
	* removed with a re-render to work.
	*/
	measureViewportBox() {
		return this.current ? this.measureInstanceViewportBox(this.current, this.props) : createBox();
	}
	getStaticValue(key) {
		return this.latestValues[key];
	}
	setStaticValue(key, value) {
		this.latestValues[key] = value;
	}
	/**
	* Update the provided props. Ensure any newly-added motion values are
	* added to our map, old ones removed, and listeners updated.
	*/
	update(props, presenceContext) {
		if (props.transformTemplate || this.props.transformTemplate) this.scheduleRender();
		this.prevProps = this.props;
		this.props = props;
		this.prevPresenceContext = this.presenceContext;
		this.presenceContext = presenceContext;
		/**
		* Update prop event handlers ie onAnimationStart, onAnimationComplete
		*/
		for (let i = 0; i < propEventHandlers.length; i++) {
			const key = propEventHandlers[i];
			if (this.propEventSubscriptions[key]) {
				this.propEventSubscriptions[key]();
				delete this.propEventSubscriptions[key];
			}
			const listener = props["on" + key];
			if (listener) this.propEventSubscriptions[key] = this.on(key, listener);
		}
		this.prevMotionValues = updateMotionValuesFromProps(this, this.scrapeMotionValuesFromProps(props, this.prevProps || {}, this), this.prevMotionValues);
		if (this.handleChildMotionValue) this.handleChildMotionValue();
	}
	getProps() {
		return this.props;
	}
	/**
	* Returns the variant definition with a given name.
	*/
	getVariant(name) {
		return this.props.variants ? this.props.variants[name] : void 0;
	}
	/**
	* Returns the defined default transition on this component.
	*/
	getDefaultTransition() {
		return this.props.transition;
	}
	getTransformPagePoint() {
		return this.props.transformPagePoint;
	}
	getClosestVariantNode() {
		return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
	}
	/**
	* Add a child visual element to our set of children.
	*/
	addVariantChild(child) {
		const closestVariantNode = this.getClosestVariantNode();
		if (closestVariantNode) {
			closestVariantNode.variantChildren && closestVariantNode.variantChildren.add(child);
			return () => closestVariantNode.variantChildren.delete(child);
		}
	}
	/**
	* Add a motion value and bind it to this visual element.
	*/
	addValue(key, value) {
		const existingValue = this.values.get(key);
		if (value !== existingValue) {
			if (existingValue) this.removeValue(key);
			this.bindToMotionValue(key, value);
			this.values.set(key, value);
			this.latestValues[key] = value.get();
		}
	}
	/**
	* Remove a motion value and unbind any active subscriptions.
	*/
	removeValue(key) {
		this.values.delete(key);
		const unsubscribe = this.valueSubscriptions.get(key);
		if (unsubscribe) {
			unsubscribe();
			this.valueSubscriptions.delete(key);
		}
		delete this.latestValues[key];
		this.removeValueFromRenderState(key, this.renderState);
	}
	/**
	* Check whether we have a motion value for this key
	*/
	hasValue(key) {
		return this.values.has(key);
	}
	getValue(key, defaultValue) {
		if (this.props.values && this.props.values[key]) return this.props.values[key];
		let value = this.values.get(key);
		if (value === void 0 && defaultValue !== void 0) {
			value = motionValue(defaultValue === null ? void 0 : defaultValue, { owner: this });
			this.addValue(key, value);
		}
		return value;
	}
	/**
	* If we're trying to animate to a previously unencountered value,
	* we need to check for it in our state and as a last resort read it
	* directly from the instance (which might have performance implications).
	*/
	readValue(key, target) {
		let value = this.latestValues[key] !== void 0 || !this.current ? this.latestValues[key] : this.getBaseTargetFromProps(this.props, key) ?? this.readValueFromInstance(this.current, key, this.options);
		if (value !== void 0 && value !== null) {
			if (typeof value === "string" && (isNumericalString(value) || isZeroValueString(value))) value = parseFloat(value);
			else if (!findValueType(value) && complex.test(target)) value = getAnimatableNone(key, target);
			this.setBaseTarget(key, isMotionValue(value) ? value.get() : value);
		}
		return isMotionValue(value) ? value.get() : value;
	}
	/**
	* Set the base target to later animate back to. This is currently
	* only hydrated on creation and when we first read a value.
	*/
	setBaseTarget(key, value) {
		this.baseTarget[key] = value;
	}
	/**
	* Find the base target for a value thats been removed from all animation
	* props.
	*/
	getBaseTarget(key) {
		const { initial } = this.props;
		let valueFromInitial;
		if (typeof initial === "string" || typeof initial === "object") {
			const variant = resolveVariantFromProps(this.props, initial, this.presenceContext?.custom);
			if (variant) valueFromInitial = variant[key];
		}
		/**
		* If this value still exists in the current initial variant, read that.
		*/
		if (initial && valueFromInitial !== void 0) return valueFromInitial;
		/**
		* Alternatively, if this VisualElement config has defined a getBaseTarget
		* so we can read the value from an alternative source, try that.
		*/
		const target = this.getBaseTargetFromProps(this.props, key);
		if (target !== void 0 && !isMotionValue(target)) return target;
		/**
		* If the value was initially defined on initial, but it doesn't any more,
		* return undefined. Otherwise return the value as initially read from the DOM.
		*/
		return this.initialValues[key] !== void 0 && valueFromInitial === void 0 ? void 0 : this.baseTarget[key];
	}
	on(eventName, callback) {
		if (!this.events[eventName]) this.events[eventName] = new SubscriptionManager();
		return this.events[eventName].add(callback);
	}
	notify(eventName, ...args) {
		if (this.events[eventName]) this.events[eventName].notify(...args);
	}
	scheduleRenderMicrotask() {
		microtask.render(this.render);
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/dom/DOMVisualElement.mjs
var DOMVisualElement = class extends VisualElement {
	constructor() {
		super(...arguments);
		this.KeyframeResolver = DOMKeyframesResolver;
	}
	sortInstanceNodePosition(a, b) {
		/**
		* compareDocumentPosition returns a bitmask, by using the bitwise &
		* we're returning true if 2 in that bitmask is set to true. 2 is set
		* to true if b preceeds a.
		*/
		return a.compareDocumentPosition(b) & 2 ? 1 : -1;
	}
	getBaseTargetFromProps(props, key) {
		const style = props.style;
		return style ? style[key] : void 0;
	}
	removeValueFromRenderState(key, { vars, style }) {
		delete vars[key];
		delete style[key];
	}
	handleChildMotionValue() {
		if (this.childSubscription) {
			this.childSubscription();
			delete this.childSubscription;
		}
		const { children } = this.props;
		if (isMotionValue(children)) this.childSubscription = children.on("change", (latest) => {
			if (this.current) this.current.textContent = `${latest}`;
		});
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/projection/geometry/conversion.mjs
/**
* Bounding boxes tend to be defined as top, left, right, bottom. For various operations
* it's easier to consider each axis individually. This function returns a bounding box
* as a map of single-axis min/max values.
*/
function convertBoundingBoxToBox({ top, left, right, bottom }) {
	return {
		x: {
			min: left,
			max: right
		},
		y: {
			min: top,
			max: bottom
		}
	};
}
/**
* Applies a TransformPoint function to a bounding box. TransformPoint is usually a function
* provided by Framer to allow measured points to be corrected for device scaling. This is used
* when measuring DOM elements and DOM event points.
*/
function transformBoxPoints(point, transformPoint) {
	if (!transformPoint) return point;
	const topLeft = transformPoint({
		x: point.left,
		y: point.top
	});
	const bottomRight = transformPoint({
		x: point.right,
		y: point.bottom
	});
	return {
		top: topLeft.y,
		left: topLeft.x,
		bottom: bottomRight.y,
		right: bottomRight.x
	};
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/projection/utils/measure.mjs
function measureViewportBox(instance, transformPoint) {
	return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint));
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/html/utils/build-transform.mjs
const translateAlias = {
	x: "translateX",
	y: "translateY",
	z: "translateZ",
	transformPerspective: "perspective"
};
const numTransforms = transformPropOrder.length;
/**
* Build a CSS transform style from individual x/y/scale etc properties.
*
* This outputs with a default order of transforms/scales/rotations, this can be customised by
* providing a transformTemplate function.
*/
function buildTransform(latestValues, transform, transformTemplate) {
	let transformString = "";
	let transformIsDefault = true;
	/**
	* Loop over all possible transforms in order, adding the ones that
	* are present to the transform string.
	*/
	for (let i = 0; i < numTransforms; i++) {
		const key = transformPropOrder[i];
		const value = latestValues[key];
		if (value === void 0) continue;
		let valueIsDefault = true;
		if (typeof value === "number") valueIsDefault = value === (key.startsWith("scale") ? 1 : 0);
		else {
			const parsed = parseFloat(value);
			valueIsDefault = key.startsWith("scale") ? parsed === 1 : parsed === 0;
		}
		if (!valueIsDefault || transformTemplate) {
			const valueAsType = getValueAsType(value, numberValueTypes[key]);
			if (!valueIsDefault) {
				transformIsDefault = false;
				const transformName = translateAlias[key] || key;
				transformString += `${transformName}(${valueAsType}) `;
			}
			if (transformTemplate) transform[key] = valueAsType;
		}
	}
	transformString = transformString.trim();
	if (transformTemplate) transformString = transformTemplate(transform, transformIsDefault ? "" : transformString);
	else if (transformIsDefault) transformString = "none";
	return transformString;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/html/utils/build-styles.mjs
function buildHTMLStyles(state, latestValues, transformTemplate) {
	const { style, vars, transformOrigin } = state;
	let hasTransform = false;
	let hasTransformOrigin = false;
	/**
	* Loop over all our latest animated values and decide whether to handle them
	* as a style or CSS variable.
	*
	* Transforms and transform origins are kept separately for further processing.
	*/
	for (const key in latestValues) {
		const value = latestValues[key];
		if (transformProps.has(key)) {
			hasTransform = true;
			continue;
		} else if (isCSSVariableName(key)) {
			vars[key] = value;
			continue;
		} else {
			const valueAsType = getValueAsType(value, numberValueTypes[key]);
			if (key.startsWith("origin")) {
				hasTransformOrigin = true;
				transformOrigin[key] = valueAsType;
			} else style[key] = valueAsType;
		}
	}
	if (!latestValues.transform) {
		if (hasTransform || transformTemplate) style.transform = buildTransform(latestValues, state.transform, transformTemplate);
		else if (style.transform)
 /**
		* If we have previously created a transform but currently don't have any,
		* reset transform style to none.
		*/
		style.transform = "none";
	}
	/**
	* Build a transformOrigin style. Uses the same defaults as the browser for
	* undefined origins.
	*/
	if (hasTransformOrigin) {
		const { originX = "50%", originY = "50%", originZ = 0 } = transformOrigin;
		style.transformOrigin = `${originX} ${originY} ${originZ}`;
	}
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/html/utils/render.mjs
function renderHTML(element, { style, vars }, styleProp, projection) {
	const elementStyle = element.style;
	let key;
	for (key in style) elementStyle[key] = style[key];
	projection?.applyProjectionStyles(elementStyle, styleProp);
	for (key in vars) elementStyle.setProperty(key, vars[key]);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/projection/styles/scale-border-radius.mjs
function pixelsToPercent(pixels, axis) {
	if (axis.max === axis.min) return 0;
	return pixels / (axis.max - axis.min) * 100;
}
/**
* We always correct borderRadius as a percentage rather than pixels to reduce paints.
* For example, if you are projecting a box that is 100px wide with a 10px borderRadius
* into a box that is 200px wide with a 20px borderRadius, that is actually a 10%
* borderRadius in both states. If we animate between the two in pixels that will trigger
* a paint each time. If we animate between the two in percentage we'll avoid a paint.
*/
const correctBorderRadius = { correct: (latest, node) => {
	if (!node.target) return latest;
	/**
	* If latest is a string, if it's a percentage we can return immediately as it's
	* going to be stretched appropriately. Otherwise, if it's a pixel, convert it to a number.
	*/
	if (typeof latest === "string") {
		if (px.test(latest)) latest = parseFloat(latest);
		else return latest;
	}
	return `${pixelsToPercent(latest, node.target.x)}% ${pixelsToPercent(latest, node.target.y)}%`;
} };

//#endregion
//#region ../node_modules/motion-dom/dist/es/projection/styles/scale-box-shadow.mjs
const correctBoxShadow = { correct: (latest, { treeScale, projectionDelta }) => {
	const original = latest;
	const shadow = complex.parse(latest);
	if (shadow.length > 5) return original;
	const template = complex.createTransformer(latest);
	const offset = typeof shadow[0] !== "number" ? 1 : 0;
	const xScale = projectionDelta.x.scale * treeScale.x;
	const yScale = projectionDelta.y.scale * treeScale.y;
	shadow[0 + offset] /= xScale;
	shadow[1 + offset] /= yScale;
	/**
	* Ideally we'd correct x and y scales individually, but because blur and
	* spread apply to both we have to take a scale average and apply that instead.
	* We could potentially improve the outcome of this by incorporating the ratio between
	* the two scales.
	*/
	const averageScale = mixNumber$1(xScale, yScale, .5);
	if (typeof shadow[2 + offset] === "number") shadow[2 + offset] /= averageScale;
	if (typeof shadow[3 + offset] === "number") shadow[3 + offset] /= averageScale;
	return template(shadow);
} };

//#endregion
//#region ../node_modules/motion-dom/dist/es/projection/styles/scale-correction.mjs
const scaleCorrectors = {
	borderRadius: {
		...correctBorderRadius,
		applyTo: [
			"borderTopLeftRadius",
			"borderTopRightRadius",
			"borderBottomLeftRadius",
			"borderBottomRightRadius"
		]
	},
	borderTopLeftRadius: correctBorderRadius,
	borderTopRightRadius: correctBorderRadius,
	borderBottomLeftRadius: correctBorderRadius,
	borderBottomRightRadius: correctBorderRadius,
	boxShadow: correctBoxShadow
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/utils/is-forced-motion-value.mjs
function isForcedMotionValue(key, { layout, layoutId }) {
	return transformProps.has(key) || key.startsWith("origin") || (layout || layoutId !== void 0) && (!!scaleCorrectors[key] || key === "opacity");
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/html/utils/scrape-motion-values.mjs
function scrapeMotionValuesFromProps$1(props, prevProps, visualElement) {
	const style = props.style;
	const prevStyle = prevProps?.style;
	const newValues = {};
	if (!style) return newValues;
	for (const key in style) if (isMotionValue(style[key]) || prevStyle && isMotionValue(prevStyle[key]) || isForcedMotionValue(key, props) || visualElement?.getValue(key)?.liveStyle !== void 0) newValues[key] = style[key];
	return newValues;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/html/HTMLVisualElement.mjs
function getComputedStyle$1(element) {
	return window.getComputedStyle(element);
}
var HTMLVisualElement = class extends DOMVisualElement {
	constructor() {
		super(...arguments);
		this.type = "html";
		this.renderInstance = renderHTML;
	}
	readValueFromInstance(instance, key) {
		if (transformProps.has(key)) return this.projection?.isProjecting ? defaultTransformValue(key) : readTransformValue(instance, key);
		else {
			const computedStyle = getComputedStyle$1(instance);
			const value = (isCSSVariableName(key) ? computedStyle.getPropertyValue(key) : computedStyle[key]) || 0;
			return typeof value === "string" ? value.trim() : value;
		}
	}
	measureInstanceViewportBox(instance, { transformPagePoint }) {
		return measureViewportBox(instance, transformPagePoint);
	}
	build(renderState, latestValues, props) {
		buildHTMLStyles(renderState, latestValues, props.transformTemplate);
	}
	scrapeMotionValuesFromProps(props, prevProps, visualElement) {
		return scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/object/ObjectVisualElement.mjs
function isObjectKey(key, object) {
	return key in object;
}
var ObjectVisualElement = class extends VisualElement {
	constructor() {
		super(...arguments);
		this.type = "object";
	}
	readValueFromInstance(instance, key) {
		if (isObjectKey(key, instance)) {
			const value = instance[key];
			if (typeof value === "string" || typeof value === "number") return value;
		}
	}
	getBaseTargetFromProps() {}
	removeValueFromRenderState(key, renderState) {
		delete renderState.output[key];
	}
	measureInstanceViewportBox() {
		return createBox();
	}
	build(renderState, latestValues) {
		Object.assign(renderState.output, latestValues);
	}
	renderInstance(instance, { output }) {
		Object.assign(instance, output);
	}
	sortInstanceNodePosition() {
		return 0;
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/svg/utils/path.mjs
const dashKeys = {
	offset: "stroke-dashoffset",
	array: "stroke-dasharray"
};
const camelKeys = {
	offset: "strokeDashoffset",
	array: "strokeDasharray"
};
/**
* Build SVG path properties. Uses the path's measured length to convert
* our custom pathLength, pathSpacing and pathOffset into stroke-dashoffset
* and stroke-dasharray attributes.
*
* This function is mutative to reduce per-frame GC.
*
* Note: We use unitless values for stroke-dasharray and stroke-dashoffset
* because Safari incorrectly scales px values when the page is zoomed.
*/
function buildSVGPath(attrs, length, spacing = 1, offset = 0, useDashCase = true) {
	attrs.pathLength = 1;
	const keys = useDashCase ? dashKeys : camelKeys;
	attrs[keys.offset] = `${-offset}`;
	attrs[keys.array] = `${length} ${spacing}`;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/svg/utils/build-attrs.mjs
/**
* CSS Motion Path properties that should remain as CSS styles on SVG elements.
*/
const cssMotionPathProperties = [
	"offsetDistance",
	"offsetPath",
	"offsetRotate",
	"offsetAnchor"
];
/**
* Build SVG visual attributes, like cx and style.transform
*/
function buildSVGAttrs(state, { attrX, attrY, attrScale, pathLength, pathSpacing = 1, pathOffset = 0, ...latest }, isSVGTag, transformTemplate, styleProp) {
	buildHTMLStyles(state, latest, transformTemplate);
	/**
	* For svg tags we just want to make sure viewBox is animatable and treat all the styles
	* as normal HTML tags.
	*/
	if (isSVGTag) {
		if (state.style.viewBox) state.attrs.viewBox = state.style.viewBox;
		return;
	}
	state.attrs = state.style;
	state.style = {};
	const { attrs, style } = state;
	/**
	* However, we apply transforms as CSS transforms.
	* So if we detect a transform, transformOrigin we take it from attrs and copy it into style.
	*/
	if (attrs.transform) {
		style.transform = attrs.transform;
		delete attrs.transform;
	}
	if (style.transform || attrs.transformOrigin) {
		style.transformOrigin = attrs.transformOrigin ?? "50% 50%";
		delete attrs.transformOrigin;
	}
	if (style.transform) {
		/**
		* SVG's element transform-origin uses its own median as a reference.
		* Therefore, transformBox becomes a fill-box
		*/
		style.transformBox = styleProp?.transformBox ?? "fill-box";
		delete attrs.transformBox;
	}
	for (const key of cssMotionPathProperties) if (attrs[key] !== void 0) {
		style[key] = attrs[key];
		delete attrs[key];
	}
	if (attrX !== void 0) attrs.x = attrX;
	if (attrY !== void 0) attrs.y = attrY;
	if (attrScale !== void 0) attrs.scale = attrScale;
	if (pathLength !== void 0) buildSVGPath(attrs, pathLength, pathSpacing, pathOffset, false);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/svg/utils/camel-case-attrs.mjs
/**
* A set of attribute names that are always read/written as camel case.
*/
const camelCaseAttributes = /* @__PURE__ */ new Set([
	"baseFrequency",
	"diffuseConstant",
	"kernelMatrix",
	"kernelUnitLength",
	"keySplines",
	"keyTimes",
	"limitingConeAngle",
	"markerHeight",
	"markerWidth",
	"numOctaves",
	"targetX",
	"targetY",
	"surfaceScale",
	"specularConstant",
	"specularExponent",
	"stdDeviation",
	"tableValues",
	"viewBox",
	"gradientTransform",
	"pathLength",
	"startOffset",
	"textLength",
	"lengthAdjust"
]);

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/svg/utils/is-svg-tag.mjs
const isSVGTag = (tag) => typeof tag === "string" && tag.toLowerCase() === "svg";

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/svg/utils/render.mjs
function renderSVG(element, renderState, _styleProp, projection) {
	renderHTML(element, renderState, void 0, projection);
	for (const key in renderState.attrs) element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key]);
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/svg/utils/scrape-motion-values.mjs
function scrapeMotionValuesFromProps(props, prevProps, visualElement) {
	const newValues = scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
	for (const key in props) if (isMotionValue(props[key]) || isMotionValue(prevProps[key])) {
		const targetKey = transformPropOrder.indexOf(key) !== -1 ? "attr" + key.charAt(0).toUpperCase() + key.substring(1) : key;
		newValues[targetKey] = props[key];
	}
	return newValues;
}

//#endregion
//#region ../node_modules/motion-dom/dist/es/render/svg/SVGVisualElement.mjs
var SVGVisualElement = class extends DOMVisualElement {
	constructor() {
		super(...arguments);
		this.type = "svg";
		this.isSVGTag = false;
		this.measureInstanceViewportBox = createBox;
	}
	getBaseTargetFromProps(props, key) {
		return props[key];
	}
	readValueFromInstance(instance, key) {
		if (transformProps.has(key)) {
			const defaultType = getDefaultValueType(key);
			return defaultType ? defaultType.default || 0 : 0;
		}
		key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
		return instance.getAttribute(key);
	}
	scrapeMotionValuesFromProps(props, prevProps, visualElement) {
		return scrapeMotionValuesFromProps(props, prevProps, visualElement);
	}
	build(renderState, latestValues, props) {
		buildSVGAttrs(renderState, latestValues, this.isSVGTag, props.transformTemplate, props.style);
	}
	renderInstance(instance, renderState, styleProp, projection) {
		renderSVG(instance, renderState, styleProp, projection);
	}
	mount(instance) {
		this.isSVGTag = isSVGTag(instance.tagName);
		super.mount(instance);
	}
};

//#endregion
//#region ../node_modules/motion-dom/dist/es/animation/animate/single-value.mjs
function animateSingleValue(value, keyframes, options) {
	const motionValue$1 = isMotionValue(value) ? value : motionValue(value);
	motionValue$1.start(animateMotionValue("", motionValue$1, keyframes, options));
	return motionValue$1.animation;
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/animation/utils/is-dom-keyframes.mjs
function isDOMKeyframes(keyframes) {
	return typeof keyframes === "object" && !Array.isArray(keyframes);
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/animation/animate/resolve-subjects.mjs
function resolveSubjects(subject, keyframes, scope, selectorCache) {
	if (subject == null) return [];
	if (typeof subject === "string" && isDOMKeyframes(keyframes)) return resolveElements(subject, scope, selectorCache);
	else if (subject instanceof NodeList) return Array.from(subject);
	else if (Array.isArray(subject)) return subject.filter((s) => s != null);
	else return [subject];
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/animation/sequence/utils/calc-repeat-duration.mjs
function calculateRepeatDuration(duration, repeat, _repeatDelay) {
	return duration * (repeat + 1);
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/animation/sequence/utils/calc-time.mjs
/**
* Given a absolute or relative time definition and current/prev time state of the sequence,
* calculate an absolute time for the next keyframes.
*/
function calcNextTime(current, next, prev, labels) {
	if (typeof next === "number") return next;
	else if (next.startsWith("-") || next.startsWith("+")) return Math.max(0, current + parseFloat(next));
	else if (next === "<") return prev;
	else if (next.startsWith("<")) return Math.max(0, prev + parseFloat(next.slice(1)));
	else return labels.get(next) ?? current;
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/animation/sequence/utils/edit.mjs
function eraseKeyframes(sequence, startTime, endTime) {
	for (let i = 0; i < sequence.length; i++) {
		const keyframe = sequence[i];
		if (keyframe.at > startTime && keyframe.at < endTime) {
			removeItem(sequence, keyframe);
			i--;
		}
	}
}
function addKeyframes(sequence, keyframes, easing, offset, startTime, endTime) {
	/**
	* Erase every existing value between currentTime and targetTime,
	* this will essentially splice this timeline into any currently
	* defined ones.
	*/
	eraseKeyframes(sequence, startTime, endTime);
	for (let i = 0; i < keyframes.length; i++) sequence.push({
		value: keyframes[i],
		at: mixNumber$1(startTime, endTime, offset[i]),
		easing: getEasingForSegment(easing, i)
	});
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/animation/sequence/utils/normalize-times.mjs
/**
* Take an array of times that represent repeated keyframes. For instance
* if we have original times of [0, 0.5, 1] then our repeated times will
* be [0, 0.5, 1, 1, 1.5, 2]. Loop over the times and scale them back
* down to a 0-1 scale.
*/
function normalizeTimes(times, repeat) {
	for (let i = 0; i < times.length; i++) times[i] = times[i] / (repeat + 1);
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/animation/sequence/utils/sort.mjs
function compareByTime(a, b) {
	if (a.at === b.at) {
		if (a.value === null) return 1;
		if (b.value === null) return -1;
		return 0;
	} else return a.at - b.at;
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/animation/sequence/create.mjs
const defaultSegmentEasing = "easeInOut";
const MAX_REPEAT = 20;
function createAnimationsFromSequence(sequence, { defaultTransition = {}, ...sequenceTransition } = {}, scope, generators) {
	const defaultDuration = defaultTransition.duration || .3;
	const animationDefinitions = /* @__PURE__ */ new Map();
	const sequences = /* @__PURE__ */ new Map();
	const elementCache = {};
	const timeLabels = /* @__PURE__ */ new Map();
	let prevTime = 0;
	let currentTime = 0;
	let totalDuration = 0;
	/**
	* Build the timeline by mapping over the sequence array and converting
	* the definitions into keyframes and offsets with absolute time values.
	* These will later get converted into relative offsets in a second pass.
	*/
	for (let i = 0; i < sequence.length; i++) {
		const segment = sequence[i];
		/**
		* If this is a timeline label, mark it and skip the rest of this iteration.
		*/
		if (typeof segment === "string") {
			timeLabels.set(segment, currentTime);
			continue;
		} else if (!Array.isArray(segment)) {
			timeLabels.set(segment.name, calcNextTime(currentTime, segment.at, prevTime, timeLabels));
			continue;
		}
		let [subject, keyframes, transition = {}] = segment;
		/**
		* If a relative or absolute time value has been specified we need to resolve
		* it in relation to the currentTime.
		*/
		if (transition.at !== void 0) currentTime = calcNextTime(currentTime, transition.at, prevTime, timeLabels);
		/**
		* Keep track of the maximum duration in this definition. This will be
		* applied to currentTime once the definition has been parsed.
		*/
		let maxDuration = 0;
		const resolveValueSequence = (valueKeyframes, valueTransition, valueSequence, elementIndex = 0, numSubjects = 0) => {
			const valueKeyframesAsList = keyframesAsList(valueKeyframes);
			const { delay = 0, times = defaultOffset$1(valueKeyframesAsList), type = defaultTransition.type || "keyframes", repeat, repeatType, repeatDelay = 0, ...remainingTransition } = valueTransition;
			let { ease = defaultTransition.ease || "easeOut", duration } = valueTransition;
			/**
			* Resolve stagger() if defined.
			*/
			const calculatedDelay = typeof delay === "function" ? delay(elementIndex, numSubjects) : delay;
			/**
			* If this animation should and can use a spring, generate a spring easing function.
			*/
			const numKeyframes = valueKeyframesAsList.length;
			const createGenerator = isGenerator(type) ? type : generators?.[type || "keyframes"];
			if (numKeyframes <= 2 && createGenerator) {
				/**
				* As we're creating an easing function from a spring,
				* ideally we want to generate it using the real distance
				* between the two keyframes. However this isn't always
				* possible - in these situations we use 0-100.
				*/
				let absoluteDelta = 100;
				if (numKeyframes === 2 && isNumberKeyframesArray(valueKeyframesAsList)) {
					const delta = valueKeyframesAsList[1] - valueKeyframesAsList[0];
					absoluteDelta = Math.abs(delta);
				}
				const springTransition = {
					...defaultTransition,
					...remainingTransition
				};
				if (duration !== void 0) springTransition.duration = secondsToMilliseconds(duration);
				const springEasing = createGeneratorEasing(springTransition, absoluteDelta, createGenerator);
				ease = springEasing.ease;
				duration = springEasing.duration;
			}
			duration ?? (duration = defaultDuration);
			const startTime = currentTime + calculatedDelay;
			/**
			* If there's only one time offset of 0, fill in a second with length 1
			*/
			if (times.length === 1 && times[0] === 0) times[1] = 1;
			/**
			* Fill out if offset if fewer offsets than keyframes
			*/
			const remainder = times.length - valueKeyframesAsList.length;
			remainder > 0 && fillOffset(times, remainder);
			/**
			* If only one value has been set, ie [1], push a null to the start of
			* the keyframe array. This will let us mark a keyframe at this point
			* that will later be hydrated with the previous value.
			*/
			valueKeyframesAsList.length === 1 && valueKeyframesAsList.unshift(null);
			/**
			* Handle repeat options
			*/
			if (repeat) {
				invariant(repeat < MAX_REPEAT, "Repeat count too high, must be less than 20", "repeat-count-high");
				duration = calculateRepeatDuration(duration, repeat);
				const originalKeyframes = [...valueKeyframesAsList];
				const originalTimes = [...times];
				ease = Array.isArray(ease) ? [...ease] : [ease];
				const originalEase = [...ease];
				for (let repeatIndex = 0; repeatIndex < repeat; repeatIndex++) {
					valueKeyframesAsList.push(...originalKeyframes);
					for (let keyframeIndex = 0; keyframeIndex < originalKeyframes.length; keyframeIndex++) {
						times.push(originalTimes[keyframeIndex] + (repeatIndex + 1));
						ease.push(keyframeIndex === 0 ? "linear" : getEasingForSegment(originalEase, keyframeIndex - 1));
					}
				}
				normalizeTimes(times, repeat);
			}
			const targetTime = startTime + duration;
			/**
			* Add keyframes, mapping offsets to absolute time.
			*/
			addKeyframes(valueSequence, valueKeyframesAsList, ease, times, startTime, targetTime);
			maxDuration = Math.max(calculatedDelay + duration, maxDuration);
			totalDuration = Math.max(targetTime, totalDuration);
		};
		if (isMotionValue(subject)) {
			const subjectSequence = getSubjectSequence(subject, sequences);
			resolveValueSequence(keyframes, transition, getValueSequence("default", subjectSequence));
		} else {
			const subjects = resolveSubjects(subject, keyframes, scope, elementCache);
			const numSubjects = subjects.length;
			/**
			* For every element in this segment, process the defined values.
			*/
			for (let subjectIndex = 0; subjectIndex < numSubjects; subjectIndex++) {
				/**
				* Cast necessary, but we know these are of this type
				*/
				keyframes = keyframes;
				transition = transition;
				const thisSubject = subjects[subjectIndex];
				const subjectSequence = getSubjectSequence(thisSubject, sequences);
				for (const key in keyframes) resolveValueSequence(keyframes[key], getValueTransition(transition, key), getValueSequence(key, subjectSequence), subjectIndex, numSubjects);
			}
		}
		prevTime = currentTime;
		currentTime += maxDuration;
	}
	/**
	* For every element and value combination create a new animation.
	*/
	sequences.forEach((valueSequences, element) => {
		for (const key in valueSequences) {
			const valueSequence = valueSequences[key];
			/**
			* Arrange all the keyframes in ascending time order.
			*/
			valueSequence.sort(compareByTime);
			const keyframes = [];
			const valueOffset = [];
			const valueEasing = [];
			/**
			* For each keyframe, translate absolute times into
			* relative offsets based on the total duration of the timeline.
			*/
			for (let i = 0; i < valueSequence.length; i++) {
				const { at, value, easing } = valueSequence[i];
				keyframes.push(value);
				valueOffset.push(progress(0, totalDuration, at));
				valueEasing.push(easing || "easeOut");
			}
			/**
			* If the first keyframe doesn't land on offset: 0
			* provide one by duplicating the initial keyframe. This ensures
			* it snaps to the first keyframe when the animation starts.
			*/
			if (valueOffset[0] !== 0) {
				valueOffset.unshift(0);
				keyframes.unshift(keyframes[0]);
				valueEasing.unshift(defaultSegmentEasing);
			}
			/**
			* If the last keyframe doesn't land on offset: 1
			* provide one with a null wildcard value. This will ensure it
			* stays static until the end of the animation.
			*/
			if (valueOffset[valueOffset.length - 1] !== 1) {
				valueOffset.push(1);
				keyframes.push(null);
			}
			if (!animationDefinitions.has(element)) animationDefinitions.set(element, {
				keyframes: {},
				transition: {}
			});
			const definition = animationDefinitions.get(element);
			definition.keyframes[key] = keyframes;
			/**
			* Exclude `type` from defaultTransition since springs have been
			* converted to duration-based easing functions in resolveValueSequence.
			* Including `type: "spring"` would cause JSAnimation to error when
			* the merged keyframes array has more than 2 keyframes.
			*/
			const { type: _type, ...remainingDefaultTransition } = defaultTransition;
			definition.transition[key] = {
				...remainingDefaultTransition,
				duration: totalDuration,
				ease: valueEasing,
				times: valueOffset,
				...sequenceTransition
			};
		}
	});
	return animationDefinitions;
}
function getSubjectSequence(subject, sequences) {
	!sequences.has(subject) && sequences.set(subject, {});
	return sequences.get(subject);
}
function getValueSequence(name, sequences) {
	if (!sequences[name]) sequences[name] = [];
	return sequences[name];
}
function keyframesAsList(keyframes) {
	return Array.isArray(keyframes) ? keyframes : [keyframes];
}
function getValueTransition(transition, key) {
	return transition && transition[key] ? {
		...transition,
		...transition[key]
	} : { ...transition };
}
const isNumber = (keyframe) => typeof keyframe === "number";
const isNumberKeyframesArray = (keyframes) => keyframes.every(isNumber);

//#endregion
//#region ../node_modules/framer-motion/dist/es/animation/utils/create-visual-element.mjs
function createDOMVisualElement(element) {
	const options = {
		presenceContext: null,
		props: {},
		visualState: {
			renderState: {
				transform: {},
				transformOrigin: {},
				style: {},
				vars: {},
				attrs: {}
			},
			latestValues: {}
		}
	};
	const node = isSVGElement(element) && !isSVGSVGElement(element) ? new SVGVisualElement(options) : new HTMLVisualElement(options);
	node.mount(element);
	visualElementStore.set(element, node);
}
function createObjectVisualElement(subject) {
	const node = new ObjectVisualElement({
		presenceContext: null,
		props: {},
		visualState: {
			renderState: { output: {} },
			latestValues: {}
		}
	});
	node.mount(subject);
	visualElementStore.set(subject, node);
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/animation/animate/subject.mjs
function isSingleValue(subject, keyframes) {
	return isMotionValue(subject) || typeof subject === "number" || typeof subject === "string" && !isDOMKeyframes(keyframes);
}
/**
* Implementation
*/
function animateSubject(subject, keyframes, options, scope) {
	const animations = [];
	if (isSingleValue(subject, keyframes)) animations.push(animateSingleValue(subject, isDOMKeyframes(keyframes) ? keyframes.default || keyframes : keyframes, options ? options.default || options : options));
	else {
		if (subject == null) return animations;
		const subjects = resolveSubjects(subject, keyframes, scope);
		const numSubjects = subjects.length;
		invariant(Boolean(numSubjects), "No valid elements provided.", "no-valid-elements");
		for (let i = 0; i < numSubjects; i++) {
			const thisSubject = subjects[i];
			const createVisualElement = thisSubject instanceof Element ? createDOMVisualElement : createObjectVisualElement;
			if (!visualElementStore.has(thisSubject)) createVisualElement(thisSubject);
			const visualElement = visualElementStore.get(thisSubject);
			const transition = { ...options };
			/**
			* Resolve stagger function if provided.
			*/
			if ("delay" in transition && typeof transition.delay === "function") transition.delay = transition.delay(i, numSubjects);
			animations.push(...animateTarget(visualElement, {
				...keyframes,
				transition
			}, {}));
		}
	}
	return animations;
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/animation/animate/sequence.mjs
function animateSequence(sequence, options, scope) {
	const animations = [];
	/**
	* Pre-process: replace function segments with MotionValue segments,
	* subscribe callbacks immediately
	*/
	const processedSequence = sequence.map((segment) => {
		if (Array.isArray(segment) && typeof segment[0] === "function") {
			const callback = segment[0];
			const mv = motionValue(0);
			mv.on("change", callback);
			if (segment.length === 1) return [mv, [0, 1]];
			else if (segment.length === 2) return [
				mv,
				[0, 1],
				segment[1]
			];
			else return [
				mv,
				segment[1],
				segment[2]
			];
		}
		return segment;
	});
	createAnimationsFromSequence(processedSequence, options, scope, { spring }).forEach(({ keyframes, transition }, subject) => {
		animations.push(...animateSubject(subject, keyframes, transition));
	});
	return animations;
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/animation/animate/index.mjs
function isSequence(value) {
	return Array.isArray(value) && value.some(Array.isArray);
}
/**
* Creates an animation function that is optionally scoped
* to a specific element.
*/
function createScopedAnimate(options = {}) {
	const { scope, reduceMotion } = options;
	/**
	* Implementation
	*/
	function scopedAnimate(subjectOrSequence, optionsOrKeyframes, options) {
		let animations = [];
		let animationOnComplete;
		if (isSequence(subjectOrSequence)) {
			const { onComplete, ...sequenceOptions } = optionsOrKeyframes || {};
			if (typeof onComplete === "function") animationOnComplete = onComplete;
			animations = animateSequence(subjectOrSequence, reduceMotion !== void 0 ? {
				reduceMotion,
				...sequenceOptions
			} : sequenceOptions, scope);
		} else {
			const { onComplete, ...rest } = options || {};
			if (typeof onComplete === "function") animationOnComplete = onComplete;
			animations = animateSubject(subjectOrSequence, optionsOrKeyframes, reduceMotion !== void 0 ? {
				reduceMotion,
				...rest
			} : rest, scope);
		}
		const animation = new GroupAnimationWithThen(animations);
		if (animationOnComplete) animation.finished.then(animationOnComplete);
		if (scope) {
			scope.animations.push(animation);
			animation.finished.then(() => {
				removeItem(scope.animations, animation);
			});
		}
		return animation;
	}
	return scopedAnimate;
}
const animate = createScopedAnimate();

//#endregion
//#region ../node_modules/framer-motion/dist/es/render/dom/scroll/utils/can-use-native-timeline.mjs
function canUseNativeTimeline(target) {
	if (typeof window === "undefined") return false;
	return target ? supportsViewTimeline() : supportsScrollTimeline();
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/render/dom/scroll/info.mjs
/**
* A time in milliseconds, beyond which we consider the scroll velocity to be 0.
*/
const maxElapsed = 50;
const createAxisInfo = () => ({
	current: 0,
	offset: [],
	progress: 0,
	scrollLength: 0,
	targetOffset: 0,
	targetLength: 0,
	containerLength: 0,
	velocity: 0
});
const createScrollInfo = () => ({
	time: 0,
	x: createAxisInfo(),
	y: createAxisInfo()
});
const keys = {
	x: {
		length: "Width",
		position: "Left"
	},
	y: {
		length: "Height",
		position: "Top"
	}
};
function updateAxisInfo(element, axisName, info, time) {
	const axis = info[axisName];
	const { length, position } = keys[axisName];
	const prev = axis.current;
	const prevTime = info.time;
	axis.current = Math.abs(element[`scroll${position}`]);
	axis.scrollLength = element[`scroll${length}`] - element[`client${length}`];
	axis.offset.length = 0;
	axis.offset[0] = 0;
	axis.offset[1] = axis.scrollLength;
	axis.progress = progress(0, axis.scrollLength, axis.current);
	const elapsed = time - prevTime;
	axis.velocity = elapsed > maxElapsed ? 0 : velocityPerSecond(axis.current - prev, elapsed);
}
function updateScrollInfo(element, info, time) {
	updateAxisInfo(element, "x", info, time);
	updateAxisInfo(element, "y", info, time);
	info.time = time;
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/render/dom/scroll/offsets/inset.mjs
function calcInset(element, container) {
	const inset = {
		x: 0,
		y: 0
	};
	let current = element;
	while (current && current !== container) if (isHTMLElement(current)) {
		inset.x += current.offsetLeft;
		inset.y += current.offsetTop;
		current = current.offsetParent;
	} else if (current.tagName === "svg") {
		/**
		* This isn't an ideal approach to measuring the offset of <svg /> tags.
		* It would be preferable, given they behave like HTMLElements in most ways
		* to use offsetLeft/Top. But these don't exist on <svg />. Likewise we
		* can't use .getBBox() like most SVG elements as these provide the offset
		* relative to the SVG itself, which for <svg /> is usually 0x0.
		*/
		const svgBoundingBox = current.getBoundingClientRect();
		current = current.parentElement;
		const parentBoundingBox = current.getBoundingClientRect();
		inset.x += svgBoundingBox.left - parentBoundingBox.left;
		inset.y += svgBoundingBox.top - parentBoundingBox.top;
	} else if (current instanceof SVGGraphicsElement) {
		const { x, y } = current.getBBox();
		inset.x += x;
		inset.y += y;
		let svg = null;
		let parent = current.parentNode;
		while (!svg) {
			if (parent.tagName === "svg") svg = parent;
			parent = current.parentNode;
		}
		current = svg;
	} else break;
	return inset;
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/render/dom/scroll/offsets/edge.mjs
const namedEdges = {
	start: 0,
	center: .5,
	end: 1
};
function resolveEdge(edge, length, inset = 0) {
	let delta = 0;
	/**
	* If we have this edge defined as a preset, replace the definition
	* with the numerical value.
	*/
	if (edge in namedEdges) edge = namedEdges[edge];
	/**
	* Handle unit values
	*/
	if (typeof edge === "string") {
		const asNumber = parseFloat(edge);
		if (edge.endsWith("px")) delta = asNumber;
		else if (edge.endsWith("%")) edge = asNumber / 100;
		else if (edge.endsWith("vw")) delta = asNumber / 100 * document.documentElement.clientWidth;
		else if (edge.endsWith("vh")) delta = asNumber / 100 * document.documentElement.clientHeight;
		else edge = asNumber;
	}
	/**
	* If the edge is defined as a number, handle as a progress value.
	*/
	if (typeof edge === "number") delta = length * edge;
	return inset + delta;
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/render/dom/scroll/offsets/offset.mjs
const defaultOffset = [0, 0];
function resolveOffset(offset, containerLength, targetLength, targetInset) {
	let offsetDefinition = Array.isArray(offset) ? offset : defaultOffset;
	let targetPoint = 0;
	let containerPoint = 0;
	if (typeof offset === "number")
 /**
	* If we're provided offset: [0, 0.5, 1] then each number x should become
	* [x, x], so we default to the behaviour of mapping 0 => 0 of both target
	* and container etc.
	*/
	offsetDefinition = [offset, offset];
	else if (typeof offset === "string") {
		offset = offset.trim();
		if (offset.includes(" ")) offsetDefinition = offset.split(" ");
		else
 /**
		* If we're provided a definition like "100px" then we want to apply
		* that only to the top of the target point, leaving the container at 0.
		* Whereas a named offset like "end" should be applied to both.
		*/
		offsetDefinition = [offset, namedEdges[offset] ? offset : `0`];
	}
	targetPoint = resolveEdge(offsetDefinition[0], targetLength, targetInset);
	containerPoint = resolveEdge(offsetDefinition[1], containerLength);
	return targetPoint - containerPoint;
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/render/dom/scroll/offsets/presets.mjs
const ScrollOffset = {
	Enter: [[0, 1], [1, 1]],
	Exit: [[0, 0], [1, 0]],
	Any: [[1, 0], [0, 1]],
	All: [[0, 0], [1, 1]]
};

//#endregion
//#region ../node_modules/framer-motion/dist/es/render/dom/scroll/offsets/index.mjs
const point = {
	x: 0,
	y: 0
};
function getTargetSize(target) {
	return "getBBox" in target && target.tagName !== "svg" ? target.getBBox() : {
		width: target.clientWidth,
		height: target.clientHeight
	};
}
function resolveOffsets(container, info, options) {
	const { offset: offsetDefinition = ScrollOffset.All } = options;
	const { target = container, axis = "y" } = options;
	const lengthLabel = axis === "y" ? "height" : "width";
	const inset = target !== container ? calcInset(target, container) : point;
	/**
	* Measure the target and container. If they're the same thing then we
	* use the container's scrollWidth/Height as the target, from there
	* all other calculations can remain the same.
	*/
	const targetSize = target === container ? {
		width: container.scrollWidth,
		height: container.scrollHeight
	} : getTargetSize(target);
	const containerSize = {
		width: container.clientWidth,
		height: container.clientHeight
	};
	/**
	* Reset the length of the resolved offset array rather than creating a new one.
	* TODO: More reusable data structures for targetSize/containerSize would also be good.
	*/
	info[axis].offset.length = 0;
	/**
	* Populate the offset array by resolving the user's offset definition into
	* a list of pixel scroll offets.
	*/
	let hasChanged = !info[axis].interpolate;
	const numOffsets = offsetDefinition.length;
	for (let i = 0; i < numOffsets; i++) {
		const offset = resolveOffset(offsetDefinition[i], containerSize[lengthLabel], targetSize[lengthLabel], inset[axis]);
		if (!hasChanged && offset !== info[axis].interpolatorOffsets[i]) hasChanged = true;
		info[axis].offset[i] = offset;
	}
	/**
	* If the pixel scroll offsets have changed, create a new interpolator function
	* to map scroll value into a progress.
	*/
	if (hasChanged) {
		info[axis].interpolate = interpolate(info[axis].offset, defaultOffset$1(offsetDefinition), { clamp: false });
		info[axis].interpolatorOffsets = [...info[axis].offset];
	}
	info[axis].progress = clamp(0, 1, info[axis].interpolate(info[axis].current));
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/render/dom/scroll/on-scroll-handler.mjs
function measure(container, target = container, info) {
	/**
	* Find inset of target within scrollable container
	*/
	info.x.targetOffset = 0;
	info.y.targetOffset = 0;
	if (target !== container) {
		let node = target;
		while (node && node !== container) {
			info.x.targetOffset += node.offsetLeft;
			info.y.targetOffset += node.offsetTop;
			node = node.offsetParent;
		}
	}
	info.x.targetLength = target === container ? target.scrollWidth : target.clientWidth;
	info.y.targetLength = target === container ? target.scrollHeight : target.clientHeight;
	info.x.containerLength = container.clientWidth;
	info.y.containerLength = container.clientHeight;
	if (container && target && target !== container) warnOnce(getComputedStyle(container).position !== "static", "Please ensure that the container has a non-static position, like 'relative', 'fixed', or 'absolute' to ensure scroll offset is calculated correctly.");
}
function createOnScrollHandler(element, onScroll, info, options = {}) {
	return {
		measure: (time) => {
			measure(element, options.target, info);
			updateScrollInfo(element, info, time);
			if (options.offset || options.target) resolveOffsets(element, info, options);
		},
		notify: () => onScroll(info)
	};
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/render/dom/scroll/track.mjs
const scrollListeners = /* @__PURE__ */ new WeakMap();
const resizeListeners = /* @__PURE__ */ new WeakMap();
const onScrollHandlers = /* @__PURE__ */ new WeakMap();
const scrollSize = /* @__PURE__ */ new WeakMap();
const dimensionCheckProcesses = /* @__PURE__ */ new WeakMap();
const getEventTarget = (element) => element === document.scrollingElement ? window : element;
function scrollInfo(onScroll, { container = document.scrollingElement, trackContentSize = false, ...options } = {}) {
	if (!container) return noop;
	let containerHandlers = onScrollHandlers.get(container);
	/**
	* Get the onScroll handlers for this container.
	* If one isn't found, create a new one.
	*/
	if (!containerHandlers) {
		containerHandlers = /* @__PURE__ */ new Set();
		onScrollHandlers.set(container, containerHandlers);
	}
	/**
	* Create a new onScroll handler for the provided callback.
	*/
	const info = createScrollInfo();
	const containerHandler = createOnScrollHandler(container, onScroll, info, options);
	containerHandlers.add(containerHandler);
	/**
	* Check if there's a scroll event listener for this container.
	* If not, create one.
	*/
	if (!scrollListeners.has(container)) {
		const measureAll = () => {
			for (const handler of containerHandlers) handler.measure(frameData.timestamp);
			frame.preUpdate(notifyAll);
		};
		const notifyAll = () => {
			for (const handler of containerHandlers) handler.notify();
		};
		const listener = () => frame.read(measureAll);
		scrollListeners.set(container, listener);
		const target = getEventTarget(container);
		window.addEventListener("resize", listener);
		if (container !== document.documentElement) resizeListeners.set(container, resize(container, listener));
		target.addEventListener("scroll", listener);
		listener();
	}
	/**
	* Enable content size tracking if requested and not already enabled.
	*/
	if (trackContentSize && !dimensionCheckProcesses.has(container)) {
		const listener = scrollListeners.get(container);
		const size = {
			width: container.scrollWidth,
			height: container.scrollHeight
		};
		scrollSize.set(container, size);
		const checkScrollDimensions = () => {
			const newWidth = container.scrollWidth;
			const newHeight = container.scrollHeight;
			if (size.width !== newWidth || size.height !== newHeight) {
				listener();
				size.width = newWidth;
				size.height = newHeight;
			}
		};
		const dimensionCheckProcess = frame.read(checkScrollDimensions, true);
		dimensionCheckProcesses.set(container, dimensionCheckProcess);
	}
	const listener = scrollListeners.get(container);
	frame.read(listener, false, true);
	return () => {
		cancelFrame(listener);
		/**
		* Check if we even have any handlers for this container.
		*/
		const currentHandlers = onScrollHandlers.get(container);
		if (!currentHandlers) return;
		currentHandlers.delete(containerHandler);
		if (currentHandlers.size) return;
		/**
		* If no more handlers, remove the scroll listener too.
		*/
		const scrollListener = scrollListeners.get(container);
		scrollListeners.delete(container);
		if (scrollListener) {
			getEventTarget(container).removeEventListener("scroll", scrollListener);
			resizeListeners.get(container)?.();
			window.removeEventListener("resize", scrollListener);
		}
		const dimensionCheckProcess = dimensionCheckProcesses.get(container);
		if (dimensionCheckProcess) {
			cancelFrame(dimensionCheckProcess);
			dimensionCheckProcesses.delete(container);
		}
		scrollSize.delete(container);
	};
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/render/dom/scroll/utils/offset-to-range.mjs
/**
* Maps from ProgressIntersection pairs used by Motion's preset offsets to
* ViewTimeline named ranges. Returns undefined for unrecognised patterns,
* which signals the caller to fall back to JS-based scroll tracking.
*/
const presets = [
	[ScrollOffset.Enter, "entry"],
	[ScrollOffset.Exit, "exit"],
	[ScrollOffset.Any, "cover"],
	[ScrollOffset.All, "contain"]
];
function matchesPreset(offset, preset) {
	if (offset.length !== 2) return false;
	for (let i = 0; i < 2; i++) {
		const o = offset[i];
		const p = preset[i];
		if (!Array.isArray(o) || o.length !== 2 || o[0] !== p[0] || o[1] !== p[1]) return false;
	}
	return true;
}
function offsetToViewTimelineRange(offset) {
	if (!offset) return {
		rangeStart: "contain 0%",
		rangeEnd: "contain 100%"
	};
	for (const [preset, name] of presets) if (matchesPreset(offset, preset)) return {
		rangeStart: `${name} 0%`,
		rangeEnd: `${name} 100%`
	};
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/render/dom/scroll/utils/get-timeline.mjs
const timelineCache = /* @__PURE__ */ new Map();
function scrollTimelineFallback(options) {
	const currentTime = { value: 0 };
	return {
		currentTime,
		cancel: scrollInfo((info) => {
			currentTime.value = info[options.axis].progress * 100;
		}, options)
	};
}
function getTimeline({ source, container, ...options }) {
	const { axis } = options;
	if (source) container = source;
	let containerCache = timelineCache.get(container);
	if (!containerCache) {
		containerCache = /* @__PURE__ */ new Map();
		timelineCache.set(container, containerCache);
	}
	const targetKey = options.target ?? "self";
	let targetCache = containerCache.get(targetKey);
	if (!targetCache) {
		targetCache = {};
		containerCache.set(targetKey, targetCache);
	}
	const axisKey = axis + (options.offset ?? []).join(",");
	if (!targetCache[axisKey]) {
		if (options.target && canUseNativeTimeline(options.target)) {
			if (offsetToViewTimelineRange(options.offset)) targetCache[axisKey] = new ViewTimeline({
				subject: options.target,
				axis
			});
			else targetCache[axisKey] = scrollTimelineFallback({
				container,
				...options
			});
		} else if (canUseNativeTimeline()) targetCache[axisKey] = new ScrollTimeline({
			source: container,
			axis
		});
		else targetCache[axisKey] = scrollTimelineFallback({
			container,
			...options
		});
	}
	return targetCache[axisKey];
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/render/dom/scroll/attach-animation.mjs
function attachToAnimation(animation, options) {
	const timeline = getTimeline(options);
	const range = options.target ? offsetToViewTimelineRange(options.offset) : void 0;
	/**
	* Use native timeline when:
	* - No target: ScrollTimeline (existing behaviour)
	* - Target with mappable offset: ViewTimeline with named range
	* - Target with unmappable offset: fall back to JS observe
	*/
	const useNative = options.target ? canUseNativeTimeline(options.target) && !!range : canUseNativeTimeline();
	return animation.attachTimeline({
		timeline: useNative ? timeline : void 0,
		...range && useNative && {
			rangeStart: range.rangeStart,
			rangeEnd: range.rangeEnd
		},
		observe: (valueAnimation) => {
			valueAnimation.pause();
			return observeTimeline((progress) => {
				valueAnimation.time = valueAnimation.iterationDuration * progress;
			}, timeline);
		}
	});
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/render/dom/scroll/attach-function.mjs
/**
* If the onScroll function has two arguments, it's expecting
* more specific information about the scroll from scrollInfo.
*/
function isOnScrollWithInfo(onScroll) {
	return onScroll.length === 2;
}
function attachToFunction(onScroll, options) {
	if (isOnScrollWithInfo(onScroll)) return scrollInfo((info) => {
		onScroll(info[options.axis].progress, info);
	}, options);
	else return observeTimeline(onScroll, getTimeline(options));
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/render/dom/scroll/index.mjs
function scroll(onScroll, { axis = "y", container = document.scrollingElement, ...options } = {}) {
	if (!container) return noop;
	const optionsWithDefaults = {
		axis,
		container,
		...options
	};
	return typeof onScroll === "function" ? attachToFunction(onScroll, optionsWithDefaults) : attachToAnimation(onScroll, optionsWithDefaults);
}

//#endregion
//#region ../node_modules/framer-motion/dist/es/render/dom/viewport/index.mjs
const thresholds = {
	some: 0,
	all: 1
};
function inView(elementOrSelector, onStart, { root, margin: rootMargin, amount = "some" } = {}) {
	const elements = resolveElements(elementOrSelector);
	const activeIntersections = /* @__PURE__ */ new WeakMap();
	const onIntersectionChange = (entries) => {
		entries.forEach((entry) => {
			const onEnd = activeIntersections.get(entry.target);
			/**
			* If there's no change to the intersection, we don't need to
			* do anything here.
			*/
			if (entry.isIntersecting === Boolean(onEnd)) return;
			if (entry.isIntersecting) {
				const newOnEnd = onStart(entry.target, entry);
				if (typeof newOnEnd === "function") activeIntersections.set(entry.target, newOnEnd);
				else observer.unobserve(entry.target);
			} else if (typeof onEnd === "function") {
				onEnd(entry);
				activeIntersections.delete(entry.target);
			}
		});
	};
	const observer = new IntersectionObserver(onIntersectionChange, {
		root,
		rootMargin,
		threshold: typeof amount === "number" ? amount : thresholds[amount]
	});
	elements.forEach((element) => observer.observe(element));
	return () => observer.disconnect();
}

//#endregion
export { animate, animateView, inView, motionValue, scroll, springValue, styleEffect, supportsScrollTimeline, supportsViewTimeline, transform, transformValue };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVuZG9yLm1vdGlvbi5qcyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLXV0aWxzL2Rpc3QvZXMvYXJyYXkubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL2NsYW1wLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9mb3JtYXQtZXJyb3ItbWVzc2FnZS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLXV0aWxzL2Rpc3QvZXMvZXJyb3JzLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9nbG9iYWwtY29uZmlnLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9pcy1udW1lcmljYWwtc3RyaW5nLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9pcy1vYmplY3QubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL2lzLXplcm8tdmFsdWUtc3RyaW5nLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9tZW1vLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9ub29wLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9waXBlLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9wcm9ncmVzcy5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLXV0aWxzL2Rpc3QvZXMvc3Vic2NyaXB0aW9uLW1hbmFnZXIubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL3RpbWUtY29udmVyc2lvbi5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLXV0aWxzL2Rpc3QvZXMvdmVsb2NpdHktcGVyLXNlY29uZC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLXV0aWxzL2Rpc3QvZXMvd2Fybi1vbmNlLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy93cmFwLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9lYXNpbmcvY3ViaWMtYmV6aWVyLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9lYXNpbmcvbW9kaWZpZXJzL21pcnJvci5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLXV0aWxzL2Rpc3QvZXMvZWFzaW5nL21vZGlmaWVycy9yZXZlcnNlLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9lYXNpbmcvYmFjay5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLXV0aWxzL2Rpc3QvZXMvZWFzaW5nL2FudGljaXBhdGUubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL2Vhc2luZy9jaXJjLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9lYXNpbmcvZWFzZS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLXV0aWxzL2Rpc3QvZXMvZWFzaW5nL3V0aWxzL2lzLWVhc2luZy1hcnJheS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLXV0aWxzL2Rpc3QvZXMvZWFzaW5nL3V0aWxzL2dldC1lYXNpbmctZm9yLXNlZ21lbnQubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL2Vhc2luZy91dGlscy9pcy1iZXppZXItZGVmaW5pdGlvbi5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLXV0aWxzL2Rpc3QvZXMvZWFzaW5nL3V0aWxzL21hcC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2ZyYW1lbG9vcC9vcmRlci5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3N0YXRzL2J1ZmZlci5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2ZyYW1lbG9vcC9yZW5kZXItc3RlcC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2ZyYW1lbG9vcC9iYXRjaGVyLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvZnJhbWVsb29wL2ZyYW1lLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvZnJhbWVsb29wL3N5bmMtdGltZS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3N0YXRzL2FuaW1hdGlvbi1jb3VudC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi91dGlscy9pcy1jc3MtdmFyaWFibGUubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS90eXBlcy9udW1iZXJzL2luZGV4Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdHlwZXMvdXRpbHMvc2FuaXRpemUubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS90eXBlcy91dGlscy9mbG9hdC1yZWdleC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3R5cGVzL3V0aWxzL2lzLW51bGxpc2gubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS90eXBlcy91dGlscy9zaW5nbGUtY29sb3ItcmVnZXgubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS90eXBlcy9jb2xvci91dGlscy5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3R5cGVzL2NvbG9yL3JnYmEubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS90eXBlcy9jb2xvci9oZXgubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS90eXBlcy9udW1iZXJzL3VuaXRzLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdHlwZXMvY29sb3IvaHNsYS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3R5cGVzL2NvbG9yL2luZGV4Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdHlwZXMvdXRpbHMvY29sb3ItcmVnZXgubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS90eXBlcy9jb21wbGV4L2luZGV4Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdHlwZXMvY29sb3IvaHNsYS10by1yZ2JhLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdXRpbHMvbWl4L2ltbWVkaWF0ZS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3V0aWxzL21peC9udW1iZXIubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy91dGlscy9taXgvY29sb3IubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy91dGlscy9taXgvdmlzaWJpbGl0eS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3V0aWxzL21peC9jb21wbGV4Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdXRpbHMvbWl4L2luZGV4Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL2RyaXZlcnMvZnJhbWUubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vd2FhcGkvdXRpbHMvbGluZWFyLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL2dlbmVyYXRvcnMvdXRpbHMvY2FsYy1kdXJhdGlvbi5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9nZW5lcmF0b3JzL3V0aWxzL2NyZWF0ZS1nZW5lcmF0b3ItZWFzaW5nLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL2dlbmVyYXRvcnMvc3ByaW5nLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL2dlbmVyYXRvcnMvdXRpbHMvdmVsb2NpdHkubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vZ2VuZXJhdG9ycy9pbmVydGlhLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdXRpbHMvaW50ZXJwb2xhdGUubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24va2V5ZnJhbWVzL29mZnNldHMvZmlsbC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9rZXlmcmFtZXMvb2Zmc2V0cy9kZWZhdWx0Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL2tleWZyYW1lcy9vZmZzZXRzL3RpbWUubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vZ2VuZXJhdG9ycy9rZXlmcmFtZXMubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24va2V5ZnJhbWVzL2dldC1maW5hbC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi91dGlscy9yZXBsYWNlLXRyYW5zaXRpb24tdHlwZS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi91dGlscy9XaXRoUHJvbWlzZS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9KU0FuaW1hdGlvbi5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9rZXlmcmFtZXMvdXRpbHMvZmlsbC13aWxkY2FyZHMubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvZG9tL3BhcnNlLXRyYW5zZm9ybS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3JlbmRlci91dGlscy9rZXlzLXRyYW5zZm9ybS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9rZXlmcmFtZXMvdXRpbHMvdW5pdC1jb252ZXJzaW9uLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL2tleWZyYW1lcy9LZXlmcmFtZXNSZXNvbHZlci5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3JlbmRlci9kb20vaXMtY3NzLXZhci5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3JlbmRlci9kb20vc3R5bGUtc2V0Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdXRpbHMvc3VwcG9ydHMvZmxhZ3MubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy91dGlscy9zdXBwb3J0cy9tZW1vLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdXRpbHMvc3VwcG9ydHMvc2Nyb2xsLXRpbWVsaW5lLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdXRpbHMvc3VwcG9ydHMvbGluZWFyLWVhc2luZy5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi93YWFwaS9lYXNpbmcvY3ViaWMtYmV6aWVyLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL3dhYXBpL2Vhc2luZy9zdXBwb3J0ZWQubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vd2FhcGkvZWFzaW5nL21hcC1lYXNpbmcubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vd2FhcGkvc3RhcnQtd2FhcGktYW5pbWF0aW9uLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL2dlbmVyYXRvcnMvdXRpbHMvaXMtZ2VuZXJhdG9yLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL3dhYXBpL3V0aWxzL2FwcGx5LWdlbmVyYXRvci5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9OYXRpdmVBbmltYXRpb24ubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vd2FhcGkvdXRpbHMvdW5zdXBwb3J0ZWQtZWFzaW5nLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL05hdGl2ZUFuaW1hdGlvbkV4dGVuZGVkLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL3V0aWxzL2lzLWFuaW1hdGFibGUubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vdXRpbHMvY2FuLWFuaW1hdGUubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vdXRpbHMvbWFrZS1hbmltYXRpb24taW5zdGFudC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi93YWFwaS9zdXBwb3J0cy93YWFwaS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9Bc3luY01vdGlvblZhbHVlQW5pbWF0aW9uLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL0dyb3VwQW5pbWF0aW9uLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL0dyb3VwQW5pbWF0aW9uV2l0aFRoZW4ubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vTmF0aXZlQW5pbWF0aW9uV3JhcHBlci5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi91dGlscy9jc3MtdmFyaWFibGVzLWNvbnZlcnNpb24ubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vdXRpbHMvZGVmYXVsdC10cmFuc2l0aW9ucy5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi91dGlscy9nZXQtZmluYWwta2V5ZnJhbWUubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vdXRpbHMvcmVzb2x2ZS10cmFuc2l0aW9uLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL3V0aWxzL2dldC12YWx1ZS10cmFuc2l0aW9uLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL3V0aWxzL2lzLXRyYW5zaXRpb24tZGVmaW5lZC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9pbnRlcmZhY2VzL21vdGlvbi12YWx1ZS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3JlbmRlci91dGlscy9yZXNvbHZlLXZhcmlhbnRzLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcmVuZGVyL3V0aWxzL3Jlc29sdmUtZHluYW1pYy12YXJpYW50cy5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3JlbmRlci91dGlscy9rZXlzLXBvc2l0aW9uLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvaW5kZXgubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvdXRpbHMvaXMta2V5ZnJhbWVzLXRhcmdldC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3JlbmRlci91dGlscy9zZXR0ZXJzLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdXRpbHMvaXMtbW90aW9uLXZhbHVlLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvd2lsbC1jaGFuZ2UvaXMubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS93aWxsLWNoYW5nZS9hZGQtd2lsbC1jaGFuZ2UubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvZG9tL3V0aWxzL2NhbWVsLXRvLWRhc2gubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vb3B0aW1pemVkLWFwcGVhci9kYXRhLWlkLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL29wdGltaXplZC1hcHBlYXIvZ2V0LWFwcGVhci1pZC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9pbnRlcmZhY2VzL3Zpc3VhbC1lbGVtZW50LXRhcmdldC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3R5cGVzL2F1dG8ubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS90eXBlcy90ZXN0Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdHlwZXMvZGltZW5zaW9ucy5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9rZXlmcmFtZXMvdXRpbHMvaXMtbm9uZS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3R5cGVzL2NvbXBsZXgvZmlsdGVyLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdHlwZXMvY29tcGxleC9tYXNrLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdHlwZXMvaW50Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdHlwZXMvbWFwcy90cmFuc2Zvcm0ubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS90eXBlcy9tYXBzL251bWJlci5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3R5cGVzL21hcHMvZGVmYXVsdHMubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS90eXBlcy91dGlscy9hbmltYXRhYmxlLW5vbmUubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24va2V5ZnJhbWVzL3V0aWxzL21ha2Utbm9uZS1hbmltYXRhYmxlLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL2tleWZyYW1lcy9ET01LZXlmcmFtZXNSZXNvbHZlci5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi93YWFwaS91dGlscy9hY2NlbGVyYXRlZC12YWx1ZXMubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy91dGlscy9yZXNvbHZlLWVsZW1lbnRzLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvZWZmZWN0cy91dGlscy9jcmVhdGUtZG9tLWVmZmVjdC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3R5cGVzL3V0aWxzL2dldC1hcy10eXBlLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvZWZmZWN0cy9Nb3Rpb25WYWx1ZVN0YXRlLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvZWZmZWN0cy91dGlscy9jcmVhdGUtZWZmZWN0Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdXRpbHMvaXMtaHRtbC1lbGVtZW50Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvZWZmZWN0cy9zdHlsZS90cmFuc2Zvcm0ubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9lZmZlY3RzL3N0eWxlL2luZGV4Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvZnJhbWVsb29wL21pY3JvdGFzay5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3V0aWxzL2lzLXN2Zy1lbGVtZW50Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcmVzaXplL2hhbmRsZS1lbGVtZW50Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcmVzaXplL2hhbmRsZS13aW5kb3cubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZXNpemUvaW5kZXgubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9zY3JvbGwvb2JzZXJ2ZS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3V0aWxzL2lzLXN2Zy1zdmctZWxlbWVudC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3V0aWxzL3RyYW5zZm9ybS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL2ZvbGxvdy12YWx1ZS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3N1YnNjcmliZS12YWx1ZS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3RyYW5zZm9ybS12YWx1ZS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3NwcmluZy12YWx1ZS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3R5cGVzL3V0aWxzL2ZpbmQubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92aWV3L3V0aWxzL2Nob29zZS1sYXllci10eXBlLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmlldy91dGlscy9jc3MubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92aWV3L3V0aWxzL2dldC1sYXllci1pbmZvLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmlldy91dGlscy9nZXQtdmlldy1hbmltYXRpb25zLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmlldy91dGlscy9oYXMtdGFyZ2V0Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmlldy9zdGFydC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZpZXcvcXVldWUubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92aWV3L2luZGV4Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcHJvamVjdGlvbi9nZW9tZXRyeS9tb2RlbHMubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvc3RvcmUubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvdXRpbHMvaXMtYW5pbWF0aW9uLWNvbnRyb2xzLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcmVuZGVyL3V0aWxzL2lzLXZhcmlhbnQtbGFiZWwubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvdXRpbHMvdmFyaWFudC1wcm9wcy5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3JlbmRlci91dGlscy9pcy1jb250cm9sbGluZy12YXJpYW50cy5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3JlbmRlci91dGlscy9tb3Rpb24tdmFsdWVzLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcmVuZGVyL3V0aWxzL3JlZHVjZWQtbW90aW9uL3N0YXRlLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcmVuZGVyL3V0aWxzL3JlZHVjZWQtbW90aW9uL2luZGV4Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcmVuZGVyL1Zpc3VhbEVsZW1lbnQubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvZG9tL0RPTVZpc3VhbEVsZW1lbnQubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9wcm9qZWN0aW9uL2dlb21ldHJ5L2NvbnZlcnNpb24ubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9wcm9qZWN0aW9uL3V0aWxzL21lYXN1cmUubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvaHRtbC91dGlscy9idWlsZC10cmFuc2Zvcm0ubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvaHRtbC91dGlscy9idWlsZC1zdHlsZXMubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvaHRtbC91dGlscy9yZW5kZXIubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9wcm9qZWN0aW9uL3N0eWxlcy9zY2FsZS1ib3JkZXItcmFkaXVzLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcHJvamVjdGlvbi9zdHlsZXMvc2NhbGUtYm94LXNoYWRvdy5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3Byb2plY3Rpb24vc3R5bGVzL3NjYWxlLWNvcnJlY3Rpb24ubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvdXRpbHMvaXMtZm9yY2VkLW1vdGlvbi12YWx1ZS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3JlbmRlci9odG1sL3V0aWxzL3NjcmFwZS1tb3Rpb24tdmFsdWVzLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcmVuZGVyL2h0bWwvSFRNTFZpc3VhbEVsZW1lbnQubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvb2JqZWN0L09iamVjdFZpc3VhbEVsZW1lbnQubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvc3ZnL3V0aWxzL3BhdGgubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvc3ZnL3V0aWxzL2J1aWxkLWF0dHJzLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcmVuZGVyL3N2Zy91dGlscy9jYW1lbC1jYXNlLWF0dHJzLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcmVuZGVyL3N2Zy91dGlscy9pcy1zdmctdGFnLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcmVuZGVyL3N2Zy91dGlscy9yZW5kZXIubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvc3ZnL3V0aWxzL3NjcmFwZS1tb3Rpb24tdmFsdWVzLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcmVuZGVyL3N2Zy9TVkdWaXN1YWxFbGVtZW50Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL2FuaW1hdGUvc2luZ2xlLXZhbHVlLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9mcmFtZXItbW90aW9uL2Rpc3QvZXMvYW5pbWF0aW9uL3V0aWxzL2lzLWRvbS1rZXlmcmFtZXMubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2ZyYW1lci1tb3Rpb24vZGlzdC9lcy9hbmltYXRpb24vYW5pbWF0ZS9yZXNvbHZlLXN1YmplY3RzLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9mcmFtZXItbW90aW9uL2Rpc3QvZXMvYW5pbWF0aW9uL3NlcXVlbmNlL3V0aWxzL2NhbGMtcmVwZWF0LWR1cmF0aW9uLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9mcmFtZXItbW90aW9uL2Rpc3QvZXMvYW5pbWF0aW9uL3NlcXVlbmNlL3V0aWxzL2NhbGMtdGltZS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZnJhbWVyLW1vdGlvbi9kaXN0L2VzL2FuaW1hdGlvbi9zZXF1ZW5jZS91dGlscy9lZGl0Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9mcmFtZXItbW90aW9uL2Rpc3QvZXMvYW5pbWF0aW9uL3NlcXVlbmNlL3V0aWxzL25vcm1hbGl6ZS10aW1lcy5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZnJhbWVyLW1vdGlvbi9kaXN0L2VzL2FuaW1hdGlvbi9zZXF1ZW5jZS91dGlscy9zb3J0Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9mcmFtZXItbW90aW9uL2Rpc3QvZXMvYW5pbWF0aW9uL3NlcXVlbmNlL2NyZWF0ZS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZnJhbWVyLW1vdGlvbi9kaXN0L2VzL2FuaW1hdGlvbi91dGlscy9jcmVhdGUtdmlzdWFsLWVsZW1lbnQubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2ZyYW1lci1tb3Rpb24vZGlzdC9lcy9hbmltYXRpb24vYW5pbWF0ZS9zdWJqZWN0Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9mcmFtZXItbW90aW9uL2Rpc3QvZXMvYW5pbWF0aW9uL2FuaW1hdGUvc2VxdWVuY2UubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2ZyYW1lci1tb3Rpb24vZGlzdC9lcy9hbmltYXRpb24vYW5pbWF0ZS9pbmRleC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZnJhbWVyLW1vdGlvbi9kaXN0L2VzL3JlbmRlci9kb20vc2Nyb2xsL3V0aWxzL2Nhbi11c2UtbmF0aXZlLXRpbWVsaW5lLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9mcmFtZXItbW90aW9uL2Rpc3QvZXMvcmVuZGVyL2RvbS9zY3JvbGwvaW5mby5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZnJhbWVyLW1vdGlvbi9kaXN0L2VzL3JlbmRlci9kb20vc2Nyb2xsL29mZnNldHMvaW5zZXQubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2ZyYW1lci1tb3Rpb24vZGlzdC9lcy9yZW5kZXIvZG9tL3Njcm9sbC9vZmZzZXRzL2VkZ2UubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2ZyYW1lci1tb3Rpb24vZGlzdC9lcy9yZW5kZXIvZG9tL3Njcm9sbC9vZmZzZXRzL29mZnNldC5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZnJhbWVyLW1vdGlvbi9kaXN0L2VzL3JlbmRlci9kb20vc2Nyb2xsL29mZnNldHMvcHJlc2V0cy5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZnJhbWVyLW1vdGlvbi9kaXN0L2VzL3JlbmRlci9kb20vc2Nyb2xsL29mZnNldHMvaW5kZXgubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2ZyYW1lci1tb3Rpb24vZGlzdC9lcy9yZW5kZXIvZG9tL3Njcm9sbC9vbi1zY3JvbGwtaGFuZGxlci5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZnJhbWVyLW1vdGlvbi9kaXN0L2VzL3JlbmRlci9kb20vc2Nyb2xsL3RyYWNrLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9mcmFtZXItbW90aW9uL2Rpc3QvZXMvcmVuZGVyL2RvbS9zY3JvbGwvdXRpbHMvb2Zmc2V0LXRvLXJhbmdlLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9mcmFtZXItbW90aW9uL2Rpc3QvZXMvcmVuZGVyL2RvbS9zY3JvbGwvdXRpbHMvZ2V0LXRpbWVsaW5lLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9mcmFtZXItbW90aW9uL2Rpc3QvZXMvcmVuZGVyL2RvbS9zY3JvbGwvYXR0YWNoLWFuaW1hdGlvbi5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZnJhbWVyLW1vdGlvbi9kaXN0L2VzL3JlbmRlci9kb20vc2Nyb2xsL2F0dGFjaC1mdW5jdGlvbi5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvZnJhbWVyLW1vdGlvbi9kaXN0L2VzL3JlbmRlci9kb20vc2Nyb2xsL2luZGV4Lm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9mcmFtZXItbW90aW9uL2Rpc3QvZXMvcmVuZGVyL2RvbS92aWV3cG9ydC9pbmRleC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gYWRkVW5pcXVlSXRlbShhcnIsIGl0ZW0pIHtcbiAgICBpZiAoYXJyLmluZGV4T2YoaXRlbSkgPT09IC0xKVxuICAgICAgICBhcnIucHVzaChpdGVtKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZUl0ZW0oYXJyLCBpdGVtKSB7XG4gICAgY29uc3QgaW5kZXggPSBhcnIuaW5kZXhPZihpdGVtKTtcbiAgICBpZiAoaW5kZXggPiAtMSlcbiAgICAgICAgYXJyLnNwbGljZShpbmRleCwgMSk7XG59XG4vLyBBZGFwdGVkIGZyb20gYXJyYXktbW92ZVxuZnVuY3Rpb24gbW92ZUl0ZW0oWy4uLmFycl0sIGZyb21JbmRleCwgdG9JbmRleCkge1xuICAgIGNvbnN0IHN0YXJ0SW5kZXggPSBmcm9tSW5kZXggPCAwID8gYXJyLmxlbmd0aCArIGZyb21JbmRleCA6IGZyb21JbmRleDtcbiAgICBpZiAoc3RhcnRJbmRleCA+PSAwICYmIHN0YXJ0SW5kZXggPCBhcnIubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGVuZEluZGV4ID0gdG9JbmRleCA8IDAgPyBhcnIubGVuZ3RoICsgdG9JbmRleCA6IHRvSW5kZXg7XG4gICAgICAgIGNvbnN0IFtpdGVtXSA9IGFyci5zcGxpY2UoZnJvbUluZGV4LCAxKTtcbiAgICAgICAgYXJyLnNwbGljZShlbmRJbmRleCwgMCwgaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCB7IGFkZFVuaXF1ZUl0ZW0sIG1vdmVJdGVtLCByZW1vdmVJdGVtIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcnJheS5tanMubWFwXG4iLCJjb25zdCBjbGFtcCA9IChtaW4sIG1heCwgdikgPT4ge1xuICAgIGlmICh2ID4gbWF4KVxuICAgICAgICByZXR1cm4gbWF4O1xuICAgIGlmICh2IDwgbWluKVxuICAgICAgICByZXR1cm4gbWluO1xuICAgIHJldHVybiB2O1xufTtcblxuZXhwb3J0IHsgY2xhbXAgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNsYW1wLm1qcy5tYXBcbiIsImZ1bmN0aW9uIGZvcm1hdEVycm9yTWVzc2FnZShtZXNzYWdlLCBlcnJvckNvZGUpIHtcbiAgICByZXR1cm4gZXJyb3JDb2RlXG4gICAgICAgID8gYCR7bWVzc2FnZX0uIEZvciBtb3JlIGluZm9ybWF0aW9uIGFuZCBzdGVwcyBmb3Igc29sdmluZywgdmlzaXQgaHR0cHM6Ly9tb3Rpb24uZGV2L3Ryb3VibGVzaG9vdGluZy8ke2Vycm9yQ29kZX1gXG4gICAgICAgIDogbWVzc2FnZTtcbn1cblxuZXhwb3J0IHsgZm9ybWF0RXJyb3JNZXNzYWdlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mb3JtYXQtZXJyb3ItbWVzc2FnZS5tanMubWFwXG4iLCJpbXBvcnQgeyBmb3JtYXRFcnJvck1lc3NhZ2UgfSBmcm9tICcuL2Zvcm1hdC1lcnJvci1tZXNzYWdlLm1qcyc7XG5cbmxldCB3YXJuaW5nID0gKCkgPT4geyB9O1xubGV0IGludmFyaWFudCA9ICgpID0+IHsgfTtcbmlmICh0eXBlb2YgcHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgIHByb2Nlc3MuZW52Py5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICB3YXJuaW5nID0gKGNoZWNrLCBtZXNzYWdlLCBlcnJvckNvZGUpID0+IHtcbiAgICAgICAgaWYgKCFjaGVjayAmJiB0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGZvcm1hdEVycm9yTWVzc2FnZShtZXNzYWdlLCBlcnJvckNvZGUpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgaW52YXJpYW50ID0gKGNoZWNrLCBtZXNzYWdlLCBlcnJvckNvZGUpID0+IHtcbiAgICAgICAgaWYgKCFjaGVjaykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGZvcm1hdEVycm9yTWVzc2FnZShtZXNzYWdlLCBlcnJvckNvZGUpKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCB7IGludmFyaWFudCwgd2FybmluZyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXJyb3JzLm1qcy5tYXBcbiIsImNvbnN0IE1vdGlvbkdsb2JhbENvbmZpZyA9IHt9O1xuXG5leHBvcnQgeyBNb3Rpb25HbG9iYWxDb25maWcgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdsb2JhbC1jb25maWcubWpzLm1hcFxuIiwiLyoqXG4gKiBDaGVjayBpZiB2YWx1ZSBpcyBhIG51bWVyaWNhbCBzdHJpbmcsIGllIGEgc3RyaW5nIHRoYXQgaXMgcHVyZWx5IGEgbnVtYmVyIGVnIFwiMTAwXCIgb3IgXCItMTAwLjFcIlxuICovXG5jb25zdCBpc051bWVyaWNhbFN0cmluZyA9ICh2KSA9PiAvXi0/KD86XFxkKyg/OlxcLlxcZCspP3xcXC5cXGQrKSQvdS50ZXN0KHYpO1xuXG5leHBvcnQgeyBpc051bWVyaWNhbFN0cmluZyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtbnVtZXJpY2FsLXN0cmluZy5tanMubWFwXG4iLCJjb25zdCBpc09iamVjdCA9ICh2YWx1ZSkgPT4gdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsO1xuXG5leHBvcnQgeyBpc09iamVjdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtb2JqZWN0Lm1qcy5tYXBcbiIsIi8qKlxuICogQ2hlY2sgaWYgdGhlIHZhbHVlIGlzIGEgemVybyB2YWx1ZSBzdHJpbmcgbGlrZSBcIjBweFwiIG9yIFwiMCVcIlxuICovXG5jb25zdCBpc1plcm9WYWx1ZVN0cmluZyA9ICh2KSA9PiAvXjBbXi5cXHNdKyQvdS50ZXN0KHYpO1xuXG5leHBvcnQgeyBpc1plcm9WYWx1ZVN0cmluZyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtemVyby12YWx1ZS1zdHJpbmcubWpzLm1hcFxuIiwiLyojX19OT19TSURFX0VGRkVDVFNfXyovXG5mdW5jdGlvbiBtZW1vKGNhbGxiYWNrKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXN1bHQgPSBjYWxsYmFjaygpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG59XG5cbmV4cG9ydCB7IG1lbW8gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lbW8ubWpzLm1hcFxuIiwiLyojX19OT19TSURFX0VGRkVDVFNfXyovXG5jb25zdCBub29wID0gKGFueSkgPT4gYW55O1xuXG5leHBvcnQgeyBub29wIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ub29wLm1qcy5tYXBcbiIsIi8qKlxuICogUGlwZVxuICogQ29tcG9zZSBvdGhlciB0cmFuc2Zvcm1lcnMgdG8gcnVuIGxpbmVhcmlseVxuICogcGlwZShtaW4oMjApLCBtYXgoNDApKVxuICogQHBhcmFtICB7Li4uZnVuY3Rpb25zfSB0cmFuc2Zvcm1lcnNcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICovXG5jb25zdCBwaXBlID0gKC4uLnRyYW5zZm9ybWVycykgPT4gdHJhbnNmb3JtZXJzLnJlZHVjZSgoYSwgYikgPT4gKHYpID0+IGIoYSh2KSkpO1xuXG5leHBvcnQgeyBwaXBlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXBlLm1qcy5tYXBcbiIsIi8qXG4gIFByb2dyZXNzIHdpdGhpbiBnaXZlbiByYW5nZVxuXG4gIEdpdmVuIGEgbG93ZXIgbGltaXQgYW5kIGFuIHVwcGVyIGxpbWl0LCB3ZSByZXR1cm4gdGhlIHByb2dyZXNzXG4gIChleHByZXNzZWQgYXMgYSBudW1iZXIgMC0xKSByZXByZXNlbnRlZCBieSB0aGUgZ2l2ZW4gdmFsdWUsIGFuZFxuICBsaW1pdCB0aGF0IHByb2dyZXNzIHRvIHdpdGhpbiAwLTEuXG4qL1xuLyojX19OT19TSURFX0VGRkVDVFNfXyovXG5jb25zdCBwcm9ncmVzcyA9IChmcm9tLCB0bywgdmFsdWUpID0+IHtcbiAgICBjb25zdCByYW5nZSA9IHRvIC0gZnJvbTtcbiAgICByZXR1cm4gcmFuZ2UgPyAodmFsdWUgLSBmcm9tKSAvIHJhbmdlIDogMTtcbn07XG5cbmV4cG9ydCB7IHByb2dyZXNzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcm9ncmVzcy5tanMubWFwXG4iLCJpbXBvcnQgeyBhZGRVbmlxdWVJdGVtLCByZW1vdmVJdGVtIH0gZnJvbSAnLi9hcnJheS5tanMnO1xuXG5jbGFzcyBTdWJzY3JpcHRpb25NYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0gW107XG4gICAgfVxuICAgIGFkZChoYW5kbGVyKSB7XG4gICAgICAgIGFkZFVuaXF1ZUl0ZW0odGhpcy5zdWJzY3JpcHRpb25zLCBoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHJlbW92ZUl0ZW0odGhpcy5zdWJzY3JpcHRpb25zLCBoYW5kbGVyKTtcbiAgICB9XG4gICAgbm90aWZ5KGEsIGIsIGMpIHtcbiAgICAgICAgY29uc3QgbnVtU3Vic2NyaXB0aW9ucyA9IHRoaXMuc3Vic2NyaXB0aW9ucy5sZW5ndGg7XG4gICAgICAgIGlmICghbnVtU3Vic2NyaXB0aW9ucylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKG51bVN1YnNjcmlwdGlvbnMgPT09IDEpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgdGhlcmUncyBvbmx5IGEgc2luZ2xlIGhhbmRsZXIgd2UgY2FuIGp1c3QgY2FsbCBpdCB3aXRob3V0IGludm9raW5nIGEgbG9vcC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zWzBdKGEsIGIsIGMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1TdWJzY3JpcHRpb25zOyBpKyspIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBDaGVjayB3aGV0aGVyIHRoZSBoYW5kbGVyIGV4aXN0cyBiZWZvcmUgZmlyaW5nIGFzIGl0J3MgcG9zc2libGVcbiAgICAgICAgICAgICAgICAgKiB0aGUgc3Vic2NyaXB0aW9ucyB3ZXJlIG1vZGlmaWVkIGR1cmluZyB0aGlzIGxvb3AgcnVubmluZy5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gdGhpcy5zdWJzY3JpcHRpb25zW2ldO1xuICAgICAgICAgICAgICAgIGhhbmRsZXIgJiYgaGFuZGxlcihhLCBiLCBjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXRTaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb25zLmxlbmd0aDtcbiAgICB9XG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5sZW5ndGggPSAwO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgU3Vic2NyaXB0aW9uTWFuYWdlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3Vic2NyaXB0aW9uLW1hbmFnZXIubWpzLm1hcFxuIiwiLyoqXG4gKiBDb252ZXJ0cyBzZWNvbmRzIHRvIG1pbGxpc2Vjb25kc1xuICpcbiAqIEBwYXJhbSBzZWNvbmRzIC0gVGltZSBpbiBzZWNvbmRzLlxuICogQHJldHVybiBtaWxsaXNlY29uZHMgLSBDb252ZXJ0ZWQgdGltZSBpbiBtaWxsaXNlY29uZHMuXG4gKi9cbi8qI19fTk9fU0lERV9FRkZFQ1RTX18qL1xuY29uc3Qgc2Vjb25kc1RvTWlsbGlzZWNvbmRzID0gKHNlY29uZHMpID0+IHNlY29uZHMgKiAxMDAwO1xuLyojX19OT19TSURFX0VGRkVDVFNfXyovXG5jb25zdCBtaWxsaXNlY29uZHNUb1NlY29uZHMgPSAobWlsbGlzZWNvbmRzKSA9PiBtaWxsaXNlY29uZHMgLyAxMDAwO1xuXG5leHBvcnQgeyBtaWxsaXNlY29uZHNUb1NlY29uZHMsIHNlY29uZHNUb01pbGxpc2Vjb25kcyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGltZS1jb252ZXJzaW9uLm1qcy5tYXBcbiIsIi8qXG4gIENvbnZlcnQgdmVsb2NpdHkgaW50byB2ZWxvY2l0eSBwZXIgc2Vjb25kXG4qL1xuLyojX19OT19TSURFX0VGRkVDVFNfXyovXG5jb25zdCB2ZWxvY2l0eVBlclNlY29uZCA9ICh2ZWxvY2l0eSwgZnJhbWVEdXJhdGlvbikgPT4gZnJhbWVEdXJhdGlvbiA/IHZlbG9jaXR5ICogKDEwMDAgLyBmcmFtZUR1cmF0aW9uKSA6IDA7XG5cbmV4cG9ydCB7IHZlbG9jaXR5UGVyU2Vjb25kIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD12ZWxvY2l0eS1wZXItc2Vjb25kLm1qcy5tYXBcbiIsImltcG9ydCB7IGZvcm1hdEVycm9yTWVzc2FnZSB9IGZyb20gJy4vZm9ybWF0LWVycm9yLW1lc3NhZ2UubWpzJztcblxuY29uc3Qgd2FybmVkID0gbmV3IFNldCgpO1xuZnVuY3Rpb24gaGFzV2FybmVkKG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gd2FybmVkLmhhcyhtZXNzYWdlKTtcbn1cbmZ1bmN0aW9uIHdhcm5PbmNlKGNvbmRpdGlvbiwgbWVzc2FnZSwgZXJyb3JDb2RlKSB7XG4gICAgaWYgKGNvbmRpdGlvbiB8fCB3YXJuZWQuaGFzKG1lc3NhZ2UpKVxuICAgICAgICByZXR1cm47XG4gICAgY29uc29sZS53YXJuKGZvcm1hdEVycm9yTWVzc2FnZShtZXNzYWdlLCBlcnJvckNvZGUpKTtcbiAgICB3YXJuZWQuYWRkKG1lc3NhZ2UpO1xufVxuXG5leHBvcnQgeyBoYXNXYXJuZWQsIHdhcm5PbmNlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD13YXJuLW9uY2UubWpzLm1hcFxuIiwiY29uc3Qgd3JhcCA9IChtaW4sIG1heCwgdikgPT4ge1xuICAgIGNvbnN0IHJhbmdlU2l6ZSA9IG1heCAtIG1pbjtcbiAgICByZXR1cm4gKCgoKHYgLSBtaW4pICUgcmFuZ2VTaXplKSArIHJhbmdlU2l6ZSkgJSByYW5nZVNpemUpICsgbWluO1xufTtcblxuZXhwb3J0IHsgd3JhcCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d3JhcC5tanMubWFwXG4iLCJpbXBvcnQgeyBub29wIH0gZnJvbSAnLi4vbm9vcC5tanMnO1xuXG4vKlxuICBCZXppZXIgZnVuY3Rpb24gZ2VuZXJhdG9yXG4gIFRoaXMgaGFzIGJlZW4gbW9kaWZpZWQgZnJvbSBHYcOrdGFuIFJlbmF1ZGVhdSdzIEJlemllckVhc2luZ1xuICBodHRwczovL2dpdGh1Yi5jb20vZ3JlL2Jlemllci1lYXNpbmcvYmxvYi9tYXN0ZXIvc3JjL2luZGV4LmpzXG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9ncmUvYmV6aWVyLWVhc2luZy9ibG9iL21hc3Rlci9MSUNFTlNFXG4gIFxuICBJJ3ZlIHJlbW92ZWQgdGhlIG5ld3RvblJhcGhzb25JdGVyYXRlIGFsZ28gYmVjYXVzZSBpbiBiZW5jaG1hcmtpbmcgaXRcbiAgd2Fzbid0IG5vdGljZWFibHkgZmFzdGVyIHRoYW4gYmluYXJ5U3ViZGl2aXNpb24sIGluZGVlZCByZW1vdmluZyBpdFxuICB1c3VhbGx5IGltcHJvdmVkIHRpbWVzLCBkZXBlbmRpbmcgb24gdGhlIGN1cnZlLlxuICBJIGFsc28gcmVtb3ZlZCB0aGUgbG9va3VwIHRhYmxlLCBhcyBmb3IgdGhlIGFkZGVkIGJ1bmRsZSBzaXplIGFuZCBsb29wIHdlJ3JlXG4gIG9ubHkgY3V0dGluZyB+NCBvciBzbyBzdWJkaXZpc2lvbiBpdGVyYXRpb25zLiBJIGJ1bXBlZCB0aGUgbWF4IGl0ZXJhdGlvbnMgdXBcbiAgdG8gMTIgdG8gY29tcGVuc2F0ZSBhbmQgdGhpcyBzdGlsbCB0ZW5kZWQgdG8gYmUgZmFzdGVyIGZvciBubyBwZXJjZWl2YWJsZVxuICBsb3NzIGluIGFjY3VyYWN5LlxuICBVc2FnZVxuICAgIGNvbnN0IGVhc2VPdXQgPSBjdWJpY0JlemllciguMTcsLjY3LC44MywuNjcpO1xuICAgIGNvbnN0IHggPSBlYXNlT3V0KDAuNSk7IC8vIHJldHVybnMgMC42MjcuLi5cbiovXG4vLyBSZXR1cm5zIHgodCkgZ2l2ZW4gdCwgeDEsIGFuZCB4Miwgb3IgeSh0KSBnaXZlbiB0LCB5MSwgYW5kIHkyLlxuY29uc3QgY2FsY0JlemllciA9ICh0LCBhMSwgYTIpID0+ICgoKDEuMCAtIDMuMCAqIGEyICsgMy4wICogYTEpICogdCArICgzLjAgKiBhMiAtIDYuMCAqIGExKSkgKiB0ICsgMy4wICogYTEpICpcbiAgICB0O1xuY29uc3Qgc3ViZGl2aXNpb25QcmVjaXNpb24gPSAwLjAwMDAwMDE7XG5jb25zdCBzdWJkaXZpc2lvbk1heEl0ZXJhdGlvbnMgPSAxMjtcbmZ1bmN0aW9uIGJpbmFyeVN1YmRpdmlkZSh4LCBsb3dlckJvdW5kLCB1cHBlckJvdW5kLCBtWDEsIG1YMikge1xuICAgIGxldCBjdXJyZW50WDtcbiAgICBsZXQgY3VycmVudFQ7XG4gICAgbGV0IGkgPSAwO1xuICAgIGRvIHtcbiAgICAgICAgY3VycmVudFQgPSBsb3dlckJvdW5kICsgKHVwcGVyQm91bmQgLSBsb3dlckJvdW5kKSAvIDIuMDtcbiAgICAgICAgY3VycmVudFggPSBjYWxjQmV6aWVyKGN1cnJlbnRULCBtWDEsIG1YMikgLSB4O1xuICAgICAgICBpZiAoY3VycmVudFggPiAwLjApIHtcbiAgICAgICAgICAgIHVwcGVyQm91bmQgPSBjdXJyZW50VDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxvd2VyQm91bmQgPSBjdXJyZW50VDtcbiAgICAgICAgfVxuICAgIH0gd2hpbGUgKE1hdGguYWJzKGN1cnJlbnRYKSA+IHN1YmRpdmlzaW9uUHJlY2lzaW9uICYmXG4gICAgICAgICsraSA8IHN1YmRpdmlzaW9uTWF4SXRlcmF0aW9ucyk7XG4gICAgcmV0dXJuIGN1cnJlbnRUO1xufVxuLyojX19OT19TSURFX0VGRkVDVFNfXyovXG5mdW5jdGlvbiBjdWJpY0JlemllcihtWDEsIG1ZMSwgbVgyLCBtWTIpIHtcbiAgICAvLyBJZiB0aGlzIGlzIGEgbGluZWFyIGdyYWRpZW50LCByZXR1cm4gbGluZWFyIGVhc2luZ1xuICAgIGlmIChtWDEgPT09IG1ZMSAmJiBtWDIgPT09IG1ZMilcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgY29uc3QgZ2V0VEZvclggPSAoYVgpID0+IGJpbmFyeVN1YmRpdmlkZShhWCwgMCwgMSwgbVgxLCBtWDIpO1xuICAgIC8vIElmIGFuaW1hdGlvbiBpcyBhdCBzdGFydC9lbmQsIHJldHVybiB0IHdpdGhvdXQgZWFzaW5nXG4gICAgcmV0dXJuICh0KSA9PiB0ID09PSAwIHx8IHQgPT09IDEgPyB0IDogY2FsY0JlemllcihnZXRURm9yWCh0KSwgbVkxLCBtWTIpO1xufVxuXG5leHBvcnQgeyBjdWJpY0JlemllciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y3ViaWMtYmV6aWVyLm1qcy5tYXBcbiIsIi8vIEFjY2VwdHMgYW4gZWFzaW5nIGZ1bmN0aW9uIGFuZCByZXR1cm5zIGEgbmV3IG9uZSB0aGF0IG91dHB1dHMgbWlycm9yZWQgdmFsdWVzIGZvclxuLy8gdGhlIHNlY29uZCBoYWxmIG9mIHRoZSBhbmltYXRpb24uIFR1cm5zIGVhc2VJbiBpbnRvIGVhc2VJbk91dC5cbi8qI19fTk9fU0lERV9FRkZFQ1RTX18qL1xuY29uc3QgbWlycm9yRWFzaW5nID0gKGVhc2luZykgPT4gKHApID0+IHAgPD0gMC41ID8gZWFzaW5nKDIgKiBwKSAvIDIgOiAoMiAtIGVhc2luZygyICogKDEgLSBwKSkpIC8gMjtcblxuZXhwb3J0IHsgbWlycm9yRWFzaW5nIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1taXJyb3IubWpzLm1hcFxuIiwiLy8gQWNjZXB0cyBhbiBlYXNpbmcgZnVuY3Rpb24gYW5kIHJldHVybnMgYSBuZXcgb25lIHRoYXQgb3V0cHV0cyByZXZlcnNlZCB2YWx1ZXMuXG4vLyBUdXJucyBlYXNlSW4gaW50byBlYXNlT3V0LlxuLyojX19OT19TSURFX0VGRkVDVFNfXyovXG5jb25zdCByZXZlcnNlRWFzaW5nID0gKGVhc2luZykgPT4gKHApID0+IDEgLSBlYXNpbmcoMSAtIHApO1xuXG5leHBvcnQgeyByZXZlcnNlRWFzaW5nIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZXZlcnNlLm1qcy5tYXBcbiIsImltcG9ydCB7IGN1YmljQmV6aWVyIH0gZnJvbSAnLi9jdWJpYy1iZXppZXIubWpzJztcbmltcG9ydCB7IG1pcnJvckVhc2luZyB9IGZyb20gJy4vbW9kaWZpZXJzL21pcnJvci5tanMnO1xuaW1wb3J0IHsgcmV2ZXJzZUVhc2luZyB9IGZyb20gJy4vbW9kaWZpZXJzL3JldmVyc2UubWpzJztcblxuY29uc3QgYmFja091dCA9IC8qQF9fUFVSRV9fKi8gY3ViaWNCZXppZXIoMC4zMywgMS41MywgMC42OSwgMC45OSk7XG5jb25zdCBiYWNrSW4gPSAvKkBfX1BVUkVfXyovIHJldmVyc2VFYXNpbmcoYmFja091dCk7XG5jb25zdCBiYWNrSW5PdXQgPSAvKkBfX1BVUkVfXyovIG1pcnJvckVhc2luZyhiYWNrSW4pO1xuXG5leHBvcnQgeyBiYWNrSW4sIGJhY2tJbk91dCwgYmFja091dCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YmFjay5tanMubWFwXG4iLCJpbXBvcnQgeyBiYWNrSW4gfSBmcm9tICcuL2JhY2subWpzJztcblxuY29uc3QgYW50aWNpcGF0ZSA9IChwKSA9PiBwID49IDFcbiAgICA/IDFcbiAgICA6IChwICo9IDIpIDwgMVxuICAgICAgICA/IDAuNSAqIGJhY2tJbihwKVxuICAgICAgICA6IDAuNSAqICgyIC0gTWF0aC5wb3coMiwgLTEwICogKHAgLSAxKSkpO1xuXG5leHBvcnQgeyBhbnRpY2lwYXRlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbnRpY2lwYXRlLm1qcy5tYXBcbiIsImltcG9ydCB7IG1pcnJvckVhc2luZyB9IGZyb20gJy4vbW9kaWZpZXJzL21pcnJvci5tanMnO1xuaW1wb3J0IHsgcmV2ZXJzZUVhc2luZyB9IGZyb20gJy4vbW9kaWZpZXJzL3JldmVyc2UubWpzJztcblxuY29uc3QgY2lyY0luID0gKHApID0+IDEgLSBNYXRoLnNpbihNYXRoLmFjb3MocCkpO1xuY29uc3QgY2lyY091dCA9IHJldmVyc2VFYXNpbmcoY2lyY0luKTtcbmNvbnN0IGNpcmNJbk91dCA9IG1pcnJvckVhc2luZyhjaXJjSW4pO1xuXG5leHBvcnQgeyBjaXJjSW4sIGNpcmNJbk91dCwgY2lyY091dCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2lyYy5tanMubWFwXG4iLCJpbXBvcnQgeyBjdWJpY0JlemllciB9IGZyb20gJy4vY3ViaWMtYmV6aWVyLm1qcyc7XG5cbmNvbnN0IGVhc2VJbiA9IC8qQF9fUFVSRV9fKi8gY3ViaWNCZXppZXIoMC40MiwgMCwgMSwgMSk7XG5jb25zdCBlYXNlT3V0ID0gLypAX19QVVJFX18qLyBjdWJpY0JlemllcigwLCAwLCAwLjU4LCAxKTtcbmNvbnN0IGVhc2VJbk91dCA9IC8qQF9fUFVSRV9fKi8gY3ViaWNCZXppZXIoMC40MiwgMCwgMC41OCwgMSk7XG5cbmV4cG9ydCB7IGVhc2VJbiwgZWFzZUluT3V0LCBlYXNlT3V0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lYXNlLm1qcy5tYXBcbiIsIi8qI19fTk9fU0lERV9FRkZFQ1RTX18qL1xuY29uc3QgaXNFYXNpbmdBcnJheSA9IChlYXNlKSA9PiB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoZWFzZSkgJiYgdHlwZW9mIGVhc2VbMF0gIT09IFwibnVtYmVyXCI7XG59O1xuXG5leHBvcnQgeyBpc0Vhc2luZ0FycmF5IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pcy1lYXNpbmctYXJyYXkubWpzLm1hcFxuIiwiaW1wb3J0IHsgd3JhcCB9IGZyb20gJy4uLy4uL3dyYXAubWpzJztcbmltcG9ydCB7IGlzRWFzaW5nQXJyYXkgfSBmcm9tICcuL2lzLWVhc2luZy1hcnJheS5tanMnO1xuXG4vKiNfX05PX1NJREVfRUZGRUNUU19fKi9cbmZ1bmN0aW9uIGdldEVhc2luZ0ZvclNlZ21lbnQoZWFzaW5nLCBpKSB7XG4gICAgcmV0dXJuIGlzRWFzaW5nQXJyYXkoZWFzaW5nKSA/IGVhc2luZ1t3cmFwKDAsIGVhc2luZy5sZW5ndGgsIGkpXSA6IGVhc2luZztcbn1cblxuZXhwb3J0IHsgZ2V0RWFzaW5nRm9yU2VnbWVudCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2V0LWVhc2luZy1mb3Itc2VnbWVudC5tanMubWFwXG4iLCIvKiNfX05PX1NJREVfRUZGRUNUU19fKi9cbmNvbnN0IGlzQmV6aWVyRGVmaW5pdGlvbiA9IChlYXNpbmcpID0+IEFycmF5LmlzQXJyYXkoZWFzaW5nKSAmJiB0eXBlb2YgZWFzaW5nWzBdID09PSBcIm51bWJlclwiO1xuXG5leHBvcnQgeyBpc0JlemllckRlZmluaXRpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzLWJlemllci1kZWZpbml0aW9uLm1qcy5tYXBcbiIsImltcG9ydCB7IGludmFyaWFudCB9IGZyb20gJy4uLy4uL2Vycm9ycy5tanMnO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uLy4uL25vb3AubWpzJztcbmltcG9ydCB7IGFudGljaXBhdGUgfSBmcm9tICcuLi9hbnRpY2lwYXRlLm1qcyc7XG5pbXBvcnQgeyBiYWNrT3V0LCBiYWNrSW5PdXQsIGJhY2tJbiB9IGZyb20gJy4uL2JhY2subWpzJztcbmltcG9ydCB7IGNpcmNPdXQsIGNpcmNJbk91dCwgY2lyY0luIH0gZnJvbSAnLi4vY2lyYy5tanMnO1xuaW1wb3J0IHsgY3ViaWNCZXppZXIgfSBmcm9tICcuLi9jdWJpYy1iZXppZXIubWpzJztcbmltcG9ydCB7IGVhc2VPdXQsIGVhc2VJbk91dCwgZWFzZUluIH0gZnJvbSAnLi4vZWFzZS5tanMnO1xuaW1wb3J0IHsgaXNCZXppZXJEZWZpbml0aW9uIH0gZnJvbSAnLi9pcy1iZXppZXItZGVmaW5pdGlvbi5tanMnO1xuXG5jb25zdCBlYXNpbmdMb29rdXAgPSB7XG4gICAgbGluZWFyOiBub29wLFxuICAgIGVhc2VJbixcbiAgICBlYXNlSW5PdXQsXG4gICAgZWFzZU91dCxcbiAgICBjaXJjSW4sXG4gICAgY2lyY0luT3V0LFxuICAgIGNpcmNPdXQsXG4gICAgYmFja0luLFxuICAgIGJhY2tJbk91dCxcbiAgICBiYWNrT3V0LFxuICAgIGFudGljaXBhdGUsXG59O1xuY29uc3QgaXNWYWxpZEVhc2luZyA9IChlYXNpbmcpID0+IHtcbiAgICByZXR1cm4gdHlwZW9mIGVhc2luZyA9PT0gXCJzdHJpbmdcIjtcbn07XG5jb25zdCBlYXNpbmdEZWZpbml0aW9uVG9GdW5jdGlvbiA9IChkZWZpbml0aW9uKSA9PiB7XG4gICAgaWYgKGlzQmV6aWVyRGVmaW5pdGlvbihkZWZpbml0aW9uKSkge1xuICAgICAgICAvLyBJZiBjdWJpYyBiZXppZXIgZGVmaW5pdGlvbiwgY3JlYXRlIGJlemllciBjdXJ2ZVxuICAgICAgICBpbnZhcmlhbnQoZGVmaW5pdGlvbi5sZW5ndGggPT09IDQsIGBDdWJpYyBiZXppZXIgYXJyYXlzIG11c3QgY29udGFpbiBmb3VyIG51bWVyaWNhbCB2YWx1ZXMuYCwgXCJjdWJpYy1iZXppZXItbGVuZ3RoXCIpO1xuICAgICAgICBjb25zdCBbeDEsIHkxLCB4MiwgeTJdID0gZGVmaW5pdGlvbjtcbiAgICAgICAgcmV0dXJuIGN1YmljQmV6aWVyKHgxLCB5MSwgeDIsIHkyKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNWYWxpZEVhc2luZyhkZWZpbml0aW9uKSkge1xuICAgICAgICAvLyBFbHNlIGxvb2t1cCBmcm9tIHRhYmxlXG4gICAgICAgIGludmFyaWFudChlYXNpbmdMb29rdXBbZGVmaW5pdGlvbl0gIT09IHVuZGVmaW5lZCwgYEludmFsaWQgZWFzaW5nIHR5cGUgJyR7ZGVmaW5pdGlvbn0nYCwgXCJpbnZhbGlkLWVhc2luZy10eXBlXCIpO1xuICAgICAgICByZXR1cm4gZWFzaW5nTG9va3VwW2RlZmluaXRpb25dO1xuICAgIH1cbiAgICByZXR1cm4gZGVmaW5pdGlvbjtcbn07XG5cbmV4cG9ydCB7IGVhc2luZ0RlZmluaXRpb25Ub0Z1bmN0aW9uIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXAubWpzLm1hcFxuIiwiY29uc3Qgc3RlcHNPcmRlciA9IFtcbiAgICBcInNldHVwXCIsIC8vIENvbXB1dGVcbiAgICBcInJlYWRcIiwgLy8gUmVhZFxuICAgIFwicmVzb2x2ZUtleWZyYW1lc1wiLCAvLyBXcml0ZS9SZWFkL1dyaXRlL1JlYWRcbiAgICBcInByZVVwZGF0ZVwiLCAvLyBDb21wdXRlXG4gICAgXCJ1cGRhdGVcIiwgLy8gQ29tcHV0ZVxuICAgIFwicHJlUmVuZGVyXCIsIC8vIENvbXB1dGVcbiAgICBcInJlbmRlclwiLCAvLyBXcml0ZVxuICAgIFwicG9zdFJlbmRlclwiLCAvLyBDb21wdXRlXG5dO1xuXG5leHBvcnQgeyBzdGVwc09yZGVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1vcmRlci5tanMubWFwXG4iLCJjb25zdCBzdGF0c0J1ZmZlciA9IHtcbiAgICB2YWx1ZTogbnVsbCxcbiAgICBhZGRQcm9qZWN0aW9uTWV0cmljczogbnVsbCxcbn07XG5cbmV4cG9ydCB7IHN0YXRzQnVmZmVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1idWZmZXIubWpzLm1hcFxuIiwiaW1wb3J0IHsgc3RhdHNCdWZmZXIgfSBmcm9tICcuLi9zdGF0cy9idWZmZXIubWpzJztcblxuZnVuY3Rpb24gY3JlYXRlUmVuZGVyU3RlcChydW5OZXh0RnJhbWUsIHN0ZXBOYW1lKSB7XG4gICAgLyoqXG4gICAgICogV2UgY3JlYXRlIGFuZCByZXVzZSB0d28gcXVldWVzLCBvbmUgdG8gcXVldWUgam9icyBmb3IgdGhlIGN1cnJlbnQgZnJhbWVcbiAgICAgKiBhbmQgb25lIGZvciB0aGUgbmV4dC4gV2UgcmV1c2UgdG8gYXZvaWQgdHJpZ2dlcmluZyBHQyBhZnRlciB4IGZyYW1lcy5cbiAgICAgKi9cbiAgICBsZXQgdGhpc0ZyYW1lID0gbmV3IFNldCgpO1xuICAgIGxldCBuZXh0RnJhbWUgPSBuZXcgU2V0KCk7XG4gICAgLyoqXG4gICAgICogVHJhY2sgd2hldGhlciB3ZSdyZSBjdXJyZW50bHkgcHJvY2Vzc2luZyBqb2JzIGluIHRoaXMgc3RlcC4gVGhpcyB3YXlcbiAgICAgKiB3ZSBjYW4gZGVjaWRlIHdoZXRoZXIgdG8gc2NoZWR1bGUgbmV3IGpvYnMgZm9yIHRoaXMgZnJhbWUgb3IgbmV4dC5cbiAgICAgKi9cbiAgICBsZXQgaXNQcm9jZXNzaW5nID0gZmFsc2U7XG4gICAgbGV0IGZsdXNoTmV4dEZyYW1lID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogQSBzZXQgb2YgcHJvY2Vzc2VzIHdoaWNoIHdlcmUgbWFya2VkIGtlZXBBbGl2ZSB3aGVuIHNjaGVkdWxlZC5cbiAgICAgKi9cbiAgICBjb25zdCB0b0tlZXBBbGl2ZSA9IG5ldyBXZWFrU2V0KCk7XG4gICAgbGV0IGxhdGVzdEZyYW1lRGF0YSA9IHtcbiAgICAgICAgZGVsdGE6IDAuMCxcbiAgICAgICAgdGltZXN0YW1wOiAwLjAsXG4gICAgICAgIGlzUHJvY2Vzc2luZzogZmFsc2UsXG4gICAgfTtcbiAgICBsZXQgbnVtQ2FsbHMgPSAwO1xuICAgIGZ1bmN0aW9uIHRyaWdnZXJDYWxsYmFjayhjYWxsYmFjaykge1xuICAgICAgICBpZiAodG9LZWVwQWxpdmUuaGFzKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgc3RlcC5zY2hlZHVsZShjYWxsYmFjayk7XG4gICAgICAgICAgICBydW5OZXh0RnJhbWUoKTtcbiAgICAgICAgfVxuICAgICAgICBudW1DYWxscysrO1xuICAgICAgICBjYWxsYmFjayhsYXRlc3RGcmFtZURhdGEpO1xuICAgIH1cbiAgICBjb25zdCBzdGVwID0ge1xuICAgICAgICAvKipcbiAgICAgICAgICogU2NoZWR1bGUgYSBwcm9jZXNzIHRvIHJ1biBvbiB0aGUgbmV4dCBmcmFtZS5cbiAgICAgICAgICovXG4gICAgICAgIHNjaGVkdWxlOiAoY2FsbGJhY2ssIGtlZXBBbGl2ZSA9IGZhbHNlLCBpbW1lZGlhdGUgPSBmYWxzZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYWRkVG9DdXJyZW50RnJhbWUgPSBpbW1lZGlhdGUgJiYgaXNQcm9jZXNzaW5nO1xuICAgICAgICAgICAgY29uc3QgcXVldWUgPSBhZGRUb0N1cnJlbnRGcmFtZSA/IHRoaXNGcmFtZSA6IG5leHRGcmFtZTtcbiAgICAgICAgICAgIGlmIChrZWVwQWxpdmUpXG4gICAgICAgICAgICAgICAgdG9LZWVwQWxpdmUuYWRkKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHF1ZXVlLmFkZChjYWxsYmFjayk7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2s7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYW5jZWwgdGhlIHByb3ZpZGVkIGNhbGxiYWNrIGZyb20gcnVubmluZyBvbiB0aGUgbmV4dCBmcmFtZS5cbiAgICAgICAgICovXG4gICAgICAgIGNhbmNlbDogKGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICBuZXh0RnJhbWUuZGVsZXRlKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHRvS2VlcEFsaXZlLmRlbGV0ZShjYWxsYmFjayk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFeGVjdXRlIGFsbCBzY2hlZHVsZSBjYWxsYmFja3MuXG4gICAgICAgICAqL1xuICAgICAgICBwcm9jZXNzOiAoZnJhbWVEYXRhKSA9PiB7XG4gICAgICAgICAgICBsYXRlc3RGcmFtZURhdGEgPSBmcmFtZURhdGE7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHdlJ3JlIGFscmVhZHkgcHJvY2Vzc2luZyB3ZSd2ZSBwcm9iYWJseSBiZWVuIHRyaWdnZXJlZCBieSBhIGZsdXNoU3luY1xuICAgICAgICAgICAgICogaW5zaWRlIGFuIGV4aXN0aW5nIHByb2Nlc3MuIEluc3RlYWQgb2YgZXhlY3V0aW5nLCBtYXJrIGZsdXNoTmV4dEZyYW1lXG4gICAgICAgICAgICAgKiBhcyB0cnVlIGFuZCBlbnN1cmUgd2UgZmx1c2ggdGhlIGZvbGxvd2luZyBmcmFtZSBhdCB0aGUgZW5kIG9mIHRoaXMgb25lLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoaXNQcm9jZXNzaW5nKSB7XG4gICAgICAgICAgICAgICAgZmx1c2hOZXh0RnJhbWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlzUHJvY2Vzc2luZyA9IHRydWU7XG4gICAgICAgICAgICAvLyBTd2FwIHRoaXMgZnJhbWUgYW5kIHRoZSBuZXh0IHRvIGF2b2lkIEdDXG4gICAgICAgICAgICBjb25zdCBwcmV2RnJhbWUgPSB0aGlzRnJhbWU7XG4gICAgICAgICAgICB0aGlzRnJhbWUgPSBuZXh0RnJhbWU7XG4gICAgICAgICAgICBuZXh0RnJhbWUgPSBwcmV2RnJhbWU7XG4gICAgICAgICAgICAvLyBFeGVjdXRlIHRoaXMgZnJhbWVcbiAgICAgICAgICAgIHRoaXNGcmFtZS5mb3JFYWNoKHRyaWdnZXJDYWxsYmFjayk7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHdlJ3JlIHJlY29yZGluZyBzdGF0cyB0aGVuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChzdGVwTmFtZSAmJiBzdGF0c0J1ZmZlci52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHN0YXRzQnVmZmVyLnZhbHVlLmZyYW1lbG9vcFtzdGVwTmFtZV0ucHVzaChudW1DYWxscyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBudW1DYWxscyA9IDA7XG4gICAgICAgICAgICAvLyBDbGVhciB0aGUgZnJhbWUgc28gbm8gY2FsbGJhY2tzIHJlbWFpbi4gVGhpcyBpcyB0byBhdm9pZFxuICAgICAgICAgICAgLy8gbWVtb3J5IGxlYWtzIHNob3VsZCB0aGlzIHJlbmRlciBzdGVwIG5vdCBydW4gZm9yIGEgd2hpbGUuXG4gICAgICAgICAgICB0aGlzRnJhbWUuY2xlYXIoKTtcbiAgICAgICAgICAgIGlzUHJvY2Vzc2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGZsdXNoTmV4dEZyYW1lKSB7XG4gICAgICAgICAgICAgICAgZmx1c2hOZXh0RnJhbWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBzdGVwLnByb2Nlc3MoZnJhbWVEYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9O1xuICAgIHJldHVybiBzdGVwO1xufVxuXG5leHBvcnQgeyBjcmVhdGVSZW5kZXJTdGVwIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZW5kZXItc3RlcC5tanMubWFwXG4iLCJpbXBvcnQgeyBNb3Rpb25HbG9iYWxDb25maWcgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgc3RlcHNPcmRlciB9IGZyb20gJy4vb3JkZXIubWpzJztcbmltcG9ydCB7IGNyZWF0ZVJlbmRlclN0ZXAgfSBmcm9tICcuL3JlbmRlci1zdGVwLm1qcyc7XG5cbmNvbnN0IG1heEVsYXBzZWQgPSA0MDtcbmZ1bmN0aW9uIGNyZWF0ZVJlbmRlckJhdGNoZXIoc2NoZWR1bGVOZXh0QmF0Y2gsIGFsbG93S2VlcEFsaXZlKSB7XG4gICAgbGV0IHJ1bk5leHRGcmFtZSA9IGZhbHNlO1xuICAgIGxldCB1c2VEZWZhdWx0RWxhcHNlZCA9IHRydWU7XG4gICAgY29uc3Qgc3RhdGUgPSB7XG4gICAgICAgIGRlbHRhOiAwLjAsXG4gICAgICAgIHRpbWVzdGFtcDogMC4wLFxuICAgICAgICBpc1Byb2Nlc3Npbmc6IGZhbHNlLFxuICAgIH07XG4gICAgY29uc3QgZmxhZ1J1bk5leHRGcmFtZSA9ICgpID0+IChydW5OZXh0RnJhbWUgPSB0cnVlKTtcbiAgICBjb25zdCBzdGVwcyA9IHN0ZXBzT3JkZXIucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgICAgICBhY2Nba2V5XSA9IGNyZWF0ZVJlbmRlclN0ZXAoZmxhZ1J1bk5leHRGcmFtZSwgYWxsb3dLZWVwQWxpdmUgPyBrZXkgOiB1bmRlZmluZWQpO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgICBjb25zdCB7IHNldHVwLCByZWFkLCByZXNvbHZlS2V5ZnJhbWVzLCBwcmVVcGRhdGUsIHVwZGF0ZSwgcHJlUmVuZGVyLCByZW5kZXIsIHBvc3RSZW5kZXIsIH0gPSBzdGVwcztcbiAgICBjb25zdCBwcm9jZXNzQmF0Y2ggPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHVzZU1hbnVhbFRpbWluZyA9IE1vdGlvbkdsb2JhbENvbmZpZy51c2VNYW51YWxUaW1pbmc7XG4gICAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IHVzZU1hbnVhbFRpbWluZ1xuICAgICAgICAgICAgPyBzdGF0ZS50aW1lc3RhbXBcbiAgICAgICAgICAgIDogcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHJ1bk5leHRGcmFtZSA9IGZhbHNlO1xuICAgICAgICBpZiAoIXVzZU1hbnVhbFRpbWluZykge1xuICAgICAgICAgICAgc3RhdGUuZGVsdGEgPSB1c2VEZWZhdWx0RWxhcHNlZFxuICAgICAgICAgICAgICAgID8gMTAwMCAvIDYwXG4gICAgICAgICAgICAgICAgOiBNYXRoLm1heChNYXRoLm1pbih0aW1lc3RhbXAgLSBzdGF0ZS50aW1lc3RhbXAsIG1heEVsYXBzZWQpLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBzdGF0ZS50aW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgICAgIHN0YXRlLmlzUHJvY2Vzc2luZyA9IHRydWU7XG4gICAgICAgIC8vIFVucm9sbGVkIHJlbmRlciBsb29wIGZvciBiZXR0ZXIgcGVyLWZyYW1lIHBlcmZvcm1hbmNlXG4gICAgICAgIHNldHVwLnByb2Nlc3Moc3RhdGUpO1xuICAgICAgICByZWFkLnByb2Nlc3Moc3RhdGUpO1xuICAgICAgICByZXNvbHZlS2V5ZnJhbWVzLnByb2Nlc3Moc3RhdGUpO1xuICAgICAgICBwcmVVcGRhdGUucHJvY2VzcyhzdGF0ZSk7XG4gICAgICAgIHVwZGF0ZS5wcm9jZXNzKHN0YXRlKTtcbiAgICAgICAgcHJlUmVuZGVyLnByb2Nlc3Moc3RhdGUpO1xuICAgICAgICByZW5kZXIucHJvY2VzcyhzdGF0ZSk7XG4gICAgICAgIHBvc3RSZW5kZXIucHJvY2VzcyhzdGF0ZSk7XG4gICAgICAgIHN0YXRlLmlzUHJvY2Vzc2luZyA9IGZhbHNlO1xuICAgICAgICBpZiAocnVuTmV4dEZyYW1lICYmIGFsbG93S2VlcEFsaXZlKSB7XG4gICAgICAgICAgICB1c2VEZWZhdWx0RWxhcHNlZCA9IGZhbHNlO1xuICAgICAgICAgICAgc2NoZWR1bGVOZXh0QmF0Y2gocHJvY2Vzc0JhdGNoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgY29uc3Qgd2FrZSA9ICgpID0+IHtcbiAgICAgICAgcnVuTmV4dEZyYW1lID0gdHJ1ZTtcbiAgICAgICAgdXNlRGVmYXVsdEVsYXBzZWQgPSB0cnVlO1xuICAgICAgICBpZiAoIXN0YXRlLmlzUHJvY2Vzc2luZykge1xuICAgICAgICAgICAgc2NoZWR1bGVOZXh0QmF0Y2gocHJvY2Vzc0JhdGNoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgY29uc3Qgc2NoZWR1bGUgPSBzdGVwc09yZGVyLnJlZHVjZSgoYWNjLCBrZXkpID0+IHtcbiAgICAgICAgY29uc3Qgc3RlcCA9IHN0ZXBzW2tleV07XG4gICAgICAgIGFjY1trZXldID0gKHByb2Nlc3MsIGtlZXBBbGl2ZSA9IGZhbHNlLCBpbW1lZGlhdGUgPSBmYWxzZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFydW5OZXh0RnJhbWUpXG4gICAgICAgICAgICAgICAgd2FrZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHN0ZXAuc2NoZWR1bGUocHJvY2Vzcywga2VlcEFsaXZlLCBpbW1lZGlhdGUpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgICBjb25zdCBjYW5jZWwgPSAocHJvY2VzcykgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ZXBzT3JkZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHN0ZXBzW3N0ZXBzT3JkZXJbaV1dLmNhbmNlbChwcm9jZXNzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIHsgc2NoZWR1bGUsIGNhbmNlbCwgc3RhdGUsIHN0ZXBzIH07XG59XG5cbmV4cG9ydCB7IGNyZWF0ZVJlbmRlckJhdGNoZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJhdGNoZXIubWpzLm1hcFxuIiwiaW1wb3J0IHsgbm9vcCB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBjcmVhdGVSZW5kZXJCYXRjaGVyIH0gZnJvbSAnLi9iYXRjaGVyLm1qcyc7XG5cbmNvbnN0IHsgc2NoZWR1bGU6IGZyYW1lLCBjYW5jZWw6IGNhbmNlbEZyYW1lLCBzdGF0ZTogZnJhbWVEYXRhLCBzdGVwczogZnJhbWVTdGVwcywgfSA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVSZW5kZXJCYXRjaGVyKHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgIT09IFwidW5kZWZpbmVkXCIgPyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgOiBub29wLCB0cnVlKTtcblxuZXhwb3J0IHsgY2FuY2VsRnJhbWUsIGZyYW1lLCBmcmFtZURhdGEsIGZyYW1lU3RlcHMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZyYW1lLm1qcy5tYXBcbiIsImltcG9ydCB7IE1vdGlvbkdsb2JhbENvbmZpZyB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBmcmFtZURhdGEgfSBmcm9tICcuL2ZyYW1lLm1qcyc7XG5cbmxldCBub3c7XG5mdW5jdGlvbiBjbGVhclRpbWUoKSB7XG4gICAgbm93ID0gdW5kZWZpbmVkO1xufVxuLyoqXG4gKiBBbiBldmVudGxvb3Atc3luY2hyb25vdXMgYWx0ZXJuYXRpdmUgdG8gcGVyZm9ybWFuY2Uubm93KCkuXG4gKlxuICogRW5zdXJlcyB0aGF0IHRpbWUgbWVhc3VyZW1lbnRzIHJlbWFpbiBjb25zaXN0ZW50IHdpdGhpbiBhIHN5bmNocm9ub3VzIGNvbnRleHQuXG4gKiBVc3VhbGx5IGNhbGxpbmcgcGVyZm9ybWFuY2Uubm93KCkgdHdpY2Ugd2l0aGluIHRoZSBzYW1lIHN5bmNocm9ub3VzIGNvbnRleHRcbiAqIHdpbGwgcmV0dXJuIGRpZmZlcmVudCB2YWx1ZXMgd2hpY2ggaXNuJ3QgdXNlZnVsIGZvciBhbmltYXRpb25zIHdoZW4gd2UncmUgdXN1YWxseVxuICogdHJ5aW5nIHRvIHN5bmMgYW5pbWF0aW9ucyB0byB0aGUgc2FtZSBmcmFtZS5cbiAqL1xuY29uc3QgdGltZSA9IHtcbiAgICBub3c6ICgpID0+IHtcbiAgICAgICAgaWYgKG5vdyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aW1lLnNldChmcmFtZURhdGEuaXNQcm9jZXNzaW5nIHx8IE1vdGlvbkdsb2JhbENvbmZpZy51c2VNYW51YWxUaW1pbmdcbiAgICAgICAgICAgICAgICA/IGZyYW1lRGF0YS50aW1lc3RhbXBcbiAgICAgICAgICAgICAgICA6IHBlcmZvcm1hbmNlLm5vdygpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm93O1xuICAgIH0sXG4gICAgc2V0OiAobmV3VGltZSkgPT4ge1xuICAgICAgICBub3cgPSBuZXdUaW1lO1xuICAgICAgICBxdWV1ZU1pY3JvdGFzayhjbGVhclRpbWUpO1xuICAgIH0sXG59O1xuXG5leHBvcnQgeyB0aW1lIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zeW5jLXRpbWUubWpzLm1hcFxuIiwiY29uc3QgYWN0aXZlQW5pbWF0aW9ucyA9IHtcbiAgICBsYXlvdXQ6IDAsXG4gICAgbWFpblRocmVhZDogMCxcbiAgICB3YWFwaTogMCxcbn07XG5cbmV4cG9ydCB7IGFjdGl2ZUFuaW1hdGlvbnMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFuaW1hdGlvbi1jb3VudC5tanMubWFwXG4iLCJjb25zdCBjaGVja1N0cmluZ1N0YXJ0c1dpdGggPSAodG9rZW4pID0+IChrZXkpID0+IHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIgJiYga2V5LnN0YXJ0c1dpdGgodG9rZW4pO1xuY29uc3QgaXNDU1NWYXJpYWJsZU5hbWUgPSBcbi8qQF9fUFVSRV9fKi8gY2hlY2tTdHJpbmdTdGFydHNXaXRoKFwiLS1cIik7XG5jb25zdCBzdGFydHNBc1ZhcmlhYmxlVG9rZW4gPSBcbi8qQF9fUFVSRV9fKi8gY2hlY2tTdHJpbmdTdGFydHNXaXRoKFwidmFyKC0tXCIpO1xuY29uc3QgaXNDU1NWYXJpYWJsZVRva2VuID0gKHZhbHVlKSA9PiB7XG4gICAgY29uc3Qgc3RhcnRzV2l0aFRva2VuID0gc3RhcnRzQXNWYXJpYWJsZVRva2VuKHZhbHVlKTtcbiAgICBpZiAoIXN0YXJ0c1dpdGhUb2tlbilcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vIEVuc3VyZSBhbnkgY29tbWVudHMgYXJlIHN0cmlwcGVkIGZyb20gdGhlIHZhbHVlIGFzIHRoaXMgY2FuIGhhcm0gcGVyZm9ybWFuY2Ugb2YgdGhlIHJlZ2V4LlxuICAgIHJldHVybiBzaW5nbGVDc3NWYXJpYWJsZVJlZ2V4LnRlc3QodmFsdWUuc3BsaXQoXCIvKlwiKVswXS50cmltKCkpO1xufTtcbmNvbnN0IHNpbmdsZUNzc1ZhcmlhYmxlUmVnZXggPSAvdmFyXFwoLS0oPzpbXFx3LV0rXFxzKnxbXFx3LV0rXFxzKiwoPzpcXHMqW14pKFxcc118XFxzKlxcKCg/OlteKShdfFxcKFteKShdKlxcKSkqXFwpKStcXHMqKVxcKSQvaXU7XG4vKipcbiAqIENoZWNrIGlmIGEgdmFsdWUgY29udGFpbnMgYSBDU1MgdmFyaWFibGUgYW55d2hlcmUgKGUuZy4gaW5zaWRlIGNhbGMoKSkuXG4gKiBVbmxpa2UgaXNDU1NWYXJpYWJsZVRva2VuIHdoaWNoIGNoZWNrcyBpZiB0aGUgdmFsdWUgSVMgYSB2YXIoKSB0b2tlbixcbiAqIHRoaXMgY2hlY2tzIGlmIHRoZSB2YWx1ZSBDT05UQUlOUyB2YXIoKSBzb21ld2hlcmUgaW4gdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gY29udGFpbnNDU1NWYXJpYWJsZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAvLyBTdHJpcCBjb21tZW50cyB0byBhdm9pZCBmYWxzZSBwb3NpdGl2ZXNcbiAgICByZXR1cm4gdmFsdWUuc3BsaXQoXCIvKlwiKVswXS5pbmNsdWRlcyhcInZhcigtLVwiKTtcbn1cblxuZXhwb3J0IHsgY29udGFpbnNDU1NWYXJpYWJsZSwgaXNDU1NWYXJpYWJsZU5hbWUsIGlzQ1NTVmFyaWFibGVUb2tlbiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtY3NzLXZhcmlhYmxlLm1qcy5tYXBcbiIsImltcG9ydCB7IGNsYW1wIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcblxuY29uc3QgbnVtYmVyID0ge1xuICAgIHRlc3Q6ICh2KSA9PiB0eXBlb2YgdiA9PT0gXCJudW1iZXJcIixcbiAgICBwYXJzZTogcGFyc2VGbG9hdCxcbiAgICB0cmFuc2Zvcm06ICh2KSA9PiB2LFxufTtcbmNvbnN0IGFscGhhID0ge1xuICAgIC4uLm51bWJlcixcbiAgICB0cmFuc2Zvcm06ICh2KSA9PiBjbGFtcCgwLCAxLCB2KSxcbn07XG5jb25zdCBzY2FsZSA9IHtcbiAgICAuLi5udW1iZXIsXG4gICAgZGVmYXVsdDogMSxcbn07XG5cbmV4cG9ydCB7IGFscGhhLCBudW1iZXIsIHNjYWxlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5tanMubWFwXG4iLCIvLyBJZiB0aGlzIG51bWJlciBpcyBhIGRlY2ltYWwsIG1ha2UgaXQganVzdCBmaXZlIGRlY2ltYWwgcGxhY2VzXG4vLyB0byBhdm9pZCBleHBvbmVudHNcbmNvbnN0IHNhbml0aXplID0gKHYpID0+IE1hdGgucm91bmQodiAqIDEwMDAwMCkgLyAxMDAwMDA7XG5cbmV4cG9ydCB7IHNhbml0aXplIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zYW5pdGl6ZS5tanMubWFwXG4iLCJjb25zdCBmbG9hdFJlZ2V4ID0gLy0/KD86XFxkKyg/OlxcLlxcZCspP3xcXC5cXGQrKS9ndTtcblxuZXhwb3J0IHsgZmxvYXRSZWdleCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmxvYXQtcmVnZXgubWpzLm1hcFxuIiwiZnVuY3Rpb24gaXNOdWxsaXNoKHYpIHtcbiAgICByZXR1cm4gdiA9PSBudWxsO1xufVxuXG5leHBvcnQgeyBpc051bGxpc2ggfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzLW51bGxpc2gubWpzLm1hcFxuIiwiY29uc3Qgc2luZ2xlQ29sb3JSZWdleCA9IC9eKD86I1tcXGRhLWZdezMsOH18KD86cmdifGhzbClhP1xcKCg/Oi0/W1xcZC5dKyU/WyxcXHNdKyl7Mn0tP1tcXGQuXSslP1xccyooPzpbLC9dXFxzKik/KD86XFxiXFxkKyg/OlxcLlxcZCspP3xcXC5cXGQrKT8lP1xcKSkkL2l1O1xuXG5leHBvcnQgeyBzaW5nbGVDb2xvclJlZ2V4IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaW5nbGUtY29sb3ItcmVnZXgubWpzLm1hcFxuIiwiaW1wb3J0IHsgZmxvYXRSZWdleCB9IGZyb20gJy4uL3V0aWxzL2Zsb2F0LXJlZ2V4Lm1qcyc7XG5pbXBvcnQgeyBpc051bGxpc2ggfSBmcm9tICcuLi91dGlscy9pcy1udWxsaXNoLm1qcyc7XG5pbXBvcnQgeyBzaW5nbGVDb2xvclJlZ2V4IH0gZnJvbSAnLi4vdXRpbHMvc2luZ2xlLWNvbG9yLXJlZ2V4Lm1qcyc7XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBwcm92aWRlZCBzdHJpbmcgaXMgYSBjb2xvciwgaWUgcmdiYSgwLDAsMCwwKSBvciAjMDAwLFxuICogYnV0IGZhbHNlIGlmIGEgbnVtYmVyIG9yIG11bHRpcGxlIGNvbG9yc1xuICovXG5jb25zdCBpc0NvbG9yU3RyaW5nID0gKHR5cGUsIHRlc3RQcm9wKSA9PiAodikgPT4ge1xuICAgIHJldHVybiBCb29sZWFuKCh0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICBzaW5nbGVDb2xvclJlZ2V4LnRlc3QodikgJiZcbiAgICAgICAgdi5zdGFydHNXaXRoKHR5cGUpKSB8fFxuICAgICAgICAodGVzdFByb3AgJiZcbiAgICAgICAgICAgICFpc051bGxpc2godikgJiZcbiAgICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2LCB0ZXN0UHJvcCkpKTtcbn07XG5jb25zdCBzcGxpdENvbG9yID0gKGFOYW1lLCBiTmFtZSwgY05hbWUpID0+ICh2KSA9PiB7XG4gICAgaWYgKHR5cGVvZiB2ICE9PSBcInN0cmluZ1wiKVxuICAgICAgICByZXR1cm4gdjtcbiAgICBjb25zdCBbYSwgYiwgYywgYWxwaGFdID0gdi5tYXRjaChmbG9hdFJlZ2V4KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBbYU5hbWVdOiBwYXJzZUZsb2F0KGEpLFxuICAgICAgICBbYk5hbWVdOiBwYXJzZUZsb2F0KGIpLFxuICAgICAgICBbY05hbWVdOiBwYXJzZUZsb2F0KGMpLFxuICAgICAgICBhbHBoYTogYWxwaGEgIT09IHVuZGVmaW5lZCA/IHBhcnNlRmxvYXQoYWxwaGEpIDogMSxcbiAgICB9O1xufTtcblxuZXhwb3J0IHsgaXNDb2xvclN0cmluZywgc3BsaXRDb2xvciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXRpbHMubWpzLm1hcFxuIiwiaW1wb3J0IHsgY2xhbXAgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgbnVtYmVyLCBhbHBoYSB9IGZyb20gJy4uL251bWJlcnMvaW5kZXgubWpzJztcbmltcG9ydCB7IHNhbml0aXplIH0gZnJvbSAnLi4vdXRpbHMvc2FuaXRpemUubWpzJztcbmltcG9ydCB7IHNwbGl0Q29sb3IsIGlzQ29sb3JTdHJpbmcgfSBmcm9tICcuL3V0aWxzLm1qcyc7XG5cbmNvbnN0IGNsYW1wUmdiVW5pdCA9ICh2KSA9PiBjbGFtcCgwLCAyNTUsIHYpO1xuY29uc3QgcmdiVW5pdCA9IHtcbiAgICAuLi5udW1iZXIsXG4gICAgdHJhbnNmb3JtOiAodikgPT4gTWF0aC5yb3VuZChjbGFtcFJnYlVuaXQodikpLFxufTtcbmNvbnN0IHJnYmEgPSB7XG4gICAgdGVzdDogLypAX19QVVJFX18qLyBpc0NvbG9yU3RyaW5nKFwicmdiXCIsIFwicmVkXCIpLFxuICAgIHBhcnNlOiAvKkBfX1BVUkVfXyovIHNwbGl0Q29sb3IoXCJyZWRcIiwgXCJncmVlblwiLCBcImJsdWVcIiksXG4gICAgdHJhbnNmb3JtOiAoeyByZWQsIGdyZWVuLCBibHVlLCBhbHBoYTogYWxwaGEkMSA9IDEgfSkgPT4gXCJyZ2JhKFwiICtcbiAgICAgICAgcmdiVW5pdC50cmFuc2Zvcm0ocmVkKSArXG4gICAgICAgIFwiLCBcIiArXG4gICAgICAgIHJnYlVuaXQudHJhbnNmb3JtKGdyZWVuKSArXG4gICAgICAgIFwiLCBcIiArXG4gICAgICAgIHJnYlVuaXQudHJhbnNmb3JtKGJsdWUpICtcbiAgICAgICAgXCIsIFwiICtcbiAgICAgICAgc2FuaXRpemUoYWxwaGEudHJhbnNmb3JtKGFscGhhJDEpKSArXG4gICAgICAgIFwiKVwiLFxufTtcblxuZXhwb3J0IHsgcmdiVW5pdCwgcmdiYSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmdiYS5tanMubWFwXG4iLCJpbXBvcnQgeyByZ2JhIH0gZnJvbSAnLi9yZ2JhLm1qcyc7XG5pbXBvcnQgeyBpc0NvbG9yU3RyaW5nIH0gZnJvbSAnLi91dGlscy5tanMnO1xuXG5mdW5jdGlvbiBwYXJzZUhleCh2KSB7XG4gICAgbGV0IHIgPSBcIlwiO1xuICAgIGxldCBnID0gXCJcIjtcbiAgICBsZXQgYiA9IFwiXCI7XG4gICAgbGV0IGEgPSBcIlwiO1xuICAgIC8vIElmIHdlIGhhdmUgNiBjaGFyYWN0ZXJzLCBpZSAjRkYwMDAwXG4gICAgaWYgKHYubGVuZ3RoID4gNSkge1xuICAgICAgICByID0gdi5zdWJzdHJpbmcoMSwgMyk7XG4gICAgICAgIGcgPSB2LnN1YnN0cmluZygzLCA1KTtcbiAgICAgICAgYiA9IHYuc3Vic3RyaW5nKDUsIDcpO1xuICAgICAgICBhID0gdi5zdWJzdHJpbmcoNywgOSk7XG4gICAgICAgIC8vIE9yIHdlIGhhdmUgMyBjaGFyYWN0ZXJzLCBpZSAjRjAwXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByID0gdi5zdWJzdHJpbmcoMSwgMik7XG4gICAgICAgIGcgPSB2LnN1YnN0cmluZygyLCAzKTtcbiAgICAgICAgYiA9IHYuc3Vic3RyaW5nKDMsIDQpO1xuICAgICAgICBhID0gdi5zdWJzdHJpbmcoNCwgNSk7XG4gICAgICAgIHIgKz0gcjtcbiAgICAgICAgZyArPSBnO1xuICAgICAgICBiICs9IGI7XG4gICAgICAgIGEgKz0gYTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVkOiBwYXJzZUludChyLCAxNiksXG4gICAgICAgIGdyZWVuOiBwYXJzZUludChnLCAxNiksXG4gICAgICAgIGJsdWU6IHBhcnNlSW50KGIsIDE2KSxcbiAgICAgICAgYWxwaGE6IGEgPyBwYXJzZUludChhLCAxNikgLyAyNTUgOiAxLFxuICAgIH07XG59XG5jb25zdCBoZXggPSB7XG4gICAgdGVzdDogLypAX19QVVJFX18qLyBpc0NvbG9yU3RyaW5nKFwiI1wiKSxcbiAgICBwYXJzZTogcGFyc2VIZXgsXG4gICAgdHJhbnNmb3JtOiByZ2JhLnRyYW5zZm9ybSxcbn07XG5cbmV4cG9ydCB7IGhleCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGV4Lm1qcy5tYXBcbiIsIi8qI19fTk9fU0lERV9FRkZFQ1RTX18qL1xuY29uc3QgY3JlYXRlVW5pdFR5cGUgPSAodW5pdCkgPT4gKHtcbiAgICB0ZXN0OiAodikgPT4gdHlwZW9mIHYgPT09IFwic3RyaW5nXCIgJiYgdi5lbmRzV2l0aCh1bml0KSAmJiB2LnNwbGl0KFwiIFwiKS5sZW5ndGggPT09IDEsXG4gICAgcGFyc2U6IHBhcnNlRmxvYXQsXG4gICAgdHJhbnNmb3JtOiAodikgPT4gYCR7dn0ke3VuaXR9YCxcbn0pO1xuY29uc3QgZGVncmVlcyA9IC8qQF9fUFVSRV9fKi8gY3JlYXRlVW5pdFR5cGUoXCJkZWdcIik7XG5jb25zdCBwZXJjZW50ID0gLypAX19QVVJFX18qLyBjcmVhdGVVbml0VHlwZShcIiVcIik7XG5jb25zdCBweCA9IC8qQF9fUFVSRV9fKi8gY3JlYXRlVW5pdFR5cGUoXCJweFwiKTtcbmNvbnN0IHZoID0gLypAX19QVVJFX18qLyBjcmVhdGVVbml0VHlwZShcInZoXCIpO1xuY29uc3QgdncgPSAvKkBfX1BVUkVfXyovIGNyZWF0ZVVuaXRUeXBlKFwidndcIik7XG5jb25zdCBwcm9ncmVzc1BlcmNlbnRhZ2UgPSAvKkBfX1BVUkVfXyovICgoKSA9PiAoe1xuICAgIC4uLnBlcmNlbnQsXG4gICAgcGFyc2U6ICh2KSA9PiBwZXJjZW50LnBhcnNlKHYpIC8gMTAwLFxuICAgIHRyYW5zZm9ybTogKHYpID0+IHBlcmNlbnQudHJhbnNmb3JtKHYgKiAxMDApLFxufSkpKCk7XG5cbmV4cG9ydCB7IGRlZ3JlZXMsIHBlcmNlbnQsIHByb2dyZXNzUGVyY2VudGFnZSwgcHgsIHZoLCB2dyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dW5pdHMubWpzLm1hcFxuIiwiaW1wb3J0IHsgYWxwaGEgfSBmcm9tICcuLi9udW1iZXJzL2luZGV4Lm1qcyc7XG5pbXBvcnQgeyBwZXJjZW50IH0gZnJvbSAnLi4vbnVtYmVycy91bml0cy5tanMnO1xuaW1wb3J0IHsgc2FuaXRpemUgfSBmcm9tICcuLi91dGlscy9zYW5pdGl6ZS5tanMnO1xuaW1wb3J0IHsgc3BsaXRDb2xvciwgaXNDb2xvclN0cmluZyB9IGZyb20gJy4vdXRpbHMubWpzJztcblxuY29uc3QgaHNsYSA9IHtcbiAgICB0ZXN0OiAvKkBfX1BVUkVfXyovIGlzQ29sb3JTdHJpbmcoXCJoc2xcIiwgXCJodWVcIiksXG4gICAgcGFyc2U6IC8qQF9fUFVSRV9fKi8gc3BsaXRDb2xvcihcImh1ZVwiLCBcInNhdHVyYXRpb25cIiwgXCJsaWdodG5lc3NcIiksXG4gICAgdHJhbnNmb3JtOiAoeyBodWUsIHNhdHVyYXRpb24sIGxpZ2h0bmVzcywgYWxwaGE6IGFscGhhJDEgPSAxIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIChcImhzbGEoXCIgK1xuICAgICAgICAgICAgTWF0aC5yb3VuZChodWUpICtcbiAgICAgICAgICAgIFwiLCBcIiArXG4gICAgICAgICAgICBwZXJjZW50LnRyYW5zZm9ybShzYW5pdGl6ZShzYXR1cmF0aW9uKSkgK1xuICAgICAgICAgICAgXCIsIFwiICtcbiAgICAgICAgICAgIHBlcmNlbnQudHJhbnNmb3JtKHNhbml0aXplKGxpZ2h0bmVzcykpICtcbiAgICAgICAgICAgIFwiLCBcIiArXG4gICAgICAgICAgICBzYW5pdGl6ZShhbHBoYS50cmFuc2Zvcm0oYWxwaGEkMSkpICtcbiAgICAgICAgICAgIFwiKVwiKTtcbiAgICB9LFxufTtcblxuZXhwb3J0IHsgaHNsYSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aHNsYS5tanMubWFwXG4iLCJpbXBvcnQgeyBoZXggfSBmcm9tICcuL2hleC5tanMnO1xuaW1wb3J0IHsgaHNsYSB9IGZyb20gJy4vaHNsYS5tanMnO1xuaW1wb3J0IHsgcmdiYSB9IGZyb20gJy4vcmdiYS5tanMnO1xuXG5jb25zdCBjb2xvciA9IHtcbiAgICB0ZXN0OiAodikgPT4gcmdiYS50ZXN0KHYpIHx8IGhleC50ZXN0KHYpIHx8IGhzbGEudGVzdCh2KSxcbiAgICBwYXJzZTogKHYpID0+IHtcbiAgICAgICAgaWYgKHJnYmEudGVzdCh2KSkge1xuICAgICAgICAgICAgcmV0dXJuIHJnYmEucGFyc2Uodik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaHNsYS50ZXN0KHYpKSB7XG4gICAgICAgICAgICByZXR1cm4gaHNsYS5wYXJzZSh2KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBoZXgucGFyc2Uodik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHRyYW5zZm9ybTogKHYpID0+IHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB2ID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICA/IHZcbiAgICAgICAgICAgIDogdi5oYXNPd25Qcm9wZXJ0eShcInJlZFwiKVxuICAgICAgICAgICAgICAgID8gcmdiYS50cmFuc2Zvcm0odilcbiAgICAgICAgICAgICAgICA6IGhzbGEudHJhbnNmb3JtKHYpO1xuICAgIH0sXG4gICAgZ2V0QW5pbWF0YWJsZU5vbmU6ICh2KSA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnNlZCA9IGNvbG9yLnBhcnNlKHYpO1xuICAgICAgICBwYXJzZWQuYWxwaGEgPSAwO1xuICAgICAgICByZXR1cm4gY29sb3IudHJhbnNmb3JtKHBhcnNlZCk7XG4gICAgfSxcbn07XG5cbmV4cG9ydCB7IGNvbG9yIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5tanMubWFwXG4iLCJjb25zdCBjb2xvclJlZ2V4ID0gLyg/OiNbXFxkYS1mXXszLDh9fCg/OnJnYnxoc2wpYT9cXCgoPzotP1tcXGQuXSslP1ssXFxzXSspezJ9LT9bXFxkLl0rJT9cXHMqKD86WywvXVxccyopPyg/OlxcYlxcZCsoPzpcXC5cXGQrKT98XFwuXFxkKyk/JT9cXCkpL2dpdTtcblxuZXhwb3J0IHsgY29sb3JSZWdleCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29sb3ItcmVnZXgubWpzLm1hcFxuIiwiaW1wb3J0IHsgY29sb3IgfSBmcm9tICcuLi9jb2xvci9pbmRleC5tanMnO1xuaW1wb3J0IHsgY29sb3JSZWdleCB9IGZyb20gJy4uL3V0aWxzL2NvbG9yLXJlZ2V4Lm1qcyc7XG5pbXBvcnQgeyBmbG9hdFJlZ2V4IH0gZnJvbSAnLi4vdXRpbHMvZmxvYXQtcmVnZXgubWpzJztcbmltcG9ydCB7IHNhbml0aXplIH0gZnJvbSAnLi4vdXRpbHMvc2FuaXRpemUubWpzJztcblxuZnVuY3Rpb24gdGVzdCh2KSB7XG4gICAgcmV0dXJuIChpc05hTih2KSAmJlxuICAgICAgICB0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAodi5tYXRjaChmbG9hdFJlZ2V4KT8ubGVuZ3RoIHx8IDApICtcbiAgICAgICAgICAgICh2Lm1hdGNoKGNvbG9yUmVnZXgpPy5sZW5ndGggfHwgMCkgPlxuICAgICAgICAgICAgMCk7XG59XG5jb25zdCBOVU1CRVJfVE9LRU4gPSBcIm51bWJlclwiO1xuY29uc3QgQ09MT1JfVE9LRU4gPSBcImNvbG9yXCI7XG5jb25zdCBWQVJfVE9LRU4gPSBcInZhclwiO1xuY29uc3QgVkFSX0ZVTkNUSU9OX1RPS0VOID0gXCJ2YXIoXCI7XG5jb25zdCBTUExJVF9UT0tFTiA9IFwiJHt9XCI7XG4vLyB0aGlzIHJlZ2V4IGNvbnNpc3RzIG9mIHRoZSBgc2luZ2xlQ3NzVmFyaWFibGVSZWdleHxyZ2JIU0xWYWx1ZVJlZ2V4fGRpZ2l0UmVnZXhgXG5jb25zdCBjb21wbGV4UmVnZXggPSAvdmFyXFxzKlxcKFxccyotLSg/OltcXHctXStcXHMqfFtcXHctXStcXHMqLCg/OlxccypbXikoXFxzXXxcXHMqXFwoKD86W14pKF18XFwoW14pKF0qXFwpKSpcXCkpK1xccyopXFwpfCNbXFxkYS1mXXszLDh9fCg/OnJnYnxoc2wpYT9cXCgoPzotP1tcXGQuXSslP1ssXFxzXSspezJ9LT9bXFxkLl0rJT9cXHMqKD86WywvXVxccyopPyg/OlxcYlxcZCsoPzpcXC5cXGQrKT98XFwuXFxkKyk/JT9cXCl8LT8oPzpcXGQrKD86XFwuXFxkKyk/fFxcLlxcZCspL2dpdTtcbmZ1bmN0aW9uIGFuYWx5c2VDb21wbGV4VmFsdWUodmFsdWUpIHtcbiAgICBjb25zdCBvcmlnaW5hbFZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcbiAgICBjb25zdCB2YWx1ZXMgPSBbXTtcbiAgICBjb25zdCBpbmRleGVzID0ge1xuICAgICAgICBjb2xvcjogW10sXG4gICAgICAgIG51bWJlcjogW10sXG4gICAgICAgIHZhcjogW10sXG4gICAgfTtcbiAgICBjb25zdCB0eXBlcyA9IFtdO1xuICAgIGxldCBpID0gMDtcbiAgICBjb25zdCB0b2tlbmlzZWQgPSBvcmlnaW5hbFZhbHVlLnJlcGxhY2UoY29tcGxleFJlZ2V4LCAocGFyc2VkVmFsdWUpID0+IHtcbiAgICAgICAgaWYgKGNvbG9yLnRlc3QocGFyc2VkVmFsdWUpKSB7XG4gICAgICAgICAgICBpbmRleGVzLmNvbG9yLnB1c2goaSk7XG4gICAgICAgICAgICB0eXBlcy5wdXNoKENPTE9SX1RPS0VOKTtcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKGNvbG9yLnBhcnNlKHBhcnNlZFZhbHVlKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocGFyc2VkVmFsdWUuc3RhcnRzV2l0aChWQVJfRlVOQ1RJT05fVE9LRU4pKSB7XG4gICAgICAgICAgICBpbmRleGVzLnZhci5wdXNoKGkpO1xuICAgICAgICAgICAgdHlwZXMucHVzaChWQVJfVE9LRU4pO1xuICAgICAgICAgICAgdmFsdWVzLnB1c2gocGFyc2VkVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaW5kZXhlcy5udW1iZXIucHVzaChpKTtcbiAgICAgICAgICAgIHR5cGVzLnB1c2goTlVNQkVSX1RPS0VOKTtcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKHBhcnNlRmxvYXQocGFyc2VkVmFsdWUpKTtcbiAgICAgICAgfVxuICAgICAgICArK2k7XG4gICAgICAgIHJldHVybiBTUExJVF9UT0tFTjtcbiAgICB9KTtcbiAgICBjb25zdCBzcGxpdCA9IHRva2VuaXNlZC5zcGxpdChTUExJVF9UT0tFTik7XG4gICAgcmV0dXJuIHsgdmFsdWVzLCBzcGxpdCwgaW5kZXhlcywgdHlwZXMgfTtcbn1cbmZ1bmN0aW9uIHBhcnNlQ29tcGxleFZhbHVlKHYpIHtcbiAgICByZXR1cm4gYW5hbHlzZUNvbXBsZXhWYWx1ZSh2KS52YWx1ZXM7XG59XG5mdW5jdGlvbiBidWlsZFRyYW5zZm9ybWVyKHsgc3BsaXQsIHR5cGVzIH0pIHtcbiAgICBjb25zdCBudW1TZWN0aW9ucyA9IHNwbGl0Lmxlbmd0aDtcbiAgICByZXR1cm4gKHYpID0+IHtcbiAgICAgICAgbGV0IG91dHB1dCA9IFwiXCI7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtU2VjdGlvbnM7IGkrKykge1xuICAgICAgICAgICAgb3V0cHV0ICs9IHNwbGl0W2ldO1xuICAgICAgICAgICAgaWYgKHZbaV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSB0eXBlc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gTlVNQkVSX1RPS0VOKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSBzYW5pdGl6ZSh2W2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gQ09MT1JfVE9LRU4pIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IGNvbG9yLnRyYW5zZm9ybSh2W2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSB2W2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH07XG59XG5mdW5jdGlvbiBjcmVhdGVUcmFuc2Zvcm1lcihzb3VyY2UpIHtcbiAgICByZXR1cm4gYnVpbGRUcmFuc2Zvcm1lcihhbmFseXNlQ29tcGxleFZhbHVlKHNvdXJjZSkpO1xufVxuY29uc3QgY29udmVydE51bWJlcnNUb1plcm8gPSAodikgPT4gdHlwZW9mIHYgPT09IFwibnVtYmVyXCIgPyAwIDogY29sb3IudGVzdCh2KSA/IGNvbG9yLmdldEFuaW1hdGFibGVOb25lKHYpIDogdjtcbi8qKlxuICogQ29udmVydCBhIHBhcnNlZCB2YWx1ZSB0byBpdHMgemVybyBlcXVpdmFsZW50LCBidXQgcHJlc2VydmUgbnVtYmVyc1xuICogdGhhdCBhY3QgYXMgZGl2aXNvcnMgaW4gQ1NTIGNhbGMoKSBleHByZXNzaW9ucy5cbiAqXG4gKiBhbmFseXNlQ29tcGxleFZhbHVlIGV4dHJhY3RzIG51bWJlcnMgZnJvbSBDU1Mgc3RyaW5ncyBhbmQgcHV0cyB0aGVcbiAqIHN1cnJvdW5kaW5nIHRleHQgaW50byBhIGBzcGxpdGAgdGVtcGxhdGUgYXJyYXkuIEZvciBleGFtcGxlOlxuICogICBcImNhbGModmFyKC0tZ2FwKSAvIDUpXCIgIOKGkiAgdmFsdWVzOiBbdmFyKC0tZ2FwKSwgNV1cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNwbGl0OiAgW1wiY2FsYyhcIiwgXCIgLyBcIiwgXCIpXCJdXG4gKlxuICogV2hlbiBidWlsZGluZyBhIHplcm8tZXF1aXZhbGVudCBmb3IgYW5pbWF0aW9uLCBuYWl2ZWx5IHplcm9pbmcgYWxsXG4gKiBudW1iZXJzIHR1cm5zIHRoZSBkaXZpc29yIGludG8gMCDihpIgXCJjYWxjKHZhcigtLWdhcCkgLyAwKVwiIOKGkiBOYU4uXG4gKiBXZSBkZXRlY3QgdGhpcyBieSBjaGVja2luZyB3aGV0aGVyIHRoZSB0ZXh0IHByZWNlZGluZyBhIG51bWJlclxuICogKHNwbGl0W2ldKSBlbmRzIHdpdGggXCIvXCIg4oCUIHRoZSBDU1MgY2FsYyBkaXZpc2lvbiBvcGVyYXRvci5cbiAqL1xuY29uc3QgY29udmVydFRvWmVybyA9ICh2YWx1ZSwgc3BsaXRCZWZvcmUpID0+IHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIHJldHVybiBzcGxpdEJlZm9yZT8udHJpbSgpLmVuZHNXaXRoKFwiL1wiKSA/IHZhbHVlIDogMDtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnZlcnROdW1iZXJzVG9aZXJvKHZhbHVlKTtcbn07XG5mdW5jdGlvbiBnZXRBbmltYXRhYmxlTm9uZSh2KSB7XG4gICAgY29uc3QgaW5mbyA9IGFuYWx5c2VDb21wbGV4VmFsdWUodik7XG4gICAgY29uc3QgdHJhbnNmb3JtZXIgPSBidWlsZFRyYW5zZm9ybWVyKGluZm8pO1xuICAgIHJldHVybiB0cmFuc2Zvcm1lcihpbmZvLnZhbHVlcy5tYXAoKHZhbHVlLCBpKSA9PiBjb252ZXJ0VG9aZXJvKHZhbHVlLCBpbmZvLnNwbGl0W2ldKSkpO1xufVxuY29uc3QgY29tcGxleCA9IHtcbiAgICB0ZXN0LFxuICAgIHBhcnNlOiBwYXJzZUNvbXBsZXhWYWx1ZSxcbiAgICBjcmVhdGVUcmFuc2Zvcm1lcixcbiAgICBnZXRBbmltYXRhYmxlTm9uZSxcbn07XG5cbmV4cG9ydCB7IGFuYWx5c2VDb21wbGV4VmFsdWUsIGNvbXBsZXggfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4Lm1qcy5tYXBcbiIsIi8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9tamFja3Nvbi81MzExMjU2XG5mdW5jdGlvbiBodWVUb1JnYihwLCBxLCB0KSB7XG4gICAgaWYgKHQgPCAwKVxuICAgICAgICB0ICs9IDE7XG4gICAgaWYgKHQgPiAxKVxuICAgICAgICB0IC09IDE7XG4gICAgaWYgKHQgPCAxIC8gNilcbiAgICAgICAgcmV0dXJuIHAgKyAocSAtIHApICogNiAqIHQ7XG4gICAgaWYgKHQgPCAxIC8gMilcbiAgICAgICAgcmV0dXJuIHE7XG4gICAgaWYgKHQgPCAyIC8gMylcbiAgICAgICAgcmV0dXJuIHAgKyAocSAtIHApICogKDIgLyAzIC0gdCkgKiA2O1xuICAgIHJldHVybiBwO1xufVxuZnVuY3Rpb24gaHNsYVRvUmdiYSh7IGh1ZSwgc2F0dXJhdGlvbiwgbGlnaHRuZXNzLCBhbHBoYSB9KSB7XG4gICAgaHVlIC89IDM2MDtcbiAgICBzYXR1cmF0aW9uIC89IDEwMDtcbiAgICBsaWdodG5lc3MgLz0gMTAwO1xuICAgIGxldCByZWQgPSAwO1xuICAgIGxldCBncmVlbiA9IDA7XG4gICAgbGV0IGJsdWUgPSAwO1xuICAgIGlmICghc2F0dXJhdGlvbikge1xuICAgICAgICByZWQgPSBncmVlbiA9IGJsdWUgPSBsaWdodG5lc3M7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBxID0gbGlnaHRuZXNzIDwgMC41XG4gICAgICAgICAgICA/IGxpZ2h0bmVzcyAqICgxICsgc2F0dXJhdGlvbilcbiAgICAgICAgICAgIDogbGlnaHRuZXNzICsgc2F0dXJhdGlvbiAtIGxpZ2h0bmVzcyAqIHNhdHVyYXRpb247XG4gICAgICAgIGNvbnN0IHAgPSAyICogbGlnaHRuZXNzIC0gcTtcbiAgICAgICAgcmVkID0gaHVlVG9SZ2IocCwgcSwgaHVlICsgMSAvIDMpO1xuICAgICAgICBncmVlbiA9IGh1ZVRvUmdiKHAsIHEsIGh1ZSk7XG4gICAgICAgIGJsdWUgPSBodWVUb1JnYihwLCBxLCBodWUgLSAxIC8gMyk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHJlZDogTWF0aC5yb3VuZChyZWQgKiAyNTUpLFxuICAgICAgICBncmVlbjogTWF0aC5yb3VuZChncmVlbiAqIDI1NSksXG4gICAgICAgIGJsdWU6IE1hdGgucm91bmQoYmx1ZSAqIDI1NSksXG4gICAgICAgIGFscGhhLFxuICAgIH07XG59XG5cbmV4cG9ydCB7IGhzbGFUb1JnYmEgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhzbGEtdG8tcmdiYS5tanMubWFwXG4iLCJmdW5jdGlvbiBtaXhJbW1lZGlhdGUoYSwgYikge1xuICAgIHJldHVybiAocCkgPT4gKHAgPiAwID8gYiA6IGEpO1xufVxuXG5leHBvcnQgeyBtaXhJbW1lZGlhdGUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWltbWVkaWF0ZS5tanMubWFwXG4iLCIvKlxuICBWYWx1ZSBpbiByYW5nZSBmcm9tIHByb2dyZXNzXG5cbiAgR2l2ZW4gYSBsb3dlciBsaW1pdCBhbmQgYW4gdXBwZXIgbGltaXQsIHdlIHJldHVybiB0aGUgdmFsdWUgd2l0aGluXG4gIHRoYXQgcmFuZ2UgYXMgZXhwcmVzc2VkIGJ5IHByb2dyZXNzICh1c3VhbGx5IGEgbnVtYmVyIGZyb20gMCB0byAxKVxuXG4gIFNvIHByb2dyZXNzID0gMC41IHdvdWxkIGNoYW5nZVxuXG4gIGZyb20gLS0tLS0tLS0gdG9cblxuICB0b1xuXG4gIGZyb20gLS0tLSB0b1xuXG4gIEUuZy4gZnJvbSA9IDEwLCB0byA9IDIwLCBwcm9ncmVzcyA9IDAuNSA9PiAxNVxuXG4gIEBwYXJhbSBbbnVtYmVyXTogTG93ZXIgbGltaXQgb2YgcmFuZ2VcbiAgQHBhcmFtIFtudW1iZXJdOiBVcHBlciBsaW1pdCBvZiByYW5nZVxuICBAcGFyYW0gW251bWJlcl06IFRoZSBwcm9ncmVzcyBiZXR3ZWVuIGxvd2VyIGFuZCB1cHBlciBsaW1pdHMgZXhwcmVzc2VkIDAtMVxuICBAcmV0dXJuIFtudW1iZXJdOiBWYWx1ZSBhcyBjYWxjdWxhdGVkIGZyb20gcHJvZ3Jlc3Mgd2l0aGluIHJhbmdlIChub3QgbGltaXRlZCB3aXRoaW4gcmFuZ2UpXG4qL1xuY29uc3QgbWl4TnVtYmVyID0gKGZyb20sIHRvLCBwcm9ncmVzcykgPT4ge1xuICAgIHJldHVybiBmcm9tICsgKHRvIC0gZnJvbSkgKiBwcm9ncmVzcztcbn07XG5cbmV4cG9ydCB7IG1peE51bWJlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bnVtYmVyLm1qcy5tYXBcbiIsImltcG9ydCB7IHdhcm5pbmcgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgaGV4IH0gZnJvbSAnLi4vLi4vdmFsdWUvdHlwZXMvY29sb3IvaGV4Lm1qcyc7XG5pbXBvcnQgeyBoc2xhIH0gZnJvbSAnLi4vLi4vdmFsdWUvdHlwZXMvY29sb3IvaHNsYS5tanMnO1xuaW1wb3J0IHsgaHNsYVRvUmdiYSB9IGZyb20gJy4uLy4uL3ZhbHVlL3R5cGVzL2NvbG9yL2hzbGEtdG8tcmdiYS5tanMnO1xuaW1wb3J0IHsgcmdiYSB9IGZyb20gJy4uLy4uL3ZhbHVlL3R5cGVzL2NvbG9yL3JnYmEubWpzJztcbmltcG9ydCB7IG1peEltbWVkaWF0ZSB9IGZyb20gJy4vaW1tZWRpYXRlLm1qcyc7XG5pbXBvcnQgeyBtaXhOdW1iZXIgfSBmcm9tICcuL251bWJlci5tanMnO1xuXG4vLyBMaW5lYXIgY29sb3Igc3BhY2UgYmxlbmRpbmdcbi8vIEV4cGxhaW5lZCBodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PUxLbnFFQ2NnNkd3XG4vLyBEZW1vbnN0cmF0ZWQgaHR0cDovL2NvZGVwZW4uaW8vb3N1Ymxha2UvcGVuL3hHVlZhTlxuY29uc3QgbWl4TGluZWFyQ29sb3IgPSAoZnJvbSwgdG8sIHYpID0+IHtcbiAgICBjb25zdCBmcm9tRXhwbyA9IGZyb20gKiBmcm9tO1xuICAgIGNvbnN0IGV4cG8gPSB2ICogKHRvICogdG8gLSBmcm9tRXhwbykgKyBmcm9tRXhwbztcbiAgICByZXR1cm4gZXhwbyA8IDAgPyAwIDogTWF0aC5zcXJ0KGV4cG8pO1xufTtcbmNvbnN0IGNvbG9yVHlwZXMgPSBbaGV4LCByZ2JhLCBoc2xhXTtcbmNvbnN0IGdldENvbG9yVHlwZSA9ICh2KSA9PiBjb2xvclR5cGVzLmZpbmQoKHR5cGUpID0+IHR5cGUudGVzdCh2KSk7XG5mdW5jdGlvbiBhc1JHQkEoY29sb3IpIHtcbiAgICBjb25zdCB0eXBlID0gZ2V0Q29sb3JUeXBlKGNvbG9yKTtcbiAgICB3YXJuaW5nKEJvb2xlYW4odHlwZSksIGAnJHtjb2xvcn0nIGlzIG5vdCBhbiBhbmltYXRhYmxlIGNvbG9yLiBVc2UgdGhlIGVxdWl2YWxlbnQgY29sb3IgY29kZSBpbnN0ZWFkLmAsIFwiY29sb3Itbm90LWFuaW1hdGFibGVcIik7XG4gICAgaWYgKCFCb29sZWFuKHR5cGUpKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgbGV0IG1vZGVsID0gdHlwZS5wYXJzZShjb2xvcik7XG4gICAgaWYgKHR5cGUgPT09IGhzbGEpIHtcbiAgICAgICAgLy8gVE9ETyBSZW1vdmUgdGhpcyBjYXN0IC0gbmVlZGVkIHNpbmNlIE1vdGlvbidzIHN0cmljdGVyIHR5cGluZ1xuICAgICAgICBtb2RlbCA9IGhzbGFUb1JnYmEobW9kZWwpO1xuICAgIH1cbiAgICByZXR1cm4gbW9kZWw7XG59XG5jb25zdCBtaXhDb2xvciA9IChmcm9tLCB0bykgPT4ge1xuICAgIGNvbnN0IGZyb21SR0JBID0gYXNSR0JBKGZyb20pO1xuICAgIGNvbnN0IHRvUkdCQSA9IGFzUkdCQSh0byk7XG4gICAgaWYgKCFmcm9tUkdCQSB8fCAhdG9SR0JBKSB7XG4gICAgICAgIHJldHVybiBtaXhJbW1lZGlhdGUoZnJvbSwgdG8pO1xuICAgIH1cbiAgICBjb25zdCBibGVuZGVkID0geyAuLi5mcm9tUkdCQSB9O1xuICAgIHJldHVybiAodikgPT4ge1xuICAgICAgICBibGVuZGVkLnJlZCA9IG1peExpbmVhckNvbG9yKGZyb21SR0JBLnJlZCwgdG9SR0JBLnJlZCwgdik7XG4gICAgICAgIGJsZW5kZWQuZ3JlZW4gPSBtaXhMaW5lYXJDb2xvcihmcm9tUkdCQS5ncmVlbiwgdG9SR0JBLmdyZWVuLCB2KTtcbiAgICAgICAgYmxlbmRlZC5ibHVlID0gbWl4TGluZWFyQ29sb3IoZnJvbVJHQkEuYmx1ZSwgdG9SR0JBLmJsdWUsIHYpO1xuICAgICAgICBibGVuZGVkLmFscGhhID0gbWl4TnVtYmVyKGZyb21SR0JBLmFscGhhLCB0b1JHQkEuYWxwaGEsIHYpO1xuICAgICAgICByZXR1cm4gcmdiYS50cmFuc2Zvcm0oYmxlbmRlZCk7XG4gICAgfTtcbn07XG5cbmV4cG9ydCB7IG1peENvbG9yLCBtaXhMaW5lYXJDb2xvciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29sb3IubWpzLm1hcFxuIiwiY29uc3QgaW52aXNpYmxlVmFsdWVzID0gbmV3IFNldChbXCJub25lXCIsIFwiaGlkZGVuXCJdKTtcbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gcHJvdmlkZWQgYSBwcm9ncmVzcyB2YWx1ZSBiZXR3ZWVuIDAgYW5kIDEsXG4gKiB3aWxsIHJldHVybiB0aGUgXCJub25lXCIgb3IgXCJoaWRkZW5cIiBzdHJpbmcgb25seSB3aGVuIHRoZSBwcm9ncmVzcyBpcyB0aGF0IG9mXG4gKiB0aGUgb3JpZ2luIG9yIHRhcmdldC5cbiAqL1xuZnVuY3Rpb24gbWl4VmlzaWJpbGl0eShvcmlnaW4sIHRhcmdldCkge1xuICAgIGlmIChpbnZpc2libGVWYWx1ZXMuaGFzKG9yaWdpbikpIHtcbiAgICAgICAgcmV0dXJuIChwKSA9PiAocCA8PSAwID8gb3JpZ2luIDogdGFyZ2V0KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiAocCkgPT4gKHAgPj0gMSA/IHRhcmdldCA6IG9yaWdpbik7XG4gICAgfVxufVxuXG5leHBvcnQgeyBpbnZpc2libGVWYWx1ZXMsIG1peFZpc2liaWxpdHkgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXZpc2liaWxpdHkubWpzLm1hcFxuIiwiaW1wb3J0IHsgcGlwZSwgd2FybmluZyB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBpc0NTU1ZhcmlhYmxlVG9rZW4gfSBmcm9tICcuLi8uLi9hbmltYXRpb24vdXRpbHMvaXMtY3NzLXZhcmlhYmxlLm1qcyc7XG5pbXBvcnQgeyBjb2xvciB9IGZyb20gJy4uLy4uL3ZhbHVlL3R5cGVzL2NvbG9yL2luZGV4Lm1qcyc7XG5pbXBvcnQgeyBjb21wbGV4LCBhbmFseXNlQ29tcGxleFZhbHVlIH0gZnJvbSAnLi4vLi4vdmFsdWUvdHlwZXMvY29tcGxleC9pbmRleC5tanMnO1xuaW1wb3J0IHsgbWl4Q29sb3IgfSBmcm9tICcuL2NvbG9yLm1qcyc7XG5pbXBvcnQgeyBtaXhJbW1lZGlhdGUgfSBmcm9tICcuL2ltbWVkaWF0ZS5tanMnO1xuaW1wb3J0IHsgbWl4TnVtYmVyIGFzIG1peE51bWJlciQxIH0gZnJvbSAnLi9udW1iZXIubWpzJztcbmltcG9ydCB7IGludmlzaWJsZVZhbHVlcywgbWl4VmlzaWJpbGl0eSB9IGZyb20gJy4vdmlzaWJpbGl0eS5tanMnO1xuXG5mdW5jdGlvbiBtaXhOdW1iZXIoYSwgYikge1xuICAgIHJldHVybiAocCkgPT4gbWl4TnVtYmVyJDEoYSwgYiwgcCk7XG59XG5mdW5jdGlvbiBnZXRNaXhlcihhKSB7XG4gICAgaWYgKHR5cGVvZiBhID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIHJldHVybiBtaXhOdW1iZXI7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBhID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJldHVybiBpc0NTU1ZhcmlhYmxlVG9rZW4oYSlcbiAgICAgICAgICAgID8gbWl4SW1tZWRpYXRlXG4gICAgICAgICAgICA6IGNvbG9yLnRlc3QoYSlcbiAgICAgICAgICAgICAgICA/IG1peENvbG9yXG4gICAgICAgICAgICAgICAgOiBtaXhDb21wbGV4O1xuICAgIH1cbiAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGEpKSB7XG4gICAgICAgIHJldHVybiBtaXhBcnJheTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGEgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuIGNvbG9yLnRlc3QoYSkgPyBtaXhDb2xvciA6IG1peE9iamVjdDtcbiAgICB9XG4gICAgcmV0dXJuIG1peEltbWVkaWF0ZTtcbn1cbmZ1bmN0aW9uIG1peEFycmF5KGEsIGIpIHtcbiAgICBjb25zdCBvdXRwdXQgPSBbLi4uYV07XG4gICAgY29uc3QgbnVtVmFsdWVzID0gb3V0cHV0Lmxlbmd0aDtcbiAgICBjb25zdCBibGVuZFZhbHVlID0gYS5tYXAoKHYsIGkpID0+IGdldE1peGVyKHYpKHYsIGJbaV0pKTtcbiAgICByZXR1cm4gKHApID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1WYWx1ZXM7IGkrKykge1xuICAgICAgICAgICAgb3V0cHV0W2ldID0gYmxlbmRWYWx1ZVtpXShwKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH07XG59XG5mdW5jdGlvbiBtaXhPYmplY3QoYSwgYikge1xuICAgIGNvbnN0IG91dHB1dCA9IHsgLi4uYSwgLi4uYiB9O1xuICAgIGNvbnN0IGJsZW5kVmFsdWUgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvdXRwdXQpIHtcbiAgICAgICAgaWYgKGFba2V5XSAhPT0gdW5kZWZpbmVkICYmIGJba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBibGVuZFZhbHVlW2tleV0gPSBnZXRNaXhlcihhW2tleV0pKGFba2V5XSwgYltrZXldKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKHYpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gYmxlbmRWYWx1ZSkge1xuICAgICAgICAgICAgb3V0cHV0W2tleV0gPSBibGVuZFZhbHVlW2tleV0odik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9O1xufVxuZnVuY3Rpb24gbWF0Y2hPcmRlcihvcmlnaW4sIHRhcmdldCkge1xuICAgIGNvbnN0IG9yZGVyZWRPcmlnaW4gPSBbXTtcbiAgICBjb25zdCBwb2ludGVycyA9IHsgY29sb3I6IDAsIHZhcjogMCwgbnVtYmVyOiAwIH07XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXJnZXQudmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSB0YXJnZXQudHlwZXNbaV07XG4gICAgICAgIGNvbnN0IG9yaWdpbkluZGV4ID0gb3JpZ2luLmluZGV4ZXNbdHlwZV1bcG9pbnRlcnNbdHlwZV1dO1xuICAgICAgICBjb25zdCBvcmlnaW5WYWx1ZSA9IG9yaWdpbi52YWx1ZXNbb3JpZ2luSW5kZXhdID8/IDA7XG4gICAgICAgIG9yZGVyZWRPcmlnaW5baV0gPSBvcmlnaW5WYWx1ZTtcbiAgICAgICAgcG9pbnRlcnNbdHlwZV0rKztcbiAgICB9XG4gICAgcmV0dXJuIG9yZGVyZWRPcmlnaW47XG59XG5jb25zdCBtaXhDb21wbGV4ID0gKG9yaWdpbiwgdGFyZ2V0KSA9PiB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSBjb21wbGV4LmNyZWF0ZVRyYW5zZm9ybWVyKHRhcmdldCk7XG4gICAgY29uc3Qgb3JpZ2luU3RhdHMgPSBhbmFseXNlQ29tcGxleFZhbHVlKG9yaWdpbik7XG4gICAgY29uc3QgdGFyZ2V0U3RhdHMgPSBhbmFseXNlQ29tcGxleFZhbHVlKHRhcmdldCk7XG4gICAgY29uc3QgY2FuSW50ZXJwb2xhdGUgPSBvcmlnaW5TdGF0cy5pbmRleGVzLnZhci5sZW5ndGggPT09IHRhcmdldFN0YXRzLmluZGV4ZXMudmFyLmxlbmd0aCAmJlxuICAgICAgICBvcmlnaW5TdGF0cy5pbmRleGVzLmNvbG9yLmxlbmd0aCA9PT0gdGFyZ2V0U3RhdHMuaW5kZXhlcy5jb2xvci5sZW5ndGggJiZcbiAgICAgICAgb3JpZ2luU3RhdHMuaW5kZXhlcy5udW1iZXIubGVuZ3RoID49IHRhcmdldFN0YXRzLmluZGV4ZXMubnVtYmVyLmxlbmd0aDtcbiAgICBpZiAoY2FuSW50ZXJwb2xhdGUpIHtcbiAgICAgICAgaWYgKChpbnZpc2libGVWYWx1ZXMuaGFzKG9yaWdpbikgJiZcbiAgICAgICAgICAgICF0YXJnZXRTdGF0cy52YWx1ZXMubGVuZ3RoKSB8fFxuICAgICAgICAgICAgKGludmlzaWJsZVZhbHVlcy5oYXModGFyZ2V0KSAmJlxuICAgICAgICAgICAgICAgICFvcmlnaW5TdGF0cy52YWx1ZXMubGVuZ3RoKSkge1xuICAgICAgICAgICAgcmV0dXJuIG1peFZpc2liaWxpdHkob3JpZ2luLCB0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwaXBlKG1peEFycmF5KG1hdGNoT3JkZXIob3JpZ2luU3RhdHMsIHRhcmdldFN0YXRzKSwgdGFyZ2V0U3RhdHMudmFsdWVzKSwgdGVtcGxhdGUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgd2FybmluZyh0cnVlLCBgQ29tcGxleCB2YWx1ZXMgJyR7b3JpZ2lufScgYW5kICcke3RhcmdldH0nIHRvbyBkaWZmZXJlbnQgdG8gbWl4LiBFbnN1cmUgYWxsIGNvbG9ycyBhcmUgb2YgdGhlIHNhbWUgdHlwZSwgYW5kIHRoYXQgZWFjaCBjb250YWlucyB0aGUgc2FtZSBxdWFudGl0eSBvZiBudW1iZXIgYW5kIGNvbG9yIHZhbHVlcy4gRmFsbGluZyBiYWNrIHRvIGluc3RhbnQgdHJhbnNpdGlvbi5gLCBcImNvbXBsZXgtdmFsdWVzLWRpZmZlcmVudFwiKTtcbiAgICAgICAgcmV0dXJuIG1peEltbWVkaWF0ZShvcmlnaW4sIHRhcmdldCk7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgZ2V0TWl4ZXIsIG1peEFycmF5LCBtaXhDb21wbGV4LCBtaXhPYmplY3QgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbXBsZXgubWpzLm1hcFxuIiwiaW1wb3J0IHsgZ2V0TWl4ZXIgfSBmcm9tICcuL2NvbXBsZXgubWpzJztcbmltcG9ydCB7IG1peE51bWJlciB9IGZyb20gJy4vbnVtYmVyLm1qcyc7XG5cbmZ1bmN0aW9uIG1peChmcm9tLCB0bywgcCkge1xuICAgIGlmICh0eXBlb2YgZnJvbSA9PT0gXCJudW1iZXJcIiAmJlxuICAgICAgICB0eXBlb2YgdG8gPT09IFwibnVtYmVyXCIgJiZcbiAgICAgICAgdHlwZW9mIHAgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgcmV0dXJuIG1peE51bWJlcihmcm9tLCB0bywgcCk7XG4gICAgfVxuICAgIGNvbnN0IG1peGVyID0gZ2V0TWl4ZXIoZnJvbSk7XG4gICAgcmV0dXJuIG1peGVyKGZyb20sIHRvKTtcbn1cblxuZXhwb3J0IHsgbWl4IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5tanMubWFwXG4iLCJpbXBvcnQgeyB0aW1lIH0gZnJvbSAnLi4vLi4vZnJhbWVsb29wL3N5bmMtdGltZS5tanMnO1xuaW1wb3J0IHsgZnJhbWVEYXRhLCBjYW5jZWxGcmFtZSwgZnJhbWUgfSBmcm9tICcuLi8uLi9mcmFtZWxvb3AvZnJhbWUubWpzJztcblxuY29uc3QgZnJhbWVsb29wRHJpdmVyID0gKHVwZGF0ZSkgPT4ge1xuICAgIGNvbnN0IHBhc3NUaW1lc3RhbXAgPSAoeyB0aW1lc3RhbXAgfSkgPT4gdXBkYXRlKHRpbWVzdGFtcCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IChrZWVwQWxpdmUgPSB0cnVlKSA9PiBmcmFtZS51cGRhdGUocGFzc1RpbWVzdGFtcCwga2VlcEFsaXZlKSxcbiAgICAgICAgc3RvcDogKCkgPT4gY2FuY2VsRnJhbWUocGFzc1RpbWVzdGFtcCksXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiB3ZSdyZSBwcm9jZXNzaW5nIHRoaXMgZnJhbWUgd2UgY2FuIHVzZSB0aGVcbiAgICAgICAgICogZnJhbWVsb2NrZWQgdGltZXN0YW1wIHRvIGtlZXAgdGhpbmdzIGluIHN5bmMuXG4gICAgICAgICAqL1xuICAgICAgICBub3c6ICgpID0+IChmcmFtZURhdGEuaXNQcm9jZXNzaW5nID8gZnJhbWVEYXRhLnRpbWVzdGFtcCA6IHRpbWUubm93KCkpLFxuICAgIH07XG59O1xuXG5leHBvcnQgeyBmcmFtZWxvb3BEcml2ZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZyYW1lLm1qcy5tYXBcbiIsImNvbnN0IGdlbmVyYXRlTGluZWFyRWFzaW5nID0gKGVhc2luZywgZHVyYXRpb24sIC8vIGFzIG1pbGxpc2Vjb25kc1xucmVzb2x1dGlvbiA9IDEwIC8vIGFzIG1pbGxpc2Vjb25kc1xuKSA9PiB7XG4gICAgbGV0IHBvaW50cyA9IFwiXCI7XG4gICAgY29uc3QgbnVtUG9pbnRzID0gTWF0aC5tYXgoTWF0aC5yb3VuZChkdXJhdGlvbiAvIHJlc29sdXRpb24pLCAyKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVBvaW50czsgaSsrKSB7XG4gICAgICAgIHBvaW50cyArPSBNYXRoLnJvdW5kKGVhc2luZyhpIC8gKG51bVBvaW50cyAtIDEpKSAqIDEwMDAwKSAvIDEwMDAwICsgXCIsIFwiO1xuICAgIH1cbiAgICByZXR1cm4gYGxpbmVhcigke3BvaW50cy5zdWJzdHJpbmcoMCwgcG9pbnRzLmxlbmd0aCAtIDIpfSlgO1xufTtcblxuZXhwb3J0IHsgZ2VuZXJhdGVMaW5lYXJFYXNpbmcgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbmVhci5tanMubWFwXG4iLCIvKipcbiAqIEltcGxlbWVudCBhIHByYWN0aWNhbCBtYXggZHVyYXRpb24gZm9yIGtleWZyYW1lIGdlbmVyYXRpb25cbiAqIHRvIHByZXZlbnQgaW5maW5pdGUgbG9vcHNcbiAqL1xuY29uc3QgbWF4R2VuZXJhdG9yRHVyYXRpb24gPSAyMDAwMDtcbmZ1bmN0aW9uIGNhbGNHZW5lcmF0b3JEdXJhdGlvbihnZW5lcmF0b3IpIHtcbiAgICBsZXQgZHVyYXRpb24gPSAwO1xuICAgIGNvbnN0IHRpbWVTdGVwID0gNTA7XG4gICAgbGV0IHN0YXRlID0gZ2VuZXJhdG9yLm5leHQoZHVyYXRpb24pO1xuICAgIHdoaWxlICghc3RhdGUuZG9uZSAmJiBkdXJhdGlvbiA8IG1heEdlbmVyYXRvckR1cmF0aW9uKSB7XG4gICAgICAgIGR1cmF0aW9uICs9IHRpbWVTdGVwO1xuICAgICAgICBzdGF0ZSA9IGdlbmVyYXRvci5uZXh0KGR1cmF0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIGR1cmF0aW9uID49IG1heEdlbmVyYXRvckR1cmF0aW9uID8gSW5maW5pdHkgOiBkdXJhdGlvbjtcbn1cblxuZXhwb3J0IHsgY2FsY0dlbmVyYXRvckR1cmF0aW9uLCBtYXhHZW5lcmF0b3JEdXJhdGlvbiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2FsYy1kdXJhdGlvbi5tanMubWFwXG4iLCJpbXBvcnQgeyBtaWxsaXNlY29uZHNUb1NlY29uZHMgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgY2FsY0dlbmVyYXRvckR1cmF0aW9uLCBtYXhHZW5lcmF0b3JEdXJhdGlvbiB9IGZyb20gJy4vY2FsYy1kdXJhdGlvbi5tanMnO1xuXG4vKipcbiAqIENyZWF0ZSBhIHByb2dyZXNzID0+IHByb2dyZXNzIGVhc2luZyBmdW5jdGlvbiBmcm9tIGEgZ2VuZXJhdG9yLlxuICovXG5mdW5jdGlvbiBjcmVhdGVHZW5lcmF0b3JFYXNpbmcob3B0aW9ucywgc2NhbGUgPSAxMDAsIGNyZWF0ZUdlbmVyYXRvcikge1xuICAgIGNvbnN0IGdlbmVyYXRvciA9IGNyZWF0ZUdlbmVyYXRvcih7IC4uLm9wdGlvbnMsIGtleWZyYW1lczogWzAsIHNjYWxlXSB9KTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IE1hdGgubWluKGNhbGNHZW5lcmF0b3JEdXJhdGlvbihnZW5lcmF0b3IpLCBtYXhHZW5lcmF0b3JEdXJhdGlvbik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogXCJrZXlmcmFtZXNcIixcbiAgICAgICAgZWFzZTogKHByb2dyZXNzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZ2VuZXJhdG9yLm5leHQoZHVyYXRpb24gKiBwcm9ncmVzcykudmFsdWUgLyBzY2FsZTtcbiAgICAgICAgfSxcbiAgICAgICAgZHVyYXRpb246IG1pbGxpc2Vjb25kc1RvU2Vjb25kcyhkdXJhdGlvbiksXG4gICAgfTtcbn1cblxuZXhwb3J0IHsgY3JlYXRlR2VuZXJhdG9yRWFzaW5nIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jcmVhdGUtZ2VuZXJhdG9yLWVhc2luZy5tanMubWFwXG4iLCJpbXBvcnQgeyBtaWxsaXNlY29uZHNUb1NlY29uZHMsIGNsYW1wLCBzZWNvbmRzVG9NaWxsaXNlY29uZHMsIHdhcm5pbmcgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVMaW5lYXJFYXNpbmcgfSBmcm9tICcuLi93YWFwaS91dGlscy9saW5lYXIubWpzJztcbmltcG9ydCB7IGNhbGNHZW5lcmF0b3JEdXJhdGlvbiwgbWF4R2VuZXJhdG9yRHVyYXRpb24gfSBmcm9tICcuL3V0aWxzL2NhbGMtZHVyYXRpb24ubWpzJztcbmltcG9ydCB7IGNyZWF0ZUdlbmVyYXRvckVhc2luZyB9IGZyb20gJy4vdXRpbHMvY3JlYXRlLWdlbmVyYXRvci1lYXNpbmcubWpzJztcblxuY29uc3Qgc3ByaW5nRGVmYXVsdHMgPSB7XG4gICAgLy8gRGVmYXVsdCBzcHJpbmcgcGh5c2ljc1xuICAgIHN0aWZmbmVzczogMTAwLFxuICAgIGRhbXBpbmc6IDEwLFxuICAgIG1hc3M6IDEuMCxcbiAgICB2ZWxvY2l0eTogMC4wLFxuICAgIC8vIERlZmF1bHQgZHVyYXRpb24vYm91bmNlLWJhc2VkIG9wdGlvbnNcbiAgICBkdXJhdGlvbjogODAwLCAvLyBpbiBtc1xuICAgIGJvdW5jZTogMC4zLFxuICAgIHZpc3VhbER1cmF0aW9uOiAwLjMsIC8vIGluIHNlY29uZHNcbiAgICAvLyBSZXN0IHRocmVzaG9sZHNcbiAgICByZXN0U3BlZWQ6IHtcbiAgICAgICAgZ3JhbnVsYXI6IDAuMDEsXG4gICAgICAgIGRlZmF1bHQ6IDIsXG4gICAgfSxcbiAgICByZXN0RGVsdGE6IHtcbiAgICAgICAgZ3JhbnVsYXI6IDAuMDA1LFxuICAgICAgICBkZWZhdWx0OiAwLjUsXG4gICAgfSxcbiAgICAvLyBMaW1pdHNcbiAgICBtaW5EdXJhdGlvbjogMC4wMSwgLy8gaW4gc2Vjb25kc1xuICAgIG1heER1cmF0aW9uOiAxMC4wLCAvLyBpbiBzZWNvbmRzXG4gICAgbWluRGFtcGluZzogMC4wNSxcbiAgICBtYXhEYW1waW5nOiAxLFxufTtcbmZ1bmN0aW9uIGNhbGNBbmd1bGFyRnJlcSh1bmRhbXBlZEZyZXEsIGRhbXBpbmdSYXRpbykge1xuICAgIHJldHVybiB1bmRhbXBlZEZyZXEgKiBNYXRoLnNxcnQoMSAtIGRhbXBpbmdSYXRpbyAqIGRhbXBpbmdSYXRpbyk7XG59XG5jb25zdCByb290SXRlcmF0aW9ucyA9IDEyO1xuZnVuY3Rpb24gYXBwcm94aW1hdGVSb290KGVudmVsb3BlLCBkZXJpdmF0aXZlLCBpbml0aWFsR3Vlc3MpIHtcbiAgICBsZXQgcmVzdWx0ID0gaW5pdGlhbEd1ZXNzO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcm9vdEl0ZXJhdGlvbnM7IGkrKykge1xuICAgICAgICByZXN1bHQgPSByZXN1bHQgLSBlbnZlbG9wZShyZXN1bHQpIC8gZGVyaXZhdGl2ZShyZXN1bHQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiBUaGlzIGlzIHBvcnRlZCBmcm9tIHRoZSBGcmFtZXIgaW1wbGVtZW50YXRpb24gb2YgZHVyYXRpb24tYmFzZWQgc3ByaW5nIHJlc29sdXRpb24uXG4gKi9cbmNvbnN0IHNhZmVNaW4gPSAwLjAwMTtcbmZ1bmN0aW9uIGZpbmRTcHJpbmcoeyBkdXJhdGlvbiA9IHNwcmluZ0RlZmF1bHRzLmR1cmF0aW9uLCBib3VuY2UgPSBzcHJpbmdEZWZhdWx0cy5ib3VuY2UsIHZlbG9jaXR5ID0gc3ByaW5nRGVmYXVsdHMudmVsb2NpdHksIG1hc3MgPSBzcHJpbmdEZWZhdWx0cy5tYXNzLCB9KSB7XG4gICAgbGV0IGVudmVsb3BlO1xuICAgIGxldCBkZXJpdmF0aXZlO1xuICAgIHdhcm5pbmcoZHVyYXRpb24gPD0gc2Vjb25kc1RvTWlsbGlzZWNvbmRzKHNwcmluZ0RlZmF1bHRzLm1heER1cmF0aW9uKSwgXCJTcHJpbmcgZHVyYXRpb24gbXVzdCBiZSAxMCBzZWNvbmRzIG9yIGxlc3NcIiwgXCJzcHJpbmctZHVyYXRpb24tbGltaXRcIik7XG4gICAgbGV0IGRhbXBpbmdSYXRpbyA9IDEgLSBib3VuY2U7XG4gICAgLyoqXG4gICAgICogUmVzdHJpY3QgZGFtcGluZ1JhdGlvIGFuZCBkdXJhdGlvbiB0byB3aXRoaW4gYWNjZXB0YWJsZSByYW5nZXMuXG4gICAgICovXG4gICAgZGFtcGluZ1JhdGlvID0gY2xhbXAoc3ByaW5nRGVmYXVsdHMubWluRGFtcGluZywgc3ByaW5nRGVmYXVsdHMubWF4RGFtcGluZywgZGFtcGluZ1JhdGlvKTtcbiAgICBkdXJhdGlvbiA9IGNsYW1wKHNwcmluZ0RlZmF1bHRzLm1pbkR1cmF0aW9uLCBzcHJpbmdEZWZhdWx0cy5tYXhEdXJhdGlvbiwgbWlsbGlzZWNvbmRzVG9TZWNvbmRzKGR1cmF0aW9uKSk7XG4gICAgaWYgKGRhbXBpbmdSYXRpbyA8IDEpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVuZGVyZGFtcGVkIHNwcmluZ1xuICAgICAgICAgKi9cbiAgICAgICAgZW52ZWxvcGUgPSAodW5kYW1wZWRGcmVxKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBleHBvbmVudGlhbERlY2F5ID0gdW5kYW1wZWRGcmVxICogZGFtcGluZ1JhdGlvO1xuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBleHBvbmVudGlhbERlY2F5ICogZHVyYXRpb247XG4gICAgICAgICAgICBjb25zdCBhID0gZXhwb25lbnRpYWxEZWNheSAtIHZlbG9jaXR5O1xuICAgICAgICAgICAgY29uc3QgYiA9IGNhbGNBbmd1bGFyRnJlcSh1bmRhbXBlZEZyZXEsIGRhbXBpbmdSYXRpbyk7XG4gICAgICAgICAgICBjb25zdCBjID0gTWF0aC5leHAoLWRlbHRhKTtcbiAgICAgICAgICAgIHJldHVybiBzYWZlTWluIC0gKGEgLyBiKSAqIGM7XG4gICAgICAgIH07XG4gICAgICAgIGRlcml2YXRpdmUgPSAodW5kYW1wZWRGcmVxKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBleHBvbmVudGlhbERlY2F5ID0gdW5kYW1wZWRGcmVxICogZGFtcGluZ1JhdGlvO1xuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBleHBvbmVudGlhbERlY2F5ICogZHVyYXRpb247XG4gICAgICAgICAgICBjb25zdCBkID0gZGVsdGEgKiB2ZWxvY2l0eSArIHZlbG9jaXR5O1xuICAgICAgICAgICAgY29uc3QgZSA9IE1hdGgucG93KGRhbXBpbmdSYXRpbywgMikgKiBNYXRoLnBvdyh1bmRhbXBlZEZyZXEsIDIpICogZHVyYXRpb247XG4gICAgICAgICAgICBjb25zdCBmID0gTWF0aC5leHAoLWRlbHRhKTtcbiAgICAgICAgICAgIGNvbnN0IGcgPSBjYWxjQW5ndWxhckZyZXEoTWF0aC5wb3codW5kYW1wZWRGcmVxLCAyKSwgZGFtcGluZ1JhdGlvKTtcbiAgICAgICAgICAgIGNvbnN0IGZhY3RvciA9IC1lbnZlbG9wZSh1bmRhbXBlZEZyZXEpICsgc2FmZU1pbiA+IDAgPyAtMSA6IDE7XG4gICAgICAgICAgICByZXR1cm4gKGZhY3RvciAqICgoZCAtIGUpICogZikpIC8gZztcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcml0aWNhbGx5LWRhbXBlZCBzcHJpbmdcbiAgICAgICAgICovXG4gICAgICAgIGVudmVsb3BlID0gKHVuZGFtcGVkRnJlcSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYSA9IE1hdGguZXhwKC11bmRhbXBlZEZyZXEgKiBkdXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCBiID0gKHVuZGFtcGVkRnJlcSAtIHZlbG9jaXR5KSAqIGR1cmF0aW9uICsgMTtcbiAgICAgICAgICAgIHJldHVybiAtc2FmZU1pbiArIGEgKiBiO1xuICAgICAgICB9O1xuICAgICAgICBkZXJpdmF0aXZlID0gKHVuZGFtcGVkRnJlcSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYSA9IE1hdGguZXhwKC11bmRhbXBlZEZyZXEgKiBkdXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCBiID0gKHZlbG9jaXR5IC0gdW5kYW1wZWRGcmVxKSAqIChkdXJhdGlvbiAqIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiBhICogYjtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgaW5pdGlhbEd1ZXNzID0gNSAvIGR1cmF0aW9uO1xuICAgIGNvbnN0IHVuZGFtcGVkRnJlcSA9IGFwcHJveGltYXRlUm9vdChlbnZlbG9wZSwgZGVyaXZhdGl2ZSwgaW5pdGlhbEd1ZXNzKTtcbiAgICBkdXJhdGlvbiA9IHNlY29uZHNUb01pbGxpc2Vjb25kcyhkdXJhdGlvbik7XG4gICAgaWYgKGlzTmFOKHVuZGFtcGVkRnJlcSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0aWZmbmVzczogc3ByaW5nRGVmYXVsdHMuc3RpZmZuZXNzLFxuICAgICAgICAgICAgZGFtcGluZzogc3ByaW5nRGVmYXVsdHMuZGFtcGluZyxcbiAgICAgICAgICAgIGR1cmF0aW9uLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3RpZmZuZXNzID0gTWF0aC5wb3codW5kYW1wZWRGcmVxLCAyKSAqIG1hc3M7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGlmZm5lc3MsXG4gICAgICAgICAgICBkYW1waW5nOiBkYW1waW5nUmF0aW8gKiAyICogTWF0aC5zcXJ0KG1hc3MgKiBzdGlmZm5lc3MpLFxuICAgICAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIH07XG4gICAgfVxufVxuY29uc3QgZHVyYXRpb25LZXlzID0gW1wiZHVyYXRpb25cIiwgXCJib3VuY2VcIl07XG5jb25zdCBwaHlzaWNzS2V5cyA9IFtcInN0aWZmbmVzc1wiLCBcImRhbXBpbmdcIiwgXCJtYXNzXCJdO1xuZnVuY3Rpb24gaXNTcHJpbmdUeXBlKG9wdGlvbnMsIGtleXMpIHtcbiAgICByZXR1cm4ga2V5cy5zb21lKChrZXkpID0+IG9wdGlvbnNba2V5XSAhPT0gdW5kZWZpbmVkKTtcbn1cbmZ1bmN0aW9uIGdldFNwcmluZ09wdGlvbnMob3B0aW9ucykge1xuICAgIGxldCBzcHJpbmdPcHRpb25zID0ge1xuICAgICAgICB2ZWxvY2l0eTogc3ByaW5nRGVmYXVsdHMudmVsb2NpdHksXG4gICAgICAgIHN0aWZmbmVzczogc3ByaW5nRGVmYXVsdHMuc3RpZmZuZXNzLFxuICAgICAgICBkYW1waW5nOiBzcHJpbmdEZWZhdWx0cy5kYW1waW5nLFxuICAgICAgICBtYXNzOiBzcHJpbmdEZWZhdWx0cy5tYXNzLFxuICAgICAgICBpc1Jlc29sdmVkRnJvbUR1cmF0aW9uOiBmYWxzZSxcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICB9O1xuICAgIC8vIHN0aWZmbmVzcy9kYW1waW5nL21hc3Mgb3ZlcnJpZGVzIGR1cmF0aW9uL2JvdW5jZVxuICAgIGlmICghaXNTcHJpbmdUeXBlKG9wdGlvbnMsIHBoeXNpY3NLZXlzKSAmJlxuICAgICAgICBpc1NwcmluZ1R5cGUob3B0aW9ucywgZHVyYXRpb25LZXlzKSkge1xuICAgICAgICAvLyBUaW1lLWRlZmluZWQgc3ByaW5ncyBzaG91bGQgaWdub3JlIGluaGVyaXRlZCB2ZWxvY2l0eS5cbiAgICAgICAgLy8gVmVsb2NpdHkgZnJvbSBpbnRlcnJ1cHRlZCBhbmltYXRpb25zIGNhbiBjYXVzZSBmaW5kU3ByaW5nKClcbiAgICAgICAgLy8gdG8gY29tcHV0ZSB3aWxkbHkgZGlmZmVyZW50IHNwcmluZyBwYXJhbWV0ZXJzLCBsZWFkaW5nIHRvXG4gICAgICAgIC8vIG1hc3NpdmUgb3NjaWxsYXRpb24gb24gc21hbGwtcmFuZ2UgYW5pbWF0aW9ucy5cbiAgICAgICAgc3ByaW5nT3B0aW9ucy52ZWxvY2l0eSA9IDA7XG4gICAgICAgIGlmIChvcHRpb25zLnZpc3VhbER1cmF0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCB2aXN1YWxEdXJhdGlvbiA9IG9wdGlvbnMudmlzdWFsRHVyYXRpb247XG4gICAgICAgICAgICBjb25zdCByb290ID0gKDIgKiBNYXRoLlBJKSAvICh2aXN1YWxEdXJhdGlvbiAqIDEuMik7XG4gICAgICAgICAgICBjb25zdCBzdGlmZm5lc3MgPSByb290ICogcm9vdDtcbiAgICAgICAgICAgIGNvbnN0IGRhbXBpbmcgPSAyICpcbiAgICAgICAgICAgICAgICBjbGFtcCgwLjA1LCAxLCAxIC0gKG9wdGlvbnMuYm91bmNlIHx8IDApKSAqXG4gICAgICAgICAgICAgICAgTWF0aC5zcXJ0KHN0aWZmbmVzcyk7XG4gICAgICAgICAgICBzcHJpbmdPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIC4uLnNwcmluZ09wdGlvbnMsXG4gICAgICAgICAgICAgICAgbWFzczogc3ByaW5nRGVmYXVsdHMubWFzcyxcbiAgICAgICAgICAgICAgICBzdGlmZm5lc3MsXG4gICAgICAgICAgICAgICAgZGFtcGluZyxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBkZXJpdmVkID0gZmluZFNwcmluZyh7IC4uLm9wdGlvbnMsIHZlbG9jaXR5OiAwIH0pO1xuICAgICAgICAgICAgc3ByaW5nT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAuLi5zcHJpbmdPcHRpb25zLFxuICAgICAgICAgICAgICAgIC4uLmRlcml2ZWQsXG4gICAgICAgICAgICAgICAgbWFzczogc3ByaW5nRGVmYXVsdHMubWFzcyxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzcHJpbmdPcHRpb25zLmlzUmVzb2x2ZWRGcm9tRHVyYXRpb24gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzcHJpbmdPcHRpb25zO1xufVxuZnVuY3Rpb24gc3ByaW5nKG9wdGlvbnNPclZpc3VhbER1cmF0aW9uID0gc3ByaW5nRGVmYXVsdHMudmlzdWFsRHVyYXRpb24sIGJvdW5jZSA9IHNwcmluZ0RlZmF1bHRzLmJvdW5jZSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uc09yVmlzdWFsRHVyYXRpb24gIT09IFwib2JqZWN0XCJcbiAgICAgICAgPyB7XG4gICAgICAgICAgICB2aXN1YWxEdXJhdGlvbjogb3B0aW9uc09yVmlzdWFsRHVyYXRpb24sXG4gICAgICAgICAgICBrZXlmcmFtZXM6IFswLCAxXSxcbiAgICAgICAgICAgIGJvdW5jZSxcbiAgICAgICAgfVxuICAgICAgICA6IG9wdGlvbnNPclZpc3VhbER1cmF0aW9uO1xuICAgIGxldCB7IHJlc3RTcGVlZCwgcmVzdERlbHRhIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IG9yaWdpbiA9IG9wdGlvbnMua2V5ZnJhbWVzWzBdO1xuICAgIGNvbnN0IHRhcmdldCA9IG9wdGlvbnMua2V5ZnJhbWVzW29wdGlvbnMua2V5ZnJhbWVzLmxlbmd0aCAtIDFdO1xuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgdGhlIEl0ZXJhdG9yLXNwZWMgcmV0dXJuIHZhbHVlLiBXZSBlbnN1cmUgaXQncyBtdXRhYmxlIHJhdGhlciB0aGFuIHVzaW5nIGEgZ2VuZXJhdG9yXG4gICAgICogdG8gcmVkdWNlIEdDIGR1cmluZyBhbmltYXRpb24uXG4gICAgICovXG4gICAgY29uc3Qgc3RhdGUgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogb3JpZ2luIH07XG4gICAgY29uc3QgeyBzdGlmZm5lc3MsIGRhbXBpbmcsIG1hc3MsIGR1cmF0aW9uLCB2ZWxvY2l0eSwgaXNSZXNvbHZlZEZyb21EdXJhdGlvbiwgfSA9IGdldFNwcmluZ09wdGlvbnMoe1xuICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICB2ZWxvY2l0eTogLW1pbGxpc2Vjb25kc1RvU2Vjb25kcyhvcHRpb25zLnZlbG9jaXR5IHx8IDApLFxuICAgIH0pO1xuICAgIGNvbnN0IGluaXRpYWxWZWxvY2l0eSA9IHZlbG9jaXR5IHx8IDAuMDtcbiAgICBjb25zdCBkYW1waW5nUmF0aW8gPSBkYW1waW5nIC8gKDIgKiBNYXRoLnNxcnQoc3RpZmZuZXNzICogbWFzcykpO1xuICAgIGNvbnN0IGluaXRpYWxEZWx0YSA9IHRhcmdldCAtIG9yaWdpbjtcbiAgICBjb25zdCB1bmRhbXBlZEFuZ3VsYXJGcmVxID0gbWlsbGlzZWNvbmRzVG9TZWNvbmRzKE1hdGguc3FydChzdGlmZm5lc3MgLyBtYXNzKSk7XG4gICAgLyoqXG4gICAgICogSWYgd2UncmUgd29ya2luZyBvbiBhIGdyYW51bGFyIHNjYWxlLCB1c2Ugc21hbGxlciBkZWZhdWx0cyBmb3IgZGV0ZXJtaW5pbmdcbiAgICAgKiB3aGVuIHRoZSBzcHJpbmcgaXMgZmluaXNoZWQuXG4gICAgICpcbiAgICAgKiBUaGVzZSBkZWZhdWx0cyBoYXZlIGJlZW4gc2VsZWN0ZWQgZW1wcmljYWxseSBiYXNlZCBvbiB3aGF0IHN0cmlrZXMgYSBnb29kXG4gICAgICogcmF0aW8gYmV0d2VlbiBmZWVsaW5nIGdvb2QgYW5kIGZpbmlzaGluZyBhcyBzb29uIGFzIGNoYW5nZXMgYXJlIGltcGVyY2VwdGlibGUuXG4gICAgICovXG4gICAgY29uc3QgaXNHcmFudWxhclNjYWxlID0gTWF0aC5hYnMoaW5pdGlhbERlbHRhKSA8IDU7XG4gICAgcmVzdFNwZWVkIHx8IChyZXN0U3BlZWQgPSBpc0dyYW51bGFyU2NhbGVcbiAgICAgICAgPyBzcHJpbmdEZWZhdWx0cy5yZXN0U3BlZWQuZ3JhbnVsYXJcbiAgICAgICAgOiBzcHJpbmdEZWZhdWx0cy5yZXN0U3BlZWQuZGVmYXVsdCk7XG4gICAgcmVzdERlbHRhIHx8IChyZXN0RGVsdGEgPSBpc0dyYW51bGFyU2NhbGVcbiAgICAgICAgPyBzcHJpbmdEZWZhdWx0cy5yZXN0RGVsdGEuZ3JhbnVsYXJcbiAgICAgICAgOiBzcHJpbmdEZWZhdWx0cy5yZXN0RGVsdGEuZGVmYXVsdCk7XG4gICAgbGV0IHJlc29sdmVTcHJpbmc7XG4gICAgbGV0IHJlc29sdmVWZWxvY2l0eTtcbiAgICAvLyBVbmRlcmRhbXBlZCBjb2VmZmljaWVudHMsIGhvaXN0ZWQgZm9yIHVzZSBpbiB0aGUgaW5saW5lZCBuZXh0KCkgaG90IHBhdGhcbiAgICBsZXQgYW5ndWxhckZyZXE7XG4gICAgbGV0IEE7XG4gICAgbGV0IHNpbkNvZWZmO1xuICAgIGxldCBjb3NDb2VmZjtcbiAgICBpZiAoZGFtcGluZ1JhdGlvIDwgMSkge1xuICAgICAgICBhbmd1bGFyRnJlcSA9IGNhbGNBbmd1bGFyRnJlcSh1bmRhbXBlZEFuZ3VsYXJGcmVxLCBkYW1waW5nUmF0aW8pO1xuICAgICAgICBBID1cbiAgICAgICAgICAgIChpbml0aWFsVmVsb2NpdHkgK1xuICAgICAgICAgICAgICAgIGRhbXBpbmdSYXRpbyAqIHVuZGFtcGVkQW5ndWxhckZyZXEgKiBpbml0aWFsRGVsdGEpIC9cbiAgICAgICAgICAgICAgICBhbmd1bGFyRnJlcTtcbiAgICAgICAgLy8gVW5kZXJkYW1wZWQgc3ByaW5nXG4gICAgICAgIHJlc29sdmVTcHJpbmcgPSAodCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZW52ZWxvcGUgPSBNYXRoLmV4cCgtZGFtcGluZ1JhdGlvICogdW5kYW1wZWRBbmd1bGFyRnJlcSAqIHQpO1xuICAgICAgICAgICAgcmV0dXJuICh0YXJnZXQgLVxuICAgICAgICAgICAgICAgIGVudmVsb3BlICpcbiAgICAgICAgICAgICAgICAgICAgKEEgKiBNYXRoLnNpbihhbmd1bGFyRnJlcSAqIHQpICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxEZWx0YSAqIE1hdGguY29zKGFuZ3VsYXJGcmVxICogdCkpKTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gQW5hbHl0aWNhbCBkZXJpdmF0aXZlIG9mIHVuZGVyZGFtcGVkIHNwcmluZyAocHgvbXMpXG4gICAgICAgIHNpbkNvZWZmID1cbiAgICAgICAgICAgIGRhbXBpbmdSYXRpbyAqIHVuZGFtcGVkQW5ndWxhckZyZXEgKiBBICsgaW5pdGlhbERlbHRhICogYW5ndWxhckZyZXE7XG4gICAgICAgIGNvc0NvZWZmID1cbiAgICAgICAgICAgIGRhbXBpbmdSYXRpbyAqIHVuZGFtcGVkQW5ndWxhckZyZXEgKiBpbml0aWFsRGVsdGEgLSBBICogYW5ndWxhckZyZXE7XG4gICAgICAgIHJlc29sdmVWZWxvY2l0eSA9ICh0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbnZlbG9wZSA9IE1hdGguZXhwKC1kYW1waW5nUmF0aW8gKiB1bmRhbXBlZEFuZ3VsYXJGcmVxICogdCk7XG4gICAgICAgICAgICByZXR1cm4gZW52ZWxvcGUgKlxuICAgICAgICAgICAgICAgIChzaW5Db2VmZiAqIE1hdGguc2luKGFuZ3VsYXJGcmVxICogdCkgK1xuICAgICAgICAgICAgICAgICAgICBjb3NDb2VmZiAqIE1hdGguY29zKGFuZ3VsYXJGcmVxICogdCkpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIGlmIChkYW1waW5nUmF0aW8gPT09IDEpIHtcbiAgICAgICAgLy8gQ3JpdGljYWxseSBkYW1wZWQgc3ByaW5nXG4gICAgICAgIHJlc29sdmVTcHJpbmcgPSAodCkgPT4gdGFyZ2V0IC1cbiAgICAgICAgICAgIE1hdGguZXhwKC11bmRhbXBlZEFuZ3VsYXJGcmVxICogdCkgKlxuICAgICAgICAgICAgICAgIChpbml0aWFsRGVsdGEgK1xuICAgICAgICAgICAgICAgICAgICAoaW5pdGlhbFZlbG9jaXR5ICsgdW5kYW1wZWRBbmd1bGFyRnJlcSAqIGluaXRpYWxEZWx0YSkgKiB0KTtcbiAgICAgICAgLy8gQW5hbHl0aWNhbCBkZXJpdmF0aXZlIG9mIGNyaXRpY2FsbHkgZGFtcGVkIHNwcmluZyAocHgvbXMpXG4gICAgICAgIGNvbnN0IEMgPSBpbml0aWFsVmVsb2NpdHkgKyB1bmRhbXBlZEFuZ3VsYXJGcmVxICogaW5pdGlhbERlbHRhO1xuICAgICAgICByZXNvbHZlVmVsb2NpdHkgPSAodCkgPT4gTWF0aC5leHAoLXVuZGFtcGVkQW5ndWxhckZyZXEgKiB0KSAqXG4gICAgICAgICAgICAodW5kYW1wZWRBbmd1bGFyRnJlcSAqIEMgKiB0IC0gaW5pdGlhbFZlbG9jaXR5KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIE92ZXJkYW1wZWQgc3ByaW5nXG4gICAgICAgIGNvbnN0IGRhbXBlZEFuZ3VsYXJGcmVxID0gdW5kYW1wZWRBbmd1bGFyRnJlcSAqIE1hdGguc3FydChkYW1waW5nUmF0aW8gKiBkYW1waW5nUmF0aW8gLSAxKTtcbiAgICAgICAgcmVzb2x2ZVNwcmluZyA9ICh0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbnZlbG9wZSA9IE1hdGguZXhwKC1kYW1waW5nUmF0aW8gKiB1bmRhbXBlZEFuZ3VsYXJGcmVxICogdCk7XG4gICAgICAgICAgICAvLyBXaGVuIHBlcmZvcm1pbmcgc2luaCBvciBjb3NoIHZhbHVlcyBjYW4gaGl0IEluZmluaXR5IHNvIHdlIGNhcCB0aGVtIGhlcmVcbiAgICAgICAgICAgIGNvbnN0IGZyZXFGb3JUID0gTWF0aC5taW4oZGFtcGVkQW5ndWxhckZyZXEgKiB0LCAzMDApO1xuICAgICAgICAgICAgcmV0dXJuICh0YXJnZXQgLVxuICAgICAgICAgICAgICAgIChlbnZlbG9wZSAqXG4gICAgICAgICAgICAgICAgICAgICgoaW5pdGlhbFZlbG9jaXR5ICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhbXBpbmdSYXRpbyAqIHVuZGFtcGVkQW5ndWxhckZyZXEgKiBpbml0aWFsRGVsdGEpICpcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguc2luaChmcmVxRm9yVCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgZGFtcGVkQW5ndWxhckZyZXEgKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxEZWx0YSAqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5jb3NoKGZyZXFGb3JUKSkpIC9cbiAgICAgICAgICAgICAgICAgICAgZGFtcGVkQW5ndWxhckZyZXEpO1xuICAgICAgICB9O1xuICAgICAgICAvLyBBbmFseXRpY2FsIGRlcml2YXRpdmUgb2Ygb3ZlcmRhbXBlZCBzcHJpbmcgKHB4L21zKVxuICAgICAgICBjb25zdCBQID0gKGluaXRpYWxWZWxvY2l0eSArXG4gICAgICAgICAgICBkYW1waW5nUmF0aW8gKiB1bmRhbXBlZEFuZ3VsYXJGcmVxICogaW5pdGlhbERlbHRhKSAvXG4gICAgICAgICAgICBkYW1wZWRBbmd1bGFyRnJlcTtcbiAgICAgICAgY29uc3Qgc2luaENvZWZmID0gZGFtcGluZ1JhdGlvICogdW5kYW1wZWRBbmd1bGFyRnJlcSAqIFAgLSBpbml0aWFsRGVsdGEgKiBkYW1wZWRBbmd1bGFyRnJlcTtcbiAgICAgICAgY29uc3QgY29zaENvZWZmID0gZGFtcGluZ1JhdGlvICogdW5kYW1wZWRBbmd1bGFyRnJlcSAqIGluaXRpYWxEZWx0YSAtIFAgKiBkYW1wZWRBbmd1bGFyRnJlcTtcbiAgICAgICAgcmVzb2x2ZVZlbG9jaXR5ID0gKHQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudmVsb3BlID0gTWF0aC5leHAoLWRhbXBpbmdSYXRpbyAqIHVuZGFtcGVkQW5ndWxhckZyZXEgKiB0KTtcbiAgICAgICAgICAgIGNvbnN0IGZyZXFGb3JUID0gTWF0aC5taW4oZGFtcGVkQW5ndWxhckZyZXEgKiB0LCAzMDApO1xuICAgICAgICAgICAgcmV0dXJuIGVudmVsb3BlICpcbiAgICAgICAgICAgICAgICAoc2luaENvZWZmICogTWF0aC5zaW5oKGZyZXFGb3JUKSArXG4gICAgICAgICAgICAgICAgICAgIGNvc2hDb2VmZiAqIE1hdGguY29zaChmcmVxRm9yVCkpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBjb25zdCBnZW5lcmF0b3IgPSB7XG4gICAgICAgIGNhbGN1bGF0ZWREdXJhdGlvbjogaXNSZXNvbHZlZEZyb21EdXJhdGlvbiA/IGR1cmF0aW9uIHx8IG51bGwgOiBudWxsLFxuICAgICAgICB2ZWxvY2l0eTogKHQpID0+IHNlY29uZHNUb01pbGxpc2Vjb25kcyhyZXNvbHZlVmVsb2NpdHkodCkpLFxuICAgICAgICBuZXh0OiAodCkgPT4ge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGb3IgdW5kZXJkYW1wZWQgcGh5c2ljcyBzcHJpbmdzIHdlIG5lZWQgYm90aCBwb3NpdGlvbiBhbmRcbiAgICAgICAgICAgICAqIHZlbG9jaXR5IGVhY2ggdGljay4gQ29tcHV0ZSBzaGFyZWQgdHJpZyB2YWx1ZXMgb25jZSB0byBhdm9pZFxuICAgICAgICAgICAgICogZHVwbGljYXRlIE1hdGguZXhwL3Npbi9jb3MgY2FsbHMgb24gdGhlIGhvdCBwYXRoLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoIWlzUmVzb2x2ZWRGcm9tRHVyYXRpb24gJiYgZGFtcGluZ1JhdGlvIDwgMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVudmVsb3BlID0gTWF0aC5leHAoLWRhbXBpbmdSYXRpbyAqIHVuZGFtcGVkQW5ndWxhckZyZXEgKiB0KTtcbiAgICAgICAgICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihhbmd1bGFyRnJlcSAqIHQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKGFuZ3VsYXJGcmVxICogdCk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudCA9IHRhcmdldCAtXG4gICAgICAgICAgICAgICAgICAgIGVudmVsb3BlICpcbiAgICAgICAgICAgICAgICAgICAgICAgIChBICogc2luICsgaW5pdGlhbERlbHRhICogY29zKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VmVsb2NpdHkgPSBzZWNvbmRzVG9NaWxsaXNlY29uZHMoZW52ZWxvcGUgKlxuICAgICAgICAgICAgICAgICAgICAoc2luQ29lZmYgKiBzaW4gKyBjb3NDb2VmZiAqIGNvcykpO1xuICAgICAgICAgICAgICAgIHN0YXRlLmRvbmUgPVxuICAgICAgICAgICAgICAgICAgICBNYXRoLmFicyhjdXJyZW50VmVsb2NpdHkpIDw9IHJlc3RTcGVlZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5hYnModGFyZ2V0IC0gY3VycmVudCkgPD0gcmVzdERlbHRhO1xuICAgICAgICAgICAgICAgIHN0YXRlLnZhbHVlID0gc3RhdGUuZG9uZSA/IHRhcmdldCA6IGN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY3VycmVudCA9IHJlc29sdmVTcHJpbmcodCk7XG4gICAgICAgICAgICBpZiAoIWlzUmVzb2x2ZWRGcm9tRHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VmVsb2NpdHkgPSBzZWNvbmRzVG9NaWxsaXNlY29uZHMocmVzb2x2ZVZlbG9jaXR5KHQpKTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5kb25lID1cbiAgICAgICAgICAgICAgICAgICAgTWF0aC5hYnMoY3VycmVudFZlbG9jaXR5KSA8PSByZXN0U3BlZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguYWJzKHRhcmdldCAtIGN1cnJlbnQpIDw9IHJlc3REZWx0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlLmRvbmUgPSB0ID49IGR1cmF0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhdGUudmFsdWUgPSBzdGF0ZS5kb25lID8gdGFyZ2V0IDogY3VycmVudDtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfSxcbiAgICAgICAgdG9TdHJpbmc6ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGN1bGF0ZWREdXJhdGlvbiA9IE1hdGgubWluKGNhbGNHZW5lcmF0b3JEdXJhdGlvbihnZW5lcmF0b3IpLCBtYXhHZW5lcmF0b3JEdXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCBlYXNpbmcgPSBnZW5lcmF0ZUxpbmVhckVhc2luZygocHJvZ3Jlc3MpID0+IGdlbmVyYXRvci5uZXh0KGNhbGN1bGF0ZWREdXJhdGlvbiAqIHByb2dyZXNzKS52YWx1ZSwgY2FsY3VsYXRlZER1cmF0aW9uLCAzMCk7XG4gICAgICAgICAgICByZXR1cm4gY2FsY3VsYXRlZER1cmF0aW9uICsgXCJtcyBcIiArIGVhc2luZztcbiAgICAgICAgfSxcbiAgICAgICAgdG9UcmFuc2l0aW9uOiAoKSA9PiB7IH0sXG4gICAgfTtcbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xufVxuc3ByaW5nLmFwcGx5VG9PcHRpb25zID0gKG9wdGlvbnMpID0+IHtcbiAgICBjb25zdCBnZW5lcmF0b3JPcHRpb25zID0gY3JlYXRlR2VuZXJhdG9yRWFzaW5nKG9wdGlvbnMsIDEwMCwgc3ByaW5nKTtcbiAgICBvcHRpb25zLmVhc2UgPSBnZW5lcmF0b3JPcHRpb25zLmVhc2U7XG4gICAgb3B0aW9ucy5kdXJhdGlvbiA9IHNlY29uZHNUb01pbGxpc2Vjb25kcyhnZW5lcmF0b3JPcHRpb25zLmR1cmF0aW9uKTtcbiAgICBvcHRpb25zLnR5cGUgPSBcImtleWZyYW1lc1wiO1xuICAgIHJldHVybiBvcHRpb25zO1xufTtcblxuZXhwb3J0IHsgc3ByaW5nIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zcHJpbmcubWpzLm1hcFxuIiwiaW1wb3J0IHsgdmVsb2NpdHlQZXJTZWNvbmQgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuXG5jb25zdCB2ZWxvY2l0eVNhbXBsZUR1cmF0aW9uID0gNTsgLy8gbXNcbmZ1bmN0aW9uIGdldEdlbmVyYXRvclZlbG9jaXR5KHJlc29sdmVWYWx1ZSwgdCwgY3VycmVudCkge1xuICAgIGNvbnN0IHByZXZUID0gTWF0aC5tYXgodCAtIHZlbG9jaXR5U2FtcGxlRHVyYXRpb24sIDApO1xuICAgIHJldHVybiB2ZWxvY2l0eVBlclNlY29uZChjdXJyZW50IC0gcmVzb2x2ZVZhbHVlKHByZXZUKSwgdCAtIHByZXZUKTtcbn1cblxuZXhwb3J0IHsgZ2V0R2VuZXJhdG9yVmVsb2NpdHkgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXZlbG9jaXR5Lm1qcy5tYXBcbiIsImltcG9ydCB7IHNwcmluZyB9IGZyb20gJy4vc3ByaW5nLm1qcyc7XG5pbXBvcnQgeyBnZXRHZW5lcmF0b3JWZWxvY2l0eSB9IGZyb20gJy4vdXRpbHMvdmVsb2NpdHkubWpzJztcblxuZnVuY3Rpb24gaW5lcnRpYSh7IGtleWZyYW1lcywgdmVsb2NpdHkgPSAwLjAsIHBvd2VyID0gMC44LCB0aW1lQ29uc3RhbnQgPSAzMjUsIGJvdW5jZURhbXBpbmcgPSAxMCwgYm91bmNlU3RpZmZuZXNzID0gNTAwLCBtb2RpZnlUYXJnZXQsIG1pbiwgbWF4LCByZXN0RGVsdGEgPSAwLjUsIHJlc3RTcGVlZCwgfSkge1xuICAgIGNvbnN0IG9yaWdpbiA9IGtleWZyYW1lc1swXTtcbiAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBvcmlnaW4sXG4gICAgfTtcbiAgICBjb25zdCBpc091dE9mQm91bmRzID0gKHYpID0+IChtaW4gIT09IHVuZGVmaW5lZCAmJiB2IDwgbWluKSB8fCAobWF4ICE9PSB1bmRlZmluZWQgJiYgdiA+IG1heCk7XG4gICAgY29uc3QgbmVhcmVzdEJvdW5kYXJ5ID0gKHYpID0+IHtcbiAgICAgICAgaWYgKG1pbiA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIG1heDtcbiAgICAgICAgaWYgKG1heCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIG1pbjtcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKG1pbiAtIHYpIDwgTWF0aC5hYnMobWF4IC0gdikgPyBtaW4gOiBtYXg7XG4gICAgfTtcbiAgICBsZXQgYW1wbGl0dWRlID0gcG93ZXIgKiB2ZWxvY2l0eTtcbiAgICBjb25zdCBpZGVhbCA9IG9yaWdpbiArIGFtcGxpdHVkZTtcbiAgICBjb25zdCB0YXJnZXQgPSBtb2RpZnlUYXJnZXQgPT09IHVuZGVmaW5lZCA/IGlkZWFsIDogbW9kaWZ5VGFyZ2V0KGlkZWFsKTtcbiAgICAvKipcbiAgICAgKiBJZiB0aGUgdGFyZ2V0IGhhcyBjaGFuZ2VkIHdlIG5lZWQgdG8gcmUtY2FsY3VsYXRlIHRoZSBhbXBsaXR1ZGUsIG90aGVyd2lzZVxuICAgICAqIHRoZSBhbmltYXRpb24gd2lsbCBzdGFydCBmcm9tIHRoZSB3cm9uZyBwb3NpdGlvbi5cbiAgICAgKi9cbiAgICBpZiAodGFyZ2V0ICE9PSBpZGVhbClcbiAgICAgICAgYW1wbGl0dWRlID0gdGFyZ2V0IC0gb3JpZ2luO1xuICAgIGNvbnN0IGNhbGNEZWx0YSA9ICh0KSA9PiAtYW1wbGl0dWRlICogTWF0aC5leHAoLXQgLyB0aW1lQ29uc3RhbnQpO1xuICAgIGNvbnN0IGNhbGNMYXRlc3QgPSAodCkgPT4gdGFyZ2V0ICsgY2FsY0RlbHRhKHQpO1xuICAgIGNvbnN0IGFwcGx5RnJpY3Rpb24gPSAodCkgPT4ge1xuICAgICAgICBjb25zdCBkZWx0YSA9IGNhbGNEZWx0YSh0KTtcbiAgICAgICAgY29uc3QgbGF0ZXN0ID0gY2FsY0xhdGVzdCh0KTtcbiAgICAgICAgc3RhdGUuZG9uZSA9IE1hdGguYWJzKGRlbHRhKSA8PSByZXN0RGVsdGE7XG4gICAgICAgIHN0YXRlLnZhbHVlID0gc3RhdGUuZG9uZSA/IHRhcmdldCA6IGxhdGVzdDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIElkZWFsbHkgdGhpcyB3b3VsZCByZXNvbHZlIGZvciB0IGluIGEgc3RhdGVsZXNzIHdheSwgd2UgY291bGRcbiAgICAgKiBkbyB0aGF0IGJ5IGFsd2F5cyBwcmVjYWxjdWxhdGluZyB0aGUgYW5pbWF0aW9uIGJ1dCBhcyB3ZSBrbm93XG4gICAgICogdGhpcyB3aWxsIGJlIGRvbmUgYW55d2F5IHdlIGNhbiBhc3N1bWUgdGhhdCBzcHJpbmcgd2lsbFxuICAgICAqIGJlIGRpc2NvdmVyZWQgZHVyaW5nIHRoYXQuXG4gICAgICovXG4gICAgbGV0IHRpbWVSZWFjaGVkQm91bmRhcnk7XG4gICAgbGV0IHNwcmluZyQxO1xuICAgIGNvbnN0IGNoZWNrQ2F0Y2hCb3VuZGFyeSA9ICh0KSA9PiB7XG4gICAgICAgIGlmICghaXNPdXRPZkJvdW5kcyhzdGF0ZS52YWx1ZSkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRpbWVSZWFjaGVkQm91bmRhcnkgPSB0O1xuICAgICAgICBzcHJpbmckMSA9IHNwcmluZyh7XG4gICAgICAgICAgICBrZXlmcmFtZXM6IFtzdGF0ZS52YWx1ZSwgbmVhcmVzdEJvdW5kYXJ5KHN0YXRlLnZhbHVlKV0sXG4gICAgICAgICAgICB2ZWxvY2l0eTogZ2V0R2VuZXJhdG9yVmVsb2NpdHkoY2FsY0xhdGVzdCwgdCwgc3RhdGUudmFsdWUpLCAvLyBUT0RPOiBUaGlzIHNob3VsZCBiZSBwYXNzaW5nICogMTAwMFxuICAgICAgICAgICAgZGFtcGluZzogYm91bmNlRGFtcGluZyxcbiAgICAgICAgICAgIHN0aWZmbmVzczogYm91bmNlU3RpZmZuZXNzLFxuICAgICAgICAgICAgcmVzdERlbHRhLFxuICAgICAgICAgICAgcmVzdFNwZWVkLFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGNoZWNrQ2F0Y2hCb3VuZGFyeSgwKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBjYWxjdWxhdGVkRHVyYXRpb246IG51bGwsXG4gICAgICAgIG5leHQ6ICh0KSA9PiB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFdlIG5lZWQgdG8gcmVzb2x2ZSB0aGUgZnJpY3Rpb24gdG8gZmlndXJlIG91dCBpZiB3ZSBuZWVkIGFcbiAgICAgICAgICAgICAqIHNwcmluZyBidXQgd2UgZG9uJ3Qgd2FudCB0byBkbyB0aGlzIHR3aWNlIHBlciBmcmFtZS4gU28gaGVyZVxuICAgICAgICAgICAgICogd2UgZmxhZyBpZiB3ZSB1cGRhdGVkIGZvciB0aGlzIGZyYW1lIGFuZCBsYXRlciBpZiB3ZSBkaWRcbiAgICAgICAgICAgICAqIHdlIGNhbiBza2lwIGRvaW5nIGl0IGFnYWluLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgaGFzVXBkYXRlZEZyYW1lID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoIXNwcmluZyQxICYmIHRpbWVSZWFjaGVkQm91bmRhcnkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGhhc1VwZGF0ZWRGcmFtZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYXBwbHlGcmljdGlvbih0KTtcbiAgICAgICAgICAgICAgICBjaGVja0NhdGNoQm91bmRhcnkodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHdlIGhhdmUgYSBzcHJpbmcgYW5kIHRoZSBwcm92aWRlZCB0IGlzIGJleW9uZCB0aGUgbW9tZW50IHRoZSBmcmljdGlvblxuICAgICAgICAgICAgICogYW5pbWF0aW9uIGNyb3NzZWQgdGhlIG1pbi9tYXggYm91bmRhcnksIHVzZSB0aGUgc3ByaW5nLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAodGltZVJlYWNoZWRCb3VuZGFyeSAhPT0gdW5kZWZpbmVkICYmIHQgPj0gdGltZVJlYWNoZWRCb3VuZGFyeSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzcHJpbmckMS5uZXh0KHQgLSB0aW1lUmVhY2hlZEJvdW5kYXJ5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICFoYXNVcGRhdGVkRnJhbWUgJiYgYXBwbHlGcmljdGlvbih0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfTtcbn1cblxuZXhwb3J0IHsgaW5lcnRpYSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5lcnRpYS5tanMubWFwXG4iLCJpbXBvcnQgeyBpbnZhcmlhbnQsIGNsYW1wLCBNb3Rpb25HbG9iYWxDb25maWcsIG5vb3AsIHBpcGUsIHByb2dyZXNzIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcbmltcG9ydCB7IG1peCB9IGZyb20gJy4vbWl4L2luZGV4Lm1qcyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZU1peGVycyhvdXRwdXQsIGVhc2UsIGN1c3RvbU1peGVyKSB7XG4gICAgY29uc3QgbWl4ZXJzID0gW107XG4gICAgY29uc3QgbWl4ZXJGYWN0b3J5ID0gY3VzdG9tTWl4ZXIgfHwgTW90aW9uR2xvYmFsQ29uZmlnLm1peCB8fCBtaXg7XG4gICAgY29uc3QgbnVtTWl4ZXJzID0gb3V0cHV0Lmxlbmd0aCAtIDE7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1NaXhlcnM7IGkrKykge1xuICAgICAgICBsZXQgbWl4ZXIgPSBtaXhlckZhY3Rvcnkob3V0cHV0W2ldLCBvdXRwdXRbaSArIDFdKTtcbiAgICAgICAgaWYgKGVhc2UpIHtcbiAgICAgICAgICAgIGNvbnN0IGVhc2luZ0Z1bmN0aW9uID0gQXJyYXkuaXNBcnJheShlYXNlKSA/IGVhc2VbaV0gfHwgbm9vcCA6IGVhc2U7XG4gICAgICAgICAgICBtaXhlciA9IHBpcGUoZWFzaW5nRnVuY3Rpb24sIG1peGVyKTtcbiAgICAgICAgfVxuICAgICAgICBtaXhlcnMucHVzaChtaXhlcik7XG4gICAgfVxuICAgIHJldHVybiBtaXhlcnM7XG59XG4vKipcbiAqIENyZWF0ZSBhIGZ1bmN0aW9uIHRoYXQgbWFwcyBmcm9tIGEgbnVtZXJpY2FsIGlucHV0IGFycmF5IHRvIGEgZ2VuZXJpYyBvdXRwdXQgYXJyYXkuXG4gKlxuICogQWNjZXB0czpcbiAqICAgLSBOdW1iZXJzXG4gKiAgIC0gQ29sb3JzIChoZXgsIGhzbCwgaHNsYSwgcmdiLCByZ2JhKVxuICogICAtIENvbXBsZXggKGNvbWJpbmF0aW9ucyBvZiBvbmUgb3IgbW9yZSBudW1iZXJzIG9yIHN0cmluZ3MpXG4gKlxuICogYGBganN4XG4gKiBjb25zdCBtaXhDb2xvciA9IGludGVycG9sYXRlKFswLCAxXSwgWycjZmZmJywgJyMwMDAnXSlcbiAqXG4gKiBtaXhDb2xvcigwLjUpIC8vICdyZ2JhKDEyOCwgMTI4LCAxMjgsIDEpJ1xuICogYGBgXG4gKlxuICogVE9ETyBSZXZpc2l0IHRoaXMgYXBwcm9hY2ggb25jZSB3ZSd2ZSBtb3ZlZCB0byBkYXRhIG1vZGVscyBmb3IgdmFsdWVzLFxuICogcHJvYmFibHkgbm90IG5lZWRlZCB0byBwcmVnZW5lcmF0ZSBtaXhlciBmdW5jdGlvbnMuXG4gKlxuICogQHB1YmxpY1xuICovXG5mdW5jdGlvbiBpbnRlcnBvbGF0ZShpbnB1dCwgb3V0cHV0LCB7IGNsYW1wOiBpc0NsYW1wID0gdHJ1ZSwgZWFzZSwgbWl4ZXIgfSA9IHt9KSB7XG4gICAgY29uc3QgaW5wdXRMZW5ndGggPSBpbnB1dC5sZW5ndGg7XG4gICAgaW52YXJpYW50KGlucHV0TGVuZ3RoID09PSBvdXRwdXQubGVuZ3RoLCBcIkJvdGggaW5wdXQgYW5kIG91dHB1dCByYW5nZXMgbXVzdCBiZSB0aGUgc2FtZSBsZW5ndGhcIiwgXCJyYW5nZS1sZW5ndGhcIik7XG4gICAgLyoqXG4gICAgICogSWYgd2UncmUgb25seSBwcm92aWRlZCBhIHNpbmdsZSBpbnB1dCwgd2UgY2FuIGp1c3QgbWFrZSBhIGZ1bmN0aW9uXG4gICAgICogdGhhdCByZXR1cm5zIHRoZSBvdXRwdXQuXG4gICAgICovXG4gICAgaWYgKGlucHV0TGVuZ3RoID09PSAxKVxuICAgICAgICByZXR1cm4gKCkgPT4gb3V0cHV0WzBdO1xuICAgIGlmIChpbnB1dExlbmd0aCA9PT0gMiAmJiBvdXRwdXRbMF0gPT09IG91dHB1dFsxXSlcbiAgICAgICAgcmV0dXJuICgpID0+IG91dHB1dFsxXTtcbiAgICBjb25zdCBpc1plcm9EZWx0YVJhbmdlID0gaW5wdXRbMF0gPT09IGlucHV0WzFdO1xuICAgIC8vIElmIGlucHV0IHJ1bnMgaGlnaGVzdCAtPiBsb3dlc3QsIHJldmVyc2UgYm90aCBhcnJheXNcbiAgICBpZiAoaW5wdXRbMF0gPiBpbnB1dFtpbnB1dExlbmd0aCAtIDFdKSB7XG4gICAgICAgIGlucHV0ID0gWy4uLmlucHV0XS5yZXZlcnNlKCk7XG4gICAgICAgIG91dHB1dCA9IFsuLi5vdXRwdXRdLnJldmVyc2UoKTtcbiAgICB9XG4gICAgY29uc3QgbWl4ZXJzID0gY3JlYXRlTWl4ZXJzKG91dHB1dCwgZWFzZSwgbWl4ZXIpO1xuICAgIGNvbnN0IG51bU1peGVycyA9IG1peGVycy5sZW5ndGg7XG4gICAgY29uc3QgaW50ZXJwb2xhdG9yID0gKHYpID0+IHtcbiAgICAgICAgaWYgKGlzWmVyb0RlbHRhUmFuZ2UgJiYgdiA8IGlucHV0WzBdKVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dFswXTtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBpZiAobnVtTWl4ZXJzID4gMSkge1xuICAgICAgICAgICAgZm9yICg7IGkgPCBpbnB1dC5sZW5ndGggLSAyOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodiA8IGlucHV0W2kgKyAxXSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcHJvZ3Jlc3NJblJhbmdlID0gcHJvZ3Jlc3MoaW5wdXRbaV0sIGlucHV0W2kgKyAxXSwgdik7XG4gICAgICAgIHJldHVybiBtaXhlcnNbaV0ocHJvZ3Jlc3NJblJhbmdlKTtcbiAgICB9O1xuICAgIHJldHVybiBpc0NsYW1wXG4gICAgICAgID8gKHYpID0+IGludGVycG9sYXRvcihjbGFtcChpbnB1dFswXSwgaW5wdXRbaW5wdXRMZW5ndGggLSAxXSwgdikpXG4gICAgICAgIDogaW50ZXJwb2xhdG9yO1xufVxuXG5leHBvcnQgeyBpbnRlcnBvbGF0ZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW50ZXJwb2xhdGUubWpzLm1hcFxuIiwiaW1wb3J0IHsgcHJvZ3Jlc3MgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgbWl4TnVtYmVyIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvbWl4L251bWJlci5tanMnO1xuXG5mdW5jdGlvbiBmaWxsT2Zmc2V0KG9mZnNldCwgcmVtYWluaW5nKSB7XG4gICAgY29uc3QgbWluID0gb2Zmc2V0W29mZnNldC5sZW5ndGggLSAxXTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSByZW1haW5pbmc7IGkrKykge1xuICAgICAgICBjb25zdCBvZmZzZXRQcm9ncmVzcyA9IHByb2dyZXNzKDAsIHJlbWFpbmluZywgaSk7XG4gICAgICAgIG9mZnNldC5wdXNoKG1peE51bWJlcihtaW4sIDEsIG9mZnNldFByb2dyZXNzKSk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBmaWxsT2Zmc2V0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWxsLm1qcy5tYXBcbiIsImltcG9ydCB7IGZpbGxPZmZzZXQgfSBmcm9tICcuL2ZpbGwubWpzJztcblxuZnVuY3Rpb24gZGVmYXVsdE9mZnNldChhcnIpIHtcbiAgICBjb25zdCBvZmZzZXQgPSBbMF07XG4gICAgZmlsbE9mZnNldChvZmZzZXQsIGFyci5sZW5ndGggLSAxKTtcbiAgICByZXR1cm4gb2Zmc2V0O1xufVxuXG5leHBvcnQgeyBkZWZhdWx0T2Zmc2V0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kZWZhdWx0Lm1qcy5tYXBcbiIsImZ1bmN0aW9uIGNvbnZlcnRPZmZzZXRUb1RpbWVzKG9mZnNldCwgZHVyYXRpb24pIHtcbiAgICByZXR1cm4gb2Zmc2V0Lm1hcCgobykgPT4gbyAqIGR1cmF0aW9uKTtcbn1cblxuZXhwb3J0IHsgY29udmVydE9mZnNldFRvVGltZXMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRpbWUubWpzLm1hcFxuIiwiaW1wb3J0IHsgZWFzZUluT3V0LCBpc0Vhc2luZ0FycmF5LCBlYXNpbmdEZWZpbml0aW9uVG9GdW5jdGlvbiB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBpbnRlcnBvbGF0ZSB9IGZyb20gJy4uLy4uL3V0aWxzL2ludGVycG9sYXRlLm1qcyc7XG5pbXBvcnQgeyBkZWZhdWx0T2Zmc2V0IH0gZnJvbSAnLi4va2V5ZnJhbWVzL29mZnNldHMvZGVmYXVsdC5tanMnO1xuaW1wb3J0IHsgY29udmVydE9mZnNldFRvVGltZXMgfSBmcm9tICcuLi9rZXlmcmFtZXMvb2Zmc2V0cy90aW1lLm1qcyc7XG5cbmZ1bmN0aW9uIGRlZmF1bHRFYXNpbmcodmFsdWVzLCBlYXNpbmcpIHtcbiAgICByZXR1cm4gdmFsdWVzLm1hcCgoKSA9PiBlYXNpbmcgfHwgZWFzZUluT3V0KS5zcGxpY2UoMCwgdmFsdWVzLmxlbmd0aCAtIDEpO1xufVxuZnVuY3Rpb24ga2V5ZnJhbWVzKHsgZHVyYXRpb24gPSAzMDAsIGtleWZyYW1lczoga2V5ZnJhbWVWYWx1ZXMsIHRpbWVzLCBlYXNlID0gXCJlYXNlSW5PdXRcIiwgfSkge1xuICAgIC8qKlxuICAgICAqIEVhc2luZyBmdW5jdGlvbnMgY2FuIGJlIGV4dGVybmFsbHkgZGVmaW5lZCBhcyBzdHJpbmdzLiBIZXJlIHdlIGNvbnZlcnQgdGhlbVxuICAgICAqIGludG8gYWN0dWFsIGZ1bmN0aW9ucy5cbiAgICAgKi9cbiAgICBjb25zdCBlYXNpbmdGdW5jdGlvbnMgPSBpc0Vhc2luZ0FycmF5KGVhc2UpXG4gICAgICAgID8gZWFzZS5tYXAoZWFzaW5nRGVmaW5pdGlvblRvRnVuY3Rpb24pXG4gICAgICAgIDogZWFzaW5nRGVmaW5pdGlvblRvRnVuY3Rpb24oZWFzZSk7XG4gICAgLyoqXG4gICAgICogVGhpcyBpcyB0aGUgSXRlcmF0b3Itc3BlYyByZXR1cm4gdmFsdWUuIFdlIGVuc3VyZSBpdCdzIG11dGFibGUgcmF0aGVyIHRoYW4gdXNpbmcgYSBnZW5lcmF0b3JcbiAgICAgKiB0byByZWR1Y2UgR0MgZHVyaW5nIGFuaW1hdGlvbi5cbiAgICAgKi9cbiAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBrZXlmcmFtZVZhbHVlc1swXSxcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIHRpbWVzIGFycmF5IGJhc2VkIG9uIHRoZSBwcm92aWRlZCAwLTEgb2Zmc2V0c1xuICAgICAqL1xuICAgIGNvbnN0IGFic29sdXRlVGltZXMgPSBjb252ZXJ0T2Zmc2V0VG9UaW1lcyhcbiAgICAvLyBPbmx5IHVzZSB0aGUgcHJvdmlkZWQgb2Zmc2V0cyBpZiB0aGV5J3JlIHRoZSBjb3JyZWN0IGxlbmd0aFxuICAgIC8vIFRPRE8gTWF5YmUgd2Ugc2hvdWxkIHdhcm4gaGVyZSBpZiB0aGVyZSdzIGEgbGVuZ3RoIG1pc21hdGNoXG4gICAgdGltZXMgJiYgdGltZXMubGVuZ3RoID09PSBrZXlmcmFtZVZhbHVlcy5sZW5ndGhcbiAgICAgICAgPyB0aW1lc1xuICAgICAgICA6IGRlZmF1bHRPZmZzZXQoa2V5ZnJhbWVWYWx1ZXMpLCBkdXJhdGlvbik7XG4gICAgY29uc3QgbWFwVGltZVRvS2V5ZnJhbWUgPSBpbnRlcnBvbGF0ZShhYnNvbHV0ZVRpbWVzLCBrZXlmcmFtZVZhbHVlcywge1xuICAgICAgICBlYXNlOiBBcnJheS5pc0FycmF5KGVhc2luZ0Z1bmN0aW9ucylcbiAgICAgICAgICAgID8gZWFzaW5nRnVuY3Rpb25zXG4gICAgICAgICAgICA6IGRlZmF1bHRFYXNpbmcoa2V5ZnJhbWVWYWx1ZXMsIGVhc2luZ0Z1bmN0aW9ucyksXG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2FsY3VsYXRlZER1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgbmV4dDogKHQpID0+IHtcbiAgICAgICAgICAgIHN0YXRlLnZhbHVlID0gbWFwVGltZVRvS2V5ZnJhbWUodCk7XG4gICAgICAgICAgICBzdGF0ZS5kb25lID0gdCA+PSBkdXJhdGlvbjtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuXG5leHBvcnQgeyBkZWZhdWx0RWFzaW5nLCBrZXlmcmFtZXMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWtleWZyYW1lcy5tanMubWFwXG4iLCJjb25zdCBpc05vdE51bGwgPSAodmFsdWUpID0+IHZhbHVlICE9PSBudWxsO1xuZnVuY3Rpb24gZ2V0RmluYWxLZXlmcmFtZShrZXlmcmFtZXMsIHsgcmVwZWF0LCByZXBlYXRUeXBlID0gXCJsb29wXCIgfSwgZmluYWxLZXlmcmFtZSwgc3BlZWQgPSAxKSB7XG4gICAgY29uc3QgcmVzb2x2ZWRLZXlmcmFtZXMgPSBrZXlmcmFtZXMuZmlsdGVyKGlzTm90TnVsbCk7XG4gICAgY29uc3QgdXNlRmlyc3RLZXlmcmFtZSA9IHNwZWVkIDwgMCB8fCAocmVwZWF0ICYmIHJlcGVhdFR5cGUgIT09IFwibG9vcFwiICYmIHJlcGVhdCAlIDIgPT09IDEpO1xuICAgIGNvbnN0IGluZGV4ID0gdXNlRmlyc3RLZXlmcmFtZSA/IDAgOiByZXNvbHZlZEtleWZyYW1lcy5sZW5ndGggLSAxO1xuICAgIHJldHVybiAhaW5kZXggfHwgZmluYWxLZXlmcmFtZSA9PT0gdW5kZWZpbmVkXG4gICAgICAgID8gcmVzb2x2ZWRLZXlmcmFtZXNbaW5kZXhdXG4gICAgICAgIDogZmluYWxLZXlmcmFtZTtcbn1cblxuZXhwb3J0IHsgZ2V0RmluYWxLZXlmcmFtZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2V0LWZpbmFsLm1qcy5tYXBcbiIsImltcG9ydCB7IGluZXJ0aWEgfSBmcm9tICcuLi9nZW5lcmF0b3JzL2luZXJ0aWEubWpzJztcbmltcG9ydCB7IGtleWZyYW1lcyB9IGZyb20gJy4uL2dlbmVyYXRvcnMva2V5ZnJhbWVzLm1qcyc7XG5pbXBvcnQgeyBzcHJpbmcgfSBmcm9tICcuLi9nZW5lcmF0b3JzL3NwcmluZy5tanMnO1xuXG5jb25zdCB0cmFuc2l0aW9uVHlwZU1hcCA9IHtcbiAgICBkZWNheTogaW5lcnRpYSxcbiAgICBpbmVydGlhLFxuICAgIHR3ZWVuOiBrZXlmcmFtZXMsXG4gICAga2V5ZnJhbWVzOiBrZXlmcmFtZXMsXG4gICAgc3ByaW5nLFxufTtcbmZ1bmN0aW9uIHJlcGxhY2VUcmFuc2l0aW9uVHlwZSh0cmFuc2l0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiB0cmFuc2l0aW9uLnR5cGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdHJhbnNpdGlvbi50eXBlID0gdHJhbnNpdGlvblR5cGVNYXBbdHJhbnNpdGlvbi50eXBlXTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IHJlcGxhY2VUcmFuc2l0aW9uVHlwZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVwbGFjZS10cmFuc2l0aW9uLXR5cGUubWpzLm1hcFxuIiwiY2xhc3MgV2l0aFByb21pc2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUZpbmlzaGVkKCk7XG4gICAgfVxuICAgIGdldCBmaW5pc2hlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpbmlzaGVkO1xuICAgIH1cbiAgICB1cGRhdGVGaW5pc2hlZCgpIHtcbiAgICAgICAgdGhpcy5fZmluaXNoZWQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG5vdGlmeUZpbmlzaGVkKCkge1xuICAgICAgICB0aGlzLnJlc29sdmUoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWxsb3dzIHRoZSBhbmltYXRpb24gdG8gYmUgYXdhaXRlZC5cbiAgICAgKlxuICAgICAqIEBkZXByZWNhdGVkIFVzZSBgZmluaXNoZWRgIGluc3RlYWQuXG4gICAgICovXG4gICAgdGhlbihvblJlc29sdmUsIG9uUmVqZWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmlzaGVkLnRoZW4ob25SZXNvbHZlLCBvblJlamVjdCk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBXaXRoUHJvbWlzZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9V2l0aFByb21pc2UubWpzLm1hcFxuIiwiaW1wb3J0IHsgaW52YXJpYW50LCBwaXBlLCBjbGFtcCwgbWlsbGlzZWNvbmRzVG9TZWNvbmRzLCBzZWNvbmRzVG9NaWxsaXNlY29uZHMgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgdGltZSB9IGZyb20gJy4uL2ZyYW1lbG9vcC9zeW5jLXRpbWUubWpzJztcbmltcG9ydCB7IGFjdGl2ZUFuaW1hdGlvbnMgfSBmcm9tICcuLi9zdGF0cy9hbmltYXRpb24tY291bnQubWpzJztcbmltcG9ydCB7IG1peCB9IGZyb20gJy4uL3V0aWxzL21peC9pbmRleC5tanMnO1xuaW1wb3J0IHsgZnJhbWVsb29wRHJpdmVyIH0gZnJvbSAnLi9kcml2ZXJzL2ZyYW1lLm1qcyc7XG5pbXBvcnQgeyBpbmVydGlhIH0gZnJvbSAnLi9nZW5lcmF0b3JzL2luZXJ0aWEubWpzJztcbmltcG9ydCB7IGtleWZyYW1lcyB9IGZyb20gJy4vZ2VuZXJhdG9ycy9rZXlmcmFtZXMubWpzJztcbmltcG9ydCB7IGNhbGNHZW5lcmF0b3JEdXJhdGlvbiB9IGZyb20gJy4vZ2VuZXJhdG9ycy91dGlscy9jYWxjLWR1cmF0aW9uLm1qcyc7XG5pbXBvcnQgeyBnZXRHZW5lcmF0b3JWZWxvY2l0eSB9IGZyb20gJy4vZ2VuZXJhdG9ycy91dGlscy92ZWxvY2l0eS5tanMnO1xuaW1wb3J0IHsgZ2V0RmluYWxLZXlmcmFtZSB9IGZyb20gJy4va2V5ZnJhbWVzL2dldC1maW5hbC5tanMnO1xuaW1wb3J0IHsgcmVwbGFjZVRyYW5zaXRpb25UeXBlIH0gZnJvbSAnLi91dGlscy9yZXBsYWNlLXRyYW5zaXRpb24tdHlwZS5tanMnO1xuaW1wb3J0IHsgV2l0aFByb21pc2UgfSBmcm9tICcuL3V0aWxzL1dpdGhQcm9taXNlLm1qcyc7XG5cbmNvbnN0IHBlcmNlbnRUb1Byb2dyZXNzID0gKHBlcmNlbnQpID0+IHBlcmNlbnQgLyAxMDA7XG5jbGFzcyBKU0FuaW1hdGlvbiBleHRlbmRzIFdpdGhQcm9taXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBcImlkbGVcIjtcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBudWxsO1xuICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IGZhbHNlO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGN1cnJlbnQgdGltZSBvZiB0aGUgYW5pbWF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jdXJyZW50VGltZSA9IDA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdGltZSBhdCB3aGljaCB0aGUgYW5pbWF0aW9uIHdhcyBwYXVzZWQuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmhvbGRUaW1lID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFBsYXliYWNrIHNwZWVkIGFzIGEgZmFjdG9yLiAwIHdvdWxkIGJlIHN0b3BwZWQsIC0xIHJldmVyc2UgYW5kIDIgZG91YmxlIHNwZWVkLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wbGF5YmFja1NwZWVkID0gMTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIGlzIGJvdW5kIHRvIHRoZSBpbnN0YW5jZSB0byBmaXggYSBwYXR0ZXJuIHdoZXJlXG4gICAgICAgICAqIGFuaW1hdGlvbi5zdG9wIGlzIHJldHVybmVkIGFzIGEgcmVmZXJlbmNlIGZyb20gYSB1c2VFZmZlY3QuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnN0b3AgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IG1vdGlvblZhbHVlIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgICAgICBpZiAobW90aW9uVmFsdWUgJiYgbW90aW9uVmFsdWUudXBkYXRlZEF0ICE9PSB0aW1lLm5vdygpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aWNrKHRpbWUubm93KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IFwiaWRsZVwiKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMudGVhcmRvd24oKTtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vblN0b3A/LigpO1xuICAgICAgICB9O1xuICAgICAgICBhY3RpdmVBbmltYXRpb25zLm1haW5UaHJlYWQrKztcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5pbml0QW5pbWF0aW9uKCk7XG4gICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICBpZiAob3B0aW9ucy5hdXRvcGxheSA9PT0gZmFsc2UpXG4gICAgICAgICAgICB0aGlzLnBhdXNlKCk7XG4gICAgfVxuICAgIGluaXRBbmltYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IHsgb3B0aW9ucyB9ID0gdGhpcztcbiAgICAgICAgcmVwbGFjZVRyYW5zaXRpb25UeXBlKG9wdGlvbnMpO1xuICAgICAgICBjb25zdCB7IHR5cGUgPSBrZXlmcmFtZXMsIHJlcGVhdCA9IDAsIHJlcGVhdERlbGF5ID0gMCwgcmVwZWF0VHlwZSwgdmVsb2NpdHkgPSAwLCB9ID0gb3B0aW9ucztcbiAgICAgICAgbGV0IHsga2V5ZnJhbWVzOiBrZXlmcmFtZXMkMSB9ID0gb3B0aW9ucztcbiAgICAgICAgY29uc3QgZ2VuZXJhdG9yRmFjdG9yeSA9IHR5cGUgfHwga2V5ZnJhbWVzO1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiICYmXG4gICAgICAgICAgICBnZW5lcmF0b3JGYWN0b3J5ICE9PSBrZXlmcmFtZXMpIHtcbiAgICAgICAgICAgIGludmFyaWFudChrZXlmcmFtZXMkMS5sZW5ndGggPD0gMiwgYE9ubHkgdHdvIGtleWZyYW1lcyBjdXJyZW50bHkgc3VwcG9ydGVkIHdpdGggc3ByaW5nIGFuZCBpbmVydGlhIGFuaW1hdGlvbnMuIFRyeWluZyB0byBhbmltYXRlICR7a2V5ZnJhbWVzJDF9YCwgXCJzcHJpbmctdHdvLWZyYW1lc1wiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ2VuZXJhdG9yRmFjdG9yeSAhPT0ga2V5ZnJhbWVzICYmXG4gICAgICAgICAgICB0eXBlb2Yga2V5ZnJhbWVzJDFbMF0gIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHRoaXMubWl4S2V5ZnJhbWVzID0gcGlwZShwZXJjZW50VG9Qcm9ncmVzcywgbWl4KGtleWZyYW1lcyQxWzBdLCBrZXlmcmFtZXMkMVsxXSkpO1xuICAgICAgICAgICAga2V5ZnJhbWVzJDEgPSBbMCwgMTAwXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBnZW5lcmF0b3IgPSBnZW5lcmF0b3JGYWN0b3J5KHsgLi4ub3B0aW9ucywga2V5ZnJhbWVzOiBrZXlmcmFtZXMkMSB9KTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHdlIGhhdmUgYSBtaXJyb3IgcmVwZWF0IHR5cGUgd2UgbmVlZCB0byBjcmVhdGUgYSBzZWNvbmQgZ2VuZXJhdG9yIHRoYXQgb3V0cHV0cyB0aGVcbiAgICAgICAgICogbWlycm9yZWQgKG5vdCByZXZlcnNlZCkgYW5pbWF0aW9uIGFuZCBsYXRlciBwaW5nIHBvbmcgYmV0d2VlbiB0aGUgdHdvIGdlbmVyYXRvcnMuXG4gICAgICAgICAqL1xuICAgICAgICBpZiAocmVwZWF0VHlwZSA9PT0gXCJtaXJyb3JcIikge1xuICAgICAgICAgICAgdGhpcy5taXJyb3JlZEdlbmVyYXRvciA9IGdlbmVyYXRvckZhY3Rvcnkoe1xuICAgICAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAga2V5ZnJhbWVzOiBbLi4ua2V5ZnJhbWVzJDFdLnJldmVyc2UoKSxcbiAgICAgICAgICAgICAgICB2ZWxvY2l0eTogLXZlbG9jaXR5LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGR1cmF0aW9uIGlzIHVuZGVmaW5lZCBhbmQgd2UgaGF2ZSByZXBlYXQgb3B0aW9ucyxcbiAgICAgICAgICogd2UgbmVlZCB0byBjYWxjdWxhdGUgYSBkdXJhdGlvbiBmcm9tIHRoZSBnZW5lcmF0b3IuXG4gICAgICAgICAqXG4gICAgICAgICAqIFdlIHNldCBpdCB0byB0aGUgZ2VuZXJhdG9yIGl0c2VsZiB0byBjYWNoZSB0aGUgZHVyYXRpb24uXG4gICAgICAgICAqIEFueSB0aW1lbGluZSByZXNvbHZlciB3aWxsIG5lZWQgdG8gaGF2ZSBhbHJlYWR5IHByZWNhbGN1bGF0ZWRcbiAgICAgICAgICogdGhlIGR1cmF0aW9uIGJ5IHRoaXMgc3RlcC5cbiAgICAgICAgICovXG4gICAgICAgIGlmIChnZW5lcmF0b3IuY2FsY3VsYXRlZER1cmF0aW9uID09PSBudWxsKSB7XG4gICAgICAgICAgICBnZW5lcmF0b3IuY2FsY3VsYXRlZER1cmF0aW9uID0gY2FsY0dlbmVyYXRvckR1cmF0aW9uKGdlbmVyYXRvcik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeyBjYWxjdWxhdGVkRHVyYXRpb24gfSA9IGdlbmVyYXRvcjtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVkRHVyYXRpb24gPSBjYWxjdWxhdGVkRHVyYXRpb247XG4gICAgICAgIHRoaXMucmVzb2x2ZWREdXJhdGlvbiA9IGNhbGN1bGF0ZWREdXJhdGlvbiArIHJlcGVhdERlbGF5O1xuICAgICAgICB0aGlzLnRvdGFsRHVyYXRpb24gPSB0aGlzLnJlc29sdmVkRHVyYXRpb24gKiAocmVwZWF0ICsgMSkgLSByZXBlYXREZWxheTtcbiAgICAgICAgdGhpcy5nZW5lcmF0b3IgPSBnZW5lcmF0b3I7XG4gICAgfVxuICAgIHVwZGF0ZVRpbWUodGltZXN0YW1wKSB7XG4gICAgICAgIGNvbnN0IGFuaW1hdGlvblRpbWUgPSBNYXRoLnJvdW5kKHRpbWVzdGFtcCAtIHRoaXMuc3RhcnRUaW1lKSAqIHRoaXMucGxheWJhY2tTcGVlZDtcbiAgICAgICAgLy8gVXBkYXRlIGN1cnJlbnRUaW1lXG4gICAgICAgIGlmICh0aGlzLmhvbGRUaW1lICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUaW1lID0gdGhpcy5ob2xkVGltZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFJvdW5kaW5nIHRoZSB0aW1lIGJlY2F1c2UgZmxvYXRpbmcgcG9pbnQgYXJpdGhtZXRpYyBpcyBub3QgYWx3YXlzIGFjY3VyYXRlLCBlLmcuIDMwMDAuMzY3IC0gMTAwMC4zNjcgPVxuICAgICAgICAgICAgLy8gMjAwMC4wMDAwMDAwMDAwMDAyLiBUaGlzIGlzIGEgcHJvYmxlbSB3aGVuIHdlIGFyZSBjb21wYXJpbmcgdGhlIGN1cnJlbnRUaW1lIHdpdGggdGhlIGR1cmF0aW9uLCBmb3JcbiAgICAgICAgICAgIC8vIGV4YW1wbGUuXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUaW1lID0gYW5pbWF0aW9uVGltZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aWNrKHRpbWVzdGFtcCwgc2FtcGxlID0gZmFsc2UpIHtcbiAgICAgICAgY29uc3QgeyBnZW5lcmF0b3IsIHRvdGFsRHVyYXRpb24sIG1peEtleWZyYW1lcywgbWlycm9yZWRHZW5lcmF0b3IsIHJlc29sdmVkRHVyYXRpb24sIGNhbGN1bGF0ZWREdXJhdGlvbiwgfSA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLnN0YXJ0VGltZSA9PT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiBnZW5lcmF0b3IubmV4dCgwKTtcbiAgICAgICAgY29uc3QgeyBkZWxheSA9IDAsIGtleWZyYW1lcywgcmVwZWF0LCByZXBlYXRUeXBlLCByZXBlYXREZWxheSwgdHlwZSwgb25VcGRhdGUsIGZpbmFsS2V5ZnJhbWUsIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgdGltZXN0YW1wcyBjYW4gY29tZSB0aHJvdWdoIGFzIGxvd2VyIHRoYW5cbiAgICAgICAgICogdGhlIHN0YXJ0VGltZSBhcyBzZXQgYnkgcGVyZm9ybWFuY2Uubm93KCkuIEhlcmUgd2UgcHJldmVudCB0aGlzLFxuICAgICAgICAgKiB0aG91Z2ggaW4gdGhlIGZ1dHVyZSBpdCBjb3VsZCBiZSBwb3NzaWJsZSB0byBtYWtlIHNldHRpbmcgc3RhcnRUaW1lXG4gICAgICAgICAqIGEgcGVuZGluZyBvcGVyYXRpb24gdGhhdCBnZXRzIHJlc29sdmVkIGhlcmUuXG4gICAgICAgICAqL1xuICAgICAgICBpZiAodGhpcy5zcGVlZCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gTWF0aC5taW4odGhpcy5zdGFydFRpbWUsIHRpbWVzdGFtcCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zcGVlZCA8IDApIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gTWF0aC5taW4odGltZXN0YW1wIC0gdG90YWxEdXJhdGlvbiAvIHRoaXMuc3BlZWQsIHRoaXMuc3RhcnRUaW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2FtcGxlKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUaW1lID0gdGltZXN0YW1wO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVUaW1lKHRpbWVzdGFtcCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmViYXNlIG9uIGRlbGF5XG4gICAgICAgIGNvbnN0IHRpbWVXaXRob3V0RGVsYXkgPSB0aGlzLmN1cnJlbnRUaW1lIC0gZGVsYXkgKiAodGhpcy5wbGF5YmFja1NwZWVkID49IDAgPyAxIDogLTEpO1xuICAgICAgICBjb25zdCBpc0luRGVsYXlQaGFzZSA9IHRoaXMucGxheWJhY2tTcGVlZCA+PSAwXG4gICAgICAgICAgICA/IHRpbWVXaXRob3V0RGVsYXkgPCAwXG4gICAgICAgICAgICA6IHRpbWVXaXRob3V0RGVsYXkgPiB0b3RhbER1cmF0aW9uO1xuICAgICAgICB0aGlzLmN1cnJlbnRUaW1lID0gTWF0aC5tYXgodGltZVdpdGhvdXREZWxheSwgMCk7XG4gICAgICAgIC8vIElmIHRoaXMgYW5pbWF0aW9uIGhhcyBmaW5pc2hlZCwgc2V0IHRoZSBjdXJyZW50IHRpbWUgIHRvIHRoZSB0b3RhbCBkdXJhdGlvbi5cbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IFwiZmluaXNoZWRcIiAmJiB0aGlzLmhvbGRUaW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUaW1lID0gdG90YWxEdXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZWxhcHNlZCA9IHRoaXMuY3VycmVudFRpbWU7XG4gICAgICAgIGxldCBmcmFtZUdlbmVyYXRvciA9IGdlbmVyYXRvcjtcbiAgICAgICAgaWYgKHJlcGVhdCkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBHZXQgdGhlIGN1cnJlbnQgcHJvZ3Jlc3MgKDAtMSkgb2YgdGhlIGFuaW1hdGlvbi4gSWYgdCBpcyA+XG4gICAgICAgICAgICAgKiB0aGFuIGR1cmF0aW9uIHdlJ2xsIGdldCB2YWx1ZXMgbGlrZSAyLjUgKG1pZHdheSB0aHJvdWdoIHRoZVxuICAgICAgICAgICAgICogdGhpcmQgaXRlcmF0aW9uKVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBwcm9ncmVzcyA9IE1hdGgubWluKHRoaXMuY3VycmVudFRpbWUsIHRvdGFsRHVyYXRpb24pIC8gcmVzb2x2ZWREdXJhdGlvbjtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogR2V0IHRoZSBjdXJyZW50IGl0ZXJhdGlvbiAoMCBpbmRleGVkKS4gRm9yIGluc3RhbmNlIHRoZSBmbG9vciBvZlxuICAgICAgICAgICAgICogMi41IGlzIDIuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBjdXJyZW50SXRlcmF0aW9uID0gTWF0aC5mbG9vcihwcm9ncmVzcyk7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEdldCB0aGUgY3VycmVudCBwcm9ncmVzcyBvZiB0aGUgaXRlcmF0aW9uIGJ5IHRha2luZyB0aGUgcmVtYWluZGVyXG4gICAgICAgICAgICAgKiBzbyAyLjUgaXMgMC41IHRocm91Z2ggaXRlcmF0aW9uIDJcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IGl0ZXJhdGlvblByb2dyZXNzID0gcHJvZ3Jlc3MgJSAxLjA7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIGl0ZXJhdGlvbiBwcm9ncmVzcyBpcyAxIHdlIGNvdW50IHRoYXQgYXMgdGhlIGVuZFxuICAgICAgICAgICAgICogb2YgdGhlIHByZXZpb3VzIGl0ZXJhdGlvbi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKCFpdGVyYXRpb25Qcm9ncmVzcyAmJiBwcm9ncmVzcyA+PSAxKSB7XG4gICAgICAgICAgICAgICAgaXRlcmF0aW9uUHJvZ3Jlc3MgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXRlcmF0aW9uUHJvZ3Jlc3MgPT09IDEgJiYgY3VycmVudEl0ZXJhdGlvbi0tO1xuICAgICAgICAgICAgY3VycmVudEl0ZXJhdGlvbiA9IE1hdGgubWluKGN1cnJlbnRJdGVyYXRpb24sIHJlcGVhdCArIDEpO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBSZXZlcnNlIHByb2dyZXNzIGlmIHdlJ3JlIG5vdCBydW5uaW5nIGluIFwibm9ybWFsXCIgZGlyZWN0aW9uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IGlzT2RkSXRlcmF0aW9uID0gQm9vbGVhbihjdXJyZW50SXRlcmF0aW9uICUgMik7XG4gICAgICAgICAgICBpZiAoaXNPZGRJdGVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAocmVwZWF0VHlwZSA9PT0gXCJyZXZlcnNlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlcmF0aW9uUHJvZ3Jlc3MgPSAxIC0gaXRlcmF0aW9uUHJvZ3Jlc3M7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXBlYXREZWxheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlcmF0aW9uUHJvZ3Jlc3MgLT0gcmVwZWF0RGVsYXkgLyByZXNvbHZlZER1cmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJlcGVhdFR5cGUgPT09IFwibWlycm9yXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZnJhbWVHZW5lcmF0b3IgPSBtaXJyb3JlZEdlbmVyYXRvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbGFwc2VkID0gY2xhbXAoMCwgMSwgaXRlcmF0aW9uUHJvZ3Jlc3MpICogcmVzb2x2ZWREdXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgd2UncmUgaW4gbmVnYXRpdmUgdGltZSwgc2V0IHN0YXRlIGFzIHRoZSBpbml0aWFsIGtleWZyYW1lLlxuICAgICAgICAgKiBUaGlzIHByZXZlbnRzIGRlbGF5OiB4LCBkdXJhdGlvbjogMCBhbmltYXRpb25zIGZyb20gZmluaXNoaW5nXG4gICAgICAgICAqIGluc3RhbnRseS5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHN0YXRlID0gaXNJbkRlbGF5UGhhc2VcbiAgICAgICAgICAgID8geyBkb25lOiBmYWxzZSwgdmFsdWU6IGtleWZyYW1lc1swXSB9XG4gICAgICAgICAgICA6IGZyYW1lR2VuZXJhdG9yLm5leHQoZWxhcHNlZCk7XG4gICAgICAgIGlmIChtaXhLZXlmcmFtZXMgJiYgIWlzSW5EZWxheVBoYXNlKSB7XG4gICAgICAgICAgICBzdGF0ZS52YWx1ZSA9IG1peEtleWZyYW1lcyhzdGF0ZS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHsgZG9uZSB9ID0gc3RhdGU7XG4gICAgICAgIGlmICghaXNJbkRlbGF5UGhhc2UgJiYgY2FsY3VsYXRlZER1cmF0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgICBkb25lID1cbiAgICAgICAgICAgICAgICB0aGlzLnBsYXliYWNrU3BlZWQgPj0gMFxuICAgICAgICAgICAgICAgICAgICA/IHRoaXMuY3VycmVudFRpbWUgPj0gdG90YWxEdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuY3VycmVudFRpbWUgPD0gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpc0FuaW1hdGlvbkZpbmlzaGVkID0gdGhpcy5ob2xkVGltZSA9PT0gbnVsbCAmJlxuICAgICAgICAgICAgKHRoaXMuc3RhdGUgPT09IFwiZmluaXNoZWRcIiB8fCAodGhpcy5zdGF0ZSA9PT0gXCJydW5uaW5nXCIgJiYgZG9uZSkpO1xuICAgICAgICAvLyBUT0RPOiBUaGUgZXhjZXB0aW9uIGZvciBpbmVydGlhIGNvdWxkIGJlIGNsZWFuZXIgaGVyZVxuICAgICAgICBpZiAoaXNBbmltYXRpb25GaW5pc2hlZCAmJiB0eXBlICE9PSBpbmVydGlhKSB7XG4gICAgICAgICAgICBzdGF0ZS52YWx1ZSA9IGdldEZpbmFsS2V5ZnJhbWUoa2V5ZnJhbWVzLCB0aGlzLm9wdGlvbnMsIGZpbmFsS2V5ZnJhbWUsIHRoaXMuc3BlZWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvblVwZGF0ZSkge1xuICAgICAgICAgICAgb25VcGRhdGUoc3RhdGUudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0FuaW1hdGlvbkZpbmlzaGVkKSB7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWxsb3dzIHRoZSByZXR1cm5lZCBhbmltYXRpb24gdG8gYmUgYXdhaXRlZCBvciBwcm9taXNlLWNoYWluZWQuIEN1cnJlbnRseVxuICAgICAqIHJlc29sdmVzIHdoZW4gdGhlIGFuaW1hdGlvbiBmaW5pc2hlcyBhdCBhbGwgYnV0IGluIGEgZnV0dXJlIHVwZGF0ZSBjb3VsZC9zaG91bGRcbiAgICAgKiByZWplY3QgaWYgaXRzIGNhbmNlbHMuXG4gICAgICovXG4gICAgdGhlbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoZWQudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgIH1cbiAgICBnZXQgZHVyYXRpb24oKSB7XG4gICAgICAgIHJldHVybiBtaWxsaXNlY29uZHNUb1NlY29uZHModGhpcy5jYWxjdWxhdGVkRHVyYXRpb24pO1xuICAgIH1cbiAgICBnZXQgaXRlcmF0aW9uRHVyYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwIH0gPSB0aGlzLm9wdGlvbnMgfHwge307XG4gICAgICAgIHJldHVybiB0aGlzLmR1cmF0aW9uICsgbWlsbGlzZWNvbmRzVG9TZWNvbmRzKGRlbGF5KTtcbiAgICB9XG4gICAgZ2V0IHRpbWUoKSB7XG4gICAgICAgIHJldHVybiBtaWxsaXNlY29uZHNUb1NlY29uZHModGhpcy5jdXJyZW50VGltZSk7XG4gICAgfVxuICAgIHNldCB0aW1lKG5ld1RpbWUpIHtcbiAgICAgICAgbmV3VGltZSA9IHNlY29uZHNUb01pbGxpc2Vjb25kcyhuZXdUaW1lKTtcbiAgICAgICAgdGhpcy5jdXJyZW50VGltZSA9IG5ld1RpbWU7XG4gICAgICAgIGlmICh0aGlzLnN0YXJ0VGltZSA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgdGhpcy5ob2xkVGltZSAhPT0gbnVsbCB8fFxuICAgICAgICAgICAgdGhpcy5wbGF5YmFja1NwZWVkID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmhvbGRUaW1lID0gbmV3VGltZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmRyaXZlcikge1xuICAgICAgICAgICAgdGhpcy5zdGFydFRpbWUgPSB0aGlzLmRyaXZlci5ub3coKSAtIG5ld1RpbWUgLyB0aGlzLnBsYXliYWNrU3BlZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZHJpdmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRyaXZlci5zdGFydChmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IDA7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gXCJwYXVzZWRcIjtcbiAgICAgICAgICAgIHRoaXMuaG9sZFRpbWUgPSBuZXdUaW1lO1xuICAgICAgICAgICAgdGhpcy50aWNrKG5ld1RpbWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGdlbmVyYXRvcidzIHZlbG9jaXR5IGF0IHRoZSBjdXJyZW50IHRpbWUgaW4gdW5pdHMvc2Vjb25kLlxuICAgICAqIFVzZXMgdGhlIGFuYWx5dGljYWwgZGVyaXZhdGl2ZSB3aGVuIGF2YWlsYWJsZSAoc3ByaW5ncyksIGF2b2lkaW5nXG4gICAgICogdGhlIE1vdGlvblZhbHVlJ3MgZnJhbWUtZGVwZW5kZW50IHZlbG9jaXR5IGVzdGltYXRpb24uXG4gICAgICovXG4gICAgZ2V0R2VuZXJhdG9yVmVsb2NpdHkoKSB7XG4gICAgICAgIGNvbnN0IHQgPSB0aGlzLmN1cnJlbnRUaW1lO1xuICAgICAgICBpZiAodCA8PSAwKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy52ZWxvY2l0eSB8fCAwO1xuICAgICAgICBpZiAodGhpcy5nZW5lcmF0b3IudmVsb2NpdHkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRvci52ZWxvY2l0eSh0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGYWxsYmFjazogZmluaXRlIGRpZmZlcmVuY2VcbiAgICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMuZ2VuZXJhdG9yLm5leHQodCkudmFsdWU7XG4gICAgICAgIHJldHVybiBnZXRHZW5lcmF0b3JWZWxvY2l0eSgocykgPT4gdGhpcy5nZW5lcmF0b3IubmV4dChzKS52YWx1ZSwgdCwgY3VycmVudCk7XG4gICAgfVxuICAgIGdldCBzcGVlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGxheWJhY2tTcGVlZDtcbiAgICB9XG4gICAgc2V0IHNwZWVkKG5ld1NwZWVkKSB7XG4gICAgICAgIGNvbnN0IGhhc0NoYW5nZWQgPSB0aGlzLnBsYXliYWNrU3BlZWQgIT09IG5ld1NwZWVkO1xuICAgICAgICBpZiAoaGFzQ2hhbmdlZCAmJiB0aGlzLmRyaXZlcikge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVUaW1lKHRpbWUubm93KCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGxheWJhY2tTcGVlZCA9IG5ld1NwZWVkO1xuICAgICAgICBpZiAoaGFzQ2hhbmdlZCAmJiB0aGlzLmRyaXZlcikge1xuICAgICAgICAgICAgdGhpcy50aW1lID0gbWlsbGlzZWNvbmRzVG9TZWNvbmRzKHRoaXMuY3VycmVudFRpbWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHBsYXkoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU3RvcHBlZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgeyBkcml2ZXIgPSBmcmFtZWxvb3BEcml2ZXIsIHN0YXJ0VGltZSB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgICBpZiAoIXRoaXMuZHJpdmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRyaXZlciA9IGRyaXZlcigodGltZXN0YW1wKSA9PiB0aGlzLnRpY2sodGltZXN0YW1wKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vcHRpb25zLm9uUGxheT8uKCk7XG4gICAgICAgIGNvbnN0IG5vdyA9IHRoaXMuZHJpdmVyLm5vdygpO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gXCJmaW5pc2hlZFwiKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZpbmlzaGVkKCk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IG5vdztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmhvbGRUaW1lICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IG5vdyAtIHRoaXMuaG9sZFRpbWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXRoaXMuc3RhcnRUaW1lKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IHN0YXJ0VGltZSA/PyBub3c7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IFwiZmluaXNoZWRcIiAmJiB0aGlzLnNwZWVkIDwgMCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydFRpbWUgKz0gdGhpcy5jYWxjdWxhdGVkRHVyYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ob2xkVGltZSA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgcGxheVN0YXRlIHRvIHJ1bm5pbmcgb25seSBhZnRlciB3ZSd2ZSB1c2VkIGl0IGluXG4gICAgICAgICAqIHRoZSBwcmV2aW91cyBsb2dpYy5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc3RhdGUgPSBcInJ1bm5pbmdcIjtcbiAgICAgICAgdGhpcy5kcml2ZXIuc3RhcnQoKTtcbiAgICB9XG4gICAgcGF1c2UoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBcInBhdXNlZFwiO1xuICAgICAgICB0aGlzLnVwZGF0ZVRpbWUodGltZS5ub3coKSk7XG4gICAgICAgIHRoaXMuaG9sZFRpbWUgPSB0aGlzLmN1cnJlbnRUaW1lO1xuICAgIH1cbiAgICBjb21wbGV0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IFwicnVubmluZ1wiKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXRlID0gXCJmaW5pc2hlZFwiO1xuICAgICAgICB0aGlzLmhvbGRUaW1lID0gbnVsbDtcbiAgICB9XG4gICAgZmluaXNoKCkge1xuICAgICAgICB0aGlzLm5vdGlmeUZpbmlzaGVkKCk7XG4gICAgICAgIHRoaXMudGVhcmRvd24oKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFwiZmluaXNoZWRcIjtcbiAgICAgICAgdGhpcy5vcHRpb25zLm9uQ29tcGxldGU/LigpO1xuICAgIH1cbiAgICBjYW5jZWwoKSB7XG4gICAgICAgIHRoaXMuaG9sZFRpbWUgPSBudWxsO1xuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IDA7XG4gICAgICAgIHRoaXMudGljaygwKTtcbiAgICAgICAgdGhpcy50ZWFyZG93bigpO1xuICAgICAgICB0aGlzLm9wdGlvbnMub25DYW5jZWw/LigpO1xuICAgIH1cbiAgICB0ZWFyZG93bigpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFwiaWRsZVwiO1xuICAgICAgICB0aGlzLnN0b3BEcml2ZXIoKTtcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSB0aGlzLmhvbGRUaW1lID0gbnVsbDtcbiAgICAgICAgYWN0aXZlQW5pbWF0aW9ucy5tYWluVGhyZWFkLS07XG4gICAgfVxuICAgIHN0b3BEcml2ZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5kcml2ZXIpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuZHJpdmVyLnN0b3AoKTtcbiAgICAgICAgdGhpcy5kcml2ZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHNhbXBsZShzYW1wbGVUaW1lKSB7XG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gMDtcbiAgICAgICAgcmV0dXJuIHRoaXMudGljayhzYW1wbGVUaW1lLCB0cnVlKTtcbiAgICB9XG4gICAgYXR0YWNoVGltZWxpbmUodGltZWxpbmUpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbGxvd0ZsYXR0ZW4pIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy50eXBlID0gXCJrZXlmcmFtZXNcIjtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5lYXNlID0gXCJsaW5lYXJcIjtcbiAgICAgICAgICAgIHRoaXMuaW5pdEFuaW1hdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZHJpdmVyPy5zdG9wKCk7XG4gICAgICAgIHJldHVybiB0aW1lbGluZS5vYnNlcnZlKHRoaXMpO1xuICAgIH1cbn1cbi8vIExlZ2FjeSBmdW5jdGlvbiBzdXBwb3J0XG5mdW5jdGlvbiBhbmltYXRlVmFsdWUob3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgSlNBbmltYXRpb24ob3B0aW9ucyk7XG59XG5cbmV4cG9ydCB7IEpTQW5pbWF0aW9uLCBhbmltYXRlVmFsdWUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUpTQW5pbWF0aW9uLm1qcy5tYXBcbiIsImZ1bmN0aW9uIGZpbGxXaWxkY2FyZHMoa2V5ZnJhbWVzKSB7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBrZXlmcmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAga2V5ZnJhbWVzW2ldID8/IChrZXlmcmFtZXNbaV0gPSBrZXlmcmFtZXNbaSAtIDFdKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IGZpbGxXaWxkY2FyZHMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbGwtd2lsZGNhcmRzLm1qcy5tYXBcbiIsImNvbnN0IHJhZFRvRGVnID0gKHJhZCkgPT4gKHJhZCAqIDE4MCkgLyBNYXRoLlBJO1xuY29uc3Qgcm90YXRlID0gKHYpID0+IHtcbiAgICBjb25zdCBhbmdsZSA9IHJhZFRvRGVnKE1hdGguYXRhbjIodlsxXSwgdlswXSkpO1xuICAgIHJldHVybiByZWJhc2VBbmdsZShhbmdsZSk7XG59O1xuY29uc3QgbWF0cml4MmRQYXJzZXJzID0ge1xuICAgIHg6IDQsXG4gICAgeTogNSxcbiAgICB0cmFuc2xhdGVYOiA0LFxuICAgIHRyYW5zbGF0ZVk6IDUsXG4gICAgc2NhbGVYOiAwLFxuICAgIHNjYWxlWTogMyxcbiAgICBzY2FsZTogKHYpID0+IChNYXRoLmFicyh2WzBdKSArIE1hdGguYWJzKHZbM10pKSAvIDIsXG4gICAgcm90YXRlLFxuICAgIHJvdGF0ZVo6IHJvdGF0ZSxcbiAgICBza2V3WDogKHYpID0+IHJhZFRvRGVnKE1hdGguYXRhbih2WzFdKSksXG4gICAgc2tld1k6ICh2KSA9PiByYWRUb0RlZyhNYXRoLmF0YW4odlsyXSkpLFxuICAgIHNrZXc6ICh2KSA9PiAoTWF0aC5hYnModlsxXSkgKyBNYXRoLmFicyh2WzJdKSkgLyAyLFxufTtcbmNvbnN0IHJlYmFzZUFuZ2xlID0gKGFuZ2xlKSA9PiB7XG4gICAgYW5nbGUgPSBhbmdsZSAlIDM2MDtcbiAgICBpZiAoYW5nbGUgPCAwKVxuICAgICAgICBhbmdsZSArPSAzNjA7XG4gICAgcmV0dXJuIGFuZ2xlO1xufTtcbmNvbnN0IHJvdGF0ZVogPSByb3RhdGU7XG5jb25zdCBzY2FsZVggPSAodikgPT4gTWF0aC5zcXJ0KHZbMF0gKiB2WzBdICsgdlsxXSAqIHZbMV0pO1xuY29uc3Qgc2NhbGVZID0gKHYpID0+IE1hdGguc3FydCh2WzRdICogdls0XSArIHZbNV0gKiB2WzVdKTtcbmNvbnN0IG1hdHJpeDNkUGFyc2VycyA9IHtcbiAgICB4OiAxMixcbiAgICB5OiAxMyxcbiAgICB6OiAxNCxcbiAgICB0cmFuc2xhdGVYOiAxMixcbiAgICB0cmFuc2xhdGVZOiAxMyxcbiAgICB0cmFuc2xhdGVaOiAxNCxcbiAgICBzY2FsZVgsXG4gICAgc2NhbGVZLFxuICAgIHNjYWxlOiAodikgPT4gKHNjYWxlWCh2KSArIHNjYWxlWSh2KSkgLyAyLFxuICAgIHJvdGF0ZVg6ICh2KSA9PiByZWJhc2VBbmdsZShyYWRUb0RlZyhNYXRoLmF0YW4yKHZbNl0sIHZbNV0pKSksXG4gICAgcm90YXRlWTogKHYpID0+IHJlYmFzZUFuZ2xlKHJhZFRvRGVnKE1hdGguYXRhbjIoLXZbMl0sIHZbMF0pKSksXG4gICAgcm90YXRlWixcbiAgICByb3RhdGU6IHJvdGF0ZVosXG4gICAgc2tld1g6ICh2KSA9PiByYWRUb0RlZyhNYXRoLmF0YW4odls0XSkpLFxuICAgIHNrZXdZOiAodikgPT4gcmFkVG9EZWcoTWF0aC5hdGFuKHZbMV0pKSxcbiAgICBza2V3OiAodikgPT4gKE1hdGguYWJzKHZbMV0pICsgTWF0aC5hYnModls0XSkpIC8gMixcbn07XG5mdW5jdGlvbiBkZWZhdWx0VHJhbnNmb3JtVmFsdWUobmFtZSkge1xuICAgIHJldHVybiBuYW1lLmluY2x1ZGVzKFwic2NhbGVcIikgPyAxIDogMDtcbn1cbmZ1bmN0aW9uIHBhcnNlVmFsdWVGcm9tVHJhbnNmb3JtKHRyYW5zZm9ybSwgbmFtZSkge1xuICAgIGlmICghdHJhbnNmb3JtIHx8IHRyYW5zZm9ybSA9PT0gXCJub25lXCIpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRUcmFuc2Zvcm1WYWx1ZShuYW1lKTtcbiAgICB9XG4gICAgY29uc3QgbWF0cml4M2RNYXRjaCA9IHRyYW5zZm9ybS5tYXRjaCgvXm1hdHJpeDNkXFwoKFstXFxkLmVcXHMsXSspXFwpJC91KTtcbiAgICBsZXQgcGFyc2VycztcbiAgICBsZXQgbWF0Y2g7XG4gICAgaWYgKG1hdHJpeDNkTWF0Y2gpIHtcbiAgICAgICAgcGFyc2VycyA9IG1hdHJpeDNkUGFyc2VycztcbiAgICAgICAgbWF0Y2ggPSBtYXRyaXgzZE1hdGNoO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgbWF0cml4MmRNYXRjaCA9IHRyYW5zZm9ybS5tYXRjaCgvXm1hdHJpeFxcKChbLVxcZC5lXFxzLF0rKVxcKSQvdSk7XG4gICAgICAgIHBhcnNlcnMgPSBtYXRyaXgyZFBhcnNlcnM7XG4gICAgICAgIG1hdGNoID0gbWF0cml4MmRNYXRjaDtcbiAgICB9XG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFRyYW5zZm9ybVZhbHVlKG5hbWUpO1xuICAgIH1cbiAgICBjb25zdCB2YWx1ZVBhcnNlciA9IHBhcnNlcnNbbmFtZV07XG4gICAgY29uc3QgdmFsdWVzID0gbWF0Y2hbMV0uc3BsaXQoXCIsXCIpLm1hcChjb252ZXJ0VHJhbnNmb3JtVG9OdW1iZXIpO1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWVQYXJzZXIgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICA/IHZhbHVlUGFyc2VyKHZhbHVlcylcbiAgICAgICAgOiB2YWx1ZXNbdmFsdWVQYXJzZXJdO1xufVxuY29uc3QgcmVhZFRyYW5zZm9ybVZhbHVlID0gKGluc3RhbmNlLCBuYW1lKSA9PiB7XG4gICAgY29uc3QgeyB0cmFuc2Zvcm0gPSBcIm5vbmVcIiB9ID0gZ2V0Q29tcHV0ZWRTdHlsZShpbnN0YW5jZSk7XG4gICAgcmV0dXJuIHBhcnNlVmFsdWVGcm9tVHJhbnNmb3JtKHRyYW5zZm9ybSwgbmFtZSk7XG59O1xuZnVuY3Rpb24gY29udmVydFRyYW5zZm9ybVRvTnVtYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUudHJpbSgpKTtcbn1cblxuZXhwb3J0IHsgZGVmYXVsdFRyYW5zZm9ybVZhbHVlLCBwYXJzZVZhbHVlRnJvbVRyYW5zZm9ybSwgcmVhZFRyYW5zZm9ybVZhbHVlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZS10cmFuc2Zvcm0ubWpzLm1hcFxuIiwiLyoqXG4gKiBHZW5lcmF0ZSBhIGxpc3Qgb2YgZXZlcnkgcG9zc2libGUgdHJhbnNmb3JtIGtleS5cbiAqL1xuY29uc3QgdHJhbnNmb3JtUHJvcE9yZGVyID0gW1xuICAgIFwidHJhbnNmb3JtUGVyc3BlY3RpdmVcIixcbiAgICBcInhcIixcbiAgICBcInlcIixcbiAgICBcInpcIixcbiAgICBcInRyYW5zbGF0ZVhcIixcbiAgICBcInRyYW5zbGF0ZVlcIixcbiAgICBcInRyYW5zbGF0ZVpcIixcbiAgICBcInNjYWxlXCIsXG4gICAgXCJzY2FsZVhcIixcbiAgICBcInNjYWxlWVwiLFxuICAgIFwicm90YXRlXCIsXG4gICAgXCJyb3RhdGVYXCIsXG4gICAgXCJyb3RhdGVZXCIsXG4gICAgXCJyb3RhdGVaXCIsXG4gICAgXCJza2V3XCIsXG4gICAgXCJza2V3WFwiLFxuICAgIFwic2tld1lcIixcbl07XG4vKipcbiAqIEEgcXVpY2sgbG9va3VwIGZvciB0cmFuc2Zvcm0gcHJvcHMuXG4gKi9cbmNvbnN0IHRyYW5zZm9ybVByb3BzID0gLypAX19QVVJFX18qLyAoKCkgPT4gbmV3IFNldCh0cmFuc2Zvcm1Qcm9wT3JkZXIpKSgpO1xuXG5leHBvcnQgeyB0cmFuc2Zvcm1Qcm9wT3JkZXIsIHRyYW5zZm9ybVByb3BzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1rZXlzLXRyYW5zZm9ybS5tanMubWFwXG4iLCJpbXBvcnQgeyBwYXJzZVZhbHVlRnJvbVRyYW5zZm9ybSB9IGZyb20gJy4uLy4uLy4uL3JlbmRlci9kb20vcGFyc2UtdHJhbnNmb3JtLm1qcyc7XG5pbXBvcnQgeyB0cmFuc2Zvcm1Qcm9wT3JkZXIgfSBmcm9tICcuLi8uLi8uLi9yZW5kZXIvdXRpbHMva2V5cy10cmFuc2Zvcm0ubWpzJztcbmltcG9ydCB7IG51bWJlciB9IGZyb20gJy4uLy4uLy4uL3ZhbHVlL3R5cGVzL251bWJlcnMvaW5kZXgubWpzJztcbmltcG9ydCB7IHB4IH0gZnJvbSAnLi4vLi4vLi4vdmFsdWUvdHlwZXMvbnVtYmVycy91bml0cy5tanMnO1xuXG5jb25zdCBpc051bU9yUHhUeXBlID0gKHYpID0+IHYgPT09IG51bWJlciB8fCB2ID09PSBweDtcbmNvbnN0IHRyYW5zZm9ybUtleXMgPSBuZXcgU2V0KFtcInhcIiwgXCJ5XCIsIFwielwiXSk7XG5jb25zdCBub25UcmFuc2xhdGlvbmFsVHJhbnNmb3JtS2V5cyA9IHRyYW5zZm9ybVByb3BPcmRlci5maWx0ZXIoKGtleSkgPT4gIXRyYW5zZm9ybUtleXMuaGFzKGtleSkpO1xuZnVuY3Rpb24gcmVtb3ZlTm9uVHJhbnNsYXRpb25hbFRyYW5zZm9ybSh2aXN1YWxFbGVtZW50KSB7XG4gICAgY29uc3QgcmVtb3ZlZFRyYW5zZm9ybXMgPSBbXTtcbiAgICBub25UcmFuc2xhdGlvbmFsVHJhbnNmb3JtS2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB2aXN1YWxFbGVtZW50LmdldFZhbHVlKGtleSk7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZW1vdmVkVHJhbnNmb3Jtcy5wdXNoKFtrZXksIHZhbHVlLmdldCgpXSk7XG4gICAgICAgICAgICB2YWx1ZS5zZXQoa2V5LnN0YXJ0c1dpdGgoXCJzY2FsZVwiKSA/IDEgOiAwKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZW1vdmVkVHJhbnNmb3Jtcztcbn1cbmNvbnN0IHBvc2l0aW9uYWxWYWx1ZXMgPSB7XG4gICAgLy8gRGltZW5zaW9uc1xuICAgIHdpZHRoOiAoeyB4IH0sIHsgcGFkZGluZ0xlZnQgPSBcIjBcIiwgcGFkZGluZ1JpZ2h0ID0gXCIwXCIsIGJveFNpemluZyB9KSA9PiB7XG4gICAgICAgIGNvbnN0IHdpZHRoID0geC5tYXggLSB4Lm1pbjtcbiAgICAgICAgcmV0dXJuIGJveFNpemluZyA9PT0gXCJib3JkZXItYm94XCJcbiAgICAgICAgICAgID8gd2lkdGhcbiAgICAgICAgICAgIDogd2lkdGggLSBwYXJzZUZsb2F0KHBhZGRpbmdMZWZ0KSAtIHBhcnNlRmxvYXQocGFkZGluZ1JpZ2h0KTtcbiAgICB9LFxuICAgIGhlaWdodDogKHsgeSB9LCB7IHBhZGRpbmdUb3AgPSBcIjBcIiwgcGFkZGluZ0JvdHRvbSA9IFwiMFwiLCBib3hTaXppbmcgfSkgPT4ge1xuICAgICAgICBjb25zdCBoZWlnaHQgPSB5Lm1heCAtIHkubWluO1xuICAgICAgICByZXR1cm4gYm94U2l6aW5nID09PSBcImJvcmRlci1ib3hcIlxuICAgICAgICAgICAgPyBoZWlnaHRcbiAgICAgICAgICAgIDogaGVpZ2h0IC0gcGFyc2VGbG9hdChwYWRkaW5nVG9wKSAtIHBhcnNlRmxvYXQocGFkZGluZ0JvdHRvbSk7XG4gICAgfSxcbiAgICB0b3A6IChfYmJveCwgeyB0b3AgfSkgPT4gcGFyc2VGbG9hdCh0b3ApLFxuICAgIGxlZnQ6IChfYmJveCwgeyBsZWZ0IH0pID0+IHBhcnNlRmxvYXQobGVmdCksXG4gICAgYm90dG9tOiAoeyB5IH0sIHsgdG9wIH0pID0+IHBhcnNlRmxvYXQodG9wKSArICh5Lm1heCAtIHkubWluKSxcbiAgICByaWdodDogKHsgeCB9LCB7IGxlZnQgfSkgPT4gcGFyc2VGbG9hdChsZWZ0KSArICh4Lm1heCAtIHgubWluKSxcbiAgICAvLyBUcmFuc2Zvcm1cbiAgICB4OiAoX2Jib3gsIHsgdHJhbnNmb3JtIH0pID0+IHBhcnNlVmFsdWVGcm9tVHJhbnNmb3JtKHRyYW5zZm9ybSwgXCJ4XCIpLFxuICAgIHk6IChfYmJveCwgeyB0cmFuc2Zvcm0gfSkgPT4gcGFyc2VWYWx1ZUZyb21UcmFuc2Zvcm0odHJhbnNmb3JtLCBcInlcIiksXG59O1xuLy8gQWxpYXMgdHJhbnNsYXRlIGxvbmdmb3JtIG5hbWVzXG5wb3NpdGlvbmFsVmFsdWVzLnRyYW5zbGF0ZVggPSBwb3NpdGlvbmFsVmFsdWVzLng7XG5wb3NpdGlvbmFsVmFsdWVzLnRyYW5zbGF0ZVkgPSBwb3NpdGlvbmFsVmFsdWVzLnk7XG5cbmV4cG9ydCB7IGlzTnVtT3JQeFR5cGUsIHBvc2l0aW9uYWxWYWx1ZXMsIHJlbW92ZU5vblRyYW5zbGF0aW9uYWxUcmFuc2Zvcm0gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXVuaXQtY29udmVyc2lvbi5tanMubWFwXG4iLCJpbXBvcnQgeyBmaWxsV2lsZGNhcmRzIH0gZnJvbSAnLi91dGlscy9maWxsLXdpbGRjYXJkcy5tanMnO1xuaW1wb3J0IHsgcmVtb3ZlTm9uVHJhbnNsYXRpb25hbFRyYW5zZm9ybSB9IGZyb20gJy4vdXRpbHMvdW5pdC1jb252ZXJzaW9uLm1qcyc7XG5pbXBvcnQgeyBmcmFtZSB9IGZyb20gJy4uLy4uL2ZyYW1lbG9vcC9mcmFtZS5tanMnO1xuXG5jb25zdCB0b1Jlc29sdmUgPSBuZXcgU2V0KCk7XG5sZXQgaXNTY2hlZHVsZWQgPSBmYWxzZTtcbmxldCBhbnlOZWVkc01lYXN1cmVtZW50ID0gZmFsc2U7XG5sZXQgaXNGb3JjZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIG1lYXN1cmVBbGxLZXlmcmFtZXMoKSB7XG4gICAgaWYgKGFueU5lZWRzTWVhc3VyZW1lbnQpIHtcbiAgICAgICAgY29uc3QgcmVzb2x2ZXJzVG9NZWFzdXJlID0gQXJyYXkuZnJvbSh0b1Jlc29sdmUpLmZpbHRlcigocmVzb2x2ZXIpID0+IHJlc29sdmVyLm5lZWRzTWVhc3VyZW1lbnQpO1xuICAgICAgICBjb25zdCBlbGVtZW50c1RvTWVhc3VyZSA9IG5ldyBTZXQocmVzb2x2ZXJzVG9NZWFzdXJlLm1hcCgocmVzb2x2ZXIpID0+IHJlc29sdmVyLmVsZW1lbnQpKTtcbiAgICAgICAgY29uc3QgdHJhbnNmb3Jtc1RvUmVzdG9yZSA9IG5ldyBNYXAoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdyaXRlIHBhc3NcbiAgICAgICAgICogSWYgd2UncmUgbWVhc3VyaW5nIGVsZW1lbnRzIHdlIHdhbnQgdG8gcmVtb3ZlIGJvdW5kaW5nIGJveC1jaGFuZ2luZyB0cmFuc2Zvcm1zLlxuICAgICAgICAgKi9cbiAgICAgICAgZWxlbWVudHNUb01lYXN1cmUuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlZFRyYW5zZm9ybXMgPSByZW1vdmVOb25UcmFuc2xhdGlvbmFsVHJhbnNmb3JtKGVsZW1lbnQpO1xuICAgICAgICAgICAgaWYgKCFyZW1vdmVkVHJhbnNmb3Jtcy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdHJhbnNmb3Jtc1RvUmVzdG9yZS5zZXQoZWxlbWVudCwgcmVtb3ZlZFRyYW5zZm9ybXMpO1xuICAgICAgICAgICAgZWxlbWVudC5yZW5kZXIoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFJlYWRcbiAgICAgICAgcmVzb2x2ZXJzVG9NZWFzdXJlLmZvckVhY2goKHJlc29sdmVyKSA9PiByZXNvbHZlci5tZWFzdXJlSW5pdGlhbFN0YXRlKCkpO1xuICAgICAgICAvLyBXcml0ZVxuICAgICAgICBlbGVtZW50c1RvTWVhc3VyZS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbmRlcigpO1xuICAgICAgICAgICAgY29uc3QgcmVzdG9yZSA9IHRyYW5zZm9ybXNUb1Jlc3RvcmUuZ2V0KGVsZW1lbnQpO1xuICAgICAgICAgICAgaWYgKHJlc3RvcmUpIHtcbiAgICAgICAgICAgICAgICByZXN0b3JlLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmdldFZhbHVlKGtleSk/LnNldCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBSZWFkXG4gICAgICAgIHJlc29sdmVyc1RvTWVhc3VyZS5mb3JFYWNoKChyZXNvbHZlcikgPT4gcmVzb2x2ZXIubWVhc3VyZUVuZFN0YXRlKCkpO1xuICAgICAgICAvLyBXcml0ZVxuICAgICAgICByZXNvbHZlcnNUb01lYXN1cmUuZm9yRWFjaCgocmVzb2x2ZXIpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNvbHZlci5zdXNwZW5kZWRTY3JvbGxZICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgcmVzb2x2ZXIuc3VzcGVuZGVkU2Nyb2xsWSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhbnlOZWVkc01lYXN1cmVtZW50ID0gZmFsc2U7XG4gICAgaXNTY2hlZHVsZWQgPSBmYWxzZTtcbiAgICB0b1Jlc29sdmUuZm9yRWFjaCgocmVzb2x2ZXIpID0+IHJlc29sdmVyLmNvbXBsZXRlKGlzRm9yY2VkKSk7XG4gICAgdG9SZXNvbHZlLmNsZWFyKCk7XG59XG5mdW5jdGlvbiByZWFkQWxsS2V5ZnJhbWVzKCkge1xuICAgIHRvUmVzb2x2ZS5mb3JFYWNoKChyZXNvbHZlcikgPT4ge1xuICAgICAgICByZXNvbHZlci5yZWFkS2V5ZnJhbWVzKCk7XG4gICAgICAgIGlmIChyZXNvbHZlci5uZWVkc01lYXN1cmVtZW50KSB7XG4gICAgICAgICAgICBhbnlOZWVkc01lYXN1cmVtZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gZmx1c2hLZXlmcmFtZVJlc29sdmVycygpIHtcbiAgICBpc0ZvcmNlZCA9IHRydWU7XG4gICAgcmVhZEFsbEtleWZyYW1lcygpO1xuICAgIG1lYXN1cmVBbGxLZXlmcmFtZXMoKTtcbiAgICBpc0ZvcmNlZCA9IGZhbHNlO1xufVxuY2xhc3MgS2V5ZnJhbWVSZXNvbHZlciB7XG4gICAgY29uc3RydWN0b3IodW5yZXNvbHZlZEtleWZyYW1lcywgb25Db21wbGV0ZSwgbmFtZSwgbW90aW9uVmFsdWUsIGVsZW1lbnQsIGlzQXN5bmMgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLnN0YXRlID0gXCJwZW5kaW5nXCI7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUcmFjayB3aGV0aGVyIHRoaXMgcmVzb2x2ZXIgaXMgYXN5bmMuIElmIGl0IGlzLCBpdCdsbCBiZSBhZGRlZCB0byB0aGVcbiAgICAgICAgICogcmVzb2x2ZXIgcXVldWUgYW5kIGZsdXNoZWQgaW4gdGhlIG5leHQgZnJhbWUuIFJlc29sdmVycyB0aGF0IGFyZW4ndCBnb2luZ1xuICAgICAgICAgKiB0byB0cmlnZ2VyIHJlYWQvd3JpdGUgdGhyYXNoaW5nIGRvbid0IG5lZWQgdG8gYmUgYXN5bmMuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmlzQXN5bmMgPSBmYWxzZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRyYWNrIHdoZXRoZXIgdGhpcyByZXNvbHZlciBuZWVkcyB0byBwZXJmb3JtIGEgbWVhc3VyZW1lbnRcbiAgICAgICAgICogdG8gcmVzb2x2ZSBpdHMga2V5ZnJhbWVzLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5uZWVkc01lYXN1cmVtZW50ID0gZmFsc2U7XG4gICAgICAgIHRoaXMudW5yZXNvbHZlZEtleWZyYW1lcyA9IFsuLi51bnJlc29sdmVkS2V5ZnJhbWVzXTtcbiAgICAgICAgdGhpcy5vbkNvbXBsZXRlID0gb25Db21wbGV0ZTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5tb3Rpb25WYWx1ZSA9IG1vdGlvblZhbHVlO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLmlzQXN5bmMgPSBpc0FzeW5jO1xuICAgIH1cbiAgICBzY2hlZHVsZVJlc29sdmUoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBcInNjaGVkdWxlZFwiO1xuICAgICAgICBpZiAodGhpcy5pc0FzeW5jKSB7XG4gICAgICAgICAgICB0b1Jlc29sdmUuYWRkKHRoaXMpO1xuICAgICAgICAgICAgaWYgKCFpc1NjaGVkdWxlZCkge1xuICAgICAgICAgICAgICAgIGlzU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmcmFtZS5yZWFkKHJlYWRBbGxLZXlmcmFtZXMpO1xuICAgICAgICAgICAgICAgIGZyYW1lLnJlc29sdmVLZXlmcmFtZXMobWVhc3VyZUFsbEtleWZyYW1lcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlYWRLZXlmcmFtZXMoKTtcbiAgICAgICAgICAgIHRoaXMuY29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZWFkS2V5ZnJhbWVzKCkge1xuICAgICAgICBjb25zdCB7IHVucmVzb2x2ZWRLZXlmcmFtZXMsIG5hbWUsIGVsZW1lbnQsIG1vdGlvblZhbHVlIH0gPSB0aGlzO1xuICAgICAgICAvLyBJZiBpbml0aWFsIGtleWZyYW1lIGlzIG51bGwgd2UgbmVlZCB0byByZWFkIGl0IGZyb20gdGhlIERPTVxuICAgICAgICBpZiAodW5yZXNvbHZlZEtleWZyYW1lc1swXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFZhbHVlID0gbW90aW9uVmFsdWU/LmdldCgpO1xuICAgICAgICAgICAgLy8gVE9ETzogVGhpcyBkb2Vzbid0IHdvcmsgaWYgdGhlIGZpbmFsIGtleWZyYW1lIGlzIGEgd2lsZGNhcmRcbiAgICAgICAgICAgIGNvbnN0IGZpbmFsS2V5ZnJhbWUgPSB1bnJlc29sdmVkS2V5ZnJhbWVzW3VucmVzb2x2ZWRLZXlmcmFtZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBpZiAoY3VycmVudFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB1bnJlc29sdmVkS2V5ZnJhbWVzWzBdID0gY3VycmVudFZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZWxlbWVudCAmJiBuYW1lKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWVBc1JlYWQgPSBlbGVtZW50LnJlYWRWYWx1ZShuYW1lLCBmaW5hbEtleWZyYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVBc1JlYWQgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZUFzUmVhZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB1bnJlc29sdmVkS2V5ZnJhbWVzWzBdID0gdmFsdWVBc1JlYWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHVucmVzb2x2ZWRLZXlmcmFtZXNbMF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHVucmVzb2x2ZWRLZXlmcmFtZXNbMF0gPSBmaW5hbEtleWZyYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1vdGlvblZhbHVlICYmIGN1cnJlbnRWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbW90aW9uVmFsdWUuc2V0KHVucmVzb2x2ZWRLZXlmcmFtZXNbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZpbGxXaWxkY2FyZHModW5yZXNvbHZlZEtleWZyYW1lcyk7XG4gICAgfVxuICAgIHNldEZpbmFsS2V5ZnJhbWUoKSB7IH1cbiAgICBtZWFzdXJlSW5pdGlhbFN0YXRlKCkgeyB9XG4gICAgcmVuZGVyRW5kU3R5bGVzKCkgeyB9XG4gICAgbWVhc3VyZUVuZFN0YXRlKCkgeyB9XG4gICAgY29tcGxldGUoaXNGb3JjZWRDb21wbGV0ZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBcImNvbXBsZXRlXCI7XG4gICAgICAgIHRoaXMub25Db21wbGV0ZSh0aGlzLnVucmVzb2x2ZWRLZXlmcmFtZXMsIHRoaXMuZmluYWxLZXlmcmFtZSwgaXNGb3JjZWRDb21wbGV0ZSk7XG4gICAgICAgIHRvUmVzb2x2ZS5kZWxldGUodGhpcyk7XG4gICAgfVxuICAgIGNhbmNlbCgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IFwic2NoZWR1bGVkXCIpIHtcbiAgICAgICAgICAgIHRvUmVzb2x2ZS5kZWxldGUodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gXCJwZW5kaW5nXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVzdW1lKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gXCJwZW5kaW5nXCIpXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlUmVzb2x2ZSgpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgS2V5ZnJhbWVSZXNvbHZlciwgZmx1c2hLZXlmcmFtZVJlc29sdmVycyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9S2V5ZnJhbWVzUmVzb2x2ZXIubWpzLm1hcFxuIiwiY29uc3QgaXNDU1NWYXIgPSAobmFtZSkgPT4gbmFtZS5zdGFydHNXaXRoKFwiLS1cIik7XG5cbmV4cG9ydCB7IGlzQ1NTVmFyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pcy1jc3MtdmFyLm1qcy5tYXBcbiIsImltcG9ydCB7IGlzQ1NTVmFyIH0gZnJvbSAnLi9pcy1jc3MtdmFyLm1qcyc7XG5cbmZ1bmN0aW9uIHNldFN0eWxlKGVsZW1lbnQsIG5hbWUsIHZhbHVlKSB7XG4gICAgaXNDU1NWYXIobmFtZSlcbiAgICAgICAgPyBlbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHZhbHVlKVxuICAgICAgICA6IChlbGVtZW50LnN0eWxlW25hbWVdID0gdmFsdWUpO1xufVxuXG5leHBvcnQgeyBzZXRTdHlsZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3R5bGUtc2V0Lm1qcy5tYXBcbiIsIi8qKlxuICogQWRkIHRoZSBhYmlsaXR5IGZvciB0ZXN0IHN1aXRlcyB0byBtYW51YWxseSBzZXQgc3VwcG9ydCBmbGFnc1xuICogdG8gYmV0dGVyIHRlc3QgbW9yZSBlbnZpcm9ubWVudHMuXG4gKi9cbmNvbnN0IHN1cHBvcnRzRmxhZ3MgPSB7fTtcblxuZXhwb3J0IHsgc3VwcG9ydHNGbGFncyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmxhZ3MubWpzLm1hcFxuIiwiaW1wb3J0IHsgbWVtbyB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBzdXBwb3J0c0ZsYWdzIH0gZnJvbSAnLi9mbGFncy5tanMnO1xuXG5mdW5jdGlvbiBtZW1vU3VwcG9ydHMoY2FsbGJhY2ssIHN1cHBvcnRzRmxhZykge1xuICAgIGNvbnN0IG1lbW9pemVkID0gbWVtbyhjYWxsYmFjayk7XG4gICAgcmV0dXJuICgpID0+IHN1cHBvcnRzRmxhZ3Nbc3VwcG9ydHNGbGFnXSA/PyBtZW1vaXplZCgpO1xufVxuXG5leHBvcnQgeyBtZW1vU3VwcG9ydHMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lbW8ubWpzLm1hcFxuIiwiaW1wb3J0IHsgbWVtb1N1cHBvcnRzIH0gZnJvbSAnLi9tZW1vLm1qcyc7XG5cbmNvbnN0IHN1cHBvcnRzU2Nyb2xsVGltZWxpbmUgPSAvKiBAX19QVVJFX18gKi8gbWVtb1N1cHBvcnRzKCgpID0+IHdpbmRvdy5TY3JvbGxUaW1lbGluZSAhPT0gdW5kZWZpbmVkLCBcInNjcm9sbFRpbWVsaW5lXCIpO1xuY29uc3Qgc3VwcG9ydHNWaWV3VGltZWxpbmUgPSAvKiBAX19QVVJFX18gKi8gbWVtb1N1cHBvcnRzKCgpID0+IHdpbmRvdy5WaWV3VGltZWxpbmUgIT09IHVuZGVmaW5lZCwgXCJ2aWV3VGltZWxpbmVcIik7XG5cbmV4cG9ydCB7IHN1cHBvcnRzU2Nyb2xsVGltZWxpbmUsIHN1cHBvcnRzVmlld1RpbWVsaW5lIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY3JvbGwtdGltZWxpbmUubWpzLm1hcFxuIiwiaW1wb3J0IHsgbWVtb1N1cHBvcnRzIH0gZnJvbSAnLi9tZW1vLm1qcyc7XG5cbmNvbnN0IHN1cHBvcnRzTGluZWFyRWFzaW5nID0gLypAX19QVVJFX18qLyBtZW1vU3VwcG9ydHMoKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGRvY3VtZW50XG4gICAgICAgICAgICAuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgICAgICAgLmFuaW1hdGUoeyBvcGFjaXR5OiAwIH0sIHsgZWFzaW5nOiBcImxpbmVhcigwLCAxKVwiIH0pO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufSwgXCJsaW5lYXJFYXNpbmdcIik7XG5cbmV4cG9ydCB7IHN1cHBvcnRzTGluZWFyRWFzaW5nIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1saW5lYXItZWFzaW5nLm1qcy5tYXBcbiIsImNvbnN0IGN1YmljQmV6aWVyQXNTdHJpbmcgPSAoW2EsIGIsIGMsIGRdKSA9PiBgY3ViaWMtYmV6aWVyKCR7YX0sICR7Yn0sICR7Y30sICR7ZH0pYDtcblxuZXhwb3J0IHsgY3ViaWNCZXppZXJBc1N0cmluZyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y3ViaWMtYmV6aWVyLm1qcy5tYXBcbiIsImltcG9ydCB7IGN1YmljQmV6aWVyQXNTdHJpbmcgfSBmcm9tICcuL2N1YmljLWJlemllci5tanMnO1xuXG5jb25zdCBzdXBwb3J0ZWRXYWFwaUVhc2luZyA9IHtcbiAgICBsaW5lYXI6IFwibGluZWFyXCIsXG4gICAgZWFzZTogXCJlYXNlXCIsXG4gICAgZWFzZUluOiBcImVhc2UtaW5cIixcbiAgICBlYXNlT3V0OiBcImVhc2Utb3V0XCIsXG4gICAgZWFzZUluT3V0OiBcImVhc2UtaW4tb3V0XCIsXG4gICAgY2lyY0luOiAvKkBfX1BVUkVfXyovIGN1YmljQmV6aWVyQXNTdHJpbmcoWzAsIDAuNjUsIDAuNTUsIDFdKSxcbiAgICBjaXJjT3V0OiAvKkBfX1BVUkVfXyovIGN1YmljQmV6aWVyQXNTdHJpbmcoWzAuNTUsIDAsIDEsIDAuNDVdKSxcbiAgICBiYWNrSW46IC8qQF9fUFVSRV9fKi8gY3ViaWNCZXppZXJBc1N0cmluZyhbMC4zMSwgMC4wMSwgMC42NiwgLTAuNTldKSxcbiAgICBiYWNrT3V0OiAvKkBfX1BVUkVfXyovIGN1YmljQmV6aWVyQXNTdHJpbmcoWzAuMzMsIDEuNTMsIDAuNjksIDAuOTldKSxcbn07XG5cbmV4cG9ydCB7IHN1cHBvcnRlZFdhYXBpRWFzaW5nIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdXBwb3J0ZWQubWpzLm1hcFxuIiwiaW1wb3J0IHsgaXNCZXppZXJEZWZpbml0aW9uIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcbmltcG9ydCB7IHN1cHBvcnRzTGluZWFyRWFzaW5nIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvc3VwcG9ydHMvbGluZWFyLWVhc2luZy5tanMnO1xuaW1wb3J0IHsgZ2VuZXJhdGVMaW5lYXJFYXNpbmcgfSBmcm9tICcuLi91dGlscy9saW5lYXIubWpzJztcbmltcG9ydCB7IGN1YmljQmV6aWVyQXNTdHJpbmcgfSBmcm9tICcuL2N1YmljLWJlemllci5tanMnO1xuaW1wb3J0IHsgc3VwcG9ydGVkV2FhcGlFYXNpbmcgfSBmcm9tICcuL3N1cHBvcnRlZC5tanMnO1xuXG5mdW5jdGlvbiBtYXBFYXNpbmdUb05hdGl2ZUVhc2luZyhlYXNpbmcsIGR1cmF0aW9uKSB7XG4gICAgaWYgKCFlYXNpbmcpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGVhc2luZyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBzdXBwb3J0c0xpbmVhckVhc2luZygpXG4gICAgICAgICAgICA/IGdlbmVyYXRlTGluZWFyRWFzaW5nKGVhc2luZywgZHVyYXRpb24pXG4gICAgICAgICAgICA6IFwiZWFzZS1vdXRcIjtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNCZXppZXJEZWZpbml0aW9uKGVhc2luZykpIHtcbiAgICAgICAgcmV0dXJuIGN1YmljQmV6aWVyQXNTdHJpbmcoZWFzaW5nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShlYXNpbmcpKSB7XG4gICAgICAgIHJldHVybiBlYXNpbmcubWFwKChzZWdtZW50RWFzaW5nKSA9PiBtYXBFYXNpbmdUb05hdGl2ZUVhc2luZyhzZWdtZW50RWFzaW5nLCBkdXJhdGlvbikgfHxcbiAgICAgICAgICAgIHN1cHBvcnRlZFdhYXBpRWFzaW5nLmVhc2VPdXQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN1cHBvcnRlZFdhYXBpRWFzaW5nW2Vhc2luZ107XG4gICAgfVxufVxuXG5leHBvcnQgeyBtYXBFYXNpbmdUb05hdGl2ZUVhc2luZyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFwLWVhc2luZy5tanMubWFwXG4iLCJpbXBvcnQgeyBhY3RpdmVBbmltYXRpb25zIH0gZnJvbSAnLi4vLi4vc3RhdHMvYW5pbWF0aW9uLWNvdW50Lm1qcyc7XG5pbXBvcnQgeyBzdGF0c0J1ZmZlciB9IGZyb20gJy4uLy4uL3N0YXRzL2J1ZmZlci5tanMnO1xuaW1wb3J0IHsgbWFwRWFzaW5nVG9OYXRpdmVFYXNpbmcgfSBmcm9tICcuL2Vhc2luZy9tYXAtZWFzaW5nLm1qcyc7XG5cbmZ1bmN0aW9uIHN0YXJ0V2FhcGlBbmltYXRpb24oZWxlbWVudCwgdmFsdWVOYW1lLCBrZXlmcmFtZXMsIHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgcmVwZWF0ID0gMCwgcmVwZWF0VHlwZSA9IFwibG9vcFwiLCBlYXNlID0gXCJlYXNlT3V0XCIsIHRpbWVzLCB9ID0ge30sIHBzZXVkb0VsZW1lbnQgPSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBrZXlmcmFtZU9wdGlvbnMgPSB7XG4gICAgICAgIFt2YWx1ZU5hbWVdOiBrZXlmcmFtZXMsXG4gICAgfTtcbiAgICBpZiAodGltZXMpXG4gICAgICAgIGtleWZyYW1lT3B0aW9ucy5vZmZzZXQgPSB0aW1lcztcbiAgICBjb25zdCBlYXNpbmcgPSBtYXBFYXNpbmdUb05hdGl2ZUVhc2luZyhlYXNlLCBkdXJhdGlvbik7XG4gICAgLyoqXG4gICAgICogSWYgdGhpcyBpcyBhbiBlYXNpbmcgYXJyYXksIGFwcGx5IHRvIGtleWZyYW1lcywgbm90IGFuaW1hdGlvbiBhcyBhIHdob2xlXG4gICAgICovXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZWFzaW5nKSlcbiAgICAgICAga2V5ZnJhbWVPcHRpb25zLmVhc2luZyA9IGVhc2luZztcbiAgICBpZiAoc3RhdHNCdWZmZXIudmFsdWUpIHtcbiAgICAgICAgYWN0aXZlQW5pbWF0aW9ucy53YWFwaSsrO1xuICAgIH1cbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICBkZWxheSxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIGVhc2luZzogIUFycmF5LmlzQXJyYXkoZWFzaW5nKSA/IGVhc2luZyA6IFwibGluZWFyXCIsXG4gICAgICAgIGZpbGw6IFwiYm90aFwiLFxuICAgICAgICBpdGVyYXRpb25zOiByZXBlYXQgKyAxLFxuICAgICAgICBkaXJlY3Rpb246IHJlcGVhdFR5cGUgPT09IFwicmV2ZXJzZVwiID8gXCJhbHRlcm5hdGVcIiA6IFwibm9ybWFsXCIsXG4gICAgfTtcbiAgICBpZiAocHNldWRvRWxlbWVudClcbiAgICAgICAgb3B0aW9ucy5wc2V1ZG9FbGVtZW50ID0gcHNldWRvRWxlbWVudDtcbiAgICBjb25zdCBhbmltYXRpb24gPSBlbGVtZW50LmFuaW1hdGUoa2V5ZnJhbWVPcHRpb25zLCBvcHRpb25zKTtcbiAgICBpZiAoc3RhdHNCdWZmZXIudmFsdWUpIHtcbiAgICAgICAgYW5pbWF0aW9uLmZpbmlzaGVkLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICAgICAgYWN0aXZlQW5pbWF0aW9ucy53YWFwaS0tO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGFuaW1hdGlvbjtcbn1cblxuZXhwb3J0IHsgc3RhcnRXYWFwaUFuaW1hdGlvbiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RhcnQtd2FhcGktYW5pbWF0aW9uLm1qcy5tYXBcbiIsImZ1bmN0aW9uIGlzR2VuZXJhdG9yKHR5cGUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHR5cGUgPT09IFwiZnVuY3Rpb25cIiAmJiBcImFwcGx5VG9PcHRpb25zXCIgaW4gdHlwZTtcbn1cblxuZXhwb3J0IHsgaXNHZW5lcmF0b3IgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzLWdlbmVyYXRvci5tanMubWFwXG4iLCJpbXBvcnQgeyBzdXBwb3J0c0xpbmVhckVhc2luZyB9IGZyb20gJy4uLy4uLy4uL3V0aWxzL3N1cHBvcnRzL2xpbmVhci1lYXNpbmcubWpzJztcbmltcG9ydCB7IGlzR2VuZXJhdG9yIH0gZnJvbSAnLi4vLi4vZ2VuZXJhdG9ycy91dGlscy9pcy1nZW5lcmF0b3IubWpzJztcblxuZnVuY3Rpb24gYXBwbHlHZW5lcmF0b3JPcHRpb25zKHsgdHlwZSwgLi4ub3B0aW9ucyB9KSB7XG4gICAgaWYgKGlzR2VuZXJhdG9yKHR5cGUpICYmIHN1cHBvcnRzTGluZWFyRWFzaW5nKCkpIHtcbiAgICAgICAgcmV0dXJuIHR5cGUuYXBwbHlUb09wdGlvbnMob3B0aW9ucyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvcHRpb25zLmR1cmF0aW9uID8/IChvcHRpb25zLmR1cmF0aW9uID0gMzAwKTtcbiAgICAgICAgb3B0aW9ucy5lYXNlID8/IChvcHRpb25zLmVhc2UgPSBcImVhc2VPdXRcIik7XG4gICAgfVxuICAgIHJldHVybiBvcHRpb25zO1xufVxuXG5leHBvcnQgeyBhcHBseUdlbmVyYXRvck9wdGlvbnMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcGx5LWdlbmVyYXRvci5tanMubWFwXG4iLCJpbXBvcnQgeyBpbnZhcmlhbnQsIG1pbGxpc2Vjb25kc1RvU2Vjb25kcywgc2Vjb25kc1RvTWlsbGlzZWNvbmRzLCBub29wIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcbmltcG9ydCB7IHNldFN0eWxlIH0gZnJvbSAnLi4vcmVuZGVyL2RvbS9zdHlsZS1zZXQubWpzJztcbmltcG9ydCB7IHN1cHBvcnRzU2Nyb2xsVGltZWxpbmUgfSBmcm9tICcuLi91dGlscy9zdXBwb3J0cy9zY3JvbGwtdGltZWxpbmUubWpzJztcbmltcG9ydCB7IGdldEZpbmFsS2V5ZnJhbWUgfSBmcm9tICcuL2tleWZyYW1lcy9nZXQtZmluYWwubWpzJztcbmltcG9ydCB7IFdpdGhQcm9taXNlIH0gZnJvbSAnLi91dGlscy9XaXRoUHJvbWlzZS5tanMnO1xuaW1wb3J0IHsgc3RhcnRXYWFwaUFuaW1hdGlvbiB9IGZyb20gJy4vd2FhcGkvc3RhcnQtd2FhcGktYW5pbWF0aW9uLm1qcyc7XG5pbXBvcnQgeyBhcHBseUdlbmVyYXRvck9wdGlvbnMgfSBmcm9tICcuL3dhYXBpL3V0aWxzL2FwcGx5LWdlbmVyYXRvci5tanMnO1xuXG4vKipcbiAqIE5hdGl2ZUFuaW1hdGlvbiBpbXBsZW1lbnRzIEFuaW1hdGlvblBsYXliYWNrQ29udHJvbHMgZm9yIHRoZSBicm93c2VyJ3MgV2ViIEFuaW1hdGlvbnMgQVBJLlxuICovXG5jbGFzcyBOYXRpdmVBbmltYXRpb24gZXh0ZW5kcyBXaXRoUHJvbWlzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmZpbmlzaGVkVGltZSA9IG51bGw7XG4gICAgICAgIHRoaXMuaXNTdG9wcGVkID0gZmFsc2U7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUcmFja3MgYSBtYW51YWxseS1zZXQgc3RhcnQgdGltZSB0aGF0IHRha2VzIHByZWNlZGVuY2Ugb3ZlciBXQUFQSSdzXG4gICAgICAgICAqIGR5bmFtaWMgc3RhcnRUaW1lLiBUaGlzIGlzIGNsZWFyZWQgd2hlbiBwbGF5KCkgb3IgdGltZSBzZXR0ZXIgaXMgY2FsbGVkLFxuICAgICAgICAgKiBhbGxvd2luZyBXQUFQSSB0byB0YWtlIG92ZXIgdGltaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5tYW51YWxTdGFydFRpbWUgPSBudWxsO1xuICAgICAgICBpZiAoIW9wdGlvbnMpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNvbnN0IHsgZWxlbWVudCwgbmFtZSwga2V5ZnJhbWVzLCBwc2V1ZG9FbGVtZW50LCBhbGxvd0ZsYXR0ZW4gPSBmYWxzZSwgZmluYWxLZXlmcmFtZSwgb25Db21wbGV0ZSwgfSA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuaXNQc2V1ZG9FbGVtZW50ID0gQm9vbGVhbihwc2V1ZG9FbGVtZW50KTtcbiAgICAgICAgdGhpcy5hbGxvd0ZsYXR0ZW4gPSBhbGxvd0ZsYXR0ZW47XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIGludmFyaWFudCh0eXBlb2Ygb3B0aW9ucy50eXBlICE9PSBcInN0cmluZ1wiLCBgTWluaSBhbmltYXRlKCkgZG9lc24ndCBzdXBwb3J0IFwidHlwZVwiIGFzIGEgc3RyaW5nLmAsIFwibWluaS1zcHJpbmdcIik7XG4gICAgICAgIGNvbnN0IHRyYW5zaXRpb24gPSBhcHBseUdlbmVyYXRvck9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uID0gc3RhcnRXYWFwaUFuaW1hdGlvbihlbGVtZW50LCBuYW1lLCBrZXlmcmFtZXMsIHRyYW5zaXRpb24sIHBzZXVkb0VsZW1lbnQpO1xuICAgICAgICBpZiAodHJhbnNpdGlvbi5hdXRvcGxheSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLnBhdXNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbmltYXRpb24ub25maW5pc2ggPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaGVkVGltZSA9IHRoaXMudGltZTtcbiAgICAgICAgICAgIGlmICghcHNldWRvRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleWZyYW1lID0gZ2V0RmluYWxLZXlmcmFtZShrZXlmcmFtZXMsIHRoaXMub3B0aW9ucywgZmluYWxLZXlmcmFtZSwgdGhpcy5zcGVlZCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudXBkYXRlTW90aW9uVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVNb3Rpb25WYWx1ZShrZXlmcmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElmIHdlIGNhbiwgd2Ugd2FudCB0byBjb21taXQgdGhlIGZpbmFsIHN0eWxlIGFzIHNldCBieSB0aGUgdXNlcixcbiAgICAgICAgICAgICAgICAgKiByYXRoZXIgdGhhbiB0aGUgY29tcHV0ZWQga2V5ZnJhbWUgdmFsdWUgc3VwcGxpZWQgYnkgdGhlIGFuaW1hdGlvbi5cbiAgICAgICAgICAgICAgICAgKiBXZSBhbHdheXMgZG8gdGhpcywgZXZlbiB3aGVuIGEgbW90aW9uIHZhbHVlIGlzIHByZXNlbnQsIHRvIHByZXZlbnRcbiAgICAgICAgICAgICAgICAgKiBhIHZpc3VhbCBmbGFzaCBpbiBGaXJlZm94IHdoZXJlIHRoZSBXQUFQSSBhbmltYXRpb24ncyBmaWxsIGlzIHJlbW92ZWRcbiAgICAgICAgICAgICAgICAgKiBkdXJpbmcgY2FuY2VsKCkgYmVmb3JlIHRoZSBzY2hlZHVsZWQgcmVuZGVyIGNhbiBhcHBseSB0aGUgY29ycmVjdCB2YWx1ZS5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBzZXRTdHlsZShlbGVtZW50LCBuYW1lLCBrZXlmcmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb24uY2FuY2VsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvbkNvbXBsZXRlPy4oKTtcbiAgICAgICAgICAgIHRoaXMubm90aWZ5RmluaXNoZWQoKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcGxheSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdG9wcGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLm1hbnVhbFN0YXJ0VGltZSA9IG51bGw7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uLnBsYXkoKTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IFwiZmluaXNoZWRcIikge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVGaW5pc2hlZCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHBhdXNlKCkge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbi5wYXVzZSgpO1xuICAgIH1cbiAgICBjb21wbGV0ZSgpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb24uZmluaXNoPy4oKTtcbiAgICB9XG4gICAgY2FuY2VsKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24uY2FuY2VsKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHsgfVxuICAgIH1cbiAgICBzdG9wKCkge1xuICAgICAgICBpZiAodGhpcy5pc1N0b3BwZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgeyBzdGF0ZSB9ID0gdGhpcztcbiAgICAgICAgaWYgKHN0YXRlID09PSBcImlkbGVcIiB8fCBzdGF0ZSA9PT0gXCJmaW5pc2hlZFwiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudXBkYXRlTW90aW9uVmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTW90aW9uVmFsdWUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29tbWl0U3R5bGVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmlzUHNldWRvRWxlbWVudClcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFdBQVBJIGRvZXNuJ3QgbmF0aXZlbHkgaGF2ZSBhbnkgaW50ZXJydXB0aW9uIGNhcGFiaWxpdGllcy5cbiAgICAgKlxuICAgICAqIEluIHRoaXMgbWV0aG9kLCB3ZSBjb21taXQgc3R5bGVzIGJhY2sgdG8gdGhlIERPTSBiZWZvcmUgY2FuY2VsbGluZ1xuICAgICAqIHRoZSBhbmltYXRpb24uXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIGRlc2lnbmVkIHRvIGJlIG92ZXJyaWRkZW4gYnkgTmF0aXZlQW5pbWF0aW9uRXh0ZW5kZWQsIHdoaWNoXG4gICAgICogd2lsbCBjcmVhdGUgYSByZW5kZXJsZXNzIEpTIGFuaW1hdGlvbiBhbmQgc2FtcGxlIGl0IHR3aWNlIHRvIGNhbGN1bGF0ZVxuICAgICAqIGl0cyBjdXJyZW50IHZhbHVlLCBcInByZXZpb3VzXCIgdmFsdWUsIGFuZCB0aGVyZWZvcmUgYWxsb3dcbiAgICAgKiBNb3Rpb24gdG8gYWxzbyBjb3JyZWN0bHkgY2FsY3VsYXRlIHZlbG9jaXR5IGZvciBhbnkgc3Vic2VxdWVudCBhbmltYXRpb25cbiAgICAgKiB3aGlsZSBkZWZlcnJpbmcgdGhlIGNvbW1pdCB1bnRpbCB0aGUgbmV4dCBhbmltYXRpb24gZnJhbWUuXG4gICAgICovXG4gICAgY29tbWl0U3R5bGVzKCkge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5vcHRpb25zPy5lbGVtZW50O1xuICAgICAgICBpZiAoIXRoaXMuaXNQc2V1ZG9FbGVtZW50ICYmIGVsZW1lbnQ/LmlzQ29ubmVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5jb21taXRTdHlsZXM/LigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBkdXJhdGlvbigpIHtcbiAgICAgICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLmFuaW1hdGlvbi5lZmZlY3Q/LmdldENvbXB1dGVkVGltaW5nPy4oKS5kdXJhdGlvbiB8fCAwO1xuICAgICAgICByZXR1cm4gbWlsbGlzZWNvbmRzVG9TZWNvbmRzKE51bWJlcihkdXJhdGlvbikpO1xuICAgIH1cbiAgICBnZXQgaXRlcmF0aW9uRHVyYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwIH0gPSB0aGlzLm9wdGlvbnMgfHwge307XG4gICAgICAgIHJldHVybiB0aGlzLmR1cmF0aW9uICsgbWlsbGlzZWNvbmRzVG9TZWNvbmRzKGRlbGF5KTtcbiAgICB9XG4gICAgZ2V0IHRpbWUoKSB7XG4gICAgICAgIHJldHVybiBtaWxsaXNlY29uZHNUb1NlY29uZHMoTnVtYmVyKHRoaXMuYW5pbWF0aW9uLmN1cnJlbnRUaW1lKSB8fCAwKTtcbiAgICB9XG4gICAgc2V0IHRpbWUobmV3VGltZSkge1xuICAgICAgICBjb25zdCB3YXNGaW5pc2hlZCA9IHRoaXMuZmluaXNoZWRUaW1lICE9PSBudWxsO1xuICAgICAgICB0aGlzLm1hbnVhbFN0YXJ0VGltZSA9IG51bGw7XG4gICAgICAgIHRoaXMuZmluaXNoZWRUaW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpb24uY3VycmVudFRpbWUgPSBzZWNvbmRzVG9NaWxsaXNlY29uZHMobmV3VGltZSk7XG4gICAgICAgIGlmICh3YXNGaW5pc2hlZCkge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24ucGF1c2UoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGUgcGxheWJhY2sgc3BlZWQgb2YgdGhlIGFuaW1hdGlvbi5cbiAgICAgKiAxID0gbm9ybWFsIHNwZWVkLCAyID0gZG91YmxlIHNwZWVkLCAwLjUgPSBoYWxmIHNwZWVkLlxuICAgICAqL1xuICAgIGdldCBzcGVlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5pbWF0aW9uLnBsYXliYWNrUmF0ZTtcbiAgICB9XG4gICAgc2V0IHNwZWVkKG5ld1NwZWVkKSB7XG4gICAgICAgIC8vIEFsbG93IGJhY2t3YXJkcyBwbGF5YmFjayBhZnRlciBmaW5pc2hpbmdcbiAgICAgICAgaWYgKG5ld1NwZWVkIDwgMClcbiAgICAgICAgICAgIHRoaXMuZmluaXNoZWRUaW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpb24ucGxheWJhY2tSYXRlID0gbmV3U3BlZWQ7XG4gICAgfVxuICAgIGdldCBzdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoZWRUaW1lICE9PSBudWxsXG4gICAgICAgICAgICA/IFwiZmluaXNoZWRcIlxuICAgICAgICAgICAgOiB0aGlzLmFuaW1hdGlvbi5wbGF5U3RhdGU7XG4gICAgfVxuICAgIGdldCBzdGFydFRpbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hbnVhbFN0YXJ0VGltZSA/PyBOdW1iZXIodGhpcy5hbmltYXRpb24uc3RhcnRUaW1lKTtcbiAgICB9XG4gICAgc2V0IHN0YXJ0VGltZShuZXdTdGFydFRpbWUpIHtcbiAgICAgICAgdGhpcy5tYW51YWxTdGFydFRpbWUgPSB0aGlzLmFuaW1hdGlvbi5zdGFydFRpbWUgPSBuZXdTdGFydFRpbWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEF0dGFjaGVzIGEgdGltZWxpbmUgdG8gdGhlIGFuaW1hdGlvbiwgZm9yIGluc3RhbmNlIHRoZSBgU2Nyb2xsVGltZWxpbmVgLlxuICAgICAqL1xuICAgIGF0dGFjaFRpbWVsaW5lKHsgdGltZWxpbmUsIHJhbmdlU3RhcnQsIHJhbmdlRW5kLCBvYnNlcnZlLCB9KSB7XG4gICAgICAgIGlmICh0aGlzLmFsbG93RmxhdHRlbikge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24uZWZmZWN0Py51cGRhdGVUaW1pbmcoeyBlYXNpbmc6IFwibGluZWFyXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbmltYXRpb24ub25maW5pc2ggPSBudWxsO1xuICAgICAgICBpZiAodGltZWxpbmUgJiYgc3VwcG9ydHNTY3JvbGxUaW1lbGluZSgpKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi50aW1lbGluZSA9IHRpbWVsaW5lO1xuICAgICAgICAgICAgaWYgKHJhbmdlU3RhcnQpXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb24ucmFuZ2VTdGFydCA9IHJhbmdlU3RhcnQ7XG4gICAgICAgICAgICBpZiAocmFuZ2VFbmQpXG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb24ucmFuZ2VFbmQgPSByYW5nZUVuZDtcbiAgICAgICAgICAgIHJldHVybiBub29wO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG9ic2VydmUodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7IE5hdGl2ZUFuaW1hdGlvbiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TmF0aXZlQW5pbWF0aW9uLm1qcy5tYXBcbiIsImltcG9ydCB7IGNpcmNJbk91dCwgYmFja0luT3V0LCBhbnRpY2lwYXRlIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcblxuY29uc3QgdW5zdXBwb3J0ZWRFYXNpbmdGdW5jdGlvbnMgPSB7XG4gICAgYW50aWNpcGF0ZSxcbiAgICBiYWNrSW5PdXQsXG4gICAgY2lyY0luT3V0LFxufTtcbmZ1bmN0aW9uIGlzVW5zdXBwb3J0ZWRFYXNlKGtleSkge1xuICAgIHJldHVybiBrZXkgaW4gdW5zdXBwb3J0ZWRFYXNpbmdGdW5jdGlvbnM7XG59XG5mdW5jdGlvbiByZXBsYWNlU3RyaW5nRWFzaW5nKHRyYW5zaXRpb24pIHtcbiAgICBpZiAodHlwZW9mIHRyYW5zaXRpb24uZWFzZSA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICBpc1Vuc3VwcG9ydGVkRWFzZSh0cmFuc2l0aW9uLmVhc2UpKSB7XG4gICAgICAgIHRyYW5zaXRpb24uZWFzZSA9IHVuc3VwcG9ydGVkRWFzaW5nRnVuY3Rpb25zW3RyYW5zaXRpb24uZWFzZV07XG4gICAgfVxufVxuXG5leHBvcnQgeyByZXBsYWNlU3RyaW5nRWFzaW5nIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD11bnN1cHBvcnRlZC1lYXNpbmcubWpzLm1hcFxuIiwiaW1wb3J0IHsgY2xhbXAgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgdGltZSB9IGZyb20gJy4uL2ZyYW1lbG9vcC9zeW5jLXRpbWUubWpzJztcbmltcG9ydCB7IHNldFN0eWxlIH0gZnJvbSAnLi4vcmVuZGVyL2RvbS9zdHlsZS1zZXQubWpzJztcbmltcG9ydCB7IEpTQW5pbWF0aW9uIH0gZnJvbSAnLi9KU0FuaW1hdGlvbi5tanMnO1xuaW1wb3J0IHsgTmF0aXZlQW5pbWF0aW9uIH0gZnJvbSAnLi9OYXRpdmVBbmltYXRpb24ubWpzJztcbmltcG9ydCB7IHJlcGxhY2VUcmFuc2l0aW9uVHlwZSB9IGZyb20gJy4vdXRpbHMvcmVwbGFjZS10cmFuc2l0aW9uLXR5cGUubWpzJztcbmltcG9ydCB7IHJlcGxhY2VTdHJpbmdFYXNpbmcgfSBmcm9tICcuL3dhYXBpL3V0aWxzL3Vuc3VwcG9ydGVkLWVhc2luZy5tanMnO1xuXG4vKipcbiAqIDEwbXMgaXMgY2hvc2VuIGhlcmUgYXMgaXQgc3RyaWtlcyBhIGJhbGFuY2UgYmV0d2VlbiBzbW9vdGhcbiAqIHJlc3VsdHMgKG1vcmUgdGhhbiBvbmUga2V5ZnJhbWUgcGVyIGZyYW1lIGF0IDYwZnBzKSBhbmRcbiAqIGtleWZyYW1lIHF1YW50aXR5LlxuICovXG5jb25zdCBzYW1wbGVEZWx0YSA9IDEwOyAvL21zXG5jbGFzcyBOYXRpdmVBbmltYXRpb25FeHRlbmRlZCBleHRlbmRzIE5hdGl2ZUFuaW1hdGlvbiB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGJhc2UgTmF0aXZlQW5pbWF0aW9uIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgYSBzdWJzZXRcbiAgICAgICAgICogb2YgTW90aW9uIGVhc2luZ3MsIGFuZCBXQUFQSSBhbHNvIG9ubHkgc3VwcG9ydHMgc29tZVxuICAgICAgICAgKiBlYXNpbmcgZnVuY3Rpb25zIHZpYSBzdHJpbmcvY3ViaWMtYmV6aWVyIGRlZmluaXRpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGZ1bmN0aW9uIHJlcGxhY2VzIHRob3NlIHVuc3VwcG9ydGVkIGVhc2luZyBmdW5jdGlvbnNcbiAgICAgICAgICogd2l0aCBhIEpTIGVhc2luZyBmdW5jdGlvbi4gVGhpcyB3aWxsIGxhdGVyIGdldCBjb21waWxlZFxuICAgICAgICAgKiB0byBhIGxpbmVhcigpIGVhc2luZyBmdW5jdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIHJlcGxhY2VTdHJpbmdFYXNpbmcob3B0aW9ucyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFbnN1cmUgd2UgcmVwbGFjZSB0aGUgdHJhbnNpdGlvbiB0eXBlIHdpdGggYSBnZW5lcmF0b3IgZnVuY3Rpb25cbiAgICAgICAgICogYmVmb3JlIHBhc3NpbmcgdG8gV0FBUEkuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRPRE86IERvZXMgdGhpcyBoYXZlIGEgYmV0dGVyIGhvbWU/IEl0IGNvdWxkIGJlIHNoYXJlZCB3aXRoXG4gICAgICAgICAqIEpTQW5pbWF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVwbGFjZVRyYW5zaXRpb25UeXBlKG9wdGlvbnMpO1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9ubHkgc2V0IHN0YXJ0VGltZSB3aGVuIHRoZSBhbmltYXRpb24gc2hvdWxkIGF1dG9wbGF5LlxuICAgICAgICAgKiBTZXR0aW5nIHN0YXJ0VGltZSBvbiBhIHBhdXNlZCBXQUFQSSBhbmltYXRpb24gdW5wYXVzZXMgaXRcbiAgICAgICAgICogKHBlciB0aGUgV0FBUEkgc3BlYyksIHdoaWNoIGJyZWFrcyBhdXRvcGxheTogZmFsc2UuXG4gICAgICAgICAqL1xuICAgICAgICBpZiAob3B0aW9ucy5zdGFydFRpbWUgIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLmF1dG9wbGF5ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBvcHRpb25zLnN0YXJ0VGltZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBXQUFQSSBkb2Vzbid0IG5hdGl2ZWx5IGhhdmUgYW55IGludGVycnVwdGlvbiBjYXBhYmlsaXRpZXMuXG4gICAgICpcbiAgICAgKiBSYXRoZXIgdGhhbiByZWFkIGNvbW1pdHRlZCBzdHlsZXMgYmFjayBvdXQgb2YgdGhlIERPTSwgd2UgY2FuXG4gICAgICogY3JlYXRlIGEgcmVuZGVybGVzcyBKUyBhbmltYXRpb24gYW5kIHNhbXBsZSBpdCB0d2ljZSB0byBjYWxjdWxhdGVcbiAgICAgKiBpdHMgY3VycmVudCB2YWx1ZSwgXCJwcmV2aW91c1wiIHZhbHVlLCBhbmQgdGhlcmVmb3JlIGFsbG93XG4gICAgICogTW90aW9uIHRvIGNhbGN1bGF0ZSB2ZWxvY2l0eSBmb3IgYW55IHN1YnNlcXVlbnQgYW5pbWF0aW9uLlxuICAgICAqL1xuICAgIHVwZGF0ZU1vdGlvblZhbHVlKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHsgbW90aW9uVmFsdWUsIG9uVXBkYXRlLCBvbkNvbXBsZXRlLCBlbGVtZW50LCAuLi5vcHRpb25zIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIGlmICghbW90aW9uVmFsdWUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBtb3Rpb25WYWx1ZS5zZXQodmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNhbXBsZUFuaW1hdGlvbiA9IG5ldyBKU0FuaW1hdGlvbih7XG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgYXV0b3BsYXk6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVzZSB3YWxsLWNsb2NrIGVsYXBzZWQgdGltZSBmb3Igc2FtcGxpbmcuXG4gICAgICAgICAqIFVuZGVyIENQVSBsb2FkLCBXQUFQSSdzIGN1cnJlbnRUaW1lIG1heSBub3QgcmVmbGVjdCBhY3R1YWxcbiAgICAgICAgICogZWxhcHNlZCB0aW1lLCBjYXVzaW5nIGluY29ycmVjdCBzYW1wbGluZyBhbmQgdmlzdWFsIGp1bXBzLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgc2FtcGxlVGltZSA9IE1hdGgubWF4KHNhbXBsZURlbHRhLCB0aW1lLm5vdygpIC0gdGhpcy5zdGFydFRpbWUpO1xuICAgICAgICBjb25zdCBkZWx0YSA9IGNsYW1wKDAsIHNhbXBsZURlbHRhLCBzYW1wbGVUaW1lIC0gc2FtcGxlRGVsdGEpO1xuICAgICAgICBjb25zdCBjdXJyZW50ID0gc2FtcGxlQW5pbWF0aW9uLnNhbXBsZShzYW1wbGVUaW1lKS52YWx1ZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdyaXRlIHRoZSBlc3RpbWF0ZWQgdmFsdWUgdG8gaW5saW5lIHN0eWxlIHNvIGl0IHBlcnNpc3RzXG4gICAgICAgICAqIGFmdGVyIGNhbmNlbCgpLCBjb3ZlcmluZyB0aGUgYXN5bmMgZ2FwIGJlZm9yZSB0aGUgbmV4dFxuICAgICAgICAgKiBhbmltYXRpb24gc3RhcnRzLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgeyBuYW1lIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIGlmIChlbGVtZW50ICYmIG5hbWUpXG4gICAgICAgICAgICBzZXRTdHlsZShlbGVtZW50LCBuYW1lLCBjdXJyZW50KTtcbiAgICAgICAgbW90aW9uVmFsdWUuc2V0V2l0aFZlbG9jaXR5KHNhbXBsZUFuaW1hdGlvbi5zYW1wbGUoTWF0aC5tYXgoMCwgc2FtcGxlVGltZSAtIGRlbHRhKSkudmFsdWUsIGN1cnJlbnQsIGRlbHRhKTtcbiAgICAgICAgc2FtcGxlQW5pbWF0aW9uLnN0b3AoKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IE5hdGl2ZUFuaW1hdGlvbkV4dGVuZGVkIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1OYXRpdmVBbmltYXRpb25FeHRlbmRlZC5tanMubWFwXG4iLCJpbXBvcnQgeyBjb21wbGV4IH0gZnJvbSAnLi4vLi4vdmFsdWUvdHlwZXMvY29tcGxleC9pbmRleC5tanMnO1xuXG4vKipcbiAqIENoZWNrIGlmIGEgdmFsdWUgaXMgYW5pbWF0YWJsZS4gRXhhbXBsZXM6XG4gKlxuICog4pyFOiAxMDAsIFwiMTAwcHhcIiwgXCIjZmZmXCJcbiAqIOKdjDogXCJibG9ja1wiLCBcInVybCgyLmpwZylcIlxuICogQHBhcmFtIHZhbHVlXG4gKlxuICogQGludGVybmFsXG4gKi9cbmNvbnN0IGlzQW5pbWF0YWJsZSA9ICh2YWx1ZSwgbmFtZSkgPT4ge1xuICAgIC8vIElmIHRoZSBsaXN0IG9mIGtleXMgdGhhdCBtaWdodCBiZSBub24tYW5pbWF0YWJsZSBncm93cywgcmVwbGFjZSB3aXRoIFNldFxuICAgIGlmIChuYW1lID09PSBcInpJbmRleFwiKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgLy8gSWYgaXQncyBhIG51bWJlciBvciBhIGtleWZyYW1lcyBhcnJheSwgd2UgY2FuIGFuaW1hdGUgaXQuIFdlIG1pZ2h0IGF0IHNvbWUgcG9pbnRcbiAgICAvLyBuZWVkIHRvIGRvIGEgZGVlcCBpc0FuaW1hdGFibGUgY2hlY2sgb2Yga2V5ZnJhbWVzLCBvciBsZXQgUG9wbW90aW9uIGhhbmRsZSB0aGlzLFxuICAgIC8vIGJ1dCBmb3Igbm93IGxldHMgbGVhdmUgaXQgbGlrZSB0aGlzIGZvciBwZXJmb3JtYW5jZSByZWFzb25zXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIiB8fCBBcnJheS5pc0FycmF5KHZhbHVlKSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiAvLyBJdCdzIGFuaW1hdGFibGUgaWYgd2UgaGF2ZSBhIHN0cmluZ1xuICAgICAgICAoY29tcGxleC50ZXN0KHZhbHVlKSB8fCB2YWx1ZSA9PT0gXCIwXCIpICYmIC8vIEFuZCBpdCBjb250YWlucyBudW1iZXJzIGFuZC9vciBjb2xvcnNcbiAgICAgICAgIXZhbHVlLnN0YXJ0c1dpdGgoXCJ1cmwoXCIpIC8vIFVubGVzcyBpdCBzdGFydHMgd2l0aCBcInVybChcIlxuICAgICkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuZXhwb3J0IHsgaXNBbmltYXRhYmxlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pcy1hbmltYXRhYmxlLm1qcy5tYXBcbiIsImltcG9ydCB7IHdhcm5pbmcgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgaXNHZW5lcmF0b3IgfSBmcm9tICcuLi9nZW5lcmF0b3JzL3V0aWxzL2lzLWdlbmVyYXRvci5tanMnO1xuaW1wb3J0IHsgaXNBbmltYXRhYmxlIH0gZnJvbSAnLi9pcy1hbmltYXRhYmxlLm1qcyc7XG5cbmZ1bmN0aW9uIGhhc0tleWZyYW1lc0NoYW5nZWQoa2V5ZnJhbWVzKSB7XG4gICAgY29uc3QgY3VycmVudCA9IGtleWZyYW1lc1swXTtcbiAgICBpZiAoa2V5ZnJhbWVzLmxlbmd0aCA9PT0gMSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlmcmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGtleWZyYW1lc1tpXSAhPT0gY3VycmVudClcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGNhbkFuaW1hdGUoa2V5ZnJhbWVzLCBuYW1lLCB0eXBlLCB2ZWxvY2l0eSkge1xuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHdlJ3JlIGFibGUgdG8gYW5pbWF0ZSBiZXR3ZWVuIHRoZSBzdGFydCBhbmQgZW5kIGtleWZyYW1lcyxcbiAgICAgKiBhbmQgdGhyb3cgYSB3YXJuaW5nIGlmIHdlJ3JlIGF0dGVtcHRpbmcgdG8gYW5pbWF0ZSBiZXR3ZWVuIG9uZSB0aGF0J3NcbiAgICAgKiBhbmltYXRhYmxlIGFuZCBhbm90aGVyIHRoYXQgaXNuJ3QuXG4gICAgICovXG4gICAgY29uc3Qgb3JpZ2luS2V5ZnJhbWUgPSBrZXlmcmFtZXNbMF07XG4gICAgaWYgKG9yaWdpbktleWZyYW1lID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhlc2UgYXJlbid0IHRyYWRpdGlvbmFsbHkgYW5pbWF0YWJsZSBidXQgd2UgZG8gc3VwcG9ydCB0aGVtLlxuICAgICAqIEluIGZ1dHVyZSB3ZSBjb3VsZCBsb29rIGludG8gbWFraW5nIHRoaXMgbW9yZSBnZW5lcmljIG9yIHJlcGxhY2luZ1xuICAgICAqIHRoaXMgZnVuY3Rpb24gd2l0aCBtaXgoKSA9PT0gbWl4SW1tZWRpYXRlXG4gICAgICovXG4gICAgaWYgKG5hbWUgPT09IFwiZGlzcGxheVwiIHx8IG5hbWUgPT09IFwidmlzaWJpbGl0eVwiKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCB0YXJnZXRLZXlmcmFtZSA9IGtleWZyYW1lc1trZXlmcmFtZXMubGVuZ3RoIC0gMV07XG4gICAgY29uc3QgaXNPcmlnaW5BbmltYXRhYmxlID0gaXNBbmltYXRhYmxlKG9yaWdpbktleWZyYW1lLCBuYW1lKTtcbiAgICBjb25zdCBpc1RhcmdldEFuaW1hdGFibGUgPSBpc0FuaW1hdGFibGUodGFyZ2V0S2V5ZnJhbWUsIG5hbWUpO1xuICAgIHdhcm5pbmcoaXNPcmlnaW5BbmltYXRhYmxlID09PSBpc1RhcmdldEFuaW1hdGFibGUsIGBZb3UgYXJlIHRyeWluZyB0byBhbmltYXRlICR7bmFtZX0gZnJvbSBcIiR7b3JpZ2luS2V5ZnJhbWV9XCIgdG8gXCIke3RhcmdldEtleWZyYW1lfVwiLiBcIiR7aXNPcmlnaW5BbmltYXRhYmxlID8gdGFyZ2V0S2V5ZnJhbWUgOiBvcmlnaW5LZXlmcmFtZX1cIiBpcyBub3QgYW4gYW5pbWF0YWJsZSB2YWx1ZS5gLCBcInZhbHVlLW5vdC1hbmltYXRhYmxlXCIpO1xuICAgIC8vIEFsd2F5cyBza2lwIGlmIGFueSBvZiB0aGVzZSBhcmUgdHJ1ZVxuICAgIGlmICghaXNPcmlnaW5BbmltYXRhYmxlIHx8ICFpc1RhcmdldEFuaW1hdGFibGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gKGhhc0tleWZyYW1lc0NoYW5nZWQoa2V5ZnJhbWVzKSB8fFxuICAgICAgICAoKHR5cGUgPT09IFwic3ByaW5nXCIgfHwgaXNHZW5lcmF0b3IodHlwZSkpICYmIHZlbG9jaXR5KSk7XG59XG5cbmV4cG9ydCB7IGNhbkFuaW1hdGUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNhbi1hbmltYXRlLm1qcy5tYXBcbiIsImZ1bmN0aW9uIG1ha2VBbmltYXRpb25JbnN0YW50KG9wdGlvbnMpIHtcbiAgICBvcHRpb25zLmR1cmF0aW9uID0gMDtcbiAgICBvcHRpb25zLnR5cGUgPSBcImtleWZyYW1lc1wiO1xufVxuXG5leHBvcnQgeyBtYWtlQW5pbWF0aW9uSW5zdGFudCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFrZS1hbmltYXRpb24taW5zdGFudC5tanMubWFwXG4iLCJpbXBvcnQgeyBtZW1vIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcblxuLyoqXG4gKiBBIGxpc3Qgb2YgdmFsdWVzIHRoYXQgY2FuIGJlIGhhcmR3YXJlLWFjY2VsZXJhdGVkLlxuICovXG5jb25zdCBhY2NlbGVyYXRlZFZhbHVlcyA9IG5ldyBTZXQoW1xuICAgIFwib3BhY2l0eVwiLFxuICAgIFwiY2xpcFBhdGhcIixcbiAgICBcImZpbHRlclwiLFxuICAgIFwidHJhbnNmb3JtXCIsXG4gICAgLy8gVE9ETzogQ291bGQgYmUgcmUtZW5hYmxlZCBub3cgd2UgaGF2ZSBzdXBwb3J0IGZvciBsaW5lYXIoKSBlYXNpbmdcbiAgICAvLyBcImJhY2tncm91bmQtY29sb3JcIlxuXSk7XG5jb25zdCBzdXBwb3J0c1dhYXBpID0gLypAX19QVVJFX18qLyBtZW1vKCgpID0+IE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKEVsZW1lbnQucHJvdG90eXBlLCBcImFuaW1hdGVcIikpO1xuZnVuY3Rpb24gc3VwcG9ydHNCcm93c2VyQW5pbWF0aW9uKG9wdGlvbnMpIHtcbiAgICBjb25zdCB7IG1vdGlvblZhbHVlLCBuYW1lLCByZXBlYXREZWxheSwgcmVwZWF0VHlwZSwgZGFtcGluZywgdHlwZSB9ID0gb3B0aW9ucztcbiAgICBjb25zdCBzdWJqZWN0ID0gbW90aW9uVmFsdWU/Lm93bmVyPy5jdXJyZW50O1xuICAgIC8qKlxuICAgICAqIFdlIHVzZSB0aGlzIGNoZWNrIGluc3RlYWQgb2YgaXNIVE1MRWxlbWVudCgpIGJlY2F1c2Ugd2UgZXhwbGljaXRseVxuICAgICAqICoqZG9uJ3QqKiB3YW50IGVsZW1lbnRzIGluIGRpZmZlcmVudCB0aW1pbmcgY29udGV4dHMgKGkuZS4gcG9wdXBzKVxuICAgICAqIHRvIGJlIGFjY2VsZXJhdGVkLCBhcyBpdCdzIG5vdCBwb3NzaWJsZSB0byBzeW5jIHRoZXNlIGFuaW1hdGlvbnNcbiAgICAgKiBwcm9wZXJseSB3aXRoIHRob3NlIGRyaXZlbiBmcm9tIHRoZSBtYWluIHdpbmRvdyBmcmFtZWxvb3AuXG4gICAgICovXG4gICAgaWYgKCEoc3ViamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHsgb25VcGRhdGUsIHRyYW5zZm9ybVRlbXBsYXRlIH0gPSBtb3Rpb25WYWx1ZS5vd25lci5nZXRQcm9wcygpO1xuICAgIHJldHVybiAoc3VwcG9ydHNXYWFwaSgpICYmXG4gICAgICAgIG5hbWUgJiZcbiAgICAgICAgYWNjZWxlcmF0ZWRWYWx1ZXMuaGFzKG5hbWUpICYmXG4gICAgICAgIChuYW1lICE9PSBcInRyYW5zZm9ybVwiIHx8ICF0cmFuc2Zvcm1UZW1wbGF0ZSkgJiZcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHdlJ3JlIG91dHB1dHRpbmcgdmFsdWVzIHRvIG9uVXBkYXRlIHRoZW4gd2UgY2FuJ3QgdXNlIFdBQVBJIGFzIHRoZXJlJ3NcbiAgICAgICAgICogbm8gd2F5IHRvIHJlYWQgdGhlIHZhbHVlIGZyb20gV0FBUEkgZXZlcnkgZnJhbWUuXG4gICAgICAgICAqL1xuICAgICAgICAhb25VcGRhdGUgJiZcbiAgICAgICAgIXJlcGVhdERlbGF5ICYmXG4gICAgICAgIHJlcGVhdFR5cGUgIT09IFwibWlycm9yXCIgJiZcbiAgICAgICAgZGFtcGluZyAhPT0gMCAmJlxuICAgICAgICB0eXBlICE9PSBcImluZXJ0aWFcIik7XG59XG5cbmV4cG9ydCB7IHN1cHBvcnRzQnJvd3NlckFuaW1hdGlvbiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2FhcGkubWpzLm1hcFxuIiwiaW1wb3J0IHsgTW90aW9uR2xvYmFsQ29uZmlnLCBub29wIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcbmltcG9ydCB7IHRpbWUgfSBmcm9tICcuLi9mcmFtZWxvb3Avc3luYy10aW1lLm1qcyc7XG5pbXBvcnQgeyBKU0FuaW1hdGlvbiB9IGZyb20gJy4vSlNBbmltYXRpb24ubWpzJztcbmltcG9ydCB7IGdldEZpbmFsS2V5ZnJhbWUgfSBmcm9tICcuL2tleWZyYW1lcy9nZXQtZmluYWwubWpzJztcbmltcG9ydCB7IEtleWZyYW1lUmVzb2x2ZXIsIGZsdXNoS2V5ZnJhbWVSZXNvbHZlcnMgfSBmcm9tICcuL2tleWZyYW1lcy9LZXlmcmFtZXNSZXNvbHZlci5tanMnO1xuaW1wb3J0IHsgTmF0aXZlQW5pbWF0aW9uRXh0ZW5kZWQgfSBmcm9tICcuL05hdGl2ZUFuaW1hdGlvbkV4dGVuZGVkLm1qcyc7XG5pbXBvcnQgeyBjYW5BbmltYXRlIH0gZnJvbSAnLi91dGlscy9jYW4tYW5pbWF0ZS5tanMnO1xuaW1wb3J0IHsgbWFrZUFuaW1hdGlvbkluc3RhbnQgfSBmcm9tICcuL3V0aWxzL21ha2UtYW5pbWF0aW9uLWluc3RhbnQubWpzJztcbmltcG9ydCB7IFdpdGhQcm9taXNlIH0gZnJvbSAnLi91dGlscy9XaXRoUHJvbWlzZS5tanMnO1xuaW1wb3J0IHsgc3VwcG9ydHNCcm93c2VyQW5pbWF0aW9uIH0gZnJvbSAnLi93YWFwaS9zdXBwb3J0cy93YWFwaS5tanMnO1xuXG4vKipcbiAqIE1heGltdW0gdGltZSBhbGxvd2VkIGJldHdlZW4gYW4gYW5pbWF0aW9uIGJlaW5nIGNyZWF0ZWQgYW5kIGl0IGJlaW5nXG4gKiByZXNvbHZlZCBmb3IgdXMgdG8gdXNlIHRoZSBsYXR0ZXIgYXMgdGhlIHN0YXJ0IHRpbWUuXG4gKlxuICogVGhpcyBpcyB0byBlbnN1cmUgdGhhdCB3aGlsZSB3ZSBwcmVmZXIgdG8gXCJzdGFydFwiIGFuIGFuaW1hdGlvbiBhcyBzb29uXG4gKiBhcyBpdCdzIHRyaWdnZXJlZCwgd2UgYWxzbyB3YW50IHRvIGF2b2lkIGEgdmlzdWFsIGp1bXAgaWYgdGhlcmUncyBhIGJpZyBkZWxheVxuICogYmV0d2VlbiB0aGVzZSB0d28gbW9tZW50cy5cbiAqL1xuY29uc3QgTUFYX1JFU09MVkVfREVMQVkgPSA0MDtcbmNsYXNzIEFzeW5jTW90aW9uVmFsdWVBbmltYXRpb24gZXh0ZW5kcyBXaXRoUHJvbWlzZSB7XG4gICAgY29uc3RydWN0b3IoeyBhdXRvcGxheSA9IHRydWUsIGRlbGF5ID0gMCwgdHlwZSA9IFwia2V5ZnJhbWVzXCIsIHJlcGVhdCA9IDAsIHJlcGVhdERlbGF5ID0gMCwgcmVwZWF0VHlwZSA9IFwibG9vcFwiLCBrZXlmcmFtZXMsIG5hbWUsIG1vdGlvblZhbHVlLCBlbGVtZW50LCAuLi5vcHRpb25zIH0pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJvdW5kIHRvIHN1cHBvcnQgcmV0dXJuIGFuaW1hdGlvbi5zdG9wIHBhdHRlcm5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc3RvcCA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9hbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hbmltYXRpb24uc3RvcCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcFRpbWVsaW5lPy4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMua2V5ZnJhbWVSZXNvbHZlcj8uY2FuY2VsKCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY3JlYXRlZEF0ID0gdGltZS5ub3coKTtcbiAgICAgICAgY29uc3Qgb3B0aW9uc1dpdGhEZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGF1dG9wbGF5LFxuICAgICAgICAgICAgZGVsYXksXG4gICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgcmVwZWF0LFxuICAgICAgICAgICAgcmVwZWF0RGVsYXksXG4gICAgICAgICAgICByZXBlYXRUeXBlLFxuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgIG1vdGlvblZhbHVlLFxuICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IEtleWZyYW1lUmVzb2x2ZXIkMSA9IGVsZW1lbnQ/LktleWZyYW1lUmVzb2x2ZXIgfHwgS2V5ZnJhbWVSZXNvbHZlcjtcbiAgICAgICAgdGhpcy5rZXlmcmFtZVJlc29sdmVyID0gbmV3IEtleWZyYW1lUmVzb2x2ZXIkMShrZXlmcmFtZXMsIChyZXNvbHZlZEtleWZyYW1lcywgZmluYWxLZXlmcmFtZSwgZm9yY2VkKSA9PiB0aGlzLm9uS2V5ZnJhbWVzUmVzb2x2ZWQocmVzb2x2ZWRLZXlmcmFtZXMsIGZpbmFsS2V5ZnJhbWUsIG9wdGlvbnNXaXRoRGVmYXVsdHMsICFmb3JjZWQpLCBuYW1lLCBtb3Rpb25WYWx1ZSwgZWxlbWVudCk7XG4gICAgICAgIHRoaXMua2V5ZnJhbWVSZXNvbHZlcj8uc2NoZWR1bGVSZXNvbHZlKCk7XG4gICAgfVxuICAgIG9uS2V5ZnJhbWVzUmVzb2x2ZWQoa2V5ZnJhbWVzLCBmaW5hbEtleWZyYW1lLCBvcHRpb25zLCBzeW5jKSB7XG4gICAgICAgIHRoaXMua2V5ZnJhbWVSZXNvbHZlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgeyBuYW1lLCB0eXBlLCB2ZWxvY2l0eSwgZGVsYXksIGlzSGFuZG9mZiwgb25VcGRhdGUgfSA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMucmVzb2x2ZWRBdCA9IHRpbWUubm93KCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiB3ZSBjYW4ndCBhbmltYXRlIHRoaXMgdmFsdWUgd2l0aCB0aGUgcmVzb2x2ZWQga2V5ZnJhbWVzXG4gICAgICAgICAqIHRoZW4gd2Ugc2hvdWxkIGNvbXBsZXRlIGl0IGltbWVkaWF0ZWx5LlxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IGNhbkFuaW1hdGVWYWx1ZSA9IHRydWU7XG4gICAgICAgIGlmICghY2FuQW5pbWF0ZShrZXlmcmFtZXMsIG5hbWUsIHR5cGUsIHZlbG9jaXR5KSkge1xuICAgICAgICAgICAgY2FuQW5pbWF0ZVZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoTW90aW9uR2xvYmFsQ29uZmlnLmluc3RhbnRBbmltYXRpb25zIHx8ICFkZWxheSkge1xuICAgICAgICAgICAgICAgIG9uVXBkYXRlPy4oZ2V0RmluYWxLZXlmcmFtZShrZXlmcmFtZXMsIG9wdGlvbnMsIGZpbmFsS2V5ZnJhbWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleWZyYW1lc1swXSA9IGtleWZyYW1lc1trZXlmcmFtZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBtYWtlQW5pbWF0aW9uSW5zdGFudChvcHRpb25zKTtcbiAgICAgICAgICAgIG9wdGlvbnMucmVwZWF0ID0gMDtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzb2x2ZSBzdGFydFRpbWUgZm9yIHRoZSBhbmltYXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIHVzZXMgdGhlIGNyZWF0ZWRBdCBhbmQgcmVzb2x2ZWRBdCB0byBjYWxjdWxhdGUgdGhlXG4gICAgICAgICAqIGFuaW1hdGlvbiBzdGFydFRpbWUuICpJZGVhbGx5Kiwgd2Ugd291bGQgdXNlIHRoZSBjcmVhdGVkQXQgdGltZSBhcyB0PTBcbiAgICAgICAgICogYXMgdGhlIGZvbGxvd2luZyBmcmFtZSB3b3VsZCB0aGVuIGJlIHRoZSBmaXJzdCBmcmFtZSBvZiB0aGUgYW5pbWF0aW9uIGluXG4gICAgICAgICAqIHByb2dyZXNzLCB3aGljaCB3b3VsZCBmZWVsIHNuYXBwaWVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBIb3dldmVyLCBpZiB0aGVyZSdzIGEgZGVsYXkgKG1haW4gdGhyZWFkIHdvcmspIGJldHdlZW4gdGhlIGNyZWF0aW9uIG9mXG4gICAgICAgICAqIHRoZSBhbmltYXRpb24gYW5kIHRoZSBmaXJzdCBjb21taXR0ZWQgZnJhbWUsIHdlIHByZWZlciB0byB1c2UgcmVzb2x2ZWRBdFxuICAgICAgICAgKiB0byBhdm9pZCBhIHN1ZGRlbiBqdW1wIGludG8gdGhlIGFuaW1hdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IHN5bmNcbiAgICAgICAgICAgID8gIXRoaXMucmVzb2x2ZWRBdFxuICAgICAgICAgICAgICAgID8gdGhpcy5jcmVhdGVkQXRcbiAgICAgICAgICAgICAgICA6IHRoaXMucmVzb2x2ZWRBdCAtIHRoaXMuY3JlYXRlZEF0ID4gTUFYX1JFU09MVkVfREVMQVlcbiAgICAgICAgICAgICAgICAgICAgPyB0aGlzLnJlc29sdmVkQXRcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmNyZWF0ZWRBdFxuICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IHJlc29sdmVkT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHN0YXJ0VGltZSxcbiAgICAgICAgICAgIGZpbmFsS2V5ZnJhbWUsXG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAga2V5ZnJhbWVzLFxuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogQW5pbWF0ZSB2aWEgV0FBUEkgaWYgcG9zc2libGUuIElmIHRoaXMgaXMgYSBoYW5kb2ZmIGFuaW1hdGlvbiwgdGhlIG9wdGltaXNlZCBhbmltYXRpb24gd2lsbCBiZSBydW5uaW5nIHZpYVxuICAgICAgICAgKiBXQUFQSS4gVGhlcmVmb3JlLCB0aGlzIGFuaW1hdGlvbiBtdXN0IGJlIEpTIHRvIGVuc3VyZSBpdCBydW5zIFwidW5kZXJcIiB0aGVcbiAgICAgICAgICogb3B0aW1pc2VkIGFuaW1hdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQWxzbyBza2lwIFdBQVBJIHdoZW4ga2V5ZnJhbWVzIGFyZW4ndCBhbmltYXRhYmxlLCBhcyB0aGUgcmVzb2x2ZWRcbiAgICAgICAgICogdmFsdWVzIG1heSBub3QgYmUgdmFsaWQgQ1NTIGFuZCB3b3VsZCB0cmlnZ2VyIGJyb3dzZXIgd2FybmluZ3MuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCB1c2VXYWFwaSA9IGNhbkFuaW1hdGVWYWx1ZSAmJlxuICAgICAgICAgICAgIWlzSGFuZG9mZiAmJlxuICAgICAgICAgICAgc3VwcG9ydHNCcm93c2VyQW5pbWF0aW9uKHJlc29sdmVkT3B0aW9ucyk7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSByZXNvbHZlZE9wdGlvbnMubW90aW9uVmFsdWU/Lm93bmVyPy5jdXJyZW50O1xuICAgICAgICBjb25zdCBhbmltYXRpb24gPSB1c2VXYWFwaVxuICAgICAgICAgICAgPyBuZXcgTmF0aXZlQW5pbWF0aW9uRXh0ZW5kZWQoe1xuICAgICAgICAgICAgICAgIC4uLnJlc29sdmVkT3B0aW9ucyxcbiAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIDogbmV3IEpTQW5pbWF0aW9uKHJlc29sdmVkT3B0aW9ucyk7XG4gICAgICAgIGFuaW1hdGlvbi5maW5pc2hlZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubm90aWZ5RmluaXNoZWQoKTtcbiAgICAgICAgfSkuY2F0Y2gobm9vcCk7XG4gICAgICAgIGlmICh0aGlzLnBlbmRpbmdUaW1lbGluZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9wVGltZWxpbmUgPSBhbmltYXRpb24uYXR0YWNoVGltZWxpbmUodGhpcy5wZW5kaW5nVGltZWxpbmUpO1xuICAgICAgICAgICAgdGhpcy5wZW5kaW5nVGltZWxpbmUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYW5pbWF0aW9uID0gYW5pbWF0aW9uO1xuICAgIH1cbiAgICBnZXQgZmluaXNoZWQoKSB7XG4gICAgICAgIGlmICghdGhpcy5fYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZmluaXNoZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hbmltYXRpb24uZmluaXNoZWQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhlbihvblJlc29sdmUsIF9vblJlamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hlZC5maW5hbGx5KG9uUmVzb2x2ZSkudGhlbigoKSA9PiB7IH0pO1xuICAgIH1cbiAgICBnZXQgYW5pbWF0aW9uKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2FuaW1hdGlvbikge1xuICAgICAgICAgICAgdGhpcy5rZXlmcmFtZVJlc29sdmVyPy5yZXN1bWUoKTtcbiAgICAgICAgICAgIGZsdXNoS2V5ZnJhbWVSZXNvbHZlcnMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fYW5pbWF0aW9uO1xuICAgIH1cbiAgICBnZXQgZHVyYXRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFuaW1hdGlvbi5kdXJhdGlvbjtcbiAgICB9XG4gICAgZ2V0IGl0ZXJhdGlvbkR1cmF0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbmltYXRpb24uaXRlcmF0aW9uRHVyYXRpb247XG4gICAgfVxuICAgIGdldCB0aW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbmltYXRpb24udGltZTtcbiAgICB9XG4gICAgc2V0IHRpbWUobmV3VGltZSkge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbi50aW1lID0gbmV3VGltZTtcbiAgICB9XG4gICAgZ2V0IHNwZWVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbmltYXRpb24uc3BlZWQ7XG4gICAgfVxuICAgIGdldCBzdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5pbWF0aW9uLnN0YXRlO1xuICAgIH1cbiAgICBzZXQgc3BlZWQobmV3U3BlZWQpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb24uc3BlZWQgPSBuZXdTcGVlZDtcbiAgICB9XG4gICAgZ2V0IHN0YXJ0VGltZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5pbWF0aW9uLnN0YXJ0VGltZTtcbiAgICB9XG4gICAgYXR0YWNoVGltZWxpbmUodGltZWxpbmUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2FuaW1hdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zdG9wVGltZWxpbmUgPSB0aGlzLmFuaW1hdGlvbi5hdHRhY2hUaW1lbGluZSh0aW1lbGluZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdUaW1lbGluZSA9IHRpbWVsaW5lO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoKSA9PiB0aGlzLnN0b3AoKTtcbiAgICB9XG4gICAgcGxheSgpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb24ucGxheSgpO1xuICAgIH1cbiAgICBwYXVzZSgpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb24ucGF1c2UoKTtcbiAgICB9XG4gICAgY29tcGxldGUoKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICAgIGNhbmNlbCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2FuaW1hdGlvbikge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24uY2FuY2VsKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5rZXlmcmFtZVJlc29sdmVyPy5jYW5jZWwoKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IEFzeW5jTW90aW9uVmFsdWVBbmltYXRpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUFzeW5jTW90aW9uVmFsdWVBbmltYXRpb24ubWpzLm1hcFxuIiwiY2xhc3MgR3JvdXBBbmltYXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKGFuaW1hdGlvbnMpIHtcbiAgICAgICAgLy8gQm91bmQgdG8gYWNjb21hZGF0ZSBjb21tb24gYHJldHVybiBhbmltYXRpb24uc3RvcGAgcGF0dGVyblxuICAgICAgICB0aGlzLnN0b3AgPSAoKSA9PiB0aGlzLnJ1bkFsbChcInN0b3BcIik7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9ucyA9IGFuaW1hdGlvbnMuZmlsdGVyKEJvb2xlYW4pO1xuICAgIH1cbiAgICBnZXQgZmluaXNoZWQoKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbCh0aGlzLmFuaW1hdGlvbnMubWFwKChhbmltYXRpb24pID0+IGFuaW1hdGlvbi5maW5pc2hlZCkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUT0RPOiBGaWx0ZXIgb3V0IGNhbmNlbGxlZCBvciBzdG9wcGVkIGFuaW1hdGlvbnMgYmVmb3JlIHJldHVybmluZ1xuICAgICAqL1xuICAgIGdldEFsbChwcm9wTmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbmltYXRpb25zWzBdW3Byb3BOYW1lXTtcbiAgICB9XG4gICAgc2V0QWxsKHByb3BOYW1lLCBuZXdWYWx1ZSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYW5pbWF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zW2ldW3Byb3BOYW1lXSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGF0dGFjaFRpbWVsaW5lKHRpbWVsaW5lKSB7XG4gICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSB0aGlzLmFuaW1hdGlvbnMubWFwKChhbmltYXRpb24pID0+IGFuaW1hdGlvbi5hdHRhY2hUaW1lbGluZSh0aW1lbGluZSkpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9ucy5mb3JFYWNoKChjYW5jZWwsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBjYW5jZWwgJiYgY2FuY2VsKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25zW2ldLnN0b3AoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBnZXQgdGltZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWxsKFwidGltZVwiKTtcbiAgICB9XG4gICAgc2V0IHRpbWUodGltZSkge1xuICAgICAgICB0aGlzLnNldEFsbChcInRpbWVcIiwgdGltZSk7XG4gICAgfVxuICAgIGdldCBzcGVlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWxsKFwic3BlZWRcIik7XG4gICAgfVxuICAgIHNldCBzcGVlZChzcGVlZCkge1xuICAgICAgICB0aGlzLnNldEFsbChcInNwZWVkXCIsIHNwZWVkKTtcbiAgICB9XG4gICAgZ2V0IHN0YXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBbGwoXCJzdGF0ZVwiKTtcbiAgICB9XG4gICAgZ2V0IHN0YXJ0VGltZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWxsKFwic3RhcnRUaW1lXCIpO1xuICAgIH1cbiAgICBnZXQgZHVyYXRpb24oKSB7XG4gICAgICAgIHJldHVybiBnZXRNYXgodGhpcy5hbmltYXRpb25zLCBcImR1cmF0aW9uXCIpO1xuICAgIH1cbiAgICBnZXQgaXRlcmF0aW9uRHVyYXRpb24oKSB7XG4gICAgICAgIHJldHVybiBnZXRNYXgodGhpcy5hbmltYXRpb25zLCBcIml0ZXJhdGlvbkR1cmF0aW9uXCIpO1xuICAgIH1cbiAgICBydW5BbGwobWV0aG9kTmFtZSkge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbnMuZm9yRWFjaCgoY29udHJvbHMpID0+IGNvbnRyb2xzW21ldGhvZE5hbWVdKCkpO1xuICAgIH1cbiAgICBwbGF5KCkge1xuICAgICAgICB0aGlzLnJ1bkFsbChcInBsYXlcIik7XG4gICAgfVxuICAgIHBhdXNlKCkge1xuICAgICAgICB0aGlzLnJ1bkFsbChcInBhdXNlXCIpO1xuICAgIH1cbiAgICBjYW5jZWwoKSB7XG4gICAgICAgIHRoaXMucnVuQWxsKFwiY2FuY2VsXCIpO1xuICAgIH1cbiAgICBjb21wbGV0ZSgpIHtcbiAgICAgICAgdGhpcy5ydW5BbGwoXCJjb21wbGV0ZVwiKTtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXRNYXgoYW5pbWF0aW9ucywgcHJvcE5hbWUpIHtcbiAgICBsZXQgbWF4ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFuaW1hdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhbmltYXRpb25zW2ldW3Byb3BOYW1lXTtcbiAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsICYmIHZhbHVlID4gbWF4KSB7XG4gICAgICAgICAgICBtYXggPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWF4O1xufVxuXG5leHBvcnQgeyBHcm91cEFuaW1hdGlvbiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9R3JvdXBBbmltYXRpb24ubWpzLm1hcFxuIiwiaW1wb3J0IHsgR3JvdXBBbmltYXRpb24gfSBmcm9tICcuL0dyb3VwQW5pbWF0aW9uLm1qcyc7XG5cbmNsYXNzIEdyb3VwQW5pbWF0aW9uV2l0aFRoZW4gZXh0ZW5kcyBHcm91cEFuaW1hdGlvbiB7XG4gICAgdGhlbihvblJlc29sdmUsIF9vblJlamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hlZC5maW5hbGx5KG9uUmVzb2x2ZSkudGhlbigoKSA9PiB7IH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgR3JvdXBBbmltYXRpb25XaXRoVGhlbiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9R3JvdXBBbmltYXRpb25XaXRoVGhlbi5tanMubWFwXG4iLCJpbXBvcnQgeyBOYXRpdmVBbmltYXRpb24gfSBmcm9tICcuL05hdGl2ZUFuaW1hdGlvbi5tanMnO1xuXG5jbGFzcyBOYXRpdmVBbmltYXRpb25XcmFwcGVyIGV4dGVuZHMgTmF0aXZlQW5pbWF0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihhbmltYXRpb24pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5hbmltYXRpb24gPSBhbmltYXRpb247XG4gICAgICAgIGFuaW1hdGlvbi5vbmZpbmlzaCA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoZWRUaW1lID0gdGhpcy50aW1lO1xuICAgICAgICAgICAgdGhpcy5ub3RpZnlGaW5pc2hlZCgpO1xuICAgICAgICB9O1xuICAgIH1cbn1cblxuZXhwb3J0IHsgTmF0aXZlQW5pbWF0aW9uV3JhcHBlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TmF0aXZlQW5pbWF0aW9uV3JhcHBlci5tanMubWFwXG4iLCJpbXBvcnQgeyBpbnZhcmlhbnQsIGlzTnVtZXJpY2FsU3RyaW5nIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcbmltcG9ydCB7IGlzQ1NTVmFyaWFibGVUb2tlbiB9IGZyb20gJy4vaXMtY3NzLXZhcmlhYmxlLm1qcyc7XG5cbi8qKlxuICogUGFyc2UgRnJhbWVyJ3Mgc3BlY2lhbCBDU1MgdmFyaWFibGUgZm9ybWF0IGludG8gYSBDU1MgdG9rZW4gYW5kIGEgZmFsbGJhY2suXG4gKlxuICogYGBgXG4gKiBgdmFyKC0tZm9vLCAjZmZmKWAgPT4gW2AtLWZvb2AsICcjZmZmJ11cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBjdXJyZW50XG4gKi9cbmNvbnN0IHNwbGl0Q1NTVmFyaWFibGVSZWdleCA9IFxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlZG9zLWRldGVjdG9yL25vLXVuc2FmZS1yZWdleCAtLSBmYWxzZSBwb3NpdGl2ZSwgYXMgaXQgY2FuIG1hdGNoIGEgbG90IG9mIHdvcmRzXG4vXnZhclxcKC0tKD86KFtcXHctXSspfChbXFx3LV0rKSwgPyhbYS16QS1aXFxkICgpJSMuLC1dKykpXFwpL3U7XG5mdW5jdGlvbiBwYXJzZUNTU1ZhcmlhYmxlKGN1cnJlbnQpIHtcbiAgICBjb25zdCBtYXRjaCA9IHNwbGl0Q1NTVmFyaWFibGVSZWdleC5leGVjKGN1cnJlbnQpO1xuICAgIGlmICghbWF0Y2gpXG4gICAgICAgIHJldHVybiBbLF07XG4gICAgY29uc3QgWywgdG9rZW4xLCB0b2tlbjIsIGZhbGxiYWNrXSA9IG1hdGNoO1xuICAgIHJldHVybiBbYC0tJHt0b2tlbjEgPz8gdG9rZW4yfWAsIGZhbGxiYWNrXTtcbn1cbmNvbnN0IG1heERlcHRoID0gNDtcbmZ1bmN0aW9uIGdldFZhcmlhYmxlVmFsdWUoY3VycmVudCwgZWxlbWVudCwgZGVwdGggPSAxKSB7XG4gICAgaW52YXJpYW50KGRlcHRoIDw9IG1heERlcHRoLCBgTWF4IENTUyB2YXJpYWJsZSBmYWxsYmFjayBkZXB0aCBkZXRlY3RlZCBpbiBwcm9wZXJ0eSBcIiR7Y3VycmVudH1cIi4gVGhpcyBtYXkgaW5kaWNhdGUgYSBjaXJjdWxhciBmYWxsYmFjayBkZXBlbmRlbmN5LmAsIFwibWF4LWNzcy12YXItZGVwdGhcIik7XG4gICAgY29uc3QgW3Rva2VuLCBmYWxsYmFja10gPSBwYXJzZUNTU1ZhcmlhYmxlKGN1cnJlbnQpO1xuICAgIC8vIE5vIENTUyB2YXJpYWJsZSBkZXRlY3RlZFxuICAgIGlmICghdG9rZW4pXG4gICAgICAgIHJldHVybjtcbiAgICAvLyBBdHRlbXB0IHRvIHJlYWQgdGhpcyBDU1MgdmFyaWFibGUgb2ZmIHRoZSBlbGVtZW50XG4gICAgY29uc3QgcmVzb2x2ZWQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKHRva2VuKTtcbiAgICBpZiAocmVzb2x2ZWQpIHtcbiAgICAgICAgY29uc3QgdHJpbW1lZCA9IHJlc29sdmVkLnRyaW0oKTtcbiAgICAgICAgcmV0dXJuIGlzTnVtZXJpY2FsU3RyaW5nKHRyaW1tZWQpID8gcGFyc2VGbG9hdCh0cmltbWVkKSA6IHRyaW1tZWQ7XG4gICAgfVxuICAgIHJldHVybiBpc0NTU1ZhcmlhYmxlVG9rZW4oZmFsbGJhY2spXG4gICAgICAgID8gZ2V0VmFyaWFibGVWYWx1ZShmYWxsYmFjaywgZWxlbWVudCwgZGVwdGggKyAxKVxuICAgICAgICA6IGZhbGxiYWNrO1xufVxuXG5leHBvcnQgeyBnZXRWYXJpYWJsZVZhbHVlLCBwYXJzZUNTU1ZhcmlhYmxlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jc3MtdmFyaWFibGVzLWNvbnZlcnNpb24ubWpzLm1hcFxuIiwiaW1wb3J0IHsgdHJhbnNmb3JtUHJvcHMgfSBmcm9tICcuLi8uLi9yZW5kZXIvdXRpbHMva2V5cy10cmFuc2Zvcm0ubWpzJztcblxuY29uc3QgdW5kZXJEYW1wZWRTcHJpbmcgPSB7XG4gICAgdHlwZTogXCJzcHJpbmdcIixcbiAgICBzdGlmZm5lc3M6IDUwMCxcbiAgICBkYW1waW5nOiAyNSxcbiAgICByZXN0U3BlZWQ6IDEwLFxufTtcbmNvbnN0IGNyaXRpY2FsbHlEYW1wZWRTcHJpbmcgPSAodGFyZ2V0KSA9PiAoe1xuICAgIHR5cGU6IFwic3ByaW5nXCIsXG4gICAgc3RpZmZuZXNzOiA1NTAsXG4gICAgZGFtcGluZzogdGFyZ2V0ID09PSAwID8gMiAqIE1hdGguc3FydCg1NTApIDogMzAsXG4gICAgcmVzdFNwZWVkOiAxMCxcbn0pO1xuY29uc3Qga2V5ZnJhbWVzVHJhbnNpdGlvbiA9IHtcbiAgICB0eXBlOiBcImtleWZyYW1lc1wiLFxuICAgIGR1cmF0aW9uOiAwLjgsXG59O1xuLyoqXG4gKiBEZWZhdWx0IGVhc2luZyBjdXJ2ZSBpcyBhIHNsaWdodGx5IHNoYWxsb3dlciB2ZXJzaW9uIG9mXG4gKiB0aGUgZGVmYXVsdCBicm93c2VyIGVhc2luZyBjdXJ2ZS5cbiAqL1xuY29uc3QgZWFzZSA9IHtcbiAgICB0eXBlOiBcImtleWZyYW1lc1wiLFxuICAgIGVhc2U6IFswLjI1LCAwLjEsIDAuMzUsIDFdLFxuICAgIGR1cmF0aW9uOiAwLjMsXG59O1xuY29uc3QgZ2V0RGVmYXVsdFRyYW5zaXRpb24gPSAodmFsdWVLZXksIHsga2V5ZnJhbWVzIH0pID0+IHtcbiAgICBpZiAoa2V5ZnJhbWVzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgcmV0dXJuIGtleWZyYW1lc1RyYW5zaXRpb247XG4gICAgfVxuICAgIGVsc2UgaWYgKHRyYW5zZm9ybVByb3BzLmhhcyh2YWx1ZUtleSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlS2V5LnN0YXJ0c1dpdGgoXCJzY2FsZVwiKVxuICAgICAgICAgICAgPyBjcml0aWNhbGx5RGFtcGVkU3ByaW5nKGtleWZyYW1lc1sxXSlcbiAgICAgICAgICAgIDogdW5kZXJEYW1wZWRTcHJpbmc7XG4gICAgfVxuICAgIHJldHVybiBlYXNlO1xufTtcblxuZXhwb3J0IHsgZ2V0RGVmYXVsdFRyYW5zaXRpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlZmF1bHQtdHJhbnNpdGlvbnMubWpzLm1hcFxuIiwiY29uc3QgaXNOb3ROdWxsID0gKHZhbHVlKSA9PiB2YWx1ZSAhPT0gbnVsbDtcbmZ1bmN0aW9uIGdldEZpbmFsS2V5ZnJhbWUoa2V5ZnJhbWVzLCB7IHJlcGVhdCwgcmVwZWF0VHlwZSA9IFwibG9vcFwiIH0sIGZpbmFsS2V5ZnJhbWUpIHtcbiAgICBjb25zdCByZXNvbHZlZEtleWZyYW1lcyA9IGtleWZyYW1lcy5maWx0ZXIoaXNOb3ROdWxsKTtcbiAgICBjb25zdCBpbmRleCA9IHJlcGVhdCAmJiByZXBlYXRUeXBlICE9PSBcImxvb3BcIiAmJiByZXBlYXQgJSAyID09PSAxXG4gICAgICAgID8gMFxuICAgICAgICA6IHJlc29sdmVkS2V5ZnJhbWVzLmxlbmd0aCAtIDE7XG4gICAgcmV0dXJuICFpbmRleCB8fCBmaW5hbEtleWZyYW1lID09PSB1bmRlZmluZWRcbiAgICAgICAgPyByZXNvbHZlZEtleWZyYW1lc1tpbmRleF1cbiAgICAgICAgOiBmaW5hbEtleWZyYW1lO1xufVxuXG5leHBvcnQgeyBnZXRGaW5hbEtleWZyYW1lIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1nZXQtZmluYWwta2V5ZnJhbWUubWpzLm1hcFxuIiwiLyoqXG4gKiBJZiBgdHJhbnNpdGlvbmAgaGFzIGBpbmhlcml0OiB0cnVlYCwgc2hhbGxvdy1tZXJnZSBpdCB3aXRoXG4gKiBgcGFyZW50VHJhbnNpdGlvbmAgKGNoaWxkIGtleXMgd2luKSBhbmQgc3RyaXAgdGhlIGBpbmhlcml0YCBrZXkuXG4gKiBPdGhlcndpc2UgcmV0dXJuIGB0cmFuc2l0aW9uYCB1bmNoYW5nZWQuXG4gKi9cbmZ1bmN0aW9uIHJlc29sdmVUcmFuc2l0aW9uKHRyYW5zaXRpb24sIHBhcmVudFRyYW5zaXRpb24pIHtcbiAgICBpZiAodHJhbnNpdGlvbj8uaW5oZXJpdCAmJiBwYXJlbnRUcmFuc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IHsgaW5oZXJpdDogXywgLi4ucmVzdCB9ID0gdHJhbnNpdGlvbjtcbiAgICAgICAgcmV0dXJuIHsgLi4ucGFyZW50VHJhbnNpdGlvbiwgLi4ucmVzdCB9O1xuICAgIH1cbiAgICByZXR1cm4gdHJhbnNpdGlvbjtcbn1cblxuZXhwb3J0IHsgcmVzb2x2ZVRyYW5zaXRpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlc29sdmUtdHJhbnNpdGlvbi5tanMubWFwXG4iLCJpbXBvcnQgeyByZXNvbHZlVHJhbnNpdGlvbiB9IGZyb20gJy4vcmVzb2x2ZS10cmFuc2l0aW9uLm1qcyc7XG5cbmZ1bmN0aW9uIGdldFZhbHVlVHJhbnNpdGlvbih0cmFuc2l0aW9uLCBrZXkpIHtcbiAgICBjb25zdCB2YWx1ZVRyYW5zaXRpb24gPSB0cmFuc2l0aW9uPy5ba2V5XSA/P1xuICAgICAgICB0cmFuc2l0aW9uPy5bXCJkZWZhdWx0XCJdID8/XG4gICAgICAgIHRyYW5zaXRpb247XG4gICAgaWYgKHZhbHVlVHJhbnNpdGlvbiAhPT0gdHJhbnNpdGlvbikge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZVRyYW5zaXRpb24odmFsdWVUcmFuc2l0aW9uLCB0cmFuc2l0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlVHJhbnNpdGlvbjtcbn1cblxuZXhwb3J0IHsgZ2V0VmFsdWVUcmFuc2l0aW9uIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1nZXQtdmFsdWUtdHJhbnNpdGlvbi5tanMubWFwXG4iLCIvKipcbiAqIERlY2lkZSB3aGV0aGVyIGEgdHJhbnNpdGlvbiBpcyBkZWZpbmVkIG9uIGEgZ2l2ZW4gVHJhbnNpdGlvbi5cbiAqIFRoaXMgZmlsdGVycyBvdXQgb3JjaGVzdHJhdGlvbiBvcHRpb25zIGFuZCByZXR1cm5zIHRydWVcbiAqIGlmIGFueSBvcHRpb25zIGFyZSBsZWZ0LlxuICovXG5mdW5jdGlvbiBpc1RyYW5zaXRpb25EZWZpbmVkKHsgd2hlbiwgZGVsYXk6IF9kZWxheSwgZGVsYXlDaGlsZHJlbiwgc3RhZ2dlckNoaWxkcmVuLCBzdGFnZ2VyRGlyZWN0aW9uLCByZXBlYXQsIHJlcGVhdFR5cGUsIHJlcGVhdERlbGF5LCBmcm9tLCBlbGFwc2VkLCAuLi50cmFuc2l0aW9uIH0pIHtcbiAgICByZXR1cm4gISFPYmplY3Qua2V5cyh0cmFuc2l0aW9uKS5sZW5ndGg7XG59XG5cbmV4cG9ydCB7IGlzVHJhbnNpdGlvbkRlZmluZWQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzLXRyYW5zaXRpb24tZGVmaW5lZC5tanMubWFwXG4iLCJpbXBvcnQgeyBzZWNvbmRzVG9NaWxsaXNlY29uZHMsIE1vdGlvbkdsb2JhbENvbmZpZyB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBBc3luY01vdGlvblZhbHVlQW5pbWF0aW9uIH0gZnJvbSAnLi4vQXN5bmNNb3Rpb25WYWx1ZUFuaW1hdGlvbi5tanMnO1xuaW1wb3J0IHsgSlNBbmltYXRpb24gfSBmcm9tICcuLi9KU0FuaW1hdGlvbi5tanMnO1xuaW1wb3J0IHsgZ2V0VmFsdWVUcmFuc2l0aW9uIH0gZnJvbSAnLi4vdXRpbHMvZ2V0LXZhbHVlLXRyYW5zaXRpb24ubWpzJztcbmltcG9ydCB7IG1ha2VBbmltYXRpb25JbnN0YW50IH0gZnJvbSAnLi4vdXRpbHMvbWFrZS1hbmltYXRpb24taW5zdGFudC5tanMnO1xuaW1wb3J0IHsgZ2V0RGVmYXVsdFRyYW5zaXRpb24gfSBmcm9tICcuLi91dGlscy9kZWZhdWx0LXRyYW5zaXRpb25zLm1qcyc7XG5pbXBvcnQgeyBnZXRGaW5hbEtleWZyYW1lIH0gZnJvbSAnLi4vdXRpbHMvZ2V0LWZpbmFsLWtleWZyYW1lLm1qcyc7XG5pbXBvcnQgeyBpc1RyYW5zaXRpb25EZWZpbmVkIH0gZnJvbSAnLi4vdXRpbHMvaXMtdHJhbnNpdGlvbi1kZWZpbmVkLm1qcyc7XG5pbXBvcnQgeyBmcmFtZSB9IGZyb20gJy4uLy4uL2ZyYW1lbG9vcC9mcmFtZS5tanMnO1xuXG5jb25zdCBhbmltYXRlTW90aW9uVmFsdWUgPSAobmFtZSwgdmFsdWUsIHRhcmdldCwgdHJhbnNpdGlvbiA9IHt9LCBlbGVtZW50LCBpc0hhbmRvZmYpID0+IChvbkNvbXBsZXRlKSA9PiB7XG4gICAgY29uc3QgdmFsdWVUcmFuc2l0aW9uID0gZ2V0VmFsdWVUcmFuc2l0aW9uKHRyYW5zaXRpb24sIG5hbWUpIHx8IHt9O1xuICAgIC8qKlxuICAgICAqIE1vc3QgdHJhbnNpdGlvbiB2YWx1ZXMgYXJlIGN1cnJlbnRseSBjb21wbGV0ZWx5IG92ZXJ3cml0dGVuIGJ5IHZhbHVlLXNwZWNpZmljXG4gICAgICogdHJhbnNpdGlvbnMuIEluIHRoZSBmdXR1cmUgaXQnZCBiZSBuaWNlciB0byBibGVuZCB0aGVzZSB0cmFuc2l0aW9ucy4gQnV0IGZvciBub3dcbiAgICAgKiBkZWxheSBhY3R1YWxseSBkb2VzIGluaGVyaXQgZnJvbSB0aGUgcm9vdCB0cmFuc2l0aW9uIGlmIG5vdCB2YWx1ZS1zcGVjaWZpYy5cbiAgICAgKi9cbiAgICBjb25zdCBkZWxheSA9IHZhbHVlVHJhbnNpdGlvbi5kZWxheSB8fCB0cmFuc2l0aW9uLmRlbGF5IHx8IDA7XG4gICAgLyoqXG4gICAgICogRWxhcHNlZCBpc24ndCBhIHB1YmxpYyB0cmFuc2l0aW9uIG9wdGlvbiBidXQgY2FuIGJlIHBhc3NlZCB0aHJvdWdoIGZyb21cbiAgICAgKiBvcHRpbWl6ZWQgYXBwZWFyIGVmZmVjdHMgaW4gbWlsbGlzZWNvbmRzLlxuICAgICAqL1xuICAgIGxldCB7IGVsYXBzZWQgPSAwIH0gPSB0cmFuc2l0aW9uO1xuICAgIGVsYXBzZWQgPSBlbGFwc2VkIC0gc2Vjb25kc1RvTWlsbGlzZWNvbmRzKGRlbGF5KTtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICBrZXlmcmFtZXM6IEFycmF5LmlzQXJyYXkodGFyZ2V0KSA/IHRhcmdldCA6IFtudWxsLCB0YXJnZXRdLFxuICAgICAgICBlYXNlOiBcImVhc2VPdXRcIixcbiAgICAgICAgdmVsb2NpdHk6IHZhbHVlLmdldFZlbG9jaXR5KCksXG4gICAgICAgIC4uLnZhbHVlVHJhbnNpdGlvbixcbiAgICAgICAgZGVsYXk6IC1lbGFwc2VkLFxuICAgICAgICBvblVwZGF0ZTogKHYpID0+IHtcbiAgICAgICAgICAgIHZhbHVlLnNldCh2KTtcbiAgICAgICAgICAgIHZhbHVlVHJhbnNpdGlvbi5vblVwZGF0ZSAmJiB2YWx1ZVRyYW5zaXRpb24ub25VcGRhdGUodik7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICAgICAgICAgIHZhbHVlVHJhbnNpdGlvbi5vbkNvbXBsZXRlICYmIHZhbHVlVHJhbnNpdGlvbi5vbkNvbXBsZXRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG5hbWUsXG4gICAgICAgIG1vdGlvblZhbHVlOiB2YWx1ZSxcbiAgICAgICAgZWxlbWVudDogaXNIYW5kb2ZmID8gdW5kZWZpbmVkIDogZWxlbWVudCxcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIElmIHRoZXJlJ3Mgbm8gdHJhbnNpdGlvbiBkZWZpbmVkIGZvciB0aGlzIHZhbHVlLCB3ZSBjYW4gZ2VuZXJhdGVcbiAgICAgKiB1bmlxdWUgdHJhbnNpdGlvbiBzZXR0aW5ncyBmb3IgdGhpcyB2YWx1ZS5cbiAgICAgKi9cbiAgICBpZiAoIWlzVHJhbnNpdGlvbkRlZmluZWQodmFsdWVUcmFuc2l0aW9uKSkge1xuICAgICAgICBPYmplY3QuYXNzaWduKG9wdGlvbnMsIGdldERlZmF1bHRUcmFuc2l0aW9uKG5hbWUsIG9wdGlvbnMpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQm90aCBXQUFQSSBhbmQgb3VyIGludGVybmFsIGFuaW1hdGlvbiBmdW5jdGlvbnMgdXNlIGR1cmF0aW9uc1xuICAgICAqIGFzIGRlZmluZWQgYnkgbWlsbGlzZWNvbmRzLCB3aGlsZSBvdXIgZXh0ZXJuYWwgQVBJIGRlZmluZXMgdGhlbVxuICAgICAqIGFzIHNlY29uZHMuXG4gICAgICovXG4gICAgb3B0aW9ucy5kdXJhdGlvbiAmJiAob3B0aW9ucy5kdXJhdGlvbiA9IHNlY29uZHNUb01pbGxpc2Vjb25kcyhvcHRpb25zLmR1cmF0aW9uKSk7XG4gICAgb3B0aW9ucy5yZXBlYXREZWxheSAmJiAob3B0aW9ucy5yZXBlYXREZWxheSA9IHNlY29uZHNUb01pbGxpc2Vjb25kcyhvcHRpb25zLnJlcGVhdERlbGF5KSk7XG4gICAgLyoqXG4gICAgICogU3VwcG9ydCBkZXByZWNhdGVkIHdheSB0byBzZXQgaW5pdGlhbCB2YWx1ZS4gUHJlZmVyIGtleWZyYW1lIHN5bnRheC5cbiAgICAgKi9cbiAgICBpZiAob3B0aW9ucy5mcm9tICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgb3B0aW9ucy5rZXlmcmFtZXNbMF0gPSBvcHRpb25zLmZyb207XG4gICAgfVxuICAgIGxldCBzaG91bGRTa2lwID0gZmFsc2U7XG4gICAgaWYgKG9wdGlvbnMudHlwZSA9PT0gZmFsc2UgfHxcbiAgICAgICAgKG9wdGlvbnMuZHVyYXRpb24gPT09IDAgJiYgIW9wdGlvbnMucmVwZWF0RGVsYXkpKSB7XG4gICAgICAgIG1ha2VBbmltYXRpb25JbnN0YW50KG9wdGlvbnMpO1xuICAgICAgICBpZiAob3B0aW9ucy5kZWxheSA9PT0gMCkge1xuICAgICAgICAgICAgc2hvdWxkU2tpcCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1vdGlvbkdsb2JhbENvbmZpZy5pbnN0YW50QW5pbWF0aW9ucyB8fFxuICAgICAgICBNb3Rpb25HbG9iYWxDb25maWcuc2tpcEFuaW1hdGlvbnMgfHxcbiAgICAgICAgZWxlbWVudD8uc2hvdWxkU2tpcEFuaW1hdGlvbnMpIHtcbiAgICAgICAgc2hvdWxkU2tpcCA9IHRydWU7XG4gICAgICAgIG1ha2VBbmltYXRpb25JbnN0YW50KG9wdGlvbnMpO1xuICAgICAgICBvcHRpb25zLmRlbGF5ID0gMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSWYgdGhlIHRyYW5zaXRpb24gdHlwZSBvciBlYXNpbmcgaGFzIGJlZW4gZXhwbGljaXRseSBzZXQgYnkgdGhlIHVzZXJcbiAgICAgKiB0aGVuIHdlIGRvbid0IHdhbnQgdG8gYWxsb3cgZmxhdHRlbmluZyB0aGUgYW5pbWF0aW9uLlxuICAgICAqL1xuICAgIG9wdGlvbnMuYWxsb3dGbGF0dGVuID0gIXZhbHVlVHJhbnNpdGlvbi50eXBlICYmICF2YWx1ZVRyYW5zaXRpb24uZWFzZTtcbiAgICAvKipcbiAgICAgKiBJZiB3ZSBjYW4gb3IgbXVzdCBza2lwIGNyZWF0aW5nIHRoZSBhbmltYXRpb24sIGFuZCBhcHBseSBvbmx5XG4gICAgICogdGhlIGZpbmFsIGtleWZyYW1lLCBkbyBzby4gV2UgYWxzbyBjaGVjayBvbmNlIGtleWZyYW1lcyBhcmUgcmVzb2x2ZWQgYnV0XG4gICAgICogdGhpcyBlYXJseSBjaGVjayBwcmV2ZW50cyB0aGUgbmVlZCB0byBjcmVhdGUgYW4gYW5pbWF0aW9uIGF0IGFsbC5cbiAgICAgKi9cbiAgICBpZiAoc2hvdWxkU2tpcCAmJiAhaXNIYW5kb2ZmICYmIHZhbHVlLmdldCgpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgZmluYWxLZXlmcmFtZSA9IGdldEZpbmFsS2V5ZnJhbWUob3B0aW9ucy5rZXlmcmFtZXMsIHZhbHVlVHJhbnNpdGlvbik7XG4gICAgICAgIGlmIChmaW5hbEtleWZyYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZyYW1lLnVwZGF0ZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5vblVwZGF0ZShmaW5hbEtleWZyYW1lKTtcbiAgICAgICAgICAgICAgICBvcHRpb25zLm9uQ29tcGxldGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVRyYW5zaXRpb24uaXNTeW5jXG4gICAgICAgID8gbmV3IEpTQW5pbWF0aW9uKG9wdGlvbnMpXG4gICAgICAgIDogbmV3IEFzeW5jTW90aW9uVmFsdWVBbmltYXRpb24ob3B0aW9ucyk7XG59O1xuXG5leHBvcnQgeyBhbmltYXRlTW90aW9uVmFsdWUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1vdGlvbi12YWx1ZS5tanMubWFwXG4iLCJmdW5jdGlvbiBnZXRWYWx1ZVN0YXRlKHZpc3VhbEVsZW1lbnQpIHtcbiAgICBjb25zdCBzdGF0ZSA9IFt7fSwge31dO1xuICAgIHZpc3VhbEVsZW1lbnQ/LnZhbHVlcy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIHN0YXRlWzBdW2tleV0gPSB2YWx1ZS5nZXQoKTtcbiAgICAgICAgc3RhdGVbMV1ba2V5XSA9IHZhbHVlLmdldFZlbG9jaXR5KCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0YXRlO1xufVxuZnVuY3Rpb24gcmVzb2x2ZVZhcmlhbnRGcm9tUHJvcHMocHJvcHMsIGRlZmluaXRpb24sIGN1c3RvbSwgdmlzdWFsRWxlbWVudCkge1xuICAgIC8qKlxuICAgICAqIElmIHRoZSB2YXJpYW50IGRlZmluaXRpb24gaXMgYSBmdW5jdGlvbiwgcmVzb2x2ZS5cbiAgICAgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluaXRpb24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjb25zdCBbY3VycmVudCwgdmVsb2NpdHldID0gZ2V0VmFsdWVTdGF0ZSh2aXN1YWxFbGVtZW50KTtcbiAgICAgICAgZGVmaW5pdGlvbiA9IGRlZmluaXRpb24oY3VzdG9tICE9PSB1bmRlZmluZWQgPyBjdXN0b20gOiBwcm9wcy5jdXN0b20sIGN1cnJlbnQsIHZlbG9jaXR5KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSWYgdGhlIHZhcmlhbnQgZGVmaW5pdGlvbiBpcyBhIHZhcmlhbnQgbGFiZWwsIG9yXG4gICAgICogdGhlIGZ1bmN0aW9uIHJldHVybmVkIGEgdmFyaWFudCBsYWJlbCwgcmVzb2x2ZS5cbiAgICAgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluaXRpb24gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgZGVmaW5pdGlvbiA9IHByb3BzLnZhcmlhbnRzICYmIHByb3BzLnZhcmlhbnRzW2RlZmluaXRpb25dO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBdCB0aGlzIHBvaW50IHdlJ3ZlIHJlc29sdmVkIGJvdGggZnVuY3Rpb25zIGFuZCB2YXJpYW50IGxhYmVscyxcbiAgICAgKiBidXQgdGhlIHJlc29sdmVkIHZhcmlhbnQgbGFiZWwgbWlnaHQgaXRzZWxmIGhhdmUgYmVlbiBhIGZ1bmN0aW9uLlxuICAgICAqIElmIHNvLCByZXNvbHZlLiBUaGlzIGNhbiBvbmx5IGhhdmUgcmV0dXJuZWQgYSB2YWxpZCB0YXJnZXQgb2JqZWN0LlxuICAgICAqL1xuICAgIGlmICh0eXBlb2YgZGVmaW5pdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNvbnN0IFtjdXJyZW50LCB2ZWxvY2l0eV0gPSBnZXRWYWx1ZVN0YXRlKHZpc3VhbEVsZW1lbnQpO1xuICAgICAgICBkZWZpbml0aW9uID0gZGVmaW5pdGlvbihjdXN0b20gIT09IHVuZGVmaW5lZCA/IGN1c3RvbSA6IHByb3BzLmN1c3RvbSwgY3VycmVudCwgdmVsb2NpdHkpO1xuICAgIH1cbiAgICByZXR1cm4gZGVmaW5pdGlvbjtcbn1cblxuZXhwb3J0IHsgcmVzb2x2ZVZhcmlhbnRGcm9tUHJvcHMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlc29sdmUtdmFyaWFudHMubWpzLm1hcFxuIiwiaW1wb3J0IHsgcmVzb2x2ZVZhcmlhbnRGcm9tUHJvcHMgfSBmcm9tICcuL3Jlc29sdmUtdmFyaWFudHMubWpzJztcblxuZnVuY3Rpb24gcmVzb2x2ZVZhcmlhbnQodmlzdWFsRWxlbWVudCwgZGVmaW5pdGlvbiwgY3VzdG9tKSB7XG4gICAgY29uc3QgcHJvcHMgPSB2aXN1YWxFbGVtZW50LmdldFByb3BzKCk7XG4gICAgcmV0dXJuIHJlc29sdmVWYXJpYW50RnJvbVByb3BzKHByb3BzLCBkZWZpbml0aW9uLCBjdXN0b20gIT09IHVuZGVmaW5lZCA/IGN1c3RvbSA6IHByb3BzLmN1c3RvbSwgdmlzdWFsRWxlbWVudCk7XG59XG5cbmV4cG9ydCB7IHJlc29sdmVWYXJpYW50IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZXNvbHZlLWR5bmFtaWMtdmFyaWFudHMubWpzLm1hcFxuIiwiaW1wb3J0IHsgdHJhbnNmb3JtUHJvcE9yZGVyIH0gZnJvbSAnLi9rZXlzLXRyYW5zZm9ybS5tanMnO1xuXG5jb25zdCBwb3NpdGlvbmFsS2V5cyA9IG5ldyBTZXQoW1xuICAgIFwid2lkdGhcIixcbiAgICBcImhlaWdodFwiLFxuICAgIFwidG9wXCIsXG4gICAgXCJsZWZ0XCIsXG4gICAgXCJyaWdodFwiLFxuICAgIFwiYm90dG9tXCIsXG4gICAgLi4udHJhbnNmb3JtUHJvcE9yZGVyLFxuXSk7XG5cbmV4cG9ydCB7IHBvc2l0aW9uYWxLZXlzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1rZXlzLXBvc2l0aW9uLm1qcy5tYXBcbiIsImltcG9ydCB7IHdhcm5PbmNlLCBTdWJzY3JpcHRpb25NYW5hZ2VyLCB2ZWxvY2l0eVBlclNlY29uZCB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyB0aW1lIH0gZnJvbSAnLi4vZnJhbWVsb29wL3N5bmMtdGltZS5tanMnO1xuaW1wb3J0IHsgZnJhbWUgfSBmcm9tICcuLi9mcmFtZWxvb3AvZnJhbWUubWpzJztcblxuLyoqXG4gKiBNYXhpbXVtIHRpbWUgYmV0d2VlbiB0aGUgdmFsdWUgb2YgdHdvIGZyYW1lcywgYmV5b25kIHdoaWNoIHdlXG4gKiBhc3N1bWUgdGhlIHZlbG9jaXR5IGhhcyBzaW5jZSBiZWVuIDAuXG4gKi9cbmNvbnN0IE1BWF9WRUxPQ0lUWV9ERUxUQSA9IDMwO1xuY29uc3QgaXNGbG9hdCA9ICh2YWx1ZSkgPT4ge1xuICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdCh2YWx1ZSkpO1xufTtcbmNvbnN0IGNvbGxlY3RNb3Rpb25WYWx1ZXMgPSB7XG4gICAgY3VycmVudDogdW5kZWZpbmVkLFxufTtcbi8qKlxuICogYE1vdGlvblZhbHVlYCBpcyB1c2VkIHRvIHRyYWNrIHRoZSBzdGF0ZSBhbmQgdmVsb2NpdHkgb2YgbW90aW9uIHZhbHVlcy5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmNsYXNzIE1vdGlvblZhbHVlIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gaW5pdCAtIFRoZSBpbml0aWF0aW5nIHZhbHVlXG4gICAgICogQHBhcmFtIGNvbmZpZyAtIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgICAqXG4gICAgICogLSAgYHRyYW5zZm9ybWVyYDogQSBmdW5jdGlvbiB0byB0cmFuc2Zvcm0gaW5jb21pbmcgdmFsdWVzIHdpdGguXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoaW5pdCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUcmFja3Mgd2hldGhlciB0aGlzIHZhbHVlIGNhbiBvdXRwdXQgYSB2ZWxvY2l0eS4gQ3VycmVudGx5IHRoaXMgaXMgb25seSB0cnVlXG4gICAgICAgICAqIGlmIHRoZSB2YWx1ZSBpcyBudW1lcmljYWwsIGJ1dCB3ZSBtaWdodCBiZSBhYmxlIHRvIHdpZGVuIHRoZSBzY29wZSBoZXJlIGFuZCBzdXBwb3J0XG4gICAgICAgICAqIG90aGVyIHZhbHVlIHR5cGVzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAaW50ZXJuYWxcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2FuVHJhY2tWZWxvY2l0eSA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbiBvYmplY3QgY29udGFpbmluZyBhIFN1YnNjcmlwdGlvbk1hbmFnZXIgZm9yIGVhY2ggYWN0aXZlIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5ldmVudHMgPSB7fTtcbiAgICAgICAgdGhpcy51cGRhdGVBbmROb3RpZnkgPSAodikgPT4ge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFRpbWUgPSB0aW1lLm5vdygpO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiB3ZSdyZSB1cGRhdGluZyB0aGUgdmFsdWUgZHVyaW5nIGFub3RoZXIgZnJhbWUgb3IgZXZlbnRsb29wXG4gICAgICAgICAgICAgKiB0aGFuIHRoZSBwcmV2aW91cyBmcmFtZSwgdGhlbiB0aGUgd2Ugc2V0IHRoZSBwcmV2aW91cyBmcmFtZSB2YWx1ZVxuICAgICAgICAgICAgICogdG8gY3VycmVudC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHRoaXMudXBkYXRlZEF0ICE9PSBjdXJyZW50VGltZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0UHJldkZyYW1lVmFsdWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJldiA9IHRoaXMuY3VycmVudDtcbiAgICAgICAgICAgIHRoaXMuc2V0Q3VycmVudCh2KTtcbiAgICAgICAgICAgIC8vIFVwZGF0ZSB1cGRhdGUgc3Vic2NyaWJlcnNcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnQgIT09IHRoaXMucHJldikge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLmNoYW5nZT8ubm90aWZ5KHRoaXMuY3VycmVudCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVwZW5kZW50cykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGRlcGVuZGVudCBvZiB0aGlzLmRlcGVuZGVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcGVuZGVudC5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmhhc0FuaW1hdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2V0Q3VycmVudChpbml0KTtcbiAgICAgICAgdGhpcy5vd25lciA9IG9wdGlvbnMub3duZXI7XG4gICAgfVxuICAgIHNldEN1cnJlbnQoY3VycmVudCkge1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBjdXJyZW50O1xuICAgICAgICB0aGlzLnVwZGF0ZWRBdCA9IHRpbWUubm93KCk7XG4gICAgICAgIGlmICh0aGlzLmNhblRyYWNrVmVsb2NpdHkgPT09IG51bGwgJiYgY3VycmVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNhblRyYWNrVmVsb2NpdHkgPSBpc0Zsb2F0KHRoaXMuY3VycmVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2V0UHJldkZyYW1lVmFsdWUocHJldkZyYW1lVmFsdWUgPSB0aGlzLmN1cnJlbnQpIHtcbiAgICAgICAgdGhpcy5wcmV2RnJhbWVWYWx1ZSA9IHByZXZGcmFtZVZhbHVlO1xuICAgICAgICB0aGlzLnByZXZVcGRhdGVkQXQgPSB0aGlzLnVwZGF0ZWRBdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkcyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBub3RpZmllZCB3aGVuIHRoZSBgTW90aW9uVmFsdWVgIGlzIHVwZGF0ZWQuXG4gICAgICpcbiAgICAgKiBJdCByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsIHdpbGwgY2FuY2VsIHRoZSBzdWJzY3JpcHRpb24uXG4gICAgICpcbiAgICAgKiBXaGVuIGNhbGxpbmcgYG9uQ2hhbmdlYCBpbnNpZGUgYSBSZWFjdCBjb21wb25lbnQsIGl0IHNob3VsZCBiZSB3cmFwcGVkIHdpdGggdGhlXG4gICAgICogYHVzZUVmZmVjdGAgaG9vay4gQXMgaXQgcmV0dXJucyBhbiB1bnN1YnNjcmliZSBmdW5jdGlvbiwgdGhpcyBzaG91bGQgYmUgcmV0dXJuZWRcbiAgICAgKiBmcm9tIHRoZSBgdXNlRWZmZWN0YCBmdW5jdGlvbiB0byBlbnN1cmUgeW91IGRvbid0IGFkZCBkdXBsaWNhdGUgc3Vic2NyaWJlcnMuLlxuICAgICAqXG4gICAgICogYGBganN4XG4gICAgICogZXhwb3J0IGNvbnN0IE15Q29tcG9uZW50ID0gKCkgPT4ge1xuICAgICAqICAgY29uc3QgeCA9IHVzZU1vdGlvblZhbHVlKDApXG4gICAgICogICBjb25zdCB5ID0gdXNlTW90aW9uVmFsdWUoMClcbiAgICAgKiAgIGNvbnN0IG9wYWNpdHkgPSB1c2VNb3Rpb25WYWx1ZSgxKVxuICAgICAqXG4gICAgICogICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAqICAgICBmdW5jdGlvbiB1cGRhdGVPcGFjaXR5KCkge1xuICAgICAqICAgICAgIGNvbnN0IG1heFhZID0gTWF0aC5tYXgoeC5nZXQoKSwgeS5nZXQoKSlcbiAgICAgKiAgICAgICBjb25zdCBuZXdPcGFjaXR5ID0gdHJhbnNmb3JtKG1heFhZLCBbMCwgMTAwXSwgWzEsIDBdKVxuICAgICAqICAgICAgIG9wYWNpdHkuc2V0KG5ld09wYWNpdHkpXG4gICAgICogICAgIH1cbiAgICAgKlxuICAgICAqICAgICBjb25zdCB1bnN1YnNjcmliZVggPSB4Lm9uKFwiY2hhbmdlXCIsIHVwZGF0ZU9wYWNpdHkpXG4gICAgICogICAgIGNvbnN0IHVuc3Vic2NyaWJlWSA9IHkub24oXCJjaGFuZ2VcIiwgdXBkYXRlT3BhY2l0eSlcbiAgICAgKlxuICAgICAqICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAqICAgICAgIHVuc3Vic2NyaWJlWCgpXG4gICAgICogICAgICAgdW5zdWJzY3JpYmVZKClcbiAgICAgKiAgICAgfVxuICAgICAqICAgfSwgW10pXG4gICAgICpcbiAgICAgKiAgIHJldHVybiA8bW90aW9uLmRpdiBzdHlsZT17eyB4IH19IC8+XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHBhcmFtIHN1YnNjcmliZXIgLSBBIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgdGhlIGxhdGVzdCB2YWx1ZS5cbiAgICAgKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLCB3aWxsIGNhbmNlbCB0aGlzIHN1YnNjcmlwdGlvbi5cbiAgICAgKlxuICAgICAqIEBkZXByZWNhdGVkXG4gICAgICovXG4gICAgb25DaGFuZ2Uoc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgICAgIHdhcm5PbmNlKGZhbHNlLCBgdmFsdWUub25DaGFuZ2UoY2FsbGJhY2spIGlzIGRlcHJlY2F0ZWQuIFN3aXRjaCB0byB2YWx1ZS5vbihcImNoYW5nZVwiLCBjYWxsYmFjaykuYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMub24oXCJjaGFuZ2VcIiwgc3Vic2NyaXB0aW9uKTtcbiAgICB9XG4gICAgb24oZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoIXRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPSBuZXcgU3Vic2NyaXB0aW9uTWFuYWdlcigpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHVuc3Vic2NyaWJlID0gdGhpcy5ldmVudHNbZXZlbnROYW1lXS5hZGQoY2FsbGJhY2spO1xuICAgICAgICBpZiAoZXZlbnROYW1lID09PSBcImNoYW5nZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgd2UgaGF2ZSBubyBtb3JlIGNoYW5nZSBsaXN0ZW5lcnMgYnkgdGhlIHN0YXJ0XG4gICAgICAgICAgICAgICAgICogb2YgdGhlIG5leHQgZnJhbWUsIHN0b3AgYWN0aXZlIGFuaW1hdGlvbnMuXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZnJhbWUucmVhZCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5ldmVudHMuY2hhbmdlLmdldFNpemUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuc3Vic2NyaWJlO1xuICAgIH1cbiAgICBjbGVhckxpc3RlbmVycygpIHtcbiAgICAgICAgZm9yIChjb25zdCBldmVudE1hbmFnZXJzIGluIHRoaXMuZXZlbnRzKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudE1hbmFnZXJzXS5jbGVhcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEF0dGFjaGVzIGEgcGFzc2l2ZSBlZmZlY3QgdG8gdGhlIGBNb3Rpb25WYWx1ZWAuXG4gICAgICovXG4gICAgYXR0YWNoKHBhc3NpdmVFZmZlY3QsIHN0b3BQYXNzaXZlRWZmZWN0KSB7XG4gICAgICAgIHRoaXMucGFzc2l2ZUVmZmVjdCA9IHBhc3NpdmVFZmZlY3Q7XG4gICAgICAgIHRoaXMuc3RvcFBhc3NpdmVFZmZlY3QgPSBzdG9wUGFzc2l2ZUVmZmVjdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgc3RhdGUgb2YgdGhlIGBNb3Rpb25WYWx1ZWAuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqXG4gICAgICogYGBganN4XG4gICAgICogY29uc3QgeCA9IHVzZU1vdGlvblZhbHVlKDApXG4gICAgICogeC5zZXQoMTApXG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbGF0ZXN0IC0gTGF0ZXN0IHZhbHVlIHRvIHNldC5cbiAgICAgKiBAcGFyYW0gcmVuZGVyIC0gV2hldGhlciB0byBub3RpZnkgcmVuZGVyIHN1YnNjcmliZXJzLiBEZWZhdWx0cyB0byBgdHJ1ZWBcbiAgICAgKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBzZXQodikge1xuICAgICAgICBpZiAoIXRoaXMucGFzc2l2ZUVmZmVjdCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVBbmROb3RpZnkodik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhc3NpdmVFZmZlY3QodiwgdGhpcy51cGRhdGVBbmROb3RpZnkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNldFdpdGhWZWxvY2l0eShwcmV2LCBjdXJyZW50LCBkZWx0YSkge1xuICAgICAgICB0aGlzLnNldChjdXJyZW50KTtcbiAgICAgICAgdGhpcy5wcmV2ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnByZXZGcmFtZVZhbHVlID0gcHJldjtcbiAgICAgICAgdGhpcy5wcmV2VXBkYXRlZEF0ID0gdGhpcy51cGRhdGVkQXQgLSBkZWx0YTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBzdGF0ZSBvZiB0aGUgYE1vdGlvblZhbHVlYCwgc3RvcHBpbmcgYW55IGFjdGl2ZSBhbmltYXRpb25zLFxuICAgICAqIGVmZmVjdHMsIGFuZCByZXNldHMgdmVsb2NpdHkgdG8gYDBgLlxuICAgICAqL1xuICAgIGp1bXAodiwgZW5kQW5pbWF0aW9uID0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnVwZGF0ZUFuZE5vdGlmeSh2KTtcbiAgICAgICAgdGhpcy5wcmV2ID0gdjtcbiAgICAgICAgdGhpcy5wcmV2VXBkYXRlZEF0ID0gdGhpcy5wcmV2RnJhbWVWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgZW5kQW5pbWF0aW9uICYmIHRoaXMuc3RvcCgpO1xuICAgICAgICBpZiAodGhpcy5zdG9wUGFzc2l2ZUVmZmVjdClcbiAgICAgICAgICAgIHRoaXMuc3RvcFBhc3NpdmVFZmZlY3QoKTtcbiAgICB9XG4gICAgZGlydHkoKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzLmNoYW5nZT8ubm90aWZ5KHRoaXMuY3VycmVudCk7XG4gICAgfVxuICAgIGFkZERlcGVuZGVudChkZXBlbmRlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRlcGVuZGVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuZGVwZW5kZW50cyA9IG5ldyBTZXQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlcGVuZGVudHMuYWRkKGRlcGVuZGVudCk7XG4gICAgfVxuICAgIHJlbW92ZURlcGVuZGVudChkZXBlbmRlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZGVwZW5kZW50cykge1xuICAgICAgICAgICAgdGhpcy5kZXBlbmRlbnRzLmRlbGV0ZShkZXBlbmRlbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGxhdGVzdCBzdGF0ZSBvZiBgTW90aW9uVmFsdWVgXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyAtIFRoZSBsYXRlc3Qgc3RhdGUgb2YgYE1vdGlvblZhbHVlYFxuICAgICAqXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGdldCgpIHtcbiAgICAgICAgaWYgKGNvbGxlY3RNb3Rpb25WYWx1ZXMuY3VycmVudCkge1xuICAgICAgICAgICAgY29sbGVjdE1vdGlvblZhbHVlcy5jdXJyZW50LnB1c2godGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGdldFByZXZpb3VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmV2O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBsYXRlc3QgdmVsb2NpdHkgb2YgYE1vdGlvblZhbHVlYFxuICAgICAqXG4gICAgICogQHJldHVybnMgLSBUaGUgbGF0ZXN0IHZlbG9jaXR5IG9mIGBNb3Rpb25WYWx1ZWAuIFJldHVybnMgYDBgIGlmIHRoZSBzdGF0ZSBpcyBub24tbnVtZXJpY2FsLlxuICAgICAqXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGdldFZlbG9jaXR5KCkge1xuICAgICAgICBjb25zdCBjdXJyZW50VGltZSA9IHRpbWUubm93KCk7XG4gICAgICAgIGlmICghdGhpcy5jYW5UcmFja1ZlbG9jaXR5IHx8XG4gICAgICAgICAgICB0aGlzLnByZXZGcmFtZVZhbHVlID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lIC0gdGhpcy51cGRhdGVkQXQgPiBNQVhfVkVMT0NJVFlfREVMVEEpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlbHRhID0gTWF0aC5taW4odGhpcy51cGRhdGVkQXQgLSB0aGlzLnByZXZVcGRhdGVkQXQsIE1BWF9WRUxPQ0lUWV9ERUxUQSk7XG4gICAgICAgIC8vIENhc3RzIGJlY2F1c2Ugb2YgcGFyc2VGbG9hdCdzIHBvb3IgdHlwaW5nXG4gICAgICAgIHJldHVybiB2ZWxvY2l0eVBlclNlY29uZChwYXJzZUZsb2F0KHRoaXMuY3VycmVudCkgLVxuICAgICAgICAgICAgcGFyc2VGbG9hdCh0aGlzLnByZXZGcmFtZVZhbHVlKSwgZGVsdGEpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSBuZXcgYW5pbWF0aW9uIHRvIGNvbnRyb2wgdGhpcyBgTW90aW9uVmFsdWVgLiBPbmx5IG9uZVxuICAgICAqIGFuaW1hdGlvbiBjYW4gZHJpdmUgYSBgTW90aW9uVmFsdWVgIGF0IG9uZSB0aW1lLlxuICAgICAqXG4gICAgICogYGBganN4XG4gICAgICogdmFsdWUuc3RhcnQoKVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHBhcmFtIGFuaW1hdGlvbiAtIEEgZnVuY3Rpb24gdGhhdCBzdGFydHMgdGhlIHByb3ZpZGVkIGFuaW1hdGlvblxuICAgICAqL1xuICAgIHN0YXJ0KHN0YXJ0QW5pbWF0aW9uKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGFzQW5pbWF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24gPSBzdGFydEFuaW1hdGlvbihyZXNvbHZlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmV2ZW50cy5hbmltYXRpb25TdGFydCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLmFuaW1hdGlvblN0YXJ0Lm5vdGlmeSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmV2ZW50cy5hbmltYXRpb25Db21wbGV0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLmFuaW1hdGlvbkNvbXBsZXRlLm5vdGlmeSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jbGVhckFuaW1hdGlvbigpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3RvcCB0aGUgY3VycmVudGx5IGFjdGl2ZSBhbmltYXRpb24uXG4gICAgICpcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgc3RvcCgpIHtcbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5zdG9wKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5ldmVudHMuYW5pbWF0aW9uQ2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuYW5pbWF0aW9uQ2FuY2VsLm5vdGlmeSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xlYXJBbmltYXRpb24oKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhpcyB2YWx1ZSBpcyBjdXJyZW50bHkgYW5pbWF0aW5nLlxuICAgICAqXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGlzQW5pbWF0aW5nKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLmFuaW1hdGlvbjtcbiAgICB9XG4gICAgY2xlYXJBbmltYXRpb24oKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmFuaW1hdGlvbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGVzdHJveSBhbmQgY2xlYW4gdXAgc3Vic2NyaWJlcnMgdG8gdGhpcyBgTW90aW9uVmFsdWVgLlxuICAgICAqXG4gICAgICogVGhlIGBNb3Rpb25WYWx1ZWAgaG9va3MgbGlrZSBgdXNlTW90aW9uVmFsdWVgIGFuZCBgdXNlVHJhbnNmb3JtYCBhdXRvbWF0aWNhbGx5XG4gICAgICogaGFuZGxlIHRoZSBsaWZlY3ljbGUgb2YgdGhlIHJldHVybmVkIGBNb3Rpb25WYWx1ZWAsIHNvIHRoaXMgbWV0aG9kIGlzIG9ubHkgbmVjZXNzYXJ5IGlmIHlvdSd2ZSBtYW51YWxseVxuICAgICAqIGNyZWF0ZWQgYSBgTW90aW9uVmFsdWVgIHZpYSB0aGUgYG1vdGlvblZhbHVlYCBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLmRlcGVuZGVudHM/LmNsZWFyKCk7XG4gICAgICAgIHRoaXMuZXZlbnRzLmRlc3Ryb3k/Lm5vdGlmeSgpO1xuICAgICAgICB0aGlzLmNsZWFyTGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICBpZiAodGhpcy5zdG9wUGFzc2l2ZUVmZmVjdCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wUGFzc2l2ZUVmZmVjdCgpO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gbW90aW9uVmFsdWUoaW5pdCwgb3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgTW90aW9uVmFsdWUoaW5pdCwgb3B0aW9ucyk7XG59XG5cbmV4cG9ydCB7IE1vdGlvblZhbHVlLCBjb2xsZWN0TW90aW9uVmFsdWVzLCBtb3Rpb25WYWx1ZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXgubWpzLm1hcFxuIiwiY29uc3QgaXNLZXlmcmFtZXNUYXJnZXQgPSAodikgPT4ge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHYpO1xufTtcblxuZXhwb3J0IHsgaXNLZXlmcmFtZXNUYXJnZXQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzLWtleWZyYW1lcy10YXJnZXQubWpzLm1hcFxuIiwiaW1wb3J0IHsgbW90aW9uVmFsdWUgfSBmcm9tICcuLi8uLi92YWx1ZS9pbmRleC5tanMnO1xuaW1wb3J0IHsgcmVzb2x2ZVZhcmlhbnQgfSBmcm9tICcuL3Jlc29sdmUtZHluYW1pYy12YXJpYW50cy5tanMnO1xuaW1wb3J0IHsgaXNLZXlmcmFtZXNUYXJnZXQgfSBmcm9tICcuL2lzLWtleWZyYW1lcy10YXJnZXQubWpzJztcblxuLyoqXG4gKiBTZXQgVmlzdWFsRWxlbWVudCdzIE1vdGlvblZhbHVlLCBjcmVhdGluZyBhIG5ldyBNb3Rpb25WYWx1ZSBmb3IgaXQgaWZcbiAqIGl0IGRvZXNuJ3QgZXhpc3QuXG4gKi9cbmZ1bmN0aW9uIHNldE1vdGlvblZhbHVlKHZpc3VhbEVsZW1lbnQsIGtleSwgdmFsdWUpIHtcbiAgICBpZiAodmlzdWFsRWxlbWVudC5oYXNWYWx1ZShrZXkpKSB7XG4gICAgICAgIHZpc3VhbEVsZW1lbnQuZ2V0VmFsdWUoa2V5KS5zZXQodmFsdWUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmlzdWFsRWxlbWVudC5hZGRWYWx1ZShrZXksIG1vdGlvblZhbHVlKHZhbHVlKSk7XG4gICAgfVxufVxuZnVuY3Rpb24gcmVzb2x2ZUZpbmFsVmFsdWVJbktleWZyYW1lcyh2KSB7XG4gICAgLy8gVE9ETyBtYXliZSB0aHJvdyBpZiB2Lmxlbmd0aCAtIDEgaXMgcGxhY2Vob2xkZXIgdG9rZW4/XG4gICAgcmV0dXJuIGlzS2V5ZnJhbWVzVGFyZ2V0KHYpID8gdlt2Lmxlbmd0aCAtIDFdIHx8IDAgOiB2O1xufVxuZnVuY3Rpb24gc2V0VGFyZ2V0KHZpc3VhbEVsZW1lbnQsIGRlZmluaXRpb24pIHtcbiAgICBjb25zdCByZXNvbHZlZCA9IHJlc29sdmVWYXJpYW50KHZpc3VhbEVsZW1lbnQsIGRlZmluaXRpb24pO1xuICAgIGxldCB7IHRyYW5zaXRpb25FbmQgPSB7fSwgdHJhbnNpdGlvbiA9IHt9LCAuLi50YXJnZXQgfSA9IHJlc29sdmVkIHx8IHt9O1xuICAgIHRhcmdldCA9IHsgLi4udGFyZ2V0LCAuLi50cmFuc2l0aW9uRW5kIH07XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGFyZ2V0KSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gcmVzb2x2ZUZpbmFsVmFsdWVJbktleWZyYW1lcyh0YXJnZXRba2V5XSk7XG4gICAgICAgIHNldE1vdGlvblZhbHVlKHZpc3VhbEVsZW1lbnQsIGtleSwgdmFsdWUpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgc2V0VGFyZ2V0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zZXR0ZXJzLm1qcy5tYXBcbiIsImNvbnN0IGlzTW90aW9uVmFsdWUgPSAodmFsdWUpID0+IEJvb2xlYW4odmFsdWUgJiYgdmFsdWUuZ2V0VmVsb2NpdHkpO1xuXG5leHBvcnQgeyBpc01vdGlvblZhbHVlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pcy1tb3Rpb24tdmFsdWUubWpzLm1hcFxuIiwiaW1wb3J0IHsgaXNNb3Rpb25WYWx1ZSB9IGZyb20gJy4uL3V0aWxzL2lzLW1vdGlvbi12YWx1ZS5tanMnO1xuXG5mdW5jdGlvbiBpc1dpbGxDaGFuZ2VNb3Rpb25WYWx1ZSh2YWx1ZSkge1xuICAgIHJldHVybiBCb29sZWFuKGlzTW90aW9uVmFsdWUodmFsdWUpICYmIHZhbHVlLmFkZCk7XG59XG5cbmV4cG9ydCB7IGlzV2lsbENoYW5nZU1vdGlvblZhbHVlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pcy5tanMubWFwXG4iLCJpbXBvcnQgeyBNb3Rpb25HbG9iYWxDb25maWcgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgaXNXaWxsQ2hhbmdlTW90aW9uVmFsdWUgfSBmcm9tICcuL2lzLm1qcyc7XG5cbmZ1bmN0aW9uIGFkZFZhbHVlVG9XaWxsQ2hhbmdlKHZpc3VhbEVsZW1lbnQsIGtleSkge1xuICAgIGNvbnN0IHdpbGxDaGFuZ2UgPSB2aXN1YWxFbGVtZW50LmdldFZhbHVlKFwid2lsbENoYW5nZVwiKTtcbiAgICAvKipcbiAgICAgKiBJdCBjb3VsZCBiZSB0aGF0IGEgdXNlciBoYXMgc2V0IHdpbGxDaGFuZ2UgdG8gYSByZWd1bGFyIE1vdGlvblZhbHVlLFxuICAgICAqIGluIHdoaWNoIGNhc2Ugd2UgY2FuJ3QgYWRkIHRoZSB2YWx1ZSB0byBpdC5cbiAgICAgKi9cbiAgICBpZiAoaXNXaWxsQ2hhbmdlTW90aW9uVmFsdWUod2lsbENoYW5nZSkpIHtcbiAgICAgICAgcmV0dXJuIHdpbGxDaGFuZ2UuYWRkKGtleSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKCF3aWxsQ2hhbmdlICYmIE1vdGlvbkdsb2JhbENvbmZpZy5XaWxsQ2hhbmdlKSB7XG4gICAgICAgIGNvbnN0IG5ld1dpbGxDaGFuZ2UgPSBuZXcgTW90aW9uR2xvYmFsQ29uZmlnLldpbGxDaGFuZ2UoXCJhdXRvXCIpO1xuICAgICAgICB2aXN1YWxFbGVtZW50LmFkZFZhbHVlKFwid2lsbENoYW5nZVwiLCBuZXdXaWxsQ2hhbmdlKTtcbiAgICAgICAgbmV3V2lsbENoYW5nZS5hZGQoa2V5KTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IGFkZFZhbHVlVG9XaWxsQ2hhbmdlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hZGQtd2lsbC1jaGFuZ2UubWpzLm1hcFxuIiwiZnVuY3Rpb24gY2FtZWxUb0Rhc2goc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW0EtWl0pL2csIChtYXRjaCkgPT4gYC0ke21hdGNoLnRvTG93ZXJDYXNlKCl9YCk7XG59XG5cbmV4cG9ydCB7IGNhbWVsVG9EYXNoIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jYW1lbC10by1kYXNoLm1qcy5tYXBcbiIsImltcG9ydCB7IGNhbWVsVG9EYXNoIH0gZnJvbSAnLi4vLi4vcmVuZGVyL2RvbS91dGlscy9jYW1lbC10by1kYXNoLm1qcyc7XG5cbmNvbnN0IG9wdGltaXplZEFwcGVhckRhdGFJZCA9IFwiZnJhbWVyQXBwZWFySWRcIjtcbmNvbnN0IG9wdGltaXplZEFwcGVhckRhdGFBdHRyaWJ1dGUgPSBcImRhdGEtXCIgKyBjYW1lbFRvRGFzaChvcHRpbWl6ZWRBcHBlYXJEYXRhSWQpO1xuXG5leHBvcnQgeyBvcHRpbWl6ZWRBcHBlYXJEYXRhQXR0cmlidXRlLCBvcHRpbWl6ZWRBcHBlYXJEYXRhSWQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGEtaWQubWpzLm1hcFxuIiwiaW1wb3J0IHsgb3B0aW1pemVkQXBwZWFyRGF0YUF0dHJpYnV0ZSB9IGZyb20gJy4vZGF0YS1pZC5tanMnO1xuXG5mdW5jdGlvbiBnZXRPcHRpbWlzZWRBcHBlYXJJZCh2aXN1YWxFbGVtZW50KSB7XG4gICAgcmV0dXJuIHZpc3VhbEVsZW1lbnQucHJvcHNbb3B0aW1pemVkQXBwZWFyRGF0YUF0dHJpYnV0ZV07XG59XG5cbmV4cG9ydCB7IGdldE9wdGltaXNlZEFwcGVhcklkIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1nZXQtYXBwZWFyLWlkLm1qcy5tYXBcbiIsImltcG9ydCB7IGdldFZhbHVlVHJhbnNpdGlvbiB9IGZyb20gJy4uL3V0aWxzL2dldC12YWx1ZS10cmFuc2l0aW9uLm1qcyc7XG5pbXBvcnQgeyByZXNvbHZlVHJhbnNpdGlvbiB9IGZyb20gJy4uL3V0aWxzL3Jlc29sdmUtdHJhbnNpdGlvbi5tanMnO1xuaW1wb3J0IHsgcG9zaXRpb25hbEtleXMgfSBmcm9tICcuLi8uLi9yZW5kZXIvdXRpbHMva2V5cy1wb3NpdGlvbi5tanMnO1xuaW1wb3J0IHsgc2V0VGFyZ2V0IH0gZnJvbSAnLi4vLi4vcmVuZGVyL3V0aWxzL3NldHRlcnMubWpzJztcbmltcG9ydCB7IGFkZFZhbHVlVG9XaWxsQ2hhbmdlIH0gZnJvbSAnLi4vLi4vdmFsdWUvd2lsbC1jaGFuZ2UvYWRkLXdpbGwtY2hhbmdlLm1qcyc7XG5pbXBvcnQgeyBnZXRPcHRpbWlzZWRBcHBlYXJJZCB9IGZyb20gJy4uL29wdGltaXplZC1hcHBlYXIvZ2V0LWFwcGVhci1pZC5tanMnO1xuaW1wb3J0IHsgYW5pbWF0ZU1vdGlvblZhbHVlIH0gZnJvbSAnLi9tb3Rpb24tdmFsdWUubWpzJztcbmltcG9ydCB7IGZyYW1lIH0gZnJvbSAnLi4vLi4vZnJhbWVsb29wL2ZyYW1lLm1qcyc7XG5cbi8qKlxuICogRGVjaWRlIHdoZXRoZXIgd2Ugc2hvdWxkIGJsb2NrIHRoaXMgYW5pbWF0aW9uLiBQcmV2aW91c2x5LCB3ZSBhY2hpZXZlZCB0aGlzXG4gKiBqdXN0IGJ5IGNoZWNraW5nIHdoZXRoZXIgdGhlIGtleSB3YXMgbGlzdGVkIGluIHByb3RlY3RlZEtleXMsIGJ1dCB0aGlzXG4gKiBwb3NlZCBwcm9ibGVtcyBpZiBhbiBhbmltYXRpb24gd2FzIHRyaWdnZXJlZCBieSBhZnRlckNoaWxkcmVuIGFuZCBwcm90ZWN0ZWRLZXlzXG4gKiBoYWQgYmVlbiBzZXQgdG8gdHJ1ZSBpbiB0aGUgbWVhbnRpbWUuXG4gKi9cbmZ1bmN0aW9uIHNob3VsZEJsb2NrQW5pbWF0aW9uKHsgcHJvdGVjdGVkS2V5cywgbmVlZHNBbmltYXRpbmcgfSwga2V5KSB7XG4gICAgY29uc3Qgc2hvdWxkQmxvY2sgPSBwcm90ZWN0ZWRLZXlzLmhhc093blByb3BlcnR5KGtleSkgJiYgbmVlZHNBbmltYXRpbmdba2V5XSAhPT0gdHJ1ZTtcbiAgICBuZWVkc0FuaW1hdGluZ1trZXldID0gZmFsc2U7XG4gICAgcmV0dXJuIHNob3VsZEJsb2NrO1xufVxuZnVuY3Rpb24gYW5pbWF0ZVRhcmdldCh2aXN1YWxFbGVtZW50LCB0YXJnZXRBbmRUcmFuc2l0aW9uLCB7IGRlbGF5ID0gMCwgdHJhbnNpdGlvbk92ZXJyaWRlLCB0eXBlIH0gPSB7fSkge1xuICAgIGxldCB7IHRyYW5zaXRpb24sIHRyYW5zaXRpb25FbmQsIC4uLnRhcmdldCB9ID0gdGFyZ2V0QW5kVHJhbnNpdGlvbjtcbiAgICBjb25zdCBkZWZhdWx0VHJhbnNpdGlvbiA9IHZpc3VhbEVsZW1lbnQuZ2V0RGVmYXVsdFRyYW5zaXRpb24oKTtcbiAgICB0cmFuc2l0aW9uID0gdHJhbnNpdGlvblxuICAgICAgICA/IHJlc29sdmVUcmFuc2l0aW9uKHRyYW5zaXRpb24sIGRlZmF1bHRUcmFuc2l0aW9uKVxuICAgICAgICA6IGRlZmF1bHRUcmFuc2l0aW9uO1xuICAgIGNvbnN0IHJlZHVjZU1vdGlvbiA9IHRyYW5zaXRpb24/LnJlZHVjZU1vdGlvbjtcbiAgICBpZiAodHJhbnNpdGlvbk92ZXJyaWRlKVxuICAgICAgICB0cmFuc2l0aW9uID0gdHJhbnNpdGlvbk92ZXJyaWRlO1xuICAgIGNvbnN0IGFuaW1hdGlvbnMgPSBbXTtcbiAgICBjb25zdCBhbmltYXRpb25UeXBlU3RhdGUgPSB0eXBlICYmXG4gICAgICAgIHZpc3VhbEVsZW1lbnQuYW5pbWF0aW9uU3RhdGUgJiZcbiAgICAgICAgdmlzdWFsRWxlbWVudC5hbmltYXRpb25TdGF0ZS5nZXRTdGF0ZSgpW3R5cGVdO1xuICAgIGZvciAoY29uc3Qga2V5IGluIHRhcmdldCkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHZpc3VhbEVsZW1lbnQuZ2V0VmFsdWUoa2V5LCB2aXN1YWxFbGVtZW50LmxhdGVzdFZhbHVlc1trZXldID8/IG51bGwpO1xuICAgICAgICBjb25zdCB2YWx1ZVRhcmdldCA9IHRhcmdldFtrZXldO1xuICAgICAgICBpZiAodmFsdWVUYXJnZXQgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgKGFuaW1hdGlvblR5cGVTdGF0ZSAmJlxuICAgICAgICAgICAgICAgIHNob3VsZEJsb2NrQW5pbWF0aW9uKGFuaW1hdGlvblR5cGVTdGF0ZSwga2V5KSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHZhbHVlVHJhbnNpdGlvbiA9IHtcbiAgICAgICAgICAgIGRlbGF5LFxuICAgICAgICAgICAgLi4uZ2V0VmFsdWVUcmFuc2l0aW9uKHRyYW5zaXRpb24gfHwge30sIGtleSksXG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiB0aGUgdmFsdWUgaXMgYWxyZWFkeSBhdCB0aGUgZGVmaW5lZCB0YXJnZXQsIHNraXAgdGhlIGFuaW1hdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHZhbHVlLmdldCgpO1xuICAgICAgICBpZiAoY3VycmVudFZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgICF2YWx1ZS5pc0FuaW1hdGluZyAmJlxuICAgICAgICAgICAgIUFycmF5LmlzQXJyYXkodmFsdWVUYXJnZXQpICYmXG4gICAgICAgICAgICB2YWx1ZVRhcmdldCA9PT0gY3VycmVudFZhbHVlICYmXG4gICAgICAgICAgICAhdmFsdWVUcmFuc2l0aW9uLnZlbG9jaXR5KSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZSBhIHZhbHVlIGlzIGJlaW5nIGFuaW1hdGVkLCBjaGVja1xuICAgICAgICAgKiB0byBzZWUgaWYgd2UncmUgaGFuZGxpbmcgb2ZmIGZyb20gYW4gZXhpc3RpbmcgYW5pbWF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IGlzSGFuZG9mZiA9IGZhbHNlO1xuICAgICAgICBpZiAod2luZG93Lk1vdGlvbkhhbmRvZmZBbmltYXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IGFwcGVhcklkID0gZ2V0T3B0aW1pc2VkQXBwZWFySWQodmlzdWFsRWxlbWVudCk7XG4gICAgICAgICAgICBpZiAoYXBwZWFySWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydFRpbWUgPSB3aW5kb3cuTW90aW9uSGFuZG9mZkFuaW1hdGlvbihhcHBlYXJJZCwga2V5LCBmcmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0VGltZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZVRyYW5zaXRpb24uc3RhcnRUaW1lID0gc3RhcnRUaW1lO1xuICAgICAgICAgICAgICAgICAgICBpc0hhbmRvZmYgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhZGRWYWx1ZVRvV2lsbENoYW5nZSh2aXN1YWxFbGVtZW50LCBrZXkpO1xuICAgICAgICBjb25zdCBzaG91bGRSZWR1Y2VNb3Rpb24gPSByZWR1Y2VNb3Rpb24gPz8gdmlzdWFsRWxlbWVudC5zaG91bGRSZWR1Y2VNb3Rpb247XG4gICAgICAgIHZhbHVlLnN0YXJ0KGFuaW1hdGVNb3Rpb25WYWx1ZShrZXksIHZhbHVlLCB2YWx1ZVRhcmdldCwgc2hvdWxkUmVkdWNlTW90aW9uICYmIHBvc2l0aW9uYWxLZXlzLmhhcyhrZXkpXG4gICAgICAgICAgICA/IHsgdHlwZTogZmFsc2UgfVxuICAgICAgICAgICAgOiB2YWx1ZVRyYW5zaXRpb24sIHZpc3VhbEVsZW1lbnQsIGlzSGFuZG9mZikpO1xuICAgICAgICBjb25zdCBhbmltYXRpb24gPSB2YWx1ZS5hbmltYXRpb247XG4gICAgICAgIGlmIChhbmltYXRpb24pIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbnMucHVzaChhbmltYXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh0cmFuc2l0aW9uRW5kKSB7XG4gICAgICAgIGNvbnN0IGFwcGx5VHJhbnNpdGlvbkVuZCA9ICgpID0+IGZyYW1lLnVwZGF0ZSgoKSA9PiB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uRW5kICYmIHNldFRhcmdldCh2aXN1YWxFbGVtZW50LCB0cmFuc2l0aW9uRW5kKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChhbmltYXRpb25zLmxlbmd0aCkge1xuICAgICAgICAgICAgUHJvbWlzZS5hbGwoYW5pbWF0aW9ucykudGhlbihhcHBseVRyYW5zaXRpb25FbmQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXBwbHlUcmFuc2l0aW9uRW5kKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFuaW1hdGlvbnM7XG59XG5cbmV4cG9ydCB7IGFuaW1hdGVUYXJnZXQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXZpc3VhbC1lbGVtZW50LXRhcmdldC5tanMubWFwXG4iLCIvKipcbiAqIFZhbHVlVHlwZSBmb3IgXCJhdXRvXCJcbiAqL1xuY29uc3QgYXV0byA9IHtcbiAgICB0ZXN0OiAodikgPT4gdiA9PT0gXCJhdXRvXCIsXG4gICAgcGFyc2U6ICh2KSA9PiB2LFxufTtcblxuZXhwb3J0IHsgYXV0byB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXV0by5tanMubWFwXG4iLCIvKipcbiAqIFRlc3RzIGEgcHJvdmlkZWQgdmFsdWUgYWdhaW5zdCBhIFZhbHVlVHlwZVxuICovXG5jb25zdCB0ZXN0VmFsdWVUeXBlID0gKHYpID0+ICh0eXBlKSA9PiB0eXBlLnRlc3Qodik7XG5cbmV4cG9ydCB7IHRlc3RWYWx1ZVR5cGUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRlc3QubWpzLm1hcFxuIiwiaW1wb3J0IHsgYXV0byB9IGZyb20gJy4vYXV0by5tanMnO1xuaW1wb3J0IHsgbnVtYmVyIH0gZnJvbSAnLi9udW1iZXJzL2luZGV4Lm1qcyc7XG5pbXBvcnQgeyBweCwgcGVyY2VudCwgZGVncmVlcywgdncsIHZoIH0gZnJvbSAnLi9udW1iZXJzL3VuaXRzLm1qcyc7XG5pbXBvcnQgeyB0ZXN0VmFsdWVUeXBlIH0gZnJvbSAnLi90ZXN0Lm1qcyc7XG5cbi8qKlxuICogQSBsaXN0IG9mIHZhbHVlIHR5cGVzIGNvbW1vbmx5IHVzZWQgZm9yIGRpbWVuc2lvbnNcbiAqL1xuY29uc3QgZGltZW5zaW9uVmFsdWVUeXBlcyA9IFtudW1iZXIsIHB4LCBwZXJjZW50LCBkZWdyZWVzLCB2dywgdmgsIGF1dG9dO1xuLyoqXG4gKiBUZXN0cyBhIGRpbWVuc2lvbmFsIHZhbHVlIGFnYWluc3QgdGhlIGxpc3Qgb2YgZGltZW5zaW9uIFZhbHVlVHlwZXNcbiAqL1xuY29uc3QgZmluZERpbWVuc2lvblZhbHVlVHlwZSA9ICh2KSA9PiBkaW1lbnNpb25WYWx1ZVR5cGVzLmZpbmQodGVzdFZhbHVlVHlwZSh2KSk7XG5cbmV4cG9ydCB7IGRpbWVuc2lvblZhbHVlVHlwZXMsIGZpbmREaW1lbnNpb25WYWx1ZVR5cGUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRpbWVuc2lvbnMubWpzLm1hcFxuIiwiaW1wb3J0IHsgaXNaZXJvVmFsdWVTdHJpbmcgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuXG5mdW5jdGlvbiBpc05vbmUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gMDtcbiAgICB9XG4gICAgZWxzZSBpZiAodmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSBcIm5vbmVcIiB8fCB2YWx1ZSA9PT0gXCIwXCIgfHwgaXNaZXJvVmFsdWVTdHJpbmcodmFsdWUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5leHBvcnQgeyBpc05vbmUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzLW5vbmUubWpzLm1hcFxuIiwiaW1wb3J0IHsgY29tcGxleCB9IGZyb20gJy4vaW5kZXgubWpzJztcbmltcG9ydCB7IGZsb2F0UmVnZXggfSBmcm9tICcuLi91dGlscy9mbG9hdC1yZWdleC5tanMnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgdGhhdCBzaG91bGQgZGVmYXVsdCB0byAxIG9yIDEwMCVcbiAqL1xuY29uc3QgbWF4RGVmYXVsdHMgPSBuZXcgU2V0KFtcImJyaWdodG5lc3NcIiwgXCJjb250cmFzdFwiLCBcInNhdHVyYXRlXCIsIFwib3BhY2l0eVwiXSk7XG5mdW5jdGlvbiBhcHBseURlZmF1bHRGaWx0ZXIodikge1xuICAgIGNvbnN0IFtuYW1lLCB2YWx1ZV0gPSB2LnNsaWNlKDAsIC0xKS5zcGxpdChcIihcIik7XG4gICAgaWYgKG5hbWUgPT09IFwiZHJvcC1zaGFkb3dcIilcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgY29uc3QgW251bWJlcl0gPSB2YWx1ZS5tYXRjaChmbG9hdFJlZ2V4KSB8fCBbXTtcbiAgICBpZiAoIW51bWJlcilcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgY29uc3QgdW5pdCA9IHZhbHVlLnJlcGxhY2UobnVtYmVyLCBcIlwiKTtcbiAgICBsZXQgZGVmYXVsdFZhbHVlID0gbWF4RGVmYXVsdHMuaGFzKG5hbWUpID8gMSA6IDA7XG4gICAgaWYgKG51bWJlciAhPT0gdmFsdWUpXG4gICAgICAgIGRlZmF1bHRWYWx1ZSAqPSAxMDA7XG4gICAgcmV0dXJuIG5hbWUgKyBcIihcIiArIGRlZmF1bHRWYWx1ZSArIHVuaXQgKyBcIilcIjtcbn1cbmNvbnN0IGZ1bmN0aW9uUmVnZXggPSAvXFxiKFthLXotXSopXFwoLio/XFwpL2d1O1xuY29uc3QgZmlsdGVyID0ge1xuICAgIC4uLmNvbXBsZXgsXG4gICAgZ2V0QW5pbWF0YWJsZU5vbmU6ICh2KSA9PiB7XG4gICAgICAgIGNvbnN0IGZ1bmN0aW9ucyA9IHYubWF0Y2goZnVuY3Rpb25SZWdleCk7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbnMgPyBmdW5jdGlvbnMubWFwKGFwcGx5RGVmYXVsdEZpbHRlcikuam9pbihcIiBcIikgOiB2O1xuICAgIH0sXG59O1xuXG5leHBvcnQgeyBmaWx0ZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci5tanMubWFwXG4iLCJpbXBvcnQgeyBjb21wbGV4IH0gZnJvbSAnLi9pbmRleC5tanMnO1xuXG5jb25zdCBtYXNrID0ge1xuICAgIC4uLmNvbXBsZXgsXG4gICAgZ2V0QW5pbWF0YWJsZU5vbmU6ICh2KSA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnNlZCA9IGNvbXBsZXgucGFyc2Uodik7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gY29tcGxleC5jcmVhdGVUcmFuc2Zvcm1lcih2KTtcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybWVyKHBhcnNlZC5tYXAoKHYpID0+IHR5cGVvZiB2ID09PSBcIm51bWJlclwiID8gMCA6IHR5cGVvZiB2ID09PSBcIm9iamVjdFwiID8geyAuLi52LCBhbHBoYTogMSB9IDogdikpO1xuICAgIH0sXG59O1xuXG5leHBvcnQgeyBtYXNrIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXNrLm1qcy5tYXBcbiIsImltcG9ydCB7IG51bWJlciB9IGZyb20gJy4vbnVtYmVycy9pbmRleC5tanMnO1xuXG5jb25zdCBpbnQgPSB7XG4gICAgLi4ubnVtYmVyLFxuICAgIHRyYW5zZm9ybTogTWF0aC5yb3VuZCxcbn07XG5cbmV4cG9ydCB7IGludCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW50Lm1qcy5tYXBcbiIsImltcG9ydCB7IGFscGhhLCBzY2FsZSB9IGZyb20gJy4uL251bWJlcnMvaW5kZXgubWpzJztcbmltcG9ydCB7IHB4LCBwcm9ncmVzc1BlcmNlbnRhZ2UsIGRlZ3JlZXMgfSBmcm9tICcuLi9udW1iZXJzL3VuaXRzLm1qcyc7XG5cbmNvbnN0IHRyYW5zZm9ybVZhbHVlVHlwZXMgPSB7XG4gICAgcm90YXRlOiBkZWdyZWVzLFxuICAgIHJvdGF0ZVg6IGRlZ3JlZXMsXG4gICAgcm90YXRlWTogZGVncmVlcyxcbiAgICByb3RhdGVaOiBkZWdyZWVzLFxuICAgIHNjYWxlLFxuICAgIHNjYWxlWDogc2NhbGUsXG4gICAgc2NhbGVZOiBzY2FsZSxcbiAgICBzY2FsZVo6IHNjYWxlLFxuICAgIHNrZXc6IGRlZ3JlZXMsXG4gICAgc2tld1g6IGRlZ3JlZXMsXG4gICAgc2tld1k6IGRlZ3JlZXMsXG4gICAgZGlzdGFuY2U6IHB4LFxuICAgIHRyYW5zbGF0ZVg6IHB4LFxuICAgIHRyYW5zbGF0ZVk6IHB4LFxuICAgIHRyYW5zbGF0ZVo6IHB4LFxuICAgIHg6IHB4LFxuICAgIHk6IHB4LFxuICAgIHo6IHB4LFxuICAgIHBlcnNwZWN0aXZlOiBweCxcbiAgICB0cmFuc2Zvcm1QZXJzcGVjdGl2ZTogcHgsXG4gICAgb3BhY2l0eTogYWxwaGEsXG4gICAgb3JpZ2luWDogcHJvZ3Jlc3NQZXJjZW50YWdlLFxuICAgIG9yaWdpblk6IHByb2dyZXNzUGVyY2VudGFnZSxcbiAgICBvcmlnaW5aOiBweCxcbn07XG5cbmV4cG9ydCB7IHRyYW5zZm9ybVZhbHVlVHlwZXMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRyYW5zZm9ybS5tanMubWFwXG4iLCJpbXBvcnQgeyBpbnQgfSBmcm9tICcuLi9pbnQubWpzJztcbmltcG9ydCB7IGFscGhhIH0gZnJvbSAnLi4vbnVtYmVycy9pbmRleC5tanMnO1xuaW1wb3J0IHsgcHggfSBmcm9tICcuLi9udW1iZXJzL3VuaXRzLm1qcyc7XG5pbXBvcnQgeyB0cmFuc2Zvcm1WYWx1ZVR5cGVzIH0gZnJvbSAnLi90cmFuc2Zvcm0ubWpzJztcblxuY29uc3QgbnVtYmVyVmFsdWVUeXBlcyA9IHtcbiAgICAvLyBCb3JkZXIgcHJvcHNcbiAgICBib3JkZXJXaWR0aDogcHgsXG4gICAgYm9yZGVyVG9wV2lkdGg6IHB4LFxuICAgIGJvcmRlclJpZ2h0V2lkdGg6IHB4LFxuICAgIGJvcmRlckJvdHRvbVdpZHRoOiBweCxcbiAgICBib3JkZXJMZWZ0V2lkdGg6IHB4LFxuICAgIGJvcmRlclJhZGl1czogcHgsXG4gICAgYm9yZGVyVG9wTGVmdFJhZGl1czogcHgsXG4gICAgYm9yZGVyVG9wUmlnaHRSYWRpdXM6IHB4LFxuICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiBweCxcbiAgICBib3JkZXJCb3R0b21MZWZ0UmFkaXVzOiBweCxcbiAgICAvLyBQb3NpdGlvbmluZyBwcm9wc1xuICAgIHdpZHRoOiBweCxcbiAgICBtYXhXaWR0aDogcHgsXG4gICAgaGVpZ2h0OiBweCxcbiAgICBtYXhIZWlnaHQ6IHB4LFxuICAgIHRvcDogcHgsXG4gICAgcmlnaHQ6IHB4LFxuICAgIGJvdHRvbTogcHgsXG4gICAgbGVmdDogcHgsXG4gICAgaW5zZXQ6IHB4LFxuICAgIGluc2V0QmxvY2s6IHB4LFxuICAgIGluc2V0QmxvY2tTdGFydDogcHgsXG4gICAgaW5zZXRCbG9ja0VuZDogcHgsXG4gICAgaW5zZXRJbmxpbmU6IHB4LFxuICAgIGluc2V0SW5saW5lU3RhcnQ6IHB4LFxuICAgIGluc2V0SW5saW5lRW5kOiBweCxcbiAgICAvLyBTcGFjaW5nIHByb3BzXG4gICAgcGFkZGluZzogcHgsXG4gICAgcGFkZGluZ1RvcDogcHgsXG4gICAgcGFkZGluZ1JpZ2h0OiBweCxcbiAgICBwYWRkaW5nQm90dG9tOiBweCxcbiAgICBwYWRkaW5nTGVmdDogcHgsXG4gICAgcGFkZGluZ0Jsb2NrOiBweCxcbiAgICBwYWRkaW5nQmxvY2tTdGFydDogcHgsXG4gICAgcGFkZGluZ0Jsb2NrRW5kOiBweCxcbiAgICBwYWRkaW5nSW5saW5lOiBweCxcbiAgICBwYWRkaW5nSW5saW5lU3RhcnQ6IHB4LFxuICAgIHBhZGRpbmdJbmxpbmVFbmQ6IHB4LFxuICAgIG1hcmdpbjogcHgsXG4gICAgbWFyZ2luVG9wOiBweCxcbiAgICBtYXJnaW5SaWdodDogcHgsXG4gICAgbWFyZ2luQm90dG9tOiBweCxcbiAgICBtYXJnaW5MZWZ0OiBweCxcbiAgICBtYXJnaW5CbG9jazogcHgsXG4gICAgbWFyZ2luQmxvY2tTdGFydDogcHgsXG4gICAgbWFyZ2luQmxvY2tFbmQ6IHB4LFxuICAgIG1hcmdpbklubGluZTogcHgsXG4gICAgbWFyZ2luSW5saW5lU3RhcnQ6IHB4LFxuICAgIG1hcmdpbklubGluZUVuZDogcHgsXG4gICAgLy8gVHlwb2dyYXBoeVxuICAgIGZvbnRTaXplOiBweCxcbiAgICAvLyBNaXNjXG4gICAgYmFja2dyb3VuZFBvc2l0aW9uWDogcHgsXG4gICAgYmFja2dyb3VuZFBvc2l0aW9uWTogcHgsXG4gICAgLi4udHJhbnNmb3JtVmFsdWVUeXBlcyxcbiAgICB6SW5kZXg6IGludCxcbiAgICAvLyBTVkdcbiAgICBmaWxsT3BhY2l0eTogYWxwaGEsXG4gICAgc3Ryb2tlT3BhY2l0eTogYWxwaGEsXG4gICAgbnVtT2N0YXZlczogaW50LFxufTtcblxuZXhwb3J0IHsgbnVtYmVyVmFsdWVUeXBlcyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bnVtYmVyLm1qcy5tYXBcbiIsImltcG9ydCB7IGNvbG9yIH0gZnJvbSAnLi4vY29sb3IvaW5kZXgubWpzJztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJy4uL2NvbXBsZXgvZmlsdGVyLm1qcyc7XG5pbXBvcnQgeyBtYXNrIH0gZnJvbSAnLi4vY29tcGxleC9tYXNrLm1qcyc7XG5pbXBvcnQgeyBudW1iZXJWYWx1ZVR5cGVzIH0gZnJvbSAnLi9udW1iZXIubWpzJztcblxuLyoqXG4gKiBBIG1hcCBvZiBkZWZhdWx0IHZhbHVlIHR5cGVzIGZvciBjb21tb24gdmFsdWVzXG4gKi9cbmNvbnN0IGRlZmF1bHRWYWx1ZVR5cGVzID0ge1xuICAgIC4uLm51bWJlclZhbHVlVHlwZXMsXG4gICAgLy8gQ29sb3IgcHJvcHNcbiAgICBjb2xvcixcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yLFxuICAgIG91dGxpbmVDb2xvcjogY29sb3IsXG4gICAgZmlsbDogY29sb3IsXG4gICAgc3Ryb2tlOiBjb2xvcixcbiAgICAvLyBCb3JkZXIgcHJvcHNcbiAgICBib3JkZXJDb2xvcjogY29sb3IsXG4gICAgYm9yZGVyVG9wQ29sb3I6IGNvbG9yLFxuICAgIGJvcmRlclJpZ2h0Q29sb3I6IGNvbG9yLFxuICAgIGJvcmRlckJvdHRvbUNvbG9yOiBjb2xvcixcbiAgICBib3JkZXJMZWZ0Q29sb3I6IGNvbG9yLFxuICAgIGZpbHRlcixcbiAgICBXZWJraXRGaWx0ZXI6IGZpbHRlcixcbiAgICBtYXNrLFxuICAgIFdlYmtpdE1hc2s6IG1hc2ssXG59O1xuLyoqXG4gKiBHZXRzIHRoZSBkZWZhdWx0IFZhbHVlVHlwZSBmb3IgdGhlIHByb3ZpZGVkIHZhbHVlIGtleVxuICovXG5jb25zdCBnZXREZWZhdWx0VmFsdWVUeXBlID0gKGtleSkgPT4gZGVmYXVsdFZhbHVlVHlwZXNba2V5XTtcblxuZXhwb3J0IHsgZGVmYXVsdFZhbHVlVHlwZXMsIGdldERlZmF1bHRWYWx1ZVR5cGUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlZmF1bHRzLm1qcy5tYXBcbiIsImltcG9ydCB7IGNvbXBsZXggfSBmcm9tICcuLi9jb21wbGV4L2luZGV4Lm1qcyc7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICcuLi9jb21wbGV4L2ZpbHRlci5tanMnO1xuaW1wb3J0IHsgbWFzayB9IGZyb20gJy4uL2NvbXBsZXgvbWFzay5tanMnO1xuaW1wb3J0IHsgZ2V0RGVmYXVsdFZhbHVlVHlwZSB9IGZyb20gJy4uL21hcHMvZGVmYXVsdHMubWpzJztcblxuY29uc3QgY3VzdG9tVHlwZXMgPSAvKkBfX1BVUkVfXyovIG5ldyBTZXQoW2ZpbHRlciwgbWFza10pO1xuZnVuY3Rpb24gZ2V0QW5pbWF0YWJsZU5vbmUoa2V5LCB2YWx1ZSkge1xuICAgIGxldCBkZWZhdWx0VmFsdWVUeXBlID0gZ2V0RGVmYXVsdFZhbHVlVHlwZShrZXkpO1xuICAgIGlmICghY3VzdG9tVHlwZXMuaGFzKGRlZmF1bHRWYWx1ZVR5cGUpKVxuICAgICAgICBkZWZhdWx0VmFsdWVUeXBlID0gY29tcGxleDtcbiAgICAvLyBJZiB2YWx1ZSBpcyBub3QgcmVjb2duaXNlZCBhcyBhbmltYXRhYmxlLCBpZSBcIm5vbmVcIiwgY3JlYXRlIGFuIGFuaW1hdGFibGUgdmVyc2lvbiBvcmlnaW4gYmFzZWQgb24gdGhlIHRhcmdldFxuICAgIHJldHVybiBkZWZhdWx0VmFsdWVUeXBlLmdldEFuaW1hdGFibGVOb25lXG4gICAgICAgID8gZGVmYXVsdFZhbHVlVHlwZS5nZXRBbmltYXRhYmxlTm9uZSh2YWx1ZSlcbiAgICAgICAgOiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCB7IGdldEFuaW1hdGFibGVOb25lIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbmltYXRhYmxlLW5vbmUubWpzLm1hcFxuIiwiaW1wb3J0IHsgYW5hbHlzZUNvbXBsZXhWYWx1ZSB9IGZyb20gJy4uLy4uLy4uL3ZhbHVlL3R5cGVzL2NvbXBsZXgvaW5kZXgubWpzJztcbmltcG9ydCB7IGdldEFuaW1hdGFibGVOb25lIH0gZnJvbSAnLi4vLi4vLi4vdmFsdWUvdHlwZXMvdXRpbHMvYW5pbWF0YWJsZS1ub25lLm1qcyc7XG5cbi8qKlxuICogSWYgd2UgZW5jb3VudGVyIGtleWZyYW1lcyBsaWtlIFwibm9uZVwiIG9yIFwiMFwiIGFuZCB3ZSBhbHNvIGhhdmUga2V5ZnJhbWVzIGxpa2VcbiAqIFwiI2ZmZlwiIG9yIFwiMjAwcHggMjAwcHhcIiB3ZSB3YW50IHRvIGZpbmQgYSBrZXlmcmFtZSB0byBzZXJ2ZSBhcyBhIHRlbXBsYXRlIGZvclxuICogdGhlIFwibm9uZVwiIGtleWZyYW1lcy4gSW4gdGhpcyBjYXNlIFwiI2ZmZlwiIG9yIFwiMjAwcHggMjAwcHhcIiAtIHRoZW4gdGhlc2UgZ2V0IHR1cm5lZCBpbnRvXG4gKiB6ZXJvIGVxdWl2YWxlbnRzLCBpLmUuIFwiI2ZmZjBcIiBvciBcIjBweCAwcHhcIi5cbiAqL1xuY29uc3QgaW52YWxpZFRlbXBsYXRlcyA9IG5ldyBTZXQoW1wiYXV0b1wiLCBcIm5vbmVcIiwgXCIwXCJdKTtcbmZ1bmN0aW9uIG1ha2VOb25lS2V5ZnJhbWVzQW5pbWF0YWJsZSh1bnJlc29sdmVkS2V5ZnJhbWVzLCBub25lS2V5ZnJhbWVJbmRleGVzLCBuYW1lKSB7XG4gICAgbGV0IGkgPSAwO1xuICAgIGxldCBhbmltYXRhYmxlVGVtcGxhdGUgPSB1bmRlZmluZWQ7XG4gICAgd2hpbGUgKGkgPCB1bnJlc29sdmVkS2V5ZnJhbWVzLmxlbmd0aCAmJiAhYW5pbWF0YWJsZVRlbXBsYXRlKSB7XG4gICAgICAgIGNvbnN0IGtleWZyYW1lID0gdW5yZXNvbHZlZEtleWZyYW1lc1tpXTtcbiAgICAgICAgaWYgKHR5cGVvZiBrZXlmcmFtZSA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgIWludmFsaWRUZW1wbGF0ZXMuaGFzKGtleWZyYW1lKSAmJlxuICAgICAgICAgICAgYW5hbHlzZUNvbXBsZXhWYWx1ZShrZXlmcmFtZSkudmFsdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgYW5pbWF0YWJsZVRlbXBsYXRlID0gdW5yZXNvbHZlZEtleWZyYW1lc1tpXTtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgfVxuICAgIGlmIChhbmltYXRhYmxlVGVtcGxhdGUgJiYgbmFtZSkge1xuICAgICAgICBmb3IgKGNvbnN0IG5vbmVJbmRleCBvZiBub25lS2V5ZnJhbWVJbmRleGVzKSB7XG4gICAgICAgICAgICB1bnJlc29sdmVkS2V5ZnJhbWVzW25vbmVJbmRleF0gPSBnZXRBbmltYXRhYmxlTm9uZShuYW1lLCBhbmltYXRhYmxlVGVtcGxhdGUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgeyBtYWtlTm9uZUtleWZyYW1lc0FuaW1hdGFibGUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1ha2Utbm9uZS1hbmltYXRhYmxlLm1qcy5tYXBcbiIsImltcG9ydCB7IHBvc2l0aW9uYWxLZXlzIH0gZnJvbSAnLi4vLi4vcmVuZGVyL3V0aWxzL2tleXMtcG9zaXRpb24ubWpzJztcbmltcG9ydCB7IGZpbmREaW1lbnNpb25WYWx1ZVR5cGUgfSBmcm9tICcuLi8uLi92YWx1ZS90eXBlcy9kaW1lbnNpb25zLm1qcyc7XG5pbXBvcnQgeyBnZXRWYXJpYWJsZVZhbHVlIH0gZnJvbSAnLi4vdXRpbHMvY3NzLXZhcmlhYmxlcy1jb252ZXJzaW9uLm1qcyc7XG5pbXBvcnQgeyBpc0NTU1ZhcmlhYmxlVG9rZW4sIGNvbnRhaW5zQ1NTVmFyaWFibGUgfSBmcm9tICcuLi91dGlscy9pcy1jc3MtdmFyaWFibGUubWpzJztcbmltcG9ydCB7IEtleWZyYW1lUmVzb2x2ZXIgfSBmcm9tICcuL0tleWZyYW1lc1Jlc29sdmVyLm1qcyc7XG5pbXBvcnQgeyBpc05vbmUgfSBmcm9tICcuL3V0aWxzL2lzLW5vbmUubWpzJztcbmltcG9ydCB7IG1ha2VOb25lS2V5ZnJhbWVzQW5pbWF0YWJsZSB9IGZyb20gJy4vdXRpbHMvbWFrZS1ub25lLWFuaW1hdGFibGUubWpzJztcbmltcG9ydCB7IHBvc2l0aW9uYWxWYWx1ZXMsIGlzTnVtT3JQeFR5cGUgfSBmcm9tICcuL3V0aWxzL3VuaXQtY29udmVyc2lvbi5tanMnO1xuXG5jbGFzcyBET01LZXlmcmFtZXNSZXNvbHZlciBleHRlbmRzIEtleWZyYW1lUmVzb2x2ZXIge1xuICAgIGNvbnN0cnVjdG9yKHVucmVzb2x2ZWRLZXlmcmFtZXMsIG9uQ29tcGxldGUsIG5hbWUsIG1vdGlvblZhbHVlLCBlbGVtZW50KSB7XG4gICAgICAgIHN1cGVyKHVucmVzb2x2ZWRLZXlmcmFtZXMsIG9uQ29tcGxldGUsIG5hbWUsIG1vdGlvblZhbHVlLCBlbGVtZW50LCB0cnVlKTtcbiAgICB9XG4gICAgcmVhZEtleWZyYW1lcygpIHtcbiAgICAgICAgY29uc3QgeyB1bnJlc29sdmVkS2V5ZnJhbWVzLCBlbGVtZW50LCBuYW1lIH0gPSB0aGlzO1xuICAgICAgICBpZiAoIWVsZW1lbnQgfHwgIWVsZW1lbnQuY3VycmVudClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgc3VwZXIucmVhZEtleWZyYW1lcygpO1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgYW55IGtleWZyYW1lIGlzIGEgQ1NTIHZhcmlhYmxlLCB3ZSBuZWVkIHRvIGZpbmQgaXRzIHZhbHVlIGJ5IHNhbXBsaW5nIHRoZSBlbGVtZW50XG4gICAgICAgICAqL1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVucmVzb2x2ZWRLZXlmcmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBrZXlmcmFtZSA9IHVucmVzb2x2ZWRLZXlmcmFtZXNbaV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIGtleWZyYW1lID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAga2V5ZnJhbWUgPSBrZXlmcmFtZS50cmltKCk7XG4gICAgICAgICAgICAgICAgaWYgKGlzQ1NTVmFyaWFibGVUb2tlbihrZXlmcmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzb2x2ZWQgPSBnZXRWYXJpYWJsZVZhbHVlKGtleWZyYW1lLCBlbGVtZW50LmN1cnJlbnQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdW5yZXNvbHZlZEtleWZyYW1lc1tpXSA9IHJlc29sdmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09PSB1bnJlc29sdmVkS2V5ZnJhbWVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmluYWxLZXlmcmFtZSA9IGtleWZyYW1lO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNvbHZlIFwibm9uZVwiIHZhbHVlcy4gV2UgZG8gdGhpcyBwb3RlbnRpYWxseSB0d2ljZSAtIG9uY2UgYmVmb3JlIGFuZCBvbmNlIGFmdGVyIG1lYXN1cmluZyBrZXlmcmFtZXMuXG4gICAgICAgICAqIFRoaXMgY291bGQgYmUgc2VlbiBhcyBpbmVmZmljaWVudCBidXQgaXQncyBhIHRyYWRlLW9mZiB0byBhdm9pZCBtZWFzdXJlbWVudHMgaW4gbW9yZSBzaXR1YXRpb25zLCB3aGljaFxuICAgICAgICAgKiBoYXZlIGEgZmFyIGJpZ2dlciBwZXJmb3JtYW5jZSBpbXBhY3QuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnJlc29sdmVOb25lS2V5ZnJhbWVzKCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVjayB0byBzZWUgaWYgdW5pdCB0eXBlIGhhcyBjaGFuZ2VkLiBJZiBzbyBzY2hlZHVsZSBqb2JzIHRoYXQgd2lsbFxuICAgICAgICAgKiB0ZW1wb3JhcmlseSBzZXQgc3R5bGVzIHRvIHRoZSBkZXN0aW5hdGlvbiBrZXlmcmFtZXMuXG4gICAgICAgICAqIFNraXAgaWYgd2UgaGF2ZSBtb3JlIHRoYW4gdHdvIGtleWZyYW1lcyBvciB0aGlzIGlzbid0IGEgcG9zaXRpb25hbCB2YWx1ZS5cbiAgICAgICAgICogVE9ETzogV2UgY2FuIHRocm93IGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBrZXlmcmFtZXMgYW5kIHRoZSB2YWx1ZSB0eXBlIGNoYW5nZXMuXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoIXBvc2l0aW9uYWxLZXlzLmhhcyhuYW1lKSB8fCB1bnJlc29sdmVkS2V5ZnJhbWVzLmxlbmd0aCAhPT0gMikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IFtvcmlnaW4sIHRhcmdldF0gPSB1bnJlc29sdmVkS2V5ZnJhbWVzO1xuICAgICAgICBjb25zdCBvcmlnaW5UeXBlID0gZmluZERpbWVuc2lvblZhbHVlVHlwZShvcmlnaW4pO1xuICAgICAgICBjb25zdCB0YXJnZXRUeXBlID0gZmluZERpbWVuc2lvblZhbHVlVHlwZSh0YXJnZXQpO1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgb25lIGtleWZyYW1lIGNvbnRhaW5zIGVtYmVkZGVkIENTUyB2YXJpYWJsZXMgKGUuZy4gaW4gY2FsYygpKSBhbmQgdGhlIG90aGVyXG4gICAgICAgICAqIGRvZXNuJ3QsIHdlIG5lZWQgdG8gbWVhc3VyZSB0byBjb252ZXJ0IHRvIHBpeGVscy4gVGhpcyBoYW5kbGVzIEdpdEh1YiBpc3N1ZSAjMzQxMC5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG9yaWdpbkhhc1ZhciA9IGNvbnRhaW5zQ1NTVmFyaWFibGUob3JpZ2luKTtcbiAgICAgICAgY29uc3QgdGFyZ2V0SGFzVmFyID0gY29udGFpbnNDU1NWYXJpYWJsZSh0YXJnZXQpO1xuICAgICAgICBpZiAob3JpZ2luSGFzVmFyICE9PSB0YXJnZXRIYXNWYXIgJiYgcG9zaXRpb25hbFZhbHVlc1tuYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5uZWVkc01lYXN1cmVtZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogRWl0aGVyIHdlIGRvbid0IHJlY29nbmlzZSB0aGVzZSB2YWx1ZSB0eXBlcyBvciB3ZSBjYW4gYW5pbWF0ZSBiZXR3ZWVuIHRoZW0uXG4gICAgICAgICAqL1xuICAgICAgICBpZiAob3JpZ2luVHlwZSA9PT0gdGFyZ2V0VHlwZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGJvdGggdmFsdWVzIGFyZSBudW1iZXJzIG9yIHBpeGVscywgd2UgY2FuIGFuaW1hdGUgYmV0d2VlbiB0aGVtIGJ5XG4gICAgICAgICAqIGNvbnZlcnRpbmcgdGhlbSB0byBudW1iZXJzLlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKGlzTnVtT3JQeFR5cGUob3JpZ2luVHlwZSkgJiYgaXNOdW1PclB4VHlwZSh0YXJnZXRUeXBlKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1bnJlc29sdmVkS2V5ZnJhbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB1bnJlc29sdmVkS2V5ZnJhbWVzW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5yZXNvbHZlZEtleWZyYW1lc1tpXSA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwb3NpdGlvbmFsVmFsdWVzW25hbWVdKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEVsc2UsIHRoZSBvbmx5IHdheSB0byByZXNvbHZlIHRoaXMgaXMgYnkgbWVhc3VyaW5nIHRoZSBlbGVtZW50LlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLm5lZWRzTWVhc3VyZW1lbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlc29sdmVOb25lS2V5ZnJhbWVzKCkge1xuICAgICAgICBjb25zdCB7IHVucmVzb2x2ZWRLZXlmcmFtZXMsIG5hbWUgfSA9IHRoaXM7XG4gICAgICAgIGNvbnN0IG5vbmVLZXlmcmFtZUluZGV4ZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1bnJlc29sdmVkS2V5ZnJhbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodW5yZXNvbHZlZEtleWZyYW1lc1tpXSA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgICAgIGlzTm9uZSh1bnJlc29sdmVkS2V5ZnJhbWVzW2ldKSkge1xuICAgICAgICAgICAgICAgIG5vbmVLZXlmcmFtZUluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9uZUtleWZyYW1lSW5kZXhlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIG1ha2VOb25lS2V5ZnJhbWVzQW5pbWF0YWJsZSh1bnJlc29sdmVkS2V5ZnJhbWVzLCBub25lS2V5ZnJhbWVJbmRleGVzLCBuYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBtZWFzdXJlSW5pdGlhbFN0YXRlKCkge1xuICAgICAgICBjb25zdCB7IGVsZW1lbnQsIHVucmVzb2x2ZWRLZXlmcmFtZXMsIG5hbWUgfSA9IHRoaXM7XG4gICAgICAgIGlmICghZWxlbWVudCB8fCAhZWxlbWVudC5jdXJyZW50KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAobmFtZSA9PT0gXCJoZWlnaHRcIikge1xuICAgICAgICAgICAgdGhpcy5zdXNwZW5kZWRTY3JvbGxZID0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWVhc3VyZWRPcmlnaW4gPSBwb3NpdGlvbmFsVmFsdWVzW25hbWVdKGVsZW1lbnQubWVhc3VyZVZpZXdwb3J0Qm94KCksIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQuY3VycmVudCkpO1xuICAgICAgICB1bnJlc29sdmVkS2V5ZnJhbWVzWzBdID0gdGhpcy5tZWFzdXJlZE9yaWdpbjtcbiAgICAgICAgLy8gU2V0IGZpbmFsIGtleSBmcmFtZSB0byBtZWFzdXJlIGFmdGVyIG5leHQgcmVuZGVyXG4gICAgICAgIGNvbnN0IG1lYXN1cmVLZXlmcmFtZSA9IHVucmVzb2x2ZWRLZXlmcmFtZXNbdW5yZXNvbHZlZEtleWZyYW1lcy5sZW5ndGggLSAxXTtcbiAgICAgICAgaWYgKG1lYXN1cmVLZXlmcmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBlbGVtZW50LmdldFZhbHVlKG5hbWUsIG1lYXN1cmVLZXlmcmFtZSkuanVtcChtZWFzdXJlS2V5ZnJhbWUsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBtZWFzdXJlRW5kU3RhdGUoKSB7XG4gICAgICAgIGNvbnN0IHsgZWxlbWVudCwgbmFtZSwgdW5yZXNvbHZlZEtleWZyYW1lcyB9ID0gdGhpcztcbiAgICAgICAgaWYgKCFlbGVtZW50IHx8ICFlbGVtZW50LmN1cnJlbnQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNvbnN0IHZhbHVlID0gZWxlbWVudC5nZXRWYWx1ZShuYW1lKTtcbiAgICAgICAgdmFsdWUgJiYgdmFsdWUuanVtcCh0aGlzLm1lYXN1cmVkT3JpZ2luLCBmYWxzZSk7XG4gICAgICAgIGNvbnN0IGZpbmFsS2V5ZnJhbWVJbmRleCA9IHVucmVzb2x2ZWRLZXlmcmFtZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgY29uc3QgZmluYWxLZXlmcmFtZSA9IHVucmVzb2x2ZWRLZXlmcmFtZXNbZmluYWxLZXlmcmFtZUluZGV4XTtcbiAgICAgICAgdW5yZXNvbHZlZEtleWZyYW1lc1tmaW5hbEtleWZyYW1lSW5kZXhdID0gcG9zaXRpb25hbFZhbHVlc1tuYW1lXShlbGVtZW50Lm1lYXN1cmVWaWV3cG9ydEJveCgpLCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LmN1cnJlbnQpKTtcbiAgICAgICAgaWYgKGZpbmFsS2V5ZnJhbWUgIT09IG51bGwgJiYgdGhpcy5maW5hbEtleWZyYW1lID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZmluYWxLZXlmcmFtZSA9IGZpbmFsS2V5ZnJhbWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgd2UgcmVtb3ZlZCB0cmFuc2Zvcm0gdmFsdWVzLCByZWFwcGx5IHRoZW0gYmVmb3JlIHRoZSBuZXh0IHJlbmRlclxuICAgICAgICBpZiAodGhpcy5yZW1vdmVkVHJhbnNmb3Jtcz8ubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZWRUcmFuc2Zvcm1zLmZvckVhY2goKFt1bnNldFRyYW5zZm9ybU5hbWUsIHVuc2V0VHJhbnNmb3JtVmFsdWVdKSA9PiB7XG4gICAgICAgICAgICAgICAgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAuZ2V0VmFsdWUodW5zZXRUcmFuc2Zvcm1OYW1lKVxuICAgICAgICAgICAgICAgICAgICAuc2V0KHVuc2V0VHJhbnNmb3JtVmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXNvbHZlTm9uZUtleWZyYW1lcygpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgRE9NS2V5ZnJhbWVzUmVzb2x2ZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPURPTUtleWZyYW1lc1Jlc29sdmVyLm1qcy5tYXBcbiIsIi8qKlxuICogQSBsaXN0IG9mIHZhbHVlcyB0aGF0IGNhbiBiZSBoYXJkd2FyZS1hY2NlbGVyYXRlZC5cbiAqL1xuY29uc3QgYWNjZWxlcmF0ZWRWYWx1ZXMgPSBuZXcgU2V0KFtcbiAgICBcIm9wYWNpdHlcIixcbiAgICBcImNsaXBQYXRoXCIsXG4gICAgXCJmaWx0ZXJcIixcbiAgICBcInRyYW5zZm9ybVwiLFxuICAgIC8vIFRPRE86IENhbiBiZSBhY2NlbGVyYXRlZCBidXQgY3VycmVudGx5IGRpc2FibGVkIHVudGlsIGh0dHBzOi8vaXNzdWVzLmNocm9taXVtLm9yZy9pc3N1ZXMvNDE0OTEwOTggaXMgcmVzb2x2ZWRcbiAgICAvLyBvciB1bnRpbCB3ZSBpbXBsZW1lbnQgc3VwcG9ydCBmb3IgbGluZWFyKCkgZWFzaW5nLlxuICAgIC8vIFwiYmFja2dyb3VuZC1jb2xvclwiXG5dKTtcblxuZXhwb3J0IHsgYWNjZWxlcmF0ZWRWYWx1ZXMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFjY2VsZXJhdGVkLXZhbHVlcy5tanMubWFwXG4iLCJmdW5jdGlvbiByZXNvbHZlRWxlbWVudHMoZWxlbWVudE9yU2VsZWN0b3IsIHNjb3BlLCBzZWxlY3RvckNhY2hlKSB7XG4gICAgaWYgKGVsZW1lbnRPclNlbGVjdG9yID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoZWxlbWVudE9yU2VsZWN0b3IgaW5zdGFuY2VvZiBFdmVudFRhcmdldCkge1xuICAgICAgICByZXR1cm4gW2VsZW1lbnRPclNlbGVjdG9yXTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGVsZW1lbnRPclNlbGVjdG9yID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGxldCByb290ID0gZG9jdW1lbnQ7XG4gICAgICAgIGlmIChzY29wZSkge1xuICAgICAgICAgICAgcm9vdCA9IHNjb3BlLmN1cnJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSBzZWxlY3RvckNhY2hlPy5bZWxlbWVudE9yU2VsZWN0b3JdID8/XG4gICAgICAgICAgICByb290LnF1ZXJ5U2VsZWN0b3JBbGwoZWxlbWVudE9yU2VsZWN0b3IpO1xuICAgICAgICByZXR1cm4gZWxlbWVudHMgPyBBcnJheS5mcm9tKGVsZW1lbnRzKSA6IFtdO1xuICAgIH1cbiAgICByZXR1cm4gQXJyYXkuZnJvbShlbGVtZW50T3JTZWxlY3RvcikuZmlsdGVyKChlbGVtZW50KSA9PiBlbGVtZW50ICE9IG51bGwpO1xufVxuXG5leHBvcnQgeyByZXNvbHZlRWxlbWVudHMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlc29sdmUtZWxlbWVudHMubWpzLm1hcFxuIiwiaW1wb3J0IHsgcmVzb2x2ZUVsZW1lbnRzIH0gZnJvbSAnLi4vLi4vdXRpbHMvcmVzb2x2ZS1lbGVtZW50cy5tanMnO1xuXG5mdW5jdGlvbiBjcmVhdGVTZWxlY3RvckVmZmVjdChzdWJqZWN0RWZmZWN0KSB7XG4gICAgcmV0dXJuIChzdWJqZWN0LCB2YWx1ZXMpID0+IHtcbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSByZXNvbHZlRWxlbWVudHMoc3ViamVjdCk7XG4gICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgICAgICAgICBjb25zdCByZW1vdmUgPSBzdWJqZWN0RWZmZWN0KGVsZW1lbnQsIHZhbHVlcyk7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25zLnB1c2gocmVtb3ZlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCByZW1vdmUgb2Ygc3Vic2NyaXB0aW9ucylcbiAgICAgICAgICAgICAgICByZW1vdmUoKTtcbiAgICAgICAgfTtcbiAgICB9O1xufVxuXG5leHBvcnQgeyBjcmVhdGVTZWxlY3RvckVmZmVjdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y3JlYXRlLWRvbS1lZmZlY3QubWpzLm1hcFxuIiwiLyoqXG4gKiBQcm92aWRlZCBhIHZhbHVlIGFuZCBhIFZhbHVlVHlwZSwgcmV0dXJucyB0aGUgdmFsdWUgYXMgdGhhdCB2YWx1ZSB0eXBlLlxuICovXG5jb25zdCBnZXRWYWx1ZUFzVHlwZSA9ICh2YWx1ZSwgdHlwZSkgPT4ge1xuICAgIHJldHVybiB0eXBlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIlxuICAgICAgICA/IHR5cGUudHJhbnNmb3JtKHZhbHVlKVxuICAgICAgICA6IHZhbHVlO1xufTtcblxuZXhwb3J0IHsgZ2V0VmFsdWVBc1R5cGUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdldC1hcy10eXBlLm1qcy5tYXBcbiIsImltcG9ydCB7IGZyYW1lLCBjYW5jZWxGcmFtZSB9IGZyb20gJy4uL2ZyYW1lbG9vcC9mcmFtZS5tanMnO1xuaW1wb3J0IHsgbnVtYmVyVmFsdWVUeXBlcyB9IGZyb20gJy4uL3ZhbHVlL3R5cGVzL21hcHMvbnVtYmVyLm1qcyc7XG5pbXBvcnQgeyBnZXRWYWx1ZUFzVHlwZSB9IGZyb20gJy4uL3ZhbHVlL3R5cGVzL3V0aWxzL2dldC1hcy10eXBlLm1qcyc7XG5cbmNsYXNzIE1vdGlvblZhbHVlU3RhdGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxhdGVzdCA9IHt9O1xuICAgICAgICB0aGlzLnZhbHVlcyA9IG5ldyBNYXAoKTtcbiAgICB9XG4gICAgc2V0KG5hbWUsIHZhbHVlLCByZW5kZXIsIGNvbXB1dGVkLCB1c2VEZWZhdWx0VmFsdWVUeXBlID0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBleGlzdGluZ1ZhbHVlID0gdGhpcy52YWx1ZXMuZ2V0KG5hbWUpO1xuICAgICAgICBpZiAoZXhpc3RpbmdWYWx1ZSkge1xuICAgICAgICAgICAgZXhpc3RpbmdWYWx1ZS5vblJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9uQ2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdiA9IHZhbHVlLmdldCgpO1xuICAgICAgICAgICAgaWYgKHVzZURlZmF1bHRWYWx1ZVR5cGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxhdGVzdFtuYW1lXSA9IGdldFZhbHVlQXNUeXBlKHYsIG51bWJlclZhbHVlVHlwZXNbbmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXRlc3RbbmFtZV0gPSB2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVuZGVyICYmIGZyYW1lLnJlbmRlcihyZW5kZXIpO1xuICAgICAgICB9O1xuICAgICAgICBvbkNoYW5nZSgpO1xuICAgICAgICBjb25zdCBjYW5jZWxPbkNoYW5nZSA9IHZhbHVlLm9uKFwiY2hhbmdlXCIsIG9uQ2hhbmdlKTtcbiAgICAgICAgY29tcHV0ZWQgJiYgdmFsdWUuYWRkRGVwZW5kZW50KGNvbXB1dGVkKTtcbiAgICAgICAgY29uc3QgcmVtb3ZlID0gKCkgPT4ge1xuICAgICAgICAgICAgY2FuY2VsT25DaGFuZ2UoKTtcbiAgICAgICAgICAgIHJlbmRlciAmJiBjYW5jZWxGcmFtZShyZW5kZXIpO1xuICAgICAgICAgICAgdGhpcy52YWx1ZXMuZGVsZXRlKG5hbWUpO1xuICAgICAgICAgICAgY29tcHV0ZWQgJiYgdmFsdWUucmVtb3ZlRGVwZW5kZW50KGNvbXB1dGVkKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy52YWx1ZXMuc2V0KG5hbWUsIHsgdmFsdWUsIG9uUmVtb3ZlOiByZW1vdmUgfSk7XG4gICAgICAgIHJldHVybiByZW1vdmU7XG4gICAgfVxuICAgIGdldChuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlcy5nZXQobmFtZSk/LnZhbHVlO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgTW90aW9uVmFsdWVTdGF0ZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TW90aW9uVmFsdWVTdGF0ZS5tanMubWFwXG4iLCJpbXBvcnQgeyBNb3Rpb25WYWx1ZVN0YXRlIH0gZnJvbSAnLi4vTW90aW9uVmFsdWVTdGF0ZS5tanMnO1xuXG5mdW5jdGlvbiBjcmVhdGVFZmZlY3QoYWRkVmFsdWUpIHtcbiAgICBjb25zdCBzdGF0ZUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcbiAgICByZXR1cm4gKHN1YmplY3QsIHZhbHVlcykgPT4ge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IHN0YXRlQ2FjaGUuZ2V0KHN1YmplY3QpID8/IG5ldyBNb3Rpb25WYWx1ZVN0YXRlKCk7XG4gICAgICAgIHN0YXRlQ2FjaGUuc2V0KHN1YmplY3QsIHN0YXRlKTtcbiAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB2YWx1ZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdmFsdWVzW2tleV07XG4gICAgICAgICAgICBjb25zdCByZW1vdmUgPSBhZGRWYWx1ZShzdWJqZWN0LCBzdGF0ZSwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25zLnB1c2gocmVtb3ZlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjYW5jZWwgb2Ygc3Vic2NyaXB0aW9ucylcbiAgICAgICAgICAgICAgICBjYW5jZWwoKTtcbiAgICAgICAgfTtcbiAgICB9O1xufVxuXG5leHBvcnQgeyBjcmVhdGVFZmZlY3QgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNyZWF0ZS1lZmZlY3QubWpzLm1hcFxuIiwiaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhbiBlbGVtZW50IGlzIGFuIEhUTUwgZWxlbWVudCBpbiBhIHdheVxuICogdGhhdCB3b3JrcyBhY3Jvc3MgaWZyYW1lc1xuICovXG5mdW5jdGlvbiBpc0hUTUxFbGVtZW50KGVsZW1lbnQpIHtcbiAgICByZXR1cm4gKGlzT2JqZWN0KGVsZW1lbnQpICYmXG4gICAgICAgIFwib2Zmc2V0SGVpZ2h0XCIgaW4gZWxlbWVudCAmJlxuICAgICAgICAhKFwib3duZXJTVkdFbGVtZW50XCIgaW4gZWxlbWVudCkpO1xufVxuXG5leHBvcnQgeyBpc0hUTUxFbGVtZW50IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pcy1odG1sLWVsZW1lbnQubWpzLm1hcFxuIiwiaW1wb3J0IHsgdHJhbnNmb3JtUHJvcE9yZGVyIH0gZnJvbSAnLi4vLi4vcmVuZGVyL3V0aWxzL2tleXMtdHJhbnNmb3JtLm1qcyc7XG5cbmNvbnN0IHRyYW5zbGF0ZUFsaWFzID0ge1xuICAgIHg6IFwidHJhbnNsYXRlWFwiLFxuICAgIHk6IFwidHJhbnNsYXRlWVwiLFxuICAgIHo6IFwidHJhbnNsYXRlWlwiLFxuICAgIHRyYW5zZm9ybVBlcnNwZWN0aXZlOiBcInBlcnNwZWN0aXZlXCIsXG59O1xuZnVuY3Rpb24gYnVpbGRUcmFuc2Zvcm0oc3RhdGUpIHtcbiAgICBsZXQgdHJhbnNmb3JtID0gXCJcIjtcbiAgICBsZXQgdHJhbnNmb3JtSXNEZWZhdWx0ID0gdHJ1ZTtcbiAgICAvKipcbiAgICAgKiBMb29wIG92ZXIgYWxsIHBvc3NpYmxlIHRyYW5zZm9ybXMgaW4gb3JkZXIsIGFkZGluZyB0aGUgb25lcyB0aGF0XG4gICAgICogYXJlIHByZXNlbnQgdG8gdGhlIHRyYW5zZm9ybSBzdHJpbmcuXG4gICAgICovXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmFuc2Zvcm1Qcm9wT3JkZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdHJhbnNmb3JtUHJvcE9yZGVyW2ldO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHN0YXRlLmxhdGVzdFtrZXldO1xuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBsZXQgdmFsdWVJc0RlZmF1bHQgPSB0cnVlO1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICB2YWx1ZUlzRGVmYXVsdCA9IHZhbHVlID09PSAoa2V5LnN0YXJ0c1dpdGgoXCJzY2FsZVwiKSA/IDEgOiAwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgICAgICAgdmFsdWVJc0RlZmF1bHQgPSBrZXkuc3RhcnRzV2l0aChcInNjYWxlXCIpID8gcGFyc2VkID09PSAxIDogcGFyc2VkID09PSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdmFsdWVJc0RlZmF1bHQpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybUlzRGVmYXVsdCA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtTmFtZSA9IHRyYW5zbGF0ZUFsaWFzW2tleV0gfHwga2V5O1xuICAgICAgICAgICAgdHJhbnNmb3JtICs9IGAke3RyYW5zZm9ybU5hbWV9KCR7dmFsdWV9KSBgO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cmFuc2Zvcm1Jc0RlZmF1bHQgPyBcIm5vbmVcIiA6IHRyYW5zZm9ybS50cmltKCk7XG59XG5cbmV4cG9ydCB7IGJ1aWxkVHJhbnNmb3JtIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD10cmFuc2Zvcm0ubWpzLm1hcFxuIiwiaW1wb3J0IHsgaXNDU1NWYXIgfSBmcm9tICcuLi8uLi9yZW5kZXIvZG9tL2lzLWNzcy12YXIubWpzJztcbmltcG9ydCB7IHRyYW5zZm9ybVByb3BzIH0gZnJvbSAnLi4vLi4vcmVuZGVyL3V0aWxzL2tleXMtdHJhbnNmb3JtLm1qcyc7XG5pbXBvcnQgeyBpc0hUTUxFbGVtZW50IH0gZnJvbSAnLi4vLi4vdXRpbHMvaXMtaHRtbC1lbGVtZW50Lm1qcyc7XG5pbXBvcnQgeyBNb3Rpb25WYWx1ZSB9IGZyb20gJy4uLy4uL3ZhbHVlL2luZGV4Lm1qcyc7XG5pbXBvcnQgeyBjcmVhdGVTZWxlY3RvckVmZmVjdCB9IGZyb20gJy4uL3V0aWxzL2NyZWF0ZS1kb20tZWZmZWN0Lm1qcyc7XG5pbXBvcnQgeyBjcmVhdGVFZmZlY3QgfSBmcm9tICcuLi91dGlscy9jcmVhdGUtZWZmZWN0Lm1qcyc7XG5pbXBvcnQgeyBidWlsZFRyYW5zZm9ybSB9IGZyb20gJy4vdHJhbnNmb3JtLm1qcyc7XG5cbmNvbnN0IG9yaWdpblByb3BzID0gbmV3IFNldChbXCJvcmlnaW5YXCIsIFwib3JpZ2luWVwiLCBcIm9yaWdpblpcIl0pO1xuY29uc3QgYWRkU3R5bGVWYWx1ZSA9IChlbGVtZW50LCBzdGF0ZSwga2V5LCB2YWx1ZSkgPT4ge1xuICAgIGxldCByZW5kZXIgPSB1bmRlZmluZWQ7XG4gICAgbGV0IGNvbXB1dGVkID0gdW5kZWZpbmVkO1xuICAgIGlmICh0cmFuc2Zvcm1Qcm9wcy5oYXMoa2V5KSkge1xuICAgICAgICBpZiAoIXN0YXRlLmdldChcInRyYW5zZm9ybVwiKSkge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhbiBIVE1MIGVsZW1lbnQsIHdlIG5lZWQgdG8gc2V0IHRoZSB0cmFuc2Zvcm0tYm94IHRvIGZpbGwtYm94XG4gICAgICAgICAgICAvLyB0byBub3JtYWxpc2UgdGhlIHRyYW5zZm9ybSByZWxhdGl2ZSB0byB0aGUgZWxlbWVudCdzIGJvdW5kaW5nIGJveFxuICAgICAgICAgICAgaWYgKCFpc0hUTUxFbGVtZW50KGVsZW1lbnQpICYmICFzdGF0ZS5nZXQoXCJ0cmFuc2Zvcm1Cb3hcIikpIHtcbiAgICAgICAgICAgICAgICBhZGRTdHlsZVZhbHVlKGVsZW1lbnQsIHN0YXRlLCBcInRyYW5zZm9ybUJveFwiLCBuZXcgTW90aW9uVmFsdWUoXCJmaWxsLWJveFwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGF0ZS5zZXQoXCJ0cmFuc2Zvcm1cIiwgbmV3IE1vdGlvblZhbHVlKFwibm9uZVwiKSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYnVpbGRUcmFuc2Zvcm0oc3RhdGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29tcHV0ZWQgPSBzdGF0ZS5nZXQoXCJ0cmFuc2Zvcm1cIik7XG4gICAgfVxuICAgIGVsc2UgaWYgKG9yaWdpblByb3BzLmhhcyhrZXkpKSB7XG4gICAgICAgIGlmICghc3RhdGUuZ2V0KFwidHJhbnNmb3JtT3JpZ2luXCIpKSB7XG4gICAgICAgICAgICBzdGF0ZS5zZXQoXCJ0cmFuc2Zvcm1PcmlnaW5cIiwgbmV3IE1vdGlvblZhbHVlKFwiXCIpLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luWCA9IHN0YXRlLmxhdGVzdC5vcmlnaW5YID8/IFwiNTAlXCI7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luWSA9IHN0YXRlLmxhdGVzdC5vcmlnaW5ZID8/IFwiNTAlXCI7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luWiA9IHN0YXRlLmxhdGVzdC5vcmlnaW5aID8/IDA7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBgJHtvcmlnaW5YfSAke29yaWdpbll9ICR7b3JpZ2luWn1gO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29tcHV0ZWQgPSBzdGF0ZS5nZXQoXCJ0cmFuc2Zvcm1PcmlnaW5cIik7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzQ1NTVmFyKGtleSkpIHtcbiAgICAgICAgcmVuZGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShrZXksIHN0YXRlLmxhdGVzdFtrZXldKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJlbmRlciA9ICgpID0+IHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVba2V5XSA9IHN0YXRlLmxhdGVzdFtrZXldO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gc3RhdGUuc2V0KGtleSwgdmFsdWUsIHJlbmRlciwgY29tcHV0ZWQpO1xufTtcbmNvbnN0IHN0eWxlRWZmZWN0ID0gLypAX19QVVJFX18qLyBjcmVhdGVTZWxlY3RvckVmZmVjdChcbi8qQF9fUFVSRV9fKi8gY3JlYXRlRWZmZWN0KGFkZFN0eWxlVmFsdWUpKTtcblxuZXhwb3J0IHsgYWRkU3R5bGVWYWx1ZSwgc3R5bGVFZmZlY3QgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4Lm1qcy5tYXBcbiIsImltcG9ydCB7IGNyZWF0ZVJlbmRlckJhdGNoZXIgfSBmcm9tICcuL2JhdGNoZXIubWpzJztcblxuY29uc3QgeyBzY2hlZHVsZTogbWljcm90YXNrLCBjYW5jZWw6IGNhbmNlbE1pY3JvdGFzayB9ID0gXG4vKiBAX19QVVJFX18gKi8gY3JlYXRlUmVuZGVyQmF0Y2hlcihxdWV1ZU1pY3JvdGFzaywgZmFsc2UpO1xuXG5leHBvcnQgeyBjYW5jZWxNaWNyb3Rhc2ssIG1pY3JvdGFzayB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWljcm90YXNrLm1qcy5tYXBcbiIsImltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSAnbW90aW9uLXV0aWxzJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYW4gZWxlbWVudCBpcyBhbiBTVkcgZWxlbWVudCBpbiBhIHdheVxuICogdGhhdCB3b3JrcyBhY3Jvc3MgaWZyYW1lc1xuICovXG5mdW5jdGlvbiBpc1NWR0VsZW1lbnQoZWxlbWVudCkge1xuICAgIHJldHVybiBpc09iamVjdChlbGVtZW50KSAmJiBcIm93bmVyU1ZHRWxlbWVudFwiIGluIGVsZW1lbnQ7XG59XG5cbmV4cG9ydCB7IGlzU1ZHRWxlbWVudCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtc3ZnLWVsZW1lbnQubWpzLm1hcFxuIiwiaW1wb3J0IHsgaXNTVkdFbGVtZW50IH0gZnJvbSAnLi4vdXRpbHMvaXMtc3ZnLWVsZW1lbnQubWpzJztcbmltcG9ydCB7IHJlc29sdmVFbGVtZW50cyB9IGZyb20gJy4uL3V0aWxzL3Jlc29sdmUtZWxlbWVudHMubWpzJztcblxuY29uc3QgcmVzaXplSGFuZGxlcnMgPSBuZXcgV2Vha01hcCgpO1xubGV0IG9ic2VydmVyO1xuY29uc3QgZ2V0U2l6ZSA9IChib3JkZXJCb3hBeGlzLCBzdmdBeGlzLCBodG1sQXhpcykgPT4gKHRhcmdldCwgYm9yZGVyQm94U2l6ZSkgPT4ge1xuICAgIGlmIChib3JkZXJCb3hTaXplICYmIGJvcmRlckJveFNpemVbMF0pIHtcbiAgICAgICAgcmV0dXJuIGJvcmRlckJveFNpemVbMF1bKGJvcmRlckJveEF4aXMgKyBcIlNpemVcIildO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc1NWR0VsZW1lbnQodGFyZ2V0KSAmJiBcImdldEJCb3hcIiBpbiB0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldC5nZXRCQm94KClbc3ZnQXhpc107XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gdGFyZ2V0W2h0bWxBeGlzXTtcbiAgICB9XG59O1xuY29uc3QgZ2V0V2lkdGggPSAvKkBfX1BVUkVfXyovIGdldFNpemUoXCJpbmxpbmVcIiwgXCJ3aWR0aFwiLCBcIm9mZnNldFdpZHRoXCIpO1xuY29uc3QgZ2V0SGVpZ2h0ID0gLypAX19QVVJFX18qLyBnZXRTaXplKFwiYmxvY2tcIiwgXCJoZWlnaHRcIiwgXCJvZmZzZXRIZWlnaHRcIik7XG5mdW5jdGlvbiBub3RpZnlUYXJnZXQoeyB0YXJnZXQsIGJvcmRlckJveFNpemUgfSkge1xuICAgIHJlc2l6ZUhhbmRsZXJzLmdldCh0YXJnZXQpPy5mb3JFYWNoKChoYW5kbGVyKSA9PiB7XG4gICAgICAgIGhhbmRsZXIodGFyZ2V0LCB7XG4gICAgICAgICAgICBnZXQgd2lkdGgoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFdpZHRoKHRhcmdldCwgYm9yZGVyQm94U2l6ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0IGhlaWdodCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0SGVpZ2h0KHRhcmdldCwgYm9yZGVyQm94U2l6ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIG5vdGlmeUFsbChlbnRyaWVzKSB7XG4gICAgZW50cmllcy5mb3JFYWNoKG5vdGlmeVRhcmdldCk7XG59XG5mdW5jdGlvbiBjcmVhdGVSZXNpemVPYnNlcnZlcigpIHtcbiAgICBpZiAodHlwZW9mIFJlc2l6ZU9ic2VydmVyID09PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICByZXR1cm47XG4gICAgb2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIobm90aWZ5QWxsKTtcbn1cbmZ1bmN0aW9uIHJlc2l6ZUVsZW1lbnQodGFyZ2V0LCBoYW5kbGVyKSB7XG4gICAgaWYgKCFvYnNlcnZlcilcbiAgICAgICAgY3JlYXRlUmVzaXplT2JzZXJ2ZXIoKTtcbiAgICBjb25zdCBlbGVtZW50cyA9IHJlc29sdmVFbGVtZW50cyh0YXJnZXQpO1xuICAgIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgbGV0IGVsZW1lbnRIYW5kbGVycyA9IHJlc2l6ZUhhbmRsZXJzLmdldChlbGVtZW50KTtcbiAgICAgICAgaWYgKCFlbGVtZW50SGFuZGxlcnMpIHtcbiAgICAgICAgICAgIGVsZW1lbnRIYW5kbGVycyA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIHJlc2l6ZUhhbmRsZXJzLnNldChlbGVtZW50LCBlbGVtZW50SGFuZGxlcnMpO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnRIYW5kbGVycy5hZGQoaGFuZGxlcik7XG4gICAgICAgIG9ic2VydmVyPy5vYnNlcnZlKGVsZW1lbnQpO1xuICAgIH0pO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRIYW5kbGVycyA9IHJlc2l6ZUhhbmRsZXJzLmdldChlbGVtZW50KTtcbiAgICAgICAgICAgIGVsZW1lbnRIYW5kbGVycz8uZGVsZXRlKGhhbmRsZXIpO1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50SGFuZGxlcnM/LnNpemUpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlcj8udW5vYnNlcnZlKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xufVxuXG5leHBvcnQgeyByZXNpemVFbGVtZW50IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oYW5kbGUtZWxlbWVudC5tanMubWFwXG4iLCJjb25zdCB3aW5kb3dDYWxsYmFja3MgPSBuZXcgU2V0KCk7XG5sZXQgd2luZG93UmVzaXplSGFuZGxlcjtcbmZ1bmN0aW9uIGNyZWF0ZVdpbmRvd1Jlc2l6ZUhhbmRsZXIoKSB7XG4gICAgd2luZG93UmVzaXplSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgaW5mbyA9IHtcbiAgICAgICAgICAgIGdldCB3aWR0aCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0IGhlaWdodCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgd2luZG93Q2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjayhpbmZvKSk7XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB3aW5kb3dSZXNpemVIYW5kbGVyKTtcbn1cbmZ1bmN0aW9uIHJlc2l6ZVdpbmRvdyhjYWxsYmFjaykge1xuICAgIHdpbmRvd0NhbGxiYWNrcy5hZGQoY2FsbGJhY2spO1xuICAgIGlmICghd2luZG93UmVzaXplSGFuZGxlcilcbiAgICAgICAgY3JlYXRlV2luZG93UmVzaXplSGFuZGxlcigpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIHdpbmRvd0NhbGxiYWNrcy5kZWxldGUoY2FsbGJhY2spO1xuICAgICAgICBpZiAoIXdpbmRvd0NhbGxiYWNrcy5zaXplICYmXG4gICAgICAgICAgICB0eXBlb2Ygd2luZG93UmVzaXplSGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB3aW5kb3dSZXNpemVIYW5kbGVyKTtcbiAgICAgICAgICAgIHdpbmRvd1Jlc2l6ZUhhbmRsZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5leHBvcnQgeyByZXNpemVXaW5kb3cgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhhbmRsZS13aW5kb3cubWpzLm1hcFxuIiwiaW1wb3J0IHsgcmVzaXplRWxlbWVudCB9IGZyb20gJy4vaGFuZGxlLWVsZW1lbnQubWpzJztcbmltcG9ydCB7IHJlc2l6ZVdpbmRvdyB9IGZyb20gJy4vaGFuZGxlLXdpbmRvdy5tanMnO1xuXG5mdW5jdGlvbiByZXNpemUoYSwgYikge1xuICAgIHJldHVybiB0eXBlb2YgYSA9PT0gXCJmdW5jdGlvblwiID8gcmVzaXplV2luZG93KGEpIDogcmVzaXplRWxlbWVudChhLCBiKTtcbn1cblxuZXhwb3J0IHsgcmVzaXplIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5tanMubWFwXG4iLCJpbXBvcnQgeyBmcmFtZSwgY2FuY2VsRnJhbWUgfSBmcm9tICcuLi9mcmFtZWxvb3AvZnJhbWUubWpzJztcblxuZnVuY3Rpb24gb2JzZXJ2ZVRpbWVsaW5lKHVwZGF0ZSwgdGltZWxpbmUpIHtcbiAgICBsZXQgcHJldlByb2dyZXNzO1xuICAgIGNvbnN0IG9uRnJhbWUgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY3VycmVudFRpbWUgfSA9IHRpbWVsaW5lO1xuICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gY3VycmVudFRpbWUgPT09IG51bGwgPyAwIDogY3VycmVudFRpbWUudmFsdWU7XG4gICAgICAgIGNvbnN0IHByb2dyZXNzID0gcGVyY2VudGFnZSAvIDEwMDtcbiAgICAgICAgaWYgKHByZXZQcm9ncmVzcyAhPT0gcHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIHVwZGF0ZShwcm9ncmVzcyk7XG4gICAgICAgIH1cbiAgICAgICAgcHJldlByb2dyZXNzID0gcHJvZ3Jlc3M7XG4gICAgfTtcbiAgICBmcmFtZS5wcmVVcGRhdGUob25GcmFtZSwgdHJ1ZSk7XG4gICAgcmV0dXJuICgpID0+IGNhbmNlbEZyYW1lKG9uRnJhbWUpO1xufVxuXG5leHBvcnQgeyBvYnNlcnZlVGltZWxpbmUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9ic2VydmUubWpzLm1hcFxuIiwiaW1wb3J0IHsgaXNTVkdFbGVtZW50IH0gZnJvbSAnLi9pcy1zdmctZWxlbWVudC5tanMnO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhbiBlbGVtZW50IGlzIHNwZWNpZmljYWxseSBhbiBTVkdTVkdFbGVtZW50ICh0aGUgcm9vdCBTVkcgZWxlbWVudClcbiAqIGluIGEgd2F5IHRoYXQgd29ya3MgYWNyb3NzIGlmcmFtZXNcbiAqL1xuZnVuY3Rpb24gaXNTVkdTVkdFbGVtZW50KGVsZW1lbnQpIHtcbiAgICByZXR1cm4gaXNTVkdFbGVtZW50KGVsZW1lbnQpICYmIGVsZW1lbnQudGFnTmFtZSA9PT0gXCJzdmdcIjtcbn1cblxuZXhwb3J0IHsgaXNTVkdTVkdFbGVtZW50IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pcy1zdmctc3ZnLWVsZW1lbnQubWpzLm1hcFxuIiwiaW1wb3J0IHsgaW50ZXJwb2xhdGUgfSBmcm9tICcuL2ludGVycG9sYXRlLm1qcyc7XG5cbmZ1bmN0aW9uIHRyYW5zZm9ybSguLi5hcmdzKSB7XG4gICAgY29uc3QgdXNlSW1tZWRpYXRlID0gIUFycmF5LmlzQXJyYXkoYXJnc1swXSk7XG4gICAgY29uc3QgYXJnT2Zmc2V0ID0gdXNlSW1tZWRpYXRlID8gMCA6IC0xO1xuICAgIGNvbnN0IGlucHV0VmFsdWUgPSBhcmdzWzAgKyBhcmdPZmZzZXRdO1xuICAgIGNvbnN0IGlucHV0UmFuZ2UgPSBhcmdzWzEgKyBhcmdPZmZzZXRdO1xuICAgIGNvbnN0IG91dHB1dFJhbmdlID0gYXJnc1syICsgYXJnT2Zmc2V0XTtcbiAgICBjb25zdCBvcHRpb25zID0gYXJnc1szICsgYXJnT2Zmc2V0XTtcbiAgICBjb25zdCBpbnRlcnBvbGF0b3IgPSBpbnRlcnBvbGF0ZShpbnB1dFJhbmdlLCBvdXRwdXRSYW5nZSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHVzZUltbWVkaWF0ZSA/IGludGVycG9sYXRvcihpbnB1dFZhbHVlKSA6IGludGVycG9sYXRvcjtcbn1cblxuZXhwb3J0IHsgdHJhbnNmb3JtIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD10cmFuc2Zvcm0ubWpzLm1hcFxuIiwiaW1wb3J0IHsgbW90aW9uVmFsdWUgfSBmcm9tICcuL2luZGV4Lm1qcyc7XG5pbXBvcnQgeyBKU0FuaW1hdGlvbiB9IGZyb20gJy4uL2FuaW1hdGlvbi9KU0FuaW1hdGlvbi5tanMnO1xuaW1wb3J0IHsgaXNNb3Rpb25WYWx1ZSB9IGZyb20gJy4vdXRpbHMvaXMtbW90aW9uLXZhbHVlLm1qcyc7XG5pbXBvcnQgeyBmcmFtZSB9IGZyb20gJy4uL2ZyYW1lbG9vcC9mcmFtZS5tanMnO1xuXG4vKipcbiAqIENyZWF0ZSBhIGBNb3Rpb25WYWx1ZWAgdGhhdCBhbmltYXRlcyB0byBpdHMgbGF0ZXN0IHZhbHVlIHVzaW5nIGFueSB0cmFuc2l0aW9uIHR5cGUuXG4gKiBDYW4gZWl0aGVyIGJlIGEgdmFsdWUgb3IgdHJhY2sgYW5vdGhlciBgTW90aW9uVmFsdWVgLlxuICpcbiAqIGBgYGpzeFxuICogY29uc3QgeCA9IG1vdGlvblZhbHVlKDApXG4gKiBjb25zdCB5ID0gZm9sbG93VmFsdWUoeCwgeyB0eXBlOiBcInNwcmluZ1wiLCBzdGlmZm5lc3M6IDMwMCB9KVxuICogLy8gb3Igd2l0aCB0d2VlblxuICogY29uc3QgeiA9IGZvbGxvd1ZhbHVlKHgsIHsgdHlwZTogXCJ0d2VlblwiLCBkdXJhdGlvbjogMC41LCBlYXNlOiBcImVhc2VPdXRcIiB9KVxuICogYGBgXG4gKlxuICogQHBhcmFtIHNvdXJjZSAtIEluaXRpYWwgdmFsdWUgb3IgTW90aW9uVmFsdWUgdG8gdHJhY2tcbiAqIEBwYXJhbSBvcHRpb25zIC0gQW5pbWF0aW9uIHRyYW5zaXRpb24gb3B0aW9uc1xuICogQHJldHVybnMgYE1vdGlvblZhbHVlYFxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gZm9sbG93VmFsdWUoc291cmNlLCBvcHRpb25zKSB7XG4gICAgY29uc3QgaW5pdGlhbFZhbHVlID0gaXNNb3Rpb25WYWx1ZShzb3VyY2UpID8gc291cmNlLmdldCgpIDogc291cmNlO1xuICAgIGNvbnN0IHZhbHVlID0gbW90aW9uVmFsdWUoaW5pdGlhbFZhbHVlKTtcbiAgICBhdHRhY2hGb2xsb3codmFsdWUsIHNvdXJjZSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuLyoqXG4gKiBBdHRhY2ggYW4gYW5pbWF0aW9uIHRvIGEgTW90aW9uVmFsdWUgdGhhdCB3aWxsIGFuaW1hdGUgd2hlbmV2ZXIgdGhlIHZhbHVlIGNoYW5nZXMuXG4gKiBTaW1pbGFyIHRvIGF0dGFjaFNwcmluZyBidXQgc3VwcG9ydHMgYW55IHRyYW5zaXRpb24gdHlwZSAoc3ByaW5nLCB0d2VlbiwgaW5lcnRpYSwgZXRjLilcbiAqXG4gKiBAcGFyYW0gdmFsdWUgLSBUaGUgTW90aW9uVmFsdWUgdG8gYW5pbWF0ZVxuICogQHBhcmFtIHNvdXJjZSAtIEluaXRpYWwgdmFsdWUgb3IgTW90aW9uVmFsdWUgdG8gdHJhY2tcbiAqIEBwYXJhbSBvcHRpb25zIC0gQW5pbWF0aW9uIHRyYW5zaXRpb24gb3B0aW9uc1xuICogQHJldHVybnMgQ2xlYW51cCBmdW5jdGlvblxuICpcbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gYXR0YWNoRm9sbG93KHZhbHVlLCBzb3VyY2UsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGluaXRpYWxWYWx1ZSA9IHZhbHVlLmdldCgpO1xuICAgIGxldCBhY3RpdmVBbmltYXRpb24gPSBudWxsO1xuICAgIGxldCBsYXRlc3RWYWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgICBsZXQgbGF0ZXN0U2V0dGVyO1xuICAgIGNvbnN0IHVuaXQgPSB0eXBlb2YgaW5pdGlhbFZhbHVlID09PSBcInN0cmluZ1wiXG4gICAgICAgID8gaW5pdGlhbFZhbHVlLnJlcGxhY2UoL1tcXGQuLV0vZywgXCJcIilcbiAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgY29uc3Qgc3RvcEFuaW1hdGlvbiA9ICgpID0+IHtcbiAgICAgICAgaWYgKGFjdGl2ZUFuaW1hdGlvbikge1xuICAgICAgICAgICAgYWN0aXZlQW5pbWF0aW9uLnN0b3AoKTtcbiAgICAgICAgICAgIGFjdGl2ZUFuaW1hdGlvbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IHN0YXJ0QW5pbWF0aW9uID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBjdXJyZW50VmFsdWUgPSBhc051bWJlcih2YWx1ZS5nZXQoKSk7XG4gICAgICAgIGNvbnN0IHRhcmdldFZhbHVlID0gYXNOdW1iZXIobGF0ZXN0VmFsdWUpO1xuICAgICAgICAvLyBEb24ndCBhbmltYXRlIGlmIHdlJ3JlIGFscmVhZHkgYXQgdGhlIHRhcmdldFxuICAgICAgICBpZiAoY3VycmVudFZhbHVlID09PSB0YXJnZXRWYWx1ZSkge1xuICAgICAgICAgICAgc3RvcEFuaW1hdGlvbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIFVzZSB0aGUgcnVubmluZyBhbmltYXRpb24ncyBhbmFseXRpY2FsIHZlbG9jaXR5IGZvciBhY2N1cmFjeSxcbiAgICAgICAgLy8gZmFsbGluZyBiYWNrIHRvIHRoZSBNb3Rpb25WYWx1ZSdzIHZlbG9jaXR5IGZvciB0aGUgaW5pdGlhbCBhbmltYXRpb24uXG4gICAgICAgIC8vIFRoaXMgcHJldmVudHMgc3lzdGVtYXRpYyB2ZWxvY2l0eSBsb3NzIGF0IGhpZ2ggZnJhbWUgcmF0ZXMgKDI0MGh6KykuXG4gICAgICAgIGNvbnN0IHZlbG9jaXR5ID0gYWN0aXZlQW5pbWF0aW9uXG4gICAgICAgICAgICA/IGFjdGl2ZUFuaW1hdGlvbi5nZXRHZW5lcmF0b3JWZWxvY2l0eSgpXG4gICAgICAgICAgICA6IHZhbHVlLmdldFZlbG9jaXR5KCk7XG4gICAgICAgIHN0b3BBbmltYXRpb24oKTtcbiAgICAgICAgYWN0aXZlQW5pbWF0aW9uID0gbmV3IEpTQW5pbWF0aW9uKHtcbiAgICAgICAgICAgIGtleWZyYW1lczogW2N1cnJlbnRWYWx1ZSwgdGFyZ2V0VmFsdWVdLFxuICAgICAgICAgICAgdmVsb2NpdHksXG4gICAgICAgICAgICAvLyBEZWZhdWx0IHRvIHNwcmluZyBpZiBubyB0eXBlIHNwZWNpZmllZCAobWF0Y2hlcyB1c2VTcHJpbmcgYmVoYXZpb3IpXG4gICAgICAgICAgICB0eXBlOiBcInNwcmluZ1wiLFxuICAgICAgICAgICAgcmVzdERlbHRhOiAwLjAwMSxcbiAgICAgICAgICAgIHJlc3RTcGVlZDogMC4wMSxcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICBvblVwZGF0ZTogbGF0ZXN0U2V0dGVyLFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8vIFVzZSBhIHN0YWJsZSBmdW5jdGlvbiByZWZlcmVuY2Ugc28gdGhlIGZyYW1lIGxvb3AgU2V0IGRlZHVwbGljYXRlc1xuICAgIC8vIG11bHRpcGxlIGNhbGxzIHdpdGhpbiB0aGUgc2FtZSBmcmFtZSAoZS5nLiByYXBpZCBtb3VzZSBldmVudHMpXG4gICAgY29uc3Qgc2NoZWR1bGVBbmltYXRpb24gPSAoKSA9PiB7XG4gICAgICAgIHN0YXJ0QW5pbWF0aW9uKCk7XG4gICAgICAgIHZhbHVlW1wiZXZlbnRzXCJdLmFuaW1hdGlvblN0YXJ0Py5ub3RpZnkoKTtcbiAgICAgICAgYWN0aXZlQW5pbWF0aW9uPy50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHZhbHVlW1wiZXZlbnRzXCJdLmFuaW1hdGlvbkNvbXBsZXRlPy5ub3RpZnkoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICB2YWx1ZS5hdHRhY2goKHYsIHNldCkgPT4ge1xuICAgICAgICBsYXRlc3RWYWx1ZSA9IHY7XG4gICAgICAgIGxhdGVzdFNldHRlciA9IChsYXRlc3QpID0+IHNldChwYXJzZVZhbHVlKGxhdGVzdCwgdW5pdCkpO1xuICAgICAgICBmcmFtZS5wb3N0UmVuZGVyKHNjaGVkdWxlQW5pbWF0aW9uKTtcbiAgICB9LCBzdG9wQW5pbWF0aW9uKTtcbiAgICBpZiAoaXNNb3Rpb25WYWx1ZShzb3VyY2UpKSB7XG4gICAgICAgIGxldCBza2lwTmV4dEFuaW1hdGlvbiA9IG9wdGlvbnMuc2tpcEluaXRpYWxBbmltYXRpb24gPT09IHRydWU7XG4gICAgICAgIGNvbnN0IHJlbW92ZVNvdXJjZU9uQ2hhbmdlID0gc291cmNlLm9uKFwiY2hhbmdlXCIsICh2KSA9PiB7XG4gICAgICAgICAgICBpZiAoc2tpcE5leHRBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICBza2lwTmV4dEFuaW1hdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhbHVlLmp1bXAocGFyc2VWYWx1ZSh2LCB1bml0KSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFsdWUuc2V0KHBhcnNlVmFsdWUodiwgdW5pdCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgcmVtb3ZlVmFsdWVPbkRlc3Ryb3kgPSB2YWx1ZS5vbihcImRlc3Ryb3lcIiwgcmVtb3ZlU291cmNlT25DaGFuZ2UpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgcmVtb3ZlU291cmNlT25DaGFuZ2UoKTtcbiAgICAgICAgICAgIHJlbW92ZVZhbHVlT25EZXN0cm95KCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBzdG9wQW5pbWF0aW9uO1xufVxuZnVuY3Rpb24gcGFyc2VWYWx1ZSh2LCB1bml0KSB7XG4gICAgcmV0dXJuIHVuaXQgPyB2ICsgdW5pdCA6IHY7XG59XG5mdW5jdGlvbiBhc051bWJlcih2KSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2ID09PSBcIm51bWJlclwiID8gdiA6IHBhcnNlRmxvYXQodik7XG59XG5cbmV4cG9ydCB7IGF0dGFjaEZvbGxvdywgZm9sbG93VmFsdWUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZvbGxvdy12YWx1ZS5tanMubWFwXG4iLCJpbXBvcnQgeyBjYW5jZWxGcmFtZSwgZnJhbWUgfSBmcm9tICcuLi9mcmFtZWxvb3AvZnJhbWUubWpzJztcblxuZnVuY3Rpb24gc3Vic2NyaWJlVmFsdWUoaW5wdXRWYWx1ZXMsIG91dHB1dFZhbHVlLCBnZXRMYXRlc3QpIHtcbiAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiBvdXRwdXRWYWx1ZS5zZXQoZ2V0TGF0ZXN0KCkpO1xuICAgIGNvbnN0IHNjaGVkdWxlVXBkYXRlID0gKCkgPT4gZnJhbWUucHJlUmVuZGVyKHVwZGF0ZSwgZmFsc2UsIHRydWUpO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBpbnB1dFZhbHVlcy5tYXAoKHYpID0+IHYub24oXCJjaGFuZ2VcIiwgc2NoZWR1bGVVcGRhdGUpKTtcbiAgICBvdXRwdXRWYWx1ZS5vbihcImRlc3Ryb3lcIiwgKCkgPT4ge1xuICAgICAgICBzdWJzY3JpcHRpb25zLmZvckVhY2goKHVuc3Vic2NyaWJlKSA9PiB1bnN1YnNjcmliZSgpKTtcbiAgICAgICAgY2FuY2VsRnJhbWUodXBkYXRlKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IHsgc3Vic2NyaWJlVmFsdWUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN1YnNjcmliZS12YWx1ZS5tanMubWFwXG4iLCJpbXBvcnQgeyBjb2xsZWN0TW90aW9uVmFsdWVzLCBtb3Rpb25WYWx1ZSB9IGZyb20gJy4vaW5kZXgubWpzJztcbmltcG9ydCB7IHN1YnNjcmliZVZhbHVlIH0gZnJvbSAnLi9zdWJzY3JpYmUtdmFsdWUubWpzJztcblxuLyoqXG4gKiBDcmVhdGUgYSBgTW90aW9uVmFsdWVgIHRoYXQgdHJhbnNmb3JtcyB0aGUgb3V0cHV0IG9mIG90aGVyIGBNb3Rpb25WYWx1ZWBzIGJ5XG4gKiBwYXNzaW5nIHRoZWlyIGxhdGVzdCB2YWx1ZXMgdGhyb3VnaCBhIHRyYW5zZm9ybSBmdW5jdGlvbi5cbiAqXG4gKiBXaGVuZXZlciBhIGBNb3Rpb25WYWx1ZWAgcmVmZXJyZWQgdG8gaW4gdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIGlzIHVwZGF0ZWQsXG4gKiBpdCB3aWxsIGJlIHJlLWV2YWx1YXRlZC5cbiAqXG4gKiBgYGBqc3hcbiAqIGNvbnN0IHggPSBtb3Rpb25WYWx1ZSgwKVxuICogY29uc3QgeSA9IHRyYW5zZm9ybVZhbHVlKCgpID0+IHguZ2V0KCkgKiAyKSAvLyBkb3VibGUgeFxuICogYGBgXG4gKlxuICogQHBhcmFtIHRyYW5zZm9ybWVyIC0gQSB0cmFuc2Zvcm0gZnVuY3Rpb24uIFRoaXMgZnVuY3Rpb24gbXVzdCBiZSBwdXJlIHdpdGggbm8gc2lkZS1lZmZlY3RzIG9yIGNvbmRpdGlvbmFsIHN0YXRlbWVudHMuXG4gKiBAcmV0dXJucyBgTW90aW9uVmFsdWVgXG4gKlxuICogQHB1YmxpY1xuICovXG5mdW5jdGlvbiB0cmFuc2Zvcm1WYWx1ZSh0cmFuc2Zvcm0pIHtcbiAgICBjb25zdCBjb2xsZWN0ZWRWYWx1ZXMgPSBbXTtcbiAgICAvKipcbiAgICAgKiBPcGVuIHNlc3Npb24gb2YgY29sbGVjdE1vdGlvblZhbHVlcy4gQW55IE1vdGlvblZhbHVlIHRoYXQgY2FsbHMgZ2V0KClcbiAgICAgKiBpbnNpZGUgdHJhbnNmb3JtIHdpbGwgYmUgc2F2ZWQgaW50byB0aGlzIGFycmF5LlxuICAgICAqL1xuICAgIGNvbGxlY3RNb3Rpb25WYWx1ZXMuY3VycmVudCA9IGNvbGxlY3RlZFZhbHVlcztcbiAgICBjb25zdCBpbml0aWFsVmFsdWUgPSB0cmFuc2Zvcm0oKTtcbiAgICBjb2xsZWN0TW90aW9uVmFsdWVzLmN1cnJlbnQgPSB1bmRlZmluZWQ7XG4gICAgY29uc3QgdmFsdWUgPSBtb3Rpb25WYWx1ZShpbml0aWFsVmFsdWUpO1xuICAgIHN1YnNjcmliZVZhbHVlKGNvbGxlY3RlZFZhbHVlcywgdmFsdWUsIHRyYW5zZm9ybSk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgeyB0cmFuc2Zvcm1WYWx1ZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHJhbnNmb3JtLXZhbHVlLm1qcy5tYXBcbiIsImltcG9ydCB7IGF0dGFjaEZvbGxvdywgZm9sbG93VmFsdWUgfSBmcm9tICcuL2ZvbGxvdy12YWx1ZS5tanMnO1xuXG4vKipcbiAqIENyZWF0ZSBhIGBNb3Rpb25WYWx1ZWAgdGhhdCBhbmltYXRlcyB0byBpdHMgbGF0ZXN0IHZhbHVlIHVzaW5nIGEgc3ByaW5nLlxuICogQ2FuIGVpdGhlciBiZSBhIHZhbHVlIG9yIHRyYWNrIGFub3RoZXIgYE1vdGlvblZhbHVlYC5cbiAqXG4gKiBgYGBqc3hcbiAqIGNvbnN0IHggPSBtb3Rpb25WYWx1ZSgwKVxuICogY29uc3QgeSA9IHNwcmluZ1ZhbHVlKHgsIHsgc3RpZmZuZXNzOiAzMDAgfSlcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBzb3VyY2UgLSBJbml0aWFsIHZhbHVlIG9yIE1vdGlvblZhbHVlIHRvIHRyYWNrXG4gKiBAcGFyYW0gb3B0aW9ucyAtIFNwcmluZyBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAqIEByZXR1cm5zIGBNb3Rpb25WYWx1ZWBcbiAqXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIHNwcmluZ1ZhbHVlKHNvdXJjZSwgb3B0aW9ucykge1xuICAgIHJldHVybiBmb2xsb3dWYWx1ZShzb3VyY2UsIHsgdHlwZTogXCJzcHJpbmdcIiwgLi4ub3B0aW9ucyB9KTtcbn1cbi8qKlxuICogQXR0YWNoIGEgc3ByaW5nIGFuaW1hdGlvbiB0byBhIE1vdGlvblZhbHVlIHRoYXQgd2lsbCBhbmltYXRlIHdoZW5ldmVyIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSAtIFRoZSBNb3Rpb25WYWx1ZSB0byBhbmltYXRlXG4gKiBAcGFyYW0gc291cmNlIC0gSW5pdGlhbCB2YWx1ZSBvciBNb3Rpb25WYWx1ZSB0byB0cmFja1xuICogQHBhcmFtIG9wdGlvbnMgLSBTcHJpbmcgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gKiBAcmV0dXJucyBDbGVhbnVwIGZ1bmN0aW9uXG4gKlxuICogQHB1YmxpY1xuICovXG5mdW5jdGlvbiBhdHRhY2hTcHJpbmcodmFsdWUsIHNvdXJjZSwgb3B0aW9ucykge1xuICAgIHJldHVybiBhdHRhY2hGb2xsb3codmFsdWUsIHNvdXJjZSwgeyB0eXBlOiBcInNwcmluZ1wiLCAuLi5vcHRpb25zIH0pO1xufVxuXG5leHBvcnQgeyBhdHRhY2hTcHJpbmcsIHNwcmluZ1ZhbHVlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zcHJpbmctdmFsdWUubWpzLm1hcFxuIiwiaW1wb3J0IHsgY29sb3IgfSBmcm9tICcuLi9jb2xvci9pbmRleC5tanMnO1xuaW1wb3J0IHsgY29tcGxleCB9IGZyb20gJy4uL2NvbXBsZXgvaW5kZXgubWpzJztcbmltcG9ydCB7IGRpbWVuc2lvblZhbHVlVHlwZXMgfSBmcm9tICcuLi9kaW1lbnNpb25zLm1qcyc7XG5pbXBvcnQgeyB0ZXN0VmFsdWVUeXBlIH0gZnJvbSAnLi4vdGVzdC5tanMnO1xuXG4vKipcbiAqIEEgbGlzdCBvZiBhbGwgVmFsdWVUeXBlc1xuICovXG5jb25zdCB2YWx1ZVR5cGVzID0gWy4uLmRpbWVuc2lvblZhbHVlVHlwZXMsIGNvbG9yLCBjb21wbGV4XTtcbi8qKlxuICogVGVzdHMgYSB2YWx1ZSBhZ2FpbnN0IHRoZSBsaXN0IG9mIFZhbHVlVHlwZXNcbiAqL1xuY29uc3QgZmluZFZhbHVlVHlwZSA9ICh2KSA9PiB2YWx1ZVR5cGVzLmZpbmQodGVzdFZhbHVlVHlwZSh2KSk7XG5cbmV4cG9ydCB7IGZpbmRWYWx1ZVR5cGUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbmQubWpzLm1hcFxuIiwiZnVuY3Rpb24gY2hvb3NlTGF5ZXJUeXBlKHZhbHVlTmFtZSkge1xuICAgIGlmICh2YWx1ZU5hbWUgPT09IFwibGF5b3V0XCIpXG4gICAgICAgIHJldHVybiBcImdyb3VwXCI7XG4gICAgaWYgKHZhbHVlTmFtZSA9PT0gXCJlbnRlclwiIHx8IHZhbHVlTmFtZSA9PT0gXCJuZXdcIilcbiAgICAgICAgcmV0dXJuIFwibmV3XCI7XG4gICAgaWYgKHZhbHVlTmFtZSA9PT0gXCJleGl0XCIgfHwgdmFsdWVOYW1lID09PSBcIm9sZFwiKVxuICAgICAgICByZXR1cm4gXCJvbGRcIjtcbiAgICByZXR1cm4gXCJncm91cFwiO1xufVxuXG5leHBvcnQgeyBjaG9vc2VMYXllclR5cGUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNob29zZS1sYXllci10eXBlLm1qcy5tYXBcbiIsImxldCBwZW5kaW5nUnVsZXMgPSB7fTtcbmxldCBzdHlsZSA9IG51bGw7XG5jb25zdCBjc3MgPSB7XG4gICAgc2V0OiAoc2VsZWN0b3IsIHZhbHVlcykgPT4ge1xuICAgICAgICBwZW5kaW5nUnVsZXNbc2VsZWN0b3JdID0gdmFsdWVzO1xuICAgIH0sXG4gICAgY29tbWl0OiAoKSA9PiB7XG4gICAgICAgIGlmICghc3R5bGUpIHtcbiAgICAgICAgICAgIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICAgICAgICAgICAgc3R5bGUuaWQgPSBcIm1vdGlvbi12aWV3XCI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNzc1RleHQgPSBcIlwiO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIGluIHBlbmRpbmdSdWxlcykge1xuICAgICAgICAgICAgY29uc3QgcnVsZSA9IHBlbmRpbmdSdWxlc1tzZWxlY3Rvcl07XG4gICAgICAgICAgICBjc3NUZXh0ICs9IGAke3NlbGVjdG9yfSB7XFxuYDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgW3Byb3BlcnR5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocnVsZSkpIHtcbiAgICAgICAgICAgICAgICBjc3NUZXh0ICs9IGAgICR7cHJvcGVydHl9OiAke3ZhbHVlfTtcXG5gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3NzVGV4dCArPSBcIn1cXG5cIjtcbiAgICAgICAgfVxuICAgICAgICBzdHlsZS50ZXh0Q29udGVudCA9IGNzc1RleHQ7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgICAgICBwZW5kaW5nUnVsZXMgPSB7fTtcbiAgICB9LFxuICAgIHJlbW92ZTogKCkgPT4ge1xuICAgICAgICBpZiAoc3R5bGUgJiYgc3R5bGUucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgc3R5bGUucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZSk7XG4gICAgICAgIH1cbiAgICB9LFxufTtcblxuZXhwb3J0IHsgY3NzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jc3MubWpzLm1hcFxuIiwiZnVuY3Rpb24gZ2V0Vmlld0FuaW1hdGlvbkxheWVySW5mbyhwc2V1ZG9FbGVtZW50KSB7XG4gICAgY29uc3QgbWF0Y2ggPSBwc2V1ZG9FbGVtZW50Lm1hdGNoKC86OnZpZXctdHJhbnNpdGlvbi0ob2xkfG5ld3xncm91cHxpbWFnZS1wYWlyKVxcKCguKj8pXFwpLyk7XG4gICAgaWYgKCFtYXRjaClcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHsgbGF5ZXI6IG1hdGNoWzJdLCB0eXBlOiBtYXRjaFsxXSB9O1xufVxuXG5leHBvcnQgeyBnZXRWaWV3QW5pbWF0aW9uTGF5ZXJJbmZvIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1nZXQtbGF5ZXItaW5mby5tanMubWFwXG4iLCJmdW5jdGlvbiBmaWx0ZXJWaWV3QW5pbWF0aW9ucyhhbmltYXRpb24pIHtcbiAgICBjb25zdCB7IGVmZmVjdCB9ID0gYW5pbWF0aW9uO1xuICAgIGlmICghZWZmZWN0KVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIChlZmZlY3QudGFyZ2V0ID09PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiZcbiAgICAgICAgZWZmZWN0LnBzZXVkb0VsZW1lbnQ/LnN0YXJ0c1dpdGgoXCI6OnZpZXctdHJhbnNpdGlvblwiKSk7XG59XG5mdW5jdGlvbiBnZXRWaWV3QW5pbWF0aW9ucygpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0QW5pbWF0aW9ucygpLmZpbHRlcihmaWx0ZXJWaWV3QW5pbWF0aW9ucyk7XG59XG5cbmV4cG9ydCB7IGdldFZpZXdBbmltYXRpb25zIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1nZXQtdmlldy1hbmltYXRpb25zLm1qcy5tYXBcbiIsImZ1bmN0aW9uIGhhc1RhcmdldCh0YXJnZXQsIHRhcmdldHMpIHtcbiAgICByZXR1cm4gdGFyZ2V0cy5oYXModGFyZ2V0KSAmJiBPYmplY3Qua2V5cyh0YXJnZXRzLmdldCh0YXJnZXQpKS5sZW5ndGggPiAwO1xufVxuXG5leHBvcnQgeyBoYXNUYXJnZXQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhhcy10YXJnZXQubWpzLm1hcFxuIiwiaW1wb3J0IHsgc2Vjb25kc1RvTWlsbGlzZWNvbmRzIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcbmltcG9ydCB7IEdyb3VwQW5pbWF0aW9uIH0gZnJvbSAnLi4vYW5pbWF0aW9uL0dyb3VwQW5pbWF0aW9uLm1qcyc7XG5pbXBvcnQgeyBOYXRpdmVBbmltYXRpb24gfSBmcm9tICcuLi9hbmltYXRpb24vTmF0aXZlQW5pbWF0aW9uLm1qcyc7XG5pbXBvcnQgeyBOYXRpdmVBbmltYXRpb25XcmFwcGVyIH0gZnJvbSAnLi4vYW5pbWF0aW9uL05hdGl2ZUFuaW1hdGlvbldyYXBwZXIubWpzJztcbmltcG9ydCB7IGdldFZhbHVlVHJhbnNpdGlvbiB9IGZyb20gJy4uL2FuaW1hdGlvbi91dGlscy9nZXQtdmFsdWUtdHJhbnNpdGlvbi5tanMnO1xuaW1wb3J0IHsgbWFwRWFzaW5nVG9OYXRpdmVFYXNpbmcgfSBmcm9tICcuLi9hbmltYXRpb24vd2FhcGkvZWFzaW5nL21hcC1lYXNpbmcubWpzJztcbmltcG9ydCB7IGFwcGx5R2VuZXJhdG9yT3B0aW9ucyB9IGZyb20gJy4uL2FuaW1hdGlvbi93YWFwaS91dGlscy9hcHBseS1nZW5lcmF0b3IubWpzJztcbmltcG9ydCB7IGNob29zZUxheWVyVHlwZSB9IGZyb20gJy4vdXRpbHMvY2hvb3NlLWxheWVyLXR5cGUubWpzJztcbmltcG9ydCB7IGNzcyB9IGZyb20gJy4vdXRpbHMvY3NzLm1qcyc7XG5pbXBvcnQgeyBnZXRWaWV3QW5pbWF0aW9uTGF5ZXJJbmZvIH0gZnJvbSAnLi91dGlscy9nZXQtbGF5ZXItaW5mby5tanMnO1xuaW1wb3J0IHsgZ2V0Vmlld0FuaW1hdGlvbnMgfSBmcm9tICcuL3V0aWxzL2dldC12aWV3LWFuaW1hdGlvbnMubWpzJztcbmltcG9ydCB7IGhhc1RhcmdldCB9IGZyb20gJy4vdXRpbHMvaGFzLXRhcmdldC5tanMnO1xuXG5jb25zdCBkZWZpbml0aW9uTmFtZXMgPSBbXCJsYXlvdXRcIiwgXCJlbnRlclwiLCBcImV4aXRcIiwgXCJuZXdcIiwgXCJvbGRcIl07XG5mdW5jdGlvbiBzdGFydFZpZXdBbmltYXRpb24oYnVpbGRlcikge1xuICAgIGNvbnN0IHsgdXBkYXRlLCB0YXJnZXRzLCBvcHRpb25zOiBkZWZhdWx0T3B0aW9ucyB9ID0gYnVpbGRlcjtcbiAgICBpZiAoIWRvY3VtZW50LnN0YXJ0Vmlld1RyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGUoKTtcbiAgICAgICAgICAgIHJlc29sdmUobmV3IEdyb3VwQW5pbWF0aW9uKFtdKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBUT0RPOiBHbyBvdmVyIGV4aXN0aW5nIHRhcmdldHMgYW5kIGVuc3VyZSB0aGV5IGFsbCBoYXZlIGlkc1xuICAgIC8qKlxuICAgICAqIElmIHdlIGRvbid0IGhhdmUgYW55IGFuaW1hdGlvbnMgZGVmaW5lZCBmb3IgdGhlIHJvb3QgdGFyZ2V0LFxuICAgICAqIHJlbW92ZSBpdCBmcm9tIGJlaW5nIGNhcHR1cmVkLlxuICAgICAqL1xuICAgIGlmICghaGFzVGFyZ2V0KFwicm9vdFwiLCB0YXJnZXRzKSkge1xuICAgICAgICBjc3Muc2V0KFwiOnJvb3RcIiwge1xuICAgICAgICAgICAgXCJ2aWV3LXRyYW5zaXRpb24tbmFtZVwiOiBcIm5vbmVcIixcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgdGltaW5nIGN1cnZlIHRvIGxpbmVhciBmb3IgYWxsIHZpZXcgdHJhbnNpdGlvbiBsYXllcnMuXG4gICAgICogVGhpcyBnZXRzIGJha2VkIGludG8gdGhlIGtleWZyYW1lcywgd2hpY2ggY2FuJ3QgYmUgY2hhbmdlZFxuICAgICAqIHdpdGhvdXQgYnJlYWtpbmcgdGhlIGdlbmVyYXRlZCBhbmltYXRpb24uXG4gICAgICpcbiAgICAgKiBUaGlzIGFsbG93cyB1cyB0byBzZXQgZWFzaW5nIHZpYSB1cGRhdGVUaW1pbmcgLSB3aGljaCBjYW4gYmUgY2hhbmdlZC5cbiAgICAgKi9cbiAgICBjc3Muc2V0KFwiOjp2aWV3LXRyYW5zaXRpb24tZ3JvdXAoKiksIDo6dmlldy10cmFuc2l0aW9uLW9sZCgqKSwgOjp2aWV3LXRyYW5zaXRpb24tbmV3KCopXCIsIHsgXCJhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uXCI6IFwibGluZWFyICFpbXBvcnRhbnRcIiB9KTtcbiAgICBjc3MuY29tbWl0KCk7IC8vIFdyaXRlXG4gICAgY29uc3QgdHJhbnNpdGlvbiA9IGRvY3VtZW50LnN0YXJ0Vmlld1RyYW5zaXRpb24oYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB1cGRhdGUoKTtcbiAgICAgICAgLy8gVE9ETzogR28gb3ZlciBuZXcgdGFyZ2V0cyBhbmQgZW5zdXJlIHRoZXkgYWxsIGhhdmUgaWRzXG4gICAgfSk7XG4gICAgdHJhbnNpdGlvbi5maW5pc2hlZC5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgY3NzLnJlbW92ZSgpOyAvLyBXcml0ZVxuICAgIH0pO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0cmFuc2l0aW9uLnJlYWR5LnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZ2VuZXJhdGVkVmlld0FuaW1hdGlvbnMgPSBnZXRWaWV3QW5pbWF0aW9ucygpO1xuICAgICAgICAgICAgY29uc3QgYW5pbWF0aW9ucyA9IFtdO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBDcmVhdGUgYW5pbWF0aW9ucyBmb3IgZWFjaCBvZiBvdXIgZXhwbGljaXRseS1kZWZpbmVkIHN1YmplY3RzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0YXJnZXRzLmZvckVhY2goKGRlZmluaXRpb24sIHRhcmdldCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IElmIHRhcmdldCBpcyBub3QgXCJyb290XCIsIHJlc29sdmUgZWxlbWVudHNcbiAgICAgICAgICAgICAgICAvLyBhbmQgaXRlcmF0ZSBvdmVyIGVhY2hcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBkZWZpbml0aW9uTmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkZWZpbml0aW9uW2tleV0pXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBrZXlmcmFtZXMsIG9wdGlvbnMgfSA9IGRlZmluaXRpb25ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgW3ZhbHVlTmFtZSwgdmFsdWVLZXlmcmFtZXNdIG9mIE9iamVjdC5lbnRyaWVzKGtleWZyYW1lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdmFsdWVLZXlmcmFtZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uZ2V0VmFsdWVUcmFuc2l0aW9uKGRlZmF1bHRPcHRpb25zLCB2YWx1ZU5hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmdldFZhbHVlVHJhbnNpdGlvbihvcHRpb25zLCB2YWx1ZU5hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBjaG9vc2VMYXllclR5cGUoa2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICogSWYgdGhpcyBpcyBhbiBvcGFjaXR5IGFuaW1hdGlvbiwgYW5kIGtleWZyYW1lcyBhcmUgbm90IGFuIGFycmF5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICogd2UgbmVlZCB0byBjb252ZXJ0IHRoZW0gaW50byBhbiBhcnJheSBhbmQgc2V0IGFuIGluaXRpYWwgdmFsdWUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZU5hbWUgPT09IFwib3BhY2l0eVwiICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIUFycmF5LmlzQXJyYXkodmFsdWVLZXlmcmFtZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5pdGlhbFZhbHVlID0gdHlwZSA9PT0gXCJuZXdcIiA/IDAgOiAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlS2V5ZnJhbWVzID0gW2luaXRpYWxWYWx1ZSwgdmFsdWVLZXlmcmFtZXNdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBSZXNvbHZlIHN0YWdnZXIgZnVuY3Rpb24gaWYgcHJvdmlkZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWVPcHRpb25zLmRlbGF5ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZU9wdGlvbnMuZGVsYXkgPSB2YWx1ZU9wdGlvbnMuZGVsYXkoMCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZU9wdGlvbnMuZHVyYXRpb24gJiYgKHZhbHVlT3B0aW9ucy5kdXJhdGlvbiA9IHNlY29uZHNUb01pbGxpc2Vjb25kcyh2YWx1ZU9wdGlvbnMuZHVyYXRpb24pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlT3B0aW9ucy5kZWxheSAmJiAodmFsdWVPcHRpb25zLmRlbGF5ID0gc2Vjb25kc1RvTWlsbGlzZWNvbmRzKHZhbHVlT3B0aW9ucy5kZWxheSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5pbWF0aW9uID0gbmV3IE5hdGl2ZUFuaW1hdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4udmFsdWVPcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiB2YWx1ZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHNldWRvRWxlbWVudDogYDo6dmlldy10cmFuc2l0aW9uLSR7dHlwZX0oJHt0YXJnZXR9KWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5ZnJhbWVzOiB2YWx1ZUtleWZyYW1lcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9ucy5wdXNoKGFuaW1hdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSGFuZGxlIGJyb3dzZXIgZ2VuZXJhdGVkIGFuaW1hdGlvbnNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZm9yIChjb25zdCBhbmltYXRpb24gb2YgZ2VuZXJhdGVkVmlld0FuaW1hdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5pbWF0aW9uLnBsYXlTdGF0ZSA9PT0gXCJmaW5pc2hlZFwiKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGVmZmVjdCB9ID0gYW5pbWF0aW9uO1xuICAgICAgICAgICAgICAgIGlmICghZWZmZWN0IHx8ICEoZWZmZWN0IGluc3RhbmNlb2YgS2V5ZnJhbWVFZmZlY3QpKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHBzZXVkb0VsZW1lbnQgfSA9IGVmZmVjdDtcbiAgICAgICAgICAgICAgICBpZiAoIXBzZXVkb0VsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBnZXRWaWV3QW5pbWF0aW9uTGF5ZXJJbmZvKHBzZXVkb0VsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGlmICghbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0RGVmaW5pdGlvbiA9IHRhcmdldHMuZ2V0KG5hbWUubGF5ZXIpO1xuICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0RGVmaW5pdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSWYgdHJhbnNpdGlvbiBuYW1lIGlzIGdyb3VwIHRoZW4gdXBkYXRlIHRoZSB0aW1pbmcgb2YgdGhlIGFuaW1hdGlvblxuICAgICAgICAgICAgICAgICAgICAgKiB3aGVyZWFzIGlmIGl0J3Mgb2xkIG9yIG5ldyB0aGVuIHdlIGNvdWxkIHBvc3NpYmx5IHJlcGxhY2UgaXQgdXNpbmdcbiAgICAgICAgICAgICAgICAgICAgICogdGhlIGFib3ZlIG1ldGhvZC5cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zaXRpb25OYW1lID0gbmFtZS50eXBlID09PSBcImdyb3VwXCIgPyBcImxheW91dFwiIDogXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFuaW1hdGlvblRyYW5zaXRpb24gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5nZXRWYWx1ZVRyYW5zaXRpb24oZGVmYXVsdE9wdGlvbnMsIHRyYW5zaXRpb25OYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uVHJhbnNpdGlvbi5kdXJhdGlvbiAmJiAoYW5pbWF0aW9uVHJhbnNpdGlvbi5kdXJhdGlvbiA9IHNlY29uZHNUb01pbGxpc2Vjb25kcyhhbmltYXRpb25UcmFuc2l0aW9uLmR1cmF0aW9uKSk7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvblRyYW5zaXRpb24gPVxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwbHlHZW5lcmF0b3JPcHRpb25zKGFuaW1hdGlvblRyYW5zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlYXNpbmcgPSBtYXBFYXNpbmdUb05hdGl2ZUVhc2luZyhhbmltYXRpb25UcmFuc2l0aW9uLmVhc2UsIGFuaW1hdGlvblRyYW5zaXRpb24uZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBlZmZlY3QudXBkYXRlVGltaW5nKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5OiBzZWNvbmRzVG9NaWxsaXNlY29uZHMoYW5pbWF0aW9uVHJhbnNpdGlvbi5kZWxheSA/PyAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBhbmltYXRpb25UcmFuc2l0aW9uLmR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWFzaW5nLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9ucy5wdXNoKG5ldyBOYXRpdmVBbmltYXRpb25XcmFwcGVyKGFuaW1hdGlvbikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChoYXNPcGFjaXR5KHRhcmdldERlZmluaXRpb24sIFwiZW50ZXJcIikgJiZcbiAgICAgICAgICAgICAgICAgICAgaGFzT3BhY2l0eSh0YXJnZXREZWZpbml0aW9uLCBcImV4aXRcIikgJiZcbiAgICAgICAgICAgICAgICAgICAgZWZmZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICAuZ2V0S2V5ZnJhbWVzKClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zb21lKChrZXlmcmFtZSkgPT4ga2V5ZnJhbWUubWl4QmxlbmRNb2RlKSkge1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25zLnB1c2gobmV3IE5hdGl2ZUFuaW1hdGlvbldyYXBwZXIoYW5pbWF0aW9uKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb24uY2FuY2VsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzb2x2ZShuZXcgR3JvdXBBbmltYXRpb24oYW5pbWF0aW9ucykpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGhhc09wYWNpdHkodGFyZ2V0LCBrZXkpIHtcbiAgICByZXR1cm4gdGFyZ2V0Py5ba2V5XT8ua2V5ZnJhbWVzLm9wYWNpdHk7XG59XG5cbmV4cG9ydCB7IHN0YXJ0Vmlld0FuaW1hdGlvbiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RhcnQubWpzLm1hcFxuIiwiaW1wb3J0IHsgcmVtb3ZlSXRlbSB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBtaWNyb3Rhc2sgfSBmcm9tICcuLi9mcmFtZWxvb3AvbWljcm90YXNrLm1qcyc7XG5pbXBvcnQgeyBzdGFydFZpZXdBbmltYXRpb24gfSBmcm9tICcuL3N0YXJ0Lm1qcyc7XG5cbmxldCBidWlsZGVycyA9IFtdO1xubGV0IGN1cnJlbnQgPSBudWxsO1xuZnVuY3Rpb24gbmV4dCgpIHtcbiAgICBjdXJyZW50ID0gbnVsbDtcbiAgICBjb25zdCBbbmV4dEJ1aWxkZXJdID0gYnVpbGRlcnM7XG4gICAgaWYgKG5leHRCdWlsZGVyKVxuICAgICAgICBzdGFydChuZXh0QnVpbGRlcik7XG59XG5mdW5jdGlvbiBzdGFydChidWlsZGVyKSB7XG4gICAgcmVtb3ZlSXRlbShidWlsZGVycywgYnVpbGRlcik7XG4gICAgY3VycmVudCA9IGJ1aWxkZXI7XG4gICAgc3RhcnRWaWV3QW5pbWF0aW9uKGJ1aWxkZXIpLnRoZW4oKGFuaW1hdGlvbikgPT4ge1xuICAgICAgICBidWlsZGVyLm5vdGlmeVJlYWR5KGFuaW1hdGlvbik7XG4gICAgICAgIGFuaW1hdGlvbi5maW5pc2hlZC5maW5hbGx5KG5leHQpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gcHJvY2Vzc1F1ZXVlKCkge1xuICAgIC8qKlxuICAgICAqIEl0ZXJhdGUgYmFja3dhcmRzIG92ZXIgdGhlIGJ1aWxkZXJzIGFycmF5LiBXZSBjYW4gaWdub3JlIHRoZVxuICAgICAqIFwid2FpdFwiIGFuaW1hdGlvbnMuIElmIHdlIGhhdmUgYW4gaW50ZXJydXB0aW5nIGFuaW1hdGlvbiBpbiB0aGVcbiAgICAgKiBxdWV1ZSB0aGVuIHdlIG5lZWQgdG8gYmF0Y2ggYWxsIHByZWNlZWRpbmcgYW5pbWF0aW9ucyBpbnRvIGl0LlxuICAgICAqIEN1cnJlbnRseSB0aGlzIG9ubHkgYmF0Y2hlcyB0aGUgdXBkYXRlIGZ1bmN0aW9ucyBidXQgd2lsbCBhbHNvXG4gICAgICogbmVlZCB0byBiYXRjaCB0aGUgdGFyZ2V0cy5cbiAgICAgKi9cbiAgICBmb3IgKGxldCBpID0gYnVpbGRlcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3QgYnVpbGRlciA9IGJ1aWxkZXJzW2ldO1xuICAgICAgICBjb25zdCB7IGludGVycnVwdCB9ID0gYnVpbGRlci5vcHRpb25zO1xuICAgICAgICBpZiAoaW50ZXJydXB0ID09PSBcImltbWVkaWF0ZVwiKSB7XG4gICAgICAgICAgICBjb25zdCBiYXRjaGVkVXBkYXRlcyA9IGJ1aWxkZXJzLnNsaWNlKDAsIGkgKyAxKS5tYXAoKGIpID0+IGIudXBkYXRlKTtcbiAgICAgICAgICAgIGNvbnN0IHJlbWFpbmluZyA9IGJ1aWxkZXJzLnNsaWNlKGkgKyAxKTtcbiAgICAgICAgICAgIGJ1aWxkZXIudXBkYXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGJhdGNoZWRVcGRhdGVzLmZvckVhY2goKHVwZGF0ZSkgPT4gdXBkYXRlKCkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIFB1dCB0aGUgY3VycmVudCBidWlsZGVyIGF0IHRoZSBmcm9udCwgZm9sbG93ZWQgYnkgYW55IFwid2FpdFwiIGJ1aWxkZXJzXG4gICAgICAgICAgICBidWlsZGVycyA9IFtidWlsZGVyLCAuLi5yZW1haW5pbmddO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFjdXJyZW50IHx8IGJ1aWxkZXJzWzBdPy5vcHRpb25zLmludGVycnVwdCA9PT0gXCJpbW1lZGlhdGVcIikge1xuICAgICAgICBuZXh0KCk7XG4gICAgfVxufVxuZnVuY3Rpb24gYWRkVG9RdWV1ZShidWlsZGVyKSB7XG4gICAgYnVpbGRlcnMucHVzaChidWlsZGVyKTtcbiAgICBtaWNyb3Rhc2sucmVuZGVyKHByb2Nlc3NRdWV1ZSk7XG59XG5cbmV4cG9ydCB7IGFkZFRvUXVldWUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXF1ZXVlLm1qcy5tYXBcbiIsImltcG9ydCB7IG5vb3AgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgYWRkVG9RdWV1ZSB9IGZyb20gJy4vcXVldWUubWpzJztcblxuY2xhc3MgVmlld1RyYW5zaXRpb25CdWlsZGVyIHtcbiAgICBjb25zdHJ1Y3Rvcih1cGRhdGUsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTdWJqZWN0ID0gXCJyb290XCI7XG4gICAgICAgIHRoaXMudGFyZ2V0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5ub3RpZnlSZWFkeSA9IG5vb3A7XG4gICAgICAgIHRoaXMucmVhZHlQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHRoaXMubm90aWZ5UmVhZHkgPSByZXNvbHZlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy51cGRhdGUgPSB1cGRhdGU7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGludGVycnVwdDogXCJ3YWl0XCIsXG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICB9O1xuICAgICAgICBhZGRUb1F1ZXVlKHRoaXMpO1xuICAgIH1cbiAgICBnZXQoc3ViamVjdCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTdWJqZWN0ID0gc3ViamVjdDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGxheW91dChrZXlmcmFtZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy51cGRhdGVUYXJnZXQoXCJsYXlvdXRcIiwga2V5ZnJhbWVzLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIG5ldyhrZXlmcmFtZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy51cGRhdGVUYXJnZXQoXCJuZXdcIiwga2V5ZnJhbWVzLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIG9sZChrZXlmcmFtZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy51cGRhdGVUYXJnZXQoXCJvbGRcIiwga2V5ZnJhbWVzLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGVudGVyKGtleWZyYW1lcywgb3B0aW9ucykge1xuICAgICAgICB0aGlzLnVwZGF0ZVRhcmdldChcImVudGVyXCIsIGtleWZyYW1lcywgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBleGl0KGtleWZyYW1lcywgb3B0aW9ucykge1xuICAgICAgICB0aGlzLnVwZGF0ZVRhcmdldChcImV4aXRcIiwga2V5ZnJhbWVzLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGNyb3NzZmFkZShvcHRpb25zKSB7XG4gICAgICAgIHRoaXMudXBkYXRlVGFyZ2V0KFwiZW50ZXJcIiwgeyBvcGFjaXR5OiAxIH0sIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRhcmdldChcImV4aXRcIiwgeyBvcGFjaXR5OiAwIH0sIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgdXBkYXRlVGFyZ2V0KHRhcmdldCwga2V5ZnJhbWVzLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgY29uc3QgeyBjdXJyZW50U3ViamVjdCwgdGFyZ2V0cyB9ID0gdGhpcztcbiAgICAgICAgaWYgKCF0YXJnZXRzLmhhcyhjdXJyZW50U3ViamVjdCkpIHtcbiAgICAgICAgICAgIHRhcmdldHMuc2V0KGN1cnJlbnRTdWJqZWN0LCB7fSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGFyZ2V0RGF0YSA9IHRhcmdldHMuZ2V0KGN1cnJlbnRTdWJqZWN0KTtcbiAgICAgICAgdGFyZ2V0RGF0YVt0YXJnZXRdID0geyBrZXlmcmFtZXMsIG9wdGlvbnMgfTtcbiAgICB9XG4gICAgdGhlbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVhZHlQcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9XG59XG5mdW5jdGlvbiBhbmltYXRlVmlldyh1cGRhdGUsIGRlZmF1bHRPcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gbmV3IFZpZXdUcmFuc2l0aW9uQnVpbGRlcih1cGRhdGUsIGRlZmF1bHRPcHRpb25zKTtcbn1cblxuZXhwb3J0IHsgVmlld1RyYW5zaXRpb25CdWlsZGVyLCBhbmltYXRlVmlldyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXgubWpzLm1hcFxuIiwiY29uc3QgY3JlYXRlQXhpc0RlbHRhID0gKCkgPT4gKHtcbiAgICB0cmFuc2xhdGU6IDAsXG4gICAgc2NhbGU6IDEsXG4gICAgb3JpZ2luOiAwLFxuICAgIG9yaWdpblBvaW50OiAwLFxufSk7XG5jb25zdCBjcmVhdGVEZWx0YSA9ICgpID0+ICh7XG4gICAgeDogY3JlYXRlQXhpc0RlbHRhKCksXG4gICAgeTogY3JlYXRlQXhpc0RlbHRhKCksXG59KTtcbmNvbnN0IGNyZWF0ZUF4aXMgPSAoKSA9PiAoeyBtaW46IDAsIG1heDogMCB9KTtcbmNvbnN0IGNyZWF0ZUJveCA9ICgpID0+ICh7XG4gICAgeDogY3JlYXRlQXhpcygpLFxuICAgIHk6IGNyZWF0ZUF4aXMoKSxcbn0pO1xuXG5leHBvcnQgeyBjcmVhdGVBeGlzLCBjcmVhdGVBeGlzRGVsdGEsIGNyZWF0ZUJveCwgY3JlYXRlRGVsdGEgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1vZGVscy5tanMubWFwXG4iLCJjb25zdCB2aXN1YWxFbGVtZW50U3RvcmUgPSBuZXcgV2Vha01hcCgpO1xuXG5leHBvcnQgeyB2aXN1YWxFbGVtZW50U3RvcmUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0b3JlLm1qcy5tYXBcbiIsImZ1bmN0aW9uIGlzQW5pbWF0aW9uQ29udHJvbHModikge1xuICAgIHJldHVybiAodiAhPT0gbnVsbCAmJlxuICAgICAgICB0eXBlb2YgdiA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICB0eXBlb2Ygdi5zdGFydCA9PT0gXCJmdW5jdGlvblwiKTtcbn1cblxuZXhwb3J0IHsgaXNBbmltYXRpb25Db250cm9scyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtYW5pbWF0aW9uLWNvbnRyb2xzLm1qcy5tYXBcbiIsIi8qKlxuICogRGVjaWRlcyBpZiB0aGUgc3VwcGxpZWQgdmFyaWFibGUgaXMgdmFyaWFudCBsYWJlbFxuICovXG5mdW5jdGlvbiBpc1ZhcmlhbnRMYWJlbCh2KSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2ID09PSBcInN0cmluZ1wiIHx8IEFycmF5LmlzQXJyYXkodik7XG59XG5cbmV4cG9ydCB7IGlzVmFyaWFudExhYmVsIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pcy12YXJpYW50LWxhYmVsLm1qcy5tYXBcbiIsImNvbnN0IHZhcmlhbnRQcmlvcml0eU9yZGVyID0gW1xuICAgIFwiYW5pbWF0ZVwiLFxuICAgIFwid2hpbGVJblZpZXdcIixcbiAgICBcIndoaWxlRm9jdXNcIixcbiAgICBcIndoaWxlSG92ZXJcIixcbiAgICBcIndoaWxlVGFwXCIsXG4gICAgXCJ3aGlsZURyYWdcIixcbiAgICBcImV4aXRcIixcbl07XG5jb25zdCB2YXJpYW50UHJvcHMgPSBbXCJpbml0aWFsXCIsIC4uLnZhcmlhbnRQcmlvcml0eU9yZGVyXTtcblxuZXhwb3J0IHsgdmFyaWFudFByaW9yaXR5T3JkZXIsIHZhcmlhbnRQcm9wcyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dmFyaWFudC1wcm9wcy5tanMubWFwXG4iLCJpbXBvcnQgeyBpc0FuaW1hdGlvbkNvbnRyb2xzIH0gZnJvbSAnLi9pcy1hbmltYXRpb24tY29udHJvbHMubWpzJztcbmltcG9ydCB7IGlzVmFyaWFudExhYmVsIH0gZnJvbSAnLi9pcy12YXJpYW50LWxhYmVsLm1qcyc7XG5pbXBvcnQgeyB2YXJpYW50UHJvcHMgfSBmcm9tICcuL3ZhcmlhbnQtcHJvcHMubWpzJztcblxuZnVuY3Rpb24gaXNDb250cm9sbGluZ1ZhcmlhbnRzKHByb3BzKSB7XG4gICAgcmV0dXJuIChpc0FuaW1hdGlvbkNvbnRyb2xzKHByb3BzLmFuaW1hdGUpIHx8XG4gICAgICAgIHZhcmlhbnRQcm9wcy5zb21lKChuYW1lKSA9PiBpc1ZhcmlhbnRMYWJlbChwcm9wc1tuYW1lXSkpKTtcbn1cbmZ1bmN0aW9uIGlzVmFyaWFudE5vZGUocHJvcHMpIHtcbiAgICByZXR1cm4gQm9vbGVhbihpc0NvbnRyb2xsaW5nVmFyaWFudHMocHJvcHMpIHx8IHByb3BzLnZhcmlhbnRzKTtcbn1cblxuZXhwb3J0IHsgaXNDb250cm9sbGluZ1ZhcmlhbnRzLCBpc1ZhcmlhbnROb2RlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pcy1jb250cm9sbGluZy12YXJpYW50cy5tanMubWFwXG4iLCJpbXBvcnQgeyBtb3Rpb25WYWx1ZSB9IGZyb20gJy4uLy4uL3ZhbHVlL2luZGV4Lm1qcyc7XG5pbXBvcnQgeyBpc01vdGlvblZhbHVlIH0gZnJvbSAnLi4vLi4vdmFsdWUvdXRpbHMvaXMtbW90aW9uLXZhbHVlLm1qcyc7XG5cbi8qKlxuICogVXBkYXRlcyBtb3Rpb24gdmFsdWVzIGZyb20gcHJvcHMgY2hhbmdlcy5cbiAqIFVzZXMgYGFueWAgdHlwZSBmb3IgZWxlbWVudCB0byBhdm9pZCBjaXJjdWxhciBkZXBlbmRlbmNpZXMgd2l0aCBWaXN1YWxFbGVtZW50LlxuICovXG5mdW5jdGlvbiB1cGRhdGVNb3Rpb25WYWx1ZXNGcm9tUHJvcHMoZWxlbWVudCwgbmV4dCwgcHJldikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIG5leHQpIHtcbiAgICAgICAgY29uc3QgbmV4dFZhbHVlID0gbmV4dFtrZXldO1xuICAgICAgICBjb25zdCBwcmV2VmFsdWUgPSBwcmV2W2tleV07XG4gICAgICAgIGlmIChpc01vdGlvblZhbHVlKG5leHRWYWx1ZSkpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgdGhpcyBpcyBhIG1vdGlvbiB2YWx1ZSBmb3VuZCBpbiBwcm9wcyBvciBzdHlsZSwgd2Ugd2FudCB0byBhZGQgaXRcbiAgICAgICAgICAgICAqIHRvIG91ciB2aXN1YWwgZWxlbWVudCdzIG1vdGlvbiB2YWx1ZSBtYXAuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGVsZW1lbnQuYWRkVmFsdWUoa2V5LCBuZXh0VmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzTW90aW9uVmFsdWUocHJldlZhbHVlKSkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiB3ZSdyZSBzd2FwcGluZyBmcm9tIGEgbW90aW9uIHZhbHVlIHRvIGEgc3RhdGljIHZhbHVlLFxuICAgICAgICAgICAgICogY3JlYXRlIGEgbmV3IG1vdGlvbiB2YWx1ZSBmcm9tIHRoYXRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZWxlbWVudC5hZGRWYWx1ZShrZXksIG1vdGlvblZhbHVlKG5leHRWYWx1ZSwgeyBvd25lcjogZWxlbWVudCB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocHJldlZhbHVlICE9PSBuZXh0VmFsdWUpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgdGhpcyBpcyBhIGZsYXQgdmFsdWUgdGhhdCBoYXMgY2hhbmdlZCwgdXBkYXRlIHRoZSBtb3Rpb24gdmFsdWVcbiAgICAgICAgICAgICAqIG9yIGNyZWF0ZSBvbmUgaWYgaXQgZG9lc24ndCBleGlzdC4gV2Ugb25seSB3YW50IHRvIGRvIHRoaXMgaWYgd2UncmVcbiAgICAgICAgICAgICAqIG5vdCBoYW5kbGluZyB0aGUgdmFsdWUgd2l0aCBvdXIgYW5pbWF0aW9uIHN0YXRlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5oYXNWYWx1ZShrZXkpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdWYWx1ZSA9IGVsZW1lbnQuZ2V0VmFsdWUoa2V5KTtcbiAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdWYWx1ZS5saXZlU3R5bGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdWYWx1ZS5qdW1wKG5leHRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFleGlzdGluZ1ZhbHVlLmhhc0FuaW1hdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVmFsdWUuc2V0KG5leHRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGF0ZXN0VmFsdWUgPSBlbGVtZW50LmdldFN0YXRpY1ZhbHVlKGtleSk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRWYWx1ZShrZXksIG1vdGlvblZhbHVlKGxhdGVzdFZhbHVlICE9PSB1bmRlZmluZWQgPyBsYXRlc3RWYWx1ZSA6IG5leHRWYWx1ZSwgeyBvd25lcjogZWxlbWVudCB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gSGFuZGxlIHJlbW92ZWQgdmFsdWVzXG4gICAgZm9yIChjb25zdCBrZXkgaW4gcHJldikge1xuICAgICAgICBpZiAobmV4dFtrZXldID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZVZhbHVlKGtleSk7XG4gICAgfVxuICAgIHJldHVybiBuZXh0O1xufVxuXG5leHBvcnQgeyB1cGRhdGVNb3Rpb25WYWx1ZXNGcm9tUHJvcHMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1vdGlvbi12YWx1ZXMubWpzLm1hcFxuIiwiLy8gRG9lcyB0aGlzIGRldmljZSBwcmVmZXIgcmVkdWNlZCBtb3Rpb24/IFJldHVybnMgYG51bGxgIHNlcnZlci1zaWRlLlxuY29uc3QgcHJlZmVyc1JlZHVjZWRNb3Rpb24gPSB7IGN1cnJlbnQ6IG51bGwgfTtcbmNvbnN0IGhhc1JlZHVjZWRNb3Rpb25MaXN0ZW5lciA9IHsgY3VycmVudDogZmFsc2UgfTtcblxuZXhwb3J0IHsgaGFzUmVkdWNlZE1vdGlvbkxpc3RlbmVyLCBwcmVmZXJzUmVkdWNlZE1vdGlvbiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RhdGUubWpzLm1hcFxuIiwiaW1wb3J0IHsgaGFzUmVkdWNlZE1vdGlvbkxpc3RlbmVyLCBwcmVmZXJzUmVkdWNlZE1vdGlvbiB9IGZyb20gJy4vc3RhdGUubWpzJztcblxuY29uc3QgaXNCcm93c2VyID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIjtcbmZ1bmN0aW9uIGluaXRQcmVmZXJzUmVkdWNlZE1vdGlvbigpIHtcbiAgICBoYXNSZWR1Y2VkTW90aW9uTGlzdGVuZXIuY3VycmVudCA9IHRydWU7XG4gICAgaWYgKCFpc0Jyb3dzZXIpXG4gICAgICAgIHJldHVybjtcbiAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEpIHtcbiAgICAgICAgY29uc3QgbW90aW9uTWVkaWFRdWVyeSA9IHdpbmRvdy5tYXRjaE1lZGlhKFwiKHByZWZlcnMtcmVkdWNlZC1tb3Rpb24pXCIpO1xuICAgICAgICBjb25zdCBzZXRSZWR1Y2VkTW90aW9uUHJlZmVyZW5jZXMgPSAoKSA9PiAocHJlZmVyc1JlZHVjZWRNb3Rpb24uY3VycmVudCA9IG1vdGlvbk1lZGlhUXVlcnkubWF0Y2hlcyk7XG4gICAgICAgIG1vdGlvbk1lZGlhUXVlcnkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBzZXRSZWR1Y2VkTW90aW9uUHJlZmVyZW5jZXMpO1xuICAgICAgICBzZXRSZWR1Y2VkTW90aW9uUHJlZmVyZW5jZXMoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHByZWZlcnNSZWR1Y2VkTW90aW9uLmN1cnJlbnQgPSBmYWxzZTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IGhhc1JlZHVjZWRNb3Rpb25MaXN0ZW5lciwgaW5pdFByZWZlcnNSZWR1Y2VkTW90aW9uLCBwcmVmZXJzUmVkdWNlZE1vdGlvbiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXgubWpzLm1hcFxuIiwiaW1wb3J0IHsgd2Fybk9uY2UsIHNlY29uZHNUb01pbGxpc2Vjb25kcywgaXNOdW1lcmljYWxTdHJpbmcsIGlzWmVyb1ZhbHVlU3RyaW5nLCBTdWJzY3JpcHRpb25NYW5hZ2VyIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcbmltcG9ydCB7IEtleWZyYW1lUmVzb2x2ZXIgfSBmcm9tICcuLi9hbmltYXRpb24va2V5ZnJhbWVzL0tleWZyYW1lc1Jlc29sdmVyLm1qcyc7XG5pbXBvcnQgeyBOYXRpdmVBbmltYXRpb24gfSBmcm9tICcuLi9hbmltYXRpb24vTmF0aXZlQW5pbWF0aW9uLm1qcyc7XG5pbXBvcnQgeyBhY2NlbGVyYXRlZFZhbHVlcyB9IGZyb20gJy4uL2FuaW1hdGlvbi93YWFwaS91dGlscy9hY2NlbGVyYXRlZC12YWx1ZXMubWpzJztcbmltcG9ydCB7IG1pY3JvdGFzayB9IGZyb20gJy4uL2ZyYW1lbG9vcC9taWNyb3Rhc2subWpzJztcbmltcG9ydCB7IHRpbWUgfSBmcm9tICcuLi9mcmFtZWxvb3Avc3luYy10aW1lLm1qcyc7XG5pbXBvcnQgeyBjcmVhdGVCb3ggfSBmcm9tICcuLi9wcm9qZWN0aW9uL2dlb21ldHJ5L21vZGVscy5tanMnO1xuaW1wb3J0IHsgbW90aW9uVmFsdWUgfSBmcm9tICcuLi92YWx1ZS9pbmRleC5tanMnO1xuaW1wb3J0IHsgY29tcGxleCB9IGZyb20gJy4uL3ZhbHVlL3R5cGVzL2NvbXBsZXgvaW5kZXgubWpzJztcbmltcG9ydCB7IGdldEFuaW1hdGFibGVOb25lIH0gZnJvbSAnLi4vdmFsdWUvdHlwZXMvdXRpbHMvYW5pbWF0YWJsZS1ub25lLm1qcyc7XG5pbXBvcnQgeyBmaW5kVmFsdWVUeXBlIH0gZnJvbSAnLi4vdmFsdWUvdHlwZXMvdXRpbHMvZmluZC5tanMnO1xuaW1wb3J0IHsgaXNNb3Rpb25WYWx1ZSB9IGZyb20gJy4uL3ZhbHVlL3V0aWxzL2lzLW1vdGlvbi12YWx1ZS5tanMnO1xuaW1wb3J0IHsgdmlzdWFsRWxlbWVudFN0b3JlIH0gZnJvbSAnLi9zdG9yZS5tanMnO1xuaW1wb3J0IHsgaXNDb250cm9sbGluZ1ZhcmlhbnRzLCBpc1ZhcmlhbnROb2RlIH0gZnJvbSAnLi91dGlscy9pcy1jb250cm9sbGluZy12YXJpYW50cy5tanMnO1xuaW1wb3J0IHsgdHJhbnNmb3JtUHJvcHMgfSBmcm9tICcuL3V0aWxzL2tleXMtdHJhbnNmb3JtLm1qcyc7XG5pbXBvcnQgeyB1cGRhdGVNb3Rpb25WYWx1ZXNGcm9tUHJvcHMgfSBmcm9tICcuL3V0aWxzL21vdGlvbi12YWx1ZXMubWpzJztcbmltcG9ydCB7IGluaXRQcmVmZXJzUmVkdWNlZE1vdGlvbiB9IGZyb20gJy4vdXRpbHMvcmVkdWNlZC1tb3Rpb24vaW5kZXgubWpzJztcbmltcG9ydCB7IHJlc29sdmVWYXJpYW50RnJvbVByb3BzIH0gZnJvbSAnLi91dGlscy9yZXNvbHZlLXZhcmlhbnRzLm1qcyc7XG5pbXBvcnQgeyBoYXNSZWR1Y2VkTW90aW9uTGlzdGVuZXIsIHByZWZlcnNSZWR1Y2VkTW90aW9uIH0gZnJvbSAnLi91dGlscy9yZWR1Y2VkLW1vdGlvbi9zdGF0ZS5tanMnO1xuaW1wb3J0IHsgZnJhbWUsIGNhbmNlbEZyYW1lIH0gZnJvbSAnLi4vZnJhbWVsb29wL2ZyYW1lLm1qcyc7XG5cbmNvbnN0IHByb3BFdmVudEhhbmRsZXJzID0gW1xuICAgIFwiQW5pbWF0aW9uU3RhcnRcIixcbiAgICBcIkFuaW1hdGlvbkNvbXBsZXRlXCIsXG4gICAgXCJVcGRhdGVcIixcbiAgICBcIkJlZm9yZUxheW91dE1lYXN1cmVcIixcbiAgICBcIkxheW91dE1lYXN1cmVcIixcbiAgICBcIkxheW91dEFuaW1hdGlvblN0YXJ0XCIsXG4gICAgXCJMYXlvdXRBbmltYXRpb25Db21wbGV0ZVwiLFxuXTtcbi8qKlxuICogU3RhdGljIGZlYXR1cmUgZGVmaW5pdGlvbnMgLSBjYW4gYmUgaW5qZWN0ZWQgYnkgZnJhbWV3b3JrIGxheWVyXG4gKi9cbmxldCBmZWF0dXJlRGVmaW5pdGlvbnMgPSB7fTtcbi8qKlxuICogU2V0IGZlYXR1cmUgZGVmaW5pdGlvbnMgZm9yIGFsbCBWaXN1YWxFbGVtZW50cy5cbiAqIFRoaXMgc2hvdWxkIGJlIGNhbGxlZCBieSB0aGUgZnJhbWV3b3JrIGxheWVyIChlLmcuLCBmcmFtZXItbW90aW9uKSBkdXJpbmcgaW5pdGlhbGl6YXRpb24uXG4gKi9cbmZ1bmN0aW9uIHNldEZlYXR1cmVEZWZpbml0aW9ucyhkZWZpbml0aW9ucykge1xuICAgIGZlYXR1cmVEZWZpbml0aW9ucyA9IGRlZmluaXRpb25zO1xufVxuLyoqXG4gKiBHZXQgdGhlIGN1cnJlbnQgZmVhdHVyZSBkZWZpbml0aW9uc1xuICovXG5mdW5jdGlvbiBnZXRGZWF0dXJlRGVmaW5pdGlvbnMoKSB7XG4gICAgcmV0dXJuIGZlYXR1cmVEZWZpbml0aW9ucztcbn1cbi8qKlxuICogQSBWaXN1YWxFbGVtZW50IGlzIGFuIGltcGVyYXRpdmUgYWJzdHJhY3Rpb24gYXJvdW5kIFVJIGVsZW1lbnRzIHN1Y2ggYXNcbiAqIEhUTUxFbGVtZW50LCBTVkdFbGVtZW50LCBUaHJlZS5PYmplY3QzRCBldGMuXG4gKi9cbmNsYXNzIFZpc3VhbEVsZW1lbnQge1xuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIHRha2VzIFJlYWN0IHByb3BzIGFuZCByZXR1cm5zIGZvdW5kIE1vdGlvblZhbHVlcy4gRm9yIGV4YW1wbGUsIEhUTUxcbiAgICAgKiBNb3Rpb25WYWx1ZXMgd2lsbCBiZSBmb3VuZCB3aXRoaW4gdGhlIHN0eWxlIHByb3AsIHdoZXJlYXMgZm9yIFRocmVlLmpzIHdpdGhpbiBhdHRyaWJ1dGUgYXJyYXlzLlxuICAgICAqXG4gICAgICogVGhpcyBpc24ndCBhbiBhYnN0cmFjdCBtZXRob2QgYXMgaXQgbmVlZHMgY2FsbGluZyBpbiB0aGUgY29uc3RydWN0b3IsIGJ1dCBpdCBpc1xuICAgICAqIGludGVuZGVkIHRvIGJlIG9uZS5cbiAgICAgKi9cbiAgICBzY3JhcGVNb3Rpb25WYWx1ZXNGcm9tUHJvcHMoX3Byb3BzLCBfcHJldlByb3BzLCBfdmlzdWFsRWxlbWVudCkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKHsgcGFyZW50LCBwcm9wcywgcHJlc2VuY2VDb250ZXh0LCByZWR1Y2VkTW90aW9uQ29uZmlnLCBza2lwQW5pbWF0aW9ucywgYmxvY2tJbml0aWFsQW5pbWF0aW9uLCB2aXN1YWxTdGF0ZSwgfSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHJlZmVyZW5jZSB0byB0aGUgY3VycmVudCB1bmRlcmx5aW5nIEluc3RhbmNlLCBlLmcuIGEgSFRNTEVsZW1lbnRcbiAgICAgICAgICogb3IgVGhyZWUuTWVzaCBldGMuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBzZXQgY29udGFpbmluZyByZWZlcmVuY2VzIHRvIHRoaXMgVmlzdWFsRWxlbWVudCdzIGNoaWxkcmVuLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IG5ldyBTZXQoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIERldGVybWluZSB3aGF0IHJvbGUgdGhpcyB2aXN1YWwgZWxlbWVudCBzaG91bGQgdGFrZSBpbiB0aGUgdmFyaWFudCB0cmVlLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5pc1ZhcmlhbnROb2RlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNDb250cm9sbGluZ1ZhcmlhbnRzID0gZmFsc2U7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWNpZGVzIHdoZXRoZXIgdGhpcyBWaXN1YWxFbGVtZW50IHNob3VsZCBhbmltYXRlIGluIHJlZHVjZWQgbW90aW9uXG4gICAgICAgICAqIG1vZGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRPRE86IFRoaXMgaXMgY3VycmVudGx5IHNldCBvbiBldmVyeSBpbmRpdmlkdWFsIFZpc3VhbEVsZW1lbnQgYnV0IGZlZWxzXG4gICAgICAgICAqIGxpa2UgaXQgY291bGQgYmUgc2V0IGdsb2JhbGx5LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zaG91bGRSZWR1Y2VNb3Rpb24gPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogRGVjaWRlcyB3aGV0aGVyIGFuaW1hdGlvbnMgc2hvdWxkIGJlIHNraXBwZWQgZm9yIHRoaXMgVmlzdWFsRWxlbWVudC5cbiAgICAgICAgICogVXNlZnVsIGZvciBFMkUgdGVzdHMgYW5kIHZpc3VhbCByZWdyZXNzaW9uIHRlc3RpbmcuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnNob3VsZFNraXBBbmltYXRpb25zID0gZmFsc2U7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIG1hcCBvZiBhbGwgbW90aW9uIHZhbHVlcyBhdHRhY2hlZCB0byB0aGlzIHZpc3VhbCBlbGVtZW50LiBNb3Rpb25cbiAgICAgICAgICogdmFsdWVzIGFyZSBzb3VyY2Ugb2YgdHJ1dGggZm9yIGFueSBnaXZlbiBhbmltYXRlZCB2YWx1ZS4gQSBtb3Rpb25cbiAgICAgICAgICogdmFsdWUgbWlnaHQgYmUgcHJvdmlkZWQgZXh0ZXJuYWxseSBieSB0aGUgY29tcG9uZW50IHZpYSBwcm9wcy5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudmFsdWVzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLktleWZyYW1lUmVzb2x2ZXIgPSBLZXlmcmFtZVJlc29sdmVyO1xuICAgICAgICAvKipcbiAgICAgICAgICogQ2xlYW51cCBmdW5jdGlvbnMgZm9yIGFjdGl2ZSBmZWF0dXJlcyAoaG92ZXIvdGFwL2V4aXQgZXRjKVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5mZWF0dXJlcyA9IHt9O1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBtYXAgb2YgZXZlcnkgc3Vic2NyaXB0aW9uIHRoYXQgYmluZHMgdGhlIHByb3ZpZGVkIG9yIGdlbmVyYXRlZFxuICAgICAgICAgKiBtb3Rpb24gdmFsdWVzIG9uQ2hhbmdlIGxpc3RlbmVycyB0byB0aGlzIHZpc3VhbCBlbGVtZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy52YWx1ZVN1YnNjcmlwdGlvbnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHJlZmVyZW5jZSB0byB0aGUgcHJldmlvdXNseS1wcm92aWRlZCBtb3Rpb24gdmFsdWVzIGFzIHJldHVybmVkXG4gICAgICAgICAqIGZyb20gc2NyYXBlTW90aW9uVmFsdWVzRnJvbVByb3BzLiBXZSB1c2UgdGhlIGtleXMgaW4gaGVyZSB0byBkZXRlcm1pbmVcbiAgICAgICAgICogaWYgYW55IG1vdGlvbiB2YWx1ZXMgbmVlZCB0byBiZSByZW1vdmVkIGFmdGVyIHByb3BzIGFyZSB1cGRhdGVkLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wcmV2TW90aW9uVmFsdWVzID0ge307XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUcmFjayB3aGV0aGVyIHRoaXMgZWxlbWVudCBoYXMgYmVlbiBtb3VudGVkIGJlZm9yZSwgdG8gZGV0ZWN0XG4gICAgICAgICAqIHJlbW91bnRzIGFmdGVyIFN1c3BlbnNlIHVubW91bnQvcmVtb3VudCBjeWNsZXMuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmhhc0JlZW5Nb3VudGVkID0gZmFsc2U7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbiBvYmplY3QgY29udGFpbmluZyBhIFN1YnNjcmlwdGlvbk1hbmFnZXIgZm9yIGVhY2ggYWN0aXZlIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5ldmVudHMgPSB7fTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIG9iamVjdCBjb250YWluaW5nIGFuIHVuc3Vic2NyaWJlIGZ1bmN0aW9uIGZvciBlYWNoIHByb3AgZXZlbnQgc3Vic2NyaXB0aW9uLlxuICAgICAgICAgKiBGb3IgZXhhbXBsZSwgZXZlcnkgXCJVcGRhdGVcIiBldmVudCBjYW4gaGF2ZSBtdWx0aXBsZSBzdWJzY3JpYmVycyB2aWFcbiAgICAgICAgICogVmlzdWFsRWxlbWVudC5vbigpLCBidXQgb25seSBvbmUgb2YgdGhvc2UgY2FuIGJlIGRlZmluZWQgdmlhIHRoZSBvblVwZGF0ZSBwcm9wLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wcm9wRXZlbnRTdWJzY3JpcHRpb25zID0ge307XG4gICAgICAgIHRoaXMubm90aWZ5VXBkYXRlID0gKCkgPT4gdGhpcy5ub3RpZnkoXCJVcGRhdGVcIiwgdGhpcy5sYXRlc3RWYWx1ZXMpO1xuICAgICAgICB0aGlzLnJlbmRlciA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5jdXJyZW50KVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckJ1aWxkKCk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckluc3RhbmNlKHRoaXMuY3VycmVudCwgdGhpcy5yZW5kZXJTdGF0ZSwgdGhpcy5wcm9wcy5zdHlsZSwgdGhpcy5wcm9qZWN0aW9uKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5yZW5kZXJTY2hlZHVsZWRBdCA9IDAuMDtcbiAgICAgICAgdGhpcy5zY2hlZHVsZVJlbmRlciA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5vdyA9IHRpbWUubm93KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5yZW5kZXJTY2hlZHVsZWRBdCA8IG5vdykge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyU2NoZWR1bGVkQXQgPSBub3c7XG4gICAgICAgICAgICAgICAgZnJhbWUucmVuZGVyKHRoaXMucmVuZGVyLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHsgbGF0ZXN0VmFsdWVzLCByZW5kZXJTdGF0ZSB9ID0gdmlzdWFsU3RhdGU7XG4gICAgICAgIHRoaXMubGF0ZXN0VmFsdWVzID0gbGF0ZXN0VmFsdWVzO1xuICAgICAgICB0aGlzLmJhc2VUYXJnZXQgPSB7IC4uLmxhdGVzdFZhbHVlcyB9O1xuICAgICAgICB0aGlzLmluaXRpYWxWYWx1ZXMgPSBwcm9wcy5pbml0aWFsID8geyAuLi5sYXRlc3RWYWx1ZXMgfSA6IHt9O1xuICAgICAgICB0aGlzLnJlbmRlclN0YXRlID0gcmVuZGVyU3RhdGU7XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICAgIHRoaXMucHJlc2VuY2VDb250ZXh0ID0gcHJlc2VuY2VDb250ZXh0O1xuICAgICAgICB0aGlzLmRlcHRoID0gcGFyZW50ID8gcGFyZW50LmRlcHRoICsgMSA6IDA7XG4gICAgICAgIHRoaXMucmVkdWNlZE1vdGlvbkNvbmZpZyA9IHJlZHVjZWRNb3Rpb25Db25maWc7XG4gICAgICAgIHRoaXMuc2tpcEFuaW1hdGlvbnNDb25maWcgPSBza2lwQW5pbWF0aW9ucztcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5ibG9ja0luaXRpYWxBbmltYXRpb24gPSBCb29sZWFuKGJsb2NrSW5pdGlhbEFuaW1hdGlvbik7XG4gICAgICAgIHRoaXMuaXNDb250cm9sbGluZ1ZhcmlhbnRzID0gaXNDb250cm9sbGluZ1ZhcmlhbnRzKHByb3BzKTtcbiAgICAgICAgdGhpcy5pc1ZhcmlhbnROb2RlID0gaXNWYXJpYW50Tm9kZShwcm9wcyk7XG4gICAgICAgIGlmICh0aGlzLmlzVmFyaWFudE5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMudmFyaWFudENoaWxkcmVuID0gbmV3IFNldCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWFudWFsbHlBbmltYXRlT25Nb3VudCA9IEJvb2xlYW4ocGFyZW50ICYmIHBhcmVudC5jdXJyZW50KTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFueSBtb3Rpb24gdmFsdWVzIHRoYXQgYXJlIHByb3ZpZGVkIHRvIHRoZSBlbGVtZW50IHdoZW4gY3JlYXRlZFxuICAgICAgICAgKiBhcmVuJ3QgeWV0IGJvdW5kIHRvIHRoZSBlbGVtZW50LCBhcyB0aGlzIHdvdWxkIHRlY2huaWNhbGx5IGJlIGltcHVyZS5cbiAgICAgICAgICogSG93ZXZlciwgd2UgaXRlcmF0ZSB0aHJvdWdoIHRoZSBtb3Rpb24gdmFsdWVzIGFuZCBzZXQgdGhlbSB0byB0aGVcbiAgICAgICAgICogaW5pdGlhbCB2YWx1ZXMgZm9yIHRoaXMgY29tcG9uZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBUT0RPOiBUaGlzIGlzIGltcHVyZSBhbmQgd2Ugc2hvdWxkIGxvb2sgYXQgY2hhbmdpbmcgdGhpcyB0byBydW4gb24gbW91bnQuXG4gICAgICAgICAqIERvaW5nIHNvIHdpbGwgYnJlYWsgc29tZSB0ZXN0cyBidXQgdGhpcyBpc24ndCBuZWNlc3NhcmlseSBhIGJyZWFraW5nIGNoYW5nZSxcbiAgICAgICAgICogbW9yZSBhIHJlZmxlY3Rpb24gb2YgdGhlIHRlc3QuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCB7IHdpbGxDaGFuZ2UsIC4uLmluaXRpYWxNb3Rpb25WYWx1ZXMgfSA9IHRoaXMuc2NyYXBlTW90aW9uVmFsdWVzRnJvbVByb3BzKHByb3BzLCB7fSwgdGhpcyk7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGluaXRpYWxNb3Rpb25WYWx1ZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gaW5pdGlhbE1vdGlvblZhbHVlc1trZXldO1xuICAgICAgICAgICAgaWYgKGxhdGVzdFZhbHVlc1trZXldICE9PSB1bmRlZmluZWQgJiYgaXNNb3Rpb25WYWx1ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZS5zZXQobGF0ZXN0VmFsdWVzW2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIG1vdW50KGluc3RhbmNlKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiB0aGlzIGVsZW1lbnQgaGFzIGJlZW4gbW91bnRlZCBiZWZvcmUgKGUuZy4gYWZ0ZXIgYSBTdXNwZW5zZVxuICAgICAgICAgKiB1bm1vdW50L3JlbW91bnQpLCByZXNldCBtb3Rpb24gdmFsdWVzIHRvIHRoZWlyIGluaXRpYWwgc3RhdGVcbiAgICAgICAgICogc28gYW5pbWF0aW9ucyByZXBsYXkgY29ycmVjdGx5IGZyb20gaW5pdGlhbCDihpIgYW5pbWF0ZS5cbiAgICAgICAgICovXG4gICAgICAgIGlmICh0aGlzLmhhc0JlZW5Nb3VudGVkKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLmluaXRpYWxWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlcy5nZXQoa2V5KT8uanVtcCh0aGlzLmluaXRpYWxWYWx1ZXNba2V5XSk7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXRlc3RWYWx1ZXNba2V5XSA9IHRoaXMuaW5pdGlhbFZhbHVlc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3VycmVudCA9IGluc3RhbmNlO1xuICAgICAgICB2aXN1YWxFbGVtZW50U3RvcmUuc2V0KGluc3RhbmNlLCB0aGlzKTtcbiAgICAgICAgaWYgKHRoaXMucHJvamVjdGlvbiAmJiAhdGhpcy5wcm9qZWN0aW9uLmluc3RhbmNlKSB7XG4gICAgICAgICAgICB0aGlzLnByb2plY3Rpb24ubW91bnQoaW5zdGFuY2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcmVudCAmJiB0aGlzLmlzVmFyaWFudE5vZGUgJiYgIXRoaXMuaXNDb250cm9sbGluZ1ZhcmlhbnRzKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUZyb21WYXJpYW50VHJlZSA9IHRoaXMucGFyZW50LmFkZFZhcmlhbnRDaGlsZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZhbHVlcy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB0aGlzLmJpbmRUb01vdGlvblZhbHVlKGtleSwgdmFsdWUpKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIERldGVybWluZSByZWR1Y2VkIG1vdGlvbiBwcmVmZXJlbmNlLiBPbmx5IGluaXRpYWxpemUgdGhlIG1hdGNoTWVkaWFcbiAgICAgICAgICogbGlzdGVuZXIgaWYgd2UgYWN0dWFsbHkgbmVlZCB0aGUgZHluYW1pYyB2YWx1ZSAoaS5lLiwgd2hlbiBjb25maWdcbiAgICAgICAgICogaXMgbmVpdGhlciBcIm5ldmVyXCIgbm9yIFwiYWx3YXlzXCIpLlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHRoaXMucmVkdWNlZE1vdGlvbkNvbmZpZyA9PT0gXCJuZXZlclwiKSB7XG4gICAgICAgICAgICB0aGlzLnNob3VsZFJlZHVjZU1vdGlvbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMucmVkdWNlZE1vdGlvbkNvbmZpZyA9PT0gXCJhbHdheXNcIikge1xuICAgICAgICAgICAgdGhpcy5zaG91bGRSZWR1Y2VNb3Rpb24gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFoYXNSZWR1Y2VkTW90aW9uTGlzdGVuZXIuY3VycmVudCkge1xuICAgICAgICAgICAgICAgIGluaXRQcmVmZXJzUmVkdWNlZE1vdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zaG91bGRSZWR1Y2VNb3Rpb24gPSBwcmVmZXJzUmVkdWNlZE1vdGlvbi5jdXJyZW50O1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgICAgIHdhcm5PbmNlKHRoaXMuc2hvdWxkUmVkdWNlTW90aW9uICE9PSB0cnVlLCBcIllvdSBoYXZlIFJlZHVjZWQgTW90aW9uIGVuYWJsZWQgb24geW91ciBkZXZpY2UuIEFuaW1hdGlvbnMgbWF5IG5vdCBhcHBlYXIgYXMgZXhwZWN0ZWQuXCIsIFwicmVkdWNlZC1tb3Rpb24tZGlzYWJsZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB3aGV0aGVyIGFuaW1hdGlvbnMgc2hvdWxkIGJlIHNraXBwZWQgYmFzZWQgb24gdGhlIGNvbmZpZy5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc2hvdWxkU2tpcEFuaW1hdGlvbnMgPSB0aGlzLnNraXBBbmltYXRpb25zQ29uZmlnID8/IGZhbHNlO1xuICAgICAgICB0aGlzLnBhcmVudD8uYWRkQ2hpbGQodGhpcyk7XG4gICAgICAgIHRoaXMudXBkYXRlKHRoaXMucHJvcHMsIHRoaXMucHJlc2VuY2VDb250ZXh0KTtcbiAgICAgICAgdGhpcy5oYXNCZWVuTW91bnRlZCA9IHRydWU7XG4gICAgfVxuICAgIHVubW91bnQoKSB7XG4gICAgICAgIHRoaXMucHJvamVjdGlvbiAmJiB0aGlzLnByb2plY3Rpb24udW5tb3VudCgpO1xuICAgICAgICBjYW5jZWxGcmFtZSh0aGlzLm5vdGlmeVVwZGF0ZSk7XG4gICAgICAgIGNhbmNlbEZyYW1lKHRoaXMucmVuZGVyKTtcbiAgICAgICAgdGhpcy52YWx1ZVN1YnNjcmlwdGlvbnMuZm9yRWFjaCgocmVtb3ZlKSA9PiByZW1vdmUoKSk7XG4gICAgICAgIHRoaXMudmFsdWVTdWJzY3JpcHRpb25zLmNsZWFyKCk7XG4gICAgICAgIHRoaXMucmVtb3ZlRnJvbVZhcmlhbnRUcmVlICYmIHRoaXMucmVtb3ZlRnJvbVZhcmlhbnRUcmVlKCk7XG4gICAgICAgIHRoaXMucGFyZW50Py5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5ldmVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW2tleV0uY2xlYXIoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLmZlYXR1cmVzKSB7XG4gICAgICAgICAgICBjb25zdCBmZWF0dXJlID0gdGhpcy5mZWF0dXJlc1trZXldO1xuICAgICAgICAgICAgaWYgKGZlYXR1cmUpIHtcbiAgICAgICAgICAgICAgICBmZWF0dXJlLnVubW91bnQoKTtcbiAgICAgICAgICAgICAgICBmZWF0dXJlLmlzTW91bnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3VycmVudCA9IG51bGw7XG4gICAgfVxuICAgIGFkZENoaWxkKGNoaWxkKSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uYWRkKGNoaWxkKTtcbiAgICAgICAgdGhpcy5lbnRlcmluZ0NoaWxkcmVuID8/ICh0aGlzLmVudGVyaW5nQ2hpbGRyZW4gPSBuZXcgU2V0KCkpO1xuICAgICAgICB0aGlzLmVudGVyaW5nQ2hpbGRyZW4uYWRkKGNoaWxkKTtcbiAgICB9XG4gICAgcmVtb3ZlQ2hpbGQoY2hpbGQpIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5kZWxldGUoY2hpbGQpO1xuICAgICAgICB0aGlzLmVudGVyaW5nQ2hpbGRyZW4gJiYgdGhpcy5lbnRlcmluZ0NoaWxkcmVuLmRlbGV0ZShjaGlsZCk7XG4gICAgfVxuICAgIGJpbmRUb01vdGlvblZhbHVlKGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMudmFsdWVTdWJzY3JpcHRpb25zLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlU3Vic2NyaXB0aW9ucy5nZXQoa2V5KSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZS5hY2NlbGVyYXRlICYmXG4gICAgICAgICAgICBhY2NlbGVyYXRlZFZhbHVlcy5oYXMoa2V5KSAmJlxuICAgICAgICAgICAgdGhpcy5jdXJyZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgZmFjdG9yeSwga2V5ZnJhbWVzLCB0aW1lcywgZWFzZSwgZHVyYXRpb24gfSA9IHZhbHVlLmFjY2VsZXJhdGU7XG4gICAgICAgICAgICBjb25zdCBhbmltYXRpb24gPSBuZXcgTmF0aXZlQW5pbWF0aW9uKHtcbiAgICAgICAgICAgICAgICBlbGVtZW50OiB0aGlzLmN1cnJlbnQsXG4gICAgICAgICAgICAgICAgbmFtZToga2V5LFxuICAgICAgICAgICAgICAgIGtleWZyYW1lcyxcbiAgICAgICAgICAgICAgICB0aW1lcyxcbiAgICAgICAgICAgICAgICBlYXNlLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBzZWNvbmRzVG9NaWxsaXNlY29uZHMoZHVyYXRpb24pLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBjbGVhbnVwID0gZmFjdG9yeShhbmltYXRpb24pO1xuICAgICAgICAgICAgdGhpcy52YWx1ZVN1YnNjcmlwdGlvbnMuc2V0KGtleSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgICAgICBhbmltYXRpb24uY2FuY2VsKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB2YWx1ZUlzVHJhbnNmb3JtID0gdHJhbnNmb3JtUHJvcHMuaGFzKGtleSk7XG4gICAgICAgIGlmICh2YWx1ZUlzVHJhbnNmb3JtICYmIHRoaXMub25CaW5kVHJhbnNmb3JtKSB7XG4gICAgICAgICAgICB0aGlzLm9uQmluZFRyYW5zZm9ybSgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlbW92ZU9uQ2hhbmdlID0gdmFsdWUub24oXCJjaGFuZ2VcIiwgKGxhdGVzdFZhbHVlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxhdGVzdFZhbHVlc1trZXldID0gbGF0ZXN0VmFsdWU7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uVXBkYXRlICYmIGZyYW1lLnByZVJlbmRlcih0aGlzLm5vdGlmeVVwZGF0ZSk7XG4gICAgICAgICAgICBpZiAodmFsdWVJc1RyYW5zZm9ybSAmJiB0aGlzLnByb2plY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3Rpb24uaXNUcmFuc2Zvcm1EaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlUmVuZGVyKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgcmVtb3ZlU3luY0NoZWNrO1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICAgICAgd2luZG93Lk1vdGlvbkNoZWNrQXBwZWFyU3luYykge1xuICAgICAgICAgICAgcmVtb3ZlU3luY0NoZWNrID0gd2luZG93Lk1vdGlvbkNoZWNrQXBwZWFyU3luYyh0aGlzLCBrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZhbHVlU3Vic2NyaXB0aW9ucy5zZXQoa2V5LCAoKSA9PiB7XG4gICAgICAgICAgICByZW1vdmVPbkNoYW5nZSgpO1xuICAgICAgICAgICAgaWYgKHJlbW92ZVN5bmNDaGVjaylcbiAgICAgICAgICAgICAgICByZW1vdmVTeW5jQ2hlY2soKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5vd25lcilcbiAgICAgICAgICAgICAgICB2YWx1ZS5zdG9wKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzb3J0Tm9kZVBvc2l0aW9uKG90aGVyKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiB0aGVzZSBub2RlcyBhcmVuJ3QgZXZlbiBvZiB0aGUgc2FtZSB0eXBlIHdlIGNhbid0IGNvbXBhcmUgdGhlaXIgZGVwdGguXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoIXRoaXMuY3VycmVudCB8fFxuICAgICAgICAgICAgIXRoaXMuc29ydEluc3RhbmNlTm9kZVBvc2l0aW9uIHx8XG4gICAgICAgICAgICB0aGlzLnR5cGUgIT09IG90aGVyLnR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNvcnRJbnN0YW5jZU5vZGVQb3NpdGlvbih0aGlzLmN1cnJlbnQsIG90aGVyLmN1cnJlbnQpO1xuICAgIH1cbiAgICB1cGRhdGVGZWF0dXJlcygpIHtcbiAgICAgICAgbGV0IGtleSA9IFwiYW5pbWF0aW9uXCI7XG4gICAgICAgIGZvciAoa2V5IGluIGZlYXR1cmVEZWZpbml0aW9ucykge1xuICAgICAgICAgICAgY29uc3QgZmVhdHVyZURlZmluaXRpb24gPSBmZWF0dXJlRGVmaW5pdGlvbnNba2V5XTtcbiAgICAgICAgICAgIGlmICghZmVhdHVyZURlZmluaXRpb24pXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBjb25zdCB7IGlzRW5hYmxlZCwgRmVhdHVyZTogRmVhdHVyZUNvbnN0cnVjdG9yIH0gPSBmZWF0dXJlRGVmaW5pdGlvbjtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgdGhpcyBmZWF0dXJlIGlzIGVuYWJsZWQgYnV0IG5vdCBhY3RpdmUsIG1ha2UgYSBuZXcgaW5zdGFuY2UuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICghdGhpcy5mZWF0dXJlc1trZXldICYmXG4gICAgICAgICAgICAgICAgRmVhdHVyZUNvbnN0cnVjdG9yICYmXG4gICAgICAgICAgICAgICAgaXNFbmFibGVkKHRoaXMucHJvcHMpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWF0dXJlc1trZXldID0gbmV3IEZlYXR1cmVDb25zdHJ1Y3Rvcih0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgd2UgaGF2ZSBhIGZlYXR1cmUsIG1vdW50IG9yIHVwZGF0ZSBpdC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHRoaXMuZmVhdHVyZXNba2V5XSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZlYXR1cmUgPSB0aGlzLmZlYXR1cmVzW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKGZlYXR1cmUuaXNNb3VudGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZlYXR1cmUudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmZWF0dXJlLm1vdW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGZlYXR1cmUuaXNNb3VudGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdHJpZ2dlckJ1aWxkKCkge1xuICAgICAgICB0aGlzLmJ1aWxkKHRoaXMucmVuZGVyU3RhdGUsIHRoaXMubGF0ZXN0VmFsdWVzLCB0aGlzLnByb3BzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWVhc3VyZSB0aGUgY3VycmVudCB2aWV3cG9ydCBib3ggd2l0aCBvciB3aXRob3V0IHRyYW5zZm9ybXMuXG4gICAgICogT25seSBtZWFzdXJlcyBheGlzLWFsaWduZWQgYm94ZXMsIHJvdGF0ZSBhbmQgc2tldyBtdXN0IGJlIG1hbnVhbGx5XG4gICAgICogcmVtb3ZlZCB3aXRoIGEgcmUtcmVuZGVyIHRvIHdvcmsuXG4gICAgICovXG4gICAgbWVhc3VyZVZpZXdwb3J0Qm94KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50XG4gICAgICAgICAgICA/IHRoaXMubWVhc3VyZUluc3RhbmNlVmlld3BvcnRCb3godGhpcy5jdXJyZW50LCB0aGlzLnByb3BzKVxuICAgICAgICAgICAgOiBjcmVhdGVCb3goKTtcbiAgICB9XG4gICAgZ2V0U3RhdGljVmFsdWUoa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxhdGVzdFZhbHVlc1trZXldO1xuICAgIH1cbiAgICBzZXRTdGF0aWNWYWx1ZShrZXksIHZhbHVlKSB7XG4gICAgICAgIHRoaXMubGF0ZXN0VmFsdWVzW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVXBkYXRlIHRoZSBwcm92aWRlZCBwcm9wcy4gRW5zdXJlIGFueSBuZXdseS1hZGRlZCBtb3Rpb24gdmFsdWVzIGFyZVxuICAgICAqIGFkZGVkIHRvIG91ciBtYXAsIG9sZCBvbmVzIHJlbW92ZWQsIGFuZCBsaXN0ZW5lcnMgdXBkYXRlZC5cbiAgICAgKi9cbiAgICB1cGRhdGUocHJvcHMsIHByZXNlbmNlQ29udGV4dCkge1xuICAgICAgICBpZiAocHJvcHMudHJhbnNmb3JtVGVtcGxhdGUgfHwgdGhpcy5wcm9wcy50cmFuc2Zvcm1UZW1wbGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZVJlbmRlcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJldlByb3BzID0gdGhpcy5wcm9wcztcbiAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICB0aGlzLnByZXZQcmVzZW5jZUNvbnRleHQgPSB0aGlzLnByZXNlbmNlQ29udGV4dDtcbiAgICAgICAgdGhpcy5wcmVzZW5jZUNvbnRleHQgPSBwcmVzZW5jZUNvbnRleHQ7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGUgcHJvcCBldmVudCBoYW5kbGVycyBpZSBvbkFuaW1hdGlvblN0YXJ0LCBvbkFuaW1hdGlvbkNvbXBsZXRlXG4gICAgICAgICAqL1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BFdmVudEhhbmRsZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSBwcm9wRXZlbnRIYW5kbGVyc1tpXTtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb3BFdmVudFN1YnNjcmlwdGlvbnNba2V5XSkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcEV2ZW50U3Vic2NyaXB0aW9uc1trZXldKCk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMucHJvcEV2ZW50U3Vic2NyaXB0aW9uc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbGlzdGVuZXJOYW1lID0gKFwib25cIiArIGtleSk7XG4gICAgICAgICAgICBjb25zdCBsaXN0ZW5lciA9IHByb3BzW2xpc3RlbmVyTmFtZV07XG4gICAgICAgICAgICBpZiAobGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BFdmVudFN1YnNjcmlwdGlvbnNba2V5XSA9IHRoaXMub24oa2V5LCBsaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcmV2TW90aW9uVmFsdWVzID0gdXBkYXRlTW90aW9uVmFsdWVzRnJvbVByb3BzKHRoaXMsIHRoaXMuc2NyYXBlTW90aW9uVmFsdWVzRnJvbVByb3BzKHByb3BzLCB0aGlzLnByZXZQcm9wcyB8fCB7fSwgdGhpcyksIHRoaXMucHJldk1vdGlvblZhbHVlcyk7XG4gICAgICAgIGlmICh0aGlzLmhhbmRsZUNoaWxkTW90aW9uVmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2hpbGRNb3Rpb25WYWx1ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldFByb3BzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgdmFyaWFudCBkZWZpbml0aW9uIHdpdGggYSBnaXZlbiBuYW1lLlxuICAgICAqL1xuICAgIGdldFZhcmlhbnQobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy52YXJpYW50cyA/IHRoaXMucHJvcHMudmFyaWFudHNbbmFtZV0gOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGRlZmluZWQgZGVmYXVsdCB0cmFuc2l0aW9uIG9uIHRoaXMgY29tcG9uZW50LlxuICAgICAqL1xuICAgIGdldERlZmF1bHRUcmFuc2l0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy50cmFuc2l0aW9uO1xuICAgIH1cbiAgICBnZXRUcmFuc2Zvcm1QYWdlUG9pbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLnRyYW5zZm9ybVBhZ2VQb2ludDtcbiAgICB9XG4gICAgZ2V0Q2xvc2VzdFZhcmlhbnROb2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZhcmlhbnROb2RlXG4gICAgICAgICAgICA/IHRoaXNcbiAgICAgICAgICAgIDogdGhpcy5wYXJlbnRcbiAgICAgICAgICAgICAgICA/IHRoaXMucGFyZW50LmdldENsb3Nlc3RWYXJpYW50Tm9kZSgpXG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZCBhIGNoaWxkIHZpc3VhbCBlbGVtZW50IHRvIG91ciBzZXQgb2YgY2hpbGRyZW4uXG4gICAgICovXG4gICAgYWRkVmFyaWFudENoaWxkKGNoaWxkKSB7XG4gICAgICAgIGNvbnN0IGNsb3Nlc3RWYXJpYW50Tm9kZSA9IHRoaXMuZ2V0Q2xvc2VzdFZhcmlhbnROb2RlKCk7XG4gICAgICAgIGlmIChjbG9zZXN0VmFyaWFudE5vZGUpIHtcbiAgICAgICAgICAgIGNsb3Nlc3RWYXJpYW50Tm9kZS52YXJpYW50Q2hpbGRyZW4gJiZcbiAgICAgICAgICAgICAgICBjbG9zZXN0VmFyaWFudE5vZGUudmFyaWFudENoaWxkcmVuLmFkZChjaGlsZCk7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4gY2xvc2VzdFZhcmlhbnROb2RlLnZhcmlhbnRDaGlsZHJlbi5kZWxldGUoY2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZCBhIG1vdGlvbiB2YWx1ZSBhbmQgYmluZCBpdCB0byB0aGlzIHZpc3VhbCBlbGVtZW50LlxuICAgICAqL1xuICAgIGFkZFZhbHVlKGtleSwgdmFsdWUpIHtcbiAgICAgICAgLy8gUmVtb3ZlIGV4aXN0aW5nIHZhbHVlIGlmIGl0IGV4aXN0c1xuICAgICAgICBjb25zdCBleGlzdGluZ1ZhbHVlID0gdGhpcy52YWx1ZXMuZ2V0KGtleSk7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gZXhpc3RpbmdWYWx1ZSkge1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nVmFsdWUpXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVWYWx1ZShrZXkpO1xuICAgICAgICAgICAgdGhpcy5iaW5kVG9Nb3Rpb25WYWx1ZShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMudmFsdWVzLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMubGF0ZXN0VmFsdWVzW2tleV0gPSB2YWx1ZS5nZXQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBtb3Rpb24gdmFsdWUgYW5kIHVuYmluZCBhbnkgYWN0aXZlIHN1YnNjcmlwdGlvbnMuXG4gICAgICovXG4gICAgcmVtb3ZlVmFsdWUoa2V5KSB7XG4gICAgICAgIHRoaXMudmFsdWVzLmRlbGV0ZShrZXkpO1xuICAgICAgICBjb25zdCB1bnN1YnNjcmliZSA9IHRoaXMudmFsdWVTdWJzY3JpcHRpb25zLmdldChrZXkpO1xuICAgICAgICBpZiAodW5zdWJzY3JpYmUpIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB0aGlzLnZhbHVlU3Vic2NyaXB0aW9ucy5kZWxldGUoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5sYXRlc3RWYWx1ZXNba2V5XTtcbiAgICAgICAgdGhpcy5yZW1vdmVWYWx1ZUZyb21SZW5kZXJTdGF0ZShrZXksIHRoaXMucmVuZGVyU3RhdGUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVjayB3aGV0aGVyIHdlIGhhdmUgYSBtb3Rpb24gdmFsdWUgZm9yIHRoaXMga2V5XG4gICAgICovXG4gICAgaGFzVmFsdWUoa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlcy5oYXMoa2V5KTtcbiAgICB9XG4gICAgZ2V0VmFsdWUoa2V5LCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMudmFsdWVzICYmIHRoaXMucHJvcHMudmFsdWVzW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLnZhbHVlc1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMudmFsdWVzLmdldChrZXkpO1xuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiBkZWZhdWx0VmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFsdWUgPSBtb3Rpb25WYWx1ZShkZWZhdWx0VmFsdWUgPT09IG51bGwgPyB1bmRlZmluZWQgOiBkZWZhdWx0VmFsdWUsIHsgb3duZXI6IHRoaXMgfSk7XG4gICAgICAgICAgICB0aGlzLmFkZFZhbHVlKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSWYgd2UncmUgdHJ5aW5nIHRvIGFuaW1hdGUgdG8gYSBwcmV2aW91c2x5IHVuZW5jb3VudGVyZWQgdmFsdWUsXG4gICAgICogd2UgbmVlZCB0byBjaGVjayBmb3IgaXQgaW4gb3VyIHN0YXRlIGFuZCBhcyBhIGxhc3QgcmVzb3J0IHJlYWQgaXRcbiAgICAgKiBkaXJlY3RseSBmcm9tIHRoZSBpbnN0YW5jZSAod2hpY2ggbWlnaHQgaGF2ZSBwZXJmb3JtYW5jZSBpbXBsaWNhdGlvbnMpLlxuICAgICAqL1xuICAgIHJlYWRWYWx1ZShrZXksIHRhcmdldCkge1xuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLmxhdGVzdFZhbHVlc1trZXldICE9PSB1bmRlZmluZWQgfHwgIXRoaXMuY3VycmVudFxuICAgICAgICAgICAgPyB0aGlzLmxhdGVzdFZhbHVlc1trZXldXG4gICAgICAgICAgICA6IHRoaXMuZ2V0QmFzZVRhcmdldEZyb21Qcm9wcyh0aGlzLnByb3BzLCBrZXkpID8/XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkVmFsdWVGcm9tSW5zdGFuY2UodGhpcy5jdXJyZW50LCBrZXksIHRoaXMub3B0aW9ucyk7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgICAgKGlzTnVtZXJpY2FsU3RyaW5nKHZhbHVlKSB8fCBpc1plcm9WYWx1ZVN0cmluZyh2YWx1ZSkpKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhIG51bWJlciByZWFkIGFzIGEgc3RyaW5nLCBpZSBcIjBcIiBvciBcIjIwMFwiLCBjb252ZXJ0IGl0IHRvIGEgbnVtYmVyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCFmaW5kVmFsdWVUeXBlKHZhbHVlKSAmJiBjb21wbGV4LnRlc3QodGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZ2V0QW5pbWF0YWJsZU5vbmUoa2V5LCB0YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zZXRCYXNlVGFyZ2V0KGtleSwgaXNNb3Rpb25WYWx1ZSh2YWx1ZSkgPyB2YWx1ZS5nZXQoKSA6IHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNNb3Rpb25WYWx1ZSh2YWx1ZSkgPyB2YWx1ZS5nZXQoKSA6IHZhbHVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIGJhc2UgdGFyZ2V0IHRvIGxhdGVyIGFuaW1hdGUgYmFjayB0by4gVGhpcyBpcyBjdXJyZW50bHlcbiAgICAgKiBvbmx5IGh5ZHJhdGVkIG9uIGNyZWF0aW9uIGFuZCB3aGVuIHdlIGZpcnN0IHJlYWQgYSB2YWx1ZS5cbiAgICAgKi9cbiAgICBzZXRCYXNlVGFyZ2V0KGtleSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5iYXNlVGFyZ2V0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRmluZCB0aGUgYmFzZSB0YXJnZXQgZm9yIGEgdmFsdWUgdGhhdHMgYmVlbiByZW1vdmVkIGZyb20gYWxsIGFuaW1hdGlvblxuICAgICAqIHByb3BzLlxuICAgICAqL1xuICAgIGdldEJhc2VUYXJnZXQoa2V5KSB7XG4gICAgICAgIGNvbnN0IHsgaW5pdGlhbCB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgbGV0IHZhbHVlRnJvbUluaXRpYWw7XG4gICAgICAgIGlmICh0eXBlb2YgaW5pdGlhbCA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgaW5pdGlhbCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgY29uc3QgdmFyaWFudCA9IHJlc29sdmVWYXJpYW50RnJvbVByb3BzKHRoaXMucHJvcHMsIGluaXRpYWwsIHRoaXMucHJlc2VuY2VDb250ZXh0Py5jdXN0b20pO1xuICAgICAgICAgICAgaWYgKHZhcmlhbnQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZUZyb21Jbml0aWFsID0gdmFyaWFudFtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiB0aGlzIHZhbHVlIHN0aWxsIGV4aXN0cyBpbiB0aGUgY3VycmVudCBpbml0aWFsIHZhcmlhbnQsIHJlYWQgdGhhdC5cbiAgICAgICAgICovXG4gICAgICAgIGlmIChpbml0aWFsICYmIHZhbHVlRnJvbUluaXRpYWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlRnJvbUluaXRpYWw7XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFsdGVybmF0aXZlbHksIGlmIHRoaXMgVmlzdWFsRWxlbWVudCBjb25maWcgaGFzIGRlZmluZWQgYSBnZXRCYXNlVGFyZ2V0XG4gICAgICAgICAqIHNvIHdlIGNhbiByZWFkIHRoZSB2YWx1ZSBmcm9tIGFuIGFsdGVybmF0aXZlIHNvdXJjZSwgdHJ5IHRoYXQuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmdldEJhc2VUYXJnZXRGcm9tUHJvcHModGhpcy5wcm9wcywga2V5KTtcbiAgICAgICAgaWYgKHRhcmdldCAhPT0gdW5kZWZpbmVkICYmICFpc01vdGlvblZhbHVlKHRhcmdldCkpXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhlIHZhbHVlIHdhcyBpbml0aWFsbHkgZGVmaW5lZCBvbiBpbml0aWFsLCBidXQgaXQgZG9lc24ndCBhbnkgbW9yZSxcbiAgICAgICAgICogcmV0dXJuIHVuZGVmaW5lZC4gT3RoZXJ3aXNlIHJldHVybiB0aGUgdmFsdWUgYXMgaW5pdGlhbGx5IHJlYWQgZnJvbSB0aGUgRE9NLlxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIHRoaXMuaW5pdGlhbFZhbHVlc1trZXldICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHZhbHVlRnJvbUluaXRpYWwgPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgICAgIDogdGhpcy5iYXNlVGFyZ2V0W2tleV07XG4gICAgfVxuICAgIG9uKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKCF0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gbmV3IFN1YnNjcmlwdGlvbk1hbmFnZXIoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5ldmVudHNbZXZlbnROYW1lXS5hZGQoY2FsbGJhY2spO1xuICAgIH1cbiAgICBub3RpZnkoZXZlbnROYW1lLCAuLi5hcmdzKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLm5vdGlmeSguLi5hcmdzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzY2hlZHVsZVJlbmRlck1pY3JvdGFzaygpIHtcbiAgICAgICAgbWljcm90YXNrLnJlbmRlcih0aGlzLnJlbmRlcik7XG4gICAgfVxufVxuXG5leHBvcnQgeyBWaXN1YWxFbGVtZW50LCBnZXRGZWF0dXJlRGVmaW5pdGlvbnMsIHNldEZlYXR1cmVEZWZpbml0aW9ucyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VmlzdWFsRWxlbWVudC5tanMubWFwXG4iLCJpbXBvcnQgeyBpc01vdGlvblZhbHVlIH0gZnJvbSAnLi4vLi4vdmFsdWUvdXRpbHMvaXMtbW90aW9uLXZhbHVlLm1qcyc7XG5pbXBvcnQgeyBET01LZXlmcmFtZXNSZXNvbHZlciB9IGZyb20gJy4uLy4uL2FuaW1hdGlvbi9rZXlmcmFtZXMvRE9NS2V5ZnJhbWVzUmVzb2x2ZXIubWpzJztcbmltcG9ydCB7IFZpc3VhbEVsZW1lbnQgfSBmcm9tICcuLi9WaXN1YWxFbGVtZW50Lm1qcyc7XG5cbmNsYXNzIERPTVZpc3VhbEVsZW1lbnQgZXh0ZW5kcyBWaXN1YWxFbGVtZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5LZXlmcmFtZVJlc29sdmVyID0gRE9NS2V5ZnJhbWVzUmVzb2x2ZXI7XG4gICAgfVxuICAgIHNvcnRJbnN0YW5jZU5vZGVQb3NpdGlvbihhLCBiKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBjb21wYXJlRG9jdW1lbnRQb3NpdGlvbiByZXR1cm5zIGEgYml0bWFzaywgYnkgdXNpbmcgdGhlIGJpdHdpc2UgJlxuICAgICAgICAgKiB3ZSdyZSByZXR1cm5pbmcgdHJ1ZSBpZiAyIGluIHRoYXQgYml0bWFzayBpcyBzZXQgdG8gdHJ1ZS4gMiBpcyBzZXRcbiAgICAgICAgICogdG8gdHJ1ZSBpZiBiIHByZWNlZWRzIGEuXG4gICAgICAgICAqL1xuICAgICAgICByZXR1cm4gYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihiKSAmIDIgPyAxIDogLTE7XG4gICAgfVxuICAgIGdldEJhc2VUYXJnZXRGcm9tUHJvcHMocHJvcHMsIGtleSkge1xuICAgICAgICBjb25zdCBzdHlsZSA9IHByb3BzLnN0eWxlO1xuICAgICAgICByZXR1cm4gc3R5bGUgPyBzdHlsZVtrZXldIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZW1vdmVWYWx1ZUZyb21SZW5kZXJTdGF0ZShrZXksIHsgdmFycywgc3R5bGUgfSkge1xuICAgICAgICBkZWxldGUgdmFyc1trZXldO1xuICAgICAgICBkZWxldGUgc3R5bGVba2V5XTtcbiAgICB9XG4gICAgaGFuZGxlQ2hpbGRNb3Rpb25WYWx1ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRTdWJzY3JpcHRpb24oKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNoaWxkU3Vic2NyaXB0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGlmIChpc01vdGlvblZhbHVlKGNoaWxkcmVuKSkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZFN1YnNjcmlwdGlvbiA9IGNoaWxkcmVuLm9uKFwiY2hhbmdlXCIsIChsYXRlc3QpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudC50ZXh0Q29udGVudCA9IGAke2xhdGVzdH1gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgeyBET01WaXN1YWxFbGVtZW50IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ET01WaXN1YWxFbGVtZW50Lm1qcy5tYXBcbiIsIi8qKlxuICogQm91bmRpbmcgYm94ZXMgdGVuZCB0byBiZSBkZWZpbmVkIGFzIHRvcCwgbGVmdCwgcmlnaHQsIGJvdHRvbS4gRm9yIHZhcmlvdXMgb3BlcmF0aW9uc1xuICogaXQncyBlYXNpZXIgdG8gY29uc2lkZXIgZWFjaCBheGlzIGluZGl2aWR1YWxseS4gVGhpcyBmdW5jdGlvbiByZXR1cm5zIGEgYm91bmRpbmcgYm94XG4gKiBhcyBhIG1hcCBvZiBzaW5nbGUtYXhpcyBtaW4vbWF4IHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gY29udmVydEJvdW5kaW5nQm94VG9Cb3goeyB0b3AsIGxlZnQsIHJpZ2h0LCBib3R0b20sIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB4OiB7IG1pbjogbGVmdCwgbWF4OiByaWdodCB9LFxuICAgICAgICB5OiB7IG1pbjogdG9wLCBtYXg6IGJvdHRvbSB9LFxuICAgIH07XG59XG5mdW5jdGlvbiBjb252ZXJ0Qm94VG9Cb3VuZGluZ0JveCh7IHgsIHkgfSkge1xuICAgIHJldHVybiB7IHRvcDogeS5taW4sIHJpZ2h0OiB4Lm1heCwgYm90dG9tOiB5Lm1heCwgbGVmdDogeC5taW4gfTtcbn1cbi8qKlxuICogQXBwbGllcyBhIFRyYW5zZm9ybVBvaW50IGZ1bmN0aW9uIHRvIGEgYm91bmRpbmcgYm94LiBUcmFuc2Zvcm1Qb2ludCBpcyB1c3VhbGx5IGEgZnVuY3Rpb25cbiAqIHByb3ZpZGVkIGJ5IEZyYW1lciB0byBhbGxvdyBtZWFzdXJlZCBwb2ludHMgdG8gYmUgY29ycmVjdGVkIGZvciBkZXZpY2Ugc2NhbGluZy4gVGhpcyBpcyB1c2VkXG4gKiB3aGVuIG1lYXN1cmluZyBET00gZWxlbWVudHMgYW5kIERPTSBldmVudCBwb2ludHMuXG4gKi9cbmZ1bmN0aW9uIHRyYW5zZm9ybUJveFBvaW50cyhwb2ludCwgdHJhbnNmb3JtUG9pbnQpIHtcbiAgICBpZiAoIXRyYW5zZm9ybVBvaW50KVxuICAgICAgICByZXR1cm4gcG9pbnQ7XG4gICAgY29uc3QgdG9wTGVmdCA9IHRyYW5zZm9ybVBvaW50KHsgeDogcG9pbnQubGVmdCwgeTogcG9pbnQudG9wIH0pO1xuICAgIGNvbnN0IGJvdHRvbVJpZ2h0ID0gdHJhbnNmb3JtUG9pbnQoeyB4OiBwb2ludC5yaWdodCwgeTogcG9pbnQuYm90dG9tIH0pO1xuICAgIHJldHVybiB7XG4gICAgICAgIHRvcDogdG9wTGVmdC55LFxuICAgICAgICBsZWZ0OiB0b3BMZWZ0LngsXG4gICAgICAgIGJvdHRvbTogYm90dG9tUmlnaHQueSxcbiAgICAgICAgcmlnaHQ6IGJvdHRvbVJpZ2h0LngsXG4gICAgfTtcbn1cblxuZXhwb3J0IHsgY29udmVydEJvdW5kaW5nQm94VG9Cb3gsIGNvbnZlcnRCb3hUb0JvdW5kaW5nQm94LCB0cmFuc2Zvcm1Cb3hQb2ludHMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbnZlcnNpb24ubWpzLm1hcFxuIiwiaW1wb3J0IHsgY29udmVydEJvdW5kaW5nQm94VG9Cb3gsIHRyYW5zZm9ybUJveFBvaW50cyB9IGZyb20gJy4uL2dlb21ldHJ5L2NvbnZlcnNpb24ubWpzJztcbmltcG9ydCB7IHRyYW5zbGF0ZUF4aXMgfSBmcm9tICcuLi9nZW9tZXRyeS9kZWx0YS1hcHBseS5tanMnO1xuXG5mdW5jdGlvbiBtZWFzdXJlVmlld3BvcnRCb3goaW5zdGFuY2UsIHRyYW5zZm9ybVBvaW50KSB7XG4gICAgcmV0dXJuIGNvbnZlcnRCb3VuZGluZ0JveFRvQm94KHRyYW5zZm9ybUJveFBvaW50cyhpbnN0YW5jZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgdHJhbnNmb3JtUG9pbnQpKTtcbn1cbmZ1bmN0aW9uIG1lYXN1cmVQYWdlQm94KGVsZW1lbnQsIHJvb3RQcm9qZWN0aW9uTm9kZSwgdHJhbnNmb3JtUGFnZVBvaW50KSB7XG4gICAgY29uc3Qgdmlld3BvcnRCb3ggPSBtZWFzdXJlVmlld3BvcnRCb3goZWxlbWVudCwgdHJhbnNmb3JtUGFnZVBvaW50KTtcbiAgICBjb25zdCB7IHNjcm9sbCB9ID0gcm9vdFByb2plY3Rpb25Ob2RlO1xuICAgIGlmIChzY3JvbGwpIHtcbiAgICAgICAgdHJhbnNsYXRlQXhpcyh2aWV3cG9ydEJveC54LCBzY3JvbGwub2Zmc2V0LngpO1xuICAgICAgICB0cmFuc2xhdGVBeGlzKHZpZXdwb3J0Qm94LnksIHNjcm9sbC5vZmZzZXQueSk7XG4gICAgfVxuICAgIHJldHVybiB2aWV3cG9ydEJveDtcbn1cblxuZXhwb3J0IHsgbWVhc3VyZVBhZ2VCb3gsIG1lYXN1cmVWaWV3cG9ydEJveCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWVhc3VyZS5tanMubWFwXG4iLCJpbXBvcnQgeyBnZXRWYWx1ZUFzVHlwZSB9IGZyb20gJy4uLy4uLy4uL3ZhbHVlL3R5cGVzL3V0aWxzL2dldC1hcy10eXBlLm1qcyc7XG5pbXBvcnQgeyBudW1iZXJWYWx1ZVR5cGVzIH0gZnJvbSAnLi4vLi4vLi4vdmFsdWUvdHlwZXMvbWFwcy9udW1iZXIubWpzJztcbmltcG9ydCB7IHRyYW5zZm9ybVByb3BPcmRlciB9IGZyb20gJy4uLy4uL3V0aWxzL2tleXMtdHJhbnNmb3JtLm1qcyc7XG5cbmNvbnN0IHRyYW5zbGF0ZUFsaWFzID0ge1xuICAgIHg6IFwidHJhbnNsYXRlWFwiLFxuICAgIHk6IFwidHJhbnNsYXRlWVwiLFxuICAgIHo6IFwidHJhbnNsYXRlWlwiLFxuICAgIHRyYW5zZm9ybVBlcnNwZWN0aXZlOiBcInBlcnNwZWN0aXZlXCIsXG59O1xuY29uc3QgbnVtVHJhbnNmb3JtcyA9IHRyYW5zZm9ybVByb3BPcmRlci5sZW5ndGg7XG4vKipcbiAqIEJ1aWxkIGEgQ1NTIHRyYW5zZm9ybSBzdHlsZSBmcm9tIGluZGl2aWR1YWwgeC95L3NjYWxlIGV0YyBwcm9wZXJ0aWVzLlxuICpcbiAqIFRoaXMgb3V0cHV0cyB3aXRoIGEgZGVmYXVsdCBvcmRlciBvZiB0cmFuc2Zvcm1zL3NjYWxlcy9yb3RhdGlvbnMsIHRoaXMgY2FuIGJlIGN1c3RvbWlzZWQgYnlcbiAqIHByb3ZpZGluZyBhIHRyYW5zZm9ybVRlbXBsYXRlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBidWlsZFRyYW5zZm9ybShsYXRlc3RWYWx1ZXMsIHRyYW5zZm9ybSwgdHJhbnNmb3JtVGVtcGxhdGUpIHtcbiAgICAvLyBUaGUgdHJhbnNmb3JtIHN0cmluZyB3ZSdyZSBnb2luZyB0byBidWlsZCBpbnRvLlxuICAgIGxldCB0cmFuc2Zvcm1TdHJpbmcgPSBcIlwiO1xuICAgIGxldCB0cmFuc2Zvcm1Jc0RlZmF1bHQgPSB0cnVlO1xuICAgIC8qKlxuICAgICAqIExvb3Agb3ZlciBhbGwgcG9zc2libGUgdHJhbnNmb3JtcyBpbiBvcmRlciwgYWRkaW5nIHRoZSBvbmVzIHRoYXRcbiAgICAgKiBhcmUgcHJlc2VudCB0byB0aGUgdHJhbnNmb3JtIHN0cmluZy5cbiAgICAgKi9cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVRyYW5zZm9ybXM7IGkrKykge1xuICAgICAgICBjb25zdCBrZXkgPSB0cmFuc2Zvcm1Qcm9wT3JkZXJbaV07XG4gICAgICAgIGNvbnN0IHZhbHVlID0gbGF0ZXN0VmFsdWVzW2tleV07XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIGxldCB2YWx1ZUlzRGVmYXVsdCA9IHRydWU7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHZhbHVlSXNEZWZhdWx0ID0gdmFsdWUgPT09IChrZXkuc3RhcnRzV2l0aChcInNjYWxlXCIpID8gMSA6IDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICAgICAgICB2YWx1ZUlzRGVmYXVsdCA9IGtleS5zdGFydHNXaXRoKFwic2NhbGVcIikgPyBwYXJzZWQgPT09IDEgOiBwYXJzZWQgPT09IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2YWx1ZUlzRGVmYXVsdCB8fCB0cmFuc2Zvcm1UZW1wbGF0ZSkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWVBc1R5cGUgPSBnZXRWYWx1ZUFzVHlwZSh2YWx1ZSwgbnVtYmVyVmFsdWVUeXBlc1trZXldKTtcbiAgICAgICAgICAgIGlmICghdmFsdWVJc0RlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1Jc0RlZmF1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm1OYW1lID0gdHJhbnNsYXRlQWxpYXNba2V5XSB8fCBrZXk7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtU3RyaW5nICs9IGAke3RyYW5zZm9ybU5hbWV9KCR7dmFsdWVBc1R5cGV9KSBgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRyYW5zZm9ybVRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtW2tleV0gPSB2YWx1ZUFzVHlwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB0cmFuc2Zvcm1TdHJpbmcgPSB0cmFuc2Zvcm1TdHJpbmcudHJpbSgpO1xuICAgIC8vIElmIHdlIGhhdmUgYSBjdXN0b20gYHRyYW5zZm9ybWAgdGVtcGxhdGUsIHBhc3Mgb3VyIHRyYW5zZm9ybSB2YWx1ZXMgYW5kXG4gICAgLy8gZ2VuZXJhdGVkIHRyYW5zZm9ybVN0cmluZyB0byB0aGF0IGJlZm9yZSByZXR1cm5pbmdcbiAgICBpZiAodHJhbnNmb3JtVGVtcGxhdGUpIHtcbiAgICAgICAgdHJhbnNmb3JtU3RyaW5nID0gdHJhbnNmb3JtVGVtcGxhdGUodHJhbnNmb3JtLCB0cmFuc2Zvcm1Jc0RlZmF1bHQgPyBcIlwiIDogdHJhbnNmb3JtU3RyaW5nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHJhbnNmb3JtSXNEZWZhdWx0KSB7XG4gICAgICAgIHRyYW5zZm9ybVN0cmluZyA9IFwibm9uZVwiO1xuICAgIH1cbiAgICByZXR1cm4gdHJhbnNmb3JtU3RyaW5nO1xufVxuXG5leHBvcnQgeyBidWlsZFRyYW5zZm9ybSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnVpbGQtdHJhbnNmb3JtLm1qcy5tYXBcbiIsImltcG9ydCB7IGdldFZhbHVlQXNUeXBlIH0gZnJvbSAnLi4vLi4vLi4vdmFsdWUvdHlwZXMvdXRpbHMvZ2V0LWFzLXR5cGUubWpzJztcbmltcG9ydCB7IG51bWJlclZhbHVlVHlwZXMgfSBmcm9tICcuLi8uLi8uLi92YWx1ZS90eXBlcy9tYXBzL251bWJlci5tanMnO1xuaW1wb3J0IHsgdHJhbnNmb3JtUHJvcHMgfSBmcm9tICcuLi8uLi91dGlscy9rZXlzLXRyYW5zZm9ybS5tanMnO1xuaW1wb3J0IHsgaXNDU1NWYXJpYWJsZU5hbWUgfSBmcm9tICcuLi8uLi8uLi9hbmltYXRpb24vdXRpbHMvaXMtY3NzLXZhcmlhYmxlLm1qcyc7XG5pbXBvcnQgeyBidWlsZFRyYW5zZm9ybSB9IGZyb20gJy4vYnVpbGQtdHJhbnNmb3JtLm1qcyc7XG5cbmZ1bmN0aW9uIGJ1aWxkSFRNTFN0eWxlcyhzdGF0ZSwgbGF0ZXN0VmFsdWVzLCB0cmFuc2Zvcm1UZW1wbGF0ZSkge1xuICAgIGNvbnN0IHsgc3R5bGUsIHZhcnMsIHRyYW5zZm9ybU9yaWdpbiB9ID0gc3RhdGU7XG4gICAgLy8gVHJhY2sgd2hldGhlciB3ZSBlbmNvdW50ZXIgYW55IHRyYW5zZm9ybSBvciB0cmFuc2Zvcm1PcmlnaW4gdmFsdWVzLlxuICAgIGxldCBoYXNUcmFuc2Zvcm0gPSBmYWxzZTtcbiAgICBsZXQgaGFzVHJhbnNmb3JtT3JpZ2luID0gZmFsc2U7XG4gICAgLyoqXG4gICAgICogTG9vcCBvdmVyIGFsbCBvdXIgbGF0ZXN0IGFuaW1hdGVkIHZhbHVlcyBhbmQgZGVjaWRlIHdoZXRoZXIgdG8gaGFuZGxlIHRoZW1cbiAgICAgKiBhcyBhIHN0eWxlIG9yIENTUyB2YXJpYWJsZS5cbiAgICAgKlxuICAgICAqIFRyYW5zZm9ybXMgYW5kIHRyYW5zZm9ybSBvcmlnaW5zIGFyZSBrZXB0IHNlcGFyYXRlbHkgZm9yIGZ1cnRoZXIgcHJvY2Vzc2luZy5cbiAgICAgKi9cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBsYXRlc3RWYWx1ZXMpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBsYXRlc3RWYWx1ZXNba2V5XTtcbiAgICAgICAgaWYgKHRyYW5zZm9ybVByb3BzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGlzIGEgdHJhbnNmb3JtLCBmbGFnIHRvIGVuYWJsZSBmdXJ0aGVyIHRyYW5zZm9ybSBwcm9jZXNzaW5nXG4gICAgICAgICAgICBoYXNUcmFuc2Zvcm0gPSB0cnVlO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNDU1NWYXJpYWJsZU5hbWUoa2V5KSkge1xuICAgICAgICAgICAgdmFyc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIENvbnZlcnQgdGhlIHZhbHVlIHRvIGl0cyBkZWZhdWx0IHZhbHVlIHR5cGUsIGllIDAgLT4gXCIwcHhcIlxuICAgICAgICAgICAgY29uc3QgdmFsdWVBc1R5cGUgPSBnZXRWYWx1ZUFzVHlwZSh2YWx1ZSwgbnVtYmVyVmFsdWVUeXBlc1trZXldKTtcbiAgICAgICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aChcIm9yaWdpblwiKSkge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSB0cmFuc2Zvcm0gb3JpZ2luLCBmbGFnIGFuZCBlbmFibGUgZnVydGhlciB0cmFuc2Zvcm0tb3JpZ2luIHByb2Nlc3NpbmdcbiAgICAgICAgICAgICAgICBoYXNUcmFuc2Zvcm1PcmlnaW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbltrZXldID1cbiAgICAgICAgICAgICAgICAgICAgdmFsdWVBc1R5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHlsZVtrZXldID0gdmFsdWVBc1R5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFsYXRlc3RWYWx1ZXMudHJhbnNmb3JtKSB7XG4gICAgICAgIGlmIChoYXNUcmFuc2Zvcm0gfHwgdHJhbnNmb3JtVGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHN0eWxlLnRyYW5zZm9ybSA9IGJ1aWxkVHJhbnNmb3JtKGxhdGVzdFZhbHVlcywgc3RhdGUudHJhbnNmb3JtLCB0cmFuc2Zvcm1UZW1wbGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3R5bGUudHJhbnNmb3JtKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHdlIGhhdmUgcHJldmlvdXNseSBjcmVhdGVkIGEgdHJhbnNmb3JtIGJ1dCBjdXJyZW50bHkgZG9uJ3QgaGF2ZSBhbnksXG4gICAgICAgICAgICAgKiByZXNldCB0cmFuc2Zvcm0gc3R5bGUgdG8gbm9uZS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgc3R5bGUudHJhbnNmb3JtID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQnVpbGQgYSB0cmFuc2Zvcm1PcmlnaW4gc3R5bGUuIFVzZXMgdGhlIHNhbWUgZGVmYXVsdHMgYXMgdGhlIGJyb3dzZXIgZm9yXG4gICAgICogdW5kZWZpbmVkIG9yaWdpbnMuXG4gICAgICovXG4gICAgaWYgKGhhc1RyYW5zZm9ybU9yaWdpbikge1xuICAgICAgICBjb25zdCB7IG9yaWdpblggPSBcIjUwJVwiLCBvcmlnaW5ZID0gXCI1MCVcIiwgb3JpZ2luWiA9IDAsIH0gPSB0cmFuc2Zvcm1PcmlnaW47XG4gICAgICAgIHN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IGAke29yaWdpblh9ICR7b3JpZ2luWX0gJHtvcmlnaW5afWA7XG4gICAgfVxufVxuXG5leHBvcnQgeyBidWlsZEhUTUxTdHlsZXMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1aWxkLXN0eWxlcy5tanMubWFwXG4iLCJmdW5jdGlvbiByZW5kZXJIVE1MKGVsZW1lbnQsIHsgc3R5bGUsIHZhcnMgfSwgc3R5bGVQcm9wLCBwcm9qZWN0aW9uKSB7XG4gICAgY29uc3QgZWxlbWVudFN0eWxlID0gZWxlbWVudC5zdHlsZTtcbiAgICBsZXQga2V5O1xuICAgIGZvciAoa2V5IGluIHN0eWxlKSB7XG4gICAgICAgIC8vIENTU1N0eWxlRGVjbGFyYXRpb24gaGFzIFtpbmRleDogbnVtYmVyXTogc3RyaW5nOyBpbiB0aGUgdHlwZXMsIHNvIHdlIHVzZSB0aGF0IGFzIGtleSB0eXBlLlxuICAgICAgICBlbGVtZW50U3R5bGVba2V5XSA9IHN0eWxlW2tleV07XG4gICAgfVxuICAgIC8vIFdyaXRlIHByb2plY3Rpb24gc3R5bGVzIGRpcmVjdGx5IHRvIGVsZW1lbnQgc3R5bGVcbiAgICBwcm9qZWN0aW9uPy5hcHBseVByb2plY3Rpb25TdHlsZXMoZWxlbWVudFN0eWxlLCBzdHlsZVByb3ApO1xuICAgIGZvciAoa2V5IGluIHZhcnMpIHtcbiAgICAgICAgLy8gTG9vcCBvdmVyIGFueSBDU1MgdmFyaWFibGVzIGFuZCBhc3NpZ24gdGhvc2UuXG4gICAgICAgIC8vIFRoZXkgY2FuIG9ubHkgYmUgYXNzaWduZWQgdXNpbmcgYHNldFByb3BlcnR5YC5cbiAgICAgICAgZWxlbWVudFN0eWxlLnNldFByb3BlcnR5KGtleSwgdmFyc1trZXldKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IHJlbmRlckhUTUwgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlbmRlci5tanMubWFwXG4iLCJpbXBvcnQgeyBweCB9IGZyb20gJy4uLy4uL3ZhbHVlL3R5cGVzL251bWJlcnMvdW5pdHMubWpzJztcblxuZnVuY3Rpb24gcGl4ZWxzVG9QZXJjZW50KHBpeGVscywgYXhpcykge1xuICAgIGlmIChheGlzLm1heCA9PT0gYXhpcy5taW4pXG4gICAgICAgIHJldHVybiAwO1xuICAgIHJldHVybiAocGl4ZWxzIC8gKGF4aXMubWF4IC0gYXhpcy5taW4pKSAqIDEwMDtcbn1cbi8qKlxuICogV2UgYWx3YXlzIGNvcnJlY3QgYm9yZGVyUmFkaXVzIGFzIGEgcGVyY2VudGFnZSByYXRoZXIgdGhhbiBwaXhlbHMgdG8gcmVkdWNlIHBhaW50cy5cbiAqIEZvciBleGFtcGxlLCBpZiB5b3UgYXJlIHByb2plY3RpbmcgYSBib3ggdGhhdCBpcyAxMDBweCB3aWRlIHdpdGggYSAxMHB4IGJvcmRlclJhZGl1c1xuICogaW50byBhIGJveCB0aGF0IGlzIDIwMHB4IHdpZGUgd2l0aCBhIDIwcHggYm9yZGVyUmFkaXVzLCB0aGF0IGlzIGFjdHVhbGx5IGEgMTAlXG4gKiBib3JkZXJSYWRpdXMgaW4gYm90aCBzdGF0ZXMuIElmIHdlIGFuaW1hdGUgYmV0d2VlbiB0aGUgdHdvIGluIHBpeGVscyB0aGF0IHdpbGwgdHJpZ2dlclxuICogYSBwYWludCBlYWNoIHRpbWUuIElmIHdlIGFuaW1hdGUgYmV0d2VlbiB0aGUgdHdvIGluIHBlcmNlbnRhZ2Ugd2UnbGwgYXZvaWQgYSBwYWludC5cbiAqL1xuY29uc3QgY29ycmVjdEJvcmRlclJhZGl1cyA9IHtcbiAgICBjb3JyZWN0OiAobGF0ZXN0LCBub2RlKSA9PiB7XG4gICAgICAgIGlmICghbm9kZS50YXJnZXQpXG4gICAgICAgICAgICByZXR1cm4gbGF0ZXN0O1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgbGF0ZXN0IGlzIGEgc3RyaW5nLCBpZiBpdCdzIGEgcGVyY2VudGFnZSB3ZSBjYW4gcmV0dXJuIGltbWVkaWF0ZWx5IGFzIGl0J3NcbiAgICAgICAgICogZ29pbmcgdG8gYmUgc3RyZXRjaGVkIGFwcHJvcHJpYXRlbHkuIE90aGVyd2lzZSwgaWYgaXQncyBhIHBpeGVsLCBjb252ZXJ0IGl0IHRvIGEgbnVtYmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHR5cGVvZiBsYXRlc3QgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGlmIChweC50ZXN0KGxhdGVzdCkpIHtcbiAgICAgICAgICAgICAgICBsYXRlc3QgPSBwYXJzZUZsb2F0KGxhdGVzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGF0ZXN0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBsYXRlc3QgaXMgYSBudW1iZXIsIGl0J3MgYSBwaXhlbCB2YWx1ZS4gV2UgdXNlIHRoZSBjdXJyZW50IHZpZXdwb3J0Qm94IHRvIGNhbGN1bGF0ZSB0aGF0XG4gICAgICAgICAqIHBpeGVsIHZhbHVlIGFzIGEgcGVyY2VudGFnZSBvZiBlYWNoIGF4aXNcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHggPSBwaXhlbHNUb1BlcmNlbnQobGF0ZXN0LCBub2RlLnRhcmdldC54KTtcbiAgICAgICAgY29uc3QgeSA9IHBpeGVsc1RvUGVyY2VudChsYXRlc3QsIG5vZGUudGFyZ2V0LnkpO1xuICAgICAgICByZXR1cm4gYCR7eH0lICR7eX0lYDtcbiAgICB9LFxufTtcblxuZXhwb3J0IHsgY29ycmVjdEJvcmRlclJhZGl1cywgcGl4ZWxzVG9QZXJjZW50IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY2FsZS1ib3JkZXItcmFkaXVzLm1qcy5tYXBcbiIsImltcG9ydCB7IGNvbXBsZXggfSBmcm9tICcuLi8uLi92YWx1ZS90eXBlcy9jb21wbGV4L2luZGV4Lm1qcyc7XG5pbXBvcnQgeyBtaXhOdW1iZXIgfSBmcm9tICcuLi8uLi91dGlscy9taXgvbnVtYmVyLm1qcyc7XG5cbmNvbnN0IGNvcnJlY3RCb3hTaGFkb3cgPSB7XG4gICAgY29ycmVjdDogKGxhdGVzdCwgeyB0cmVlU2NhbGUsIHByb2plY3Rpb25EZWx0YSB9KSA9PiB7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsID0gbGF0ZXN0O1xuICAgICAgICBjb25zdCBzaGFkb3cgPSBjb21wbGV4LnBhcnNlKGxhdGVzdCk7XG4gICAgICAgIC8vIFRPRE86IERvZXNuJ3Qgc3VwcG9ydCBtdWx0aXBsZSBzaGFkb3dzXG4gICAgICAgIGlmIChzaGFkb3cubGVuZ3RoID4gNSlcbiAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbDtcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBjb21wbGV4LmNyZWF0ZVRyYW5zZm9ybWVyKGxhdGVzdCk7XG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHR5cGVvZiBzaGFkb3dbMF0gIT09IFwibnVtYmVyXCIgPyAxIDogMDtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBvdmVyYWxsIGNvbnRleHQgc2NhbGVcbiAgICAgICAgY29uc3QgeFNjYWxlID0gcHJvamVjdGlvbkRlbHRhLnguc2NhbGUgKiB0cmVlU2NhbGUueDtcbiAgICAgICAgY29uc3QgeVNjYWxlID0gcHJvamVjdGlvbkRlbHRhLnkuc2NhbGUgKiB0cmVlU2NhbGUueTtcbiAgICAgICAgc2hhZG93WzAgKyBvZmZzZXRdIC89IHhTY2FsZTtcbiAgICAgICAgc2hhZG93WzEgKyBvZmZzZXRdIC89IHlTY2FsZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElkZWFsbHkgd2UnZCBjb3JyZWN0IHggYW5kIHkgc2NhbGVzIGluZGl2aWR1YWxseSwgYnV0IGJlY2F1c2UgYmx1ciBhbmRcbiAgICAgICAgICogc3ByZWFkIGFwcGx5IHRvIGJvdGggd2UgaGF2ZSB0byB0YWtlIGEgc2NhbGUgYXZlcmFnZSBhbmQgYXBwbHkgdGhhdCBpbnN0ZWFkLlxuICAgICAgICAgKiBXZSBjb3VsZCBwb3RlbnRpYWxseSBpbXByb3ZlIHRoZSBvdXRjb21lIG9mIHRoaXMgYnkgaW5jb3Jwb3JhdGluZyB0aGUgcmF0aW8gYmV0d2VlblxuICAgICAgICAgKiB0aGUgdHdvIHNjYWxlcy5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGF2ZXJhZ2VTY2FsZSA9IG1peE51bWJlcih4U2NhbGUsIHlTY2FsZSwgMC41KTtcbiAgICAgICAgLy8gQmx1clxuICAgICAgICBpZiAodHlwZW9mIHNoYWRvd1syICsgb2Zmc2V0XSA9PT0gXCJudW1iZXJcIilcbiAgICAgICAgICAgIHNoYWRvd1syICsgb2Zmc2V0XSAvPSBhdmVyYWdlU2NhbGU7XG4gICAgICAgIC8vIFNwcmVhZFxuICAgICAgICBpZiAodHlwZW9mIHNoYWRvd1szICsgb2Zmc2V0XSA9PT0gXCJudW1iZXJcIilcbiAgICAgICAgICAgIHNoYWRvd1szICsgb2Zmc2V0XSAvPSBhdmVyYWdlU2NhbGU7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZShzaGFkb3cpO1xuICAgIH0sXG59O1xuXG5leHBvcnQgeyBjb3JyZWN0Qm94U2hhZG93IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY2FsZS1ib3gtc2hhZG93Lm1qcy5tYXBcbiIsImltcG9ydCB7IGlzQ1NTVmFyaWFibGVOYW1lIH0gZnJvbSAnLi4vLi4vYW5pbWF0aW9uL3V0aWxzL2lzLWNzcy12YXJpYWJsZS5tanMnO1xuaW1wb3J0IHsgY29ycmVjdEJvcmRlclJhZGl1cyB9IGZyb20gJy4vc2NhbGUtYm9yZGVyLXJhZGl1cy5tanMnO1xuaW1wb3J0IHsgY29ycmVjdEJveFNoYWRvdyB9IGZyb20gJy4vc2NhbGUtYm94LXNoYWRvdy5tanMnO1xuXG5jb25zdCBzY2FsZUNvcnJlY3RvcnMgPSB7XG4gICAgYm9yZGVyUmFkaXVzOiB7XG4gICAgICAgIC4uLmNvcnJlY3RCb3JkZXJSYWRpdXMsXG4gICAgICAgIGFwcGx5VG86IFtcbiAgICAgICAgICAgIFwiYm9yZGVyVG9wTGVmdFJhZGl1c1wiLFxuICAgICAgICAgICAgXCJib3JkZXJUb3BSaWdodFJhZGl1c1wiLFxuICAgICAgICAgICAgXCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzXCIsXG4gICAgICAgICAgICBcImJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzXCIsXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICBib3JkZXJUb3BMZWZ0UmFkaXVzOiBjb3JyZWN0Qm9yZGVyUmFkaXVzLFxuICAgIGJvcmRlclRvcFJpZ2h0UmFkaXVzOiBjb3JyZWN0Qm9yZGVyUmFkaXVzLFxuICAgIGJvcmRlckJvdHRvbUxlZnRSYWRpdXM6IGNvcnJlY3RCb3JkZXJSYWRpdXMsXG4gICAgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXM6IGNvcnJlY3RCb3JkZXJSYWRpdXMsXG4gICAgYm94U2hhZG93OiBjb3JyZWN0Qm94U2hhZG93LFxufTtcbmZ1bmN0aW9uIGFkZFNjYWxlQ29ycmVjdG9yKGNvcnJlY3RvcnMpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBjb3JyZWN0b3JzKSB7XG4gICAgICAgIHNjYWxlQ29ycmVjdG9yc1trZXldID0gY29ycmVjdG9yc1trZXldO1xuICAgICAgICBpZiAoaXNDU1NWYXJpYWJsZU5hbWUoa2V5KSkge1xuICAgICAgICAgICAgc2NhbGVDb3JyZWN0b3JzW2tleV0uaXNDU1NWYXJpYWJsZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7IGFkZFNjYWxlQ29ycmVjdG9yLCBzY2FsZUNvcnJlY3RvcnMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNjYWxlLWNvcnJlY3Rpb24ubWpzLm1hcFxuIiwiaW1wb3J0IHsgdHJhbnNmb3JtUHJvcHMgfSBmcm9tICcuL2tleXMtdHJhbnNmb3JtLm1qcyc7XG5pbXBvcnQgeyBzY2FsZUNvcnJlY3RvcnMgfSBmcm9tICcuLi8uLi9wcm9qZWN0aW9uL3N0eWxlcy9zY2FsZS1jb3JyZWN0aW9uLm1qcyc7XG5leHBvcnQgeyBhZGRTY2FsZUNvcnJlY3RvciB9IGZyb20gJy4uLy4uL3Byb2plY3Rpb24vc3R5bGVzL3NjYWxlLWNvcnJlY3Rpb24ubWpzJztcblxuZnVuY3Rpb24gaXNGb3JjZWRNb3Rpb25WYWx1ZShrZXksIHsgbGF5b3V0LCBsYXlvdXRJZCB9KSB7XG4gICAgcmV0dXJuICh0cmFuc2Zvcm1Qcm9wcy5oYXMoa2V5KSB8fFxuICAgICAgICBrZXkuc3RhcnRzV2l0aChcIm9yaWdpblwiKSB8fFxuICAgICAgICAoKGxheW91dCB8fCBsYXlvdXRJZCAhPT0gdW5kZWZpbmVkKSAmJlxuICAgICAgICAgICAgKCEhc2NhbGVDb3JyZWN0b3JzW2tleV0gfHwga2V5ID09PSBcIm9wYWNpdHlcIikpKTtcbn1cblxuZXhwb3J0IHsgaXNGb3JjZWRNb3Rpb25WYWx1ZSwgc2NhbGVDb3JyZWN0b3JzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pcy1mb3JjZWQtbW90aW9uLXZhbHVlLm1qcy5tYXBcbiIsImltcG9ydCB7IGlzTW90aW9uVmFsdWUgfSBmcm9tICcuLi8uLi8uLi92YWx1ZS91dGlscy9pcy1tb3Rpb24tdmFsdWUubWpzJztcbmltcG9ydCB7IGlzRm9yY2VkTW90aW9uVmFsdWUgfSBmcm9tICcuLi8uLi91dGlscy9pcy1mb3JjZWQtbW90aW9uLXZhbHVlLm1qcyc7XG5cbmZ1bmN0aW9uIHNjcmFwZU1vdGlvblZhbHVlc0Zyb21Qcm9wcyhwcm9wcywgcHJldlByb3BzLCB2aXN1YWxFbGVtZW50KSB7XG4gICAgY29uc3Qgc3R5bGUgPSBwcm9wcy5zdHlsZTtcbiAgICBjb25zdCBwcmV2U3R5bGUgPSBwcmV2UHJvcHM/LnN0eWxlO1xuICAgIGNvbnN0IG5ld1ZhbHVlcyA9IHt9O1xuICAgIGlmICghc3R5bGUpXG4gICAgICAgIHJldHVybiBuZXdWYWx1ZXM7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gc3R5bGUpIHtcbiAgICAgICAgaWYgKGlzTW90aW9uVmFsdWUoc3R5bGVba2V5XSkgfHxcbiAgICAgICAgICAgIChwcmV2U3R5bGUgJiYgaXNNb3Rpb25WYWx1ZShwcmV2U3R5bGVba2V5XSkpIHx8XG4gICAgICAgICAgICBpc0ZvcmNlZE1vdGlvblZhbHVlKGtleSwgcHJvcHMpIHx8XG4gICAgICAgICAgICB2aXN1YWxFbGVtZW50Py5nZXRWYWx1ZShrZXkpPy5saXZlU3R5bGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbmV3VmFsdWVzW2tleV0gPSBzdHlsZVtrZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdWYWx1ZXM7XG59XG5cbmV4cG9ydCB7IHNjcmFwZU1vdGlvblZhbHVlc0Zyb21Qcm9wcyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NyYXBlLW1vdGlvbi12YWx1ZXMubWpzLm1hcFxuIiwiaW1wb3J0IHsgaXNDU1NWYXJpYWJsZU5hbWUgfSBmcm9tICcuLi8uLi9hbmltYXRpb24vdXRpbHMvaXMtY3NzLXZhcmlhYmxlLm1qcyc7XG5pbXBvcnQgeyB0cmFuc2Zvcm1Qcm9wcyB9IGZyb20gJy4uL3V0aWxzL2tleXMtdHJhbnNmb3JtLm1qcyc7XG5pbXBvcnQgeyBkZWZhdWx0VHJhbnNmb3JtVmFsdWUsIHJlYWRUcmFuc2Zvcm1WYWx1ZSB9IGZyb20gJy4uL2RvbS9wYXJzZS10cmFuc2Zvcm0ubWpzJztcbmltcG9ydCB7IG1lYXN1cmVWaWV3cG9ydEJveCB9IGZyb20gJy4uLy4uL3Byb2plY3Rpb24vdXRpbHMvbWVhc3VyZS5tanMnO1xuaW1wb3J0IHsgRE9NVmlzdWFsRWxlbWVudCB9IGZyb20gJy4uL2RvbS9ET01WaXN1YWxFbGVtZW50Lm1qcyc7XG5pbXBvcnQgeyBidWlsZEhUTUxTdHlsZXMgfSBmcm9tICcuL3V0aWxzL2J1aWxkLXN0eWxlcy5tanMnO1xuaW1wb3J0IHsgcmVuZGVySFRNTCB9IGZyb20gJy4vdXRpbHMvcmVuZGVyLm1qcyc7XG5pbXBvcnQgeyBzY3JhcGVNb3Rpb25WYWx1ZXNGcm9tUHJvcHMgfSBmcm9tICcuL3V0aWxzL3NjcmFwZS1tb3Rpb24tdmFsdWVzLm1qcyc7XG5cbmZ1bmN0aW9uIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkge1xuICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcbn1cbmNsYXNzIEhUTUxWaXN1YWxFbGVtZW50IGV4dGVuZHMgRE9NVmlzdWFsRWxlbWVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMudHlwZSA9IFwiaHRtbFwiO1xuICAgICAgICB0aGlzLnJlbmRlckluc3RhbmNlID0gcmVuZGVySFRNTDtcbiAgICB9XG4gICAgcmVhZFZhbHVlRnJvbUluc3RhbmNlKGluc3RhbmNlLCBrZXkpIHtcbiAgICAgICAgaWYgKHRyYW5zZm9ybVByb3BzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9qZWN0aW9uPy5pc1Byb2plY3RpbmdcbiAgICAgICAgICAgICAgICA/IGRlZmF1bHRUcmFuc2Zvcm1WYWx1ZShrZXkpXG4gICAgICAgICAgICAgICAgOiByZWFkVHJhbnNmb3JtVmFsdWUoaW5zdGFuY2UsIGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjb21wdXRlZFN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShpbnN0YW5jZSk7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IChpc0NTU1ZhcmlhYmxlTmFtZShrZXkpXG4gICAgICAgICAgICAgICAgPyBjb21wdXRlZFN0eWxlLmdldFByb3BlcnR5VmFsdWUoa2V5KVxuICAgICAgICAgICAgICAgIDogY29tcHV0ZWRTdHlsZVtrZXldKSB8fCAwO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiA/IHZhbHVlLnRyaW0oKSA6IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIG1lYXN1cmVJbnN0YW5jZVZpZXdwb3J0Qm94KGluc3RhbmNlLCB7IHRyYW5zZm9ybVBhZ2VQb2ludCB9KSB7XG4gICAgICAgIHJldHVybiBtZWFzdXJlVmlld3BvcnRCb3goaW5zdGFuY2UsIHRyYW5zZm9ybVBhZ2VQb2ludCk7XG4gICAgfVxuICAgIGJ1aWxkKHJlbmRlclN0YXRlLCBsYXRlc3RWYWx1ZXMsIHByb3BzKSB7XG4gICAgICAgIGJ1aWxkSFRNTFN0eWxlcyhyZW5kZXJTdGF0ZSwgbGF0ZXN0VmFsdWVzLCBwcm9wcy50cmFuc2Zvcm1UZW1wbGF0ZSk7XG4gICAgfVxuICAgIHNjcmFwZU1vdGlvblZhbHVlc0Zyb21Qcm9wcyhwcm9wcywgcHJldlByb3BzLCB2aXN1YWxFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBzY3JhcGVNb3Rpb25WYWx1ZXNGcm9tUHJvcHMocHJvcHMsIHByZXZQcm9wcywgdmlzdWFsRWxlbWVudCk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBIVE1MVmlzdWFsRWxlbWVudCwgZ2V0Q29tcHV0ZWRTdHlsZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SFRNTFZpc3VhbEVsZW1lbnQubWpzLm1hcFxuIiwiaW1wb3J0IHsgY3JlYXRlQm94IH0gZnJvbSAnLi4vLi4vcHJvamVjdGlvbi9nZW9tZXRyeS9tb2RlbHMubWpzJztcbmltcG9ydCB7IFZpc3VhbEVsZW1lbnQgfSBmcm9tICcuLi9WaXN1YWxFbGVtZW50Lm1qcyc7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0S2V5KGtleSwgb2JqZWN0KSB7XG4gICAgcmV0dXJuIGtleSBpbiBvYmplY3Q7XG59XG5jbGFzcyBPYmplY3RWaXN1YWxFbGVtZW50IGV4dGVuZHMgVmlzdWFsRWxlbWVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMudHlwZSA9IFwib2JqZWN0XCI7XG4gICAgfVxuICAgIHJlYWRWYWx1ZUZyb21JbnN0YW5jZShpbnN0YW5jZSwga2V5KSB7XG4gICAgICAgIGlmIChpc09iamVjdEtleShrZXksIGluc3RhbmNlKSkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBpbnN0YW5jZVtrZXldO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZ2V0QmFzZVRhcmdldEZyb21Qcm9wcygpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmVtb3ZlVmFsdWVGcm9tUmVuZGVyU3RhdGUoa2V5LCByZW5kZXJTdGF0ZSkge1xuICAgICAgICBkZWxldGUgcmVuZGVyU3RhdGUub3V0cHV0W2tleV07XG4gICAgfVxuICAgIG1lYXN1cmVJbnN0YW5jZVZpZXdwb3J0Qm94KCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlQm94KCk7XG4gICAgfVxuICAgIGJ1aWxkKHJlbmRlclN0YXRlLCBsYXRlc3RWYWx1ZXMpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihyZW5kZXJTdGF0ZS5vdXRwdXQsIGxhdGVzdFZhbHVlcyk7XG4gICAgfVxuICAgIHJlbmRlckluc3RhbmNlKGluc3RhbmNlLCB7IG91dHB1dCB9KSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIG91dHB1dCk7XG4gICAgfVxuICAgIHNvcnRJbnN0YW5jZU5vZGVQb3NpdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufVxuXG5leHBvcnQgeyBPYmplY3RWaXN1YWxFbGVtZW50IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1PYmplY3RWaXN1YWxFbGVtZW50Lm1qcy5tYXBcbiIsImNvbnN0IGRhc2hLZXlzID0ge1xuICAgIG9mZnNldDogXCJzdHJva2UtZGFzaG9mZnNldFwiLFxuICAgIGFycmF5OiBcInN0cm9rZS1kYXNoYXJyYXlcIixcbn07XG5jb25zdCBjYW1lbEtleXMgPSB7XG4gICAgb2Zmc2V0OiBcInN0cm9rZURhc2hvZmZzZXRcIixcbiAgICBhcnJheTogXCJzdHJva2VEYXNoYXJyYXlcIixcbn07XG4vKipcbiAqIEJ1aWxkIFNWRyBwYXRoIHByb3BlcnRpZXMuIFVzZXMgdGhlIHBhdGgncyBtZWFzdXJlZCBsZW5ndGggdG8gY29udmVydFxuICogb3VyIGN1c3RvbSBwYXRoTGVuZ3RoLCBwYXRoU3BhY2luZyBhbmQgcGF0aE9mZnNldCBpbnRvIHN0cm9rZS1kYXNob2Zmc2V0XG4gKiBhbmQgc3Ryb2tlLWRhc2hhcnJheSBhdHRyaWJ1dGVzLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbXV0YXRpdmUgdG8gcmVkdWNlIHBlci1mcmFtZSBHQy5cbiAqXG4gKiBOb3RlOiBXZSB1c2UgdW5pdGxlc3MgdmFsdWVzIGZvciBzdHJva2UtZGFzaGFycmF5IGFuZCBzdHJva2UtZGFzaG9mZnNldFxuICogYmVjYXVzZSBTYWZhcmkgaW5jb3JyZWN0bHkgc2NhbGVzIHB4IHZhbHVlcyB3aGVuIHRoZSBwYWdlIGlzIHpvb21lZC5cbiAqL1xuZnVuY3Rpb24gYnVpbGRTVkdQYXRoKGF0dHJzLCBsZW5ndGgsIHNwYWNpbmcgPSAxLCBvZmZzZXQgPSAwLCB1c2VEYXNoQ2FzZSA9IHRydWUpIHtcbiAgICAvLyBOb3JtYWxpc2UgcGF0aCBsZW5ndGggYnkgc2V0dGluZyBTVkcgYXR0cmlidXRlIHBhdGhMZW5ndGggdG8gMVxuICAgIGF0dHJzLnBhdGhMZW5ndGggPSAxO1xuICAgIC8vIFdlIHVzZSBkYXNoIGNhc2Ugd2hlbiBzZXR0aW5nIGF0dHJpYnV0ZXMgZGlyZWN0bHkgdG8gdGhlIERPTSBub2RlIGFuZCBjYW1lbCBjYXNlXG4gICAgLy8gd2hlbiBkZWZpbmluZyBwcm9wcyBvbiBhIFJlYWN0IGNvbXBvbmVudC5cbiAgICBjb25zdCBrZXlzID0gdXNlRGFzaENhc2UgPyBkYXNoS2V5cyA6IGNhbWVsS2V5cztcbiAgICAvLyBCdWlsZCB0aGUgZGFzaCBvZmZzZXQgKHVuaXRsZXNzIHRvIGF2b2lkIFNhZmFyaSB6b29tIGJ1ZylcbiAgICBhdHRyc1trZXlzLm9mZnNldF0gPSBgJHstb2Zmc2V0fWA7XG4gICAgLy8gQnVpbGQgdGhlIGRhc2ggYXJyYXkgKHVuaXRsZXNzIHRvIGF2b2lkIFNhZmFyaSB6b29tIGJ1ZylcbiAgICBhdHRyc1trZXlzLmFycmF5XSA9IGAke2xlbmd0aH0gJHtzcGFjaW5nfWA7XG59XG5cbmV4cG9ydCB7IGJ1aWxkU1ZHUGF0aCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGF0aC5tanMubWFwXG4iLCJpbXBvcnQgeyBidWlsZEhUTUxTdHlsZXMgfSBmcm9tICcuLi8uLi9odG1sL3V0aWxzL2J1aWxkLXN0eWxlcy5tanMnO1xuaW1wb3J0IHsgYnVpbGRTVkdQYXRoIH0gZnJvbSAnLi9wYXRoLm1qcyc7XG5cbi8qKlxuICogQ1NTIE1vdGlvbiBQYXRoIHByb3BlcnRpZXMgdGhhdCBzaG91bGQgcmVtYWluIGFzIENTUyBzdHlsZXMgb24gU1ZHIGVsZW1lbnRzLlxuICovXG5jb25zdCBjc3NNb3Rpb25QYXRoUHJvcGVydGllcyA9IFtcbiAgICBcIm9mZnNldERpc3RhbmNlXCIsXG4gICAgXCJvZmZzZXRQYXRoXCIsXG4gICAgXCJvZmZzZXRSb3RhdGVcIixcbiAgICBcIm9mZnNldEFuY2hvclwiLFxuXTtcbi8qKlxuICogQnVpbGQgU1ZHIHZpc3VhbCBhdHRyaWJ1dGVzLCBsaWtlIGN4IGFuZCBzdHlsZS50cmFuc2Zvcm1cbiAqL1xuZnVuY3Rpb24gYnVpbGRTVkdBdHRycyhzdGF0ZSwgeyBhdHRyWCwgYXR0clksIGF0dHJTY2FsZSwgcGF0aExlbmd0aCwgcGF0aFNwYWNpbmcgPSAxLCBwYXRoT2Zmc2V0ID0gMCwgXG4vLyBUaGlzIGlzIG9iamVjdCBjcmVhdGlvbiwgd2hpY2ggd2UgdHJ5IHRvIGF2b2lkIHBlci1mcmFtZS5cbi4uLmxhdGVzdCB9LCBpc1NWR1RhZywgdHJhbnNmb3JtVGVtcGxhdGUsIHN0eWxlUHJvcCkge1xuICAgIGJ1aWxkSFRNTFN0eWxlcyhzdGF0ZSwgbGF0ZXN0LCB0cmFuc2Zvcm1UZW1wbGF0ZSk7XG4gICAgLyoqXG4gICAgICogRm9yIHN2ZyB0YWdzIHdlIGp1c3Qgd2FudCB0byBtYWtlIHN1cmUgdmlld0JveCBpcyBhbmltYXRhYmxlIGFuZCB0cmVhdCBhbGwgdGhlIHN0eWxlc1xuICAgICAqIGFzIG5vcm1hbCBIVE1MIHRhZ3MuXG4gICAgICovXG4gICAgaWYgKGlzU1ZHVGFnKSB7XG4gICAgICAgIGlmIChzdGF0ZS5zdHlsZS52aWV3Qm94KSB7XG4gICAgICAgICAgICBzdGF0ZS5hdHRycy52aWV3Qm94ID0gc3RhdGUuc3R5bGUudmlld0JveDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHN0YXRlLmF0dHJzID0gc3RhdGUuc3R5bGU7XG4gICAgc3RhdGUuc3R5bGUgPSB7fTtcbiAgICBjb25zdCB7IGF0dHJzLCBzdHlsZSB9ID0gc3RhdGU7XG4gICAgLyoqXG4gICAgICogSG93ZXZlciwgd2UgYXBwbHkgdHJhbnNmb3JtcyBhcyBDU1MgdHJhbnNmb3Jtcy5cbiAgICAgKiBTbyBpZiB3ZSBkZXRlY3QgYSB0cmFuc2Zvcm0sIHRyYW5zZm9ybU9yaWdpbiB3ZSB0YWtlIGl0IGZyb20gYXR0cnMgYW5kIGNvcHkgaXQgaW50byBzdHlsZS5cbiAgICAgKi9cbiAgICBpZiAoYXR0cnMudHJhbnNmb3JtKSB7XG4gICAgICAgIHN0eWxlLnRyYW5zZm9ybSA9IGF0dHJzLnRyYW5zZm9ybTtcbiAgICAgICAgZGVsZXRlIGF0dHJzLnRyYW5zZm9ybTtcbiAgICB9XG4gICAgaWYgKHN0eWxlLnRyYW5zZm9ybSB8fCBhdHRycy50cmFuc2Zvcm1PcmlnaW4pIHtcbiAgICAgICAgc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gYXR0cnMudHJhbnNmb3JtT3JpZ2luID8/IFwiNTAlIDUwJVwiO1xuICAgICAgICBkZWxldGUgYXR0cnMudHJhbnNmb3JtT3JpZ2luO1xuICAgIH1cbiAgICBpZiAoc3R5bGUudHJhbnNmb3JtKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTVkcncyBlbGVtZW50IHRyYW5zZm9ybS1vcmlnaW4gdXNlcyBpdHMgb3duIG1lZGlhbiBhcyBhIHJlZmVyZW5jZS5cbiAgICAgICAgICogVGhlcmVmb3JlLCB0cmFuc2Zvcm1Cb3ggYmVjb21lcyBhIGZpbGwtYm94XG4gICAgICAgICAqL1xuICAgICAgICBzdHlsZS50cmFuc2Zvcm1Cb3ggPSBzdHlsZVByb3A/LnRyYW5zZm9ybUJveCA/PyBcImZpbGwtYm94XCI7XG4gICAgICAgIGRlbGV0ZSBhdHRycy50cmFuc2Zvcm1Cb3g7XG4gICAgfVxuICAgIGZvciAoY29uc3Qga2V5IG9mIGNzc01vdGlvblBhdGhQcm9wZXJ0aWVzKSB7XG4gICAgICAgIGlmIChhdHRyc1trZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN0eWxlW2tleV0gPSBhdHRyc1trZXldO1xuICAgICAgICAgICAgZGVsZXRlIGF0dHJzW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gUmVuZGVyIGF0dHJYL2F0dHJZL2F0dHJTY2FsZSBhcyBhdHRyaWJ1dGVzXG4gICAgaWYgKGF0dHJYICE9PSB1bmRlZmluZWQpXG4gICAgICAgIGF0dHJzLnggPSBhdHRyWDtcbiAgICBpZiAoYXR0clkgIT09IHVuZGVmaW5lZClcbiAgICAgICAgYXR0cnMueSA9IGF0dHJZO1xuICAgIGlmIChhdHRyU2NhbGUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgYXR0cnMuc2NhbGUgPSBhdHRyU2NhbGU7XG4gICAgLy8gQnVpbGQgU1ZHIHBhdGggaWYgb25lIGhhcyBiZWVuIGRlZmluZWRcbiAgICBpZiAocGF0aExlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGJ1aWxkU1ZHUGF0aChhdHRycywgcGF0aExlbmd0aCwgcGF0aFNwYWNpbmcsIHBhdGhPZmZzZXQsIGZhbHNlKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IGJ1aWxkU1ZHQXR0cnMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1aWxkLWF0dHJzLm1qcy5tYXBcbiIsIi8qKlxuICogQSBzZXQgb2YgYXR0cmlidXRlIG5hbWVzIHRoYXQgYXJlIGFsd2F5cyByZWFkL3dyaXR0ZW4gYXMgY2FtZWwgY2FzZS5cbiAqL1xuY29uc3QgY2FtZWxDYXNlQXR0cmlidXRlcyA9IG5ldyBTZXQoW1xuICAgIFwiYmFzZUZyZXF1ZW5jeVwiLFxuICAgIFwiZGlmZnVzZUNvbnN0YW50XCIsXG4gICAgXCJrZXJuZWxNYXRyaXhcIixcbiAgICBcImtlcm5lbFVuaXRMZW5ndGhcIixcbiAgICBcImtleVNwbGluZXNcIixcbiAgICBcImtleVRpbWVzXCIsXG4gICAgXCJsaW1pdGluZ0NvbmVBbmdsZVwiLFxuICAgIFwibWFya2VySGVpZ2h0XCIsXG4gICAgXCJtYXJrZXJXaWR0aFwiLFxuICAgIFwibnVtT2N0YXZlc1wiLFxuICAgIFwidGFyZ2V0WFwiLFxuICAgIFwidGFyZ2V0WVwiLFxuICAgIFwic3VyZmFjZVNjYWxlXCIsXG4gICAgXCJzcGVjdWxhckNvbnN0YW50XCIsXG4gICAgXCJzcGVjdWxhckV4cG9uZW50XCIsXG4gICAgXCJzdGREZXZpYXRpb25cIixcbiAgICBcInRhYmxlVmFsdWVzXCIsXG4gICAgXCJ2aWV3Qm94XCIsXG4gICAgXCJncmFkaWVudFRyYW5zZm9ybVwiLFxuICAgIFwicGF0aExlbmd0aFwiLFxuICAgIFwic3RhcnRPZmZzZXRcIixcbiAgICBcInRleHRMZW5ndGhcIixcbiAgICBcImxlbmd0aEFkanVzdFwiLFxuXSk7XG5cbmV4cG9ydCB7IGNhbWVsQ2FzZUF0dHJpYnV0ZXMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNhbWVsLWNhc2UtYXR0cnMubWpzLm1hcFxuIiwiY29uc3QgaXNTVkdUYWcgPSAodGFnKSA9PiB0eXBlb2YgdGFnID09PSBcInN0cmluZ1wiICYmIHRhZy50b0xvd2VyQ2FzZSgpID09PSBcInN2Z1wiO1xuXG5leHBvcnQgeyBpc1NWR1RhZyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtc3ZnLXRhZy5tanMubWFwXG4iLCJpbXBvcnQgeyBjYW1lbFRvRGFzaCB9IGZyb20gJy4uLy4uL2RvbS91dGlscy9jYW1lbC10by1kYXNoLm1qcyc7XG5pbXBvcnQgeyByZW5kZXJIVE1MIH0gZnJvbSAnLi4vLi4vaHRtbC91dGlscy9yZW5kZXIubWpzJztcbmltcG9ydCB7IGNhbWVsQ2FzZUF0dHJpYnV0ZXMgfSBmcm9tICcuL2NhbWVsLWNhc2UtYXR0cnMubWpzJztcblxuZnVuY3Rpb24gcmVuZGVyU1ZHKGVsZW1lbnQsIHJlbmRlclN0YXRlLCBfc3R5bGVQcm9wLCBwcm9qZWN0aW9uKSB7XG4gICAgcmVuZGVySFRNTChlbGVtZW50LCByZW5kZXJTdGF0ZSwgdW5kZWZpbmVkLCBwcm9qZWN0aW9uKTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiByZW5kZXJTdGF0ZS5hdHRycykge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSghY2FtZWxDYXNlQXR0cmlidXRlcy5oYXMoa2V5KSA/IGNhbWVsVG9EYXNoKGtleSkgOiBrZXksIHJlbmRlclN0YXRlLmF0dHJzW2tleV0pO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgcmVuZGVyU1ZHIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZW5kZXIubWpzLm1hcFxuIiwiaW1wb3J0IHsgaXNNb3Rpb25WYWx1ZSB9IGZyb20gJy4uLy4uLy4uL3ZhbHVlL3V0aWxzL2lzLW1vdGlvbi12YWx1ZS5tanMnO1xuaW1wb3J0IHsgdHJhbnNmb3JtUHJvcE9yZGVyIH0gZnJvbSAnLi4vLi4vdXRpbHMva2V5cy10cmFuc2Zvcm0ubWpzJztcbmltcG9ydCB7IHNjcmFwZU1vdGlvblZhbHVlc0Zyb21Qcm9wcyBhcyBzY3JhcGVNb3Rpb25WYWx1ZXNGcm9tUHJvcHMkMSB9IGZyb20gJy4uLy4uL2h0bWwvdXRpbHMvc2NyYXBlLW1vdGlvbi12YWx1ZXMubWpzJztcblxuZnVuY3Rpb24gc2NyYXBlTW90aW9uVmFsdWVzRnJvbVByb3BzKHByb3BzLCBwcmV2UHJvcHMsIHZpc3VhbEVsZW1lbnQpIHtcbiAgICBjb25zdCBuZXdWYWx1ZXMgPSBzY3JhcGVNb3Rpb25WYWx1ZXNGcm9tUHJvcHMkMShwcm9wcywgcHJldlByb3BzLCB2aXN1YWxFbGVtZW50KTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBwcm9wcykge1xuICAgICAgICBpZiAoaXNNb3Rpb25WYWx1ZShwcm9wc1trZXldKSB8fFxuICAgICAgICAgICAgaXNNb3Rpb25WYWx1ZShwcmV2UHJvcHNba2V5XSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldEtleSA9IHRyYW5zZm9ybVByb3BPcmRlci5pbmRleE9mKGtleSkgIT09IC0xXG4gICAgICAgICAgICAgICAgPyBcImF0dHJcIiArIGtleS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGtleS5zdWJzdHJpbmcoMSlcbiAgICAgICAgICAgICAgICA6IGtleTtcbiAgICAgICAgICAgIG5ld1ZhbHVlc1t0YXJnZXRLZXldID0gcHJvcHNba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3VmFsdWVzO1xufVxuXG5leHBvcnQgeyBzY3JhcGVNb3Rpb25WYWx1ZXNGcm9tUHJvcHMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNjcmFwZS1tb3Rpb24tdmFsdWVzLm1qcy5tYXBcbiIsImltcG9ydCB7IHRyYW5zZm9ybVByb3BzIH0gZnJvbSAnLi4vdXRpbHMva2V5cy10cmFuc2Zvcm0ubWpzJztcbmltcG9ydCB7IGdldERlZmF1bHRWYWx1ZVR5cGUgfSBmcm9tICcuLi8uLi92YWx1ZS90eXBlcy9tYXBzL2RlZmF1bHRzLm1qcyc7XG5pbXBvcnQgeyBjcmVhdGVCb3ggfSBmcm9tICcuLi8uLi9wcm9qZWN0aW9uL2dlb21ldHJ5L21vZGVscy5tanMnO1xuaW1wb3J0IHsgRE9NVmlzdWFsRWxlbWVudCB9IGZyb20gJy4uL2RvbS9ET01WaXN1YWxFbGVtZW50Lm1qcyc7XG5pbXBvcnQgeyBjYW1lbFRvRGFzaCB9IGZyb20gJy4uL2RvbS91dGlscy9jYW1lbC10by1kYXNoLm1qcyc7XG5pbXBvcnQgeyBidWlsZFNWR0F0dHJzIH0gZnJvbSAnLi91dGlscy9idWlsZC1hdHRycy5tanMnO1xuaW1wb3J0IHsgY2FtZWxDYXNlQXR0cmlidXRlcyB9IGZyb20gJy4vdXRpbHMvY2FtZWwtY2FzZS1hdHRycy5tanMnO1xuaW1wb3J0IHsgaXNTVkdUYWcgfSBmcm9tICcuL3V0aWxzL2lzLXN2Zy10YWcubWpzJztcbmltcG9ydCB7IHJlbmRlclNWRyB9IGZyb20gJy4vdXRpbHMvcmVuZGVyLm1qcyc7XG5pbXBvcnQgeyBzY3JhcGVNb3Rpb25WYWx1ZXNGcm9tUHJvcHMgfSBmcm9tICcuL3V0aWxzL3NjcmFwZS1tb3Rpb24tdmFsdWVzLm1qcyc7XG5cbmNsYXNzIFNWR1Zpc3VhbEVsZW1lbnQgZXh0ZW5kcyBET01WaXN1YWxFbGVtZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy50eXBlID0gXCJzdmdcIjtcbiAgICAgICAgdGhpcy5pc1NWR1RhZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1lYXN1cmVJbnN0YW5jZVZpZXdwb3J0Qm94ID0gY3JlYXRlQm94O1xuICAgIH1cbiAgICBnZXRCYXNlVGFyZ2V0RnJvbVByb3BzKHByb3BzLCBrZXkpIHtcbiAgICAgICAgcmV0dXJuIHByb3BzW2tleV07XG4gICAgfVxuICAgIHJlYWRWYWx1ZUZyb21JbnN0YW5jZShpbnN0YW5jZSwga2V5KSB7XG4gICAgICAgIGlmICh0cmFuc2Zvcm1Qcm9wcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFR5cGUgPSBnZXREZWZhdWx0VmFsdWVUeXBlKGtleSk7XG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFR5cGUgPyBkZWZhdWx0VHlwZS5kZWZhdWx0IHx8IDAgOiAwO1xuICAgICAgICB9XG4gICAgICAgIGtleSA9ICFjYW1lbENhc2VBdHRyaWJ1dGVzLmhhcyhrZXkpID8gY2FtZWxUb0Rhc2goa2V5KSA6IGtleTtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLmdldEF0dHJpYnV0ZShrZXkpO1xuICAgIH1cbiAgICBzY3JhcGVNb3Rpb25WYWx1ZXNGcm9tUHJvcHMocHJvcHMsIHByZXZQcm9wcywgdmlzdWFsRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gc2NyYXBlTW90aW9uVmFsdWVzRnJvbVByb3BzKHByb3BzLCBwcmV2UHJvcHMsIHZpc3VhbEVsZW1lbnQpO1xuICAgIH1cbiAgICBidWlsZChyZW5kZXJTdGF0ZSwgbGF0ZXN0VmFsdWVzLCBwcm9wcykge1xuICAgICAgICBidWlsZFNWR0F0dHJzKHJlbmRlclN0YXRlLCBsYXRlc3RWYWx1ZXMsIHRoaXMuaXNTVkdUYWcsIHByb3BzLnRyYW5zZm9ybVRlbXBsYXRlLCBwcm9wcy5zdHlsZSk7XG4gICAgfVxuICAgIHJlbmRlckluc3RhbmNlKGluc3RhbmNlLCByZW5kZXJTdGF0ZSwgc3R5bGVQcm9wLCBwcm9qZWN0aW9uKSB7XG4gICAgICAgIHJlbmRlclNWRyhpbnN0YW5jZSwgcmVuZGVyU3RhdGUsIHN0eWxlUHJvcCwgcHJvamVjdGlvbik7XG4gICAgfVxuICAgIG1vdW50KGluc3RhbmNlKSB7XG4gICAgICAgIHRoaXMuaXNTVkdUYWcgPSBpc1NWR1RhZyhpbnN0YW5jZS50YWdOYW1lKTtcbiAgICAgICAgc3VwZXIubW91bnQoaW5zdGFuY2UpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgU1ZHVmlzdWFsRWxlbWVudCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U1ZHVmlzdWFsRWxlbWVudC5tanMubWFwXG4iLCJpbXBvcnQgeyBhbmltYXRlTW90aW9uVmFsdWUgfSBmcm9tICcuLi9pbnRlcmZhY2VzL21vdGlvbi12YWx1ZS5tanMnO1xuaW1wb3J0IHsgbW90aW9uVmFsdWUgfSBmcm9tICcuLi8uLi92YWx1ZS9pbmRleC5tanMnO1xuaW1wb3J0IHsgaXNNb3Rpb25WYWx1ZSB9IGZyb20gJy4uLy4uL3ZhbHVlL3V0aWxzL2lzLW1vdGlvbi12YWx1ZS5tanMnO1xuXG5mdW5jdGlvbiBhbmltYXRlU2luZ2xlVmFsdWUodmFsdWUsIGtleWZyYW1lcywgb3B0aW9ucykge1xuICAgIGNvbnN0IG1vdGlvblZhbHVlJDEgPSBpc01vdGlvblZhbHVlKHZhbHVlKSA/IHZhbHVlIDogbW90aW9uVmFsdWUodmFsdWUpO1xuICAgIG1vdGlvblZhbHVlJDEuc3RhcnQoYW5pbWF0ZU1vdGlvblZhbHVlKFwiXCIsIG1vdGlvblZhbHVlJDEsIGtleWZyYW1lcywgb3B0aW9ucykpO1xuICAgIHJldHVybiBtb3Rpb25WYWx1ZSQxLmFuaW1hdGlvbjtcbn1cblxuZXhwb3J0IHsgYW5pbWF0ZVNpbmdsZVZhbHVlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaW5nbGUtdmFsdWUubWpzLm1hcFxuIiwiZnVuY3Rpb24gaXNET01LZXlmcmFtZXMoa2V5ZnJhbWVzKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBrZXlmcmFtZXMgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkoa2V5ZnJhbWVzKTtcbn1cblxuZXhwb3J0IHsgaXNET01LZXlmcmFtZXMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzLWRvbS1rZXlmcmFtZXMubWpzLm1hcFxuIiwiaW1wb3J0IHsgcmVzb2x2ZUVsZW1lbnRzIH0gZnJvbSAnbW90aW9uLWRvbSc7XG5pbXBvcnQgeyBpc0RPTUtleWZyYW1lcyB9IGZyb20gJy4uL3V0aWxzL2lzLWRvbS1rZXlmcmFtZXMubWpzJztcblxuZnVuY3Rpb24gcmVzb2x2ZVN1YmplY3RzKHN1YmplY3QsIGtleWZyYW1lcywgc2NvcGUsIHNlbGVjdG9yQ2FjaGUpIHtcbiAgICBpZiAoc3ViamVjdCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBzdWJqZWN0ID09PSBcInN0cmluZ1wiICYmIGlzRE9NS2V5ZnJhbWVzKGtleWZyYW1lcykpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVFbGVtZW50cyhzdWJqZWN0LCBzY29wZSwgc2VsZWN0b3JDYWNoZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHN1YmplY3QgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShzdWJqZWN0KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShzdWJqZWN0KSkge1xuICAgICAgICByZXR1cm4gc3ViamVjdC5maWx0ZXIoKHMpID0+IHMgIT0gbnVsbCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gW3N1YmplY3RdO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgcmVzb2x2ZVN1YmplY3RzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZXNvbHZlLXN1YmplY3RzLm1qcy5tYXBcbiIsImZ1bmN0aW9uIGNhbGN1bGF0ZVJlcGVhdER1cmF0aW9uKGR1cmF0aW9uLCByZXBlYXQsIF9yZXBlYXREZWxheSkge1xuICAgIHJldHVybiBkdXJhdGlvbiAqIChyZXBlYXQgKyAxKTtcbn1cblxuZXhwb3J0IHsgY2FsY3VsYXRlUmVwZWF0RHVyYXRpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNhbGMtcmVwZWF0LWR1cmF0aW9uLm1qcy5tYXBcbiIsIi8qKlxuICogR2l2ZW4gYSBhYnNvbHV0ZSBvciByZWxhdGl2ZSB0aW1lIGRlZmluaXRpb24gYW5kIGN1cnJlbnQvcHJldiB0aW1lIHN0YXRlIG9mIHRoZSBzZXF1ZW5jZSxcbiAqIGNhbGN1bGF0ZSBhbiBhYnNvbHV0ZSB0aW1lIGZvciB0aGUgbmV4dCBrZXlmcmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGNhbGNOZXh0VGltZShjdXJyZW50LCBuZXh0LCBwcmV2LCBsYWJlbHMpIHtcbiAgICBpZiAodHlwZW9mIG5leHQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKG5leHQuc3RhcnRzV2l0aChcIi1cIikgfHwgbmV4dC5zdGFydHNXaXRoKFwiK1wiKSkge1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgY3VycmVudCArIHBhcnNlRmxvYXQobmV4dCkpO1xuICAgIH1cbiAgICBlbHNlIGlmIChuZXh0ID09PSBcIjxcIikge1xuICAgICAgICByZXR1cm4gcHJldjtcbiAgICB9XG4gICAgZWxzZSBpZiAobmV4dC5zdGFydHNXaXRoKFwiPFwiKSkge1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgcHJldiArIHBhcnNlRmxvYXQobmV4dC5zbGljZSgxKSkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGxhYmVscy5nZXQobmV4dCkgPz8gY3VycmVudDtcbiAgICB9XG59XG5cbmV4cG9ydCB7IGNhbGNOZXh0VGltZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2FsYy10aW1lLm1qcy5tYXBcbiIsImltcG9ydCB7IG1peE51bWJlciB9IGZyb20gJ21vdGlvbi1kb20nO1xuaW1wb3J0IHsgZ2V0RWFzaW5nRm9yU2VnbWVudCwgcmVtb3ZlSXRlbSB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5cbmZ1bmN0aW9uIGVyYXNlS2V5ZnJhbWVzKHNlcXVlbmNlLCBzdGFydFRpbWUsIGVuZFRpbWUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlcXVlbmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGtleWZyYW1lID0gc2VxdWVuY2VbaV07XG4gICAgICAgIGlmIChrZXlmcmFtZS5hdCA+IHN0YXJ0VGltZSAmJiBrZXlmcmFtZS5hdCA8IGVuZFRpbWUpIHtcbiAgICAgICAgICAgIHJlbW92ZUl0ZW0oc2VxdWVuY2UsIGtleWZyYW1lKTtcbiAgICAgICAgICAgIC8vIElmIHdlIHJlbW92ZSB0aGlzIGl0ZW0gd2UgaGF2ZSB0byBwdXNoIHRoZSBwb2ludGVyIGJhY2sgb25lXG4gICAgICAgICAgICBpLS07XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBhZGRLZXlmcmFtZXMoc2VxdWVuY2UsIGtleWZyYW1lcywgZWFzaW5nLCBvZmZzZXQsIHN0YXJ0VGltZSwgZW5kVGltZSkge1xuICAgIC8qKlxuICAgICAqIEVyYXNlIGV2ZXJ5IGV4aXN0aW5nIHZhbHVlIGJldHdlZW4gY3VycmVudFRpbWUgYW5kIHRhcmdldFRpbWUsXG4gICAgICogdGhpcyB3aWxsIGVzc2VudGlhbGx5IHNwbGljZSB0aGlzIHRpbWVsaW5lIGludG8gYW55IGN1cnJlbnRseVxuICAgICAqIGRlZmluZWQgb25lcy5cbiAgICAgKi9cbiAgICBlcmFzZUtleWZyYW1lcyhzZXF1ZW5jZSwgc3RhcnRUaW1lLCBlbmRUaW1lKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleWZyYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBzZXF1ZW5jZS5wdXNoKHtcbiAgICAgICAgICAgIHZhbHVlOiBrZXlmcmFtZXNbaV0sXG4gICAgICAgICAgICBhdDogbWl4TnVtYmVyKHN0YXJ0VGltZSwgZW5kVGltZSwgb2Zmc2V0W2ldKSxcbiAgICAgICAgICAgIGVhc2luZzogZ2V0RWFzaW5nRm9yU2VnbWVudChlYXNpbmcsIGkpLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IGFkZEtleWZyYW1lcywgZXJhc2VLZXlmcmFtZXMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVkaXQubWpzLm1hcFxuIiwiLyoqXG4gKiBUYWtlIGFuIGFycmF5IG9mIHRpbWVzIHRoYXQgcmVwcmVzZW50IHJlcGVhdGVkIGtleWZyYW1lcy4gRm9yIGluc3RhbmNlXG4gKiBpZiB3ZSBoYXZlIG9yaWdpbmFsIHRpbWVzIG9mIFswLCAwLjUsIDFdIHRoZW4gb3VyIHJlcGVhdGVkIHRpbWVzIHdpbGxcbiAqIGJlIFswLCAwLjUsIDEsIDEsIDEuNSwgMl0uIExvb3Agb3ZlciB0aGUgdGltZXMgYW5kIHNjYWxlIHRoZW0gYmFja1xuICogZG93biB0byBhIDAtMSBzY2FsZS5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplVGltZXModGltZXMsIHJlcGVhdCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGltZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGltZXNbaV0gPSB0aW1lc1tpXSAvIChyZXBlYXQgKyAxKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IG5vcm1hbGl6ZVRpbWVzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ub3JtYWxpemUtdGltZXMubWpzLm1hcFxuIiwiZnVuY3Rpb24gY29tcGFyZUJ5VGltZShhLCBiKSB7XG4gICAgaWYgKGEuYXQgPT09IGIuYXQpIHtcbiAgICAgICAgaWYgKGEudmFsdWUgPT09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgaWYgKGIudmFsdWUgPT09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGEuYXQgLSBiLmF0O1xuICAgIH1cbn1cblxuZXhwb3J0IHsgY29tcGFyZUJ5VGltZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c29ydC5tanMubWFwXG4iLCJpbXBvcnQgeyBpc01vdGlvblZhbHVlLCBkZWZhdWx0T2Zmc2V0LCBpc0dlbmVyYXRvciwgY3JlYXRlR2VuZXJhdG9yRWFzaW5nLCBmaWxsT2Zmc2V0IH0gZnJvbSAnbW90aW9uLWRvbSc7XG5pbXBvcnQgeyBwcm9ncmVzcywgc2Vjb25kc1RvTWlsbGlzZWNvbmRzLCBpbnZhcmlhbnQsIGdldEVhc2luZ0ZvclNlZ21lbnQgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgcmVzb2x2ZVN1YmplY3RzIH0gZnJvbSAnLi4vYW5pbWF0ZS9yZXNvbHZlLXN1YmplY3RzLm1qcyc7XG5pbXBvcnQgeyBjYWxjdWxhdGVSZXBlYXREdXJhdGlvbiB9IGZyb20gJy4vdXRpbHMvY2FsYy1yZXBlYXQtZHVyYXRpb24ubWpzJztcbmltcG9ydCB7IGNhbGNOZXh0VGltZSB9IGZyb20gJy4vdXRpbHMvY2FsYy10aW1lLm1qcyc7XG5pbXBvcnQgeyBhZGRLZXlmcmFtZXMgfSBmcm9tICcuL3V0aWxzL2VkaXQubWpzJztcbmltcG9ydCB7IG5vcm1hbGl6ZVRpbWVzIH0gZnJvbSAnLi91dGlscy9ub3JtYWxpemUtdGltZXMubWpzJztcbmltcG9ydCB7IGNvbXBhcmVCeVRpbWUgfSBmcm9tICcuL3V0aWxzL3NvcnQubWpzJztcblxuY29uc3QgZGVmYXVsdFNlZ21lbnRFYXNpbmcgPSBcImVhc2VJbk91dFwiO1xuY29uc3QgTUFYX1JFUEVBVCA9IDIwO1xuZnVuY3Rpb24gY3JlYXRlQW5pbWF0aW9uc0Zyb21TZXF1ZW5jZShzZXF1ZW5jZSwgeyBkZWZhdWx0VHJhbnNpdGlvbiA9IHt9LCAuLi5zZXF1ZW5jZVRyYW5zaXRpb24gfSA9IHt9LCBzY29wZSwgZ2VuZXJhdG9ycykge1xuICAgIGNvbnN0IGRlZmF1bHREdXJhdGlvbiA9IGRlZmF1bHRUcmFuc2l0aW9uLmR1cmF0aW9uIHx8IDAuMztcbiAgICBjb25zdCBhbmltYXRpb25EZWZpbml0aW9ucyA9IG5ldyBNYXAoKTtcbiAgICBjb25zdCBzZXF1ZW5jZXMgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgZWxlbWVudENhY2hlID0ge307XG4gICAgY29uc3QgdGltZUxhYmVscyA9IG5ldyBNYXAoKTtcbiAgICBsZXQgcHJldlRpbWUgPSAwO1xuICAgIGxldCBjdXJyZW50VGltZSA9IDA7XG4gICAgbGV0IHRvdGFsRHVyYXRpb24gPSAwO1xuICAgIC8qKlxuICAgICAqIEJ1aWxkIHRoZSB0aW1lbGluZSBieSBtYXBwaW5nIG92ZXIgdGhlIHNlcXVlbmNlIGFycmF5IGFuZCBjb252ZXJ0aW5nXG4gICAgICogdGhlIGRlZmluaXRpb25zIGludG8ga2V5ZnJhbWVzIGFuZCBvZmZzZXRzIHdpdGggYWJzb2x1dGUgdGltZSB2YWx1ZXMuXG4gICAgICogVGhlc2Ugd2lsbCBsYXRlciBnZXQgY29udmVydGVkIGludG8gcmVsYXRpdmUgb2Zmc2V0cyBpbiBhIHNlY29uZCBwYXNzLlxuICAgICAqL1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VxdWVuY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgc2VnbWVudCA9IHNlcXVlbmNlW2ldO1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhpcyBpcyBhIHRpbWVsaW5lIGxhYmVsLCBtYXJrIGl0IGFuZCBza2lwIHRoZSByZXN0IG9mIHRoaXMgaXRlcmF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHR5cGVvZiBzZWdtZW50ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aW1lTGFiZWxzLnNldChzZWdtZW50LCBjdXJyZW50VGltZSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghQXJyYXkuaXNBcnJheShzZWdtZW50KSkge1xuICAgICAgICAgICAgdGltZUxhYmVscy5zZXQoc2VnbWVudC5uYW1lLCBjYWxjTmV4dFRpbWUoY3VycmVudFRpbWUsIHNlZ21lbnQuYXQsIHByZXZUaW1lLCB0aW1lTGFiZWxzKSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgW3N1YmplY3QsIGtleWZyYW1lcywgdHJhbnNpdGlvbiA9IHt9XSA9IHNlZ21lbnQ7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBhIHJlbGF0aXZlIG9yIGFic29sdXRlIHRpbWUgdmFsdWUgaGFzIGJlZW4gc3BlY2lmaWVkIHdlIG5lZWQgdG8gcmVzb2x2ZVxuICAgICAgICAgKiBpdCBpbiByZWxhdGlvbiB0byB0aGUgY3VycmVudFRpbWUuXG4gICAgICAgICAqL1xuICAgICAgICBpZiAodHJhbnNpdGlvbi5hdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjdXJyZW50VGltZSA9IGNhbGNOZXh0VGltZShjdXJyZW50VGltZSwgdHJhbnNpdGlvbi5hdCwgcHJldlRpbWUsIHRpbWVMYWJlbHMpO1xuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBLZWVwIHRyYWNrIG9mIHRoZSBtYXhpbXVtIGR1cmF0aW9uIGluIHRoaXMgZGVmaW5pdGlvbi4gVGhpcyB3aWxsIGJlXG4gICAgICAgICAqIGFwcGxpZWQgdG8gY3VycmVudFRpbWUgb25jZSB0aGUgZGVmaW5pdGlvbiBoYXMgYmVlbiBwYXJzZWQuXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgbWF4RHVyYXRpb24gPSAwO1xuICAgICAgICBjb25zdCByZXNvbHZlVmFsdWVTZXF1ZW5jZSA9ICh2YWx1ZUtleWZyYW1lcywgdmFsdWVUcmFuc2l0aW9uLCB2YWx1ZVNlcXVlbmNlLCBlbGVtZW50SW5kZXggPSAwLCBudW1TdWJqZWN0cyA9IDApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlS2V5ZnJhbWVzQXNMaXN0ID0ga2V5ZnJhbWVzQXNMaXN0KHZhbHVlS2V5ZnJhbWVzKTtcbiAgICAgICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCB0aW1lcyA9IGRlZmF1bHRPZmZzZXQodmFsdWVLZXlmcmFtZXNBc0xpc3QpLCB0eXBlID0gZGVmYXVsdFRyYW5zaXRpb24udHlwZSB8fCBcImtleWZyYW1lc1wiLCByZXBlYXQsIHJlcGVhdFR5cGUsIHJlcGVhdERlbGF5ID0gMCwgLi4ucmVtYWluaW5nVHJhbnNpdGlvbiB9ID0gdmFsdWVUcmFuc2l0aW9uO1xuICAgICAgICAgICAgbGV0IHsgZWFzZSA9IGRlZmF1bHRUcmFuc2l0aW9uLmVhc2UgfHwgXCJlYXNlT3V0XCIsIGR1cmF0aW9uIH0gPSB2YWx1ZVRyYW5zaXRpb247XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFJlc29sdmUgc3RhZ2dlcigpIGlmIGRlZmluZWQuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IGNhbGN1bGF0ZWREZWxheSA9IHR5cGVvZiBkZWxheSA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgICAgICAgPyBkZWxheShlbGVtZW50SW5kZXgsIG51bVN1YmplY3RzKVxuICAgICAgICAgICAgICAgIDogZGVsYXk7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHRoaXMgYW5pbWF0aW9uIHNob3VsZCBhbmQgY2FuIHVzZSBhIHNwcmluZywgZ2VuZXJhdGUgYSBzcHJpbmcgZWFzaW5nIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBudW1LZXlmcmFtZXMgPSB2YWx1ZUtleWZyYW1lc0FzTGlzdC5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBjcmVhdGVHZW5lcmF0b3IgPSBpc0dlbmVyYXRvcih0eXBlKVxuICAgICAgICAgICAgICAgID8gdHlwZVxuICAgICAgICAgICAgICAgIDogZ2VuZXJhdG9ycz8uW3R5cGUgfHwgXCJrZXlmcmFtZXNcIl07XG4gICAgICAgICAgICBpZiAobnVtS2V5ZnJhbWVzIDw9IDIgJiYgY3JlYXRlR2VuZXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQXMgd2UncmUgY3JlYXRpbmcgYW4gZWFzaW5nIGZ1bmN0aW9uIGZyb20gYSBzcHJpbmcsXG4gICAgICAgICAgICAgICAgICogaWRlYWxseSB3ZSB3YW50IHRvIGdlbmVyYXRlIGl0IHVzaW5nIHRoZSByZWFsIGRpc3RhbmNlXG4gICAgICAgICAgICAgICAgICogYmV0d2VlbiB0aGUgdHdvIGtleWZyYW1lcy4gSG93ZXZlciB0aGlzIGlzbid0IGFsd2F5c1xuICAgICAgICAgICAgICAgICAqIHBvc3NpYmxlIC0gaW4gdGhlc2Ugc2l0dWF0aW9ucyB3ZSB1c2UgMC0xMDAuXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgbGV0IGFic29sdXRlRGVsdGEgPSAxMDA7XG4gICAgICAgICAgICAgICAgaWYgKG51bUtleWZyYW1lcyA9PT0gMiAmJlxuICAgICAgICAgICAgICAgICAgICBpc051bWJlcktleWZyYW1lc0FycmF5KHZhbHVlS2V5ZnJhbWVzQXNMaXN0KSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWx0YSA9IHZhbHVlS2V5ZnJhbWVzQXNMaXN0WzFdIC0gdmFsdWVLZXlmcmFtZXNBc0xpc3RbMF07XG4gICAgICAgICAgICAgICAgICAgIGFic29sdXRlRGVsdGEgPSBNYXRoLmFicyhkZWx0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHNwcmluZ1RyYW5zaXRpb24gPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLmRlZmF1bHRUcmFuc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAuLi5yZW1haW5pbmdUcmFuc2l0aW9uLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGR1cmF0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3ByaW5nVHJhbnNpdGlvbi5kdXJhdGlvbiA9IHNlY29uZHNUb01pbGxpc2Vjb25kcyhkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHNwcmluZ0Vhc2luZyA9IGNyZWF0ZUdlbmVyYXRvckVhc2luZyhzcHJpbmdUcmFuc2l0aW9uLCBhYnNvbHV0ZURlbHRhLCBjcmVhdGVHZW5lcmF0b3IpO1xuICAgICAgICAgICAgICAgIGVhc2UgPSBzcHJpbmdFYXNpbmcuZWFzZTtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbiA9IHNwcmluZ0Vhc2luZy5kdXJhdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGR1cmF0aW9uID8/IChkdXJhdGlvbiA9IGRlZmF1bHREdXJhdGlvbik7XG4gICAgICAgICAgICBjb25zdCBzdGFydFRpbWUgPSBjdXJyZW50VGltZSArIGNhbGN1bGF0ZWREZWxheTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgdGhlcmUncyBvbmx5IG9uZSB0aW1lIG9mZnNldCBvZiAwLCBmaWxsIGluIGEgc2Vjb25kIHdpdGggbGVuZ3RoIDFcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHRpbWVzLmxlbmd0aCA9PT0gMSAmJiB0aW1lc1swXSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRpbWVzWzFdID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmlsbCBvdXQgaWYgb2Zmc2V0IGlmIGZld2VyIG9mZnNldHMgdGhhbiBrZXlmcmFtZXNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgcmVtYWluZGVyID0gdGltZXMubGVuZ3RoIC0gdmFsdWVLZXlmcmFtZXNBc0xpc3QubGVuZ3RoO1xuICAgICAgICAgICAgcmVtYWluZGVyID4gMCAmJiBmaWxsT2Zmc2V0KHRpbWVzLCByZW1haW5kZXIpO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiBvbmx5IG9uZSB2YWx1ZSBoYXMgYmVlbiBzZXQsIGllIFsxXSwgcHVzaCBhIG51bGwgdG8gdGhlIHN0YXJ0IG9mXG4gICAgICAgICAgICAgKiB0aGUga2V5ZnJhbWUgYXJyYXkuIFRoaXMgd2lsbCBsZXQgdXMgbWFyayBhIGtleWZyYW1lIGF0IHRoaXMgcG9pbnRcbiAgICAgICAgICAgICAqIHRoYXQgd2lsbCBsYXRlciBiZSBoeWRyYXRlZCB3aXRoIHRoZSBwcmV2aW91cyB2YWx1ZS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFsdWVLZXlmcmFtZXNBc0xpc3QubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgICAgICAgdmFsdWVLZXlmcmFtZXNBc0xpc3QudW5zaGlmdChudWxsKTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSGFuZGxlIHJlcGVhdCBvcHRpb25zXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChyZXBlYXQpIHtcbiAgICAgICAgICAgICAgICBpbnZhcmlhbnQocmVwZWF0IDwgTUFYX1JFUEVBVCwgXCJSZXBlYXQgY291bnQgdG9vIGhpZ2gsIG11c3QgYmUgbGVzcyB0aGFuIDIwXCIsIFwicmVwZWF0LWNvdW50LWhpZ2hcIik7XG4gICAgICAgICAgICAgICAgZHVyYXRpb24gPSBjYWxjdWxhdGVSZXBlYXREdXJhdGlvbihkdXJhdGlvbiwgcmVwZWF0KTtcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbEtleWZyYW1lcyA9IFsuLi52YWx1ZUtleWZyYW1lc0FzTGlzdF07XG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxUaW1lcyA9IFsuLi50aW1lc107XG4gICAgICAgICAgICAgICAgZWFzZSA9IEFycmF5LmlzQXJyYXkoZWFzZSkgPyBbLi4uZWFzZV0gOiBbZWFzZV07XG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxFYXNlID0gWy4uLmVhc2VdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHJlcGVhdEluZGV4ID0gMDsgcmVwZWF0SW5kZXggPCByZXBlYXQ7IHJlcGVhdEluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVLZXlmcmFtZXNBc0xpc3QucHVzaCguLi5vcmlnaW5hbEtleWZyYW1lcyk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGtleWZyYW1lSW5kZXggPSAwOyBrZXlmcmFtZUluZGV4IDwgb3JpZ2luYWxLZXlmcmFtZXMubGVuZ3RoOyBrZXlmcmFtZUluZGV4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVzLnB1c2gob3JpZ2luYWxUaW1lc1trZXlmcmFtZUluZGV4XSArIChyZXBlYXRJbmRleCArIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhc2UucHVzaChrZXlmcmFtZUluZGV4ID09PSAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcImxpbmVhclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBnZXRFYXNpbmdGb3JTZWdtZW50KG9yaWdpbmFsRWFzZSwga2V5ZnJhbWVJbmRleCAtIDEpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBub3JtYWxpemVUaW1lcyh0aW1lcywgcmVwZWF0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFRpbWUgPSBzdGFydFRpbWUgKyBkdXJhdGlvbjtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQWRkIGtleWZyYW1lcywgbWFwcGluZyBvZmZzZXRzIHRvIGFic29sdXRlIHRpbWUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGFkZEtleWZyYW1lcyh2YWx1ZVNlcXVlbmNlLCB2YWx1ZUtleWZyYW1lc0FzTGlzdCwgZWFzZSwgdGltZXMsIHN0YXJ0VGltZSwgdGFyZ2V0VGltZSk7XG4gICAgICAgICAgICBtYXhEdXJhdGlvbiA9IE1hdGgubWF4KGNhbGN1bGF0ZWREZWxheSArIGR1cmF0aW9uLCBtYXhEdXJhdGlvbik7XG4gICAgICAgICAgICB0b3RhbER1cmF0aW9uID0gTWF0aC5tYXgodGFyZ2V0VGltZSwgdG90YWxEdXJhdGlvbik7XG4gICAgICAgIH07XG4gICAgICAgIGlmIChpc01vdGlvblZhbHVlKHN1YmplY3QpKSB7XG4gICAgICAgICAgICBjb25zdCBzdWJqZWN0U2VxdWVuY2UgPSBnZXRTdWJqZWN0U2VxdWVuY2Uoc3ViamVjdCwgc2VxdWVuY2VzKTtcbiAgICAgICAgICAgIHJlc29sdmVWYWx1ZVNlcXVlbmNlKGtleWZyYW1lcywgdHJhbnNpdGlvbiwgZ2V0VmFsdWVTZXF1ZW5jZShcImRlZmF1bHRcIiwgc3ViamVjdFNlcXVlbmNlKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzdWJqZWN0cyA9IHJlc29sdmVTdWJqZWN0cyhzdWJqZWN0LCBrZXlmcmFtZXMsIHNjb3BlLCBlbGVtZW50Q2FjaGUpO1xuICAgICAgICAgICAgY29uc3QgbnVtU3ViamVjdHMgPSBzdWJqZWN0cy5sZW5ndGg7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZvciBldmVyeSBlbGVtZW50IGluIHRoaXMgc2VnbWVudCwgcHJvY2VzcyB0aGUgZGVmaW5lZCB2YWx1ZXMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZvciAobGV0IHN1YmplY3RJbmRleCA9IDA7IHN1YmplY3RJbmRleCA8IG51bVN1YmplY3RzOyBzdWJqZWN0SW5kZXgrKykge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIENhc3QgbmVjZXNzYXJ5LCBidXQgd2Uga25vdyB0aGVzZSBhcmUgb2YgdGhpcyB0eXBlXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAga2V5ZnJhbWVzID0ga2V5ZnJhbWVzO1xuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24gPSB0cmFuc2l0aW9uO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNTdWJqZWN0ID0gc3ViamVjdHNbc3ViamVjdEluZGV4XTtcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJqZWN0U2VxdWVuY2UgPSBnZXRTdWJqZWN0U2VxdWVuY2UodGhpc1N1YmplY3QsIHNlcXVlbmNlcyk7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4ga2V5ZnJhbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVWYWx1ZVNlcXVlbmNlKGtleWZyYW1lc1trZXldLCBnZXRWYWx1ZVRyYW5zaXRpb24odHJhbnNpdGlvbiwga2V5KSwgZ2V0VmFsdWVTZXF1ZW5jZShrZXksIHN1YmplY3RTZXF1ZW5jZSksIHN1YmplY3RJbmRleCwgbnVtU3ViamVjdHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwcmV2VGltZSA9IGN1cnJlbnRUaW1lO1xuICAgICAgICBjdXJyZW50VGltZSArPSBtYXhEdXJhdGlvbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRm9yIGV2ZXJ5IGVsZW1lbnQgYW5kIHZhbHVlIGNvbWJpbmF0aW9uIGNyZWF0ZSBhIG5ldyBhbmltYXRpb24uXG4gICAgICovXG4gICAgc2VxdWVuY2VzLmZvckVhY2goKHZhbHVlU2VxdWVuY2VzLCBlbGVtZW50KSA9PiB7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHZhbHVlU2VxdWVuY2VzKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZVNlcXVlbmNlID0gdmFsdWVTZXF1ZW5jZXNba2V5XTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQXJyYW5nZSBhbGwgdGhlIGtleWZyYW1lcyBpbiBhc2NlbmRpbmcgdGltZSBvcmRlci5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFsdWVTZXF1ZW5jZS5zb3J0KGNvbXBhcmVCeVRpbWUpO1xuICAgICAgICAgICAgY29uc3Qga2V5ZnJhbWVzID0gW107XG4gICAgICAgICAgICBjb25zdCB2YWx1ZU9mZnNldCA9IFtdO1xuICAgICAgICAgICAgY29uc3QgdmFsdWVFYXNpbmcgPSBbXTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRm9yIGVhY2gga2V5ZnJhbWUsIHRyYW5zbGF0ZSBhYnNvbHV0ZSB0aW1lcyBpbnRvXG4gICAgICAgICAgICAgKiByZWxhdGl2ZSBvZmZzZXRzIGJhc2VkIG9uIHRoZSB0b3RhbCBkdXJhdGlvbiBvZiB0aGUgdGltZWxpbmUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVTZXF1ZW5jZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgYXQsIHZhbHVlLCBlYXNpbmcgfSA9IHZhbHVlU2VxdWVuY2VbaV07XG4gICAgICAgICAgICAgICAga2V5ZnJhbWVzLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgIHZhbHVlT2Zmc2V0LnB1c2gocHJvZ3Jlc3MoMCwgdG90YWxEdXJhdGlvbiwgYXQpKTtcbiAgICAgICAgICAgICAgICB2YWx1ZUVhc2luZy5wdXNoKGVhc2luZyB8fCBcImVhc2VPdXRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHRoZSBmaXJzdCBrZXlmcmFtZSBkb2Vzbid0IGxhbmQgb24gb2Zmc2V0OiAwXG4gICAgICAgICAgICAgKiBwcm92aWRlIG9uZSBieSBkdXBsaWNhdGluZyB0aGUgaW5pdGlhbCBrZXlmcmFtZS4gVGhpcyBlbnN1cmVzXG4gICAgICAgICAgICAgKiBpdCBzbmFwcyB0byB0aGUgZmlyc3Qga2V5ZnJhbWUgd2hlbiB0aGUgYW5pbWF0aW9uIHN0YXJ0cy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHZhbHVlT2Zmc2V0WzBdICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVPZmZzZXQudW5zaGlmdCgwKTtcbiAgICAgICAgICAgICAgICBrZXlmcmFtZXMudW5zaGlmdChrZXlmcmFtZXNbMF0pO1xuICAgICAgICAgICAgICAgIHZhbHVlRWFzaW5nLnVuc2hpZnQoZGVmYXVsdFNlZ21lbnRFYXNpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiB0aGUgbGFzdCBrZXlmcmFtZSBkb2Vzbid0IGxhbmQgb24gb2Zmc2V0OiAxXG4gICAgICAgICAgICAgKiBwcm92aWRlIG9uZSB3aXRoIGEgbnVsbCB3aWxkY2FyZCB2YWx1ZS4gVGhpcyB3aWxsIGVuc3VyZSBpdFxuICAgICAgICAgICAgICogc3RheXMgc3RhdGljIHVudGlsIHRoZSBlbmQgb2YgdGhlIGFuaW1hdGlvbi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHZhbHVlT2Zmc2V0W3ZhbHVlT2Zmc2V0Lmxlbmd0aCAtIDFdICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVPZmZzZXQucHVzaCgxKTtcbiAgICAgICAgICAgICAgICBrZXlmcmFtZXMucHVzaChudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghYW5pbWF0aW9uRGVmaW5pdGlvbnMuaGFzKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uRGVmaW5pdGlvbnMuc2V0KGVsZW1lbnQsIHtcbiAgICAgICAgICAgICAgICAgICAga2V5ZnJhbWVzOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjoge30sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkZWZpbml0aW9uID0gYW5pbWF0aW9uRGVmaW5pdGlvbnMuZ2V0KGVsZW1lbnQpO1xuICAgICAgICAgICAgZGVmaW5pdGlvbi5rZXlmcmFtZXNba2V5XSA9IGtleWZyYW1lcztcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRXhjbHVkZSBgdHlwZWAgZnJvbSBkZWZhdWx0VHJhbnNpdGlvbiBzaW5jZSBzcHJpbmdzIGhhdmUgYmVlblxuICAgICAgICAgICAgICogY29udmVydGVkIHRvIGR1cmF0aW9uLWJhc2VkIGVhc2luZyBmdW5jdGlvbnMgaW4gcmVzb2x2ZVZhbHVlU2VxdWVuY2UuXG4gICAgICAgICAgICAgKiBJbmNsdWRpbmcgYHR5cGU6IFwic3ByaW5nXCJgIHdvdWxkIGNhdXNlIEpTQW5pbWF0aW9uIHRvIGVycm9yIHdoZW5cbiAgICAgICAgICAgICAqIHRoZSBtZXJnZWQga2V5ZnJhbWVzIGFycmF5IGhhcyBtb3JlIHRoYW4gMiBrZXlmcmFtZXMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZTogX3R5cGUsIC4uLnJlbWFpbmluZ0RlZmF1bHRUcmFuc2l0aW9uIH0gPSBkZWZhdWx0VHJhbnNpdGlvbjtcbiAgICAgICAgICAgIGRlZmluaXRpb24udHJhbnNpdGlvbltrZXldID0ge1xuICAgICAgICAgICAgICAgIC4uLnJlbWFpbmluZ0RlZmF1bHRUcmFuc2l0aW9uLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiB0b3RhbER1cmF0aW9uLFxuICAgICAgICAgICAgICAgIGVhc2U6IHZhbHVlRWFzaW5nLFxuICAgICAgICAgICAgICAgIHRpbWVzOiB2YWx1ZU9mZnNldCxcbiAgICAgICAgICAgICAgICAuLi5zZXF1ZW5jZVRyYW5zaXRpb24sXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGFuaW1hdGlvbkRlZmluaXRpb25zO1xufVxuZnVuY3Rpb24gZ2V0U3ViamVjdFNlcXVlbmNlKHN1YmplY3QsIHNlcXVlbmNlcykge1xuICAgICFzZXF1ZW5jZXMuaGFzKHN1YmplY3QpICYmIHNlcXVlbmNlcy5zZXQoc3ViamVjdCwge30pO1xuICAgIHJldHVybiBzZXF1ZW5jZXMuZ2V0KHN1YmplY3QpO1xufVxuZnVuY3Rpb24gZ2V0VmFsdWVTZXF1ZW5jZShuYW1lLCBzZXF1ZW5jZXMpIHtcbiAgICBpZiAoIXNlcXVlbmNlc1tuYW1lXSlcbiAgICAgICAgc2VxdWVuY2VzW25hbWVdID0gW107XG4gICAgcmV0dXJuIHNlcXVlbmNlc1tuYW1lXTtcbn1cbmZ1bmN0aW9uIGtleWZyYW1lc0FzTGlzdChrZXlmcmFtZXMpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShrZXlmcmFtZXMpID8ga2V5ZnJhbWVzIDogW2tleWZyYW1lc107XG59XG5mdW5jdGlvbiBnZXRWYWx1ZVRyYW5zaXRpb24odHJhbnNpdGlvbiwga2V5KSB7XG4gICAgcmV0dXJuIHRyYW5zaXRpb24gJiYgdHJhbnNpdGlvbltrZXldXG4gICAgICAgID8ge1xuICAgICAgICAgICAgLi4udHJhbnNpdGlvbixcbiAgICAgICAgICAgIC4uLnRyYW5zaXRpb25ba2V5XSxcbiAgICAgICAgfVxuICAgICAgICA6IHsgLi4udHJhbnNpdGlvbiB9O1xufVxuY29uc3QgaXNOdW1iZXIgPSAoa2V5ZnJhbWUpID0+IHR5cGVvZiBrZXlmcmFtZSA9PT0gXCJudW1iZXJcIjtcbmNvbnN0IGlzTnVtYmVyS2V5ZnJhbWVzQXJyYXkgPSAoa2V5ZnJhbWVzKSA9PiBrZXlmcmFtZXMuZXZlcnkoaXNOdW1iZXIpO1xuXG5leHBvcnQgeyBjcmVhdGVBbmltYXRpb25zRnJvbVNlcXVlbmNlLCBnZXRWYWx1ZVRyYW5zaXRpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNyZWF0ZS5tanMubWFwXG4iLCJpbXBvcnQgeyBpc1NWR0VsZW1lbnQsIGlzU1ZHU1ZHRWxlbWVudCwgU1ZHVmlzdWFsRWxlbWVudCwgSFRNTFZpc3VhbEVsZW1lbnQsIHZpc3VhbEVsZW1lbnRTdG9yZSwgT2JqZWN0VmlzdWFsRWxlbWVudCB9IGZyb20gJ21vdGlvbi1kb20nO1xuXG5mdW5jdGlvbiBjcmVhdGVET01WaXN1YWxFbGVtZW50KGVsZW1lbnQpIHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICBwcmVzZW5jZUNvbnRleHQ6IG51bGwsXG4gICAgICAgIHByb3BzOiB7fSxcbiAgICAgICAgdmlzdWFsU3RhdGU6IHtcbiAgICAgICAgICAgIHJlbmRlclN0YXRlOiB7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiB7fSxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46IHt9LFxuICAgICAgICAgICAgICAgIHN0eWxlOiB7fSxcbiAgICAgICAgICAgICAgICB2YXJzOiB7fSxcbiAgICAgICAgICAgICAgICBhdHRyczoge30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGF0ZXN0VmFsdWVzOiB7fSxcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIGNvbnN0IG5vZGUgPSBpc1NWR0VsZW1lbnQoZWxlbWVudCkgJiYgIWlzU1ZHU1ZHRWxlbWVudChlbGVtZW50KVxuICAgICAgICA/IG5ldyBTVkdWaXN1YWxFbGVtZW50KG9wdGlvbnMpXG4gICAgICAgIDogbmV3IEhUTUxWaXN1YWxFbGVtZW50KG9wdGlvbnMpO1xuICAgIG5vZGUubW91bnQoZWxlbWVudCk7XG4gICAgdmlzdWFsRWxlbWVudFN0b3JlLnNldChlbGVtZW50LCBub2RlKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZU9iamVjdFZpc3VhbEVsZW1lbnQoc3ViamVjdCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgIHByZXNlbmNlQ29udGV4dDogbnVsbCxcbiAgICAgICAgcHJvcHM6IHt9LFxuICAgICAgICB2aXN1YWxTdGF0ZToge1xuICAgICAgICAgICAgcmVuZGVyU3RhdGU6IHtcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IHt9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxhdGVzdFZhbHVlczoge30sXG4gICAgICAgIH0sXG4gICAgfTtcbiAgICBjb25zdCBub2RlID0gbmV3IE9iamVjdFZpc3VhbEVsZW1lbnQob3B0aW9ucyk7XG4gICAgbm9kZS5tb3VudChzdWJqZWN0KTtcbiAgICB2aXN1YWxFbGVtZW50U3RvcmUuc2V0KHN1YmplY3QsIG5vZGUpO1xufVxuXG5leHBvcnQgeyBjcmVhdGVET01WaXN1YWxFbGVtZW50LCBjcmVhdGVPYmplY3RWaXN1YWxFbGVtZW50IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jcmVhdGUtdmlzdWFsLWVsZW1lbnQubWpzLm1hcFxuIiwiaW1wb3J0IHsgYW5pbWF0ZVNpbmdsZVZhbHVlLCB2aXN1YWxFbGVtZW50U3RvcmUsIGFuaW1hdGVUYXJnZXQsIGlzTW90aW9uVmFsdWUgfSBmcm9tICdtb3Rpb24tZG9tJztcbmltcG9ydCB7IGludmFyaWFudCB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBjcmVhdGVET01WaXN1YWxFbGVtZW50LCBjcmVhdGVPYmplY3RWaXN1YWxFbGVtZW50IH0gZnJvbSAnLi4vdXRpbHMvY3JlYXRlLXZpc3VhbC1lbGVtZW50Lm1qcyc7XG5pbXBvcnQgeyBpc0RPTUtleWZyYW1lcyB9IGZyb20gJy4uL3V0aWxzL2lzLWRvbS1rZXlmcmFtZXMubWpzJztcbmltcG9ydCB7IHJlc29sdmVTdWJqZWN0cyB9IGZyb20gJy4vcmVzb2x2ZS1zdWJqZWN0cy5tanMnO1xuXG5mdW5jdGlvbiBpc1NpbmdsZVZhbHVlKHN1YmplY3QsIGtleWZyYW1lcykge1xuICAgIHJldHVybiAoaXNNb3Rpb25WYWx1ZShzdWJqZWN0KSB8fFxuICAgICAgICB0eXBlb2Ygc3ViamVjdCA9PT0gXCJudW1iZXJcIiB8fFxuICAgICAgICAodHlwZW9mIHN1YmplY3QgPT09IFwic3RyaW5nXCIgJiYgIWlzRE9NS2V5ZnJhbWVzKGtleWZyYW1lcykpKTtcbn1cbi8qKlxuICogSW1wbGVtZW50YXRpb25cbiAqL1xuZnVuY3Rpb24gYW5pbWF0ZVN1YmplY3Qoc3ViamVjdCwga2V5ZnJhbWVzLCBvcHRpb25zLCBzY29wZSkge1xuICAgIGNvbnN0IGFuaW1hdGlvbnMgPSBbXTtcbiAgICBpZiAoaXNTaW5nbGVWYWx1ZShzdWJqZWN0LCBrZXlmcmFtZXMpKSB7XG4gICAgICAgIGFuaW1hdGlvbnMucHVzaChhbmltYXRlU2luZ2xlVmFsdWUoc3ViamVjdCwgaXNET01LZXlmcmFtZXMoa2V5ZnJhbWVzKVxuICAgICAgICAgICAgPyBrZXlmcmFtZXMuZGVmYXVsdCB8fCBrZXlmcmFtZXNcbiAgICAgICAgICAgIDoga2V5ZnJhbWVzLCBvcHRpb25zID8gb3B0aW9ucy5kZWZhdWx0IHx8IG9wdGlvbnMgOiBvcHRpb25zKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBHcmFjZWZ1bGx5IGhhbmRsZSBudWxsL3VuZGVmaW5lZCBzdWJqZWN0cyAoZS5nLiwgZnJvbSBxdWVyeVNlbGVjdG9yIHJldHVybmluZyBudWxsKVxuICAgICAgICBpZiAoc3ViamVjdCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9ucztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdWJqZWN0cyA9IHJlc29sdmVTdWJqZWN0cyhzdWJqZWN0LCBrZXlmcmFtZXMsIHNjb3BlKTtcbiAgICAgICAgY29uc3QgbnVtU3ViamVjdHMgPSBzdWJqZWN0cy5sZW5ndGg7XG4gICAgICAgIGludmFyaWFudChCb29sZWFuKG51bVN1YmplY3RzKSwgXCJObyB2YWxpZCBlbGVtZW50cyBwcm92aWRlZC5cIiwgXCJuby12YWxpZC1lbGVtZW50c1wiKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1TdWJqZWN0czsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0aGlzU3ViamVjdCA9IHN1YmplY3RzW2ldO1xuICAgICAgICAgICAgY29uc3QgY3JlYXRlVmlzdWFsRWxlbWVudCA9IHRoaXNTdWJqZWN0IGluc3RhbmNlb2YgRWxlbWVudFxuICAgICAgICAgICAgICAgID8gY3JlYXRlRE9NVmlzdWFsRWxlbWVudFxuICAgICAgICAgICAgICAgIDogY3JlYXRlT2JqZWN0VmlzdWFsRWxlbWVudDtcbiAgICAgICAgICAgIGlmICghdmlzdWFsRWxlbWVudFN0b3JlLmhhcyh0aGlzU3ViamVjdCkpIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVWaXN1YWxFbGVtZW50KHRoaXNTdWJqZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHZpc3VhbEVsZW1lbnQgPSB2aXN1YWxFbGVtZW50U3RvcmUuZ2V0KHRoaXNTdWJqZWN0KTtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zaXRpb24gPSB7IC4uLm9wdGlvbnMgfTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogUmVzb2x2ZSBzdGFnZ2VyIGZ1bmN0aW9uIGlmIHByb3ZpZGVkLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoXCJkZWxheVwiIGluIHRyYW5zaXRpb24gJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgdHJhbnNpdGlvbi5kZWxheSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbi5kZWxheSA9IHRyYW5zaXRpb24uZGVsYXkoaSwgbnVtU3ViamVjdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYW5pbWF0aW9ucy5wdXNoKC4uLmFuaW1hdGVUYXJnZXQodmlzdWFsRWxlbWVudCwgeyAuLi5rZXlmcmFtZXMsIHRyYW5zaXRpb24gfSwge30pKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYW5pbWF0aW9ucztcbn1cblxuZXhwb3J0IHsgYW5pbWF0ZVN1YmplY3QgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN1YmplY3QubWpzLm1hcFxuIiwiaW1wb3J0IHsgbW90aW9uVmFsdWUsIHNwcmluZyB9IGZyb20gJ21vdGlvbi1kb20nO1xuaW1wb3J0IHsgY3JlYXRlQW5pbWF0aW9uc0Zyb21TZXF1ZW5jZSB9IGZyb20gJy4uL3NlcXVlbmNlL2NyZWF0ZS5tanMnO1xuaW1wb3J0IHsgYW5pbWF0ZVN1YmplY3QgfSBmcm9tICcuL3N1YmplY3QubWpzJztcblxuZnVuY3Rpb24gYW5pbWF0ZVNlcXVlbmNlKHNlcXVlbmNlLCBvcHRpb25zLCBzY29wZSkge1xuICAgIGNvbnN0IGFuaW1hdGlvbnMgPSBbXTtcbiAgICAvKipcbiAgICAgKiBQcmUtcHJvY2VzczogcmVwbGFjZSBmdW5jdGlvbiBzZWdtZW50cyB3aXRoIE1vdGlvblZhbHVlIHNlZ21lbnRzLFxuICAgICAqIHN1YnNjcmliZSBjYWxsYmFja3MgaW1tZWRpYXRlbHlcbiAgICAgKi9cbiAgICBjb25zdCBwcm9jZXNzZWRTZXF1ZW5jZSA9IHNlcXVlbmNlLm1hcCgoc2VnbWVudCkgPT4ge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzZWdtZW50KSAmJiB0eXBlb2Ygc2VnbWVudFswXSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IHNlZ21lbnRbMF07XG4gICAgICAgICAgICBjb25zdCBtdiA9IG1vdGlvblZhbHVlKDApO1xuICAgICAgICAgICAgbXYub24oXCJjaGFuZ2VcIiwgY2FsbGJhY2spO1xuICAgICAgICAgICAgaWYgKHNlZ21lbnQubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFttdiwgWzAsIDFdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHNlZ21lbnQubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFttdiwgWzAsIDFdLCBzZWdtZW50WzFdXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBbbXYsIHNlZ21lbnRbMV0sIHNlZ21lbnRbMl1dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWdtZW50O1xuICAgIH0pO1xuICAgIGNvbnN0IGFuaW1hdGlvbkRlZmluaXRpb25zID0gY3JlYXRlQW5pbWF0aW9uc0Zyb21TZXF1ZW5jZShwcm9jZXNzZWRTZXF1ZW5jZSwgb3B0aW9ucywgc2NvcGUsIHsgc3ByaW5nIH0pO1xuICAgIGFuaW1hdGlvbkRlZmluaXRpb25zLmZvckVhY2goKHsga2V5ZnJhbWVzLCB0cmFuc2l0aW9uIH0sIHN1YmplY3QpID0+IHtcbiAgICAgICAgYW5pbWF0aW9ucy5wdXNoKC4uLmFuaW1hdGVTdWJqZWN0KHN1YmplY3QsIGtleWZyYW1lcywgdHJhbnNpdGlvbikpO1xuICAgIH0pO1xuICAgIHJldHVybiBhbmltYXRpb25zO1xufVxuXG5leHBvcnQgeyBhbmltYXRlU2VxdWVuY2UgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNlcXVlbmNlLm1qcy5tYXBcbiIsImltcG9ydCB7IEdyb3VwQW5pbWF0aW9uV2l0aFRoZW4gfSBmcm9tICdtb3Rpb24tZG9tJztcbmltcG9ydCB7IHJlbW92ZUl0ZW0gfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgYW5pbWF0ZVNlcXVlbmNlIH0gZnJvbSAnLi9zZXF1ZW5jZS5tanMnO1xuaW1wb3J0IHsgYW5pbWF0ZVN1YmplY3QgfSBmcm9tICcuL3N1YmplY3QubWpzJztcblxuZnVuY3Rpb24gaXNTZXF1ZW5jZSh2YWx1ZSkge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5zb21lKEFycmF5LmlzQXJyYXkpO1xufVxuLyoqXG4gKiBDcmVhdGVzIGFuIGFuaW1hdGlvbiBmdW5jdGlvbiB0aGF0IGlzIG9wdGlvbmFsbHkgc2NvcGVkXG4gKiB0byBhIHNwZWNpZmljIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVNjb3BlZEFuaW1hdGUob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgeyBzY29wZSwgcmVkdWNlTW90aW9uIH0gPSBvcHRpb25zO1xuICAgIC8qKlxuICAgICAqIEltcGxlbWVudGF0aW9uXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2NvcGVkQW5pbWF0ZShzdWJqZWN0T3JTZXF1ZW5jZSwgb3B0aW9uc09yS2V5ZnJhbWVzLCBvcHRpb25zKSB7XG4gICAgICAgIGxldCBhbmltYXRpb25zID0gW107XG4gICAgICAgIGxldCBhbmltYXRpb25PbkNvbXBsZXRlO1xuICAgICAgICBpZiAoaXNTZXF1ZW5jZShzdWJqZWN0T3JTZXF1ZW5jZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgb25Db21wbGV0ZSwgLi4uc2VxdWVuY2VPcHRpb25zIH0gPSBvcHRpb25zT3JLZXlmcmFtZXMgfHwge307XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9uQ29tcGxldGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbk9uQ29tcGxldGUgPSBvbkNvbXBsZXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYW5pbWF0aW9ucyA9IGFuaW1hdGVTZXF1ZW5jZShzdWJqZWN0T3JTZXF1ZW5jZSwgcmVkdWNlTW90aW9uICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICA/IHsgcmVkdWNlTW90aW9uLCAuLi5zZXF1ZW5jZU9wdGlvbnMgfVxuICAgICAgICAgICAgICAgIDogc2VxdWVuY2VPcHRpb25zLCBzY29wZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBFeHRyYWN0IHRvcC1sZXZlbCBvbkNvbXBsZXRlIHNvIGl0IGRvZXNuJ3QgZ2V0IGFwcGxpZWQgcGVyLXZhbHVlXG4gICAgICAgICAgICBjb25zdCB7IG9uQ29tcGxldGUsIC4uLnJlc3QgfSA9IG9wdGlvbnMgfHwge307XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9uQ29tcGxldGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvbk9uQ29tcGxldGUgPSBvbkNvbXBsZXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYW5pbWF0aW9ucyA9IGFuaW1hdGVTdWJqZWN0KHN1YmplY3RPclNlcXVlbmNlLCBvcHRpb25zT3JLZXlmcmFtZXMsIChyZWR1Y2VNb3Rpb24gIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgID8geyByZWR1Y2VNb3Rpb24sIC4uLnJlc3QgfVxuICAgICAgICAgICAgICAgIDogcmVzdCksIHNjb3BlKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhbmltYXRpb24gPSBuZXcgR3JvdXBBbmltYXRpb25XaXRoVGhlbihhbmltYXRpb25zKTtcbiAgICAgICAgaWYgKGFuaW1hdGlvbk9uQ29tcGxldGUpIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbi5maW5pc2hlZC50aGVuKGFuaW1hdGlvbk9uQ29tcGxldGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzY29wZSkge1xuICAgICAgICAgICAgc2NvcGUuYW5pbWF0aW9ucy5wdXNoKGFuaW1hdGlvbik7XG4gICAgICAgICAgICBhbmltYXRpb24uZmluaXNoZWQudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlSXRlbShzY29wZS5hbmltYXRpb25zLCBhbmltYXRpb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuaW1hdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIHNjb3BlZEFuaW1hdGU7XG59XG5jb25zdCBhbmltYXRlID0gY3JlYXRlU2NvcGVkQW5pbWF0ZSgpO1xuXG5leHBvcnQgeyBhbmltYXRlLCBjcmVhdGVTY29wZWRBbmltYXRlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5tanMubWFwXG4iLCJpbXBvcnQgeyBzdXBwb3J0c1ZpZXdUaW1lbGluZSwgc3VwcG9ydHNTY3JvbGxUaW1lbGluZSB9IGZyb20gJ21vdGlvbi1kb20nO1xuXG5mdW5jdGlvbiBjYW5Vc2VOYXRpdmVUaW1lbGluZSh0YXJnZXQpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0YXJnZXQgPyBzdXBwb3J0c1ZpZXdUaW1lbGluZSgpIDogc3VwcG9ydHNTY3JvbGxUaW1lbGluZSgpO1xufVxuXG5leHBvcnQgeyBjYW5Vc2VOYXRpdmVUaW1lbGluZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2FuLXVzZS1uYXRpdmUtdGltZWxpbmUubWpzLm1hcFxuIiwiaW1wb3J0IHsgcHJvZ3Jlc3MsIHZlbG9jaXR5UGVyU2Vjb25kIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcblxuLyoqXG4gKiBBIHRpbWUgaW4gbWlsbGlzZWNvbmRzLCBiZXlvbmQgd2hpY2ggd2UgY29uc2lkZXIgdGhlIHNjcm9sbCB2ZWxvY2l0eSB0byBiZSAwLlxuICovXG5jb25zdCBtYXhFbGFwc2VkID0gNTA7XG5jb25zdCBjcmVhdGVBeGlzSW5mbyA9ICgpID0+ICh7XG4gICAgY3VycmVudDogMCxcbiAgICBvZmZzZXQ6IFtdLFxuICAgIHByb2dyZXNzOiAwLFxuICAgIHNjcm9sbExlbmd0aDogMCxcbiAgICB0YXJnZXRPZmZzZXQ6IDAsXG4gICAgdGFyZ2V0TGVuZ3RoOiAwLFxuICAgIGNvbnRhaW5lckxlbmd0aDogMCxcbiAgICB2ZWxvY2l0eTogMCxcbn0pO1xuY29uc3QgY3JlYXRlU2Nyb2xsSW5mbyA9ICgpID0+ICh7XG4gICAgdGltZTogMCxcbiAgICB4OiBjcmVhdGVBeGlzSW5mbygpLFxuICAgIHk6IGNyZWF0ZUF4aXNJbmZvKCksXG59KTtcbmNvbnN0IGtleXMgPSB7XG4gICAgeDoge1xuICAgICAgICBsZW5ndGg6IFwiV2lkdGhcIixcbiAgICAgICAgcG9zaXRpb246IFwiTGVmdFwiLFxuICAgIH0sXG4gICAgeToge1xuICAgICAgICBsZW5ndGg6IFwiSGVpZ2h0XCIsXG4gICAgICAgIHBvc2l0aW9uOiBcIlRvcFwiLFxuICAgIH0sXG59O1xuZnVuY3Rpb24gdXBkYXRlQXhpc0luZm8oZWxlbWVudCwgYXhpc05hbWUsIGluZm8sIHRpbWUpIHtcbiAgICBjb25zdCBheGlzID0gaW5mb1theGlzTmFtZV07XG4gICAgY29uc3QgeyBsZW5ndGgsIHBvc2l0aW9uIH0gPSBrZXlzW2F4aXNOYW1lXTtcbiAgICBjb25zdCBwcmV2ID0gYXhpcy5jdXJyZW50O1xuICAgIGNvbnN0IHByZXZUaW1lID0gaW5mby50aW1lO1xuICAgIGF4aXMuY3VycmVudCA9IE1hdGguYWJzKGVsZW1lbnRbYHNjcm9sbCR7cG9zaXRpb259YF0pO1xuICAgIGF4aXMuc2Nyb2xsTGVuZ3RoID0gZWxlbWVudFtgc2Nyb2xsJHtsZW5ndGh9YF0gLSBlbGVtZW50W2BjbGllbnQke2xlbmd0aH1gXTtcbiAgICBheGlzLm9mZnNldC5sZW5ndGggPSAwO1xuICAgIGF4aXMub2Zmc2V0WzBdID0gMDtcbiAgICBheGlzLm9mZnNldFsxXSA9IGF4aXMuc2Nyb2xsTGVuZ3RoO1xuICAgIGF4aXMucHJvZ3Jlc3MgPSBwcm9ncmVzcygwLCBheGlzLnNjcm9sbExlbmd0aCwgYXhpcy5jdXJyZW50KTtcbiAgICBjb25zdCBlbGFwc2VkID0gdGltZSAtIHByZXZUaW1lO1xuICAgIGF4aXMudmVsb2NpdHkgPVxuICAgICAgICBlbGFwc2VkID4gbWF4RWxhcHNlZFxuICAgICAgICAgICAgPyAwXG4gICAgICAgICAgICA6IHZlbG9jaXR5UGVyU2Vjb25kKGF4aXMuY3VycmVudCAtIHByZXYsIGVsYXBzZWQpO1xufVxuZnVuY3Rpb24gdXBkYXRlU2Nyb2xsSW5mbyhlbGVtZW50LCBpbmZvLCB0aW1lKSB7XG4gICAgdXBkYXRlQXhpc0luZm8oZWxlbWVudCwgXCJ4XCIsIGluZm8sIHRpbWUpO1xuICAgIHVwZGF0ZUF4aXNJbmZvKGVsZW1lbnQsIFwieVwiLCBpbmZvLCB0aW1lKTtcbiAgICBpbmZvLnRpbWUgPSB0aW1lO1xufVxuXG5leHBvcnQgeyBjcmVhdGVTY3JvbGxJbmZvLCB1cGRhdGVTY3JvbGxJbmZvIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmZvLm1qcy5tYXBcbiIsImltcG9ydCB7IGlzSFRNTEVsZW1lbnQgfSBmcm9tICdtb3Rpb24tZG9tJztcblxuZnVuY3Rpb24gY2FsY0luc2V0KGVsZW1lbnQsIGNvbnRhaW5lcikge1xuICAgIGNvbnN0IGluc2V0ID0geyB4OiAwLCB5OiAwIH07XG4gICAgbGV0IGN1cnJlbnQgPSBlbGVtZW50O1xuICAgIHdoaWxlIChjdXJyZW50ICYmIGN1cnJlbnQgIT09IGNvbnRhaW5lcikge1xuICAgICAgICBpZiAoaXNIVE1MRWxlbWVudChjdXJyZW50KSkge1xuICAgICAgICAgICAgaW5zZXQueCArPSBjdXJyZW50Lm9mZnNldExlZnQ7XG4gICAgICAgICAgICBpbnNldC55ICs9IGN1cnJlbnQub2Zmc2V0VG9wO1xuICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQub2Zmc2V0UGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGN1cnJlbnQudGFnTmFtZSA9PT0gXCJzdmdcIikge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGlzIGlzbid0IGFuIGlkZWFsIGFwcHJvYWNoIHRvIG1lYXN1cmluZyB0aGUgb2Zmc2V0IG9mIDxzdmcgLz4gdGFncy5cbiAgICAgICAgICAgICAqIEl0IHdvdWxkIGJlIHByZWZlcmFibGUsIGdpdmVuIHRoZXkgYmVoYXZlIGxpa2UgSFRNTEVsZW1lbnRzIGluIG1vc3Qgd2F5c1xuICAgICAgICAgICAgICogdG8gdXNlIG9mZnNldExlZnQvVG9wLiBCdXQgdGhlc2UgZG9uJ3QgZXhpc3Qgb24gPHN2ZyAvPi4gTGlrZXdpc2Ugd2VcbiAgICAgICAgICAgICAqIGNhbid0IHVzZSAuZ2V0QkJveCgpIGxpa2UgbW9zdCBTVkcgZWxlbWVudHMgYXMgdGhlc2UgcHJvdmlkZSB0aGUgb2Zmc2V0XG4gICAgICAgICAgICAgKiByZWxhdGl2ZSB0byB0aGUgU1ZHIGl0c2VsZiwgd2hpY2ggZm9yIDxzdmcgLz4gaXMgdXN1YWxseSAweDAuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHN2Z0JvdW5kaW5nQm94ID0gY3VycmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRCb3VuZGluZ0JveCA9IGN1cnJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBpbnNldC54ICs9IHN2Z0JvdW5kaW5nQm94LmxlZnQgLSBwYXJlbnRCb3VuZGluZ0JveC5sZWZ0O1xuICAgICAgICAgICAgaW5zZXQueSArPSBzdmdCb3VuZGluZ0JveC50b3AgLSBwYXJlbnRCb3VuZGluZ0JveC50b3A7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY3VycmVudCBpbnN0YW5jZW9mIFNWR0dyYXBoaWNzRWxlbWVudCkge1xuICAgICAgICAgICAgY29uc3QgeyB4LCB5IH0gPSBjdXJyZW50LmdldEJCb3goKTtcbiAgICAgICAgICAgIGluc2V0LnggKz0geDtcbiAgICAgICAgICAgIGluc2V0LnkgKz0geTtcbiAgICAgICAgICAgIGxldCBzdmcgPSBudWxsO1xuICAgICAgICAgICAgbGV0IHBhcmVudCA9IGN1cnJlbnQucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIHdoaWxlICghc3ZnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcmVudC50YWdOYW1lID09PSBcInN2Z1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHN2ZyA9IHBhcmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGFyZW50ID0gY3VycmVudC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudCA9IHN2ZztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbnNldDtcbn1cblxuZXhwb3J0IHsgY2FsY0luc2V0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbnNldC5tanMubWFwXG4iLCJjb25zdCBuYW1lZEVkZ2VzID0ge1xuICAgIHN0YXJ0OiAwLFxuICAgIGNlbnRlcjogMC41LFxuICAgIGVuZDogMSxcbn07XG5mdW5jdGlvbiByZXNvbHZlRWRnZShlZGdlLCBsZW5ndGgsIGluc2V0ID0gMCkge1xuICAgIGxldCBkZWx0YSA9IDA7XG4gICAgLyoqXG4gICAgICogSWYgd2UgaGF2ZSB0aGlzIGVkZ2UgZGVmaW5lZCBhcyBhIHByZXNldCwgcmVwbGFjZSB0aGUgZGVmaW5pdGlvblxuICAgICAqIHdpdGggdGhlIG51bWVyaWNhbCB2YWx1ZS5cbiAgICAgKi9cbiAgICBpZiAoZWRnZSBpbiBuYW1lZEVkZ2VzKSB7XG4gICAgICAgIGVkZ2UgPSBuYW1lZEVkZ2VzW2VkZ2VdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdW5pdCB2YWx1ZXNcbiAgICAgKi9cbiAgICBpZiAodHlwZW9mIGVkZ2UgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgY29uc3QgYXNOdW1iZXIgPSBwYXJzZUZsb2F0KGVkZ2UpO1xuICAgICAgICBpZiAoZWRnZS5lbmRzV2l0aChcInB4XCIpKSB7XG4gICAgICAgICAgICBkZWx0YSA9IGFzTnVtYmVyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGVkZ2UuZW5kc1dpdGgoXCIlXCIpKSB7XG4gICAgICAgICAgICBlZGdlID0gYXNOdW1iZXIgLyAxMDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZWRnZS5lbmRzV2l0aChcInZ3XCIpKSB7XG4gICAgICAgICAgICBkZWx0YSA9IChhc051bWJlciAvIDEwMCkgKiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZWRnZS5lbmRzV2l0aChcInZoXCIpKSB7XG4gICAgICAgICAgICBkZWx0YSA9IChhc051bWJlciAvIDEwMCkgKiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZWRnZSA9IGFzTnVtYmVyO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIElmIHRoZSBlZGdlIGlzIGRlZmluZWQgYXMgYSBudW1iZXIsIGhhbmRsZSBhcyBhIHByb2dyZXNzIHZhbHVlLlxuICAgICAqL1xuICAgIGlmICh0eXBlb2YgZWRnZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBkZWx0YSA9IGxlbmd0aCAqIGVkZ2U7XG4gICAgfVxuICAgIHJldHVybiBpbnNldCArIGRlbHRhO1xufVxuXG5leHBvcnQgeyBuYW1lZEVkZ2VzLCByZXNvbHZlRWRnZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZWRnZS5tanMubWFwXG4iLCJpbXBvcnQgeyByZXNvbHZlRWRnZSwgbmFtZWRFZGdlcyB9IGZyb20gJy4vZWRnZS5tanMnO1xuXG5jb25zdCBkZWZhdWx0T2Zmc2V0ID0gWzAsIDBdO1xuZnVuY3Rpb24gcmVzb2x2ZU9mZnNldChvZmZzZXQsIGNvbnRhaW5lckxlbmd0aCwgdGFyZ2V0TGVuZ3RoLCB0YXJnZXRJbnNldCkge1xuICAgIGxldCBvZmZzZXREZWZpbml0aW9uID0gQXJyYXkuaXNBcnJheShvZmZzZXQpID8gb2Zmc2V0IDogZGVmYXVsdE9mZnNldDtcbiAgICBsZXQgdGFyZ2V0UG9pbnQgPSAwO1xuICAgIGxldCBjb250YWluZXJQb2ludCA9IDA7XG4gICAgaWYgKHR5cGVvZiBvZmZzZXQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHdlJ3JlIHByb3ZpZGVkIG9mZnNldDogWzAsIDAuNSwgMV0gdGhlbiBlYWNoIG51bWJlciB4IHNob3VsZCBiZWNvbWVcbiAgICAgICAgICogW3gsIHhdLCBzbyB3ZSBkZWZhdWx0IHRvIHRoZSBiZWhhdmlvdXIgb2YgbWFwcGluZyAwID0+IDAgb2YgYm90aCB0YXJnZXRcbiAgICAgICAgICogYW5kIGNvbnRhaW5lciBldGMuXG4gICAgICAgICAqL1xuICAgICAgICBvZmZzZXREZWZpbml0aW9uID0gW29mZnNldCwgb2Zmc2V0XTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIG9mZnNldCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBvZmZzZXQgPSBvZmZzZXQudHJpbSgpO1xuICAgICAgICBpZiAob2Zmc2V0LmluY2x1ZGVzKFwiIFwiKSkge1xuICAgICAgICAgICAgb2Zmc2V0RGVmaW5pdGlvbiA9IG9mZnNldC5zcGxpdChcIiBcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHdlJ3JlIHByb3ZpZGVkIGEgZGVmaW5pdGlvbiBsaWtlIFwiMTAwcHhcIiB0aGVuIHdlIHdhbnQgdG8gYXBwbHlcbiAgICAgICAgICAgICAqIHRoYXQgb25seSB0byB0aGUgdG9wIG9mIHRoZSB0YXJnZXQgcG9pbnQsIGxlYXZpbmcgdGhlIGNvbnRhaW5lciBhdCAwLlxuICAgICAgICAgICAgICogV2hlcmVhcyBhIG5hbWVkIG9mZnNldCBsaWtlIFwiZW5kXCIgc2hvdWxkIGJlIGFwcGxpZWQgdG8gYm90aC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb2Zmc2V0RGVmaW5pdGlvbiA9IFtvZmZzZXQsIG5hbWVkRWRnZXNbb2Zmc2V0XSA/IG9mZnNldCA6IGAwYF07XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGFyZ2V0UG9pbnQgPSByZXNvbHZlRWRnZShvZmZzZXREZWZpbml0aW9uWzBdLCB0YXJnZXRMZW5ndGgsIHRhcmdldEluc2V0KTtcbiAgICBjb250YWluZXJQb2ludCA9IHJlc29sdmVFZGdlKG9mZnNldERlZmluaXRpb25bMV0sIGNvbnRhaW5lckxlbmd0aCk7XG4gICAgcmV0dXJuIHRhcmdldFBvaW50IC0gY29udGFpbmVyUG9pbnQ7XG59XG5cbmV4cG9ydCB7IHJlc29sdmVPZmZzZXQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9mZnNldC5tanMubWFwXG4iLCJjb25zdCBTY3JvbGxPZmZzZXQgPSB7XG4gICAgRW50ZXI6IFtcbiAgICAgICAgWzAsIDFdLFxuICAgICAgICBbMSwgMV0sXG4gICAgXSxcbiAgICBFeGl0OiBbXG4gICAgICAgIFswLCAwXSxcbiAgICAgICAgWzEsIDBdLFxuICAgIF0sXG4gICAgQW55OiBbXG4gICAgICAgIFsxLCAwXSxcbiAgICAgICAgWzAsIDFdLFxuICAgIF0sXG4gICAgQWxsOiBbXG4gICAgICAgIFswLCAwXSxcbiAgICAgICAgWzEsIDFdLFxuICAgIF0sXG59O1xuXG5leHBvcnQgeyBTY3JvbGxPZmZzZXQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXByZXNldHMubWpzLm1hcFxuIiwiaW1wb3J0IHsgaW50ZXJwb2xhdGUsIGRlZmF1bHRPZmZzZXQgfSBmcm9tICdtb3Rpb24tZG9tJztcbmltcG9ydCB7IGNsYW1wIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcbmltcG9ydCB7IGNhbGNJbnNldCB9IGZyb20gJy4vaW5zZXQubWpzJztcbmltcG9ydCB7IHJlc29sdmVPZmZzZXQgfSBmcm9tICcuL29mZnNldC5tanMnO1xuaW1wb3J0IHsgU2Nyb2xsT2Zmc2V0IH0gZnJvbSAnLi9wcmVzZXRzLm1qcyc7XG5cbmNvbnN0IHBvaW50ID0geyB4OiAwLCB5OiAwIH07XG5mdW5jdGlvbiBnZXRUYXJnZXRTaXplKHRhcmdldCkge1xuICAgIHJldHVybiBcImdldEJCb3hcIiBpbiB0YXJnZXQgJiYgdGFyZ2V0LnRhZ05hbWUgIT09IFwic3ZnXCJcbiAgICAgICAgPyB0YXJnZXQuZ2V0QkJveCgpXG4gICAgICAgIDogeyB3aWR0aDogdGFyZ2V0LmNsaWVudFdpZHRoLCBoZWlnaHQ6IHRhcmdldC5jbGllbnRIZWlnaHQgfTtcbn1cbmZ1bmN0aW9uIHJlc29sdmVPZmZzZXRzKGNvbnRhaW5lciwgaW5mbywgb3B0aW9ucykge1xuICAgIGNvbnN0IHsgb2Zmc2V0OiBvZmZzZXREZWZpbml0aW9uID0gU2Nyb2xsT2Zmc2V0LkFsbCB9ID0gb3B0aW9ucztcbiAgICBjb25zdCB7IHRhcmdldCA9IGNvbnRhaW5lciwgYXhpcyA9IFwieVwiIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IGxlbmd0aExhYmVsID0gYXhpcyA9PT0gXCJ5XCIgPyBcImhlaWdodFwiIDogXCJ3aWR0aFwiO1xuICAgIGNvbnN0IGluc2V0ID0gdGFyZ2V0ICE9PSBjb250YWluZXIgPyBjYWxjSW5zZXQodGFyZ2V0LCBjb250YWluZXIpIDogcG9pbnQ7XG4gICAgLyoqXG4gICAgICogTWVhc3VyZSB0aGUgdGFyZ2V0IGFuZCBjb250YWluZXIuIElmIHRoZXkncmUgdGhlIHNhbWUgdGhpbmcgdGhlbiB3ZVxuICAgICAqIHVzZSB0aGUgY29udGFpbmVyJ3Mgc2Nyb2xsV2lkdGgvSGVpZ2h0IGFzIHRoZSB0YXJnZXQsIGZyb20gdGhlcmVcbiAgICAgKiBhbGwgb3RoZXIgY2FsY3VsYXRpb25zIGNhbiByZW1haW4gdGhlIHNhbWUuXG4gICAgICovXG4gICAgY29uc3QgdGFyZ2V0U2l6ZSA9IHRhcmdldCA9PT0gY29udGFpbmVyXG4gICAgICAgID8geyB3aWR0aDogY29udGFpbmVyLnNjcm9sbFdpZHRoLCBoZWlnaHQ6IGNvbnRhaW5lci5zY3JvbGxIZWlnaHQgfVxuICAgICAgICA6IGdldFRhcmdldFNpemUodGFyZ2V0KTtcbiAgICBjb25zdCBjb250YWluZXJTaXplID0ge1xuICAgICAgICB3aWR0aDogY29udGFpbmVyLmNsaWVudFdpZHRoLFxuICAgICAgICBoZWlnaHQ6IGNvbnRhaW5lci5jbGllbnRIZWlnaHQsXG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXNldCB0aGUgbGVuZ3RoIG9mIHRoZSByZXNvbHZlZCBvZmZzZXQgYXJyYXkgcmF0aGVyIHRoYW4gY3JlYXRpbmcgYSBuZXcgb25lLlxuICAgICAqIFRPRE86IE1vcmUgcmV1c2FibGUgZGF0YSBzdHJ1Y3R1cmVzIGZvciB0YXJnZXRTaXplL2NvbnRhaW5lclNpemUgd291bGQgYWxzbyBiZSBnb29kLlxuICAgICAqL1xuICAgIGluZm9bYXhpc10ub2Zmc2V0Lmxlbmd0aCA9IDA7XG4gICAgLyoqXG4gICAgICogUG9wdWxhdGUgdGhlIG9mZnNldCBhcnJheSBieSByZXNvbHZpbmcgdGhlIHVzZXIncyBvZmZzZXQgZGVmaW5pdGlvbiBpbnRvXG4gICAgICogYSBsaXN0IG9mIHBpeGVsIHNjcm9sbCBvZmZldHMuXG4gICAgICovXG4gICAgbGV0IGhhc0NoYW5nZWQgPSAhaW5mb1theGlzXS5pbnRlcnBvbGF0ZTtcbiAgICBjb25zdCBudW1PZmZzZXRzID0gb2Zmc2V0RGVmaW5pdGlvbi5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1PZmZzZXRzOyBpKyspIHtcbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gcmVzb2x2ZU9mZnNldChvZmZzZXREZWZpbml0aW9uW2ldLCBjb250YWluZXJTaXplW2xlbmd0aExhYmVsXSwgdGFyZ2V0U2l6ZVtsZW5ndGhMYWJlbF0sIGluc2V0W2F4aXNdKTtcbiAgICAgICAgaWYgKCFoYXNDaGFuZ2VkICYmIG9mZnNldCAhPT0gaW5mb1theGlzXS5pbnRlcnBvbGF0b3JPZmZzZXRzW2ldKSB7XG4gICAgICAgICAgICBoYXNDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpbmZvW2F4aXNdLm9mZnNldFtpXSA9IG9mZnNldDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSWYgdGhlIHBpeGVsIHNjcm9sbCBvZmZzZXRzIGhhdmUgY2hhbmdlZCwgY3JlYXRlIGEgbmV3IGludGVycG9sYXRvciBmdW5jdGlvblxuICAgICAqIHRvIG1hcCBzY3JvbGwgdmFsdWUgaW50byBhIHByb2dyZXNzLlxuICAgICAqL1xuICAgIGlmIChoYXNDaGFuZ2VkKSB7XG4gICAgICAgIGluZm9bYXhpc10uaW50ZXJwb2xhdGUgPSBpbnRlcnBvbGF0ZShpbmZvW2F4aXNdLm9mZnNldCwgZGVmYXVsdE9mZnNldChvZmZzZXREZWZpbml0aW9uKSwgeyBjbGFtcDogZmFsc2UgfSk7XG4gICAgICAgIGluZm9bYXhpc10uaW50ZXJwb2xhdG9yT2Zmc2V0cyA9IFsuLi5pbmZvW2F4aXNdLm9mZnNldF07XG4gICAgfVxuICAgIGluZm9bYXhpc10ucHJvZ3Jlc3MgPSBjbGFtcCgwLCAxLCBpbmZvW2F4aXNdLmludGVycG9sYXRlKGluZm9bYXhpc10uY3VycmVudCkpO1xufVxuXG5leHBvcnQgeyByZXNvbHZlT2Zmc2V0cyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXgubWpzLm1hcFxuIiwiaW1wb3J0IHsgd2Fybk9uY2UgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgdXBkYXRlU2Nyb2xsSW5mbyB9IGZyb20gJy4vaW5mby5tanMnO1xuaW1wb3J0IHsgcmVzb2x2ZU9mZnNldHMgfSBmcm9tICcuL29mZnNldHMvaW5kZXgubWpzJztcblxuZnVuY3Rpb24gbWVhc3VyZShjb250YWluZXIsIHRhcmdldCA9IGNvbnRhaW5lciwgaW5mbykge1xuICAgIC8qKlxuICAgICAqIEZpbmQgaW5zZXQgb2YgdGFyZ2V0IHdpdGhpbiBzY3JvbGxhYmxlIGNvbnRhaW5lclxuICAgICAqL1xuICAgIGluZm8ueC50YXJnZXRPZmZzZXQgPSAwO1xuICAgIGluZm8ueS50YXJnZXRPZmZzZXQgPSAwO1xuICAgIGlmICh0YXJnZXQgIT09IGNvbnRhaW5lcikge1xuICAgICAgICBsZXQgbm9kZSA9IHRhcmdldDtcbiAgICAgICAgd2hpbGUgKG5vZGUgJiYgbm9kZSAhPT0gY29udGFpbmVyKSB7XG4gICAgICAgICAgICBpbmZvLngudGFyZ2V0T2Zmc2V0ICs9IG5vZGUub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIGluZm8ueS50YXJnZXRPZmZzZXQgKz0gbm9kZS5vZmZzZXRUb3A7XG4gICAgICAgICAgICBub2RlID0gbm9kZS5vZmZzZXRQYXJlbnQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaW5mby54LnRhcmdldExlbmd0aCA9XG4gICAgICAgIHRhcmdldCA9PT0gY29udGFpbmVyID8gdGFyZ2V0LnNjcm9sbFdpZHRoIDogdGFyZ2V0LmNsaWVudFdpZHRoO1xuICAgIGluZm8ueS50YXJnZXRMZW5ndGggPVxuICAgICAgICB0YXJnZXQgPT09IGNvbnRhaW5lciA/IHRhcmdldC5zY3JvbGxIZWlnaHQgOiB0YXJnZXQuY2xpZW50SGVpZ2h0O1xuICAgIGluZm8ueC5jb250YWluZXJMZW5ndGggPSBjb250YWluZXIuY2xpZW50V2lkdGg7XG4gICAgaW5mby55LmNvbnRhaW5lckxlbmd0aCA9IGNvbnRhaW5lci5jbGllbnRIZWlnaHQ7XG4gICAgLyoqXG4gICAgICogSW4gZGV2ZWxvcG1lbnQgbW9kZSBlbnN1cmUgc2Nyb2xsIGNvbnRhaW5lcnMgYXJlbid0IHBvc2l0aW9uOiBzdGF0aWMgYXMgdGhpcyBtYWtlc1xuICAgICAqIGl0IGRpZmZpY3VsdCB0byBtZWFzdXJlIHRoZWlyIHJlbGF0aXZlIHBvc2l0aW9ucy5cbiAgICAgKi9cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgIGlmIChjb250YWluZXIgJiYgdGFyZ2V0ICYmIHRhcmdldCAhPT0gY29udGFpbmVyKSB7XG4gICAgICAgICAgICB3YXJuT25jZShnZXRDb21wdXRlZFN0eWxlKGNvbnRhaW5lcikucG9zaXRpb24gIT09IFwic3RhdGljXCIsIFwiUGxlYXNlIGVuc3VyZSB0aGF0IHRoZSBjb250YWluZXIgaGFzIGEgbm9uLXN0YXRpYyBwb3NpdGlvbiwgbGlrZSAncmVsYXRpdmUnLCAnZml4ZWQnLCBvciAnYWJzb2x1dGUnIHRvIGVuc3VyZSBzY3JvbGwgb2Zmc2V0IGlzIGNhbGN1bGF0ZWQgY29ycmVjdGx5LlwiKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIGNyZWF0ZU9uU2Nyb2xsSGFuZGxlcihlbGVtZW50LCBvblNjcm9sbCwgaW5mbywgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbWVhc3VyZTogKHRpbWUpID0+IHtcbiAgICAgICAgICAgIG1lYXN1cmUoZWxlbWVudCwgb3B0aW9ucy50YXJnZXQsIGluZm8pO1xuICAgICAgICAgICAgdXBkYXRlU2Nyb2xsSW5mbyhlbGVtZW50LCBpbmZvLCB0aW1lKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLm9mZnNldCB8fCBvcHRpb25zLnRhcmdldCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmVPZmZzZXRzKGVsZW1lbnQsIGluZm8sIG9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBub3RpZnk6ICgpID0+IG9uU2Nyb2xsKGluZm8pLFxuICAgIH07XG59XG5cbmV4cG9ydCB7IGNyZWF0ZU9uU2Nyb2xsSGFuZGxlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b24tc2Nyb2xsLWhhbmRsZXIubWpzLm1hcFxuIiwiaW1wb3J0IHsgcmVzaXplLCBmcmFtZSwgY2FuY2VsRnJhbWUsIGZyYW1lRGF0YSB9IGZyb20gJ21vdGlvbi1kb20nO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBjcmVhdGVTY3JvbGxJbmZvIH0gZnJvbSAnLi9pbmZvLm1qcyc7XG5pbXBvcnQgeyBjcmVhdGVPblNjcm9sbEhhbmRsZXIgfSBmcm9tICcuL29uLXNjcm9sbC1oYW5kbGVyLm1qcyc7XG5cbmNvbnN0IHNjcm9sbExpc3RlbmVycyA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCByZXNpemVMaXN0ZW5lcnMgPSBuZXcgV2Vha01hcCgpO1xuY29uc3Qgb25TY3JvbGxIYW5kbGVycyA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCBzY3JvbGxTaXplID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IGRpbWVuc2lvbkNoZWNrUHJvY2Vzc2VzID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IGdldEV2ZW50VGFyZ2V0ID0gKGVsZW1lbnQpID0+IGVsZW1lbnQgPT09IGRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQgPyB3aW5kb3cgOiBlbGVtZW50O1xuZnVuY3Rpb24gc2Nyb2xsSW5mbyhvblNjcm9sbCwgeyBjb250YWluZXIgPSBkb2N1bWVudC5zY3JvbGxpbmdFbGVtZW50LCB0cmFja0NvbnRlbnRTaXplID0gZmFsc2UsIC4uLm9wdGlvbnMgfSA9IHt9KSB7XG4gICAgaWYgKCFjb250YWluZXIpXG4gICAgICAgIHJldHVybiBub29wO1xuICAgIGxldCBjb250YWluZXJIYW5kbGVycyA9IG9uU2Nyb2xsSGFuZGxlcnMuZ2V0KGNvbnRhaW5lcik7XG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBvblNjcm9sbCBoYW5kbGVycyBmb3IgdGhpcyBjb250YWluZXIuXG4gICAgICogSWYgb25lIGlzbid0IGZvdW5kLCBjcmVhdGUgYSBuZXcgb25lLlxuICAgICAqL1xuICAgIGlmICghY29udGFpbmVySGFuZGxlcnMpIHtcbiAgICAgICAgY29udGFpbmVySGFuZGxlcnMgPSBuZXcgU2V0KCk7XG4gICAgICAgIG9uU2Nyb2xsSGFuZGxlcnMuc2V0KGNvbnRhaW5lciwgY29udGFpbmVySGFuZGxlcnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgb25TY3JvbGwgaGFuZGxlciBmb3IgdGhlIHByb3ZpZGVkIGNhbGxiYWNrLlxuICAgICAqL1xuICAgIGNvbnN0IGluZm8gPSBjcmVhdGVTY3JvbGxJbmZvKCk7XG4gICAgY29uc3QgY29udGFpbmVySGFuZGxlciA9IGNyZWF0ZU9uU2Nyb2xsSGFuZGxlcihjb250YWluZXIsIG9uU2Nyb2xsLCBpbmZvLCBvcHRpb25zKTtcbiAgICBjb250YWluZXJIYW5kbGVycy5hZGQoY29udGFpbmVySGFuZGxlcik7XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlcmUncyBhIHNjcm9sbCBldmVudCBsaXN0ZW5lciBmb3IgdGhpcyBjb250YWluZXIuXG4gICAgICogSWYgbm90LCBjcmVhdGUgb25lLlxuICAgICAqL1xuICAgIGlmICghc2Nyb2xsTGlzdGVuZXJzLmhhcyhjb250YWluZXIpKSB7XG4gICAgICAgIGNvbnN0IG1lYXN1cmVBbGwgPSAoKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGhhbmRsZXIgb2YgY29udGFpbmVySGFuZGxlcnMpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyLm1lYXN1cmUoZnJhbWVEYXRhLnRpbWVzdGFtcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmcmFtZS5wcmVVcGRhdGUobm90aWZ5QWxsKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgbm90aWZ5QWxsID0gKCkgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCBoYW5kbGVyIG9mIGNvbnRhaW5lckhhbmRsZXJzKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlci5ub3RpZnkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgbGlzdGVuZXIgPSAoKSA9PiBmcmFtZS5yZWFkKG1lYXN1cmVBbGwpO1xuICAgICAgICBzY3JvbGxMaXN0ZW5lcnMuc2V0KGNvbnRhaW5lciwgbGlzdGVuZXIpO1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBnZXRFdmVudFRhcmdldChjb250YWluZXIpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBsaXN0ZW5lcik7XG4gICAgICAgIGlmIChjb250YWluZXIgIT09IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuICAgICAgICAgICAgcmVzaXplTGlzdGVuZXJzLnNldChjb250YWluZXIsIHJlc2l6ZShjb250YWluZXIsIGxpc3RlbmVyKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgbGlzdGVuZXIpO1xuICAgICAgICBsaXN0ZW5lcigpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFbmFibGUgY29udGVudCBzaXplIHRyYWNraW5nIGlmIHJlcXVlc3RlZCBhbmQgbm90IGFscmVhZHkgZW5hYmxlZC5cbiAgICAgKi9cbiAgICBpZiAodHJhY2tDb250ZW50U2l6ZSAmJiAhZGltZW5zaW9uQ2hlY2tQcm9jZXNzZXMuaGFzKGNvbnRhaW5lcikpIHtcbiAgICAgICAgY29uc3QgbGlzdGVuZXIgPSBzY3JvbGxMaXN0ZW5lcnMuZ2V0KGNvbnRhaW5lcik7XG4gICAgICAgIC8vIFN0b3JlIGluaXRpYWwgc2Nyb2xsIGRpbWVuc2lvbnMgKG9iamVjdCBpcyByZXVzZWQgdG8gYXZvaWQgYWxsb2NhdGlvbilcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHtcbiAgICAgICAgICAgIHdpZHRoOiBjb250YWluZXIuc2Nyb2xsV2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGNvbnRhaW5lci5zY3JvbGxIZWlnaHQsXG4gICAgICAgIH07XG4gICAgICAgIHNjcm9sbFNpemUuc2V0KGNvbnRhaW5lciwgc2l6ZSk7XG4gICAgICAgIC8vIEFkZCBmcmFtZS1iYXNlZCBzY3JvbGwgZGltZW5zaW9uIGNoZWNraW5nIHRvIGRldGVjdCBjb250ZW50IGNoYW5nZXNcbiAgICAgICAgY29uc3QgY2hlY2tTY3JvbGxEaW1lbnNpb25zID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV3V2lkdGggPSBjb250YWluZXIuc2Nyb2xsV2lkdGg7XG4gICAgICAgICAgICBjb25zdCBuZXdIZWlnaHQgPSBjb250YWluZXIuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICAgICAgaWYgKHNpemUud2lkdGggIT09IG5ld1dpZHRoIHx8IHNpemUuaGVpZ2h0ICE9PSBuZXdIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgIHNpemUud2lkdGggPSBuZXdXaWR0aDtcbiAgICAgICAgICAgICAgICBzaXplLmhlaWdodCA9IG5ld0hlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLy8gU2NoZWR1bGUgd2l0aCBrZWVwQWxpdmU9dHJ1ZSB0byBydW4gZXZlcnkgZnJhbWVcbiAgICAgICAgY29uc3QgZGltZW5zaW9uQ2hlY2tQcm9jZXNzID0gZnJhbWUucmVhZChjaGVja1Njcm9sbERpbWVuc2lvbnMsIHRydWUpO1xuICAgICAgICBkaW1lbnNpb25DaGVja1Byb2Nlc3Nlcy5zZXQoY29udGFpbmVyLCBkaW1lbnNpb25DaGVja1Byb2Nlc3MpO1xuICAgIH1cbiAgICBjb25zdCBsaXN0ZW5lciA9IHNjcm9sbExpc3RlbmVycy5nZXQoY29udGFpbmVyKTtcbiAgICBmcmFtZS5yZWFkKGxpc3RlbmVyLCBmYWxzZSwgdHJ1ZSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgY2FuY2VsRnJhbWUobGlzdGVuZXIpO1xuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2sgaWYgd2UgZXZlbiBoYXZlIGFueSBoYW5kbGVycyBmb3IgdGhpcyBjb250YWluZXIuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBjdXJyZW50SGFuZGxlcnMgPSBvblNjcm9sbEhhbmRsZXJzLmdldChjb250YWluZXIpO1xuICAgICAgICBpZiAoIWN1cnJlbnRIYW5kbGVycylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY3VycmVudEhhbmRsZXJzLmRlbGV0ZShjb250YWluZXJIYW5kbGVyKTtcbiAgICAgICAgaWYgKGN1cnJlbnRIYW5kbGVycy5zaXplKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgbm8gbW9yZSBoYW5kbGVycywgcmVtb3ZlIHRoZSBzY3JvbGwgbGlzdGVuZXIgdG9vLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgc2Nyb2xsTGlzdGVuZXIgPSBzY3JvbGxMaXN0ZW5lcnMuZ2V0KGNvbnRhaW5lcik7XG4gICAgICAgIHNjcm9sbExpc3RlbmVycy5kZWxldGUoY29udGFpbmVyKTtcbiAgICAgICAgaWYgKHNjcm9sbExpc3RlbmVyKSB7XG4gICAgICAgICAgICBnZXRFdmVudFRhcmdldChjb250YWluZXIpLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgc2Nyb2xsTGlzdGVuZXIpO1xuICAgICAgICAgICAgcmVzaXplTGlzdGVuZXJzLmdldChjb250YWluZXIpPy4oKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHNjcm9sbExpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDbGVhbiB1cCBzY3JvbGwgZGltZW5zaW9uIGNoZWNraW5nXG4gICAgICAgIGNvbnN0IGRpbWVuc2lvbkNoZWNrUHJvY2VzcyA9IGRpbWVuc2lvbkNoZWNrUHJvY2Vzc2VzLmdldChjb250YWluZXIpO1xuICAgICAgICBpZiAoZGltZW5zaW9uQ2hlY2tQcm9jZXNzKSB7XG4gICAgICAgICAgICBjYW5jZWxGcmFtZShkaW1lbnNpb25DaGVja1Byb2Nlc3MpO1xuICAgICAgICAgICAgZGltZW5zaW9uQ2hlY2tQcm9jZXNzZXMuZGVsZXRlKGNvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgc2Nyb2xsU2l6ZS5kZWxldGUoY29udGFpbmVyKTtcbiAgICB9O1xufVxuXG5leHBvcnQgeyBzY3JvbGxJbmZvIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD10cmFjay5tanMubWFwXG4iLCJpbXBvcnQgeyBTY3JvbGxPZmZzZXQgfSBmcm9tICcuLi9vZmZzZXRzL3ByZXNldHMubWpzJztcblxuLyoqXG4gKiBNYXBzIGZyb20gUHJvZ3Jlc3NJbnRlcnNlY3Rpb24gcGFpcnMgdXNlZCBieSBNb3Rpb24ncyBwcmVzZXQgb2Zmc2V0cyB0b1xuICogVmlld1RpbWVsaW5lIG5hbWVkIHJhbmdlcy4gUmV0dXJucyB1bmRlZmluZWQgZm9yIHVucmVjb2duaXNlZCBwYXR0ZXJucyxcbiAqIHdoaWNoIHNpZ25hbHMgdGhlIGNhbGxlciB0byBmYWxsIGJhY2sgdG8gSlMtYmFzZWQgc2Nyb2xsIHRyYWNraW5nLlxuICovXG5jb25zdCBwcmVzZXRzID0gW1xuICAgIFtTY3JvbGxPZmZzZXQuRW50ZXIsIFwiZW50cnlcIl0sXG4gICAgW1Njcm9sbE9mZnNldC5FeGl0LCBcImV4aXRcIl0sXG4gICAgW1Njcm9sbE9mZnNldC5BbnksIFwiY292ZXJcIl0sXG4gICAgW1Njcm9sbE9mZnNldC5BbGwsIFwiY29udGFpblwiXSxcbl07XG5mdW5jdGlvbiBtYXRjaGVzUHJlc2V0KG9mZnNldCwgcHJlc2V0KSB7XG4gICAgaWYgKG9mZnNldC5sZW5ndGggIT09IDIpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgICAgICBjb25zdCBvID0gb2Zmc2V0W2ldO1xuICAgICAgICBjb25zdCBwID0gcHJlc2V0W2ldO1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkobykgfHxcbiAgICAgICAgICAgIG8ubGVuZ3RoICE9PSAyIHx8XG4gICAgICAgICAgICBvWzBdICE9PSBwWzBdIHx8XG4gICAgICAgICAgICBvWzFdICE9PSBwWzFdKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmZ1bmN0aW9uIG9mZnNldFRvVmlld1RpbWVsaW5lUmFuZ2Uob2Zmc2V0KSB7XG4gICAgaWYgKCFvZmZzZXQpIHtcbiAgICAgICAgcmV0dXJuIHsgcmFuZ2VTdGFydDogXCJjb250YWluIDAlXCIsIHJhbmdlRW5kOiBcImNvbnRhaW4gMTAwJVwiIH07XG4gICAgfVxuICAgIGZvciAoY29uc3QgW3ByZXNldCwgbmFtZV0gb2YgcHJlc2V0cykge1xuICAgICAgICBpZiAobWF0Y2hlc1ByZXNldChvZmZzZXQsIHByZXNldCkpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHJhbmdlU3RhcnQ6IGAke25hbWV9IDAlYCwgcmFuZ2VFbmQ6IGAke25hbWV9IDEwMCVgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IHsgb2Zmc2V0VG9WaWV3VGltZWxpbmVSYW5nZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b2Zmc2V0LXRvLXJhbmdlLm1qcy5tYXBcbiIsImltcG9ydCB7IHNjcm9sbEluZm8gfSBmcm9tICcuLi90cmFjay5tanMnO1xuaW1wb3J0IHsgY2FuVXNlTmF0aXZlVGltZWxpbmUgfSBmcm9tICcuL2Nhbi11c2UtbmF0aXZlLXRpbWVsaW5lLm1qcyc7XG5pbXBvcnQgeyBvZmZzZXRUb1ZpZXdUaW1lbGluZVJhbmdlIH0gZnJvbSAnLi9vZmZzZXQtdG8tcmFuZ2UubWpzJztcblxuY29uc3QgdGltZWxpbmVDYWNoZSA9IG5ldyBNYXAoKTtcbmZ1bmN0aW9uIHNjcm9sbFRpbWVsaW5lRmFsbGJhY2sob3B0aW9ucykge1xuICAgIGNvbnN0IGN1cnJlbnRUaW1lID0geyB2YWx1ZTogMCB9O1xuICAgIGNvbnN0IGNhbmNlbCA9IHNjcm9sbEluZm8oKGluZm8pID0+IHtcbiAgICAgICAgY3VycmVudFRpbWUudmFsdWUgPSBpbmZvW29wdGlvbnMuYXhpc10ucHJvZ3Jlc3MgKiAxMDA7XG4gICAgfSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHsgY3VycmVudFRpbWUsIGNhbmNlbCB9O1xufVxuZnVuY3Rpb24gZ2V0VGltZWxpbmUoeyBzb3VyY2UsIGNvbnRhaW5lciwgLi4ub3B0aW9ucyB9KSB7XG4gICAgY29uc3QgeyBheGlzIH0gPSBvcHRpb25zO1xuICAgIGlmIChzb3VyY2UpXG4gICAgICAgIGNvbnRhaW5lciA9IHNvdXJjZTtcbiAgICBsZXQgY29udGFpbmVyQ2FjaGUgPSB0aW1lbGluZUNhY2hlLmdldChjb250YWluZXIpO1xuICAgIGlmICghY29udGFpbmVyQ2FjaGUpIHtcbiAgICAgICAgY29udGFpbmVyQ2FjaGUgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRpbWVsaW5lQ2FjaGUuc2V0KGNvbnRhaW5lciwgY29udGFpbmVyQ2FjaGUpO1xuICAgIH1cbiAgICBjb25zdCB0YXJnZXRLZXkgPSBvcHRpb25zLnRhcmdldCA/PyBcInNlbGZcIjtcbiAgICBsZXQgdGFyZ2V0Q2FjaGUgPSBjb250YWluZXJDYWNoZS5nZXQodGFyZ2V0S2V5KTtcbiAgICBpZiAoIXRhcmdldENhY2hlKSB7XG4gICAgICAgIHRhcmdldENhY2hlID0ge307XG4gICAgICAgIGNvbnRhaW5lckNhY2hlLnNldCh0YXJnZXRLZXksIHRhcmdldENhY2hlKTtcbiAgICB9XG4gICAgY29uc3QgYXhpc0tleSA9IGF4aXMgKyAob3B0aW9ucy5vZmZzZXQgPz8gW10pLmpvaW4oXCIsXCIpO1xuICAgIGlmICghdGFyZ2V0Q2FjaGVbYXhpc0tleV0pIHtcbiAgICAgICAgaWYgKG9wdGlvbnMudGFyZ2V0ICYmIGNhblVzZU5hdGl2ZVRpbWVsaW5lKG9wdGlvbnMudGFyZ2V0KSkge1xuICAgICAgICAgICAgY29uc3QgcmFuZ2UgPSBvZmZzZXRUb1ZpZXdUaW1lbGluZVJhbmdlKG9wdGlvbnMub2Zmc2V0KTtcbiAgICAgICAgICAgIGlmIChyYW5nZSkge1xuICAgICAgICAgICAgICAgIHRhcmdldENhY2hlW2F4aXNLZXldID0gbmV3IFZpZXdUaW1lbGluZSh7XG4gICAgICAgICAgICAgICAgICAgIHN1YmplY3Q6IG9wdGlvbnMudGFyZ2V0LFxuICAgICAgICAgICAgICAgICAgICBheGlzLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0Q2FjaGVbYXhpc0tleV0gPSBzY3JvbGxUaW1lbGluZUZhbGxiYWNrKHtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNhblVzZU5hdGl2ZVRpbWVsaW5lKCkpIHtcbiAgICAgICAgICAgIHRhcmdldENhY2hlW2F4aXNLZXldID0gbmV3IFNjcm9sbFRpbWVsaW5lKHtcbiAgICAgICAgICAgICAgICBzb3VyY2U6IGNvbnRhaW5lcixcbiAgICAgICAgICAgICAgICBheGlzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXRDYWNoZVtheGlzS2V5XSA9IHNjcm9sbFRpbWVsaW5lRmFsbGJhY2soe1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldENhY2hlW2F4aXNLZXldO1xufVxuXG5leHBvcnQgeyBnZXRUaW1lbGluZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2V0LXRpbWVsaW5lLm1qcy5tYXBcbiIsImltcG9ydCB7IG9ic2VydmVUaW1lbGluZSB9IGZyb20gJ21vdGlvbi1kb20nO1xuaW1wb3J0IHsgY2FuVXNlTmF0aXZlVGltZWxpbmUgfSBmcm9tICcuL3V0aWxzL2Nhbi11c2UtbmF0aXZlLXRpbWVsaW5lLm1qcyc7XG5pbXBvcnQgeyBnZXRUaW1lbGluZSB9IGZyb20gJy4vdXRpbHMvZ2V0LXRpbWVsaW5lLm1qcyc7XG5pbXBvcnQgeyBvZmZzZXRUb1ZpZXdUaW1lbGluZVJhbmdlIH0gZnJvbSAnLi91dGlscy9vZmZzZXQtdG8tcmFuZ2UubWpzJztcblxuZnVuY3Rpb24gYXR0YWNoVG9BbmltYXRpb24oYW5pbWF0aW9uLCBvcHRpb25zKSB7XG4gICAgY29uc3QgdGltZWxpbmUgPSBnZXRUaW1lbGluZShvcHRpb25zKTtcbiAgICBjb25zdCByYW5nZSA9IG9wdGlvbnMudGFyZ2V0XG4gICAgICAgID8gb2Zmc2V0VG9WaWV3VGltZWxpbmVSYW5nZShvcHRpb25zLm9mZnNldClcbiAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgLyoqXG4gICAgICogVXNlIG5hdGl2ZSB0aW1lbGluZSB3aGVuOlxuICAgICAqIC0gTm8gdGFyZ2V0OiBTY3JvbGxUaW1lbGluZSAoZXhpc3RpbmcgYmVoYXZpb3VyKVxuICAgICAqIC0gVGFyZ2V0IHdpdGggbWFwcGFibGUgb2Zmc2V0OiBWaWV3VGltZWxpbmUgd2l0aCBuYW1lZCByYW5nZVxuICAgICAqIC0gVGFyZ2V0IHdpdGggdW5tYXBwYWJsZSBvZmZzZXQ6IGZhbGwgYmFjayB0byBKUyBvYnNlcnZlXG4gICAgICovXG4gICAgY29uc3QgdXNlTmF0aXZlID0gb3B0aW9ucy50YXJnZXRcbiAgICAgICAgPyBjYW5Vc2VOYXRpdmVUaW1lbGluZShvcHRpb25zLnRhcmdldCkgJiYgISFyYW5nZVxuICAgICAgICA6IGNhblVzZU5hdGl2ZVRpbWVsaW5lKCk7XG4gICAgcmV0dXJuIGFuaW1hdGlvbi5hdHRhY2hUaW1lbGluZSh7XG4gICAgICAgIHRpbWVsaW5lOiB1c2VOYXRpdmUgPyB0aW1lbGluZSA6IHVuZGVmaW5lZCxcbiAgICAgICAgLi4uKHJhbmdlICYmXG4gICAgICAgICAgICB1c2VOYXRpdmUgJiYge1xuICAgICAgICAgICAgcmFuZ2VTdGFydDogcmFuZ2UucmFuZ2VTdGFydCxcbiAgICAgICAgICAgIHJhbmdlRW5kOiByYW5nZS5yYW5nZUVuZCxcbiAgICAgICAgfSksXG4gICAgICAgIG9ic2VydmU6ICh2YWx1ZUFuaW1hdGlvbikgPT4ge1xuICAgICAgICAgICAgdmFsdWVBbmltYXRpb24ucGF1c2UoKTtcbiAgICAgICAgICAgIHJldHVybiBvYnNlcnZlVGltZWxpbmUoKHByb2dyZXNzKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFsdWVBbmltYXRpb24udGltZSA9XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlQW5pbWF0aW9uLml0ZXJhdGlvbkR1cmF0aW9uICogcHJvZ3Jlc3M7XG4gICAgICAgICAgICB9LCB0aW1lbGluZSk7XG4gICAgICAgIH0sXG4gICAgfSk7XG59XG5cbmV4cG9ydCB7IGF0dGFjaFRvQW5pbWF0aW9uIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hdHRhY2gtYW5pbWF0aW9uLm1qcy5tYXBcbiIsImltcG9ydCB7IG9ic2VydmVUaW1lbGluZSB9IGZyb20gJ21vdGlvbi1kb20nO1xuaW1wb3J0IHsgc2Nyb2xsSW5mbyB9IGZyb20gJy4vdHJhY2subWpzJztcbmltcG9ydCB7IGdldFRpbWVsaW5lIH0gZnJvbSAnLi91dGlscy9nZXQtdGltZWxpbmUubWpzJztcblxuLyoqXG4gKiBJZiB0aGUgb25TY3JvbGwgZnVuY3Rpb24gaGFzIHR3byBhcmd1bWVudHMsIGl0J3MgZXhwZWN0aW5nXG4gKiBtb3JlIHNwZWNpZmljIGluZm9ybWF0aW9uIGFib3V0IHRoZSBzY3JvbGwgZnJvbSBzY3JvbGxJbmZvLlxuICovXG5mdW5jdGlvbiBpc09uU2Nyb2xsV2l0aEluZm8ob25TY3JvbGwpIHtcbiAgICByZXR1cm4gb25TY3JvbGwubGVuZ3RoID09PSAyO1xufVxuZnVuY3Rpb24gYXR0YWNoVG9GdW5jdGlvbihvblNjcm9sbCwgb3B0aW9ucykge1xuICAgIGlmIChpc09uU2Nyb2xsV2l0aEluZm8ob25TY3JvbGwpKSB7XG4gICAgICAgIHJldHVybiBzY3JvbGxJbmZvKChpbmZvKSA9PiB7XG4gICAgICAgICAgICBvblNjcm9sbChpbmZvW29wdGlvbnMuYXhpc10ucHJvZ3Jlc3MsIGluZm8pO1xuICAgICAgICB9LCBvcHRpb25zKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBvYnNlcnZlVGltZWxpbmUob25TY3JvbGwsIGdldFRpbWVsaW5lKG9wdGlvbnMpKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IGF0dGFjaFRvRnVuY3Rpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWF0dGFjaC1mdW5jdGlvbi5tanMubWFwXG4iLCJpbXBvcnQgeyBub29wIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcbmltcG9ydCB7IGF0dGFjaFRvQW5pbWF0aW9uIH0gZnJvbSAnLi9hdHRhY2gtYW5pbWF0aW9uLm1qcyc7XG5pbXBvcnQgeyBhdHRhY2hUb0Z1bmN0aW9uIH0gZnJvbSAnLi9hdHRhY2gtZnVuY3Rpb24ubWpzJztcblxuZnVuY3Rpb24gc2Nyb2xsKG9uU2Nyb2xsLCB7IGF4aXMgPSBcInlcIiwgY29udGFpbmVyID0gZG9jdW1lbnQuc2Nyb2xsaW5nRWxlbWVudCwgLi4ub3B0aW9ucyB9ID0ge30pIHtcbiAgICBpZiAoIWNvbnRhaW5lcilcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgY29uc3Qgb3B0aW9uc1dpdGhEZWZhdWx0cyA9IHsgYXhpcywgY29udGFpbmVyLCAuLi5vcHRpb25zIH07XG4gICAgcmV0dXJuIHR5cGVvZiBvblNjcm9sbCA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgID8gYXR0YWNoVG9GdW5jdGlvbihvblNjcm9sbCwgb3B0aW9uc1dpdGhEZWZhdWx0cylcbiAgICAgICAgOiBhdHRhY2hUb0FuaW1hdGlvbihvblNjcm9sbCwgb3B0aW9uc1dpdGhEZWZhdWx0cyk7XG59XG5cbmV4cG9ydCB7IHNjcm9sbCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXgubWpzLm1hcFxuIiwiaW1wb3J0IHsgcmVzb2x2ZUVsZW1lbnRzIH0gZnJvbSAnbW90aW9uLWRvbSc7XG5cbmNvbnN0IHRocmVzaG9sZHMgPSB7XG4gICAgc29tZTogMCxcbiAgICBhbGw6IDEsXG59O1xuZnVuY3Rpb24gaW5WaWV3KGVsZW1lbnRPclNlbGVjdG9yLCBvblN0YXJ0LCB7IHJvb3QsIG1hcmdpbjogcm9vdE1hcmdpbiwgYW1vdW50ID0gXCJzb21lXCIgfSA9IHt9KSB7XG4gICAgY29uc3QgZWxlbWVudHMgPSByZXNvbHZlRWxlbWVudHMoZWxlbWVudE9yU2VsZWN0b3IpO1xuICAgIGNvbnN0IGFjdGl2ZUludGVyc2VjdGlvbnMgPSBuZXcgV2Vha01hcCgpO1xuICAgIGNvbnN0IG9uSW50ZXJzZWN0aW9uQ2hhbmdlID0gKGVudHJpZXMpID0+IHtcbiAgICAgICAgZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb25FbmQgPSBhY3RpdmVJbnRlcnNlY3Rpb25zLmdldChlbnRyeS50YXJnZXQpO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiB0aGVyZSdzIG5vIGNoYW5nZSB0byB0aGUgaW50ZXJzZWN0aW9uLCB3ZSBkb24ndCBuZWVkIHRvXG4gICAgICAgICAgICAgKiBkbyBhbnl0aGluZyBoZXJlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoZW50cnkuaXNJbnRlcnNlY3RpbmcgPT09IEJvb2xlYW4ob25FbmQpKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGlmIChlbnRyeS5pc0ludGVyc2VjdGluZykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld09uRW5kID0gb25TdGFydChlbnRyeS50YXJnZXQsIGVudHJ5KTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG5ld09uRW5kID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlSW50ZXJzZWN0aW9ucy5zZXQoZW50cnkudGFyZ2V0LCBuZXdPbkVuZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci51bm9ic2VydmUoZW50cnkudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb25FbmQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIG9uRW5kKGVudHJ5KTtcbiAgICAgICAgICAgICAgICBhY3RpdmVJbnRlcnNlY3Rpb25zLmRlbGV0ZShlbnRyeS50YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKG9uSW50ZXJzZWN0aW9uQ2hhbmdlLCB7XG4gICAgICAgIHJvb3QsXG4gICAgICAgIHJvb3RNYXJnaW4sXG4gICAgICAgIHRocmVzaG9sZDogdHlwZW9mIGFtb3VudCA9PT0gXCJudW1iZXJcIiA/IGFtb3VudCA6IHRocmVzaG9sZHNbYW1vdW50XSxcbiAgICB9KTtcbiAgICBlbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiBvYnNlcnZlci5vYnNlcnZlKGVsZW1lbnQpKTtcbiAgICByZXR1cm4gKCkgPT4gb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xufVxuXG5leHBvcnQgeyBpblZpZXcgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4Lm1qcy5tYXBcbiJdLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMCwxLDIsMyw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxNywxOCwxOSwyMCwyMSwyMiwyMywyNCwyNSwyNiwyNywyOCwyOSwzMCwzMSwzMiwzMywzNCwzNSwzNiwzNywzOCwzOSw0MCw0MSw0Miw0Myw0NCw0NSw0Niw0Nyw0OCw0OSw1MCw1MSw1Miw1Myw1NCw1NSw1Niw1Nyw1OCw1OSw2MCw2MSw2Miw2Myw2NCw2NSw2Niw2Nyw2OCw2OSw3MCw3MSw3Miw3Myw3NCw3NSw3Niw3Nyw3OCw3OSw4MCw4MSw4Miw4Myw4NCw4NSw4Niw4Nyw4OCw4OSw5MCw5MSw5Miw5Myw5NCw5NSw5Niw5Nyw5OCw5OSwxMDAsMTAxLDEwMiwxMDMsMTA0LDEwNSwxMDYsMTA3LDEwOCwxMDksMTEwLDExMSwxMTIsMTEzLDExNCwxMTUsMTE2LDExNywxMTgsMTE5LDEyMCwxMjEsMTIyLDEyMywxMjQsMTI1LDEyNiwxMjcsMTI4LDEyOSwxMzAsMTMxLDEzMiwxMzMsMTM0LDEzNSwxMzYsMTM3LDEzOCwxMzksMTQwLDE0MSwxNDIsMTQzLDE0NCwxNDUsMTQ2LDE0NywxNDgsMTQ5LDE1MCwxNTEsMTUyLDE1MywxNTQsMTU1LDE1NiwxNTcsMTU4LDE1OSwxNjAsMTYxLDE2MiwxNjMsMTY0LDE2NSwxNjYsMTY3LDE2OCwxNjksMTcwLDE3MSwxNzIsMTczLDE3NCwxNzUsMTc2LDE3NywxNzgsMTc5LDE4MCwxODEsMTgyLDE4MywxODQsMTg1LDE4NiwxODcsMTg4LDE4OSwxOTAsMTkxLDE5MiwxOTMsMTk0LDE5NSwxOTYsMTk3LDE5OCwxOTksMjAwLDIwMSwyMDIsMjAzLDIwNCwyMDUsMjA2LDIwNywyMDgsMjA5LDIxMCwyMTEsMjEyLDIxMywyMTQsMjE1LDIxNiwyMTcsMjE4LDIxOSwyMjBdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsU0FBUyxjQUFjLEtBQUssTUFBTTtDQUM5QixJ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