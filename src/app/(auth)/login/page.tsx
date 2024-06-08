import type { Metadata } from 'next';

import MainLayout from '@/layouts/MainLayout/MainLayout';
import { SEO } from '@/lib/seo';

import LoginPage from './LoginPage';

export const metadata: Metadata = SEO('Login');

const Login = () => {
  return (
    <MainLayout>
      <LoginPage />
    </MainLayout>
  );
};

export default Login;
