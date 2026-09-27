/**
 * A visitor's own score history, kept in their browser (localStorage), so a
 * repeat review can show "5 → 8 since 12 Sep". Nothing here reaches the
 * server. Links are grouped by page; pasted copy is compared with the last
 * pasted review, which suits rewriting and re-checking the same copy.
 */

export type HistoryEntry = { at: string; score: number; areas: Record<string, number> }

const STORAGE_KEY = 'npv-review-history'
const KEEP = 10

/** The same page gives the same key: no protocol, www, trailing slash, query or hash. */
export function pageKey(input: string, isLink: boolean) {
  if (!isLink) return 'pasted-copy'
  const bare = input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/[?#].*$/, '')
    .replace(/\/+$/, '')
  return `page:${bare}`
}

function readAll(): Record<string, HistoryEntry[]> {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

/** Earlier reviews of this page, oldest first. */
export function historyFor(key: string): HistoryEntry[] {
  const list = readAll()[key]
  return Array.isArray(list) ? list : []
}

export function recordReview(key: string, entry: HistoryEntry) {
  try {
    const all = readAll()
    all[key] = [...(all[key] ?? []), entry].slice(-KEEP)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    // Private windows and full storage just mean no history; the review still works.
  }
}

export function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
