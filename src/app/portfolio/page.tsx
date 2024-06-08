import type { Metadata } from 'next';

import { SEO } from '@/lib/seo';

import Portfolio from './portfolio';

export const metadata: Metadata = SEO('Portfolio');

const PortfolioPage = () => {
  return <Portfolio />;
};

export default PortfolioPage;
