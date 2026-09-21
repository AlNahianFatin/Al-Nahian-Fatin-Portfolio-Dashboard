import { NextResponse } from "next/server";
import { requireAdmin } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export async function GET(req: Request) {
    try {
        await requireAdmin();

        const u = new URL(req.url);
        const search = u.searchParams.get("search") || "";

        const filter = u.searchParams.get("filter") || "all";

        const rows = await prisma.message.findMany({
            where: {
                ...(filter === "read" ? { isRead: true } :
                    filter === "unread" ? { isRead: false } : {}
                ), ...(search ? {
                    OR: [{
                        gmail: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }, {
                        message: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }]
                } : {})
            }, orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ rows });
    }
    catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}

export async function PATCH(req: Request) {
    try {
        await requireAdmin();

        const body = await req.json();

        if (body.all) {
            await prisma.message.updateMany({
                where: {
                    isRead: false
                },
                data: {
                    isRead: true,
                    readAt: new Date()
                }
            });
        }
        else if (body.id) {
            await prisma.message.update({
                where: {
                    id: body.id
                },
                data: {
                    isRead: true,
                    readAt: new Date()
                }
            });
        }
        return NextResponse.json({ ok: true });
    }
    catch {
        return NextResponse.json({ message: "Unable to update messages." }, { status: 400 });
    }
}
