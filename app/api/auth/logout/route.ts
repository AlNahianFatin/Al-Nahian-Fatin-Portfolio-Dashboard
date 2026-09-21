import { NextResponse } from "next/server";

export async function POST() {
    const r = NextResponse.json({ ok: true });

    r.cookies.delete("access_token");
    r.cookies.delete("refresh_token");

    return r;
}
