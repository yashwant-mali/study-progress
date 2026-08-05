export default function DashboardHeader({ stats = {} }) {
  const {
    topicsAdded = 0,
    notesCreated = 0,
    codeSolutions = 0,
    overallProgress = 0,
  } = stats;

  const summaryItems = [
    { label: "Topics", value: topicsAdded },
    { label: "Notes", value: notesCreated },
    { label: "Solutions", value: codeSolutions },
  ];

  return (
    <header className="rounded-[2rem] border border-slate-800/80 bg-slate-950/95 p-5 text-slate-100 shadow-2xl shadow-slate-950/40">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Study progress
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            Dashboard overview
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Manage topics, review code examples, and open focused study routes.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-3">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-slate-800/80 bg-slate-900 p-4 text-center shadow-inner shadow-slate-950/20"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-3 text-xl font-semibold text-white">
                {item.value}
              </p>
            </div>
          ))}
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900 p-4 text-center shadow-inner shadow-slate-950/20">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Progress
            </p>
            <p className="mt-3 text-xl font-semibold text-white">
              {overallProgress}%
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
