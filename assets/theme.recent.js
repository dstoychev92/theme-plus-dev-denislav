
/*
* @license
* ANALOG Theme (c) Groupthought Themes
*
* This file is included for advanced development by
* Shopify Agencies. Modified versions of the theme
* code are not supported by Shopify or Groupthought.
*
* Add any minor JS changes in assets/custom.js, this
* will make it easier to update the theme in the future.
*
*/

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
//#region src/js/theme.recent.ts
/**
* Recently viewed products – store-scoped localStorage (product IDs).
* Exports recordProductView and getRecentlyViewedProducts for import via @theme/recent.
*/
const STORAGE_KEY_PREFIX = "recentlyViewed";
const MAX_IDS = 10;
function getStorageKey() {
	const store = window.theme?.shop?.permanentDomain;
	return [STORAGE_KEY_PREFIX, store].filter(Boolean).join("_");
}
/**
* Append a product view by id (most recent first). Scoped to current store.
*/
function recordProductView(id) {
	if (id == null || id === "") return;
	const idStr = String(id);
	try {
		if (typeof localStorage === "undefined") return;
		const key = getStorageKey();
		const updated = [idStr, ...getRecentlyViewedProducts().filter((x) => x !== idStr)].slice(0, MAX_IDS);
		localStorage.setItem(key, JSON.stringify(updated));
	} catch {}
}
/**
* Get recently viewed product IDs for the current store.
*/
function getRecentlyViewedProducts() {
	try {
		if (typeof localStorage === "undefined") return [];
		const raw = localStorage.getItem(getStorageKey());
		const list = raw ? JSON.parse(raw) : [];
		return Array.isArray(list) ? list : [];
	} catch {
		return [];
	}
}

//#endregion
export { getRecentlyViewedProducts, recordProductView };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUucmVjZW50LmpzIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIi4uL3NyYy9qcy90aGVtZS5yZWNlbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBSZWNlbnRseSB2aWV3ZWQgcHJvZHVjdHMg4oCTIHN0b3JlLXNjb3BlZCBsb2NhbFN0b3JhZ2UgKHByb2R1Y3QgSURzKS5cbiAqIEV4cG9ydHMgcmVjb3JkUHJvZHVjdFZpZXcgYW5kIGdldFJlY2VudGx5Vmlld2VkUHJvZHVjdHMgZm9yIGltcG9ydCB2aWEgQHRoZW1lL3JlY2VudC5cbiAqL1xuXG5jb25zdCBTVE9SQUdFX0tFWV9QUkVGSVggPSAncmVjZW50bHlWaWV3ZWQnO1xuY29uc3QgTUFYX0lEUyA9IDEwO1xuXG5mdW5jdGlvbiBnZXRTdG9yYWdlS2V5KCk6IHN0cmluZyB7XG4gIGNvbnN0IHN0b3JlID0gd2luZG93LnRoZW1lPy5zaG9wPy5wZXJtYW5lbnREb21haW47XG4gIHJldHVybiBbU1RPUkFHRV9LRVlfUFJFRklYLCBzdG9yZV0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ18nKTtcbn1cblxuLyoqXG4gKiBBcHBlbmQgYSBwcm9kdWN0IHZpZXcgYnkgaWQgKG1vc3QgcmVjZW50IGZpcnN0KS4gU2NvcGVkIHRvIGN1cnJlbnQgc3RvcmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWNvcmRQcm9kdWN0VmlldyhpZDogc3RyaW5nKTogdm9pZCB7XG4gIGlmIChpZCA9PSBudWxsIHx8IGlkID09PSAnJykgcmV0dXJuO1xuICBjb25zdCBpZFN0ciA9IFN0cmluZyhpZCk7XG4gIHRyeSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG4gICAgY29uc3Qga2V5ID0gZ2V0U3RvcmFnZUtleSgpO1xuICAgIGNvbnN0IGlkcyA9IGdldFJlY2VudGx5Vmlld2VkUHJvZHVjdHMoKTtcbiAgICBjb25zdCB1cGRhdGVkID0gW2lkU3RyLCAuLi5pZHMuZmlsdGVyKCh4KSA9PiB4ICE9PSBpZFN0cildLnNsaWNlKDAsIE1BWF9JRFMpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkodXBkYXRlZCkpO1xuICB9IGNhdGNoIHtcbiAgICAvLyBpZ25vcmVcbiAgfVxufVxuXG4vKipcbiAqIEdldCByZWNlbnRseSB2aWV3ZWQgcHJvZHVjdCBJRHMgZm9yIHRoZSBjdXJyZW50IHN0b3JlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVjZW50bHlWaWV3ZWRQcm9kdWN0cygpOiBzdHJpbmdbXSB7XG4gIHRyeSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gW107XG4gICAgY29uc3QgcmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oZ2V0U3RvcmFnZUtleSgpKTtcbiAgICBjb25zdCBsaXN0ID0gcmF3ID8gSlNPTi5wYXJzZShyYXcpIDogW107XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkobGlzdCkgPyBsaXN0IDogW107XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLQSxNQUFNLHFCQUFxQjtBQUMzQixNQUFNLFVBQVU7QUFFaEIsU0FBUyxnQkFBd0I7Q0FDL0IsTUFBTSxRQUFRLE9BQU8sT0FBTyxNQUFNO0NBQ2xDLE9BQU8sQ0FBQyxvQkFBb0IsS0FBSyxDQUFDLENBQUMsT0FBTyxPQUFPLENBQUMsQ0FBQyxLQUFLLEdBQUc7QUFDN0Q7Ozs7QUFLQSxTQUFnQixrQkFBa0IsSUFBa0I7Q0FDbEQsSUFBSSxNQUFNLFFBQVEsT0FBTyxJQUFJO0NBQzdCLE1BQU0sUUFBUSxPQUFPLEVBQUU7Q0FDdkIsSUFBSTtFQUNGLElBQUksT0FBTyxpQkFBaUIsYUFBYTtFQUN6QyxNQUFNLE1BQU0sY0FBYztFQUUxQixNQUFNLFVBQVUsQ0FBQyxPQUFPLEdBRFosMEJBQ2lCLENBQUMsQ0FBQyxRQUFRLE1BQU0sTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxPQUFPO0VBQzNFLGFBQWEsUUFBUSxLQUFLLEtBQUssVUFBVSxPQUFPLENBQUM7Q0FDbkQsUUFBUSxDQUVSO0FBQ0Y7Ozs7QUFLQSxTQUFnQiw0QkFBc0M7Q0FDcEQsSUFBSTtFQUNGLElBQUksT0FBTyxpQkFBaUIsYUFBYSxPQUFPLENBQUM7RUFDakQsTUFBTSxNQUFNLGFBQWEsUUFBUSxjQUFjLENBQUM7RUFDaEQsTUFBTSxPQUFPLE1BQU0sS0FBSyxNQUFNLEdBQUcsSUFBSSxDQUFDO0VBQ3RDLE9BQU8sTUFBTSxRQUFRLElBQUksSUFBSSxPQUFPLENBQUM7Q0FDdkMsUUFBUTtFQUNOLE9BQU8sQ0FBQztDQUNWO0FBQ0YifQ==