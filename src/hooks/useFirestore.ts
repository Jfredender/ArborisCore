// src/hooks/useFirestore.ts
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, DocumentData } from 'firebase/firestore';

// A MÁGICA ESTÁ AQUI: <T extends { id: string }>
// Dizemos ao TypeScript que este hook pode trabalhar com qualquer tipo 'T',
// desde que esse tipo tenha uma propriedade 'id' do tipo 'string'.
export const useFirestore = <T extends { id: string }>(collectionPath: string) => {
  // O estado 'docs' agora sabe que irá armazenar um array de 'T'.
  const [docs, setDocs] = useState<T[]>([]);

  useEffect(() => {
    // Se o caminho da coleção não estiver pronto (e.g., o utilizador ainda não carregou),
    // não fazemos nada para evitar erros.
    if (!collectionPath) {
      setDocs([]);
      return;
    }

    const q = query(collection(db, collectionPath), orderBy('discoveredAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documents: T[] = [];
      querySnapshot.forEach((doc) => {
        // Garantimos que os dados do documento são do tipo 'T'.
        documents.push({ ...doc.data(), id: doc.id } as T);
      });
      setDocs(documents);
    });

    return () => unsubscribe();
  }, [collectionPath]);

  return { docs };
};