import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SEOProvider } from "@/components/SEO";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { notes } from "@/content/notes";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const Home = lazy(() => import("@/pages/Home"));
const Work = lazy(() => import("@/pages/Work"));
const CaseStudy = lazy(() => import("@/pages/CaseStudy"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Writing = lazy(() => import("@/pages/Writing"));
const Note = lazy(() => import("@/pages/Note"));

function PageLoader() {
	return <div className="min-h-[60vh]" aria-busy="true" />;
}

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<SEOProvider>
				<TooltipProvider>
					<Toaster />
					<Sonner />
					<Layout>
						<Suspense fallback={<PageLoader />}>
							<Routes>
								<Route path="/" element={<Home />} />
								<Route path="/work" element={<Work />} />
								<Route path="/work/:slug" element={<CaseStudy />} />
								<Route path="/about" element={<About />} />
								<Route path="/contact" element={<Contact />} />
								{notes.length > 0 && (
									<>
										<Route path="/writing" element={<Writing />} />
										<Route path="/writing/:slug" element={<Note />} />
									</>
								)}
								{/* Old URLs keep working; inbound links and search results still land. */}
								<Route
									path="/projects"
									element={<Navigate to="/work" replace />}
								/>
								<Route
									path="/skills"
									element={<Navigate to="/about#stack" replace />}
								/>
								<Route
									path="/experience"
									element={<Navigate to="/about#track-record" replace />}
								/>
								<Route path="*" element={<NotFound />} />
							</Routes>
						</Suspense>
					</Layout>
				</TooltipProvider>
			</SEOProvider>
		</QueryClientProvider>
	);
}
