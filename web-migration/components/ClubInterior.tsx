"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Billboard, Text } from "@react-three/drei";
import * as THREE from "three";
import { useHudStore } from "@/lib/hudStore";
import { CLUB_IN } from "@/lib/club";
import { PersonFigure } from "@/components/PersonFigure";
import { FLOOR_TEX, POSTERS } from "@/lib/clubTextures";

const W = 44;
const D = 30;
const H = 7;

const CROWD_COLORS = ["#ff2f8a", "#2fe9ff", "#ffd12f", "#b06bff", "#2fff8a", "#ff8a2f", "#8affd1"];

// Upgraded from the old bobbing capsule blobs to real PersonFigure rigs (see
// DancingFigure below) — same articulated legL/legR/armL/armR rig
// Pedestrians.tsx uses, just danced instead of walked. Kept off the stage
// footprint (z < -8) and clear of the bar (x > 15) / booths (x < -15).
const CROWD = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  const r = i < 6 ? 3 + (i % 2) * 1.5 : 7 + (i % 3);
  return {
    x: Math.cos(a) * r,
    z: 3 + Math.sin(a) * r,
    color: CROWD_COLORS[i % CROWD_COLORS.length],
    seed: i * 1.7,
  };
});

const SPOT_COLORS = [0xff3fd6, 0x2fe9ff, 0xb06bff];

// Self-contained dancer: owns its own limb refs and per-frame animation, so
// dropping N of these into the scene doesn't mean plumbing N*4 refs through
// the parent's useFrame the way the old crowdRefs array did. `energetic`
// widens the swing for stage/pole performers vs. the background crowd;
// `spin` adds continuous yaw (the pole dancer).
function DancingFigure({
  position,
  jacketColor,
  pantsColor,
  seed,
  energetic = false,
  spin = false,
}: {
  position: [number, number, number];
  jacketColor: string;
  pantsColor?: string;
  seed: number;
  energetic?: boolean;
  spin?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Mesh>(null);
  const legR = useRef<THREE.Mesh>(null);
  const armL = useRef<THREE.Mesh>(null);
  const armR = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * (energetic ? 3.2 : 2.4) + seed;
    const amp = energetic ? 1.15 : 0.55;
    if (armL.current) armL.current.rotation.x = Math.sin(t) * amp - amp * 0.3;
    if (armR.current) armR.current.rotation.x = Math.sin(t + Math.PI) * amp - amp * 0.3;
    if (legL.current) legL.current.rotation.x = Math.sin(t + Math.PI) * amp * 0.35;
    if (legR.current) legR.current.rotation.x = Math.sin(t) * amp * 0.35;
    const g = groupRef.current;
    if (!g) return;
    g.position.y = position[1] + Math.abs(Math.sin(t)) * (energetic ? 0.14 : 0.07);
    g.rotation.y = spin ? state.clock.elapsedTime * 1.6 + seed : position[0] * 0 + Math.sin(t * 0.35) * 0.5;
  });

  return (
    <group ref={groupRef} position={position}>
      <PersonFigure legL={legL} legR={legR} armL={armL} armR={armR} jacketColor={jacketColor} pantsColor={pantsColor} />
    </group>
  );
}

// Chrome floor-to-ceiling pole + one DancingFigure spinning around it —
// the ask specifically called out "pole dancers" alongside the stage
// performers below, kept as its own small rig since the pole itself needs
// geometry the plain DancingFigure doesn't have.
function PoleDancer({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, H / 2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, H, 10]} />
        <meshStandardMaterial color="#dfe4ea" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.05, 16]} />
        <meshStandardMaterial color="#12aa44" emissive="#12aa44" emissiveIntensity={0.4} />
      </mesh>
      <DancingFigure position={[0, 0, 0]} jacketColor="#ff3fd6" pantsColor="#ff3fd6" seed={4.2} energetic spin />
    </group>
  );
}

// Back-bar bottle shelf — a row of small coloured cylinders, the "bottle
// shelf" set dressing the original file comment said was cut for scope.
function BottleShelf({ x, z0, z1 }: { x: number; z0: number; z1: number }) {
  const colors = ["#2fe9ff", "#ff3fd6", "#ffd12f", "#2fff8a", "#b06bff"];
  const n = 10;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const z = z0 + ((z1 - z0) * i) / (n - 1);
        return (
          <mesh key={i} position={[x, 1.6, z]}>
            <cylinderGeometry args={[0.06, 0.08, 0.35, 8]} />
            <meshStandardMaterial color={colors[i % colors.length]} emissive={colors[i % colors.length]} emissiveIntensity={0.35} />
          </mesh>
        );
      })}
    </>
  );
}

