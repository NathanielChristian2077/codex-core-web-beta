import React from "react";
import { MarkdownRenderer } from "../markdown/MarkdownRenderer";

type Props = {
  description?: string | null;
  maxLines?: number;
};

export const EntityDescriptionCell: React.FC<Props> = ({
  description,
  maxLines = 3,
}) => {
  const desc = (description ?? "").trim();
  if (!desc) {
    return (
      <span className="text-[11px] italic text-zinc-500">
        No description.
      </span>
    );
  }

  return (
    <MarkdownRenderer
      content={desc}
      className={`
        prose prose-xs dark:prose-invert max-w-none
        text-[11px] leading-snug
        [&_p]:m-0
        [&_ul]:m-0 [&_ol]:m-0
        [&_li]:m-0
        [&_code]:text-[10px]
        prose-a:text-emerald-400
        prose-a:underline
        prose-a:underline-offset-2
        hover:prose-a:text-emerald-300
        ${maxLines ? "line-clamp-" + maxLines : ""}
      `}
    />
  );
};