import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

function isValidTimeZone(tz: string) {
    try {
        Intl.DateTimeFormat(undefined, { timeZone: tz });
        return true;
    } catch {
        return false;
    }
}

function dayBucketKey(date: Date, timeZone: string) {
    return new Date(date).toLocaleDateString("sv-SE", { timeZone });
}

async function getRangeData(days: number, timeZone: string) {
    const todayKeyLocal = dayBucketKey(new Date(), timeZone);

    const offsetMinutes = getTimeZoneOffsetMinutes(timeZone, new Date());

    const start = new Date(
        new Date(`${todayKeyLocal}T00:00:00Z`).getTime() -
        offsetMinutes * 60 * 1000 -
        (days - 1) * 24 * 60 * 60 * 1000
    );

    const [views, messages, latestViews, latestMessages] =
        await Promise.all([
            prisma.view.findMany({
                where: { createdAt: { gte: start } },
                select: { createdAt: true },
            }),

            prisma.message.findMany({
                where: { createdAt: { gte: start } },
                select: { createdAt: true },
            }),

            prisma.view.findMany({
                orderBy: { createdAt: "desc" },
                take: 8,
                select: { id: true, createdAt: true, date: true },
            }),

            prisma.message.findMany({
                orderBy: { createdAt: "desc" },
                take: 8,
                select: { id: true, gmail: true, createdAt: true },
            }),
        ]);

    const chart = [];

    for (let i = 0; i < days; i++) {
        const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
        const key = dayBucketKey(d, timeZone);

        const viewCount = views.filter(
            (view) => dayBucketKey(view.createdAt, timeZone) === key
        ).length;

        const messageCount = messages.filter(
            (message) => dayBucketKey(message.createdAt, timeZone) === key
        ).length;

        const [, month, day] = key.split("-");

        chart.push({
            date: `${month}/${day}`,
            views: viewCount,
            messages: messageCount,
        });
    }

    return { chart, latestViews, latestMessages };
}

function getTimeZoneOffsetMinutes(timeZone: string, date: Date) {
    const dtf = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const parts = Object.fromEntries(
        dtf.formatToParts(date).map((p) => [p.type, p.value])
    );

    const asUTC = Date.UTC(
        Number(parts.year),
        Number(parts.month) - 1,
        Number(parts.day),
        Number(parts.hour),
        Number(parts.minute),
        Number(parts.second)
    );

    return (asUTC - date.getTime()) / (60 * 1000);
}

export async function GET(req: Request) {
    try {
        await requireAdmin();

        const url = new URL(req.url);
        const requestedTimeZone = url.searchParams.get("timeZone") || "";

        const timeZone = isValidTimeZone(requestedTimeZone)
            ? requestedTimeZone
            : "UTC";

        const [d7, d15] = await Promise.all([
            getRangeData(7, timeZone),
            getRangeData(15, timeZone),
        ]);

        return NextResponse.json(
            { d7, d15, timeZone },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}