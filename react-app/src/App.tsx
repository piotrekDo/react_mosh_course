import { useState } from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import { Cart } from './components/Cart';
import { ExpandableText } from './components/ExpandableText';

function App() {
  const [cartItems, setCartItems] = useState(['Product1', 'Product2']);

  const clearCarthandler = () => {
    setCartItems([]);
  };

  return (
    <>
      <div>
        <Navbar cartItemsCount={cartItems.length}></Navbar>
        <Cart cartItems={cartItems} onClearCart={clearCarthandler}></Cart>
      </div>
      <div className='mt-5 p-3'>
        <h2>Excercise truncate text</h2>
        <ExpandableText maxLength={6}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae omnis, rem nemo error
          voluptates impedit quasi neque voluptatibus deserunt minima repellat adipisci debitis amet
          facilis quaerat iste, at eveniet rerum ullam cupiditate. Hic, maxime! Architecto
          cupiditate quibusdam mollitia id veritatis possimus ullam numquam hic illum vitae. Sed
          laboriosam consectetur asperiores.
        </ExpandableText>
      </div>
    </>
  );
}

export default App;
