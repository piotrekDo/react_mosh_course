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