import type { Config } from "tailwindcss";
import tailwindCssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				paper: "oklch(var(--color-paper) / <alpha-value>)",
				surface: "oklch(var(--color-surface) / <alpha-value>)",
				"surface-deep": "oklch(var(--color-surface-deep) / <alpha-value>)",
				ink: "oklch(var(--color-ink) / <alpha-value>)",
				faint: "oklch(var(--color-faint) / <alpha-value>)",
				line: "oklch(var(--color-line) / <alpha-value>)",
				// shadcn compatibility bridge (src/styles/tokens.css). `accent`
				// collides with the warm palette's single-colour entry above:
				// resolved by making it an object whose DEFAULT is the exact same
				// warm var, so `bg-accent`/`text-accent` keep resolving to the
				// identical warm colour, while `-foreground` adds the shadcn
				// pairing on top. Pruned to just what button.tsx (the last
				// surviving ui/* component) still references — no `foreground`,
				// `popover`, `border`, or a `muted.foreground` pairing.
				background: "oklch(var(--background) / <alpha-value>)",
				primary: {
					DEFAULT: "oklch(var(--primary) / <alpha-value>)",
					foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
				},
				secondary: {
					DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
					foreground: "oklch(var(--secondary-foreground) / <alpha-value>)",
				},
				muted: "oklch(var(--color-muted) / <alpha-value>)",
				accent: {
					DEFAULT: "oklch(var(--color-accent) / <alpha-value>)",
					foreground: "oklch(var(--accent-foreground) / <alpha-value>)",
				},
				destructive: {
					DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
					foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
				},
				input: "oklch(var(--input) / <alpha-value>)",
				ring: "oklch(var(--ring) / <alpha-value>)",
			},
			fontFamily: {
				display: ["Newsreader", "Georgia", "Times New Roman", "serif"],
				sans: ["Hind Siliguri", "system-ui", "-apple-system", "sans-serif"],
				mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
			},
			transitionTimingFunction: {
				smooth: "var(--curve-smooth)",
				bounce: "var(--curve-bounce)",
				elastic: "var(--curve-elastic)",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: {
						height: "0",
					},
					to: {
						height: "var(--radix-accordion-content-height)",
					},
				},
				"accordion-up": {
					from: {
						height: "var(--radix-accordion-content-height)",
					},
					to: {
						height: "0",
					},
				},
				"slide-in-up": {
					from: {
						opacity: "0",
						transform: "translateY(30px)",
					},
					to: {
						opacity: "1",
						transform: "translateY(0)",
					},
				},
				"fade-in-scale": {
					from: {
						opacity: "0",
						transform: "scale(0.95)",
					},
					to: {
						opacity: "1",
						transform: "scale(1)",
					},
				},
				"glow-pulse": {
					"0%, 100%": {
						opacity: "1",
					},
					"50%": {
						opacity: "0.5",
					},
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"slide-in-up": "slide-in-up 0.6s ease-out",
				"fade-in-scale": "fade-in-scale 0.5s ease-out",
				"glow-pulse": "glow-pulse 2s ease-in-out infinite",
			},
		},
	},
	plugins: [tailwindCssAnimate],
} satisfies Config;
