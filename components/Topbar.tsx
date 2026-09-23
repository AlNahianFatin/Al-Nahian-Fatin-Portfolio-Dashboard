"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, X } from "lucide-react";
import { useMessages } from "./MessageContext";

export function Topbar() {
  const { unreadCount } = useMessages();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (unreadCount === 0) setDismissed(false);
  }, [unreadCount]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-5">
        <div className="font-bold lg:hidden">ANF. Admin</div>
        <Link href="/dashboard/messages" className="ml-auto flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-50">
          <span className="relative">
            <Bell className="h-5 w-5 text-slate-500" />
            {unreadCount > 0 && <span className="absolute -right-1.5 -top-1.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">{unreadCount > 99 ? "99+" : unreadCount}</span>}
          </span>
          <span className="text-sm text-slate-500">{unreadCount} unread</span>
        </Link>
      </div>
      {unreadCount > 0 && !dismissed && (
        <div className="mx-5 mb-3 flex items-center justify-between gap-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          <span>You have <b>{unreadCount}</b> unread message{unreadCount !== 1 ? "s" : ""}.</span>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/messages" className="font-semibold underline">View messages</Link>
            <button onClick={() => setDismissed(true)} aria-label="Dismiss notification"><X className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </header>
  );
}
