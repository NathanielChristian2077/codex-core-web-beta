import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

import {
  SidebarInset,
  SidebarProvider,
} from "../animate-ui/components/radix/sidebar";

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

      <SidebarInset className="flex-1">
        <main className="h-full w-full px-6 py-8 lg:px-10">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
