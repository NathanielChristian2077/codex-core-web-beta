import GraphCanvas from '../components/graph/GraphCanvas'
import type { GraphLink, GraphNode } from '../components/graph/types'


const nodes: GraphNode[] = [
    { id: 'e0', label: 'Evento 0', kind: 'event' },
    { id: 'c1', label: 'Personagem A', kind: 'character' },
    { id: 'l1', label: 'Taverna', kind: 'location' },
    { id: 'o1', label: 'Adaga', kind: 'object' },
    { id: 'e1', label: 'Evento 1', kind: 'event' },
]
const links: GraphLink[] = [
    { source: 'e0', target: 'c1' },
    { source: 'e0', target: 'l1' },
    { source: 'e0', target: 'o1' },
    { source: 'e0', target: 'e1' },
]


export default function GraphPage() {
    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">Grafo</h1>
            <GraphCanvas data={{ nodes, links }} />
        </div>
    )
}