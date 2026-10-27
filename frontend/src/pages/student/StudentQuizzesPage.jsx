import React, { useState, useEffect } from 'react';
import { quizService, courseService } from '../../services/courseService';
import { Modal, Badge } from '../../components/common/CommonUI';
import { HelpCircle, Clock, CheckCircle2, XCircle, Award, AlertCircle, Play, RotateCcw } from 'lucide-react';

export const StudentQuizzesPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Taking Quiz State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [quizCompletedResult, setQuizCompletedResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const res = await courseService.getCourses();
        if (res.success && res.courses?.length > 0) {
          setCourses(res.courses);
          setSelectedCourseId(res.courses[0]._id);
        }
      } catch (err) {
        console.error('Error loading courses:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const fetchQuizzes = async () => {
    if (!selectedCourseId) return;
    try {
      setLoading(true);
      const res = await quizService.getByCourse(selectedCourseId);
      if (res.success) {
        setQuizzes(res.quizzes || []);
      }
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [selectedCourseId]);

  // Timer interval when active quiz is running
  useEffect(() => {
    if (!activeQuiz || quizCompletedResult || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, quizCompletedResult, timeLeftSeconds]);

  const handleStartQuiz = async (quiz) => {
    try {
      // Fetch fresh quiz questions
      const res = await quizService.getById(quiz._id);
      if (res.success) {
        setActiveQuiz(res.quiz);
        setCurrentQuestionIdx(0);
        setSelectedAnswers({});
        setTimeLeftSeconds((res.quiz.timeLimitMinutes || 20) * 60);
        setQuizCompletedResult(res.myAttempt || null);
      }
    } catch (err) {
      alert('Failed to initialize quiz session');
    }
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (quizCompletedResult) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex
    });
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || submitting) return;
    try {
      setSubmitting(true);
      const formattedAnswers = (activeQuiz.questions || []).map((q, idx) => ({
        questionId: q._id,
        questionIndex: idx,
        selectedOption: selectedAnswers[q._id] !== undefined ? selectedAnswers[q._id] : null
      }));

      const res = await quizService.submitAttempt(activeQuiz._id, {
        answers: formattedAnswers,
        timeSpentSeconds: ((activeQuiz.timeLimitMinutes || 20) * 60) - timeLeftSeconds
      });

      if (res.success) {
        setQuizCompletedResult(res.attempt);
        // Refresh full quiz with explanations
        const updatedQuiz = await quizService.getById(activeQuiz._id);
        if (updatedQuiz.success) {
          setActiveQuiz(updatedQuiz.quiz);
        }
        await fetchQuizzes();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting test attempt');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="page-container">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Quizzes & Knowledge Evaluations</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Test conceptual retention with timed auto-graded challenges and detailed rationales.
          </p>
        </div>

        {courses.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Course:</span>
            <select
              className="form-select"
              style={{ width: '260px' }}
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.courseCode} - {c.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Quizzes List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading quizzes...
        </div>
      ) : quizzes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No quizzes scheduled for this course yet.
        </div>
      ) : (
        <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '0.35rem' }}>
                    Pass Requirement: {quiz.passPercentage}%
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{quiz.title}</h3>
                </div>

                <div>
                  {quiz.isCompleted ? (
                    <span className={`badge ${quiz.myAttempt?.passed ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.8rem' }}>
                      Score: {quiz.myAttempt?.percentage}%
                    </span>
                  ) : (
                    <span className="badge badge-neutral" style={{ fontSize: '0.8rem' }}>
                      Not Attempted
                    </span>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.75rem 0', lineHeight: 1.5 }}>
                {quiz.description}
              </p>

              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <HelpCircle size={14} /> {quiz.questionsCount || quiz.questions?.length} Questions
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={14} /> {quiz.timeLimitMinutes} Minutes
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Award size={14} /> {quiz.totalPoints} Total Points
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className={`btn btn-sm ${quiz.isCompleted ? 'btn-secondary' : 'btn-primary'}`}
                >
                  <Play size={14} />
                  <span>{quiz.isCompleted ? 'Review Answers & Explanations' : 'Start Test Session'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Timed Quiz Interface Modal */}
      {activeQuiz && (
        <Modal
          isOpen={!!activeQuiz}
          onClose={() => setActiveQuiz(null)}
          title={activeQuiz.title}
          maxWidth="750px"
        >
          {/* Quiz Top status Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.25rem',
              marginBottom: '1.5rem',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
              Question {currentQuestionIdx + 1} of {activeQuiz.questions?.length}
            </div>

            {!quizCompletedResult ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  color: timeLeftSeconds < 60 ? 'var(--danger)' : 'var(--primary)'
                }}
              >
                <Clock size={16} />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`badge ${quizCompletedResult.passed ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.85rem' }}>
                  Final Score: {quizCompletedResult.percentage}% ({quizCompletedResult.passed ? 'PASSED' : 'FAILED'})
                </span>
              </div>
            )}
          </div>

          {/* Current Question Body */}
          {activeQuiz.questions && activeQuiz.questions[currentQuestionIdx] && (
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {currentQuestionIdx + 1}. {activeQuiz.questions[currentQuestionIdx].questionText}
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {activeQuiz.questions[currentQuestionIdx].options.map((opt, optIdx) => {
                  const qId = activeQuiz.questions[currentQuestionIdx]._id;
                  const isSelected = selectedAnswers[qId] === optIdx;
                  const isCorrectAnswer = activeQuiz.questions[currentQuestionIdx].correctOptionIndex === optIdx;

                  let borderStyle = '1px solid var(--border-subtle)';
                  let bgStyle = 'var(--bg-secondary)';

                  if (quizCompletedResult) {
                    if (isCorrectAnswer) {
                      borderStyle = '2px solid #10b981';
                      bgStyle = 'var(--success-light)';
                    } else if (isSelected && !isCorrectAnswer) {
                      borderStyle = '2px solid #ef4444';
                      bgStyle = 'var(--danger-light)';
                    }
                  } else if (isSelected) {
                    borderStyle = '2px solid var(--primary)';
                    bgStyle = 'var(--primary-light)';
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(qId, optIdx)}
                      style={{
                        padding: '0.85rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: borderStyle,
                        backgroundColor: bgStyle,
                        cursor: quizCompletedResult ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: '1px solid var(--border-medium)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                            color: isSelected ? '#ffffff' : 'inherit'
                          }}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span style={{ fontSize: '0.9rem', fontWeight: isSelected ? 600 : 400 }}>{opt}</span>
                      </div>

                      {quizCompletedResult && (
                        <div>
                          {isCorrectAnswer && <CheckCircle2 size={18} style={{ color: '#10b981' }} />}
                          {isSelected && !isCorrectAnswer && <XCircle size={18} style={{ color: '#ef4444' }} />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Rationale explanation after quiz completion */}
              {quizCompletedResult && activeQuiz.questions[currentQuestionIdx].explanation && (
                <div style={{ backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '1rem', borderLeft: '3px solid var(--primary)', marginBottom: '1.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Conceptual Explanation
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {activeQuiz.questions[currentQuestionIdx].explanation}
                  </p>
                </div>
              )}

              {/* Question Navigation & Submit */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx((p) => p - 1)}
                  className="btn btn-secondary btn-sm"
                >
                  Previous Question
                </button>

                {currentQuestionIdx < activeQuiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                    className="btn btn-primary btn-sm"
                  >
                    Next Question
                  </button>
                ) : (
                  !quizCompletedResult && (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={submitting}
                      className="btn btn-success btn-sm"
                    >
                      {submitting ? 'Evaluating Answers...' : 'Submit & Finish Quiz'}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};
