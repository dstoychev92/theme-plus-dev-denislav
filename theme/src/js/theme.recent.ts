/**
 * Recently viewed products – store-scoped localStorage (product IDs).
 * Exports recordProductView and getRecentlyViewedProducts for import via @theme/recent.
 */

const STORAGE_KEY_PREFIX = 'recentlyViewed';
const MAX_IDS = 10;

function getStorageKey(): string {
  const store = window.theme?.shop?.permanentDomain;
  return [STORAGE_KEY_PREFIX, store].filter(Boolean).join('_');
}

/**
 * Append a product view by id (most recent first). Scoped to current store.
 */
export function recordProductView(id: string): void {
  if (id == null || id === '') return;
  const idStr = String(id);
  try {
    if (typeof localStorage === 'undefined') return;
    const key = getStorageKey();
    const ids = getRecentlyViewedProducts();
    const updated = [idStr, ...ids.filter((x) => x !== idStr)].slice(0, MAX_IDS);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

/**
 * Get recently viewed product IDs for the current store.
 */
export function getRecentlyViewedProducts(): string[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(getStorageKey());
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}
