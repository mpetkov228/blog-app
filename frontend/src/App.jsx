import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setBlogs } from './reducers/blogReducer';
import { hideNotification, showNotification } from './reducers/notificationReducer';
import { setUser, clearUser } from './reducers/userReducer';
import { setUsers } from './reducers/usersReducer';

import blogService from './services/blogs';
import loginService from './services/login';
import userService from './services/users';
import commentService from './services/comments';
import storage from './services/storage';
import Login from './components/Login';
import Notification from './components/Notification';
import Home from './components/Home';
import Users from './components/Users';
import User from './components/User';
import Blog from './components/Blog';

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector(state => state.user);
  const users = useSelector(state => state.users);
  const blogs = useSelector(state => state.blog);

  useEffect(() => {
    const user = storage.loadUser();
    console.log(user);
    if (user) {
      dispatch(setUser(user));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    blogService.getAll().then(blog =>
      dispatch(setBlogs(blog))
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    userService.getAll().then(users => {
      dispatch(setUsers(users));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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

  const handleCreate = async (id, comment) => {
    await commentService.create(id, comment);
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

  const padding = {
    paddingRight: 5
  };

  const background = {
    backgroundColor: 'lightgray',
    padding: '3px 6px'
  };

  return (
    <div>
      <Router>
        <div style={background}>
          <Link style={padding} to="/">blogs</Link>
          <Link style={padding} to="/users">users</Link>
          {user.name} logged in
          <button onClick={handleLogout}>
            logout
          </button>
        </div>
        <h2>blogs app</h2>
        <Notification />

        <Routes>
          <Route path="/users/:id" element={<User users={users} />} />
          <Route path="/users" element={<Users />} />
          <Route path="/blogs/:id" element={<Blog blogs={blogs} notify={notify} doCreate={handleCreate} />} />
          <Route path="/" element={<Home notify={notify} />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;