export type Stance = 'regular' | 'goofy';
export type Edge = 'heelside' | 'toeside';
export type Discipline = 'air' | 'surface' | 'rail' | 'kicker' | 'box';
export type Difficulty = 1 | 2 | 3 | 4 | 5;

/**
 * Body pose for the 3D manikin. Angles are in degrees.
 * Keyframes are interpolated over `t` (0 → 1) across the trick.
 */
export interface Pose {
  t: number;
  /** Rotation of the whole rider around the vertical axis (spins). */
  bodyYaw: number;
  /** Forward/back flip rotation (inverts). */
  bodyPitch: number;
  /** Height above the water, in rider heights (0 = on water). */
  height: number;
  /** Knee bend, 0 = straight, 90 = deep crouch. */
  kneeBend: number;
  /** Upper body lean towards the cable/handle (+) or away (-). */
  lean: number;
  /** Arm angle: 0 = handle at hip, 90 = arms extended forward. */
  armReach: number;
  /** Handle held with one or two hands. */
  hands: 'both' | 'lead' | 'none';
}

export interface TrickStep {
  title: string;
  /** Where the handle / cable should be. */
  handle?: string;
  /** Legs, weight distribution, edge. */
  legs?: string;
  /** Upper body, head, shoulders. */
  body?: string;
  detail: string;
}

export interface Trick {
  id: string;
  name: string;
  aliases?: string[];
  discipline: Discipline;
  difficulty: Difficulty;
  approachEdge: Edge;
  summary: string;
  prerequisites: string[];
  steps: TrickStep[];
  commonMistakes: string[];
  poses: Pose[];
  videoUrl?: string;
}

export type GoalStatus = 'wishlist' | 'learning' | 'landed' | 'mastered';

export interface TrickGoal {
  trickId: string;
  status: GoalStatus;
  attempts: number;
  /** Rider's own notes: what finally made it click. */
  howILandedIt?: string;
  landedAt?: string;
  updatedAt: string;
}

export type ModuleType = 'kicker' | 'slider' | 'box' | 'funbox' | 'rail' | 'pipe' | 'air-trick';

export interface ParkModule {
  id: string;
  name: string;
  type: ModuleType;
  level: 'beginner' | 'intermediate' | 'pro';
  /** Position along the cable, 0 → 1, for the park map. */
  position: number;
}

export interface Spot {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  kind: 'full-cable' | 'two-tower' | 'boat';
  website?: string;
  modules: ParkModule[];
}

export interface Contest {
  id: string;
  title: string;
  mode: 'virtual' | 'live';
  spotId?: string;
  startsAt: string;
  endsAt: string;
  trickIds: string[];
  participants: number;
}

export interface Listing {
  id: string;
  title: string;
  category: 'board' | 'bindings' | 'vest' | 'wetsuit' | 'helmet' | 'other';
  priceEur: number;
  condition: 'new' | 'like-new' | 'used' | 'worn';
  location: string;
  sponsored?: boolean;
}
