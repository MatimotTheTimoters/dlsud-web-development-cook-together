/**
 * Generate a reasonably unique id (uses crypto.randomUUID when available).
 */
export function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2);
}

/**
 * Generate a unique id that is not present in the target SheetDB sheet.
 * - sheetUrl: the SheetDB URL already containing ?sheet=SheetName (e.g. apiSheets.users)
 * - opts:
 *    idField: the column name for the id in the sheet (default 'id')
 *    retries: number of attempts (default 3)
 *    check: whether to check uniqueness via a GET (default true)
 *
 * Returns the id string or throws if uniqueness could not be confirmed.
 */
export async function generateUniqueId(sheetUrl, opts = {}) {
  const { idField = 'id', retries = 3, check = true } = opts;
  for (let attempt = 0; attempt < Math.max(1, retries); attempt++) {
    const id = makeId();
    if (!check) return id;

    // append query to filter by id; sheetUrl already contains ?sheet=...
    const url = `${sheetUrl}&${encodeURIComponent(idField)}=${encodeURIComponent(id)}`;
    try {
      const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } });
      if (!res.ok) {
        // server error — optionally retry
        continue;
      }
      const json = await res.json().catch(() => []);
      // SheetDB returns an array of matching rows; empty = no collision
      if (!Array.isArray(json) || json.length === 0) return id;
      // collision extremely unlikely, try again
    } catch (err) {
      // network error — try again
    }
    // small backoff
    await new Promise((r) => setTimeout(r, 150 + Math.random() * 200));
  }
  throw new Error('Could not generate a unique id after retries');
}