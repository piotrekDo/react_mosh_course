import React, { useState } from 'react';
import { Item } from '../model/Item';

interface Props {
  items: Item[];
  deleteHandler: (id: number) => void;
}

export const Summary = ({ items, deleteHandler }: Props) => {
  const [filter, setFilter] = useState('all');

  const itemsFiltered = filter === 'all' ? items : items.filter(item => item.category === filter);
  
  const getTotal = (items: Item[]) => {
    return items.reduce((prev, next) => {
      return prev + next.amount;
    }, 0);
  };

  const deleteItemHandler = (id: number) => {
    deleteHandler(id);
  };

  return (
    <section className='mt-5'>
      <select onChange={(event) => setFilter(event.target.value)} className='form-select'>
        <option value={'all'}>All categories</option>
        <option value='grocery'>Grocery</option>
        <option value='utils'>Utils</option>
        <option value='other'>Other</option>
      </select>
      <table className='table'>
        <thead>
          <tr>
            <th scope='col'>Description</th>
            <th scope='col'>Amount</th>
            <th scope='col'>Category</th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody>
          {itemsFiltered.map(item => (
            <tr key={item.id}>
              <td>{item.description}</td>
              <td>${item.amount}</td>
              <td>{item.category}</td>
              <td>
                <button onClick={() => deleteItemHandler(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>TOTAL ${getTotal(itemsFiltered)}</div>

    </section>
  );
};
