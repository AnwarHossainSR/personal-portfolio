import type { Metadata } from 'next';

import Contact from '@/components/Contact';
import Experience from '@/components/Experience';
import Intro from '@/components/Intro';
import Portfolio from '@/components/Portfolio';
import Services from '@/components/Services';
import Works from '@/components/Works';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { SEO } from '@/lib/seo';

export const metadata: Metadata = SEO('Home');

export default function Home() {
  return (
    <MainLayout>
      <Intro />
      <Services />
      <Experience />
      <Works />
      <Portfolio />
      {/* <Testimonial /> */}
      <Contact />
    </MainLayout>
  );
}
