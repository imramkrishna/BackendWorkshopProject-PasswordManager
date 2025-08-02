import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PasswordContext = createContext();

export const usePasswords = () => {
  const context = useContext(PasswordContext);
  if (!context) {
    throw new Error('usePasswords must be used within a PasswordProvider');
  }
  return context;
};

export const PasswordProvider = ({ children }) => {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadPasswords();
    }
  }, [user]);

  const loadPasswords = () => {
    const savedPasswords = localStorage.getItem('passwords');
    if (savedPasswords) {
      setPasswords(JSON.parse(savedPasswords));
    }
  };

  const savePasswordsToStorage = (newPasswords) => {
    localStorage.setItem('passwords', JSON.stringify(newPasswords));
    setPasswords(newPasswords);
  };

  const addPassword = async (passwordData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newPassword = {
        id: Date.now(),
        ...passwordData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedPasswords = [...passwords, newPassword];
      savePasswordsToStorage(updatedPasswords);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Failed to add password' };
    }
  };

  const updatePassword = async (id, passwordData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedPasswords = passwords.map(pwd => 
        pwd.id === id 
          ? { ...pwd, ...passwordData, updatedAt: new Date().toISOString() }
          : pwd
      );
      
      savePasswordsToStorage(updatedPasswords);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Failed to update password' };
    }
  };

  const deletePassword = async (id) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedPasswords = passwords.filter(pwd => pwd.id !== id);
      savePasswordsToStorage(updatedPasswords);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Failed to delete password' };
    }
  };

  const value = {
    passwords,
    addPassword,
    updatePassword,
    deletePassword,
    loading
  };

  return (
    <PasswordContext.Provider value={value}>
      {children}
    </PasswordContext.Provider>
  );
};