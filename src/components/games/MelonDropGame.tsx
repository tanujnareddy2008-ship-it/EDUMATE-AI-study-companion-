import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  RotateCcw, 
  Trophy, 
  Sparkles, 
  Layers, 
  Award,
  ChevronDown
} from 'lucide-react';

interface DroppedSphere {
  id: number;
  tier: number; // 0 to 6
  col: number; // 0 to 4
  row: number; // 0 to 5
}

export const MelonDropGame: React.FC<{ level: number; onBack: () => void }> = ({ level, onBack }) => {
  const { profile, addQuizScore } = useApp();

  const tiers = [
    { name: 'Quark', size: 'text-xs', color: 'bg-rose-400 text-rose-950', score: 10 },
    { name: 'Proton', size: 'text-xs', color: 'bg-amber-400 text-amber-950', score: 25 },
    { name: 'Atom', size: 'text-xs', color: 'bg-emerald-400 text-emerald-950', score: 50 },
    { name: 'Molecule', size: 'text-sm', color: 'bg-sky-400 text-sky-950', score: 100 },
    { name: 'Cell', size: 'text-sm', color: 'bg-indigo-400 text-indigo-950', score: 200 },
    { name: 'Organism', size: 'text-sm font-bold', color: 'bg-purple-400 text-purple-950', score: 400 },
    { name: 'Cosmos', size: 'text-base font-black', color: 'bg-gradient-to-tr from-yellow-300 to-rose-400 text-rose-950', score: 800 }
  ];

  const targetScore = 200 + (level * 50);
  const [score, setScore] = useState<number>(0);
  const [currentDropTier, setCurrentDropTier] = useState<number>(0);
  const [grid, setGrid] = useState<(number | null)[][]>(
    Array(6).fill(null).map(() => Array(5).fill(null))
  );
  const [isVictory, setIsVictory] = useState<boolean>(false);

  const handleDropInColumn = (col: number) => {
    if (isVictory) return;

    // Find lowest empty row in this col
    let emptyRow = -1;
    for (let r = 5; r >= 0; r--) {
      if (grid[r][col] === null) {
        emptyRow = r;
        break;
      }
    }

    if (emptyRow === -1) return; // column is full

    const newGrid = grid.map(row => [...row]);
    newGrid[emptyRow][col] = currentDropTier;

    let pointsGained = 0;
    let didMerge = true;

    // Merge check loop
    while (didMerge) {
      didMerge = false;
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 5; c++) {
          const val = newGrid[r][c];
          if (val === null || val >= tiers.length - 1) continue;

          // Check bottom neighbor
          if (r < 5 && newGrid[r + 1][c] === val) {
            newGrid[r][c] = null;
            newGrid[r + 1][c] = val + 1;
            pointsGained += tiers[val + 1].score;
            didMerge = true;
            break;
          }

          // Check right neighbor
          if (c < 4 && newGrid[r][c + 1] === val) {
            newGrid[r][c] = null;
            newGrid[r][c + 1] = val + 1;
            pointsGained += tiers[val + 1].score;
            didMerge = true;
            break;
          }
        }
        if (didMerge) break;
      }

      // Apply gravity drop after merges
      if (didMerge) {
        for (let c = 0; c < 5; c++) {
          for (let r = 4; r >= 0; r--) {
            if (newGrid[r][c] !== null && newGrid[r + 1][c] === null) {
              newGrid[r + 1][c] = newGrid[r][c];
              newGrid[r][c] = null;
            }
          }
        }
      }
    }

    setGrid(newGrid);
    const newTotal = score + pointsGained + 5;
    setScore(newTotal);

    if (newTotal >= targetScore && !isVictory) {
      setIsVictory(true);
      confetti({ particleCount: 70, spread: 70 });
      addQuizScore(10, 10);
    }

    // Pick next drop tier (either tier 0, 1 or 2)
    setCurrentDropTier(Math.floor(Math.random() * 3));
  };

  const handleReset = () => {
    setGrid(Array(6).fill(null).map(() => Array(5).fill(null)));
    setScore(0);
    setIsVictory(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800">
              Melon Merge • Level {level}
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">
              Atomic Concept Drop &amp; Fusion Puzzle
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
            Target: {score} / {targetScore} pts
          </div>
          <button onClick={handleReset} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Drop Jar Container */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col items-center">
          
          {/* Drop Column Buttons */}
          <div className="grid grid-cols-5 gap-2 w-full max-w-sm mb-3">
            {Array.from({ length: 5 }).map((_, col) => (
              <button
                key={col}
                onClick={() => handleDropInColumn(col)}
                className="py-2 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-bold transition flex items-center justify-center gap-1 border border-indigo-200"
              >
                <span>Drop</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>

          {/* Grid Box */}
          <div className="w-full max-w-sm bg-slate-900 p-3 sm:p-4 rounded-3xl border-4 border-slate-800 shadow-2xl">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {grid.map((row, r) =>
                row.map((tierIndex, c) => (
                  <div
                    key={`${r}-${c}`}
                    className="aspect-square rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-800/80 overflow-hidden"
                  >
                    {tierIndex !== null && (
                      <div className={`w-full h-full rounded-2xl flex items-center justify-center text-center p-1 font-bold ${tiers[tierIndex].color} ${tiers[tierIndex].size} shadow-md animate-in zoom-in-75`}>
                        {tiers[tierIndex].name}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Fusion Evolution Guide */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Concept Fusion Evolution Ladder
            </h3>
            <p className="text-xs text-slate-500">
              Drop identical concepts together to evolve them into higher-tier physical orders:
            </p>

            <div className="space-y-2 pt-1">
              {tiers.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${t.color}`}>
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-800">{t.name}</span>
                  </div>
                  <span className="font-mono text-slate-500">+{t.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {isVictory && (
        <div className="bg-gradient-to-r from-amber-500 to-rose-500 rounded-3xl p-6 text-white text-center shadow-xl space-y-3 animate-in zoom-in-95">
          <Trophy className="w-12 h-12 text-yellow-200 mx-auto animate-bounce" />
          <h3 className="text-2xl font-black">Level {level} Objective Reached!</h3>
          <p className="text-xs text-amber-100">
            Score of {score} pts attained. +10 Points added to your overall balance.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button onClick={onBack} className="px-5 py-2.5 rounded-xl bg-white text-amber-900 text-xs font-black shadow-md">
              Return to Level Map
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
