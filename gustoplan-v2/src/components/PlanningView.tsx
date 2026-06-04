import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { subscribeRecettes, subscribePlanning, savePlanning, saveListeCourses, subscribeListeCourses, updateFoyerStartDay, subscribeRayonsIngredients, toggleFavoriRecette } from "../services/db";
import { genererListeCourses } from "../services/courseEngine";
import { Recette, PlanningSemaine, JourPlanning, RepasPlanifie, ElementListeCourses } from "../types";
import { DndContext, useDraggable, useDroppable, DragEndEvent, pointerWithin, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  Calendar, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Users, Trash2, Edit, Plus, Heart, 
  Settings, RefreshCw, Smartphone, Monitor, BookOpen, ShoppingCart, Info, X, FilePenLine
} from "lucide-react";
import { ListeView } from "./ListeView";

const LISTE_JOURS_REF = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

export interface ColorConfig {
  text: string;
  border: string;
  borderHover: string;
  bgHeader: string;
  cellBg: string;
  cellIsOver: string;
  glow: string;
  activeText: string;
}

export const CONFIG_COULEURS_JOURS: { [key: string]: ColorConfig } = {
  lundi: {
    text: "text-indigo-800",
    activeText: "text-indigo-600",
    border: "border-indigo-150",
    borderHover: "hover:border-indigo-300",
    bgHeader: "bg-indigo-100 border-indigo-200",
    cellBg: "bg-white border-slate-200/80 hover:border-indigo-300",
    cellIsOver: "bg-orange-50/50 border-orange-300",
    glow: "shadow-md shadow-indigo-100"
  },
  mardi: {
    text: "text-rose-800",
    activeText: "text-rose-600",
    border: "border-rose-150",
    borderHover: "hover:border-rose-300",
    bgHeader: "bg-rose-100 border-rose-200",
    cellBg: "bg-white border-slate-200/80 hover:border-rose-300",
    cellIsOver: "bg-orange-50/50 border-orange-300",
    glow: "shadow-md shadow-rose-100"
  },
  mercredi: {
    text: "text-emerald-800",
    activeText: "text-emerald-600",
    border: "border-emerald-150",
    borderHover: "hover:border-emerald-300",
    bgHeader: "bg-emerald-100 border-emerald-200",
    cellBg: "bg-white border-slate-200/80 hover:border-emerald-300",
    cellIsOver: "bg-orange-50/50 border-orange-300",
    glow: "shadow-md shadow-emerald-100"
  },
  jeudi: {
    text: "text-sky-800",
    activeText: "text-sky-600",
    border: "border-sky-150",
    borderHover: "hover:border-sky-300",
    bgHeader: "bg-sky-100 border-sky-200",
    cellBg: "bg-white border-slate-200/80 hover:border-sky-300",
    cellIsOver: "bg-orange-50/50 border-orange-300",
    glow: "shadow-md shadow-sky-100"
  },
  vendredi: {
    text: "text-amber-800",
    activeText: "text-amber-600",
    border: "border-amber-150",
    borderHover: "hover:border-amber-300",
    bgHeader: "bg-amber-100 border-amber-200",
    cellBg: "bg-white border-slate-200/80 hover:border-amber-300",
    cellIsOver: "bg-orange-50/50 border-orange-300",
    glow: "shadow-md shadow-amber-100"
  },
  samedi: {
    text: "text-fuchsia-800",
    activeText: "text-fuchsia-600",
    border: "border-fuchsia-150",
    borderHover: "hover:border-fuchsia-300",
    bgHeader: "bg-fuchsia-100 border-fuchsia-200",
    cellBg: "bg-white border-slate-200/80 hover:border-fuchsia-300",
    cellIsOver: "bg-orange-50/50 border-orange-300",
    glow: "shadow-md shadow-fuchsia-100"
  },
  dimanche: {
    text: "text-teal-800",
    activeText: "text-teal-600",
    border: "border-teal-150",
    borderHover: "hover:border-teal-300",
    bgHeader: "bg-teal-100 border-teal-200",
    cellBg: "bg-white border-slate-200/80 hover:border-teal-300",
    cellIsOver: "bg-orange-50/50 border-orange-300",
    glow: "shadow-md shadow-teal-100"
  }
};


// --- DRAGGABLE RECIPE COMPONENT ---
interface DraggableRecipeProps {
  recette: Recette;
  onToggleFavori?: (recette: Recette) => void;
}

