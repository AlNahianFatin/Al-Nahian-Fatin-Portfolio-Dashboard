import Providers from "../components/Providers";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${process.env.ADMIN_NAME || "User name"} portfolio dashboard`,
  description: `Portfolio management dashboard of ${process.env.ADMIN_NAME || "User name"}.`,
  icons: {
    icon: "/PortfolioLogo.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
