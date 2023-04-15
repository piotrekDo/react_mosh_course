[Generyczny serwis i implementacja](#generyczny-serwis-i-implementacja)
[Custom Data Fetching Hook](#custom-data-fetching-hook)

<br>
<br>

## Pobieranie danych z serwera
Dla celu zmockowania backendu można się posłużyć serwisem [{JSON}Placeholder](https://jsonplaceholder.typicode.com/). Udostępnia on różne end-pointy zapewniające _dummy data_.
W celu obługi żądań HTTP można wykorzystać metodę `fetch` implmenetowaną przez wszystkie nowoczesne przeglądarki. Dzięki Bogu jednak, istnieje bibliotka **Axios**

## Axios
`npm i axios` w kursie @1.3.4,  
następnie import: `import axios from 'axios'`


### Metoda GET
Przyjmuje argument w postaci adresu URL, warto zdefioniować wartość zwracaną
```
axios.get<User[]>('https://jsonplaceholder.typicode.com/users')
```


```
import axios from 'axios';
import { useEffect, useState } from 'react';

interface User {
  id: number,
  name: string
}

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get<User[]>('https://jsonplaceholder.typicode.com/users')
    .then((response) => setUsers(response.data))
  }, []);

  console.log(users)
  return <ul>
    {users.map(user => <li key={user.id}>{user.name}</li>)}
  </ul>;
}

export default App;
```

### Błędy
W ramach bloku catch można przechwycić błąd zwracany przez Axios, zawiera on wiele cennych informacji jak 
- code np BAD_REQUEST
- message
i kilka innych do wglądu w console.log

**Można zdefiować useState** dla błędu i na jego podstawie, warunkowo wyświetlać komunikat dla użytkownika.
```
function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get<User[]>('https://jsonplaceholder.typicode.com/xusers')
    .then((response) => setUsers(response.data))
    .catch((error) => setError(error.message))
  }, []);

  console.log(users)
  return <>
  {error && <p className='text-danger'>{error}</p>}
  <ul>
    {users.map(user => <li key={user.id}>{user.name}</li>)}
  </ul>
  </>
}

export default App;
```

### Anulacja żądania- AbortController
AbortController to obiekt wbudowany w nowoczesne przeglądarki, pozwala przerwać asynchroniczne żądanie w przypadku, gdzie dane nie są już potrzebne, np. gdy użytkownik opóści stronę. Wywoływany jako _cleanup_ w hooku.
Tworzymy obiekt `AbortController` i przekazujemy go jako drugi argument dla `get` w formie konfiguracji `{ signal: controller.signal }`. Odowłujemy się do niego w w cleanup `return () => controller.abort();`.
Referencja `CanceledError` musi zostać zaimportowana a axios.

```
import axios, { CanceledError } from 'axios';
...


  useEffect(() => {
    const controller = new AbortController();
    axios
      .get<User[]>('https://jsonplaceholder.typicode.com/users', { signal: controller.signal })
      .then(response => setUsers(response.data))
      .catch(error => {
        if (error instanceof CanceledError) return;
        setError(error.message);
      });

    return () => controller.abort();
  }, []);
```

### Loader
Niestety z jakiegoś powodu w trybie developerskim nie działa zamknięcie loadera w bloku `finally` więc trzeba to robić w `then` oraz `catche`.

```
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    axios
      .get<User[]>('https://jsonplaceholder.typicode.com/users', { signal: controller.signal })
      .then(response => {
        setUsers(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        if (error instanceof CanceledError) return;
        setError(error.message);
        setIsLoading(false);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, []);
```

## Delete

Poniżej implementacja metody `deleteUser` zakłądającej tzw. **optimistic update** w której zakładamy, że na ogół wszystko pójdzie dobrze, zatem odrazu uaktualniamy UI bez potrzeby żądania całej listy. 

```
function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const originalUsers = [...users];

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    axios
      .get<User[]>('https://jsonplaceholder.typicode.com/users', { signal: controller.signal })
      .then(response => {
        setUsers(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        if (error instanceof CanceledError) return;
        setError(error.message);
        setIsLoading(false);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, []);

  const deleteUser = (user: User) => {
    setUsers(users.filter(u => u.id !== user.id));
    axios.delete(`https://jsonplaceholder.typicode.com/xusers/${user.id}`).catch(err => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  return (
    <>
      {isLoading && <div className='spinner-border'></div>}
      {error && <p className='text-danger'>{error}</p>}
      <ul className='list-group'>
        {users.map(user => (
          <li key={user.id} className='list-group-item d-flex justify-content-between'>
            {user.name}{' '}
            <button className='btn btn-outline-danger' onClick={() => deleteUser(user)}>
              Ddelete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
```

## Post 
Podobnie z podejściem **optimistic update**

```
  const addUser = () => {
    const newUser = {id: 0, name: 'New user'}
    setUsers([...users, newUser])

    axios.post('https://jsonplaceholder.typicode.com/xusers', newUser)
    .then(res => setUsers([...users, res.data]))
    .catch(error => {
      setError(error.message);
      setUsers(originalUsers)
    })
```

## Z metodą update nie ma różnycy
W sytuacji optymistycznej trzeba zmappować zainteresowany obiekt na zmieniony np.
`setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u))`

korzystamy zmetod `axios.put` albo `axios.patch`.

<br>
<br>

## Custom API Client

Metoda `create` wywołana na obiekcie `axios` pozwala stworzyć klienta, z którego będziemy korzystali, można także _przeeksportować_ `CanceledError` importując go w kliencie i z klienta w klasie co pozwoli zachować spójność.

```
import axios, {CanceledError} from 'axios';

export default axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    // headers: {}
});

export {CanceledError};
```

Następnie w zainteresowanej klasie:
```
import apiClient, { CanceledError } from './services/api-client';

apiClient.get<User[]>('/users', { signal: controller.signal })
```

Taki zapis pozwala wydzielić i częściowo ukryć adres backendu

<br>
<br>

## UserService
Wydzielenie osobnego serwisu dla żądań HTTP uprości kod w klasie zainteresowanej:

```
import apiClient from './api-client';

export interface User {
  id: number;
  name: string;
}

class UserService {
  getAllUsers() {
    const controller = new AbortController();
    const request = apiClient.get<User[]>('/users', { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  deleteUser(user: User) {
    return apiClient.delete(`/users/${user.id}`);
  }

  addUser(newUser: User) {
    return apiClient.post('/users', newUser);
  }

  updateUser(updateUser: User) {
    return apiClient.patch(`/users/${updateUser.id}`, updateUser);
  }
}

export default new UserService();
```

**Klasa:**

```
import { useEffect, useState } from 'react';
import { CanceledError } from './services/api-client';
import userService, { User } from './services/user-service';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const { request, cancel } = userService.getAllUsers();
    request
      .then(response => {
        setUsers(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        if (error instanceof CanceledError) return;
        setError(error.message);
        setIsLoading(false);
      })
      .finally(() => setIsLoading(false));

    return () => cancel();
  }, []);

  const deleteUser = (user: User) => {
    const originalUsers = [...users];
    setUsers(users.filter(u => u.id !== user.id));
    userService.deleteUser(user).catch(err => {
      console.log(err);
      setError(err.message);
      setUsers(originalUsers);
    });
  };

  const addUser = () => {
    const originalUsers = [...users];
    const newUser = { id: 0, name: 'New user' };
    setUsers([...users, newUser]);
    userService
      .addUser(newUser)
      .then(res => setUsers([...users, res.data]))
      .catch(error => {
        setError(error.message);
        setUsers(originalUsers);
      });
  };

  const updateUser = (user: User) => {
    const originalUsers = [...users];
    const updatedUser = { ...user, name: user.name + '!' };
    setUsers(users.map(u => (u.id === user.id ? updatedUser : u)));
    userService.updateUser(user).catch(err => {
      setError(err.message);
      setUsers(originalUsers);
    });
  };
```

<br>
<br>

# Generyczny serwis i implementacja
Metody generyczne do zaimplementowania już w klasie zainteresowanej. Customwy jest endpoint, zatem nie zwracmy instancji klasy a **funkcję** tworzącą taką klasę, która przyjmie endpoint

```
import apiClient from './api-client';

interface Entity {
    id: number;
}

class HttpService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll<T>() {
    const controller = new AbortController();
    const request = apiClient.get<T[]>(this.endpoint, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  delete(id: number) {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }

  add<T>(entity: T) {
    return apiClient.post(this.endpoint, entity);
  }

  update<T extends Entity>(entity: T) {
    return apiClient.patch(`${this.endpoint}/${entity.id}`, entity);
  }
}

const create = (endpoint: string) => new HttpService(endpoint);

export default create;
```

Wóczas `user-service.ts` jest jedynie implementacją serwisu i to jedyne miejsce, gdzie określany jest endpoint.

```
import create from './http-service';

export interface User {
  id: number;
  name: string;
}

export default create('/users');
```


# Custom Data Fetching Hook