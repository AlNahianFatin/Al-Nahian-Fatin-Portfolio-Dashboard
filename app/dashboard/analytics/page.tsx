"use client";

import { useEffect, useState } from "react";
import { AnalyticsChart } from "../../../components/AnalyticsChart";

type ChartPoint = {
    date: string;
    views: number;
    messages: number;
};

type ViewRow = {
    id: string;
    createdAt: string;
    date: string;
};

type MessageRow = {
    id: string;
    gmail: string;
    createdAt: string;
};

type RangeData = {
    chart: ChartPoint[];
    latestViews: ViewRow[];
    latestMessages: MessageRow[];
};

type AnalyticsResponse = {
    d7: RangeData;
    d15: RangeData;
};

function stamp(value: string) {
    return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function Analytics() {
    const [data, setData] = useState<AnalyticsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

                const res = await fetch(`/api/dashboard/analytics?timeZone=${encodeURIComponent(timeZone)}`,
                    { cache: "no-store" }
                );

                if (!res.ok)
                    throw new Error("Request failed");

                const json: AnalyticsResponse = await res.json();

                if (!cancelled) {
                    setData(json);
                    setError(false);
                }
            }
            catch (e) {
                console.error("Failed to load analytics", e);

                if (!cancelled)
                    setError(true);
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-transparent">Loading analytics...&nbsp;
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="p-8">
                <p className="text-slate-500">Failed to load analytics.</p>
            </div>
        );
    }

    const { d7, d15 } = data;

    return (
        <main className="p-5 md:p-8">
            <p className="text-sm text-indigo-600">Insights</p>

            <h1 className="mt-1 text-3xl font-bold">Analytics</h1>

            <div className="mt-7 grid gap-6 xl:grid-cols-2">
                <div className="panel p-5">
                    <h2 className="font-bold">Last 7 days</h2>

                    <AnalyticsChart data={d7.chart} />
                </div>

                <div className="panel p-5">
                    <h2 className="font-bold">Last 15 days</h2>

                    <AnalyticsChart data={d15.chart} />
                </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <div className="panel p-5">
                    <h2 className="font-bold">Recent views</h2>

                    <div className="mt-4 divide-y divide-slate-100">
                        {
                            d7.latestViews.map((view) => (
                                <div key={view.id} className="flex justify-between gap-3 py-3 text-xs">
                                    <span className="text-slate-600">View recorded</span>

                                    <span className="text-slate-400">Viewed{" "}{stamp(view.createdAt)}</span>
                                </div>
                            ))
                        }

                        {
                            !d7.latestViews.length && (
                                <p className="py-4 text-sm text-slate-400">No views recorded yet.</p>
                            )
                        }
                    </div>
                </div>

                <div className="panel p-5">
                    <h2 className="font-bold">Recent messages</h2>

                    <div className="mt-4 divide-y divide-slate-100">
                        {
                            d7.latestMessages.map((message) => (
                                <div key={message.id} className="flex justify-between gap-3 py-3 text-xs">
                                    <span className="truncate text-slate-600">{message.gmail}</span>

                                    <span className="shrink-0 text-slate-400">Sent{" "}{stamp(message.createdAt)}</span>
                                </div>
                            ))}

                        {
                            !d7.latestMessages.length && (
                                <p className="py-4 text-sm text-slate-400">No messages yet.</p>
                            )
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}