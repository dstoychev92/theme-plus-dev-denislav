export async function change(payload, init) {
    var _a, _b;
    if (!((_b = (_a = window === null || window === void 0 ? void 0 : window.theme) === null || _a === void 0 ? void 0 : _a.routes) === null || _b === void 0 ? void 0 : _b.cartChange)) {
        throw new Error('window.theme.routes.cartChange is not defined');
    }
    return fetch(`${window.theme.routes.cartChange}.js`, Object.assign({ method: 'POST', headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify(payload) }, init));
}
