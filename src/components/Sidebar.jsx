"use client";

import Link from "next/link";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import DashboardHeader from "./DashboardHeader";
import QuickActions from "./QuickActions";
import { getCategoryColor } from "@/lib/categoryColor";
import { useRouter } from "next/navigation";

function Sidebar({
  categories,
  isMobileOpen,
  onClose,
  stats,
  onAddNewTopic,
  onImportNotes,
  onFocusSearch,
}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  const navigation = [
    { label: "Topics", href: "/", active: true },
    { label: "All Notes", href: "/notes" },
  ];

  const collectionItems = categories
    .filter((category) => category !== "All")
    .slice(0, 5);
  const streak = stats?.streak ?? 0;
  const streakWidth = Math.min(streak * 12, 100);

  // On mobile, quick actions should also close the slide-in menu so the
  // form/panel that opens underneath is actually visible. On desktop
  // `onClose` just flips `isMobileMenuOpen` to false (it's already false
  // there), so this is a no-op and doesn't change desktop behavior at all.
  const handleAddNewTopic = (...args) => {
    onClose?.();
    onAddNewTopic?.(...args);
  };
  const handleImportNotes = (...args) => {
    onClose?.();
    onImportNotes?.(...args);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col gap-6">
      {/* <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-[18px] bg-gradient-to-br from-[#6366F1] to-[#22D3EE] text-lg font-bold text-white shadow-[0_18px_40px_rgba(99,102,241,0.35)]">
            SF
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#94A3B8]">
              StudyFlow
            </p>
            <h1 className="text-xl font-semibold text-[#F8FAFC]">Dashboard</h1>
          </div>
        </div>
      </div> */}

      <div className="rounded-[20px] border border-white/14 bg-[#111827] p-4">
        <div className="flex flex-col gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name || user?.email}
            </p>
            <p className="truncate text-xs text-[#94A3B8]">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await dispatch(logout()).unwrap();
              router.replace("/login");
            }}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <QuickActions
          onAddNewTopic={handleAddNewTopic}
          onImportNotes={handleImportNotes}
          onFocusSearch={onFocusSearch}
        />
        <DashboardHeader stats={stats || {}} />
      </div>

      <nav className="space-y-5 text-sm text-[#E2E8F0]">
        <div className="rounded-[20px] border border-white/14 bg-[#111827] p-4 shadow-[0_24px_50px_rgba(0,0,0,0.18)]">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#94A3B8]">
            Workspace
          </p>
          <ul className="mt-4 space-y-2">
            {navigation.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center justify-between rounded-[16px] px-4 py-3 transition ${
                    item.active
                      ? "bg-gradient-to-r from-[#6366F1]/25 to-[#22D3EE]/10 text-white"
                      : "text-[#E2E8F0] hover:bg-white/5"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.active ? (
                    <span className="h-2 w-2 rounded-full bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* <div className="rounded-[20px] border border-white/14 bg-[#111827] p-4 shadow-[0_24px_50px_rgba(0,0,0,0.18)]">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-[#94A3B8]">
            <span>Collections</span>
            <span className="rounded-full border border-white/10 px-2 py-1 text-[#E2E8F0]">
              {collectionItems.length}
            </span>
          </div>
          <ul className="mt-4 space-y-2">
            {collectionItems.length ? (
              collectionItems.map((category) => {
                const color = getCategoryColor(category);
                return (
                  <li key={category}>
                    <span className="flex w-full items-center justify-between rounded-[16px] px-4 py-3 text-left text-sm text-[#E2E8F0] transition hover:bg-white/5">
                      <span className="flex items-center gap-2.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: color.hex }}
                        />
                        {category}
                      </span>
                    </span>
                  </li>
                );
              })
            ) : (
              <li className="rounded-[16px] bg-white/5 px-4 py-3 text-sm text-[#94A3B8]">
                No collections yet.
              </li>
            )}
          </ul>
        </div> */}
      </nav>

      <div className="mt-auto rounded-[20px] border border-white/14 bg-gradient-to-b from-[#111827] to-[#0F172A] p-5 shadow-[0_24px_50px_rgba(0,0,0,0.18)]">
        <p className="text-[11px] uppercase tracking-[0.35em] text-[#94A3B8]">
          Study streak
        </p>
        <p className="mt-3 text-3xl font-semibold text-white">
          {streak} {streak === 1 ? "day" : "days"}
        </p>
        <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
          {streak > 0
            ? "Consecutive days with a topic added or updated."
            : "Add or update a topic today to start your streak."}
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#22D3EE] transition-all"
            style={{ width: `${streakWidth}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div data-component="Sidebar">
      {isMobileOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-start bg-[#040B1E]/90 p-4 lg:hidden"
          onClick={onClose}
          role="presentation"
        >
          <aside
            id="mobile-sidebar-menu"
            onClick={(event) => event.stopPropagation()}
            className="relative h-full w-full max-w-[280px] overflow-y-auto rounded-[24px] border border-white/10 bg-[#070B16]/95 p-5 text-[#E2E8F0] shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
          >
            <button
              type="button"
              onClick={onClose}
              className="mb-4 inline-flex items-center gap-2 rounded-[18px] border border-white/10 bg-[#111827] px-4 py-2 text-sm text-[#E2E8F0] transition hover:bg-white/5"
            >
              Close
            </button>
            {sidebarContent}
          </aside>
        </div>
      ) : null}

      <aside className="hidden h-full w-full max-w-[280px] flex-col gap-6 rounded-[24px] border border-white/10 bg-[#070B16]/95 p-6 shadow-[0_40px_80px_rgba(0,0,0,0.35)] lg:flex">
        {sidebarContent}
      </aside>
    </div>
  );
}

export default memo(Sidebar);
