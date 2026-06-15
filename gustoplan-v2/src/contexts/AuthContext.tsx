import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { getUserProfile, createUserProfile, getFoyer } from "../services/db";
import { UserProfile, Foyer } from "../types";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  foyer: Foyer | null;
  loading: boolean;
  refreshFoyer: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [foyer, setFoyer] = useState<Foyer | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshFoyer = async () => {
    if (userProfile?.foyerId) {
      try {
        const f = await getFoyer(userProfile.foyerId);
        setFoyer(f);
      } catch (err) {
        console.error("Erreur lors de la récupération du foyer:", err);
      }
    } else {
      setFoyer(null);
    }
  };

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (firebaseUser) {
        try {
          let profile = await getUserProfile(firebaseUser.uid);
          if (!profile) {
            profile = await createUserProfile(firebaseUser.uid, firebaseUser.email || "");
          }
          setUserProfile(profile);

          unsubscribeProfile = onSnapshot(doc(db, "users", firebaseUser.uid), (docSnap) => {
            if (docSnap.exists()) {
              setUserProfile(docSnap.data() as UserProfile);
            } else {
              setUserProfile(null);
            }
            setLoading(false);
          }, (error) => {
            console.error("Erreur onSnapshot user profile:", error);
            setLoading(false);
          });
        } catch (err) {
          console.error("Erreur de profil utilisateur:", err);
          setLoading(false);
        }
      } else {
        setUserProfile(null);
        setFoyer(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  // Récupérer le foyer à chaque fois que l'ID du foyer change dans le profil
  useEffect(() => {
    refreshFoyer();
  }, [userProfile?.foyerId]);

  const logout = async () => {
    setLoading(true);
    await auth.signOut();
    setUser(null);
    setUserProfile(null);
    setFoyer(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, foyer, loading, refreshFoyer, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé au sein d'un AuthProvider");
  }
  return context;
};
