import IconButton from "./ui/IconButton";

export default function QuickActions({
  onAddNewTopic,
  onImportNotes,
  onNewCodeSolution,
  onGenerateCheatsheet,
  hasSelectedTopic,
}) {
  return (
    <aside className="rounded-[20px] border border-white/14 bg-[#111827]/95 p-5 shadow-[0_30px_60px_rgba(0,0,0,0.22)]">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#94A3B8]">
            Quick actions
          </p>
          <h2 className="mt-3 text-xl font-semibold text-white">
            Workflow shortcuts
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
            Launch study tasks, import notes, and generate summaries with one
            click.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onAddNewTopic}
            className="inline-flex items-center justify-center rounded-[18px] bg-[#3B82F6] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
          >
            + Add topic
          </button>
          <button
            type="button"
            onClick={onImportNotes}
            className="inline-flex items-center justify-center rounded-[18px] border border-white/14 bg-white/5 px-4 py-3 text-sm font-semibold text-[#F8FAFC] transition hover:bg-white/10"
          >
            Import notes
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onNewCodeSolution}
            disabled={!hasSelectedTopic}
            className={`inline-flex items-center justify-center rounded-[18px] px-4 py-3 text-sm font-semibold transition ${
              hasSelectedTopic
                ? "bg-white/5 text-[#F8FAFC] hover:bg-white/10"
                : "cursor-not-allowed bg-white/5/50 text-[#94A3B8]"
            }`}
          >
            New code solution
          </button>
          <button
            type="button"
            onClick={onGenerateCheatsheet}
            disabled={!hasSelectedTopic}
            className={`inline-flex items-center justify-center rounded-[18px] px-4 py-3 text-sm font-semibold transition ${
              hasSelectedTopic
                ? "bg-white/5 text-[#F8FAFC] hover:bg-white/10"
                : "cursor-not-allowed bg-white/5/50 text-[#94A3B8]"
            }`}
          >
            Generate summary
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <IconButton
            icon={<span className="text-lg">⌘</span>}
            label="Command palette"
            onClick={() => alert("Use ⌘K to open the command palette.")}
            className="w-full justify-center text-white"
          />
        </div>
      </div>
    </aside>
  );
}
