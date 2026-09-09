import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
const THEME_DEFAULT_VERSION = "light-v1";

export function useTheme() {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window !== "undefined") {
			if (
				localStorage.getItem("theme-default-version") !== THEME_DEFAULT_VERSION
			) {
				localStorage.setItem("theme", "light");
				localStorage.setItem("theme-default-version", THEME_DEFAULT_VERSION);
				return "light";
			}

			return (localStorage.getItem("theme") as Theme) || "light";
		}
		return "light";
	});

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";
			root.classList.add(systemTheme);
		} else {
			root.classList.add(theme);
		}
	}, [theme]);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		localStorage.setItem("theme-default-version", THEME_DEFAULT_VERSION);
	};

	return {
		theme,
		setTheme: (theme: Theme) => {
			setTheme(theme);
			localStorage.setItem("theme", theme);
			localStorage.setItem("theme-default-version", THEME_DEFAULT_VERSION);
		},
		toggleTheme,
	};
}
