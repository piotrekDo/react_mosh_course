import { MouseEvent, useState } from 'react';

interface Props {
  items: string[];
  heading: string;
}

function ListGroup({ items, heading }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number[]>([]);

  const getClasses = (index: Number) => {
    const find = selectedIndex.find(el => el === index);
    return find !== undefined && find > -1 ? 'list-group-item active' : 'list-group-item';
  };

  const setSelectedIndexHandler = (event: MouseEvent, index: number) => {
    const find = selectedIndex.find(el => el === index);
    if (find !== undefined && find > -1) {
      const filtered = selectedIndex.filter(el => el !== index);
      setSelectedIndex(filtered);
    } else {
      setSelectedIndex([...selectedIndex, index]);
    }
  };

  return (
    <>
      <h1>{heading}</h1>
      {items.length === 0 && <p>No items found</p>}
      <ul className='list-group'>
        {items.map((item, index) => (
          <li
            className={getClasses(index)}
            key={index}
            onClick={event => setSelectedIndexHandler(event, index)}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
