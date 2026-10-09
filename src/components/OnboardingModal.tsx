import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExamType, SubjectCategory } from '../types';
import { 
  Sparkles, 
  Target, 
  BookOpen, 
  CheckCircle2, 
  Code, 
  Compass, 
  Atom, 
  Calculator, 
  BrainCircuit, 
  X,
  Zap
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { profile, setProfile } = useApp();

  const [examType, setExamType] = useState<ExamType>(profile.examType);
  const [subject, setSubject] = useState<SubjectCategory>(profile.selectedSubject);
  const [topic, setTopic] = useState<string>(profile.currentTopic);

  if (!isOpen) return null;

  const examOptions: { id: ExamType; label: string; desc: string; icon: string }[] = [
    {
      id: 'Competitive Exam (JEE, NEET, GATE, UPSC)',
      label: 'Competitive Exam',
      desc: 'High-stakes entrance testing, PYQ patterns, strict negative marking & speed focus',
      icon: '🎯'
    },
    {
      id: 'School / Board / University Exam',
      label: 'Academic & University Exam',
      desc: 'Theory mastery, conceptual proofs, derivations & descriptive grading',
      icon: '🏫'
    },
    {
      id: 'Programming & Software Development',
      label: 'Programming Languages & Tech',
      desc: 'Data Structures, algorithms, system design, language idioms & coding interviews',
      icon: '💻'
    },
    {
      id: 'Quantitative Aptitude & Arithmetics',
      label: 'Arithmetics & Quantitative Math',
      desc: 'Percentages, speed arithmetic, profit-loss, number theory & calculation shortcuts',
      icon: '⚡'
    },
    {
      id: 'Logics & Logical Reasoning',
      label: 'Logics & Logical Reasoning',
      desc: 'Syllogisms, puzzles, critical thinking, seating arrangement & cognitive deduction',
      icon: '🧩'
    }
  ];

  const subjectOptions: { id: SubjectCategory; label: string; examples: string; icon: any }[] = [
    { id: 'JEE Physics', label: 'JEE Physics', examples: 'Kinematics, Thermodynamics, Optics, Modern Physics', icon: Atom },
    { id: 'JEE Chemistry', label: 'JEE Chemistry', examples: 'Organic Mechanisms, Chemical Bonding, Electrochemistry', icon: Sparkles },
    { id: 'JEE Mathematics', label: 'JEE Mathematics', examples: 'Calculus, Vectors & 3D, Coordinate Geometry, Matrices', icon: Calculator },
    { id: 'NEET Biology (Zoology & Botany)', label: 'NEET Biology', examples: 'Genetics, Human Physiology, Plant Anatomy, Ecology', icon: Compass },
    { id: 'Programming (Python, C++, Java, JS, DSA)', label: 'Programming & DSA', examples: 'Python, C++, Java, JavaScript, Trees, Graphs, DP', icon: Code },
    { id: 'Arithmetics & Quantitative Aptitude', label: 'Arithmetics & Aptitude', examples: 'Percentages, Ratios, Speed & Distance, Work & Time', icon: Zap },
    { id: 'Logics & Logical Reasoning', label: 'Logics & Reasoning', examples: 'Syllogisms, Blood Relations, Coding-Decoding, Puzzles', icon: BrainCircuit }
  ];

  const suggestedTopics: Record<SubjectCategory, string[]> = {
    'JEE Physics': ['Kinematics & Laws of Motion', 'Rotational Mechanics', 'Electrodynamics & Gauss Law', 'Wave Optics & Interference'],
    'JEE Chemistry': ['Chemical Bonding & Molecular Structure', 'Reaction Mechanisms in Organic Chem', 'Thermodynamics & Equilibrium'],
    'JEE Mathematics': ['Differential & Integral Calculus', 'Vectors and 3D Geometry', 'Probability & Combinatorics'],
    'NEET Biology (Zoology & Botany)': ['Molecular Basis of Inheritance', 'Cell Cycle & Cell Division', 'Human Endocrine System'],
    'Programming (Python, C++, Java, JS, DSA)': ['Binary Search & Two Pointers', 'Dynamic Programming Fundamentals', 'Object Oriented Programming in Java/C++'],
    'Arithmetics & Quantitative Aptitude': ['Percentages & Successive Change', 'Time, Speed & Relative Velocity', 'Profit, Loss & Discount'],
    'Logics & Logical Reasoning': ['Categorical Syllogisms & Venn Logic', 'Seating Arrangements & Orderings', 'Blood Relations & Direction Sense']
  };

  const handleSave = () => {
    setProfile(prev => ({
      ...prev,
      examType,
      selectedSubject: subject,
      currentTopic: topic.trim() || 'Core Foundations'
    }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-indigo-100 max-h-[90vh] overflow-y-auto relative">
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mb-3 border border-indigo-100">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Personalize Your EDUMATE Journey
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Tell us what exam or skill you are targeting so our AI calibrates questions, practice timers, and diagnostic revision specifically for you.
          </p>
        </div>

        {/* Step 1: Exam Type */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            1. Target Purpose / Exam Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {examOptions.map((opt) => {
              const isSelected = examType === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setExamType(opt.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex items-start space-x-3 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                      {opt.label}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Subject */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            2. Choose Subject (Covers JEE, NEET, Programming, Arithmetics, Logic)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {subjectOptions.map((sub) => {
              const Icon = sub.icon;
              const isSelected = subject === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    setSubject(sub.id);
                    // auto pick first suggested topic
                    if (suggestedTopics[sub.id]?.length) {
                      setTopic(suggestedTopics[sub.id][0]);
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center space-x-2 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                      : 'border-slate-200 hover:border-indigo-300 bg-white text-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-indigo-500'}`} />
                  <span className="text-xs font-bold truncate">{sub.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Specific Topic */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            3. Specific Topic You Want to Prepare Today
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Kinematics, Dynamic Programming, Syllogisms..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm text-slate-800 font-medium"
          />

          <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Quick Suggestions:</span>
            {suggestedTopics[subject]?.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => setTopic(sug)}
                className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg transition"
              >
                + {sug}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 transition flex items-center space-x-2"
          >
            <span>Confirm &amp; Apply Target</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
