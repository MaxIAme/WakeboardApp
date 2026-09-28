import type { Pose, Trick } from '@/types';

const base: Omit<Pose, 't'> = {
  bodyYaw: 0,
  bodyPitch: 0,
  height: 0,
  kneeBend: 30,
  lean: -10,
  armReach: 10,
  hands: 'both',
};
const pose = (t: number, p: Partial<Omit<Pose, 't'>> = {}): Pose => ({ ...base, ...p, t });

/**
 * Starter library. In production this comes from the `tricks` table in Supabase;
 * this seed is used offline and as the migration seed.
 */
export const TRICKS: Trick[] = [
  {
    id: 'ollie',
    name: 'Ollie',
    discipline: 'surface',
    difficulty: 1,
    approachEdge: 'heelside',
    summary: 'Pop off the flat water by loading the tail. The foundation for every air trick.',
    prerequisites: [],
    steps: [
      {
        title: 'Ride flat',
        handle: 'Low at the lead hip, arms relaxed.',
        legs: 'Knees soft, weight centred.',
        body: 'Look forward, shoulders parallel to the board.',
        detail: 'Get a steady, slow speed behind the cable before trying.',
      },
      {
        title: 'Load the tail',
        legs: 'Shift weight to the back foot and bend the back knee.',
        detail: 'Think of compressing a spring under your back foot.',
      },
      {
        title: 'Pop',
        legs: 'Extend the back leg explosively, then lift the front knee.',
        body: 'Stay tall, keep the handle close.',
        detail: 'The nose comes up first, the tail follows.',
      },
      {
        title: 'Land',
        legs: 'Absorb with both knees, land flat on both feet.',
        detail: 'Keep the handle low so the cable does not pull you forward.',
      },
    ],
    commonMistakes: ['Pulling the handle up to jump', 'Landing on the tail only', 'Straight legs on landing'],
    poses: [
      pose(0),
      pose(0.3, { kneeBend: 60, lean: -20 }),
      pose(0.5, { height: 0.35, kneeBend: 45, lean: -5 }),
      pose(0.75, { height: 0.15, kneeBend: 40 }),
      pose(1, { kneeBend: 55 }),
    ],
  },
  {
    id: 'ride-switch',
    name: 'Ride Switch',
    aliases: ['Fakie'],
    discipline: 'surface',
    difficulty: 1,
    approachEdge: 'heelside',
    summary: 'Ride with your other foot forward. Needed for landings of half rotations.',
    prerequisites: [],
    steps: [
      {
        title: 'Handle transfer',
        handle: 'Pass the handle behind your back to the new lead hand.',
        detail: 'Keep the handle low and tight to the body.',
      },
      {
        title: 'Flatten and pivot',
        legs: 'Flatten the board, let it slide, then edge on the new heel.',
        body: 'Turn the head first, the body follows.',
        detail: 'Go slow and keep the handle at the new lead hip.',
      },
    ],
    commonMistakes: ['Edging too hard during the pivot', 'Letting the handle drift away'],
    poses: [pose(0), pose(0.5, { bodyYaw: 90, kneeBend: 25, lean: 0 }), pose(1, { bodyYaw: 180 })],
  },
  {
    id: 'surface-180',
    name: 'Surface 180',
    discipline: 'surface',
    difficulty: 2,
    approachEdge: 'heelside',
    summary: 'Slide the board around 180° on the water surface and ride away switch.',
    prerequisites: ['ride-switch'],
    steps: [
      {
        title: 'Soft edge',
        handle: 'Handle at the lead hip.',
        legs: 'Light heelside edge, knees bent.',
        detail: 'Too much edge makes the board catch.',
      },
      {
        title: 'Release and turn',
        handle: 'Pass the handle behind your back.',
        legs: 'Flatten the board and turn the hips.',
        body: 'Head leads the rotation.',
        detail: 'The board slides like a skid, not a jump.',
      },
      {
        title: 'Ride away switch',
        legs: 'Re-engage the edge once around.',
        detail: 'Grab the handle with both hands as soon as possible.',
      },
    ],
    commonMistakes: ['Catching the toe edge mid-rotation', 'Letting go of the handle'],
    poses: [
      pose(0),
      pose(0.3, { kneeBend: 40 }),
      pose(0.6, { bodyYaw: 120, hands: 'lead', lean: 0 }),
      pose(1, { bodyYaw: 180 }),
    ],
  },
  {
    id: 'backroll',
    name: 'Backroll',
    discipline: 'air',
    difficulty: 4,
    approachEdge: 'heelside',
    summary: 'A progressive heelside invert rolling backwards over your shoulder, powered by the cable.',
    prerequisites: ['ollie', 'surface-180'],
    steps: [
      {
        title: 'Progressive cut',
        handle: 'Handle low at the lead hip, both hands.',
        legs: 'Strong heelside edge, build it progressively.',
        body: 'Lean away from the cable, chest open.',
        detail: 'Keep the line tension constant, no slack.',
      },
      {
        title: 'Hit the wake / kicker',
        legs: 'Stand tall on the edge at the lip, do not pop hard.',
        body: 'Drop the lead shoulder and look over it.',
        detail: 'The roll is driven by the edge and head, not by pulling the handle.',
      },
      {
        title: 'Roll',
        handle: 'Keep the handle close to your lead hip.',
        legs: 'Tuck the knees slightly.',
        body: 'Keep looking over the shoulder to spot the landing.',
        detail: 'The board passes over your head like a cartwheel.',
      },
      {
        title: 'Land',
        legs: 'Extend legs to spot the water, absorb on both feet.',
        detail: 'Land on the heel edge, handle low.',
      },
    ],
    commonMistakes: ['Pulling the handle to the chest', 'Popping instead of standing tall', 'Opening the head too early'],
    poses: [
      pose(0, { lean: -25, kneeBend: 25 }),
      pose(0.25, { lean: -30, kneeBend: 20, height: 0.1 }),
      pose(0.5, { bodyPitch: -180, height: 0.9, kneeBend: 70, lean: -10 }),
      pose(0.8, { bodyPitch: -330, height: 0.35, kneeBend: 45 }),
      pose(1, { bodyPitch: -360, kneeBend: 55 }),
    ],
  },
  {
    id: 'board-slide-50-50',
    name: '50-50 Board Slide',
    discipline: 'box',
    difficulty: 2,
    approachEdge: 'toeside',
    summary: 'Ride straight along a box or slider with the board parallel to the obstacle.',
    prerequisites: ['ollie'],
    steps: [
      {
        title: 'Line up',
        handle: 'Handle at the waist, arms relaxed.',
        legs: 'Flat board, no edge, knees bent.',
        detail: 'Approach straight, centred on the module.',
      },
      {
        title: 'Ollie on / ride on',
        legs: 'Small ollie or roll onto the box.',
        body: 'Eyes on the end of the module.',
        detail: 'Keep weight centred over the board.',
      },
      {
        title: 'Ride off',
        legs: 'Absorb the drop at the end.',
        detail: 'Keep the board flat until you touch the water.',
      },
    ],
    commonMistakes: ['Looking down at your feet', 'Edging on the obstacle'],
    poses: [
      pose(0),
      pose(0.25, { height: 0.25, kneeBend: 45, lean: 0 }),
      pose(0.75, { height: 0.25, kneeBend: 35, lean: 0 }),
      pose(1, { kneeBend: 55 }),
    ],
  },
];

export const trickById = (id: string) => TRICKS.find((t) => t.id === id);
