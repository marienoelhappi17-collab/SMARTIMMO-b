# API Gestion locative : authentification

Express 5, TypeScript, Prisma 7, PostgreSQL, Zod, JWT, bcrypt.

## Installation

```bash
npm install
cp .env.example .env      # puis compléter les valeurs
npx prisma migrate deploy
npm run seed
npm run dev
```

L'API écoute sur http://localhost:3005. `npm install` génère le client Prisma (script `postinstall`).

## Variables d'environnement (`.env.example`)

| Variable | Rôle |
|---|---|
| PORT | Port de l'API (3005) |
| NODE_ENV | development ou production |
| DATABASE_URL | URL PostgreSQL |
| JWT_ACCESS_SECRET | Secret de l'access token |
| JWT_REFRESH_SECRET | Secret du refresh token (différent du précédent) |
| JWT_ACCESS_EXPIRES | Durée de l'access token (15m) |
| JWT_REFRESH_EXPIRES | Durée du refresh token (7d) |

Générer un secret : `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

## Rôles

`BAILLEUR` (inscription publique) et `LOCATAIRE` (créé par un bailleur ou par le seed). Les rôles sont vérifiés côté serveur.

## Comptes du seed (mot de passe : `Password123!`)

| E-mail | Rôle |
|---|---|
| bailleur@test.com | BAILLEUR |
| locataire@test.com | LOCATAIRE |

## Routes

| Méthode | Route | Accès |
|---|---|---|
| POST | /api/auth/register | Public (rôle BAILLEUR uniquement) |
| POST | /api/auth/login | Public |
| POST | /api/auth/refresh-token | Public (refresh token dans le corps) |
| POST | /api/auth/logout | Connecté |
| GET | /api/auth/me | Connecté |
| PATCH | /api/auth/password | Connecté |
| POST | /api/auth/locataires | BAILLEUR |
| GET | /api/test/bailleur | BAILLEUR |
| GET | /api/test/locataire | LOCATAIRE |

Le jeton est envoyé dans `Authorization: Bearer <token>`.

## Codes d'erreur

400 validation (Zod), 401 identifiants ou jeton invalide, 403 rôle insuffisant, 409 e-mail déjà utilisé, 500 erreur interne (sans pile d'appels).

## Tests

Collection Postman : `Gestion locative` (connexion, routes par rôle, 403).
