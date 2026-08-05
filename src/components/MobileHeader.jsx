export default function MobileHeader({ onOpenMenu }) {
  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between rounded-[2rem] border border-slate-800/80 bg-slate-950/95 p-4 text-slate-200 shadow-2xl shadow-slate-950/40">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            StudyFlow
          </p>
          <p className="text-lg font-semibold text-white">
            Welcome back, Ankit!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-3xl bg-slate-800 px-3 py-2 text-sm text-white transition hover:bg-slate-700">
            Add
          </button>
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-3xl border border-slate-700 bg-slate-800 text-white transition hover:bg-slate-700"
          >
            <span className="flex h-5 w-5 flex-col justify-between">
              <span className="block h-0.5 w-full rounded-full bg-slate-100" />
              <span className="block h-0.5 w-full rounded-full bg-slate-100" />
              <span className="block h-0.5 w-full rounded-full bg-slate-100" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
