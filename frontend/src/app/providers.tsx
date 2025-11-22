import { RouterProvider } from "react-router-dom";
import { ToastProvider } from "../components/layout/ToastProvider";
import { router } from "./router";

export function AppProviders() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}
