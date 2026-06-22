import React, { useState, useEffect } from "react";
import { subscribeListeCourses, saveListeCourses, subscribeRecettes, subscribeRayonsIngredients, subscribeIngredientsGlobal, IngredientGlobal, saveIngredientGlobal } from "../services/db";
import { useAuth } from "../contexts/AuthContext";
import { ElementListeCourses, Recette } from "../types";
import { ShoppingCart, Plus, Trash2, CheckCircle2, RotateCcw, ChevronRight, ChevronDown, ChevronUp, Info, Copy } from "lucide-react";
import { devinerRayon } from "../services/courseEngine";

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

interface ListeViewProps {
  onCollapse?: () => void;
  context?: "planning" | "liste";
}

export const ListeView: React.FC<ListeViewProps> = ({ onCollapse, context = "liste" }) => {
  const { user, foyer } = useAuth();
  const [elements, setElements] = useState<ElementListeCourses[]>([]);
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [globalIngredients, setGlobalIngredients] = useState<IngredientGlobal[]>([]);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Formulaire ajout manuel
  const [nom, setNom] = useState("");
  const [quantite, setQuantite] = useState("");
  const [unite, setUnite] = useState("");
  const [rayon, setRayon] = useState("Autre / Divers");
  const [customRayons, setCustomRayons] = useState<{ [key: string]: string }>({});

  // Suggestions autocomplétion
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUnitSuggestions, setShowUnitSuggestions] = useState(false);

  useEffect(() => {
    if (!foyer?.id || !user?.uid) return;
    const unsubscribe = subscribeListeCourses(foyer.id, (loadedElements) => {
      setElements(loadedElements);
    });
    const unsubRecettes = subscribeRecettes(foyer.id, setRecettes);
    const unsubRayons = subscribeRayonsIngredients(foyer.id, setCustomRayons);
    const unsubIngredients = subscribeIngredientsGlobal(user.uid, setGlobalIngredients);
    return () => {
      unsubscribe();
      unsubRecettes();
      unsubRayons();
      unsubIngredients();
    };
  }, [foyer?.id, user?.uid]);

  const resolveCategoryForIngredient = (name: string): string => {
    const cleanName = name.trim().toLowerCase();
    
    // 1. Vérifier customRayons du foyer
    if (customRayons && customRayons[cleanName]) {
      return customRayons[cleanName];
    }
    
    // 2. Vérifier la base globale des ingrédients
    const globalIng = globalIngredients.find(
      (ing) => ing.name.toLowerCase() === cleanName
    );
    if (globalIng && globalIng.category) {
      return globalIng.category;
    }
    
    // 3. Deviner avec le dico statique
    return devinerRayon(name, customRayons);
  };

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
    if (!foyer?.id || !nom.trim() || !user?.uid) return;

    const u = unite.trim();
    if (u && !validerNouvelleUnite(u, toutesUnitesExistantes)) {
      return;
    }

    const cleanNom = nom.trim();
    const cleanNomLower = cleanNom.toLowerCase();
    const qty = parseFloat(quantite) || 0;
    const resolvedRayon = resolveCategoryForIngredient(cleanNom);
    const finalRayon = resolvedRayon !== "Autre / Divers" ? resolvedRayon : rayon;

    // Ajouter l'élément à la liste de courses
    const newElement: ElementListeCourses = {
      id: "manuel_" + Date.now(),
      nom: cleanNom,
      quantite: qty,
      unite: u,
      rayon: finalRayon,
      dejaAcquis: false,
      achete: false,
      manuel: true
    };

    const updated = [...elements, newElement];
    await saveListeCourses(foyer.id, updated);

    // Si l'ingrédient n'existe pas dans la base globale (indépendamment de la casse), le sauvegarder
    const existeDeja = globalIngredients.some(
      (ing) => ing.name.toLowerCase() === cleanNomLower
    );
    if (!existeDeja) {
      await saveIngredientGlobal({
        name: cleanNom,
        unit: u,
        category: finalRayon,
        userId: user.uid
      });
    }

    // Reset
    setNom("");
    setQuantite("");
    setUnite("");
    setRayon("Autre / Divers");
  };

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

  // Traiter les suggestions en fusionnant la base globale d'ingrédients et les ingrédients des recettes
  const cartesIngredientsUnites = (() => {
    const acc: { [key: string]: string[] } = {};

    // 1. Ajouter les ingrédients de la base globale (sans doublon de casse)
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

    // 2. Compléter/enrichir avec les ingrédients des recettes existantes
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

  const suggestionsFiltrees = nom.trim()
    ? tousIngredientsExistants.filter((n) =>
        n.includes(nom.toLowerCase().trim())
      )
    : [];

  const unitesSuggerees = (() => {
    const nomClean = nom.trim().toLowerCase();
    const unitesSpecifiques = cartesIngredientsUnites[nomClean];
    if (unitesSpecifiques && unitesSpecifiques.length > 0) {
      return unitesSpecifiques;
    }
    const saisieUnite = unite.trim().toLowerCase();
    if (saisieUnite) {
      return toutesUnitesExistantes.filter(u => u.toLowerCase().includes(saisieUnite));
    }
    return toutesUnitesExistantes;
  })();

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
    const resolvedRayon = resolveCategoryForIngredient(item.nom);
    const itemRayon = resolvedRayon !== "Autre / Divers" ? resolvedRayon : (item.rayon || "Autre / Divers");
    if (!rayonsGroupes[itemRayon]) {
      rayonsGroupes[itemRayon] = [];
    }
    rayonsGroupes[itemRayon].push(item);
  });

  const getRayonColors = (rayonName: string) => {
    const r = (rayonName || "").toLowerCase().trim();
    if (r.includes("fruit") || r.includes("légume")) {
      return {
        bgCard: "bg-emerald-50/70 border-emerald-100/80 shadow-xs",
        textHeader: "text-emerald-800 border-emerald-200/50"
      };
    }
    if (r.includes("frais") || r.includes("crèmerie") || r.includes("lait") || r.includes("froid")) {
      return {
        bgCard: "bg-sky-50/70 border-sky-100/80 shadow-xs",
        textHeader: "text-sky-800 border-sky-200/50"
      };
    }
    if (r.includes("viande") || r.includes("poisson") || r.includes("boucherie") || r.includes("charcuterie")) {
      return {
        bgCard: "bg-rose-50/70 border-rose-100/80 shadow-xs",
        textHeader: "text-rose-800 border-rose-200/50"
      };
    }
    if (r.includes("boulangerie") || r.includes("pain") || r.includes("pâtisserie")) {
      return {
        bgCard: "bg-amber-50/70 border-amber-100/80 shadow-xs",
        textHeader: "text-amber-800 border-amber-200/50"
      };
    }
    if (r.includes("épicerie") || r.includes("sec") || r.includes("boîte") || r.includes("conserve")) {
      return {
        bgCard: "bg-stone-50/80 border-stone-150 shadow-xs",
        textHeader: "text-stone-850 border-stone-200"
      };
    }
    // Autre / Divers / Boissons
    return {
      bgCard: "bg-purple-50/60 border-purple-100/80 shadow-xs",
      textHeader: "text-purple-800 border-purple-200/50"
    };
  };

  const handleExportText = () => {
    const nonCoches = elements.filter((el) => !el.achete);
    const coches = elements.filter((el) => el.achete);

    let text = "📋 GUSTOPLAN - MA LISTE DE COURSES\n\n";

    // Regrouper par rayon
    const rayonsGroupesExport: { [key: string]: ElementListeCourses[] } = {};
    nonCoches.forEach((item) => {
      const itemRayon = resolveCategoryForIngredient(item.nom) !== "Autre / Divers" 
        ? resolveCategoryForIngredient(item.nom) 
        : (item.rayon || "Autre / Divers");
      if (!rayonsGroupesExport[itemRayon]) {
        rayonsGroupesExport[itemRayon] = [];
      }
      rayonsGroupesExport[itemRayon].push(item);
    });

    Object.keys(rayonsGroupesExport).forEach((rayonName) => {
      text += `🛒 ${rayonName.toUpperCase()}\n`;
      rayonsGroupesExport[rayonName].forEach((item) => {
        const qtyText = item.quantite > 0 ? ` : ${item.quantite} ${item.unite}` : "";
        let sourcesText = "";
        if (item.sources && item.sources.length > 0) {
          const srcDetails = item.sources.map(src => `${src.jour} ${src.repas} - ${src.recetteTitre}`).join(" | ");
          sourcesText = ` (${srcDetails})`;
        }
        text += `- ${item.nom}${qtyText}${sourcesText}\n`;
      });
      text += "\n";
    });

    if (coches.length > 0) {
      text += "✅ INGRÉDIENTS COCHÉS\n";
      coches.forEach((item) => {
        const qtyText = item.quantite > 0 ? ` : ${item.quantite} ${item.unite}` : "";
        text += `- ${item.nom}${qtyText}\n`;
      });
      text += "\n";
    }

    navigator.clipboard.writeText(text.trim()).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const articlesRestantsCount = elementsNonCoches.length;

  return (
    <div className="h-full flex flex-col p-4 md:p-6 bg-transparent text-slate-800">
      <div className="flex flex-col mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onCollapse && (
              <button
                onClick={onCollapse}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-indigo-300 rounded-lg text-slate-550 hover:text-indigo-650 transition-all cursor-pointer"
                title="Réduire la liste de courses"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <h2 className="text-xl font-extrabold flex items-center gap-2 text-slate-800">
              <ShoppingCart className="text-orange-500 shrink-0 w-5 h-5" />
              <span>Ma Liste de Courses</span>
            </h2>
          </div>
          {context === "liste" && elements.length > 0 && (
            <button
              onClick={handleExportText}
              className="text-xs font-bold py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-750 border border-indigo-200/40 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Copy className="w-3.5 h-3.5" />
              {isCopied ? "Copié !" : "Copier en texte"}
            </button>
          )}
        </div>
        <p className={`text-slate-500 text-xs mt-1 ${onCollapse ? "pl-[38px]" : ""}`}>
          Gérez vos achats ({articlesRestantsCount} {articlesRestantsCount > 1 ? "articles" : "article"})
        </p>
      </div>

      {/* Formulaire d'ajout manuel d'ingrédients (Planning uniquement) */}
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
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-850 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder-slate-400"
            />
            
            {showSuggestions && suggestionsFiltrees.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto p-1.5">
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
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-indigo-50 hover:text-indigo-650 text-slate-700 transition-all cursor-pointer capitalize font-semibold flex justify-between items-center"
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
              className="flex-grow min-w-0 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-850 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder-slate-400"
            />

            <div className="relative flex-grow min-w-0">
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-850 text-sm focus:outline-none focus:border-indigo-400 focus:bg-white transition-all placeholder-slate-400"
              />
              {showUnitSuggestions && unitesSuggerees.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto p-1.5">
                  {unitesSuggerees.map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => {
                        setUnite(u);
                        setShowUnitSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-indigo-50 hover:text-indigo-655 text-slate-700 transition-all cursor-pointer font-semibold"
                    >
                      {u}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-orange-100 hover:bg-orange-200 border border-orange-200 text-orange-850 rounded-xl flex items-center justify-center flex-shrink-0 w-[38px] h-[38px] transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </form>
      )}

      {/* Liste des ingrédients par rayons */}
      <div className="flex-grow overflow-y-auto space-y-5 pb-20 md:pb-6">
        {/* Articles Non Cochés */}
        {Object.keys(rayonsGroupes).map((rayonName) => {
          const colors = getRayonColors(rayonName);
          return (
            <div key={rayonName} className={`border rounded-2xl p-4 transition-all ${colors.bgCard}`}>
              <h3 className={`text-xs font-black border-b pb-2 mb-3 tracking-wider uppercase ${colors.textHeader}`}>
                {rayonName}
              </h3>
              <div className="space-y-2">
                {rayonsGroupes[rayonName].map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-100 hover:border-slate-200 flex flex-col p-2.5 rounded-xl transition-all shadow-2xs"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2.5">
                        {context === "liste" && (
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={() => handleToggleAchete(item.id)}
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer flex-shrink-0 bg-slate-50"
                          />
                        )}
                        <div className="flex flex-col items-start leading-tight">
                          {item.manuel && (
                            <span className="text-[8px] uppercase tracking-wider font-extrabold text-orange-500 mb-0.5">
                              Manuel
                            </span>
                          )}
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium capitalize text-slate-800">
                              {item.nom}
                            </span>
                            {context === "planning" && item.sources && item.sources.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setExpandedItemId(expandedItemId === item.id ? null : item.id)}
                                className="text-slate-400 hover:text-indigo-600 transition-colors p-0.5 rounded-full hover:bg-slate-105 cursor-pointer"
                                title="Voir la provenance"
                              >
                                <Info className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {/* Contrôle de la quantité */}
                        {context === "planning" ? (
                          <div className="flex items-center gap-1 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-lg text-slate-500">
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantite(item.id, -1)}
                              className="p-0.5 hover:bg-slate-200 hover:text-indigo-650 rounded transition-colors text-slate-400"
                              title="Diminuer la quantité"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                            
                            <span className="text-xs font-bold text-indigo-650 min-w-[65px] text-center truncate">
                              {item.quantite > 0 ? `${item.quantite} ${item.unite}` : item.unite || "0"}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleUpdateQuantite(item.id, 1)}
                              className="p-0.5 hover:bg-slate-200 hover:text-indigo-650 rounded transition-colors text-slate-400"
                              title="Augmenter la quantité"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-indigo-650 mr-1.5">
                            {item.quantite > 0 ? `${item.quantite} ${item.unite}` : item.unite || "0"}
                          </span>
                        )}

                        {item.manuel && (
                          <button
                            type="button"
                            onClick={() => handleDeleteElement(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer shrink-0"
                            title="Supprimer cet ingrédient manuel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Source details for page "Liste des courses" (context === "liste") */}
                    {context === "liste" && item.sources && item.sources.length > 0 && (
                      <div className="mt-1.5 pl-6.5 text-[10px] text-slate-500 flex flex-col gap-0.5 border-t border-slate-50 pt-1.5 w-full">
                        {item.sources.map((src, idx) => (
                          <div key={idx} className="capitalize flex items-center justify-between">
                            <span>• {src.jour} {src.repas} - <span className="font-semibold text-slate-650">{src.recetteTitre}</span></span>
                            <span className="text-indigo-650 font-bold ml-1">({src.quantite} {src.unite})</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Collapsible details for page "Planning" (context === "planning") */}
                    {context === "planning" && expandedItemId === item.id && item.sources && item.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-550 flex flex-col gap-1 w-full bg-slate-50/50 p-2 rounded-lg">
                        {item.sources.map((src, idx) => (
                          <div key={idx} className="flex justify-between items-center capitalize">
                            <span>• {src.jour} {src.repas}</span>
                            <span className="font-semibold text-slate-700 truncate max-w-[120px]" title={src.recetteTitre}>{src.recetteTitre}</span>
                            <span className="text-indigo-600 font-bold">({src.quantite} {src.unite})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* 🟩 Section "Ingrédients cochés" */}
        {elementsCoches.length > 0 && (
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4">
            <h3 className="text-xs font-black text-slate-500 border-b border-slate-200 pb-2 mb-3 tracking-wider uppercase">
              Ingrédients cochés ({elementsCoches.length})
            </h3>
            <div className="space-y-2">
              {elementsCoches.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 border border-slate-100 flex flex-col p-2.5 rounded-xl opacity-60"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2.5">
                      {context === "liste" && (
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={() => handleToggleAchete(item.id)}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer flex-shrink-0 bg-slate-50"
                        />
                      )}
                      <div className="flex flex-col items-start leading-tight">
                        {item.manuel && (
                          <span className="text-[8px] uppercase tracking-wider font-semibold text-slate-400 mb-0.5">
                            Manuel
                          </span>
                        )}
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium capitalize text-slate-400 line-through">
                            {item.nom}
                          </span>
                          {context === "planning" && item.sources && item.sources.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setExpandedItemId(expandedItemId === item.id ? null : item.id)}
                              className="text-slate-400 hover:text-indigo-600 transition-colors p-0.5 rounded-full hover:bg-slate-150 cursor-pointer"
                              title="Voir la provenance"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {/* Contrôle de la quantité */}
                      {context === "planning" ? (
                        <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg text-slate-400">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantite(item.id, -1)}
                            className="p-0.5 hover:bg-slate-200 hover:text-indigo-600 rounded transition-colors text-slate-400"
                            title="Diminuer la quantité"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          
                          <span className="text-xs font-bold text-slate-450 min-w-[65px] text-center truncate">
                            {item.quantite > 0 ? `${item.quantite} ${item.unite}` : item.unite || "0"}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleUpdateQuantite(item.id, 1)}
                            className="p-0.5 hover:bg-slate-200 hover:text-indigo-600 rounded transition-colors text-slate-400"
                            title="Augmenter la quantité"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-slate-400 mr-1.5 line-through">
                          {item.quantite > 0 ? `${item.quantite} ${item.unite}` : item.unite || "0"}
                        </span>
                      )}

                      {item.manuel && (
                        <button
                          type="button"
                          onClick={() => handleDeleteElement(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer shrink-0"
                          title="Supprimer cet ingrédient manuel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Source details for page "Liste des courses" (context === "liste") */}
                  {context === "liste" && item.sources && item.sources.length > 0 && (
                    <div className="mt-1.5 pl-6.5 text-[10px] text-slate-400 flex flex-col gap-0.5 border-t border-slate-200/50 pt-1.5 w-full line-through">
                      {item.sources.map((src, idx) => (
                        <div key={idx} className="capitalize flex items-center justify-between">
                          <span>• {src.jour} {src.repas} - <span className="font-semibold">{src.recetteTitre}</span></span>
                          <span className="ml-1">({src.quantite} {src.unite})</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Collapsible details for page "Planning" (context === "planning") */}
                  {context === "planning" && expandedItemId === item.id && item.sources && item.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-400 flex flex-col gap-1 w-full bg-slate-100/50 p-2 rounded-lg">
                      {item.sources.map((src, idx) => (
                        <div key={idx} className="flex justify-between items-center capitalize">
                          <span>• {src.jour} {src.repas}</span>
                          <span className="font-semibold truncate max-w-[120px]" title={src.recetteTitre}>{src.recetteTitre}</span>
                          <span>({src.quantite} {src.unite})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {elements.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-center font-bold text-slate-650 text-sm">Votre liste est vide !</p>
            <p className="text-center text-xs text-slate-450 mt-1">Ajoutez des recettes à votre planning pour générer vos courses.</p>
          </div>
        )}
      </div>
    </div>
  );
};
