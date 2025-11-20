import { MarkdownRenderer } from "../../components/markdown/MarkdownRenderer";
import {
  INTERNAL_LINK_PROTOCOL,
  type InternalLink,
} from "../../lib/internalLinks";

type Props = {
  name: string;
  description?: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onInternalLinkClick?: (link: InternalLink) => void;
};

function parseInternalLinkFromHref(hrefRaw: string | null): InternalLink | null {
  if (!hrefRaw) return null;
  const href = hrefRaw.trim();
  if (!href || !href.includes(INTERNAL_LINK_PROTOCOL)) return null;

  const idx = href.indexOf(INTERNAL_LINK_PROTOCOL);
  const rest = href.slice(idx + INTERNAL_LINK_PROTOCOL.length); // "C:Bilbo%20Bolseiro"
  const colonIndex = rest.indexOf(":");
  if (colonIndex <= 0) return null;

  const kindRaw = rest.slice(0, colonIndex).toUpperCase();
  const rawName = rest.slice(colonIndex + 1);

  if (!["E", "C", "L", "O"].includes(kindRaw)) return null;

  let decodedName = rawName;
  try {
    decodedName = decodeURIComponent(rawName);
  } catch {

  }

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
  onEdit,
  onDelete,
  onInternalLinkClick,
}: Props) {
  const hasDesc =
    typeof description === "string" && description.trim().length > 0;

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

  return (
    <li className="rounded-lg border p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h4 className="text-sm font-semibold">{name}</h4>

      {hasDesc ? (
        <div
          className="mt-1 text-sm text-zinc-600 dark:text-zinc-300"
          onClickCapture={handleDescriptionClickCapture}
        >
          <MarkdownRenderer
            content={description!}
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
        <p className="mt-1 text-sm italic text-zinc-500">No description.</p>
      )}

      <div className="mt-3 flex gap-2">
        <button
          className="rounded border px-3 py-1 text-sm dark:border-zinc-700"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="rounded border border-red-500 px-3 py-1 text-sm text-red-600 dark:text-red-400"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
