// elevenlabs.ts — Stub for ElevenLabs text-to-speech (Nova's voice).
// The backend team will replace this with real ElevenLabs API calls.
// Do NOT add ElevenLabs API logic here directly.

/**
 * speakAsNova — converts text to Nova's voice and plays it.
 *
 * STUB: logs the text and resolves immediately.
 * Replace with real ElevenLabs TTS + AudioBuffer playback when backend is ready.
 */
export async function speakAsNova(text: string): Promise<void> {
    console.log("[elevenlabs stub] Nova says:", text);
    // Simulate TTS duration so the rest of the UI can gate on this promise
    await new Promise((r) => setTimeout(r, 800));
}

/**
 * demonstrateWord — Nova demonstrates the target word slowly, then at normal speed.
 * Stretches the target sound first (e.g. "r-r-rabbit"), then says it normally.
 *
 * STUB: logs and resolves with a simulated delay.
 */
export async function demonstrateWord(
    word: string,
    targetSound: string
): Promise<void> {
    console.log("[elevenlabs stub] demonstrateWord:", word, "sound:", targetSound);
    // Slow version
    await speakAsNova(`${targetSound}-${targetSound}-${word}`);
    await new Promise((r) => setTimeout(r, 300));
    // Normal speed
    await speakAsNova(word);
}
