import React, { useState, useEffect } from "react";
import { subscribeListeCourses, saveListeCourses } from "../services/db";
import { useAuth } from "../contexts/AuthContext";
import { ElementListeCourses } from "../types";
import { ShoppingCart, Plus, Trash2, CheckCircle2, RotateCcw, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

interface ListeViewProps {
  onCollapse?: () => void;
}

export const ListeView: React.FC<ListeViewProps> = ({ onCollapse }) => {
  const { foyer } = useAuth();
  const [elements, setElements] = useState<ElementListeCourses[]>([]);

  // Formulaire ajout manuel
  const [nom, setNom] = useState("");
  const [quantite, setQuantite] = useState("");
  const [unite, setUnite] = useState("");
  const [rayon, setRayon] = useState("Autre / Divers");

  useEffect(() => {
    if (!foyer?.id) return;
    const unsubscribe = subscribeListeCourses(foyer.id, (loadedElements) => {
      setElements(loadedElements);
    });
    return unsubscribe;
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

          {/* Action buttons on the top right */}
          <div className="flex gap-2">
            <button
              onClick={handleResetFiltres}
              title="Réinitialiser toutes les coches"
              className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
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

      {/* Section Ajout Manuel */}
      <form onSubmit={handleAddManuel} className="bg-slate-900/40 border border-slate-850 rounded-2xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2">
          <input
            type="text"
            required
            placeholder="Ajouter un produit (ex: Beurre, Citrons...)"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/50 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Qté"
            value={quantite}
            onChange={(e) => setQuantite(e.target.value)}
            className="w-20 bg-slate-800/80 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-white text-center focus:outline-none"
          />
          <input
            type="text"
            placeholder="Unité"
            value={unite}
            onChange={(e) => setUnite(e.target.value)}
            className="w-16 bg-slate-800/80 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-white text-center focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl text-sm py-2.5 px-4 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </form>

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
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => handleToggleAchete(item.id)}
                      className="w-5 h-5 rounded-lg border-slate-700 bg-slate-800 text-violet-500 focus:ring-0 focus:ring-offset-0 cursor-pointer flex-shrink-0"
                    />
                    <div>
                      <span className="text-sm font-medium capitalize text-white">
                        {item.nom}
                      </span>
                      {item.manuel && (
                        <span className="ml-2 text-2xs px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-500">
                          Manuel
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Contrôle de la quantité */}
                    <div className="flex items-center gap-1 bg-slate-950/40 border border-slate-800 px-2 py-1 rounded-lg text-slate-500">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantite(item.id, -1)}
                        className="p-0.5 hover:bg-slate-800 hover:text-violet-400 rounded transition-colors text-slate-550"
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
                        className="p-0.5 hover:bg-slate-800 hover:text-violet-400 rounded transition-colors text-slate-550"
                        title="Augmenter la quantité"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteElement(item.id)}
                      className="text-slate-650 hover:text-red-400 transition-colors p-1"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                  className="bg-slate-950/20 border border-slate-900/40 flex items-center justify-between p-3 rounded-xl border transition-all"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => handleToggleAchete(item.id)}
                      className="w-5 h-5 rounded-lg border-slate-700 bg-slate-800 text-violet-500 focus:ring-0 focus:ring-offset-0 cursor-pointer flex-shrink-0"
                    />
                    <div>
                      <span className="text-sm font-medium capitalize text-slate-500 line-through">
                        {item.nom}
                      </span>
                      {item.manuel && (
                        <span className="ml-2 text-2xs px-1.5 py-0.5 rounded bg-slate-900/40 border border-slate-800 text-slate-600">
                          Manuel
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Contrôle de la quantité */}
                    <div className="flex items-center gap-1 bg-slate-950/20 border border-slate-900 px-2 py-1 rounded-lg text-slate-600">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantite(item.id, -1)}
                        className="p-0.5 hover:bg-slate-900 hover:text-violet-400 rounded transition-colors text-slate-650"
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
                        className="p-0.5 hover:bg-slate-900 hover:text-violet-400 rounded transition-colors text-slate-655"
                        title="Augmenter la quantité"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteElement(item.id)}
                      className="text-slate-700 hover:text-red-400 transition-colors p-1"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
