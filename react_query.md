# React Query
React Qury pozwala zarządzać ządaniami HTTP umożliwiając np. anulowanie żądania, ponownienie go, caching i wiele innych funkcjonalności. 

### Caching
_Proces przechowywania danych w miejscu dostępnym szybciej i efektywniej w przyszłości_  
Dla przykładu, w aplikacji front-endowej można przechowywać często żądane infromacje w przeglądarce użytkownika by zoptymalizować proces ich uzyskiwania. 

## Instalacja
`npm i @tanstack/react-query` w kursie `npm i @tanstack/react-query@4.21`  
  
W Main.tsx:
```
import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

Należy 
- zaimportować `import { QueryClient, QueryClientProvider } from '@tanstack/react-query';`
- utworzyć instancję _Query Client_ `const queryClient = new QueryClient();`
- owrapować aplikację providerem i przekazać do niego utwrzoną instancję _Query Client_

## Fetching Data
Do pobierania danych wykorzystujemy `useQuery`. Hook wymaga konfiguracji 2 rzeczy:
- **_query key_**, oryginaly identyfikator wykorzystywany w caching. Umożliwia pozyskiwanie danych w odwołaniu do tego klucza właśnie. Przypisujemy do niego tablicę z jedną lub wieloma wartościami. Pierwszą jest zazwyczaj string opisujący rodzaj przechowywanych danych. 
- **_query function_** funkcja wykorzystywana do faktycznego pobierania danych z back-endu, musi zwracać _promise_, np. _Axios.get()_. W przypadku **Axios**, zwracającego obiekt response warto dopisać `then(res => res.data)` aby uzyskać faktyczne dane.

```
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

const TodoList = () => {
  const fetchTodos = () => axios.get<Todo[]>('https://jsonplaceholder.typicode.com/todos').then(res => res.data);

  const {data} = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  // if (error) return <p>{error}</p>;

  return (
    <ul className='list-group'>
      {data?.map(todo => (
        <li key={todo.id} className='list-group-item'>
          {todo.title}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
```

### Error handling
Hook `useQury` zwraca props `error`. Nie można go jednak zwyczajnie zrenderować, poniważ _React Query_ nie wie jakim narzędziem się posługujemy, aby skonfigurować te ustawienia wykorzystuje się typ generyczny oczekujący kilku argumentów przy zapisie _useQuery<>_ 
- pierwszym generykiem jest typ danych, jakiego oczekujemy w żądaniu,
- drugim jest rodzaj błędu, w przypadku _Axios_ jest to przeglądarkowy interfejs **Error**
Prawidłowy zapis hooka powinien więc wyglądać następująco:
```
  const {data, error} = useQuery<Todo[], Error>({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  if (error) return <p>{error.message}</p>;
```

Teraz można odwołać się do jednego z propsów Error, np. message. 

### Loadery
Obiekt query posiada props `isLoading` do którego można się odwołać aby wyświetlić loader lub skeleton.

## Custom Query Hook
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
      });
}

export default useTodos;
```

W komponencie:
```
import useTodos from '../hooks/useTodos';

const TodoList = () => {

  const {data, error, isLoading} = useTodos();
```

## Ustawienia dodatkowe
Ustawienia konfiguracyjne przekazujemy w pliku `Main.tsx` do tworzonego obiektu `QueryClient`
- `retry: 3` przyjmuje int oznaczający ilość ponowień zapytań w przypadku błędów.
- `cacheTime: 300_000` oznacza czas w ms jaki dane są cachowane. Jeżeli dane nie są obserwowane, to po tym czasie zostają usunięte z pamięci przeglądarki.
- `staleTime: 0` oznacza, jak długo pobrane dane są _świerze_ Po upłynięciu tego czasu React pobierze dane ponownie, jeżeli są potrzebne. Zmiana tej wartośći oznacza, że w sytuacji, gdzie ktoś spamuje pobranie nowych danych, żądanie nie zostanie wysłane. Czas w ms.
React pobiera takie dane ponownie w sytuacji gdy usyskamy ponownie połączenie z internetem, komponent jest budowany, okno jest re-focusowane. Oznacza to, że **dane są pobierane ponownie** gdy np. przełączymy się pomiędzy kartami przeglądarki. Dostępne są więc 3 kolejne ustawienia, domyślnie każde jako _true_
    - `refetchOnWindowFocus: true` np. przełączanie kart
    - `refetchOnReconnect: true` reconnect z netem
    - `refetchOnMount: true` pobranie danyc na budowę komponentu, **raczej nie zmieniać**

```
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      cacheTime: 300_000,
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true
    }
  }
});
```

Powyższe ustawienia są globalne, można je nadpisywać w konkretnym hooku przekazując kolejne wartości w konfiguracji, po kluczu i funkcji do pobierania danych. Np: 

```
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

## React Qiuery DevTools
`npm i @tanstack/react-query-devtools` w kursie `npm i @tanstack/react-query-devtools@4.28`

```
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools/>
    </QueryClientProvider>
  </React.StrictMode>
);
```