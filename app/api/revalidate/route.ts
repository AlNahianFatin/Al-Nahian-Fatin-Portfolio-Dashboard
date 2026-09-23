import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ message: "Revalidation is not configured." }, { status: 500 });

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (token !== secret) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/messages");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
