import { Layout } from "@/components/Layout";
import { SEOProvider } from "@/components/SEO";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const queryClient = new QueryClient();
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Experience = lazy(() => import("@/pages/Experience"));
const Projects = lazy(() => import("@/pages/Projects"));
const Skills = lazy(() => import("@/pages/Skills"));
const YouTube = lazy(() => import("@/pages/YouTube"));
const AskAi = lazy(() => import("@/pages/AskAi"));
const Contact = lazy(() => import("@/pages/Contact"));

const PageLoader = () => (
  <div className="min-h-[60vh] grid place-items-center">
    <div className="rounded-lg border border-card-border bg-card/80 px-5 py-3 text-sm text-muted-foreground">
      Loading portfolio...
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SEOProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
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
      </TooltipProvider>
    </SEOProvider>
  </QueryClientProvider>
);

export default App;
