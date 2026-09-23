import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/auth";
import { AppError } from "../../../../lib/error-handler";

export async function GET() {
    try {
        const admin = await requireAdmin();
        return NextResponse.json({
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt,
            },
        }, { headers: { "Cache-Control": "no-store" } });
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}

export async function PUT(req: Request) {
    try {
        const admin = await requireAdmin();

        if (!admin) {
            throw new AppError(
                "Admin profile not found.",
                404,
                "general"
            );
        }

        const {
            currentPassword,
            newPassword,
        } = await req.json();

        if (!currentPassword) {
            throw new AppError(
                "Current password is required.",
                400,
                "currentPassword"
            );
        }

        if (!newPassword) {
            throw new AppError(
                "New password is required.",
                400,
                "newPassword"
            );
        }

        if (newPassword.length < 8) {
            throw new AppError(
                "New password must be at least 8 characters.",
                400,
                "newPassword"
            );
        }

        const passwordMatches = await bcrypt.compare(
            currentPassword,
            admin.passwordHash
        );

        if (!passwordMatches) {
            throw new AppError(
                "Current password is incorrect.",
                400,
                "currentPassword"
            );
        }

        const samePassword = await bcrypt.compare(
            newPassword,
            admin.passwordHash
        );

        if (samePassword) {
            throw new AppError(
                "New password must be different from your current password.",
                400,
                "newPassword"
            );
        }

        const rounds = Number(
            process.env.BCRYPT_SALT_ROUNDS || 12
        );

        const hash = await bcrypt.hash(
            newPassword,
            rounds
        );

        await prisma.admin.update({
            where: {
                id: admin.id,
            },
            data: {
                passwordHash: hash,
            },
        });

        return NextResponse.json({
            message: "Password updated successfully.",
        });
    } catch (error) {
        console.error(error);

        if (error instanceof AppError) {
            return NextResponse.json(
                {
                    message: error.message,
                    field: error.field,
                },
                {
                    status: error.statusCode,
                }
            );
        }

        return NextResponse.json(
            {
                message: "Something went wrong. Please try again.",
                field: "general",
            },
            {
                status: 500,
            }
        );
    }
}