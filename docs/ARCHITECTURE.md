# Architecture

```
┌─────────────── Mobile app (Expo SDK 57 / React Native, TypeScript) ───────────────┐
│ expo-router tabs: Tricks · My List · Spots · Contests · Market                     │
│ 3D manikin: three.js via @react-three/fiber/native + expo-gl                       │
│ Map: react-native-maps · Video: expo-video · Local store: AsyncStorage             │
└───────────────────────────────┬────────────────────────────────────────────────────┘
                                │ supabase-js (auth, REST, realtime, storage)
┌───────────────────────────────▼────────────────────────────────────────────────────┐
│ Supabase: Postgres + PostGIS · Auth · Storage (videos, photos) · Realtime (live    │
│ contest scores) · Edge Functions (challenge expiry, moderation, ad serving)        │
└────────────────────────────────────────────────────────────────────────────────────┘
```

## Folders
| Path | Purpose |
|---|---|
| `app/` | Screens (file-based routing, expo-router) |
| `src/components/Manikin3D.tsx` | 3D rider, animated from `Pose` keyframes |
| `src/lib/pose.ts` | Keyframe interpolation |
| `src/store/progress.tsx` | Local-first trick list (AsyncStorage) |
| `src/lib/supabase.ts` | Supabase client (`null` until `.env` is set) |
| `src/data/` | Offline seed data (tricks, spots, contests, listings) |
| `supabase/migrations/` | Database schema + Row Level Security |

## Key decisions
- **One codebase for Android + iOS** with Expo; native builds via EAS Build, OTA updates via EAS Update.
- **3D manikin from keyframes, not motion-capture files**: each trick stores ~5 poses in JSON (`tricks.poses`), so new tricks are data, not code. A rigged glTF model can later replace the primitive body while keeping the same `Pose` format.
- **Local-first progression**: the trick list works offline and syncs to `trick_goals` when signed in.
- **PostGIS** for the world spots map (`spots_near()` function).
- **Videos** in Supabase Storage (or Mux/Cloudflare Stream once volume grows).
