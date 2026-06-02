import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { subscribeRecettes, subscribePlanning, savePlanning, saveListeCourses, subscribeListeCourses, updateFoyerStartDay } from "../services/db";
import { genererListeCourses } from "../services/courseEngine";
import { Recette, PlanningSemaine, JourPlanning, RepasPlanifie, ElementListeCourses } from "../types";
import { DndContext, useDraggable, useDroppable, DragEndEvent, pointerWithin, DragOverlay } from "@dnd-kit/core";
import { 
  Calendar, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Users, Trash2, Edit, Plus, Heart, 
  Settings, RefreshCw, Smartphone, Monitor, BookOpen, ShoppingCart
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
    text: "text-indigo-300",
    activeText: "text-indigo-400",
    border: "border-indigo-500/25",
    borderHover: "hover:border-indigo-500/45",
    bgHeader: "bg-indigo-950/40 border-indigo-500/30",
    cellBg: "bg-indigo-950/15 border-indigo-500/10 hover:border-indigo-500/35 hover:bg-indigo-950/25",
    cellIsOver: "bg-indigo-500/25 border-indigo-400",
    glow: "shadow-[0_0_18px_rgba(129,140,248,0.25)]"
  },
  mardi: {
    text: "text-rose-300",
    activeText: "text-rose-400",
    border: "border-rose-500/25",
    borderHover: "hover:border-rose-500/45",
    bgHeader: "bg-rose-950/40 border-rose-500/30",
    cellBg: "bg-rose-950/15 border-rose-500/10 hover:border-rose-500/35 hover:bg-rose-950/25",
    cellIsOver: "bg-rose-500/25 border-rose-400",
    glow: "shadow-[0_0_18px_rgba(251,113,133,0.25)]"
  },
  mercredi: {
    text: "text-emerald-300",
    activeText: "text-emerald-400",
    border: "border-emerald-500/25",
    borderHover: "hover:border-emerald-500/45",
    bgHeader: "bg-emerald-950/40 border-emerald-500/30",
    cellBg: "bg-emerald-950/15 border-emerald-500/10 hover:border-emerald-500/35 hover:bg-emerald-950/25",
    cellIsOver: "bg-emerald-500/25 border-emerald-400",
    glow: "shadow-[0_0_18px_rgba(52,211,153,0.25)]"
  },
  jeudi: {
    text: "text-sky-300",
    activeText: "text-sky-400",
    border: "border-sky-500/25",
    borderHover: "hover:border-sky-500/45",
    bgHeader: "bg-sky-950/40 border-sky-500/30",
    cellBg: "bg-sky-950/15 border-sky-500/10 hover:border-sky-500/35 hover:bg-sky-950/25",
    cellIsOver: "bg-sky-500/25 border-sky-400",
    glow: "shadow-[0_0_18px_rgba(56,189,248,0.25)]"
  },
  vendredi: {
    text: "text-amber-300",
    activeText: "text-amber-400",
    border: "border-amber-500/25",
    borderHover: "hover:border-amber-500/45",
    bgHeader: "bg-amber-950/40 border-amber-500/30",
    cellBg: "bg-amber-950/15 border-amber-500/10 hover:border-amber-500/35 hover:bg-amber-950/25",
    cellIsOver: "bg-amber-500/25 border-amber-400",
    glow: "shadow-[0_0_18px_rgba(251,191,36,0.25)]"
  },
  samedi: {
    text: "text-fuchsia-300",
    activeText: "text-fuchsia-400",
    border: "border-fuchsia-500/25",
    borderHover: "hover:border-fuchsia-500/45",
    bgHeader: "bg-fuchsia-950/40 border-fuchsia-500/30",
    cellBg: "bg-fuchsia-950/15 border-fuchsia-500/10 hover:border-fuchsia-500/35 hover:bg-fuchsia-950/25",
    cellIsOver: "bg-fuchsia-500/25 border-fuchsia-400",
    glow: "shadow-[0_0_18px_rgba(232,121,249,0.25)]"
  },
  dimanche: {
    text: "text-teal-300",
    activeText: "text-teal-400",
    border: "border-teal-500/25",
    borderHover: "hover:border-teal-500/45",
    bgHeader: "bg-teal-950/40 border-teal-500/30",
    cellBg: "bg-teal-950/15 border-teal-500/10 hover:border-teal-500/35 hover:bg-teal-950/25",
    cellIsOver: "bg-teal-500/25 border-teal-400",
    glow: "shadow-[0_0_18px_rgba(45,212,191,0.25)]"
  }
};


