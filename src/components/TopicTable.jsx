import { Fragment, memo, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getCategoryColor } from "@/lib/categoryColor";

function TopicTable({
  topics,
  selectedTopic,
  onTopicSelect,
  onEditTopic,
  onDeleteTopic,
  onAddTopicToGroup,
  mutatingId,
  mobileDetailAnchor,
  mobileDetailNode,
}) {
  const [openCategories, setOpenCategories] = useState({});

  useEffect(() => {
    // Auto-expand whichever category currently needs to be visible: the
    // selected topic's category, or — when adding a brand-new topic to a
    // category that has no topics selected yet — that category directly,
    // so the inline mobile form has somewhere to appear.
    const categoryToOpen =
      mobileDetailAnchor?.type === "category"
        ? mobileDetailAnchor.id
        : selectedTopic?.category?.trim() || null;

    if (!categoryToOpen) return;

    setOpenCategories((current) => {
      if (current[categoryToOpen]) return current;
      return { ...current, [categoryToOpen]: true };
    });
  }, [selectedTopic, mobileDetailAnchor]);

  useEffect(() => {
    // Bring the inline mobile detail panel into view once it renders,
    // so tapping a topic on mobile doesn't leave the person staring at
    // the still-scrolled-away top of the topic list.
    if (!mobileDetailAnchor || typeof window === "undefined") return;
    if (window.innerWidth >= 1280) return; // xl breakpoint — desktop layout doesn't need this

    const id =
      mobileDetailAnchor.type === "topic"
        ? `topic-detail-mobile-${mobileDetailAnchor.id}`
        : `topic-detail-mobile-${mobileDetailAnchor.id}`;

    const raf = requestAnimationFrame(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    return () => cancelAnimationFrame(raf);
  }, [mobileDetailAnchor]);

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

  if (!topics || topics.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-[#0B0F1F]/70 p-10 text-center text-[#94A3B8]">
        No topics created yet. Add one to start organizing your study groups.
      </div>
    );
  }

  return (
    <div data-component="TopicTable" className="space-y-4">
      {categoryKeys.map((category) => {
        const color = getCategoryColor(category);
        const isOpen = Boolean(openCategories[category]);
        // Show the inline mobile add-form right under this category's
        // header when a brand-new topic is being created for it (i.e.
        // there's no specific existing topic row to anchor to).
        const showCategoryLevelDetail =
          isOpen &&
          mobileDetailAnchor?.type === "category" &&
          mobileDetailAnchor.id === category;

        return (
          <section
            key={category}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F1F]/95 shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition"
          >
            <div className="flex w-full items-center justify-between gap-3 px-4 py-3">
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                className="flex flex-1 items-center gap-3 text-left"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-base font-semibold text-white">
                  {category}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${color.border} ${color.bg} ${color.text}`}
                >
                  {groupedTopics[category].length} topic
                  {groupedTopics[category].length === 1 ? "" : "s"}
                </span>
                <span className="ml-auto text-lg text-[#94A3B8]">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onAddTopicToGroup?.(category)}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold text-slate-100 transition hover:border-[#22D3EE]/40 hover:text-[#22D3EE]"
              >
                + Add topic
              </button>
            </div>

            {isOpen ? (
              <div className="px-4 pb-4">
                {showCategoryLevelDetail ? (
                  <div id={`topic-detail-mobile-${category}`} className="mb-4 xl:hidden">
                    {mobileDetailNode}
                  </div>
                ) : null}
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0F1425] text-sm">
                  <table className="min-w-full border-separate border-spacing-0 text-left">
                    <thead className="text-[#94A3B8]">
                      <tr>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                          Topic
                        </th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                          Notes
                        </th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                          Updated
                        </th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedTopics[category].map((topic) => {
                        const isMutating = mutatingId === topic._id;
                        const showInlineDetail =
                          mobileDetailAnchor?.type === "topic" &&
                          mobileDetailAnchor.id === topic._id;

                        return (
                          <Fragment key={String(topic._id)}>
                            <tr
                              className={`cursor-pointer border-t border-white/5 transition hover:bg-white/5 ${
                                showInlineDetail ? "xl:bg-transparent bg-white/5" : ""
                              }`}
                              onClick={() => onTopicSelect?.(topic)}
                            >
                              <td className="px-5 py-4 align-top">
                                <div className="flex items-center gap-2 text-base font-semibold text-white">
                                  {topic.title}
                                  {isMutating ? (
                                    <span
                                      className="inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-white/20 border-t-[#6366F1]"
                                      title="Saving..."
                                      aria-label="Saving"
                                    />
                                  ) : null}
                                </div>
                                <div className="mt-1 text-xs text-[#94A3B8]">
                                  {isMutating
                                    ? "Saving..."
                                    : topic.notes?.trim()
                                      ? "Notes ready"
                                      : "No notes yet"}
                                </div>
                              </td>
                              <td className="px-5 py-4 align-top text-sm">
                                {topic.notes?.trim() ? (
                                  <span className="inline-flex items-center rounded-full border border-[#34D399]/30 bg-[#34D399]/10 px-2.5 py-1 text-xs font-semibold text-[#34D399]">
                                    View in detail
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-2.5 py-1 text-xs font-semibold text-[#F59E0B]">
                                    Missing
                                  </span>
                                )}
                              </td>
                              <td className="px-5 py-4 align-top text-sm text-[#94A3B8]">
                                {topic.updatedAt
                                  ? new Date(topic.updatedAt).toLocaleDateString()
                                  : "—"}
                              </td>
                              <td className="px-5 py-4 align-top text-sm">
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      onEditTopic?.(topic);
                                    }}
                                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      onDeleteTopic?.(topic);
                                    }}
                                    disabled={isMutating}
                                    className="rounded-full border border-rose-500 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    Delete
                                  </button>
                                  <Link
                                    href={`/topics/${topic._id}`}
                                    onClick={(event) => event.stopPropagation()}
                                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
                                  >
                                    Open route
                                  </Link>
                                </div>
                              </td>
                            </tr>
                            {showInlineDetail ? (
                              <tr className="xl:hidden">
                                <td colSpan={4} className="bg-transparent px-0 py-3">
                                  <div id={`topic-detail-mobile-${topic._id}`}>
                                    {mobileDetailNode}
                                  </div>
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
        );
      })}
    </div>
  );
}

export default memo(TopicTable);
