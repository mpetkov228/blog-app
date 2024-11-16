import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { useEffect, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { appendBlog } from './reducers/blogReducer';
import { hideNotification, showNotification } from './reducers/notificationReducer';
import { setUser, clearUser } from './reducers/userReducer';

import blogService from './services/blogs';
import loginService from './services/login';
import storage from './services/storage';
import Login from './components/Login';
import NewBlog from './components/NewBlog';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import Home from './components/Home';
import Users from './components/Users';

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector(state => state.user);

  useEffect(() => {
    const user = storage.loadUser();
    console.log(user);
    if (user) {
      dispatch(setUser(user));
    }
  }, []);

  const blogFormRef = createRef();

  const notify = (message, type = 'success') => {
    dispatch(showNotification(message));
    setTimeout(() => {
      dispatch(hideNotification());
    }, 5000);
  };

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      dispatch(setUser(user));
      storage.saveUser(user);
      notify(`Welcome back, ${user.name}`);
    } catch (error) {
      notify('Wrong credentials', 'error');
    }
  };

  const handleLogout = () => {
    dispatch(clearUser());
    storage.removeUser();
    notify(`Bye, ${user.name}!`);
  };

  const handleCreate = async (blog) => {
    const newBlog = await blogService.create(blog);
    dispatch(appendBlog(newBlog));
    notify(`Blog created: ${newBlog.title}, ${newBlog.author}`);
    blogFormRef.current.toggleVisibility();
  };

  if (!user) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification />
        <Login doLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>
          logout
        </button>
      </div>

      <Router>
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/" element={<Home notify={notify} />} />
        </Routes>
      </Router>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog doCreate={handleCreate} />
      </Togglable>
    </div>
  );
};

export default App;