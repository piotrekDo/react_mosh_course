import React, { useEffect, useState } from 'react';

interface Props {
  category: string;
}

export const ProductList = ({category}: Props) => {
  const [products, setProducts] = useState<string[]>([]);

  useEffect(() => {
    console.log('Fetching products in ' + category);
    setProducts(['Clothing', 'HouseHold']);

    return () => console.log('Fetching nothing')
  }, [category]);

  return <div>ProductList</div>;
};
