/** Human-readable asset tag: XXXX-XXX-XXXX (matches QR generator / validations). */
const ASSET_ID_PATTERN = /^\d{4}-\d{3}-\d{4}$/;

/**
 * Parse the catalog assetId from a scanned QR payload.
 * Supports plain IDs, full URLs (e.g. https://assets.swu.ac.th/7440-001-0001), and embedded patterns.
 */
export function parseAssetIdFromQrValue(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (ASSET_ID_PATTERN.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const segments = url.pathname.split('/').filter(Boolean);
    const last = segments[segments.length - 1];
    if (last) {
      const decoded = decodeURIComponent(last);
      if (ASSET_ID_PATTERN.test(decoded)) return decoded;
    }
  } catch {
    // not a valid absolute URL
  }

  const embedded = trimmed.match(/\b(\d{4}-\d{3}-\d{4})\b/);
  return embedded ? embedded[1] : null;
}
