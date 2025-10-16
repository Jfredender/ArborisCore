// Caminho: src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext'; // Usando alias
import { ClimaProvider } from '@/context/ClimaContext';     // Usando alias
import { LoginView } from '@/views/LoginView';               // Usando alias
import { LaboratorioView } from '@/views/LaboratorioView';   // Usando alias
import { ExploratorView } from '@/views/ExploratorView';   // Usando alias
import { ArvoreTecView } from '@/views/ArvoreTecView';       // Usando alias
import { NavegacaoPrincipal } from '@/components/layout/NavegacaoPrincipal'; // Usando alias

// A IMPORTAÇÃO CRÍTICA - AGORA CORRIGIDA COM O ALIAS '@/'
import GenesisTestPage from '@/app/details/[id]/genesis-2-test/page';

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <NavegacaoPrincipal>
      <Routes>
        <Route path="/laboratorio" element={<LaboratorioView />} />
        <Route path="/explorator" element={<ExploratorView />} />
        <Route path="/arvore" element={<ArvoreTecView />} />
        <Route path="/genesis-2-test" element={<GenesisTestPage />} />
        <Route path="*" element={<Navigate to="/laboratorio" />} />
      </Routes>
    </NavegacaoPrincipal>
  );
}

function App() {
  return (
    <AuthProvider>
      <ClimaProvider>
        <AppRoutes />
      </ClimaProvider>
    </AuthProvider>
  );
}

export default App;