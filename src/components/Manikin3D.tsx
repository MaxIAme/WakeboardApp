import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as THREE from 'three';
import { poseAt } from '@/lib/pose';
import type { Pose } from '@/types';

const DEG = Math.PI / 180;
const THIGH = 0.45;
const SHIN = 0.45;
const TORSO = 0.6;
const SKIN = '#F2C9A0';
const SUIT = '#1E293B';
const BOARD = '#00C2D1';
const UP = new THREE.Vector3(0, 1, 0);

/** A cylinder stretched between two points (a bone). */
function Limb({ from, to, radius = 0.06, color = SUIT }: { from: THREE.Vector3; to: THREE.Vector3; radius?: number; color?: string }) {
  const dir = to.clone().sub(from);
  const length = dir.length();
  const mid = from.clone().add(to).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize());
  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[radius, radius, length, 12]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

/**
 * Rider standing sideways on the board. The board runs along X (direction of travel,
 * the cable pulls towards +X), the chest faces +Z.
 */
function Rider({ pose }: { pose: Pose }) {
  const knee = Math.min(110, Math.max(0, pose.kneeBend)) * DEG;
  // Knee flexion shortens the leg: hip height from the law of cosines on thigh + shin.
  const hipY = Math.sqrt(THIGH ** 2 + SHIN ** 2 + 2 * THIGH * SHIN * Math.cos(knee));
  const kneeForward = Math.sqrt(Math.max(0, THIGH ** 2 - (hipY / 2) ** 2));

  const feet = [-0.25, 0.25];
  const hip = new THREE.Vector3(0, hipY, 0);
  const lean = pose.lean * DEG;
  const shoulder = hip.clone().add(new THREE.Vector3(Math.sin(lean) * TORSO, Math.cos(lean) * TORSO, 0));
  const head = shoulder.clone().add(new THREE.Vector3(Math.sin(lean) * 0.2, Math.cos(lean) * 0.2, 0));

  const reach = pose.armReach / 90;
  const handle = new THREE.Vector3(0.3 + reach * 0.35, hipY + 0.05 + reach * 0.35, 0.18);
  const leadHand = pose.hands === 'none' ? shoulder.clone().add(new THREE.Vector3(0.1, -0.1, 0.55)) : handle;
  const trailHand = pose.hands === 'both' ? handle : shoulder.clone().add(new THREE.Vector3(-0.45, -0.25, 0.1));

  // Rotate around the rider's centre of mass for spins and inverts.
  const pivotY = hipY;
  return (
    <group position={[0, pose.height * 1.8 + pivotY, 0]} rotation={[pose.bodyPitch * DEG, pose.bodyYaw * DEG, 0, 'YXZ']}>
      <group position={[0, -pivotY, 0]}>
        {/* Board */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[1.4, 0.04, 0.42]} />
          <meshStandardMaterial color={BOARD} />
        </mesh>
        {/* Legs */}
        {feet.map((x) => {
          const foot = new THREE.Vector3(x, 0.05, 0);
          const hipJoint = new THREE.Vector3(x * 0.4, hipY, 0);
          const kneeJoint = new THREE.Vector3((x + x * 0.4) / 2, hipY / 2, kneeForward);
          return (
            <group key={x}>
              <Limb from={hipJoint} to={kneeJoint} radius={0.075} />
              <Limb from={kneeJoint} to={foot} radius={0.065} />
            </group>
          );
        })}
        {/* Torso, head, arms */}
        <Limb from={hip} to={shoulder} radius={0.14} color="#F97316" />
        <mesh position={head}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={SKIN} />
        </mesh>
        <Limb from={shoulder} to={leadHand} radius={0.045} color={SKIN} />
        <Limb from={shoulder} to={trailHand} radius={0.045} color={SKIN} />
        {pose.hands !== 'none' && (
          <>
            <mesh position={handle} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
              <meshStandardMaterial color="#111827" />
            </mesh>
            <Limb from={handle} to={handle.clone().add(new THREE.Vector3(6, 4, 0))} radius={0.008} color="#E5E7EB" />
          </>
        )}
      </group>
    </group>
  );
}

function Scene({ poses, playing, scrub, durationSec, onTime }: Manikin3DProps & { onTime?: (t: number) => void }) {
  const time = useRef(0);
  const [pose, setPose] = useState(() => poseAt(poses, 0));
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    camera.position.set(2.8, 1.8, 3.8);
    camera.lookAt(0, 1.1, 0);
  }, [camera]);

  useFrame((_, delta) => {
    if (scrub != null) time.current = scrub;
    else if (playing) time.current = (time.current + delta / (durationSec ?? 3)) % 1;
    else return;
    setPose(poseAt(poses, time.current));
    onTime?.(time.current);
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 8, 5]} intensity={1.2} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0E7490" />
      </mesh>
      <Rider pose={pose} />
    </>
  );
}

export interface Manikin3DProps {
  poses: Pose[];
  playing: boolean;
  /** When set (0 → 1), freezes the animation at that point of the trick. */
  scrub?: number | null;
  durationSec?: number;
  onTime?: (t: number) => void;
}

export default function Manikin3D(props: Manikin3DProps) {
  return (
    <View style={styles.container}>
      <Canvas>
        <Scene {...props} />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 320, borderRadius: 16, overflow: 'hidden', backgroundColor: '#0B1B2B' },
});
