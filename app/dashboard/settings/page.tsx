"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);

    const [currentPassError, setCurrentPassError] =
        useState("");

    const [newPassError, setNewPassError] =
        useState("");

    const [generalError, setGeneralError] =
        useState("");

    const [status, setStatus] = useState("");

    const [busy, setBusy] = useState(false);
    const [admin, setAdmin] = useState<any>(null);

    const load = () => fetch("/api/settings/password", { cache: "no-store" })
        .then(r => r.json())
        .then(d => setAdmin(d.admin || null))
        .catch(() => { });

    useEffect(() => {
        fetch("/api/settings/password", { cache: "no-store" })
            .then(r => r.json())
            .then(d => setAdmin(d.admin || null))
            .catch(() => { });
    }, []);

    async function save(e: React.FormEvent) {
        e.preventDefault();

        setCurrentPassError("");
        setNewPassError("");
        setGeneralError("");
        setStatus("");

        setBusy(true);

        try {
            const r = await fetch(
                "/api/settings/password",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        currentPassword: currentPass,
                        newPassword: newPass,
                    }),
                }
            );

            const d = await r.json();

            if (!r.ok) {
                if (d.field === "currentPassword") {
                    setCurrentPassError(d.message);
                } else if (d.field === "newPassword") {
                    setNewPassError(d.message);
                } else {
                    setGeneralError(
                        d.message ||
                        "Something went wrong. Please try again."
                    );
                }

                return;
            }

            toast.success(d.message || "Saved successfully");

            setCurrentPass("");
            setNewPass("");

            setCurrentPassError("");
            setNewPassError("");

            load();
        } catch (error) {
            console.error(error);

            setGeneralError(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="p-5 md:p-8">
            <p className="text-sm text-indigo-600">
                Settings
            </p>

            <h1 className="mt-1 text-3xl font-bold">
                Account settings
            </h1>

            {admin && (
                <div className="panel mt-7 max-w-xl p-5">
                    <p className="text-sm font-semibold">Admin account</p>
                    <p className="mt-2 text-sm text-slate-600">{admin.name || "Administrator"} · {admin.email}</p>
                    <div className="mt-3 text-xs text-slate-400">
                        <p>Created: {new Date(admin.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</p>
                        <p className="mt-1">Updated: {new Date(admin.updatedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</p>
                    </div>
                </div>
            )}

            <form
                onSubmit={save}
                className="panel mt-7 max-w-xl p-6"
            >
                <h2 className="font-bold">
                    Change password
                </h2>

                {/* Current Password */}
                <label className="mt-5 block text-sm">
                    Current password
                    <div className="relative mt-1">
                        <input
                            required
                            type={showCurrentPass ? "text" : "password"}
                            value={currentPass}
                            onChange={(e) => {
                                setCurrentPass(e.target.value);
                                setCurrentPassError("");
                            }}
                            className={`w-full rounded-xl border px-3 py-2 pr-10 outline-none ${currentPassError
                                ? "border-red-500 focus:border-red-500"
                                : "border-slate-200 focus:border-indigo-500"
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {currentPassError && (
                        <p className="mt-1 text-sm text-red-600">
                            {currentPassError}
                        </p>
                    )}
                </label>

                {/* New Password */}
                <label className="mt-4 block text-sm">
                    New password
                    <div className="relative mt-1">
                        <input required minLength={8} type={showNewPass ? "text" : "password"} value={newPass}
                            onChange={(e) => {
                                setNewPass(e.target.value);
                                setNewPassError("");
                            }}
                            className={`w-full rounded-xl border px-3 py-2 pr-10 outline-none ${newPassError
                                ? "border-red-500 focus:border-red-500"
                                : "border-slate-200 focus:border-indigo-500"
                                }`}
                        />
                        <button
                            type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {
                        newPassError && (
                            <p className="mt-1 text-sm text-red-600">
                                {newPassError}
                            </p>
                        )
                    }
                </label>

                {/* General Error */}
                {
                    generalError && (
                        <p className="mt-4 text-sm text-red-600">
                            {generalError}
                        </p>
                    )
                }

                {/* Success */}
                {
                    status && (
                        <p className="mt-4 text-sm text-green-600">
                            {status}
                        </p>
                    )
                }

                <button type="submit" disabled={busy} className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50 hover:bg-indigo-600/80 hover:scale-105 hover:cursor-pointer transition-all" >
                    {busy ? "Updating..." : "Update password"}
                </button>
            </form>
        </main>
    );
}