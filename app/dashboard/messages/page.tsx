"use client";
import { useEffect, useState } from "react";
import { Search, CheckCheck, Trash2 } from "lucide-react";
import { useMessages } from "../../../components/MessageContext";
import { toast } from "sonner";

export default function Messages() {
    const { markAsRead, markAllAsRead } = useMessages();
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
        await markAsRead(id);
        load()
    }

    async function all() {
        await markAllAsRead();
        load()
    }

    async function removeMessage(id: string) {
        try {
            const r = await fetch(`/api/messages?id=${id}`, {
                method: "DELETE"
            });
            if (r.ok) {
                toast.success("Message deleted");
            } else {
                toast.error("Failed to delete message");
            }
            load();
        } catch (e) {
            toast.error("An error occurred while deleting");
        }
    }

    return (
        <main className="p-5 md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-sm text-indigo-600">Inbox</p>
                    <h1 className="text-3xl font-bold">Messages</h1>
                </div>
                <button onClick={all} className="rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-600/80 hover:scale-105 hover:cursor-pointer transition-all">
                    <CheckCheck className="mr-2 inline h-4 w-4" />Mark all as read
                </button>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Gmail or message..." className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 outline-none" />

                </div>
                <select value={filter} onChange={e => setFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 hover:cursor-pointer">
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                </select>
            </div>
            <div className="mt-5 space-y-3">
                {
                    rows.map(x => <article key={x.id} className={`panel p-5 ${!x.isRead ? "border-indigo-200 bg-indigo-50/30" : ""}`}>
                        <div className="flex flex-wrap justify-between gap-3"><div className="flex items-center gap-2">
                            <p className="font-semibold">{x.gmail}</p>
                            <p className="text-xs text-slate-500">{new Date(x.createdAt).toLocaleString()}</p>
                        </div>
                            <div className="flex gap-2">
                                {!x.isRead &&
                                    <button onClick={() => read(x.id)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-600/80 hover:scale-105 hover:cursor-pointer transition-all">Mark read</button>
                                }
                                <button onClick={() => removeMessage(x.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-400/80 hover:scale-105 hover:text-black hover:border-black hover:cursor-pointer transition-all">
                                    <Trash2 className="h-3 w-3 inline mr-1" /> Delete
                                </button>
                            </div>
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
