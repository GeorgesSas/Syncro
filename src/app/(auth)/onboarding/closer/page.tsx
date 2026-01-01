'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SECTORS } from '@/lib/db/types';

const closerFormSchema = z.object({
  bio: z.string().min(50, 'La bio doit faire au moins 50 caractères'),
  experience_years: z.number().min(0).max(50),
  hourly_rate: z.number().min(50).max(1000),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  sectors: z.array(z.string()).min(1, 'Sélectionnez au moins un secteur'),
});

type CloserFormData = z.infer<typeof closerFormSchema>;

export default function CloserOnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CloserFormData>({
    resolver: zodResolver(closerFormSchema),
    defaultValues: {
      sectors: [],
    },
  });

  const toggleSector = (sector: string) => {
    const newSectors = selectedSectors.includes(sector)
      ? selectedSectors.filter((s) => s !== sector)
      : [...selectedSectors, sector];

    setSelectedSectors(newSectors);
    setValue('sectors', newSectors);
  };

  const onSubmit = async (data: CloserFormData) => {
    setIsLoading(true);

    try {
      // Create closer profile via API
      const response = await fetch('/api/onboarding/closer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      // Redirect to dashboard
      router.push('/dashboard/closer');
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Créez votre profil Closer</CardTitle>
            <CardDescription>
              Complétez votre profil pour commencer à recevoir des missions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Bio */}
              <div>
                <Label htmlFor="bio">Bio professionnelle *</Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  placeholder="Présentez votre expertise, votre expérience et ce qui vous différencie..."
                  className="mt-1 min-h-[120px]"
                />
                {errors.bio && (
                  <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>
                )}
              </div>

              {/* Experience Years */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience_years">Années d&apos;expérience *</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    {...register('experience_years', { valueAsNumber: true })}
                    placeholder="5"
                    className="mt-1"
                  />
                  {errors.experience_years && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.experience_years.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="hourly_rate">Taux horaire (€) *</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    {...register('hourly_rate', { valueAsNumber: true })}
                    placeholder="150"
                    className="mt-1"
                  />
                  {errors.hourly_rate && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.hourly_rate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="+33 6 12 34 56 78"
                  className="mt-1"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Sectors */}
              <div>
                <Label>Secteurs d&apos;expertise * (sélectionnez au moins 1)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {SECTORS.map((sector) => (
                    <button
                      key={sector}
                      type="button"
                      onClick={() => toggleSector(sector)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedSectors.includes(sector)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
                {errors.sectors && (
                  <p className="text-sm text-red-500 mt-1">{errors.sectors.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Création en cours...' : 'Créer mon profil'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
