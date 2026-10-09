import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, GameInfo, ImportantTopic, Question, RevisionData, WeeklyDataPoint } from '../types';

interface AppContextType {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // Points & Stars
  addQuizScore: (correctCount: number, totalQuestions: number) => { stars: number; points: number };
  // Games
  games: GameInfo[];
  unlockGame: (gameId: string) => boolean;
  unlockLevel: (gameId: string, levelNumber: number) => boolean;
  selectedGameId: string | null;
  setSelectedGameId: (id: string | null) => void;
  activeGameLevel: number;
  setActiveGameLevel: (lvl: number) => void;
  // Practice Session
  isPracticing: boolean;
  practiceSecondsRemaining: number;
  startPractice: (minutes?: number) => void;
  pausePractice: () => void;
  addExtraThirtyMinutes: () => void;
  stopPractice: () => void;
  practicePreparedModalOpen: boolean;
  setPracticePreparedModalOpen: (open: boolean) => void;
  fastForwardPracticeTimer: () => void;
  // Strict File Grounding
  isStrictGrounding: boolean;
  setIsStrictGrounding: (val: boolean) => void;
  uploadedDocument: { name: string; size: string; content?: string; base64?: string; mimeType?: string; summary?: string } | null;
  setUploadedDocument: (doc: any) => void;
  // Current Quiz State
  activeQuiz: {
    title: string;
    topic: string;
    questions: Question[];
    isWeakTopicRevision: boolean;
  } | null;
  setActiveQuiz: (quiz: any) => void;
  // Weak Topics & Revision
  weakTopics: string[];
  addWeakTopic: (topicName: string) => void;
  clearWeakTopics: () => void;
  startWeakTopicQuiz: (additionalCount?: number) => void;
  // Weekly Analytics
  weeklyData: WeeklyDataPoint[];
  // Notifications Mute
  toggleMuteNotifications: () => void;
  // Penalty trigger
  applyEarlyExitPenalty: () => void;
  penaltyNotice: string | null;
  clearPenaltyNotice: () => void;
}

const STORAGE_KEY = 'edumate_state_v1';

