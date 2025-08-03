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

  // Fix: Add method to set multiple passwords from API
  const setPasswordsFromAPI = (passwordArray) => {
    console.log('Setting passwords from API:', passwordArray);

    const processedPasswords = passwordArray.map(pwd => {
      console.log('Processing password:', pwd);
      return {
        ...pwd,
        id: pwd._id || pwd.id, // Handle MongoDB _id
        createdAt: pwd.createdAt || new Date().toISOString(),
        updatedAt: pwd.updatedAt || new Date().toISOString()
      };
    });

    console.log('Processed passwords:', processedPasswords);
    setPasswords(processedPasswords);
    savePasswordsToStorage(processedPasswords);
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

      return { success: true };
    } catch (error) {
      console.error('Error adding password:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (id, updatedData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedPasswords = passwords.map(pwd =>
        pwd.id === id
          ? { ...pwd, ...updatedData, updatedAt: new Date().toISOString() }
          : pwd
      );

      savePasswordsToStorage(updatedPasswords);
      return { success: true };
    } catch (error) {
      console.error('Error updating password:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deletePassword = async (id) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedPasswords = passwords.filter(pwd => pwd.id !== id);
      savePasswordsToStorage(updatedPasswords);

      return { success: true };
    } catch (error) {
      console.error('Error deleting password:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    passwords,
    addPassword,
    updatePassword,
    deletePassword,
    setPasswordsFromAPI,
    loading
  };

  return (
    <PasswordContext.Provider value={value}>
      {children}
    </PasswordContext.Provider>
  );
};