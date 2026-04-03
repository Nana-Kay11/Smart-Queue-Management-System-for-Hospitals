import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// URL for testing:
// Android Emulator: 10.0.2.2
// iOS Simulator: localhost
// Real Device (Expo Go): Your computer's local IP (e.g., 10.107.8.97)
export const API_URL = 'http://10.107.8.97:5000/api';

type UserData = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  authToken: string | null;
  user: UserData | null;
  isLoading: boolean;
  login: (token: string, userData: UserData) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  authToken: null,
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from storage on app start
  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        setIsLoading(true);
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData');

        if (storedToken && storedUser) {
          setAuthToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Set default axios header
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.error('Error fetching token from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    isLoggedIn();
  }, []);

  const login = async (token: string, userData: UserData) => {
    setIsLoading(true);
    setAuthToken(token);
    setUser(userData);
    
    // Set default axios header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    setAuthToken(null);
    setUser(null);
    
    // Clear axios header
    delete axios.defaults.headers.common['Authorization'];

    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ authToken, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
