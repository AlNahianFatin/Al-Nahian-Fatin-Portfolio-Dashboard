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

      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.error("Portfolio revalidation responded with an error:", res.status, await res.text().catch(() => ""));
    }
  } catch (error) {
    console.error("Could not reach portfolio for revalidation:", error);
  }
}
