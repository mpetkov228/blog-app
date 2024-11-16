import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import storage from '../services/storage';
import { likeBlog } from '../reducers/blogReducer';
import blogService from '../services/blogs';

const Blog = ({ blogs, notify }) => {
  const dispatch = useDispatch();

  const id = useParams().id;
  const blog = blogs.find(b => b.id === id);

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

  return (
    <div className='blog'>
      <h2>{blog.title}</h2>
      <div><a href={blog.url}>{blog.url}</a></div>
      <div>
        {blog.likes} likes <button onClick={() => handleVote(blog)}>like</button>
      </div>
      <div>added by {blog.user.name}</div>
    </div>
  );
};

export default Blog;