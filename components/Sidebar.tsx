// "use client";

// import * as React from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import type { ElementType } from "react";

// import {
//   BarChart3,
//   BookMarked,
//   BriefcaseBusiness,
//   FileText,
//   GraduationCap,
//   LayoutDashboard,
//   LogOut,
//   Mail,
//   Settings,
//   Sparkles,
//   UserRound,
//   Wrench,
//   FileUser,
// } from "lucide-react";
// import { FaUserTie } from "react-icons/fa";
// import { toast } from "sonner";

// import {
//   Sidebar as SidebarRoot,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarRail,
// } from "@/components/ui/sidebar";

// const navMain = [
//   { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
//   { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
//   { title: "Messages", url: "/dashboard/messages", icon: Mail },
// ];

// const navContent = [
//   { title: "Profile", url: "/dashboard/content/profile", icon: UserRound },
//   { title: "Education", url: "/dashboard/content/education", icon: GraduationCap },
//   { title: "Skills", url: "/dashboard/content/skill", icon: Wrench },
//   { title: "Projects", url: "/dashboard/content/project", icon: BriefcaseBusiness },
//   { title: "Experience", url: "/dashboard/content/experience", icon: FaUserTie },
//   { title: "Publications", url: "/dashboard/content/publication", icon: BookMarked },
//   { title: "Social Links", url: "/dashboard/content/socialLink", icon: Sparkles },
//   { title: "CV / Resume", url: "/dashboard/content/resume", icon: FileText },
//   {
//     title: "Portfolio Settings",
//     url: "/dashboard/content/portfolioSetting",
//     icon: FileUser,
//   },
// ];

// const navSettings = [
//   { title: "Account Settings", url: "/dashboard/settings", icon: Settings },
// ];

// type NavItem = {
//   title: string;
//   url: string;
//   icon: ElementType;
// };

// function NavigationGroup({
//   title,
//   items,
//   pathname,
// }: {
//   title: string;
//   items: NavItem[];
//   pathname: string;
// }) {
//   return (
//     <SidebarGroup className="px-2 py-1.5">
//       <SidebarGroupLabel className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
//         {title}
//       </SidebarGroupLabel>

//       <SidebarGroupContent>
//         <SidebarMenu className="gap-1">
//           {items.map(({ title, url, icon: Icon }) => {
//             const active =
//               pathname === url ||
//               (url !== "/dashboard" && pathname.startsWith(`${url}/`));

//             return (
//               <SidebarMenuItem key={url}>
//                 <SidebarMenuButton

//                   isActive={active}
//                   tooltip={{
//                     children: title,
//                     side: "right",
//                     align: "center",
//                   }}
//                   className={[
//                     "h-10 rounded-lg px-3 text-sm transition-colors duration-150",
//                     "text-gray-600 hover:bg-gray-100 hover:text-gray-950",
//                     "data-[active=true]:bg-indigo-50",
//                     "data-[active=true]:font-semibold",
//                     "data-[active=true]:text-gray-950",
//                     "data-[active=true]:hover:bg-indigo-50",
//                   ].join(" ")}
//                 >
//                   <Link href={url} className="w-full flex items-center" aria-current={active ? "page" : undefined}>
//                     <Icon
//                       className={[
//                         "size-4.5! shrink-0 transition-colors duration-150",
//                         active ? "text-indigo-600" : "text-gray-500",
//                       ].join(" ")}
//                     />
//                     <span className="ml-3 text-sm">{title}</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             );
//           })}
//         </SidebarMenu>
//       </SidebarGroupContent>
//     </SidebarGroup>
//   );
// }

// export function Sidebar(props: React.ComponentProps<typeof SidebarRoot>) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [loggingOut, setLoggingOut] = React.useState(false);

//   async function handleLogout() {
//     if (loggingOut) return;

//     setLoggingOut(true);

//     try {
//       const response = await fetch("/api/auth/logout", {
//         method: "POST",
//       });

//       if (!response.ok) {
//         throw new Error("Logout failed");
//       }

//       router.replace("/login");
//       router.refresh();
//     } catch {
//       toast.error("Unable to log out. Please try again.");
//       setLoggingOut(false);
//     }
//   }

//   return (
//     <SidebarRoot
//       variant="inset"
//       collapsible="icon"
//       {...props}
//       className={["border-sidebar-border", props.className ?? ""].join(" ")}
//     >
//       <SidebarHeader className="border-b border-sidebar-border px-3 py-3.5">
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton
//               size="lg"
//               tooltip={{
//                 children: "ANF Portfolio Admin",
//                 side: "right",
//                 align: "center",
//               }}
//               className="h-auto flex-col items-center gap-2 rounded-xl py-2"
//             >
//               <Link href="/dashboard" className="flex w-full flex-col items-center gap-2">
//                 <span className="flex h-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 px-3.5 text-sm font-bold tracking-wide text-white shadow-sm transition-colors duration-150 hover:bg-indigo-700">
//                   ANF
//                 </span>

//                 <span className="w-full truncate text-center text-xs font-medium text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
//                   ANF Portfolio Admin
//                 </span>
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>

//       <SidebarContent className="gap-2 px-1 py-3">
//         <NavigationGroup
//           title="Overview"
//           items={navMain}
//           pathname={pathname}
//         />

//         <NavigationGroup
//           title="Portfolio Content"
//           items={navContent}
//           pathname={pathname}
//         />

//         <NavigationGroup
//           title="Preferences"
//           items={navSettings}
//           pathname={pathname}
//         />
//       </SidebarContent>

