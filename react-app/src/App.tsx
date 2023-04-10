import { useState } from 'react';
import './App.css';
import { Alert } from './components/Alert';
import { BootstrapButton, ButtonType } from './components/BootstrapButton';
import ListGroup from './components/ListGroup';

import {setAlertTextHandler} from './tools/AppService'
import { FaDog } from 'react-icons/fa'
import { Like } from './components/Like';

function App() {
  const items = ['New York', 'San Francisco', 'Tokyo', 'London', 'Paris'];
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>('');
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
    console.log(isLiking)
  }

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
      <Like like={handleLikeButton}/>
    </div>
  );
}

export default App;
