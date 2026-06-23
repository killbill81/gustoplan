import React, { useState, useEffect } from "react";
import { 
  subscribeRecettes, 
  subscribeRayonsIngredients, 
  saveRayonsIngredients, 
  subscribeListeCourses, 
  saveListeCourses, 
  subscribeCustomCategories, 
  saveCustomCategories,
  subscribeIngredientsGlobal,
  saveIngredientGlobal,
  deleteIngredientGlobal,
  IngredientGlobal,
  subscribeCustomUnits,
  saveCustomUnits,
  saveRecette
} from "../services/db";
import { devinerRayon } from "../services/courseEngine";
import { useAuth } from "../contexts/AuthContext";
import { Recette, ElementListeCourses } from "../types";
import { Search, Tag, HelpCircle, Check, Info, Plus, Edit2, Trash2, X } from "lucide-react";
import { DndContext, useDraggable, useDroppable, DragOverlay, useSensors, useSensor, PointerSensor } from "@dnd-kit/core";

const DEFAULT_RAYONS = [
  "Fruits & Légumes",
  "Boucherie & Poissonnerie",
  "Frais & Crèmerie",
  "Épicerie",
  "Autre / Divers"
];

// Composant Draggable pour une Catégorie
const DraggableCategory: React.FC<{ name: string; children: React.ReactNode }> = ({ name, children }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `cat-${name}`,
    data: { categoryName: name }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing select-none ${isDragging ? "opacity-20" : ""}`}
    >
      {children}
    </div>
  );
};

// Composant Droppable pour une ligne d'ingrédient
const DroppableIngredientRow: React.FC<{
  id: string;
  nom: string;
  isCustomized: boolean;
  isRecentlyUpdated: boolean;
  children: React.ReactNode;
}> = ({ id, nom, isCustomized, isRecentlyUpdated, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `ing-${id}`,
    data: { ingredientId: id, ingredientName: nom }
  });

  return (
    <div
      ref={setNodeRef}
      className={`transition-all rounded-xl border ${
        isRecentlyUpdated
          ? "animate-absorb"
          : isOver
          ? "bg-indigo-50 border-indigo-400 shadow-md shadow-indigo-100 scale-[1.01]"
          : isCustomized
          ? "bg-indigo-50/20 border-indigo-150 hover:border-indigo-300"
          : "bg-white border-slate-200/80 hover:border-slate-350 shadow-3xs"
      }`}
    >
      {children}
    </div>
  );
};

export const IngredientsView: React.FC = () => {
  const { user, foyer } = useAuth();
  const [ingredients, setIngredients] = useState<IngredientGlobal[]>([]);
  const [customRayons, setCustomRayons] = useState<{ [key: string]: string }>({});
  const [listeCourses, setListeCourses] = useState<ElementListeCourses[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryValue, setEditCategoryValue] = useState("");
  const [search, setSearch] = useState("");
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lastUpdatedIngId, setLastUpdatedIngId] = useState<string | null>(null);

  // Souscriptions recettes et unités personnalisées
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [customUnits, setCustomUnits] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'units'>('ingredients');

  // Édition d'un ingrédient
  const [editingIngredientId, setEditingIngredientId] = useState<string | null>(null);
  const [editIngName, setEditIngName] = useState("");
  const [editIngUnit, setEditIngUnit] = useState("");
  const [showUnitSuggestions, setShowUnitSuggestions] = useState(false);

  // Création d'un nouvel ingrédient
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);
  const [newIngName, setNewIngName] = useState("");
  const [newIngUnit, setNewIngUnit] = useState("");
  const [newIngCategory, setNewIngCategory] = useState("");

  // Confirmation de suppression en cascade pour ingrédient
  const [ingredientToDelete, setIngredientToDelete] = useState<{ id: string; name: string } | null>(null);
  const [impactedRecettes, setImpactedRecettes] = useState<string[]>([]);
  const [isImpactedInListe, setIsImpactedInListe] = useState(false);

  // Gestion des unités
  const [editingUnitName, setEditingUnitName] = useState<string | null>(null);
  const [editUnitValue, setEditUnitValue] = useState("");
  const [newUnitValue, setNewUnitValue] = useState("");

  // Confirmation de suppression en cascade pour unité
  const [unitToDelete, setUnitToDelete] = useState<string | null>(null);
  const [impactedIngredientsByUnit, setImpactedIngredientsByUnit] = useState<string[]>([]);
  const [impactedRecipesByUnit, setImpactedRecipesByUnit] = useState<string[]>([]);
  const [isUnitInListe, setIsUnitInListe] = useState(false);
  const [isUnitDeletionBlocked, setIsUnitDeletionBlocked] = useState(false);

  // Gestion multi-unités par ingrédient
  const [selectedIngForNewUnit, setSelectedIngForNewUnit] = useState<IngredientGlobal | null>(null);
  const [newUnitForIngValue, setNewUnitForIngValue] = useState("");
  const [showAddUnitForIngModal, setShowAddUnitForIngModal] = useState(false);
  const [blockingRecipeModal, setBlockingRecipeModal] = useState<{
    ingredientName: string;
    unit: string;
    recipes: string[];
  } | null>(null);

  // Confirmation de modification en cascade pour unité
  const [unitToEdit, setUnitToEdit] = useState<{ oldUnit: string; newUnit: string } | null>(null);
  const [editImpactedIngredients, setEditImpactedIngredients] = useState<string[]>([]);
  const [editImpactedRecipes, setEditImpactedRecipes] = useState<string[]>([]);
  const [isEditUnitInListe, setIsEditUnitInListe] = useState(false);

  // Configure les capteurs DND pour séparer le Clic du Drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Abonnements temps réel
  useEffect(() => {
    if (!user?.uid || !foyer?.id) return;
    const unsubIngredients = subscribeIngredientsGlobal(user.uid, setIngredients);
    const unsubRayons = subscribeRayonsIngredients(foyer.id, setCustomRayons);
    const unsubListe = subscribeListeCourses(foyer.id, setListeCourses);
    const unsubCategories = subscribeCustomCategories(foyer.id, setCustomCategories);
    const unsubRecettes = subscribeRecettes(foyer.id, setRecettes);
    const unsubCustomUnits = subscribeCustomUnits(foyer.id, setCustomUnits);
    return () => {
      unsubIngredients();
      unsubRayons();
      unsubListe();
      unsubCategories();
      unsubRecettes();
      unsubCustomUnits();
    };
  }, [user?.uid, foyer?.id]);

  // Récupérer toutes les unités uniques existantes dans la base d'ingrédients, les recettes et les unités personnalisées
  const toutesUnitesExistantes = Array.from(
    recettes.reduce<Set<string>>((acc, r) => {
      r.ingredients.forEach(i => {
        const u = (i.unite || "").trim();
        if (u) acc.add(u);
      });
      return acc;
    }, ingredients.reduce<Set<string>>((acc, ing) => {
      const u = (ing.unit || "").trim();
      if (u) acc.add(u);
      return acc;
    }, new Set<string>(customUnits)))
  ).sort();

  // Suggestions d'unités pour l'édition de l'ingrédient actif
  const unitesSuggerees = (() => {
    const query = editIngUnit.trim().toLowerCase();
    if (query) {
      return toutesUnitesExistantes.filter(u => u.toLowerCase().includes(query));
    }
    return toutesUnitesExistantes;
  })();

  // Liste active des rayons (catégories du foyer ou par défaut), triée
  const activeCategories = customCategories.length > 0 ? customCategories : DEFAULT_RAYONS;
  const listRayons = [...activeCategories].sort((a, b) => 
    a.localeCompare(b, "fr", { sensitivity: "base" })
  );

  // Résoudre la catégorie d'un ingrédient en prenant en compte les customRayons
  const getResolvedCategory = (ingName: string, categoryFromDb: string) => {
    const custom = customRayons[ingName.toLowerCase()];
    const resolved = custom || categoryFromDb;
    if (listRayons.includes(resolved)) {
      return resolved;
    }
    const matchInsensitive = listRayons.find(r => r.toLowerCase() === resolved.toLowerCase());
    if (matchInsensitive) return matchInsensitive;
    return listRayons[0] || "Autre / Divers";
  };

  // Filtrer la liste des ingrédients par recherche ET par catégorie sélectionnée
  const ingredientsFiltres = ingredients.filter((ing) => {
    const matchesSearch = ing.name.toLowerCase().includes(search.trim().toLowerCase());
    if (!matchesSearch) return false;
    
    if (selectedCategory) {
      return getResolvedCategory(ing.name, ing.category) === selectedCategory;
    }
    
    return true;
  });

  const handleUpdateRayon = async (ingredient: IngredientGlobal, newRayon: string) => {
    if (ingredient.id) {
      setLastUpdatedIngId(ingredient.id);
      setTimeout(() => setLastUpdatedIngId(null), 600);
    }

    await saveIngredientGlobal({
      ...ingredient,
      category: newRayon
    });

    if (foyer?.id) {
      const cleanName = ingredient.name.trim().toLowerCase();
      const updatedRayons = { ...customRayons, [cleanName]: newRayon };
      await saveRayonsIngredients(foyer.id, updatedRayons);

      const updatedListe = listeCourses.map((item) => {
        if (item.nom.trim().toLowerCase() === cleanName) {
          return { ...item, rayon: newRayon };
        }
        return item;
      });
      await saveListeCourses(foyer.id, updatedListe);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foyer?.id || !newCategoryName.trim()) return;
    const cleanCat = newCategoryName.trim();
    const updated = [...activeCategories, cleanCat];
    await saveCustomCategories(foyer.id, updated);
    setNewCategoryName("");
  };

  const handleRenameCategory = async (oldCat: string) => {
    if (!foyer?.id) return;
    const newCat = editCategoryValue.trim();
    if (!newCat || oldCat === newCat) {
      setEditingCategory(null);
      return;
    }

    if (listRayons.some(r => r.toLowerCase() === newCat.toLowerCase() && r !== oldCat)) {
      return;
    }

    const updatedCategories = activeCategories.map(c => c === oldCat ? newCat : c);
    await saveCustomCategories(foyer.id, updatedCategories);

    const updatedRayons = { ...customRayons };
    let changedRayonsCount = 0;
    Object.keys(updatedRayons).forEach(ing => {
      if (updatedRayons[ing] === oldCat) {
        updatedRayons[ing] = newCat;
        changedRayonsCount++;
      }
    });
    if (changedRayonsCount > 0) {
      await saveRayonsIngredients(foyer.id, updatedRayons);
    }

    const updatedListe = listeCourses.map(item => {
      if (item.rayon === oldCat) {
        return { ...item, rayon: newCat };
      }
      return item;
    });
    await saveListeCourses(foyer.id, updatedListe);

    if (selectedCategory === oldCat) {
      setSelectedCategory(newCat);
    }

    setEditingCategory(null);
  };

  const handleDeleteCategory = async (catToDelete: string) => {
    if (!foyer?.id) return;
    
    if (!window.confirm(`Supprimer la catégorie "${catToDelete}" ? Les ingrédients associés repasseront dans leur rayon par défaut.`)) {
      return;
    }

    const updatedCategories = activeCategories.filter(c => c !== catToDelete);
    await saveCustomCategories(foyer.id, updatedCategories);

    const updatedRayons = { ...customRayons };
    let changedRayonsCount = 0;
    Object.keys(updatedRayons).forEach(ing => {
      if (updatedRayons[ing] === catToDelete) {
        delete updatedRayons[ing];
        changedRayonsCount++;
      }
    });
    if (changedRayonsCount > 0) {
      await saveRayonsIngredients(foyer.id, updatedRayons);
    }

    const updatedListe = listeCourses.map(item => {
      if (item.rayon === catToDelete) {
        return { ...item, rayon: devinerRayon(item.nom) };
      }
      return item;
    });
    await saveListeCourses(foyer.id, updatedListe);

    if (selectedCategory === catToDelete) {
      setSelectedCategory(null);
    }
  };

  // Créer un ingrédient
  const handleCreateIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !newIngName.trim()) return;

    const nameClean = newIngName.trim();
    const category = newIngCategory || listRayons[0] || "Autre / Divers";

    await saveIngredientGlobal({
      name: nameClean,
      unit: newIngUnit.trim(),
      category,
      userId: user.uid
    });

    if (foyer?.id) {
      const updatedRayons = { ...customRayons, [nameClean.toLowerCase()]: category };
      await saveRayonsIngredients(foyer.id, updatedRayons);
    }

    setNewIngName("");
    setNewIngUnit("");
    setNewIngCategory("");
    setIsAddingIngredient(false);
  };

  // Enregistrer les modifications d'un ingrédient
  const handleSaveIngredient = async (id: string, category: string) => {
    if (!user?.uid) return;
    const nameClean = editIngName.trim();
    if (!nameClean) return;

    await saveIngredientGlobal({
      id,
      name: nameClean,
      unit: editIngUnit.trim(),
      category,
      userId: user.uid
    });

    if (foyer?.id) {
      const cleanLower = nameClean.toLowerCase();
      const updatedRayons = { ...customRayons, [cleanLower]: category };
      await saveRayonsIngredients(foyer.id, updatedRayons);
    }

    setEditingIngredientId(null);
  };

  // Supprimer un ingrédient
  const handleDeleteIngredient = (id: string, name: string) => {
    const cleanName = name.trim().toLowerCase();
    
    // Trouver les recettes impactées
    const recipesFound = recettes.filter(r => 
      r.ingredients.some(i => i.nom.trim().toLowerCase() === cleanName)
    ).map(r => r.titre);
    
    // Trouver si présent dans la liste de courses
    const inList = listeCourses.some(item => item.nom.trim().toLowerCase() === cleanName);
    
    setIngredientToDelete({ id, name });
    setImpactedRecettes(recipesFound);
    setIsImpactedInListe(inList);
  };

  const confirmDeleteIngredient = async () => {
    if (!ingredientToDelete || !foyer?.id) return;
    
    const { id, name } = ingredientToDelete;
    const cleanName = name.trim().toLowerCase();
    
    // 1. Supprimer l'ingrédient global
    await deleteIngredientGlobal(id);
    
    // 2. Mettre à jour en cascade dans toutes les recettes
    for (const recette of recettes) {
      const hasIngredient = recette.ingredients.some(i => i.nom.trim().toLowerCase() === cleanName);
      if (hasIngredient) {
        const updatedIngredients = recette.ingredients.filter(i => i.nom.trim().toLowerCase() !== cleanName);
        await saveRecette(foyer.id, {
          ...recette,
          ingredients: updatedIngredients
        });
      }
    }
    
    // 3. Mettre à jour en cascade dans la liste de courses
    const updatedListe = listeCourses.filter(item => item.nom.trim().toLowerCase() !== cleanName);
    await saveListeCourses(foyer.id, updatedListe);
    
    // 4. Retirer également de customRayons
    if (customRayons[cleanName]) {
      const updatedRayons = { ...customRayons };
      delete updatedRayons[cleanName];
      await saveRayonsIngredients(foyer.id, updatedRayons);
    }
    
    // Fermer le modal
    setIngredientToDelete(null);
    setImpactedRecettes([]);
    setIsImpactedInListe(false);
  };

  // --- GESTION DES UNITÉS (ONGLET 2) ---
  const getIngredientUnits = (ing: IngredientGlobal): string[] => {
    const unitsSet = new Set<string>();
    if (ing.units && Array.isArray(ing.units)) {
      ing.units.forEach(u => {
        const clean = u.trim();
        if (clean) unitsSet.add(clean);
      });
    } else if (ing.unit) {
      ing.unit.split(",").forEach(u => {
        const clean = u.trim();
        if (clean) unitsSet.add(clean);
      });
    }
    recettes.forEach(r => {
      (r.ingredients || []).forEach(ri => {
        if (ri.nom.trim().toLowerCase() === ing.name.trim().toLowerCase()) {
          const clean = ri.unite.trim();
          if (clean) unitsSet.add(clean);
        }
      });
    });
    listeCourses.forEach(item => {
      if (item.nom.trim().toLowerCase() === ing.name.trim().toLowerCase()) {
        const clean = item.unite.trim();
        if (clean) unitsSet.add(clean);
      }
    });
    return Array.from(unitsSet);
  };

  const handleRemoveUnitFromIngredient = async (ing: IngredientGlobal, unitToRemove: string) => {
    const cleanUnit = unitToRemove.trim().toLowerCase();
    const blockingRecipes = recettes.filter(r => 
      (r.ingredients || []).some(ri => 
        ri.nom.trim().toLowerCase() === ing.name.trim().toLowerCase() && 
        ri.unite.trim().toLowerCase() === cleanUnit
      )
    ).map(r => r.titre);

    if (blockingRecipes.length > 0) {
      setBlockingRecipeModal({
        ingredientName: ing.name,
        unit: unitToRemove,
        recipes: blockingRecipes
      });
      return;
    }

    const currentUnits = getIngredientUnits(ing);
    const updatedUnits = currentUnits.filter(u => u.trim().toLowerCase() !== cleanUnit);
    const updatedUnitStr = updatedUnits.length > 0 ? updatedUnits[0] : "";

    await saveIngredientGlobal({
      ...ing,
      unit: updatedUnitStr,
      units: updatedUnits
    });
  };

  const handleAddUnitToIngredient = async (ing: IngredientGlobal, newUnit: string) => {
    const cleanUnit = newUnit.trim();
    if (!cleanUnit) return;

    if (cleanUnit.length > 12) {
      alert("L'unité ne doit pas dépasser 12 caractères.");
      return;
    }
    if (/\d/.test(cleanUnit)) {
      alert("L'unité ne doit pas contenir de chiffres.");
      return;
    }

    const currentUnits = getIngredientUnits(ing);
    if (currentUnits.some(u => u.toLowerCase() === cleanUnit.toLowerCase())) {
      alert("Cet ingrédient possède déjà cette unité.");
      return;
    }

    const updatedUnits = [...currentUnits, cleanUnit];
    const updatedUnitStr = updatedUnits[0];

    await saveIngredientGlobal({
      ...ing,
      unit: updatedUnitStr,
      units: updatedUnits
    });

    setShowAddUnitForIngModal(false);
    setSelectedIngForNewUnit(null);
  };

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foyer?.id || !newUnitValue.trim()) return;
    const cleanUnit = newUnitValue.trim();

    if (cleanUnit.length > 12) {
      alert("L'unité ne doit pas dépasser 12 caractères.");
      return;
    }
    if (/\d/.test(cleanUnit)) {
      alert("L'unité ne doit pas contenir de chiffres.");
      return;
    }

    if (customUnits.some(u => u.toLowerCase() === cleanUnit.toLowerCase())) {
      alert("Cette unité existe déjà.");
      return;
    }

    const updated = [...customUnits, cleanUnit];
    await saveCustomUnits(foyer.id, updated);
    setNewUnitValue("");
  };

  const requestEditUnit = (oldUnit: string, newUnit: string) => {
    const cleanOld = oldUnit.trim().toLowerCase();
    const cleanNew = newUnit.trim();
    if (!cleanNew || cleanOld === cleanNew.toLowerCase()) return;

    if (cleanNew.length > 12) {
      alert("L'unité ne doit pas dépasser 12 caractères.");
      return;
    }
    if (/\d/.test(cleanNew)) {
      alert("L'unité ne doit pas contenir de chiffres.");
      return;
    }

    const impactedIngs = ingredients.filter(i => (i.unit || "").trim().toLowerCase() === cleanOld).map(i => i.name);
    const impactedRecs = recettes.filter(r => r.ingredients.some(i => (i.unite || "").trim().toLowerCase() === cleanOld)).map(r => r.titre);
    const inList = listeCourses.some(item => (item.unite || "").trim().toLowerCase() === cleanOld);

    if (impactedIngs.length === 0 && impactedRecs.length === 0 && !inList) {
      performEditUnit(oldUnit, cleanNew);
    } else {
      setUnitToEdit({ oldUnit, newUnit: cleanNew });
      setEditImpactedIngredients(impactedIngs);
      setEditImpactedRecipes(impactedRecs);
      setIsEditUnitInListe(inList);
    }
  };

  const performEditUnit = async (oldUnit: string, newUnit: string) => {
    if (!foyer?.id) return;
    const cleanOld = oldUnit.trim().toLowerCase();
    const cleanNew = newUnit.trim();

    const updatedCustom = customUnits.map(u => u.toLowerCase() === cleanOld ? cleanNew : u);
    const hasOld = customUnits.some(u => u.toLowerCase() === cleanOld);
    let finalCustom = updatedCustom;
    if (!hasOld) {
      finalCustom = [...customUnits, cleanNew];
    }
    await saveCustomUnits(foyer.id, finalCustom);

    for (const ing of ingredients) {
      if ((ing.unit || "").trim().toLowerCase() === cleanOld) {
        await saveIngredientGlobal({
          ...ing,
          unit: cleanNew
        });
      }
    }

    for (const recette of recettes) {
      const hasUnit = recette.ingredients.some(i => (i.unite || "").trim().toLowerCase() === cleanOld);
      if (hasUnit) {
        const updatedIngs = recette.ingredients.map(i => {
          if ((i.unite || "").trim().toLowerCase() === cleanOld) {
            return { ...i, unite: cleanNew };
          }
          return i;
        });
        await saveRecette(foyer.id, {
          ...recette,
          ingredients: updatedIngs
        });
      }
    }

    const updatedList = listeCourses.map(item => {
      if ((item.unite || "").trim().toLowerCase() === cleanOld) {
        return { ...item, unite: cleanNew };
      }
      return item;
    });
    await saveListeCourses(foyer.id, updatedList);

    setUnitToEdit(null);
    setEditingUnitName(null);
    setEditImpactedIngredients([]);
    setEditImpactedRecipes([]);
    setIsEditUnitInListe(false);
  };

  const requestDeleteUnit = (unit: string) => {
    const cleanUnit = unit.trim().toLowerCase();

    const setIngs = new Set<string>();
    ingredients.forEach(i => {
      if ((i.unit || "").trim().toLowerCase() === cleanUnit) {
        setIngs.add(i.name.trim());
      }
    });
    recettes.forEach(r => {
      r.ingredients.forEach(i => {
        if ((i.unite || "").trim().toLowerCase() === cleanUnit) {
          const capitalized = i.nom.trim().charAt(0).toUpperCase() + i.nom.trim().slice(1);
          setIngs.add(capitalized);
        }
      });
    });
    const uniqueImpactedIngs = Array.from(setIngs).sort();
    const inList = listeCourses.some(item => (item.unite || "").trim().toLowerCase() === cleanUnit);

    const isBlocked = uniqueImpactedIngs.length > 0 || inList;

    setUnitToDelete(unit);
    setImpactedIngredientsByUnit(uniqueImpactedIngs);
    setImpactedRecipesByUnit([]);
    setIsUnitInListe(inList);
    setIsUnitDeletionBlocked(isBlocked);
  };

  const confirmDeleteUnit = async () => {
    if (!unitToDelete || !foyer?.id) return;
    const cleanUnit = unitToDelete.trim().toLowerCase();

    const updatedCustom = customUnits.filter(u => u.toLowerCase() !== cleanUnit);
    await saveCustomUnits(foyer.id, updatedCustom);

    for (const ing of ingredients) {
      if ((ing.unit || "").trim().toLowerCase() === cleanUnit) {
        await saveIngredientGlobal({
          ...ing,
          unit: ""
        });
      }
    }

    for (const recette of recettes) {
      const hasUnit = recette.ingredients.some(i => (i.unite || "").trim().toLowerCase() === cleanUnit);
      if (hasUnit) {
        const updatedIngs = recette.ingredients.map(i => {
          if ((i.unite || "").trim().toLowerCase() === cleanUnit) {
            return { ...i, unite: "" };
          }
          return i;
        });
        await saveRecette(foyer.id, {
          ...recette,
          ingredients: updatedIngs
        });
      }
    }

    const updatedList = listeCourses.map(item => {
      if ((item.unite || "").trim().toLowerCase() === cleanUnit) {
        return { ...item, unite: "" };
      }
      return item;
    });
    await saveListeCourses(foyer.id, updatedList);

    setUnitToDelete(null);
    setImpactedIngredientsByUnit([]);
    setImpactedRecipesByUnit([]);
    setIsUnitInListe(false);
    setIsUnitDeletionBlocked(false);
  };

  // Gestion du dépôt Drag & Drop
  const handleDragStart = (event: any) => {
    setActiveDragId(event.active.data.current?.categoryName || null);
  };

  const handleDragEnd = async (event: any) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over) return;

    const categoryName = active.data.current?.categoryName;
    const ingredientId = over.data.current?.ingredientId;

    if (categoryName && ingredientId) {
      const ing = ingredients.find(i => i.id === ingredientId);
      if (ing) {
        await handleUpdateRayon(ing, categoryName);
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-full flex flex-col p-4 md:p-6 bg-slate-50 text-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 shrink-0">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
              <Tag className="text-indigo-650" />
              {activeTab === "ingredients" ? "Base des Ingrédients" : "Gestion des Unités"}
            </h2>
            <p className="text-slate-550 text-sm mt-1">
              {activeTab === "ingredients"
                ? `Gérez les ingrédients et leurs catégories de rayons de course (${ingredients.length} ingrédients)`
                : `Créez, modifiez ou supprimez les unités de mesure de vos ingrédients (${toutesUnitesExistantes.length} unités)`}
            </p>
          </div>
          {activeTab === "ingredients" && (
            <button
              onClick={() => setIsAddingIngredient(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all text-xs flex items-center gap-1.5 shadow-sm shadow-indigo-150 cursor-pointer self-start sm:self-center"
            >
              <Plus className="w-4 h-4" />
              Ajouter un ingrédient
            </button>
          )}
        </div>

        {/* Barre d'onglets premium */}
        <div className="flex border-b border-slate-200 mb-6 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("ingredients")}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "ingredients"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Base des Ingrédients
          </button>
          <button
            onClick={() => setActiveTab("units")}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "units"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Gestion des Unités
          </button>
        </div>

        {/* CONTENU SELON ONGLET ACTIF */}
        {activeTab === "ingredients" ? (
          <>
            {/* Info Alert Ingrédients */}
            <div className="bg-indigo-50 border border-indigo-150 rounded-2xl p-4 mb-6 flex gap-3 text-xs text-indigo-750 shrink-0">
              <Info className="w-5 h-5 shrink-0 text-indigo-550" />
              <div>
                <span className="font-bold">Comment ça marche ?</span> Vous pouvez créer, modifier ou supprimer des ingrédients directement. <span className="font-bold text-indigo-650">Cliquez sur une catégorie à gauche pour filtrer la liste</span>. Pour catégoriser un ingrédient, vous pouvez soit le glisser-déposer sur l'ingrédient, soit utiliser son menu déroulant.
              </div>
            </div>

            {/* Principal 2-Column Layout */}
            <div className="flex-grow flex flex-col md:flex-row gap-6 min-h-0 overflow-hidden">
              
              {/* LEFT COLUMN: Category management */}
              <div className="w-full md:w-80 lg:w-96 shrink-0 flex flex-col gap-4 bg-white border border-slate-200 p-4 rounded-2xl h-fit max-h-full overflow-y-auto shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-3">
                    Gestion des Catégories
                  </h3>
                  
                  <form onSubmit={handleAddCategory} className="flex gap-2 w-full mb-3">
                    <input
                      type="text"
                      placeholder="Créer une catégorie (ex: Boissons)..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-slate-855 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all text-xs font-semibold"
                    />
                    <button
                      type="submit"
                      className="bg-orange-100 hover:bg-orange-200 border border-orange-200 text-orange-850 font-bold px-4 py-3 rounded-xl transition-all text-xs shrink-0 flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Créer
                    </button>
                  </form>
                </div>

                {/* List of All Categories */}
                <div className="border-t border-slate-100 pt-3">
                  <h4 className="text-3xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">
                    Toutes les Catégories ({listRayons.length})
                  </h4>
                  <div className="flex flex-wrap gap-2 max-h-[350px] md:max-h-[500px] overflow-y-auto pr-1">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all border font-semibold cursor-pointer ${
                        selectedCategory === null
                          ? "bg-indigo-100 border-indigo-200 text-indigo-750 font-black shadow-xs"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:text-slate-850 text-slate-600"
                      }`}
                    >
                      Toutes
                    </button>

                    {listRayons.map((cat) => {
                      const isSelected = selectedCategory === cat;
                      return (
                        <DraggableCategory key={cat} name={cat}>
                          <div 
                            onClick={() => setSelectedCategory(isSelected ? null : cat)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all border cursor-pointer ${
                              isSelected
                                ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20 font-black"
                                : "bg-white border-slate-200 hover:border-indigo-350 hover:bg-indigo-50/30 text-slate-700"
                            }`}
                          >
                            {editingCategory === cat ? (
                              <input
                                type="text"
                                value={editCategoryValue}
                                onChange={(e) => setEditCategoryValue(e.target.value)}
                                onBlur={() => handleRenameCategory(cat)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleRenameCategory(cat);
                                  if (e.key === "Escape") setEditingCategory(null);
                                }}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                                className="bg-slate-50 text-slate-855 border border-indigo-400 rounded px-1.5 py-0.5 text-xs focus:outline-none w-28 focus:bg-white"
                              />
                            ) : (
                              <span className={`${isSelected ? "text-white font-bold" : "font-semibold"}`}>
                                {cat}
                              </span>
                            )}

                            <div className="flex items-center ml-1" onClick={(e) => e.stopPropagation()}>
                              {editingCategory === cat ? (
                                <button
                                  onClick={() => handleRenameCategory(cat)}
                                  title="Enregistrer"
                                  className={`p-0.5 transition-colors ${isSelected ? "text-white hover:text-emerald-300" : "hover:text-emerald-450 text-slate-405"}`}
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingCategory(cat);
                                      setEditCategoryValue(cat);
                                    }}
                                    title="Modifier"
                                    className={`p-0.5 transition-colors ${isSelected ? "text-violet-200 hover:text-white" : "hover:text-violet-405 text-slate-405"}`}
                                  >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategory(cat)}
                                    title="Supprimer"
                                    className={`p-0.5 transition-colors ${isSelected ? "text-rose-200 hover:text-rose-105" : "hover:text-rose-600 text-slate-405"}`}
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </DraggableCategory>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Search & Ingredients list */}
              <div className="flex-grow flex flex-col gap-4 min-h-0">
                
                {/* Search */}
                <div className="relative w-full shrink-0">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher un ingrédient..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-10 py-3 placeholder-slate-400 text-slate-855 focus:outline-none focus:border-indigo-400 transition-colors shadow-sm"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors p-0.5 rounded cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="flex-grow overflow-y-auto pr-1 pb-20 md:pb-6">
                  <div className="flex flex-col gap-2 max-w-4xl mx-auto">
                    {ingredientsFiltres.length > 0 && (
                      <div className="hidden sm:flex items-center px-4 py-2 text-2xs uppercase font-extrabold tracking-widest text-slate-500 border-b border-slate-100 mb-1">
                        <div className="w-[65%] flex items-center gap-2">
                          <span>Nom de l'ingrédient</span>
                          {selectedCategory && (
                            <span className="text-3xs font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-150 text-indigo-750 normal-case tracking-normal">
                              Filtre : {selectedCategory}
                            </span>
                          )}
                        </div>
                        <div className="w-[35%] flex sm:justify-end">
                          <div className="w-full sm:w-56 md:w-64 lg:w-72 text-left">
                            Rayon de course
                          </div>
                        </div>
                      </div>
                    )}

                    {ingredientsFiltres.map((ing) => {
                      const isCustomized = !!customRayons[ing.name.toLowerCase()];
                      const isEditing = editingIngredientId === ing.id;

                      return (
                        <DroppableIngredientRow 
                          key={ing.id} 
                          id={ing.id!} 
                          nom={ing.name} 
                          isCustomized={isCustomized}
                          isRecentlyUpdated={lastUpdatedIngId === ing.id}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center px-4 py-2.5 gap-2 sm:gap-4">
                            <div className="w-full sm:w-[65%] flex items-center gap-2 min-w-0">
                              {isEditing ? (
                                <div className="flex gap-2 w-full" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="text"
                                    value={editIngName}
                                    onChange={(e) => setEditIngName(e.target.value)}
                                    className="flex-grow bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-400"
                                  />
                                  <div className="relative w-24 flex-shrink-0">
                                    <input
                                      type="text"
                                      placeholder="Unité"
                                      value={editIngUnit}
                                      onChange={(e) => {
                                        setEditIngUnit(e.target.value);
                                        setShowUnitSuggestions(true);
                                      }}
                                      onFocus={() => setShowUnitSuggestions(true)}
                                      onBlur={() => {
                                        setTimeout(() => setShowUnitSuggestions(false), 200);
                                      }}
                                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-400"
                                    />
                                    {showUnitSuggestions && unitesSuggerees.length > 0 && (
                                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-36 overflow-y-auto p-1 text-left">
                                        {unitesSuggerees.map((u) => (
                                          <button
                                            key={u}
                                            type="button"
                                            onMouseDown={(e) => {
                                              e.preventDefault();
                                              setEditIngUnit(u);
                                              setShowUnitSuggestions(false);
                                            }}
                                            className="w-full text-left px-2 py-1 rounded text-[10px] hover:bg-indigo-50 hover:text-indigo-650 text-slate-700 font-semibold cursor-pointer"
                                          >
                                            {u}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleSaveIngredient(ing.id!, getResolvedCategory(ing.name, ing.category))}
                                    className="p-1 hover:text-emerald-500 text-slate-405 transition-colors"
                                    title="Sauvegarder"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setEditingIngredientId(null)}
                                    className="p-1 hover:text-rose-500 text-slate-405 transition-colors text-xs"
                                    title="Annuler"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between w-full pr-4 group/row">
                                  <h3 className="text-sm font-semibold text-slate-855 capitalize truncate" title={ing.name}>
                                    {ing.name}
                                    {getIngredientUnits(ing).map((u) => (
                                      <span key={u} className="group/badge ml-2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider bg-indigo-50 border border-indigo-150 text-indigo-750 leading-none align-middle transition-all">
                                        {u}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveUnitFromIngredient(ing, u);
                                          }}
                                          className="opacity-0 group-hover/badge:opacity-100 hover:text-rose-600 transition-opacity font-extrabold cursor-pointer text-[11px]"
                                          title="Retirer cette unité"
                                        >
                                          ✕
                                        </button>
                                      </span>
                                    ))}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedIngForNewUnit(ing);
                                        setNewUnitForIngValue("");
                                        setShowAddUnitForIngModal(true);
                                      }}
                                      className="ml-2 inline-flex items-center justify-center p-1 rounded-md text-slate-400 hover:text-indigo-650 hover:bg-indigo-50 transition-colors align-middle cursor-pointer"
                                      title="Ajouter une unité à cet ingrédient"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  </h3>
                                  
                                  <div className="flex items-center gap-1.5 ml-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={() => {
                                        setEditingIngredientId(ing.id!);
                                        setEditIngName(ing.name);
                                        setEditIngUnit(ing.unit || "");
                                      }}
                                      title="Modifier"
                                      className="p-1.5 bg-indigo-50 hover:bg-indigo-105 hover:text-indigo-750 text-indigo-650 rounded-lg transition-all border border-indigo-150/80 cursor-pointer"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteIngredient(ing.id!, ing.name)}
                                      title="Supprimer"
                                      className="p-1.5 bg-rose-50 hover:bg-rose-105 hover:text-rose-600 text-rose-550 rounded-lg transition-all border border-rose-150/80 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {!isEditing && (
                              <div className="w-full sm:w-[35%] flex items-center justify-between sm:justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                <span className="sm:hidden text-2xs text-slate-500 uppercase font-bold">Rayon :</span>
                                <select
                                  value={getResolvedCategory(ing.name, ing.category)}
                                  onChange={(e) => handleUpdateRayon(ing, e.target.value)}
                                  className="bg-white border border-slate-200 hover:border-slate-350 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-400 transition-colors w-full sm:w-56 md:w-64 lg:w-72 cursor-pointer shadow-2xs hover:bg-slate-50/50"
                                >
                                  {listRayons.map((rayon) => (
                                    <option key={rayon} value={rayon}>
                                      {rayon}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        </DroppableIngredientRow>
                      );
                    })}

                    {ingredientsFiltres.length === 0 && (
                      <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                        <HelpCircle className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-center font-bold text-slate-655 text-sm">Aucun ingrédient trouvé</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </>
        ) : (
          <>
            {/* Info Alert Unités */}
            <div className="bg-indigo-50 border border-indigo-150 rounded-2xl p-4 mb-6 flex gap-3 text-xs text-indigo-750 shrink-0">
              <Info className="w-5 h-5 shrink-0 text-indigo-550" />
              <div>
                <span className="font-bold">Comment ça marche ?</span> Vous pouvez ajouter de nouvelles unités personnalisées ou modifier/supprimer les unités existantes. Les modifications d'unité seront appliquées <span className="font-bold text-indigo-650">en cascade sur tous vos ingrédients, recettes et la liste de courses</span>.
              </div>
            </div>

            {/* Principal 2-Column Layout for Units */}
            <div className="flex-grow flex flex-col md:flex-row gap-6 min-h-0 overflow-hidden">
              
              {/* LEFT COLUMN: Add custom unit form */}
              <div className="w-full md:w-80 lg:w-96 shrink-0 flex flex-col gap-4 bg-white border border-slate-200 p-4 rounded-2xl h-fit max-h-full overflow-y-auto shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-3">
                    Ajouter une unité
                  </h3>
                  <form onSubmit={handleAddUnit} className="flex gap-2 w-full mb-3">
                    <input
                      type="text"
                      placeholder="Ex: grammes, cl, sachet..."
                      value={newUnitValue}
                      onChange={(e) => setNewUnitValue(e.target.value)}
                      className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-slate-855 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all text-xs font-semibold"
                    />
                    <button
                      type="submit"
                      className="bg-orange-100 hover:bg-orange-200 border border-orange-200 text-orange-850 font-bold px-4 py-3 rounded-xl transition-all text-xs shrink-0 flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Créer
                    </button>
                  </form>
                  <p className="text-[10px] text-slate-400 italic">
                    * Max 12 caractères, lettres uniquement, pas de chiffres.
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: Grid of active units */}
              <div className="flex-grow flex flex-col gap-4 min-h-0 bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm overflow-y-auto">
                <h3 className="text-sm font-bold text-slate-800 mb-1 border-b border-slate-100 pb-3">
                  Liste de toutes les unités existantes
                </h3>
                <div className="flex flex-col gap-2.5 max-w-3xl">
                  {toutesUnitesExistantes.map((unit) => {
                    const isEditing = editingUnitName === unit;
                    const isCustom = customUnits.some(u => u.toLowerCase() === unit.toLowerCase());
                    const inUseInIngs = ingredients.some(i => (i.unit || "").trim().toLowerCase() === unit.toLowerCase());
                    const inUseInRecs = recettes.some(r => r.ingredients.some(i => (i.unite || "").trim().toLowerCase() === unit.toLowerCase()));
                    const isUsed = inUseInIngs || inUseInRecs;

                    return (
                      <div key={unit} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-indigo-150 hover:bg-indigo-50/10 transition-all bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editUnitValue}
                              onChange={(e) => setEditUnitValue(e.target.value)}
                              onBlur={() => {
                                if (editUnitValue.trim() && editUnitValue.trim() !== unit) {
                                  requestEditUnit(unit, editUnitValue);
                                } else {
                                  setEditingUnitName(null);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") requestEditUnit(unit, editUnitValue);
                                if (e.key === "Escape") setEditingUnitName(null);
                              }}
                              autoFocus
                              className="bg-white text-slate-855 border border-indigo-400 rounded-lg px-2.5 py-1 text-xs focus:outline-none w-32 font-bold"
                            />
                          ) : (
                            <span className="font-bold text-slate-800 text-sm">
                              {unit}
                            </span>
                          )}
                          
                          <div className="flex items-center gap-1.5 select-none">
                            {isCustom && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-750">
                                Créée
                              </span>
                            )}
                            {isUsed && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-150 text-emerald-750">
                                Utilisée
                              </span>
                            )}
                            {!isCustom && !isUsed && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-550">
                                Par défaut
                              </span>
                            )}
                          </div>
                        </div>

                        {!isEditing && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingUnitName(unit);
                                setEditUnitValue(unit);
                              }}
                              title="Modifier"
                              className="p-1.5 bg-indigo-50 hover:bg-indigo-105 hover:text-indigo-750 text-indigo-655 rounded-lg transition-all border border-indigo-150/80 cursor-pointer text-xs"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => requestDeleteUnit(unit)}
                              title="Supprimer"
                              className="p-1.5 bg-rose-50 hover:bg-rose-105 hover:text-rose-600 text-rose-550 rounded-lg transition-all border border-rose-150/80 cursor-pointer text-xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {toutesUnitesExistantes.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                      <HelpCircle className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-center font-bold text-slate-655 text-sm">Aucune unité existante</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* --- BOITES DE DIALOGUE MODALES (CONFIRMATIONS ET FORMULAIRE) --- */}

      {/* 1. Modal d'ajout d'un ingrédient */}
      {isAddingIngredient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreateIngredient} className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Ajouter un nouvel ingrédient</h3>
              
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Nom de l'ingrédient *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Tomate, Lait, Farine..."
                    value={newIngName}
                    onChange={(e) => setNewIngName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-slate-855 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Unité par défaut</label>
                    <input
                      type="text"
                      placeholder="Ex: g, ml, pièce..."
                      value={newIngUnit}
                      onChange={(e) => setNewIngUnit(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-slate-855 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Rayon / Catégorie</label>
                    <select
                      value={newIngCategory}
                      onChange={(e) => setNewIngCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-slate-855 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all text-xs cursor-pointer"
                    >
                      <option value="">Sélectionner...</option>
                      {listRayons.map((rayon) => (
                        <option key={rayon} value={rayon}>
                          {rayon}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingIngredient(false);
                    setNewIngName("");
                    setNewIngUnit("");
                    setNewIngCategory("");
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-55 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all cursor-pointer"
                >
                  Créer l'ingrédient
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 2. Modal de suppression en cascade d'un ingrédient */}
      {ingredientToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Supprimer l'ingrédient ?</h3>
              <p className="text-sm text-slate-550 mb-4">
                Êtes-vous sûr de vouloir supprimer définitivement l'ingrédient <span className="font-bold text-slate-855">"{ingredientToDelete.name}"</span> ?
              </p>

              {impactedRecettes.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-855">
                  <span className="font-bold block mb-1">Impact sur vos recettes :</span>
                  Cet ingrédient sera automatiquement retiré de <span className="font-semibold">{impactedRecettes.length} recette(s)</span> :
                  <ul className="list-disc pl-4 mt-1 font-semibold text-amber-900 max-h-24 overflow-y-auto">
                    {impactedRecettes.map((title, idx) => (
                      <li key={idx}>{title}</li>
                    ))}
                  </ul>
                </div>
              )}

              {isImpactedInListe && (
                <div className="bg-rose-50 border border-rose-150 rounded-xl p-3 mb-4 text-xs text-rose-800">
                  <span className="font-bold block">Impact sur la liste de courses :</span>
                  Cet ingrédient sera retiré de votre liste de courses actuelle.
                </div>
              )}

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => {
                    setIngredientToDelete(null);
                    setImpactedRecettes([]);
                    setIsImpactedInListe(false);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-55 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDeleteIngredient}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all cursor-pointer"
                >
                  Confirmer la suppression
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal de modification en cascade d'une unité */}
      {unitToEdit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Modifier l'unité en cascade ?</h3>
              <p className="text-sm text-slate-550 mb-4">
                Vous allez renommer l'unité <span className="font-bold text-slate-800">"{unitToEdit.oldUnit}"</span> en <span className="font-bold text-indigo-650">"{unitToEdit.newUnit}"</span>.
              </p>

              {editImpactedIngredients.length > 0 && (
                <div className="bg-indigo-50/50 border border-indigo-150 rounded-xl p-3 mb-3 text-xs text-indigo-855">
                  <span className="font-bold block mb-1">Impact sur la base d'ingrédients :</span>
                  L'unité sera modifiée pour <span className="font-bold">{editImpactedIngredients.length} ingrédient(s)</span> (ex: {editImpactedIngredients.slice(0, 3).join(", ")}{editImpactedIngredients.length > 3 ? "..." : ""}).
                </div>
              )}

              {editImpactedRecipes.length > 0 && (
                <div className="bg-amber-50 border border-amber-250 rounded-xl p-3 mb-3 text-xs text-amber-855">
                  <span className="font-bold block mb-1">Impact sur vos recettes :</span>
                  L'unité sera modifiée pour les ingrédients de <span className="font-semibold">{editImpactedRecipes.length} recette(s)</span> :
                  <ul className="list-disc pl-4 mt-1 font-semibold text-amber-900 max-h-20 overflow-y-auto">
                    {editImpactedRecipes.map((title, idx) => (
                      <li key={idx}>{title}</li>
                    ))}
                  </ul>
                </div>
              )}

              {isEditUnitInListe && (
                <div className="bg-rose-50 border border-rose-150 rounded-xl p-3 mb-3 text-xs text-rose-800">
                  <span className="font-bold block">Impact sur la liste de courses :</span>
                  Les articles de la liste utilisant cette unité seront mis à jour.
                </div>
              )}

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => {
                    setUnitToEdit(null);
                    setEditingUnitName(null);
                    setEditImpactedIngredients([]);
                    setEditImpactedRecipes([]);
                    setIsEditUnitInListe(false);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-55 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={() => performEditUnit(unitToEdit.oldUnit, unitToEdit.newUnit)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all cursor-pointer"
                >
                  Appliquer les modifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal de suppression d'une unité (Confirmation ou Blocage) */}
      {unitToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              {isUnitDeletionBlocked ? (
                <>
                  <div className="flex items-center gap-3 text-rose-600 mb-3">
                    <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Suppression bloquée</h3>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    L'unité <span className="font-semibold text-slate-800">"{unitToDelete}"</span> ne peut pas être supprimée car elle est actuellement attribuée à un ou plusieurs ingrédients ou recettes.
                  </p>

                  <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 mb-5 text-xs text-slate-700 space-y-3">
                    <span className="font-semibold text-rose-800 block text-[13px] border-b border-rose-100 pb-1.5">Détail des liaisons actives :</span>
                    
                    {impactedIngredientsByUnit.length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-900 block mb-0.5">• Ingrédients ({impactedIngredientsByUnit.length}) :</span>
                        <div className="flex flex-wrap gap-1 mt-1 pl-3">
                          {impactedIngredientsByUnit.slice(0, 8).map((ing, idx) => (
                            <span key={idx} className="bg-white border border-slate-200 rounded-md px-1.5 py-0.5 text-slate-600 font-medium text-[10px]">
                              {ing}
                            </span>
                          ))}
                          {impactedIngredientsByUnit.length > 8 && (
                            <span className="text-[10px] text-slate-500 self-center font-medium pl-1">
                              +{impactedIngredientsByUnit.length - 8} autre(s)
                            </span>
                          )}
                        </div>
                      </div>
                    )}



                    {isUnitInListe && (
                      <div className="flex items-center gap-1.5 text-slate-900 mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                        <span className="font-semibold">Présente sur des articles de la liste de courses</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setUnitToDelete(null);
                        setImpactedIngredientsByUnit([]);
                        setImpactedRecipesByUnit([]);
                        setIsUnitInListe(false);
                        setIsUnitDeletionBlocked(false);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all cursor-pointer"
                    >
                      J'ai compris
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-indigo-600 mb-3">
                    <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Supprimer l'unité ?</h3>
                  </div>

                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    Êtes-vous sûr de vouloir supprimer définitivement l'unité <span className="font-semibold text-slate-800">"{unitToDelete}"</span> ? Elle sera retirée des choix disponibles dans l'application.
                  </p>

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setUnitToDelete(null);
                        setImpactedIngredientsByUnit([]);
                        setImpactedRecipesByUnit([]);
                        setIsUnitInListe(false);
                        setIsUnitDeletionBlocked(false);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={confirmDeleteUnit}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-250 transition-all cursor-pointer"
                    >
                      Confirmer la suppression
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rendu du DragOverlay pour sortir du conteneur de scroll de gauche */}
      {activeTab === "ingredients" && (
        <DragOverlay dropAnimation={null}>
          {activeDragId ? (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border bg-violet-600 border-violet-500 text-white font-semibold shadow-xl shadow-violet-500/20 cursor-grabbing">
              {activeDragId}
            </div>
          ) : null}
        </DragOverlay>
      )}

      {showAddUnitForIngModal && selectedIngForNewUnit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Associer une unité</h3>
              <p className="text-sm text-slate-550 mb-4">
                Choisissez ou saisissez une unité de mesure à associer à l'ingrédient <span className="font-bold text-slate-800">"{selectedIngForNewUnit.name}"</span>.
              </p>

              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Ex: kg, cl, g, pièce, unité, etc."
                  value={newUnitForIngValue}
                  onChange={(e) => {
                    setNewUnitForIngValue(e.target.value);
                    setShowUnitSuggestions(true);
                  }}
                  onFocus={() => setShowUnitSuggestions(true)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-400"
                />
                {showUnitSuggestions && unitesSuggerees.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto p-1.5 text-left">
                    {unitesSuggerees.map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => {
                          setNewUnitForIngValue(u);
                          setShowUnitSuggestions(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-indigo-50 hover:text-indigo-650 text-slate-700 font-semibold cursor-pointer"
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowAddUnitForIngModal(false);
                    setSelectedIngForNewUnit(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleAddUnitToIngredient(selectedIngForNewUnit, newUnitForIngValue)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all cursor-pointer"
                >
                  Associer l'unité
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {blockingRecipeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 text-rose-600 mb-3">
                <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Suppression impossible</h3>
              </div>

              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Vous ne pouvez pas retirer l'unité <span className="font-semibold text-slate-800">"{blockingRecipeModal.unit}"</span> de l'ingrédient <span className="font-semibold text-slate-855">"{blockingRecipeModal.ingredientName}"</span> car cette association est actuellement utilisée dans la/les recette(s) suivante(s) :
              </p>

              <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-3.5 mb-5 text-xs text-slate-700">
                <span className="font-semibold text-rose-800 block text-[13px] border-b border-rose-100 pb-1.5 mb-2">Recettes impactées :</span>
                <ul className="list-disc pl-4 space-y-1 font-medium">
                  {blockingRecipeModal.recipes.map((title, idx) => (
                    <li key={idx} className="text-slate-800 capitalize">{title}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setBlockingRecipeModal(null)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all cursor-pointer"
                >
                  J'ai compris
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles des animations custom */}
      <style>{`
        @keyframes absorb-pop {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0px rgba(139, 92, 246, 0.6);
            border-color: rgba(139, 92, 246, 0.8);
            background-color: rgba(139, 92, 246, 0.15);
          }
          50% {
            transform: scale(1.025);
            box-shadow: 0 0 20px 4px rgba(139, 92, 246, 0.4);
            border-color: rgba(139, 92, 246, 1);
            background-color: rgba(139, 92, 246, 0.3);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0px rgba(139, 92, 246, 0);
            border-color: inherit;
            background-color: inherit;
          }
        }
        .animate-absorb {
          animation: absorb-pop 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </DndContext>
  );
};
