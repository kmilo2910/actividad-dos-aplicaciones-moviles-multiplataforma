'use client';

import { useState } from 'react';
import { ArrowRight, BookOpen, Check, Coffee, ShieldCheck } from 'lucide-react';
import LanguageSelector from '@/i18n/LanguageSelector';
import { useI18n } from '@/i18n/provider';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { dictionary } = useI18n();
  const t = dictionary.auth;
  async function login() {
    setLoading(true);
    setError('');
    window.location.assign('/auth/login?connection=google-oauth2&returnTo=/dashboard');
  }
  return (
    <main className="safe-area-top safe-area-bottom relative min-h-[100svh] bg-[#f4f1eb] px-3 text-[#17202a] sm:p-4 md:p-6">
      <div className="absolute right-5 top-5 z-10 sm:right-8 sm:top-8">
        <LanguageSelector />
      </div>
      <div className="mx-auto grid min-h-[calc(100svh-2rem)] max-w-7xl overflow-hidden rounded-[1.5rem] border border-[#d8d5ce]/70 bg-white shadow-2xl shadow-[#17202a]/10 sm:rounded-[2rem] lg:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.15fr_.85fr]">
        <section className="order-2 relative flex flex-col justify-between overflow-hidden bg-[#1f4f66] p-6 text-[#f4f1eb] sm:p-8 md:p-12 lg:order-1 lg:p-16">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border-[50px] border-white/10" />
          <div className="absolute -bottom-36 -left-20 h-96 w-96 rounded-full border-[70px] border-white/10" />
          <div className="relative">
            <div className="flex items-center gap-3 font-semibold tracking-tight">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f4f1eb] text-[#1f4f66]">
                <BookOpen size={20} />
              </span>
              <span className="text-xl">Nexus</span>
            </div>
            <div className="mt-12 max-w-xl sm:mt-20 md:mt-32">
              <p className="text-xs font-bold uppercase tracking-[.24em] text-[#b8d2d6]">
                {t.campus}
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-[.98] tracking-[-.06em] sm:text-5xl md:mt-5 md:text-7xl">
                {t.heroTitle}
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[#dbe8ea] sm:mt-7 sm:text-lg">
                {t.heroDescription}
              </p>
            </div>
          </div>
          <div className="relative mt-10 hidden gap-4 text-sm text-[#dbe8ea] sm:grid sm:grid-cols-2 lg:mt-16">
            <span className="flex items-center gap-2">
              <Check size={16} /> {t.libraryBenefit}
            </span>
            <span className="flex items-center gap-2">
              <Check size={16} /> {t.coworkingBenefit}
            </span>
          </div>
        </section>
        <section className="order-1 flex items-center justify-center bg-[#faf9f6] px-6 py-16 sm:p-10 md:p-14 lg:order-2">
          <div className="w-full max-w-sm">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#1f4f66]">
              {t.secureAccess}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-.05em] sm:text-4xl">{t.title}</h2>
            <p className="mt-4 leading-relaxed text-[#64707d]">{t.description}</p>
            <div className="mt-7 space-y-4 sm:mt-10">
              <div className="flex items-center gap-3 rounded-2xl border border-[#d8d5ce] p-4">
                <ShieldCheck className="shrink-0 text-[#1f4f66]" size={21} />
                <div>
                  <p className="text-sm font-semibold">{t.accountBenefit}</p>
                  <p className="mt-1 text-xs text-[#64707d]">{t.googleAuth}</p>
                </div>
              </div>
              <button
                className="flex w-full items-center justify-between rounded-2xl bg-[#1f4f66] px-5 py-4 font-semibold text-white transition hover:bg-[#173b4d] disabled:cursor-wait disabled:opacity-60"
                onClick={login}
                disabled={loading}
              >
                <span>{loading ? t.connecting : t.continueWithGoogle}</span>
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <ArrowRight size={19} />
                )}
              </button>
            </div>
            {error && <p className="error mt-5">{error}</p>}
            <div className="mt-8 flex items-center gap-2 text-xs text-[#64707d] sm:mt-10">
              <Coffee size={15} /> {t.communityAccess}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
