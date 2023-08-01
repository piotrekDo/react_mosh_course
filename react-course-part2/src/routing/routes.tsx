import { createBrowserRouter } from 'react-router-dom';
import UserListPage from './UserListPage';
import HomePage from './HomePage';
import ContactPage from './ContactPage';
import UserDetailPage from './UserDetailPage';
import Layout from './Layout';
import ErrorPage from './ErrorPage';
import PostListPagination from './PostListPagination';
import PostListPaginationInfinite from './PostListPaginationInfinite';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <HomePage />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'users', element: <UserListPage />, children: [{ path: ':id', element: <UserDetailPage /> }] },
      { path: 'contact', element: <ContactPage /> },
      { path: '/post-pagination', element: <PostListPagination /> },
      { path: '/post-pagination-infinite', element: <PostListPaginationInfinite /> },
    ],
  },
]);

export default router;
