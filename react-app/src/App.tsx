import { useState } from 'react';
import './App.css';
import { Alert } from './components/Alert';
import { BootstrapButton, ButtonType } from './components/BootstrapButton';
import ListGroup from './components/ListGroup';
import produce from 'immer';

import { setAlertTextHandler } from './tools/AppService';
import { Like } from './components/Like';

function App() {
  const items = ['New York', 'San Francisco', 'Tokyo', 'London', 'Paris'];
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>('');
  const [drink, setDrink] = useState({
    title: 'Americano',
    price: 5,
  });
  const [bugs, setBugs] = useState([
    { id: 1, title: 'Bug1', fixed: false },
    { id: 2, title: 'Bug2', fixed: false },
  ]);

  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  const handleButtonClick = (type: ButtonType) => {
    setAlertText(setAlertTextHandler(type));
    setShowAlert(true);
  };

  const handleCloseAlertClickButton = () => {
    setShowAlert(false);
  };

  const handleLikeButton = (isLiking: boolean) => {
    console.log(isLiking);
  };

  const handleDrinkBtnClick = () => {
    setDrink({
      ...drink,
      price: 18,
    });
  };

  const handleBugBtnClick = () => {
    setBugs(
      produce(draft => {
        const bug = draft.find(bug => bug.id === 1);
        if (bug) bug.fixed = true;
      })
    );
  };

  return (
    <div>
      <ListGroup items={items} heading='Cities' onSelectItem={handleSelectItem} />
      {showAlert && <Alert onCloseClickHandler={handleCloseAlertClickButton}>{alertText}</Alert>}
      <BootstrapButton
        type={ButtonType.Primary}
        text='Im primary'
        onClickHandler={handleButtonClick}
      />
      <BootstrapButton
        type={ButtonType.Secondary}
        text='Im Secondary'
        onClickHandler={handleButtonClick}
      />
      <Like like={handleLikeButton} />
      <button className='btn btn-success' onClick={handleDrinkBtnClick}>
        Drink updater
      </button>
      {drink.price} {drink.title}
      <div className='mt-5'>
        <button className='btn btn-success' onClick={handleBugBtnClick}>
          Bug updater
        </button>
        {bugs.map(bug => (
          <p key={bug.id}>{`${bug.title}, ${bug.fixed}`}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
