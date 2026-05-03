# 🚀 Déploiement Vercel — Guide rapide

## ❌ Erreur que vous aviez
```
Environment Variable "NEXT_PUBLIC_SUPABASE_URL" references Secret "supabase_url", which does not exist.
```
**Cause** : Le `vercel.json` pointait vers des secrets Vercel (@secret_name) qui n'existent pas.
**Solution** : Supprimé — les variables sont maintenant à saisir manuellement dans le dashboard Vercel.

---

## ✅ Comment déployer correctement

### Étape 1 — Pousser sur GitHub
```bash
git init
git add .
git commit -m "Amine Parfumes v1"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/amine-parfumes.git
git push -u origin main
```

### Étape 2 — Importer sur Vercel
1. Aller sur [vercel.com/new](https://vercel.com/new)
2. Cliquer **Import Git Repository**
3. Sélectionner votre repo `amine-parfumes`
4. Framework : **Next.js** (détecté automatiquement)

### Étape 3 — Ajouter les variables d'environnement ⚠️ IMPORTANT
Dans Vercel → **Environment Variables**, ajouter ces 3 variables :

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://VOTRE_PROJET.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...votre clé anon...` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...votre clé service role...` |

> Vous trouvez ces valeurs dans : Supabase Dashboard → Settings → API

### Étape 4 — Deploy
Cliquer **Deploy** — c'est tout ! ✅

---

## Où trouver vos clés Supabase

1. [supabase.com](https://supabase.com) → votre projet
2. **Settings** (icône engrenage) → **API**
3. Copier :
   - **Project URL** → c'est `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → c'est `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → c'est `SUPABASE_SERVICE_ROLE_KEY`

