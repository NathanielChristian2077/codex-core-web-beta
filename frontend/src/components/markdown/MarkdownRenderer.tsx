"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  encodeInternalLinks,
  type InternalLink,
  type InternalLinkMeta,
} from "../../lib/internalLinks";

type MarkdownRendererProps = {
  content: string;
  className?: string;
  onInternalLinkClick?: (link: InternalLink) => void;
  getInternalLinkMeta?: (link: InternalLink) => InternalLinkMeta | null;
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
}) => {
  if (!content?.trim()) return null;

  const processed = encodeInternalLinks(content);

  return (
    <div
      className={className ?? "prose prose-sm dark:prose-invert max-w-none"}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        urlTransform={(url) => url}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
};
