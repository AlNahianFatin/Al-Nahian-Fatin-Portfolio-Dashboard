import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const enc = new TextEncoder();

export async function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/dashboard"))
    return NextResponse.next();

  const token = req.cookies.get("access_token")?.value;

  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    const secret = enc.encode(process.env.JWT_ACCESS_SECRET || "dev-access-secret");

    await jwtVerify(token, secret);

    return NextResponse.next();
  }
  catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = { matcher: ["/dashboard/:path*"] };
