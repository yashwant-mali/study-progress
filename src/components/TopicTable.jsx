import { Fragment, useMemo, useState } from "react";
import Link from "next/link";

export default function TopicTable({
  topics,
  onOpenCode,
  onTopicSelect,
  onEditTopic,
  onDeleteTopic,
}) {
  const [openCategories, setOpenCategories] = useState({});
  const [activeTheory, setActiveTheory] = useState(null);
  const [activeSolutions, setActiveSolutions] = useState(null);

  const groupedTopics = useMemo(() => {
    return topics.reduce((acc, topic) => {
      const group = topic.category?.trim() || "General";
      if (!acc[group]) acc[group] = [];
      acc[group].push(topic);
      return acc;
    }, {});
  }, [topics]);

  const categoryKeys = Object.keys(groupedTopics);

  const toggleCategory = (category) => {
    setOpenCategories((current) => ({
      ...current,
      [category]: !current[category],
    }));
  };

  const toggleTheory = (id) => {
    setActiveTheory((current) => (current === id ? null : id));
  };

  const toggleSolutions = (id) => {
    setActiveSolutions((current) => (current === id ? null : id));
  };

  if (!topics || topics.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300/80 bg-slate-50 p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        No topics created yet. Add one to start organizing your study groups.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categoryKeys.map((category) => (
        <section
          key={category}
          className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition dark:border-slate-800 dark:bg-slate-950"
        >
          <button
            type="button"
            onClick={() => toggleCategory(category)}
            className="flex w-full items-center justify-between gap-4 rounded-3xl bg-slate-100 px-6 py-4 text-left text-lg font-semibold text-slate-900 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-100"
          >
            <span>{category}</span>
            <span className="rounded-full bg-slate-950 px-3 py-1 text-sm font-semibold text-white dark:bg-slate-200 dark:text-slate-950">
              {groupedTopics[category].length} topic
              {groupedTopics[category].length === 1 ? "" : "s"}
            </span>
          </button>

          {openCategories[category] ? (
            <div className="px-4 py-4 sm:px-6">
              <div className="overflow-x-auto rounded-3xl border border-slate-200/80 bg-slate-50 text-sm shadow-inner dark:border-slate-800 dark:bg-slate-900">
                <table className="min-w-full border-separate border-spacing-0 text-left">
                  <thead className="bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                    <tr>
                      <th className="px-5 py-4 font-medium">Topic</th>
                      <th className="px-5 py-4 font-medium">Theory</th>
                      <th className="px-5 py-4 font-medium">Solutions</th>
                      <th className="px-5 py-4 font-medium">Updated</th>
                      <th className="px-5 py-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedTopics[category].map((topic) => {
                      const isTheoryOpen = activeTheory === String(topic._id);
                      const isSolutionsOpen =
                        activeSolutions === String(topic._id);
                      return (
                        <Fragment key={String(topic._id)}>
                          <tr
                            className="cursor-pointer border-t border-slate-200/80 even:bg-white odd:bg-slate-50 transition hover:bg-slate-100 dark:border-slate-800 dark:even:bg-slate-950 dark:odd:bg-slate-900 dark:hover:bg-slate-800"
                            onClick={() => onTopicSelect?.(topic)}
                          >
                            <td className="px-5 py-4 align-top">
                              <div className="text-base font-semibold text-slate-950 dark:text-white">
                                {topic.title}
                              </div>
                              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {topic.codes?.length ?? 0} code example
                                {topic.codes?.length === 1 ? "" : "s"}
                              </div>
                            </td>
                            <td className="px-5 py-4 align-top">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleTheory(String(topic._id));
                                }}
                                className="rounded-full border border-sky-500 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-500/20 dark:border-sky-400/30 dark:text-sky-300"
                              >
                                {isTheoryOpen ? "Hide theory" : "View theory"}
                              </button>
                            </td>
                            <td className="px-5 py-4 align-top">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleSolutions(String(topic._id));
                                }}
                                className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950"
                              >
                                Solutions ({topic.codes?.length ?? 0})
                              </button>
                            </td>
                            <td className="px-5 py-4 align-top text-sm text-slate-500 dark:text-slate-400">
                              {topic.updatedAt
                                ? new Date(topic.updatedAt).toLocaleDateString()
                                : "—"}
                            </td>
                            <td className="px-5 py-4 align-top text-sm text-slate-500 dark:text-slate-400">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    onEditTopic?.(topic);
                                  }}
                                  className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    onDeleteTopic?.(topic);
                                  }}
                                  className="rounded-full border border-rose-500 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20"
                                >
                                  Delete
                                </button>
                                <Link
                                  href={`/topics/${topic._id}`}
                                  onClick={(event) => event.stopPropagation()}
                                  className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                                >
                                  Open route
                                </Link>
                              </div>
                            </td>
                          </tr>
                          {isTheoryOpen ? (
                            <tr
                              key={`${topic._id}-theory`}
                              className="bg-slate-50 dark:bg-slate-900"
                            >
                              <td className="px-5 py-4" colSpan={4}>
                                <div className="rounded-3xl border border-slate-200/90 bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                                  {topic.description ||
                                    "No theory notes yet for this topic."}
                                </div>
                              </td>
                            </tr>
                          ) : null}
                          {isSolutionsOpen ? (
                            <tr
                              key={`${topic._id}-solutions`}
                              className="bg-white dark:bg-slate-950"
                            >
                              <td className="px-5 py-4" colSpan={4}>
                                {topic.codes && topic.codes.length > 0 ? (
                                  <div className="grid gap-3">
                                    {topic.codes.map((code) => (
                                      <button
                                        key={code.label}
                                        type="button"
                                        onClick={() => onOpenCode(topic, code)}
                                        className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-left text-sm text-slate-900 transition hover:border-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                                      >
                                        <div className="font-semibold">
                                          {code.label}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                          {code.language}
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="rounded-3xl border border-slate-200/90 bg-slate-50 px-4 py-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                                    No code examples are added yet for this
                                    topic.
                                  </div>
                                )}
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}
