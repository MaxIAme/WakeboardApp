import type { Contest, Listing, Spot } from '@/types';

/** Offline sample data until Supabase is configured. */
export const SPOTS: Spot[] = [
  {
    id: 'camsur',
    name: 'CamSur Watersports Complex',
    country: 'Philippines',
    latitude: 13.6268,
    longitude: 123.2034,
    kind: 'full-cable',
    modules: [
      { id: 'c1', name: 'Kicker 1', type: 'kicker', level: 'intermediate', position: 0.15 },
      { id: 'c2', name: 'Flat rail', type: 'rail', level: 'intermediate', position: 0.4 },
      { id: 'c3', name: 'Pro kicker', type: 'kicker', level: 'pro', position: 0.7 },
    ],
  },
  {
    id: 'wake-park-example',
    name: 'Lakeside Wake Park',
    country: 'France',
    latitude: 48.8566,
    longitude: 2.3522,
    kind: 'two-tower',
    modules: [
      { id: 'l1', name: 'Beginner box', type: 'box', level: 'beginner', position: 0.3 },
      { id: 'l2', name: 'Funbox', type: 'funbox', level: 'intermediate', position: 0.6 },
    ],
  },
];

export const CONTESTS: Contest[] = [
  {
    id: 'virt-backroll',
    title: 'Backroll Battle (video)',
    mode: 'virtual',
    startsAt: '2026-10-01T00:00:00Z',
    endsAt: '2026-10-31T23:59:59Z',
    trickIds: ['backroll'],
    participants: 42,
  },
  {
    id: 'live-lakeside',
    title: 'Lakeside Autumn Jam',
    mode: 'live',
    spotId: 'wake-park-example',
    startsAt: '2026-10-18T09:00:00Z',
    endsAt: '2026-10-18T18:00:00Z',
    trickIds: ['ollie', 'board-slide-50-50', 'surface-180'],
    participants: 17,
  },
];

export const LISTINGS: Listing[] = [
  { id: 'ad1', title: 'New 2027 cable boards – 15% off', category: 'board', priceEur: 499, condition: 'new', location: 'Online shop', sponsored: true },
  { id: 'l1', title: '142 cm cable board, flex 6/10', category: 'board', priceEur: 220, condition: 'used', location: 'Lyon' },
  { id: 'l2', title: 'Bindings size 42-44', category: 'bindings', priceEur: 90, condition: 'like-new', location: 'Paris' },
  { id: 'l3', title: 'Impact vest M', category: 'vest', priceEur: 45, condition: 'used', location: 'Bordeaux' },
];
