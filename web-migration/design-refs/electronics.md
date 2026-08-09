# electronics — CIRCUIT CITY

Reference: real photos — Smeg flagship storefront exterior, generic tech-showroom interior render.

**Status: reference saved, NOT built yet.** Wait for "stop" before dispatching build.

## Exterior

- Ground floor of a classic stone/limestone building — pale stone facade with carved round medallion details flanking each shopfront bay, arched keystone details above each window.
- Two large full-height display windows separated by a stone pier, each framed in a slim black metal frame — no doors visible in this crop, glass runs floor-to-ceiling.
- Black horizontal fascia band across the top of each window with a small white minimal logo/wordmark centered ("smeg") — clean sans-serif, understated, not a big glowing sign.
- Warm white interior lighting spills out through the glass at dusk; a green living-wall (vertical plant wall) visible inside as a feature backdrop.
- Merchandise staged as the "display": one side shows product tables/pedestals, the other side shows colorful showcase items (in the reference, small cars — for our building this reads as "flagship product display in the window," swap for tech gadgets).
- Sidewalk paved in a light checkerboard/herringbone stone pattern; a street sign mounted on the stone pier.
- Overall palette: pale stone + black metal frame + warm interior glow + minimal signage. Upscale flagship-retail look, not a neon computer shop.

## Interior

- Clean, minimal showroom — warm beige/tan wood-paneled walls (wainscot-style panels), pale stone/tile floor.
- Recessed ceiling coves with warm white LED lighting running the perimeter, plus small round downlights.
- Back wall: large flat-screen display embedded in the wood paneling, flanked on both sides by built-in shelving grids displaying small dark tech devices (tablets/phones) in neat rows, evenly lit.
- Two wood display tables/pedestals in the room, each with tech devices (laptops/tablets) laid out symmetrically, small potted plant/topiary as a centerpiece accent on one table.
- Overall palette: warm tan wood + white light + dark device accents + a few green plant accents. Feels like an Apple Store crossed with a boutique appliance showroom — calm, premium, symmetrical.

## Build notes for whoever implements this

- Current generic exterior: `electronics` entry in `lib/interiorSpots.ts` (near-black box, w=18 d=16 h=8, cyan neon sign). This is a big tone shift — current placeholder is dark/neon-cyberpunk, reference is pale-stone/minimal/upscale. Confirm with user whether to keep some neon-city flavor (e.g. a subtle cyan accent) or go fully to the calm/minimal reference look — reference has NO neon at all.
- Exterior: floor-to-ceiling glass bay(s) in a black frame, pale stone pier between/around them, small flat black-fascia wordmark sign (not a big glowing sign like other buildings built so far) — quietest signage of the batch.
- Interior: replace generic `category: "shelves"` (dark metal shelf racks) with warm wood-paneled showroom dressing — built-in shelf niches for small devices, a wall-mounted screen, and 1-2 product display tables/pedestals instead of retail shelf racks.
- Keep entrance mechanics (doorOut/doorIn/interior) unchanged — facade + interior-dressing only, same as prior entries.
