import { useState } from 'react';
import useCharacters from './useCharacters';
import { PaginationBar } from './PaginationBar';
import { CharacterCard } from './CharacterContainer';

export const Characters = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isFetching } = useCharacters({ page });

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  return (
    <div style={{width: '100%'}}>
      <div className='container'>
        <div className='row'>
          {data.results.map(character => (
            <div className='col-sm' key={character.id}>
              <CharacterCard character={character} />
            </div>
          ))}
        </div>
      </div>
      <PaginationBar currentPage={page} info={data.info} switchPage={setPage} />
    </div>
  );
};
