"use client";

import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const [busy, setBusy] = useState(false);

  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setGeneralError("");
    setBusy(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.field === "email") {
          setEmailError(data.message);
        } else if (data.field === "password") {
          setPasswordError(data.message);
        } else {
          setGeneralError(
            data.message || "Login failed"
          );
        }

        return;
      }

      router.push("/dashboard");
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
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
      >
        <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
          <LockKeyhole />
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Portfolio Admin
        </h1>

        <p className="mt-2 text-slate-500">
          Sign in to manage your portfolio.
        </p>

        {/* Email */}
        <label className="mt-7 block text-sm font-medium text-slate-700">
          Email

          <input
            required
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none ${emailError
                ? "border-red-500 focus:border-red-500"
                : "border-slate-200 focus:border-indigo-500"
              }`}
          />

          {emailError && (
            <p className="mt-2 text-sm text-red-600">
              {emailError}
            </p>
          )}
        </label>

        {/* Password */}
        <label className="mt-4 block text-sm font-medium text-slate-700">
          Password

          <input
            required
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none ${passwordError
                ? "border-red-500 focus:border-red-500"
                : "border-slate-200 focus:border-indigo-500"
              }`}
          />

          {passwordError && (
            <p className="mt-2 text-sm text-red-600">
              {passwordError}
            </p>
          )}
        </label>

        {/* General error */}
        {generalError && (
          <p className="mt-4 text-center text-sm text-red-600">
            {generalError}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}