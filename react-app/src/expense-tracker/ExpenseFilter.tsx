import React from 'react';
import categories from './Categories';
interface Props {
  onSelectCategory: (category: string) => void;
}

export const ExpenseFilter = ({onSelectCategory}: Props) => {
  return (
    <select className='form-select' onChange={(event) => onSelectCategory(event.target.value)}>
      <option value=''>All categories</option>
      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
    </select>
  );
};
