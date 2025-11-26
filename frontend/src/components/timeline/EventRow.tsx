import { Pencil, Trash2 } from "lucide-react";
import { MarkdownRenderer } from "../../components/markdown/MarkdownRenderer";
import type { EventItem } from "../../features/campaigns/types";
import {
  INTERNAL_LINK_PROTOCOL,
  type InternalLink,
} from "../../lib/internalLinks";

type Props = {
  event: EventItem;
  onEdit: (ev: EventItem) => void;
  onDelete: (id: string) => void;
  onInternalLinkClick?: (link: InternalLink) => void;
};

function formatCreatedAt(s?: string) {
  if (!s) return null;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseInternalLinkFromHref(hrefRaw: string | null): InternalLink | null {
  if (!hrefRaw) return null;
  const href = hrefRaw.trim();
  if (!href || !href.includes(INTERNAL_LINK_PROTOCOL)) return null;

  const idx = href.indexOf(INTERNAL_LINK_PROTOCOL);
  const rest = href.slice(idx + INTERNAL_LINK_PROTOCOL.length);
  const colonIndex = rest.indexOf(":");
  if (colonIndex <= 0) return null;

  const kindRaw = rest.slice(0, colonIndex).toUpperCase();
  const rawName = rest.slice(colonIndex + 1);

  if (!["E", "C", "L", "O"].includes(kindRaw)) return null;

  let decodedName = rawName;
  try {
    decodedName = decodeURIComponent(rawName);
  } catch {}

  const name = decodedName.trim();
  if (!name) return null;

  return {
    kind: kindRaw as InternalLink["kind"],
    name,
  };
}

export default function EventRow({
  event,
  onEdit,
  onDelete,
  onInternalLinkClick,
}: Props) {
  const createdLabel = formatCreatedAt(event.createdAt);
  const hasDesc =
    typeof event.description === "string" &&
    event.description.trim().length > 0;

  const handleDescriptionClickCapture = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const anchor = target.closest("a") as HTMLAnchorElement | null;
    if (!anchor) return;

    const hrefAttr = anchor.getAttribute("href");
    const href = (hrefAttr && hrefAttr.trim()) || (anchor.href ?? "").trim();

    const link = parseInternalLinkFromHref(href);
    if (!link) return;

    e.preventDefault();
    e.stopPropagation();

    onInternalLinkClick?.(link);
  };

  const imageUrl = (event as any).imageUrl as string | undefined;
  const hasImage = !!imageUrl;

  return (
    <div
      className="
        relative w-full overflow-hidden rounded-xl
        border border-zinc-200 bg-white/80 shadow-sm
        transition hover:bg-zinc-50 hover:shadow-md
        dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-900
        min-h-[150px]
      "
    >
      {hasImage && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-40 sm:w-48">
          <img
            src={imageUrl}
            alt={event.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-r from-transparent via-white/60 to-white dark:via-zinc-900/70 dark:to-zinc-900" />
        </div>
      )}

      <div
        className={
          "relative flex h-full flex-col gap-2 p-5 pr-40 " +
          (hasImage ? "pl-40 sm:pl-48" : "")
        }
      >
        {createdLabel && (
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Created at {createdLabel}
          </div>
        )}

        <h4 className="line-clamp-1 text-lg font-semibold">
          {event.title}
        </h4>

        {hasDesc ? (
          <div
            className="mt-1 text-base text-zinc-700 dark:text-zinc-300"
            onClickCapture={handleDescriptionClickCapture}
          >
            <MarkdownRenderer
              content={event.description!}
              className="
                prose prose-sm dark:prose-invert max-w-none
                line-clamp-3
                prose-a:text-emerald-400
                prose-a:underline
                prose-a:underline-offset-2
                hover:prose-a:text-emerald-300
              "
            />
          </div>
        ) : (
          <p className="mt-1 text-sm italic text-zinc-500 dark:text-zinc-400">
            No description.
          </p>
        )}
      </div>

      <div className="absolute right-4 top-4 flex gap-2">
        <button
          onClick={() => onEdit(event)}
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          <Pencil className="h-4 w-4" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(event.id)}
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-red-500 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
