// frontend/src/pages/DemoGraphPage.tsx
import GraphVisualization from "../features/graphs/GraphVisualization";
import { GraphProvider } from "../features/graphs/GraphContext";
import { demoGraphData } from "../features/demo/demoGraphData";

export default function DemoGraphPage() {
  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-zinc-100">
      <div className="mb-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
          Demo mode
        </p>
        <h1 className="text-2xl font-semibold">Codex Core Demo Graph</h1>
        <p className="mt-1 text-sm text-zinc-400">
          This demo runs entirely in the browser and does not require authentication or backend access.
        </p>
      </div>

      <div className="h-[75vh] rounded-2xl border border-zinc-800 bg-zinc-950">
        <GraphProvider
          initialData={demoGraphData}
          storageKey="demo:graph-positions"
          styleStorageKey="demo:graph-style"
        >
          <GraphVisualization />
        </GraphProvider>
      </div>
    </div>
  );
}