// --- DRAGGABLE RECIPE COMPONENT ---
interface DraggableRecipeProps {
  recette: Recette;
}

const DraggableRecipe: React.FC<DraggableRecipeProps> = ({ recette }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `recipe_${recette.id}`,
    data: { recette }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-2.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/50 rounded-xl cursor-grab active:cursor-grabbing transition-all flex items-center gap-3 ${
        isDragging ? "opacity-25 border-dashed border-violet-500 bg-slate-900/60 shadow-none" : "shadow-md hover:border-slate-600"
      }`}
    >
      {/* Mini-image de recette ou icône par défaut */}
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900 shrink-0 flex items-center justify-center border border-slate-750">
        {recette.imageUrl ? (
          <img src={recette.imageUrl} alt={recette.titre} className="w-full h-full object-cover" />
        ) : (
          <BookOpen className="w-5 h-5 text-slate-600" />
        )}
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-center gap-1">
          <span className="text-sm font-semibold truncate text-white capitalize">{recette.titre}</span>
          {recette.favori && <Heart className="w-3.5 h-3.5 fill-fuchsia-500 text-fuchsia-500 shrink-0" />}
        </div>
        <div className="flex items-center justify-between mt-1 text-3xs uppercase tracking-wider font-extrabold text-slate-400">
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

  return (
    <div
      ref={setNodeRef}
      className={`min-h-24 p-2.5 rounded-2xl border transition-all duration-200 flex flex-col gap-2 ${
        isOver
          ? `${colors.cellIsOver} ${colors.glow} scale-[1.02]`
          : listAsArray.length > 0
          ? `${colors.bgHeader} ${colors.borderHover}`
          : `${colors.cellBg}`
      }`}
    >
      <div className="flex justify-between items-center pb-1 border-b border-slate-850/65">
        <span className={`text-3xs uppercase tracking-widest font-extrabold ${colors.text}`}>{moment}</span>
        {!showInput && (
          <button
            onClick={() => setShowInput(true)}
            className={`p-0.5 rounded transition-colors ${colors.text} hover:text-violet-400`}
            title="Ajouter un repas rapide"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex-grow flex flex-col gap-2">
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
          />
        ))}

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
              className="flex-grow bg-slate-850 border border-slate-750 rounded-lg px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
            <button type="submit" className="bg-violet-600 hover:bg-violet-500 px-2 py-1 rounded-lg text-xs font-semibold">OK</button>
            <button type="button" onClick={() => setShowInput(false)} className="bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg text-xs text-slate-300">X</button>
          </form>
        )}
      </div>
    </div>
  );
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
}

const DraggablePlannedMeal: React.FC<DraggablePlannedMealProps> = ({
  prefix,
  repas,
  jour,
  moment,
  onClear,
  onUpdatePortions,
  colors,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${prefix}_planned_${repas.planifiedId}`,
    data: { repas, sourceJour: jour, sourceMoment: moment }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`bg-slate-950/45 p-2 rounded-xl border border-slate-850/60 flex flex-col gap-1.5 cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? "opacity-20 border-dashed border-violet-500 bg-slate-900/60 shadow-none" : "hover:border-slate-750/80"
      }`}
    >
      <div className="flex justify-between items-start gap-1">
        <span className="text-xs font-bold text-white leading-snug break-words flex-grow">
          {repas.texte}
        </span>
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onClear(repas.planifiedId);
          }}
          className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {repas.type === "texte" && (
        <div>
          <span className="text-4xs text-slate-400 font-semibold uppercase tracking-wider bg-slate-850 px-1.5 py-0.5 rounded border border-slate-800 inline-block">
            Repas rapide
          </span>
        </div>
      )}

      <div 
        className="flex items-center justify-center gap-1 border-t border-slate-850/40 pt-1.5 text-slate-500"
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
          className="p-0.5 hover:bg-slate-850 hover:text-violet-400 rounded transition-colors text-slate-550"
          title="Diminuer les portions"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        
        <span className={`font-extrabold ${colors.activeText} text-xs px-0.5 min-w-4 text-center`}>
          {repas.portions}
        </span>
        
        <Users className="w-3.5 h-3.5 text-slate-550 shrink-0 mr-0.5" />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUpdatePortions(repas.planifiedId, repas.portions + 1);
          }}
          className="p-0.5 hover:bg-slate-850 hover:text-violet-400 rounded transition-colors text-slate-550"
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
  const [activeRecipe, setActiveRecipe] = useState<Recette | null>(null);
  const [activePlannedMeal, setActivePlannedMeal] = useState<RepasPlanifie | null>(null);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  
  // Onglet recettes filtre
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [search, setSearch] = useState("");

  // Mobile Swipe Jours
  const [activeDayIdxMobile, setActiveDayIdxMobile] = useState(0);

  // Charger recettes + planning
  useEffect(() => {
    if (!foyer?.id) return;
    const unsubRecettes = subscribeRecettes(foyer.id, setRecettes);
    const unsubPlanning = subscribePlanning(foyer.id, setPlanning);
    const unsubListe = subscribeListeCourses(foyer.id, setListeCourses);
    return () => {
      unsubRecettes();
      unsubPlanning();
      unsubListe();
    };
  }, [foyer?.id]);

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
    const nouvelleListe = genererListeCourses(nouveauPlanning, recettes, listeCourses);
    await saveListeCourses(foyer.id, nouvelleListe);
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

    const overId = over.id as string; // format: cell_prefix_jour_moment
    if (!overId.startsWith("cell_")) return;

    const parts = overId.split("_");
    const targetJour = parts[2];
    const targetMoment = parts[3] as "midi" | "soir";

    const activeData = active.data.current;
    if (!activeData) return;

    let repasPlanifie: RepasPlanifie;

    // Cas 1: Provenance panneau gauche des recettes (contient recette)
    if (activeData.recette) {
      const r: Recette = activeData.recette;
      repasPlanifie = {
        planifiedId: `${r.id}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        type: "recette",
        id: r.id,
        texte: r.titre,
        portions: r.portionsDefaut || 4
      };
    } 
    // Cas 2: Provenance d'un jour existant du planning (glisser-déposer interne)
    else if (activeData.repas) {
      repasPlanifie = activeData.repas;
      const sourceJour = activeData.sourceJour;
      const sourceMoment = activeData.sourceMoment as "midi" | "soir";

      // Si c'est déposé sur la même case, ne rien faire
      if (sourceJour === targetJour && sourceMoment === targetMoment) {
        return;
      }

      // Retirer du jour source
      const currentSourceList = planning.jours[sourceJour]?.[sourceMoment] || [];
      const sourceListAsArray = Array.isArray(currentSourceList) ? currentSourceList : (currentSourceList ? [currentSourceList] : []);
      const updatedSourceList = sourceListAsArray.filter((repas) => repas.planifiedId !== repasPlanifie.planifiedId);
      
      planning.jours[sourceJour][sourceMoment] = updatedSourceList;
    } else {
      return;
    }

    // Ajouter au jour de destination
    const currentTargetList = planning.jours[targetJour]?.[targetMoment] || [];
    const targetListAsArray = Array.isArray(currentTargetList) ? currentTargetList : (currentTargetList ? [currentTargetList] : []);
    const updatedTargetList = [...targetListAsArray, repasPlanifie];

    const planningModifie = {
      ...planning,
      jours: {
        ...planning.jours,
        [targetJour]: {
          ...planning.jours[targetJour],
          [targetMoment]: updatedTargetList
        }
      }
    };

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
    await declencherMiseAJourListe(planningVide);
  };

  // Filtrer les recettes du panneau latéral
  const filteredRecettesPanneau = recettes.filter((r) => {
    const matchesSearch = r.titre.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || r.categorie === categoryFilter;
    const matchesFav = !onlyFavs || r.favori;
    return matchesSearch && matchesCategory && matchesFav;
  });

  const sortedRecettesPanneau = [...filteredRecettesPanneau].sort((a, b) => {
    if (a.favori && !b.favori) return -1;
    if (!a.favori && b.favori) return 1;
    return a.titre.localeCompare(b.titre, "fr", { sensitivity: "base" });
  });

  return (
    <DndContext collisionDetection={pointerWithin} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
      <div className="h-[calc(100vh-73px)] flex flex-col md:flex-row bg-slate-950 text-white overflow-hidden">
        
        {/* ================= PANNEAU GAUCHE : RECETTES (PC UNIQUEMENT) ================= */}
        <div className={`hidden md:flex shrink-0 flex-col border-r border-slate-900 bg-slate-950 h-full overflow-hidden transition-all duration-300 ease-in-out ${
          isLeftCollapsed ? "w-12 p-2 items-center" : "w-[22%] p-4"
        }`}>
          {isLeftCollapsed ? (
            <div className="flex flex-col items-center py-4 h-full gap-6 select-none w-full">
              <button
                onClick={() => setIsLeftCollapsed(false)}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-violet-500/50 rounded-lg text-slate-400 hover:text-violet-400 transition-all cursor-pointer"
                title="Développer les recettes"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div 
                className="flex flex-col items-center gap-2 text-violet-400/80 hover:text-violet-400 cursor-pointer group mt-2" 
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
                <h3 className="text-base font-bold flex items-center gap-2 text-violet-400">
                  <BookOpen className="w-4 h-4" /> Recettes
                </h3>
                <button
                  onClick={() => setIsLeftCollapsed(true)}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-violet-500/50 rounded-lg text-slate-400 hover:text-violet-400 transition-all cursor-pointer"
                  title="Réduire les recettes"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 mb-4"
              />

              <div className="flex gap-1.5 mb-3">
                {["all", "entree", "plat", "dessert"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`flex-grow py-1 px-1 rounded-lg text-4xs font-extrabold uppercase border tracking-wider transition-all ${
                      categoryFilter === cat
                        ? "bg-violet-600/20 border-violet-500/50 text-violet-400"
                        : "bg-slate-900 border-slate-850 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {cat === "all" ? "Toutes" : cat.slice(0, 3)}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setOnlyFavs(!onlyFavs)}
                className={`w-full py-2 px-3 rounded-lg border text-2xs font-semibold mb-4 flex items-center justify-center gap-1.5 transition-all ${
                  onlyFavs
                    ? "bg-fuchsia-600/10 border-fuchsia-500/30 text-fuchsia-400"
                    : "bg-slate-900 border-slate-850 text-slate-500 hover:text-slate-300"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${onlyFavs ? "fill-fuchsia-500 text-fuchsia-500" : ""}`} />
                Favoris
              </button>

              {/* Liste draggable */}
              <div className="flex-grow overflow-y-auto space-y-2.5 pr-1">
                {sortedRecettesPanneau.map((recette) => (
                  <DraggableRecipe key={recette.id} recette={recette} />
                ))}
                {sortedRecettesPanneau.length === 0 && (
                  <div className="text-xs text-slate-600 text-center py-6">Aucune recette</div>
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
              <h2 className="text-xl font-extrabold flex items-center gap-2 text-white">
                <Calendar className="text-violet-500" />
                Mon Planning
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400">
                <span>Foyer : <span className="font-semibold text-white">{foyer?.nom}</span> ({foyer?.codeFoyer})</span>
                <span className="hidden sm:inline text-slate-700">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">1er jour :</span>
                  <select
                    value={foyer?.jourDebutSemaine !== undefined ? foyer.jourDebutSemaine : 1}
                    onChange={async (e) => {
                      if (foyer?.id) {
                        await updateFoyerStartDay(foyer.id, parseInt(e.target.value));
                        await refreshFoyer();
                      }
                    }}
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-3xs font-black text-violet-400 focus:outline-none focus:border-violet-500 uppercase tracking-wider"
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
              className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 rounded-xl text-xs font-bold transition-all active:scale-98"
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
                  <div className={`text-center py-2 border rounded-xl transition-all ${dayColors?.bgHeader || "bg-slate-900 border-slate-800"}`}>
                    <span className={`text-xs font-black capitalize tracking-wide ${dayColors?.text || "text-slate-300"}`}>{jour}</span>
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
                  <div className={`flex items-center justify-between mb-6 border p-2 rounded-2xl transition-all ${dayColors?.bgHeader || "bg-slate-900/60 border-slate-850"}`}>
                    <button
                      onClick={() => setActiveDayIdxMobile((prev) => (prev > 0 ? prev - 1 : 6))}
                      className={`p-2 hover:bg-slate-800 rounded-xl transition-colors ${dayColors?.text || "text-slate-400"}`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <span className={`text-base font-extrabold capitalize tracking-wide ${dayColors?.text || "text-white"}`}>
                      {currentDay}
                    </span>

                    <button
                      onClick={() => setActiveDayIdxMobile((prev) => (prev < 6 ? prev + 1 : 0))}
                      className={`p-2 hover:bg-slate-800 rounded-xl transition-colors ${dayColors?.text || "text-slate-400"}`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Carte du jour actif */}
                  <div className="space-y-4">
                    <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-5">
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
                      />
                    </div>

                    <div className="bg-slate-900/40 border border-slate-850 rounded-3xl p-5">
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
        <div className={`hidden md:flex shrink-0 flex-col border-l border-slate-900 bg-slate-950 h-full overflow-hidden transition-all duration-300 ease-in-out ${
          isRightCollapsed ? "w-12 p-2 items-center" : "w-[25%] relative"
        }`}>
          {isRightCollapsed ? (
            <div className="flex flex-col items-center py-4 h-full gap-6 select-none w-full">
              <button
                onClick={() => setIsRightCollapsed(false)}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-violet-500/50 rounded-lg text-slate-400 hover:text-violet-400 transition-all cursor-pointer"
                title="Développer la liste de courses"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div 
                className="flex flex-col items-center gap-2 text-emerald-400/80 hover:text-emerald-400 cursor-pointer group mt-2" 
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
            <ListeView onCollapse={() => setIsRightCollapsed(true)} />
          )}
        </div>

      </div>
      <DragOverlay dropAnimation={null}>
        {activeRecipe ? (
          <div className="p-2.5 bg-slate-800 border border-slate-650 rounded-xl flex items-center gap-3 shadow-2xl opacity-90 w-[240px] pointer-events-none cursor-grabbing">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900 shrink-0 flex items-center justify-center border border-slate-750">
              {activeRecipe.imageUrl ? (
                <img src={activeRecipe.imageUrl} alt={activeRecipe.titre} className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="w-5 h-5 text-slate-600" />
              )}
            </div>
            <div className="flex-grow min-w-0">
              <span className="text-sm font-semibold truncate text-white capitalize block">{activeRecipe.titre}</span>
              <span className="text-3xs uppercase tracking-wider font-extrabold text-slate-400 block mt-0.5">{activeRecipe.categorie}</span>
            </div>
          </div>
        ) : activePlannedMeal ? (
          <div className="p-2.5 bg-slate-800 border border-slate-650 rounded-xl flex flex-col gap-1.5 shadow-2xl opacity-95 w-[160px] pointer-events-none cursor-grabbing text-left">
            <span className="text-xs font-bold text-white leading-snug break-words">
              {activePlannedMeal.texte}
            </span>
            {activePlannedMeal.type === "texte" && (
              <div>
                <span className="text-4xs text-slate-400 font-semibold uppercase tracking-wider bg-slate-850 px-1.5 py-0.5 rounded border border-slate-800 inline-block">
                  Repas rapide
                </span>
              </div>
            )}
            <div className="flex items-center justify-center gap-1 border-t border-slate-850/40 pt-1.5 text-slate-500">
              <span className="font-extrabold text-violet-400 text-xs px-0.5 min-w-4 text-center">
                {activePlannedMeal.portions}
              </span>
              <Users className="w-3.5 h-3.5 text-slate-550 shrink-0 mr-0.5" />
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
