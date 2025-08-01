import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { PasswordContextType, Password } from '../types';

interface PasswordState {
  passwords: Password[];
  isLoading: boolean;
}

type PasswordAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PASSWORDS'; payload: Password[] }
  | { type: 'ADD_PASSWORD'; payload: Password }
  | { type: 'UPDATE_PASSWORD'; payload: { id: string; updates: Partial<Password> } }
  | { type: 'DELETE_PASSWORD'; payload: string };

const PasswordContext = createContext<PasswordContextType | undefined>(undefined);

const passwordReducer = (state: PasswordState, action: PasswordAction): PasswordState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PASSWORDS':
      return { ...state, passwords: action.payload, isLoading: false };
    case 'ADD_PASSWORD':
      return { ...state, passwords: [...state.passwords, action.payload] };
    case 'UPDATE_PASSWORD':
      return {
        ...state,
        passwords: state.passwords.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      };
    case 'DELETE_PASSWORD':
      return {
        ...state,
        passwords: state.passwords.filter(p => p.id !== action.payload),
      };
    default:
      return state;
  }
};

export function PasswordProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(passwordReducer, {
    passwords: [],
    isLoading: false,
  });

  useEffect(() => {
    // Load passwords from localStorage
    const storedPasswords = localStorage.getItem('passwords');
    if (storedPasswords) {
      dispatch({ type: 'SET_PASSWORDS', payload: JSON.parse(storedPasswords) });
    } else {
      // Initialize with sample data
      const samplePasswords: Password[] = [
        {
          id: '1',
          title: 'Google Account',
          username: 'user@example.com',
          password: 'SecurePass123!',
          website: 'google.com',
          category: 'Personal',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'GitHub',
          username: 'developer',
          password: 'DevPassword456#',
          website: 'github.com',
          category: 'Work',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      dispatch({ type: 'SET_PASSWORDS', payload: samplePasswords });
      localStorage.setItem('passwords', JSON.stringify(samplePasswords));
    }
  }, []);

  const addPassword = (passwordData: Omit<Password, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPassword: Password = {
      ...passwordData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_PASSWORD', payload: newPassword });
    
    const updatedPasswords = [...state.passwords, newPassword];
    localStorage.setItem('passwords', JSON.stringify(updatedPasswords));
  };

  const updatePassword = (id: string, updates: Partial<Password>) => {
    const updatedData = { ...updates, updatedAt: new Date().toISOString() };
    dispatch({ type: 'UPDATE_PASSWORD', payload: { id, updates: updatedData } });
    
    const updatedPasswords = state.passwords.map(p =>
      p.id === id ? { ...p, ...updatedData } : p
    );
    localStorage.setItem('passwords', JSON.stringify(updatedPasswords));
  };

  const deletePassword = (id: string) => {
    dispatch({ type: 'DELETE_PASSWORD', payload: id });
    
    const updatedPasswords = state.passwords.filter(p => p.id !== id);
    localStorage.setItem('passwords', JSON.stringify(updatedPasswords));
  };

  const getPasswordById = (id: string) => {
    return state.passwords.find(p => p.id === id);
  };

  return (
    <PasswordContext.Provider value={{
      ...state,
      addPassword,
      updatePassword,
      deletePassword,
      getPasswordById,
    }}>
      {children}
    </PasswordContext.Provider>
  );
}

export function usePasswords() {
  const context = useContext(PasswordContext);
  if (context === undefined) {
    throw new Error('usePasswords must be used within a PasswordProvider');
  }
  return context;
}