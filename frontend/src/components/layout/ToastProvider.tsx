import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type Toast = { id: number; message: string; kind?: "success" | "error" | "info" };
type Ctx = {
  show: (message: string, kind?: Toast["kind"]) => void;
};
const ToastCtx = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, kind: Toast["kind"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, kind }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  const ctx = useMemo(() => ({ show }), [show]);

  return (
    <ToastCtx.Provider value={ctx}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed inset-x-0 top-2 z-[100] flex justify-center">
          <div className="flex w-full max-w-lg flex-col gap-2 px-2">
            {toasts.map(t => (
              <div
                key={t.id}
                className={[
                  "pointer-events-auto rounded-md border px-3 py-2 text-sm shadow",
                  t.kind === "success" && "border-green-700/30 bg-green-600 text-white",
                  t.kind === "error" && "border-red-700/30 bg-red-600 text-white",
                  t.kind === "info" && "border-zinc-300 bg-white text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100",
                ].filter(Boolean).join(" ")}
              >
                {t.message}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </ToastCtx.Provider>
  );
}

export function useToast() {
    const ctx = useContext(ToastCtx);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}

