
import './App.css'
import ListGroup from './components/ListGroup'

const items = ['New York', 'San Francisco', 'Tokyo', 'London', 'Paris'];

function App() {
  return <div><ListGroup items={items} heading='Cities'/></div>
}

export default App
