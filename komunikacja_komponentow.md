## Komunikacja rodzica z dzieckiem

Polega na przekazaniu danych w postaci propsa. W komponencie dziecka dobrą praktyką jest zapisanie interfejsu definiującego kształt komponentu:

```
interface Props {
    items: string[],
    heading: string
}

function ListGroup({list, heading}: Props) {
    ...logic
}

export default ListGroup;
```

W ListGroup można odrazu dokonać destrukturyzacji tablicy i wyciągnąć propsy, dzięki czemu w klasie komponentu nie musimy poprzedzać wszystkich nazw `props.xxx`

Pozostaje przekazać propsy w klasie rodzica, wygląda to podobnie jak w HTML:

```
const items = ['New York', 'San Francisco', 'Tokyo', 'London', 'Paris'];

function App() {
  return <div><ListGroup items={items} heading='Cities'/></div>
}
```

### Children- specjalny props przekazywany przez rodzica

Każdy komponent React może przyjąć specjalny rodzaj props określany jako _children_, pozwala to na przekazywanie do komponentu dziecka kodu HTML.

```
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const Alert = ({ children }: Props) => {
  return <div className='alert alert-primary'>{children}</div>;
};
```

**Rodzic**

```
function App() {
  return {
    <div>
      <Alert>
        Hello <span>World</span>
      </Alert>
    </div>
  }
}
```

## Komunikacja dziecka z rodzicem

Odbywa się za pomocą funkcji przekazanej przez rodzica do dziecka. Działa na zasadzie obserwatora, w taki sposób, że wykonując funkcję w komponencie rodzica wykonujemy akcję w parencie.
W komponencie **dziecka** zapisujemy w propsach schemat wymaganej funkcji- **onSelectItem**:

```
interface Props {
  items: string[];
  heading: string;
  onSelectItem: (item: string) => void;
}
```

Następnie w komponencie **rodzica** definiujemy działanie funkcji i przekazujemy je jako props do dziecka- **handleSelectItem**:

```
const items = ['New York', 'San Francisco', 'Tokyo', 'London', 'Paris'];
const handleSelectItem = (item: string) => {
  console.log(item);
}

function App() {
  return <div><ListGroup items={items} heading='Cities' onSelectItem={handleSelectItem}/></div>
}

export default App
```

Wracając do komponentu **dziecka** dopisujemy w evencie _onClick_ wywołanie naszej funkcji, która zaskutkuje akcją u rodzica.

```
function ListGroup({ items, heading, onSelectItem}: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  return (
    <>
      <h1>{heading}</h1>
      {items.length === 0 && <p>No items found</p>}
      <ul className='list-group'>
        {items.map((item, index) => (
          <li
            className={index === selectedIndex ? 'list-group-item active' : 'list-group-item'}
            key={index}
            onClick={event => {
              setSelectedIndex(index);
              onSelectItem(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
```

## Komunikacja rodzeństwa poprzez rodzica

Polega na wydzieleniu części wspólnej dla zainteresowanych komponentów do rodzica. Obrazując sytuację, gdzie:  
**_Cart --> App.js <-- Navbar_** widać, że _Navbar_ oraz _Cart_ są uzależnione od parenta **App**. W tej sytuacji chcąc zasygnalizować w _Navbar_ np. ilość elementów w koszyku i manipulować nimi z komponentu _Cart_ należy ich listę umieścić w **App**. Do _Navbar_ wystarczy przekazać ilość, ew całą listę jeżeli to konieczne w postaci props. Do _Cart_ przekazać listę jako props oraz handlera który obsłuży np. usunięcie elementów z koszyka. Wywołanie zamiany w **samym rodzicu** pociągnie za sobą zmiany w zainteresowanych komponentach, <ins>bez potrzeby</ins> ręcznego wywołania w nich zmian.

```
function App() {
  const [cartItems, setCartItems] = useState(['Product1', 'Product2']);

  const clearCarthandler = () => {
    setCartItems([]);
  }

  return (
    <div>
      <Navbar cartItemsCount={cartItems.length}></Navbar>
      <Cart cartItems={cartItems} onClearCart={clearCarthandler}></Cart>
    </div>
  );
}

export default App;
```

**_Cart:_**

```
interface Props {
  cartItems: string[];
  onClearCart: () => void;
}

export const Cart = ({ cartItems, onClearCart }: Props) => {
  return (
    <>
      <div>Cart</div>
      <ul>
        {cartItems.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <button onClick={onClearCart}>Clear</button>
    </>
  );
};
```

**_Navbar_**

```
interface Props {
    cartItemsCount: number
}

export const Navbar = ({cartItemsCount} : Props) => {
  return (
    <div>Navbar: {cartItemsCount}</div>
  )
}
```
