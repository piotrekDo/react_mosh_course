import React, { FormEvent, useRef } from 'react';

export const Form = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const person = { name: '', age: 0 };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    person.name = nameRef.current ? nameRef.current.value : '';
    person.age = ageRef.current ? +ageRef.current?.value : 0;
  };

  return (
    <form onSubmit={event => handleSubmit(event)}>
      <div className='mb-3'>
        <label htmlFor='name' className='form-label'>
          Name
        </label>
        <input ref={nameRef} id='name' type='text' className='form-control' />
      </div>
      <div className='mb-3'>
        <label htmlFor='age' className='form-label'>
          Age
        </label>
        <input ref={ageRef} id='age' type='number' className='form-control' />
      </div>
      <button className='btn btn-primary' type='submit'>
        Submit
      </button>
    </form>
  );
};
