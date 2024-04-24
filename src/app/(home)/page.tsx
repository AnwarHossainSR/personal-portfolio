import type { Metadata } from 'next';

import Contact from '@/components/Contact';
import Experience from '@/components/Experience';
import Intro from '@/components/Intro';
import Portfolio from '@/components/Portfolio';
import Services from '@/components/Services';
import Works from '@/components/Works';
import MainLayout from '@/layouts/MainLayout/MainLayout';

export const metadata: Metadata = {
  description:
    'Portfolio of Anwar Hossain, a software engineer who loves to build web applications with modern technologies.',
  keywords:
    'Anwar Hossain, Portfolio Anwar, Software Engineer, Web Developer, Portfolio, Blog, Next.js, React, TypeScript, Tailwind CSS, Node.js, JavaScript, HTML, CSS, Web Development, Frontend Development, Backend Development, Full Stack Development, Software Development, Software Engineering, Web Applications, Modern Technologies, Open Source, GitHub, GitLab, Bitbucket, LinkedIn, Twitter, Facebook, Instagram, YouTube, Pinterest, Behance, Dribbble, CodePen, Stack Overflow, HackerRank, LeetCode, Dev.to, Medium, WordPress, Blogger, Tumblr, Ghost, Gatsby, Hugo, Jekyll, Nuxt.js, Vue.js, Angular, Svelte, Ember.js, Meteor, Express.js, Koa, Nest.js, Sails.js, LoopBack, Strapi, KeystoneJS, Prisma, GraphQL, Apollo, Relay, REST API, WebSockets, WebRTC, Progressive Web Apps, PWA, Accelerated Mobile Pages, AMP, Server-Side Rendering, SSR, Static Site Generation, SSG, Jamstack, Headless CMS, Content Management System, CMS, eCommerce, Online Store, Blogging Platform, Portfolio Website, Personal Website, Business Website, Corporate Website, Landing Page, Web Design, Web Development, Frontend Development, Backend Development, Full Stack Development, Software Development, Software Engineering, Web Applications, Modern Technologies, Open Source, GitHub, GitLab, Bitbucket, LinkedIn, Twitter, Facebook, Instagram, YouTube, Pinterest, Behance, Dribbble, CodePen, Stack Overflow, HackerRank, LeetCode, Dev.to, Medium, WordPress, Blogger, Tumblr, Ghost, Gatsby, Hugo, Jekyll, Nuxt.js, Vue.js, Angular, Svelte, Ember.js, Meteor, Express.js, Koa, Nest.js, Sails.js, LoopBack, Strapi, KeystoneJS, Prisma, GraphQL, Apollo, Relay, REST API, WebSockets, WebRTC, Progressive Web Apps, PWA, Accelerated Mobile Pages, AMP, Server-Side Rendering, SSR, Static Site Generation, SSG, Jamstack, Headless CMS, Content Management System, CMS, eCommerce, Online Store, Blogging Platform, Portfolio Website, Personal Website, Business Website, Corporate Website, Landing Page, Web Design, Web Development, Frontend Development, Backend Development, Full Stack Development, Software Development, Software Engineering, Web Applications, Modern Technologies, Open Source, GitHub, GitLab, Bitbucket, LinkedIn, Twitter, Facebook, Instagram, YouTube',
  title: 'Home - Anwar Hossain',
  icons: {
    icon: '/favicon.png',
  },
};

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
