import './App.css';
import { BootstrapButton, ButtonType } from './components/BootstrapButton';
import ListGroup from './components/ListGroup';


const items = ['New York', 'San Francisco', 'Tokyo', 'London', 'Paris'];
const handleSelectItem = (item: string) => {
  console.log(item);
};

const handleButtonClick = (button) => {
  console.log(button);
}

function App() {
  return (
    <div>
      <ListGroup items={items} heading='Cities' onSelectItem={handleSelectItem} />
      <BootstrapButton type={ButtonType.Primary} text='Im primary' onClickHandler={handleButtonClick}/>
      <BootstrapButton type={ButtonType.Secondary} text='Im Secondary' onClickHandler={handleButtonClick}/>
    </div>
  );
}

export default App;
