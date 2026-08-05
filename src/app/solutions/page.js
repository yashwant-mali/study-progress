import Link from 'next/link';
import { listTopics } from '@/controllers/topicController';

export default async function SolutionsPage() {
    const topics = await listTopics();

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <div className="mx-auto grid max-w-[1200px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="rounded-[2rem] border border-slate-800/80 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/40">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Code Solutions</p>
                            <h1 className="mt-3 text-4xl font-semibold text-white">Solutions by topic</h1>
                            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                                Explore all code examples grouped by topic on a dedicated page.
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
                        {topics.map((topic) => (
                            <article
                                key={topic._id}
                                className="overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-900 p-6 shadow-2xl shadow-slate-950/40"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-white">{topic.title}</h2>
                                        <p className="mt-2 text-sm text-slate-400">{topic.category || 'General'}</p>
                                    </div>
                                    <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold text-slate-200">
                                        {topic.codes?.length ?? 0} solution{topic.codes?.length === 1 ? '' : 's'}
                                    </span>
                                </div>
                                                <div className="mt-6 grid gap-4 md:grid-cols-2">
                                    {topic.codes?.length ? (
                                        topic.codes.map((code) => (
                                            <div
                                                key={code.label}
                                                className="rounded-[1.5rem] border border-slate-800/80 bg-slate-950/90 p-5 text-sm text-slate-300"
                                            >
                                                <div className="flex min-w-0 items-center justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <p className="truncate font-semibold text-white">{code.label}</p>
                                                        <p className="text-xs text-slate-500">{code.language}</p>
                                                    </div>
                                                </div>
                                                <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-900 p-4 text-sm text-slate-200 whitespace-pre-wrap break-words">
                                                    <code className="block w-full">{code.snippet || 'No code snippet available.'}</code>
                                                </pre>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-[1.5rem] border border-slate-800/80 bg-slate-950/90 p-5 text-sm text-slate-400">
                                            No code solutions available for this topic.
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[2rem] border border-dashed border-slate-700 bg-slate-950/95 p-10 text-center text-slate-400 shadow-2xl shadow-slate-950/40">
                        No topics available yet. Add a topic on the dashboard to start tracking code solutions.
                    </div>
                )}
            </div>
        </main>
    );
}
