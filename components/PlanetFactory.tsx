'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import type { SectionId } from '@/contexts/ThemeContext';

/* ─────────────────────────────────────────────
   PLANET DEFINITIONS
   Each planet has unique surface + atmosphere
───────────────────────────────────────────── */

export interface PlanetConfig {
  id: string;
  name: string;
  radius: number;
  segments: number;
  surfaceColor: THREE.Color;
  atmosphereColor: THREE.Color;
  atmosphereScale: number;
  atmosphereIntensity: number;
  specular: THREE.Color;
  shininess: number;
  rotationSpeed: number;
  glowColor: THREE.Color;
  glowScale: number;
}

const PLANET_CONFIGS: Record<SectionId, PlanetConfig> = {
  hero: {
    id: 'earth',
    name: 'Earth',
    radius: 1,
    segments: 64,
    surfaceColor: new THREE.Color(0x1a4a7a),
    atmosphereColor: new THREE.Color(0x60a5fa),
    atmosphereScale: 1.06,
    atmosphereIntensity: 1.2,
    specular: new THREE.Color(0x333344),
    shininess: 25,
    rotationSpeed: 0.002,
    glowColor: new THREE.Color(0x3b82f6),
    glowScale: 1.4,
  },
  services: {
    id: 'neptune',
    name: 'Neptune',
    radius: 1,
    segments: 64,
    surfaceColor: new THREE.Color(0x0e4a6e),
    atmosphereColor: new THREE.Color(0x22d3ee),
    atmosphereScale: 1.07,
    atmosphereIntensity: 1.4,
    specular: new THREE.Color(0x446688),
    shininess: 35,
    rotationSpeed: 0.003,
    glowColor: new THREE.Color(0x06b6d4),
    glowScale: 1.5,
  },
  solutions: {
    id: 'jupiter',
    name: 'Jupiter',
    radius: 1,
    segments: 64,
    surfaceColor: new THREE.Color(0x6b3a8a),
    atmosphereColor: new THREE.Color(0xc084fc),
    atmosphereScale: 1.05,
    atmosphereIntensity: 1.3,
    specular: new THREE.Color(0x554466),
    shininess: 20,
    rotationSpeed: 0.004,
    glowColor: new THREE.Color(0x8b5cf6),
    glowScale: 1.45,
  },
  why: {
    id: 'saturn',
    name: 'Saturn',
    radius: 1,
    segments: 64,
    surfaceColor: new THREE.Color(0x8a7a4a),
    atmosphereColor: new THREE.Color(0xfcd34d),
    atmosphereScale: 1.08,
    atmosphereIntensity: 1.6,
    specular: new THREE.Color(0x887744),
    shininess: 30,
    rotationSpeed: 0.0025,
    glowColor: new THREE.Color(0xf59e0b),
    glowScale: 1.6,
  },
  portfolio: {
    id: 'mars',
    name: 'Mars',
    radius: 1,
    segments: 64,
    surfaceColor: new THREE.Color(0x7a3a2a),
    atmosphereColor: new THREE.Color(0x10b981),
    atmosphereScale: 1.04,
    atmosphereIntensity: 1.0,
    specular: new THREE.Color(0x664433),
    shininess: 15,
    rotationSpeed: 0.0022,
    glowColor: new THREE.Color(0xef4444),
    glowScale: 1.35,
  },
  about: {
    id: 'titan',
    name: 'Titan',
    radius: 1,
    segments: 64,
    surfaceColor: new THREE.Color(0x8a5a2a),
    atmosphereColor: new THREE.Color(0xf59e0b),
    atmosphereScale: 1.12,
    atmosphereIntensity: 1.8,
    specular: new THREE.Color(0x997744),
    shininess: 10,
    rotationSpeed: 0.0018,
    glowColor: new THREE.Color(0xf59e0b),
    glowScale: 1.7,
  },
  testimonials: {
    id: 'io',
    name: 'Io',
    radius: 1,
    segments: 64,
    surfaceColor: new THREE.Color(0x4a6a2a),
    atmosphereColor: new THREE.Color(0x3b82f6),
    atmosphereScale: 1.05,
    atmosphereIntensity: 1.1,
    specular: new THREE.Color(0x556644),
    shininess: 20,
    rotationSpeed: 0.0035,
    glowColor: new THREE.Color(0x22c55e),
    glowScale: 1.4,
  },
  blog: {
    id: 'comet',
    name: 'Comet',
    radius: 1,
    segments: 48,
    surfaceColor: new THREE.Color(0x3a2a5a),
    atmosphereColor: new THREE.Color(0xec4899),
    atmosphereScale: 1.09,
    atmosphereIntensity: 1.5,
    specular: new THREE.Color(0x664488),
    shininess: 40,
    rotationSpeed: 0.001,
    glowColor: new THREE.Color(0xec4899),
    glowScale: 1.55,
  },
  contact: {
    id: 'earth-return',
    name: 'Earth',
    radius: 1,
    segments: 64,
    surfaceColor: new THREE.Color(0x1a4a7a),
    atmosphereColor: new THREE.Color(0x60a5fa),
    atmosphereScale: 1.06,
    atmosphereIntensity: 1.2,
    specular: new THREE.Color(0x333344),
    shininess: 25,
    rotationSpeed: 0.002,
    glowColor: new THREE.Color(0x3b82f6),
    glowScale: 1.4,
  },
};

