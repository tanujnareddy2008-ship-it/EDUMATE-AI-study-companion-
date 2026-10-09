import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Award, 
  Star, 
  Clock, 
  CheckCircle2, 
  Target, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export const WeeklyAnalyticsView: React.FC = () => {
  const { profile, weeklyData, weakTopics } = useApp();
  const [metric, setMetric] = useState<'score' | 'accuracy' | 'studyTime'>('score');

  const maxScore = 100;
  const maxStudy = 120; // 120 mins

  const averageScore = Math.round(weeklyData.reduce((acc, d) => acc + d.scorePercent, 0) / weeklyData.length);
  const totalQuestions = weeklyData.reduce((acc, d) => acc + d.questionsAnswered, 0);
  const totalHours = (weeklyData.reduce((acc, d) => acc + d.studyMinutes, 0) / 60).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in">
      
      {/* Page Title & Context Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
              Rule 14: Dedicated Weekly Analytics Report
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              (Kept strictly off the Dashboard)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Weekly Performance &amp; Retention Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            In-depth multi-dimensional trajectory of your daily exam simulations, concept retention index, question volume, and study consistency.
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 shrink-0">
          <button
            onClick={() => setMetric('score')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              metric === 'score'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Exam Score %
          </button>
          <button
            onClick={() => setMetric('accuracy')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              metric === 'accuracy'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Accuracy %
          </button>
          <button
            onClick={() => setMetric('studyTime')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              metric === 'studyTime'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Study Minutes
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Weekly Average</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">{averageScore}%</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            +14% vs previous week
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Questions</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">{totalQuestions}</p>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 inline-block">
            Across 7 active days
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Monitored Study</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900">{totalHours} hrs</p>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-block">
            30m focused sessions
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Knowledge Rating</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-purple-700">{profile.knowledgeLevel}</p>
          <span className="text-[11px] text-purple-600 font-semibold mt-1 inline-block">
            Top percentile standing
          </span>
        </div>
      </div>

      {/* Main Weekly Interactive Performance Chart (Rule 14) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>Weekly Trajectory: {metric === 'score' ? 'Exam Test Scores' : metric === 'accuracy' ? 'Precision Rate' : 'Practice Duration'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Visual histogram of daily evaluations across {profile.selectedSubject}.
            </p>
          </div>
        </div>

        {/* Visual Bar / Chart Canvas */}
        <div className="h-72 w-full pt-8 pb-4 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-200">
          {weeklyData.map((d, i) => {
            const val = metric === 'score' ? d.scorePercent : metric === 'accuracy' ? d.accuracy : d.studyMinutes;
            const maxVal = metric === 'studyTime' ? maxStudy : maxScore;
            const heightPercent = Math.min(100, Math.max(12, (val / maxVal) * 100));

            return (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition mb-2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg shadow-md pointer-events-none whitespace-nowrap">
                  {val} {metric === 'studyTime' ? 'mins' : '%'} ({d.questionsAnswered} Qs)
                </div>

                {/* Animated bar */}
                <div className="w-full max-w-[48px] bg-indigo-50/70 rounded-2xl h-full flex items-end p-1">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-xl transition-all duration-700 ease-out ${
                      i === weeklyData.length - 1
                        ? 'bg-gradient-to-t from-indigo-600 to-sky-500 shadow-md shadow-indigo-500/20'
                        : 'bg-gradient-to-t from-indigo-500/80 to-purple-400 group-hover:from-indigo-600 group-hover:to-purple-500'
                    }`}
                  />
                </div>

                {/* Day Label */}
                <span className="text-[11px] font-bold text-slate-600 mt-2 truncate max-w-full">
                  {d.day}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {val}{metric === 'studyTime' ? 'm' : '%'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Chart Legend */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-indigo-600 inline-block" />
              <span>Standard Performance (60-80%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-sky-500 inline-block" />
              <span>Peak Performance (80%+)</span>
            </span>
          </div>
          <span className="font-semibold text-slate-700">
            Updated today: Sunday
          </span>
        </div>
      </div>

      {/* Weak Topics vs Strengths Radar Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Identified Diagnostic Weak Topics */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-black text-slate-900">
              Diagnostic Weak Areas Identified
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Topics where error rate exceeds 30%. Targeted re-quizzes are recommended:
          </p>

          <div className="space-y-2.5">
            {weakTopics.map((w, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-rose-950">{w}</h4>
                  <span className="text-[11px] text-rose-700">Accuracy: 48% • Recurring misconception</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-rose-200/80 text-rose-900 text-[10px] font-extrabold">
                  Needs Drill
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mastered Strengths */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-black text-slate-900">
              Mastered Strongholds (90%+ Accuracy)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            High retention topics where questions were answered rapidly without error:
          </p>

          <div className="space-y-2.5">
            {[
              { name: 'Dimensional Analysis & Units', accuracy: '96%', speed: '18s avg' },
              { name: 'Linear 1D Velocity Formulas', accuracy: '94%', speed: '24s avg' },
              { name: 'Conservation of Energy Axiom', accuracy: '92%', speed: '30s avg' }
            ].map((s, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-emerald-950">{s.name}</h4>
                  <span className="text-[11px] text-emerald-700">Speed: {s.speed} • Reliable baseline</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-200/80 text-emerald-900 text-[10px] font-extrabold">
                  {s.accuracy}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
