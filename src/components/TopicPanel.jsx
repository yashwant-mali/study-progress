import { useEffect, useState } from "react";
import Link from "next/link";

export default function TopicPanel({
  topic,
  onOpenCode,
  onEditTopic,
  onDeleteTopic,
}) {
  if (!topic) {
    return (
      <div className="rounded-[2rem] border border-slate-800/80 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/40 text-slate-400">
        <p className="text-sm">
          Select a topic to view theory and code solutions.
        </p>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState("theory");

  useEffect(() => {
    setActiveTab("theory");
  }, [topic._id]);

  return (
    <div
      data-component="TopicPanel"
      className="rounded-[2rem] border border-slate-800/80 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/40 text-slate-100"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">{topic.title}</h2>
          <p className="mt-1 text-sm text-slate-400">
            {topic.category || "General"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onEditTopic(topic)}
            className="rounded-3xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDeleteTopic(topic)}
            className="rounded-3xl border border-rose-500 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
          >
            Delete
          </button>
          <Link
            href={`/topics/${topic._id}`}
            className="rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            Open route
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800/80 bg-slate-900">
        <div className="flex flex-wrap gap-2 border-b border-slate-800 px-4 py-4">
          <button
            type="button"
            onClick={() => setActiveTab("theory")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === "theory"
                ? "bg-slate-100 text-slate-950"
                : "bg-slate-950 text-slate-200 hover:bg-slate-800"
            }`}
          >
            Theory
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("solutions")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === "solutions"
                ? "bg-slate-100 text-slate-950"
                : "bg-slate-950 text-slate-200 hover:bg-slate-800"
            }`}
          >
            Solutions
          </button>
        </div>

        <div className="p-5">
          {activeTab === "theory" ? (
            <div>
              <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                    Theory
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {topic.title}
                  </h3>
                </div>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  Updated{" "}
                  {topic.updatedAt
                    ? new Date(topic.updatedAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-300">
                {topic.description ||
                  "No theory notes available for this topic yet."}
              </p>
            </div>
          ) : (
            <div>
              <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                    Solutions
                  </p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    {topic.codes?.length ?? 0} code example
                    {topic.codes?.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {topic.codes?.length > 0 ? (
                  topic.codes.map((code, codeIndex) => (
                    <button
                      key={`${code.label}-${codeIndex}`}
                      type="button"
                      onClick={() => onOpenCode(topic, code)}
                      className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-4 text-left transition hover:border-slate-500"
                    >
                      <div className="font-semibold text-white">
                        {code.label}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        {code.language}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-3xl border border-slate-700 bg-slate-950 px-4 py-4 text-sm text-slate-400">
                    No solutions added yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
