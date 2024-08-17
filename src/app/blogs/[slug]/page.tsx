/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import type { Metadata, ResolvingMetadata } from 'next';

import MainLayout from '@/layouts/MainLayout/MainLayout';

import BlogDetailsPage from './BlogDetailsPage';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  const post = await fetch(`${process.env.SITE_URL}/api/blogs/${slug}`).then(
    res => res.json()
  );
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post.data.title,
    openGraph: {
      images: [post.data.image_url, ...previousImages],
    },
    description: post.data.short_content,
  };
}
const BkogDetails = ({ params, searchParams }: Props) => {
  return (
    <MainLayout>
      <BlogDetailsPage slug={params.slug} />
    </MainLayout>
  );
};

export default BkogDetails;
