import { Activity, Eye, Mail, MessageSquare, type LucideIcon } from "lucide-react";
import { prisma } from "../../lib/prisma";

async function stats() {
  const now = new Date();

  const d7 = new Date(now);
  d7.setDate(now.getDate() - 7);

  const d15 = new Date(now);
  d15.setDate(now.getDate() - 15);

  const [views, messages, unread, v7, v15, m7, m15] = await Promise.all([
    prisma.view.count(),

    prisma.message.count(),

    prisma.message.count({
      where: { isRead: false }
    }),

    prisma.view.count({
      where: {
        createdAt: { gte: d7 }
      }
    }),

    prisma.view.count({
      where: {
        createdAt: { gte: d15 }
      }
    }),

    prisma.message.count({
      where: {
        createdAt: {
          gte: d7
        }
      }
    }),

    prisma.message.count({
      where: {
        createdAt: {
          gte: d15
        }
      }
    })
  ]);

  return { views, messages, unread, v7, v15, m7, m15 };
}
export default async function Dashboard() {
  const s = await stats();

  const cards: [string, number, LucideIcon][] = [
    ["Views · 7 Days", s.v7, Activity],
    ["Views · 15 Days", s.v15, Activity],
    ["Total Views", s.views, Eye],
    ["Messages · 7 Days", s.m7, MessageSquare],
    ["Messages · 15 Days", s.m15, MessageSquare],
    ["Total Messages", s.messages, Mail],
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
        <p className="mt-2 text-slate-500">{s.unread} message{s.unread !== 1 ? "s" : ""} need your attention.</p>
      </div>
    </main>
  )
}
