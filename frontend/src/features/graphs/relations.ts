// frontend/src/features/graphs/relations.ts

export type RelationCategory =
  | "TEMPORAL"
  | "APPEARANCE"
  | "LOCATION"
  | "USAGE"
  | "OWNERSHIP"
  | "GENERIC";

export type RelationMeta = {
  type: string;
  label: string;
  directional: boolean;
  category: RelationCategory;
};

const RELATION_DEFS: Record<string, RelationMeta> = {
  APPEARS: {
    type: "APPEARS",
    label: "appears",
    directional: true,
    category: "APPEARANCE",
  },
  OCCURS_AT: {
    type: "OCCURS_AT",
    label: "occurs at",
    directional: true,
    category: "LOCATION",
  },
  USES: {
    type: "USES",
    label: "uses",
    directional: true,
    category: "USAGE",
  },
  HAS: {
    type: "HAS",
    label: "has",
    directional: true,
    category: "OWNERSHIP",
  },

  PARALLEL: {
    type: "PARALLEL",
    label: "parallel",
    directional: false,
    category: "TEMPORAL",
  },
  PREVIOUS: {
    type: "PREVIOUS",
    label: "previous",
    directional: true,
    category: "TEMPORAL",
  },
  NEXT: {
    type: "NEXT",
    label: "next",
    directional: true,
    category: "TEMPORAL",
  },

  LINK: {
    type: "LINK",
    label: "link",
    directional: false,
    category: "GENERIC",
  },
};

export function getRelationMeta(type: string): RelationMeta {
  const known = RELATION_DEFS[type];
  if (known) return known;

  return {
    type,
    label: type.toLowerCase().replace(/_/g, " "),
    directional: false,
    category: "GENERIC",
  };
}
