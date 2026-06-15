import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  arrayUnion,
  addDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "./firebase";
import { UserProfile, Foyer, Recette, PlanningSemaine, ElementListeCourses } from "../types";

// --- SYSTEME DE SUIVI DE SAUVEGARDE EN TEMPS RÉEL (AUTO-SAVE INDICATOR) ---
type DbStateListener = (state: "idle" | "saving") => void;
const listeners = new Set<DbStateListener>();
let activeOperations = 0;

function notifyListeners() {
  const state = activeOperations > 0 ? "saving" : "idle";
  listeners.forEach((l) => l(state));
}

export function subscribeDbState(listener: DbStateListener) {
  listeners.add(listener);
  listener(activeOperations > 0 ? "saving" : "idle");
  return () => {
    listeners.delete(listener);
  };
}

async function wrapWrite<T>(promise: Promise<T>): Promise<T> {
  activeOperations++;
  notifyListeners();
  try {
    const result = await promise;
    return result;
  } finally {
    activeOperations--;
    // Légère temporisation pour éviter les clignotements et rendre la transition visible
    setTimeout(() => {
      notifyListeners();
    }, 800);
  }
}

// --- GESTION DES UTILISATEURS ET FOYERS ---

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
}

export async function createUserProfile(uid: string, email: string): Promise<UserProfile> {
  const profile: UserProfile = { uid, email };
  await wrapWrite(setDoc(doc(db, "users", uid), profile));
  return profile;
}

export async function createFoyer(userId: string, nomFoyer: string): Promise<string> {
  // Générer un code foyer unique court
  const code = "GUSTO-" + Math.floor(1000 + Math.random() * 9000);
  
  const foyerRef = collection(db, "foyers");
  const docRef = await wrapWrite(addDoc(foyerRef, {
    nom: nomFoyer,
    codeFoyer: code,
    jourDebutSemaine: 1 // Lundi par défaut
  }));

  const foyerId = docRef.id;

  // Mettre à jour l'utilisateur avec son nouveau foyerId
  await wrapWrite(updateDoc(doc(db, "users", userId), { foyerId }));

  return foyerId;
}

export async function joinFoyerByCode(userId: string, codeFoyer: string): Promise<string> {
  const foyersRef = collection(db, "foyers");
  const q = query(foyersRef, where("codeFoyer", "==", codeFoyer.trim().toUpperCase()));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("Aucun foyer trouvé avec ce code.");
  }

  const foyerDoc = querySnapshot.docs[0];
  const foyerId = foyerDoc.id;

  // Assigner l'utilisateur à ce foyer
  await wrapWrite(updateDoc(doc(db, "users", userId), { foyerId }));

  return foyerId;
}

export async function getFoyer(foyerId: string): Promise<Foyer | null> {
  const docRef = doc(db, "foyers", foyerId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Foyer;
  }
  return null;
}

export async function updateFoyerStartDay(foyerId: string, dayIndex: number): Promise<void> {
  await wrapWrite(updateDoc(doc(db, "foyers", foyerId), { jourDebutSemaine: dayIndex }));
}

// --- GESTION DES RECETTES (TEMPS RÉEL) ---

export function subscribeRecettes(foyerId: string, callback: (recettes: Recette[]) => void) {
  const colRef = collection(db, "foyers", foyerId, "recettes");
  return onSnapshot(colRef, (snapshot) => {
    const recettes: Recette[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const favori = data.favori !== undefined ? data.favori : (data.isFavorite || false);
      recettes.push({ id: doc.id, ...data, favori } as Recette);
    });
    callback(recettes);
  });
}

export async function saveRecette(foyerId: string, recette: Omit<Recette, 'id'> & { id?: string }): Promise<void> {
  if (recette.id) {
    const docRef = doc(db, "foyers", foyerId, "recettes", recette.id);
    await wrapWrite(setDoc(docRef, recette));
  } else {
    const colRef = collection(db, "foyers", foyerId, "recettes");
    await wrapWrite(addDoc(colRef, recette));
  }
}

