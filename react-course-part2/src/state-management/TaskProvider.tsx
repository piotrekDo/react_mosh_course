import React, { ReactNode, useReducer } from 'react';
import tasksReducer from './reducers/taskReducer';
import TasksContext from './contexts/tasksContext';

interface Props {
  children: ReactNode;
}

export const TasksProvider = ({children}: Props) => {
  const [tasks, dispatch] = useReducer(tasksReducer, []);
  return <TasksContext.Provider value={{tasks, dispatch}}>
    {children}
  </TasksContext.Provider>
};
