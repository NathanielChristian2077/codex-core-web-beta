import axios, { AxiosError } from "axios";
import { useSession } from "../store/useSession";
import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import api from "../lib/apiClient";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";

function extractApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const res = err as AxiosError<{ message?: string }>;
    return res.response?.data?.message ?? err.message ?? "Request failed";
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "Unexpected error";
}

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const setToken = useSession((s) => s.setToken)
  function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setToken('fake-token')
  }
  return (
    <div className="bg-neutral-900 p-6 rounded-2x1 w-full max-w-sm space-y-4 shadow">
      <h1 className="text-xl font-semibold">Login</h1>
      <input className="w-full rounded bg-neutral-800 p-2" placeholder="email" />
      <input className="w-full rounded bg-neutral-800 p-2" placeholder="password" type="password" />
      <button onClick={onLogin} className="w-full bg-blue-600 hover:bg-blue-500 rounded p-2">Login</button>
      <p className="text-sm text-neutral-400 text-center">New here?{" "}
        <button onClick={onSwitch} className="font-small text-blue-600 dark:text-blue-500 hover:underline hover:opacity-80">Sign Up</button>
      </p>
    </div>
  )
}

function SignUpForm({ onSwitch }: { onSwitch: () => void }) {
  return (
    <div className="bg-transparent backdrop-blur-md p-6 rounded-2x1 w-full max-w-sm space-y-4 shadow">
      <h1 className="text-xl font-semibold">Create Account</h1>
      <input className="w-full rounded bg-neutral-800 p-2" placeholder="username" />
      <input className="w-full rounded bg-neutral-800 p-2" placeholder="email" />
      <input className="w-full rounded bg-neutral-800 p-2" placeholder="password" type="password" />
      <input className="w-full rounded bg-neutral-800 p-2" placeholder="confirm password" type="password" />
      <button className="w-full bg-emerald-600 hover:bg-emerald-500 rounded p-2">Sign Up</button>
      <p className="text-sm text-neutral-400 text-center">Already has an account?{" "}
        <button onClick={onSwitch} className="font-small text-blue-600 dark:text-blue-500 hover:underline hover:opacity-80">Login</button>
      </p>
    </div>
  )
}

const variants = {
  initial: { opacity: 0, y: 12, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -12, filter: "blur(2px)" }
}

export default function LoginPage() {
  const [email, setEmail] = useState("mestre@ex.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        senha: password,
      });

      const token = res.data?.accessToken as string;
      if (!token) {
        throw new Error("No token received");
      }

      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      setError(extractApiError(err))
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-dvh bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <AppHeader />
      <main className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-md flex-col justify-center px-4">
        <h1 className="mb-6 text-2x1 font-bold tracking-tight">Sign in</h1>

        <form onSubmit={handleLogin} className="grid gap-4">
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

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Enter"}
          </button>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Use demo account:{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
            mestre@ex.com
          </code>{" "}
          /{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">
            123456
          </code>
        </p>
      </main>
    </div>
    /* <div className="min-h-screen grid place-items-center bg-neutral-950 p-4">
         <AnimatePresence mode="wait">
             {mode === "signin" ? (
                 <motion.div
                     key="signin"
                     initial="initial" animate="animate" exit="exit"
                     variants={variants} transition={{ duration: 0.22, ease: "easeOut" }}
                 >
                     <LoginForm onSwitch={onSwitch} />
                 </motion.div>
             ) : (
                 <motion.div
                     key="signup"
                     initial="initial" animate="animate" exit="exit"
                     variants={variants} transition={{ duration: 0.22, ease: "easeOut" }}
                 >
                     <SignUpForm onSwitch={onSwitch} />
                 </motion.div>
             )}
         </AnimatePresence>
     </div>*/
  );
}
