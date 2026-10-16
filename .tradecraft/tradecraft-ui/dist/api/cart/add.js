export async function add(formData, init) {
    var _a, _b;
    if (!((_b = (_a = window === null || window === void 0 ? void 0 : window.theme) === null || _a === void 0 ? void 0 : _a.routes) === null || _b === void 0 ? void 0 : _b.cartAdd)) {
        throw new Error('window.theme.routes.cartAdd is not defined');
    }
    return fetch(`${window.theme.routes.cartAdd}.js`, Object.assign({ method: 'POST', body: formData }, init));
}
