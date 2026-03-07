// gemini.ts — Stub for Gemini API phoneme analysis.
// The backend team will replace this with real Gemini API calls.
// Do NOT add Gemini API logic here directly.

export type PhonemeResult = {
    correct: boolean;
    score: number;          // 0–100
    substitution: string | null; // e.g. "replaced r with w"
    feedback: string;       // child-friendly, max 12 words
    mouthCue: string;       // articulation instruction for mouth diagram
    tryAgain: boolean;
};

/**
 * analyzePhoneme — sends child's transcript to Gemini for phoneme analysis.
 * Returns a PhonemeResult with score and feedback.
 *
 * STUB: returns a mock result after a short delay.
 * Replace with real POST /api/analyze call when backend is ready.
 */
export async function analyzePhoneme(params: {
    word: string;
    transcript: string;
    targetSound: string;
    age: number;
}): Promise<PhonemeResult> {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));

    // Mock: correct ~60% of the time for demo purposes
    const correct = Math.random() > 0.4;

    console.log("[gemini stub] analyzePhoneme called:", params);

    return {
        correct,
        score: correct ? 85 : 45,
        substitution: correct ? null : `replaced ${params.targetSound} with w`,
        feedback: correct
            ? "Amazing! You nailed it!"
            : "Ooh so close! Let's try together!",
        mouthCue: `Place your tongue just behind your top teeth for the ${params.targetSound} sound.`,
        tryAgain: !correct,
    };
}
