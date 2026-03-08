// SessionSummary.tsx — Gamified bright light Session Summary
"use client";

import Nova from "./Nova";

type SessionSummaryProps = {
    accuracy: number;
    xpEarned: number;
    wordsCompleted: number;
    totalWords: number;
    message: string;
    onPlayAgain: () => void;
    onDone: () => void;
};

export default function SessionSummary({
    accuracy,
    xpEarned,
    wordsCompleted,
    totalWords,
    message,
    onPlayAgain,
    onDone,
}: SessionSummaryProps) {
    const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;

    return (
        <div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center animate-[slide-up_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] p-6 overflow-y-auto"
            style={{ background: "rgba(249, 244, 241, 0.95)", backdropFilter: "blur(10px)" }}
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white rounded-[32px] p-8 w-full max-w-sm flex flex-col items-center text-center shadow-sm border-2 border-[rgba(57,0,82,0.05)] border-b-[8px]">
                <div className="mb-2">
                    <Nova state="celebrating" size="lg" />
                </div>

                <h1 className="text-3xl font-black text-[#390052] mb-2 tracking-tight">
                    Great Job! 🎉
                </h1>

                <div className="flex gap-2 mb-6" aria-label={`${stars} out of 3 stars`}>
                    {[1, 2, 3].map((s) => (
                        <span
                            key={s}
                            className={[
                                "text-4xl transition-all duration-300 drop-shadow-sm",
                                s <= stars ? "opacity-100 scale-110" : "opacity-25 grayscale",
                            ].join(" ")}
                            aria-hidden
                        >
                            ⭐
                        </span>
                    ))}
                </div>

                <p className="text-[#945F95] text-lg font-bold italic mb-8 max-w-xs leading-snug">
                    "{message}"
                </p>

                <div className="grid grid-cols-3 gap-3 w-full mb-8">
                    <StatCard label="Accuracy" value={`${accuracy}%`} icon="🎯" color="#58CC02" />
                    <StatCard label="XP Earned" value={`+${xpEarned}`} icon="⭐" color="#FFC800" />
                    <StatCard label="Words" value={`${wordsCompleted}/${totalWords}`} icon="📝" color="#CE7DA5" />
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <button
                        onClick={onPlayAgain}
                        className="w-full py-4 rounded-[20px] font-black text-xl text-white outline-none transform transition-transform active:translate-y-1"
                        style={{ background: "#1CB0F6", borderBottom: "6px solid #1899D6" }}
                    >
                        Practice Again 🚀
                    </button>

                    <button
                        onClick={onDone}
                        className="w-full py-4 rounded-[20px] font-black text-lg text-[#945F95] outline-none transform transition-transform active:translate-y-1 bg-white"
                        style={{ border: "2px solid rgba(57,0,82,0.1)", borderBottom: "6px solid rgba(57,0,82,0.1)" }}
                    >
                        Done for Today
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string; }) {
    return (
        <div className="flex flex-col items-center gap-1 bg-white rounded-2xl py-3 px-1" style={{ border: "2px solid rgba(57,0,82,0.05)" }}>
            <span className="text-2xl drop-shadow-sm" aria-hidden>{icon}</span>
            <span className="text-xl font-black tabular-nums mt-1" style={{ color }}>{value}</span>
            <span className="text-[0.65rem] uppercase tracking-widest font-black text-[#945F95]">{label}</span>
        </div>
    );
}
