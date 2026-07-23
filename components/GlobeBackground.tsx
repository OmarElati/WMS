'use client';

import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';
import PlanetTransition from './PlanetTransition';

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const STAR_COUNT = 2000;
const STAR_RADIUS = 80;
const STAR_DEPTH = 200;

/* ─────────────────────────────────────────────
   STARS
───────────────────────────────────────────── */

function Stars() {
  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const siz = new Float32Array(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT; i++) {
      const radius = STAR_RADIUS + Math.random() * STAR_DEPTH;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
      siz[i] = 0.15 + Math.random() * 0.6;
    }
    return [pos, siz];
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.4}
        color="#ffffff"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─────────────────────────────────────────────
   GOD RAYS — Enhanced directional volumetric beam
   Wider, brighter, more cinematic light rays
───────────────────────────────────────────── */

function GodRays({ intensity }: { intensity: number }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uIntensity: { value: intensity },
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0x93c5fd) },
          uColorWarm: { value: new THREE.Color(0xfde68a) },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uIntensity;
          uniform float uTime;
          uniform vec3 uColor;
          uniform vec3 uColorWarm;
          varying vec2 vUv;

          float hash(vec2 p) {
            p = fract(p * vec2(123.34, 456.21));
            p += dot(p, p + 45.32);
            return fract(p.x * p.y);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
          }

          void main() {
            vec2 uv = vUv - 0.5;
            float dist = length(uv);

            /* Light source — upper right */
            vec2 lightOrigin = vec2(0.3, 0.2);
            vec2 toLight = lightOrigin - uv;
            float lightDist = length(toLight);

            /* Directional falloff */
            float dirFalloff = pow(max(0.0, 1.0 - lightDist * 1.0), 2.5);

            /* Multiple ray layers for depth */
            float angle = atan(uv.y - lightOrigin.y, uv.x - lightOrigin.x);
            float ray1 = pow(max(0.0, cos(angle * 4.0 + noise(vec2(angle * 2.0 + uTime * 0.12, dist * 1.5)) * 2.0)), 8.0);
            float ray2 = pow(max(0.0, cos(angle * 7.0 - noise(vec2(angle * 4.0 - uTime * 0.08, dist * 2.5)) * 2.5)), 12.0);
            float ray3 = pow(max(0.0, cos(angle * 11.0 + uTime * 0.04)), 18.0) * 0.5;
            float ray4 = pow(max(0.0, cos(angle * 17.0 - uTime * 0.06 + noise(vec2(angle, dist * 4.0)) * 1.5)), 24.0) * 0.3;

            float rays = (ray1 * 0.4 + ray2 * 0.25 + ray3 * 0.2 + ray4 * 0.15) * dirFalloff;

            /* Soft outer falloff — wider spread */
            float outerFalloff = 1.0 - smoothstep(0.0, 0.6, dist);
            outerFalloff = pow(outerFalloff, 1.5);

            /* Inner occlusion — planet blocks center */
            float occlusion = 1.0 - pow(max(0.0, 1.0 - dist * 2.5), 3.5);

            float alpha = rays * outerFalloff * occlusion * uIntensity;

            /* Color blend — warm near light, cool at edges */
            float warmMix = pow(max(0.0, 1.0 - dist * 2.0), 2.0);
            vec3 color = mix(uColor, uColorWarm, warmMix * 0.4);

            gl_FragColor = vec4(color, alpha * 0.5);
          }
        `,
        transparent: true,
        side: THREE.FrontSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useEffect(() => {
    material.uniforms.uIntensity.value = intensity;
  }, [intensity, material]);

  useFrame((_, delta) => {
    material.uniforms.uTime.value += delta;
  });

  return (
    <mesh position={[0, 0, -3]} scale={[10, 10, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/* ─────────────────────────────────────────────
   LENS FLARE — Enhanced, reactive to rotation
───────────────────────────────────────────── */

function LensFlare({ intensity }: { intensity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uIntensity: { value: intensity },
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0xbfdbfe) },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uIntensity;
          uniform float uTime;
          uniform vec3 uColor;
          varying vec2 vUv;

          void main() {
            vec2 center = vUv - 0.5;
            float dist = length(center);

            /* Bright core */
            float core = pow(max(0.0, 1.0 - dist * 8.0), 12.0);
            /* Soft halo */
            float halo = pow(max(0.0, 1.0 - dist * 3.5), 5.0) * 0.3;
            /* Outer glow */
            float glow = pow(max(0.0, 1.0 - dist * 2.0), 3.0) * 0.08;

            vec2 dir = center / max(dist, 0.001);
            /* 4-point star spikes */
            float spikes = pow(max(0.0, 1.0 - abs(dot(dir, vec2(1.0, 0.0))) * 12.0), 16.0);
            spikes += pow(max(0.0, 1.0 - abs(dot(dir, vec2(0.0, 1.0))) * 12.0), 16.0);
            /* Diagonal spikes */
            spikes += pow(max(0.0, 1.0 - abs(dot(dir, vec2(0.707, 0.707))) * 14.0), 20.0) * 0.5;
            spikes += pow(max(0.0, 1.0 - abs(dot(dir, vec2(-0.707, 0.707))) * 14.0), 20.0) * 0.5;

            float alpha = (core + halo + glow + spikes * 0.2) * uIntensity;
            gl_FragColor = vec4(uColor, alpha * 0.6);
          }
        `,
        transparent: true,
        side: THREE.FrontSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useEffect(() => {
    material.uniforms.uIntensity.value = intensity;
  }, [intensity, material]);

  useFrame((state, delta) => {
    material.uniforms.uTime.value += delta;
    if (meshRef.current) {
      const t = state.clock.getElapsedTime() * 0.12;
      meshRef.current.position.set(
        Math.cos(t) * 1.2,
        Math.sin(t) * 0.7,
        1.4 + Math.sin(t * 0.6) * 0.2,
      );
    }
  });

  return (
    <mesh ref={meshRef} position={[1.2, 0.5, 1.4]} scale={[1.0, 1.0, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/* ─────────────────────────────────────────────
   GLOBE SCENE — Dynamic planet switching
───────────────────────────────────────────── */

interface GlobeSceneProps {
  glowIntensity: number;
  interactive: boolean;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  prefersReduced: boolean;
}

function GlobeScene({ glowIntensity, interactive, mouseRef, prefersReduced }: GlobeSceneProps) {
  const { currentTheme } = useTheme();

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[8, 5, 8]} intensity={2.8} color="#ffffff" />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#4488ff" />
      <directionalLight position={[0, 8, 2]} intensity={0.6} color="#ffd4a0" />

      <PlanetTransition
        currentSectionId={currentTheme.id}
        interactive={interactive}
        mouseRef={mouseRef}
        prefersReduced={prefersReduced}
      />

      <LensFlare intensity={glowIntensity} />
      <Stars />
      <GodRays intensity={glowIntensity} />
    </>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORTED COMPONENT
───────────────────────────────────────────── */

interface GlobeBackgroundProps {
  glowIntensity?: number;
  interactive?: boolean;
  className?: string;
}

export default function GlobeBackground({
  glowIntensity = 1,
  interactive = true,
  className = 'absolute inset-0 z-0 pointer-events-none overflow-hidden',
}: GlobeBackgroundProps) {
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (!interactive) return;
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [interactive]);

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45, near: 0.1, far: 1000 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <GlobeScene
            glowIntensity={glowIntensity}
            interactive={interactive}
            mouseRef={mouseRef}
            prefersReduced={prefersReduced.current}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
