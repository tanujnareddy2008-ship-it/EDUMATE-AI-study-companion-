import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  Play, 
  Pause, 
  FastForward, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck, 
  Flame,
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';

export const PracticeTimerModal: React.FC = () => {
  const {
    profile,
    isPracticing,
    practiceSecondsRemaining,
    startPractice,
    pausePractice,
    addExtraThirtyMinutes,
    stopPractice,
    practicePreparedModalOpen,
    setPracticePreparedModalOpen,
    fastForwardPracticeTimer,
    setActiveQuiz,
    setActiveTab,
  } = useApp();

  const totalDuration = 30 * 60;
  const elapsed = totalDuration - practiceSecondsRemaining;
  const minutes = Math.floor(practiceSecondsRemaining / 60);
  const seconds = practiceSecondsRemaining % 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalDuration - practiceSecondsRemaining) / totalDuration) * 100));

  const handleLaunchQuiz = () => {
    setPracticePreparedModalOpen(false);
    stopPractice();
    setActiveQuiz({
      title: `Topic Mastery Quiz (10 Questions)`,
      topic: profile.currentTopic,
      questions: [],
      isWeakTopicRevision: false,
    });
    setActiveTab('quiz');
  };

  const handleNeedMoreTime = () => {
    // "if they enter yes then add only extra 30 min to it"
    addExtraThirtyMinutes();
  };

  return (
    <>
      {/* 30-Minute Preparedness Confirmation Dialog */}
      {practicePreparedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-indigo-100 text-center relative animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Clock className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-2">
              30 Minutes Practice Completed!
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">
              Are you prepared for the quiz?
            </h3>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              You have completed 30 minutes of continuous supervised practice on <span className="font-bold text-indigo-600">"{profile.currentTopic}"</span>.
              <br />
              If you feel confident, we will launch your 10-question quiz now. If you need more preparation, we will add <span className="font-bold text-amber-600">an extra 30 minutes</span>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleNeedMoreTime}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Yes, Add Extra 30 Min</span>
              </button>

              <button
                type="button"
                onClick={handleLaunchQuiz}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white shadow-md shadow-indigo-500/25 transition flex items-center justify-center space-x-2"
              >
                <span>Ready! Start 10Q Quiz</span>
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Practice Monitor Card (Rendered on Practice View or floating bar) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Monitored Practice Session
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <ShieldCheck className="w-3.5 h-3.5" />
                Focus Guardian Active
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              30-Minute Continuous Preparation Timer
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Current Target: <span className="font-semibold text-slate-800">{profile.selectedSubject}</span> • Topic: <span className="font-bold text-indigo-600">{profile.currentTopic}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fastForwardPracticeTimer}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition flex items-center gap-1.5"
              title="Fast-forward countdown to 5 seconds to test quiz trigger prompt immediately"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Demo Fast-Forward (5s)</span>
            </button>
          </div>
        </div>

        {/* Circular / Large Digital Stopwatch */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-50/50 to-sky-50/50 rounded-3xl border border-indigo-100">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* SVG Ring Progress */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * progressPercent) / 100}
                  strokeLinecap="round"
                  className="text-indigo-600 transition-all duration-1000 ease-linear"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                  {isPracticing ? 'In Progress' : practiceSecondsRemaining === 0 ? 'Completed' : 'Ready'}
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                onClick={isPracticing ? pausePractice : () => startPractice(30)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 ${
                  isPracticing
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25'
                }`}
              >
                {isPracticing ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>{practiceSecondsRemaining < 30 * 60 && practiceSecondsRemaining > 0 ? 'Resume' : 'Start 30m'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  stopPractice();
                  startPractice(30);
                }}
                className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
                title="Reset to 30 mins"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Guidelines, Focus Rule & Quick Direct Quiz */}
          <div className="md:col-span-2 space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                    Focus Guardian Rules &amp; Protection
                  </h4>
                  <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                    Per system discipline guidelines: continuous 30-minute practice is actively monitored. If the tab is closed or abandoned during active preparation, Focus Guardian will re-lock one game level and mute notifications to enforce learning retention.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Curated Study Plan</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Focus on core theorems, boundary equations, and active recall. Once the timer expires, EDUMATE will verify your preparation before conducting the 10-question evaluation.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Direct Quiz Shortcut (Rule 18)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  In a hurry? You can decide the topic and immediately take the quiz without running the 30-minute study timer.
                </p>
                <button
                  type="button"
                  onClick={handleLaunchQuiz}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-100/70 hover:bg-indigo-200/70 transition"
                >
                  ⚡ Direct Quiz Mode (Skip Practice)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
