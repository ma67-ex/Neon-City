"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useHudStore } from "@/lib/hudStore";
import { worldState } from "@/lib/worldState";
import { weatherState, pickWeather } from "@/lib/weatherState";
import { coatScene, weatherCoatUniforms } from "@/lib/weatherCoat";
import { requestPlayerTeleport } from "@/lib/playerTeleport";
import { vehicleState } from "@/lib/vehicleState";
if (typeof window !== "undefined") {
  (window as unknown as { __ncdTp: typeof requestPlayerTeleport }).__ncdTp = requestPlayerTeleport;
  (window as unknown as { __ncdVeh: typeof vehicleState }).__ncdVeh = vehicleState;
}

// Rendered after <SkyCycle/> in Game.tsx so this useFrame runs after its
// day/night one each frame: SkyCycle owns scene.fog's base color/near/far off
// day/night, this component blends weather on top of that SAME scene.fog
// object afterward (near/far target + a grey tint), rather than merging into
// SkyCycle — weather is an independent, randomly-timed system layered on a
// clock-driven one, and keeping them in separate files matches how the
// original also kept updateDayNight()/updateWeather() as two functions that
// both just happen to write the same scene.fog.

// original's rainTex: an 8x64 vertical soft gradient billboard (index.html ~3656)
const rainCanvas = document.createElement("canvas");
rainCanvas.width = 8;
rainCanvas.height = 64;
const rg = rainCanvas.getContext("2d")!;
const grad = rg.createLinearGradient(0, 0, 0, 64);
grad.addColorStop(0, "rgba(200,225,255,0)");
grad.addColorStop(0.5, "rgba(200,225,255,.9)");
grad.addColorStop(1, "rgba(200,225,255,0)");
rg.fillStyle = grad;
rg.fillRect(0, 0, 8, 64);
const rainTex = new THREE.CanvasTexture(rainCanvas);

