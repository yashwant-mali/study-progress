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
      className="space-y-8 rounded-[24px] border border-white/10 bg-[#111827]/95 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.24)]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            {initialTopic ? "Edit Topic" : "Add New Topic"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
            {initialTopic
              ? "Update the topic notes, category, or code solutions."
              : "Create a new study topic with theory and code examples."}
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
          placeholder="e.g., React hooks, Graph theory"
          className="w-full rounded-[18px] border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
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
          className="w-full rounded-[18px] border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-white">
          Theory / notes
        </label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Write the concept explanation or formula notes here."
          rows={6}
          className="w-full rounded-[18px] border border-white/10 bg-[#0F172A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
        />
      </div>

      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Code solutions</h3>
            <p className="text-sm leading-6 text-[#94A3B8]">
              Add code examples that support each topic and review them later.
            </p>
          </div>
          <button
            type="button"
            onClick={addCodeEntry}
            className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[#F8FAFC] transition hover:bg-white/10"
          >
            Add solution
          </button>
        </div>

        <div className="space-y-4">
          {codes.map((code, index) => (
            <div
              key={index}
              className="rounded-[20px] border border-white/10 bg-[#0F172A]"
            >
              <button
                type="button"
                onClick={() => toggleCodeExpanded(index)}
                className="flex w-full items-center justify-between rounded-[20px] px-4 py-4 text-left font-semibold text-white transition hover:bg-white/5"
              >
                <span>{code.label}</span>
                <span className="text-sm text-[#94A3B8]">
                  {expandedCodes[index] ? "Collapse" : "Expand"}
                </span>
              </button>

              {expandedCodes[index] ? (
                <div className="space-y-4 border-t border-white/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">
                      Code details
                    </p>
                    <button
                      type="button"
                      onClick={() => removeCodeEntry(index)}
                      className="rounded-[18px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#F8FAFC] transition hover:bg-white/10"
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
                    className="w-full rounded-[18px] border border-white/10 bg-[#111827] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
                  />
                  <input
                    value={code.language}
                    onChange={(event) =>
                      handleCodeChange(index, "language", event.target.value)
                    }
                    placeholder="Language (e.g., JavaScript, Python)"
                    className="w-full rounded-[18px] border border-white/10 bg-[#111827] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
                  />
                  <textarea
                    value={code.snippet}
                    onChange={(event) =>
                      handleCodeChange(index, "snippet", event.target.value)
                    }
                    placeholder="Paste the code snippet here."
                    rows={5}
                    className="w-full rounded-[18px] border border-white/10 bg-[#111827] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-[20px] bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
      >
        {submitLabel}
      </button>
    </form>
  );
}
