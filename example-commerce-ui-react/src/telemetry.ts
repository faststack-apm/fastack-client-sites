/**
 * Browser telemetry hook.
 *
 * This storefront is a demo "client site". Drop your RUM / tracing SDK initialization in here
 * (it runs once before React renders). Keep it a no-op by default so the site works uninstrumented.
 */
export function initTelemetry(): void {
  // e.g. initMyApmAgent({ serviceName: 'example-commerce-ui-react', endpoint: import.meta.env.VITE_TELEMETRY_URL });
}
