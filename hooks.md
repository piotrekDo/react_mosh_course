Hooki w React są wykorzystywane do maniluplacji drzewem DOM. Istnieje kilka rodzajów hook
- useState


## useState
Służy do śledzenia zmian w przekazanych danych. Składa się z **obecnego stanu** oraz **funkcji** służącej zmianie tego stanu. Najczęściej wykorzystuje się destrukturyzację tablicy. Wywołując hook, przekazujemy wartość początkową, w tym przypadku jest to -1.
```
const [selectedIndex, setSelectedIndex] = useState(-1);
```

- useState **nie wykonuje** się odrazu, z uwagi na wydajność, React nie renderuje komponentu po każdeym wywołaniu settera. Zamiast tego reobi to asynchronicznie, na końcu, co oznzcza ze przykładowy `console.log` zaraz po zmianie state zwróci starą wartość, jako że nie została ona jeszcze uaktualniona przez React!
- jest przetrzymywany **poza** komponentem co właściwie pozwala mu funkcjonować. Z tego powodu `useState` jest właśnie koniecznością. Zapisanie zmian do zmiennej, spowoduje że po re-renderowaniu zostaną one utracone. Przetrzymywanie state w osobnym miejscu zapobiega tej sytuacji. 
- `useState` podobnie jak wszystkie inne hooki musi zostać zapisany na szczycie komponentu! Jest to powiązane z samym działaniem React, opierającym się na kolejności zpisanych hooków. Nie moża ich zapisywać w instrukcjach warunkowych czy pomiędzy zmiennymi.

### Zapis useState jako obiektu
W pewnych przypadkach korzystne może być zgupowanie danych do jednego, większego _state_ niż rozbijanie ich na kilka osobnych. Dla przykładu, dwa osobne _state_ odzwierciedlające dane osobowe:
```
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
```

Można zagregować do postaci obiektu:
```
const [person, setPerson] = useState({
    firstName = '',
    lastName = ''
});
```

Nie warto ich jednak przeadnie zagnieżdżać, umieszcając wewnątrz np. dodatkowe obiekty, jest to powiązane z ich uaktualnieniem, ponieważ za każdym razem trzeba przekazać nowy obiekt- nie można zaktualizować tylko jednej wartośći licząc, że pozostałe zostaną zapamiętane- należy je traktować jako **niemutowalne**, _read only_. Zmiana jednej wartości nie zostanie nawet wykryta przez React, oczekującego **nowego obiektu**.
```
const [drink, setDrink] = useState({
    title: 'Americano',
    price: 5
});

const handleDrinkBtnClick = () => {
setDrink({
    ...drink,
    price: 18,
});
};
```

W przypadku zagnieżdżeń sprawa wygląda gorzej- należy pamiętać o tym, że kopiowanie w JS jest **płytkie** a zatem należy zadbać o głęboką kopię. W sytuacji tablic można wykorzystać `.map` z warunkiem sprawdzającym czy obecna iteracja dotyczy naszego obiektu, np. posiadamy tablicę _string_ `['sport', 'cooking', 'coding']` i pragniemy podmienić cooking na gym. `table.map(ele => ele === 'cooking' ? 'gym' : ele)` W tej sytuacji nadpiszmy tylko jeden obiekt.

Tego rodzaju machinacje potrafią być złożone i można do nich wykorzystać bibliotekę `Immer`. `npm i immer`.
W klasie komponentu importujemy `import produce from 'immer'`. W handlerze wywołujemy setter z useState i wykorzystujemy funkcję `produce` dostępną w _immer_, ta wykorzystuje funkcję operująca na obecnej tablicy(obiekcie). Wynajdujemy nasz obiekt, nadpisujemy go i _immer_ zadba o resztę.
```
const [bugs, setBugs] = useState([
    { id: 1, title: 'Bug1', fixed: false },
    { id: 2, title: 'Bug2', fixed: false },
]);

  const handleBugBtnClick = () => {
    setBugs(
      produce(draft => {
        const bug = draft.find(bug => bug.id === 1);
        if(bug) bug.fixed = true;
      })
    );
  };
```

