import React, { useState, useEffect } from "react";
import { subscribeRecettes, saveRecette, deleteRecette, toggleFavoriRecette, subscribeIngredientsGlobal, IngredientGlobal, saveIngredientGlobal } from "../services/db";
import { useAuth } from "../contexts/AuthContext";
import { Recette, Ingredient } from "../types";
import { Plus, Trash2, Heart, Search, BookOpen, UserMinus, PlusCircle, X, Edit3 } from "lucide-react";

const validerNouvelleUnite = (uniteSaisie: string, toutesUnites: string[]): boolean => {
  const clean = uniteSaisie.trim();
  if (!clean) return true;
  
  const existe = toutesUnites.some(u => u.trim().toLowerCase() === clean.toLowerCase());
  if (existe) return true;

  if (clean.length > 12 || /\d/.test(clean)) {
    alert("L'unité saisie semble invalide ou trop longue (12 caractères max, sans chiffres).");
    return false;
  }

  return window.confirm(`L'unité "${clean}" n'existe pas. Êtes-vous sûr de vouloir créer cette nouvelle unité ?`);
};

export const RecettesView: React.FC = () => {
  const { user, foyer } = useAuth();
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [globalIngredients, setGlobalIngredients] = useState<IngredientGlobal[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Formulaire d'ajout/édition
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titre, setTitre] = useState("");
  const [portions, setPortions] = useState(4);
  const [categorie, setCategorie] = useState<'entree' | 'plat' | 'dessert' | 'accompagnement'>('plat');
  const [imageUrl, setImageUrl] = useState("");
  
  // Ingrédients du formulaire
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingNom, setIngNom] = useState("");
  const [ingQuantite, setIngQuantite] = useState("");
  const [ingUnite, setIngUnite] = useState("g");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUnitSuggestions, setShowUnitSuggestions] = useState(false);

  // Récupération en temps réel
  useEffect(() => {
    if (!foyer?.id) return;
    const unsubscribe = subscribeRecettes(foyer.id, (loadedRecettes) => {
      setRecettes(loadedRecettes);
    });
    return unsubscribe;
  }, [foyer?.id]);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeIngredientsGlobal(user.uid, setGlobalIngredients);
    return unsubscribe;
  }, [user?.uid]);

  // Réinitialiser automatiquement tous les champs de la fiche quand la modal se ferme
  useEffect(() => {
    if (!isModalOpen) {
      resetForm();
    }
  }, [isModalOpen]);

  const handleAddIngredient = () => {
    if (!ingNom.trim()) return;
    const u = ingUnite.trim();
    if (u && !validerNouvelleUnite(u, toutesUnitesExistantes)) {
      return;
    }
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

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foyer?.id || !titre.trim()) return;

    // Pour un accompagnement, on vérifie si l'ingrédient existe avant de sauvegarder
    if (categorie === 'accompagnement') {
      const u = ingUnite.trim();
      if (u && !validerNouvelleUnite(u, toutesUnitesExistantes)) {
        return;
      }
      const finalIngNom = (ingNom.trim() || titre.trim()).toLowerCase();
      if (finalIngNom) {
        const exists = tousIngredientsExistants.some(nom => nom.toLowerCase() === finalIngNom);
        if (!exists) {
          const confirmCreate = window.confirm(`L'ingrédient "${ingNom || titre}" n'existe pas dans la base. Voulez-vous le créer ?`);
          if (!confirmCreate) {
            return; // Annule la sauvegarde
          }
        }
      }
    }

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
      
      // Auto-register new ingredients to the global base
      const newAddedIngredients: string[] = [];
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
            newAddedIngredients.push(capitalizedName);
          }
        }
      }

      if (newAddedIngredients.length > 0) {
        const msg = newAddedIngredients.length === 1
          ? `Nouvel ingrédient "${newAddedIngredients[0]}" enregistré dans votre base !`
          : `Nouveaux ingrédients "${newAddedIngredients.join(', ')}" enregistrés dans votre base !`;
        setToast(msg);
        setTimeout(() => {
          setToast((prev) => prev === msg ? null : prev);
        }, 4000);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Impossible de sauvegarder la recette:", err);
    }
  };

  const handleEdit = (recette: Recette) => {
    setEditingId(recette.id);
    setTitre(recette.titre);
    setPortions(recette.portionsDefaut);
    setCategorie(recette.categorie);
    setIngredients(recette.ingredients || []);
    setImageUrl(recette.imageUrl || "");
    if (recette.categorie === 'accompagnement' && recette.ingredients && recette.ingredients.length > 0) {
      const firstIng = recette.ingredients[0];
      setIngNom(firstIng.nom);
      setIngQuantite(firstIng.quantite ? firstIng.quantite.toString() : "");
      setIngUnite(firstIng.unite || "g");
    } else {
      setIngNom("");
      setIngQuantite("");
      setIngUnite("g");
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!foyer?.id || !window.confirm("Supprimer cette recette ?")) return;
    try {
      await deleteRecette(foyer.id, id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFavori = async (recette: Recette) => {
    if (!foyer?.id) return;
    try {
      await toggleFavoriRecette(foyer.id, recette.id, !recette.favori);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitre("");
    setPortions(4);
    setCategorie("plat");
    setImageUrl("");
    setIngredients([]);
    setIngNom("");
    setIngQuantite("");
    setIngUnite("g");
  };


  const filteredRecettes = recettes.filter((r) => {
    const matchesSearch = r.titre.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || r.categorie === categoryFilter;
    const matchesFavorites = !onlyFavorites || r.favori;
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const sortedRecettes = [...filteredRecettes].sort((a, b) => {
    if (a.favori && !b.favori) return -1;
    if (!a.favori && b.favori) return 1;
    return a.titre.localeCompare(b.titre, "fr", { sensitivity: "base" });
  });

  // Liste de toutes les unités existantes (recettes + globalIngredients)
  const toutesUnitesExistantes = Array.from(
    (() => {
      const set = new Set<string>();
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

  // Fusionner les ingrédients des recettes et ceux de la base globale
  const cartesIngredientsUnites = (() => {
    const acc: { [key: string]: string[] } = {};

    // 1. Ajouter les unités de la base globale d'ingrédients
    globalIngredients.forEach((ing) => {
      const n = ing.name.trim().toLowerCase();
      const u = ing.unit ? ing.unit.trim() : "";
      if (n) {
        if (!acc[n]) {
          acc[n] = [];
        }
        if (u && !acc[n].includes(u)) {
          acc[n].push(u);
        }
      }
    });

    // 2. Compléter/Enrichir avec les unités présentes dans les recettes existantes
    recettes.forEach((r) => {
      (r.ingredients || []).forEach((ing) => {
        const n = ing.nom.trim().toLowerCase();
        const u = ing.unite.trim();
        if (n) {
          if (!acc[n]) {
            acc[n] = [];
          }
          if (u && !acc[n].includes(u)) {
            acc[n].push(u);
          }
        }
      });
    });

    return acc;
  })();

  const tousIngredientsExistants = Object.keys(cartesIngredientsUnites).sort();

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

  const suggestionsFiltrees = ingNom.trim()
    ? tousIngredientsExistants.filter((nom) =>
        nom.includes(ingNom.toLowerCase().trim())
      )
    : [];

  // Suggestions d'unités :
  // Si l'ingrédient est connu et a des unités enregistrées, on les propose.
  // Sinon (nouvel ingrédient), on propose toutes les unités existantes de la base, filtrées par la saisie de l'utilisateur.
  const unitesSuggerees = (() => {
    const nomClean = ingNom.trim().toLowerCase();
    const unitesSpecifiques = cartesIngredientsUnites[nomClean];
    if (unitesSpecifiques && unitesSpecifiques.length > 0) {
      return unitesSpecifiques;
    }
    const saisieUnite = ingUnite.trim().toLowerCase();
    if (saisieUnite) {
      return toutesUnitesExistantes.filter(u => u.toLowerCase().includes(saisieUnite));
    }
    return toutesUnitesExistantes;
  })();

  return (
    <div className="h-full flex flex-col p-4 md:p-6 bg-slate-50 text-slate-800 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 border border-emerald-400 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="font-semibold text-sm">{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:text-emerald-100 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            <BookOpen className="text-indigo-650" />
            Mes Recettes
          </h2>
          <p className="text-slate-550 text-sm mt-1">
            Gérez vos plats pour le planning ({recettes.length} recettes)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              resetForm();
              setCategorie("accompagnement");
              setIsModalOpen(true);
            }}
            className="bg-purple-100 hover:bg-purple-200 border border-purple-200 text-purple-850 font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer shadow-sm text-xs"
          >
            <Plus className="w-5 h-5" /> Nouvel accompagnement
          </button>
          
          <button
            onClick={() => {
              resetForm();
              setCategorie("plat");
              setIsModalOpen(true);
            }}
            className="bg-orange-100 hover:bg-orange-200 border border-orange-200 text-orange-850 font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer shadow-sm text-xs"
          >
            <Plus className="w-5 h-5" /> Nouvelle recette
          </button>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une recette..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-10 py-3 placeholder-slate-400 text-slate-850 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-2xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors p-0.5 rounded cursor-pointer"
              title="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {["all", "entree", "plat", "dessert", "accompagnement"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`flex-grow py-2.5 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                categoryFilter === cat
                  ? "bg-indigo-100 border-indigo-200 text-indigo-750 font-black shadow-xs"
                  : "bg-white border-slate-200 text-slate-550 hover:bg-slate-50 hover:text-slate-850"
              }`}
            >
              {cat === "all" ? "Toutes" : cat === "accompagnement" ? "Accomp" : cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all cursor-pointer ${
            onlyFavorites
              ? "bg-rose-100 border-rose-200 text-rose-700 font-extrabold shadow-xs"
              : "bg-white border-slate-200 text-slate-550 hover:bg-slate-50 hover:text-slate-850"
          }`}
        >
          <Heart className={`w-4 h-4 ${onlyFavorites ? "fill-rose-500 text-rose-500" : ""}`} />
          Favoris uniquement
        </button>
      </div>

      {/* Grille des recettes */}
      <div className="h-[calc(100vh-220px)] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20 md:pb-6">
        {sortedRecettes.map((recette) => (
          <div
            key={recette.id}
            className="bg-white border border-slate-200/85 rounded-3xl flex flex-col justify-between hover:border-slate-350 transition-all hover:scale-[1.01] overflow-hidden h-[260px] shadow-sm relative group"
          >
            {/* Image de la recette en arrière-plan complet */}
            {recette.imageUrl ? (
              <div className="absolute inset-0 w-full h-full">
                <img 
                  src={recette.imageUrl} 
                  alt={recette.titre} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Voile sombre pour le contraste */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
              </div>
            ) : (
              <div className="absolute inset-0 w-full h-full bg-slate-50 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-slate-300" />
              </div>
            )}

            {/* Catégorie et favoris en haut (flottants sur l'image) */}
            <div className="relative z-10 p-3 flex items-start justify-between gap-2">
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider backdrop-blur-sm border ${
                recette.categorie === "entree" 
                  ? "text-emerald-700 border-emerald-350 bg-emerald-50/90"
                  : recette.categorie === "plat"
                  ? "text-indigo-700 border-indigo-350 bg-indigo-50/90"
                  : recette.categorie === "accompagnement"
                  ? "text-purple-700 border-purple-355 bg-purple-50/90"
                  : "text-amber-700 border-amber-355 bg-amber-50/90"
              }`}>
                {recette.categorie}
              </span>
              <button 
                onClick={() => handleToggleFavori(recette)}
                className="text-slate-500 hover:text-rose-600 bg-white/95 backdrop-blur-sm rounded-full p-1.5 transition-colors border border-slate-100 shadow-2xs cursor-pointer"
              >
                <Heart className={`w-3.5 h-3.5 ${recette.favori ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>
            </div>

            {/* Conteneur flouté en bas pour le texte et les boutons */}
            <div className="relative z-10 p-3 bg-white/95 backdrop-blur-xs border-t border-slate-100 flex flex-col gap-1.5 shadow-md">
              <div>
                <h3 className="text-sm font-bold text-slate-850 capitalize truncate leading-tight" title={recette.titre}>
                  {recette.titre}
                </h3>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5 flex items-center gap-1">
                  Portions : <span className="text-indigo-650 font-black">{recette.portionsDefaut}</span> pers.
                </p>
              </div>

              {/* Boutons d'actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleEdit(recette)}
                  className="flex-grow bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 text-indigo-750 py-1.5 rounded-xl text-3xs font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Éditer
                </button>
                <button
                  onClick={() => handleDelete(recette.id)}
                  className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 p-1.5 rounded-xl transition-all cursor-pointer"
                  title="Supprimer la recette"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {sortedRecettes.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
            <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-center font-bold text-slate-650 text-sm">Aucune recette trouvée.</p>
            <p className="text-center text-xs text-slate-450 mt-1">Créez votre première recette pour démarrer.</p>
          </div>
        )}
      </div>

      {/* Modal d'ajout/édition */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col p-6 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-xl font-bold text-slate-800">
                {categorie === 'accompagnement'
                  ? (editingId ? "Modifier l'accompagnement" : "Ajouter un accompagnement")
                  : (editingId ? "Modifier la recette" : "Ajouter une recette")}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-grow overflow-y-auto space-y-4 pr-1">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-850 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-850 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-850 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-850 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all cursor-pointer"
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-850 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
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
                          Quantité
                        </label>
                        <input
                          type="text"
                          placeholder="Qté (ex: 200)"
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
                          placeholder="Unité"
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
                        {showUnitSuggestions && unitesSuggerees.length > 0 && (
                          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto p-1.5">
                            {unitesSuggerees.map((u) => (
                              <button
                                key={u}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setIngUnite(u);
                                  setShowUnitSuggestions(false);
                                }}
                                className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-indigo-50 hover:text-indigo-650 text-slate-700 transition-all cursor-pointer font-semibold"
                              >
                                {u}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2 mb-3">
                      <div className="flex-grow relative">
                        <input
                          type="text"
                          placeholder="Nom (ex: tomate)"
                          value={ingNom}
                          onChange={(e) => {
                            setIngNom(e.target.value);
                            setShowSuggestions(true);
                          }}
                          onFocus={() => setShowSuggestions(true)}
                          onBlur={() => {
                            setTimeout(() => setShowSuggestions(false), 200);
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
                      <input
                        type="text"
                        placeholder="Qté (ex: 200)"
                        value={ingQuantite}
                        onChange={(e) => setIngQuantite(e.target.value)}
                        className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-850 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder-slate-400"
                      />
                      <div className="relative w-28 flex-shrink-0">
                        <input
                          type="text"
                          placeholder="Unité"
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
                        {showUnitSuggestions && unitesSuggerees.length > 0 && (
                          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto p-1.5">
                            {unitesSuggerees.map((u) => (
                              <button
                                key={u}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setIngUnite(u);
                                  setShowUnitSuggestions(false);
                                }}
                                className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-indigo-50 hover:text-indigo-650 text-slate-700 transition-all cursor-pointer font-semibold"
                              >
                                {u}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleAddIngredient}
                        className="bg-orange-100 hover:bg-orange-200 border border-orange-200 text-orange-850 p-2 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Liste des ingrédients ajoutés */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 max-h-40 overflow-y-auto space-y-1">
                      {ingredients.map((ing, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm py-1 border-b border-slate-100 last:border-b-0 text-slate-700">
                          <span className="capitalize text-slate-700 font-medium">{ing.nom}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-indigo-650 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-150 text-xs">
                              {ing.quantite > 0 ? `${ing.quantite} ${ing.unite}` : ing.unite}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveIngredient(idx)}
                              className="text-rose-500 hover:text-rose-700 p-0.5 rounded cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {ingredients.length === 0 && (
                        <div className="text-xs text-slate-400 text-center py-4">
                          Aucun ingrédient ajouté pour l'instant.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-grow bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-grow bg-orange-100 hover:bg-orange-200 border border-orange-200 text-orange-850 py-3 rounded-xl font-bold transition-all cursor-pointer shadow-sm"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
