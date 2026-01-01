'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SECTORS } from '@/lib/db/types';

export function CatalogueFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSectors = searchParams.getAll('sectors');
  const currentRating = searchParams.get('minRating');
  const currentAvailability = searchParams.get('availability');
  const currentPremium = searchParams.get('premium');

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null || value === '') {
      params.delete(key);
    } else if (key === 'sectors') {
      // Toggle sector
      const sectors = params.getAll('sectors');
      if (sectors.includes(value)) {
        params.delete('sectors');
        sectors
          .filter((s) => s !== value)
          .forEach((s) => params.append('sectors', s));
      } else {
        params.append('sectors', value);
      }
    } else {
      params.set(key, value);
    }

    router.push(`/catalogue?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/catalogue');
  };

  const hasFilters =
    currentSectors.length > 0 ||
    currentRating ||
    currentAvailability ||
    currentPremium;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filtres</CardTitle>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Réinitialiser
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sectors */}
        <div>
          <Label className="mb-3 block">Secteurs</Label>
          <div className="space-y-2">
            {SECTORS.map((sector) => (
              <label
                key={sector}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={currentSectors.includes(sector)}
                  onChange={() => updateFilters('sectors', sector)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm capitalize">{sector}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <Label className="mb-3 block">Note minimale</Label>
          <div className="space-y-2">
            {[5, 4.5, 4].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={currentRating === rating.toString()}
                  onChange={() => updateFilters('minRating', rating.toString())}
                  className="border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">
                  {rating} ★ et plus
                </span>
              </label>
            ))}
            {currentRating && (
              <button
                onClick={() => updateFilters('minRating', null)}
                className="text-sm text-primary hover:underline pl-2"
              >
                Toutes les notes
              </button>
            )}
          </div>
        </div>

        {/* Availability */}
        <div>
          <Label className="mb-3 block">Disponibilité</Label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
            <input
              type="checkbox"
              checked={currentAvailability === 'available'}
              onChange={(e) =>
                updateFilters('availability', e.target.checked ? 'available' : null)
              }
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm">Disponible maintenant</span>
          </label>
        </div>

        {/* Premium */}
        <div>
          <Label className="mb-3 block">Type de profil</Label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
            <input
              type="checkbox"
              checked={currentPremium === 'true'}
              onChange={(e) =>
                updateFilters('premium', e.target.checked ? 'true' : null)
              }
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm">Top Closers uniquement</span>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
