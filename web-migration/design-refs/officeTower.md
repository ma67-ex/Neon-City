# officeTower — MERIDIAN TOWER

Reference: real photos — EXTERIOR REPLACED 2026-08-09 with a true high-rise glass tower (user: "place office tower with this, it has more buildings, and it will help you" — resolves the earlier height mismatch, this now matches the existing h=40 skyscraper scale). Executive office interior reference (below) is unchanged from the original mid-rise photo set.

**Status: reference saved, NOT built yet.** Wait for "stop" before dispatching build.

## Exterior (REVISED — tall glass tower)

- Full high-rise skyscraper, 30+ stories, tapering slightly toward a pointed/angled top (not a flat roofline) — genuinely tall, matches the game's existing h=40 proportions, no more scale mismatch.
- Faceted glass curtain wall: continuous horizontal window-band floors wrapping the tower, with prominent vertical orange/red-orange mullion accent stripes running the full height between window bays — the building reads as blue-glass-and-steel with warm orange vertical striping as the signature repeating motif (not a single accent spine like the old reference — this one repeats the accent up the whole face).
- A secondary shorter dark-glass volume/wing tucked behind-right of the main tower, black-mullioned, contrasting with the main tower's lighter blue-glass-and-orange face — two-tower massing, main tower dominant.
- Sharp angled roofline at the top where the main tower's faces meet in a ridge/peak, not a flat parapet.
- Ground floor: distinct white podium base, several stories shorter than the tower, wrapped in a bold horizontal red/orange band at its base (echoes the tower's vertical orange stripes), full glass frontage at street level, small entrance canopy.
- Street trees and ordinary downtown sidewalk/road in front, other city towers visible in the background — dense urban downtown setting, daytime clear sky.
- Overall palette: blue-glass grid + repeating orange/red-orange vertical mullions + dark-glass secondary wing + white-and-red podium base. Genuine downtown high-rise, not a suburban office park — bigger tonal shift from "corporate campus" to "big-city tower."

## Interior

- Upscale private executive office (single office, not open-plan) — warm walnut wood-paneled feature wall with built-in shelving (dark wood shelves, black backing) displaying books/decor objects and a large abstract black-and-white painting centered on the shelving wall.
- Adjacent wall: dark vertical wood slat-panel accent wall (black/dark-wood ribbed slats) with a second large abstract painting.
- Black rectangular executive desk (dark wood/black top, black legs) centered in the room, black leather high-back executive chair behind it, laptop on the desk.
- Two gray upholstered guest armchairs facing the desk.
- Modern circular/organic-shaped pendant light fixture (warm brass ring, overlapping circles) hanging above the desk area.
- Light gray patterned area rug under the desk, medium-tone wood flooring.
- Overall palette: walnut wood + charcoal/black slats + black desk/chair + gray upholstery + warm brass pendant light + monochrome art accents. Sleek, moody, high-end executive-suite look — very different from the building's clean corporate exterior.

## Build notes for whoever implements this

- Current generic exterior: `officeTower` entry in `lib/interiorSpots.ts` (glass-blue box, w=28 d=24 h=40, cyan sign) — already the tallest building in the set (h=40 vs 6-24 for everything else), which now matches the revised tower reference's real scale. No height change needed; this is a materials/detailing pass, not a resize.
- Exterior's signature move is the repeating vertical orange/red-orange mullion striping across the glass face, plus the secondary dark-glass wing tucked behind the main tower and the white-and-red podium base at street level — three distinct zones (tower face / dark wing / podium) rather than one uniform glass box.
- Interior: current generic `category: "counter"` (reception desk + 2 shelves) reads completely wrong for this reference — this needs a single private executive office (wood-paneled wall + slat accent wall + desk + 2 guest chairs + pendant light), not a lobby/reception layout. May need a new furniture category (e.g. `"office"`) rather than reusing `"counter"`.
- Keep entrance mechanics (doorOut/doorIn/interior) unchanged — facade + interior-dressing only, same as prior entries.
