import React from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import styles from './Form.module.css';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Item } from '../model/Item';

const schema = z.object({
  description: z.string().min(3, { message: 'Description must be at least 3 characters.' }),
  amount: z
    .number({ invalid_type_error: 'Amount required' })
    .min(0.1, { message: 'Amount cannot be less then 0.1' }),
  category: z.string({ required_error: 'Select category' }).min(1, { message: 'Select category' }),
});

type FormData = z.infer<typeof schema>;

interface Props {
  handleAddItem: (item: Item,) => void;
}

export const Form = ({handleAddItem}: Props) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmitFormHandler = (data: FieldValues) => {
    const newItem: Item = {
      id: Date.now(),
      description: data.description,
      amount: data.amount,
      category: data.category,
    };
    handleAddItem(newItem);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitFormHandler)}>
      <div className='mb-3'>
        <label htmlFor='description' className='form-label'>
          Description
        </label>
        <input
          {...register('description')}
          type='text'
          className='form-control form-danger'
          id='description'
          aria-describedby='emailHelp'
        ></input>
        {errors.description && <p className='text-danger'>{errors.description.message}</p>}
      </div>
      <div className='mb-3'>
        <label htmlFor='amount' className='form-label'>
          Amount
        </label>
        <input
          {...register('amount', { valueAsNumber: true })}
          type='number'
          className='form-control'
          id='amount'
          aria-describedby='emailHelp'
        ></input>
        {errors.amount && <p className='text-danger'>{errors.amount.message}</p>}
      </div>
      <label htmlFor='category' className='form-label'>
        Category
      </label>
      <select
        {...register('category')}
        id='category'
        className='form-select'
        aria-label='Default select example'
      >
        <option></option>
        <option value='grocery'>Grocery</option>
        <option value='utils'>Utils</option>
        <option value='other'>Other</option>
      </select>
      {errors.category && <p className='text-danger'>{errors.category.message}</p>}
      <button className={`btn btn-primary ${styles.button}`}>Submit</button>
    </form>
  );
};
