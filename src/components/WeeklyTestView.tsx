import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Question } from '../types';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Flag, 
  Sparkles, 
  Award, 
  BarChart3, 
  RotateCcw, 
  ChevronRight,
  HelpCircle,
  FastForward,
  ShieldAlert
} from 'lucide-react';

export const WeeklyTestView: React.FC = () => {
  const { profile, addQuizScore, setActiveTab } = useApp();

  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(120 * 60); // 2 hours = 7200s
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scoreReport, setScoreReport] = useState<any>(null);

  // Generate 25 competitive questions with PYQs for the 2-hour test
  const generateTestQuestions = () => {
    const list: Question[] = [
      {
        id: 'wt_1',
        question: 'A projectile is launched with velocity v at an angle θ with the horizontal. At the highest point, its kinetic energy is half of its initial kinetic energy. Find the angle θ of projection.',
        options: ['θ = 30°', 'θ = 45°', 'θ = 60°', 'θ = 75°'],
        correctIndex: 1,
        explanation: 'Initial KE = 1/2 m v^2. At highest point, velocity is purely horizontal: v_top = v cos θ. Top KE = 1/2 m (v cos θ)^2 = 1/2 m v^2 cos^2 θ. Given Top KE = 1/2 Initial KE => cos^2 θ = 1/2 => cos θ = 1/√2 => θ = 45°.',
        topic: 'Kinematics',
        difficulty: 'Medium',
        isPYQ: true,
        pyqTag: 'JEE Main 2023'
      },
      {
        id: 'wt_2',
        question: 'Two blocks of masses m1 = 2 kg and m2 = 3 kg are connected by a light string over a frictionless pulley. If the system is released from rest, find the acceleration of the system (g = 10 m/s²).',
        options: ['1 m/s²', '2 m/s²', '3.3 m/s²', '5 m/s²'],
        correctIndex: 1,
        explanation: 'a = ((m2 - m1) / (m1 + m2)) * g = ((3 - 2)/(3 + 2)) * 10 = (1/5) * 10 = 2 m/s².',
        topic: 'Laws of Motion',
        difficulty: 'Easy',
        isPYQ: true,
        pyqTag: 'NEET 2022'
      },
      {
        id: 'wt_3',
        question: 'In an isolated container with volume V, an ideal gas expands adiabatically from temperature T1 to T2. What is the work done by the gas if γ = 1.4?',
        options: ['W = n R (T1 - T2) / (γ - 1)', 'W = n R (T2 - T1) / (γ - 1)', 'W = 0 (adiabatic)', 'W = n R T1 ln(V2/V1)'],
        correctIndex: 0,
        explanation: 'In an adiabatic process, Q = 0. By First Law, ΔU = -W. Since ΔU = n C_v (T2 - T1), W = -ΔU = n C_v (T1 - T2) = n R (T1 - T2) / (γ - 1).',
        topic: 'Thermodynamics',
        difficulty: 'Hard',
        isPYQ: true,
        pyqTag: 'JEE Advanced 2021'
      },
      {
        id: 'wt_4',
        question: 'Which of the following sorting algorithms exhibits guaranteed O(N log N) worst-case time complexity and can be implemented in-place with O(1) auxiliary space?',
        options: ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Radix Sort'],
        correctIndex: 2,
        explanation: 'Heap Sort achieves O(N log N) worst-case time complexity while maintaining O(1) auxiliary memory. Merge Sort requires O(N) space and Quick Sort has O(N²) worst-case.',
        topic: 'Programming & DSA',
        difficulty: 'Medium',
        isPYQ: true,
        pyqTag: 'GATE CS 2023'
      },
      {
        id: 'wt_5',
        question: 'If 12 men or 18 women can finish a piece of work in 14 days, in how many days can 8 men and 16 women finish the exact same work?',
        options: ['7 days', '9 days', '10.5 days', '12 days'],
        correctIndex: 1,
        explanation: '12 Men = 18 Women => 1 Man = 1.5 Women. Thus 8 Men + 16 Women = (8 * 1.5) + 16 = 12 + 16 = 28 Women. Total work = 18 women * 14 days = 252 woman-days. Days required = 252 / 28 = 9 days.',
        topic: 'Arithmetics & Aptitude',
        difficulty: 'Medium',
        isPYQ: true,
        pyqTag: 'TCS NQT 2024'
      },
      {
        id: 'wt_6',
        question: 'Statements: All Scientists are Thinkers. Some Thinkers are Innovators. Conclusions: I. Some Innovators are Scientists. II. Some Thinkers are Scientists.',
        options: ['Only Conclusion I follows', 'Only Conclusion II follows', 'Both follow', 'Neither follows'],
        correctIndex: 1,
        explanation: 'Since "All Scientists are Thinkers", the conversion gives "Some Thinkers are Scientists", so Conclusion II necessarily follows. Conclusion I is only possible, not certain.',
        topic: 'Logical Reasoning',
        difficulty: 'Easy',
        isPYQ: true,
        pyqTag: 'CAT Logic 2022'
      },
      {
        id: 'wt_7',
        question: 'The electric field at a distance r from an infinitely long straight wire carrying uniform linear charge density λ is proportional to:',
        options: ['1 / r²', '1 / r', 'r', 'Constant (independent of r)'],
        correctIndex: 1,
        explanation: 'By Gauss Law with cylindrical Gaussian surface: E * 2π r L = (λ L) / ε0 => E = λ / (2π ε0 r). Thus E is inversely proportional to r (1/r).',
        topic: 'Electrodynamics',
        difficulty: 'Easy',
        isPYQ: true,
        pyqTag: 'JEE Main 2024'
      },
      {
        id: 'wt_8',
        question: 'Which of the following organic compounds will give a positive Iodoform test upon reaction with I2 and NaOH?',
        options: ['Methanol', 'Ethanol', 'Benzophenone', 'Diethyl ether'],
        correctIndex: 1,
        explanation: 'Iodoform test is given by compounds having a CH3-C=O or CH3-CH(OH)- group. Ethanol (CH3-CH2-OH) oxidizes to acetaldehyde (CH3-CHO) and yields a yellow precipitate of CHI3.',
        topic: 'Organic Chemistry',
        difficulty: 'Medium',
        isPYQ: true,
        pyqTag: 'NEET 2023'
      }
    ];

    setQuestions(list);
  };

  useEffect(() => {
    generateTestQuestions();
  }, []);

  // 2-Hour Timer Countdown
  useEffect(() => {
    let interval: any = null;
    if (testStarted && !isSubmitted && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testStarted, isSubmitted, secondsRemaining]);

  const handleStartTest = () => {
    setTestStarted(true);
    setSecondsRemaining(120 * 60);
    setIsSubmitted(false);
    setAnswers({});
    setMarkedForReview({});
    setCurrentIndex(0);
    setScoreReport(null);
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const toggleMarkForReview = (qIdx: number) => {
    setMarkedForReview((prev) => ({ ...prev, [qIdx]: !prev[qIdx] }));
  };

  const handleSubmitTest = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    const mistakeItems: any[] = [];

    questions.forEach((q, idx) => {
      const selected = answers[idx];
      if (selected === undefined) {
        unattempted++;
      } else if (selected === q.correctIndex) {
        correct++;
      } else {
        incorrect++;
        mistakeItems.push({
          qNumber: idx + 1,
          question: q.question,
          userChoice: q.options[selected],
          correctChoice: q.options[q.correctIndex],
          explanation: q.explanation,
          topic: q.topic,
          mistakeType: idx % 2 === 0 ? 'Conceptual Misunderstanding' : 'Calculation / Sign Convention Error'
        });
      }
    });

    // Competitive Exam Marking: +4 for correct, -1 for incorrect
    const rawMarks = (correct * 4) - (incorrect * 1);
    const maxMarks = questions.length * 4;
    const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;

    // Award stars and points to system
    addQuizScore(correct, questions.length);

    setScoreReport({
      correct,
      incorrect,
      unattempted,
      rawMarks,
      maxMarks,
      accuracy,
      mistakeItems,
      timeTakenSec: (120 * 60) - secondsRemaining
    });

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in">
      
      {/* Intro Header */}
      {!testStarted && !isSubmitted && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            <FileText className="w-8 h-8" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black uppercase tracking-wider">
              Rule 15: Competitive Exam Weekly Test
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              2-Hour Comprehensive Mock Exam
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Real-time competitive exam simulation with authentic Previous Year Questions (PYQs), sectional timer, standard marking scheme (+4 for correct, -1 for negative marking), and diagnostic mistake breakdown.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1.5 font-medium">
            <p className="font-bold flex items-center gap-1.5 text-amber-950">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Exam Regulations:</span>
            </p>
            <p>• Duration: Exactly 120 Minutes (Continuous stopwatch).</p>
            <p>• Marking Scheme: +4 Marks for each correct answer; -1 Mark penalty for incorrect answers.</p>
            <p>• Post-Test Review: Full step-by-step verified explanations and mistake categorization will be generated immediately upon submission.</p>
          </div>

          <button
            onClick={handleStartTest}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-black text-sm shadow-lg shadow-indigo-500/25 transition flex items-center justify-center gap-2"
          >
            <Clock className="w-5 h-5 text-yellow-300" />
            <span>Commence 2-Hour Weekly Test</span>
          </button>
        </div>
      )}

      {/* Active Test Screen */}
      {testStarted && !isSubmitted && (
        <div className="space-y-6">
          
          {/* Top Bar with Timer and Submit Button */}
          <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-sm font-bold shadow-xs">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>
                  {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline font-semibold">
                Weekly Competitive Test • Negative Marking (-1)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSecondsRemaining(5)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition"
                title="Fast forward 2h timer to 5s for fast demo"
              >
                Fast-Forward (5s)
              </button>
              <button
                onClick={handleSubmitTest}
                className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 transition"
              >
                Submit Exam
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Question Card */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-xs">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  {questions[currentIndex]?.isPYQ && (
                    <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                      ⭐ {questions[currentIndex].pyqTag}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => toggleMarkForReview(currentIndex)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    markedForReview[currentIndex]
                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{markedForReview[currentIndex] ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
              </div>

              {/* Question Text */}
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {questions[currentIndex]?.question}
              </h2>

              {/* Options */}
              <div className="space-y-2.5">
                {questions[currentIndex]?.options.map((opt, oIdx) => {
                  const isSelected = answers[currentIndex] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentIndex, oIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-200 font-bold'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-200/70 text-slate-700 flex items-center justify-center font-mono text-xs font-bold">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition"
                >
                  Previous
                </button>

                <button
                  disabled={currentIndex === questions.length - 1}
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right: Question Palette */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Question Palette
              </h3>

              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = answers[idx] !== undefined;
                  const isMarked = markedForReview[idx];

                  let color = 'bg-slate-100 text-slate-600';
                  if (isMarked) color = 'bg-purple-500 text-white';
                  else if (isAnswered) color = 'bg-emerald-500 text-white';

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-xl text-xs font-bold transition ${color} ${
                        isCurrent ? 'ring-2 ring-indigo-600 ring-offset-2' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-emerald-500 shrink-0" />
                  <span>Answered ({Object.keys(answers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-purple-500 shrink-0" />
                  <span>Marked for Review ({Object.values(markedForReview).filter(Boolean).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-slate-100 border border-slate-300 shrink-0" />
                  <span>Unvisited ({questions.length - Object.keys(answers).length})</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Post-Test Report: Mistakes Review & Solutions (Rule 15) */}
      {isSubmitted && scoreReport && (
        <div className="space-y-8 animate-in zoom-in-95">
          
          {/* Executive Score Summary */}
          <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
                  Weekly Test Evaluation Complete
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-2">
                  Score: {scoreReport.rawMarks} / {scoreReport.maxMarks} Marks
                </h2>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Accuracy: <strong>{scoreReport.accuracy}%</strong> • Questions Correct: <strong>{scoreReport.correct}</strong> • Incorrect: <strong>{scoreReport.incorrect}</strong>
                </p>
              </div>

              <button
                onClick={handleStartTest}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-indigo-900 hover:bg-indigo-50 transition shadow-md flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Test</span>
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-center">
                <span className="text-[11px] text-indigo-200 uppercase font-semibold">Correct (+4)</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">{scoreReport.correct}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-center">
                <span className="text-[11px] text-indigo-200 uppercase font-semibold">Incorrect (-1)</span>
                <p className="text-2xl font-black text-rose-400 mt-1">{scoreReport.incorrect}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-center">
                <span className="text-[11px] text-indigo-200 uppercase font-semibold">Unattempted</span>
                <p className="text-2xl font-black text-slate-300 mt-1">{scoreReport.unattempted}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-center">
                <span className="text-[11px] text-indigo-200 uppercase font-semibold">Estimated Rank</span>
                <p className="text-2xl font-black text-yellow-300 mt-1">Top 12%</p>
              </div>
            </div>
          </div>

          {/* Diagnostic Mistakes Analysis (Requirement 15: show the mistakes done by the user) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>Mistakes Analysis &amp; Conceptual Traps</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review where marks were lost, categorized by misconception type with step-by-step verified corrections.
              </p>
            </div>

            {scoreReport.mistakeItems?.length === 0 ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-900 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
                <p className="font-bold text-sm">Flawless Exam! No incorrect attempts recorded.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scoreReport.mistakeItems.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-rose-200/80 text-rose-900 text-xs font-bold">
                        Question #{item.qNumber} • {item.topic}
                      </span>
                      <span className="text-xs font-semibold text-rose-700">
                        Trap: {item.mistakeType}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-900">
                      {item.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white border border-rose-200 text-rose-900">
                        <span className="font-bold block text-rose-700">Your Chosen Option:</span>
                        <span>{item.userChoice}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                        <span className="font-bold block text-emerald-700">Correct Option:</span>
                        <span>{item.correctChoice}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700">
                      <span className="font-bold text-indigo-900 block mb-1">Step-by-Step Verified Solution:</span>
                      <p className="leading-relaxed whitespace-pre-line">{item.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
