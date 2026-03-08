'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ParentGate from '@/components/ParentGate';

export default function RolePage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/');
      return;
    }

    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (!data.profile) {
          router.replace('/onboarding');
        }
      })
      .catch(() => router.replace('/'));
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F4F1] flex items-center justify-center">
        <div className="text-[#390052] text-xl font-bold tracking-widest uppercase">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F4F1] flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md w-full">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-[#945F95] font-black">
            Welcome back
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-[#390052]">
            Choose your view
          </h1>
          <p className="text-lg font-bold text-[#945F95]">
            Continue as a parent or switch to the child view.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setShowGate(true)}
            className="px-6 py-4 bg-white text-[#945F95] border-2 border-[rgba(57,0,82,0.1)] font-semibold rounded-lg shadow-lg shadow-[rgba(57,0,82,0.05)] hover:-translate-y-0.5 transition-all duration-200"
          >
            Parent
          </button>
          <Link
            href="/kid"
            className="px-6 py-4 bg-[#CE7DA5] text-white font-semibold rounded-lg shadow-lg shadow-[#CE7DA5]/40 hover:bg-[#b0678b] hover:-translate-y-0.5 transition-all duration-200"
          >
            Child
          </Link>
        </div>
      </div>
      {showGate && (
        <ParentGate
          onClose={() => setShowGate(false)}
          onSuccess={() => router.push('/Parent')}
        />
      )}
    </div>
  );
}
