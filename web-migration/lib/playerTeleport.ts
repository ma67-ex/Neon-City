// One-shot teleport request consumed only by Player.tsx — mirrors
// lib/clubTeleport.ts (which Car/Bike consume) but kept separate since the
// two are never meant to serve the same frame's request: club-door entry
// targets whichever of {car,bike,foot} is currently active, dismounting a
// vehicle always targets the player.
// vx/vz: world-space m/s to hand the player as a bail-out slide (see
// lib/player.ts's dismount call) — 0 for every other caller (club door),
// so they're optional and default to a dead stop, same as before this existed.
export const playerTeleport = { pending: false, x: 0, z: 0, h: 0, vx: 0, vz: 0 };

export function requestPlayerTeleport(x: number, z: number, h: number, vx = 0, vz = 0) {
  playerTeleport.pending = true;
  playerTeleport.x = x;
  playerTeleport.z = z;
  playerTeleport.h = h;
  playerTeleport.vx = vx;
  playerTeleport.vz = vz;
}
