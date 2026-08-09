// Phase 2 of lib/interiors.ts: a spread of ordinary enterable buildings
// beyond VENU (components/EnterableBuildings.tsx renders these).
//
// FIXED 2026-08-09: `ext` used to be k*100+50/m*100+50 — the original
// comment here claimed that "lands mid-block clear of a road centerline,"
// but it's backwards. City.tsx's Chunk() centers each block on cx=ci*CELL
// (a plain multiple of 100); the road+sidewalk band sits in the CELL/2-34=16
// units either side of the *boundary* between blocks, i.e. exactly at
// k*100+50. So every building here was planted dead center of a road (most
// of them at an actual intersection, both x and z on a centerline at once)
// — same bug POLICE HARBOR's own comment (lib/landmarks.ts) already warns
// about and was fixed the same way for. `ext` below is now a plain multiple
// of CELL (a real block center), individually nudged off a couple of
// landmark chunks it would've otherwise collided with. Their chunks are
// also exempted in City.tsx's isExempt (BUILDING_SPOT_CHUNKS) so the
// procedural generator doesn't drop random buildings on top of them.
//
// Interior "pockets" are a separate row out past CLUB_IN (lib/club.ts, at
// x=-50,z=-4050) — z=-4400 keeps 300+ units clear of it — self-contained
// rooms with their own floor, not reliant on the chunk streamer the way the
// real map is.
//
// FIXED 2026-08-09 (round 2): dead block-center placement read as "stranded
// in the middle of an empty pad," door facing nothing in particular. Real
// storefronts front onto a street. City.tsx's Chunk() keeps buildings inside
// cx/cz ± BUILD_HALF (34) and treats the ring from there out to the road
// itself as sidewalk — `edgeZ()` below pushes each building's south face
// (local +Z, where the door already is — see BuildingEntrance/
// PizzeriaEntrance in components/EnterableBuildings.tsx) out to sit flush
// against that sidewalk ring instead of at the block's dead center, so the
// canopy/entrance pad reads right up against the road. FRONT_CLEAR leaves
// room for the canopy+entrance-pad dressing (~3.5 units deep) to fit between
// the door and the road without poking into traffic.
const BUILD_HALF = 34; // duplicated from City.tsx's Chunk() — CELL/2 - (ROAD_W/2+6)
const FRONT_CLEAR = 4;
const edgeZ = (blockZ: number, d: number) => blockZ + BUILD_HALF - FRONT_CLEAR - d / 2;

export interface BuildingSpot {
  id: string;
  displayName: string;
  ext: { x: number; z: number }; // exterior world position — x is the block center, z is pushed south to front the block's south sidewalk (see edgeZ above)
  w: number;
  d: number;
  h: number;
  color: string; // exterior wall tint
  signColor: string;
  pocket: { x: number; z: number }; // interior room world position
  roomW: number;
  roomD: number;
  hospital?: boolean; // red-cross treatment instead of the plain sign
  category: "counter" | "shelves" | "gym" | "diner" | "bar" | "seats"; // which generic prop set BuildingInterior dresses the room with
}

const P = (i: number) => ({ x: -660 + i * 120, z: -4400 }); // interior pocket row, spaced clear of each other

// blockZ kept in each entry (as a comment) for edgeZ() — the block-center
// values are what round 1's collision-dodging (CENTRAL PARK/SKY TOWER, see
// git history) was computed against, so they're the reference point, not ext.z.
export const BUILDING_SPOTS: BuildingSpot[] = [
  // blockZ 300: (250,250)+50 collided with CENTRAL PARK's chunk (2,2) — bumped a full block further out
  { id: "hospital", displayName: "MERCY GENERAL", ext: { x: 300, z: edgeZ(300, 24) }, w: 34, d: 24, h: 18, color: "#e8ecf0", signColor: "#ff3b3b", pocket: P(0), roomW: 20, roomD: 16, hospital: true, category: "counter" },
  // blockZ -100: (250,-50)-50 collided with SKY TOWER's chunk (2,-1) — bumped a full block further out
  { id: "cornerStore", displayName: "QUIK-STOP", ext: { x: 300, z: edgeZ(-100, 14) }, w: 16, d: 14, h: 6, color: "#2f7dd4", signColor: "#ffd12f", pocket: P(1), roomW: 12, roomD: 10, category: "shelves" },
  { id: "gym", displayName: "IRON YARD GYM", ext: { x: -300, z: edgeZ(200, 18) }, w: 22, d: 18, h: 8, color: "#2a2a30", signColor: "#ff6a2f", pocket: P(2), roomW: 16, roomD: 14, category: "gym" },
  { id: "bank", displayName: "FIRST NEON BANK", ext: { x: -300, z: edgeZ(-100, 20) }, w: 24, d: 20, h: 12, color: "#d8d4c0", signColor: "#2fbd6e", pocket: P(3), roomW: 16, roomD: 14, category: "counter" },
  // color is real brick (was neon-orange) — components/EnterableBuildings.tsx's
  // PizzeriaEntrance gives this one a bespoke real-storefront facade, copied
  // from a reference photo, instead of the generic neon-glow entrance
  { id: "pizzeria", displayName: "TONY'S PIZZERIA", ext: { x: 300, z: edgeZ(0, 14) }, w: 16, d: 14, h: 7, color: "#8b5842", signColor: "#e8d9b8", pocket: P(4), roomW: 12, roomD: 10, category: "diner" },
  { id: "electronics", displayName: "CIRCUIT CITY", ext: { x: -400, z: edgeZ(0, 16) }, w: 18, d: 16, h: 8, color: "#1c1c22", signColor: "#2fe9ff", pocket: P(5), roomW: 14, roomD: 12, category: "shelves" },
  { id: "barber", displayName: "CLIP JOINT", ext: { x: 0, z: edgeZ(200, 12) }, w: 14, d: 12, h: 6, color: "#e0e0e4", signColor: "#ff3fd6", pocket: P(6), roomW: 10, roomD: 9, category: "counter" },
  { id: "bar", displayName: "THE RUSTBUCKET", ext: { x: 0, z: edgeZ(-300, 16) }, w: 18, d: 16, h: 7, color: "#3a2a20", signColor: "#ff8a2a", pocket: P(7), roomW: 13, roomD: 11, category: "bar" },
  { id: "pawnShop", displayName: "QUICK CASH PAWN", ext: { x: 300, z: edgeZ(-300, 14) }, w: 16, d: 14, h: 6, color: "#5a4a30", signColor: "#ffd12f", pocket: P(8), roomW: 11, roomD: 10, category: "shelves" },
  { id: "officeTower", displayName: "MERIDIAN TOWER", ext: { x: -400, z: edgeZ(-300, 24) }, w: 28, d: 24, h: 40, color: "#a8c0d8", signColor: "#2fe9ff", pocket: P(9), roomW: 18, roomD: 16, category: "counter" },
  { id: "cinema", displayName: "NEON CINEMA", ext: { x: 200, z: edgeZ(400, 20) }, w: 26, d: 20, h: 10, color: "#1a1420", signColor: "#b06bff", pocket: P(10), roomW: 16, roomD: 14, category: "seats" },
  { id: "laundromat", displayName: "SUDS LAUNDROMAT", ext: { x: -300, z: edgeZ(400, 12) }, w: 14, d: 12, h: 6, color: "#e8e8ec", signColor: "#2fbd6e", pocket: P(11), roomW: 10, roomD: 9, category: "shelves" },
];
