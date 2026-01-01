import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CloserProfile } from '@/lib/db/types';
import { formatCurrency } from '@/lib/utils';

interface CloserCardProps {
  closer: CloserProfile;
}

export function CloserCard({ closer }: CloserCardProps) {
  const { user } = closer;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        {/* Profile Photo */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {closer.photo_url ? (
              <img
                src={closer.photo_url}
                alt={user?.name || 'Closer'}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              user?.name?.charAt(0).toUpperCase() || 'C'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{user?.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-medium ml-1">
                  {closer.average_rating.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">
                {closer.total_missions} mission{closer.total_missions > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {closer.is_premium && (
            <Badge className="bg-accent text-white">Top Closer</Badge>
          )}
          {closer.is_verified && (
            <Badge variant="secondary">Vérifié</Badge>
          )}
          {closer.availability === 'available' && (
            <Badge className="bg-secondary text-white">Disponible</Badge>
          )}
        </div>

        {/* Sectors */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Spécialités</p>
          <div className="flex flex-wrap gap-1">
            {closer.sectors.slice(0, 3).map((sector) => (
              <span
                key={sector}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {sector}
              </span>
            ))}
            {closer.sectors.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                +{closer.sectors.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Bio Preview */}
        {closer.bio && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {closer.bio}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-gray-500">Expérience</p>
            <p className="font-semibold">
              {closer.experience_years} an{closer.experience_years > 1 ? 's' : ''}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Taux horaire</p>
            <p className="font-semibold">
              {closer.hourly_rate ? formatCurrency(closer.hourly_rate) : 'Sur devis'}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button asChild className="flex-1">
          <Link href={`/catalogue/${closer.user_id}`}>Voir profil</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/messages?userId=${closer.user_id}`}>Contact</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
