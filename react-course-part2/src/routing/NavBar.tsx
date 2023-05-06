import { Link, NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className='navbar navbar-expand-lg' style={{ background: '#f0f0f0', marginBottom: '1rem' }}>
      <div className='container-fluid'>
        <NavLink to='/' className='navbar-brand'>
          My App
        </NavLink>
        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <NavLink to='/' 
              className={({isActive}) => isActive ? 'active nav-link' : 'nav-link'}>
                Home
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink to='/users' className='nav-link'>
                Users
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
