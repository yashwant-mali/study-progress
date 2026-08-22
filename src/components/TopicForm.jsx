import { memo, useEffect, useState } from "react";

function TopicForm({
  initialTopic,
  defaultCategory = "General",
  onSubmit,
  onCancel,
  submitLabel = "Save topic",
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(defaultCategory || "General");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setTitle(initialTopic?.title || "");
    setCategory(initialTopic?.category || defaultCategory || "General");
    setNotes(initialTopic?.notes || initialTopic?.description || "");
  }, [initialTopic, defaultCategory]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // The parent closes the form and applies an optimistic update right
    // away (see Home's handleSubmit), so we intentionally don't await or
    // track a local "submitting" state here — this form unmounts as soon
    // as it's submitted.
    onSubmit({
      id: initialTopic?._id,
      title,
      category,
      notes,
      description: notes,
    });
  };

  return (
    <form
      data-component="TopicForm"
      onSubmit={handleSubmit}
      className="space-y-8 rounded-[24px] border border-white/10 bg-[#111827]/95 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.24)]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            {initialTopic ? "Edit Topic" : "Add New Topic"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
            {initialTopic
              ? "Update the topic notes and group without splitting theory from examples."
              : "Create a topic with theory, explanations, and code in one notes document."}
          </p>
        </div>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#F8FAFC] transition hover:bg-white/10"
          >
            Cancel
          </button>
        ) : null}
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-white">
          Topic title
        </label>
        <input
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g., JavaScript Closures"
          className="w-full rounded-[18px] border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-white">
          Topic group
        </label>
        <input
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="e.g., JavaScript, React, Algorithms"
          className="w-full rounded-[18px] border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <label className="block text-sm font-semibold text-white">
            Notes
          </label>
          <span className="text-xs uppercase tracking-[0.25em] text-[#94A3B8]">
            Theory + code
          </span>
        </div>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Write your topic notes here. Use fenced code blocks for code examples.\n\n```javascript\nfunction greet(name) {\n  console.log(name);\n}\n```"
          rows={10}
          className="w-full rounded-[18px] border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
        />
        <p className="text-xs leading-5 text-[#94A3B8]">
          Tip: keep theory as regular text and place code inside fenced blocks
          such as{" "}
          <span className="font-mono text-[#E2E8F0]">```javascript</span>.
        </p>
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-[20px] bg-gradient-to-r from-[#6366F1] to-[#4F46E5] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(99,102,241,0.35)] transition hover:from-[#4F46E5] hover:to-[#4338CA]"
      >
        {submitLabel}
      </button>
    </form>
  );
}

export default memo(TopicForm);
