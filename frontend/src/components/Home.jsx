import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { likeBlog, removeBlog, setBlogs } from '../reducers/blogReducer';
import blogService from '../services/blogs';

import Blog from './Blog';

const Home = ({ notify }) => {
  const blogs = useSelector(state => state.blog);

  const dispatch = useDispatch();

  useEffect(() => {
    blogService.getAll().then(blog =>
      dispatch(setBlogs(blog))
    );
  }, []);

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

  const byLikes = (a, b) => b.likes - a.likes;

  return (
    <div>
      {[...blogs].sort(byLikes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleVote={handleVote}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Home;