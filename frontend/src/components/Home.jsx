import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { removeBlog } from '../reducers/blogReducer';
import blogService from '../services/blogs';


const Home = ({ notify }) => {
  const blogs = useSelector(state => state.blog);

  const dispatch = useDispatch();

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id);
      dispatch(removeBlog(blog));
      notify(`Blog ${blog.title}, by ${blog.author} removed`);
    }
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
      {[...blogs].sort(byLikes).map(blog =>
        <div key={blog.id} style={style}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </div>
      )}
    </div>
  );
};

export default Home;