// Bar counter + back shelf + two bartenders — the "bar/bottle-shelf...set
// dressing" the file's own comment documented as cut for scope, now added.
function Bar({ x, z0, z1 }: { x: number; z0: number; z1: number }) {
  const midZ = (z0 + z1) / 2;
  return (
    <group>
      <mesh position={[x, 0.55, midZ]} castShadow>
        <boxGeometry args={[1.4, 1.1, z1 - z0]} />
        <meshStandardMaterial color="#241a30" roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[x, 1.13, midZ]}>
        <boxGeometry args={[1.5, 0.06, z1 - z0 + 0.2]} />
        <meshBasicMaterial color="#2fe9ff" />
      </mesh>
      <BottleShelf x={x + 1.1} z0={z0 + 1} z1={z1 - 1} />
      <DancingFigure position={[x + 0.9, 0, midZ - 2]} jacketColor="#12141a" pantsColor="#0b0d12" seed={1.1} />
      <DancingFigure position={[x + 0.9, 0, midZ + 2]} jacketColor="#12141a" pantsColor="#0b0d12" seed={2.6} />
    </group>
  );
}

// VIP booth: bench + backrest + a low table — the "clubs"/lounge seating
// along the wall opposite the bar (also cut-for-scope set dressing).
function Booth({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[1.3, 0.56, 2.6]} />
        <meshStandardMaterial color="#3a1030" roughness={0.6} />
      </mesh>
      <mesh position={[-0.55, 0.75, 0]} castShadow>
        <boxGeometry args={[0.2, 1.0, 2.6]} />
        <meshStandardMaterial color="#3a1030" roughness={0.6} />
      </mesh>
      <mesh position={[0.9, 0.35, 0]}>
        <boxGeometry args={[0.6, 0.06, 1.2]} />
        <meshStandardMaterial color="#12081c" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0.9, 0.05, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#12081c" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Poster({ x, z, ry, map }: { x: number; z: number; ry: number; map: THREE.Texture }) {
  return (
    <mesh position={[x, 3.4, z]} rotation={[0, ry, 0]}>
      <planeGeometry args={[1.6, 2.4]} />
      <meshStandardMaterial map={map} emissive="#ffffff" emissiveMap={map} emissiveIntensity={0.3} roughness={0.7} />
    </mesh>
  );
}

// Floating "emoticon" — a music note that fades in/out above a dancer, drei
// Text billboard rather than an image asset.
function EmojiFloat({ x, z, seed, glyph, color }: { x: number; z: number; seed: number; glyph: string; color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = (state.clock.elapsedTime * 0.5 + seed) % (Math.PI * 2);
    const g = ref.current;
    if (!g) return;
    g.position.y = 1.9 + Math.sin(t) * 0.3 + t * 0.15;
    g.visible = Math.sin(t) > -0.3;
  });
  return (
    <group ref={ref} position={[x, 1.9, z]}>
      <Billboard>
        <Text fontSize={0.35} color={color} outlineWidth={0.02} outlineColor="#0a0612">
          {glyph}
        </Text>
      </Billboard>
    </group>
  );
}

