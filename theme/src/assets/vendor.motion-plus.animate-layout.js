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
//#region ../../node_modules/motion-utils/dist/es/array.mjs
function addUniqueItem(arr, item) {
	if (arr.indexOf(item) === -1) arr.push(item);
}
function removeItem(arr, item) {
	const index = arr.indexOf(item);
	if (index > -1) arr.splice(index, 1);
}

//#endregion
//#region ../../node_modules/motion-utils/dist/es/clamp.mjs
const clamp = (min, max, v) => {
	if (v > max) return max;
	if (v < min) return min;
	return v;
};

//#endregion
//#region ../../node_modules/motion-utils/dist/es/format-error-message.mjs
function formatErrorMessage(message, errorCode) {
	return errorCode ? `${message}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${errorCode}` : message;
}

//#endregion
//#region ../../node_modules/motion-utils/dist/es/errors.mjs
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
//#region ../../node_modules/motion-utils/dist/es/global-config.mjs
const MotionGlobalConfig = {};

//#endregion
//#region ../../node_modules/motion-utils/dist/es/is-numerical-string.mjs
/**
* Check if value is a numerical string, ie a string that is purely a number eg "100" or "-100.1"
*/
const isNumericalString = (v) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);

//#endregion
//#region ../../node_modules/motion-utils/dist/es/is-object.mjs
const isObject = (value) => typeof value === "object" && value !== null;

//#endregion
//#region ../../node_modules/motion-utils/dist/es/is-zero-value-string.mjs
/**
* Check if the value is a zero value string like "0px" or "0%"
*/
const isZeroValueString = (v) => /^0[^.\s]+$/u.test(v);

//#endregion
//#region ../../node_modules/motion-utils/dist/es/memo.mjs
/*#__NO_SIDE_EFFECTS__*/
function memo(callback) {
	let result;
	return () => {
		if (result === void 0) result = callback();
		return result;
	};
}

//#endregion
//#region ../../node_modules/motion-utils/dist/es/noop.mjs
const noop$1 = /* @__NO_SIDE_EFFECTS__ */ (any) => any;

//#endregion
//#region ../../node_modules/motion-utils/dist/es/pipe.mjs
/**
* Pipe
* Compose other transformers to run linearily
* pipe(min(20), max(40))
* @param  {...functions} transformers
* @return {function}
*/
const pipe = (...transformers) => transformers.reduce((a, b) => (v) => b(a(v)));

//#endregion
//#region ../../node_modules/motion-utils/dist/es/progress.mjs
const progress = /* @__NO_SIDE_EFFECTS__ */ (from, to, value) => {
	const range = to - from;
	return range ? (value - from) / range : 1;
};

//#endregion
//#region ../../node_modules/motion-utils/dist/es/subscription-manager.mjs
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
//#region ../../node_modules/motion-utils/dist/es/time-conversion.mjs
/**
* Converts seconds to milliseconds
*
* @param seconds - Time in seconds.
* @return milliseconds - Converted time in milliseconds.
*/
const secondsToMilliseconds = /* @__NO_SIDE_EFFECTS__ */ (seconds) => seconds * 1e3;
const millisecondsToSeconds = /* @__NO_SIDE_EFFECTS__ */ (milliseconds) => milliseconds / 1e3;

//#endregion
//#region ../../node_modules/motion-utils/dist/es/velocity-per-second.mjs
const velocityPerSecond = /* @__NO_SIDE_EFFECTS__ */ (velocity, frameDuration) => frameDuration ? velocity * (1e3 / frameDuration) : 0;

//#endregion
//#region ../../node_modules/motion-utils/dist/es/warn-once.mjs
const warned = /* @__PURE__ */ new Set();
function warnOnce(condition, message, errorCode) {
	if (condition || warned.has(message)) return;
	console.warn(formatErrorMessage(message, errorCode));
	warned.add(message);
}

//#endregion
//#region ../../node_modules/motion-utils/dist/es/easing/cubic-bezier.mjs
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
	if (mX1 === mY1 && mX2 === mY2) return noop$1;
	const getTForX = (aX) => binarySubdivide(aX, 0, 1, mX1, mX2);
	return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
}

//#endregion
//#region ../../node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs
const mirrorEasing = /* @__NO_SIDE_EFFECTS__ */ (easing) => (p) => p <= .5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;

//#endregion
//#region ../../node_modules/motion-utils/dist/es/easing/modifiers/reverse.mjs
const reverseEasing = /* @__NO_SIDE_EFFECTS__ */ (easing) => (p) => 1 - easing(1 - p);

//#endregion
//#region ../../node_modules/motion-utils/dist/es/easing/back.mjs
const backOut = /*@__PURE__*/ cubicBezier(.33, 1.53, .69, .99);
const backIn = /*@__PURE__*/ reverseEasing(backOut);
const backInOut = /*@__PURE__*/ mirrorEasing(backIn);

//#endregion
//#region ../../node_modules/motion-utils/dist/es/easing/anticipate.mjs
const anticipate = (p) => p >= 1 ? 1 : (p *= 2) < 1 ? .5 * backIn(p) : .5 * (2 - Math.pow(2, -10 * (p - 1)));

//#endregion
//#region ../../node_modules/motion-utils/dist/es/easing/circ.mjs
const circIn = (p) => 1 - Math.sin(Math.acos(p));
const circOut = reverseEasing(circIn);
const circInOut = mirrorEasing(circIn);

//#endregion
//#region ../../node_modules/motion-utils/dist/es/easing/ease.mjs
const easeIn = /*@__PURE__*/ cubicBezier(.42, 0, 1, 1);
const easeOut = /*@__PURE__*/ cubicBezier(0, 0, .58, 1);
const easeInOut = /*@__PURE__*/ cubicBezier(.42, 0, .58, 1);

//#endregion
//#region ../../node_modules/motion-utils/dist/es/easing/utils/is-easing-array.mjs
const isEasingArray = /* @__NO_SIDE_EFFECTS__ */ (ease) => {
	return Array.isArray(ease) && typeof ease[0] !== "number";
};

//#endregion
//#region ../../node_modules/motion-utils/dist/es/easing/utils/is-bezier-definition.mjs
const isBezierDefinition = /* @__NO_SIDE_EFFECTS__ */ (easing) => Array.isArray(easing) && typeof easing[0] === "number";

//#endregion
//#region ../../node_modules/motion-utils/dist/es/easing/utils/map.mjs
const easingLookup = {
	linear: noop$1,
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
//#region ../../node_modules/motion-dom/dist/es/frameloop/order.mjs
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
//#region ../../node_modules/motion-dom/dist/es/stats/buffer.mjs
const statsBuffer = {
	value: null,
	addProjectionMetrics: null
};

//#endregion
//#region ../../node_modules/motion-dom/dist/es/frameloop/render-step.mjs
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
//#region ../../node_modules/motion-dom/dist/es/frameloop/batcher.mjs
const maxElapsed = 40;
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
		if (!useManualTiming) state.delta = useDefaultElapsed ? 1e3 / 60 : Math.max(Math.min(timestamp - state.timestamp, maxElapsed), 1);
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
//#region ../../node_modules/motion-dom/dist/es/frameloop/frame.mjs
const { schedule: frame, cancel: cancelFrame, state: frameData, steps: frameSteps } = /* @__PURE__ */ createRenderBatcher(typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : noop$1, true);

//#endregion
//#region ../../node_modules/motion-dom/dist/es/frameloop/sync-time.mjs
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
//#region ../../node_modules/motion-dom/dist/es/stats/animation-count.mjs
const activeAnimations = {
	layout: 0,
	mainThread: 0,
	waapi: 0
};

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/utils/is-css-variable.mjs
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
//#region ../../node_modules/motion-dom/dist/es/value/types/numbers/index.mjs
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
//#region ../../node_modules/motion-dom/dist/es/value/types/utils/sanitize.mjs
const sanitize = (v) => Math.round(v * 1e5) / 1e5;

//#endregion
//#region ../../node_modules/motion-dom/dist/es/value/types/utils/float-regex.mjs
const floatRegex = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;

//#endregion
//#region ../../node_modules/motion-dom/dist/es/value/types/utils/is-nullish.mjs
function isNullish(v) {
	return v == null;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/value/types/utils/single-color-regex.mjs
const singleColorRegex = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;

//#endregion
//#region ../../node_modules/motion-dom/dist/es/value/types/color/utils.mjs
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
//#region ../../node_modules/motion-dom/dist/es/value/types/color/rgba.mjs
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
//#region ../../node_modules/motion-dom/dist/es/value/types/color/hex.mjs
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
//#region ../../node_modules/motion-dom/dist/es/value/types/numbers/units.mjs
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
//#region ../../node_modules/motion-dom/dist/es/value/types/color/hsla.mjs
const hsla = {
	test: /*@__PURE__*/ isColorString("hsl", "hue"),
	parse: /*@__PURE__*/ splitColor("hue", "saturation", "lightness"),
	transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
		return "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
	}
};

//#endregion
//#region ../../node_modules/motion-dom/dist/es/value/types/color/index.mjs
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
//#region ../../node_modules/motion-dom/dist/es/value/types/utils/color-regex.mjs
const colorRegex = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;

//#endregion
//#region ../../node_modules/motion-dom/dist/es/value/types/complex/index.mjs
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
//#region ../../node_modules/motion-dom/dist/es/value/types/color/hsla-to-rgba.mjs
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
//#region ../../node_modules/motion-dom/dist/es/utils/mix/immediate.mjs
function mixImmediate(a, b) {
	return (p) => p > 0 ? b : a;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/utils/mix/number.mjs
const mixNumber$1 = (from, to, progress) => {
	return from + (to - from) * progress;
};

//#endregion
//#region ../../node_modules/motion-dom/dist/es/utils/mix/color.mjs
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
//#region ../../node_modules/motion-dom/dist/es/utils/mix/visibility.mjs
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
//#region ../../node_modules/motion-dom/dist/es/utils/mix/complex.mjs
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
//#region ../../node_modules/motion-dom/dist/es/utils/mix/index.mjs
function mix(from, to, p) {
	if (typeof from === "number" && typeof to === "number" && typeof p === "number") return mixNumber$1(from, to, p);
	return getMixer(from)(from, to);
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/drivers/frame.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/waapi/utils/linear.mjs
const generateLinearEasing = (easing, duration, resolution = 10) => {
	let points = "";
	const numPoints = Math.max(Math.round(duration / resolution), 2);
	for (let i = 0; i < numPoints; i++) points += Math.round(easing(i / (numPoints - 1)) * 1e4) / 1e4 + ", ";
	return `linear(${points.substring(0, points.length - 2)})`;
};

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/generators/utils/calc-duration.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/generators/utils/create-generator-easing.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/generators/spring.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/generators/utils/velocity.mjs
const velocitySampleDuration = 5;
function getGeneratorVelocity(resolveValue, t, current) {
	const prevT = Math.max(t - velocitySampleDuration, 0);
	return velocityPerSecond(current - resolveValue(prevT), t - prevT);
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/generators/inertia.mjs
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
//#region ../../node_modules/motion-dom/dist/es/utils/interpolate.mjs
function createMixers(output, ease, customMixer) {
	const mixers = [];
	const mixerFactory = customMixer || MotionGlobalConfig.mix || mix;
	const numMixers = output.length - 1;
	for (let i = 0; i < numMixers; i++) {
		let mixer = mixerFactory(output[i], output[i + 1]);
		if (ease) {
			const easingFunction = Array.isArray(ease) ? ease[i] || noop$1 : ease;
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
//#region ../../node_modules/motion-dom/dist/es/animation/keyframes/offsets/fill.mjs
function fillOffset(offset, remaining) {
	const min = offset[offset.length - 1];
	for (let i = 1; i <= remaining; i++) {
		const offsetProgress = progress(0, remaining, i);
		offset.push(mixNumber$1(min, 1, offsetProgress));
	}
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/keyframes/offsets/default.mjs
function defaultOffset(arr) {
	const offset = [0];
	fillOffset(offset, arr.length - 1);
	return offset;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/keyframes/offsets/time.mjs
function convertOffsetToTimes(offset, duration) {
	return offset.map((o) => o * duration);
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/generators/keyframes.mjs
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
	const absoluteTimes = convertOffsetToTimes(times && times.length === keyframeValues.length ? times : defaultOffset(keyframeValues), duration);
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
//#region ../../node_modules/motion-dom/dist/es/animation/keyframes/get-final.mjs
const isNotNull$1 = (value) => value !== null;
function getFinalKeyframe$1(keyframes, { repeat, repeatType = "loop" }, finalKeyframe, speed = 1) {
	const resolvedKeyframes = keyframes.filter(isNotNull$1);
	const index = speed < 0 || repeat && repeatType !== "loop" && repeat % 2 === 1 ? 0 : resolvedKeyframes.length - 1;
	return !index || finalKeyframe === void 0 ? resolvedKeyframes[index] : finalKeyframe;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/utils/replace-transition-type.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/utils/WithPromise.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/JSAnimation.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/keyframes/utils/fill-wildcards.mjs
function fillWildcards(keyframes) {
	for (let i = 1; i < keyframes.length; i++) keyframes[i] ?? (keyframes[i] = keyframes[i - 1]);
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/render/dom/parse-transform.mjs
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
//#region ../../node_modules/motion-dom/dist/es/render/utils/keys-transform.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/keyframes/utils/unit-conversion.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/keyframes/KeyframesResolver.mjs
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
//#region ../../node_modules/motion-dom/dist/es/render/dom/is-css-var.mjs
const isCSSVar = (name) => name.startsWith("--");

//#endregion
//#region ../../node_modules/motion-dom/dist/es/render/dom/style-set.mjs
function setStyle(element, name, value) {
	isCSSVar(name) ? element.style.setProperty(name, value) : element.style[name] = value;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/utils/supports/flags.mjs
/**
* Add the ability for test suites to manually set support flags
* to better test more environments.
*/
const supportsFlags = {};

//#endregion
//#region ../../node_modules/motion-dom/dist/es/utils/supports/memo.mjs
function memoSupports(callback, supportsFlag) {
	const memoized = memo(callback);
	return () => supportsFlags[supportsFlag] ?? memoized();
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/utils/supports/scroll-timeline.mjs
const supportsScrollTimeline = /* @__PURE__ */ memoSupports(() => window.ScrollTimeline !== void 0, "scrollTimeline");

//#endregion
//#region ../../node_modules/motion-dom/dist/es/utils/supports/linear-easing.mjs
const supportsLinearEasing = /*@__PURE__*/ memoSupports(() => {
	try {
		document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
	} catch (e) {
		return false;
	}
	return true;
}, "linearEasing");

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/waapi/easing/cubic-bezier.mjs
const cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/waapi/easing/supported.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/waapi/easing/map-easing.mjs
function mapEasingToNativeEasing(easing, duration) {
	if (!easing) return;
	else if (typeof easing === "function") return supportsLinearEasing() ? generateLinearEasing(easing, duration) : "ease-out";
	else if (isBezierDefinition(easing)) return cubicBezierAsString(easing);
	else if (Array.isArray(easing)) return easing.map((segmentEasing) => mapEasingToNativeEasing(segmentEasing, duration) || supportedWaapiEasing.easeOut);
	else return supportedWaapiEasing[easing];
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/waapi/start-waapi-animation.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/generators/utils/is-generator.mjs
function isGenerator(type) {
	return typeof type === "function" && "applyToOptions" in type;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/waapi/utils/apply-generator.mjs
function applyGeneratorOptions({ type, ...options }) {
	if (isGenerator(type) && supportsLinearEasing()) return type.applyToOptions(options);
	else {
		options.duration ?? (options.duration = 300);
		options.ease ?? (options.ease = "easeOut");
	}
	return options;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/NativeAnimation.mjs
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
			return noop$1;
		} else return observe(this);
	}
};

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/waapi/utils/unsupported-easing.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/NativeAnimationExtended.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/utils/is-animatable.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/utils/can-animate.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/utils/make-animation-instant.mjs
function makeAnimationInstant(options) {
	options.duration = 0;
	options.type = "keyframes";
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/waapi/supports/waapi.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/AsyncMotionValueAnimation.mjs
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
		}).catch(noop$1);
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
//#region ../../node_modules/motion-dom/dist/es/animation/GroupAnimation.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/utils/css-variables-conversion.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/utils/default-transitions.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/utils/get-final-keyframe.mjs
const isNotNull = (value) => value !== null;
function getFinalKeyframe(keyframes, { repeat, repeatType = "loop" }, finalKeyframe) {
	const resolvedKeyframes = keyframes.filter(isNotNull);
	const index = repeat && repeatType !== "loop" && repeat % 2 === 1 ? 0 : resolvedKeyframes.length - 1;
	return !index || finalKeyframe === void 0 ? resolvedKeyframes[index] : finalKeyframe;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/utils/resolve-transition.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/utils/get-value-transition.mjs
function getValueTransition(transition, key) {
	const valueTransition = transition?.[key] ?? transition?.["default"] ?? transition;
	if (valueTransition !== transition) return resolveTransition(valueTransition, transition);
	return valueTransition;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/utils/is-transition-defined.mjs
/**
* Decide whether a transition is defined on a given Transition.
* This filters out orchestration options and returns true
* if any options are left.
*/
function isTransitionDefined({ when, delay: _delay, delayChildren, staggerChildren, staggerDirection, repeat, repeatType, repeatDelay, from, elapsed, ...transition }) {
	return !!Object.keys(transition).length;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/interfaces/motion-value.mjs
const animateMotionValue = (name, value, target, transition = {}, element, isHandoff) => (onComplete) => {
	const valueTransition = getValueTransition(transition, name) || {};
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
//#region ../../node_modules/motion-dom/dist/es/render/utils/resolve-variants.mjs
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
//#region ../../node_modules/motion-dom/dist/es/render/utils/keys-position.mjs
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
//#region ../../node_modules/motion-dom/dist/es/value/index.mjs
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
//#region ../../node_modules/motion-dom/dist/es/value/utils/is-motion-value.mjs
const isMotionValue = (value) => Boolean(value && value.getVelocity);

//#endregion
//#region ../../node_modules/motion-dom/dist/es/render/dom/utils/camel-to-dash.mjs
function camelToDash(str) {
	return str.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/optimized-appear/data-id.mjs
const optimizedAppearDataId = "framerAppearId";
const optimizedAppearDataAttribute = "data-" + camelToDash(optimizedAppearDataId);

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/optimized-appear/get-appear-id.mjs
function getOptimisedAppearId(visualElement) {
	return visualElement.props[optimizedAppearDataAttribute];
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/value/types/auto.mjs
/**
* ValueType for "auto"
*/
const auto = {
	test: (v) => v === "auto",
	parse: (v) => v
};

//#endregion
//#region ../../node_modules/motion-dom/dist/es/value/types/test.mjs
/**
* Tests a provided value against a ValueType
*/
const testValueType = (v) => (type) => type.test(v);

//#endregion
//#region ../../node_modules/motion-dom/dist/es/value/types/dimensions.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/keyframes/utils/is-none.mjs
function isNone(value) {
	if (typeof value === "number") return value === 0;
	else if (value !== null) return value === "none" || value === "0" || isZeroValueString(value);
	else return true;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/value/types/complex/filter.mjs
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
//#region ../../node_modules/motion-dom/dist/es/value/types/complex/mask.mjs
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
//#region ../../node_modules/motion-dom/dist/es/value/types/int.mjs
const int = {
	...number,
	transform: Math.round
};

//#endregion
//#region ../../node_modules/motion-dom/dist/es/value/types/maps/transform.mjs
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
//#region ../../node_modules/motion-dom/dist/es/value/types/maps/number.mjs
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
//#region ../../node_modules/motion-dom/dist/es/value/types/maps/defaults.mjs
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
//#region ../../node_modules/motion-dom/dist/es/value/types/utils/animatable-none.mjs
const customTypes = /*@__PURE__*/ new Set([filter, mask]);
function getAnimatableNone(key, value) {
	let defaultValueType = getDefaultValueType(key);
	if (!customTypes.has(defaultValueType)) defaultValueType = complex;
	return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : void 0;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/keyframes/utils/make-none-animatable.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/keyframes/DOMKeyframesResolver.mjs
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
//#region ../../node_modules/motion-dom/dist/es/animation/waapi/utils/accelerated-values.mjs
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
//#region ../../node_modules/motion-dom/dist/es/utils/resolve-elements.mjs
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
//#region ../../node_modules/motion-dom/dist/es/value/types/utils/get-as-type.mjs
/**
* Provided a value and a ValueType, returns the value as that value type.
*/
const getValueAsType = (value, type) => {
	return type && typeof value === "number" ? type.transform(value) : value;
};

//#endregion
//#region ../../node_modules/motion-dom/dist/es/frameloop/microtask.mjs
const { schedule: microtask, cancel: cancelMicrotask } = /* @__PURE__ */ createRenderBatcher(queueMicrotask, false);

//#endregion
//#region ../../node_modules/motion-dom/dist/es/utils/is-svg-element.mjs
/**
* Checks if an element is an SVG element in a way
* that works across iframes
*/
function isSVGElement(element) {
	return isObject(element) && "ownerSVGElement" in element;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/utils/is-svg-svg-element.mjs
/**
* Checks if an element is specifically an SVGSVGElement (the root SVG element)
* in a way that works across iframes
*/
function isSVGSVGElement(element) {
	return isSVGElement(element) && element.tagName === "svg";
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/value/types/utils/find.mjs
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
//#region ../../node_modules/motion-dom/dist/es/projection/geometry/models.mjs
const createAxisDelta = () => ({
	translate: 0,
	scale: 1,
	origin: 0,
	originPoint: 0
});
const createDelta = () => ({
	x: createAxisDelta(),
	y: createAxisDelta()
});
const createAxis = () => ({
	min: 0,
	max: 0
});
const createBox = () => ({
	x: createAxis(),
	y: createAxis()
});

//#endregion
//#region ../../node_modules/motion-dom/dist/es/render/store.mjs
const visualElementStore = /* @__PURE__ */ new WeakMap();

//#endregion
//#region ../../node_modules/motion-dom/dist/es/render/utils/is-animation-controls.mjs
function isAnimationControls(v) {
	return v !== null && typeof v === "object" && typeof v.start === "function";
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/render/utils/is-variant-label.mjs
/**
* Decides if the supplied variable is variant label
*/
function isVariantLabel(v) {
	return typeof v === "string" || Array.isArray(v);
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/render/utils/variant-props.mjs
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
//#region ../../node_modules/motion-dom/dist/es/render/utils/is-controlling-variants.mjs
function isControllingVariants(props) {
	return isAnimationControls(props.animate) || variantProps.some((name) => isVariantLabel(props[name]));
}
function isVariantNode(props) {
	return Boolean(isControllingVariants(props) || props.variants);
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/render/utils/motion-values.mjs
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
//#region ../../node_modules/motion-dom/dist/es/render/utils/reduced-motion/state.mjs
const prefersReducedMotion = { current: null };
const hasReducedMotionListener = { current: false };

//#endregion
//#region ../../node_modules/motion-dom/dist/es/render/utils/reduced-motion/index.mjs
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
//#region ../../node_modules/motion-dom/dist/es/render/VisualElement.mjs
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
//#region ../../node_modules/motion-dom/dist/es/render/dom/DOMVisualElement.mjs
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
//#region ../../node_modules/motion-dom/dist/es/projection/geometry/conversion.mjs
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
//#region ../../node_modules/motion-dom/dist/es/projection/utils/has-transform.mjs
function isIdentityScale(scale) {
	return scale === void 0 || scale === 1;
}
function hasScale({ scale, scaleX, scaleY }) {
	return !isIdentityScale(scale) || !isIdentityScale(scaleX) || !isIdentityScale(scaleY);
}
function hasTransform(values) {
	return hasScale(values) || has2DTranslate(values) || values.z || values.rotate || values.rotateX || values.rotateY || values.skewX || values.skewY;
}
function has2DTranslate(values) {
	return is2DTranslate(values.x) || is2DTranslate(values.y);
}
function is2DTranslate(value) {
	return value && value !== "0%";
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/projection/geometry/delta-apply.mjs
/**
* Scales a point based on a factor and an originPoint
*/
function scalePoint(point, scale, originPoint) {
	return originPoint + scale * (point - originPoint);
}
/**
* Applies a translate/scale delta to a point
*/
function applyPointDelta(point, translate, scale, originPoint, boxScale) {
	if (boxScale !== void 0) point = scalePoint(point, boxScale, originPoint);
	return scalePoint(point, scale, originPoint) + translate;
}
/**
* Applies a translate/scale delta to an axis
*/
function applyAxisDelta(axis, translate = 0, scale = 1, originPoint, boxScale) {
	axis.min = applyPointDelta(axis.min, translate, scale, originPoint, boxScale);
	axis.max = applyPointDelta(axis.max, translate, scale, originPoint, boxScale);
}
/**
* Applies a translate/scale delta to a box
*/
function applyBoxDelta(box, { x, y }) {
	applyAxisDelta(box.x, x.translate, x.scale, x.originPoint);
	applyAxisDelta(box.y, y.translate, y.scale, y.originPoint);
}
const TREE_SCALE_SNAP_MIN = .999999999999;
const TREE_SCALE_SNAP_MAX = 1.0000000000001;
/**
* Apply a tree of deltas to a box. We do this to calculate the effect of all the transforms
* in a tree upon our box before then calculating how to project it into our desired viewport-relative box
*
* This is the final nested loop within updateLayoutDelta for future refactoring
*/
function applyTreeDeltas(box, treeScale, treePath, isSharedTransition = false) {
	const treeLength = treePath.length;
	if (!treeLength) return;
	treeScale.x = treeScale.y = 1;
	let node;
	let delta;
	for (let i = 0; i < treeLength; i++) {
		node = treePath[i];
		delta = node.projectionDelta;
		/**
		* TODO: Prefer to remove this, but currently we have motion components with
		* display: contents in Framer.
		*/
		const { visualElement } = node.options;
		if (visualElement && visualElement.props.style && visualElement.props.style.display === "contents") continue;
		if (isSharedTransition && node.options.layoutScroll && node.scroll && node !== node.root) transformBox(box, {
			x: -node.scroll.offset.x,
			y: -node.scroll.offset.y
		});
		if (delta) {
			treeScale.x *= delta.x.scale;
			treeScale.y *= delta.y.scale;
			applyBoxDelta(box, delta);
		}
		if (isSharedTransition && hasTransform(node.latestValues)) transformBox(box, node.latestValues, node.layout?.layoutBox);
	}
	/**
	* Snap tree scale back to 1 if it's within a non-perceivable threshold.
	* This will help reduce useless scales getting rendered.
	*/
	if (treeScale.x < TREE_SCALE_SNAP_MAX && treeScale.x > TREE_SCALE_SNAP_MIN) treeScale.x = 1;
	if (treeScale.y < TREE_SCALE_SNAP_MAX && treeScale.y > TREE_SCALE_SNAP_MIN) treeScale.y = 1;
}
function translateAxis(axis, distance) {
	axis.min = axis.min + distance;
	axis.max = axis.max + distance;
}
/**
* Apply a transform to an axis from the latest resolved motion values.
* This function basically acts as a bridge between a flat motion value map
* and applyAxisDelta
*/
function transformAxis(axis, axisTranslate, axisScale, boxScale, axisOrigin = .5) {
	applyAxisDelta(axis, axisTranslate, axisScale, mixNumber$1(axis.min, axis.max, axisOrigin), boxScale);
}
function resolveAxisTranslate(value, axis) {
	if (typeof value === "string") return parseFloat(value) / 100 * (axis.max - axis.min);
	return value;
}
/**
* Apply a transform to a box from the latest resolved motion values.
*/
function transformBox(box, transform, sourceBox) {
	const resolveBox = sourceBox ?? box;
	transformAxis(box.x, resolveAxisTranslate(transform.x, resolveBox.x), transform.scaleX, transform.scale, transform.originX);
	transformAxis(box.y, resolveAxisTranslate(transform.y, resolveBox.y), transform.scaleY, transform.scale, transform.originY);
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/projection/utils/measure.mjs
function measureViewportBox(instance, transformPoint) {
	return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint));
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/render/html/utils/build-transform.mjs
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
//#region ../../node_modules/motion-dom/dist/es/render/html/utils/build-styles.mjs
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
//#region ../../node_modules/motion-dom/dist/es/render/html/utils/render.mjs
function renderHTML(element, { style, vars }, styleProp, projection) {
	const elementStyle = element.style;
	let key;
	for (key in style) elementStyle[key] = style[key];
	projection?.applyProjectionStyles(elementStyle, styleProp);
	for (key in vars) elementStyle.setProperty(key, vars[key]);
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/projection/styles/scale-border-radius.mjs
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
//#region ../../node_modules/motion-dom/dist/es/projection/styles/scale-box-shadow.mjs
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
//#region ../../node_modules/motion-dom/dist/es/projection/styles/scale-correction.mjs
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
//#region ../../node_modules/motion-dom/dist/es/render/utils/is-forced-motion-value.mjs
function isForcedMotionValue(key, { layout, layoutId }) {
	return transformProps.has(key) || key.startsWith("origin") || (layout || layoutId !== void 0) && (!!scaleCorrectors[key] || key === "opacity");
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/render/html/utils/scrape-motion-values.mjs
function scrapeMotionValuesFromProps(props, prevProps, visualElement) {
	const style = props.style;
	const prevStyle = prevProps?.style;
	const newValues = {};
	if (!style) return newValues;
	for (const key in style) if (isMotionValue(style[key]) || prevStyle && isMotionValue(prevStyle[key]) || isForcedMotionValue(key, props) || visualElement?.getValue(key)?.liveStyle !== void 0) newValues[key] = style[key];
	return newValues;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/render/html/HTMLVisualElement.mjs
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
		return scrapeMotionValuesFromProps(props, prevProps, visualElement);
	}
};

//#endregion
//#region ../../node_modules/motion-dom/dist/es/projection/geometry/copy.mjs
/**
* Reset an axis to the provided origin box.
*
* This is a mutative operation.
*/
function copyAxisInto(axis, originAxis) {
	axis.min = originAxis.min;
	axis.max = originAxis.max;
}
/**
* Reset a box to the provided origin box.
*
* This is a mutative operation.
*/
function copyBoxInto(box, originBox) {
	copyAxisInto(box.x, originBox.x);
	copyAxisInto(box.y, originBox.y);
}
/**
* Reset a delta to the provided origin box.
*
* This is a mutative operation.
*/
function copyAxisDeltaInto(delta, originDelta) {
	delta.translate = originDelta.translate;
	delta.scale = originDelta.scale;
	delta.originPoint = originDelta.originPoint;
	delta.origin = originDelta.origin;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/projection/geometry/delta-calc.mjs
const SCALE_MIN = .9999;
const SCALE_MAX = 1.0001;
const TRANSLATE_MIN = -.01;
const TRANSLATE_MAX = .01;
function calcLength(axis) {
	return axis.max - axis.min;
}
function isNear(value, target, maxDistance) {
	return Math.abs(value - target) <= maxDistance;
}
function calcAxisDelta(delta, source, target, origin = .5) {
	delta.origin = origin;
	delta.originPoint = mixNumber$1(source.min, source.max, delta.origin);
	delta.scale = calcLength(target) / calcLength(source);
	delta.translate = mixNumber$1(target.min, target.max, delta.origin) - delta.originPoint;
	if (delta.scale >= SCALE_MIN && delta.scale <= SCALE_MAX || isNaN(delta.scale)) delta.scale = 1;
	if (delta.translate >= TRANSLATE_MIN && delta.translate <= TRANSLATE_MAX || isNaN(delta.translate)) delta.translate = 0;
}
function calcBoxDelta(delta, source, target, origin) {
	calcAxisDelta(delta.x, source.x, target.x, origin ? origin.originX : void 0);
	calcAxisDelta(delta.y, source.y, target.y, origin ? origin.originY : void 0);
}
function calcRelativeAxis(target, relative, parent) {
	target.min = parent.min + relative.min;
	target.max = target.min + calcLength(relative);
}
function calcRelativeBox(target, relative, parent) {
	calcRelativeAxis(target.x, relative.x, parent.x);
	calcRelativeAxis(target.y, relative.y, parent.y);
}
function calcRelativeAxisPosition(target, layout, parent) {
	target.min = layout.min - parent.min;
	target.max = target.min + calcLength(layout);
}
function calcRelativePosition(target, layout, parent) {
	calcRelativeAxisPosition(target.x, layout.x, parent.x);
	calcRelativeAxisPosition(target.y, layout.y, parent.y);
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/projection/geometry/delta-remove.mjs
/**
* Remove a delta from a point. This is essentially the steps of applyPointDelta in reverse
*/
function removePointDelta(point, translate, scale, originPoint, boxScale) {
	point -= translate;
	point = scalePoint(point, 1 / scale, originPoint);
	if (boxScale !== void 0) point = scalePoint(point, 1 / boxScale, originPoint);
	return point;
}
/**
* Remove a delta from an axis. This is essentially the steps of applyAxisDelta in reverse
*/
function removeAxisDelta(axis, translate = 0, scale = 1, origin = .5, boxScale, originAxis = axis, sourceAxis = axis) {
	if (percent.test(translate)) {
		translate = parseFloat(translate);
		translate = mixNumber$1(sourceAxis.min, sourceAxis.max, translate / 100) - sourceAxis.min;
	}
	if (typeof translate !== "number") return;
	let originPoint = mixNumber$1(originAxis.min, originAxis.max, origin);
	if (axis === originAxis) originPoint -= translate;
	axis.min = removePointDelta(axis.min, translate, scale, originPoint, boxScale);
	axis.max = removePointDelta(axis.max, translate, scale, originPoint, boxScale);
}
/**
* Remove a transforms from an axis. This is essentially the steps of applyAxisTransforms in reverse
* and acts as a bridge between motion values and removeAxisDelta
*/
function removeAxisTransforms(axis, transforms, [key, scaleKey, originKey], origin, sourceAxis) {
	removeAxisDelta(axis, transforms[key], transforms[scaleKey], transforms[originKey], transforms.scale, origin, sourceAxis);
}
/**
* The names of the motion values we want to apply as translation, scale and origin.
*/
const xKeys = [
	"x",
	"scaleX",
	"originX"
];
const yKeys = [
	"y",
	"scaleY",
	"originY"
];
/**
* Remove a transforms from an box. This is essentially the steps of applyAxisBox in reverse
* and acts as a bridge between motion values and removeAxisDelta
*/
function removeBoxTransforms(box, transforms, originBox, sourceBox) {
	removeAxisTransforms(box.x, transforms, xKeys, originBox ? originBox.x : void 0, sourceBox ? sourceBox.x : void 0);
	removeAxisTransforms(box.y, transforms, yKeys, originBox ? originBox.y : void 0, sourceBox ? sourceBox.y : void 0);
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/projection/geometry/utils.mjs
function isAxisDeltaZero(delta) {
	return delta.translate === 0 && delta.scale === 1;
}
function isDeltaZero(delta) {
	return isAxisDeltaZero(delta.x) && isAxisDeltaZero(delta.y);
}
function axisEquals(a, b) {
	return a.min === b.min && a.max === b.max;
}
function boxEquals(a, b) {
	return axisEquals(a.x, b.x) && axisEquals(a.y, b.y);
}
function axisEqualsRounded(a, b) {
	return Math.round(a.min) === Math.round(b.min) && Math.round(a.max) === Math.round(b.max);
}
function boxEqualsRounded(a, b) {
	return axisEqualsRounded(a.x, b.x) && axisEqualsRounded(a.y, b.y);
}
function aspectRatio(box) {
	return calcLength(box.x) / calcLength(box.y);
}
function axisDeltaEquals(a, b) {
	return a.translate === b.translate && a.scale === b.scale && a.originPoint === b.originPoint;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/projection/utils/each-axis.mjs
function eachAxis(callback) {
	return [callback("x"), callback("y")];
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/projection/styles/transform.mjs
function buildProjectionTransform(delta, treeScale, latestTransform) {
	let transform = "";
	/**
	* The translations we use to calculate are always relative to the viewport coordinate space.
	* But when we apply scales, we also scale the coordinate space of an element and its children.
	* For instance if we have a treeScale (the culmination of all parent scales) of 0.5 and we need
	* to move an element 100 pixels, we actually need to move it 200 in within that scaled space.
	*/
	const xTranslate = delta.x.translate / treeScale.x;
	const yTranslate = delta.y.translate / treeScale.y;
	const zTranslate = latestTransform?.z || 0;
	if (xTranslate || yTranslate || zTranslate) transform = `translate3d(${xTranslate}px, ${yTranslate}px, ${zTranslate}px) `;
	/**
	* Apply scale correction for the tree transform.
	* This will apply scale to the screen-orientated axes.
	*/
	if (treeScale.x !== 1 || treeScale.y !== 1) transform += `scale(${1 / treeScale.x}, ${1 / treeScale.y}) `;
	if (latestTransform) {
		const { transformPerspective, rotate, rotateX, rotateY, skewX, skewY } = latestTransform;
		if (transformPerspective) transform = `perspective(${transformPerspective}px) ${transform}`;
		if (rotate) transform += `rotate(${rotate}deg) `;
		if (rotateX) transform += `rotateX(${rotateX}deg) `;
		if (rotateY) transform += `rotateY(${rotateY}deg) `;
		if (skewX) transform += `skewX(${skewX}deg) `;
		if (skewY) transform += `skewY(${skewY}deg) `;
	}
	/**
	* Apply scale to match the size of the element to the size we want it.
	* This will apply scale to the element-orientated axes.
	*/
	const elementScaleX = delta.x.scale * treeScale.x;
	const elementScaleY = delta.y.scale * treeScale.y;
	if (elementScaleX !== 1 || elementScaleY !== 1) transform += `scale(${elementScaleX}, ${elementScaleY})`;
	return transform || "none";
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/projection/animation/mix-values.mjs
const borders = [
	"TopLeft",
	"TopRight",
	"BottomLeft",
	"BottomRight"
];
const numBorders = borders.length;
const asNumber = (value) => typeof value === "string" ? parseFloat(value) : value;
const isPx = (value) => typeof value === "number" || px.test(value);
function mixValues(target, follow, lead, progress, shouldCrossfadeOpacity, isOnlyMember) {
	if (shouldCrossfadeOpacity) {
		target.opacity = mixNumber$1(0, lead.opacity ?? 1, easeCrossfadeIn(progress));
		target.opacityExit = mixNumber$1(follow.opacity ?? 1, 0, easeCrossfadeOut(progress));
	} else if (isOnlyMember) target.opacity = mixNumber$1(follow.opacity ?? 1, lead.opacity ?? 1, progress);
	/**
	* Mix border radius
	*/
	for (let i = 0; i < numBorders; i++) {
		const borderLabel = `border${borders[i]}Radius`;
		let followRadius = getRadius(follow, borderLabel);
		let leadRadius = getRadius(lead, borderLabel);
		if (followRadius === void 0 && leadRadius === void 0) continue;
		followRadius || (followRadius = 0);
		leadRadius || (leadRadius = 0);
		if (followRadius === 0 || leadRadius === 0 || isPx(followRadius) === isPx(leadRadius)) {
			target[borderLabel] = Math.max(mixNumber$1(asNumber(followRadius), asNumber(leadRadius), progress), 0);
			if (percent.test(leadRadius) || percent.test(followRadius)) target[borderLabel] += "%";
		} else target[borderLabel] = leadRadius;
	}
	/**
	* Mix rotation
	*/
	if (follow.rotate || lead.rotate) target.rotate = mixNumber$1(follow.rotate || 0, lead.rotate || 0, progress);
}
function getRadius(values, radiusName) {
	return values[radiusName] !== void 0 ? values[radiusName] : values.borderRadius;
}
const easeCrossfadeIn = /*@__PURE__*/ compress(0, .5, circOut);
const easeCrossfadeOut = /*@__PURE__*/ compress(.5, .95, noop$1);
function compress(min, max, easing) {
	return (p) => {
		if (p < min) return 0;
		if (p > max) return 1;
		return easing(progress(min, max, p));
	};
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/animation/animate/single-value.mjs
function animateSingleValue(value, keyframes, options) {
	const motionValue$1 = isMotionValue(value) ? value : motionValue(value);
	motionValue$1.start(animateMotionValue("", motionValue$1, keyframes, options));
	return motionValue$1.animation;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/events/add-dom-event.mjs
function addDomEvent(target, eventName, handler, options = { passive: true }) {
	target.addEventListener(eventName, handler, options);
	return () => target.removeEventListener(eventName, handler);
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/projection/utils/compare-by-depth.mjs
const compareByDepth = (a, b) => a.depth - b.depth;

//#endregion
//#region ../../node_modules/motion-dom/dist/es/projection/utils/flat-tree.mjs
var FlatTree = class {
	constructor() {
		this.children = [];
		this.isDirty = false;
	}
	add(child) {
		addUniqueItem(this.children, child);
		this.isDirty = true;
	}
	remove(child) {
		removeItem(this.children, child);
		this.isDirty = true;
	}
	forEach(callback) {
		this.isDirty && this.children.sort(compareByDepth);
		this.isDirty = false;
		this.children.forEach(callback);
	}
};

//#endregion
//#region ../../node_modules/motion-dom/dist/es/utils/delay.mjs
/**
* Timeout defined in ms
*/
function delay(callback, timeout) {
	const start = time.now();
	const checkElapsed = ({ timestamp }) => {
		const elapsed = timestamp - start;
		if (elapsed >= timeout) {
			cancelFrame(checkElapsed);
			callback(elapsed - timeout);
		}
	};
	frame.setup(checkElapsed, true);
	return () => cancelFrame(checkElapsed);
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/value/utils/resolve-motion-value.mjs
/**
* If the provided value is a MotionValue, this returns the actual value, otherwise just the value itself
*/
function resolveMotionValue(value) {
	return isMotionValue(value) ? value.get() : value;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/projection/shared/stack.mjs
var NodeStack = class {
	constructor() {
		this.members = [];
	}
	add(node) {
		addUniqueItem(this.members, node);
		for (let i = this.members.length - 1; i >= 0; i--) {
			const member = this.members[i];
			if (member === node || member === this.lead || member === this.prevLead) continue;
			const inst = member.instance;
			if ((!inst || inst.isConnected === false) && !member.snapshot) {
				removeItem(this.members, member);
				member.unmount();
			}
		}
		node.scheduleRender();
	}
	remove(node) {
		removeItem(this.members, node);
		if (node === this.prevLead) this.prevLead = void 0;
		if (node === this.lead) {
			const prevLead = this.members[this.members.length - 1];
			if (prevLead) this.promote(prevLead);
		}
	}
	relegate(node) {
		for (let i = this.members.indexOf(node) - 1; i >= 0; i--) {
			const member = this.members[i];
			if (member.isPresent !== false && member.instance?.isConnected !== false) {
				this.promote(member);
				return true;
			}
		}
		return false;
	}
	promote(node, preserveFollowOpacity) {
		const prevLead = this.lead;
		if (node === prevLead) return;
		this.prevLead = prevLead;
		this.lead = node;
		node.show();
		if (prevLead) {
			prevLead.updateSnapshot();
			node.scheduleRender();
			const { layoutDependency: prevDep } = prevLead.options;
			const { layoutDependency: nextDep } = node.options;
			if (prevDep === void 0 || prevDep !== nextDep) {
				node.resumeFrom = prevLead;
				if (preserveFollowOpacity) prevLead.preserveOpacity = true;
				if (prevLead.snapshot) {
					node.snapshot = prevLead.snapshot;
					node.snapshot.latestValues = prevLead.animationValues || prevLead.latestValues;
				}
				if (node.root?.isUpdating) node.isLayoutDirty = true;
			}
			if (node.options.crossfade === false) prevLead.hide();
		}
	}
	exitAnimationComplete() {
		this.members.forEach((member) => {
			member.options.onExitComplete?.();
			member.resumingFrom?.options.onExitComplete?.();
		});
	}
	scheduleRender() {
		this.members.forEach((member) => member.instance && member.scheduleRender(false));
	}
	removeLeadSnapshot() {
		if (this.lead?.snapshot) this.lead.snapshot = void 0;
	}
};

//#endregion
//#region ../../node_modules/motion-dom/dist/es/projection/node/state.mjs
/**
* This should only ever be modified on the client otherwise it'll
* persist through server requests. If we need instanced states we
* could lazy-init via root.
*/
const globalProjectionState = {
	/**
	* Global flag as to whether the tree has animated since the last time
	* we resized the window
	*/
	hasAnimatedSinceResize: true,
	/**
	* We set this to true once, on the first update. Any nodes added to the tree beyond that
	* update will be given a `data-projection-id` attribute.
	*/
	hasEverUpdated: false
};

//#endregion
//#region ../../node_modules/motion-dom/dist/es/projection/node/create-projection-node.mjs
const metrics = {
	nodes: 0,
	calculatedTargetDeltas: 0,
	calculatedProjections: 0
};
const transformAxes = [
	"",
	"X",
	"Y",
	"Z"
];
/**
* We use 1000 as the animation target as 0-1000 maps better to pixels than 0-1
* which has a noticeable difference in spring animations
*/
const animationTarget = 1e3;
let id = 0;
function resetDistortingTransform(key, visualElement, values, sharedAnimationValues) {
	const { latestValues } = visualElement;
	if (latestValues[key]) {
		values[key] = latestValues[key];
		visualElement.setStaticValue(key, 0);
		if (sharedAnimationValues) sharedAnimationValues[key] = 0;
	}
}
function cancelTreeOptimisedTransformAnimations(projectionNode) {
	projectionNode.hasCheckedOptimisedAppear = true;
	if (projectionNode.root === projectionNode) return;
	const { visualElement } = projectionNode.options;
	if (!visualElement) return;
	const appearId = getOptimisedAppearId(visualElement);
	if (window.MotionHasOptimisedAnimation(appearId, "transform")) {
		const { layout, layoutId } = projectionNode.options;
		window.MotionCancelOptimisedAnimation(appearId, "transform", frame, !(layout || layoutId));
	}
	const { parent } = projectionNode;
	if (parent && !parent.hasCheckedOptimisedAppear) cancelTreeOptimisedTransformAnimations(parent);
}
function createProjectionNode({ attachResizeListener, defaultParent, measureScroll, checkIsScrollRoot, resetTransform }) {
	return class ProjectionNode {
		constructor(latestValues = {}, parent = defaultParent?.()) {
			/**
			* A unique ID generated for every projection node.
			*/
			this.id = id++;
			/**
			* An id that represents a unique session instigated by startUpdate.
			*/
			this.animationId = 0;
			this.animationCommitId = 0;
			/**
			* A Set containing all this component's children. This is used to iterate
			* through the children.
			*
			* TODO: This could be faster to iterate as a flat array stored on the root node.
			*/
			this.children = /* @__PURE__ */ new Set();
			/**
			* Options for the node. We use this to configure what kind of layout animations
			* we should perform (if any).
			*/
			this.options = {};
			/**
			* We use this to detect when its safe to shut down part of a projection tree.
			* We have to keep projecting children for scale correction and relative projection
			* until all their parents stop performing layout animations.
			*/
			this.isTreeAnimating = false;
			this.isAnimationBlocked = false;
			/**
			* Flag to true if we think this layout has been changed. We can't always know this,
			* currently we set it to true every time a component renders, or if it has a layoutDependency
			* if that has changed between renders. Additionally, components can be grouped by LayoutGroup
			* and if one node is dirtied, they all are.
			*/
			this.isLayoutDirty = false;
			/**
			* Flag to true if we think the projection calculations for this node needs
			* recalculating as a result of an updated transform or layout animation.
			*/
			this.isProjectionDirty = false;
			/**
			* Flag to true if the layout *or* transform has changed. This then gets propagated
			* throughout the projection tree, forcing any element below to recalculate on the next frame.
			*/
			this.isSharedProjectionDirty = false;
			/**
			* Flag transform dirty. This gets propagated throughout the whole tree but is only
			* respected by shared nodes.
			*/
			this.isTransformDirty = false;
			/**
			* Block layout updates for instant layout transitions throughout the tree.
			*/
			this.updateManuallyBlocked = false;
			this.updateBlockedByResize = false;
			/**
			* Set to true between the start of the first `willUpdate` call and the end of the `didUpdate`
			* call.
			*/
			this.isUpdating = false;
			/**
			* If this is an SVG element we currently disable projection transforms
			*/
			this.isSVG = false;
			/**
			* Flag to true (during promotion) if a node doing an instant layout transition needs to reset
			* its projection styles.
			*/
			this.needsReset = false;
			/**
			* Flags whether this node should have its transform reset prior to measuring.
			*/
			this.shouldResetTransform = false;
			/**
			* Store whether this node has been checked for optimised appear animations. As
			* effects fire bottom-up, and we want to look up the tree for appear animations,
			* this makes sure we only check each path once, stopping at nodes that
			* have already been checked.
			*/
			this.hasCheckedOptimisedAppear = false;
			/**
			* An object representing the calculated contextual/accumulated/tree scale.
			* This will be used to scale calculcated projection transforms, as these are
			* calculated in screen-space but need to be scaled for elements to layoutly
			* make it to their calculated destinations.
			*
			* TODO: Lazy-init
			*/
			this.treeScale = {
				x: 1,
				y: 1
			};
			/**
			*
			*/
			this.eventHandlers = /* @__PURE__ */ new Map();
			this.hasTreeAnimated = false;
			this.layoutVersion = 0;
			this.updateScheduled = false;
			this.scheduleUpdate = () => this.update();
			this.projectionUpdateScheduled = false;
			this.checkUpdateFailed = () => {
				if (this.isUpdating) {
					this.isUpdating = false;
					this.clearAllSnapshots();
				}
			};
			/**
			* This is a multi-step process as shared nodes might be of different depths. Nodes
			* are sorted by depth order, so we need to resolve the entire tree before moving to
			* the next step.
			*/
			this.updateProjection = () => {
				this.projectionUpdateScheduled = false;
				/**
				* Reset debug counts. Manually resetting rather than creating a new
				* object each frame.
				*/
				if (statsBuffer.value) metrics.nodes = metrics.calculatedTargetDeltas = metrics.calculatedProjections = 0;
				this.nodes.forEach(propagateDirtyNodes);
				this.nodes.forEach(resolveTargetDelta);
				this.nodes.forEach(calcProjection);
				this.nodes.forEach(cleanDirtyNodes);
				if (statsBuffer.addProjectionMetrics) statsBuffer.addProjectionMetrics(metrics);
			};
			/**
			* Frame calculations
			*/
			this.resolvedRelativeTargetAt = 0;
			this.linkedParentVersion = 0;
			this.hasProjected = false;
			this.isVisible = true;
			this.animationProgress = 0;
			/**
			* Shared layout
			*/
			this.sharedNodes = /* @__PURE__ */ new Map();
			this.latestValues = latestValues;
			this.root = parent ? parent.root || parent : this;
			this.path = parent ? [...parent.path, parent] : [];
			this.parent = parent;
			this.depth = parent ? parent.depth + 1 : 0;
			for (let i = 0; i < this.path.length; i++) this.path[i].shouldResetTransform = true;
			if (this.root === this) this.nodes = new FlatTree();
		}
		addEventListener(name, handler) {
			if (!this.eventHandlers.has(name)) this.eventHandlers.set(name, new SubscriptionManager());
			return this.eventHandlers.get(name).add(handler);
		}
		notifyListeners(name, ...args) {
			const subscriptionManager = this.eventHandlers.get(name);
			subscriptionManager && subscriptionManager.notify(...args);
		}
		hasListeners(name) {
			return this.eventHandlers.has(name);
		}
		/**
		* Lifecycles
		*/
		mount(instance) {
			if (this.instance) return;
			this.isSVG = isSVGElement(instance) && !isSVGSVGElement(instance);
			this.instance = instance;
			const { layoutId, layout, visualElement } = this.options;
			if (visualElement && !visualElement.current) visualElement.mount(instance);
			this.root.nodes.add(this);
			this.parent && this.parent.children.add(this);
			if (this.root.hasTreeAnimated && (layout || layoutId)) this.isLayoutDirty = true;
			if (attachResizeListener) {
				let cancelDelay;
				let innerWidth = 0;
				const resizeUnblockUpdate = () => this.root.updateBlockedByResize = false;
				frame.read(() => {
					innerWidth = window.innerWidth;
				});
				attachResizeListener(instance, () => {
					const newInnerWidth = window.innerWidth;
					if (newInnerWidth === innerWidth) return;
					innerWidth = newInnerWidth;
					this.root.updateBlockedByResize = true;
					cancelDelay && cancelDelay();
					cancelDelay = delay(resizeUnblockUpdate, 250);
					if (globalProjectionState.hasAnimatedSinceResize) {
						globalProjectionState.hasAnimatedSinceResize = false;
						this.nodes.forEach(finishAnimation);
					}
				});
			}
			if (layoutId) this.root.registerSharedNode(layoutId, this);
			if (this.options.animate !== false && visualElement && (layoutId || layout)) this.addEventListener("didUpdate", ({ delta, hasLayoutChanged, hasRelativeLayoutChanged, layout: newLayout }) => {
				if (this.isTreeAnimationBlocked()) {
					this.target = void 0;
					this.relativeTarget = void 0;
					return;
				}
				const layoutTransition = this.options.transition || visualElement.getDefaultTransition() || defaultLayoutTransition;
				const { onLayoutAnimationStart, onLayoutAnimationComplete } = visualElement.getProps();
				/**
				* The target layout of the element might stay the same,
				* but its position relative to its parent has changed.
				*/
				const hasTargetChanged = !this.targetLayout || !boxEqualsRounded(this.targetLayout, newLayout);
				/**
				* If the layout hasn't seemed to have changed, it might be that the
				* element is visually in the same place in the document but its position
				* relative to its parent has indeed changed. So here we check for that.
				*/
				const hasOnlyRelativeTargetChanged = !hasLayoutChanged && hasRelativeLayoutChanged;
				if (this.options.layoutRoot || this.resumeFrom || hasOnlyRelativeTargetChanged || hasLayoutChanged && (hasTargetChanged || !this.currentAnimation)) {
					if (this.resumeFrom) {
						this.resumingFrom = this.resumeFrom;
						this.resumingFrom.resumingFrom = void 0;
					}
					const animationOptions = {
						...getValueTransition(layoutTransition, "layout"),
						onPlay: onLayoutAnimationStart,
						onComplete: onLayoutAnimationComplete
					};
					if (visualElement.shouldReduceMotion || this.options.layoutRoot) {
						animationOptions.delay = 0;
						animationOptions.type = false;
					}
					this.startAnimation(animationOptions);
					/**
					* Set animation origin after starting animation to avoid layout jump
					* caused by stopping previous layout animation
					*/
					this.setAnimationOrigin(delta, hasOnlyRelativeTargetChanged);
				} else {
					/**
					* If the layout hasn't changed and we have an animation that hasn't started yet,
					* finish it immediately. Otherwise it will be animating from a location
					* that was probably never committed to screen and look like a jumpy box.
					*/
					if (!hasLayoutChanged) finishAnimation(this);
					if (this.isLead() && this.options.onExitComplete) this.options.onExitComplete();
				}
				this.targetLayout = newLayout;
			});
		}
		unmount() {
			this.options.layoutId && this.willUpdate();
			this.root.nodes.remove(this);
			const stack = this.getStack();
			stack && stack.remove(this);
			this.parent && this.parent.children.delete(this);
			this.instance = void 0;
			this.eventHandlers.clear();
			cancelFrame(this.updateProjection);
		}
		blockUpdate() {
			this.updateManuallyBlocked = true;
		}
		unblockUpdate() {
			this.updateManuallyBlocked = false;
		}
		isUpdateBlocked() {
			return this.updateManuallyBlocked || this.updateBlockedByResize;
		}
		isTreeAnimationBlocked() {
			return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || false;
		}
		startUpdate() {
			if (this.isUpdateBlocked()) return;
			this.isUpdating = true;
			this.nodes && this.nodes.forEach(resetSkewAndRotation);
			this.animationId++;
		}
		getTransformTemplate() {
			const { visualElement } = this.options;
			return visualElement && visualElement.getProps().transformTemplate;
		}
		willUpdate(shouldNotifyListeners = true) {
			this.root.hasTreeAnimated = true;
			if (this.root.isUpdateBlocked()) {
				this.options.onExitComplete && this.options.onExitComplete();
				return;
			}
			/**
			* If we're running optimised appear animations then these must be
			* cancelled before measuring the DOM. This is so we can measure
			* the true layout of the element rather than the WAAPI animation
			* which will be unaffected by the resetSkewAndRotate step.
			*
			* Note: This is a DOM write. Worst case scenario is this is sandwiched
			* between other snapshot reads which will cause unnecessary style recalculations.
			* This has to happen here though, as we don't yet know which nodes will need
			* snapshots in startUpdate(), but we only want to cancel optimised animations
			* if a layout animation measurement is actually going to be affected by them.
			*/
			if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear) cancelTreeOptimisedTransformAnimations(this);
			!this.root.isUpdating && this.root.startUpdate();
			if (this.isLayoutDirty) return;
			this.isLayoutDirty = true;
			for (let i = 0; i < this.path.length; i++) {
				const node = this.path[i];
				node.shouldResetTransform = true;
				/**
				* Percentage translates resolve against layoutBox dimensions,
				* so ancestors with them must be re-measured after transform reset.
				*/
				if (typeof node.latestValues.x === "string" || typeof node.latestValues.y === "string") node.isLayoutDirty = true;
				node.updateScroll("snapshot");
				if (node.options.layoutRoot) node.willUpdate(false);
			}
			const { layoutId, layout } = this.options;
			if (layoutId === void 0 && !layout) return;
			const transformTemplate = this.getTransformTemplate();
			this.prevTransformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
			this.updateSnapshot();
			shouldNotifyListeners && this.notifyListeners("willUpdate");
		}
		update() {
			this.updateScheduled = false;
			if (this.isUpdateBlocked()) {
				this.unblockUpdate();
				this.clearAllSnapshots();
				this.nodes.forEach(clearMeasurements);
				return;
			}
			/**
			* If this is a repeat of didUpdate then ignore the animation.
			*/
			if (this.animationId <= this.animationCommitId) {
				this.nodes.forEach(clearIsLayoutDirty);
				return;
			}
			this.animationCommitId = this.animationId;
			if (!this.isUpdating) this.nodes.forEach(clearIsLayoutDirty);
			else {
				this.isUpdating = false;
				/**
				* Write
				*/
				this.nodes.forEach(resetTransformStyle);
				/**
				* Read ==================
				*/
				this.nodes.forEach(updateLayout);
				/**
				* Write
				*/
				this.nodes.forEach(notifyLayoutUpdate);
			}
			this.clearAllSnapshots();
			/**
			* Manually flush any pending updates. Ideally
			* we could leave this to the following requestAnimationFrame but this seems
			* to leave a flash of incorrectly styled content.
			*/
			const now = time.now();
			frameData.delta = clamp(0, 1e3 / 60, now - frameData.timestamp);
			frameData.timestamp = now;
			frameData.isProcessing = true;
			frameSteps.update.process(frameData);
			frameSteps.preRender.process(frameData);
			frameSteps.render.process(frameData);
			frameData.isProcessing = false;
		}
		didUpdate() {
			if (!this.updateScheduled) {
				this.updateScheduled = true;
				microtask.read(this.scheduleUpdate);
			}
		}
		clearAllSnapshots() {
			this.nodes.forEach(clearSnapshot);
			this.sharedNodes.forEach(removeLeadSnapshots);
		}
		scheduleUpdateProjection() {
			if (!this.projectionUpdateScheduled) {
				this.projectionUpdateScheduled = true;
				frame.preRender(this.updateProjection, false, true);
			}
		}
		scheduleCheckAfterUnmount() {
			/**
			* If the unmounting node is in a layoutGroup and did trigger a willUpdate,
			* we manually call didUpdate to give a chance to the siblings to animate.
			* Otherwise, cleanup all snapshots to prevents future nodes from reusing them.
			*/
			frame.postRender(() => {
				if (this.isLayoutDirty) this.root.didUpdate();
				else this.root.checkUpdateFailed();
			});
		}
		/**
		* Update measurements
		*/
		updateSnapshot() {
			if (this.snapshot || !this.instance) return;
			this.snapshot = this.measure();
			if (this.snapshot && !calcLength(this.snapshot.measuredBox.x) && !calcLength(this.snapshot.measuredBox.y)) this.snapshot = void 0;
		}
		updateLayout() {
			if (!this.instance) return;
			this.updateScroll();
			if (!(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty) return;
			/**
			* When a node is mounted, it simply resumes from the prevLead's
			* snapshot instead of taking a new one, but the ancestors scroll
			* might have updated while the prevLead is unmounted. We need to
			* update the scroll again to make sure the layout we measure is
			* up to date.
			*/
			if (this.resumeFrom && !this.resumeFrom.instance) for (let i = 0; i < this.path.length; i++) this.path[i].updateScroll();
			const prevLayout = this.layout;
			this.layout = this.measure(false);
			this.layoutVersion++;
			this.layoutCorrected = createBox();
			this.isLayoutDirty = false;
			this.projectionDelta = void 0;
			this.notifyListeners("measure", this.layout.layoutBox);
			const { visualElement } = this.options;
			visualElement && visualElement.notify("LayoutMeasure", this.layout.layoutBox, prevLayout ? prevLayout.layoutBox : void 0);
		}
		updateScroll(phase = "measure") {
			let needsMeasurement = Boolean(this.options.layoutScroll && this.instance);
			if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === phase) needsMeasurement = false;
			if (needsMeasurement && this.instance) {
				const isRoot = checkIsScrollRoot(this.instance);
				this.scroll = {
					animationId: this.root.animationId,
					phase,
					isRoot,
					offset: measureScroll(this.instance),
					wasRoot: this.scroll ? this.scroll.isRoot : isRoot
				};
			}
		}
		resetTransform() {
			if (!resetTransform) return;
			const isResetRequested = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout;
			const hasProjection = this.projectionDelta && !isDeltaZero(this.projectionDelta);
			const transformTemplate = this.getTransformTemplate();
			const transformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
			const transformTemplateHasChanged = transformTemplateValue !== this.prevTransformTemplateValue;
			if (isResetRequested && this.instance && (hasProjection || hasTransform(this.latestValues) || transformTemplateHasChanged)) {
				resetTransform(this.instance, transformTemplateValue);
				this.shouldResetTransform = false;
				this.scheduleRender();
			}
		}
		measure(removeTransform = true) {
			const pageBox = this.measurePageBox();
			let layoutBox = this.removeElementScroll(pageBox);
			/**
			* Measurements taken during the pre-render stage
			* still have transforms applied so we remove them
			* via calculation.
			*/
			if (removeTransform) layoutBox = this.removeTransform(layoutBox);
			roundBox(layoutBox);
			return {
				animationId: this.root.animationId,
				measuredBox: pageBox,
				layoutBox,
				latestValues: {},
				source: this.id
			};
		}
		measurePageBox() {
			const { visualElement } = this.options;
			if (!visualElement) return createBox();
			const box = visualElement.measureViewportBox();
			if (!(this.scroll?.wasRoot || this.path.some(checkNodeWasScrollRoot))) {
				const { scroll } = this.root;
				if (scroll) {
					translateAxis(box.x, scroll.offset.x);
					translateAxis(box.y, scroll.offset.y);
				}
			}
			return box;
		}
		removeElementScroll(box) {
			const boxWithoutScroll = createBox();
			copyBoxInto(boxWithoutScroll, box);
			if (this.scroll?.wasRoot) return boxWithoutScroll;
			/**
			* Performance TODO: Keep a cumulative scroll offset down the tree
			* rather than loop back up the path.
			*/
			for (let i = 0; i < this.path.length; i++) {
				const node = this.path[i];
				const { scroll, options } = node;
				if (node !== this.root && scroll && options.layoutScroll) {
					/**
					* If this is a new scroll root, we want to remove all previous scrolls
					* from the viewport box.
					*/
					if (scroll.wasRoot) copyBoxInto(boxWithoutScroll, box);
					translateAxis(boxWithoutScroll.x, scroll.offset.x);
					translateAxis(boxWithoutScroll.y, scroll.offset.y);
				}
			}
			return boxWithoutScroll;
		}
		applyTransform(box, transformOnly = false) {
			const withTransforms = createBox();
			copyBoxInto(withTransforms, box);
			for (let i = 0; i < this.path.length; i++) {
				const node = this.path[i];
				if (!transformOnly && node.options.layoutScroll && node.scroll && node !== node.root) transformBox(withTransforms, {
					x: -node.scroll.offset.x,
					y: -node.scroll.offset.y
				});
				if (!hasTransform(node.latestValues)) continue;
				transformBox(withTransforms, node.latestValues, node.layout?.layoutBox);
			}
			if (hasTransform(this.latestValues)) transformBox(withTransforms, this.latestValues, this.layout?.layoutBox);
			return withTransforms;
		}
		removeTransform(box) {
			const boxWithoutTransform = createBox();
			copyBoxInto(boxWithoutTransform, box);
			for (let i = 0; i < this.path.length; i++) {
				const node = this.path[i];
				if (!hasTransform(node.latestValues)) continue;
				let sourceBox;
				if (node.instance) {
					hasScale(node.latestValues) && node.updateSnapshot();
					sourceBox = createBox();
					copyBoxInto(sourceBox, node.measurePageBox());
				}
				removeBoxTransforms(boxWithoutTransform, node.latestValues, node.snapshot?.layoutBox, sourceBox);
			}
			if (hasTransform(this.latestValues)) removeBoxTransforms(boxWithoutTransform, this.latestValues);
			return boxWithoutTransform;
		}
		setTargetDelta(delta) {
			this.targetDelta = delta;
			this.root.scheduleUpdateProjection();
			this.isProjectionDirty = true;
		}
		setOptions(options) {
			this.options = {
				...this.options,
				...options,
				crossfade: options.crossfade !== void 0 ? options.crossfade : true
			};
		}
		clearMeasurements() {
			this.scroll = void 0;
			this.layout = void 0;
			this.snapshot = void 0;
			this.prevTransformTemplateValue = void 0;
			this.targetDelta = void 0;
			this.target = void 0;
			this.isLayoutDirty = false;
		}
		forceRelativeParentToResolveTarget() {
			if (!this.relativeParent) return;
			/**
			* If the parent target isn't up-to-date, force it to update.
			* This is an unfortunate de-optimisation as it means any updating relative
			* projection will cause all the relative parents to recalculate back
			* up the tree.
			*/
			if (this.relativeParent.resolvedRelativeTargetAt !== frameData.timestamp) this.relativeParent.resolveTargetDelta(true);
		}
		resolveTargetDelta(forceRecalculation = false) {
			/**
			* Once the dirty status of nodes has been spread through the tree, we also
			* need to check if we have a shared node of a different depth that has itself
			* been dirtied.
			*/
			const lead = this.getLead();
			this.isProjectionDirty || (this.isProjectionDirty = lead.isProjectionDirty);
			this.isTransformDirty || (this.isTransformDirty = lead.isTransformDirty);
			this.isSharedProjectionDirty || (this.isSharedProjectionDirty = lead.isSharedProjectionDirty);
			const isShared = Boolean(this.resumingFrom) || this !== lead;
			if (!(forceRecalculation || isShared && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize)) return;
			const { layout, layoutId } = this.options;
			/**
			* If we have no layout, we can't perform projection, so early return
			*/
			if (!this.layout || !(layout || layoutId)) return;
			this.resolvedRelativeTargetAt = frameData.timestamp;
			const relativeParent = this.getClosestProjectingParent();
			if (relativeParent && this.linkedParentVersion !== relativeParent.layoutVersion && !relativeParent.options.layoutRoot) this.removeRelativeTarget();
			/**
			* If we don't have a targetDelta but do have a layout, we can attempt to resolve
			* a relativeParent. This will allow a component to perform scale correction
			* even if no animation has started.
			*/
			if (!this.targetDelta && !this.relativeTarget) {
				if (relativeParent && relativeParent.layout) this.createRelativeTarget(relativeParent, this.layout.layoutBox, relativeParent.layout.layoutBox);
				else this.removeRelativeTarget();
			}
			/**
			* If we have no relative target or no target delta our target isn't valid
			* for this frame.
			*/
			if (!this.relativeTarget && !this.targetDelta) return;
			/**
			* Lazy-init target data structure
			*/
			if (!this.target) {
				this.target = createBox();
				this.targetWithTransforms = createBox();
			}
			/**
			* If we've got a relative box for this component, resolve it into a target relative to the parent.
			*/
			if (this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target) {
				this.forceRelativeParentToResolveTarget();
				calcRelativeBox(this.target, this.relativeTarget, this.relativeParent.target);
			} else if (this.targetDelta) {
				if (Boolean(this.resumingFrom)) this.target = this.applyTransform(this.layout.layoutBox);
				else copyBoxInto(this.target, this.layout.layoutBox);
				applyBoxDelta(this.target, this.targetDelta);
			} else
 /**
			* If no target, use own layout as target
			*/
			copyBoxInto(this.target, this.layout.layoutBox);
			/**
			* If we've been told to attempt to resolve a relative target, do so.
			*/
			if (this.attemptToResolveRelativeTarget) {
				this.attemptToResolveRelativeTarget = false;
				if (relativeParent && Boolean(relativeParent.resumingFrom) === Boolean(this.resumingFrom) && !relativeParent.options.layoutScroll && relativeParent.target && this.animationProgress !== 1) this.createRelativeTarget(relativeParent, this.target, relativeParent.target);
				else this.relativeParent = this.relativeTarget = void 0;
			}
			/**
			* Increase debug counter for resolved target deltas
			*/
			if (statsBuffer.value) metrics.calculatedTargetDeltas++;
		}
		getClosestProjectingParent() {
			if (!this.parent || hasScale(this.parent.latestValues) || has2DTranslate(this.parent.latestValues)) return;
			if (this.parent.isProjecting()) return this.parent;
			else return this.parent.getClosestProjectingParent();
		}
		isProjecting() {
			return Boolean((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
		}
		createRelativeTarget(relativeParent, layout, parentLayout) {
			this.relativeParent = relativeParent;
			this.linkedParentVersion = relativeParent.layoutVersion;
			this.forceRelativeParentToResolveTarget();
			this.relativeTarget = createBox();
			this.relativeTargetOrigin = createBox();
			calcRelativePosition(this.relativeTargetOrigin, layout, parentLayout);
			copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
		}
		removeRelativeTarget() {
			this.relativeParent = this.relativeTarget = void 0;
		}
		calcProjection() {
			const lead = this.getLead();
			const isShared = Boolean(this.resumingFrom) || this !== lead;
			let canSkip = true;
			/**
			* If this is a normal layout animation and neither this node nor its nearest projecting
			* is dirty then we can't skip.
			*/
			if (this.isProjectionDirty || this.parent?.isProjectionDirty) canSkip = false;
			/**
			* If this is a shared layout animation and this node's shared projection is dirty then
			* we can't skip.
			*/
			if (isShared && (this.isSharedProjectionDirty || this.isTransformDirty)) canSkip = false;
			/**
			* If we have resolved the target this frame we must recalculate the
			* projection to ensure it visually represents the internal calculations.
			*/
			if (this.resolvedRelativeTargetAt === frameData.timestamp) canSkip = false;
			if (canSkip) return;
			const { layout, layoutId } = this.options;
			/**
			* If this section of the tree isn't animating we can
			* delete our target sources for the following frame.
			*/
			this.isTreeAnimating = Boolean(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation);
			if (!this.isTreeAnimating) this.targetDelta = this.relativeTarget = void 0;
			if (!this.layout || !(layout || layoutId)) return;
			/**
			* Reset the corrected box with the latest values from box, as we're then going
			* to perform mutative operations on it.
			*/
			copyBoxInto(this.layoutCorrected, this.layout.layoutBox);
			/**
			* Record previous tree scales before updating.
			*/
			const prevTreeScaleX = this.treeScale.x;
			const prevTreeScaleY = this.treeScale.y;
			/**
			* Apply all the parent deltas to this box to produce the corrected box. This
			* is the layout box, as it will appear on screen as a result of the transforms of its parents.
			*/
			applyTreeDeltas(this.layoutCorrected, this.treeScale, this.path, isShared);
			/**
			* If this layer needs to perform scale correction but doesn't have a target,
			* use the layout as the target.
			*/
			if (lead.layout && !lead.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1)) {
				lead.target = lead.layout.layoutBox;
				lead.targetWithTransforms = createBox();
			}
			const { target } = lead;
			if (!target) {
				/**
				* If we don't have a target to project into, but we were previously
				* projecting, we want to remove the stored transform and schedule
				* a render to ensure the elements reflect the removed transform.
				*/
				if (this.prevProjectionDelta) {
					this.createProjectionDeltas();
					this.scheduleRender();
				}
				return;
			}
			if (!this.projectionDelta || !this.prevProjectionDelta) this.createProjectionDeltas();
			else {
				copyAxisDeltaInto(this.prevProjectionDelta.x, this.projectionDelta.x);
				copyAxisDeltaInto(this.prevProjectionDelta.y, this.projectionDelta.y);
			}
			/**
			* Update the delta between the corrected box and the target box before user-set transforms were applied.
			* This will allow us to calculate the corrected borderRadius and boxShadow to compensate
			* for our layout reprojection, but still allow them to be scaled correctly by the user.
			* It might be that to simplify this we may want to accept that user-set scale is also corrected
			* and we wouldn't have to keep and calc both deltas, OR we could support a user setting
			* to allow people to choose whether these styles are corrected based on just the
			* layout reprojection or the final bounding box.
			*/
			calcBoxDelta(this.projectionDelta, this.layoutCorrected, target, this.latestValues);
			if (this.treeScale.x !== prevTreeScaleX || this.treeScale.y !== prevTreeScaleY || !axisDeltaEquals(this.projectionDelta.x, this.prevProjectionDelta.x) || !axisDeltaEquals(this.projectionDelta.y, this.prevProjectionDelta.y)) {
				this.hasProjected = true;
				this.scheduleRender();
				this.notifyListeners("projectionUpdate", target);
			}
			/**
			* Increase debug counter for recalculated projections
			*/
			if (statsBuffer.value) metrics.calculatedProjections++;
		}
		hide() {
			this.isVisible = false;
		}
		show() {
			this.isVisible = true;
		}
		scheduleRender(notifyAll = true) {
			this.options.visualElement?.scheduleRender();
			if (notifyAll) {
				const stack = this.getStack();
				stack && stack.scheduleRender();
			}
			if (this.resumingFrom && !this.resumingFrom.instance) this.resumingFrom = void 0;
		}
		createProjectionDeltas() {
			this.prevProjectionDelta = createDelta();
			this.projectionDelta = createDelta();
			this.projectionDeltaWithTransform = createDelta();
		}
		setAnimationOrigin(delta, hasOnlyRelativeTargetChanged = false) {
			const snapshot = this.snapshot;
			const snapshotLatestValues = snapshot ? snapshot.latestValues : {};
			const mixedValues = { ...this.latestValues };
			const targetDelta = createDelta();
			if (!this.relativeParent || !this.relativeParent.options.layoutRoot) this.relativeTarget = this.relativeTargetOrigin = void 0;
			this.attemptToResolveRelativeTarget = !hasOnlyRelativeTargetChanged;
			const relativeLayout = createBox();
			const isSharedLayoutAnimation = (snapshot ? snapshot.source : void 0) !== (this.layout ? this.layout.source : void 0);
			const stack = this.getStack();
			const isOnlyMember = !stack || stack.members.length <= 1;
			const shouldCrossfadeOpacity = Boolean(isSharedLayoutAnimation && !isOnlyMember && this.options.crossfade === true && !this.path.some(hasOpacityCrossfade));
			this.animationProgress = 0;
			let prevRelativeTarget;
			this.mixTargetDelta = (latest) => {
				const progress = latest / 1e3;
				mixAxisDelta(targetDelta.x, delta.x, progress);
				mixAxisDelta(targetDelta.y, delta.y, progress);
				this.setTargetDelta(targetDelta);
				if (this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout) {
					calcRelativePosition(relativeLayout, this.layout.layoutBox, this.relativeParent.layout.layoutBox);
					mixBox(this.relativeTarget, this.relativeTargetOrigin, relativeLayout, progress);
					/**
					* If this is an unchanged relative target we can consider the
					* projection not dirty.
					*/
					if (prevRelativeTarget && boxEquals(this.relativeTarget, prevRelativeTarget)) this.isProjectionDirty = false;
					if (!prevRelativeTarget) prevRelativeTarget = createBox();
					copyBoxInto(prevRelativeTarget, this.relativeTarget);
				}
				if (isSharedLayoutAnimation) {
					this.animationValues = mixedValues;
					mixValues(mixedValues, snapshotLatestValues, this.latestValues, progress, shouldCrossfadeOpacity, isOnlyMember);
				}
				this.root.scheduleUpdateProjection();
				this.scheduleRender();
				this.animationProgress = progress;
			};
			this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
		}
		startAnimation(options) {
			this.notifyListeners("animationStart");
			this.currentAnimation?.stop();
			this.resumingFrom?.currentAnimation?.stop();
			if (this.pendingAnimation) {
				cancelFrame(this.pendingAnimation);
				this.pendingAnimation = void 0;
			}
			/**
			* Start the animation in the next frame to have a frame with progress 0,
			* where the target is the same as when the animation started, so we can
			* calculate the relative positions correctly for instant transitions.
			*/
			this.pendingAnimation = frame.update(() => {
				globalProjectionState.hasAnimatedSinceResize = true;
				activeAnimations.layout++;
				this.motionValue || (this.motionValue = motionValue(0));
				this.motionValue.jump(0, false);
				this.currentAnimation = animateSingleValue(this.motionValue, [0, 1e3], {
					...options,
					velocity: 0,
					isSync: true,
					onUpdate: (latest) => {
						this.mixTargetDelta(latest);
						options.onUpdate && options.onUpdate(latest);
					},
					onStop: () => {
						activeAnimations.layout--;
					},
					onComplete: () => {
						activeAnimations.layout--;
						options.onComplete && options.onComplete();
						this.completeAnimation();
					}
				});
				if (this.resumingFrom) this.resumingFrom.currentAnimation = this.currentAnimation;
				this.pendingAnimation = void 0;
			});
		}
		completeAnimation() {
			if (this.resumingFrom) {
				this.resumingFrom.currentAnimation = void 0;
				this.resumingFrom.preserveOpacity = void 0;
			}
			const stack = this.getStack();
			stack && stack.exitAnimationComplete();
			this.resumingFrom = this.currentAnimation = this.animationValues = void 0;
			this.notifyListeners("animationComplete");
		}
		finishAnimation() {
			if (this.currentAnimation) {
				this.mixTargetDelta && this.mixTargetDelta(animationTarget);
				this.currentAnimation.stop();
			}
			this.completeAnimation();
		}
		applyTransformsToTarget() {
			const lead = this.getLead();
			let { targetWithTransforms, target, layout, latestValues } = lead;
			if (!targetWithTransforms || !target || !layout) return;
			/**
			* If we're only animating position, and this element isn't the lead element,
			* then instead of projecting into the lead box we instead want to calculate
			* a new target that aligns the two boxes but maintains the layout shape.
			*/
			if (this !== lead && this.layout && layout && shouldAnimatePositionOnly(this.options.animationType, this.layout.layoutBox, layout.layoutBox)) {
				target = this.target || createBox();
				const xLength = calcLength(this.layout.layoutBox.x);
				target.x.min = lead.target.x.min;
				target.x.max = target.x.min + xLength;
				const yLength = calcLength(this.layout.layoutBox.y);
				target.y.min = lead.target.y.min;
				target.y.max = target.y.min + yLength;
			}
			copyBoxInto(targetWithTransforms, target);
			/**
			* Apply the latest user-set transforms to the targetBox to produce the targetBoxFinal.
			* This is the final box that we will then project into by calculating a transform delta and
			* applying it to the corrected box.
			*/
			transformBox(targetWithTransforms, latestValues);
			/**
			* Update the delta between the corrected box and the final target box, after
			* user-set transforms are applied to it. This will be used by the renderer to
			* create a transform style that will reproject the element from its layout layout
			* into the desired bounding box.
			*/
			calcBoxDelta(this.projectionDeltaWithTransform, this.layoutCorrected, targetWithTransforms, latestValues);
		}
		registerSharedNode(layoutId, node) {
			if (!this.sharedNodes.has(layoutId)) this.sharedNodes.set(layoutId, new NodeStack());
			this.sharedNodes.get(layoutId).add(node);
			const config = node.options.initialPromotionConfig;
			node.promote({
				transition: config ? config.transition : void 0,
				preserveFollowOpacity: config && config.shouldPreserveFollowOpacity ? config.shouldPreserveFollowOpacity(node) : void 0
			});
		}
		isLead() {
			const stack = this.getStack();
			return stack ? stack.lead === this : true;
		}
		getLead() {
			const { layoutId } = this.options;
			return layoutId ? this.getStack()?.lead || this : this;
		}
		getPrevLead() {
			const { layoutId } = this.options;
			return layoutId ? this.getStack()?.prevLead : void 0;
		}
		getStack() {
			const { layoutId } = this.options;
			if (layoutId) return this.root.sharedNodes.get(layoutId);
		}
		promote({ needsReset, transition, preserveFollowOpacity } = {}) {
			const stack = this.getStack();
			if (stack) stack.promote(this, preserveFollowOpacity);
			if (needsReset) {
				this.projectionDelta = void 0;
				this.needsReset = true;
			}
			if (transition) this.setOptions({ transition });
		}
		relegate() {
			const stack = this.getStack();
			if (stack) return stack.relegate(this);
			else return false;
		}
		resetSkewAndRotation() {
			const { visualElement } = this.options;
			if (!visualElement) return;
			let hasDistortingTransform = false;
			/**
			* An unrolled check for rotation values. Most elements don't have any rotation and
			* skipping the nested loop and new object creation is 50% faster.
			*/
			const { latestValues } = visualElement;
			if (latestValues.z || latestValues.rotate || latestValues.rotateX || latestValues.rotateY || latestValues.rotateZ || latestValues.skewX || latestValues.skewY) hasDistortingTransform = true;
			if (!hasDistortingTransform) return;
			const resetValues = {};
			if (latestValues.z) resetDistortingTransform("z", visualElement, resetValues, this.animationValues);
			for (let i = 0; i < transformAxes.length; i++) {
				resetDistortingTransform(`rotate${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
				resetDistortingTransform(`skew${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
			}
			visualElement.render();
			for (const key in resetValues) {
				visualElement.setStaticValue(key, resetValues[key]);
				if (this.animationValues) this.animationValues[key] = resetValues[key];
			}
			visualElement.scheduleRender();
		}
		applyProjectionStyles(targetStyle, styleProp) {
			if (!this.instance || this.isSVG) return;
			if (!this.isVisible) {
				targetStyle.visibility = "hidden";
				return;
			}
			const transformTemplate = this.getTransformTemplate();
			if (this.needsReset) {
				this.needsReset = false;
				targetStyle.visibility = "";
				targetStyle.opacity = "";
				targetStyle.pointerEvents = resolveMotionValue(styleProp?.pointerEvents) || "";
				targetStyle.transform = transformTemplate ? transformTemplate(this.latestValues, "") : "none";
				return;
			}
			const lead = this.getLead();
			if (!this.projectionDelta || !this.layout || !lead.target) {
				if (this.options.layoutId) {
					targetStyle.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1;
					targetStyle.pointerEvents = resolveMotionValue(styleProp?.pointerEvents) || "";
				}
				if (this.hasProjected && !hasTransform(this.latestValues)) {
					targetStyle.transform = transformTemplate ? transformTemplate({}, "") : "none";
					this.hasProjected = false;
				}
				return;
			}
			targetStyle.visibility = "";
			const valuesToRender = lead.animationValues || lead.latestValues;
			this.applyTransformsToTarget();
			let transform = buildProjectionTransform(this.projectionDeltaWithTransform, this.treeScale, valuesToRender);
			if (transformTemplate) transform = transformTemplate(valuesToRender, transform);
			targetStyle.transform = transform;
			const { x, y } = this.projectionDelta;
			targetStyle.transformOrigin = `${x.origin * 100}% ${y.origin * 100}% 0`;
			if (lead.animationValues)
 /**
			* If the lead component is animating, assign this either the entering/leaving
			* opacity
			*/
			targetStyle.opacity = lead === this ? valuesToRender.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : valuesToRender.opacityExit;
			else
 /**
			* Or we're not animating at all, set the lead component to its layout
			* opacity and other components to hidden.
			*/
			targetStyle.opacity = lead === this ? valuesToRender.opacity !== void 0 ? valuesToRender.opacity : "" : valuesToRender.opacityExit !== void 0 ? valuesToRender.opacityExit : 0;
			/**
			* Apply scale correction
			*/
			for (const key in scaleCorrectors) {
				if (valuesToRender[key] === void 0) continue;
				const { correct, applyTo, isCSSVariable } = scaleCorrectors[key];
				/**
				* Only apply scale correction to the value if we have an
				* active projection transform. Otherwise these values become
				* vulnerable to distortion if the element changes size without
				* a corresponding layout animation.
				*/
				const corrected = transform === "none" ? valuesToRender[key] : correct(valuesToRender[key], lead);
				if (applyTo) {
					const num = applyTo.length;
					for (let i = 0; i < num; i++) targetStyle[applyTo[i]] = corrected;
				} else if (isCSSVariable) this.options.visualElement.renderState.vars[key] = corrected;
				else targetStyle[key] = corrected;
			}
			/**
			* Disable pointer events on follow components. This is to ensure
			* that if a follow component covers a lead component it doesn't block
			* pointer events on the lead.
			*/
			if (this.options.layoutId) targetStyle.pointerEvents = lead === this ? resolveMotionValue(styleProp?.pointerEvents) || "" : "none";
		}
		clearSnapshot() {
			this.resumeFrom = this.snapshot = void 0;
		}
		resetTree() {
			this.root.nodes.forEach((node) => node.currentAnimation?.stop());
			this.root.nodes.forEach(clearMeasurements);
			this.root.sharedNodes.clear();
		}
	};
}
function updateLayout(node) {
	node.updateLayout();
}
function notifyLayoutUpdate(node) {
	const snapshot = node.resumeFrom?.snapshot || node.snapshot;
	if (node.isLead() && node.layout && snapshot && node.hasListeners("didUpdate")) {
		const { layoutBox: layout, measuredBox: measuredLayout } = node.layout;
		const { animationType } = node.options;
		const isShared = snapshot.source !== node.layout.source;
		if (animationType === "size") eachAxis((axis) => {
			const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
			const length = calcLength(axisSnapshot);
			axisSnapshot.min = layout[axis].min;
			axisSnapshot.max = axisSnapshot.min + length;
		});
		else if (animationType === "x" || animationType === "y") {
			const snapAxis = animationType === "x" ? "y" : "x";
			copyAxisInto(isShared ? snapshot.measuredBox[snapAxis] : snapshot.layoutBox[snapAxis], layout[snapAxis]);
		} else if (shouldAnimatePositionOnly(animationType, snapshot.layoutBox, layout)) eachAxis((axis) => {
			const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
			const length = calcLength(layout[axis]);
			axisSnapshot.max = axisSnapshot.min + length;
			/**
			* Ensure relative target gets resized and rerendererd
			*/
			if (node.relativeTarget && !node.currentAnimation) {
				node.isProjectionDirty = true;
				node.relativeTarget[axis].max = node.relativeTarget[axis].min + length;
			}
		});
		const layoutDelta = createDelta();
		calcBoxDelta(layoutDelta, layout, snapshot.layoutBox);
		const visualDelta = createDelta();
		if (isShared) calcBoxDelta(visualDelta, node.applyTransform(measuredLayout, true), snapshot.measuredBox);
		else calcBoxDelta(visualDelta, layout, snapshot.layoutBox);
		const hasLayoutChanged = !isDeltaZero(layoutDelta);
		let hasRelativeLayoutChanged = false;
		if (!node.resumeFrom) {
			const relativeParent = node.getClosestProjectingParent();
			/**
			* If the relativeParent is itself resuming from a different element then
			* the relative snapshot is not relavent
			*/
			if (relativeParent && !relativeParent.resumeFrom) {
				const { snapshot: parentSnapshot, layout: parentLayout } = relativeParent;
				if (parentSnapshot && parentLayout) {
					const relativeSnapshot = createBox();
					calcRelativePosition(relativeSnapshot, snapshot.layoutBox, parentSnapshot.layoutBox);
					const relativeLayout = createBox();
					calcRelativePosition(relativeLayout, layout, parentLayout.layoutBox);
					if (!boxEqualsRounded(relativeSnapshot, relativeLayout)) hasRelativeLayoutChanged = true;
					if (relativeParent.options.layoutRoot) {
						node.relativeTarget = relativeLayout;
						node.relativeTargetOrigin = relativeSnapshot;
						node.relativeParent = relativeParent;
					}
				}
			}
		}
		node.notifyListeners("didUpdate", {
			layout,
			snapshot,
			delta: visualDelta,
			layoutDelta,
			hasLayoutChanged,
			hasRelativeLayoutChanged
		});
	} else if (node.isLead()) {
		const { onExitComplete } = node.options;
		onExitComplete && onExitComplete();
	}
	/**
	* Clearing transition
	* TODO: Investigate why this transition is being passed in as {type: false } from Framer
	* and why we need it at all
	*/
	node.options.transition = void 0;
}
function propagateDirtyNodes(node) {
	/**
	* Increase debug counter for nodes encountered this frame
	*/
	if (statsBuffer.value) metrics.nodes++;
	if (!node.parent) return;
	/**
	* If this node isn't projecting, propagate isProjectionDirty. It will have
	* no performance impact but it will allow the next child that *is* projecting
	* but *isn't* dirty to just check its parent to see if *any* ancestor needs
	* correcting.
	*/
	if (!node.isProjecting()) node.isProjectionDirty = node.parent.isProjectionDirty;
	/**
	* Propagate isSharedProjectionDirty and isTransformDirty
	* throughout the whole tree. A future revision can take another look at
	* this but for safety we still recalcualte shared nodes.
	*/
	node.isSharedProjectionDirty || (node.isSharedProjectionDirty = Boolean(node.isProjectionDirty || node.parent.isProjectionDirty || node.parent.isSharedProjectionDirty));
	node.isTransformDirty || (node.isTransformDirty = node.parent.isTransformDirty);
}
function cleanDirtyNodes(node) {
	node.isProjectionDirty = node.isSharedProjectionDirty = node.isTransformDirty = false;
}
function clearSnapshot(node) {
	node.clearSnapshot();
}
function clearMeasurements(node) {
	node.clearMeasurements();
}
function clearIsLayoutDirty(node) {
	node.isLayoutDirty = false;
}
function resetTransformStyle(node) {
	const { visualElement } = node.options;
	if (visualElement && visualElement.getProps().onBeforeLayoutMeasure) visualElement.notify("BeforeLayoutMeasure");
	node.resetTransform();
}
function finishAnimation(node) {
	node.finishAnimation();
	node.targetDelta = node.relativeTarget = node.target = void 0;
	node.isProjectionDirty = true;
}
function resolveTargetDelta(node) {
	node.resolveTargetDelta();
}
function calcProjection(node) {
	node.calcProjection();
}
function resetSkewAndRotation(node) {
	node.resetSkewAndRotation();
}
function removeLeadSnapshots(stack) {
	stack.removeLeadSnapshot();
}
function mixAxisDelta(output, delta, p) {
	output.translate = mixNumber$1(delta.translate, 0, p);
	output.scale = mixNumber$1(delta.scale, 1, p);
	output.origin = delta.origin;
	output.originPoint = delta.originPoint;
}
function mixAxis(output, from, to, p) {
	output.min = mixNumber$1(from.min, to.min, p);
	output.max = mixNumber$1(from.max, to.max, p);
}
function mixBox(output, from, to, p) {
	mixAxis(output.x, from.x, to.x, p);
	mixAxis(output.y, from.y, to.y, p);
}
function hasOpacityCrossfade(node) {
	return node.animationValues && node.animationValues.opacityExit !== void 0;
}
const defaultLayoutTransition = {
	duration: .45,
	ease: [
		.4,
		0,
		.1,
		1
	]
};
const userAgentContains = (string) => typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(string);
/**
* Measured bounding boxes must be rounded in Safari and
* left untouched in Chrome, otherwise non-integer layouts within scaled-up elements
* can appear to jump.
*/
const roundPoint = userAgentContains("applewebkit/") && !userAgentContains("chrome/") ? Math.round : noop$1;
function roundAxis(axis) {
	axis.min = roundPoint(axis.min);
	axis.max = roundPoint(axis.max);
}
function roundBox(box) {
	roundAxis(box.x);
	roundAxis(box.y);
}
function shouldAnimatePositionOnly(animationType, snapshot, layout) {
	return animationType === "position" || animationType === "preserve-aspect" && !isNear(aspectRatio(snapshot), aspectRatio(layout), .2);
}
function checkNodeWasScrollRoot(node) {
	return node !== node.root && node.scroll?.wasRoot;
}

//#endregion
//#region ../../node_modules/motion-dom/dist/es/projection/node/DocumentProjectionNode.mjs
const DocumentProjectionNode = createProjectionNode({
	attachResizeListener: (ref, notify) => addDomEvent(ref, "resize", notify),
	measureScroll: () => ({
		x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
		y: document.documentElement.scrollTop || document.body?.scrollTop || 0
	}),
	checkIsScrollRoot: () => true
});

//#endregion
//#region ../../node_modules/motion-dom/dist/es/projection/node/HTMLProjectionNode.mjs
const rootProjectionNode = { current: void 0 };
const HTMLProjectionNode = createProjectionNode({
	measureScroll: (instance) => ({
		x: instance.scrollLeft,
		y: instance.scrollTop
	}),
	defaultParent: () => {
		if (!rootProjectionNode.current) {
			const documentNode = new DocumentProjectionNode({});
			documentNode.mount(window);
			documentNode.setOptions({ layoutScroll: true });
			rootProjectionNode.current = documentNode;
		}
		return rootProjectionNode.current;
	},
	resetTransform: (instance, value) => {
		instance.style.transform = value !== void 0 ? value : "none";
	},
	checkIsScrollRoot: (instance) => Boolean(window.getComputedStyle(instance).position === "fixed")
});

//#endregion
//#region ../../node_modules/motion-dom/dist/es/layout/LayoutAnimationBuilder.mjs
const layoutSelector = "[data-layout], [data-layout-id]";
const noop = () => {};
function snapshotFromTarget(projection) {
	const target = projection.targetWithTransforms || projection.target;
	if (!target) return void 0;
	const measuredBox = createBox();
	const layoutBox = createBox();
	copyBoxInto(measuredBox, target);
	copyBoxInto(layoutBox, target);
	return {
		animationId: projection.root?.animationId ?? 0,
		measuredBox,
		layoutBox,
		latestValues: projection.animationValues || projection.latestValues || {},
		source: projection.id
	};
}
var LayoutAnimationBuilder = class {
	constructor(scope, updateDom, defaultOptions) {
		this.sharedTransitions = /* @__PURE__ */ new Map();
		this.notifyReady = noop;
		this.rejectReady = noop;
		this.scope = scope;
		this.updateDom = updateDom;
		this.defaultOptions = defaultOptions;
		this.readyPromise = new Promise((resolve, reject) => {
			this.notifyReady = resolve;
			this.rejectReady = reject;
		});
		frame.postRender(() => {
			this.start().then(this.notifyReady).catch(this.rejectReady);
		});
	}
	shared(id, transition) {
		this.sharedTransitions.set(id, transition);
		return this;
	}
	then(resolve, reject) {
		return this.readyPromise.then(resolve, reject);
	}
	async start() {
		const beforeElements = collectLayoutElements(this.scope);
		const beforeRecords = this.buildRecords(beforeElements);
		beforeRecords.forEach(({ projection }) => {
			const hasCurrentAnimation = Boolean(projection.currentAnimation);
			const isSharedLayout = Boolean(projection.options.layoutId);
			if (hasCurrentAnimation && isSharedLayout) {
				const snapshot = snapshotFromTarget(projection);
				if (snapshot) projection.snapshot = snapshot;
				else if (projection.snapshot) projection.snapshot = void 0;
			} else if (projection.snapshot && (projection.currentAnimation || projection.isProjecting())) projection.snapshot = void 0;
			projection.isPresent = true;
			projection.willUpdate();
		});
		await this.updateDom();
		const afterElements = collectLayoutElements(this.scope);
		const afterRecords = this.buildRecords(afterElements);
		this.handleExitingElements(beforeRecords, afterRecords);
		afterRecords.forEach(({ projection }) => {
			const instance = projection.instance;
			const resumeFromInstance = projection.resumeFrom?.instance;
			if (!instance || !resumeFromInstance) return;
			if (!("style" in instance)) return;
			const currentTransform = instance.style.transform;
			const resumeFromTransform = resumeFromInstance.style.transform;
			if (currentTransform && resumeFromTransform && currentTransform === resumeFromTransform) {
				instance.style.transform = "";
				instance.style.transformOrigin = "";
			}
		});
		afterRecords.forEach(({ projection }) => {
			projection.isPresent = true;
		});
		getProjectionRoot(afterRecords, beforeRecords)?.didUpdate();
		await new Promise((resolve) => {
			frame.postRender(() => resolve());
		});
		const animations = collectAnimations(afterRecords);
		return new GroupAnimation(animations);
	}
	buildRecords(elements) {
		const records = [];
		const recordMap = /* @__PURE__ */ new Map();
		for (const element of elements) {
			const parentRecord = findParentRecord(element, recordMap, this.scope);
			const { layout, layoutId } = readLayoutAttributes(element);
			const transition = (layoutId ? this.sharedTransitions.get(layoutId) : void 0) || this.defaultOptions;
			const record = getOrCreateRecord(element, parentRecord?.projection, {
				layout,
				layoutId,
				animationType: typeof layout === "string" ? layout : "both",
				transition
			});
			recordMap.set(element, record);
			records.push(record);
		}
		return records;
	}
	handleExitingElements(beforeRecords, afterRecords) {
		const afterElementsSet = new Set(afterRecords.map((record) => record.element));
		beforeRecords.forEach((record) => {
			if (afterElementsSet.has(record.element)) return;
			if (record.projection.options.layoutId) {
				record.projection.isPresent = false;
				record.projection.relegate();
			}
			record.visualElement.unmount();
			visualElementStore.delete(record.element);
		});
		const beforeElementsSet = new Set(beforeRecords.map((record) => record.element));
		afterRecords.forEach(({ element, projection }) => {
			if (beforeElementsSet.has(element) && projection.resumeFrom && !projection.resumeFrom.instance && !projection.isLead()) {
				projection.resumeFrom = void 0;
				projection.snapshot = void 0;
			}
		});
	}
};
function parseAnimateLayoutArgs(scopeOrUpdateDom, updateDomOrOptions, options) {
	if (typeof scopeOrUpdateDom === "function") return {
		scope: document,
		updateDom: scopeOrUpdateDom,
		defaultOptions: updateDomOrOptions
	};
	return {
		scope: resolveElements(scopeOrUpdateDom)[0] || document,
		updateDom: updateDomOrOptions,
		defaultOptions: options
	};
}
function collectLayoutElements(scope) {
	const elements = Array.from(scope.querySelectorAll(layoutSelector));
	if (scope instanceof Element && scope.matches(layoutSelector)) {
		if (!elements.includes(scope)) elements.unshift(scope);
	}
	return elements;
}
function readLayoutAttributes(element) {
	const layoutId = element.getAttribute("data-layout-id") || void 0;
	const rawLayout = element.getAttribute("data-layout");
	let layout;
	if (rawLayout === "" || rawLayout === "true") layout = true;
	else if (rawLayout) layout = rawLayout;
	return {
		layout,
		layoutId
	};
}
function createVisualState() {
	return {
		latestValues: {},
		renderState: {
			transform: {},
			transformOrigin: {},
			style: {},
			vars: {}
		}
	};
}
function getOrCreateRecord(element, parentProjection, projectionOptions) {
	const existing = visualElementStore.get(element);
	const visualElement = existing ?? new HTMLVisualElement({
		props: {},
		presenceContext: null,
		visualState: createVisualState()
	}, { allowProjection: true });
	if (!existing || !visualElement.projection) visualElement.projection = new HTMLProjectionNode(visualElement.latestValues, parentProjection);
	visualElement.projection.setOptions({
		...projectionOptions,
		visualElement
	});
	if (!visualElement.current) visualElement.mount(element);
	else if (!visualElement.projection.instance) visualElement.projection.mount(element);
	if (!existing) visualElementStore.set(element, visualElement);
	return {
		element,
		visualElement,
		projection: visualElement.projection
	};
}
function findParentRecord(element, recordMap, scope) {
	let parent = element.parentElement;
	while (parent) {
		const record = recordMap.get(parent);
		if (record) return record;
		if (parent === scope) break;
		parent = parent.parentElement;
	}
}
function getProjectionRoot(afterRecords, beforeRecords) {
	return (afterRecords[0] || beforeRecords[0])?.projection.root;
}
function collectAnimations(afterRecords) {
	const animations = /* @__PURE__ */ new Set();
	afterRecords.forEach((record) => {
		const animation = record.projection.currentAnimation;
		if (animation) animations.add(animation);
	});
	return Array.from(animations);
}

//#endregion
//#region ../../node_modules/motion-plus/dist/es/animate-layout.mjs
function unstable_animateLayout(scopeOrUpdateDom, updateDomOrOptions, options) {
	const { scope, updateDom, defaultOptions } = parseAnimateLayoutArgs(scopeOrUpdateDom, updateDomOrOptions, options);
	return new LayoutAnimationBuilder(scope, updateDom, defaultOptions);
}

//#endregion
export { unstable_animateLayout };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVuZG9yLm1vdGlvbi1wbHVzLmFuaW1hdGUtbGF5b3V0LmpzIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9hcnJheS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLXV0aWxzL2Rpc3QvZXMvY2xhbXAubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL2Zvcm1hdC1lcnJvci1tZXNzYWdlLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9lcnJvcnMubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL2dsb2JhbC1jb25maWcubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL2lzLW51bWVyaWNhbC1zdHJpbmcubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL2lzLW9iamVjdC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLXV0aWxzL2Rpc3QvZXMvaXMtemVyby12YWx1ZS1zdHJpbmcubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL21lbW8ubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL25vb3AubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL3BpcGUubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL3Byb2dyZXNzLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9zdWJzY3JpcHRpb24tbWFuYWdlci5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLXV0aWxzL2Rpc3QvZXMvdGltZS1jb252ZXJzaW9uLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy92ZWxvY2l0eS1wZXItc2Vjb25kLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy93YXJuLW9uY2UubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL2Vhc2luZy9jdWJpYy1iZXppZXIubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL2Vhc2luZy9tb2RpZmllcnMvbWlycm9yLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9lYXNpbmcvbW9kaWZpZXJzL3JldmVyc2UubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL2Vhc2luZy9iYWNrLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9lYXNpbmcvYW50aWNpcGF0ZS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLXV0aWxzL2Rpc3QvZXMvZWFzaW5nL2NpcmMubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL2Vhc2luZy9lYXNlLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9lYXNpbmcvdXRpbHMvaXMtZWFzaW5nLWFycmF5Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tdXRpbHMvZGlzdC9lcy9lYXNpbmcvdXRpbHMvaXMtYmV6aWVyLWRlZmluaXRpb24ubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi11dGlscy9kaXN0L2VzL2Vhc2luZy91dGlscy9tYXAubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9mcmFtZWxvb3Avb3JkZXIubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9zdGF0cy9idWZmZXIubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9mcmFtZWxvb3AvcmVuZGVyLXN0ZXAubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9mcmFtZWxvb3AvYmF0Y2hlci5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2ZyYW1lbG9vcC9mcmFtZS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2ZyYW1lbG9vcC9zeW5jLXRpbWUubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9zdGF0cy9hbmltYXRpb24tY291bnQubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vdXRpbHMvaXMtY3NzLXZhcmlhYmxlLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdHlwZXMvbnVtYmVycy9pbmRleC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3R5cGVzL3V0aWxzL3Nhbml0aXplLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdHlwZXMvdXRpbHMvZmxvYXQtcmVnZXgubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS90eXBlcy91dGlscy9pcy1udWxsaXNoLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdHlwZXMvdXRpbHMvc2luZ2xlLWNvbG9yLXJlZ2V4Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdHlwZXMvY29sb3IvdXRpbHMubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS90eXBlcy9jb2xvci9yZ2JhLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdHlwZXMvY29sb3IvaGV4Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdHlwZXMvbnVtYmVycy91bml0cy5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3R5cGVzL2NvbG9yL2hzbGEubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS90eXBlcy9jb2xvci9pbmRleC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3R5cGVzL3V0aWxzL2NvbG9yLXJlZ2V4Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdHlwZXMvY29tcGxleC9pbmRleC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3R5cGVzL2NvbG9yL2hzbGEtdG8tcmdiYS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3V0aWxzL21peC9pbW1lZGlhdGUubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy91dGlscy9taXgvbnVtYmVyLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdXRpbHMvbWl4L2NvbG9yLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdXRpbHMvbWl4L3Zpc2liaWxpdHkubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy91dGlscy9taXgvY29tcGxleC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3V0aWxzL21peC9pbmRleC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9kcml2ZXJzL2ZyYW1lLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL3dhYXBpL3V0aWxzL2xpbmVhci5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9nZW5lcmF0b3JzL3V0aWxzL2NhbGMtZHVyYXRpb24ubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vZ2VuZXJhdG9ycy91dGlscy9jcmVhdGUtZ2VuZXJhdG9yLWVhc2luZy5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9nZW5lcmF0b3JzL3NwcmluZy5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9nZW5lcmF0b3JzL3V0aWxzL3ZlbG9jaXR5Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL2dlbmVyYXRvcnMvaW5lcnRpYS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3V0aWxzL2ludGVycG9sYXRlLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL2tleWZyYW1lcy9vZmZzZXRzL2ZpbGwubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24va2V5ZnJhbWVzL29mZnNldHMvZGVmYXVsdC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9rZXlmcmFtZXMvb2Zmc2V0cy90aW1lLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL2dlbmVyYXRvcnMva2V5ZnJhbWVzLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL2tleWZyYW1lcy9nZXQtZmluYWwubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vdXRpbHMvcmVwbGFjZS10cmFuc2l0aW9uLXR5cGUubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vdXRpbHMvV2l0aFByb21pc2UubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vSlNBbmltYXRpb24ubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24va2V5ZnJhbWVzL3V0aWxzL2ZpbGwtd2lsZGNhcmRzLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcmVuZGVyL2RvbS9wYXJzZS10cmFuc2Zvcm0ubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvdXRpbHMva2V5cy10cmFuc2Zvcm0ubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24va2V5ZnJhbWVzL3V0aWxzL3VuaXQtY29udmVyc2lvbi5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9rZXlmcmFtZXMvS2V5ZnJhbWVzUmVzb2x2ZXIubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvZG9tL2lzLWNzcy12YXIubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvZG9tL3N0eWxlLXNldC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3V0aWxzL3N1cHBvcnRzL2ZsYWdzLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdXRpbHMvc3VwcG9ydHMvbWVtby5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3V0aWxzL3N1cHBvcnRzL3Njcm9sbC10aW1lbGluZS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3V0aWxzL3N1cHBvcnRzL2xpbmVhci1lYXNpbmcubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vd2FhcGkvZWFzaW5nL2N1YmljLWJlemllci5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi93YWFwaS9lYXNpbmcvc3VwcG9ydGVkLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL3dhYXBpL2Vhc2luZy9tYXAtZWFzaW5nLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL3dhYXBpL3N0YXJ0LXdhYXBpLWFuaW1hdGlvbi5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9nZW5lcmF0b3JzL3V0aWxzL2lzLWdlbmVyYXRvci5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi93YWFwaS91dGlscy9hcHBseS1nZW5lcmF0b3IubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vTmF0aXZlQW5pbWF0aW9uLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL3dhYXBpL3V0aWxzL3Vuc3VwcG9ydGVkLWVhc2luZy5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9OYXRpdmVBbmltYXRpb25FeHRlbmRlZC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi91dGlscy9pcy1hbmltYXRhYmxlLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL3V0aWxzL2Nhbi1hbmltYXRlLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL3V0aWxzL21ha2UtYW5pbWF0aW9uLWluc3RhbnQubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vd2FhcGkvc3VwcG9ydHMvd2FhcGkubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vQXN5bmNNb3Rpb25WYWx1ZUFuaW1hdGlvbi5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9Hcm91cEFuaW1hdGlvbi5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi91dGlscy9jc3MtdmFyaWFibGVzLWNvbnZlcnNpb24ubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vdXRpbHMvZGVmYXVsdC10cmFuc2l0aW9ucy5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi91dGlscy9nZXQtZmluYWwta2V5ZnJhbWUubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vdXRpbHMvcmVzb2x2ZS10cmFuc2l0aW9uLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL3V0aWxzL2dldC12YWx1ZS10cmFuc2l0aW9uLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL3V0aWxzL2lzLXRyYW5zaXRpb24tZGVmaW5lZC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9pbnRlcmZhY2VzL21vdGlvbi12YWx1ZS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3JlbmRlci91dGlscy9yZXNvbHZlLXZhcmlhbnRzLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcmVuZGVyL3V0aWxzL2tleXMtcG9zaXRpb24ubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS9pbmRleC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3V0aWxzL2lzLW1vdGlvbi12YWx1ZS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3JlbmRlci9kb20vdXRpbHMvY2FtZWwtdG8tZGFzaC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9vcHRpbWl6ZWQtYXBwZWFyL2RhdGEtaWQubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vb3B0aW1pemVkLWFwcGVhci9nZXQtYXBwZWFyLWlkLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdHlwZXMvYXV0by5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3R5cGVzL3Rlc3QubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS90eXBlcy9kaW1lbnNpb25zLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL2tleWZyYW1lcy91dGlscy9pcy1ub25lLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdHlwZXMvY29tcGxleC9maWx0ZXIubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS90eXBlcy9jb21wbGV4L21hc2subWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS90eXBlcy9pbnQubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS90eXBlcy9tYXBzL3RyYW5zZm9ybS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3R5cGVzL21hcHMvbnVtYmVyLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdmFsdWUvdHlwZXMvbWFwcy9kZWZhdWx0cy5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3R5cGVzL3V0aWxzL2FuaW1hdGFibGUtbm9uZS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2FuaW1hdGlvbi9rZXlmcmFtZXMvdXRpbHMvbWFrZS1ub25lLWFuaW1hdGFibGUubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24va2V5ZnJhbWVzL0RPTUtleWZyYW1lc1Jlc29sdmVyLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvYW5pbWF0aW9uL3dhYXBpL3V0aWxzL2FjY2VsZXJhdGVkLXZhbHVlcy5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3V0aWxzL3Jlc29sdmUtZWxlbWVudHMubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS90eXBlcy91dGlscy9nZXQtYXMtdHlwZS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL2ZyYW1lbG9vcC9taWNyb3Rhc2subWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy91dGlscy9pcy1zdmctZWxlbWVudC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3V0aWxzL2lzLXN2Zy1zdmctZWxlbWVudC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3ZhbHVlL3R5cGVzL3V0aWxzL2ZpbmQubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9wcm9qZWN0aW9uL2dlb21ldHJ5L21vZGVscy5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3JlbmRlci9zdG9yZS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3JlbmRlci91dGlscy9pcy1hbmltYXRpb24tY29udHJvbHMubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvdXRpbHMvaXMtdmFyaWFudC1sYWJlbC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3JlbmRlci91dGlscy92YXJpYW50LXByb3BzLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcmVuZGVyL3V0aWxzL2lzLWNvbnRyb2xsaW5nLXZhcmlhbnRzLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcmVuZGVyL3V0aWxzL21vdGlvbi12YWx1ZXMubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvdXRpbHMvcmVkdWNlZC1tb3Rpb24vc3RhdGUubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvdXRpbHMvcmVkdWNlZC1tb3Rpb24vaW5kZXgubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvVmlzdWFsRWxlbWVudC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3JlbmRlci9kb20vRE9NVmlzdWFsRWxlbWVudC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3Byb2plY3Rpb24vZ2VvbWV0cnkvY29udmVyc2lvbi5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3Byb2plY3Rpb24vdXRpbHMvaGFzLXRyYW5zZm9ybS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3Byb2plY3Rpb24vZ2VvbWV0cnkvZGVsdGEtYXBwbHkubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9wcm9qZWN0aW9uL3V0aWxzL21lYXN1cmUubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvaHRtbC91dGlscy9idWlsZC10cmFuc2Zvcm0ubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvaHRtbC91dGlscy9idWlsZC1zdHlsZXMubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvaHRtbC91dGlscy9yZW5kZXIubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9wcm9qZWN0aW9uL3N0eWxlcy9zY2FsZS1ib3JkZXItcmFkaXVzLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcHJvamVjdGlvbi9zdHlsZXMvc2NhbGUtYm94LXNoYWRvdy5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3Byb2plY3Rpb24vc3R5bGVzL3NjYWxlLWNvcnJlY3Rpb24ubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9yZW5kZXIvdXRpbHMvaXMtZm9yY2VkLW1vdGlvbi12YWx1ZS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3JlbmRlci9odG1sL3V0aWxzL3NjcmFwZS1tb3Rpb24tdmFsdWVzLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcmVuZGVyL2h0bWwvSFRNTFZpc3VhbEVsZW1lbnQubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9wcm9qZWN0aW9uL2dlb21ldHJ5L2NvcHkubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9wcm9qZWN0aW9uL2dlb21ldHJ5L2RlbHRhLWNhbGMubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9wcm9qZWN0aW9uL2dlb21ldHJ5L2RlbHRhLXJlbW92ZS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3Byb2plY3Rpb24vZ2VvbWV0cnkvdXRpbHMubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9wcm9qZWN0aW9uL3V0aWxzL2VhY2gtYXhpcy5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3Byb2plY3Rpb24vc3R5bGVzL3RyYW5zZm9ybS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3Byb2plY3Rpb24vYW5pbWF0aW9uL21peC12YWx1ZXMubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9hbmltYXRpb24vYW5pbWF0ZS9zaW5nbGUtdmFsdWUubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9ldmVudHMvYWRkLWRvbS1ldmVudC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3Byb2plY3Rpb24vdXRpbHMvY29tcGFyZS1ieS1kZXB0aC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3Byb2plY3Rpb24vdXRpbHMvZmxhdC10cmVlLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvdXRpbHMvZGVsYXkubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy92YWx1ZS91dGlscy9yZXNvbHZlLW1vdGlvbi12YWx1ZS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3Byb2plY3Rpb24vc2hhcmVkL3N0YWNrLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcHJvamVjdGlvbi9ub2RlL3N0YXRlLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9tb3Rpb24tZG9tL2Rpc3QvZXMvcHJvamVjdGlvbi9ub2RlL2NyZWF0ZS1wcm9qZWN0aW9uLW5vZGUubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9wcm9qZWN0aW9uL25vZGUvRG9jdW1lbnRQcm9qZWN0aW9uTm9kZS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLWRvbS9kaXN0L2VzL3Byb2plY3Rpb24vbm9kZS9IVE1MUHJvamVjdGlvbk5vZGUubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL21vdGlvbi1kb20vZGlzdC9lcy9sYXlvdXQvTGF5b3V0QW5pbWF0aW9uQnVpbGRlci5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbW90aW9uLXBsdXMvZGlzdC9lcy9hbmltYXRlLWxheW91dC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gYWRkVW5pcXVlSXRlbShhcnIsIGl0ZW0pIHtcbiAgICBpZiAoYXJyLmluZGV4T2YoaXRlbSkgPT09IC0xKVxuICAgICAgICBhcnIucHVzaChpdGVtKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZUl0ZW0oYXJyLCBpdGVtKSB7XG4gICAgY29uc3QgaW5kZXggPSBhcnIuaW5kZXhPZihpdGVtKTtcbiAgICBpZiAoaW5kZXggPiAtMSlcbiAgICAgICAgYXJyLnNwbGljZShpbmRleCwgMSk7XG59XG4vLyBBZGFwdGVkIGZyb20gYXJyYXktbW92ZVxuZnVuY3Rpb24gbW92ZUl0ZW0oWy4uLmFycl0sIGZyb21JbmRleCwgdG9JbmRleCkge1xuICAgIGNvbnN0IHN0YXJ0SW5kZXggPSBmcm9tSW5kZXggPCAwID8gYXJyLmxlbmd0aCArIGZyb21JbmRleCA6IGZyb21JbmRleDtcbiAgICBpZiAoc3RhcnRJbmRleCA+PSAwICYmIHN0YXJ0SW5kZXggPCBhcnIubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGVuZEluZGV4ID0gdG9JbmRleCA8IDAgPyBhcnIubGVuZ3RoICsgdG9JbmRleCA6IHRvSW5kZXg7XG4gICAgICAgIGNvbnN0IFtpdGVtXSA9IGFyci5zcGxpY2UoZnJvbUluZGV4LCAxKTtcbiAgICAgICAgYXJyLnNwbGljZShlbmRJbmRleCwgMCwgaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCB7IGFkZFVuaXF1ZUl0ZW0sIG1vdmVJdGVtLCByZW1vdmVJdGVtIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcnJheS5tanMubWFwXG4iLCJjb25zdCBjbGFtcCA9IChtaW4sIG1heCwgdikgPT4ge1xuICAgIGlmICh2ID4gbWF4KVxuICAgICAgICByZXR1cm4gbWF4O1xuICAgIGlmICh2IDwgbWluKVxuICAgICAgICByZXR1cm4gbWluO1xuICAgIHJldHVybiB2O1xufTtcblxuZXhwb3J0IHsgY2xhbXAgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNsYW1wLm1qcy5tYXBcbiIsImZ1bmN0aW9uIGZvcm1hdEVycm9yTWVzc2FnZShtZXNzYWdlLCBlcnJvckNvZGUpIHtcbiAgICByZXR1cm4gZXJyb3JDb2RlXG4gICAgICAgID8gYCR7bWVzc2FnZX0uIEZvciBtb3JlIGluZm9ybWF0aW9uIGFuZCBzdGVwcyBmb3Igc29sdmluZywgdmlzaXQgaHR0cHM6Ly9tb3Rpb24uZGV2L3Ryb3VibGVzaG9vdGluZy8ke2Vycm9yQ29kZX1gXG4gICAgICAgIDogbWVzc2FnZTtcbn1cblxuZXhwb3J0IHsgZm9ybWF0RXJyb3JNZXNzYWdlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mb3JtYXQtZXJyb3ItbWVzc2FnZS5tanMubWFwXG4iLCJpbXBvcnQgeyBmb3JtYXRFcnJvck1lc3NhZ2UgfSBmcm9tICcuL2Zvcm1hdC1lcnJvci1tZXNzYWdlLm1qcyc7XG5cbmxldCB3YXJuaW5nID0gKCkgPT4geyB9O1xubGV0IGludmFyaWFudCA9ICgpID0+IHsgfTtcbmlmICh0eXBlb2YgcHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgIHByb2Nlc3MuZW52Py5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICB3YXJuaW5nID0gKGNoZWNrLCBtZXNzYWdlLCBlcnJvckNvZGUpID0+IHtcbiAgICAgICAgaWYgKCFjaGVjayAmJiB0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGZvcm1hdEVycm9yTWVzc2FnZShtZXNzYWdlLCBlcnJvckNvZGUpKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgaW52YXJpYW50ID0gKGNoZWNrLCBtZXNzYWdlLCBlcnJvckNvZGUpID0+IHtcbiAgICAgICAgaWYgKCFjaGVjaykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGZvcm1hdEVycm9yTWVzc2FnZShtZXNzYWdlLCBlcnJvckNvZGUpKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCB7IGludmFyaWFudCwgd2FybmluZyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXJyb3JzLm1qcy5tYXBcbiIsImNvbnN0IE1vdGlvbkdsb2JhbENvbmZpZyA9IHt9O1xuXG5leHBvcnQgeyBNb3Rpb25HbG9iYWxDb25maWcgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdsb2JhbC1jb25maWcubWpzLm1hcFxuIiwiLyoqXG4gKiBDaGVjayBpZiB2YWx1ZSBpcyBhIG51bWVyaWNhbCBzdHJpbmcsIGllIGEgc3RyaW5nIHRoYXQgaXMgcHVyZWx5IGEgbnVtYmVyIGVnIFwiMTAwXCIgb3IgXCItMTAwLjFcIlxuICovXG5jb25zdCBpc051bWVyaWNhbFN0cmluZyA9ICh2KSA9PiAvXi0/KD86XFxkKyg/OlxcLlxcZCspP3xcXC5cXGQrKSQvdS50ZXN0KHYpO1xuXG5leHBvcnQgeyBpc051bWVyaWNhbFN0cmluZyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtbnVtZXJpY2FsLXN0cmluZy5tanMubWFwXG4iLCJjb25zdCBpc09iamVjdCA9ICh2YWx1ZSkgPT4gdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsO1xuXG5leHBvcnQgeyBpc09iamVjdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtb2JqZWN0Lm1qcy5tYXBcbiIsIi8qKlxuICogQ2hlY2sgaWYgdGhlIHZhbHVlIGlzIGEgemVybyB2YWx1ZSBzdHJpbmcgbGlrZSBcIjBweFwiIG9yIFwiMCVcIlxuICovXG5jb25zdCBpc1plcm9WYWx1ZVN0cmluZyA9ICh2KSA9PiAvXjBbXi5cXHNdKyQvdS50ZXN0KHYpO1xuXG5leHBvcnQgeyBpc1plcm9WYWx1ZVN0cmluZyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtemVyby12YWx1ZS1zdHJpbmcubWpzLm1hcFxuIiwiLyojX19OT19TSURFX0VGRkVDVFNfXyovXG5mdW5jdGlvbiBtZW1vKGNhbGxiYWNrKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXN1bHQgPSBjYWxsYmFjaygpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG59XG5cbmV4cG9ydCB7IG1lbW8gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lbW8ubWpzLm1hcFxuIiwiLyojX19OT19TSURFX0VGRkVDVFNfXyovXG5jb25zdCBub29wID0gKGFueSkgPT4gYW55O1xuXG5leHBvcnQgeyBub29wIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ub29wLm1qcy5tYXBcbiIsIi8qKlxuICogUGlwZVxuICogQ29tcG9zZSBvdGhlciB0cmFuc2Zvcm1lcnMgdG8gcnVuIGxpbmVhcmlseVxuICogcGlwZShtaW4oMjApLCBtYXgoNDApKVxuICogQHBhcmFtICB7Li4uZnVuY3Rpb25zfSB0cmFuc2Zvcm1lcnNcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICovXG5jb25zdCBwaXBlID0gKC4uLnRyYW5zZm9ybWVycykgPT4gdHJhbnNmb3JtZXJzLnJlZHVjZSgoYSwgYikgPT4gKHYpID0+IGIoYSh2KSkpO1xuXG5leHBvcnQgeyBwaXBlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXBlLm1qcy5tYXBcbiIsIi8qXG4gIFByb2dyZXNzIHdpdGhpbiBnaXZlbiByYW5nZVxuXG4gIEdpdmVuIGEgbG93ZXIgbGltaXQgYW5kIGFuIHVwcGVyIGxpbWl0LCB3ZSByZXR1cm4gdGhlIHByb2dyZXNzXG4gIChleHByZXNzZWQgYXMgYSBudW1iZXIgMC0xKSByZXByZXNlbnRlZCBieSB0aGUgZ2l2ZW4gdmFsdWUsIGFuZFxuICBsaW1pdCB0aGF0IHByb2dyZXNzIHRvIHdpdGhpbiAwLTEuXG4qL1xuLyojX19OT19TSURFX0VGRkVDVFNfXyovXG5jb25zdCBwcm9ncmVzcyA9IChmcm9tLCB0bywgdmFsdWUpID0+IHtcbiAgICBjb25zdCByYW5nZSA9IHRvIC0gZnJvbTtcbiAgICByZXR1cm4gcmFuZ2UgPyAodmFsdWUgLSBmcm9tKSAvIHJhbmdlIDogMTtcbn07XG5cbmV4cG9ydCB7IHByb2dyZXNzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcm9ncmVzcy5tanMubWFwXG4iLCJpbXBvcnQgeyBhZGRVbmlxdWVJdGVtLCByZW1vdmVJdGVtIH0gZnJvbSAnLi9hcnJheS5tanMnO1xuXG5jbGFzcyBTdWJzY3JpcHRpb25NYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0gW107XG4gICAgfVxuICAgIGFkZChoYW5kbGVyKSB7XG4gICAgICAgIGFkZFVuaXF1ZUl0ZW0odGhpcy5zdWJzY3JpcHRpb25zLCBoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHJlbW92ZUl0ZW0odGhpcy5zdWJzY3JpcHRpb25zLCBoYW5kbGVyKTtcbiAgICB9XG4gICAgbm90aWZ5KGEsIGIsIGMpIHtcbiAgICAgICAgY29uc3QgbnVtU3Vic2NyaXB0aW9ucyA9IHRoaXMuc3Vic2NyaXB0aW9ucy5sZW5ndGg7XG4gICAgICAgIGlmICghbnVtU3Vic2NyaXB0aW9ucylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKG51bVN1YnNjcmlwdGlvbnMgPT09IDEpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgdGhlcmUncyBvbmx5IGEgc2luZ2xlIGhhbmRsZXIgd2UgY2FuIGp1c3QgY2FsbCBpdCB3aXRob3V0IGludm9raW5nIGEgbG9vcC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zWzBdKGEsIGIsIGMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1TdWJzY3JpcHRpb25zOyBpKyspIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBDaGVjayB3aGV0aGVyIHRoZSBoYW5kbGVyIGV4aXN0cyBiZWZvcmUgZmlyaW5nIGFzIGl0J3MgcG9zc2libGVcbiAgICAgICAgICAgICAgICAgKiB0aGUgc3Vic2NyaXB0aW9ucyB3ZXJlIG1vZGlmaWVkIGR1cmluZyB0aGlzIGxvb3AgcnVubmluZy5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGVyID0gdGhpcy5zdWJzY3JpcHRpb25zW2ldO1xuICAgICAgICAgICAgICAgIGhhbmRsZXIgJiYgaGFuZGxlcihhLCBiLCBjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXRTaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb25zLmxlbmd0aDtcbiAgICB9XG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5sZW5ndGggPSAwO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgU3Vic2NyaXB0aW9uTWFuYWdlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3Vic2NyaXB0aW9uLW1hbmFnZXIubWpzLm1hcFxuIiwiLyoqXG4gKiBDb252ZXJ0cyBzZWNvbmRzIHRvIG1pbGxpc2Vjb25kc1xuICpcbiAqIEBwYXJhbSBzZWNvbmRzIC0gVGltZSBpbiBzZWNvbmRzLlxuICogQHJldHVybiBtaWxsaXNlY29uZHMgLSBDb252ZXJ0ZWQgdGltZSBpbiBtaWxsaXNlY29uZHMuXG4gKi9cbi8qI19fTk9fU0lERV9FRkZFQ1RTX18qL1xuY29uc3Qgc2Vjb25kc1RvTWlsbGlzZWNvbmRzID0gKHNlY29uZHMpID0+IHNlY29uZHMgKiAxMDAwO1xuLyojX19OT19TSURFX0VGRkVDVFNfXyovXG5jb25zdCBtaWxsaXNlY29uZHNUb1NlY29uZHMgPSAobWlsbGlzZWNvbmRzKSA9PiBtaWxsaXNlY29uZHMgLyAxMDAwO1xuXG5leHBvcnQgeyBtaWxsaXNlY29uZHNUb1NlY29uZHMsIHNlY29uZHNUb01pbGxpc2Vjb25kcyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGltZS1jb252ZXJzaW9uLm1qcy5tYXBcbiIsIi8qXG4gIENvbnZlcnQgdmVsb2NpdHkgaW50byB2ZWxvY2l0eSBwZXIgc2Vjb25kXG4qL1xuLyojX19OT19TSURFX0VGRkVDVFNfXyovXG5jb25zdCB2ZWxvY2l0eVBlclNlY29uZCA9ICh2ZWxvY2l0eSwgZnJhbWVEdXJhdGlvbikgPT4gZnJhbWVEdXJhdGlvbiA/IHZlbG9jaXR5ICogKDEwMDAgLyBmcmFtZUR1cmF0aW9uKSA6IDA7XG5cbmV4cG9ydCB7IHZlbG9jaXR5UGVyU2Vjb25kIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD12ZWxvY2l0eS1wZXItc2Vjb25kLm1qcy5tYXBcbiIsImltcG9ydCB7IGZvcm1hdEVycm9yTWVzc2FnZSB9IGZyb20gJy4vZm9ybWF0LWVycm9yLW1lc3NhZ2UubWpzJztcblxuY29uc3Qgd2FybmVkID0gbmV3IFNldCgpO1xuZnVuY3Rpb24gaGFzV2FybmVkKG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gd2FybmVkLmhhcyhtZXNzYWdlKTtcbn1cbmZ1bmN0aW9uIHdhcm5PbmNlKGNvbmRpdGlvbiwgbWVzc2FnZSwgZXJyb3JDb2RlKSB7XG4gICAgaWYgKGNvbmRpdGlvbiB8fCB3YXJuZWQuaGFzKG1lc3NhZ2UpKVxuICAgICAgICByZXR1cm47XG4gICAgY29uc29sZS53YXJuKGZvcm1hdEVycm9yTWVzc2FnZShtZXNzYWdlLCBlcnJvckNvZGUpKTtcbiAgICB3YXJuZWQuYWRkKG1lc3NhZ2UpO1xufVxuXG5leHBvcnQgeyBoYXNXYXJuZWQsIHdhcm5PbmNlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD13YXJuLW9uY2UubWpzLm1hcFxuIiwiaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uL25vb3AubWpzJztcblxuLypcbiAgQmV6aWVyIGZ1bmN0aW9uIGdlbmVyYXRvclxuICBUaGlzIGhhcyBiZWVuIG1vZGlmaWVkIGZyb20gR2HDq3RhbiBSZW5hdWRlYXUncyBCZXppZXJFYXNpbmdcbiAgaHR0cHM6Ly9naXRodWIuY29tL2dyZS9iZXppZXItZWFzaW5nL2Jsb2IvbWFzdGVyL3NyYy9pbmRleC5qc1xuICBodHRwczovL2dpdGh1Yi5jb20vZ3JlL2Jlemllci1lYXNpbmcvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICBcbiAgSSd2ZSByZW1vdmVkIHRoZSBuZXd0b25SYXBoc29uSXRlcmF0ZSBhbGdvIGJlY2F1c2UgaW4gYmVuY2htYXJraW5nIGl0XG4gIHdhc24ndCBub3RpY2VhYmx5IGZhc3RlciB0aGFuIGJpbmFyeVN1YmRpdmlzaW9uLCBpbmRlZWQgcmVtb3ZpbmcgaXRcbiAgdXN1YWxseSBpbXByb3ZlZCB0aW1lcywgZGVwZW5kaW5nIG9uIHRoZSBjdXJ2ZS5cbiAgSSBhbHNvIHJlbW92ZWQgdGhlIGxvb2t1cCB0YWJsZSwgYXMgZm9yIHRoZSBhZGRlZCBidW5kbGUgc2l6ZSBhbmQgbG9vcCB3ZSdyZVxuICBvbmx5IGN1dHRpbmcgfjQgb3Igc28gc3ViZGl2aXNpb24gaXRlcmF0aW9ucy4gSSBidW1wZWQgdGhlIG1heCBpdGVyYXRpb25zIHVwXG4gIHRvIDEyIHRvIGNvbXBlbnNhdGUgYW5kIHRoaXMgc3RpbGwgdGVuZGVkIHRvIGJlIGZhc3RlciBmb3Igbm8gcGVyY2VpdmFibGVcbiAgbG9zcyBpbiBhY2N1cmFjeS5cbiAgVXNhZ2VcbiAgICBjb25zdCBlYXNlT3V0ID0gY3ViaWNCZXppZXIoLjE3LC42NywuODMsLjY3KTtcbiAgICBjb25zdCB4ID0gZWFzZU91dCgwLjUpOyAvLyByZXR1cm5zIDAuNjI3Li4uXG4qL1xuLy8gUmV0dXJucyB4KHQpIGdpdmVuIHQsIHgxLCBhbmQgeDIsIG9yIHkodCkgZ2l2ZW4gdCwgeTEsIGFuZCB5Mi5cbmNvbnN0IGNhbGNCZXppZXIgPSAodCwgYTEsIGEyKSA9PiAoKCgxLjAgLSAzLjAgKiBhMiArIDMuMCAqIGExKSAqIHQgKyAoMy4wICogYTIgLSA2LjAgKiBhMSkpICogdCArIDMuMCAqIGExKSAqXG4gICAgdDtcbmNvbnN0IHN1YmRpdmlzaW9uUHJlY2lzaW9uID0gMC4wMDAwMDAxO1xuY29uc3Qgc3ViZGl2aXNpb25NYXhJdGVyYXRpb25zID0gMTI7XG5mdW5jdGlvbiBiaW5hcnlTdWJkaXZpZGUoeCwgbG93ZXJCb3VuZCwgdXBwZXJCb3VuZCwgbVgxLCBtWDIpIHtcbiAgICBsZXQgY3VycmVudFg7XG4gICAgbGV0IGN1cnJlbnRUO1xuICAgIGxldCBpID0gMDtcbiAgICBkbyB7XG4gICAgICAgIGN1cnJlbnRUID0gbG93ZXJCb3VuZCArICh1cHBlckJvdW5kIC0gbG93ZXJCb3VuZCkgLyAyLjA7XG4gICAgICAgIGN1cnJlbnRYID0gY2FsY0JlemllcihjdXJyZW50VCwgbVgxLCBtWDIpIC0geDtcbiAgICAgICAgaWYgKGN1cnJlbnRYID4gMC4wKSB7XG4gICAgICAgICAgICB1cHBlckJvdW5kID0gY3VycmVudFQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsb3dlckJvdW5kID0gY3VycmVudFQ7XG4gICAgICAgIH1cbiAgICB9IHdoaWxlIChNYXRoLmFicyhjdXJyZW50WCkgPiBzdWJkaXZpc2lvblByZWNpc2lvbiAmJlxuICAgICAgICArK2kgPCBzdWJkaXZpc2lvbk1heEl0ZXJhdGlvbnMpO1xuICAgIHJldHVybiBjdXJyZW50VDtcbn1cbi8qI19fTk9fU0lERV9FRkZFQ1RTX18qL1xuZnVuY3Rpb24gY3ViaWNCZXppZXIobVgxLCBtWTEsIG1YMiwgbVkyKSB7XG4gICAgLy8gSWYgdGhpcyBpcyBhIGxpbmVhciBncmFkaWVudCwgcmV0dXJuIGxpbmVhciBlYXNpbmdcbiAgICBpZiAobVgxID09PSBtWTEgJiYgbVgyID09PSBtWTIpXG4gICAgICAgIHJldHVybiBub29wO1xuICAgIGNvbnN0IGdldFRGb3JYID0gKGFYKSA9PiBiaW5hcnlTdWJkaXZpZGUoYVgsIDAsIDEsIG1YMSwgbVgyKTtcbiAgICAvLyBJZiBhbmltYXRpb24gaXMgYXQgc3RhcnQvZW5kLCByZXR1cm4gdCB3aXRob3V0IGVhc2luZ1xuICAgIHJldHVybiAodCkgPT4gdCA9PT0gMCB8fCB0ID09PSAxID8gdCA6IGNhbGNCZXppZXIoZ2V0VEZvclgodCksIG1ZMSwgbVkyKTtcbn1cblxuZXhwb3J0IHsgY3ViaWNCZXppZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWN1YmljLWJlemllci5tanMubWFwXG4iLCIvLyBBY2NlcHRzIGFuIGVhc2luZyBmdW5jdGlvbiBhbmQgcmV0dXJucyBhIG5ldyBvbmUgdGhhdCBvdXRwdXRzIG1pcnJvcmVkIHZhbHVlcyBmb3Jcbi8vIHRoZSBzZWNvbmQgaGFsZiBvZiB0aGUgYW5pbWF0aW9uLiBUdXJucyBlYXNlSW4gaW50byBlYXNlSW5PdXQuXG4vKiNfX05PX1NJREVfRUZGRUNUU19fKi9cbmNvbnN0IG1pcnJvckVhc2luZyA9IChlYXNpbmcpID0+IChwKSA9PiBwIDw9IDAuNSA/IGVhc2luZygyICogcCkgLyAyIDogKDIgLSBlYXNpbmcoMiAqICgxIC0gcCkpKSAvIDI7XG5cbmV4cG9ydCB7IG1pcnJvckVhc2luZyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWlycm9yLm1qcy5tYXBcbiIsIi8vIEFjY2VwdHMgYW4gZWFzaW5nIGZ1bmN0aW9uIGFuZCByZXR1cm5zIGEgbmV3IG9uZSB0aGF0IG91dHB1dHMgcmV2ZXJzZWQgdmFsdWVzLlxuLy8gVHVybnMgZWFzZUluIGludG8gZWFzZU91dC5cbi8qI19fTk9fU0lERV9FRkZFQ1RTX18qL1xuY29uc3QgcmV2ZXJzZUVhc2luZyA9IChlYXNpbmcpID0+IChwKSA9PiAxIC0gZWFzaW5nKDEgLSBwKTtcblxuZXhwb3J0IHsgcmV2ZXJzZUVhc2luZyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmV2ZXJzZS5tanMubWFwXG4iLCJpbXBvcnQgeyBjdWJpY0JlemllciB9IGZyb20gJy4vY3ViaWMtYmV6aWVyLm1qcyc7XG5pbXBvcnQgeyBtaXJyb3JFYXNpbmcgfSBmcm9tICcuL21vZGlmaWVycy9taXJyb3IubWpzJztcbmltcG9ydCB7IHJldmVyc2VFYXNpbmcgfSBmcm9tICcuL21vZGlmaWVycy9yZXZlcnNlLm1qcyc7XG5cbmNvbnN0IGJhY2tPdXQgPSAvKkBfX1BVUkVfXyovIGN1YmljQmV6aWVyKDAuMzMsIDEuNTMsIDAuNjksIDAuOTkpO1xuY29uc3QgYmFja0luID0gLypAX19QVVJFX18qLyByZXZlcnNlRWFzaW5nKGJhY2tPdXQpO1xuY29uc3QgYmFja0luT3V0ID0gLypAX19QVVJFX18qLyBtaXJyb3JFYXNpbmcoYmFja0luKTtcblxuZXhwb3J0IHsgYmFja0luLCBiYWNrSW5PdXQsIGJhY2tPdXQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJhY2subWpzLm1hcFxuIiwiaW1wb3J0IHsgYmFja0luIH0gZnJvbSAnLi9iYWNrLm1qcyc7XG5cbmNvbnN0IGFudGljaXBhdGUgPSAocCkgPT4gcCA+PSAxXG4gICAgPyAxXG4gICAgOiAocCAqPSAyKSA8IDFcbiAgICAgICAgPyAwLjUgKiBiYWNrSW4ocClcbiAgICAgICAgOiAwLjUgKiAoMiAtIE1hdGgucG93KDIsIC0xMCAqIChwIC0gMSkpKTtcblxuZXhwb3J0IHsgYW50aWNpcGF0ZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YW50aWNpcGF0ZS5tanMubWFwXG4iLCJpbXBvcnQgeyBtaXJyb3JFYXNpbmcgfSBmcm9tICcuL21vZGlmaWVycy9taXJyb3IubWpzJztcbmltcG9ydCB7IHJldmVyc2VFYXNpbmcgfSBmcm9tICcuL21vZGlmaWVycy9yZXZlcnNlLm1qcyc7XG5cbmNvbnN0IGNpcmNJbiA9IChwKSA9PiAxIC0gTWF0aC5zaW4oTWF0aC5hY29zKHApKTtcbmNvbnN0IGNpcmNPdXQgPSByZXZlcnNlRWFzaW5nKGNpcmNJbik7XG5jb25zdCBjaXJjSW5PdXQgPSBtaXJyb3JFYXNpbmcoY2lyY0luKTtcblxuZXhwb3J0IHsgY2lyY0luLCBjaXJjSW5PdXQsIGNpcmNPdXQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNpcmMubWpzLm1hcFxuIiwiaW1wb3J0IHsgY3ViaWNCZXppZXIgfSBmcm9tICcuL2N1YmljLWJlemllci5tanMnO1xuXG5jb25zdCBlYXNlSW4gPSAvKkBfX1BVUkVfXyovIGN1YmljQmV6aWVyKDAuNDIsIDAsIDEsIDEpO1xuY29uc3QgZWFzZU91dCA9IC8qQF9fUFVSRV9fKi8gY3ViaWNCZXppZXIoMCwgMCwgMC41OCwgMSk7XG5jb25zdCBlYXNlSW5PdXQgPSAvKkBfX1BVUkVfXyovIGN1YmljQmV6aWVyKDAuNDIsIDAsIDAuNTgsIDEpO1xuXG5leHBvcnQgeyBlYXNlSW4sIGVhc2VJbk91dCwgZWFzZU91dCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZWFzZS5tanMubWFwXG4iLCIvKiNfX05PX1NJREVfRUZGRUNUU19fKi9cbmNvbnN0IGlzRWFzaW5nQXJyYXkgPSAoZWFzZSkgPT4ge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGVhc2UpICYmIHR5cGVvZiBlYXNlWzBdICE9PSBcIm51bWJlclwiO1xufTtcblxuZXhwb3J0IHsgaXNFYXNpbmdBcnJheSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtZWFzaW5nLWFycmF5Lm1qcy5tYXBcbiIsIi8qI19fTk9fU0lERV9FRkZFQ1RTX18qL1xuY29uc3QgaXNCZXppZXJEZWZpbml0aW9uID0gKGVhc2luZykgPT4gQXJyYXkuaXNBcnJheShlYXNpbmcpICYmIHR5cGVvZiBlYXNpbmdbMF0gPT09IFwibnVtYmVyXCI7XG5cbmV4cG9ydCB7IGlzQmV6aWVyRGVmaW5pdGlvbiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtYmV6aWVyLWRlZmluaXRpb24ubWpzLm1hcFxuIiwiaW1wb3J0IHsgaW52YXJpYW50IH0gZnJvbSAnLi4vLi4vZXJyb3JzLm1qcyc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi4vLi4vbm9vcC5tanMnO1xuaW1wb3J0IHsgYW50aWNpcGF0ZSB9IGZyb20gJy4uL2FudGljaXBhdGUubWpzJztcbmltcG9ydCB7IGJhY2tPdXQsIGJhY2tJbk91dCwgYmFja0luIH0gZnJvbSAnLi4vYmFjay5tanMnO1xuaW1wb3J0IHsgY2lyY091dCwgY2lyY0luT3V0LCBjaXJjSW4gfSBmcm9tICcuLi9jaXJjLm1qcyc7XG5pbXBvcnQgeyBjdWJpY0JlemllciB9IGZyb20gJy4uL2N1YmljLWJlemllci5tanMnO1xuaW1wb3J0IHsgZWFzZU91dCwgZWFzZUluT3V0LCBlYXNlSW4gfSBmcm9tICcuLi9lYXNlLm1qcyc7XG5pbXBvcnQgeyBpc0JlemllckRlZmluaXRpb24gfSBmcm9tICcuL2lzLWJlemllci1kZWZpbml0aW9uLm1qcyc7XG5cbmNvbnN0IGVhc2luZ0xvb2t1cCA9IHtcbiAgICBsaW5lYXI6IG5vb3AsXG4gICAgZWFzZUluLFxuICAgIGVhc2VJbk91dCxcbiAgICBlYXNlT3V0LFxuICAgIGNpcmNJbixcbiAgICBjaXJjSW5PdXQsXG4gICAgY2lyY091dCxcbiAgICBiYWNrSW4sXG4gICAgYmFja0luT3V0LFxuICAgIGJhY2tPdXQsXG4gICAgYW50aWNpcGF0ZSxcbn07XG5jb25zdCBpc1ZhbGlkRWFzaW5nID0gKGVhc2luZykgPT4ge1xuICAgIHJldHVybiB0eXBlb2YgZWFzaW5nID09PSBcInN0cmluZ1wiO1xufTtcbmNvbnN0IGVhc2luZ0RlZmluaXRpb25Ub0Z1bmN0aW9uID0gKGRlZmluaXRpb24pID0+IHtcbiAgICBpZiAoaXNCZXppZXJEZWZpbml0aW9uKGRlZmluaXRpb24pKSB7XG4gICAgICAgIC8vIElmIGN1YmljIGJlemllciBkZWZpbml0aW9uLCBjcmVhdGUgYmV6aWVyIGN1cnZlXG4gICAgICAgIGludmFyaWFudChkZWZpbml0aW9uLmxlbmd0aCA9PT0gNCwgYEN1YmljIGJlemllciBhcnJheXMgbXVzdCBjb250YWluIGZvdXIgbnVtZXJpY2FsIHZhbHVlcy5gLCBcImN1YmljLWJlemllci1sZW5ndGhcIik7XG4gICAgICAgIGNvbnN0IFt4MSwgeTEsIHgyLCB5Ml0gPSBkZWZpbml0aW9uO1xuICAgICAgICByZXR1cm4gY3ViaWNCZXppZXIoeDEsIHkxLCB4MiwgeTIpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc1ZhbGlkRWFzaW5nKGRlZmluaXRpb24pKSB7XG4gICAgICAgIC8vIEVsc2UgbG9va3VwIGZyb20gdGFibGVcbiAgICAgICAgaW52YXJpYW50KGVhc2luZ0xvb2t1cFtkZWZpbml0aW9uXSAhPT0gdW5kZWZpbmVkLCBgSW52YWxpZCBlYXNpbmcgdHlwZSAnJHtkZWZpbml0aW9ufSdgLCBcImludmFsaWQtZWFzaW5nLXR5cGVcIik7XG4gICAgICAgIHJldHVybiBlYXNpbmdMb29rdXBbZGVmaW5pdGlvbl07XG4gICAgfVxuICAgIHJldHVybiBkZWZpbml0aW9uO1xufTtcblxuZXhwb3J0IHsgZWFzaW5nRGVmaW5pdGlvblRvRnVuY3Rpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1hcC5tanMubWFwXG4iLCJjb25zdCBzdGVwc09yZGVyID0gW1xuICAgIFwic2V0dXBcIiwgLy8gQ29tcHV0ZVxuICAgIFwicmVhZFwiLCAvLyBSZWFkXG4gICAgXCJyZXNvbHZlS2V5ZnJhbWVzXCIsIC8vIFdyaXRlL1JlYWQvV3JpdGUvUmVhZFxuICAgIFwicHJlVXBkYXRlXCIsIC8vIENvbXB1dGVcbiAgICBcInVwZGF0ZVwiLCAvLyBDb21wdXRlXG4gICAgXCJwcmVSZW5kZXJcIiwgLy8gQ29tcHV0ZVxuICAgIFwicmVuZGVyXCIsIC8vIFdyaXRlXG4gICAgXCJwb3N0UmVuZGVyXCIsIC8vIENvbXB1dGVcbl07XG5cbmV4cG9ydCB7IHN0ZXBzT3JkZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9yZGVyLm1qcy5tYXBcbiIsImNvbnN0IHN0YXRzQnVmZmVyID0ge1xuICAgIHZhbHVlOiBudWxsLFxuICAgIGFkZFByb2plY3Rpb25NZXRyaWNzOiBudWxsLFxufTtcblxuZXhwb3J0IHsgc3RhdHNCdWZmZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1ZmZlci5tanMubWFwXG4iLCJpbXBvcnQgeyBzdGF0c0J1ZmZlciB9IGZyb20gJy4uL3N0YXRzL2J1ZmZlci5tanMnO1xuXG5mdW5jdGlvbiBjcmVhdGVSZW5kZXJTdGVwKHJ1bk5leHRGcmFtZSwgc3RlcE5hbWUpIHtcbiAgICAvKipcbiAgICAgKiBXZSBjcmVhdGUgYW5kIHJldXNlIHR3byBxdWV1ZXMsIG9uZSB0byBxdWV1ZSBqb2JzIGZvciB0aGUgY3VycmVudCBmcmFtZVxuICAgICAqIGFuZCBvbmUgZm9yIHRoZSBuZXh0LiBXZSByZXVzZSB0byBhdm9pZCB0cmlnZ2VyaW5nIEdDIGFmdGVyIHggZnJhbWVzLlxuICAgICAqL1xuICAgIGxldCB0aGlzRnJhbWUgPSBuZXcgU2V0KCk7XG4gICAgbGV0IG5leHRGcmFtZSA9IG5ldyBTZXQoKTtcbiAgICAvKipcbiAgICAgKiBUcmFjayB3aGV0aGVyIHdlJ3JlIGN1cnJlbnRseSBwcm9jZXNzaW5nIGpvYnMgaW4gdGhpcyBzdGVwLiBUaGlzIHdheVxuICAgICAqIHdlIGNhbiBkZWNpZGUgd2hldGhlciB0byBzY2hlZHVsZSBuZXcgam9icyBmb3IgdGhpcyBmcmFtZSBvciBuZXh0LlxuICAgICAqL1xuICAgIGxldCBpc1Byb2Nlc3NpbmcgPSBmYWxzZTtcbiAgICBsZXQgZmx1c2hOZXh0RnJhbWUgPSBmYWxzZTtcbiAgICAvKipcbiAgICAgKiBBIHNldCBvZiBwcm9jZXNzZXMgd2hpY2ggd2VyZSBtYXJrZWQga2VlcEFsaXZlIHdoZW4gc2NoZWR1bGVkLlxuICAgICAqL1xuICAgIGNvbnN0IHRvS2VlcEFsaXZlID0gbmV3IFdlYWtTZXQoKTtcbiAgICBsZXQgbGF0ZXN0RnJhbWVEYXRhID0ge1xuICAgICAgICBkZWx0YTogMC4wLFxuICAgICAgICB0aW1lc3RhbXA6IDAuMCxcbiAgICAgICAgaXNQcm9jZXNzaW5nOiBmYWxzZSxcbiAgICB9O1xuICAgIGxldCBudW1DYWxscyA9IDA7XG4gICAgZnVuY3Rpb24gdHJpZ2dlckNhbGxiYWNrKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0b0tlZXBBbGl2ZS5oYXMoY2FsbGJhY2spKSB7XG4gICAgICAgICAgICBzdGVwLnNjaGVkdWxlKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHJ1bk5leHRGcmFtZSgpO1xuICAgICAgICB9XG4gICAgICAgIG51bUNhbGxzKys7XG4gICAgICAgIGNhbGxiYWNrKGxhdGVzdEZyYW1lRGF0YSk7XG4gICAgfVxuICAgIGNvbnN0IHN0ZXAgPSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTY2hlZHVsZSBhIHByb2Nlc3MgdG8gcnVuIG9uIHRoZSBuZXh0IGZyYW1lLlxuICAgICAgICAgKi9cbiAgICAgICAgc2NoZWR1bGU6IChjYWxsYmFjaywga2VlcEFsaXZlID0gZmFsc2UsIGltbWVkaWF0ZSA9IGZhbHNlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhZGRUb0N1cnJlbnRGcmFtZSA9IGltbWVkaWF0ZSAmJiBpc1Byb2Nlc3Npbmc7XG4gICAgICAgICAgICBjb25zdCBxdWV1ZSA9IGFkZFRvQ3VycmVudEZyYW1lID8gdGhpc0ZyYW1lIDogbmV4dEZyYW1lO1xuICAgICAgICAgICAgaWYgKGtlZXBBbGl2ZSlcbiAgICAgICAgICAgICAgICB0b0tlZXBBbGl2ZS5hZGQoY2FsbGJhY2spO1xuICAgICAgICAgICAgcXVldWUuYWRkKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaztcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhbmNlbCB0aGUgcHJvdmlkZWQgY2FsbGJhY2sgZnJvbSBydW5uaW5nIG9uIHRoZSBuZXh0IGZyYW1lLlxuICAgICAgICAgKi9cbiAgICAgICAgY2FuY2VsOiAoY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIG5leHRGcmFtZS5kZWxldGUoY2FsbGJhY2spO1xuICAgICAgICAgICAgdG9LZWVwQWxpdmUuZGVsZXRlKGNhbGxiYWNrKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEV4ZWN1dGUgYWxsIHNjaGVkdWxlIGNhbGxiYWNrcy5cbiAgICAgICAgICovXG4gICAgICAgIHByb2Nlc3M6IChmcmFtZURhdGEpID0+IHtcbiAgICAgICAgICAgIGxhdGVzdEZyYW1lRGF0YSA9IGZyYW1lRGF0YTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgd2UncmUgYWxyZWFkeSBwcm9jZXNzaW5nIHdlJ3ZlIHByb2JhYmx5IGJlZW4gdHJpZ2dlcmVkIGJ5IGEgZmx1c2hTeW5jXG4gICAgICAgICAgICAgKiBpbnNpZGUgYW4gZXhpc3RpbmcgcHJvY2Vzcy4gSW5zdGVhZCBvZiBleGVjdXRpbmcsIG1hcmsgZmx1c2hOZXh0RnJhbWVcbiAgICAgICAgICAgICAqIGFzIHRydWUgYW5kIGVuc3VyZSB3ZSBmbHVzaCB0aGUgZm9sbG93aW5nIGZyYW1lIGF0IHRoZSBlbmQgb2YgdGhpcyBvbmUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChpc1Byb2Nlc3NpbmcpIHtcbiAgICAgICAgICAgICAgICBmbHVzaE5leHRGcmFtZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXNQcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIFN3YXAgdGhpcyBmcmFtZSBhbmQgdGhlIG5leHQgdG8gYXZvaWQgR0NcbiAgICAgICAgICAgIGNvbnN0IHByZXZGcmFtZSA9IHRoaXNGcmFtZTtcbiAgICAgICAgICAgIHRoaXNGcmFtZSA9IG5leHRGcmFtZTtcbiAgICAgICAgICAgIG5leHRGcmFtZSA9IHByZXZGcmFtZTtcbiAgICAgICAgICAgIC8vIEV4ZWN1dGUgdGhpcyBmcmFtZVxuICAgICAgICAgICAgdGhpc0ZyYW1lLmZvckVhY2godHJpZ2dlckNhbGxiYWNrKTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgd2UncmUgcmVjb3JkaW5nIHN0YXRzIHRoZW5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHN0ZXBOYW1lICYmIHN0YXRzQnVmZmVyLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgc3RhdHNCdWZmZXIudmFsdWUuZnJhbWVsb29wW3N0ZXBOYW1lXS5wdXNoKG51bUNhbGxzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG51bUNhbGxzID0gMDtcbiAgICAgICAgICAgIC8vIENsZWFyIHRoZSBmcmFtZSBzbyBubyBjYWxsYmFja3MgcmVtYWluLiBUaGlzIGlzIHRvIGF2b2lkXG4gICAgICAgICAgICAvLyBtZW1vcnkgbGVha3Mgc2hvdWxkIHRoaXMgcmVuZGVyIHN0ZXAgbm90IHJ1biBmb3IgYSB3aGlsZS5cbiAgICAgICAgICAgIHRoaXNGcmFtZS5jbGVhcigpO1xuICAgICAgICAgICAgaXNQcm9jZXNzaW5nID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoZmx1c2hOZXh0RnJhbWUpIHtcbiAgICAgICAgICAgICAgICBmbHVzaE5leHRGcmFtZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHN0ZXAucHJvY2VzcyhmcmFtZURhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH07XG4gICAgcmV0dXJuIHN0ZXA7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZVJlbmRlclN0ZXAgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlbmRlci1zdGVwLm1qcy5tYXBcbiIsImltcG9ydCB7IE1vdGlvbkdsb2JhbENvbmZpZyB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBzdGVwc09yZGVyIH0gZnJvbSAnLi9vcmRlci5tanMnO1xuaW1wb3J0IHsgY3JlYXRlUmVuZGVyU3RlcCB9IGZyb20gJy4vcmVuZGVyLXN0ZXAubWpzJztcblxuY29uc3QgbWF4RWxhcHNlZCA9IDQwO1xuZnVuY3Rpb24gY3JlYXRlUmVuZGVyQmF0Y2hlcihzY2hlZHVsZU5leHRCYXRjaCwgYWxsb3dLZWVwQWxpdmUpIHtcbiAgICBsZXQgcnVuTmV4dEZyYW1lID0gZmFsc2U7XG4gICAgbGV0IHVzZURlZmF1bHRFbGFwc2VkID0gdHJ1ZTtcbiAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgZGVsdGE6IDAuMCxcbiAgICAgICAgdGltZXN0YW1wOiAwLjAsXG4gICAgICAgIGlzUHJvY2Vzc2luZzogZmFsc2UsXG4gICAgfTtcbiAgICBjb25zdCBmbGFnUnVuTmV4dEZyYW1lID0gKCkgPT4gKHJ1bk5leHRGcmFtZSA9IHRydWUpO1xuICAgIGNvbnN0IHN0ZXBzID0gc3RlcHNPcmRlci5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgICAgIGFjY1trZXldID0gY3JlYXRlUmVuZGVyU3RlcChmbGFnUnVuTmV4dEZyYW1lLCBhbGxvd0tlZXBBbGl2ZSA/IGtleSA6IHVuZGVmaW5lZCk7XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICAgIGNvbnN0IHsgc2V0dXAsIHJlYWQsIHJlc29sdmVLZXlmcmFtZXMsIHByZVVwZGF0ZSwgdXBkYXRlLCBwcmVSZW5kZXIsIHJlbmRlciwgcG9zdFJlbmRlciwgfSA9IHN0ZXBzO1xuICAgIGNvbnN0IHByb2Nlc3NCYXRjaCA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgdXNlTWFudWFsVGltaW5nID0gTW90aW9uR2xvYmFsQ29uZmlnLnVzZU1hbnVhbFRpbWluZztcbiAgICAgICAgY29uc3QgdGltZXN0YW1wID0gdXNlTWFudWFsVGltaW5nXG4gICAgICAgICAgICA/IHN0YXRlLnRpbWVzdGFtcFxuICAgICAgICAgICAgOiBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgcnVuTmV4dEZyYW1lID0gZmFsc2U7XG4gICAgICAgIGlmICghdXNlTWFudWFsVGltaW5nKSB7XG4gICAgICAgICAgICBzdGF0ZS5kZWx0YSA9IHVzZURlZmF1bHRFbGFwc2VkXG4gICAgICAgICAgICAgICAgPyAxMDAwIC8gNjBcbiAgICAgICAgICAgICAgICA6IE1hdGgubWF4KE1hdGgubWluKHRpbWVzdGFtcCAtIHN0YXRlLnRpbWVzdGFtcCwgbWF4RWxhcHNlZCksIDEpO1xuICAgICAgICB9XG4gICAgICAgIHN0YXRlLnRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcbiAgICAgICAgc3RhdGUuaXNQcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICAgICAgLy8gVW5yb2xsZWQgcmVuZGVyIGxvb3AgZm9yIGJldHRlciBwZXItZnJhbWUgcGVyZm9ybWFuY2VcbiAgICAgICAgc2V0dXAucHJvY2VzcyhzdGF0ZSk7XG4gICAgICAgIHJlYWQucHJvY2VzcyhzdGF0ZSk7XG4gICAgICAgIHJlc29sdmVLZXlmcmFtZXMucHJvY2VzcyhzdGF0ZSk7XG4gICAgICAgIHByZVVwZGF0ZS5wcm9jZXNzKHN0YXRlKTtcbiAgICAgICAgdXBkYXRlLnByb2Nlc3Moc3RhdGUpO1xuICAgICAgICBwcmVSZW5kZXIucHJvY2VzcyhzdGF0ZSk7XG4gICAgICAgIHJlbmRlci5wcm9jZXNzKHN0YXRlKTtcbiAgICAgICAgcG9zdFJlbmRlci5wcm9jZXNzKHN0YXRlKTtcbiAgICAgICAgc3RhdGUuaXNQcm9jZXNzaW5nID0gZmFsc2U7XG4gICAgICAgIGlmIChydW5OZXh0RnJhbWUgJiYgYWxsb3dLZWVwQWxpdmUpIHtcbiAgICAgICAgICAgIHVzZURlZmF1bHRFbGFwc2VkID0gZmFsc2U7XG4gICAgICAgICAgICBzY2hlZHVsZU5leHRCYXRjaChwcm9jZXNzQmF0Y2gpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBjb25zdCB3YWtlID0gKCkgPT4ge1xuICAgICAgICBydW5OZXh0RnJhbWUgPSB0cnVlO1xuICAgICAgICB1c2VEZWZhdWx0RWxhcHNlZCA9IHRydWU7XG4gICAgICAgIGlmICghc3RhdGUuaXNQcm9jZXNzaW5nKSB7XG4gICAgICAgICAgICBzY2hlZHVsZU5leHRCYXRjaChwcm9jZXNzQmF0Y2gpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBzY2hlZHVsZSA9IHN0ZXBzT3JkZXIucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgICAgICBjb25zdCBzdGVwID0gc3RlcHNba2V5XTtcbiAgICAgICAgYWNjW2tleV0gPSAocHJvY2Vzcywga2VlcEFsaXZlID0gZmFsc2UsIGltbWVkaWF0ZSA9IGZhbHNlKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXJ1bk5leHRGcmFtZSlcbiAgICAgICAgICAgICAgICB3YWtlKCk7XG4gICAgICAgICAgICByZXR1cm4gc3RlcC5zY2hlZHVsZShwcm9jZXNzLCBrZWVwQWxpdmUsIGltbWVkaWF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICAgIGNvbnN0IGNhbmNlbCA9IChwcm9jZXNzKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RlcHNPcmRlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc3RlcHNbc3RlcHNPcmRlcltpXV0uY2FuY2VsKHByb2Nlc3MpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4geyBzY2hlZHVsZSwgY2FuY2VsLCBzdGF0ZSwgc3RlcHMgfTtcbn1cblxuZXhwb3J0IHsgY3JlYXRlUmVuZGVyQmF0Y2hlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YmF0Y2hlci5tanMubWFwXG4iLCJpbXBvcnQgeyBub29wIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcbmltcG9ydCB7IGNyZWF0ZVJlbmRlckJhdGNoZXIgfSBmcm9tICcuL2JhdGNoZXIubWpzJztcblxuY29uc3QgeyBzY2hlZHVsZTogZnJhbWUsIGNhbmNlbDogY2FuY2VsRnJhbWUsIHN0YXRlOiBmcmFtZURhdGEsIHN0ZXBzOiBmcmFtZVN0ZXBzLCB9ID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZVJlbmRlckJhdGNoZXIodHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSAhPT0gXCJ1bmRlZmluZWRcIiA/IHJlcXVlc3RBbmltYXRpb25GcmFtZSA6IG5vb3AsIHRydWUpO1xuXG5leHBvcnQgeyBjYW5jZWxGcmFtZSwgZnJhbWUsIGZyYW1lRGF0YSwgZnJhbWVTdGVwcyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZnJhbWUubWpzLm1hcFxuIiwiaW1wb3J0IHsgTW90aW9uR2xvYmFsQ29uZmlnIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcbmltcG9ydCB7IGZyYW1lRGF0YSB9IGZyb20gJy4vZnJhbWUubWpzJztcblxubGV0IG5vdztcbmZ1bmN0aW9uIGNsZWFyVGltZSgpIHtcbiAgICBub3cgPSB1bmRlZmluZWQ7XG59XG4vKipcbiAqIEFuIGV2ZW50bG9vcC1zeW5jaHJvbm91cyBhbHRlcm5hdGl2ZSB0byBwZXJmb3JtYW5jZS5ub3coKS5cbiAqXG4gKiBFbnN1cmVzIHRoYXQgdGltZSBtZWFzdXJlbWVudHMgcmVtYWluIGNvbnNpc3RlbnQgd2l0aGluIGEgc3luY2hyb25vdXMgY29udGV4dC5cbiAqIFVzdWFsbHkgY2FsbGluZyBwZXJmb3JtYW5jZS5ub3coKSB0d2ljZSB3aXRoaW4gdGhlIHNhbWUgc3luY2hyb25vdXMgY29udGV4dFxuICogd2lsbCByZXR1cm4gZGlmZmVyZW50IHZhbHVlcyB3aGljaCBpc24ndCB1c2VmdWwgZm9yIGFuaW1hdGlvbnMgd2hlbiB3ZSdyZSB1c3VhbGx5XG4gKiB0cnlpbmcgdG8gc3luYyBhbmltYXRpb25zIHRvIHRoZSBzYW1lIGZyYW1lLlxuICovXG5jb25zdCB0aW1lID0ge1xuICAgIG5vdzogKCkgPT4ge1xuICAgICAgICBpZiAobm93ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRpbWUuc2V0KGZyYW1lRGF0YS5pc1Byb2Nlc3NpbmcgfHwgTW90aW9uR2xvYmFsQ29uZmlnLnVzZU1hbnVhbFRpbWluZ1xuICAgICAgICAgICAgICAgID8gZnJhbWVEYXRhLnRpbWVzdGFtcFxuICAgICAgICAgICAgICAgIDogcGVyZm9ybWFuY2Uubm93KCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub3c7XG4gICAgfSxcbiAgICBzZXQ6IChuZXdUaW1lKSA9PiB7XG4gICAgICAgIG5vdyA9IG5ld1RpbWU7XG4gICAgICAgIHF1ZXVlTWljcm90YXNrKGNsZWFyVGltZSk7XG4gICAgfSxcbn07XG5cbmV4cG9ydCB7IHRpbWUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN5bmMtdGltZS5tanMubWFwXG4iLCJjb25zdCBhY3RpdmVBbmltYXRpb25zID0ge1xuICAgIGxheW91dDogMCxcbiAgICBtYWluVGhyZWFkOiAwLFxuICAgIHdhYXBpOiAwLFxufTtcblxuZXhwb3J0IHsgYWN0aXZlQW5pbWF0aW9ucyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YW5pbWF0aW9uLWNvdW50Lm1qcy5tYXBcbiIsImNvbnN0IGNoZWNrU3RyaW5nU3RhcnRzV2l0aCA9ICh0b2tlbikgPT4gKGtleSkgPT4gdHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIiAmJiBrZXkuc3RhcnRzV2l0aCh0b2tlbik7XG5jb25zdCBpc0NTU1ZhcmlhYmxlTmFtZSA9IFxuLypAX19QVVJFX18qLyBjaGVja1N0cmluZ1N0YXJ0c1dpdGgoXCItLVwiKTtcbmNvbnN0IHN0YXJ0c0FzVmFyaWFibGVUb2tlbiA9IFxuLypAX19QVVJFX18qLyBjaGVja1N0cmluZ1N0YXJ0c1dpdGgoXCJ2YXIoLS1cIik7XG5jb25zdCBpc0NTU1ZhcmlhYmxlVG9rZW4gPSAodmFsdWUpID0+IHtcbiAgICBjb25zdCBzdGFydHNXaXRoVG9rZW4gPSBzdGFydHNBc1ZhcmlhYmxlVG9rZW4odmFsdWUpO1xuICAgIGlmICghc3RhcnRzV2l0aFRva2VuKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgLy8gRW5zdXJlIGFueSBjb21tZW50cyBhcmUgc3RyaXBwZWQgZnJvbSB0aGUgdmFsdWUgYXMgdGhpcyBjYW4gaGFybSBwZXJmb3JtYW5jZSBvZiB0aGUgcmVnZXguXG4gICAgcmV0dXJuIHNpbmdsZUNzc1ZhcmlhYmxlUmVnZXgudGVzdCh2YWx1ZS5zcGxpdChcIi8qXCIpWzBdLnRyaW0oKSk7XG59O1xuY29uc3Qgc2luZ2xlQ3NzVmFyaWFibGVSZWdleCA9IC92YXJcXCgtLSg/OltcXHctXStcXHMqfFtcXHctXStcXHMqLCg/OlxccypbXikoXFxzXXxcXHMqXFwoKD86W14pKF18XFwoW14pKF0qXFwpKSpcXCkpK1xccyopXFwpJC9pdTtcbi8qKlxuICogQ2hlY2sgaWYgYSB2YWx1ZSBjb250YWlucyBhIENTUyB2YXJpYWJsZSBhbnl3aGVyZSAoZS5nLiBpbnNpZGUgY2FsYygpKS5cbiAqIFVubGlrZSBpc0NTU1ZhcmlhYmxlVG9rZW4gd2hpY2ggY2hlY2tzIGlmIHRoZSB2YWx1ZSBJUyBhIHZhcigpIHRva2VuLFxuICogdGhpcyBjaGVja3MgaWYgdGhlIHZhbHVlIENPTlRBSU5TIHZhcigpIHNvbWV3aGVyZSBpbiB0aGUgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBjb250YWluc0NTU1ZhcmlhYmxlKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJzdHJpbmdcIilcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vIFN0cmlwIGNvbW1lbnRzIHRvIGF2b2lkIGZhbHNlIHBvc2l0aXZlc1xuICAgIHJldHVybiB2YWx1ZS5zcGxpdChcIi8qXCIpWzBdLmluY2x1ZGVzKFwidmFyKC0tXCIpO1xufVxuXG5leHBvcnQgeyBjb250YWluc0NTU1ZhcmlhYmxlLCBpc0NTU1ZhcmlhYmxlTmFtZSwgaXNDU1NWYXJpYWJsZVRva2VuIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pcy1jc3MtdmFyaWFibGUubWpzLm1hcFxuIiwiaW1wb3J0IHsgY2xhbXAgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuXG5jb25zdCBudW1iZXIgPSB7XG4gICAgdGVzdDogKHYpID0+IHR5cGVvZiB2ID09PSBcIm51bWJlclwiLFxuICAgIHBhcnNlOiBwYXJzZUZsb2F0LFxuICAgIHRyYW5zZm9ybTogKHYpID0+IHYsXG59O1xuY29uc3QgYWxwaGEgPSB7XG4gICAgLi4ubnVtYmVyLFxuICAgIHRyYW5zZm9ybTogKHYpID0+IGNsYW1wKDAsIDEsIHYpLFxufTtcbmNvbnN0IHNjYWxlID0ge1xuICAgIC4uLm51bWJlcixcbiAgICBkZWZhdWx0OiAxLFxufTtcblxuZXhwb3J0IHsgYWxwaGEsIG51bWJlciwgc2NhbGUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4Lm1qcy5tYXBcbiIsIi8vIElmIHRoaXMgbnVtYmVyIGlzIGEgZGVjaW1hbCwgbWFrZSBpdCBqdXN0IGZpdmUgZGVjaW1hbCBwbGFjZXNcbi8vIHRvIGF2b2lkIGV4cG9uZW50c1xuY29uc3Qgc2FuaXRpemUgPSAodikgPT4gTWF0aC5yb3VuZCh2ICogMTAwMDAwKSAvIDEwMDAwMDtcblxuZXhwb3J0IHsgc2FuaXRpemUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNhbml0aXplLm1qcy5tYXBcbiIsImNvbnN0IGZsb2F0UmVnZXggPSAvLT8oPzpcXGQrKD86XFwuXFxkKyk/fFxcLlxcZCspL2d1O1xuXG5leHBvcnQgeyBmbG9hdFJlZ2V4IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mbG9hdC1yZWdleC5tanMubWFwXG4iLCJmdW5jdGlvbiBpc051bGxpc2godikge1xuICAgIHJldHVybiB2ID09IG51bGw7XG59XG5cbmV4cG9ydCB7IGlzTnVsbGlzaCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtbnVsbGlzaC5tanMubWFwXG4iLCJjb25zdCBzaW5nbGVDb2xvclJlZ2V4ID0gL14oPzojW1xcZGEtZl17Myw4fXwoPzpyZ2J8aHNsKWE/XFwoKD86LT9bXFxkLl0rJT9bLFxcc10rKXsyfS0/W1xcZC5dKyU/XFxzKig/OlssL11cXHMqKT8oPzpcXGJcXGQrKD86XFwuXFxkKyk/fFxcLlxcZCspPyU/XFwpKSQvaXU7XG5cbmV4cG9ydCB7IHNpbmdsZUNvbG9yUmVnZXggfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNpbmdsZS1jb2xvci1yZWdleC5tanMubWFwXG4iLCJpbXBvcnQgeyBmbG9hdFJlZ2V4IH0gZnJvbSAnLi4vdXRpbHMvZmxvYXQtcmVnZXgubWpzJztcbmltcG9ydCB7IGlzTnVsbGlzaCB9IGZyb20gJy4uL3V0aWxzL2lzLW51bGxpc2gubWpzJztcbmltcG9ydCB7IHNpbmdsZUNvbG9yUmVnZXggfSBmcm9tICcuLi91dGlscy9zaW5nbGUtY29sb3ItcmVnZXgubWpzJztcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHByb3ZpZGVkIHN0cmluZyBpcyBhIGNvbG9yLCBpZSByZ2JhKDAsMCwwLDApIG9yICMwMDAsXG4gKiBidXQgZmFsc2UgaWYgYSBudW1iZXIgb3IgbXVsdGlwbGUgY29sb3JzXG4gKi9cbmNvbnN0IGlzQ29sb3JTdHJpbmcgPSAodHlwZSwgdGVzdFByb3ApID0+ICh2KSA9PiB7XG4gICAgcmV0dXJuIEJvb2xlYW4oKHR5cGVvZiB2ID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgIHNpbmdsZUNvbG9yUmVnZXgudGVzdCh2KSAmJlxuICAgICAgICB2LnN0YXJ0c1dpdGgodHlwZSkpIHx8XG4gICAgICAgICh0ZXN0UHJvcCAmJlxuICAgICAgICAgICAgIWlzTnVsbGlzaCh2KSAmJlxuICAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHYsIHRlc3RQcm9wKSkpO1xufTtcbmNvbnN0IHNwbGl0Q29sb3IgPSAoYU5hbWUsIGJOYW1lLCBjTmFtZSkgPT4gKHYpID0+IHtcbiAgICBpZiAodHlwZW9mIHYgIT09IFwic3RyaW5nXCIpXG4gICAgICAgIHJldHVybiB2O1xuICAgIGNvbnN0IFthLCBiLCBjLCBhbHBoYV0gPSB2Lm1hdGNoKGZsb2F0UmVnZXgpO1xuICAgIHJldHVybiB7XG4gICAgICAgIFthTmFtZV06IHBhcnNlRmxvYXQoYSksXG4gICAgICAgIFtiTmFtZV06IHBhcnNlRmxvYXQoYiksXG4gICAgICAgIFtjTmFtZV06IHBhcnNlRmxvYXQoYyksXG4gICAgICAgIGFscGhhOiBhbHBoYSAhPT0gdW5kZWZpbmVkID8gcGFyc2VGbG9hdChhbHBoYSkgOiAxLFxuICAgIH07XG59O1xuXG5leHBvcnQgeyBpc0NvbG9yU3RyaW5nLCBzcGxpdENvbG9yIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD11dGlscy5tanMubWFwXG4iLCJpbXBvcnQgeyBjbGFtcCB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBudW1iZXIsIGFscGhhIH0gZnJvbSAnLi4vbnVtYmVycy9pbmRleC5tanMnO1xuaW1wb3J0IHsgc2FuaXRpemUgfSBmcm9tICcuLi91dGlscy9zYW5pdGl6ZS5tanMnO1xuaW1wb3J0IHsgc3BsaXRDb2xvciwgaXNDb2xvclN0cmluZyB9IGZyb20gJy4vdXRpbHMubWpzJztcblxuY29uc3QgY2xhbXBSZ2JVbml0ID0gKHYpID0+IGNsYW1wKDAsIDI1NSwgdik7XG5jb25zdCByZ2JVbml0ID0ge1xuICAgIC4uLm51bWJlcixcbiAgICB0cmFuc2Zvcm06ICh2KSA9PiBNYXRoLnJvdW5kKGNsYW1wUmdiVW5pdCh2KSksXG59O1xuY29uc3QgcmdiYSA9IHtcbiAgICB0ZXN0OiAvKkBfX1BVUkVfXyovIGlzQ29sb3JTdHJpbmcoXCJyZ2JcIiwgXCJyZWRcIiksXG4gICAgcGFyc2U6IC8qQF9fUFVSRV9fKi8gc3BsaXRDb2xvcihcInJlZFwiLCBcImdyZWVuXCIsIFwiYmx1ZVwiKSxcbiAgICB0cmFuc2Zvcm06ICh7IHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhOiBhbHBoYSQxID0gMSB9KSA9PiBcInJnYmEoXCIgK1xuICAgICAgICByZ2JVbml0LnRyYW5zZm9ybShyZWQpICtcbiAgICAgICAgXCIsIFwiICtcbiAgICAgICAgcmdiVW5pdC50cmFuc2Zvcm0oZ3JlZW4pICtcbiAgICAgICAgXCIsIFwiICtcbiAgICAgICAgcmdiVW5pdC50cmFuc2Zvcm0oYmx1ZSkgK1xuICAgICAgICBcIiwgXCIgK1xuICAgICAgICBzYW5pdGl6ZShhbHBoYS50cmFuc2Zvcm0oYWxwaGEkMSkpICtcbiAgICAgICAgXCIpXCIsXG59O1xuXG5leHBvcnQgeyByZ2JVbml0LCByZ2JhIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZ2JhLm1qcy5tYXBcbiIsImltcG9ydCB7IHJnYmEgfSBmcm9tICcuL3JnYmEubWpzJztcbmltcG9ydCB7IGlzQ29sb3JTdHJpbmcgfSBmcm9tICcuL3V0aWxzLm1qcyc7XG5cbmZ1bmN0aW9uIHBhcnNlSGV4KHYpIHtcbiAgICBsZXQgciA9IFwiXCI7XG4gICAgbGV0IGcgPSBcIlwiO1xuICAgIGxldCBiID0gXCJcIjtcbiAgICBsZXQgYSA9IFwiXCI7XG4gICAgLy8gSWYgd2UgaGF2ZSA2IGNoYXJhY3RlcnMsIGllICNGRjAwMDBcbiAgICBpZiAodi5sZW5ndGggPiA1KSB7XG4gICAgICAgIHIgPSB2LnN1YnN0cmluZygxLCAzKTtcbiAgICAgICAgZyA9IHYuc3Vic3RyaW5nKDMsIDUpO1xuICAgICAgICBiID0gdi5zdWJzdHJpbmcoNSwgNyk7XG4gICAgICAgIGEgPSB2LnN1YnN0cmluZyg3LCA5KTtcbiAgICAgICAgLy8gT3Igd2UgaGF2ZSAzIGNoYXJhY3RlcnMsIGllICNGMDBcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHIgPSB2LnN1YnN0cmluZygxLCAyKTtcbiAgICAgICAgZyA9IHYuc3Vic3RyaW5nKDIsIDMpO1xuICAgICAgICBiID0gdi5zdWJzdHJpbmcoMywgNCk7XG4gICAgICAgIGEgPSB2LnN1YnN0cmluZyg0LCA1KTtcbiAgICAgICAgciArPSByO1xuICAgICAgICBnICs9IGc7XG4gICAgICAgIGIgKz0gYjtcbiAgICAgICAgYSArPSBhO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICByZWQ6IHBhcnNlSW50KHIsIDE2KSxcbiAgICAgICAgZ3JlZW46IHBhcnNlSW50KGcsIDE2KSxcbiAgICAgICAgYmx1ZTogcGFyc2VJbnQoYiwgMTYpLFxuICAgICAgICBhbHBoYTogYSA/IHBhcnNlSW50KGEsIDE2KSAvIDI1NSA6IDEsXG4gICAgfTtcbn1cbmNvbnN0IGhleCA9IHtcbiAgICB0ZXN0OiAvKkBfX1BVUkVfXyovIGlzQ29sb3JTdHJpbmcoXCIjXCIpLFxuICAgIHBhcnNlOiBwYXJzZUhleCxcbiAgICB0cmFuc2Zvcm06IHJnYmEudHJhbnNmb3JtLFxufTtcblxuZXhwb3J0IHsgaGV4IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oZXgubWpzLm1hcFxuIiwiLyojX19OT19TSURFX0VGRkVDVFNfXyovXG5jb25zdCBjcmVhdGVVbml0VHlwZSA9ICh1bml0KSA9PiAoe1xuICAgIHRlc3Q6ICh2KSA9PiB0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIiAmJiB2LmVuZHNXaXRoKHVuaXQpICYmIHYuc3BsaXQoXCIgXCIpLmxlbmd0aCA9PT0gMSxcbiAgICBwYXJzZTogcGFyc2VGbG9hdCxcbiAgICB0cmFuc2Zvcm06ICh2KSA9PiBgJHt2fSR7dW5pdH1gLFxufSk7XG5jb25zdCBkZWdyZWVzID0gLypAX19QVVJFX18qLyBjcmVhdGVVbml0VHlwZShcImRlZ1wiKTtcbmNvbnN0IHBlcmNlbnQgPSAvKkBfX1BVUkVfXyovIGNyZWF0ZVVuaXRUeXBlKFwiJVwiKTtcbmNvbnN0IHB4ID0gLypAX19QVVJFX18qLyBjcmVhdGVVbml0VHlwZShcInB4XCIpO1xuY29uc3QgdmggPSAvKkBfX1BVUkVfXyovIGNyZWF0ZVVuaXRUeXBlKFwidmhcIik7XG5jb25zdCB2dyA9IC8qQF9fUFVSRV9fKi8gY3JlYXRlVW5pdFR5cGUoXCJ2d1wiKTtcbmNvbnN0IHByb2dyZXNzUGVyY2VudGFnZSA9IC8qQF9fUFVSRV9fKi8gKCgpID0+ICh7XG4gICAgLi4ucGVyY2VudCxcbiAgICBwYXJzZTogKHYpID0+IHBlcmNlbnQucGFyc2UodikgLyAxMDAsXG4gICAgdHJhbnNmb3JtOiAodikgPT4gcGVyY2VudC50cmFuc2Zvcm0odiAqIDEwMCksXG59KSkoKTtcblxuZXhwb3J0IHsgZGVncmVlcywgcGVyY2VudCwgcHJvZ3Jlc3NQZXJjZW50YWdlLCBweCwgdmgsIHZ3IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD11bml0cy5tanMubWFwXG4iLCJpbXBvcnQgeyBhbHBoYSB9IGZyb20gJy4uL251bWJlcnMvaW5kZXgubWpzJztcbmltcG9ydCB7IHBlcmNlbnQgfSBmcm9tICcuLi9udW1iZXJzL3VuaXRzLm1qcyc7XG5pbXBvcnQgeyBzYW5pdGl6ZSB9IGZyb20gJy4uL3V0aWxzL3Nhbml0aXplLm1qcyc7XG5pbXBvcnQgeyBzcGxpdENvbG9yLCBpc0NvbG9yU3RyaW5nIH0gZnJvbSAnLi91dGlscy5tanMnO1xuXG5jb25zdCBoc2xhID0ge1xuICAgIHRlc3Q6IC8qQF9fUFVSRV9fKi8gaXNDb2xvclN0cmluZyhcImhzbFwiLCBcImh1ZVwiKSxcbiAgICBwYXJzZTogLypAX19QVVJFX18qLyBzcGxpdENvbG9yKFwiaHVlXCIsIFwic2F0dXJhdGlvblwiLCBcImxpZ2h0bmVzc1wiKSxcbiAgICB0cmFuc2Zvcm06ICh7IGh1ZSwgc2F0dXJhdGlvbiwgbGlnaHRuZXNzLCBhbHBoYTogYWxwaGEkMSA9IDEgfSkgPT4ge1xuICAgICAgICByZXR1cm4gKFwiaHNsYShcIiArXG4gICAgICAgICAgICBNYXRoLnJvdW5kKGh1ZSkgK1xuICAgICAgICAgICAgXCIsIFwiICtcbiAgICAgICAgICAgIHBlcmNlbnQudHJhbnNmb3JtKHNhbml0aXplKHNhdHVyYXRpb24pKSArXG4gICAgICAgICAgICBcIiwgXCIgK1xuICAgICAgICAgICAgcGVyY2VudC50cmFuc2Zvcm0oc2FuaXRpemUobGlnaHRuZXNzKSkgK1xuICAgICAgICAgICAgXCIsIFwiICtcbiAgICAgICAgICAgIHNhbml0aXplKGFscGhhLnRyYW5zZm9ybShhbHBoYSQxKSkgK1xuICAgICAgICAgICAgXCIpXCIpO1xuICAgIH0sXG59O1xuXG5leHBvcnQgeyBoc2xhIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1oc2xhLm1qcy5tYXBcbiIsImltcG9ydCB7IGhleCB9IGZyb20gJy4vaGV4Lm1qcyc7XG5pbXBvcnQgeyBoc2xhIH0gZnJvbSAnLi9oc2xhLm1qcyc7XG5pbXBvcnQgeyByZ2JhIH0gZnJvbSAnLi9yZ2JhLm1qcyc7XG5cbmNvbnN0IGNvbG9yID0ge1xuICAgIHRlc3Q6ICh2KSA9PiByZ2JhLnRlc3QodikgfHwgaGV4LnRlc3QodikgfHwgaHNsYS50ZXN0KHYpLFxuICAgIHBhcnNlOiAodikgPT4ge1xuICAgICAgICBpZiAocmdiYS50ZXN0KHYpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmdiYS5wYXJzZSh2KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChoc2xhLnRlc3QodikpIHtcbiAgICAgICAgICAgIHJldHVybiBoc2xhLnBhcnNlKHYpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGhleC5wYXJzZSh2KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdHJhbnNmb3JtOiAodikgPT4ge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHYgPT09IFwic3RyaW5nXCJcbiAgICAgICAgICAgID8gdlxuICAgICAgICAgICAgOiB2Lmhhc093blByb3BlcnR5KFwicmVkXCIpXG4gICAgICAgICAgICAgICAgPyByZ2JhLnRyYW5zZm9ybSh2KVxuICAgICAgICAgICAgICAgIDogaHNsYS50cmFuc2Zvcm0odik7XG4gICAgfSxcbiAgICBnZXRBbmltYXRhYmxlTm9uZTogKHYpID0+IHtcbiAgICAgICAgY29uc3QgcGFyc2VkID0gY29sb3IucGFyc2Uodik7XG4gICAgICAgIHBhcnNlZC5hbHBoYSA9IDA7XG4gICAgICAgIHJldHVybiBjb2xvci50cmFuc2Zvcm0ocGFyc2VkKTtcbiAgICB9LFxufTtcblxuZXhwb3J0IHsgY29sb3IgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4Lm1qcy5tYXBcbiIsImNvbnN0IGNvbG9yUmVnZXggPSAvKD86I1tcXGRhLWZdezMsOH18KD86cmdifGhzbClhP1xcKCg/Oi0/W1xcZC5dKyU/WyxcXHNdKyl7Mn0tP1tcXGQuXSslP1xccyooPzpbLC9dXFxzKik/KD86XFxiXFxkKyg/OlxcLlxcZCspP3xcXC5cXGQrKT8lP1xcKSkvZ2l1O1xuXG5leHBvcnQgeyBjb2xvclJlZ2V4IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb2xvci1yZWdleC5tanMubWFwXG4iLCJpbXBvcnQgeyBjb2xvciB9IGZyb20gJy4uL2NvbG9yL2luZGV4Lm1qcyc7XG5pbXBvcnQgeyBjb2xvclJlZ2V4IH0gZnJvbSAnLi4vdXRpbHMvY29sb3ItcmVnZXgubWpzJztcbmltcG9ydCB7IGZsb2F0UmVnZXggfSBmcm9tICcuLi91dGlscy9mbG9hdC1yZWdleC5tanMnO1xuaW1wb3J0IHsgc2FuaXRpemUgfSBmcm9tICcuLi91dGlscy9zYW5pdGl6ZS5tanMnO1xuXG5mdW5jdGlvbiB0ZXN0KHYpIHtcbiAgICByZXR1cm4gKGlzTmFOKHYpICYmXG4gICAgICAgIHR5cGVvZiB2ID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICh2Lm1hdGNoKGZsb2F0UmVnZXgpPy5sZW5ndGggfHwgMCkgK1xuICAgICAgICAgICAgKHYubWF0Y2goY29sb3JSZWdleCk/Lmxlbmd0aCB8fCAwKSA+XG4gICAgICAgICAgICAwKTtcbn1cbmNvbnN0IE5VTUJFUl9UT0tFTiA9IFwibnVtYmVyXCI7XG5jb25zdCBDT0xPUl9UT0tFTiA9IFwiY29sb3JcIjtcbmNvbnN0IFZBUl9UT0tFTiA9IFwidmFyXCI7XG5jb25zdCBWQVJfRlVOQ1RJT05fVE9LRU4gPSBcInZhcihcIjtcbmNvbnN0IFNQTElUX1RPS0VOID0gXCIke31cIjtcbi8vIHRoaXMgcmVnZXggY29uc2lzdHMgb2YgdGhlIGBzaW5nbGVDc3NWYXJpYWJsZVJlZ2V4fHJnYkhTTFZhbHVlUmVnZXh8ZGlnaXRSZWdleGBcbmNvbnN0IGNvbXBsZXhSZWdleCA9IC92YXJcXHMqXFwoXFxzKi0tKD86W1xcdy1dK1xccyp8W1xcdy1dK1xccyosKD86XFxzKlteKShcXHNdfFxccypcXCgoPzpbXikoXXxcXChbXikoXSpcXCkpKlxcKSkrXFxzKilcXCl8I1tcXGRhLWZdezMsOH18KD86cmdifGhzbClhP1xcKCg/Oi0/W1xcZC5dKyU/WyxcXHNdKyl7Mn0tP1tcXGQuXSslP1xccyooPzpbLC9dXFxzKik/KD86XFxiXFxkKyg/OlxcLlxcZCspP3xcXC5cXGQrKT8lP1xcKXwtPyg/OlxcZCsoPzpcXC5cXGQrKT98XFwuXFxkKykvZ2l1O1xuZnVuY3Rpb24gYW5hbHlzZUNvbXBsZXhWYWx1ZSh2YWx1ZSkge1xuICAgIGNvbnN0IG9yaWdpbmFsVmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xuICAgIGNvbnN0IHZhbHVlcyA9IFtdO1xuICAgIGNvbnN0IGluZGV4ZXMgPSB7XG4gICAgICAgIGNvbG9yOiBbXSxcbiAgICAgICAgbnVtYmVyOiBbXSxcbiAgICAgICAgdmFyOiBbXSxcbiAgICB9O1xuICAgIGNvbnN0IHR5cGVzID0gW107XG4gICAgbGV0IGkgPSAwO1xuICAgIGNvbnN0IHRva2VuaXNlZCA9IG9yaWdpbmFsVmFsdWUucmVwbGFjZShjb21wbGV4UmVnZXgsIChwYXJzZWRWYWx1ZSkgPT4ge1xuICAgICAgICBpZiAoY29sb3IudGVzdChwYXJzZWRWYWx1ZSkpIHtcbiAgICAgICAgICAgIGluZGV4ZXMuY29sb3IucHVzaChpKTtcbiAgICAgICAgICAgIHR5cGVzLnB1c2goQ09MT1JfVE9LRU4pO1xuICAgICAgICAgICAgdmFsdWVzLnB1c2goY29sb3IucGFyc2UocGFyc2VkVmFsdWUpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwYXJzZWRWYWx1ZS5zdGFydHNXaXRoKFZBUl9GVU5DVElPTl9UT0tFTikpIHtcbiAgICAgICAgICAgIGluZGV4ZXMudmFyLnB1c2goaSk7XG4gICAgICAgICAgICB0eXBlcy5wdXNoKFZBUl9UT0tFTik7XG4gICAgICAgICAgICB2YWx1ZXMucHVzaChwYXJzZWRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpbmRleGVzLm51bWJlci5wdXNoKGkpO1xuICAgICAgICAgICAgdHlwZXMucHVzaChOVU1CRVJfVE9LRU4pO1xuICAgICAgICAgICAgdmFsdWVzLnB1c2gocGFyc2VGbG9hdChwYXJzZWRWYWx1ZSkpO1xuICAgICAgICB9XG4gICAgICAgICsraTtcbiAgICAgICAgcmV0dXJuIFNQTElUX1RPS0VOO1xuICAgIH0pO1xuICAgIGNvbnN0IHNwbGl0ID0gdG9rZW5pc2VkLnNwbGl0KFNQTElUX1RPS0VOKTtcbiAgICByZXR1cm4geyB2YWx1ZXMsIHNwbGl0LCBpbmRleGVzLCB0eXBlcyB9O1xufVxuZnVuY3Rpb24gcGFyc2VDb21wbGV4VmFsdWUodikge1xuICAgIHJldHVybiBhbmFseXNlQ29tcGxleFZhbHVlKHYpLnZhbHVlcztcbn1cbmZ1bmN0aW9uIGJ1aWxkVHJhbnNmb3JtZXIoeyBzcGxpdCwgdHlwZXMgfSkge1xuICAgIGNvbnN0IG51bVNlY3Rpb25zID0gc3BsaXQubGVuZ3RoO1xuICAgIHJldHVybiAodikgPT4ge1xuICAgICAgICBsZXQgb3V0cHV0ID0gXCJcIjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1TZWN0aW9uczsgaSsrKSB7XG4gICAgICAgICAgICBvdXRwdXQgKz0gc3BsaXRbaV07XG4gICAgICAgICAgICBpZiAodltpXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IHR5cGVzW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSBOVU1CRVJfVE9LRU4pIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IHNhbml0aXplKHZbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSBDT0xPUl9UT0tFTikge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gY29sb3IudHJhbnNmb3JtKHZbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IHZbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVRyYW5zZm9ybWVyKHNvdXJjZSkge1xuICAgIHJldHVybiBidWlsZFRyYW5zZm9ybWVyKGFuYWx5c2VDb21wbGV4VmFsdWUoc291cmNlKSk7XG59XG5jb25zdCBjb252ZXJ0TnVtYmVyc1RvWmVybyA9ICh2KSA9PiB0eXBlb2YgdiA9PT0gXCJudW1iZXJcIiA/IDAgOiBjb2xvci50ZXN0KHYpID8gY29sb3IuZ2V0QW5pbWF0YWJsZU5vbmUodikgOiB2O1xuLyoqXG4gKiBDb252ZXJ0IGEgcGFyc2VkIHZhbHVlIHRvIGl0cyB6ZXJvIGVxdWl2YWxlbnQsIGJ1dCBwcmVzZXJ2ZSBudW1iZXJzXG4gKiB0aGF0IGFjdCBhcyBkaXZpc29ycyBpbiBDU1MgY2FsYygpIGV4cHJlc3Npb25zLlxuICpcbiAqIGFuYWx5c2VDb21wbGV4VmFsdWUgZXh0cmFjdHMgbnVtYmVycyBmcm9tIENTUyBzdHJpbmdzIGFuZCBwdXRzIHRoZVxuICogc3Vycm91bmRpbmcgdGV4dCBpbnRvIGEgYHNwbGl0YCB0ZW1wbGF0ZSBhcnJheS4gRm9yIGV4YW1wbGU6XG4gKiAgIFwiY2FsYyh2YXIoLS1nYXApIC8gNSlcIiAg4oaSICB2YWx1ZXM6IFt2YXIoLS1nYXApLCA1XVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3BsaXQ6ICBbXCJjYWxjKFwiLCBcIiAvIFwiLCBcIilcIl1cbiAqXG4gKiBXaGVuIGJ1aWxkaW5nIGEgemVyby1lcXVpdmFsZW50IGZvciBhbmltYXRpb24sIG5haXZlbHkgemVyb2luZyBhbGxcbiAqIG51bWJlcnMgdHVybnMgdGhlIGRpdmlzb3IgaW50byAwIOKGkiBcImNhbGModmFyKC0tZ2FwKSAvIDApXCIg4oaSIE5hTi5cbiAqIFdlIGRldGVjdCB0aGlzIGJ5IGNoZWNraW5nIHdoZXRoZXIgdGhlIHRleHQgcHJlY2VkaW5nIGEgbnVtYmVyXG4gKiAoc3BsaXRbaV0pIGVuZHMgd2l0aCBcIi9cIiDigJQgdGhlIENTUyBjYWxjIGRpdmlzaW9uIG9wZXJhdG9yLlxuICovXG5jb25zdCBjb252ZXJ0VG9aZXJvID0gKHZhbHVlLCBzcGxpdEJlZm9yZSkgPT4ge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgcmV0dXJuIHNwbGl0QmVmb3JlPy50cmltKCkuZW5kc1dpdGgoXCIvXCIpID8gdmFsdWUgOiAwO1xuICAgIH1cbiAgICByZXR1cm4gY29udmVydE51bWJlcnNUb1plcm8odmFsdWUpO1xufTtcbmZ1bmN0aW9uIGdldEFuaW1hdGFibGVOb25lKHYpIHtcbiAgICBjb25zdCBpbmZvID0gYW5hbHlzZUNvbXBsZXhWYWx1ZSh2KTtcbiAgICBjb25zdCB0cmFuc2Zvcm1lciA9IGJ1aWxkVHJhbnNmb3JtZXIoaW5mbyk7XG4gICAgcmV0dXJuIHRyYW5zZm9ybWVyKGluZm8udmFsdWVzLm1hcCgodmFsdWUsIGkpID0+IGNvbnZlcnRUb1plcm8odmFsdWUsIGluZm8uc3BsaXRbaV0pKSk7XG59XG5jb25zdCBjb21wbGV4ID0ge1xuICAgIHRlc3QsXG4gICAgcGFyc2U6IHBhcnNlQ29tcGxleFZhbHVlLFxuICAgIGNyZWF0ZVRyYW5zZm9ybWVyLFxuICAgIGdldEFuaW1hdGFibGVOb25lLFxufTtcblxuZXhwb3J0IHsgYW5hbHlzZUNvbXBsZXhWYWx1ZSwgY29tcGxleCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXgubWpzLm1hcFxuIiwiLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL21qYWNrc29uLzUzMTEyNTZcbmZ1bmN0aW9uIGh1ZVRvUmdiKHAsIHEsIHQpIHtcbiAgICBpZiAodCA8IDApXG4gICAgICAgIHQgKz0gMTtcbiAgICBpZiAodCA+IDEpXG4gICAgICAgIHQgLT0gMTtcbiAgICBpZiAodCA8IDEgLyA2KVxuICAgICAgICByZXR1cm4gcCArIChxIC0gcCkgKiA2ICogdDtcbiAgICBpZiAodCA8IDEgLyAyKVxuICAgICAgICByZXR1cm4gcTtcbiAgICBpZiAodCA8IDIgLyAzKVxuICAgICAgICByZXR1cm4gcCArIChxIC0gcCkgKiAoMiAvIDMgLSB0KSAqIDY7XG4gICAgcmV0dXJuIHA7XG59XG5mdW5jdGlvbiBoc2xhVG9SZ2JhKHsgaHVlLCBzYXR1cmF0aW9uLCBsaWdodG5lc3MsIGFscGhhIH0pIHtcbiAgICBodWUgLz0gMzYwO1xuICAgIHNhdHVyYXRpb24gLz0gMTAwO1xuICAgIGxpZ2h0bmVzcyAvPSAxMDA7XG4gICAgbGV0IHJlZCA9IDA7XG4gICAgbGV0IGdyZWVuID0gMDtcbiAgICBsZXQgYmx1ZSA9IDA7XG4gICAgaWYgKCFzYXR1cmF0aW9uKSB7XG4gICAgICAgIHJlZCA9IGdyZWVuID0gYmx1ZSA9IGxpZ2h0bmVzcztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IHEgPSBsaWdodG5lc3MgPCAwLjVcbiAgICAgICAgICAgID8gbGlnaHRuZXNzICogKDEgKyBzYXR1cmF0aW9uKVxuICAgICAgICAgICAgOiBsaWdodG5lc3MgKyBzYXR1cmF0aW9uIC0gbGlnaHRuZXNzICogc2F0dXJhdGlvbjtcbiAgICAgICAgY29uc3QgcCA9IDIgKiBsaWdodG5lc3MgLSBxO1xuICAgICAgICByZWQgPSBodWVUb1JnYihwLCBxLCBodWUgKyAxIC8gMyk7XG4gICAgICAgIGdyZWVuID0gaHVlVG9SZ2IocCwgcSwgaHVlKTtcbiAgICAgICAgYmx1ZSA9IGh1ZVRvUmdiKHAsIHEsIGh1ZSAtIDEgLyAzKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVkOiBNYXRoLnJvdW5kKHJlZCAqIDI1NSksXG4gICAgICAgIGdyZWVuOiBNYXRoLnJvdW5kKGdyZWVuICogMjU1KSxcbiAgICAgICAgYmx1ZTogTWF0aC5yb3VuZChibHVlICogMjU1KSxcbiAgICAgICAgYWxwaGEsXG4gICAgfTtcbn1cblxuZXhwb3J0IHsgaHNsYVRvUmdiYSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aHNsYS10by1yZ2JhLm1qcy5tYXBcbiIsImZ1bmN0aW9uIG1peEltbWVkaWF0ZShhLCBiKSB7XG4gICAgcmV0dXJuIChwKSA9PiAocCA+IDAgPyBiIDogYSk7XG59XG5cbmV4cG9ydCB7IG1peEltbWVkaWF0ZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW1tZWRpYXRlLm1qcy5tYXBcbiIsIi8qXG4gIFZhbHVlIGluIHJhbmdlIGZyb20gcHJvZ3Jlc3NcblxuICBHaXZlbiBhIGxvd2VyIGxpbWl0IGFuZCBhbiB1cHBlciBsaW1pdCwgd2UgcmV0dXJuIHRoZSB2YWx1ZSB3aXRoaW5cbiAgdGhhdCByYW5nZSBhcyBleHByZXNzZWQgYnkgcHJvZ3Jlc3MgKHVzdWFsbHkgYSBudW1iZXIgZnJvbSAwIHRvIDEpXG5cbiAgU28gcHJvZ3Jlc3MgPSAwLjUgd291bGQgY2hhbmdlXG5cbiAgZnJvbSAtLS0tLS0tLSB0b1xuXG4gIHRvXG5cbiAgZnJvbSAtLS0tIHRvXG5cbiAgRS5nLiBmcm9tID0gMTAsIHRvID0gMjAsIHByb2dyZXNzID0gMC41ID0+IDE1XG5cbiAgQHBhcmFtIFtudW1iZXJdOiBMb3dlciBsaW1pdCBvZiByYW5nZVxuICBAcGFyYW0gW251bWJlcl06IFVwcGVyIGxpbWl0IG9mIHJhbmdlXG4gIEBwYXJhbSBbbnVtYmVyXTogVGhlIHByb2dyZXNzIGJldHdlZW4gbG93ZXIgYW5kIHVwcGVyIGxpbWl0cyBleHByZXNzZWQgMC0xXG4gIEByZXR1cm4gW251bWJlcl06IFZhbHVlIGFzIGNhbGN1bGF0ZWQgZnJvbSBwcm9ncmVzcyB3aXRoaW4gcmFuZ2UgKG5vdCBsaW1pdGVkIHdpdGhpbiByYW5nZSlcbiovXG5jb25zdCBtaXhOdW1iZXIgPSAoZnJvbSwgdG8sIHByb2dyZXNzKSA9PiB7XG4gICAgcmV0dXJuIGZyb20gKyAodG8gLSBmcm9tKSAqIHByb2dyZXNzO1xufTtcblxuZXhwb3J0IHsgbWl4TnVtYmVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1udW1iZXIubWpzLm1hcFxuIiwiaW1wb3J0IHsgd2FybmluZyB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBoZXggfSBmcm9tICcuLi8uLi92YWx1ZS90eXBlcy9jb2xvci9oZXgubWpzJztcbmltcG9ydCB7IGhzbGEgfSBmcm9tICcuLi8uLi92YWx1ZS90eXBlcy9jb2xvci9oc2xhLm1qcyc7XG5pbXBvcnQgeyBoc2xhVG9SZ2JhIH0gZnJvbSAnLi4vLi4vdmFsdWUvdHlwZXMvY29sb3IvaHNsYS10by1yZ2JhLm1qcyc7XG5pbXBvcnQgeyByZ2JhIH0gZnJvbSAnLi4vLi4vdmFsdWUvdHlwZXMvY29sb3IvcmdiYS5tanMnO1xuaW1wb3J0IHsgbWl4SW1tZWRpYXRlIH0gZnJvbSAnLi9pbW1lZGlhdGUubWpzJztcbmltcG9ydCB7IG1peE51bWJlciB9IGZyb20gJy4vbnVtYmVyLm1qcyc7XG5cbi8vIExpbmVhciBjb2xvciBzcGFjZSBibGVuZGluZ1xuLy8gRXhwbGFpbmVkIGh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9TEtucUVDY2c2R3dcbi8vIERlbW9uc3RyYXRlZCBodHRwOi8vY29kZXBlbi5pby9vc3VibGFrZS9wZW4veEdWVmFOXG5jb25zdCBtaXhMaW5lYXJDb2xvciA9IChmcm9tLCB0bywgdikgPT4ge1xuICAgIGNvbnN0IGZyb21FeHBvID0gZnJvbSAqIGZyb207XG4gICAgY29uc3QgZXhwbyA9IHYgKiAodG8gKiB0byAtIGZyb21FeHBvKSArIGZyb21FeHBvO1xuICAgIHJldHVybiBleHBvIDwgMCA/IDAgOiBNYXRoLnNxcnQoZXhwbyk7XG59O1xuY29uc3QgY29sb3JUeXBlcyA9IFtoZXgsIHJnYmEsIGhzbGFdO1xuY29uc3QgZ2V0Q29sb3JUeXBlID0gKHYpID0+IGNvbG9yVHlwZXMuZmluZCgodHlwZSkgPT4gdHlwZS50ZXN0KHYpKTtcbmZ1bmN0aW9uIGFzUkdCQShjb2xvcikge1xuICAgIGNvbnN0IHR5cGUgPSBnZXRDb2xvclR5cGUoY29sb3IpO1xuICAgIHdhcm5pbmcoQm9vbGVhbih0eXBlKSwgYCcke2NvbG9yfScgaXMgbm90IGFuIGFuaW1hdGFibGUgY29sb3IuIFVzZSB0aGUgZXF1aXZhbGVudCBjb2xvciBjb2RlIGluc3RlYWQuYCwgXCJjb2xvci1ub3QtYW5pbWF0YWJsZVwiKTtcbiAgICBpZiAoIUJvb2xlYW4odHlwZSkpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBsZXQgbW9kZWwgPSB0eXBlLnBhcnNlKGNvbG9yKTtcbiAgICBpZiAodHlwZSA9PT0gaHNsYSkge1xuICAgICAgICAvLyBUT0RPIFJlbW92ZSB0aGlzIGNhc3QgLSBuZWVkZWQgc2luY2UgTW90aW9uJ3Mgc3RyaWN0ZXIgdHlwaW5nXG4gICAgICAgIG1vZGVsID0gaHNsYVRvUmdiYShtb2RlbCk7XG4gICAgfVxuICAgIHJldHVybiBtb2RlbDtcbn1cbmNvbnN0IG1peENvbG9yID0gKGZyb20sIHRvKSA9PiB7XG4gICAgY29uc3QgZnJvbVJHQkEgPSBhc1JHQkEoZnJvbSk7XG4gICAgY29uc3QgdG9SR0JBID0gYXNSR0JBKHRvKTtcbiAgICBpZiAoIWZyb21SR0JBIHx8ICF0b1JHQkEpIHtcbiAgICAgICAgcmV0dXJuIG1peEltbWVkaWF0ZShmcm9tLCB0byk7XG4gICAgfVxuICAgIGNvbnN0IGJsZW5kZWQgPSB7IC4uLmZyb21SR0JBIH07XG4gICAgcmV0dXJuICh2KSA9PiB7XG4gICAgICAgIGJsZW5kZWQucmVkID0gbWl4TGluZWFyQ29sb3IoZnJvbVJHQkEucmVkLCB0b1JHQkEucmVkLCB2KTtcbiAgICAgICAgYmxlbmRlZC5ncmVlbiA9IG1peExpbmVhckNvbG9yKGZyb21SR0JBLmdyZWVuLCB0b1JHQkEuZ3JlZW4sIHYpO1xuICAgICAgICBibGVuZGVkLmJsdWUgPSBtaXhMaW5lYXJDb2xvcihmcm9tUkdCQS5ibHVlLCB0b1JHQkEuYmx1ZSwgdik7XG4gICAgICAgIGJsZW5kZWQuYWxwaGEgPSBtaXhOdW1iZXIoZnJvbVJHQkEuYWxwaGEsIHRvUkdCQS5hbHBoYSwgdik7XG4gICAgICAgIHJldHVybiByZ2JhLnRyYW5zZm9ybShibGVuZGVkKTtcbiAgICB9O1xufTtcblxuZXhwb3J0IHsgbWl4Q29sb3IsIG1peExpbmVhckNvbG9yIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb2xvci5tanMubWFwXG4iLCJjb25zdCBpbnZpc2libGVWYWx1ZXMgPSBuZXcgU2V0KFtcIm5vbmVcIiwgXCJoaWRkZW5cIl0pO1xuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBwcm92aWRlZCBhIHByb2dyZXNzIHZhbHVlIGJldHdlZW4gMCBhbmQgMSxcbiAqIHdpbGwgcmV0dXJuIHRoZSBcIm5vbmVcIiBvciBcImhpZGRlblwiIHN0cmluZyBvbmx5IHdoZW4gdGhlIHByb2dyZXNzIGlzIHRoYXQgb2ZcbiAqIHRoZSBvcmlnaW4gb3IgdGFyZ2V0LlxuICovXG5mdW5jdGlvbiBtaXhWaXNpYmlsaXR5KG9yaWdpbiwgdGFyZ2V0KSB7XG4gICAgaWYgKGludmlzaWJsZVZhbHVlcy5oYXMob3JpZ2luKSkge1xuICAgICAgICByZXR1cm4gKHApID0+IChwIDw9IDAgPyBvcmlnaW4gOiB0YXJnZXQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIChwKSA9PiAocCA+PSAxID8gdGFyZ2V0IDogb3JpZ2luKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IGludmlzaWJsZVZhbHVlcywgbWl4VmlzaWJpbGl0eSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dmlzaWJpbGl0eS5tanMubWFwXG4iLCJpbXBvcnQgeyBwaXBlLCB3YXJuaW5nIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcbmltcG9ydCB7IGlzQ1NTVmFyaWFibGVUb2tlbiB9IGZyb20gJy4uLy4uL2FuaW1hdGlvbi91dGlscy9pcy1jc3MtdmFyaWFibGUubWpzJztcbmltcG9ydCB7IGNvbG9yIH0gZnJvbSAnLi4vLi4vdmFsdWUvdHlwZXMvY29sb3IvaW5kZXgubWpzJztcbmltcG9ydCB7IGNvbXBsZXgsIGFuYWx5c2VDb21wbGV4VmFsdWUgfSBmcm9tICcuLi8uLi92YWx1ZS90eXBlcy9jb21wbGV4L2luZGV4Lm1qcyc7XG5pbXBvcnQgeyBtaXhDb2xvciB9IGZyb20gJy4vY29sb3IubWpzJztcbmltcG9ydCB7IG1peEltbWVkaWF0ZSB9IGZyb20gJy4vaW1tZWRpYXRlLm1qcyc7XG5pbXBvcnQgeyBtaXhOdW1iZXIgYXMgbWl4TnVtYmVyJDEgfSBmcm9tICcuL251bWJlci5tanMnO1xuaW1wb3J0IHsgaW52aXNpYmxlVmFsdWVzLCBtaXhWaXNpYmlsaXR5IH0gZnJvbSAnLi92aXNpYmlsaXR5Lm1qcyc7XG5cbmZ1bmN0aW9uIG1peE51bWJlcihhLCBiKSB7XG4gICAgcmV0dXJuIChwKSA9PiBtaXhOdW1iZXIkMShhLCBiLCBwKTtcbn1cbmZ1bmN0aW9uIGdldE1peGVyKGEpIHtcbiAgICBpZiAodHlwZW9mIGEgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgcmV0dXJuIG1peE51bWJlcjtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGEgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIGlzQ1NTVmFyaWFibGVUb2tlbihhKVxuICAgICAgICAgICAgPyBtaXhJbW1lZGlhdGVcbiAgICAgICAgICAgIDogY29sb3IudGVzdChhKVxuICAgICAgICAgICAgICAgID8gbWl4Q29sb3JcbiAgICAgICAgICAgICAgICA6IG1peENvbXBsZXg7XG4gICAgfVxuICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYSkpIHtcbiAgICAgICAgcmV0dXJuIG1peEFycmF5O1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgYSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gY29sb3IudGVzdChhKSA/IG1peENvbG9yIDogbWl4T2JqZWN0O1xuICAgIH1cbiAgICByZXR1cm4gbWl4SW1tZWRpYXRlO1xufVxuZnVuY3Rpb24gbWl4QXJyYXkoYSwgYikge1xuICAgIGNvbnN0IG91dHB1dCA9IFsuLi5hXTtcbiAgICBjb25zdCBudW1WYWx1ZXMgPSBvdXRwdXQubGVuZ3RoO1xuICAgIGNvbnN0IGJsZW5kVmFsdWUgPSBhLm1hcCgodiwgaSkgPT4gZ2V0TWl4ZXIodikodiwgYltpXSkpO1xuICAgIHJldHVybiAocCkgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVZhbHVlczsgaSsrKSB7XG4gICAgICAgICAgICBvdXRwdXRbaV0gPSBibGVuZFZhbHVlW2ldKHApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIG1peE9iamVjdChhLCBiKSB7XG4gICAgY29uc3Qgb3V0cHV0ID0geyAuLi5hLCAuLi5iIH07XG4gICAgY29uc3QgYmxlbmRWYWx1ZSA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IGluIG91dHB1dCkge1xuICAgICAgICBpZiAoYVtrZXldICE9PSB1bmRlZmluZWQgJiYgYltrZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGJsZW5kVmFsdWVba2V5XSA9IGdldE1peGVyKGFba2V5XSkoYVtrZXldLCBiW2tleV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAodikgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBibGVuZFZhbHVlKSB7XG4gICAgICAgICAgICBvdXRwdXRba2V5XSA9IGJsZW5kVmFsdWVba2V5XSh2KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH07XG59XG5mdW5jdGlvbiBtYXRjaE9yZGVyKG9yaWdpbiwgdGFyZ2V0KSB7XG4gICAgY29uc3Qgb3JkZXJlZE9yaWdpbiA9IFtdO1xuICAgIGNvbnN0IHBvaW50ZXJzID0geyBjb2xvcjogMCwgdmFyOiAwLCBudW1iZXI6IDAgfTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhcmdldC52YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IHRhcmdldC50eXBlc1tpXTtcbiAgICAgICAgY29uc3Qgb3JpZ2luSW5kZXggPSBvcmlnaW4uaW5kZXhlc1t0eXBlXVtwb2ludGVyc1t0eXBlXV07XG4gICAgICAgIGNvbnN0IG9yaWdpblZhbHVlID0gb3JpZ2luLnZhbHVlc1tvcmlnaW5JbmRleF0gPz8gMDtcbiAgICAgICAgb3JkZXJlZE9yaWdpbltpXSA9IG9yaWdpblZhbHVlO1xuICAgICAgICBwb2ludGVyc1t0eXBlXSsrO1xuICAgIH1cbiAgICByZXR1cm4gb3JkZXJlZE9yaWdpbjtcbn1cbmNvbnN0IG1peENvbXBsZXggPSAob3JpZ2luLCB0YXJnZXQpID0+IHtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IGNvbXBsZXguY3JlYXRlVHJhbnNmb3JtZXIodGFyZ2V0KTtcbiAgICBjb25zdCBvcmlnaW5TdGF0cyA9IGFuYWx5c2VDb21wbGV4VmFsdWUob3JpZ2luKTtcbiAgICBjb25zdCB0YXJnZXRTdGF0cyA9IGFuYWx5c2VDb21wbGV4VmFsdWUodGFyZ2V0KTtcbiAgICBjb25zdCBjYW5JbnRlcnBvbGF0ZSA9IG9yaWdpblN0YXRzLmluZGV4ZXMudmFyLmxlbmd0aCA9PT0gdGFyZ2V0U3RhdHMuaW5kZXhlcy52YXIubGVuZ3RoICYmXG4gICAgICAgIG9yaWdpblN0YXRzLmluZGV4ZXMuY29sb3IubGVuZ3RoID09PSB0YXJnZXRTdGF0cy5pbmRleGVzLmNvbG9yLmxlbmd0aCAmJlxuICAgICAgICBvcmlnaW5TdGF0cy5pbmRleGVzLm51bWJlci5sZW5ndGggPj0gdGFyZ2V0U3RhdHMuaW5kZXhlcy5udW1iZXIubGVuZ3RoO1xuICAgIGlmIChjYW5JbnRlcnBvbGF0ZSkge1xuICAgICAgICBpZiAoKGludmlzaWJsZVZhbHVlcy5oYXMob3JpZ2luKSAmJlxuICAgICAgICAgICAgIXRhcmdldFN0YXRzLnZhbHVlcy5sZW5ndGgpIHx8XG4gICAgICAgICAgICAoaW52aXNpYmxlVmFsdWVzLmhhcyh0YXJnZXQpICYmXG4gICAgICAgICAgICAgICAgIW9yaWdpblN0YXRzLnZhbHVlcy5sZW5ndGgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbWl4VmlzaWJpbGl0eShvcmlnaW4sIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBpcGUobWl4QXJyYXkobWF0Y2hPcmRlcihvcmlnaW5TdGF0cywgdGFyZ2V0U3RhdHMpLCB0YXJnZXRTdGF0cy52YWx1ZXMpLCB0ZW1wbGF0ZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB3YXJuaW5nKHRydWUsIGBDb21wbGV4IHZhbHVlcyAnJHtvcmlnaW59JyBhbmQgJyR7dGFyZ2V0fScgdG9vIGRpZmZlcmVudCB0byBtaXguIEVuc3VyZSBhbGwgY29sb3JzIGFyZSBvZiB0aGUgc2FtZSB0eXBlLCBhbmQgdGhhdCBlYWNoIGNvbnRhaW5zIHRoZSBzYW1lIHF1YW50aXR5IG9mIG51bWJlciBhbmQgY29sb3IgdmFsdWVzLiBGYWxsaW5nIGJhY2sgdG8gaW5zdGFudCB0cmFuc2l0aW9uLmAsIFwiY29tcGxleC12YWx1ZXMtZGlmZmVyZW50XCIpO1xuICAgICAgICByZXR1cm4gbWl4SW1tZWRpYXRlKG9yaWdpbiwgdGFyZ2V0KTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBnZXRNaXhlciwgbWl4QXJyYXksIG1peENvbXBsZXgsIG1peE9iamVjdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcGxleC5tanMubWFwXG4iLCJpbXBvcnQgeyBnZXRNaXhlciB9IGZyb20gJy4vY29tcGxleC5tanMnO1xuaW1wb3J0IHsgbWl4TnVtYmVyIH0gZnJvbSAnLi9udW1iZXIubWpzJztcblxuZnVuY3Rpb24gbWl4KGZyb20sIHRvLCBwKSB7XG4gICAgaWYgKHR5cGVvZiBmcm9tID09PSBcIm51bWJlclwiICYmXG4gICAgICAgIHR5cGVvZiB0byA9PT0gXCJudW1iZXJcIiAmJlxuICAgICAgICB0eXBlb2YgcCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICByZXR1cm4gbWl4TnVtYmVyKGZyb20sIHRvLCBwKTtcbiAgICB9XG4gICAgY29uc3QgbWl4ZXIgPSBnZXRNaXhlcihmcm9tKTtcbiAgICByZXR1cm4gbWl4ZXIoZnJvbSwgdG8pO1xufVxuXG5leHBvcnQgeyBtaXggfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4Lm1qcy5tYXBcbiIsImltcG9ydCB7IHRpbWUgfSBmcm9tICcuLi8uLi9mcmFtZWxvb3Avc3luYy10aW1lLm1qcyc7XG5pbXBvcnQgeyBmcmFtZURhdGEsIGNhbmNlbEZyYW1lLCBmcmFtZSB9IGZyb20gJy4uLy4uL2ZyYW1lbG9vcC9mcmFtZS5tanMnO1xuXG5jb25zdCBmcmFtZWxvb3BEcml2ZXIgPSAodXBkYXRlKSA9PiB7XG4gICAgY29uc3QgcGFzc1RpbWVzdGFtcCA9ICh7IHRpbWVzdGFtcCB9KSA9PiB1cGRhdGUodGltZXN0YW1wKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdGFydDogKGtlZXBBbGl2ZSA9IHRydWUpID0+IGZyYW1lLnVwZGF0ZShwYXNzVGltZXN0YW1wLCBrZWVwQWxpdmUpLFxuICAgICAgICBzdG9wOiAoKSA9PiBjYW5jZWxGcmFtZShwYXNzVGltZXN0YW1wKSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHdlJ3JlIHByb2Nlc3NpbmcgdGhpcyBmcmFtZSB3ZSBjYW4gdXNlIHRoZVxuICAgICAgICAgKiBmcmFtZWxvY2tlZCB0aW1lc3RhbXAgdG8ga2VlcCB0aGluZ3MgaW4gc3luYy5cbiAgICAgICAgICovXG4gICAgICAgIG5vdzogKCkgPT4gKGZyYW1lRGF0YS5pc1Byb2Nlc3NpbmcgPyBmcmFtZURhdGEudGltZXN0YW1wIDogdGltZS5ub3coKSksXG4gICAgfTtcbn07XG5cbmV4cG9ydCB7IGZyYW1lbG9vcERyaXZlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZnJhbWUubWpzLm1hcFxuIiwiY29uc3QgZ2VuZXJhdGVMaW5lYXJFYXNpbmcgPSAoZWFzaW5nLCBkdXJhdGlvbiwgLy8gYXMgbWlsbGlzZWNvbmRzXG5yZXNvbHV0aW9uID0gMTAgLy8gYXMgbWlsbGlzZWNvbmRzXG4pID0+IHtcbiAgICBsZXQgcG9pbnRzID0gXCJcIjtcbiAgICBjb25zdCBudW1Qb2ludHMgPSBNYXRoLm1heChNYXRoLnJvdW5kKGR1cmF0aW9uIC8gcmVzb2x1dGlvbiksIDIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtUG9pbnRzOyBpKyspIHtcbiAgICAgICAgcG9pbnRzICs9IE1hdGgucm91bmQoZWFzaW5nKGkgLyAobnVtUG9pbnRzIC0gMSkpICogMTAwMDApIC8gMTAwMDAgKyBcIiwgXCI7XG4gICAgfVxuICAgIHJldHVybiBgbGluZWFyKCR7cG9pbnRzLnN1YnN0cmluZygwLCBwb2ludHMubGVuZ3RoIC0gMil9KWA7XG59O1xuXG5leHBvcnQgeyBnZW5lcmF0ZUxpbmVhckVhc2luZyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGluZWFyLm1qcy5tYXBcbiIsIi8qKlxuICogSW1wbGVtZW50IGEgcHJhY3RpY2FsIG1heCBkdXJhdGlvbiBmb3Iga2V5ZnJhbWUgZ2VuZXJhdGlvblxuICogdG8gcHJldmVudCBpbmZpbml0ZSBsb29wc1xuICovXG5jb25zdCBtYXhHZW5lcmF0b3JEdXJhdGlvbiA9IDIwMDAwO1xuZnVuY3Rpb24gY2FsY0dlbmVyYXRvckR1cmF0aW9uKGdlbmVyYXRvcikge1xuICAgIGxldCBkdXJhdGlvbiA9IDA7XG4gICAgY29uc3QgdGltZVN0ZXAgPSA1MDtcbiAgICBsZXQgc3RhdGUgPSBnZW5lcmF0b3IubmV4dChkdXJhdGlvbik7XG4gICAgd2hpbGUgKCFzdGF0ZS5kb25lICYmIGR1cmF0aW9uIDwgbWF4R2VuZXJhdG9yRHVyYXRpb24pIHtcbiAgICAgICAgZHVyYXRpb24gKz0gdGltZVN0ZXA7XG4gICAgICAgIHN0YXRlID0gZ2VuZXJhdG9yLm5leHQoZHVyYXRpb24pO1xuICAgIH1cbiAgICByZXR1cm4gZHVyYXRpb24gPj0gbWF4R2VuZXJhdG9yRHVyYXRpb24gPyBJbmZpbml0eSA6IGR1cmF0aW9uO1xufVxuXG5leHBvcnQgeyBjYWxjR2VuZXJhdG9yRHVyYXRpb24sIG1heEdlbmVyYXRvckR1cmF0aW9uIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jYWxjLWR1cmF0aW9uLm1qcy5tYXBcbiIsImltcG9ydCB7IG1pbGxpc2Vjb25kc1RvU2Vjb25kcyB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBjYWxjR2VuZXJhdG9yRHVyYXRpb24sIG1heEdlbmVyYXRvckR1cmF0aW9uIH0gZnJvbSAnLi9jYWxjLWR1cmF0aW9uLm1qcyc7XG5cbi8qKlxuICogQ3JlYXRlIGEgcHJvZ3Jlc3MgPT4gcHJvZ3Jlc3MgZWFzaW5nIGZ1bmN0aW9uIGZyb20gYSBnZW5lcmF0b3IuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUdlbmVyYXRvckVhc2luZyhvcHRpb25zLCBzY2FsZSA9IDEwMCwgY3JlYXRlR2VuZXJhdG9yKSB7XG4gICAgY29uc3QgZ2VuZXJhdG9yID0gY3JlYXRlR2VuZXJhdG9yKHsgLi4ub3B0aW9ucywga2V5ZnJhbWVzOiBbMCwgc2NhbGVdIH0pO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gTWF0aC5taW4oY2FsY0dlbmVyYXRvckR1cmF0aW9uKGdlbmVyYXRvciksIG1heEdlbmVyYXRvckR1cmF0aW9uKTtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBcImtleWZyYW1lc1wiLFxuICAgICAgICBlYXNlOiAocHJvZ3Jlc3MpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBnZW5lcmF0b3IubmV4dChkdXJhdGlvbiAqIHByb2dyZXNzKS52YWx1ZSAvIHNjYWxlO1xuICAgICAgICB9LFxuICAgICAgICBkdXJhdGlvbjogbWlsbGlzZWNvbmRzVG9TZWNvbmRzKGR1cmF0aW9uKSxcbiAgICB9O1xufVxuXG5leHBvcnQgeyBjcmVhdGVHZW5lcmF0b3JFYXNpbmcgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNyZWF0ZS1nZW5lcmF0b3ItZWFzaW5nLm1qcy5tYXBcbiIsImltcG9ydCB7IG1pbGxpc2Vjb25kc1RvU2Vjb25kcywgY2xhbXAsIHNlY29uZHNUb01pbGxpc2Vjb25kcywgd2FybmluZyB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBnZW5lcmF0ZUxpbmVhckVhc2luZyB9IGZyb20gJy4uL3dhYXBpL3V0aWxzL2xpbmVhci5tanMnO1xuaW1wb3J0IHsgY2FsY0dlbmVyYXRvckR1cmF0aW9uLCBtYXhHZW5lcmF0b3JEdXJhdGlvbiB9IGZyb20gJy4vdXRpbHMvY2FsYy1kdXJhdGlvbi5tanMnO1xuaW1wb3J0IHsgY3JlYXRlR2VuZXJhdG9yRWFzaW5nIH0gZnJvbSAnLi91dGlscy9jcmVhdGUtZ2VuZXJhdG9yLWVhc2luZy5tanMnO1xuXG5jb25zdCBzcHJpbmdEZWZhdWx0cyA9IHtcbiAgICAvLyBEZWZhdWx0IHNwcmluZyBwaHlzaWNzXG4gICAgc3RpZmZuZXNzOiAxMDAsXG4gICAgZGFtcGluZzogMTAsXG4gICAgbWFzczogMS4wLFxuICAgIHZlbG9jaXR5OiAwLjAsXG4gICAgLy8gRGVmYXVsdCBkdXJhdGlvbi9ib3VuY2UtYmFzZWQgb3B0aW9uc1xuICAgIGR1cmF0aW9uOiA4MDAsIC8vIGluIG1zXG4gICAgYm91bmNlOiAwLjMsXG4gICAgdmlzdWFsRHVyYXRpb246IDAuMywgLy8gaW4gc2Vjb25kc1xuICAgIC8vIFJlc3QgdGhyZXNob2xkc1xuICAgIHJlc3RTcGVlZDoge1xuICAgICAgICBncmFudWxhcjogMC4wMSxcbiAgICAgICAgZGVmYXVsdDogMixcbiAgICB9LFxuICAgIHJlc3REZWx0YToge1xuICAgICAgICBncmFudWxhcjogMC4wMDUsXG4gICAgICAgIGRlZmF1bHQ6IDAuNSxcbiAgICB9LFxuICAgIC8vIExpbWl0c1xuICAgIG1pbkR1cmF0aW9uOiAwLjAxLCAvLyBpbiBzZWNvbmRzXG4gICAgbWF4RHVyYXRpb246IDEwLjAsIC8vIGluIHNlY29uZHNcbiAgICBtaW5EYW1waW5nOiAwLjA1LFxuICAgIG1heERhbXBpbmc6IDEsXG59O1xuZnVuY3Rpb24gY2FsY0FuZ3VsYXJGcmVxKHVuZGFtcGVkRnJlcSwgZGFtcGluZ1JhdGlvKSB7XG4gICAgcmV0dXJuIHVuZGFtcGVkRnJlcSAqIE1hdGguc3FydCgxIC0gZGFtcGluZ1JhdGlvICogZGFtcGluZ1JhdGlvKTtcbn1cbmNvbnN0IHJvb3RJdGVyYXRpb25zID0gMTI7XG5mdW5jdGlvbiBhcHByb3hpbWF0ZVJvb3QoZW52ZWxvcGUsIGRlcml2YXRpdmUsIGluaXRpYWxHdWVzcykge1xuICAgIGxldCByZXN1bHQgPSBpbml0aWFsR3Vlc3M7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCByb290SXRlcmF0aW9uczsgaSsrKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdCAtIGVudmVsb3BlKHJlc3VsdCkgLyBkZXJpdmF0aXZlKHJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIFRoaXMgaXMgcG9ydGVkIGZyb20gdGhlIEZyYW1lciBpbXBsZW1lbnRhdGlvbiBvZiBkdXJhdGlvbi1iYXNlZCBzcHJpbmcgcmVzb2x1dGlvbi5cbiAqL1xuY29uc3Qgc2FmZU1pbiA9IDAuMDAxO1xuZnVuY3Rpb24gZmluZFNwcmluZyh7IGR1cmF0aW9uID0gc3ByaW5nRGVmYXVsdHMuZHVyYXRpb24sIGJvdW5jZSA9IHNwcmluZ0RlZmF1bHRzLmJvdW5jZSwgdmVsb2NpdHkgPSBzcHJpbmdEZWZhdWx0cy52ZWxvY2l0eSwgbWFzcyA9IHNwcmluZ0RlZmF1bHRzLm1hc3MsIH0pIHtcbiAgICBsZXQgZW52ZWxvcGU7XG4gICAgbGV0IGRlcml2YXRpdmU7XG4gICAgd2FybmluZyhkdXJhdGlvbiA8PSBzZWNvbmRzVG9NaWxsaXNlY29uZHMoc3ByaW5nRGVmYXVsdHMubWF4RHVyYXRpb24pLCBcIlNwcmluZyBkdXJhdGlvbiBtdXN0IGJlIDEwIHNlY29uZHMgb3IgbGVzc1wiLCBcInNwcmluZy1kdXJhdGlvbi1saW1pdFwiKTtcbiAgICBsZXQgZGFtcGluZ1JhdGlvID0gMSAtIGJvdW5jZTtcbiAgICAvKipcbiAgICAgKiBSZXN0cmljdCBkYW1waW5nUmF0aW8gYW5kIGR1cmF0aW9uIHRvIHdpdGhpbiBhY2NlcHRhYmxlIHJhbmdlcy5cbiAgICAgKi9cbiAgICBkYW1waW5nUmF0aW8gPSBjbGFtcChzcHJpbmdEZWZhdWx0cy5taW5EYW1waW5nLCBzcHJpbmdEZWZhdWx0cy5tYXhEYW1waW5nLCBkYW1waW5nUmF0aW8pO1xuICAgIGR1cmF0aW9uID0gY2xhbXAoc3ByaW5nRGVmYXVsdHMubWluRHVyYXRpb24sIHNwcmluZ0RlZmF1bHRzLm1heER1cmF0aW9uLCBtaWxsaXNlY29uZHNUb1NlY29uZHMoZHVyYXRpb24pKTtcbiAgICBpZiAoZGFtcGluZ1JhdGlvIDwgMSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogVW5kZXJkYW1wZWQgc3ByaW5nXG4gICAgICAgICAqL1xuICAgICAgICBlbnZlbG9wZSA9ICh1bmRhbXBlZEZyZXEpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGV4cG9uZW50aWFsRGVjYXkgPSB1bmRhbXBlZEZyZXEgKiBkYW1waW5nUmF0aW87XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IGV4cG9uZW50aWFsRGVjYXkgKiBkdXJhdGlvbjtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBleHBvbmVudGlhbERlY2F5IC0gdmVsb2NpdHk7XG4gICAgICAgICAgICBjb25zdCBiID0gY2FsY0FuZ3VsYXJGcmVxKHVuZGFtcGVkRnJlcSwgZGFtcGluZ1JhdGlvKTtcbiAgICAgICAgICAgIGNvbnN0IGMgPSBNYXRoLmV4cCgtZGVsdGEpO1xuICAgICAgICAgICAgcmV0dXJuIHNhZmVNaW4gLSAoYSAvIGIpICogYztcbiAgICAgICAgfTtcbiAgICAgICAgZGVyaXZhdGl2ZSA9ICh1bmRhbXBlZEZyZXEpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGV4cG9uZW50aWFsRGVjYXkgPSB1bmRhbXBlZEZyZXEgKiBkYW1waW5nUmF0aW87XG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IGV4cG9uZW50aWFsRGVjYXkgKiBkdXJhdGlvbjtcbiAgICAgICAgICAgIGNvbnN0IGQgPSBkZWx0YSAqIHZlbG9jaXR5ICsgdmVsb2NpdHk7XG4gICAgICAgICAgICBjb25zdCBlID0gTWF0aC5wb3coZGFtcGluZ1JhdGlvLCAyKSAqIE1hdGgucG93KHVuZGFtcGVkRnJlcSwgMikgKiBkdXJhdGlvbjtcbiAgICAgICAgICAgIGNvbnN0IGYgPSBNYXRoLmV4cCgtZGVsdGEpO1xuICAgICAgICAgICAgY29uc3QgZyA9IGNhbGNBbmd1bGFyRnJlcShNYXRoLnBvdyh1bmRhbXBlZEZyZXEsIDIpLCBkYW1waW5nUmF0aW8pO1xuICAgICAgICAgICAgY29uc3QgZmFjdG9yID0gLWVudmVsb3BlKHVuZGFtcGVkRnJlcSkgKyBzYWZlTWluID4gMCA/IC0xIDogMTtcbiAgICAgICAgICAgIHJldHVybiAoZmFjdG9yICogKChkIC0gZSkgKiBmKSkgLyBnO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyaXRpY2FsbHktZGFtcGVkIHNwcmluZ1xuICAgICAgICAgKi9cbiAgICAgICAgZW52ZWxvcGUgPSAodW5kYW1wZWRGcmVxKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhID0gTWF0aC5leHAoLXVuZGFtcGVkRnJlcSAqIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IGIgPSAodW5kYW1wZWRGcmVxIC0gdmVsb2NpdHkpICogZHVyYXRpb24gKyAxO1xuICAgICAgICAgICAgcmV0dXJuIC1zYWZlTWluICsgYSAqIGI7XG4gICAgICAgIH07XG4gICAgICAgIGRlcml2YXRpdmUgPSAodW5kYW1wZWRGcmVxKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhID0gTWF0aC5leHAoLXVuZGFtcGVkRnJlcSAqIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IGIgPSAodmVsb2NpdHkgLSB1bmRhbXBlZEZyZXEpICogKGR1cmF0aW9uICogZHVyYXRpb24pO1xuICAgICAgICAgICAgcmV0dXJuIGEgKiBiO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBjb25zdCBpbml0aWFsR3Vlc3MgPSA1IC8gZHVyYXRpb247XG4gICAgY29uc3QgdW5kYW1wZWRGcmVxID0gYXBwcm94aW1hdGVSb290KGVudmVsb3BlLCBkZXJpdmF0aXZlLCBpbml0aWFsR3Vlc3MpO1xuICAgIGR1cmF0aW9uID0gc2Vjb25kc1RvTWlsbGlzZWNvbmRzKGR1cmF0aW9uKTtcbiAgICBpZiAoaXNOYU4odW5kYW1wZWRGcmVxKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RpZmZuZXNzOiBzcHJpbmdEZWZhdWx0cy5zdGlmZm5lc3MsXG4gICAgICAgICAgICBkYW1waW5nOiBzcHJpbmdEZWZhdWx0cy5kYW1waW5nLFxuICAgICAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBzdGlmZm5lc3MgPSBNYXRoLnBvdyh1bmRhbXBlZEZyZXEsIDIpICogbWFzcztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0aWZmbmVzcyxcbiAgICAgICAgICAgIGRhbXBpbmc6IGRhbXBpbmdSYXRpbyAqIDIgKiBNYXRoLnNxcnQobWFzcyAqIHN0aWZmbmVzcyksXG4gICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgfTtcbiAgICB9XG59XG5jb25zdCBkdXJhdGlvbktleXMgPSBbXCJkdXJhdGlvblwiLCBcImJvdW5jZVwiXTtcbmNvbnN0IHBoeXNpY3NLZXlzID0gW1wic3RpZmZuZXNzXCIsIFwiZGFtcGluZ1wiLCBcIm1hc3NcIl07XG5mdW5jdGlvbiBpc1NwcmluZ1R5cGUob3B0aW9ucywga2V5cykge1xuICAgIHJldHVybiBrZXlzLnNvbWUoKGtleSkgPT4gb3B0aW9uc1trZXldICE9PSB1bmRlZmluZWQpO1xufVxuZnVuY3Rpb24gZ2V0U3ByaW5nT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgbGV0IHNwcmluZ09wdGlvbnMgPSB7XG4gICAgICAgIHZlbG9jaXR5OiBzcHJpbmdEZWZhdWx0cy52ZWxvY2l0eSxcbiAgICAgICAgc3RpZmZuZXNzOiBzcHJpbmdEZWZhdWx0cy5zdGlmZm5lc3MsXG4gICAgICAgIGRhbXBpbmc6IHNwcmluZ0RlZmF1bHRzLmRhbXBpbmcsXG4gICAgICAgIG1hc3M6IHNwcmluZ0RlZmF1bHRzLm1hc3MsXG4gICAgICAgIGlzUmVzb2x2ZWRGcm9tRHVyYXRpb246IGZhbHNlLFxuICAgICAgICAuLi5vcHRpb25zLFxuICAgIH07XG4gICAgLy8gc3RpZmZuZXNzL2RhbXBpbmcvbWFzcyBvdmVycmlkZXMgZHVyYXRpb24vYm91bmNlXG4gICAgaWYgKCFpc1NwcmluZ1R5cGUob3B0aW9ucywgcGh5c2ljc0tleXMpICYmXG4gICAgICAgIGlzU3ByaW5nVHlwZShvcHRpb25zLCBkdXJhdGlvbktleXMpKSB7XG4gICAgICAgIC8vIFRpbWUtZGVmaW5lZCBzcHJpbmdzIHNob3VsZCBpZ25vcmUgaW5oZXJpdGVkIHZlbG9jaXR5LlxuICAgICAgICAvLyBWZWxvY2l0eSBmcm9tIGludGVycnVwdGVkIGFuaW1hdGlvbnMgY2FuIGNhdXNlIGZpbmRTcHJpbmcoKVxuICAgICAgICAvLyB0byBjb21wdXRlIHdpbGRseSBkaWZmZXJlbnQgc3ByaW5nIHBhcmFtZXRlcnMsIGxlYWRpbmcgdG9cbiAgICAgICAgLy8gbWFzc2l2ZSBvc2NpbGxhdGlvbiBvbiBzbWFsbC1yYW5nZSBhbmltYXRpb25zLlxuICAgICAgICBzcHJpbmdPcHRpb25zLnZlbG9jaXR5ID0gMDtcbiAgICAgICAgaWYgKG9wdGlvbnMudmlzdWFsRHVyYXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IHZpc3VhbER1cmF0aW9uID0gb3B0aW9ucy52aXN1YWxEdXJhdGlvbjtcbiAgICAgICAgICAgIGNvbnN0IHJvb3QgPSAoMiAqIE1hdGguUEkpIC8gKHZpc3VhbER1cmF0aW9uICogMS4yKTtcbiAgICAgICAgICAgIGNvbnN0IHN0aWZmbmVzcyA9IHJvb3QgKiByb290O1xuICAgICAgICAgICAgY29uc3QgZGFtcGluZyA9IDIgKlxuICAgICAgICAgICAgICAgIGNsYW1wKDAuMDUsIDEsIDEgLSAob3B0aW9ucy5ib3VuY2UgfHwgMCkpICpcbiAgICAgICAgICAgICAgICBNYXRoLnNxcnQoc3RpZmZuZXNzKTtcbiAgICAgICAgICAgIHNwcmluZ09wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgLi4uc3ByaW5nT3B0aW9ucyxcbiAgICAgICAgICAgICAgICBtYXNzOiBzcHJpbmdEZWZhdWx0cy5tYXNzLFxuICAgICAgICAgICAgICAgIHN0aWZmbmVzcyxcbiAgICAgICAgICAgICAgICBkYW1waW5nLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGRlcml2ZWQgPSBmaW5kU3ByaW5nKHsgLi4ub3B0aW9ucywgdmVsb2NpdHk6IDAgfSk7XG4gICAgICAgICAgICBzcHJpbmdPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIC4uLnNwcmluZ09wdGlvbnMsXG4gICAgICAgICAgICAgICAgLi4uZGVyaXZlZCxcbiAgICAgICAgICAgICAgICBtYXNzOiBzcHJpbmdEZWZhdWx0cy5tYXNzLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHNwcmluZ09wdGlvbnMuaXNSZXNvbHZlZEZyb21EdXJhdGlvbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNwcmluZ09wdGlvbnM7XG59XG5mdW5jdGlvbiBzcHJpbmcob3B0aW9uc09yVmlzdWFsRHVyYXRpb24gPSBzcHJpbmdEZWZhdWx0cy52aXN1YWxEdXJhdGlvbiwgYm91bmNlID0gc3ByaW5nRGVmYXVsdHMuYm91bmNlKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb25zT3JWaXN1YWxEdXJhdGlvbiAhPT0gXCJvYmplY3RcIlxuICAgICAgICA/IHtcbiAgICAgICAgICAgIHZpc3VhbER1cmF0aW9uOiBvcHRpb25zT3JWaXN1YWxEdXJhdGlvbixcbiAgICAgICAgICAgIGtleWZyYW1lczogWzAsIDFdLFxuICAgICAgICAgICAgYm91bmNlLFxuICAgICAgICB9XG4gICAgICAgIDogb3B0aW9uc09yVmlzdWFsRHVyYXRpb247XG4gICAgbGV0IHsgcmVzdFNwZWVkLCByZXN0RGVsdGEgfSA9IG9wdGlvbnM7XG4gICAgY29uc3Qgb3JpZ2luID0gb3B0aW9ucy5rZXlmcmFtZXNbMF07XG4gICAgY29uc3QgdGFyZ2V0ID0gb3B0aW9ucy5rZXlmcmFtZXNbb3B0aW9ucy5rZXlmcmFtZXMubGVuZ3RoIC0gMV07XG4gICAgLyoqXG4gICAgICogVGhpcyBpcyB0aGUgSXRlcmF0b3Itc3BlYyByZXR1cm4gdmFsdWUuIFdlIGVuc3VyZSBpdCdzIG11dGFibGUgcmF0aGVyIHRoYW4gdXNpbmcgYSBnZW5lcmF0b3JcbiAgICAgKiB0byByZWR1Y2UgR0MgZHVyaW5nIGFuaW1hdGlvbi5cbiAgICAgKi9cbiAgICBjb25zdCBzdGF0ZSA9IHsgZG9uZTogZmFsc2UsIHZhbHVlOiBvcmlnaW4gfTtcbiAgICBjb25zdCB7IHN0aWZmbmVzcywgZGFtcGluZywgbWFzcywgZHVyYXRpb24sIHZlbG9jaXR5LCBpc1Jlc29sdmVkRnJvbUR1cmF0aW9uLCB9ID0gZ2V0U3ByaW5nT3B0aW9ucyh7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIHZlbG9jaXR5OiAtbWlsbGlzZWNvbmRzVG9TZWNvbmRzKG9wdGlvbnMudmVsb2NpdHkgfHwgMCksXG4gICAgfSk7XG4gICAgY29uc3QgaW5pdGlhbFZlbG9jaXR5ID0gdmVsb2NpdHkgfHwgMC4wO1xuICAgIGNvbnN0IGRhbXBpbmdSYXRpbyA9IGRhbXBpbmcgLyAoMiAqIE1hdGguc3FydChzdGlmZm5lc3MgKiBtYXNzKSk7XG4gICAgY29uc3QgaW5pdGlhbERlbHRhID0gdGFyZ2V0IC0gb3JpZ2luO1xuICAgIGNvbnN0IHVuZGFtcGVkQW5ndWxhckZyZXEgPSBtaWxsaXNlY29uZHNUb1NlY29uZHMoTWF0aC5zcXJ0KHN0aWZmbmVzcyAvIG1hc3MpKTtcbiAgICAvKipcbiAgICAgKiBJZiB3ZSdyZSB3b3JraW5nIG9uIGEgZ3JhbnVsYXIgc2NhbGUsIHVzZSBzbWFsbGVyIGRlZmF1bHRzIGZvciBkZXRlcm1pbmluZ1xuICAgICAqIHdoZW4gdGhlIHNwcmluZyBpcyBmaW5pc2hlZC5cbiAgICAgKlxuICAgICAqIFRoZXNlIGRlZmF1bHRzIGhhdmUgYmVlbiBzZWxlY3RlZCBlbXByaWNhbGx5IGJhc2VkIG9uIHdoYXQgc3RyaWtlcyBhIGdvb2RcbiAgICAgKiByYXRpbyBiZXR3ZWVuIGZlZWxpbmcgZ29vZCBhbmQgZmluaXNoaW5nIGFzIHNvb24gYXMgY2hhbmdlcyBhcmUgaW1wZXJjZXB0aWJsZS5cbiAgICAgKi9cbiAgICBjb25zdCBpc0dyYW51bGFyU2NhbGUgPSBNYXRoLmFicyhpbml0aWFsRGVsdGEpIDwgNTtcbiAgICByZXN0U3BlZWQgfHwgKHJlc3RTcGVlZCA9IGlzR3JhbnVsYXJTY2FsZVxuICAgICAgICA/IHNwcmluZ0RlZmF1bHRzLnJlc3RTcGVlZC5ncmFudWxhclxuICAgICAgICA6IHNwcmluZ0RlZmF1bHRzLnJlc3RTcGVlZC5kZWZhdWx0KTtcbiAgICByZXN0RGVsdGEgfHwgKHJlc3REZWx0YSA9IGlzR3JhbnVsYXJTY2FsZVxuICAgICAgICA/IHNwcmluZ0RlZmF1bHRzLnJlc3REZWx0YS5ncmFudWxhclxuICAgICAgICA6IHNwcmluZ0RlZmF1bHRzLnJlc3REZWx0YS5kZWZhdWx0KTtcbiAgICBsZXQgcmVzb2x2ZVNwcmluZztcbiAgICBsZXQgcmVzb2x2ZVZlbG9jaXR5O1xuICAgIC8vIFVuZGVyZGFtcGVkIGNvZWZmaWNpZW50cywgaG9pc3RlZCBmb3IgdXNlIGluIHRoZSBpbmxpbmVkIG5leHQoKSBob3QgcGF0aFxuICAgIGxldCBhbmd1bGFyRnJlcTtcbiAgICBsZXQgQTtcbiAgICBsZXQgc2luQ29lZmY7XG4gICAgbGV0IGNvc0NvZWZmO1xuICAgIGlmIChkYW1waW5nUmF0aW8gPCAxKSB7XG4gICAgICAgIGFuZ3VsYXJGcmVxID0gY2FsY0FuZ3VsYXJGcmVxKHVuZGFtcGVkQW5ndWxhckZyZXEsIGRhbXBpbmdSYXRpbyk7XG4gICAgICAgIEEgPVxuICAgICAgICAgICAgKGluaXRpYWxWZWxvY2l0eSArXG4gICAgICAgICAgICAgICAgZGFtcGluZ1JhdGlvICogdW5kYW1wZWRBbmd1bGFyRnJlcSAqIGluaXRpYWxEZWx0YSkgL1xuICAgICAgICAgICAgICAgIGFuZ3VsYXJGcmVxO1xuICAgICAgICAvLyBVbmRlcmRhbXBlZCBzcHJpbmdcbiAgICAgICAgcmVzb2x2ZVNwcmluZyA9ICh0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbnZlbG9wZSA9IE1hdGguZXhwKC1kYW1waW5nUmF0aW8gKiB1bmRhbXBlZEFuZ3VsYXJGcmVxICogdCk7XG4gICAgICAgICAgICByZXR1cm4gKHRhcmdldCAtXG4gICAgICAgICAgICAgICAgZW52ZWxvcGUgKlxuICAgICAgICAgICAgICAgICAgICAoQSAqIE1hdGguc2luKGFuZ3VsYXJGcmVxICogdCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbERlbHRhICogTWF0aC5jb3MoYW5ndWxhckZyZXEgKiB0KSkpO1xuICAgICAgICB9O1xuICAgICAgICAvLyBBbmFseXRpY2FsIGRlcml2YXRpdmUgb2YgdW5kZXJkYW1wZWQgc3ByaW5nIChweC9tcylcbiAgICAgICAgc2luQ29lZmYgPVxuICAgICAgICAgICAgZGFtcGluZ1JhdGlvICogdW5kYW1wZWRBbmd1bGFyRnJlcSAqIEEgKyBpbml0aWFsRGVsdGEgKiBhbmd1bGFyRnJlcTtcbiAgICAgICAgY29zQ29lZmYgPVxuICAgICAgICAgICAgZGFtcGluZ1JhdGlvICogdW5kYW1wZWRBbmd1bGFyRnJlcSAqIGluaXRpYWxEZWx0YSAtIEEgKiBhbmd1bGFyRnJlcTtcbiAgICAgICAgcmVzb2x2ZVZlbG9jaXR5ID0gKHQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudmVsb3BlID0gTWF0aC5leHAoLWRhbXBpbmdSYXRpbyAqIHVuZGFtcGVkQW5ndWxhckZyZXEgKiB0KTtcbiAgICAgICAgICAgIHJldHVybiBlbnZlbG9wZSAqXG4gICAgICAgICAgICAgICAgKHNpbkNvZWZmICogTWF0aC5zaW4oYW5ndWxhckZyZXEgKiB0KSArXG4gICAgICAgICAgICAgICAgICAgIGNvc0NvZWZmICogTWF0aC5jb3MoYW5ndWxhckZyZXEgKiB0KSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKGRhbXBpbmdSYXRpbyA9PT0gMSkge1xuICAgICAgICAvLyBDcml0aWNhbGx5IGRhbXBlZCBzcHJpbmdcbiAgICAgICAgcmVzb2x2ZVNwcmluZyA9ICh0KSA9PiB0YXJnZXQgLVxuICAgICAgICAgICAgTWF0aC5leHAoLXVuZGFtcGVkQW5ndWxhckZyZXEgKiB0KSAqXG4gICAgICAgICAgICAgICAgKGluaXRpYWxEZWx0YSArXG4gICAgICAgICAgICAgICAgICAgIChpbml0aWFsVmVsb2NpdHkgKyB1bmRhbXBlZEFuZ3VsYXJGcmVxICogaW5pdGlhbERlbHRhKSAqIHQpO1xuICAgICAgICAvLyBBbmFseXRpY2FsIGRlcml2YXRpdmUgb2YgY3JpdGljYWxseSBkYW1wZWQgc3ByaW5nIChweC9tcylcbiAgICAgICAgY29uc3QgQyA9IGluaXRpYWxWZWxvY2l0eSArIHVuZGFtcGVkQW5ndWxhckZyZXEgKiBpbml0aWFsRGVsdGE7XG4gICAgICAgIHJlc29sdmVWZWxvY2l0eSA9ICh0KSA9PiBNYXRoLmV4cCgtdW5kYW1wZWRBbmd1bGFyRnJlcSAqIHQpICpcbiAgICAgICAgICAgICh1bmRhbXBlZEFuZ3VsYXJGcmVxICogQyAqIHQgLSBpbml0aWFsVmVsb2NpdHkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gT3ZlcmRhbXBlZCBzcHJpbmdcbiAgICAgICAgY29uc3QgZGFtcGVkQW5ndWxhckZyZXEgPSB1bmRhbXBlZEFuZ3VsYXJGcmVxICogTWF0aC5zcXJ0KGRhbXBpbmdSYXRpbyAqIGRhbXBpbmdSYXRpbyAtIDEpO1xuICAgICAgICByZXNvbHZlU3ByaW5nID0gKHQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudmVsb3BlID0gTWF0aC5leHAoLWRhbXBpbmdSYXRpbyAqIHVuZGFtcGVkQW5ndWxhckZyZXEgKiB0KTtcbiAgICAgICAgICAgIC8vIFdoZW4gcGVyZm9ybWluZyBzaW5oIG9yIGNvc2ggdmFsdWVzIGNhbiBoaXQgSW5maW5pdHkgc28gd2UgY2FwIHRoZW0gaGVyZVxuICAgICAgICAgICAgY29uc3QgZnJlcUZvclQgPSBNYXRoLm1pbihkYW1wZWRBbmd1bGFyRnJlcSAqIHQsIDMwMCk7XG4gICAgICAgICAgICByZXR1cm4gKHRhcmdldCAtXG4gICAgICAgICAgICAgICAgKGVudmVsb3BlICpcbiAgICAgICAgICAgICAgICAgICAgKChpbml0aWFsVmVsb2NpdHkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgZGFtcGluZ1JhdGlvICogdW5kYW1wZWRBbmd1bGFyRnJlcSAqIGluaXRpYWxEZWx0YSkgKlxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5zaW5oKGZyZXFGb3JUKSArXG4gICAgICAgICAgICAgICAgICAgICAgICBkYW1wZWRBbmd1bGFyRnJlcSAqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbERlbHRhICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmNvc2goZnJlcUZvclQpKSkgL1xuICAgICAgICAgICAgICAgICAgICBkYW1wZWRBbmd1bGFyRnJlcSk7XG4gICAgICAgIH07XG4gICAgICAgIC8vIEFuYWx5dGljYWwgZGVyaXZhdGl2ZSBvZiBvdmVyZGFtcGVkIHNwcmluZyAocHgvbXMpXG4gICAgICAgIGNvbnN0IFAgPSAoaW5pdGlhbFZlbG9jaXR5ICtcbiAgICAgICAgICAgIGRhbXBpbmdSYXRpbyAqIHVuZGFtcGVkQW5ndWxhckZyZXEgKiBpbml0aWFsRGVsdGEpIC9cbiAgICAgICAgICAgIGRhbXBlZEFuZ3VsYXJGcmVxO1xuICAgICAgICBjb25zdCBzaW5oQ29lZmYgPSBkYW1waW5nUmF0aW8gKiB1bmRhbXBlZEFuZ3VsYXJGcmVxICogUCAtIGluaXRpYWxEZWx0YSAqIGRhbXBlZEFuZ3VsYXJGcmVxO1xuICAgICAgICBjb25zdCBjb3NoQ29lZmYgPSBkYW1waW5nUmF0aW8gKiB1bmRhbXBlZEFuZ3VsYXJGcmVxICogaW5pdGlhbERlbHRhIC0gUCAqIGRhbXBlZEFuZ3VsYXJGcmVxO1xuICAgICAgICByZXNvbHZlVmVsb2NpdHkgPSAodCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZW52ZWxvcGUgPSBNYXRoLmV4cCgtZGFtcGluZ1JhdGlvICogdW5kYW1wZWRBbmd1bGFyRnJlcSAqIHQpO1xuICAgICAgICAgICAgY29uc3QgZnJlcUZvclQgPSBNYXRoLm1pbihkYW1wZWRBbmd1bGFyRnJlcSAqIHQsIDMwMCk7XG4gICAgICAgICAgICByZXR1cm4gZW52ZWxvcGUgKlxuICAgICAgICAgICAgICAgIChzaW5oQ29lZmYgKiBNYXRoLnNpbmgoZnJlcUZvclQpICtcbiAgICAgICAgICAgICAgICAgICAgY29zaENvZWZmICogTWF0aC5jb3NoKGZyZXFGb3JUKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGNvbnN0IGdlbmVyYXRvciA9IHtcbiAgICAgICAgY2FsY3VsYXRlZER1cmF0aW9uOiBpc1Jlc29sdmVkRnJvbUR1cmF0aW9uID8gZHVyYXRpb24gfHwgbnVsbCA6IG51bGwsXG4gICAgICAgIHZlbG9jaXR5OiAodCkgPT4gc2Vjb25kc1RvTWlsbGlzZWNvbmRzKHJlc29sdmVWZWxvY2l0eSh0KSksXG4gICAgICAgIG5leHQ6ICh0KSA9PiB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZvciB1bmRlcmRhbXBlZCBwaHlzaWNzIHNwcmluZ3Mgd2UgbmVlZCBib3RoIHBvc2l0aW9uIGFuZFxuICAgICAgICAgICAgICogdmVsb2NpdHkgZWFjaCB0aWNrLiBDb21wdXRlIHNoYXJlZCB0cmlnIHZhbHVlcyBvbmNlIHRvIGF2b2lkXG4gICAgICAgICAgICAgKiBkdXBsaWNhdGUgTWF0aC5leHAvc2luL2NvcyBjYWxscyBvbiB0aGUgaG90IHBhdGguXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICghaXNSZXNvbHZlZEZyb21EdXJhdGlvbiAmJiBkYW1waW5nUmF0aW8gPCAxKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW52ZWxvcGUgPSBNYXRoLmV4cCgtZGFtcGluZ1JhdGlvICogdW5kYW1wZWRBbmd1bGFyRnJlcSAqIHQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKGFuZ3VsYXJGcmVxICogdCk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29zID0gTWF0aC5jb3MoYW5ndWxhckZyZXEgKiB0KTtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50ID0gdGFyZ2V0IC1cbiAgICAgICAgICAgICAgICAgICAgZW52ZWxvcGUgKlxuICAgICAgICAgICAgICAgICAgICAgICAgKEEgKiBzaW4gKyBpbml0aWFsRGVsdGEgKiBjb3MpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRWZWxvY2l0eSA9IHNlY29uZHNUb01pbGxpc2Vjb25kcyhlbnZlbG9wZSAqXG4gICAgICAgICAgICAgICAgICAgIChzaW5Db2VmZiAqIHNpbiArIGNvc0NvZWZmICogY29zKSk7XG4gICAgICAgICAgICAgICAgc3RhdGUuZG9uZSA9XG4gICAgICAgICAgICAgICAgICAgIE1hdGguYWJzKGN1cnJlbnRWZWxvY2l0eSkgPD0gcmVzdFNwZWVkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmFicyh0YXJnZXQgLSBjdXJyZW50KSA8PSByZXN0RGVsdGE7XG4gICAgICAgICAgICAgICAgc3RhdGUudmFsdWUgPSBzdGF0ZS5kb25lID8gdGFyZ2V0IDogY3VycmVudDtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50ID0gcmVzb2x2ZVNwcmluZyh0KTtcbiAgICAgICAgICAgIGlmICghaXNSZXNvbHZlZEZyb21EdXJhdGlvbikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRWZWxvY2l0eSA9IHNlY29uZHNUb01pbGxpc2Vjb25kcyhyZXNvbHZlVmVsb2NpdHkodCkpO1xuICAgICAgICAgICAgICAgIHN0YXRlLmRvbmUgPVxuICAgICAgICAgICAgICAgICAgICBNYXRoLmFicyhjdXJyZW50VmVsb2NpdHkpIDw9IHJlc3RTcGVlZCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5hYnModGFyZ2V0IC0gY3VycmVudCkgPD0gcmVzdERlbHRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuZG9uZSA9IHQgPj0gZHVyYXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGF0ZS52YWx1ZSA9IHN0YXRlLmRvbmUgPyB0YXJnZXQgOiBjdXJyZW50O1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICB9LFxuICAgICAgICB0b1N0cmluZzogKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2FsY3VsYXRlZER1cmF0aW9uID0gTWF0aC5taW4oY2FsY0dlbmVyYXRvckR1cmF0aW9uKGdlbmVyYXRvciksIG1heEdlbmVyYXRvckR1cmF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IGVhc2luZyA9IGdlbmVyYXRlTGluZWFyRWFzaW5nKChwcm9ncmVzcykgPT4gZ2VuZXJhdG9yLm5leHQoY2FsY3VsYXRlZER1cmF0aW9uICogcHJvZ3Jlc3MpLnZhbHVlLCBjYWxjdWxhdGVkRHVyYXRpb24sIDMwKTtcbiAgICAgICAgICAgIHJldHVybiBjYWxjdWxhdGVkRHVyYXRpb24gKyBcIm1zIFwiICsgZWFzaW5nO1xuICAgICAgICB9LFxuICAgICAgICB0b1RyYW5zaXRpb246ICgpID0+IHsgfSxcbiAgICB9O1xuICAgIHJldHVybiBnZW5lcmF0b3I7XG59XG5zcHJpbmcuYXBwbHlUb09wdGlvbnMgPSAob3B0aW9ucykgPT4ge1xuICAgIGNvbnN0IGdlbmVyYXRvck9wdGlvbnMgPSBjcmVhdGVHZW5lcmF0b3JFYXNpbmcob3B0aW9ucywgMTAwLCBzcHJpbmcpO1xuICAgIG9wdGlvbnMuZWFzZSA9IGdlbmVyYXRvck9wdGlvbnMuZWFzZTtcbiAgICBvcHRpb25zLmR1cmF0aW9uID0gc2Vjb25kc1RvTWlsbGlzZWNvbmRzKGdlbmVyYXRvck9wdGlvbnMuZHVyYXRpb24pO1xuICAgIG9wdGlvbnMudHlwZSA9IFwia2V5ZnJhbWVzXCI7XG4gICAgcmV0dXJuIG9wdGlvbnM7XG59O1xuXG5leHBvcnQgeyBzcHJpbmcgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNwcmluZy5tanMubWFwXG4iLCJpbXBvcnQgeyB2ZWxvY2l0eVBlclNlY29uZCB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5cbmNvbnN0IHZlbG9jaXR5U2FtcGxlRHVyYXRpb24gPSA1OyAvLyBtc1xuZnVuY3Rpb24gZ2V0R2VuZXJhdG9yVmVsb2NpdHkocmVzb2x2ZVZhbHVlLCB0LCBjdXJyZW50KSB7XG4gICAgY29uc3QgcHJldlQgPSBNYXRoLm1heCh0IC0gdmVsb2NpdHlTYW1wbGVEdXJhdGlvbiwgMCk7XG4gICAgcmV0dXJuIHZlbG9jaXR5UGVyU2Vjb25kKGN1cnJlbnQgLSByZXNvbHZlVmFsdWUocHJldlQpLCB0IC0gcHJldlQpO1xufVxuXG5leHBvcnQgeyBnZXRHZW5lcmF0b3JWZWxvY2l0eSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dmVsb2NpdHkubWpzLm1hcFxuIiwiaW1wb3J0IHsgc3ByaW5nIH0gZnJvbSAnLi9zcHJpbmcubWpzJztcbmltcG9ydCB7IGdldEdlbmVyYXRvclZlbG9jaXR5IH0gZnJvbSAnLi91dGlscy92ZWxvY2l0eS5tanMnO1xuXG5mdW5jdGlvbiBpbmVydGlhKHsga2V5ZnJhbWVzLCB2ZWxvY2l0eSA9IDAuMCwgcG93ZXIgPSAwLjgsIHRpbWVDb25zdGFudCA9IDMyNSwgYm91bmNlRGFtcGluZyA9IDEwLCBib3VuY2VTdGlmZm5lc3MgPSA1MDAsIG1vZGlmeVRhcmdldCwgbWluLCBtYXgsIHJlc3REZWx0YSA9IDAuNSwgcmVzdFNwZWVkLCB9KSB7XG4gICAgY29uc3Qgb3JpZ2luID0ga2V5ZnJhbWVzWzBdO1xuICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IG9yaWdpbixcbiAgICB9O1xuICAgIGNvbnN0IGlzT3V0T2ZCb3VuZHMgPSAodikgPT4gKG1pbiAhPT0gdW5kZWZpbmVkICYmIHYgPCBtaW4pIHx8IChtYXggIT09IHVuZGVmaW5lZCAmJiB2ID4gbWF4KTtcbiAgICBjb25zdCBuZWFyZXN0Qm91bmRhcnkgPSAodikgPT4ge1xuICAgICAgICBpZiAobWluID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gbWF4O1xuICAgICAgICBpZiAobWF4ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gbWluO1xuICAgICAgICByZXR1cm4gTWF0aC5hYnMobWluIC0gdikgPCBNYXRoLmFicyhtYXggLSB2KSA/IG1pbiA6IG1heDtcbiAgICB9O1xuICAgIGxldCBhbXBsaXR1ZGUgPSBwb3dlciAqIHZlbG9jaXR5O1xuICAgIGNvbnN0IGlkZWFsID0gb3JpZ2luICsgYW1wbGl0dWRlO1xuICAgIGNvbnN0IHRhcmdldCA9IG1vZGlmeVRhcmdldCA9PT0gdW5kZWZpbmVkID8gaWRlYWwgOiBtb2RpZnlUYXJnZXQoaWRlYWwpO1xuICAgIC8qKlxuICAgICAqIElmIHRoZSB0YXJnZXQgaGFzIGNoYW5nZWQgd2UgbmVlZCB0byByZS1jYWxjdWxhdGUgdGhlIGFtcGxpdHVkZSwgb3RoZXJ3aXNlXG4gICAgICogdGhlIGFuaW1hdGlvbiB3aWxsIHN0YXJ0IGZyb20gdGhlIHdyb25nIHBvc2l0aW9uLlxuICAgICAqL1xuICAgIGlmICh0YXJnZXQgIT09IGlkZWFsKVxuICAgICAgICBhbXBsaXR1ZGUgPSB0YXJnZXQgLSBvcmlnaW47XG4gICAgY29uc3QgY2FsY0RlbHRhID0gKHQpID0+IC1hbXBsaXR1ZGUgKiBNYXRoLmV4cCgtdCAvIHRpbWVDb25zdGFudCk7XG4gICAgY29uc3QgY2FsY0xhdGVzdCA9ICh0KSA9PiB0YXJnZXQgKyBjYWxjRGVsdGEodCk7XG4gICAgY29uc3QgYXBwbHlGcmljdGlvbiA9ICh0KSA9PiB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gY2FsY0RlbHRhKHQpO1xuICAgICAgICBjb25zdCBsYXRlc3QgPSBjYWxjTGF0ZXN0KHQpO1xuICAgICAgICBzdGF0ZS5kb25lID0gTWF0aC5hYnMoZGVsdGEpIDw9IHJlc3REZWx0YTtcbiAgICAgICAgc3RhdGUudmFsdWUgPSBzdGF0ZS5kb25lID8gdGFyZ2V0IDogbGF0ZXN0O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSWRlYWxseSB0aGlzIHdvdWxkIHJlc29sdmUgZm9yIHQgaW4gYSBzdGF0ZWxlc3Mgd2F5LCB3ZSBjb3VsZFxuICAgICAqIGRvIHRoYXQgYnkgYWx3YXlzIHByZWNhbGN1bGF0aW5nIHRoZSBhbmltYXRpb24gYnV0IGFzIHdlIGtub3dcbiAgICAgKiB0aGlzIHdpbGwgYmUgZG9uZSBhbnl3YXkgd2UgY2FuIGFzc3VtZSB0aGF0IHNwcmluZyB3aWxsXG4gICAgICogYmUgZGlzY292ZXJlZCBkdXJpbmcgdGhhdC5cbiAgICAgKi9cbiAgICBsZXQgdGltZVJlYWNoZWRCb3VuZGFyeTtcbiAgICBsZXQgc3ByaW5nJDE7XG4gICAgY29uc3QgY2hlY2tDYXRjaEJvdW5kYXJ5ID0gKHQpID0+IHtcbiAgICAgICAgaWYgKCFpc091dE9mQm91bmRzKHN0YXRlLnZhbHVlKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGltZVJlYWNoZWRCb3VuZGFyeSA9IHQ7XG4gICAgICAgIHNwcmluZyQxID0gc3ByaW5nKHtcbiAgICAgICAgICAgIGtleWZyYW1lczogW3N0YXRlLnZhbHVlLCBuZWFyZXN0Qm91bmRhcnkoc3RhdGUudmFsdWUpXSxcbiAgICAgICAgICAgIHZlbG9jaXR5OiBnZXRHZW5lcmF0b3JWZWxvY2l0eShjYWxjTGF0ZXN0LCB0LCBzdGF0ZS52YWx1ZSksIC8vIFRPRE86IFRoaXMgc2hvdWxkIGJlIHBhc3NpbmcgKiAxMDAwXG4gICAgICAgICAgICBkYW1waW5nOiBib3VuY2VEYW1waW5nLFxuICAgICAgICAgICAgc3RpZmZuZXNzOiBib3VuY2VTdGlmZm5lc3MsXG4gICAgICAgICAgICByZXN0RGVsdGEsXG4gICAgICAgICAgICByZXN0U3BlZWQsXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgY2hlY2tDYXRjaEJvdW5kYXJ5KDApO1xuICAgIHJldHVybiB7XG4gICAgICAgIGNhbGN1bGF0ZWREdXJhdGlvbjogbnVsbCxcbiAgICAgICAgbmV4dDogKHQpID0+IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogV2UgbmVlZCB0byByZXNvbHZlIHRoZSBmcmljdGlvbiB0byBmaWd1cmUgb3V0IGlmIHdlIG5lZWQgYVxuICAgICAgICAgICAgICogc3ByaW5nIGJ1dCB3ZSBkb24ndCB3YW50IHRvIGRvIHRoaXMgdHdpY2UgcGVyIGZyYW1lLiBTbyBoZXJlXG4gICAgICAgICAgICAgKiB3ZSBmbGFnIGlmIHdlIHVwZGF0ZWQgZm9yIHRoaXMgZnJhbWUgYW5kIGxhdGVyIGlmIHdlIGRpZFxuICAgICAgICAgICAgICogd2UgY2FuIHNraXAgZG9pbmcgaXQgYWdhaW4uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGxldCBoYXNVcGRhdGVkRnJhbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmICghc3ByaW5nJDEgJiYgdGltZVJlYWNoZWRCb3VuZGFyeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaGFzVXBkYXRlZEZyYW1lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBhcHBseUZyaWN0aW9uKHQpO1xuICAgICAgICAgICAgICAgIGNoZWNrQ2F0Y2hCb3VuZGFyeSh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgd2UgaGF2ZSBhIHNwcmluZyBhbmQgdGhlIHByb3ZpZGVkIHQgaXMgYmV5b25kIHRoZSBtb21lbnQgdGhlIGZyaWN0aW9uXG4gICAgICAgICAgICAgKiBhbmltYXRpb24gY3Jvc3NlZCB0aGUgbWluL21heCBib3VuZGFyeSwgdXNlIHRoZSBzcHJpbmcuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh0aW1lUmVhY2hlZEJvdW5kYXJ5ICE9PSB1bmRlZmluZWQgJiYgdCA+PSB0aW1lUmVhY2hlZEJvdW5kYXJ5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNwcmluZyQxLm5leHQodCAtIHRpbWVSZWFjaGVkQm91bmRhcnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgIWhhc1VwZGF0ZWRGcmFtZSAmJiBhcHBseUZyaWN0aW9uKHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9O1xufVxuXG5leHBvcnQgeyBpbmVydGlhIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmVydGlhLm1qcy5tYXBcbiIsImltcG9ydCB7IGludmFyaWFudCwgY2xhbXAsIE1vdGlvbkdsb2JhbENvbmZpZywgbm9vcCwgcGlwZSwgcHJvZ3Jlc3MgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgbWl4IH0gZnJvbSAnLi9taXgvaW5kZXgubWpzJztcblxuZnVuY3Rpb24gY3JlYXRlTWl4ZXJzKG91dHB1dCwgZWFzZSwgY3VzdG9tTWl4ZXIpIHtcbiAgICBjb25zdCBtaXhlcnMgPSBbXTtcbiAgICBjb25zdCBtaXhlckZhY3RvcnkgPSBjdXN0b21NaXhlciB8fCBNb3Rpb25HbG9iYWxDb25maWcubWl4IHx8IG1peDtcbiAgICBjb25zdCBudW1NaXhlcnMgPSBvdXRwdXQubGVuZ3RoIC0gMTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bU1peGVyczsgaSsrKSB7XG4gICAgICAgIGxldCBtaXhlciA9IG1peGVyRmFjdG9yeShvdXRwdXRbaV0sIG91dHB1dFtpICsgMV0pO1xuICAgICAgICBpZiAoZWFzZSkge1xuICAgICAgICAgICAgY29uc3QgZWFzaW5nRnVuY3Rpb24gPSBBcnJheS5pc0FycmF5KGVhc2UpID8gZWFzZVtpXSB8fCBub29wIDogZWFzZTtcbiAgICAgICAgICAgIG1peGVyID0gcGlwZShlYXNpbmdGdW5jdGlvbiwgbWl4ZXIpO1xuICAgICAgICB9XG4gICAgICAgIG1peGVycy5wdXNoKG1peGVyKTtcbiAgICB9XG4gICAgcmV0dXJuIG1peGVycztcbn1cbi8qKlxuICogQ3JlYXRlIGEgZnVuY3Rpb24gdGhhdCBtYXBzIGZyb20gYSBudW1lcmljYWwgaW5wdXQgYXJyYXkgdG8gYSBnZW5lcmljIG91dHB1dCBhcnJheS5cbiAqXG4gKiBBY2NlcHRzOlxuICogICAtIE51bWJlcnNcbiAqICAgLSBDb2xvcnMgKGhleCwgaHNsLCBoc2xhLCByZ2IsIHJnYmEpXG4gKiAgIC0gQ29tcGxleCAoY29tYmluYXRpb25zIG9mIG9uZSBvciBtb3JlIG51bWJlcnMgb3Igc3RyaW5ncylcbiAqXG4gKiBgYGBqc3hcbiAqIGNvbnN0IG1peENvbG9yID0gaW50ZXJwb2xhdGUoWzAsIDFdLCBbJyNmZmYnLCAnIzAwMCddKVxuICpcbiAqIG1peENvbG9yKDAuNSkgLy8gJ3JnYmEoMTI4LCAxMjgsIDEyOCwgMSknXG4gKiBgYGBcbiAqXG4gKiBUT0RPIFJldmlzaXQgdGhpcyBhcHByb2FjaCBvbmNlIHdlJ3ZlIG1vdmVkIHRvIGRhdGEgbW9kZWxzIGZvciB2YWx1ZXMsXG4gKiBwcm9iYWJseSBub3QgbmVlZGVkIHRvIHByZWdlbmVyYXRlIG1peGVyIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmZ1bmN0aW9uIGludGVycG9sYXRlKGlucHV0LCBvdXRwdXQsIHsgY2xhbXA6IGlzQ2xhbXAgPSB0cnVlLCBlYXNlLCBtaXhlciB9ID0ge30pIHtcbiAgICBjb25zdCBpbnB1dExlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICBpbnZhcmlhbnQoaW5wdXRMZW5ndGggPT09IG91dHB1dC5sZW5ndGgsIFwiQm90aCBpbnB1dCBhbmQgb3V0cHV0IHJhbmdlcyBtdXN0IGJlIHRoZSBzYW1lIGxlbmd0aFwiLCBcInJhbmdlLWxlbmd0aFwiKTtcbiAgICAvKipcbiAgICAgKiBJZiB3ZSdyZSBvbmx5IHByb3ZpZGVkIGEgc2luZ2xlIGlucHV0LCB3ZSBjYW4ganVzdCBtYWtlIGEgZnVuY3Rpb25cbiAgICAgKiB0aGF0IHJldHVybnMgdGhlIG91dHB1dC5cbiAgICAgKi9cbiAgICBpZiAoaW5wdXRMZW5ndGggPT09IDEpXG4gICAgICAgIHJldHVybiAoKSA9PiBvdXRwdXRbMF07XG4gICAgaWYgKGlucHV0TGVuZ3RoID09PSAyICYmIG91dHB1dFswXSA9PT0gb3V0cHV0WzFdKVxuICAgICAgICByZXR1cm4gKCkgPT4gb3V0cHV0WzFdO1xuICAgIGNvbnN0IGlzWmVyb0RlbHRhUmFuZ2UgPSBpbnB1dFswXSA9PT0gaW5wdXRbMV07XG4gICAgLy8gSWYgaW5wdXQgcnVucyBoaWdoZXN0IC0+IGxvd2VzdCwgcmV2ZXJzZSBib3RoIGFycmF5c1xuICAgIGlmIChpbnB1dFswXSA+IGlucHV0W2lucHV0TGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgaW5wdXQgPSBbLi4uaW5wdXRdLnJldmVyc2UoKTtcbiAgICAgICAgb3V0cHV0ID0gWy4uLm91dHB1dF0ucmV2ZXJzZSgpO1xuICAgIH1cbiAgICBjb25zdCBtaXhlcnMgPSBjcmVhdGVNaXhlcnMob3V0cHV0LCBlYXNlLCBtaXhlcik7XG4gICAgY29uc3QgbnVtTWl4ZXJzID0gbWl4ZXJzLmxlbmd0aDtcbiAgICBjb25zdCBpbnRlcnBvbGF0b3IgPSAodikgPT4ge1xuICAgICAgICBpZiAoaXNaZXJvRGVsdGFSYW5nZSAmJiB2IDwgaW5wdXRbMF0pXG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0WzBdO1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGlmIChudW1NaXhlcnMgPiAxKSB7XG4gICAgICAgICAgICBmb3IgKDsgaSA8IGlucHV0Lmxlbmd0aCAtIDI7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh2IDwgaW5wdXRbaSArIDFdKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcm9ncmVzc0luUmFuZ2UgPSBwcm9ncmVzcyhpbnB1dFtpXSwgaW5wdXRbaSArIDFdLCB2KTtcbiAgICAgICAgcmV0dXJuIG1peGVyc1tpXShwcm9ncmVzc0luUmFuZ2UpO1xuICAgIH07XG4gICAgcmV0dXJuIGlzQ2xhbXBcbiAgICAgICAgPyAodikgPT4gaW50ZXJwb2xhdG9yKGNsYW1wKGlucHV0WzBdLCBpbnB1dFtpbnB1dExlbmd0aCAtIDFdLCB2KSlcbiAgICAgICAgOiBpbnRlcnBvbGF0b3I7XG59XG5cbmV4cG9ydCB7IGludGVycG9sYXRlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbnRlcnBvbGF0ZS5tanMubWFwXG4iLCJpbXBvcnQgeyBwcm9ncmVzcyB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBtaXhOdW1iZXIgfSBmcm9tICcuLi8uLi8uLi91dGlscy9taXgvbnVtYmVyLm1qcyc7XG5cbmZ1bmN0aW9uIGZpbGxPZmZzZXQob2Zmc2V0LCByZW1haW5pbmcpIHtcbiAgICBjb25zdCBtaW4gPSBvZmZzZXRbb2Zmc2V0Lmxlbmd0aCAtIDFdO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IHJlbWFpbmluZzsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG9mZnNldFByb2dyZXNzID0gcHJvZ3Jlc3MoMCwgcmVtYWluaW5nLCBpKTtcbiAgICAgICAgb2Zmc2V0LnB1c2gobWl4TnVtYmVyKG1pbiwgMSwgb2Zmc2V0UHJvZ3Jlc3MpKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IGZpbGxPZmZzZXQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbGwubWpzLm1hcFxuIiwiaW1wb3J0IHsgZmlsbE9mZnNldCB9IGZyb20gJy4vZmlsbC5tanMnO1xuXG5mdW5jdGlvbiBkZWZhdWx0T2Zmc2V0KGFycikge1xuICAgIGNvbnN0IG9mZnNldCA9IFswXTtcbiAgICBmaWxsT2Zmc2V0KG9mZnNldCwgYXJyLmxlbmd0aCAtIDEpO1xuICAgIHJldHVybiBvZmZzZXQ7XG59XG5cbmV4cG9ydCB7IGRlZmF1bHRPZmZzZXQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlZmF1bHQubWpzLm1hcFxuIiwiZnVuY3Rpb24gY29udmVydE9mZnNldFRvVGltZXMob2Zmc2V0LCBkdXJhdGlvbikge1xuICAgIHJldHVybiBvZmZzZXQubWFwKChvKSA9PiBvICogZHVyYXRpb24pO1xufVxuXG5leHBvcnQgeyBjb252ZXJ0T2Zmc2V0VG9UaW1lcyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGltZS5tanMubWFwXG4iLCJpbXBvcnQgeyBlYXNlSW5PdXQsIGlzRWFzaW5nQXJyYXksIGVhc2luZ0RlZmluaXRpb25Ub0Z1bmN0aW9uIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcbmltcG9ydCB7IGludGVycG9sYXRlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaW50ZXJwb2xhdGUubWpzJztcbmltcG9ydCB7IGRlZmF1bHRPZmZzZXQgfSBmcm9tICcuLi9rZXlmcmFtZXMvb2Zmc2V0cy9kZWZhdWx0Lm1qcyc7XG5pbXBvcnQgeyBjb252ZXJ0T2Zmc2V0VG9UaW1lcyB9IGZyb20gJy4uL2tleWZyYW1lcy9vZmZzZXRzL3RpbWUubWpzJztcblxuZnVuY3Rpb24gZGVmYXVsdEVhc2luZyh2YWx1ZXMsIGVhc2luZykge1xuICAgIHJldHVybiB2YWx1ZXMubWFwKCgpID0+IGVhc2luZyB8fCBlYXNlSW5PdXQpLnNwbGljZSgwLCB2YWx1ZXMubGVuZ3RoIC0gMSk7XG59XG5mdW5jdGlvbiBrZXlmcmFtZXMoeyBkdXJhdGlvbiA9IDMwMCwga2V5ZnJhbWVzOiBrZXlmcmFtZVZhbHVlcywgdGltZXMsIGVhc2UgPSBcImVhc2VJbk91dFwiLCB9KSB7XG4gICAgLyoqXG4gICAgICogRWFzaW5nIGZ1bmN0aW9ucyBjYW4gYmUgZXh0ZXJuYWxseSBkZWZpbmVkIGFzIHN0cmluZ3MuIEhlcmUgd2UgY29udmVydCB0aGVtXG4gICAgICogaW50byBhY3R1YWwgZnVuY3Rpb25zLlxuICAgICAqL1xuICAgIGNvbnN0IGVhc2luZ0Z1bmN0aW9ucyA9IGlzRWFzaW5nQXJyYXkoZWFzZSlcbiAgICAgICAgPyBlYXNlLm1hcChlYXNpbmdEZWZpbml0aW9uVG9GdW5jdGlvbilcbiAgICAgICAgOiBlYXNpbmdEZWZpbml0aW9uVG9GdW5jdGlvbihlYXNlKTtcbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIHRoZSBJdGVyYXRvci1zcGVjIHJldHVybiB2YWx1ZS4gV2UgZW5zdXJlIGl0J3MgbXV0YWJsZSByYXRoZXIgdGhhbiB1c2luZyBhIGdlbmVyYXRvclxuICAgICAqIHRvIHJlZHVjZSBHQyBkdXJpbmcgYW5pbWF0aW9uLlxuICAgICAqL1xuICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IGtleWZyYW1lVmFsdWVzWzBdLFxuICAgIH07XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgdGltZXMgYXJyYXkgYmFzZWQgb24gdGhlIHByb3ZpZGVkIDAtMSBvZmZzZXRzXG4gICAgICovXG4gICAgY29uc3QgYWJzb2x1dGVUaW1lcyA9IGNvbnZlcnRPZmZzZXRUb1RpbWVzKFxuICAgIC8vIE9ubHkgdXNlIHRoZSBwcm92aWRlZCBvZmZzZXRzIGlmIHRoZXkncmUgdGhlIGNvcnJlY3QgbGVuZ3RoXG4gICAgLy8gVE9ETyBNYXliZSB3ZSBzaG91bGQgd2FybiBoZXJlIGlmIHRoZXJlJ3MgYSBsZW5ndGggbWlzbWF0Y2hcbiAgICB0aW1lcyAmJiB0aW1lcy5sZW5ndGggPT09IGtleWZyYW1lVmFsdWVzLmxlbmd0aFxuICAgICAgICA/IHRpbWVzXG4gICAgICAgIDogZGVmYXVsdE9mZnNldChrZXlmcmFtZVZhbHVlcyksIGR1cmF0aW9uKTtcbiAgICBjb25zdCBtYXBUaW1lVG9LZXlmcmFtZSA9IGludGVycG9sYXRlKGFic29sdXRlVGltZXMsIGtleWZyYW1lVmFsdWVzLCB7XG4gICAgICAgIGVhc2U6IEFycmF5LmlzQXJyYXkoZWFzaW5nRnVuY3Rpb25zKVxuICAgICAgICAgICAgPyBlYXNpbmdGdW5jdGlvbnNcbiAgICAgICAgICAgIDogZGVmYXVsdEVhc2luZyhrZXlmcmFtZVZhbHVlcywgZWFzaW5nRnVuY3Rpb25zKSxcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBjYWxjdWxhdGVkRHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICBuZXh0OiAodCkgPT4ge1xuICAgICAgICAgICAgc3RhdGUudmFsdWUgPSBtYXBUaW1lVG9LZXlmcmFtZSh0KTtcbiAgICAgICAgICAgIHN0YXRlLmRvbmUgPSB0ID49IGR1cmF0aW9uO1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgICB9LFxuICAgIH07XG59XG5cbmV4cG9ydCB7IGRlZmF1bHRFYXNpbmcsIGtleWZyYW1lcyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9a2V5ZnJhbWVzLm1qcy5tYXBcbiIsImNvbnN0IGlzTm90TnVsbCA9ICh2YWx1ZSkgPT4gdmFsdWUgIT09IG51bGw7XG5mdW5jdGlvbiBnZXRGaW5hbEtleWZyYW1lKGtleWZyYW1lcywgeyByZXBlYXQsIHJlcGVhdFR5cGUgPSBcImxvb3BcIiB9LCBmaW5hbEtleWZyYW1lLCBzcGVlZCA9IDEpIHtcbiAgICBjb25zdCByZXNvbHZlZEtleWZyYW1lcyA9IGtleWZyYW1lcy5maWx0ZXIoaXNOb3ROdWxsKTtcbiAgICBjb25zdCB1c2VGaXJzdEtleWZyYW1lID0gc3BlZWQgPCAwIHx8IChyZXBlYXQgJiYgcmVwZWF0VHlwZSAhPT0gXCJsb29wXCIgJiYgcmVwZWF0ICUgMiA9PT0gMSk7XG4gICAgY29uc3QgaW5kZXggPSB1c2VGaXJzdEtleWZyYW1lID8gMCA6IHJlc29sdmVkS2V5ZnJhbWVzLmxlbmd0aCAtIDE7XG4gICAgcmV0dXJuICFpbmRleCB8fCBmaW5hbEtleWZyYW1lID09PSB1bmRlZmluZWRcbiAgICAgICAgPyByZXNvbHZlZEtleWZyYW1lc1tpbmRleF1cbiAgICAgICAgOiBmaW5hbEtleWZyYW1lO1xufVxuXG5leHBvcnQgeyBnZXRGaW5hbEtleWZyYW1lIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1nZXQtZmluYWwubWpzLm1hcFxuIiwiaW1wb3J0IHsgaW5lcnRpYSB9IGZyb20gJy4uL2dlbmVyYXRvcnMvaW5lcnRpYS5tanMnO1xuaW1wb3J0IHsga2V5ZnJhbWVzIH0gZnJvbSAnLi4vZ2VuZXJhdG9ycy9rZXlmcmFtZXMubWpzJztcbmltcG9ydCB7IHNwcmluZyB9IGZyb20gJy4uL2dlbmVyYXRvcnMvc3ByaW5nLm1qcyc7XG5cbmNvbnN0IHRyYW5zaXRpb25UeXBlTWFwID0ge1xuICAgIGRlY2F5OiBpbmVydGlhLFxuICAgIGluZXJ0aWEsXG4gICAgdHdlZW46IGtleWZyYW1lcyxcbiAgICBrZXlmcmFtZXM6IGtleWZyYW1lcyxcbiAgICBzcHJpbmcsXG59O1xuZnVuY3Rpb24gcmVwbGFjZVRyYW5zaXRpb25UeXBlKHRyYW5zaXRpb24pIHtcbiAgICBpZiAodHlwZW9mIHRyYW5zaXRpb24udHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0cmFuc2l0aW9uLnR5cGUgPSB0cmFuc2l0aW9uVHlwZU1hcFt0cmFuc2l0aW9uLnR5cGVdO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgcmVwbGFjZVRyYW5zaXRpb25UeXBlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZXBsYWNlLXRyYW5zaXRpb24tdHlwZS5tanMubWFwXG4iLCJjbGFzcyBXaXRoUHJvbWlzZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlRmluaXNoZWQoKTtcbiAgICB9XG4gICAgZ2V0IGZpbmlzaGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmluaXNoZWQ7XG4gICAgfVxuICAgIHVwZGF0ZUZpbmlzaGVkKCkge1xuICAgICAgICB0aGlzLl9maW5pc2hlZCA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgbm90aWZ5RmluaXNoZWQoKSB7XG4gICAgICAgIHRoaXMucmVzb2x2ZSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBbGxvd3MgdGhlIGFuaW1hdGlvbiB0byBiZSBhd2FpdGVkLlxuICAgICAqXG4gICAgICogQGRlcHJlY2F0ZWQgVXNlIGBmaW5pc2hlZGAgaW5zdGVhZC5cbiAgICAgKi9cbiAgICB0aGVuKG9uUmVzb2x2ZSwgb25SZWplY3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluaXNoZWQudGhlbihvblJlc29sdmUsIG9uUmVqZWN0KTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IFdpdGhQcm9taXNlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1XaXRoUHJvbWlzZS5tanMubWFwXG4iLCJpbXBvcnQgeyBpbnZhcmlhbnQsIHBpcGUsIGNsYW1wLCBtaWxsaXNlY29uZHNUb1NlY29uZHMsIHNlY29uZHNUb01pbGxpc2Vjb25kcyB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyB0aW1lIH0gZnJvbSAnLi4vZnJhbWVsb29wL3N5bmMtdGltZS5tanMnO1xuaW1wb3J0IHsgYWN0aXZlQW5pbWF0aW9ucyB9IGZyb20gJy4uL3N0YXRzL2FuaW1hdGlvbi1jb3VudC5tanMnO1xuaW1wb3J0IHsgbWl4IH0gZnJvbSAnLi4vdXRpbHMvbWl4L2luZGV4Lm1qcyc7XG5pbXBvcnQgeyBmcmFtZWxvb3BEcml2ZXIgfSBmcm9tICcuL2RyaXZlcnMvZnJhbWUubWpzJztcbmltcG9ydCB7IGluZXJ0aWEgfSBmcm9tICcuL2dlbmVyYXRvcnMvaW5lcnRpYS5tanMnO1xuaW1wb3J0IHsga2V5ZnJhbWVzIH0gZnJvbSAnLi9nZW5lcmF0b3JzL2tleWZyYW1lcy5tanMnO1xuaW1wb3J0IHsgY2FsY0dlbmVyYXRvckR1cmF0aW9uIH0gZnJvbSAnLi9nZW5lcmF0b3JzL3V0aWxzL2NhbGMtZHVyYXRpb24ubWpzJztcbmltcG9ydCB7IGdldEdlbmVyYXRvclZlbG9jaXR5IH0gZnJvbSAnLi9nZW5lcmF0b3JzL3V0aWxzL3ZlbG9jaXR5Lm1qcyc7XG5pbXBvcnQgeyBnZXRGaW5hbEtleWZyYW1lIH0gZnJvbSAnLi9rZXlmcmFtZXMvZ2V0LWZpbmFsLm1qcyc7XG5pbXBvcnQgeyByZXBsYWNlVHJhbnNpdGlvblR5cGUgfSBmcm9tICcuL3V0aWxzL3JlcGxhY2UtdHJhbnNpdGlvbi10eXBlLm1qcyc7XG5pbXBvcnQgeyBXaXRoUHJvbWlzZSB9IGZyb20gJy4vdXRpbHMvV2l0aFByb21pc2UubWpzJztcblxuY29uc3QgcGVyY2VudFRvUHJvZ3Jlc3MgPSAocGVyY2VudCkgPT4gcGVyY2VudCAvIDEwMDtcbmNsYXNzIEpTQW5pbWF0aW9uIGV4dGVuZHMgV2l0aFByb21pc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFwiaWRsZVwiO1xuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IG51bGw7XG4gICAgICAgIHRoaXMuaXNTdG9wcGVkID0gZmFsc2U7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgY3VycmVudCB0aW1lIG9mIHRoZSBhbmltYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmN1cnJlbnRUaW1lID0gMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0aW1lIGF0IHdoaWNoIHRoZSBhbmltYXRpb24gd2FzIHBhdXNlZC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaG9sZFRpbWUgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogUGxheWJhY2sgc3BlZWQgYXMgYSBmYWN0b3IuIDAgd291bGQgYmUgc3RvcHBlZCwgLTEgcmV2ZXJzZSBhbmQgMiBkb3VibGUgc3BlZWQuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBsYXliYWNrU3BlZWQgPSAxO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhpcyBtZXRob2QgaXMgYm91bmQgdG8gdGhlIGluc3RhbmNlIHRvIGZpeCBhIHBhdHRlcm4gd2hlcmVcbiAgICAgICAgICogYW5pbWF0aW9uLnN0b3AgaXMgcmV0dXJuZWQgYXMgYSByZWZlcmVuY2UgZnJvbSBhIHVzZUVmZmVjdC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc3RvcCA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgbW90aW9uVmFsdWUgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgICAgIGlmIChtb3Rpb25WYWx1ZSAmJiBtb3Rpb25WYWx1ZS51cGRhdGVkQXQgIT09IHRpbWUubm93KCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpY2sodGltZS5ub3coKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gXCJpZGxlXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdGhpcy50ZWFyZG93bigpO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9uU3RvcD8uKCk7XG4gICAgICAgIH07XG4gICAgICAgIGFjdGl2ZUFuaW1hdGlvbnMubWFpblRocmVhZCsrO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLmluaXRBbmltYXRpb24oKTtcbiAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgIGlmIChvcHRpb25zLmF1dG9wbGF5ID09PSBmYWxzZSlcbiAgICAgICAgICAgIHRoaXMucGF1c2UoKTtcbiAgICB9XG4gICAgaW5pdEFuaW1hdGlvbigpIHtcbiAgICAgICAgY29uc3QgeyBvcHRpb25zIH0gPSB0aGlzO1xuICAgICAgICByZXBsYWNlVHJhbnNpdGlvblR5cGUob3B0aW9ucyk7XG4gICAgICAgIGNvbnN0IHsgdHlwZSA9IGtleWZyYW1lcywgcmVwZWF0ID0gMCwgcmVwZWF0RGVsYXkgPSAwLCByZXBlYXRUeXBlLCB2ZWxvY2l0eSA9IDAsIH0gPSBvcHRpb25zO1xuICAgICAgICBsZXQgeyBrZXlmcmFtZXM6IGtleWZyYW1lcyQxIH0gPSBvcHRpb25zO1xuICAgICAgICBjb25zdCBnZW5lcmF0b3JGYWN0b3J5ID0gdHlwZSB8fCBrZXlmcmFtZXM7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgJiZcbiAgICAgICAgICAgIGdlbmVyYXRvckZhY3RvcnkgIT09IGtleWZyYW1lcykge1xuICAgICAgICAgICAgaW52YXJpYW50KGtleWZyYW1lcyQxLmxlbmd0aCA8PSAyLCBgT25seSB0d28ga2V5ZnJhbWVzIGN1cnJlbnRseSBzdXBwb3J0ZWQgd2l0aCBzcHJpbmcgYW5kIGluZXJ0aWEgYW5pbWF0aW9ucy4gVHJ5aW5nIHRvIGFuaW1hdGUgJHtrZXlmcmFtZXMkMX1gLCBcInNwcmluZy10d28tZnJhbWVzXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChnZW5lcmF0b3JGYWN0b3J5ICE9PSBrZXlmcmFtZXMgJiZcbiAgICAgICAgICAgIHR5cGVvZiBrZXlmcmFtZXMkMVswXSAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgdGhpcy5taXhLZXlmcmFtZXMgPSBwaXBlKHBlcmNlbnRUb1Byb2dyZXNzLCBtaXgoa2V5ZnJhbWVzJDFbMF0sIGtleWZyYW1lcyQxWzFdKSk7XG4gICAgICAgICAgICBrZXlmcmFtZXMkMSA9IFswLCAxMDBdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGdlbmVyYXRvciA9IGdlbmVyYXRvckZhY3RvcnkoeyAuLi5vcHRpb25zLCBrZXlmcmFtZXM6IGtleWZyYW1lcyQxIH0pO1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgd2UgaGF2ZSBhIG1pcnJvciByZXBlYXQgdHlwZSB3ZSBuZWVkIHRvIGNyZWF0ZSBhIHNlY29uZCBnZW5lcmF0b3IgdGhhdCBvdXRwdXRzIHRoZVxuICAgICAgICAgKiBtaXJyb3JlZCAobm90IHJldmVyc2VkKSBhbmltYXRpb24gYW5kIGxhdGVyIHBpbmcgcG9uZyBiZXR3ZWVuIHRoZSB0d28gZ2VuZXJhdG9ycy5cbiAgICAgICAgICovXG4gICAgICAgIGlmIChyZXBlYXRUeXBlID09PSBcIm1pcnJvclwiKSB7XG4gICAgICAgICAgICB0aGlzLm1pcnJvcmVkR2VuZXJhdG9yID0gZ2VuZXJhdG9yRmFjdG9yeSh7XG4gICAgICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICAgICAgICBrZXlmcmFtZXM6IFsuLi5rZXlmcmFtZXMkMV0ucmV2ZXJzZSgpLFxuICAgICAgICAgICAgICAgIHZlbG9jaXR5OiAtdmVsb2NpdHksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgZHVyYXRpb24gaXMgdW5kZWZpbmVkIGFuZCB3ZSBoYXZlIHJlcGVhdCBvcHRpb25zLFxuICAgICAgICAgKiB3ZSBuZWVkIHRvIGNhbGN1bGF0ZSBhIGR1cmF0aW9uIGZyb20gdGhlIGdlbmVyYXRvci5cbiAgICAgICAgICpcbiAgICAgICAgICogV2Ugc2V0IGl0IHRvIHRoZSBnZW5lcmF0b3IgaXRzZWxmIHRvIGNhY2hlIHRoZSBkdXJhdGlvbi5cbiAgICAgICAgICogQW55IHRpbWVsaW5lIHJlc29sdmVyIHdpbGwgbmVlZCB0byBoYXZlIGFscmVhZHkgcHJlY2FsY3VsYXRlZFxuICAgICAgICAgKiB0aGUgZHVyYXRpb24gYnkgdGhpcyBzdGVwLlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKGdlbmVyYXRvci5jYWxjdWxhdGVkRHVyYXRpb24gPT09IG51bGwpIHtcbiAgICAgICAgICAgIGdlbmVyYXRvci5jYWxjdWxhdGVkRHVyYXRpb24gPSBjYWxjR2VuZXJhdG9yRHVyYXRpb24oZ2VuZXJhdG9yKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IGNhbGN1bGF0ZWREdXJhdGlvbiB9ID0gZ2VuZXJhdG9yO1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZWREdXJhdGlvbiA9IGNhbGN1bGF0ZWREdXJhdGlvbjtcbiAgICAgICAgdGhpcy5yZXNvbHZlZER1cmF0aW9uID0gY2FsY3VsYXRlZER1cmF0aW9uICsgcmVwZWF0RGVsYXk7XG4gICAgICAgIHRoaXMudG90YWxEdXJhdGlvbiA9IHRoaXMucmVzb2x2ZWREdXJhdGlvbiAqIChyZXBlYXQgKyAxKSAtIHJlcGVhdERlbGF5O1xuICAgICAgICB0aGlzLmdlbmVyYXRvciA9IGdlbmVyYXRvcjtcbiAgICB9XG4gICAgdXBkYXRlVGltZSh0aW1lc3RhbXApIHtcbiAgICAgICAgY29uc3QgYW5pbWF0aW9uVGltZSA9IE1hdGgucm91bmQodGltZXN0YW1wIC0gdGhpcy5zdGFydFRpbWUpICogdGhpcy5wbGF5YmFja1NwZWVkO1xuICAgICAgICAvLyBVcGRhdGUgY3VycmVudFRpbWVcbiAgICAgICAgaWYgKHRoaXMuaG9sZFRpbWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRpbWUgPSB0aGlzLmhvbGRUaW1lO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gUm91bmRpbmcgdGhlIHRpbWUgYmVjYXVzZSBmbG9hdGluZyBwb2ludCBhcml0aG1ldGljIGlzIG5vdCBhbHdheXMgYWNjdXJhdGUsIGUuZy4gMzAwMC4zNjcgLSAxMDAwLjM2NyA9XG4gICAgICAgICAgICAvLyAyMDAwLjAwMDAwMDAwMDAwMDIuIFRoaXMgaXMgYSBwcm9ibGVtIHdoZW4gd2UgYXJlIGNvbXBhcmluZyB0aGUgY3VycmVudFRpbWUgd2l0aCB0aGUgZHVyYXRpb24sIGZvclxuICAgICAgICAgICAgLy8gZXhhbXBsZS5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRpbWUgPSBhbmltYXRpb25UaW1lO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRpY2sodGltZXN0YW1wLCBzYW1wbGUgPSBmYWxzZSkge1xuICAgICAgICBjb25zdCB7IGdlbmVyYXRvciwgdG90YWxEdXJhdGlvbiwgbWl4S2V5ZnJhbWVzLCBtaXJyb3JlZEdlbmVyYXRvciwgcmVzb2x2ZWREdXJhdGlvbiwgY2FsY3VsYXRlZER1cmF0aW9uLCB9ID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuc3RhcnRUaW1lID09PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIGdlbmVyYXRvci5uZXh0KDApO1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwga2V5ZnJhbWVzLCByZXBlYXQsIHJlcGVhdFR5cGUsIHJlcGVhdERlbGF5LCB0eXBlLCBvblVwZGF0ZSwgZmluYWxLZXlmcmFtZSwgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIHJlcXVlc3RBbmltYXRpb25GcmFtZSB0aW1lc3RhbXBzIGNhbiBjb21lIHRocm91Z2ggYXMgbG93ZXIgdGhhblxuICAgICAgICAgKiB0aGUgc3RhcnRUaW1lIGFzIHNldCBieSBwZXJmb3JtYW5jZS5ub3coKS4gSGVyZSB3ZSBwcmV2ZW50IHRoaXMsXG4gICAgICAgICAqIHRob3VnaCBpbiB0aGUgZnV0dXJlIGl0IGNvdWxkIGJlIHBvc3NpYmxlIHRvIG1ha2Ugc2V0dGluZyBzdGFydFRpbWVcbiAgICAgICAgICogYSBwZW5kaW5nIG9wZXJhdGlvbiB0aGF0IGdldHMgcmVzb2x2ZWQgaGVyZS5cbiAgICAgICAgICovXG4gICAgICAgIGlmICh0aGlzLnNwZWVkID4gMCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBNYXRoLm1pbih0aGlzLnN0YXJ0VGltZSwgdGltZXN0YW1wKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnNwZWVkIDwgMCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydFRpbWUgPSBNYXRoLm1pbih0aW1lc3RhbXAgLSB0b3RhbER1cmF0aW9uIC8gdGhpcy5zcGVlZCwgdGhpcy5zdGFydFRpbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzYW1wbGUpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRpbWUgPSB0aW1lc3RhbXA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRpbWUodGltZXN0YW1wKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZWJhc2Ugb24gZGVsYXlcbiAgICAgICAgY29uc3QgdGltZVdpdGhvdXREZWxheSA9IHRoaXMuY3VycmVudFRpbWUgLSBkZWxheSAqICh0aGlzLnBsYXliYWNrU3BlZWQgPj0gMCA/IDEgOiAtMSk7XG4gICAgICAgIGNvbnN0IGlzSW5EZWxheVBoYXNlID0gdGhpcy5wbGF5YmFja1NwZWVkID49IDBcbiAgICAgICAgICAgID8gdGltZVdpdGhvdXREZWxheSA8IDBcbiAgICAgICAgICAgIDogdGltZVdpdGhvdXREZWxheSA+IHRvdGFsRHVyYXRpb247XG4gICAgICAgIHRoaXMuY3VycmVudFRpbWUgPSBNYXRoLm1heCh0aW1lV2l0aG91dERlbGF5LCAwKTtcbiAgICAgICAgLy8gSWYgdGhpcyBhbmltYXRpb24gaGFzIGZpbmlzaGVkLCBzZXQgdGhlIGN1cnJlbnQgdGltZSAgdG8gdGhlIHRvdGFsIGR1cmF0aW9uLlxuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gXCJmaW5pc2hlZFwiICYmIHRoaXMuaG9sZFRpbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFRpbWUgPSB0b3RhbER1cmF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGxldCBlbGFwc2VkID0gdGhpcy5jdXJyZW50VGltZTtcbiAgICAgICAgbGV0IGZyYW1lR2VuZXJhdG9yID0gZ2VuZXJhdG9yO1xuICAgICAgICBpZiAocmVwZWF0KSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEdldCB0aGUgY3VycmVudCBwcm9ncmVzcyAoMC0xKSBvZiB0aGUgYW5pbWF0aW9uLiBJZiB0IGlzID5cbiAgICAgICAgICAgICAqIHRoYW4gZHVyYXRpb24gd2UnbGwgZ2V0IHZhbHVlcyBsaWtlIDIuNSAobWlkd2F5IHRocm91Z2ggdGhlXG4gICAgICAgICAgICAgKiB0aGlyZCBpdGVyYXRpb24pXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHByb2dyZXNzID0gTWF0aC5taW4odGhpcy5jdXJyZW50VGltZSwgdG90YWxEdXJhdGlvbikgLyByZXNvbHZlZER1cmF0aW9uO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBHZXQgdGhlIGN1cnJlbnQgaXRlcmF0aW9uICgwIGluZGV4ZWQpLiBGb3IgaW5zdGFuY2UgdGhlIGZsb29yIG9mXG4gICAgICAgICAgICAgKiAyLjUgaXMgMi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRJdGVyYXRpb24gPSBNYXRoLmZsb29yKHByb2dyZXNzKTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogR2V0IHRoZSBjdXJyZW50IHByb2dyZXNzIG9mIHRoZSBpdGVyYXRpb24gYnkgdGFraW5nIHRoZSByZW1haW5kZXJcbiAgICAgICAgICAgICAqIHNvIDIuNSBpcyAwLjUgdGhyb3VnaCBpdGVyYXRpb24gMlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgaXRlcmF0aW9uUHJvZ3Jlc3MgPSBwcm9ncmVzcyAlIDEuMDtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgaXRlcmF0aW9uIHByb2dyZXNzIGlzIDEgd2UgY291bnQgdGhhdCBhcyB0aGUgZW5kXG4gICAgICAgICAgICAgKiBvZiB0aGUgcHJldmlvdXMgaXRlcmF0aW9uLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoIWl0ZXJhdGlvblByb2dyZXNzICYmIHByb2dyZXNzID49IDEpIHtcbiAgICAgICAgICAgICAgICBpdGVyYXRpb25Qcm9ncmVzcyA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpdGVyYXRpb25Qcm9ncmVzcyA9PT0gMSAmJiBjdXJyZW50SXRlcmF0aW9uLS07XG4gICAgICAgICAgICBjdXJyZW50SXRlcmF0aW9uID0gTWF0aC5taW4oY3VycmVudEl0ZXJhdGlvbiwgcmVwZWF0ICsgMSk7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFJldmVyc2UgcHJvZ3Jlc3MgaWYgd2UncmUgbm90IHJ1bm5pbmcgaW4gXCJub3JtYWxcIiBkaXJlY3Rpb25cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgaXNPZGRJdGVyYXRpb24gPSBCb29sZWFuKGN1cnJlbnRJdGVyYXRpb24gJSAyKTtcbiAgICAgICAgICAgIGlmIChpc09kZEl0ZXJhdGlvbikge1xuICAgICAgICAgICAgICAgIGlmIChyZXBlYXRUeXBlID09PSBcInJldmVyc2VcIikge1xuICAgICAgICAgICAgICAgICAgICBpdGVyYXRpb25Qcm9ncmVzcyA9IDEgLSBpdGVyYXRpb25Qcm9ncmVzcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcGVhdERlbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVyYXRpb25Qcm9ncmVzcyAtPSByZXBlYXREZWxheSAvIHJlc29sdmVkRHVyYXRpb247XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocmVwZWF0VHlwZSA9PT0gXCJtaXJyb3JcIikge1xuICAgICAgICAgICAgICAgICAgICBmcmFtZUdlbmVyYXRvciA9IG1pcnJvcmVkR2VuZXJhdG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsYXBzZWQgPSBjbGFtcCgwLCAxLCBpdGVyYXRpb25Qcm9ncmVzcykgKiByZXNvbHZlZER1cmF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiB3ZSdyZSBpbiBuZWdhdGl2ZSB0aW1lLCBzZXQgc3RhdGUgYXMgdGhlIGluaXRpYWwga2V5ZnJhbWUuXG4gICAgICAgICAqIFRoaXMgcHJldmVudHMgZGVsYXk6IHgsIGR1cmF0aW9uOiAwIGFuaW1hdGlvbnMgZnJvbSBmaW5pc2hpbmdcbiAgICAgICAgICogaW5zdGFudGx5LlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgc3RhdGUgPSBpc0luRGVsYXlQaGFzZVxuICAgICAgICAgICAgPyB7IGRvbmU6IGZhbHNlLCB2YWx1ZToga2V5ZnJhbWVzWzBdIH1cbiAgICAgICAgICAgIDogZnJhbWVHZW5lcmF0b3IubmV4dChlbGFwc2VkKTtcbiAgICAgICAgaWYgKG1peEtleWZyYW1lcyAmJiAhaXNJbkRlbGF5UGhhc2UpIHtcbiAgICAgICAgICAgIHN0YXRlLnZhbHVlID0gbWl4S2V5ZnJhbWVzKHN0YXRlLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeyBkb25lIH0gPSBzdGF0ZTtcbiAgICAgICAgaWYgKCFpc0luRGVsYXlQaGFzZSAmJiBjYWxjdWxhdGVkRHVyYXRpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgIGRvbmUgPVxuICAgICAgICAgICAgICAgIHRoaXMucGxheWJhY2tTcGVlZCA+PSAwXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy5jdXJyZW50VGltZSA+PSB0b3RhbER1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5jdXJyZW50VGltZSA8PSAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGlzQW5pbWF0aW9uRmluaXNoZWQgPSB0aGlzLmhvbGRUaW1lID09PSBudWxsICYmXG4gICAgICAgICAgICAodGhpcy5zdGF0ZSA9PT0gXCJmaW5pc2hlZFwiIHx8ICh0aGlzLnN0YXRlID09PSBcInJ1bm5pbmdcIiAmJiBkb25lKSk7XG4gICAgICAgIC8vIFRPRE86IFRoZSBleGNlcHRpb24gZm9yIGluZXJ0aWEgY291bGQgYmUgY2xlYW5lciBoZXJlXG4gICAgICAgIGlmIChpc0FuaW1hdGlvbkZpbmlzaGVkICYmIHR5cGUgIT09IGluZXJ0aWEpIHtcbiAgICAgICAgICAgIHN0YXRlLnZhbHVlID0gZ2V0RmluYWxLZXlmcmFtZShrZXlmcmFtZXMsIHRoaXMub3B0aW9ucywgZmluYWxLZXlmcmFtZSwgdGhpcy5zcGVlZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9uVXBkYXRlKSB7XG4gICAgICAgICAgICBvblVwZGF0ZShzdGF0ZS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQW5pbWF0aW9uRmluaXNoZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBbGxvd3MgdGhlIHJldHVybmVkIGFuaW1hdGlvbiB0byBiZSBhd2FpdGVkIG9yIHByb21pc2UtY2hhaW5lZC4gQ3VycmVudGx5XG4gICAgICogcmVzb2x2ZXMgd2hlbiB0aGUgYW5pbWF0aW9uIGZpbmlzaGVzIGF0IGFsbCBidXQgaW4gYSBmdXR1cmUgdXBkYXRlIGNvdWxkL3Nob3VsZFxuICAgICAqIHJlamVjdCBpZiBpdHMgY2FuY2Vscy5cbiAgICAgKi9cbiAgICB0aGVuKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hlZC50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgfVxuICAgIGdldCBkdXJhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG1pbGxpc2Vjb25kc1RvU2Vjb25kcyh0aGlzLmNhbGN1bGF0ZWREdXJhdGlvbik7XG4gICAgfVxuICAgIGdldCBpdGVyYXRpb25EdXJhdGlvbigpIHtcbiAgICAgICAgY29uc3QgeyBkZWxheSA9IDAgfSA9IHRoaXMub3B0aW9ucyB8fCB7fTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZHVyYXRpb24gKyBtaWxsaXNlY29uZHNUb1NlY29uZHMoZGVsYXkpO1xuICAgIH1cbiAgICBnZXQgdGltZSgpIHtcbiAgICAgICAgcmV0dXJuIG1pbGxpc2Vjb25kc1RvU2Vjb25kcyh0aGlzLmN1cnJlbnRUaW1lKTtcbiAgICB9XG4gICAgc2V0IHRpbWUobmV3VGltZSkge1xuICAgICAgICBuZXdUaW1lID0gc2Vjb25kc1RvTWlsbGlzZWNvbmRzKG5ld1RpbWUpO1xuICAgICAgICB0aGlzLmN1cnJlbnRUaW1lID0gbmV3VGltZTtcbiAgICAgICAgaWYgKHRoaXMuc3RhcnRUaW1lID09PSBudWxsIHx8XG4gICAgICAgICAgICB0aGlzLmhvbGRUaW1lICE9PSBudWxsIHx8XG4gICAgICAgICAgICB0aGlzLnBsYXliYWNrU3BlZWQgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuaG9sZFRpbWUgPSBuZXdUaW1lO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuZHJpdmVyKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IHRoaXMuZHJpdmVyLm5vdygpIC0gbmV3VGltZSAvIHRoaXMucGxheWJhY2tTcGVlZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5kcml2ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZHJpdmVyLnN0YXJ0KGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gMDtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBcInBhdXNlZFwiO1xuICAgICAgICAgICAgdGhpcy5ob2xkVGltZSA9IG5ld1RpbWU7XG4gICAgICAgICAgICB0aGlzLnRpY2sobmV3VGltZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZ2VuZXJhdG9yJ3MgdmVsb2NpdHkgYXQgdGhlIGN1cnJlbnQgdGltZSBpbiB1bml0cy9zZWNvbmQuXG4gICAgICogVXNlcyB0aGUgYW5hbHl0aWNhbCBkZXJpdmF0aXZlIHdoZW4gYXZhaWxhYmxlIChzcHJpbmdzKSwgYXZvaWRpbmdcbiAgICAgKiB0aGUgTW90aW9uVmFsdWUncyBmcmFtZS1kZXBlbmRlbnQgdmVsb2NpdHkgZXN0aW1hdGlvbi5cbiAgICAgKi9cbiAgICBnZXRHZW5lcmF0b3JWZWxvY2l0eSgpIHtcbiAgICAgICAgY29uc3QgdCA9IHRoaXMuY3VycmVudFRpbWU7XG4gICAgICAgIGlmICh0IDw9IDApXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnZlbG9jaXR5IHx8IDA7XG4gICAgICAgIGlmICh0aGlzLmdlbmVyYXRvci52ZWxvY2l0eSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdG9yLnZlbG9jaXR5KHQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEZhbGxiYWNrOiBmaW5pdGUgZGlmZmVyZW5jZVxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5nZW5lcmF0b3IubmV4dCh0KS52YWx1ZTtcbiAgICAgICAgcmV0dXJuIGdldEdlbmVyYXRvclZlbG9jaXR5KChzKSA9PiB0aGlzLmdlbmVyYXRvci5uZXh0KHMpLnZhbHVlLCB0LCBjdXJyZW50KTtcbiAgICB9XG4gICAgZ2V0IHNwZWVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wbGF5YmFja1NwZWVkO1xuICAgIH1cbiAgICBzZXQgc3BlZWQobmV3U3BlZWQpIHtcbiAgICAgICAgY29uc3QgaGFzQ2hhbmdlZCA9IHRoaXMucGxheWJhY2tTcGVlZCAhPT0gbmV3U3BlZWQ7XG4gICAgICAgIGlmIChoYXNDaGFuZ2VkICYmIHRoaXMuZHJpdmVyKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRpbWUodGltZS5ub3coKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wbGF5YmFja1NwZWVkID0gbmV3U3BlZWQ7XG4gICAgICAgIGlmIChoYXNDaGFuZ2VkICYmIHRoaXMuZHJpdmVyKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWUgPSBtaWxsaXNlY29uZHNUb1NlY29uZHModGhpcy5jdXJyZW50VGltZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcGxheSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdG9wcGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCB7IGRyaXZlciA9IGZyYW1lbG9vcERyaXZlciwgc3RhcnRUaW1lIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIGlmICghdGhpcy5kcml2ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZHJpdmVyID0gZHJpdmVyKCh0aW1lc3RhbXApID0+IHRoaXMudGljayh0aW1lc3RhbXApKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wdGlvbnMub25QbGF5Py4oKTtcbiAgICAgICAgY29uc3Qgbm93ID0gdGhpcy5kcml2ZXIubm93KCk7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBcImZpbmlzaGVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRmluaXNoZWQoKTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbm93O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuaG9sZFRpbWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gbm93IC0gdGhpcy5ob2xkVGltZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghdGhpcy5zdGFydFRpbWUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRUaW1lID0gc3RhcnRUaW1lID8/IG5vdztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gXCJmaW5pc2hlZFwiICYmIHRoaXMuc3BlZWQgPCAwKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSArPSB0aGlzLmNhbGN1bGF0ZWREdXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhvbGRUaW1lID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCBwbGF5U3RhdGUgdG8gcnVubmluZyBvbmx5IGFmdGVyIHdlJ3ZlIHVzZWQgaXQgaW5cbiAgICAgICAgICogdGhlIHByZXZpb3VzIGxvZ2ljLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zdGF0ZSA9IFwicnVubmluZ1wiO1xuICAgICAgICB0aGlzLmRyaXZlci5zdGFydCgpO1xuICAgIH1cbiAgICBwYXVzZSgpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFwicGF1c2VkXCI7XG4gICAgICAgIHRoaXMudXBkYXRlVGltZSh0aW1lLm5vdygpKTtcbiAgICAgICAgdGhpcy5ob2xkVGltZSA9IHRoaXMuY3VycmVudFRpbWU7XG4gICAgfVxuICAgIGNvbXBsZXRlKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gXCJydW5uaW5nXCIpIHtcbiAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhdGUgPSBcImZpbmlzaGVkXCI7XG4gICAgICAgIHRoaXMuaG9sZFRpbWUgPSBudWxsO1xuICAgIH1cbiAgICBmaW5pc2goKSB7XG4gICAgICAgIHRoaXMubm90aWZ5RmluaXNoZWQoKTtcbiAgICAgICAgdGhpcy50ZWFyZG93bigpO1xuICAgICAgICB0aGlzLnN0YXRlID0gXCJmaW5pc2hlZFwiO1xuICAgICAgICB0aGlzLm9wdGlvbnMub25Db21wbGV0ZT8uKCk7XG4gICAgfVxuICAgIGNhbmNlbCgpIHtcbiAgICAgICAgdGhpcy5ob2xkVGltZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gMDtcbiAgICAgICAgdGhpcy50aWNrKDApO1xuICAgICAgICB0aGlzLnRlYXJkb3duKCk7XG4gICAgICAgIHRoaXMub3B0aW9ucy5vbkNhbmNlbD8uKCk7XG4gICAgfVxuICAgIHRlYXJkb3duKCkge1xuICAgICAgICB0aGlzLnN0YXRlID0gXCJpZGxlXCI7XG4gICAgICAgIHRoaXMuc3RvcERyaXZlcigpO1xuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IHRoaXMuaG9sZFRpbWUgPSBudWxsO1xuICAgICAgICBhY3RpdmVBbmltYXRpb25zLm1haW5UaHJlYWQtLTtcbiAgICB9XG4gICAgc3RvcERyaXZlcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRyaXZlcilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5kcml2ZXIuc3RvcCgpO1xuICAgICAgICB0aGlzLmRyaXZlciA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgc2FtcGxlKHNhbXBsZVRpbWUpIHtcbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSAwO1xuICAgICAgICByZXR1cm4gdGhpcy50aWNrKHNhbXBsZVRpbWUsIHRydWUpO1xuICAgIH1cbiAgICBhdHRhY2hUaW1lbGluZSh0aW1lbGluZSkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFsbG93RmxhdHRlbikge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnR5cGUgPSBcImtleWZyYW1lc1wiO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmVhc2UgPSBcImxpbmVhclwiO1xuICAgICAgICAgICAgdGhpcy5pbml0QW5pbWF0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcml2ZXI/LnN0b3AoKTtcbiAgICAgICAgcmV0dXJuIHRpbWVsaW5lLm9ic2VydmUodGhpcyk7XG4gICAgfVxufVxuLy8gTGVnYWN5IGZ1bmN0aW9uIHN1cHBvcnRcbmZ1bmN0aW9uIGFuaW1hdGVWYWx1ZShvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBKU0FuaW1hdGlvbihvcHRpb25zKTtcbn1cblxuZXhwb3J0IHsgSlNBbmltYXRpb24sIGFuaW1hdGVWYWx1ZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SlNBbmltYXRpb24ubWpzLm1hcFxuIiwiZnVuY3Rpb24gZmlsbFdpbGRjYXJkcyhrZXlmcmFtZXMpIHtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGtleWZyYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBrZXlmcmFtZXNbaV0gPz8gKGtleWZyYW1lc1tpXSA9IGtleWZyYW1lc1tpIC0gMV0pO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgZmlsbFdpbGRjYXJkcyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZmlsbC13aWxkY2FyZHMubWpzLm1hcFxuIiwiY29uc3QgcmFkVG9EZWcgPSAocmFkKSA9PiAocmFkICogMTgwKSAvIE1hdGguUEk7XG5jb25zdCByb3RhdGUgPSAodikgPT4ge1xuICAgIGNvbnN0IGFuZ2xlID0gcmFkVG9EZWcoTWF0aC5hdGFuMih2WzFdLCB2WzBdKSk7XG4gICAgcmV0dXJuIHJlYmFzZUFuZ2xlKGFuZ2xlKTtcbn07XG5jb25zdCBtYXRyaXgyZFBhcnNlcnMgPSB7XG4gICAgeDogNCxcbiAgICB5OiA1LFxuICAgIHRyYW5zbGF0ZVg6IDQsXG4gICAgdHJhbnNsYXRlWTogNSxcbiAgICBzY2FsZVg6IDAsXG4gICAgc2NhbGVZOiAzLFxuICAgIHNjYWxlOiAodikgPT4gKE1hdGguYWJzKHZbMF0pICsgTWF0aC5hYnModlszXSkpIC8gMixcbiAgICByb3RhdGUsXG4gICAgcm90YXRlWjogcm90YXRlLFxuICAgIHNrZXdYOiAodikgPT4gcmFkVG9EZWcoTWF0aC5hdGFuKHZbMV0pKSxcbiAgICBza2V3WTogKHYpID0+IHJhZFRvRGVnKE1hdGguYXRhbih2WzJdKSksXG4gICAgc2tldzogKHYpID0+IChNYXRoLmFicyh2WzFdKSArIE1hdGguYWJzKHZbMl0pKSAvIDIsXG59O1xuY29uc3QgcmViYXNlQW5nbGUgPSAoYW5nbGUpID0+IHtcbiAgICBhbmdsZSA9IGFuZ2xlICUgMzYwO1xuICAgIGlmIChhbmdsZSA8IDApXG4gICAgICAgIGFuZ2xlICs9IDM2MDtcbiAgICByZXR1cm4gYW5nbGU7XG59O1xuY29uc3Qgcm90YXRlWiA9IHJvdGF0ZTtcbmNvbnN0IHNjYWxlWCA9ICh2KSA9PiBNYXRoLnNxcnQodlswXSAqIHZbMF0gKyB2WzFdICogdlsxXSk7XG5jb25zdCBzY2FsZVkgPSAodikgPT4gTWF0aC5zcXJ0KHZbNF0gKiB2WzRdICsgdls1XSAqIHZbNV0pO1xuY29uc3QgbWF0cml4M2RQYXJzZXJzID0ge1xuICAgIHg6IDEyLFxuICAgIHk6IDEzLFxuICAgIHo6IDE0LFxuICAgIHRyYW5zbGF0ZVg6IDEyLFxuICAgIHRyYW5zbGF0ZVk6IDEzLFxuICAgIHRyYW5zbGF0ZVo6IDE0LFxuICAgIHNjYWxlWCxcbiAgICBzY2FsZVksXG4gICAgc2NhbGU6ICh2KSA9PiAoc2NhbGVYKHYpICsgc2NhbGVZKHYpKSAvIDIsXG4gICAgcm90YXRlWDogKHYpID0+IHJlYmFzZUFuZ2xlKHJhZFRvRGVnKE1hdGguYXRhbjIodls2XSwgdls1XSkpKSxcbiAgICByb3RhdGVZOiAodikgPT4gcmViYXNlQW5nbGUocmFkVG9EZWcoTWF0aC5hdGFuMigtdlsyXSwgdlswXSkpKSxcbiAgICByb3RhdGVaLFxuICAgIHJvdGF0ZTogcm90YXRlWixcbiAgICBza2V3WDogKHYpID0+IHJhZFRvRGVnKE1hdGguYXRhbih2WzRdKSksXG4gICAgc2tld1k6ICh2KSA9PiByYWRUb0RlZyhNYXRoLmF0YW4odlsxXSkpLFxuICAgIHNrZXc6ICh2KSA9PiAoTWF0aC5hYnModlsxXSkgKyBNYXRoLmFicyh2WzRdKSkgLyAyLFxufTtcbmZ1bmN0aW9uIGRlZmF1bHRUcmFuc2Zvcm1WYWx1ZShuYW1lKSB7XG4gICAgcmV0dXJuIG5hbWUuaW5jbHVkZXMoXCJzY2FsZVwiKSA/IDEgOiAwO1xufVxuZnVuY3Rpb24gcGFyc2VWYWx1ZUZyb21UcmFuc2Zvcm0odHJhbnNmb3JtLCBuYW1lKSB7XG4gICAgaWYgKCF0cmFuc2Zvcm0gfHwgdHJhbnNmb3JtID09PSBcIm5vbmVcIikge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFRyYW5zZm9ybVZhbHVlKG5hbWUpO1xuICAgIH1cbiAgICBjb25zdCBtYXRyaXgzZE1hdGNoID0gdHJhbnNmb3JtLm1hdGNoKC9ebWF0cml4M2RcXCgoWy1cXGQuZVxccyxdKylcXCkkL3UpO1xuICAgIGxldCBwYXJzZXJzO1xuICAgIGxldCBtYXRjaDtcbiAgICBpZiAobWF0cml4M2RNYXRjaCkge1xuICAgICAgICBwYXJzZXJzID0gbWF0cml4M2RQYXJzZXJzO1xuICAgICAgICBtYXRjaCA9IG1hdHJpeDNkTWF0Y2g7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBtYXRyaXgyZE1hdGNoID0gdHJhbnNmb3JtLm1hdGNoKC9ebWF0cml4XFwoKFstXFxkLmVcXHMsXSspXFwpJC91KTtcbiAgICAgICAgcGFyc2VycyA9IG1hdHJpeDJkUGFyc2VycztcbiAgICAgICAgbWF0Y2ggPSBtYXRyaXgyZE1hdGNoO1xuICAgIH1cbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VHJhbnNmb3JtVmFsdWUobmFtZSk7XG4gICAgfVxuICAgIGNvbnN0IHZhbHVlUGFyc2VyID0gcGFyc2Vyc1tuYW1lXTtcbiAgICBjb25zdCB2YWx1ZXMgPSBtYXRjaFsxXS5zcGxpdChcIixcIikubWFwKGNvbnZlcnRUcmFuc2Zvcm1Ub051bWJlcik7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZVBhcnNlciA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgID8gdmFsdWVQYXJzZXIodmFsdWVzKVxuICAgICAgICA6IHZhbHVlc1t2YWx1ZVBhcnNlcl07XG59XG5jb25zdCByZWFkVHJhbnNmb3JtVmFsdWUgPSAoaW5zdGFuY2UsIG5hbWUpID0+IHtcbiAgICBjb25zdCB7IHRyYW5zZm9ybSA9IFwibm9uZVwiIH0gPSBnZXRDb21wdXRlZFN0eWxlKGluc3RhbmNlKTtcbiAgICByZXR1cm4gcGFyc2VWYWx1ZUZyb21UcmFuc2Zvcm0odHJhbnNmb3JtLCBuYW1lKTtcbn07XG5mdW5jdGlvbiBjb252ZXJ0VHJhbnNmb3JtVG9OdW1iZXIodmFsdWUpIHtcbiAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZS50cmltKCkpO1xufVxuXG5leHBvcnQgeyBkZWZhdWx0VHJhbnNmb3JtVmFsdWUsIHBhcnNlVmFsdWVGcm9tVHJhbnNmb3JtLCByZWFkVHJhbnNmb3JtVmFsdWUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhcnNlLXRyYW5zZm9ybS5tanMubWFwXG4iLCIvKipcbiAqIEdlbmVyYXRlIGEgbGlzdCBvZiBldmVyeSBwb3NzaWJsZSB0cmFuc2Zvcm0ga2V5LlxuICovXG5jb25zdCB0cmFuc2Zvcm1Qcm9wT3JkZXIgPSBbXG4gICAgXCJ0cmFuc2Zvcm1QZXJzcGVjdGl2ZVwiLFxuICAgIFwieFwiLFxuICAgIFwieVwiLFxuICAgIFwielwiLFxuICAgIFwidHJhbnNsYXRlWFwiLFxuICAgIFwidHJhbnNsYXRlWVwiLFxuICAgIFwidHJhbnNsYXRlWlwiLFxuICAgIFwic2NhbGVcIixcbiAgICBcInNjYWxlWFwiLFxuICAgIFwic2NhbGVZXCIsXG4gICAgXCJyb3RhdGVcIixcbiAgICBcInJvdGF0ZVhcIixcbiAgICBcInJvdGF0ZVlcIixcbiAgICBcInJvdGF0ZVpcIixcbiAgICBcInNrZXdcIixcbiAgICBcInNrZXdYXCIsXG4gICAgXCJza2V3WVwiLFxuXTtcbi8qKlxuICogQSBxdWljayBsb29rdXAgZm9yIHRyYW5zZm9ybSBwcm9wcy5cbiAqL1xuY29uc3QgdHJhbnNmb3JtUHJvcHMgPSAvKkBfX1BVUkVfXyovICgoKSA9PiBuZXcgU2V0KHRyYW5zZm9ybVByb3BPcmRlcikpKCk7XG5cbmV4cG9ydCB7IHRyYW5zZm9ybVByb3BPcmRlciwgdHJhbnNmb3JtUHJvcHMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWtleXMtdHJhbnNmb3JtLm1qcy5tYXBcbiIsImltcG9ydCB7IHBhcnNlVmFsdWVGcm9tVHJhbnNmb3JtIH0gZnJvbSAnLi4vLi4vLi4vcmVuZGVyL2RvbS9wYXJzZS10cmFuc2Zvcm0ubWpzJztcbmltcG9ydCB7IHRyYW5zZm9ybVByb3BPcmRlciB9IGZyb20gJy4uLy4uLy4uL3JlbmRlci91dGlscy9rZXlzLXRyYW5zZm9ybS5tanMnO1xuaW1wb3J0IHsgbnVtYmVyIH0gZnJvbSAnLi4vLi4vLi4vdmFsdWUvdHlwZXMvbnVtYmVycy9pbmRleC5tanMnO1xuaW1wb3J0IHsgcHggfSBmcm9tICcuLi8uLi8uLi92YWx1ZS90eXBlcy9udW1iZXJzL3VuaXRzLm1qcyc7XG5cbmNvbnN0IGlzTnVtT3JQeFR5cGUgPSAodikgPT4gdiA9PT0gbnVtYmVyIHx8IHYgPT09IHB4O1xuY29uc3QgdHJhbnNmb3JtS2V5cyA9IG5ldyBTZXQoW1wieFwiLCBcInlcIiwgXCJ6XCJdKTtcbmNvbnN0IG5vblRyYW5zbGF0aW9uYWxUcmFuc2Zvcm1LZXlzID0gdHJhbnNmb3JtUHJvcE9yZGVyLmZpbHRlcigoa2V5KSA9PiAhdHJhbnNmb3JtS2V5cy5oYXMoa2V5KSk7XG5mdW5jdGlvbiByZW1vdmVOb25UcmFuc2xhdGlvbmFsVHJhbnNmb3JtKHZpc3VhbEVsZW1lbnQpIHtcbiAgICBjb25zdCByZW1vdmVkVHJhbnNmb3JtcyA9IFtdO1xuICAgIG5vblRyYW5zbGF0aW9uYWxUcmFuc2Zvcm1LZXlzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHZpc3VhbEVsZW1lbnQuZ2V0VmFsdWUoa2V5KTtcbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJlbW92ZWRUcmFuc2Zvcm1zLnB1c2goW2tleSwgdmFsdWUuZ2V0KCldKTtcbiAgICAgICAgICAgIHZhbHVlLnNldChrZXkuc3RhcnRzV2l0aChcInNjYWxlXCIpID8gMSA6IDApO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlbW92ZWRUcmFuc2Zvcm1zO1xufVxuY29uc3QgcG9zaXRpb25hbFZhbHVlcyA9IHtcbiAgICAvLyBEaW1lbnNpb25zXG4gICAgd2lkdGg6ICh7IHggfSwgeyBwYWRkaW5nTGVmdCA9IFwiMFwiLCBwYWRkaW5nUmlnaHQgPSBcIjBcIiwgYm94U2l6aW5nIH0pID0+IHtcbiAgICAgICAgY29uc3Qgd2lkdGggPSB4Lm1heCAtIHgubWluO1xuICAgICAgICByZXR1cm4gYm94U2l6aW5nID09PSBcImJvcmRlci1ib3hcIlxuICAgICAgICAgICAgPyB3aWR0aFxuICAgICAgICAgICAgOiB3aWR0aCAtIHBhcnNlRmxvYXQocGFkZGluZ0xlZnQpIC0gcGFyc2VGbG9hdChwYWRkaW5nUmlnaHQpO1xuICAgIH0sXG4gICAgaGVpZ2h0OiAoeyB5IH0sIHsgcGFkZGluZ1RvcCA9IFwiMFwiLCBwYWRkaW5nQm90dG9tID0gXCIwXCIsIGJveFNpemluZyB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGhlaWdodCA9IHkubWF4IC0geS5taW47XG4gICAgICAgIHJldHVybiBib3hTaXppbmcgPT09IFwiYm9yZGVyLWJveFwiXG4gICAgICAgICAgICA/IGhlaWdodFxuICAgICAgICAgICAgOiBoZWlnaHQgLSBwYXJzZUZsb2F0KHBhZGRpbmdUb3ApIC0gcGFyc2VGbG9hdChwYWRkaW5nQm90dG9tKTtcbiAgICB9LFxuICAgIHRvcDogKF9iYm94LCB7IHRvcCB9KSA9PiBwYXJzZUZsb2F0KHRvcCksXG4gICAgbGVmdDogKF9iYm94LCB7IGxlZnQgfSkgPT4gcGFyc2VGbG9hdChsZWZ0KSxcbiAgICBib3R0b206ICh7IHkgfSwgeyB0b3AgfSkgPT4gcGFyc2VGbG9hdCh0b3ApICsgKHkubWF4IC0geS5taW4pLFxuICAgIHJpZ2h0OiAoeyB4IH0sIHsgbGVmdCB9KSA9PiBwYXJzZUZsb2F0KGxlZnQpICsgKHgubWF4IC0geC5taW4pLFxuICAgIC8vIFRyYW5zZm9ybVxuICAgIHg6IChfYmJveCwgeyB0cmFuc2Zvcm0gfSkgPT4gcGFyc2VWYWx1ZUZyb21UcmFuc2Zvcm0odHJhbnNmb3JtLCBcInhcIiksXG4gICAgeTogKF9iYm94LCB7IHRyYW5zZm9ybSB9KSA9PiBwYXJzZVZhbHVlRnJvbVRyYW5zZm9ybSh0cmFuc2Zvcm0sIFwieVwiKSxcbn07XG4vLyBBbGlhcyB0cmFuc2xhdGUgbG9uZ2Zvcm0gbmFtZXNcbnBvc2l0aW9uYWxWYWx1ZXMudHJhbnNsYXRlWCA9IHBvc2l0aW9uYWxWYWx1ZXMueDtcbnBvc2l0aW9uYWxWYWx1ZXMudHJhbnNsYXRlWSA9IHBvc2l0aW9uYWxWYWx1ZXMueTtcblxuZXhwb3J0IHsgaXNOdW1PclB4VHlwZSwgcG9zaXRpb25hbFZhbHVlcywgcmVtb3ZlTm9uVHJhbnNsYXRpb25hbFRyYW5zZm9ybSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dW5pdC1jb252ZXJzaW9uLm1qcy5tYXBcbiIsImltcG9ydCB7IGZpbGxXaWxkY2FyZHMgfSBmcm9tICcuL3V0aWxzL2ZpbGwtd2lsZGNhcmRzLm1qcyc7XG5pbXBvcnQgeyByZW1vdmVOb25UcmFuc2xhdGlvbmFsVHJhbnNmb3JtIH0gZnJvbSAnLi91dGlscy91bml0LWNvbnZlcnNpb24ubWpzJztcbmltcG9ydCB7IGZyYW1lIH0gZnJvbSAnLi4vLi4vZnJhbWVsb29wL2ZyYW1lLm1qcyc7XG5cbmNvbnN0IHRvUmVzb2x2ZSA9IG5ldyBTZXQoKTtcbmxldCBpc1NjaGVkdWxlZCA9IGZhbHNlO1xubGV0IGFueU5lZWRzTWVhc3VyZW1lbnQgPSBmYWxzZTtcbmxldCBpc0ZvcmNlZCA9IGZhbHNlO1xuZnVuY3Rpb24gbWVhc3VyZUFsbEtleWZyYW1lcygpIHtcbiAgICBpZiAoYW55TmVlZHNNZWFzdXJlbWVudCkge1xuICAgICAgICBjb25zdCByZXNvbHZlcnNUb01lYXN1cmUgPSBBcnJheS5mcm9tKHRvUmVzb2x2ZSkuZmlsdGVyKChyZXNvbHZlcikgPT4gcmVzb2x2ZXIubmVlZHNNZWFzdXJlbWVudCk7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRzVG9NZWFzdXJlID0gbmV3IFNldChyZXNvbHZlcnNUb01lYXN1cmUubWFwKChyZXNvbHZlcikgPT4gcmVzb2x2ZXIuZWxlbWVudCkpO1xuICAgICAgICBjb25zdCB0cmFuc2Zvcm1zVG9SZXN0b3JlID0gbmV3IE1hcCgpO1xuICAgICAgICAvKipcbiAgICAgICAgICogV3JpdGUgcGFzc1xuICAgICAgICAgKiBJZiB3ZSdyZSBtZWFzdXJpbmcgZWxlbWVudHMgd2Ugd2FudCB0byByZW1vdmUgYm91bmRpbmcgYm94LWNoYW5naW5nIHRyYW5zZm9ybXMuXG4gICAgICAgICAqL1xuICAgICAgICBlbGVtZW50c1RvTWVhc3VyZS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZW1vdmVkVHJhbnNmb3JtcyA9IHJlbW92ZU5vblRyYW5zbGF0aW9uYWxUcmFuc2Zvcm0oZWxlbWVudCk7XG4gICAgICAgICAgICBpZiAoIXJlbW92ZWRUcmFuc2Zvcm1zLmxlbmd0aClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB0cmFuc2Zvcm1zVG9SZXN0b3JlLnNldChlbGVtZW50LCByZW1vdmVkVHJhbnNmb3Jtcyk7XG4gICAgICAgICAgICBlbGVtZW50LnJlbmRlcigpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gUmVhZFxuICAgICAgICByZXNvbHZlcnNUb01lYXN1cmUuZm9yRWFjaCgocmVzb2x2ZXIpID0+IHJlc29sdmVyLm1lYXN1cmVJbml0aWFsU3RhdGUoKSk7XG4gICAgICAgIC8vIFdyaXRlXG4gICAgICAgIGVsZW1lbnRzVG9NZWFzdXJlLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGVsZW1lbnQucmVuZGVyKCk7XG4gICAgICAgICAgICBjb25zdCByZXN0b3JlID0gdHJhbnNmb3Jtc1RvUmVzdG9yZS5nZXQoZWxlbWVudCk7XG4gICAgICAgICAgICBpZiAocmVzdG9yZSkge1xuICAgICAgICAgICAgICAgIHJlc3RvcmUuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuZ2V0VmFsdWUoa2V5KT8uc2V0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFJlYWRcbiAgICAgICAgcmVzb2x2ZXJzVG9NZWFzdXJlLmZvckVhY2goKHJlc29sdmVyKSA9PiByZXNvbHZlci5tZWFzdXJlRW5kU3RhdGUoKSk7XG4gICAgICAgIC8vIFdyaXRlXG4gICAgICAgIHJlc29sdmVyc1RvTWVhc3VyZS5mb3JFYWNoKChyZXNvbHZlcikgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc29sdmVyLnN1c3BlbmRlZFNjcm9sbFkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCByZXNvbHZlci5zdXNwZW5kZWRTY3JvbGxZKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFueU5lZWRzTWVhc3VyZW1lbnQgPSBmYWxzZTtcbiAgICBpc1NjaGVkdWxlZCA9IGZhbHNlO1xuICAgIHRvUmVzb2x2ZS5mb3JFYWNoKChyZXNvbHZlcikgPT4gcmVzb2x2ZXIuY29tcGxldGUoaXNGb3JjZWQpKTtcbiAgICB0b1Jlc29sdmUuY2xlYXIoKTtcbn1cbmZ1bmN0aW9uIHJlYWRBbGxLZXlmcmFtZXMoKSB7XG4gICAgdG9SZXNvbHZlLmZvckVhY2goKHJlc29sdmVyKSA9PiB7XG4gICAgICAgIHJlc29sdmVyLnJlYWRLZXlmcmFtZXMoKTtcbiAgICAgICAgaWYgKHJlc29sdmVyLm5lZWRzTWVhc3VyZW1lbnQpIHtcbiAgICAgICAgICAgIGFueU5lZWRzTWVhc3VyZW1lbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5mdW5jdGlvbiBmbHVzaEtleWZyYW1lUmVzb2x2ZXJzKCkge1xuICAgIGlzRm9yY2VkID0gdHJ1ZTtcbiAgICByZWFkQWxsS2V5ZnJhbWVzKCk7XG4gICAgbWVhc3VyZUFsbEtleWZyYW1lcygpO1xuICAgIGlzRm9yY2VkID0gZmFsc2U7XG59XG5jbGFzcyBLZXlmcmFtZVJlc29sdmVyIHtcbiAgICBjb25zdHJ1Y3Rvcih1bnJlc29sdmVkS2V5ZnJhbWVzLCBvbkNvbXBsZXRlLCBuYW1lLCBtb3Rpb25WYWx1ZSwgZWxlbWVudCwgaXNBc3luYyA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBcInBlbmRpbmdcIjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRyYWNrIHdoZXRoZXIgdGhpcyByZXNvbHZlciBpcyBhc3luYy4gSWYgaXQgaXMsIGl0J2xsIGJlIGFkZGVkIHRvIHRoZVxuICAgICAgICAgKiByZXNvbHZlciBxdWV1ZSBhbmQgZmx1c2hlZCBpbiB0aGUgbmV4dCBmcmFtZS4gUmVzb2x2ZXJzIHRoYXQgYXJlbid0IGdvaW5nXG4gICAgICAgICAqIHRvIHRyaWdnZXIgcmVhZC93cml0ZSB0aHJhc2hpbmcgZG9uJ3QgbmVlZCB0byBiZSBhc3luYy5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaXNBc3luYyA9IGZhbHNlO1xuICAgICAgICAvKipcbiAgICAgICAgICogVHJhY2sgd2hldGhlciB0aGlzIHJlc29sdmVyIG5lZWRzIHRvIHBlcmZvcm0gYSBtZWFzdXJlbWVudFxuICAgICAgICAgKiB0byByZXNvbHZlIGl0cyBrZXlmcmFtZXMuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm5lZWRzTWVhc3VyZW1lbnQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51bnJlc29sdmVkS2V5ZnJhbWVzID0gWy4uLnVucmVzb2x2ZWRLZXlmcmFtZXNdO1xuICAgICAgICB0aGlzLm9uQ29tcGxldGUgPSBvbkNvbXBsZXRlO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLm1vdGlvblZhbHVlID0gbW90aW9uVmFsdWU7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMuaXNBc3luYyA9IGlzQXN5bmM7XG4gICAgfVxuICAgIHNjaGVkdWxlUmVzb2x2ZSgpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFwic2NoZWR1bGVkXCI7XG4gICAgICAgIGlmICh0aGlzLmlzQXN5bmMpIHtcbiAgICAgICAgICAgIHRvUmVzb2x2ZS5hZGQodGhpcyk7XG4gICAgICAgICAgICBpZiAoIWlzU2NoZWR1bGVkKSB7XG4gICAgICAgICAgICAgICAgaXNTY2hlZHVsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZyYW1lLnJlYWQocmVhZEFsbEtleWZyYW1lcyk7XG4gICAgICAgICAgICAgICAgZnJhbWUucmVzb2x2ZUtleWZyYW1lcyhtZWFzdXJlQWxsS2V5ZnJhbWVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVhZEtleWZyYW1lcygpO1xuICAgICAgICAgICAgdGhpcy5jb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlYWRLZXlmcmFtZXMoKSB7XG4gICAgICAgIGNvbnN0IHsgdW5yZXNvbHZlZEtleWZyYW1lcywgbmFtZSwgZWxlbWVudCwgbW90aW9uVmFsdWUgfSA9IHRoaXM7XG4gICAgICAgIC8vIElmIGluaXRpYWwga2V5ZnJhbWUgaXMgbnVsbCB3ZSBuZWVkIHRvIHJlYWQgaXQgZnJvbSB0aGUgRE9NXG4gICAgICAgIGlmICh1bnJlc29sdmVkS2V5ZnJhbWVzWzBdID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50VmFsdWUgPSBtb3Rpb25WYWx1ZT8uZ2V0KCk7XG4gICAgICAgICAgICAvLyBUT0RPOiBUaGlzIGRvZXNuJ3Qgd29yayBpZiB0aGUgZmluYWwga2V5ZnJhbWUgaXMgYSB3aWxkY2FyZFxuICAgICAgICAgICAgY29uc3QgZmluYWxLZXlmcmFtZSA9IHVucmVzb2x2ZWRLZXlmcmFtZXNbdW5yZXNvbHZlZEtleWZyYW1lcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50VmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHVucmVzb2x2ZWRLZXlmcmFtZXNbMF0gPSBjdXJyZW50VmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChlbGVtZW50ICYmIG5hbWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZUFzUmVhZCA9IGVsZW1lbnQucmVhZFZhbHVlKG5hbWUsIGZpbmFsS2V5ZnJhbWUpO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZUFzUmVhZCAhPT0gdW5kZWZpbmVkICYmIHZhbHVlQXNSZWFkICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHVucmVzb2x2ZWRLZXlmcmFtZXNbMF0gPSB2YWx1ZUFzUmVhZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodW5yZXNvbHZlZEtleWZyYW1lc1swXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdW5yZXNvbHZlZEtleWZyYW1lc1swXSA9IGZpbmFsS2V5ZnJhbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobW90aW9uVmFsdWUgJiYgY3VycmVudFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBtb3Rpb25WYWx1ZS5zZXQodW5yZXNvbHZlZEtleWZyYW1lc1swXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZmlsbFdpbGRjYXJkcyh1bnJlc29sdmVkS2V5ZnJhbWVzKTtcbiAgICB9XG4gICAgc2V0RmluYWxLZXlmcmFtZSgpIHsgfVxuICAgIG1lYXN1cmVJbml0aWFsU3RhdGUoKSB7IH1cbiAgICByZW5kZXJFbmRTdHlsZXMoKSB7IH1cbiAgICBtZWFzdXJlRW5kU3RhdGUoKSB7IH1cbiAgICBjb21wbGV0ZShpc0ZvcmNlZENvbXBsZXRlID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFwiY29tcGxldGVcIjtcbiAgICAgICAgdGhpcy5vbkNvbXBsZXRlKHRoaXMudW5yZXNvbHZlZEtleWZyYW1lcywgdGhpcy5maW5hbEtleWZyYW1lLCBpc0ZvcmNlZENvbXBsZXRlKTtcbiAgICAgICAgdG9SZXNvbHZlLmRlbGV0ZSh0aGlzKTtcbiAgICB9XG4gICAgY2FuY2VsKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gXCJzY2hlZHVsZWRcIikge1xuICAgICAgICAgICAgdG9SZXNvbHZlLmRlbGV0ZSh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBcInBlbmRpbmdcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXN1bWUoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBcInBlbmRpbmdcIilcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVSZXNvbHZlKCk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBLZXlmcmFtZVJlc29sdmVyLCBmbHVzaEtleWZyYW1lUmVzb2x2ZXJzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1LZXlmcmFtZXNSZXNvbHZlci5tanMubWFwXG4iLCJjb25zdCBpc0NTU1ZhciA9IChuYW1lKSA9PiBuYW1lLnN0YXJ0c1dpdGgoXCItLVwiKTtcblxuZXhwb3J0IHsgaXNDU1NWYXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzLWNzcy12YXIubWpzLm1hcFxuIiwiaW1wb3J0IHsgaXNDU1NWYXIgfSBmcm9tICcuL2lzLWNzcy12YXIubWpzJztcblxuZnVuY3Rpb24gc2V0U3R5bGUoZWxlbWVudCwgbmFtZSwgdmFsdWUpIHtcbiAgICBpc0NTU1ZhcihuYW1lKVxuICAgICAgICA/IGVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkobmFtZSwgdmFsdWUpXG4gICAgICAgIDogKGVsZW1lbnQuc3R5bGVbbmFtZV0gPSB2YWx1ZSk7XG59XG5cbmV4cG9ydCB7IHNldFN0eWxlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdHlsZS1zZXQubWpzLm1hcFxuIiwiLyoqXG4gKiBBZGQgdGhlIGFiaWxpdHkgZm9yIHRlc3Qgc3VpdGVzIHRvIG1hbnVhbGx5IHNldCBzdXBwb3J0IGZsYWdzXG4gKiB0byBiZXR0ZXIgdGVzdCBtb3JlIGVudmlyb25tZW50cy5cbiAqL1xuY29uc3Qgc3VwcG9ydHNGbGFncyA9IHt9O1xuXG5leHBvcnQgeyBzdXBwb3J0c0ZsYWdzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mbGFncy5tanMubWFwXG4iLCJpbXBvcnQgeyBtZW1vIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcbmltcG9ydCB7IHN1cHBvcnRzRmxhZ3MgfSBmcm9tICcuL2ZsYWdzLm1qcyc7XG5cbmZ1bmN0aW9uIG1lbW9TdXBwb3J0cyhjYWxsYmFjaywgc3VwcG9ydHNGbGFnKSB7XG4gICAgY29uc3QgbWVtb2l6ZWQgPSBtZW1vKGNhbGxiYWNrKTtcbiAgICByZXR1cm4gKCkgPT4gc3VwcG9ydHNGbGFnc1tzdXBwb3J0c0ZsYWddID8/IG1lbW9pemVkKCk7XG59XG5cbmV4cG9ydCB7IG1lbW9TdXBwb3J0cyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWVtby5tanMubWFwXG4iLCJpbXBvcnQgeyBtZW1vU3VwcG9ydHMgfSBmcm9tICcuL21lbW8ubWpzJztcblxuY29uc3Qgc3VwcG9ydHNTY3JvbGxUaW1lbGluZSA9IC8qIEBfX1BVUkVfXyAqLyBtZW1vU3VwcG9ydHMoKCkgPT4gd2luZG93LlNjcm9sbFRpbWVsaW5lICE9PSB1bmRlZmluZWQsIFwic2Nyb2xsVGltZWxpbmVcIik7XG5jb25zdCBzdXBwb3J0c1ZpZXdUaW1lbGluZSA9IC8qIEBfX1BVUkVfXyAqLyBtZW1vU3VwcG9ydHMoKCkgPT4gd2luZG93LlZpZXdUaW1lbGluZSAhPT0gdW5kZWZpbmVkLCBcInZpZXdUaW1lbGluZVwiKTtcblxuZXhwb3J0IHsgc3VwcG9ydHNTY3JvbGxUaW1lbGluZSwgc3VwcG9ydHNWaWV3VGltZWxpbmUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNjcm9sbC10aW1lbGluZS5tanMubWFwXG4iLCJpbXBvcnQgeyBtZW1vU3VwcG9ydHMgfSBmcm9tICcuL21lbW8ubWpzJztcblxuY29uc3Qgc3VwcG9ydHNMaW5lYXJFYXNpbmcgPSAvKkBfX1BVUkVfXyovIG1lbW9TdXBwb3J0cygoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAgIC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgICAgICAgICAuYW5pbWF0ZSh7IG9wYWNpdHk6IDAgfSwgeyBlYXNpbmc6IFwibGluZWFyKDAsIDEpXCIgfSk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59LCBcImxpbmVhckVhc2luZ1wiKTtcblxuZXhwb3J0IHsgc3VwcG9ydHNMaW5lYXJFYXNpbmcgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpbmVhci1lYXNpbmcubWpzLm1hcFxuIiwiY29uc3QgY3ViaWNCZXppZXJBc1N0cmluZyA9IChbYSwgYiwgYywgZF0pID0+IGBjdWJpYy1iZXppZXIoJHthfSwgJHtifSwgJHtjfSwgJHtkfSlgO1xuXG5leHBvcnQgeyBjdWJpY0JlemllckFzU3RyaW5nIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jdWJpYy1iZXppZXIubWpzLm1hcFxuIiwiaW1wb3J0IHsgY3ViaWNCZXppZXJBc1N0cmluZyB9IGZyb20gJy4vY3ViaWMtYmV6aWVyLm1qcyc7XG5cbmNvbnN0IHN1cHBvcnRlZFdhYXBpRWFzaW5nID0ge1xuICAgIGxpbmVhcjogXCJsaW5lYXJcIixcbiAgICBlYXNlOiBcImVhc2VcIixcbiAgICBlYXNlSW46IFwiZWFzZS1pblwiLFxuICAgIGVhc2VPdXQ6IFwiZWFzZS1vdXRcIixcbiAgICBlYXNlSW5PdXQ6IFwiZWFzZS1pbi1vdXRcIixcbiAgICBjaXJjSW46IC8qQF9fUFVSRV9fKi8gY3ViaWNCZXppZXJBc1N0cmluZyhbMCwgMC42NSwgMC41NSwgMV0pLFxuICAgIGNpcmNPdXQ6IC8qQF9fUFVSRV9fKi8gY3ViaWNCZXppZXJBc1N0cmluZyhbMC41NSwgMCwgMSwgMC40NV0pLFxuICAgIGJhY2tJbjogLypAX19QVVJFX18qLyBjdWJpY0JlemllckFzU3RyaW5nKFswLjMxLCAwLjAxLCAwLjY2LCAtMC41OV0pLFxuICAgIGJhY2tPdXQ6IC8qQF9fUFVSRV9fKi8gY3ViaWNCZXppZXJBc1N0cmluZyhbMC4zMywgMS41MywgMC42OSwgMC45OV0pLFxufTtcblxuZXhwb3J0IHsgc3VwcG9ydGVkV2FhcGlFYXNpbmcgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN1cHBvcnRlZC5tanMubWFwXG4iLCJpbXBvcnQgeyBpc0JlemllckRlZmluaXRpb24gfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgc3VwcG9ydHNMaW5lYXJFYXNpbmcgfSBmcm9tICcuLi8uLi8uLi91dGlscy9zdXBwb3J0cy9saW5lYXItZWFzaW5nLm1qcyc7XG5pbXBvcnQgeyBnZW5lcmF0ZUxpbmVhckVhc2luZyB9IGZyb20gJy4uL3V0aWxzL2xpbmVhci5tanMnO1xuaW1wb3J0IHsgY3ViaWNCZXppZXJBc1N0cmluZyB9IGZyb20gJy4vY3ViaWMtYmV6aWVyLm1qcyc7XG5pbXBvcnQgeyBzdXBwb3J0ZWRXYWFwaUVhc2luZyB9IGZyb20gJy4vc3VwcG9ydGVkLm1qcyc7XG5cbmZ1bmN0aW9uIG1hcEVhc2luZ1RvTmF0aXZlRWFzaW5nKGVhc2luZywgZHVyYXRpb24pIHtcbiAgICBpZiAoIWVhc2luZykge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgZWFzaW5nID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIHN1cHBvcnRzTGluZWFyRWFzaW5nKClcbiAgICAgICAgICAgID8gZ2VuZXJhdGVMaW5lYXJFYXNpbmcoZWFzaW5nLCBkdXJhdGlvbilcbiAgICAgICAgICAgIDogXCJlYXNlLW91dFwiO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc0JlemllckRlZmluaXRpb24oZWFzaW5nKSkge1xuICAgICAgICByZXR1cm4gY3ViaWNCZXppZXJBc1N0cmluZyhlYXNpbmcpO1xuICAgIH1cbiAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGVhc2luZykpIHtcbiAgICAgICAgcmV0dXJuIGVhc2luZy5tYXAoKHNlZ21lbnRFYXNpbmcpID0+IG1hcEVhc2luZ1RvTmF0aXZlRWFzaW5nKHNlZ21lbnRFYXNpbmcsIGR1cmF0aW9uKSB8fFxuICAgICAgICAgICAgc3VwcG9ydGVkV2FhcGlFYXNpbmcuZWFzZU91dCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gc3VwcG9ydGVkV2FhcGlFYXNpbmdbZWFzaW5nXTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IG1hcEVhc2luZ1RvTmF0aXZlRWFzaW5nIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXAtZWFzaW5nLm1qcy5tYXBcbiIsImltcG9ydCB7IGFjdGl2ZUFuaW1hdGlvbnMgfSBmcm9tICcuLi8uLi9zdGF0cy9hbmltYXRpb24tY291bnQubWpzJztcbmltcG9ydCB7IHN0YXRzQnVmZmVyIH0gZnJvbSAnLi4vLi4vc3RhdHMvYnVmZmVyLm1qcyc7XG5pbXBvcnQgeyBtYXBFYXNpbmdUb05hdGl2ZUVhc2luZyB9IGZyb20gJy4vZWFzaW5nL21hcC1lYXNpbmcubWpzJztcblxuZnVuY3Rpb24gc3RhcnRXYWFwaUFuaW1hdGlvbihlbGVtZW50LCB2YWx1ZU5hbWUsIGtleWZyYW1lcywgeyBkZWxheSA9IDAsIGR1cmF0aW9uID0gMzAwLCByZXBlYXQgPSAwLCByZXBlYXRUeXBlID0gXCJsb29wXCIsIGVhc2UgPSBcImVhc2VPdXRcIiwgdGltZXMsIH0gPSB7fSwgcHNldWRvRWxlbWVudCA9IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGtleWZyYW1lT3B0aW9ucyA9IHtcbiAgICAgICAgW3ZhbHVlTmFtZV06IGtleWZyYW1lcyxcbiAgICB9O1xuICAgIGlmICh0aW1lcylcbiAgICAgICAga2V5ZnJhbWVPcHRpb25zLm9mZnNldCA9IHRpbWVzO1xuICAgIGNvbnN0IGVhc2luZyA9IG1hcEVhc2luZ1RvTmF0aXZlRWFzaW5nKGVhc2UsIGR1cmF0aW9uKTtcbiAgICAvKipcbiAgICAgKiBJZiB0aGlzIGlzIGFuIGVhc2luZyBhcnJheSwgYXBwbHkgdG8ga2V5ZnJhbWVzLCBub3QgYW5pbWF0aW9uIGFzIGEgd2hvbGVcbiAgICAgKi9cbiAgICBpZiAoQXJyYXkuaXNBcnJheShlYXNpbmcpKVxuICAgICAgICBrZXlmcmFtZU9wdGlvbnMuZWFzaW5nID0gZWFzaW5nO1xuICAgIGlmIChzdGF0c0J1ZmZlci52YWx1ZSkge1xuICAgICAgICBhY3RpdmVBbmltYXRpb25zLndhYXBpKys7XG4gICAgfVxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgIGRlbGF5LFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgZWFzaW5nOiAhQXJyYXkuaXNBcnJheShlYXNpbmcpID8gZWFzaW5nIDogXCJsaW5lYXJcIixcbiAgICAgICAgZmlsbDogXCJib3RoXCIsXG4gICAgICAgIGl0ZXJhdGlvbnM6IHJlcGVhdCArIDEsXG4gICAgICAgIGRpcmVjdGlvbjogcmVwZWF0VHlwZSA9PT0gXCJyZXZlcnNlXCIgPyBcImFsdGVybmF0ZVwiIDogXCJub3JtYWxcIixcbiAgICB9O1xuICAgIGlmIChwc2V1ZG9FbGVtZW50KVxuICAgICAgICBvcHRpb25zLnBzZXVkb0VsZW1lbnQgPSBwc2V1ZG9FbGVtZW50O1xuICAgIGNvbnN0IGFuaW1hdGlvbiA9IGVsZW1lbnQuYW5pbWF0ZShrZXlmcmFtZU9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIGlmIChzdGF0c0J1ZmZlci52YWx1ZSkge1xuICAgICAgICBhbmltYXRpb24uZmluaXNoZWQuZmluYWxseSgoKSA9PiB7XG4gICAgICAgICAgICBhY3RpdmVBbmltYXRpb25zLndhYXBpLS07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYW5pbWF0aW9uO1xufVxuXG5leHBvcnQgeyBzdGFydFdhYXBpQW5pbWF0aW9uIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdGFydC13YWFwaS1hbmltYXRpb24ubWpzLm1hcFxuIiwiZnVuY3Rpb24gaXNHZW5lcmF0b3IodHlwZSkge1xuICAgIHJldHVybiB0eXBlb2YgdHlwZSA9PT0gXCJmdW5jdGlvblwiICYmIFwiYXBwbHlUb09wdGlvbnNcIiBpbiB0eXBlO1xufVxuXG5leHBvcnQgeyBpc0dlbmVyYXRvciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtZ2VuZXJhdG9yLm1qcy5tYXBcbiIsImltcG9ydCB7IHN1cHBvcnRzTGluZWFyRWFzaW5nIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvc3VwcG9ydHMvbGluZWFyLWVhc2luZy5tanMnO1xuaW1wb3J0IHsgaXNHZW5lcmF0b3IgfSBmcm9tICcuLi8uLi9nZW5lcmF0b3JzL3V0aWxzL2lzLWdlbmVyYXRvci5tanMnO1xuXG5mdW5jdGlvbiBhcHBseUdlbmVyYXRvck9wdGlvbnMoeyB0eXBlLCAuLi5vcHRpb25zIH0pIHtcbiAgICBpZiAoaXNHZW5lcmF0b3IodHlwZSkgJiYgc3VwcG9ydHNMaW5lYXJFYXNpbmcoKSkge1xuICAgICAgICByZXR1cm4gdHlwZS5hcHBseVRvT3B0aW9ucyhvcHRpb25zKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIG9wdGlvbnMuZHVyYXRpb24gPz8gKG9wdGlvbnMuZHVyYXRpb24gPSAzMDApO1xuICAgICAgICBvcHRpb25zLmVhc2UgPz8gKG9wdGlvbnMuZWFzZSA9IFwiZWFzZU91dFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbmV4cG9ydCB7IGFwcGx5R2VuZXJhdG9yT3B0aW9ucyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwbHktZ2VuZXJhdG9yLm1qcy5tYXBcbiIsImltcG9ydCB7IGludmFyaWFudCwgbWlsbGlzZWNvbmRzVG9TZWNvbmRzLCBzZWNvbmRzVG9NaWxsaXNlY29uZHMsIG5vb3AgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgc2V0U3R5bGUgfSBmcm9tICcuLi9yZW5kZXIvZG9tL3N0eWxlLXNldC5tanMnO1xuaW1wb3J0IHsgc3VwcG9ydHNTY3JvbGxUaW1lbGluZSB9IGZyb20gJy4uL3V0aWxzL3N1cHBvcnRzL3Njcm9sbC10aW1lbGluZS5tanMnO1xuaW1wb3J0IHsgZ2V0RmluYWxLZXlmcmFtZSB9IGZyb20gJy4va2V5ZnJhbWVzL2dldC1maW5hbC5tanMnO1xuaW1wb3J0IHsgV2l0aFByb21pc2UgfSBmcm9tICcuL3V0aWxzL1dpdGhQcm9taXNlLm1qcyc7XG5pbXBvcnQgeyBzdGFydFdhYXBpQW5pbWF0aW9uIH0gZnJvbSAnLi93YWFwaS9zdGFydC13YWFwaS1hbmltYXRpb24ubWpzJztcbmltcG9ydCB7IGFwcGx5R2VuZXJhdG9yT3B0aW9ucyB9IGZyb20gJy4vd2FhcGkvdXRpbHMvYXBwbHktZ2VuZXJhdG9yLm1qcyc7XG5cbi8qKlxuICogTmF0aXZlQW5pbWF0aW9uIGltcGxlbWVudHMgQW5pbWF0aW9uUGxheWJhY2tDb250cm9scyBmb3IgdGhlIGJyb3dzZXIncyBXZWIgQW5pbWF0aW9ucyBBUEkuXG4gKi9cbmNsYXNzIE5hdGl2ZUFuaW1hdGlvbiBleHRlbmRzIFdpdGhQcm9taXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZmluaXNoZWRUaW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSBmYWxzZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRyYWNrcyBhIG1hbnVhbGx5LXNldCBzdGFydCB0aW1lIHRoYXQgdGFrZXMgcHJlY2VkZW5jZSBvdmVyIFdBQVBJJ3NcbiAgICAgICAgICogZHluYW1pYyBzdGFydFRpbWUuIFRoaXMgaXMgY2xlYXJlZCB3aGVuIHBsYXkoKSBvciB0aW1lIHNldHRlciBpcyBjYWxsZWQsXG4gICAgICAgICAqIGFsbG93aW5nIFdBQVBJIHRvIHRha2Ugb3ZlciB0aW1pbmcuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm1hbnVhbFN0YXJ0VGltZSA9IG51bGw7XG4gICAgICAgIGlmICghb3B0aW9ucylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgeyBlbGVtZW50LCBuYW1lLCBrZXlmcmFtZXMsIHBzZXVkb0VsZW1lbnQsIGFsbG93RmxhdHRlbiA9IGZhbHNlLCBmaW5hbEtleWZyYW1lLCBvbkNvbXBsZXRlLCB9ID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5pc1BzZXVkb0VsZW1lbnQgPSBCb29sZWFuKHBzZXVkb0VsZW1lbnQpO1xuICAgICAgICB0aGlzLmFsbG93RmxhdHRlbiA9IGFsbG93RmxhdHRlbjtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgaW52YXJpYW50KHR5cGVvZiBvcHRpb25zLnR5cGUgIT09IFwic3RyaW5nXCIsIGBNaW5pIGFuaW1hdGUoKSBkb2Vzbid0IHN1cHBvcnQgXCJ0eXBlXCIgYXMgYSBzdHJpbmcuYCwgXCJtaW5pLXNwcmluZ1wiKTtcbiAgICAgICAgY29uc3QgdHJhbnNpdGlvbiA9IGFwcGx5R2VuZXJhdG9yT3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgdGhpcy5hbmltYXRpb24gPSBzdGFydFdhYXBpQW5pbWF0aW9uKGVsZW1lbnQsIG5hbWUsIGtleWZyYW1lcywgdHJhbnNpdGlvbiwgcHNldWRvRWxlbWVudCk7XG4gICAgICAgIGlmICh0cmFuc2l0aW9uLmF1dG9wbGF5ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24ucGF1c2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFuaW1hdGlvbi5vbmZpbmlzaCA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoZWRUaW1lID0gdGhpcy50aW1lO1xuICAgICAgICAgICAgaWYgKCFwc2V1ZG9FbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ZnJhbWUgPSBnZXRGaW5hbEtleWZyYW1lKGtleWZyYW1lcywgdGhpcy5vcHRpb25zLCBmaW5hbEtleWZyYW1lLCB0aGlzLnNwZWVkKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy51cGRhdGVNb3Rpb25WYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU1vdGlvblZhbHVlKGtleWZyYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgd2UgY2FuLCB3ZSB3YW50IHRvIGNvbW1pdCB0aGUgZmluYWwgc3R5bGUgYXMgc2V0IGJ5IHRoZSB1c2VyLFxuICAgICAgICAgICAgICAgICAqIHJhdGhlciB0aGFuIHRoZSBjb21wdXRlZCBrZXlmcmFtZSB2YWx1ZSBzdXBwbGllZCBieSB0aGUgYW5pbWF0aW9uLlxuICAgICAgICAgICAgICAgICAqIFdlIGFsd2F5cyBkbyB0aGlzLCBldmVuIHdoZW4gYSBtb3Rpb24gdmFsdWUgaXMgcHJlc2VudCwgdG8gcHJldmVudFxuICAgICAgICAgICAgICAgICAqIGEgdmlzdWFsIGZsYXNoIGluIEZpcmVmb3ggd2hlcmUgdGhlIFdBQVBJIGFuaW1hdGlvbidzIGZpbGwgaXMgcmVtb3ZlZFxuICAgICAgICAgICAgICAgICAqIGR1cmluZyBjYW5jZWwoKSBiZWZvcmUgdGhlIHNjaGVkdWxlZCByZW5kZXIgY2FuIGFwcGx5IHRoZSBjb3JyZWN0IHZhbHVlLlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHNldFN0eWxlKGVsZW1lbnQsIG5hbWUsIGtleWZyYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5jYW5jZWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9uQ29tcGxldGU/LigpO1xuICAgICAgICAgICAgdGhpcy5ub3RpZnlGaW5pc2hlZCgpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBwbGF5KCkge1xuICAgICAgICBpZiAodGhpcy5pc1N0b3BwZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMubWFudWFsU3RhcnRUaW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpb24ucGxheSgpO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gXCJmaW5pc2hlZFwiKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZpbmlzaGVkKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcGF1c2UoKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uLnBhdXNlKCk7XG4gICAgfVxuICAgIGNvbXBsZXRlKCkge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbi5maW5pc2g/LigpO1xuICAgIH1cbiAgICBjYW5jZWwoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5jYW5jZWwoKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkgeyB9XG4gICAgfVxuICAgIHN0b3AoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU3RvcHBlZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgICAgICBjb25zdCB7IHN0YXRlIH0gPSB0aGlzO1xuICAgICAgICBpZiAoc3RhdGUgPT09IFwiaWRsZVwiIHx8IHN0YXRlID09PSBcImZpbmlzaGVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy51cGRhdGVNb3Rpb25WYWx1ZSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVNb3Rpb25WYWx1ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb21taXRTdHlsZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuaXNQc2V1ZG9FbGVtZW50KVxuICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogV0FBUEkgZG9lc24ndCBuYXRpdmVseSBoYXZlIGFueSBpbnRlcnJ1cHRpb24gY2FwYWJpbGl0aWVzLlxuICAgICAqXG4gICAgICogSW4gdGhpcyBtZXRob2QsIHdlIGNvbW1pdCBzdHlsZXMgYmFjayB0byB0aGUgRE9NIGJlZm9yZSBjYW5jZWxsaW5nXG4gICAgICogdGhlIGFuaW1hdGlvbi5cbiAgICAgKlxuICAgICAqIFRoaXMgaXMgZGVzaWduZWQgdG8gYmUgb3ZlcnJpZGRlbiBieSBOYXRpdmVBbmltYXRpb25FeHRlbmRlZCwgd2hpY2hcbiAgICAgKiB3aWxsIGNyZWF0ZSBhIHJlbmRlcmxlc3MgSlMgYW5pbWF0aW9uIGFuZCBzYW1wbGUgaXQgdHdpY2UgdG8gY2FsY3VsYXRlXG4gICAgICogaXRzIGN1cnJlbnQgdmFsdWUsIFwicHJldmlvdXNcIiB2YWx1ZSwgYW5kIHRoZXJlZm9yZSBhbGxvd1xuICAgICAqIE1vdGlvbiB0byBhbHNvIGNvcnJlY3RseSBjYWxjdWxhdGUgdmVsb2NpdHkgZm9yIGFueSBzdWJzZXF1ZW50IGFuaW1hdGlvblxuICAgICAqIHdoaWxlIGRlZmVycmluZyB0aGUgY29tbWl0IHVudGlsIHRoZSBuZXh0IGFuaW1hdGlvbiBmcmFtZS5cbiAgICAgKi9cbiAgICBjb21taXRTdHlsZXMoKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLm9wdGlvbnM/LmVsZW1lbnQ7XG4gICAgICAgIGlmICghdGhpcy5pc1BzZXVkb0VsZW1lbnQgJiYgZWxlbWVudD8uaXNDb25uZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLmNvbW1pdFN0eWxlcz8uKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IGR1cmF0aW9uKCkge1xuICAgICAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMuYW5pbWF0aW9uLmVmZmVjdD8uZ2V0Q29tcHV0ZWRUaW1pbmc/LigpLmR1cmF0aW9uIHx8IDA7XG4gICAgICAgIHJldHVybiBtaWxsaXNlY29uZHNUb1NlY29uZHMoTnVtYmVyKGR1cmF0aW9uKSk7XG4gICAgfVxuICAgIGdldCBpdGVyYXRpb25EdXJhdGlvbigpIHtcbiAgICAgICAgY29uc3QgeyBkZWxheSA9IDAgfSA9IHRoaXMub3B0aW9ucyB8fCB7fTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZHVyYXRpb24gKyBtaWxsaXNlY29uZHNUb1NlY29uZHMoZGVsYXkpO1xuICAgIH1cbiAgICBnZXQgdGltZSgpIHtcbiAgICAgICAgcmV0dXJuIG1pbGxpc2Vjb25kc1RvU2Vjb25kcyhOdW1iZXIodGhpcy5hbmltYXRpb24uY3VycmVudFRpbWUpIHx8IDApO1xuICAgIH1cbiAgICBzZXQgdGltZShuZXdUaW1lKSB7XG4gICAgICAgIGNvbnN0IHdhc0ZpbmlzaGVkID0gdGhpcy5maW5pc2hlZFRpbWUgIT09IG51bGw7XG4gICAgICAgIHRoaXMubWFudWFsU3RhcnRUaW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5maW5pc2hlZFRpbWUgPSBudWxsO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbi5jdXJyZW50VGltZSA9IHNlY29uZHNUb01pbGxpc2Vjb25kcyhuZXdUaW1lKTtcbiAgICAgICAgaWYgKHdhc0ZpbmlzaGVkKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5wYXVzZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBwbGF5YmFjayBzcGVlZCBvZiB0aGUgYW5pbWF0aW9uLlxuICAgICAqIDEgPSBub3JtYWwgc3BlZWQsIDIgPSBkb3VibGUgc3BlZWQsIDAuNSA9IGhhbGYgc3BlZWQuXG4gICAgICovXG4gICAgZ2V0IHNwZWVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbmltYXRpb24ucGxheWJhY2tSYXRlO1xuICAgIH1cbiAgICBzZXQgc3BlZWQobmV3U3BlZWQpIHtcbiAgICAgICAgLy8gQWxsb3cgYmFja3dhcmRzIHBsYXliYWNrIGFmdGVyIGZpbmlzaGluZ1xuICAgICAgICBpZiAobmV3U3BlZWQgPCAwKVxuICAgICAgICAgICAgdGhpcy5maW5pc2hlZFRpbWUgPSBudWxsO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbi5wbGF5YmFja1JhdGUgPSBuZXdTcGVlZDtcbiAgICB9XG4gICAgZ2V0IHN0YXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5maW5pc2hlZFRpbWUgIT09IG51bGxcbiAgICAgICAgICAgID8gXCJmaW5pc2hlZFwiXG4gICAgICAgICAgICA6IHRoaXMuYW5pbWF0aW9uLnBsYXlTdGF0ZTtcbiAgICB9XG4gICAgZ2V0IHN0YXJ0VGltZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFudWFsU3RhcnRUaW1lID8/IE51bWJlcih0aGlzLmFuaW1hdGlvbi5zdGFydFRpbWUpO1xuICAgIH1cbiAgICBzZXQgc3RhcnRUaW1lKG5ld1N0YXJ0VGltZSkge1xuICAgICAgICB0aGlzLm1hbnVhbFN0YXJ0VGltZSA9IHRoaXMuYW5pbWF0aW9uLnN0YXJ0VGltZSA9IG5ld1N0YXJ0VGltZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXR0YWNoZXMgYSB0aW1lbGluZSB0byB0aGUgYW5pbWF0aW9uLCBmb3IgaW5zdGFuY2UgdGhlIGBTY3JvbGxUaW1lbGluZWAuXG4gICAgICovXG4gICAgYXR0YWNoVGltZWxpbmUoeyB0aW1lbGluZSwgcmFuZ2VTdGFydCwgcmFuZ2VFbmQsIG9ic2VydmUsIH0pIHtcbiAgICAgICAgaWYgKHRoaXMuYWxsb3dGbGF0dGVuKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5lZmZlY3Q/LnVwZGF0ZVRpbWluZyh7IGVhc2luZzogXCJsaW5lYXJcIiB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFuaW1hdGlvbi5vbmZpbmlzaCA9IG51bGw7XG4gICAgICAgIGlmICh0aW1lbGluZSAmJiBzdXBwb3J0c1Njcm9sbFRpbWVsaW5lKCkpIHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLnRpbWVsaW5lID0gdGltZWxpbmU7XG4gICAgICAgICAgICBpZiAocmFuZ2VTdGFydClcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5yYW5nZVN0YXJ0ID0gcmFuZ2VTdGFydDtcbiAgICAgICAgICAgIGlmIChyYW5nZUVuZClcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5yYW5nZUVuZCA9IHJhbmdlRW5kO1xuICAgICAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gb2JzZXJ2ZSh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHsgTmF0aXZlQW5pbWF0aW9uIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1OYXRpdmVBbmltYXRpb24ubWpzLm1hcFxuIiwiaW1wb3J0IHsgY2lyY0luT3V0LCBiYWNrSW5PdXQsIGFudGljaXBhdGUgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuXG5jb25zdCB1bnN1cHBvcnRlZEVhc2luZ0Z1bmN0aW9ucyA9IHtcbiAgICBhbnRpY2lwYXRlLFxuICAgIGJhY2tJbk91dCxcbiAgICBjaXJjSW5PdXQsXG59O1xuZnVuY3Rpb24gaXNVbnN1cHBvcnRlZEVhc2Uoa2V5KSB7XG4gICAgcmV0dXJuIGtleSBpbiB1bnN1cHBvcnRlZEVhc2luZ0Z1bmN0aW9ucztcbn1cbmZ1bmN0aW9uIHJlcGxhY2VTdHJpbmdFYXNpbmcodHJhbnNpdGlvbikge1xuICAgIGlmICh0eXBlb2YgdHJhbnNpdGlvbi5lYXNlID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgIGlzVW5zdXBwb3J0ZWRFYXNlKHRyYW5zaXRpb24uZWFzZSkpIHtcbiAgICAgICAgdHJhbnNpdGlvbi5lYXNlID0gdW5zdXBwb3J0ZWRFYXNpbmdGdW5jdGlvbnNbdHJhbnNpdGlvbi5lYXNlXTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IHJlcGxhY2VTdHJpbmdFYXNpbmcgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXVuc3VwcG9ydGVkLWVhc2luZy5tanMubWFwXG4iLCJpbXBvcnQgeyBjbGFtcCB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyB0aW1lIH0gZnJvbSAnLi4vZnJhbWVsb29wL3N5bmMtdGltZS5tanMnO1xuaW1wb3J0IHsgc2V0U3R5bGUgfSBmcm9tICcuLi9yZW5kZXIvZG9tL3N0eWxlLXNldC5tanMnO1xuaW1wb3J0IHsgSlNBbmltYXRpb24gfSBmcm9tICcuL0pTQW5pbWF0aW9uLm1qcyc7XG5pbXBvcnQgeyBOYXRpdmVBbmltYXRpb24gfSBmcm9tICcuL05hdGl2ZUFuaW1hdGlvbi5tanMnO1xuaW1wb3J0IHsgcmVwbGFjZVRyYW5zaXRpb25UeXBlIH0gZnJvbSAnLi91dGlscy9yZXBsYWNlLXRyYW5zaXRpb24tdHlwZS5tanMnO1xuaW1wb3J0IHsgcmVwbGFjZVN0cmluZ0Vhc2luZyB9IGZyb20gJy4vd2FhcGkvdXRpbHMvdW5zdXBwb3J0ZWQtZWFzaW5nLm1qcyc7XG5cbi8qKlxuICogMTBtcyBpcyBjaG9zZW4gaGVyZSBhcyBpdCBzdHJpa2VzIGEgYmFsYW5jZSBiZXR3ZWVuIHNtb290aFxuICogcmVzdWx0cyAobW9yZSB0aGFuIG9uZSBrZXlmcmFtZSBwZXIgZnJhbWUgYXQgNjBmcHMpIGFuZFxuICoga2V5ZnJhbWUgcXVhbnRpdHkuXG4gKi9cbmNvbnN0IHNhbXBsZURlbHRhID0gMTA7IC8vbXNcbmNsYXNzIE5hdGl2ZUFuaW1hdGlvbkV4dGVuZGVkIGV4dGVuZHMgTmF0aXZlQW5pbWF0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgYmFzZSBOYXRpdmVBbmltYXRpb24gZnVuY3Rpb24gb25seSBzdXBwb3J0cyBhIHN1YnNldFxuICAgICAgICAgKiBvZiBNb3Rpb24gZWFzaW5ncywgYW5kIFdBQVBJIGFsc28gb25seSBzdXBwb3J0cyBzb21lXG4gICAgICAgICAqIGVhc2luZyBmdW5jdGlvbnMgdmlhIHN0cmluZy9jdWJpYy1iZXppZXIgZGVmaW5pdGlvbnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgZnVuY3Rpb24gcmVwbGFjZXMgdGhvc2UgdW5zdXBwb3J0ZWQgZWFzaW5nIGZ1bmN0aW9uc1xuICAgICAgICAgKiB3aXRoIGEgSlMgZWFzaW5nIGZ1bmN0aW9uLiBUaGlzIHdpbGwgbGF0ZXIgZ2V0IGNvbXBpbGVkXG4gICAgICAgICAqIHRvIGEgbGluZWFyKCkgZWFzaW5nIGZ1bmN0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgcmVwbGFjZVN0cmluZ0Vhc2luZyhvcHRpb25zKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVuc3VyZSB3ZSByZXBsYWNlIHRoZSB0cmFuc2l0aW9uIHR5cGUgd2l0aCBhIGdlbmVyYXRvciBmdW5jdGlvblxuICAgICAgICAgKiBiZWZvcmUgcGFzc2luZyB0byBXQUFQSS5cbiAgICAgICAgICpcbiAgICAgICAgICogVE9ETzogRG9lcyB0aGlzIGhhdmUgYSBiZXR0ZXIgaG9tZT8gSXQgY291bGQgYmUgc2hhcmVkIHdpdGhcbiAgICAgICAgICogSlNBbmltYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICByZXBsYWNlVHJhbnNpdGlvblR5cGUob3B0aW9ucyk7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgICAgICAvKipcbiAgICAgICAgICogT25seSBzZXQgc3RhcnRUaW1lIHdoZW4gdGhlIGFuaW1hdGlvbiBzaG91bGQgYXV0b3BsYXkuXG4gICAgICAgICAqIFNldHRpbmcgc3RhcnRUaW1lIG9uIGEgcGF1c2VkIFdBQVBJIGFuaW1hdGlvbiB1bnBhdXNlcyBpdFxuICAgICAgICAgKiAocGVyIHRoZSBXQUFQSSBzcGVjKSwgd2hpY2ggYnJlYWtzIGF1dG9wbGF5OiBmYWxzZS5cbiAgICAgICAgICovXG4gICAgICAgIGlmIChvcHRpb25zLnN0YXJ0VGltZSAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuYXV0b3BsYXkgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IG9wdGlvbnMuc3RhcnRUaW1lO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFdBQVBJIGRvZXNuJ3QgbmF0aXZlbHkgaGF2ZSBhbnkgaW50ZXJydXB0aW9uIGNhcGFiaWxpdGllcy5cbiAgICAgKlxuICAgICAqIFJhdGhlciB0aGFuIHJlYWQgY29tbWl0dGVkIHN0eWxlcyBiYWNrIG91dCBvZiB0aGUgRE9NLCB3ZSBjYW5cbiAgICAgKiBjcmVhdGUgYSByZW5kZXJsZXNzIEpTIGFuaW1hdGlvbiBhbmQgc2FtcGxlIGl0IHR3aWNlIHRvIGNhbGN1bGF0ZVxuICAgICAqIGl0cyBjdXJyZW50IHZhbHVlLCBcInByZXZpb3VzXCIgdmFsdWUsIGFuZCB0aGVyZWZvcmUgYWxsb3dcbiAgICAgKiBNb3Rpb24gdG8gY2FsY3VsYXRlIHZlbG9jaXR5IGZvciBhbnkgc3Vic2VxdWVudCBhbmltYXRpb24uXG4gICAgICovXG4gICAgdXBkYXRlTW90aW9uVmFsdWUodmFsdWUpIHtcbiAgICAgICAgY29uc3QgeyBtb3Rpb25WYWx1ZSwgb25VcGRhdGUsIG9uQ29tcGxldGUsIGVsZW1lbnQsIC4uLm9wdGlvbnMgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgaWYgKCFtb3Rpb25WYWx1ZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG1vdGlvblZhbHVlLnNldCh2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2FtcGxlQW5pbWF0aW9uID0gbmV3IEpTQW5pbWF0aW9uKHtcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICBhdXRvcGxheTogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgICAgICAvKipcbiAgICAgICAgICogVXNlIHdhbGwtY2xvY2sgZWxhcHNlZCB0aW1lIGZvciBzYW1wbGluZy5cbiAgICAgICAgICogVW5kZXIgQ1BVIGxvYWQsIFdBQVBJJ3MgY3VycmVudFRpbWUgbWF5IG5vdCByZWZsZWN0IGFjdHVhbFxuICAgICAgICAgKiBlbGFwc2VkIHRpbWUsIGNhdXNpbmcgaW5jb3JyZWN0IHNhbXBsaW5nIGFuZCB2aXN1YWwganVtcHMuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBzYW1wbGVUaW1lID0gTWF0aC5tYXgoc2FtcGxlRGVsdGEsIHRpbWUubm93KCkgLSB0aGlzLnN0YXJ0VGltZSk7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gY2xhbXAoMCwgc2FtcGxlRGVsdGEsIHNhbXBsZVRpbWUgLSBzYW1wbGVEZWx0YSk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBzYW1wbGVBbmltYXRpb24uc2FtcGxlKHNhbXBsZVRpbWUpLnZhbHVlO1xuICAgICAgICAvKipcbiAgICAgICAgICogV3JpdGUgdGhlIGVzdGltYXRlZCB2YWx1ZSB0byBpbmxpbmUgc3R5bGUgc28gaXQgcGVyc2lzdHNcbiAgICAgICAgICogYWZ0ZXIgY2FuY2VsKCksIGNvdmVyaW5nIHRoZSBhc3luYyBnYXAgYmVmb3JlIHRoZSBuZXh0XG4gICAgICAgICAqIGFuaW1hdGlvbiBzdGFydHMuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCB7IG5hbWUgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgaWYgKGVsZW1lbnQgJiYgbmFtZSlcbiAgICAgICAgICAgIHNldFN0eWxlKGVsZW1lbnQsIG5hbWUsIGN1cnJlbnQpO1xuICAgICAgICBtb3Rpb25WYWx1ZS5zZXRXaXRoVmVsb2NpdHkoc2FtcGxlQW5pbWF0aW9uLnNhbXBsZShNYXRoLm1heCgwLCBzYW1wbGVUaW1lIC0gZGVsdGEpKS52YWx1ZSwgY3VycmVudCwgZGVsdGEpO1xuICAgICAgICBzYW1wbGVBbmltYXRpb24uc3RvcCgpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgTmF0aXZlQW5pbWF0aW9uRXh0ZW5kZWQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU5hdGl2ZUFuaW1hdGlvbkV4dGVuZGVkLm1qcy5tYXBcbiIsImltcG9ydCB7IGNvbXBsZXggfSBmcm9tICcuLi8uLi92YWx1ZS90eXBlcy9jb21wbGV4L2luZGV4Lm1qcyc7XG5cbi8qKlxuICogQ2hlY2sgaWYgYSB2YWx1ZSBpcyBhbmltYXRhYmxlLiBFeGFtcGxlczpcbiAqXG4gKiDinIU6IDEwMCwgXCIxMDBweFwiLCBcIiNmZmZcIlxuICog4p2MOiBcImJsb2NrXCIsIFwidXJsKDIuanBnKVwiXG4gKiBAcGFyYW0gdmFsdWVcbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuY29uc3QgaXNBbmltYXRhYmxlID0gKHZhbHVlLCBuYW1lKSA9PiB7XG4gICAgLy8gSWYgdGhlIGxpc3Qgb2Yga2V5cyB0aGF0IG1pZ2h0IGJlIG5vbi1hbmltYXRhYmxlIGdyb3dzLCByZXBsYWNlIHdpdGggU2V0XG4gICAgaWYgKG5hbWUgPT09IFwiekluZGV4XCIpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAvLyBJZiBpdCdzIGEgbnVtYmVyIG9yIGEga2V5ZnJhbWVzIGFycmF5LCB3ZSBjYW4gYW5pbWF0ZSBpdC4gV2UgbWlnaHQgYXQgc29tZSBwb2ludFxuICAgIC8vIG5lZWQgdG8gZG8gYSBkZWVwIGlzQW5pbWF0YWJsZSBjaGVjayBvZiBrZXlmcmFtZXMsIG9yIGxldCBQb3Btb3Rpb24gaGFuZGxlIHRoaXMsXG4gICAgLy8gYnV0IGZvciBub3cgbGV0cyBsZWF2ZSBpdCBsaWtlIHRoaXMgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnNcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiIHx8IEFycmF5LmlzQXJyYXkodmFsdWUpKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmIC8vIEl0J3MgYW5pbWF0YWJsZSBpZiB3ZSBoYXZlIGEgc3RyaW5nXG4gICAgICAgIChjb21wbGV4LnRlc3QodmFsdWUpIHx8IHZhbHVlID09PSBcIjBcIikgJiYgLy8gQW5kIGl0IGNvbnRhaW5zIG51bWJlcnMgYW5kL29yIGNvbG9yc1xuICAgICAgICAhdmFsdWUuc3RhcnRzV2l0aChcInVybChcIikgLy8gVW5sZXNzIGl0IHN0YXJ0cyB3aXRoIFwidXJsKFwiXG4gICAgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnQgeyBpc0FuaW1hdGFibGUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzLWFuaW1hdGFibGUubWpzLm1hcFxuIiwiaW1wb3J0IHsgd2FybmluZyB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBpc0dlbmVyYXRvciB9IGZyb20gJy4uL2dlbmVyYXRvcnMvdXRpbHMvaXMtZ2VuZXJhdG9yLm1qcyc7XG5pbXBvcnQgeyBpc0FuaW1hdGFibGUgfSBmcm9tICcuL2lzLWFuaW1hdGFibGUubWpzJztcblxuZnVuY3Rpb24gaGFzS2V5ZnJhbWVzQ2hhbmdlZChrZXlmcmFtZXMpIHtcbiAgICBjb25zdCBjdXJyZW50ID0ga2V5ZnJhbWVzWzBdO1xuICAgIGlmIChrZXlmcmFtZXMubGVuZ3RoID09PSAxKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleWZyYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoa2V5ZnJhbWVzW2ldICE9PSBjdXJyZW50KVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuZnVuY3Rpb24gY2FuQW5pbWF0ZShrZXlmcmFtZXMsIG5hbWUsIHR5cGUsIHZlbG9jaXR5KSB7XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgd2UncmUgYWJsZSB0byBhbmltYXRlIGJldHdlZW4gdGhlIHN0YXJ0IGFuZCBlbmQga2V5ZnJhbWVzLFxuICAgICAqIGFuZCB0aHJvdyBhIHdhcm5pbmcgaWYgd2UncmUgYXR0ZW1wdGluZyB0byBhbmltYXRlIGJldHdlZW4gb25lIHRoYXQnc1xuICAgICAqIGFuaW1hdGFibGUgYW5kIGFub3RoZXIgdGhhdCBpc24ndC5cbiAgICAgKi9cbiAgICBjb25zdCBvcmlnaW5LZXlmcmFtZSA9IGtleWZyYW1lc1swXTtcbiAgICBpZiAob3JpZ2luS2V5ZnJhbWUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGVzZSBhcmVuJ3QgdHJhZGl0aW9uYWxseSBhbmltYXRhYmxlIGJ1dCB3ZSBkbyBzdXBwb3J0IHRoZW0uXG4gICAgICogSW4gZnV0dXJlIHdlIGNvdWxkIGxvb2sgaW50byBtYWtpbmcgdGhpcyBtb3JlIGdlbmVyaWMgb3IgcmVwbGFjaW5nXG4gICAgICogdGhpcyBmdW5jdGlvbiB3aXRoIG1peCgpID09PSBtaXhJbW1lZGlhdGVcbiAgICAgKi9cbiAgICBpZiAobmFtZSA9PT0gXCJkaXNwbGF5XCIgfHwgbmFtZSA9PT0gXCJ2aXNpYmlsaXR5XCIpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIGNvbnN0IHRhcmdldEtleWZyYW1lID0ga2V5ZnJhbWVzW2tleWZyYW1lcy5sZW5ndGggLSAxXTtcbiAgICBjb25zdCBpc09yaWdpbkFuaW1hdGFibGUgPSBpc0FuaW1hdGFibGUob3JpZ2luS2V5ZnJhbWUsIG5hbWUpO1xuICAgIGNvbnN0IGlzVGFyZ2V0QW5pbWF0YWJsZSA9IGlzQW5pbWF0YWJsZSh0YXJnZXRLZXlmcmFtZSwgbmFtZSk7XG4gICAgd2FybmluZyhpc09yaWdpbkFuaW1hdGFibGUgPT09IGlzVGFyZ2V0QW5pbWF0YWJsZSwgYFlvdSBhcmUgdHJ5aW5nIHRvIGFuaW1hdGUgJHtuYW1lfSBmcm9tIFwiJHtvcmlnaW5LZXlmcmFtZX1cIiB0byBcIiR7dGFyZ2V0S2V5ZnJhbWV9XCIuIFwiJHtpc09yaWdpbkFuaW1hdGFibGUgPyB0YXJnZXRLZXlmcmFtZSA6IG9yaWdpbktleWZyYW1lfVwiIGlzIG5vdCBhbiBhbmltYXRhYmxlIHZhbHVlLmAsIFwidmFsdWUtbm90LWFuaW1hdGFibGVcIik7XG4gICAgLy8gQWx3YXlzIHNraXAgaWYgYW55IG9mIHRoZXNlIGFyZSB0cnVlXG4gICAgaWYgKCFpc09yaWdpbkFuaW1hdGFibGUgfHwgIWlzVGFyZ2V0QW5pbWF0YWJsZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAoaGFzS2V5ZnJhbWVzQ2hhbmdlZChrZXlmcmFtZXMpIHx8XG4gICAgICAgICgodHlwZSA9PT0gXCJzcHJpbmdcIiB8fCBpc0dlbmVyYXRvcih0eXBlKSkgJiYgdmVsb2NpdHkpKTtcbn1cblxuZXhwb3J0IHsgY2FuQW5pbWF0ZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2FuLWFuaW1hdGUubWpzLm1hcFxuIiwiZnVuY3Rpb24gbWFrZUFuaW1hdGlvbkluc3RhbnQob3B0aW9ucykge1xuICAgIG9wdGlvbnMuZHVyYXRpb24gPSAwO1xuICAgIG9wdGlvbnMudHlwZSA9IFwia2V5ZnJhbWVzXCI7XG59XG5cbmV4cG9ydCB7IG1ha2VBbmltYXRpb25JbnN0YW50IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYWtlLWFuaW1hdGlvbi1pbnN0YW50Lm1qcy5tYXBcbiIsImltcG9ydCB7IG1lbW8gfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuXG4vKipcbiAqIEEgbGlzdCBvZiB2YWx1ZXMgdGhhdCBjYW4gYmUgaGFyZHdhcmUtYWNjZWxlcmF0ZWQuXG4gKi9cbmNvbnN0IGFjY2VsZXJhdGVkVmFsdWVzID0gbmV3IFNldChbXG4gICAgXCJvcGFjaXR5XCIsXG4gICAgXCJjbGlwUGF0aFwiLFxuICAgIFwiZmlsdGVyXCIsXG4gICAgXCJ0cmFuc2Zvcm1cIixcbiAgICAvLyBUT0RPOiBDb3VsZCBiZSByZS1lbmFibGVkIG5vdyB3ZSBoYXZlIHN1cHBvcnQgZm9yIGxpbmVhcigpIGVhc2luZ1xuICAgIC8vIFwiYmFja2dyb3VuZC1jb2xvclwiXG5dKTtcbmNvbnN0IHN1cHBvcnRzV2FhcGkgPSAvKkBfX1BVUkVfXyovIG1lbW8oKCkgPT4gT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwoRWxlbWVudC5wcm90b3R5cGUsIFwiYW5pbWF0ZVwiKSk7XG5mdW5jdGlvbiBzdXBwb3J0c0Jyb3dzZXJBbmltYXRpb24ob3B0aW9ucykge1xuICAgIGNvbnN0IHsgbW90aW9uVmFsdWUsIG5hbWUsIHJlcGVhdERlbGF5LCByZXBlYXRUeXBlLCBkYW1waW5nLCB0eXBlIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IHN1YmplY3QgPSBtb3Rpb25WYWx1ZT8ub3duZXI/LmN1cnJlbnQ7XG4gICAgLyoqXG4gICAgICogV2UgdXNlIHRoaXMgY2hlY2sgaW5zdGVhZCBvZiBpc0hUTUxFbGVtZW50KCkgYmVjYXVzZSB3ZSBleHBsaWNpdGx5XG4gICAgICogKipkb24ndCoqIHdhbnQgZWxlbWVudHMgaW4gZGlmZmVyZW50IHRpbWluZyBjb250ZXh0cyAoaS5lLiBwb3B1cHMpXG4gICAgICogdG8gYmUgYWNjZWxlcmF0ZWQsIGFzIGl0J3Mgbm90IHBvc3NpYmxlIHRvIHN5bmMgdGhlc2UgYW5pbWF0aW9uc1xuICAgICAqIHByb3Blcmx5IHdpdGggdGhvc2UgZHJpdmVuIGZyb20gdGhlIG1haW4gd2luZG93IGZyYW1lbG9vcC5cbiAgICAgKi9cbiAgICBpZiAoIShzdWJqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgeyBvblVwZGF0ZSwgdHJhbnNmb3JtVGVtcGxhdGUgfSA9IG1vdGlvblZhbHVlLm93bmVyLmdldFByb3BzKCk7XG4gICAgcmV0dXJuIChzdXBwb3J0c1dhYXBpKCkgJiZcbiAgICAgICAgbmFtZSAmJlxuICAgICAgICBhY2NlbGVyYXRlZFZhbHVlcy5oYXMobmFtZSkgJiZcbiAgICAgICAgKG5hbWUgIT09IFwidHJhbnNmb3JtXCIgfHwgIXRyYW5zZm9ybVRlbXBsYXRlKSAmJlxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgd2UncmUgb3V0cHV0dGluZyB2YWx1ZXMgdG8gb25VcGRhdGUgdGhlbiB3ZSBjYW4ndCB1c2UgV0FBUEkgYXMgdGhlcmUnc1xuICAgICAgICAgKiBubyB3YXkgdG8gcmVhZCB0aGUgdmFsdWUgZnJvbSBXQUFQSSBldmVyeSBmcmFtZS5cbiAgICAgICAgICovXG4gICAgICAgICFvblVwZGF0ZSAmJlxuICAgICAgICAhcmVwZWF0RGVsYXkgJiZcbiAgICAgICAgcmVwZWF0VHlwZSAhPT0gXCJtaXJyb3JcIiAmJlxuICAgICAgICBkYW1waW5nICE9PSAwICYmXG4gICAgICAgIHR5cGUgIT09IFwiaW5lcnRpYVwiKTtcbn1cblxuZXhwb3J0IHsgc3VwcG9ydHNCcm93c2VyQW5pbWF0aW9uIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD13YWFwaS5tanMubWFwXG4iLCJpbXBvcnQgeyBNb3Rpb25HbG9iYWxDb25maWcsIG5vb3AgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuaW1wb3J0IHsgdGltZSB9IGZyb20gJy4uL2ZyYW1lbG9vcC9zeW5jLXRpbWUubWpzJztcbmltcG9ydCB7IEpTQW5pbWF0aW9uIH0gZnJvbSAnLi9KU0FuaW1hdGlvbi5tanMnO1xuaW1wb3J0IHsgZ2V0RmluYWxLZXlmcmFtZSB9IGZyb20gJy4va2V5ZnJhbWVzL2dldC1maW5hbC5tanMnO1xuaW1wb3J0IHsgS2V5ZnJhbWVSZXNvbHZlciwgZmx1c2hLZXlmcmFtZVJlc29sdmVycyB9IGZyb20gJy4va2V5ZnJhbWVzL0tleWZyYW1lc1Jlc29sdmVyLm1qcyc7XG5pbXBvcnQgeyBOYXRpdmVBbmltYXRpb25FeHRlbmRlZCB9IGZyb20gJy4vTmF0aXZlQW5pbWF0aW9uRXh0ZW5kZWQubWpzJztcbmltcG9ydCB7IGNhbkFuaW1hdGUgfSBmcm9tICcuL3V0aWxzL2Nhbi1hbmltYXRlLm1qcyc7XG5pbXBvcnQgeyBtYWtlQW5pbWF0aW9uSW5zdGFudCB9IGZyb20gJy4vdXRpbHMvbWFrZS1hbmltYXRpb24taW5zdGFudC5tanMnO1xuaW1wb3J0IHsgV2l0aFByb21pc2UgfSBmcm9tICcuL3V0aWxzL1dpdGhQcm9taXNlLm1qcyc7XG5pbXBvcnQgeyBzdXBwb3J0c0Jyb3dzZXJBbmltYXRpb24gfSBmcm9tICcuL3dhYXBpL3N1cHBvcnRzL3dhYXBpLm1qcyc7XG5cbi8qKlxuICogTWF4aW11bSB0aW1lIGFsbG93ZWQgYmV0d2VlbiBhbiBhbmltYXRpb24gYmVpbmcgY3JlYXRlZCBhbmQgaXQgYmVpbmdcbiAqIHJlc29sdmVkIGZvciB1cyB0byB1c2UgdGhlIGxhdHRlciBhcyB0aGUgc3RhcnQgdGltZS5cbiAqXG4gKiBUaGlzIGlzIHRvIGVuc3VyZSB0aGF0IHdoaWxlIHdlIHByZWZlciB0byBcInN0YXJ0XCIgYW4gYW5pbWF0aW9uIGFzIHNvb25cbiAqIGFzIGl0J3MgdHJpZ2dlcmVkLCB3ZSBhbHNvIHdhbnQgdG8gYXZvaWQgYSB2aXN1YWwganVtcCBpZiB0aGVyZSdzIGEgYmlnIGRlbGF5XG4gKiBiZXR3ZWVuIHRoZXNlIHR3byBtb21lbnRzLlxuICovXG5jb25zdCBNQVhfUkVTT0xWRV9ERUxBWSA9IDQwO1xuY2xhc3MgQXN5bmNNb3Rpb25WYWx1ZUFuaW1hdGlvbiBleHRlbmRzIFdpdGhQcm9taXNlIHtcbiAgICBjb25zdHJ1Y3Rvcih7IGF1dG9wbGF5ID0gdHJ1ZSwgZGVsYXkgPSAwLCB0eXBlID0gXCJrZXlmcmFtZXNcIiwgcmVwZWF0ID0gMCwgcmVwZWF0RGVsYXkgPSAwLCByZXBlYXRUeXBlID0gXCJsb29wXCIsIGtleWZyYW1lcywgbmFtZSwgbW90aW9uVmFsdWUsIGVsZW1lbnQsIC4uLm9wdGlvbnMgfSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICAvKipcbiAgICAgICAgICogQm91bmQgdG8gc3VwcG9ydCByZXR1cm4gYW5pbWF0aW9uLnN0b3AgcGF0dGVyblxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zdG9wID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2FuaW1hdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FuaW1hdGlvbi5zdG9wKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wVGltZWxpbmU/LigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5rZXlmcmFtZVJlc29sdmVyPy5jYW5jZWwoKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jcmVhdGVkQXQgPSB0aW1lLm5vdygpO1xuICAgICAgICBjb25zdCBvcHRpb25zV2l0aERlZmF1bHRzID0ge1xuICAgICAgICAgICAgYXV0b3BsYXksXG4gICAgICAgICAgICBkZWxheSxcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICByZXBlYXQsXG4gICAgICAgICAgICByZXBlYXREZWxheSxcbiAgICAgICAgICAgIHJlcGVhdFR5cGUsXG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgbW90aW9uVmFsdWUsXG4gICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgS2V5ZnJhbWVSZXNvbHZlciQxID0gZWxlbWVudD8uS2V5ZnJhbWVSZXNvbHZlciB8fCBLZXlmcmFtZVJlc29sdmVyO1xuICAgICAgICB0aGlzLmtleWZyYW1lUmVzb2x2ZXIgPSBuZXcgS2V5ZnJhbWVSZXNvbHZlciQxKGtleWZyYW1lcywgKHJlc29sdmVkS2V5ZnJhbWVzLCBmaW5hbEtleWZyYW1lLCBmb3JjZWQpID0+IHRoaXMub25LZXlmcmFtZXNSZXNvbHZlZChyZXNvbHZlZEtleWZyYW1lcywgZmluYWxLZXlmcmFtZSwgb3B0aW9uc1dpdGhEZWZhdWx0cywgIWZvcmNlZCksIG5hbWUsIG1vdGlvblZhbHVlLCBlbGVtZW50KTtcbiAgICAgICAgdGhpcy5rZXlmcmFtZVJlc29sdmVyPy5zY2hlZHVsZVJlc29sdmUoKTtcbiAgICB9XG4gICAgb25LZXlmcmFtZXNSZXNvbHZlZChrZXlmcmFtZXMsIGZpbmFsS2V5ZnJhbWUsIG9wdGlvbnMsIHN5bmMpIHtcbiAgICAgICAgdGhpcy5rZXlmcmFtZVJlc29sdmVyID0gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCB7IG5hbWUsIHR5cGUsIHZlbG9jaXR5LCBkZWxheSwgaXNIYW5kb2ZmLCBvblVwZGF0ZSB9ID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5yZXNvbHZlZEF0ID0gdGltZS5ub3coKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHdlIGNhbid0IGFuaW1hdGUgdGhpcyB2YWx1ZSB3aXRoIHRoZSByZXNvbHZlZCBrZXlmcmFtZXNcbiAgICAgICAgICogdGhlbiB3ZSBzaG91bGQgY29tcGxldGUgaXQgaW1tZWRpYXRlbHkuXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgY2FuQW5pbWF0ZVZhbHVlID0gdHJ1ZTtcbiAgICAgICAgaWYgKCFjYW5BbmltYXRlKGtleWZyYW1lcywgbmFtZSwgdHlwZSwgdmVsb2NpdHkpKSB7XG4gICAgICAgICAgICBjYW5BbmltYXRlVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChNb3Rpb25HbG9iYWxDb25maWcuaW5zdGFudEFuaW1hdGlvbnMgfHwgIWRlbGF5KSB7XG4gICAgICAgICAgICAgICAgb25VcGRhdGU/LihnZXRGaW5hbEtleWZyYW1lKGtleWZyYW1lcywgb3B0aW9ucywgZmluYWxLZXlmcmFtZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5ZnJhbWVzWzBdID0ga2V5ZnJhbWVzW2tleWZyYW1lcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIG1ha2VBbmltYXRpb25JbnN0YW50KG9wdGlvbnMpO1xuICAgICAgICAgICAgb3B0aW9ucy5yZXBlYXQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNvbHZlIHN0YXJ0VGltZSBmb3IgdGhlIGFuaW1hdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBtZXRob2QgdXNlcyB0aGUgY3JlYXRlZEF0IGFuZCByZXNvbHZlZEF0IHRvIGNhbGN1bGF0ZSB0aGVcbiAgICAgICAgICogYW5pbWF0aW9uIHN0YXJ0VGltZS4gKklkZWFsbHkqLCB3ZSB3b3VsZCB1c2UgdGhlIGNyZWF0ZWRBdCB0aW1lIGFzIHQ9MFxuICAgICAgICAgKiBhcyB0aGUgZm9sbG93aW5nIGZyYW1lIHdvdWxkIHRoZW4gYmUgdGhlIGZpcnN0IGZyYW1lIG9mIHRoZSBhbmltYXRpb24gaW5cbiAgICAgICAgICogcHJvZ3Jlc3MsIHdoaWNoIHdvdWxkIGZlZWwgc25hcHBpZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEhvd2V2ZXIsIGlmIHRoZXJlJ3MgYSBkZWxheSAobWFpbiB0aHJlYWQgd29yaykgYmV0d2VlbiB0aGUgY3JlYXRpb24gb2ZcbiAgICAgICAgICogdGhlIGFuaW1hdGlvbiBhbmQgdGhlIGZpcnN0IGNvbW1pdHRlZCBmcmFtZSwgd2UgcHJlZmVyIHRvIHVzZSByZXNvbHZlZEF0XG4gICAgICAgICAqIHRvIGF2b2lkIGEgc3VkZGVuIGp1bXAgaW50byB0aGUgYW5pbWF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgc3RhcnRUaW1lID0gc3luY1xuICAgICAgICAgICAgPyAhdGhpcy5yZXNvbHZlZEF0XG4gICAgICAgICAgICAgICAgPyB0aGlzLmNyZWF0ZWRBdFxuICAgICAgICAgICAgICAgIDogdGhpcy5yZXNvbHZlZEF0IC0gdGhpcy5jcmVhdGVkQXQgPiBNQVhfUkVTT0xWRV9ERUxBWVxuICAgICAgICAgICAgICAgICAgICA/IHRoaXMucmVzb2x2ZWRBdFxuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuY3JlYXRlZEF0XG4gICAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgcmVzb2x2ZWRPcHRpb25zID0ge1xuICAgICAgICAgICAgc3RhcnRUaW1lLFxuICAgICAgICAgICAgZmluYWxLZXlmcmFtZSxcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICBrZXlmcmFtZXMsXG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbmltYXRlIHZpYSBXQUFQSSBpZiBwb3NzaWJsZS4gSWYgdGhpcyBpcyBhIGhhbmRvZmYgYW5pbWF0aW9uLCB0aGUgb3B0aW1pc2VkIGFuaW1hdGlvbiB3aWxsIGJlIHJ1bm5pbmcgdmlhXG4gICAgICAgICAqIFdBQVBJLiBUaGVyZWZvcmUsIHRoaXMgYW5pbWF0aW9uIG11c3QgYmUgSlMgdG8gZW5zdXJlIGl0IHJ1bnMgXCJ1bmRlclwiIHRoZVxuICAgICAgICAgKiBvcHRpbWlzZWQgYW5pbWF0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBBbHNvIHNraXAgV0FBUEkgd2hlbiBrZXlmcmFtZXMgYXJlbid0IGFuaW1hdGFibGUsIGFzIHRoZSByZXNvbHZlZFxuICAgICAgICAgKiB2YWx1ZXMgbWF5IG5vdCBiZSB2YWxpZCBDU1MgYW5kIHdvdWxkIHRyaWdnZXIgYnJvd3NlciB3YXJuaW5ncy5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHVzZVdhYXBpID0gY2FuQW5pbWF0ZVZhbHVlICYmXG4gICAgICAgICAgICAhaXNIYW5kb2ZmICYmXG4gICAgICAgICAgICBzdXBwb3J0c0Jyb3dzZXJBbmltYXRpb24ocmVzb2x2ZWRPcHRpb25zKTtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHJlc29sdmVkT3B0aW9ucy5tb3Rpb25WYWx1ZT8ub3duZXI/LmN1cnJlbnQ7XG4gICAgICAgIGNvbnN0IGFuaW1hdGlvbiA9IHVzZVdhYXBpXG4gICAgICAgICAgICA/IG5ldyBOYXRpdmVBbmltYXRpb25FeHRlbmRlZCh7XG4gICAgICAgICAgICAgICAgLi4ucmVzb2x2ZWRPcHRpb25zLFxuICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgOiBuZXcgSlNBbmltYXRpb24ocmVzb2x2ZWRPcHRpb25zKTtcbiAgICAgICAgYW5pbWF0aW9uLmZpbmlzaGVkLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5ub3RpZnlGaW5pc2hlZCgpO1xuICAgICAgICB9KS5jYXRjaChub29wKTtcbiAgICAgICAgaWYgKHRoaXMucGVuZGluZ1RpbWVsaW5lKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BUaW1lbGluZSA9IGFuaW1hdGlvbi5hdHRhY2hUaW1lbGluZSh0aGlzLnBlbmRpbmdUaW1lbGluZSk7XG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdUaW1lbGluZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hbmltYXRpb24gPSBhbmltYXRpb247XG4gICAgfVxuICAgIGdldCBmaW5pc2hlZCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9hbmltYXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9maW5pc2hlZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFuaW1hdGlvbi5maW5pc2hlZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGVuKG9uUmVzb2x2ZSwgX29uUmVqZWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmlzaGVkLmZpbmFsbHkob25SZXNvbHZlKS50aGVuKCgpID0+IHsgfSk7XG4gICAgfVxuICAgIGdldCBhbmltYXRpb24oKSB7XG4gICAgICAgIGlmICghdGhpcy5fYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmtleWZyYW1lUmVzb2x2ZXI/LnJlc3VtZSgpO1xuICAgICAgICAgICAgZmx1c2hLZXlmcmFtZVJlc29sdmVycygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9hbmltYXRpb247XG4gICAgfVxuICAgIGdldCBkdXJhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW5pbWF0aW9uLmR1cmF0aW9uO1xuICAgIH1cbiAgICBnZXQgaXRlcmF0aW9uRHVyYXRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFuaW1hdGlvbi5pdGVyYXRpb25EdXJhdGlvbjtcbiAgICB9XG4gICAgZ2V0IHRpbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFuaW1hdGlvbi50aW1lO1xuICAgIH1cbiAgICBzZXQgdGltZShuZXdUaW1lKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uLnRpbWUgPSBuZXdUaW1lO1xuICAgIH1cbiAgICBnZXQgc3BlZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFuaW1hdGlvbi5zcGVlZDtcbiAgICB9XG4gICAgZ2V0IHN0YXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbmltYXRpb24uc3RhdGU7XG4gICAgfVxuICAgIHNldCBzcGVlZChuZXdTcGVlZCkge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbi5zcGVlZCA9IG5ld1NwZWVkO1xuICAgIH1cbiAgICBnZXQgc3RhcnRUaW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hbmltYXRpb24uc3RhcnRUaW1lO1xuICAgIH1cbiAgICBhdHRhY2hUaW1lbGluZSh0aW1lbGluZSkge1xuICAgICAgICBpZiAodGhpcy5fYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BUaW1lbGluZSA9IHRoaXMuYW5pbWF0aW9uLmF0dGFjaFRpbWVsaW5lKHRpbWVsaW5lKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGVuZGluZ1RpbWVsaW5lID0gdGltZWxpbmU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICgpID0+IHRoaXMuc3RvcCgpO1xuICAgIH1cbiAgICBwbGF5KCkge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbi5wbGF5KCk7XG4gICAgfVxuICAgIHBhdXNlKCkge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbi5wYXVzZSgpO1xuICAgIH1cbiAgICBjb21wbGV0ZSgpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gICAgY2FuY2VsKCkge1xuICAgICAgICBpZiAodGhpcy5fYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5jYW5jZWwoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtleWZyYW1lUmVzb2x2ZXI/LmNhbmNlbCgpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgQXN5bmNNb3Rpb25WYWx1ZUFuaW1hdGlvbiB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QXN5bmNNb3Rpb25WYWx1ZUFuaW1hdGlvbi5tanMubWFwXG4iLCJjbGFzcyBHcm91cEFuaW1hdGlvbiB7XG4gICAgY29uc3RydWN0b3IoYW5pbWF0aW9ucykge1xuICAgICAgICAvLyBCb3VuZCB0byBhY2NvbWFkYXRlIGNvbW1vbiBgcmV0dXJuIGFuaW1hdGlvbi5zdG9wYCBwYXR0ZXJuXG4gICAgICAgIHRoaXMuc3RvcCA9ICgpID0+IHRoaXMucnVuQWxsKFwic3RvcFwiKTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25zID0gYW5pbWF0aW9ucy5maWx0ZXIoQm9vbGVhbik7XG4gICAgfVxuICAgIGdldCBmaW5pc2hlZCgpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHRoaXMuYW5pbWF0aW9ucy5tYXAoKGFuaW1hdGlvbikgPT4gYW5pbWF0aW9uLmZpbmlzaGVkKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRPRE86IEZpbHRlciBvdXQgY2FuY2VsbGVkIG9yIHN0b3BwZWQgYW5pbWF0aW9ucyBiZWZvcmUgcmV0dXJuaW5nXG4gICAgICovXG4gICAgZ2V0QWxsKHByb3BOYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFuaW1hdGlvbnNbMF1bcHJvcE5hbWVdO1xuICAgIH1cbiAgICBzZXRBbGwocHJvcE5hbWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hbmltYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnNbaV1bcHJvcE5hbWVdID0gbmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXR0YWNoVGltZWxpbmUodGltZWxpbmUpIHtcbiAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IHRoaXMuYW5pbWF0aW9ucy5tYXAoKGFuaW1hdGlvbikgPT4gYW5pbWF0aW9uLmF0dGFjaFRpbWVsaW5lKHRpbWVsaW5lKSk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25zLmZvckVhY2goKGNhbmNlbCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGNhbmNlbCAmJiBjYW5jZWwoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbnNbaV0uc3RvcCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGdldCB0aW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBbGwoXCJ0aW1lXCIpO1xuICAgIH1cbiAgICBzZXQgdGltZSh0aW1lKSB7XG4gICAgICAgIHRoaXMuc2V0QWxsKFwidGltZVwiLCB0aW1lKTtcbiAgICB9XG4gICAgZ2V0IHNwZWVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBbGwoXCJzcGVlZFwiKTtcbiAgICB9XG4gICAgc2V0IHNwZWVkKHNwZWVkKSB7XG4gICAgICAgIHRoaXMuc2V0QWxsKFwic3BlZWRcIiwgc3BlZWQpO1xuICAgIH1cbiAgICBnZXQgc3RhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEFsbChcInN0YXRlXCIpO1xuICAgIH1cbiAgICBnZXQgc3RhcnRUaW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBbGwoXCJzdGFydFRpbWVcIik7XG4gICAgfVxuICAgIGdldCBkdXJhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGdldE1heCh0aGlzLmFuaW1hdGlvbnMsIFwiZHVyYXRpb25cIik7XG4gICAgfVxuICAgIGdldCBpdGVyYXRpb25EdXJhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGdldE1heCh0aGlzLmFuaW1hdGlvbnMsIFwiaXRlcmF0aW9uRHVyYXRpb25cIik7XG4gICAgfVxuICAgIHJ1bkFsbChtZXRob2ROYW1lKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9ucy5mb3JFYWNoKChjb250cm9scykgPT4gY29udHJvbHNbbWV0aG9kTmFtZV0oKSk7XG4gICAgfVxuICAgIHBsYXkoKSB7XG4gICAgICAgIHRoaXMucnVuQWxsKFwicGxheVwiKTtcbiAgICB9XG4gICAgcGF1c2UoKSB7XG4gICAgICAgIHRoaXMucnVuQWxsKFwicGF1c2VcIik7XG4gICAgfVxuICAgIGNhbmNlbCgpIHtcbiAgICAgICAgdGhpcy5ydW5BbGwoXCJjYW5jZWxcIik7XG4gICAgfVxuICAgIGNvbXBsZXRlKCkge1xuICAgICAgICB0aGlzLnJ1bkFsbChcImNvbXBsZXRlXCIpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldE1heChhbmltYXRpb25zLCBwcm9wTmFtZSkge1xuICAgIGxldCBtYXggPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYW5pbWF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGFuaW1hdGlvbnNbaV1bcHJvcE5hbWVdO1xuICAgICAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgPiBtYXgpIHtcbiAgICAgICAgICAgIG1heCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXg7XG59XG5cbmV4cG9ydCB7IEdyb3VwQW5pbWF0aW9uIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Hcm91cEFuaW1hdGlvbi5tanMubWFwXG4iLCJpbXBvcnQgeyBpbnZhcmlhbnQsIGlzTnVtZXJpY2FsU3RyaW5nIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcbmltcG9ydCB7IGlzQ1NTVmFyaWFibGVUb2tlbiB9IGZyb20gJy4vaXMtY3NzLXZhcmlhYmxlLm1qcyc7XG5cbi8qKlxuICogUGFyc2UgRnJhbWVyJ3Mgc3BlY2lhbCBDU1MgdmFyaWFibGUgZm9ybWF0IGludG8gYSBDU1MgdG9rZW4gYW5kIGEgZmFsbGJhY2suXG4gKlxuICogYGBgXG4gKiBgdmFyKC0tZm9vLCAjZmZmKWAgPT4gW2AtLWZvb2AsICcjZmZmJ11cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBjdXJyZW50XG4gKi9cbmNvbnN0IHNwbGl0Q1NTVmFyaWFibGVSZWdleCA9IFxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlZG9zLWRldGVjdG9yL25vLXVuc2FmZS1yZWdleCAtLSBmYWxzZSBwb3NpdGl2ZSwgYXMgaXQgY2FuIG1hdGNoIGEgbG90IG9mIHdvcmRzXG4vXnZhclxcKC0tKD86KFtcXHctXSspfChbXFx3LV0rKSwgPyhbYS16QS1aXFxkICgpJSMuLC1dKykpXFwpL3U7XG5mdW5jdGlvbiBwYXJzZUNTU1ZhcmlhYmxlKGN1cnJlbnQpIHtcbiAgICBjb25zdCBtYXRjaCA9IHNwbGl0Q1NTVmFyaWFibGVSZWdleC5leGVjKGN1cnJlbnQpO1xuICAgIGlmICghbWF0Y2gpXG4gICAgICAgIHJldHVybiBbLF07XG4gICAgY29uc3QgWywgdG9rZW4xLCB0b2tlbjIsIGZhbGxiYWNrXSA9IG1hdGNoO1xuICAgIHJldHVybiBbYC0tJHt0b2tlbjEgPz8gdG9rZW4yfWAsIGZhbGxiYWNrXTtcbn1cbmNvbnN0IG1heERlcHRoID0gNDtcbmZ1bmN0aW9uIGdldFZhcmlhYmxlVmFsdWUoY3VycmVudCwgZWxlbWVudCwgZGVwdGggPSAxKSB7XG4gICAgaW52YXJpYW50KGRlcHRoIDw9IG1heERlcHRoLCBgTWF4IENTUyB2YXJpYWJsZSBmYWxsYmFjayBkZXB0aCBkZXRlY3RlZCBpbiBwcm9wZXJ0eSBcIiR7Y3VycmVudH1cIi4gVGhpcyBtYXkgaW5kaWNhdGUgYSBjaXJjdWxhciBmYWxsYmFjayBkZXBlbmRlbmN5LmAsIFwibWF4LWNzcy12YXItZGVwdGhcIik7XG4gICAgY29uc3QgW3Rva2VuLCBmYWxsYmFja10gPSBwYXJzZUNTU1ZhcmlhYmxlKGN1cnJlbnQpO1xuICAgIC8vIE5vIENTUyB2YXJpYWJsZSBkZXRlY3RlZFxuICAgIGlmICghdG9rZW4pXG4gICAgICAgIHJldHVybjtcbiAgICAvLyBBdHRlbXB0IHRvIHJlYWQgdGhpcyBDU1MgdmFyaWFibGUgb2ZmIHRoZSBlbGVtZW50XG4gICAgY29uc3QgcmVzb2x2ZWQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKHRva2VuKTtcbiAgICBpZiAocmVzb2x2ZWQpIHtcbiAgICAgICAgY29uc3QgdHJpbW1lZCA9IHJlc29sdmVkLnRyaW0oKTtcbiAgICAgICAgcmV0dXJuIGlzTnVtZXJpY2FsU3RyaW5nKHRyaW1tZWQpID8gcGFyc2VGbG9hdCh0cmltbWVkKSA6IHRyaW1tZWQ7XG4gICAgfVxuICAgIHJldHVybiBpc0NTU1ZhcmlhYmxlVG9rZW4oZmFsbGJhY2spXG4gICAgICAgID8gZ2V0VmFyaWFibGVWYWx1ZShmYWxsYmFjaywgZWxlbWVudCwgZGVwdGggKyAxKVxuICAgICAgICA6IGZhbGxiYWNrO1xufVxuXG5leHBvcnQgeyBnZXRWYXJpYWJsZVZhbHVlLCBwYXJzZUNTU1ZhcmlhYmxlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jc3MtdmFyaWFibGVzLWNvbnZlcnNpb24ubWpzLm1hcFxuIiwiaW1wb3J0IHsgdHJhbnNmb3JtUHJvcHMgfSBmcm9tICcuLi8uLi9yZW5kZXIvdXRpbHMva2V5cy10cmFuc2Zvcm0ubWpzJztcblxuY29uc3QgdW5kZXJEYW1wZWRTcHJpbmcgPSB7XG4gICAgdHlwZTogXCJzcHJpbmdcIixcbiAgICBzdGlmZm5lc3M6IDUwMCxcbiAgICBkYW1waW5nOiAyNSxcbiAgICByZXN0U3BlZWQ6IDEwLFxufTtcbmNvbnN0IGNyaXRpY2FsbHlEYW1wZWRTcHJpbmcgPSAodGFyZ2V0KSA9PiAoe1xuICAgIHR5cGU6IFwic3ByaW5nXCIsXG4gICAgc3RpZmZuZXNzOiA1NTAsXG4gICAgZGFtcGluZzogdGFyZ2V0ID09PSAwID8gMiAqIE1hdGguc3FydCg1NTApIDogMzAsXG4gICAgcmVzdFNwZWVkOiAxMCxcbn0pO1xuY29uc3Qga2V5ZnJhbWVzVHJhbnNpdGlvbiA9IHtcbiAgICB0eXBlOiBcImtleWZyYW1lc1wiLFxuICAgIGR1cmF0aW9uOiAwLjgsXG59O1xuLyoqXG4gKiBEZWZhdWx0IGVhc2luZyBjdXJ2ZSBpcyBhIHNsaWdodGx5IHNoYWxsb3dlciB2ZXJzaW9uIG9mXG4gKiB0aGUgZGVmYXVsdCBicm93c2VyIGVhc2luZyBjdXJ2ZS5cbiAqL1xuY29uc3QgZWFzZSA9IHtcbiAgICB0eXBlOiBcImtleWZyYW1lc1wiLFxuICAgIGVhc2U6IFswLjI1LCAwLjEsIDAuMzUsIDFdLFxuICAgIGR1cmF0aW9uOiAwLjMsXG59O1xuY29uc3QgZ2V0RGVmYXVsdFRyYW5zaXRpb24gPSAodmFsdWVLZXksIHsga2V5ZnJhbWVzIH0pID0+IHtcbiAgICBpZiAoa2V5ZnJhbWVzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgcmV0dXJuIGtleWZyYW1lc1RyYW5zaXRpb247XG4gICAgfVxuICAgIGVsc2UgaWYgKHRyYW5zZm9ybVByb3BzLmhhcyh2YWx1ZUtleSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlS2V5LnN0YXJ0c1dpdGgoXCJzY2FsZVwiKVxuICAgICAgICAgICAgPyBjcml0aWNhbGx5RGFtcGVkU3ByaW5nKGtleWZyYW1lc1sxXSlcbiAgICAgICAgICAgIDogdW5kZXJEYW1wZWRTcHJpbmc7XG4gICAgfVxuICAgIHJldHVybiBlYXNlO1xufTtcblxuZXhwb3J0IHsgZ2V0RGVmYXVsdFRyYW5zaXRpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlZmF1bHQtdHJhbnNpdGlvbnMubWpzLm1hcFxuIiwiY29uc3QgaXNOb3ROdWxsID0gKHZhbHVlKSA9PiB2YWx1ZSAhPT0gbnVsbDtcbmZ1bmN0aW9uIGdldEZpbmFsS2V5ZnJhbWUoa2V5ZnJhbWVzLCB7IHJlcGVhdCwgcmVwZWF0VHlwZSA9IFwibG9vcFwiIH0sIGZpbmFsS2V5ZnJhbWUpIHtcbiAgICBjb25zdCByZXNvbHZlZEtleWZyYW1lcyA9IGtleWZyYW1lcy5maWx0ZXIoaXNOb3ROdWxsKTtcbiAgICBjb25zdCBpbmRleCA9IHJlcGVhdCAmJiByZXBlYXRUeXBlICE9PSBcImxvb3BcIiAmJiByZXBlYXQgJSAyID09PSAxXG4gICAgICAgID8gMFxuICAgICAgICA6IHJlc29sdmVkS2V5ZnJhbWVzLmxlbmd0aCAtIDE7XG4gICAgcmV0dXJuICFpbmRleCB8fCBmaW5hbEtleWZyYW1lID09PSB1bmRlZmluZWRcbiAgICAgICAgPyByZXNvbHZlZEtleWZyYW1lc1tpbmRleF1cbiAgICAgICAgOiBmaW5hbEtleWZyYW1lO1xufVxuXG5leHBvcnQgeyBnZXRGaW5hbEtleWZyYW1lIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1nZXQtZmluYWwta2V5ZnJhbWUubWpzLm1hcFxuIiwiLyoqXG4gKiBJZiBgdHJhbnNpdGlvbmAgaGFzIGBpbmhlcml0OiB0cnVlYCwgc2hhbGxvdy1tZXJnZSBpdCB3aXRoXG4gKiBgcGFyZW50VHJhbnNpdGlvbmAgKGNoaWxkIGtleXMgd2luKSBhbmQgc3RyaXAgdGhlIGBpbmhlcml0YCBrZXkuXG4gKiBPdGhlcndpc2UgcmV0dXJuIGB0cmFuc2l0aW9uYCB1bmNoYW5nZWQuXG4gKi9cbmZ1bmN0aW9uIHJlc29sdmVUcmFuc2l0aW9uKHRyYW5zaXRpb24sIHBhcmVudFRyYW5zaXRpb24pIHtcbiAgICBpZiAodHJhbnNpdGlvbj8uaW5oZXJpdCAmJiBwYXJlbnRUcmFuc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IHsgaW5oZXJpdDogXywgLi4ucmVzdCB9ID0gdHJhbnNpdGlvbjtcbiAgICAgICAgcmV0dXJuIHsgLi4ucGFyZW50VHJhbnNpdGlvbiwgLi4ucmVzdCB9O1xuICAgIH1cbiAgICByZXR1cm4gdHJhbnNpdGlvbjtcbn1cblxuZXhwb3J0IHsgcmVzb2x2ZVRyYW5zaXRpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlc29sdmUtdHJhbnNpdGlvbi5tanMubWFwXG4iLCJpbXBvcnQgeyByZXNvbHZlVHJhbnNpdGlvbiB9IGZyb20gJy4vcmVzb2x2ZS10cmFuc2l0aW9uLm1qcyc7XG5cbmZ1bmN0aW9uIGdldFZhbHVlVHJhbnNpdGlvbih0cmFuc2l0aW9uLCBrZXkpIHtcbiAgICBjb25zdCB2YWx1ZVRyYW5zaXRpb24gPSB0cmFuc2l0aW9uPy5ba2V5XSA/P1xuICAgICAgICB0cmFuc2l0aW9uPy5bXCJkZWZhdWx0XCJdID8/XG4gICAgICAgIHRyYW5zaXRpb247XG4gICAgaWYgKHZhbHVlVHJhbnNpdGlvbiAhPT0gdHJhbnNpdGlvbikge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZVRyYW5zaXRpb24odmFsdWVUcmFuc2l0aW9uLCB0cmFuc2l0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlVHJhbnNpdGlvbjtcbn1cblxuZXhwb3J0IHsgZ2V0VmFsdWVUcmFuc2l0aW9uIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1nZXQtdmFsdWUtdHJhbnNpdGlvbi5tanMubWFwXG4iLCIvKipcbiAqIERlY2lkZSB3aGV0aGVyIGEgdHJhbnNpdGlvbiBpcyBkZWZpbmVkIG9uIGEgZ2l2ZW4gVHJhbnNpdGlvbi5cbiAqIFRoaXMgZmlsdGVycyBvdXQgb3JjaGVzdHJhdGlvbiBvcHRpb25zIGFuZCByZXR1cm5zIHRydWVcbiAqIGlmIGFueSBvcHRpb25zIGFyZSBsZWZ0LlxuICovXG5mdW5jdGlvbiBpc1RyYW5zaXRpb25EZWZpbmVkKHsgd2hlbiwgZGVsYXk6IF9kZWxheSwgZGVsYXlDaGlsZHJlbiwgc3RhZ2dlckNoaWxkcmVuLCBzdGFnZ2VyRGlyZWN0aW9uLCByZXBlYXQsIHJlcGVhdFR5cGUsIHJlcGVhdERlbGF5LCBmcm9tLCBlbGFwc2VkLCAuLi50cmFuc2l0aW9uIH0pIHtcbiAgICByZXR1cm4gISFPYmplY3Qua2V5cyh0cmFuc2l0aW9uKS5sZW5ndGg7XG59XG5cbmV4cG9ydCB7IGlzVHJhbnNpdGlvbkRlZmluZWQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzLXRyYW5zaXRpb24tZGVmaW5lZC5tanMubWFwXG4iLCJpbXBvcnQgeyBzZWNvbmRzVG9NaWxsaXNlY29uZHMsIE1vdGlvbkdsb2JhbENvbmZpZyB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBBc3luY01vdGlvblZhbHVlQW5pbWF0aW9uIH0gZnJvbSAnLi4vQXN5bmNNb3Rpb25WYWx1ZUFuaW1hdGlvbi5tanMnO1xuaW1wb3J0IHsgSlNBbmltYXRpb24gfSBmcm9tICcuLi9KU0FuaW1hdGlvbi5tanMnO1xuaW1wb3J0IHsgZ2V0VmFsdWVUcmFuc2l0aW9uIH0gZnJvbSAnLi4vdXRpbHMvZ2V0LXZhbHVlLXRyYW5zaXRpb24ubWpzJztcbmltcG9ydCB7IG1ha2VBbmltYXRpb25JbnN0YW50IH0gZnJvbSAnLi4vdXRpbHMvbWFrZS1hbmltYXRpb24taW5zdGFudC5tanMnO1xuaW1wb3J0IHsgZ2V0RGVmYXVsdFRyYW5zaXRpb24gfSBmcm9tICcuLi91dGlscy9kZWZhdWx0LXRyYW5zaXRpb25zLm1qcyc7XG5pbXBvcnQgeyBnZXRGaW5hbEtleWZyYW1lIH0gZnJvbSAnLi4vdXRpbHMvZ2V0LWZpbmFsLWtleWZyYW1lLm1qcyc7XG5pbXBvcnQgeyBpc1RyYW5zaXRpb25EZWZpbmVkIH0gZnJvbSAnLi4vdXRpbHMvaXMtdHJhbnNpdGlvbi1kZWZpbmVkLm1qcyc7XG5pbXBvcnQgeyBmcmFtZSB9IGZyb20gJy4uLy4uL2ZyYW1lbG9vcC9mcmFtZS5tanMnO1xuXG5jb25zdCBhbmltYXRlTW90aW9uVmFsdWUgPSAobmFtZSwgdmFsdWUsIHRhcmdldCwgdHJhbnNpdGlvbiA9IHt9LCBlbGVtZW50LCBpc0hhbmRvZmYpID0+IChvbkNvbXBsZXRlKSA9PiB7XG4gICAgY29uc3QgdmFsdWVUcmFuc2l0aW9uID0gZ2V0VmFsdWVUcmFuc2l0aW9uKHRyYW5zaXRpb24sIG5hbWUpIHx8IHt9O1xuICAgIC8qKlxuICAgICAqIE1vc3QgdHJhbnNpdGlvbiB2YWx1ZXMgYXJlIGN1cnJlbnRseSBjb21wbGV0ZWx5IG92ZXJ3cml0dGVuIGJ5IHZhbHVlLXNwZWNpZmljXG4gICAgICogdHJhbnNpdGlvbnMuIEluIHRoZSBmdXR1cmUgaXQnZCBiZSBuaWNlciB0byBibGVuZCB0aGVzZSB0cmFuc2l0aW9ucy4gQnV0IGZvciBub3dcbiAgICAgKiBkZWxheSBhY3R1YWxseSBkb2VzIGluaGVyaXQgZnJvbSB0aGUgcm9vdCB0cmFuc2l0aW9uIGlmIG5vdCB2YWx1ZS1zcGVjaWZpYy5cbiAgICAgKi9cbiAgICBjb25zdCBkZWxheSA9IHZhbHVlVHJhbnNpdGlvbi5kZWxheSB8fCB0cmFuc2l0aW9uLmRlbGF5IHx8IDA7XG4gICAgLyoqXG4gICAgICogRWxhcHNlZCBpc24ndCBhIHB1YmxpYyB0cmFuc2l0aW9uIG9wdGlvbiBidXQgY2FuIGJlIHBhc3NlZCB0aHJvdWdoIGZyb21cbiAgICAgKiBvcHRpbWl6ZWQgYXBwZWFyIGVmZmVjdHMgaW4gbWlsbGlzZWNvbmRzLlxuICAgICAqL1xuICAgIGxldCB7IGVsYXBzZWQgPSAwIH0gPSB0cmFuc2l0aW9uO1xuICAgIGVsYXBzZWQgPSBlbGFwc2VkIC0gc2Vjb25kc1RvTWlsbGlzZWNvbmRzKGRlbGF5KTtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICBrZXlmcmFtZXM6IEFycmF5LmlzQXJyYXkodGFyZ2V0KSA/IHRhcmdldCA6IFtudWxsLCB0YXJnZXRdLFxuICAgICAgICBlYXNlOiBcImVhc2VPdXRcIixcbiAgICAgICAgdmVsb2NpdHk6IHZhbHVlLmdldFZlbG9jaXR5KCksXG4gICAgICAgIC4uLnZhbHVlVHJhbnNpdGlvbixcbiAgICAgICAgZGVsYXk6IC1lbGFwc2VkLFxuICAgICAgICBvblVwZGF0ZTogKHYpID0+IHtcbiAgICAgICAgICAgIHZhbHVlLnNldCh2KTtcbiAgICAgICAgICAgIHZhbHVlVHJhbnNpdGlvbi5vblVwZGF0ZSAmJiB2YWx1ZVRyYW5zaXRpb24ub25VcGRhdGUodik7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICAgICAgICAgIHZhbHVlVHJhbnNpdGlvbi5vbkNvbXBsZXRlICYmIHZhbHVlVHJhbnNpdGlvbi5vbkNvbXBsZXRlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG5hbWUsXG4gICAgICAgIG1vdGlvblZhbHVlOiB2YWx1ZSxcbiAgICAgICAgZWxlbWVudDogaXNIYW5kb2ZmID8gdW5kZWZpbmVkIDogZWxlbWVudCxcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIElmIHRoZXJlJ3Mgbm8gdHJhbnNpdGlvbiBkZWZpbmVkIGZvciB0aGlzIHZhbHVlLCB3ZSBjYW4gZ2VuZXJhdGVcbiAgICAgKiB1bmlxdWUgdHJhbnNpdGlvbiBzZXR0aW5ncyBmb3IgdGhpcyB2YWx1ZS5cbiAgICAgKi9cbiAgICBpZiAoIWlzVHJhbnNpdGlvbkRlZmluZWQodmFsdWVUcmFuc2l0aW9uKSkge1xuICAgICAgICBPYmplY3QuYXNzaWduKG9wdGlvbnMsIGdldERlZmF1bHRUcmFuc2l0aW9uKG5hbWUsIG9wdGlvbnMpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQm90aCBXQUFQSSBhbmQgb3VyIGludGVybmFsIGFuaW1hdGlvbiBmdW5jdGlvbnMgdXNlIGR1cmF0aW9uc1xuICAgICAqIGFzIGRlZmluZWQgYnkgbWlsbGlzZWNvbmRzLCB3aGlsZSBvdXIgZXh0ZXJuYWwgQVBJIGRlZmluZXMgdGhlbVxuICAgICAqIGFzIHNlY29uZHMuXG4gICAgICovXG4gICAgb3B0aW9ucy5kdXJhdGlvbiAmJiAob3B0aW9ucy5kdXJhdGlvbiA9IHNlY29uZHNUb01pbGxpc2Vjb25kcyhvcHRpb25zLmR1cmF0aW9uKSk7XG4gICAgb3B0aW9ucy5yZXBlYXREZWxheSAmJiAob3B0aW9ucy5yZXBlYXREZWxheSA9IHNlY29uZHNUb01pbGxpc2Vjb25kcyhvcHRpb25zLnJlcGVhdERlbGF5KSk7XG4gICAgLyoqXG4gICAgICogU3VwcG9ydCBkZXByZWNhdGVkIHdheSB0byBzZXQgaW5pdGlhbCB2YWx1ZS4gUHJlZmVyIGtleWZyYW1lIHN5bnRheC5cbiAgICAgKi9cbiAgICBpZiAob3B0aW9ucy5mcm9tICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgb3B0aW9ucy5rZXlmcmFtZXNbMF0gPSBvcHRpb25zLmZyb207XG4gICAgfVxuICAgIGxldCBzaG91bGRTa2lwID0gZmFsc2U7XG4gICAgaWYgKG9wdGlvbnMudHlwZSA9PT0gZmFsc2UgfHxcbiAgICAgICAgKG9wdGlvbnMuZHVyYXRpb24gPT09IDAgJiYgIW9wdGlvbnMucmVwZWF0RGVsYXkpKSB7XG4gICAgICAgIG1ha2VBbmltYXRpb25JbnN0YW50KG9wdGlvbnMpO1xuICAgICAgICBpZiAob3B0aW9ucy5kZWxheSA9PT0gMCkge1xuICAgICAgICAgICAgc2hvdWxkU2tpcCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1vdGlvbkdsb2JhbENvbmZpZy5pbnN0YW50QW5pbWF0aW9ucyB8fFxuICAgICAgICBNb3Rpb25HbG9iYWxDb25maWcuc2tpcEFuaW1hdGlvbnMgfHxcbiAgICAgICAgZWxlbWVudD8uc2hvdWxkU2tpcEFuaW1hdGlvbnMpIHtcbiAgICAgICAgc2hvdWxkU2tpcCA9IHRydWU7XG4gICAgICAgIG1ha2VBbmltYXRpb25JbnN0YW50KG9wdGlvbnMpO1xuICAgICAgICBvcHRpb25zLmRlbGF5ID0gMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSWYgdGhlIHRyYW5zaXRpb24gdHlwZSBvciBlYXNpbmcgaGFzIGJlZW4gZXhwbGljaXRseSBzZXQgYnkgdGhlIHVzZXJcbiAgICAgKiB0aGVuIHdlIGRvbid0IHdhbnQgdG8gYWxsb3cgZmxhdHRlbmluZyB0aGUgYW5pbWF0aW9uLlxuICAgICAqL1xuICAgIG9wdGlvbnMuYWxsb3dGbGF0dGVuID0gIXZhbHVlVHJhbnNpdGlvbi50eXBlICYmICF2YWx1ZVRyYW5zaXRpb24uZWFzZTtcbiAgICAvKipcbiAgICAgKiBJZiB3ZSBjYW4gb3IgbXVzdCBza2lwIGNyZWF0aW5nIHRoZSBhbmltYXRpb24sIGFuZCBhcHBseSBvbmx5XG4gICAgICogdGhlIGZpbmFsIGtleWZyYW1lLCBkbyBzby4gV2UgYWxzbyBjaGVjayBvbmNlIGtleWZyYW1lcyBhcmUgcmVzb2x2ZWQgYnV0XG4gICAgICogdGhpcyBlYXJseSBjaGVjayBwcmV2ZW50cyB0aGUgbmVlZCB0byBjcmVhdGUgYW4gYW5pbWF0aW9uIGF0IGFsbC5cbiAgICAgKi9cbiAgICBpZiAoc2hvdWxkU2tpcCAmJiAhaXNIYW5kb2ZmICYmIHZhbHVlLmdldCgpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgZmluYWxLZXlmcmFtZSA9IGdldEZpbmFsS2V5ZnJhbWUob3B0aW9ucy5rZXlmcmFtZXMsIHZhbHVlVHJhbnNpdGlvbik7XG4gICAgICAgIGlmIChmaW5hbEtleWZyYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZyYW1lLnVwZGF0ZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5vblVwZGF0ZShmaW5hbEtleWZyYW1lKTtcbiAgICAgICAgICAgICAgICBvcHRpb25zLm9uQ29tcGxldGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVRyYW5zaXRpb24uaXNTeW5jXG4gICAgICAgID8gbmV3IEpTQW5pbWF0aW9uKG9wdGlvbnMpXG4gICAgICAgIDogbmV3IEFzeW5jTW90aW9uVmFsdWVBbmltYXRpb24ob3B0aW9ucyk7XG59O1xuXG5leHBvcnQgeyBhbmltYXRlTW90aW9uVmFsdWUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1vdGlvbi12YWx1ZS5tanMubWFwXG4iLCJmdW5jdGlvbiBnZXRWYWx1ZVN0YXRlKHZpc3VhbEVsZW1lbnQpIHtcbiAgICBjb25zdCBzdGF0ZSA9IFt7fSwge31dO1xuICAgIHZpc3VhbEVsZW1lbnQ/LnZhbHVlcy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIHN0YXRlWzBdW2tleV0gPSB2YWx1ZS5nZXQoKTtcbiAgICAgICAgc3RhdGVbMV1ba2V5XSA9IHZhbHVlLmdldFZlbG9jaXR5KCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0YXRlO1xufVxuZnVuY3Rpb24gcmVzb2x2ZVZhcmlhbnRGcm9tUHJvcHMocHJvcHMsIGRlZmluaXRpb24sIGN1c3RvbSwgdmlzdWFsRWxlbWVudCkge1xuICAgIC8qKlxuICAgICAqIElmIHRoZSB2YXJpYW50IGRlZmluaXRpb24gaXMgYSBmdW5jdGlvbiwgcmVzb2x2ZS5cbiAgICAgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluaXRpb24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjb25zdCBbY3VycmVudCwgdmVsb2NpdHldID0gZ2V0VmFsdWVTdGF0ZSh2aXN1YWxFbGVtZW50KTtcbiAgICAgICAgZGVmaW5pdGlvbiA9IGRlZmluaXRpb24oY3VzdG9tICE9PSB1bmRlZmluZWQgPyBjdXN0b20gOiBwcm9wcy5jdXN0b20sIGN1cnJlbnQsIHZlbG9jaXR5KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSWYgdGhlIHZhcmlhbnQgZGVmaW5pdGlvbiBpcyBhIHZhcmlhbnQgbGFiZWwsIG9yXG4gICAgICogdGhlIGZ1bmN0aW9uIHJldHVybmVkIGEgdmFyaWFudCBsYWJlbCwgcmVzb2x2ZS5cbiAgICAgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluaXRpb24gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgZGVmaW5pdGlvbiA9IHByb3BzLnZhcmlhbnRzICYmIHByb3BzLnZhcmlhbnRzW2RlZmluaXRpb25dO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBdCB0aGlzIHBvaW50IHdlJ3ZlIHJlc29sdmVkIGJvdGggZnVuY3Rpb25zIGFuZCB2YXJpYW50IGxhYmVscyxcbiAgICAgKiBidXQgdGhlIHJlc29sdmVkIHZhcmlhbnQgbGFiZWwgbWlnaHQgaXRzZWxmIGhhdmUgYmVlbiBhIGZ1bmN0aW9uLlxuICAgICAqIElmIHNvLCByZXNvbHZlLiBUaGlzIGNhbiBvbmx5IGhhdmUgcmV0dXJuZWQgYSB2YWxpZCB0YXJnZXQgb2JqZWN0LlxuICAgICAqL1xuICAgIGlmICh0eXBlb2YgZGVmaW5pdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNvbnN0IFtjdXJyZW50LCB2ZWxvY2l0eV0gPSBnZXRWYWx1ZVN0YXRlKHZpc3VhbEVsZW1lbnQpO1xuICAgICAgICBkZWZpbml0aW9uID0gZGVmaW5pdGlvbihjdXN0b20gIT09IHVuZGVmaW5lZCA/IGN1c3RvbSA6IHByb3BzLmN1c3RvbSwgY3VycmVudCwgdmVsb2NpdHkpO1xuICAgIH1cbiAgICByZXR1cm4gZGVmaW5pdGlvbjtcbn1cblxuZXhwb3J0IHsgcmVzb2x2ZVZhcmlhbnRGcm9tUHJvcHMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlc29sdmUtdmFyaWFudHMubWpzLm1hcFxuIiwiaW1wb3J0IHsgdHJhbnNmb3JtUHJvcE9yZGVyIH0gZnJvbSAnLi9rZXlzLXRyYW5zZm9ybS5tanMnO1xuXG5jb25zdCBwb3NpdGlvbmFsS2V5cyA9IG5ldyBTZXQoW1xuICAgIFwid2lkdGhcIixcbiAgICBcImhlaWdodFwiLFxuICAgIFwidG9wXCIsXG4gICAgXCJsZWZ0XCIsXG4gICAgXCJyaWdodFwiLFxuICAgIFwiYm90dG9tXCIsXG4gICAgLi4udHJhbnNmb3JtUHJvcE9yZGVyLFxuXSk7XG5cbmV4cG9ydCB7IHBvc2l0aW9uYWxLZXlzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1rZXlzLXBvc2l0aW9uLm1qcy5tYXBcbiIsImltcG9ydCB7IHdhcm5PbmNlLCBTdWJzY3JpcHRpb25NYW5hZ2VyLCB2ZWxvY2l0eVBlclNlY29uZCB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyB0aW1lIH0gZnJvbSAnLi4vZnJhbWVsb29wL3N5bmMtdGltZS5tanMnO1xuaW1wb3J0IHsgZnJhbWUgfSBmcm9tICcuLi9mcmFtZWxvb3AvZnJhbWUubWpzJztcblxuLyoqXG4gKiBNYXhpbXVtIHRpbWUgYmV0d2VlbiB0aGUgdmFsdWUgb2YgdHdvIGZyYW1lcywgYmV5b25kIHdoaWNoIHdlXG4gKiBhc3N1bWUgdGhlIHZlbG9jaXR5IGhhcyBzaW5jZSBiZWVuIDAuXG4gKi9cbmNvbnN0IE1BWF9WRUxPQ0lUWV9ERUxUQSA9IDMwO1xuY29uc3QgaXNGbG9hdCA9ICh2YWx1ZSkgPT4ge1xuICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdCh2YWx1ZSkpO1xufTtcbmNvbnN0IGNvbGxlY3RNb3Rpb25WYWx1ZXMgPSB7XG4gICAgY3VycmVudDogdW5kZWZpbmVkLFxufTtcbi8qKlxuICogYE1vdGlvblZhbHVlYCBpcyB1c2VkIHRvIHRyYWNrIHRoZSBzdGF0ZSBhbmQgdmVsb2NpdHkgb2YgbW90aW9uIHZhbHVlcy5cbiAqXG4gKiBAcHVibGljXG4gKi9cbmNsYXNzIE1vdGlvblZhbHVlIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gaW5pdCAtIFRoZSBpbml0aWF0aW5nIHZhbHVlXG4gICAgICogQHBhcmFtIGNvbmZpZyAtIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgICAqXG4gICAgICogLSAgYHRyYW5zZm9ybWVyYDogQSBmdW5jdGlvbiB0byB0cmFuc2Zvcm0gaW5jb21pbmcgdmFsdWVzIHdpdGguXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoaW5pdCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUcmFja3Mgd2hldGhlciB0aGlzIHZhbHVlIGNhbiBvdXRwdXQgYSB2ZWxvY2l0eS4gQ3VycmVudGx5IHRoaXMgaXMgb25seSB0cnVlXG4gICAgICAgICAqIGlmIHRoZSB2YWx1ZSBpcyBudW1lcmljYWwsIGJ1dCB3ZSBtaWdodCBiZSBhYmxlIHRvIHdpZGVuIHRoZSBzY29wZSBoZXJlIGFuZCBzdXBwb3J0XG4gICAgICAgICAqIG90aGVyIHZhbHVlIHR5cGVzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAaW50ZXJuYWxcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2FuVHJhY2tWZWxvY2l0eSA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbiBvYmplY3QgY29udGFpbmluZyBhIFN1YnNjcmlwdGlvbk1hbmFnZXIgZm9yIGVhY2ggYWN0aXZlIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5ldmVudHMgPSB7fTtcbiAgICAgICAgdGhpcy51cGRhdGVBbmROb3RpZnkgPSAodikgPT4ge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFRpbWUgPSB0aW1lLm5vdygpO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiB3ZSdyZSB1cGRhdGluZyB0aGUgdmFsdWUgZHVyaW5nIGFub3RoZXIgZnJhbWUgb3IgZXZlbnRsb29wXG4gICAgICAgICAgICAgKiB0aGFuIHRoZSBwcmV2aW91cyBmcmFtZSwgdGhlbiB0aGUgd2Ugc2V0IHRoZSBwcmV2aW91cyBmcmFtZSB2YWx1ZVxuICAgICAgICAgICAgICogdG8gY3VycmVudC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHRoaXMudXBkYXRlZEF0ICE9PSBjdXJyZW50VGltZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0UHJldkZyYW1lVmFsdWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJldiA9IHRoaXMuY3VycmVudDtcbiAgICAgICAgICAgIHRoaXMuc2V0Q3VycmVudCh2KTtcbiAgICAgICAgICAgIC8vIFVwZGF0ZSB1cGRhdGUgc3Vic2NyaWJlcnNcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnQgIT09IHRoaXMucHJldikge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLmNoYW5nZT8ubm90aWZ5KHRoaXMuY3VycmVudCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVwZW5kZW50cykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGRlcGVuZGVudCBvZiB0aGlzLmRlcGVuZGVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcGVuZGVudC5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmhhc0FuaW1hdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2V0Q3VycmVudChpbml0KTtcbiAgICAgICAgdGhpcy5vd25lciA9IG9wdGlvbnMub3duZXI7XG4gICAgfVxuICAgIHNldEN1cnJlbnQoY3VycmVudCkge1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBjdXJyZW50O1xuICAgICAgICB0aGlzLnVwZGF0ZWRBdCA9IHRpbWUubm93KCk7XG4gICAgICAgIGlmICh0aGlzLmNhblRyYWNrVmVsb2NpdHkgPT09IG51bGwgJiYgY3VycmVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNhblRyYWNrVmVsb2NpdHkgPSBpc0Zsb2F0KHRoaXMuY3VycmVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2V0UHJldkZyYW1lVmFsdWUocHJldkZyYW1lVmFsdWUgPSB0aGlzLmN1cnJlbnQpIHtcbiAgICAgICAgdGhpcy5wcmV2RnJhbWVWYWx1ZSA9IHByZXZGcmFtZVZhbHVlO1xuICAgICAgICB0aGlzLnByZXZVcGRhdGVkQXQgPSB0aGlzLnVwZGF0ZWRBdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkcyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBub3RpZmllZCB3aGVuIHRoZSBgTW90aW9uVmFsdWVgIGlzIHVwZGF0ZWQuXG4gICAgICpcbiAgICAgKiBJdCByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsIHdpbGwgY2FuY2VsIHRoZSBzdWJzY3JpcHRpb24uXG4gICAgICpcbiAgICAgKiBXaGVuIGNhbGxpbmcgYG9uQ2hhbmdlYCBpbnNpZGUgYSBSZWFjdCBjb21wb25lbnQsIGl0IHNob3VsZCBiZSB3cmFwcGVkIHdpdGggdGhlXG4gICAgICogYHVzZUVmZmVjdGAgaG9vay4gQXMgaXQgcmV0dXJucyBhbiB1bnN1YnNjcmliZSBmdW5jdGlvbiwgdGhpcyBzaG91bGQgYmUgcmV0dXJuZWRcbiAgICAgKiBmcm9tIHRoZSBgdXNlRWZmZWN0YCBmdW5jdGlvbiB0byBlbnN1cmUgeW91IGRvbid0IGFkZCBkdXBsaWNhdGUgc3Vic2NyaWJlcnMuLlxuICAgICAqXG4gICAgICogYGBganN4XG4gICAgICogZXhwb3J0IGNvbnN0IE15Q29tcG9uZW50ID0gKCkgPT4ge1xuICAgICAqICAgY29uc3QgeCA9IHVzZU1vdGlvblZhbHVlKDApXG4gICAgICogICBjb25zdCB5ID0gdXNlTW90aW9uVmFsdWUoMClcbiAgICAgKiAgIGNvbnN0IG9wYWNpdHkgPSB1c2VNb3Rpb25WYWx1ZSgxKVxuICAgICAqXG4gICAgICogICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAqICAgICBmdW5jdGlvbiB1cGRhdGVPcGFjaXR5KCkge1xuICAgICAqICAgICAgIGNvbnN0IG1heFhZID0gTWF0aC5tYXgoeC5nZXQoKSwgeS5nZXQoKSlcbiAgICAgKiAgICAgICBjb25zdCBuZXdPcGFjaXR5ID0gdHJhbnNmb3JtKG1heFhZLCBbMCwgMTAwXSwgWzEsIDBdKVxuICAgICAqICAgICAgIG9wYWNpdHkuc2V0KG5ld09wYWNpdHkpXG4gICAgICogICAgIH1cbiAgICAgKlxuICAgICAqICAgICBjb25zdCB1bnN1YnNjcmliZVggPSB4Lm9uKFwiY2hhbmdlXCIsIHVwZGF0ZU9wYWNpdHkpXG4gICAgICogICAgIGNvbnN0IHVuc3Vic2NyaWJlWSA9IHkub24oXCJjaGFuZ2VcIiwgdXBkYXRlT3BhY2l0eSlcbiAgICAgKlxuICAgICAqICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAqICAgICAgIHVuc3Vic2NyaWJlWCgpXG4gICAgICogICAgICAgdW5zdWJzY3JpYmVZKClcbiAgICAgKiAgICAgfVxuICAgICAqICAgfSwgW10pXG4gICAgICpcbiAgICAgKiAgIHJldHVybiA8bW90aW9uLmRpdiBzdHlsZT17eyB4IH19IC8+XG4gICAgICogfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHBhcmFtIHN1YnNjcmliZXIgLSBBIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgdGhlIGxhdGVzdCB2YWx1ZS5cbiAgICAgKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLCB3aWxsIGNhbmNlbCB0aGlzIHN1YnNjcmlwdGlvbi5cbiAgICAgKlxuICAgICAqIEBkZXByZWNhdGVkXG4gICAgICovXG4gICAgb25DaGFuZ2Uoc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgICAgIHdhcm5PbmNlKGZhbHNlLCBgdmFsdWUub25DaGFuZ2UoY2FsbGJhY2spIGlzIGRlcHJlY2F0ZWQuIFN3aXRjaCB0byB2YWx1ZS5vbihcImNoYW5nZVwiLCBjYWxsYmFjaykuYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMub24oXCJjaGFuZ2VcIiwgc3Vic2NyaXB0aW9uKTtcbiAgICB9XG4gICAgb24oZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoIXRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPSBuZXcgU3Vic2NyaXB0aW9uTWFuYWdlcigpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHVuc3Vic2NyaWJlID0gdGhpcy5ldmVudHNbZXZlbnROYW1lXS5hZGQoY2FsbGJhY2spO1xuICAgICAgICBpZiAoZXZlbnROYW1lID09PSBcImNoYW5nZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgd2UgaGF2ZSBubyBtb3JlIGNoYW5nZSBsaXN0ZW5lcnMgYnkgdGhlIHN0YXJ0XG4gICAgICAgICAgICAgICAgICogb2YgdGhlIG5leHQgZnJhbWUsIHN0b3AgYWN0aXZlIGFuaW1hdGlvbnMuXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZnJhbWUucmVhZCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5ldmVudHMuY2hhbmdlLmdldFNpemUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuc3Vic2NyaWJlO1xuICAgIH1cbiAgICBjbGVhckxpc3RlbmVycygpIHtcbiAgICAgICAgZm9yIChjb25zdCBldmVudE1hbmFnZXJzIGluIHRoaXMuZXZlbnRzKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudE1hbmFnZXJzXS5jbGVhcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEF0dGFjaGVzIGEgcGFzc2l2ZSBlZmZlY3QgdG8gdGhlIGBNb3Rpb25WYWx1ZWAuXG4gICAgICovXG4gICAgYXR0YWNoKHBhc3NpdmVFZmZlY3QsIHN0b3BQYXNzaXZlRWZmZWN0KSB7XG4gICAgICAgIHRoaXMucGFzc2l2ZUVmZmVjdCA9IHBhc3NpdmVFZmZlY3Q7XG4gICAgICAgIHRoaXMuc3RvcFBhc3NpdmVFZmZlY3QgPSBzdG9wUGFzc2l2ZUVmZmVjdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgc3RhdGUgb2YgdGhlIGBNb3Rpb25WYWx1ZWAuXG4gICAgICpcbiAgICAgKiBAcmVtYXJrc1xuICAgICAqXG4gICAgICogYGBganN4XG4gICAgICogY29uc3QgeCA9IHVzZU1vdGlvblZhbHVlKDApXG4gICAgICogeC5zZXQoMTApXG4gICAgICogYGBgXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbGF0ZXN0IC0gTGF0ZXN0IHZhbHVlIHRvIHNldC5cbiAgICAgKiBAcGFyYW0gcmVuZGVyIC0gV2hldGhlciB0byBub3RpZnkgcmVuZGVyIHN1YnNjcmliZXJzLiBEZWZhdWx0cyB0byBgdHJ1ZWBcbiAgICAgKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBzZXQodikge1xuICAgICAgICBpZiAoIXRoaXMucGFzc2l2ZUVmZmVjdCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVBbmROb3RpZnkodik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhc3NpdmVFZmZlY3QodiwgdGhpcy51cGRhdGVBbmROb3RpZnkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNldFdpdGhWZWxvY2l0eShwcmV2LCBjdXJyZW50LCBkZWx0YSkge1xuICAgICAgICB0aGlzLnNldChjdXJyZW50KTtcbiAgICAgICAgdGhpcy5wcmV2ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnByZXZGcmFtZVZhbHVlID0gcHJldjtcbiAgICAgICAgdGhpcy5wcmV2VXBkYXRlZEF0ID0gdGhpcy51cGRhdGVkQXQgLSBkZWx0YTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBzdGF0ZSBvZiB0aGUgYE1vdGlvblZhbHVlYCwgc3RvcHBpbmcgYW55IGFjdGl2ZSBhbmltYXRpb25zLFxuICAgICAqIGVmZmVjdHMsIGFuZCByZXNldHMgdmVsb2NpdHkgdG8gYDBgLlxuICAgICAqL1xuICAgIGp1bXAodiwgZW5kQW5pbWF0aW9uID0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnVwZGF0ZUFuZE5vdGlmeSh2KTtcbiAgICAgICAgdGhpcy5wcmV2ID0gdjtcbiAgICAgICAgdGhpcy5wcmV2VXBkYXRlZEF0ID0gdGhpcy5wcmV2RnJhbWVWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgZW5kQW5pbWF0aW9uICYmIHRoaXMuc3RvcCgpO1xuICAgICAgICBpZiAodGhpcy5zdG9wUGFzc2l2ZUVmZmVjdClcbiAgICAgICAgICAgIHRoaXMuc3RvcFBhc3NpdmVFZmZlY3QoKTtcbiAgICB9XG4gICAgZGlydHkoKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzLmNoYW5nZT8ubm90aWZ5KHRoaXMuY3VycmVudCk7XG4gICAgfVxuICAgIGFkZERlcGVuZGVudChkZXBlbmRlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRlcGVuZGVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuZGVwZW5kZW50cyA9IG5ldyBTZXQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlcGVuZGVudHMuYWRkKGRlcGVuZGVudCk7XG4gICAgfVxuICAgIHJlbW92ZURlcGVuZGVudChkZXBlbmRlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZGVwZW5kZW50cykge1xuICAgICAgICAgICAgdGhpcy5kZXBlbmRlbnRzLmRlbGV0ZShkZXBlbmRlbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGxhdGVzdCBzdGF0ZSBvZiBgTW90aW9uVmFsdWVgXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyAtIFRoZSBsYXRlc3Qgc3RhdGUgb2YgYE1vdGlvblZhbHVlYFxuICAgICAqXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGdldCgpIHtcbiAgICAgICAgaWYgKGNvbGxlY3RNb3Rpb25WYWx1ZXMuY3VycmVudCkge1xuICAgICAgICAgICAgY29sbGVjdE1vdGlvblZhbHVlcy5jdXJyZW50LnB1c2godGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGdldFByZXZpb3VzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmV2O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBsYXRlc3QgdmVsb2NpdHkgb2YgYE1vdGlvblZhbHVlYFxuICAgICAqXG4gICAgICogQHJldHVybnMgLSBUaGUgbGF0ZXN0IHZlbG9jaXR5IG9mIGBNb3Rpb25WYWx1ZWAuIFJldHVybnMgYDBgIGlmIHRoZSBzdGF0ZSBpcyBub24tbnVtZXJpY2FsLlxuICAgICAqXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGdldFZlbG9jaXR5KCkge1xuICAgICAgICBjb25zdCBjdXJyZW50VGltZSA9IHRpbWUubm93KCk7XG4gICAgICAgIGlmICghdGhpcy5jYW5UcmFja1ZlbG9jaXR5IHx8XG4gICAgICAgICAgICB0aGlzLnByZXZGcmFtZVZhbHVlID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lIC0gdGhpcy51cGRhdGVkQXQgPiBNQVhfVkVMT0NJVFlfREVMVEEpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlbHRhID0gTWF0aC5taW4odGhpcy51cGRhdGVkQXQgLSB0aGlzLnByZXZVcGRhdGVkQXQsIE1BWF9WRUxPQ0lUWV9ERUxUQSk7XG4gICAgICAgIC8vIENhc3RzIGJlY2F1c2Ugb2YgcGFyc2VGbG9hdCdzIHBvb3IgdHlwaW5nXG4gICAgICAgIHJldHVybiB2ZWxvY2l0eVBlclNlY29uZChwYXJzZUZsb2F0KHRoaXMuY3VycmVudCkgLVxuICAgICAgICAgICAgcGFyc2VGbG9hdCh0aGlzLnByZXZGcmFtZVZhbHVlKSwgZGVsdGEpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSBuZXcgYW5pbWF0aW9uIHRvIGNvbnRyb2wgdGhpcyBgTW90aW9uVmFsdWVgLiBPbmx5IG9uZVxuICAgICAqIGFuaW1hdGlvbiBjYW4gZHJpdmUgYSBgTW90aW9uVmFsdWVgIGF0IG9uZSB0aW1lLlxuICAgICAqXG4gICAgICogYGBganN4XG4gICAgICogdmFsdWUuc3RhcnQoKVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQHBhcmFtIGFuaW1hdGlvbiAtIEEgZnVuY3Rpb24gdGhhdCBzdGFydHMgdGhlIHByb3ZpZGVkIGFuaW1hdGlvblxuICAgICAqL1xuICAgIHN0YXJ0KHN0YXJ0QW5pbWF0aW9uKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGFzQW5pbWF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24gPSBzdGFydEFuaW1hdGlvbihyZXNvbHZlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmV2ZW50cy5hbmltYXRpb25TdGFydCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLmFuaW1hdGlvblN0YXJ0Lm5vdGlmeSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmV2ZW50cy5hbmltYXRpb25Db21wbGV0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzLmFuaW1hdGlvbkNvbXBsZXRlLm5vdGlmeSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jbGVhckFuaW1hdGlvbigpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3RvcCB0aGUgY3VycmVudGx5IGFjdGl2ZSBhbmltYXRpb24uXG4gICAgICpcbiAgICAgKiBAcHVibGljXG4gICAgICovXG4gICAgc3RvcCgpIHtcbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5zdG9wKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5ldmVudHMuYW5pbWF0aW9uQ2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuYW5pbWF0aW9uQ2FuY2VsLm5vdGlmeSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xlYXJBbmltYXRpb24oKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhpcyB2YWx1ZSBpcyBjdXJyZW50bHkgYW5pbWF0aW5nLlxuICAgICAqXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGlzQW5pbWF0aW5nKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLmFuaW1hdGlvbjtcbiAgICB9XG4gICAgY2xlYXJBbmltYXRpb24oKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmFuaW1hdGlvbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGVzdHJveSBhbmQgY2xlYW4gdXAgc3Vic2NyaWJlcnMgdG8gdGhpcyBgTW90aW9uVmFsdWVgLlxuICAgICAqXG4gICAgICogVGhlIGBNb3Rpb25WYWx1ZWAgaG9va3MgbGlrZSBgdXNlTW90aW9uVmFsdWVgIGFuZCBgdXNlVHJhbnNmb3JtYCBhdXRvbWF0aWNhbGx5XG4gICAgICogaGFuZGxlIHRoZSBsaWZlY3ljbGUgb2YgdGhlIHJldHVybmVkIGBNb3Rpb25WYWx1ZWAsIHNvIHRoaXMgbWV0aG9kIGlzIG9ubHkgbmVjZXNzYXJ5IGlmIHlvdSd2ZSBtYW51YWxseVxuICAgICAqIGNyZWF0ZWQgYSBgTW90aW9uVmFsdWVgIHZpYSB0aGUgYG1vdGlvblZhbHVlYCBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKi9cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLmRlcGVuZGVudHM/LmNsZWFyKCk7XG4gICAgICAgIHRoaXMuZXZlbnRzLmRlc3Ryb3k/Lm5vdGlmeSgpO1xuICAgICAgICB0aGlzLmNsZWFyTGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICBpZiAodGhpcy5zdG9wUGFzc2l2ZUVmZmVjdCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wUGFzc2l2ZUVmZmVjdCgpO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gbW90aW9uVmFsdWUoaW5pdCwgb3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgTW90aW9uVmFsdWUoaW5pdCwgb3B0aW9ucyk7XG59XG5cbmV4cG9ydCB7IE1vdGlvblZhbHVlLCBjb2xsZWN0TW90aW9uVmFsdWVzLCBtb3Rpb25WYWx1ZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXgubWpzLm1hcFxuIiwiY29uc3QgaXNNb3Rpb25WYWx1ZSA9ICh2YWx1ZSkgPT4gQm9vbGVhbih2YWx1ZSAmJiB2YWx1ZS5nZXRWZWxvY2l0eSk7XG5cbmV4cG9ydCB7IGlzTW90aW9uVmFsdWUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzLW1vdGlvbi12YWx1ZS5tanMubWFwXG4iLCJmdW5jdGlvbiBjYW1lbFRvRGFzaChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbQS1aXSkvZywgKG1hdGNoKSA9PiBgLSR7bWF0Y2gudG9Mb3dlckNhc2UoKX1gKTtcbn1cblxuZXhwb3J0IHsgY2FtZWxUb0Rhc2ggfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNhbWVsLXRvLWRhc2gubWpzLm1hcFxuIiwiaW1wb3J0IHsgY2FtZWxUb0Rhc2ggfSBmcm9tICcuLi8uLi9yZW5kZXIvZG9tL3V0aWxzL2NhbWVsLXRvLWRhc2gubWpzJztcblxuY29uc3Qgb3B0aW1pemVkQXBwZWFyRGF0YUlkID0gXCJmcmFtZXJBcHBlYXJJZFwiO1xuY29uc3Qgb3B0aW1pemVkQXBwZWFyRGF0YUF0dHJpYnV0ZSA9IFwiZGF0YS1cIiArIGNhbWVsVG9EYXNoKG9wdGltaXplZEFwcGVhckRhdGFJZCk7XG5cbmV4cG9ydCB7IG9wdGltaXplZEFwcGVhckRhdGFBdHRyaWJ1dGUsIG9wdGltaXplZEFwcGVhckRhdGFJZCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YS1pZC5tanMubWFwXG4iLCJpbXBvcnQgeyBvcHRpbWl6ZWRBcHBlYXJEYXRhQXR0cmlidXRlIH0gZnJvbSAnLi9kYXRhLWlkLm1qcyc7XG5cbmZ1bmN0aW9uIGdldE9wdGltaXNlZEFwcGVhcklkKHZpc3VhbEVsZW1lbnQpIHtcbiAgICByZXR1cm4gdmlzdWFsRWxlbWVudC5wcm9wc1tvcHRpbWl6ZWRBcHBlYXJEYXRhQXR0cmlidXRlXTtcbn1cblxuZXhwb3J0IHsgZ2V0T3B0aW1pc2VkQXBwZWFySWQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdldC1hcHBlYXItaWQubWpzLm1hcFxuIiwiLyoqXG4gKiBWYWx1ZVR5cGUgZm9yIFwiYXV0b1wiXG4gKi9cbmNvbnN0IGF1dG8gPSB7XG4gICAgdGVzdDogKHYpID0+IHYgPT09IFwiYXV0b1wiLFxuICAgIHBhcnNlOiAodikgPT4gdixcbn07XG5cbmV4cG9ydCB7IGF1dG8gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWF1dG8ubWpzLm1hcFxuIiwiLyoqXG4gKiBUZXN0cyBhIHByb3ZpZGVkIHZhbHVlIGFnYWluc3QgYSBWYWx1ZVR5cGVcbiAqL1xuY29uc3QgdGVzdFZhbHVlVHlwZSA9ICh2KSA9PiAodHlwZSkgPT4gdHlwZS50ZXN0KHYpO1xuXG5leHBvcnQgeyB0ZXN0VmFsdWVUeXBlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD10ZXN0Lm1qcy5tYXBcbiIsImltcG9ydCB7IGF1dG8gfSBmcm9tICcuL2F1dG8ubWpzJztcbmltcG9ydCB7IG51bWJlciB9IGZyb20gJy4vbnVtYmVycy9pbmRleC5tanMnO1xuaW1wb3J0IHsgcHgsIHBlcmNlbnQsIGRlZ3JlZXMsIHZ3LCB2aCB9IGZyb20gJy4vbnVtYmVycy91bml0cy5tanMnO1xuaW1wb3J0IHsgdGVzdFZhbHVlVHlwZSB9IGZyb20gJy4vdGVzdC5tanMnO1xuXG4vKipcbiAqIEEgbGlzdCBvZiB2YWx1ZSB0eXBlcyBjb21tb25seSB1c2VkIGZvciBkaW1lbnNpb25zXG4gKi9cbmNvbnN0IGRpbWVuc2lvblZhbHVlVHlwZXMgPSBbbnVtYmVyLCBweCwgcGVyY2VudCwgZGVncmVlcywgdncsIHZoLCBhdXRvXTtcbi8qKlxuICogVGVzdHMgYSBkaW1lbnNpb25hbCB2YWx1ZSBhZ2FpbnN0IHRoZSBsaXN0IG9mIGRpbWVuc2lvbiBWYWx1ZVR5cGVzXG4gKi9cbmNvbnN0IGZpbmREaW1lbnNpb25WYWx1ZVR5cGUgPSAodikgPT4gZGltZW5zaW9uVmFsdWVUeXBlcy5maW5kKHRlc3RWYWx1ZVR5cGUodikpO1xuXG5leHBvcnQgeyBkaW1lbnNpb25WYWx1ZVR5cGVzLCBmaW5kRGltZW5zaW9uVmFsdWVUeXBlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kaW1lbnNpb25zLm1qcy5tYXBcbiIsImltcG9ydCB7IGlzWmVyb1ZhbHVlU3RyaW5nIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcblxuZnVuY3Rpb24gaXNOb25lKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IDA7XG4gICAgfVxuICAgIGVsc2UgaWYgKHZhbHVlICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gXCJub25lXCIgfHwgdmFsdWUgPT09IFwiMFwiIHx8IGlzWmVyb1ZhbHVlU3RyaW5nKHZhbHVlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgaXNOb25lIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pcy1ub25lLm1qcy5tYXBcbiIsImltcG9ydCB7IGNvbXBsZXggfSBmcm9tICcuL2luZGV4Lm1qcyc7XG5pbXBvcnQgeyBmbG9hdFJlZ2V4IH0gZnJvbSAnLi4vdXRpbHMvZmxvYXQtcmVnZXgubWpzJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIHRoYXQgc2hvdWxkIGRlZmF1bHQgdG8gMSBvciAxMDAlXG4gKi9cbmNvbnN0IG1heERlZmF1bHRzID0gbmV3IFNldChbXCJicmlnaHRuZXNzXCIsIFwiY29udHJhc3RcIiwgXCJzYXR1cmF0ZVwiLCBcIm9wYWNpdHlcIl0pO1xuZnVuY3Rpb24gYXBwbHlEZWZhdWx0RmlsdGVyKHYpIHtcbiAgICBjb25zdCBbbmFtZSwgdmFsdWVdID0gdi5zbGljZSgwLCAtMSkuc3BsaXQoXCIoXCIpO1xuICAgIGlmIChuYW1lID09PSBcImRyb3Atc2hhZG93XCIpXG4gICAgICAgIHJldHVybiB2O1xuICAgIGNvbnN0IFtudW1iZXJdID0gdmFsdWUubWF0Y2goZmxvYXRSZWdleCkgfHwgW107XG4gICAgaWYgKCFudW1iZXIpXG4gICAgICAgIHJldHVybiB2O1xuICAgIGNvbnN0IHVuaXQgPSB2YWx1ZS5yZXBsYWNlKG51bWJlciwgXCJcIik7XG4gICAgbGV0IGRlZmF1bHRWYWx1ZSA9IG1heERlZmF1bHRzLmhhcyhuYW1lKSA/IDEgOiAwO1xuICAgIGlmIChudW1iZXIgIT09IHZhbHVlKVxuICAgICAgICBkZWZhdWx0VmFsdWUgKj0gMTAwO1xuICAgIHJldHVybiBuYW1lICsgXCIoXCIgKyBkZWZhdWx0VmFsdWUgKyB1bml0ICsgXCIpXCI7XG59XG5jb25zdCBmdW5jdGlvblJlZ2V4ID0gL1xcYihbYS16LV0qKVxcKC4qP1xcKS9ndTtcbmNvbnN0IGZpbHRlciA9IHtcbiAgICAuLi5jb21wbGV4LFxuICAgIGdldEFuaW1hdGFibGVOb25lOiAodikgPT4ge1xuICAgICAgICBjb25zdCBmdW5jdGlvbnMgPSB2Lm1hdGNoKGZ1bmN0aW9uUmVnZXgpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb25zID8gZnVuY3Rpb25zLm1hcChhcHBseURlZmF1bHRGaWx0ZXIpLmpvaW4oXCIgXCIpIDogdjtcbiAgICB9LFxufTtcblxuZXhwb3J0IHsgZmlsdGVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWx0ZXIubWpzLm1hcFxuIiwiaW1wb3J0IHsgY29tcGxleCB9IGZyb20gJy4vaW5kZXgubWpzJztcblxuY29uc3QgbWFzayA9IHtcbiAgICAuLi5jb21wbGV4LFxuICAgIGdldEFuaW1hdGFibGVOb25lOiAodikgPT4ge1xuICAgICAgICBjb25zdCBwYXJzZWQgPSBjb21wbGV4LnBhcnNlKHYpO1xuICAgICAgICBjb25zdCB0cmFuc2Zvcm1lciA9IGNvbXBsZXguY3JlYXRlVHJhbnNmb3JtZXIodik7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1lcihwYXJzZWQubWFwKCh2KSA9PiB0eXBlb2YgdiA9PT0gXCJudW1iZXJcIiA/IDAgOiB0eXBlb2YgdiA9PT0gXCJvYmplY3RcIiA/IHsgLi4udiwgYWxwaGE6IDEgfSA6IHYpKTtcbiAgICB9LFxufTtcblxuZXhwb3J0IHsgbWFzayB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFzay5tanMubWFwXG4iLCJpbXBvcnQgeyBudW1iZXIgfSBmcm9tICcuL251bWJlcnMvaW5kZXgubWpzJztcblxuY29uc3QgaW50ID0ge1xuICAgIC4uLm51bWJlcixcbiAgICB0cmFuc2Zvcm06IE1hdGgucm91bmQsXG59O1xuXG5leHBvcnQgeyBpbnQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWludC5tanMubWFwXG4iLCJpbXBvcnQgeyBhbHBoYSwgc2NhbGUgfSBmcm9tICcuLi9udW1iZXJzL2luZGV4Lm1qcyc7XG5pbXBvcnQgeyBweCwgcHJvZ3Jlc3NQZXJjZW50YWdlLCBkZWdyZWVzIH0gZnJvbSAnLi4vbnVtYmVycy91bml0cy5tanMnO1xuXG5jb25zdCB0cmFuc2Zvcm1WYWx1ZVR5cGVzID0ge1xuICAgIHJvdGF0ZTogZGVncmVlcyxcbiAgICByb3RhdGVYOiBkZWdyZWVzLFxuICAgIHJvdGF0ZVk6IGRlZ3JlZXMsXG4gICAgcm90YXRlWjogZGVncmVlcyxcbiAgICBzY2FsZSxcbiAgICBzY2FsZVg6IHNjYWxlLFxuICAgIHNjYWxlWTogc2NhbGUsXG4gICAgc2NhbGVaOiBzY2FsZSxcbiAgICBza2V3OiBkZWdyZWVzLFxuICAgIHNrZXdYOiBkZWdyZWVzLFxuICAgIHNrZXdZOiBkZWdyZWVzLFxuICAgIGRpc3RhbmNlOiBweCxcbiAgICB0cmFuc2xhdGVYOiBweCxcbiAgICB0cmFuc2xhdGVZOiBweCxcbiAgICB0cmFuc2xhdGVaOiBweCxcbiAgICB4OiBweCxcbiAgICB5OiBweCxcbiAgICB6OiBweCxcbiAgICBwZXJzcGVjdGl2ZTogcHgsXG4gICAgdHJhbnNmb3JtUGVyc3BlY3RpdmU6IHB4LFxuICAgIG9wYWNpdHk6IGFscGhhLFxuICAgIG9yaWdpblg6IHByb2dyZXNzUGVyY2VudGFnZSxcbiAgICBvcmlnaW5ZOiBwcm9ncmVzc1BlcmNlbnRhZ2UsXG4gICAgb3JpZ2luWjogcHgsXG59O1xuXG5leHBvcnQgeyB0cmFuc2Zvcm1WYWx1ZVR5cGVzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD10cmFuc2Zvcm0ubWpzLm1hcFxuIiwiaW1wb3J0IHsgaW50IH0gZnJvbSAnLi4vaW50Lm1qcyc7XG5pbXBvcnQgeyBhbHBoYSB9IGZyb20gJy4uL251bWJlcnMvaW5kZXgubWpzJztcbmltcG9ydCB7IHB4IH0gZnJvbSAnLi4vbnVtYmVycy91bml0cy5tanMnO1xuaW1wb3J0IHsgdHJhbnNmb3JtVmFsdWVUeXBlcyB9IGZyb20gJy4vdHJhbnNmb3JtLm1qcyc7XG5cbmNvbnN0IG51bWJlclZhbHVlVHlwZXMgPSB7XG4gICAgLy8gQm9yZGVyIHByb3BzXG4gICAgYm9yZGVyV2lkdGg6IHB4LFxuICAgIGJvcmRlclRvcFdpZHRoOiBweCxcbiAgICBib3JkZXJSaWdodFdpZHRoOiBweCxcbiAgICBib3JkZXJCb3R0b21XaWR0aDogcHgsXG4gICAgYm9yZGVyTGVmdFdpZHRoOiBweCxcbiAgICBib3JkZXJSYWRpdXM6IHB4LFxuICAgIGJvcmRlclRvcExlZnRSYWRpdXM6IHB4LFxuICAgIGJvcmRlclRvcFJpZ2h0UmFkaXVzOiBweCxcbiAgICBib3JkZXJCb3R0b21SaWdodFJhZGl1czogcHgsXG4gICAgYm9yZGVyQm90dG9tTGVmdFJhZGl1czogcHgsXG4gICAgLy8gUG9zaXRpb25pbmcgcHJvcHNcbiAgICB3aWR0aDogcHgsXG4gICAgbWF4V2lkdGg6IHB4LFxuICAgIGhlaWdodDogcHgsXG4gICAgbWF4SGVpZ2h0OiBweCxcbiAgICB0b3A6IHB4LFxuICAgIHJpZ2h0OiBweCxcbiAgICBib3R0b206IHB4LFxuICAgIGxlZnQ6IHB4LFxuICAgIGluc2V0OiBweCxcbiAgICBpbnNldEJsb2NrOiBweCxcbiAgICBpbnNldEJsb2NrU3RhcnQ6IHB4LFxuICAgIGluc2V0QmxvY2tFbmQ6IHB4LFxuICAgIGluc2V0SW5saW5lOiBweCxcbiAgICBpbnNldElubGluZVN0YXJ0OiBweCxcbiAgICBpbnNldElubGluZUVuZDogcHgsXG4gICAgLy8gU3BhY2luZyBwcm9wc1xuICAgIHBhZGRpbmc6IHB4LFxuICAgIHBhZGRpbmdUb3A6IHB4LFxuICAgIHBhZGRpbmdSaWdodDogcHgsXG4gICAgcGFkZGluZ0JvdHRvbTogcHgsXG4gICAgcGFkZGluZ0xlZnQ6IHB4LFxuICAgIHBhZGRpbmdCbG9jazogcHgsXG4gICAgcGFkZGluZ0Jsb2NrU3RhcnQ6IHB4LFxuICAgIHBhZGRpbmdCbG9ja0VuZDogcHgsXG4gICAgcGFkZGluZ0lubGluZTogcHgsXG4gICAgcGFkZGluZ0lubGluZVN0YXJ0OiBweCxcbiAgICBwYWRkaW5nSW5saW5lRW5kOiBweCxcbiAgICBtYXJnaW46IHB4LFxuICAgIG1hcmdpblRvcDogcHgsXG4gICAgbWFyZ2luUmlnaHQ6IHB4LFxuICAgIG1hcmdpbkJvdHRvbTogcHgsXG4gICAgbWFyZ2luTGVmdDogcHgsXG4gICAgbWFyZ2luQmxvY2s6IHB4LFxuICAgIG1hcmdpbkJsb2NrU3RhcnQ6IHB4LFxuICAgIG1hcmdpbkJsb2NrRW5kOiBweCxcbiAgICBtYXJnaW5JbmxpbmU6IHB4LFxuICAgIG1hcmdpbklubGluZVN0YXJ0OiBweCxcbiAgICBtYXJnaW5JbmxpbmVFbmQ6IHB4LFxuICAgIC8vIFR5cG9ncmFwaHlcbiAgICBmb250U2l6ZTogcHgsXG4gICAgLy8gTWlzY1xuICAgIGJhY2tncm91bmRQb3NpdGlvblg6IHB4LFxuICAgIGJhY2tncm91bmRQb3NpdGlvblk6IHB4LFxuICAgIC4uLnRyYW5zZm9ybVZhbHVlVHlwZXMsXG4gICAgekluZGV4OiBpbnQsXG4gICAgLy8gU1ZHXG4gICAgZmlsbE9wYWNpdHk6IGFscGhhLFxuICAgIHN0cm9rZU9wYWNpdHk6IGFscGhhLFxuICAgIG51bU9jdGF2ZXM6IGludCxcbn07XG5cbmV4cG9ydCB7IG51bWJlclZhbHVlVHlwZXMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW51bWJlci5tanMubWFwXG4iLCJpbXBvcnQgeyBjb2xvciB9IGZyb20gJy4uL2NvbG9yL2luZGV4Lm1qcyc7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICcuLi9jb21wbGV4L2ZpbHRlci5tanMnO1xuaW1wb3J0IHsgbWFzayB9IGZyb20gJy4uL2NvbXBsZXgvbWFzay5tanMnO1xuaW1wb3J0IHsgbnVtYmVyVmFsdWVUeXBlcyB9IGZyb20gJy4vbnVtYmVyLm1qcyc7XG5cbi8qKlxuICogQSBtYXAgb2YgZGVmYXVsdCB2YWx1ZSB0eXBlcyBmb3IgY29tbW9uIHZhbHVlc1xuICovXG5jb25zdCBkZWZhdWx0VmFsdWVUeXBlcyA9IHtcbiAgICAuLi5udW1iZXJWYWx1ZVR5cGVzLFxuICAgIC8vIENvbG9yIHByb3BzXG4gICAgY29sb3IsXG4gICAgYmFja2dyb3VuZENvbG9yOiBjb2xvcixcbiAgICBvdXRsaW5lQ29sb3I6IGNvbG9yLFxuICAgIGZpbGw6IGNvbG9yLFxuICAgIHN0cm9rZTogY29sb3IsXG4gICAgLy8gQm9yZGVyIHByb3BzXG4gICAgYm9yZGVyQ29sb3I6IGNvbG9yLFxuICAgIGJvcmRlclRvcENvbG9yOiBjb2xvcixcbiAgICBib3JkZXJSaWdodENvbG9yOiBjb2xvcixcbiAgICBib3JkZXJCb3R0b21Db2xvcjogY29sb3IsXG4gICAgYm9yZGVyTGVmdENvbG9yOiBjb2xvcixcbiAgICBmaWx0ZXIsXG4gICAgV2Via2l0RmlsdGVyOiBmaWx0ZXIsXG4gICAgbWFzayxcbiAgICBXZWJraXRNYXNrOiBtYXNrLFxufTtcbi8qKlxuICogR2V0cyB0aGUgZGVmYXVsdCBWYWx1ZVR5cGUgZm9yIHRoZSBwcm92aWRlZCB2YWx1ZSBrZXlcbiAqL1xuY29uc3QgZ2V0RGVmYXVsdFZhbHVlVHlwZSA9IChrZXkpID0+IGRlZmF1bHRWYWx1ZVR5cGVzW2tleV07XG5cbmV4cG9ydCB7IGRlZmF1bHRWYWx1ZVR5cGVzLCBnZXREZWZhdWx0VmFsdWVUeXBlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kZWZhdWx0cy5tanMubWFwXG4iLCJpbXBvcnQgeyBjb21wbGV4IH0gZnJvbSAnLi4vY29tcGxleC9pbmRleC5tanMnO1xuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAnLi4vY29tcGxleC9maWx0ZXIubWpzJztcbmltcG9ydCB7IG1hc2sgfSBmcm9tICcuLi9jb21wbGV4L21hc2subWpzJztcbmltcG9ydCB7IGdldERlZmF1bHRWYWx1ZVR5cGUgfSBmcm9tICcuLi9tYXBzL2RlZmF1bHRzLm1qcyc7XG5cbmNvbnN0IGN1c3RvbVR5cGVzID0gLypAX19QVVJFX18qLyBuZXcgU2V0KFtmaWx0ZXIsIG1hc2tdKTtcbmZ1bmN0aW9uIGdldEFuaW1hdGFibGVOb25lKGtleSwgdmFsdWUpIHtcbiAgICBsZXQgZGVmYXVsdFZhbHVlVHlwZSA9IGdldERlZmF1bHRWYWx1ZVR5cGUoa2V5KTtcbiAgICBpZiAoIWN1c3RvbVR5cGVzLmhhcyhkZWZhdWx0VmFsdWVUeXBlKSlcbiAgICAgICAgZGVmYXVsdFZhbHVlVHlwZSA9IGNvbXBsZXg7XG4gICAgLy8gSWYgdmFsdWUgaXMgbm90IHJlY29nbmlzZWQgYXMgYW5pbWF0YWJsZSwgaWUgXCJub25lXCIsIGNyZWF0ZSBhbiBhbmltYXRhYmxlIHZlcnNpb24gb3JpZ2luIGJhc2VkIG9uIHRoZSB0YXJnZXRcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlVHlwZS5nZXRBbmltYXRhYmxlTm9uZVxuICAgICAgICA/IGRlZmF1bHRWYWx1ZVR5cGUuZ2V0QW5pbWF0YWJsZU5vbmUodmFsdWUpXG4gICAgICAgIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgeyBnZXRBbmltYXRhYmxlTm9uZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YW5pbWF0YWJsZS1ub25lLm1qcy5tYXBcbiIsImltcG9ydCB7IGFuYWx5c2VDb21wbGV4VmFsdWUgfSBmcm9tICcuLi8uLi8uLi92YWx1ZS90eXBlcy9jb21wbGV4L2luZGV4Lm1qcyc7XG5pbXBvcnQgeyBnZXRBbmltYXRhYmxlTm9uZSB9IGZyb20gJy4uLy4uLy4uL3ZhbHVlL3R5cGVzL3V0aWxzL2FuaW1hdGFibGUtbm9uZS5tanMnO1xuXG4vKipcbiAqIElmIHdlIGVuY291bnRlciBrZXlmcmFtZXMgbGlrZSBcIm5vbmVcIiBvciBcIjBcIiBhbmQgd2UgYWxzbyBoYXZlIGtleWZyYW1lcyBsaWtlXG4gKiBcIiNmZmZcIiBvciBcIjIwMHB4IDIwMHB4XCIgd2Ugd2FudCB0byBmaW5kIGEga2V5ZnJhbWUgdG8gc2VydmUgYXMgYSB0ZW1wbGF0ZSBmb3JcbiAqIHRoZSBcIm5vbmVcIiBrZXlmcmFtZXMuIEluIHRoaXMgY2FzZSBcIiNmZmZcIiBvciBcIjIwMHB4IDIwMHB4XCIgLSB0aGVuIHRoZXNlIGdldCB0dXJuZWQgaW50b1xuICogemVybyBlcXVpdmFsZW50cywgaS5lLiBcIiNmZmYwXCIgb3IgXCIwcHggMHB4XCIuXG4gKi9cbmNvbnN0IGludmFsaWRUZW1wbGF0ZXMgPSBuZXcgU2V0KFtcImF1dG9cIiwgXCJub25lXCIsIFwiMFwiXSk7XG5mdW5jdGlvbiBtYWtlTm9uZUtleWZyYW1lc0FuaW1hdGFibGUodW5yZXNvbHZlZEtleWZyYW1lcywgbm9uZUtleWZyYW1lSW5kZXhlcywgbmFtZSkge1xuICAgIGxldCBpID0gMDtcbiAgICBsZXQgYW5pbWF0YWJsZVRlbXBsYXRlID0gdW5kZWZpbmVkO1xuICAgIHdoaWxlIChpIDwgdW5yZXNvbHZlZEtleWZyYW1lcy5sZW5ndGggJiYgIWFuaW1hdGFibGVUZW1wbGF0ZSkge1xuICAgICAgICBjb25zdCBrZXlmcmFtZSA9IHVucmVzb2x2ZWRLZXlmcmFtZXNbaV07XG4gICAgICAgIGlmICh0eXBlb2Yga2V5ZnJhbWUgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgICFpbnZhbGlkVGVtcGxhdGVzLmhhcyhrZXlmcmFtZSkgJiZcbiAgICAgICAgICAgIGFuYWx5c2VDb21wbGV4VmFsdWUoa2V5ZnJhbWUpLnZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGFuaW1hdGFibGVUZW1wbGF0ZSA9IHVucmVzb2x2ZWRLZXlmcmFtZXNbaV07XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgIH1cbiAgICBpZiAoYW5pbWF0YWJsZVRlbXBsYXRlICYmIG5hbWUpIHtcbiAgICAgICAgZm9yIChjb25zdCBub25lSW5kZXggb2Ygbm9uZUtleWZyYW1lSW5kZXhlcykge1xuICAgICAgICAgICAgdW5yZXNvbHZlZEtleWZyYW1lc1tub25lSW5kZXhdID0gZ2V0QW5pbWF0YWJsZU5vbmUobmFtZSwgYW5pbWF0YWJsZVRlbXBsYXRlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHsgbWFrZU5vbmVLZXlmcmFtZXNBbmltYXRhYmxlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYWtlLW5vbmUtYW5pbWF0YWJsZS5tanMubWFwXG4iLCJpbXBvcnQgeyBwb3NpdGlvbmFsS2V5cyB9IGZyb20gJy4uLy4uL3JlbmRlci91dGlscy9rZXlzLXBvc2l0aW9uLm1qcyc7XG5pbXBvcnQgeyBmaW5kRGltZW5zaW9uVmFsdWVUeXBlIH0gZnJvbSAnLi4vLi4vdmFsdWUvdHlwZXMvZGltZW5zaW9ucy5tanMnO1xuaW1wb3J0IHsgZ2V0VmFyaWFibGVWYWx1ZSB9IGZyb20gJy4uL3V0aWxzL2Nzcy12YXJpYWJsZXMtY29udmVyc2lvbi5tanMnO1xuaW1wb3J0IHsgaXNDU1NWYXJpYWJsZVRva2VuLCBjb250YWluc0NTU1ZhcmlhYmxlIH0gZnJvbSAnLi4vdXRpbHMvaXMtY3NzLXZhcmlhYmxlLm1qcyc7XG5pbXBvcnQgeyBLZXlmcmFtZVJlc29sdmVyIH0gZnJvbSAnLi9LZXlmcmFtZXNSZXNvbHZlci5tanMnO1xuaW1wb3J0IHsgaXNOb25lIH0gZnJvbSAnLi91dGlscy9pcy1ub25lLm1qcyc7XG5pbXBvcnQgeyBtYWtlTm9uZUtleWZyYW1lc0FuaW1hdGFibGUgfSBmcm9tICcuL3V0aWxzL21ha2Utbm9uZS1hbmltYXRhYmxlLm1qcyc7XG5pbXBvcnQgeyBwb3NpdGlvbmFsVmFsdWVzLCBpc051bU9yUHhUeXBlIH0gZnJvbSAnLi91dGlscy91bml0LWNvbnZlcnNpb24ubWpzJztcblxuY2xhc3MgRE9NS2V5ZnJhbWVzUmVzb2x2ZXIgZXh0ZW5kcyBLZXlmcmFtZVJlc29sdmVyIHtcbiAgICBjb25zdHJ1Y3Rvcih1bnJlc29sdmVkS2V5ZnJhbWVzLCBvbkNvbXBsZXRlLCBuYW1lLCBtb3Rpb25WYWx1ZSwgZWxlbWVudCkge1xuICAgICAgICBzdXBlcih1bnJlc29sdmVkS2V5ZnJhbWVzLCBvbkNvbXBsZXRlLCBuYW1lLCBtb3Rpb25WYWx1ZSwgZWxlbWVudCwgdHJ1ZSk7XG4gICAgfVxuICAgIHJlYWRLZXlmcmFtZXMoKSB7XG4gICAgICAgIGNvbnN0IHsgdW5yZXNvbHZlZEtleWZyYW1lcywgZWxlbWVudCwgbmFtZSB9ID0gdGhpcztcbiAgICAgICAgaWYgKCFlbGVtZW50IHx8ICFlbGVtZW50LmN1cnJlbnQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHN1cGVyLnJlYWRLZXlmcmFtZXMoKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGFueSBrZXlmcmFtZSBpcyBhIENTUyB2YXJpYWJsZSwgd2UgbmVlZCB0byBmaW5kIGl0cyB2YWx1ZSBieSBzYW1wbGluZyB0aGUgZWxlbWVudFxuICAgICAgICAgKi9cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1bnJlc29sdmVkS2V5ZnJhbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQga2V5ZnJhbWUgPSB1bnJlc29sdmVkS2V5ZnJhbWVzW2ldO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBrZXlmcmFtZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIGtleWZyYW1lID0ga2V5ZnJhbWUudHJpbSgpO1xuICAgICAgICAgICAgICAgIGlmIChpc0NTU1ZhcmlhYmxlVG9rZW4oa2V5ZnJhbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc29sdmVkID0gZ2V0VmFyaWFibGVWYWx1ZShrZXlmcmFtZSwgZWxlbWVudC5jdXJyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc29sdmVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVucmVzb2x2ZWRLZXlmcmFtZXNbaV0gPSByZXNvbHZlZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PT0gdW5yZXNvbHZlZEtleWZyYW1lcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmFsS2V5ZnJhbWUgPSBrZXlmcmFtZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzb2x2ZSBcIm5vbmVcIiB2YWx1ZXMuIFdlIGRvIHRoaXMgcG90ZW50aWFsbHkgdHdpY2UgLSBvbmNlIGJlZm9yZSBhbmQgb25jZSBhZnRlciBtZWFzdXJpbmcga2V5ZnJhbWVzLlxuICAgICAgICAgKiBUaGlzIGNvdWxkIGJlIHNlZW4gYXMgaW5lZmZpY2llbnQgYnV0IGl0J3MgYSB0cmFkZS1vZmYgdG8gYXZvaWQgbWVhc3VyZW1lbnRzIGluIG1vcmUgc2l0dWF0aW9ucywgd2hpY2hcbiAgICAgICAgICogaGF2ZSBhIGZhciBiaWdnZXIgcGVyZm9ybWFuY2UgaW1wYWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yZXNvbHZlTm9uZUtleWZyYW1lcygpO1xuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2sgdG8gc2VlIGlmIHVuaXQgdHlwZSBoYXMgY2hhbmdlZC4gSWYgc28gc2NoZWR1bGUgam9icyB0aGF0IHdpbGxcbiAgICAgICAgICogdGVtcG9yYXJpbHkgc2V0IHN0eWxlcyB0byB0aGUgZGVzdGluYXRpb24ga2V5ZnJhbWVzLlxuICAgICAgICAgKiBTa2lwIGlmIHdlIGhhdmUgbW9yZSB0aGFuIHR3byBrZXlmcmFtZXMgb3IgdGhpcyBpc24ndCBhIHBvc2l0aW9uYWwgdmFsdWUuXG4gICAgICAgICAqIFRPRE86IFdlIGNhbiB0aHJvdyBpZiB0aGVyZSBhcmUgbXVsdGlwbGUga2V5ZnJhbWVzIGFuZCB0aGUgdmFsdWUgdHlwZSBjaGFuZ2VzLlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKCFwb3NpdGlvbmFsS2V5cy5oYXMobmFtZSkgfHwgdW5yZXNvbHZlZEtleWZyYW1lcy5sZW5ndGggIT09IDIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBbb3JpZ2luLCB0YXJnZXRdID0gdW5yZXNvbHZlZEtleWZyYW1lcztcbiAgICAgICAgY29uc3Qgb3JpZ2luVHlwZSA9IGZpbmREaW1lbnNpb25WYWx1ZVR5cGUob3JpZ2luKTtcbiAgICAgICAgY29uc3QgdGFyZ2V0VHlwZSA9IGZpbmREaW1lbnNpb25WYWx1ZVR5cGUodGFyZ2V0KTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIG9uZSBrZXlmcmFtZSBjb250YWlucyBlbWJlZGRlZCBDU1MgdmFyaWFibGVzIChlLmcuIGluIGNhbGMoKSkgYW5kIHRoZSBvdGhlclxuICAgICAgICAgKiBkb2Vzbid0LCB3ZSBuZWVkIHRvIG1lYXN1cmUgdG8gY29udmVydCB0byBwaXhlbHMuIFRoaXMgaGFuZGxlcyBHaXRIdWIgaXNzdWUgIzM0MTAuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBvcmlnaW5IYXNWYXIgPSBjb250YWluc0NTU1ZhcmlhYmxlKG9yaWdpbik7XG4gICAgICAgIGNvbnN0IHRhcmdldEhhc1ZhciA9IGNvbnRhaW5zQ1NTVmFyaWFibGUodGFyZ2V0KTtcbiAgICAgICAgaWYgKG9yaWdpbkhhc1ZhciAhPT0gdGFyZ2V0SGFzVmFyICYmIHBvc2l0aW9uYWxWYWx1ZXNbbmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMubmVlZHNNZWFzdXJlbWVudCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVpdGhlciB3ZSBkb24ndCByZWNvZ25pc2UgdGhlc2UgdmFsdWUgdHlwZXMgb3Igd2UgY2FuIGFuaW1hdGUgYmV0d2VlbiB0aGVtLlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKG9yaWdpblR5cGUgPT09IHRhcmdldFR5cGUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBib3RoIHZhbHVlcyBhcmUgbnVtYmVycyBvciBwaXhlbHMsIHdlIGNhbiBhbmltYXRlIGJldHdlZW4gdGhlbSBieVxuICAgICAgICAgKiBjb252ZXJ0aW5nIHRoZW0gdG8gbnVtYmVycy5cbiAgICAgICAgICovXG4gICAgICAgIGlmIChpc051bU9yUHhUeXBlKG9yaWdpblR5cGUpICYmIGlzTnVtT3JQeFR5cGUodGFyZ2V0VHlwZSkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdW5yZXNvbHZlZEtleWZyYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdW5yZXNvbHZlZEtleWZyYW1lc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHVucmVzb2x2ZWRLZXlmcmFtZXNbaV0gPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocG9zaXRpb25hbFZhbHVlc1tuYW1lXSkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFbHNlLCB0aGUgb25seSB3YXkgdG8gcmVzb2x2ZSB0aGlzIGlzIGJ5IG1lYXN1cmluZyB0aGUgZWxlbWVudC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5uZWVkc01lYXN1cmVtZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXNvbHZlTm9uZUtleWZyYW1lcygpIHtcbiAgICAgICAgY29uc3QgeyB1bnJlc29sdmVkS2V5ZnJhbWVzLCBuYW1lIH0gPSB0aGlzO1xuICAgICAgICBjb25zdCBub25lS2V5ZnJhbWVJbmRleGVzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdW5yZXNvbHZlZEtleWZyYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHVucmVzb2x2ZWRLZXlmcmFtZXNbaV0gPT09IG51bGwgfHxcbiAgICAgICAgICAgICAgICBpc05vbmUodW5yZXNvbHZlZEtleWZyYW1lc1tpXSkpIHtcbiAgICAgICAgICAgICAgICBub25lS2V5ZnJhbWVJbmRleGVzLnB1c2goaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vbmVLZXlmcmFtZUluZGV4ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBtYWtlTm9uZUtleWZyYW1lc0FuaW1hdGFibGUodW5yZXNvbHZlZEtleWZyYW1lcywgbm9uZUtleWZyYW1lSW5kZXhlcywgbmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbWVhc3VyZUluaXRpYWxTdGF0ZSgpIHtcbiAgICAgICAgY29uc3QgeyBlbGVtZW50LCB1bnJlc29sdmVkS2V5ZnJhbWVzLCBuYW1lIH0gPSB0aGlzO1xuICAgICAgICBpZiAoIWVsZW1lbnQgfHwgIWVsZW1lbnQuY3VycmVudClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKG5hbWUgPT09IFwiaGVpZ2h0XCIpIHtcbiAgICAgICAgICAgIHRoaXMuc3VzcGVuZGVkU2Nyb2xsWSA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1lYXN1cmVkT3JpZ2luID0gcG9zaXRpb25hbFZhbHVlc1tuYW1lXShlbGVtZW50Lm1lYXN1cmVWaWV3cG9ydEJveCgpLCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LmN1cnJlbnQpKTtcbiAgICAgICAgdW5yZXNvbHZlZEtleWZyYW1lc1swXSA9IHRoaXMubWVhc3VyZWRPcmlnaW47XG4gICAgICAgIC8vIFNldCBmaW5hbCBrZXkgZnJhbWUgdG8gbWVhc3VyZSBhZnRlciBuZXh0IHJlbmRlclxuICAgICAgICBjb25zdCBtZWFzdXJlS2V5ZnJhbWUgPSB1bnJlc29sdmVkS2V5ZnJhbWVzW3VucmVzb2x2ZWRLZXlmcmFtZXMubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmIChtZWFzdXJlS2V5ZnJhbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZWxlbWVudC5nZXRWYWx1ZShuYW1lLCBtZWFzdXJlS2V5ZnJhbWUpLmp1bXAobWVhc3VyZUtleWZyYW1lLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbWVhc3VyZUVuZFN0YXRlKCkge1xuICAgICAgICBjb25zdCB7IGVsZW1lbnQsIG5hbWUsIHVucmVzb2x2ZWRLZXlmcmFtZXMgfSA9IHRoaXM7XG4gICAgICAgIGlmICghZWxlbWVudCB8fCAhZWxlbWVudC5jdXJyZW50KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGVsZW1lbnQuZ2V0VmFsdWUobmFtZSk7XG4gICAgICAgIHZhbHVlICYmIHZhbHVlLmp1bXAodGhpcy5tZWFzdXJlZE9yaWdpbiwgZmFsc2UpO1xuICAgICAgICBjb25zdCBmaW5hbEtleWZyYW1lSW5kZXggPSB1bnJlc29sdmVkS2V5ZnJhbWVzLmxlbmd0aCAtIDE7XG4gICAgICAgIGNvbnN0IGZpbmFsS2V5ZnJhbWUgPSB1bnJlc29sdmVkS2V5ZnJhbWVzW2ZpbmFsS2V5ZnJhbWVJbmRleF07XG4gICAgICAgIHVucmVzb2x2ZWRLZXlmcmFtZXNbZmluYWxLZXlmcmFtZUluZGV4XSA9IHBvc2l0aW9uYWxWYWx1ZXNbbmFtZV0oZWxlbWVudC5tZWFzdXJlVmlld3BvcnRCb3goKSwgd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudC5jdXJyZW50KSk7XG4gICAgICAgIGlmIChmaW5hbEtleWZyYW1lICE9PSBudWxsICYmIHRoaXMuZmluYWxLZXlmcmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmZpbmFsS2V5ZnJhbWUgPSBmaW5hbEtleWZyYW1lO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHdlIHJlbW92ZWQgdHJhbnNmb3JtIHZhbHVlcywgcmVhcHBseSB0aGVtIGJlZm9yZSB0aGUgbmV4dCByZW5kZXJcbiAgICAgICAgaWYgKHRoaXMucmVtb3ZlZFRyYW5zZm9ybXM/Lmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVkVHJhbnNmb3Jtcy5mb3JFYWNoKChbdW5zZXRUcmFuc2Zvcm1OYW1lLCB1bnNldFRyYW5zZm9ybVZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgLmdldFZhbHVlKHVuc2V0VHJhbnNmb3JtTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgLnNldCh1bnNldFRyYW5zZm9ybVZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzb2x2ZU5vbmVLZXlmcmFtZXMoKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IERPTUtleWZyYW1lc1Jlc29sdmVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ET01LZXlmcmFtZXNSZXNvbHZlci5tanMubWFwXG4iLCIvKipcbiAqIEEgbGlzdCBvZiB2YWx1ZXMgdGhhdCBjYW4gYmUgaGFyZHdhcmUtYWNjZWxlcmF0ZWQuXG4gKi9cbmNvbnN0IGFjY2VsZXJhdGVkVmFsdWVzID0gbmV3IFNldChbXG4gICAgXCJvcGFjaXR5XCIsXG4gICAgXCJjbGlwUGF0aFwiLFxuICAgIFwiZmlsdGVyXCIsXG4gICAgXCJ0cmFuc2Zvcm1cIixcbiAgICAvLyBUT0RPOiBDYW4gYmUgYWNjZWxlcmF0ZWQgYnV0IGN1cnJlbnRseSBkaXNhYmxlZCB1bnRpbCBodHRwczovL2lzc3Vlcy5jaHJvbWl1bS5vcmcvaXNzdWVzLzQxNDkxMDk4IGlzIHJlc29sdmVkXG4gICAgLy8gb3IgdW50aWwgd2UgaW1wbGVtZW50IHN1cHBvcnQgZm9yIGxpbmVhcigpIGVhc2luZy5cbiAgICAvLyBcImJhY2tncm91bmQtY29sb3JcIlxuXSk7XG5cbmV4cG9ydCB7IGFjY2VsZXJhdGVkVmFsdWVzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hY2NlbGVyYXRlZC12YWx1ZXMubWpzLm1hcFxuIiwiZnVuY3Rpb24gcmVzb2x2ZUVsZW1lbnRzKGVsZW1lbnRPclNlbGVjdG9yLCBzY29wZSwgc2VsZWN0b3JDYWNoZSkge1xuICAgIGlmIChlbGVtZW50T3JTZWxlY3RvciA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKGVsZW1lbnRPclNlbGVjdG9yIGluc3RhbmNlb2YgRXZlbnRUYXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIFtlbGVtZW50T3JTZWxlY3Rvcl07XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50T3JTZWxlY3RvciA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBsZXQgcm9vdCA9IGRvY3VtZW50O1xuICAgICAgICBpZiAoc2NvcGUpIHtcbiAgICAgICAgICAgIHJvb3QgPSBzY29wZS5jdXJyZW50O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gc2VsZWN0b3JDYWNoZT8uW2VsZW1lbnRPclNlbGVjdG9yXSA/P1xuICAgICAgICAgICAgcm9vdC5xdWVyeVNlbGVjdG9yQWxsKGVsZW1lbnRPclNlbGVjdG9yKTtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRzID8gQXJyYXkuZnJvbShlbGVtZW50cykgOiBbXTtcbiAgICB9XG4gICAgcmV0dXJuIEFycmF5LmZyb20oZWxlbWVudE9yU2VsZWN0b3IpLmZpbHRlcigoZWxlbWVudCkgPT4gZWxlbWVudCAhPSBudWxsKTtcbn1cblxuZXhwb3J0IHsgcmVzb2x2ZUVsZW1lbnRzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZXNvbHZlLWVsZW1lbnRzLm1qcy5tYXBcbiIsIi8qKlxuICogUHJvdmlkZWQgYSB2YWx1ZSBhbmQgYSBWYWx1ZVR5cGUsIHJldHVybnMgdGhlIHZhbHVlIGFzIHRoYXQgdmFsdWUgdHlwZS5cbiAqL1xuY29uc3QgZ2V0VmFsdWVBc1R5cGUgPSAodmFsdWUsIHR5cGUpID0+IHtcbiAgICByZXR1cm4gdHlwZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCJcbiAgICAgICAgPyB0eXBlLnRyYW5zZm9ybSh2YWx1ZSlcbiAgICAgICAgOiB2YWx1ZTtcbn07XG5cbmV4cG9ydCB7IGdldFZhbHVlQXNUeXBlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1nZXQtYXMtdHlwZS5tanMubWFwXG4iLCJpbXBvcnQgeyBjcmVhdGVSZW5kZXJCYXRjaGVyIH0gZnJvbSAnLi9iYXRjaGVyLm1qcyc7XG5cbmNvbnN0IHsgc2NoZWR1bGU6IG1pY3JvdGFzaywgY2FuY2VsOiBjYW5jZWxNaWNyb3Rhc2sgfSA9IFxuLyogQF9fUFVSRV9fICovIGNyZWF0ZVJlbmRlckJhdGNoZXIocXVldWVNaWNyb3Rhc2ssIGZhbHNlKTtcblxuZXhwb3J0IHsgY2FuY2VsTWljcm90YXNrLCBtaWNyb3Rhc2sgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1pY3JvdGFzay5tanMubWFwXG4iLCJpbXBvcnQgeyBpc09iamVjdCB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGFuIGVsZW1lbnQgaXMgYW4gU1ZHIGVsZW1lbnQgaW4gYSB3YXlcbiAqIHRoYXQgd29ya3MgYWNyb3NzIGlmcmFtZXNcbiAqL1xuZnVuY3Rpb24gaXNTVkdFbGVtZW50KGVsZW1lbnQpIHtcbiAgICByZXR1cm4gaXNPYmplY3QoZWxlbWVudCkgJiYgXCJvd25lclNWR0VsZW1lbnRcIiBpbiBlbGVtZW50O1xufVxuXG5leHBvcnQgeyBpc1NWR0VsZW1lbnQgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzLXN2Zy1lbGVtZW50Lm1qcy5tYXBcbiIsImltcG9ydCB7IGlzU1ZHRWxlbWVudCB9IGZyb20gJy4vaXMtc3ZnLWVsZW1lbnQubWpzJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYW4gZWxlbWVudCBpcyBzcGVjaWZpY2FsbHkgYW4gU1ZHU1ZHRWxlbWVudCAodGhlIHJvb3QgU1ZHIGVsZW1lbnQpXG4gKiBpbiBhIHdheSB0aGF0IHdvcmtzIGFjcm9zcyBpZnJhbWVzXG4gKi9cbmZ1bmN0aW9uIGlzU1ZHU1ZHRWxlbWVudChlbGVtZW50KSB7XG4gICAgcmV0dXJuIGlzU1ZHRWxlbWVudChlbGVtZW50KSAmJiBlbGVtZW50LnRhZ05hbWUgPT09IFwic3ZnXCI7XG59XG5cbmV4cG9ydCB7IGlzU1ZHU1ZHRWxlbWVudCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtc3ZnLXN2Zy1lbGVtZW50Lm1qcy5tYXBcbiIsImltcG9ydCB7IGNvbG9yIH0gZnJvbSAnLi4vY29sb3IvaW5kZXgubWpzJztcbmltcG9ydCB7IGNvbXBsZXggfSBmcm9tICcuLi9jb21wbGV4L2luZGV4Lm1qcyc7XG5pbXBvcnQgeyBkaW1lbnNpb25WYWx1ZVR5cGVzIH0gZnJvbSAnLi4vZGltZW5zaW9ucy5tanMnO1xuaW1wb3J0IHsgdGVzdFZhbHVlVHlwZSB9IGZyb20gJy4uL3Rlc3QubWpzJztcblxuLyoqXG4gKiBBIGxpc3Qgb2YgYWxsIFZhbHVlVHlwZXNcbiAqL1xuY29uc3QgdmFsdWVUeXBlcyA9IFsuLi5kaW1lbnNpb25WYWx1ZVR5cGVzLCBjb2xvciwgY29tcGxleF07XG4vKipcbiAqIFRlc3RzIGEgdmFsdWUgYWdhaW5zdCB0aGUgbGlzdCBvZiBWYWx1ZVR5cGVzXG4gKi9cbmNvbnN0IGZpbmRWYWx1ZVR5cGUgPSAodikgPT4gdmFsdWVUeXBlcy5maW5kKHRlc3RWYWx1ZVR5cGUodikpO1xuXG5leHBvcnQgeyBmaW5kVmFsdWVUeXBlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maW5kLm1qcy5tYXBcbiIsImNvbnN0IGNyZWF0ZUF4aXNEZWx0YSA9ICgpID0+ICh7XG4gICAgdHJhbnNsYXRlOiAwLFxuICAgIHNjYWxlOiAxLFxuICAgIG9yaWdpbjogMCxcbiAgICBvcmlnaW5Qb2ludDogMCxcbn0pO1xuY29uc3QgY3JlYXRlRGVsdGEgPSAoKSA9PiAoe1xuICAgIHg6IGNyZWF0ZUF4aXNEZWx0YSgpLFxuICAgIHk6IGNyZWF0ZUF4aXNEZWx0YSgpLFxufSk7XG5jb25zdCBjcmVhdGVBeGlzID0gKCkgPT4gKHsgbWluOiAwLCBtYXg6IDAgfSk7XG5jb25zdCBjcmVhdGVCb3ggPSAoKSA9PiAoe1xuICAgIHg6IGNyZWF0ZUF4aXMoKSxcbiAgICB5OiBjcmVhdGVBeGlzKCksXG59KTtcblxuZXhwb3J0IHsgY3JlYXRlQXhpcywgY3JlYXRlQXhpc0RlbHRhLCBjcmVhdGVCb3gsIGNyZWF0ZURlbHRhIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tb2RlbHMubWpzLm1hcFxuIiwiY29uc3QgdmlzdWFsRWxlbWVudFN0b3JlID0gbmV3IFdlYWtNYXAoKTtcblxuZXhwb3J0IHsgdmlzdWFsRWxlbWVudFN0b3JlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdG9yZS5tanMubWFwXG4iLCJmdW5jdGlvbiBpc0FuaW1hdGlvbkNvbnRyb2xzKHYpIHtcbiAgICByZXR1cm4gKHYgIT09IG51bGwgJiZcbiAgICAgICAgdHlwZW9mIHYgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgdHlwZW9mIHYuc3RhcnQgPT09IFwiZnVuY3Rpb25cIik7XG59XG5cbmV4cG9ydCB7IGlzQW5pbWF0aW9uQ29udHJvbHMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzLWFuaW1hdGlvbi1jb250cm9scy5tanMubWFwXG4iLCIvKipcbiAqIERlY2lkZXMgaWYgdGhlIHN1cHBsaWVkIHZhcmlhYmxlIGlzIHZhcmlhbnQgbGFiZWxcbiAqL1xuZnVuY3Rpb24gaXNWYXJpYW50TGFiZWwodikge1xuICAgIHJldHVybiB0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIiB8fCBBcnJheS5pc0FycmF5KHYpO1xufVxuXG5leHBvcnQgeyBpc1ZhcmlhbnRMYWJlbCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtdmFyaWFudC1sYWJlbC5tanMubWFwXG4iLCJjb25zdCB2YXJpYW50UHJpb3JpdHlPcmRlciA9IFtcbiAgICBcImFuaW1hdGVcIixcbiAgICBcIndoaWxlSW5WaWV3XCIsXG4gICAgXCJ3aGlsZUZvY3VzXCIsXG4gICAgXCJ3aGlsZUhvdmVyXCIsXG4gICAgXCJ3aGlsZVRhcFwiLFxuICAgIFwid2hpbGVEcmFnXCIsXG4gICAgXCJleGl0XCIsXG5dO1xuY29uc3QgdmFyaWFudFByb3BzID0gW1wiaW5pdGlhbFwiLCAuLi52YXJpYW50UHJpb3JpdHlPcmRlcl07XG5cbmV4cG9ydCB7IHZhcmlhbnRQcmlvcml0eU9yZGVyLCB2YXJpYW50UHJvcHMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXZhcmlhbnQtcHJvcHMubWpzLm1hcFxuIiwiaW1wb3J0IHsgaXNBbmltYXRpb25Db250cm9scyB9IGZyb20gJy4vaXMtYW5pbWF0aW9uLWNvbnRyb2xzLm1qcyc7XG5pbXBvcnQgeyBpc1ZhcmlhbnRMYWJlbCB9IGZyb20gJy4vaXMtdmFyaWFudC1sYWJlbC5tanMnO1xuaW1wb3J0IHsgdmFyaWFudFByb3BzIH0gZnJvbSAnLi92YXJpYW50LXByb3BzLm1qcyc7XG5cbmZ1bmN0aW9uIGlzQ29udHJvbGxpbmdWYXJpYW50cyhwcm9wcykge1xuICAgIHJldHVybiAoaXNBbmltYXRpb25Db250cm9scyhwcm9wcy5hbmltYXRlKSB8fFxuICAgICAgICB2YXJpYW50UHJvcHMuc29tZSgobmFtZSkgPT4gaXNWYXJpYW50TGFiZWwocHJvcHNbbmFtZV0pKSk7XG59XG5mdW5jdGlvbiBpc1ZhcmlhbnROb2RlKHByb3BzKSB7XG4gICAgcmV0dXJuIEJvb2xlYW4oaXNDb250cm9sbGluZ1ZhcmlhbnRzKHByb3BzKSB8fCBwcm9wcy52YXJpYW50cyk7XG59XG5cbmV4cG9ydCB7IGlzQ29udHJvbGxpbmdWYXJpYW50cywgaXNWYXJpYW50Tm9kZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtY29udHJvbGxpbmctdmFyaWFudHMubWpzLm1hcFxuIiwiaW1wb3J0IHsgbW90aW9uVmFsdWUgfSBmcm9tICcuLi8uLi92YWx1ZS9pbmRleC5tanMnO1xuaW1wb3J0IHsgaXNNb3Rpb25WYWx1ZSB9IGZyb20gJy4uLy4uL3ZhbHVlL3V0aWxzL2lzLW1vdGlvbi12YWx1ZS5tanMnO1xuXG4vKipcbiAqIFVwZGF0ZXMgbW90aW9uIHZhbHVlcyBmcm9tIHByb3BzIGNoYW5nZXMuXG4gKiBVc2VzIGBhbnlgIHR5cGUgZm9yIGVsZW1lbnQgdG8gYXZvaWQgY2lyY3VsYXIgZGVwZW5kZW5jaWVzIHdpdGggVmlzdWFsRWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gdXBkYXRlTW90aW9uVmFsdWVzRnJvbVByb3BzKGVsZW1lbnQsIG5leHQsIHByZXYpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBuZXh0KSB7XG4gICAgICAgIGNvbnN0IG5leHRWYWx1ZSA9IG5leHRba2V5XTtcbiAgICAgICAgY29uc3QgcHJldlZhbHVlID0gcHJldltrZXldO1xuICAgICAgICBpZiAoaXNNb3Rpb25WYWx1ZShuZXh0VmFsdWUpKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHRoaXMgaXMgYSBtb3Rpb24gdmFsdWUgZm91bmQgaW4gcHJvcHMgb3Igc3R5bGUsIHdlIHdhbnQgdG8gYWRkIGl0XG4gICAgICAgICAgICAgKiB0byBvdXIgdmlzdWFsIGVsZW1lbnQncyBtb3Rpb24gdmFsdWUgbWFwLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBlbGVtZW50LmFkZFZhbHVlKGtleSwgbmV4dFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc01vdGlvblZhbHVlKHByZXZWYWx1ZSkpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgd2UncmUgc3dhcHBpbmcgZnJvbSBhIG1vdGlvbiB2YWx1ZSB0byBhIHN0YXRpYyB2YWx1ZSxcbiAgICAgICAgICAgICAqIGNyZWF0ZSBhIG5ldyBtb3Rpb24gdmFsdWUgZnJvbSB0aGF0XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGVsZW1lbnQuYWRkVmFsdWUoa2V5LCBtb3Rpb25WYWx1ZShuZXh0VmFsdWUsIHsgb3duZXI6IGVsZW1lbnQgfSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHByZXZWYWx1ZSAhPT0gbmV4dFZhbHVlKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHRoaXMgaXMgYSBmbGF0IHZhbHVlIHRoYXQgaGFzIGNoYW5nZWQsIHVwZGF0ZSB0aGUgbW90aW9uIHZhbHVlXG4gICAgICAgICAgICAgKiBvciBjcmVhdGUgb25lIGlmIGl0IGRvZXNuJ3QgZXhpc3QuIFdlIG9ubHkgd2FudCB0byBkbyB0aGlzIGlmIHdlJ3JlXG4gICAgICAgICAgICAgKiBub3QgaGFuZGxpbmcgdGhlIHZhbHVlIHdpdGggb3VyIGFuaW1hdGlvbiBzdGF0ZS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQuaGFzVmFsdWUoa2V5KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nVmFsdWUgPSBlbGVtZW50LmdldFZhbHVlKGtleSk7XG4gICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nVmFsdWUubGl2ZVN0eWxlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nVmFsdWUuanVtcChuZXh0VmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICghZXhpc3RpbmdWYWx1ZS5oYXNBbmltYXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBleGlzdGluZ1ZhbHVlLnNldChuZXh0VmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhdGVzdFZhbHVlID0gZWxlbWVudC5nZXRTdGF0aWNWYWx1ZShrZXkpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkVmFsdWUoa2V5LCBtb3Rpb25WYWx1ZShsYXRlc3RWYWx1ZSAhPT0gdW5kZWZpbmVkID8gbGF0ZXN0VmFsdWUgOiBuZXh0VmFsdWUsIHsgb3duZXI6IGVsZW1lbnQgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEhhbmRsZSByZW1vdmVkIHZhbHVlc1xuICAgIGZvciAoY29uc3Qga2V5IGluIHByZXYpIHtcbiAgICAgICAgaWYgKG5leHRba2V5XSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVWYWx1ZShrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gbmV4dDtcbn1cblxuZXhwb3J0IHsgdXBkYXRlTW90aW9uVmFsdWVzRnJvbVByb3BzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tb3Rpb24tdmFsdWVzLm1qcy5tYXBcbiIsIi8vIERvZXMgdGhpcyBkZXZpY2UgcHJlZmVyIHJlZHVjZWQgbW90aW9uPyBSZXR1cm5zIGBudWxsYCBzZXJ2ZXItc2lkZS5cbmNvbnN0IHByZWZlcnNSZWR1Y2VkTW90aW9uID0geyBjdXJyZW50OiBudWxsIH07XG5jb25zdCBoYXNSZWR1Y2VkTW90aW9uTGlzdGVuZXIgPSB7IGN1cnJlbnQ6IGZhbHNlIH07XG5cbmV4cG9ydCB7IGhhc1JlZHVjZWRNb3Rpb25MaXN0ZW5lciwgcHJlZmVyc1JlZHVjZWRNb3Rpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0YXRlLm1qcy5tYXBcbiIsImltcG9ydCB7IGhhc1JlZHVjZWRNb3Rpb25MaXN0ZW5lciwgcHJlZmVyc1JlZHVjZWRNb3Rpb24gfSBmcm9tICcuL3N0YXRlLm1qcyc7XG5cbmNvbnN0IGlzQnJvd3NlciA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCI7XG5mdW5jdGlvbiBpbml0UHJlZmVyc1JlZHVjZWRNb3Rpb24oKSB7XG4gICAgaGFzUmVkdWNlZE1vdGlvbkxpc3RlbmVyLmN1cnJlbnQgPSB0cnVlO1xuICAgIGlmICghaXNCcm93c2VyKVxuICAgICAgICByZXR1cm47XG4gICAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKSB7XG4gICAgICAgIGNvbnN0IG1vdGlvbk1lZGlhUXVlcnkgPSB3aW5kb3cubWF0Y2hNZWRpYShcIihwcmVmZXJzLXJlZHVjZWQtbW90aW9uKVwiKTtcbiAgICAgICAgY29uc3Qgc2V0UmVkdWNlZE1vdGlvblByZWZlcmVuY2VzID0gKCkgPT4gKHByZWZlcnNSZWR1Y2VkTW90aW9uLmN1cnJlbnQgPSBtb3Rpb25NZWRpYVF1ZXJ5Lm1hdGNoZXMpO1xuICAgICAgICBtb3Rpb25NZWRpYVF1ZXJ5LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgc2V0UmVkdWNlZE1vdGlvblByZWZlcmVuY2VzKTtcbiAgICAgICAgc2V0UmVkdWNlZE1vdGlvblByZWZlcmVuY2VzKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBwcmVmZXJzUmVkdWNlZE1vdGlvbi5jdXJyZW50ID0gZmFsc2U7XG4gICAgfVxufVxuXG5leHBvcnQgeyBoYXNSZWR1Y2VkTW90aW9uTGlzdGVuZXIsIGluaXRQcmVmZXJzUmVkdWNlZE1vdGlvbiwgcHJlZmVyc1JlZHVjZWRNb3Rpb24gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4Lm1qcy5tYXBcbiIsImltcG9ydCB7IHdhcm5PbmNlLCBzZWNvbmRzVG9NaWxsaXNlY29uZHMsIGlzTnVtZXJpY2FsU3RyaW5nLCBpc1plcm9WYWx1ZVN0cmluZywgU3Vic2NyaXB0aW9uTWFuYWdlciB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBLZXlmcmFtZVJlc29sdmVyIH0gZnJvbSAnLi4vYW5pbWF0aW9uL2tleWZyYW1lcy9LZXlmcmFtZXNSZXNvbHZlci5tanMnO1xuaW1wb3J0IHsgTmF0aXZlQW5pbWF0aW9uIH0gZnJvbSAnLi4vYW5pbWF0aW9uL05hdGl2ZUFuaW1hdGlvbi5tanMnO1xuaW1wb3J0IHsgYWNjZWxlcmF0ZWRWYWx1ZXMgfSBmcm9tICcuLi9hbmltYXRpb24vd2FhcGkvdXRpbHMvYWNjZWxlcmF0ZWQtdmFsdWVzLm1qcyc7XG5pbXBvcnQgeyBtaWNyb3Rhc2sgfSBmcm9tICcuLi9mcmFtZWxvb3AvbWljcm90YXNrLm1qcyc7XG5pbXBvcnQgeyB0aW1lIH0gZnJvbSAnLi4vZnJhbWVsb29wL3N5bmMtdGltZS5tanMnO1xuaW1wb3J0IHsgY3JlYXRlQm94IH0gZnJvbSAnLi4vcHJvamVjdGlvbi9nZW9tZXRyeS9tb2RlbHMubWpzJztcbmltcG9ydCB7IG1vdGlvblZhbHVlIH0gZnJvbSAnLi4vdmFsdWUvaW5kZXgubWpzJztcbmltcG9ydCB7IGNvbXBsZXggfSBmcm9tICcuLi92YWx1ZS90eXBlcy9jb21wbGV4L2luZGV4Lm1qcyc7XG5pbXBvcnQgeyBnZXRBbmltYXRhYmxlTm9uZSB9IGZyb20gJy4uL3ZhbHVlL3R5cGVzL3V0aWxzL2FuaW1hdGFibGUtbm9uZS5tanMnO1xuaW1wb3J0IHsgZmluZFZhbHVlVHlwZSB9IGZyb20gJy4uL3ZhbHVlL3R5cGVzL3V0aWxzL2ZpbmQubWpzJztcbmltcG9ydCB7IGlzTW90aW9uVmFsdWUgfSBmcm9tICcuLi92YWx1ZS91dGlscy9pcy1tb3Rpb24tdmFsdWUubWpzJztcbmltcG9ydCB7IHZpc3VhbEVsZW1lbnRTdG9yZSB9IGZyb20gJy4vc3RvcmUubWpzJztcbmltcG9ydCB7IGlzQ29udHJvbGxpbmdWYXJpYW50cywgaXNWYXJpYW50Tm9kZSB9IGZyb20gJy4vdXRpbHMvaXMtY29udHJvbGxpbmctdmFyaWFudHMubWpzJztcbmltcG9ydCB7IHRyYW5zZm9ybVByb3BzIH0gZnJvbSAnLi91dGlscy9rZXlzLXRyYW5zZm9ybS5tanMnO1xuaW1wb3J0IHsgdXBkYXRlTW90aW9uVmFsdWVzRnJvbVByb3BzIH0gZnJvbSAnLi91dGlscy9tb3Rpb24tdmFsdWVzLm1qcyc7XG5pbXBvcnQgeyBpbml0UHJlZmVyc1JlZHVjZWRNb3Rpb24gfSBmcm9tICcuL3V0aWxzL3JlZHVjZWQtbW90aW9uL2luZGV4Lm1qcyc7XG5pbXBvcnQgeyByZXNvbHZlVmFyaWFudEZyb21Qcm9wcyB9IGZyb20gJy4vdXRpbHMvcmVzb2x2ZS12YXJpYW50cy5tanMnO1xuaW1wb3J0IHsgaGFzUmVkdWNlZE1vdGlvbkxpc3RlbmVyLCBwcmVmZXJzUmVkdWNlZE1vdGlvbiB9IGZyb20gJy4vdXRpbHMvcmVkdWNlZC1tb3Rpb24vc3RhdGUubWpzJztcbmltcG9ydCB7IGZyYW1lLCBjYW5jZWxGcmFtZSB9IGZyb20gJy4uL2ZyYW1lbG9vcC9mcmFtZS5tanMnO1xuXG5jb25zdCBwcm9wRXZlbnRIYW5kbGVycyA9IFtcbiAgICBcIkFuaW1hdGlvblN0YXJ0XCIsXG4gICAgXCJBbmltYXRpb25Db21wbGV0ZVwiLFxuICAgIFwiVXBkYXRlXCIsXG4gICAgXCJCZWZvcmVMYXlvdXRNZWFzdXJlXCIsXG4gICAgXCJMYXlvdXRNZWFzdXJlXCIsXG4gICAgXCJMYXlvdXRBbmltYXRpb25TdGFydFwiLFxuICAgIFwiTGF5b3V0QW5pbWF0aW9uQ29tcGxldGVcIixcbl07XG4vKipcbiAqIFN0YXRpYyBmZWF0dXJlIGRlZmluaXRpb25zIC0gY2FuIGJlIGluamVjdGVkIGJ5IGZyYW1ld29yayBsYXllclxuICovXG5sZXQgZmVhdHVyZURlZmluaXRpb25zID0ge307XG4vKipcbiAqIFNldCBmZWF0dXJlIGRlZmluaXRpb25zIGZvciBhbGwgVmlzdWFsRWxlbWVudHMuXG4gKiBUaGlzIHNob3VsZCBiZSBjYWxsZWQgYnkgdGhlIGZyYW1ld29yayBsYXllciAoZS5nLiwgZnJhbWVyLW1vdGlvbikgZHVyaW5nIGluaXRpYWxpemF0aW9uLlxuICovXG5mdW5jdGlvbiBzZXRGZWF0dXJlRGVmaW5pdGlvbnMoZGVmaW5pdGlvbnMpIHtcbiAgICBmZWF0dXJlRGVmaW5pdGlvbnMgPSBkZWZpbml0aW9ucztcbn1cbi8qKlxuICogR2V0IHRoZSBjdXJyZW50IGZlYXR1cmUgZGVmaW5pdGlvbnNcbiAqL1xuZnVuY3Rpb24gZ2V0RmVhdHVyZURlZmluaXRpb25zKCkge1xuICAgIHJldHVybiBmZWF0dXJlRGVmaW5pdGlvbnM7XG59XG4vKipcbiAqIEEgVmlzdWFsRWxlbWVudCBpcyBhbiBpbXBlcmF0aXZlIGFic3RyYWN0aW9uIGFyb3VuZCBVSSBlbGVtZW50cyBzdWNoIGFzXG4gKiBIVE1MRWxlbWVudCwgU1ZHRWxlbWVudCwgVGhyZWUuT2JqZWN0M0QgZXRjLlxuICovXG5jbGFzcyBWaXN1YWxFbGVtZW50IHtcbiAgICAvKipcbiAgICAgKiBUaGlzIG1ldGhvZCB0YWtlcyBSZWFjdCBwcm9wcyBhbmQgcmV0dXJucyBmb3VuZCBNb3Rpb25WYWx1ZXMuIEZvciBleGFtcGxlLCBIVE1MXG4gICAgICogTW90aW9uVmFsdWVzIHdpbGwgYmUgZm91bmQgd2l0aGluIHRoZSBzdHlsZSBwcm9wLCB3aGVyZWFzIGZvciBUaHJlZS5qcyB3aXRoaW4gYXR0cmlidXRlIGFycmF5cy5cbiAgICAgKlxuICAgICAqIFRoaXMgaXNuJ3QgYW4gYWJzdHJhY3QgbWV0aG9kIGFzIGl0IG5lZWRzIGNhbGxpbmcgaW4gdGhlIGNvbnN0cnVjdG9yLCBidXQgaXQgaXNcbiAgICAgKiBpbnRlbmRlZCB0byBiZSBvbmUuXG4gICAgICovXG4gICAgc2NyYXBlTW90aW9uVmFsdWVzRnJvbVByb3BzKF9wcm9wcywgX3ByZXZQcm9wcywgX3Zpc3VhbEVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBjb25zdHJ1Y3Rvcih7IHBhcmVudCwgcHJvcHMsIHByZXNlbmNlQ29udGV4dCwgcmVkdWNlZE1vdGlvbkNvbmZpZywgc2tpcEFuaW1hdGlvbnMsIGJsb2NrSW5pdGlhbEFuaW1hdGlvbiwgdmlzdWFsU3RhdGUsIH0sIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQSByZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnQgdW5kZXJseWluZyBJbnN0YW5jZSwgZS5nLiBhIEhUTUxFbGVtZW50XG4gICAgICAgICAqIG9yIFRocmVlLk1lc2ggZXRjLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jdXJyZW50ID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgc2V0IGNvbnRhaW5pbmcgcmVmZXJlbmNlcyB0byB0aGlzIFZpc3VhbEVsZW1lbnQncyBjaGlsZHJlbi5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBuZXcgU2V0KCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXRlcm1pbmUgd2hhdCByb2xlIHRoaXMgdmlzdWFsIGVsZW1lbnQgc2hvdWxkIHRha2UgaW4gdGhlIHZhcmlhbnQgdHJlZS5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaXNWYXJpYW50Tm9kZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzQ29udHJvbGxpbmdWYXJpYW50cyA9IGZhbHNlO1xuICAgICAgICAvKipcbiAgICAgICAgICogRGVjaWRlcyB3aGV0aGVyIHRoaXMgVmlzdWFsRWxlbWVudCBzaG91bGQgYW5pbWF0ZSBpbiByZWR1Y2VkIG1vdGlvblxuICAgICAgICAgKiBtb2RlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUT0RPOiBUaGlzIGlzIGN1cnJlbnRseSBzZXQgb24gZXZlcnkgaW5kaXZpZHVhbCBWaXN1YWxFbGVtZW50IGJ1dCBmZWVsc1xuICAgICAgICAgKiBsaWtlIGl0IGNvdWxkIGJlIHNldCBnbG9iYWxseS5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc2hvdWxkUmVkdWNlTW90aW9uID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlY2lkZXMgd2hldGhlciBhbmltYXRpb25zIHNob3VsZCBiZSBza2lwcGVkIGZvciB0aGlzIFZpc3VhbEVsZW1lbnQuXG4gICAgICAgICAqIFVzZWZ1bCBmb3IgRTJFIHRlc3RzIGFuZCB2aXN1YWwgcmVncmVzc2lvbiB0ZXN0aW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zaG91bGRTa2lwQW5pbWF0aW9ucyA9IGZhbHNlO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBtYXAgb2YgYWxsIG1vdGlvbiB2YWx1ZXMgYXR0YWNoZWQgdG8gdGhpcyB2aXN1YWwgZWxlbWVudC4gTW90aW9uXG4gICAgICAgICAqIHZhbHVlcyBhcmUgc291cmNlIG9mIHRydXRoIGZvciBhbnkgZ2l2ZW4gYW5pbWF0ZWQgdmFsdWUuIEEgbW90aW9uXG4gICAgICAgICAqIHZhbHVlIG1pZ2h0IGJlIHByb3ZpZGVkIGV4dGVybmFsbHkgYnkgdGhlIGNvbXBvbmVudCB2aWEgcHJvcHMuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnZhbHVlcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5LZXlmcmFtZVJlc29sdmVyID0gS2V5ZnJhbWVSZXNvbHZlcjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsZWFudXAgZnVuY3Rpb25zIGZvciBhY3RpdmUgZmVhdHVyZXMgKGhvdmVyL3RhcC9leGl0IGV0YylcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZmVhdHVyZXMgPSB7fTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgbWFwIG9mIGV2ZXJ5IHN1YnNjcmlwdGlvbiB0aGF0IGJpbmRzIHRoZSBwcm92aWRlZCBvciBnZW5lcmF0ZWRcbiAgICAgICAgICogbW90aW9uIHZhbHVlcyBvbkNoYW5nZSBsaXN0ZW5lcnMgdG8gdGhpcyB2aXN1YWwgZWxlbWVudC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudmFsdWVTdWJzY3JpcHRpb25zID0gbmV3IE1hcCgpO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSByZWZlcmVuY2UgdG8gdGhlIHByZXZpb3VzbHktcHJvdmlkZWQgbW90aW9uIHZhbHVlcyBhcyByZXR1cm5lZFxuICAgICAgICAgKiBmcm9tIHNjcmFwZU1vdGlvblZhbHVlc0Zyb21Qcm9wcy4gV2UgdXNlIHRoZSBrZXlzIGluIGhlcmUgdG8gZGV0ZXJtaW5lXG4gICAgICAgICAqIGlmIGFueSBtb3Rpb24gdmFsdWVzIG5lZWQgdG8gYmUgcmVtb3ZlZCBhZnRlciBwcm9wcyBhcmUgdXBkYXRlZC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucHJldk1vdGlvblZhbHVlcyA9IHt9O1xuICAgICAgICAvKipcbiAgICAgICAgICogVHJhY2sgd2hldGhlciB0aGlzIGVsZW1lbnQgaGFzIGJlZW4gbW91bnRlZCBiZWZvcmUsIHRvIGRldGVjdFxuICAgICAgICAgKiByZW1vdW50cyBhZnRlciBTdXNwZW5zZSB1bm1vdW50L3JlbW91bnQgY3ljbGVzLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5oYXNCZWVuTW91bnRlZCA9IGZhbHNlO1xuICAgICAgICAvKipcbiAgICAgICAgICogQW4gb2JqZWN0IGNvbnRhaW5pbmcgYSBTdWJzY3JpcHRpb25NYW5hZ2VyIGZvciBlYWNoIGFjdGl2ZSBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZXZlbnRzID0ge307XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbiBvYmplY3QgY29udGFpbmluZyBhbiB1bnN1YnNjcmliZSBmdW5jdGlvbiBmb3IgZWFjaCBwcm9wIGV2ZW50IHN1YnNjcmlwdGlvbi5cbiAgICAgICAgICogRm9yIGV4YW1wbGUsIGV2ZXJ5IFwiVXBkYXRlXCIgZXZlbnQgY2FuIGhhdmUgbXVsdGlwbGUgc3Vic2NyaWJlcnMgdmlhXG4gICAgICAgICAqIFZpc3VhbEVsZW1lbnQub24oKSwgYnV0IG9ubHkgb25lIG9mIHRob3NlIGNhbiBiZSBkZWZpbmVkIHZpYSB0aGUgb25VcGRhdGUgcHJvcC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucHJvcEV2ZW50U3Vic2NyaXB0aW9ucyA9IHt9O1xuICAgICAgICB0aGlzLm5vdGlmeVVwZGF0ZSA9ICgpID0+IHRoaXMubm90aWZ5KFwiVXBkYXRlXCIsIHRoaXMubGF0ZXN0VmFsdWVzKTtcbiAgICAgICAgdGhpcy5yZW5kZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuY3VycmVudClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJCdWlsZCgpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJJbnN0YW5jZSh0aGlzLmN1cnJlbnQsIHRoaXMucmVuZGVyU3RhdGUsIHRoaXMucHJvcHMuc3R5bGUsIHRoaXMucHJvamVjdGlvbik7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucmVuZGVyU2NoZWR1bGVkQXQgPSAwLjA7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVSZW5kZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBub3cgPSB0aW1lLm5vdygpO1xuICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyU2NoZWR1bGVkQXQgPCBub3cpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclNjaGVkdWxlZEF0ID0gbm93O1xuICAgICAgICAgICAgICAgIGZyYW1lLnJlbmRlcih0aGlzLnJlbmRlciwgZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCB7IGxhdGVzdFZhbHVlcywgcmVuZGVyU3RhdGUgfSA9IHZpc3VhbFN0YXRlO1xuICAgICAgICB0aGlzLmxhdGVzdFZhbHVlcyA9IGxhdGVzdFZhbHVlcztcbiAgICAgICAgdGhpcy5iYXNlVGFyZ2V0ID0geyAuLi5sYXRlc3RWYWx1ZXMgfTtcbiAgICAgICAgdGhpcy5pbml0aWFsVmFsdWVzID0gcHJvcHMuaW5pdGlhbCA/IHsgLi4ubGF0ZXN0VmFsdWVzIH0gOiB7fTtcbiAgICAgICAgdGhpcy5yZW5kZXJTdGF0ZSA9IHJlbmRlclN0YXRlO1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICB0aGlzLnByZXNlbmNlQ29udGV4dCA9IHByZXNlbmNlQ29udGV4dDtcbiAgICAgICAgdGhpcy5kZXB0aCA9IHBhcmVudCA/IHBhcmVudC5kZXB0aCArIDEgOiAwO1xuICAgICAgICB0aGlzLnJlZHVjZWRNb3Rpb25Db25maWcgPSByZWR1Y2VkTW90aW9uQ29uZmlnO1xuICAgICAgICB0aGlzLnNraXBBbmltYXRpb25zQ29uZmlnID0gc2tpcEFuaW1hdGlvbnM7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuYmxvY2tJbml0aWFsQW5pbWF0aW9uID0gQm9vbGVhbihibG9ja0luaXRpYWxBbmltYXRpb24pO1xuICAgICAgICB0aGlzLmlzQ29udHJvbGxpbmdWYXJpYW50cyA9IGlzQ29udHJvbGxpbmdWYXJpYW50cyhwcm9wcyk7XG4gICAgICAgIHRoaXMuaXNWYXJpYW50Tm9kZSA9IGlzVmFyaWFudE5vZGUocHJvcHMpO1xuICAgICAgICBpZiAodGhpcy5pc1ZhcmlhbnROb2RlKSB7XG4gICAgICAgICAgICB0aGlzLnZhcmlhbnRDaGlsZHJlbiA9IG5ldyBTZXQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1hbnVhbGx5QW5pbWF0ZU9uTW91bnQgPSBCb29sZWFuKHBhcmVudCAmJiBwYXJlbnQuY3VycmVudCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbnkgbW90aW9uIHZhbHVlcyB0aGF0IGFyZSBwcm92aWRlZCB0byB0aGUgZWxlbWVudCB3aGVuIGNyZWF0ZWRcbiAgICAgICAgICogYXJlbid0IHlldCBib3VuZCB0byB0aGUgZWxlbWVudCwgYXMgdGhpcyB3b3VsZCB0ZWNobmljYWxseSBiZSBpbXB1cmUuXG4gICAgICAgICAqIEhvd2V2ZXIsIHdlIGl0ZXJhdGUgdGhyb3VnaCB0aGUgbW90aW9uIHZhbHVlcyBhbmQgc2V0IHRoZW0gdG8gdGhlXG4gICAgICAgICAqIGluaXRpYWwgdmFsdWVzIGZvciB0aGlzIGNvbXBvbmVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogVE9ETzogVGhpcyBpcyBpbXB1cmUgYW5kIHdlIHNob3VsZCBsb29rIGF0IGNoYW5naW5nIHRoaXMgdG8gcnVuIG9uIG1vdW50LlxuICAgICAgICAgKiBEb2luZyBzbyB3aWxsIGJyZWFrIHNvbWUgdGVzdHMgYnV0IHRoaXMgaXNuJ3QgbmVjZXNzYXJpbHkgYSBicmVha2luZyBjaGFuZ2UsXG4gICAgICAgICAqIG1vcmUgYSByZWZsZWN0aW9uIG9mIHRoZSB0ZXN0LlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgeyB3aWxsQ2hhbmdlLCAuLi5pbml0aWFsTW90aW9uVmFsdWVzIH0gPSB0aGlzLnNjcmFwZU1vdGlvblZhbHVlc0Zyb21Qcm9wcyhwcm9wcywge30sIHRoaXMpO1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBpbml0aWFsTW90aW9uVmFsdWVzKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGluaXRpYWxNb3Rpb25WYWx1ZXNba2V5XTtcbiAgICAgICAgICAgIGlmIChsYXRlc3RWYWx1ZXNba2V5XSAhPT0gdW5kZWZpbmVkICYmIGlzTW90aW9uVmFsdWUodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUuc2V0KGxhdGVzdFZhbHVlc1trZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBtb3VudChpbnN0YW5jZSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhpcyBlbGVtZW50IGhhcyBiZWVuIG1vdW50ZWQgYmVmb3JlIChlLmcuIGFmdGVyIGEgU3VzcGVuc2VcbiAgICAgICAgICogdW5tb3VudC9yZW1vdW50KSwgcmVzZXQgbW90aW9uIHZhbHVlcyB0byB0aGVpciBpbml0aWFsIHN0YXRlXG4gICAgICAgICAqIHNvIGFuaW1hdGlvbnMgcmVwbGF5IGNvcnJlY3RseSBmcm9tIGluaXRpYWwg4oaSIGFuaW1hdGUuXG4gICAgICAgICAqL1xuICAgICAgICBpZiAodGhpcy5oYXNCZWVuTW91bnRlZCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5pbml0aWFsVmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZXMuZ2V0KGtleSk/Lmp1bXAodGhpcy5pbml0aWFsVmFsdWVzW2tleV0pO1xuICAgICAgICAgICAgICAgIHRoaXMubGF0ZXN0VmFsdWVzW2tleV0gPSB0aGlzLmluaXRpYWxWYWx1ZXNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnQgPSBpbnN0YW5jZTtcbiAgICAgICAgdmlzdWFsRWxlbWVudFN0b3JlLnNldChpbnN0YW5jZSwgdGhpcyk7XG4gICAgICAgIGlmICh0aGlzLnByb2plY3Rpb24gJiYgIXRoaXMucHJvamVjdGlvbi5pbnN0YW5jZSkge1xuICAgICAgICAgICAgdGhpcy5wcm9qZWN0aW9uLm1vdW50KGluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgJiYgdGhpcy5pc1ZhcmlhbnROb2RlICYmICF0aGlzLmlzQ29udHJvbGxpbmdWYXJpYW50cykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVGcm9tVmFyaWFudFRyZWUgPSB0aGlzLnBhcmVudC5hZGRWYXJpYW50Q2hpbGQodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52YWx1ZXMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4gdGhpcy5iaW5kVG9Nb3Rpb25WYWx1ZShrZXksIHZhbHVlKSk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXRlcm1pbmUgcmVkdWNlZCBtb3Rpb24gcHJlZmVyZW5jZS4gT25seSBpbml0aWFsaXplIHRoZSBtYXRjaE1lZGlhXG4gICAgICAgICAqIGxpc3RlbmVyIGlmIHdlIGFjdHVhbGx5IG5lZWQgdGhlIGR5bmFtaWMgdmFsdWUgKGkuZS4sIHdoZW4gY29uZmlnXG4gICAgICAgICAqIGlzIG5laXRoZXIgXCJuZXZlclwiIG5vciBcImFsd2F5c1wiKS5cbiAgICAgICAgICovXG4gICAgICAgIGlmICh0aGlzLnJlZHVjZWRNb3Rpb25Db25maWcgPT09IFwibmV2ZXJcIikge1xuICAgICAgICAgICAgdGhpcy5zaG91bGRSZWR1Y2VNb3Rpb24gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnJlZHVjZWRNb3Rpb25Db25maWcgPT09IFwiYWx3YXlzXCIpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvdWxkUmVkdWNlTW90aW9uID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICghaGFzUmVkdWNlZE1vdGlvbkxpc3RlbmVyLmN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICBpbml0UHJlZmVyc1JlZHVjZWRNb3Rpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2hvdWxkUmVkdWNlTW90aW9uID0gcHJlZmVyc1JlZHVjZWRNb3Rpb24uY3VycmVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgICAgICB3YXJuT25jZSh0aGlzLnNob3VsZFJlZHVjZU1vdGlvbiAhPT0gdHJ1ZSwgXCJZb3UgaGF2ZSBSZWR1Y2VkIE1vdGlvbiBlbmFibGVkIG9uIHlvdXIgZGV2aWNlLiBBbmltYXRpb25zIG1heSBub3QgYXBwZWFyIGFzIGV4cGVjdGVkLlwiLCBcInJlZHVjZWQtbW90aW9uLWRpc2FibGVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgd2hldGhlciBhbmltYXRpb25zIHNob3VsZCBiZSBza2lwcGVkIGJhc2VkIG9uIHRoZSBjb25maWcuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnNob3VsZFNraXBBbmltYXRpb25zID0gdGhpcy5za2lwQW5pbWF0aW9uc0NvbmZpZyA/PyBmYWxzZTtcbiAgICAgICAgdGhpcy5wYXJlbnQ/LmFkZENoaWxkKHRoaXMpO1xuICAgICAgICB0aGlzLnVwZGF0ZSh0aGlzLnByb3BzLCB0aGlzLnByZXNlbmNlQ29udGV4dCk7XG4gICAgICAgIHRoaXMuaGFzQmVlbk1vdW50ZWQgPSB0cnVlO1xuICAgIH1cbiAgICB1bm1vdW50KCkge1xuICAgICAgICB0aGlzLnByb2plY3Rpb24gJiYgdGhpcy5wcm9qZWN0aW9uLnVubW91bnQoKTtcbiAgICAgICAgY2FuY2VsRnJhbWUodGhpcy5ub3RpZnlVcGRhdGUpO1xuICAgICAgICBjYW5jZWxGcmFtZSh0aGlzLnJlbmRlcik7XG4gICAgICAgIHRoaXMudmFsdWVTdWJzY3JpcHRpb25zLmZvckVhY2goKHJlbW92ZSkgPT4gcmVtb3ZlKCkpO1xuICAgICAgICB0aGlzLnZhbHVlU3Vic2NyaXB0aW9ucy5jbGVhcigpO1xuICAgICAgICB0aGlzLnJlbW92ZUZyb21WYXJpYW50VHJlZSAmJiB0aGlzLnJlbW92ZUZyb21WYXJpYW50VHJlZSgpO1xuICAgICAgICB0aGlzLnBhcmVudD8ucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuZXZlbnRzKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1trZXldLmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5mZWF0dXJlcykge1xuICAgICAgICAgICAgY29uc3QgZmVhdHVyZSA9IHRoaXMuZmVhdHVyZXNba2V5XTtcbiAgICAgICAgICAgIGlmIChmZWF0dXJlKSB7XG4gICAgICAgICAgICAgICAgZmVhdHVyZS51bm1vdW50KCk7XG4gICAgICAgICAgICAgICAgZmVhdHVyZS5pc01vdW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnQgPSBudWxsO1xuICAgIH1cbiAgICBhZGRDaGlsZChjaGlsZCkge1xuICAgICAgICB0aGlzLmNoaWxkcmVuLmFkZChjaGlsZCk7XG4gICAgICAgIHRoaXMuZW50ZXJpbmdDaGlsZHJlbiA/PyAodGhpcy5lbnRlcmluZ0NoaWxkcmVuID0gbmV3IFNldCgpKTtcbiAgICAgICAgdGhpcy5lbnRlcmluZ0NoaWxkcmVuLmFkZChjaGlsZCk7XG4gICAgfVxuICAgIHJlbW92ZUNoaWxkKGNoaWxkKSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZGVsZXRlKGNoaWxkKTtcbiAgICAgICAgdGhpcy5lbnRlcmluZ0NoaWxkcmVuICYmIHRoaXMuZW50ZXJpbmdDaGlsZHJlbi5kZWxldGUoY2hpbGQpO1xuICAgIH1cbiAgICBiaW5kVG9Nb3Rpb25WYWx1ZShrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLnZhbHVlU3Vic2NyaXB0aW9ucy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZVN1YnNjcmlwdGlvbnMuZ2V0KGtleSkoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUuYWNjZWxlcmF0ZSAmJlxuICAgICAgICAgICAgYWNjZWxlcmF0ZWRWYWx1ZXMuaGFzKGtleSkgJiZcbiAgICAgICAgICAgIHRoaXMuY3VycmVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCB7IGZhY3RvcnksIGtleWZyYW1lcywgdGltZXMsIGVhc2UsIGR1cmF0aW9uIH0gPSB2YWx1ZS5hY2NlbGVyYXRlO1xuICAgICAgICAgICAgY29uc3QgYW5pbWF0aW9uID0gbmV3IE5hdGl2ZUFuaW1hdGlvbih7XG4gICAgICAgICAgICAgICAgZWxlbWVudDogdGhpcy5jdXJyZW50LFxuICAgICAgICAgICAgICAgIG5hbWU6IGtleSxcbiAgICAgICAgICAgICAgICBrZXlmcmFtZXMsXG4gICAgICAgICAgICAgICAgdGltZXMsXG4gICAgICAgICAgICAgICAgZWFzZSxcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogc2Vjb25kc1RvTWlsbGlzZWNvbmRzKGR1cmF0aW9uKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgY2xlYW51cCA9IGZhY3RvcnkoYW5pbWF0aW9uKTtcbiAgICAgICAgICAgIHRoaXMudmFsdWVTdWJzY3JpcHRpb25zLnNldChrZXksICgpID0+IHtcbiAgICAgICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uLmNhbmNlbCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdmFsdWVJc1RyYW5zZm9ybSA9IHRyYW5zZm9ybVByb3BzLmhhcyhrZXkpO1xuICAgICAgICBpZiAodmFsdWVJc1RyYW5zZm9ybSAmJiB0aGlzLm9uQmluZFRyYW5zZm9ybSkge1xuICAgICAgICAgICAgdGhpcy5vbkJpbmRUcmFuc2Zvcm0oKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZW1vdmVPbkNoYW5nZSA9IHZhbHVlLm9uKFwiY2hhbmdlXCIsIChsYXRlc3RWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5sYXRlc3RWYWx1ZXNba2V5XSA9IGxhdGVzdFZhbHVlO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZSAmJiBmcmFtZS5wcmVSZW5kZXIodGhpcy5ub3RpZnlVcGRhdGUpO1xuICAgICAgICAgICAgaWYgKHZhbHVlSXNUcmFuc2Zvcm0gJiYgdGhpcy5wcm9qZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0aW9uLmlzVHJhbnNmb3JtRGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZVJlbmRlcigpO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHJlbW92ZVN5bmNDaGVjaztcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgICAgICAgIHdpbmRvdy5Nb3Rpb25DaGVja0FwcGVhclN5bmMpIHtcbiAgICAgICAgICAgIHJlbW92ZVN5bmNDaGVjayA9IHdpbmRvdy5Nb3Rpb25DaGVja0FwcGVhclN5bmModGhpcywga2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52YWx1ZVN1YnNjcmlwdGlvbnMuc2V0KGtleSwgKCkgPT4ge1xuICAgICAgICAgICAgcmVtb3ZlT25DaGFuZ2UoKTtcbiAgICAgICAgICAgIGlmIChyZW1vdmVTeW5jQ2hlY2spXG4gICAgICAgICAgICAgICAgcmVtb3ZlU3luY0NoZWNrKCk7XG4gICAgICAgICAgICBpZiAodmFsdWUub3duZXIpXG4gICAgICAgICAgICAgICAgdmFsdWUuc3RvcCgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc29ydE5vZGVQb3NpdGlvbihvdGhlcikge1xuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhlc2Ugbm9kZXMgYXJlbid0IGV2ZW4gb2YgdGhlIHNhbWUgdHlwZSB3ZSBjYW4ndCBjb21wYXJlIHRoZWlyIGRlcHRoLlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnQgfHxcbiAgICAgICAgICAgICF0aGlzLnNvcnRJbnN0YW5jZU5vZGVQb3NpdGlvbiB8fFxuICAgICAgICAgICAgdGhpcy50eXBlICE9PSBvdGhlci50eXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zb3J0SW5zdGFuY2VOb2RlUG9zaXRpb24odGhpcy5jdXJyZW50LCBvdGhlci5jdXJyZW50KTtcbiAgICB9XG4gICAgdXBkYXRlRmVhdHVyZXMoKSB7XG4gICAgICAgIGxldCBrZXkgPSBcImFuaW1hdGlvblwiO1xuICAgICAgICBmb3IgKGtleSBpbiBmZWF0dXJlRGVmaW5pdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IGZlYXR1cmVEZWZpbml0aW9uID0gZmVhdHVyZURlZmluaXRpb25zW2tleV07XG4gICAgICAgICAgICBpZiAoIWZlYXR1cmVEZWZpbml0aW9uKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgY29uc3QgeyBpc0VuYWJsZWQsIEZlYXR1cmU6IEZlYXR1cmVDb25zdHJ1Y3RvciB9ID0gZmVhdHVyZURlZmluaXRpb247XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHRoaXMgZmVhdHVyZSBpcyBlbmFibGVkIGJ1dCBub3QgYWN0aXZlLCBtYWtlIGEgbmV3IGluc3RhbmNlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoIXRoaXMuZmVhdHVyZXNba2V5XSAmJlxuICAgICAgICAgICAgICAgIEZlYXR1cmVDb25zdHJ1Y3RvciAmJlxuICAgICAgICAgICAgICAgIGlzRW5hYmxlZCh0aGlzLnByb3BzKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVhdHVyZXNba2V5XSA9IG5ldyBGZWF0dXJlQ29uc3RydWN0b3IodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHdlIGhhdmUgYSBmZWF0dXJlLCBtb3VudCBvciB1cGRhdGUgaXQuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh0aGlzLmZlYXR1cmVzW2tleV0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmZWF0dXJlID0gdGhpcy5mZWF0dXJlc1trZXldO1xuICAgICAgICAgICAgICAgIGlmIChmZWF0dXJlLmlzTW91bnRlZCkge1xuICAgICAgICAgICAgICAgICAgICBmZWF0dXJlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmVhdHVyZS5tb3VudCgpO1xuICAgICAgICAgICAgICAgICAgICBmZWF0dXJlLmlzTW91bnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHRyaWdnZXJCdWlsZCgpIHtcbiAgICAgICAgdGhpcy5idWlsZCh0aGlzLnJlbmRlclN0YXRlLCB0aGlzLmxhdGVzdFZhbHVlcywgdGhpcy5wcm9wcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1lYXN1cmUgdGhlIGN1cnJlbnQgdmlld3BvcnQgYm94IHdpdGggb3Igd2l0aG91dCB0cmFuc2Zvcm1zLlxuICAgICAqIE9ubHkgbWVhc3VyZXMgYXhpcy1hbGlnbmVkIGJveGVzLCByb3RhdGUgYW5kIHNrZXcgbXVzdCBiZSBtYW51YWxseVxuICAgICAqIHJlbW92ZWQgd2l0aCBhIHJlLXJlbmRlciB0byB3b3JrLlxuICAgICAqL1xuICAgIG1lYXN1cmVWaWV3cG9ydEJveCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFxuICAgICAgICAgICAgPyB0aGlzLm1lYXN1cmVJbnN0YW5jZVZpZXdwb3J0Qm94KHRoaXMuY3VycmVudCwgdGhpcy5wcm9wcylcbiAgICAgICAgICAgIDogY3JlYXRlQm94KCk7XG4gICAgfVxuICAgIGdldFN0YXRpY1ZhbHVlKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5sYXRlc3RWYWx1ZXNba2V5XTtcbiAgICB9XG4gICAgc2V0U3RhdGljVmFsdWUoa2V5LCB2YWx1ZSkge1xuICAgICAgICB0aGlzLmxhdGVzdFZhbHVlc1trZXldID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSB0aGUgcHJvdmlkZWQgcHJvcHMuIEVuc3VyZSBhbnkgbmV3bHktYWRkZWQgbW90aW9uIHZhbHVlcyBhcmVcbiAgICAgKiBhZGRlZCB0byBvdXIgbWFwLCBvbGQgb25lcyByZW1vdmVkLCBhbmQgbGlzdGVuZXJzIHVwZGF0ZWQuXG4gICAgICovXG4gICAgdXBkYXRlKHByb3BzLCBwcmVzZW5jZUNvbnRleHQpIHtcbiAgICAgICAgaWYgKHByb3BzLnRyYW5zZm9ybVRlbXBsYXRlIHx8IHRoaXMucHJvcHMudHJhbnNmb3JtVGVtcGxhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVSZW5kZXIoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXZQcm9wcyA9IHRoaXMucHJvcHM7XG4gICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgdGhpcy5wcmV2UHJlc2VuY2VDb250ZXh0ID0gdGhpcy5wcmVzZW5jZUNvbnRleHQ7XG4gICAgICAgIHRoaXMucHJlc2VuY2VDb250ZXh0ID0gcHJlc2VuY2VDb250ZXh0O1xuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlIHByb3AgZXZlbnQgaGFuZGxlcnMgaWUgb25BbmltYXRpb25TdGFydCwgb25BbmltYXRpb25Db21wbGV0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wRXZlbnRIYW5kbGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gcHJvcEV2ZW50SGFuZGxlcnNbaV07XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wRXZlbnRTdWJzY3JpcHRpb25zW2tleV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BFdmVudFN1YnNjcmlwdGlvbnNba2V5XSgpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnByb3BFdmVudFN1YnNjcmlwdGlvbnNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGxpc3RlbmVyTmFtZSA9IChcIm9uXCIgKyBrZXkpO1xuICAgICAgICAgICAgY29uc3QgbGlzdGVuZXIgPSBwcm9wc1tsaXN0ZW5lck5hbWVdO1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wRXZlbnRTdWJzY3JpcHRpb25zW2tleV0gPSB0aGlzLm9uKGtleSwgbGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJldk1vdGlvblZhbHVlcyA9IHVwZGF0ZU1vdGlvblZhbHVlc0Zyb21Qcm9wcyh0aGlzLCB0aGlzLnNjcmFwZU1vdGlvblZhbHVlc0Zyb21Qcm9wcyhwcm9wcywgdGhpcy5wcmV2UHJvcHMgfHwge30sIHRoaXMpLCB0aGlzLnByZXZNb3Rpb25WYWx1ZXMpO1xuICAgICAgICBpZiAodGhpcy5oYW5kbGVDaGlsZE1vdGlvblZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUNoaWxkTW90aW9uVmFsdWUoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXRQcm9wcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHZhcmlhbnQgZGVmaW5pdGlvbiB3aXRoIGEgZ2l2ZW4gbmFtZS5cbiAgICAgKi9cbiAgICBnZXRWYXJpYW50KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMudmFyaWFudHMgPyB0aGlzLnByb3BzLnZhcmlhbnRzW25hbWVdIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBkZWZpbmVkIGRlZmF1bHQgdHJhbnNpdGlvbiBvbiB0aGlzIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBnZXREZWZhdWx0VHJhbnNpdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMudHJhbnNpdGlvbjtcbiAgICB9XG4gICAgZ2V0VHJhbnNmb3JtUGFnZVBvaW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy50cmFuc2Zvcm1QYWdlUG9pbnQ7XG4gICAgfVxuICAgIGdldENsb3Nlc3RWYXJpYW50Tm9kZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNWYXJpYW50Tm9kZVxuICAgICAgICAgICAgPyB0aGlzXG4gICAgICAgICAgICA6IHRoaXMucGFyZW50XG4gICAgICAgICAgICAgICAgPyB0aGlzLnBhcmVudC5nZXRDbG9zZXN0VmFyaWFudE5vZGUoKVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGQgYSBjaGlsZCB2aXN1YWwgZWxlbWVudCB0byBvdXIgc2V0IG9mIGNoaWxkcmVuLlxuICAgICAqL1xuICAgIGFkZFZhcmlhbnRDaGlsZChjaGlsZCkge1xuICAgICAgICBjb25zdCBjbG9zZXN0VmFyaWFudE5vZGUgPSB0aGlzLmdldENsb3Nlc3RWYXJpYW50Tm9kZSgpO1xuICAgICAgICBpZiAoY2xvc2VzdFZhcmlhbnROb2RlKSB7XG4gICAgICAgICAgICBjbG9zZXN0VmFyaWFudE5vZGUudmFyaWFudENoaWxkcmVuICYmXG4gICAgICAgICAgICAgICAgY2xvc2VzdFZhcmlhbnROb2RlLnZhcmlhbnRDaGlsZHJlbi5hZGQoY2hpbGQpO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IGNsb3Nlc3RWYXJpYW50Tm9kZS52YXJpYW50Q2hpbGRyZW4uZGVsZXRlKGNoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGQgYSBtb3Rpb24gdmFsdWUgYW5kIGJpbmQgaXQgdG8gdGhpcyB2aXN1YWwgZWxlbWVudC5cbiAgICAgKi9cbiAgICBhZGRWYWx1ZShrZXksIHZhbHVlKSB7XG4gICAgICAgIC8vIFJlbW92ZSBleGlzdGluZyB2YWx1ZSBpZiBpdCBleGlzdHNcbiAgICAgICAgY29uc3QgZXhpc3RpbmdWYWx1ZSA9IHRoaXMudmFsdWVzLmdldChrZXkpO1xuICAgICAgICBpZiAodmFsdWUgIT09IGV4aXN0aW5nVmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ1ZhbHVlKVxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlVmFsdWUoa2V5KTtcbiAgICAgICAgICAgIHRoaXMuYmluZFRvTW90aW9uVmFsdWUoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnZhbHVlcy5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmxhdGVzdFZhbHVlc1trZXldID0gdmFsdWUuZ2V0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgbW90aW9uIHZhbHVlIGFuZCB1bmJpbmQgYW55IGFjdGl2ZSBzdWJzY3JpcHRpb25zLlxuICAgICAqL1xuICAgIHJlbW92ZVZhbHVlKGtleSkge1xuICAgICAgICB0aGlzLnZhbHVlcy5kZWxldGUoa2V5KTtcbiAgICAgICAgY29uc3QgdW5zdWJzY3JpYmUgPSB0aGlzLnZhbHVlU3Vic2NyaXB0aW9ucy5nZXQoa2V5KTtcbiAgICAgICAgaWYgKHVuc3Vic2NyaWJlKSB7XG4gICAgICAgICAgICB1bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgdGhpcy52YWx1ZVN1YnNjcmlwdGlvbnMuZGVsZXRlKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHRoaXMubGF0ZXN0VmFsdWVzW2tleV07XG4gICAgICAgIHRoaXMucmVtb3ZlVmFsdWVGcm9tUmVuZGVyU3RhdGUoa2V5LCB0aGlzLnJlbmRlclN0YXRlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2sgd2hldGhlciB3ZSBoYXZlIGEgbW90aW9uIHZhbHVlIGZvciB0aGlzIGtleVxuICAgICAqL1xuICAgIGhhc1ZhbHVlKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXMuaGFzKGtleSk7XG4gICAgfVxuICAgIGdldFZhbHVlKGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLnZhbHVlcyAmJiB0aGlzLnByb3BzLnZhbHVlc1trZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy52YWx1ZXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLnZhbHVlcy5nZXQoa2V5KTtcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgZGVmYXVsdFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gbW90aW9uVmFsdWUoZGVmYXVsdFZhbHVlID09PSBudWxsID8gdW5kZWZpbmVkIDogZGVmYXVsdFZhbHVlLCB7IG93bmVyOiB0aGlzIH0pO1xuICAgICAgICAgICAgdGhpcy5hZGRWYWx1ZShrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIElmIHdlJ3JlIHRyeWluZyB0byBhbmltYXRlIHRvIGEgcHJldmlvdXNseSB1bmVuY291bnRlcmVkIHZhbHVlLFxuICAgICAqIHdlIG5lZWQgdG8gY2hlY2sgZm9yIGl0IGluIG91ciBzdGF0ZSBhbmQgYXMgYSBsYXN0IHJlc29ydCByZWFkIGl0XG4gICAgICogZGlyZWN0bHkgZnJvbSB0aGUgaW5zdGFuY2UgKHdoaWNoIG1pZ2h0IGhhdmUgcGVyZm9ybWFuY2UgaW1wbGljYXRpb25zKS5cbiAgICAgKi9cbiAgICByZWFkVmFsdWUoa2V5LCB0YXJnZXQpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5sYXRlc3RWYWx1ZXNba2V5XSAhPT0gdW5kZWZpbmVkIHx8ICF0aGlzLmN1cnJlbnRcbiAgICAgICAgICAgID8gdGhpcy5sYXRlc3RWYWx1ZXNba2V5XVxuICAgICAgICAgICAgOiB0aGlzLmdldEJhc2VUYXJnZXRGcm9tUHJvcHModGhpcy5wcm9wcywga2V5KSA/P1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZFZhbHVlRnJvbUluc3RhbmNlKHRoaXMuY3VycmVudCwga2V5LCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgICAgIChpc051bWVyaWNhbFN0cmluZyh2YWx1ZSkgfHwgaXNaZXJvVmFsdWVTdHJpbmcodmFsdWUpKSkge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSBudW1iZXIgcmVhZCBhcyBhIHN0cmluZywgaWUgXCIwXCIgb3IgXCIyMDBcIiwgY29udmVydCBpdCB0byBhIG51bWJlclxuICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICghZmluZFZhbHVlVHlwZSh2YWx1ZSkgJiYgY29tcGxleC50ZXN0KHRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGdldEFuaW1hdGFibGVOb25lKGtleSwgdGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0QmFzZVRhcmdldChrZXksIGlzTW90aW9uVmFsdWUodmFsdWUpID8gdmFsdWUuZ2V0KCkgOiB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzTW90aW9uVmFsdWUodmFsdWUpID8gdmFsdWUuZ2V0KCkgOiB2YWx1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBiYXNlIHRhcmdldCB0byBsYXRlciBhbmltYXRlIGJhY2sgdG8uIFRoaXMgaXMgY3VycmVudGx5XG4gICAgICogb25seSBoeWRyYXRlZCBvbiBjcmVhdGlvbiBhbmQgd2hlbiB3ZSBmaXJzdCByZWFkIGEgdmFsdWUuXG4gICAgICovXG4gICAgc2V0QmFzZVRhcmdldChrZXksIHZhbHVlKSB7XG4gICAgICAgIHRoaXMuYmFzZVRhcmdldFtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZpbmQgdGhlIGJhc2UgdGFyZ2V0IGZvciBhIHZhbHVlIHRoYXRzIGJlZW4gcmVtb3ZlZCBmcm9tIGFsbCBhbmltYXRpb25cbiAgICAgKiBwcm9wcy5cbiAgICAgKi9cbiAgICBnZXRCYXNlVGFyZ2V0KGtleSkge1xuICAgICAgICBjb25zdCB7IGluaXRpYWwgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGxldCB2YWx1ZUZyb21Jbml0aWFsO1xuICAgICAgICBpZiAodHlwZW9mIGluaXRpYWwgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGluaXRpYWwgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhcmlhbnQgPSByZXNvbHZlVmFyaWFudEZyb21Qcm9wcyh0aGlzLnByb3BzLCBpbml0aWFsLCB0aGlzLnByZXNlbmNlQ29udGV4dD8uY3VzdG9tKTtcbiAgICAgICAgICAgIGlmICh2YXJpYW50KSB7XG4gICAgICAgICAgICAgICAgdmFsdWVGcm9tSW5pdGlhbCA9IHZhcmlhbnRba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhpcyB2YWx1ZSBzdGlsbCBleGlzdHMgaW4gdGhlIGN1cnJlbnQgaW5pdGlhbCB2YXJpYW50LCByZWFkIHRoYXQuXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoaW5pdGlhbCAmJiB2YWx1ZUZyb21Jbml0aWFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZUZyb21Jbml0aWFsO1xuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbHRlcm5hdGl2ZWx5LCBpZiB0aGlzIFZpc3VhbEVsZW1lbnQgY29uZmlnIGhhcyBkZWZpbmVkIGEgZ2V0QmFzZVRhcmdldFxuICAgICAgICAgKiBzbyB3ZSBjYW4gcmVhZCB0aGUgdmFsdWUgZnJvbSBhbiBhbHRlcm5hdGl2ZSBzb3VyY2UsIHRyeSB0aGF0LlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5nZXRCYXNlVGFyZ2V0RnJvbVByb3BzKHRoaXMucHJvcHMsIGtleSk7XG4gICAgICAgIGlmICh0YXJnZXQgIT09IHVuZGVmaW5lZCAmJiAhaXNNb3Rpb25WYWx1ZSh0YXJnZXQpKVxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHRoZSB2YWx1ZSB3YXMgaW5pdGlhbGx5IGRlZmluZWQgb24gaW5pdGlhbCwgYnV0IGl0IGRvZXNuJ3QgYW55IG1vcmUsXG4gICAgICAgICAqIHJldHVybiB1bmRlZmluZWQuIE90aGVyd2lzZSByZXR1cm4gdGhlIHZhbHVlIGFzIGluaXRpYWxseSByZWFkIGZyb20gdGhlIERPTS5cbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiB0aGlzLmluaXRpYWxWYWx1ZXNba2V5XSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB2YWx1ZUZyb21Jbml0aWFsID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgICAgICA6IHRoaXMuYmFzZVRhcmdldFtrZXldO1xuICAgIH1cbiAgICBvbihldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICghdGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9IG5ldyBTdWJzY3JpcHRpb25NYW5hZ2VyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uYWRkKGNhbGxiYWNrKTtcbiAgICB9XG4gICAgbm90aWZ5KGV2ZW50TmFtZSwgLi4uYXJncykge1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5ub3RpZnkoLi4uYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2NoZWR1bGVSZW5kZXJNaWNyb3Rhc2soKSB7XG4gICAgICAgIG1pY3JvdGFzay5yZW5kZXIodGhpcy5yZW5kZXIpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgVmlzdWFsRWxlbWVudCwgZ2V0RmVhdHVyZURlZmluaXRpb25zLCBzZXRGZWF0dXJlRGVmaW5pdGlvbnMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVZpc3VhbEVsZW1lbnQubWpzLm1hcFxuIiwiaW1wb3J0IHsgaXNNb3Rpb25WYWx1ZSB9IGZyb20gJy4uLy4uL3ZhbHVlL3V0aWxzL2lzLW1vdGlvbi12YWx1ZS5tanMnO1xuaW1wb3J0IHsgRE9NS2V5ZnJhbWVzUmVzb2x2ZXIgfSBmcm9tICcuLi8uLi9hbmltYXRpb24va2V5ZnJhbWVzL0RPTUtleWZyYW1lc1Jlc29sdmVyLm1qcyc7XG5pbXBvcnQgeyBWaXN1YWxFbGVtZW50IH0gZnJvbSAnLi4vVmlzdWFsRWxlbWVudC5tanMnO1xuXG5jbGFzcyBET01WaXN1YWxFbGVtZW50IGV4dGVuZHMgVmlzdWFsRWxlbWVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuS2V5ZnJhbWVSZXNvbHZlciA9IERPTUtleWZyYW1lc1Jlc29sdmVyO1xuICAgIH1cbiAgICBzb3J0SW5zdGFuY2VOb2RlUG9zaXRpb24oYSwgYikge1xuICAgICAgICAvKipcbiAgICAgICAgICogY29tcGFyZURvY3VtZW50UG9zaXRpb24gcmV0dXJucyBhIGJpdG1hc2ssIGJ5IHVzaW5nIHRoZSBiaXR3aXNlICZcbiAgICAgICAgICogd2UncmUgcmV0dXJuaW5nIHRydWUgaWYgMiBpbiB0aGF0IGJpdG1hc2sgaXMgc2V0IHRvIHRydWUuIDIgaXMgc2V0XG4gICAgICAgICAqIHRvIHRydWUgaWYgYiBwcmVjZWVkcyBhLlxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oYikgJiAyID8gMSA6IC0xO1xuICAgIH1cbiAgICBnZXRCYXNlVGFyZ2V0RnJvbVByb3BzKHByb3BzLCBrZXkpIHtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBwcm9wcy5zdHlsZTtcbiAgICAgICAgcmV0dXJuIHN0eWxlID8gc3R5bGVba2V5XSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmVtb3ZlVmFsdWVGcm9tUmVuZGVyU3RhdGUoa2V5LCB7IHZhcnMsIHN0eWxlIH0pIHtcbiAgICAgICAgZGVsZXRlIHZhcnNba2V5XTtcbiAgICAgICAgZGVsZXRlIHN0eWxlW2tleV07XG4gICAgfVxuICAgIGhhbmRsZUNoaWxkTW90aW9uVmFsdWUoKSB7XG4gICAgICAgIGlmICh0aGlzLmNoaWxkU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkU3Vic2NyaXB0aW9uKCk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5jaGlsZFN1YnNjcmlwdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IGNoaWxkcmVuIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICBpZiAoaXNNb3Rpb25WYWx1ZShjaGlsZHJlbikpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRTdWJzY3JpcHRpb24gPSBjaGlsZHJlbi5vbihcImNoYW5nZVwiLCAobGF0ZXN0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnQudGV4dENvbnRlbnQgPSBgJHtsYXRlc3R9YDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHsgRE9NVmlzdWFsRWxlbWVudCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RE9NVmlzdWFsRWxlbWVudC5tanMubWFwXG4iLCIvKipcbiAqIEJvdW5kaW5nIGJveGVzIHRlbmQgdG8gYmUgZGVmaW5lZCBhcyB0b3AsIGxlZnQsIHJpZ2h0LCBib3R0b20uIEZvciB2YXJpb3VzIG9wZXJhdGlvbnNcbiAqIGl0J3MgZWFzaWVyIHRvIGNvbnNpZGVyIGVhY2ggYXhpcyBpbmRpdmlkdWFsbHkuIFRoaXMgZnVuY3Rpb24gcmV0dXJucyBhIGJvdW5kaW5nIGJveFxuICogYXMgYSBtYXAgb2Ygc2luZ2xlLWF4aXMgbWluL21heCB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIGNvbnZlcnRCb3VuZGluZ0JveFRvQm94KHsgdG9wLCBsZWZ0LCByaWdodCwgYm90dG9tLCB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgeDogeyBtaW46IGxlZnQsIG1heDogcmlnaHQgfSxcbiAgICAgICAgeTogeyBtaW46IHRvcCwgbWF4OiBib3R0b20gfSxcbiAgICB9O1xufVxuZnVuY3Rpb24gY29udmVydEJveFRvQm91bmRpbmdCb3goeyB4LCB5IH0pIHtcbiAgICByZXR1cm4geyB0b3A6IHkubWluLCByaWdodDogeC5tYXgsIGJvdHRvbTogeS5tYXgsIGxlZnQ6IHgubWluIH07XG59XG4vKipcbiAqIEFwcGxpZXMgYSBUcmFuc2Zvcm1Qb2ludCBmdW5jdGlvbiB0byBhIGJvdW5kaW5nIGJveC4gVHJhbnNmb3JtUG9pbnQgaXMgdXN1YWxseSBhIGZ1bmN0aW9uXG4gKiBwcm92aWRlZCBieSBGcmFtZXIgdG8gYWxsb3cgbWVhc3VyZWQgcG9pbnRzIHRvIGJlIGNvcnJlY3RlZCBmb3IgZGV2aWNlIHNjYWxpbmcuIFRoaXMgaXMgdXNlZFxuICogd2hlbiBtZWFzdXJpbmcgRE9NIGVsZW1lbnRzIGFuZCBET00gZXZlbnQgcG9pbnRzLlxuICovXG5mdW5jdGlvbiB0cmFuc2Zvcm1Cb3hQb2ludHMocG9pbnQsIHRyYW5zZm9ybVBvaW50KSB7XG4gICAgaWYgKCF0cmFuc2Zvcm1Qb2ludClcbiAgICAgICAgcmV0dXJuIHBvaW50O1xuICAgIGNvbnN0IHRvcExlZnQgPSB0cmFuc2Zvcm1Qb2ludCh7IHg6IHBvaW50LmxlZnQsIHk6IHBvaW50LnRvcCB9KTtcbiAgICBjb25zdCBib3R0b21SaWdodCA9IHRyYW5zZm9ybVBvaW50KHsgeDogcG9pbnQucmlnaHQsIHk6IHBvaW50LmJvdHRvbSB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgICB0b3A6IHRvcExlZnQueSxcbiAgICAgICAgbGVmdDogdG9wTGVmdC54LFxuICAgICAgICBib3R0b206IGJvdHRvbVJpZ2h0LnksXG4gICAgICAgIHJpZ2h0OiBib3R0b21SaWdodC54LFxuICAgIH07XG59XG5cbmV4cG9ydCB7IGNvbnZlcnRCb3VuZGluZ0JveFRvQm94LCBjb252ZXJ0Qm94VG9Cb3VuZGluZ0JveCwgdHJhbnNmb3JtQm94UG9pbnRzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb252ZXJzaW9uLm1qcy5tYXBcbiIsImZ1bmN0aW9uIGlzSWRlbnRpdHlTY2FsZShzY2FsZSkge1xuICAgIHJldHVybiBzY2FsZSA9PT0gdW5kZWZpbmVkIHx8IHNjYWxlID09PSAxO1xufVxuZnVuY3Rpb24gaGFzU2NhbGUoeyBzY2FsZSwgc2NhbGVYLCBzY2FsZVkgfSkge1xuICAgIHJldHVybiAoIWlzSWRlbnRpdHlTY2FsZShzY2FsZSkgfHxcbiAgICAgICAgIWlzSWRlbnRpdHlTY2FsZShzY2FsZVgpIHx8XG4gICAgICAgICFpc0lkZW50aXR5U2NhbGUoc2NhbGVZKSk7XG59XG5mdW5jdGlvbiBoYXNUcmFuc2Zvcm0odmFsdWVzKSB7XG4gICAgcmV0dXJuIChoYXNTY2FsZSh2YWx1ZXMpIHx8XG4gICAgICAgIGhhczJEVHJhbnNsYXRlKHZhbHVlcykgfHxcbiAgICAgICAgdmFsdWVzLnogfHxcbiAgICAgICAgdmFsdWVzLnJvdGF0ZSB8fFxuICAgICAgICB2YWx1ZXMucm90YXRlWCB8fFxuICAgICAgICB2YWx1ZXMucm90YXRlWSB8fFxuICAgICAgICB2YWx1ZXMuc2tld1ggfHxcbiAgICAgICAgdmFsdWVzLnNrZXdZKTtcbn1cbmZ1bmN0aW9uIGhhczJEVHJhbnNsYXRlKHZhbHVlcykge1xuICAgIHJldHVybiBpczJEVHJhbnNsYXRlKHZhbHVlcy54KSB8fCBpczJEVHJhbnNsYXRlKHZhbHVlcy55KTtcbn1cbmZ1bmN0aW9uIGlzMkRUcmFuc2xhdGUodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdmFsdWUgIT09IFwiMCVcIjtcbn1cblxuZXhwb3J0IHsgaGFzMkRUcmFuc2xhdGUsIGhhc1NjYWxlLCBoYXNUcmFuc2Zvcm0gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhhcy10cmFuc2Zvcm0ubWpzLm1hcFxuIiwiaW1wb3J0IHsgbWl4TnVtYmVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvbWl4L251bWJlci5tanMnO1xuaW1wb3J0IHsgaGFzVHJhbnNmb3JtIH0gZnJvbSAnLi4vdXRpbHMvaGFzLXRyYW5zZm9ybS5tanMnO1xuXG4vKipcbiAqIFNjYWxlcyBhIHBvaW50IGJhc2VkIG9uIGEgZmFjdG9yIGFuZCBhbiBvcmlnaW5Qb2ludFxuICovXG5mdW5jdGlvbiBzY2FsZVBvaW50KHBvaW50LCBzY2FsZSwgb3JpZ2luUG9pbnQpIHtcbiAgICBjb25zdCBkaXN0YW5jZUZyb21PcmlnaW4gPSBwb2ludCAtIG9yaWdpblBvaW50O1xuICAgIGNvbnN0IHNjYWxlZCA9IHNjYWxlICogZGlzdGFuY2VGcm9tT3JpZ2luO1xuICAgIHJldHVybiBvcmlnaW5Qb2ludCArIHNjYWxlZDtcbn1cbi8qKlxuICogQXBwbGllcyBhIHRyYW5zbGF0ZS9zY2FsZSBkZWx0YSB0byBhIHBvaW50XG4gKi9cbmZ1bmN0aW9uIGFwcGx5UG9pbnREZWx0YShwb2ludCwgdHJhbnNsYXRlLCBzY2FsZSwgb3JpZ2luUG9pbnQsIGJveFNjYWxlKSB7XG4gICAgaWYgKGJveFNjYWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcG9pbnQgPSBzY2FsZVBvaW50KHBvaW50LCBib3hTY2FsZSwgb3JpZ2luUG9pbnQpO1xuICAgIH1cbiAgICByZXR1cm4gc2NhbGVQb2ludChwb2ludCwgc2NhbGUsIG9yaWdpblBvaW50KSArIHRyYW5zbGF0ZTtcbn1cbi8qKlxuICogQXBwbGllcyBhIHRyYW5zbGF0ZS9zY2FsZSBkZWx0YSB0byBhbiBheGlzXG4gKi9cbmZ1bmN0aW9uIGFwcGx5QXhpc0RlbHRhKGF4aXMsIHRyYW5zbGF0ZSA9IDAsIHNjYWxlID0gMSwgb3JpZ2luUG9pbnQsIGJveFNjYWxlKSB7XG4gICAgYXhpcy5taW4gPSBhcHBseVBvaW50RGVsdGEoYXhpcy5taW4sIHRyYW5zbGF0ZSwgc2NhbGUsIG9yaWdpblBvaW50LCBib3hTY2FsZSk7XG4gICAgYXhpcy5tYXggPSBhcHBseVBvaW50RGVsdGEoYXhpcy5tYXgsIHRyYW5zbGF0ZSwgc2NhbGUsIG9yaWdpblBvaW50LCBib3hTY2FsZSk7XG59XG4vKipcbiAqIEFwcGxpZXMgYSB0cmFuc2xhdGUvc2NhbGUgZGVsdGEgdG8gYSBib3hcbiAqL1xuZnVuY3Rpb24gYXBwbHlCb3hEZWx0YShib3gsIHsgeCwgeSB9KSB7XG4gICAgYXBwbHlBeGlzRGVsdGEoYm94LngsIHgudHJhbnNsYXRlLCB4LnNjYWxlLCB4Lm9yaWdpblBvaW50KTtcbiAgICBhcHBseUF4aXNEZWx0YShib3gueSwgeS50cmFuc2xhdGUsIHkuc2NhbGUsIHkub3JpZ2luUG9pbnQpO1xufVxuY29uc3QgVFJFRV9TQ0FMRV9TTkFQX01JTiA9IDAuOTk5OTk5OTk5OTk5O1xuY29uc3QgVFJFRV9TQ0FMRV9TTkFQX01BWCA9IDEuMDAwMDAwMDAwMDAwMTtcbi8qKlxuICogQXBwbHkgYSB0cmVlIG9mIGRlbHRhcyB0byBhIGJveC4gV2UgZG8gdGhpcyB0byBjYWxjdWxhdGUgdGhlIGVmZmVjdCBvZiBhbGwgdGhlIHRyYW5zZm9ybXNcbiAqIGluIGEgdHJlZSB1cG9uIG91ciBib3ggYmVmb3JlIHRoZW4gY2FsY3VsYXRpbmcgaG93IHRvIHByb2plY3QgaXQgaW50byBvdXIgZGVzaXJlZCB2aWV3cG9ydC1yZWxhdGl2ZSBib3hcbiAqXG4gKiBUaGlzIGlzIHRoZSBmaW5hbCBuZXN0ZWQgbG9vcCB3aXRoaW4gdXBkYXRlTGF5b3V0RGVsdGEgZm9yIGZ1dHVyZSByZWZhY3RvcmluZ1xuICovXG5mdW5jdGlvbiBhcHBseVRyZWVEZWx0YXMoYm94LCB0cmVlU2NhbGUsIHRyZWVQYXRoLCBpc1NoYXJlZFRyYW5zaXRpb24gPSBmYWxzZSkge1xuICAgIGNvbnN0IHRyZWVMZW5ndGggPSB0cmVlUGF0aC5sZW5ndGg7XG4gICAgaWYgKCF0cmVlTGVuZ3RoKVxuICAgICAgICByZXR1cm47XG4gICAgLy8gUmVzZXQgdGhlIHRyZWVTY2FsZVxuICAgIHRyZWVTY2FsZS54ID0gdHJlZVNjYWxlLnkgPSAxO1xuICAgIGxldCBub2RlO1xuICAgIGxldCBkZWx0YTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyZWVMZW5ndGg7IGkrKykge1xuICAgICAgICBub2RlID0gdHJlZVBhdGhbaV07XG4gICAgICAgIGRlbHRhID0gbm9kZS5wcm9qZWN0aW9uRGVsdGE7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUT0RPOiBQcmVmZXIgdG8gcmVtb3ZlIHRoaXMsIGJ1dCBjdXJyZW50bHkgd2UgaGF2ZSBtb3Rpb24gY29tcG9uZW50cyB3aXRoXG4gICAgICAgICAqIGRpc3BsYXk6IGNvbnRlbnRzIGluIEZyYW1lci5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHsgdmlzdWFsRWxlbWVudCB9ID0gbm9kZS5vcHRpb25zO1xuICAgICAgICBpZiAodmlzdWFsRWxlbWVudCAmJlxuICAgICAgICAgICAgdmlzdWFsRWxlbWVudC5wcm9wcy5zdHlsZSAmJlxuICAgICAgICAgICAgdmlzdWFsRWxlbWVudC5wcm9wcy5zdHlsZS5kaXNwbGF5ID09PSBcImNvbnRlbnRzXCIpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1NoYXJlZFRyYW5zaXRpb24gJiZcbiAgICAgICAgICAgIG5vZGUub3B0aW9ucy5sYXlvdXRTY3JvbGwgJiZcbiAgICAgICAgICAgIG5vZGUuc2Nyb2xsICYmXG4gICAgICAgICAgICBub2RlICE9PSBub2RlLnJvb3QpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybUJveChib3gsIHtcbiAgICAgICAgICAgICAgICB4OiAtbm9kZS5zY3JvbGwub2Zmc2V0LngsXG4gICAgICAgICAgICAgICAgeTogLW5vZGUuc2Nyb2xsLm9mZnNldC55LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlbHRhKSB7XG4gICAgICAgICAgICAvLyBJbmNvcG9yYXRlIGVhY2ggYW5jZXN0b3IncyBzY2FsZSBpbnRvIGEgY3VtdWxhdGl2ZSB0cmVlU2NhbGUgZm9yIHRoaXMgY29tcG9uZW50XG4gICAgICAgICAgICB0cmVlU2NhbGUueCAqPSBkZWx0YS54LnNjYWxlO1xuICAgICAgICAgICAgdHJlZVNjYWxlLnkgKj0gZGVsdGEueS5zY2FsZTtcbiAgICAgICAgICAgIC8vIEFwcGx5IGVhY2ggYW5jZXN0b3IncyBjYWxjdWxhdGVkIGRlbHRhIGludG8gdGhpcyBjb21wb25lbnQncyByZWNvcmRlZCBsYXlvdXQgYm94XG4gICAgICAgICAgICBhcHBseUJveERlbHRhKGJveCwgZGVsdGEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1NoYXJlZFRyYW5zaXRpb24gJiYgaGFzVHJhbnNmb3JtKG5vZGUubGF0ZXN0VmFsdWVzKSkge1xuICAgICAgICAgICAgdHJhbnNmb3JtQm94KGJveCwgbm9kZS5sYXRlc3RWYWx1ZXMsIG5vZGUubGF5b3V0Py5sYXlvdXRCb3gpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNuYXAgdHJlZSBzY2FsZSBiYWNrIHRvIDEgaWYgaXQncyB3aXRoaW4gYSBub24tcGVyY2VpdmFibGUgdGhyZXNob2xkLlxuICAgICAqIFRoaXMgd2lsbCBoZWxwIHJlZHVjZSB1c2VsZXNzIHNjYWxlcyBnZXR0aW5nIHJlbmRlcmVkLlxuICAgICAqL1xuICAgIGlmICh0cmVlU2NhbGUueCA8IFRSRUVfU0NBTEVfU05BUF9NQVggJiZcbiAgICAgICAgdHJlZVNjYWxlLnggPiBUUkVFX1NDQUxFX1NOQVBfTUlOKSB7XG4gICAgICAgIHRyZWVTY2FsZS54ID0gMS4wO1xuICAgIH1cbiAgICBpZiAodHJlZVNjYWxlLnkgPCBUUkVFX1NDQUxFX1NOQVBfTUFYICYmXG4gICAgICAgIHRyZWVTY2FsZS55ID4gVFJFRV9TQ0FMRV9TTkFQX01JTikge1xuICAgICAgICB0cmVlU2NhbGUueSA9IDEuMDtcbiAgICB9XG59XG5mdW5jdGlvbiB0cmFuc2xhdGVBeGlzKGF4aXMsIGRpc3RhbmNlKSB7XG4gICAgYXhpcy5taW4gPSBheGlzLm1pbiArIGRpc3RhbmNlO1xuICAgIGF4aXMubWF4ID0gYXhpcy5tYXggKyBkaXN0YW5jZTtcbn1cbi8qKlxuICogQXBwbHkgYSB0cmFuc2Zvcm0gdG8gYW4gYXhpcyBmcm9tIHRoZSBsYXRlc3QgcmVzb2x2ZWQgbW90aW9uIHZhbHVlcy5cbiAqIFRoaXMgZnVuY3Rpb24gYmFzaWNhbGx5IGFjdHMgYXMgYSBicmlkZ2UgYmV0d2VlbiBhIGZsYXQgbW90aW9uIHZhbHVlIG1hcFxuICogYW5kIGFwcGx5QXhpc0RlbHRhXG4gKi9cbmZ1bmN0aW9uIHRyYW5zZm9ybUF4aXMoYXhpcywgYXhpc1RyYW5zbGF0ZSwgYXhpc1NjYWxlLCBib3hTY2FsZSwgYXhpc09yaWdpbiA9IDAuNSkge1xuICAgIGNvbnN0IG9yaWdpblBvaW50ID0gbWl4TnVtYmVyKGF4aXMubWluLCBheGlzLm1heCwgYXhpc09yaWdpbik7XG4gICAgLy8gQXBwbHkgdGhlIGF4aXMgZGVsdGEgdG8gdGhlIGZpbmFsIGF4aXNcbiAgICBhcHBseUF4aXNEZWx0YShheGlzLCBheGlzVHJhbnNsYXRlLCBheGlzU2NhbGUsIG9yaWdpblBvaW50LCBib3hTY2FsZSk7XG59XG5mdW5jdGlvbiByZXNvbHZlQXhpc1RyYW5zbGF0ZSh2YWx1ZSwgYXhpcykge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIChwYXJzZUZsb2F0KHZhbHVlKSAvIDEwMCkgKiAoYXhpcy5tYXggLSBheGlzLm1pbik7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbn1cbi8qKlxuICogQXBwbHkgYSB0cmFuc2Zvcm0gdG8gYSBib3ggZnJvbSB0aGUgbGF0ZXN0IHJlc29sdmVkIG1vdGlvbiB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIHRyYW5zZm9ybUJveChib3gsIHRyYW5zZm9ybSwgc291cmNlQm94KSB7XG4gICAgY29uc3QgcmVzb2x2ZUJveCA9IHNvdXJjZUJveCA/PyBib3g7XG4gICAgdHJhbnNmb3JtQXhpcyhib3gueCwgcmVzb2x2ZUF4aXNUcmFuc2xhdGUodHJhbnNmb3JtLngsIHJlc29sdmVCb3gueCksIHRyYW5zZm9ybS5zY2FsZVgsIHRyYW5zZm9ybS5zY2FsZSwgdHJhbnNmb3JtLm9yaWdpblgpO1xuICAgIHRyYW5zZm9ybUF4aXMoYm94LnksIHJlc29sdmVBeGlzVHJhbnNsYXRlKHRyYW5zZm9ybS55LCByZXNvbHZlQm94LnkpLCB0cmFuc2Zvcm0uc2NhbGVZLCB0cmFuc2Zvcm0uc2NhbGUsIHRyYW5zZm9ybS5vcmlnaW5ZKTtcbn1cblxuZXhwb3J0IHsgYXBwbHlBeGlzRGVsdGEsIGFwcGx5Qm94RGVsdGEsIGFwcGx5UG9pbnREZWx0YSwgYXBwbHlUcmVlRGVsdGFzLCBzY2FsZVBvaW50LCB0cmFuc2Zvcm1BeGlzLCB0cmFuc2Zvcm1Cb3gsIHRyYW5zbGF0ZUF4aXMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRlbHRhLWFwcGx5Lm1qcy5tYXBcbiIsImltcG9ydCB7IGNvbnZlcnRCb3VuZGluZ0JveFRvQm94LCB0cmFuc2Zvcm1Cb3hQb2ludHMgfSBmcm9tICcuLi9nZW9tZXRyeS9jb252ZXJzaW9uLm1qcyc7XG5pbXBvcnQgeyB0cmFuc2xhdGVBeGlzIH0gZnJvbSAnLi4vZ2VvbWV0cnkvZGVsdGEtYXBwbHkubWpzJztcblxuZnVuY3Rpb24gbWVhc3VyZVZpZXdwb3J0Qm94KGluc3RhbmNlLCB0cmFuc2Zvcm1Qb2ludCkge1xuICAgIHJldHVybiBjb252ZXJ0Qm91bmRpbmdCb3hUb0JveCh0cmFuc2Zvcm1Cb3hQb2ludHMoaW5zdGFuY2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIHRyYW5zZm9ybVBvaW50KSk7XG59XG5mdW5jdGlvbiBtZWFzdXJlUGFnZUJveChlbGVtZW50LCByb290UHJvamVjdGlvbk5vZGUsIHRyYW5zZm9ybVBhZ2VQb2ludCkge1xuICAgIGNvbnN0IHZpZXdwb3J0Qm94ID0gbWVhc3VyZVZpZXdwb3J0Qm94KGVsZW1lbnQsIHRyYW5zZm9ybVBhZ2VQb2ludCk7XG4gICAgY29uc3QgeyBzY3JvbGwgfSA9IHJvb3RQcm9qZWN0aW9uTm9kZTtcbiAgICBpZiAoc2Nyb2xsKSB7XG4gICAgICAgIHRyYW5zbGF0ZUF4aXModmlld3BvcnRCb3gueCwgc2Nyb2xsLm9mZnNldC54KTtcbiAgICAgICAgdHJhbnNsYXRlQXhpcyh2aWV3cG9ydEJveC55LCBzY3JvbGwub2Zmc2V0LnkpO1xuICAgIH1cbiAgICByZXR1cm4gdmlld3BvcnRCb3g7XG59XG5cbmV4cG9ydCB7IG1lYXN1cmVQYWdlQm94LCBtZWFzdXJlVmlld3BvcnRCb3ggfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lYXN1cmUubWpzLm1hcFxuIiwiaW1wb3J0IHsgZ2V0VmFsdWVBc1R5cGUgfSBmcm9tICcuLi8uLi8uLi92YWx1ZS90eXBlcy91dGlscy9nZXQtYXMtdHlwZS5tanMnO1xuaW1wb3J0IHsgbnVtYmVyVmFsdWVUeXBlcyB9IGZyb20gJy4uLy4uLy4uL3ZhbHVlL3R5cGVzL21hcHMvbnVtYmVyLm1qcyc7XG5pbXBvcnQgeyB0cmFuc2Zvcm1Qcm9wT3JkZXIgfSBmcm9tICcuLi8uLi91dGlscy9rZXlzLXRyYW5zZm9ybS5tanMnO1xuXG5jb25zdCB0cmFuc2xhdGVBbGlhcyA9IHtcbiAgICB4OiBcInRyYW5zbGF0ZVhcIixcbiAgICB5OiBcInRyYW5zbGF0ZVlcIixcbiAgICB6OiBcInRyYW5zbGF0ZVpcIixcbiAgICB0cmFuc2Zvcm1QZXJzcGVjdGl2ZTogXCJwZXJzcGVjdGl2ZVwiLFxufTtcbmNvbnN0IG51bVRyYW5zZm9ybXMgPSB0cmFuc2Zvcm1Qcm9wT3JkZXIubGVuZ3RoO1xuLyoqXG4gKiBCdWlsZCBhIENTUyB0cmFuc2Zvcm0gc3R5bGUgZnJvbSBpbmRpdmlkdWFsIHgveS9zY2FsZSBldGMgcHJvcGVydGllcy5cbiAqXG4gKiBUaGlzIG91dHB1dHMgd2l0aCBhIGRlZmF1bHQgb3JkZXIgb2YgdHJhbnNmb3Jtcy9zY2FsZXMvcm90YXRpb25zLCB0aGlzIGNhbiBiZSBjdXN0b21pc2VkIGJ5XG4gKiBwcm92aWRpbmcgYSB0cmFuc2Zvcm1UZW1wbGF0ZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYnVpbGRUcmFuc2Zvcm0obGF0ZXN0VmFsdWVzLCB0cmFuc2Zvcm0sIHRyYW5zZm9ybVRlbXBsYXRlKSB7XG4gICAgLy8gVGhlIHRyYW5zZm9ybSBzdHJpbmcgd2UncmUgZ29pbmcgdG8gYnVpbGQgaW50by5cbiAgICBsZXQgdHJhbnNmb3JtU3RyaW5nID0gXCJcIjtcbiAgICBsZXQgdHJhbnNmb3JtSXNEZWZhdWx0ID0gdHJ1ZTtcbiAgICAvKipcbiAgICAgKiBMb29wIG92ZXIgYWxsIHBvc3NpYmxlIHRyYW5zZm9ybXMgaW4gb3JkZXIsIGFkZGluZyB0aGUgb25lcyB0aGF0XG4gICAgICogYXJlIHByZXNlbnQgdG8gdGhlIHRyYW5zZm9ybSBzdHJpbmcuXG4gICAgICovXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1UcmFuc2Zvcm1zOyBpKyspIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdHJhbnNmb3JtUHJvcE9yZGVyW2ldO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGxhdGVzdFZhbHVlc1trZXldO1xuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBsZXQgdmFsdWVJc0RlZmF1bHQgPSB0cnVlO1xuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICB2YWx1ZUlzRGVmYXVsdCA9IHZhbHVlID09PSAoa2V5LnN0YXJ0c1dpdGgoXCJzY2FsZVwiKSA/IDEgOiAwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgICAgICAgdmFsdWVJc0RlZmF1bHQgPSBrZXkuc3RhcnRzV2l0aChcInNjYWxlXCIpID8gcGFyc2VkID09PSAxIDogcGFyc2VkID09PSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdmFsdWVJc0RlZmF1bHQgfHwgdHJhbnNmb3JtVGVtcGxhdGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlQXNUeXBlID0gZ2V0VmFsdWVBc1R5cGUodmFsdWUsIG51bWJlclZhbHVlVHlwZXNba2V5XSk7XG4gICAgICAgICAgICBpZiAoIXZhbHVlSXNEZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtSXNEZWZhdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtTmFtZSA9IHRyYW5zbGF0ZUFsaWFzW2tleV0gfHwga2V5O1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybVN0cmluZyArPSBgJHt0cmFuc2Zvcm1OYW1lfSgke3ZhbHVlQXNUeXBlfSkgYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0cmFuc2Zvcm1UZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybVtrZXldID0gdmFsdWVBc1R5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgdHJhbnNmb3JtU3RyaW5nID0gdHJhbnNmb3JtU3RyaW5nLnRyaW0oKTtcbiAgICAvLyBJZiB3ZSBoYXZlIGEgY3VzdG9tIGB0cmFuc2Zvcm1gIHRlbXBsYXRlLCBwYXNzIG91ciB0cmFuc2Zvcm0gdmFsdWVzIGFuZFxuICAgIC8vIGdlbmVyYXRlZCB0cmFuc2Zvcm1TdHJpbmcgdG8gdGhhdCBiZWZvcmUgcmV0dXJuaW5nXG4gICAgaWYgKHRyYW5zZm9ybVRlbXBsYXRlKSB7XG4gICAgICAgIHRyYW5zZm9ybVN0cmluZyA9IHRyYW5zZm9ybVRlbXBsYXRlKHRyYW5zZm9ybSwgdHJhbnNmb3JtSXNEZWZhdWx0ID8gXCJcIiA6IHRyYW5zZm9ybVN0cmluZyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRyYW5zZm9ybUlzRGVmYXVsdCkge1xuICAgICAgICB0cmFuc2Zvcm1TdHJpbmcgPSBcIm5vbmVcIjtcbiAgICB9XG4gICAgcmV0dXJuIHRyYW5zZm9ybVN0cmluZztcbn1cblxuZXhwb3J0IHsgYnVpbGRUcmFuc2Zvcm0gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1aWxkLXRyYW5zZm9ybS5tanMubWFwXG4iLCJpbXBvcnQgeyBnZXRWYWx1ZUFzVHlwZSB9IGZyb20gJy4uLy4uLy4uL3ZhbHVlL3R5cGVzL3V0aWxzL2dldC1hcy10eXBlLm1qcyc7XG5pbXBvcnQgeyBudW1iZXJWYWx1ZVR5cGVzIH0gZnJvbSAnLi4vLi4vLi4vdmFsdWUvdHlwZXMvbWFwcy9udW1iZXIubWpzJztcbmltcG9ydCB7IHRyYW5zZm9ybVByb3BzIH0gZnJvbSAnLi4vLi4vdXRpbHMva2V5cy10cmFuc2Zvcm0ubWpzJztcbmltcG9ydCB7IGlzQ1NTVmFyaWFibGVOYW1lIH0gZnJvbSAnLi4vLi4vLi4vYW5pbWF0aW9uL3V0aWxzL2lzLWNzcy12YXJpYWJsZS5tanMnO1xuaW1wb3J0IHsgYnVpbGRUcmFuc2Zvcm0gfSBmcm9tICcuL2J1aWxkLXRyYW5zZm9ybS5tanMnO1xuXG5mdW5jdGlvbiBidWlsZEhUTUxTdHlsZXMoc3RhdGUsIGxhdGVzdFZhbHVlcywgdHJhbnNmb3JtVGVtcGxhdGUpIHtcbiAgICBjb25zdCB7IHN0eWxlLCB2YXJzLCB0cmFuc2Zvcm1PcmlnaW4gfSA9IHN0YXRlO1xuICAgIC8vIFRyYWNrIHdoZXRoZXIgd2UgZW5jb3VudGVyIGFueSB0cmFuc2Zvcm0gb3IgdHJhbnNmb3JtT3JpZ2luIHZhbHVlcy5cbiAgICBsZXQgaGFzVHJhbnNmb3JtID0gZmFsc2U7XG4gICAgbGV0IGhhc1RyYW5zZm9ybU9yaWdpbiA9IGZhbHNlO1xuICAgIC8qKlxuICAgICAqIExvb3Agb3ZlciBhbGwgb3VyIGxhdGVzdCBhbmltYXRlZCB2YWx1ZXMgYW5kIGRlY2lkZSB3aGV0aGVyIHRvIGhhbmRsZSB0aGVtXG4gICAgICogYXMgYSBzdHlsZSBvciBDU1MgdmFyaWFibGUuXG4gICAgICpcbiAgICAgKiBUcmFuc2Zvcm1zIGFuZCB0cmFuc2Zvcm0gb3JpZ2lucyBhcmUga2VwdCBzZXBhcmF0ZWx5IGZvciBmdXJ0aGVyIHByb2Nlc3NpbmcuXG4gICAgICovXG4gICAgZm9yIChjb25zdCBrZXkgaW4gbGF0ZXN0VmFsdWVzKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gbGF0ZXN0VmFsdWVzW2tleV07XG4gICAgICAgIGlmICh0cmFuc2Zvcm1Qcm9wcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhIHRyYW5zZm9ybSwgZmxhZyB0byBlbmFibGUgZnVydGhlciB0cmFuc2Zvcm0gcHJvY2Vzc2luZ1xuICAgICAgICAgICAgaGFzVHJhbnNmb3JtID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzQ1NTVmFyaWFibGVOYW1lKGtleSkpIHtcbiAgICAgICAgICAgIHZhcnNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBDb252ZXJ0IHRoZSB2YWx1ZSB0byBpdHMgZGVmYXVsdCB2YWx1ZSB0eXBlLCBpZSAwIC0+IFwiMHB4XCJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlQXNUeXBlID0gZ2V0VmFsdWVBc1R5cGUodmFsdWUsIG51bWJlclZhbHVlVHlwZXNba2V5XSk7XG4gICAgICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoXCJvcmlnaW5cIikpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIGlzIGEgdHJhbnNmb3JtIG9yaWdpbiwgZmxhZyBhbmQgZW5hYmxlIGZ1cnRoZXIgdHJhbnNmb3JtLW9yaWdpbiBwcm9jZXNzaW5nXG4gICAgICAgICAgICAgICAgaGFzVHJhbnNmb3JtT3JpZ2luID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW5ba2V5XSA9XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlQXNUeXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc3R5bGVba2V5XSA9IHZhbHVlQXNUeXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghbGF0ZXN0VmFsdWVzLnRyYW5zZm9ybSkge1xuICAgICAgICBpZiAoaGFzVHJhbnNmb3JtIHx8IHRyYW5zZm9ybVRlbXBsYXRlKSB7XG4gICAgICAgICAgICBzdHlsZS50cmFuc2Zvcm0gPSBidWlsZFRyYW5zZm9ybShsYXRlc3RWYWx1ZXMsIHN0YXRlLnRyYW5zZm9ybSwgdHJhbnNmb3JtVGVtcGxhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHN0eWxlLnRyYW5zZm9ybSkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiB3ZSBoYXZlIHByZXZpb3VzbHkgY3JlYXRlZCBhIHRyYW5zZm9ybSBidXQgY3VycmVudGx5IGRvbid0IGhhdmUgYW55LFxuICAgICAgICAgICAgICogcmVzZXQgdHJhbnNmb3JtIHN0eWxlIHRvIG5vbmUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHN0eWxlLnRyYW5zZm9ybSA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEJ1aWxkIGEgdHJhbnNmb3JtT3JpZ2luIHN0eWxlLiBVc2VzIHRoZSBzYW1lIGRlZmF1bHRzIGFzIHRoZSBicm93c2VyIGZvclxuICAgICAqIHVuZGVmaW5lZCBvcmlnaW5zLlxuICAgICAqL1xuICAgIGlmIChoYXNUcmFuc2Zvcm1PcmlnaW4pIHtcbiAgICAgICAgY29uc3QgeyBvcmlnaW5YID0gXCI1MCVcIiwgb3JpZ2luWSA9IFwiNTAlXCIsIG9yaWdpblogPSAwLCB9ID0gdHJhbnNmb3JtT3JpZ2luO1xuICAgICAgICBzdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBgJHtvcmlnaW5YfSAke29yaWdpbll9ICR7b3JpZ2luWn1gO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgYnVpbGRIVE1MU3R5bGVzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1idWlsZC1zdHlsZXMubWpzLm1hcFxuIiwiZnVuY3Rpb24gcmVuZGVySFRNTChlbGVtZW50LCB7IHN0eWxlLCB2YXJzIH0sIHN0eWxlUHJvcCwgcHJvamVjdGlvbikge1xuICAgIGNvbnN0IGVsZW1lbnRTdHlsZSA9IGVsZW1lbnQuc3R5bGU7XG4gICAgbGV0IGtleTtcbiAgICBmb3IgKGtleSBpbiBzdHlsZSkge1xuICAgICAgICAvLyBDU1NTdHlsZURlY2xhcmF0aW9uIGhhcyBbaW5kZXg6IG51bWJlcl06IHN0cmluZzsgaW4gdGhlIHR5cGVzLCBzbyB3ZSB1c2UgdGhhdCBhcyBrZXkgdHlwZS5cbiAgICAgICAgZWxlbWVudFN0eWxlW2tleV0gPSBzdHlsZVtrZXldO1xuICAgIH1cbiAgICAvLyBXcml0ZSBwcm9qZWN0aW9uIHN0eWxlcyBkaXJlY3RseSB0byBlbGVtZW50IHN0eWxlXG4gICAgcHJvamVjdGlvbj8uYXBwbHlQcm9qZWN0aW9uU3R5bGVzKGVsZW1lbnRTdHlsZSwgc3R5bGVQcm9wKTtcbiAgICBmb3IgKGtleSBpbiB2YXJzKSB7XG4gICAgICAgIC8vIExvb3Agb3ZlciBhbnkgQ1NTIHZhcmlhYmxlcyBhbmQgYXNzaWduIHRob3NlLlxuICAgICAgICAvLyBUaGV5IGNhbiBvbmx5IGJlIGFzc2lnbmVkIHVzaW5nIGBzZXRQcm9wZXJ0eWAuXG4gICAgICAgIGVsZW1lbnRTdHlsZS5zZXRQcm9wZXJ0eShrZXksIHZhcnNba2V5XSk7XG4gICAgfVxufVxuXG5leHBvcnQgeyByZW5kZXJIVE1MIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZW5kZXIubWpzLm1hcFxuIiwiaW1wb3J0IHsgcHggfSBmcm9tICcuLi8uLi92YWx1ZS90eXBlcy9udW1iZXJzL3VuaXRzLm1qcyc7XG5cbmZ1bmN0aW9uIHBpeGVsc1RvUGVyY2VudChwaXhlbHMsIGF4aXMpIHtcbiAgICBpZiAoYXhpcy5tYXggPT09IGF4aXMubWluKVxuICAgICAgICByZXR1cm4gMDtcbiAgICByZXR1cm4gKHBpeGVscyAvIChheGlzLm1heCAtIGF4aXMubWluKSkgKiAxMDA7XG59XG4vKipcbiAqIFdlIGFsd2F5cyBjb3JyZWN0IGJvcmRlclJhZGl1cyBhcyBhIHBlcmNlbnRhZ2UgcmF0aGVyIHRoYW4gcGl4ZWxzIHRvIHJlZHVjZSBwYWludHMuXG4gKiBGb3IgZXhhbXBsZSwgaWYgeW91IGFyZSBwcm9qZWN0aW5nIGEgYm94IHRoYXQgaXMgMTAwcHggd2lkZSB3aXRoIGEgMTBweCBib3JkZXJSYWRpdXNcbiAqIGludG8gYSBib3ggdGhhdCBpcyAyMDBweCB3aWRlIHdpdGggYSAyMHB4IGJvcmRlclJhZGl1cywgdGhhdCBpcyBhY3R1YWxseSBhIDEwJVxuICogYm9yZGVyUmFkaXVzIGluIGJvdGggc3RhdGVzLiBJZiB3ZSBhbmltYXRlIGJldHdlZW4gdGhlIHR3byBpbiBwaXhlbHMgdGhhdCB3aWxsIHRyaWdnZXJcbiAqIGEgcGFpbnQgZWFjaCB0aW1lLiBJZiB3ZSBhbmltYXRlIGJldHdlZW4gdGhlIHR3byBpbiBwZXJjZW50YWdlIHdlJ2xsIGF2b2lkIGEgcGFpbnQuXG4gKi9cbmNvbnN0IGNvcnJlY3RCb3JkZXJSYWRpdXMgPSB7XG4gICAgY29ycmVjdDogKGxhdGVzdCwgbm9kZSkgPT4ge1xuICAgICAgICBpZiAoIW5vZGUudGFyZ2V0KVxuICAgICAgICAgICAgcmV0dXJuIGxhdGVzdDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGxhdGVzdCBpcyBhIHN0cmluZywgaWYgaXQncyBhIHBlcmNlbnRhZ2Ugd2UgY2FuIHJldHVybiBpbW1lZGlhdGVseSBhcyBpdCdzXG4gICAgICAgICAqIGdvaW5nIHRvIGJlIHN0cmV0Y2hlZCBhcHByb3ByaWF0ZWx5LiBPdGhlcndpc2UsIGlmIGl0J3MgYSBwaXhlbCwgY29udmVydCBpdCB0byBhIG51bWJlci5cbiAgICAgICAgICovXG4gICAgICAgIGlmICh0eXBlb2YgbGF0ZXN0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBpZiAocHgudGVzdChsYXRlc3QpKSB7XG4gICAgICAgICAgICAgICAgbGF0ZXN0ID0gcGFyc2VGbG9hdChsYXRlc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhdGVzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgbGF0ZXN0IGlzIGEgbnVtYmVyLCBpdCdzIGEgcGl4ZWwgdmFsdWUuIFdlIHVzZSB0aGUgY3VycmVudCB2aWV3cG9ydEJveCB0byBjYWxjdWxhdGUgdGhhdFxuICAgICAgICAgKiBwaXhlbCB2YWx1ZSBhcyBhIHBlcmNlbnRhZ2Ugb2YgZWFjaCBheGlzXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCB4ID0gcGl4ZWxzVG9QZXJjZW50KGxhdGVzdCwgbm9kZS50YXJnZXQueCk7XG4gICAgICAgIGNvbnN0IHkgPSBwaXhlbHNUb1BlcmNlbnQobGF0ZXN0LCBub2RlLnRhcmdldC55KTtcbiAgICAgICAgcmV0dXJuIGAke3h9JSAke3l9JWA7XG4gICAgfSxcbn07XG5cbmV4cG9ydCB7IGNvcnJlY3RCb3JkZXJSYWRpdXMsIHBpeGVsc1RvUGVyY2VudCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NhbGUtYm9yZGVyLXJhZGl1cy5tanMubWFwXG4iLCJpbXBvcnQgeyBjb21wbGV4IH0gZnJvbSAnLi4vLi4vdmFsdWUvdHlwZXMvY29tcGxleC9pbmRleC5tanMnO1xuaW1wb3J0IHsgbWl4TnVtYmVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvbWl4L251bWJlci5tanMnO1xuXG5jb25zdCBjb3JyZWN0Qm94U2hhZG93ID0ge1xuICAgIGNvcnJlY3Q6IChsYXRlc3QsIHsgdHJlZVNjYWxlLCBwcm9qZWN0aW9uRGVsdGEgfSkgPT4ge1xuICAgICAgICBjb25zdCBvcmlnaW5hbCA9IGxhdGVzdDtcbiAgICAgICAgY29uc3Qgc2hhZG93ID0gY29tcGxleC5wYXJzZShsYXRlc3QpO1xuICAgICAgICAvLyBUT0RPOiBEb2Vzbid0IHN1cHBvcnQgbXVsdGlwbGUgc2hhZG93c1xuICAgICAgICBpZiAoc2hhZG93Lmxlbmd0aCA+IDUpXG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luYWw7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gY29tcGxleC5jcmVhdGVUcmFuc2Zvcm1lcihsYXRlc3QpO1xuICAgICAgICBjb25zdCBvZmZzZXQgPSB0eXBlb2Ygc2hhZG93WzBdICE9PSBcIm51bWJlclwiID8gMSA6IDA7XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgb3ZlcmFsbCBjb250ZXh0IHNjYWxlXG4gICAgICAgIGNvbnN0IHhTY2FsZSA9IHByb2plY3Rpb25EZWx0YS54LnNjYWxlICogdHJlZVNjYWxlLng7XG4gICAgICAgIGNvbnN0IHlTY2FsZSA9IHByb2plY3Rpb25EZWx0YS55LnNjYWxlICogdHJlZVNjYWxlLnk7XG4gICAgICAgIHNoYWRvd1swICsgb2Zmc2V0XSAvPSB4U2NhbGU7XG4gICAgICAgIHNoYWRvd1sxICsgb2Zmc2V0XSAvPSB5U2NhbGU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZGVhbGx5IHdlJ2QgY29ycmVjdCB4IGFuZCB5IHNjYWxlcyBpbmRpdmlkdWFsbHksIGJ1dCBiZWNhdXNlIGJsdXIgYW5kXG4gICAgICAgICAqIHNwcmVhZCBhcHBseSB0byBib3RoIHdlIGhhdmUgdG8gdGFrZSBhIHNjYWxlIGF2ZXJhZ2UgYW5kIGFwcGx5IHRoYXQgaW5zdGVhZC5cbiAgICAgICAgICogV2UgY291bGQgcG90ZW50aWFsbHkgaW1wcm92ZSB0aGUgb3V0Y29tZSBvZiB0aGlzIGJ5IGluY29ycG9yYXRpbmcgdGhlIHJhdGlvIGJldHdlZW5cbiAgICAgICAgICogdGhlIHR3byBzY2FsZXMuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBhdmVyYWdlU2NhbGUgPSBtaXhOdW1iZXIoeFNjYWxlLCB5U2NhbGUsIDAuNSk7XG4gICAgICAgIC8vIEJsdXJcbiAgICAgICAgaWYgKHR5cGVvZiBzaGFkb3dbMiArIG9mZnNldF0gPT09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICBzaGFkb3dbMiArIG9mZnNldF0gLz0gYXZlcmFnZVNjYWxlO1xuICAgICAgICAvLyBTcHJlYWRcbiAgICAgICAgaWYgKHR5cGVvZiBzaGFkb3dbMyArIG9mZnNldF0gPT09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICBzaGFkb3dbMyArIG9mZnNldF0gLz0gYXZlcmFnZVNjYWxlO1xuICAgICAgICByZXR1cm4gdGVtcGxhdGUoc2hhZG93KTtcbiAgICB9LFxufTtcblxuZXhwb3J0IHsgY29ycmVjdEJveFNoYWRvdyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NhbGUtYm94LXNoYWRvdy5tanMubWFwXG4iLCJpbXBvcnQgeyBpc0NTU1ZhcmlhYmxlTmFtZSB9IGZyb20gJy4uLy4uL2FuaW1hdGlvbi91dGlscy9pcy1jc3MtdmFyaWFibGUubWpzJztcbmltcG9ydCB7IGNvcnJlY3RCb3JkZXJSYWRpdXMgfSBmcm9tICcuL3NjYWxlLWJvcmRlci1yYWRpdXMubWpzJztcbmltcG9ydCB7IGNvcnJlY3RCb3hTaGFkb3cgfSBmcm9tICcuL3NjYWxlLWJveC1zaGFkb3cubWpzJztcblxuY29uc3Qgc2NhbGVDb3JyZWN0b3JzID0ge1xuICAgIGJvcmRlclJhZGl1czoge1xuICAgICAgICAuLi5jb3JyZWN0Qm9yZGVyUmFkaXVzLFxuICAgICAgICBhcHBseVRvOiBbXG4gICAgICAgICAgICBcImJvcmRlclRvcExlZnRSYWRpdXNcIixcbiAgICAgICAgICAgIFwiYm9yZGVyVG9wUmlnaHRSYWRpdXNcIixcbiAgICAgICAgICAgIFwiYm9yZGVyQm90dG9tTGVmdFJhZGl1c1wiLFxuICAgICAgICAgICAgXCJib3JkZXJCb3R0b21SaWdodFJhZGl1c1wiLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAgYm9yZGVyVG9wTGVmdFJhZGl1czogY29ycmVjdEJvcmRlclJhZGl1cyxcbiAgICBib3JkZXJUb3BSaWdodFJhZGl1czogY29ycmVjdEJvcmRlclJhZGl1cyxcbiAgICBib3JkZXJCb3R0b21MZWZ0UmFkaXVzOiBjb3JyZWN0Qm9yZGVyUmFkaXVzLFxuICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiBjb3JyZWN0Qm9yZGVyUmFkaXVzLFxuICAgIGJveFNoYWRvdzogY29ycmVjdEJveFNoYWRvdyxcbn07XG5mdW5jdGlvbiBhZGRTY2FsZUNvcnJlY3Rvcihjb3JyZWN0b3JzKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gY29ycmVjdG9ycykge1xuICAgICAgICBzY2FsZUNvcnJlY3RvcnNba2V5XSA9IGNvcnJlY3RvcnNba2V5XTtcbiAgICAgICAgaWYgKGlzQ1NTVmFyaWFibGVOYW1lKGtleSkpIHtcbiAgICAgICAgICAgIHNjYWxlQ29ycmVjdG9yc1trZXldLmlzQ1NTVmFyaWFibGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgeyBhZGRTY2FsZUNvcnJlY3Rvciwgc2NhbGVDb3JyZWN0b3JzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY2FsZS1jb3JyZWN0aW9uLm1qcy5tYXBcbiIsImltcG9ydCB7IHRyYW5zZm9ybVByb3BzIH0gZnJvbSAnLi9rZXlzLXRyYW5zZm9ybS5tanMnO1xuaW1wb3J0IHsgc2NhbGVDb3JyZWN0b3JzIH0gZnJvbSAnLi4vLi4vcHJvamVjdGlvbi9zdHlsZXMvc2NhbGUtY29ycmVjdGlvbi5tanMnO1xuZXhwb3J0IHsgYWRkU2NhbGVDb3JyZWN0b3IgfSBmcm9tICcuLi8uLi9wcm9qZWN0aW9uL3N0eWxlcy9zY2FsZS1jb3JyZWN0aW9uLm1qcyc7XG5cbmZ1bmN0aW9uIGlzRm9yY2VkTW90aW9uVmFsdWUoa2V5LCB7IGxheW91dCwgbGF5b3V0SWQgfSkge1xuICAgIHJldHVybiAodHJhbnNmb3JtUHJvcHMuaGFzKGtleSkgfHxcbiAgICAgICAga2V5LnN0YXJ0c1dpdGgoXCJvcmlnaW5cIikgfHxcbiAgICAgICAgKChsYXlvdXQgfHwgbGF5b3V0SWQgIT09IHVuZGVmaW5lZCkgJiZcbiAgICAgICAgICAgICghIXNjYWxlQ29ycmVjdG9yc1trZXldIHx8IGtleSA9PT0gXCJvcGFjaXR5XCIpKSk7XG59XG5cbmV4cG9ydCB7IGlzRm9yY2VkTW90aW9uVmFsdWUsIHNjYWxlQ29ycmVjdG9ycyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtZm9yY2VkLW1vdGlvbi12YWx1ZS5tanMubWFwXG4iLCJpbXBvcnQgeyBpc01vdGlvblZhbHVlIH0gZnJvbSAnLi4vLi4vLi4vdmFsdWUvdXRpbHMvaXMtbW90aW9uLXZhbHVlLm1qcyc7XG5pbXBvcnQgeyBpc0ZvcmNlZE1vdGlvblZhbHVlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaXMtZm9yY2VkLW1vdGlvbi12YWx1ZS5tanMnO1xuXG5mdW5jdGlvbiBzY3JhcGVNb3Rpb25WYWx1ZXNGcm9tUHJvcHMocHJvcHMsIHByZXZQcm9wcywgdmlzdWFsRWxlbWVudCkge1xuICAgIGNvbnN0IHN0eWxlID0gcHJvcHMuc3R5bGU7XG4gICAgY29uc3QgcHJldlN0eWxlID0gcHJldlByb3BzPy5zdHlsZTtcbiAgICBjb25zdCBuZXdWYWx1ZXMgPSB7fTtcbiAgICBpZiAoIXN0eWxlKVxuICAgICAgICByZXR1cm4gbmV3VmFsdWVzO1xuICAgIGZvciAoY29uc3Qga2V5IGluIHN0eWxlKSB7XG4gICAgICAgIGlmIChpc01vdGlvblZhbHVlKHN0eWxlW2tleV0pIHx8XG4gICAgICAgICAgICAocHJldlN0eWxlICYmIGlzTW90aW9uVmFsdWUocHJldlN0eWxlW2tleV0pKSB8fFxuICAgICAgICAgICAgaXNGb3JjZWRNb3Rpb25WYWx1ZShrZXksIHByb3BzKSB8fFxuICAgICAgICAgICAgdmlzdWFsRWxlbWVudD8uZ2V0VmFsdWUoa2V5KT8ubGl2ZVN0eWxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG5ld1ZhbHVlc1trZXldID0gc3R5bGVba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3VmFsdWVzO1xufVxuXG5leHBvcnQgeyBzY3JhcGVNb3Rpb25WYWx1ZXNGcm9tUHJvcHMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNjcmFwZS1tb3Rpb24tdmFsdWVzLm1qcy5tYXBcbiIsImltcG9ydCB7IGlzQ1NTVmFyaWFibGVOYW1lIH0gZnJvbSAnLi4vLi4vYW5pbWF0aW9uL3V0aWxzL2lzLWNzcy12YXJpYWJsZS5tanMnO1xuaW1wb3J0IHsgdHJhbnNmb3JtUHJvcHMgfSBmcm9tICcuLi91dGlscy9rZXlzLXRyYW5zZm9ybS5tanMnO1xuaW1wb3J0IHsgZGVmYXVsdFRyYW5zZm9ybVZhbHVlLCByZWFkVHJhbnNmb3JtVmFsdWUgfSBmcm9tICcuLi9kb20vcGFyc2UtdHJhbnNmb3JtLm1qcyc7XG5pbXBvcnQgeyBtZWFzdXJlVmlld3BvcnRCb3ggfSBmcm9tICcuLi8uLi9wcm9qZWN0aW9uL3V0aWxzL21lYXN1cmUubWpzJztcbmltcG9ydCB7IERPTVZpc3VhbEVsZW1lbnQgfSBmcm9tICcuLi9kb20vRE9NVmlzdWFsRWxlbWVudC5tanMnO1xuaW1wb3J0IHsgYnVpbGRIVE1MU3R5bGVzIH0gZnJvbSAnLi91dGlscy9idWlsZC1zdHlsZXMubWpzJztcbmltcG9ydCB7IHJlbmRlckhUTUwgfSBmcm9tICcuL3V0aWxzL3JlbmRlci5tanMnO1xuaW1wb3J0IHsgc2NyYXBlTW90aW9uVmFsdWVzRnJvbVByb3BzIH0gZnJvbSAnLi91dGlscy9zY3JhcGUtbW90aW9uLXZhbHVlcy5tanMnO1xuXG5mdW5jdGlvbiBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCk7XG59XG5jbGFzcyBIVE1MVmlzdWFsRWxlbWVudCBleHRlbmRzIERPTVZpc3VhbEVsZW1lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnR5cGUgPSBcImh0bWxcIjtcbiAgICAgICAgdGhpcy5yZW5kZXJJbnN0YW5jZSA9IHJlbmRlckhUTUw7XG4gICAgfVxuICAgIHJlYWRWYWx1ZUZyb21JbnN0YW5jZShpbnN0YW5jZSwga2V5KSB7XG4gICAgICAgIGlmICh0cmFuc2Zvcm1Qcm9wcy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvamVjdGlvbj8uaXNQcm9qZWN0aW5nXG4gICAgICAgICAgICAgICAgPyBkZWZhdWx0VHJhbnNmb3JtVmFsdWUoa2V5KVxuICAgICAgICAgICAgICAgIDogcmVhZFRyYW5zZm9ybVZhbHVlKGluc3RhbmNlLCBrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoaW5zdGFuY2UpO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSAoaXNDU1NWYXJpYWJsZU5hbWUoa2V5KVxuICAgICAgICAgICAgICAgID8gY29tcHV0ZWRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKGtleSlcbiAgICAgICAgICAgICAgICA6IGNvbXB1dGVkU3R5bGVba2V5XSkgfHwgMDtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgPyB2YWx1ZS50cmltKCkgOiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBtZWFzdXJlSW5zdGFuY2VWaWV3cG9ydEJveChpbnN0YW5jZSwgeyB0cmFuc2Zvcm1QYWdlUG9pbnQgfSkge1xuICAgICAgICByZXR1cm4gbWVhc3VyZVZpZXdwb3J0Qm94KGluc3RhbmNlLCB0cmFuc2Zvcm1QYWdlUG9pbnQpO1xuICAgIH1cbiAgICBidWlsZChyZW5kZXJTdGF0ZSwgbGF0ZXN0VmFsdWVzLCBwcm9wcykge1xuICAgICAgICBidWlsZEhUTUxTdHlsZXMocmVuZGVyU3RhdGUsIGxhdGVzdFZhbHVlcywgcHJvcHMudHJhbnNmb3JtVGVtcGxhdGUpO1xuICAgIH1cbiAgICBzY3JhcGVNb3Rpb25WYWx1ZXNGcm9tUHJvcHMocHJvcHMsIHByZXZQcm9wcywgdmlzdWFsRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gc2NyYXBlTW90aW9uVmFsdWVzRnJvbVByb3BzKHByb3BzLCBwcmV2UHJvcHMsIHZpc3VhbEVsZW1lbnQpO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgSFRNTFZpc3VhbEVsZW1lbnQsIGdldENvbXB1dGVkU3R5bGUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUhUTUxWaXN1YWxFbGVtZW50Lm1qcy5tYXBcbiIsIi8qKlxuICogUmVzZXQgYW4gYXhpcyB0byB0aGUgcHJvdmlkZWQgb3JpZ2luIGJveC5cbiAqXG4gKiBUaGlzIGlzIGEgbXV0YXRpdmUgb3BlcmF0aW9uLlxuICovXG5mdW5jdGlvbiBjb3B5QXhpc0ludG8oYXhpcywgb3JpZ2luQXhpcykge1xuICAgIGF4aXMubWluID0gb3JpZ2luQXhpcy5taW47XG4gICAgYXhpcy5tYXggPSBvcmlnaW5BeGlzLm1heDtcbn1cbi8qKlxuICogUmVzZXQgYSBib3ggdG8gdGhlIHByb3ZpZGVkIG9yaWdpbiBib3guXG4gKlxuICogVGhpcyBpcyBhIG11dGF0aXZlIG9wZXJhdGlvbi5cbiAqL1xuZnVuY3Rpb24gY29weUJveEludG8oYm94LCBvcmlnaW5Cb3gpIHtcbiAgICBjb3B5QXhpc0ludG8oYm94LngsIG9yaWdpbkJveC54KTtcbiAgICBjb3B5QXhpc0ludG8oYm94LnksIG9yaWdpbkJveC55KTtcbn1cbi8qKlxuICogUmVzZXQgYSBkZWx0YSB0byB0aGUgcHJvdmlkZWQgb3JpZ2luIGJveC5cbiAqXG4gKiBUaGlzIGlzIGEgbXV0YXRpdmUgb3BlcmF0aW9uLlxuICovXG5mdW5jdGlvbiBjb3B5QXhpc0RlbHRhSW50byhkZWx0YSwgb3JpZ2luRGVsdGEpIHtcbiAgICBkZWx0YS50cmFuc2xhdGUgPSBvcmlnaW5EZWx0YS50cmFuc2xhdGU7XG4gICAgZGVsdGEuc2NhbGUgPSBvcmlnaW5EZWx0YS5zY2FsZTtcbiAgICBkZWx0YS5vcmlnaW5Qb2ludCA9IG9yaWdpbkRlbHRhLm9yaWdpblBvaW50O1xuICAgIGRlbHRhLm9yaWdpbiA9IG9yaWdpbkRlbHRhLm9yaWdpbjtcbn1cblxuZXhwb3J0IHsgY29weUF4aXNEZWx0YUludG8sIGNvcHlBeGlzSW50bywgY29weUJveEludG8gfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvcHkubWpzLm1hcFxuIiwiaW1wb3J0IHsgbWl4TnVtYmVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvbWl4L251bWJlci5tanMnO1xuXG5jb25zdCBTQ0FMRV9QUkVDSVNJT04gPSAwLjAwMDE7XG5jb25zdCBTQ0FMRV9NSU4gPSAxIC0gU0NBTEVfUFJFQ0lTSU9OO1xuY29uc3QgU0NBTEVfTUFYID0gMSArIFNDQUxFX1BSRUNJU0lPTjtcbmNvbnN0IFRSQU5TTEFURV9QUkVDSVNJT04gPSAwLjAxO1xuY29uc3QgVFJBTlNMQVRFX01JTiA9IDAgLSBUUkFOU0xBVEVfUFJFQ0lTSU9OO1xuY29uc3QgVFJBTlNMQVRFX01BWCA9IDAgKyBUUkFOU0xBVEVfUFJFQ0lTSU9OO1xuZnVuY3Rpb24gY2FsY0xlbmd0aChheGlzKSB7XG4gICAgcmV0dXJuIGF4aXMubWF4IC0gYXhpcy5taW47XG59XG5mdW5jdGlvbiBpc05lYXIodmFsdWUsIHRhcmdldCwgbWF4RGlzdGFuY2UpIHtcbiAgICByZXR1cm4gTWF0aC5hYnModmFsdWUgLSB0YXJnZXQpIDw9IG1heERpc3RhbmNlO1xufVxuZnVuY3Rpb24gY2FsY0F4aXNEZWx0YShkZWx0YSwgc291cmNlLCB0YXJnZXQsIG9yaWdpbiA9IDAuNSkge1xuICAgIGRlbHRhLm9yaWdpbiA9IG9yaWdpbjtcbiAgICBkZWx0YS5vcmlnaW5Qb2ludCA9IG1peE51bWJlcihzb3VyY2UubWluLCBzb3VyY2UubWF4LCBkZWx0YS5vcmlnaW4pO1xuICAgIGRlbHRhLnNjYWxlID0gY2FsY0xlbmd0aCh0YXJnZXQpIC8gY2FsY0xlbmd0aChzb3VyY2UpO1xuICAgIGRlbHRhLnRyYW5zbGF0ZSA9XG4gICAgICAgIG1peE51bWJlcih0YXJnZXQubWluLCB0YXJnZXQubWF4LCBkZWx0YS5vcmlnaW4pIC0gZGVsdGEub3JpZ2luUG9pbnQ7XG4gICAgaWYgKChkZWx0YS5zY2FsZSA+PSBTQ0FMRV9NSU4gJiYgZGVsdGEuc2NhbGUgPD0gU0NBTEVfTUFYKSB8fFxuICAgICAgICBpc05hTihkZWx0YS5zY2FsZSkpIHtcbiAgICAgICAgZGVsdGEuc2NhbGUgPSAxLjA7XG4gICAgfVxuICAgIGlmICgoZGVsdGEudHJhbnNsYXRlID49IFRSQU5TTEFURV9NSU4gJiZcbiAgICAgICAgZGVsdGEudHJhbnNsYXRlIDw9IFRSQU5TTEFURV9NQVgpIHx8XG4gICAgICAgIGlzTmFOKGRlbHRhLnRyYW5zbGF0ZSkpIHtcbiAgICAgICAgZGVsdGEudHJhbnNsYXRlID0gMC4wO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGNhbGNCb3hEZWx0YShkZWx0YSwgc291cmNlLCB0YXJnZXQsIG9yaWdpbikge1xuICAgIGNhbGNBeGlzRGVsdGEoZGVsdGEueCwgc291cmNlLngsIHRhcmdldC54LCBvcmlnaW4gPyBvcmlnaW4ub3JpZ2luWCA6IHVuZGVmaW5lZCk7XG4gICAgY2FsY0F4aXNEZWx0YShkZWx0YS55LCBzb3VyY2UueSwgdGFyZ2V0LnksIG9yaWdpbiA/IG9yaWdpbi5vcmlnaW5ZIDogdW5kZWZpbmVkKTtcbn1cbmZ1bmN0aW9uIGNhbGNSZWxhdGl2ZUF4aXModGFyZ2V0LCByZWxhdGl2ZSwgcGFyZW50KSB7XG4gICAgdGFyZ2V0Lm1pbiA9IHBhcmVudC5taW4gKyByZWxhdGl2ZS5taW47XG4gICAgdGFyZ2V0Lm1heCA9IHRhcmdldC5taW4gKyBjYWxjTGVuZ3RoKHJlbGF0aXZlKTtcbn1cbmZ1bmN0aW9uIGNhbGNSZWxhdGl2ZUJveCh0YXJnZXQsIHJlbGF0aXZlLCBwYXJlbnQpIHtcbiAgICBjYWxjUmVsYXRpdmVBeGlzKHRhcmdldC54LCByZWxhdGl2ZS54LCBwYXJlbnQueCk7XG4gICAgY2FsY1JlbGF0aXZlQXhpcyh0YXJnZXQueSwgcmVsYXRpdmUueSwgcGFyZW50LnkpO1xufVxuZnVuY3Rpb24gY2FsY1JlbGF0aXZlQXhpc1Bvc2l0aW9uKHRhcmdldCwgbGF5b3V0LCBwYXJlbnQpIHtcbiAgICB0YXJnZXQubWluID0gbGF5b3V0Lm1pbiAtIHBhcmVudC5taW47XG4gICAgdGFyZ2V0Lm1heCA9IHRhcmdldC5taW4gKyBjYWxjTGVuZ3RoKGxheW91dCk7XG59XG5mdW5jdGlvbiBjYWxjUmVsYXRpdmVQb3NpdGlvbih0YXJnZXQsIGxheW91dCwgcGFyZW50KSB7XG4gICAgY2FsY1JlbGF0aXZlQXhpc1Bvc2l0aW9uKHRhcmdldC54LCBsYXlvdXQueCwgcGFyZW50LngpO1xuICAgIGNhbGNSZWxhdGl2ZUF4aXNQb3NpdGlvbih0YXJnZXQueSwgbGF5b3V0LnksIHBhcmVudC55KTtcbn1cblxuZXhwb3J0IHsgY2FsY0F4aXNEZWx0YSwgY2FsY0JveERlbHRhLCBjYWxjTGVuZ3RoLCBjYWxjUmVsYXRpdmVBeGlzLCBjYWxjUmVsYXRpdmVBeGlzUG9zaXRpb24sIGNhbGNSZWxhdGl2ZUJveCwgY2FsY1JlbGF0aXZlUG9zaXRpb24sIGlzTmVhciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGVsdGEtY2FsYy5tanMubWFwXG4iLCJpbXBvcnQgeyBtaXhOdW1iZXIgfSBmcm9tICcuLi8uLi91dGlscy9taXgvbnVtYmVyLm1qcyc7XG5pbXBvcnQgeyBwZXJjZW50IH0gZnJvbSAnLi4vLi4vdmFsdWUvdHlwZXMvbnVtYmVycy91bml0cy5tanMnO1xuaW1wb3J0IHsgc2NhbGVQb2ludCB9IGZyb20gJy4vZGVsdGEtYXBwbHkubWpzJztcblxuLyoqXG4gKiBSZW1vdmUgYSBkZWx0YSBmcm9tIGEgcG9pbnQuIFRoaXMgaXMgZXNzZW50aWFsbHkgdGhlIHN0ZXBzIG9mIGFwcGx5UG9pbnREZWx0YSBpbiByZXZlcnNlXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZVBvaW50RGVsdGEocG9pbnQsIHRyYW5zbGF0ZSwgc2NhbGUsIG9yaWdpblBvaW50LCBib3hTY2FsZSkge1xuICAgIHBvaW50IC09IHRyYW5zbGF0ZTtcbiAgICBwb2ludCA9IHNjYWxlUG9pbnQocG9pbnQsIDEgLyBzY2FsZSwgb3JpZ2luUG9pbnQpO1xuICAgIGlmIChib3hTY2FsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBvaW50ID0gc2NhbGVQb2ludChwb2ludCwgMSAvIGJveFNjYWxlLCBvcmlnaW5Qb2ludCk7XG4gICAgfVxuICAgIHJldHVybiBwb2ludDtcbn1cbi8qKlxuICogUmVtb3ZlIGEgZGVsdGEgZnJvbSBhbiBheGlzLiBUaGlzIGlzIGVzc2VudGlhbGx5IHRoZSBzdGVwcyBvZiBhcHBseUF4aXNEZWx0YSBpbiByZXZlcnNlXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUF4aXNEZWx0YShheGlzLCB0cmFuc2xhdGUgPSAwLCBzY2FsZSA9IDEsIG9yaWdpbiA9IDAuNSwgYm94U2NhbGUsIG9yaWdpbkF4aXMgPSBheGlzLCBzb3VyY2VBeGlzID0gYXhpcykge1xuICAgIGlmIChwZXJjZW50LnRlc3QodHJhbnNsYXRlKSkge1xuICAgICAgICB0cmFuc2xhdGUgPSBwYXJzZUZsb2F0KHRyYW5zbGF0ZSk7XG4gICAgICAgIGNvbnN0IHJlbGF0aXZlUHJvZ3Jlc3MgPSBtaXhOdW1iZXIoc291cmNlQXhpcy5taW4sIHNvdXJjZUF4aXMubWF4LCB0cmFuc2xhdGUgLyAxMDApO1xuICAgICAgICB0cmFuc2xhdGUgPSByZWxhdGl2ZVByb2dyZXNzIC0gc291cmNlQXhpcy5taW47XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdHJhbnNsYXRlICE9PSBcIm51bWJlclwiKVxuICAgICAgICByZXR1cm47XG4gICAgbGV0IG9yaWdpblBvaW50ID0gbWl4TnVtYmVyKG9yaWdpbkF4aXMubWluLCBvcmlnaW5BeGlzLm1heCwgb3JpZ2luKTtcbiAgICBpZiAoYXhpcyA9PT0gb3JpZ2luQXhpcylcbiAgICAgICAgb3JpZ2luUG9pbnQgLT0gdHJhbnNsYXRlO1xuICAgIGF4aXMubWluID0gcmVtb3ZlUG9pbnREZWx0YShheGlzLm1pbiwgdHJhbnNsYXRlLCBzY2FsZSwgb3JpZ2luUG9pbnQsIGJveFNjYWxlKTtcbiAgICBheGlzLm1heCA9IHJlbW92ZVBvaW50RGVsdGEoYXhpcy5tYXgsIHRyYW5zbGF0ZSwgc2NhbGUsIG9yaWdpblBvaW50LCBib3hTY2FsZSk7XG59XG4vKipcbiAqIFJlbW92ZSBhIHRyYW5zZm9ybXMgZnJvbSBhbiBheGlzLiBUaGlzIGlzIGVzc2VudGlhbGx5IHRoZSBzdGVwcyBvZiBhcHBseUF4aXNUcmFuc2Zvcm1zIGluIHJldmVyc2VcbiAqIGFuZCBhY3RzIGFzIGEgYnJpZGdlIGJldHdlZW4gbW90aW9uIHZhbHVlcyBhbmQgcmVtb3ZlQXhpc0RlbHRhXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUF4aXNUcmFuc2Zvcm1zKGF4aXMsIHRyYW5zZm9ybXMsIFtrZXksIHNjYWxlS2V5LCBvcmlnaW5LZXldLCBvcmlnaW4sIHNvdXJjZUF4aXMpIHtcbiAgICByZW1vdmVBeGlzRGVsdGEoYXhpcywgdHJhbnNmb3Jtc1trZXldLCB0cmFuc2Zvcm1zW3NjYWxlS2V5XSwgdHJhbnNmb3Jtc1tvcmlnaW5LZXldLCB0cmFuc2Zvcm1zLnNjYWxlLCBvcmlnaW4sIHNvdXJjZUF4aXMpO1xufVxuLyoqXG4gKiBUaGUgbmFtZXMgb2YgdGhlIG1vdGlvbiB2YWx1ZXMgd2Ugd2FudCB0byBhcHBseSBhcyB0cmFuc2xhdGlvbiwgc2NhbGUgYW5kIG9yaWdpbi5cbiAqL1xuY29uc3QgeEtleXMgPSBbXCJ4XCIsIFwic2NhbGVYXCIsIFwib3JpZ2luWFwiXTtcbmNvbnN0IHlLZXlzID0gW1wieVwiLCBcInNjYWxlWVwiLCBcIm9yaWdpbllcIl07XG4vKipcbiAqIFJlbW92ZSBhIHRyYW5zZm9ybXMgZnJvbSBhbiBib3guIFRoaXMgaXMgZXNzZW50aWFsbHkgdGhlIHN0ZXBzIG9mIGFwcGx5QXhpc0JveCBpbiByZXZlcnNlXG4gKiBhbmQgYWN0cyBhcyBhIGJyaWRnZSBiZXR3ZWVuIG1vdGlvbiB2YWx1ZXMgYW5kIHJlbW92ZUF4aXNEZWx0YVxuICovXG5mdW5jdGlvbiByZW1vdmVCb3hUcmFuc2Zvcm1zKGJveCwgdHJhbnNmb3Jtcywgb3JpZ2luQm94LCBzb3VyY2VCb3gpIHtcbiAgICByZW1vdmVBeGlzVHJhbnNmb3Jtcyhib3gueCwgdHJhbnNmb3JtcywgeEtleXMsIG9yaWdpbkJveCA/IG9yaWdpbkJveC54IDogdW5kZWZpbmVkLCBzb3VyY2VCb3ggPyBzb3VyY2VCb3gueCA6IHVuZGVmaW5lZCk7XG4gICAgcmVtb3ZlQXhpc1RyYW5zZm9ybXMoYm94LnksIHRyYW5zZm9ybXMsIHlLZXlzLCBvcmlnaW5Cb3ggPyBvcmlnaW5Cb3gueSA6IHVuZGVmaW5lZCwgc291cmNlQm94ID8gc291cmNlQm94LnkgOiB1bmRlZmluZWQpO1xufVxuXG5leHBvcnQgeyByZW1vdmVBeGlzRGVsdGEsIHJlbW92ZUF4aXNUcmFuc2Zvcm1zLCByZW1vdmVCb3hUcmFuc2Zvcm1zLCByZW1vdmVQb2ludERlbHRhIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kZWx0YS1yZW1vdmUubWpzLm1hcFxuIiwiaW1wb3J0IHsgY2FsY0xlbmd0aCB9IGZyb20gJy4vZGVsdGEtY2FsYy5tanMnO1xuXG5mdW5jdGlvbiBpc0F4aXNEZWx0YVplcm8oZGVsdGEpIHtcbiAgICByZXR1cm4gZGVsdGEudHJhbnNsYXRlID09PSAwICYmIGRlbHRhLnNjYWxlID09PSAxO1xufVxuZnVuY3Rpb24gaXNEZWx0YVplcm8oZGVsdGEpIHtcbiAgICByZXR1cm4gaXNBeGlzRGVsdGFaZXJvKGRlbHRhLngpICYmIGlzQXhpc0RlbHRhWmVybyhkZWx0YS55KTtcbn1cbmZ1bmN0aW9uIGF4aXNFcXVhbHMoYSwgYikge1xuICAgIHJldHVybiBhLm1pbiA9PT0gYi5taW4gJiYgYS5tYXggPT09IGIubWF4O1xufVxuZnVuY3Rpb24gYm94RXF1YWxzKGEsIGIpIHtcbiAgICByZXR1cm4gYXhpc0VxdWFscyhhLngsIGIueCkgJiYgYXhpc0VxdWFscyhhLnksIGIueSk7XG59XG5mdW5jdGlvbiBheGlzRXF1YWxzUm91bmRlZChhLCBiKSB7XG4gICAgcmV0dXJuIChNYXRoLnJvdW5kKGEubWluKSA9PT0gTWF0aC5yb3VuZChiLm1pbikgJiZcbiAgICAgICAgTWF0aC5yb3VuZChhLm1heCkgPT09IE1hdGgucm91bmQoYi5tYXgpKTtcbn1cbmZ1bmN0aW9uIGJveEVxdWFsc1JvdW5kZWQoYSwgYikge1xuICAgIHJldHVybiBheGlzRXF1YWxzUm91bmRlZChhLngsIGIueCkgJiYgYXhpc0VxdWFsc1JvdW5kZWQoYS55LCBiLnkpO1xufVxuZnVuY3Rpb24gYXNwZWN0UmF0aW8oYm94KSB7XG4gICAgcmV0dXJuIGNhbGNMZW5ndGgoYm94LngpIC8gY2FsY0xlbmd0aChib3gueSk7XG59XG5mdW5jdGlvbiBheGlzRGVsdGFFcXVhbHMoYSwgYikge1xuICAgIHJldHVybiAoYS50cmFuc2xhdGUgPT09IGIudHJhbnNsYXRlICYmXG4gICAgICAgIGEuc2NhbGUgPT09IGIuc2NhbGUgJiZcbiAgICAgICAgYS5vcmlnaW5Qb2ludCA9PT0gYi5vcmlnaW5Qb2ludCk7XG59XG5cbmV4cG9ydCB7IGFzcGVjdFJhdGlvLCBheGlzRGVsdGFFcXVhbHMsIGF4aXNFcXVhbHMsIGF4aXNFcXVhbHNSb3VuZGVkLCBib3hFcXVhbHMsIGJveEVxdWFsc1JvdW5kZWQsIGlzRGVsdGFaZXJvIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD11dGlscy5tanMubWFwXG4iLCJmdW5jdGlvbiBlYWNoQXhpcyhjYWxsYmFjaykge1xuICAgIHJldHVybiBbY2FsbGJhY2soXCJ4XCIpLCBjYWxsYmFjayhcInlcIildO1xufVxuXG5leHBvcnQgeyBlYWNoQXhpcyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZWFjaC1heGlzLm1qcy5tYXBcbiIsImZ1bmN0aW9uIGJ1aWxkUHJvamVjdGlvblRyYW5zZm9ybShkZWx0YSwgdHJlZVNjYWxlLCBsYXRlc3RUcmFuc2Zvcm0pIHtcbiAgICBsZXQgdHJhbnNmb3JtID0gXCJcIjtcbiAgICAvKipcbiAgICAgKiBUaGUgdHJhbnNsYXRpb25zIHdlIHVzZSB0byBjYWxjdWxhdGUgYXJlIGFsd2F5cyByZWxhdGl2ZSB0byB0aGUgdmlld3BvcnQgY29vcmRpbmF0ZSBzcGFjZS5cbiAgICAgKiBCdXQgd2hlbiB3ZSBhcHBseSBzY2FsZXMsIHdlIGFsc28gc2NhbGUgdGhlIGNvb3JkaW5hdGUgc3BhY2Ugb2YgYW4gZWxlbWVudCBhbmQgaXRzIGNoaWxkcmVuLlxuICAgICAqIEZvciBpbnN0YW5jZSBpZiB3ZSBoYXZlIGEgdHJlZVNjYWxlICh0aGUgY3VsbWluYXRpb24gb2YgYWxsIHBhcmVudCBzY2FsZXMpIG9mIDAuNSBhbmQgd2UgbmVlZFxuICAgICAqIHRvIG1vdmUgYW4gZWxlbWVudCAxMDAgcGl4ZWxzLCB3ZSBhY3R1YWxseSBuZWVkIHRvIG1vdmUgaXQgMjAwIGluIHdpdGhpbiB0aGF0IHNjYWxlZCBzcGFjZS5cbiAgICAgKi9cbiAgICBjb25zdCB4VHJhbnNsYXRlID0gZGVsdGEueC50cmFuc2xhdGUgLyB0cmVlU2NhbGUueDtcbiAgICBjb25zdCB5VHJhbnNsYXRlID0gZGVsdGEueS50cmFuc2xhdGUgLyB0cmVlU2NhbGUueTtcbiAgICBjb25zdCB6VHJhbnNsYXRlID0gbGF0ZXN0VHJhbnNmb3JtPy56IHx8IDA7XG4gICAgaWYgKHhUcmFuc2xhdGUgfHwgeVRyYW5zbGF0ZSB8fCB6VHJhbnNsYXRlKSB7XG4gICAgICAgIHRyYW5zZm9ybSA9IGB0cmFuc2xhdGUzZCgke3hUcmFuc2xhdGV9cHgsICR7eVRyYW5zbGF0ZX1weCwgJHt6VHJhbnNsYXRlfXB4KSBgO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBcHBseSBzY2FsZSBjb3JyZWN0aW9uIGZvciB0aGUgdHJlZSB0cmFuc2Zvcm0uXG4gICAgICogVGhpcyB3aWxsIGFwcGx5IHNjYWxlIHRvIHRoZSBzY3JlZW4tb3JpZW50YXRlZCBheGVzLlxuICAgICAqL1xuICAgIGlmICh0cmVlU2NhbGUueCAhPT0gMSB8fCB0cmVlU2NhbGUueSAhPT0gMSkge1xuICAgICAgICB0cmFuc2Zvcm0gKz0gYHNjYWxlKCR7MSAvIHRyZWVTY2FsZS54fSwgJHsxIC8gdHJlZVNjYWxlLnl9KSBgO1xuICAgIH1cbiAgICBpZiAobGF0ZXN0VHJhbnNmb3JtKSB7XG4gICAgICAgIGNvbnN0IHsgdHJhbnNmb3JtUGVyc3BlY3RpdmUsIHJvdGF0ZSwgcm90YXRlWCwgcm90YXRlWSwgc2tld1gsIHNrZXdZIH0gPSBsYXRlc3RUcmFuc2Zvcm07XG4gICAgICAgIGlmICh0cmFuc2Zvcm1QZXJzcGVjdGl2ZSlcbiAgICAgICAgICAgIHRyYW5zZm9ybSA9IGBwZXJzcGVjdGl2ZSgke3RyYW5zZm9ybVBlcnNwZWN0aXZlfXB4KSAke3RyYW5zZm9ybX1gO1xuICAgICAgICBpZiAocm90YXRlKVxuICAgICAgICAgICAgdHJhbnNmb3JtICs9IGByb3RhdGUoJHtyb3RhdGV9ZGVnKSBgO1xuICAgICAgICBpZiAocm90YXRlWClcbiAgICAgICAgICAgIHRyYW5zZm9ybSArPSBgcm90YXRlWCgke3JvdGF0ZVh9ZGVnKSBgO1xuICAgICAgICBpZiAocm90YXRlWSlcbiAgICAgICAgICAgIHRyYW5zZm9ybSArPSBgcm90YXRlWSgke3JvdGF0ZVl9ZGVnKSBgO1xuICAgICAgICBpZiAoc2tld1gpXG4gICAgICAgICAgICB0cmFuc2Zvcm0gKz0gYHNrZXdYKCR7c2tld1h9ZGVnKSBgO1xuICAgICAgICBpZiAoc2tld1kpXG4gICAgICAgICAgICB0cmFuc2Zvcm0gKz0gYHNrZXdZKCR7c2tld1l9ZGVnKSBgO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBcHBseSBzY2FsZSB0byBtYXRjaCB0aGUgc2l6ZSBvZiB0aGUgZWxlbWVudCB0byB0aGUgc2l6ZSB3ZSB3YW50IGl0LlxuICAgICAqIFRoaXMgd2lsbCBhcHBseSBzY2FsZSB0byB0aGUgZWxlbWVudC1vcmllbnRhdGVkIGF4ZXMuXG4gICAgICovXG4gICAgY29uc3QgZWxlbWVudFNjYWxlWCA9IGRlbHRhLnguc2NhbGUgKiB0cmVlU2NhbGUueDtcbiAgICBjb25zdCBlbGVtZW50U2NhbGVZID0gZGVsdGEueS5zY2FsZSAqIHRyZWVTY2FsZS55O1xuICAgIGlmIChlbGVtZW50U2NhbGVYICE9PSAxIHx8IGVsZW1lbnRTY2FsZVkgIT09IDEpIHtcbiAgICAgICAgdHJhbnNmb3JtICs9IGBzY2FsZSgke2VsZW1lbnRTY2FsZVh9LCAke2VsZW1lbnRTY2FsZVl9KWA7XG4gICAgfVxuICAgIHJldHVybiB0cmFuc2Zvcm0gfHwgXCJub25lXCI7XG59XG5cbmV4cG9ydCB7IGJ1aWxkUHJvamVjdGlvblRyYW5zZm9ybSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHJhbnNmb3JtLm1qcy5tYXBcbiIsImltcG9ydCB7IG1peE51bWJlciB9IGZyb20gJy4uLy4uL3V0aWxzL21peC9udW1iZXIubWpzJztcbmltcG9ydCB7IHBlcmNlbnQsIHB4IH0gZnJvbSAnLi4vLi4vdmFsdWUvdHlwZXMvbnVtYmVycy91bml0cy5tanMnO1xuaW1wb3J0IHsgcHJvZ3Jlc3MsIGNpcmNPdXQsIG5vb3AgfSBmcm9tICdtb3Rpb24tdXRpbHMnO1xuXG5jb25zdCBib3JkZXJzID0gW1wiVG9wTGVmdFwiLCBcIlRvcFJpZ2h0XCIsIFwiQm90dG9tTGVmdFwiLCBcIkJvdHRvbVJpZ2h0XCJdO1xuY29uc3QgbnVtQm9yZGVycyA9IGJvcmRlcnMubGVuZ3RoO1xuY29uc3QgYXNOdW1iZXIgPSAodmFsdWUpID0+IHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiA/IHBhcnNlRmxvYXQodmFsdWUpIDogdmFsdWU7XG5jb25zdCBpc1B4ID0gKHZhbHVlKSA9PiB0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgfHwgcHgudGVzdCh2YWx1ZSk7XG5mdW5jdGlvbiBtaXhWYWx1ZXModGFyZ2V0LCBmb2xsb3csIGxlYWQsIHByb2dyZXNzLCBzaG91bGRDcm9zc2ZhZGVPcGFjaXR5LCBpc09ubHlNZW1iZXIpIHtcbiAgICBpZiAoc2hvdWxkQ3Jvc3NmYWRlT3BhY2l0eSkge1xuICAgICAgICB0YXJnZXQub3BhY2l0eSA9IG1peE51bWJlcigwLCBsZWFkLm9wYWNpdHkgPz8gMSwgZWFzZUNyb3NzZmFkZUluKHByb2dyZXNzKSk7XG4gICAgICAgIHRhcmdldC5vcGFjaXR5RXhpdCA9IG1peE51bWJlcihmb2xsb3cub3BhY2l0eSA/PyAxLCAwLCBlYXNlQ3Jvc3NmYWRlT3V0KHByb2dyZXNzKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzT25seU1lbWJlcikge1xuICAgICAgICB0YXJnZXQub3BhY2l0eSA9IG1peE51bWJlcihmb2xsb3cub3BhY2l0eSA/PyAxLCBsZWFkLm9wYWNpdHkgPz8gMSwgcHJvZ3Jlc3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNaXggYm9yZGVyIHJhZGl1c1xuICAgICAqL1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQm9yZGVyczsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGJvcmRlckxhYmVsID0gYGJvcmRlciR7Ym9yZGVyc1tpXX1SYWRpdXNgO1xuICAgICAgICBsZXQgZm9sbG93UmFkaXVzID0gZ2V0UmFkaXVzKGZvbGxvdywgYm9yZGVyTGFiZWwpO1xuICAgICAgICBsZXQgbGVhZFJhZGl1cyA9IGdldFJhZGl1cyhsZWFkLCBib3JkZXJMYWJlbCk7XG4gICAgICAgIGlmIChmb2xsb3dSYWRpdXMgPT09IHVuZGVmaW5lZCAmJiBsZWFkUmFkaXVzID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgZm9sbG93UmFkaXVzIHx8IChmb2xsb3dSYWRpdXMgPSAwKTtcbiAgICAgICAgbGVhZFJhZGl1cyB8fCAobGVhZFJhZGl1cyA9IDApO1xuICAgICAgICBjb25zdCBjYW5NaXggPSBmb2xsb3dSYWRpdXMgPT09IDAgfHxcbiAgICAgICAgICAgIGxlYWRSYWRpdXMgPT09IDAgfHxcbiAgICAgICAgICAgIGlzUHgoZm9sbG93UmFkaXVzKSA9PT0gaXNQeChsZWFkUmFkaXVzKTtcbiAgICAgICAgaWYgKGNhbk1peCkge1xuICAgICAgICAgICAgdGFyZ2V0W2JvcmRlckxhYmVsXSA9IE1hdGgubWF4KG1peE51bWJlcihhc051bWJlcihmb2xsb3dSYWRpdXMpLCBhc051bWJlcihsZWFkUmFkaXVzKSwgcHJvZ3Jlc3MpLCAwKTtcbiAgICAgICAgICAgIGlmIChwZXJjZW50LnRlc3QobGVhZFJhZGl1cykgfHwgcGVyY2VudC50ZXN0KGZvbGxvd1JhZGl1cykpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRbYm9yZGVyTGFiZWxdICs9IFwiJVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGFyZ2V0W2JvcmRlckxhYmVsXSA9IGxlYWRSYWRpdXM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogTWl4IHJvdGF0aW9uXG4gICAgICovXG4gICAgaWYgKGZvbGxvdy5yb3RhdGUgfHwgbGVhZC5yb3RhdGUpIHtcbiAgICAgICAgdGFyZ2V0LnJvdGF0ZSA9IG1peE51bWJlcihmb2xsb3cucm90YXRlIHx8IDAsIGxlYWQucm90YXRlIHx8IDAsIHByb2dyZXNzKTtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXRSYWRpdXModmFsdWVzLCByYWRpdXNOYW1lKSB7XG4gICAgcmV0dXJuIHZhbHVlc1tyYWRpdXNOYW1lXSAhPT0gdW5kZWZpbmVkXG4gICAgICAgID8gdmFsdWVzW3JhZGl1c05hbWVdXG4gICAgICAgIDogdmFsdWVzLmJvcmRlclJhZGl1cztcbn1cbmNvbnN0IGVhc2VDcm9zc2ZhZGVJbiA9IC8qQF9fUFVSRV9fKi8gY29tcHJlc3MoMCwgMC41LCBjaXJjT3V0KTtcbmNvbnN0IGVhc2VDcm9zc2ZhZGVPdXQgPSAvKkBfX1BVUkVfXyovIGNvbXByZXNzKDAuNSwgMC45NSwgbm9vcCk7XG5mdW5jdGlvbiBjb21wcmVzcyhtaW4sIG1heCwgZWFzaW5nKSB7XG4gICAgcmV0dXJuIChwKSA9PiB7XG4gICAgICAgIC8vIENvdWxkIHJlcGxhY2UgaWZzIHdpdGggY2xhbXBcbiAgICAgICAgaWYgKHAgPCBtaW4pXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgaWYgKHAgPiBtYXgpXG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgcmV0dXJuIGVhc2luZyhwcm9ncmVzcyhtaW4sIG1heCwgcCkpO1xuICAgIH07XG59XG5cbmV4cG9ydCB7IG1peFZhbHVlcyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWl4LXZhbHVlcy5tanMubWFwXG4iLCJpbXBvcnQgeyBhbmltYXRlTW90aW9uVmFsdWUgfSBmcm9tICcuLi9pbnRlcmZhY2VzL21vdGlvbi12YWx1ZS5tanMnO1xuaW1wb3J0IHsgbW90aW9uVmFsdWUgfSBmcm9tICcuLi8uLi92YWx1ZS9pbmRleC5tanMnO1xuaW1wb3J0IHsgaXNNb3Rpb25WYWx1ZSB9IGZyb20gJy4uLy4uL3ZhbHVlL3V0aWxzL2lzLW1vdGlvbi12YWx1ZS5tanMnO1xuXG5mdW5jdGlvbiBhbmltYXRlU2luZ2xlVmFsdWUodmFsdWUsIGtleWZyYW1lcywgb3B0aW9ucykge1xuICAgIGNvbnN0IG1vdGlvblZhbHVlJDEgPSBpc01vdGlvblZhbHVlKHZhbHVlKSA/IHZhbHVlIDogbW90aW9uVmFsdWUodmFsdWUpO1xuICAgIG1vdGlvblZhbHVlJDEuc3RhcnQoYW5pbWF0ZU1vdGlvblZhbHVlKFwiXCIsIG1vdGlvblZhbHVlJDEsIGtleWZyYW1lcywgb3B0aW9ucykpO1xuICAgIHJldHVybiBtb3Rpb25WYWx1ZSQxLmFuaW1hdGlvbjtcbn1cblxuZXhwb3J0IHsgYW5pbWF0ZVNpbmdsZVZhbHVlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zaW5nbGUtdmFsdWUubWpzLm1hcFxuIiwiZnVuY3Rpb24gYWRkRG9tRXZlbnQodGFyZ2V0LCBldmVudE5hbWUsIGhhbmRsZXIsIG9wdGlvbnMgPSB7IHBhc3NpdmU6IHRydWUgfSkge1xuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlcik7XG59XG5cbmV4cG9ydCB7IGFkZERvbUV2ZW50IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hZGQtZG9tLWV2ZW50Lm1qcy5tYXBcbiIsImNvbnN0IGNvbXBhcmVCeURlcHRoID0gKGEsIGIpID0+IGEuZGVwdGggLSBiLmRlcHRoO1xuXG5leHBvcnQgeyBjb21wYXJlQnlEZXB0aCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tcGFyZS1ieS1kZXB0aC5tanMubWFwXG4iLCJpbXBvcnQgeyBhZGRVbmlxdWVJdGVtLCByZW1vdmVJdGVtIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcbmltcG9ydCB7IGNvbXBhcmVCeURlcHRoIH0gZnJvbSAnLi9jb21wYXJlLWJ5LWRlcHRoLm1qcyc7XG5cbmNsYXNzIEZsYXRUcmVlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgICAgICB0aGlzLmlzRGlydHkgPSBmYWxzZTtcbiAgICB9XG4gICAgYWRkKGNoaWxkKSB7XG4gICAgICAgIGFkZFVuaXF1ZUl0ZW0odGhpcy5jaGlsZHJlbiwgY2hpbGQpO1xuICAgICAgICB0aGlzLmlzRGlydHkgPSB0cnVlO1xuICAgIH1cbiAgICByZW1vdmUoY2hpbGQpIHtcbiAgICAgICAgcmVtb3ZlSXRlbSh0aGlzLmNoaWxkcmVuLCBjaGlsZCk7XG4gICAgICAgIHRoaXMuaXNEaXJ0eSA9IHRydWU7XG4gICAgfVxuICAgIGZvckVhY2goY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5pc0RpcnR5ICYmIHRoaXMuY2hpbGRyZW4uc29ydChjb21wYXJlQnlEZXB0aCk7XG4gICAgICAgIHRoaXMuaXNEaXJ0eSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goY2FsbGJhY2spO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgRmxhdFRyZWUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZsYXQtdHJlZS5tanMubWFwXG4iLCJpbXBvcnQgeyB0aW1lIH0gZnJvbSAnLi4vZnJhbWVsb29wL3N5bmMtdGltZS5tanMnO1xuaW1wb3J0IHsgc2Vjb25kc1RvTWlsbGlzZWNvbmRzIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcbmltcG9ydCB7IGZyYW1lLCBjYW5jZWxGcmFtZSB9IGZyb20gJy4uL2ZyYW1lbG9vcC9mcmFtZS5tanMnO1xuXG4vKipcbiAqIFRpbWVvdXQgZGVmaW5lZCBpbiBtc1xuICovXG5mdW5jdGlvbiBkZWxheShjYWxsYmFjaywgdGltZW91dCkge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGltZS5ub3coKTtcbiAgICBjb25zdCBjaGVja0VsYXBzZWQgPSAoeyB0aW1lc3RhbXAgfSkgPT4ge1xuICAgICAgICBjb25zdCBlbGFwc2VkID0gdGltZXN0YW1wIC0gc3RhcnQ7XG4gICAgICAgIGlmIChlbGFwc2VkID49IHRpbWVvdXQpIHtcbiAgICAgICAgICAgIGNhbmNlbEZyYW1lKGNoZWNrRWxhcHNlZCk7XG4gICAgICAgICAgICBjYWxsYmFjayhlbGFwc2VkIC0gdGltZW91dCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGZyYW1lLnNldHVwKGNoZWNrRWxhcHNlZCwgdHJ1ZSk7XG4gICAgcmV0dXJuICgpID0+IGNhbmNlbEZyYW1lKGNoZWNrRWxhcHNlZCk7XG59XG5mdW5jdGlvbiBkZWxheUluU2Vjb25kcyhjYWxsYmFjaywgdGltZW91dCkge1xuICAgIHJldHVybiBkZWxheShjYWxsYmFjaywgc2Vjb25kc1RvTWlsbGlzZWNvbmRzKHRpbWVvdXQpKTtcbn1cblxuZXhwb3J0IHsgZGVsYXksIGRlbGF5SW5TZWNvbmRzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kZWxheS5tanMubWFwXG4iLCJpbXBvcnQgeyBpc01vdGlvblZhbHVlIH0gZnJvbSAnLi9pcy1tb3Rpb24tdmFsdWUubWpzJztcblxuLyoqXG4gKiBJZiB0aGUgcHJvdmlkZWQgdmFsdWUgaXMgYSBNb3Rpb25WYWx1ZSwgdGhpcyByZXR1cm5zIHRoZSBhY3R1YWwgdmFsdWUsIG90aGVyd2lzZSBqdXN0IHRoZSB2YWx1ZSBpdHNlbGZcbiAqL1xuZnVuY3Rpb24gcmVzb2x2ZU1vdGlvblZhbHVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIGlzTW90aW9uVmFsdWUodmFsdWUpID8gdmFsdWUuZ2V0KCkgOiB2YWx1ZTtcbn1cblxuZXhwb3J0IHsgcmVzb2x2ZU1vdGlvblZhbHVlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZXNvbHZlLW1vdGlvbi12YWx1ZS5tanMubWFwXG4iLCJpbXBvcnQgeyBhZGRVbmlxdWVJdGVtLCByZW1vdmVJdGVtIH0gZnJvbSAnbW90aW9uLXV0aWxzJztcblxuY2xhc3MgTm9kZVN0YWNrIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5tZW1iZXJzID0gW107XG4gICAgfVxuICAgIGFkZChub2RlKSB7XG4gICAgICAgIGFkZFVuaXF1ZUl0ZW0odGhpcy5tZW1iZXJzLCBub2RlKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMubWVtYmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgY29uc3QgbWVtYmVyID0gdGhpcy5tZW1iZXJzW2ldO1xuICAgICAgICAgICAgaWYgKG1lbWJlciA9PT0gbm9kZSB8fCBtZW1iZXIgPT09IHRoaXMubGVhZCB8fCBtZW1iZXIgPT09IHRoaXMucHJldkxlYWQpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBjb25zdCBpbnN0ID0gbWVtYmVyLmluc3RhbmNlO1xuICAgICAgICAgICAgaWYgKCghaW5zdCB8fCBpbnN0LmlzQ29ubmVjdGVkID09PSBmYWxzZSkgJiYgIW1lbWJlci5zbmFwc2hvdCkge1xuICAgICAgICAgICAgICAgIHJlbW92ZUl0ZW0odGhpcy5tZW1iZXJzLCBtZW1iZXIpO1xuICAgICAgICAgICAgICAgIG1lbWJlci51bm1vdW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbm9kZS5zY2hlZHVsZVJlbmRlcigpO1xuICAgIH1cbiAgICByZW1vdmUobm9kZSkge1xuICAgICAgICByZW1vdmVJdGVtKHRoaXMubWVtYmVycywgbm9kZSk7XG4gICAgICAgIGlmIChub2RlID09PSB0aGlzLnByZXZMZWFkKVxuICAgICAgICAgICAgdGhpcy5wcmV2TGVhZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKG5vZGUgPT09IHRoaXMubGVhZCkge1xuICAgICAgICAgICAgY29uc3QgcHJldkxlYWQgPSB0aGlzLm1lbWJlcnNbdGhpcy5tZW1iZXJzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgaWYgKHByZXZMZWFkKVxuICAgICAgICAgICAgICAgIHRoaXMucHJvbW90ZShwcmV2TGVhZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVsZWdhdGUobm9kZSkge1xuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5tZW1iZXJzLmluZGV4T2Yobm9kZSkgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgY29uc3QgbWVtYmVyID0gdGhpcy5tZW1iZXJzW2ldO1xuICAgICAgICAgICAgaWYgKG1lbWJlci5pc1ByZXNlbnQgIT09IGZhbHNlICYmIG1lbWJlci5pbnN0YW5jZT8uaXNDb25uZWN0ZWQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9tb3RlKG1lbWJlcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBwcm9tb3RlKG5vZGUsIHByZXNlcnZlRm9sbG93T3BhY2l0eSkge1xuICAgICAgICBjb25zdCBwcmV2TGVhZCA9IHRoaXMubGVhZDtcbiAgICAgICAgaWYgKG5vZGUgPT09IHByZXZMZWFkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLnByZXZMZWFkID0gcHJldkxlYWQ7XG4gICAgICAgIHRoaXMubGVhZCA9IG5vZGU7XG4gICAgICAgIG5vZGUuc2hvdygpO1xuICAgICAgICBpZiAocHJldkxlYWQpIHtcbiAgICAgICAgICAgIHByZXZMZWFkLnVwZGF0ZVNuYXBzaG90KCk7XG4gICAgICAgICAgICBub2RlLnNjaGVkdWxlUmVuZGVyKCk7XG4gICAgICAgICAgICBjb25zdCB7IGxheW91dERlcGVuZGVuY3k6IHByZXZEZXAgfSA9IHByZXZMZWFkLm9wdGlvbnM7XG4gICAgICAgICAgICBjb25zdCB7IGxheW91dERlcGVuZGVuY3k6IG5leHREZXAgfSA9IG5vZGUub3B0aW9ucztcbiAgICAgICAgICAgIGlmIChwcmV2RGVwID09PSB1bmRlZmluZWQgfHwgcHJldkRlcCAhPT0gbmV4dERlcCkge1xuICAgICAgICAgICAgICAgIG5vZGUucmVzdW1lRnJvbSA9IHByZXZMZWFkO1xuICAgICAgICAgICAgICAgIGlmIChwcmVzZXJ2ZUZvbGxvd09wYWNpdHkpXG4gICAgICAgICAgICAgICAgICAgIHByZXZMZWFkLnByZXNlcnZlT3BhY2l0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKHByZXZMZWFkLnNuYXBzaG90KSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuc25hcHNob3QgPSBwcmV2TGVhZC5zbmFwc2hvdDtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5zbmFwc2hvdC5sYXRlc3RWYWx1ZXMgPVxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldkxlYWQuYW5pbWF0aW9uVmFsdWVzIHx8IHByZXZMZWFkLmxhdGVzdFZhbHVlcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUucm9vdD8uaXNVcGRhdGluZylcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5pc0xheW91dERpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLm9wdGlvbnMuY3Jvc3NmYWRlID09PSBmYWxzZSlcbiAgICAgICAgICAgICAgICBwcmV2TGVhZC5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZXhpdEFuaW1hdGlvbkNvbXBsZXRlKCkge1xuICAgICAgICB0aGlzLm1lbWJlcnMuZm9yRWFjaCgobWVtYmVyKSA9PiB7XG4gICAgICAgICAgICBtZW1iZXIub3B0aW9ucy5vbkV4aXRDb21wbGV0ZT8uKCk7XG4gICAgICAgICAgICBtZW1iZXIucmVzdW1pbmdGcm9tPy5vcHRpb25zLm9uRXhpdENvbXBsZXRlPy4oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNjaGVkdWxlUmVuZGVyKCkge1xuICAgICAgICB0aGlzLm1lbWJlcnMuZm9yRWFjaCgobWVtYmVyKSA9PiBtZW1iZXIuaW5zdGFuY2UgJiYgbWVtYmVyLnNjaGVkdWxlUmVuZGVyKGZhbHNlKSk7XG4gICAgfVxuICAgIHJlbW92ZUxlYWRTbmFwc2hvdCgpIHtcbiAgICAgICAgaWYgKHRoaXMubGVhZD8uc25hcHNob3QpXG4gICAgICAgICAgICB0aGlzLmxlYWQuc25hcHNob3QgPSB1bmRlZmluZWQ7XG4gICAgfVxufVxuXG5leHBvcnQgeyBOb2RlU3RhY2sgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN0YWNrLm1qcy5tYXBcbiIsIi8qKlxuICogVGhpcyBzaG91bGQgb25seSBldmVyIGJlIG1vZGlmaWVkIG9uIHRoZSBjbGllbnQgb3RoZXJ3aXNlIGl0J2xsXG4gKiBwZXJzaXN0IHRocm91Z2ggc2VydmVyIHJlcXVlc3RzLiBJZiB3ZSBuZWVkIGluc3RhbmNlZCBzdGF0ZXMgd2VcbiAqIGNvdWxkIGxhenktaW5pdCB2aWEgcm9vdC5cbiAqL1xuY29uc3QgZ2xvYmFsUHJvamVjdGlvblN0YXRlID0ge1xuICAgIC8qKlxuICAgICAqIEdsb2JhbCBmbGFnIGFzIHRvIHdoZXRoZXIgdGhlIHRyZWUgaGFzIGFuaW1hdGVkIHNpbmNlIHRoZSBsYXN0IHRpbWVcbiAgICAgKiB3ZSByZXNpemVkIHRoZSB3aW5kb3dcbiAgICAgKi9cbiAgICBoYXNBbmltYXRlZFNpbmNlUmVzaXplOiB0cnVlLFxuICAgIC8qKlxuICAgICAqIFdlIHNldCB0aGlzIHRvIHRydWUgb25jZSwgb24gdGhlIGZpcnN0IHVwZGF0ZS4gQW55IG5vZGVzIGFkZGVkIHRvIHRoZSB0cmVlIGJleW9uZCB0aGF0XG4gICAgICogdXBkYXRlIHdpbGwgYmUgZ2l2ZW4gYSBgZGF0YS1wcm9qZWN0aW9uLWlkYCBhdHRyaWJ1dGUuXG4gICAgICovXG4gICAgaGFzRXZlclVwZGF0ZWQ6IGZhbHNlLFxufTtcblxuZXhwb3J0IHsgZ2xvYmFsUHJvamVjdGlvblN0YXRlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdGF0ZS5tanMubWFwXG4iLCJpbXBvcnQgeyBTdWJzY3JpcHRpb25NYW5hZ2VyLCBjbGFtcCwgbm9vcCB9IGZyb20gJ21vdGlvbi11dGlscyc7XG5pbXBvcnQgeyBhbmltYXRlU2luZ2xlVmFsdWUgfSBmcm9tICcuLi8uLi9hbmltYXRpb24vYW5pbWF0ZS9zaW5nbGUtdmFsdWUubWpzJztcbmltcG9ydCB7IGdldE9wdGltaXNlZEFwcGVhcklkIH0gZnJvbSAnLi4vLi4vYW5pbWF0aW9uL29wdGltaXplZC1hcHBlYXIvZ2V0LWFwcGVhci1pZC5tanMnO1xuaW1wb3J0IHsgZ2V0VmFsdWVUcmFuc2l0aW9uIH0gZnJvbSAnLi4vLi4vYW5pbWF0aW9uL3V0aWxzL2dldC12YWx1ZS10cmFuc2l0aW9uLm1qcyc7XG5pbXBvcnQgeyBtaWNyb3Rhc2sgfSBmcm9tICcuLi8uLi9mcmFtZWxvb3AvbWljcm90YXNrLm1qcyc7XG5pbXBvcnQgeyB0aW1lIH0gZnJvbSAnLi4vLi4vZnJhbWVsb29wL3N5bmMtdGltZS5tanMnO1xuaW1wb3J0IHsgc2NhbGVDb3JyZWN0b3JzIH0gZnJvbSAnLi4vc3R5bGVzL3NjYWxlLWNvcnJlY3Rpb24ubWpzJztcbmltcG9ydCB7IGFjdGl2ZUFuaW1hdGlvbnMgfSBmcm9tICcuLi8uLi9zdGF0cy9hbmltYXRpb24tY291bnQubWpzJztcbmltcG9ydCB7IHN0YXRzQnVmZmVyIH0gZnJvbSAnLi4vLi4vc3RhdHMvYnVmZmVyLm1qcyc7XG5pbXBvcnQgeyBkZWxheSB9IGZyb20gJy4uLy4uL3V0aWxzL2RlbGF5Lm1qcyc7XG5pbXBvcnQgeyBpc1NWR0VsZW1lbnQgfSBmcm9tICcuLi8uLi91dGlscy9pcy1zdmctZWxlbWVudC5tanMnO1xuaW1wb3J0IHsgaXNTVkdTVkdFbGVtZW50IH0gZnJvbSAnLi4vLi4vdXRpbHMvaXMtc3ZnLXN2Zy1lbGVtZW50Lm1qcyc7XG5pbXBvcnQgeyBtaXhOdW1iZXIgfSBmcm9tICcuLi8uLi91dGlscy9taXgvbnVtYmVyLm1qcyc7XG5pbXBvcnQgeyBtb3Rpb25WYWx1ZSB9IGZyb20gJy4uLy4uL3ZhbHVlL2luZGV4Lm1qcyc7XG5pbXBvcnQgeyByZXNvbHZlTW90aW9uVmFsdWUgfSBmcm9tICcuLi8uLi92YWx1ZS91dGlscy9yZXNvbHZlLW1vdGlvbi12YWx1ZS5tanMnO1xuaW1wb3J0IHsgbWl4VmFsdWVzIH0gZnJvbSAnLi4vYW5pbWF0aW9uL21peC12YWx1ZXMubWpzJztcbmltcG9ydCB7IGNvcHlCb3hJbnRvLCBjb3B5QXhpc0RlbHRhSW50bywgY29weUF4aXNJbnRvIH0gZnJvbSAnLi4vZ2VvbWV0cnkvY29weS5tanMnO1xuaW1wb3J0IHsgdHJhbnNsYXRlQXhpcywgdHJhbnNmb3JtQm94LCBhcHBseUJveERlbHRhLCBhcHBseVRyZWVEZWx0YXMgfSBmcm9tICcuLi9nZW9tZXRyeS9kZWx0YS1hcHBseS5tanMnO1xuaW1wb3J0IHsgY2FsY0xlbmd0aCwgY2FsY1JlbGF0aXZlQm94LCBjYWxjUmVsYXRpdmVQb3NpdGlvbiwgY2FsY0JveERlbHRhLCBpc05lYXIgfSBmcm9tICcuLi9nZW9tZXRyeS9kZWx0YS1jYWxjLm1qcyc7XG5pbXBvcnQgeyByZW1vdmVCb3hUcmFuc2Zvcm1zIH0gZnJvbSAnLi4vZ2VvbWV0cnkvZGVsdGEtcmVtb3ZlLm1qcyc7XG5pbXBvcnQgeyBjcmVhdGVCb3gsIGNyZWF0ZURlbHRhIH0gZnJvbSAnLi4vZ2VvbWV0cnkvbW9kZWxzLm1qcyc7XG5pbXBvcnQgeyBib3hFcXVhbHNSb3VuZGVkLCBpc0RlbHRhWmVybywgYXhpc0RlbHRhRXF1YWxzLCBib3hFcXVhbHMsIGFzcGVjdFJhdGlvIH0gZnJvbSAnLi4vZ2VvbWV0cnkvdXRpbHMubWpzJztcbmltcG9ydCB7IE5vZGVTdGFjayB9IGZyb20gJy4uL3NoYXJlZC9zdGFjay5tanMnO1xuaW1wb3J0IHsgYnVpbGRQcm9qZWN0aW9uVHJhbnNmb3JtIH0gZnJvbSAnLi4vc3R5bGVzL3RyYW5zZm9ybS5tanMnO1xuaW1wb3J0IHsgZWFjaEF4aXMgfSBmcm9tICcuLi91dGlscy9lYWNoLWF4aXMubWpzJztcbmltcG9ydCB7IEZsYXRUcmVlIH0gZnJvbSAnLi4vdXRpbHMvZmxhdC10cmVlLm1qcyc7XG5pbXBvcnQgeyBoYXNUcmFuc2Zvcm0sIGhhc1NjYWxlLCBoYXMyRFRyYW5zbGF0ZSB9IGZyb20gJy4uL3V0aWxzL2hhcy10cmFuc2Zvcm0ubWpzJztcbmltcG9ydCB7IGdsb2JhbFByb2plY3Rpb25TdGF0ZSB9IGZyb20gJy4vc3RhdGUubWpzJztcbmltcG9ydCB7IGZyYW1lLCBjYW5jZWxGcmFtZSwgZnJhbWVEYXRhLCBmcmFtZVN0ZXBzIH0gZnJvbSAnLi4vLi4vZnJhbWVsb29wL2ZyYW1lLm1qcyc7XG5cbmNvbnN0IG1ldHJpY3MgPSB7XG4gICAgbm9kZXM6IDAsXG4gICAgY2FsY3VsYXRlZFRhcmdldERlbHRhczogMCxcbiAgICBjYWxjdWxhdGVkUHJvamVjdGlvbnM6IDAsXG59O1xuY29uc3QgdHJhbnNmb3JtQXhlcyA9IFtcIlwiLCBcIlhcIiwgXCJZXCIsIFwiWlwiXTtcbi8qKlxuICogV2UgdXNlIDEwMDAgYXMgdGhlIGFuaW1hdGlvbiB0YXJnZXQgYXMgMC0xMDAwIG1hcHMgYmV0dGVyIHRvIHBpeGVscyB0aGFuIDAtMVxuICogd2hpY2ggaGFzIGEgbm90aWNlYWJsZSBkaWZmZXJlbmNlIGluIHNwcmluZyBhbmltYXRpb25zXG4gKi9cbmNvbnN0IGFuaW1hdGlvblRhcmdldCA9IDEwMDA7XG5sZXQgaWQgPSAwO1xuZnVuY3Rpb24gcmVzZXREaXN0b3J0aW5nVHJhbnNmb3JtKGtleSwgdmlzdWFsRWxlbWVudCwgdmFsdWVzLCBzaGFyZWRBbmltYXRpb25WYWx1ZXMpIHtcbiAgICBjb25zdCB7IGxhdGVzdFZhbHVlcyB9ID0gdmlzdWFsRWxlbWVudDtcbiAgICAvLyBSZWNvcmQgdGhlIGRpc3RvcnRpbmcgdHJhbnNmb3JtIGFuZCB0aGVuIHRlbXBvcmFyaWx5IHNldCBpdCB0byAwXG4gICAgaWYgKGxhdGVzdFZhbHVlc1trZXldKSB7XG4gICAgICAgIHZhbHVlc1trZXldID0gbGF0ZXN0VmFsdWVzW2tleV07XG4gICAgICAgIHZpc3VhbEVsZW1lbnQuc2V0U3RhdGljVmFsdWUoa2V5LCAwKTtcbiAgICAgICAgaWYgKHNoYXJlZEFuaW1hdGlvblZhbHVlcykge1xuICAgICAgICAgICAgc2hhcmVkQW5pbWF0aW9uVmFsdWVzW2tleV0gPSAwO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gY2FuY2VsVHJlZU9wdGltaXNlZFRyYW5zZm9ybUFuaW1hdGlvbnMocHJvamVjdGlvbk5vZGUpIHtcbiAgICBwcm9qZWN0aW9uTm9kZS5oYXNDaGVja2VkT3B0aW1pc2VkQXBwZWFyID0gdHJ1ZTtcbiAgICBpZiAocHJvamVjdGlvbk5vZGUucm9vdCA9PT0gcHJvamVjdGlvbk5vZGUpXG4gICAgICAgIHJldHVybjtcbiAgICBjb25zdCB7IHZpc3VhbEVsZW1lbnQgfSA9IHByb2plY3Rpb25Ob2RlLm9wdGlvbnM7XG4gICAgaWYgKCF2aXN1YWxFbGVtZW50KVxuICAgICAgICByZXR1cm47XG4gICAgY29uc3QgYXBwZWFySWQgPSBnZXRPcHRpbWlzZWRBcHBlYXJJZCh2aXN1YWxFbGVtZW50KTtcbiAgICBpZiAod2luZG93Lk1vdGlvbkhhc09wdGltaXNlZEFuaW1hdGlvbihhcHBlYXJJZCwgXCJ0cmFuc2Zvcm1cIikpIHtcbiAgICAgICAgY29uc3QgeyBsYXlvdXQsIGxheW91dElkIH0gPSBwcm9qZWN0aW9uTm9kZS5vcHRpb25zO1xuICAgICAgICB3aW5kb3cuTW90aW9uQ2FuY2VsT3B0aW1pc2VkQW5pbWF0aW9uKGFwcGVhcklkLCBcInRyYW5zZm9ybVwiLCBmcmFtZSwgIShsYXlvdXQgfHwgbGF5b3V0SWQpKTtcbiAgICB9XG4gICAgY29uc3QgeyBwYXJlbnQgfSA9IHByb2plY3Rpb25Ob2RlO1xuICAgIGlmIChwYXJlbnQgJiYgIXBhcmVudC5oYXNDaGVja2VkT3B0aW1pc2VkQXBwZWFyKSB7XG4gICAgICAgIGNhbmNlbFRyZWVPcHRpbWlzZWRUcmFuc2Zvcm1BbmltYXRpb25zKHBhcmVudCk7XG4gICAgfVxufVxuZnVuY3Rpb24gY3JlYXRlUHJvamVjdGlvbk5vZGUoeyBhdHRhY2hSZXNpemVMaXN0ZW5lciwgZGVmYXVsdFBhcmVudCwgbWVhc3VyZVNjcm9sbCwgY2hlY2tJc1Njcm9sbFJvb3QsIHJlc2V0VHJhbnNmb3JtLCB9KSB7XG4gICAgcmV0dXJuIGNsYXNzIFByb2plY3Rpb25Ob2RlIHtcbiAgICAgICAgY29uc3RydWN0b3IobGF0ZXN0VmFsdWVzID0ge30sIHBhcmVudCA9IGRlZmF1bHRQYXJlbnQ/LigpKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEEgdW5pcXVlIElEIGdlbmVyYXRlZCBmb3IgZXZlcnkgcHJvamVjdGlvbiBub2RlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmlkID0gaWQrKztcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQW4gaWQgdGhhdCByZXByZXNlbnRzIGEgdW5pcXVlIHNlc3Npb24gaW5zdGlnYXRlZCBieSBzdGFydFVwZGF0ZS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25JZCA9IDA7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbkNvbW1pdElkID0gMDtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQSBTZXQgY29udGFpbmluZyBhbGwgdGhpcyBjb21wb25lbnQncyBjaGlsZHJlbi4gVGhpcyBpcyB1c2VkIHRvIGl0ZXJhdGVcbiAgICAgICAgICAgICAqIHRocm91Z2ggdGhlIGNoaWxkcmVuLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIFRPRE86IFRoaXMgY291bGQgYmUgZmFzdGVyIHRvIGl0ZXJhdGUgYXMgYSBmbGF0IGFycmF5IHN0b3JlZCBvbiB0aGUgcm9vdCBub2RlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBPcHRpb25zIGZvciB0aGUgbm9kZS4gV2UgdXNlIHRoaXMgdG8gY29uZmlndXJlIHdoYXQga2luZCBvZiBsYXlvdXQgYW5pbWF0aW9uc1xuICAgICAgICAgICAgICogd2Ugc2hvdWxkIHBlcmZvcm0gKGlmIGFueSkuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBXZSB1c2UgdGhpcyB0byBkZXRlY3Qgd2hlbiBpdHMgc2FmZSB0byBzaHV0IGRvd24gcGFydCBvZiBhIHByb2plY3Rpb24gdHJlZS5cbiAgICAgICAgICAgICAqIFdlIGhhdmUgdG8ga2VlcCBwcm9qZWN0aW5nIGNoaWxkcmVuIGZvciBzY2FsZSBjb3JyZWN0aW9uIGFuZCByZWxhdGl2ZSBwcm9qZWN0aW9uXG4gICAgICAgICAgICAgKiB1bnRpbCBhbGwgdGhlaXIgcGFyZW50cyBzdG9wIHBlcmZvcm1pbmcgbGF5b3V0IGFuaW1hdGlvbnMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuaXNUcmVlQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmlzQW5pbWF0aW9uQmxvY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGbGFnIHRvIHRydWUgaWYgd2UgdGhpbmsgdGhpcyBsYXlvdXQgaGFzIGJlZW4gY2hhbmdlZC4gV2UgY2FuJ3QgYWx3YXlzIGtub3cgdGhpcyxcbiAgICAgICAgICAgICAqIGN1cnJlbnRseSB3ZSBzZXQgaXQgdG8gdHJ1ZSBldmVyeSB0aW1lIGEgY29tcG9uZW50IHJlbmRlcnMsIG9yIGlmIGl0IGhhcyBhIGxheW91dERlcGVuZGVuY3lcbiAgICAgICAgICAgICAqIGlmIHRoYXQgaGFzIGNoYW5nZWQgYmV0d2VlbiByZW5kZXJzLiBBZGRpdGlvbmFsbHksIGNvbXBvbmVudHMgY2FuIGJlIGdyb3VwZWQgYnkgTGF5b3V0R3JvdXBcbiAgICAgICAgICAgICAqIGFuZCBpZiBvbmUgbm9kZSBpcyBkaXJ0aWVkLCB0aGV5IGFsbCBhcmUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuaXNMYXlvdXREaXJ0eSA9IGZhbHNlO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGbGFnIHRvIHRydWUgaWYgd2UgdGhpbmsgdGhlIHByb2plY3Rpb24gY2FsY3VsYXRpb25zIGZvciB0aGlzIG5vZGUgbmVlZHNcbiAgICAgICAgICAgICAqIHJlY2FsY3VsYXRpbmcgYXMgYSByZXN1bHQgb2YgYW4gdXBkYXRlZCB0cmFuc2Zvcm0gb3IgbGF5b3V0IGFuaW1hdGlvbi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5pc1Byb2plY3Rpb25EaXJ0eSA9IGZhbHNlO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGbGFnIHRvIHRydWUgaWYgdGhlIGxheW91dCAqb3IqIHRyYW5zZm9ybSBoYXMgY2hhbmdlZC4gVGhpcyB0aGVuIGdldHMgcHJvcGFnYXRlZFxuICAgICAgICAgICAgICogdGhyb3VnaG91dCB0aGUgcHJvamVjdGlvbiB0cmVlLCBmb3JjaW5nIGFueSBlbGVtZW50IGJlbG93IHRvIHJlY2FsY3VsYXRlIG9uIHRoZSBuZXh0IGZyYW1lLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmlzU2hhcmVkUHJvamVjdGlvbkRpcnR5ID0gZmFsc2U7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZsYWcgdHJhbnNmb3JtIGRpcnR5LiBUaGlzIGdldHMgcHJvcGFnYXRlZCB0aHJvdWdob3V0IHRoZSB3aG9sZSB0cmVlIGJ1dCBpcyBvbmx5XG4gICAgICAgICAgICAgKiByZXNwZWN0ZWQgYnkgc2hhcmVkIG5vZGVzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmlzVHJhbnNmb3JtRGlydHkgPSBmYWxzZTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQmxvY2sgbGF5b3V0IHVwZGF0ZXMgZm9yIGluc3RhbnQgbGF5b3V0IHRyYW5zaXRpb25zIHRocm91Z2hvdXQgdGhlIHRyZWUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMudXBkYXRlTWFudWFsbHlCbG9ja2VkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJsb2NrZWRCeVJlc2l6ZSA9IGZhbHNlO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBTZXQgdG8gdHJ1ZSBiZXR3ZWVuIHRoZSBzdGFydCBvZiB0aGUgZmlyc3QgYHdpbGxVcGRhdGVgIGNhbGwgYW5kIHRoZSBlbmQgb2YgdGhlIGBkaWRVcGRhdGVgXG4gICAgICAgICAgICAgKiBjYWxsLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmlzVXBkYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgdGhpcyBpcyBhbiBTVkcgZWxlbWVudCB3ZSBjdXJyZW50bHkgZGlzYWJsZSBwcm9qZWN0aW9uIHRyYW5zZm9ybXNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5pc1NWRyA9IGZhbHNlO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGbGFnIHRvIHRydWUgKGR1cmluZyBwcm9tb3Rpb24pIGlmIGEgbm9kZSBkb2luZyBhbiBpbnN0YW50IGxheW91dCB0cmFuc2l0aW9uIG5lZWRzIHRvIHJlc2V0XG4gICAgICAgICAgICAgKiBpdHMgcHJvamVjdGlvbiBzdHlsZXMuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMubmVlZHNSZXNldCA9IGZhbHNlO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGbGFncyB3aGV0aGVyIHRoaXMgbm9kZSBzaG91bGQgaGF2ZSBpdHMgdHJhbnNmb3JtIHJlc2V0IHByaW9yIHRvIG1lYXN1cmluZy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5zaG91bGRSZXNldFRyYW5zZm9ybSA9IGZhbHNlO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBTdG9yZSB3aGV0aGVyIHRoaXMgbm9kZSBoYXMgYmVlbiBjaGVja2VkIGZvciBvcHRpbWlzZWQgYXBwZWFyIGFuaW1hdGlvbnMuIEFzXG4gICAgICAgICAgICAgKiBlZmZlY3RzIGZpcmUgYm90dG9tLXVwLCBhbmQgd2Ugd2FudCB0byBsb29rIHVwIHRoZSB0cmVlIGZvciBhcHBlYXIgYW5pbWF0aW9ucyxcbiAgICAgICAgICAgICAqIHRoaXMgbWFrZXMgc3VyZSB3ZSBvbmx5IGNoZWNrIGVhY2ggcGF0aCBvbmNlLCBzdG9wcGluZyBhdCBub2RlcyB0aGF0XG4gICAgICAgICAgICAgKiBoYXZlIGFscmVhZHkgYmVlbiBjaGVja2VkLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmhhc0NoZWNrZWRPcHRpbWlzZWRBcHBlYXIgPSBmYWxzZTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY2FsY3VsYXRlZCBjb250ZXh0dWFsL2FjY3VtdWxhdGVkL3RyZWUgc2NhbGUuXG4gICAgICAgICAgICAgKiBUaGlzIHdpbGwgYmUgdXNlZCB0byBzY2FsZSBjYWxjdWxjYXRlZCBwcm9qZWN0aW9uIHRyYW5zZm9ybXMsIGFzIHRoZXNlIGFyZVxuICAgICAgICAgICAgICogY2FsY3VsYXRlZCBpbiBzY3JlZW4tc3BhY2UgYnV0IG5lZWQgdG8gYmUgc2NhbGVkIGZvciBlbGVtZW50cyB0byBsYXlvdXRseVxuICAgICAgICAgICAgICogbWFrZSBpdCB0byB0aGVpciBjYWxjdWxhdGVkIGRlc3RpbmF0aW9ucy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBUT0RPOiBMYXp5LWluaXRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy50cmVlU2NhbGUgPSB7IHg6IDEsIHk6IDEgfTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJzID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgdGhpcy5oYXNUcmVlQW5pbWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMubGF5b3V0VmVyc2lvbiA9IDA7XG4gICAgICAgICAgICAvLyBOb3RlOiBDdXJyZW50bHkgb25seSBydW5uaW5nIG9uIHJvb3Qgbm9kZVxuICAgICAgICAgICAgdGhpcy51cGRhdGVTY2hlZHVsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVVcGRhdGUgPSAoKSA9PiB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5wcm9qZWN0aW9uVXBkYXRlU2NoZWR1bGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNoZWNrVXBkYXRlRmFpbGVkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzVXBkYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1VwZGF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJBbGxTbmFwc2hvdHMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGlzIGlzIGEgbXVsdGktc3RlcCBwcm9jZXNzIGFzIHNoYXJlZCBub2RlcyBtaWdodCBiZSBvZiBkaWZmZXJlbnQgZGVwdGhzLiBOb2Rlc1xuICAgICAgICAgICAgICogYXJlIHNvcnRlZCBieSBkZXB0aCBvcmRlciwgc28gd2UgbmVlZCB0byByZXNvbHZlIHRoZSBlbnRpcmUgdHJlZSBiZWZvcmUgbW92aW5nIHRvXG4gICAgICAgICAgICAgKiB0aGUgbmV4dCBzdGVwLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByb2plY3Rpb24gPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0aW9uVXBkYXRlU2NoZWR1bGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogUmVzZXQgZGVidWcgY291bnRzLiBNYW51YWxseSByZXNldHRpbmcgcmF0aGVyIHRoYW4gY3JlYXRpbmcgYSBuZXdcbiAgICAgICAgICAgICAgICAgKiBvYmplY3QgZWFjaCBmcmFtZS5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAoc3RhdHNCdWZmZXIudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0cmljcy5ub2RlcyA9XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRyaWNzLmNhbGN1bGF0ZWRUYXJnZXREZWx0YXMgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldHJpY3MuY2FsY3VsYXRlZFByb2plY3Rpb25zID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5ub2Rlcy5mb3JFYWNoKHByb3BhZ2F0ZURpcnR5Tm9kZXMpO1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZXMuZm9yRWFjaChyZXNvbHZlVGFyZ2V0RGVsdGEpO1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZXMuZm9yRWFjaChjYWxjUHJvamVjdGlvbik7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2Rlcy5mb3JFYWNoKGNsZWFuRGlydHlOb2Rlcyk7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRzQnVmZmVyLmFkZFByb2plY3Rpb25NZXRyaWNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRzQnVmZmVyLmFkZFByb2plY3Rpb25NZXRyaWNzKG1ldHJpY3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZyYW1lIGNhbGN1bGF0aW9uc1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLnJlc29sdmVkUmVsYXRpdmVUYXJnZXRBdCA9IDAuMDtcbiAgICAgICAgICAgIHRoaXMubGlua2VkUGFyZW50VmVyc2lvbiA9IDA7XG4gICAgICAgICAgICB0aGlzLmhhc1Byb2plY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5pc1Zpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25Qcm9ncmVzcyA9IDA7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFNoYXJlZCBsYXlvdXRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgLy8gVE9ETyBPbmx5IHJ1bm5pbmcgb24gcm9vdCBub2RlXG4gICAgICAgICAgICB0aGlzLnNoYXJlZE5vZGVzID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgdGhpcy5sYXRlc3RWYWx1ZXMgPSBsYXRlc3RWYWx1ZXM7XG4gICAgICAgICAgICB0aGlzLnJvb3QgPSBwYXJlbnQgPyBwYXJlbnQucm9vdCB8fCBwYXJlbnQgOiB0aGlzO1xuICAgICAgICAgICAgdGhpcy5wYXRoID0gcGFyZW50ID8gWy4uLnBhcmVudC5wYXRoLCBwYXJlbnRdIDogW107XG4gICAgICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgICAgIHRoaXMuZGVwdGggPSBwYXJlbnQgPyBwYXJlbnQuZGVwdGggKyAxIDogMDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXRoW2ldLnNob3VsZFJlc2V0VHJhbnNmb3JtID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnJvb3QgPT09IHRoaXMpXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlcyA9IG5ldyBGbGF0VHJlZSgpO1xuICAgICAgICB9XG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIobmFtZSwgaGFuZGxlcikge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmV2ZW50SGFuZGxlcnMuaGFzKG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJzLnNldChuYW1lLCBuZXcgU3Vic2NyaXB0aW9uTWFuYWdlcigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmV2ZW50SGFuZGxlcnMuZ2V0KG5hbWUpLmFkZChoYW5kbGVyKTtcbiAgICAgICAgfVxuICAgICAgICBub3RpZnlMaXN0ZW5lcnMobmFtZSwgLi4uYXJncykge1xuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uTWFuYWdlciA9IHRoaXMuZXZlbnRIYW5kbGVycy5nZXQobmFtZSk7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25NYW5hZ2VyICYmIHN1YnNjcmlwdGlvbk1hbmFnZXIubm90aWZ5KC4uLmFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGhhc0xpc3RlbmVycyhuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ldmVudEhhbmRsZXJzLmhhcyhuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogTGlmZWN5Y2xlc1xuICAgICAgICAgKi9cbiAgICAgICAgbW91bnQoaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmluc3RhbmNlKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMuaXNTVkcgPSBpc1NWR0VsZW1lbnQoaW5zdGFuY2UpICYmICFpc1NWR1NWR0VsZW1lbnQoaW5zdGFuY2UpO1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZSA9IGluc3RhbmNlO1xuICAgICAgICAgICAgY29uc3QgeyBsYXlvdXRJZCwgbGF5b3V0LCB2aXN1YWxFbGVtZW50IH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgICAgICBpZiAodmlzdWFsRWxlbWVudCAmJiAhdmlzdWFsRWxlbWVudC5jdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgdmlzdWFsRWxlbWVudC5tb3VudChpbnN0YW5jZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJvb3Qubm9kZXMuYWRkKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQuY2hpbGRyZW4uYWRkKHRoaXMpO1xuICAgICAgICAgICAgaWYgKHRoaXMucm9vdC5oYXNUcmVlQW5pbWF0ZWQgJiYgKGxheW91dCB8fCBsYXlvdXRJZCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzTGF5b3V0RGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGF0dGFjaFJlc2l6ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNhbmNlbERlbGF5O1xuICAgICAgICAgICAgICAgIGxldCBpbm5lcldpZHRoID0gMDtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNpemVVbmJsb2NrVXBkYXRlID0gKCkgPT4gKHRoaXMucm9vdC51cGRhdGVCbG9ja2VkQnlSZXNpemUgPSBmYWxzZSk7XG4gICAgICAgICAgICAgICAgLy8gU2V0IGluaXRpYWwgaW5uZXJXaWR0aCBpbiBhIGZyYW1lLnJlYWQgY2FsbGJhY2sgdG8gYmF0Y2ggdGhlIHJlYWRcbiAgICAgICAgICAgICAgICBmcmFtZS5yZWFkKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaW5uZXJXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGF0dGFjaFJlc2l6ZUxpc3RlbmVyKGluc3RhbmNlLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0lubmVyV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0lubmVyV2lkdGggPT09IGlubmVyV2lkdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIGlubmVyV2lkdGggPSBuZXdJbm5lcldpZHRoO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QudXBkYXRlQmxvY2tlZEJ5UmVzaXplID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsRGVsYXkgJiYgY2FuY2VsRGVsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsRGVsYXkgPSBkZWxheShyZXNpemVVbmJsb2NrVXBkYXRlLCAyNTApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZ2xvYmFsUHJvamVjdGlvblN0YXRlLmhhc0FuaW1hdGVkU2luY2VSZXNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbFByb2plY3Rpb25TdGF0ZS5oYXNBbmltYXRlZFNpbmNlUmVzaXplID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGVzLmZvckVhY2goZmluaXNoQW5pbWF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxheW91dElkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb290LnJlZ2lzdGVyU2hhcmVkTm9kZShsYXlvdXRJZCwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBPbmx5IHJlZ2lzdGVyIHRoZSBoYW5kbGVyIGlmIGl0IHJlcXVpcmVzIGxheW91dCBhbmltYXRpb25cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0ZSAhPT0gZmFsc2UgJiZcbiAgICAgICAgICAgICAgICB2aXN1YWxFbGVtZW50ICYmXG4gICAgICAgICAgICAgICAgKGxheW91dElkIHx8IGxheW91dCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJkaWRVcGRhdGVcIiwgKHsgZGVsdGEsIGhhc0xheW91dENoYW5nZWQsIGhhc1JlbGF0aXZlTGF5b3V0Q2hhbmdlZCwgbGF5b3V0OiBuZXdMYXlvdXQsIH0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNUcmVlQW5pbWF0aW9uQmxvY2tlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVsYXRpdmVUYXJnZXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogQ2hlY2sgaGVyZSBpZiBhbiBhbmltYXRpb24gZXhpc3RzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxheW91dFRyYW5zaXRpb24gPSB0aGlzLm9wdGlvbnMudHJhbnNpdGlvbiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgdmlzdWFsRWxlbWVudC5nZXREZWZhdWx0VHJhbnNpdGlvbigpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0TGF5b3V0VHJhbnNpdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBvbkxheW91dEFuaW1hdGlvblN0YXJ0LCBvbkxheW91dEFuaW1hdGlvbkNvbXBsZXRlLCB9ID0gdmlzdWFsRWxlbWVudC5nZXRQcm9wcygpO1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogVGhlIHRhcmdldCBsYXlvdXQgb2YgdGhlIGVsZW1lbnQgbWlnaHQgc3RheSB0aGUgc2FtZSxcbiAgICAgICAgICAgICAgICAgICAgICogYnV0IGl0cyBwb3NpdGlvbiByZWxhdGl2ZSB0byBpdHMgcGFyZW50IGhhcyBjaGFuZ2VkLlxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGFzVGFyZ2V0Q2hhbmdlZCA9ICF0aGlzLnRhcmdldExheW91dCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgIWJveEVxdWFsc1JvdW5kZWQodGhpcy50YXJnZXRMYXlvdXQsIG5ld0xheW91dCk7XG4gICAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAgICAqIE5vdGU6IERpc2FibGVkIHRvIGZpeCByZWxhdGl2ZSBhbmltYXRpb25zIGFsd2F5cyB0cmlnZ2VyaW5nIG5ld1xuICAgICAgICAgICAgICAgICAgICAgKiBsYXlvdXQgYW5pbWF0aW9ucy4gSWYgdGhpcyBjYXVzZXMgZnVydGhlciBpc3N1ZXMsIHdlIGNhbiB0cnlcbiAgICAgICAgICAgICAgICAgICAgICogYSBkaWZmZXJlbnQgYXBwcm9hY2ggdG8gZGV0ZWN0aW5nIHJlbGF0aXZlIHRhcmdldCBjaGFuZ2VzLlxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgLy8gfHwgaGFzUmVsYXRpdmVMYXlvdXRDaGFuZ2VkXG4gICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgKiBJZiB0aGUgbGF5b3V0IGhhc24ndCBzZWVtZWQgdG8gaGF2ZSBjaGFuZ2VkLCBpdCBtaWdodCBiZSB0aGF0IHRoZVxuICAgICAgICAgICAgICAgICAgICAgKiBlbGVtZW50IGlzIHZpc3VhbGx5IGluIHRoZSBzYW1lIHBsYWNlIGluIHRoZSBkb2N1bWVudCBidXQgaXRzIHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgICAqIHJlbGF0aXZlIHRvIGl0cyBwYXJlbnQgaGFzIGluZGVlZCBjaGFuZ2VkLiBTbyBoZXJlIHdlIGNoZWNrIGZvciB0aGF0LlxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGFzT25seVJlbGF0aXZlVGFyZ2V0Q2hhbmdlZCA9ICFoYXNMYXlvdXRDaGFuZ2VkICYmIGhhc1JlbGF0aXZlTGF5b3V0Q2hhbmdlZDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5sYXlvdXRSb290IHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc3VtZUZyb20gfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc09ubHlSZWxhdGl2ZVRhcmdldENoYW5nZWQgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIChoYXNMYXlvdXRDaGFuZ2VkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGhhc1RhcmdldENoYW5nZWQgfHwgIXRoaXMuY3VycmVudEFuaW1hdGlvbikpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXN1bWVGcm9tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN1bWluZ0Zyb20gPSB0aGlzLnJlc3VtZUZyb207XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXN1bWluZ0Zyb20ucmVzdW1pbmdGcm9tID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5pbWF0aW9uT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5nZXRWYWx1ZVRyYW5zaXRpb24obGF5b3V0VHJhbnNpdGlvbiwgXCJsYXlvdXRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25QbGF5OiBvbkxheW91dEFuaW1hdGlvblN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IG9uTGF5b3V0QW5pbWF0aW9uQ29tcGxldGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZpc3VhbEVsZW1lbnQuc2hvdWxkUmVkdWNlTW90aW9uIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmxheW91dFJvb3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25PcHRpb25zLmRlbGF5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25PcHRpb25zLnR5cGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRBbmltYXRpb24oYW5pbWF0aW9uT3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIFNldCBhbmltYXRpb24gb3JpZ2luIGFmdGVyIHN0YXJ0aW5nIGFuaW1hdGlvbiB0byBhdm9pZCBsYXlvdXQganVtcFxuICAgICAgICAgICAgICAgICAgICAgICAgICogY2F1c2VkIGJ5IHN0b3BwaW5nIHByZXZpb3VzIGxheW91dCBhbmltYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBbmltYXRpb25PcmlnaW4oZGVsdGEsIGhhc09ubHlSZWxhdGl2ZVRhcmdldENoYW5nZWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBJZiB0aGUgbGF5b3V0IGhhc24ndCBjaGFuZ2VkIGFuZCB3ZSBoYXZlIGFuIGFuaW1hdGlvbiB0aGF0IGhhc24ndCBzdGFydGVkIHlldCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIGZpbmlzaCBpdCBpbW1lZGlhdGVseS4gT3RoZXJ3aXNlIGl0IHdpbGwgYmUgYW5pbWF0aW5nIGZyb20gYSBsb2NhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICogdGhhdCB3YXMgcHJvYmFibHkgbmV2ZXIgY29tbWl0dGVkIHRvIHNjcmVlbiBhbmQgbG9vayBsaWtlIGEganVtcHkgYm94LlxuICAgICAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWhhc0xheW91dENoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5pc2hBbmltYXRpb24odGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0xlYWQoKSAmJiB0aGlzLm9wdGlvbnMub25FeGl0Q29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMub25FeGl0Q29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldExheW91dCA9IG5ld0xheW91dDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB1bm1vdW50KCkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmxheW91dElkICYmIHRoaXMud2lsbFVwZGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5yb290Lm5vZGVzLnJlbW92ZSh0aGlzKTtcbiAgICAgICAgICAgIGNvbnN0IHN0YWNrID0gdGhpcy5nZXRTdGFjaygpO1xuICAgICAgICAgICAgc3RhY2sgJiYgc3RhY2sucmVtb3ZlKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQuY2hpbGRyZW4uZGVsZXRlKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRIYW5kbGVycy5jbGVhcigpO1xuICAgICAgICAgICAgY2FuY2VsRnJhbWUodGhpcy51cGRhdGVQcm9qZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBvbmx5IG9uIHRoZSByb290XG4gICAgICAgIGJsb2NrVXBkYXRlKCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVNYW51YWxseUJsb2NrZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHVuYmxvY2tVcGRhdGUoKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU1hbnVhbGx5QmxvY2tlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlzVXBkYXRlQmxvY2tlZCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZU1hbnVhbGx5QmxvY2tlZCB8fCB0aGlzLnVwZGF0ZUJsb2NrZWRCeVJlc2l6ZTtcbiAgICAgICAgfVxuICAgICAgICBpc1RyZWVBbmltYXRpb25CbG9ja2VkKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLmlzQW5pbWF0aW9uQmxvY2tlZCB8fFxuICAgICAgICAgICAgICAgICh0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC5pc1RyZWVBbmltYXRpb25CbG9ja2VkKCkpIHx8XG4gICAgICAgICAgICAgICAgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vdGU6IGN1cnJlbnRseSBvbmx5IHJ1bm5pbmcgb24gcm9vdCBub2RlXG4gICAgICAgIHN0YXJ0VXBkYXRlKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNVcGRhdGVCbG9ja2VkKCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdGhpcy5pc1VwZGF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubm9kZXMgJiYgdGhpcy5ub2Rlcy5mb3JFYWNoKHJlc2V0U2tld0FuZFJvdGF0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uSWQrKztcbiAgICAgICAgfVxuICAgICAgICBnZXRUcmFuc2Zvcm1UZW1wbGF0ZSgpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgdmlzdWFsRWxlbWVudCB9ID0gdGhpcy5vcHRpb25zO1xuICAgICAgICAgICAgcmV0dXJuIHZpc3VhbEVsZW1lbnQgJiYgdmlzdWFsRWxlbWVudC5nZXRQcm9wcygpLnRyYW5zZm9ybVRlbXBsYXRlO1xuICAgICAgICB9XG4gICAgICAgIHdpbGxVcGRhdGUoc2hvdWxkTm90aWZ5TGlzdGVuZXJzID0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5yb290Lmhhc1RyZWVBbmltYXRlZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAodGhpcy5yb290LmlzVXBkYXRlQmxvY2tlZCgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLm9uRXhpdENvbXBsZXRlICYmIHRoaXMub3B0aW9ucy5vbkV4aXRDb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgd2UncmUgcnVubmluZyBvcHRpbWlzZWQgYXBwZWFyIGFuaW1hdGlvbnMgdGhlbiB0aGVzZSBtdXN0IGJlXG4gICAgICAgICAgICAgKiBjYW5jZWxsZWQgYmVmb3JlIG1lYXN1cmluZyB0aGUgRE9NLiBUaGlzIGlzIHNvIHdlIGNhbiBtZWFzdXJlXG4gICAgICAgICAgICAgKiB0aGUgdHJ1ZSBsYXlvdXQgb2YgdGhlIGVsZW1lbnQgcmF0aGVyIHRoYW4gdGhlIFdBQVBJIGFuaW1hdGlvblxuICAgICAgICAgICAgICogd2hpY2ggd2lsbCBiZSB1bmFmZmVjdGVkIGJ5IHRoZSByZXNldFNrZXdBbmRSb3RhdGUgc3RlcC5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBOb3RlOiBUaGlzIGlzIGEgRE9NIHdyaXRlLiBXb3JzdCBjYXNlIHNjZW5hcmlvIGlzIHRoaXMgaXMgc2FuZHdpY2hlZFxuICAgICAgICAgICAgICogYmV0d2VlbiBvdGhlciBzbmFwc2hvdCByZWFkcyB3aGljaCB3aWxsIGNhdXNlIHVubmVjZXNzYXJ5IHN0eWxlIHJlY2FsY3VsYXRpb25zLlxuICAgICAgICAgICAgICogVGhpcyBoYXMgdG8gaGFwcGVuIGhlcmUgdGhvdWdoLCBhcyB3ZSBkb24ndCB5ZXQga25vdyB3aGljaCBub2RlcyB3aWxsIG5lZWRcbiAgICAgICAgICAgICAqIHNuYXBzaG90cyBpbiBzdGFydFVwZGF0ZSgpLCBidXQgd2Ugb25seSB3YW50IHRvIGNhbmNlbCBvcHRpbWlzZWQgYW5pbWF0aW9uc1xuICAgICAgICAgICAgICogaWYgYSBsYXlvdXQgYW5pbWF0aW9uIG1lYXN1cmVtZW50IGlzIGFjdHVhbGx5IGdvaW5nIHRvIGJlIGFmZmVjdGVkIGJ5IHRoZW0uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh3aW5kb3cuTW90aW9uQ2FuY2VsT3B0aW1pc2VkQW5pbWF0aW9uICYmXG4gICAgICAgICAgICAgICAgIXRoaXMuaGFzQ2hlY2tlZE9wdGltaXNlZEFwcGVhcikge1xuICAgICAgICAgICAgICAgIGNhbmNlbFRyZWVPcHRpbWlzZWRUcmFuc2Zvcm1BbmltYXRpb25zKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgIXRoaXMucm9vdC5pc1VwZGF0aW5nICYmIHRoaXMucm9vdC5zdGFydFVwZGF0ZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNMYXlvdXREaXJ0eSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB0aGlzLmlzTGF5b3V0RGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5wYXRoW2ldO1xuICAgICAgICAgICAgICAgIG5vZGUuc2hvdWxkUmVzZXRUcmFuc2Zvcm0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFBlcmNlbnRhZ2UgdHJhbnNsYXRlcyByZXNvbHZlIGFnYWluc3QgbGF5b3V0Qm94IGRpbWVuc2lvbnMsXG4gICAgICAgICAgICAgICAgICogc28gYW5jZXN0b3JzIHdpdGggdGhlbSBtdXN0IGJlIHJlLW1lYXN1cmVkIGFmdGVyIHRyYW5zZm9ybSByZXNldC5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG5vZGUubGF0ZXN0VmFsdWVzLnggPT09IFwic3RyaW5nXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG5vZGUubGF0ZXN0VmFsdWVzLnkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5pc0xheW91dERpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbm9kZS51cGRhdGVTY3JvbGwoXCJzbmFwc2hvdFwiKTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5vcHRpb25zLmxheW91dFJvb3QpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS53aWxsVXBkYXRlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB7IGxheW91dElkLCBsYXlvdXQgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgICAgIGlmIChsYXlvdXRJZCA9PT0gdW5kZWZpbmVkICYmICFsYXlvdXQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtVGVtcGxhdGUgPSB0aGlzLmdldFRyYW5zZm9ybVRlbXBsYXRlKCk7XG4gICAgICAgICAgICB0aGlzLnByZXZUcmFuc2Zvcm1UZW1wbGF0ZVZhbHVlID0gdHJhbnNmb3JtVGVtcGxhdGVcbiAgICAgICAgICAgICAgICA/IHRyYW5zZm9ybVRlbXBsYXRlKHRoaXMubGF0ZXN0VmFsdWVzLCBcIlwiKVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTbmFwc2hvdCgpO1xuICAgICAgICAgICAgc2hvdWxkTm90aWZ5TGlzdGVuZXJzICYmIHRoaXMubm90aWZ5TGlzdGVuZXJzKFwid2lsbFVwZGF0ZVwiKTtcbiAgICAgICAgfVxuICAgICAgICB1cGRhdGUoKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNjaGVkdWxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgdXBkYXRlV2FzQmxvY2tlZCA9IHRoaXMuaXNVcGRhdGVCbG9ja2VkKCk7XG4gICAgICAgICAgICAvLyBXaGVuIGRvaW5nIGFuIGluc3RhbnQgdHJhbnNpdGlvbiwgd2Ugc2tpcCB0aGUgbGF5b3V0IHVwZGF0ZSxcbiAgICAgICAgICAgIC8vIGJ1dCBzaG91bGQgc3RpbGwgY2xlYW4gdXAgdGhlIG1lYXN1cmVtZW50cyBzbyB0aGF0IHRoZSBuZXh0XG4gICAgICAgICAgICAvLyBzbmFwc2hvdCBjb3VsZCBiZSB0YWtlbiBjb3JyZWN0bHkuXG4gICAgICAgICAgICBpZiAodXBkYXRlV2FzQmxvY2tlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudW5ibG9ja1VwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJBbGxTbmFwc2hvdHMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGVzLmZvckVhY2goY2xlYXJNZWFzdXJlbWVudHMpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgdGhpcyBpcyBhIHJlcGVhdCBvZiBkaWRVcGRhdGUgdGhlbiBpZ25vcmUgdGhlIGFuaW1hdGlvbi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uSWQgPD0gdGhpcy5hbmltYXRpb25Db21taXRJZCkge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZXMuZm9yRWFjaChjbGVhcklzTGF5b3V0RGlydHkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uQ29tbWl0SWQgPSB0aGlzLmFuaW1hdGlvbklkO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVXBkYXRpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGVzLmZvckVhY2goY2xlYXJJc0xheW91dERpcnR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNVcGRhdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFdyaXRlXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdGhpcy5ub2Rlcy5mb3JFYWNoKHJlc2V0VHJhbnNmb3JtU3R5bGUpO1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFJlYWQgPT09PT09PT09PT09PT09PT09XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIGxheW91dCBtZWFzdXJlbWVudHMgb2YgdXBkYXRlZCBjaGlsZHJlblxuICAgICAgICAgICAgICAgIHRoaXMubm9kZXMuZm9yRWFjaCh1cGRhdGVMYXlvdXQpO1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFdyaXRlXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgLy8gTm90aWZ5IGxpc3RlbmVycyB0aGF0IHRoZSBsYXlvdXQgaXMgdXBkYXRlZFxuICAgICAgICAgICAgICAgIHRoaXMubm9kZXMuZm9yRWFjaChub3RpZnlMYXlvdXRVcGRhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jbGVhckFsbFNuYXBzaG90cygpO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNYW51YWxseSBmbHVzaCBhbnkgcGVuZGluZyB1cGRhdGVzLiBJZGVhbGx5XG4gICAgICAgICAgICAgKiB3ZSBjb3VsZCBsZWF2ZSB0aGlzIHRvIHRoZSBmb2xsb3dpbmcgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGJ1dCB0aGlzIHNlZW1zXG4gICAgICAgICAgICAgKiB0byBsZWF2ZSBhIGZsYXNoIG9mIGluY29ycmVjdGx5IHN0eWxlZCBjb250ZW50LlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBub3cgPSB0aW1lLm5vdygpO1xuICAgICAgICAgICAgZnJhbWVEYXRhLmRlbHRhID0gY2xhbXAoMCwgMTAwMCAvIDYwLCBub3cgLSBmcmFtZURhdGEudGltZXN0YW1wKTtcbiAgICAgICAgICAgIGZyYW1lRGF0YS50aW1lc3RhbXAgPSBub3c7XG4gICAgICAgICAgICBmcmFtZURhdGEuaXNQcm9jZXNzaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIGZyYW1lU3RlcHMudXBkYXRlLnByb2Nlc3MoZnJhbWVEYXRhKTtcbiAgICAgICAgICAgIGZyYW1lU3RlcHMucHJlUmVuZGVyLnByb2Nlc3MoZnJhbWVEYXRhKTtcbiAgICAgICAgICAgIGZyYW1lU3RlcHMucmVuZGVyLnByb2Nlc3MoZnJhbWVEYXRhKTtcbiAgICAgICAgICAgIGZyYW1lRGF0YS5pc1Byb2Nlc3NpbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBkaWRVcGRhdGUoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMudXBkYXRlU2NoZWR1bGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTY2hlZHVsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIG1pY3JvdGFzay5yZWFkKHRoaXMuc2NoZWR1bGVVcGRhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNsZWFyQWxsU25hcHNob3RzKCkge1xuICAgICAgICAgICAgdGhpcy5ub2Rlcy5mb3JFYWNoKGNsZWFyU25hcHNob3QpO1xuICAgICAgICAgICAgdGhpcy5zaGFyZWROb2Rlcy5mb3JFYWNoKHJlbW92ZUxlYWRTbmFwc2hvdHMpO1xuICAgICAgICB9XG4gICAgICAgIHNjaGVkdWxlVXBkYXRlUHJvamVjdGlvbigpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5wcm9qZWN0aW9uVXBkYXRlU2NoZWR1bGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0aW9uVXBkYXRlU2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmcmFtZS5wcmVSZW5kZXIodGhpcy51cGRhdGVQcm9qZWN0aW9uLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2NoZWR1bGVDaGVja0FmdGVyVW5tb3VudCgpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgdGhlIHVubW91bnRpbmcgbm9kZSBpcyBpbiBhIGxheW91dEdyb3VwIGFuZCBkaWQgdHJpZ2dlciBhIHdpbGxVcGRhdGUsXG4gICAgICAgICAgICAgKiB3ZSBtYW51YWxseSBjYWxsIGRpZFVwZGF0ZSB0byBnaXZlIGEgY2hhbmNlIHRvIHRoZSBzaWJsaW5ncyB0byBhbmltYXRlLlxuICAgICAgICAgICAgICogT3RoZXJ3aXNlLCBjbGVhbnVwIGFsbCBzbmFwc2hvdHMgdG8gcHJldmVudHMgZnV0dXJlIG5vZGVzIGZyb20gcmV1c2luZyB0aGVtLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmcmFtZS5wb3N0UmVuZGVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0xheW91dERpcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdC5kaWRVcGRhdGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdC5jaGVja1VwZGF0ZUZhaWxlZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGUgbWVhc3VyZW1lbnRzXG4gICAgICAgICAqL1xuICAgICAgICB1cGRhdGVTbmFwc2hvdCgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNuYXBzaG90IHx8ICF0aGlzLmluc3RhbmNlKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMuc25hcHNob3QgPSB0aGlzLm1lYXN1cmUoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNuYXBzaG90ICYmXG4gICAgICAgICAgICAgICAgIWNhbGNMZW5ndGgodGhpcy5zbmFwc2hvdC5tZWFzdXJlZEJveC54KSAmJlxuICAgICAgICAgICAgICAgICFjYWxjTGVuZ3RoKHRoaXMuc25hcHNob3QubWVhc3VyZWRCb3gueSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNuYXBzaG90ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHVwZGF0ZUxheW91dCgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pbnN0YW5jZSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbCgpO1xuICAgICAgICAgICAgaWYgKCEodGhpcy5vcHRpb25zLmFsd2F5c01lYXN1cmVMYXlvdXQgJiYgdGhpcy5pc0xlYWQoKSkgJiZcbiAgICAgICAgICAgICAgICAhdGhpcy5pc0xheW91dERpcnR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBXaGVuIGEgbm9kZSBpcyBtb3VudGVkLCBpdCBzaW1wbHkgcmVzdW1lcyBmcm9tIHRoZSBwcmV2TGVhZCdzXG4gICAgICAgICAgICAgKiBzbmFwc2hvdCBpbnN0ZWFkIG9mIHRha2luZyBhIG5ldyBvbmUsIGJ1dCB0aGUgYW5jZXN0b3JzIHNjcm9sbFxuICAgICAgICAgICAgICogbWlnaHQgaGF2ZSB1cGRhdGVkIHdoaWxlIHRoZSBwcmV2TGVhZCBpcyB1bm1vdW50ZWQuIFdlIG5lZWQgdG9cbiAgICAgICAgICAgICAqIHVwZGF0ZSB0aGUgc2Nyb2xsIGFnYWluIHRvIG1ha2Ugc3VyZSB0aGUgbGF5b3V0IHdlIG1lYXN1cmUgaXNcbiAgICAgICAgICAgICAqIHVwIHRvIGRhdGUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh0aGlzLnJlc3VtZUZyb20gJiYgIXRoaXMucmVzdW1lRnJvbS5pbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnBhdGhbaV07XG4gICAgICAgICAgICAgICAgICAgIG5vZGUudXBkYXRlU2Nyb2xsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcHJldkxheW91dCA9IHRoaXMubGF5b3V0O1xuICAgICAgICAgICAgdGhpcy5sYXlvdXQgPSB0aGlzLm1lYXN1cmUoZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5sYXlvdXRWZXJzaW9uKys7XG4gICAgICAgICAgICB0aGlzLmxheW91dENvcnJlY3RlZCA9IGNyZWF0ZUJveCgpO1xuICAgICAgICAgICAgdGhpcy5pc0xheW91dERpcnR5ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnByb2plY3Rpb25EZWx0YSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRoaXMubm90aWZ5TGlzdGVuZXJzKFwibWVhc3VyZVwiLCB0aGlzLmxheW91dC5sYXlvdXRCb3gpO1xuICAgICAgICAgICAgY29uc3QgeyB2aXN1YWxFbGVtZW50IH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgICAgICB2aXN1YWxFbGVtZW50ICYmXG4gICAgICAgICAgICAgICAgdmlzdWFsRWxlbWVudC5ub3RpZnkoXCJMYXlvdXRNZWFzdXJlXCIsIHRoaXMubGF5b3V0LmxheW91dEJveCwgcHJldkxheW91dCA/IHByZXZMYXlvdXQubGF5b3V0Qm94IDogdW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgICB1cGRhdGVTY3JvbGwocGhhc2UgPSBcIm1lYXN1cmVcIikge1xuICAgICAgICAgICAgbGV0IG5lZWRzTWVhc3VyZW1lbnQgPSBCb29sZWFuKHRoaXMub3B0aW9ucy5sYXlvdXRTY3JvbGwgJiYgdGhpcy5pbnN0YW5jZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5zY3JvbGwgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbC5hbmltYXRpb25JZCA9PT0gdGhpcy5yb290LmFuaW1hdGlvbklkICYmXG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGwucGhhc2UgPT09IHBoYXNlKSB7XG4gICAgICAgICAgICAgICAgbmVlZHNNZWFzdXJlbWVudCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5lZWRzTWVhc3VyZW1lbnQgJiYgdGhpcy5pbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzUm9vdCA9IGNoZWNrSXNTY3JvbGxSb290KHRoaXMuaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsID0ge1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25JZDogdGhpcy5yb290LmFuaW1hdGlvbklkLFxuICAgICAgICAgICAgICAgICAgICBwaGFzZSxcbiAgICAgICAgICAgICAgICAgICAgaXNSb290LFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IG1lYXN1cmVTY3JvbGwodGhpcy5pbnN0YW5jZSksXG4gICAgICAgICAgICAgICAgICAgIHdhc1Jvb3Q6IHRoaXMuc2Nyb2xsID8gdGhpcy5zY3JvbGwuaXNSb290IDogaXNSb290LFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzZXRUcmFuc2Zvcm0oKSB7XG4gICAgICAgICAgICBpZiAoIXJlc2V0VHJhbnNmb3JtKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IGlzUmVzZXRSZXF1ZXN0ZWQgPSB0aGlzLmlzTGF5b3V0RGlydHkgfHxcbiAgICAgICAgICAgICAgICB0aGlzLnNob3VsZFJlc2V0VHJhbnNmb3JtIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmFsd2F5c01lYXN1cmVMYXlvdXQ7XG4gICAgICAgICAgICBjb25zdCBoYXNQcm9qZWN0aW9uID0gdGhpcy5wcm9qZWN0aW9uRGVsdGEgJiYgIWlzRGVsdGFaZXJvKHRoaXMucHJvamVjdGlvbkRlbHRhKTtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybVRlbXBsYXRlID0gdGhpcy5nZXRUcmFuc2Zvcm1UZW1wbGF0ZSgpO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtVGVtcGxhdGVWYWx1ZSA9IHRyYW5zZm9ybVRlbXBsYXRlXG4gICAgICAgICAgICAgICAgPyB0cmFuc2Zvcm1UZW1wbGF0ZSh0aGlzLmxhdGVzdFZhbHVlcywgXCJcIilcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybVRlbXBsYXRlSGFzQ2hhbmdlZCA9IHRyYW5zZm9ybVRlbXBsYXRlVmFsdWUgIT09IHRoaXMucHJldlRyYW5zZm9ybVRlbXBsYXRlVmFsdWU7XG4gICAgICAgICAgICBpZiAoaXNSZXNldFJlcXVlc3RlZCAmJlxuICAgICAgICAgICAgICAgIHRoaXMuaW5zdGFuY2UgJiZcbiAgICAgICAgICAgICAgICAoaGFzUHJvamVjdGlvbiB8fFxuICAgICAgICAgICAgICAgICAgICBoYXNUcmFuc2Zvcm0odGhpcy5sYXRlc3RWYWx1ZXMpIHx8XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVRlbXBsYXRlSGFzQ2hhbmdlZCkpIHtcbiAgICAgICAgICAgICAgICByZXNldFRyYW5zZm9ybSh0aGlzLmluc3RhbmNlLCB0cmFuc2Zvcm1UZW1wbGF0ZVZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3VsZFJlc2V0VHJhbnNmb3JtID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZVJlbmRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG1lYXN1cmUocmVtb3ZlVHJhbnNmb3JtID0gdHJ1ZSkge1xuICAgICAgICAgICAgY29uc3QgcGFnZUJveCA9IHRoaXMubWVhc3VyZVBhZ2VCb3goKTtcbiAgICAgICAgICAgIGxldCBsYXlvdXRCb3ggPSB0aGlzLnJlbW92ZUVsZW1lbnRTY3JvbGwocGFnZUJveCk7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1lYXN1cmVtZW50cyB0YWtlbiBkdXJpbmcgdGhlIHByZS1yZW5kZXIgc3RhZ2VcbiAgICAgICAgICAgICAqIHN0aWxsIGhhdmUgdHJhbnNmb3JtcyBhcHBsaWVkIHNvIHdlIHJlbW92ZSB0aGVtXG4gICAgICAgICAgICAgKiB2aWEgY2FsY3VsYXRpb24uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChyZW1vdmVUcmFuc2Zvcm0pIHtcbiAgICAgICAgICAgICAgICBsYXlvdXRCb3ggPSB0aGlzLnJlbW92ZVRyYW5zZm9ybShsYXlvdXRCb3gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm91bmRCb3gobGF5b3V0Qm94KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uSWQ6IHRoaXMucm9vdC5hbmltYXRpb25JZCxcbiAgICAgICAgICAgICAgICBtZWFzdXJlZEJveDogcGFnZUJveCxcbiAgICAgICAgICAgICAgICBsYXlvdXRCb3gsXG4gICAgICAgICAgICAgICAgbGF0ZXN0VmFsdWVzOiB7fSxcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuaWQsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIG1lYXN1cmVQYWdlQm94KCkge1xuICAgICAgICAgICAgY29uc3QgeyB2aXN1YWxFbGVtZW50IH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgICAgICBpZiAoIXZpc3VhbEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUJveCgpO1xuICAgICAgICAgICAgY29uc3QgYm94ID0gdmlzdWFsRWxlbWVudC5tZWFzdXJlVmlld3BvcnRCb3goKTtcbiAgICAgICAgICAgIGNvbnN0IHdhc0luU2Nyb2xsUm9vdCA9IHRoaXMuc2Nyb2xsPy53YXNSb290IHx8IHRoaXMucGF0aC5zb21lKGNoZWNrTm9kZVdhc1Njcm9sbFJvb3QpO1xuICAgICAgICAgICAgaWYgKCF3YXNJblNjcm9sbFJvb3QpIHtcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdmlld3BvcnQgc2Nyb2xsIHRvIGdpdmUgcGFnZS1yZWxhdGl2ZSBjb29yZGluYXRlc1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc2Nyb2xsIH0gPSB0aGlzLnJvb3Q7XG4gICAgICAgICAgICAgICAgaWYgKHNjcm9sbCkge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGVBeGlzKGJveC54LCBzY3JvbGwub2Zmc2V0LngpO1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGVBeGlzKGJveC55LCBzY3JvbGwub2Zmc2V0LnkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBib3g7XG4gICAgICAgIH1cbiAgICAgICAgcmVtb3ZlRWxlbWVudFNjcm9sbChib3gpIHtcbiAgICAgICAgICAgIGNvbnN0IGJveFdpdGhvdXRTY3JvbGwgPSBjcmVhdGVCb3goKTtcbiAgICAgICAgICAgIGNvcHlCb3hJbnRvKGJveFdpdGhvdXRTY3JvbGwsIGJveCk7XG4gICAgICAgICAgICBpZiAodGhpcy5zY3JvbGw/Lndhc1Jvb3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYm94V2l0aG91dFNjcm9sbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogUGVyZm9ybWFuY2UgVE9ETzogS2VlcCBhIGN1bXVsYXRpdmUgc2Nyb2xsIG9mZnNldCBkb3duIHRoZSB0cmVlXG4gICAgICAgICAgICAgKiByYXRoZXIgdGhhbiBsb29wIGJhY2sgdXAgdGhlIHBhdGguXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMucGF0aFtpXTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHNjcm9sbCwgb3B0aW9ucyB9ID0gbm9kZTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZSAhPT0gdGhpcy5yb290ICYmIHNjcm9sbCAmJiBvcHRpb25zLmxheW91dFNjcm9sbCkge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogSWYgdGhpcyBpcyBhIG5ldyBzY3JvbGwgcm9vdCwgd2Ugd2FudCB0byByZW1vdmUgYWxsIHByZXZpb3VzIHNjcm9sbHNcbiAgICAgICAgICAgICAgICAgICAgICogZnJvbSB0aGUgdmlld3BvcnQgYm94LlxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjcm9sbC53YXNSb290KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3B5Qm94SW50byhib3hXaXRob3V0U2Nyb2xsLCBib3gpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZUF4aXMoYm94V2l0aG91dFNjcm9sbC54LCBzY3JvbGwub2Zmc2V0LngpO1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGVBeGlzKGJveFdpdGhvdXRTY3JvbGwueSwgc2Nyb2xsLm9mZnNldC55KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYm94V2l0aG91dFNjcm9sbDtcbiAgICAgICAgfVxuICAgICAgICBhcHBseVRyYW5zZm9ybShib3gsIHRyYW5zZm9ybU9ubHkgPSBmYWxzZSkge1xuICAgICAgICAgICAgY29uc3Qgd2l0aFRyYW5zZm9ybXMgPSBjcmVhdGVCb3goKTtcbiAgICAgICAgICAgIGNvcHlCb3hJbnRvKHdpdGhUcmFuc2Zvcm1zLCBib3gpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5wYXRoW2ldO1xuICAgICAgICAgICAgICAgIGlmICghdHJhbnNmb3JtT25seSAmJlxuICAgICAgICAgICAgICAgICAgICBub2RlLm9wdGlvbnMubGF5b3V0U2Nyb2xsICYmXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuc2Nyb2xsICYmXG4gICAgICAgICAgICAgICAgICAgIG5vZGUgIT09IG5vZGUucm9vdCkge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1Cb3god2l0aFRyYW5zZm9ybXMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IC1ub2RlLnNjcm9sbC5vZmZzZXQueCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IC1ub2RlLnNjcm9sbC5vZmZzZXQueSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghaGFzVHJhbnNmb3JtKG5vZGUubGF0ZXN0VmFsdWVzKSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtQm94KHdpdGhUcmFuc2Zvcm1zLCBub2RlLmxhdGVzdFZhbHVlcywgbm9kZS5sYXlvdXQ/LmxheW91dEJveCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGFzVHJhbnNmb3JtKHRoaXMubGF0ZXN0VmFsdWVzKSkge1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybUJveCh3aXRoVHJhbnNmb3JtcywgdGhpcy5sYXRlc3RWYWx1ZXMsIHRoaXMubGF5b3V0Py5sYXlvdXRCb3gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHdpdGhUcmFuc2Zvcm1zO1xuICAgICAgICB9XG4gICAgICAgIHJlbW92ZVRyYW5zZm9ybShib3gpIHtcbiAgICAgICAgICAgIGNvbnN0IGJveFdpdGhvdXRUcmFuc2Zvcm0gPSBjcmVhdGVCb3goKTtcbiAgICAgICAgICAgIGNvcHlCb3hJbnRvKGJveFdpdGhvdXRUcmFuc2Zvcm0sIGJveCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGF0aC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnBhdGhbaV07XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNUcmFuc2Zvcm0obm9kZS5sYXRlc3RWYWx1ZXMpKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBsZXQgc291cmNlQm94O1xuICAgICAgICAgICAgICAgIGlmIChub2RlLmluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc1NjYWxlKG5vZGUubGF0ZXN0VmFsdWVzKSAmJiBub2RlLnVwZGF0ZVNuYXBzaG90KCk7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUJveCA9IGNyZWF0ZUJveCgpO1xuICAgICAgICAgICAgICAgICAgICBjb3B5Qm94SW50byhzb3VyY2VCb3gsIG5vZGUubWVhc3VyZVBhZ2VCb3goKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlbW92ZUJveFRyYW5zZm9ybXMoYm94V2l0aG91dFRyYW5zZm9ybSwgbm9kZS5sYXRlc3RWYWx1ZXMsIG5vZGUuc25hcHNob3Q/LmxheW91dEJveCwgc291cmNlQm94KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNUcmFuc2Zvcm0odGhpcy5sYXRlc3RWYWx1ZXMpKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlQm94VHJhbnNmb3Jtcyhib3hXaXRob3V0VHJhbnNmb3JtLCB0aGlzLmxhdGVzdFZhbHVlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYm94V2l0aG91dFRyYW5zZm9ybTtcbiAgICAgICAgfVxuICAgICAgICBzZXRUYXJnZXREZWx0YShkZWx0YSkge1xuICAgICAgICAgICAgdGhpcy50YXJnZXREZWx0YSA9IGRlbHRhO1xuICAgICAgICAgICAgdGhpcy5yb290LnNjaGVkdWxlVXBkYXRlUHJvamVjdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5pc1Byb2plY3Rpb25EaXJ0eSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgc2V0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgY3Jvc3NmYWRlOiBvcHRpb25zLmNyb3NzZmFkZSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5jcm9zc2ZhZGUgOiB0cnVlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBjbGVhck1lYXN1cmVtZW50cygpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5sYXlvdXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLnNuYXBzaG90ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5wcmV2VHJhbnNmb3JtVGVtcGxhdGVWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0RGVsdGEgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRoaXMuaXNMYXlvdXREaXJ0eSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGZvcmNlUmVsYXRpdmVQYXJlbnRUb1Jlc29sdmVUYXJnZXQoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucmVsYXRpdmVQYXJlbnQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJZiB0aGUgcGFyZW50IHRhcmdldCBpc24ndCB1cC10by1kYXRlLCBmb3JjZSBpdCB0byB1cGRhdGUuXG4gICAgICAgICAgICAgKiBUaGlzIGlzIGFuIHVuZm9ydHVuYXRlIGRlLW9wdGltaXNhdGlvbiBhcyBpdCBtZWFucyBhbnkgdXBkYXRpbmcgcmVsYXRpdmVcbiAgICAgICAgICAgICAqIHByb2plY3Rpb24gd2lsbCBjYXVzZSBhbGwgdGhlIHJlbGF0aXZlIHBhcmVudHMgdG8gcmVjYWxjdWxhdGUgYmFja1xuICAgICAgICAgICAgICogdXAgdGhlIHRyZWUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh0aGlzLnJlbGF0aXZlUGFyZW50LnJlc29sdmVkUmVsYXRpdmVUYXJnZXRBdCAhPT1cbiAgICAgICAgICAgICAgICBmcmFtZURhdGEudGltZXN0YW1wKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWxhdGl2ZVBhcmVudC5yZXNvbHZlVGFyZ2V0RGVsdGEodHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzb2x2ZVRhcmdldERlbHRhKGZvcmNlUmVjYWxjdWxhdGlvbiA9IGZhbHNlKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE9uY2UgdGhlIGRpcnR5IHN0YXR1cyBvZiBub2RlcyBoYXMgYmVlbiBzcHJlYWQgdGhyb3VnaCB0aGUgdHJlZSwgd2UgYWxzb1xuICAgICAgICAgICAgICogbmVlZCB0byBjaGVjayBpZiB3ZSBoYXZlIGEgc2hhcmVkIG5vZGUgb2YgYSBkaWZmZXJlbnQgZGVwdGggdGhhdCBoYXMgaXRzZWxmXG4gICAgICAgICAgICAgKiBiZWVuIGRpcnRpZWQuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IGxlYWQgPSB0aGlzLmdldExlYWQoKTtcbiAgICAgICAgICAgIHRoaXMuaXNQcm9qZWN0aW9uRGlydHkgfHwgKHRoaXMuaXNQcm9qZWN0aW9uRGlydHkgPSBsZWFkLmlzUHJvamVjdGlvbkRpcnR5KTtcbiAgICAgICAgICAgIHRoaXMuaXNUcmFuc2Zvcm1EaXJ0eSB8fCAodGhpcy5pc1RyYW5zZm9ybURpcnR5ID0gbGVhZC5pc1RyYW5zZm9ybURpcnR5KTtcbiAgICAgICAgICAgIHRoaXMuaXNTaGFyZWRQcm9qZWN0aW9uRGlydHkgfHwgKHRoaXMuaXNTaGFyZWRQcm9qZWN0aW9uRGlydHkgPSBsZWFkLmlzU2hhcmVkUHJvamVjdGlvbkRpcnR5KTtcbiAgICAgICAgICAgIGNvbnN0IGlzU2hhcmVkID0gQm9vbGVhbih0aGlzLnJlc3VtaW5nRnJvbSkgfHwgdGhpcyAhPT0gbGVhZDtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogV2UgZG9uJ3QgdXNlIHRyYW5zZm9ybSBmb3IgdGhpcyBzdGVwIG9mIHByb2Nlc3Npbmcgc28gd2UgZG9uJ3RcbiAgICAgICAgICAgICAqIG5lZWQgdG8gY2hlY2sgd2hldGhlciBhbnkgbm9kZXMgaGF2ZSBjaGFuZ2VkIHRyYW5zZm9ybS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgY2FuU2tpcCA9ICEoZm9yY2VSZWNhbGN1bGF0aW9uIHx8XG4gICAgICAgICAgICAgICAgKGlzU2hhcmVkICYmIHRoaXMuaXNTaGFyZWRQcm9qZWN0aW9uRGlydHkpIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5pc1Byb2plY3Rpb25EaXJ0eSB8fFxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50Py5pc1Byb2plY3Rpb25EaXJ0eSB8fFxuICAgICAgICAgICAgICAgIHRoaXMuYXR0ZW1wdFRvUmVzb2x2ZVJlbGF0aXZlVGFyZ2V0IHx8XG4gICAgICAgICAgICAgICAgdGhpcy5yb290LnVwZGF0ZUJsb2NrZWRCeVJlc2l6ZSk7XG4gICAgICAgICAgICBpZiAoY2FuU2tpcClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjb25zdCB7IGxheW91dCwgbGF5b3V0SWQgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgd2UgaGF2ZSBubyBsYXlvdXQsIHdlIGNhbid0IHBlcmZvcm0gcHJvamVjdGlvbiwgc28gZWFybHkgcmV0dXJuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICghdGhpcy5sYXlvdXQgfHwgIShsYXlvdXQgfHwgbGF5b3V0SWQpKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZWRSZWxhdGl2ZVRhcmdldEF0ID0gZnJhbWVEYXRhLnRpbWVzdGFtcDtcbiAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlUGFyZW50ID0gdGhpcy5nZXRDbG9zZXN0UHJvamVjdGluZ1BhcmVudCgpO1xuICAgICAgICAgICAgaWYgKHJlbGF0aXZlUGFyZW50ICYmXG4gICAgICAgICAgICAgICAgdGhpcy5saW5rZWRQYXJlbnRWZXJzaW9uICE9PSByZWxhdGl2ZVBhcmVudC5sYXlvdXRWZXJzaW9uICYmXG4gICAgICAgICAgICAgICAgIXJlbGF0aXZlUGFyZW50Lm9wdGlvbnMubGF5b3V0Um9vdCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlUmVsYXRpdmVUYXJnZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgd2UgZG9uJ3QgaGF2ZSBhIHRhcmdldERlbHRhIGJ1dCBkbyBoYXZlIGEgbGF5b3V0LCB3ZSBjYW4gYXR0ZW1wdCB0byByZXNvbHZlXG4gICAgICAgICAgICAgKiBhIHJlbGF0aXZlUGFyZW50LiBUaGlzIHdpbGwgYWxsb3cgYSBjb21wb25lbnQgdG8gcGVyZm9ybSBzY2FsZSBjb3JyZWN0aW9uXG4gICAgICAgICAgICAgKiBldmVuIGlmIG5vIGFuaW1hdGlvbiBoYXMgc3RhcnRlZC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKCF0aGlzLnRhcmdldERlbHRhICYmICF0aGlzLnJlbGF0aXZlVGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlbGF0aXZlUGFyZW50ICYmIHJlbGF0aXZlUGFyZW50LmxheW91dCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVJlbGF0aXZlVGFyZ2V0KHJlbGF0aXZlUGFyZW50LCB0aGlzLmxheW91dC5sYXlvdXRCb3gsIHJlbGF0aXZlUGFyZW50LmxheW91dC5sYXlvdXRCb3gpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVSZWxhdGl2ZVRhcmdldCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgd2UgaGF2ZSBubyByZWxhdGl2ZSB0YXJnZXQgb3Igbm8gdGFyZ2V0IGRlbHRhIG91ciB0YXJnZXQgaXNuJ3QgdmFsaWRcbiAgICAgICAgICAgICAqIGZvciB0aGlzIGZyYW1lLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoIXRoaXMucmVsYXRpdmVUYXJnZXQgJiYgIXRoaXMudGFyZ2V0RGVsdGEpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBMYXp5LWluaXQgdGFyZ2V0IGRhdGEgc3RydWN0dXJlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICghdGhpcy50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldCA9IGNyZWF0ZUJveCgpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0V2l0aFRyYW5zZm9ybXMgPSBjcmVhdGVCb3goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgd2UndmUgZ290IGEgcmVsYXRpdmUgYm94IGZvciB0aGlzIGNvbXBvbmVudCwgcmVzb2x2ZSBpdCBpbnRvIGEgdGFyZ2V0IHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh0aGlzLnJlbGF0aXZlVGFyZ2V0ICYmXG4gICAgICAgICAgICAgICAgdGhpcy5yZWxhdGl2ZVRhcmdldE9yaWdpbiAmJlxuICAgICAgICAgICAgICAgIHRoaXMucmVsYXRpdmVQYXJlbnQgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnJlbGF0aXZlUGFyZW50LnRhcmdldCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZm9yY2VSZWxhdGl2ZVBhcmVudFRvUmVzb2x2ZVRhcmdldCgpO1xuICAgICAgICAgICAgICAgIGNhbGNSZWxhdGl2ZUJveCh0aGlzLnRhcmdldCwgdGhpcy5yZWxhdGl2ZVRhcmdldCwgdGhpcy5yZWxhdGl2ZVBhcmVudC50YXJnZXQpO1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElmIHdlJ3ZlIG9ubHkgZ290IGEgdGFyZ2V0RGVsdGEsIHJlc29sdmUgaXQgaW50byBhIHRhcmdldFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy50YXJnZXREZWx0YSkge1xuICAgICAgICAgICAgICAgIGlmIChCb29sZWFuKHRoaXMucmVzdW1pbmdGcm9tKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBUaGlzIGlzIGNyZWF0aW5nIGEgbmV3IG9iamVjdCBldmVyeSBmcmFtZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldCA9IHRoaXMuYXBwbHlUcmFuc2Zvcm0odGhpcy5sYXlvdXQubGF5b3V0Qm94KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvcHlCb3hJbnRvKHRoaXMudGFyZ2V0LCB0aGlzLmxheW91dC5sYXlvdXRCb3gpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhcHBseUJveERlbHRhKHRoaXMudGFyZ2V0LCB0aGlzLnRhcmdldERlbHRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElmIG5vIHRhcmdldCwgdXNlIG93biBsYXlvdXQgYXMgdGFyZ2V0XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgY29weUJveEludG8odGhpcy50YXJnZXQsIHRoaXMubGF5b3V0LmxheW91dEJveCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHdlJ3ZlIGJlZW4gdG9sZCB0byBhdHRlbXB0IHRvIHJlc29sdmUgYSByZWxhdGl2ZSB0YXJnZXQsIGRvIHNvLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAodGhpcy5hdHRlbXB0VG9SZXNvbHZlUmVsYXRpdmVUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dGVtcHRUb1Jlc29sdmVSZWxhdGl2ZVRhcmdldCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChyZWxhdGl2ZVBhcmVudCAmJlxuICAgICAgICAgICAgICAgICAgICBCb29sZWFuKHJlbGF0aXZlUGFyZW50LnJlc3VtaW5nRnJvbSkgPT09XG4gICAgICAgICAgICAgICAgICAgICAgICBCb29sZWFuKHRoaXMucmVzdW1pbmdGcm9tKSAmJlxuICAgICAgICAgICAgICAgICAgICAhcmVsYXRpdmVQYXJlbnQub3B0aW9ucy5sYXlvdXRTY3JvbGwgJiZcbiAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmVQYXJlbnQudGFyZ2V0ICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uUHJvZ3Jlc3MgIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVSZWxhdGl2ZVRhcmdldChyZWxhdGl2ZVBhcmVudCwgdGhpcy50YXJnZXQsIHJlbGF0aXZlUGFyZW50LnRhcmdldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbGF0aXZlUGFyZW50ID0gdGhpcy5yZWxhdGl2ZVRhcmdldCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEluY3JlYXNlIGRlYnVnIGNvdW50ZXIgZm9yIHJlc29sdmVkIHRhcmdldCBkZWx0YXNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHN0YXRzQnVmZmVyLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgbWV0cmljcy5jYWxjdWxhdGVkVGFyZ2V0RGVsdGFzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZ2V0Q2xvc2VzdFByb2plY3RpbmdQYXJlbnQoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucGFyZW50IHx8XG4gICAgICAgICAgICAgICAgaGFzU2NhbGUodGhpcy5wYXJlbnQubGF0ZXN0VmFsdWVzKSB8fFxuICAgICAgICAgICAgICAgIGhhczJEVHJhbnNsYXRlKHRoaXMucGFyZW50LmxhdGVzdFZhbHVlcykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucGFyZW50LmlzUHJvamVjdGluZygpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmdldENsb3Nlc3RQcm9qZWN0aW5nUGFyZW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaXNQcm9qZWN0aW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIEJvb2xlYW4oKHRoaXMucmVsYXRpdmVUYXJnZXQgfHxcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldERlbHRhIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmxheW91dFJvb3QpICYmXG4gICAgICAgICAgICAgICAgdGhpcy5sYXlvdXQpO1xuICAgICAgICB9XG4gICAgICAgIGNyZWF0ZVJlbGF0aXZlVGFyZ2V0KHJlbGF0aXZlUGFyZW50LCBsYXlvdXQsIHBhcmVudExheW91dCkge1xuICAgICAgICAgICAgdGhpcy5yZWxhdGl2ZVBhcmVudCA9IHJlbGF0aXZlUGFyZW50O1xuICAgICAgICAgICAgdGhpcy5saW5rZWRQYXJlbnRWZXJzaW9uID0gcmVsYXRpdmVQYXJlbnQubGF5b3V0VmVyc2lvbjtcbiAgICAgICAgICAgIHRoaXMuZm9yY2VSZWxhdGl2ZVBhcmVudFRvUmVzb2x2ZVRhcmdldCgpO1xuICAgICAgICAgICAgdGhpcy5yZWxhdGl2ZVRhcmdldCA9IGNyZWF0ZUJveCgpO1xuICAgICAgICAgICAgdGhpcy5yZWxhdGl2ZVRhcmdldE9yaWdpbiA9IGNyZWF0ZUJveCgpO1xuICAgICAgICAgICAgY2FsY1JlbGF0aXZlUG9zaXRpb24odGhpcy5yZWxhdGl2ZVRhcmdldE9yaWdpbiwgbGF5b3V0LCBwYXJlbnRMYXlvdXQpO1xuICAgICAgICAgICAgY29weUJveEludG8odGhpcy5yZWxhdGl2ZVRhcmdldCwgdGhpcy5yZWxhdGl2ZVRhcmdldE9yaWdpbik7XG4gICAgICAgIH1cbiAgICAgICAgcmVtb3ZlUmVsYXRpdmVUYXJnZXQoKSB7XG4gICAgICAgICAgICB0aGlzLnJlbGF0aXZlUGFyZW50ID0gdGhpcy5yZWxhdGl2ZVRhcmdldCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBjYWxjUHJvamVjdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IGxlYWQgPSB0aGlzLmdldExlYWQoKTtcbiAgICAgICAgICAgIGNvbnN0IGlzU2hhcmVkID0gQm9vbGVhbih0aGlzLnJlc3VtaW5nRnJvbSkgfHwgdGhpcyAhPT0gbGVhZDtcbiAgICAgICAgICAgIGxldCBjYW5Ta2lwID0gdHJ1ZTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgdGhpcyBpcyBhIG5vcm1hbCBsYXlvdXQgYW5pbWF0aW9uIGFuZCBuZWl0aGVyIHRoaXMgbm9kZSBub3IgaXRzIG5lYXJlc3QgcHJvamVjdGluZ1xuICAgICAgICAgICAgICogaXMgZGlydHkgdGhlbiB3ZSBjYW4ndCBza2lwLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAodGhpcy5pc1Byb2plY3Rpb25EaXJ0eSB8fCB0aGlzLnBhcmVudD8uaXNQcm9qZWN0aW9uRGlydHkpIHtcbiAgICAgICAgICAgICAgICBjYW5Ta2lwID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHRoaXMgaXMgYSBzaGFyZWQgbGF5b3V0IGFuaW1hdGlvbiBhbmQgdGhpcyBub2RlJ3Mgc2hhcmVkIHByb2plY3Rpb24gaXMgZGlydHkgdGhlblxuICAgICAgICAgICAgICogd2UgY2FuJ3Qgc2tpcC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKGlzU2hhcmVkICYmXG4gICAgICAgICAgICAgICAgKHRoaXMuaXNTaGFyZWRQcm9qZWN0aW9uRGlydHkgfHwgdGhpcy5pc1RyYW5zZm9ybURpcnR5KSkge1xuICAgICAgICAgICAgICAgIGNhblNraXAgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgd2UgaGF2ZSByZXNvbHZlZCB0aGUgdGFyZ2V0IHRoaXMgZnJhbWUgd2UgbXVzdCByZWNhbGN1bGF0ZSB0aGVcbiAgICAgICAgICAgICAqIHByb2plY3Rpb24gdG8gZW5zdXJlIGl0IHZpc3VhbGx5IHJlcHJlc2VudHMgdGhlIGludGVybmFsIGNhbGN1bGF0aW9ucy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHRoaXMucmVzb2x2ZWRSZWxhdGl2ZVRhcmdldEF0ID09PSBmcmFtZURhdGEudGltZXN0YW1wKSB7XG4gICAgICAgICAgICAgICAgY2FuU2tpcCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhblNraXApXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgeyBsYXlvdXQsIGxheW91dElkIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHRoaXMgc2VjdGlvbiBvZiB0aGUgdHJlZSBpc24ndCBhbmltYXRpbmcgd2UgY2FuXG4gICAgICAgICAgICAgKiBkZWxldGUgb3VyIHRhcmdldCBzb3VyY2VzIGZvciB0aGUgZm9sbG93aW5nIGZyYW1lLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLmlzVHJlZUFuaW1hdGluZyA9IEJvb2xlYW4oKHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LmlzVHJlZUFuaW1hdGluZykgfHxcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRBbmltYXRpb24gfHxcbiAgICAgICAgICAgICAgICB0aGlzLnBlbmRpbmdBbmltYXRpb24pO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVHJlZUFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0RGVsdGEgPSB0aGlzLnJlbGF0aXZlVGFyZ2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLmxheW91dCB8fCAhKGxheW91dCB8fCBsYXlvdXRJZCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBSZXNldCB0aGUgY29ycmVjdGVkIGJveCB3aXRoIHRoZSBsYXRlc3QgdmFsdWVzIGZyb20gYm94LCBhcyB3ZSdyZSB0aGVuIGdvaW5nXG4gICAgICAgICAgICAgKiB0byBwZXJmb3JtIG11dGF0aXZlIG9wZXJhdGlvbnMgb24gaXQuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvcHlCb3hJbnRvKHRoaXMubGF5b3V0Q29ycmVjdGVkLCB0aGlzLmxheW91dC5sYXlvdXRCb3gpO1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBSZWNvcmQgcHJldmlvdXMgdHJlZSBzY2FsZXMgYmVmb3JlIHVwZGF0aW5nLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBwcmV2VHJlZVNjYWxlWCA9IHRoaXMudHJlZVNjYWxlLng7XG4gICAgICAgICAgICBjb25zdCBwcmV2VHJlZVNjYWxlWSA9IHRoaXMudHJlZVNjYWxlLnk7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEFwcGx5IGFsbCB0aGUgcGFyZW50IGRlbHRhcyB0byB0aGlzIGJveCB0byBwcm9kdWNlIHRoZSBjb3JyZWN0ZWQgYm94LiBUaGlzXG4gICAgICAgICAgICAgKiBpcyB0aGUgbGF5b3V0IGJveCwgYXMgaXQgd2lsbCBhcHBlYXIgb24gc2NyZWVuIGFzIGEgcmVzdWx0IG9mIHRoZSB0cmFuc2Zvcm1zIG9mIGl0cyBwYXJlbnRzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBhcHBseVRyZWVEZWx0YXModGhpcy5sYXlvdXRDb3JyZWN0ZWQsIHRoaXMudHJlZVNjYWxlLCB0aGlzLnBhdGgsIGlzU2hhcmVkKTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgdGhpcyBsYXllciBuZWVkcyB0byBwZXJmb3JtIHNjYWxlIGNvcnJlY3Rpb24gYnV0IGRvZXNuJ3QgaGF2ZSBhIHRhcmdldCxcbiAgICAgICAgICAgICAqIHVzZSB0aGUgbGF5b3V0IGFzIHRoZSB0YXJnZXQuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChsZWFkLmxheW91dCAmJlxuICAgICAgICAgICAgICAgICFsZWFkLnRhcmdldCAmJlxuICAgICAgICAgICAgICAgICh0aGlzLnRyZWVTY2FsZS54ICE9PSAxIHx8IHRoaXMudHJlZVNjYWxlLnkgIT09IDEpKSB7XG4gICAgICAgICAgICAgICAgbGVhZC50YXJnZXQgPSBsZWFkLmxheW91dC5sYXlvdXRCb3g7XG4gICAgICAgICAgICAgICAgbGVhZC50YXJnZXRXaXRoVHJhbnNmb3JtcyA9IGNyZWF0ZUJveCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgeyB0YXJnZXQgfSA9IGxlYWQ7XG4gICAgICAgICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIElmIHdlIGRvbid0IGhhdmUgYSB0YXJnZXQgdG8gcHJvamVjdCBpbnRvLCBidXQgd2Ugd2VyZSBwcmV2aW91c2x5XG4gICAgICAgICAgICAgICAgICogcHJvamVjdGluZywgd2Ugd2FudCB0byByZW1vdmUgdGhlIHN0b3JlZCB0cmFuc2Zvcm0gYW5kIHNjaGVkdWxlXG4gICAgICAgICAgICAgICAgICogYSByZW5kZXIgdG8gZW5zdXJlIHRoZSBlbGVtZW50cyByZWZsZWN0IHRoZSByZW1vdmVkIHRyYW5zZm9ybS5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcmV2UHJvamVjdGlvbkRlbHRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdGlvbkRlbHRhcygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlUmVuZGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5wcm9qZWN0aW9uRGVsdGEgfHwgIXRoaXMucHJldlByb2plY3Rpb25EZWx0YSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJvamVjdGlvbkRlbHRhcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29weUF4aXNEZWx0YUludG8odGhpcy5wcmV2UHJvamVjdGlvbkRlbHRhLngsIHRoaXMucHJvamVjdGlvbkRlbHRhLngpO1xuICAgICAgICAgICAgICAgIGNvcHlBeGlzRGVsdGFJbnRvKHRoaXMucHJldlByb2plY3Rpb25EZWx0YS55LCB0aGlzLnByb2plY3Rpb25EZWx0YS55KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVXBkYXRlIHRoZSBkZWx0YSBiZXR3ZWVuIHRoZSBjb3JyZWN0ZWQgYm94IGFuZCB0aGUgdGFyZ2V0IGJveCBiZWZvcmUgdXNlci1zZXQgdHJhbnNmb3JtcyB3ZXJlIGFwcGxpZWQuXG4gICAgICAgICAgICAgKiBUaGlzIHdpbGwgYWxsb3cgdXMgdG8gY2FsY3VsYXRlIHRoZSBjb3JyZWN0ZWQgYm9yZGVyUmFkaXVzIGFuZCBib3hTaGFkb3cgdG8gY29tcGVuc2F0ZVxuICAgICAgICAgICAgICogZm9yIG91ciBsYXlvdXQgcmVwcm9qZWN0aW9uLCBidXQgc3RpbGwgYWxsb3cgdGhlbSB0byBiZSBzY2FsZWQgY29ycmVjdGx5IGJ5IHRoZSB1c2VyLlxuICAgICAgICAgICAgICogSXQgbWlnaHQgYmUgdGhhdCB0byBzaW1wbGlmeSB0aGlzIHdlIG1heSB3YW50IHRvIGFjY2VwdCB0aGF0IHVzZXItc2V0IHNjYWxlIGlzIGFsc28gY29ycmVjdGVkXG4gICAgICAgICAgICAgKiBhbmQgd2Ugd291bGRuJ3QgaGF2ZSB0byBrZWVwIGFuZCBjYWxjIGJvdGggZGVsdGFzLCBPUiB3ZSBjb3VsZCBzdXBwb3J0IGEgdXNlciBzZXR0aW5nXG4gICAgICAgICAgICAgKiB0byBhbGxvdyBwZW9wbGUgdG8gY2hvb3NlIHdoZXRoZXIgdGhlc2Ugc3R5bGVzIGFyZSBjb3JyZWN0ZWQgYmFzZWQgb24ganVzdCB0aGVcbiAgICAgICAgICAgICAqIGxheW91dCByZXByb2plY3Rpb24gb3IgdGhlIGZpbmFsIGJvdW5kaW5nIGJveC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY2FsY0JveERlbHRhKHRoaXMucHJvamVjdGlvbkRlbHRhLCB0aGlzLmxheW91dENvcnJlY3RlZCwgdGFyZ2V0LCB0aGlzLmxhdGVzdFZhbHVlcyk7XG4gICAgICAgICAgICBpZiAodGhpcy50cmVlU2NhbGUueCAhPT0gcHJldlRyZWVTY2FsZVggfHxcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWVTY2FsZS55ICE9PSBwcmV2VHJlZVNjYWxlWSB8fFxuICAgICAgICAgICAgICAgICFheGlzRGVsdGFFcXVhbHModGhpcy5wcm9qZWN0aW9uRGVsdGEueCwgdGhpcy5wcmV2UHJvamVjdGlvbkRlbHRhLngpIHx8XG4gICAgICAgICAgICAgICAgIWF4aXNEZWx0YUVxdWFscyh0aGlzLnByb2plY3Rpb25EZWx0YS55LCB0aGlzLnByZXZQcm9qZWN0aW9uRGVsdGEueSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhc1Byb2plY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZVJlbmRlcigpO1xuICAgICAgICAgICAgICAgIHRoaXMubm90aWZ5TGlzdGVuZXJzKFwicHJvamVjdGlvblVwZGF0ZVwiLCB0YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJbmNyZWFzZSBkZWJ1ZyBjb3VudGVyIGZvciByZWNhbGN1bGF0ZWQgcHJvamVjdGlvbnNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHN0YXRzQnVmZmVyLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgbWV0cmljcy5jYWxjdWxhdGVkUHJvamVjdGlvbnMrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBoaWRlKCkge1xuICAgICAgICAgICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIFRPRE86IFNjaGVkdWxlIHJlbmRlclxuICAgICAgICB9XG4gICAgICAgIHNob3coKSB7XG4gICAgICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAvLyBUT0RPOiBTY2hlZHVsZSByZW5kZXJcbiAgICAgICAgfVxuICAgICAgICBzY2hlZHVsZVJlbmRlcihub3RpZnlBbGwgPSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMudmlzdWFsRWxlbWVudD8uc2NoZWR1bGVSZW5kZXIoKTtcbiAgICAgICAgICAgIGlmIChub3RpZnlBbGwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFjayA9IHRoaXMuZ2V0U3RhY2soKTtcbiAgICAgICAgICAgICAgICBzdGFjayAmJiBzdGFjay5zY2hlZHVsZVJlbmRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucmVzdW1pbmdGcm9tICYmICF0aGlzLnJlc3VtaW5nRnJvbS5pbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdW1pbmdGcm9tID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNyZWF0ZVByb2plY3Rpb25EZWx0YXMoKSB7XG4gICAgICAgICAgICB0aGlzLnByZXZQcm9qZWN0aW9uRGVsdGEgPSBjcmVhdGVEZWx0YSgpO1xuICAgICAgICAgICAgdGhpcy5wcm9qZWN0aW9uRGVsdGEgPSBjcmVhdGVEZWx0YSgpO1xuICAgICAgICAgICAgdGhpcy5wcm9qZWN0aW9uRGVsdGFXaXRoVHJhbnNmb3JtID0gY3JlYXRlRGVsdGEoKTtcbiAgICAgICAgfVxuICAgICAgICBzZXRBbmltYXRpb25PcmlnaW4oZGVsdGEsIGhhc09ubHlSZWxhdGl2ZVRhcmdldENoYW5nZWQgPSBmYWxzZSkge1xuICAgICAgICAgICAgY29uc3Qgc25hcHNob3QgPSB0aGlzLnNuYXBzaG90O1xuICAgICAgICAgICAgY29uc3Qgc25hcHNob3RMYXRlc3RWYWx1ZXMgPSBzbmFwc2hvdCA/IHNuYXBzaG90LmxhdGVzdFZhbHVlcyA6IHt9O1xuICAgICAgICAgICAgY29uc3QgbWl4ZWRWYWx1ZXMgPSB7IC4uLnRoaXMubGF0ZXN0VmFsdWVzIH07XG4gICAgICAgICAgICBjb25zdCB0YXJnZXREZWx0YSA9IGNyZWF0ZURlbHRhKCk7XG4gICAgICAgICAgICBpZiAoIXRoaXMucmVsYXRpdmVQYXJlbnQgfHxcbiAgICAgICAgICAgICAgICAhdGhpcy5yZWxhdGl2ZVBhcmVudC5vcHRpb25zLmxheW91dFJvb3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbGF0aXZlVGFyZ2V0ID0gdGhpcy5yZWxhdGl2ZVRhcmdldE9yaWdpbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYXR0ZW1wdFRvUmVzb2x2ZVJlbGF0aXZlVGFyZ2V0ID0gIWhhc09ubHlSZWxhdGl2ZVRhcmdldENoYW5nZWQ7XG4gICAgICAgICAgICBjb25zdCByZWxhdGl2ZUxheW91dCA9IGNyZWF0ZUJveCgpO1xuICAgICAgICAgICAgY29uc3Qgc25hcHNob3RTb3VyY2UgPSBzbmFwc2hvdCA/IHNuYXBzaG90LnNvdXJjZSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IGxheW91dFNvdXJjZSA9IHRoaXMubGF5b3V0ID8gdGhpcy5sYXlvdXQuc291cmNlIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3QgaXNTaGFyZWRMYXlvdXRBbmltYXRpb24gPSBzbmFwc2hvdFNvdXJjZSAhPT0gbGF5b3V0U291cmNlO1xuICAgICAgICAgICAgY29uc3Qgc3RhY2sgPSB0aGlzLmdldFN0YWNrKCk7XG4gICAgICAgICAgICBjb25zdCBpc09ubHlNZW1iZXIgPSAhc3RhY2sgfHwgc3RhY2subWVtYmVycy5sZW5ndGggPD0gMTtcbiAgICAgICAgICAgIGNvbnN0IHNob3VsZENyb3NzZmFkZU9wYWNpdHkgPSBCb29sZWFuKGlzU2hhcmVkTGF5b3V0QW5pbWF0aW9uICYmXG4gICAgICAgICAgICAgICAgIWlzT25seU1lbWJlciAmJlxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jcm9zc2ZhZGUgPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgICAhdGhpcy5wYXRoLnNvbWUoaGFzT3BhY2l0eUNyb3NzZmFkZSkpO1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25Qcm9ncmVzcyA9IDA7XG4gICAgICAgICAgICBsZXQgcHJldlJlbGF0aXZlVGFyZ2V0O1xuICAgICAgICAgICAgdGhpcy5taXhUYXJnZXREZWx0YSA9IChsYXRlc3QpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9ncmVzcyA9IGxhdGVzdCAvIDEwMDA7XG4gICAgICAgICAgICAgICAgbWl4QXhpc0RlbHRhKHRhcmdldERlbHRhLngsIGRlbHRhLngsIHByb2dyZXNzKTtcbiAgICAgICAgICAgICAgICBtaXhBeGlzRGVsdGEodGFyZ2V0RGVsdGEueSwgZGVsdGEueSwgcHJvZ3Jlc3MpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VGFyZ2V0RGVsdGEodGFyZ2V0RGVsdGEpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlbGF0aXZlVGFyZ2V0ICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVsYXRpdmVUYXJnZXRPcmlnaW4gJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXlvdXQgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWxhdGl2ZVBhcmVudCAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbGF0aXZlUGFyZW50LmxheW91dCkge1xuICAgICAgICAgICAgICAgICAgICBjYWxjUmVsYXRpdmVQb3NpdGlvbihyZWxhdGl2ZUxheW91dCwgdGhpcy5sYXlvdXQubGF5b3V0Qm94LCB0aGlzLnJlbGF0aXZlUGFyZW50LmxheW91dC5sYXlvdXRCb3gpO1xuICAgICAgICAgICAgICAgICAgICBtaXhCb3godGhpcy5yZWxhdGl2ZVRhcmdldCwgdGhpcy5yZWxhdGl2ZVRhcmdldE9yaWdpbiwgcmVsYXRpdmVMYXlvdXQsIHByb2dyZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIElmIHRoaXMgaXMgYW4gdW5jaGFuZ2VkIHJlbGF0aXZlIHRhcmdldCB3ZSBjYW4gY29uc2lkZXIgdGhlXG4gICAgICAgICAgICAgICAgICAgICAqIHByb2plY3Rpb24gbm90IGRpcnR5LlxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZSZWxhdGl2ZVRhcmdldCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgYm94RXF1YWxzKHRoaXMucmVsYXRpdmVUYXJnZXQsIHByZXZSZWxhdGl2ZVRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNQcm9qZWN0aW9uRGlydHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIXByZXZSZWxhdGl2ZVRhcmdldClcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZSZWxhdGl2ZVRhcmdldCA9IGNyZWF0ZUJveCgpO1xuICAgICAgICAgICAgICAgICAgICBjb3B5Qm94SW50byhwcmV2UmVsYXRpdmVUYXJnZXQsIHRoaXMucmVsYXRpdmVUYXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaXNTaGFyZWRMYXlvdXRBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25WYWx1ZXMgPSBtaXhlZFZhbHVlcztcbiAgICAgICAgICAgICAgICAgICAgbWl4VmFsdWVzKG1peGVkVmFsdWVzLCBzbmFwc2hvdExhdGVzdFZhbHVlcywgdGhpcy5sYXRlc3RWYWx1ZXMsIHByb2dyZXNzLCBzaG91bGRDcm9zc2ZhZGVPcGFjaXR5LCBpc09ubHlNZW1iZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Quc2NoZWR1bGVVcGRhdGVQcm9qZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZVJlbmRlcigpO1xuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uUHJvZ3Jlc3MgPSBwcm9ncmVzcztcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLm1peFRhcmdldERlbHRhKHRoaXMub3B0aW9ucy5sYXlvdXRSb290ID8gMTAwMCA6IDApO1xuICAgICAgICB9XG4gICAgICAgIHN0YXJ0QW5pbWF0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMubm90aWZ5TGlzdGVuZXJzKFwiYW5pbWF0aW9uU3RhcnRcIik7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBbmltYXRpb24/LnN0b3AoKTtcbiAgICAgICAgICAgIHRoaXMucmVzdW1pbmdGcm9tPy5jdXJyZW50QW5pbWF0aW9uPy5zdG9wKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5wZW5kaW5nQW5pbWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgY2FuY2VsRnJhbWUodGhpcy5wZW5kaW5nQW5pbWF0aW9uKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBlbmRpbmdBbmltYXRpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFN0YXJ0IHRoZSBhbmltYXRpb24gaW4gdGhlIG5leHQgZnJhbWUgdG8gaGF2ZSBhIGZyYW1lIHdpdGggcHJvZ3Jlc3MgMCxcbiAgICAgICAgICAgICAqIHdoZXJlIHRoZSB0YXJnZXQgaXMgdGhlIHNhbWUgYXMgd2hlbiB0aGUgYW5pbWF0aW9uIHN0YXJ0ZWQsIHNvIHdlIGNhblxuICAgICAgICAgICAgICogY2FsY3VsYXRlIHRoZSByZWxhdGl2ZSBwb3NpdGlvbnMgY29ycmVjdGx5IGZvciBpbnN0YW50IHRyYW5zaXRpb25zLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdBbmltYXRpb24gPSBmcmFtZS51cGRhdGUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGdsb2JhbFByb2plY3Rpb25TdGF0ZS5oYXNBbmltYXRlZFNpbmNlUmVzaXplID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBhY3RpdmVBbmltYXRpb25zLmxheW91dCsrO1xuICAgICAgICAgICAgICAgIHRoaXMubW90aW9uVmFsdWUgfHwgKHRoaXMubW90aW9uVmFsdWUgPSBtb3Rpb25WYWx1ZSgwKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3Rpb25WYWx1ZS5qdW1wKDAsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRBbmltYXRpb24gPSBhbmltYXRlU2luZ2xlVmFsdWUodGhpcy5tb3Rpb25WYWx1ZSwgWzAsIDEwMDBdLCB7XG4gICAgICAgICAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5OiAwLFxuICAgICAgICAgICAgICAgICAgICBpc1N5bmM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG9uVXBkYXRlOiAobGF0ZXN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1peFRhcmdldERlbHRhKGxhdGVzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm9uVXBkYXRlICYmIG9wdGlvbnMub25VcGRhdGUobGF0ZXN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgb25TdG9wOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVBbmltYXRpb25zLmxheW91dC0tO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVBbmltYXRpb25zLmxheW91dC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5vbkNvbXBsZXRlICYmIG9wdGlvbnMub25Db21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wbGV0ZUFuaW1hdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlc3VtaW5nRnJvbSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc3VtaW5nRnJvbS5jdXJyZW50QW5pbWF0aW9uID0gdGhpcy5jdXJyZW50QW5pbWF0aW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnBlbmRpbmdBbmltYXRpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb21wbGV0ZUFuaW1hdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlc3VtaW5nRnJvbSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdW1pbmdGcm9tLmN1cnJlbnRBbmltYXRpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN1bWluZ0Zyb20ucHJlc2VydmVPcGFjaXR5ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgc3RhY2sgPSB0aGlzLmdldFN0YWNrKCk7XG4gICAgICAgICAgICBzdGFjayAmJiBzdGFjay5leGl0QW5pbWF0aW9uQ29tcGxldGUoKTtcbiAgICAgICAgICAgIHRoaXMucmVzdW1pbmdGcm9tID1cbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRBbmltYXRpb24gPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvblZhbHVlcyA9XG4gICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLm5vdGlmeUxpc3RlbmVycyhcImFuaW1hdGlvbkNvbXBsZXRlXCIpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmlzaEFuaW1hdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1peFRhcmdldERlbHRhICYmIHRoaXMubWl4VGFyZ2V0RGVsdGEoYW5pbWF0aW9uVGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRBbmltYXRpb24uc3RvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb21wbGV0ZUFuaW1hdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIGFwcGx5VHJhbnNmb3Jtc1RvVGFyZ2V0KCkge1xuICAgICAgICAgICAgY29uc3QgbGVhZCA9IHRoaXMuZ2V0TGVhZCgpO1xuICAgICAgICAgICAgbGV0IHsgdGFyZ2V0V2l0aFRyYW5zZm9ybXMsIHRhcmdldCwgbGF5b3V0LCBsYXRlc3RWYWx1ZXMgfSA9IGxlYWQ7XG4gICAgICAgICAgICBpZiAoIXRhcmdldFdpdGhUcmFuc2Zvcm1zIHx8ICF0YXJnZXQgfHwgIWxheW91dClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElmIHdlJ3JlIG9ubHkgYW5pbWF0aW5nIHBvc2l0aW9uLCBhbmQgdGhpcyBlbGVtZW50IGlzbid0IHRoZSBsZWFkIGVsZW1lbnQsXG4gICAgICAgICAgICAgKiB0aGVuIGluc3RlYWQgb2YgcHJvamVjdGluZyBpbnRvIHRoZSBsZWFkIGJveCB3ZSBpbnN0ZWFkIHdhbnQgdG8gY2FsY3VsYXRlXG4gICAgICAgICAgICAgKiBhIG5ldyB0YXJnZXQgdGhhdCBhbGlnbnMgdGhlIHR3byBib3hlcyBidXQgbWFpbnRhaW5zIHRoZSBsYXlvdXQgc2hhcGUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh0aGlzICE9PSBsZWFkICYmXG4gICAgICAgICAgICAgICAgdGhpcy5sYXlvdXQgJiZcbiAgICAgICAgICAgICAgICBsYXlvdXQgJiZcbiAgICAgICAgICAgICAgICBzaG91bGRBbmltYXRlUG9zaXRpb25Pbmx5KHRoaXMub3B0aW9ucy5hbmltYXRpb25UeXBlLCB0aGlzLmxheW91dC5sYXlvdXRCb3gsIGxheW91dC5sYXlvdXRCb3gpKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gdGhpcy50YXJnZXQgfHwgY3JlYXRlQm94KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgeExlbmd0aCA9IGNhbGNMZW5ndGgodGhpcy5sYXlvdXQubGF5b3V0Qm94LngpO1xuICAgICAgICAgICAgICAgIHRhcmdldC54Lm1pbiA9IGxlYWQudGFyZ2V0LngubWluO1xuICAgICAgICAgICAgICAgIHRhcmdldC54Lm1heCA9IHRhcmdldC54Lm1pbiArIHhMZW5ndGg7XG4gICAgICAgICAgICAgICAgY29uc3QgeUxlbmd0aCA9IGNhbGNMZW5ndGgodGhpcy5sYXlvdXQubGF5b3V0Qm94LnkpO1xuICAgICAgICAgICAgICAgIHRhcmdldC55Lm1pbiA9IGxlYWQudGFyZ2V0LnkubWluO1xuICAgICAgICAgICAgICAgIHRhcmdldC55Lm1heCA9IHRhcmdldC55Lm1pbiArIHlMZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb3B5Qm94SW50byh0YXJnZXRXaXRoVHJhbnNmb3JtcywgdGFyZ2V0KTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQXBwbHkgdGhlIGxhdGVzdCB1c2VyLXNldCB0cmFuc2Zvcm1zIHRvIHRoZSB0YXJnZXRCb3ggdG8gcHJvZHVjZSB0aGUgdGFyZ2V0Qm94RmluYWwuXG4gICAgICAgICAgICAgKiBUaGlzIGlzIHRoZSBmaW5hbCBib3ggdGhhdCB3ZSB3aWxsIHRoZW4gcHJvamVjdCBpbnRvIGJ5IGNhbGN1bGF0aW5nIGEgdHJhbnNmb3JtIGRlbHRhIGFuZFxuICAgICAgICAgICAgICogYXBwbHlpbmcgaXQgdG8gdGhlIGNvcnJlY3RlZCBib3guXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRyYW5zZm9ybUJveCh0YXJnZXRXaXRoVHJhbnNmb3JtcywgbGF0ZXN0VmFsdWVzKTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVXBkYXRlIHRoZSBkZWx0YSBiZXR3ZWVuIHRoZSBjb3JyZWN0ZWQgYm94IGFuZCB0aGUgZmluYWwgdGFyZ2V0IGJveCwgYWZ0ZXJcbiAgICAgICAgICAgICAqIHVzZXItc2V0IHRyYW5zZm9ybXMgYXJlIGFwcGxpZWQgdG8gaXQuIFRoaXMgd2lsbCBiZSB1c2VkIGJ5IHRoZSByZW5kZXJlciB0b1xuICAgICAgICAgICAgICogY3JlYXRlIGEgdHJhbnNmb3JtIHN0eWxlIHRoYXQgd2lsbCByZXByb2plY3QgdGhlIGVsZW1lbnQgZnJvbSBpdHMgbGF5b3V0IGxheW91dFxuICAgICAgICAgICAgICogaW50byB0aGUgZGVzaXJlZCBib3VuZGluZyBib3guXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNhbGNCb3hEZWx0YSh0aGlzLnByb2plY3Rpb25EZWx0YVdpdGhUcmFuc2Zvcm0sIHRoaXMubGF5b3V0Q29ycmVjdGVkLCB0YXJnZXRXaXRoVHJhbnNmb3JtcywgbGF0ZXN0VmFsdWVzKTtcbiAgICAgICAgfVxuICAgICAgICByZWdpc3RlclNoYXJlZE5vZGUobGF5b3V0SWQsIG5vZGUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zaGFyZWROb2Rlcy5oYXMobGF5b3V0SWQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaGFyZWROb2Rlcy5zZXQobGF5b3V0SWQsIG5ldyBOb2RlU3RhY2soKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzdGFjayA9IHRoaXMuc2hhcmVkTm9kZXMuZ2V0KGxheW91dElkKTtcbiAgICAgICAgICAgIHN0YWNrLmFkZChub2RlKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IG5vZGUub3B0aW9ucy5pbml0aWFsUHJvbW90aW9uQ29uZmlnO1xuICAgICAgICAgICAgbm9kZS5wcm9tb3RlKHtcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBjb25maWcgPyBjb25maWcudHJhbnNpdGlvbiA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBwcmVzZXJ2ZUZvbGxvd09wYWNpdHk6IGNvbmZpZyAmJiBjb25maWcuc2hvdWxkUHJlc2VydmVGb2xsb3dPcGFjaXR5XG4gICAgICAgICAgICAgICAgICAgID8gY29uZmlnLnNob3VsZFByZXNlcnZlRm9sbG93T3BhY2l0eShub2RlKVxuICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlzTGVhZCgpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YWNrID0gdGhpcy5nZXRTdGFjaygpO1xuICAgICAgICAgICAgcmV0dXJuIHN0YWNrID8gc3RhY2subGVhZCA9PT0gdGhpcyA6IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0TGVhZCgpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgbGF5b3V0SWQgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgICAgIHJldHVybiBsYXlvdXRJZCA/IHRoaXMuZ2V0U3RhY2soKT8ubGVhZCB8fCB0aGlzIDogdGhpcztcbiAgICAgICAgfVxuICAgICAgICBnZXRQcmV2TGVhZCgpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgbGF5b3V0SWQgfSA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgICAgIHJldHVybiBsYXlvdXRJZCA/IHRoaXMuZ2V0U3RhY2soKT8ucHJldkxlYWQgOiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZ2V0U3RhY2soKSB7XG4gICAgICAgICAgICBjb25zdCB7IGxheW91dElkIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgICAgICBpZiAobGF5b3V0SWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucm9vdC5zaGFyZWROb2Rlcy5nZXQobGF5b3V0SWQpO1xuICAgICAgICB9XG4gICAgICAgIHByb21vdGUoeyBuZWVkc1Jlc2V0LCB0cmFuc2l0aW9uLCBwcmVzZXJ2ZUZvbGxvd09wYWNpdHksIH0gPSB7fSkge1xuICAgICAgICAgICAgY29uc3Qgc3RhY2sgPSB0aGlzLmdldFN0YWNrKCk7XG4gICAgICAgICAgICBpZiAoc3RhY2spXG4gICAgICAgICAgICAgICAgc3RhY2sucHJvbW90ZSh0aGlzLCBwcmVzZXJ2ZUZvbGxvd09wYWNpdHkpO1xuICAgICAgICAgICAgaWYgKG5lZWRzUmVzZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2plY3Rpb25EZWx0YSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB0aGlzLm5lZWRzUmVzZXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRyYW5zaXRpb24pXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRPcHRpb25zKHsgdHJhbnNpdGlvbiB9KTtcbiAgICAgICAgfVxuICAgICAgICByZWxlZ2F0ZSgpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YWNrID0gdGhpcy5nZXRTdGFjaygpO1xuICAgICAgICAgICAgaWYgKHN0YWNrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YWNrLnJlbGVnYXRlKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlc2V0U2tld0FuZFJvdGF0aW9uKCkge1xuICAgICAgICAgICAgY29uc3QgeyB2aXN1YWxFbGVtZW50IH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgICAgICBpZiAoIXZpc3VhbEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBubyBkZXRlY3RlZCBza2V3IG9yIHJvdGF0aW9uIHZhbHVlcywgd2UgY2FuIGVhcmx5IHJldHVybiB3aXRob3V0IGEgZm9yY2VkIHJlbmRlci5cbiAgICAgICAgICAgIGxldCBoYXNEaXN0b3J0aW5nVHJhbnNmb3JtID0gZmFsc2U7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEFuIHVucm9sbGVkIGNoZWNrIGZvciByb3RhdGlvbiB2YWx1ZXMuIE1vc3QgZWxlbWVudHMgZG9uJ3QgaGF2ZSBhbnkgcm90YXRpb24gYW5kXG4gICAgICAgICAgICAgKiBza2lwcGluZyB0aGUgbmVzdGVkIGxvb3AgYW5kIG5ldyBvYmplY3QgY3JlYXRpb24gaXMgNTAlIGZhc3Rlci5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgeyBsYXRlc3RWYWx1ZXMgfSA9IHZpc3VhbEVsZW1lbnQ7XG4gICAgICAgICAgICBpZiAobGF0ZXN0VmFsdWVzLnogfHxcbiAgICAgICAgICAgICAgICBsYXRlc3RWYWx1ZXMucm90YXRlIHx8XG4gICAgICAgICAgICAgICAgbGF0ZXN0VmFsdWVzLnJvdGF0ZVggfHxcbiAgICAgICAgICAgICAgICBsYXRlc3RWYWx1ZXMucm90YXRlWSB8fFxuICAgICAgICAgICAgICAgIGxhdGVzdFZhbHVlcy5yb3RhdGVaIHx8XG4gICAgICAgICAgICAgICAgbGF0ZXN0VmFsdWVzLnNrZXdYIHx8XG4gICAgICAgICAgICAgICAgbGF0ZXN0VmFsdWVzLnNrZXdZKSB7XG4gICAgICAgICAgICAgICAgaGFzRGlzdG9ydGluZ1RyYW5zZm9ybSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJZiB0aGVyZSdzIG5vIGRpc3RvcnRpbmcgdmFsdWVzLCB3ZSBkb24ndCBuZWVkIHRvIGRvIGFueSBtb3JlLlxuICAgICAgICAgICAgaWYgKCFoYXNEaXN0b3J0aW5nVHJhbnNmb3JtKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IHJlc2V0VmFsdWVzID0ge307XG4gICAgICAgICAgICBpZiAobGF0ZXN0VmFsdWVzLnopIHtcbiAgICAgICAgICAgICAgICByZXNldERpc3RvcnRpbmdUcmFuc2Zvcm0oXCJ6XCIsIHZpc3VhbEVsZW1lbnQsIHJlc2V0VmFsdWVzLCB0aGlzLmFuaW1hdGlvblZhbHVlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBDaGVjayB0aGUgc2tldyBhbmQgcm90YXRlIHZhbHVlIG9mIGFsbCBheGVzIGFuZCByZXNldCB0byAwXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zZm9ybUF4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICByZXNldERpc3RvcnRpbmdUcmFuc2Zvcm0oYHJvdGF0ZSR7dHJhbnNmb3JtQXhlc1tpXX1gLCB2aXN1YWxFbGVtZW50LCByZXNldFZhbHVlcywgdGhpcy5hbmltYXRpb25WYWx1ZXMpO1xuICAgICAgICAgICAgICAgIHJlc2V0RGlzdG9ydGluZ1RyYW5zZm9ybShgc2tldyR7dHJhbnNmb3JtQXhlc1tpXX1gLCB2aXN1YWxFbGVtZW50LCByZXNldFZhbHVlcywgdGhpcy5hbmltYXRpb25WYWx1ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRm9yY2UgYSByZW5kZXIgb2YgdGhpcyBlbGVtZW50IHRvIGFwcGx5IHRoZSB0cmFuc2Zvcm0gd2l0aCBhbGwgc2tld3MgYW5kIHJvdGF0aW9uc1xuICAgICAgICAgICAgLy8gc2V0IHRvIDAuXG4gICAgICAgICAgICB2aXN1YWxFbGVtZW50LnJlbmRlcigpO1xuICAgICAgICAgICAgLy8gUHV0IGJhY2sgYWxsIHRoZSB2YWx1ZXMgd2UgcmVzZXRcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHJlc2V0VmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgdmlzdWFsRWxlbWVudC5zZXRTdGF0aWNWYWx1ZShrZXksIHJlc2V0VmFsdWVzW2tleV0pO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFuaW1hdGlvblZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvblZhbHVlc1trZXldID0gcmVzZXRWYWx1ZXNba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTY2hlZHVsZSBhIHJlbmRlciBmb3IgdGhlIG5leHQgZnJhbWUuIFRoaXMgZW5zdXJlcyB3ZSB3b24ndCB2aXN1YWxseVxuICAgICAgICAgICAgLy8gc2VlIHRoZSBlbGVtZW50IHdpdGggdGhlIHJlc2V0IHJvdGF0ZSB2YWx1ZSBhcHBsaWVkLlxuICAgICAgICAgICAgdmlzdWFsRWxlbWVudC5zY2hlZHVsZVJlbmRlcigpO1xuICAgICAgICB9XG4gICAgICAgIGFwcGx5UHJvamVjdGlvblN0eWxlcyh0YXJnZXRTdHlsZSwgLy8gQ1NTU3R5bGVEZWNsYXJhdGlvbiAtIGRvZXNuJ3QgYWxsb3cgbnVtYmVycyB0byBiZSBhc3NpZ25lZCB0byBwcm9wZXJ0aWVzXG4gICAgICAgIHN0eWxlUHJvcCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmluc3RhbmNlIHx8IHRoaXMuaXNTVkcpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybVRlbXBsYXRlID0gdGhpcy5nZXRUcmFuc2Zvcm1UZW1wbGF0ZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMubmVlZHNSZXNldCkge1xuICAgICAgICAgICAgICAgIHRoaXMubmVlZHNSZXNldCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRhcmdldFN0eWxlLnZpc2liaWxpdHkgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHRhcmdldFN0eWxlLm9wYWNpdHkgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHRhcmdldFN0eWxlLnBvaW50ZXJFdmVudHMgPVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlTW90aW9uVmFsdWUoc3R5bGVQcm9wPy5wb2ludGVyRXZlbnRzKSB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIHRhcmdldFN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVRlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgID8gdHJhbnNmb3JtVGVtcGxhdGUodGhpcy5sYXRlc3RWYWx1ZXMsIFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIDogXCJub25lXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbGVhZCA9IHRoaXMuZ2V0TGVhZCgpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnByb2plY3Rpb25EZWx0YSB8fCAhdGhpcy5sYXlvdXQgfHwgIWxlYWQudGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5sYXlvdXRJZCkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRTdHlsZS5vcGFjaXR5ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGF0ZXN0VmFsdWVzLm9wYWNpdHkgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5sYXRlc3RWYWx1ZXMub3BhY2l0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogMTtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0U3R5bGUucG9pbnRlckV2ZW50cyA9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlTW90aW9uVmFsdWUoc3R5bGVQcm9wPy5wb2ludGVyRXZlbnRzKSB8fCBcIlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNQcm9qZWN0ZWQgJiYgIWhhc1RyYW5zZm9ybSh0aGlzLmxhdGVzdFZhbHVlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0U3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtVGVtcGxhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgID8gdHJhbnNmb3JtVGVtcGxhdGUoe30sIFwiXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc1Byb2plY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXJnZXRTdHlsZS52aXNpYmlsaXR5ID0gXCJcIjtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlc1RvUmVuZGVyID0gbGVhZC5hbmltYXRpb25WYWx1ZXMgfHwgbGVhZC5sYXRlc3RWYWx1ZXM7XG4gICAgICAgICAgICB0aGlzLmFwcGx5VHJhbnNmb3Jtc1RvVGFyZ2V0KCk7XG4gICAgICAgICAgICBsZXQgdHJhbnNmb3JtID0gYnVpbGRQcm9qZWN0aW9uVHJhbnNmb3JtKHRoaXMucHJvamVjdGlvbkRlbHRhV2l0aFRyYW5zZm9ybSwgdGhpcy50cmVlU2NhbGUsIHZhbHVlc1RvUmVuZGVyKTtcbiAgICAgICAgICAgIGlmICh0cmFuc2Zvcm1UZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybSA9IHRyYW5zZm9ybVRlbXBsYXRlKHZhbHVlc1RvUmVuZGVyLCB0cmFuc2Zvcm0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFyZ2V0U3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuICAgICAgICAgICAgY29uc3QgeyB4LCB5IH0gPSB0aGlzLnByb2plY3Rpb25EZWx0YTtcbiAgICAgICAgICAgIHRhcmdldFN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9IGAke3gub3JpZ2luICogMTAwfSUgJHt5Lm9yaWdpbiAqIDEwMH0lIDBgO1xuICAgICAgICAgICAgaWYgKGxlYWQuYW5pbWF0aW9uVmFsdWVzKSB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogSWYgdGhlIGxlYWQgY29tcG9uZW50IGlzIGFuaW1hdGluZywgYXNzaWduIHRoaXMgZWl0aGVyIHRoZSBlbnRlcmluZy9sZWF2aW5nXG4gICAgICAgICAgICAgICAgICogb3BhY2l0eVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHRhcmdldFN0eWxlLm9wYWNpdHkgPVxuICAgICAgICAgICAgICAgICAgICBsZWFkID09PSB0aGlzXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHZhbHVlc1RvUmVuZGVyLm9wYWNpdHkgPz9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhdGVzdFZhbHVlcy5vcGFjaXR5ID8/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB0aGlzLnByZXNlcnZlT3BhY2l0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5sYXRlc3RWYWx1ZXMub3BhY2l0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogdmFsdWVzVG9SZW5kZXIub3BhY2l0eUV4aXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBPciB3ZSdyZSBub3QgYW5pbWF0aW5nIGF0IGFsbCwgc2V0IHRoZSBsZWFkIGNvbXBvbmVudCB0byBpdHMgbGF5b3V0XG4gICAgICAgICAgICAgICAgICogb3BhY2l0eSBhbmQgb3RoZXIgY29tcG9uZW50cyB0byBoaWRkZW4uXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdGFyZ2V0U3R5bGUub3BhY2l0eSA9XG4gICAgICAgICAgICAgICAgICAgIGxlYWQgPT09IHRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgID8gdmFsdWVzVG9SZW5kZXIub3BhY2l0eSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB2YWx1ZXNUb1JlbmRlci5vcGFjaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIlwiXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHZhbHVlc1RvUmVuZGVyLm9wYWNpdHlFeGl0ICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHZhbHVlc1RvUmVuZGVyLm9wYWNpdHlFeGl0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBBcHBseSBzY2FsZSBjb3JyZWN0aW9uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHNjYWxlQ29ycmVjdG9ycykge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZXNUb1JlbmRlcltrZXldID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgY29ycmVjdCwgYXBwbHlUbywgaXNDU1NWYXJpYWJsZSB9ID0gc2NhbGVDb3JyZWN0b3JzW2tleV07XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogT25seSBhcHBseSBzY2FsZSBjb3JyZWN0aW9uIHRvIHRoZSB2YWx1ZSBpZiB3ZSBoYXZlIGFuXG4gICAgICAgICAgICAgICAgICogYWN0aXZlIHByb2plY3Rpb24gdHJhbnNmb3JtLiBPdGhlcndpc2UgdGhlc2UgdmFsdWVzIGJlY29tZVxuICAgICAgICAgICAgICAgICAqIHZ1bG5lcmFibGUgdG8gZGlzdG9ydGlvbiBpZiB0aGUgZWxlbWVudCBjaGFuZ2VzIHNpemUgd2l0aG91dFxuICAgICAgICAgICAgICAgICAqIGEgY29ycmVzcG9uZGluZyBsYXlvdXQgYW5pbWF0aW9uLlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvcnJlY3RlZCA9IHRyYW5zZm9ybSA9PT0gXCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgPyB2YWx1ZXNUb1JlbmRlcltrZXldXG4gICAgICAgICAgICAgICAgICAgIDogY29ycmVjdCh2YWx1ZXNUb1JlbmRlcltrZXldLCBsZWFkKTtcbiAgICAgICAgICAgICAgICBpZiAoYXBwbHlUbykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBudW0gPSBhcHBseVRvLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW07IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0U3R5bGVbYXBwbHlUb1tpXV0gPSBjb3JyZWN0ZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSBDU1MgdmFyaWFibGUsIHNldCBpdCBkaXJlY3RseSBvbiB0aGUgaW5zdGFuY2UuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlcGxhY2luZyB0aGlzIGZ1bmN0aW9uIGZyb20gY3JlYXRpbmcgc3R5bGVzIHRvIHNldHRpbmcgdGhlbVxuICAgICAgICAgICAgICAgICAgICAvLyB3b3VsZCBiZSBhIGdvb2QgcGxhY2UgdG8gcmVtb3ZlIHBlciBmcmFtZSBvYmplY3QgY3JlYXRpb25cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ1NTVmFyaWFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy52aXN1YWxFbGVtZW50LnJlbmRlclN0YXRlLnZhcnNba2V5XSA9IGNvcnJlY3RlZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFN0eWxlW2tleV0gPSBjb3JyZWN0ZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERpc2FibGUgcG9pbnRlciBldmVudHMgb24gZm9sbG93IGNvbXBvbmVudHMuIFRoaXMgaXMgdG8gZW5zdXJlXG4gICAgICAgICAgICAgKiB0aGF0IGlmIGEgZm9sbG93IGNvbXBvbmVudCBjb3ZlcnMgYSBsZWFkIGNvbXBvbmVudCBpdCBkb2Vzbid0IGJsb2NrXG4gICAgICAgICAgICAgKiBwb2ludGVyIGV2ZW50cyBvbiB0aGUgbGVhZC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5sYXlvdXRJZCkge1xuICAgICAgICAgICAgICAgIHRhcmdldFN0eWxlLnBvaW50ZXJFdmVudHMgPVxuICAgICAgICAgICAgICAgICAgICBsZWFkID09PSB0aGlzXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHJlc29sdmVNb3Rpb25WYWx1ZShzdHlsZVByb3A/LnBvaW50ZXJFdmVudHMpIHx8IFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogXCJub25lXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2xlYXJTbmFwc2hvdCgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzdW1lRnJvbSA9IHRoaXMuc25hcHNob3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gT25seSBydW4gb24gcm9vdFxuICAgICAgICByZXNldFRyZWUoKSB7XG4gICAgICAgICAgICB0aGlzLnJvb3Qubm9kZXMuZm9yRWFjaCgobm9kZSkgPT4gbm9kZS5jdXJyZW50QW5pbWF0aW9uPy5zdG9wKCkpO1xuICAgICAgICAgICAgdGhpcy5yb290Lm5vZGVzLmZvckVhY2goY2xlYXJNZWFzdXJlbWVudHMpO1xuICAgICAgICAgICAgdGhpcy5yb290LnNoYXJlZE5vZGVzLmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gdXBkYXRlTGF5b3V0KG5vZGUpIHtcbiAgICBub2RlLnVwZGF0ZUxheW91dCgpO1xufVxuZnVuY3Rpb24gbm90aWZ5TGF5b3V0VXBkYXRlKG5vZGUpIHtcbiAgICBjb25zdCBzbmFwc2hvdCA9IG5vZGUucmVzdW1lRnJvbT8uc25hcHNob3QgfHwgbm9kZS5zbmFwc2hvdDtcbiAgICBpZiAobm9kZS5pc0xlYWQoKSAmJlxuICAgICAgICBub2RlLmxheW91dCAmJlxuICAgICAgICBzbmFwc2hvdCAmJlxuICAgICAgICBub2RlLmhhc0xpc3RlbmVycyhcImRpZFVwZGF0ZVwiKSkge1xuICAgICAgICBjb25zdCB7IGxheW91dEJveDogbGF5b3V0LCBtZWFzdXJlZEJveDogbWVhc3VyZWRMYXlvdXQgfSA9IG5vZGUubGF5b3V0O1xuICAgICAgICBjb25zdCB7IGFuaW1hdGlvblR5cGUgfSA9IG5vZGUub3B0aW9ucztcbiAgICAgICAgY29uc3QgaXNTaGFyZWQgPSBzbmFwc2hvdC5zb3VyY2UgIT09IG5vZGUubGF5b3V0LnNvdXJjZTtcbiAgICAgICAgLy8gVE9ETyBNYXliZSB3ZSB3YW50IHRvIGFsc28gcmVzaXplIHRoZSBsYXlvdXQgc25hcHNob3Qgc28gd2UgZG9uJ3QgdHJpZ2dlclxuICAgICAgICAvLyBhbmltYXRpb25zIGZvciBpbnN0YW5jZSBpZiBsYXlvdXQ9XCJzaXplXCIgYW5kIGFuIGVsZW1lbnQgaGFzIG9ubHkgY2hhbmdlZCBwb3NpdGlvblxuICAgICAgICBpZiAoYW5pbWF0aW9uVHlwZSA9PT0gXCJzaXplXCIpIHtcbiAgICAgICAgICAgIGVhY2hBeGlzKChheGlzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXhpc1NuYXBzaG90ID0gaXNTaGFyZWRcbiAgICAgICAgICAgICAgICAgICAgPyBzbmFwc2hvdC5tZWFzdXJlZEJveFtheGlzXVxuICAgICAgICAgICAgICAgICAgICA6IHNuYXBzaG90LmxheW91dEJveFtheGlzXTtcbiAgICAgICAgICAgICAgICBjb25zdCBsZW5ndGggPSBjYWxjTGVuZ3RoKGF4aXNTbmFwc2hvdCk7XG4gICAgICAgICAgICAgICAgYXhpc1NuYXBzaG90Lm1pbiA9IGxheW91dFtheGlzXS5taW47XG4gICAgICAgICAgICAgICAgYXhpc1NuYXBzaG90Lm1heCA9IGF4aXNTbmFwc2hvdC5taW4gKyBsZW5ndGg7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhbmltYXRpb25UeXBlID09PSBcInhcIiB8fCBhbmltYXRpb25UeXBlID09PSBcInlcIikge1xuICAgICAgICAgICAgY29uc3Qgc25hcEF4aXMgPSBhbmltYXRpb25UeXBlID09PSBcInhcIiA/IFwieVwiIDogXCJ4XCI7XG4gICAgICAgICAgICBjb3B5QXhpc0ludG8oaXNTaGFyZWRcbiAgICAgICAgICAgICAgICA/IHNuYXBzaG90Lm1lYXN1cmVkQm94W3NuYXBBeGlzXVxuICAgICAgICAgICAgICAgIDogc25hcHNob3QubGF5b3V0Qm94W3NuYXBBeGlzXSwgbGF5b3V0W3NuYXBBeGlzXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2hvdWxkQW5pbWF0ZVBvc2l0aW9uT25seShhbmltYXRpb25UeXBlLCBzbmFwc2hvdC5sYXlvdXRCb3gsIGxheW91dCkpIHtcbiAgICAgICAgICAgIGVhY2hBeGlzKChheGlzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXhpc1NuYXBzaG90ID0gaXNTaGFyZWRcbiAgICAgICAgICAgICAgICAgICAgPyBzbmFwc2hvdC5tZWFzdXJlZEJveFtheGlzXVxuICAgICAgICAgICAgICAgICAgICA6IHNuYXBzaG90LmxheW91dEJveFtheGlzXTtcbiAgICAgICAgICAgICAgICBjb25zdCBsZW5ndGggPSBjYWxjTGVuZ3RoKGxheW91dFtheGlzXSk7XG4gICAgICAgICAgICAgICAgYXhpc1NuYXBzaG90Lm1heCA9IGF4aXNTbmFwc2hvdC5taW4gKyBsZW5ndGg7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogRW5zdXJlIHJlbGF0aXZlIHRhcmdldCBnZXRzIHJlc2l6ZWQgYW5kIHJlcmVuZGVyZXJkXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUucmVsYXRpdmVUYXJnZXQgJiYgIW5vZGUuY3VycmVudEFuaW1hdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBub2RlLmlzUHJvamVjdGlvbkRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5yZWxhdGl2ZVRhcmdldFtheGlzXS5tYXggPVxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5yZWxhdGl2ZVRhcmdldFtheGlzXS5taW4gKyBsZW5ndGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGF5b3V0RGVsdGEgPSBjcmVhdGVEZWx0YSgpO1xuICAgICAgICBjYWxjQm94RGVsdGEobGF5b3V0RGVsdGEsIGxheW91dCwgc25hcHNob3QubGF5b3V0Qm94KTtcbiAgICAgICAgY29uc3QgdmlzdWFsRGVsdGEgPSBjcmVhdGVEZWx0YSgpO1xuICAgICAgICBpZiAoaXNTaGFyZWQpIHtcbiAgICAgICAgICAgIGNhbGNCb3hEZWx0YSh2aXN1YWxEZWx0YSwgbm9kZS5hcHBseVRyYW5zZm9ybShtZWFzdXJlZExheW91dCwgdHJ1ZSksIHNuYXBzaG90Lm1lYXN1cmVkQm94KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNhbGNCb3hEZWx0YSh2aXN1YWxEZWx0YSwgbGF5b3V0LCBzbmFwc2hvdC5sYXlvdXRCb3gpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGhhc0xheW91dENoYW5nZWQgPSAhaXNEZWx0YVplcm8obGF5b3V0RGVsdGEpO1xuICAgICAgICBsZXQgaGFzUmVsYXRpdmVMYXlvdXRDaGFuZ2VkID0gZmFsc2U7XG4gICAgICAgIGlmICghbm9kZS5yZXN1bWVGcm9tKSB7XG4gICAgICAgICAgICBjb25zdCByZWxhdGl2ZVBhcmVudCA9IG5vZGUuZ2V0Q2xvc2VzdFByb2plY3RpbmdQYXJlbnQoKTtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSWYgdGhlIHJlbGF0aXZlUGFyZW50IGlzIGl0c2VsZiByZXN1bWluZyBmcm9tIGEgZGlmZmVyZW50IGVsZW1lbnQgdGhlblxuICAgICAgICAgICAgICogdGhlIHJlbGF0aXZlIHNuYXBzaG90IGlzIG5vdCByZWxhdmVudFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAocmVsYXRpdmVQYXJlbnQgJiYgIXJlbGF0aXZlUGFyZW50LnJlc3VtZUZyb20pIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IHNuYXBzaG90OiBwYXJlbnRTbmFwc2hvdCwgbGF5b3V0OiBwYXJlbnRMYXlvdXQgfSA9IHJlbGF0aXZlUGFyZW50O1xuICAgICAgICAgICAgICAgIGlmIChwYXJlbnRTbmFwc2hvdCAmJiBwYXJlbnRMYXlvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVsYXRpdmVTbmFwc2hvdCA9IGNyZWF0ZUJveCgpO1xuICAgICAgICAgICAgICAgICAgICBjYWxjUmVsYXRpdmVQb3NpdGlvbihyZWxhdGl2ZVNuYXBzaG90LCBzbmFwc2hvdC5sYXlvdXRCb3gsIHBhcmVudFNuYXBzaG90LmxheW91dEJveCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbGF0aXZlTGF5b3V0ID0gY3JlYXRlQm94KCk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGNSZWxhdGl2ZVBvc2l0aW9uKHJlbGF0aXZlTGF5b3V0LCBsYXlvdXQsIHBhcmVudExheW91dC5sYXlvdXRCb3gpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWJveEVxdWFsc1JvdW5kZWQocmVsYXRpdmVTbmFwc2hvdCwgcmVsYXRpdmVMYXlvdXQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNSZWxhdGl2ZUxheW91dENoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWxhdGl2ZVBhcmVudC5vcHRpb25zLmxheW91dFJvb3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUucmVsYXRpdmVUYXJnZXQgPSByZWxhdGl2ZUxheW91dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUucmVsYXRpdmVUYXJnZXRPcmlnaW4gPSByZWxhdGl2ZVNuYXBzaG90O1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5yZWxhdGl2ZVBhcmVudCA9IHJlbGF0aXZlUGFyZW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG5vZGUubm90aWZ5TGlzdGVuZXJzKFwiZGlkVXBkYXRlXCIsIHtcbiAgICAgICAgICAgIGxheW91dCxcbiAgICAgICAgICAgIHNuYXBzaG90LFxuICAgICAgICAgICAgZGVsdGE6IHZpc3VhbERlbHRhLFxuICAgICAgICAgICAgbGF5b3V0RGVsdGEsXG4gICAgICAgICAgICBoYXNMYXlvdXRDaGFuZ2VkLFxuICAgICAgICAgICAgaGFzUmVsYXRpdmVMYXlvdXRDaGFuZ2VkLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSBpZiAobm9kZS5pc0xlYWQoKSkge1xuICAgICAgICBjb25zdCB7IG9uRXhpdENvbXBsZXRlIH0gPSBub2RlLm9wdGlvbnM7XG4gICAgICAgIG9uRXhpdENvbXBsZXRlICYmIG9uRXhpdENvbXBsZXRlKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENsZWFyaW5nIHRyYW5zaXRpb25cbiAgICAgKiBUT0RPOiBJbnZlc3RpZ2F0ZSB3aHkgdGhpcyB0cmFuc2l0aW9uIGlzIGJlaW5nIHBhc3NlZCBpbiBhcyB7dHlwZTogZmFsc2UgfSBmcm9tIEZyYW1lclxuICAgICAqIGFuZCB3aHkgd2UgbmVlZCBpdCBhdCBhbGxcbiAgICAgKi9cbiAgICBub2RlLm9wdGlvbnMudHJhbnNpdGlvbiA9IHVuZGVmaW5lZDtcbn1cbmZ1bmN0aW9uIHByb3BhZ2F0ZURpcnR5Tm9kZXMobm9kZSkge1xuICAgIC8qKlxuICAgICAqIEluY3JlYXNlIGRlYnVnIGNvdW50ZXIgZm9yIG5vZGVzIGVuY291bnRlcmVkIHRoaXMgZnJhbWVcbiAgICAgKi9cbiAgICBpZiAoc3RhdHNCdWZmZXIudmFsdWUpIHtcbiAgICAgICAgbWV0cmljcy5ub2RlcysrO1xuICAgIH1cbiAgICBpZiAoIW5vZGUucGFyZW50KVxuICAgICAgICByZXR1cm47XG4gICAgLyoqXG4gICAgICogSWYgdGhpcyBub2RlIGlzbid0IHByb2plY3RpbmcsIHByb3BhZ2F0ZSBpc1Byb2plY3Rpb25EaXJ0eS4gSXQgd2lsbCBoYXZlXG4gICAgICogbm8gcGVyZm9ybWFuY2UgaW1wYWN0IGJ1dCBpdCB3aWxsIGFsbG93IHRoZSBuZXh0IGNoaWxkIHRoYXQgKmlzKiBwcm9qZWN0aW5nXG4gICAgICogYnV0ICppc24ndCogZGlydHkgdG8ganVzdCBjaGVjayBpdHMgcGFyZW50IHRvIHNlZSBpZiAqYW55KiBhbmNlc3RvciBuZWVkc1xuICAgICAqIGNvcnJlY3RpbmcuXG4gICAgICovXG4gICAgaWYgKCFub2RlLmlzUHJvamVjdGluZygpKSB7XG4gICAgICAgIG5vZGUuaXNQcm9qZWN0aW9uRGlydHkgPSBub2RlLnBhcmVudC5pc1Byb2plY3Rpb25EaXJ0eTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUHJvcGFnYXRlIGlzU2hhcmVkUHJvamVjdGlvbkRpcnR5IGFuZCBpc1RyYW5zZm9ybURpcnR5XG4gICAgICogdGhyb3VnaG91dCB0aGUgd2hvbGUgdHJlZS4gQSBmdXR1cmUgcmV2aXNpb24gY2FuIHRha2UgYW5vdGhlciBsb29rIGF0XG4gICAgICogdGhpcyBidXQgZm9yIHNhZmV0eSB3ZSBzdGlsbCByZWNhbGN1YWx0ZSBzaGFyZWQgbm9kZXMuXG4gICAgICovXG4gICAgbm9kZS5pc1NoYXJlZFByb2plY3Rpb25EaXJ0eSB8fCAobm9kZS5pc1NoYXJlZFByb2plY3Rpb25EaXJ0eSA9IEJvb2xlYW4obm9kZS5pc1Byb2plY3Rpb25EaXJ0eSB8fFxuICAgICAgICBub2RlLnBhcmVudC5pc1Byb2plY3Rpb25EaXJ0eSB8fFxuICAgICAgICBub2RlLnBhcmVudC5pc1NoYXJlZFByb2plY3Rpb25EaXJ0eSkpO1xuICAgIG5vZGUuaXNUcmFuc2Zvcm1EaXJ0eSB8fCAobm9kZS5pc1RyYW5zZm9ybURpcnR5ID0gbm9kZS5wYXJlbnQuaXNUcmFuc2Zvcm1EaXJ0eSk7XG59XG5mdW5jdGlvbiBjbGVhbkRpcnR5Tm9kZXMobm9kZSkge1xuICAgIG5vZGUuaXNQcm9qZWN0aW9uRGlydHkgPVxuICAgICAgICBub2RlLmlzU2hhcmVkUHJvamVjdGlvbkRpcnR5ID1cbiAgICAgICAgICAgIG5vZGUuaXNUcmFuc2Zvcm1EaXJ0eSA9XG4gICAgICAgICAgICAgICAgZmFsc2U7XG59XG5mdW5jdGlvbiBjbGVhclNuYXBzaG90KG5vZGUpIHtcbiAgICBub2RlLmNsZWFyU25hcHNob3QoKTtcbn1cbmZ1bmN0aW9uIGNsZWFyTWVhc3VyZW1lbnRzKG5vZGUpIHtcbiAgICBub2RlLmNsZWFyTWVhc3VyZW1lbnRzKCk7XG59XG5mdW5jdGlvbiBjbGVhcklzTGF5b3V0RGlydHkobm9kZSkge1xuICAgIG5vZGUuaXNMYXlvdXREaXJ0eSA9IGZhbHNlO1xufVxuZnVuY3Rpb24gcmVzZXRUcmFuc2Zvcm1TdHlsZShub2RlKSB7XG4gICAgY29uc3QgeyB2aXN1YWxFbGVtZW50IH0gPSBub2RlLm9wdGlvbnM7XG4gICAgaWYgKHZpc3VhbEVsZW1lbnQgJiYgdmlzdWFsRWxlbWVudC5nZXRQcm9wcygpLm9uQmVmb3JlTGF5b3V0TWVhc3VyZSkge1xuICAgICAgICB2aXN1YWxFbGVtZW50Lm5vdGlmeShcIkJlZm9yZUxheW91dE1lYXN1cmVcIik7XG4gICAgfVxuICAgIG5vZGUucmVzZXRUcmFuc2Zvcm0oKTtcbn1cbmZ1bmN0aW9uIGZpbmlzaEFuaW1hdGlvbihub2RlKSB7XG4gICAgbm9kZS5maW5pc2hBbmltYXRpb24oKTtcbiAgICBub2RlLnRhcmdldERlbHRhID0gbm9kZS5yZWxhdGl2ZVRhcmdldCA9IG5vZGUudGFyZ2V0ID0gdW5kZWZpbmVkO1xuICAgIG5vZGUuaXNQcm9qZWN0aW9uRGlydHkgPSB0cnVlO1xufVxuZnVuY3Rpb24gcmVzb2x2ZVRhcmdldERlbHRhKG5vZGUpIHtcbiAgICBub2RlLnJlc29sdmVUYXJnZXREZWx0YSgpO1xufVxuZnVuY3Rpb24gY2FsY1Byb2plY3Rpb24obm9kZSkge1xuICAgIG5vZGUuY2FsY1Byb2plY3Rpb24oKTtcbn1cbmZ1bmN0aW9uIHJlc2V0U2tld0FuZFJvdGF0aW9uKG5vZGUpIHtcbiAgICBub2RlLnJlc2V0U2tld0FuZFJvdGF0aW9uKCk7XG59XG5mdW5jdGlvbiByZW1vdmVMZWFkU25hcHNob3RzKHN0YWNrKSB7XG4gICAgc3RhY2sucmVtb3ZlTGVhZFNuYXBzaG90KCk7XG59XG5mdW5jdGlvbiBtaXhBeGlzRGVsdGEob3V0cHV0LCBkZWx0YSwgcCkge1xuICAgIG91dHB1dC50cmFuc2xhdGUgPSBtaXhOdW1iZXIoZGVsdGEudHJhbnNsYXRlLCAwLCBwKTtcbiAgICBvdXRwdXQuc2NhbGUgPSBtaXhOdW1iZXIoZGVsdGEuc2NhbGUsIDEsIHApO1xuICAgIG91dHB1dC5vcmlnaW4gPSBkZWx0YS5vcmlnaW47XG4gICAgb3V0cHV0Lm9yaWdpblBvaW50ID0gZGVsdGEub3JpZ2luUG9pbnQ7XG59XG5mdW5jdGlvbiBtaXhBeGlzKG91dHB1dCwgZnJvbSwgdG8sIHApIHtcbiAgICBvdXRwdXQubWluID0gbWl4TnVtYmVyKGZyb20ubWluLCB0by5taW4sIHApO1xuICAgIG91dHB1dC5tYXggPSBtaXhOdW1iZXIoZnJvbS5tYXgsIHRvLm1heCwgcCk7XG59XG5mdW5jdGlvbiBtaXhCb3gob3V0cHV0LCBmcm9tLCB0bywgcCkge1xuICAgIG1peEF4aXMob3V0cHV0LngsIGZyb20ueCwgdG8ueCwgcCk7XG4gICAgbWl4QXhpcyhvdXRwdXQueSwgZnJvbS55LCB0by55LCBwKTtcbn1cbmZ1bmN0aW9uIGhhc09wYWNpdHlDcm9zc2ZhZGUobm9kZSkge1xuICAgIHJldHVybiAobm9kZS5hbmltYXRpb25WYWx1ZXMgJiYgbm9kZS5hbmltYXRpb25WYWx1ZXMub3BhY2l0eUV4aXQgIT09IHVuZGVmaW5lZCk7XG59XG5jb25zdCBkZWZhdWx0TGF5b3V0VHJhbnNpdGlvbiA9IHtcbiAgICBkdXJhdGlvbjogMC40NSxcbiAgICBlYXNlOiBbMC40LCAwLCAwLjEsIDFdLFxufTtcbmNvbnN0IHVzZXJBZ2VudENvbnRhaW5zID0gKHN0cmluZykgPT4gdHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgIG5hdmlnYXRvci51c2VyQWdlbnQgJiZcbiAgICBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc3RyaW5nKTtcbi8qKlxuICogTWVhc3VyZWQgYm91bmRpbmcgYm94ZXMgbXVzdCBiZSByb3VuZGVkIGluIFNhZmFyaSBhbmRcbiAqIGxlZnQgdW50b3VjaGVkIGluIENocm9tZSwgb3RoZXJ3aXNlIG5vbi1pbnRlZ2VyIGxheW91dHMgd2l0aGluIHNjYWxlZC11cCBlbGVtZW50c1xuICogY2FuIGFwcGVhciB0byBqdW1wLlxuICovXG5jb25zdCByb3VuZFBvaW50ID0gdXNlckFnZW50Q29udGFpbnMoXCJhcHBsZXdlYmtpdC9cIikgJiYgIXVzZXJBZ2VudENvbnRhaW5zKFwiY2hyb21lL1wiKVxuICAgID8gTWF0aC5yb3VuZFxuICAgIDogbm9vcDtcbmZ1bmN0aW9uIHJvdW5kQXhpcyhheGlzKSB7XG4gICAgLy8gUm91bmQgdG8gdGhlIG5lYXJlc3QgLjUgcGl4ZWxzIHRvIHN1cHBvcnQgc3VicGl4ZWwgbGF5b3V0c1xuICAgIGF4aXMubWluID0gcm91bmRQb2ludChheGlzLm1pbik7XG4gICAgYXhpcy5tYXggPSByb3VuZFBvaW50KGF4aXMubWF4KTtcbn1cbmZ1bmN0aW9uIHJvdW5kQm94KGJveCkge1xuICAgIHJvdW5kQXhpcyhib3gueCk7XG4gICAgcm91bmRBeGlzKGJveC55KTtcbn1cbmZ1bmN0aW9uIHNob3VsZEFuaW1hdGVQb3NpdGlvbk9ubHkoYW5pbWF0aW9uVHlwZSwgc25hcHNob3QsIGxheW91dCkge1xuICAgIHJldHVybiAoYW5pbWF0aW9uVHlwZSA9PT0gXCJwb3NpdGlvblwiIHx8XG4gICAgICAgIChhbmltYXRpb25UeXBlID09PSBcInByZXNlcnZlLWFzcGVjdFwiICYmXG4gICAgICAgICAgICAhaXNOZWFyKGFzcGVjdFJhdGlvKHNuYXBzaG90KSwgYXNwZWN0UmF0aW8obGF5b3V0KSwgMC4yKSkpO1xufVxuZnVuY3Rpb24gY2hlY2tOb2RlV2FzU2Nyb2xsUm9vdChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUgIT09IG5vZGUucm9vdCAmJiBub2RlLnNjcm9sbD8ud2FzUm9vdDtcbn1cblxuZXhwb3J0IHsgY2xlYW5EaXJ0eU5vZGVzLCBjcmVhdGVQcm9qZWN0aW9uTm9kZSwgbWl4QXhpcywgbWl4QXhpc0RlbHRhLCBtaXhCb3gsIHByb3BhZ2F0ZURpcnR5Tm9kZXMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNyZWF0ZS1wcm9qZWN0aW9uLW5vZGUubWpzLm1hcFxuIiwiaW1wb3J0IHsgYWRkRG9tRXZlbnQgfSBmcm9tICcuLi8uLi9ldmVudHMvYWRkLWRvbS1ldmVudC5tanMnO1xuaW1wb3J0IHsgY3JlYXRlUHJvamVjdGlvbk5vZGUgfSBmcm9tICcuL2NyZWF0ZS1wcm9qZWN0aW9uLW5vZGUubWpzJztcblxuY29uc3QgRG9jdW1lbnRQcm9qZWN0aW9uTm9kZSA9IGNyZWF0ZVByb2plY3Rpb25Ob2RlKHtcbiAgICBhdHRhY2hSZXNpemVMaXN0ZW5lcjogKHJlZiwgbm90aWZ5KSA9PiBhZGREb21FdmVudChyZWYsIFwicmVzaXplXCIsIG5vdGlmeSksXG4gICAgbWVhc3VyZVNjcm9sbDogKCkgPT4gKHtcbiAgICAgICAgeDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQgfHwgZG9jdW1lbnQuYm9keT8uc2Nyb2xsTGVmdCB8fCAwLFxuICAgICAgICB5OiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IGRvY3VtZW50LmJvZHk/LnNjcm9sbFRvcCB8fCAwLFxuICAgIH0pLFxuICAgIGNoZWNrSXNTY3JvbGxSb290OiAoKSA9PiB0cnVlLFxufSk7XG5cbmV4cG9ydCB7IERvY3VtZW50UHJvamVjdGlvbk5vZGUgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPURvY3VtZW50UHJvamVjdGlvbk5vZGUubWpzLm1hcFxuIiwiaW1wb3J0IHsgY3JlYXRlUHJvamVjdGlvbk5vZGUgfSBmcm9tICcuL2NyZWF0ZS1wcm9qZWN0aW9uLW5vZGUubWpzJztcbmltcG9ydCB7IERvY3VtZW50UHJvamVjdGlvbk5vZGUgfSBmcm9tICcuL0RvY3VtZW50UHJvamVjdGlvbk5vZGUubWpzJztcblxuY29uc3Qgcm9vdFByb2plY3Rpb25Ob2RlID0ge1xuICAgIGN1cnJlbnQ6IHVuZGVmaW5lZCxcbn07XG5jb25zdCBIVE1MUHJvamVjdGlvbk5vZGUgPSBjcmVhdGVQcm9qZWN0aW9uTm9kZSh7XG4gICAgbWVhc3VyZVNjcm9sbDogKGluc3RhbmNlKSA9PiAoe1xuICAgICAgICB4OiBpbnN0YW5jZS5zY3JvbGxMZWZ0LFxuICAgICAgICB5OiBpbnN0YW5jZS5zY3JvbGxUb3AsXG4gICAgfSksXG4gICAgZGVmYXVsdFBhcmVudDogKCkgPT4ge1xuICAgICAgICBpZiAoIXJvb3RQcm9qZWN0aW9uTm9kZS5jdXJyZW50KSB7XG4gICAgICAgICAgICBjb25zdCBkb2N1bWVudE5vZGUgPSBuZXcgRG9jdW1lbnRQcm9qZWN0aW9uTm9kZSh7fSk7XG4gICAgICAgICAgICBkb2N1bWVudE5vZGUubW91bnQod2luZG93KTtcbiAgICAgICAgICAgIGRvY3VtZW50Tm9kZS5zZXRPcHRpb25zKHsgbGF5b3V0U2Nyb2xsOiB0cnVlIH0pO1xuICAgICAgICAgICAgcm9vdFByb2plY3Rpb25Ob2RlLmN1cnJlbnQgPSBkb2N1bWVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvb3RQcm9qZWN0aW9uTm9kZS5jdXJyZW50O1xuICAgIH0sXG4gICAgcmVzZXRUcmFuc2Zvcm06IChpbnN0YW5jZSwgdmFsdWUpID0+IHtcbiAgICAgICAgaW5zdGFuY2Uuc3R5bGUudHJhbnNmb3JtID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDogXCJub25lXCI7XG4gICAgfSxcbiAgICBjaGVja0lzU2Nyb2xsUm9vdDogKGluc3RhbmNlKSA9PiBCb29sZWFuKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGluc3RhbmNlKS5wb3NpdGlvbiA9PT0gXCJmaXhlZFwiKSxcbn0pO1xuXG5leHBvcnQgeyBIVE1MUHJvamVjdGlvbk5vZGUsIHJvb3RQcm9qZWN0aW9uTm9kZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SFRNTFByb2plY3Rpb25Ob2RlLm1qcy5tYXBcbiIsImltcG9ydCB7IEdyb3VwQW5pbWF0aW9uIH0gZnJvbSAnLi4vYW5pbWF0aW9uL0dyb3VwQW5pbWF0aW9uLm1qcyc7XG5pbXBvcnQgeyBjb3B5Qm94SW50byB9IGZyb20gJy4uL3Byb2plY3Rpb24vZ2VvbWV0cnkvY29weS5tanMnO1xuaW1wb3J0IHsgY3JlYXRlQm94IH0gZnJvbSAnLi4vcHJvamVjdGlvbi9nZW9tZXRyeS9tb2RlbHMubWpzJztcbmltcG9ydCB7IEhUTUxQcm9qZWN0aW9uTm9kZSB9IGZyb20gJy4uL3Byb2plY3Rpb24vbm9kZS9IVE1MUHJvamVjdGlvbk5vZGUubWpzJztcbmltcG9ydCB7IEhUTUxWaXN1YWxFbGVtZW50IH0gZnJvbSAnLi4vcmVuZGVyL2h0bWwvSFRNTFZpc3VhbEVsZW1lbnQubWpzJztcbmltcG9ydCB7IHZpc3VhbEVsZW1lbnRTdG9yZSB9IGZyb20gJy4uL3JlbmRlci9zdG9yZS5tanMnO1xuaW1wb3J0IHsgcmVzb2x2ZUVsZW1lbnRzIH0gZnJvbSAnLi4vdXRpbHMvcmVzb2x2ZS1lbGVtZW50cy5tanMnO1xuaW1wb3J0IHsgZnJhbWUgfSBmcm9tICcuLi9mcmFtZWxvb3AvZnJhbWUubWpzJztcblxuY29uc3QgbGF5b3V0U2VsZWN0b3IgPSBcIltkYXRhLWxheW91dF0sIFtkYXRhLWxheW91dC1pZF1cIjtcbmNvbnN0IG5vb3AgPSAoKSA9PiB7IH07XG5mdW5jdGlvbiBzbmFwc2hvdEZyb21UYXJnZXQocHJvamVjdGlvbikge1xuICAgIGNvbnN0IHRhcmdldCA9IHByb2plY3Rpb24udGFyZ2V0V2l0aFRyYW5zZm9ybXMgfHwgcHJvamVjdGlvbi50YXJnZXQ7XG4gICAgaWYgKCF0YXJnZXQpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgY29uc3QgbWVhc3VyZWRCb3ggPSBjcmVhdGVCb3goKTtcbiAgICBjb25zdCBsYXlvdXRCb3ggPSBjcmVhdGVCb3goKTtcbiAgICBjb3B5Qm94SW50byhtZWFzdXJlZEJveCwgdGFyZ2V0KTtcbiAgICBjb3B5Qm94SW50byhsYXlvdXRCb3gsIHRhcmdldCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYW5pbWF0aW9uSWQ6IHByb2plY3Rpb24ucm9vdD8uYW5pbWF0aW9uSWQgPz8gMCxcbiAgICAgICAgbWVhc3VyZWRCb3gsXG4gICAgICAgIGxheW91dEJveCxcbiAgICAgICAgbGF0ZXN0VmFsdWVzOiBwcm9qZWN0aW9uLmFuaW1hdGlvblZhbHVlcyB8fCBwcm9qZWN0aW9uLmxhdGVzdFZhbHVlcyB8fCB7fSxcbiAgICAgICAgc291cmNlOiBwcm9qZWN0aW9uLmlkLFxuICAgIH07XG59XG5jbGFzcyBMYXlvdXRBbmltYXRpb25CdWlsZGVyIHtcbiAgICBjb25zdHJ1Y3RvcihzY29wZSwgdXBkYXRlRG9tLCBkZWZhdWx0T3B0aW9ucykge1xuICAgICAgICB0aGlzLnNoYXJlZFRyYW5zaXRpb25zID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLm5vdGlmeVJlYWR5ID0gbm9vcDtcbiAgICAgICAgdGhpcy5yZWplY3RSZWFkeSA9IG5vb3A7XG4gICAgICAgIHRoaXMuc2NvcGUgPSBzY29wZTtcbiAgICAgICAgdGhpcy51cGRhdGVEb20gPSB1cGRhdGVEb207XG4gICAgICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucztcbiAgICAgICAgdGhpcy5yZWFkeVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm5vdGlmeVJlYWR5ID0gcmVzb2x2ZTtcbiAgICAgICAgICAgIHRoaXMucmVqZWN0UmVhZHkgPSByZWplY3Q7XG4gICAgICAgIH0pO1xuICAgICAgICBmcmFtZS5wb3N0UmVuZGVyKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnQoKS50aGVuKHRoaXMubm90aWZ5UmVhZHkpLmNhdGNoKHRoaXMucmVqZWN0UmVhZHkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2hhcmVkKGlkLCB0cmFuc2l0aW9uKSB7XG4gICAgICAgIHRoaXMuc2hhcmVkVHJhbnNpdGlvbnMuc2V0KGlkLCB0cmFuc2l0aW9uKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHRoZW4ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlYWR5UHJvbWlzZS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgfVxuICAgIGFzeW5jIHN0YXJ0KCkge1xuICAgICAgICBjb25zdCBiZWZvcmVFbGVtZW50cyA9IGNvbGxlY3RMYXlvdXRFbGVtZW50cyh0aGlzLnNjb3BlKTtcbiAgICAgICAgY29uc3QgYmVmb3JlUmVjb3JkcyA9IHRoaXMuYnVpbGRSZWNvcmRzKGJlZm9yZUVsZW1lbnRzKTtcbiAgICAgICAgYmVmb3JlUmVjb3Jkcy5mb3JFYWNoKCh7IHByb2plY3Rpb24gfSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGFzQ3VycmVudEFuaW1hdGlvbiA9IEJvb2xlYW4ocHJvamVjdGlvbi5jdXJyZW50QW5pbWF0aW9uKTtcbiAgICAgICAgICAgIGNvbnN0IGlzU2hhcmVkTGF5b3V0ID0gQm9vbGVhbihwcm9qZWN0aW9uLm9wdGlvbnMubGF5b3V0SWQpO1xuICAgICAgICAgICAgaWYgKGhhc0N1cnJlbnRBbmltYXRpb24gJiYgaXNTaGFyZWRMYXlvdXQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzbmFwc2hvdCA9IHNuYXBzaG90RnJvbVRhcmdldChwcm9qZWN0aW9uKTtcbiAgICAgICAgICAgICAgICBpZiAoc25hcHNob3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbi5zbmFwc2hvdCA9IHNuYXBzaG90O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwcm9qZWN0aW9uLnNuYXBzaG90KSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb24uc25hcHNob3QgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocHJvamVjdGlvbi5zbmFwc2hvdCAmJlxuICAgICAgICAgICAgICAgIChwcm9qZWN0aW9uLmN1cnJlbnRBbmltYXRpb24gfHwgcHJvamVjdGlvbi5pc1Byb2plY3RpbmcoKSkpIHtcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uLnNuYXBzaG90ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJvamVjdGlvbi5pc1ByZXNlbnQgPSB0cnVlO1xuICAgICAgICAgICAgcHJvamVjdGlvbi53aWxsVXBkYXRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBhd2FpdCB0aGlzLnVwZGF0ZURvbSgpO1xuICAgICAgICBjb25zdCBhZnRlckVsZW1lbnRzID0gY29sbGVjdExheW91dEVsZW1lbnRzKHRoaXMuc2NvcGUpO1xuICAgICAgICBjb25zdCBhZnRlclJlY29yZHMgPSB0aGlzLmJ1aWxkUmVjb3JkcyhhZnRlckVsZW1lbnRzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVFeGl0aW5nRWxlbWVudHMoYmVmb3JlUmVjb3JkcywgYWZ0ZXJSZWNvcmRzKTtcbiAgICAgICAgYWZ0ZXJSZWNvcmRzLmZvckVhY2goKHsgcHJvamVjdGlvbiB9KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHByb2plY3Rpb24uaW5zdGFuY2U7XG4gICAgICAgICAgICBjb25zdCByZXN1bWVGcm9tSW5zdGFuY2UgPSBwcm9qZWN0aW9uLnJlc3VtZUZyb21cbiAgICAgICAgICAgICAgICA/Lmluc3RhbmNlO1xuICAgICAgICAgICAgaWYgKCFpbnN0YW5jZSB8fCAhcmVzdW1lRnJvbUluc3RhbmNlKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGlmICghKFwic3R5bGVcIiBpbiBpbnN0YW5jZSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFRyYW5zZm9ybSA9IGluc3RhbmNlLnN0eWxlLnRyYW5zZm9ybTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VtZUZyb21UcmFuc2Zvcm0gPSByZXN1bWVGcm9tSW5zdGFuY2Uuc3R5bGUudHJhbnNmb3JtO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRUcmFuc2Zvcm0gJiZcbiAgICAgICAgICAgICAgICByZXN1bWVGcm9tVHJhbnNmb3JtICYmXG4gICAgICAgICAgICAgICAgY3VycmVudFRyYW5zZm9ybSA9PT0gcmVzdW1lRnJvbVRyYW5zZm9ybSkge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlLnN0eWxlLnRyYW5zZm9ybSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2Uuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFmdGVyUmVjb3Jkcy5mb3JFYWNoKCh7IHByb2plY3Rpb24gfSkgPT4ge1xuICAgICAgICAgICAgcHJvamVjdGlvbi5pc1ByZXNlbnQgPSB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3Qgcm9vdCA9IGdldFByb2plY3Rpb25Sb290KGFmdGVyUmVjb3JkcywgYmVmb3JlUmVjb3Jkcyk7XG4gICAgICAgIHJvb3Q/LmRpZFVwZGF0ZSgpO1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgZnJhbWUucG9zdFJlbmRlcigoKSA9PiByZXNvbHZlKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgYW5pbWF0aW9ucyA9IGNvbGxlY3RBbmltYXRpb25zKGFmdGVyUmVjb3Jkcyk7XG4gICAgICAgIGNvbnN0IGFuaW1hdGlvbiA9IG5ldyBHcm91cEFuaW1hdGlvbihhbmltYXRpb25zKTtcbiAgICAgICAgcmV0dXJuIGFuaW1hdGlvbjtcbiAgICB9XG4gICAgYnVpbGRSZWNvcmRzKGVsZW1lbnRzKSB7XG4gICAgICAgIGNvbnN0IHJlY29yZHMgPSBbXTtcbiAgICAgICAgY29uc3QgcmVjb3JkTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudFJlY29yZCA9IGZpbmRQYXJlbnRSZWNvcmQoZWxlbWVudCwgcmVjb3JkTWFwLCB0aGlzLnNjb3BlKTtcbiAgICAgICAgICAgIGNvbnN0IHsgbGF5b3V0LCBsYXlvdXRJZCB9ID0gcmVhZExheW91dEF0dHJpYnV0ZXMoZWxlbWVudCk7XG4gICAgICAgICAgICBjb25zdCBvdmVycmlkZSA9IGxheW91dElkXG4gICAgICAgICAgICAgICAgPyB0aGlzLnNoYXJlZFRyYW5zaXRpb25zLmdldChsYXlvdXRJZClcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zaXRpb24gPSBvdmVycmlkZSB8fCB0aGlzLmRlZmF1bHRPcHRpb25zO1xuICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gZ2V0T3JDcmVhdGVSZWNvcmQoZWxlbWVudCwgcGFyZW50UmVjb3JkPy5wcm9qZWN0aW9uLCB7XG4gICAgICAgICAgICAgICAgbGF5b3V0LFxuICAgICAgICAgICAgICAgIGxheW91dElkLFxuICAgICAgICAgICAgICAgIGFuaW1hdGlvblR5cGU6IHR5cGVvZiBsYXlvdXQgPT09IFwic3RyaW5nXCIgPyBsYXlvdXQgOiBcImJvdGhcIixcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB0cmFuc2l0aW9uLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZWNvcmRNYXAuc2V0KGVsZW1lbnQsIHJlY29yZCk7XG4gICAgICAgICAgICByZWNvcmRzLnB1c2gocmVjb3JkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVjb3JkcztcbiAgICB9XG4gICAgaGFuZGxlRXhpdGluZ0VsZW1lbnRzKGJlZm9yZVJlY29yZHMsIGFmdGVyUmVjb3Jkcykge1xuICAgICAgICBjb25zdCBhZnRlckVsZW1lbnRzU2V0ID0gbmV3IFNldChhZnRlclJlY29yZHMubWFwKChyZWNvcmQpID0+IHJlY29yZC5lbGVtZW50KSk7XG4gICAgICAgIGJlZm9yZVJlY29yZHMuZm9yRWFjaCgocmVjb3JkKSA9PiB7XG4gICAgICAgICAgICBpZiAoYWZ0ZXJFbGVtZW50c1NldC5oYXMocmVjb3JkLmVsZW1lbnQpKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIC8vIEZvciBzaGFyZWQgbGF5b3V0IGVsZW1lbnRzLCByZWxlZ2F0ZSB0byBzZXQgdXAgcmVzdW1lRnJvbVxuICAgICAgICAgICAgLy8gc28gdGhlIHJlbWFpbmluZyBlbGVtZW50IGFuaW1hdGVzIGZyb20gdGhpcyBwb3NpdGlvblxuICAgICAgICAgICAgaWYgKHJlY29yZC5wcm9qZWN0aW9uLm9wdGlvbnMubGF5b3V0SWQpIHtcbiAgICAgICAgICAgICAgICByZWNvcmQucHJvamVjdGlvbi5pc1ByZXNlbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZWNvcmQucHJvamVjdGlvbi5yZWxlZ2F0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVjb3JkLnZpc3VhbEVsZW1lbnQudW5tb3VudCgpO1xuICAgICAgICAgICAgdmlzdWFsRWxlbWVudFN0b3JlLmRlbGV0ZShyZWNvcmQuZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBDbGVhciByZXN1bWVGcm9tIG9uIEVYSVNUSU5HIG5vZGVzIHRoYXQgcG9pbnQgdG8gdW5tb3VudGVkIHByb2plY3Rpb25zXG4gICAgICAgIC8vIFRoaXMgcHJldmVudHMgY3Jvc3NmYWRlIGFuaW1hdGlvbiB3aGVuIHRoZSBzb3VyY2UgZWxlbWVudCB3YXMgcmVtb3ZlZCBlbnRpcmVseVxuICAgICAgICAvLyBCdXQgcHJlc2VydmUgcmVzdW1lRnJvbSBmb3IgTkVXIG5vZGVzIHNvIHRoZXkgY2FuIGFuaW1hdGUgZnJvbSB0aGUgb2xkIHBvc2l0aW9uXG4gICAgICAgIC8vIEFsc28gcHJlc2VydmUgcmVzdW1lRnJvbSBmb3IgbGVhZCBub2RlcyB0aGF0IHdlcmUganVzdCBwcm9tb3RlZCB2aWEgcmVsZWdhdGVcbiAgICAgICAgY29uc3QgYmVmb3JlRWxlbWVudHNTZXQgPSBuZXcgU2V0KGJlZm9yZVJlY29yZHMubWFwKChyZWNvcmQpID0+IHJlY29yZC5lbGVtZW50KSk7XG4gICAgICAgIGFmdGVyUmVjb3Jkcy5mb3JFYWNoKCh7IGVsZW1lbnQsIHByb2plY3Rpb24gfSkgPT4ge1xuICAgICAgICAgICAgaWYgKGJlZm9yZUVsZW1lbnRzU2V0LmhhcyhlbGVtZW50KSAmJlxuICAgICAgICAgICAgICAgIHByb2plY3Rpb24ucmVzdW1lRnJvbSAmJlxuICAgICAgICAgICAgICAgICFwcm9qZWN0aW9uLnJlc3VtZUZyb20uaW5zdGFuY2UgJiZcbiAgICAgICAgICAgICAgICAhcHJvamVjdGlvbi5pc0xlYWQoKSkge1xuICAgICAgICAgICAgICAgIHByb2plY3Rpb24ucmVzdW1lRnJvbSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBwcm9qZWN0aW9uLnNuYXBzaG90ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5mdW5jdGlvbiBwYXJzZUFuaW1hdGVMYXlvdXRBcmdzKHNjb3BlT3JVcGRhdGVEb20sIHVwZGF0ZURvbU9yT3B0aW9ucywgb3B0aW9ucykge1xuICAgIC8vIGFuaW1hdGVMYXlvdXQodXBkYXRlRG9tKVxuICAgIGlmICh0eXBlb2Ygc2NvcGVPclVwZGF0ZURvbSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzY29wZTogZG9jdW1lbnQsXG4gICAgICAgICAgICB1cGRhdGVEb206IHNjb3BlT3JVcGRhdGVEb20sXG4gICAgICAgICAgICBkZWZhdWx0T3B0aW9uczogdXBkYXRlRG9tT3JPcHRpb25zLFxuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyBhbmltYXRlTGF5b3V0KHNjb3BlLCB1cGRhdGVEb20sIG9wdGlvbnM/KVxuICAgIGNvbnN0IGVsZW1lbnRzID0gcmVzb2x2ZUVsZW1lbnRzKHNjb3BlT3JVcGRhdGVEb20pO1xuICAgIGNvbnN0IHNjb3BlID0gZWxlbWVudHNbMF0gfHwgZG9jdW1lbnQ7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2NvcGUsXG4gICAgICAgIHVwZGF0ZURvbTogdXBkYXRlRG9tT3JPcHRpb25zLFxuICAgICAgICBkZWZhdWx0T3B0aW9uczogb3B0aW9ucyxcbiAgICB9O1xufVxuZnVuY3Rpb24gY29sbGVjdExheW91dEVsZW1lbnRzKHNjb3BlKSB7XG4gICAgY29uc3QgZWxlbWVudHMgPSBBcnJheS5mcm9tKHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwobGF5b3V0U2VsZWN0b3IpKTtcbiAgICBpZiAoc2NvcGUgaW5zdGFuY2VvZiBFbGVtZW50ICYmIHNjb3BlLm1hdGNoZXMobGF5b3V0U2VsZWN0b3IpKSB7XG4gICAgICAgIGlmICghZWxlbWVudHMuaW5jbHVkZXMoc2NvcGUpKSB7XG4gICAgICAgICAgICBlbGVtZW50cy51bnNoaWZ0KHNjb3BlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZWxlbWVudHM7XG59XG5mdW5jdGlvbiByZWFkTGF5b3V0QXR0cmlidXRlcyhlbGVtZW50KSB7XG4gICAgY29uc3QgbGF5b3V0SWQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtbGF5b3V0LWlkXCIpIHx8IHVuZGVmaW5lZDtcbiAgICBjb25zdCByYXdMYXlvdXQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtbGF5b3V0XCIpO1xuICAgIGxldCBsYXlvdXQ7XG4gICAgaWYgKHJhd0xheW91dCA9PT0gXCJcIiB8fCByYXdMYXlvdXQgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgIGxheW91dCA9IHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKHJhd0xheW91dCkge1xuICAgICAgICBsYXlvdXQgPSByYXdMYXlvdXQ7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGxheW91dCxcbiAgICAgICAgbGF5b3V0SWQsXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVZpc3VhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGxhdGVzdFZhbHVlczoge30sXG4gICAgICAgIHJlbmRlclN0YXRlOiB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHt9LFxuICAgICAgICAgICAgdHJhbnNmb3JtT3JpZ2luOiB7fSxcbiAgICAgICAgICAgIHN0eWxlOiB7fSxcbiAgICAgICAgICAgIHZhcnM6IHt9LFxuICAgICAgICB9LFxuICAgIH07XG59XG5mdW5jdGlvbiBnZXRPckNyZWF0ZVJlY29yZChlbGVtZW50LCBwYXJlbnRQcm9qZWN0aW9uLCBwcm9qZWN0aW9uT3B0aW9ucykge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gdmlzdWFsRWxlbWVudFN0b3JlLmdldChlbGVtZW50KTtcbiAgICBjb25zdCB2aXN1YWxFbGVtZW50ID0gZXhpc3RpbmcgPz9cbiAgICAgICAgbmV3IEhUTUxWaXN1YWxFbGVtZW50KHtcbiAgICAgICAgICAgIHByb3BzOiB7fSxcbiAgICAgICAgICAgIHByZXNlbmNlQ29udGV4dDogbnVsbCxcbiAgICAgICAgICAgIHZpc3VhbFN0YXRlOiBjcmVhdGVWaXN1YWxTdGF0ZSgpLFxuICAgICAgICB9LCB7IGFsbG93UHJvamVjdGlvbjogdHJ1ZSB9KTtcbiAgICBpZiAoIWV4aXN0aW5nIHx8ICF2aXN1YWxFbGVtZW50LnByb2plY3Rpb24pIHtcbiAgICAgICAgdmlzdWFsRWxlbWVudC5wcm9qZWN0aW9uID0gbmV3IEhUTUxQcm9qZWN0aW9uTm9kZSh2aXN1YWxFbGVtZW50LmxhdGVzdFZhbHVlcywgcGFyZW50UHJvamVjdGlvbik7XG4gICAgfVxuICAgIHZpc3VhbEVsZW1lbnQucHJvamVjdGlvbi5zZXRPcHRpb25zKHtcbiAgICAgICAgLi4ucHJvamVjdGlvbk9wdGlvbnMsXG4gICAgICAgIHZpc3VhbEVsZW1lbnQsXG4gICAgfSk7XG4gICAgaWYgKCF2aXN1YWxFbGVtZW50LmN1cnJlbnQpIHtcbiAgICAgICAgdmlzdWFsRWxlbWVudC5tb3VudChlbGVtZW50KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIXZpc3VhbEVsZW1lbnQucHJvamVjdGlvbi5pbnN0YW5jZSkge1xuICAgICAgICAvLyBNb3VudCBwcm9qZWN0aW9uIGlmIFZpc3VhbEVsZW1lbnQgaXMgYWxyZWFkeSBtb3VudGVkIGJ1dCBwcm9qZWN0aW9uIGlzbid0XG4gICAgICAgIC8vIFRoaXMgaGFwcGVucyB3aGVuIGFuaW1hdGUoKSB3YXMgY2FsbGVkIGJlZm9yZSBhbmltYXRlTGF5b3V0KClcbiAgICAgICAgdmlzdWFsRWxlbWVudC5wcm9qZWN0aW9uLm1vdW50KGVsZW1lbnQpO1xuICAgIH1cbiAgICBpZiAoIWV4aXN0aW5nKSB7XG4gICAgICAgIHZpc3VhbEVsZW1lbnRTdG9yZS5zZXQoZWxlbWVudCwgdmlzdWFsRWxlbWVudCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGVsZW1lbnQsXG4gICAgICAgIHZpc3VhbEVsZW1lbnQsXG4gICAgICAgIHByb2plY3Rpb246IHZpc3VhbEVsZW1lbnQucHJvamVjdGlvbixcbiAgICB9O1xufVxuZnVuY3Rpb24gZmluZFBhcmVudFJlY29yZChlbGVtZW50LCByZWNvcmRNYXAsIHNjb3BlKSB7XG4gICAgbGV0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IHJlY29yZE1hcC5nZXQocGFyZW50KTtcbiAgICAgICAgaWYgKHJlY29yZClcbiAgICAgICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgICAgIGlmIChwYXJlbnQgPT09IHNjb3BlKVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuZnVuY3Rpb24gZ2V0UHJvamVjdGlvblJvb3QoYWZ0ZXJSZWNvcmRzLCBiZWZvcmVSZWNvcmRzKSB7XG4gICAgY29uc3QgcmVjb3JkID0gYWZ0ZXJSZWNvcmRzWzBdIHx8IGJlZm9yZVJlY29yZHNbMF07XG4gICAgcmV0dXJuIHJlY29yZD8ucHJvamVjdGlvbi5yb290O1xufVxuZnVuY3Rpb24gY29sbGVjdEFuaW1hdGlvbnMoYWZ0ZXJSZWNvcmRzKSB7XG4gICAgY29uc3QgYW5pbWF0aW9ucyA9IG5ldyBTZXQoKTtcbiAgICBhZnRlclJlY29yZHMuZm9yRWFjaCgocmVjb3JkKSA9PiB7XG4gICAgICAgIGNvbnN0IGFuaW1hdGlvbiA9IHJlY29yZC5wcm9qZWN0aW9uLmN1cnJlbnRBbmltYXRpb247XG4gICAgICAgIGlmIChhbmltYXRpb24pXG4gICAgICAgICAgICBhbmltYXRpb25zLmFkZChhbmltYXRpb24pO1xuICAgIH0pO1xuICAgIHJldHVybiBBcnJheS5mcm9tKGFuaW1hdGlvbnMpO1xufVxuXG5leHBvcnQgeyBMYXlvdXRBbmltYXRpb25CdWlsZGVyLCBwYXJzZUFuaW1hdGVMYXlvdXRBcmdzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1MYXlvdXRBbmltYXRpb25CdWlsZGVyLm1qcy5tYXBcbiIsImltcG9ydCB7IHBhcnNlQW5pbWF0ZUxheW91dEFyZ3MsIExheW91dEFuaW1hdGlvbkJ1aWxkZXIgfSBmcm9tICdtb3Rpb24nO1xuXG5mdW5jdGlvbiB1bnN0YWJsZV9hbmltYXRlTGF5b3V0KHNjb3BlT3JVcGRhdGVEb20sIHVwZGF0ZURvbU9yT3B0aW9ucywgb3B0aW9ucykge1xuICAgIGNvbnN0IHsgc2NvcGUsIHVwZGF0ZURvbSwgZGVmYXVsdE9wdGlvbnMgfSA9IHBhcnNlQW5pbWF0ZUxheW91dEFyZ3Moc2NvcGVPclVwZGF0ZURvbSwgdXBkYXRlRG9tT3JPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gbmV3IExheW91dEFuaW1hdGlvbkJ1aWxkZXIoc2NvcGUsIHVwZGF0ZURvbSwgZGVmYXVsdE9wdGlvbnMpO1xufVxuXG5leHBvcnQgeyB1bnN0YWJsZV9hbmltYXRlTGF5b3V0IH07XG4iXSwieF9nb29nbGVfaWdub3JlTGlzdCI6WzAsMSwyLDMsNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTUsMTYsMTcsMTgsMTksMjAsMjEsMjIsMjMsMjQsMjUsMjYsMjcsMjgsMjksMzAsMzEsMzIsMzMsMzQsMzUsMzYsMzcsMzgsMzksNDAsNDEsNDIsNDMsNDQsNDUsNDYsNDcsNDgsNDksNTAsNTEsNTIsNTMsNTQsNTUsNTYsNTcsNTgsNTksNjAsNjEsNjIsNjMsNjQsNjUsNjYsNjcsNjgsNjksNzAsNzEsNzIsNzMsNzQsNzUsNzYsNzcsNzgsNzksODAsODEsODIsODMsODQsODUsODYsODcsODgsODksOTAsOTEsOTIsOTMsOTQsOTUsOTYsOTcsOTgsOTksMTAwLDEwMSwxMDIsMTAzLDEwNCwxMDUsMTA2LDEwNywxMDgsMTA5LDExMCwxMTEsMTEyLDExMywxMTQsMTE1LDExNiwxMTcsMTE4LDExOSwxMjAsMTIxLDEyMiwxMjMsMTI0LDEyNSwxMjYsMTI3LDEyOCwxMjksMTMwLDEzMSwxMzIsMTMzLDEzNCwxMzUsMTM2LDEzNywxMzgsMTM5LDE0MCwxNDEsMTQyLDE0MywxNDQsMTQ1LDE0NiwxNDcsMTQ4LDE0OSwxNTAsMTUxLDE1MiwxNTMsMTU0LDE1NSwxNTYsMTU3LDE1OCwxNTksMTYwLDE2MSwxNjIsMTYzLDE2NCwxNjUsMTY2LDE2NywxNjgsMTY5LDE3MCwxNzEsMTcyLDE3M10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxTQUFTLGNBQWMsS0FBSyxNQUFNO0NBQzlCLElBQUksSUFBSSxRQUFRLElBQUksTUFBTSxJQUN0QixJQUFJLEtBQUssSUFBSTtBQUNyQjtBQUNBLFNBQVMsV0FBVyxLQUFLLE1BQU07Q0FDM0IsTUFBTSxRQUFRLElBQUksUUFBUSxJQUFJO0NBQzlCLElBQUksUUFBUSxJQUNSLElBQUksT0FBTyxPQUFPLENBQUM7QUFDM0I7Ozs7QUNSQSxNQUFNLFNBQVMsS0FBSyxLQUFLLE1BQU07Q0FDM0IsSUFBSSxJQUFJLEtBQ0osT0FBTztDQUNYLElBQUksSUFBSSxLQUNKLE9BQU87Q0FDWCxPQUFPO0FBQ1g7Ozs7QUNOQSxTQUFTLG1CQUFtQixTQUFTLFdBQVc7Q0FDNUMsT0FBTyxZQUNELEdBQUcsUUFBUSx5RkFBeUYsY0FDcEc7QUFDVjs7OztBQ0ZBLElBQUksZ0JBQWdCLENBQUU7QUFDdEIsSUFBSSxrQkFBa0IsQ0FBRTtBQUN4QixJQUFJLE9BQU8sWUFBWSxlQUNuQixNQUF3QztDQUN4QyxXQUFXLE9BQU8sU0FBUyxjQUFjO0VBQ3JDLElBQUksQ0FBQyxTQUFTLE9BQU8sWUFBWSxhQUM3QixRQUFRLEtBQUssbUJBQW1CLFNBQVMsU0FBUyxD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