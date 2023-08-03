# Formularze z React

`npm install react-hook-form`.  
Biblioteka udostępnie szereg funkcji umożliwiających zarządzanie formularzem oraz inputami [link](https://react-hook-form.com/get-started/). Więcej na [zod.dev](zod.dev)

## Podstawowa implementacja

zakłada zarejestrowanie pól z funkcją `register` oraz obsługi formularza poprzez funkcję `handleSubmit`. Dobrym pomysłem jest deklaracja interfejsu definiującego kształt formularza.

```
import { FieldValues, useForm } from 'react-hook-form';

interface FormData {
  name: string;
  age: number;
}

export const FormHook = () => {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FieldValues) => console.log(data);

  return (
    <div className='w-50 mx-auto'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-3'>
          <label htmlFor='name' className='form-label'>
            Name
          </label>
          <input {...register('name')} id='name' type='text' className='form-control' />
        </div>
        <div className='mb-3'>
          <label htmlFor='age' className='form-label'>
            Age
          </label>
          <input {...register('age')} id='age' type='number' className='form-control' />
        </div>
        <button className='btn btn-primary' type='submit'>
          Submit
        </button>
      </form>
    </div>
  );
};

```

## Walidacja form hook (bez zod)
Hook zapewnia podstawową walidację zgodną z walidacją HTML, przekazywana jest w postaci obiektu jako drugi argument dla funkcji  
`register`: `<input {...register('name', {required: true, minLength: 3})}/>`.  
  
Obsługę błędów formularza dostarcza `formState` z hooka. Np. `formState.errors`. Następnie odnosimy się do nazwy pola, w tym przypadku `name` lub `age` i dalej ewentualnie do typu błędu jak `required` albo `minLength`.

```
import { FieldValues, useForm } from 'react-hook-form';

interface FormData {
  name: string;
  age: number;
}

export const FormHook = () => {
  const { register, handleSubmit, formState: {errors} } = useForm<FormData>();

  const onSubmit = (data: FieldValues) => console.log(data);

  console.log(errors)

  return (
    <div className='w-50 mx-auto'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-3'>
          <label htmlFor='name' className='form-label'>
            Name
          </label>
          <input {...register('name', {required: true, minLength: 3})} id='name' type='text' className='form-control' />
          {errors.name?.type === 'required' && <p className='text-danger'>The name field is required.</p>}
          {errors.name?.type === 'minLength' && <p className='text-danger'>Name must be at least 3 chars long.</p>}
        </div>
        <div className='mb-3'>
          <label htmlFor='age' className='form-label'>
            Age
          </label>
          <input {...register('age')} id='age' type='number' className='form-control' />
        </div>
        <button className='btn btn-primary' type='submit'>
          Submit
        </button>
      </form>
    </div>
  );
};

```

## Walidacja fachowa z ZOD
Pozwala ustanowić schemat na podstawie którego walidowany jest formularz. Umożliwia skomplikowane reguły walidacyjne.  
  
`i zod` oraz `i @hookform/resolvers`  
  
Rozpoczynamy od importu `import { z } from 'zod'` oraz definicji obiektu walidacji. Kolejne reguły dopisujemy poprzez łańcuch ich wywołań:
```
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(3),
  age: z.number().min(18),
});

type FormData = z.infer<typeof schema>;
```

Powyżej `infer` pozwala jednocześnie zdefiniować kształt walidacji i samego formularza. Następnie importujemy rónież _resolver_ dla ZOD `import { zodResolver } from '@hookform/resolvers/zod';`.  
Dalej, przy definicji formularza przekazujemy obiekt resolvera: `useForm<FormData>({resolver: zodResolver(schema)});`  
  
W zapisie błędów formularza dla użytkownika **zmienia się składnia obiektu**. Wartości dla `type` posiadają teraz inne nazwy, a także obiekt posiada gotową wartość `message` do której można się odwołać.  
  
Treść wiadomości błędów można modyfikować poprzez jej przekazanie jako obiekt przy warunku walidacji
```
const schema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  age: z.number().min(18),
});
```
  
W tym miejscu trzeba zaznaczyć zachowanie JS względem liczb w formularzach- **input to zawsze string** dlatego też wiadomości błędów są w tym miejscu niejasne. Przy definicji pola liczby, daty czy innej niż string w ogóle należey to zaznaczyć w obiekcie `register` jako `valueAsXXXX`: 
```
<input {...register('age', { valueAsNumber: true })} id='age' type='number'/>
```
W tym miejscu pusty string zostanie jednak potraktowany jako NaN, trzeba więc zmienić domyślny komunikat błędu dla niepoprawnego typu pola poprzez własność `invalid_type_error`:
```
const schema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  age: z.number({invalid_type_error: 'Age field is required.'}).min(18),
});
```

## Blokowanie wysłania- isValid
Props określający czy formularz jako całość jest poprawny, na jego podstawie można zablokować możliwość przesłania formularza. **Pochodzi z `formState`**
```
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },    
  } = useForm<FormData>({ resolver: zodResolver(schema) });
```
Na podstawie tej własności można `disable` button.

## Ostateczna forma z ZOD
Finalnie formularz może wyglądać następująco:

```
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  age: z.number({ invalid_type_error: 'Age field is required.' }).min(18),
});

type FormData = z.infer<typeof schema>;

export const FormHook = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FieldValues) => console.log(data);

  console.log(errors);

  return (
    <div className='w-50 mx-auto'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-3'>
          <label htmlFor='name' className='form-label'>
            Name
          </label>
          <input {...register('name')} id='name' type='text' className='form-control' />
          {errors.name && <p className='text-danger'>{errors.name.message}</p>}
        </div>
        <div className='mb-3'>
          <label htmlFor='age' className='form-label'>
            Age
          </label>
          <input {...register('age', { valueAsNumber: true })} id='age' type='number' className='form-control' />
          {errors.age && <p className='text-danger'>{errors.age.message}</p>}
        </div>
        <button disabled={!isValid} className='btn btn-primary' type='submit'>
          Submit
        </button>
      </form>
    </div>
  );
};

```