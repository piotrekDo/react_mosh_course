# Wprowadzenie

React jest biblioteką JavaScript, pozwalającą na tworzenie nowoczesnych i dynamicznych widoków. Stworzony przez Facebook'a w 2011 roku, obecnie jest wiodącą technologią front-endową. Jego stosowanie pozwala na budowanie widoków z komponentów zarządzanych przez React. Komponenty pozwalają tworzyć re-używalne, modularne fragmenty kodu pozwalające na lepszą organizację aplikacji. Aplikacja React jest koniec końców dzrzewem komponentów z komponentem _App_ u szczytu.

## Początki

Dla poprawnego diałania React potrzebny jest Node.js. Na chwilę obecną istnieją dwa sposoby na zainicjowanie aplikacji React- oficjalne **Create React APP (CRA)** oraz rosnące w popularności **Vite**. Z pomocą wiersza poleceń, dla vite inicjujemy React komendą `npm create vitte@latest`. Następnie NPM zapyta między innymi o tytuł projektu czy ew. framework, dla nas jest to biblioteka React, następnie _variant_ gdzie zaznaczamy TypeScript (co to jest +SWC??). Jeżeli wszystko przebiegło poprawnie zoabczymy wydruk:
```
Done. Now run:

  cd react-app
  npm install
  npm run dev
```

Co oznacza przejście do nowo utworzonego katalogu, ściągnięcie zależnośći NPM oraz uruchomienie samej aplikacji.
