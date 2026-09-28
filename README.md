# WakeBoard 🏄

Android + iPhone app for wakeboarders:

- **Tricks** – library with step-by-step guides (handle/cable, legs, body) and an animated **3D manikin**, plus videos.
- **My List** – tricks you want to land, attempts, and notes on *how you managed to do it*.
- **Spots** – world map of wakeboard parks, with a plan of every park's modules.
- **Contests** – challenge other riders, join virtual (video) and live contests.
- **Market** – sell your second-hand gear, with sponsored slots for wakeboard brands.

Built with Expo (React Native, TypeScript) and Supabase. See [`docs/`](docs) for the [product spec](docs/PRODUCT.md), [architecture](docs/ARCHITECTURE.md) and [roadmap](docs/ROADMAP.md).

## Run it

```bash
cd WakeboardApp
npm install
npx expo start          # scan the QR code with the Expo Go app (Android / iOS)
```

The 3D view and maps need a real device or emulator. The app runs on offline sample data until you add a backend.

## Connect Supabase (optional)

1. Create a project on [supabase.com](https://supabase.com).
2. Run `supabase/migrations/0001_init.sql` in the SQL editor (or `supabase db push`).
3. `cp .env.example .env` and fill in the URL and anon key.

## Checks

```bash
npm run typecheck
npx expo export --platform android --platform ios   # full bundle build
```
