/**
 * Every mutation the game makes to the page, and how to take it back.
 *
 * This module has no counterpart in the reference implementation, and it is
 * the single largest difference between that port and this one. There the site
 * is an Astro MPA: a destroyed heading comes back on the next page load, so
 * "undo" is free and nobody has to write it. Here the site is a React SPA. A
 * text node the game deleted out from under React is not resurrected by a
 * re-render — React only patches the tree it believes it rendered — and a
 * reader who switches the overlay off must not be left holding a page with
 * holes in it.
 *
 * So every destruction registers its reversal before it happens, and both the
 * scheduled respawn and `stop()` drain the same log. An entry removes itself
 * once it has run, which is what keeps the log bounded during a long session
 * rather than growing once per glyph for as long as the tab is open.
 */
export interface UndoEntry {
	/** Puts the page back. Safe to call on a node React has since replaced. */
	readonly restore: () => void;
	timer: number;
	done: boolean;
}

export class UndoLog {
	private readonly entries = new Set<UndoEntry>();

	/**
	 * Registers a reversal and schedules it for `delay` ms. The reversal runs
	 * at most once, whichever path reaches it first — the timer, `stop()`, or
	 * a caller holding the returned entry.
	 */
	register(restore: () => void, delay: number): UndoEntry {
		const entry: UndoEntry = {
			restore: () => {
				if (entry.done) return;
				entry.done = true;
				window.clearTimeout(entry.timer);
				this.entries.delete(entry);
				restore();
			},
			timer: 0,
			done: false,
		};
		entry.timer = window.setTimeout(entry.restore, delay);
		this.entries.add(entry);
		return entry;
	}

	get size(): number {
		return this.entries.size;
	}

	/**
	 * Reverses everything still outstanding, newest first. Reverse order
	 * matters: two destructions can touch the same text node, and replaying
	 * them forwards would restore the older split on top of the newer one.
	 */
	restoreAll(): void {
		for (const entry of [...this.entries].reverse()) {
			try {
				entry.restore();
			} catch {
				// A node React has since replaced is already "restored" as far
				// as the reader is concerned. One failure must not strand the
				// rest of the log.
				entry.done = true;
				this.entries.delete(entry);
			}
		}
		this.entries.clear();
	}
}
