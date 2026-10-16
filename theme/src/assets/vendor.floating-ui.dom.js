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
//#region ../node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
/**
* Custom positioning reference element.
* @see https://floating-ui.com/docs/virtual-elements
*/
const sides = [
	"top",
	"right",
	"bottom",
	"left"
];
const alignments = ["start", "end"];
const placements = /*#__PURE__*/ sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = (v) => ({
	x: v,
	y: v
});
const oppositeSideMap = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function clamp(start, value, end) {
	return max(start, min(value, end));
}
function evaluate(value, param) {
	return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
	return placement.split("-")[0];
}
function getAlignment(placement) {
	return placement.split("-")[1];
}
function getOppositeAxis(axis) {
	return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
	return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
	const firstChar = placement[0];
	return firstChar === "t" || firstChar === "b" ? "y" : "x";
}
function getAlignmentAxis(placement) {
	return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
	if (rtl === void 0) rtl = false;
	const alignment = getAlignment(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const length = getAxisLength(alignmentAxis);
	let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
	if (rects.reference[length] > rects.floating[length]) mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
	return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
	const oppositePlacement = getOppositePlacement(placement);
	return [
		getOppositeAlignmentPlacement(placement),
		oppositePlacement,
		getOppositeAlignmentPlacement(oppositePlacement)
	];
}
function getOppositeAlignmentPlacement(placement) {
	return placement.includes("start") ? placement.replace("start", "end") : placement.replace("end", "start");
}
const lrPlacement = ["left", "right"];
const rlPlacement = ["right", "left"];
const tbPlacement = ["top", "bottom"];
const btPlacement = ["bottom", "top"];
function getSideList(side, isStart, rtl) {
	switch (side) {
		case "top":
		case "bottom":
			if (rtl) return isStart ? rlPlacement : lrPlacement;
			return isStart ? lrPlacement : rlPlacement;
		case "left":
		case "right": return isStart ? tbPlacement : btPlacement;
		default: return [];
	}
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
	const alignment = getAlignment(placement);
	let list = getSideList(getSide(placement), direction === "start", rtl);
	if (alignment) {
		list = list.map((side) => side + "-" + alignment);
		if (flipAlignment) list = list.concat(list.map(getOppositeAlignmentPlacement));
	}
	return list;
}
function getOppositePlacement(placement) {
	const side = getSide(placement);
	return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
	return {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		...padding
	};
}
function getPaddingObject(padding) {
	return typeof padding !== "number" ? expandPaddingObject(padding) : {
		top: padding,
		right: padding,
		bottom: padding,
		left: padding
	};
}
function rectToClientRect(rect) {
	const { x, y, width, height } = rect;
	return {
		width,
		height,
		top: y,
		left: x,
		right: x + width,
		bottom: y + height,
		x,
		y
	};
}

//#endregion
//#region ../node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function computeCoordsFromPlacement(_ref, placement, rtl) {
	let { reference, floating } = _ref;
	const sideAxis = getSideAxis(placement);
	const alignmentAxis = getAlignmentAxis(placement);
	const alignLength = getAxisLength(alignmentAxis);
	const side = getSide(placement);
	const isVertical = sideAxis === "y";
	const commonX = reference.x + reference.width / 2 - floating.width / 2;
	const commonY = reference.y + reference.height / 2 - floating.height / 2;
	const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
	let coords;
	switch (side) {
		case "top":
			coords = {
				x: commonX,
				y: reference.y - floating.height
			};
			break;
		case "bottom":
			coords = {
				x: commonX,
				y: reference.y + reference.height
			};
			break;
		case "right":
			coords = {
				x: reference.x + reference.width,
				y: commonY
			};
			break;
		case "left":
			coords = {
				x: reference.x - floating.width,
				y: commonY
			};
			break;
		default: coords = {
			x: reference.x,
			y: reference.y
		};
	}
	switch (getAlignment(placement)) {
		case "start":
			coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
			break;
		case "end": coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
	}
	return coords;
}
/**
* Resolves with an object of overflow side offsets that determine how much the
* element is overflowing a given clipping boundary on each side.
* - positive = overflowing the boundary by that number of pixels
* - negative = how many pixels left before it will overflow
* - 0 = lies flush with the boundary
* @see https://floating-ui.com/docs/detectOverflow
*/
async function detectOverflow$1(state, options) {
	var _await$platform$isEle;
	if (options === void 0) options = {};
	const { x, y, platform, rects, elements, strategy } = state;
	const { boundary = "clippingAncestors", rootBoundary = "viewport", elementContext = "floating", altBoundary = false, padding = 0 } = evaluate(options, state);
	const paddingObject = getPaddingObject(padding);
	const element = elements[altBoundary ? elementContext === "floating" ? "reference" : "floating" : elementContext];
	const clippingClientRect = rectToClientRect(await platform.getClippingRect({
		element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating)),
		boundary,
		rootBoundary,
		strategy
	}));
	const rect = elementContext === "floating" ? {
		x,
		y,
		width: rects.floating.width,
		height: rects.floating.height
	} : rects.reference;
	const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
	const offsetScale = await (platform.isElement == null ? void 0 : platform.isElement(offsetParent)) ? await (platform.getScale == null ? void 0 : platform.getScale(offsetParent)) || {
		x: 1,
		y: 1
	} : {
		x: 1,
		y: 1
	};
	const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements,
		rect,
		offsetParent,
		strategy
	}) : rect);
	return {
		top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
		bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
		left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
		right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
	};
}
const MAX_RESET_COUNT = 50;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*
* This export does not have any `platform` interface logic. You will need to
* write one for the platform you are using Floating UI with.
*/
const computePosition$1 = async (reference, floating, config) => {
	const { placement = "bottom", strategy = "absolute", middleware = [], platform } = config;
	const platformWithDetectOverflow = platform.detectOverflow ? platform : {
		...platform,
		detectOverflow: detectOverflow$1
	};
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
	let rects = await platform.getElementRects({
		reference,
		floating,
		strategy
	});
	let { x, y } = computeCoordsFromPlacement(rects, placement, rtl);
	let statefulPlacement = placement;
	let resetCount = 0;
	const middlewareData = {};
	for (let i = 0; i < middleware.length; i++) {
		const currentMiddleware = middleware[i];
		if (!currentMiddleware) continue;
		const { name, fn } = currentMiddleware;
		const { x: nextX, y: nextY, data, reset } = await fn({
			x,
			y,
			initialPlacement: placement,
			placement: statefulPlacement,
			strategy,
			middlewareData,
			rects,
			platform: platformWithDetectOverflow,
			elements: {
				reference,
				floating
			}
		});
		x = nextX != null ? nextX : x;
		y = nextY != null ? nextY : y;
		middlewareData[name] = {
			...middlewareData[name],
			...data
		};
		if (reset && resetCount < MAX_RESET_COUNT) {
			resetCount++;
			if (typeof reset === "object") {
				if (reset.placement) statefulPlacement = reset.placement;
				if (reset.rects) rects = reset.rects === true ? await platform.getElementRects({
					reference,
					floating,
					strategy
				}) : reset.rects;
				({x, y} = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
			}
			i = -1;
		}
	}
	return {
		x,
		y,
		placement: statefulPlacement,
		strategy,
		middlewareData
	};
};
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* @see https://floating-ui.com/docs/arrow
*/
const arrow$1 = (options) => ({
	name: "arrow",
	options,
	async fn(state) {
		const { x, y, placement, rects, platform, elements, middlewareData } = state;
		const { element, padding = 0 } = evaluate(options, state) || {};
		if (element == null) return {};
		const paddingObject = getPaddingObject(padding);
		const coords = {
			x,
			y
		};
		const axis = getAlignmentAxis(placement);
		const length = getAxisLength(axis);
		const arrowDimensions = await platform.getDimensions(element);
		const isYAxis = axis === "y";
		const minProp = isYAxis ? "top" : "left";
		const maxProp = isYAxis ? "bottom" : "right";
		const clientProp = isYAxis ? "clientHeight" : "clientWidth";
		const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
		const startDiff = coords[axis] - rects.reference[axis];
		const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
		let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
		if (!clientSize || !await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent))) clientSize = elements.floating[clientProp] || rects.floating[length];
		const centerToReference = endDiff / 2 - startDiff / 2;
		const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
		const minPadding = min(paddingObject[minProp], largestPossiblePadding);
		const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
		const min$1 = minPadding;
		const max = clientSize - arrowDimensions[length] - maxPadding;
		const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
		const offset = clamp(min$1, center, max);
		const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
		const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
		return {
			[axis]: coords[axis] + alignmentOffset,
			data: {
				[axis]: offset,
				centerOffset: center - offset - alignmentOffset,
				...shouldAddOffset && { alignmentOffset }
			},
			reset: shouldAddOffset
		};
	}
});
function getPlacementList(alignment, autoAlignment, allowedPlacements) {
	return (alignment ? [...allowedPlacements.filter((placement) => getAlignment(placement) === alignment), ...allowedPlacements.filter((placement) => getAlignment(placement) !== alignment)] : allowedPlacements.filter((placement) => getSide(placement) === placement)).filter((placement) => {
		if (alignment) return getAlignment(placement) === alignment || (autoAlignment ? getOppositeAlignmentPlacement(placement) !== placement : false);
		return true;
	});
}
/**
* Optimizes the visibility of the floating element by choosing the placement
* that has the most space available automatically, without needing to specify a
* preferred placement. Alternative to `flip`.
* @see https://floating-ui.com/docs/autoPlacement
*/
const autoPlacement$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "autoPlacement",
		options,
		async fn(state) {
			var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
			const { rects, middlewareData, placement, platform, elements } = state;
			const { crossAxis = false, alignment, allowedPlacements = placements, autoAlignment = true, ...detectOverflowOptions } = evaluate(options, state);
			const placements$1 = alignment !== void 0 || allowedPlacements === placements ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0;
			const currentPlacement = placements$1[currentIndex];
			if (currentPlacement == null) return {};
			const alignmentSides = getAlignmentSides(currentPlacement, rects, await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)));
			if (placement !== currentPlacement) return { reset: { placement: placements$1[0] } };
			const currentOverflows = [
				overflow[getSide(currentPlacement)],
				overflow[alignmentSides[0]],
				overflow[alignmentSides[1]]
			];
			const allOverflows = [...((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || [], {
				placement: currentPlacement,
				overflows: currentOverflows
			}];
			const nextPlacement = placements$1[currentIndex + 1];
			if (nextPlacement) return {
				data: {
					index: currentIndex + 1,
					overflows: allOverflows
				},
				reset: { placement: nextPlacement }
			};
			const placementsSortedByMostSpace = allOverflows.map((d) => {
				const alignment = getAlignment(d.placement);
				return [
					d.placement,
					alignment && crossAxis ? d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0) : d.overflows[0],
					d.overflows
				];
			}).sort((a, b) => a[1] - b[1]);
			const resetPlacement = ((_placementsThatFitOnE = placementsSortedByMostSpace.filter((d) => d[2].slice(0, getAlignment(d[0]) ? 2 : 3).every((v) => v <= 0))[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
			if (resetPlacement !== placement) return {
				data: {
					index: currentIndex + 1,
					overflows: allOverflows
				},
				reset: { placement: resetPlacement }
			};
			return {};
		}
	};
};
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
const flip$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "flip",
		options,
		async fn(state) {
			var _middlewareData$arrow, _middlewareData$flip;
			const { placement, middlewareData, rects, initialPlacement, platform, elements } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true, fallbackPlacements: specifiedFallbackPlacements, fallbackStrategy = "bestFit", fallbackAxisSideDirection = "none", flipAlignment = true, ...detectOverflowOptions } = evaluate(options, state);
			if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			const side = getSide(placement);
			const initialSideAxis = getSideAxis(initialPlacement);
			const isBasePlacement = getSide(initialPlacement) === initialPlacement;
			const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
			const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
			const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
			if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
			const placements = [initialPlacement, ...fallbackPlacements];
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const overflows = [];
			let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
			if (checkMainAxis) overflows.push(overflow[side]);
			if (checkCrossAxis) {
				const sides = getAlignmentSides(placement, rects, rtl);
				overflows.push(overflow[sides[0]], overflow[sides[1]]);
			}
			overflowsData = [...overflowsData, {
				placement,
				overflows
			}];
			if (!overflows.every((side) => side <= 0)) {
				var _middlewareData$flip2, _overflowsData$filter;
				const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
				const nextPlacement = placements[nextIndex];
				if (nextPlacement) {
					if (!(checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false) || overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) return {
						data: {
							index: nextIndex,
							overflows: overflowsData
						},
						reset: { placement: nextPlacement }
					};
				}
				let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
				if (!resetPlacement) switch (fallbackStrategy) {
					case "bestFit": {
						var _overflowsData$filter2;
						const placement = (_overflowsData$filter2 = overflowsData.filter((d) => {
							if (hasFallbackAxisSideDirection) {
								const currentSideAxis = getSideAxis(d.placement);
								return currentSideAxis === initialSideAxis || currentSideAxis === "y";
							}
							return true;
						}).map((d) => [d.placement, d.overflows.filter((overflow) => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
						if (placement) resetPlacement = placement;
						break;
					}
					case "initialPlacement": resetPlacement = initialPlacement;
				}
				if (placement !== resetPlacement) return { reset: { placement: resetPlacement } };
			}
			return {};
		}
	};
};
function getSideOffsets(overflow, rect) {
	return {
		top: overflow.top - rect.height,
		right: overflow.right - rect.width,
		bottom: overflow.bottom - rect.height,
		left: overflow.left - rect.width
	};
}
function isAnySideFullyClipped(overflow) {
	return sides.some((side) => overflow[side] >= 0);
}
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
const hide$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "hide",
		options,
		async fn(state) {
			const { rects, platform } = state;
			const { strategy = "referenceHidden", ...detectOverflowOptions } = evaluate(options, state);
			switch (strategy) {
				case "referenceHidden": {
					const offsets = getSideOffsets(await platform.detectOverflow(state, {
						...detectOverflowOptions,
						elementContext: "reference"
					}), rects.reference);
					return { data: {
						referenceHiddenOffsets: offsets,
						referenceHidden: isAnySideFullyClipped(offsets)
					} };
				}
				case "escaped": {
					const offsets = getSideOffsets(await platform.detectOverflow(state, {
						...detectOverflowOptions,
						altBoundary: true
					}), rects.floating);
					return { data: {
						escapedOffsets: offsets,
						escaped: isAnySideFullyClipped(offsets)
					} };
				}
				default: return {};
			}
		}
	};
};
function getBoundingRect(rects) {
	const minX = min(...rects.map((rect) => rect.left));
	const minY = min(...rects.map((rect) => rect.top));
	const maxX = max(...rects.map((rect) => rect.right));
	const maxY = max(...rects.map((rect) => rect.bottom));
	return {
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY
	};
}
function getRectsByLine(rects) {
	const sortedRects = rects.slice().sort((a, b) => a.y - b.y);
	const groups = [];
	let prevRect = null;
	for (let i = 0; i < sortedRects.length; i++) {
		const rect = sortedRects[i];
		if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) groups.push([rect]);
		else groups[groups.length - 1].push(rect);
		prevRect = rect;
	}
	return groups.map((rect) => rectToClientRect(getBoundingRect(rect)));
}
/**
* Provides improved positioning for inline reference elements that can span
* over multiple lines, such as hyperlinks or range selections.
* @see https://floating-ui.com/docs/inline
*/
const inline$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "inline",
		options,
		async fn(state) {
			const { placement, elements, rects, platform, strategy } = state;
			const { padding = 2, x, y } = evaluate(options, state);
			const nativeClientRects = Array.from(await (platform.getClientRects == null ? void 0 : platform.getClientRects(elements.reference)) || []);
			const clientRects = getRectsByLine(nativeClientRects);
			const fallback = rectToClientRect(getBoundingRect(nativeClientRects));
			const paddingObject = getPaddingObject(padding);
			function getBoundingClientRect() {
				if (clientRects.length === 2 && clientRects[0].left > clientRects[1].right && x != null && y != null) return clientRects.find((rect) => x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom) || fallback;
				if (clientRects.length >= 2) {
					if (getSideAxis(placement) === "y") {
						const firstRect = clientRects[0];
						const lastRect = clientRects[clientRects.length - 1];
						const isTop = getSide(placement) === "top";
						const top = firstRect.top;
						const bottom = lastRect.bottom;
						const left = isTop ? firstRect.left : lastRect.left;
						const right = isTop ? firstRect.right : lastRect.right;
						return {
							top,
							bottom,
							left,
							right,
							width: right - left,
							height: bottom - top,
							x: left,
							y: top
						};
					}
					const isLeftSide = getSide(placement) === "left";
					const maxRight = max(...clientRects.map((rect) => rect.right));
					const minLeft = min(...clientRects.map((rect) => rect.left));
					const measureRects = clientRects.filter((rect) => isLeftSide ? rect.left === minLeft : rect.right === maxRight);
					const top = measureRects[0].top;
					const bottom = measureRects[measureRects.length - 1].bottom;
					const left = minLeft;
					const right = maxRight;
					return {
						top,
						bottom,
						left,
						right,
						width: right - left,
						height: bottom - top,
						x: left,
						y: top
					};
				}
				return fallback;
			}
			const resetRects = await platform.getElementRects({
				reference: { getBoundingClientRect },
				floating: elements.floating,
				strategy
			});
			if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) return { reset: { rects: resetRects } };
			return {};
		}
	};
};
const originSides = /*#__PURE__*/ new Set(["left", "top"]);
async function convertValueToCoords(state, options) {
	const { placement, platform, elements } = state;
	const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
	const side = getSide(placement);
	const alignment = getAlignment(placement);
	const isVertical = getSideAxis(placement) === "y";
	const mainAxisMulti = originSides.has(side) ? -1 : 1;
	const crossAxisMulti = rtl && isVertical ? -1 : 1;
	const rawValue = evaluate(options, state);
	let { mainAxis, crossAxis, alignmentAxis } = typeof rawValue === "number" ? {
		mainAxis: rawValue,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: rawValue.mainAxis || 0,
		crossAxis: rawValue.crossAxis || 0,
		alignmentAxis: rawValue.alignmentAxis
	};
	if (alignment && typeof alignmentAxis === "number") crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
	return isVertical ? {
		x: crossAxis * crossAxisMulti,
		y: mainAxis * mainAxisMulti
	} : {
		x: mainAxis * mainAxisMulti,
		y: crossAxis * crossAxisMulti
	};
}
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
const offset$1 = function(options) {
	if (options === void 0) options = 0;
	return {
		name: "offset",
		options,
		async fn(state) {
			var _middlewareData$offse, _middlewareData$arrow;
			const { x, y, placement, middlewareData } = state;
			const diffCoords = await convertValueToCoords(state, options);
			if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) return {};
			return {
				x: x + diffCoords.x,
				y: y + diffCoords.y,
				data: {
					...diffCoords,
					placement
				}
			};
		}
	};
};
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
const shift$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "shift",
		options,
		async fn(state) {
			const { x, y, placement, platform } = state;
			const { mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = false, limiter = { fn: (_ref) => {
				let { x, y } = _ref;
				return {
					x,
					y
				};
			} }, ...detectOverflowOptions } = evaluate(options, state);
			const coords = {
				x,
				y
			};
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const crossAxis = getSideAxis(getSide(placement));
			const mainAxis = getOppositeAxis(crossAxis);
			let mainAxisCoord = coords[mainAxis];
			let crossAxisCoord = coords[crossAxis];
			if (checkMainAxis) {
				const minSide = mainAxis === "y" ? "top" : "left";
				const maxSide = mainAxis === "y" ? "bottom" : "right";
				const min = mainAxisCoord + overflow[minSide];
				const max = mainAxisCoord - overflow[maxSide];
				mainAxisCoord = clamp(min, mainAxisCoord, max);
			}
			if (checkCrossAxis) {
				const minSide = crossAxis === "y" ? "top" : "left";
				const maxSide = crossAxis === "y" ? "bottom" : "right";
				const min = crossAxisCoord + overflow[minSide];
				const max = crossAxisCoord - overflow[maxSide];
				crossAxisCoord = clamp(min, crossAxisCoord, max);
			}
			const limitedCoords = limiter.fn({
				...state,
				[mainAxis]: mainAxisCoord,
				[crossAxis]: crossAxisCoord
			});
			return {
				...limitedCoords,
				data: {
					x: limitedCoords.x - x,
					y: limitedCoords.y - y,
					enabled: {
						[mainAxis]: checkMainAxis,
						[crossAxis]: checkCrossAxis
					}
				}
			};
		}
	};
};
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
const limitShift$1 = function(options) {
	if (options === void 0) options = {};
	return {
		options,
		fn(state) {
			const { x, y, placement, rects, middlewareData } = state;
			const { offset = 0, mainAxis: checkMainAxis = true, crossAxis: checkCrossAxis = true } = evaluate(options, state);
			const coords = {
				x,
				y
			};
			const crossAxis = getSideAxis(placement);
			const mainAxis = getOppositeAxis(crossAxis);
			let mainAxisCoord = coords[mainAxis];
			let crossAxisCoord = coords[crossAxis];
			const rawOffset = evaluate(offset, state);
			const computedOffset = typeof rawOffset === "number" ? {
				mainAxis: rawOffset,
				crossAxis: 0
			} : {
				mainAxis: 0,
				crossAxis: 0,
				...rawOffset
			};
			if (checkMainAxis) {
				const len = mainAxis === "y" ? "height" : "width";
				const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
				const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
				if (mainAxisCoord < limitMin) mainAxisCoord = limitMin;
				else if (mainAxisCoord > limitMax) mainAxisCoord = limitMax;
			}
			if (checkCrossAxis) {
				var _middlewareData$offse, _middlewareData$offse2;
				const len = mainAxis === "y" ? "width" : "height";
				const isOriginSide = originSides.has(getSide(placement));
				const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
				const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
				if (crossAxisCoord < limitMin) crossAxisCoord = limitMin;
				else if (crossAxisCoord > limitMax) crossAxisCoord = limitMax;
			}
			return {
				[mainAxis]: mainAxisCoord,
				[crossAxis]: crossAxisCoord
			};
		}
	};
};
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
const size$1 = function(options) {
	if (options === void 0) options = {};
	return {
		name: "size",
		options,
		async fn(state) {
			var _state$middlewareData, _state$middlewareData2;
			const { placement, rects, platform, elements } = state;
			const { apply = () => {}, ...detectOverflowOptions } = evaluate(options, state);
			const overflow = await platform.detectOverflow(state, detectOverflowOptions);
			const side = getSide(placement);
			const alignment = getAlignment(placement);
			const isYAxis = getSideAxis(placement) === "y";
			const { width, height } = rects.floating;
			let heightSide;
			let widthSide;
			if (side === "top" || side === "bottom") {
				heightSide = side;
				widthSide = alignment === (await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
			} else {
				widthSide = side;
				heightSide = alignment === "end" ? "top" : "bottom";
			}
			const maximumClippingHeight = height - overflow.top - overflow.bottom;
			const maximumClippingWidth = width - overflow.left - overflow.right;
			const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
			const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
			const noShift = !state.middlewareData.shift;
			let availableHeight = overflowAvailableHeight;
			let availableWidth = overflowAvailableWidth;
			if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) availableWidth = maximumClippingWidth;
			if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) availableHeight = maximumClippingHeight;
			if (noShift && !alignment) {
				const xMin = max(overflow.left, 0);
				const xMax = max(overflow.right, 0);
				const yMin = max(overflow.top, 0);
				const yMax = max(overflow.bottom, 0);
				if (isYAxis) availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
				else availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
			}
			await apply({
				...state,
				availableWidth,
				availableHeight
			});
			const nextDimensions = await platform.getDimensions(elements.floating);
			if (width !== nextDimensions.width || height !== nextDimensions.height) return { reset: { rects: true } };
			return {};
		}
	};
};

//#endregion
//#region ../node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function hasWindow() {
	return typeof window !== "undefined";
}
function getNodeName(node) {
	if (isNode(node)) return (node.nodeName || "").toLowerCase();
	return "#document";
}
function getWindow(node) {
	var _node$ownerDocument;
	return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
	var _ref;
	return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
	if (!hasWindow()) return false;
	return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
	if (!hasWindow()) return false;
	return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
	if (!hasWindow()) return false;
	return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
	if (!hasWindow() || typeof ShadowRoot === "undefined") return false;
	return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
	const { overflow, overflowX, overflowY, display } = getComputedStyle$1(element);
	return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
}
function isTableElement(element) {
	return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
	try {
		if (element.matches(":popover-open")) return true;
	} catch (_e) {}
	try {
		return element.matches(":modal");
	} catch (_e) {
		return false;
	}
}
const willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
const containRe = /paint|layout|strict|content/;
const isNotNone = (value) => !!value && value !== "none";
let isWebKitValue;
function isContainingBlock(elementOrCss) {
	const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
	return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || "") || containRe.test(css.contain || "");
}
function getContainingBlock(element) {
	let currentNode = getParentNode(element);
	while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
		if (isContainingBlock(currentNode)) return currentNode;
		else if (isTopLayer(currentNode)) return null;
		currentNode = getParentNode(currentNode);
	}
	return null;
}
function isWebKit() {
	if (isWebKitValue == null) isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
	return isWebKitValue;
}
function isLastTraversableNode(node) {
	return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle$1(element) {
	return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
	if (isElement(element)) return {
		scrollLeft: element.scrollLeft,
		scrollTop: element.scrollTop
	};
	return {
		scrollLeft: element.scrollX,
		scrollTop: element.scrollY
	};
}
function getParentNode(node) {
	if (getNodeName(node) === "html") return node;
	const result = node.assignedSlot || node.parentNode || isShadowRoot(node) && node.host || getDocumentElement(node);
	return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
	const parentNode = getParentNode(node);
	if (isLastTraversableNode(parentNode)) return node.ownerDocument ? node.ownerDocument.body : node.body;
	if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) return parentNode;
	return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
	var _node$ownerDocument2;
	if (list === void 0) list = [];
	if (traverseIframes === void 0) traverseIframes = true;
	const scrollableAncestor = getNearestOverflowAncestor(node);
	const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
	const win = getWindow(scrollableAncestor);
	if (isBody) {
		const frameElement = getFrameElement(win);
		return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
	} else return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
	return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}

