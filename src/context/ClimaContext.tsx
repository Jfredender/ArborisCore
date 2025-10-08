// src/context/ClimaContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Clima = 'sol' | 'chuva';

interface ClimaContextType {
  clima: Clima;
  setClima: (clima: Clima) => void;
}

const ClimaContext = createContext<ClimaContextType | undefined>(undefined);

export const ClimaProvider = ({ children }: { children: ReactNode }) => {
  const [clima, setClima] = useState<Clima>('sol');
  const value = { clima, setClima };
  return <ClimaContext.Provider value={value}>{children}</ClimaContext.Provider>;
};

export const useClima = () => {
  const context = useContext(ClimaContext);
  if (context === undefined) {
    throw new Error('useClima deve ser usado dentro de um ClimaProvider');
  }
  return context;
};