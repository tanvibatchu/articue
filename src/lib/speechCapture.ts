/**
 * Web Speech API wrapper for capturing child speech (en-CA).
 * Import: startListening, stopListening
 */

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export interface SpeechRecognitionInstance {
  start(): void;
  stop(): void;
  abort(): void;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

export interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

export type SpeechRecognition = SpeechRecognitionInstance;

function getSpeechRecognition(): new () => SpeechRecognitionInstance {
  if (typeof window === "undefined") throw new Error("Speech recognition is only available in the browser");
  const Klass = window.SpeechRecognition ?? window.webkitSpeechRecognition;
  if (!Klass) throw new Error("SpeechRecognition is not supported in this browser");
  return Klass;
}

let _lastRecognition: SpeechRecognition | null = null;

export function startListening(
  onResult: (transcript: string, confidence: number) => void,
  onError: (error: string) => void
): SpeechRecognition {
  try {
    const Recognition = getSpeechRecognition();
    const recognition = new Recognition();
    _lastRecognition = recognition;
    recognition.lang = "en-CA";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.resultIndex];
      const item = result.isFinal ? result[0] : result[result.length - 1];
      const transcript = (item?.transcript ?? "").trim();
      const confidence = typeof item?.confidence === "number" ? item.confidence : 0;
      if (transcript) onResult(transcript, confidence);
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      onError(String(event.message ?? event.error ?? "Speech recognition error"));
    };
    recognition.start();
    return recognition;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    onError(message);
    throw err;
  }
}

export function stopListening(recognition?: SpeechRecognition): void {
  const r = recognition ?? _lastRecognition;
  if (!r) return;
  try { r.stop(); } catch { try { r.abort(); } catch { } }
}
