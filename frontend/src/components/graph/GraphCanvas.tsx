import { useEffect, useRef } from 'react'
import type { GraphLink, GraphNode } from './types'
import { useD3Force } from './useD3Force'


export default function GraphCanvas({ data }: { data: { nodes: GraphNode[]; links: GraphLink[] } }) {
    const ref = useRef<SVGSVGElement>(null)
    useEffect(() => { if (!ref.current) return }, [])
    useD3Force(ref.current, data.nodes, data.links)
    return <svg ref={ref} className="w-full h-[70vh] bg-neutral-900 rounded-2xl" />
}