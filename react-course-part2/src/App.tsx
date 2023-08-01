import NavBar from './state-management/NavBar';
import HomePage from './state-management/HomePage';
import AuthProvider from './state-management/auth/AuthProvider';
import { TasksProvider } from './state-management/tasks/TaskProvider';
import Counter from './state-management/counter/Counter';

function App() {
  return (
    <AuthProvider>
      <TasksProvider>
        <NavBar />
        <HomePage />
        <Counter />
      </TasksProvider>
    </AuthProvider>
  );
}

export default App;
