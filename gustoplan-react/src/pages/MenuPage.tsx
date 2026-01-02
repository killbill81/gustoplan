import { useState, useMemo } from "react"
import { usePlans } from "@/hooks/usePlans"
import { db } from "@/lib/firebase"
import { serverTimestamp, doc, updateDoc } from "firebase/firestore"
import { usePresence } from "@/hooks/usePresence"
import { useRecipes } from "@/hooks/useRecipes"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AddEditMealModal from "@/components/add-edit-meal-modal"
import RecipePreviewModal from "@/components/recipe-preview-modal"
import CollaborationModal from "@/components/collaboration-modal"
import PlanFormModal from "@/components/plan-form-modal"
import PlanHistoryModal from "@/components/plan-history-modal"
import { ShoppingListSidebar } from "@/components/shopping-list-sidebar"
import { suggestMenu } from "@/services/smart-plan-service"
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Users,
    Calendar,
    Minus,
    Eye,
    Loader2,
    Users2,
    Zap,
    Share2,
    Wand2,
    History,
    Settings,
    Pencil,
    Trash2
} from "lucide-react"
import { cn, getWeekNumber } from "@/lib/utils"
import { Recipe } from "@/types/recipe"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import RecipeForm from "@/components/recipe-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DraggableMeal } from "@/components/draggable-meal";
import { DroppableSlot } from "@/components/droppable-slot";

