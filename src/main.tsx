import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App' // A extensão .tsx é opcional aqui e o sistema resolve-a.
import './index.css'
// A CORREÇÃO ESTÁ NESTA LINHA. O FICHEIRO CHAMA-SE AuthContext.tsx
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)