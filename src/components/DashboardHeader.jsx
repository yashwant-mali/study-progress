import { memo } from "react";
import SectionCard from "./ui/SectionCard";

function DashboardHeader({ stats = {} }) {
  const { topicsAdded = 0, notesCreated = 0, overallProgress = 0 } = stats;

  const summaryItems = [
    { label: "Topics", value: topicsAdded, tone: "primary" },
    { label: "Notes", value: notesCreated, tone: "secondary" },
  ];

  return (
    <SectionCard
      title="Dashboard overview"
      description="Your Metrix here"
      className="p-4"
    >
      <div className="grid grid-cols-2 gap-2">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-white/10 bg-[#0F172A] px-3 py-2 transition hover:border-[#6366F1]/40"
          >
            <p className="text-[8px] uppercase tracking-[0.2em] text-[#94A3B8]">
              {item.label}
            </p>

            <div className="mt-1.5 flex items-center justify-between gap-2">
              <p className="text-lg font-semibold text-white">{item.value}</p>

              <div className="h-1 w-16 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#22D3EE]"
                  style={{
                    width: `${Math.min(item.value * 10, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="rounded-lg border border-white/10 bg-[#0F172A] px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[8px] uppercase tracking-[0.2em] text-[#94A3B8]">
              Activation
            </p>

            <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[7px] text-[#94A3B8]">
              Live
            </span>
          </div>

          <div className="mt-1.5 flex items-center justify-between gap-2">
            <p className="text-lg font-semibold text-white">
              {overallProgress}%
            </p>

            <div className="h-1 w-16 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#22D3EE] to-[#6366F1]"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

export default memo(DashboardHeader);
