import { isHtmlElement } from '../utils/dom';
export default function (Alpine) {
    Alpine.store('cache', cacheStore());
    Alpine.directive('cache', ($el, { modifiers, expression }, { Alpine, evaluate }) => {
        var _a;
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if ($el.nodeName !== 'SCRIPT') {
            throw new Error('Can only be used on script tags');
        }
        // Do nothing if the script tag is empty
        if (((_a = $el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) == '') {
            return;
        }
        let json;
        try {
            json = JSON.parse($el.textContent || '{}');
        }
        catch (e) {
            throw new Error(`Could not parse ${$el.textContent} as JSON: ${e}`);
        }
        const resourceName = modifiers[0];
        if (!resourceName) {
            throw new Error('Must specify a store to cache to e.g. x-cache.products');
        }
        const cache = Alpine.store('cache').resources;
        const cacheResource = cache[resourceName];
        if (!cacheResource) {
            throw new Error(`Could not find resource named ${resourceName}. Did you define it in the cache store?`);
        }
        if (expression) {
            const cacheKey = evaluate(expression);
            cacheResource.set(cacheKey, json);
        }
        else {
            if (isSingletonResource(cacheResource)) {
                cacheResource.set(json);
            }
            else {
                cacheResource.upsert(json);
            }
        }
    }).before('bind');
    Alpine.magic('cache', () => {
        return Alpine.store('cache').resources;
    });
}
function isSingletonResource(x) {
    if ('isSingleton' in x && x.isSingleton) {
        return true;
    }
    return false;
}
// TODO test me and document me
function buildResource(builder) {
    return {
        records: {},
        set(key, value) {
            this.records[key] = value;
        },
        populate(records) {
            this.records = records;
        },
        upsert(records) {
            this.records = Object.assign(Object.assign({}, this.records), records);
        },
        evict(key) {
            delete this.records[key];
        },
        reset() {
            this.records = {};
        },
        get(key) {
            const result = this.records[key];
            if (!result) {
                return null;
            }
            if (builder) {
                return builder(result);
            }
            return result;
        },
        get isSingleton() {
            return false;
        },
    };
}
// TODO test me and document me
function buildSingletonResource(builder) {
    return {
        record: null,
        set(value) {
            this.record = value;
        },
        evict() {
            this.record = null;
        },
        reset() {
            this.record = null;
        },
        get() {
            const result = this.record;
            if (!result) {
                return null;
            }
            if (builder) {
                return builder(result);
            }
            return result;
        },
        get isSingleton() {
            return true;
        },
    };
}
function cacheStore() {
    return {
        resources: {},
        reset() {
            Object.keys(this.resources).forEach((key) => {
                this.resources[key].reset();
            });
        },
        addResource(key, options) {
            if (options === null || options === void 0 ? void 0 : options.singleton) {
                this.resources[key] = buildSingletonResource(options === null || options === void 0 ? void 0 : options.builder);
            }
            else {
                this.resources[key] = buildResource(options === null || options === void 0 ? void 0 : options.builder);
            }
        },
    };
}
