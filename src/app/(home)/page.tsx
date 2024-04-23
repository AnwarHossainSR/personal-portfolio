import Experience from '@/components/Experience';
import Intro from '@/components/Intro';
import Services from '@/components/Services';
import MainLayout from '@/layouts/MainLayout/MainLayout';

export default function Home() {
  return (
    <MainLayout>
      <Intro />
      <Services />
      <Experience />
    </MainLayout>
  );
}
