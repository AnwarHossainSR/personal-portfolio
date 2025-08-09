import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { ParticleBackground } from './ParticleBackground';
import { InteractiveBackground } from './InteractiveBackground';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <InteractiveBackground />
      <div className="relative z-10">
        <Navigation />
        <main className="relative">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}