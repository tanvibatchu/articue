// app/kid/page.tsx — Main kid-facing practice session page for ArtiCue.
// Orchestrates the full session flow: greeting → practicing → celebrating → summary.
// Uses stub lib functions; backend team replaces stubs with real implementations.

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Nova from "@/components/Nova";
import WordCard from "@/components/WordCard";
import MicButton from "@/components/MicButton";
import MouthDiagram from "@/components/MouthDiagram";
import CelebrationBurst from "@/components/CelebrationBurst";
import XPCounter from "@/components/XPCounter";
import StreakBadge from "@/components/StreakBadge";
import SessionSummary from "@/components/SessionSummary";
import { analyzePhoneme, PhonemeResult } from "@/lib/gemini";
import { speakAsNova, demonstrateWord } from "@/lib/elevenlabs";
import { startListening, stopListening } from "@/lib/speechCapture";
import { getSessionWords, TargetSound, WordEntry } from "@/lib/wordBanks";
import {
    startSession,
    recordAttempt,
    endSession,
    AttemptData,
} from "@/lib/sessionManager";

// ─── Types ─────────────────────────────────────────────────────────────────

type SessionPhase =
    | "loading"
    | "greeting"
    | "demonstrating"
    | "waiting"     // waiting for child to press mic
    | "recording"
    | "analyzing"
    | "celebrating"
    | "redirecting"
    | "summary";

type ChildProfile = {
    name: string;
    age: number;
    targetSounds: TargetSound[];
    streak: number;
};

const TOTAL_WORDS = 8;
const MAX_ATTEMPTS = 3;
const SCORE_THRESHOLD = 70;
const MOCK_USER_ID = "demo-user";

const SOUND_LABELS: Record<TargetSound, string> = {
    r: "R",
    s: "S",
    th: "TH",
    l: "L",
    fluency: "Fluency",
};

// ─── Component ─────────────────────────────────────────────────────────────

