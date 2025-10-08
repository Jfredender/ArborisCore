// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithGoogleCredential: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // --- PROTOCOLO DE VERIFICAÇÃO DE CONEXÃO ---
    // Inicia um temporizador de segurança de 10 segundos.
    const connectionTimeout = setTimeout(() => {
      // Se 'loading' ainda for verdadeiro após 10 segundos, a conexão falhou.
      if (loading) {
        console.error("AuthContext Timeout: A conexão com o Firebase não foi estabelecida.");
        setError("FALHA DE CONEXÃO: Não foi possível comunicar com os servidores de autenticação. Verifique o seu firewall, antivírus ou conexão de rede.");
        setLoading(false); // Para a tela de "INICIANDO PROTOCOLOS..."
      }
    }, 10000); // 10 segundos

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Se recebermos uma resposta do Firebase, cancelamos o temporizador.
      clearTimeout(connectionTimeout);
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(connectionTimeout);
    };
  }, []); // O array vazio garante que isto só executa uma vez.

  const loginWithGoogleCredential = async (idToken: string) => {
    setError(null);
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
    } catch (err) {
      console.error("Erro detalhado ao autenticar:", err);
      if (err instanceof Error) { setError(err.message); } 
      else { setError("Erro desconhecido durante o login."); }
    }
  };

  const logout = async () => {
    try { await signOut(auth); } 
    catch (error) { console.error("Erro no logout:", error); }
  };

  const value = { user, loading, error, loginWithGoogleCredential, logout };

  // Se houver um erro de conexão, a LoginView irá exibi-lo.
  // Se ainda estiver a carregar, exibe a mensagem de inicialização.
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