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
				paper: "var(--color-paper)",
				surface: "var(--color-surface)",
				"surface-deep": "var(--color-surface-deep)",
				ink: "var(--color-ink)",
				muted: "var(--color-muted)",
				faint: "var(--color-faint)",
				line: "var(--color-line)",
				accent: "var(--color-accent)",
			},
			fontFamily: {
				sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
				display: ["Newsreader", "Georgia", "serif"],
				mono: ["JetBrains Mono", "ui-monospace", "monospace"],
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
