import { useSession } from "../store/useSession";

export default function LoginPage() {
    const setToken = useSession((s) => s.setToken)
    function onLogin(e: React.FormEvent) {
        e.preventDefault();
        setToken('fake-token')
    }
    return (
        <div className="min-h-screen grid place-items-center bg-neutral-950 p-4">
            <form onSubmit={onLogin} className="bg-neutral-900 p-6 rounded-2x1 w-full max-w-sm space-y-4">
                <h1 className="text-xl font-semibold">Login</h1>
                <input className="w-full rounded bg-neutral-800 p-2" placeholder="email"/>
                <input className="w-full rounded bg-neutral-800 p-2" placeholder="password" type="password"/>
                <button className="w-full bg-blue-600 hover:bg-blue-500 rounded p-2">Login</button>
            </form>
        </div>
    )
}