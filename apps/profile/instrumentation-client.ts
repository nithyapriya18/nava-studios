const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

if (!projectToken || !host) {
  if (process.env.NODE_ENV === "development") {
    const variableName = !projectToken
      ? "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN"
      : "NEXT_PUBLIC_POSTHOG_HOST"

    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    )
  }
} else {
  // PostHog (with its session-replay recorder) is the largest script on the
  // site, so it loads once the browser is idle instead of competing with the
  // first paint. The pageview is still captured when it initialises.
  const start = () => {
    import("posthog-js").then(({ default: posthog }) => {
      posthog.init(projectToken, {
        api_host: host,
        defaults: "2026-01-30",
        capture_exceptions: true,
        debug: process.env.NODE_ENV === "development",
      })
    })
  }

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(start, { timeout: 3000 })
  } else {
    setTimeout(start, 1500)
  }
}
