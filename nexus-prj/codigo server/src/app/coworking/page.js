import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Star } from 'lucide-react';
import LibraryShell from '@/components/LibraryShell';
import ReserveButton from '@/components/ReserveButton';
import SpaceStatus from '@/components/SpaceStatus';
import CoworkingIntro from '@/components/CoworkingIntro';
import CoworkingHighlights from '@/components/CoworkingHighlights';
import SpaceCardInfo from '@/components/SpaceCardInfo';
import { cookies } from 'next/headers';
import { normalizeLanguage } from '@/i18n/config';
import { listSpaces } from '@/server/spaces';
export const dynamic = 'force-dynamic';

function RatingStars({ rating }) {
  const value = Number(rating);
  const safeRating = Number.isFinite(value) ? Math.max(0, Math.min(5, value)) : 0;

  return (
    <span
      className="flex items-center gap-1 rounded-2xl bg-[#fff7df] px-3 py-2 text-[#c58a16]"
      aria-label={`Calificación ${safeRating} de 5 estrellas`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const fillPercentage = Math.max(0, Math.min(1, safeRating - index)) * 100;

        return (
          <span key={index} className="relative block h-[14px] w-[14px]">
            <Star size={14} className="absolute inset-0" fill="transparent" />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star size={14} className="block max-w-none" fill="currentColor" />
            </span>
          </span>
        );
      })}
      <span className="ml-1 text-xs font-bold">{safeRating || '—'}</span>
    </span>
  );
}

async function getSpaces() {
  const language = normalizeLanguage((await cookies()).get('nexus-locale')?.value);
  return listSpaces(language);
}
export default async function CoworkingPage() {
  const spaces = await getSpaces();
  return (
    <LibraryShell>
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-semibold text-[#2f6f4e]"
        >
          <ArrowLeft size={16} /> Volver al dashboard
        </Link>
        <CoworkingIntro />
        <CoworkingHighlights />
        {/*
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="nexus-card !border-[#b9d8c5]/60 !bg-[#e8f3eb]/55 shadow-sm backdrop-blur-sm">
            <p className="nexus-label !text-[#2f6f4e]">Concentración</p>
            <p className="mt-2 font-semibold">
              Espacios pensados para trabajar sin interrupciones.
            </p>
          </div>
          <div className="nexus-card !border-[#b9d8c5]/60 !bg-[#e8f3eb]/55 shadow-sm backdrop-blur-sm">
            <p className="nexus-label !text-[#2f6f4e]">Colaboración</p>
            <p className="mt-2 font-semibold">Salas adaptadas para equipos y proyectos.</p>
          </div>
          <div className="nexus-card !border-[#b9d8c5]/60 !bg-[#e8f3eb]/55 shadow-sm backdrop-blur-sm">
            <p className="nexus-label !text-[#2f6f4e]">Flexibilidad</p>
            <p className="mt-2 font-semibold">Reserva por bloques de 15, 30, 45 o 60 minutos.</p>
          </div>
        </div> */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {spaces.map((space) => (
            <article
              key={space.id}
              className="group relative overflow-hidden rounded-3xl border border-white/55 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-white/75 hover:shadow-lg"
            >
              {space.imageUrl && (
                <div
                  className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.30] transition duration-500 group-hover:opacity-[0.38]"
                  style={{ backgroundImage: `url(${space.imageUrl})` }}
                  aria-hidden="true"
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/45 via-white/65 to-white/95" />
              <div className="relative z-10 flex items-start justify-between">
                <RatingStars rating={space.rating} />
                <SpaceStatus space={space} />
              </div>
              <SpaceCardInfo space={space} />
              {space.status === 'occupied' && (
                <p className="relative z-10 mt-2 text-xs text-[#a4511f]">
                  Disponible{' '}
                  {new Date(space.availableAt).toLocaleTimeString('es-CO', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
              <div className="relative z-10 mt-7">
                <ReserveButton
                  spaceId={space.id}
                  detailHref={`/coworking/${space.id}`}
                  disabled={space.status !== 'available'}
                  availableAt={space.availableAt}
                  occupiedFrom={space.occupiedFrom}
                  occupiedByEmail={space.occupiedByEmail}
                  reservationId={space.reservationId}
                  light
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </LibraryShell>
  );
}
