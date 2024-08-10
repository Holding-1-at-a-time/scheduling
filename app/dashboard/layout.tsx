// File: src/components/DashboardLayout.tsx

import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Calendar,
  DollarSign,
  Settings,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Estimates", href: "/dashboard/estimates" },
  { icon: ClipboardList, label: "Invoices", href: "/dashboard/invoices" },
  { icon: Calendar, label: "Appointments", href: "/dashboard/appointments" },
  { icon: DollarSign, label: "Transactions", href: "/dashboard/transactions" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const getNavItemLabel = (href: string): string => {
    const navItem = navItems.find((item) => item.href === href);
    return navItem ? navItem.label : "Dashboard";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Slick Solutions</h1>
        </div>
        <nav className="mt-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 ${
                  router.pathname === item.href ? "bg-gray-200" : ""
                }`}
              >
                {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold text-gray-800">
              {getNavItemLabel(router.pathname)}
            </h2>
            <UserButton />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

