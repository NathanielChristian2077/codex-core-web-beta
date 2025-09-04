export type NodeKind = 'event' | 'character' | 'location' | 'object'
export type GraphNode = { id: string; label: string; kind: NodeKind }
export type GraphLink = { source: string; target: string }