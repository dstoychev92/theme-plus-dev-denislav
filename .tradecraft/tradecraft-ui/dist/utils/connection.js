export function hasConnection(navigator) {
    return 'connection' in navigator;
}
export function isSavingData() {
    var _a;
    if (hasConnection(navigator)) {
        return (_a = navigator.connection) === null || _a === void 0 ? void 0 : _a.saveData;
    }
    return undefined;
}
export function isSlowConnection() {
    var _a;
    if (hasConnection(navigator)) {
        return (_a = navigator.connection) === null || _a === void 0 ? void 0 : _a.effectiveType.match(/(2g)/);
    }
    return undefined;
}
