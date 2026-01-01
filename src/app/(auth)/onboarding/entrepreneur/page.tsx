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
import { COMPANY_SIZES, SECTORS } from '@/lib/db/types';

const entrepreneurFormSchema = z.object({
  company_name: z.string().min(2, 'Le nom de l\'entreprise est requis'),
  industry: z.string().min(1, 'Sélectionnez un secteur'),
  company_size: z.string().min(1, 'Sélectionnez une taille'),
});

type EntrepreneurFormData = z.infer<typeof entrepreneurFormSchema>;

export default function EntrepreneurOnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EntrepreneurFormData>({
    resolver: zodResolver(entrepreneurFormSchema),
  });

  const onSubmit = async (data: EntrepreneurFormData) => {
    setIsLoading(true);

    try {
      // Create entrepreneur profile via API
      const response = await fetch('/api/onboarding/entrepreneur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      // Redirect to dashboard
      router.push('/dashboard/entrepreneur');
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
            <CardTitle className="text-3xl">Créez votre profil Entrepreneur</CardTitle>
            <CardDescription>
              Complétez votre profil pour accéder au catalogue de closers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Company Name */}
              <div>
                <Label htmlFor="company_name">Nom de l&apos;entreprise *</Label>
                <Input
                  id="company_name"
                  {...register('company_name')}
                  placeholder="Ma Super Startup"
                  className="mt-1"
                />
                {errors.company_name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.company_name.message}
                  </p>
                )}
              </div>

              {/* Industry */}
              <div>
                <Label htmlFor="industry">Secteur d&apos;activité *</Label>
                <select
                  id="industry"
                  {...register('industry')}
                  className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Sélectionnez un secteur</option>
                  {SECTORS.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector.charAt(0).toUpperCase() + sector.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="text-sm text-red-500 mt-1">{errors.industry.message}</p>
                )}
              </div>

              {/* Company Size */}
              <div>
                <Label htmlFor="company_size">Taille de l&apos;entreprise *</Label>
                <select
                  id="company_size"
                  {...register('company_size')}
                  className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Sélectionnez une taille</option>
                  {COMPANY_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size === 'solo' && 'Solo entrepreneur'}
                      {size === '2-10' && '2-10 employés'}
                      {size === '11-50' && '11-50 employés'}
                      {size === '51-200' && '51-200 employés'}
                      {size === '200+' && '200+ employés'}
                    </option>
                  ))}
                </select>
                {errors.company_size && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.company_size.message}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Prochaines étapes
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Accès immédiat au catalogue de 500+ closers</li>
                  <li>✓ Contactez directement les closers</li>
                  <li>✓ Créez et publiez vos missions</li>
                  <li>✓ Paiements sécurisés et contrats électroniques</li>
                </ul>
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
