import React, { useState, useEffect } from "react";
import { subscribeListeCourses, saveListeCourses } from "../services/db";
import { useAuth } from "../contexts/AuthContext";
import { ElementListeCourses } from "../types";
import { ShoppingCart, Eye, EyeOff, Plus, Trash2, CheckCircle2, RotateCcw, AlertCircle } from "lucide-react";

export const ListeView: React.FC = () => {
  const { foyer } = useAuth();
  const [elements, setElements] = useState<ElementListeCourses[]>([]);
  const [mode, setMode] = useState<"preparation" | "courses">("courses");
  const [masquerAcquis, setMasquerAcquis] = useState(true);

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

  const handleToggleAcquis = async (id: string) => {
    if (!foyer?.id) return;
    const updated = elements.map((item) => {
      if (item.id === id) {
        return { ...item, dejaAcquis: !item.dejaAcquis };
      }
      return item;
    });
    await saveListeCourses(foyer.id, updated);
  };

  const handleToggleAchete = async (id: string) => {
    if (!foyer?.id) return;
    const updated = elements.map((item) => {
      if (item.id === id) {
        return { ...item, achete: !item.achete };
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
    if (!foyer?.id || !window.confirm("Voulez-vous décocher tous les articles achetés ou possédés ?")) return;
    const updated = elements.map((item) => ({
      ...item,
      dejaAcquis: false,
      achete: false
    }));
    await saveListeCourses(foyer.id, updated);
  };

  // Grouper par rayon
  const elementsFiltres = elements.filter((item) => {
    // Si on masque les éléments "déjà acquis" (placard)
    if (masquerAcquis && item.dejaAcquis) return false;
    return true;
  });

  const rayonsGroupes: { [key: string]: ElementListeCourses[] } = {};
  elementsFiltres.forEach((item) => {
    if (!rayonsGroupes[item.rayon]) {
      rayonsGroupes[item.rayon] = [];
    }
    rayonsGroupes[item.rayon].push(item);
  });

  return (
    <div className="h-full flex flex-col p-4 md:p-6 bg-slate-950 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="text-violet-500" />
            Ma Liste de Courses
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Gérez vos achats ({elements.filter(e => !e.achete && !e.dejaAcquis).length} articles restants)
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMode(mode === "preparation" ? "courses" : "preparation")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border transition-all ${
              mode === "preparation"
                ? "bg-amber-600/10 border-amber-500/30 text-amber-400"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {mode === "preparation" ? "Mode Courses 🛒" : "Mode Préparation 🏡"}
          </button>
          
          <button
            onClick={handleResetFiltres}
            title="Réinitialiser les coches"
            className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mode Préparation Infos */}
      {mode === "preparation" && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs p-4 rounded-xl mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
          <div>
            <span className="font-bold">Mode Préparation (Placards/Frigo) :</span> Cochez les ingrédients que vous possédez déjà à la maison pour les soustraire de la liste finale avant de partir en magasin.
          </div>
        </div>
      )}

      {/* Visibilité Placards Toggle */}
      <div className="flex items-center justify-between bg-slate-900/50 border border-slate-900 rounded-xl p-3 mb-6">
        <span className="text-xs text-slate-400">Masquer les articles possédés (déjà au placard)</span>
        <button
          onClick={() => setMasquerAcquis(!masquerAcquis)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            masquerAcquis
              ? "bg-violet-600/10 border-violet-500/30 text-violet-400"
              : "bg-slate-800 border-slate-700 text-slate-400"
          }`}
        >
          {masquerAcquis ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {masquerAcquis ? "Masqués" : "Visibles"}
        </button>
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
        {Object.keys(rayonsGroupes).map((rayonName) => (
          <div key={rayonName} className="bg-slate-900/30 border border-slate-900 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-400 border-b border-slate-800 pb-2 mb-4 tracking-wider uppercase">
              {rayonName}
            </h3>
            <div className="space-y-3">
              {rayonsGroupes[rayonName].map((item) => {
                const estCoche = mode === "preparation" ? item.dejaAcquis : item.achete;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      estCoche
                        ? "bg-slate-900/10 border-slate-900/50 opacity-40"
                        : "bg-slate-900/60 border-slate-800/50 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={estCoche}
                        onChange={() => {
                          if (mode === "preparation") {
                            handleToggleAcquis(item.id);
                          } else {
                            handleToggleAchete(item.id);
                          }
                        }}
                        className="w-5 h-5 rounded-lg border-slate-700 bg-slate-800 text-violet-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <div>
                        <span className={`text-sm font-medium capitalize ${estCoche ? "line-through text-slate-500" : "text-white"}`}>
                          {item.nom}
                        </span>
                        {item.manuel && (
                          <span className="ml-2 text-2xs px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-500">
                            Manuel
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-semibold ${estCoche ? "text-slate-600" : "text-violet-400"}`}>
                        {item.quantite > 0 ? `${item.quantite} ${item.unite}` : item.unite}
                      </span>

                      <button
                        onClick={() => handleDeleteElement(item.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {Object.keys(rayonsGroupes).length === 0 && (
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
