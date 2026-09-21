import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/auth";

const allowed = ["profile", "education", "skill", "project", "publication", "socialLink", "resume", "portfolioSetting"] as const;

type Model = typeof allowed[number];

function model(name: string) {
    return (prisma as any)[name] as any;
}

export async function GET(_: Request, { params }: { params: Promise<{ model: string }> }) {
    try {
        await requireAdmin();

        const { model: m } = await params;

        if (!allowed.includes(m as Model))
            return NextResponse.json({ message: "Invalid model" }, { status: 400 });

        const rows = await model(m).findMany({
            orderBy: {
                updatedAt: "desc"
            }
        });

        return NextResponse.json({ rows });
    }
    catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ model: string }> }) {
    try {
        await requireAdmin();

        const { model: m } = await params;

        if (!allowed.includes(m as Model))
            return NextResponse.json({ message: "Invalid model" }, { status: 400 });

        const body = await req.json();

        delete body.id;

        const row = await model(m).create({ data: body });

        return NextResponse.json({ row, message: "Saved successfully" });
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Could not save item." }, { status: 400 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ model: string }> }) {
    try {
        await requireAdmin();

        const { model: m } = await params;

        const body = await req.json();
        const { id, ...data } = body;

        const row = await model(m).update({
            where: { id }, data
        });
        return NextResponse.json({ row, message: "Updated successfully" });
    }
    catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Could not update item." }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ model: string }> }) {
    try {
        await requireAdmin();

        const { model: m } = await params;

        const id = new URL(req.url).searchParams.get("id");
        if (!id)
            return NextResponse.json({ message: "Missing id" }, { status: 400 });

        await model(m).delete({
            where: { id }
        });

        return NextResponse.json({ ok: true });
    }
    catch {
        return NextResponse.json({ message: "Could not delete item." }, { status: 400 });
    }
}
