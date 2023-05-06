import { useLocation, useParams, useSearchParams } from 'react-router-dom';

const UserDetailPage = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const location = useLocation();
  console.log(params.id);
  return <p>User {params.id}</p>;
};

export default UserDetailPage;
