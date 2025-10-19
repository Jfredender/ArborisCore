import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { App as CapacitorApp } from '@capacitor/app';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isNativeReady: boolean; // <-- A PROPRIEDADE CRÍTICA, AGORA PRESENTE
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNativeReady, setIsNativeReady] = useState(false);

  useEffect(() => {
    // Inicialização do plugin e listeners
    GoogleAuth.initialize();
    
    const authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    const appStateListener = CapacitorApp.addListener('appStateChange', (state) => {
      if (state.isActive && !isNativeReady) {
        setIsNativeReady(true);
      }
    });

    CapacitorApp.getState().then(state => {
      if (state.isActive && !isNativeReady) {
        setIsNativeReady(true);
      }
    });

    return () => {
      authUnsubscribe();
      appStateListener.then(listener => listener.remove());
    };
  }, [isNativeReady]);

  const loginWithGoogle = async () => { /* ... */ };
  const logout = async () => { /* ... */ };

  const value = { user, loading, error, isNativeReady, loginWithGoogle, logout };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) { 
    throw new Error('useAuth deve ser usado dentro de um AuthProvider'); 
  }
  return context;
};