// VENU interior — a real place in the world at CLUB_IN, not an overlay scene
// (see lib/club.ts). Rendered only while inClub so it costs nothing outside
// the club. Full set dressing: floor/walls/stage/DJ booth/disco
// ball/spotlights (with visible beam cones)/lasers/dancing crowd/stage
// dancers/pole dancer/bar+bartenders/VIP booths/wall posters/floating
// emoji — the bar/bottle-shelf/VIP-couch/pole-dancer set the original file
// comment documented as cut for scope is now in.
export function ClubInterior() {
  const inClub = useHudStore((s) => s.inClub);
  const discoRef = useRef<THREE.Mesh>(null);
  const floorMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const spotRefs = useRef<(THREE.PointLight | null)[]>([]);
  const beamRefs = useRef<(THREE.Mesh | null)[]>([]);
  const laserRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, dt) => {
    if (!inClub) return;
    const time = state.clock.elapsedTime;
    const bps = 130 / 60;
    const beat = Math.pow(Math.max(0, Math.sin(time * Math.PI * 2 * bps)), 8);

    if (discoRef.current) discoRef.current.rotation.y += dt * 2.4;
    if (floorMatRef.current) {
      floorMatRef.current.emissiveIntensity = 0.6 + 0.5 * Math.sin(time * 7) + beat * 1.5;
      floorMatRef.current.emissive.setHSL((time * 0.1) % 1, 0.85, 0.5);
    }

    spotRefs.current.forEach((L, i) => {
      if (!L) return;
      const a = time * 2 + i * 2.09;
      const x = Math.cos(a) * 11;
      const z = 1 + Math.sin(a * 1.3) * 6.5;
      L.position.set(x, 4.8, z);
      L.intensity = 1.8 + Math.sin(time * 9 + i) * 0.8 + beat * 1.2;
      L.color.setHSL((time * 0.15 + i * 0.34) % 1, 0.9, 0.55);
      // visible beam column tracking the same moving spot, ceiling to floor —
      // this is what makes the sweep actually readable as light instead of
      // just an invisible point-light's illumination on other objects
      const beam = beamRefs.current[i];
      if (beam) {
        beam.position.set(x, H / 2, z);
        (beam.material as THREE.MeshBasicMaterial).color.copy(L.color);
        (beam.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.max(0, Math.sin(time * 9 + i)) * 0.1 + beat * 0.08;
      }
    });
    laserRefs.current.forEach((b, i) => {
      if (!b) return;
      b.rotation.z = Math.sin(time * 2.3 + i * 1.3) * 1.2;
      b.rotation.x = Math.cos(time * 1.8 + i) * 0.75;
      (b.material as THREE.MeshBasicMaterial).opacity = 0.14 + 0.16 * Math.sin(time * 12 + i * 2) + beat * 0.18;
    });
  });

  if (!inClub) return null;

  const IN = CLUB_IN;
  const wallMat = <meshStandardMaterial color="#181022" roughness={0.8} />;

  return (
    <group position={[IN.x, 0, IN.z]}>
      {/* floor + walls + ceiling, walls solid so driving can't clip through */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#0e0c14" roughness={0.25} metalness={0.5} />
      </mesh>
      <mesh position={[0, H + 0.25, 0]}>
        <boxGeometry args={[W, 0.5, D]} />
        {wallMat}
      </mesh>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[W / 2, H / 2, 0.5]} position={[0, H / 2, -D / 2]} />
        <CuboidCollider args={[W / 2, H / 2, 0.5]} position={[0, H / 2, D / 2]} />
        <CuboidCollider args={[0.5, H / 2, D / 2]} position={[-W / 2, H / 2, 0]} />
        <CuboidCollider args={[0.5, H / 2, D / 2]} position={[W / 2, H / 2, 0]} />
        {/* floor — CLUB_IN (lib/club.ts) is a far-off pocket coordinate with no
            city ground under it, and the floor mesh above is visual-only, so
            without this the player fell straight through on entry */}
        <CuboidCollider args={[W / 2, 0.5, D / 2]} position={[0, -0.47, 0]} />
      </RigidBody>
      {[
        [W, H, 1, 0, H / 2, -D / 2],
        [W, H, 1, 0, H / 2, D / 2],
        [1, H, D, -W / 2, H / 2, 0],
        [1, H, D, W / 2, H / 2, 0],
      ].map((p, i) => (
        <mesh key={i} position={[p[3], p[4], p[5]]} castShadow receiveShadow>
          <boxGeometry args={[p[0], p[1], p[2]]} />
          {wallMat}
        </mesh>
      ))}

      {/* colourful checker dance floor — texture gives it real pattern, the
          emissive hue+intensity animation on top (in useFrame) is what makes
          it cycle colour with the beat instead of just pulsing white */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 1]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial
          ref={floorMatRef}
          map={FLOOR_TEX}
          color="#ffffff"
          emissive={new THREE.Color("#ffffff")}
          emissiveIntensity={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* stage + DJ booth */}
      <mesh position={[0, 0.45, -D / 2 + 3]} castShadow>
        <boxGeometry args={[13, 0.9, 5]} />
        <meshStandardMaterial color="#241a30" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.92, -D / 2 + 3]}>
        <boxGeometry args={[13.2, 0.1, 5.2]} />
        <meshBasicMaterial color="#ff3fd6" />
      </mesh>
      <mesh position={[-9, 0.65, -D / 2 + 4]} castShadow>
        <boxGeometry args={[3, 1.3, 1.6]} />
        <meshStandardMaterial color="#101018" roughness={0.4} emissive="#2fe9ff" emissiveIntensity={0.15} />
      </mesh>

      {/* stage dancers, on the stage platform (top surface at y=0.9) */}
      <DancingFigure position={[3, 0.9, -D / 2 + 2.4]} jacketColor="#ff3fd6" pantsColor="#ff3fd6" seed={0.4} energetic />
      <DancingFigure position={[6.5, 0.9, -D / 2 + 3.6]} jacketColor="#2fe9ff" pantsColor="#2fe9ff" seed={3.1} energetic />
      {/* pole dancer, opposite the DJ booth */}
      <PoleDancer x={-3} z={-D / 2 + 4} />

      {/* disco ball + moving spotlights (with visible beam columns) + lasers */}
      <mesh ref={discoRef} position={[0, 5.6, 1]}>
        <sphereGeometry args={[0.9, 18, 14]} />
        <meshStandardMaterial color="#eeeeff" metalness={1} roughness={0.08} />
      </mesh>
      {SPOT_COLORS.map((col, i) => (
        <pointLight
          key={i}
          ref={(el) => {
            spotRefs.current[i] = el;
          }}
          color={col}
          intensity={1.6}
          distance={34}
          position={[0, 5, 0]}
        />
      ))}
      {SPOT_COLORS.map((col, i) => (
        <mesh
          key={`beam${i}`}
          ref={(el) => {
            beamRefs.current[i] = el;
          }}
          position={[0, H / 2, 0]}
        >
          <coneGeometry args={[1.6, H, 12, 1, true]} />
          <meshBasicMaterial
            color={col}
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      <pointLight color="#8a6aff" intensity={0.6} distance={50} position={[0, 4, 6]} />
      {[-9, -6, -3, 0, 3, 6, 9, -1].map((ox, i) => (
        <mesh
          key={i}
          ref={(el) => {
            laserRefs.current[i] = el;
          }}
          position={[ox, 6.4, 1]}
        >
          <coneGeometry args={[0.9, 9, 10, 1, true]} />
          <meshBasicMaterial
            color={["#ff3fd6", "#2fe9ff", "#2fff8a", "#b06bff", "#ff8a2f", "#8affd1", "#ffd12f", "#ff2f8a"][i]}
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* dancing crowd */}
      {CROWD.map((p, i) => (
        <DancingFigure key={i} position={[p.x, 0, p.z]} jacketColor={p.color} pantsColor="#161b26" seed={p.seed} />
      ))}
      {/* floating emoji over a few dancers */}
      <EmojiFloat x={CROWD[0].x} z={CROWD[0].z} seed={0} glyph="♪" color="#ff3fd6" />
      <EmojiFloat x={CROWD[4].x} z={CROWD[4].z} seed={2.1} glyph="♫" color="#2fe9ff" />
      <EmojiFloat x={CROWD[9].x} z={CROWD[9].z} seed={4.3} glyph="★" color="#ffd12f" />

      {/* bar along the +x wall, VIP booths along the -x wall */}
      <Bar x={W / 2 - 2} z0={-6} z1={6} />
      <Booth x={-W / 2 + 2} z={-7} />
      <Booth x={-W / 2 + 2} z={0} />
      <Booth x={-W / 2 + 2} z={7} />

      {/* wall posters */}
      <Poster x={-14} z={D / 2 - 0.4} ry={Math.PI} map={POSTERS[0]} />
      <Poster x={14} z={D / 2 - 0.4} ry={Math.PI} map={POSTERS[1]} />
      <Poster x={9} z={-D / 2 + 0.4} ry={0} map={POSTERS[2]} />

      {/* exit door + sign */}
      <mesh position={[0, 2.2, D / 2 - 0.55]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[3, 4.4]} />
        <meshBasicMaterial color="#9a4fff" />
      </mesh>
      <mesh position={[0, 5, D / 2 - 0.56]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial color="#12aa44" />
      </mesh>
    </group>
  );
}
