import { useSession } from "../store/useSession";
import { useState } from "react";
import {AnimatePresence, motion} from "framer-motion";

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
            <input className="w-full rounded bg-neutral-800 p-2" placeholder="password" type="password"/>
            <input className="w-full rounded bg-neutral-800 p-2" placeholder="confirm password" type="password"/>
            <button className="w-full bg-emerald-600 hover:bg-emerald-500 rounded p-2">Sign Up</button>
            <p className="text-sm text-neutral-400 text-center">Already has an account?{" "}
                <button onClick={onSwitch} className="font-small text-blue-600 dark:text-blue-500 hover:underline hover:opacity-80">Login</button>
            </p>
        </div>
    )
}

const variants ={
    initial: { opacity: 0, y: 12, filter: "blur(2px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -12, filter: "blur(2px)" }
}

export default function LoginPage() {
    const [mode, setMode] = useState<"signin" | "signup">("signin")
    const onSwitch = () => setMode((m) => (m === "signin" ? "signup" : "signin"))

    return (
        <div className="min-h-screen grid place-items-center bg-neutral-950 p-4">
            <AnimatePresence mode="wait">
                {mode === "signin" ? (
                    <motion.div
                        key="signin"
                        initial="initial" animate="animate" exit="exit"
                        variants={variants} transition={{ duration: 0.22, ease:"easeOut" }}
                    >
                        <LoginForm onSwitch={onSwitch} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="signup"
                        initial="initial" animate="animate" exit="exit"
                        variants={variants} transition={{ duration: 0.22, ease:"easeOut" }}
                    >
                        <SignUpForm onSwitch={onSwitch} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}