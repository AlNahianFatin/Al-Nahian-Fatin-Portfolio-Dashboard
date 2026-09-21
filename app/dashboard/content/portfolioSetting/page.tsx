"use client";
import { useEffect, useState } from "react";

export default function SettingsContent() {
    const [rows, setRows] = useState<any[]>([]);
    const [key, setKey] = useState("");
    const [value, setValue] = useState("");
    const [editing, setEditing] = useState<string | null>(null);

    const load = () => fetch("/api/content/portfolioSetting")
        .then(r => r.json())
        .then(d => setRows(d.rows || []));

    useEffect(() => {
        load()
    }, []);

    async function save(e: React.FormEvent) {
        e.preventDefault();

        const body = editing ? { id: editing, key, value } : { key, value };

        await fetch("/api/content/portfolioSetting", {
            method: editing ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        setKey("");
        setValue("");
        setEditing(null);

        load();
    }

    return (
        <main className="p-5 md:p-8">
            <p className="text-sm text-indigo-600">Portfolio</p>
            <h1 className="mt-1 text-3xl font-bold">Portfolio Settings</h1>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">

                <form onSubmit={save} className="panel p-6">

                    <input value={key} onChange={e => setKey(e.target.value)} placeholder="setting key"
                        className="w-full rounded-xl border p-3" />
                    <textarea value={value} onChange={e => setValue(e.target.value)} placeholder="setting value"
                        className="mt-3 min-h-32 w-full rounded-xl border p-3" />

                    <button className="mt-3 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white">
                        {editing ? "Update" : "Add"} setting
                    </button>

                </form>

                <div className="space-y-3">
                    {
                        rows.map(r =>
                            <div key={r.id} className="panel p-4">
                                <div className="flex justify-between gap-3">
                                    <div>
                                        <b>{r.key}</b>
                                        <p className="mt-1 text-sm text-slate-500">{r.value}</p>
                                    </div>
                                    <button onClick={() => { setEditing(r.id); setKey(r.key); setValue(r.value) }}
                                        className="rounded-lg border px-3 py-1.5 text-sm">Edit</button>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </main>
    )
}
