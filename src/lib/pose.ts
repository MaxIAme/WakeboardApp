import type { Pose } from '@/types';

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const smooth = (k: number) => k * k * (3 - 2 * k);

/** Interpolate the rider pose at time `t` (0 → 1) from sorted keyframes. */
export function poseAt(poses: Pose[], t: number): Pose {
  if (poses.length === 0) throw new Error('A trick needs at least one pose');
  const clamped = Math.min(1, Math.max(0, t));
  let i = poses.findIndex((p) => p.t >= clamped);
  if (i <= 0) return poses[Math.max(0, i)];
  const a = poses[i - 1];
  const b = poses[i];
  const k = smooth((clamped - a.t) / (b.t - a.t || 1));
  return {
    t: clamped,
    bodyYaw: lerp(a.bodyYaw, b.bodyYaw, k),
    bodyPitch: lerp(a.bodyPitch, b.bodyPitch, k),
    height: lerp(a.height, b.height, k),
    kneeBend: lerp(a.kneeBend, b.kneeBend, k),
    lean: lerp(a.lean, b.lean, k),
    armReach: lerp(a.armReach, b.armReach, k),
    hands: k < 0.5 ? a.hands : b.hands,
  };
}
