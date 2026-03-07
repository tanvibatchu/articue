// WordCard.tsx — Displays the current practice word with emoji.
// Glass-morphism card with purple glow border that animates in on each new word.

"use client";

import { useEffect, useState } from "react";

type WordCardProps = {
    word: string;
    emoji: string;
};

export default function WordCard({ word, emoji }: WordCardProps) {
    // Re-trigger animation whenever the word changes
    const [key, setKey] = useState(word);

    useEffect(() => {
        setKey(word + Date.now());
    }, [word]);

    return (
        <div
            key={key}
            className={[
                // Layout
                "flex flex-col items-center gap-3 px-8 py-6 rounded-3xl",
                // Glass effect
                "bg-white/5 backdrop-blur-md",
                // Border glow
                "border border-purple-400/30 shadow-[0_0_24px_rgba(124,58,237,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]",
                // Entrance animation
                "animate-[fade-slide-in_0.4s_ease-out_forwards]",
                // Width
                "w-full max-w-xs",
            ].join(" ")}
        >
            {/* Emoji */}
            <span
                className="text-7xl leading-none select-none"
                role="img"
                aria-label={word}
            >
                {emoji}
            </span>

            {/* Word */}
            <p className="text-3xl font-bold tracking-wide text-white drop-shadow-md text-center">
                {word}
            </p>
        </div>
    );
}
