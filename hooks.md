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