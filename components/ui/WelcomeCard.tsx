"use client";

import Link from "next/link";

interface Props {
  title: string;
  subtitle: string;
  onStart: () => void;
}

export default function WelcomeCard({ title, subtitle, onStart }: Props) {
  return (
    <div className="py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition mb-6">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Torna alla home
      </Link>
      <div className="text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-3">{title}</h1>
      <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">{subtitle}</p>
      <button
        onClick={onStart}
        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm"
      >
        Inizia la compilazione →
      </button>
      </div>
    </div>
  );
}
