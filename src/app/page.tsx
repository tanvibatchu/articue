'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F4F1] flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md w-full">
        <h1 className="text-6xl md:text-7xl font-bold text-[#390052]">
          ArtiCue
        </h1>
        <p className="text-xl md:text-2xl text-[#945F95]">
          Speech therapy for every Canadian child — no waitlist required.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/auth/login?returnTo=/role"
            className="inline-block px-8 py-4 bg-white text-[#945F95] border-2 border-[rgba(57,0,82,0.1)] font-semibold rounded-lg shadow-lg shadow-[rgba(57,0,82,0.05)] transition-all duration-200 hover:-translate-y-0.5"
          >
            Log In
          </a>
          <a
            href="/auth/login?screen_hint=signup&returnTo=/onboarding"
            className="inline-block px-8 py-4 bg-[#CE7DA5] hover:bg-[#b0678b] text-white font-semibold rounded-lg shadow-lg shadow-[#CE7DA5]/40 transition-all duration-200 hover:-translate-y-0.5"
          >
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}
