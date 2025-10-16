// src/hooks/useUserData.ts
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

interface UserData {
  researchPoints?: number;
  displayName?: string;
  unlockedTech?: string[];
  claimedMissions?: string[];
  lastLogin?: { seconds: number; nanoseconds: number; }; // <-- NOVA PROPRIEDADE
}

export const useUserData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      return;
    }
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data() as UserData);
      } else {
        // Se o documento não existe, criamo-lo com o timestamp inicial
        setDoc(userDocRef, { 
          displayName: user.displayName || 'Operador', 
          researchPoints: 0, 
          unlockedTech: [], 
          claimedMissions: [],
          lastLogin: serverTimestamp() 
        });
      }
    });
    return () => unsubscribe();
  }, [user]);

  return { userData };
};