const RAIN_N = 500;
const rainY = new Float32Array(RAIN_N);
// same imperative BufferGeometry-at-module-scope idiom as MizuRestaurant.tsx's
// GABLE_ROOF_GEO — plugged into <points geometry={...}> below rather than JSX
// bufferAttribute children
const rainGeo = (() => {
  const pos = new Float32Array(RAIN_N * 3);
  for (let i = 0; i < RAIN_N; i++) {
    pos[i * 3] = (Math.random() * 2 - 1) * 55;
    pos[i * 3 + 1] = rainY[i] = Math.random() * 40;
    pos[i * 3 + 2] = (Math.random() * 2 - 1) * 55;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return g;
})();

// snow: soft round dot (vs rain's vertical streak), same procedural-canvas-
// texture idiom as rainTex above — ported the visual idea from
// rauschermate/react-weather-effects' SnowEffect, not its full custom GLSL
// shader (that demo's per-flake rotation/distortion/flip is built for a
// static-camera page where snow IS the content; here it's ambient weather
// glimpsed while driving, so the existing rain Points/PointsMaterial pattern
// already covers it for a fraction of the code).
const snowCanvas = document.createElement("canvas");
snowCanvas.width = snowCanvas.height = 32;
const sg = snowCanvas.getContext("2d")!;
const srad = sg.createRadialGradient(16, 16, 0, 16, 16, 16);
srad.addColorStop(0, "rgba(255,255,255,.95)");
srad.addColorStop(1, "rgba(255,255,255,0)");
sg.fillStyle = srad;
sg.fillRect(0, 0, 32, 32);
const snowTex = new THREE.CanvasTexture(snowCanvas);

const SNOW_N = 400;
const snowY = new Float32Array(SNOW_N);
const snowBaseX = new Float32Array(SNOW_N);
const snowBaseZ = new Float32Array(SNOW_N);
const snowPhase = new Float32Array(SNOW_N);
const snowGeo = (() => {
  const pos = new Float32Array(SNOW_N * 3);
  for (let i = 0; i < SNOW_N; i++) {
    pos[i * 3] = snowBaseX[i] = (Math.random() * 2 - 1) * 55;
    pos[i * 3 + 1] = snowY[i] = Math.random() * 40;
    pos[i * 3 + 2] = snowBaseZ[i] = (Math.random() * 2 - 1) * 55;
    snowPhase[i] = Math.random() * Math.PI * 2;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return g;
})();

const cGrey = new THREE.Color(0x8a94a0);
const tmpColor = new THREE.Color();

export function Weather() {
  const { scene } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const snowPointsRef = useRef<THREE.Points>(null);
  const snowMaterialRef = useRef<THREE.PointsMaterial>(null);
  const clockRef = useRef(0);
  // re-scan periodically (not once) so buildings/props/traffic streamed in
  // after mount (this is a chunk-streamed open world) still get coated
  const coatScanRef = useRef(0);

  // imperatively mutating scene.fog/background/hemi here every frame is the
  // documented R3F pattern (see SkyCycle.tsx's own useFrame, same rationale)
  // eslint-disable-next-line react-hooks/immutability
  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const mat = materialRef.current;
    const pts = pointsRef.current;
    if (!mat || !pts || !scene.fog) return;

    if (useHudStore.getState().inClub) {
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0, Math.min(1, dt * 3));
      weatherState.wetGrip = THREE.MathUtils.lerp(weatherState.wetGrip, 1, dt);
      return;
    }

    weatherState.timer -= dt;
    if (weatherState.timer <= 0) {
      const nw = pickWeather();
      if (nw !== weatherState.kind) {
        weatherState.kind = nw;
        useHudStore.getState().showMsg("WEATHER: " + weatherState.kind.toUpperCase());
      }
      weatherState.timer = 100 + Math.random() * 100;
    }

    const isRain = weatherState.kind === "rain";
    const isFog = weatherState.kind === "fog";
    const isOver = weatherState.kind === "overcast";
    const isSnow = weatherState.kind === "snow";

    const tgtNear = isFog ? 18 : isSnow ? 40 : isRain ? 55 : isOver ? 95 : 110;
    const tgtFar = isFog ? 95 : isSnow ? 150 : isRain ? 210 : isOver ? 320 : 430;
    const fog = scene.fog as THREE.Fog;
    // eslint-disable-next-line react-hooks/immutability -- see note above useFrame
    fog.near = THREE.MathUtils.lerp(fog.near, tgtNear, Math.min(1, dt * 0.5));
    fog.far = THREE.MathUtils.lerp(fog.far, tgtFar, Math.min(1, dt * 0.5));

    const greyK = isFog ? 0.55 : isSnow ? 0.45 : isRain ? 0.4 : isOver ? 0.3 : 0;
    if (greyK > 0) {
      tmpColor.copy(fog.color).lerp(cGrey, greyK * 0.5);
      fog.color.copy(tmpColor);
      if (scene.background instanceof THREE.Color) scene.background.copy(tmpColor);
      // hemi dimming matches the original's `hemi.intensity*=1-greyK*0.35`,
      // applied after SkyCycle's own per-frame hemi.intensity set — no ref
      // plumbing needed for a light SkyCycle already owns, a scene lookup for
      // the one hemisphere light is cheap and keeps the two files decoupled
      const hemi = scene.getObjectByProperty("type", "HemisphereLight") as THREE.HemisphereLight | undefined;
      if (hemi) hemi.intensity *= 1 - greyK * 0.35;
    }

    const rainTarget = isRain ? 0.55 : 0;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, rainTarget, Math.min(1, dt * 3));
    if (mat.opacity > 0.01) {
      pts.position.set(worldState.px, 0, worldState.pz);
      const posAttr = pts.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < RAIN_N; i++) {
        rainY[i] -= dt * 48;
        if (rainY[i] < 0) rainY[i] += 40;
        posAttr.setY(i, rainY[i]);
      }
      posAttr.needsUpdate = true;
    }

    const snowMat = snowMaterialRef.current;
    const snowPts = snowPointsRef.current;
    if (snowMat && snowPts) {
      clockRef.current += dt;
      const t = clockRef.current;
      const snowTarget = isSnow ? 0.6 : 0;
      snowMat.opacity = THREE.MathUtils.lerp(snowMat.opacity, snowTarget, Math.min(1, dt * 3));
      if (snowMat.opacity > 0.01) {
        snowPts.position.set(worldState.px, 0, worldState.pz);
        const posAttr = snowPts.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < SNOW_N; i++) {
          snowY[i] -= dt * 10; // slower fall + sway vs rain's straight-down streak
          if (snowY[i] < 0) snowY[i] += 40;
          posAttr.setX(i, snowBaseX[i] + Math.sin(t * 0.6 + snowPhase[i]) * 1.5);
          posAttr.setY(i, snowY[i]);
          posAttr.setZ(i, snowBaseZ[i] + Math.cos(t * 0.5 + snowPhase[i]) * 1.5);
        }
        posAttr.needsUpdate = true;
      }
    }

    // snow packs the road tighter than rain wets it — lower grip target
    weatherState.wetGrip = THREE.MathUtils.lerp(
      weatherState.wetGrip,
      isRain ? 0.8 : isSnow ? 0.6 : 1,
      Math.min(1, dt * 0.8)
    );

    // ground/car-roof/tree-top/building-top wet & snow-coat shader — slow
    // ramp (~3s) so accumulation reads as gradual, not a hard cut
    weatherCoatUniforms.uSnowAmount.value = THREE.MathUtils.lerp(
      weatherCoatUniforms.uSnowAmount.value,
      isSnow ? 1 : 0,
      Math.min(1, dt * 0.3)
    );
    weatherCoatUniforms.uWetAmount.value = THREE.MathUtils.lerp(
      weatherCoatUniforms.uWetAmount.value,
      isRain ? 1 : 0,
      Math.min(1, dt * 0.3)
    );
    coatScanRef.current -= dt;
    if (coatScanRef.current <= 0) {
      coatScene(scene);
      coatScanRef.current = 2;
    }
  });

  return (
    <>
    <points ref={pointsRef} geometry={rainGeo}>
      <pointsMaterial
        ref={materialRef}
        color={0xaad4ff}
        size={0.5}
        map={rainTex}
        transparent
        opacity={0}
        fog={false}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
    <points ref={snowPointsRef} geometry={snowGeo}>
      <pointsMaterial
        ref={snowMaterialRef}
        color={0xffffff}
        size={0.6}
        map={snowTex}
        transparent
        opacity={0}
        fog={false}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
    </>
  );
}
