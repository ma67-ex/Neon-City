import { interactionGroups } from "@react-three/rapier";

// group 0 = Player on foot (components/Player.tsx), group 1 = "vehicles
// only" world geometry (curbs/gates that block Traffic/PoliceCar but not the
// player's own ride), group 2 = "is a player-driven vehicle body" (Car/Bike/
// CommercialVehicle). VEHICLE_ONLY's filter=[1] only accepts queries whose
// OWN membership includes bit 1 — Traffic/PoliceCar use Rapier's
// membership-in-everything default so they satisfy that and get blocked;
// PLAYER_GROUPS/VEHICLE_BODY_GROUPS below deliberately DON'T carry bit 1, so
// the player (walking OR driving) passes through VEHICLE_ONLY curbs/gates
// (the airport gate gap, Airport.tsx) same as before.
export const PLAYER_GROUPS = interactionGroups([0]);
export const VEHICLE_ONLY = interactionGroups([1], [1]);
// Car.tsx/Bike.tsx/CommercialVehicle.tsx use this instead of PLAYER_GROUPS
// for their own collider tag + sweep filterGroups: same bit-0 membership (so
// they keep the VEHICLE_ONLY passthrough above), PLUS bit 2 so they can be
// singled out from the on-foot player by WATER_BOUNDARY below.
export const VEHICLE_BODY_GROUPS = interactionGroups([0, 2]);
// The marina's pier-gap collider (Marina.tsx) uses this instead of
// VEHICLE_ONLY: filter=[2] only accepts queries carrying the vehicle-body
// bit, so it blocks every player-driven car/bike/jeep/bus/truck (unlike
// VEHICLE_ONLY, which that trick above deliberately lets them through) while
// staying invisible to the on-foot player (membership bit 0 only, no bit 2)
// — you can still walk down the dock to board a boat, no car can float
// through the same gap into the water.
export const WATER_BOUNDARY = interactionGroups([3], [2]);
