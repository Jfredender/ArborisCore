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

  const loginWithGoogle = async () => {
    if (!isNativeReady) {
      setError("A plataforma nativa ainda não está pronta. Tente novamente.");
      return;
    }
    setError(null);
    try {
      const googleUser = await GoogleAuth.signIn();
      if (!googleUser.authentication?.idToken) {
        throw new Error("O token de ID do Google não foi recebido.");
      }
      const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
      await signInWithCredential(auth, credential);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido durante o login.";
      setError(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await GoogleAuth.signOut();
      await signOut(auth);
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  };

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