import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useState } from "react";
import AppHeader from "../components/ui/AppHeader";
import { useToast } from "../components/ui/ToastProvider";
import { loginUser, registerUser } from "../features/auth/api";
import { useSession } from "../store/useSession";

const variants = {
  initial: { opacity: 0, y: 12, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -12, filter: "blur(2px)" },
};

export default function LoginPage() {
  const t = useToast();
  const { setToken } = useSession.getState();

  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const [email, setEmail] = useState("mestre@ex.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState("");

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canLogin = validEmail && password.length >= 6;
  const canSignup =
    name.trim().length >= 2 && validEmail && password.length >= 6 && password === confirm;

  async function onSignIn(e: FormEvent) {
    e.preventDefault();
    if (!canLogin || loading) return;
    setErr("");
    setLoading(true);
    try {
      const res = await loginUser({ email: email.trim(), password });
      if (!res?.accessToken) throw new Error("No token received");
      setToken(res.accessToken);
      t.show("Signed in", "success");
      window.location.assign("/dashboard");
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Invalid credentials");
      t.show("Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  }

  async function onSignUp(e: FormEvent) {
    e.preventDefault();
    if (!canSignup || loading) return;
    setErr("");
    setLoading(true);
    try {
      const reg = await registerUser({ name: name.trim(), email: email.trim(), password });
      const token = (reg as any)?.accessToken as string | undefined;
      if (token) {
        setToken(token);
      } else {
        const res = await loginUser({ email: email.trim(), password });
        if (!res?.accessToken) throw new Error("No token after signup");
        setToken(res.accessToken);
      }
      t.show("Account created. Welcome!", "success");
      window.location.assign("/dashboard");
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Failed to create account");
      t.show("Failed to create account", "error");
    } finally {
      setLoading(false);
    }
  }

  const switchMode = () => {
    setErr("");
    setLoading(false);
    setMode((m) => (m === "signin" ? "signup" : "signin"));
  };

  return (
    <div className="min-h-dvh bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <AppHeader />
      <main className="mx-auto grid min-h-[calc(100dvh-3.5rem)] place-items-center px-4">
        <AnimatePresence mode="wait">
          {mode === "signin" ? (
            <motion.div
              key="signin"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-sm rounded-2xl border bg-white/70 p-6 shadow dark:border-zinc-800 dark:bg-zinc-900/70"
            >
              <h1 className="mb-4 text-xl font-semibold">Sign in</h1>
              <form onSubmit={onSignIn} className="grid gap-3">
                <label className="grid gap-1">
                  <span className="text-sm">Email</span>
                  <input
                    type="email"
                    className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm">Password</span>
                  <input
                    type="password"
                    className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>

                {err && <p className="text-sm text-red-600 dark:text-red-400">{err}</p>}

                <button
                  type="submit"
                  disabled={!canLogin || loading}
                  className="mt-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-70"
                >
                  {loading ? "Signing in..." : "Enter"}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                New here?{" "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Create account
                </button>
              </p>

              <p className="mt-6 text-center text-xs text-zinc-500">
                Demo: <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">mestre@ex.com</code>{" "}
                / <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">123456</code>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-sm rounded-2xl border bg-white/70 p-6 shadow dark:border-zinc-800 dark:bg-zinc-900/70"
            >
              <h1 className="mb-4 text-xl font-semibold">Create account</h1>
              <form onSubmit={onSignUp} className="grid gap-3">
                <label className="grid gap-1">
                  <span className="text-sm">Name</span>
                  <input
                    className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm">Email</span>
                  <input
                    type="email"
                    className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm">Password</span>
                  <input
                    type="password"
                    className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm">Confirm password</span>
                  <input
                    type="password"
                    className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </label>

                {err && <p className="text-sm text-red-600 dark:text-red-400">{err}</p>}

                <button
                  type="submit"
                  disabled={!canSignup || loading}
                  className="mt-2 rounded-md bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700 disabled:opacity-70"
                >
                  {loading ? "Creating..." : "Sign up"}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