const defaultGames: GameInfo[] = [
  {
    id: 'memory',
    title: 'Memory Match Cards',
    description: 'Match formula pairs, definition twins & syntax tokens across 50 fast-paced challenge grids.',
    icon: 'Sparkles',
    unlocked: true, // Let Level 1 be playable
    unlockCost: 50,
    levels: Array.from({ length: 50 }, (_, i) => ({
      levelNumber: i + 1,
      unlocked: i === 0, // Level 1 unlocked by default
      unlockCost: 10,
      highScore: 0,
      stars: 0,
    })),
  },
  {
    id: 'crossword',
    title: 'Auto-Generated Crossword',
    description: 'Dynamic educational crossword puzzle crafted automatically from your topic formulas and vocabulary.',
    icon: 'Grid',
    unlocked: false,
    unlockCost: 50,
    levels: Array.from({ length: 50 }, (_, i) => ({
      levelNumber: i + 1,
      unlocked: i === 0,
      unlockCost: 10,
      highScore: 0,
      stars: 0,
    })),
  },
  {
    id: 'boss_rpg',
    title: 'Boss Battle RPG',
    description: 'Battle exam titans like Calculus Titan & Logic Behemoth! Correct answers cast spells & critical hits.',
    icon: 'Swords',
    unlocked: false,
    unlockCost: 50,
    levels: Array.from({ length: 50 }, (_, i) => ({
      levelNumber: i + 1,
      unlocked: i === 0,
      unlockCost: 10,
      highScore: 0,
      stars: 0,
    })),
  },
  {
    id: 'melon_drop',
    title: 'Melon Merge / Drop Puzzle',
    description: 'Drop atomic concept orbs! Match identical terms to fuse them into higher tier mega-spheres.',
    icon: 'Layers',
    unlocked: false,
    unlockCost: 50,
    levels: Array.from({ length: 50 }, (_, i) => ({
      levelNumber: i + 1,
      unlocked: i === 0,
      unlockCost: 10,
      highScore: 0,
      stars: 0,
    })),
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return {
      name: 'Scholar',
      examType: 'Competitive Exam (JEE, NEET, GATE, UPSC)',
      selectedSubject: 'JEE Physics',
      currentTopic: 'Kinematics & Laws of Motion',
      totalPoints: 60, // starts with 60 points so user can test game unlock immediately!
      totalStars: 15,
      weeklyTestsTaken: 1,
      quizzesCompleted: 3,
      studyTimeMinutes: 45,
      isNotificationsMuted: false,
      knowledgeLevel: 'Competent',
    };
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [games, setGames] = useState<GameInfo[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_games`);
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return defaultGames;
  });

  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [activeGameLevel, setActiveGameLevel] = useState<number>(1);

  // Practice state (30 min continuous monitoring)
  const [isPracticing, setIsPracticing] = useState<boolean>(false);
  const [practiceSecondsRemaining, setPracticeSecondsRemaining] = useState<number>(30 * 60);
  const [practicePreparedModalOpen, setPracticePreparedModalOpen] = useState<boolean>(false);

  // Strict Document Grounding
  const [isStrictGrounding, setIsStrictGrounding] = useState<boolean>(false);
  const [uploadedDocument, setUploadedDocument] = useState<{
    name: string;
    size: string;
    content?: string;
    base64?: string;
    mimeType?: string;
    summary?: string;
  } | null>(null);

  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState<{
    title: string;
    topic: string;
    questions: Question[];
    isWeakTopicRevision: boolean;
  } | null>(null);

  const [weakTopics, setWeakTopics] = useState<string[]>(['Rotational Equilibrium', 'Boundary Constraints', 'Vector Cross Products']);
  const [penaltyNotice, setPenaltyNotice] = useState<string | null>(null);

  // Sample Weekly performance data (Explicitly NOT on dashboard, on dedicated Weekly Analytics)
  const [weeklyData, setWeeklyData] = useState<WeeklyDataPoint[]>([
    { day: 'Mon', scorePercent: 68, questionsAnswered: 30, studyMinutes: 45, starsEarned: 12, accuracy: 72 },
    { day: 'Tue', scorePercent: 74, questionsAnswered: 40, studyMinutes: 60, starsEarned: 16, accuracy: 78 },
    { day: 'Wed', scorePercent: 82, questionsAnswered: 50, studyMinutes: 90, starsEarned: 22, accuracy: 84 },
    { day: 'Thu', scorePercent: 65, questionsAnswered: 25, studyMinutes: 40, starsEarned: 10, accuracy: 69 },
    { day: 'Fri', scorePercent: 88, questionsAnswered: 45, studyMinutes: 75, starsEarned: 24, accuracy: 89 },
    { day: 'Sat', scorePercent: 92, questionsAnswered: 60, studyMinutes: 110, starsEarned: 28, accuracy: 93 },
    { day: 'Sun (Today)', scorePercent: 85, questionsAnswered: 35, studyMinutes: 50, starsEarned: 18, accuracy: 86 },
  ]);

  // Persist Profile and Games
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_games`, JSON.stringify(games));
  }, [games]);

  // Practice Timer Countdown Loop
  useEffect(() => {
    let interval: any = null;
    if (isPracticing && practiceSecondsRemaining > 0) {
      interval = setInterval(() => {
        setPracticeSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsPracticing(false);
            setPracticePreparedModalOpen(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPracticing, practiceSecondsRemaining]);

  // Focus guardian penalty trigger:
  // "if the user closes the website within the time limit of preparation then lock atleast one unlock game and mute the notifications while using the website"
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isPracticing && practiceSecondsRemaining > 0) {
        // Mark flag in sessionStorage to apply penalty upon returning
        sessionStorage.setItem('edumate_abandoned_practice', 'true');
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isPracticing, practiceSecondsRemaining]);

  useEffect(() => {
    if (sessionStorage.getItem('edumate_abandoned_practice') === 'true') {
      sessionStorage.removeItem('edumate_abandoned_practice');
      applyEarlyExitPenalty();
    }
  }, []);

  const applyEarlyExitPenalty = () => {
    // Lock at least one unlocked game or level and mute notifications
    let lockedGameName = '';
    setGames((prev) => {
      const copy = [...prev];
      // Try to re-lock a game that is unlocked (other than default first game)
      const unlockedNonDefault = copy.find((g) => g.id !== 'memory' && g.unlocked);
      if (unlockedNonDefault) {
        unlockedNonDefault.unlocked = false;
        lockedGameName = unlockedNonDefault.title;
      } else {
        // Lock a higher level
        const gameWithUnlockedLvl = copy.find((g) => g.levels.some((l) => l.levelNumber > 1 && l.unlocked));
        if (gameWithUnlockedLvl) {
          const lvl = gameWithUnlockedLvl.levels.reverse().find((l) => l.levelNumber > 1 && l.unlocked);
          if (lvl) {
            lvl.unlocked = false;
            lockedGameName = `${gameWithUnlockedLvl.title} Level ${lvl.levelNumber}`;
          }
        }
      }
      return copy;
    });

    setProfile((prev) => ({
      ...prev,
      isNotificationsMuted: true,
    }));

    setPenaltyNotice(
      `Focus Guardian Notice: The 30-minute practice session was abandoned early! To maintain study discipline, ${lockedGameName || 'a game unlock'} has been re-locked and notifications are muted.`
    );
  };

  const clearPenaltyNotice = () => setPenaltyNotice(null);

  const toggleMuteNotifications = () => {
    setProfile((prev) => ({
      ...prev,
      isNotificationsMuted: !prev.isNotificationsMuted,
    }));
  };

  const startPractice = (minutes = 30) => {
    setPracticeSecondsRemaining(minutes * 60);
    setIsPracticing(true);
    setPracticePreparedModalOpen(false);
  };

  const pausePractice = () => {
    setIsPracticing((prev) => !prev);
  };

  const addExtraThirtyMinutes = () => {
    // Requirement 6: "after completing 30 min ask the user whether they are prepared for the quiz or not if they enter yes then add only extra 30 min to it"
    setPracticeSecondsRemaining(30 * 60);
    setIsPracticing(true);
    setPracticePreparedModalOpen(false);
  };

  const stopPractice = () => {
    setIsPracticing(false);
  };

  const fastForwardPracticeTimer = () => {
    // For instant evaluation/testing
    setPracticeSecondsRemaining(5);
  };

  // Requirement 7: Star rating to points conversion:
  // 5 star - 10 points
  // 4 star - 8 points
  // 3 star - 6 points
  // 2 star - 4 points
  // 1 star - 2 points
  // 0 star - 0 points
  const addQuizScore = (correctCount: number, totalQuestions: number) => {
    const ratio = totalQuestions > 0 ? correctCount / totalQuestions : 0;
    let stars = 0;
    let points = 0;

    if (ratio >= 0.9) {
      stars = 5;
      points = 10;
    } else if (ratio >= 0.7) {
      stars = 4;
      points = 8;
    } else if (ratio >= 0.5) {
      stars = 3;
      points = 6;
    } else if (ratio >= 0.3) {
      stars = 2;
      points = 4;
    } else if (ratio > 0.05) {
      stars = 1;
      points = 2;
    } else {
      stars = 0;
      points = 0;
    }

    // Estimate Knowledge Level based on performance
    let newLevel: UserProfile['knowledgeLevel'] = profile.knowledgeLevel;
    if (ratio >= 0.9) newLevel = 'Genius';
    else if (ratio >= 0.75) newLevel = 'Master';
    else if (ratio >= 0.6) newLevel = 'Competent';
    else if (ratio >= 0.35) newLevel = 'Developing';
    else newLevel = 'Novice';

    setProfile((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints + points,
      totalStars: prev.totalStars + stars,
      quizzesCompleted: prev.quizzesCompleted + 1,
      knowledgeLevel: newLevel,
    }));

    return { stars, points };
  };

  // Requirement 21: Unlock game through gaining 50 points
  const unlockGame = (gameId: string) => {
    const cost = 50;
    if (profile.totalPoints < cost) return false;

    setProfile((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints - cost,
    }));

    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, unlocked: true } : g))
    );
    return true;
  };

  // Requirement 21: The user needs 10 points to unlock the next level
  const unlockLevel = (gameId: string, levelNumber: number) => {
    const cost = 10;
    if (profile.totalPoints < cost) return false;

    setProfile((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints - cost,
    }));

    setGames((prev) =>
      prev.map((g) => {
        if (g.id !== gameId) return g;
        return {
          ...g,
          levels: g.levels.map((lvl) =>
            lvl.levelNumber === levelNumber ? { ...lvl, unlocked: true } : lvl
          ),
        };
      })
    );
    return true;
  };

  const addWeakTopic = (topicName: string) => {
    if (!weakTopics.includes(topicName)) {
      setWeakTopics((prev) => [...prev, topicName]);
    }
  };

  const clearWeakTopics = () => setWeakTopics([]);

  // Requirement 13: "again conduct a quiz on the topics which are felt low by the user by roughly 20 questions if the user needs more number of questions then include the questions"
  const startWeakTopicQuiz = (additionalCount = 0) => {
    const totalCount = 20 + additionalCount;
    const focusTopic = weakTopics.length > 0 ? weakTopics[0] : profile.currentTopic;
    setActiveQuiz({
      title: `Targeted Diagnostic Revision Quiz (${totalCount} Questions)`,
      topic: focusTopic,
      questions: [],
      isWeakTopicRevision: true,
    });
    setActiveTab('quiz');
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        activeTab,
        setActiveTab,
        addQuizScore,
        games,
        unlockGame,
        unlockLevel,
        selectedGameId,
        setSelectedGameId,
        activeGameLevel,
        setActiveGameLevel,
        isPracticing,
        practiceSecondsRemaining,
        startPractice,
        pausePractice,
        addExtraThirtyMinutes,
        stopPractice,
        practicePreparedModalOpen,
        setPracticePreparedModalOpen,
        fastForwardPracticeTimer,
        isStrictGrounding,
        setIsStrictGrounding,
        uploadedDocument,
        setUploadedDocument,
        activeQuiz,
        setActiveQuiz,
        weakTopics,
        addWeakTopic,
        clearWeakTopics,
        startWeakTopicQuiz,
        weeklyData,
        toggleMuteNotifications,
        applyEarlyExitPenalty,
        penaltyNotice,
        clearPenaltyNotice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
