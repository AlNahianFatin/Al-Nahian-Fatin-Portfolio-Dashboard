"use client";

import { Activity, Eye, Mail, MessageSquare, type LucideIcon } from "lucide-react";
import { useMessages } from "../../components/MessageContext";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const r = await fetch("/api/dashboard/stats");
        const d = await r.json();
        setStats(d);
      } catch (e) {
        console.error("Failed to fetch stats", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col">
      <DashboardContent stats={stats} />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <main className="p-5 md:p-8">
      <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-8 w-48 animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-4 w-80 animate-pulse rounded bg-slate-200" />

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="panel p-5">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200" />
            </div>
            <div className="mt-4 h-8 w-16 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </main>
  );
}

function DashboardContent({ stats: s }: { stats: any }) {
  const { unreadCount } = useMessages();

  if (!s) {
    return <div className="p-8">Error loading statistics.</div>;
  }

  const cards: [string, number, LucideIcon][] = [
    ["Views · 7 Days", s.v7 || 0, Activity],
    ["Views · 15 Days", s.v15 || 0, Activity],
    ["Total Views", s.views || 0, Eye],
    ["Messages · 7 Days", s.m7 || 0, MessageSquare],
    ["Messages · 15 Days", s.m15 || 0, MessageSquare],
    ["Total Messages", s.messages || 0, Mail],
  ];

  return (
    <main className="p-5 md:p-8">
      <div className="animate-rise">
        <p className="text-sm font-medium text-indigo-600">Overview</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-500">Monitor your portfolio and manage its content.</p>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([name, value, Icon], i) => (
          <div
            key={String(name)}
            className="panel panel-interactive animate-rise p-5"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{name}</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Icon className="h-4.5 w-4.5" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              {String(value)}
            </p>
          </div>
        ))}
      </div>

      <div
        className="animate-rise mt-6 panel p-6"
        style={{ animationDelay: `${cards.length * 40}ms` }}
      >
        <h2 className="text-lg font-bold text-slate-900">Unread messages</h2>
        <p className="mt-2 text-slate-500">
          {unreadCount} message{unreadCount !== 1 ? "s" : ""} need your attention.
        </p>
      </div>
    </main>
  );
}