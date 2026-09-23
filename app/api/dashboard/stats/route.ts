// import { prisma } from "../../../../lib/prisma";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const now = new Date();

//     const d7 = new Date(now);
//     d7.setDate(now.getDate() - 7);

//     const d15 = new Date(now);
//     d15.setDate(now.getDate() - 15);

//     const [views, messages, unread, v7, v15, m7, m15] = await Promise.all([
//       prisma.view.count(),
//       prisma.message.count(),
//       prisma.message.count({
//         where: { isRead: false }
//       }),
//       prisma.view.count({
//         where: {
//           createdAt: { gte: d7 }
//         }
//       }),
//       prisma.view.count({
//         where: {
//           createdAt: { gte: d15 }
//         }
//       }),
//       prisma.message.count({
//         where: {
//           createdAt: {
//             gte: d7
//           }
//         }
//       }),
//       prisma.message.count({
//         where: {
//           createdAt: {
//             gte: d15
//           }
//         }
//       })
//     ]);

//     return NextResponse.json({ views, messages, unread, v7, v15, m7, m15 });
//   } catch (error) {
//     console.error("Dashboard stats error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const d7 = new Date(today);
    d7.setDate(today.getDate() - 6);

    const d15 = new Date(today);
    d15.setDate(today.getDate() - 14);

    const [
      views,
      messages,
      unread,
      v7,
      v15,
      m7,
      m15,
    ] = await Promise.all([
      // All-time views
      prisma.view.count(),

      // All-time messages
      prisma.message.count(),

      // Current unread messages
      prisma.message.count({
        where: {
          isRead: false,
        },
      }),

      // Last 7 calendar days
      prisma.view.count({
        where: {
          createdAt: {
            gte: d7,
          },
        },
      }),

      // Last 15 calendar days
      prisma.view.count({
        where: {
          createdAt: {
            gte: d15,
          },
        },
      }),

      // Messages in last 7 calendar days
      prisma.message.count({
        where: {
          createdAt: {
            gte: d7,
          },
        },
      }),

      // Messages in last 15 calendar days
      prisma.message.count({
        where: {
          createdAt: {
            gte: d15,
          },
        },
      }),
    ]);

    return NextResponse.json({
      views,
      messages,
      unread,
      v7,
      v15,
      m7,
      m15,
    });
  } catch (error) {
    console.error(
      "Dashboard stats error:",
      error
    );

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}