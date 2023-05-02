# React Query mutacje
Odpowiadają za wysłyanie danych do backendu, pozwalają na manipulowanie widokiem w czasie wysyłania żądania, np. tzw. 'positive scenario'.

obsługiwane są w hooku `useMutation` przyjmującym funkcję `mutatationFn` do której przekazujemy żądanie axios.
Hook `useMutation` jest generyczny i powinniśmy ustalić 3 argumenty: **1** dane otrzymane z backendu, **2** typ błędu, **3** dane otrzymane z backendu: `useMutation<Todo, Error, Todo>`
Mutacja udostępnia zawszę funkcję `mutate` do której przekazujemy wysyłany obiekt i wykona się w ramach `mutatuonFn`. Mutacje udostępniają też szereg funkcji `onxxx` jak `onSuccess` czy `onError` które możemy wywołać w przypadku udanego żądania czy wystąpienia błędu. `onSettled` oznacza funkcję wywoływaną niezależnie od rezultatu jak blok `finally`.  Funkcja `onSeccess` przyjmuje 2 argumenty- obiekt otrzymany w odpowiedzi na żądanie z backendu, oraz wysłany obiekt. Obiekt otrzymany należy ustanowić w metodzie `axios.post<TypZwraacany>()`.
Następnie chcąc zodyfikować wyświetlane dane można odwołać się do kleinta React Query, tworzonego w Main.tsx.
Wykorzystuje się do tego hook `const queryClient = useQueryClient()`
- **_invalidate cache_** można _unieważnić_ posiadane dane co spowoduje ich ponowne pobranie z backendu.
na obiekcie `queryClient` wywołać funkcję `invalidateQueries` i do niej przekazać klucz.
    ```
    onSuccess: (savedTodo, sentTodo) => {
        queryClient.invalidateQueries({
        queryKey: ['todos'],
        });
    }
    ```
- **_updating catche_** można również 'ręcznie' zaktualizować catche o nowy element bez potrzeby pobierania wszystkich danych z serwera. Tym razem wykorzystana jest funkcja generyczna `setQueryData` oczekująca 2 argumentów- klucza do danych oraz funkcji updatującej. Samo `setQueryData` jest generyczne od typu danych na jakim operujemy. Zapis `...(todos || [])` przewiduje pustą tablicę, np. gdy dodajemy pierwszy obiekt. Pozwala to więc uniknąc błedu, gdzie nie ma na czym wywołać spread.
    ```
    onSuccess: (savedTodo, sentTodo) => {
        queryClient.setQueryData<Todo[]>(['todos'], todos => [savedTodo, ...(todos || [])])
    },
    ```

## Error && isLoading
Obsługa błędów jest ponownie prosta i zwraca props error 
`{addTodo.error && <div className="alert alert-danger">{addTodo.error.message}</div>}`

Ew spinnery można obsłużyc poprzez props `isLoading`


# Przykład z optimistic update

```
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { Todo } from '../hooks/useTodos';
import axios from 'axios';

interface AddTodoContext {
  previousTodos: Todo[];
}

const TodoForm = () => {
  const queryClient = useQueryClient();
  const addTodo = useMutation<Todo, Error, Todo, AddTodoContext>({
    mutationFn: (todo: Todo) =>
      axios.post<Todo>('https://jsonplaceholder.typicode.com/todos', todo).then(res => res.data),
    onMutate: (newTodo: Todo) => {
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']) || [];
      queryClient.setQueryData<Todo[]>(['todos'], todos => [newTodo, ...(todos || [])]);
      if(ref.current) ref.current.value = '';
      return {previousTodos};
    },
    onSuccess: (savedTodo, sentTodo) => {
      queryClient.setQueryData<Todo[]>(['todos'], todos => todos?.map(todo => todo === sentTodo ? savedTodo : todo))
     
    },
    onError: (error, sentTodo, context) => {
      if(!context) return;
      queryClient.setQueryData<Todo[]>(['todos'], context.previousTodos);
    }
  });
  const ref = useRef<HTMLInputElement>(null);

  return (
    <>
    {addTodo.error && <div className="alert alert-danger">{addTodo.error.message}</div>}
    <form
      className='row mb-3'
      onSubmit={event => {
        event.preventDefault();
        if (ref.current && ref.current.value) {
          addTodo.mutate({
            id: 0,
            title: ref.current.value,
            completed: false,
            userId: 1,
          });
        }
      }}
    >
      <div className='col'>
        <input ref={ref} type='text' className='form-control' />
      </div>
      <div className='col'>
        <button disabled={addTodo.isLoading} className='btn btn-primary'>
          {addTodo.isLoading ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
    </>
  );
};

export default TodoForm;
```


```
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Todo {
    id: number;
    title: string;
    userId: number;
    completed: boolean;
  }

const useTodos = () => {
    const fetchTodos = () => axios.get<Todo[]>('https://jsonplaceholder.typicode.com/todos').then(res => res.data);

    return useQuery<Todo[], Error>({
        queryKey: ['todos'],
        queryFn: fetchTodos,
        staleTime: 10 * 1000 //10sec
      });
}

export default useTodos;
```