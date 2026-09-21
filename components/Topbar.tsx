"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, X } from "lucide-react";

export function Topbar() {
  const [count, setCount] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  
  useEffect(() => {
    fetch("/api/messages/unread")
      .then(r => r.json())
      .then(d => setCount(d.count || 0))
      .catch(() => { })
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-5">
        <div className="lg:hidden font-bold">ANF. Admin</div>
        <div className="ml-auto flex items-center gap-3">
          <Bell className="h-5 w-5 text-slate-500" />
          <span className="text-sm text-slate-500">{count} unread</span>
        </div>
      </div>
      {
        count > 0 && !dismissed &&
        <div
          className="mx-5 mb-3 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          <span>You have <b>{count}</b> unread message{count !== 1 ? "s" : ""}.</span>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/messages" className="font-semibold underline">View messages</Link>
            <button onClick={() => setDismissed(true)}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      }
    </header>
  )
}
