'use client';
import { ArrowUpRight } from 'lucide-react';
import { useI18n } from '@/i18n/provider';
export default function LandingLogin() {
  const { dictionary } = useI18n();
  return (
    <>
      {dictionary.auth.signIn} <ArrowUpRight size={16} />
    </>
  );
}
