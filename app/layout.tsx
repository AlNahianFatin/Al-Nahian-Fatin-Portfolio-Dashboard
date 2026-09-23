import Providers from "../components/Providers";
import { MessageProvider } from "../components/MessageContext";
import { Toaster } from "sonner";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${process.env.ADMIN_NAME || "User name"} portfolio dashboard`,
  description: `Portfolio management dashboard of ${process.env.ADMIN_NAME || "User name"}.`,
  icons: {
    icon: "/PortfolioDashboardLogo.svg",
  },
};

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
