// WordCard.tsx — Gamified bright WordCard
"use client";

import { useEffect, useState } from "react";
import { TargetSound } from "@/lib/wordBanks";

type WordCardProps = {
    word: string;
    emoji: string;
    targetSound: TargetSound;
};

function PhoneticWord({ word, targetSound }: { word: string; targetSound: TargetSound }) {
    const sound = targetSound === "fluency" ? "" : targetSound;
    if (!sound) return <span className="text-[#390052]">{word}</span>;

    const regex = new RegExp(`(${sound})`, "gi");
    const parts = word.split(regex);

    return (
        <span>
            {parts.map((part, i) =>
                part.toLowerCase() === sound.toLowerCase() ? (
                    <span
                        key={i}
                        className="text-[#CE7DA5] font-black underline decoration-[#CE7DA5] decoration-4 underline-offset-4"
                    >
                        {part}
                    </span>
                ) : (
                    <span key={i} className="text-[#390052]">
                        {part}
                    </span>
                )
            )}
        </span>
    );
}

function PhoneticHint({ word, targetSound }: { word: string; targetSound: TargetSound }) {
    if (targetSound === "fluency") {
        return <p className="text-[#945F95] font-bold text-sm text-center">Say it smoothly and clearly</p>;
    }

    const sound = targetSound.toUpperCase();
    const lower = word.toLowerCase();
    let soundedOut = word;
    if (lower.startsWith(targetSound)) {
        const rest = word.slice(targetSound.length);
        soundedOut = `${targetSound.toUpperCase()} ... ${rest}`;
    } else {
        const idx = lower.indexOf(targetSound);
        if (idx > 0) {
            soundedOut = `${word.slice(0, idx)} ... ${targetSound.toUpperCase()} ... ${word.slice(idx + targetSound.length)}`;
        }
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <span className="text-xs uppercase tracking-[0.2em] text-[#945F95] font-black">
                Focus on the <span className="text-[#CE7DA5]">{sound}</span> sound
            </span>
            <span className="text-lg text-[#631D76] font-black tracking-widest mt-1">
                {soundedOut}
            </span>
        </div>
    );
}

export default function WordCard({ word, emoji, targetSound }: WordCardProps) {
    return (
        <div
            key={word}
            className="flex flex-col items-center gap-4 px-8 py-6 rounded-[24px] w-full max-w-sm md:max-w-lg bg-white animate-[fade-slide-in_0.4s_ease-out_forwards]"
            style={{
                border: "2px solid rgba(57, 0, 82, 0.1)",
                borderBottom: "6px solid #CE7DA5", /* Peony matching Word Practice */
            }}
        >
            <span className="text-7xl leading-none select-none drop-shadow-sm" role="img" aria-label={word}>
                {emoji}
            </span>
            <p className="text-4xl font-black tracking-wide text-center">
                <PhoneticWord word={word} targetSound={targetSound} />
            </p>
            <PhoneticHint word={word} targetSound={targetSound} />
        </div>
    );
}
