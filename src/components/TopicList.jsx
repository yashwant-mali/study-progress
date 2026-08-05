import TopicCard from "./TopicCard";

export default function TopicList({ topics, onOpenCode }) {
  if (!topics || topics.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300/80 bg-slate-50 p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        No study topics yet. Add your first topic to keep track of theory and
        code.
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {topics.map((topic) => (
        <TopicCard key={topic._id} topic={topic} onOpenCode={onOpenCode} />
      ))}
    </div>
  );
}
