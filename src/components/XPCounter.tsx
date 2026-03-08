// XPCounter.tsx — Displays current session XP with a solid gold styling.
"use client";

import { useEffect, useRef, useState } from "react";

type FloatingLabel = { id: number; amount: number; };

export default function XPCounter({ xp }: { xp: number }) {
    const prevXpRef = useRef(xp);
    const [floats, setFloats] = useState<FloatingLabel[]>([]);

    useEffect(() => {
        const diff = xp - prevXpRef.current;
        if (diff > 0) {
            const id = Date.now();
            setFloats((f) => [...f, { id, amount: diff }]);
            setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1300);
        }
        prevXpRef.current = xp;
    }, [xp]);

    return (
        <div className="relative select-none">
            {floats.map((f) => (
                <span
                    key={f.id}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-black text-[#FFC800] animate-[float-up_1.2s_ease-out_forwards] pointer-events-none"
                    style={{ textShadow: "0 2px 4px rgba(255, 200, 0, 0.4)" }}
                >
                    +{f.amount}
                </span>
            ))}

            <div 
                className="flex items-center rounded-[16px] px-4 py-2"
                style={{ 
                    background: "white", 
                    border: "2px solid rgba(57, 0, 82, 0.1)",
                    borderBottom: "4px solid #FFC800" /* Solid gold */
                }}
            >
                <span className="text-xl leading-none mr-2 drop-shadow-sm">⭐</span>
                <span className="text-lg font-black text-[#FFC800] tabular-nums tracking-wide">
                    {xp}
                </span>
            </div>
        </div>
    );
}
