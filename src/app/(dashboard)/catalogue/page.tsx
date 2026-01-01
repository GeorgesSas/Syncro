import { Suspense } from 'react';
import { getAllClosers } from '@/lib/db/queries';
import { CloserCard } from '@/components/catalogue/CloserCard';
import { CatalogueFilters } from '@/components/catalogue/CatalogueFilters';
import { requireAuth } from '@/lib/auth/clerk';
import { redirect } from 'next/navigation';

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Require authentication
  const user = await requireAuth();

  // Only entrepreneurs can access catalogue
  if (user.user_type !== 'entrepreneur') {
    redirect('/dashboard/' + user.user_type);
  }

  const params = await searchParams;

  // Parse filters from search params
  const filters = {
    sectors: params.sectors
      ? Array.isArray(params.sectors)
        ? params.sectors
        : [params.sectors]
      : undefined,
    minRating: params.minRating ? parseFloat(params.minRating as string) : undefined,
    availability: params.availability as string | undefined,
    isPremium: params.premium === 'true' ? true : undefined,
  };

  // Fetch closers with filters
  const closers = await getAllClosers(filters);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Catalogue des Closers
          </h1>
          <p className="text-gray-600 mt-2">
            {closers.length} closer{closers.length > 1 ? 's' : ''} disponible
            {closers.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<div>Chargement...</div>}>
              <CatalogueFilters />
            </Suspense>
          </div>

          {/* Closers Grid */}
          <div className="lg:col-span-3">
            {closers.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-500">
                  Aucun closer ne correspond à vos critères
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {closers.map((closer) => (
                  <CloserCard key={closer.id} closer={closer} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
