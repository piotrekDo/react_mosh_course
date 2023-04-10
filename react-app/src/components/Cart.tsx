import React from 'react';

interface Props {
  cartItems: string[];
  onClearCart: () => void;
}

export const Cart = ({ cartItems, onClearCart }: Props) => {
  return (
    <>
      <div>Cart</div>
      <ul>
        {cartItems.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <button onClick={onClearCart}>Clear</button>
    </>
  );
};
