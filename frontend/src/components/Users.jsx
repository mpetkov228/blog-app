import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import userService from '../services/users';
import { setUsers } from '../reducers/usersReducer';
import { Link } from 'react-router-dom';

const Users = () => {
  const dispatch = useDispatch();

  const users = useSelector(state => state.users);

  useEffect(() => {
    userService.getAll().then(users => {
      dispatch(setUsers(users));
    });
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;