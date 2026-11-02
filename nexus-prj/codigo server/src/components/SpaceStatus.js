'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useI18n } from '@/i18n/provider';
export default function SpaceStatus({ space }) {
  const { user } = useUser();
  const email = user?.email;
  const own = email && space.occupiedByEmail && email === space.occupiedByEmail;
  const { dictionary } = useI18n();
  const t = dictionary.coworking;
  if (space.status === 'available')
    return (
      <span className="rounded-full bg-[#e8f3eb] px-3 py-1 text-xs font-semibold text-[#2f6f4e]">
        {t.available}
      </span>
    );
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        own ? 'bg-[#e8eefc] text-[#315a9b]' : 'bg-[#fff1e7] text-[#a4511f]'
      }`}
    >
      {own ? t.reservedByYou : t.occupied}
    </span>
  );
}
