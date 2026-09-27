// import Providers from "../components/Providers";
// import { MessageProvider } from "../components/MessageContext";
// import { Toaster } from "sonner";
// import "./globals.css";
// import type { Metadata } from "next";
// import { prisma } from "../lib/prisma";

// export async function generateMetadata(): Promise<Metadata> {
//   const settings = await prisma.portfolioSetting.findMany();

//   const settingsMap = settings.reduce(
//     (acc, setting) => {
//       acc[setting.key] = setting.value;
//       return acc;
//     },
//     {} as Record<string, string>
//   );

//   const fallbackName = process.env.ADMIN_NAME || "Admin name";

//   return {
//     title: settingsMap.dashboardMetadataTitle || `${fallbackName} portfolio dashboard`,
//     description: settingsMap.dashboardMetadataDescription || `Portfolio management dashboard of ${fallbackName}.`,
//     icons: {
//       icon: "/PortfolioDashboardLogo.svg",
//     },
//     robots: {
//       index: false,
//       follow: false,
//       nocache: true,
//       googleBot: {
//         index: false,
//         follow: false,
//         noimageindex: true,
//       },
//     },
//   };
// }

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <MessageProvider>
//           <Providers>
//             {children}
//             <Toaster position="top-right" richColors />
//           </Providers>
//         </MessageProvider>
//       </body>
//     </html>
//   );
// }

import Providers from "../components/Providers";
import { MessageProvider } from "../components/MessageContext";
import { Toaster } from "sonner";
import "./globals.css";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "../lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  noStore();

  const settings = await prisma.portfolioSetting.findMany();

  const settingsMap = settings.reduce(
    (acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    },
    {} as Record<string, string>
  );

  const fallbackName = process.env.ADMIN_NAME || "User name";

  const title = settingsMap.dashboardMetadataTitle || `${fallbackName} portfolio dashboard`;
  const description = settingsMap.dashboardMetadataDescription || `Portfolio management dashboard of ${fallbackName}.`;

  return {
    title,
    description,
    icons: {
      icon: "/PortfolioDashboardLogo.svg",
    },
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MessageProvider>
          <Providers>
            {children}
            <Toaster position="top-right" richColors />
          </Providers>
        </MessageProvider>
      </body>
    </html>
  );
}