"use client";

import React from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";

type Tone = "auto" | "dark";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  tone?: Tone;
};

type Tab = "edit" | "preview";

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Write using markdown...",
  className,
  disabled,
  label = "Description",
  tone = "auto",
}) => {
  const [tab, setTab] = React.useState<Tab>("edit");

  const isDark = tone === "dark";

  const editClasses = isDark
    ? "min-h-[140px] w-full resize-y rounded-md border border-zinc-700 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-100 shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
    : "min-h-[140px] w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 font-mono";

  const previewWrapperClasses = isDark
    ? "min-h-[140px] rounded-md border border-zinc-700 bg-zinc-900/80 px-3 py-2 text-sm overflow-y-auto max-h-80"
    : "min-h-[140px] rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm overflow-y-auto max-h-80";

  const hintTextClasses = isDark
    ? "text-[11px] text-zinc-400"
    : "text-[11px] text-zinc-500 dark:text-zinc-400";

  return (
    <div className={className ?? "flex flex-col gap-2"}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <div
          className={
            isDark
              ? "inline-flex rounded-md border border-zinc-700 bg-zinc-900/80 p-0.5 text-xs"
              : "inline-flex rounded-md border border-zinc-300 bg-background p-0.5 text-xs dark:border-zinc-700 dark:bg-zinc-900"
          }
        >
          <button
            type="button"
            onClick={() => setTab("edit")}
            className={`px-2 py-1 rounded-sm ${
              tab === "edit"
                ? "bg-blue-600 text-white"
                : isDark
                ? "text-zinc-200 hover:text-zinc-50"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`px-2 py-1 rounded-sm ${
              tab === "preview"
                ? "bg-blue-600 text-white"
                : isDark
                ? "text-zinc-200 hover:text-zinc-50"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {tab === "edit" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={editClasses}
        />
      ) : (
        <div className={previewWrapperClasses}>
          {value?.trim() ? (
            <MarkdownRenderer
              content={value}
              className={
                isDark
                  ? "prose prose-xs max-w-none prose-invert"
                  : "prose prose-sm max-w-none dark:prose-invert"
              }
            />
          ) : (
            <p
              className={
                isDark
                  ? "text-xs text-zinc-400"
                  : "text-xs text-zinc-500 dark:text-zinc-400"
              }
            >
              Nothing to preview yet.
            </p>
          )}
        </div>
      )}

      <p className={hintTextClasses}>
        Markdown supported (headings, lists, links, inline code, etc).
      </p>
    </div>
  );
};
