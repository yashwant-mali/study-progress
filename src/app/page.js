'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CodePopup from '@/components/CodePopup';
import DashboardHeader from '@/components/DashboardHeader';
import ErrorBoundary from '@/components/ErrorBoundary';
import MobileHeader from '@/components/MobileHeader';
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
    () => [...new Set(topics.map((topic) => topic.category || 'General'))],
    [topics],
  );

  useEffect(() => {
    dispatch(fetchTopics()).then((result) => {
      if (result.meta.requestStatus === 'fulfilled' && result.payload.length && !selectedTopicId) {
        dispatch(selectTopic(result.payload[0]._id));
      }
    });
  }, [dispatch]);

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
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid max-w-[1700px] gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:grid-cols-[280px_1fr]">
        <Sidebar categories={categories} isMobileOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

        <div className="space-y-6">
          <MobileHeader onOpenMenu={() => setIsMobileMenuOpen(true)} />

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

          <div className="grid gap-6 xl:grid-cols-2">
            <section className="space-y-6">
              <div className="rounded-[2rem] border border-slate-800/90 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/40">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Your Topics</p>
                    <h2 className="mt-3 text-3xl font-semibold text-white">Topics in progress</h2>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200">
                    {topics.length} items
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="rounded-[2rem] border border-slate-800/90 bg-slate-950/95 p-10 text-center text-slate-400 shadow-2xl shadow-slate-950/40">
                  Loading topics...
                </div>
              ) : (
                <TopicTable
                  topics={topics}
                  onOpenCode={handleOpenCode}
                  onTopicSelect={handleTopicSelect}
                  onEditTopic={handleEditTopic}
                  onDeleteTopic={handleDeleteTopic}
                />
              )}

              {error ? (
                <div className="rounded-[2rem] border border-rose-500/20 bg-rose-500/10 px-6 py-4 text-rose-100 shadow-sm">
                  {error}
                </div>
              ) : null}
            </section>

            <aside className="space-y-6">
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
                <p className="text-sm text-slate-400">Paste note text here to import into the selected topic or create a new quick note.</p>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{selectedTopic ? 'Imports to selected topic' : 'Creates new note'}</span>
            </div>
            <textarea
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              rows={10}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Paste your notes here..."
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleApplyImportNotes}
                className="rounded-3xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Import notes
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-3xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm text-slate-200 transition hover:bg-slate-800"
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
                <p className="text-sm text-slate-400">Generate a quick summary of the selected topic.</p>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{selectedTopic.category || 'General'}</span>
            </div>
            <div className="rounded-3xl border border-slate-700 bg-slate-950 p-5 text-slate-100">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Topic</p>
              <h4 className="mt-2 text-xl font-semibold text-white">{selectedTopic.title}</h4>
              <p className="mt-4 text-sm leading-7 text-slate-300">{selectedTopic.description || 'No description available.'}</p>
              <div className="mt-5 space-y-3">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Solutions</p>
                {selectedTopic.codes?.length > 0 ? (
                  selectedTopic.codes.map((code) => (
                    <div key={code.label} className="rounded-3xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-200">
                      <div className="font-semibold text-white">{code.label}</div>
                      <div className="mt-1 text-xs text-slate-400">{code.language}</div>
                      <p className="mt-3 text-sm text-slate-300">{code.snippet?.slice(0, 120) || 'No code snippet provided.'}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-400">No code examples are available for this topic yet.</div>
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
                className="rounded-3xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Copy cheatsheet
              </button>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-3xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm text-slate-200 transition hover:bg-slate-800"
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
