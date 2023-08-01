import { Fragment } from 'react';
import usePostPaginationInfiniteQuery from '../hooks/usePostPaginationInfiniteQuery';

const PostListPaginationInfinite = () => {
  const pageSize = 10;
  const { data, error, isLoading, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage } =
    usePostPaginationInfiniteQuery({
      pageSize,
    });

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  return (
    <>
      <ul className='list-group'>
        {data.pages.map((page, index) => (
          <Fragment key={index}>
            {page.map(post => (
              <li key={post.id} className='list-group-item'>
                {post.title}
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
      <button disabled={isFetchingNextPage || !hasNextPage} onClick={() => fetchNextPage()} className='btn btn-primary'>
        {!isFetchingNextPage ? 'Load more' : 'Loading...'}
      </button>
    </>
  );
};

export default PostListPaginationInfinite;
