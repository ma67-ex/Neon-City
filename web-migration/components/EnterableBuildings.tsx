"use client";

import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Billboard, Text, RoundedBox } from "@react-three/drei";
import { useHudStore } from "@/lib/hudStore";
import { registerInterior } from "@/lib/interiors";
import { BUILDING_SPOTS, type BuildingSpot } from "@/lib/interiorSpots";

// Phase 2 of lib/interiors.ts (see lib/club.ts for the original single-building
// version this generalizes from): one generic exterior/interior pair, instanced
// once per lib/interiorSpots.ts entry, instead of 12 bespoke files each
// hand-modeling their own building the way VENU (components/Club.tsx) does.
// Same walk-up/press-E/real-interior pattern, plainer set dressing.
for (const b of BUILDING_SPOTS) {
  const doorOut = { x: b.ext.x, z: b.ext.z + b.d / 2 + 2 };
  const doorIn = { x: b.pocket.x, z: b.pocket.z + b.roomD / 2 - 2 };
  registerInterior({
    id: b.id,
    displayName: b.displayName,
    enterMsg: b.displayName,
    exitMsg: "BACK ON THE STREET",
    doorOut,
    doorIn,
    interiorSpawn: { x: b.pocket.x, z: b.pocket.z, h: Math.PI },
    enterRadius2: 22,
    exitRadius2: 14,
    hintEnterRadius2: 40,
    hintExitRadius2: 30,
  });
}

// Premium walk-up entrance: lit canopy overhang + glowing floor pad + two
// flanking accent lights, instead of just a glass slot in a plain wall —
// makes each building read as a real storefront from the street, and gives
// the door a landmark-like glow to spot at night the way VENU's beacon does.
function BuildingEntrance({ b }: { b: BuildingSpot }) {
  const doorW = Math.min(4, b.w * 0.4);
  const doorZ = b.d / 2;
  const canopyD = 2.4;
  const padD = 3.2;
  return (
    <group>
      {/* glass door slot on the south face, matching doorOut's trigger point */}
      <mesh position={[0, 1.8, doorZ + 0.05]}>
        <planeGeometry args={[doorW, 3.4]} />
        <meshStandardMaterial color="#0e1216" metalness={0.6} roughness={0.15} transparent opacity={0.75} />
      </mesh>
      {/* lit door-frame trim */}
      <mesh position={[0, 3.55, doorZ + 0.06]}>
        <boxGeometry args={[doorW + 0.4, 0.15, 0.1]} />
        <meshStandardMaterial color={b.signColor} emissive={b.signColor} emissiveIntensity={1.6} />
      </mesh>
      {/* canopy overhang */}
      <mesh position={[0, 3.7, doorZ + canopyD / 2]} castShadow>
        <boxGeometry args={[doorW + 1.6, 0.25, canopyD]} />
        <meshStandardMaterial color="#0a0a0d" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 3.62, doorZ + canopyD - 0.08]}>
        <boxGeometry args={[doorW + 1.4, 0.05, 0.14]} />
        <meshStandardMaterial color={b.signColor} emissive={b.signColor} emissiveIntensity={2} />
      </mesh>
      {/* glowing entrance pad on the ground */}
      <mesh position={[0, 0.03, doorZ + padD / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[doorW + 1, padD]} />
        <meshStandardMaterial color="#141418" emissive={b.signColor} emissiveIntensity={0.35} roughness={0.5} />
      </mesh>
      {/* flanking pillar lights */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (doorW / 2 + 0.6), 0, doorZ + 0.4]}>
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 2, 8]} />
            <meshStandardMaterial color="#1a1a1e" metalness={0.6} roughness={0.3} />
          </mesh>
          <pointLight color={b.signColor} intensity={2.4} distance={9} decay={2} position={[0, 1.9, 0]} />
        </group>
      ))}
      <pointLight color={b.signColor} intensity={3} distance={18} position={[0, b.h * 0.7, doorZ]} />
    </group>
  );
}

