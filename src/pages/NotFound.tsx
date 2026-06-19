import { ArrowLeft, Home, Search } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
	const location = useLocation();

	useEffect(() => {
		console.error(
			"404 Error: User attempted to access non-existent route:",
			location.pathname,
		);
	}, [location.pathname]);

	return (
		<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-20">
			<div className="relative max-w-2xl w-full text-center">
				<div className="absolute inset-0 -z-10 bg-gradient-hero opacity-40 blur-3xl" />

				<div className="premium-card p-8 sm:p-14 hero-glow">
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80 mb-6">
						Error 404
					</p>

					<h1 className="text-7xl sm:text-9xl font-bold leading-none gradient-text mb-6">
						404
					</h1>

					<h2 className="text-2xl sm:text-3xl font-bold mb-4">
						This page took a wrong turn
					</h2>
					<p className="text-sm sm:text-base text-muted-foreground/80 max-w-md mx-auto mb-10 leading-relaxed">
						The page you're looking for doesn't exist or may have been moved.
						Let's get you back on track.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							className="group bg-gradient-primary text-white shadow-premium hover:shadow-glow transition-all duration-500"
							asChild
						>
							<Link to="/">
								<Home className="mr-2 w-4 h-4" />
								Back to Home
							</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="group border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-500"
							asChild
						>
							<Link to="/projects">
								<Search className="mr-2 w-4 h-4" />
								Explore Projects
							</Link>
						</Button>
					</div>

					<button
						type="button"
						onClick={() => window.history.back()}
						className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Go back to previous page
					</button>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
