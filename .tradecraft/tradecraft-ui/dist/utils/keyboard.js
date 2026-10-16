export function isPrintableCharacter(str) {
    var _a;
    return str.length === 1 && ((_a = str.match(/\S/)) === null || _a === void 0 ? void 0 : _a.length) === 1;
}