// Bespoke storefront, copied from a real-world reference (Knott's Berry
// Farm's "Prop Shop Pizzeria" facade): brick wall, arched dark signboard
// with cream lettering, black canopy on square black posts, two hanging
// pendant lamps, arched multi-pane windows glowing warm from "inside."
// Only used for the pizzeria — everything else keeps the generic
// BuildingEntrance below.
function PizzeriaEntrance({ b }: { b: BuildingSpot }) {
  const doorW = Math.min(4, b.w * 0.4);
  const doorZ = b.d / 2;
  const canopyD = 2.2;
  const winGlow = "#ffb060";
  const Window = ({ x }: { x: number }) => (
    <group position={[x, 1.9, doorZ + 0.06]}>
      <RoundedBox args={[1.5, 2.3, 0.12]} radius={0.35} smoothness={4}>
        <meshStandardMaterial color="#1a1410" roughness={0.6} />
      </RoundedBox>
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[1.2, 2]} />
        <meshStandardMaterial color="#3a2c18" emissive={winGlow} emissiveIntensity={0.9} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[1.22, 0.05, 0.02]} />
        <meshStandardMaterial color="#0d0b08" />
      </mesh>
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[0.05, 2.02, 0.02]} />
        <meshStandardMaterial color="#0d0b08" />
      </mesh>
      <pointLight color={winGlow} intensity={1.2} distance={5} decay={2} position={[0, 0, 0.5]} />
    </group>
  );
  return (
    <group>
      {/* door slot */}
      <mesh position={[0, 1.8, doorZ + 0.05]}>
        <planeGeometry args={[doorW, 3.4]} />
        <meshStandardMaterial color="#120e0a" metalness={0.3} roughness={0.2} transparent opacity={0.8} />
      </mesh>
      <Window x={-(doorW / 2 + 1.1)} />
      <Window x={doorW / 2 + 1.1} />
      {/* black square support posts under the canopy edges */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (doorW / 2 + 1.9), 1.85, doorZ + canopyD - 0.15]} castShadow>
          <boxGeometry args={[0.22, 3.7, 0.22]} />
          <meshStandardMaterial color="#0c0c0e" roughness={0.5} metalness={0.3} />
        </mesh>
      ))}
      {/* canopy overhang */}
      <mesh position={[0, 3.75, doorZ + canopyD / 2]} castShadow>
        <boxGeometry args={[doorW + 2.4, 0.2, canopyD]} />
        <meshStandardMaterial color="#0c0c0e" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* hanging pendant lamps */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (doorW / 4), 0, doorZ + canopyD * 0.6]}>
          <mesh position={[0, 3.55, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
            <meshStandardMaterial color="#0c0c0e" />
          </mesh>
          <mesh position={[0, 3.25, 0]}>
            <cylinderGeometry args={[0.16, 0.1, 0.22, 10]} />
            <meshStandardMaterial color="#141416" metalness={0.5} roughness={0.4} />
          </mesh>
          <pointLight color={winGlow} intensity={2} distance={7} decay={2} position={[0, 3.1, 0]} />
        </group>
      ))}
      {/* arched signboard above the canopy — z is PROUD of the wall face
          (doorZ is the wall surface itself), not recessed into it, or it
          renders hidden inside the building from outside */}
      <group position={[0, 4.35, doorZ + 0.2]}>
        <RoundedBox args={[doorW + 2.8, 1.7, 0.18]} radius={0.5} smoothness={4} castShadow>
          <meshStandardMaterial color="#23262c" roughness={0.7} />
        </RoundedBox>
        <Text position={[0, 0.4, 0.12]} fontSize={0.52} color="#e8d9b8" outlineWidth={0.015} outlineColor="#0a0612" anchorX="center" anchorY="middle">
          {b.displayName}
        </Text>
        <Text position={[0, -0.35, 0.12]} fontSize={0.26} color="#c9b98f" outlineWidth={0.01} outlineColor="#0a0612" anchorX="center" anchorY="middle">
          AN ITALIAN KITCHEN
        </Text>
      </group>
    </group>
  );
}

