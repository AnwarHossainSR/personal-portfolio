/**
 * Sprite markup, as strings.
 *
 * Fills are bound to the design tokens in src/styles/tokens.css rather than to
 * hex, so one sprite set works on both the paper ground and the dark one. The
 * reference ships hard-coded hex here and gets away with it because that site
 * has a single theme; this one does not.
 */

export const ROCKET_SVG = `
<div class="arcade-car-inner">
	<svg viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<defs>
			<linearGradient id="arcade-rocket-body" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" stop-color="oklch(var(--color-accent))" />
				<stop offset="1" stop-color="oklch(var(--color-accent-deep))" />
			</linearGradient>
		</defs>
		<path d="M20 2C12 7 8 17 9 31L3 37l11-2c1 5 3 8 6 10 3-2 5-5 6-10l11 2-6-6c1-14-3-24-11-29Z" fill="url(#arcade-rocket-body)" stroke="oklch(var(--color-ink))" stroke-opacity="0.3" stroke-width="1" />
		<path d="M9 31 3 37l10-2M31 31l6 6-10-2" fill="oklch(var(--color-accent-deep))" stroke="oklch(var(--color-ink))" stroke-opacity="0.2" stroke-width="1" />
		<circle cx="20" cy="18" r="6.3" fill="oklch(var(--color-ink))" opacity="0.9" />
		<circle cx="20" cy="18" r="3.2" fill="oklch(var(--color-paper))" />
		<path d="M15 35c-.3 5 1.5 9 5 12 3.5-3 5.3-7 5-12-1.4 1.3-3 2-5 2s-3.6-.7-5-2Z" fill="oklch(var(--color-arcade-danger))" />
		<path d="M18 37c.2 3 1 5.2 2 7 1-1.8 1.8-4 2-7-.6.5-1.3.7-2 .7s-1.4-.2-2-.7Z" fill="oklch(var(--color-paper))" />
	</svg>
</div>`;

export const ENEMY_SVG = `
<svg class="arcade-enemy-svg" viewBox="0 0 24 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
	<ellipse cx="12" cy="24" rx="8" ry="2" fill="oklch(var(--color-ink))" opacity="0.12" />
	<rect x="3" y="18" width="3.4" height="4.6" rx="1.4" fill="oklch(var(--color-ink))" />
	<rect x="17.6" y="18" width="3.4" height="4.6" rx="1.4" fill="oklch(var(--color-ink))" />
	<rect x="2.6" y="2.5" width="18.8" height="22" rx="6" fill="oklch(var(--color-arcade-enemy))" stroke="oklch(var(--color-ink))" stroke-opacity="0.4" stroke-width="1" />
	<rect x="6" y="7.5" width="12" height="6" rx="2.5" fill="oklch(var(--color-surface-deep))" />
	<circle cx="8.5" cy="10.5" r="1.6" fill="oklch(var(--color-arcade-danger))" />
	<circle cx="15.5" cy="10.5" r="1.6" fill="oklch(var(--color-arcade-danger))" />
	<rect x="5.5" y="15" width="13" height="6.5" rx="2.5" fill="oklch(var(--color-arcade-danger))" />
	<rect x="0.5" y="4" width="2" height="4" rx="1" fill="oklch(var(--color-arcade-danger))" />
	<rect x="21.5" y="4" width="2" height="4" rx="1" fill="oklch(var(--color-arcade-danger))" />
</svg>`;
