import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SEOProvider } from "@/components/SEO";
import { notes } from "@/content/notes";
import NotFound from "@/pages/NotFound";

const Home = lazy(() => import("@/pages/Home"));
const CaseStudy = lazy(() => import("@/pages/CaseStudy"));
const Writing = lazy(() => import("@/pages/Writing"));
const Note = lazy(() => import("@/pages/Note"));

function PageLoader() {
	return <div className="min-h-[60vh]" aria-busy="true" />;
}

export default function App() {
	return (
		<SEOProvider>
			<Layout>
				<Suspense fallback={<PageLoader />}>
					<Routes>
						{/* The specific case-study pattern must be declared before the
						    bare /work redirect below, or the redirect shadows it. */}
						<Route path="/work/:slug" element={<CaseStudy />} />
						<Route path="/" element={<Home />} />
						{notes.length > 0 && (
							<>
								<Route path="/writing" element={<Writing />} />
								<Route path="/writing/:slug" element={<Note />} />
							</>
						)}
						{/* Old page routes collapse onto the one anchored page;
						    inbound links and search results still land somewhere. */}
						<Route path="/work" element={<Navigate to="/#work" replace />} />
						<Route
							path="/about"
							element={<Navigate to="/#what-i-do" replace />}
						/>
						<Route
							path="/contact"
							element={<Navigate to="/#contact" replace />}
						/>
						<Route
							path="/projects"
							element={<Navigate to="/#work" replace />}
						/>
						<Route path="/skills" element={<Navigate to="/#stack" replace />} />
						<Route
							path="/experience"
							element={<Navigate to="/#work" replace />}
						/>
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Suspense>
			</Layout>
		</SEOProvider>
	);
}
