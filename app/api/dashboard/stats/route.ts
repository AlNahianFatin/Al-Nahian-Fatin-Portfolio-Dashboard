import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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

    return NextResponse.json({ views, messages, unread, v7, v15, m7, m15 });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
