# Powtórka z React Query

React Qury to biblioteka upraszczająca proces pobierania i wysyłania danych oraz _cachowania_. Udostępnia dwa główne hooki- `useQuery` oraz `useMutation`.

**Caching** to proces przechowaywania danych w miejscu, gdzie są one szybko i łatwo dostępne dla aplikacji. Dzięki temu można przechowaywać w przeglądarce często wykorzystywane dane bez potrzeby wysyłania zapytań HTTP każdorazowo.

## Setup

`npm i @tanstack/react-query` w kursie `npm i @tanstack/react-query@4.21`

**Wewnątrz Main.tsx**  
`import { QueryClient, QueryClientProvider } from '@tanstack/react-query';`
Stworzyć instancję queryClient, owrapować aplikację providerem:

```
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

## Custom query hook i API

## React Query DevTools

`npm i @tanstack/react-query-devtools` w kursie `npm i @tanstack/react-query-devtools@4.28`  
**Wewnątrz main.ts** `import { ReactQueryDevtools } from '@tanstack/react-query-devtools';`  
Komponent _DevTools_ dodajemy po aplikacji, wewnątrz `QueryClientProvider`

```
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

Po dodaniu devtools do projektu, widac w lewym, dolnym rogu ikonę devtools

## Podstawy: Pobieranie danych

Do pobierania dancych wykorzystywany jest hook `useQuery` przyjmujący 2 parametry:

- **_klucz_** unikalny, wykorzystywany w _caching_. Zapisywany w postaci tablicy z jedną lub więcej wartośći. Pierwszą jest an ogół string, opisujący dane.
- **_funkcja pobierająca dane_** odpowiada za pobranie danych, musi zwracać `Promise`
  Funkcja poniżej zwraca `Promise` od tablicy Todo, w chwili jego rozwiązania, dane zostaną zapisane w Cache.

```
const fetchTodos = () =>
  axios
  .get<Todo[]>('https://jsonplaceholder.typicode.com/todos')
  .then(res => res.data)

const query = useQuery({
  queryKey: ['todos'],
  queryFn:
})
```

Hook `useQuery` zwróci obiekt zawierający szereg wartośći jak `data`, `isLoading`, `error` i wiele innych. Tak zapisane `useQuery` **zapewnia auto re-try** jak również auro refresh po określonym czasie.

### Errors / Loading

Hook `useQuery` zwraca obiekt zawierający pros `error` do którego można się odwołać przy obsłudze błędów. Dla poprawnego działania hooka należy zdefiniować typ error, który może wystąpić, **dla Axios jest to interface Error** stosowany w przeglądarkach, i udostępnia wartośći jak `cause, message, name`.

Do wyświetlania loading wykorzystujemy props `isLoading`, do którego można się odnieść w komponencie.

Poprawiony zapis hooka wygląda następująco:

```
const fetchTodos = () =>
  axios
  .get<Todo[]>('https://jsonplaceholder.typicode.com/todos')
  .then(res => res.data)

const {data: todos, error, isLoading} = useQuery<Todo[], Error>({
  queryKey: ['todos'],
  queryFn:
})
```

### Ustawienia `useQuery`

Podczas tworzenia `QueryClient` można przekazać obiekt zawierający ustawienia nadpisujące domyślne.

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

- **cacheTime** oznacza czas przechowywania danych w sytuacji, gdzie nie są one obserwowane przez żaden komponent przez X czasu. Obserwujący komponent to komponent _zamontowany_, wykorzystujący dane z hooka.
- **staleTime** oznacza czas przez jaki dane są uznawane za _świeże_. Domyślną wartością jest 0, oznaczające, że ReactQuery zawsze będzie pobierał nowe dane. **ReactQuery automatycznie odświeża takie dane** w 3 przypadkach
  - przy ponowieniu połączenia internetowego,
  - gdy komponent jest tworzony,
  - gdy okno przeglądarki jest _refocused_ (przełączane)
- Kolejne trzy ustawienia zarządzają powyższym zachowaniem: `refetchOnWindowFocus`, `refetchOnReconnect`, `refetchOnMount`.

**Wszystkie ustawiania można nadpisać w konkretnych `useQuery`**

```
const useTodos = () => {
    return useQuery<Todo[], Error>({
        queryKey: ['todos],
        queryFn: todoService.getAll,
        staleTime: 10 * 1000 //10sec
      });
}
```

