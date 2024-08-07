import { useRouter } from 'next/navigation';

/* eslint-disable no-console */
const AdminBlogCard = ({ posts }: { posts: any }) => {
  const { push } = useRouter();
  const onView = (id: number) => {
    push(`/admin/blogs/${id}`);
  };

  const onEdit = (id: number) => {
    push(`/admin/blogs/edit/${id}`);
  };

  const onDelete = (id: number) => {
    console.log('Delete Post', id);
  };

  return (
    <div className="flex flex-wrap gap-5 justify-center">
      {posts.map((post: any) => (
        <div
          key={post._id}
          className="bg-gray-800 rounded shadow-lg overflow-hidden w-72 m-2 p-5 transition-transform transform hover:scale-105"
        >
          <div className="mb-5">
            <h2 className="text-xl mb-2">{post.title}</h2>
            <p className="text-gray-400">
              By {post.author.name} on{' '}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-400">
              Category: {post.category ?? 'No Category'}
            </p>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="px-3 py-2 bg-blue-500 text-white rounded transition-opacity hover:opacity-80"
              onClick={() => onView(post._id)}
            >
              View
            </button>
            <button
              type="button"
              className="px-3 py-2 bg-green-500 text-white rounded transition-opacity hover:opacity-80"
              onClick={() => onEdit(post._id)}
            >
              Edit
            </button>
            <button
              type="button"
              className="px-3 py-2 bg-red-500 text-white rounded transition-opacity hover:opacity-80"
              onClick={() => onDelete(post._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminBlogCard;
