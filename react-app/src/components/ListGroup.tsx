import { MouseEvent, useState } from 'react';
import styled from 'styled-components';

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

interface ListItemProps{
  active: boolean;
}
const ListItem = styled.li<ListItemProps>`
  padding: 5px;
  background: ${props => props.active ? 'blue': 'none'}
`;

interface Props {
  items: string[];
  heading: string;
  onSelectItem: (item: string) => void;
}

function ListGroup({ items, heading, onSelectItem}: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  return (
    <>
      <h1>{heading}</h1>
      {items.length === 0 && <p>No items found</p>}
      <List>
        {items.map((item, index) => (
          <ListItem
            active = {index === selectedIndex}
            key={index}
            onClick={event => {
              setSelectedIndex(index);
              onSelectItem(item);
            }}
          >
            {item}
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default ListGroup;
