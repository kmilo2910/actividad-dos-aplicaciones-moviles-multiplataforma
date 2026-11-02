import Link from 'next/link';
import { ArrowLeft, Coffee } from 'lucide-react';
import LibraryShell from '@/components/LibraryShell';
import ReserveButton from '@/components/ReserveButton';
import SpaceStatus from '@/components/SpaceStatus';
import SpaceDetailInfo from '@/components/SpaceDetailInfo';
import { cookies } from 'next/headers';
import { normalizeLanguage } from '@/i18n/config';
import { getSpace as getSpaceFromDatabase } from '@/server/spaces';
export const dynamic = 'force-dynamic';
async function getSpace(id, language) {
  return getSpaceFromDatabase(id, language);
}
export default async function SpaceDetailPage({ params }) {
  const language = normalizeLanguage((await cookies()).get('nexus-locale')?.value);
  const space = await getSpace((await params).id, language);
  if (!space)
    return (
      <LibraryShell>
        <div className="mx-auto max-w-5xl px-6 py-20">Espacio no encontrado.</div>
      </LibraryShell>
    );
  return (
    <LibraryShell>
      <div className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">
        <Link
          href="/coworking"
          className="inline-flex items-center gap-2 text-sm font-semibold leading-none text-[#2f6f4e]"
        >
          <ArrowLeft size={16} /> Volver a coworking
        </Link>
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/45 bg-[#2f6f4e]/90 text-[#f4f1eb] shadow-[0_18px_45px_rgba(47,111,78,0.16)]">
          {space.imageUrl && (
            <div
              className="h-32 bg-cover bg-center opacity-80 md:h-44"
              style={{ backgroundImage: `url(${space.imageUrl})` }}
            />
          )}
          <div className="p-4 md:p-6">
            <Coffee size={32} />
            <div className="mt-3">
              <SpaceStatus space={space} />
            </div>
            <SpaceDetailInfo space={space} />
            <div className="mt-4 rounded-2xl border border-white/15 bg-black/10 p-3 md:p-4">
              <ReserveButton
                spaceId={space.id}
                disabled={space.status !== 'available'}
                availableAt={space.availableAt}
                occupiedFrom={space.occupiedFrom}
                occupiedByEmail={space.occupiedByEmail}
                reservationId={space.reservationId}
              />
            </div>
          </div>
        </div>
      </div>
    </LibraryShell>
  );
}
