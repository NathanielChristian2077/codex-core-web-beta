import { ReactNode } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastProvider } from "../components/layout/ToastProvider";
import { router } from "./router";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
      {children}
    </ToastProvider>
  );
}
