import { getRelationMeta } from "../../../features/graphs/relations";

/**
 * Stroke color per relation category.
 */
export function getLinkStroke(type: string): string {
  const meta = getRelationMeta(type);

  switch (meta.category) {
    case "TEMPORAL":
      return "rgba(148,163,184,0.9)";
    case "APPEARANCE":
      return "rgba(52,211,153,0.85)"; // emerald-ish
    case "LOCATION":
      return "rgba(96,165,250,0.85)"; // blue-ish
    case "USAGE":
      return "rgba(250,204,21,0.9)"; // yellow-ish
    case "OWNERSHIP":
      return "rgba(244,114,182,0.85)"; // pink-ish
    case "GENERIC":
    default:
      return "rgba(148,163,184,0.7)";
  }
}

/**
 * Helper to decide if an arrow should be restricted to EVENT→EVENT edges.
 */
export function isEventToEvent(sourceType: string, targetType: string): boolean {
  return sourceType === "EVENT" && targetType === "EVENT";
}
