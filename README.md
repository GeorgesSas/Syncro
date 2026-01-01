# Syncro Relation - Plateforme Marketplace Closer/Setter

Plateforme B2B mettant en relation des closers/setters (experts en vente high-ticket) avec des entrepreneurs, freelancers et entreprises.

## 🚀 Stack Technique

- **Frontend**: React + TypeScript + Tailwind CSS
- **Framework**: Next.js 14+ (App Router)
- **Base de données**: PostgreSQL (Supabase)
- **Authentification**: Clerk
- **Paiements**: Stripe Connect (escrow)
- **Contrats**: HelloSign API
- **Emails**: Resend

## 📦 Installation

1. Cloner le repository
```bash
git clone <repository-url>
cd Syncro
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env.local
# Puis remplir les variables d'environnement
```

4. Lancer le serveur de développement
```bash
npm run dev
```

5. Ouvrir [http://localhost:3000](http://localhost:3000)

## 🏗️ Structure du Projet

```
/src
  /app
    /(auth)          # Pages d'authentification
    /(dashboard)     # Dashboards (closer/entrepreneur)
    /(public)        # Pages publiques
  /components
    /ui              # Composants UI réutilisables
    /dashboard       # Composants dashboard
    /catalogue       # Composants catalogue
    /missions        # Composants missions
  /lib
    /api            # API clients
    /db             # Database helpers
    /stripe         # Stripe integration
    /contracts      # Contrats électroniques
    /utils          # Utilitaires
```

## 🎯 Fonctionnalités Principales

### Phase 1 - MVP
- [x] Configuration Next.js + TypeScript + Tailwind
- [ ] Authentification & Onboarding
- [ ] Dashboard Closer
- [ ] Dashboard Entrepreneur
- [ ] Catalogue Closers avec filtres
- [ ] Système de messagerie

### Phase 2 - Paiements
- [ ] Intégration Stripe Connect
- [ ] Système escrow
- [ ] Gestion commissions

### Phase 3 - Contrats
- [ ] Intégration HelloSign
- [ ] Génération contrats
- [ ] Signatures électroniques

### Phase 4 - Polish
- [ ] Système d'avis
- [ ] Abonnements Premium
- [ ] Notifications
- [ ] Analytics

## 🔑 Variables d'Environnement

Voir `.env.example` pour la liste complète des variables requises.

## 📝 Licence

Propriétaire - Tous droits réservés