/* ─────────────────────────────────────────────
   PROCEDURAL TEXTURE GENERATORS
───────────────────────────────────────────── */

function simplex2D(u: number, v: number): number {
  const hash = (x: number, y: number): number => {
    let h = x * 374761393 + y * 668265263;
    h = (h ^ (h >> 13)) * 1274126177;
    return (h ^ (h >> 16)) / 2147483647;
  };
  const ix = Math.floor(u);
  const iy = Math.floor(v);
  const fx = u - ix;
  const fy = v - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  return (
    (hash(ix, iy) * (1 - sx) + hash(ix + 1, iy) * sx) * (1 - sy) +
    (hash(ix, iy + 1) * (1 - sx) + hash(ix + 1, iy + 1) * sx) * sy
  );
}

function generateSurfaceTexture(config: PlanetConfig): THREE.CanvasTexture {
  const w = 2048;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  const baseR = config.surfaceColor.r * 255;
  const baseG = config.surfaceColor.g * 255;
  const baseB = config.surfaceColor.b * 255;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const v = y / h;
      const idx = (y * w + x) * 4;

      const n1 = simplex2D(u * 8, v * 8);
      const n2 = simplex2D(u * 16 + 50, v * 16 + 50) * 0.5;
      const n3 = simplex2D(u * 32 + 100, v * 32 + 100) * 0.25;
      const n = n1 * 0.6 + n2 * 0.3 + n3 * 0.1;

      const isGasGiant = ['jupiter', 'saturn', 'neptune'].includes(config.id);
      const bandEffect = isGasGiant
        ? Math.sin(v * Math.PI * 12 + n * 2) * 0.15
        : 0;

      const terrain = (n - 0.5) * 0.4 + bandEffect;

      const r = Math.max(0, Math.min(255, baseR + terrain * 80));
      const g = Math.max(0, Math.min(255, baseG + terrain * 60));
      const b = Math.max(0, Math.min(255, baseB + terrain * 50));

      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function generateBumpTexture(config: PlanetConfig): THREE.CanvasTexture {
  const w = 2048;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const v = y / h;
      const idx = (y * w + x) * 4;

      const n = simplex2D(u * 12, v * 12);
      const detail = simplex2D(u * 24 + 50, v * 24 + 50) * 0.3;
      const bump = Math.floor((n * 0.7 + detail) * 255);

      data[idx] = bump;
      data[idx + 1] = bump;
      data[idx + 2] = bump;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function generateCloudTexture(): THREE.CanvasTexture {
  const w = 1024;
  const h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const v = y / h;
      const idx = (y * w + x) * 4;

      const n = simplex2D(u * 6, v * 6);
      const n2 = simplex2D(u * 12 + 100, v * 12 + 100);
      const value = Math.max(0, (n * 0.6 + n2 * 0.4) * 1.2);

      data[idx] = 255;
      data[idx + 1] = 255;
      data[idx + 2] = 255;
      data[idx + 3] = Math.floor(value * 150);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/* ─────────────────────────────────────────────
   PLANET BUILDER
   Creates a Three.js Group with:
   - Surface sphere + bump map
   - Clouds
   - Atmosphere (enhanced Fresnel)
   - Outer glow shell
───────────────────────────────────────────── */

export function buildPlanet(sectionId: SectionId): THREE.Group {
  const config = PLANET_CONFIGS[sectionId];
  const group = new THREE.Group();

  /* Surface sphere */
  const surfaceGeo = new THREE.SphereGeometry(config.radius, config.segments, config.segments);
  const surfaceTex = generateSurfaceTexture(config);
  const bumpTex = generateBumpTexture(config);
  const surfaceMat = new THREE.MeshPhongMaterial({
    map: surfaceTex,
    bumpMap: bumpTex,
    bumpScale: 0.03,
    specular: config.specular,
    shininess: config.shininess,
  });
  const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);
  group.add(surfaceMesh);

  /* Clouds */
  const cloudTex = generateCloudTexture();
  const cloudGeo = new THREE.SphereGeometry(config.radius * 1.008, 48, 48);
  const cloudMat = new THREE.MeshPhongMaterial({
    map: cloudTex,
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
  group.add(cloudMesh);

  /* Atmosphere (enhanced multi-layer Fresnel) */
  const atmosGeo = new THREE.SphereGeometry(config.radius * config.atmosphereScale, 48, 48);
  const atmosMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: config.atmosphereColor },
      uIntensity: { value: config.atmosphereIntensity },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPositionW;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vPositionW = worldPos.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uIntensity;
      varying vec3 vNormal;
      varying vec3 vPositionW;
      void main() {
        vec3 viewDir = normalize(cameraPosition - vPositionW);
        float fresnel = 1.0 - max(0.0, dot(viewDir, vNormal));

        /* Multi-layer glow: tight inner + wide outer */
        float inner = pow(fresnel, 5.0) * 1.0;
        float mid = pow(fresnel, 2.5) * 0.5;
        float outer = pow(fresnel, 1.2) * 0.2;

        float breathe = 1.0 + 0.05 * sin(uTime * 0.6);
        vec3 color = mix(uColor, vec3(0.8, 0.9, 1.0), fresnel * 0.25);
        float alpha = (inner + mid + outer) * breathe * uIntensity * 0.45;

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
  group.add(atmosMesh);

  /* Outer glow shell — soft volumetric halo */
  const glowGeo = new THREE.SphereGeometry(config.radius * config.glowScale, 32, 32);
  const glowMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: config.glowColor },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPositionW;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vPositionW = worldPos.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec3 vNormal;
      varying vec3 vPositionW;
      void main() {
        vec3 viewDir = normalize(cameraPosition - vPositionW);
        float fresnel = 1.0 - max(0.0, dot(viewDir, vNormal));
        float glow = pow(fresnel, 1.5) * 0.4;
        float pulse = 1.0 + 0.08 * sin(uTime * 0.8);
        gl_FragColor = vec4(uColor, glow * pulse * 0.2);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  group.add(glowMesh);

  /* Store config for animation */
  group.userData.planetConfig = config;
  group.userData.sectionId = sectionId;

  return group;
}

/* ─────────────────────────────────────────────
   PLANET METADATA
───────────────────────────────────────────── */

export function getPlanetConfig(sectionId: SectionId): PlanetConfig {
  return PLANET_CONFIGS[sectionId];
}

export function getPlanetId(sectionId: SectionId): string {
  return PLANET_CONFIGS[sectionId].id;
}
