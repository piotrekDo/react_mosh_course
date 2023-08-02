import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className='navbar navbar-expand-lg' style={{ background: '#f0f0f0', marginBottom: '1rem' }}>
      <div className='container-fluid'>
        <NavLink to='/' className='navbar-brand'>
          My App
        </NavLink>
        <div className=' navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <NavLink to='/' className={({ isActive }) => (isActive ? 'active nav-link' : 'nav-link')}>
                Home
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink to='/users' className='nav-link'>
                Users
              </NavLink>
            </li>
            <li>
              <NavLink to='/post-pagination' className='nav-link'>
                Paginacja zwykła
              </NavLink>
            </li>
            <li>
              <NavLink to='/post-pagination-infinite' className='nav-link'>
                Paginacja infinite
              </NavLink>
            </li>
            <li>
              <NavLink to='/rick-and-morty-characters' className='nav-link'>
                Rick and Morty postaci
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
