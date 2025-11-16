import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const WIDTH = 1600;
const HEIGHT = 900;

type Camera = {
  x: number;      // world offset X
  y: number;      // world offset Y
  scale: number;  // zoom level
};

type PanState = {
  pointerId: number | null;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

function clampScale(scale: number) {
  return Math.min(3, Math.max(0.3, scale));
}

function zoomAtPoint(
  camera: Camera,
  svgX: number,
  svgY: number,
  deltaY: number
): Camera {
  const zoomIntensity = 0.05;
  const direction = deltaY > 0 ? -1 : 1;
  const factor = 1 + zoomIntensity * direction;

  const newScale = clampScale(camera.scale * factor);

  const worldX = (svgX - camera.x) / camera.scale;
  const worldY = (svgY - camera.y) / camera.scale;

  return {
    x: svgX - worldX * newScale,
    y: svgY - worldY * newScale,
    scale: newScale
  };
}

export function useZoomAndPan() {
  const [camera, setCamera] = useState<Camera>({
    x: 0,
    y: 0,
    scale: 1
  });

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isPanningRef = useRef(false);
  const panRef = useRef<PanState>({
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0
  });

  // screen → SVG coords (0..WIDTH, 0..HEIGHT)
  const getSvgCoords = useCallback(
    (event: React.PointerEvent<Element>) => {
      const svg = svgRef.current;
      if (!svg) return null;

      const rect = svg.getBoundingClientRect();
      const sx = ((event.clientX - rect.left) / rect.width) * WIDTH;
      const sy = ((event.clientY - rect.top) / rect.height) * HEIGHT;

      return { sx, sy };
    },
    []
  );

  // screen → world coords
  const getWorldPointFromPointer = useCallback(
    (event: React.PointerEvent<Element>) => {
      const coords = getSvgCoords(event);
      if (!coords) return null;

      const { sx, sy } = coords;

      return {
        x: (sx - camera.x) / camera.scale,
        y: (sy - camera.y) / camera.scale
      };
    },
    [camera, getSvgCoords]
  );

  const handleSvgPointerDown = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (event.button !== 0) return;

      // Only start pan when clicking on blank space, not on nodes
      if (event.target !== event.currentTarget) return;

      isPanningRef.current = true;
      panRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: camera.x,
        originY: camera.y
      };

      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [camera]
  );

  const handleSvgPointerMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (!isPanningRef.current) return;

      const { startX, startY, originX, originY } = panRef.current;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;

      setCamera(prev => ({
        ...prev,
        x: originX + dx,
        y: originY + dy
      }));
    },
    []
  );

  const handleSvgPointerUp = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (isPanningRef.current) {
        isPanningRef.current = false;
        try {
          event.currentTarget.releasePointerCapture(event.pointerId);
        } catch {
          // ignore
        }
      }
    },
    []
  );

  // Wheel zoom on container
  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = svg.getBoundingClientRect();
      const sx = ((e.clientX - rect.left) / rect.width) * WIDTH;
      const sy = ((e.clientY - rect.top) / rect.height) * HEIGHT;

      setCamera(prev => zoomAtPoint(prev, sx, sy, e.deltaY));
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return {
    camera,
    svgRef,
    containerRef,
    handleSvgPointerDown,
    handleSvgPointerMove,
    handleSvgPointerUp,
    getWorldPointFromPointer
  };
}
