/**
 * Sends a PostHog event without putting PostHog in the page's initial
 * bundle. instrumentation-client.ts initialises the same module instance
 * once the browser is idle; this just imports it on demand.
 */
export function track(event: string, properties?: Record<string, unknown>) {
  import('posthog-js').then(({ default: posthog }) => {
    posthog.capture(event, properties)
  })
}
