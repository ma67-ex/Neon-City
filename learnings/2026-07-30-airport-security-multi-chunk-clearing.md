# Airport security layer: multi-chunk clearing + perimeter fence

**Date:** 2026-07-30

## Problem

SUMMARY.md's Milestone 18 said a "fourth background agent" was mid-flight
scaling the airport up and adding a security layer (multi-chunk clearing,
bigger runway/apron/terminal/hangar, perimeter fence + gate, parked police
cars) — "not yet reviewed or folded in." The user asked to pick up "the
security" from that note. First job was figuring out whether that agent's
work actually existed anywhere to review, before writing a line of code.

## Approach

1. Found a worktree at `.claude/worktrees/agent-af03d7d41032ac852` that
   looked like the obvious candidate (only worktree in the repo).
2. `git diff main --stat` against it: empty. `diff` on `Airport.tsx`
   directly between main and the worktree: empty. Grepped both for
   fence/gate/perimeter/security keywords: nothing in either.
3. Checked `TaskList` (the harness's shared task tracker) for a tracked
   background job: none.
4. Concluded the referenced agent's output was never produced or was lost
   before landing anywhere on disk — the SUMMARY.md note was describing
   an agent run that didn't survive the session it was started in.
5. Built the feature directly instead of hunting further: read
   `Airport.tsx`, `City.tsx`'s chunk-exemption logic, `PoliceStation.tsx`'s
   parked-fleet pattern, and `PoliceCar.tsx`/`ParkedPoliceJeep.tsx`'s
   exported mesh components first, then scaled the airport up, added
   `AIRPORT_CHUNKS` (a 3x3 exemption block) to `City.tsx`, and added
   `PerimeterFence`/`Gate`/`GateGuardPost` to `Airport.tsx` reusing existing
   parked-vehicle components.
6. Hand-checked the gate-gap collider math and caught a real sign error
   (used `(FENCE_Z - GATE_Z0) / 2` for a half-extent where the correct
   formula was `(GATE_Z0 + FENCE_Z) / 2` — the wrong one produced a
   collider ~11 units too long, which would have silently blocked part of
   the intended gate opening) before it ever ran.
7. Verified live: rather than physically drive ~380 units from spawn,
   wrote a save object straight into `localStorage`'s `ncd_web_save_v1` key
   (matching `lib/saveGame.ts`'s `SaveData` shape) with a vehicle spawned
   near the compound, then reloaded. Confirmed the fence/gate/parked
   cruisers render at the right position relative to the airport waypoint.
8. `computer{action:"key"}` presses didn't move the vehicle (0 km/h no
   matter how long held) — matches Milestone 18's own note that synthetic
   key events don't reach this game's controls in this sandbox. Raw
   `KeyboardEvent('keydown'/'keyup')` dispatched via `javascript_tool` did
   move it at real speed once tried.

## Why

Don't take an in-progress note in a summary file at face value — "an agent
is working on X" is a claim about *past* session state, not a live fact.
Checking for the actual artifact (git diff against every worktree, grep for
the feature's own keywords, TaskList for a tracked job) took under a minute
and avoided either wrongly reporting the feature as already done, or
building on top of a review that was never going to happen because there
was nothing to review.

Reusing `PoliceCarMesh`/`PoliceJeepMesh` (both already extracted as
standalone, collider-free components specifically because
`PoliceStation.tsx` needed the same "parked fleet, no physics rig" shape)
instead of writing new vehicle meshes for the checkpoint kept the diff to
two files and matched the codebase's own established convention instead of
inventing a second one.

## Gotchas

- CuboidCollider `args` are half-extents, not full lengths — the sign bug
  above came from writing the half-extent formula by pattern-matching the
  *other* (correct) segment's shape instead of re-deriving it from the
  actual interval `[GATE_Z0, -FENCE_Z]`. When one segment's formula works
  and its mirror doesn't, re-derive from the interval endpoints, don't
  eyeball the symmetry.
- `Chunk`'s `isExempt` check only skips buildings/trees, not the ground
  tile itself — every chunk still gets its road-grid-textured ground plane
  regardless of exemption. A landmark's own geometry is expected to layer
  on top of that plane, not replace it.
- This sandbox's `computer{action:"key"}` does not reach the game's
  keyboard handling at all (0 km/h regardless of duration/repeat) — use
  `javascript_tool` to dispatch raw `KeyboardEvent`s instead when live
  verification needs actual vehicle movement, not just a static scene.

## Reusable pattern

When a project's own doc/summary file says a background agent is
"in progress" or "not yet reviewed," verify the artifact exists (worktree
diff, grep for the feature's distinguishing keywords, task tracker) before
trusting the claim — then, if nothing turns up, just build the feature
directly rather than continuing to search for a diff that isn't there.