### Żądania parametryzowane oraz zaawansowane klucze
Stosuje się je przy przekazywaniu parametru do budowy hooka:  
`  const {data, error, isLoading} = usePosts(userId);`  
Następnie należy zmodyfikować sam hook aby przyjmował parametr, tutaj również zmianie ulegnie klucz. Konwencją jest zapis zgodny z url backendu, np. '/users/1/posts. Klucz powinien przyjmować więc 3 wartości. Zasada działania takiej tablicy klucza jest podobna do zależności w `useEffect`- gdy jedna z wartości ulegnie zmienie, nowe dane zostaną pobrane. 
```
const usePosts = (userId: number | undefined) =>
  useQuery<Post[], Error>({
    queryKey: ['users', userId, 'posts'],
    queryFn: () => 
    axios
      .get<Post[]>('https://jsonplaceholder.typicode.com/posts', 
        params: {
          userId
        })
      .then(res => res.data),
    staleTime: 1 * 60 * 1000,
  });
```

### Paginacja
Zapisując hook dobrym podejściem jest zdefiniowanie interfejsu określającego _query_, zawierające numer strony oraz jej rozmiar. Trzeba też przetrzymywać te dane wewnątrz komponentu w `useState`. Nie jest to wymóg `reactQuery` ale jeden ze sposóbów na osiągnięcie paginacji.   
**keepPreviousData** pozwala na uzyskanie lepszego doświadczenia poprzez wyświetlanie obecnych danych do czasu uzyskania kolejnych. Jednocześnie należy się odwoływać do `isFetching` zamiast isLoading!
  
**HOOK**  
  
```
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface PostQuery {
  page: number;
  pageSize: number;
}

const usePostsPagination = (query: PostQuery) => {
  return useQuery<Post[], Error>({
    queryKey: ['posts', query],
    queryFn: () => {
      return axios
        .get<Post[]>('https://jsonplaceholder.typicode.com/posts', {
          params: {
            _start: (query.page - 1) * query.pageSize,
            _limit: query.pageSize,
          },
        })
        .then(res => res.data);
    },
    staleTime: 1 * 60 * 1000, // 1mminuta
    keepPreviousData: true,
  });
};

export default usePostsPagination;
```
  
**Komponent**
    
```
import { useState } from 'react';
import usePostsPagination from '../hooks/usePostsPagination';

const PostListPagination = () => {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const { data: posts, error, isLoading } = usePostsPagination({ pageSize, page });

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  return (
    <>
      <ul className='list-group'>
        {posts.map(post => (
          <li key={post.id} className='list-group-item'>
            {post.title}
          </li>
        ))}
      </ul>
      <button onClick={() => setPage(page - 1)} disabled={page === 1} className='btn btn-primary'>
        Previous
      </button>
      <button onClick={() => setPage(page + 1)} className='btn btn-primary'>
        Next
      </button>
    </>
  );
};

export default PostListPagination;

```

### Infinite Query (na przycisk _load more_) && endless scroll
W odróznieniu od zwykłej paginacji, przy _infinite query_ stosujemy hook `useInfiniteQuery`. Nie prowadzimy też już rejestru obecnej strony. Zamiast tego należy dopisywać kolejne dane do już wcześniej pobranych i wyświetlać całość. Wewnątrz `useInfiniteQuery` należy zaimplementować funcję `getNextPageParam` odpowiedzialną za określanie czy istnieją kolejne dane do pobrania **w skrócie, zwraca kolejny numer strony**. Problematyczny staje się koniec listy, zależny od implementacji po stronie backend. `getNextPageParam` zwraa ostatnią stronę, więc w rzeczywistości mamy dostęp do danych, generowanych przez springowe `Page`. Przy naciśnięciu `load more` React wywoła tę funkcję i przekaże jej wynik do `queryFn`, stąd musi ona przyjmować dodatkowy parametr. Można go zdestrukturyzować do postaci `pageParam` i zainicjować jako 1 co wywoła pierwszą stronę.

```
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface PostQuery {
  pageSize: number;
}

const usePostPaginationInfiniteQuery = (query: PostQuery) => {
  return useInfiniteQuery<Post[], Error>({
    queryKey: ['posts', query],
    queryFn: ({ pageParam = 1 }) => {
      return axios
        .get<Post[]>('https://jsonplaceholder.typicode.com/posts', {
          params: {
            _start: (pageParam - 1) * query.pageSize,
            _limit: query.pageSize,
          },
        })
        .then(res => res.data);
    },
    staleTime: 1 * 60 * 1000, // 1mminuta
    keepPreviousData: true,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });
};

export default usePostPaginationInfiniteQuery;

```
  
Wewnątrz komponentu w ramach hooka, pobieramy dodatkowo funkcję `fetchNextPage` udostępnianą przez `useInfiniteQuery` i przypisujemy ją do przycisku _Load more_. Zwracane dane nie zawierają już poprostu tablicy Posts. `useInfiniteQuery` zwraca obiekt `InfiniteData<Post[]>` zawierający parametry `pages` oraz `pageParams`. Pages zawiera teraz konkretne strony, zawierające posty które trzeba wyrenderować z osobna. Niestety JS domyślnie nie posiada funkcji `flatMap`. Trzeba więc mapować każdą stronę z postami, owrapowaną we Fragment i wewnątrz niego dopiero renderować konkretne posty. 

