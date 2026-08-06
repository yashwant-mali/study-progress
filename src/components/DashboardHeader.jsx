import SectionCard from "./ui/SectionCard";

export default function DashboardHeader({ stats = {} }) {
  const {
    topicsAdded = 0,
    notesCreated = 0,
    codeSolutions = 0,
    overallProgress = 0,
  } = stats;

  const summaryItems = [
    { label: "Topics", value: topicsAdded, tone: "primary" },
    { label: "Notes", value: notesCreated, tone: "secondary" },
    { label: "Solutions", value: codeSolutions, tone: "success" },
  ];

  return (
    <SectionCard
      title="Dashboard overview"
      description="Your developer study workspace in one view, with progress summaries and focus signals."
      className="p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="rounded-[18px] border border-white/10 bg-[#0F172A] p-5 transition hover:border-[#3B82F6]/30"
          >
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#94A3B8]">
              {item.label}
            </p>
            <p className="mt-4 text-3xl font-semibold text-white">
              {item.value}
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4]`}
                style={{ width: `${Math.min(item.value * 10, 100)}%` }}
              />
            </div>
          </div>
        ))}

        <div className="rounded-[18px] border border-white/10 bg-[#0F172A] p-5">
          <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.35em] text-[#94A3B8]">
            <span>Activation</span>
            <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] text-[#94A3B8]">
              Live
            </span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">
            {overallProgress}%
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#06B6D4] to-[#3B82F6]"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
