// frontend/src/features/demo/demoGraphData.ts
import type { GraphData } from "../graphs/types";

export const demoGraphData: GraphData = {
  nodes: [
    {
      id: "event-king-death",
      type: "EVENT",
      label: "The King Dies",
      description: "The old king dies before naming an heir.",
    },
    {
      id: "character-lady-vael",
      type: "CHARACTER",
      label: "Lady Vael",
      description: "A strategist suspected of influencing the succession.",
    },
    {
      id: "location-blackspire",
      type: "LOCATION",
      label: "Blackspire Keep",
      description: "The fortress where the royal court gathers.",
    },
    {
      id: "object-ashen-crown",
      type: "OBJECT",
      label: "The Ashen Crown",
      description: "An ancient crown tied to the legitimacy of the throne.",
    },
  ],
  links: [
    {
      id: "link-1",
      source: "event-king-death",
      target: "character-lady-vael",
      type: "involves",
    },
    {
      id: "link-2",
      source: "event-king-death",
      target: "location-blackspire",
      type: "happens_at",
    },
    {
      id: "link-3",
      source: "character-lady-vael",
      target: "object-ashen-crown",
      type: "seeks",
    },
  ],
};