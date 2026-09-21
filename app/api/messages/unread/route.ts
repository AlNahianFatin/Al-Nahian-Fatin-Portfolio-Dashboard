import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
    try {
        await requireAdmin();

        const count = await prisma.message.count({
            where: { isRead: false }
        });

        return NextResponse.json({ count });
    }
    catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}
