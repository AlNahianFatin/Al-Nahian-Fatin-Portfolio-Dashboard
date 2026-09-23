import { NextResponse } from "next/server";
import { requireAdmin } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { revalidatePortfolio } from "../../../lib/revalidatePortfolio";

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

        return NextResponse.json({ rows }, { headers: { "Cache-Control": "no-store" } });
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
        await revalidatePortfolio();

        return NextResponse.json({ ok: true });
    }
    catch {
        return NextResponse.json({ message: "Unable to update messages." }, { status: 400 });
    }
}

export async function DELETE(req: Request) {
    try {
        await requireAdmin();

        const u = new URL(req.url);
        const id = u.searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "Missing id" }, { status: 400 });
        }

        await prisma.message.delete({
            where: { id }
        });

        await revalidatePortfolio();

        return NextResponse.json({ ok: true });
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Unable to delete message." }, { status: 400 });
    }
}
