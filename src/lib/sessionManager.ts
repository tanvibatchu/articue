/**
 * In-memory session management: start/record/end sessions, compute XP and streaks.
 * Import: startSession, recordAttempt, endSession, calculateStreak
 */

import type { Attempt, SessionData } from "@/types";

export type AttemptData = Attempt;

export interface SessionWithId {
  sessionId: string;
  userId: string;
  sound: string;
  startTime: number;
  attempts: Attempt[];
}

const XP_PER_CORRECT = 10;

export function startSession(userId: string, sound: string): SessionWithId {
  return {
    sessionId: `${userId}-${sound}-${Date.now()}`,
    userId,
    sound,
    startTime: Date.now(),
    attempts: [],
  };
}

export function recordAttempt(session: SessionWithId, attempt: Attempt): SessionWithId {
  return { ...session, attempts: [...session.attempts, attempt] };
}

export async function endSession(
  session: SessionWithId | string,
  extraData?: {
    exerciseType?: string;
    totalWords?: number;
  },
  attemptsArg?: Attempt[]
): Promise<{ xpEarned: number; sessionData: SessionData; averageAccuracy: number }> {
  let attempts: Attempt[];
  let startTime: number;
  let sound: string;

  if (typeof session === "string") {
    attempts = attemptsArg ?? [];
    startTime = Date.now() - 60000;
    sound = "r";
  } else {
    attempts = session.attempts;
    startTime = session.startTime;
    sound = session.sound;
  }

  const durationSeconds = Math.round((Date.now() - startTime) / 1000);
  const averageAccuracy = attempts.length > 0
    ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length : 0;
  const xpEarned = attempts.filter((a) => a.correct).length * XP_PER_CORRECT;

  const sessionData: SessionData = {
    date: new Date().toISOString().slice(0, 10),
    durationSeconds,
    targetSound: sound,
    attempts,
    averageAccuracy: Math.round(averageAccuracy * 100) / 100,
    exerciseType: extraData?.exerciseType ?? "practice",
    xpEarned,
    wordsCompleted: attempts.length,
    totalWords: extraData?.totalWords ?? attempts.length,
  };

  return { xpEarned, sessionData, averageAccuracy: Math.round(averageAccuracy) };
}

export function calculateStreak(sessions: SessionData[]): number {
  if (sessions.length === 0) return 0;
  const sortedDates = [...new Set(sessions.map((s) => s.date))].sort((a, b) => (b > a ? 1 : -1));
  const today = new Date().toISOString().slice(0, 10);
  let streak = 0;
  let cursor = 0;
  let expected = today;
  while (cursor < sortedDates.length && sortedDates[cursor] === expected) {
    streak++;
    cursor++;
    const next = new Date(expected);
    next.setDate(next.getDate() - 1);
    expected = next.toISOString().slice(0, 10);
  }
  return streak;
}
