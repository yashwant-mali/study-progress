export default function TopicCard({ topic, onOpenCode }) {
  return (
    <article className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            {topic.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {topic.description ||
              "No theory saved yet. Add notes for this topic."}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {topic.codes?.length ?? 0} codes
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {topic.codes?.map((code, codeIndex) => (
          <button
            key={`${code.label}-${codeIndex}`}
            type="button"
            onClick={() => onOpenCode(topic, code)}
            className="rounded-3xl border border-slate-200/90 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <div className="font-semibold">{code.label}</div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {code.language}
            </div>
          </button>
        ))}
      </div>
    </article>
  );
}
