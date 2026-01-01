export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            Syncro Relation
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            La plateforme qui connecte les meilleurs closers et setters avec les entrepreneurs ambitieux
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
              Trouver un closer
            </button>
            <button className="bg-white text-primary border-2 border-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              Devenir closer
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-4xl font-bold text-primary">500+</div>
            <div className="text-gray-600 mt-2">Closers vérifiés</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-4xl font-bold text-secondary">1000+</div>
            <div className="text-gray-600 mt-2">Missions complétées</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-4xl font-bold text-accent">10M€+</div>
            <div className="text-gray-600 mt-2">CA généré</div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Créez votre profil</h3>
              <p className="text-gray-600 text-sm">Entrepreneur ou closer, inscrivez-vous en quelques minutes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Trouvez le match parfait</h3>
              <p className="text-gray-600 text-sm">Parcourez les profils et filtrez par expertise</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Signez et payez</h3>
              <p className="text-gray-600 text-sm">Contrat électronique sécurisé et paiement en escrow</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Développez votre CA</h3>
              <p className="text-gray-600 text-sm">Collaboration réussie et paiement sécurisé</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
