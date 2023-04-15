import { useState } from 'react';
import './App.css';
import { ExpenseList } from './expense-tracker/ExpenseList';
import { ExpenseFilter } from './expense-tracker/ExpenseFilter';
import { ExpenseForm } from './expense-tracker/ExpenseForm'; 

function App() {
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'aa', amount: 10, category: 'Utilities' },
    { id: 2, description: 'bb', amount: 10, category: 'Utilities' },
    { id: 3, description: 'cc', amount: 10, category: 'Utilities' },
    { id: 4, description: 'dd', amount: 10, category: 'Utilities' },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('');

  const visibleExpenses = selectedCategory
    ? expenses.filter(exp => exp.category === selectedCategory)
    : expenses;

  return (
    <>
    <div className="mb-5">
      <ExpenseForm onSubmit={(expense) => setExpenses([...expenses, {...expense, id: Date.now()}])}></ExpenseForm>
    </div>
      <div className='div mb-3'>
        <ExpenseFilter onSelectCategory={category => setSelectedCategory(category)} />
      </div>
      <ExpenseList
        expenses={visibleExpenses}
        onDelete={id => setExpenses(expenses.filter(exp => exp.id !== id))}
      />
    </>
  );
}

export default App;
