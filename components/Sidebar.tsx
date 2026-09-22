"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BriefcaseBusiness, FileText, GraduationCap, LayoutDashboard, LogOut, Mail, Settings, Sparkles, UserRound, Wrench, FileUser, BookMarked } from "lucide-react";
import { FaUserTie } from "react-icons/fa";

const groups = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Analytics", "/dashboard/analytics", BarChart3],
  ["Messages", "/dashboard/messages", Mail],
  ["Profile", "/dashboard/content/profile", UserRound],
  ["Education", "/dashboard/content/education", GraduationCap],
  ["Skills", "/dashboard/content/skill", Wrench],
  ["Projects", "/dashboard/content/project", BriefcaseBusiness],
  ["Experience", "/dashboard/content/experience", FaUserTie],
  ["Publications", "/dashboard/content/publication", BookMarked],
  ["Social Links", "/dashboard/content/socialLink", Sparkles],
  ["CV / Resume", "/dashboard/content/resume", FileText],
  ["Portfolio Settings", "/dashboard/content/portfolioSetting", FileUser],
  ["Account Settings", "/dashboard/settings", Settings]
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-4 lg:block">
      <div className="px-3 py-4 text-xl font-black">ANF Portfolio
        <span className="text-indigo-600">.</span> Admin
      </div>

      <nav className="mt-4 space-y-1">
        {
          groups.map(([name, href, Icon]) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${isActive
                    ? "bg-slate-100 text-slate-950 font-medium"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}>
                <Icon className={`h-4 w-4 ${isActive ? "text-indigo-600" : ""}`} />{name}
              </Link>
            );
          })
        }
      </nav>

      <button onClick={
        async () => {
          await fetch("/api/auth/logout", {
            method: "POST"
          });
          location.href = "/login"
        }
      } className="mt-5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:cursor-pointer">
        <LogOut className="h-4 w-4" />Logout
      </button>
    </aside>
  )
}