function BuildingExterior({ b }: { b: BuildingSpot }) {
  const isPizzeria = b.id === "pizzeria";
  return (
    <group position={[b.ext.x, 0, b.ext.z]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[b.w / 2, b.h / 2, b.d / 2]} position={[0, b.h / 2, 0]} />
      </RigidBody>
      <mesh castShadow receiveShadow position={[0, b.h / 2, 0]}>
        <boxGeometry args={[b.w, b.h, b.d]} />
        <meshStandardMaterial color={b.color} roughness={isPizzeria ? 0.9 : 0.6} metalness={isPizzeria ? 0 : 0.15} />
      </mesh>
      {isPizzeria ? <PizzeriaEntrance b={b} /> : <BuildingEntrance b={b} />}
      {!isPizzeria && (
        <Billboard position={[0, b.h + 1.4, 0]}>
          <Text fontSize={1.1} color={b.signColor} outlineWidth={0.04} outlineColor="#0a0612" anchorX="center" anchorY="middle">
            {b.displayName}
          </Text>
          {b.hospital && (
            <Text position={[0, -1.4, 0]} fontSize={1.6} color="#ff3b3b" outlineWidth={0.05} outlineColor="#0a0612">
              +
            </Text>
          )}
        </Billboard>
      )}
    </group>
  );
}

// Generic reusable furniture blocks, picked by b.category — the point isn't
// a bespoke model per building (that's VENU's job), it's making sure every
// room has *something* to look at/walk around instead of four bare walls,
// per "there is literally nothing inside." Boxes only, same "plainer set
// dressing" ethos EnterableBuildings.tsx already documents up top. Plain
// JSX <meshStandardMaterial> per mesh (not a shared THREE.Material constant)
// — a module-scope `new THREE.Material()` here previously tripped a Turbopack
// dev-bundler ordering bug once this file and City.tsx both referenced
// lib/interiorSpots.ts's BUILDING_SPOTS at module scope.
function Furniture({ b, W, D }: { b: BuildingSpot; W: number; D: number }) {
  const shelfMat = <meshStandardMaterial color="#4a4a52" roughness={0.7} />;
  const counterMat = <meshStandardMaterial color="#2f2f36" roughness={0.5} metalness={0.2} />;
  const seatMat = <meshStandardMaterial color="#241820" roughness={0.8} />;
  const accent = (
    <meshStandardMaterial color={b.signColor} emissive={b.signColor} emissiveIntensity={0.6} roughness={0.4} />
  );
  switch (b.category) {
    case "counter":
      return (
        <group>
          <mesh position={[0, 0.55, D / 2 - 1.4]} castShadow>
            <boxGeometry args={[Math.min(W * 0.6, 5), 1.1, 0.8]} />
            {counterMat}
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * (W / 2 - 0.6), 1.4, -D / 2 + 0.4]}>
              <boxGeometry args={[0.5, 2.4, 0.5]} />
              {shelfMat}
            </mesh>
          ))}
        </group>
      );
    case "shelves":
      return (
        <group>
          {[-1, 0, 1].map((row) => (
            <group key={row} position={[row * (W / 3.2), 0, 0]}>
              <mesh position={[0, 1.1, 0]} castShadow>
                <boxGeometry args={[1.1, 2.2, Math.min(D * 0.6, 6)]} />
                {shelfMat}
              </mesh>
              {[0.5, 1.3, 1.9].map((y) => (
                <mesh key={y} position={[0, y, 0]}>
                  <boxGeometry args={[1.15, 0.08, Math.min(D * 0.6, 6)]} />
                  {accent}
                </mesh>
              ))}
            </group>
          ))}
        </group>
      );
    case "gym":
      return (
        <group>
          <mesh position={[0, 1.8, -D / 2 + 0.05]}>
            <planeGeometry args={[W * 0.9, 3.2]} />
            <meshStandardMaterial color="#0c0c10" metalness={0.6} roughness={0.05} />
          </mesh>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * (W / 4), 0.45, D / 4]} castShadow>
              <boxGeometry args={[1.4, 0.5, 0.6]} />
              {counterMat}
            </mesh>
          ))}
          <mesh position={[0, 1.1, -D / 4]} castShadow>
            <boxGeometry args={[2.2, 1.6, 0.5]} />
            {shelfMat}
          </mesh>
        </group>
      );
    case "diner":
      return (
        <group>
          <mesh position={[0, 0.55, D / 2 - 1.2]} castShadow>
            <boxGeometry args={[Math.min(W * 0.6, 4.5), 1.1, 0.8]} />
            {counterMat}
          </mesh>
          {[-1, 1].map((s) => (
            <group key={s} position={[s * (W / 3.5), 0, -D / 4]}>
              <mesh position={[0, 0.4, 0]} castShadow>
                <boxGeometry args={[1.6, 0.8, 0.7]} />
                {seatMat}
              </mesh>
              <mesh position={[0, 0.45, 0]}>
                <boxGeometry args={[1.5, 0.06, 1.5]} />
                {accent}
              </mesh>
            </group>
          ))}
        </group>
      );
    case "bar":
      return (
        <group>
          <mesh position={[0, 0.55, D / 2 - 1.4]} castShadow>
            <boxGeometry args={[Math.min(W * 0.7, 6), 1.1, 0.9]} />
            {counterMat}
          </mesh>
          <mesh position={[0, 1.7, D / 2 - 0.3]}>
            <boxGeometry args={[Math.min(W * 0.7, 6), 1.6, 0.4]} />
            {shelfMat}
          </mesh>
          {[-1.5, 0, 1.5].map((x) => (
            <mesh key={x} position={[x, 0.5, 0]}>
              <cylinderGeometry args={[0.28, 0.28, 1, 8]} />
              {seatMat}
            </mesh>
          ))}
        </group>
      );
    case "seats":
      return (
        <group>
          <mesh position={[0, 1.6, -D / 2 + 0.05]}>
            <planeGeometry args={[W * 0.7, 3]} />
            <meshStandardMaterial color="#0a0a12" emissive={b.signColor} emissiveIntensity={0.5} />
          </mesh>
          {[-2, -0.4, 1.2].map((row) =>
            [-2, -0.7, 0.7, 2].map((col) => (
              <mesh key={`${row}-${col}`} position={[col, 0.4, row]} castShadow>
                <boxGeometry args={[0.7, 0.8, 0.6]} />
                {seatMat}
              </mesh>
            ))
          )}
        </group>
      );
  }
}

