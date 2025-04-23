// context/UserContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserDetails {
  createdDate: string;
  email: string;
  isActive: boolean;
  isDeleted: boolean;
  loginTryRemain: number;
  mode: number;
  number: string;
  password: string;
  roleId: number;
  userId: number;
  userName: string;
}

interface UserContextType {
  userDetails: UserDetails | null;
  isLoading: boolean;
  login: (user: UserDetails) => Promise<void>;
  logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user details from AsyncStorage on app start
  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const storedDetails = await AsyncStorage.getItem('userDetails');
        if (storedDetails) {
          setUserDetails(JSON.parse(storedDetails));
        }
      } catch (error) {
        console.error('Error loading user details:', error);
      } finally {
        setIsLoading(false); // Mark loading complete
      }
    };
    loadUserDetails();
  }, []);

  // Login function
  const login = async (user: UserDetails) => {
    setIsLoading(true);
    try {
      setUserDetails(user);
      await AsyncStorage.setItem('userDetails', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      setUserDetails(null);
      await AsyncStorage.removeItem('userDetails');
    } catch (error) {
      console.error('Error removing user details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ userDetails, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};