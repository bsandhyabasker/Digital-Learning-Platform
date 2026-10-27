import React, { useState, useEffect } from 'react';
import { discussionService, courseService } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';
import { Modal, Badge } from '../../components/common/CommonUI';
import {
  MessageSquare,
  ThumbsUp,
  Award,
  Pin,
  Send,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User
} from 'lucide-react';

export const ForumPage = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Active Thread View Modal / Detail
  const [activeTopic, setActiveTopic] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Create Topic Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTopicForm, setNewTopicForm] = useState({
    title: '',
    content: '',
    courseId: '',
    category: 'General',
    tags: 'React, State, Hooks'
  });
  const [creatingTopic, setCreatingTopic] = useState(false);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const res = await discussionService.getTopics({
        courseId: selectedCourseFilter || undefined,
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        search: search || undefined
      });
      if (res.success) {
        setTopics(res.topics || []);
      }
    } catch (err) {
      console.error('Failed to fetch discussion topics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await courseService.getCourses();
        if (res.success) setCourses(res.courses || []);
      } catch (err) {
        console.error('Error loading courses:', err);
      }
    };
    loadCourses();
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [selectedCourseFilter, categoryFilter, search]);

  const handleOpenThread = async (topicId) => {
    try {
      const res = await discussionService.getById(topicId);
      if (res.success) {
        setActiveTopic(res.topic);
      }
    } catch (err) {
      alert('Failed to load discussion thread');
    }
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    try {
      setCreatingTopic(true);
      const tagsArray = newTopicForm.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await discussionService.createTopic({
        title: newTopicForm.title,
        content: newTopicForm.content,
        courseId: newTopicForm.courseId || null,
        category: newTopicForm.category,
        tags: tagsArray
      });

      setShowCreateModal(false);
      setNewTopicForm({
        title: '',
        content: '',
        courseId: '',
        category: 'General',
        tags: 'React, State, Hooks'
      });
      await fetchTopics();
      alert('Discussion topic published!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish discussion topic');
    } finally {
      setCreatingTopic(false);
    }
  };

  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!activeTopic || !replyContent.trim()) return;
    try {
      setSubmittingReply(true);
      const res = await discussionService.reply(activeTopic._id, {
        content: replyContent
      });
      if (res.success) {
        setActiveTopic(res.topic);
        setReplyContent('');
        await fetchTopics();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit response');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleEndorseReply = async (replyId) => {
    if (!activeTopic) return;
    try {
      const res = await discussionService.endorseReply(activeTopic._id, replyId);
      if (res.success) {
        setActiveTopic(res.topic);
      }
    } catch (err) {
      alert('Only faculty or admin can endorse answers.');
    }
  };

  const handleUpvote = async (topicId) => {
    try {
      await discussionService.upvote(topicId);
      if (activeTopic && activeTopic._id === topicId) {
        const res = await discussionService.getById(topicId);
        if (res.success) setActiveTopic(res.topic);
      }
      await fetchTopics();
    } catch (err) {
      console.error('Error upvoting topic:', err);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Academic Discussion Forums</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Collaborate on engineering challenges, share code rationales, and receive verified faculty endorsements.
          </p>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>New Discussion Thread</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              className="form-select"
              style={{ width: '220px' }}
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
            >
              <option value="">All Courses & General</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.courseCode} - {c.title}
                </option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {['All', 'General', 'Project Help', 'Code Architecture', 'Announcements'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search discussions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>
        </div>
      </div>

      {/* Topics List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading forum threads...
        </div>
      ) : topics.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No discussion topics found matching your criteria. Start the conversation!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {topics.map((topic) => (
            <div
              key={topic._id}
              className="card"
              style={{
                cursor: 'pointer',
                borderLeft: topic.isPinned ? '4px solid var(--primary)' : '1px solid var(--border-subtle)'
              }}
              onClick={() => handleOpenThread(topic._id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    {topic.isPinned && (
                      <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Pin size={12} /> Pinned Topic
                      </span>
                    )}
                    {topic.courseId ? (
                      <span className="badge badge-neutral">{topic.courseId.courseCode}</span>
                    ) : (
                      <span className="badge badge-neutral">Platform General</span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Category: {topic.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {topic.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <MessageSquare size={16} /> {topic.replies?.length || 0} Responses
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpvote(topic._id);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ThumbsUp size={14} />
                    <span>{topic.upvotes?.length || 0}</span>
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.75rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {topic.content}
              </p>

              {/* Tags & Author Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {topic.tags?.map((t, idx) => (
                    <span key={idx} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      #{t}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <img
                    src={topic.authorId?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                    alt={topic.authorId?.name}
                    style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span>
                    Started by <strong>{topic.authorId?.name}</strong> • {new Date(topic.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Thread Modal */}
      {activeTopic && (
        <Modal
          isOpen={!!activeTopic}
          onClose={() => setActiveTopic(null)}
          title={activeTopic.title}
          maxWidth="750px"
        >
          <div>
            {/* Original Topic Body */}
            <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img
                    src={activeTopic.authorId?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                    alt={activeTopic.authorId?.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{activeTopic.authorId?.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {activeTopic.authorId?.department} • {activeTopic.authorId?.role?.toUpperCase()}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleUpvote(activeTopic._id)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <ThumbsUp size={14} />
                  <span>{activeTopic.upvotes?.length || 0} Upvotes</span>
                </button>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {activeTopic.content}
              </p>
            </div>

            {/* Replies Stream */}
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} />
              <span>Responses & Technical Guidance ({activeTopic.replies?.length || 0})</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto', marginBottom: '1.5rem' }}>
              {activeTopic.replies?.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No replies yet. Be the first to answer!
                </div>
              ) : (
                activeTopic.replies.map((reply) => (
                  <div
                    key={reply._id}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: reply.isFacultyEndorsed ? 'var(--primary-light)' : 'var(--bg-card)',
                      border: reply.isFacultyEndorsed ? '2px solid var(--primary)' : '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img
                          src={reply.authorId?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                          alt={reply.authorId?.name}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{reply.authorId?.name}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                            ({reply.authorId?.role})
                          </span>
                        </div>
                      </div>

                      {reply.isFacultyEndorsed && (
                        <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Award size={12} /> ⭐ Verified Faculty Endorsement
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: '0.5rem 0' }}>
                      {reply.content}
                    </p>

                    {(user?.role === 'faculty' || user?.role === 'admin') && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <button
                          onClick={() => handleEndorseReply(reply._id)}
                          className={`btn btn-sm ${reply.isFacultyEndorsed ? 'btn-secondary' : 'btn-primary'}`}
                          style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                        >
                          <Award size={12} />
                          <span>{reply.isFacultyEndorsed ? 'Remove Endorsement' : 'Endorse Answer'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Reply Composer */}
            <form onSubmit={handlePostReply}>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label">Write your contribution / answer:</label>
                <textarea
                  required
                  rows={3}
                  className="form-textarea"
                  placeholder="Provide technical solution, code snippet, or explanation..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={submittingReply}
                  className="btn btn-primary"
                >
                  <Send size={16} />
                  <span>{submittingReply ? 'Posting...' : 'Post Response'}</span>
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Modal: Create Topic */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Start Academic Discussion Thread"
        maxWidth="600px"
      >
        <form onSubmit={handleCreateTopic}>
          <div className="form-group">
            <label className="form-label">Discussion Title</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Distributed Consensus Split-Vote Resolution"
              value={newTopicForm.title}
              onChange={(e) => setNewTopicForm({ ...newTopicForm, title: e.target.value })}
            />
          </div>

          <div className="grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Associated Course (Optional)</label>
              <select
                className="form-select"
                value={newTopicForm.courseId}
                onChange={(e) => setNewTopicForm({ ...newTopicForm, courseId: e.target.value })}
              >
                <option value="">Platform-Wide (General)</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.courseCode} - {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={newTopicForm.category}
                onChange={(e) => setNewTopicForm({ ...newTopicForm, category: e.target.value })}
              >
                <option value="General">General</option>
                <option value="Project Help">Project Help</option>
                <option value="Code Architecture">Code Architecture</option>
                <option value="Announcements">Announcements</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Inquiry / Topic Description</label>
            <textarea
              required
              rows={4}
              className="form-textarea"
              placeholder="Describe your inquiry, reproduce steps, or conceptual questions..."
              value={newTopicForm.content}
              onChange={(e) => setNewTopicForm({ ...newTopicForm, content: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Raft, Consensus, Distributed"
              value={newTopicForm.tags}
              onChange={(e) => setNewTopicForm({ ...newTopicForm, tags: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingTopic}
              className="btn btn-primary"
            >
              {creatingTopic ? 'Publishing...' : 'Publish Thread'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
