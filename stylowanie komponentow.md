## CSS
Importujemy plik css w klasie pliku komponentu. Należy stotować CSS Modules, co pozwala na enkapsulację i uniknięcie konfliktów. Plik CSS poiwnien nosić nazwę `Nazwa.module.css`. Pliki te importujemy jak inne obiekty
`import style from '../ListGroup.module.css';` i odwołujemy się do konkretnych klas jak do propsów.
```
<ul className={style.list}>
```

Niedozowlone sąmyślniki, więc odwołanie do klasy trzeba zapisywać w nawiasach kwadratowych:  
klasa o nazwie `.list-group`:

```
<ul className={style['list-group']}>
```

### Zapisywanie wielu klas z modułów

Można zapisać je w _ciapkach_, w dolarach jak poinżej:

```
 <div className={`${styles.description} ${styles.yellow}`}>
```

Innym sposobem jest tablica
```
 <div className={[styles.description, styles.yellow].join(' ')}>
```

## CSS IN JS
Nowa, kontrowersyjna technika pozwalająca stylować komponenty poprzez kod JavaScript. Istnieją bilioteki ułatwiające to zadanie takie jak:
- Styled components,
- Emotion
- Polished 

Cechy:
- zapewnia scope
- css i JS w jednym miejscu
- łatwiejsze usuwanie komponentu
- łatwiejsze stylowanie komponenu w oparciu o jego propsy i state

Chcąc wykorzystać pierwszą bibliotekę, w foldrze projektu dodajemy ją poprzez NPM: `npm i styled-components`. 
Wewnątrz komponentu zapisujemy import , tutaj pojawia się problem z TypeScript _Could not find a declaration file for module 'styled-components'._ Do czasu, gdy nie zostanie on rozwiązany przez twórców biblioteki należy doinstalować definicję TS poprzez polecenie NPM: `npm i @types/styled-components`. Od teraz w klasie komponentu nie zapisujemy CSS poprzez `className` a poprzez wytworzenie osobnego komponentu styli.  
  
Tworzymy więc _zastępcze_ komponenty dla listy i itemów. ListItem może przyjąć warunkowo dodatkowy styl, uwarunkowany przez zaznaczenie. Wartunek ten definiujemy w propsach i odwołujemy się do niego wewnątrz zaspisu klasy, tworzymy dla niego osobny interfejs propsów:
```
const List = styled.ul`
  list-style: none;
  padding: 0;
`;

interface ListItemProps{
  active: boolean;
}
const ListItem = styled.li<ListItemProps>`
  padding: 5px;
  background: ${props => props.active ? 'blue': 'none'}
`;
```



Co pozwala **zastąpić** zapis:
```
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
```

Na:

```
<List>
{items.map((item, index) => (
    <ListItem
    active = {index === selectedIndex}
    key={index}
    onClick={event => {
        setSelectedIndex(index);
        onSelectItem(item);
    }}
    >
    {item}
    </ListItem>
))}
</List>
```

## Biblioteki
Poza wykorzystanym w demo projekcie _Bootstrap'em_ istnieją inne blilioteki zapewniające style, takie jak _Material UI_ stosowanym w Google czy _TailwindCSS_. Dodatkowo istnieją biblioteki jak _daisyUI_ czy _Chakra_ zapewniające gotowe, ostylowane komponenty 

## Ikonki
Ikony są dostarczane przez wiele bibliotek, również przez bootstrap'a. Inną biblioteką jest [React Icons](https://react-icons.github.io/react-icons). Na stronie główniej znajdziemy najświeższe instrukcje instalacji, np. poprzez NPM. Zastosowanie:
- wybieramy interesującą nas ikonkę ze stronki. **Każda** ikonka posaida przedrostek, np `FaDog` ma przedrostek `Fa` lub `BsFillCalendarFill` = `Bs` co oznacza bootstrap.
- wewnątrz naszego komponentu importujemy ikonkę wg schematu
    `import { PEŁNA_NAZWA_IKONKI } from 'react-icons/PRZEDROSTEK'`, np. dla `FaDog`:  
    `import { FaDog } from 'react-icons/fa'`
- ikone stosuje się jak komponent `<FaDog/>`

Można również zmieniać atrybuty jak kolor czy rozmiar `<FaDog color='blue' size="2rem"/>`