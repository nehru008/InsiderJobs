import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://1013cdda090eefab1f4912299216a997@o4510787622207488.ingest.de.sentry.io/4510815226101840",

  integrations: [
    nodeProfilingIntegration(),
    Sentry.mongooseIntegration(), // keep this since you're using MongoDB
  ],

  // Tracing
//   tracesSampleRate: 1.0, // capture 100% transactions (reduce in prod)

  // Profiling
  profileSessionSampleRate: 1.0,
  profileLifecycle: "trace",

  // PII (optional)
  sendDefaultPii: true,
});

export default Sentry;