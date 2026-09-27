/**
 * A screenshot of the top of a web page (what a visitor sees first), taken by
 * Microlink (microlink.io). The free plan allows about 25 a day across the
 * whole site and needs no key; set MICROLINK_API_KEY to use a paid plan.
 * Returns an image URL, or null if the screenshot couldn't be taken, in which
 * case the review goes ahead from the page text alone.
 */
export async function screenshotUrl(pageUrl: string): Promise<string | null> {
  const key = process.env.MICROLINK_API_KEY
  const params = new URLSearchParams({
    url: pageUrl,
    screenshot: 'true',
    meta: 'false',
    'viewport.width': '1280',
    'viewport.height': '800',
    'viewport.deviceScaleFactor': '1',
    'screenshot.type': 'jpeg',
  })
  const endpoint = key ? 'https://pro.microlink.io' : 'https://api.microlink.io'
  try {
    const res = await fetch(`${endpoint}/?${params}`, {
      headers: key ? { 'x-api-key': key } : undefined,
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) {
      console.warn('[screenshot] Microlink returned', res.status)
      return null
    }
    const data = await res.json()
    const url = data?.data?.screenshot?.url
    return typeof url === 'string' && url.startsWith('https://') ? url : null
  } catch (err) {
    console.warn('[screenshot] failed:', err instanceof Error ? err.message : err)
    return null
  }
}

/** Accepts an uploaded screenshot as a data URL: PNG, JPEG or WebP, under ~3 MB. */
export function parseImageDataUrl(value: unknown) {
  if (typeof value !== 'string' || value.length > 4_000_000) return null
  const m = value.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/)
  return m ? { mediaType: m[1], data: m[2] } : null
}
