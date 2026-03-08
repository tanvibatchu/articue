// ChoiceButton.tsx — Gamified solid ChoiceButton
"use client";

import { useEffect, useState } from "react";

type ChoiceState = "default" | "correct" | "wrong";

type ChoiceButtonProps = {
    label: string;
    emoji?: string;
    state?: ChoiceState;
    onClick: () => void;
    disabled?: boolean;
};

export default function ChoiceButton({
    label,
    emoji,
    state = "default",
    onClick,
    disabled = false,
}: ChoiceButtonProps) {
    const [shake, setShake] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    useEffect(() => {
        if (state === "wrong") {
            setShake(true);
            const t = setTimeout(() => setShake(false), 600);
            return () => clearTimeout(t);
        }
    }, [state]);

    return (
        <button
            onPointerDown={() => { if (!disabled) setIsPressed(true); }}
            onPointerUp={() => { setIsPressed(false); if (!disabled) onClick(); }}
            onPointerLeave={() => setIsPressed(false)}
            disabled={disabled}
            className={[
                "w-full py-4 px-5 rounded-[20px] outline-none",
                "flex items-center justify-center gap-3",
                "transition-all duration-100 select-none",
                shake ? "animate-[shake_0.5s_ease-in-out]" : "",
            ].join(" ")}
            style={{
                background: state === "correct" ? "#58CC02" : state === "wrong" ? "#FF4B4B" : "white",
                color: state === "correct" || state === "wrong" ? "white" : "#390052",
                border: "2px solid",
                borderColor: state === "correct" ? "#58CC02" : state === "wrong" ? "#FF4B4B" : "rgba(57,0,82,0.1)",
                borderBottom: isPressed || disabled
                    ? `2px solid ${state === "correct" ? "#58CC02" : state === "wrong" ? "#FF4B4B" : "rgba(57,0,82,0.1)"}`
                    : `6px solid ${state === "correct" ? "#46A302" : state === "wrong" ? "#CC3C3C" : "rgba(57,0,82,0.1)"}`,
                transform: isPressed ? "translateY(4px)" : state === "correct" ? "scale(1.02)" : "translateY(0)",
                opacity: disabled && state === "default" ? 0.6 : 1,
            }}
            aria-pressed={state === "correct"}
        >
            {emoji && <span className="text-2xl drop-shadow-sm" aria-hidden>{emoji}</span>}
            <span className="font-black text-xl tracking-tight">{label}</span>
            {state === "correct" && <span className="text-2xl font-black ml-2" aria-hidden>✓</span>}
        </button>
    );
}
