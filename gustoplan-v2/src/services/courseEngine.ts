import { PlanningSemaine, Recette, ElementListeCourses, Ingredient, ElementSourceRecette } from "../types";

// Dictionnaire simple pour deviner les rayons des ingrédients
const DICT_RAYONS: { [key: string]: string } = {
  // Fruits & Légumes
  carotte: "Fruits & Légumes",
  carottes: "Fruits & Légumes",
  tomate: "Fruits & Légumes",
  tomates: "Fruits & Légumes",
  oignon: "Fruits & Légumes",
  oignons: "Fruits & Légumes",
  ail: "Fruits & Légumes",
  citron: "Fruits & Légumes",
  citrons: "Fruits & Légumes",
  salade: "Fruits & Légumes",
  avocat: "Fruits & Légumes",
  avocats: "Fruits & Légumes",
  nomade: "Fruits & Légumes",
  pomme: "Fruits & Légumes",
  pommes: "Fruits & Légumes",
  banane: "Fruits & Légumes",
  bananes: "Fruits & Légumes",
  poivron: "Fruits & Légumes",
  "pomme de terre": "Fruits & Légumes",
  "pommes de terre": "Fruits & Légumes",
  courgette: "Fruits & Légumes",
  courgettes: "Fruits & Légumes",


  // Boucherie & Poissonnerie
  poulet: "Boucherie & Poissonnerie",
  lardons: "Boucherie & Poissonnerie",
  jambon: "Boucherie & Poissonnerie",
  boeuf: "Boucherie & Poissonnerie",
  bœuf: "Boucherie & Poissonnerie",
  saumon: "Boucherie & Poissonnerie",
  steak: "Boucherie & Poissonnerie",
  steaks: "Boucherie & Poissonnerie",
  crevettes: "Boucherie & Poissonnerie",

  // Crèmerie & Produits Frais
  oeuf: "Frais & Crèmerie",
  oeufs: "Frais & Crèmerie",
  œuf: "Frais & Crèmerie",
  œufs: "Frais & Crèmerie",
  beurre: "Frais & Crèmerie",
  creme: "Frais & Crèmerie",
  crème: "Frais & Crèmerie",
  lait: "Frais & Crèmerie",
  fromage: "Frais & Crèmerie",
  parmesan: "Frais & Crèmerie",
  mozzarella: "Frais & Crèmerie",
  yaourt: "Frais & Crèmerie",
  yaourts: "Frais & Crèmerie",

  // Épicerie
  pates: "Épicerie",
  pâtes: "Épicerie",
  riz: "Épicerie",
  huile: "Épicerie",
  sel: "Épicerie",
  poivre: "Épicerie",
  farine: "Épicerie",
  sucre: "Épicerie",
  chocolat: "Épicerie",
  sauce: "Épicerie",
  conserve: "Épicerie",
  pain: "Épicerie",
  baguette: "Épicerie",
};

export function devinerRayon(nomIngredient: string, customRayons?: { [key: string]: string }): string {
  const nomClean = nomIngredient.trim().toLowerCase();
  
  // 1. Vérifier d'abord s'il y a un rayon personnalisé pour cet ingrédient
  if (customRayons && customRayons[nomClean]) {
    return customRayons[nomClean];
  }

  // 2. Recherche correspondance exacte ou partielle dans le dico statique
  for (const key in DICT_RAYONS) {
    if (nomClean.includes(key)) {
      return DICT_RAYONS[key];
    }
  }
  
  return "Autre / Divers";
}

export function genererListeCourses(
  planning: PlanningSemaine | null,
  recettes: Recette[],
  listeActuelle: ElementListeCourses[],
  customRayons?: { [key: string]: string }
): ElementListeCourses[] {
  if (!planning) return [];

  // 1. Extraire tous les ingrédients nécessaires du planning
  const ingredientsMap: { 
    [key: string]: { 
      quantite: number; 
      unite: string; 
      sources: ElementSourceRecette[] 
    } 
  } = {};

  const joursCles = Object.keys(planning.jours);
  joursCles.forEach((jour) => {
    const repasDuJour = planning.jours[jour];
    ["midi", "soir"].forEach((repasKey) => {
      const listeRepas = repasDuJour[repasKey as "midi" | "soir"] || [];
      const arrayRepas = Array.isArray(listeRepas) ? listeRepas : (listeRepas ? [listeRepas] : []);
      arrayRepas.forEach((repas) => {
        if (repas && repas.type === "recette" && repas.id) {
          const recette = recettes.find((r) => r.id === repas.id);
          if (recette) {
            const facteur = (repas.portions || 1) / (recette.portionsDefaut || 1);
            
            recette.ingredients.forEach((ing) => {
              const cle = `${ing.nom.trim().toLowerCase()}_${ing.unite.trim().toLowerCase()}`;
              const quantiteAjustee = ing.quantite * facteur;
              
              const sourceInfo: ElementSourceRecette = {
                recetteId: recette.id,
                recetteTitre: recette.titre,
                jour: jour,
                repas: repasKey as "midi" | "soir",
                quantite: Math.round(quantiteAjustee * 100) / 100,
                unite: ing.unite
              };

              if (ingredientsMap[cle]) {
                ingredientsMap[cle].quantite += quantiteAjustee;
                ingredientsMap[cle].sources.push(sourceInfo);
              } else {
                ingredientsMap[cle] = {
                  quantite: quantiteAjustee,
                  unite: ing.unite,
                  sources: [sourceInfo]
                };
              }
            });
          }
        }
      });
    });
  });

  // 2. Transformer la map en liste d'éléments avec rayons
  const nouveauxElements: ElementListeCourses[] = Object.keys(ingredientsMap).map((cle) => {
    const parts = cle.split("_");
    const nom = parts[0];
    const info = ingredientsMap[cle];
    
    // Essayer de retrouver l'état (dejaAcquis, achete) depuis la liste existante pour ne pas perdre l'action de l'utilisateur
    const elementExistant = listeActuelle.find(
      (item) => item.nom.toLowerCase() === nom.toLowerCase() && item.unite.toLowerCase() === info.unite.toLowerCase()
    );

    return {
      id: cle,
      nom: nom,
      quantite: Math.round(info.quantite * 100) / 100, // Arrondi à 2 décimales
      unite: info.unite,
      rayon: devinerRayon(nom, customRayons),
      dejaAcquis: elementExistant ? elementExistant.dejaAcquis : false,
      achete: elementExistant ? elementExistant.achete : false,
      sources: info.sources
    };
  });

  // 3. Conserver les ajouts manuels existants (qui ne viennent pas des recettes)
  const elementsManuels = listeActuelle.filter((item) => item.manuel);
  
  return [...nouveauxElements, ...elementsManuels];
}
