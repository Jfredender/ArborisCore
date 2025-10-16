import { collection, getDocs, doc } from 'firebase/firestore';
import { db, auth } from '../firebase'; // Este caminho está 100% correto

export interface Entidade {
  id: string;
  nome: string;
  modelUrl: string;
}

export const getEntitiesFromFirestore = async (): Promise<Entidade[]> => {
  const user = auth.currentUser;
  if (!user) {
    console.error("Nenhum utilizador autenticado para buscar entidades.");
    return [];
  }

  try {
    const userEntitiesRef = collection(doc(db, 'users', user.uid), 'entities');
    const querySnapshot = await getDocs(userEntitiesRef);
    const entidades: Entidade[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Entidade));
    return entidades;
  } catch (error) {
    console.error("Erro ao buscar entidades do Firestore:", error);
    throw error;
  }
};