"use client";
import { Eraser, Pencil, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const stamp = (value: string | Date | undefined) => value ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";

export default function SettingsContent() {
    const [rows, setRows] = useState<any[]>([]);
    const [key, setKey] = useState("");
    const [value, setValue] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [editing, setEditing] = useState<string | null>(null);
    const [status, setStatus] = useState("");

    const load = () => fetch("/api/content/portfolioSetting")
        .then(r => r.json())
        .then(d => setRows(d.rows || []));

    useEffect(() => {
        load()
    }, []);

    function clearForm() {
        setKey("");
        setValue("");
        setEditing(null);
        setErrors({});
        setStatus("");
    }

    async function save(e: any) {
        e.preventDefault();
        setErrors({});

        if (!key) {
            setErrors({ key: "Key is required" });
            toast.error("Key is required");
            return;
        }

        setStatus("Saving...");

        const formData = new FormData();
        formData.append("key", key);
        formData.append("value", value);
        if (editing)
            formData.append("id", editing);

        const r = await fetch("/api/content/portfolioSetting", {
            method: "PUT",
            body: formData
        });

        const d = await r.json();

        if (!r.ok) {
            if (d.field) {
                setErrors({ [d.field]: d.message });
                toast.error(d.message);
            } else {
                setStatus(d.message || "Something went wrong");
                toast.error(d.message || "Something went wrong");
            }
            return;
        }

        toast.success(d.message || "Saved successfully");
        clearForm();
        load();
    }

    return (
        <main className="p-5 md:p-8">
            <p className="text-sm text-indigo-600">Portfolio</p>
            <h1 className="mt-1 text-3xl font-bold">Portfolio Settings</h1>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">

                <form onSubmit={save} className="panel p-6">
                    <label className="block text-sm font-medium">
                        Setting key
                        <input value={key} onChange={e => setKey(e.target.value)} placeholder="setting key"
                            disabled
                            className={`mt-1 w-full rounded-xl border p-3 outline-none bg-slate-50 text-slate-500 cursor-not-allowed ${errors.key ? "border-red-500" : "border-slate-200"}`} />
                        {
                            errors.key &&
                            <p className="mt-1 text-xs text-red-600">{errors.key}</p>
                        }
                    </label>
                    <label className="mt-4 block text-sm font-medium">
                        Setting value (optional)
                        <textarea value={value} onChange={e => setValue(e.target.value)} placeholder="setting value"
                            className={`mt-1 min-h-32 w-full rounded-xl border p-3 outline-none ${errors.value ? "border-red-500" : "border-slate-200"}`} />
                        {
                            errors.value &&
                            <p className="mt-1 text-xs text-red-600">{errors.value}</p>
                        }
                    </label>

                    <div className="mt-5 flex gap-2">
                        {
                            editing && (
                                <>
                                    <button className="flex flex-row rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-600/80 hover:scale-105 hover:cursor-pointer transition-all">
                                        <Save className="h-5 pr-2 pt-1.5" />Update setting
                                    </button>
                                    <button type="button" onClick={clearForm} className="flex flex-row rounded-xl border px-5 py-2.5 font-semibold text-slate-600 hover:bg-red-400/80 hover:text-black hover:border-black hover:scale-105 hover:cursor-pointer transition-all">
                                        <Eraser className="h-5 pr-2 pt-1.5" />Clear
                                    </button>
                                </>
                            )
                        }
                    </div>
                    <p className="mt-3 text-sm text-slate-500">{status}</p>
                </form>

                <div className="space-y-3">
                    {
                        rows.map(r =>
                            <div key={r.id} className="panel p-4">
                                <div className="flex justify-between gap-3">
                                    <div>
                                        <b>{r.key}</b>
                                        <p className="mt-1 text-sm text-slate-500">{r.value}</p>
                                        <div className="mt-2 text-[11px] text-slate-400">
                                            <p>Created: {stamp(r.createdAt)}</p>
                                            <p>Updated: {stamp(r.updatedAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditing(r.id); setKey(r.key); setValue(r.value) }}
                                            className="flex flex-row rounded-xl border px-3 py-1.5 h-10 text-sm hover:bg-indigo-600/80 hover:scale-105 hover:cursor-pointer transition-all">
                                            <Pencil className="h-5 pr-2 pt-1.5" />Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </main>
    )
}
