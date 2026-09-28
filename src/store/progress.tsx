import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { GoalStatus, TrickGoal } from '@/types';

const KEY = 'wakeboard.goals.v1';

interface ProgressState {
  goals: Record<string, TrickGoal>;
  setStatus: (trickId: string, status: GoalStatus) => void;
  addAttempt: (trickId: string) => void;
  saveNotes: (trickId: string, howILandedIt: string) => void;
  remove: (trickId: string) => void;
}

const ProgressContext = createContext<ProgressState | null>(null);

/** Local-first trick list. Syncs to the `trick_goals` table once auth is wired. */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Record<string, TrickGoal>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => raw && setGoals(JSON.parse(raw)))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(KEY, JSON.stringify(goals));
  }, [goals, loaded]);

  const update = useCallback((trickId: string, patch: (g: TrickGoal) => Partial<TrickGoal>) => {
    setGoals((all) => {
      const current: TrickGoal = all[trickId] ?? {
        trickId,
        status: 'wishlist',
        attempts: 0,
        updatedAt: new Date().toISOString(),
      };
      return { ...all, [trickId]: { ...current, ...patch(current), updatedAt: new Date().toISOString() } };
    });
  }, []);

  const value = useMemo<ProgressState>(
    () => ({
      goals,
      setStatus: (id, status) =>
        update(id, (g) => ({
          status,
          landedAt: status === 'landed' && !g.landedAt ? new Date().toISOString() : g.landedAt,
        })),
      addAttempt: (id) => update(id, (g) => ({ attempts: g.attempts + 1, status: g.status === 'wishlist' ? 'learning' : g.status })),
      saveNotes: (id, howILandedIt) => update(id, () => ({ howILandedIt })),
      remove: (id) =>
        setGoals((all) => {
          const { [id]: _removed, ...rest } = all;
          return rest;
        }),
    }),
    [goals, update],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
