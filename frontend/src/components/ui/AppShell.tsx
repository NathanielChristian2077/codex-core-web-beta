import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

export default function AppShell() {
  return (
    <div className="flex">
      <SideBar />
      <div className="min-h-dvh flex-1 bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <main className="mx-auto max-w-6x1 px-4 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
