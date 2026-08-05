export default function MobileHeader() {
  return (
    <div className="flex items-center justify-between rounded-[2rem] border border-slate-800/80 bg-slate-950/95 p-4 text-slate-200 shadow-2xl shadow-slate-950/40 lg:hidden">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          StudyFlow
        </p>
        <p className="text-lg font-semibold text-white">Welcome back, Ankit!</p>
      </div>
      <button className="rounded-3xl bg-slate-800 px-3 py-2 text-sm text-white transition hover:bg-slate-700">
        Add
      </button>
    </div>
  );
}
