import * as THREE from "three";

// Shared by Weather.tsx: rather than touching every material-creation site
// across City.tsx/Props.tsx/Buildings.tsx/Car.tsx/etc individually, this
// patches whatever MeshStandardMaterial it's given with a shader chunk that
// reads two uniforms Weather.tsx updates once per frame. Same object
// references are handed to every patched material's `shader.uniforms`, so
// mutating `.value` here updates every coated surface in the scene at once.
export const weatherCoatUniforms = {
  uSnowAmount: { value: 0 },
  uWetAmount: { value: 0 },
};

const TAG = "weatherCoated";

// World-space "how much does this fragment face up" test, not view-space —
// the game only ever yaws props/vehicles around Y but lays the ground/water
// planes flat via an X rotation, so a view- or object-space normal.y would
// read wrong for one of those two cases. Re-derives the instancing
// normalization THREE's own <defaultnormal_vertex> does (for InstancedMesh
// buildings, see Buildings.tsx) but stops before that chunk's normalMatrix
// (view-space) step and applies modelMatrix instead.
const VERTEX_INJECT = `
  vec3 wcNormal = objectNormal;
  #ifdef USE_INSTANCING
    mat3 wcIm = mat3( instanceMatrix );
    wcNormal /= vec3( dot( wcIm[ 0 ], wcIm[ 0 ] ), dot( wcIm[ 1 ], wcIm[ 1 ] ), dot( wcIm[ 2 ], wcIm[ 2 ] ) );
    wcNormal = wcIm * wcNormal;
  #endif
  vUpFacing = normalize( ( modelMatrix * vec4( wcNormal, 0.0 ) ).xyz ).y;
`;

/** Idempotent — safe to call every time a material is seen during a scene scan. */
export function coatMaterial(material: THREE.Material): void {
  if (!(material instanceof THREE.MeshStandardMaterial)) return;
  if (material.userData[TAG]) return;
  material.userData[TAG] = true;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uSnowAmount = weatherCoatUniforms.uSnowAmount;
    shader.uniforms.uWetAmount = weatherCoatUniforms.uWetAmount;

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vUpFacing;")
      .replace("#include <beginnormal_vertex>", "#include <beginnormal_vertex>\n" + VERTEX_INJECT);

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying float vUpFacing;\nuniform float uSnowAmount;\nuniform float uWetAmount;"
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        {
          // gated to upward-facing fragments like snow — water pools on the
          // ground/rooftops, it doesn't uniformly darken every wall
          float upMask = smoothstep(0.35, 0.75, vUpFacing);
          float snowMask = upMask * uSnowAmount;
          float wetMask = upMask * uWetAmount;
          diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 0.35, wetMask);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.94, 0.96, 1.0), snowMask);
        }`
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        {
          float upMask = smoothstep(0.35, 0.75, vUpFacing);
          roughnessFactor = mix(roughnessFactor, 0.02, upMask * uWetAmount);
          roughnessFactor = mix(roughnessFactor, 0.85, upMask * uSnowAmount);
        }`
      );
  };
  material.needsUpdate = true;
}

/** Walks the scene graph and coats every MeshStandardMaterial found (already-coated
 * ones are skipped via the tag above, so re-running this to catch newly streamed-in
 * chunks is cheap). */
export function coatScene(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mat = mesh.material;
    if (Array.isArray(mat)) mat.forEach(coatMaterial);
    else if (mat) coatMaterial(mat);
  });
}
