// MicButton.tsx — Solid gamified mic button
"use client";

import WaveformDisplay from "./WaveformDisplay";
import { useState } from "react";

type MicButtonProps = {
    onStart: () => void;
    onStop: () => void;
    isRecording: boolean;
    disabled: boolean;
};

export default function MicButton({
    onStart,
    onStop,
    isRecording,
    disabled,
}: MicButtonProps) {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <div className="flex flex-col items-center gap-4">
            <WaveformDisplay isActive={isRecording} />

            <button
                onPointerDown={() => {
                    if (!disabled) {
                        setIsPressed(true);
                        onStart();
                    }
                }}
                onPointerUp={() => {
                    setIsPressed(false);
                    if (!disabled) onStop();
                }}
                onPointerLeave={() => {
                    setIsPressed(false);
                    if (!disabled && isRecording) onStop();
                }}
                disabled={disabled}
                aria-label={isRecording ? "Recording" : "Hold to speak"}
                className="relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-100 outline-none"
                style={{
                    background: disabled ? "white" : isRecording ? "white" : "#CE7DA5", // match word practice color
                    border: disabled 
                        ? "4px solid rgba(57,0,82,0.1)" 
                        : isRecording 
                            ? "4px solid #CE7DA5" 
                            : "none",
                    borderBottom: !disabled && !isRecording && !isPressed 
                        ? "8px solid #945F95" // darker shade for 3d depth
                        : !disabled && !isRecording && isPressed
                            ? "none" 
                            : disabled ? "4px solid rgba(57,0,82,0.1)" : "4px solid #CE7DA5",
                    transform: isPressed ? "translateY(8px)" : isRecording ? "scale(1.05)" : "translateY(0)",
                    opacity: disabled ? 0.6 : 1,
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-12 h-12"
                    style={{ color: disabled ? "#945F95" : isRecording ? "#CE7DA5" : "white" }}
                    aria-hidden="true"
                >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
                </svg>

                {isRecording && (
                    <span 
                        className="absolute inset-0 rounded-full animate-ping opacity-60" 
                        style={{ border: "4px solid #CE7DA5" }}
                    />
                )}
            </button>

            <p className="text-sm font-bold text-[#945F95] select-none uppercase tracking-widest mt-1">
                {disabled
                    ? "Nova is speaking"
                    : isRecording
                        ? "Listening... release"
                        : "Hold to speak"}
            </p>
        </div>
    );
}
