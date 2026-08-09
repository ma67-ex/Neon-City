# gym — IRON YARD GYM

Reference: real photos — "GYM SPACE" building exterior, "THE IRON OFFICE" gym floor interior.

**Status: reference saved, NOT built yet.** Wait for "stop" before dispatching build.

## Exterior

- Modern multi-story commercial building (3-4 stories), dark charcoal/graphite metal-panel cladding (flat rectangular panels, not brick).
- Grid of dark-framed rectangular windows across the upper floors, warm interior light glowing through some at dusk.
- Bold building-mounted channel-letter sign, teal/mint-cyan glowing outline lettering: "GYM SPACE", mounted directly on the dark panel facade, upper-left.
- Striking architectural feature: an angular teal/mint neon-lit frame (thick glowing outline, like a stylized arrow/chevron bent shape) wraps around the corner of the building at the entrance, connecting the sign area down to the entrance canopy — this is the building's signature lighting element, not just a door trim.
- Ground floor entrance: full-height glass curtain wall (dark mullions, floor-to-ceiling glass) wrapping the corner of the building, glowing warm/white from interior lights, glass canopy structure above entrance echoing the angular teal frame.
- Bare young trees planted in the paved forecourt in front of the glass entrance.
- Dusk/night sky (deep blue-purple gradient), sun flare visible on the right — moody, upscale, modern-athletic-club look, not a converted warehouse.
- Overall palette: dark charcoal panels + glass + glowing teal/mint accent lighting + warm interior glow. Premium boutique-gym architecture.

## Interior

- Serious black-box weight room — matte black walls, black rubber flooring, black ceiling with recessed spot lighting in rows.
- Large wall-mirror bank across the back/side wall (full mirrored wall, standard gym practice) reflecting the room and doubling its apparent size.
- Huge wall lettering across the back wall in an ornate blackletter/gothic-style outline font (white/light gray outline on black): "THE IRON OFFICE" — this is the room's signature branding, large and dominant.
- Long dumbbell rack along the back wall: rows of chrome/silver dumbbells in a black rack, adjustable bench in front of it.
- Multiple black cable/functional-trainer machines (dual-stack cable towers) in the foreground, weight stacks visible, black upholstered benches.
- Ceiling-mounted black training equipment (suspension straps / battle-rope anchors) hanging down between machines.
- Warm-white round spotlights in neat rows on the black ceiling are the main light source (moody, gym-at-night lighting, not bright fluorescent).
- Overall palette: matte black everything + chrome/steel equipment + warm white spot lighting + light gray/white signage text. Serious strength-training aesthetic, not a cardio/yoga studio.

## Build notes for whoever implements this

- Current generic exterior: `gym` entry in `lib/interiorSpots.ts` (dark charcoal box, w=22 d=18 h=8, orange sign). Base color already roughly right (dark charcoal) — needs the bespoke facade treatment: glass-curtain-wall entrance corner + glowing teal angular frame + channel-letter "GYM SPACE" sign, same bespoke-component approach as `PizzeriaEntrance`.
- Interior currently uses `category: "gym"` (mirror wall + 2 benches + 1 rack, already roughly matches the equipment mix) — but needs: full mirror wall (already has one mirror plane, good), the big blackletter "THE IRON OFFICE" wall text instead of the generic `displayName` billboard text, black flooring instead of the shared gray floor color, and rows of round ceiling spotlights instead of the shared point-light rig.
- Exterior reference (GYM SPACE, teal, glass corner, dusk) and interior reference (THE IRON OFFICE, black-and-chrome weight room) are two different photos of conceptually the same building — do not swap them: exterior facade uses the teal/glass treatment, interior dressing uses the black/chrome/blackletter treatment.
- Keep entrance mechanics (doorOut/doorIn/interior) unchanged — facade + interior-dressing only.
