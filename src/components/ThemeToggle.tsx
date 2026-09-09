import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={toggleTheme}
			className="relative w-10 h-10 rounded border border-line bg-surface backdrop-blur-sm hover:bg-surface-deep hover:text-ink transition-all duration-300"
			aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
		>
			<Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
		</Button>
	);
}
