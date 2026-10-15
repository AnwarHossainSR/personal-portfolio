import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

function Node({
	children,
	className,
}: {
	children: string;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"rounded-md border border-line bg-surface-deep px-1 py-1 text-center leading-tight text-ink min-[400px]:whitespace-nowrap sm:px-2",
				className,
			)}
		>
			{children}
		</span>
	);
}

function Wire({ label, at }: { label?: string; at: number }) {
	return (
		<span className="relative mx-1 block h-px min-w-3 bg-line sm:mx-2.5">
			<span
				className="packet-track absolute inset-0 block"
				style={{ "--at": `${at}s` } as CSSProperties}
			/>
			{label && (
				<span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.14em] text-faint">
					{label}
				</span>
			)}
		</span>
	);
}

/**
 * The claim in the "AI and MCP" capability, drawn: two kinds of caller, one
 * API. An AI client comes in through the MCP server, a person through the
 * interface, and both land on the same product API — which is the point of
 * building it that way, since nothing the agent can do is a side door.
 */
export function McpDiagram({ className }: { className?: string }) {
	return (
		<div
			role="img"
			aria-label="An AI client reaches the product API through an MCP server, and a person reaches the same API through the interface."
			className={cn(
				"rounded-xl border border-line/80 bg-paper/60 px-3 pb-4 pt-6 font-mono text-[10px] sm:px-4 sm:text-[11px]",
				className,
			)}
		>
			<div className="grid grid-cols-[auto_minmax(1rem,1fr)_auto_minmax(1rem,1fr)_auto] items-center gap-y-6">
				<Node>AI client</Node>
				<Wire label="mcp" at={0} />
				<Node>MCP server</Node>
				<Wire at={0.6} />
				<span className="row-span-2 grid self-stretch rounded-md border border-accent/50 bg-accent/10 px-2 text-center leading-tight text-accent">
					<span className="self-center">
						Product
						<br />
						API
					</span>
				</span>
				<Node>Person</Node>
				<Wire label="ui" at={1.4} />
				<Node>Interface</Node>
				<Wire at={2} />
			</div>
		</div>
	);
}
