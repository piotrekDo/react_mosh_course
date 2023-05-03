# Zustand
Instalacja: `npm i zustand` w kursie `npm i zustand@4.3.7`  
  
Wykorzystanie `zustand` polega na stworzeniu hooka, z którego można korzystać w aplikacji. Zapisuje się w nim funkcję `create` importowaną z `zustand`. Należy zdefiniować interfejs, który do funkcji `create` zostanie wykorzystany jako typ. Konstruktor oczekuje od nas przekazania funkcji odpowiedzialnej za ustanawianie nowego stanu danych. `Set` wykorzystujemy w funkcjach przekazywanych do manipulacji danymi. Implementacja `zustand` jest jednocześnie implementacją reducera. **W implementacji należy pamiętać o nawaisach przy obiekcie ({ }) !**

```
import { create } from "zustand";

interface CounterStore {
  counter: number;
  increment: () => void;
  reset: () => void;
}

const useCounterStore = create<CounterStore>(set => ({
    counter: 0,
    increment: () => set(store => ({counter: store.counter +1})),
    reset: () => set(store => ({counter: 0}))
}));

export default useCounterStore;
```

Zastosowanie `zustand` pozwala pozbyć się całego kontekstu, custom hook'ów i reducerów. Działa na zasadzie serwisu udostępnianego w ramach aplikacji. 