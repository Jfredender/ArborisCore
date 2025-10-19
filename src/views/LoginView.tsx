import React from 'react';
import { useAuth } from '../context/AuthContext';

const viewStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
  flexDirection: 'column', background: '#1a1a1a', color: 'white', fontFamily: 'monospace'
};
const panelStyle: React.CSSProperties = {
  padding: '2rem', border: '1px solid #00ff99', borderRadius: '8px',
  background: '#242424', textAlign: 'center', minWidth: '350px'
};
const baseButtonStyle: React.CSSProperties = {
  background: '#4285F4', color: 'white', border: 'none', padding: '10px 24px',
  borderRadius: '4px', fontSize: '16px', display: 'flex', alignItems: 'center',
  gap: '12px', margin: '2rem auto 0', transition: 'opacity 0.3s'
};

export const LoginView = () => {
  const { loginWithGoogle, error, isNativeReady } = useAuth();

  const handleLogin = () => {
    loginWithGoogle();
  };

  const buttonStyle: React.CSSProperties = {
    ...baseButtonStyle,
    opacity: isNativeReady ? 1 : 0.5,
    cursor: isNativeReady ? 'pointer' : 'wait',
  };

  return (
    <div style={viewStyle}>
      <div style={panelStyle}>
        <h1 style={{ color: '#00ff99' }}>ARBORIS AI</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Laboratório de Simulação de Ecossistemas</p>
        
        <button 
          onClick={handleLogin} 
          disabled={!isNativeReady}
          style={buttonStyle}
        >
          <span>{isNativeReady ? 'Continuar com o Google' : 'A Sincronizar...'}</span>
        </button>
        
        {error && (
          <p style={{ color: '#ff4d4d', marginTop: '1rem', border: '1px solid #ff4d4d', padding: '0.5rem' }}>
            **Falha na Autenticação:** {error}
          </p>
        )}
      </div>
    </div>
  );
};