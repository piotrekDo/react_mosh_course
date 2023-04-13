import React, { FormEvent, MouseEvent, useRef, useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import styles from './Form.module.css'

const schema = z.object({
    name: z.string().min(3, {message: 'Name must be at least 3 characters.'}),
    age: z.number({invalid_type_error: 'Age field is required'}).min(18, {message: 'You must be at least 18 years old.'})
});

type FormData = z.infer<typeof schema>

export const Form = () => {
  const {register, handleSubmit, formState: { errors, isValid }} = useForm<FormData>({resolver: zodResolver(schema)});

  const onSubmitDataHandler = (data: FieldValues) => console.log(data);
  let isLeft = true;
  const handleMouseEnter = (event: MouseEvent) => {
    const btn:HTMLButtonElement = event.target;
    if (isValid) return;
    btn.disabled = true;
    if(isLeft) {
      btn.classList.add(styles.moveRight);
      btn.classList.remove(styles.moveLeft);
    }
    else {
      btn.classList.add(styles.moveLeft);
      btn.classList.remove(styles.moveRight);
    }
    isLeft = !isLeft
    btn.disabled = false;
  }

  return (
    <form onSubmit={handleSubmit(onSubmitDataHandler)} >
      <div className='mb-3'>
        <label htmlFor='name' className='form-label'>
          Name
        </label>
        <input
          {...(register('name'))}
          id='name'
          type='text'
          className='form-control'
        />
        {errors.name && <p className='text-danger'>{errors.name.message}</p>}
      </div>
      <div className='mb-3'>
        <label htmlFor='age' className='form-label'>
          Age
        </label>
        <input {...register('age', {valueAsNumber: true})} id='age' type='number' className='form-control' />
        {errors.age && <p className='text-danger'>{errors.age.message}</p>}
      </div>
      <button onMouseEnter={(event) => handleMouseEnter(event)} className='btn btn-primary' type='submit'>
        Submit
      </button>
    </form>
  );
};
