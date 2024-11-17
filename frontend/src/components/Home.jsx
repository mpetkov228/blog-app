import { createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { appendBlog } from '../reducers/blogReducer';
import blogService from '../services/blogs';
import Togglable from './Togglable';
import NewBlog from './NewBlog';


const Home = ({ notify }) => {
  const blogs = useSelector(state => state.blog);

  const dispatch = useDispatch();

  const blogFormRef = createRef();

  const handleCreate = async (blog) => {
    const newBlog = await blogService.create(blog);
    dispatch(appendBlog(newBlog));
    notify(`Blog created: ${newBlog.title}, ${newBlog.author}`);
    blogFormRef.current.toggleVisibility();
  };

  const byLikes = (a, b) => b.likes - a.likes;

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div className="blog">
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog doCreate={handleCreate} />
      </Togglable>
      {[...blogs].sort(byLikes).map(blog =>
        <div key={blog.id} style={style}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </div>
      )}
    </div>
  );
};

export default Home;