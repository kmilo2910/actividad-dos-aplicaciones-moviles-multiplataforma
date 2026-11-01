import Link from 'next/link';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import LanguageSelector from '@/i18n/LanguageSelector';
import LandingCopy from '@/components/LandingCopy';
import LandingLogin from '@/components/LandingLogin';

export default function HomePage() {
  return (
    <main className="landing">
      <header className="landing-header">
        <Link href="/" className="landing-brand">
          <span className="landing-logo">
            <BookOpen size={20} />
          </span>
          <span>
            <strong>Nexus</strong>
            <small>Campus digital</small>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <Link href="/login" className="landing-login">
            <LandingLogin />
          </Link>
        </div>
      </header>
      <div className="landing-content">
        <LandingCopy />
      </div>
    </main>
  );
}
