import { Sidebar } from "../../components/Sidebar";
import { Topbar } from "../../components/Topbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Sidebar />
            <div className="min-h-screen lg:pl-64">
                <Topbar />
                {children}
            </div>
        </div>
    )
}
