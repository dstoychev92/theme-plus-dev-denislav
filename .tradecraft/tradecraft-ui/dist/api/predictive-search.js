const SEARCH_FIELDS = [
    'resources[type]',
    'resources[limit]',
    'resources[limit_scope]',
    'resources[options][unavailable_products]',
    'resources[options][fields]',
];
export async function predictiveSearch(query, sectionId, formData, options) {
    var _a, _b;
    if (!((_b = (_a = window.theme) === null || _a === void 0 ? void 0 : _a.routes) === null || _b === void 0 ? void 0 : _b.predictiveSearch)) {
        throw new Error('window.theme.routes.predictiveSearch is not defined');
    }
    const queryParams = new URLSearchParams();
    queryParams.set('q', query);
    queryParams.set('section_id', sectionId);
    [...formData.entries()]
        .filter(([key]) => key.includes('resources'))
        .forEach(([key, value]) => {
        if (SEARCH_FIELDS.includes(key)) {
            queryParams.set(key, value.toString());
        }
    });
    return fetch(`${window.theme.routes.predictiveSearch}?${queryParams.toString()}`, options);
}