//#endregion
//#region ../node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function getCssDimensions(element) {
	const css = getComputedStyle$1(element);
	let width = parseFloat(css.width) || 0;
	let height = parseFloat(css.height) || 0;
	const hasOffset = isHTMLElement(element);
	const offsetWidth = hasOffset ? element.offsetWidth : width;
	const offsetHeight = hasOffset ? element.offsetHeight : height;
	const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
	if (shouldFallback) {
		width = offsetWidth;
		height = offsetHeight;
	}
	return {
		width,
		height,
		$: shouldFallback
	};
}
function unwrapElement(element) {
	return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
	const domElement = unwrapElement(element);
	if (!isHTMLElement(domElement)) return createCoords(1);
	const rect = domElement.getBoundingClientRect();
	const { width, height, $ } = getCssDimensions(domElement);
	let x = ($ ? round(rect.width) : rect.width) / width;
	let y = ($ ? round(rect.height) : rect.height) / height;
	if (!x || !Number.isFinite(x)) x = 1;
	if (!y || !Number.isFinite(y)) y = 1;
	return {
		x,
		y
	};
}
const noOffsets = /*#__PURE__*/ createCoords(0);
function getVisualOffsets(element) {
	const win = getWindow(element);
	if (!isWebKit() || !win.visualViewport) return noOffsets;
	return {
		x: win.visualViewport.offsetLeft,
		y: win.visualViewport.offsetTop
	};
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
	if (isFixed === void 0) isFixed = false;
	if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) return false;
	return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
	if (includeScale === void 0) includeScale = false;
	if (isFixedStrategy === void 0) isFixedStrategy = false;
	const clientRect = element.getBoundingClientRect();
	const domElement = unwrapElement(element);
	let scale = createCoords(1);
	if (includeScale) {
		if (offsetParent) {
			if (isElement(offsetParent)) scale = getScale(offsetParent);
		} else scale = getScale(element);
	}
	const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
	let x = (clientRect.left + visualOffsets.x) / scale.x;
	let y = (clientRect.top + visualOffsets.y) / scale.y;
	let width = clientRect.width / scale.x;
	let height = clientRect.height / scale.y;
	if (domElement) {
		const win = getWindow(domElement);
		const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
		let currentWin = win;
		let currentIFrame = getFrameElement(currentWin);
		while (currentIFrame && offsetParent && offsetWin !== currentWin) {
			const iframeScale = getScale(currentIFrame);
			const iframeRect = currentIFrame.getBoundingClientRect();
			const css = getComputedStyle$1(currentIFrame);
			const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
			const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
			x *= iframeScale.x;
			y *= iframeScale.y;
			width *= iframeScale.x;
			height *= iframeScale.y;
			x += left;
			y += top;
			currentWin = getWindow(currentIFrame);
			currentIFrame = getFrameElement(currentWin);
		}
	}
	return rectToClientRect({
		width,
		height,
		x,
		y
	});
}
function getWindowScrollBarX(element, rect) {
	const leftScroll = getNodeScroll(element).scrollLeft;
	if (!rect) return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
	return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll) {
	const htmlRect = documentElement.getBoundingClientRect();
	return {
		x: htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect),
		y: htmlRect.top + scroll.scrollTop
	};
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
	let { elements, rect, offsetParent, strategy } = _ref;
	const isFixed = strategy === "fixed";
	const documentElement = getDocumentElement(offsetParent);
	const topLayer = elements ? isTopLayer(elements.floating) : false;
	if (offsetParent === documentElement || topLayer && isFixed) return rect;
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	let scale = createCoords(1);
	const offsets = createCoords(0);
	const isOffsetParentAnElement = isHTMLElement(offsetParent);
	if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent);
			scale = getScale(offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		}
	}
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		width: rect.width * scale.x,
		height: rect.height * scale.y,
		x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
		y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
	};
}
function getClientRects(element) {
	return Array.from(element.getClientRects());
}
function getDocumentRect(element) {
	const html = getDocumentElement(element);
	const scroll = getNodeScroll(element);
	const body = element.ownerDocument.body;
	const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
	const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
	let x = -scroll.scrollLeft + getWindowScrollBarX(element);
	const y = -scroll.scrollTop;
	if (getComputedStyle$1(body).direction === "rtl") x += max(html.clientWidth, body.clientWidth) - width;
	return {
		width,
		height,
		x,
		y
	};
}
const SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy) {
	const win = getWindow(element);
	const html = getDocumentElement(element);
	const visualViewport = win.visualViewport;
	let width = html.clientWidth;
	let height = html.clientHeight;
	let x = 0;
	let y = 0;
	if (visualViewport) {
		width = visualViewport.width;
		height = visualViewport.height;
		const visualViewportBased = isWebKit();
		if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
			x = visualViewport.offsetLeft;
			y = visualViewport.offsetTop;
		}
	}
	const windowScrollbarX = getWindowScrollBarX(html);
	if (windowScrollbarX <= 0) {
		const doc = html.ownerDocument;
		const body = doc.body;
		const bodyStyles = getComputedStyle(body);
		const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
		const clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
		if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) width -= clippingStableScrollbarWidth;
	} else if (windowScrollbarX <= SCROLLBAR_MAX) width += windowScrollbarX;
	return {
		width,
		height,
		x,
		y
	};
}
function getInnerBoundingClientRect(element, strategy) {
	const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
	const top = clientRect.top + element.clientTop;
	const left = clientRect.left + element.clientLeft;
	const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
	return {
		width: element.clientWidth * scale.x,
		height: element.clientHeight * scale.y,
		x: left * scale.x,
		y: top * scale.y
	};
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
	let rect;
	if (clippingAncestor === "viewport") rect = getViewportRect(element, strategy);
	else if (clippingAncestor === "document") rect = getDocumentRect(getDocumentElement(element));
	else if (isElement(clippingAncestor)) rect = getInnerBoundingClientRect(clippingAncestor, strategy);
	else {
		const visualOffsets = getVisualOffsets(element);
		rect = {
			x: clippingAncestor.x - visualOffsets.x,
			y: clippingAncestor.y - visualOffsets.y,
			width: clippingAncestor.width,
			height: clippingAncestor.height
		};
	}
	return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
	const parentNode = getParentNode(element);
	if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) return false;
	return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
	const cachedResult = cache.get(element);
	if (cachedResult) return cachedResult;
	let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
	let currentContainingBlockComputedStyle = null;
	const elementIsFixed = getComputedStyle$1(element).position === "fixed";
	let currentNode = elementIsFixed ? getParentNode(element) : element;
	while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
		const computedStyle = getComputedStyle$1(currentNode);
		const currentNodeIsContaining = isContainingBlock(currentNode);
		if (!currentNodeIsContaining && computedStyle.position === "fixed") currentContainingBlockComputedStyle = null;
		if (elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && (currentContainingBlockComputedStyle.position === "absolute" || currentContainingBlockComputedStyle.position === "fixed") || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode)) result = result.filter((ancestor) => ancestor !== currentNode);
		else currentContainingBlockComputedStyle = computedStyle;
		currentNode = getParentNode(currentNode);
	}
	cache.set(element, result);
	return result;
}
function getClippingRect(_ref) {
	let { element, boundary, rootBoundary, strategy } = _ref;
	const clippingAncestors = [...boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary), rootBoundary];
	const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
	let top = firstRect.top;
	let right = firstRect.right;
	let bottom = firstRect.bottom;
	let left = firstRect.left;
	for (let i = 1; i < clippingAncestors.length; i++) {
		const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
		top = max(rect.top, top);
		right = min(rect.right, right);
		bottom = min(rect.bottom, bottom);
		left = max(rect.left, left);
	}
	return {
		width: right - left,
		height: bottom - top,
		x: left,
		y: top
	};
}
function getDimensions(element) {
	const { width, height } = getCssDimensions(element);
	return {
		width,
		height
	};
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
	const isOffsetParentAnElement = isHTMLElement(offsetParent);
	const documentElement = getDocumentElement(offsetParent);
	const isFixed = strategy === "fixed";
	const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
	let scroll = {
		scrollLeft: 0,
		scrollTop: 0
	};
	const offsets = createCoords(0);
	function setLeftRTLScrollbarOffset() {
		offsets.x = getWindowScrollBarX(documentElement);
	}
	if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
		if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) scroll = getNodeScroll(offsetParent);
		if (isOffsetParentAnElement) {
			const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
			offsets.x = offsetRect.x + offsetParent.clientLeft;
			offsets.y = offsetRect.y + offsetParent.clientTop;
		} else if (documentElement) setLeftRTLScrollbarOffset();
	}
	if (isFixed && !isOffsetParentAnElement && documentElement) setLeftRTLScrollbarOffset();
	const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
	return {
		x: rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x,
		y: rect.top + scroll.scrollTop - offsets.y - htmlOffset.y,
		width: rect.width,
		height: rect.height
	};
}
function isStaticPositioned(element) {
	return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
	if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") return null;
	if (polyfill) return polyfill(element);
	let rawOffsetParent = element.offsetParent;
	if (getDocumentElement(element) === rawOffsetParent) rawOffsetParent = rawOffsetParent.ownerDocument.body;
	return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
	const win = getWindow(element);
	if (isTopLayer(element)) return win;
	if (!isHTMLElement(element)) {
		let svgOffsetParent = getParentNode(element);
		while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
			if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) return svgOffsetParent;
			svgOffsetParent = getParentNode(svgOffsetParent);
		}
		return win;
	}
	let offsetParent = getTrueOffsetParent(element, polyfill);
	while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) offsetParent = getTrueOffsetParent(offsetParent, polyfill);
	if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) return win;
	return offsetParent || getContainingBlock(element) || win;
}
const getElementRects = async function(data) {
	const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
	const getDimensionsFn = this.getDimensions;
	const floatingDimensions = await getDimensionsFn(data.floating);
	return {
		reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
		floating: {
			x: 0,
			y: 0,
			width: floatingDimensions.width,
			height: floatingDimensions.height
		}
	};
};
function isRTL(element) {
	return getComputedStyle$1(element).direction === "rtl";
}
const platform = {
	convertOffsetParentRelativeRectToViewportRelativeRect,
	getDocumentElement,
	getClippingRect,
	getOffsetParent,
	getElementRects,
	getClientRects,
	getDimensions,
	getScale,
	isElement,
	isRTL
};
function rectsAreEqual(a, b) {
	return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
function observeMove(element, onMove) {
	let io = null;
	let timeoutId;
	const root = getDocumentElement(element);
	function cleanup() {
		var _io;
		clearTimeout(timeoutId);
		(_io = io) == null || _io.disconnect();
		io = null;
	}
	function refresh(skip, threshold) {
		if (skip === void 0) skip = false;
		if (threshold === void 0) threshold = 1;
		cleanup();
		const elementRectForRootMargin = element.getBoundingClientRect();
		const { left, top, width, height } = elementRectForRootMargin;
		if (!skip) onMove();
		if (!width || !height) return;
		const insetTop = floor(top);
		const insetRight = floor(root.clientWidth - (left + width));
		const insetBottom = floor(root.clientHeight - (top + height));
		const insetLeft = floor(left);
		const options = {
			rootMargin: -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px",
			threshold: max(0, min(1, threshold)) || 1
		};
		let isFirstUpdate = true;
		function handleObserve(entries) {
			const ratio = entries[0].intersectionRatio;
			if (ratio !== threshold) {
				if (!isFirstUpdate) return refresh();
				if (!ratio) timeoutId = setTimeout(() => {
					refresh(false, 1e-7);
				}, 1e3);
				else refresh(false, ratio);
			}
			if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) refresh();
			isFirstUpdate = false;
		}
		try {
			io = new IntersectionObserver(handleObserve, {
				...options,
				root: root.ownerDocument
			});
		} catch (_e) {
			io = new IntersectionObserver(handleObserve, options);
		}
		io.observe(element);
	}
	refresh(true);
	return cleanup;
}
/**
* Automatically updates the position of the floating element when necessary.
* Should only be called when the floating element is mounted on the DOM or
* visible on the screen.
* @returns cleanup function that should be invoked when the floating element is
* removed from the DOM or hidden from the screen.
* @see https://floating-ui.com/docs/autoUpdate
*/
function autoUpdate(reference, floating, update, options) {
	if (options === void 0) options = {};
	const { ancestorScroll = true, ancestorResize = true, elementResize = typeof ResizeObserver === "function", layoutShift = typeof IntersectionObserver === "function", animationFrame = false } = options;
	const referenceEl = unwrapElement(reference);
	const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...floating ? getOverflowAncestors(floating) : []] : [];
	ancestors.forEach((ancestor) => {
		ancestorScroll && ancestor.addEventListener("scroll", update, { passive: true });
		ancestorResize && ancestor.addEventListener("resize", update);
	});
	const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
	let reobserveFrame = -1;
	let resizeObserver = null;
	if (elementResize) {
		resizeObserver = new ResizeObserver((_ref) => {
			let [firstEntry] = _ref;
			if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
				resizeObserver.unobserve(floating);
				cancelAnimationFrame(reobserveFrame);
				reobserveFrame = requestAnimationFrame(() => {
					var _resizeObserver;
					(_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
				});
			}
			update();
		});
		if (referenceEl && !animationFrame) resizeObserver.observe(referenceEl);
		if (floating) resizeObserver.observe(floating);
	}
	let frameId;
	let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
	if (animationFrame) frameLoop();
	function frameLoop() {
		const nextRefRect = getBoundingClientRect(reference);
		if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) update();
		prevRefRect = nextRefRect;
		frameId = requestAnimationFrame(frameLoop);
	}
	update();
	return () => {
		var _resizeObserver2;
		ancestors.forEach((ancestor) => {
			ancestorScroll && ancestor.removeEventListener("scroll", update);
			ancestorResize && ancestor.removeEventListener("resize", update);
		});
		cleanupIo?.();
		(_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
		resizeObserver = null;
		if (animationFrame) cancelAnimationFrame(frameId);
	};
}
/**
* Resolves with an object of overflow side offsets that determine how much the
* element is overflowing a given clipping boundary on each side.
* - positive = overflowing the boundary by that number of pixels
* - negative = how many pixels left before it will overflow
* - 0 = lies flush with the boundary
* @see https://floating-ui.com/docs/detectOverflow
*/
const detectOverflow = detectOverflow$1;
/**
* Modifies the placement by translating the floating element along the
* specified axes.
* A number (shorthand for `mainAxis` or distance), or an axes configuration
* object may be passed.
* @see https://floating-ui.com/docs/offset
*/
const offset = offset$1;
/**
* Optimizes the visibility of the floating element by choosing the placement
* that has the most space available automatically, without needing to specify a
* preferred placement. Alternative to `flip`.
* @see https://floating-ui.com/docs/autoPlacement
*/
const autoPlacement = autoPlacement$1;
/**
* Optimizes the visibility of the floating element by shifting it in order to
* keep it in view when it will overflow the clipping boundary.
* @see https://floating-ui.com/docs/shift
*/
const shift = shift$1;
/**
* Optimizes the visibility of the floating element by flipping the `placement`
* in order to keep it in view when the preferred placement(s) will overflow the
* clipping boundary. Alternative to `autoPlacement`.
* @see https://floating-ui.com/docs/flip
*/
const flip = flip$1;
/**
* Provides data that allows you to change the size of the floating element —
* for instance, prevent it from overflowing the clipping boundary or match the
* width of the reference element.
* @see https://floating-ui.com/docs/size
*/
const size = size$1;
/**
* Provides data to hide the floating element in applicable situations, such as
* when it is not in the same clipping context as the reference element.
* @see https://floating-ui.com/docs/hide
*/
const hide = hide$1;
/**
* Provides data to position an inner element of the floating element so that it
* appears centered to the reference element.
* @see https://floating-ui.com/docs/arrow
*/
const arrow = arrow$1;
/**
* Provides improved positioning for inline reference elements that can span
* over multiple lines, such as hyperlinks or range selections.
* @see https://floating-ui.com/docs/inline
*/
const inline = inline$1;
/**
* Built-in `limiter` that will stop `shift()` at a certain point.
*/
const limitShift = limitShift$1;
/**
* Computes the `x` and `y` coordinates that will place the floating element
* next to a given reference element.
*/
const computePosition = (reference, floating, options) => {
	const cache = /* @__PURE__ */ new Map();
	const mergedOptions = {
		platform,
		...options
	};
	const platformWithCache = {
		...mergedOptions.platform,
		_c: cache
	};
	return computePosition$1(reference, floating, {
		...mergedOptions,
		platform: platformWithCache
	});
};

