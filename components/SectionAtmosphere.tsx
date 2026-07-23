'use client';

/**
 * SectionAtmosphere — renders a cinematic top-edge gradient wash for each
 * section that picks up the current theme accent colour via CSS variables.
 *
 * Usage: drop <SectionAtmosphere /> as the first child inside any section.
 * It sits at z-0 and is purely decorative / pointer-events-none.
 *
 * The gradient fades from the accent at the top edge inward, giving a
 * "light source" feel that reinforces the section's unique mood.
 */

export default function SectionAtmosphere() {
  return (
    <>
      {/* Top edge accent wash */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none z-0"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, var(--theme-accent) 30%, var(--theme-accent2) 70%, transparent 100%)',
          opacity: 0.4,
        }}
        aria-hidden="true"
      />
      {/* Top depth glow */}
      <div
        className="absolute inset-x-0 top-0 h-40 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 100% at 50% 0%, color-mix(in srgb, var(--theme-accent) 8%, transparent) 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />
    </>
  );
}
