"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TopicForm from "@/components/TopicForm";
import TopicPanel from "@/components/TopicPanel";
import { getCategoryColor } from "@/lib/categoryColor";

export default function TopicDetailClient({
  initialTopic,
  topicId,
  serverError,
}) {
  const router = useRouter();
  const [topic, setTopic] = useState(initialTopic);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(serverError || "");

  useEffect(() => {
    setTopic(initialTopic);
  }, [initialTopic]);

  const reloadTopic = async () => {
    if (!topicId) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/topics/${topicId}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || "Unable to load topic");
      }
      const payload = await response.json();
      setTopic(payload);
    } catch (err) {
      setError(err.message || "Could not load topic");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTopic = async () => {
    if (!topicId || !confirm("Delete this topic?")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/topics/${topicId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || "Unable to delete topic");
      }
      router.push("/");
    } catch (err) {
      setError(err.message || "Could not delete topic");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (topicData) => {
    if (!topicId && topicData.id) {
      setError("Topic ID is required to save changes.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/topics/${topicId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(topicData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || "Unable to update topic");
      }

      const updatedTopic = await response.json();
      setTopic(updatedTopic);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Could not update topic");
    } finally {
      setLoading(false);
    }
  };

  const summary = useMemo(() => {
    if (!topic) return { notes: 0, progress: 0 };
    const notes = (topic.notes || topic.description)?.trim() ? 1 : 0;
    return {
      notes,
      progress: notes ? 100 : 0,
    };
  }, [topic]);

  return (
    <main
      data-component="TopicDetailClient"
      className="min-h-screen bg-slate-950 text-slate-100"
    >
      <div className="mx-auto grid max-w-[1200px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-800/80 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Topic
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-semibold text-white">
                  {topic?.title || "Topic details"}
                </h1>
                {topic?.category ? (
                  <span
                    className={`rounded-full border px-3 py-1 text-sm font-semibold ${getCategoryColor(topic.category).border} ${getCategoryColor(topic.category).bg} ${getCategoryColor(topic.category).text}`}
                  >
                    {topic.category}
                  </span>
                ) : null}
              </div>
              <p className="max-w-3xl whitespace-pre-wrap text-sm leading-7 text-slate-400">
                {topic?.notes ||
                  topic?.description ||
                  "Open a topic route to review the complete notes for this topic."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-3xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
              >
                Back to dashboard
              </button>
              <button
                type="button"
                onClick={() => setIsEditing((current) => !current)}
                className="rounded-3xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                {isEditing ? "View details" : "Edit topic"}
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 px-6 py-4 text-rose-100 shadow-sm">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-[2rem] border border-slate-800/80 bg-slate-950/95 p-10 text-center text-slate-400 shadow-2xl shadow-slate-950/40">
            Loading topic...
          </div>
        ) : !topic ? (
          <div className="rounded-[2rem] border border-slate-800/80 bg-slate-950/95 p-10 text-center text-slate-400 shadow-2xl shadow-slate-950/40">
            Topic not found.
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-1">
            <section className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-800/80 bg-slate-900 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Category
                  </p>
                  <p className="mt-3 text-xl font-semibold text-white">
                    {topic.category || "General"}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-800/80 bg-slate-900 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Notes
                  </p>
                  <p className="mt-3 text-xl font-semibold text-white">
                    {summary.notes}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-800/80 bg-slate-900 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Progress
                  </p>
                  <p className="mt-3 text-xl font-semibold text-white">
                    {summary.progress}%
                  </p>
                </div>
              </div>

              {isEditing ? (
                <TopicForm
                  initialTopic={topic}
                  onSubmit={handleSubmit}
                  onCancel={() => setIsEditing(false)}
                  submitLabel="Save changes"
                />
              ) : (
                <TopicPanel
                  topic={topic}
                  onEditTopic={() => setIsEditing(true)}
                  onDeleteTopic={handleDeleteTopic}
                />
              )}
            </section>

            {/* <aside className="space-y-6">
              <div className="rounded-[2rem] border border-slate-800/80 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/40">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  Quick actions
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  {topic.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Keep your notes open while you review the topic and work through examples.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="rounded-3xl bg-slate-800 px-4 py-3 text-sm text-slate-100 transition hover:bg-slate-700"
                  >
                    Back to dashboard
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteTopic}
                    className="rounded-3xl border border-rose-500 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 transition hover:bg-rose-500/20"
                  >
                    Delete topic
                  </button>
                </div>
              </div>
            </aside> */}
          </div>
        )}
      </div>
    </main>
  );
}
