import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  Trophy, 
  Sparkles, 
  HelpCircle,
  Clock
} from 'lucide-react';

interface Clue {
  num: number;
  dir: 'ACROSS' | 'DOWN';
  word: string;
  clue: string;
  row: number;
  col: number;
}

export const CrosswordGame: React.FC<{ level: number; onBack: () => void }> = ({ level, onBack }) => {
  const { profile, addQuizScore } = useApp();

  // Crossword templates based on level
  const crosswordData: Clue[] = [
    { num: 1, dir: 'ACROSS', word: 'FORCE', clue: 'Push or pull causing mass acceleration (F = ma)', row: 1, col: 0 },
    { num: 2, dir: 'DOWN', word: 'OPTICS', clue: 'Branch of physics dealing with light and reflection', row: 0, col: 1 },
    { num: 3, dir: 'ACROSS', word: 'ENERGY', clue: 'Capacity to do work (Joules)', row: 3, col: 0 },
    { num: 4, dir: 'DOWN', word: 'GRAVITY', clue: 'Attraction force between masses (9.8 m/s² on Earth)', row: 0, col: 4 },
  ];

  const gridSize = 7;
  const [grid, setGrid] = useState<string[][]>(Array(gridSize).fill(null).map(() => Array(gridSize).fill('')));
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [timerSec, setTimerSec] = useState<number>(0);

  // Active positions
  const activeCells = new Set<string>();
  crosswordData.forEach(c => {
    for (let i = 0; i < c.word.length; i++) {
      const r = c.dir === 'ACROSS' ? c.row : c.row + i;
      const col = c.dir === 'ACROSS' ? c.col + i : c.col;
      activeCells.add(`${r},${col}`);
    }
  });

  useEffect(() => {
    let interval: any = null;
    if (!isVictory) {
      interval = setInterval(() => setTimerSec(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isVictory]);

  const handleCellChange = (r: number, c: number, val: string) => {
    const char = val.slice(-1).toUpperCase();
    const newGrid = grid.map((row, ri) => 
      row.map((cell, ci) => (ri === r && ci === c ? char : cell))
    );
    setGrid(newGrid);

    // Auto verify all words
    let allValid = true;
    for (const item of crosswordData) {
      for (let i = 0; i < item.word.length; i++) {
        const row = item.dir === 'ACROSS' ? item.row : item.row + i;
        const col = item.dir === 'ACROSS' ? item.col + i : item.col;
        if (newGrid[row][col] !== item.word[i]) {
          allValid = false;
          break;
        }
      }
      if (!allValid) break;
    }

    if (allValid && !isVictory) {
      setIsVictory(true);
      confetti({ particleCount: 75, spread: 70 });
      addQuizScore(10, 10);
    }
  };

  const handleRevealHint = () => {
    // Fill first empty letter
    for (const item of crosswordData) {
      for (let i = 0; i < item.word.length; i++) {
        const row = item.dir === 'ACROSS' ? item.row : item.row + i;
        const col = item.dir === 'ACROSS' ? item.col + i : item.col;
        if (grid[row][col] !== item.word[i]) {
          handleCellChange(row, col, item.word[i]);
          return;
        }
      }
    }
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-800">
              Auto-Generated Crossword • Level {level}
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">
              Science &amp; Formula Crossword Puzzle
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-600">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{timerSec}s</span>
          </div>
          <button
            onClick={handleRevealHint}
            className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition flex items-center gap-1 border border-purple-200"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Free Hint</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Interactive Crossword Grid */}
        <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col items-center">
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 bg-slate-900 p-3 sm:p-4 rounded-2xl shadow-inner">
            {grid.map((row, r) =>
              row.map((val, c) => {
                const isActive = activeCells.has(`${r},${c}`);
                const clueNum = crosswordData.find(item => item.row === r && item.col === c)?.num;

                if (!isActive) {
                  return <div key={`${r}-${c}`} className="w-9 h-9 sm:w-11 sm:h-11 bg-slate-950 rounded-lg opacity-80" />;
                }

                return (
                  <div key={`${r}-${c}`} className="relative w-9 h-9 sm:w-11 sm:h-11">
                    {clueNum && (
                      <span className="absolute top-0.5 left-1 text-[9px] font-black text-indigo-700 pointer-events-none z-10">
                        {clueNum}
                      </span>
                    )}
                    <input
                      type="text"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleCellChange(r, c, e.target.value)}
                      className="w-full h-full text-center uppercase font-mono font-black text-sm sm:text-base rounded-lg bg-white border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 outline-none text-slate-900"
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Clues Pane */}
        <div className="md:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Crossword Clues
            </h3>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">Across</h4>
                <div className="space-y-1.5">
                  {crosswordData.filter(c => c.dir === 'ACROSS').map(item => (
                    <div key={item.num} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="font-bold text-slate-900 mr-1.5">{item.num}.</span>
                      <span className="text-slate-700">{item.clue}</span>
                      <span className="ml-1 text-slate-400 font-mono">({item.word.length} letters)</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">Down</h4>
                <div className="space-y-1.5">
                  {crosswordData.filter(c => c.dir === 'DOWN').map(item => (
                    <div key={item.num} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="font-bold text-slate-900 mr-1.5">{item.num}.</span>
                      <span className="text-slate-700">{item.clue}</span>
                      <span className="ml-1 text-slate-400 font-mono">({item.word.length} letters)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {isVictory && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 text-white text-center shadow-xl space-y-3 animate-in zoom-in-95">
          <Trophy className="w-12 h-12 text-yellow-300 mx-auto animate-bounce" />
          <h3 className="text-2xl font-black">Crossword Solved!</h3>
          <p className="text-xs text-purple-100">
            Great vocabulary and concept precision! +10 Points awarded to your balance.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button onClick={onBack} className="px-5 py-2.5 rounded-xl bg-white text-purple-900 text-xs font-black shadow-md">
              Return to Level Map
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
