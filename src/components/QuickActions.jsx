export default function QuickActions({
  onAddNewTopic,
  onImportNotes,
  onNewCodeSolution,
  onGenerateCheatsheet,
  hasSelectedTopic,
}) {
  return (
    <aside className="space-y-4 rounded-[2rem] border border-slate-800/80 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/40">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
      </div>
      <div className="space-y-3">
        <button
          type="button"
          onClick={onAddNewTopic}
          className="w-full rounded-3xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          + Add New Topic
        </button>
        <button
          type="button"
          onClick={onImportNotes}
          className="w-full rounded-3xl border border-slate-800/70 bg-slate-900 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800"
        >
          Import Notes
        </button>
        <button
          type="button"
          onClick={onNewCodeSolution}
          className="w-full rounded-3xl border border-slate-800/70 bg-slate-900 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800"
          disabled={!hasSelectedTopic}
        >
          New Code Solution
        </button>
        <button
          type="button"
          onClick={onGenerateCheatsheet}
          className="w-full rounded-3xl border border-slate-800/70 bg-slate-900 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800"
          disabled={!hasSelectedTopic}
        >
          Generate Cheatsheet
        </button>
      </div>
    </aside>
  );
}
