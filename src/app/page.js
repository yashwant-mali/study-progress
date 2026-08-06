'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CodePopup from '@/components/CodePopup';
import DashboardHeader from '@/components/DashboardHeader';
import ErrorBoundary from '@/components/ErrorBoundary';
import Modal from '@/components/Modal';
import QuickActions from '@/components/QuickActions';
import Sidebar from '@/components/Sidebar';
import TopicForm from '@/components/TopicForm';
import TopicPanel from '@/components/TopicPanel';
import TopicTable from '@/components/TopicTable';
import {
  fetchTopics,
  addTopic,
  updateTopic,
  deleteTopic,
  selectTopic,
  clearSelection,
} from '@/store/topicsSlice';

export default function Home() {
  const dispatch = useDispatch();
  const { items: topics, selectedTopicId, loading, error } = useSelector((state) => state.topics);
  const [selectedCode, setSelectedCode] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [importText, setImportText] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showOnlyNotes, setShowOnlyNotes] = useState(false);

  const selectedTopic = useMemo(
    () => topics.find((topic) => topic._id === selectedTopicId) || null,
    [topics, selectedTopicId],
  );

  const topicsAdded = topics.length;
  const notesCreated = useMemo(
    () => topics.reduce((sum, topic) => sum + (topic.description?.trim() ? 1 : 0), 0),
    [topics],
  );
  const codeSolutions = useMemo(
    () => topics.reduce((sum, topic) => sum + (topic.codes?.length || 0), 0),
    [topics],
  );
  const overallProgress = useMemo(() => {
    if (!topics.length) return 0;
    const totalPossible = topics.length * 4;
    const totalPoints = topics.reduce((sum, topic) => {
      let points = 0;
      if (topic.description?.trim()) points += 1;
      points += Math.min(3, topic.codes?.length || 0);
      return sum + points;
    }, 0);
    return Math.round((totalPoints / totalPossible) * 100);
  }, [topics]);

  const categories = useMemo(
    () => ['All', ...new Set(topics.map((topic) => topic.category || 'General'))],
    [topics],
  );

  const filteredTopics = useMemo(() => {
    let results = [...topics];

    if (activeCategory !== 'All') {
      results = results.filter((topic) => (topic.category || 'General') === activeCategory);
    }

    if (showOnlyNotes) {
      results = results.filter((topic) => topic.description?.trim());
    }

    if (!searchQuery.trim()) {
      return results;
    }

    const query = searchQuery.toLowerCase();
    return results.filter((topic) => {
      const content = [
        topic.title,
        topic.category,
        topic.description,
        ...(topic.codes || []).map((code) => code.label),
        ...(topic.codes || []).map((code) => code.language),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return content.includes(query);
    });
  }, [topics, activeCategory, searchQuery, showOnlyNotes]);

  const recentActivity = useMemo(
    () =>
      [...topics]
        .sort(
          (a, b) =>
            new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
        )
        .slice(0, 4),
    [topics],
  );

  useEffect(() => {
    dispatch(fetchTopics()).then((result) => {
      if (result.meta.requestStatus === 'fulfilled' && result.payload.length && !selectedTopicId) {
        dispatch(selectTopic(result.payload[0]._id));
      }
    });
  }, [dispatch, selectedTopicId]);

  const handleOpenCode = (topic, code) => {
    setSelectedCode(code);
  };

  const handleSelectAlternative = (code) => {
    setSelectedCode(code);
  };

  const handleTopicSelect = (topic) => {
    dispatch(selectTopic(topic._id));
    setSelectedCode(null);
    setEditingTopic(null);
    setIsFormOpen(false);
  };

  const handleAddNewTopic = () => {
    dispatch(clearSelection());
    setEditingTopic(null);
    setSelectedCode(null);
    setIsFormOpen(true);
  };

  const handleEditTopic = (topic) => {
    dispatch(selectTopic(topic._id));
    setEditingTopic(topic);
    setSelectedCode(null);
    setIsFormOpen(true);
  };

  const handleDeleteTopic = async (topic) => {
    if (!topic?._id || !confirm(`Delete topic “${topic.title}”?`)) {
      return;
    }

    try {
      await dispatch(deleteTopic(topic._id)).unwrap();
      setSelectedCode(null);
      if (selectedTopicId === topic._id) {
        dispatch(clearSelection());
      }
    } catch (err) {
      // error is already stored in Redux state
    }
  };

  const handleApplyImportNotes = async () => {
    if (!importText.trim()) {
      return;
    }

    const payload = selectedTopic
      ? {
        id: selectedTopic._id,
        title: selectedTopic.title,
        category: selectedTopic.category || 'General',
        description: [selectedTopic.description, importText].filter(Boolean).join('\n\n'),
        codes: selectedTopic.codes || [],
      }
      : {
        title: 'Imported Notes',
        category: 'General',
        description: importText,
        codes: [],
      };

    try {
      if (payload.id) {
        await dispatch(updateTopic(payload)).unwrap();
      } else {
        await dispatch(addTopic(payload)).unwrap();
      }
      setActiveModal(null);
      setImportText('');
    } catch (err) {
      // handled by Redux state
    }
  };

  const handleGenerateCheatsheet = () => {
    if (!selectedTopic) {
      alert('Please select a topic to generate a cheatsheet.');
      return;
    }
    setActiveModal('cheatsheet');
  };

  const handleSubmit = async (topicData) => {
    try {
      if (topicData.id) {
        await dispatch(updateTopic(topicData)).unwrap();
      } else {
        await dispatch(addTopic(topicData)).unwrap();
      }
      setEditingTopic(null);
      setIsFormOpen(false);
    } catch (err) {
      // handled by Redux state
    }
  };

  return (
    <main className="min-h-screen bg-[#070B16] text-[#F8FAFC]">
      <div className="mx-auto grid max-w-[1700px] gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:grid-cols-[280px_1fr]">
        <Sidebar categories={categories} isMobileOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

        <div className="space-y-6">
          <div className="rounded-[24px] border border-white/10 bg-[#111827]/95 p-5 shadow-[0_30px_60px_rgba(0,0,0,0.26)] backdrop-blur-md top-6 z-20">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.35em] text-[#94A3B8]">Focused study</p>
                <h1 className="text-3xl font-semibold text-[#F8FAFC]">Developer learning workspace</h1>
                <p className="max-w-2xl text-sm leading-6 text-[#94A3B8]">
                  Organize topics, save theory, review code, and keep a distraction-free study flow with premium developer tools.
                </p>
              </div>
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#94A3B8]">
                Press <span className="mx-2 rounded-full bg-[#0F172A] px-2 py-1 text-[#F8FAFC]">⌘K</span> for commands
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]">
              <label className="relative block">
                <span className="sr-only">Search topics</span>
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search topics, notes, or languages"
                  className="w-full rounded-[18px] border border-white/14 bg-[#0F172A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                  setShowOnlyNotes(false);
                }}
                className="inline-flex items-center justify-center rounded-[18px] border border-white/14 bg-white/5 px-4 py-3 text-sm font-semibold text-[#F8FAFC] transition hover:bg-white/10"
              >
                Reset filters
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-3 py-2 text-sm transition ${activeCategory === category
                    ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-[#F8FAFC]'
                    : 'border-white/10 bg-white/5 text-[#94A3B8] hover:border-[#3B82F6] hover:bg-[#3B82F6]/10'
                    }`}
                >
                  {category}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowOnlyNotes((current) => !current)}
                className={`rounded-full border px-3 py-2 text-sm transition ${showOnlyNotes
                  ? 'border-[#06B6D4] bg-[#06B6D4]/10 text-[#F8FAFC]'
                  : 'border-white/10 bg-white/5 text-[#94A3B8] hover:border-[#06B6D4] hover:bg-[#06B6D4]/10'
                  }`}
              >
                {showOnlyNotes ? 'Showing notes only' : 'Filter notes only'}
              </button>
            </div>
          </div>

          <ErrorBoundary message="Dashboard header or quick actions failed to render.">
            <div className="grid gap-6 xl:grid-cols-[3fr_1fr]">
              <DashboardHeader
                stats={{
                  topicsAdded,
                  notesCreated,
                  codeSolutions,
                  overallProgress,
                }}
              />

              <div className="xl:sticky xl:top-6 xl:self-start">
                <QuickActions
                  onAddNewTopic={handleAddNewTopic}
                  onImportNotes={() => setActiveModal('import')}
                  onNewCodeSolution={() => {
                    if (!selectedTopic) {
                      alert('Please select a topic first to add a code solution.');
                      return;
                    }
                    setEditingTopic(selectedTopic);
                    setIsFormOpen(true);
                  }}
                  onGenerateCheatsheet={handleGenerateCheatsheet}
                  hasSelectedTopic={Boolean(selectedTopic)}
                />
              </div>
            </div>
          </ErrorBoundary>

          <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
            <section className="space-y-6">
              <div className="rounded-[24px] border border-white/10 bg-[#111827]/95 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.24)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-[#94A3B8]">Topic stream</p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">Active study topics</h2>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-white/14 bg-white/5 px-4 py-2 text-sm text-[#94A3B8]">
                    {filteredTopics.length} visible topics
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="rounded-[24px] border border-white/10 bg-[#111827]/95 p-10 text-center text-[#94A3B8] shadow-[0_30px_60px_rgba(0,0,0,0.24)]">
                  Loading topics...
                </div>
              ) : (
                <TopicTable
                  topics={filteredTopics}
                  onOpenCode={handleOpenCode}
                  onTopicSelect={handleTopicSelect}
                  onEditTopic={handleEditTopic}
                  onDeleteTopic={handleDeleteTopic}
                />
              )}

              {error ? (
                <div className="rounded-[24px] border border-[#EF4444]/20 bg-[#7f1d1d]/10 px-6 py-4 text-[#fee2e2] shadow-sm">
                  {error}
                </div>
              ) : null}
            </section>

            <aside className="space-y-6">
              <div className="xl:sticky xl:top-6 xl:space-y-6">
                {isFormOpen ? (
                  <TopicForm
                    initialTopic={editingTopic}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsFormOpen(false)}
                    submitLabel={editingTopic ? 'Update topic' : 'Create topic'}
                  />
                ) : (
                  <TopicPanel
                    topic={selectedTopic}
                    onOpenCode={handleOpenCode}
                    onEditTopic={handleEditTopic}
                    onDeleteTopic={handleDeleteTopic}
                  />
                )}

                <section className="rounded-[24px] border border-white/10 bg-[#111827]/95 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.24)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.35em] text-[#94A3B8]">Recent activity</p>
                      <h2 className="mt-2 text-xl font-semibold text-white">Latest updates</h2>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#94A3B8]">
                      {recentActivity.length} items
                    </span>
                  </div>
                  <div className="mt-5 space-y-3">
                    {recentActivity.length ? (
                      recentActivity.map((topic) => (
                        <button
                          key={topic._id}
                          type="button"
                          onClick={() => handleTopicSelect(topic)}
                          className="w-full rounded-[20px] border border-white/10 bg-[#0F172A] p-4 text-left transition hover:border-[#3B82F6]/30 hover:bg-[#17233b]"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-white">{topic.title}</p>
                            <span className="text-[11px] uppercase tracking-[0.35em] text-[#94A3B8]">
                              {topic.updatedAt
                                ? new Date(topic.updatedAt).toLocaleDateString()
                                : 'No date'}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
                            {topic.description?.slice(0, 80) || 'No notes yet'}
                          </p>
                        </button>
                      ))
                    ) : (
                      <div className="rounded-[20px] border border-white/10 bg-[#0F172A] p-4 text-sm text-[#94A3B8]">
                        No recent activity available yet. Start by adding a topic or updating a note.
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {selectedCode && selectedTopic ? (
        <CodePopup
          code={selectedCode}
          alternatives={selectedTopic.codes}
          onSelectAlternative={handleSelectAlternative}
          onClose={() => setSelectedCode(null)}
        />
      ) : null}

      {activeModal === 'import' ? (
        <Modal onClose={() => setActiveModal(null)}>
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">Import notes</h3>
                <p className="text-sm text-[#94A3B8]">
                  Paste note text here to import into the selected topic or create a new quick note.
                </p>
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-[#94A3B8]">
                {selectedTopic ? 'Imports to selected topic' : 'Creates new note'}
              </span>
            </div>
            <textarea
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              rows={10}
              className="w-full rounded-[20px] border border-white/14 bg-[#0F172A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
              placeholder="Paste your notes here..."
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleApplyImportNotes}
                className="rounded-[18px] bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
              >
                Import notes
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-[18px] border border-white/14 bg-white/5 px-5 py-3 text-sm text-[#F8FAFC] transition hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      ) : null}

      {activeModal === 'cheatsheet' && selectedTopic ? (
        <Modal onClose={() => setActiveModal(null)}>
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">Cheatsheet preview</h3>
                <p className="text-sm text-[#94A3B8]">Generate a quick summary of the selected topic.</p>
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-[#94A3B8]">
                {selectedTopic.category || 'General'}
              </span>
            </div>
            <div className="rounded-[20px] border border-white/14 bg-[#0F172A] p-5 text-[#E2E8F0]">
              <p className="text-sm uppercase tracking-[0.35em] text-[#94A3B8]">Topic</p>
              <h4 className="mt-2 text-xl font-semibold text-white">{selectedTopic.title}</h4>
              <p className="mt-4 text-sm leading-7 text-[#94A3B8]">{selectedTopic.description || 'No description available.'}</p>
              <div className="mt-5 space-y-3">
                <p className="text-sm uppercase tracking-[0.35em] text-[#94A3B8]">Solutions</p>
                {selectedTopic.codes?.length > 0 ? (
                  selectedTopic.codes.map((code) => (
                    <div key={code.label} className="rounded-[18px] border border-white/10 bg-[#111827] p-4 text-sm text-[#E2E8F0]">
                      <div className="font-semibold text-white">{code.label}</div>
                      <div className="mt-1 text-xs text-[#94A3B8]">{code.language}</div>
                      <p className="mt-3 text-sm text-[#94A3B8]">{code.snippet?.slice(0, 120) || 'No code snippet provided.'}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[18px] border border-white/10 bg-[#111827] p-4 text-sm text-[#94A3B8]">
                    No code examples are available for this topic yet.
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Cheatsheet for ${selectedTopic.title}:\n\n${selectedTopic.description || ''}`,
                  );
                  alert('Cheatsheet copied to clipboard.');
                }}
                className="rounded-[18px] bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
              >
                Copy cheatsheet
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-[18px] border border-white/14 bg-white/5 px-5 py-3 text-sm text-[#F8FAFC] transition hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </main>
  );
}
