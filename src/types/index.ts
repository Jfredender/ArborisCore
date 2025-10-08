// src/types/index.ts

// A nossa nova definição de raridade
export type Rarity = 'Comum' | 'Incomum' | 'Raro' | 'Épico';

export interface Entity {
  id: string;
  name: string;
  dnaCode: string;
  category: string;
  rarity: Rarity; // <-- A NOVA PROPRIEDADE DE VALOR
  discoveredAt?: {
    seconds: number;
    nanoseconds: number;
  };
}