# hospital — MERCY GENERAL

Reference: real photo, Trinity Health Nazareth Hospital style.

**Status: reference saved, NOT built yet.** Wait for "stop" before dispatching build.

## What the reference shows

- Tall beige/tan brick tower (~7-8 stories) behind/above a lower white one-story wing — two-tone massing, not a single flat box.
- Tower has a grid of small rectangular windows, brick-colored (tan/khaki), with a slightly darker vertical accent bay on the left side of the tower face.
- White horizontal sign band mounted high on the tower's right corner: hospital logo mark + two-line wordmark ("[System name] / [Hospital name]"), dark text on white background.
- Lower one-story entrance wing: light gray/white panel cladding, ribbon windows.
- Flat glass canopy/overhang (thin, modern, cantilevered — not a peaked awning) shelters a circular entrance driveway in front of the main entrance doors.
- Separate single-story **EMERGENCY** wing to the left: plain white/gray box, large dark tinted glass windows, bold red "EMERGENCY" lettering mounted directly on the wall (no sign box/backing, just individual letters).
- Circular driveway with a landscaped median (flagpole + flowerbed) in front of the main entrance; a straight drive-up lane in front of the ER wing.
- Yellow road markings, a street-side STOP sign near the ER wing corner, sparse landscaping (a few small trees/planters).
- Overall palette: tan/beige brick + white/light-gray panels + red accent lettering + dark glass. Overcast sky, muted daylight.

## Build notes for whoever implements this

- Current generic exterior: `hospital` entry in `lib/interiorSpots.ts` (plain white box, w=34 d=24 h=18, red-cross billboard sign). Needs a bespoke exterior like `PizzeriaEntrance` in `components/EnterableBuildings.tsx`, not the generic `BuildingEntrance`.
- Two-mass massing (tall tan tower + lower white entrance wing) is the key visual signature — don't just recolor the existing single box.
- Separate red "EMERGENCY" wing reads as a distinct smaller volume to one side, not part of the main tower.
- Flat cantilevered glass canopy over the entrance drive (not a boxy awning like the pizzeria's).
- Keep entrance mechanics (doorOut/doorIn/interior) unchanged — this is facade-only, same pattern as the pizzeria redesign.
