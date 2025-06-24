"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { SidebarProvider } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { data: session } = useSession();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Sticky Top Navigation */}
          <TopNav user={session?.user} />

          {/* Content Body */}
          <main className="flex-1 p-6 bg-gray-50/40">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
