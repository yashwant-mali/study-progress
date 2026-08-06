export default function QuickActions({
  onAddNewTopic,
  onImportNotes,
  onNewCodeSolution,
  onGenerateCheatsheet,
  hasSelectedTopic,
}) {
  return (
    <div data-component="QuickActions">
      <aside className="space-y-5 rounded-[2rem] border border-slate-800/80 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/40">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Quick Actions
              </h2>
              <p className="text-sm text-slate-400">
                Fast access to key study tasks and workflows.
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <button
            type="button"
            onClick={onAddNewTopic}
            className="w-full rounded-3xl bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/10 transition hover:opacity-90"
          >
            + Add New Topic
          </button>
          <button
            type="button"
            onClick={onImportNotes}
            className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Import Notes
          </button>
          <button
            type="button"
            onClick={onNewCodeSolution}
            className={`w-full rounded-3xl px-4 py-3 text-sm font-semibold transition ${hasSelectedTopic ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "cursor-not-allowed bg-slate-800/70 text-slate-500"}`}
            disabled={!hasSelectedTopic}
          >
            New Code Solution
          </button>
          <button
            type="button"
            onClick={onGenerateCheatsheet}
            className={`w-full rounded-3xl px-4 py-3 text-sm font-semibold transition ${hasSelectedTopic ? "bg-slate-900 text-slate-200 hover:bg-slate-800" : "cursor-not-allowed bg-slate-800/70 text-slate-500"}`}
            disabled={!hasSelectedTopic}
          >
            Generate Cheatsheet
          </button>
        </div>
      </aside>
    </div>
  );
}
