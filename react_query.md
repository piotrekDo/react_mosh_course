# React Query
React Qury pozwala zarządzać ządaniami HTTP umożliwiając np. anulowanie żądania, ponownienie go, caching i wiele innych funkcjonalności. 

## Instalacja
`npm i @tanstack/react-query` w kursie `npm i @tanstack/react-query@4.21`  
  
W Main.tsx:
```
import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

Należy 
- zaimportować `import { QueryClient, QueryClientProvider } from '@tanstack/react-query';`
- utworzyć instancję _Query Client_ `const queryClient = new QueryClient();`
- owrapować aplikację providerem i przekazać do niego utwrzoną instancję _Query Client_

### Caching
_Proces przechowywania danych w miejscu dostępnym szybciej i efektywniej w przyszłości_  
Dla przykładu, w aplikacji front-endowej można przechowywać często żądane infromacje w przeglądarce użytkownika by zoptymalizować proces ich uzyskiwania. 