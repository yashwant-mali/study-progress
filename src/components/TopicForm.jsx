import { useEffect, useState } from "react";

const defaultCode = {
  label: "Solution 1",
  language: "JavaScript",
  snippet: "",
};

export default function TopicForm({
  initialTopic,
  onSubmit,
  onCancel,
  submitLabel = "Save topic",
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [description, setDescription] = useState("");
  const [codes, setCodes] = useState([defaultCode]);
  const [expandedCodes, setExpandedCodes] = useState([false]);

  useEffect(() => {
    const initialCodes =
      initialTopic &&
      Array.isArray(initialTopic.codes) &&
      initialTopic.codes.length > 0
        ? initialTopic.codes.map((code) => ({
            label: code.label || "Solution",
            language: code.language || "JavaScript",
            snippet: code.snippet || "",
          }))
        : [defaultCode];

    setTitle(initialTopic?.title || "");
    setCategory(initialTopic?.category || "General");
    setDescription(initialTopic?.description || "");
    setCodes(initialCodes);
    setExpandedCodes(initialCodes.map(() => false));
  }, [initialTopic]);

  const handleCodeChange = (index, field, value) => {
    setCodes((current) =>
      current.map((code, idx) =>
        idx === index ? { ...code, [field]: value } : code,
      ),
    );
  };

  const addCodeEntry = () => {
    setCodes((current) => [
      ...current,
      {
        label: `Solution ${current.length + 1}`,
        language: "JavaScript",
        snippet: "",
      },
    ]);
    setExpandedCodes((current) => [...current, false]);
  };

  const removeCodeEntry = (index) => {
    setCodes((current) => current.filter((_, idx) => idx !== index));
    setExpandedCodes((current) => current.filter((_, idx) => idx !== index));
  };

  const toggleCodeExpanded = (index) => {
    setExpandedCodes((current) =>
      current.map((expanded, idx) => (idx === index ? !expanded : expanded)),
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      id: initialTopic?._id,
      title,
      category,
      description,
      codes,
    });
  };

  return (
    <form
      data-component="TopicForm"
      onSubmit={handleSubmit}
      className="space-y-8 rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-100">
            {initialTopic ? "Edit Topic" : "Add New Topic"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {initialTopic
              ? "Update the topic notes, category, or code solutions."
              : "Create a new study topic with theory and code examples."}
          </p>
        </div>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-3xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            Cancel
          </button>
        ) : null}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
          Topic title
        </label>
        <input
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g., React hooks, Graph theory"
          className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
          Topic group
        </label>
        <input
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="e.g., JavaScript, React, Algorithms"
          className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
          Theory / notes
        </label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Write the concept explanation or formula notes here."
          rows={6}
          className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Code solutions
          </h3>
          <button
            type="button"
            onClick={addCodeEntry}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add another code
          </button>
        </div>

        <div className="space-y-5">
          {codes.map((code, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-slate-200/90 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
            >
              <button
                type="button"
                onClick={() => toggleCodeExpanded(index)}
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left font-semibold text-slate-900 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <span>{code.label}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {expandedCodes[index] ? "Collapse" : "Expand"}
                </span>
              </button>

              {expandedCodes[index] ? (
                <div className="space-y-3 border-t border-slate-200/90 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <label className="font-semibold text-slate-900 dark:text-slate-100">
                      Code details
                    </label>
                    <button
                      type="button"
                      onClick={() => removeCodeEntry(index)}
                      className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    value={code.label}
                    onChange={(event) =>
                      handleCodeChange(index, "label", event.target.value)
                    }
                    placeholder="Solution title"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                  <input
                    value={code.language}
                    onChange={(event) =>
                      handleCodeChange(index, "language", event.target.value)
                    }
                    placeholder="Language (e.g., JavaScript, Python)"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                  <textarea
                    value={code.snippet}
                    onChange={(event) =>
                      handleCodeChange(index, "snippet", event.target.value)
                    }
                    placeholder="Paste the code snippet here."
                    rows={5}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        {submitLabel}
      </button>
    </form>
  );
}