//       <SidebarFooter className="border-t border-sidebar-border p-3">
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton
//               onClick={handleLogout}
//               disabled={loggingOut}
//               tooltip={{
//                 children: loggingOut ? "Logging out..." : "Logout",
//                 side: "right",
//                 align: "center",
//               }}
//               className="h-10 cursor-pointer rounded-lg px-3 text-sm text-red-600 transition-colors duration-150 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-950"
//             >
//               <LogOut className="size-4.5! shrink-0" />
//               <span>{loggingOut ? "Logging out..." : "Logout"}</span>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>

//       <SidebarRail />
//     </SidebarRoot>
//   );
// }








"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ElementType } from "react";

import {
  BarChart3,
  BookMarked,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  Sparkles,
  UserRound,
  Wrench,
  FileUser,
} from "lucide-react";
import { FaUserTie } from "react-icons/fa";
import { toast } from "sonner";

import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navMain = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Messages", url: "/dashboard/messages", icon: Mail },
];

const navContent = [
  { title: "Profile", url: "/dashboard/content/profile", icon: UserRound },
  { title: "Education", url: "/dashboard/content/education", icon: GraduationCap },
  { title: "Skills", url: "/dashboard/content/skill", icon: Wrench },
  { title: "Projects", url: "/dashboard/content/project", icon: BriefcaseBusiness },
  { title: "Experience", url: "/dashboard/content/experience", icon: FaUserTie },
  { title: "Publications", url: "/dashboard/content/publication", icon: BookMarked },
  { title: "Social Links", url: "/dashboard/content/socialLink", icon: Sparkles },
  { title: "CV / Resume", url: "/dashboard/content/resume", icon: FileText },
  {
    title: "Portfolio Settings",
    url: "/dashboard/content/portfolioSetting",
    icon: FileUser,
  },
];

const navSettings = [
  { title: "Account Settings", url: "/dashboard/settings", icon: Settings },
];

type NavItem = {
  title: string;
  url: string;
  icon: ElementType;
};

function NavigationGroup({
  title,
  items,
  pathname,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
}) {
  return (
    <SidebarGroup className="max-md:py-1 px-2 py-1.5">
      <SidebarGroupLabel className="max-md:mb-1 max-md:text-[11px] mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
        {title}
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu className="max-md:gap-0.5 gap-1">
          {items.map(({ title, url, icon: Icon }) => {
            const active =
              pathname === url ||
              (url !== "/dashboard" && pathname.startsWith(`${url}/`));

            return (
              <SidebarMenuItem key={url}>
                <SidebarMenuButton

                  isActive={active}
                  tooltip={{
                    children: title,
                    side: "right",
                    align: "center",
                  }}
                  className={[
                    "max-md:h-8 h-10 rounded-lg px-3 text-sm transition-colors duration-150",
                    "text-gray-600 hover:bg-gray-100 hover:text-gray-950",
                    "data-[active=true]:bg-indigo-50",
                    "data-[active=true]:font-semibold",
                    "data-[active=true]:text-gray-950",
                    "data-[active=true]:hover:bg-indigo-50",
                  ].join(" ")}
                >
                  <Link href={url} className="w-full flex items-center" aria-current={active ? "page" : undefined}>
                    <Icon
                      className={[
                        "max-md:size-4! size-4.5! shrink-0 transition-colors duration-150",
                        active ? "text-indigo-600" : "text-gray-500",
                      ].join(" ")}
                    />
                    <span className="max-md:text-[13px] ml-3 text-sm">{title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function Sidebar(props: React.ComponentProps<typeof SidebarRoot>) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = React.useState(false);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("Unable to log out. Please try again.");
      setLoggingOut(false);
    }
  }

  return (
    <SidebarRoot
      variant="inset"
      collapsible="icon"
      {...props}
      className={["border-sidebar-border", props.className ?? ""].join(" ")}
    >
      <SidebarHeader className="max-md:py-2 border-b border-sidebar-border px-3 py-3.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={{
                children: "ANF Portfolio Admin",
                side: "right",
                align: "center",
              }}
              className="max-md:gap-1 max-md:py-1 h-auto flex-col items-center gap-2 rounded-xl py-2"
            >
              <Link href="/dashboard" className="max-md:gap-1 flex w-full flex-col items-center gap-2">
                <span className="max-md:h-7 max-md:px-3 max-md:text-xs flex h-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 px-3.5 text-sm font-bold tracking-wide text-white shadow-sm transition-colors duration-150 hover:bg-indigo-700">
                  ANF
                </span>

                <span className="max-md:text-[11px] w-full truncate text-center text-xs font-medium text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
                  ANF Portfolio Admin
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="max-md:gap-0.5 max-md:py-1.5 gap-2 px-1 py-3">
        <NavigationGroup
          title="Overview"
          items={navMain}
          pathname={pathname}
        />

        <NavigationGroup
          title="Portfolio Content"
          items={navContent}
          pathname={pathname}
        />

        <NavigationGroup
          title="Preferences"
          items={navSettings}
          pathname={pathname}
        />
      </SidebarContent>

      <SidebarFooter className="max-md:p-2 border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              disabled={loggingOut}
              tooltip={{
                children: loggingOut ? "Logging out..." : "Logout",
                side: "right",
                align: "center",
              }}
              className="max-md:h-8 h-10 cursor-pointer rounded-lg px-3 text-sm text-red-600 transition-colors duration-150 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-950"
            >
              <LogOut className="size-4.5! shrink-0" />
              <span>{loggingOut ? "Logging out..." : "Logout"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </SidebarRoot>
  );
}