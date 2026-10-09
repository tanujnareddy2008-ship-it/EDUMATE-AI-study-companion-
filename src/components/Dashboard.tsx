import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ImportantTopic } from '../types';
import { 
  Upload, 
  FileText, 
  FileUp, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Lock, 
  Globe, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  Play, 
  Tv, 
  BookOpen, 
  Gamepad2, 
  HelpCircle,
  FileCheck2,
  Trash2,
  Lightbulb,
  Clock,
  Compass
} from 'lucide-react';

export const Dashboard: React.FC<{ onOpenOnboarding: () => void }> = ({ onOpenOnboarding }) => {
  const { 
    profile, 
    setProfile,
    setActiveTab, 
    isStrictGrounding, 
    setIsStrictGrounding,
    uploadedDocument,
    setUploadedDocument,
    startPractice,
    setActiveQuiz,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [topicsList, setTopicsList] = useState<ImportantTopic[]>([
    {
      id: 't1',
      name: 'Kinematics in 1D & 2D Coordinates',
      importance: 'Crucial',
      weightagePercent: 28,
      pyqFrequency: '100% (Present in every JEE exam)',
      recommendedPracticeMin: 30,
      shortDescription: 'Equations of motion, projectile trajectories, and relative velocity vectors.'
    },
    {
      id: 't2',
      name: 'Newton’s Laws & Free-Body Constraints',
      importance: 'Crucial',
      weightagePercent: 24,
      pyqFrequency: 'High (8-12 Marks recurring)',
      recommendedPracticeMin: 30,
      shortDescription: 'Pulley constraints, friction threshold cones, and pseudo-force frames.'
    },
    {
      id: 't3',
      name: 'Work, Energy & Conservative Fields',
      importance: 'High',
      weightagePercent: 26,
      pyqFrequency: 'Recurring in 90% of papers',
      recommendedPracticeMin: 30,
      shortDescription: 'Work-energy theorem, potential wells, and spring-mass oscillators.'
    },
    {
      id: 't4',
      name: 'Rotational Dynamics & Moment of Inertia',
      importance: 'Crucial',
      weightagePercent: 22,
      pyqFrequency: 'Rank-deciding tough questions',
      recommendedPracticeMin: 30,
      shortDescription: 'Torque balance, parallel axis theorem, and rolling without slipping.'
    }
  ]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const isPdf = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');

    reader.onload = () => {
      const result = reader.result as string;
      // If data URL, extract base64
      let base64 = '';
      if (result.includes(',')) {
        base64 = result.split(',')[1];
      } else {
        base64 = btoa(result);
      }

      setUploadedDocument({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        mimeType: file.type || (isPdf ? 'application/pdf' : 'text/plain'),
        base64: base64,
        content: !isPdf && !isImage ? result : undefined
      });

      // Default to strict grounding when a file is uploaded per Rule 3
      setIsStrictGrounding(true);
    };

    if (isPdf || isImage) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleClearDocument = () => {
    setUploadedDocument(null);
    setIsStrictGrounding(false);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const payload = {
        fileData: uploadedDocument?.base64,
        fileName: uploadedDocument?.name,
        mimeType: uploadedDocument?.mimeType,
        userQuery: userQuery || inputText || 'Extract comprehensive solutions, formulas, key concepts and important topics',
        isStrictGrounding: Boolean(uploadedDocument && isStrictGrounding)
      };

      const res = await fetch('/api/analyze-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setAnalysisResult(data);

      if (data.importantTopics && Array.isArray(data.importantTopics)) {
        setTopicsList(data.importantTopics.map((item: any, idx: number) => ({
          id: `ext_${idx}`,
          name: item.name,
          importance: item.importance || 'High',
          weightagePercent: Math.round(100 / data.importantTopics.length),
          pyqFrequency: item.examRelevance || 'Extracted from file content',
          recommendedPracticeMin: 30,
          shortDescription: item.examRelevance || 'Key concept for mastery'
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartTopicPractice = (topicName: string) => {
    setProfile(prev => ({ ...prev, currentTopic: topicName }));
    startPractice(30);
    setActiveTab('practice');
  };

  const handleDirectQuiz = (topicName?: string) => {
    const chosenTopic = topicName || profile.currentTopic;
    setProfile(prev => ({ ...prev, currentTopic: chosenTopic }));
    setActiveQuiz({
      title: `10-Question Quiz: ${chosenTopic}`,
      topic: chosenTopic,
      questions: [],
      isWeakTopicRevision: false
    });
    setActiveTab('quiz');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Orientation Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-sky-600 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-3 border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Smart AI Educational Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Welcome to EDUMATE, Scholar!
            </h1>
            <p className="mt-2 text-indigo-100 text-xs sm:text-sm leading-relaxed">
              Upload your syllabus or study PDF for strict grounded analysis, or explore open competitive exam topics across JEE, NEET, Programming, Arithmetics &amp; Logic. Complete continuous 30-min practice sessions, earn star points, and unlock 4 epic 50-level educational games!
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-white/10 font-semibold border border-white/20">
                🎯 Exam: {profile.examType.split('(')[0]}
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 font-semibold border border-white/20">
                📚 Subject: {profile.selectedSubject}
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-400/20 text-emerald-200 font-bold border border-emerald-300/30">
                ⚡ Active Topic: {profile.currentTopic}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={onOpenOnboarding}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-indigo-900 hover:bg-indigo-50 transition shadow-md flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Change Exam Target / Topic</span>
            </button>
            <button
              onClick={() => handleStartTopicPractice(profile.currentTopic)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-500/40 hover:bg-indigo-500/60 text-white border border-white/30 transition flex items-center justify-center gap-2 backdrop-blur-xs"
            >
              <Clock className="w-4 h-4 text-yellow-300" />
              <span>Start 30m Monitored Practice</span>
            </button>
            <button
              onClick={() => handleDirectQuiz()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>⚡ Direct 10Q Quiz (Rule 18)</span>
            </button>
          </div>
        </div>
        
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Feature 1, 2, 3: PDF / File Upload & Strict Grounding Controller */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Upload & Strict Grounding Mode */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileUp className="w-5 h-5 text-indigo-600" />
                  <span>Upload PDF or Document / Input Text</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Accepts PDF, text files, syllabus notes, question papers, or pasted queries.
                </p>
              </div>

              {/* Strict Grounding Badge Toggle (Rule 3) */}
              <div 
                onClick={() => setIsStrictGrounding(!isStrictGrounding)}
                className={`cursor-pointer px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition ${
                  isStrictGrounding 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                    : 'bg-slate-50 border-slate-300 text-slate-600'
                }`}
                title="When ON: answers are strictly confined to the uploaded PDF. When OFF: draws from broad external exam knowledge."
              >
                {isStrictGrounding ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Strict PDF Grounding: ON</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5 text-sky-600" />
                    <span>Open Knowledge Mode: ON</span>
                  </>
                )}
              </div>
            </div>

            {/* Rule 3 Notification Banner */}
            <div className={`p-3 rounded-2xl mb-4 text-xs flex items-center gap-2.5 ${
              isStrictGrounding 
                ? 'bg-emerald-50/70 border border-emerald-200 text-emerald-900' 
                : 'bg-sky-50/70 border border-sky-200 text-sky-900'
            }`}>
              <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-600" />
              <span>
                {isStrictGrounding 
                  ? '🔒 Strict PDF Grounding active: EDUMATE will only provide information contained strictly inside your uploaded file.' 
                  : '🌐 Open Knowledge active: EDUMATE supplements queries using comprehensive academic & competitive exam databases.'}
              </span>
            </div>

            {/* Dropzone or Uploaded File Banner */}
            {uploadedDocument ? (
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    PDF
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{uploadedDocument.name}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{uploadedDocument.size} • Ready for analysis</p>
                  </div>
                </div>
                <button
                  onClick={handleClearDocument}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition"
                  title="Remove document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-indigo-50/30 transition mb-4">
                <Upload className="w-8 h-8 text-indigo-500 mb-2" />
                <span className="text-xs font-bold text-slate-700">Click to upload PDF, Syllabus, or Notes</span>
                <span className="text-[11px] text-slate-400 mt-0.5">Supports PDF, DOC, TXT, MD, Images (Up to 50MB)</span>
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx,.md,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}

            {/* Optional Text Input / Notes Paste */}
            <div className="space-y-2 mb-4">
              <label className="block text-xs font-bold text-slate-700">
                Or Paste Notes / Concepts / Practice Problems
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste any formula, theorem, question or code snippet here..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-xs text-slate-800"
              />
            </div>

            {/* User Custom Query / Solution Requirement (Rule 2) */}
            <div className="space-y-2 mb-4">
              <label className="block text-xs font-bold text-slate-700">
                Specific Requirement / What Solution Do You Need?
              </label>
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="e.g. Summarize key formulas, solve step-by-step, extract high-yield PYQ concepts..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-xs text-slate-800"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing &amp; Formulating Solution...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Analyze Input &amp; Generate Structured Solution</span>
                </>
              )}
            </button>

            {/* Analysis Output Section */}
            {analysisResult && (
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                  <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">
                    Summary &amp; Key Takeaways
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {analysisResult.summary}
                  </p>
                </div>

                {analysisResult.solutionsOrAnswers && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                      Detailed Solution According to Your Requirement
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {analysisResult.solutionsOrAnswers}
                    </p>
                  </div>
                )}

                {analysisResult.formulasOrRules?.length > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                      Key Formulas &amp; Axioms
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-xs text-amber-950 font-mono">
                      {analysisResult.formulasOrRules.map((rule: string, i: number) => (
                        <li key={i}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Rule 4 Important Topics of PDF or Subject */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <span>Important Topics</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-yield concepts prioritized by exam weightage and PYQs.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {topicsList.map((top) => {
                const importanceBadge = top.importance === 'Crucial'
                  ? 'bg-rose-100 text-rose-800 border-rose-200'
                  : top.importance === 'High'
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : 'bg-blue-100 text-blue-800 border-blue-200';

                return (
                  <div
                    key={top.id}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-indigo-50/40 hover:border-indigo-200 transition group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {top.name}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${importanceBadge} shrink-0`}>
                        {top.importance}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                      {top.shortDescription}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                      <span className="text-slate-500 font-medium">
                        PYQ: <strong className="text-slate-700">{top.pyqFrequency}</strong>
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleStartTopicPractice(top.name)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition"
                          title="Start 30-min preparation session"
                        >
                          30m Practice
                        </button>
                        <button
                          onClick={() => handleDirectQuiz(top.name)}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition"
                          title="Direct quiz without waiting"
                        >
                          Quiz
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Shortcuts to Games & Lectures */}
          <div className="grid grid-cols-2 gap-3">
            <div 
              onClick={() => setActiveTab('games')}
              className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white cursor-pointer hover:scale-[1.02] transition shadow-md shadow-purple-500/15"
            >
              <Gamepad2 className="w-6 h-6 mb-2 text-yellow-300" />
              <h4 className="text-xs font-black">4 Educational Games</h4>
              <p className="text-[11px] text-purple-100 mt-0.5">50 Levels Each • Unlock via Points</p>
            </div>

            <div 
              onClick={() => setActiveTab('lectures')}
              className="p-4 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-white cursor-pointer hover:scale-[1.02] transition shadow-md shadow-rose-500/15"
            >
              <Tv className="w-6 h-6 mb-2 text-yellow-200" />
              <h4 className="text-xs font-black">Top YouTube Lectures</h4>
              <p className="text-[11px] text-rose-100 mt-0.5">PW, Khan Academy, 3B1B</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
