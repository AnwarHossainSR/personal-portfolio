import {
	ArrowRight,
	AtSign,
	Copy,
	FileText,
	Github,
	Hash,
	Linkedin,
	type LucideIcon,
	Moon,
	Search,
	SquareTerminal,
	Sun,
} from "lucide-react";
import {
	type KeyboardEvent,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { SECTIONS } from "@/components/AnchorNav";
import { caseStudies } from "@/content/case-studies";
import { profile } from "@/data/profile";
import { resolveTheme, toggleTheme, useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const SOURCE_URL = "https://github.com/AnwarHossainSR/personal-portfolio";

type Group = "Navigate" | "Case studies" | "Links" | "Actions";
const GROUP_ORDER: Group[] = ["Navigate", "Case studies", "Links", "Actions"];

interface Command {
	id: string;
	group: Group;
	label: string;
	hint?: string;
	/** Extra words the filter should match that the label does not show. */
	keywords?: string;
	icon: LucideIcon;
	run: () => void;
}

const LINK_ICONS: Record<string, LucideIcon> = {
	GitHub: Github,
	LinkedIn: Linkedin,
};

function openExternal(href: string) {
	window.open(href, "_blank", "noopener,noreferrer");
}

/** Every whitespace-separated word must appear somewhere in the command. */
function matches(command: Command, query: string): boolean {
	const haystack =
		`${command.label} ${command.hint ?? ""} ${command.keywords ?? ""} ${command.group}`.toLowerCase();
	return query
		.toLowerCase()
		.split(/\s+/)
		.filter(Boolean)
		.every((word) => haystack.includes(word));
}

/**
 * Jump to any section, case study, link or action from the keyboard.
 *
 * A native <dialog> opened with showModal(): the browser supplies the top
 * layer (so it sits above the arcade overlay without a z-index arms race),
 * makes the rest of the page inert, and turns Escape into a `cancel` event.
 * The list is the ARIA combobox pattern — focus never leaves the input, and
 * the active option is announced through aria-activedescendant.
 */
export default function CommandPalette({ onClose }: { onClose: () => void }) {
	const navigate = useNavigate();
	const { theme } = useTheme();
	const dialogRef = useRef<HTMLDialogElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const listId = useId();
	const [query, setQuery] = useState("");
	const [active, setActive] = useState(0);
	const [copied, setCopied] = useState(false);

	const commands = useMemo<Command[]>(() => {
		const nextTheme = resolveTheme(theme) === "light" ? "dark" : "light";
		return [
			...SECTIONS.map((section) => ({
				id: `section-${section.id}`,
				group: "Navigate" as const,
				label: section.label,
				hint: `#${section.id}`,
				icon: Hash,
				run: () => navigate({ pathname: "/", hash: section.id }),
			})),
			...caseStudies.map((study) => ({
				id: `study-${study.slug}`,
				group: "Case studies" as const,
				label: study.title,
				hint: study.domain,
				keywords: `${study.organisation} ${study.stack.join(" ")}`,
				icon: ArrowRight,
				run: () => navigate(`/work/${study.slug}`),
			})),
			{
				id: "link-resume",
				group: "Links" as const,
				label: "Résumé",
				hint: "PDF",
				keywords: "resume cv",
				icon: FileText,
				run: () => openExternal(profile.resumePath),
			},
			...profile.links.map((link) => ({
				id: `link-${link.label.toLowerCase()}`,
				group: "Links" as const,
				label: link.label,
				hint: link.href.replace(/^https:\/\/(www\.)?/, ""),
				icon: LINK_ICONS[link.label] ?? ArrowRight,
				run: () => openExternal(link.href),
			})),
			{
				id: "link-source",
				group: "Links" as const,
				label: "Source code for this site",
				hint: "GitHub",
				keywords: "repository code",
				icon: SquareTerminal,
				run: () => openExternal(SOURCE_URL),
			},
			{
				id: "action-email",
				group: "Actions" as const,
				label: "Write an email",
				hint: profile.email,
				keywords: "contact mail hire",
				icon: AtSign,
				run: () => {
					window.location.href = `mailto:${profile.email}`;
				},
			},
			{
				id: "action-copy-email",
				group: "Actions" as const,
				label: "Copy email address",
				hint: profile.email,
				keywords: "contact clipboard",
				icon: Copy,
				run: () => {
					void navigator.clipboard?.writeText(profile.email);
					setCopied(true);
				},
			},
			{
				id: "action-theme",
				group: "Actions" as const,
				label: `Switch to ${nextTheme} theme`,
				keywords: "appearance mode colour color",
				icon: nextTheme === "light" ? Sun : Moon,
				run: toggleTheme,
			},
		];
	}, [navigate, theme]);

	const filtered = useMemo(
		() => commands.filter((command) => matches(command, query)),
		[commands, query],
	);

	const grouped = GROUP_ORDER.map((group) => ({
		group,
		items: filtered.filter((command) => command.group === group),
	})).filter(({ items }) => items.length > 0);

	// Flattened in display order, which is not filter order once grouped.
	const ordered = grouped.flatMap(({ items }) => items);
	const activeCommand = ordered[Math.min(active, ordered.length - 1)];

	useEffect(() => {
		const dialog = dialogRef.current;
		const returnFocus =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;
		if (dialog && typeof dialog.showModal === "function" && !dialog.open) {
			dialog.showModal();
		} else {
			dialog?.setAttribute("open", "");
		}
		inputRef.current?.focus();
		return () => {
			returnFocus?.focus();
		};
	}, []);

	useEffect(() => {
		document
			.getElementById(`${listId}-${activeCommand?.id}`)
			?.scrollIntoView?.({ block: "nearest" });
	}, [activeCommand, listId]);

	const runCommand = (command: Command | undefined) => {
		if (!command) return;
		command.run();
		// Copying keeps the palette open long enough to say it worked.
		if (command.id === "action-copy-email") {
			window.setTimeout(onClose, 700);
			return;
		}
		onClose();
	};

	const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			if (ordered.length === 0) return;
			const step = event.key === "ArrowDown" ? 1 : -1;
			setActive((index) => (index + step + ordered.length) % ordered.length);
		} else if (event.key === "Home") {
			event.preventDefault();
			setActive(0);
		} else if (event.key === "End") {
			event.preventDefault();
			setActive(Math.max(0, ordered.length - 1));
		} else if (event.key === "Enter") {
			event.preventDefault();
			runCommand(activeCommand);
		} else if (event.key === "Escape") {
			// Handled here as well as by the dialog's cancel event, and
			// stopped, so the arcade's document-level Escape (which turns the
			// game off) does not also fire when all you wanted was to close
			// this.
			event.preventDefault();
			event.stopPropagation();
			onClose();
		}
	};

	return (
		<dialog
			ref={dialogRef}
			aria-label="Command palette"
			onCancel={(event) => {
				event.preventDefault();
				onClose();
			}}
			onClick={(event) => {
				// A click on the dialog element itself, rather than on the
				// panel inside it, is a click on the backdrop.
				if (event.target === dialogRef.current) onClose();
			}}
			onKeyDown={(event) => {
				if (event.key === "Escape") event.stopPropagation();
			}}
			className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-4 text-ink backdrop:bg-paper/70 backdrop:backdrop-blur-sm sm:p-6"
		>
			<div className="panel mx-auto mt-[10vh] flex max-h-[min(34rem,75vh)] w-full max-w-xl flex-col overflow-hidden shadow-elevation-2">
				<div className="flex items-center gap-3 border-b border-line px-4">
					<Search className="h-4 w-4 shrink-0 text-faint" aria-hidden="true" />
					<input
						ref={inputRef}
						type="text"
						role="combobox"
						aria-expanded={true}
						aria-controls={listId}
						aria-autocomplete="list"
						aria-activedescendant={
							activeCommand ? `${listId}-${activeCommand.id}` : undefined
						}
						aria-label="Search sections, case studies and actions"
						placeholder="Where to? Search sections, case studies, actions…"
						value={query}
						onChange={(event) => {
							setQuery(event.target.value);
							setActive(0);
						}}
						onKeyDown={onKeyDown}
						className="h-14 w-full bg-transparent text-[15px] text-ink placeholder:text-faint focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
					/>
					<kbd className="kbd shrink-0">esc</kbd>
				</div>

				<div
					id={listId}
					role="listbox"
					aria-label="Commands"
					className="flex-1 overflow-y-auto overscroll-contain p-2"
				>
					{grouped.map(({ group, items }) => (
						// biome-ignore lint/a11y/useSemanticElements: a listbox may only contain options and groups of options; a <fieldset> is neither.
						<div
							key={group}
							role="group"
							aria-labelledby={`${listId}-${group}`}
							className="pb-2"
						>
							<p
								id={`${listId}-${group}`}
								className="px-3 pb-1.5 pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint"
							>
								{group}
							</p>
							{items.map((command) => {
								const isActive = command === activeCommand;
								const Icon = command.icon;
								const label =
									command.id === "action-copy-email" && copied
										? "Copied to clipboard"
										: command.label;
								return (
									<div
										key={command.id}
										id={`${listId}-${command.id}`}
										role="option"
										aria-selected={isActive}
										tabIndex={-1}
										onMouseMove={() => setActive(ordered.indexOf(command))}
										onClick={() => runCommand(command)}
										onKeyDown={() => {}}
										className={cn(
											"flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
											isActive ? "bg-surface-deep text-ink" : "text-muted",
										)}
									>
										<Icon
											className={cn(
												"h-4 w-4 shrink-0",
												isActive ? "text-accent" : "text-faint",
											)}
											aria-hidden="true"
										/>
										<span className="min-w-0 flex-1 truncate">{label}</span>
										{command.hint && (
											<span className="hidden max-w-[45%] truncate font-mono text-[11px] text-faint sm:block">
												{command.hint}
											</span>
										)}
									</div>
								);
							})}
						</div>
					))}
					{ordered.length === 0 && (
						<p className="px-3 py-10 text-center text-sm text-muted">
							Nothing matches “{query}”.
						</p>
					)}
				</div>

				<div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
					<span className="flex items-center gap-1.5">
						<kbd className="kbd">↑</kbd>
						<kbd className="kbd">↓</kbd> move
						<kbd className="kbd ml-2">↵</kbd> select
					</span>
					<span aria-live="polite">
						{ordered.length} {ordered.length === 1 ? "result" : "results"}
					</span>
				</div>
			</div>
		</dialog>
	);
}
