import React from 'react';
import { useAuth } from '../context/AuthContext';

const viewStyle: React.CSSProperties = { /* ... */ };
const panelStyle: React.CSSProperties = { /* ... */ };
const baseButtonStyle: React.CSSProperties = { /* ... */ };

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