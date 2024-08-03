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
    <div className="blog-cards-container">
      {posts.map((post: any) => (
        <div key={post._id} className="blog-card">
          <div className="blog-card-header">
            <h2>{post.title}</h2>
            <p>
              By {post.author.name} on{' '}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p>Category: {post.category ?? 'No Category'}</p>
          </div>
          <div className="blog-card-actions">
            <button
              type="button"
              className="view-btn"
              onClick={() => onView(post._id)}
            >
              View
            </button>
            <button
              type="button"
              className="edit-btn"
              onClick={() => onEdit(post._id)}
            >
              Edit
            </button>
            <button
              type="button"
              className="delete-btn"
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
