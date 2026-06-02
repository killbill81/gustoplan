import React, { useState, useEffect } from "react";
import { subscribeRecettes, saveRecette, deleteRecette, toggleFavoriRecette } from "../services/db";
import { useAuth } from "../contexts/AuthContext";
import { Recette, Ingredient } from "../types";
import { Plus, Trash2, Heart, Search, BookOpen, UserMinus, PlusCircle, X, Edit3 } from "lucide-react";

export const RecettesView: React.FC = () => {
  const { foyer } = useAuth();
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Formulaire d'ajout/édition
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titre, setTitre] = useState("");
  const [portions, setPortions] = useState(4);
  const [categorie, setCategorie] = useState<'entree' | 'plat' | 'dessert'>('plat');
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

  // Réinitialiser automatiquement tous les champs de la fiche quand la modal se ferme
  useEffect(() => {
    if (!isModalOpen) {
      resetForm();
    }
  }, [isModalOpen]);

  const handleAddIngredient = () => {
    if (!ingNom.trim()) return;
    const qty = parseFloat(ingQuantite) || 0;
    const newIng: Ingredient = {
      nom: ingNom.trim().toLowerCase(),
      quantite: qty,
      unite: ingUnite
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

    const existingRecette = recettes.find(r => r.id === editingId);
    const wasFavori = existingRecette ? existingRecette.favori : false;

    const data: Omit<Recette, 'id'> & { id?: string, imageUrl?: string } = {
      titre: titre.trim(),
      portionsDefaut: portions,
      categorie,
      favori: wasFavori,
      ingredients
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
    setIngredients(recette.ingredients);
    setImageUrl(recette.imageUrl || "");
    setIngNom("");
    setIngQuantite("");
    setIngUnite("g");
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

  const cartesIngredientsUnites = recettes.reduce<{ [key: string]: string[] }>((acc, r) => {
    (r.ingredients || []).forEach((ing) => {
      const nom = ing.nom.trim().toLowerCase();
      const unite = ing.unite.trim();
      if (nom && unite) {
        if (!acc[nom]) {
          acc[nom] = [];
        }
        if (!acc[nom].includes(unite)) {
          acc[nom].push(unite);
        }
      }
    });
    return acc;
  }, {});

  const tousIngredientsExistants = Object.keys(cartesIngredientsUnites).sort();

  const suggestionsFiltrees = ingNom.trim()
    ? tousIngredientsExistants.filter((nom) =>
        nom.includes(ingNom.toLowerCase().trim())
      )
    : [];

  const unitesSuggerees = cartesIngredientsUnites[ingNom.trim().toLowerCase()] || [];

  return (
    <div className="h-full flex flex-col p-4 md:p-6 bg-slate-950 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="text-violet-500" />
            Mes Recettes
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Gérez vos plats pour le planning ({recettes.length} recettes)
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-violet-600/10 flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <Plus className="w-5 h-5" /> Nouvelle recette
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une recette..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 placeholder-slate-500 text-white focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div className="flex gap-2">
          {["all", "entree", "plat", "dessert"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`flex-1 py-3 px-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all ${
                categoryFilter === cat
                  ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-600/10"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat === "all" ? "Toutes" : cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setOnlyFavorites(!onlyFavorites)}
          className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
            onlyFavorites
              ? "bg-fuchsia-600/10 border-fuchsia-500/30 text-fuchsia-400"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <Heart className={`w-4 h-4 ${onlyFavorites ? "fill-fuchsia-500 text-fuchsia-500" : ""}`} />
          Favoris uniquement
        </button>
      </div>

      {/* Grille des recettes avec hauteur calculée pour éviter l'écrasement CSS Grid */}
      <div className="h-[calc(100vh-220px)] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20 md:pb-6">
        {sortedRecettes.map((recette) => (
          <div
            key={recette.id}
            className="bg-slate-900/60 border border-slate-800/80 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all hover:scale-[1.01] overflow-hidden h-[260px] shadow-lg relative group"
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
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              </div>
            ) : (
              <div className="absolute inset-0 w-full h-full bg-slate-950/40 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-slate-800" />
              </div>
            )}

            {/* Catégorie et favoris en haut (flottants sur l'image) */}
            <div className="relative z-10 p-3 flex items-start justify-between gap-2">
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-slate-950/80 backdrop-blur-sm ${
                recette.categorie === "entree" 
                  ? "text-emerald-400 border border-emerald-500/20"
                  : recette.categorie === "plat"
                  ? "text-violet-400 border border-violet-500/20"
                  : "text-amber-400 border border-amber-500/20"
              }`}>
                {recette.categorie}
              </span>
              <button 
                onClick={() => handleToggleFavori(recette)}
                className="text-white/70 hover:text-fuchsia-500 bg-slate-950/80 backdrop-blur-sm rounded-full p-1 transition-colors"
              >
                <Heart className={`w-3.5 h-3.5 ${recette.favori ? "fill-fuchsia-500 text-fuchsia-500" : ""}`} />
              </button>
            </div>

            {/* Conteneur flouté en bas pour le texte et les boutons (effet verre dépoli) */}
            <div className="relative z-10 p-3 bg-slate-800/25 backdrop-blur-md border-t border-white/5 flex flex-col gap-2">
              <div>
                <h3 className="text-sm font-bold text-white capitalize truncate leading-tight" title={recette.titre}>
                  {recette.titre}
                </h3>
                <p className="text-[11px] font-semibold text-slate-350 mt-1 flex items-center gap-1">
                  Portions : <span className="text-violet-400 font-extrabold">{recette.portionsDefaut}</span> pers.
                </p>
              </div>

              {/* Boutons d'actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleEdit(recette)}
                  className="flex-grow bg-white/10 hover:bg-white/15 border border-white/10 text-white py-1.5 rounded-xl text-3xs font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Éditer
                </button>
                <button
                  onClick={() => handleDelete(recette.id)}
                  className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 p-1.5 rounded-xl transition-all"
                  title="Supprimer la recette"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {sortedRecettes.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500">
            <BookOpen className="w-12 h-12 text-slate-600 mb-3" />
            <p className="text-center font-medium">Aucune recette trouvée.</p>
            <p className="text-center text-xs text-slate-600 mt-1">Créez votre première recette pour démarrer.</p>
          </div>
        )}
      </div>

      {/* Modal d'ajout/édition */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-xl font-bold text-white">
                {editingId ? "Modifier la recette" : "Ajouter une recette"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-white p-1 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-grow overflow-y-auto space-y-4 pr-1">
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Titre de la recette
                </label>
                <input
                  type="text"
                  required
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  placeholder="Ex: Pâtes Carbonara, Salade César..."
                  className="w-full bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  URL de l'image (optionnel)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://exemple.com/image.jpg"
                  className="w-full bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Catégorie
                  </label>
                  <select
                    value={categorie}
                    onChange={(e: any) => setCategorie(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="entree">Entrée</option>
                    <option value="plat">Plat</option>
                    <option value="dessert">Dessert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Portions par défaut
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={portions}
                    onChange={(e) => setPortions(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Bloc ingrédients */}
              <div className="border-t border-slate-800 pt-4">
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Ingrédients
                </label>
                
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
                        // Petit délai pour laisser l'événement onClick de la suggestion se déclencher
                        setTimeout(() => setShowSuggestions(false), 200);
                      }}
                      className="w-full bg-slate-800 border border-slate-700/50 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50"
                    />
                    
                    {showSuggestions && suggestionsFiltrees.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-800 border border-slate-700/80 rounded-xl shadow-2xl z-50 max-h-40 overflow-y-auto p-1.5 backdrop-blur-md">
                        {suggestionsFiltrees.map((nom) => (
                          <button
                            key={nom}
                            type="button"
                            onClick={() => {
                              setIngNom(nom);
                              setShowSuggestions(false);
                              // Pré-remplir l'unité avec la première unité déjà utilisée
                              const units = cartesIngredientsUnites[nom] || [];
                              if (units.length > 0) {
                                setIngUnite(units[0]);
                              }
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-violet-600/20 hover:text-violet-400 text-slate-300 transition-all cursor-pointer capitalize font-semibold flex justify-between items-center"
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
                    className="w-20 bg-slate-800 border border-slate-700/50 rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
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
                        // Petit délai pour laisser l'événement onClick de la suggestion se déclencher
                        setTimeout(() => setShowUnitSuggestions(false), 200);
                      }}
                      className="w-full bg-slate-800 border border-slate-700/50 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50"
                    />
                    {showUnitSuggestions && unitesSuggerees.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-800 border border-slate-700/80 rounded-xl shadow-2xl z-50 max-h-40 overflow-y-auto p-1.5 backdrop-blur-md">
                        {unitesSuggerees.map((u) => (
                          <button
                            key={u}
                            type="button"
                            onClick={() => {
                              setIngUnite(u);
                              setShowUnitSuggestions(false);
                            }}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-violet-600/20 hover:text-violet-400 text-slate-300 transition-all cursor-pointer font-semibold"
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
                    className="bg-violet-600 hover:bg-violet-500 text-white p-2 rounded-xl flex items-center justify-center flex-shrink-0"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Liste des ingrédients ajoutés */}
                <div className="bg-slate-800/40 rounded-xl p-3 max-h-40 overflow-y-auto space-y-1">
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm py-1 border-b border-slate-800/50 last:border-b-0">
                      <span className="capitalize text-slate-300">{ing.nom}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">{ing.quantite > 0 ? `${ing.quantite} ${ing.unite}` : ing.unite}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(idx)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {ingredients.length === 0 && (
                    <div className="text-xs text-slate-500 text-center py-4">
                      Aucun ingrédient ajouté pour l'instant.
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-violet-600/10 transition-colors"
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
