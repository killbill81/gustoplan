import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Recette, Ingredient } from "../types";
import { 
  saveRecette, 
  subscribeIngredientsGlobal, 
  saveIngredientGlobal, 
  subscribeCustomUnits,
  IngredientGlobal
} from "../services/db";
import { X, Users, Plus, Info } from "lucide-react";

interface RecipeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recette | null;
  recettes: Recette[];
}

export const RecipeEditModal: React.FC<RecipeEditModalProps> = ({
  isOpen,
  onClose,
  recipe,
  recettes
}) => {
  const { user, foyer, showToast } = useAuth();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titre, setTitre] = useState("");
  const [portions, setPortions] = useState(4);
  const [categorie, setCategorie] = useState<'entree' | 'plat' | 'dessert' | 'accompagnement'>('plat');
  const [imageUrl, setImageUrl] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  
  // Ingrédients du formulaire
  const [ingNom, setIngNom] = useState("");
  const [ingQuantite, setIngQuantite] = useState("");
  const [ingUnite, setIngUnite] = useState("g");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUnitSuggestions, setShowUnitSuggestions] = useState(false);
  
  const [globalIngredients, setGlobalIngredients] = useState<IngredientGlobal[]>([]);
  const [customUnits, setCustomUnits] = useState<string[]>([]);
  const [pendingUnitConfirm, setPendingUnitConfirm] = useState<{
    unite: string;
    action: () => void;
  } | null>(null);

  // Récupération des données globales
  useEffect(() => {
    if (!isOpen || !user?.uid || !foyer?.id) return;
    const unsubscribe = subscribeIngredientsGlobal(user.uid, setGlobalIngredients);
    const unsubCustomUnits = subscribeCustomUnits(foyer.id, setCustomUnits);
    return () => {
      unsubscribe();
      unsubCustomUnits();
    };
  }, [isOpen, user?.uid, foyer?.id]);

  // Initialiser les champs d'édition
  useEffect(() => {
    if (isOpen) {
      if (recipe) {
        setEditingId(recipe.id);
        setTitre(recipe.titre);
        setPortions(recipe.portionsDefaut);
        setCategorie(recipe.categorie);
        setIngredients(recipe.ingredients || []);
        setImageUrl(recipe.imageUrl || "");
        if (recipe.categorie === 'accompagnement' && recipe.ingredients && recipe.ingredients.length > 0) {
          const firstIng = recipe.ingredients[0];
          setIngNom(firstIng.nom);
          setIngQuantite(firstIng.quantite ? firstIng.quantite.toString() : "");
          setIngUnite(firstIng.unite || "g");
        } else {
          setIngNom("");
          setIngQuantite("");
          setIngUnite("g");
        }
      } else {
        // Mode création
        setEditingId(null);
        setTitre("");
        setPortions(4);
        setCategorie("plat");
        setImageUrl("");
        setIngredients([]);
        setIngNom("");
        setIngQuantite("");
        setIngUnite("g");
      }
    }
  }, [isOpen, recipe]);

  if (!isOpen || !foyer?.id) return null;

  // Calcul des suggestions d'unités
  const toutesUnitesExistantes = Array.from(
    (() => {
      const set = new Set<string>(customUnits);
      globalIngredients.forEach((ing) => {
        const u = (ing.unit || "").trim();
        if (u) set.add(u);
      });
      recettes.forEach((r) => {
        (r.ingredients || []).forEach((ing) => {
          const u = ing.unite.trim();
          if (u) set.add(u);
        });
      });
      return set;
    })()
  ).sort();

  const cartesIngredientsUnites = (() => {
    const acc: { [key: string]: string[] } = {};
    globalIngredients.forEach((ing) => {
      const n = ing.name.trim().toLowerCase();
      const u = ing.unit ? ing.unit.trim() : "";
      if (n) {
        if (!acc[n]) acc[n] = [];
        if (u && !acc[n].includes(u)) acc[n].push(u);
      }
    });
    recettes.forEach((r) => {
      (r.ingredients || []).forEach((ing) => {
        const n = ing.nom.trim().toLowerCase();
        const u = ing.unite.trim();
        if (n) {
          if (!acc[n]) acc[n] = [];
          if (u && !acc[n].includes(u)) acc[n].push(u);
        }
      });
    });
    return acc;
  })();

  const tousIngredientsExistants = Object.keys(cartesIngredientsUnites).sort();

  const suggestionsFiltrees = ingNom.trim()
    ? tousIngredientsExistants.filter((nom) =>
        nom.includes(ingNom.toLowerCase().trim())
      )
    : [];

  const unitesSuggerees: { specifiques: string[]; autres: string[] } = (() => {
    const nomClean = ingNom.trim().toLowerCase();
    const unitesSpecifiques = cartesIngredientsUnites[nomClean] || [];
    const saisieUnite = ingUnite.trim().toLowerCase();
    const toutesAutres = toutesUnitesExistantes.filter((u: string) => !unitesSpecifiques.includes(u));

    if (saisieUnite) {
      const specifiquesFiltrees = unitesSpecifiques.filter((u: string) => u.toLowerCase().includes(saisieUnite));
      const autresFiltrees = toutesAutres.filter((u: string) => u.toLowerCase().includes(saisieUnite));
      return { specifiques: specifiquesFiltrees, autres: autresFiltrees };
    }
    return { specifiques: unitesSpecifiques, autres: toutesAutres };
  })();

  const handleAddIngredient = () => {
    if (!ingNom.trim()) return;
    const u = ingUnite.trim();

    const proceed = () => {
      const qty = parseFloat(ingQuantite) || 0;
      const newIng: Ingredient = {
        nom: ingNom.trim().toLowerCase(),
        quantite: qty,
        unite: u
      };
      setIngredients([...ingredients, newIng]);
      setIngNom("");
      setIngQuantite("");
    };

    if (u) {
      const exists = toutesUnitesExistantes.some(existU => existU.trim().toLowerCase() === u.toLowerCase());
      if (!exists) {
        if (u.length > 12 || /\d/.test(u)) {
          alert("L'unité saisie semble invalide ou trop longue (12 caractères max, sans chiffres).");
          return;
        }
        setPendingUnitConfirm({
          unite: u,
          action: proceed
        });
        return;
      }
    }
    proceed();
  };

  const handleRemoveIngredient = (index: number) => {
    const previousIngredients = [...ingredients];
    const removedIng = ingredients[index];
    setIngredients(ingredients.filter((_, i) => i !== index));
    if (removedIng && showToast) {
      showToast(`Ingrédient "${removedIng.nom}" retiré de la recette.`, {
        action: {
          label: "Annuler",
          onClick: () => {
            setIngredients(previousIngredients);
          }
        }
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foyer?.id || !titre.trim()) return;

    const proceedSave = async () => {
      const existingRecette = recettes.find(r => r.id === editingId);
      const wasFavori = existingRecette ? existingRecette.favori : false;

      const savedIngredients = categorie === 'accompagnement'
        ? [{
            nom: (ingNom.trim() || titre.trim()).toLowerCase(),
            quantite: parseFloat(ingQuantite) || 0,
            unite: ingUnite.trim()
          }]
        : ingredients;

      const data: Omit<Recette, 'id'> & { id?: string, imageUrl?: string } = {
        titre: titre.trim(),
        portionsDefaut: portions,
        categorie,
        favori: wasFavori,
        ingredients: savedIngredients
      };

      if (imageUrl.trim()) {
        data.imageUrl = imageUrl.trim();
      } else {
        data.imageUrl = `https://tse2.mm.bing.net/th?q=${encodeURIComponent(titre.trim())}%20recette&w=400&h=300&c=7&rs=1&p=0`;
      }

      if (editingId) {
        data.id = editingId;
      }

      try {
        await saveRecette(foyer.id, data);
        
        // Auto-register new ingredients
        if (user?.uid) {
          for (const ing of savedIngredients) {
            const nomClean = ing.nom.trim();
            if (!nomClean) continue;
            const exists = globalIngredients.some(
              (gi) => gi.name.trim().toLowerCase() === nomClean.toLowerCase()
            );
            if (!exists) {
              const capitalizedName = nomClean.charAt(0).toUpperCase() + nomClean.slice(1);
              await saveIngredientGlobal({
                name: capitalizedName,
                unit: ing.unite.trim(),
                category: "Autre / Divers",
                userId: user.uid
              });
            }
          }
        }

        if (showToast) {
          showToast(`La recette "${titre.trim()}" a bien été enregistrée.`);
        }
        onClose();
      } catch (err) {
        console.error("Impossible de sauvegarder la recette:", err);
      }
    };

    if (categorie === 'accompagnement') {
      const u = ingUnite.trim();
      if (u) {
        const exists = toutesUnitesExistantes.some(existU => existU.trim().toLowerCase() === u.toLowerCase());
        if (!exists) {
          if (u.length > 12 || /\d/.test(u)) {
            alert("L'unité saisie semble invalide ou trop longue (12 caractères max, sans chiffres).");
            return;
          }
          setPendingUnitConfirm({
            unite: u,
            action: async () => {
              const finalIngNom = (ingNom.trim() || titre.trim()).toLowerCase();
              if (finalIngNom) {
                const exists = tousIngredientsExistants.some(nom => nom.toLowerCase() === finalIngNom);
                if (!exists) {
                  const confirmCreate = window.confirm(`L'ingrédient "${ingNom || titre}" n'existe pas dans la base. Voulez-vous le créer ?`);
                  if (!confirmCreate) return;
                }
              }
              await proceedSave();
            }
          });
          return;
        }
      }

      const finalIngNom = (ingNom.trim() || titre.trim()).toLowerCase();
      if (finalIngNom) {
        const exists = tousIngredientsExistants.some(nom => nom.toLowerCase() === finalIngNom);
        if (!exists) {
          const confirmCreate = window.confirm(`L'ingrédient "${ingNom || titre}" n'existe pas dans la base. Voulez-vous le créer ?`);
          if (!confirmCreate) return;
        }
      }
    }

    await proceedSave();
  };

  const handleIngredientBlur = () => {
    const currentIng = ingNom.trim().toLowerCase();
    if (!currentIng) return;

    const exists = tousIngredientsExistants.some(nom => nom.toLowerCase() === currentIng);
    if (!exists) {
      const confirmCreate = window.confirm(`L'ingrédient "${ingNom}" n'existe pas dans la base. Voulez-vous le créer ?`);
      if (!confirmCreate) {
        setIngNom("");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col p-6 shadow-2xl text-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h3 className="text-xl font-bold text-slate-800">
            {categorie === 'accompagnement'
              ? (editingId ? "Modifier l'accompagnement" : "Ajouter un accompagnement")
              : (editingId ? "Modifier la recette" : "Ajouter une recette")}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-grow overflow-y-auto space-y-4 pr-1">
          {imageUrl && (
            <div className="w-full h-40 rounded-2xl overflow-hidden border border-slate-150 shadow-xs shrink-0 select-none">
              <img src={imageUrl} alt={titre} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <label className="block text-slate-500 text-xs font-black uppercase tracking-wider mb-2">
              {categorie === 'accompagnement' ? "Titre de l'accompagnement" : "Titre de la recette"}
            </label>
            <input
              type="text"
              required
              value={titre}
              onChange={(e) => {
                const val = e.target.value;
                setTitre(val);
                if (categorie === 'accompagnement') {
                  if (!ingNom || ingNom.toLowerCase() === titre.toLowerCase()) {
                    setIngNom(val);
                  }
                }
              }}
              placeholder={categorie === 'accompagnement' ? "Ex: Frites maison, Riz pilaf, Haricots verts..." : "Ex: Pâtes Carbonara, Salade César..."}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-850 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-500 text-xs font-black uppercase tracking-wider mb-2">
              URL de l'image (optionnel)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://exemple.com/image.jpg"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-850 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all text-sm"
            />
          </div>

          {categorie === 'accompagnement' ? (
            <div>
              <label className="block text-slate-500 text-xs font-black uppercase tracking-wider mb-2">
                Portions par défaut
              </label>
              <input
                type="number"
                min="1"
                required
                value={portions}
                onChange={(e) => setPortions(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-850 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all text-sm"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 text-xs font-black uppercase tracking-wider mb-2">
                  Catégorie
                </label>
                <select
                  value={categorie}
                  onChange={(e: any) => setCategorie(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-850 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all cursor-pointer text-sm"
                >
                  <option value="entree">Entrée</option>
                  <option value="plat">Plat</option>
                  <option value="dessert">Dessert</option>
                  <option value="accompagnement">Accompagnement</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 text-xs font-black uppercase tracking-wider mb-2">
                  Portions par défaut
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={portions}
                  onChange={(e) => setPortions(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-850 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>
          )}

          {/* Bloc ingrédients */}
          <div className="border-t border-slate-100 pt-4">
            <label className="block text-slate-500 text-xs font-black uppercase tracking-wider mb-2">
              Ingrédients
            </label>
            
            {categorie === 'accompagnement' ? (
              <div className="space-y-3">
                <div className="relative">
                  <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    Ingrédient associé dans la liste de courses
                  </label>
                  <input
                    type="text"
                    placeholder="Nom de l'ingrédient (ex: Pomme de terre)"
                    value={ingNom}
                    onChange={(e) => {
                      setIngNom(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => {
                      setTimeout(() => {
                        setShowSuggestions(false);
                      }, 250);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-850 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder-slate-400"
                  />
                  
                  {showSuggestions && suggestionsFiltrees.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto p-1.5">
                      {suggestionsFiltrees.map((nom) => (
                        <button
                          key={nom}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setIngNom(nom);
                            setShowSuggestions(false);
                            const units = cartesIngredientsUnites[nom] || [];
                            if (units.length > 0) {
                              setIngUnite(units[0]);
                            }
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-indigo-50 hover:text-indigo-650 text-slate-700 transition-all cursor-pointer capitalize font-semibold flex justify-between items-center"
                        >
                          <span>{nom}</span>
                          {cartesIngredientsUnites[nom] && cartesIngredientsUnites[nom].length > 0 && (
                            <span className="text-[10px] text-slate-400 font-normal normal-case ml-2">
                              ({cartesIngredientsUnites[nom].join(", ")})
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Quantité par portion
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ex: 150"
                      value={ingQuantite}
                      onChange={(e) => setIngQuantite(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-850 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder-slate-400"
                    />
                  </div>

                  <div className="w-1/2 relative">
                    <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Unité
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: g, ml, pièce"
                      value={ingUnite}
                      onChange={(e) => {
                        setIngUnite(e.target.value);
                        setShowUnitSuggestions(true);
                      }}
                      onFocus={() => setShowUnitSuggestions(true)}
                      onBlur={() => {
                        setTimeout(() => setShowUnitSuggestions(false), 200);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-850 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder-slate-400"
                    />
                    
                    {showUnitSuggestions && (unitesSuggerees.specifiques.length > 0 || unitesSuggerees.autres.length > 0) && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto p-1.5 flex flex-col gap-0.5">
                        {unitesSuggerees.specifiques.map((u) => (
                          <button
                            key={u}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setIngUnite(u);
                              setShowUnitSuggestions(false);
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-indigo-50 hover:text-indigo-650 text-indigo-750 font-bold transition-all cursor-pointer flex justify-between items-center"
                          >
                            <span>{u}</span>
                          </button>
                        ))}
                        {unitesSuggerees.autres.map((u) => (
                          <button
                            key={u}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setIngUnite(u);
                              setShowUnitSuggestions(false);
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-slate-50 text-slate-500 hover:text-slate-700 font-normal transition-all cursor-pointer flex justify-between items-center bg-slate-50/40"
                          >
                            <span>{u}</span>
                            <span className="text-[9px] bg-slate-200/75 text-slate-550 px-1 py-0.5 rounded font-medium">Autre</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Formulaire ajout ingrédient ponctuel */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="relative">
                    <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Nom de l'ingrédient
                    </label>
                    <input
                      type="text"
                      placeholder="Ajouter un ingrédient à la recette..."
                      value={ingNom}
                      onChange={(e) => {
                        setIngNom(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => {
                        setTimeout(() => {
                          setShowSuggestions(false);
                        }, 250);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-850 text-xs focus:outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder-slate-400"
                    />
                    
                    {showSuggestions && suggestionsFiltrees.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto p-1.5">
                        {suggestionsFiltrees.map((nom) => (
                          <button
                            key={nom}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setIngNom(nom);
                              setShowSuggestions(false);
                              const units = cartesIngredientsUnites[nom] || [];
                              if (units.length > 0) {
                                setIngUnite(units[0]);
                              }
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-indigo-50 hover:text-indigo-650 text-slate-700 transition-all cursor-pointer capitalize font-semibold flex justify-between items-center"
                          >
                            <span>{nom}</span>
                            {cartesIngredientsUnites[nom] && cartesIngredientsUnites[nom].length > 0 && (
                              <span className="text-[10px] text-slate-400 font-normal normal-case ml-2">
                                ({cartesIngredientsUnites[nom].join(", ")})
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Quantité (optionnel)
                      </label>
                      <input
                        type="number"
                        step="any"
                        placeholder="Ex: 250"
                        value={ingQuantite}
                        onChange={(e) => setIngQuantite(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-850 text-xs focus:outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder-slate-400"
                      />
                    </div>

                    <div className="w-1/2 relative">
                      <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Unité
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: g, ml, pièce"
                        value={ingUnite}
                        onChange={(e) => {
                          setIngUnite(e.target.value);
                          setShowUnitSuggestions(true);
                        }}
                        onFocus={() => setShowUnitSuggestions(true)}
                        onBlur={() => {
                          setTimeout(() => setShowUnitSuggestions(false), 200);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-850 text-xs focus:outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder-slate-400"
                      />
                      
                      {showUnitSuggestions && (unitesSuggerees.specifiques.length > 0 || unitesSuggerees.autres.length > 0) && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto p-1.5 flex flex-col gap-0.5">
                          {unitesSuggerees.specifiques.map((u) => (
                            <button
                              key={u}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setIngUnite(u);
                                setShowUnitSuggestions(false);
                              }}
                              className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-indigo-50 hover:text-indigo-650 text-indigo-750 font-bold transition-all cursor-pointer flex justify-between items-center"
                            >
                              <span>{u}</span>
                            </button>
                          ))}
                          {unitesSuggerees.autres.map((u) => (
                            <button
                              key={u}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setIngUnite(u);
                                setShowUnitSuggestions(false);
                              }}
                              className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-slate-55 text-slate-500 hover:text-slate-700 font-normal transition-all cursor-pointer flex justify-between items-center bg-slate-50/40"
                            >
                              <span>{u}</span>
                              <span className="text-[9px] bg-slate-200/75 text-slate-550 px-1 py-0.5 rounded font-medium">Autre</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 text-indigo-700 font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Ajouter l'ingrédient
                  </button>
                </div>

                {/* Liste ingrédients ajoutés */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                    Ingrédients de la recette ({ingredients.length})
                  </span>
                  {ingredients.length > 0 ? (
                    ingredients.map((ing, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-white border border-slate-150 rounded-xl px-3 py-2 text-xs"
                      >
                        <span className="capitalize text-slate-700 font-bold">{ing.nom}</span>
                        <div className="flex items-center gap-2">
                          <span className="bg-indigo-50 text-indigo-750 font-black px-2 py-0.5 rounded border border-indigo-150">
                            {ing.quantite > 0 ? `${ing.quantite} ` : ""}{ing.unite}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredient(index)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic text-center py-2">
                      Aucun ingrédient dans la recette.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end border-t border-slate-100 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              Appliquer les modifications
            </button>
          </div>
        </form>
      </div>

      {pendingUnitConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200 text-slate-800">
            <div className="flex items-center gap-3 text-amber-500 mb-3">
              <Info className="w-6 h-6" />
              <h4 className="text-base font-bold text-slate-900">Nouvelle unité détectée</h4>
            </div>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              L'unité <span className="font-bold text-slate-800">"{pendingUnitConfirm.unite}"</span> n'existe pas encore. Confirmez-vous sa création dans votre base ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPendingUnitConfirm(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  pendingUnitConfirm.action();
                  setPendingUnitConfirm(null);
                }}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-100 transition-all cursor-pointer"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
