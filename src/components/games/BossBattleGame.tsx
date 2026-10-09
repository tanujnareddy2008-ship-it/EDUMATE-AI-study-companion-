import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Swords, 
  Shield, 
  Heart, 
  Flame, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  XCircle,
  Skull
} from 'lucide-react';

interface BattleQuestion {
  prompt: string;
  options: string[];
  correctIdx: number;
}

export const BossBattleGame: React.FC<{ level: number; onBack: () => void }> = ({ level, onBack }) => {
  const { profile, addQuizScore } = useApp();

  const bossNames = [
    'Calculus Titan Prime',
    'Organic Chemistry Dragon',
    'Quantum Entropy Behemoth',
    'Algorithmic Complexity Hydra',
    'Relative Dynamics Overlord'
  ];

  const currentBossName = bossNames[(level - 1) % bossNames.length];
  const maxBossHp = 100 + (level * 20);
  const [bossHp, setBossHp] = useState<number>(maxBossHp);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [combatLog, setCombatLog] = useState<string[]>([
    `A wild ${currentBossName} (Level ${level}) appears! Answer questions to cast spells!`
  ]);
  const [qIndex, setQIndex] = useState<number>(0);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isDefeated, setIsDefeated] = useState<boolean>(false);

  const battleQuestions: BattleQuestion[] = [
    {
      prompt: 'Cast "Kinematic Strike": What is the derivative of position vector with respect to time?',
      options: ['Acceleration', 'Velocity', 'Momentum', 'Jerk'],
      correctIdx: 1
    },
    {
      prompt: 'Cast "Energy Blast": In an elastic collision between two masses, what is conserved?',
      options: ['Only Kinetic Energy', 'Only Momentum', 'Both Momentum & Kinetic Energy', 'Neither'],
      correctIdx: 2
    },
    {
      prompt: 'Cast "Shield Wall": When net external torque acting on a body is zero, which quantity remains constant?',
      options: ['Linear velocity', 'Angular momentum', 'Rotational inertia', 'Torque'],
      correctIdx: 1
    },
    {
      prompt: 'Cast "Critical Execution": What is the unit of electric potential difference in SI units?',
      options: ['Coulomb', 'Ampere', 'Volt (J/C)', 'Tesla'],
      correctIdx: 2
    }
  ];

  const currentQ = battleQuestions[qIndex % battleQuestions.length];

  const handleAction = (optIdx: number) => {
    if (bossHp <= 0 || playerHp <= 0) return;

    if (optIdx === currentQ.correctIdx) {
      // Player deals heavy damage!
      const damage = 35 + Math.floor(Math.random() * 20);
      const newBossHp = Math.max(0, bossHp - damage);
      setBossHp(newBossHp);
      setCombatLog(prev => [
        `⚔️ Critical Hit! You cast a powerful spell dealing ${damage} damage to ${currentBossName}!`,
        ...prev.slice(0, 4)
      ]);

      if (newBossHp === 0) {
        setIsVictory(true);
        confetti({ particleCount: 80, spread: 75 });
        addQuizScore(10, 10);
      }
    } else {
      // Player missed, Boss counter-attacks!
      const bossDamage = 20 + Math.floor(Math.random() * 15);
      const newPlayerHp = Math.max(0, playerHp - bossDamage);
      setPlayerHp(newPlayerHp);
      setCombatLog(prev => [
        `❌ Spell Fizzled! ${currentBossName} strikes back for ${bossDamage} damage!`,
        ...prev.slice(0, 4)
      ]);

      if (newPlayerHp === 0) {
        setIsDefeated(true);
      }
    }

    setQIndex(prev => prev + 1);
  };

  const handleReset = () => {
    setBossHp(maxBossHp);
    setPlayerHp(100);
    setIsVictory(false);
    setIsDefeated(false);
    setQIndex(0);
    setCombatLog([`You re-engaged ${currentBossName} with full strength!`]);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800">
              Boss Battle RPG • Level {level}
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">
              Defeat {currentBossName}
            </h2>
          </div>
        </div>
      </div>

      {/* Battle Arena */}
      <div className="bg-gradient-to-b from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 border border-indigo-900">
        
        {/* Boss Display & Health Bar */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-20 h-20 rounded-3xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-600/20 animate-pulse">
            <Skull className="w-10 h-10" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-black">{currentBossName}</h3>
            <p className="text-[11px] text-indigo-300">Exam Titan • Level {level}</p>
          </div>

          <div className="w-full max-w-md space-y-1">
            <div className="flex justify-between text-xs font-bold font-mono">
              <span className="text-rose-400">BOSS HP</span>
              <span>{bossHp} / {maxBossHp}</span>
            </div>
            <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                style={{ width: `${(bossHp / maxBossHp) * 100}%` }}
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Player Stats Bar */}
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-xs">
              ⚔️
            </div>
            <div>
              <span className="text-xs font-bold block">{profile.name} (Player)</span>
              <span className="text-[10px] text-indigo-200">{profile.knowledgeLevel} Mage</span>
            </div>
          </div>

          <div className="w-36 space-y-1">
            <div className="flex justify-between text-[10px] font-bold font-mono">
              <span className="text-emerald-400">HP</span>
              <span>{playerHp} / 100</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${playerHp}%` }}
                className="h-full bg-emerald-400 rounded-full transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Active Combat Question & Spell Casting */}
        {!isVictory && !isDefeated && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-4">
            <div className="flex items-center gap-2 text-yellow-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Incantation Question (Spell Trigger)</span>
            </div>

            <p className="text-sm sm:text-base font-bold leading-relaxed text-white">
              {currentQ.prompt}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAction(idx)}
                  className="p-3.5 rounded-xl bg-white/15 hover:bg-indigo-600 border border-white/20 text-left text-xs font-bold transition flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-md bg-white/20 text-center font-mono text-[10px] flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Combat Log */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 font-mono text-xs space-y-1 text-slate-300 max-h-24 overflow-y-auto">
          {combatLog.map((log, i) => (
            <p key={i} className="leading-snug">{log}</p>
          ))}
        </div>

        {/* Victory */}
        {isVictory && (
          <div className="text-center p-6 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl space-y-3 animate-in zoom-in-95">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto animate-bounce" />
            <h3 className="text-2xl font-black text-emerald-300">Boss Vanquished!</h3>
            <p className="text-xs text-emerald-100">Level {level} complete! +10 Points added to your wallet balance.</p>
            <button onClick={onBack} className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-md">
              Back to Level Map
            </button>
          </div>
        )}

        {/* Defeat */}
        {isDefeated && (
          <div className="text-center p-6 bg-rose-500/20 border border-rose-400/40 rounded-2xl space-y-3">
            <h3 className="text-xl font-black text-rose-300">You were defeated by {currentBossName}</h3>
            <p className="text-xs text-rose-200">Review your concept formulas and try again!</p>
            <button onClick={handleReset} className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md">
              Retry Battle
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
