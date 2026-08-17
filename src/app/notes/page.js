import Link from 'next/link';
import { listTopics } from '@/controllers/topicController';
import { parseNotesBlocks } from '@/lib/notes';
import { getCategoryColor } from '@/lib/categoryColor';

// Force this page to be rendered fresh on every request instead of being
// statically generated at build time — otherwise newly added/edited topics
// (and their theory notes) never show up here after deploy.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NotesPage() {
    const topics = await listTopics();

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto grid max-w-[1200px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="rounded-[2rem] border border-slate-800/80 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/40">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">All Notes</p>
                            <h1 className="mt-3 text-4xl font-semibold text-white">Notes</h1>
                            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                                Review every topic in one continuous notes view with theory and code together.
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="rounded-3xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                        >
                            Back to dashboard
                        </Link>
                    </div>
                </div>

                {topics.length ? (
                    <div className="grid gap-6">
                        {topics.map((topic) => {
                            const blocks = parseNotesBlocks(topic.notes || topic.description || '');
                            const color = getCategoryColor(topic.category);

                            return (
                                <article
                                    key={topic._id}
                                    className="overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-900 p-6 shadow-2xl shadow-slate-950/40"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h2 className="text-2xl font-semibold text-white">{topic.title}</h2>
                                            <span className={`mt-2 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${color.border} ${color.bg} ${color.text}`}>
                                                {topic.category || 'General'}
                                            </span>
                                        </div>
                                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-slate-200">
                                            {blocks.length} block{blocks.length === 1 ? '' : 's'}
                                        </span>
                                    </div>
                                    <div className="mt-6 rounded-[1.5rem] border border-slate-800/80 bg-slate-950/90 p-5 text-sm leading-7 text-slate-300">
                                        {blocks.length ? (
                                            <div className="space-y-5">
                                                {blocks.map((block, index) =>
                                                    block.type === 'code' ? (
                                                        <div key={`note-code-${index}`} className="overflow-hidden rounded-2xl border border-slate-700 bg-[#020817]">
                                                            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-3 py-2">
                                                                <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                                                                    {block.language || 'code'}
                                                                </span>
                                                            </div>
                                                            <pre className="overflow-x-auto whitespace-pre-wrap break-words p-4 font-mono text-sm leading-7 text-cyan-100">
                                                                <code>{block.content}</code>
                                                            </pre>
                                                        </div>
                                                    ) : (
                                                        <div key={`note-theory-${index}`} className="whitespace-pre-wrap text-slate-200">
                                                            {block.content}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-slate-500">No notes available for this topic.</p>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-[2rem] border border-dashed border-slate-700 bg-slate-950/95 p-10 text-center text-slate-400 shadow-2xl shadow-slate-950/40">
                        No topics available yet. Add a topic on the dashboard to start building theory notes.
                    </div>
                )}
            </div>
        </main>
    );
}
