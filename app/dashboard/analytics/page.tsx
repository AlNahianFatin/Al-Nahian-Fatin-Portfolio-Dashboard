import { AnalyticsChart } from "../../../components/AnalyticsChart";
import { prisma } from "../../../lib/prisma";

async function data(days: number) {
    const start = new Date();

    start.setHours(0, 0, 0, 0);

    start.setDate(start.getDate() - days + 1);

    const [views, messages] = await Promise.all([
        prisma.view.findMany({
            where: {
                createdAt: {
                    gte: start
                }
            },
            select: {
                createdAt: true
            }
        }),

        prisma.message.findMany({
            where: {
                createdAt: {
                    gte: start
                }
            },
            select: {
                createdAt: true
            }
        })
    ]);

    const out = [];

    for (let i = 0; i < days; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        out.push({
            date: key.slice(5),
            views: views.filter((x: any) =>
                x.createdAt.toISOString().slice(0, 10) === key).length,
            messages: messages.filter((x: any) =>
                x.createdAt.toISOString().slice(0, 10) === key).length
        });
    }

    return out;
}

export default async function Analytics() {
    const d7 = await data(7);

    const d15 = await data(15);

    return (
        <main className="p-5 md:p-8">
            <p className="text-sm text-indigo-600">Insights</p>
            <h1 className="mt-1 text-3xl font-bold">Analytics</h1>
            <div className="mt-7 grid gap-6 xl:grid-cols-2">
                <div className="panel p-5">
                    <h2 className="font-bold">Last 7 days</h2>
                    <AnalyticsChart data={d7} />
                </div>
                <div className="panel p-5">
                    <h2 className="font-bold">Last 15 days</h2>
                    <AnalyticsChart data={d15} />
                </div>
            </div>
        </main>
    )
}
