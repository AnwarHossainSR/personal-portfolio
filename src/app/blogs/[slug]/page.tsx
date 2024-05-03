import MainLayout from '@/layouts/MainLayout/MainLayout';

import BlogDetailsPage from './BlogDetailsPage';

const BkogDetails = ({ params }: { params: { slug: string } }) => {
  return (
    <MainLayout>
      <BlogDetailsPage slug={params.slug} />
    </MainLayout>
  );
};

export default BkogDetails;
