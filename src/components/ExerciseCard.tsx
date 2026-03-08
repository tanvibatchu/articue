// ExerciseCard.tsx — Gamified, bright, 3D animated exercise menu button.
"use client";

import Link from "next/link";
import { useState } from "react";

type ExerciseCardProps = {
    href: string;
    emoji: string;
    title: string;
    description: string;
    colorTheme: string;
    badge?: string;
};

export default function ExerciseCard({
    href,
    emoji,
    title,
    description,
    colorTheme,
    badge,
}: ExerciseCardProps) {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <Link 
            href={href} 
            className="block w-full focus:outline-none"
            onPointerDown={() => setIsPressed(true)}
            onPointerUp={() => setIsPressed(false)}
            onPointerLeave={() => setIsPressed(false)}
        >
            <div
                className="relative bg-white rounded-[24px] px-5 py-5 transition-transform duration-100 select-none flex items-center justify-between"
                style={{
                    border: `2px solid rgba(57, 0, 82, 0.1)`,
                    borderBottom: isPressed ? `2px solid rgba(57, 0, 82, 0.1)` : `6px solid ${colorTheme}`,
                    transform: isPressed ? 'translateY(4px)' : 'translateY(0)',
                }}
            >
                <div className="flex items-center gap-4">
                    {/* Big squircle emoji badge */}
                    <div
                        className="flex-shrink-0 w-16 h-16 rounded-[20px] flex items-center justify-center text-4xl shadow-sm"
                        style={{ background: `${colorTheme}15`, border: `2px solid ${colorTheme}50` }}
                    >
                        {emoji}
                    </div>

                    {/* Text wrapper */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-black text-[#390052]">{title}</h2>
                        </div>
                        <p className="text-[0.9rem] font-bold text-[#945F95] leading-snug">{description}</p>
                        
                        {badge && (
                            <span 
                                className="inline-block mt-2 text-[0.7rem] font-black tracking-widest uppercase px-2 py-0.5 rounded-xl bg-[rgba(57,0,82,0.05)] text-[#631D76]"
                            >
                                {badge}
                            </span>
                        )}
                    </div>
                </div>

                {/* Arrow Caret */}
                <div className="text-[#945F95] opacity-50 font-black text-2xl pr-2">
                    ›
                </div>
            </div>
        </Link>
    );
}
