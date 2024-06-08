import type { Metadata } from 'next';

import { SEO } from '@/lib/seo';

import Blogs from './Blog';

export const metadata: Metadata = SEO('Blogs');

const BlogPage = () => {
  return <Blogs />;
};

export default BlogPage;
