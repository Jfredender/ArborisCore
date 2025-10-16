// Exemplo Especulativo da Correção a ser Aplicada em NavegacaoPrincipal.tsx

import React from 'react';

// 1. Definir a interface de props para aceitar 'children'
interface NavegacaoPrincipalProps {
  children: React.ReactNode; // React.ReactNode é o tipo correto para qualquer elemento React
}

// 2. Aplicar a interface ao componente e renderizar os children
export function NavegacaoPrincipal({ children }: NavegacaoPrincipalProps) {
  return (
    <div className="layout-principal">
      <header>
        {/* O seu código de cabeçalho/navegação existente */}
      </header>
      <main>
        {children} {/* <-- Ponto de renderização para as rotas */}
      </main>
      <footer>
        {/* O seu código de rodapé existente */}
      </footer>
    </div>
  );
}