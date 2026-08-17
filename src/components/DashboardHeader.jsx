import SectionCard from "./ui/SectionCard";

export default function DashboardHeader({ stats = {} }) {
  const { topicsAdded = 0, notesCreated = 0, overallProgress = 0 } = stats;

  const summaryItems = [
    { label: "Topics", value: topicsAdded, tone: "primary" },
    { label: "Notes", value: notesCreated, tone: "secondary" },
  ];

  return (
    <SectionCard
      title="Dashboard overview"
      description="Your developer study workspace in one view, with focus on notes and topic progress."
      className="p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="rounded-[16px] border border-white/10 bg-[#0F172A] p-3.5 transition hover:border-[#6366F1]/40"
          >
            <p className="text-[9px] uppercase tracking-[0.28em] text-[#94A3B8]">
              {item.label}
            </p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {item.value}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#22D3EE]"
                style={{ width: `${Math.min(item.value * 10, 100)}%` }}
              />
            </div>
          </div>
        ))}

        <div className="rounded-[16px] border border-white/10 bg-[#0F172A] p-3.5">
          <div className="flex items-center justify-between gap-3 text-[9px] uppercase tracking-[0.28em] text-[#94A3B8]">
            <span>Activation</span>
            <span className="rounded-full bg-white/5 px-2 py-1 text-[9px] text-[#94A3B8]">
              Live
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-white">
            {overallProgress}%
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#22D3EE] to-[#6366F1]"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