const DraggableRecipe: React.FC<DraggableRecipeProps> = ({ recette, onToggleFavori }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `recipe_${recette.id}`,
    data: { recette }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl cursor-grab active:cursor-grabbing transition-all flex items-center gap-3 ${
        isDragging ? "opacity-25 border-dashed border-orange-300 bg-slate-100 shadow-none" : "shadow-sm hover:border-slate-300"
      }`}
    >
      {/* Mini-image de recette ou icône par défaut */}
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center border border-slate-200">
        {recette.imageUrl ? (
          <img src={recette.imageUrl} alt={recette.titre} className="w-full h-full object-cover" />
        ) : (
          <BookOpen className="w-5 h-5 text-slate-600" />
        )}
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-center gap-1">
          <span className="text-sm font-semibold truncate text-slate-800 capitalize">{recette.titre}</span>
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (onToggleFavori) {
                onToggleFavori(recette);
              }
            }}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors shrink-0 cursor-pointer"
            title={recette.favori ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart 
              className={`w-3.5 h-3.5 transition-all ${
                recette.favori 
                  ? "fill-amber-400 text-amber-400 scale-110" 
                  : "text-slate-350 hover:text-amber-400"
              }`} 
            />
          </button>
        </div>
        <div className="flex items-center justify-between mt-1 text-3xs uppercase tracking-wider font-extrabold text-slate-450">
          <span>{recette.categorie}</span>
          <span>{recette.portionsDefaut} pers.</span>
        </div>
      </div>
    </div>
  );
};

// --- DROPPABLE REPAS CELL COMPONENT ---
interface DroppableRepasCellProps {
  prefix: "pc" | "mobile";
  jour: string;
  moment: "midi" | "soir";
  repasListe: RepasPlanifie[] | null;
  onClear: (planifiedId: string) => void;
  onUpdatePortions: (planifiedId: string, portions: number) => void;
  onAddTexte: (texte: string) => void;
  colors: ColorConfig;
  onShowDetails?: (repas: RepasPlanifie) => void;
}

const DroppableRepasCell: React.FC<DroppableRepasCellProps> = ({
  prefix,
  jour,
  moment,
  repasListe,
  onClear,
  onUpdatePortions,
  onAddTexte,
  colors,
  onShowDetails,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `cell_${prefix}_${jour}_${moment}`,
  });
  
  const [showInput, setShowInput] = useState(false);
  const [textVal, setTextVal] = useState("");

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textVal.trim()) {
      onAddTexte(textVal.trim());
      setTextVal("");
      setShowInput(false);
    }
  };

  // Traitement robuste de l'état hérité (si c'est un seul objet plutôt qu'un tableau)
  const listAsArray = Array.isArray(repasListe) ? repasListe : (repasListe ? [repasListe] : []);

  const bgClass = colors.bgHeader.split(" ")[0]; // e.g. "bg-sky-50"

  return (
    <div
      ref={setNodeRef}
      className={`min-h-24 p-2.5 rounded-2xl border transition-all duration-200 flex flex-col gap-2 ${
        isOver
          ? "border-dashed border-2 border-orange-300 bg-orange-50/50 shadow-sm shadow-orange-100/30 scale-[1.02]"
          : listAsArray.length > 0
          ? `${bgClass} border-slate-200/80 ${colors.borderHover}`
          : `${bgClass}/45 border-slate-200/60`
      }`}
    >
      <div className="flex justify-between items-center pb-1 border-b border-slate-200/80">
        <span className={`text-3xs uppercase tracking-widest font-black ${moment === 'midi' ? 'text-amber-800' : 'text-indigo-850'}`}>{moment}</span>
        {!showInput && (
          <button
            onClick={() => setShowInput(true)}
            className={`p-0.5 rounded transition-colors ${moment === 'midi' ? 'text-amber-800 hover:text-orange-500' : 'text-indigo-850 hover:text-indigo-600'} cursor-pointer`}
            title="Ajouter une note rapide"
          >
            <FilePenLine className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex-grow flex flex-col gap-2">
        <SortableContext
          items={listAsArray.map((repas) => `${prefix}_planned_${repas.planifiedId}`)}
          strategy={verticalListSortingStrategy}
        >
          {listAsArray.map((repas) => (
            <DraggablePlannedMeal
              key={repas.planifiedId || repas.id || Math.random().toString()}
              prefix={prefix}
              repas={repas}
              jour={jour}
              moment={moment}
              onClear={onClear}
              onUpdatePortions={onUpdatePortions}
              colors={colors}
              onShowDetails={onShowDetails}
            />
          ))}
        </SortableContext>

        {listAsArray.length === 0 && !showInput && (
          <div className="flex-grow flex items-center justify-center py-2">
            <span className="text-3xs text-slate-650 italic">Vide</span>
          </div>
        )}

        {showInput && (
          <form onSubmit={handleTextSubmit} className="w-full flex gap-1 mt-1">
            <input
              type="text"
              required
              autoFocus
              placeholder="Ex: Restes, Pizza..."
              value={textVal}
              onChange={(e) => setTextVal(e.target.value)}
              className="flex-grow bg-slate-50 border border-slate-250 rounded-lg px-2 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400"
            />
            <button type="submit" className="bg-orange-100 hover:bg-orange-200 text-orange-850 px-2 py-1 rounded-lg text-xs font-bold cursor-pointer">OK</button>
            <button type="button" onClick={() => setShowInput(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-lg text-xs font-bold cursor-pointer">X</button>
          </form>
        )}
      </div>
    </div>
  );
};

// --- HELPER DE CÉSURÈS (HYPHENATION) EN FRANÇAIS ---
const hyphenateFrenchWord = (word: string): string => {
  let w = word;
  const v = "[aeiouyâêîôûéèàùœæ]";
  const c = "[bcdfghjklmnpqrstvwxz]";
  
  // Règle V-CV -> V\u00adCV
  const r1 = new RegExp(`(${v})(${c}${v})`, "gi");
  w = w.replace(r1, "$1\u00ad$2");
  
  // Règle VC-CV -> VC\u00adCV
  const r2 = new RegExp(`(${v}${c})(${c}${v})`, "gi");
  w = w.replace(r2, "$1\u00ad$2");
  
  return w;
};

const hyphenateText = (text: string): string => {
  if (!text) return "";
  return text.split(/(\b[a-zA-Zà-üÀ-Ü]+\b)/g).map((part) => {
    if (/^[a-zA-Zà-üÀ-Ü]+$/.test(part)) {
      return hyphenateFrenchWord(part);
    }
    return part;
  }).join("");
};

// --- DRAGGABLE PLANNED MEAL COMPONENT ---
interface DraggablePlannedMealProps {
  prefix: "pc" | "mobile";
  repas: RepasPlanifie;
  jour: string;
  moment: "midi" | "soir";
  onClear: (planifiedId: string) => void;
  onUpdatePortions: (planifiedId: string, portions: number) => void;
  colors: ColorConfig;
  onShowDetails?: (repas: RepasPlanifie) => void;
}

const DraggablePlannedMeal: React.FC<DraggablePlannedMealProps> = ({
  prefix,
  repas,
  jour,
  moment,
  onClear,
  onUpdatePortions,
  colors,
  onShowDetails,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `${prefix}_planned_${repas.planifiedId}`,
    data: { repas, sourceJour: jour, sourceMoment: moment }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`relative bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col gap-1.5 cursor-grab active:cursor-grabbing transition-all shadow-sm ${
        isDragging ? "opacity-20 border-dashed border-orange-350 bg-slate-50 shadow-none" : "hover:border-slate-350"
      }`}
    >
      {/* Ligne supérieure avec le badge ou espaceur, et la corbeille tout à droite */}
      <div className="flex justify-between items-center w-full min-w-0" onClick={(e) => e.stopPropagation()}>
        {repas.type === "recette" ? (
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              if (onShowDetails) onShowDetails(repas);
            }}
            className="text-slate-400 hover:text-indigo-600 p-0.5 rounded transition-colors shrink-0 cursor-pointer"
            title="Voir la fiche recette"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        ) : repas.type === "texte" ? (
          <span className="text-4xs text-amber-900 font-extrabold uppercase tracking-wider bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 inline-block">
            Repas rapide
          </span>
        ) : (
          <span />
        )}
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onClear(repas.planifiedId);
          }}
          className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors shrink-0 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="w-full min-w-0">
        <span className="text-xs font-bold text-slate-800 leading-snug block break-words">
          {hyphenateText(repas.texte || "")}
        </span>
      </div>

      <div 
        className="flex items-center justify-center gap-1 border-t border-slate-100 pt-1.5 text-slate-400"
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUpdatePortions(repas.planifiedId, Math.max(1, repas.portions - 1));
          }}
          className="p-0.5 hover:bg-slate-100 hover:text-orange-600 rounded transition-colors text-slate-400 cursor-pointer"
          title="Diminuer les portions"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        
        <span className="font-extrabold text-orange-600 text-xs px-0.5 min-w-4 text-center">
          {repas.portions}
        </span>
        
        <Users className="w-3.5 h-3.5 text-slate-450 shrink-0 mr-0.5" />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUpdatePortions(repas.planifiedId, repas.portions + 1);
          }}
          className="p-0.5 hover:bg-slate-100 hover:text-orange-600 rounded transition-colors text-slate-400 cursor-pointer"
          title="Augmenter les portions"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// --- MAIN PLANNING VIEW ---
export const PlanningView: React.FC = () => {
  const { foyer, refreshFoyer } = useAuth();
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [planning, setPlanning] = useState<PlanningSemaine | null | undefined>(undefined);
  const [listeCourses, setListeCourses] = useState<ElementListeCourses[]>([]);
  const [customRayons, setCustomRayons] = useState<{ [key: string]: string }>({});
  const [activeRecipe, setActiveRecipe] = useState<Recette | null>(null);
  const [activePlannedMeal, setActivePlannedMeal] = useState<RepasPlanifie | null>(null);
  const [previewRecipe, setPreviewRecipe] = useState<Recette | null>(null);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  
  // Onglet recettes filtre
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [favsFirst, setFavsFirst] = useState(true);
  const [search, setSearch] = useState("");

  // Mobile Swipe Jours
  const [activeDayIdxMobile, setActiveDayIdxMobile] = useState(0);

  const handleShowRecipeDetails = (repas: RepasPlanifie) => {
    const recetteAssociee = recettes.find(r => r.id === repas.id || (repas.texte && r.titre.toLowerCase() === repas.texte.toLowerCase()));
    if (recetteAssociee) {
      setPreviewRecipe(recetteAssociee);
    }
  };

  // Charger recettes + planning
  useEffect(() => {
    if (!foyer?.id) return;
    const unsubRecettes = subscribeRecettes(foyer.id, setRecettes);
    const unsubPlanning = subscribePlanning(foyer.id, setPlanning);
    const unsubListe = subscribeListeCourses(foyer.id, setListeCourses);
    const unsubRayons = subscribeRayonsIngredients(foyer.id, setCustomRayons);
    return () => {
      unsubRecettes();
      unsubPlanning();
      unsubListe();
      unsubRayons();
    };
  }, [foyer?.id]);

  // Synchronisation automatique de la liste de courses si le planning, les recettes ou les rayons changent
  useEffect(() => {
    if (!foyer?.id || !planning || recettes.length === 0) return;

    const nouvelleListe = genererListeCourses(planning, recettes, listeCourses, customRayons);

    // Comparaison stricte et triée pour éviter les écritures Firebase en boucle
    const hash = (list: ElementListeCourses[]) => 
      [...list]
        .sort((a, b) => a.id.localeCompare(b.id))
        .map(i => `${i.id}_${i.nom}_${i.quantite}_${i.unite}_${i.dejaAcquis}_${i.achete}`)
        .join("|");

    if (hash(nouvelleListe) !== hash(listeCourses)) {
      saveListeCourses(foyer.id, nouvelleListe);
    }
  }, [planning, recettes, customRayons, listeCourses, foyer?.id]);

  // Initialiser planning s'il n'existe pas en base (planning === null)
  useEffect(() => {
    if (!foyer?.id || planning !== null) return;
    const setupDefaultPlanning = async () => {
      const defaultPlanning: PlanningSemaine = {
        debutDate: new Date().toISOString().split("T")[0],
        jours: {
          lundi: { midi: [], soir: [] },
          mardi: { midi: [], soir: [] },
          mercredi: { midi: [], soir: [] },
          jeudi: { midi: [], soir: [] },
          vendredi: { midi: [], soir: [] },
          samedi: { midi: [], soir: [] },
          dimanche: { midi: [], soir: [] },
        }
      };
      await savePlanning(foyer.id, defaultPlanning);
    };
    setupDefaultPlanning();
  }, [foyer?.id, planning]);

  // Générer automatiquement la liste de courses en temps réel à chaque changement du planning
  const declencherMiseAJourListe = async (nouveauPlanning: PlanningSemaine) => {
    if (!foyer?.id) return;
    const nouvelleListe = genererListeCourses(nouveauPlanning, recettes, listeCourses, customRayons);
    await saveListeCourses(foyer.id, nouvelleListe);
  };

  const trouverRepasEtPosition = (planifiedId: string) => {
    if (!planning) return null;
    const joursKeys = Object.keys(planning.jours);
    for (const jour of joursKeys) {
      for (const moment of ["midi", "soir"] as const) {
        const repasListe = planning.jours[jour][moment] || [];
        const arrayRepas = Array.isArray(repasListe) ? repasListe : (repasListe ? [repasListe] : []);
        const idx = arrayRepas.findIndex((r) => r.planifiedId === planifiedId);
        if (idx !== -1) {
          return { jour, moment, index: idx };
        }
      }
    }
    return null;
  };

  // Aimer/désaimer une recette
  const handleToggleFavori = async (recette: Recette) => {
    if (!foyer?.id || !recette.id) return;
    await toggleFavoriRecette(foyer.id, recette.id, !recette.favori);
  };

  // Ordonner les jours de la semaine selon la config du foyer (jourDebutSemaine)
  const getJoursOrdonnes = (): string[] => {
    const startDay = foyer?.jourDebutSemaine !== undefined ? foyer.jourDebutSemaine : 1; // 1 = lundi
    const ordonnes: string[] = [];
    for (let i = 0; i < 7; i++) {
      const idx = (startDay + i) % 7;
      ordonnes.push(LISTE_JOURS_REF[idx]);
    }
    return ordonnes;
  };

  const joursSemaine = getJoursOrdonnes();

  const handleDragStart = (event: any) => {
    const { active } = event;
    const activeData = active.data.current;
    if (activeData) {
      if (activeData.recette) {
        setActiveRecipe(activeData.recette);
      } else if (activeData.repas) {
        setActivePlannedMeal(activeData.repas);
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveRecipe(null);
    setActivePlannedMeal(null);
    if (!foyer?.id || !planning) return;
    const { active, over } = event;
    if (!over) return;

    const overId = over.id as string;
    let targetJour = "";
    let targetMoment: "midi" | "soir" = "midi";
    let targetIndex = -1; // -1 signifie à la fin de la liste

    if (overId.startsWith("cell_")) {
      const parts = overId.split("_");
      targetJour = parts[2];
      targetMoment = parts[3] as "midi" | "soir";
    } else {
      // C'est un ID de repas sortable
      const planifiedIdClean = overId.includes("_planned_") ? overId.split("_planned_")[1] : overId;
      const targetPos = trouverRepasEtPosition(planifiedIdClean);
      if (targetPos) {
        targetJour = targetPos.jour;
        targetMoment = targetPos.moment;
        targetIndex = targetPos.index;
      } else {
        return;
      }
    }

    const activeData = active.data.current;
    if (!activeData) return;

    let planningModifie: PlanningSemaine;

    // Cas 1: Provenance panneau gauche des recettes
    if (activeData.recette) {
      const r: Recette = activeData.recette;
      const repasPlanifie: RepasPlanifie = {
        planifiedId: `${r.id}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        type: "recette",
        id: r.id,
        texte: r.titre,
        portions: r.portionsDefaut || 4
      };

      const currentList = planning.jours[targetJour]?.[targetMoment] || [];
      const targetList = Array.isArray(currentList) ? [...currentList] : (currentList ? [currentList] : []);
      
      if (targetIndex === -1) {
        targetList.push(repasPlanifie);
      } else {
        targetList.splice(targetIndex, 0, repasPlanifie);
      }

      planningModifie = {
        ...planning,
        jours: {
          ...planning.jours,
          [targetJour]: {
            ...planning.jours[targetJour],
            [targetMoment]: targetList
          }
        }
      };
    } 
    // Cas 2: Déplacement interne d'un repas planifié
    else if (activeData.repas) {
      const repasPlanifie: RepasPlanifie = activeData.repas;
      const sourceJour = activeData.sourceJour;
      const sourceMoment = activeData.sourceMoment as "midi" | "soir";

      // 1. Retirer du jour source
      const currentSourceList = planning.jours[sourceJour]?.[sourceMoment] || [];
      const sourceList = Array.isArray(currentSourceList) ? [...currentSourceList] : (currentSourceList ? [currentSourceList] : []);
      const sourceIdx = sourceList.findIndex((repas) => repas.planifiedId === repasPlanifie.planifiedId);
      if (sourceIdx !== -1) {
        sourceList.splice(sourceIdx, 1);
      }

      // 2. Insérer dans le jour cible
      const currentTargetList = planning.jours[targetJour]?.[targetMoment] || [];
      let targetList = (sourceJour === targetJour && sourceMoment === targetMoment)
        ? sourceList
        : (Array.isArray(currentTargetList) ? [...currentTargetList] : (currentTargetList ? [currentTargetList] : []));

      let finalTargetIndex = targetIndex;
      if (finalTargetIndex === -1) {
        finalTargetIndex = targetList.length;
      }
      
      targetList.splice(finalTargetIndex, 0, repasPlanifie);

      if (sourceJour === targetJour) {
        planningModifie = {
          ...planning,
          jours: {
            ...planning.jours,
            [sourceJour]: {
              ...planning.jours[sourceJour],
              [sourceMoment]: sourceList,
              [targetMoment]: targetList
            }
          }
        };
      } else {
        planningModifie = {
          ...planning,
          jours: {
            ...planning.jours,
            [sourceJour]: {
              ...planning.jours[sourceJour],
              [sourceMoment]: sourceList
            },
            [targetJour]: {
              ...planning.jours[targetJour],
              [targetMoment]: targetList
            }
          }
        };
      }
    } else {
      return;
    }

    setPlanning(planningModifie);
    await savePlanning(foyer.id, planningModifie);
    await declencherMiseAJourListe(planningModifie);
  };

  const handleDragCancel = () => {
    setActiveRecipe(null);
    setActivePlannedMeal(null);
  };

  const handleClearRepas = async (jour: string, moment: "midi" | "soir", planifiedId: string) => {
    if (!foyer?.id || !planning) return;

    const currentList = planning.jours[jour]?.[moment] || [];
    const listAsArray = Array.isArray(currentList) ? currentList : (currentList ? [currentList] : []);
    const updatedList = listAsArray.filter((repas) => repas.planifiedId !== planifiedId);

    const planningModifie = {
      ...planning,
      jours: {
        ...planning.jours,
        [jour]: {
          ...planning.jours[jour],
          [moment]: updatedList
        }
      }
    };

    setPlanning(planningModifie);
    await savePlanning(foyer.id, planningModifie);
    await declencherMiseAJourListe(planningModifie);
  };

  const handleUpdatePortions = async (jour: string, moment: "midi" | "soir", planifiedId: string, portions: number) => {
    if (!foyer?.id || !planning) return;

    const currentList = planning.jours[jour]?.[moment] || [];
    const listAsArray = Array.isArray(currentList) ? currentList : (currentList ? [currentList] : []);
    const updatedList = listAsArray.map((repas) => {
      if (repas.planifiedId === planifiedId) {
        return { ...repas, portions };
      }
      return repas;
    });

    const planningModifie = {
      ...planning,
      jours: {
        ...planning.jours,
        [jour]: {
          ...planning.jours[jour],
          [moment]: updatedList
        }
      }
    };

    setPlanning(planningModifie);
    await savePlanning(foyer.id, planningModifie);
    await declencherMiseAJourListe(planningModifie);
  };

  const handleAddTexteRepas = async (jour: string, moment: "midi" | "soir", texte: string) => {
    if (!foyer?.id || !planning) return;

    const newRepas: RepasPlanifie = {
      planifiedId: `texte_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: "texte",
      texte,
      portions: 4
    };

    const currentList = planning.jours[jour]?.[moment] || [];
    const listAsArray = Array.isArray(currentList) ? currentList : (currentList ? [currentList] : []);
    const updatedList = [...listAsArray, newRepas];

    const planningModifie = {
      ...planning,
      jours: {
        ...planning.jours,
        [jour]: {
          ...planning.jours[jour],
          [moment]: updatedList
        }
      }
    };

    setPlanning(planningModifie);
    await savePlanning(foyer.id, planningModifie);
    await declencherMiseAJourListe(planningModifie);
  };

  const handleClearWeek = async () => {
    if (!foyer?.id || !planning || !window.confirm("Vider complètement le planning de la semaine ?")) return;
    
    const planningVide = {
      ...planning,
      jours: {
        lundi: { midi: [], soir: [] },
        mardi: { midi: [], soir: [] },
        mercredi: { midi: [], soir: [] },
        jeudi: { midi: [], soir: [] },
        vendredi: { midi: [], soir: [] },
        samedi: { midi: [], soir: [] },
        dimanche: { midi: [], soir: [] },
      }
    };
    setPlanning(planningVide);
    await savePlanning(foyer.id, planningVide);
    
    // Nettoyer immédiatement la liste de courses en ne gardant que les ajouts manuels
    const elementsManuels = listeCourses.filter((item) => item.manuel);
    await saveListeCourses(foyer.id, elementsManuels);
  };

  // Filtrer les recettes du panneau latéral
  const filteredRecettesPanneau = recettes.filter((r) => {
    const matchesSearch = r.titre.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || r.categorie === categoryFilter;
    const matchesFav = !onlyFavs || r.favori;
    return matchesSearch && matchesCategory && matchesFav;
  });

  const sortedRecettesPanneau = [...filteredRecettesPanneau].sort((a, b) => {
    if (favsFirst) {
      if (a.favori && !b.favori) return -1;
      if (!a.favori && b.favori) return 1;
    }
    return a.titre.localeCompare(b.titre, "fr", { sensitivity: "base" });
  });

  return (
    <DndContext collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
      <div className="h-[calc(100vh-73px)] flex flex-col md:flex-row bg-slate-50 text-slate-800 overflow-hidden">
        
        {/* ================= PANNEAU GAUCHE : RECETTES (PC UNIQUEMENT) ================= */}
        <div className={`hidden md:flex shrink-0 flex-col border-r border-slate-200 bg-white h-full overflow-hidden transition-all duration-300 ease-in-out ${
          isLeftCollapsed ? "w-12 p-2 items-center" : "w-[22%] p-4"
        }`}>
          {isLeftCollapsed ? (
            <div className="flex flex-col items-center py-4 h-full gap-6 select-none w-full">
              <button
                onClick={() => setIsLeftCollapsed(false)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-indigo-300 rounded-lg text-slate-500 hover:text-indigo-650 transition-all cursor-pointer"
                title="Développer les recettes"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div 
                className="flex flex-col items-center gap-2 text-indigo-500 hover:text-indigo-700 cursor-pointer group mt-2" 
                onClick={() => setIsLeftCollapsed(false)}
                title="Développer les recettes"
              >
                <BookOpen className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="text-[10px] font-black uppercase tracking-widest [writing-mode:vertical-lr] rotate-180 select-none">
                  Recettes
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold flex items-center gap-2 text-indigo-750">
                  <BookOpen className="w-4 h-4" /> Recettes
                </h3>
                <button
                  onClick={() => setIsLeftCollapsed(true)}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-indigo-300 rounded-lg text-slate-500 hover:text-indigo-650 transition-all cursor-pointer"
                  title="Réduire les recettes"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
              <div className="relative mb-4 w-full">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className="w-full bg-slate-55 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-855 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors p-0.5 rounded cursor-pointer"
                    title="Effacer la recherche"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex gap-1.5 mb-3">
                {["all", "entree", "plat", "dessert"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`flex-grow py-1 px-1 rounded-lg text-4xs font-extrabold uppercase border tracking-wider transition-all cursor-pointer ${
                      categoryFilter === cat
                        ? "bg-indigo-100 border-indigo-200 text-indigo-750 font-bold"
                        : "bg-slate-50 border-slate-150 text-slate-500 hover:bg-slate-100 hover:text-slate-750"
                    }`}
                  >
                    {cat === "all" ? "Toutes" : cat.slice(0, 3)}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mb-4 w-full">
                <button
                  type="button"
                  onClick={() => setOnlyFavs(!onlyFavs)}
                  className={`flex-grow min-h-[38px] py-1.5 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    onlyFavs
                      ? "bg-rose-100 border-rose-200 text-rose-700 font-bold"
                      : "bg-slate-50 border-slate-150 text-slate-500 hover:bg-slate-100 hover:text-slate-750"
                  }`}
                  title="Afficher uniquement les favoris"
                >
                  <Heart className={`w-3.5 h-3.5 ${onlyFavs ? "fill-rose-500 text-rose-500" : ""}`} />
                  <span>Favoris</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFavsFirst(!favsFirst)}
                  className={`flex-grow min-h-[38px] py-1 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    favsFirst
                      ? "bg-indigo-100 border-indigo-200 text-indigo-750 font-bold"
                      : "bg-slate-50 border-slate-150 text-slate-500 hover:bg-slate-100 hover:text-slate-750"
                  }`}
                  title="Afficher les recettes favorites en premier dans la liste"
                >
                  <svg className={`w-3.5 h-3.5 ${favsFirst ? "text-indigo-650" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  <span className="leading-tight text-left">
                    Favoris <br />
                    en premier
                  </span>
                </button>
              </div>

              {/* Liste draggable */}
              <div className="flex-grow overflow-y-auto space-y-2.5 pr-1">
                {sortedRecettesPanneau.map((recette) => (
                  <DraggableRecipe 
                    key={recette.id} 
                    recette={recette} 
                    onToggleFavori={handleToggleFavori} 
                  />
                ))}
                {sortedRecettesPanneau.length === 0 && (
                  <div className="text-xs text-slate-500 text-center py-6">Aucune recette</div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ================= ZONE CENTRALE : PLANNING (PC ET CARROUSEL MOBILE) ================= */}
        <div className="relative flex-grow flex flex-col p-4 md:p-6 h-full overflow-y-auto min-w-0">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2 text-slate-800">
                <Calendar className="text-orange-500" />
                Mon Planning
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                <span>Foyer : <span className="font-semibold text-slate-850">{foyer?.nom}</span> ({foyer?.codeFoyer})</span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-550">1er jour :</span>
                  <select
                    value={foyer?.jourDebutSemaine !== undefined ? foyer.jourDebutSemaine : 1}
                    onChange={async (e) => {
                      if (foyer?.id) {
                        await updateFoyerStartDay(foyer.id, parseInt(e.target.value));
                        await refreshFoyer();
                      }
                    }}
                    className="bg-white border border-slate-200 rounded px-2 py-0.5 text-3xs font-black text-indigo-650 focus:outline-none focus:border-indigo-500 uppercase tracking-wider cursor-pointer shadow-2xs hover:border-slate-350"
                  >
                    <option value="1">Lundi</option>
                    <option value="2">Mardi</option>
                    <option value="3">Mercredi</option>
                    <option value="4">Jeudi</option>
                    <option value="5">Vendredi</option>
                    <option value="6">Samedi</option>
                    <option value="0">Dimanche</option>
                  </select>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleClearWeek}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition-all active:scale-98 cursor-pointer shadow-sm"
            >
              Vider la semaine
            </button>
          </div>

          {/* 💻 VUE PC : GRILLE GLOBALE */}
          <div className="hidden md:grid grid-cols-7 gap-3.5 flex-grow">
            {joursSemaine.map((jour) => {
              const dayColors = CONFIG_COULEURS_JOURS[jour];
              return (
                <div key={jour} className="flex flex-col gap-3">
                  <div className={`text-center py-2 border rounded-xl transition-all shadow-2xs ${dayColors?.bgHeader || "bg-white border-slate-200"}`}>
                    <span className={`text-xs font-black capitalize tracking-wide ${dayColors?.text || "text-slate-700"}`}>{jour}</span>
                  </div>
                  
                  <DroppableRepasCell
                    prefix="pc"
                    jour={jour}
                    moment="midi"
                    repasListe={planning?.jours[jour]?.midi || []}
                    onClear={(planifiedId) => handleClearRepas(jour, "midi", planifiedId)}
                    onUpdatePortions={(planifiedId, qty) => handleUpdatePortions(jour, "midi", planifiedId, qty)}
                    onAddTexte={(txt) => handleAddTexteRepas(jour, "midi", txt)}
                    colors={dayColors}
                    onShowDetails={handleShowRecipeDetails}
                  />
                  
                  <DroppableRepasCell
                    prefix="pc"
                    jour={jour}
                    moment="soir"
                    repasListe={planning?.jours[jour]?.soir || []}
                    onClear={(planifiedId) => handleClearRepas(jour, "soir", planifiedId)}
                    onUpdatePortions={(planifiedId, qty) => handleUpdatePortions(jour, "soir", planifiedId, qty)}
                    onAddTexte={(txt) => handleAddTexteRepas(jour, "soir", txt)}
                    colors={dayColors}
                    onShowDetails={handleShowRecipeDetails}
                  />
                </div>
              );
            })}
          </div>

          {/* 📱 VUE MOBILE : CARROUSEL HORIZONTAL */}
          <div className="md:hidden flex flex-col flex-grow justify-center pb-20">
            {/* Sélecteur de jour horizontal */}
            {(() => {
              const currentDay = joursSemaine[activeDayIdxMobile];
              const dayColors = CONFIG_COULEURS_JOURS[currentDay];
              return (
                <>
                  <div className={`flex items-center justify-between mb-6 border p-2 rounded-2xl transition-all shadow-sm bg-white ${dayColors?.bgHeader || "border-slate-200"}`}>
                    <button
                      onClick={() => setActiveDayIdxMobile((prev) => (prev > 0 ? prev - 1 : 6))}
                      className={`p-2 hover:bg-slate-100 rounded-xl transition-colors ${dayColors?.text || "text-slate-550"}`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <span className={`text-base font-extrabold capitalize tracking-wide ${dayColors?.text || "text-slate-800"}`}>
                      {currentDay}
                    </span>

                    <button
                      onClick={() => setActiveDayIdxMobile((prev) => (prev < 6 ? prev + 1 : 0))}
                      className={`p-2 hover:bg-slate-100 rounded-xl transition-colors ${dayColors?.text || "text-slate-550"}`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Carte du jour actif */}
                  <div className="space-y-4">
                    <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-5">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Repas du Midi</h4>
                      <DroppableRepasCell
                        prefix="mobile"
                        jour={currentDay}
                        moment="midi"
                        repasListe={planning?.jours[currentDay]?.midi || []}
                        onClear={(planifiedId) => handleClearRepas(currentDay, "midi", planifiedId)}
                        onUpdatePortions={(planifiedId, qty) => handleUpdatePortions(currentDay, "midi", planifiedId, qty)}
                        onAddTexte={(txt) => handleAddTexteRepas(currentDay, "midi", txt)}
                        colors={dayColors}
                        onShowDetails={handleShowRecipeDetails}
                      />
                    </div>

                    <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-5">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Repas du Soir</h4>
                      <DroppableRepasCell
                        prefix="mobile"
                        jour={currentDay}
                        moment="soir"
                        repasListe={planning?.jours[currentDay]?.soir || []}
                        onClear={(planifiedId) => handleClearRepas(currentDay, "soir", planifiedId)}
                        onUpdatePortions={(planifiedId, qty) => handleUpdatePortions(currentDay, "soir", planifiedId, qty)}
                        onAddTexte={(txt) => handleAddTexteRepas(currentDay, "soir", txt)}
                        colors={dayColors}
                        onShowDetails={handleShowRecipeDetails}
                      />
                    </div>
                  </div>
                </>
              );
            })()}
            
            {/* Quick action mobile pour ajouter des recettes rapidement par modal */}
            <div className="mt-6 flex justify-center">
              <span className="text-2xs text-slate-500 italic text-center">
                Configurez vos plannings avec Drag & Drop sur ordinateur pour un maximum de confort.
              </span>
            </div>
          </div>
        </div>

        {/* ================= PANNEAU DROIT : LISTE DE COURSES TEMPS RÉEL (PC UNIQUEMENT) ================= */}
        <div className={`hidden md:flex shrink-0 flex-col border-l border-slate-200 bg-white h-full overflow-hidden transition-all duration-300 ease-in-out ${
          isRightCollapsed ? "w-12 p-2 items-center" : "w-[25%] relative"
        }`}>
          {isRightCollapsed ? (
            <div className="flex flex-col items-center py-4 h-full gap-6 select-none w-full">
              <button
                onClick={() => setIsRightCollapsed(false)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-indigo-300 rounded-lg text-slate-500 hover:text-indigo-650 transition-all cursor-pointer"
                title="Développer la liste de courses"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div 
                className="flex flex-col items-center gap-2 text-emerald-550/80 hover:text-emerald-600 cursor-pointer group mt-2" 
                onClick={() => setIsRightCollapsed(false)}
                title="Développer la liste de courses"
              >
                <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="text-[10px] font-black uppercase tracking-widest [writing-mode:vertical-lr] rotate-180 select-none">
                  Courses
                </span>
              </div>
            </div>
          ) : (
            <ListeView onCollapse={() => setIsRightCollapsed(true)} context="planning" />
          )}
        </div>

      </div>
      <DragOverlay dropAnimation={null}>
        {activeRecipe ? (
          <div className="p-2.5 bg-white border border-slate-300 rounded-xl flex items-center gap-3 shadow-2xl opacity-95 w-[240px] pointer-events-none cursor-grabbing text-slate-800">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center border border-slate-200">
              {activeRecipe.imageUrl ? (
                <img src={activeRecipe.imageUrl} alt={activeRecipe.titre} className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="w-5 h-5 text-slate-600" />
              )}
            </div>
            <div className="flex-grow min-w-0">
              <span className="text-sm font-semibold truncate text-slate-800 capitalize block">{activeRecipe.titre}</span>
              <span className="text-3xs uppercase tracking-wider font-extrabold text-slate-450 block mt-0.5">{activeRecipe.categorie}</span>
            </div>
          </div>
        ) : activePlannedMeal ? (
          <div className="p-2.5 bg-white border border-slate-300 rounded-xl flex flex-col gap-1.5 shadow-2xl opacity-95 w-[160px] pointer-events-none cursor-grabbing text-left text-slate-800">
            <span className="text-xs font-bold text-slate-800 leading-snug break-words">
              {activePlannedMeal.texte}
            </span>
            {activePlannedMeal.type === "texte" && (
              <div>
                <span className="text-4xs text-amber-900 font-semibold uppercase tracking-wider bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 inline-block">
                  Repas rapide
                </span>
              </div>
            )}
            <div className="flex items-center justify-center gap-1 border-t border-slate-100 pt-1.5 text-slate-400">
              <span className="font-extrabold text-indigo-650 text-xs px-0.5 min-w-4 text-center">
                {activePlannedMeal.portions}
              </span>
              <Users className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-0.5" />
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {previewRecipe && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer" onClick={() => setPreviewRecipe(null)}>
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col p-6 shadow-2xl overflow-hidden cursor-default text-slate-800" onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-indigo-50 border border-indigo-150 text-indigo-750">
                  {previewRecipe.categorie}
                </span>
                <h3 className="text-lg font-bold text-slate-800 capitalize mt-1.5 leading-tight">
                  {previewRecipe.titre}
                </h3>
              </div>
              <button
                onClick={() => setPreviewRecipe(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corps */}
            <div className="flex-grow overflow-y-auto space-y-4 pr-1">
              {previewRecipe.imageUrl && (
                <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-150 shadow-xs">
                  <img src={previewRecipe.imageUrl} alt={previewRecipe.titre} className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <h4 className="text-3xs uppercase tracking-widest font-black text-slate-500 mb-2">
                  Portions par défaut
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                  <Users className="w-4 h-4 text-indigo-550" />
                  <span>{previewRecipe.portionsDefaut} personnes</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-3xs uppercase tracking-widest font-black text-slate-500 mb-3">
                  Ingrédients requis
                </h4>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-2">
                  {previewRecipe.ingredients && previewRecipe.ingredients.length > 0 ? (
                    previewRecipe.ingredients.map((ing, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100 last:border-b-0">
                        <span className="capitalize text-slate-700 font-medium">{ing.nom}</span>
                        <span className="text-indigo-650 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-150">
                          {ing.quantite > 0 ? `${ing.quantite} ` : ""}{ing.unite}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 italic text-center py-4">
                      Aucun ingrédient renseigné pour cette recette.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 pt-4 mt-4 flex">
              <button
                onClick={() => setPreviewRecipe(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold transition-all text-xs cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </DndContext>
  );
};
