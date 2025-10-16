import { useAuth } from '../context/AuthContext';

export const LoginView = () => {
  // Apanhamos a nova função 'loginWithGoogle' e também o estado de 'error'
  const { loginWithGoogle, error } = useAuth();

  const handleLogin = () => {
    // Chamamos a nova função correta, que não requer argumentos
    loginWithGoogle();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', background: '#1a1a1a', color: 'white', fontFamily: 'monospace' }}>
      <div style={{ padding: '2rem', border: '1px solid #00ff99', borderRadius: '8px', background: '#242424', textAlign: 'center' }}>
        <h1 style={{ color: '#00ff99' }}>ARBORIS AI</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Laboratório de Simulação de Ecossistemas</p>
        
        <button 
          onClick={handleLogin} 
          style={{ background: '#4285F4', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '12px', margin: '2rem auto 0' }}
        >
          {/* Pode adicionar um ícone do Google aqui se desejar */}
          <span>Continuar com o Google</span>
        </button>
        
        {/* Exibimos a mensagem de erro que vem do nosso AuthContext */}
        {error && (
          <p style={{ color: '#ff4d4d', marginTop: '1rem', border: '1px solid #ff4d4d', padding: '0.5rem' }}>
            **Falha na Autenticação:** {error}
          </p>
        )}
      </div>
    </div>
  );
};