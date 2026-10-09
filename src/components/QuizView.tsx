import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Question } from '../types';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Star, 
  Coins, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  GitBranch, 
  Award, 
  HelpCircle,
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
  Plus
} from 'lucide-react';

export const QuizView: React.FC = () => {
  const {
    profile,
    activeQuiz,
    setActiveQuiz,
    addQuizScore,
    uploadedDocument,
    isStrictGrounding,
    addWeakTopic,
    setActiveTab,
    startWeakTopicQuiz,
  } = useApp();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scoreResult, setScoreResult] = useState<{ stars: number; points: number } | null>(null);
  const [customQuestionCount, setCustomQuestionCount] = useState<number>(
    activeQuiz?.isWeakTopicRevision ? 20 : 10
  );
  const [topicInput, setTopicInput] = useState<string>(activeQuiz?.topic || profile.currentTopic);

  const fetchQuestions = async (count: number, topicName: string) => {
    setIsLoading(true);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setCurrentIndex(0);
    setScoreResult(null);

    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicName || profile.currentTopic,
          subject: profile.selectedSubject,
          examType: profile.examType,
          count: count,
          fileData: uploadedDocument?.base64,
          mimeType: uploadedDocument?.mimeType,
          isStrictGrounding: isStrictGrounding && Boolean(uploadedDocument),
          isPYQFocused: true,
          isWeakTopicRevision: activeQuiz?.isWeakTopicRevision || false,
        }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error('Quiz fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const qCount = activeQuiz?.isWeakTopicRevision ? 20 : 10;
    setCustomQuestionCount(qCount);
    const chosenTopic = activeQuiz?.topic || profile.currentTopic;
    setTopicInput(chosenTopic);
    fetchQuestions(qCount, chosenTopic);
  }, [activeQuiz]);

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    let correctCount = 0;
    const weakList: string[] = [];

    questions.forEach((q, idx) => {
      const isCorrect = selectedAnswers[idx] === q.correctIndex;
      if (isCorrect) {
        correctCount++;
      } else {
        if (q.subtopic) weakList.push(q.subtopic);
        else weakList.push(q.topic);
      }
    });

    weakList.forEach((w) => addWeakTopic(w));

    // Calculate stars and points per Requirement 7
    const result = addQuizScore(correctCount, questions.length);
    setScoreResult(result);

    if (result.stars >= 3) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleExpandQuestions = (extra: number) => {
    const newCount = customQuestionCount + extra;
    setCustomQuestionCount(newCount);
    fetchQuestions(newCount, topicInput);
  };

  const currentQ = questions[currentIndex];
  const totalCorrect = questions.filter((q, idx) => selectedAnswers[idx] === q.correctIndex).length;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in">
      
      {/* Quiz Header Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                activeQuiz?.isWeakTopicRevision
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
              }`}>
                {activeQuiz?.isWeakTopicRevision ? 'Targeted Weak Topic Diagnostic' : 'Standard 10-Question Quiz'}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {profile.selectedSubject}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {topicInput}
            </h2>
          </div>

          {/* Quick topic change & refresh */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Decide topic..."
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => fetchQuestions(customQuestionCount, topicInput)}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition"
            >
              Reload
            </button>
          </div>
        </div>

        {/* Progress & Question count selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <span>Answered: <strong>{answeredCount} / {questions.length}</strong></span>
            {isStrictGrounding && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                PDF Grounded
              </span>
            )}
          </div>

          {/* Expand Question Count (Requirement 13) */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Need more questions?</span>
            <button
              onClick={() => handleExpandQuestions(5)}
              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-[11px] font-bold transition flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> 5
            </button>
            <button
              onClick={() => handleExpandQuestions(10)}
              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-[11px] font-bold transition flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> 10
            </button>
            <button
              onClick={() => handleExpandQuestions(20)}
              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-[11px] font-bold transition flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> 20
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-800">Generating Questions via AI...</h3>
          <p className="text-xs text-slate-500 mt-1">
            Formatting multiple choice questions with authentic PYQ patterns and detailed solutions.
          </p>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
          <p className="text-sm text-slate-600">No questions available. Click reload to generate.</p>
          <button
            onClick={() => fetchQuestions(10, topicInput)}
            className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
          >
            Generate 10 Questions
          </button>
        </div>
      ) : (
        <>
          {/* Question Palettes & Navigation Pill */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 flex flex-wrap gap-1.5 items-center justify-center">
            {questions.map((_, idx) => {
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                      : isSubmitted
                      ? selectedAnswers[idx] === questions[idx].correctIndex
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                      : isAnswered
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question Display */}
          {currentQ && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              
              {/* Question Stem Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-extrabold">
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      currentQ.difficulty === 'Hard'
                        ? 'bg-rose-50 text-rose-700'
                        : currentQ.difficulty === 'Medium'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {currentQ.difficulty}
                    </span>
                    {currentQ.isPYQ && (
                      <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                        ⭐ {currentQ.pyqTag || 'Previous Year Question'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2 leading-relaxed">
                    {currentQ.question}
                  </h3>
                </div>
              </div>

              {/* Options List */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  const isCorrect = currentQ.correctIndex === optIdx;

                  let optionStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700';

                  if (isSubmitted) {
                    if (isCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-300';
                    } else {
                      optionStyle = 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyle = 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-200 font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(currentIndex, optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition flex items-center justify-between ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-200/60 text-slate-700 flex items-center justify-center font-mono text-xs font-bold">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {isSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Step-by-Step Explanation when submitted */}
              {isSubmitted && (
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 animate-in fade-in">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs mb-1">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Verified Step-by-Step Solution &amp; Conceptual Explanation</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Bottom Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {currentIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1.5"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    !isSubmitted && (
                      <button
                        type="button"
                        onClick={handleSubmitQuiz}
                        className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 transition flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit &amp; Evaluate Quiz</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Requirement 7: Star Rating & Points Results Modal */}
          {scoreResult && isSubmitted && (
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 animate-in zoom-in-95">
              <div className="text-center space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-black uppercase tracking-wider border border-yellow-400/30">
                  Performance &amp; Credit Award
                </div>
                <h3 className="text-2xl sm:text-3xl font-black">
                  Quiz Completed: {totalCorrect} / {questions.length} Correct
                </h3>
                <p className="text-xs text-indigo-200">
                  Calculated based on your speed, accuracy, and depth of reasoning.
                </p>
              </div>

              {/* Star Rating & Points Conversion (5 Star = 10 pts, 4 Star = 8 pts, etc.) */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                {/* Star display */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-8 h-8 ${
                        i < scoreResult.stars
                          ? 'fill-yellow-400 text-yellow-400 animate-bounce'
                          : 'text-white/30'
                      }`}
                    />
                  ))}
                </div>

                <div className="h-8 w-px bg-white/20 hidden sm:block" />

                {/* Star to Points Badge */}
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-amber-400 text-amber-950 font-black text-sm flex items-center gap-2 shadow-md">
                    <Coins className="w-4 h-4" />
                    <span>+{scoreResult.points} Points Earned</span>
                  </div>
                  <span className="text-xs text-indigo-200 font-semibold">
                    ({scoreResult.stars} Star Rating = {scoreResult.points} Pts)
                  </span>
                </div>
              </div>

              {/* Knowledge Level Estimation (Rule 11) */}
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-center">
                <span className="text-xs text-indigo-200 uppercase font-bold tracking-wider">
                  Estimated Knowledge Level on "{topicInput}"
                </span>
                <div className="mt-1 text-xl font-black text-yellow-300 flex items-center justify-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span>{profile.knowledgeLevel} Tier</span>
                </div>
                <p className="text-xs text-indigo-200/90 mt-1">
                  Keep reviewing weak sub-concepts to advance to the next mastery tier and unlock higher game levels!
                </p>
              </div>

              {/* Action Buttons for Next Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  onClick={() => startWeakTopicQuiz(0)}
                  className="p-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Re-Quiz Weak Topics (20Q)</span>
                </button>

                <button
                  onClick={() => setActiveTab('revision')}
                  className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                >
                  <GitBranch className="w-4 h-4" />
                  <span>View Revision Diagrams</span>
                </button>

                <button
                  onClick={() => setActiveTab('games')}
                  className="p-3 rounded-xl bg-white hover:bg-indigo-50 text-indigo-900 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Play Unlocked Games ({profile.totalPoints} Pts)</span>
                  <ChevronRight className="w-4 h-4 text-indigo-600" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};
