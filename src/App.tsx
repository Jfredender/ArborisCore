// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClimaProvider } from './context/ClimaContext'; // <-- NOVA IMPORTAÇÃO
import { LoginView } from './views/LoginView';
import { LaboratorioView } from './views/LaboratorioView';
import { ExploratorView } from './views/ExploratorView';
import { ArvoreTecView } from './views/ArvoreTecView';
import { NavegacaoPrincipal } from './components/layout/NavegacaoPrincipal';

// O componente de rotas agora vive dentro do AuthContext
function AppRoutes() {
  const { user } = useAuth();
  if (!user) { return ( <Routes><Route path="/login" element={<LoginView />} /><Route path="*" element={<Navigate to="/login" />} /></Routes> ); }
  return (
    <>
      <NavegacaoPrincipal />
      <Routes>
        <Route path="/laboratorio" element={<LaboratorioView />} />
        <Route path="/explorator" element={<ExploratorView />} />
        <Route path="/arvore" element={<ArvoreTecView />} />
        <Route path="*" element={<Navigate to="/laboratorio" />} />
      </Routes>
    </>
  );
}

// O App principal agora envolve tudo com os Providers
function App() {
  return (
    <AuthProvider>
      <ClimaProvider> {/* <-- PROVIDER ADICIONADO */}
        <AppRoutes />
      </ClimaProvider>
    </AuthProvider>
  );
}
export default App;