'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import MobileHeader from '@/components/MobileHeader';
import Sidebar from '@/components/Sidebar';
import TopicForm from '@/components/TopicForm';
import TopicPanel from '@/components/TopicPanel';
import TopicTable from '@/components/TopicTable';
import useIsDesktop from '@/lib/useIsDesktop';
import {
  fetchTopics,
  addTopic,
  updateTopic,
  deleteTopic,
  selectTopic,
  clearSelection,
} from '@/store/topicsSlice';

// The "Import notes" modal is only needed once the user opens it, so it's
// split into its own chunk instead of being bundled into the initial page
// load.
const Modal = dynamic(() => import('@/components/Modal'), { ssr: false });

// Generates a unique client-only id used to optimistically render a
// brand-new topic before the server has responded.
function createTempId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `temp-${crypto.randomUUID()}`;
  }
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function Home() {
  const dispatch = useDispatch();
  const { items: topics, selectedTopicId, loading, mutatingId, error } = useSelector((state) => state.topics);
  const { user, initialized: authInitialized } = useSelector((state) => state.auth);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [importText, setImportText] = useState('');
  const [formDefaultCategory, setFormDefaultCategory] = useState('General');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showOnlyNotes, setShowOnlyNotes] = useState(false);
  const [isFocusedStudyOpen, setIsFocusedStudyOpen] = useState(false);
  const [isTopicStreamOpen, setIsTopicStreamOpen] = useState(true);
  const [isRecentActivityOpen, setIsRecentActivityOpen] = useState(false);
  const searchInputRef = useRef(null);
  const isDesktop = useIsDesktop();

  const selectedTopic = useMemo(
    () => topics.find((topic) => topic._id === selectedTopicId) || null,
    [topics, selectedTopicId],
  );

  const topicsAdded = topics.length;
  const notesCreated = useMemo(
    () => topics.reduce((sum, topic) => sum + ((topic.notes || topic.description)?.trim() ? 1 : 0), 0),
    [topics],
  );
  const overallProgress = useMemo(() => {
    if (!topics.length) return 0;
    return Math.round((topics.filter((topic) => (topic.notes || topic.description)?.trim()).length / topics.length) * 100);
  }, [topics]);

  // Consecutive-day streak based on when topics were created or last updated.
  const studyStreak = useMemo(() => {
    if (!topics.length) return 0;

    const activeDays = new Set(
      topics
        .flatMap((topic) => [topic.createdAt, topic.updatedAt])
        .filter(Boolean)
        .map((date) => new Date(date).toDateString()),
    );

    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    // Today doesn't have to have activity yet for the streak to still count,
    // but if neither today nor yesterday has activity the streak is broken.
    if (!activeDays.has(cursor.toDateString())) {
      cursor.setDate(cursor.getDate() - 1);
      if (!activeDays.has(cursor.toDateString())) {
        return 0;
      }
    }

    while (activeDays.has(cursor.toDateString())) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
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
      results = results.filter((topic) => (topic.notes || topic.description)?.trim());
    }

    if (!searchQuery.trim()) {
      return results;
    }

    const query = searchQuery.toLowerCase();
    return results.filter((topic) => {
      const content = [
        topic.title,
        topic.category,
        topic.notes || topic.description,
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

  // Fetch the full topic list ONCE when the user becomes authenticated.
  // Important: selectedTopicId must NOT be a dependency here — clicking a
  // topic only needs to update `selectedTopicId` locally in Redux, not
  // re-fetch every topic (with its full notes text) from the database.
  // Having it in the deps array was causing a full GET /api/topics
  // round-trip on every single topic click, which is what made opening
  // notes feel slow.
  const hasFetchedRef = useRef(false);
  useEffect(() => {
    if (!authInitialized || !user || hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    dispatch(fetchTopics()).then((result) => {
      if (result.meta.requestStatus === 'fulfilled' && result.payload.length) {
        dispatch(selectTopic(result.payload[0]._id));
      }
    });
  }, [dispatch, authInitialized, user]);

  // Global ⌘K / Ctrl+K shortcut jumps straight into the search box.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const focusSearch = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);

  const handleTopicSelect = useCallback((topic) => {
    // Mobile-only: tapping the topic that's already open closes its
    // inline notes again (toggle), instead of just re-selecting it.
    // Desktop keeps its original behavior — clicking the already-selected
    // topic there simply leaves the side panel showing its notes, exactly
    // as before.
    if (!isDesktop && !isFormOpen && selectedTopicId === topic._id) {
      dispatch(clearSelection());
      return;
    }
    dispatch(selectTopic(topic._id));
    setEditingTopic(null);
    setIsFormOpen(false);
  }, [dispatch, isDesktop, isFormOpen, selectedTopicId]);

  const handleAddNewTopic = useCallback((defaultGroup = 'General') => {
    dispatch(clearSelection());
    setEditingTopic(null);
    setFormDefaultCategory(defaultGroup || 'General');
    setIsFormOpen(true);
  }, [dispatch]);

  const handleEditTopic = useCallback((topic) => {
    dispatch(selectTopic(topic._id));
    setEditingTopic(topic);
    setIsFormOpen(true);
  }, [dispatch]);

  const handleDeleteTopic = useCallback(async (topic) => {
    if (!topic?._id || !confirm(`Delete topic “${topic.title}”?`)) {
      return;
    }

    try {
      await dispatch(deleteTopic(topic._id)).unwrap();
      if (selectedTopicId === topic._id) {
        dispatch(clearSelection());
      }
    } catch (err) {
      // error is already stored in Redux state
    }
  }, [dispatch, selectedTopicId]);

  const handleApplyImportNotes = async () => {
    if (!importText.trim()) {
      return;
    }

    const payload = selectedTopic
      ? {
        id: selectedTopic._id,
        title: selectedTopic.title,
        category: selectedTopic.category || 'General',
        notes: [selectedTopic.notes || selectedTopic.description, importText].filter(Boolean).join('\n\n'),
      }
      : {
        title: 'Imported Notes',
        category: 'General',
        notes: importText,
        tempId: createTempId(),
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

  const handleSubmit = async (topicData) => {
    // Close the form immediately — the optimistic update in the Redux
    // slice means the topic (or its edited notes) is already visible in
    // the list/panel right away, so there's no need to block the UI on
    // the network round-trip.
    setEditingTopic(null);
    setIsFormOpen(false);

    try {
      if (topicData.id) {
        await dispatch(updateTopic(topicData)).unwrap();
      } else {
        await dispatch(addTopic({ ...topicData, tempId: createTempId() })).unwrap();
      }
    } catch (err) {
      // handled by Redux state (error banner + optimistic rollback)
    }
  };

  if (!authInitialized) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#070B16] text-[#F8FAFC]">
        <p className="text-sm text-[#94A3B8]">Loading your study workspace…</p>
      </main>
    );
  }

  if (!user) return null;

  // The node currently shown in the "detail" area — either the add/edit
  // form or the read-only notes panel — plus an anchor describing which
  // topic (or, for a brand-new topic, which category) it belongs to. On
  // mobile this same node is rendered by TopicTable directly underneath
  // the matching row/category so the person never has to scroll past the
  // whole topic list to see it. Desktop keeps the separate side panel.
  const detailNode = isFormOpen ? (
    <TopicForm
      initialTopic={editingTopic}
      defaultCategory={formDefaultCategory}
      onSubmit={handleSubmit}
      onCancel={() => setIsFormOpen(false)}
      submitLabel={editingTopic ? 'Update topic' : 'Create topic'}
    />
  ) : (
    <TopicPanel
      topic={selectedTopic}
      onEditTopic={handleEditTopic}
      onDeleteTopic={handleDeleteTopic}
    />
  );

  const detailAnchor = isFormOpen
    ? editingTopic
      ? { type: 'topic', id: editingTopic._id }
      : { type: 'category', id: formDefaultCategory || 'General' }
    : selectedTopic
      ? { type: 'topic', id: selectedTopic._id }
      : null;

  return (
    <main className="min-h-screen bg-[#070B16] text-[#F8FAFC]">
      <div className="mx-auto grid max-w-[1700px] gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:grid-cols-[280px_1fr]">
        <Sidebar
          categories={categories}
          isMobileOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          stats={{ topicsAdded, notesCreated, overallProgress, streak: studyStreak }}
          onAddNewTopic={() => handleAddNewTopic('General')}
          onImportNotes={() => setActiveModal('import')}
          onFocusSearch={focusSearch}
        />

        <div className="space-y-6">
          <div className="rounded-[24px] border border-white/10 bg-[#111827]/95 p-5 shadow-[0_30px_60px_rgba(0,0,0,0.26)] backdrop-blur-md top-6 z-20">
            <div className="mb-4">
              <MobileHeader
                isMenuOpen={isMobileMenuOpen}
                onOpenMenu={() => setIsMobileMenuOpen(true)}
              />
            </div>

            <button
              type="button"
              onClick={() => setIsFocusedStudyOpen((current) => !current)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.35em] text-[#94A3B8]">Focused study</p>
                <h1 className="text-3xl font-semibold text-[#F8FAFC]">Developer learning workspace</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#94A3B8]">
                  Press <span className="mx-2 rounded-full bg-[#0F172A] px-2 py-1 text-[#F8FAFC]">⌘K</span> for commands
                </div>
                <span className="text-2xl text-[#94A3B8]">{isFocusedStudyOpen ? '−' : '+'}</span>
              </div>
            </button>

            {isFocusedStudyOpen ? (
              <>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#94A3B8]">
                  Organize topics, save theory, review code, and keep a distraction-free study flow with premium developer tools.
                </p>

                <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto]">
                  <label className="relative block">
                    <span className="sr-only">Search topics</span>
                    <input
                      ref={searchInputRef}
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search topics, notes, or languages"
                      className="w-full rounded-[18px] border border-white/14 bg-[#0F172A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
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
                        ? 'border-[#6366F1] bg-[#6366F1]/10 text-[#F8FAFC]'
                        : 'border-white/10 bg-white/5 text-[#94A3B8] hover:border-[#6366F1] hover:bg-[#6366F1]/10'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowOnlyNotes((current) => !current)}
                    className={`rounded-full border px-3 py-2 text-sm transition ${showOnlyNotes
                      ? 'border-[#22D3EE] bg-[#22D3EE]/10 text-[#F8FAFC]'
                      : 'border-white/10 bg-white/5 text-[#94A3B8] hover:border-[#22D3EE] hover:bg-[#22D3EE]/10'
                      }`}
                  >
                    {showOnlyNotes ? 'Showing notes only' : 'Filter notes only'}
                  </button>
                </div>
              </>
            ) : null}
          </div>

          <div className={`grid gap-6 ${isTopicStreamOpen ? 'xl:grid-cols-[1fr_2.2fr]' : 'xl:grid-cols-1'}`}>
            {isTopicStreamOpen ? (
              <section className="space-y-4">
                <div className="rounded-[20px] border border-white/10 bg-[#111827]/95 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                  <button
                    type="button"
                    onClick={() => setIsTopicStreamOpen((current) => !current)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.35em] text-[#94A3B8]">Topic stream</p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">Active study topics</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center rounded-full border border-white/14 bg-white/5 px-3 py-1.5 text-xs text-[#94A3B8]">
                        {filteredTopics.length} visible topics
                      </span>
                      <span className="text-xl text-[#94A3B8]">−</span>
                    </div>
                  </button>
                </div>

                {loading ? (
                  <div className="rounded-[24px] border border-white/10 bg-[#111827]/95 p-10 text-center text-[#94A3B8] shadow-[0_30px_60px_rgba(0,0,0,0.24)]">
                    Loading topics...
                  </div>
                ) : (
                  <TopicTable
                    topics={filteredTopics}
                    selectedTopic={selectedTopic}
                    onTopicSelect={handleTopicSelect}
                    onEditTopic={handleEditTopic}
                    onDeleteTopic={handleDeleteTopic}
                    onAddTopicToGroup={(category) => handleAddNewTopic(category)}
                    mutatingId={mutatingId}
                    mobileDetailAnchor={isDesktop ? null : detailAnchor}
                    mobileDetailNode={isDesktop ? null : detailNode}
                  />
                )}

                {error ? (
                  <div className="rounded-[24px] border border-[#EF4444]/20 bg-[#7f1d1d]/10 px-6 py-4 text-[#fee2e2] shadow-sm">
                    {error}
                  </div>
                ) : null}
              </section>
            ) : (
              <div className="rounded-[20px] border border-white/10 bg-[#111827]/95 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                <button
                  type="button"
                  onClick={() => setIsTopicStreamOpen((current) => !current)}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-[#94A3B8]">Topic stream</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Active study topics</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-white/14 bg-white/5 px-3 py-1.5 text-xs text-[#94A3B8]">
                      {filteredTopics.length} visible topics
                    </span>
                    <span className="text-xl text-[#94A3B8]">+</span>
                  </div>
                </button>
              </div>
            )}

            <aside className="space-y-6">
              <div className="xl:sticky xl:top-6 xl:space-y-6">
                {/* On mobile/tablet this same content is rendered inline by
                    TopicTable right under the relevant topic, so it's kept
                    out of the DOM here entirely (not just CSS-hidden) to
                    guarantee it never shows twice. Desktop (xl+, matched by
                    the same breakpoint as `isDesktop`) is untouched. */}
                {isDesktop ? detailNode : null}

                <section className="rounded-[24px] border border-white/10 bg-[#111827]/95 p-4 shadow-[0_30px_60px_rgba(0,0,0,0.24)]">
                  <button
                    type="button"
                    onClick={() => setIsRecentActivityOpen((current) => !current)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.35em] text-[#94A3B8]">Recent activity</p>
                      <h2 className="mt-2 text-xl font-semibold text-white">Latest updates</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#94A3B8]">
                        {recentActivity.length} items
                      </span>
                      <span className="text-lg text-[#94A3B8]">{isRecentActivityOpen ? '−' : '+'}</span>
                    </div>
                  </button>

                  {isRecentActivityOpen ? (
                    <div className="mt-5 space-y-3">
                      {recentActivity.length ? (
                        recentActivity.map((topic) => (
                          <button
                            key={topic._id}
                            type="button"
                            onClick={() => handleTopicSelect(topic)}
                            className="w-full rounded-[20px] border border-white/10 bg-[#0F172A] p-4 text-left transition hover:border-[#6366F1]/40 hover:bg-[#17233b]"
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
                              {(topic.notes || topic.description)?.slice(0, 80) || 'No notes yet'}
                            </p>
                          </button>
                        ))
                      ) : (
                        <div className="rounded-[20px] border border-white/10 bg-[#0F172A] p-4 text-sm text-[#94A3B8]">
                          No recent activity available yet. Start by adding a topic or updating a note.
                        </div>
                      )}
                    </div>
                  ) : null}
                </section>
              </div>
            </aside>
          </div>
        </div>
      </div>

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
              className="w-full rounded-[20px] border border-white/14 bg-[#0F172A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
              placeholder="Paste your notes here..."
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleApplyImportNotes}
                className="rounded-[18px] bg-gradient-to-r from-[#6366F1] to-[#4F46E5] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(99,102,241,0.35)] transition hover:from-[#4F46E5] hover:to-[#4338CA]"
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

    </main>
  );
}
