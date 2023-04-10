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