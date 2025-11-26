"use client";

import { Search } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

import { cn } from "../../lib/utils";

import {
    listCampaignEvents,
    listCampaigns,
} from "../../features/campaigns/api";
import type { Campaign, EventItem } from "../../features/campaigns/types";

import { listCharacters } from "../../features/characters/api";
import type { Character } from "../../features/characters/types";

import { listLocations } from "../../features/locations/api";
import type { LocationEntity } from "../../features/locations/types";

import { listObjects } from "../../features/objects/api";
import type { ObjectEntity } from "../../features/objects/types";

import { useCurrentCampaign } from "../../store/useCurrentCampaign";

import { SidebarInput } from "../animate-ui/components/radix/sidebar";

type SearchKind = "campaign" | "event" | "character" | "location" | "object";

type SearchItem = {
  id: string;
  kind: SearchKind;
  label: string;
  campaignId?: string;
  campaignName?: string;
  path: string;
};

const kindLabel: Record<SearchKind, string> = {
  campaign: "Campaign",
  event: "Event",
  character: "Character",
  location: "Location",
  object: "Object",
};

function scoreMatch(query: string, text: string | undefined | null) {
  if (!text) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();

  if (!q || !t.includes(q)) return 0;

  if (t === q) return 120;
  if (t.startsWith(q)) return 80;
  if (t.includes(` ${q}`)) return 60;

  return 30;
}

export const SidebarSearch: React.FC = () => {
  const navigate = useNavigate();

  const { currentCampaignId, setCurrentCampaign } = useCurrentCampaign();

  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);

  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [entities, setEntities] = React.useState<{
    events: EventItem[];
    characters: Character[];
    locations: LocationEntity[];
    objects: ObjectEntity[];
  }>({
    events: [],
    characters: [],
    locations: [],
    objects: [],
  });

  const [loadingCampaigns, setLoadingCampaigns] = React.useState(false);
  const [loadingEntities, setLoadingEntities] = React.useState(false);

  React.useEffect(() => {
    let ignore = false;

    async function loadCampaigns() {
      try {
        setLoadingCampaigns(true);
        const data = await listCampaigns();
        if (!ignore) setCampaigns(data);
      } finally {
        if (!ignore) setLoadingCampaigns(false);
      }
    }

    loadCampaigns();
    return () => {
      ignore = true;
    };
  }, []);

  React.useEffect(() => {
    let ignore = false;
    const campId = currentCampaignId;

    if (!campId) {
      setEntities({
        events: [],
        characters: [],
        locations: [],
        objects: [],
      });
      return;
    }

    async function loadEntities(campaignId: string) {
      try {
        setLoadingEntities(true);

        const [events, chars, locs, objs] = await Promise.all([
          listCampaignEvents(campaignId),
          listCharacters(campaignId),
          listLocations(campaignId),
          listObjects(campaignId),
        ]);

        if (ignore) return;
        if (campaignId !== currentCampaignId) return;

        setEntities({
          events,
          characters: chars,
          locations: locs,
          objects: objs,
        });
      } finally {
        if (!ignore) setLoadingEntities(false);
      }
    }

    loadEntities(campId);

    return () => {
      ignore = true;
    };
  }, [currentCampaignId]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const index: SearchItem[] = React.useMemo(() => {
    const items: SearchItem[] = [];

    for (const camp of campaigns) {
      items.push({
        id: camp.id,
        kind: "campaign",
        label: camp.name,
        campaignId: camp.id,
        campaignName: camp.name,
        path: `/campaigns/${camp.id}/timeline`,
      });
    }

    const currentCamp =
      (currentCampaignId &&
        campaigns.find((c) => c.id === currentCampaignId)) ||
      null;

    const campName = currentCamp?.name ?? "Current campaign";

    if (currentCampaignId) {
      for (const ev of entities.events) {
        items.push({
          id: ev.id,
          kind: "event",
          label: ev.title,
          campaignId: currentCampaignId,
          campaignName: campName,
          path: `/campaigns/${currentCampaignId}/timeline`,
        });
      }

      for (const ch of entities.characters) {
        items.push({
          id: ch.id,
          kind: "character",
          label: ch.name,
          campaignId: currentCampaignId,
          campaignName: campName,
          path: `/campaigns/${currentCampaignId}/characters`,
        });
      }

      for (const loc of entities.locations) {
        items.push({
          id: loc.id,
          kind: "location",
          label: loc.name,
          campaignId: currentCampaignId,
          campaignName: campName,
          path: `/campaigns/${currentCampaignId}/locations`,
        });
      }

      for (const obj of entities.objects) {
        items.push({
          id: obj.id,
          kind: "object",
          label: obj.name,
          campaignId: currentCampaignId,
          campaignName: campName,
          path: `/campaigns/${currentCampaignId}/objects`,
        });
      }
    }

    return items;
  }, [campaigns, entities, currentCampaignId]);

  const matches: SearchItem[] = React.useMemo(() => {
    const q = query.trim();
    if (!q) return [];

    const scored = index
      .map((item) => {
        const base = scoreMatch(q, item.label);
        const extra = scoreMatch(q, item.campaignName);
        const score = base + extra;
        return { item, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);

    return scored.map((x) => x.item);
  }, [index, query]);

  const isLoading =
    loadingCampaigns || (loadingEntities && !!currentCampaignId);

  function handleSelect(item: SearchItem) {
    if (item.campaignId) {
      setCurrentCampaign(item.campaignId);
    }

    navigate(item.path);
    setQuery("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!matches.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 < 0 ? matches.length - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = matches[activeIndex];
      if (item) handleSelect(item);
    } else if (e.key === "Escape") {
      setQuery("");
    }
  }

  return (
    <div className="px-2 pt-2">
      <div className="relative">
        {query && (
          <div
            className={cn(
              "absolute bottom-9 left-0 right-0 z-20 max-h-64 overflow-y-auto rounded-md border",
              "border-zinc-800/70 bg-zinc-950/95",
              "shadow-lg text-[11px]"
            )}
          >
            {isLoading && (
              <div className="px-2 py-1 text-zinc-500">Searching…</div>
            )}

            {!isLoading && matches.length === 0 && (
              <div className="px-2 py-1 text-zinc-500">No results.</div>
            )}

            {!isLoading &&
              matches.map((item, idx) => (
                <button
                  key={`${item.kind}-${item.id}`}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 px-2 py-1.5",
                    "text-left hover:bg-zinc-800/90 focus:bg-zinc-800/90",
                    "cursor-pointer",
                    idx === activeIndex && "bg-zinc-800/90"
                  )}
                >
                  <div className="min-w-0">
                    <div className="truncate text-zinc-100">{item.label}</div>
                    <div className="truncate text-[10px] text-zinc-500">
                      {kindLabel[item.kind]}
                      {item.campaignName ? ` · ${item.campaignName}` : null}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        )}

        <SidebarInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search campaigns, events..."
          className="h-8 pr-8 text-xs"
        />
        <Search className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
      </div>
    </div>
  );
};
