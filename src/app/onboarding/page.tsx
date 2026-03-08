// Onboarding page component
// 3-screen onboarding flow to collect child name, age, and target sounds
// Saves profile to Firebase and redirects to /kid on completion
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Lottie from "lottie-react";
import mascotBirdData from "../../../public/mascot_bird.json";

type Screen = 1 | 2 | 3;

const sounds = [
  { id: 'r', label: 'R sound', emoji: '🚀' },
  { id: 's', label: 'S sound', emoji: '🌟' },
  { id: 'th', label: 'TH sound', emoji: '🦷' },
  { id: 'l', label: 'L sound', emoji: '🦁' },
  { id: 'fluency', label: 'Fluency/Stuttering', emoji: '🌊' },
];

export default function OnboardingPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(5);
  const [selectedSounds, setSelectedSounds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const toggleSound = (soundId: string) => {
    setSelectedSounds((prev) =>
      prev.includes(soundId)
        ? prev.filter((s) => s !== soundId)
        : [...prev, soundId]
    );
  };

  const handleNext = () => {
    if (currentScreen === 1 && name.trim()) {
      setCurrentScreen(2);
    } else if (currentScreen === 2 && selectedSounds.length > 0) {
      setCurrentScreen(3);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          age,
          targetSounds: selectedSounds,
          streak: 0,
          lastSessionDate: '',
          totalXP: 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      router.push('/Parent');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F4F1] flex flex-col items-center justify-center px-4 py-8">
      {/* Progress dots */}
      <div className="flex gap-3 mb-8">
        {[1, 2, 3].map((screen) => (
          <div
            key={screen}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentScreen === screen
                ? 'bg-[#CE7DA5] shadow-lg shadow-[#CE7DA5]/50 scale-125'
                : 'bg-[rgba(57,0,82,0.12)]'
            }`}
          />
        ))}
      </div>

      {/* Screen 1: Name and Age */}
      {currentScreen === 1 && (
        <div className="w-full max-w-md space-y-8 animate-fade-in text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#390052]">
            What&apos;s your child&apos;s name?
          </h2>
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Child's name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border-2 border-[rgba(57,0,82,0.1)] text-[#390052] placeholder-[#945F95]/50 font-bold focus:outline-none focus:ring-2 focus:ring-[#CE7DA5] focus:border-transparent"
            />
            <select
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-white border-2 border-[rgba(57,0,82,0.1)] text-[#390052] font-bold focus:outline-none focus:ring-2 focus:ring-[#CE7DA5] focus:border-transparent"
            >
              {Array.from({ length: 10 }, (_, i) => i + 3).map((a) => (
                <option key={a} value={a}>
                  {a} years old
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleNext}
            disabled={!name.trim()}
            className="w-full py-4 bg-[#CE7DA5] hover:bg-[#b0678b] disabled:bg-[rgba(57,0,82,0.1)] disabled:text-[#945F95] disabled:cursor-not-allowed text-white font-black rounded-xl shadow-lg shadow-[#CE7DA5]/30 transition-all duration-200 uppercase tracking-wider"
          >
            Next
          </button>
        </div>
      )}

      {/* Screen 2: Target Sounds */}
      {currentScreen === 2 && (
        <div className="w-full max-w-2xl space-y-8 animate-fade-in text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#390052]">
            What sounds are we working on?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sounds.map((sound) => (
              <button
                key={sound.id}
                onClick={() => toggleSound(sound.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selectedSounds.includes(sound.id)
                    ? 'bg-[#CE7DA5]/10 border-[#CE7DA5] shadow-lg shadow-[#CE7DA5]/20 scale-105'
                    : 'bg-white border-[rgba(57,0,82,0.1)] hover:bg-[#F9F4F1]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{sound.emoji}</span>
                  <span className={`text-lg font-black ${selectedSounds.includes(sound.id) ? 'text-[#CE7DA5]' : 'text-[#390052]'}`}>
                    {sound.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={selectedSounds.length === 0}
            className="w-full py-4 bg-[#CE7DA5] hover:bg-[#b0678b] disabled:bg-[rgba(57,0,82,0.1)] disabled:text-[#945F95] disabled:cursor-not-allowed text-white font-black rounded-xl shadow-lg shadow-[#CE7DA5]/30 transition-all duration-200 uppercase tracking-wider"
          >
            Next
          </button>
        </div>
      )}

      {/* Screen 3: Meet Nova */}
      {currentScreen === 3 && (
        <div className="w-full max-w-md space-y-8 animate-fade-in text-center">
          <div className="w-64 h-64 mx-auto -mb-8 flex items-center justify-center">
             <Lottie animationData={mascotBirdData} loop={true} className="w-full h-full" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#390052]">
            Hi! I&apos;m Nova, {name}&apos;s coach
          </h2>
          <p className="text-xl font-bold text-[#945F95]">
            I am patient, fun, and I never give up on you.
          </p>
          {error && (
            <div className="p-4 bg-red-100 border-2 border-red-500 rounded-xl text-red-700 font-bold">
              {error}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 bg-[#CE7DA5] hover:bg-[#b0678b] disabled:bg-[rgba(57,0,82,0.1)] disabled:text-[#945F95] disabled:cursor-not-allowed text-white font-black rounded-xl shadow-lg shadow-[#CE7DA5]/30 transition-all duration-200 uppercase tracking-wider"
          >
            {isSubmitting ? 'Setting up...' : "Let's Start!"}
          </button>
        </div>
      )}
    </div>
  );
}
