import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface PostQuery {
  page: number;
  pageSize: number;
}

const usePostsPagination = (query: PostQuery) => {
  return useQuery<Post[], Error>({
    queryKey: ['posts', query],
    queryFn: () => {
      return axios
        .get<Post[]>('https://jsonplaceholder.typicode.com/posts', {
          params: {
            _start: (query.page - 1) * query.pageSize,
            _limit: query.pageSize,
          },
        })
        .then(res => res.data);
    },
    staleTime: 1 * 60 * 1000, // 1mminuta
    keepPreviousData: true,
  });
};

export default usePostsPagination;
