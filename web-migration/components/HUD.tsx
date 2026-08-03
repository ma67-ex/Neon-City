"use client";

import { useHudStore, CAM_MODES, type CamMode } from "@/lib/hudStore";
import { Minimap } from "@/components/Minimap";
import { BigMap } from "@/components/BigMap";

// Speedo/NitroBar/Waypoint each own their own store subscription and are
// split out from HUD's own render — speedKmh/nitroFuel/waypointDist all
// change nearly every frame while driving (constant 0 while parked, which is
// why the lag reported only starts "as soon as I accelerate"). Before this
// split, all three lived directly in HUD(), so React re-rendered the WHOLE
// HUD tree — camsel buttons, the static controls legend, the sensitivity
// slider, the Minimap/BigMap wrapper divs — 60x/sec any time any of them
// ticked, on top of the Canvas's own render loop. Isolating each fast-
// changing value to its own leaf component means only that few-line
// component re-renders per tick; HUD's own shell only re-renders on its
// own (much rarer) state changes.
function Speedo() {
  const active = useHudStore((s) => s.active);
  const speedKmh = useHudStore((s) => s.speedKmh);
  const vehicleName = useHudStore((s) => s.vehicleName());
  if (active === "foot") return null;
  return (
    <div id="speedo" style={{ display: "block" }}>
      <div className="num">{speedKmh}</div>
      <div className="unit">KM/H</div>
      <div className="veh">{vehicleName}</div>
    </div>
  );
}

function NitroBar() {
  const active = useHudStore((s) => s.active);
  const nitroFuel = useHudStore((s) => s.nitroFuel);
  const nitroActive = useHudStore((s) => s.nitroActive);
  if (active !== "car") return null;
  return (
    <div id="nitrobar" className={nitroActive ? "active" : ""} style={{ display: "block" }}>
      <div className="nlabel">
        NITRO <span className="nhint">(SHIFT)</span>
      </div>
      <div className="ntrack">
        <div className="nfill" style={{ width: `${(nitroFuel * 100).toFixed(1)}%` }} />
      </div>
    </div>
  );
}

function Waypoint() {
  const navTarget = useHudStore((s) => s.navTarget);
  const waypointDist = useHudStore((s) => s.waypointDist);
  const waypointDeg = useHudStore((s) => s.waypointDeg);
  if (!navTarget || waypointDist < 7) return null;
  return (
    <div id="waypoint" style={{ display: "flex" }}>
      <span className="arrow" style={{ color: navTarget.col, transform: `rotate(${waypointDeg}deg)` }}>
        ➤
      </span>
      <span className="lbl">{navTarget.name}</span>
      <span className="dist">{Math.round(waypointDist)}m</span>
    </div>
  );
}

function ClockDisplay() {
  const clock = useHudStore((s) => s.clock);
  return <div id="clock">{clock}</div>;
}

// DOM/CSS structure ported 1:1 from the original index.html's HUD (#hud,
// #speedo, #nitrobar, #hint, #msg, #camsel, #controls, #vig, #minimap,
// #waypoint, #mapscreen — see app/globals.css for the matching styles,
// copied from the original's <style> block). Not yet ported: #touch-controls
// (mobile — desktop parity first).
export function HUD() {
  const controlsVisible = useHudStore((s) => s.controlsVisible);
  const hint = useHudStore((s) => s.hint);
  const msg = useHudStore((s) => s.msg);
  const camMode = useHudStore((s) => s.camMode);
  const setCamMode = useHudStore((s) => s.setCamMode);
  const setMapOpen = useHudStore((s) => s.setMapOpen);
  const lookSensitivity = useHudStore((s) => s.lookSensitivity);
  const setLookSensitivity = useHudStore((s) => s.setLookSensitivity);

  return (
    <>
      <div id="hud">
        <div className="title">NEON CITY DRIVE</div>
        <ClockDisplay />
      </div>

      <Speedo />
      <NitroBar />
      <Waypoint />

      {hint && (
        <div id="hint" style={{ display: "block" }}>
          {hint}
        </div>
      )}

      <div id="msg" className={msg ? "show" : ""}>
        {msg}
      </div>

      <div id="camsel">
        {CAM_MODES.map((name, i) => (
          <button
            key={name}
            type="button"
            className={camMode === i ? "on" : ""}
            onClick={() => setCamMode(i as CamMode)}
          >
            {name}
          </button>
        ))}
      </div>

      <div id="sensitivity">
        <label htmlFor="sensSlider">LOOK SENS</label>
        <input
          id="sensSlider"
          type="range"
          min={0.4}
          max={2.5}
          step={0.05}
          value={lookSensitivity}
          onChange={(e) => setLookSensitivity(parseFloat(e.target.value))}
        />
        <span>{lookSensitivity.toFixed(2)}x</span>
      </div>

      <div id="controls" style={{ display: controlsVisible ? "block" : "none" }}>
        <b>W A S D</b> move / drive
        <br />
        <b>SPACE</b> handbrake
        <br />
        <b>SHIFT</b> nitro (car)
        <br />
        <b>F</b> fire main gun (tank)
        <br />
        <b>SPACE</b> jump (on foot)
        <br />
        <b>E</b> vehicle / club door
        <br />
        <b>B</b> switch vehicle
        <br />
        <b>CLICK</b> free-look camera
        <br />
        <b>C</b> camera view
        <br />
        <b>L</b> headlights auto/on/off
        <br />
        <b>M</b> mute engine
      </div>

      <div id="vig" />
      <div onClick={() => setMapOpen(true)}>
        <Minimap />
      </div>
      <div id="maphint">click map for directions</div>
      <BigMap />
    </>
  );
}