export default function KidPage() {
    // Profile
    const [profile, setProfile] = useState<ChildProfile | null>(null);
    const [activeSound, setActiveSound] = useState<TargetSound>("r");

    // Session state
    const [phase, setPhase] = useState<SessionPhase>("loading");
    const [words, setWords] = useState<WordEntry[]>([]);
    const [wordIndex, setWordIndex] = useState(0);
    const [attempts, setAttempts] = useState(0);

    // Game state
    const [xp, setXp] = useState(0);
    const [allAttempts, setAllAttempts] = useState<AttemptData[]>([]);

    // UI state
    const [novaState, setNovaState] = useState<"idle" | "celebrating" | "thinking" | "encouraging">("idle");
    const [showCelebration, setShowCelebration] = useState(false);
    const [showMouthDiagram, setShowMouthDiagram] = useState(false);
    const [lastResult, setLastResult] = useState<PhonemeResult | null>(null);

    // Summary
    const [showSummary, setShowSummary] = useState(false);
    const [summaryMessage, setSummaryMessage] = useState("");
    const [finalAccuracy, setFinalAccuracy] = useState(0);

    // Refs
    const sessionIdRef = useRef<string | null>(null);
    const phaseRef = useRef<SessionPhase>("loading");

    // Keep phaseRef in sync so callbacks can read current phase
    useEffect(() => {
        phaseRef.current = phase;
    }, [phase]);

    // ── Fetch profile on mount ──────────────────────────────────────────────

    useEffect(() => {
        async function loadProfile() {
            try {
                const res = await fetch("/api/profile");
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                    setActiveSound(data.targetSounds?.[0] ?? "r");
                } else {
                    throw new Error("Not found");
                }
            } catch {
                // Mock fallback for dev
                const mock: ChildProfile = {
                    name: "Maya",
                    age: 6,
                    targetSounds: ["r", "s", "l"],
                    streak: 3,
                };
                setProfile(mock);
                setActiveSound("r");
            }
        }
        loadProfile();
    }, []);

    // ── Start session when profile and sound are ready ──────────────────────

    const initSession = useCallback(async (profile: ChildProfile, sound: TargetSound) => {
        setPhase("loading");
        setWordIndex(0);
        setAttempts(0);
        setXp(0);
        setAllAttempts([]);
        setShowMouthDiagram(false);
        setShowSummary(false);
        setLastResult(null);

        const sessionWords = getSessionWords(sound, TOTAL_WORDS);
        setWords(sessionWords);

        const session = await startSession(MOCK_USER_ID, sound);
        sessionIdRef.current = session.sessionId;

        setNovaState("idle");
        setPhase("greeting");
    }, []);

    useEffect(() => {
        if (profile) {
            initSession(profile, activeSound);
        }
    }, [profile, activeSound, initSession]);

    // ── Greeting phase — Nova says hello and demonstrates first word ────────

    useEffect(() => {
        if (phase !== "greeting" || !profile || words.length === 0) return;

        async function greet() {
            setNovaState("encouraging");
            await speakAsNova(
                `Hi ${profile!.name}! Let's practice your ${SOUND_LABELS[activeSound]} sound! Can you say... ${words[0].word}?`
            );
            setNovaState("thinking");
            setPhase("demonstrating");
        }
        greet();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    // ── Demonstrating phase — play word slowly then normally ────────────────

    useEffect(() => {
        if (phase !== "demonstrating" || words.length === 0) return;

        async function demo() {
            await demonstrateWord(words[wordIndex].word, activeSound);
            setNovaState("idle");
            setPhase("waiting");
        }
        demo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    // ── Recording handlers ──────────────────────────────────────────────────

    function handleMicStart() {
        if (phase !== "waiting") return;
        setShowMouthDiagram(false);
        setPhase("recording");

        startListening(
            (transcript, _confidence) => {
                if (phaseRef.current !== "recording") return;
                setPhase("analyzing");
                handleTranscript(transcript);
            },
            (error) => {
                console.error("[kid/page] speechCapture error:", error);
                setPhase("waiting");
            },
            words[wordIndex]?.word
        );
    }

    function handleMicStop() {
        if (phase === "recording") {
            stopListening();
            // If no transcript fired yet, go back to waiting
            if (phaseRef.current === "recording") {
                setPhase("waiting");
            }
        }
    }

    // ── Transcript analysis ─────────────────────────────────────────────────

    async function handleTranscript(transcript: string) {
        const currentWord = words[wordIndex];
        setNovaState("thinking");

        const result = await analyzePhoneme({
            word: currentWord.word,
            transcript,
            targetSound: activeSound,
            age: profile?.age ?? 6,
        });

        setLastResult(result);

        // Record the attempt
        const attemptData: AttemptData = {
            word: currentWord.word,
            transcript,
            score: result.score,
            correct: result.correct,
            substitution: result.substitution,
        };

        if (sessionIdRef.current) {
            await recordAttempt(sessionIdRef.current, attemptData);
        }
        setAllAttempts((prev) => [...prev, attemptData]);

        if (result.correct || result.score >= SCORE_THRESHOLD) {
            await handleCorrect(result);
        } else {
            await handleNeedsWork(result);
        }
    }

    // ── Correct answer ──────────────────────────────────────────────────────

    async function handleCorrect(result: PhonemeResult) {
        setNovaState("celebrating");
        setShowCelebration(true);
        setXp((prev) => prev + 10);
        setPhase("celebrating");

        await speakAsNova(result.feedback);

        // Wait for confetti to settle
        await new Promise((r) => setTimeout(r, 1800));
        setShowCelebration(false);

        setAttempts(0);
        advanceWord();
    }

    // ── Needs work ──────────────────────────────────────────────────────────

    async function handleNeedsWork(result: PhonemeResult) {
        setNovaState("encouraging");
        setPhase("redirecting");

        await speakAsNova(result.feedback);
        setShowMouthDiagram(true);
        await speakAsNova(result.mouthCue);

        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);

        if (nextAttempts >= MAX_ATTEMPTS) {
            // Max attempts reached — move on graciously
            await speakAsNova("You're doing amazing — let's try the next one!");
            setShowMouthDiagram(false);
            setAttempts(0);
            advanceWord();
        } else {
            // Try again
            setNovaState("idle");
            setPhase("demonstrating");
        }
    }

    // ── Advance to next word or end session ─────────────────────────────────

    function advanceWord() {
        const nextIndex = wordIndex + 1;
        if (nextIndex >= words.length || nextIndex >= TOTAL_WORDS) {
            finishSession();
        } else {
            setWordIndex(nextIndex);
            setNovaState("thinking");
            setPhase("demonstrating");
        }
    }

    // ── End session ─────────────────────────────────────────────────────────

    async function finishSession() {
        setPhase("summary");
        if (sessionIdRef.current) {
            const summary = await endSession(sessionIdRef.current, allAttempts);
            setFinalAccuracy(summary.averageAccuracy);
            setSummaryMessage(
                summary.averageAccuracy >= 80
                    ? "You're a speech superstar! I'm so proud of you!"
                    : summary.averageAccuracy >= 60
                        ? "Fantastic effort today! Every practice makes you stronger!"
                        : "You showed up and tried your best — that's what matters most!"
            );
        } else {
            const correct = allAttempts.filter((a) => a.correct).length;
            const acc = allAttempts.length > 0
                ? Math.round((correct / allAttempts.length) * 100)
                : 0;
            setFinalAccuracy(acc);
            setSummaryMessage("Amazing session! I&apos;m so proud of you!");
        }
        setShowSummary(true);
    }

    // ── Sound selector handler ──────────────────────────────────────────────

    function handleSoundChange(sound: TargetSound) {
        if (sound === activeSound) return;
        stopListening();
        setActiveSound(sound);
        // initSession will re-run via the effect above
    }

    // ── Progress dots ───────────────────────────────────────────────────────

    const completedWords = Math.min(
        wordIndex + (phase === "celebrating" ? 1 : 0),
        TOTAL_WORDS
    );

    // ─── Render ──────────────────────────────────────────────────────────────

    if (!profile) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center gap-4">
                <div className="text-6xl animate-[nova-idle_3s_ease-in-out_infinite]">🌟</div>
                <p className="text-purple-300 text-lg">Getting things ready…</p>
            </main>
        );
    }

    return (
        <>
            {/* Celebration overlay (z-50, pointer-events-none) */}
            <CelebrationBurst active={showCelebration} />

            {/* Session summary overlay */}
            {showSummary && (
                <SessionSummary
                    accuracy={finalAccuracy}
                    xpEarned={xp}
                    wordsCompleted={completedWords}
                    totalWords={TOTAL_WORDS}
                    message={summaryMessage}
                    onPlayAgain={() => {
                        setShowSummary(false);
                        if (profile) initSession(profile, activeSound);
                    }}
                    onDone={() => {
                        window.location.href = "/";
                    }}
                />
            )}

            {/* Main page */}
            <main className="min-h-screen flex flex-col items-center px-4 pt-4 pb-8 gap-4 max-w-sm mx-auto">

                {/* ── Top bar: Streak + Sound tabs + XP ── */}
                <div className="w-full flex items-center justify-between">
                    <StreakBadge streak={profile.streak} />
                    <XPCounter xp={xp} />
                </div>

                {/* ── Sound selector tabs ── */}
                <div className="flex gap-1.5 bg-white/5 rounded-2xl p-1 w-full border border-white/10">
                    {profile.targetSounds.map((sound) => (
                        <button
                            key={sound}
                            onClick={() => handleSoundChange(sound)}
                            className={[
                                "flex-1 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200",
                                activeSound === sound
                                    ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.5)]"
                                    : "text-purple-300 hover:text-white",
                            ].join(" ")}
                            aria-pressed={activeSound === sound}
                        >
                            {SOUND_LABELS[sound]}
                        </button>
                    ))}
                </div>

                {/* ── Nova character ── */}
                <div className="flex-shrink-0 mt-2">
                    <Nova state={novaState} size="lg" />
                </div>

                {/* ── Status message ── */}
                <div className="text-center min-h-[2rem]">
                    {phase === "greeting" && (
                        <p className="text-purple-200 text-base animate-[fade-in_0.4s_ease-out]">
                            Nova is getting ready… ✨
                        </p>
                    )}
                    {phase === "demonstrating" && (
                        <p className="text-purple-200 text-base animate-[fade-in_0.4s_ease-out]">
                            Listen carefully…
                        </p>
                    )}
                    {phase === "waiting" && (
                        <p className="text-white text-base font-medium animate-[fade-in_0.4s_ease-out]">
                            Your turn! Hold the button and say it!
                        </p>
                    )}
                    {phase === "recording" && (
                        <p className="text-green-300 text-base animate-[fade-in_0.4s_ease-out]">
                            I&apos;m listening… 👂
                        </p>
                    )}
                    {phase === "analyzing" && (
                        <p className="text-purple-200 text-base animate-[nova-idle_1s_ease-in-out_infinite]">
                            Nova is thinking… 💭
                        </p>
                    )}
                    {phase === "celebrating" && (
                        <p className="text-yellow-300 text-lg font-bold animate-[fade-in_0.3s_ease-out]">
                            {lastResult?.feedback ?? "Amazing! 🎉"}
                        </p>
                    )}
                    {phase === "redirecting" && (
                        <p className="text-purple-200 text-base animate-[fade-in_0.4s_ease-out]">
                            {lastResult?.feedback ?? "Ooh so close! Let&apos;s try together!"}
                        </p>
                    )}
                </div>

                {/* ── Word card ── */}
                {words[wordIndex] && phase !== "greeting" && (
                    <WordCard
                        word={words[wordIndex].word}
                        emoji={words[wordIndex].emoji}
                    />
                )}

                {/* ── Mic button ── */}
                <div className="flex flex-col items-center mt-2">
                    <MicButton
                        onStart={handleMicStart}
                        onStop={handleMicStop}
                        isRecording={phase === "recording"}
                        disabled={
                            phase === "loading" ||
                            phase === "greeting" ||
                            phase === "demonstrating" ||
                            phase === "analyzing" ||
                            phase === "celebrating" ||
                            phase === "redirecting" ||
                            phase === "summary"
                        }
                    />
                </div>

                {/* ── Attempt indicator (dots below mic) ── */}
                {phase === "redirecting" || attempts > 0 ? (
                    <div className="flex gap-2 items-center" aria-label={`Attempt ${attempts} of ${MAX_ATTEMPTS}`}>
                        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                            <div
                                key={i}
                                className={[
                                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                                    i < attempts ? "bg-purple-400" : "bg-white/15",
                                ].join(" ")}
                            />
                        ))}
                        <span className="text-xs text-purple-400 ml-1">
                            attempt{attempts !== 1 ? "s" : ""}
                        </span>
                    </div>
                ) : null}

                {/* ── Mouth diagram ── */}
                <MouthDiagram
                    sound={activeSound !== "fluency" ? activeSound : null}
                    visible={showMouthDiagram}
                />

                {/* Fill space */}
                <div className="flex-1" />

                {/* ── Progress dots (words completed) ── */}
                <div className="flex flex-col items-center gap-2 pb-2">
                    <p className="text-xs text-purple-400">
                        Word {Math.min(completedWords + 1, TOTAL_WORDS)} of {TOTAL_WORDS}
                    </p>
                    <div className="flex gap-2" role="progressbar" aria-valuenow={completedWords} aria-valuemax={TOTAL_WORDS} aria-label="Words completed">
                        {Array.from({ length: TOTAL_WORDS }).map((_, i) => (
                            <div
                                key={i}
                                className={[
                                    "w-3 h-3 rounded-full transition-all duration-500",
                                    i < completedWords
                                        ? "bg-purple-400 shadow-[0_0_8px_rgba(167,139,250,0.6)] animate-[dot-fill_0.4s_ease-out_forwards]"
                                        : i === completedWords
                                            ? "bg-purple-600 ring-2 ring-purple-400/50"
                                            : "bg-white/10",
                                ].join(" ")}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
