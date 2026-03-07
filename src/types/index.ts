/**
 * Shared types for ArtiCue speech therapy app.
 * Import: ChildProfile, SessionData, Attempt, Session, PhonemeResult,
 * FluencyResult, PredictionResult, WordBankEntry, etc.
 */

export interface ChildProfile {
  id?: string;
  age: number;
  name?: string;
}

export interface Attempt {
  word: string;
  transcript: string;
  score: number;
  correct: boolean;
  substitution: string | null;
}

export interface SessionData {
  date: string; // ISO date string
  durationSeconds: number;
  targetSound: string;
  attempts: Attempt[];
  averageAccuracy: number;
}

export interface Session {
  userId: string;
  sound: string;
  startedAt: string; // ISO timestamp
  attempts: Attempt[];
}

export interface PhonemeResult {
  correct: boolean;
  score: number;
  substitution: string | null;
  feedback: string;
  mouthCue: string;
  tryAgain: boolean;
}

export interface FluencyResult {
  score: number;
  rhythm: "good" | "rushed" | "hesitant";
  feedback: string;
  encouragement: string;
}

export interface PredictionResult {
  currentAccuracy: number;
  weeklyImprovementRate: number;
  weeksToMastery: number;
  parentInsight: string;
  trend: "improving" | "plateau" | "inconsistent";
}

export interface WordBankEntry {
  word: string;
  emoji: string;
}

export interface SoundWordBank {
  initial: WordBankEntry[];
  medial: WordBankEntry[];
  final: WordBankEntry[];
}

/** Fluency uses only full phrases (e.g. in final); initial/medial may be empty. */
export type WordBanksMap = Record<string, SoundWordBank>;
