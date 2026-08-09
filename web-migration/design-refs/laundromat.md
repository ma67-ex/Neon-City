# laundromat — SUDS LAUNDROMAT

Reference: real photos — "River Rock Laundromat" strip-mall storefront exterior, modern laundromat interior.

**Status: reference saved, NOT built yet.** Wait for "stop" before dispatching build.

## Exterior

- Plain strip-mall storefront unit — brick lower wainscot band, flat gray metal awning/canopy strip above the windows, utilitarian not fancy.
- Wide backlit sign box spanning the storefront: white background, blue text, two-part logo — smaller "River Rock" (script-ish, stacked two lines) beside large bold "LAUNDROMAT" in blue sans-serif caps, small blue bubble/circle graphic accents at the sign's right edge.
- Full-width storefront glazing — large windows and a glass door, black metal frames, applied vinyl decal graphics of blue soap bubbles/circles scattered across the lower glass panels and door.
- Small red/orange neon "OPEN" sign hanging in the door window.
- A small secondary "River Rock Laundromat" logo decal placed mid-window at eye level.
- Interior visible through glass: rows of washers/dryers and a big stack of blue plastic laundry baskets piled just inside the window as a visual cue.
- Plain paved parking lot in front, ordinary daytime strip-mall setting — deliberately unglamorous/functional, not styled like the other reference buildings.
- Overall palette: white sign + blue logo/graphics + black frames + brick base + gray awning. Everyday neighborhood laundromat, no neon-city flair.

## Interior

- Clean modern laundromat floor — light gray terrazzo-speckled flooring, industrial-chic dark ceiling with exposed silver ductwork running across it.
- Long row of stainless-steel front-load washers and dryers built into a light stone/tile accent wall, each machine with a small blue-lit control panel.
- Ceiling centerpiece above the machines: a large oval ring light fixture, white with a glowing blue LED ring outline — the room's signature design element, directly over the machine row.
- Wall-mounted flat-screen TVs above the machines for customers to watch while waiting.
- Blue-painted metal bench seating (perforated blue metal, small round-tube legs) scattered in the open waiting area, matching blue rolling laundry carts.
- Black-framed glass storefront windows along the front wall, street visible outside, black pendant lights hanging at intervals.
- Wall text/graphic on the side wall: stenciled phrase "Laundry is THE CYCLE OF LIFE..." as a decorative accent.
- Overall palette: light gray/stone + stainless steel + blue accents (benches, ring light, carts) + black frame/ceiling details. Bright, clean, modern-utilitarian — the blue oval ceiling ring is the standout feature.

## Build notes for whoever implements this

- Current generic exterior: `laundromat` entry in `lib/interiorSpots.ts` (off-white box, w=14 d=12 h=6, green sign). Needs the sign swapped to the white-background blue-text "LAUNDROMAT" wordmark treatment (green → blue), brick wainscot base, and bubble-decal storefront glass — smallest/plainest build of the batch, matches the reference's deliberately ordinary strip-mall look.
- Interior: replace generic `category: "shelves"` with a row of washer/dryer machine props along one wall (repeated cylinder/drum-front boxes, small blue-lit panel accent) and the signature blue-LED-ring oval ceiling fixture centered above them — that ring light is the one distinctive touch worth prioritizing if scope is tight.
- This is the lowest-drama reference of the whole set (last building, deliberately plain/everyday per the photos) — don't over-embellish it relative to the source, the "premium entrance" canopy treatment from other buildings can be toned down to match this one's plain-strip-mall energy if it looks out of place.
- Keep entrance mechanics (doorOut/doorIn/interior) unchanged — facade + interior-dressing only, same as prior entries.

---
All 12 references now collected (`bar` intentionally left generic, `officeTower` height decision still open). Waiting for "stop" before dispatching subagents.
