import Timeline from '../components/timeline/Timeline'
import type { TimelineEvent } from '../components/timeline/types'


const mock: TimelineEvent[] = [
    { id: 'e0', title: 'Evento 0', date: '2024-01-01' },
    { id: 'e1', title: 'Evento 1', date: '2024-02-10' },
    { id: 'e2', title: 'Evento 2', date: '2024-03-15' },
]


export default function TimelinePage() {
    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">Timeline</h1>
            <Timeline events={mock} />
        </div>
    )
}