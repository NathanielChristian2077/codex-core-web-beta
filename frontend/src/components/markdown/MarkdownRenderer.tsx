"use client";

import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

const markdownComponents: Components = {
  h1: ({ node, ...props }) => (
    <h2 {...props} className="text-lg font-semibold mb-2" />
  ),
  h2: ({ node, ...props }) => (
    <h3 {...props} className="text-base font-semibold mb-2" />
  ),
  h3: ({ node, ...props }) => (
    <h4 {...props} className="text-sm font-semibold mb-1" />
  ),
  p: ({ node, ...props }) => <p {...props} className="mb-2" />,
  ul: ({ node, ...props }) => (
    <ul {...props} className="list-disc list-inside mb-2" />
  ),
  ol: ({ node, ...props }) => (
    <ol {...props} className="list-decimal list-inside mb-2" />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote
      {...props}
      className="border-l-2 border-muted-foreground/40 pl-3 italic mb-2"
    />
  ),

  code: (rawProps) => {
    const { inline, className, children, ...props } = rawProps as any;

    if (inline) {
      return (
        <code
          {...props}
          className={
            "rounded bg-muted px-1 py-0.5 text-xs font-mono " +
            (className ?? "")
          }
        >
          {children}
        </code>
      );
    }

    return (
      <pre className="rounded bg-muted p-2 text-xs overflow-x-auto">
        <code {...props} className={"font-mono " + (className ?? "")}>
          {children}
        </code>
      </pre>
    );
  },

  a: ({ node, ...props }) => (
    <a
      {...props}
      className="text-primary underline underline-offset-2 hover:no-underline"
      target="_blank"
      rel="noreferrer"
    />
  ),

  img: ({ node, ...props }) => (
    <img
      {...props}
      className={
        "rounded-md max-w-full max-h-64 object-contain my-2 " +
        (props.className ?? "")
      }
    />
  ),
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
}) => {
  if (!content?.trim()) return null;

  return (
    <div className={className ?? "prose prose-sm dark:prose-invert max-w-none"}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
