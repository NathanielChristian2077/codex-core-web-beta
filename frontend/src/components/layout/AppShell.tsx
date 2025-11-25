import React from "react";
import { Outlet } from "react-router-dom";

import SideBar from "./SideBar";

import { cn } from "../../lib/utils";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "../animate-ui/components/radix/sidebar";

function FloatingSidebarTrigger() {
  const { state } = useSidebar(); 

  return (
    <SidebarTrigger
      className={cn(
        "fixed top-4 z-40 flex h-9 w-9 items-center justify-center",
        "rounded-md border bg-white shadow-sm",
        "transition-[left] duration-200",
        "dark:bg-zinc-900 dark:border-zinc-700",
        "cursor-pointer",
        state === "expanded" ? "left-[18.5rem]" : "left-14"
      )}
    />
  );
}

export default function AppShell() {
  return (
    <SidebarProvider
      className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
      style={
        {
          "--sidebar-width": "18rem",
          "--sidebar-width-icon": "3.25rem",
        } as React.CSSProperties
      }
    >
      <SideBar />

      <FloatingSidebarTrigger />

      <SidebarInset className="flex-1">
        <main className="mx-auto max-w-6xl px-4 py-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
