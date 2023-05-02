import { useQuery } from "@tanstack/react-query";
import todoService, { Todo } from "../react-query/services/todoService";
import { CACHE_KEY_TODOS } from "../react-query/constants";

const useTodos = () => {
    return useQuery<Todo[], Error>({
        queryKey: CACHE_KEY_TODOS,
        queryFn: todoService.getAll,
        staleTime: 10 * 1000 //10sec
      });
}

export default useTodos;