// Types for ArtiCue speech therapy app
// Exported types used throughout the application

export type ChildProfile = {
  name: string;
  age: number;
  targetSounds: string[];
  streak: number;
  lastSessionDate: string;
  totalXP: number;
};

export type SessionData = {
  date: string;
  durationSeconds: number;
  targetSound: string;
  attempts: Attempt[];
  averageAccuracy: number;
};

export type Attempt = {
  word: string;
  transcript: string;
  score: number;
  correct: boolean;
  substitution: string | null;
};

export type PhonemeResult = {
  correct: boolean;
  score: number;
  substitution: string | null;
  feedback: string;
  mouthCue: string;
  tryAgain: boolean;
};

export type FluencyResult = {
  score: number;
  rhythm: "good" | "rushed" | "hesitant";
  feedback: string;
  encouragement: string;
};

export type PredictionResult = {
  currentAccuracy: number;
  weeklyImprovementRate: number;
  weeksToMastery: number;
  parentInsight: string;
  trend: "improving" | "plateau" | "inconsistent";
};

export type Session = {
  userId: string;
  sound: string;
  startTime: number;
  attempts: Attempt[];
};
