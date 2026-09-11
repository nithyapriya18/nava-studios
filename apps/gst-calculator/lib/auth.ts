export const GST_AUTH_COOKIE = 'nava_studios_gst_auth'

export function getExpectedGstPassword() {
  return process.env.GST_APP_PASSWORD || 'nava-gst-2026'
}
