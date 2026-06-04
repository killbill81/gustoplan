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
  IngredientGlobal
} from "../services/db";
import { devinerRayon } from "../services/courseEngine";
import { useAuth } from "../contexts/AuthContext";
import { Recette, ElementListeCourses } from "../types";
import { Search, Tag, HelpCircle, Check, Info, Plus, Edit2, Trash2 } from "lucide-react";
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

  // Édition d'un ingrédient
  const [editingIngredientId, setEditingIngredientId] = useState<string | null>(null);
  const [editIngName, setEditIngName] = useState("");
  const [editIngUnit, setEditIngUnit] = useState("");

  // Création d'un nouvel ingrédient
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);
  const [newIngName, setNewIngName] = useState("");
  const [newIngUnit, setNewIngUnit] = useState("");
  const [newIngCategory, setNewIngCategory] = useState("");

  // Configure les capteurs DND pour séparer le Clic du Drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Exige un mouvement de 8px pour démarrer le drag, permettant au simple clic de fonctionner pour le filtrage
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
    return () => {
      unsubIngredients();
      unsubRayons();
      unsubListe();
      unsubCategories();
    };
  }, [user?.uid, foyer?.id]);

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
    // Déclencher l'effet visuel d'absorption
    if (ingredient.id) {
      setLastUpdatedIngId(ingredient.id);
      setTimeout(() => setLastUpdatedIngId(null), 600);
    }

    // 1. Mettre à jour l'ingrédient dans la collection globale
    await saveIngredientGlobal({
      ...ingredient,
      category: newRayon
    });

    // 2. Mettre à jour dans customRayons pour Foyer (V2)
    if (foyer?.id) {
      const cleanName = ingredient.name.trim().toLowerCase();
      const updatedRayons = { ...customRayons, [cleanName]: newRayon };
      await saveRayonsIngredients(foyer.id, updatedRayons);

      // 3. Mettre à jour en cascade dans la liste de courses en cours
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

    // Mettre à jour la liste
    const updatedCategories = activeCategories.map(c => c === oldCat ? newCat : c);
    await saveCustomCategories(foyer.id, updatedCategories);

    // Mettre à jour les rayons des ingrédients (cascade)
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

    // Mettre à jour la liste de courses courante
    const updatedListe = listeCourses.map(item => {
      if (item.rayon === oldCat) {
        return { ...item, rayon: newCat };
      }
      return item;
    });
    await saveListeCourses(foyer.id, updatedListe);

    // Ajuster le filtre sélectionné si on vient de le renommer
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

    // Retirer de la liste des catégories
    const updatedCategories = activeCategories.filter(c => c !== catToDelete);
    await saveCustomCategories(foyer.id, updatedCategories);

    // Retirer des correspondances personnalisées (cascade)
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

    // Mettre à jour la liste de courses courante
    const updatedListe = listeCourses.map(item => {
      if (item.rayon === catToDelete) {
        return { ...item, rayon: devinerRayon(item.nom) };
      }
      return item;
    });
    await saveListeCourses(foyer.id, updatedListe);

    // Réinitialiser le filtre s'il s'agissait de la catégorie supprimée
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

    // Mettre à jour customRayons
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

    // Sync avec customRayons si Foyer V2
    if (foyer?.id) {
      const cleanLower = nameClean.toLowerCase();
      const updatedRayons = { ...customRayons, [cleanLower]: category };
      await saveRayonsIngredients(foyer.id, updatedRayons);
    }

    setEditingIngredientId(null);
  };

  // Supprimer un ingrédient
  const handleDeleteIngredient = async (id: string, name: string) => {
    if (!window.confirm(`Supprimer l'ingrédient "${name}" de la base de données ?`)) return;
    await deleteIngredientGlobal(id);
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
              Base des Ingrédients
            </h2>
            <p className="text-slate-550 text-sm mt-1">
              Gérez les ingrédients et leurs catégories de rayons de course ({ingredients.length} ingrédients)
            </p>
          </div>
        </div>

        {/* Info Alert */}
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
                  className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-slate-855 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all text-xs"
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

            {/* List of All Categories (Unified & Click to filter) */}
            <div className="border-t border-slate-100 pt-3">
              <h4 className="text-3xs font-bold text-slate-500 uppercase tracking-widest mb-2.5">
                Toutes les Catégories ({listRayons.length})
              </h4>
              <div className="flex flex-wrap gap-2 max-h-[350px] md:max-h-[500px] overflow-y-auto pr-1">
                {/* Reset Filter Button "Toutes" */}
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
                            className="bg-slate-50 text-slate-850 border border-indigo-400 rounded px-1.5 py-0.5 text-xs focus:outline-none w-28 focus:bg-white"
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
                              className={`p-0.5 transition-colors ${isSelected ? "text-white hover:text-emerald-300" : "hover:text-emerald-400 text-slate-400"}`}
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
                                className={`p-0.5 transition-colors ${isSelected ? "text-violet-200 hover:text-white" : "hover:text-violet-400 text-slate-400"}`}
                              >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat)}
                                title="Supprimer"
                                className={`p-0.5 transition-colors ${isSelected ? "text-rose-200 hover:text-rose-100" : "hover:text-rose-550 text-slate-450"}`}
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

            {/* Ingredient search input */}
            <div className="relative w-full shrink-0">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un ingrédient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 placeholder-slate-400 text-slate-855 focus:outline-none focus:border-indigo-400 transition-colors shadow-sm"
              />
            </div>

            {/* List of Ingredients */}
            <div className="flex-grow overflow-y-auto pr-1 pb-20 md:pb-6">
              <div className="flex flex-col gap-2 max-w-4xl mx-auto">
                {/* Header Row for Desktop */}
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
                        
                        {/* Nom de l'ingrédient (et unité) */}
                        <div className="w-full sm:w-[65%] flex items-center gap-2 min-w-0">
                          {isEditing ? (
                            <div className="flex gap-2 w-full" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                value={editIngName}
                                onChange={(e) => setEditIngName(e.target.value)}
                                className="flex-grow bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-400"
                              />
                              <input
                                type="text"
                                placeholder="Unité"
                                value={editIngUnit}
                                onChange={(e) => setEditIngUnit(e.target.value)}
                                className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-400"
                              />
                              <button
                                onClick={() => handleSaveIngredient(ing.id!, getResolvedCategory(ing.name, ing.category))}
                                className="p-1 hover:text-emerald-500 text-slate-400 transition-colors"
                                title="Sauvegarder"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingIngredientId(null)}
                                className="p-1 hover:text-rose-500 text-slate-400 transition-colors text-xs"
                                title="Annuler"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between w-full pr-4 group/row">
                              <h3 className="text-sm font-semibold text-slate-800 capitalize truncate" title={ing.name}>
                                {ing.name}
                                {ing.unit && (
                                  <span className="ml-2 inline-flex items-center justify-center text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider bg-indigo-50 border border-indigo-150 text-indigo-750 leading-none align-middle">
                                    {ing.unit}
                                  </span>
                                )}
                              </h3>
                              
                              {/* Actions modifier/supprimer l'ingrédient */}
                              <div className="flex items-center gap-1.5 ml-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => {
                                    setEditingIngredientId(ing.id!);
                                    setEditIngName(ing.name);
                                    setEditIngUnit(ing.unit || "");
                                  }}
                                  title="Modifier le nom/l'unité"
                                  className="p-1.5 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-750 text-indigo-650 rounded-lg transition-all border border-indigo-150/80 cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteIngredient(ing.id!, ing.name)}
                                  title="Supprimer l'ingrédient"
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 hover:text-rose-600 text-rose-550 rounded-lg transition-all border border-rose-150/80 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Rayon Select */}
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
                    <p className="text-center font-bold text-slate-650 text-sm">Aucun ingrédient trouvé</p>
                    {ingredients.length === 0 ? (
                      <p className="text-center text-xs text-slate-450 mt-1">
                        Créez un ingrédient à l'aide du formulaire ci-dessus pour commencer.
                      </p>
                    ) : (
                      <p className="text-center text-xs text-slate-450 mt-1">
                        Modifiez votre recherche ou réinitialisez le filtre de catégorie pour trouver d'autres articles.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>


      {/* Rendu du DragOverlay pour sortir du conteneur de scroll de gauche */}
      <DragOverlay dropAnimation={null}>
        {activeDragId ? (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border bg-violet-600 border-violet-500 text-white font-semibold shadow-xl shadow-violet-500/20 cursor-grabbing">
            {activeDragId}
          </div>
        ) : null}
      </DragOverlay>

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
