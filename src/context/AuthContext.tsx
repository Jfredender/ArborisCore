// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
// --- IMPORTAÇÃO CORRIGIDA: O TIPO 'SignInWithGoogleResult' FOI REMOVIDO ---
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

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

  useEffect(() => {
    const connectionTimeout = setTimeout(() => {
      if (loading) {
        console.error("AuthContext Timeout: A conexão com o Firebase não foi estabelecida.");
        setError("FALHA DE CONEXÃO: Não foi possível comunicar com os servidores de autenticação.");
        setLoading(false);
      }
    }, 10000);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      clearTimeout(connectionTimeout);
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(connectionTimeout);
    };
  }, []);

  // --- LÓGICA DE LOGIN CORRIGIDA: REMOÇÃO DA TIPAGEM OBSOLETA ---
  const loginWithGoogle = async () => {
    setError(null);
    try {
      // A chamada à função permanece a mesma. Apenas removemos a anotação de tipo da variável 'result'.
      // Como não usamos a variável 'result', podemos simplesmente chamar a função.
      await FirebaseAuthentication.signInWithGoogle();
      // O 'onAuthStateChanged' irá tratar do sucesso da autenticação.
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

  const value = { user, loading, error, loginWithGoogle, logout };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: "'IBM Plex Mono', monospace", color: 'white', backgroundColor: '#282c34' }}>
        <p>INICIANDO PROTOCOLOS...</p>
      </div>
    );
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) { throw new Error('useAuth deve ser usado dentro de um AuthProvider'); }
  return context;
};