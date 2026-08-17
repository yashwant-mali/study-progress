"use client";

import { useState } from "react";
import Link from "next/link";
import { parseNotesBlocks } from "@/lib/notes";
import { getCategoryColor } from "@/lib/categoryColor";

function CodeBlock({ language, content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — silently ignore
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#050914]">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#0A0F1F] px-2.5 py-1.5">
        <span className="text-[10px] uppercase tracking-[0.28em] text-[#94A3B8]">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium text-[#94A3B8] transition hover:border-[#22D3EE]/40 hover:text-[#22D3EE]"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words p-3 font-mono text-[13px] leading-6 text-slate-100">
        <code>{content}</code>
      </pre>
    </div>
  );
}

export default function TopicPanel({ topic, onEditTopic, onDeleteTopic }) {
  if (!topic) {
    return (
      <div className="rounded-[1.5rem] border border-white/10 bg-[#0B0F1F]/95 p-6 text-slate-400 shadow-2xl shadow-black/40">
        <p className="text-sm">Select a topic to view its notes.</p>
      </div>
    );
  }

  const notesText = topic.notes || topic.description || "";
  const blocks = parseNotesBlocks(notesText);
  const categoryColor = getCategoryColor(topic.category);

  return (
    <div
      data-component="TopicPanel"
      className="rounded-[1.5rem] border border-white/10 bg-[#0B0F1F]/95 p-4 shadow-2xl shadow-black/40 text-slate-100"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">{topic.title}</h2>
          <span
            className={`mt-2 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${categoryColor.border} ${categoryColor.bg} ${categoryColor.text}`}
          >
            {topic.category || "General"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onEditTopic(topic)}
            className="rounded-full bg-gradient-to-r from-[#6366F1] to-[#4F46E5] px-3 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(99,102,241,0.35)] transition hover:from-[#4F46E5] hover:to-[#4338CA]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDeleteTopic(topic)}
            className="rounded-full border border-rose-500 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
          >
            Delete
          </button>
          <Link
            href={`/topics/${topic._id}`}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            Open route
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0F1425]">
        <div className="flex flex-col gap-3 border-b border-white/10 px-3 py-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
              Notes
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              {topic.title}
            </h3>
          </div>
          <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">
            Updated{" "}
            {topic.updatedAt
              ? new Date(topic.updatedAt).toLocaleDateString()
              : "—"}
          </span>
        </div>

        <div className="space-y-3 p-3">
          {blocks.length ? (
            blocks.map((block, index) =>
              block.type === "code" ? (
                <CodeBlock
                  key={`code-${index}`}
                  language={block.language}
                  content={block.content}
                />
              ) : (
                <div
                  key={`theory-${index}`}
                  className="whitespace-pre-wrap text-[14px] leading-7 text-slate-200"
                >
                  {block.content}
                </div>
              ),
            )
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-[#0B0F1F]/70 p-4 text-sm text-slate-400">
              No notes available for this topic yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
