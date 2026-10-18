import type { ReactNode } from "react";

import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "../../components/Topbar";

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <SidebarProvider>
            <Sidebar />

            <SidebarInset className="min-h-svh min-w-0">
                <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
                    <SidebarTrigger className="shrink-0" />
                    <div className="h-5 w-px shrink-0 bg-border" />

                    <div className="min-w-0 flex-1">
                        <Topbar />
                    </div>
                </header>

                <main className="min-w-0 flex-1 overflow-x-hidden p-4 md:p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}