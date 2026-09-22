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
    return (
      <div className="p-8">
        <p className="text-slate-500">Loading dashboard stats...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <DashboardContent stats={stats} />
    </div>
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
      <div>
        <p className="text-sm text-indigo-600">Overview</p>
        <h1 className="mt-1 text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-slate-500">Monitor your portfolio and manage its content.</p>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {
          cards.map(([name, value, Icon]) =>
            <div key={String(name)} className="panel p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{name}</p>
                <Icon className="h-5 w-5 text-indigo-500" />
              </div>
              <p className="mt-3 text-3xl font-bold">{String(value)}</p>
            </div>)
        }
      </div>
      <div className="mt-6 panel p-6">
        <h2 className="text-lg font-bold">Unread messages</h2>
        <p className="mt-2 text-slate-500">{unreadCount} message{unreadCount !== 1 ? "s" : ""} need your attention.</p>
      </div>
    </main>
  )
}
