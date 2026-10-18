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
    <div className="w-full">
      <div className="flex h-14 items-center justify-between">
        <div className="font-bold lg:hidden">ANF. Admin</div>
        <Link
          href="/dashboard/messages"
          className="ml-auto flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-slate-100"
        >
          <span className="relative">
            <Bell className="h-5 w-5 text-slate-500" />
            {unreadCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </span>
          <span className="text-sm text-slate-500">{unreadCount} unread</span>
        </Link>
      </div>

      {unreadCount > 0 && !dismissed && (
        <div className="animate-banner-in mb-3 flex items-center justify-between gap-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          <span>
            You have <b>{unreadCount}</b> unread message{unreadCount !== 1 ? "s" : ""}.
          </span>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/messages" className="font-semibold underline underline-offset-2 hover:text-indigo-700">
              View messages
            </Link>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss notification"
              className="rounded-md p-1 text-indigo-400 transition-colors hover:bg-indigo-100 hover:text-indigo-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}