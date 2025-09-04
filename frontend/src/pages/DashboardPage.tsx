export default function DashboardPage() {
    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2x1 font-bold">Dashboard</h1>
            <nav className="flex gap-3 text-sm text-blue-400">
                <a href="/timeline" className="hover:underline">Timeline</a>
                <a href="/graph" className="hover:underline">Graph</a>
            </nav>
        </div>
    )
}