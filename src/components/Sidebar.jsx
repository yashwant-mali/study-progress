export default function Sidebar({ categories, isMobileOpen, onClose }) {
  const sidebarContent = (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold text-white shadow-lg shadow-violet-500/20">
            SF
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              StudyFlow
            </p>
            <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          </div>
        </div>
      </div>

      <nav className="space-y-4 text-sm text-slate-300">
        <div className="rounded-3xl bg-slate-900/80 p-4 text-slate-100 shadow-inner shadow-slate-950/20">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Study
          </p>
          <ul className="mt-4 space-y-3">
            <li className="rounded-2xl bg-slate-800 px-4 py-3 text-slate-100 shadow-sm">
              Topics
            </li>
            <li className="rounded-2xl px-4 py-3 transition hover:bg-slate-800">
              <a href="/notes">All Notes</a>
            </li>
            <li className="rounded-2xl px-4 py-3 transition hover:bg-slate-800">
              <a href="/solutions">Code Solutions</a>
            </li>
            <li className="rounded-2xl px-4 py-3 transition hover:bg-slate-800">
              Bookmarks
            </li>
          </ul>
        </div>

        <div className="rounded-3xl bg-slate-900/80 p-4 text-slate-100 shadow-inner shadow-slate-950/20">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
            <span>Collections</span>
            <button
              type="button"
              className="text-slate-400 transition hover:text-white"
            >
              +
            </button>
          </div>
          <ul className="mt-4 space-y-3">
            {categories.slice(0, 5).map((category) => (
              <li
                key={category}
                className="rounded-2xl px-3 py-2 transition hover:bg-slate-800"
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mt-auto rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-slate-200 shadow-xl shadow-slate-950/30">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Study streak
        </p>
        <p className="mt-3 text-3xl font-semibold">12</p>
        <p className="mt-2 text-sm text-slate-400">Keep it up!</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
        </div>
      </div>
    </>
  );

  return (
    <>
      {isMobileOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-start bg-slate-950/80 p-4 lg:hidden">
          <aside className="relative h-full w-full max-w-[280px] rounded-[2rem] border border-slate-800/80 bg-slate-950/95 p-6 text-slate-200 shadow-2xl shadow-slate-950/40">
            <button
              type="button"
              onClick={onClose}
              className="mb-4 inline-flex items-center gap-2 rounded-3xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
            >
              Close
            </button>
            {sidebarContent}
          </aside>
        </div>
      ) : null}

      <aside className="hidden h-full w-full max-w-[260px] flex-col gap-6 rounded-[2rem] border border-slate-800/80 bg-slate-950/95 p-6 text-slate-200 shadow-2xl shadow-slate-950/40 lg:flex">
        {sidebarContent}
      </aside>
    </>
  );
}
