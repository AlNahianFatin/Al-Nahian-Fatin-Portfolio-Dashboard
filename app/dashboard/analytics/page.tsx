import { AnalyticsChart } from "../../../components/AnalyticsChart";
import { prisma } from "../../../lib/prisma";

function formatDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDateTime(date: Date) {
    return new Date(date).toLocaleString("en-BD", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

async function data(days: number) {
    const start = new Date();

    start.setHours(0, 0, 0, 0);

    start.setDate(start.getDate() - days + 1);

    const [views, messages, latestViews, latestMessages] =
        await Promise.all([
            prisma.view.findMany({
                where: {
                    createdAt: {
                        gte: start,
                    },
                },
                select: {
                    createdAt: true,
                },
            }),

            prisma.message.findMany({
                where: {
                    createdAt: {
                        gte: start,
                    },
                },
                select: {
                    createdAt: true,
                },
            }),

            prisma.view.findMany({
                orderBy: {
                    createdAt: "desc",
                },
                take: 8,
                select: {
                    id: true,
                    createdAt: true,
                    date: true,
                },
            }),

            prisma.message.findMany({
                orderBy: {
                    createdAt: "desc",
                },
                take: 8,
                select: {
                    id: true,
                    gmail: true,
                    createdAt: true,
                },
            }),
        ]);

    const chart = [];

    for (let i = 0; i < days; i++) {
        const d = new Date(start);

        d.setDate(start.getDate() + i);

        const key = formatDateKey(d);

        const viewCount = views.filter(
            (view) => formatDateKey(view.createdAt) === key
        ).length;

        const messageCount = messages.filter(
            (message) => formatDateKey(message.createdAt) === key
        ).length;

        chart.push({
            date: `${String(d.getMonth() + 1).padStart(2, "0")}/${String(
                d.getDate()
            ).padStart(2, "0")}`,
            views: viewCount,
            messages: messageCount,
        });
    }

    return {
        chart,
        latestViews,
        latestMessages,
    };
}

export default async function Analytics() {
    const d7 = await data(7);
    const d15 = await data(15);

    return (
        <main className="p-5 md:p-8">
            <p className="text-sm text-indigo-600">Insights</p>

            <h1 className="mt-1 text-3xl font-bold">
                Analytics
            </h1>

            <div className="mt-7 grid gap-6 xl:grid-cols-2">
                <div className="panel p-5">
                    <h2 className="font-bold">
                        Last 7 days
                    </h2>

                    <AnalyticsChart data={d7.chart} />
                </div>

                <div className="panel p-5">
                    <h2 className="font-bold">
                        Last 15 days
                    </h2>

                    <AnalyticsChart data={d15.chart} />
                </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <div className="panel p-5">
                    <h2 className="font-bold">
                        Recent views
                    </h2>

                    <div className="mt-4 divide-y divide-slate-100">
                        {d7.latestViews.map((view) => (
                            <div
                                key={view.id}
                                className="flex justify-between gap-3 py-3 text-xs"
                            >
                                <span className="text-slate-600">
                                    View recorded
                                </span>

                                <span className="text-slate-400">
                                    Viewed{" "}
                                    {formatDateTime(view.createdAt)}
                                </span>
                            </div>
                        ))}

                        {!d7.latestViews.length && (
                            <p className="py-4 text-sm text-slate-400">
                                No views recorded yet.
                            </p>
                        )}
                    </div>
                </div>

                <div className="panel p-5">
                    <h2 className="font-bold">
                        Recent messages
                    </h2>

                    <div className="mt-4 divide-y divide-slate-100">
                        {d7.latestMessages.map((message) => (
                            <div
                                key={message.id}
                                className="flex justify-between gap-3 py-3 text-xs"
                            >
                                <span className="truncate text-slate-600">
                                    {message.gmail}
                                </span>

                                <span className="shrink-0 text-slate-400">
                                    Sent{" "}
                                    {formatDateTime(message.createdAt)}
                                </span>
                            </div>
                        ))}

                        {!d7.latestMessages.length && (
                            <p className="py-4 text-sm text-slate-400">
                                No messages yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}