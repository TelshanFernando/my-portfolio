"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Wrench,
  Briefcase,
  GraduationCap,
  Award,
  PanelsTopLeft,
  Share2,
  FileText,
  Mail,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Profile", href: "/admin/profile", icon: User },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Skills", href: "/admin/skills", icon: Wrench },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Certifications", href: "/admin/certifications", icon: Award },
  { name: "Services", href: "/admin/services", icon: PanelsTopLeft },
  { name: "Social Links", href: "/admin/social-links", icon: Share2 },
  { name: "Resumes", href: "/admin/resumes", icon: FileText },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "Site Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-zinc-800 bg-zinc-950 lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-zinc-800 px-6 py-5">
          <Link href="/admin" className="text-lg font-bold text-white">
            Portfolio Admin
          </Link>
          <p className="mt-1 text-xs text-zinc-500">
            Content Management
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}