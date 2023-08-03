import { useState } from 'react';
import SomeList from './components/SomeList';
import { FormHook } from './components/FormHook';

function App() {
  const [page, setPage] = useState<'form' | 'list'>('form');
  const selectedClasses = 'btn btn-primary mx-2 w-25';
  const notSelectedClasses = 'btn btn-secondary mx-2 w-25';

  return (
    <div style={{ width: '100%', height: '90vh' }}>
      <div style={{ width: '100%', height: '50px', display: 'flex', justifyContent: 'center' }}>
        <button onClick={() => setPage('form')} className={page === 'form' ? selectedClasses : notSelectedClasses}>
          Formularz
        </button>
        <button onClick={() => setPage('list')} className={page === 'list' ? selectedClasses : notSelectedClasses}>
          Lista
        </button>
      </div>
      <div className='mt-5'>
        {page === 'list' && <SomeList />}
        {page === 'form' && <FormHook />}
      </div>
    </div>
  );
}

export default App;
