import { notFound } from 'next/navigation';
import { getCloserProfile, getCloserReviews } from '@/lib/db/queries';
import { requireAuth } from '@/lib/auth/clerk';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default async function CloserProfilePage({
  params,
}: {
  params: Promise<{ closerId: string }>;
}) {
  await requireAuth();
  const { closerId } = await params;

  let closer;
  try {
    closer = await getCloserProfile(closerId);
  } catch {
    notFound();
  }

  const reviews = await getCloserReviews(closerId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/catalogue"
            className="text-primary hover:underline mb-4 inline-block"
          >
            ← Retour au catalogue
          </Link>

          <div className="flex items-start gap-6 mt-4">
            {/* Profile Photo */}
            <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-bold flex-shrink-0">
              {closer.photo_url ? (
                <img
                  src={closer.photo_url}
                  alt={closer.user?.name || 'Closer'}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                closer.user?.name?.charAt(0).toUpperCase() || 'C'
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {closer.user?.name}
              </h1>

              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  <span className="text-yellow-500 text-xl">★</span>
                  <span className="text-lg font-semibold ml-1">
                    {closer.average_rating.toFixed(1)}
                  </span>
                  <span className="text-gray-600 ml-1">
                    ({reviews.length} avis)
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {closer.total_missions} mission{closer.total_missions > 1 ? 's' : ''}{' '}
                  complétée{closer.total_missions > 1 ? 's' : ''}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {closer.experience_years} ans d&apos;expérience
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
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
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600">Taux horaire</p>
              <p className="text-3xl font-bold text-primary">
                {closer.hourly_rate
                  ? formatCurrency(closer.hourly_rate)
                  : 'Sur devis'}
              </p>
              <Button className="mt-4 w-full" asChild>
                <Link href={`/messages?userId=${closerId}`}>Contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>À propos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{closer.bio}</p>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Avis clients ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Aucun avis pour le moment
                  </p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={
                                  i < review.rating
                                    ? 'text-yellow-500'
                                    : 'text-gray-300'
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            par {review.reviewer?.name}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700">{review.comment}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(review.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Specialties */}
            <Card>
              <CardHeader>
                <CardTitle>Spécialités</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {closer.sectors.map((sector) => (
                    <Badge key={sector} variant="outline">
                      {sector}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Taux de réussite</p>
                  <p className="text-2xl font-bold text-secondary">
                    {closer.success_rate.toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Missions complétées</p>
                  <p className="text-2xl font-bold">{closer.total_missions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Note moyenne</p>
                  <p className="text-2xl font-bold">{closer.average_rating.toFixed(1)} ★</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {closer.phone && (
                  <p className="text-sm text-gray-600">📞 {closer.phone}</p>
                )}
                <p className="text-sm text-gray-600">
                  ✉️ {closer.user?.email}
                </p>
                <Button className="w-full" asChild>
                  <Link href={`/messages?userId=${closerId}`}>
                    Envoyer un message
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
