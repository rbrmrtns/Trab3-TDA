import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const [storageToken, storageUser] = await AsyncStorage.multiGet(['@auth_token', '@auth_user']);
      
      if (storageToken[1] && storageUser[1]) {
        setAuthData({ 
          token: storageToken[1], 
          user: JSON.parse(storageUser[1]) 
        });
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function logar(email, password) {
    try {
      const response = await api.post('/login', { email, password });
      
      const { jwt, user } = response.data; 

      await AsyncStorage.setItem('@auth_token', jwt);
      await AsyncStorage.setItem('@auth_user', JSON.stringify(user));

      setAuthData({ token: jwt, user });
      
    } catch (error) {
      throw error;
    }
  }

  async function deslogar() {
    await AsyncStorage.multiRemove(['@auth_token', '@auth_user']);
    setAuthData(null);
  }

  return (
    <AuthContext.Provider value={{ logado: !!authData, user: authData?.user, logar, deslogar, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}