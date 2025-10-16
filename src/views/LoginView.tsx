import { useAuth } from '../context/AuthContext';

// --- ESTILOS (Alinhados com a Estética do Projeto) ---
const viewStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  flexDirection: 'column',
  background: '#1a1a1a',
  color: 'white',
  fontFamily: 'monospace',
};

const panelStyle: React.CSSProperties = {
  padding: '2rem',
  border: '1px solid #00ff99',
  borderRadius: '8px',
  background: '#242424',
  textAlign: 'center',
  minWidth: '350px',
};

const baseButtonStyle: React.CSSProperties = {
  background: '#4285F4',
  color: 'white',
  border: 'none',
  padding: '10px 24px',
  borderRadius: '4px',
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  margin: '2rem auto 0',
  transition: 'opacity 0.3s',
};

export const LoginView = () => {
  // Apanhamos a função 'loginWithGoogle', o estado de 'error', e o nosso novo estado 'isNativeReady'
  const { loginWithGoogle, error, isNativeReady } = useAuth();

  const handleLogin = () => {
    // A função só é chamada se o botão não estiver desativado
    loginWithGoogle();
  };

  // Estilo dinâmico para o botão
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
          disabled={!isNativeReady} // <-- DIRETIVA DE SINCRONIZAÇÃO CRÍTICA
          style={buttonStyle}
        >
          {/* O texto do botão agora reflete o estado do sistema */}
          <span>{isNativeReady ? 'Continuar com o Google' : 'A Sincronizar...'}</span>
        </button>
        
        {error && (
          <p style={{ color: '#ff4d4d', marginTop: '1rem', border: '1px solid #ff4d4d', padding: '0.5rem', maxWidth: '300px', margin: '1rem auto 0', wordWrap: 'break-word' }}>
            **Falha na Autenticação:** {error}
          </p>
        )}
      </div>
    </div>
  );
};