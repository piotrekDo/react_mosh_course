import { Link, Outlet } from 'react-router-dom';

const UserListPage = () => {
  const users = [
    { id: 1, name: 'Mosh' },
    { id: 2, name: 'John' },
    { id: 3, name: 'Alice' },
  ];
  return (
    <section className='container'>
      <div className='row'>
        <ul className='col list-group'>
          {users.map(user => (
            <li className='list-group-item' key={user.id}>
              <Link to={`/users/${user.id}`}>{user.name}</Link>
            </li>
          ))}
        </ul>
        <div className='col'><Outlet /></div>
      </div>
    </section>
  );
};

export default UserListPage;
