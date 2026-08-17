export default function QuickActions({ onAddNewTopic, onImportNotes, onFocusSearch }) {
  return (
    <aside className="rounded-[24px] border border-white/10 bg-[#111827]/95 p-5 shadow-[0_24px_50px_rgba(0,0,0,0.18)] backdrop-blur-sm">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#94A3B8]">
            Quick actions
          </p>
          <h2 className="mt-3 text-[2rem] font-semibold leading-none text-white">
            Workflow shortcuts
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
            Create topic notes, import collections, and keep each study topic
            focused in one place.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onAddNewTopic}
            className="inline-flex items-center justify-center rounded-[18px] bg-gradient-to-r from-[#6366F1] to-[#4F46E5] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(99,102,241,0.35)] transition hover:from-[#4F46E5] hover:to-[#4338CA]"
          >
            + Add topic
          </button>
          <button
            type="button"
            onClick={onImportNotes}
            className="inline-flex items-center justify-center rounded-[18px] border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-4 py-3 text-sm font-semibold text-[#67e8f9] transition hover:bg-[#22D3EE]/20"
          >
            Import notes
          </button>
        </div>

        <div className="pt-1">
          <button
            type="button"
            onClick={onFocusSearch}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] border border-white/10 bg-[#0f172a] px-4 py-3 text-sm font-medium text-[#e2e8f0] transition hover:bg-[#172033]"
          >
            <span className="text-base">⌘</span>
            <span>Jump to search</span>
            <span className="ml-auto rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-[#94A3B8]">
              ⌘K
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
