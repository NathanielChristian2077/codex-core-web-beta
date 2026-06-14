import { useCallback, useEffect, useRef, useState } from "react";

import * as layoutsApi from "../../api/modules/layouts";
import * as viewsApi from "../../api/modules/views";
import type { UpsertLayoutRequest, ViewDto } from "../../api/contracts/view";
import type { NodePositions } from "./GraphContext";

const SAVE_DEBOUNCE_MS = 700;
// Garante um flush mesmo sob re-renders contínuos do grafo (a simulação
// reescreve as posições a cada settle, o que reseta o debounce sem parar).
const SAVE_MAX_WAIT_MS = 1500;

/**
 * Resolve a View usada pelo grafo do projeto. O preset "rpg-campaign" já
 * cria uma view default; se não houver nenhuma, criamos uma "Graph".
 */
async function resolveGraphView(projectId: string): Promise<ViewDto> {
  const views = await viewsApi.listViews(projectId);
  const existing = views.find((v) => v.mode === "graph") ?? views[0];
  if (existing) return existing;
  return viewsApi.createView(projectId, { name: "Graph", mode: "graph" });
}

/**
 * Persistência das posições do grafo via View/Layout do backend.
 *
 * - carrega o layout salvo ao montar (`initialPositions`);
 * - expõe `persistPositions`, que salva com debounce e manda só o que mudou;
 * - é tolerante a falhas: se o backend ainda não tem os endpoints, o grafo
 *   continua funcionando (apenas não persiste).
 */
export function useViewLayout(projectId: string | undefined) {
  const [ready, setReady] = useState(false);
  const [initialPositions, setInitialPositions] = useState<NodePositions>({});

  const viewIdRef = useRef<string | null>(null);
  const savedRef = useRef<NodePositions>({});
  const pendingRef = useRef<NodePositions | null>(null);
  const timerRef = useRef<number | null>(null);
  const maxTimerRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    viewIdRef.current = null;
    savedRef.current = {};

    if (!projectId) {
      setReady(true);
      return;
    }

    setReady(false);
    (async () => {
      try {
        const view = await resolveGraphView(projectId);
        const layout = await layoutsApi.getViewLayout(view.id);

        const positions: NodePositions = {};
        layout.forEach((l) => {
          positions[l.nodeId] = { x: l.x, y: l.y };
        });

        if (!cancelled) {
          viewIdRef.current = view.id;
          savedRef.current = positions;
          setInitialPositions(positions);
        }
      } catch (err) {
        // Backend pode ainda não expor views/layout — segue sem persistir.
        console.warn("Failed to load graph layout", err);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const flush = useCallback(async () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (maxTimerRef.current) {
      window.clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }

    const viewId = viewIdRef.current;
    const pending = pendingRef.current;
    pendingRef.current = null;
    if (!viewId || !pending) return;

    // Manda só os nodes cuja posição (arredondada) mudou desde o último save.
    const changed: UpsertLayoutRequest[] = [];
    for (const [nodeId, pos] of Object.entries(pending)) {
      const prev = savedRef.current[nodeId];
      const x = Math.round(pos.x);
      const y = Math.round(pos.y);
      if (!prev || prev.x !== x || prev.y !== y) {
        changed.push({ nodeId, x, y });
      }
    }
    if (!changed.length) return;

    try {
      // Sem endpoint em massa no backend: upsert por node (em paralelo).
      await Promise.all(
        changed.map((c) => layoutsApi.updateNodeLayout(viewId, c))
      );
      changed.forEach((c) => {
        savedRef.current[c.nodeId] = { x: c.x, y: c.y };
      });
    } catch (err) {
      console.warn("Failed to persist graph layout", err);
    }
  }, []);

  const persistPositions = useCallback(
    (positions: NodePositions) => {
      pendingRef.current = positions;

      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(
        flush,
        SAVE_DEBOUNCE_MS
      ) as unknown as number;

      // Teto: assegura um flush periódico mesmo se o debounce nunca "assentar".
      if (!maxTimerRef.current) {
        maxTimerRef.current = window.setTimeout(
          flush,
          SAVE_MAX_WAIT_MS
        ) as unknown as number;
      }
    },
    [flush]
  );

  // Garante que mudanças pendentes sejam salvas ao desmontar/trocar de projeto.
  useEffect(
    () => () => {
      void flush();
    },
    [flush]
  );

  return { ready, initialPositions, persistPositions };
}
