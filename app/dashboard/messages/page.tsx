"use client";
import { useEffect, useState } from "react";
import { Search, CheckCheck } from "lucide-react";

export default function Messages() {
    const [rows, setRows] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    async function load() {
        const p = new URLSearchParams({ search, filter });

        const r = await fetch("/api/messages?" + p);

        const d = await r.json();

        setRows(d.rows || [])
    }

    useEffect(() => {
        load()
    }, [search, filter]);

    async function read(id: string) {
        await fetch("/api/messages", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        load()
    }

    async function all() {
        await fetch("/api/messages", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ all: true })
        });

        load()
    }

    return (
        <main className="p-5 md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm text-indigo-600">Inbox</p>
                    <h1 className="text-3xl font-bold">Messages</h1>
                </div>
                <button onClick={all} className="rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white">
                    <CheckCheck className="mr-2 inline h-4 w-4" />Mark all as read
                </button>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Gmail or message..." className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 outline-none" />

                </div>
                <select value={filter} onChange={e => setFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-4">
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                </select>
            </div>
            <div className="mt-5 space-y-3">
                {
                    rows.map(x => <article key={x.id} className={`panel p-5 ${!x.isRead ? "border-indigo-200 bg-indigo-50/30" : ""}`}>
                        <div className="flex flex-wrap justify-between gap-3"><div>
                            <p className="font-semibold">{x.gmail}</p>
                            <p className="text-xs text-slate-500">{new Date(x.createdAt).toLocaleString()}</p>
                        </div>
                            {
                                !x.isRead &&
                                <button onClick={() => read(x.id)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white">Mark read</button>
                            }
                        </div>
                        <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-700">{x.message}</p></article>)}
                {
                    rows.length === 0 &&
                    <div className="panel p-10 text-center text-slate-500">No messages found.</div>
                }
            </div>
        </main>
    )
}
