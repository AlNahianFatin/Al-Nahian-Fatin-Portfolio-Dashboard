/**
 * Notifies the public portfolio project that content has changed, so it can
 * invalidate its cache and reflect the change immediately for visitors.
 *
 * Both projects share the same database, so the portfolio would eventually
 * show the new data anyway — but its homepage is cached (ISR) for
 * performance, so without this call an edit here could sit invisible until
 * the cache's natural expiry. This makes the update near-instant instead.
 *
 * Configure on the DASHBOARD:
 *   PORTFOLIO_URL         - e.g. https://your-portfolio.example.com
 *   REVALIDATE_SECRET     - same value as on the portfolio project
 *
 * This call is fire-and-forget from the caller's point of view: it never
 * throws, so a slow or unreachable portfolio deployment can't block or fail
 * an admin's save action in the dashboard.
 */
export async function revalidatePortfolio() {
  const baseUrl = process.env.PORTFOLIO_URL;
  const secret = process.env.REVALIDATE_SECRET;

  if (!baseUrl || !secret) {
    console.warn(
      "Skipping portfolio revalidation: set PORTFOLIO_URL and REVALIDATE_SECRET in the dashboard's env to enable live sync."
    );
    return;
  }

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/api/revalidate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
      },
      // Never let a slow portfolio deployment hang an admin action.
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.error("Portfolio revalidation responded with an error:", res.status, await res.text().catch(() => ""));
    }
  } catch (error) {
    console.error("Could not reach portfolio for revalidation:", error);
  }
}
