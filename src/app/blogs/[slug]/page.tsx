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
    description: post.data.content,
    keywords: `${post.data.title},Anwar Hossain, Portfolio Anwar, Software Engineer, Web Developer, Portfolio, Blog, Next.js, React, TypeScript, Tailwind CSS, Node.js, JavaScript, HTML, CSS, Web Development, Frontend Development, Backend Development, Full Stack Development, Software Development, Software Engineering, Web Applications, Modern Technologies, Open Source, GitHub, GitLab, Bitbucket, LinkedIn, Twitter, Facebook, Instagram, YouTube, Pinterest, Behance, Dribbble, CodePen, Stack Overflow, HackerRank, LeetCode, Dev.to, Medium, WordPress, Blogger, Tumblr, Ghost, Gatsby, Hugo, Jekyll, Nuxt.js, Vue.js, Angular, Svelte, Ember.js, Meteor, Express.js, Koa, Nest.js, Sails.js, LoopBack, Strapi, KeystoneJS, Prisma, GraphQL, Apollo, Relay, REST API, WebSockets, WebRTC, Progressive Web Apps, PWA, Accelerated Mobile Pages, AMP, Server-Side Rendering, SSR, Static Site Generation, SSG, Jamstack, Headless CMS, Content Management System, CMS, eCommerce, Online Store, Blogging Platform, Portfolio Website, Personal Website, Business Website, Corporate Website, Landing Page, Web Design, Web Development, Frontend Development, Backend Development, Full Stack Development, Software Development, Software Engineering, Web Applications, Modern Technologies, Open Source, GitHub, GitLab, Bitbucket, LinkedIn, Twitter, Facebook, Instagram, YouTube, Pinterest, Behance, Dribbble, CodePen, Stack Overflow, HackerRank, LeetCode, Dev.to, Medium, WordPress, Blogger, Tumblr, Ghost, Gatsby, Hugo, Jekyll, Nuxt.js, Vue.js, Angular, Svelte, Ember.js, Meteor, Express.js, Koa, Nest.js, Sails.js, LoopBack, Strapi, KeystoneJS, Prisma, GraphQL, Apollo, Relay, REST API, WebSockets, WebRTC, Progressive Web Apps, PWA, Accelerated Mobile Pages, AMP, Server-Side Rendering, SSR, Static Site Generation, SSG, Jamstack, Headless CMS, Content Management System, CMS, eCommerce, Online Store, Blogging Platform, Portfolio Website, Personal Website, Business Website, Corporate Website, Landing Page, Web Design, Web Development, Frontend Development, Backend Development, Full Stack Development, Software Development, Software Engineering, Web Applications, Modern Technologies, Open Source, GitHub, GitLab, Bitbucket, LinkedIn, Twitter, Facebook, Instagram, YouTube`,
    icons: {
      icon: post.data.image_url,
    },
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
