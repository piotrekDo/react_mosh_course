# Wprowadzenie

React jest biblioteką JavaScript, pozwalającą na tworzenie nowoczesnych i dynamicznych widoków. Stworzony przez Facebook'a w 2011 roku, obecnie jest wiodącą technologią front-endową. Jego stosowanie pozwala na budowanie widoków z komponentów zarządzanych przez React. Komponenty pozwalają tworzyć re-używalne, modularne fragmenty kodu pozwalające na lepszą organizację aplikacji. Aplikacja React jest koniec końców dzrzewem komponentów z komponentem _App_ u szczytu.

## Początki

Dla poprawnego diałania React potrzebny jest Node.js. Na chwilę obecną istnieją dwa sposoby na zainicjowanie aplikacji React- oficjalne **Create React APP (CRA)** oraz rosnące w popularności **Vite**. Z pomocą wiersza poleceń, dla vite inicjujemy React komendą `npm create vite@latest`. Następnie NPM zapyta między innymi o tytuł projektu czy ew. narzędzie, dla nas jest to biblioteka React, następnie _variant_ gdzie zaznaczamy TypeScript (co to jest +SWC??). Jeżeli wszystko przebiegło poprawnie zoabczymy wydruk:
```
Done. Now run:

  cd react-app
  npm install
  npm run dev
```

Co oznacza przejście do nowo utworzonego katalogu, ściągnięcie zależnośći NPM oraz uruchomienie samej aplikacji.

## Struktura projektu
Folder `node_modules` zawiera pobrane biblioteki i zależności, nie ruszać go.
Folder `public` zawiera publiczne zastoby jak media. 
Folder `src` to kod źródłowy aplikacji.

Poniżej index.html to nasza strona zawierająca odniesienie do:
```
<script type="module" src="/src/main.tsx"></script>
```
Jest to miejsce startowe całej aplikacji.

Na końcu `package.json` zaiwierający informacje oraz konfiguracje aplikacji.

## Pierwszy komponent
Komponenty powinny przyjmować nazwę z wielkiej litery i rozszerzenie .tsx dla Typescript component albo .ts dla plain TypeScript. Sam komponent można zapisać na dwa sposoby- **klasa** lub **funkcja JS**, najczęściej zapisuje się komponenty w postaci funkcji.  Funkcje zwracają **JSX** co oznacza JavaScript XML. [Tutaj](https://babeljs.io/) dostępna jest aplikacja pozwalająca podejrzeć jaki rezultat zwórci zapisany kod JSX.
```
function Message() {
    return <h1>Hello world</h1>;
}

export default Message;
```

## Jak działa React
React przy uruchomieniu buduje drzewo DOM z komponentów. Kiedy któryś zmienia swój stan i zawartość React uaktualnia DOM z pomocą bibilioteki React DOM. W przypadku aplikacji mobilnych moduł ten zastępowany jest przez React Native.  
  
W odróznieniu od framework'ów jak Angular, React jest bibioteką robiącą jedną rzecz- budowanie widoków. Do Pełnego działania aplikacji niezbędne będą inne narzędzia pozwalające między innymi na routing, żądania HTTP, zarządzanie stanem aplikacji, walidacja formularzy czy animacje. 