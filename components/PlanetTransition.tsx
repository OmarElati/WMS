'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { buildPlanet, getPlanetConfig } from './PlanetFactory';
import type { SectionId } from '@/contexts/ThemeContext';

/* ─────────────────────────────────────────────
   TRANSITION STATE
───────────────────────────────────────────── */

export type TransitionState = 'idle' | 'zooming-out' | 'dissolving' | 'building' | 'zooming-in';

interface TransitionCallbacks {
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
}

/* ─────────────────────────────────────────────
   PLANET TRANSITION COMPONENT
   Manages switching between planet meshes
   with a cinematic morph+zoom animation.
───────────────────────────────────────────── */

interface PlanetTransitionProps {
  currentSectionId: SectionId;
  interactive: boolean;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  prefersReduced: boolean;
  callbacks?: TransitionCallbacks;
}

export default function PlanetTransition({
  currentSectionId,
  interactive,
  mouseRef,
  prefersReduced,
  callbacks,
}: PlanetTransitionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const currentPlanetRef = useRef<THREE.Group | null>(null);
  const nextPlanetRef = useRef<THREE.Group | null>(null);
  const transitionRef = useRef<gsap.core.Timeline | null>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentSectionRef = useRef<SectionId>(currentSectionId);
  const [isTransitioning, setIsTransitioning] = useState(false);

  /* Create initial planet */
  useEffect(() => {
    if (!groupRef.current) return;

    const planet = buildPlanet(currentSectionId);
    currentPlanetRef.current = planet;
    groupRef.current.add(planet);
    currentSectionRef.current = currentSectionId;

    return () => {
      if (transitionRef.current) {
        transitionRef.current.kill();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Handle section change */
  useEffect(() => {
    if (currentSectionId === currentSectionRef.current) return;
    if (isTransitioning) return;

    if (prefersReduced) {
      /* Instant swap for reduced motion */
      if (groupRef.current && currentPlanetRef.current) {
        groupRef.current.remove(currentPlanetRef.current);
        disposePlanet(currentPlanetRef.current);

        const newPlanet = buildPlanet(currentSectionId);
        currentPlanetRef.current = newPlanet;
        groupRef.current.add(newPlanet);
        currentSectionRef.current = currentSectionId;
      }
      return;
    }

    startTransition(currentSectionId);
  }, [currentSectionId, isTransitioning, prefersReduced]);

  /* Dispose old planet geometry/materials */
  const disposePlanet = useCallback((planet: THREE.Group) => {
    planet.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose();
        if (child.material) {
          const mat = child.material;
          if (mat instanceof THREE.Material) {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const m = mat as any;
            if (m.map && typeof m.map.dispose === 'function') m.map.dispose();
            if (m.bumpMap && typeof m.bumpMap.dispose === 'function') m.bumpMap.dispose();
            if (m.alphaMap && typeof m.alphaMap.dispose === 'function') m.alphaMap.dispose();
            /* eslint-enable @typescript-eslint/no-explicit-any */
            mat.dispose();
          }
        }
      }
    });
  }, []);

  /* Start transition animation */
  const startTransition = useCallback(
    (targetSectionId: SectionId) => {
      if (!groupRef.current) return;
      if (transitionRef.current) {
        transitionRef.current.kill();
      }

      setIsTransitioning(true);
      callbacks?.onTransitionStart?.();

      const tl = gsap.timeline({
        onComplete: () => {
          setIsTransitioning(false);
          callbacks?.onTransitionEnd?.();
        },
      });
      transitionRef.current = tl;

      const oldPlanet = currentPlanetRef.current;
      if (!oldPlanet) return;

      const newPlanet = buildPlanet(targetSectionId);
      newPlanet.scale.set(0.3, 0.3, 0.3);
      newPlanet.visible = false;
      groupRef.current.add(newPlanet);
      nextPlanetRef.current = newPlanet;

      /* Phase 1: Zoom out + old planet shrink (0.4s) */
      tl.to(
        oldPlanet.scale,
        {
          x: 0.3,
          y: 0.3,
          z: 0.3,
          duration: 0.4,
          ease: 'power2.in',
        },
        0,
      );

      tl.to(
        oldPlanet.position,
        {
          z: -0.5,
          duration: 0.4,
          ease: 'power2.in',
        },
        0,
      );

      /* Fade out old planet opacity */
      tl.to(
        oldPlanet,
        {
          duration: 0.3,
          onUpdate: function () {
            const progress = this.progress();
            oldPlanet.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhongMaterial) {
                child.material.transparent = true;
                child.material.opacity = 1 - progress;
              }
            });
          },
        },
        0,
      );

      /* Phase 2: New planet appears (0.5s) */
      tl.call(
        () => {
          oldPlanet.visible = false;
          newPlanet.visible = true;
        },
        undefined,
        0.4,
      );

      tl.to(
        newPlanet.scale,
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.5,
          ease: 'power2.out',
        },
        0.4,
      );

      tl.to(
        newPlanet.position,
        {
          z: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        0.4,
      );

      /* Fade in new planet */
      tl.to(
        newPlanet,
        {
          duration: 0.4,
          onUpdate: function () {
            const progress = this.progress();
            newPlanet.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhongMaterial) {
                child.material.transparent = true;
                child.material.opacity = progress;
              }
            });
          },
        },
        0.45,
      );

      /* Cleanup old planet */
      tl.call(
        () => {
          if (oldPlanet.parent) {
            oldPlanet.parent.remove(oldPlanet);
          }
          disposePlanet(oldPlanet);
          currentPlanetRef.current = newPlanet;
          nextPlanetRef.current = null;
          currentSectionRef.current = targetSectionId;
        },
        undefined,
        0.9,
      );
    },
    [callbacks, disposePlanet],
  );

  /* Mouse parallax + rotation */
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (isTransitioning) return;

    const planet = currentPlanetRef.current;
    if (!planet) return;

    if (interactive && !prefersReduced) {
      const mx = (mouseRef.current.x - 0.5) * 2;
      const my = (mouseRef.current.y - 0.5) * -2;

      targetX.current += (mx * 0.15 - targetX.current) * 0.03;
      targetY.current += (my * 0.15 - targetY.current) * 0.03;

      groupRef.current.rotation.x = targetY.current;
      groupRef.current.rotation.y += 0.001 * 0.6 + targetX.current * 0.002;
    } else if (!prefersReduced) {
      groupRef.current.rotation.y += 0.001 * 0.6;
    }

    /* Update atmosphere shader time */
    planet.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
        if (child.material.uniforms.uTime) {
          child.material.uniforms.uTime.value += delta;
        }
      }
    });
  });

  return <group ref={groupRef} />;
}

/* ─────────────────────────────────────────────
   EXPORTS
───────────────────────────────────────────── */
