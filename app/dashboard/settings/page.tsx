"use client";

import { useState } from "react";

export default function Settings() {
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");

    const [currentPassError, setCurrentPassError] =
        useState("");

    const [newPassError, setNewPassError] =
        useState("");

    const [generalError, setGeneralError] =
        useState("");

    const [status, setStatus] = useState("");

    const [busy, setBusy] = useState(false);

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
                    method: "POST",
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

            setStatus(
                d.message || "Password updated successfully."
            );

            setCurrentPass("");
            setNewPass("");

            setCurrentPassError("");
            setNewPassError("");
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

                    <input
                        required
                        type="password"
                        value={currentPass}
                        onChange={(e) => {
                            setCurrentPass(e.target.value);
                            setCurrentPassError("");
                        }}
                        className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none ${currentPassError
                                ? "border-red-500 focus:border-red-500"
                                : "border-slate-200 focus:border-indigo-500"
                            }`}
                    />

                    {currentPassError && (
                        <p className="mt-1 text-sm text-red-600">
                            {currentPassError}
                        </p>
                    )}
                </label>

                {/* New Password */}
                <label className="mt-4 block text-sm">
                    New password

                    <input
                        required
                        minLength={8}
                        type="password"
                        value={newPass}
                        onChange={(e) => {
                            setNewPass(e.target.value);
                            setNewPassError("");
                        }}
                        className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none ${newPassError
                                ? "border-red-500 focus:border-red-500"
                                : "border-slate-200 focus:border-indigo-500"
                            }`}
                    />

                    {newPassError && (
                        <p className="mt-1 text-sm text-red-600">
                            {newPassError}
                        </p>
                    )}
                </label>

                {/* General Error */}
                {generalError && (
                    <p className="mt-4 text-sm text-red-600">
                        {generalError}
                    </p>
                )}

                {/* Success */}
                {status && (
                    <p className="mt-4 text-sm text-green-600">
                        {status}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={busy}
                    className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
                >
                    {busy
                        ? "Updating..."
                        : "Update password"}
                </button>
            </form>
        </main>
    );
}