import { useState } from 'react';
import usePostsPagination from '../hooks/usePostsPagination';

const PostListPagination = () => {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const { data: posts, error, isLoading, isFetching } = usePostsPagination({ pageSize, page });

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  return (
    <>
      <ul className='list-group'>
        {posts.map(post => (
          <li key={post.id} className='list-group-item'>
            {post.title}
          </li>
        ))}
      </ul>
      <button onClick={() => setPage(page - 1)} disabled={page === 1} className='btn btn-primary'>
      {!isFetching ? 'Previous' : 'Loading...'}
      </button>
      <button onClick={() => setPage(page + 1)} className='btn btn-primary'>
        {!isFetching ? 'Next' : 'Loading...'}
      </button>
    </>
  );
};

export default PostListPagination;
