# React Context
Narzędzie pozwalające udostępniać dane pomiędzy komponentami bez potrzeby przerzucania ich przez komponenty pośrednie. 

Aby udostępnić kontekst między komponentami musimy wydzielić wspólną część do najbliższego rodzica, np. do `App`.
Następnie trzeba utworzyć kontekst, w nim najlepiej wydzielić typ danych do interfejsu. 
Na koniec wrapujemy zainteresowane komponenty w `TasksContext.Provider` i jako atrybut `value` przekazujemy wartości, które chcemy współdzielić. W zainteresowanych komponentach korzystamy z hooka `useContext` i przekazujemy do niego utworzony kontekst.

### WSPOLDZIELONY REDUCER
```
export interface Task {
  id: number;
  title: string;
}

interface AddTask {
  type: 'ADD';
  task: Task;
}

interface DeleteTask {
  type: 'DELETE';
  taskId: number;
}

export type TaskAction = AddTask | DeleteTask;

const tasksReducer = (tasks: Task[], action: TaskAction): Task[] => {
  switch (action.type) {
    case 'ADD':
      return [action.task, ...tasks];
    case 'DELETE':
      return tasks.filter(task => task.id != action.taskId);
    default:
      return tasks;
  }
};

export default tasksReducer;
```

### APP COMPONENT
```
import { useReducer } from 'react';
import './App.css';
import tasksReducer from './state-management/reducers/taskReducer';
import NavBar from './state-management/NavBar';
import TasksContext from './state-management/contexts/tasksContext';
import HomePage from './state-management/HomePage';

function App() {
  const [tasks, dispatch] = useReducer(tasksReducer, []);

  return (
    <TasksContext.Provider value={{ tasks, dispatch }}>
      <NavBar />
      <HomePage />
    </TasksContext.Provider>
  );
}

export default App;
```

### TasksList
```
import { useContext } from 'react';
import TasksContext from './contexts/tasksContext';

const TaskList = () => {
  const { tasks, dispatch } = useContext(TasksContext);

  return (
    <>
      <button className='btn btn-primary my-3'
        onClick={() =>
          dispatch({
            type: 'ADD',
            task: { id: Date.now(), title: 'Task ' + Date.now() },
          })
        }
      >Add Task</button>
      <ul className='list-group'>
        {tasks.map(task => (
          <li key={task.id} className='list-group-item d-flex justify-content-between align-items-center'>
            <span className='flex-grow-1'>{task.title}</span>
            <button className='btn btn-outline-danger'
              onClick={() =>
                dispatch({
                  type: 'DELETE',
                  taskId: task.id,
                })
              }
            >Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TaskList;
```

### NAVBAR
```
import { useContext } from 'react';
import LoginStatus from './LoginStatus';
import TasksContext from './contexts/tasksContext';

const NavBar = () => {
const {tasks} = useContext(TasksContext);

  return (
    <nav className="navbar d-flex justify-content-between">
      <span className="badge text-bg-secondary">{tasks.length}</span>
      <LoginStatus />
    </nav>
  );
};

export default NavBar;
```

# Custom provider
Pozwala wydzielić cały kontekst do osobnego komponentu, pozwalając uniknąc zaśmiecania nadrzędnego, wspólnego komponentu stanem danych, którmi nie jest on zaintersowany

```
import React, { ReactNode, useReducer } from 'react';
import loginReducer from './reducers/loginReducer';
import AuthContext from './contexts/authContext';

interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const [user, dispatch] = useReducer(loginReducer, '');
  return <AuthContext.Provider value={{ user, dispatch }}>{children}</AuthContext.Provider>;
}
```

## Custom context hook
```
import { useContext } from "react";
import AuthContext from "../contexts/authContext";

const useAuth = () => useContext(AuthContext)

export default useAuth;
```

## Context vs Redux
Redux jest szeroko stosowaną biblioteką do zarządzania stanem danych. Dostarcza scentralizowaną przestrzeń do zarządzania i współdzielenia danych. Zamiast przechowywać stan w komponencie przechowywany jest on globalnie w Redux. 