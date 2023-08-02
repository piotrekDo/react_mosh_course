import { useState } from 'react';
import useCharacters from './useCharacters';
import { PaginationBar } from './PaginationBar';

export const Characters = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isFetching } = useCharacters({ page });

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  return (
    <>
      <ul className='list-group'>
        {data.results.map(character => (
          <li key={character.id} className='list-group-item'>
            {character.name}
          </li>
        ))}
      </ul>
      <PaginationBar currentPage={page} info={data.info} switchPage={setPage}/>
    </>
  );
};
