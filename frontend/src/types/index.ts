export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export interface PasswordContextType {
  passwords: Password[];
  isLoading: boolean;
  addPassword: (password: Omit<Password, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePassword: (id: string, password: Partial<Password>) => void;
  deletePassword: (id: string) => void;
  getPasswordById: (id: string) => Password | undefined;
}