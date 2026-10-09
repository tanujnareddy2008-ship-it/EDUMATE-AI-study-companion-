import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { OnboardingModal } from './components/OnboardingModal';
import { Dashboard } from './components/Dashboard';
import { PracticeTimerModal } from './components/PracticeTimerModal';
import { QuizView } from './components/QuizView';
import { WeeklyTestView } from './components/WeeklyTestView';
import { RevisionView } from './components/RevisionView';
import { GamesHub } from './components/GamesHub';
import { LectureGuideView } from './components/LectureGuideView';
import { WeeklyAnalyticsView } from './components/WeeklyAnalyticsView';
import { AlertCircle, X, ShieldAlert, Sparkles, GraduationCap } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, penaltyNotice, clearPenaltyNotice } = useApp();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navbar with brand and score metrics */}
      <Navbar onOpenOnboarding={() => setIsOnboardingOpen(true)} />

      {/* Focus Guardian Penalty Alert Banner (Rule 16 second bullet) */}
      {penaltyNotice && (
        <div className="bg-rose-600 text-white px-4 py-3 shadow-md animate-in slide-in-from-top">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs font-bold">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 shrink-0 text-yellow-300" />
              <span>{penaltyNotice}</span>
            </div>
            <button
              onClick={clearPenaltyNotice}
              className="p-1 hover:bg-rose-700 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Tab Routing */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && <Dashboard onOpenOnboarding={() => setIsOnboardingOpen(true)} />}
        {activeTab === 'practice' && (
          <div className="max-w-5xl mx-auto px-4 py-8">
            <PracticeTimerModal />
          </div>
        )}
        {activeTab === 'quiz' && <QuizView />}
        {activeTab === 'weekly_test' && <WeeklyTestView />}
        {activeTab === 'revision' && <RevisionView />}
        {activeTab === 'games' && <GamesHub />}
        {activeTab === 'lectures' && <LectureGuideView />}
        {activeTab === 'weekly_analytics' && <WeeklyAnalyticsView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>EDUMATE Smart Education &amp; Exam System</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Strict PDF Grounding • 30m Monitored Practice • Star Credit Conversion • 4 Playable 50-Level Games
          </p>
        </div>
      </footer>

      {/* Onboarding & Customization Modal */}
      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
