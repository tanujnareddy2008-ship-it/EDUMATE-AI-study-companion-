import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { RevisionData } from '../types';
import { 
  GitBranch, 
  RotateCcw, 
  Sparkles, 
  AlertTriangle, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  ArrowDown, 
  HelpCircle,
  Lightbulb,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const RevisionView: React.FC = () => {
  const { profile, weakTopics, startWeakTopicQuiz } = useApp();
  const [revision, setRevision] = useState<RevisionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeStepId, setActiveStepId] = useState<number>(1);

  const fetchRevision = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/revise-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: profile.currentTopic,
          subject: profile.selectedSubject,
          weakPoints: weakTopics,
        }),
      });
      const data = await res.json();
      setRevision(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevision();
  }, [profile.currentTopic, profile.selectedSubject]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
              Rule 12: Visual Revision Hub
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Repeated Concept Drill
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {profile.currentTopic}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Flowcharts, diagrammatic representations, common exam pitfalls, and cheat-sheet equations to accelerate your conceptual retention.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
          <button
            onClick={() => startWeakTopicQuiz(0)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Diagnostic Re-Quiz (20Q)</span>
          </button>
          <button
            onClick={fetchRevision}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Regenerate Diagrams</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
          <div className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-800">Synthesizing Visual Flowcharts &amp; Diagrams...</h3>
          <p className="text-xs text-slate-500 mt-1">Generating vector blueprints and structured step-by-step logic paths.</p>
        </div>
      ) : revision ? (
        <div className="space-y-8">
          
          {/* 1. Diagrammatic Representation (SVG Rendering) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span>Diagrammatic Blueprint Representation</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visual architecture showing relationship between inputs, equations, boundary states, and invariants.
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden flex items-center justify-center">
              <div 
                className="w-full max-w-2xl flex items-center justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-80"
                dangerouslySetInnerHTML={{ __html: revision.diagramSvg }}
              />
            </div>
          </div>

          {/* 2. Interactive Flowchart (Rule 12) */}
          {revision.flowchart && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-extrabold uppercase mb-1">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Interactive Flowchart</span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {revision.flowchart.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click through the steps below to trace the exact mental algorithm required for solving complex exam questions.
                </p>
              </div>

              {/* Horizontal or Vertical Flowchart Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {revision.flowchart.steps.map((step, idx) => {
                  const isCurrent = activeStepId === step.id;
                  const stepColors = {
                    start: 'border-blue-300 bg-blue-50/60 text-blue-900',
                    process: 'border-indigo-300 bg-indigo-50/60 text-indigo-900',
                    decision: 'border-amber-300 bg-amber-50/60 text-amber-900',
                    result: 'border-emerald-300 bg-emerald-50/60 text-emerald-900',
                  };

                  return (
                    <div
                      key={step.id}
                      onClick={() => setActiveStepId(step.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition relative flex flex-col justify-between ${
                        stepColors[step.type] || 'border-slate-200 bg-slate-50'
                      } ${isCurrent ? 'ring-2 ring-indigo-500 shadow-md scale-[1.02]' : 'hover:scale-[1.01]'}`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-extrabold mb-1.5">
                          <span className="uppercase tracking-wider">Step {idx + 1}</span>
                          <span className="px-1.5 py-0.2 rounded-md bg-white/70 text-[10px] font-mono border">
                            {step.type}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold mb-1 leading-snug">
                          {step.label}
                        </h4>
                        <p className="text-[11px] opacity-80 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>

                      {idx < revision.flowchart.steps.length - 1 && (
                        <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Deep Concept Breakdown & Pitfalls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Common Student Pitfalls */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-black text-slate-900">
                  Common Traps &amp; Examination Mistakes
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                These are the top pitfalls where over 70% of exam students lose marks:
              </p>
              <div className="space-y-2.5">
                {revision.commonMistakes.map((mistake, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/80 text-xs text-rose-950 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-rose-200/80 text-rose-800 font-bold text-[11px] flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <p className="leading-relaxed">{mistake}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Cheat-Sheet / Formula Sheet */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900">
                  High-Yield Formula &amp; Shortcut Cheat-Sheet
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Speed-solving axioms to memorize for instant recall:
              </p>
              <div className="space-y-2.5">
                {revision.cheatSheet.map((tip, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2.5 font-mono"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
};
