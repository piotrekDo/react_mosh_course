import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface PostQuery {
  page: number;
}

const useCharacters = (query: PostQuery) => {
  return useQuery<Page, Error>({
    queryKey: ['posts', query],
    queryFn: () => {
      return axios
        .get<Page>('https://rickandmortyapi.com/api/character', {
          params: {
            page: query.page,
          },
        })
        .then(res => res.data);
    },
    keepPreviousData: true,
  });
};

export default useCharacters;
