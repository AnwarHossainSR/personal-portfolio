import type { Metadata } from 'next';

import { SEO } from '@/lib/seo';

import PlayList from './PlayList';

export const metadata: Metadata = SEO('PlayList');

const PlayListPage = () => {
  return <PlayList />;
};

export default PlayListPage;
