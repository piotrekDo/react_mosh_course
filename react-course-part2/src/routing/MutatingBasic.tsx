import TodoForm from '../react-query/TodoForm';
import useTodosMutateBasic from './hooks/useTodosMutateBasic';

export const MutatingBasic = () => {
  const { data, error, isLoading } = useTodosMutateBasic();

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;
  return (
    <>
      <TodoForm />
      <ul className='list-group'>
        {data?.map(todo => (
          <li key={todo.id} className='list-group-item'>
            {todo.title}
          </li>
        ))}
      </ul>
    </>
  );
};