function BuildingInterior({ b }: { b: BuildingSpot }) {
  const active = useHudStore((s) => s.inClub && s.activeBuildingId === b.id);
  if (!active) return null;
  const W = b.roomW;
  const D = b.roomD;
  const H = 4.2;
  const wallColor = b.hospital ? "#f4f6f8" : "#2a2a30";
  const floorColor = b.hospital ? "#dfe6ea" : "#3a3a42";
  return (
    <group position={[b.pocket.x, 0, b.pocket.z]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[W / 2, 0.1, D / 2]} position={[0, -0.1, 0]} />
        <CuboidCollider args={[W / 2, H / 2, 0.2]} position={[0, H / 2, -D / 2]} />
        <CuboidCollider args={[W / 2, H / 2, 0.2]} position={[0, H / 2, D / 2]} />
        <CuboidCollider args={[0.2, H / 2, D / 2]} position={[-W / 2, H / 2, 0]} />
        <CuboidCollider args={[0.2, H / 2, D / 2]} position={[W / 2, H / 2, 0]} />
      </RigidBody>
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color={floorColor} roughness={0.85} />
      </mesh>
      <mesh position={[0, H / 2, -D / 2]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} side={2} />
      </mesh>
      <mesh position={[0, H / 2, D / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} side={2} />
      </mesh>
      <mesh position={[-W / 2, H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} side={2} />
      </mesh>
      <mesh position={[W / 2, H / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color={wallColor} roughness={0.8} side={2} />
      </mesh>
      {/* was a single dim ceiling light with no set dressing — "can't see
          anything inside" — bumped intensity/added two fill lights near the
          walls so the corners actually read, plus real furniture below */}
      <pointLight color={b.hospital ? "#ffffff" : b.signColor} intensity={5} distance={D * 1.4} decay={1.6} position={[0, H - 0.3, 0]} />
      <pointLight color={b.signColor} intensity={2.5} distance={D} decay={1.8} position={[0, H - 0.5, D / 2 - 1]} />
      <pointLight color="#ffffff" intensity={1.5} distance={D} decay={1.8} position={[0, H - 0.5, -D / 2 + 1]} />
      <Furniture b={b} W={W} D={D} />
      <Billboard position={[0, 2.4, -D / 2 + 0.3]}>
        <Text fontSize={0.6} color={b.signColor} outlineWidth={0.02} outlineColor="#0a0612">
          {b.displayName}
        </Text>
      </Billboard>
    </group>
  );
}

export function EnterableBuildings() {
  return (
    <>
      {BUILDING_SPOTS.map((b) => (
        <BuildingExterior key={b.id} b={b} />
      ))}
      {BUILDING_SPOTS.map((b) => (
        <BuildingInterior key={b.id} b={b} />
      ))}
    </>
  );
}
