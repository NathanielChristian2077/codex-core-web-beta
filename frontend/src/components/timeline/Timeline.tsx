import type { TimelineEvent } from './types'
export default function Timeline({ events }: { events: TimelineEvent[] }) {
    const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date))
    return (
        <div className="p-4">
            <div className="overflow-x-auto">
                <div className="flex gap-8 py-6 min-w-max">
                    {sorted.map((ev) => (
                        <div key={ev.id} className="relative">
                            <div className="h-2 bg-neutral-700 rounded w-32" />
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full" />
                            <div className="mt-3 w-40">
                                <p className="text-xs text-neutral-400">{new Date(ev.date).toLocaleDateString()}</p>
                                <h4 className="text-sm font-medium">{ev.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}