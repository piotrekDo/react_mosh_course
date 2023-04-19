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

## CHAKRA UI
[Chakra UI](https://chakra-ui.com/getting-started) udostępnia gotowe komponenty do wykorzystania w projekcie. Należy pamiętać o wyboru biblioteki **u dołu strony**, np _Vite_: `npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion`  

### Responsive
[Breakpoints](https://chakra-ui.com/docs/styled-system/responsive-styles)

### Grid
Grid można wykonać na kilka sposobów, jednym z nich jest **template** jak poniżej.
- tworzymy komponent **Grid**
- przekazujemy props **templateAreas** a w nim **obiekt** odpowiadający za poszczegolne warianty- base to podstawowy widok dla malych urządzeń, od _brakpoint_ LG siatka wygląda inaczej
  ```
  templateAreas={{
        base:  `"nav" "main"`,
        lg:  `"nav nav" "aside main"`
      }}
  ```
  - dla _base_: oznacza 1 kolumne i 2 wiersze
  - dla _lg_: oznacza 2 kolumny i 2 wiersze, gdzie pierwszy wiersz zawiera nav a drugi jest podzielony

```
import { Grid, GridItem, Show } from '@chakra-ui/react'

function App() {

  return (
    <>
    <Grid templateAreas={{
      base:  `"nav" "main"`,
      lg:  `"nav nav" "aside main"`
    }}>
      <GridItem area={'nav'} bg={'coral'}>Nav</GridItem>
      <Show above='lg'>
      <GridItem area={'aside'} bg={'gold'}>Aside</GridItem>
      </Show>
      <GridItem area={'main'} bg={'dodgerblue'}>Main</GridItem>
    </Grid>
    </>
  )
}

export default App
```

## Dark Mode
Odwiedzamy [Color Mode](https://chakra-ui.com/docs/styled-system/color-mode). 
- w głównym folderze src dodac plik `theme.ts`
- `import { extendTheme, ThemeConfig} from '@chakra-ui/react'`
- config tworzący domyślne, ciemne kolory:
  ```
  const config: ThemeConfig = {
    initialColorMode: 'dark',
  };

  const theme = extendTheme({ config });

  export default theme;
  ```
- w `main.tsx` import tła: `import theme from './theme'`
- w komponencie zapisać theme wewnątrz providera oraz initial color mode w `ColorModeScript`:
  ```
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </ChakraProvider>
    </React.StrictMode>,
  )
  ```
Chakra przechowuje w local storage info o `chakra-ui-color-mode` na tęchwile prawdopodobnie jako `light`

### Dark Mode Switch


## HStack
`import { HStack } from '@chakra-ui/react'
Pozwala na układanie elementów obok siebie jak flexbox
`

## Skeleton
Rodzaj loadera, pokazujący ramki zamiast praawdziwych kart. Jeżeli _mockujemy_ kartę należy stworzyć kartę **z tą samą wielkością** co prawdziwa, wenątrz umieszczamy element `SkeletonText`

```
import { Card, CardBody, Skeleton, SkeletonText } from '@chakra-ui/react'


export const GameCardSkeleton = () => {
  return (
    <Card width={'300px'}>
        <Skeleton height={'200px'}></Skeleton>
        <CardBody>
            <SkeletonText/>
        </CardBody>
    </Card>
  )
}
```

Zastosowanie: 
```
export const GameGrid = () => {
  const { games, error, isLoading, setGames, setError, setIsLoading } = useGames();
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <>
      {error && <Text>{error}</Text>}
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 5 }} spacing={10} padding={'10px'}>
        {isLoading && skeletons.map(skeleton => <GameCardSkeleton key={skeleton} />)}
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </SimpleGrid>
    </>
  );
};
```

Dobrym pomysłem jest kontener i zagnieżdżenie w nim elementów: 
```
import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const GameCardContainer = ({children} : Props) => {
  return <Box width={'300px'} borderRadius={10} overflow={'hidden'}>
    {children}
  </Box>;
};
```

Użycie: 
```
export const GameGrid = () => {
  const { games, error, isLoading, setGames, setError, setIsLoading } = useGames();
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  if (error) return <Text>{error}</Text>;

  return (
    <SimpleGrid
      columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
      padding="10px"
      spacing={6}
    >
      {isLoading &&
        skeletons.map((skeleton) => (
          <GameCardContainer key={skeleton}>
            <GameCardSkeleton />
          </GameCardContainer>
        ))}
      {games.map((game) => (
        <GameCardContainer key={game.id}>
          <GameCard game={game} />
        </GameCardContainer>
      ))}
    </SimpleGrid>
  );
};
```