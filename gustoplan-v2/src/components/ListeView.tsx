import React, { useState, useEffect } from "react";
import { subscribeListeCourses, saveListeCourses, subscribeRecettes } from "../services/db";
import { useAuth } from "../contexts/AuthContext";
import { ElementListeCourses, Recette } from "../types";
import { ShoppingCart, Plus, Trash2, CheckCircle2, RotateCcw, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

interface ListeViewProps {
  onCollapse?: () => void;
  context?: "planning" | "liste";
}

export const ListeView: React.FC<ListeViewProps> = ({ onCollapse, context = "liste" }) => {
  const { foyer } = useAuth();
  const [elements, setElements] = useState<ElementListeCourses[]>([]);
  const [recettes, setRecettes] = useState<Recette[]>([]);

  // Formulaire ajout manuel
  const [nom, setNom] = useState("");
  const [quantite, setQuantite] = useState("");
  const [unite, setUnite] = useState("");
  const [rayon, setRayon] = useState("Autre / Divers");

  // Suggestions autocomplétion
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUnitSuggestions, setShowUnitSuggestions] = useState(false);

  useEffect(() => {
    if (!foyer?.id) return;
    const unsubscribe = subscribeListeCourses(foyer.id, (loadedElements) => {
      setElements(loadedElements);
    });
    const unsubRecettes = subscribeRecettes(foyer.id, setRecettes);
    return () => {
      unsubscribe();
      unsubRecettes();
    };
  }, [foyer?.id]);

  const getStep = (unite: string, quantite: number) => {
    const u = (unite || "").toLowerCase().trim();
    if (u === "g" || u === "ml" || u === "grammes" || u === "cl") {
      if (u === "cl") return 5;
      return 50;
    }
    if (quantite < 1 && quantite > 0) return 0.1;
    return 1;
  };

  const handleToggleAchete = async (id: string) => {
    if (!foyer?.id) return;
    const updated = elements.map((item) => {
      if (item.id === id) {
        // On bascule l'état achete (déjà acquis est aussi lié pour être compatible)
        return { ...item, achete: !item.achete, dejaAcquis: !item.achete };
      }
      return item;
    });
    await saveListeCourses(foyer.id, updated);
  };

  const handleUpdateQuantite = async (id: string, delta: number) => {
    if (!foyer?.id) return;
    const updated = elements.map((item) => {
      if (item.id === id) {
        const step = getStep(item.unite, item.quantite);
        const currentQty = item.quantite || 0;
        const newQty = Math.max(0, currentQty + delta * step);
        return { ...item, quantite: Math.round(newQty * 100) / 100 };
      }
      return item;
    });
    await saveListeCourses(foyer.id, updated);
  };

  const handleAddManuel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foyer?.id || !nom.trim()) return;

    const qty = parseFloat(quantite) || 0;
    const newElement: ElementListeCourses = {
      id: "manuel_" + Date.now(),
      nom: nom.trim(),
      quantite: qty,
      unite: unite.trim(),
      rayon: rayon,
      dejaAcquis: false,
      achete: false,
      manuel: true
    };

    const updated = [...elements, newElement];
    await saveListeCourses(foyer.id, updated);

    // Reset
    setNom("");
    setQuantite("");
    setUnite("");
    setRayon("Autre / Divers");
  };

  // Traiter les suggestions
  const cartesIngredientsUnites = recettes.reduce<{ [key: string]: string[] }>((acc, r) => {
    (r.ingredients || []).forEach((ing) => {
      const n = ing.nom.trim().toLowerCase();
      const u = ing.unite.trim();
      if (n && u) {
        if (!acc[n]) {
          acc[n] = [];
        }
        if (!acc[n].includes(u)) {
          acc[n].push(u);
        }
      }
    });
    return acc;
  }, {});

  const tousIngredientsExistants = Object.keys(cartesIngredientsUnites).sort();

  const suggestionsFiltrees = nom.trim()
    ? tousIngredientsExistants.filter((n) =>
        n.includes(nom.toLowerCase().trim())
      )
    : [];

  const unitesSuggerees = cartesIngredientsUnites[nom.trim().toLowerCase()] || [];

  const handleDeleteElement = async (id: string) => {
    if (!foyer?.id) return;
    const updated = elements.filter((item) => item.id !== id);
    await saveListeCourses(foyer.id, updated);
  };

  const handleResetFiltres = async () => {
    if (!foyer?.id || !window.confirm("Voulez-vous décocher et réinitialiser la liste ?")) return;
    const updated = elements.map((item) => ({
      ...item,
      dejaAcquis: false,
      achete: false
    }));
    await saveListeCourses(foyer.id, updated);
  };

  // Ségrégation façon Google Keep
  const elementsNonCoches = elements.filter((item) => !item.achete && !item.dejaAcquis);
  const elementsCoches = elements.filter((item) => item.achete || item.dejaAcquis);

  const rayonsGroupes: { [key: string]: ElementListeCourses[] } = {};
  elementsNonCoches.forEach((item) => {
    if (!rayonsGroupes[item.rayon]) {
      rayonsGroupes[item.rayon] = [];
    }
    rayonsGroupes[item.rayon].push(item);
  });

  const articlesRestantsCount = elementsNonCoches.length;

  return (
    <div className="h-full flex flex-col p-4 md:p-6 bg-transparent text-white">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between">
          {/* Collapse button on the top left */}
          {onCollapse ? (
            <button
              onClick={onCollapse}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-violet-500/50 rounded-lg text-slate-400 hover:text-violet-400 transition-all cursor-pointer"
              title="Réduire la liste de courses"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}

          <div />
        </div>

        {/* Title and Subtitle */}
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2 text-white">
            <ShoppingCart className="text-violet-500 shrink-0 w-5 h-5" />
            <span>Ma Liste de Courses</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Gerez vos achats ({articlesRestantsCount} articles restants)
          </p>
        </div>
      </div>

      {/* Formulaire d'ajout manuel d'ingrédients (Planning uniquement, style identique fiche recette) */}
      {context === "planning" && (
        <form onSubmit={handleAddManuel} className="flex flex-col gap-2 mb-6 shrink-0">
          <div className="w-full relative">
            <input
              type="text"
              required
              placeholder="Nom (ex: tomate)"
              value={nom}
              onChange={(e) => {
                setNom(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              className="w-full bg-slate-800 border border-slate-700/50 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50"
            />
            
            {showSuggestions && suggestionsFiltrees.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-800 border border-slate-700/80 rounded-xl shadow-2xl z-50 max-h-40 overflow-y-auto p-1.5 backdrop-blur-md">
                {suggestionsFiltrees.map((nomSuggestion) => (
                  <button
                    key={nomSuggestion}
                    type="button"
                    onClick={() => {
                      setNom(nomSuggestion);
                      setShowSuggestions(false);
                      const units = cartesIngredientsUnites[nomSuggestion] || [];
                      if (units.length > 0) {
                        setUnite(units[0]);
                      }
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-violet-600/20 hover:text-violet-400 text-slate-300 transition-all cursor-pointer capitalize font-semibold flex justify-between items-center"
                  >
                    <span>{nomSuggestion}</span>
                    {cartesIngredientsUnites[nomSuggestion] && cartesIngredientsUnites[nomSuggestion].length > 0 && (
                      <span className="text-[10px] text-slate-400 font-normal normal-case ml-2">
                        ({cartesIngredientsUnites[nomSuggestion].join(", ")})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full">
            <input
              type="text"
              placeholder="Qté"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              className="flex-1 min-w-0 bg-slate-800 border border-slate-700/50 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50"
            />

            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                placeholder="Unité"
                value={unite}
                onChange={(e) => {
                  setUnite(e.target.value);
                  setShowUnitSuggestions(true);
                }}
                onFocus={() => setShowUnitSuggestions(true)}
                onBlur={() => {
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
                        setUnite(u);
                        setShowUnitSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-violet-600/20 hover:text-violet-400 text-slate-355 transition-all cursor-pointer font-semibold"
                    >
                      {u}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl flex items-center justify-center flex-shrink-0 w-[38px] h-[38px] transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </form>
      )}



      {/* Liste des ingrédients par rayons */}
      <div className="flex-grow overflow-y-auto space-y-6 pb-20 md:pb-6">
        {/* Articles Non Cochés */}
        {Object.keys(rayonsGroupes).map((rayonName) => (
          <div key={rayonName} className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-400 border-b border-slate-800 pb-2 mb-4 tracking-wider uppercase">
              {rayonName}
            </h3>
            <div className="space-y-3">
              {rayonsGroupes[rayonName].map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/60 border border-slate-800/50 hover:border-slate-700 flex items-center justify-between p-3 rounded-xl border transition-all"
                >
                  <div className="flex items-center gap-3">
                    {context === "liste" && (
                      <input
                        type="checkbox"
                        checked={false}
                        onChange={() => handleToggleAchete(item.id)}
                        className="w-5 h-5 rounded-lg border-slate-700 bg-slate-800 text-violet-500 focus:ring-0 focus:ring-offset-0 cursor-pointer flex-shrink-0"
                      />
                    )}
                    <div className="flex flex-col items-start leading-tight">
                      {item.manuel && (
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 mb-0.5">
                          Manuel
                        </span>
                      )}
                      <span className="text-sm font-medium capitalize text-white">
                        {item.nom}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Contrôle de la quantité */}
                    {context === "planning" ? (
                      <div className="flex items-center gap-1 bg-slate-950/40 border border-slate-800 px-2 py-1 rounded-lg text-slate-500">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantite(item.id, -1)}
                          className="p-0.5 hover:bg-slate-800 hover:text-violet-400 rounded transition-colors text-slate-555"
                          title="Diminuer la quantité"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        
                        <span className="text-xs font-bold text-violet-400 min-w-[70px] text-center truncate">
                          {item.quantite > 0 ? `${item.quantite} ${item.unite}` : item.unite || "0"}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleUpdateQuantite(item.id, 1)}
                          className="p-0.5 hover:bg-slate-800 hover:text-violet-400 rounded transition-colors text-slate-555"
                          title="Augmenter la quantité"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-violet-400 mr-2">
                        {item.quantite > 0 ? `${item.quantite} ${item.unite}` : item.unite || "0"}
                      </span>
                    )}

                    {item.manuel && (
                      <button
                        type="button"
                        onClick={() => handleDeleteElement(item.id)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer shrink-0"
                        title="Supprimer cet ingrédient manuel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 🟩 Section "Ingrédients cochés" façon Google Keep */}
        {elementsCoches.length > 0 && (
          <div className="bg-slate-900/10 border border-slate-900/30 rounded-2xl p-5 opacity-60">
            <h3 className="text-sm font-bold text-slate-500 border-b border-slate-850 pb-2 mb-4 tracking-wider uppercase">
              Ingrédients cochés ({elementsCoches.length})
            </h3>
            <div className="space-y-3">
              {elementsCoches.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-955/20 border border-slate-900/40 flex items-center justify-between p-3 rounded-xl border transition-all"
                >
                  <div className="flex items-center gap-3">
                    {context === "liste" && (
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => handleToggleAchete(item.id)}
                        className="w-5 h-5 rounded-lg border-slate-700 bg-slate-800 text-violet-500 focus:ring-0 focus:ring-offset-0 cursor-pointer flex-shrink-0"
                      />
                    )}
                    <div className="flex flex-col items-start leading-tight">
                      {item.manuel && (
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 mb-0.5 opacity-70">
                          Manuel
                        </span>
                      )}
                      <span className="text-sm font-medium capitalize text-slate-500 line-through">
                        {item.nom}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Contrôle de la quantité */}
                    {context === "planning" ? (
                      <div className="flex items-center gap-1 bg-slate-950/20 border border-slate-900 px-2 py-1 rounded-lg text-slate-600">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantite(item.id, -1)}
                          className="p-0.5 hover:bg-slate-950 hover:text-violet-400 rounded transition-colors text-slate-650"
                          title="Diminuer la quantité"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        
                        <span className="text-xs font-bold text-slate-550 min-w-[70px] text-center truncate">
                          {item.quantite > 0 ? `${item.quantite} ${item.unite}` : item.unite || "0"}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleUpdateQuantite(item.id, 1)}
                          className="p-0.5 hover:bg-slate-955 hover:text-violet-400 rounded transition-colors text-slate-655"
                          title="Augmenter la quantité"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-slate-500 line-through mr-2">
                        {item.quantite > 0 ? `${item.quantite} ${item.unite}` : item.unite || "0"}
                      </span>
                    )}

                    {item.manuel && (
                      <button
                        type="button"
                        onClick={() => handleDeleteElement(item.id)}
                        className="text-slate-600 hover:text-red-400 p-1 rounded transition-colors cursor-pointer shrink-0"
                        title="Supprimer cet ingrédient manuel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {elements.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-slate-600 mb-3" />
            <p className="text-center font-medium">Votre liste est vide !</p>
            <p className="text-center text-xs text-slate-600 mt-1">Ajoutez des recettes à votre planning pour générer vos courses.</p>
          </div>
        )}
      </div>
    </div>
  );
};
