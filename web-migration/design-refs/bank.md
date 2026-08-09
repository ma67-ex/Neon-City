# bank — FIRST NEON BANK

Reference: real photos — Bank of England (Threadneedle Street) exterior, vintage bank-lobby postcard interior.

**Status: reference saved, NOT built yet.** Wait for "stop" before dispatching build.

## Exterior

- Grand neoclassical stone building — pale limestone/cream color, monumental scale.
- Tall Corinthian colonnade (row of fluted columns with ornate capitals) spanning the upper floors, supporting a classical pediment (triangular gable) with carved relief sculpture at the very top.
- Below the colonnade: a row of carved stone figures/caryatid-style statues set into niches between arched windows on a lower entablature band.
- Ground floor: series of round-arched openings/doorways with deep-set dark shadow, plain stone piers between them (rusticated, no columns at street level — the columns are only on the upper facade).
- Ornate Greek-key (meander) decorative band carved into the stone frieze above the ground-floor arches.
- Symmetrical, formal, heavy stone balustrade railings at parapet/balcony levels.
- Antique black cast-iron lamp posts (ornate, Victorian-style, with lantern-style glass heads) standing in front of the building.
- Overall palette: pale cream/limestone stone, no glass curtain walls, no signage/logo visible on the facade itself — the architecture itself communicates "bank/institution." Daytime, blue sky.

## Interior

- Grand double-height banking hall — long rectangular room, symmetrical.
- Two rows of thick marble/verdigris-green columns (green-veined stone, gold Ionic capitals) marching down both sides of the hall to a vanishing point.
- Ornate gold/cream coffered ceiling with a soft skylight band running down the center; large ornate glass-globe pendant chandeliers hanging at intervals.
- Dark wood-and-brass teller counters/partitions running along both side walls under the columns (barred teller windows, traditional bank-counter style).
- Polished pale stone/marble floor.
- Central free-standing wooden podium/desk (dark wood, brass fittings) in the middle of the hall, on-axis, like a manager's station.
- Overall palette: cream + gold + verdigris green marble + dark wood + brass. Ornate, early-1900s formal bank lobby — not a modern bank branch.

## Build notes for whoever implements this

- Current generic exterior: `bank` entry in `lib/interiorSpots.ts` (tan/cream box, w=24 d=20 h=12, green sign). Base cream tone is roughly in the right family, but needs a full neoclassical facade treatment — columns + pediment + arched entries — a much heavier architectural lift than the other buildings so far (no flat-panel/glass shortcuts here).
- This is the most geometrically complex reference given so far (colonnade + pediment + statue niches). Builder should consider simplified/stylized column rows (repeated cylinder meshes with a capital cap) rather than true fluted-column geometry, matching the low-poly/primitive style the rest of the game uses (see e.g. `POLICE HARBOR`/`AUTO YARD` landmark builds in `components/City.tsx` or `lib/landmarks.ts` for the game's existing level of architectural detail — don't over-build relative to that).
- Interior: replace generic `category: "counter"` (single reception counter + 2 shelves) with a proper banking-hall layout — two rows of columns, teller counters along both walls, central podium desk. This is a bigger interior than the current 16x14 `roomW/roomD` comfortably fits at the reference's scale — builder may need to bump `roomW`/`roomD` for this entry specifically.
- No exterior signage/logo in the reference — keep the building's own architecture as the "sign," but the game still needs the `displayName` billboard somewhere for the enter-hint UX; keep it minimal/small rather than a big neon sign, to match the ref's restraint.
- Keep entrance mechanics (doorOut/doorIn/interior) unchanged — facade + interior-dressing only, same as prior entries.