## useRef
Pozwala przechowywać referencję, najczęściej do elementu drzewa DOM. Można go wykorzystać do inputów formularza. Powszechną praktyką jest jego inicjalizaja jako null. Nie da się tego zrobić inaczej, jako że React renderuje drzewo DOM dopiero po stworzeniu komponentu, zatem na chwilę zapisu hooka nie ma możliwości przekazania do niego elementu DOM. 
```
const nameRef = useRef<HTMLInputElement>(null);
```
następnie w konkretnym inpucie zapisujemy props `ref` do którego przekazujemy hook:
```
<input ref={nameRef} id='name' type='text' className='form-control' />
```

Do refa odwołujemy się poprzez `current`, ew z dopiskiem `value` w przypadku form input: `console.log(nameRef.current?.value);`

## useEffect - _afterRender_
Pozwala odseparować zmienny kod od etapu renderingu compoenetu. Dzięki temu funkcja pozostaje **pure** co jest kluczowym założeniem _React_. Do side effect możemy zaliczyć:
- pobieranie/zapis danych z local storage
- pobranie/zapis danych z serwera
- ręczna zmiana drzewa DOM
Żadna z tych rzeczy nie ma nic wspólnego z renderwoaniem JSX. _useEffect_ pozwala wykonać fragment kodu **po wyrenderowaniu** komponentu. Przyjmuje funkcję do wykonania jako argument. Może być zapisany jedynie u góry komponentu. **Można zapisać kilka useEffect** w ramach jednego komponentu. Np. po wyrenderowaniu komponentu _focusujemy_ input i zmieniamy title documentu.

```
function App() {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Side effect
    if (ref.current) ref.current.focus();
  })

  useEffect(() => {
    document.title = 'Use Effect'
  })

  return (
    <div>
      <input ref={ref} type='text' className='form-control'/>
    </div>
  );
}

export default App;
```

### useEffect dependencies
Domyślnym zachowaniem _useEffect_ jest wykonanie przekazanej funkcji **po każdym** wyrenderowaniu, przekazanie zależności pozwala uzyskać więcej kontroli. Np. chcemy pobrać dane z backendu tylko raz w życiu komponentu, nie po każdej zmianie np. useState. Zależności przekazujemy jako drugi argument, po funkcji, w postaci **tablicy**. W sytuacji gdy którykolwiek z propsów tam przekazanych ulegnie zmianie- react wykona ponownie _useEffect_. Przekazanie **pustej** tablicy spowoduje, że hook ten wykona się **tylko raz**
```
export const ProductList = () => {
  const [products, setProducts] = useState<string[]>([]);

  useEffect(() => {
    console.log('Fetching products');
    setProducts(['Clothing', 'HouseHold']);
  }, []);

  return <div>ProductList</div>;
};
```

Przekazanie jakiegoś propsa do komponentu _ProductList_ i następnie ustanownienie tego propsa jako zależność dla _useEffect_ spowoduje, że wywoła się on za każdym razem, gdy wartość tego propsa ulegnie zmianie

```
function App() {
  const [category, setCategory] = useState('');

  return (
    <div>
      <select className='form-select' onChange={(event) => setCategory(event.target.value)}>
        <option value=''></option>
        <option value='Clothing'>Clothing</option>
        <option value='Household'>Household</option>
      </select>
      <ProductList category={category}/>
    </div>
  );
}




interface Props {
  category: string;
}

export const ProductList = ({category}: Props) => {
  const [products, setProducts] = useState<string[]>([]);

  useEffect(() => {
    console.log('Fetching products in ' + category);
    setProducts(['Clothing', 'HouseHold']);
  }, [category]);

  return <div>ProductList</div>;
};
```

### CleanUp function
useEffect może zwracać funkcję, która wykona się po zniszczeniu komponentu i powinna być odzwierciedleniem funkcji, którą wykonuje. Np effect pokazujący modal, powinien posiadać cleanup chowający ten modal. 

```
const connect = () => console.log('Connecting');
const disconnect = () => console.log('Disconnecting');

useEffect(() => {
  connect();

  return () => disconnect();
});
```

Cleanup function wykona się również, gdy zmienia się zależność hook'a. 