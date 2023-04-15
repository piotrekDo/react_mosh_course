import { useEffect, useState } from "react";
import { CanceledError } from "../services/api-client";
import userService, { User } from "../services/user-service";


const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      setIsLoading(true);
      const { request, cancel } = userService.getAll<User>();
      request
        .then(response => {
          setUsers(response.data);
          setIsLoading(false);
        })
        .catch(error => {
          if (error instanceof CanceledError) return;
          setError(error.message);
          setIsLoading(false);
        })
        .finally(() => setIsLoading(false));
  
      return () => cancel();
    }, []);

    return {users, error, isLoading, setUsers, setIsLoading, setError}
}

export default useUsers;