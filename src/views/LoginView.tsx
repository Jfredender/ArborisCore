// src/views/LoginView.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LaminaSafira } from '../components/ui/LaminaSafira';

declare const google: any;

const viewContainerStyle: React.CSSProperties = { width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--cor-fundo-metal)' };

export const LoginView = () => {
  const { loginWithGoogleCredential, error } = useAuth();
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);
  const GOOGLE_WEB_CLIENT_ID = "537123553346-h57ccb82oitbtd5kjok2ot33i9lp2gru.apps.googleusercontent.com";

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof google !== 'undefined') {
        clearInterval(interval);
        setIsGsiLoaded(true);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isGsiLoaded && loginWithGoogleCredential) {
      google.accounts.id.initialize({ client_id: GOOGLE_WEB_CLIENT_ID, callback: (response: any) => { if (response.credential) loginWithGoogleCredential(response.credential); } });
      google.accounts.id.renderButton( document.getElementById("googleSignInButton"), { theme: "filled_blue", size: "large", type: "standard", shape: "pill", text: "continue_with" });
    }
  }, [isGsiLoaded, loginWithGoogleCredential]);

  return (
    <div style={viewContainerStyle}>
        <LaminaSafira style={{ textAlign: 'center', padding: '2rem 2.5rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '1px' }}>ARBORIS AI</h1>
          <p style={{ margin: '0.5rem 0 2rem 0', color: 'var(--cor-texto-secundario)', fontSize: '0.9rem' }}>Laboratório de Simulação de Ecossistemas</p>
          <div id="googleSignInButton" style={{ display: 'flex', justifyContent: 'center', minHeight: '40px' }}>
            {!isGsiLoaded && <p style={{fontSize: '0.8rem'}}>A carregar autenticação...</p>}
          </div>
          {error && (
            <div style={{ marginTop: '1rem', padding: '0.5rem', border: '1px solid var(--cor-vermelho-alerta)', borderRadius: '4px' }}>
              <p style={{ margin: 0, color: 'var(--cor-vermelho-alerta)', fontSize: '0.8rem' }}>
                **Falha na Autenticação:** {error}
              </p>
            </div>
          )}
        </LaminaSafira>
      </div>
  );
};