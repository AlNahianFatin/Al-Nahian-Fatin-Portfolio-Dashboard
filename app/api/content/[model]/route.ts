import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/auth";
import cloudinary from "../../../../lib/cloudinary";

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

        const orderField = m === 'resume' ? 'uploadedAt' : 'updatedAt';
        const rows = await model(m).findMany({
            orderBy: {
                [orderField]: "desc"
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

        const formData = await req.formData();
        const body: any = {};

        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                const arrayBuffer = await value.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const uploadResponse = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: `portfolio/${m}` },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    ).end(buffer);
                }) as any;

                if (m === 'resume') {
                    body['fileUrl'] = uploadResponse.secure_url;
                    body['filePublicId'] = uploadResponse.public_id;
                } else {
                    body['imageUrl'] = uploadResponse.secure_url;
                    body['imagePublicId'] = uploadResponse.public_id;
                }
            } else {
                // Handle Date fields to ensure ISO-8601 format
                if (["startDate", "endDate", "publicationDate"].includes(key) && value) {
                    body[key] = new Date(value).toISOString();
                }
                // Convert "true"/"false" strings from FormData to actual booleans
                else if (value === "true") {
                    body[key] = true;
                } else if (value === "false") {
                    body[key] = false;
                }
                // Handle sortOrder, level and other integer fields
                else if (["sortOrder", "level"].includes(key) && value !== "") {
                    const parsed = parseInt(value, 10);
                    body[key] = isNaN(parsed) ? 0 : parsed;
                } else {
                    body[key] = value;
                }
            }
        }

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

        const formData = await req.formData();
        const body: any = {};

        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                const arrayBuffer = await value.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const uploadResponse = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: `portfolio/${m}` },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    ).end(buffer);
                }) as any;

                if (m === 'resume') {
                    body['fileUrl'] = uploadResponse.secure_url;
                    body['filePublicId'] = uploadResponse.public_id;
                } else {
                    body['imageUrl'] = uploadResponse.secure_url;
                    body['imagePublicId'] = uploadResponse.public_id;
                }
            } else {
                // Handle Date fields to ensure ISO-8601 format
                if (["startDate", "endDate", "publicationDate"].includes(key) && value) {
                    body[key] = new Date(value).toISOString();
                }
                // Convert "true"/"false" strings from FormData to actual booleans
                else if (value === "true") {
                    body[key] = true;
                } else if (value === "false") {
                    body[key] = false;
                }
                // Handle sortOrder, level and other integer fields
                else if (["sortOrder", "level"].includes(key) && value !== "") {
                    const parsed = parseInt(value, 10);
                    body[key] = isNaN(parsed) ? 0 : parsed;
                } else {
                    body[key] = value;
                }
            }
        }

        const id = body.id;
        delete body.id;

        const row = await model(m).update({
            where: { id }, data: body
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
