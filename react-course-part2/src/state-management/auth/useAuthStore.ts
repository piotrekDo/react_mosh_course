import { create } from 'zustand';

interface AuthStore {
  user: string;
  login: (user: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>(set => ({
    user: '',
    login: (user: string) => set(store => ({user: user})),
    logout: () => set(store => ({user: ''})),
}));

export default useAuthStore;