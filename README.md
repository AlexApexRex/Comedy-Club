# LOHS Comedy Analysis Hub

A Firebase-first, production-friendly web app for sharing and analyzing comedy clips.

## Stack

- React + Vite
- Tailwind CSS
- Firebase (Auth, Firestore, Functions)
- Mock data fallback for local/no-config mode

## Features implemented

- Public clip feed from `/submissions` (approved only)
- Site config loading from `/metadata/siteConfig`
- Google sign-in hook (`useAuth`)
- Landing/onboarding flow with sign up, log in, and continue-as-guest paths
- In-app clip submission form (`approved=false` by default)
- YouTube privacy embed support (`youtube-nocookie.com`) with lazy play
- Search + tag filter
- Cookie consent banner (essential/full choices)
- Guidelines acknowledgment gate after sign-up/login
- Scroll-reactive immersive gradient background (respects reduced motion)
- Hall-of-Fame vote button calling callable function `castVote`
- Admin route scaffold (`/admin`)
- Cloud Function `castVote` with one-vote-per-user-per-poll enforcement
- Cloud Function `exportSubmissions` for backup export
- Firestore rules starter (`firestore.rules`)
- Basic smoke test (Vitest)

## Project structure

- `src/firebase.js` Firebase modular setup
- `src/context/AuthContext.jsx` Auth provider and Google sign-in
- `src/lib/firestore.js` Firestore read/write helpers + callable vote helper
- `src/data/mockData.js` mock mode fallback data
- `functions/index.js` callable backend functions
- `firestore.rules` starter security rules

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` from these keys:
   ```bash
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   ```

3. Run dev server:
   ```bash
   npm run dev
   ```

If Firebase env vars are missing, app runs in mock mode.

## Functions setup

```bash
cd functions
npm install
```

Deploy with Firebase CLI:

```bash
firebase deploy --only functions
```

## Firestore rules deploy

```bash
firebase deploy --only firestore:rules
```

## Admin users

Current rule checks `users/{uid}.role == 'admin'`.

Set manually once:

```js
// Run from trusted admin script / console
await setDoc(doc(db, 'users', uid), { role: 'admin', email: 'you@example.com' }, { merge: true })
```

## Emulator recommendation

Use Firebase Emulator Suite for safe rule/function testing:

```bash
firebase emulators:start
```

## Deploy checklist

- [ ] Set production Firebase env vars
- [ ] Deploy Firestore rules
- [ ] Deploy functions
- [ ] Verify OAuth sign-in domain whitelist
- [ ] Verify callable `castVote` blocks duplicate votes
- [ ] Verify admin export works
- [ ] Set `/metadata/siteConfig` document

## Default `siteConfig`

`/metadata/siteConfig` example:

```json
{
  "nextMeetingISO": "2026-11-04T23:00:00.000Z",
  "featuredSubmissionId": "abc123",
  "hallOfFameOpen": true
}
```

## Changelog

### 0.1.0

- Migrated from single static page to React+Vite app scaffold.
- Added Firebase modular integration and mock fallback mode.
- Added callable voting and export function scaffolds.
- Added security rules starter and initial smoke test.
