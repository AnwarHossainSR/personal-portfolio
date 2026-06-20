import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageLoader } from "@/components/common/PageLoader";
import { Layout } from "@/components/layout/Layout";

// Code-split each route so the initial bundle stays small.
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Experience = lazy(() => import("@/pages/Experience"));
const Projects = lazy(() => import("@/pages/Projects"));
const Skills = lazy(() => import("@/pages/Skills"));
const YouTube = lazy(() => import("@/pages/YouTube"));
const AskAi = lazy(() => import("@/pages/AskAi"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export function AppRouter() {
	return (
		<BrowserRouter>
			<Layout>
				<Suspense fallback={<PageLoader />}>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/about" element={<About />} />
						<Route path="/experience" element={<Experience />} />
						<Route path="/projects" element={<Projects />} />
						<Route path="/skills" element={<Skills />} />
						<Route path="/youtube" element={<YouTube />} />
						<Route path="/ask-ai" element={<AskAi />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Suspense>
			</Layout>
		</BrowserRouter>
	);
}
