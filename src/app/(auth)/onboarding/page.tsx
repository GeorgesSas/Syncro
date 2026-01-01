'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedType, setSelectedType] = useState<'closer' | 'entrepreneur' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectType = async (type: 'closer' | 'entrepreneur') => {
    setSelectedType(type);
    setIsLoading(true);

    try {
      // Update Clerk user metadata
      await user?.update({
        publicMetadata: {
          user_type: type,
        },
      });

      // Redirect to specific onboarding flow
      router.push(`/onboarding/${type}`);
    } catch (error) {
      console.error('Error updating user type:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenue sur Syncro Relation
          </h1>
          <p className="text-xl text-gray-600">
            Commençons par choisir votre profil
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Closer Card */}
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedType === 'closer' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => !isLoading && handleSelectType('closer')}
          >
            <CardHeader>
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl">Je suis Closer/Setter</CardTitle>
              <CardDescription className="text-base">
                Je veux proposer mes services de closing et trouver des missions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-secondary mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Accès aux missions high-ticket
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-secondary mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Paiements sécurisés et rapides
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-secondary mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Portfolio et avis clients
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-secondary mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Badge Premium (49€/mois)
                </li>
              </ul>
              <Button
                className="w-full mt-6"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectType('closer');
                }}
              >
                {isLoading && selectedType === 'closer'
                  ? 'Chargement...'
                  : 'Devenir Closer'}
              </Button>
            </CardContent>
          </Card>

          {/* Entrepreneur Card */}
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedType === 'entrepreneur' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => !isLoading && handleSelectType('entrepreneur')}
          >
            <CardHeader>
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl">Je suis Entrepreneur</CardTitle>
              <CardDescription className="text-base">
                Je cherche des closers pour développer mon chiffre d&apos;affaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-secondary mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Accès à 500+ closers vérifiés
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-secondary mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Contrats et paiements sécurisés
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-secondary mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Filtres par secteur et expertise
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-secondary mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Support Premium (99€/mois)
                </li>
              </ul>
              <Button
                className="w-full mt-6"
                variant="secondary"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectType('entrepreneur');
                }}
              >
                {isLoading && selectedType === 'entrepreneur'
                  ? 'Chargement...'
                  : 'Trouver un Closer'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
