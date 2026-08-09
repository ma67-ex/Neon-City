# pawnShop — QUICK CASH PAWN

Reference: real photos — "Ben's Loan Pawnshop" Wild West storefront exterior, cluttered pawn-shop interior (guitars/electronics/collectibles).

**Status: reference saved, NOT built yet.** Wait for "stop" before dispatching build.

## Exterior

- Old-West/frontier-town wood building — rough weathered dark-brown plank siding and a shingled shed-style roof overhang (porch roof) held up implicitly, no visible posts in this crop.
- Big carved/painted wood sign board mounted above the porch roof: two stacked lines, "BEN'S LOAN" (smaller, top) and "PAWNSHOP" (larger, bold serif/western lettering, weathered cream-on-wood), rough distressed wood-grain texture.
- A bleached longhorn cattle skull mounted centered on the porch fascia, right below the sign — the building's single most distinctive prop.
- Double wood-and-glass saloon-style doors, small multi-pane windows either side, warm lamp glow visible through the glass.
- Rustic hanging metal lantern lights (3-4 of them) mounted along the porch eave, warm amber glow, wrought-iron mounts.
- Small hand-painted wood signs hung in/around the windows: "GOLD SILVER", "WE BUY GUNS", "BUY GUNS" — rough stenciled lettering on distressed board.
- Porch/boardwalk out front cluttered with merchandise-as-decor: wood barrels, a guitar leaning against a barrel, a row of boots lined up, saddle/tack gear, an old clock, lanterns for sale — general "stuff for sale piled outside" clutter.
- A wooden cowboy figure (mannequin/statue) standing to the left with a coiled rope, cowboy hat, vest — western character prop.
- Overall palette: weathered brown wood + cream distressed lettering + warm lantern amber + dusty sunset sky. Wild-West trading-post look, not urban/modern.

## Interior

- Long narrow shop aisle, cramped and cluttered — classic pawn-shop density, not a curated boutique.
- Drop-ceiling with fluorescent panel lighting (bright, flat, functional — not moody/warm like other buildings so far).
- Both side walls lined with glass display counters (waist-height, glass-topped cases showing small valuables) topped with slat-wall panels hung with dozens of guitars in rows (acoustic + electric, varied colors) — guitars are the dominant visual motif.
- Upper wall shelving stacked with electronics/instrument cases/misc merchandise, fairly disorganized/packed.
- Novelty oversized bobblehead figures (sports mascot statues) placed on the counters near the camera — signature "weird stuff you find in a pawn shop" detail.
- A small flat-screen TV/monitor visible mounted low on a shelf.
- Overall palette: beige/tan laminate counters + gray carpet + bright white fluorescent light + colorful merchandise wall (guitars especially) providing the only real color pop. Utilitarian, packed, unglamorous — the opposite of a showroom.

## Build notes for whoever implements this

- Current generic exterior: `pawnShop` entry in `lib/interiorSpots.ts` (tan/gold box, w=16 d=14 h=6). Needs full wood-plank Western-storefront treatment — weathered brown wood, carved sign board, longhorn skull prop, lantern lights, porch clutter. Biggest style swing yet from the current neon-city aesthetic — confirm with user if the Wild-West look should get any neon-city concession (e.g. keep it fully western per the reference, since they explicitly chose it).
- Interior: replace generic `category: "shelves"` with dense pawn-shop dressing — glass display counters along both walls, guitars hung on slat-wall (repeated thin box/plane props at varied heights), bright flat ceiling lighting instead of the shared warm point-light, novelty bobblehead props as small accent details.
- This is a much "busier/cluttered" brief than prior buildings (which were mostly clean/spacious) — the mess and density IS the design language here, don't over-clean it.
- Keep entrance mechanics (doorOut/doorIn/interior) unchanged — facade + interior-dressing only, same as prior entries.

---
Note: `bar` (THE RUSTBUCKET) is still pending — you jumped ahead to pawnShop. Will wait for that ref whenever you're ready, no rush.
