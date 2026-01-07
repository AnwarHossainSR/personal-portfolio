import { Layout } from "@/components/Layout";
import { SEOProvider } from "@/components/SEO";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import About from "@/pages/About";
import AskAi from "@/pages/AskAi";
import Contact from "@/pages/Contact";
import Experience from "@/pages/Experience";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Projects from "@/pages/Projects";
import Skills from "@/pages/Skills";
import YouTube from "@/pages/YouTube";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SEOProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
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
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </SEOProvider>
  </QueryClientProvider>
);

export default App;
