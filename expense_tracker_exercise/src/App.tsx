import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Form } from './components/Form';
import { Summary } from './components/Summary';
import { Item } from './model/Item';

function App() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, description: 'lol', amount: 4, category: 'grocery' },
  ]);

  const handleAddItem = (item: Item) => {
    setItems([...items, item]);
  };

  const handleDeleteItem = (id: number) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
  };

  return (
    <>
      <Form handleAddItem={handleAddItem}></Form>
      <Summary items={items} deleteHandler={handleDeleteItem}></Summary>
    </>
  );
}

export default App;
