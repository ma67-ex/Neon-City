import { triggerKlaxon } from "@/lib/audio";

// FORT NEON alert state (SUMMARY.md #19 — "nothing reacts to the player
// firing inside the compound"). Plain mutable singleton, same shared-state
// pattern as lib/tankShell.ts's fireQueue/worldState — not React state, since
// this is read every frame by a useFrame loop (components/BaseDefense.tsx)
// and written from wherever a shot is detected (components/TankCombat.tsx's
// fire-queue drain), not from a render.
export const alertState = { alerted: false, timer: 0 };

const ALERT_DURATION = 12; // seconds of calm after the last shot fired inside the base

/** Call when a shot (tank shell or handheld gun) is confirmed to have landed
 * inside FORT NEON's footprint. Idempotent while already alerted — just
 * refreshes the timer; only fires the klaxon on the calm→alerted transition
 * so it doesn't re-trigger every single shot during a firefight. */
export function triggerAlert() {
  if (!alertState.alerted) triggerKlaxon();
  alertState.alerted = true;
  alertState.timer = ALERT_DURATION;
}

/** Call once per frame (components/BaseDefense.tsx) to count the alert back
 * down to calm after the last shot. */
export function tickAlert(dt: number) {
  if (alertState.timer <= 0) return;
  alertState.timer -= dt;
  if (alertState.timer <= 0) {
    alertState.timer = 0;
    alertState.alerted = false;
  }
}