//#endregion
export { arrow, autoPlacement, autoUpdate, computePosition, detectOverflow, flip, getOverflowAncestors, hide, inline, limitShift, offset, platform, shift, size };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVuZG9yLmZsb2F0aW5nLXVpLmRvbS5qcyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvQGZsb2F0aW5nLXVpL3V0aWxzL2Rpc3QvZmxvYXRpbmctdWkudXRpbHMubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0BmbG9hdGluZy11aS9jb3JlL2Rpc3QvZmxvYXRpbmctdWkuY29yZS5tanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvQGZsb2F0aW5nLXVpL3V0aWxzL2Rpc3QvZmxvYXRpbmctdWkudXRpbHMuZG9tLm1qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9AZmxvYXRpbmctdWkvZG9tL2Rpc3QvZmxvYXRpbmctdWkuZG9tLm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEN1c3RvbSBwb3NpdGlvbmluZyByZWZlcmVuY2UgZWxlbWVudC5cbiAqIEBzZWUgaHR0cHM6Ly9mbG9hdGluZy11aS5jb20vZG9jcy92aXJ0dWFsLWVsZW1lbnRzXG4gKi9cblxuY29uc3Qgc2lkZXMgPSBbJ3RvcCcsICdyaWdodCcsICdib3R0b20nLCAnbGVmdCddO1xuY29uc3QgYWxpZ25tZW50cyA9IFsnc3RhcnQnLCAnZW5kJ107XG5jb25zdCBwbGFjZW1lbnRzID0gLyojX19QVVJFX18qL3NpZGVzLnJlZHVjZSgoYWNjLCBzaWRlKSA9PiBhY2MuY29uY2F0KHNpZGUsIHNpZGUgKyBcIi1cIiArIGFsaWdubWVudHNbMF0sIHNpZGUgKyBcIi1cIiArIGFsaWdubWVudHNbMV0pLCBbXSk7XG5jb25zdCBtaW4gPSBNYXRoLm1pbjtcbmNvbnN0IG1heCA9IE1hdGgubWF4O1xuY29uc3Qgcm91bmQgPSBNYXRoLnJvdW5kO1xuY29uc3QgZmxvb3IgPSBNYXRoLmZsb29yO1xuY29uc3QgY3JlYXRlQ29vcmRzID0gdiA9PiAoe1xuICB4OiB2LFxuICB5OiB2XG59KTtcbmNvbnN0IG9wcG9zaXRlU2lkZU1hcCA9IHtcbiAgbGVmdDogJ3JpZ2h0JyxcbiAgcmlnaHQ6ICdsZWZ0JyxcbiAgYm90dG9tOiAndG9wJyxcbiAgdG9wOiAnYm90dG9tJ1xufTtcbmZ1bmN0aW9uIGNsYW1wKHN0YXJ0LCB2YWx1ZSwgZW5kKSB7XG4gIHJldHVybiBtYXgoc3RhcnQsIG1pbih2YWx1ZSwgZW5kKSk7XG59XG5mdW5jdGlvbiBldmFsdWF0ZSh2YWx1ZSwgcGFyYW0pIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyA/IHZhbHVlKHBhcmFtKSA6IHZhbHVlO1xufVxuZnVuY3Rpb24gZ2V0U2lkZShwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5zcGxpdCgnLScpWzBdO1xufVxuZnVuY3Rpb24gZ2V0QWxpZ25tZW50KHBsYWNlbWVudCkge1xuICByZXR1cm4gcGxhY2VtZW50LnNwbGl0KCctJylbMV07XG59XG5mdW5jdGlvbiBnZXRPcHBvc2l0ZUF4aXMoYXhpcykge1xuICByZXR1cm4gYXhpcyA9PT0gJ3gnID8gJ3knIDogJ3gnO1xufVxuZnVuY3Rpb24gZ2V0QXhpc0xlbmd0aChheGlzKSB7XG4gIHJldHVybiBheGlzID09PSAneScgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG59XG5mdW5jdGlvbiBnZXRTaWRlQXhpcyhwbGFjZW1lbnQpIHtcbiAgY29uc3QgZmlyc3RDaGFyID0gcGxhY2VtZW50WzBdO1xuICByZXR1cm4gZmlyc3RDaGFyID09PSAndCcgfHwgZmlyc3RDaGFyID09PSAnYicgPyAneScgOiAneCc7XG59XG5mdW5jdGlvbiBnZXRBbGlnbm1lbnRBeGlzKHBsYWNlbWVudCkge1xuICByZXR1cm4gZ2V0T3Bwb3NpdGVBeGlzKGdldFNpZGVBeGlzKHBsYWNlbWVudCkpO1xufVxuZnVuY3Rpb24gZ2V0QWxpZ25tZW50U2lkZXMocGxhY2VtZW50LCByZWN0cywgcnRsKSB7XG4gIGlmIChydGwgPT09IHZvaWQgMCkge1xuICAgIHJ0bCA9IGZhbHNlO1xuICB9XG4gIGNvbnN0IGFsaWdubWVudCA9IGdldEFsaWdubWVudChwbGFjZW1lbnQpO1xuICBjb25zdCBhbGlnbm1lbnRBeGlzID0gZ2V0QWxpZ25tZW50QXhpcyhwbGFjZW1lbnQpO1xuICBjb25zdCBsZW5ndGggPSBnZXRBeGlzTGVuZ3RoKGFsaWdubWVudEF4aXMpO1xuICBsZXQgbWFpbkFsaWdubWVudFNpZGUgPSBhbGlnbm1lbnRBeGlzID09PSAneCcgPyBhbGlnbm1lbnQgPT09IChydGwgPyAnZW5kJyA6ICdzdGFydCcpID8gJ3JpZ2h0JyA6ICdsZWZ0JyA6IGFsaWdubWVudCA9PT0gJ3N0YXJ0JyA/ICdib3R0b20nIDogJ3RvcCc7XG4gIGlmIChyZWN0cy5yZWZlcmVuY2VbbGVuZ3RoXSA+IHJlY3RzLmZsb2F0aW5nW2xlbmd0aF0pIHtcbiAgICBtYWluQWxpZ25tZW50U2lkZSA9IGdldE9wcG9zaXRlUGxhY2VtZW50KG1haW5BbGlnbm1lbnRTaWRlKTtcbiAgfVxuICByZXR1cm4gW21haW5BbGlnbm1lbnRTaWRlLCBnZXRPcHBvc2l0ZVBsYWNlbWVudChtYWluQWxpZ25tZW50U2lkZSldO1xufVxuZnVuY3Rpb24gZ2V0RXhwYW5kZWRQbGFjZW1lbnRzKHBsYWNlbWVudCkge1xuICBjb25zdCBvcHBvc2l0ZVBsYWNlbWVudCA9IGdldE9wcG9zaXRlUGxhY2VtZW50KHBsYWNlbWVudCk7XG4gIHJldHVybiBbZ2V0T3Bwb3NpdGVBbGlnbm1lbnRQbGFjZW1lbnQocGxhY2VtZW50KSwgb3Bwb3NpdGVQbGFjZW1lbnQsIGdldE9wcG9zaXRlQWxpZ25tZW50UGxhY2VtZW50KG9wcG9zaXRlUGxhY2VtZW50KV07XG59XG5mdW5jdGlvbiBnZXRPcHBvc2l0ZUFsaWdubWVudFBsYWNlbWVudChwbGFjZW1lbnQpIHtcbiAgcmV0dXJuIHBsYWNlbWVudC5pbmNsdWRlcygnc3RhcnQnKSA/IHBsYWNlbWVudC5yZXBsYWNlKCdzdGFydCcsICdlbmQnKSA6IHBsYWNlbWVudC5yZXBsYWNlKCdlbmQnLCAnc3RhcnQnKTtcbn1cbmNvbnN0IGxyUGxhY2VtZW50ID0gWydsZWZ0JywgJ3JpZ2h0J107XG5jb25zdCBybFBsYWNlbWVudCA9IFsncmlnaHQnLCAnbGVmdCddO1xuY29uc3QgdGJQbGFjZW1lbnQgPSBbJ3RvcCcsICdib3R0b20nXTtcbmNvbnN0IGJ0UGxhY2VtZW50ID0gWydib3R0b20nLCAndG9wJ107XG5mdW5jdGlvbiBnZXRTaWRlTGlzdChzaWRlLCBpc1N0YXJ0LCBydGwpIHtcbiAgc3dpdGNoIChzaWRlKSB7XG4gICAgY2FzZSAndG9wJzpcbiAgICBjYXNlICdib3R0b20nOlxuICAgICAgaWYgKHJ0bCkgcmV0dXJuIGlzU3RhcnQgPyBybFBsYWNlbWVudCA6IGxyUGxhY2VtZW50O1xuICAgICAgcmV0dXJuIGlzU3RhcnQgPyBsclBsYWNlbWVudCA6IHJsUGxhY2VtZW50O1xuICAgIGNhc2UgJ2xlZnQnOlxuICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgIHJldHVybiBpc1N0YXJ0ID8gdGJQbGFjZW1lbnQgOiBidFBsYWNlbWVudDtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIFtdO1xuICB9XG59XG5mdW5jdGlvbiBnZXRPcHBvc2l0ZUF4aXNQbGFjZW1lbnRzKHBsYWNlbWVudCwgZmxpcEFsaWdubWVudCwgZGlyZWN0aW9uLCBydGwpIHtcbiAgY29uc3QgYWxpZ25tZW50ID0gZ2V0QWxpZ25tZW50KHBsYWNlbWVudCk7XG4gIGxldCBsaXN0ID0gZ2V0U2lkZUxpc3QoZ2V0U2lkZShwbGFjZW1lbnQpLCBkaXJlY3Rpb24gPT09ICdzdGFydCcsIHJ0bCk7XG4gIGlmIChhbGlnbm1lbnQpIHtcbiAgICBsaXN0ID0gbGlzdC5tYXAoc2lkZSA9PiBzaWRlICsgXCItXCIgKyBhbGlnbm1lbnQpO1xuICAgIGlmIChmbGlwQWxpZ25tZW50KSB7XG4gICAgICBsaXN0ID0gbGlzdC5jb25jYXQobGlzdC5tYXAoZ2V0T3Bwb3NpdGVBbGlnbm1lbnRQbGFjZW1lbnQpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGxpc3Q7XG59XG5mdW5jdGlvbiBnZXRPcHBvc2l0ZVBsYWNlbWVudChwbGFjZW1lbnQpIHtcbiAgY29uc3Qgc2lkZSA9IGdldFNpZGUocGxhY2VtZW50KTtcbiAgcmV0dXJuIG9wcG9zaXRlU2lkZU1hcFtzaWRlXSArIHBsYWNlbWVudC5zbGljZShzaWRlLmxlbmd0aCk7XG59XG5mdW5jdGlvbiBleHBhbmRQYWRkaW5nT2JqZWN0KHBhZGRpbmcpIHtcbiAgcmV0dXJuIHtcbiAgICB0b3A6IDAsXG4gICAgcmlnaHQ6IDAsXG4gICAgYm90dG9tOiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgLi4ucGFkZGluZ1xuICB9O1xufVxuZnVuY3Rpb24gZ2V0UGFkZGluZ09iamVjdChwYWRkaW5nKSB7XG4gIHJldHVybiB0eXBlb2YgcGFkZGluZyAhPT0gJ251bWJlcicgPyBleHBhbmRQYWRkaW5nT2JqZWN0KHBhZGRpbmcpIDoge1xuICAgIHRvcDogcGFkZGluZyxcbiAgICByaWdodDogcGFkZGluZyxcbiAgICBib3R0b206IHBhZGRpbmcsXG4gICAgbGVmdDogcGFkZGluZ1xuICB9O1xufVxuZnVuY3Rpb24gcmVjdFRvQ2xpZW50UmVjdChyZWN0KSB7XG4gIGNvbnN0IHtcbiAgICB4LFxuICAgIHksXG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0XG4gIH0gPSByZWN0O1xuICByZXR1cm4ge1xuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICB0b3A6IHksXG4gICAgbGVmdDogeCxcbiAgICByaWdodDogeCArIHdpZHRoLFxuICAgIGJvdHRvbTogeSArIGhlaWdodCxcbiAgICB4LFxuICAgIHlcbiAgfTtcbn1cblxuZXhwb3J0IHsgYWxpZ25tZW50cywgY2xhbXAsIGNyZWF0ZUNvb3JkcywgZXZhbHVhdGUsIGV4cGFuZFBhZGRpbmdPYmplY3QsIGZsb29yLCBnZXRBbGlnbm1lbnQsIGdldEFsaWdubWVudEF4aXMsIGdldEFsaWdubWVudFNpZGVzLCBnZXRBeGlzTGVuZ3RoLCBnZXRFeHBhbmRlZFBsYWNlbWVudHMsIGdldE9wcG9zaXRlQWxpZ25tZW50UGxhY2VtZW50LCBnZXRPcHBvc2l0ZUF4aXMsIGdldE9wcG9zaXRlQXhpc1BsYWNlbWVudHMsIGdldE9wcG9zaXRlUGxhY2VtZW50LCBnZXRQYWRkaW5nT2JqZWN0LCBnZXRTaWRlLCBnZXRTaWRlQXhpcywgbWF4LCBtaW4sIHBsYWNlbWVudHMsIHJlY3RUb0NsaWVudFJlY3QsIHJvdW5kLCBzaWRlcyB9O1xuIiwiaW1wb3J0IHsgZ2V0U2lkZUF4aXMsIGdldEFsaWdubWVudEF4aXMsIGdldEF4aXNMZW5ndGgsIGdldFNpZGUsIGdldEFsaWdubWVudCwgZXZhbHVhdGUsIGdldFBhZGRpbmdPYmplY3QsIHJlY3RUb0NsaWVudFJlY3QsIG1pbiwgY2xhbXAsIHBsYWNlbWVudHMsIGdldEFsaWdubWVudFNpZGVzLCBnZXRPcHBvc2l0ZUFsaWdubWVudFBsYWNlbWVudCwgZ2V0T3Bwb3NpdGVQbGFjZW1lbnQsIGdldEV4cGFuZGVkUGxhY2VtZW50cywgZ2V0T3Bwb3NpdGVBeGlzUGxhY2VtZW50cywgc2lkZXMsIG1heCwgZ2V0T3Bwb3NpdGVBeGlzIH0gZnJvbSAnQGZsb2F0aW5nLXVpL3V0aWxzJztcbmV4cG9ydCB7IHJlY3RUb0NsaWVudFJlY3QgfSBmcm9tICdAZmxvYXRpbmctdWkvdXRpbHMnO1xuXG5mdW5jdGlvbiBjb21wdXRlQ29vcmRzRnJvbVBsYWNlbWVudChfcmVmLCBwbGFjZW1lbnQsIHJ0bCkge1xuICBsZXQge1xuICAgIHJlZmVyZW5jZSxcbiAgICBmbG9hdGluZ1xuICB9ID0gX3JlZjtcbiAgY29uc3Qgc2lkZUF4aXMgPSBnZXRTaWRlQXhpcyhwbGFjZW1lbnQpO1xuICBjb25zdCBhbGlnbm1lbnRBeGlzID0gZ2V0QWxpZ25tZW50QXhpcyhwbGFjZW1lbnQpO1xuICBjb25zdCBhbGlnbkxlbmd0aCA9IGdldEF4aXNMZW5ndGgoYWxpZ25tZW50QXhpcyk7XG4gIGNvbnN0IHNpZGUgPSBnZXRTaWRlKHBsYWNlbWVudCk7XG4gIGNvbnN0IGlzVmVydGljYWwgPSBzaWRlQXhpcyA9PT0gJ3knO1xuICBjb25zdCBjb21tb25YID0gcmVmZXJlbmNlLnggKyByZWZlcmVuY2Uud2lkdGggLyAyIC0gZmxvYXRpbmcud2lkdGggLyAyO1xuICBjb25zdCBjb21tb25ZID0gcmVmZXJlbmNlLnkgKyByZWZlcmVuY2UuaGVpZ2h0IC8gMiAtIGZsb2F0aW5nLmhlaWdodCAvIDI7XG4gIGNvbnN0IGNvbW1vbkFsaWduID0gcmVmZXJlbmNlW2FsaWduTGVuZ3RoXSAvIDIgLSBmbG9hdGluZ1thbGlnbkxlbmd0aF0gLyAyO1xuICBsZXQgY29vcmRzO1xuICBzd2l0Y2ggKHNpZGUpIHtcbiAgICBjYXNlICd0b3AnOlxuICAgICAgY29vcmRzID0ge1xuICAgICAgICB4OiBjb21tb25YLFxuICAgICAgICB5OiByZWZlcmVuY2UueSAtIGZsb2F0aW5nLmhlaWdodFxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICBjb29yZHMgPSB7XG4gICAgICAgIHg6IGNvbW1vblgsXG4gICAgICAgIHk6IHJlZmVyZW5jZS55ICsgcmVmZXJlbmNlLmhlaWdodFxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgIGNvb3JkcyA9IHtcbiAgICAgICAgeDogcmVmZXJlbmNlLnggKyByZWZlcmVuY2Uud2lkdGgsXG4gICAgICAgIHk6IGNvbW1vbllcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlICdsZWZ0JzpcbiAgICAgIGNvb3JkcyA9IHtcbiAgICAgICAgeDogcmVmZXJlbmNlLnggLSBmbG9hdGluZy53aWR0aCxcbiAgICAgICAgeTogY29tbW9uWVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBjb29yZHMgPSB7XG4gICAgICAgIHg6IHJlZmVyZW5jZS54LFxuICAgICAgICB5OiByZWZlcmVuY2UueVxuICAgICAgfTtcbiAgfVxuICBzd2l0Y2ggKGdldEFsaWdubWVudChwbGFjZW1lbnQpKSB7XG4gICAgY2FzZSAnc3RhcnQnOlxuICAgICAgY29vcmRzW2FsaWdubWVudEF4aXNdIC09IGNvbW1vbkFsaWduICogKHJ0bCAmJiBpc1ZlcnRpY2FsID8gLTEgOiAxKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2VuZCc6XG4gICAgICBjb29yZHNbYWxpZ25tZW50QXhpc10gKz0gY29tbW9uQWxpZ24gKiAocnRsICYmIGlzVmVydGljYWwgPyAtMSA6IDEpO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIGNvb3Jkcztcbn1cblxuLyoqXG4gKiBSZXNvbHZlcyB3aXRoIGFuIG9iamVjdCBvZiBvdmVyZmxvdyBzaWRlIG9mZnNldHMgdGhhdCBkZXRlcm1pbmUgaG93IG11Y2ggdGhlXG4gKiBlbGVtZW50IGlzIG92ZXJmbG93aW5nIGEgZ2l2ZW4gY2xpcHBpbmcgYm91bmRhcnkgb24gZWFjaCBzaWRlLlxuICogLSBwb3NpdGl2ZSA9IG92ZXJmbG93aW5nIHRoZSBib3VuZGFyeSBieSB0aGF0IG51bWJlciBvZiBwaXhlbHNcbiAqIC0gbmVnYXRpdmUgPSBob3cgbWFueSBwaXhlbHMgbGVmdCBiZWZvcmUgaXQgd2lsbCBvdmVyZmxvd1xuICogLSAwID0gbGllcyBmbHVzaCB3aXRoIHRoZSBib3VuZGFyeVxuICogQHNlZSBodHRwczovL2Zsb2F0aW5nLXVpLmNvbS9kb2NzL2RldGVjdE92ZXJmbG93XG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGRldGVjdE92ZXJmbG93KHN0YXRlLCBvcHRpb25zKSB7XG4gIHZhciBfYXdhaXQkcGxhdGZvcm0kaXNFbGU7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgY29uc3Qge1xuICAgIHgsXG4gICAgeSxcbiAgICBwbGF0Zm9ybSxcbiAgICByZWN0cyxcbiAgICBlbGVtZW50cyxcbiAgICBzdHJhdGVneVxuICB9ID0gc3RhdGU7XG4gIGNvbnN0IHtcbiAgICBib3VuZGFyeSA9ICdjbGlwcGluZ0FuY2VzdG9ycycsXG4gICAgcm9vdEJvdW5kYXJ5ID0gJ3ZpZXdwb3J0JyxcbiAgICBlbGVtZW50Q29udGV4dCA9ICdmbG9hdGluZycsXG4gICAgYWx0Qm91bmRhcnkgPSBmYWxzZSxcbiAgICBwYWRkaW5nID0gMFxuICB9ID0gZXZhbHVhdGUob3B0aW9ucywgc3RhdGUpO1xuICBjb25zdCBwYWRkaW5nT2JqZWN0ID0gZ2V0UGFkZGluZ09iamVjdChwYWRkaW5nKTtcbiAgY29uc3QgYWx0Q29udGV4dCA9IGVsZW1lbnRDb250ZXh0ID09PSAnZmxvYXRpbmcnID8gJ3JlZmVyZW5jZScgOiAnZmxvYXRpbmcnO1xuICBjb25zdCBlbGVtZW50ID0gZWxlbWVudHNbYWx0Qm91bmRhcnkgPyBhbHRDb250ZXh0IDogZWxlbWVudENvbnRleHRdO1xuICBjb25zdCBjbGlwcGluZ0NsaWVudFJlY3QgPSByZWN0VG9DbGllbnRSZWN0KGF3YWl0IHBsYXRmb3JtLmdldENsaXBwaW5nUmVjdCh7XG4gICAgZWxlbWVudDogKChfYXdhaXQkcGxhdGZvcm0kaXNFbGUgPSBhd2FpdCAocGxhdGZvcm0uaXNFbGVtZW50ID09IG51bGwgPyB2b2lkIDAgOiBwbGF0Zm9ybS5pc0VsZW1lbnQoZWxlbWVudCkpKSAhPSBudWxsID8gX2F3YWl0JHBsYXRmb3JtJGlzRWxlIDogdHJ1ZSkgPyBlbGVtZW50IDogZWxlbWVudC5jb250ZXh0RWxlbWVudCB8fCAoYXdhaXQgKHBsYXRmb3JtLmdldERvY3VtZW50RWxlbWVudCA9PSBudWxsID8gdm9pZCAwIDogcGxhdGZvcm0uZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnRzLmZsb2F0aW5nKSkpLFxuICAgIGJvdW5kYXJ5LFxuICAgIHJvb3RCb3VuZGFyeSxcbiAgICBzdHJhdGVneVxuICB9KSk7XG4gIGNvbnN0IHJlY3QgPSBlbGVtZW50Q29udGV4dCA9PT0gJ2Zsb2F0aW5nJyA/IHtcbiAgICB4LFxuICAgIHksXG4gICAgd2lkdGg6IHJlY3RzLmZsb2F0aW5nLndpZHRoLFxuICAgIGhlaWdodDogcmVjdHMuZmxvYXRpbmcuaGVpZ2h0XG4gIH0gOiByZWN0cy5yZWZlcmVuY2U7XG4gIGNvbnN0IG9mZnNldFBhcmVudCA9IGF3YWl0IChwbGF0Zm9ybS5nZXRPZmZzZXRQYXJlbnQgPT0gbnVsbCA/IHZvaWQgMCA6IHBsYXRmb3JtLmdldE9mZnNldFBhcmVudChlbGVtZW50cy5mbG9hdGluZykpO1xuICBjb25zdCBvZmZzZXRTY2FsZSA9IChhd2FpdCAocGxhdGZvcm0uaXNFbGVtZW50ID09IG51bGwgPyB2b2lkIDAgOiBwbGF0Zm9ybS5pc0VsZW1lbnQob2Zmc2V0UGFyZW50KSkpID8gKGF3YWl0IChwbGF0Zm9ybS5nZXRTY2FsZSA9PSBudWxsID8gdm9pZCAwIDogcGxhdGZvcm0uZ2V0U2NhbGUob2Zmc2V0UGFyZW50KSkpIHx8IHtcbiAgICB4OiAxLFxuICAgIHk6IDFcbiAgfSA6IHtcbiAgICB4OiAxLFxuICAgIHk6IDFcbiAgfTtcbiAgY29uc3QgZWxlbWVudENsaWVudFJlY3QgPSByZWN0VG9DbGllbnRSZWN0KHBsYXRmb3JtLmNvbnZlcnRPZmZzZXRQYXJlbnRSZWxhdGl2ZVJlY3RUb1ZpZXdwb3J0UmVsYXRpdmVSZWN0ID8gYXdhaXQgcGxhdGZvcm0uY29udmVydE9mZnNldFBhcmVudFJlbGF0aXZlUmVjdFRvVmlld3BvcnRSZWxhdGl2ZVJlY3Qoe1xuICAgIGVsZW1lbnRzLFxuICAgIHJlY3QsXG4gICAgb2Zmc2V0UGFyZW50LFxuICAgIHN0cmF0ZWd5XG4gIH0pIDogcmVjdCk7XG4gIHJldHVybiB7XG4gICAgdG9wOiAoY2xpcHBpbmdDbGllbnRSZWN0LnRvcCAtIGVsZW1lbnRDbGllbnRSZWN0LnRvcCArIHBhZGRpbmdPYmplY3QudG9wKSAvIG9mZnNldFNjYWxlLnksXG4gICAgYm90dG9tOiAoZWxlbWVudENsaWVudFJlY3QuYm90dG9tIC0gY2xpcHBpbmdDbGllbnRSZWN0LmJvdHRvbSArIHBhZGRpbmdPYmplY3QuYm90dG9tKSAvIG9mZnNldFNjYWxlLnksXG4gICAgbGVmdDogKGNsaXBwaW5nQ2xpZW50UmVjdC5sZWZ0IC0gZWxlbWVudENsaWVudFJlY3QubGVmdCArIHBhZGRpbmdPYmplY3QubGVmdCkgLyBvZmZzZXRTY2FsZS54LFxuICAgIHJpZ2h0OiAoZWxlbWVudENsaWVudFJlY3QucmlnaHQgLSBjbGlwcGluZ0NsaWVudFJlY3QucmlnaHQgKyBwYWRkaW5nT2JqZWN0LnJpZ2h0KSAvIG9mZnNldFNjYWxlLnhcbiAgfTtcbn1cblxuLy8gTWF4aW11bSBudW1iZXIgb2YgcmVzZXRzIHRoYXQgY2FuIG9jY3VyIGJlZm9yZSBiYWlsaW5nIHRvIGF2b2lkIGluZmluaXRlIHJlc2V0IGxvb3BzLlxuY29uc3QgTUFYX1JFU0VUX0NPVU5UID0gNTA7XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIGB4YCBhbmQgYHlgIGNvb3JkaW5hdGVzIHRoYXQgd2lsbCBwbGFjZSB0aGUgZmxvYXRpbmcgZWxlbWVudFxuICogbmV4dCB0byBhIGdpdmVuIHJlZmVyZW5jZSBlbGVtZW50LlxuICpcbiAqIFRoaXMgZXhwb3J0IGRvZXMgbm90IGhhdmUgYW55IGBwbGF0Zm9ybWAgaW50ZXJmYWNlIGxvZ2ljLiBZb3Ugd2lsbCBuZWVkIHRvXG4gKiB3cml0ZSBvbmUgZm9yIHRoZSBwbGF0Zm9ybSB5b3UgYXJlIHVzaW5nIEZsb2F0aW5nIFVJIHdpdGguXG4gKi9cbmNvbnN0IGNvbXB1dGVQb3NpdGlvbiA9IGFzeW5jIChyZWZlcmVuY2UsIGZsb2F0aW5nLCBjb25maWcpID0+IHtcbiAgY29uc3Qge1xuICAgIHBsYWNlbWVudCA9ICdib3R0b20nLFxuICAgIHN0cmF0ZWd5ID0gJ2Fic29sdXRlJyxcbiAgICBtaWRkbGV3YXJlID0gW10sXG4gICAgcGxhdGZvcm1cbiAgfSA9IGNvbmZpZztcbiAgY29uc3QgcGxhdGZvcm1XaXRoRGV0ZWN0T3ZlcmZsb3cgPSBwbGF0Zm9ybS5kZXRlY3RPdmVyZmxvdyA/IHBsYXRmb3JtIDoge1xuICAgIC4uLnBsYXRmb3JtLFxuICAgIGRldGVjdE92ZXJmbG93XG4gIH07XG4gIGNvbnN0IHJ0bCA9IGF3YWl0IChwbGF0Zm9ybS5pc1JUTCA9PSBudWxsID8gdm9pZCAwIDogcGxhdGZvcm0uaXNSVEwoZmxvYXRpbmcpKTtcbiAgbGV0IHJlY3RzID0gYXdhaXQgcGxhdGZvcm0uZ2V0RWxlbWVudFJlY3RzKHtcbiAgICByZWZlcmVuY2UsXG4gICAgZmxvYXRpbmcsXG4gICAgc3RyYXRlZ3lcbiAgfSk7XG4gIGxldCB7XG4gICAgeCxcbiAgICB5XG4gIH0gPSBjb21wdXRlQ29vcmRzRnJvbVBsYWNlbWVudChyZWN0cywgcGxhY2VtZW50LCBydGwpO1xuICBsZXQgc3RhdGVmdWxQbGFjZW1lbnQgPSBwbGFjZW1lbnQ7XG4gIGxldCByZXNldENvdW50ID0gMDtcbiAgY29uc3QgbWlkZGxld2FyZURhdGEgPSB7fTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtaWRkbGV3YXJlLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY3VycmVudE1pZGRsZXdhcmUgPSBtaWRkbGV3YXJlW2ldO1xuICAgIGlmICghY3VycmVudE1pZGRsZXdhcmUpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCB7XG4gICAgICBuYW1lLFxuICAgICAgZm5cbiAgICB9ID0gY3VycmVudE1pZGRsZXdhcmU7XG4gICAgY29uc3Qge1xuICAgICAgeDogbmV4dFgsXG4gICAgICB5OiBuZXh0WSxcbiAgICAgIGRhdGEsXG4gICAgICByZXNldFxuICAgIH0gPSBhd2FpdCBmbih7XG4gICAgICB4LFxuICAgICAgeSxcbiAgICAgIGluaXRpYWxQbGFjZW1lbnQ6IHBsYWNlbWVudCxcbiAgICAgIHBsYWNlbWVudDogc3RhdGVmdWxQbGFjZW1lbnQsXG4gICAgICBzdHJhdGVneSxcbiAgICAgIG1pZGRsZXdhcmVEYXRhLFxuICAgICAgcmVjdHMsXG4gICAgICBwbGF0Zm9ybTogcGxhdGZvcm1XaXRoRGV0ZWN0T3ZlcmZsb3csXG4gICAgICBlbGVtZW50czoge1xuICAgICAgICByZWZlcmVuY2UsXG4gICAgICAgIGZsb2F0aW5nXG4gICAgICB9XG4gICAgfSk7XG4gICAgeCA9IG5leHRYICE9IG51bGwgPyBuZXh0WCA6IHg7XG4gICAgeSA9IG5leHRZICE9IG51bGwgPyBuZXh0WSA6IHk7XG4gICAgbWlkZGxld2FyZURhdGFbbmFtZV0gPSB7XG4gICAgICAuLi5taWRkbGV3YXJlRGF0YVtuYW1lXSxcbiAgICAgIC4uLmRhdGFcbiAgICB9O1xuICAgIGlmIChyZXNldCAmJiByZXNldENvdW50IDwgTUFYX1JFU0VUX0NPVU5UKSB7XG4gICAgICByZXNldENvdW50Kys7XG4gICAgICBpZiAodHlwZW9mIHJlc2V0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICBpZiAocmVzZXQucGxhY2VtZW50KSB7XG4gICAgICAgICAgc3RhdGVmdWxQbGFjZW1lbnQgPSByZXNldC5wbGFjZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc2V0LnJlY3RzKSB7XG4gICAgICAgICAgcmVjdHMgPSByZXNldC5yZWN0cyA9PT0gdHJ1ZSA/IGF3YWl0IHBsYXRmb3JtLmdldEVsZW1lbnRSZWN0cyh7XG4gICAgICAgICAgICByZWZlcmVuY2UsXG4gICAgICAgICAgICBmbG9hdGluZyxcbiAgICAgICAgICAgIHN0cmF0ZWd5XG4gICAgICAgICAgfSkgOiByZXNldC5yZWN0cztcbiAgICAgICAgfVxuICAgICAgICAoe1xuICAgICAgICAgIHgsXG4gICAgICAgICAgeVxuICAgICAgICB9ID0gY29tcHV0ZUNvb3Jkc0Zyb21QbGFjZW1lbnQocmVjdHMsIHN0YXRlZnVsUGxhY2VtZW50LCBydGwpKTtcbiAgICAgIH1cbiAgICAgIGkgPSAtMTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB4LFxuICAgIHksXG4gICAgcGxhY2VtZW50OiBzdGF0ZWZ1bFBsYWNlbWVudCxcbiAgICBzdHJhdGVneSxcbiAgICBtaWRkbGV3YXJlRGF0YVxuICB9O1xufTtcblxuLyoqXG4gKiBQcm92aWRlcyBkYXRhIHRvIHBvc2l0aW9uIGFuIGlubmVyIGVsZW1lbnQgb2YgdGhlIGZsb2F0aW5nIGVsZW1lbnQgc28gdGhhdCBpdFxuICogYXBwZWFycyBjZW50ZXJlZCB0byB0aGUgcmVmZXJlbmNlIGVsZW1lbnQuXG4gKiBAc2VlIGh0dHBzOi8vZmxvYXRpbmctdWkuY29tL2RvY3MvYXJyb3dcbiAqL1xuY29uc3QgYXJyb3cgPSBvcHRpb25zID0+ICh7XG4gIG5hbWU6ICdhcnJvdycsXG4gIG9wdGlvbnMsXG4gIGFzeW5jIGZuKHN0YXRlKSB7XG4gICAgY29uc3Qge1xuICAgICAgeCxcbiAgICAgIHksXG4gICAgICBwbGFjZW1lbnQsXG4gICAgICByZWN0cyxcbiAgICAgIHBsYXRmb3JtLFxuICAgICAgZWxlbWVudHMsXG4gICAgICBtaWRkbGV3YXJlRGF0YVxuICAgIH0gPSBzdGF0ZTtcbiAgICAvLyBTaW5jZSBgZWxlbWVudGAgaXMgcmVxdWlyZWQsIHdlIGRvbid0IFBhcnRpYWw8PiB0aGUgdHlwZS5cbiAgICBjb25zdCB7XG4gICAgICBlbGVtZW50LFxuICAgICAgcGFkZGluZyA9IDBcbiAgICB9ID0gZXZhbHVhdGUob3B0aW9ucywgc3RhdGUpIHx8IHt9O1xuICAgIGlmIChlbGVtZW50ID09IG51bGwpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgY29uc3QgcGFkZGluZ09iamVjdCA9IGdldFBhZGRpbmdPYmplY3QocGFkZGluZyk7XG4gICAgY29uc3QgY29vcmRzID0ge1xuICAgICAgeCxcbiAgICAgIHlcbiAgICB9O1xuICAgIGNvbnN0IGF4aXMgPSBnZXRBbGlnbm1lbnRBeGlzKHBsYWNlbWVudCk7XG4gICAgY29uc3QgbGVuZ3RoID0gZ2V0QXhpc0xlbmd0aChheGlzKTtcbiAgICBjb25zdCBhcnJvd0RpbWVuc2lvbnMgPSBhd2FpdCBwbGF0Zm9ybS5nZXREaW1lbnNpb25zKGVsZW1lbnQpO1xuICAgIGNvbnN0IGlzWUF4aXMgPSBheGlzID09PSAneSc7XG4gICAgY29uc3QgbWluUHJvcCA9IGlzWUF4aXMgPyAndG9wJyA6ICdsZWZ0JztcbiAgICBjb25zdCBtYXhQcm9wID0gaXNZQXhpcyA/ICdib3R0b20nIDogJ3JpZ2h0JztcbiAgICBjb25zdCBjbGllbnRQcm9wID0gaXNZQXhpcyA/ICdjbGllbnRIZWlnaHQnIDogJ2NsaWVudFdpZHRoJztcbiAgICBjb25zdCBlbmREaWZmID0gcmVjdHMucmVmZXJlbmNlW2xlbmd0aF0gKyByZWN0cy5yZWZlcmVuY2VbYXhpc10gLSBjb29yZHNbYXhpc10gLSByZWN0cy5mbG9hdGluZ1tsZW5ndGhdO1xuICAgIGNvbnN0IHN0YXJ0RGlmZiA9IGNvb3Jkc1theGlzXSAtIHJlY3RzLnJlZmVyZW5jZVtheGlzXTtcbiAgICBjb25zdCBhcnJvd09mZnNldFBhcmVudCA9IGF3YWl0IChwbGF0Zm9ybS5nZXRPZmZzZXRQYXJlbnQgPT0gbnVsbCA/IHZvaWQgMCA6IHBsYXRmb3JtLmdldE9mZnNldFBhcmVudChlbGVtZW50KSk7XG4gICAgbGV0IGNsaWVudFNpemUgPSBhcnJvd09mZnNldFBhcmVudCA/IGFycm93T2Zmc2V0UGFyZW50W2NsaWVudFByb3BdIDogMDtcblxuICAgIC8vIERPTSBwbGF0Zm9ybSBjYW4gcmV0dXJuIGB3aW5kb3dgIGFzIHRoZSBgb2Zmc2V0UGFyZW50YC5cbiAgICBpZiAoIWNsaWVudFNpemUgfHwgIShhd2FpdCAocGxhdGZvcm0uaXNFbGVtZW50ID09IG51bGwgPyB2b2lkIDAgOiBwbGF0Zm9ybS5pc0VsZW1lbnQoYXJyb3dPZmZzZXRQYXJlbnQpKSkpIHtcbiAgICAgIGNsaWVudFNpemUgPSBlbGVtZW50cy5mbG9hdGluZ1tjbGllbnRQcm9wXSB8fCByZWN0cy5mbG9hdGluZ1tsZW5ndGhdO1xuICAgIH1cbiAgICBjb25zdCBjZW50ZXJUb1JlZmVyZW5jZSA9IGVuZERpZmYgLyAyIC0gc3RhcnREaWZmIC8gMjtcblxuICAgIC8vIElmIHRoZSBwYWRkaW5nIGlzIGxhcmdlIGVub3VnaCB0aGF0IGl0IGNhdXNlcyB0aGUgYXJyb3cgdG8gbm8gbG9uZ2VyIGJlXG4gICAgLy8gY2VudGVyZWQsIG1vZGlmeSB0aGUgcGFkZGluZyBzbyB0aGF0IGl0IGlzIGNlbnRlcmVkLlxuICAgIGNvbnN0IGxhcmdlc3RQb3NzaWJsZVBhZGRpbmcgPSBjbGllbnRTaXplIC8gMiAtIGFycm93RGltZW5zaW9uc1tsZW5ndGhdIC8gMiAtIDE7XG4gICAgY29uc3QgbWluUGFkZGluZyA9IG1pbihwYWRkaW5nT2JqZWN0W21pblByb3BdLCBsYXJnZXN0UG9zc2libGVQYWRkaW5nKTtcbiAgICBjb25zdCBtYXhQYWRkaW5nID0gbWluKHBhZGRpbmdPYmplY3RbbWF4UHJvcF0sIGxhcmdlc3RQb3NzaWJsZVBhZGRpbmcpO1xuXG4gICAgLy8gTWFrZSBzdXJlIHRoZSBhcnJvdyBkb2Vzbid0IG92ZXJmbG93IHRoZSBmbG9hdGluZyBlbGVtZW50IGlmIHRoZSBjZW50ZXJcbiAgICAvLyBwb2ludCBpcyBvdXRzaWRlIHRoZSBmbG9hdGluZyBlbGVtZW50J3MgYm91bmRzLlxuICAgIGNvbnN0IG1pbiQxID0gbWluUGFkZGluZztcbiAgICBjb25zdCBtYXggPSBjbGllbnRTaXplIC0gYXJyb3dEaW1lbnNpb25zW2xlbmd0aF0gLSBtYXhQYWRkaW5nO1xuICAgIGNvbnN0IGNlbnRlciA9IGNsaWVudFNpemUgLyAyIC0gYXJyb3dEaW1lbnNpb25zW2xlbmd0aF0gLyAyICsgY2VudGVyVG9SZWZlcmVuY2U7XG4gICAgY29uc3Qgb2Zmc2V0ID0gY2xhbXAobWluJDEsIGNlbnRlciwgbWF4KTtcblxuICAgIC8vIElmIHRoZSByZWZlcmVuY2UgaXMgc21hbGwgZW5vdWdoIHRoYXQgdGhlIGFycm93J3MgcGFkZGluZyBjYXVzZXMgaXQgdG9cbiAgICAvLyB0byBwb2ludCB0byBub3RoaW5nIGZvciBhbiBhbGlnbmVkIHBsYWNlbWVudCwgYWRqdXN0IHRoZSBvZmZzZXQgb2YgdGhlXG4gICAgLy8gZmxvYXRpbmcgZWxlbWVudCBpdHNlbGYuIFRvIGVuc3VyZSBgc2hpZnQoKWAgY29udGludWVzIHRvIHRha2UgYWN0aW9uLFxuICAgIC8vIGEgc2luZ2xlIHJlc2V0IGlzIHBlcmZvcm1lZCB3aGVuIHRoaXMgaXMgdHJ1ZS5cbiAgICBjb25zdCBzaG91bGRBZGRPZmZzZXQgPSAhbWlkZGxld2FyZURhdGEuYXJyb3cgJiYgZ2V0QWxpZ25tZW50KHBsYWNlbWVudCkgIT0gbnVsbCAmJiBjZW50ZXIgIT09IG9mZnNldCAmJiByZWN0cy5yZWZlcmVuY2VbbGVuZ3RoXSAvIDIgLSAoY2VudGVyIDwgbWluJDEgPyBtaW5QYWRkaW5nIDogbWF4UGFkZGluZykgLSBhcnJvd0RpbWVuc2lvbnNbbGVuZ3RoXSAvIDIgPCAwO1xuICAgIGNvbnN0IGFsaWdubWVudE9mZnNldCA9IHNob3VsZEFkZE9mZnNldCA/IGNlbnRlciA8IG1pbiQxID8gY2VudGVyIC0gbWluJDEgOiBjZW50ZXIgLSBtYXggOiAwO1xuICAgIHJldHVybiB7XG4gICAgICBbYXhpc106IGNvb3Jkc1theGlzXSArIGFsaWdubWVudE9mZnNldCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgW2F4aXNdOiBvZmZzZXQsXG4gICAgICAgIGNlbnRlck9mZnNldDogY2VudGVyIC0gb2Zmc2V0IC0gYWxpZ25tZW50T2Zmc2V0LFxuICAgICAgICAuLi4oc2hvdWxkQWRkT2Zmc2V0ICYmIHtcbiAgICAgICAgICBhbGlnbm1lbnRPZmZzZXRcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICByZXNldDogc2hvdWxkQWRkT2Zmc2V0XG4gICAgfTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIGdldFBsYWNlbWVudExpc3QoYWxpZ25tZW50LCBhdXRvQWxpZ25tZW50LCBhbGxvd2VkUGxhY2VtZW50cykge1xuICBjb25zdCBhbGxvd2VkUGxhY2VtZW50c1NvcnRlZEJ5QWxpZ25tZW50ID0gYWxpZ25tZW50ID8gWy4uLmFsbG93ZWRQbGFjZW1lbnRzLmZpbHRlcihwbGFjZW1lbnQgPT4gZ2V0QWxpZ25tZW50KHBsYWNlbWVudCkgPT09IGFsaWdubWVudCksIC4uLmFsbG93ZWRQbGFjZW1lbnRzLmZpbHRlcihwbGFjZW1lbnQgPT4gZ2V0QWxpZ25tZW50KHBsYWNlbWVudCkgIT09IGFsaWdubWVudCldIDogYWxsb3dlZFBsYWNlbWVudHMuZmlsdGVyKHBsYWNlbWVudCA9PiBnZXRTaWRlKHBsYWNlbWVudCkgPT09IHBsYWNlbWVudCk7XG4gIHJldHVybiBhbGxvd2VkUGxhY2VtZW50c1NvcnRlZEJ5QWxpZ25tZW50LmZpbHRlcihwbGFjZW1lbnQgPT4ge1xuICAgIGlmIChhbGlnbm1lbnQpIHtcbiAgICAgIHJldHVybiBnZXRBbGlnbm1lbnQocGxhY2VtZW50KSA9PT0gYWxpZ25tZW50IHx8IChhdXRvQWxpZ25tZW50ID8gZ2V0T3Bwb3NpdGVBbGlnbm1lbnRQbGFjZW1lbnQocGxhY2VtZW50KSAhPT0gcGxhY2VtZW50IDogZmFsc2UpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59XG4vKipcbiAqIE9wdGltaXplcyB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgZmxvYXRpbmcgZWxlbWVudCBieSBjaG9vc2luZyB0aGUgcGxhY2VtZW50XG4gKiB0aGF0IGhhcyB0aGUgbW9zdCBzcGFjZSBhdmFpbGFibGUgYXV0b21hdGljYWxseSwgd2l0aG91dCBuZWVkaW5nIHRvIHNwZWNpZnkgYVxuICogcHJlZmVycmVkIHBsYWNlbWVudC4gQWx0ZXJuYXRpdmUgdG8gYGZsaXBgLlxuICogQHNlZSBodHRwczovL2Zsb2F0aW5nLXVpLmNvbS9kb2NzL2F1dG9QbGFjZW1lbnRcbiAqL1xuY29uc3QgYXV0b1BsYWNlbWVudCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnYXV0b1BsYWNlbWVudCcsXG4gICAgb3B0aW9ucyxcbiAgICBhc3luYyBmbihzdGF0ZSkge1xuICAgICAgdmFyIF9taWRkbGV3YXJlRGF0YSRhdXRvUCwgX21pZGRsZXdhcmVEYXRhJGF1dG9QMiwgX3BsYWNlbWVudHNUaGF0Rml0T25FO1xuICAgICAgY29uc3Qge1xuICAgICAgICByZWN0cyxcbiAgICAgICAgbWlkZGxld2FyZURhdGEsXG4gICAgICAgIHBsYWNlbWVudCxcbiAgICAgICAgcGxhdGZvcm0sXG4gICAgICAgIGVsZW1lbnRzXG4gICAgICB9ID0gc3RhdGU7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGNyb3NzQXhpcyA9IGZhbHNlLFxuICAgICAgICBhbGlnbm1lbnQsXG4gICAgICAgIGFsbG93ZWRQbGFjZW1lbnRzID0gcGxhY2VtZW50cyxcbiAgICAgICAgYXV0b0FsaWdubWVudCA9IHRydWUsXG4gICAgICAgIC4uLmRldGVjdE92ZXJmbG93T3B0aW9uc1xuICAgICAgfSA9IGV2YWx1YXRlKG9wdGlvbnMsIHN0YXRlKTtcbiAgICAgIGNvbnN0IHBsYWNlbWVudHMkMSA9IGFsaWdubWVudCAhPT0gdW5kZWZpbmVkIHx8IGFsbG93ZWRQbGFjZW1lbnRzID09PSBwbGFjZW1lbnRzID8gZ2V0UGxhY2VtZW50TGlzdChhbGlnbm1lbnQgfHwgbnVsbCwgYXV0b0FsaWdubWVudCwgYWxsb3dlZFBsYWNlbWVudHMpIDogYWxsb3dlZFBsYWNlbWVudHM7XG4gICAgICBjb25zdCBvdmVyZmxvdyA9IGF3YWl0IHBsYXRmb3JtLmRldGVjdE92ZXJmbG93KHN0YXRlLCBkZXRlY3RPdmVyZmxvd09wdGlvbnMpO1xuICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gKChfbWlkZGxld2FyZURhdGEkYXV0b1AgPSBtaWRkbGV3YXJlRGF0YS5hdXRvUGxhY2VtZW50KSA9PSBudWxsID8gdm9pZCAwIDogX21pZGRsZXdhcmVEYXRhJGF1dG9QLmluZGV4KSB8fCAwO1xuICAgICAgY29uc3QgY3VycmVudFBsYWNlbWVudCA9IHBsYWNlbWVudHMkMVtjdXJyZW50SW5kZXhdO1xuICAgICAgaWYgKGN1cnJlbnRQbGFjZW1lbnQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgICB9XG4gICAgICBjb25zdCBhbGlnbm1lbnRTaWRlcyA9IGdldEFsaWdubWVudFNpZGVzKGN1cnJlbnRQbGFjZW1lbnQsIHJlY3RzLCBhd2FpdCAocGxhdGZvcm0uaXNSVEwgPT0gbnVsbCA/IHZvaWQgMCA6IHBsYXRmb3JtLmlzUlRMKGVsZW1lbnRzLmZsb2F0aW5nKSkpO1xuXG4gICAgICAvLyBNYWtlIGBjb21wdXRlQ29vcmRzYCBzdGFydCBmcm9tIHRoZSByaWdodCBwbGFjZS5cbiAgICAgIGlmIChwbGFjZW1lbnQgIT09IGN1cnJlbnRQbGFjZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByZXNldDoge1xuICAgICAgICAgICAgcGxhY2VtZW50OiBwbGFjZW1lbnRzJDFbMF1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBjb25zdCBjdXJyZW50T3ZlcmZsb3dzID0gW292ZXJmbG93W2dldFNpZGUoY3VycmVudFBsYWNlbWVudCldLCBvdmVyZmxvd1thbGlnbm1lbnRTaWRlc1swXV0sIG92ZXJmbG93W2FsaWdubWVudFNpZGVzWzFdXV07XG4gICAgICBjb25zdCBhbGxPdmVyZmxvd3MgPSBbLi4uKCgoX21pZGRsZXdhcmVEYXRhJGF1dG9QMiA9IG1pZGRsZXdhcmVEYXRhLmF1dG9QbGFjZW1lbnQpID09IG51bGwgPyB2b2lkIDAgOiBfbWlkZGxld2FyZURhdGEkYXV0b1AyLm92ZXJmbG93cykgfHwgW10pLCB7XG4gICAgICAgIHBsYWNlbWVudDogY3VycmVudFBsYWNlbWVudCxcbiAgICAgICAgb3ZlcmZsb3dzOiBjdXJyZW50T3ZlcmZsb3dzXG4gICAgICB9XTtcbiAgICAgIGNvbnN0IG5leHRQbGFjZW1lbnQgPSBwbGFjZW1lbnRzJDFbY3VycmVudEluZGV4ICsgMV07XG5cbiAgICAgIC8vIFRoZXJlIGFyZSBtb3JlIHBsYWNlbWVudHMgdG8gY2hlY2suXG4gICAgICBpZiAobmV4dFBsYWNlbWVudCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGluZGV4OiBjdXJyZW50SW5kZXggKyAxLFxuICAgICAgICAgICAgb3ZlcmZsb3dzOiBhbGxPdmVyZmxvd3NcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc2V0OiB7XG4gICAgICAgICAgICBwbGFjZW1lbnQ6IG5leHRQbGFjZW1lbnRcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBjb25zdCBwbGFjZW1lbnRzU29ydGVkQnlNb3N0U3BhY2UgPSBhbGxPdmVyZmxvd3MubWFwKGQgPT4ge1xuICAgICAgICBjb25zdCBhbGlnbm1lbnQgPSBnZXRBbGlnbm1lbnQoZC5wbGFjZW1lbnQpO1xuICAgICAgICByZXR1cm4gW2QucGxhY2VtZW50LCBhbGlnbm1lbnQgJiYgY3Jvc3NBeGlzID9cbiAgICAgICAgLy8gQ2hlY2sgYWxvbmcgdGhlIG1haW5BeGlzIGFuZCBtYWluIGNyb3NzQXhpcyBzaWRlLlxuICAgICAgICBkLm92ZXJmbG93cy5zbGljZSgwLCAyKS5yZWR1Y2UoKGFjYywgdikgPT4gYWNjICsgdiwgMCkgOlxuICAgICAgICAvLyBDaGVjayBvbmx5IHRoZSBtYWluQXhpcy5cbiAgICAgICAgZC5vdmVyZmxvd3NbMF0sIGQub3ZlcmZsb3dzXTtcbiAgICAgIH0pLnNvcnQoKGEsIGIpID0+IGFbMV0gLSBiWzFdKTtcbiAgICAgIGNvbnN0IHBsYWNlbWVudHNUaGF0Rml0T25FYWNoU2lkZSA9IHBsYWNlbWVudHNTb3J0ZWRCeU1vc3RTcGFjZS5maWx0ZXIoZCA9PiBkWzJdLnNsaWNlKDAsXG4gICAgICAvLyBBbGlnbmVkIHBsYWNlbWVudHMgc2hvdWxkIG5vdCBjaGVjayB0aGVpciBvcHBvc2l0ZSBjcm9zc0F4aXNcbiAgICAgIC8vIHNpZGUuXG4gICAgICBnZXRBbGlnbm1lbnQoZFswXSkgPyAyIDogMykuZXZlcnkodiA9PiB2IDw9IDApKTtcbiAgICAgIGNvbnN0IHJlc2V0UGxhY2VtZW50ID0gKChfcGxhY2VtZW50c1RoYXRGaXRPbkUgPSBwbGFjZW1lbnRzVGhhdEZpdE9uRWFjaFNpZGVbMF0pID09IG51bGwgPyB2b2lkIDAgOiBfcGxhY2VtZW50c1RoYXRGaXRPbkVbMF0pIHx8IHBsYWNlbWVudHNTb3J0ZWRCeU1vc3RTcGFjZVswXVswXTtcbiAgICAgIGlmIChyZXNldFBsYWNlbWVudCAhPT0gcGxhY2VtZW50KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaW5kZXg6IGN1cnJlbnRJbmRleCArIDEsXG4gICAgICAgICAgICBvdmVyZmxvd3M6IGFsbE92ZXJmbG93c1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcmVzZXQ6IHtcbiAgICAgICAgICAgIHBsYWNlbWVudDogcmVzZXRQbGFjZW1lbnRcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xufTtcblxuLyoqXG4gKiBPcHRpbWl6ZXMgdGhlIHZpc2liaWxpdHkgb2YgdGhlIGZsb2F0aW5nIGVsZW1lbnQgYnkgZmxpcHBpbmcgdGhlIGBwbGFjZW1lbnRgXG4gKiBpbiBvcmRlciB0byBrZWVwIGl0IGluIHZpZXcgd2hlbiB0aGUgcHJlZmVycmVkIHBsYWNlbWVudChzKSB3aWxsIG92ZXJmbG93IHRoZVxuICogY2xpcHBpbmcgYm91bmRhcnkuIEFsdGVybmF0aXZlIHRvIGBhdXRvUGxhY2VtZW50YC5cbiAqIEBzZWUgaHR0cHM6Ly9mbG9hdGluZy11aS5jb20vZG9jcy9mbGlwXG4gKi9cbmNvbnN0IGZsaXAgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ2ZsaXAnLFxuICAgIG9wdGlvbnMsXG4gICAgYXN5bmMgZm4oc3RhdGUpIHtcbiAgICAgIHZhciBfbWlkZGxld2FyZURhdGEkYXJyb3csIF9taWRkbGV3YXJlRGF0YSRmbGlwO1xuICAgICAgY29uc3Qge1xuICAgICAgICBwbGFjZW1lbnQsXG4gICAgICAgIG1pZGRsZXdhcmVEYXRhLFxuICAgICAgICByZWN0cyxcbiAgICAgICAgaW5pdGlhbFBsYWNlbWVudCxcbiAgICAgICAgcGxhdGZvcm0sXG4gICAgICAgIGVsZW1lbnRzXG4gICAgICB9ID0gc3RhdGU7XG4gICAgICBjb25zdCB7XG4gICAgICAgIG1haW5BeGlzOiBjaGVja01haW5BeGlzID0gdHJ1ZSxcbiAgICAgICAgY3Jvc3NBeGlzOiBjaGVja0Nyb3NzQXhpcyA9IHRydWUsXG4gICAgICAgIGZhbGxiYWNrUGxhY2VtZW50czogc3BlY2lmaWVkRmFsbGJhY2tQbGFjZW1lbnRzLFxuICAgICAgICBmYWxsYmFja1N0cmF0ZWd5ID0gJ2Jlc3RGaXQnLFxuICAgICAgICBmYWxsYmFja0F4aXNTaWRlRGlyZWN0aW9uID0gJ25vbmUnLFxuICAgICAgICBmbGlwQWxpZ25tZW50ID0gdHJ1ZSxcbiAgICAgICAgLi4uZGV0ZWN0T3ZlcmZsb3dPcHRpb25zXG4gICAgICB9ID0gZXZhbHVhdGUob3B0aW9ucywgc3RhdGUpO1xuXG4gICAgICAvLyBJZiBhIHJlc2V0IGJ5IHRoZSBhcnJvdyB3YXMgY2F1c2VkIGR1ZSB0byBhbiBhbGlnbm1lbnQgb2Zmc2V0IGJlaW5nXG4gICAgICAvLyBhZGRlZCwgd2Ugc2hvdWxkIHNraXAgYW55IGxvZ2ljIG5vdyBzaW5jZSBgZmxpcCgpYCBoYXMgYWxyZWFkeSBkb25lIGl0c1xuICAgICAgLy8gd29yay5cbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mbG9hdGluZy11aS9mbG9hdGluZy11aS9pc3N1ZXMvMjU0OSNpc3N1ZWNvbW1lbnQtMTcxOTYwMTY0M1xuICAgICAgaWYgKChfbWlkZGxld2FyZURhdGEkYXJyb3cgPSBtaWRkbGV3YXJlRGF0YS5hcnJvdykgIT0gbnVsbCAmJiBfbWlkZGxld2FyZURhdGEkYXJyb3cuYWxpZ25tZW50T2Zmc2V0KSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHNpZGUgPSBnZXRTaWRlKHBsYWNlbWVudCk7XG4gICAgICBjb25zdCBpbml0aWFsU2lkZUF4aXMgPSBnZXRTaWRlQXhpcyhpbml0aWFsUGxhY2VtZW50KTtcbiAgICAgIGNvbnN0IGlzQmFzZVBsYWNlbWVudCA9IGdldFNpZGUoaW5pdGlhbFBsYWNlbWVudCkgPT09IGluaXRpYWxQbGFjZW1lbnQ7XG4gICAgICBjb25zdCBydGwgPSBhd2FpdCAocGxhdGZvcm0uaXNSVEwgPT0gbnVsbCA/IHZvaWQgMCA6IHBsYXRmb3JtLmlzUlRMKGVsZW1lbnRzLmZsb2F0aW5nKSk7XG4gICAgICBjb25zdCBmYWxsYmFja1BsYWNlbWVudHMgPSBzcGVjaWZpZWRGYWxsYmFja1BsYWNlbWVudHMgfHwgKGlzQmFzZVBsYWNlbWVudCB8fCAhZmxpcEFsaWdubWVudCA/IFtnZXRPcHBvc2l0ZVBsYWNlbWVudChpbml0aWFsUGxhY2VtZW50KV0gOiBnZXRFeHBhbmRlZFBsYWNlbWVudHMoaW5pdGlhbFBsYWNlbWVudCkpO1xuICAgICAgY29uc3QgaGFzRmFsbGJhY2tBeGlzU2lkZURpcmVjdGlvbiA9IGZhbGxiYWNrQXhpc1NpZGVEaXJlY3Rpb24gIT09ICdub25lJztcbiAgICAgIGlmICghc3BlY2lmaWVkRmFsbGJhY2tQbGFjZW1lbnRzICYmIGhhc0ZhbGxiYWNrQXhpc1NpZGVEaXJlY3Rpb24pIHtcbiAgICAgICAgZmFsbGJhY2tQbGFjZW1lbnRzLnB1c2goLi4uZ2V0T3Bwb3NpdGVBeGlzUGxhY2VtZW50cyhpbml0aWFsUGxhY2VtZW50LCBmbGlwQWxpZ25tZW50LCBmYWxsYmFja0F4aXNTaWRlRGlyZWN0aW9uLCBydGwpKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBsYWNlbWVudHMgPSBbaW5pdGlhbFBsYWNlbWVudCwgLi4uZmFsbGJhY2tQbGFjZW1lbnRzXTtcbiAgICAgIGNvbnN0IG92ZXJmbG93ID0gYXdhaXQgcGxhdGZvcm0uZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIGRldGVjdE92ZXJmbG93T3B0aW9ucyk7XG4gICAgICBjb25zdCBvdmVyZmxvd3MgPSBbXTtcbiAgICAgIGxldCBvdmVyZmxvd3NEYXRhID0gKChfbWlkZGxld2FyZURhdGEkZmxpcCA9IG1pZGRsZXdhcmVEYXRhLmZsaXApID09IG51bGwgPyB2b2lkIDAgOiBfbWlkZGxld2FyZURhdGEkZmxpcC5vdmVyZmxvd3MpIHx8IFtdO1xuICAgICAgaWYgKGNoZWNrTWFpbkF4aXMpIHtcbiAgICAgICAgb3ZlcmZsb3dzLnB1c2gob3ZlcmZsb3dbc2lkZV0pO1xuICAgICAgfVxuICAgICAgaWYgKGNoZWNrQ3Jvc3NBeGlzKSB7XG4gICAgICAgIGNvbnN0IHNpZGVzID0gZ2V0QWxpZ25tZW50U2lkZXMocGxhY2VtZW50LCByZWN0cywgcnRsKTtcbiAgICAgICAgb3ZlcmZsb3dzLnB1c2gob3ZlcmZsb3dbc2lkZXNbMF1dLCBvdmVyZmxvd1tzaWRlc1sxXV0pO1xuICAgICAgfVxuICAgICAgb3ZlcmZsb3dzRGF0YSA9IFsuLi5vdmVyZmxvd3NEYXRhLCB7XG4gICAgICAgIHBsYWNlbWVudCxcbiAgICAgICAgb3ZlcmZsb3dzXG4gICAgICB9XTtcblxuICAgICAgLy8gT25lIG9yIG1vcmUgc2lkZXMgaXMgb3ZlcmZsb3dpbmcuXG4gICAgICBpZiAoIW92ZXJmbG93cy5ldmVyeShzaWRlID0+IHNpZGUgPD0gMCkpIHtcbiAgICAgICAgdmFyIF9taWRkbGV3YXJlRGF0YSRmbGlwMiwgX292ZXJmbG93c0RhdGEkZmlsdGVyO1xuICAgICAgICBjb25zdCBuZXh0SW5kZXggPSAoKChfbWlkZGxld2FyZURhdGEkZmxpcDIgPSBtaWRkbGV3YXJlRGF0YS5mbGlwKSA9PSBudWxsID8gdm9pZCAwIDogX21pZGRsZXdhcmVEYXRhJGZsaXAyLmluZGV4KSB8fCAwKSArIDE7XG4gICAgICAgIGNvbnN0IG5leHRQbGFjZW1lbnQgPSBwbGFjZW1lbnRzW25leHRJbmRleF07XG4gICAgICAgIGlmIChuZXh0UGxhY2VtZW50KSB7XG4gICAgICAgICAgY29uc3QgaWdub3JlQ3Jvc3NBeGlzT3ZlcmZsb3cgPSBjaGVja0Nyb3NzQXhpcyA9PT0gJ2FsaWdubWVudCcgPyBpbml0aWFsU2lkZUF4aXMgIT09IGdldFNpZGVBeGlzKG5leHRQbGFjZW1lbnQpIDogZmFsc2U7XG4gICAgICAgICAgaWYgKCFpZ25vcmVDcm9zc0F4aXNPdmVyZmxvdyB8fFxuICAgICAgICAgIC8vIFdlIGxlYXZlIHRoZSBjdXJyZW50IG1haW4gYXhpcyBvbmx5IGlmIGV2ZXJ5IHBsYWNlbWVudCBvbiB0aGF0IGF4aXNcbiAgICAgICAgICAvLyBvdmVyZmxvd3MgdGhlIG1haW4gYXhpcy5cbiAgICAgICAgICBvdmVyZmxvd3NEYXRhLmV2ZXJ5KGQgPT4gZ2V0U2lkZUF4aXMoZC5wbGFjZW1lbnQpID09PSBpbml0aWFsU2lkZUF4aXMgPyBkLm92ZXJmbG93c1swXSA+IDAgOiB0cnVlKSkge1xuICAgICAgICAgICAgLy8gVHJ5IG5leHQgcGxhY2VtZW50IGFuZCByZS1ydW4gdGhlIGxpZmVjeWNsZS5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBpbmRleDogbmV4dEluZGV4LFxuICAgICAgICAgICAgICAgIG92ZXJmbG93czogb3ZlcmZsb3dzRGF0YVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICByZXNldDoge1xuICAgICAgICAgICAgICAgIHBsYWNlbWVudDogbmV4dFBsYWNlbWVudFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpcnN0LCBmaW5kIHRoZSBjYW5kaWRhdGVzIHRoYXQgZml0IG9uIHRoZSBtYWluQXhpcyBzaWRlIG9mIG92ZXJmbG93LFxuICAgICAgICAvLyB0aGVuIGZpbmQgdGhlIHBsYWNlbWVudCB0aGF0IGZpdHMgdGhlIGJlc3Qgb24gdGhlIG1haW4gY3Jvc3NBeGlzIHNpZGUuXG4gICAgICAgIGxldCByZXNldFBsYWNlbWVudCA9IChfb3ZlcmZsb3dzRGF0YSRmaWx0ZXIgPSBvdmVyZmxvd3NEYXRhLmZpbHRlcihkID0+IGQub3ZlcmZsb3dzWzBdIDw9IDApLnNvcnQoKGEsIGIpID0+IGEub3ZlcmZsb3dzWzFdIC0gYi5vdmVyZmxvd3NbMV0pWzBdKSA9PSBudWxsID8gdm9pZCAwIDogX292ZXJmbG93c0RhdGEkZmlsdGVyLnBsYWNlbWVudDtcblxuICAgICAgICAvLyBPdGhlcndpc2UgZmFsbGJhY2suXG4gICAgICAgIGlmICghcmVzZXRQbGFjZW1lbnQpIHtcbiAgICAgICAgICBzd2l0Y2ggKGZhbGxiYWNrU3RyYXRlZ3kpIHtcbiAgICAgICAgICAgIGNhc2UgJ2Jlc3RGaXQnOlxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIF9vdmVyZmxvd3NEYXRhJGZpbHRlcjI7XG4gICAgICAgICAgICAgICAgY29uc3QgcGxhY2VtZW50ID0gKF9vdmVyZmxvd3NEYXRhJGZpbHRlcjIgPSBvdmVyZmxvd3NEYXRhLmZpbHRlcihkID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChoYXNGYWxsYmFja0F4aXNTaWRlRGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTaWRlQXhpcyA9IGdldFNpZGVBeGlzKGQucGxhY2VtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRTaWRlQXhpcyA9PT0gaW5pdGlhbFNpZGVBeGlzIHx8XG4gICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIGJpYXMgdG8gdGhlIGB5YCBzaWRlIGF4aXMgZHVlIHRvIGhvcml6b250YWxcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVhZGluZyBkaXJlY3Rpb25zIGZhdm9yaW5nIGdyZWF0ZXIgd2lkdGguXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTaWRlQXhpcyA9PT0gJ3knO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSkubWFwKGQgPT4gW2QucGxhY2VtZW50LCBkLm92ZXJmbG93cy5maWx0ZXIob3ZlcmZsb3cgPT4gb3ZlcmZsb3cgPiAwKS5yZWR1Y2UoKGFjYywgb3ZlcmZsb3cpID0+IGFjYyArIG92ZXJmbG93LCAwKV0pLnNvcnQoKGEsIGIpID0+IGFbMV0gLSBiWzFdKVswXSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9vdmVyZmxvd3NEYXRhJGZpbHRlcjJbMF07XG4gICAgICAgICAgICAgICAgaWYgKHBsYWNlbWVudCkge1xuICAgICAgICAgICAgICAgICAgcmVzZXRQbGFjZW1lbnQgPSBwbGFjZW1lbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICdpbml0aWFsUGxhY2VtZW50JzpcbiAgICAgICAgICAgICAgcmVzZXRQbGFjZW1lbnQgPSBpbml0aWFsUGxhY2VtZW50O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBsYWNlbWVudCAhPT0gcmVzZXRQbGFjZW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzZXQ6IHtcbiAgICAgICAgICAgICAgcGxhY2VtZW50OiByZXNldFBsYWNlbWVudFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG59O1xuXG5mdW5jdGlvbiBnZXRTaWRlT2Zmc2V0cyhvdmVyZmxvdywgcmVjdCkge1xuICByZXR1cm4ge1xuICAgIHRvcDogb3ZlcmZsb3cudG9wIC0gcmVjdC5oZWlnaHQsXG4gICAgcmlnaHQ6IG92ZXJmbG93LnJpZ2h0IC0gcmVjdC53aWR0aCxcbiAgICBib3R0b206IG92ZXJmbG93LmJvdHRvbSAtIHJlY3QuaGVpZ2h0LFxuICAgIGxlZnQ6IG92ZXJmbG93LmxlZnQgLSByZWN0LndpZHRoXG4gIH07XG59XG5mdW5jdGlvbiBpc0FueVNpZGVGdWxseUNsaXBwZWQob3ZlcmZsb3cpIHtcbiAgcmV0dXJuIHNpZGVzLnNvbWUoc2lkZSA9PiBvdmVyZmxvd1tzaWRlXSA+PSAwKTtcbn1cbi8qKlxuICogUHJvdmlkZXMgZGF0YSB0byBoaWRlIHRoZSBmbG9hdGluZyBlbGVtZW50IGluIGFwcGxpY2FibGUgc2l0dWF0aW9ucywgc3VjaCBhc1xuICogd2hlbiBpdCBpcyBub3QgaW4gdGhlIHNhbWUgY2xpcHBpbmcgY29udGV4dCBhcyB0aGUgcmVmZXJlbmNlIGVsZW1lbnQuXG4gKiBAc2VlIGh0dHBzOi8vZmxvYXRpbmctdWkuY29tL2RvY3MvaGlkZVxuICovXG5jb25zdCBoaWRlID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdoaWRlJyxcbiAgICBvcHRpb25zLFxuICAgIGFzeW5jIGZuKHN0YXRlKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHJlY3RzLFxuICAgICAgICBwbGF0Zm9ybVxuICAgICAgfSA9IHN0YXRlO1xuICAgICAgY29uc3Qge1xuICAgICAgICBzdHJhdGVneSA9ICdyZWZlcmVuY2VIaWRkZW4nLFxuICAgICAgICAuLi5kZXRlY3RPdmVyZmxvd09wdGlvbnNcbiAgICAgIH0gPSBldmFsdWF0ZShvcHRpb25zLCBzdGF0ZSk7XG4gICAgICBzd2l0Y2ggKHN0cmF0ZWd5KSB7XG4gICAgICAgIGNhc2UgJ3JlZmVyZW5jZUhpZGRlbic6XG4gICAgICAgICAge1xuICAgICAgICAgICAgY29uc3Qgb3ZlcmZsb3cgPSBhd2FpdCBwbGF0Zm9ybS5kZXRlY3RPdmVyZmxvdyhzdGF0ZSwge1xuICAgICAgICAgICAgICAuLi5kZXRlY3RPdmVyZmxvd09wdGlvbnMsXG4gICAgICAgICAgICAgIGVsZW1lbnRDb250ZXh0OiAncmVmZXJlbmNlJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBvZmZzZXRzID0gZ2V0U2lkZU9mZnNldHMob3ZlcmZsb3csIHJlY3RzLnJlZmVyZW5jZSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlSGlkZGVuT2Zmc2V0czogb2Zmc2V0cyxcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VIaWRkZW46IGlzQW55U2lkZUZ1bGx5Q2xpcHBlZChvZmZzZXRzKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgY2FzZSAnZXNjYXBlZCc6XG4gICAgICAgICAge1xuICAgICAgICAgICAgY29uc3Qgb3ZlcmZsb3cgPSBhd2FpdCBwbGF0Zm9ybS5kZXRlY3RPdmVyZmxvdyhzdGF0ZSwge1xuICAgICAgICAgICAgICAuLi5kZXRlY3RPdmVyZmxvd09wdGlvbnMsXG4gICAgICAgICAgICAgIGFsdEJvdW5kYXJ5OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldHMgPSBnZXRTaWRlT2Zmc2V0cyhvdmVyZmxvdywgcmVjdHMuZmxvYXRpbmcpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGVzY2FwZWRPZmZzZXRzOiBvZmZzZXRzLFxuICAgICAgICAgICAgICAgIGVzY2FwZWQ6IGlzQW55U2lkZUZ1bGx5Q2xpcHBlZChvZmZzZXRzKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn07XG5cbmZ1bmN0aW9uIGdldEJvdW5kaW5nUmVjdChyZWN0cykge1xuICBjb25zdCBtaW5YID0gbWluKC4uLnJlY3RzLm1hcChyZWN0ID0+IHJlY3QubGVmdCkpO1xuICBjb25zdCBtaW5ZID0gbWluKC4uLnJlY3RzLm1hcChyZWN0ID0+IHJlY3QudG9wKSk7XG4gIGNvbnN0IG1heFggPSBtYXgoLi4ucmVjdHMubWFwKHJlY3QgPT4gcmVjdC5yaWdodCkpO1xuICBjb25zdCBtYXhZID0gbWF4KC4uLnJlY3RzLm1hcChyZWN0ID0+IHJlY3QuYm90dG9tKSk7XG4gIHJldHVybiB7XG4gICAgeDogbWluWCxcbiAgICB5OiBtaW5ZLFxuICAgIHdpZHRoOiBtYXhYIC0gbWluWCxcbiAgICBoZWlnaHQ6IG1heFkgLSBtaW5ZXG4gIH07XG59XG5mdW5jdGlvbiBnZXRSZWN0c0J5TGluZShyZWN0cykge1xuICBjb25zdCBzb3J0ZWRSZWN0cyA9IHJlY3RzLnNsaWNlKCkuc29ydCgoYSwgYikgPT4gYS55IC0gYi55KTtcbiAgY29uc3QgZ3JvdXBzID0gW107XG4gIGxldCBwcmV2UmVjdCA9IG51bGw7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc29ydGVkUmVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCByZWN0ID0gc29ydGVkUmVjdHNbaV07XG4gICAgaWYgKCFwcmV2UmVjdCB8fCByZWN0LnkgLSBwcmV2UmVjdC55ID4gcHJldlJlY3QuaGVpZ2h0IC8gMikge1xuICAgICAgZ3JvdXBzLnB1c2goW3JlY3RdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ3JvdXBzW2dyb3Vwcy5sZW5ndGggLSAxXS5wdXNoKHJlY3QpO1xuICAgIH1cbiAgICBwcmV2UmVjdCA9IHJlY3Q7XG4gIH1cbiAgcmV0dXJuIGdyb3Vwcy5tYXAocmVjdCA9PiByZWN0VG9DbGllbnRSZWN0KGdldEJvdW5kaW5nUmVjdChyZWN0KSkpO1xufVxuLyoqXG4gKiBQcm92aWRlcyBpbXByb3ZlZCBwb3NpdGlvbmluZyBmb3IgaW5saW5lIHJlZmVyZW5jZSBlbGVtZW50cyB0aGF0IGNhbiBzcGFuXG4gKiBvdmVyIG11bHRpcGxlIGxpbmVzLCBzdWNoIGFzIGh5cGVybGlua3Mgb3IgcmFuZ2Ugc2VsZWN0aW9ucy5cbiAqIEBzZWUgaHR0cHM6Ly9mbG9hdGluZy11aS5jb20vZG9jcy9pbmxpbmVcbiAqL1xuY29uc3QgaW5saW5lID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdpbmxpbmUnLFxuICAgIG9wdGlvbnMsXG4gICAgYXN5bmMgZm4oc3RhdGUpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgcGxhY2VtZW50LFxuICAgICAgICBlbGVtZW50cyxcbiAgICAgICAgcmVjdHMsXG4gICAgICAgIHBsYXRmb3JtLFxuICAgICAgICBzdHJhdGVneVxuICAgICAgfSA9IHN0YXRlO1xuICAgICAgLy8gQSBNb3VzZUV2ZW50J3MgY2xpZW50e1gsWX0gY29vcmRzIGNhbiBiZSB1cCB0byAyIHBpeGVscyBvZmYgYVxuICAgICAgLy8gQ2xpZW50UmVjdCdzIGJvdW5kcywgZGVzcGl0ZSB0aGUgZXZlbnQgbGlzdGVuZXIgYmVpbmcgdHJpZ2dlcmVkLiBBXG4gICAgICAvLyBwYWRkaW5nIG9mIDIgc2VlbXMgdG8gaGFuZGxlIHRoaXMgaXNzdWUuXG4gICAgICBjb25zdCB7XG4gICAgICAgIHBhZGRpbmcgPSAyLFxuICAgICAgICB4LFxuICAgICAgICB5XG4gICAgICB9ID0gZXZhbHVhdGUob3B0aW9ucywgc3RhdGUpO1xuICAgICAgY29uc3QgbmF0aXZlQ2xpZW50UmVjdHMgPSBBcnJheS5mcm9tKChhd2FpdCAocGxhdGZvcm0uZ2V0Q2xpZW50UmVjdHMgPT0gbnVsbCA/IHZvaWQgMCA6IHBsYXRmb3JtLmdldENsaWVudFJlY3RzKGVsZW1lbnRzLnJlZmVyZW5jZSkpKSB8fCBbXSk7XG4gICAgICBjb25zdCBjbGllbnRSZWN0cyA9IGdldFJlY3RzQnlMaW5lKG5hdGl2ZUNsaWVudFJlY3RzKTtcbiAgICAgIGNvbnN0IGZhbGxiYWNrID0gcmVjdFRvQ2xpZW50UmVjdChnZXRCb3VuZGluZ1JlY3QobmF0aXZlQ2xpZW50UmVjdHMpKTtcbiAgICAgIGNvbnN0IHBhZGRpbmdPYmplY3QgPSBnZXRQYWRkaW5nT2JqZWN0KHBhZGRpbmcpO1xuICAgICAgZnVuY3Rpb24gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkge1xuICAgICAgICAvLyBUaGVyZSBhcmUgdHdvIHJlY3RzIGFuZCB0aGV5IGFyZSBkaXNqb2luZWQuXG4gICAgICAgIGlmIChjbGllbnRSZWN0cy5sZW5ndGggPT09IDIgJiYgY2xpZW50UmVjdHNbMF0ubGVmdCA+IGNsaWVudFJlY3RzWzFdLnJpZ2h0ICYmIHggIT0gbnVsbCAmJiB5ICE9IG51bGwpIHtcbiAgICAgICAgICAvLyBGaW5kIHRoZSBmaXJzdCByZWN0IGluIHdoaWNoIHRoZSBwb2ludCBpcyBmdWxseSBpbnNpZGUuXG4gICAgICAgICAgcmV0dXJuIGNsaWVudFJlY3RzLmZpbmQocmVjdCA9PiB4ID4gcmVjdC5sZWZ0IC0gcGFkZGluZ09iamVjdC5sZWZ0ICYmIHggPCByZWN0LnJpZ2h0ICsgcGFkZGluZ09iamVjdC5yaWdodCAmJiB5ID4gcmVjdC50b3AgLSBwYWRkaW5nT2JqZWN0LnRvcCAmJiB5IDwgcmVjdC5ib3R0b20gKyBwYWRkaW5nT2JqZWN0LmJvdHRvbSkgfHwgZmFsbGJhY2s7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGVyZSBhcmUgMiBvciBtb3JlIGNvbm5lY3RlZCByZWN0cy5cbiAgICAgICAgaWYgKGNsaWVudFJlY3RzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgaWYgKGdldFNpZGVBeGlzKHBsYWNlbWVudCkgPT09ICd5Jykge1xuICAgICAgICAgICAgY29uc3QgZmlyc3RSZWN0ID0gY2xpZW50UmVjdHNbMF07XG4gICAgICAgICAgICBjb25zdCBsYXN0UmVjdCA9IGNsaWVudFJlY3RzW2NsaWVudFJlY3RzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgY29uc3QgaXNUb3AgPSBnZXRTaWRlKHBsYWNlbWVudCkgPT09ICd0b3AnO1xuICAgICAgICAgICAgY29uc3QgdG9wID0gZmlyc3RSZWN0LnRvcDtcbiAgICAgICAgICAgIGNvbnN0IGJvdHRvbSA9IGxhc3RSZWN0LmJvdHRvbTtcbiAgICAgICAgICAgIGNvbnN0IGxlZnQgPSBpc1RvcCA/IGZpcnN0UmVjdC5sZWZ0IDogbGFzdFJlY3QubGVmdDtcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0ID0gaXNUb3AgPyBmaXJzdFJlY3QucmlnaHQgOiBsYXN0UmVjdC5yaWdodDtcbiAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gcmlnaHQgLSBsZWZ0O1xuICAgICAgICAgICAgY29uc3QgaGVpZ2h0ID0gYm90dG9tIC0gdG9wO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdG9wLFxuICAgICAgICAgICAgICBib3R0b20sXG4gICAgICAgICAgICAgIGxlZnQsXG4gICAgICAgICAgICAgIHJpZ2h0LFxuICAgICAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgICAgICB4OiBsZWZ0LFxuICAgICAgICAgICAgICB5OiB0b3BcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGlzTGVmdFNpZGUgPSBnZXRTaWRlKHBsYWNlbWVudCkgPT09ICdsZWZ0JztcbiAgICAgICAgICBjb25zdCBtYXhSaWdodCA9IG1heCguLi5jbGllbnRSZWN0cy5tYXAocmVjdCA9PiByZWN0LnJpZ2h0KSk7XG4gICAgICAgICAgY29uc3QgbWluTGVmdCA9IG1pbiguLi5jbGllbnRSZWN0cy5tYXAocmVjdCA9PiByZWN0LmxlZnQpKTtcbiAgICAgICAgICBjb25zdCBtZWFzdXJlUmVjdHMgPSBjbGllbnRSZWN0cy5maWx0ZXIocmVjdCA9PiBpc0xlZnRTaWRlID8gcmVjdC5sZWZ0ID09PSBtaW5MZWZ0IDogcmVjdC5yaWdodCA9PT0gbWF4UmlnaHQpO1xuICAgICAgICAgIGNvbnN0IHRvcCA9IG1lYXN1cmVSZWN0c1swXS50b3A7XG4gICAgICAgICAgY29uc3QgYm90dG9tID0gbWVhc3VyZVJlY3RzW21lYXN1cmVSZWN0cy5sZW5ndGggLSAxXS5ib3R0b207XG4gICAgICAgICAgY29uc3QgbGVmdCA9IG1pbkxlZnQ7XG4gICAgICAgICAgY29uc3QgcmlnaHQgPSBtYXhSaWdodDtcbiAgICAgICAgICBjb25zdCB3aWR0aCA9IHJpZ2h0IC0gbGVmdDtcbiAgICAgICAgICBjb25zdCBoZWlnaHQgPSBib3R0b20gLSB0b3A7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcCxcbiAgICAgICAgICAgIGJvdHRvbSxcbiAgICAgICAgICAgIGxlZnQsXG4gICAgICAgICAgICByaWdodCxcbiAgICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgICAgeDogbGVmdCxcbiAgICAgICAgICAgIHk6IHRvcFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbGxiYWNrO1xuICAgICAgfVxuICAgICAgY29uc3QgcmVzZXRSZWN0cyA9IGF3YWl0IHBsYXRmb3JtLmdldEVsZW1lbnRSZWN0cyh7XG4gICAgICAgIHJlZmVyZW5jZToge1xuICAgICAgICAgIGdldEJvdW5kaW5nQ2xpZW50UmVjdFxuICAgICAgICB9LFxuICAgICAgICBmbG9hdGluZzogZWxlbWVudHMuZmxvYXRpbmcsXG4gICAgICAgIHN0cmF0ZWd5XG4gICAgICB9KTtcbiAgICAgIGlmIChyZWN0cy5yZWZlcmVuY2UueCAhPT0gcmVzZXRSZWN0cy5yZWZlcmVuY2UueCB8fCByZWN0cy5yZWZlcmVuY2UueSAhPT0gcmVzZXRSZWN0cy5yZWZlcmVuY2UueSB8fCByZWN0cy5yZWZlcmVuY2Uud2lkdGggIT09IHJlc2V0UmVjdHMucmVmZXJlbmNlLndpZHRoIHx8IHJlY3RzLnJlZmVyZW5jZS5oZWlnaHQgIT09IHJlc2V0UmVjdHMucmVmZXJlbmNlLmhlaWdodCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlc2V0OiB7XG4gICAgICAgICAgICByZWN0czogcmVzZXRSZWN0c1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG59O1xuXG5jb25zdCBvcmlnaW5TaWRlcyA9IC8qI19fUFVSRV9fKi9uZXcgU2V0KFsnbGVmdCcsICd0b3AnXSk7XG5cbi8vIEZvciB0eXBlIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5LCB0aGUgYE9mZnNldE9wdGlvbnNgIHR5cGUgd2FzIGFsc29cbi8vIERlcml2YWJsZS5cblxuYXN5bmMgZnVuY3Rpb24gY29udmVydFZhbHVlVG9Db29yZHMoc3RhdGUsIG9wdGlvbnMpIHtcbiAgY29uc3Qge1xuICAgIHBsYWNlbWVudCxcbiAgICBwbGF0Zm9ybSxcbiAgICBlbGVtZW50c1xuICB9ID0gc3RhdGU7XG4gIGNvbnN0IHJ0bCA9IGF3YWl0IChwbGF0Zm9ybS5pc1JUTCA9PSBudWxsID8gdm9pZCAwIDogcGxhdGZvcm0uaXNSVEwoZWxlbWVudHMuZmxvYXRpbmcpKTtcbiAgY29uc3Qgc2lkZSA9IGdldFNpZGUocGxhY2VtZW50KTtcbiAgY29uc3QgYWxpZ25tZW50ID0gZ2V0QWxpZ25tZW50KHBsYWNlbWVudCk7XG4gIGNvbnN0IGlzVmVydGljYWwgPSBnZXRTaWRlQXhpcyhwbGFjZW1lbnQpID09PSAneSc7XG4gIGNvbnN0IG1haW5BeGlzTXVsdGkgPSBvcmlnaW5TaWRlcy5oYXMoc2lkZSkgPyAtMSA6IDE7XG4gIGNvbnN0IGNyb3NzQXhpc011bHRpID0gcnRsICYmIGlzVmVydGljYWwgPyAtMSA6IDE7XG4gIGNvbnN0IHJhd1ZhbHVlID0gZXZhbHVhdGUob3B0aW9ucywgc3RhdGUpO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItY29uc3RcbiAgbGV0IHtcbiAgICBtYWluQXhpcyxcbiAgICBjcm9zc0F4aXMsXG4gICAgYWxpZ25tZW50QXhpc1xuICB9ID0gdHlwZW9mIHJhd1ZhbHVlID09PSAnbnVtYmVyJyA/IHtcbiAgICBtYWluQXhpczogcmF3VmFsdWUsXG4gICAgY3Jvc3NBeGlzOiAwLFxuICAgIGFsaWdubWVudEF4aXM6IG51bGxcbiAgfSA6IHtcbiAgICBtYWluQXhpczogcmF3VmFsdWUubWFpbkF4aXMgfHwgMCxcbiAgICBjcm9zc0F4aXM6IHJhd1ZhbHVlLmNyb3NzQXhpcyB8fCAwLFxuICAgIGFsaWdubWVudEF4aXM6IHJhd1ZhbHVlLmFsaWdubWVudEF4aXNcbiAgfTtcbiAgaWYgKGFsaWdubWVudCAmJiB0eXBlb2YgYWxpZ25tZW50QXhpcyA9PT0gJ251bWJlcicpIHtcbiAgICBjcm9zc0F4aXMgPSBhbGlnbm1lbnQgPT09ICdlbmQnID8gYWxpZ25tZW50QXhpcyAqIC0xIDogYWxpZ25tZW50QXhpcztcbiAgfVxuICByZXR1cm4gaXNWZXJ0aWNhbCA/IHtcbiAgICB4OiBjcm9zc0F4aXMgKiBjcm9zc0F4aXNNdWx0aSxcbiAgICB5OiBtYWluQXhpcyAqIG1haW5BeGlzTXVsdGlcbiAgfSA6IHtcbiAgICB4OiBtYWluQXhpcyAqIG1haW5BeGlzTXVsdGksXG4gICAgeTogY3Jvc3NBeGlzICogY3Jvc3NBeGlzTXVsdGlcbiAgfTtcbn1cblxuLyoqXG4gKiBNb2RpZmllcyB0aGUgcGxhY2VtZW50IGJ5IHRyYW5zbGF0aW5nIHRoZSBmbG9hdGluZyBlbGVtZW50IGFsb25nIHRoZVxuICogc3BlY2lmaWVkIGF4ZXMuXG4gKiBBIG51bWJlciAoc2hvcnRoYW5kIGZvciBgbWFpbkF4aXNgIG9yIGRpc3RhbmNlKSwgb3IgYW4gYXhlcyBjb25maWd1cmF0aW9uXG4gKiBvYmplY3QgbWF5IGJlIHBhc3NlZC5cbiAqIEBzZWUgaHR0cHM6Ly9mbG9hdGluZy11aS5jb20vZG9jcy9vZmZzZXRcbiAqL1xuY29uc3Qgb2Zmc2V0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSAwO1xuICB9XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ29mZnNldCcsXG4gICAgb3B0aW9ucyxcbiAgICBhc3luYyBmbihzdGF0ZSkge1xuICAgICAgdmFyIF9taWRkbGV3YXJlRGF0YSRvZmZzZSwgX21pZGRsZXdhcmVEYXRhJGFycm93O1xuICAgICAgY29uc3Qge1xuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICBwbGFjZW1lbnQsXG4gICAgICAgIG1pZGRsZXdhcmVEYXRhXG4gICAgICB9ID0gc3RhdGU7XG4gICAgICBjb25zdCBkaWZmQ29vcmRzID0gYXdhaXQgY29udmVydFZhbHVlVG9Db29yZHMoc3RhdGUsIG9wdGlvbnMpO1xuXG4gICAgICAvLyBJZiB0aGUgcGxhY2VtZW50IGlzIHRoZSBzYW1lIGFuZCB0aGUgYXJyb3cgY2F1c2VkIGFuIGFsaWdubWVudCBvZmZzZXRcbiAgICAgIC8vIHRoZW4gd2UgZG9uJ3QgbmVlZCB0byBjaGFuZ2UgdGhlIHBvc2l0aW9uaW5nIGNvb3JkaW5hdGVzLlxuICAgICAgaWYgKHBsYWNlbWVudCA9PT0gKChfbWlkZGxld2FyZURhdGEkb2Zmc2UgPSBtaWRkbGV3YXJlRGF0YS5vZmZzZXQpID09IG51bGwgPyB2b2lkIDAgOiBfbWlkZGxld2FyZURhdGEkb2Zmc2UucGxhY2VtZW50KSAmJiAoX21pZGRsZXdhcmVEYXRhJGFycm93ID0gbWlkZGxld2FyZURhdGEuYXJyb3cpICE9IG51bGwgJiYgX21pZGRsZXdhcmVEYXRhJGFycm93LmFsaWdubWVudE9mZnNldCkge1xuICAgICAgICByZXR1cm4ge307XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiB4ICsgZGlmZkNvb3Jkcy54LFxuICAgICAgICB5OiB5ICsgZGlmZkNvb3Jkcy55LFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgLi4uZGlmZkNvb3JkcyxcbiAgICAgICAgICBwbGFjZW1lbnRcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG59O1xuXG4vKipcbiAqIE9wdGltaXplcyB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgZmxvYXRpbmcgZWxlbWVudCBieSBzaGlmdGluZyBpdCBpbiBvcmRlciB0b1xuICoga2VlcCBpdCBpbiB2aWV3IHdoZW4gaXQgd2lsbCBvdmVyZmxvdyB0aGUgY2xpcHBpbmcgYm91bmRhcnkuXG4gKiBAc2VlIGh0dHBzOi8vZmxvYXRpbmctdWkuY29tL2RvY3Mvc2hpZnRcbiAqL1xuY29uc3Qgc2hpZnQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3NoaWZ0JyxcbiAgICBvcHRpb25zLFxuICAgIGFzeW5jIGZuKHN0YXRlKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHBsYWNlbWVudCxcbiAgICAgICAgcGxhdGZvcm1cbiAgICAgIH0gPSBzdGF0ZTtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgbWFpbkF4aXM6IGNoZWNrTWFpbkF4aXMgPSB0cnVlLFxuICAgICAgICBjcm9zc0F4aXM6IGNoZWNrQ3Jvc3NBeGlzID0gZmFsc2UsXG4gICAgICAgIGxpbWl0ZXIgPSB7XG4gICAgICAgICAgZm46IF9yZWYgPT4ge1xuICAgICAgICAgICAgbGV0IHtcbiAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgeVxuICAgICAgICAgICAgfSA9IF9yZWY7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICB5XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLi4uZGV0ZWN0T3ZlcmZsb3dPcHRpb25zXG4gICAgICB9ID0gZXZhbHVhdGUob3B0aW9ucywgc3RhdGUpO1xuICAgICAgY29uc3QgY29vcmRzID0ge1xuICAgICAgICB4LFxuICAgICAgICB5XG4gICAgICB9O1xuICAgICAgY29uc3Qgb3ZlcmZsb3cgPSBhd2FpdCBwbGF0Zm9ybS5kZXRlY3RPdmVyZmxvdyhzdGF0ZSwgZGV0ZWN0T3ZlcmZsb3dPcHRpb25zKTtcbiAgICAgIGNvbnN0IGNyb3NzQXhpcyA9IGdldFNpZGVBeGlzKGdldFNpZGUocGxhY2VtZW50KSk7XG4gICAgICBjb25zdCBtYWluQXhpcyA9IGdldE9wcG9zaXRlQXhpcyhjcm9zc0F4aXMpO1xuICAgICAgbGV0IG1haW5BeGlzQ29vcmQgPSBjb29yZHNbbWFpbkF4aXNdO1xuICAgICAgbGV0IGNyb3NzQXhpc0Nvb3JkID0gY29vcmRzW2Nyb3NzQXhpc107XG4gICAgICBpZiAoY2hlY2tNYWluQXhpcykge1xuICAgICAgICBjb25zdCBtaW5TaWRlID0gbWFpbkF4aXMgPT09ICd5JyA/ICd0b3AnIDogJ2xlZnQnO1xuICAgICAgICBjb25zdCBtYXhTaWRlID0gbWFpbkF4aXMgPT09ICd5JyA/ICdib3R0b20nIDogJ3JpZ2h0JztcbiAgICAgICAgY29uc3QgbWluID0gbWFpbkF4aXNDb29yZCArIG92ZXJmbG93W21pblNpZGVdO1xuICAgICAgICBjb25zdCBtYXggPSBtYWluQXhpc0Nvb3JkIC0gb3ZlcmZsb3dbbWF4U2lkZV07XG4gICAgICAgIG1haW5BeGlzQ29vcmQgPSBjbGFtcChtaW4sIG1haW5BeGlzQ29vcmQsIG1heCk7XG4gICAgICB9XG4gICAgICBpZiAoY2hlY2tDcm9zc0F4aXMpIHtcbiAgICAgICAgY29uc3QgbWluU2lkZSA9IGNyb3NzQXhpcyA9PT0gJ3knID8gJ3RvcCcgOiAnbGVmdCc7XG4gICAgICAgIGNvbnN0IG1heFNpZGUgPSBjcm9zc0F4aXMgPT09ICd5JyA/ICdib3R0b20nIDogJ3JpZ2h0JztcbiAgICAgICAgY29uc3QgbWluID0gY3Jvc3NBeGlzQ29vcmQgKyBvdmVyZmxvd1ttaW5TaWRlXTtcbiAgICAgICAgY29uc3QgbWF4ID0gY3Jvc3NBeGlzQ29vcmQgLSBvdmVyZmxvd1ttYXhTaWRlXTtcbiAgICAgICAgY3Jvc3NBeGlzQ29vcmQgPSBjbGFtcChtaW4sIGNyb3NzQXhpc0Nvb3JkLCBtYXgpO1xuICAgICAgfVxuICAgICAgY29uc3QgbGltaXRlZENvb3JkcyA9IGxpbWl0ZXIuZm4oe1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgW21haW5BeGlzXTogbWFpbkF4aXNDb29yZCxcbiAgICAgICAgW2Nyb3NzQXhpc106IGNyb3NzQXhpc0Nvb3JkXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmxpbWl0ZWRDb29yZHMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB4OiBsaW1pdGVkQ29vcmRzLnggLSB4LFxuICAgICAgICAgIHk6IGxpbWl0ZWRDb29yZHMueSAtIHksXG4gICAgICAgICAgZW5hYmxlZDoge1xuICAgICAgICAgICAgW21haW5BeGlzXTogY2hlY2tNYWluQXhpcyxcbiAgICAgICAgICAgIFtjcm9zc0F4aXNdOiBjaGVja0Nyb3NzQXhpc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG59O1xuLyoqXG4gKiBCdWlsdC1pbiBgbGltaXRlcmAgdGhhdCB3aWxsIHN0b3AgYHNoaWZ0KClgIGF0IGEgY2VydGFpbiBwb2ludC5cbiAqL1xuY29uc3QgbGltaXRTaGlmdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBvcHRpb25zLFxuICAgIGZuKHN0YXRlKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHgsXG4gICAgICAgIHksXG4gICAgICAgIHBsYWNlbWVudCxcbiAgICAgICAgcmVjdHMsXG4gICAgICAgIG1pZGRsZXdhcmVEYXRhXG4gICAgICB9ID0gc3RhdGU7XG4gICAgICBjb25zdCB7XG4gICAgICAgIG9mZnNldCA9IDAsXG4gICAgICAgIG1haW5BeGlzOiBjaGVja01haW5BeGlzID0gdHJ1ZSxcbiAgICAgICAgY3Jvc3NBeGlzOiBjaGVja0Nyb3NzQXhpcyA9IHRydWVcbiAgICAgIH0gPSBldmFsdWF0ZShvcHRpb25zLCBzdGF0ZSk7XG4gICAgICBjb25zdCBjb29yZHMgPSB7XG4gICAgICAgIHgsXG4gICAgICAgIHlcbiAgICAgIH07XG4gICAgICBjb25zdCBjcm9zc0F4aXMgPSBnZXRTaWRlQXhpcyhwbGFjZW1lbnQpO1xuICAgICAgY29uc3QgbWFpbkF4aXMgPSBnZXRPcHBvc2l0ZUF4aXMoY3Jvc3NBeGlzKTtcbiAgICAgIGxldCBtYWluQXhpc0Nvb3JkID0gY29vcmRzW21haW5BeGlzXTtcbiAgICAgIGxldCBjcm9zc0F4aXNDb29yZCA9IGNvb3Jkc1tjcm9zc0F4aXNdO1xuICAgICAgY29uc3QgcmF3T2Zmc2V0ID0gZXZhbHVhdGUob2Zmc2V0LCBzdGF0ZSk7XG4gICAgICBjb25zdCBjb21wdXRlZE9mZnNldCA9IHR5cGVvZiByYXdPZmZzZXQgPT09ICdudW1iZXInID8ge1xuICAgICAgICBtYWluQXhpczogcmF3T2Zmc2V0LFxuICAgICAgICBjcm9zc0F4aXM6IDBcbiAgICAgIH0gOiB7XG4gICAgICAgIG1haW5BeGlzOiAwLFxuICAgICAgICBjcm9zc0F4aXM6IDAsXG4gICAgICAgIC4uLnJhd09mZnNldFxuICAgICAgfTtcbiAgICAgIGlmIChjaGVja01haW5BeGlzKSB7XG4gICAgICAgIGNvbnN0IGxlbiA9IG1haW5BeGlzID09PSAneScgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG4gICAgICAgIGNvbnN0IGxpbWl0TWluID0gcmVjdHMucmVmZXJlbmNlW21haW5BeGlzXSAtIHJlY3RzLmZsb2F0aW5nW2xlbl0gKyBjb21wdXRlZE9mZnNldC5tYWluQXhpcztcbiAgICAgICAgY29uc3QgbGltaXRNYXggPSByZWN0cy5yZWZlcmVuY2VbbWFpbkF4aXNdICsgcmVjdHMucmVmZXJlbmNlW2xlbl0gLSBjb21wdXRlZE9mZnNldC5tYWluQXhpcztcbiAgICAgICAgaWYgKG1haW5BeGlzQ29vcmQgPCBsaW1pdE1pbikge1xuICAgICAgICAgIG1haW5BeGlzQ29vcmQgPSBsaW1pdE1pbjtcbiAgICAgICAgfSBlbHNlIGlmIChtYWluQXhpc0Nvb3JkID4gbGltaXRNYXgpIHtcbiAgICAgICAgICBtYWluQXhpc0Nvb3JkID0gbGltaXRNYXg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjaGVja0Nyb3NzQXhpcykge1xuICAgICAgICB2YXIgX21pZGRsZXdhcmVEYXRhJG9mZnNlLCBfbWlkZGxld2FyZURhdGEkb2Zmc2UyO1xuICAgICAgICBjb25zdCBsZW4gPSBtYWluQXhpcyA9PT0gJ3knID8gJ3dpZHRoJyA6ICdoZWlnaHQnO1xuICAgICAgICBjb25zdCBpc09yaWdpblNpZGUgPSBvcmlnaW5TaWRlcy5oYXMoZ2V0U2lkZShwbGFjZW1lbnQpKTtcbiAgICAgICAgY29uc3QgbGltaXRNaW4gPSByZWN0cy5yZWZlcmVuY2VbY3Jvc3NBeGlzXSAtIHJlY3RzLmZsb2F0aW5nW2xlbl0gKyAoaXNPcmlnaW5TaWRlID8gKChfbWlkZGxld2FyZURhdGEkb2Zmc2UgPSBtaWRkbGV3YXJlRGF0YS5vZmZzZXQpID09IG51bGwgPyB2b2lkIDAgOiBfbWlkZGxld2FyZURhdGEkb2Zmc2VbY3Jvc3NBeGlzXSkgfHwgMCA6IDApICsgKGlzT3JpZ2luU2lkZSA/IDAgOiBjb21wdXRlZE9mZnNldC5jcm9zc0F4aXMpO1xuICAgICAgICBjb25zdCBsaW1pdE1heCA9IHJlY3RzLnJlZmVyZW5jZVtjcm9zc0F4aXNdICsgcmVjdHMucmVmZXJlbmNlW2xlbl0gKyAoaXNPcmlnaW5TaWRlID8gMCA6ICgoX21pZGRsZXdhcmVEYXRhJG9mZnNlMiA9IG1pZGRsZXdhcmVEYXRhLm9mZnNldCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9taWRkbGV3YXJlRGF0YSRvZmZzZTJbY3Jvc3NBeGlzXSkgfHwgMCkgLSAoaXNPcmlnaW5TaWRlID8gY29tcHV0ZWRPZmZzZXQuY3Jvc3NBeGlzIDogMCk7XG4gICAgICAgIGlmIChjcm9zc0F4aXNDb29yZCA8IGxpbWl0TWluKSB7XG4gICAgICAgICAgY3Jvc3NBeGlzQ29vcmQgPSBsaW1pdE1pbjtcbiAgICAgICAgfSBlbHNlIGlmIChjcm9zc0F4aXNDb29yZCA+IGxpbWl0TWF4KSB7XG4gICAgICAgICAgY3Jvc3NBeGlzQ29vcmQgPSBsaW1pdE1heDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgW21haW5BeGlzXTogbWFpbkF4aXNDb29yZCxcbiAgICAgICAgW2Nyb3NzQXhpc106IGNyb3NzQXhpc0Nvb3JkXG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn07XG5cbi8qKlxuICogUHJvdmlkZXMgZGF0YSB0aGF0IGFsbG93cyB5b3UgdG8gY2hhbmdlIHRoZSBzaXplIG9mIHRoZSBmbG9hdGluZyBlbGVtZW50IOKAlFxuICogZm9yIGluc3RhbmNlLCBwcmV2ZW50IGl0IGZyb20gb3ZlcmZsb3dpbmcgdGhlIGNsaXBwaW5nIGJvdW5kYXJ5IG9yIG1hdGNoIHRoZVxuICogd2lkdGggb2YgdGhlIHJlZmVyZW5jZSBlbGVtZW50LlxuICogQHNlZSBodHRwczovL2Zsb2F0aW5nLXVpLmNvbS9kb2NzL3NpemVcbiAqL1xuY29uc3Qgc2l6ZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnc2l6ZScsXG4gICAgb3B0aW9ucyxcbiAgICBhc3luYyBmbihzdGF0ZSkge1xuICAgICAgdmFyIF9zdGF0ZSRtaWRkbGV3YXJlRGF0YSwgX3N0YXRlJG1pZGRsZXdhcmVEYXRhMjtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgcGxhY2VtZW50LFxuICAgICAgICByZWN0cyxcbiAgICAgICAgcGxhdGZvcm0sXG4gICAgICAgIGVsZW1lbnRzXG4gICAgICB9ID0gc3RhdGU7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGFwcGx5ID0gKCkgPT4ge30sXG4gICAgICAgIC4uLmRldGVjdE92ZXJmbG93T3B0aW9uc1xuICAgICAgfSA9IGV2YWx1YXRlKG9wdGlvbnMsIHN0YXRlKTtcbiAgICAgIGNvbnN0IG92ZXJmbG93ID0gYXdhaXQgcGxhdGZvcm0uZGV0ZWN0T3ZlcmZsb3coc3RhdGUsIGRldGVjdE92ZXJmbG93T3B0aW9ucyk7XG4gICAgICBjb25zdCBzaWRlID0gZ2V0U2lkZShwbGFjZW1lbnQpO1xuICAgICAgY29uc3QgYWxpZ25tZW50ID0gZ2V0QWxpZ25tZW50KHBsYWNlbWVudCk7XG4gICAgICBjb25zdCBpc1lBeGlzID0gZ2V0U2lkZUF4aXMocGxhY2VtZW50KSA9PT0gJ3knO1xuICAgICAgY29uc3Qge1xuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0XG4gICAgICB9ID0gcmVjdHMuZmxvYXRpbmc7XG4gICAgICBsZXQgaGVpZ2h0U2lkZTtcbiAgICAgIGxldCB3aWR0aFNpZGU7XG4gICAgICBpZiAoc2lkZSA9PT0gJ3RvcCcgfHwgc2lkZSA9PT0gJ2JvdHRvbScpIHtcbiAgICAgICAgaGVpZ2h0U2lkZSA9IHNpZGU7XG4gICAgICAgIHdpZHRoU2lkZSA9IGFsaWdubWVudCA9PT0gKChhd2FpdCAocGxhdGZvcm0uaXNSVEwgPT0gbnVsbCA/IHZvaWQgMCA6IHBsYXRmb3JtLmlzUlRMKGVsZW1lbnRzLmZsb2F0aW5nKSkpID8gJ3N0YXJ0JyA6ICdlbmQnKSA/ICdsZWZ0JyA6ICdyaWdodCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aWR0aFNpZGUgPSBzaWRlO1xuICAgICAgICBoZWlnaHRTaWRlID0gYWxpZ25tZW50ID09PSAnZW5kJyA/ICd0b3AnIDogJ2JvdHRvbSc7XG4gICAgICB9XG4gICAgICBjb25zdCBtYXhpbXVtQ2xpcHBpbmdIZWlnaHQgPSBoZWlnaHQgLSBvdmVyZmxvdy50b3AgLSBvdmVyZmxvdy5ib3R0b207XG4gICAgICBjb25zdCBtYXhpbXVtQ2xpcHBpbmdXaWR0aCA9IHdpZHRoIC0gb3ZlcmZsb3cubGVmdCAtIG92ZXJmbG93LnJpZ2h0O1xuICAgICAgY29uc3Qgb3ZlcmZsb3dBdmFpbGFibGVIZWlnaHQgPSBtaW4oaGVpZ2h0IC0gb3ZlcmZsb3dbaGVpZ2h0U2lkZV0sIG1heGltdW1DbGlwcGluZ0hlaWdodCk7XG4gICAgICBjb25zdCBvdmVyZmxvd0F2YWlsYWJsZVdpZHRoID0gbWluKHdpZHRoIC0gb3ZlcmZsb3dbd2lkdGhTaWRlXSwgbWF4aW11bUNsaXBwaW5nV2lkdGgpO1xuICAgICAgY29uc3Qgbm9TaGlmdCA9ICFzdGF0ZS5taWRkbGV3YXJlRGF0YS5zaGlmdDtcbiAgICAgIGxldCBhdmFpbGFibGVIZWlnaHQgPSBvdmVyZmxvd0F2YWlsYWJsZUhlaWdodDtcbiAgICAgIGxldCBhdmFpbGFibGVXaWR0aCA9IG92ZXJmbG93QXZhaWxhYmxlV2lkdGg7XG4gICAgICBpZiAoKF9zdGF0ZSRtaWRkbGV3YXJlRGF0YSA9IHN0YXRlLm1pZGRsZXdhcmVEYXRhLnNoaWZ0KSAhPSBudWxsICYmIF9zdGF0ZSRtaWRkbGV3YXJlRGF0YS5lbmFibGVkLngpIHtcbiAgICAgICAgYXZhaWxhYmxlV2lkdGggPSBtYXhpbXVtQ2xpcHBpbmdXaWR0aDtcbiAgICAgIH1cbiAgICAgIGlmICgoX3N0YXRlJG1pZGRsZXdhcmVEYXRhMiA9IHN0YXRlLm1pZGRsZXdhcmVEYXRhLnNoaWZ0KSAhPSBudWxsICYmIF9zdGF0ZSRtaWRkbGV3YXJlRGF0YTIuZW5hYmxlZC55KSB7XG4gICAgICAgIGF2YWlsYWJsZUhlaWdodCA9IG1heGltdW1DbGlwcGluZ0hlaWdodDtcbiAgICAgIH1cbiAgICAgIGlmIChub1NoaWZ0ICYmICFhbGlnbm1lbnQpIHtcbiAgICAgICAgY29uc3QgeE1pbiA9IG1heChvdmVyZmxvdy5sZWZ0LCAwKTtcbiAgICAgICAgY29uc3QgeE1heCA9IG1heChvdmVyZmxvdy5yaWdodCwgMCk7XG4gICAgICAgIGNvbnN0IHlNaW4gPSBtYXgob3ZlcmZsb3cudG9wLCAwKTtcbiAgICAgICAgY29uc3QgeU1heCA9IG1heChvdmVyZmxvdy5ib3R0b20sIDApO1xuICAgICAgICBpZiAoaXNZQXhpcykge1xuICAgICAgICAgIGF2YWlsYWJsZVdpZHRoID0gd2lkdGggLSAyICogKHhNaW4gIT09IDAgfHwgeE1heCAhPT0gMCA/IHhNaW4gKyB4TWF4IDogbWF4KG92ZXJmbG93LmxlZnQsIG92ZXJmbG93LnJpZ2h0KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXZhaWxhYmxlSGVpZ2h0ID0gaGVpZ2h0IC0gMiAqICh5TWluICE9PSAwIHx8IHlNYXggIT09IDAgPyB5TWluICsgeU1heCA6IG1heChvdmVyZmxvdy50b3AsIG92ZXJmbG93LmJvdHRvbSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhd2FpdCBhcHBseSh7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBhdmFpbGFibGVXaWR0aCxcbiAgICAgICAgYXZhaWxhYmxlSGVpZ2h0XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG5leHREaW1lbnNpb25zID0gYXdhaXQgcGxhdGZvcm0uZ2V0RGltZW5zaW9ucyhlbGVtZW50cy5mbG9hdGluZyk7XG4gICAgICBpZiAod2lkdGggIT09IG5leHREaW1lbnNpb25zLndpZHRoIHx8IGhlaWdodCAhPT0gbmV4dERpbWVuc2lvbnMuaGVpZ2h0KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcmVzZXQ6IHtcbiAgICAgICAgICAgIHJlY3RzOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydCB7IGFycm93LCBhdXRvUGxhY2VtZW50LCBjb21wdXRlUG9zaXRpb24sIGRldGVjdE92ZXJmbG93LCBmbGlwLCBoaWRlLCBpbmxpbmUsIGxpbWl0U2hpZnQsIG9mZnNldCwgc2hpZnQsIHNpemUgfTtcbiIsImZ1bmN0aW9uIGhhc1dpbmRvdygpIHtcbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xufVxuZnVuY3Rpb24gZ2V0Tm9kZU5hbWUobm9kZSkge1xuICBpZiAoaXNOb2RlKG5vZGUpKSB7XG4gICAgcmV0dXJuIChub2RlLm5vZGVOYW1lIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICB9XG4gIC8vIE1vY2tlZCBub2RlcyBpbiB0ZXN0aW5nIGVudmlyb25tZW50cyBtYXkgbm90IGJlIGluc3RhbmNlcyBvZiBOb2RlLiBCeVxuICAvLyByZXR1cm5pbmcgYCNkb2N1bWVudGAgYW4gaW5maW5pdGUgbG9vcCB3b24ndCBvY2N1ci5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2Zsb2F0aW5nLXVpL2Zsb2F0aW5nLXVpL2lzc3Vlcy8yMzE3XG4gIHJldHVybiAnI2RvY3VtZW50Jztcbn1cbmZ1bmN0aW9uIGdldFdpbmRvdyhub2RlKSB7XG4gIHZhciBfbm9kZSRvd25lckRvY3VtZW50O1xuICByZXR1cm4gKG5vZGUgPT0gbnVsbCB8fCAoX25vZGUkb3duZXJEb2N1bWVudCA9IG5vZGUub3duZXJEb2N1bWVudCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9ub2RlJG93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcpIHx8IHdpbmRvdztcbn1cbmZ1bmN0aW9uIGdldERvY3VtZW50RWxlbWVudChub2RlKSB7XG4gIHZhciBfcmVmO1xuICByZXR1cm4gKF9yZWYgPSAoaXNOb2RlKG5vZGUpID8gbm9kZS5vd25lckRvY3VtZW50IDogbm9kZS5kb2N1bWVudCkgfHwgd2luZG93LmRvY3VtZW50KSA9PSBudWxsID8gdm9pZCAwIDogX3JlZi5kb2N1bWVudEVsZW1lbnQ7XG59XG5mdW5jdGlvbiBpc05vZGUodmFsdWUpIHtcbiAgaWYgKCFoYXNXaW5kb3coKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBOb2RlIHx8IHZhbHVlIGluc3RhbmNlb2YgZ2V0V2luZG93KHZhbHVlKS5Ob2RlO1xufVxuZnVuY3Rpb24gaXNFbGVtZW50KHZhbHVlKSB7XG4gIGlmICghaGFzV2luZG93KCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRWxlbWVudCB8fCB2YWx1ZSBpbnN0YW5jZW9mIGdldFdpbmRvdyh2YWx1ZSkuRWxlbWVudDtcbn1cbmZ1bmN0aW9uIGlzSFRNTEVsZW1lbnQodmFsdWUpIHtcbiAgaWYgKCFoYXNXaW5kb3coKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fCB2YWx1ZSBpbnN0YW5jZW9mIGdldFdpbmRvdyh2YWx1ZSkuSFRNTEVsZW1lbnQ7XG59XG5mdW5jdGlvbiBpc1NoYWRvd1Jvb3QodmFsdWUpIHtcbiAgaWYgKCFoYXNXaW5kb3coKSB8fCB0eXBlb2YgU2hhZG93Um9vdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgU2hhZG93Um9vdCB8fCB2YWx1ZSBpbnN0YW5jZW9mIGdldFdpbmRvdyh2YWx1ZSkuU2hhZG93Um9vdDtcbn1cbmZ1bmN0aW9uIGlzT3ZlcmZsb3dFbGVtZW50KGVsZW1lbnQpIHtcbiAgY29uc3Qge1xuICAgIG92ZXJmbG93LFxuICAgIG92ZXJmbG93WCxcbiAgICBvdmVyZmxvd1ksXG4gICAgZGlzcGxheVxuICB9ID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcbiAgcmV0dXJuIC9hdXRvfHNjcm9sbHxvdmVybGF5fGhpZGRlbnxjbGlwLy50ZXN0KG92ZXJmbG93ICsgb3ZlcmZsb3dZICsgb3ZlcmZsb3dYKSAmJiBkaXNwbGF5ICE9PSAnaW5saW5lJyAmJiBkaXNwbGF5ICE9PSAnY29udGVudHMnO1xufVxuZnVuY3Rpb24gaXNUYWJsZUVsZW1lbnQoZWxlbWVudCkge1xuICByZXR1cm4gL14odGFibGV8dGR8dGgpJC8udGVzdChnZXROb2RlTmFtZShlbGVtZW50KSk7XG59XG5mdW5jdGlvbiBpc1RvcExheWVyKGVsZW1lbnQpIHtcbiAgdHJ5IHtcbiAgICBpZiAoZWxlbWVudC5tYXRjaGVzKCc6cG9wb3Zlci1vcGVuJykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSBjYXRjaCAoX2UpIHtcbiAgICAvLyBuby1vcFxuICB9XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVsZW1lbnQubWF0Y2hlcygnOm1vZGFsJyk7XG4gIH0gY2F0Y2ggKF9lKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5jb25zdCB3aWxsQ2hhbmdlUmUgPSAvdHJhbnNmb3JtfHRyYW5zbGF0ZXxzY2FsZXxyb3RhdGV8cGVyc3BlY3RpdmV8ZmlsdGVyLztcbmNvbnN0IGNvbnRhaW5SZSA9IC9wYWludHxsYXlvdXR8c3RyaWN0fGNvbnRlbnQvO1xuY29uc3QgaXNOb3ROb25lID0gdmFsdWUgPT4gISF2YWx1ZSAmJiB2YWx1ZSAhPT0gJ25vbmUnO1xubGV0IGlzV2ViS2l0VmFsdWU7XG5mdW5jdGlvbiBpc0NvbnRhaW5pbmdCbG9jayhlbGVtZW50T3JDc3MpIHtcbiAgY29uc3QgY3NzID0gaXNFbGVtZW50KGVsZW1lbnRPckNzcykgPyBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnRPckNzcykgOiBlbGVtZW50T3JDc3M7XG5cbiAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTL0NvbnRhaW5pbmdfYmxvY2sjaWRlbnRpZnlpbmdfdGhlX2NvbnRhaW5pbmdfYmxvY2tcbiAgLy8gaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzcy10cmFuc2Zvcm1zLTIvI2luZGl2aWR1YWwtdHJhbnNmb3Jtc1xuICByZXR1cm4gaXNOb3ROb25lKGNzcy50cmFuc2Zvcm0pIHx8IGlzTm90Tm9uZShjc3MudHJhbnNsYXRlKSB8fCBpc05vdE5vbmUoY3NzLnNjYWxlKSB8fCBpc05vdE5vbmUoY3NzLnJvdGF0ZSkgfHwgaXNOb3ROb25lKGNzcy5wZXJzcGVjdGl2ZSkgfHwgIWlzV2ViS2l0KCkgJiYgKGlzTm90Tm9uZShjc3MuYmFja2Ryb3BGaWx0ZXIpIHx8IGlzTm90Tm9uZShjc3MuZmlsdGVyKSkgfHwgd2lsbENoYW5nZVJlLnRlc3QoY3NzLndpbGxDaGFuZ2UgfHwgJycpIHx8IGNvbnRhaW5SZS50ZXN0KGNzcy5jb250YWluIHx8ICcnKTtcbn1cbmZ1bmN0aW9uIGdldENvbnRhaW5pbmdCbG9jayhlbGVtZW50KSB7XG4gIGxldCBjdXJyZW50Tm9kZSA9IGdldFBhcmVudE5vZGUoZWxlbWVudCk7XG4gIHdoaWxlIChpc0hUTUxFbGVtZW50KGN1cnJlbnROb2RlKSAmJiAhaXNMYXN0VHJhdmVyc2FibGVOb2RlKGN1cnJlbnROb2RlKSkge1xuICAgIGlmIChpc0NvbnRhaW5pbmdCbG9jayhjdXJyZW50Tm9kZSkpIHtcbiAgICAgIHJldHVybiBjdXJyZW50Tm9kZTtcbiAgICB9IGVsc2UgaWYgKGlzVG9wTGF5ZXIoY3VycmVudE5vZGUpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY3VycmVudE5vZGUgPSBnZXRQYXJlbnROb2RlKGN1cnJlbnROb2RlKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIGlzV2ViS2l0KCkge1xuICBpZiAoaXNXZWJLaXRWYWx1ZSA9PSBudWxsKSB7XG4gICAgaXNXZWJLaXRWYWx1ZSA9IHR5cGVvZiBDU1MgIT09ICd1bmRlZmluZWQnICYmIENTUy5zdXBwb3J0cyAmJiBDU1Muc3VwcG9ydHMoJy13ZWJraXQtYmFja2Ryb3AtZmlsdGVyJywgJ25vbmUnKTtcbiAgfVxuICByZXR1cm4gaXNXZWJLaXRWYWx1ZTtcbn1cbmZ1bmN0aW9uIGlzTGFzdFRyYXZlcnNhYmxlTm9kZShub2RlKSB7XG4gIHJldHVybiAvXihodG1sfGJvZHl8I2RvY3VtZW50KSQvLnRlc3QoZ2V0Tm9kZU5hbWUobm9kZSkpO1xufVxuZnVuY3Rpb24gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KSB7XG4gIHJldHVybiBnZXRXaW5kb3coZWxlbWVudCkuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcbn1cbmZ1bmN0aW9uIGdldE5vZGVTY3JvbGwoZWxlbWVudCkge1xuICBpZiAoaXNFbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNjcm9sbExlZnQ6IGVsZW1lbnQuc2Nyb2xsTGVmdCxcbiAgICAgIHNjcm9sbFRvcDogZWxlbWVudC5zY3JvbGxUb3BcbiAgICB9O1xuICB9XG4gIHJldHVybiB7XG4gICAgc2Nyb2xsTGVmdDogZWxlbWVudC5zY3JvbGxYLFxuICAgIHNjcm9sbFRvcDogZWxlbWVudC5zY3JvbGxZXG4gIH07XG59XG5mdW5jdGlvbiBnZXRQYXJlbnROb2RlKG5vZGUpIHtcbiAgaWYgKGdldE5vZGVOYW1lKG5vZGUpID09PSAnaHRtbCcpIHtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuICBjb25zdCByZXN1bHQgPVxuICAvLyBTdGVwIGludG8gdGhlIHNoYWRvdyBET00gb2YgdGhlIHBhcmVudCBvZiBhIHNsb3R0ZWQgbm9kZS5cbiAgbm9kZS5hc3NpZ25lZFNsb3QgfHxcbiAgLy8gRE9NIEVsZW1lbnQgZGV0ZWN0ZWQuXG4gIG5vZGUucGFyZW50Tm9kZSB8fFxuICAvLyBTaGFkb3dSb290IGRldGVjdGVkLlxuICBpc1NoYWRvd1Jvb3Qobm9kZSkgJiYgbm9kZS5ob3N0IHx8XG4gIC8vIEZhbGxiYWNrLlxuICBnZXREb2N1bWVudEVsZW1lbnQobm9kZSk7XG4gIHJldHVybiBpc1NoYWRvd1Jvb3QocmVzdWx0KSA/IHJlc3VsdC5ob3N0IDogcmVzdWx0O1xufVxuZnVuY3Rpb24gZ2V0TmVhcmVzdE92ZXJmbG93QW5jZXN0b3Iobm9kZSkge1xuICBjb25zdCBwYXJlbnROb2RlID0gZ2V0UGFyZW50Tm9kZShub2RlKTtcbiAgaWYgKGlzTGFzdFRyYXZlcnNhYmxlTm9kZShwYXJlbnROb2RlKSkge1xuICAgIHJldHVybiBub2RlLm93bmVyRG9jdW1lbnQgPyBub2RlLm93bmVyRG9jdW1lbnQuYm9keSA6IG5vZGUuYm9keTtcbiAgfVxuICBpZiAoaXNIVE1MRWxlbWVudChwYXJlbnROb2RlKSAmJiBpc092ZXJmbG93RWxlbWVudChwYXJlbnROb2RlKSkge1xuICAgIHJldHVybiBwYXJlbnROb2RlO1xuICB9XG4gIHJldHVybiBnZXROZWFyZXN0T3ZlcmZsb3dBbmNlc3RvcihwYXJlbnROb2RlKTtcbn1cbmZ1bmN0aW9uIGdldE92ZXJmbG93QW5jZXN0b3JzKG5vZGUsIGxpc3QsIHRyYXZlcnNlSWZyYW1lcykge1xuICB2YXIgX25vZGUkb3duZXJEb2N1bWVudDI7XG4gIGlmIChsaXN0ID09PSB2b2lkIDApIHtcbiAgICBsaXN0ID0gW107XG4gIH1cbiAgaWYgKHRyYXZlcnNlSWZyYW1lcyA9PT0gdm9pZCAwKSB7XG4gICAgdHJhdmVyc2VJZnJhbWVzID0gdHJ1ZTtcbiAgfVxuICBjb25zdCBzY3JvbGxhYmxlQW5jZXN0b3IgPSBnZXROZWFyZXN0T3ZlcmZsb3dBbmNlc3Rvcihub2RlKTtcbiAgY29uc3QgaXNCb2R5ID0gc2Nyb2xsYWJsZUFuY2VzdG9yID09PSAoKF9ub2RlJG93bmVyRG9jdW1lbnQyID0gbm9kZS5vd25lckRvY3VtZW50KSA9PSBudWxsID8gdm9pZCAwIDogX25vZGUkb3duZXJEb2N1bWVudDIuYm9keSk7XG4gIGNvbnN0IHdpbiA9IGdldFdpbmRvdyhzY3JvbGxhYmxlQW5jZXN0b3IpO1xuICBpZiAoaXNCb2R5KSB7XG4gICAgY29uc3QgZnJhbWVFbGVtZW50ID0gZ2V0RnJhbWVFbGVtZW50KHdpbik7XG4gICAgcmV0dXJuIGxpc3QuY29uY2F0KHdpbiwgd2luLnZpc3VhbFZpZXdwb3J0IHx8IFtdLCBpc092ZXJmbG93RWxlbWVudChzY3JvbGxhYmxlQW5jZXN0b3IpID8gc2Nyb2xsYWJsZUFuY2VzdG9yIDogW10sIGZyYW1lRWxlbWVudCAmJiB0cmF2ZXJzZUlmcmFtZXMgPyBnZXRPdmVyZmxvd0FuY2VzdG9ycyhmcmFtZUVsZW1lbnQpIDogW10pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBsaXN0LmNvbmNhdChzY3JvbGxhYmxlQW5jZXN0b3IsIGdldE92ZXJmbG93QW5jZXN0b3JzKHNjcm9sbGFibGVBbmNlc3RvciwgW10sIHRyYXZlcnNlSWZyYW1lcykpO1xuICB9XG59XG5mdW5jdGlvbiBnZXRGcmFtZUVsZW1lbnQod2luKSB7XG4gIHJldHVybiB3aW4ucGFyZW50ICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZih3aW4ucGFyZW50KSA/IHdpbi5mcmFtZUVsZW1lbnQgOiBudWxsO1xufVxuXG5leHBvcnQgeyBnZXRDb21wdXRlZFN0eWxlLCBnZXRDb250YWluaW5nQmxvY2ssIGdldERvY3VtZW50RWxlbWVudCwgZ2V0RnJhbWVFbGVtZW50LCBnZXROZWFyZXN0T3ZlcmZsb3dBbmNlc3RvciwgZ2V0Tm9kZU5hbWUsIGdldE5vZGVTY3JvbGwsIGdldE92ZXJmbG93QW5jZXN0b3JzLCBnZXRQYXJlbnROb2RlLCBnZXRXaW5kb3csIGlzQ29udGFpbmluZ0Jsb2NrLCBpc0VsZW1lbnQsIGlzSFRNTEVsZW1lbnQsIGlzTGFzdFRyYXZlcnNhYmxlTm9kZSwgaXNOb2RlLCBpc092ZXJmbG93RWxlbWVudCwgaXNTaGFkb3dSb290LCBpc1RhYmxlRWxlbWVudCwgaXNUb3BMYXllciwgaXNXZWJLaXQgfTtcbiIsImltcG9ydCB7IHJlY3RUb0NsaWVudFJlY3QsIGFycm93IGFzIGFycm93JDEsIGF1dG9QbGFjZW1lbnQgYXMgYXV0b1BsYWNlbWVudCQxLCBkZXRlY3RPdmVyZmxvdyBhcyBkZXRlY3RPdmVyZmxvdyQxLCBmbGlwIGFzIGZsaXAkMSwgaGlkZSBhcyBoaWRlJDEsIGlubGluZSBhcyBpbmxpbmUkMSwgbGltaXRTaGlmdCBhcyBsaW1pdFNoaWZ0JDEsIG9mZnNldCBhcyBvZmZzZXQkMSwgc2hpZnQgYXMgc2hpZnQkMSwgc2l6ZSBhcyBzaXplJDEsIGNvbXB1dGVQb3NpdGlvbiBhcyBjb21wdXRlUG9zaXRpb24kMSB9IGZyb20gJ0BmbG9hdGluZy11aS9jb3JlJztcbmltcG9ydCB7IHJvdW5kLCBjcmVhdGVDb29yZHMsIG1heCwgbWluLCBmbG9vciB9IGZyb20gJ0BmbG9hdGluZy11aS91dGlscyc7XG5pbXBvcnQgeyBnZXRDb21wdXRlZFN0eWxlIGFzIGdldENvbXB1dGVkU3R5bGUkMSwgaXNIVE1MRWxlbWVudCwgaXNFbGVtZW50LCBnZXRXaW5kb3csIGlzV2ViS2l0LCBnZXRGcmFtZUVsZW1lbnQsIGdldE5vZGVTY3JvbGwsIGdldERvY3VtZW50RWxlbWVudCwgaXNUb3BMYXllciwgZ2V0Tm9kZU5hbWUsIGlzT3ZlcmZsb3dFbGVtZW50LCBnZXRPdmVyZmxvd0FuY2VzdG9ycywgZ2V0UGFyZW50Tm9kZSwgaXNMYXN0VHJhdmVyc2FibGVOb2RlLCBpc0NvbnRhaW5pbmdCbG9jaywgaXNUYWJsZUVsZW1lbnQsIGdldENvbnRhaW5pbmdCbG9jayB9IGZyb20gJ0BmbG9hdGluZy11aS91dGlscy9kb20nO1xuZXhwb3J0IHsgZ2V0T3ZlcmZsb3dBbmNlc3RvcnMgfSBmcm9tICdAZmxvYXRpbmctdWkvdXRpbHMvZG9tJztcblxuZnVuY3Rpb24gZ2V0Q3NzRGltZW5zaW9ucyhlbGVtZW50KSB7XG4gIGNvbnN0IGNzcyA9IGdldENvbXB1dGVkU3R5bGUkMShlbGVtZW50KTtcbiAgLy8gSW4gdGVzdGluZyBlbnZpcm9ubWVudHMsIHRoZSBgd2lkdGhgIGFuZCBgaGVpZ2h0YCBwcm9wZXJ0aWVzIGFyZSBlbXB0eVxuICAvLyBzdHJpbmdzIGZvciBTVkcgZWxlbWVudHMsIHJldHVybmluZyBOYU4uIEZhbGxiYWNrIHRvIGAwYCBpbiB0aGlzIGNhc2UuXG4gIGxldCB3aWR0aCA9IHBhcnNlRmxvYXQoY3NzLndpZHRoKSB8fCAwO1xuICBsZXQgaGVpZ2h0ID0gcGFyc2VGbG9hdChjc3MuaGVpZ2h0KSB8fCAwO1xuICBjb25zdCBoYXNPZmZzZXQgPSBpc0hUTUxFbGVtZW50KGVsZW1lbnQpO1xuICBjb25zdCBvZmZzZXRXaWR0aCA9IGhhc09mZnNldCA/IGVsZW1lbnQub2Zmc2V0V2lkdGggOiB3aWR0aDtcbiAgY29uc3Qgb2Zmc2V0SGVpZ2h0ID0gaGFzT2Zmc2V0ID8gZWxlbWVudC5vZmZzZXRIZWlnaHQgOiBoZWlnaHQ7XG4gIGNvbnN0IHNob3VsZEZhbGxiYWNrID0gcm91bmQod2lkdGgpICE9PSBvZmZzZXRXaWR0aCB8fCByb3VuZChoZWlnaHQpICE9PSBvZmZzZXRIZWlnaHQ7XG4gIGlmIChzaG91bGRGYWxsYmFjaykge1xuICAgIHdpZHRoID0gb2Zmc2V0V2lkdGg7XG4gICAgaGVpZ2h0ID0gb2Zmc2V0SGVpZ2h0O1xuICB9XG4gIHJldHVybiB7XG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgICQ6IHNob3VsZEZhbGxiYWNrXG4gIH07XG59XG5cbmZ1bmN0aW9uIHVud3JhcEVsZW1lbnQoZWxlbWVudCkge1xuICByZXR1cm4gIWlzRWxlbWVudChlbGVtZW50KSA/IGVsZW1lbnQuY29udGV4dEVsZW1lbnQgOiBlbGVtZW50O1xufVxuXG5mdW5jdGlvbiBnZXRTY2FsZShlbGVtZW50KSB7XG4gIGNvbnN0IGRvbUVsZW1lbnQgPSB1bndyYXBFbGVtZW50KGVsZW1lbnQpO1xuICBpZiAoIWlzSFRNTEVsZW1lbnQoZG9tRWxlbWVudCkpIHtcbiAgICByZXR1cm4gY3JlYXRlQ29vcmRzKDEpO1xuICB9XG4gIGNvbnN0IHJlY3QgPSBkb21FbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCB7XG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgICRcbiAgfSA9IGdldENzc0RpbWVuc2lvbnMoZG9tRWxlbWVudCk7XG4gIGxldCB4ID0gKCQgPyByb3VuZChyZWN0LndpZHRoKSA6IHJlY3Qud2lkdGgpIC8gd2lkdGg7XG4gIGxldCB5ID0gKCQgPyByb3VuZChyZWN0LmhlaWdodCkgOiByZWN0LmhlaWdodCkgLyBoZWlnaHQ7XG5cbiAgLy8gMCwgTmFOLCBvciBJbmZpbml0eSBzaG91bGQgYWx3YXlzIGZhbGxiYWNrIHRvIDEuXG5cbiAgaWYgKCF4IHx8ICFOdW1iZXIuaXNGaW5pdGUoeCkpIHtcbiAgICB4ID0gMTtcbiAgfVxuICBpZiAoIXkgfHwgIU51bWJlci5pc0Zpbml0ZSh5KSkge1xuICAgIHkgPSAxO1xuICB9XG4gIHJldHVybiB7XG4gICAgeCxcbiAgICB5XG4gIH07XG59XG5cbmNvbnN0IG5vT2Zmc2V0cyA9IC8qI19fUFVSRV9fKi9jcmVhdGVDb29yZHMoMCk7XG5mdW5jdGlvbiBnZXRWaXN1YWxPZmZzZXRzKGVsZW1lbnQpIHtcbiAgY29uc3Qgd2luID0gZ2V0V2luZG93KGVsZW1lbnQpO1xuICBpZiAoIWlzV2ViS2l0KCkgfHwgIXdpbi52aXN1YWxWaWV3cG9ydCkge1xuICAgIHJldHVybiBub09mZnNldHM7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB4OiB3aW4udmlzdWFsVmlld3BvcnQub2Zmc2V0TGVmdCxcbiAgICB5OiB3aW4udmlzdWFsVmlld3BvcnQub2Zmc2V0VG9wXG4gIH07XG59XG5mdW5jdGlvbiBzaG91bGRBZGRWaXN1YWxPZmZzZXRzKGVsZW1lbnQsIGlzRml4ZWQsIGZsb2F0aW5nT2Zmc2V0UGFyZW50KSB7XG4gIGlmIChpc0ZpeGVkID09PSB2b2lkIDApIHtcbiAgICBpc0ZpeGVkID0gZmFsc2U7XG4gIH1cbiAgaWYgKCFmbG9hdGluZ09mZnNldFBhcmVudCB8fCBpc0ZpeGVkICYmIGZsb2F0aW5nT2Zmc2V0UGFyZW50ICE9PSBnZXRXaW5kb3coZWxlbWVudCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIGlzRml4ZWQ7XG59XG5cbmZ1bmN0aW9uIGdldEJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50LCBpbmNsdWRlU2NhbGUsIGlzRml4ZWRTdHJhdGVneSwgb2Zmc2V0UGFyZW50KSB7XG4gIGlmIChpbmNsdWRlU2NhbGUgPT09IHZvaWQgMCkge1xuICAgIGluY2x1ZGVTY2FsZSA9IGZhbHNlO1xuICB9XG4gIGlmIChpc0ZpeGVkU3RyYXRlZ3kgPT09IHZvaWQgMCkge1xuICAgIGlzRml4ZWRTdHJhdGVneSA9IGZhbHNlO1xuICB9XG4gIGNvbnN0IGNsaWVudFJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCBkb21FbGVtZW50ID0gdW53cmFwRWxlbWVudChlbGVtZW50KTtcbiAgbGV0IHNjYWxlID0gY3JlYXRlQ29vcmRzKDEpO1xuICBpZiAoaW5jbHVkZVNjYWxlKSB7XG4gICAgaWYgKG9mZnNldFBhcmVudCkge1xuICAgICAgaWYgKGlzRWxlbWVudChvZmZzZXRQYXJlbnQpKSB7XG4gICAgICAgIHNjYWxlID0gZ2V0U2NhbGUob2Zmc2V0UGFyZW50KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc2NhbGUgPSBnZXRTY2FsZShlbGVtZW50KTtcbiAgICB9XG4gIH1cbiAgY29uc3QgdmlzdWFsT2Zmc2V0cyA9IHNob3VsZEFkZFZpc3VhbE9mZnNldHMoZG9tRWxlbWVudCwgaXNGaXhlZFN0cmF0ZWd5LCBvZmZzZXRQYXJlbnQpID8gZ2V0VmlzdWFsT2Zmc2V0cyhkb21FbGVtZW50KSA6IGNyZWF0ZUNvb3JkcygwKTtcbiAgbGV0IHggPSAoY2xpZW50UmVjdC5sZWZ0ICsgdmlzdWFsT2Zmc2V0cy54KSAvIHNjYWxlLng7XG4gIGxldCB5ID0gKGNsaWVudFJlY3QudG9wICsgdmlzdWFsT2Zmc2V0cy55KSAvIHNjYWxlLnk7XG4gIGxldCB3aWR0aCA9IGNsaWVudFJlY3Qud2lkdGggLyBzY2FsZS54O1xuICBsZXQgaGVpZ2h0ID0gY2xpZW50UmVjdC5oZWlnaHQgLyBzY2FsZS55O1xuICBpZiAoZG9tRWxlbWVudCkge1xuICAgIGNvbnN0IHdpbiA9IGdldFdpbmRvdyhkb21FbGVtZW50KTtcbiAgICBjb25zdCBvZmZzZXRXaW4gPSBvZmZzZXRQYXJlbnQgJiYgaXNFbGVtZW50KG9mZnNldFBhcmVudCkgPyBnZXRXaW5kb3cob2Zmc2V0UGFyZW50KSA6IG9mZnNldFBhcmVudDtcbiAgICBsZXQgY3VycmVudFdpbiA9IHdpbjtcbiAgICBsZXQgY3VycmVudElGcmFtZSA9IGdldEZyYW1lRWxlbWVudChjdXJyZW50V2luKTtcbiAgICB3aGlsZSAoY3VycmVudElGcmFtZSAmJiBvZmZzZXRQYXJlbnQgJiYgb2Zmc2V0V2luICE9PSBjdXJyZW50V2luKSB7XG4gICAgICBjb25zdCBpZnJhbWVTY2FsZSA9IGdldFNjYWxlKGN1cnJlbnRJRnJhbWUpO1xuICAgICAgY29uc3QgaWZyYW1lUmVjdCA9IGN1cnJlbnRJRnJhbWUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCBjc3MgPSBnZXRDb21wdXRlZFN0eWxlJDEoY3VycmVudElGcmFtZSk7XG4gICAgICBjb25zdCBsZWZ0ID0gaWZyYW1lUmVjdC5sZWZ0ICsgKGN1cnJlbnRJRnJhbWUuY2xpZW50TGVmdCArIHBhcnNlRmxvYXQoY3NzLnBhZGRpbmdMZWZ0KSkgKiBpZnJhbWVTY2FsZS54O1xuICAgICAgY29uc3QgdG9wID0gaWZyYW1lUmVjdC50b3AgKyAoY3VycmVudElGcmFtZS5jbGllbnRUb3AgKyBwYXJzZUZsb2F0KGNzcy5wYWRkaW5nVG9wKSkgKiBpZnJhbWVTY2FsZS55O1xuICAgICAgeCAqPSBpZnJhbWVTY2FsZS54O1xuICAgICAgeSAqPSBpZnJhbWVTY2FsZS55O1xuICAgICAgd2lkdGggKj0gaWZyYW1lU2NhbGUueDtcbiAgICAgIGhlaWdodCAqPSBpZnJhbWVTY2FsZS55O1xuICAgICAgeCArPSBsZWZ0O1xuICAgICAgeSArPSB0b3A7XG4gICAgICBjdXJyZW50V2luID0gZ2V0V2luZG93KGN1cnJlbnRJRnJhbWUpO1xuICAgICAgY3VycmVudElGcmFtZSA9IGdldEZyYW1lRWxlbWVudChjdXJyZW50V2luKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlY3RUb0NsaWVudFJlY3Qoe1xuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICB4LFxuICAgIHlcbiAgfSk7XG59XG5cbi8vIElmIDxodG1sPiBoYXMgYSBDU1Mgd2lkdGggZ3JlYXRlciB0aGFuIHRoZSB2aWV3cG9ydCwgdGhlbiB0aGlzIHdpbGwgYmVcbi8vIGluY29ycmVjdCBmb3IgUlRMLlxuZnVuY3Rpb24gZ2V0V2luZG93U2Nyb2xsQmFyWChlbGVtZW50LCByZWN0KSB7XG4gIGNvbnN0IGxlZnRTY3JvbGwgPSBnZXROb2RlU2Nyb2xsKGVsZW1lbnQpLnNjcm9sbExlZnQ7XG4gIGlmICghcmVjdCkge1xuICAgIHJldHVybiBnZXRCb3VuZGluZ0NsaWVudFJlY3QoZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpKS5sZWZ0ICsgbGVmdFNjcm9sbDtcbiAgfVxuICByZXR1cm4gcmVjdC5sZWZ0ICsgbGVmdFNjcm9sbDtcbn1cblxuZnVuY3Rpb24gZ2V0SFRNTE9mZnNldChkb2N1bWVudEVsZW1lbnQsIHNjcm9sbCkge1xuICBjb25zdCBodG1sUmVjdCA9IGRvY3VtZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgeCA9IGh0bWxSZWN0LmxlZnQgKyBzY3JvbGwuc2Nyb2xsTGVmdCAtIGdldFdpbmRvd1Njcm9sbEJhclgoZG9jdW1lbnRFbGVtZW50LCBodG1sUmVjdCk7XG4gIGNvbnN0IHkgPSBodG1sUmVjdC50b3AgKyBzY3JvbGwuc2Nyb2xsVG9wO1xuICByZXR1cm4ge1xuICAgIHgsXG4gICAgeVxuICB9O1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0T2Zmc2V0UGFyZW50UmVsYXRpdmVSZWN0VG9WaWV3cG9ydFJlbGF0aXZlUmVjdChfcmVmKSB7XG4gIGxldCB7XG4gICAgZWxlbWVudHMsXG4gICAgcmVjdCxcbiAgICBvZmZzZXRQYXJlbnQsXG4gICAgc3RyYXRlZ3lcbiAgfSA9IF9yZWY7XG4gIGNvbnN0IGlzRml4ZWQgPSBzdHJhdGVneSA9PT0gJ2ZpeGVkJztcbiAgY29uc3QgZG9jdW1lbnRFbGVtZW50ID0gZ2V0RG9jdW1lbnRFbGVtZW50KG9mZnNldFBhcmVudCk7XG4gIGNvbnN0IHRvcExheWVyID0gZWxlbWVudHMgPyBpc1RvcExheWVyKGVsZW1lbnRzLmZsb2F0aW5nKSA6IGZhbHNlO1xuICBpZiAob2Zmc2V0UGFyZW50ID09PSBkb2N1bWVudEVsZW1lbnQgfHwgdG9wTGF5ZXIgJiYgaXNGaXhlZCkge1xuICAgIHJldHVybiByZWN0O1xuICB9XG4gIGxldCBzY3JvbGwgPSB7XG4gICAgc2Nyb2xsTGVmdDogMCxcbiAgICBzY3JvbGxUb3A6IDBcbiAgfTtcbiAgbGV0IHNjYWxlID0gY3JlYXRlQ29vcmRzKDEpO1xuICBjb25zdCBvZmZzZXRzID0gY3JlYXRlQ29vcmRzKDApO1xuICBjb25zdCBpc09mZnNldFBhcmVudEFuRWxlbWVudCA9IGlzSFRNTEVsZW1lbnQob2Zmc2V0UGFyZW50KTtcbiAgaWYgKGlzT2Zmc2V0UGFyZW50QW5FbGVtZW50IHx8ICFpc09mZnNldFBhcmVudEFuRWxlbWVudCAmJiAhaXNGaXhlZCkge1xuICAgIGlmIChnZXROb2RlTmFtZShvZmZzZXRQYXJlbnQpICE9PSAnYm9keScgfHwgaXNPdmVyZmxvd0VsZW1lbnQoZG9jdW1lbnRFbGVtZW50KSkge1xuICAgICAgc2Nyb2xsID0gZ2V0Tm9kZVNjcm9sbChvZmZzZXRQYXJlbnQpO1xuICAgIH1cbiAgICBpZiAoaXNPZmZzZXRQYXJlbnRBbkVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IG9mZnNldFJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3Qob2Zmc2V0UGFyZW50KTtcbiAgICAgIHNjYWxlID0gZ2V0U2NhbGUob2Zmc2V0UGFyZW50KTtcbiAgICAgIG9mZnNldHMueCA9IG9mZnNldFJlY3QueCArIG9mZnNldFBhcmVudC5jbGllbnRMZWZ0O1xuICAgICAgb2Zmc2V0cy55ID0gb2Zmc2V0UmVjdC55ICsgb2Zmc2V0UGFyZW50LmNsaWVudFRvcDtcbiAgICB9XG4gIH1cbiAgY29uc3QgaHRtbE9mZnNldCA9IGRvY3VtZW50RWxlbWVudCAmJiAhaXNPZmZzZXRQYXJlbnRBbkVsZW1lbnQgJiYgIWlzRml4ZWQgPyBnZXRIVE1MT2Zmc2V0KGRvY3VtZW50RWxlbWVudCwgc2Nyb2xsKSA6IGNyZWF0ZUNvb3JkcygwKTtcbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogcmVjdC53aWR0aCAqIHNjYWxlLngsXG4gICAgaGVpZ2h0OiByZWN0LmhlaWdodCAqIHNjYWxlLnksXG4gICAgeDogcmVjdC54ICogc2NhbGUueCAtIHNjcm9sbC5zY3JvbGxMZWZ0ICogc2NhbGUueCArIG9mZnNldHMueCArIGh0bWxPZmZzZXQueCxcbiAgICB5OiByZWN0LnkgKiBzY2FsZS55IC0gc2Nyb2xsLnNjcm9sbFRvcCAqIHNjYWxlLnkgKyBvZmZzZXRzLnkgKyBodG1sT2Zmc2V0LnlcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0Q2xpZW50UmVjdHMoZWxlbWVudCkge1xuICByZXR1cm4gQXJyYXkuZnJvbShlbGVtZW50LmdldENsaWVudFJlY3RzKCkpO1xufVxuXG4vLyBHZXRzIHRoZSBlbnRpcmUgc2l6ZSBvZiB0aGUgc2Nyb2xsYWJsZSBkb2N1bWVudCBhcmVhLCBldmVuIGV4dGVuZGluZyBvdXRzaWRlXG4vLyBvZiB0aGUgYDxodG1sPmAgYW5kIGA8Ym9keT5gIHJlY3QgYm91bmRzIGlmIGhvcml6b250YWxseSBzY3JvbGxhYmxlLlxuZnVuY3Rpb24gZ2V0RG9jdW1lbnRSZWN0KGVsZW1lbnQpIHtcbiAgY29uc3QgaHRtbCA9IGdldERvY3VtZW50RWxlbWVudChlbGVtZW50KTtcbiAgY29uc3Qgc2Nyb2xsID0gZ2V0Tm9kZVNjcm9sbChlbGVtZW50KTtcbiAgY29uc3QgYm9keSA9IGVsZW1lbnQub3duZXJEb2N1bWVudC5ib2R5O1xuICBjb25zdCB3aWR0aCA9IG1heChodG1sLnNjcm9sbFdpZHRoLCBodG1sLmNsaWVudFdpZHRoLCBib2R5LnNjcm9sbFdpZHRoLCBib2R5LmNsaWVudFdpZHRoKTtcbiAgY29uc3QgaGVpZ2h0ID0gbWF4KGh0bWwuc2Nyb2xsSGVpZ2h0LCBodG1sLmNsaWVudEhlaWdodCwgYm9keS5zY3JvbGxIZWlnaHQsIGJvZHkuY2xpZW50SGVpZ2h0KTtcbiAgbGV0IHggPSAtc2Nyb2xsLnNjcm9sbExlZnQgKyBnZXRXaW5kb3dTY3JvbGxCYXJYKGVsZW1lbnQpO1xuICBjb25zdCB5ID0gLXNjcm9sbC5zY3JvbGxUb3A7XG4gIGlmIChnZXRDb21wdXRlZFN0eWxlJDEoYm9keSkuZGlyZWN0aW9uID09PSAncnRsJykge1xuICAgIHggKz0gbWF4KGh0bWwuY2xpZW50V2lkdGgsIGJvZHkuY2xpZW50V2lkdGgpIC0gd2lkdGg7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgeCxcbiAgICB5XG4gIH07XG59XG5cbi8vIFNhZmV0eSBjaGVjazogZW5zdXJlIHRoZSBzY3JvbGxiYXIgc3BhY2UgaXMgcmVhc29uYWJsZSBpbiBjYXNlIHRoaXNcbi8vIGNhbGN1bGF0aW9uIGlzIGFmZmVjdGVkIGJ5IHVudXN1YWwgc3R5bGVzLlxuLy8gTW9zdCBzY3JvbGxiYXJzIGxlYXZlIDE1LTE4cHggb2Ygc3BhY2UuXG5jb25zdCBTQ1JPTExCQVJfTUFYID0gMjU7XG5mdW5jdGlvbiBnZXRWaWV3cG9ydFJlY3QoZWxlbWVudCwgc3RyYXRlZ3kpIHtcbiAgY29uc3Qgd2luID0gZ2V0V2luZG93KGVsZW1lbnQpO1xuICBjb25zdCBodG1sID0gZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpO1xuICBjb25zdCB2aXN1YWxWaWV3cG9ydCA9IHdpbi52aXN1YWxWaWV3cG9ydDtcbiAgbGV0IHdpZHRoID0gaHRtbC5jbGllbnRXaWR0aDtcbiAgbGV0IGhlaWdodCA9IGh0bWwuY2xpZW50SGVpZ2h0O1xuICBsZXQgeCA9IDA7XG4gIGxldCB5ID0gMDtcbiAgaWYgKHZpc3VhbFZpZXdwb3J0KSB7XG4gICAgd2lkdGggPSB2aXN1YWxWaWV3cG9ydC53aWR0aDtcbiAgICBoZWlnaHQgPSB2aXN1YWxWaWV3cG9ydC5oZWlnaHQ7XG4gICAgY29uc3QgdmlzdWFsVmlld3BvcnRCYXNlZCA9IGlzV2ViS2l0KCk7XG4gICAgaWYgKCF2aXN1YWxWaWV3cG9ydEJhc2VkIHx8IHZpc3VhbFZpZXdwb3J0QmFzZWQgJiYgc3RyYXRlZ3kgPT09ICdmaXhlZCcpIHtcbiAgICAgIHggPSB2aXN1YWxWaWV3cG9ydC5vZmZzZXRMZWZ0O1xuICAgICAgeSA9IHZpc3VhbFZpZXdwb3J0Lm9mZnNldFRvcDtcbiAgICB9XG4gIH1cbiAgY29uc3Qgd2luZG93U2Nyb2xsYmFyWCA9IGdldFdpbmRvd1Njcm9sbEJhclgoaHRtbCk7XG4gIC8vIDxodG1sPiBgb3ZlcmZsb3c6IGhpZGRlbmAgKyBgc2Nyb2xsYmFyLWd1dHRlcjogc3RhYmxlYCByZWR1Y2VzIHRoZVxuICAvLyB2aXN1YWwgd2lkdGggb2YgdGhlIDxodG1sPiBidXQgdGhpcyBpcyBub3QgY29uc2lkZXJlZCBpbiB0aGUgc2l6ZVxuICAvLyBvZiBgaHRtbC5jbGllbnRXaWR0aGAuXG4gIGlmICh3aW5kb3dTY3JvbGxiYXJYIDw9IDApIHtcbiAgICBjb25zdCBkb2MgPSBodG1sLm93bmVyRG9jdW1lbnQ7XG4gICAgY29uc3QgYm9keSA9IGRvYy5ib2R5O1xuICAgIGNvbnN0IGJvZHlTdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKGJvZHkpO1xuICAgIGNvbnN0IGJvZHlNYXJnaW5JbmxpbmUgPSBkb2MuY29tcGF0TW9kZSA9PT0gJ0NTUzFDb21wYXQnID8gcGFyc2VGbG9hdChib2R5U3R5bGVzLm1hcmdpbkxlZnQpICsgcGFyc2VGbG9hdChib2R5U3R5bGVzLm1hcmdpblJpZ2h0KSB8fCAwIDogMDtcbiAgICBjb25zdCBjbGlwcGluZ1N0YWJsZVNjcm9sbGJhcldpZHRoID0gTWF0aC5hYnMoaHRtbC5jbGllbnRXaWR0aCAtIGJvZHkuY2xpZW50V2lkdGggLSBib2R5TWFyZ2luSW5saW5lKTtcbiAgICBpZiAoY2xpcHBpbmdTdGFibGVTY3JvbGxiYXJXaWR0aCA8PSBTQ1JPTExCQVJfTUFYKSB7XG4gICAgICB3aWR0aCAtPSBjbGlwcGluZ1N0YWJsZVNjcm9sbGJhcldpZHRoO1xuICAgIH1cbiAgfSBlbHNlIGlmICh3aW5kb3dTY3JvbGxiYXJYIDw9IFNDUk9MTEJBUl9NQVgpIHtcbiAgICAvLyBJZiB0aGUgPGJvZHk+IHNjcm9sbGJhciBpcyBvbiB0aGUgbGVmdCwgdGhlIHdpZHRoIG5lZWRzIHRvIGJlIGV4dGVuZGVkXG4gICAgLy8gYnkgdGhlIHNjcm9sbGJhciBhbW91bnQgc28gdGhlcmUgaXNuJ3QgZXh0cmEgc3BhY2Ugb24gdGhlIHJpZ2h0LlxuICAgIHdpZHRoICs9IHdpbmRvd1Njcm9sbGJhclg7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgeCxcbiAgICB5XG4gIH07XG59XG5cbi8vIFJldHVybnMgdGhlIGlubmVyIGNsaWVudCByZWN0LCBzdWJ0cmFjdGluZyBzY3JvbGxiYXJzIGlmIHByZXNlbnQuXG5mdW5jdGlvbiBnZXRJbm5lckJvdW5kaW5nQ2xpZW50UmVjdChlbGVtZW50LCBzdHJhdGVneSkge1xuICBjb25zdCBjbGllbnRSZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnQsIHRydWUsIHN0cmF0ZWd5ID09PSAnZml4ZWQnKTtcbiAgY29uc3QgdG9wID0gY2xpZW50UmVjdC50b3AgKyBlbGVtZW50LmNsaWVudFRvcDtcbiAgY29uc3QgbGVmdCA9IGNsaWVudFJlY3QubGVmdCArIGVsZW1lbnQuY2xpZW50TGVmdDtcbiAgY29uc3Qgc2NhbGUgPSBpc0hUTUxFbGVtZW50KGVsZW1lbnQpID8gZ2V0U2NhbGUoZWxlbWVudCkgOiBjcmVhdGVDb29yZHMoMSk7XG4gIGNvbnN0IHdpZHRoID0gZWxlbWVudC5jbGllbnRXaWR0aCAqIHNjYWxlLng7XG4gIGNvbnN0IGhlaWdodCA9IGVsZW1lbnQuY2xpZW50SGVpZ2h0ICogc2NhbGUueTtcbiAgY29uc3QgeCA9IGxlZnQgKiBzY2FsZS54O1xuICBjb25zdCB5ID0gdG9wICogc2NhbGUueTtcbiAgcmV0dXJuIHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgeCxcbiAgICB5XG4gIH07XG59XG5mdW5jdGlvbiBnZXRDbGllbnRSZWN0RnJvbUNsaXBwaW5nQW5jZXN0b3IoZWxlbWVudCwgY2xpcHBpbmdBbmNlc3Rvciwgc3RyYXRlZ3kpIHtcbiAgbGV0IHJlY3Q7XG4gIGlmIChjbGlwcGluZ0FuY2VzdG9yID09PSAndmlld3BvcnQnKSB7XG4gICAgcmVjdCA9IGdldFZpZXdwb3J0UmVjdChlbGVtZW50LCBzdHJhdGVneSk7XG4gIH0gZWxzZSBpZiAoY2xpcHBpbmdBbmNlc3RvciA9PT0gJ2RvY3VtZW50Jykge1xuICAgIHJlY3QgPSBnZXREb2N1bWVudFJlY3QoZ2V0RG9jdW1lbnRFbGVtZW50KGVsZW1lbnQpKTtcbiAgfSBlbHNlIGlmIChpc0VsZW1lbnQoY2xpcHBpbmdBbmNlc3RvcikpIHtcbiAgICByZWN0ID0gZ2V0SW5uZXJCb3VuZGluZ0NsaWVudFJlY3QoY2xpcHBpbmdBbmNlc3Rvciwgc3RyYXRlZ3kpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHZpc3VhbE9mZnNldHMgPSBnZXRWaXN1YWxPZmZzZXRzKGVsZW1lbnQpO1xuICAgIHJlY3QgPSB7XG4gICAgICB4OiBjbGlwcGluZ0FuY2VzdG9yLnggLSB2aXN1YWxPZmZzZXRzLngsXG4gICAgICB5OiBjbGlwcGluZ0FuY2VzdG9yLnkgLSB2aXN1YWxPZmZzZXRzLnksXG4gICAgICB3aWR0aDogY2xpcHBpbmdBbmNlc3Rvci53aWR0aCxcbiAgICAgIGhlaWdodDogY2xpcHBpbmdBbmNlc3Rvci5oZWlnaHRcbiAgICB9O1xuICB9XG4gIHJldHVybiByZWN0VG9DbGllbnRSZWN0KHJlY3QpO1xufVxuZnVuY3Rpb24gaGFzRml4ZWRQb3NpdGlvbkFuY2VzdG9yKGVsZW1lbnQsIHN0b3BOb2RlKSB7XG4gIGNvbnN0IHBhcmVudE5vZGUgPSBnZXRQYXJlbnROb2RlKGVsZW1lbnQpO1xuICBpZiAocGFyZW50Tm9kZSA9PT0gc3RvcE5vZGUgfHwgIWlzRWxlbWVudChwYXJlbnROb2RlKSB8fCBpc0xhc3RUcmF2ZXJzYWJsZU5vZGUocGFyZW50Tm9kZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIGdldENvbXB1dGVkU3R5bGUkMShwYXJlbnROb2RlKS5wb3NpdGlvbiA9PT0gJ2ZpeGVkJyB8fCBoYXNGaXhlZFBvc2l0aW9uQW5jZXN0b3IocGFyZW50Tm9kZSwgc3RvcE5vZGUpO1xufVxuXG4vLyBBIFwiY2xpcHBpbmcgYW5jZXN0b3JcIiBpcyBhbiBgb3ZlcmZsb3dgIGVsZW1lbnQgd2l0aCB0aGUgY2hhcmFjdGVyaXN0aWMgb2Zcbi8vIGNsaXBwaW5nIChvciBoaWRpbmcpIGNoaWxkIGVsZW1lbnRzLiBUaGlzIHJldHVybnMgYWxsIGNsaXBwaW5nIGFuY2VzdG9yc1xuLy8gb2YgdGhlIGdpdmVuIGVsZW1lbnQgdXAgdGhlIHRyZWUuXG5mdW5jdGlvbiBnZXRDbGlwcGluZ0VsZW1lbnRBbmNlc3RvcnMoZWxlbWVudCwgY2FjaGUpIHtcbiAgY29uc3QgY2FjaGVkUmVzdWx0ID0gY2FjaGUuZ2V0KGVsZW1lbnQpO1xuICBpZiAoY2FjaGVkUmVzdWx0KSB7XG4gICAgcmV0dXJuIGNhY2hlZFJlc3VsdDtcbiAgfVxuICBsZXQgcmVzdWx0ID0gZ2V0T3ZlcmZsb3dBbmNlc3RvcnMoZWxlbWVudCwgW10sIGZhbHNlKS5maWx0ZXIoZWwgPT4gaXNFbGVtZW50KGVsKSAmJiBnZXROb2RlTmFtZShlbCkgIT09ICdib2R5Jyk7XG4gIGxldCBjdXJyZW50Q29udGFpbmluZ0Jsb2NrQ29tcHV0ZWRTdHlsZSA9IG51bGw7XG4gIGNvbnN0IGVsZW1lbnRJc0ZpeGVkID0gZ2V0Q29tcHV0ZWRTdHlsZSQxKGVsZW1lbnQpLnBvc2l0aW9uID09PSAnZml4ZWQnO1xuICBsZXQgY3VycmVudE5vZGUgPSBlbGVtZW50SXNGaXhlZCA/IGdldFBhcmVudE5vZGUoZWxlbWVudCkgOiBlbGVtZW50O1xuXG4gIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9Db250YWluaW5nX2Jsb2NrI2lkZW50aWZ5aW5nX3RoZV9jb250YWluaW5nX2Jsb2NrXG4gIHdoaWxlIChpc0VsZW1lbnQoY3VycmVudE5vZGUpICYmICFpc0xhc3RUcmF2ZXJzYWJsZU5vZGUoY3VycmVudE5vZGUpKSB7XG4gICAgY29uc3QgY29tcHV0ZWRTdHlsZSA9IGdldENvbXB1dGVkU3R5bGUkMShjdXJyZW50Tm9kZSk7XG4gICAgY29uc3QgY3VycmVudE5vZGVJc0NvbnRhaW5pbmcgPSBpc0NvbnRhaW5pbmdCbG9jayhjdXJyZW50Tm9kZSk7XG4gICAgaWYgKCFjdXJyZW50Tm9kZUlzQ29udGFpbmluZyAmJiBjb21wdXRlZFN0eWxlLnBvc2l0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgICBjdXJyZW50Q29udGFpbmluZ0Jsb2NrQ29tcHV0ZWRTdHlsZSA9IG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHNob3VsZERyb3BDdXJyZW50Tm9kZSA9IGVsZW1lbnRJc0ZpeGVkID8gIWN1cnJlbnROb2RlSXNDb250YWluaW5nICYmICFjdXJyZW50Q29udGFpbmluZ0Jsb2NrQ29tcHV0ZWRTdHlsZSA6ICFjdXJyZW50Tm9kZUlzQ29udGFpbmluZyAmJiBjb21wdXRlZFN0eWxlLnBvc2l0aW9uID09PSAnc3RhdGljJyAmJiAhIWN1cnJlbnRDb250YWluaW5nQmxvY2tDb21wdXRlZFN0eWxlICYmIChjdXJyZW50Q29udGFpbmluZ0Jsb2NrQ29tcHV0ZWRTdHlsZS5wb3NpdGlvbiA9PT0gJ2Fic29sdXRlJyB8fCBjdXJyZW50Q29udGFpbmluZ0Jsb2NrQ29tcHV0ZWRTdHlsZS5wb3NpdGlvbiA9PT0gJ2ZpeGVkJykgfHwgaXNPdmVyZmxvd0VsZW1lbnQoY3VycmVudE5vZGUpICYmICFjdXJyZW50Tm9kZUlzQ29udGFpbmluZyAmJiBoYXNGaXhlZFBvc2l0aW9uQW5jZXN0b3IoZWxlbWVudCwgY3VycmVudE5vZGUpO1xuICAgIGlmIChzaG91bGREcm9wQ3VycmVudE5vZGUpIHtcbiAgICAgIC8vIERyb3Agbm9uLWNvbnRhaW5pbmcgYmxvY2tzLlxuICAgICAgcmVzdWx0ID0gcmVzdWx0LmZpbHRlcihhbmNlc3RvciA9PiBhbmNlc3RvciAhPT0gY3VycmVudE5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZWNvcmQgbGFzdCBjb250YWluaW5nIGJsb2NrIGZvciBuZXh0IGl0ZXJhdGlvbi5cbiAgICAgIGN1cnJlbnRDb250YWluaW5nQmxvY2tDb21wdXRlZFN0eWxlID0gY29tcHV0ZWRTdHlsZTtcbiAgICB9XG4gICAgY3VycmVudE5vZGUgPSBnZXRQYXJlbnROb2RlKGN1cnJlbnROb2RlKTtcbiAgfVxuICBjYWNoZS5zZXQoZWxlbWVudCwgcmVzdWx0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gR2V0cyB0aGUgbWF4aW11bSBhcmVhIHRoYXQgdGhlIGVsZW1lbnQgaXMgdmlzaWJsZSBpbiBkdWUgdG8gYW55IG51bWJlciBvZlxuLy8gY2xpcHBpbmcgYW5jZXN0b3JzLlxuZnVuY3Rpb24gZ2V0Q2xpcHBpbmdSZWN0KF9yZWYpIHtcbiAgbGV0IHtcbiAgICBlbGVtZW50LFxuICAgIGJvdW5kYXJ5LFxuICAgIHJvb3RCb3VuZGFyeSxcbiAgICBzdHJhdGVneVxuICB9ID0gX3JlZjtcbiAgY29uc3QgZWxlbWVudENsaXBwaW5nQW5jZXN0b3JzID0gYm91bmRhcnkgPT09ICdjbGlwcGluZ0FuY2VzdG9ycycgPyBpc1RvcExheWVyKGVsZW1lbnQpID8gW10gOiBnZXRDbGlwcGluZ0VsZW1lbnRBbmNlc3RvcnMoZWxlbWVudCwgdGhpcy5fYykgOiBbXS5jb25jYXQoYm91bmRhcnkpO1xuICBjb25zdCBjbGlwcGluZ0FuY2VzdG9ycyA9IFsuLi5lbGVtZW50Q2xpcHBpbmdBbmNlc3RvcnMsIHJvb3RCb3VuZGFyeV07XG4gIGNvbnN0IGZpcnN0UmVjdCA9IGdldENsaWVudFJlY3RGcm9tQ2xpcHBpbmdBbmNlc3RvcihlbGVtZW50LCBjbGlwcGluZ0FuY2VzdG9yc1swXSwgc3RyYXRlZ3kpO1xuICBsZXQgdG9wID0gZmlyc3RSZWN0LnRvcDtcbiAgbGV0IHJpZ2h0ID0gZmlyc3RSZWN0LnJpZ2h0O1xuICBsZXQgYm90dG9tID0gZmlyc3RSZWN0LmJvdHRvbTtcbiAgbGV0IGxlZnQgPSBmaXJzdFJlY3QubGVmdDtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBjbGlwcGluZ0FuY2VzdG9ycy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHJlY3QgPSBnZXRDbGllbnRSZWN0RnJvbUNsaXBwaW5nQW5jZXN0b3IoZWxlbWVudCwgY2xpcHBpbmdBbmNlc3RvcnNbaV0sIHN0cmF0ZWd5KTtcbiAgICB0b3AgPSBtYXgocmVjdC50b3AsIHRvcCk7XG4gICAgcmlnaHQgPSBtaW4ocmVjdC5yaWdodCwgcmlnaHQpO1xuICAgIGJvdHRvbSA9IG1pbihyZWN0LmJvdHRvbSwgYm90dG9tKTtcbiAgICBsZWZ0ID0gbWF4KHJlY3QubGVmdCwgbGVmdCk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogcmlnaHQgLSBsZWZ0LFxuICAgIGhlaWdodDogYm90dG9tIC0gdG9wLFxuICAgIHg6IGxlZnQsXG4gICAgeTogdG9wXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldERpbWVuc2lvbnMoZWxlbWVudCkge1xuICBjb25zdCB7XG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0XG4gIH0gPSBnZXRDc3NEaW1lbnNpb25zKGVsZW1lbnQpO1xuICByZXR1cm4ge1xuICAgIHdpZHRoLFxuICAgIGhlaWdodFxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRSZWN0UmVsYXRpdmVUb09mZnNldFBhcmVudChlbGVtZW50LCBvZmZzZXRQYXJlbnQsIHN0cmF0ZWd5KSB7XG4gIGNvbnN0IGlzT2Zmc2V0UGFyZW50QW5FbGVtZW50ID0gaXNIVE1MRWxlbWVudChvZmZzZXRQYXJlbnQpO1xuICBjb25zdCBkb2N1bWVudEVsZW1lbnQgPSBnZXREb2N1bWVudEVsZW1lbnQob2Zmc2V0UGFyZW50KTtcbiAgY29uc3QgaXNGaXhlZCA9IHN0cmF0ZWd5ID09PSAnZml4ZWQnO1xuICBjb25zdCByZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KGVsZW1lbnQsIHRydWUsIGlzRml4ZWQsIG9mZnNldFBhcmVudCk7XG4gIGxldCBzY3JvbGwgPSB7XG4gICAgc2Nyb2xsTGVmdDogMCxcbiAgICBzY3JvbGxUb3A6IDBcbiAgfTtcbiAgY29uc3Qgb2Zmc2V0cyA9IGNyZWF0ZUNvb3JkcygwKTtcblxuICAvLyBJZiB0aGUgPGJvZHk+IHNjcm9sbGJhciBhcHBlYXJzIG9uIHRoZSBsZWZ0IChlLmcuIFJUTCBzeXN0ZW1zKS4gVXNlXG4gIC8vIEZpcmVmb3ggd2l0aCBsYXlvdXQuc2Nyb2xsYmFyLnNpZGUgPSAzIGluIGFib3V0OmNvbmZpZyB0byB0ZXN0IHRoaXMuXG4gIGZ1bmN0aW9uIHNldExlZnRSVExTY3JvbGxiYXJPZmZzZXQoKSB7XG4gICAgb2Zmc2V0cy54ID0gZ2V0V2luZG93U2Nyb2xsQmFyWChkb2N1bWVudEVsZW1lbnQpO1xuICB9XG4gIGlmIChpc09mZnNldFBhcmVudEFuRWxlbWVudCB8fCAhaXNPZmZzZXRQYXJlbnRBbkVsZW1lbnQgJiYgIWlzRml4ZWQpIHtcbiAgICBpZiAoZ2V0Tm9kZU5hbWUob2Zmc2V0UGFyZW50KSAhPT0gJ2JvZHknIHx8IGlzT3ZlcmZsb3dFbGVtZW50KGRvY3VtZW50RWxlbWVudCkpIHtcbiAgICAgIHNjcm9sbCA9IGdldE5vZGVTY3JvbGwob2Zmc2V0UGFyZW50KTtcbiAgICB9XG4gICAgaWYgKGlzT2Zmc2V0UGFyZW50QW5FbGVtZW50KSB7XG4gICAgICBjb25zdCBvZmZzZXRSZWN0ID0gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KG9mZnNldFBhcmVudCwgdHJ1ZSwgaXNGaXhlZCwgb2Zmc2V0UGFyZW50KTtcbiAgICAgIG9mZnNldHMueCA9IG9mZnNldFJlY3QueCArIG9mZnNldFBhcmVudC5jbGllbnRMZWZ0O1xuICAgICAgb2Zmc2V0cy55ID0gb2Zmc2V0UmVjdC55ICsgb2Zmc2V0UGFyZW50LmNsaWVudFRvcDtcbiAgICB9IGVsc2UgaWYgKGRvY3VtZW50RWxlbWVudCkge1xuICAgICAgc2V0TGVmdFJUTFNjcm9sbGJhck9mZnNldCgpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNGaXhlZCAmJiAhaXNPZmZzZXRQYXJlbnRBbkVsZW1lbnQgJiYgZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgc2V0TGVmdFJUTFNjcm9sbGJhck9mZnNldCgpO1xuICB9XG4gIGNvbnN0IGh0bWxPZmZzZXQgPSBkb2N1bWVudEVsZW1lbnQgJiYgIWlzT2Zmc2V0UGFyZW50QW5FbGVtZW50ICYmICFpc0ZpeGVkID8gZ2V0SFRNTE9mZnNldChkb2N1bWVudEVsZW1lbnQsIHNjcm9sbCkgOiBjcmVhdGVDb29yZHMoMCk7XG4gIGNvbnN0IHggPSByZWN0LmxlZnQgKyBzY3JvbGwuc2Nyb2xsTGVmdCAtIG9mZnNldHMueCAtIGh0bWxPZmZzZXQueDtcbiAgY29uc3QgeSA9IHJlY3QudG9wICsgc2Nyb2xsLnNjcm9sbFRvcCAtIG9mZnNldHMueSAtIGh0bWxPZmZzZXQueTtcbiAgcmV0dXJuIHtcbiAgICB4LFxuICAgIHksXG4gICAgd2lkdGg6IHJlY3Qud2lkdGgsXG4gICAgaGVpZ2h0OiByZWN0LmhlaWdodFxuICB9O1xufVxuXG5mdW5jdGlvbiBpc1N0YXRpY1Bvc2l0aW9uZWQoZWxlbWVudCkge1xuICByZXR1cm4gZ2V0Q29tcHV0ZWRTdHlsZSQxKGVsZW1lbnQpLnBvc2l0aW9uID09PSAnc3RhdGljJztcbn1cblxuZnVuY3Rpb24gZ2V0VHJ1ZU9mZnNldFBhcmVudChlbGVtZW50LCBwb2x5ZmlsbCkge1xuICBpZiAoIWlzSFRNTEVsZW1lbnQoZWxlbWVudCkgfHwgZ2V0Q29tcHV0ZWRTdHlsZSQxKGVsZW1lbnQpLnBvc2l0aW9uID09PSAnZml4ZWQnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKHBvbHlmaWxsKSB7XG4gICAgcmV0dXJuIHBvbHlmaWxsKGVsZW1lbnQpO1xuICB9XG4gIGxldCByYXdPZmZzZXRQYXJlbnQgPSBlbGVtZW50Lm9mZnNldFBhcmVudDtcblxuICAvLyBGaXJlZm94IHJldHVybnMgdGhlIDxodG1sPiBlbGVtZW50IGFzIHRoZSBvZmZzZXRQYXJlbnQgaWYgaXQncyBub24tc3RhdGljLFxuICAvLyB3aGlsZSBDaHJvbWUgYW5kIFNhZmFyaSByZXR1cm4gdGhlIDxib2R5PiBlbGVtZW50LiBUaGUgPGJvZHk+IGVsZW1lbnQgbXVzdFxuICAvLyBiZSB1c2VkIHRvIHBlcmZvcm0gdGhlIGNvcnJlY3QgY2FsY3VsYXRpb25zIGV2ZW4gaWYgdGhlIDxodG1sPiBlbGVtZW50IGlzXG4gIC8vIG5vbi1zdGF0aWMuXG4gIGlmIChnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCkgPT09IHJhd09mZnNldFBhcmVudCkge1xuICAgIHJhd09mZnNldFBhcmVudCA9IHJhd09mZnNldFBhcmVudC5vd25lckRvY3VtZW50LmJvZHk7XG4gIH1cbiAgcmV0dXJuIHJhd09mZnNldFBhcmVudDtcbn1cblxuLy8gR2V0cyB0aGUgY2xvc2VzdCBhbmNlc3RvciBwb3NpdGlvbmVkIGVsZW1lbnQuIEhhbmRsZXMgc29tZSBlZGdlIGNhc2VzLFxuLy8gc3VjaCBhcyB0YWJsZSBhbmNlc3RvcnMgYW5kIGNyb3NzIGJyb3dzZXIgYnVncy5cbmZ1bmN0aW9uIGdldE9mZnNldFBhcmVudChlbGVtZW50LCBwb2x5ZmlsbCkge1xuICBjb25zdCB3aW4gPSBnZXRXaW5kb3coZWxlbWVudCk7XG4gIGlmIChpc1RvcExheWVyKGVsZW1lbnQpKSB7XG4gICAgcmV0dXJuIHdpbjtcbiAgfVxuICBpZiAoIWlzSFRNTEVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICBsZXQgc3ZnT2Zmc2V0UGFyZW50ID0gZ2V0UGFyZW50Tm9kZShlbGVtZW50KTtcbiAgICB3aGlsZSAoc3ZnT2Zmc2V0UGFyZW50ICYmICFpc0xhc3RUcmF2ZXJzYWJsZU5vZGUoc3ZnT2Zmc2V0UGFyZW50KSkge1xuICAgICAgaWYgKGlzRWxlbWVudChzdmdPZmZzZXRQYXJlbnQpICYmICFpc1N0YXRpY1Bvc2l0aW9uZWQoc3ZnT2Zmc2V0UGFyZW50KSkge1xuICAgICAgICByZXR1cm4gc3ZnT2Zmc2V0UGFyZW50O1xuICAgICAgfVxuICAgICAgc3ZnT2Zmc2V0UGFyZW50ID0gZ2V0UGFyZW50Tm9kZShzdmdPZmZzZXRQYXJlbnQpO1xuICAgIH1cbiAgICByZXR1cm4gd2luO1xuICB9XG4gIGxldCBvZmZzZXRQYXJlbnQgPSBnZXRUcnVlT2Zmc2V0UGFyZW50KGVsZW1lbnQsIHBvbHlmaWxsKTtcbiAgd2hpbGUgKG9mZnNldFBhcmVudCAmJiBpc1RhYmxlRWxlbWVudChvZmZzZXRQYXJlbnQpICYmIGlzU3RhdGljUG9zaXRpb25lZChvZmZzZXRQYXJlbnQpKSB7XG4gICAgb2Zmc2V0UGFyZW50ID0gZ2V0VHJ1ZU9mZnNldFBhcmVudChvZmZzZXRQYXJlbnQsIHBvbHlmaWxsKTtcbiAgfVxuICBpZiAob2Zmc2V0UGFyZW50ICYmIGlzTGFzdFRyYXZlcnNhYmxlTm9kZShvZmZzZXRQYXJlbnQpICYmIGlzU3RhdGljUG9zaXRpb25lZChvZmZzZXRQYXJlbnQpICYmICFpc0NvbnRhaW5pbmdCbG9jayhvZmZzZXRQYXJlbnQpKSB7XG4gICAgcmV0dXJuIHdpbjtcbiAgfVxuICByZXR1cm4gb2Zmc2V0UGFyZW50IHx8IGdldENvbnRhaW5pbmdCbG9jayhlbGVtZW50KSB8fCB3aW47XG59XG5cbmNvbnN0IGdldEVsZW1lbnRSZWN0cyA9IGFzeW5jIGZ1bmN0aW9uIChkYXRhKSB7XG4gIGNvbnN0IGdldE9mZnNldFBhcmVudEZuID0gdGhpcy5nZXRPZmZzZXRQYXJlbnQgfHwgZ2V0T2Zmc2V0UGFyZW50O1xuICBjb25zdCBnZXREaW1lbnNpb25zRm4gPSB0aGlzLmdldERpbWVuc2lvbnM7XG4gIGNvbnN0IGZsb2F0aW5nRGltZW5zaW9ucyA9IGF3YWl0IGdldERpbWVuc2lvbnNGbihkYXRhLmZsb2F0aW5nKTtcbiAgcmV0dXJuIHtcbiAgICByZWZlcmVuY2U6IGdldFJlY3RSZWxhdGl2ZVRvT2Zmc2V0UGFyZW50KGRhdGEucmVmZXJlbmNlLCBhd2FpdCBnZXRPZmZzZXRQYXJlbnRGbihkYXRhLmZsb2F0aW5nKSwgZGF0YS5zdHJhdGVneSksXG4gICAgZmxvYXRpbmc6IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwLFxuICAgICAgd2lkdGg6IGZsb2F0aW5nRGltZW5zaW9ucy53aWR0aCxcbiAgICAgIGhlaWdodDogZmxvYXRpbmdEaW1lbnNpb25zLmhlaWdodFxuICAgIH1cbiAgfTtcbn07XG5cbmZ1bmN0aW9uIGlzUlRMKGVsZW1lbnQpIHtcbiAgcmV0dXJuIGdldENvbXB1dGVkU3R5bGUkMShlbGVtZW50KS5kaXJlY3Rpb24gPT09ICdydGwnO1xufVxuXG5jb25zdCBwbGF0Zm9ybSA9IHtcbiAgY29udmVydE9mZnNldFBhcmVudFJlbGF0aXZlUmVjdFRvVmlld3BvcnRSZWxhdGl2ZVJlY3QsXG4gIGdldERvY3VtZW50RWxlbWVudCxcbiAgZ2V0Q2xpcHBpbmdSZWN0LFxuICBnZXRPZmZzZXRQYXJlbnQsXG4gIGdldEVsZW1lbnRSZWN0cyxcbiAgZ2V0Q2xpZW50UmVjdHMsXG4gIGdldERpbWVuc2lvbnMsXG4gIGdldFNjYWxlLFxuICBpc0VsZW1lbnQsXG4gIGlzUlRMXG59O1xuXG5mdW5jdGlvbiByZWN0c0FyZUVxdWFsKGEsIGIpIHtcbiAgcmV0dXJuIGEueCA9PT0gYi54ICYmIGEueSA9PT0gYi55ICYmIGEud2lkdGggPT09IGIud2lkdGggJiYgYS5oZWlnaHQgPT09IGIuaGVpZ2h0O1xufVxuXG4vLyBodHRwczovL3NhbXRob3IuYXUvMjAyMS9vYnNlcnZpbmctZG9tL1xuZnVuY3Rpb24gb2JzZXJ2ZU1vdmUoZWxlbWVudCwgb25Nb3ZlKSB7XG4gIGxldCBpbyA9IG51bGw7XG4gIGxldCB0aW1lb3V0SWQ7XG4gIGNvbnN0IHJvb3QgPSBnZXREb2N1bWVudEVsZW1lbnQoZWxlbWVudCk7XG4gIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgdmFyIF9pbztcbiAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAoX2lvID0gaW8pID09IG51bGwgfHwgX2lvLmRpc2Nvbm5lY3QoKTtcbiAgICBpbyA9IG51bGw7XG4gIH1cbiAgZnVuY3Rpb24gcmVmcmVzaChza2lwLCB0aHJlc2hvbGQpIHtcbiAgICBpZiAoc2tpcCA9PT0gdm9pZCAwKSB7XG4gICAgICBza2lwID0gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0aHJlc2hvbGQgPT09IHZvaWQgMCkge1xuICAgICAgdGhyZXNob2xkID0gMTtcbiAgICB9XG4gICAgY2xlYW51cCgpO1xuICAgIGNvbnN0IGVsZW1lbnRSZWN0Rm9yUm9vdE1hcmdpbiA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3Qge1xuICAgICAgbGVmdCxcbiAgICAgIHRvcCxcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0XG4gICAgfSA9IGVsZW1lbnRSZWN0Rm9yUm9vdE1hcmdpbjtcbiAgICBpZiAoIXNraXApIHtcbiAgICAgIG9uTW92ZSgpO1xuICAgIH1cbiAgICBpZiAoIXdpZHRoIHx8ICFoZWlnaHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaW5zZXRUb3AgPSBmbG9vcih0b3ApO1xuICAgIGNvbnN0IGluc2V0UmlnaHQgPSBmbG9vcihyb290LmNsaWVudFdpZHRoIC0gKGxlZnQgKyB3aWR0aCkpO1xuICAgIGNvbnN0IGluc2V0Qm90dG9tID0gZmxvb3Iocm9vdC5jbGllbnRIZWlnaHQgLSAodG9wICsgaGVpZ2h0KSk7XG4gICAgY29uc3QgaW5zZXRMZWZ0ID0gZmxvb3IobGVmdCk7XG4gICAgY29uc3Qgcm9vdE1hcmdpbiA9IC1pbnNldFRvcCArIFwicHggXCIgKyAtaW5zZXRSaWdodCArIFwicHggXCIgKyAtaW5zZXRCb3R0b20gKyBcInB4IFwiICsgLWluc2V0TGVmdCArIFwicHhcIjtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgcm9vdE1hcmdpbixcbiAgICAgIHRocmVzaG9sZDogbWF4KDAsIG1pbigxLCB0aHJlc2hvbGQpKSB8fCAxXG4gICAgfTtcbiAgICBsZXQgaXNGaXJzdFVwZGF0ZSA9IHRydWU7XG4gICAgZnVuY3Rpb24gaGFuZGxlT2JzZXJ2ZShlbnRyaWVzKSB7XG4gICAgICBjb25zdCByYXRpbyA9IGVudHJpZXNbMF0uaW50ZXJzZWN0aW9uUmF0aW87XG4gICAgICBpZiAocmF0aW8gIT09IHRocmVzaG9sZCkge1xuICAgICAgICBpZiAoIWlzRmlyc3RVcGRhdGUpIHtcbiAgICAgICAgICByZXR1cm4gcmVmcmVzaCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcmF0aW8pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgcmVmZXJlbmNlIGlzIGNsaXBwZWQsIHRoZSByYXRpbyBpcyAwLiBUaHJvdHRsZSB0aGUgcmVmcmVzaFxuICAgICAgICAgIC8vIHRvIHByZXZlbnQgYW4gaW5maW5pdGUgbG9vcCBvZiB1cGRhdGVzLlxuICAgICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgcmVmcmVzaChmYWxzZSwgMWUtNyk7XG4gICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVmcmVzaChmYWxzZSwgcmF0aW8pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocmF0aW8gPT09IDEgJiYgIXJlY3RzQXJlRXF1YWwoZWxlbWVudFJlY3RGb3JSb290TWFyZ2luLCBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKSkge1xuICAgICAgICAvLyBJdCdzIHBvc3NpYmxlIHRoYXQgZXZlbiB0aG91Z2ggdGhlIHJhdGlvIGlzIHJlcG9ydGVkIGFzIDEsIHRoZVxuICAgICAgICAvLyBlbGVtZW50IGlzIG5vdCBhY3R1YWxseSBmdWxseSB3aXRoaW4gdGhlIEludGVyc2VjdGlvbk9ic2VydmVyJ3Mgcm9vdFxuICAgICAgICAvLyBhcmVhIGFueW1vcmUuIFRoaXMgY2FuIGhhcHBlbiB1bmRlciBwZXJmb3JtYW5jZSBjb25zdHJhaW50cy4gVGhpcyBtYXlcbiAgICAgICAgLy8gYmUgYSBidWcgaW4gdGhlIGJyb3dzZXIncyBJbnRlcnNlY3Rpb25PYnNlcnZlciBpbXBsZW1lbnRhdGlvbi4gVG9cbiAgICAgICAgLy8gd29yayBhcm91bmQgdGhpcywgd2UgY29tcGFyZSB0aGUgZWxlbWVudCdzIGJvdW5kaW5nIHJlY3Qgbm93IHdpdGhcbiAgICAgICAgLy8gd2hhdCBpdCB3YXMgYXQgdGhlIHRpbWUgd2UgY3JlYXRlZCB0aGUgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIuIElmIHRoZXlcbiAgICAgICAgLy8gYXJlIG5vdCBlcXVhbCB0aGVuIHRoZSBlbGVtZW50IG1vdmVkLCBzbyB3ZSByZWZyZXNoLlxuICAgICAgICByZWZyZXNoKCk7XG4gICAgICB9XG4gICAgICBpc0ZpcnN0VXBkYXRlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gT2xkZXIgYnJvd3NlcnMgZG9uJ3Qgc3VwcG9ydCBhIGBkb2N1bWVudGAgYXMgdGhlIHJvb3QgYW5kIHdpbGwgdGhyb3cgYW5cbiAgICAvLyBlcnJvci5cbiAgICB0cnkge1xuICAgICAgaW8gPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoaGFuZGxlT2JzZXJ2ZSwge1xuICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAvLyBIYW5kbGUgPGlmcmFtZT5zXG4gICAgICAgIHJvb3Q6IHJvb3Qub3duZXJEb2N1bWVudFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoX2UpIHtcbiAgICAgIGlvID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKGhhbmRsZU9ic2VydmUsIG9wdGlvbnMpO1xuICAgIH1cbiAgICBpby5vYnNlcnZlKGVsZW1lbnQpO1xuICB9XG4gIHJlZnJlc2godHJ1ZSk7XG4gIHJldHVybiBjbGVhbnVwO1xufVxuXG4vKipcbiAqIEF1dG9tYXRpY2FsbHkgdXBkYXRlcyB0aGUgcG9zaXRpb24gb2YgdGhlIGZsb2F0aW5nIGVsZW1lbnQgd2hlbiBuZWNlc3NhcnkuXG4gKiBTaG91bGQgb25seSBiZSBjYWxsZWQgd2hlbiB0aGUgZmxvYXRpbmcgZWxlbWVudCBpcyBtb3VudGVkIG9uIHRoZSBET00gb3JcbiAqIHZpc2libGUgb24gdGhlIHNjcmVlbi5cbiAqIEByZXR1cm5zIGNsZWFudXAgZnVuY3Rpb24gdGhhdCBzaG91bGQgYmUgaW52b2tlZCB3aGVuIHRoZSBmbG9hdGluZyBlbGVtZW50IGlzXG4gKiByZW1vdmVkIGZyb20gdGhlIERPTSBvciBoaWRkZW4gZnJvbSB0aGUgc2NyZWVuLlxuICogQHNlZSBodHRwczovL2Zsb2F0aW5nLXVpLmNvbS9kb2NzL2F1dG9VcGRhdGVcbiAqL1xuZnVuY3Rpb24gYXV0b1VwZGF0ZShyZWZlcmVuY2UsIGZsb2F0aW5nLCB1cGRhdGUsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICBjb25zdCB7XG4gICAgYW5jZXN0b3JTY3JvbGwgPSB0cnVlLFxuICAgIGFuY2VzdG9yUmVzaXplID0gdHJ1ZSxcbiAgICBlbGVtZW50UmVzaXplID0gdHlwZW9mIFJlc2l6ZU9ic2VydmVyID09PSAnZnVuY3Rpb24nLFxuICAgIGxheW91dFNoaWZ0ID0gdHlwZW9mIEludGVyc2VjdGlvbk9ic2VydmVyID09PSAnZnVuY3Rpb24nLFxuICAgIGFuaW1hdGlvbkZyYW1lID0gZmFsc2VcbiAgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IHJlZmVyZW5jZUVsID0gdW53cmFwRWxlbWVudChyZWZlcmVuY2UpO1xuICBjb25zdCBhbmNlc3RvcnMgPSBhbmNlc3RvclNjcm9sbCB8fCBhbmNlc3RvclJlc2l6ZSA/IFsuLi4ocmVmZXJlbmNlRWwgPyBnZXRPdmVyZmxvd0FuY2VzdG9ycyhyZWZlcmVuY2VFbCkgOiBbXSksIC4uLihmbG9hdGluZyA/IGdldE92ZXJmbG93QW5jZXN0b3JzKGZsb2F0aW5nKSA6IFtdKV0gOiBbXTtcbiAgYW5jZXN0b3JzLmZvckVhY2goYW5jZXN0b3IgPT4ge1xuICAgIGFuY2VzdG9yU2Nyb2xsICYmIGFuY2VzdG9yLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHVwZGF0ZSwge1xuICAgICAgcGFzc2l2ZTogdHJ1ZVxuICAgIH0pO1xuICAgIGFuY2VzdG9yUmVzaXplICYmIGFuY2VzdG9yLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZSk7XG4gIH0pO1xuICBjb25zdCBjbGVhbnVwSW8gPSByZWZlcmVuY2VFbCAmJiBsYXlvdXRTaGlmdCA/IG9ic2VydmVNb3ZlKHJlZmVyZW5jZUVsLCB1cGRhdGUpIDogbnVsbDtcbiAgbGV0IHJlb2JzZXJ2ZUZyYW1lID0gLTE7XG4gIGxldCByZXNpemVPYnNlcnZlciA9IG51bGw7XG4gIGlmIChlbGVtZW50UmVzaXplKSB7XG4gICAgcmVzaXplT2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoX3JlZiA9PiB7XG4gICAgICBsZXQgW2ZpcnN0RW50cnldID0gX3JlZjtcbiAgICAgIGlmIChmaXJzdEVudHJ5ICYmIGZpcnN0RW50cnkudGFyZ2V0ID09PSByZWZlcmVuY2VFbCAmJiByZXNpemVPYnNlcnZlciAmJiBmbG9hdGluZykge1xuICAgICAgICAvLyBQcmV2ZW50IHVwZGF0ZSBsb29wcyB3aGVuIHVzaW5nIHRoZSBgc2l6ZWAgbWlkZGxld2FyZS5cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2Zsb2F0aW5nLXVpL2Zsb2F0aW5nLXVpL2lzc3Vlcy8xNzQwXG4gICAgICAgIHJlc2l6ZU9ic2VydmVyLnVub2JzZXJ2ZShmbG9hdGluZyk7XG4gICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJlb2JzZXJ2ZUZyYW1lKTtcbiAgICAgICAgcmVvYnNlcnZlRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIHZhciBfcmVzaXplT2JzZXJ2ZXI7XG4gICAgICAgICAgKF9yZXNpemVPYnNlcnZlciA9IHJlc2l6ZU9ic2VydmVyKSA9PSBudWxsIHx8IF9yZXNpemVPYnNlcnZlci5vYnNlcnZlKGZsb2F0aW5nKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB1cGRhdGUoKTtcbiAgICB9KTtcbiAgICBpZiAocmVmZXJlbmNlRWwgJiYgIWFuaW1hdGlvbkZyYW1lKSB7XG4gICAgICByZXNpemVPYnNlcnZlci5vYnNlcnZlKHJlZmVyZW5jZUVsKTtcbiAgICB9XG4gICAgaWYgKGZsb2F0aW5nKSB7XG4gICAgICByZXNpemVPYnNlcnZlci5vYnNlcnZlKGZsb2F0aW5nKTtcbiAgICB9XG4gIH1cbiAgbGV0IGZyYW1lSWQ7XG4gIGxldCBwcmV2UmVmUmVjdCA9IGFuaW1hdGlvbkZyYW1lID8gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KHJlZmVyZW5jZSkgOiBudWxsO1xuICBpZiAoYW5pbWF0aW9uRnJhbWUpIHtcbiAgICBmcmFtZUxvb3AoKTtcbiAgfVxuICBmdW5jdGlvbiBmcmFtZUxvb3AoKSB7XG4gICAgY29uc3QgbmV4dFJlZlJlY3QgPSBnZXRCb3VuZGluZ0NsaWVudFJlY3QocmVmZXJlbmNlKTtcbiAgICBpZiAocHJldlJlZlJlY3QgJiYgIXJlY3RzQXJlRXF1YWwocHJldlJlZlJlY3QsIG5leHRSZWZSZWN0KSkge1xuICAgICAgdXBkYXRlKCk7XG4gICAgfVxuICAgIHByZXZSZWZSZWN0ID0gbmV4dFJlZlJlY3Q7XG4gICAgZnJhbWVJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShmcmFtZUxvb3ApO1xuICB9XG4gIHVwZGF0ZSgpO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIHZhciBfcmVzaXplT2JzZXJ2ZXIyO1xuICAgIGFuY2VzdG9ycy5mb3JFYWNoKGFuY2VzdG9yID0+IHtcbiAgICAgIGFuY2VzdG9yU2Nyb2xsICYmIGFuY2VzdG9yLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHVwZGF0ZSk7XG4gICAgICBhbmNlc3RvclJlc2l6ZSAmJiBhbmNlc3Rvci5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1cGRhdGUpO1xuICAgIH0pO1xuICAgIGNsZWFudXBJbyA9PSBudWxsIHx8IGNsZWFudXBJbygpO1xuICAgIChfcmVzaXplT2JzZXJ2ZXIyID0gcmVzaXplT2JzZXJ2ZXIpID09IG51bGwgfHwgX3Jlc2l6ZU9ic2VydmVyMi5kaXNjb25uZWN0KCk7XG4gICAgcmVzaXplT2JzZXJ2ZXIgPSBudWxsO1xuICAgIGlmIChhbmltYXRpb25GcmFtZSkge1xuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoZnJhbWVJZCk7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIFJlc29sdmVzIHdpdGggYW4gb2JqZWN0IG9mIG92ZXJmbG93IHNpZGUgb2Zmc2V0cyB0aGF0IGRldGVybWluZSBob3cgbXVjaCB0aGVcbiAqIGVsZW1lbnQgaXMgb3ZlcmZsb3dpbmcgYSBnaXZlbiBjbGlwcGluZyBib3VuZGFyeSBvbiBlYWNoIHNpZGUuXG4gKiAtIHBvc2l0aXZlID0gb3ZlcmZsb3dpbmcgdGhlIGJvdW5kYXJ5IGJ5IHRoYXQgbnVtYmVyIG9mIHBpeGVsc1xuICogLSBuZWdhdGl2ZSA9IGhvdyBtYW55IHBpeGVscyBsZWZ0IGJlZm9yZSBpdCB3aWxsIG92ZXJmbG93XG4gKiAtIDAgPSBsaWVzIGZsdXNoIHdpdGggdGhlIGJvdW5kYXJ5XG4gKiBAc2VlIGh0dHBzOi8vZmxvYXRpbmctdWkuY29tL2RvY3MvZGV0ZWN0T3ZlcmZsb3dcbiAqL1xuY29uc3QgZGV0ZWN0T3ZlcmZsb3cgPSBkZXRlY3RPdmVyZmxvdyQxO1xuXG4vKipcbiAqIE1vZGlmaWVzIHRoZSBwbGFjZW1lbnQgYnkgdHJhbnNsYXRpbmcgdGhlIGZsb2F0aW5nIGVsZW1lbnQgYWxvbmcgdGhlXG4gKiBzcGVjaWZpZWQgYXhlcy5cbiAqIEEgbnVtYmVyIChzaG9ydGhhbmQgZm9yIGBtYWluQXhpc2Agb3IgZGlzdGFuY2UpLCBvciBhbiBheGVzIGNvbmZpZ3VyYXRpb25cbiAqIG9iamVjdCBtYXkgYmUgcGFzc2VkLlxuICogQHNlZSBodHRwczovL2Zsb2F0aW5nLXVpLmNvbS9kb2NzL29mZnNldFxuICovXG5jb25zdCBvZmZzZXQgPSBvZmZzZXQkMTtcblxuLyoqXG4gKiBPcHRpbWl6ZXMgdGhlIHZpc2liaWxpdHkgb2YgdGhlIGZsb2F0aW5nIGVsZW1lbnQgYnkgY2hvb3NpbmcgdGhlIHBsYWNlbWVudFxuICogdGhhdCBoYXMgdGhlIG1vc3Qgc3BhY2UgYXZhaWxhYmxlIGF1dG9tYXRpY2FsbHksIHdpdGhvdXQgbmVlZGluZyB0byBzcGVjaWZ5IGFcbiAqIHByZWZlcnJlZCBwbGFjZW1lbnQuIEFsdGVybmF0aXZlIHRvIGBmbGlwYC5cbiAqIEBzZWUgaHR0cHM6Ly9mbG9hdGluZy11aS5jb20vZG9jcy9hdXRvUGxhY2VtZW50XG4gKi9cbmNvbnN0IGF1dG9QbGFjZW1lbnQgPSBhdXRvUGxhY2VtZW50JDE7XG5cbi8qKlxuICogT3B0aW1pemVzIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBmbG9hdGluZyBlbGVtZW50IGJ5IHNoaWZ0aW5nIGl0IGluIG9yZGVyIHRvXG4gKiBrZWVwIGl0IGluIHZpZXcgd2hlbiBpdCB3aWxsIG92ZXJmbG93IHRoZSBjbGlwcGluZyBib3VuZGFyeS5cbiAqIEBzZWUgaHR0cHM6Ly9mbG9hdGluZy11aS5jb20vZG9jcy9zaGlmdFxuICovXG5jb25zdCBzaGlmdCA9IHNoaWZ0JDE7XG5cbi8qKlxuICogT3B0aW1pemVzIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBmbG9hdGluZyBlbGVtZW50IGJ5IGZsaXBwaW5nIHRoZSBgcGxhY2VtZW50YFxuICogaW4gb3JkZXIgdG8ga2VlcCBpdCBpbiB2aWV3IHdoZW4gdGhlIHByZWZlcnJlZCBwbGFjZW1lbnQocykgd2lsbCBvdmVyZmxvdyB0aGVcbiAqIGNsaXBwaW5nIGJvdW5kYXJ5LiBBbHRlcm5hdGl2ZSB0byBgYXV0b1BsYWNlbWVudGAuXG4gKiBAc2VlIGh0dHBzOi8vZmxvYXRpbmctdWkuY29tL2RvY3MvZmxpcFxuICovXG5jb25zdCBmbGlwID0gZmxpcCQxO1xuXG4vKipcbiAqIFByb3ZpZGVzIGRhdGEgdGhhdCBhbGxvd3MgeW91IHRvIGNoYW5nZSB0aGUgc2l6ZSBvZiB0aGUgZmxvYXRpbmcgZWxlbWVudCDigJRcbiAqIGZvciBpbnN0YW5jZSwgcHJldmVudCBpdCBmcm9tIG92ZXJmbG93aW5nIHRoZSBjbGlwcGluZyBib3VuZGFyeSBvciBtYXRjaCB0aGVcbiAqIHdpZHRoIG9mIHRoZSByZWZlcmVuY2UgZWxlbWVudC5cbiAqIEBzZWUgaHR0cHM6Ly9mbG9hdGluZy11aS5jb20vZG9jcy9zaXplXG4gKi9cbmNvbnN0IHNpemUgPSBzaXplJDE7XG5cbi8qKlxuICogUHJvdmlkZXMgZGF0YSB0byBoaWRlIHRoZSBmbG9hdGluZyBlbGVtZW50IGluIGFwcGxpY2FibGUgc2l0dWF0aW9ucywgc3VjaCBhc1xuICogd2hlbiBpdCBpcyBub3QgaW4gdGhlIHNhbWUgY2xpcHBpbmcgY29udGV4dCBhcyB0aGUgcmVmZXJlbmNlIGVsZW1lbnQuXG4gKiBAc2VlIGh0dHBzOi8vZmxvYXRpbmctdWkuY29tL2RvY3MvaGlkZVxuICovXG5jb25zdCBoaWRlID0gaGlkZSQxO1xuXG4vKipcbiAqIFByb3ZpZGVzIGRhdGEgdG8gcG9zaXRpb24gYW4gaW5uZXIgZWxlbWVudCBvZiB0aGUgZmxvYXRpbmcgZWxlbWVudCBzbyB0aGF0IGl0XG4gKiBhcHBlYXJzIGNlbnRlcmVkIHRvIHRoZSByZWZlcmVuY2UgZWxlbWVudC5cbiAqIEBzZWUgaHR0cHM6Ly9mbG9hdGluZy11aS5jb20vZG9jcy9hcnJvd1xuICovXG5jb25zdCBhcnJvdyA9IGFycm93JDE7XG5cbi8qKlxuICogUHJvdmlkZXMgaW1wcm92ZWQgcG9zaXRpb25pbmcgZm9yIGlubGluZSByZWZlcmVuY2UgZWxlbWVudHMgdGhhdCBjYW4gc3BhblxuICogb3ZlciBtdWx0aXBsZSBsaW5lcywgc3VjaCBhcyBoeXBlcmxpbmtzIG9yIHJhbmdlIHNlbGVjdGlvbnMuXG4gKiBAc2VlIGh0dHBzOi8vZmxvYXRpbmctdWkuY29tL2RvY3MvaW5saW5lXG4gKi9cbmNvbnN0IGlubGluZSA9IGlubGluZSQxO1xuXG4vKipcbiAqIEJ1aWx0LWluIGBsaW1pdGVyYCB0aGF0IHdpbGwgc3RvcCBgc2hpZnQoKWAgYXQgYSBjZXJ0YWluIHBvaW50LlxuICovXG5jb25zdCBsaW1pdFNoaWZ0ID0gbGltaXRTaGlmdCQxO1xuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBgeGAgYW5kIGB5YCBjb29yZGluYXRlcyB0aGF0IHdpbGwgcGxhY2UgdGhlIGZsb2F0aW5nIGVsZW1lbnRcbiAqIG5leHQgdG8gYSBnaXZlbiByZWZlcmVuY2UgZWxlbWVudC5cbiAqL1xuY29uc3QgY29tcHV0ZVBvc2l0aW9uID0gKHJlZmVyZW5jZSwgZmxvYXRpbmcsIG9wdGlvbnMpID0+IHtcbiAgLy8gVGhpcyBjYWNoZXMgdGhlIGV4cGVuc2l2ZSBgZ2V0Q2xpcHBpbmdFbGVtZW50QW5jZXN0b3JzYCBmdW5jdGlvbiBzbyB0aGF0XG4gIC8vIG11bHRpcGxlIGxpZmVjeWNsZSByZXNldHMgcmUtdXNlIHRoZSBzYW1lIHJlc3VsdC4gSXQgb25seSBsaXZlcyBmb3IgYVxuICAvLyBzaW5nbGUgY2FsbC4gSWYgb3RoZXIgZnVuY3Rpb25zIGJlY29tZSBleHBlbnNpdmUsIHdlIGNhbiBhZGQgdGhlbSBhcyB3ZWxsLlxuICBjb25zdCBjYWNoZSA9IG5ldyBNYXAoKTtcbiAgY29uc3QgbWVyZ2VkT3B0aW9ucyA9IHtcbiAgICBwbGF0Zm9ybSxcbiAgICAuLi5vcHRpb25zXG4gIH07XG4gIGNvbnN0IHBsYXRmb3JtV2l0aENhY2hlID0ge1xuICAgIC4uLm1lcmdlZE9wdGlvbnMucGxhdGZvcm0sXG4gICAgX2M6IGNhY2hlXG4gIH07XG4gIHJldHVybiBjb21wdXRlUG9zaXRpb24kMShyZWZlcmVuY2UsIGZsb2F0aW5nLCB7XG4gICAgLi4ubWVyZ2VkT3B0aW9ucyxcbiAgICBwbGF0Zm9ybTogcGxhdGZvcm1XaXRoQ2FjaGVcbiAgfSk7XG59O1xuXG5leHBvcnQgeyBhcnJvdywgYXV0b1BsYWNlbWVudCwgYXV0b1VwZGF0ZSwgY29tcHV0ZVBvc2l0aW9uLCBkZXRlY3RPdmVyZmxvdywgZmxpcCwgaGlkZSwgaW5saW5lLCBsaW1pdFNoaWZ0LCBvZmZzZXQsIHBsYXRmb3JtLCBzaGlmdCwgc2l6ZSB9O1xuIl0sInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlsw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