export type ExamType = 
  | 'Competitive Exam (JEE, NEET, GATE, UPSC)'
  | 'School / Board / University Exam'
  | 'Programming & Software Development'
  | 'Quantitative Aptitude & Arithmetics'
  | 'Logics & Logical Reasoning';

export type SubjectCategory = 
  | 'JEE Mathematics'
  | 'JEE Physics'
  | 'JEE Chemistry'
  | 'NEET Biology (Zoology & Botany)'
  | 'Programming (Python, C++, Java, JS, DSA)'
  | 'Arithmetics & Quantitative Aptitude'
  | 'Logics & Logical Reasoning';

export interface UserProfile {
  name: string;
  examType: ExamType;
  selectedSubject: SubjectCategory;
  currentTopic: string;
  totalPoints: number;
  totalStars: number;
  weeklyTestsTaken: number;
  quizzesCompleted: number;
  studyTimeMinutes: number;
  isNotificationsMuted: boolean;
  knowledgeLevel: 'Novice' | 'Developing' | 'Competent' | 'Master' | 'Genius';
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  subtopic?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isPYQ?: boolean;
  pyqTag?: string;
  userSelected?: number;
  isCorrect?: boolean;
}

export interface ImportantTopic {
  id: string;
  name: string;
  importance: 'Crucial' | 'High' | 'Medium';
  weightagePercent: number;
  pyqFrequency: string;
  recommendedPracticeMin: number;
  shortDescription: string;
}

export interface FlowchartStep {
  id: number;
  label: string;
  desc: string;
  type: 'start' | 'process' | 'decision' | 'result';
}

export interface RevisionData {
  topic: string;
  subject: string;
  conceptBreakdown: string;
  commonMistakes: string[];
  cheatSheet: string[];
  flowchart: {
    title: string;
    steps: FlowchartStep[];
  };
  diagramSvg: string;
}

export interface GameInfo {
  id: 'memory' | 'crossword' | 'boss_rpg' | 'melon_drop';
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockCost: number; // 50 points
  levels: {
    levelNumber: number;
    unlocked: boolean;
    unlockCost: number; // 10 points
    highScore: number;
    stars: number;
  }[];
}

export interface WeeklyDataPoint {
  day: string;
  scorePercent: number;
  questionsAnswered: number;
  studyMinutes: number;
  starsEarned: number;
  accuracy: number;
}
