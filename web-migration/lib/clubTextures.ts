// Canvas-baked textures for VENU's interior (components/ClubInterior.tsx) —
// same tex()/procedural-canvas idiom as lib/airportTextures.ts, drawn once at
// module load and shared by every material that wants them.
import * as THREE from "three";

function tex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// Neon 4-colour checker instead of a flat emissive white — ClubInterior.tsx
// still animates hue/intensity on top of this per frame, this just gives the
// floor actual pattern to shift underneath that animation.
const FLOOR_COLORS = ["#ff2f8a", "#2fe9ff", "#ffd12f", "#8a2fff"];
export const FLOOR_TEX = tex(64, 64, (g) => {
  const cell = 16;
  for (let y = 0; y < 64; y += cell) {
    for (let x = 0; x < 64; x += cell) {
      const i = ((x / cell + y / cell) % FLOOR_COLORS.length + FLOOR_COLORS.length) % FLOOR_COLORS.length;
      g.fillStyle = FLOOR_COLORS[i];
      g.fillRect(x, y, cell, cell);
    }
  }
});
FLOOR_TEX.repeat.set(7, 7); // set once here rather than a `map-repeat` JSX prop on the one material that uses it

// Three simple flat-graphic wall posters — no photo assets, just bold shapes
// in the club's neon palette (starburst / equalizer bars / silhouette).
export const POSTER_STARBURST = tex(128, 192, (g) => {
  g.fillStyle = "#12081c";
  g.fillRect(0, 0, 128, 192);
  g.strokeStyle = "#ff3fd6";
  g.lineWidth = 3;
  const cx = 64, cy = 90;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    g.beginPath();
    g.moveTo(cx, cy);
    g.lineTo(cx + Math.cos(a) * 70, cy + Math.sin(a) * 70);
    g.stroke();
  }
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.arc(cx, cy, 22, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#12081c";
  g.font = "bold 20px sans-serif";
  g.textAlign = "center";
  g.fillText("VENU", cx, cy + 7);
});

export const POSTER_EQUALIZER = tex(128, 192, (g) => {
  g.fillStyle = "#0a1830";
  g.fillRect(0, 0, 128, 192);
  const bars = 9;
  for (let i = 0; i < bars; i++) {
    const h = 30 + Math.abs(Math.sin(i * 1.7)) * 130;
    g.fillStyle = i % 2 === 0 ? "#2fe9ff" : "#ff3fd6";
    g.fillRect(10 + i * 13, 176 - h, 9, h);
  }
});

export const POSTER_SILHOUETTE = tex(128, 192, (g) => {
  const grad = g.createLinearGradient(0, 0, 0, 192);
  grad.addColorStop(0, "#3a0a4a");
  grad.addColorStop(1, "#0d0416");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 192);
  g.fillStyle = "#0d0416";
  g.beginPath();
  g.ellipse(64, 60, 14, 18, 0, 0, Math.PI * 2); // head
  g.fill();
  g.beginPath();
  g.moveTo(46, 76);
  g.quadraticCurveTo(64, 130, 40, 190); // dress silhouette, one side
  g.lineTo(88, 190);
  g.quadraticCurveTo(64, 130, 82, 76);
  g.closePath();
  g.fill();
  g.strokeStyle = "#ffd12f";
  g.lineWidth = 2;
  g.strokeRect(6, 6, 116, 180);
});

export const POSTERS = [POSTER_STARBURST, POSTER_EQUALIZER, POSTER_SILHOUETTE];
