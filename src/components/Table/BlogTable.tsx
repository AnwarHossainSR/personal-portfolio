
const BlogTable = ({posts}:{posts:any}) => {
    const onEdit = (id:number) => {
        console.log('Edit Post', id);
    }

    const onDelete = (id:number) => {
        console.log('Delete Post', id);
    }
  return (
    <table className="blog-post-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Date</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post:any) => (
          <tr key={post.id}>
            <td>{post.title}</td>
            <td>{post.author.name}</td>
            <td>{post.createdAt}</td>
            <td>{post.category ?? 'No Category'}</td>
            <td>
              <button className="edit-btn" onClick={() => onEdit(post.id)}>Edit</button>
              <button className="delete-btn" onClick={() => onDelete(post.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default BlogTable