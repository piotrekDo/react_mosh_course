import LoginStatus from './auth/LoginStatus';
import useCounterStore from './counter/store';
import useTasks from './tasks/useTasks';

const NavBar = () => {
const {tasks} = useTasks();
const {counter} = useCounterStore()

  return (
    <nav className="navbar d-flex justify-content-between">
      <span className="badge text-bg-secondary">{tasks.length}</span>
      {counter}
      <LoginStatus />
    </nav>
  );
};

export default NavBar;
