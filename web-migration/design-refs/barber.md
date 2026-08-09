# barber — CLIP JOINT

Reference: real photos — classic "BARBERSHOP" storefront exterior, modern black/marble barber-chair interior.

**Status: reference saved, NOT built yet.** Wait for "stop" before dispatching build.

## Exterior

- Ground floor of a red-brick building, white-framed upper windows peeking above.
- Deep, ornate dark-wood/brown storefront surround — heavy carved cornice with scroll brackets at each top corner, classic Victorian-shop-front joinery.
- Wide horizontal sign board mounted in the fascia: cream background, bold black serif capitals "BARBERSHOP", flanked by diagonal black-and-cream barber-pole-stripe end caps.
- Two tall matching side pilasters (posts) flanking the recessed doorway, decorated with diagonal black-and-cream candy-stripe banding (barber-pole motif carried down the posts) and a chevron-stripe base panel at the bottom of each.
- Recessed center entrance: dark wood-framed glass door, propped open, warm light spilling out; visible interior shelving through the door.
- Two full-height glass display windows flanking the door (same dark wood frame), each with a small planter box below holding ferns/flowers, and a hanging pendant bulb visible just inside each window.
- Small round downlights recessed into the underside of the cornice, lighting the sign board.
- Warm cream floor tile at the threshold, plain stone sidewalk in front.
- Overall palette: dark chocolate-brown wood + cream/white striping + red brick + warm bulb light + greenery accents. Old-world traditional barbershop, not futuristic.

## Interior

- Modern high-end barber floor — polished black-and-white veined marble flooring (bold marble pattern, not plain tile).
- Flat gray walls, dark ceiling with bold white LED strip lighting bent into rectangular/geometric shapes running across the ceiling (linear neon-tube ceiling design, the room's main light source).
- Row of 3-4 black leather barber chairs (vintage-style, tufted, chrome headrest/footrest) facing black-topped station counters along the wall.
- Round backlit mirrors above each station — thin warm-white/amber circular LED ring light framing each round mirror, evenly spaced.
- Black wall shelving between mirrors holding product bottles.
- A freestanding white neon ring light (unmounted, on the floor) visible near the chairs as a decor/lighting prop.
- Overall palette: black + gray + white LED lines + warm amber mirror rings + bold black/white marble floor. Sleek modern-luxury barbershop, high contrast.

## Build notes for whoever implements this

- Current generic exterior: `barber` entry in `lib/interiorSpots.ts` (light gray box, w=14 d=12 h=6, pink neon sign). Needs full replacement — dark wood Victorian storefront with cream sign board and barber-pole-stripe pilasters, nothing like the current light-gray/pink-neon placeholder.
- Exterior and interior are two very different eras/styles on purpose (old-world storefront outside, ultra-modern black marble barbershop inside) — build both as shown, don't try to unify the look, don't swap which reference goes where.
- Interior: replace generic `category: "counter"` (single counter + 2 shelves) with row of barber-chair stations facing the wall, round backlit mirrors, black/white marble floor material, and linear white LED ceiling strips instead of the shared point-light rig.
- Keep entrance mechanics (doorOut/doorIn/interior) unchanged — facade + interior-dressing only, same as prior entries.
