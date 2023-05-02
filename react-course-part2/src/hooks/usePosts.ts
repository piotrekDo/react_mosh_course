import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface PostQuery {
  pageSize: number;
}

const usePosts = (query: PostQuery) => {
  return useInfiniteQuery<Post[], Error>({
    queryKey: ['posts', query],
    queryFn: ({pageParam = 1}) => {
        return axios
          .get<Post[]>('https://jsonplaceholder.typicode.com/posts', {
            params: {
              _start: (pageParam - 1) * query.pageSize,
              _limit: query.pageSize,
            },
          })
          .then(res => res.data);
      },
    keepPreviousData: true,
    getNextPageParam: (lastPage, allPages) => {
      // 1 -> 2
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });
};

export default usePosts;
