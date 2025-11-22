import { Link } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader";

export default function LandingPage() {
    return (
        <div className="min-h-dvh bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
            <AppHeader />
            <main className="mx-auto grid max-w-5x1 gap-12 px-4 pb-24 pt-12">
                <section className="text-center">
                    <h1 className="mx-auto max-w-3x1 text-4x1 font-bold tracking-tight sm:text-5x1">
                        Build consistent RPG stories using nodes
                    </h1>
                    <p className="mx-auto mt-4 max-w-2x1 text-base text-zinc-600 dark:text-zinc-300">
                        Create campaigns, link events, characters, locations and objects. Visualize everything in an interactive way.
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                        <Link to="/login" className="rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700">Open Demo</Link>
                        <a  href="https://github.com/NathanielChristian2077/trabalho-final-web-dev.git" 
                            className="rounded-md border px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                        >
                            View on GitHub
                        </a>
                    </div>
                </section>

                <section className="mx-auto grid w-full max-w-4x1 gap-6 sm:grid-cols-2">
                    <Feature title="Timeline" description="Chronologically ordered events."/>
                    <Feature title="Graph View" description="Relations between events, characters, locations and objects."/>
                    <Feature title="Fast CRUD" description="Quick creation and removal with instant feedback."/>
                    <Feature title="JWT Auth" description="Simple authentication to keep your privacy."/>
                </section>
            </main>
        </div>
    )
}

function Feature({ title, description }: { title: string; description: string; }) {
    return (
        <div className="rounded-lg border p-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{description}</p>
        </div>
    )
}