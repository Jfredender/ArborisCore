// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ESTA É A CONFIGURAÇÃO CANÓNICA, 100% ALINHADA COM A FONTE DA VERDADE FORNECIDA PELO DIRETOR.
const firebaseConfig = {
  apiKey: "AIzaSyDHNpms72pPeoi1b-MFUes8pCvmfC9neEA",
  authDomain: "arboris-core.firebaseapp.com",
  projectId: "arboris-core",
  storageBucket: "arboris-core.firebasestorage.app",
  messagingSenderId: "537123553346",
  appId: "1:537123553346:web:35a1080cda3509861b6ddb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);