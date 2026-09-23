// export async function revalidatePortfolio() {
//   const baseUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL;
//   const secret = process.env.REVALIDATE_SECRET;

//   if (!baseUrl || !secret) {
//     console.warn(
//       "Skipping portfolio revalidation: set NEXT_PUBLIC_PORTFOLIO_URL and REVALIDATE_SECRET in the dashboard's env to enable live sync."
//     );
//     return;
//   }

//   try {
//     const res = await fetch(`${baseUrl.replace(/\/$/, "")}/api/revalidate`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${secret}`,
//       },

//       signal: AbortSignal.timeout(5000),
//     });

//     if (!res.ok) {
//       console.error("Portfolio revalidation responded with an error:", res.status, await res.text().catch(() => ""));
//     }
//   } catch (error) {
//     console.error("Could not reach portfolio for revalidation:", error);
//   }
// }



export async function revalidatePortfolio() {
  const baseUrl = process.env.PORTFOLIO_URL;
  const secret = process.env.REVALIDATE_SECRET;

  if (!baseUrl || !secret) {
    console.warn(
      "Skipping portfolio revalidation: PORTFOLIO_URL or REVALIDATE_SECRET is missing."
    );

    return false;
  }

  try {
    const response = await fetch(
      `${baseUrl.replace(/\/$/, "")}/api/revalidate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      const message = await response.text().catch(() => "");

      console.error(
        "Portfolio revalidation failed:",
        response.status,
        message
      );

      return false;
    }

    const result = await response.json().catch(() => null);

    console.log("Portfolio revalidated successfully:", result);

    return true;
  } catch (error) {
    console.error(
      "Could not reach portfolio for revalidation:",
      error
    );

    return false;
  }
}