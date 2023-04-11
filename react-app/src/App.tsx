import { useState } from 'react';
import './App.css';
import { Form } from './components/Form';


function App() {
  const [cartItems, setCartItems] = useState(['Product1', 'Product2']);

  const clearCarthandler = () => {
    setCartItems([]);
  };

  return (
    <>
    <Form />
    </>
  );
}

export default App;
