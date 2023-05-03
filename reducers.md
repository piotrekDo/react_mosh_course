# Reducer
_Reducer to funkcja pozwalająca scentralizować stan w komponencie._
Pozwala wydzielić logikę zarządzania stanem w jedno konkretne miejsce- dla prostego przykładu można przedstawić komponent bazujący na `useState` przechowujący licznik kliknięć i logikę do inkrementacji zapisaną wewnątrz komponentu. W bardziej rozbudowanym przykładzie moglibyśmy mieć logikę tą rozsianą po całej aplikacji co utrudnia nią zarządzanie. 

Funkcja reducera powinna przyjmować 2 argumenty- **obecny stan obiektu**, oraz drugi argumnt w postaci **funkcji/akcji** odpowidającą za zmianę tego stanu. W rezultacie powinna zwracać **nowy stan** obiektu. Jako niepisaną zasadę akcję reducera definiuje się jako string czy enum i wg. niej sama funkcja reducera podejmuje jakąś czynność. Na przykład w zależności od wybranej akcji możemy zinkrementować wspomnianą wartość lub ją zresetować:
```
interface Action {
  type: 'INCREMENT' | 'RESET';
}

const counterReducer = (state: number, action: Action): number => {
  if (action.type === 'INCREMENT') return state + 1;
  if (action.type === 'RESET') return 0;
  return state;
};

export default counterReducer;
```

# useReducer
`useReducer` może być postrzegany jako bardziej zaawansowany `useState` wymaga przekazania wspomnianej funkcji reducera oraz wartości początkowej na któej operuje, wartością tą mogą być nie tylko liczby czy inne prymitywy, ale również złożone obiekty. Zwraca tablicę 2 wartości- **wartosć** oraz **dispatch** czyli funkcję określającą rodzaj podejmowanej akcji w reducerze. `Dispatch` wymaga przekazania akcji określonej w funkcji `reducer`

```
import { useReducer } from 'react';
import counterReducer from './reducers/counterReducer';

const Counter = () => {
  const [value, dispatch] = useReducer(counterReducer, 0);

  return (
    <div>
      Counter ({value})
      <button
        onClick={() => dispatch({type: 'INCREMENT'})}
        className="btn btn-primary mx-1"
      >
        Increment
      </button>
      <button
        onClick={() => dispatch({type: 'RESET'})}
        className="btn btn-primary mx-1"
      >
        Reset
      </button>
    </div>
  );
};

export default Counter;
```

# Złożony reducer
Poniżej scenariusz reducera zarządzającego stanem tablicy zadań. W tym przypadku przewidujemy, że zadania można dodawać lub usuwać. Wcześniej `action` określane było jedynie poprzez naazwę- _string_, teraz mamy zdefiniowane osobne interfejsy na każdy przypadek akcji, jako że mogą się różnić przyjmowanymi akrumentami- `payload`. Jeżeli chcemy dodać nowy _Task_ oczekujemy go jako argument, do usuwania natomiast wystarczy samo jego ID. Następnie definiujemy `type` w podobny sposób jak `action` w uproszczonym przykładzie. Sam reducer można oprzeć na switch'u.

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

type TaskAction = AddTask | DeleteTask;

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

**KOMPONENT**
```
import { useReducer } from 'react';
import tasksReducer from './taskReducer';

const TaskList = () => {
  const [tasks, dispatch] = useReducer(tasksReducer, []);

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