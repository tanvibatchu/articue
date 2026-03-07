// speechCapture.ts — Stub for Web Speech API voice capture.
// The backend team will wire up real SpeechRecognition here.
// Do NOT add browser SpeechRecognition logic here directly.

type OnResultFn = (transcript: string, confidence: number) => void;
type OnErrorFn = (error: string) => void;

let _stopHandle: ReturnType<typeof setTimeout> | null = null;

/**
 * startListening — begins capturing the child's speech.
 * Calls onResult with a transcript when speech is detected.
 *
 * STUB: after 2 seconds, fires a mock transcript of the target word.
 * Replace with real SpeechRecognition (lang = "en-CA", maxAlternatives = 3).
 */
export function startListening(
    onResult: OnResultFn,
    onError: OnErrorFn,
    mockWord?: string  // used by the stub to return a believable transcript
): void {
    console.log("[speechCapture stub] startListening — will fire mock transcript in 2s");

    _stopHandle = setTimeout(() => {
        // Mock: ~60% chance of saying the word correctly
        const correct = Math.random() > 0.4;
        const transcript = correct ? (mockWord ?? "rabbit") : "wabbit";
        console.log("[speechCapture stub] transcript:", transcript);
        onResult(transcript, correct ? 0.92 : 0.6);
    }, 2000);
}

/**
 * stopListening — cancels active speech recognition.
 *
 * STUB: clears the mock timeout.
 */
export function stopListening(): void {
    if (_stopHandle !== null) {
        clearTimeout(_stopHandle);
        _stopHandle = null;
        console.log("[speechCapture stub] stopListening");
    }
}
