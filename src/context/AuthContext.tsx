import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
// --- NOVA IMPORTAÇÃO DO MUNDO NATIVO PARA O CONTROLO DE ESTADO ---
import { App as CapacitorApp } from '@capacitor/app';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // --- NOVO ESTADO: CONTROLA SE A PONTE NATIVA ESTÁ PRONTA ---
  const [isNativeReady, setIsNativeReady] = useState(false);

  useEffect(() => {
    // Listener do Firebase para o estado do utilizador
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // --- PROTOCOLO DE SINCRONIZAÇÃO DE ARRANQUE ---
    // Ouve o evento 'resume' da aplicação, que só é disparado depois de
    // a ponte nativa estar totalmente inicializada.
    CapacitorApp.addListener('appStateChange', (state) => {
      if (state.isActive) {
        setIsNativeReady(true);
      }
    });

    // Um pequeno truque para plataformas web e para o primeiro arranque
    setTimeout(() => setIsNativeReady(true), 1000); // 1 segundo de segurança

    return () => {
      unsubscribe();
      CapacitorApp.removeAllListeners();
    };
  }, []);

  const loginWithGoogle = async () => {
    // A função só executa se a ponte nativa estiver pronta
    if (!isNativeReady) {
      setError("A plataforma nativa ainda não está pronta. Tente novamente.");
      return;
    }
    setError(null);
    try {
      await FirebaseAuthentication.signInWithGoogle();
    } catch (err) {
      console.error("Erro detalhado ao autenticar via Capacitor:", err);
      const errorMessage = typeof err === 'string' ? err : (err instanceof Error ? err.message : "Erro desconhecido durante o login nativo.");
      setError(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await FirebaseAuthentication.signOut();
    } catch (error) {
      console.error("Erro no logout nativo:", error);
    }
  };

  // Passamos o novo estado 'isNativeReady' para o valor do contexto
  const value = { user, loading, error, loginWithGoogle, logout, isNativeReady };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Modificamos o hook 'useAuth' para também devolver o novo estado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) { throw new Error('useAuth deve ser usado dentro de um AuthProvider'); }
  return context;
};