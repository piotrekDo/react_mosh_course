import { useEffect, useState } from 'react';
import { CanceledError } from './services/api-client';
import userService, { User } from './services/user-service';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const { request, cancel } = userService.getAll<User>();
    request
      .then(response => {
        setUsers(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        if (error instanceof CanceledError) return;
        setError(error.message);
        setIsLoading(false);
      })
      .finally(() => setIsLoading(false));

    return () => cancel();
  }, []);

  const deleteUser = (user: User) => {
    const originalUsers = [...users];
    setUsers(users.filter(u => u.id !== user.id));
    userService.delete(user.id).catch(err => {
      console.log(err);
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  const addUser = () => {
    const originalUsers = [...users];
    const newUser = { id: 0, name: 'New user' };
    setUsers([...users, newUser]);
    userService
      .add<User>(newUser)
      .then(res => setUsers([...users, res.data]))
      .catch(error => {
        setError(error.message);
        setUsers(originalUsers);
      });
  };

  const updateUser = (user: User) => {
    const originalUsers = [...users];
    const updatedUser = { ...user, name: user.name + '!' };
    setUsers(users.map(u => (u.id === user.id ? updatedUser : u)));
    userService.update<User>(user).catch(err => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  return (
    <>
      {isLoading && <div className='spinner-border'></div>}
      {error && <p className='text-danger'>{error}</p>}
      <button className='btn btn-primary mb-3' onClick={addUser}>
        Add
      </button>
      <ul className='list-group'>
        {users.map(user => (
          <li key={user.id} className='list-group-item d-flex justify-content-between'>
            {user.name}{' '}
            <button className='btn btn-outline-danger' onClick={() => deleteUser(user)}>
              Ddelete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
