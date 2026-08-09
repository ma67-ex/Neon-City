# cornerStore — QUIK-STOP

Reference: real photo, "The Corner Store" NYC storefront (475 W. Broadway) — exterior + interior.

**Status: reference saved, NOT built yet.** Wait for "stop" before dispatching build.

## Exterior

- Ground floor of an old brick walk-up building — exposed red brick above, dark aged-metal storefront bulkhead/lintel band across the top holding an elegant serif sign: "THE CORNER STORE" in white cursive-serif lettering on dark weathered metal.
- Black-painted storefront frame (wood/metal) — matte black window mullions, black door frames, black wood panel below the display windows.
- Large plate-glass display window (no door) on the left with warm amber curtains visible inside, glowing warm from interior lights.
- Center: black double glass doors (the actual entrance) with a small green neon-ish address sign in the transom above ("475 W. Broadway") and a lit red "EXIT" sign visible through the glass.
- Right: a second black double door (secondary/office entrance) with address numerals "475" mounted above it in metal, small brass/gold plaque reading "BLDG Management Co." beside it.
- Vintage exterior sconce lights (black gooseneck lamps) mounted above the sign band, one above the display window.
- Old iron fire escape running up the brick facade above the storefront.
- Black metal ramp/railing at the entrance (ADA ramp), dark pavement.
- Overall palette: red brick + black metal/wood + warm amber glow from inside + white serif signage. Moody, upscale-vintage NYC bistro/shop look — not neon, not futuristic.

## Interior

- Warm, dim, upscale restaurant/lounge interior — dark wood paneling and dark green fluted wall panels.
- Curved built-in banquette booth seating along the walls (mustard/gold velvet on one side, striped fabric on another), dark wood cafe tables, patterned dark bistro chairs with teal seat cushions.
- Walls densely hung with a gallery of small framed photos/art in ornate dark frames.
- Warm brass wall sconces spaced evenly along the walls between the framed art.
- Herringbone wood-plank flooring.
- Dark wood-slat ceiling with a lighter recessed section down the middle, small round ceiling lights.
- Large arched mirrors on the back wall reflecting the room, making it feel bigger.
- Table settings: dark wood tables, folded napkins, water glasses — a real sit-down restaurant, not a bodega.
- Overall palette: dark wood + brass + teal/mustard fabric accents + warm lamp light. Feels like a speakeasy/bistro, not a convenience store.

## Build notes for whoever implements this

- Current generic exterior: `cornerStore` entry in `lib/interiorSpots.ts` (blue box, w=16 d=14 h=6). Needs a bespoke exterior like `PizzeriaEntrance` in `components/EnterableBuildings.tsx`.
- Note the name/vibe mismatch: id is `cornerStore`/"QUIK-STOP" (implies a bodega) but the reference is an upscale bistro/restaurant look — build to match the REFERENCE IMAGE, not the placeholder name. Flag this to the user if it matters before finalizing displayName/category.
- Exterior: brick + black storefront trim + white serif sign band + warm window glow, same construction approach as pizzeria's brick/signboard but different materials/tone (matte black metal, not brick-red canopy; serif text, not arched board).
- Interior: replace the current generic `category: "shelves"` furniture (retail shelf racks) — this reference calls for booth/banquette dining seating instead. New `category` variant needed (e.g. `"lounge"`ish: curved booths + small tables + wall art + sconces), not the existing shelving prop set.
- Keep entrance mechanics (doorOut/doorIn/interior) unchanged — facade + interior-dressing only.
