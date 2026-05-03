# 🌹 Amine Parfumes — Guide de déploiement complet

## Stack technique
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Base de données**: Supabase (PostgreSQL + Storage + Auth)
- **Hébergement**: Vercel
- **Paiement**: Cash on delivery uniquement
- **Langues**: Français (défaut) + Arabe (RTL)

---

## ÉTAPE 1 — Créer le projet Supabase

1. Aller sur [supabase.com](https://supabase.com) → **New Project**
2. Nom du projet : `amine-parfumes`
3. Choisir une région proche (ex: eu-west-1)
4. Copier :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret key` → `SUPABASE_SERVICE_ROLE_KEY`

### Initialiser la base de données
1. Supabase Dashboard → **SQL Editor**
2. Copier-coller le contenu de `supabase/migrations/001_schema.sql`
3. Cliquer **Run**

### Créer le bucket de stockage
Le bucket est créé automatiquement par le SQL. Si erreur :
1. Supabase → **Storage** → **New bucket**
2. Nom: `products`, cocher **Public bucket**

### Créer le compte admin
1. Supabase → **Authentication** → **Users** → **Invite user**
2. Saisir votre email admin et un mot de passe fort
3. Ce compte servira à se connecter sur `/admin/login`

---

## ÉTAPE 2 — Préparer le logo

1. Renommer votre logo : `logo.png`
2. Le placer dans le dossier `public/images/logo.png`

---

## ÉTAPE 3 — Configuration locale

```bash
# Copier le fichier d'environnement
cp .env.local.example .env.local
```

Modifier `.env.local` avec vos vraies valeurs :
```env
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE_PROJET.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=VOTRE_CLE_ANON
SUPABASE_SERVICE_ROLE_KEY=VOTRE_CLE_SERVICE
```

---

## ÉTAPE 4 — Lancer en local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## ÉTAPE 5 — Déployer sur Vercel

### Option A — Via CLI (recommandé)
```bash
npm install -g vercel
vercel login
vercel
# Répondre aux questions (framework: Next.js)
```

### Option B — Via GitHub
1. Pousser le code sur GitHub
2. [vercel.com](https://vercel.com) → **New Project** → importer votre repo
3. Ajouter les variables d'environnement dans Vercel Dashboard

### Variables à ajouter sur Vercel
```
NEXT_PUBLIC_SUPABASE_URL        = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY   = eyJ...
SUPABASE_SERVICE_ROLE_KEY       = eyJ...
```

---

## Structure des pages

### 🛍️ Boutique (public)
| Route | Page |
|-------|------|
| `/` | Accueil avec hero, produits vedettes, nouveautés |
| `/catalogue` | Catalogue avec filtres (genre, catégorie, recherche) |
| `/product/[slug]` | Fiche produit détaillée |
| `/cart` | Panier |
| `/checkout` | Commande (formulaire livraison + COD) |
| `/merci` | Confirmation de commande |

### 🔐 Admin (authentifié)
| Route | Page |
|-------|------|
| `/admin/login` | Page de connexion |
| `/admin` | Dashboard (stats + commandes récentes) |
| `/admin/products` | Gestion des produits (CRUD complet) |
| `/admin/orders` | Gestion des commandes + changement de statut |
| `/admin/settings` | Paramètres boutique (livraison, contact, réseaux) |

---

## Ajouter votre premier produit

1. Aller sur `votre-site.vercel.app/admin/login`
2. Se connecter avec vos identifiants Supabase
3. Admin → **Produits** → **Nouveau produit**
4. Remplir : nom FR + AR, prix, stock, images
5. Activer **Vedette** pour l'afficher sur la homepage
6. Sauvegarder ✓

---

## Catégories disponibles (pré-configurées)

| Catégorie | Slug URL |
|-----------|----------|
| Parfums Homme | `homme` |
| Parfums Femme | `femme` |
| Mixte | `mixte` |
| Sets & Packs | `sets-packs` |
| Nouveautés | `nouveautes` |

---

## Statuts de commandes

```
pending → confirmed → processing → shipped → delivered
                                           ↘ cancelled
                                           ↘ refunded
```

---

## Personnaliser les couleurs

Dans `src/app/globals.css`, modifier :
```css
:root {
  --gold-mid: #c9a227;    /* Or principal */
  --navy-900: #0a0e1a;    /* Fond sombre */
  --cream: #fdf8ee;       /* Texte clair */
}
```

---

## Support

- Problème Supabase → [docs.supabase.com](https://docs.supabase.com)
- Problème Vercel → [vercel.com/docs](https://vercel.com/docs)
- Problème Next.js → [nextjs.org/docs](https://nextjs.org/docs)
