import { memo } from "react";

function MobileHeader({ onOpenMenu, isMenuOpen = false }) {
  return (
    <div data-component="MobileHeader" className="lg:hidden">
      <div className="flex items-center justify-between rounded-[2rem] border border-white/10 bg-[#0B0F1F]/95 p-4 text-slate-200 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-[12px] bg-gradient-to-br from-[#6366F1] to-[#22D3EE] text-sm font-bold text-white">
            SF
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              StudyFlow
            </p>
            <p className="text-lg font-semibold text-white">
              Study dashboard
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-sidebar-menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
        >
          <span className="flex h-5 w-5 flex-col justify-between">
            <span className="block h-0.5 w-full rounded-full bg-slate-100" />
            <span className="block h-0.5 w-full rounded-full bg-slate-100" />
            <span className="block h-0.5 w-full rounded-full bg-slate-100" />
          </span>
        </button>
      </div>
    </div>
  );
}

export default memo(MobileHeader);
