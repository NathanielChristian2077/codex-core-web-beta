import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const WIDTH = 1600;
const HEIGHT = 900;

type Camera = {
  x: number;
  y: number;
  scale: number;
};

type PanState = {
  pointerId: number | null;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

function clampScale(scale: number) {
  return Math.min(6, Math.max(0.1, scale));
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
    scale: newScale,
  };
}

export function useZoomAndPan() {
  const [camera, setCamera] = useState<Camera>({
    x: 0,
    y: 0,
    scale: 1,
  });

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isPanningRef = useRef(false);
  const panRef = useRef<PanState>({
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  const animationRef = useRef<number | null>(null);
  const animationStateRef = useRef<{
    start: Camera;
    target: Camera;
    startTime: number;
    duration: number;
  } | null>(null);

  const stopCameraAnimation = useCallback(() => {
    if (animationRef.current != null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    animationStateRef.current = null;
  }, []);

  // screen -> svg coords (0..WIDTH, 0..HEIGHT)
  const getSvgCoordsFromClient = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return null;

      const rect = svg.getBoundingClientRect();
      const sx = ((clientX - rect.left) / rect.width) * WIDTH;
      const sy = ((clientY - rect.top) / rect.height) * HEIGHT;

      return { sx, sy };
    },
    []
  );

  // clientX/clientY → world coords
  const getWorldPointFromClient = useCallback(
    (clientX: number, clientY: number) => {
      const coords = getSvgCoordsFromClient(clientX, clientY);
      if (!coords) return null;

      const { sx, sy } = coords;

      return {
        x: (sx - camera.x) / camera.scale,
        y: (sy - camera.y) / camera.scale,
      };
    },
    [camera, getSvgCoordsFromClient]
  );

  // PointerEvent → world coords (backwards compatible)
  const getWorldPointFromPointer = useCallback(
    (event: React.PointerEvent<Element>) => {
      return getWorldPointFromClient(event.clientX, event.clientY);
    },
    [getWorldPointFromClient]
  );

  const handleSvgPointerDown = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (event.button !== 0) return;

      // Only start pan when clicking on blank space, not on nodes
      if (event.target !== event.currentTarget) return;

      stopCameraAnimation();

      isPanningRef.current = true;
      panRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: camera.x,
        originY: camera.y,
      };

      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [camera, stopCameraAnimation]
  );

  const handleSvgPointerMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (!isPanningRef.current) return;

      const { startX, startY, originX, originY } = panRef.current;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;

      setCamera((prev) => ({
        ...prev,
        x: originX + dx,
        y: originY + dy,
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

  const focusOnWorldPoint = useCallback(
    (worldX: number, worldY: number, _opts?: { scale?: number }) => {
      stopCameraAnimation();

      const start: Camera = camera;

      const targetScale = 3;
      const target: Camera = {
        scale: targetScale,
        x: WIDTH / 2 - worldX * targetScale,
        y: HEIGHT / 2 - worldY * targetScale,
      };

      const duration = 600;

      animationStateRef.current = {
        start,
        target,
        startTime: performance.now(),
        duration,
      };

      const step = (now: number) => {
        const state = animationStateRef.current;
        if (!state) return;

        const elapsed = now - state.startTime;
        const tRaw = elapsed / state.duration;
        const t = tRaw >= 1 ? 1 : tRaw;

        const eased = 1 - Math.pow(1 - t, 3);

        setCamera({
          x: state.start.x + (state.target.x - state.start.x) * eased,
          y: state.start.y + (state.target.y - state.start.y) * eased,
          scale:
            state.start.scale +
            (state.target.scale - state.start.scale) * eased,
        });

        if (t < 1) {
          animationRef.current = requestAnimationFrame(step);
        } else {
          animationRef.current = null;
          animationStateRef.current = null;
        }
      };

      animationRef.current = requestAnimationFrame(step);
    },
    [camera, stopCameraAnimation]
  );

  // Wheel zoom on container
  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      stopCameraAnimation();

      const rect = svg.getBoundingClientRect();
      const sx = ((e.clientX - rect.left) / rect.width) * WIDTH;
      const sy = ((e.clientY - rect.top) / rect.height) * HEIGHT;

      setCamera((prev) => zoomAtPoint(prev, sx, sy, e.deltaY));
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [stopCameraAnimation]);

  return {
    camera,
    svgRef,
    containerRef,
    handleSvgPointerDown,
    handleSvgPointerMove,
    handleSvgPointerUp,
    getWorldPointFromPointer,
    getWorldPointFromClient,
    focusOnWorldPoint,
  };
}
