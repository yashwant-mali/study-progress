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
    <header className="rounded-[2rem] border border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-6 text-slate-100 shadow-2xl shadow-slate-950/40">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <span className="inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-300">
            Study progress
          </span>
          <div>
            <h1 className="text-3xl font-semibold text-white">
              Dashboard overview
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Manage topics, review code examples, and open focused study routes
              with clear progress insights.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryItems.map((item, index) => (
            <div
              key={item.label}
              className="rounded-[1.8rem] border border-slate-800/80 bg-slate-900 p-5 text-center shadow-inner shadow-slate-950/20"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500" />
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {item.label}
                </p>
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">
                {item.value}
              </p>
            </div>
          ))}

          <div className="rounded-[1.8rem] border border-slate-800/80 bg-slate-900 p-5 shadow-inner shadow-slate-950/20">
            <div className="flex items-center justify-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Progress
              </p>
            </div>
            <p className="mt-4 text-3xl font-semibold text-white">
              {overallProgress}%
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
