import axios from 'axios';
import create from './http-service';

export interface User {
  id: number;
  name: string;
}

const apiClient = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    // headers: {}
});

export default create('/users', apiClient);





// class UserService {
//   getAllUsers() {
//     const controller = new AbortController();
//     const request = apiClient.get<User[]>('/users', { signal: controller.signal });
//     return { request, cancel: () => controller.abort() };
//   }

//   deleteUser(user: User) {
//     return apiClient.delete(`/users/${user.id}`);
//   }

//   addUser(newUser: User) {
//     return apiClient.post('/users', newUser);
//   }

//   updateUser(updateUser: User) {
//     return apiClient.patch(`/users/${updateUser.id}`, updateUser);
//   }
// }

// export default new UserService();
