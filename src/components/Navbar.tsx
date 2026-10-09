import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Gamepad2, 
  FileText, 
  Clock, 
  BarChart3, 
  Tv, 
  GitBranch, 
  Star, 
  Coins, 
  Bell, 
  BellOff, 
  Flame, 
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';

export const Navbar: React.FC<{ onOpenOnboarding: () => void }> = ({ onOpenOnboarding }) => {
  const { 
    profile, 
    activeTab, 
    setActiveTab, 
    isPracticing, 
    practiceSecondsRemaining,
    toggleMuteNotifications
  } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Learning Hub', icon: GraduationCap },
    { id: 'practice', label: '30m Practice', icon: Clock, badge: isPracticing ? `${Math.floor(practiceSecondsRemaining / 60)}m` : null },
    { id: 'quiz', label: 'Quiz Mode', icon: Sparkles },
    { id: 'weekly_test', label: '2-Hr Exam Test', icon: FileText },
    { id: 'revision', label: 'Diagram Revision', icon: GitBranch },
    { id: 'games', label: 'Games (4 Games)', icon: Gamepad2, highlight: true },
    { id: 'lectures', label: 'Lecture Guides', icon: Tv },
    { id: 'weekly_analytics', label: 'Weekly Analytics', icon: BarChart3 },
  ];

  const knowledgeColors = {
    Novice: 'bg-slate-100 text-slate-700 border-slate-300',
    Developing: 'bg-amber-100 text-amber-800 border-amber-300',
    Competent: 'bg-blue-100 text-blue-800 border-blue-300',
    Master: 'bg-purple-100 text-purple-800 border-purple-300',
    Genius: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-indigo-100 shadow-xs">
      {/* Top Banner for Branding and Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-400 p-0.5 shadow-md shadow-indigo-500/20 flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 bg-clip-text text-transparent">
                  EDUMATE
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                  Smart AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Adaptive Exam &amp; Concept Mastery System
              </p>
            </div>
          </div>

          {/* Quick Target Banner */}
          <div 
            onClick={onOpenOnboarding}
            className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-indigo-50/80 to-sky-50/80 hover:from-indigo-100/80 hover:to-sky-100/80 transition px-3 py-1.5 rounded-xl border border-indigo-200/60 cursor-pointer group"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-left text-xs">
              <span className="text-slate-500 font-normal">Target: </span>
              <span className="font-bold text-slate-800">{profile.selectedSubject}</span>
              <span className="text-indigo-600 font-semibold ml-1">({profile.currentTopic.slice(0, 22)}...)</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition" />
          </div>

          {/* Stats, Star Rating & Points Counter */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Knowledge Tier */}
            <div className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${knowledgeColors[profile.knowledgeLevel]}`}>
              <Award className="w-3.5 h-3.5" />
              <span>{profile.knowledgeLevel}</span>
            </div>

            {/* Stars Counter */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-bold shadow-xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{profile.totalStars} Stars</span>
            </div>

            {/* Points Wallet */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-sky-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20">
              <Coins className="w-4 h-4 text-yellow-300" />
              <span>{profile.totalPoints} Pts</span>
            </div>

            {/* Mute Notifications / Focus Guardian */}
            <button
              onClick={toggleMuteNotifications}
              title={profile.isNotificationsMuted ? "Notifications Muted (Focus Mode ON)" : "Notifications Active"}
              className={`p-2 rounded-xl border transition ${
                profile.isNotificationsMuted
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {profile.isNotificationsMuted ? (
                <BellOff className="w-4 h-4" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Bar / Tabs */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-100 pt-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : item.highlight
                    ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.highlight ? 'text-purple-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-rose-500 text-white animate-pulse'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
