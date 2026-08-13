export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  foyerId?: string;
}

export interface Foyer {
  id: string;
  nom: string;
  codeFoyer: string; // Ex: GUSTO-1234
  jourDebutSemaine: number; // 0 = Dimanche, 1 = Lundi, etc.
}

export interface Ingredient {
  nom: string;
  quantite: number;
  unite: string;
}

export interface Recette {
  id: string;
  titre: string;
  portionsDefaut: number;
  categorie: 'entree' | 'plat' | 'dessert' | 'accompagnement';
  favori: boolean;
  ingredients: Ingredient[];
  imageUrl?: string;
}

export type TypeRepas = 'recette' | 'texte';

export interface RepasPlanifie {
  planifiedId: string; // ID unique pour différencier les repas dans une même cellule
  type: TypeRepas;
  id?: string;        // ID de la recette si type === 'recette'
  texte?: string;     // Texte libre si type === 'texte'
  portions: number;   // Nombre de portions pour ce repas précis
}

export interface JourPlanning {
  midi: RepasPlanifie[];
  soir: RepasPlanifie[];
}

export interface PlanningSemaine {
  debutDate: string; // "YYYY-MM-DD"
  jours: {
    [key: string]: JourPlanning; // ex: "lundi", "mardi", ...
  };
}

export interface ElementSourceRecette {
  recetteId: string;
  recetteTitre: string;
  jour: string; // ex: "lundi", "mardi"
  repas: 'midi' | 'soir';
  quantite: number;
  unite: string;
  portions?: number;
}

export interface ElementListeCourses {
  id: string;
  nom: string;
  quantite: number;
  unite: string;
  rayon: string;
  dejaAcquis: boolean; // Coché lors de la préparation (placard)
  achete: boolean;     // Coché en magasin
  manuel?: boolean;    // Indique si ajouté manuellement
  sources?: ElementSourceRecette[]; // Provenance des ingrédients
}

