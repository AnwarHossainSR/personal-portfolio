import type { Metadata } from 'next';

import ContactComponent from '@/components/Contact';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { SEO } from '@/lib/seo';

export const metadata: Metadata = SEO('Contact');
const Contact = () => {
  return (
    <MainLayout>
      <ContactComponent />
    </MainLayout>
  );
};

export default Contact;
