// wordBanks.ts — All practice words organized by target sound and word position.
// Clinically ordered: initial → medial → final (matches real SLP progression).

export type WordEntry = {
    word: string;
    emoji: string;
};

export type SoundBank = {
    initial: WordEntry[];
    medial: WordEntry[];
    final: WordEntry[];
};

export type WordBanks = {
    r: SoundBank;
    s: SoundBank;
    th: SoundBank;
    l: SoundBank;
    fluency: {
        phrases: WordEntry[];
    };
};

export type TargetSound = "r" | "s" | "th" | "l" | "fluency";

export const wordBanks: WordBanks = {
    r: {
        initial: [
            { word: "rabbit", emoji: "🐰" },
            { word: "rainbow", emoji: "🌈" },
            { word: "rocket", emoji: "🚀" },
            { word: "ring", emoji: "💍" },
            { word: "river", emoji: "🏞️" },
        ],
        medial: [
            { word: "carrot", emoji: "🥕" },
            { word: "parrot", emoji: "🦜" },
            { word: "arrow", emoji: "🏹" },
            { word: "mirror", emoji: "🪞" },
            { word: "berry", emoji: "🍓" },
        ],
        final: [
            { word: "star", emoji: "⭐" },
            { word: "bear", emoji: "🐻" },
            { word: "car", emoji: "🚗" },
            { word: "door", emoji: "🚪" },
            { word: "four", emoji: "4️⃣" },
        ],
    },
    s: {
        initial: [
            { word: "sun", emoji: "☀️" },
            { word: "sock", emoji: "🧦" },
            { word: "sandwich", emoji: "🥪" },
            { word: "seven", emoji: "7️⃣" },
            { word: "soap", emoji: "🧼" },
        ],
        medial: [
            { word: "pencil", emoji: "✏️" },
            { word: "basket", emoji: "🧺" },
            { word: "castle", emoji: "🏰" },
            { word: "bison", emoji: "🦬" },
            { word: "whisper", emoji: "🤫" },
        ],
        final: [
            { word: "bus", emoji: "🚌" },
            { word: "grass", emoji: "🌿" },
            { word: "mouse", emoji: "🐭" },
            { word: "house", emoji: "🏠" },
            { word: "dress", emoji: "👗" },
        ],
    },
    th: {
        initial: [
            { word: "thumb", emoji: "👍" },
            { word: "three", emoji: "3️⃣" },
            { word: "thunder", emoji: "⛈️" },
            { word: "think", emoji: "💭" },
            { word: "thorn", emoji: "🌹" },
        ],
        medial: [
            { word: "feather", emoji: "🪶" },
            { word: "mother", emoji: "👩" },
            { word: "brother", emoji: "👦" },
            { word: "bathtub", emoji: "🛁" },
            { word: "birthday", emoji: "🎂" },
        ],
        final: [
            { word: "bath", emoji: "🛁" },
            { word: "teeth", emoji: "🦷" },
            { word: "mouth", emoji: "👄" },
            { word: "earth", emoji: "🌍" },
            { word: "north", emoji: "🧭" },
        ],
    },
    l: {
        initial: [
            { word: "lion", emoji: "🦁" },
            { word: "lemon", emoji: "🍋" },
            { word: "leaf", emoji: "🍃" },
            { word: "lamp", emoji: "💡" },
            { word: "lake", emoji: "🏞️" },
        ],
        medial: [
            { word: "balloon", emoji: "🎈" },
            { word: "jelly", emoji: "🍮" },
            { word: "pillow", emoji: "🛏️" },
            { word: "yellow", emoji: "💛" },
            { word: "melon", emoji: "🍈" },
        ],
        final: [
            { word: "ball", emoji: "⚽" },
            { word: "bell", emoji: "🔔" },
            { word: "shell", emoji: "🐚" },
            { word: "hill", emoji: "⛰️" },
            { word: "owl", emoji: "🦉" },
        ],
    },
    fluency: {
        phrases: [
            { word: "The big brown bear", emoji: "🐻" },
            { word: "I like to play outside", emoji: "🌳" },
            { word: "My dog is very friendly", emoji: "🐶" },
            { word: "The sun is shining today", emoji: "☀️" },
            { word: "I want some apple juice", emoji: "🍎" },
        ],
    },
};

/** Flatten a sound's words into a single session list (initial first, then medial, then final) */
export function getSessionWords(sound: TargetSound, limit = 8): WordEntry[] {
    if (sound === "fluency") {
        return wordBanks.fluency.phrases.slice(0, limit);
    }
    const bank = wordBanks[sound];
    return [...bank.initial, ...bank.medial, ...bank.final].slice(0, limit);
}