export async function toggleFavoriRecette(foyerId: string, recetteId: string, favori: boolean): Promise<void> {
  const docRef = doc(db, "foyers", foyerId, "recettes", recetteId);
  await wrapWrite(updateDoc(docRef, { favori }));
}

export async function deleteRecette(foyerId: string, recetteId: string): Promise<void> {
  const docRef = doc(db, "foyers", foyerId, "recettes", recetteId);
  await wrapWrite(deleteDoc(docRef));
}

// --- GESTION DU PLANNING (TEMPS RÉEL) ---

export function subscribePlanning(foyerId: string, callback: (planning: PlanningSemaine | null) => void) {
  const docRef = doc(db, "foyers", foyerId, "planning", "semaine");
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as PlanningSemaine);
    } else {
      callback(null);
    }
  });
}

export async function savePlanning(foyerId: string, planning: PlanningSemaine): Promise<void> {
  const docRef = doc(db, "foyers", foyerId, "planning", "semaine");
  await wrapWrite(setDoc(docRef, planning));
}

// --- GESTION DE LA LISTE DE COURSES (TEMPS RÉEL) ---

export function subscribeListeCourses(foyerId: string, callback: (elements: ElementListeCourses[]) => void) {
  const docRef = doc(db, "foyers", foyerId, "liste_courses", "actuelle");
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      callback(data.ingredients || []);
    } else {
      callback([]);
    }
  });
}

export async function saveListeCourses(foyerId: string, elements: ElementListeCourses[]): Promise<void> {
  const docRef = doc(db, "foyers", foyerId, "liste_courses", "actuelle");
  await wrapWrite(setDoc(docRef, { ingredients: elements }));
}

// --- GESTION DES RAYONS DES INGRÉDIENTS (TEMPS RÉEL) ---

export function subscribeRayonsIngredients(foyerId: string, callback: (rayons: { [key: string]: string }) => void) {
  const docRef = doc(db, "foyers", foyerId, "rayons_ingredients", "actuel");
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() || {});
    } else {
      callback({});
    }
  });
}

export async function saveRayonsIngredients(foyerId: string, rayons: { [key: string]: string }): Promise<void> {
  const docRef = doc(db, "foyers", foyerId, "rayons_ingredients", "actuel");
  await wrapWrite(setDoc(docRef, rayons));
}

export function subscribeCustomCategories(foyerId: string, callback: (categories: string[]) => void) {
  const docRef = doc(db, "foyers", foyerId, "rayons_ingredients", "categories");
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data().list || []);
    } else {
      callback([]);
    }
  });
}

export async function saveCustomCategories(foyerId: string, categories: string[]): Promise<void> {
  const docRef = doc(db, "foyers", foyerId, "rayons_ingredients", "categories");
  await wrapWrite(setDoc(docRef, { list: categories }));
}

export interface IngredientGlobal {
  id?: string;
  name: string;
  unit: string;
  category: string;
  userId?: string;
}

export function subscribeIngredientsGlobal(userId: string, callback: (ingredients: IngredientGlobal[]) => void) {
  const colRef = collection(db, "ingredients");
  return onSnapshot(colRef, (snapshot) => {
    const list: IngredientGlobal[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.userId || data.userId === userId) {
        list.push({ id: doc.id, ...data } as IngredientGlobal);
      }
    });
    list.sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }));
    callback(list);
  });
}

export async function saveIngredientGlobal(ingredient: IngredientGlobal): Promise<void> {
  if (ingredient.id) {
    const docRef = doc(db, "ingredients", ingredient.id);
    await wrapWrite(setDoc(docRef, ingredient));
  } else {
    const colRef = collection(db, "ingredients");
    await wrapWrite(addDoc(colRef, ingredient));
  }
}

export async function deleteIngredientGlobal(id: string): Promise<void> {
  const docRef = doc(db, "ingredients", id);
  await wrapWrite(deleteDoc(docRef));
}
