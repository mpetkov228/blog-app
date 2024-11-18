import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import storage from '../services/storage';
import { likeBlog, removeBlog } from '../reducers/blogReducer';
import blogService from '../services/blogs';

const Blog = ({ blogs, notify }) => {
  const dispatch = useDispatch();

  const id = useParams().id;
  const blog = blogs.find(b => b.id === id);

  if (!blog) {
    return <div>Loading...</div>;
  }

  const nameOfUser = blog.user ? blog.user.name : 'anonymous';

  const canRemove = blog.user ? blog.user.username === storage.me() : true;

  console.log(blog.user, storage.me(), canRemove);

  const handleVote = async (blog) => {
    console.log('updating', blog);
    const updatedBlog = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1
    });
    notify(`You liked ${updatedBlog.title} by ${updatedBlog.author}`);
    dispatch(likeBlog(updatedBlog));
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id);
      dispatch(removeBlog(blog));
      notify(`Blog ${blog.title}, by ${blog.author} removed`);
    }
  };

  console.log(blog.comments);

  return (
    <div className='blog'>
      <h2>{blog.title}</h2>
      <div><a href={blog.url}>{blog.url}</a></div>
      <div>
        {blog.likes} likes <button onClick={() => handleVote(blog)}>like</button>
      </div>
      <div>added by {blog.user.name}</div>

      <h2>comments</h2>
      <ul>
        {blog.comments.map(comment =>
          <li key={comment.id}>{comment.content}</li>
        )}
      </ul>
    </div>
  );
};

export default Blog;