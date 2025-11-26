import { GitBranch, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/layout/Spinner";
import { useToast } from "../components/layout/ToastProvider";
import EventModal from "../components/timeline/EventModal";
import Timeline from "../components/timeline/Timeline";
import {
  deleteEvent,
  getCampaign,
  listCampaignEvents,
} from "../features/campaigns/api";
import type { EventItem } from "../features/campaigns/types";
import type { InternalLink } from "../lib/internalLinks";

function pathForKind(kind: "E" | "C" | "L" | "O", campaignId: string): string {
  switch (kind) {
    case "E":
      return `/campaigns/${campaignId}/timeline`;
    case "C":
      return `/campaigns/${campaignId}/characters`;
    case "L":
      return `/campaigns/${campaignId}/locations`;
    case "O":
      return `/campaigns/${campaignId}/objects`;
  }
}

export default function TimelinePage() {
  const { id } = useParams<{ id: string }>();
  const [campaignName, setCampaignName] = useState<string>("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [initialTitle, setInitialTitle] = useState<string | undefined>();
  const t = useToast();
  const navigate = useNavigate();

  async function fetchAll() {
    if (!id) return;
    try {
      setLoading(true);
      const [camp, evs] = await Promise.all([
        getCampaign(id),
        listCampaignEvents(id),
      ]);
      setCampaignName(camp.name);
      setEvents(evs);
    } catch {
      t.show("Failed to load timeline", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, [id]);

  async function onDelete(eventId: string) {
    if (!confirm("Delete this event?")) return;
    try {
      await deleteEvent(eventId);
      t.show("Event deleted", "success");
      fetchAll();
    } catch {
      t.show("Failed to delete", "error");
    }
  }

  const handleInternalLinkClick = (link: InternalLink) => {
    if (!id) return;

    if (link.kind !== "E") {
      const path = pathForKind(link.kind, id);
      navigate(path);
      return;
    }

    const normalized = link.name.trim().toLowerCase();
    const found = events.find(
      (ev) => ev.title.trim().toLowerCase() === normalized
    );

    if (found) {
      setEditing(found);
      setInitialTitle(undefined);
      setModalOpen(true);
      return;
    }

    setEditing(null);
    setInitialTitle(link.name);
    setModalOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 lg:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {campaignName || "Timeline"}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Events listed in creation order
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/campaigns/${id}/graph`}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <GitBranch className="h-4 w-4" />
            <span>Open graph</span>
          </Link>

          <button
            onClick={() => {
              setEditing(null);
              setInitialTitle(undefined);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>New event</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-10">
          <Spinner size={24} />
        </div>
      ) : (
        <Timeline
          events={events}
          onEdit={(ev) => {
            setEditing(ev);
            setInitialTitle(undefined);
            setModalOpen(true);
          }}
          onDelete={onDelete}
          onInternalLinkClick={handleInternalLinkClick}
        />
      )}

      {id && (
        <EventModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          campaignId={id}
          editing={editing}
          initialTitle={initialTitle}
          onSaved={fetchAll}
        />
      )}
    </div>
  );
}