```
import { Fragment } from 'react';
import usePostPaginationInfiniteQuery from '../hooks/usePostPaginationInfiniteQuery';

const PostListPaginationInfinite = () => {
  const pageSize = 10;
  const { data, error, isLoading, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage } =
    usePostPaginationInfiniteQuery({
      pageSize,
    });

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  return (
    <>
      <ul className='list-group'>
        {data.pages.map((page, index) => (
          <Fragment key={index}>
            {page.map(post => (
              <li key={post.id} className='list-group-item'>
                {post.title}
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
      <button disabled={isFetchingNextPage || !hasNextPage} onClick={() => fetchNextPage()} className='btn btn-primary'>
        {!isFetchingNextPage ? 'Load more' : 'Loading...'}
      </button>
    </>
  );
};

export default PostListPaginationInfinite;

```

### Infinite scroll
Do zaimplementowania inifinite scroll należy skorzystać z [biblioteki](https://www.npmjs.com/package/react-infinite-scroll-component).
`npm install --save react-infinite-scroll-component`  
Następnie wystarczy owrapować kod odpowiedzialny za wyświetlanie treści w tag `<InfiniteScroll>` zaimportowany jako `import InfiniteScroll from 'react-infinite-scroll-component';`.
Sam tak wymaga przekazania kilku konfiguracji:
```
    <InfiniteScroll 
      dataLength={fetchedGamesCount}
      hasMore={!!hasNextPage}
      next={() => fetchNextPage()}
      loader ={<Spinner />}>
```
- `dataLength` oznacza ilość już pobranych danych, można wykorzystać funkcję reduce: `const fetchedGamesCount = data?.pages.reduce((total, page) => total + page.results.length, 0) || 0;` Konieczny jest dodatkowy warunek `|| 0` ponieważ reduce może zwrócić undefined, którego nie akceptuje funkcja. Musimy przekazać jakąś wartość liczbową.
- `hasMore` można przypisać do `hasNextPage` pochodzącego z `useInfiniteQuery` tutaj koniecznie bang operator, ponieważ również może pojawić się undefined. 
-  `next` oczekuje funkcji dociągającej kolejne dane. Ponownie nada się funkcja z `useInfiniteQuery`
- `loader` oczekuje spinnera albo skeleton. 

```
import { useInfiniteQuery } from '@tanstack/react-query';
import APIClient, { FetchResponse } from '../services/apiClient';
import { Platform } from './usePlatforms';
import { GameQuery } from '../App';

export interface Game {
  id: number;
  name: string;
  background_image: string;
  parent_platforms: { platform: Platform }[];
  metacritic: number;
  rating_top: number;
}

const apiClient = new APIClient<Game>('/games');

const useGames = (gameQuery: GameQuery) =>
  useInfiniteQuery<FetchResponse<Game>, Error>({
    queryKey: ['games', gameQuery],
    queryFn: ({pageParam =1}) => {
      return apiClient.getAll({
        params: {
          genres: gameQuery.genre?.id,
          parent_platforms: gameQuery.platform?.id,
          ordering: gameQuery.sortOrder,
          search: gameQuery.searchTag,
          page: pageParam
        },
      });
    },
    keepPreviousData: true,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.next ? allPages.length + 1 : undefined;
    }
  });

export default useGames;
```

**KOMPONENT**
```
import { SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import useGames from '../hooks/useGames';
import { GameCard } from './GameCard';
import { GameCardSkeleton } from './GameCardSkeleton';
import { GameCardContainer } from './GameCardContainer';
import { GameQuery } from '../App';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
  gameQuery: GameQuery;
}

export const GameGrid = ({ gameQuery }: Props) => {
  const { data, error, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useGames(gameQuery);
  const skeletons = [1, 2, 3, 4, 5, 6];

  if (error) return <Text>{error.message}</Text>;

const fetchedGamesCount = data?.pages.reduce((total, page) => total + page.results.length, 0) || 0;

  return (
    <>
    <InfiniteScroll 
      dataLength={fetchedGamesCount}
      hasMore={!!hasNextPage}
      next={() => fetchNextPage()}
      loader ={<Spinner />}>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} padding='10px' spacing={6}>
        {isLoading &&
          skeletons.map(skeleton => (
            <GameCardContainer key={skeleton}>
              <GameCardSkeleton />
            </GameCardContainer>
          ))}
        {data?.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.results.map(game => (
              <GameCardContainer key={game.id}>
                <GameCard game={game} />
              </GameCardContainer>
            ))}
          </React.Fragment>
        ))}
      </SimpleGrid>
      </InfiniteScroll>
    </>
  );
};
```