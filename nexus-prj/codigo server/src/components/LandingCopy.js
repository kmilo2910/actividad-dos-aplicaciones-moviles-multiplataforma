'use client';
import Link from 'next/link';
import { ArrowUpRight, LibraryBig, UsersRound } from 'lucide-react';
import { useI18n } from '@/i18n/provider';
export default function LandingCopy() {
  const { dictionary } = useI18n();
  const t = dictionary.landing;
  return (
    <>
      <section className="hero">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="lead">{t.description}</p>
        <Link className="button" href="/login">
          {t.start} <ArrowUpRight size={17} />
        </Link>
      </section>
      <section className="landing-visual" aria-label={t.aria}>
        <div className="visual-orbit visual-orbit-one" />
        <div className="visual-orbit visual-orbit-two" />
        <div className="visual-card visual-card-main">
          <span className="visual-icon">
            <LibraryBig size={30} />
          </span>
          <span className="visual-kicker">{t.kicker}</span>
          <strong>{t.visualTitle}</strong>
          <p>{t.visualDescription}</p>
        </div>
        <div className="visual-card visual-card-float">
          <UsersRound size={18} />
          <span>{t.visualFloat}</span>
        </div>
      </section>
    </>
  );
}
