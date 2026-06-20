/** Lightweight, on-brand fallback shown while a lazy page chunk loads. */
export function PageLoader() {
	return (
		<div
			className="min-h-[60vh] flex items-center justify-center"
			aria-hidden="true"
		>
			<div className="relative h-12 w-12">
				<div className="absolute inset-0 rounded-full border-2 border-primary/20" />
				<div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
			</div>
		</div>
	);
}
