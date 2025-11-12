import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EventModal from "../components/timeline/EventModal";
import Timeline from "../components/timeline/Timeline";
import Spinner from "../components/ui/Spinner";
import { useToast } from "../components/ui/ToastProvider";
import { deleteEvent, getCampaign, listCampaignEvents } from "../features/campaigns/api";
import type { EventItem } from "../features/campaigns/types";

export default function TimelinePage() {
  const { id } = useParams<{ id: string }>();
  const [campaignName, setCampaignName] = useState<string>("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const t = useToast();

  async function fetchAll() {
    if (!id) return;
    try {
      setLoading(true);
      const [camp, evs] = await Promise.all([getCampaign(id), listCampaignEvents(id)]);
      setCampaignName(camp.name);
      setEvents(evs);
    } catch {
      t.show("Failed to load timeline", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, [id]);

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

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{campaignName || "Timeline"}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Events ordered by date</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/campaigns/${id}/graph`} className="rounded border px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800">
            Open graph
          </Link>
          <button onClick={() => { setEditing(null); setModalOpen(true); }} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            New event
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
          onEdit={(ev) => { setEditing(ev); setModalOpen(true); }}
          onDelete={onDelete}
        />
      )}

      {id && (
        <EventModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          campaignId={id}
          editing={editing}
          onSaved={fetchAll}
        />
      )}
    </div>
  );
}
