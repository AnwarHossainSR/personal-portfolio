import type { Metadata } from 'next';

import { SEO } from '@/lib/seo';

import About from './about';

export const metadata: Metadata = SEO('About');

const AboutPage = () => {
  return <About />;
};

export default AboutPage;
