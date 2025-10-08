// src/components/layout/NavegacaoPrincipal.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const navContainerStyle: React.CSSProperties = { position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100, backgroundColor: 'var(--cor-fundo-safira)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '50px', padding: '0.5rem', display: 'flex', gap: '0.5rem', boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)', border: '1px solid rgba(0, 255, 255, 0.3)' };
const navLinkStyle: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace", textDecoration: 'none', color: 'var(--cor-texto-secundario)', padding: '0.75rem 1.5rem', borderRadius: '50px', transition: 'all 0.3s ease', fontSize: '0.9rem' };
const activeLinkStyle: React.CSSProperties = { backgroundColor: 'var(--cor-ciano-cirurgico)', color: '#000', fontWeight: 'bold' };

export const NavegacaoPrincipal = () => {
  return (
    <nav style={navContainerStyle}>
      <NavLink to="/laboratorio" style={({ isActive }) => isActive ? { ...navLinkStyle, ...activeLinkStyle } : navLinkStyle}>Laboratório</NavLink>
      <NavLink to="/explorator" style={({ isActive }) => isActive ? { ...navLinkStyle, ...activeLinkStyle } : navLinkStyle}>Explorator</NavLink>
      {/* --- NOVO LINK ADICIONADO --- */}
      <NavLink to="/arvore" style={({ isActive }) => isActive ? { ...navLinkStyle, ...activeLinkStyle } : navLinkStyle}>Tecnologia</NavLink>
    </nav>
  );
};