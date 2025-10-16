import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
// --- IMPORTAÇÃO CORRIGIDA: REMOÇÃO DO TIPO INTERNO ---
import { App as CapacitorApp } from '@capacitor/app';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isNativeReady: boolean;
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // --- LÓGICA ASSÍNCRONA CORRIGIDA E ROBUSTA ---
    // A função addListener retorna uma Promessa. Guardamos a promessa.
    const listenerPromise = CapacitorApp.addListener('appStateChange', (state) => {
      if (state.isActive && !isNativeReady) {
        setIsNativeReady(true);
      }
    });

    CapacitorApp.getState().then(state => {
      if (state.isActive && !isNativeReady) {
        setIsNativeReady(true);
      }
    });

    // A função de limpeza agora opera sobre a promessa.
    return () => {
      unsubscribe();
      // Quando o componente desmontar, esperamos a promessa ser resolvida
      // e então chamamos .remove() no 'handle' do listener.
      listenerPromise.then(listenerHandle => listenerHandle.remove());
    };
  }, [isNativeReady]);

  const loginWithGoogle = async () => { /* ... (código inalterado) ... */ };
  const logout = async () => { /* ... (código inalterado) ... */ };
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