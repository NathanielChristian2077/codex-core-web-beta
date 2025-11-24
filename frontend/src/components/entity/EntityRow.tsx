import { MarkdownRenderer } from "../../components/markdown/MarkdownRenderer";
import {
  INTERNAL_LINK_PROTOCOL,
  type InternalLink,
} from "../../lib/internalLinks";

type Props = {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onInternalLinkClick?: (link: InternalLink) => void;
};

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

export default function EntityRow({
  name,
  description,
  imageUrl,
  onEdit,
  onDelete,
  onInternalLinkClick,
}: Props) {
  const hasDesc = typeof description === "string" && description.trim().length > 0;
  const hasImage = !!imageUrl;

  const handleDescriptionClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement)?.closest("a") as HTMLAnchorElement | null;
    if (!anchor) return;

    const hrefAttr = anchor.getAttribute("href");
    const href = hrefAttr?.trim() || anchor.href?.trim();
    const link = parseInternalLinkFromHref(href);

    if (!link) return;

    e.preventDefault();
    e.stopPropagation();
    onInternalLinkClick?.(link);
  };

  return (
    <li className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white/70 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:bg-zinc-900">

      {hasImage && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 sm:w-40">
          <img
            src={imageUrl!}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent via-white/60 to-white dark:via-zinc-900/70 dark:to-zinc-900" />
        </div>
      )}

      <div className={`relative p-4 flex flex-col gap-2 ${hasImage ? "pl-36 sm:pl-44" : ""}`}>
        <h4 className="text-sm font-semibold line-clamp-1">{name}</h4>

        {hasDesc ? (
          <div
            className="text-sm text-zinc-600 dark:text-zinc-300"
            onClickCapture={handleDescriptionClickCapture}
          >
            <MarkdownRenderer
              content={description!}
              className="
                prose prose-sm max-w-none dark:prose-invert
                line-clamp-3
                prose-a:text-emerald-400
                prose-a:underline
                prose-a:underline-offset-2
                hover:prose-a:text-emerald-300
              "
            />
          </div>
        ) : (
          <p className="text-sm italic text-zinc-500 dark:text-zinc-400">No description.</p>
        )}

        <div className="mt-2 flex gap-2">
          <button
            className="rounded border px-3 py-1 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            onClick={onEdit}
          >
            Edit
          </button>

          <button
            className="rounded border border-red-500 px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
