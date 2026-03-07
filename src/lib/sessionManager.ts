// sessionManager.ts — Stub for Firebase Firestore session tracking.
// The backend team will replace these with real Firestore read/write helpers.
// Do NOT add Firebase logic here directly.

export type SessionData = {
    sessionId: string;
    userId: string;
    sound: string;
    startedAt: Date;
};

export type AttemptData = {
    word: string;
    transcript: string;
    score: number;
    correct: boolean;
    substitution: string | null;
};

export type SessionSummaryData = {
    sessionId: string;
    totalAttempts: number;
    correctAttempts: number;
    averageAccuracy: number;
    xpEarned: number;
    durationSeconds: number;
};

let _sessionStart: Date | null = null;

/**
 * startSession — initializes a new practice session in Firestore.
 *
 * STUB: logs and returns a mock session object.
 */
export async function startSession(
    userId: string,
    sound: string
): Promise<SessionData> {
    _sessionStart = new Date();
    console.log("[sessionManager stub] startSession:", { userId, sound });
    return {
        sessionId: `mock-session-${Date.now()}`,
        userId,
        sound,
        startedAt: _sessionStart,
    };
}

/**
 * recordAttempt — saves one word attempt to the current session in Firestore.
 *
 * STUB: logs the attempt data.
 */
export async function recordAttempt(
    sessionId: string,
    attempt: AttemptData
): Promise<void> {
    console.log("[sessionManager stub] recordAttempt:", { sessionId, attempt });
}

/**
 * endSession — finalizes the session and writes summary to Firestore.
 *
 * STUB: logs and returns a mock summary.
 */
export async function endSession(
    sessionId: string,
    attempts: AttemptData[]
): Promise<SessionSummaryData> {
    const correct = attempts.filter((a) => a.correct).length;
    const accuracy = attempts.length > 0 ? Math.round((correct / attempts.length) * 100) : 0;
    const duration = _sessionStart
        ? Math.round((Date.now() - _sessionStart.getTime()) / 1000)
        : 0;

    const summary: SessionSummaryData = {
        sessionId,
        totalAttempts: attempts.length,
        correctAttempts: correct,
        averageAccuracy: accuracy,
        xpEarned: correct * 10,
        durationSeconds: duration,
    };

    console.log("[sessionManager stub] endSession:", summary);
    return summary;
}
