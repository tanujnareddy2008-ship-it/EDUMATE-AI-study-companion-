import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  Clock, 
  Trophy, 
  CheckCircle2, 
  ArrowLeft,
  Star
} from 'lucide-react';

interface Card {
  id: number;
  matchId: number;
  text: string;
  subtext: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryMatchGame: React.FC<{ level: number; onBack: () => void }> = ({ level, onBack }) => {
  const { profile, addQuizScore } = useApp();

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [timerSec, setTimerSec] = useState<number>(0);

  // Concept Pairs based on target subject and level
  const conceptPool = [
    { a: 'F = m · a', aSub: 'Newton 2nd Law', b: 'Force = Mass × Accel', bSub: 'Core Mechanics' },
    { a: 'v = u + a·t', aSub: '1st Kinematic Eq', b: 'Linear Velocity', bSub: 'Constant Acceleration' },
    { a: 'W = ΔK', aSub: 'Work-Energy Theorem', b: 'Work = KE Final - KE Init', bSub: 'Conservative & Non-Cons.' },
    { a: 'p = m · v', aSub: 'Linear Momentum', b: 'Conservation of p', bSub: 'Closed System' },
    { a: 'τ = r × F', aSub: 'Torque Vector', b: 'Rotational Moment', bSub: 'Lever Arm Operator' },
    { a: 'E = h · ν', aSub: 'Planck-Einstein Law', b: 'Photon Energy', bSub: 'Quantum Radiation' },
    { a: 'PV = nRT', aSub: 'Ideal Gas Equation', b: 'Equation of State', bSub: 'Thermal Equilibrium' },
    { a: 'O(N log N)', aSub: 'Heap / Merge Sort', b: 'Optimal Comparison', bSub: 'Algorithmic Lower Bound' }
  ];

  const initializeGrid = () => {
    // Select pairs for this level
    const pairCount = Math.min(8, 4 + Math.floor(level / 5));
    const selectedPairs = conceptPool.slice(0, pairCount);

    const deck: Card[] = [];
    selectedPairs.forEach((pair, idx) => {
      deck.push({
        id: idx * 2,
        matchId: idx,
        text: pair.a,
        subtext: pair.aSub,
        isFlipped: false,
        isMatched: false
      });
      deck.push({
        id: idx * 2 + 1,
        matchId: idx,
        text: pair.b,
        subtext: pair.bSub,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setIsVictory(false);
    setTimerSec(0);
  };

  useEffect(() => {
    initializeGrid();
  }, [level]);

  useEffect(() => {
    let timer: any = null;
    if (!isVictory) {
      timer = setInterval(() => setTimerSec(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isVictory]);

  const handleCardClick = (idx: number) => {
    if (cards[idx].isFlipped || cards[idx].isMatched || flippedIndices.length >= 2) return;

    const newCards = [...cards];
    newCards[idx].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (cards[firstIdx].matchId === cards[secondIdx].matchId) {
        // Matched!
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => 
            i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
          ));
          setFlippedIndices([]);

          // Check if all matched
          const remaining = cards.filter((c, i) => i !== firstIdx && i !== secondIdx && !c.isMatched);
          if (remaining.length === 0) {
            setIsVictory(true);
            confetti({ particleCount: 70, spread: 60 });
            // Award stars
            addQuizScore(10, 10);
          }
        }, 500);
      } else {
        // No match, flip back
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => 
            i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
          ));
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Game Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-800">
                Memory Match • Level {level} of 50
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">
              Concept Formula Pair Matcher
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>{timerSec}s</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800">
            <span>Moves: {moves}</span>
          </div>
          <button
            onClick={initializeGrid}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            title="Reset Grid"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card, idx) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`h-28 sm:h-32 rounded-2xl p-3 sm:p-4 border cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center select-none ${
                card.isMatched
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-2 ring-emerald-200 shadow-xs opacity-90'
                  : isRevealed
                  ? 'bg-indigo-600 border-indigo-700 text-white shadow-md rotate-y-180 scale-102'
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs hover:border-indigo-300'
              }`}
            >
              {isRevealed ? (
                <>
                  <span className="text-xs sm:text-sm font-black font-mono leading-tight">
                    {card.text}
                  </span>
                  <span className="text-[10px] opacity-80 mt-1 font-semibold truncate max-w-full">
                    {card.subtext}
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-300">
                  <Sparkles className="w-6 h-6 mb-1 text-indigo-300" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Flip</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Victory Celebration Modal */}
      {isVictory && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 text-white text-center shadow-xl space-y-3 animate-in zoom-in-95">
          <Trophy className="w-12 h-12 text-yellow-300 mx-auto animate-bounce" />
          <h3 className="text-2xl font-black">Level {level} Cleared!</h3>
          <p className="text-xs text-emerald-100">
            Completed in {timerSec} seconds across {moves} moves. +10 Points awarded to your wallet!
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={initializeGrid}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition"
            >
              Replay Level
            </button>
            <button
              onClick={onBack}
              className="px-5 py-2 rounded-xl bg-white text-emerald-900 text-xs font-black shadow-md transition"
            >
              Back to Level Map
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
