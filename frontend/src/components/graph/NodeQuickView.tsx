import type { CSSProperties } from "react";
import React from "react";
import { SimNode } from "../../features/graphs/core/SimulationManager";

type NodeQuickViewProps = {
  node: SimNode;
  style?: CSSProperties;
  onClose: () => void;
  onDrag: (dx: number, dy: number) => void;
};

export const NodeQuickView: React.FC<NodeQuickViewProps> = ({
  node,
  style,
  onClose,
  onDrag,
}) => {
  const dragRef = React.useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    dragRef.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as any).setPointerCapture?.(e.pointerId);
  };

  const [isVisible, setIsVisible] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current = { x: e.clientX, y: e.clientY };
    onDrag(dx, dy);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    (e.currentTarget as any).releasePointerCapture?.(e.pointerId);
  };

  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsClosing(true);
    setIsVisible(false);

    setTimeout(() => {
      onClose();
    }, 160);
  };

  const hasDescription =
    "description" in node && typeof node.description === "string";

  const hasDegree = "degree" in node && typeof node.degree === "number";

  const animatedClasses = [
    "pointer-events-auto z-10 max-w-xs rounded-lg border border-slate-700 bg-slate-900/95 p-3 text-slate-100 shadow-xl backdrop-blur-md",
    "transition-all duration-150 ease-out",
    isVisible && !isClosing
      ? "opacity-100 translate-y-0 scale-100"
      : "opacity-0 translate-y-1 scale-95",
  ].join(" ");

  return (
    <div
      style={style}
      className={animatedClasses}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex-1 cursor-move" onPointerDown={handlePointerDown}>
          <h2 className="truncate text-xs font-semibold">
            {node.label ?? node.id}
          </h2>
        </div>

        <button
          onClick={handleCloseClick}
          className="text-xs text-slate-400 hover:text-slate-100"
        >
          ×
        </button>
      </div>

      <p className="mb-1 text-[11px] opacity-80">
        Tipo: <span className="font-medium">{node.type}</span>
      </p>

      {hasDescription && (
        <p className="mb-2 whitespace-pre-line text-[11px] opacity-90">
          {node.description}
        </p>
      )}

      {hasDegree && (
        <p className="text-[10px] uppercase tracking-wide text-slate-400">
          Relações: {node.degree}
        </p>
      )}
    </div>
  );
};
