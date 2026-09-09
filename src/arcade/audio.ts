import { type GunMode, STORAGE } from "@/arcade/constants";

/**
 * WebAudio, on two deliberate deviations from the reference.
 *
 * 1. The AudioContext is constructed on the first shot, never at module load.
 *    A page that opens an audio context on load is a Lighthouse finding and,
 *    in several browsers, a console warning on every visit.
 * 2. It starts muted. The reference plays unprompted; on a portfolio that is
 *    worse than silence, and a reader who wants it can say so once.
 */
export class Audio {
	private ctx: AudioContext | null = null;
	private muted = true;

	constructor() {
		try {
			this.muted = localStorage.getItem(STORAGE.muted) !== "0";
		} catch {
			// Private browsing, or storage disabled. Stay quiet.
		}
	}

	get isMuted(): boolean {
		return this.muted;
	}

	setMuted(muted: boolean): void {
		this.muted = muted;
		try {
			localStorage.setItem(STORAGE.muted, muted ? "1" : "0");
		} catch {
			// Non-fatal: the preference lasts the session instead.
		}
	}

	private context(): AudioContext | null {
		if (this.muted) return null;
		if (this.ctx) {
			if (this.ctx.state === "suspended") void this.ctx.resume();
			return this.ctx;
		}
		const Ctor =
			window.AudioContext ??
			(window as unknown as { webkitAudioContext?: typeof AudioContext })
				.webkitAudioContext;
		if (!Ctor) return null;
		try {
			this.ctx = new Ctor();
		} catch {
			return null;
		}
		return this.ctx;
	}

	/** The gun. Filtered noise burst, not a tone — it has to cut through. */
	shot(): void {
		const ctx = this.context();
		if (!ctx) return;
		try {
			const t = ctx.currentTime;
			const len = 0.09;
			const buffer = ctx.createBuffer(
				1,
				Math.ceil(ctx.sampleRate * len),
				ctx.sampleRate,
			);
			const data = buffer.getChannelData(0);
			for (let i = 0; i < data.length; i++) {
				data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
			}
			const source = ctx.createBufferSource();
			source.buffer = buffer;
			const band = ctx.createBiquadFilter();
			band.type = "bandpass";
			band.frequency.value = 2400;
			band.Q.value = 0.7;
			const gain = ctx.createGain();
			gain.gain.setValueAtTime(0.14, t);
			gain.gain.exponentialRampToValueAtTime(0.001, t + len);
			source.connect(band);
			band.connect(gain);
			gain.connect(ctx.destination);
			source.start(t);
		} catch {
			// Audio is decoration. It never takes the frame with it.
		}
	}

	/** Gun-mode confirmation. Pitch encodes which mode, so it reads as state. */
	mode(mode: GunMode): void {
		const ctx = this.context();
		if (!ctx) return;
		try {
			const t = ctx.currentTime;
			const base =
				mode === "character"
					? 360
					: mode === "tetris"
						? 540
						: mode === "curve"
							? 700
							: 220;
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = mode === "tetris" || mode === "curve" ? "triangle" : "sine";
			osc.frequency.setValueAtTime(base, t);
			osc.frequency.exponentialRampToValueAtTime(base * 1.45, t + 0.14);
			gain.gain.setValueAtTime(0.001, t);
			gain.gain.exponentialRampToValueAtTime(0.12, t + 0.015);
			gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start(t);
			osc.stop(t + 0.17);
		} catch {
			// As above.
		}
	}

	close(): void {
		const ctx = this.ctx;
		this.ctx = null;
		if (!ctx) return;
		try {
			void ctx.close();
		} catch {
			// Already closed, or never opened.
		}
	}
}
