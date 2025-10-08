import React, { ReactNode } from 'react';
const laminaStyle: React.CSSProperties = { backgroundColor: 'var(--cor-fundo-safira)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(0, 255, 255, 0.3)', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 0 12px rgba(0, 255, 255, 0.5), 0 0 2px rgba(0, 255, 255, 0.8) inset' };
interface LaminaSafiraProps { children: ReactNode; style?: React.CSSProperties; }
export const LaminaSafira = ({ children, style }: LaminaSafiraProps) => <div style={{ ...laminaStyle, ...style }}>{children}</div>;