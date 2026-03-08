// StreakBadge.tsx — Shows the child's daily streak with solid bright design.
"use client";

export default function StreakBadge({ streak }: { streak: number }) {
    return (
        <div 
            className="flex items-center select-none rounded-[16px] px-4 py-2"
            style={{ 
                background: "white", 
                border: "2px solid rgba(57, 0, 82, 0.1)",
                borderBottom: "4px solid #FF9600" /* Solid streak orange */
            }}
        >
            <span
                className="text-2xl leading-none animate-[streak-pulse_2.5s_ease-in-out_infinite] mr-2"
                role="img" aria-label="streak fire"
            >
                🔥
            </span>
            <span className="text-lg font-black text-[#FF9600] tabular-nums tracking-wide">
                {streak}
            </span>
        </div>
    );
}
