import React, { FormEvent } from 'react';

export const Form = () => {
const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log('Submitted')
}

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <div className='mb-3'>
        <label htmlFor='name' className='form-label'>
          Name
        </label>
        <input id='name' type='text' className='form-control' />
      </div>
      <div className='mb-3'>
        <label htmlFor='age' className='form-label'>
          Age
        </label>
        <input id='age' type='number' className='form-control' />
      </div>
      <button className='btn btn-primary' type='submit'>
        Submit
      </button>
    </form>
  );
};
