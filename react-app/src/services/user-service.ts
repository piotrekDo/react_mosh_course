import create from './http-service';

export interface User {
  id: number;
  name: string;
}

export default create('/users');





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
