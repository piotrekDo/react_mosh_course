# React Rounter
Biblioteka pozwalająca na przekierowywanie użytkownika do podstron.
`npm i react-router-dom` w kursie `npm i react-router-dom@6.10.0` 
Różne wersje React Router mogą się znacznie różnić, warto więc trzymać się jednej dobrze znanej. 

W nowej wersji Routera zapisujemy klasę Routera zawierającą ścieżki w aplikacji: 
```
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../state-management/HomePage';
import UserListPage from './UserListPage';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/users', element: <UserListPage /> },
]);

export default router;
```

Następnie w **main.tsx**:   
Nadpisujemy App poprzez Provider dostarczony z :
```
import { RouterProvider } from 'react-router-dom';
```
  
A także obiekt routera zapisany wcześniej:
```
import router from './routing/routes';
```

```
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools/>
    </QueryClientProvider>
  </React.StrictMode>
);
```

## Komponent Link vs a
Domyślnym zachowaniem elementu `<a>` jest odświeżenie strony przy przekierowaniu, React Router udostępnia komponent `<Link to='/'>` nadpisujący to zachowanie.

```
import { Link } from "react-router-dom";
<Link to='/users'>Users</Link>
```

## NavLink
Działa tak samo jak Link, ale nadaje klasę `active` dla wybranej ścieżki. Pozwala na ostylowanie takiego linku aby wyglądał na zaznaczony. Klasa active jest domyślnie nadawaną, można nadpisać to zachowanie poprzez zapis funkcji: `className={({isActive}) => isActive ? 'highlighted nav-link' : 'nav-link'}>` i zmianę active na highlighted.

## Przekierowania- hook navigate
Wykorzystując hook `useNavigate` otrzymujemy obiket na którym możemy przekierować użytkownika pod wskazany adres. 

```
import { useNavigate } from 'react-router-dom';

const ContactPage = () => {
  const navigate = useNavigate();
  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        // Redirect the user to the home page
        navigate('/');
      }}
    >
      <button className='btn btn-primary'>Submit</button>
    </form>
  );
};

export default ContactPage;
```

## Parametry, podstrony. Przekierowania dynamiczne
Parametry przekazywane są po dwukrpoku jak poniżej: `/users/:id` co onzacza dynamiczne przekierowania do stron `/users/1` lub `/users/2` itd. 

```
const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/users', element: <UserListPage /> },
  { path: '/users/:id', element: <UserDetailPage /> },
  { path: '/contact', element: <ContactPage /> },
]);

export default router;
```

Następnie w komponencie wykorzystujemy komponent Link do którego przekazujemy dynamiczny adres.

```
import { Link } from "react-router-dom";

const UserListPage = () => {
  const users = [
    { id: 1, name: 'Mosh' },
    { id: 2, name: 'John' },
    { id: 3, name: 'Alice' },
  ];
  return (
    <ul className="list-group">
      {users.map((user) => (
        <li className="list-group-item" key={user.id}>
          <Link to={`/users/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  );
};

export default UserListPage;
```

## Uzyskiwanie parametrów link w komponencie
Przechodząc pod dynamiczny adres, w komponencie do którego trafiamy musimy usykać dostęp np. do ID przekazanego obiektu aby móć o niego odpytać API. 

### Hook `useParams()` 
Pochodzący z importu `import { useParams } from 'react-router-dom';` zwraca obiekt przechowujący informacje o przekazanych parametrach w postaci obiektu. Faktyczna wartość parametru jest **string** np obiekt `{id: '1'}` trzeba o tym pamiętać odpytując API o numer ID.

### useSearchParams()
Pochodzący z importu `import { useParams } from 'react-router-dom';` udostępnie dane o parametrach przekazanych w żądanniu, przy ich wydruku trzeba pamiętać o `toString()` inaczej nic nie zobaczymy co sprawia wrażenie błędu.
np. conole log dla `http://localhost:5173/users/1?name=User&age=35` wyświetli: `name=User&age=35`.

```
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.toString());
```

Dostęp do konkretnego parametru można uzyskać z pomocą metody `get();`.
`console.log(searchParams.get('name'))`

udostępniana funkcja `setSearchParams` pozwala manipulować tymi wartościami ale powinna byc wykorzystywana jedynie w event handlerach lbu useEffect.

## useLocation
Udostępnia komplet danych na temat obecnej lokacji, parametrów, linków. 

## Zagnieżdżenia

W celu wyświetlenia zagnieżdżonych widoków wykorzystujemy komponent `Outlet` w którym wyświetlane są zagnieżdżenia.

```
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = () => {
  return (
    <>
      <NavBar />
      <div id="main">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
```

W klasie routera w takim przypadku dopisujemy `children` do obiektu RouteObject. Co ważne to zagnieżdżone ścieżki są **relatywne** i nie poprzedamy ich ukośnikiem.
```
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'users', element: <UserListPage /> },
      { path: 'users/:id', element: <UserDetailPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
]);

export default router;
```

## Error
Od wersji 6 wystarczy zapis `errorElement` do którego można dopisać wymagany komponent, np strona główna. Pozwala to rónież na wyłapanie błędu i wyświetlenie błędu na ekranie z pomocą hooka `useRouteError()`

```
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <HomePage />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'users', element: <UserListPage />, children: [{ path: ':id', element: <UserDetailPage /> }] },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
]);
```

dodatkowo pochodząca z `react-router-dom` funkcja `isRouteErrorResponse(error)` wymagająca przekazania błędu pochodzącego z hooka pozwala rozróżnić sytuację niepoprawnego URL od faktycznego błędu, który wystąpił w aplikacji. 

## Private routes
Pozwalają ogranicznyć dostęp do zasobu np. tylko dla zalogowanego użytkownika. PATRZ GUARDY Z ZAJĘĆ CODECOOL
```
import { Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import AppContext from '../context/AppContext';

export const AdminGuard = ({ children }: React.PropsWithChildren) => {
  const context = useContext(AppContext);
  const isAdmin = !context.currentUser ? false : context.currentUser?.roles.indexOf('admin') > -1;
  console.log(isAdmin)


  if (!isAdmin) {
    return <Navigate to={'/'} replace />;
  }

  return <>{children}</>;
};

export default AdminGuard;
```


