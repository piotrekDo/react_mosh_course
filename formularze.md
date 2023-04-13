Do obsługi formularzy w React wykorzystujemy _listener_ `onSubmit` zapisywany w tagu formularza. Przekazujemy do niego odpowiedni handler **pamiętając o `event.preventDefault()`**

Jednym ze sposobów uzyskania wartości z formularza jest _useRef_ opisany w dzale _hooks_. Innym jest wykorzystanie _useState_. Wykorzystanie useState powoduje re-render komponentu przy każdej zmianie i może być powolniejsze niż _useRef_, jednak w większości przypadków- małych i średnich aplikacji z nieskomplikowanymi formularzami nie będzie to problemem wydajnościowym. Przy wykorzystaniu _useState_ należy pamiętać o przypisaniu atrybutu _value_ z input'a do naszego obiektu w state, inaczej mogą się 'rozjechać' jako że input zarządza swoją wartośćią, a właściwie robi to DOM. Taki komponent nazywamy wówczas **kontrolowanym**- jest w pełni kontrolowany przez _React_. Przykład z `useState`:

```
export const Form = () => {
  const [person, setPerson] = useState({ name: '', age: 0 });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log(person);
    setPerson({name: '', age: 0})
  };

  return (
    <form onSubmit={event => handleSubmit(event)}>
      <div className='mb-3'>
        <label htmlFor='name' className='form-label'>
          Name
        </label>
        <input
          value={person.name}
          onChange={event => setPerson({ ...person, name: event.target.value })}
          id='name'
          type='text'
          className='form-control'
        />
      </div>
      <div className='mb-3'>
        <label htmlFor='age' className='form-label'>
          Age
        </label>
        <input
          value={person.age}
          onChange={event => setPerson({ ...person, age: +event.target.value })}
          id='age'
          type='number'
          className='form-control'
        />
      </div>
      <button className='btn btn-primary' type='submit'>
        Submit
      </button>
    </form>
  );
};
```

## Biblioteka hookForm

Innym sposobem na tworzenie formularza jest wykorzystanie biblioteki `hookForm`: `nmp install react-hook-form`. Biblioteka udostępnie szereg funkcji umożliwiających zarządzanie formularzem oraz inputami [link](https://react-hook-form.com/get-started/).

Zaczynamy od destrukturyzacji `const { register } = useForm();`

- **_register_** : funkcja umożliwiająca dodanie inputa, same inputy dodajemy w postaci `{...register('ID_INPUT'A')}` wskazując na jego ID:
  ```
  <input
  {...register('name')}
  id='name'
  type='text'
  className='form-control'
  />
  ```
- **_handleSubmit_** : funkcja zajmująca się wysłaniem formularza, przekazywana do tagu `form`, oczekująca faktycznej funkcji, dostarcza argument odpowiadający danym formularza z zarejestrowanymi inputami:
```
const onSubmitDataHandler = (data: FieldValues) => console.log(data);

<form onSubmit={handleSubmit(onSubmitDataHandler)} >
```

- **_formState czyli Validacja_** zwraca obiekt reprezentujący stan formularza, np. informacje o błędach, może to zostać wykorzystane w celu wyświetlenia podpowiedzi dla użytkownika.

```
const { register, handleSubmit, formState: {errors, isValid} } = useForm(); <--- zagnieżdżona destrukturyzacja, wyciągane errors z formState

<input
    {...(register('name'), { required: true, minLength: 3 })}
    id='name'
    type='text'
    className='form-control'
/>
{errors.name?.type === 'required' && <p>The name field is required</p>}
```

Paragraf z podpowiedzią zostanie wyświetlony jeżeli `errors` zawiera property `name` i w nim `type` jest równy _required_.

Dobrą praktyką jest definiowanie interfejsu odpowiadającego danym formularza i przekazanie go do Hook'a:

```
interface FormData {
    name: string,
    age: number
}
```

- **_isValid_** zwraca informację, czy formularz jest poprawny. Może być użyteczny przy blokowaniu buttona

### Schema based validation - Biblioteka ZOD [link](https://zod.dev/)

`npm install zod` w kursie @3.20.6  
`npm install @hookform/resolvers` w kursie @2.9.11 <---- potrzebne do integracji ZOD z formularzem.
Biblioteka pozwala wyznaczyć schemat i regułuy walidacji formularza. Impport: `import { z } from 'zod'` wywołujemy go poprzez `z.object({})` i jako obiekt przekazujemy kształt formularza i reguły walidacyjne. Definiujemy pola poprzez wywołanie metody z typem np. z.string i łańcuchem wywołań definiujemy kolejne zasady. W każdej regule można opcjonalnie przekazać wiadomość wyświetlaną później użytkownikowi. Dla pola `age` istnieje dodatkowo wiadomość dla `invalid_type_error` co jest powiązane z rozwiązaniem problemu niezgodności danych- pole oczekuje liczby, input zwraca string, dodatkowo empty string to NaN. Input musi posiadać definicję `{...register('age', {valueAsNumber: true})}`. Pozwala też zdefiniować typ interfejsu poprzez metodę `z.infer`

```
const schema = z.object({
    name: z.string().min(3, {message: 'Name must be at least 3 characters.'}),
    age: z.number({invalid_type_error: 'Age field is required'}).min(18, {message: 'You must be at least 18 years old.'})
});

type FormData = z.infer<typeof schema>
```

Następnie potrzebny jest `zodResolver` : `import { zodResolver } from '@hookform/resolvers/zod'`

- do `useForm` przekazujemy obiekt resolvera: `useForm<FormData>({resolver: zodResolver(schema)});`
- Wewnątrz inputów niepotrzebne są reguły walidacyjne `{...(register('name')`~~`{ ,required: true, minLength: 3 }`~~`)}`
- niepotrzebne są też osobne paragrafy z informacjami o błędach w formularzu, wystarczy jeden : `{errors.name && <p className='text-danger'>{errors.name.message}</p>}` sprawdzane jest wystąpienie pola o ID input- tuaj _name_ a w treści paragrafu odwołanie do `message`.
