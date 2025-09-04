import { useEffect } from 'react'
import * as d3 from 'd3'
import type { GraphLink, GraphNode as BaseGraphNode } from './types'

type GraphNode = BaseGraphNode & d3.SimulationNodeDatum;

export function useD3Force(el: SVGSVGElement | null, nodes: BaseGraphNode[], links: GraphLink[]) {
    useEffect(() => {
        if (!el) return;
        const svg = d3.select(el);
        svg.selectAll('*').remove();
        const width = el.clientWidth || 800, height = el.clientHeight || 600;

        const simNodes: GraphNode[] = nodes.map((n) => ({ ...n }));

        const color = (n: BaseGraphNode) => ({ event: '#60a5fa', character: '#f59e0b', location: '#34d399', object: '#a78bfa' }[n.kind]);

        const sim = d3.forceSimulation<GraphNode>(simNodes)
            .force('link', d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(80) as d3.Force<GraphNode, GraphLink>)
            .force('charge', d3.forceManyBody() as d3.Force<GraphNode, undefined>)
            .force('center', d3.forceCenter(width / 2, height / 2) as d3.Force<GraphNode, undefined>);

        const link = svg.append('g').attr('stroke', '#555').attr('stroke-opacity', 0.6)
            .selectAll('line').data(links).enter().append('line').attr('stroke-width', 1.2);

        const node = svg.append('g').selectAll('circle').data(simNodes).enter().append('circle')
            .attr('r', (d) => Math.max(5, 4 + links.filter((l) => l.source === d.id || l.target === d.id).length * 1.5))
            .attr('fill', color)
            .call(d3.drag<SVGCircleElement, GraphNode>()
                .on('start', (event, d) => {
                    if (!event.active) sim.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on('drag', (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on('end', (event, d) => {
                    if (!event.active) sim.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                })
            );

        const label = svg.append('g').selectAll('text').data(simNodes).enter().append('text')
            .text((d) => d.label).attr('font-size', 10).attr('fill', '#ddd');

        sim.on('tick', () => {
            link
                .attr('x1', (d: any) => (typeof d.source === 'string' ? 0 : d.source.x))
                .attr('y1', (d: any) => (typeof d.source === 'string' ? 0 : d.source.y))
                .attr('x2', (d: any) => (typeof d.target === 'string' ? 0 : d.target.x))
                .attr('y2', (d: any) => (typeof d.target === 'string' ? 0 : d.target.y));
            node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
            label.attr('x', (d: any) => d.x + 8).attr('y', (d: any) => d.y + 4);
        });

        return () => {
            sim.stop();
        };
    }, [el, nodes, links]);
}