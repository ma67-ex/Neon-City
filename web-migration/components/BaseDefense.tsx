"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TOWER_POS, BASE_X, BASE_Z, PLATFORM_Y } from "@/lib/militaryBase";
import { worldState } from "@/lib/worldState";
import { alertState, tickAlert } from "@/lib/baseAlert";
import { triggerGunCrack } from "@/lib/audio";
import { spawnDebris } from "@/lib/debris";

// SUMMARY.md #19: "nothing reacts to the player firing inside the compound
// — no alert state, no return fire, no dispatch." lib/baseAlert.ts's
// alertState is set by components/TankCombat.tsx when a shot lands inside
// FORT NEON; this component is what actually reacts to it — the 4 corner
// guard towers (lib/militaryBase.ts's TOWER_POS) open fire on the player
// while alerted, one tracer + gun-crack + muzzle flash per tower per
// FIRE_INTERVAL, as long as the player's in range.
//
// Scope note: there is no player-health/damage system anywhere in this
// codebase (checked lib/pedestrianHit.ts, lib/vehicleDestroy.ts, hudStore —
// nothing tracks player HP). "Return fire" is sold entirely with tracer +
// muzzle flash + gun-crack SFX + a small spark/dust burst at the player's
// own feet (reusing lib/debris.ts's existing pooled burst, same one
// TankCombat.tsx uses for shell impacts) rather than a fabricated damage
// number — inventing a health system wasn't asked for and is a much bigger
// feature on its own. "Dispatch" (patrol soldiers converging on the player)
// is NOT done — components/MilitaryBase.tsx's PatrolSoldier is driven by
// AirportLife.tsx's usePathFollower on a fixed route with no override hook;
// wiring a live retarget-to-player path is a separate, bigger change and
// wasn't attempted here.
const ENGAGE_RANGE = 85;
const ENGAGE_RANGE2 = ENGAGE_RANGE * ENGAGE_RANGE;
const FIRE_INTERVAL = 1.3;
const TRACER_SPEED = 150; // m/s
const TRACER_COUNT = TOWER_POS.length * 2; // headroom for overlapping shots across towers
const GUN_Y = PLATFORM_Y + 9.4; // GuardTower's own spotlight height (deckH+2.9 in MilitaryBase.tsx) — reused as "roughly where the gun is"

interface Tracer {
  active: boolean;
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  dz: number;
  life: number;
}

const TRACER_MAT = new THREE.MeshBasicMaterial({ color: "#fff4b0" });

export function BaseDefense() {
  const cooldowns = useRef<number[]>(TOWER_POS.map(() => 0));
  const flashRefs = useRef<(THREE.PointLight | null)[]>([]);
  const tracers = useRef<Tracer[]>(
    Array.from({ length: TRACER_COUNT }, () => ({ active: false, x: 0, y: 0, z: 0, dx: 0, dy: 0, dz: 0, life: 0 }))
  );
  const tracerRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    tickAlert(d);

    const px = worldState.px;
    const pz = worldState.pz;
    const py = worldState.py;

    for (let i = 0; i < TOWER_POS.length; i++) {
      cooldowns.current[i] = Math.max(0, cooldowns.current[i] - d);
      const flash = flashRefs.current[i];
      if (flash) flash.intensity = Math.max(0, flash.intensity - d * 14);

      if (!alertState.alerted || cooldowns.current[i] > 0) continue;

      const tx = BASE_X + TOWER_POS[i].x;
      const tz = BASE_Z + TOWER_POS[i].z;
      const dx0 = px - tx;
      const dz0 = pz - tz;
      if (dx0 * dx0 + dz0 * dz0 > ENGAGE_RANGE2) continue;

      cooldowns.current[i] = FIRE_INTERVAL + Math.random() * 0.6;
      const dist = Math.hypot(dx0, dz0) || 1;

      const t = tracers.current.find((tr) => !tr.active);
      if (t) {
        t.active = true;
        t.x = tx;
        t.y = GUN_Y;
        t.z = tz;
        t.dx = (dx0 / dist) * TRACER_SPEED;
        t.dy = ((py + 1 - GUN_Y) / dist) * TRACER_SPEED;
        t.dz = (dz0 / dist) * TRACER_SPEED;
        t.life = dist / TRACER_SPEED;
      }
      if (flash) flash.intensity = 8;
      triggerGunCrack();
      spawnDebris({ x: px, y: py + 0.2, z: pz, dx: -dx0 / dist, dz: -dz0 / dist, power: 0.3 });
    }

    for (let i = 0; i < TRACER_COUNT; i++) {
      const t = tracers.current[i];
      const mesh = tracerRefs.current[i];
      if (!t.active) {
        if (mesh) mesh.visible = false;
        continue;
      }
      t.life -= d;
      t.x += t.dx * d;
      t.y += t.dy * d;
      t.z += t.dz * d;
      if (t.life <= 0) {
        t.active = false;
        if (mesh) mesh.visible = false;
        continue;
      }
      if (mesh) {
        mesh.visible = true;
        mesh.position.set(t.x, t.y, t.z);
      }
    }
  });

  return (
    <>
      {TOWER_POS.map((t, i) => (
        <pointLight
          key={i}
          ref={(el) => (flashRefs.current[i] = el)}
          position={[BASE_X + t.x, GUN_Y, BASE_Z + t.z]}
          color="#fff4b0"
          intensity={0}
          distance={14}
        />
      ))}
      {Array.from({ length: TRACER_COUNT }).map((_, i) => (
        <mesh key={i} ref={(el) => (tracerRefs.current[i] = el)} visible={false} material={TRACER_MAT}>
          <sphereGeometry args={[0.09, 6, 6]} />
        </mesh>
      ))}
    </>
  );
}
