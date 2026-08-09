# cinema — NEON CINEMA

Reference: real photos — "Beverly Cinema" classic movie-theater marquee exterior, auditorium interior.

**Status: reference saved, NOT built yet.** Wait for "stop" before dispatching build.

## Exterior

- Classic American movie-palace marquee front — flat-fronted building, wide horizontal marquee canopy jutting out over the sidewalk at first-floor level.
- Two large oval "blade"-style sign badges mounted above the marquee canopy, red background with white script/bold logotype: "BEVERLY Cinema" — glowing warm bulb-chase border ringing each oval (rows of individual round bulbs, classic theater-marquee lighting).
- Row of bare round marquee bulbs also lining the roofline/canopy edge above the oval signs.
- Below the oval signs: a wide changeable-letter marquee reader-board (black background, red plastic press-in letters) listing showtimes/films across two sections — this is the functional "what's playing" board.
- Building facade behind/above the signs: warm orange/yellow glowing panel sections (backlit or painted), giving a warm colorful glow.
- Ground floor: glass entrance doors/lobby windows, movie posters displayed in frames flanking the entrance, small string/patterned tile detail on the facade above the doors.
- A small potted plant near the entrance, nighttime street setting, wet/lit pavement reflecting the sign glow.
- Overall palette: red + white + warm bulb-amber + black marquee board + orange glow. Classic single-screen revival-house cinema, not a modern multiplex.

## Interior

- Grand single-screen auditorium — sweeping curved rows of red velvet tip-up seats, dozens of rows, gently raked/curved seating plan (not straight rows).
- Large flat projection screen at the front, framed in a soft red-lit proscenium/curtain-style border, film currently showing on screen.
- Spectacular ceiling: a faceted/coffered dome-like ceiling made of triangular panels, entirely lit red, with a grid of small round recessed downlights (warm bulb-like points) set into the triangular grid pattern — the ceiling itself is a major visual centerpiece, almost like a starfield/geodesic dome.
- Dark side walls, aisle lighting strips along the floor for wayfinding.
- Overall palette: deep red velvet + red-lit geometric ceiling + warm pinpoint ceiling lights + screen glow. Immersive, moody, single-color-dominant (red) design — the ceiling is the standout feature, more than the seats.

## Build notes for whoever implements this

- Current generic exterior: `cinema` entry in `lib/interiorSpots.ts` (dark purple box, w=26 d=20 h=10). Needs full marquee treatment — oval bulb-ringed sign badges, changeable-letter reader-board, warm glowing facade panels. Reference uses red as the dominant color; current placeholder is purple — confirm whether to switch to red or keep the neon-city purple/violet as this building's signature color (purple could still work if applied to the marquee/bulbs instead of red, but the bulb-chase-ring + reader-board shapes are the must-have elements regardless of hue).
- Interior already uses `category: "seats"` (rows of seat boxes facing a screen plane) — closest existing match of any building so far. Main upgrade needed: the faceted red-lit triangular ceiling dome is the standout element missing entirely from the current generic seats interior (which just has a flat ceiling + screen plane). Curved/raked seat rows instead of the current flat grid would also match better if feasible.
- Keep entrance mechanics (doorOut/doorIn/interior) unchanged — facade + interior-dressing only, same as prior entries.
