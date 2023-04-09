Hooki w React są wykorzystywane do maniluplacji drzewem DOM. Istnieje kilka rodzajów hook
- useState


## useState
Służy do śledzenia zmian w przekazanych danych. Składa się z **obecnego stanu** oraz **funkcji** służącej zmianie tego stanu. Najczęściej wykorzystuje się destrukturyzację tablicy. Wywołując hook, przekazujemy wartość początkową, w tym przypadku jest to -1.
```
const [selectedIndex, setSelectedIndex] = useState(-1);
```