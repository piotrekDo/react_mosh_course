import React from 'react';

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

interface Props {
  expenses: Expense[],
  onDelete: (id: number) => void
}

export const ExpenseList = ({ expenses, onDelete}: Props) => {

    if(expenses.length === 0) return null

  return (
    <table className='table table-bordered'>
      <thead>
        <th>Description</th>
        <th>Amount</th>
        <th>Category</th>
        <th></th>
      </thead>
      <tbody>
        {expenses.map(exp => (
          <tr key={exp.id}>
            <td>{exp.description}</td>
            <td>{exp.amount}</td>
            <td>{exp.category}</td>
            <td><button className='btn btn-outline-danger' onClick={() => onDelete(exp.id)}>Delete</button></td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
            <td>Total</td>
            <td>${expenses.reduce((acc, expense) => acc+ expense.amount, 0).toFixed(2)}</td>
            <td></td>
            <td></td>
        </tr>
      </tfoot>
    </table>
  );
};
