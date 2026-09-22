import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { issueTokens, verifyRefresh } from "../../../../lib/auth";
import { AppError } from "../../../../lib/error-handler";

export async function POST() {
  const c = await cookies();
  const token = c.get("refresh_token")?.value;

  if (!token)
    return NextResponse.json({ message: "No refresh token." }, { status: 401 });

  try {
    const id = await verifyRefresh(token);

    if (!id)
      return NextResponse.json({ message: "User ID not found" }, { status: 404 });

    const tokens = await issueTokens(id);

    const res = NextResponse.json({ ok: true });

    res.cookies.set("access_token", tokens.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 900
    });

    res.cookies.set("refresh_token", tokens.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
      maxAge: 604800
    });

    return res;

  }
  catch {
    return NextResponse.json({ message: "Invalid refresh token." }, { status: 401 });
  }
}
