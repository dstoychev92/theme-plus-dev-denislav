export async function get(init) {
    var _a, _b;
    if (!((_b = (_a = window === null || window === void 0 ? void 0 : window.theme) === null || _a === void 0 ? void 0 : _a.routes) === null || _b === void 0 ? void 0 : _b.cart)) {
        throw new Error('window.theme.routes.cart is not defined');
    }
    return fetch(`${window.theme.routes.cart}.js`, Object.assign({ method: 'GET', headers: {
            'Content-Type': 'application/json',
        } }, init));
}
