import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GameInfo } from '../types';
import { MemoryMatchGame } from './games/MemoryMatchGame';
import { CrosswordGame } from './games/CrosswordGame';
import { BossBattleGame } from './games/BossBattleGame';
import { MelonDropGame } from './games/MelonDropGame';
import { 
  Gamepad2, 
  Lock, 
  Unlock, 
  Coins, 
  Star, 
  Play, 
  Sparkles, 
  Layers, 
  Grid, 
  Swords, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

export const GamesHub: React.FC = () => {
  const { 
    profile, 
    games, 
    unlockGame, 
    unlockLevel, 
    selectedGameId, 
    setSelectedGameId, 
    activeGameLevel, 
    setActiveGameLevel 
  } = useApp();

  const [activeGameView, setActiveGameView] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const selectedGame = games.find((g) => g.id === selectedGameId);

  const handleUnlockGame = (gameId: string) => {
    const success = unlockGame(gameId);
    if (success) {
      setFeedbackMsg(`Successfully unlocked game for 50 points!`);
    } else {
      setFeedbackMsg(`Insufficient points! You need 50 points to unlock this game. Take quizzes to earn more.`);
    }
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleUnlockLevel = (gameId: string, levelNum: number) => {
    const success = unlockLevel(gameId, levelNum);
    if (success) {
      setFeedbackMsg(`Successfully unlocked Level ${levelNum} for 10 points!`);
    } else {
      setFeedbackMsg(`Insufficient points! You need 10 points to unlock Level ${levelNum}. Take quizzes to earn more.`);
    }
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handlePlayLevel = (levelNum: number) => {
    setActiveGameLevel(levelNum);
    setActiveGameView(selectedGameId);
  };

  // If currently playing a game:
  if (activeGameView && selectedGameId) {
    if (selectedGameId === 'memory') {
      return <MemoryMatchGame level={activeGameLevel} onBack={() => setActiveGameView(null)} />;
    }
    if (selectedGameId === 'crossword') {
      return <CrosswordGame level={activeGameLevel} onBack={() => setActiveGameView(null)} />;
    }
    if (selectedGameId === 'boss_rpg') {
      return <BossBattleGame level={activeGameLevel} onBack={() => setActiveGameView(null)} />;
    }
    if (selectedGameId === 'melon_drop') {
      return <MelonDropGame level={activeGameLevel} onBack={() => setActiveGameView(null)} />;
    }
  }

  // If a game is selected, show its 50 Levels Map
  if (selectedGame) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in">
        
        {/* Game Level Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedGameId(null)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
                50-Level Progression Map
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {selectedGame.title}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                {selectedGame.description}
              </p>
            </div>
          </div>

          {/* Points Balance Banner */}
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 p-3 rounded-2xl">
            <Coins className="w-5 h-5 text-amber-500" />
            <div>
              <span className="text-[11px] text-amber-800 font-bold block">Wallet Balance</span>
              <span className="text-base font-black text-amber-950">{profile.totalPoints} Points</span>
            </div>
          </div>
        </div>

        {feedbackMsg && (
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-900 flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* 50 Levels Grid (Rule 21: atleast 50 levels, level 1 unlocked bydefault, 10 points to unlock next level) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                All 50 Levels (Level 1 to 50)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Level 1 is unlocked by default. Subsequent levels unlock for 10 points each.
              </p>
            </div>

            <div className="text-xs font-bold text-slate-500">
              Unlocked: <strong className="text-indigo-600">{selectedGame.levels.filter(l => l.unlocked).length} / 50</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2.5 sm:gap-3">
            {selectedGame.levels.map((lvl) => {
              const isFirst = lvl.levelNumber === 1;

              return (
                <div
                  key={lvl.levelNumber}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-between ${
                    lvl.unlocked
                      ? 'bg-gradient-to-b from-indigo-50 to-white border-indigo-300 hover:shadow-md'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Lvl {lvl.levelNumber}
                  </span>

                  <div className="my-2">
                    {lvl.unlocked ? (
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs mx-auto">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {lvl.unlocked ? (
                    <button
                      onClick={() => handlePlayLevel(lvl.levelNumber)}
                      className="w-full py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] shadow-xs transition"
                    >
                      Play
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnlockLevel(selectedGame.id, lvl.levelNumber)}
                      className="w-full py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] shadow-xs transition flex items-center justify-center gap-0.5"
                      title="Unlock for 10 points"
                    >
                      <span>10 Pts</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    );
  }

  // Games Hub Overview (The 4 Games selection)
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in">
      
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full text-xs font-black bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wide">
              Rule 8, 9 &amp; 21: Gamified Learning Hub
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              50 Levels Each
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Educational Games Arcade
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Unlock interactive games through gaining 50 points. Each game contains at least 50 levels with Level 1 unlocked by default, and next levels requiring 10 points to unlock!
          </p>
        </div>

        {/* Current Points Badge */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-2xl shadow-md shrink-0">
          <Coins className="w-6 h-6 text-yellow-300" />
          <div>
            <span className="text-[11px] text-indigo-100 font-semibold block">Available Points</span>
            <span className="text-xl font-black">{profile.totalPoints} Pts</span>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-900 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* The 4 Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((g) => {
          const unlockedLevelsCount = g.levels.filter(l => l.unlocked).length;

          return (
            <div
              key={g.id}
              className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between space-y-6 ${
                g.unlocked
                  ? 'border-indigo-200 shadow-md hover:border-indigo-400'
                  : 'border-slate-200 opacity-90 hover:opacity-100'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md">
                    <Gamepad2 className="w-6 h-6" />
                  </div>

                  {g.unlocked ? (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Game Unlocked</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Costs 50 Pts</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">{g.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{g.description}</p>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <span><strong>50 Levels</strong> included</span>
                  <span>•</span>
                  <span><strong>{unlockedLevelsCount}</strong> Unlocked</span>
                </div>
              </div>

              {/* Action Button */}
              {g.unlocked ? (
                <button
                  onClick={() => setSelectedGameId(g.id)}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-2"
                >
                  <span>Open Level Map (50 Levels)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleUnlockGame(g.id)}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Game for 50 Points</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
