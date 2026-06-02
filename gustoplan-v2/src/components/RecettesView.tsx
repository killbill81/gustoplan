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

  // Récupération en temps réel
  useEffect(() => {
    if (!foyer?.id) return;
    const unsubscribe = subscribeRecettes(foyer.id, (loadedRecettes) => {
      setRecettes(loadedRecettes);
    });
    return unsubscribe;
  }, [foyer?.id]);

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

    const data: Omit<Recette, 'id'> & { id?: string } = {
      titre: titre.trim(),
      portionsDefaut: portions,
      categorie,
      favori: wasFavori,
      ingredients,
      imageUrl: imageUrl.trim() || undefined
    };

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
      <div className="h-[calc(100vh-220px)] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20 md:pb-6">
        {sortedRecettes.map((recette) => (
          <div
            key={recette.id}
            className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all hover:scale-101 overflow-hidden h-[360px]"
          >
            <div className="flex flex-col h-full overflow-hidden">
              {recette.imageUrl && (
                <img 
                  src={recette.imageUrl} 
                  alt={recette.titre} 
                  className="w-full h-32 object-cover rounded-t-2xl mb-4 -mt-5 -mx-5 w-[calc(100%+2.5rem)] max-w-none"
                />
              )}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className={`px-2.5 py-1 rounded-lg text-2xs font-extrabold uppercase tracking-wider ${
                  recette.categorie === "entree" 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : recette.categorie === "plat"
                    ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}>
                  {recette.categorie}
                </span>
                <button 
                  onClick={() => handleToggleFavori(recette)}
                  className="text-slate-500 hover:text-fuchsia-500 transition-colors p-1"
                >
                  <Heart className={`w-5 h-5 ${recette.favori ? "fill-fuchsia-500 text-fuchsia-500" : ""}`} />
                </button>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 leading-relaxed py-1">{recette.titre}</h3>
              <p className="text-xs text-slate-500 mb-4">Portions : {recette.portionsDefaut} pers.</p>



              
              <div className="text-slate-400 text-xs space-y-1">
                <div className="font-semibold text-slate-500 mb-1">Ingrédients :</div>
                {recette.ingredients.slice(0, 4).map((ing, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="capitalize">{ing.nom}</span>
                    <span>{ing.quantite > 0 ? `${ing.quantite} ${ing.unite}` : ing.unite}</span>
                  </div>
                ))}
                {recette.ingredients.length > 4 && (
                  <div className="text-slate-500 text-2xs italic pt-1">
                    + {recette.ingredients.length - 4} autres ingrédients...
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 border-t border-slate-800/80 pt-4 mt-5">
              <button
                onClick={() => handleEdit(recette)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" /> Éditer
              </button>
              <button
                onClick={() => handleDelete(recette.id)}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 p-2 rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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
                  <input
                    type="text"
                    placeholder="Nom (ex: tomate)"
                    value={ingNom}
                    onChange={(e) => setIngNom(e.target.value)}
                    className="flex-grow bg-slate-800 border border-slate-700/50 rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Qté (ex: 200)"
                    value={ingQuantite}
                    onChange={(e) => setIngQuantite(e.target.value)}
                    className="w-20 bg-slate-800 border border-slate-700/50 rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Unité (ex: g)"
                    value={ingUnite}
                    onChange={(e) => setIngUnite(e.target.value)}
                    className="w-16 bg-slate-800 border border-slate-700/50 rounded-xl px-3 py-2 text-white text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="bg-violet-600 hover:bg-violet-500 text-white p-2 rounded-xl flex items-center justify-center"
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
