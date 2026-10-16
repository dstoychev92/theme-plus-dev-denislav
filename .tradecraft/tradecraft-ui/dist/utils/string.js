export function toCamelCase(string, upperCamel = false) {
    return string.replace(/^([a-z])|_([a-z])/g, function (match, p1, p2) {
        if (p1) {
            return upperCamel ? p1.toUpperCase() : p1;
        }
        else if (p2) {
            return p2.toUpperCase();
        }
    });
}
export function isString(x) {
    return typeof x === 'string';
}