export default function MenuPage() {
    const [currentWeek, setCurrentWeek] = useState<number>(getWeekNumber(new Date()))
    const { plans, currentPlan, isLoading: plansLoading, selectPlan, updatePlanWeek, createPlan, renamePlan, deletePlan } = usePlans()
    const { presences } = usePresence(currentPlan?.id)
    const { recipes, isLoading: recipesLoading, updateRecipe } = useRecipes()

    // Modal states
    const [showAddEditModal, setShowAddEditModal] = useState(false)
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const [showCollabModal, setShowCollabModal] = useState(false)
    const [showPlanModal, setShowPlanModal] = useState(false)
    const [showHistoryModal, setShowHistoryModal] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)

    // Recipe Edit State
    const [isRecipeFormOpen, setIsRecipeFormOpen] = useState(false)
    const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>(undefined)
    const [isSavingRecipe, setIsSavingRecipe] = useState(false)

    const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null)
    const [selectedMealTypeKey, setSelectedMealTypeKey] = useState<string | null>(null)
    const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0)
    const [mealToEdit, setMealToEdit] = useState<any | null>(null)
    const [recipeToPreview, setRecipeToPreview] = useState<Recipe | undefined>(undefined)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const weekData = useMemo(() => {
        return currentPlan?.weeks?.[currentWeek] || { menuData: {}, servingsData: {}, remarksData: {} }
    }, [currentPlan, currentWeek])

    const goToPreviousWeek = () => { if (currentWeek > 1) setCurrentWeek(currentWeek - 1) }
    const goToNextWeek = () => { if (currentWeek < 52) setCurrentWeek(currentWeek + 1) }

    const standardDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
    const orderedDays = useMemo(() => {
        const startDay = currentPlan?.startDay || "Lundi"
        const startIndex = standardDays.indexOf(startDay)
        const names = [...standardDays.slice(startIndex), ...standardDays.slice(0, startIndex)]
        const indices = names.map(name => standardDays.indexOf(name))
        return { names, indices }
    }, [currentPlan?.startDay])

    const categoryLabels = ["Entrée", "Plat", "Accomp.", "Dessert", "Remarque"]

    if (plansLoading || recipesLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const handleUpdateSlotServings = async (dayIndex: number, typeKey: string, delta: number) => {
        if (!currentPlan) return
        const slotKey = `${dayIndex}-${typeKey}`
        const currentVal = weekData.servingsData?.[slotKey] ?? currentPlan.defaultNumPeople
        const newVal = Math.max(1, currentVal + delta)

        const newWeekData = {
            ...weekData,
            servingsData: { ...weekData.servingsData, [slotKey]: newVal }
        }
        await updatePlanWeek(currentPlan.id, currentWeek, newWeekData)
    }

    const handleUpdateSlotRemark = async (dayIndex: number, typeKey: string, newRemark: string) => {
        if (!currentPlan) return
        const slotKey = `${dayIndex}-${typeKey}`
        const newWeekData = {
            ...weekData,
            remarksData: { ...weekData.remarksData, [slotKey]: newRemark }
        }
        await updatePlanWeek(currentPlan.id, currentWeek, newWeekData)
    }

    const handleRemoveMeal = async (dayIndex: number, typeKey: string, slotIndex: number, meal: any) => {
        if (!currentPlan || !window.confirm("Supprimer ce plat ?")) return
        const slotKey = `${dayIndex}-${typeKey}-${slotIndex}`
        const updatedSlot = (weekData.menuData?.[slotKey] || []).filter((m: any) => m.id !== meal.id)

        const newWeekData = {
            ...weekData,
            menuData: { ...weekData.menuData, [slotKey]: updatedSlot }
        }
        await updatePlanWeek(currentPlan.id, currentWeek, newWeekData)
    }

    const handleOpenAddModal = (dayIndex: number, typeKey: string, mealToEdit: any | null = null, slotIndex: number) => {
        setSelectedDayIndex(dayIndex)
        setSelectedMealTypeKey(typeKey)
        setMealToEdit(mealToEdit)
        setSelectedSlotIndex(slotIndex)
        setShowAddEditModal(true)
    }

    const handleCreatePlan = async (name: string) => {
        await createPlan(name)
    }

    const handleRenamePlan = async (name: string) => {
        if (currentPlan) await renamePlan(currentPlan.id, name)
    }

    const handleDeletePlan = async () => {
        if (currentPlan && window.confirm(`Supprimer définitivement le plan "${currentPlan.name}" ?`)) {
            await deletePlan(currentPlan.id)
        }
    }

    const handleSmartPlan = async () => {
        if (!currentPlan) return
        if (!window.confirm("Générer un menu automatique pour cette semaine ? Cela écrasera les plats existants.")) return

        setIsGenerating(true)
        try {
            await suggestMenu(currentPlan.id, currentWeek)
            // The hook usePlans will auto-sync via onSnapshot
        } catch (err) {
            console.error("Smart Plan error:", err)
            alert("Erreur lors de la génération du menu.")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleEditRecipeClick = (recipe: Recipe) => {
        setEditingRecipe(recipe)
        setIsRecipeFormOpen(true)
    }

    const handleRecipeFormSubmit = async (data: Omit<Recipe, 'id'>) => {
        setIsSavingRecipe(true)
        try {
            if (editingRecipe?.id) {
                await updateRecipe({ id: editingRecipe.id, ...data })
            }
            setIsRecipeFormOpen(false)
        } catch (e) {
            console.error("Error saving recipe", e)
        } finally {
            setIsSavingRecipe(false)
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        // querySelector or just pass data
        // Actually, active.data.current holds the meal object and source slot info if we pass it.
        const destinationSlotId = over.id as string; // e.g., "0-lunch-2"

        // We need to know:
        // 1. Source Slot (Day, Type, Index)
        // 2. The Meal Object being moved
        // 3. Dest Slot (Day, Type, Index)

        const sourceData = active.data.current as { dayIndex: number, typeKey: 'lunch' | 'dinner', slotIndex: number, meal: any };
        if (!sourceData) return;

        const { dayIndex: srcDay, typeKey: srcType, slotIndex: srcSlot, meal } = sourceData;

        // Extract dest info from ID "day-type-slot"
        const [destDayStr, destType, destSlotStr] = destinationSlotId.split('-');
        const destDay = parseInt(destDayStr);
        const destSlot = parseInt(destSlotStr);
        const destTypeKey = destType as 'lunch' | 'dinner';

        if (srcDay === destDay && srcType === destTypeKey && srcSlot === destSlot) return; // Same slot

        // Optimistic UI Update or just waiting for Firestore? Firestore is fast enough usually.
        // Logic:
        // 1. Remove from source
        // 2. Add to dest
        // 3. Update Firestore

        try {
            const planRef = doc(db, "plans", currentPlan!.id);
            const weekKey = currentWeek.toString();
            const srcKey = `${srcDay}-${srcType}-${srcSlot}`;
            const destKey = `${destDay}-${destTypeKey}-${destSlot}`;

            // Get current dest meals
            const destMeals = weekData.menuData?.[destKey] || [];

            // If we want to REPLACE the item in dest, or ADD to it?
            // User requirement: "move recipes". Usually means replace or add.
            // If dest is empty -> Add.
            // If dest has item -> Add to list (multiple items per slot supported).

            // 1. Remove from Source
            // We need to fetch current source meals to filter out THIS meal.
            const srcMeals = weekData.menuData?.[srcKey] || [];
            const newSrcMeals = srcMeals.filter((m: any) => m.id !== meal.id);

            // 2. Add to Dest
            const newDestMeals = [...destMeals, meal];

            await updateDoc(planRef, {
                [`weeks.${weekKey}.menuData.${srcKey}`]: newSrcMeals,
                [`weeks.${weekKey}.menuData.${destKey}`]: newDestMeals,
                lastUpdated: serverTimestamp()
            });

        } catch (error) {
            console.error("Error moving meal:", error);
        }
    };

    function renderSlotSection(dayIndex: number, typeKey: 'lunch' | 'dinner', baseBg: string) {
        const slotKey = `${dayIndex}-${typeKey}`
        const servings = weekData.servingsData?.[slotKey] ?? currentPlan?.defaultNumPeople
        const isCustomServings = weekData.servingsData?.[slotKey] !== undefined

        return (
            <>
                <div className={cn("flex flex-col items-center justify-center border-r gap-1 transition-colors", isCustomServings ? "bg-primary text-primary-foreground" : "bg-muted/40")}>
                    <button onClick={() => handleUpdateSlotServings(dayIndex, typeKey, 1)} className="hover:scale-125 transition-transform"><Plus className="h-3 w-3" /></button>
                    <span className="text-xs font-black">{servings}</span>
                    <button onClick={() => handleUpdateSlotServings(dayIndex, typeKey, -1)} className="hover:scale-125 transition-transform"><Minus className="h-3 w-3" /></button>
                </div>

                {[0, 1, 2, 3].map(sIdx => {
                    const slotId = `${dayIndex}-${typeKey}-${sIdx}`
                    const meals = weekData.menuData?.[slotId] || []
                    return (
                        <DroppableSlot
                            key={sIdx}
                            id={slotId}
                            className={cn("min-h-[100px] border-r p-1.5 flex flex-col gap-1.5 group hover:bg-black/5 transition-colors relative", baseBg)}
                            isOverClassName="bg-primary/20 ring-2 ring-inset ring-primary"
                        >
                            {meals.map((m: any) => {
                                const recipe = recipes.find(r => r.id === m.id)
                                const recipeName = recipe?.name || "???"
                                const dragData = { dayIndex, typeKey, slotIndex: sIdx, meal: m }
                                const draggableId = `${slotId}-${m.id}`

                                return (
                                    <DraggableMeal key={m.id} id={draggableId} data={dragData}>
                                        <div className="bg-card shadow-sm border rounded-lg p-2 text-[11px] font-bold relative group/item hover:ring-2 hover:ring-primary/20 transition-all touch-none">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="truncate pr-4 cursor-grab active:cursor-grabbing">{recipeName}</div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{recipeName}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <div className="absolute top-1 right-1 opacity-0 group-hover/item:opacity-100 flex gap-0.5">
                                                <button onClick={() => { setShowPreviewModal(true); setRecipeToPreview(recipe); }} className="hover:text-primary"><Eye className="h-3 w-3" /></button>
                                                <button onClick={() => recipe && handleEditRecipeClick(recipe)} className="hover:text-primary"><Pencil className="h-3 w-3" /></button>
                                                <button onClick={() => { handleRemoveMeal(dayIndex, typeKey, sIdx, m); }} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                                            </div>
                                        </div>
                                    </DraggableMeal>
                                )
                            })}
                            <button
                                onClick={() => handleOpenAddModal(dayIndex, typeKey, null, sIdx)}
                                className="mt-auto mx-auto h-6 w-6 rounded-full bg-primary/20 text-primary opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-white transition-all flex items-center justify-center"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </DroppableSlot>
                    )
                })}

                <div className={cn("p-1.5 border-r last:border-r-0", baseBg)}>
                    <textarea
                        className="w-full h-full text-[10px] bg-transparent border-none focus:ring-1 focus:ring-primary rounded p-1 resize-none placeholder:italic"
                        placeholder="Notes..."
                        value={weekData.remarksData?.[slotKey] || ""}
                        onChange={(e) => handleUpdateSlotRemark(dayIndex, typeKey, e.target.value)}
                    />
                </div>
            </>
        )
    }

    return (
        <TooltipProvider>
            <div className="container py-8 max-w-[1900px]">
                {/* Header with Plan Selector and Presence */}
                <div className="flex flex-col xl:flex-row items-center justify-between mb-8 gap-6">
                    <div className="flex items-center gap-6">
                        <h1 className="text-4xl font-extrabold tracking-tight">Mon Menu</h1>
                        {currentPlan && (
                            <div className="flex -space-x-2 overflow-hidden">
                                {Object.values(presences).map((p) => (
                                    <div key={p.uid} className="relative group">
                                        <img
                                            src={p.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.uid}`}
                                            className="h-8 w-8 rounded-full border-2 border-background ring-2 ring-primary/10"
                                            title={p.displayName}
                                        />
                                        <div className="absolute inset-0 rounded-full ring-2 ring-green-500 ring-offset-1 opacity-0 group-hover:opacity-100 animate-pulse pointer-events-none" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={currentPlan?.id} onValueChange={selectPlan}>
                            <SelectTrigger className="w-[240px] font-bold">
                                <SelectValue placeholder="Choisir un plan" />
                            </SelectTrigger>
                            <SelectContent>
                                {plans.map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                        <div className="flex items-center justify-between w-full">
                                            <span>{p.type === 'collaborative' ? "👥 " : "👤 "} {p.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
                            title="Créer un plan"
                            onClick={() => { setMealToEdit(null); setShowPlanModal(true); }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>

                        {currentPlan && (
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all font-bold"
                                    onClick={() => setShowCollabModal(true)}
                                >
                                    <Share2 className="h-4 w-4" /> Partager
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                                            <Settings className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem onClick={() => { setMealToEdit(currentPlan as any); setShowPlanModal(true); }}>
                                            <Pencil className="h-4 w-4 mr-2" /> Renommer
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setShowHistoryModal(true)}>
                                            <History className="h-4 w-4 mr-2" /> Historique
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleDeletePlan} className="text-destructive focus:text-destructive">
                                            <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}

                        <div className="h-10 w-px bg-border mx-2 hidden md:block" />

                        {currentPlan && (
                            <div className="flex items-center gap-2 bg-muted/40 p-1.5 rounded-full px-4 border border-border/50 shadow-sm">
                                <div className="flex items-center gap-2 pr-4 border-r border-border/50">
                                    <Calendar className="h-3.5 w-3.5 text-primary" />
                                    <select
                                        className="bg-transparent text-xs font-bold outline-none cursor-pointer"
                                        value={currentPlan.startDay}
                                        onChange={() => {/* Handle start day change */ }}
                                    >
                                        {standardDays.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 pl-2">
                                    <Users2 className="h-3.5 w-3.5 text-primary" />
                                    <span className="text-xs font-bold">{currentPlan.defaultNumPeople} pers.</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {currentPlan ? (
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
                        <div className="min-w-0">
                            <Card className="shadow-2xl border-none overflow-hidden bg-background">
                                {/* Week Navigation */}
                                <div className="flex items-center justify-between p-4 bg-muted/30 border-b">
                                    <Button variant="ghost" size="sm" onClick={goToPreviousWeek} className="font-bold">
                                        <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
                                    </Button>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-black tracking-tight uppercase">Semaine {currentWeek}</span>
                                            <span className="text-xs font-bold text-muted-foreground bg-muted p-1 px-2 rounded-md">2024</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 text-[10px] uppercase tracking-widest font-black text-primary hover:bg-primary/5 rounded-full px-4 border border-primary/20 gap-2 group"
                                            onClick={handleSmartPlan}
                                            disabled={isGenerating}
                                        >
                                            {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3 group-hover:rotate-12 transition-transform" />}
                                            {isGenerating ? "Génération..." : "Smart Plan IA"}
                                        </Button>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={goToNextWeek} className="font-bold">
                                        Suivant <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>

                                {/* Grid Header */}
                                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/20">
                                    <div className="min-w-[1000px] xl:min-w-0">
                                        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                                            <div className="grid grid-cols-[100px_45px_repeat(5,minmax(0,1fr))_45px_repeat(5,minmax(0,1fr))]">
                                                <div className="p-3"></div>
                                                <div className="col-span-6 text-center py-3 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 font-black text-xs uppercase tracking-widest border-l border-border">Midi</div>
                                                <div className="col-span-6 text-center py-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 font-black text-xs uppercase tracking-widest border-l border-border">Soir</div>

                                                {/* Labels Row */}
                                                <div className="p-2 border-t border-r flex items-center justify-center"><Users className="h-4 w-4 text-muted-foreground" /></div>
                                                <div className="bg-amber-50/50 border-t border-r"></div>
                                                {categoryLabels.map((l, i) => (
                                                    <div key={`m-${i}`} className={cn("text-[10px] font-bold text-muted-foreground uppercase text-center py-2 bg-amber-50/50 border-t border-r last:border-r-slate-300", i === 4 && "bg-amber-100/30")}>{l}</div>
                                                ))}
                                                <div className="bg-indigo-50/50 border-t border-r"></div>
                                                {categoryLabels.map((l, i) => (
                                                    <div key={`s-${i}`} className={cn("text-[10px] font-bold text-muted-foreground uppercase text-center py-2 bg-indigo-50/50 border-t border-r last:border-r-0", i === 4 && "bg-indigo-100/30")}>{l}</div>
                                                ))}
                                            </div>

                                            {/* Rows */}
                                            {orderedDays.names.map((day, idx) => {
                                                const realIndex = orderedDays.indices[idx]
                                                return (
                                                    <div key={day} className="grid grid-cols-[100px_45px_repeat(5,minmax(0,1fr))_45px_repeat(5,minmax(0,1fr))] border-t items-stretch">
                                                        <div className="bg-muted p-4 font-black text-xs text-muted-foreground text-center border-r flex items-center justify-center uppercase tracking-tighter">{day}</div>

                                                        {/* MIDI */}
                                                        {renderSlotSection(realIndex, 'lunch', 'bg-amber-50/20')}

                                                        {/* SOIR */}
                                                        {renderSlotSection(realIndex, 'dinner', 'bg-indigo-50/20')}
                                                    </div>
                                                )
                                            })}
                                        </DndContext>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Shopping List Sidebar */}
                        <div className="sticky top-24 h-[calc(100vh-8rem)]">
                            <ShoppingListSidebar planId={currentPlan.id} />
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <Zap className="h-12 w-12 mx-auto text-muted mb-4 animate-pulse" />
                        <p className="text-muted-foreground">Sélectionnez un plan pour commencer.</p>
                    </div>
                )}

                {/* Modals and Overlays */}
                {showAddEditModal && selectedDayIndex !== null && selectedMealTypeKey !== null && (
                    <AddEditMealModal
                        isOpen={showAddEditModal}
                        onClose={() => setShowAddEditModal(false)}
                        planId={currentPlan!.id}
                        currentWeek={currentWeek}
                        dayIndex={selectedDayIndex}
                        mealTypeKey={selectedMealTypeKey as any}
                        existingMeal={mealToEdit}
                        slotIndex={selectedSlotIndex}
                    />
                )}

                <RecipePreviewModal
                    isOpen={showPreviewModal}
                    onClose={() => setShowPreviewModal(false)}
                    recipe={recipeToPreview}
                />

                {currentPlan && (
                    <CollaborationModal
                        plan={currentPlan}
                        isOpen={showCollabModal}
                        onClose={() => setShowCollabModal(false)}
                    />
                )}

                <PlanFormModal
                    isOpen={showPlanModal}
                    onClose={() => { setShowPlanModal(false); setMealToEdit(null); }}
                    onSubmit={mealToEdit ? handleRenamePlan : handleCreatePlan}
                    plan={mealToEdit as any}
                />

                {currentPlan && (
                    <PlanHistoryModal
                        isOpen={showHistoryModal}
                        onClose={() => setShowHistoryModal(false)}
                        plan={currentPlan}
                    />
                )}

                {/* Recipe Edit Modal */}
                <Dialog open={isRecipeFormOpen} onOpenChange={setIsRecipeFormOpen}>
                    <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto p-0">
                        <div className="p-6">
                            <DialogHeader className="mb-4">
                                <DialogTitle>Modifier la recette</DialogTitle>
                            </DialogHeader>
                            <RecipeForm
                                initialData={editingRecipe}
                                onSubmit={handleRecipeFormSubmit}
                                onCancel={() => setIsRecipeFormOpen(false)}
                                isLoading={isSavingRecipe}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    )
}

function X(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}
