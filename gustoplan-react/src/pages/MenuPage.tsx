import React, { useState, useEffect, useMemo } from "react"
import { auth, db } from "@/lib/firebase"
import { collection, query, where, onSnapshot, doc, or, updateDoc, arrayRemove, addDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card" // Removed CardContent, CardHeader
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import AddEditMealModal from "@/components/add-edit-meal-modal"
import RecipePreviewModal from "@/components/recipe-preview-modal"
import RecipeForm, { RecipeData } from "@/components/recipe-form"
import { ChevronLeft, ChevronRight, Plus, Users, Calendar, Minus, MoreHorizontal, Eye, Pencil, Trash2, Heart, Settings2 } from "lucide-react"
import { cn } from "@/lib/utils"

function getWeekNumber(d: Date) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  var weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
}

export default function MenuPage() {
  const [currentWeek, setCurrentWeek] = useState<number>(getWeekNumber(new Date()))
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  const [userPlans, setUserPlans] = useState<any[]>([])
  const [currentPlanData, setCurrentPlanData] = useState<any>(null)
  const [weekData, setWeekData] = useState<any>(null)
  const [availableRecipes, setAvailableRecipes] = useState<any[]>([]) 

  // Modal states
  const [showAddEditModal, setShowAddEditModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showRecipeEditModal, setShowRecipeEditModal] = useState(false) // New: Global recipe edit
  
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null)
  const [selectedMealTypeKey, setSelectedMealTypeKey] = useState<string | null>(null)
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0)
  const [mealToEdit, setMealToEdit] = useState<any | null>(null) // Meal in plan (ref)
  const [recipeToPreview, setRecipeToPreview] = useState<any | null>(null) // Full recipe for preview
  const [recipeToEditGlobal, setRecipeToEditGlobal] = useState<RecipeData | undefined>(undefined) // Full recipe for global edit

  // Fetch user plans
  useEffect(() => {
    const currentUser = auth.currentUser
    if (!currentUser) return

    const q = query(
      collection(db, "plans"),
      or(
        where("userId", "==", currentUser.uid),
        where("collaborators", "array-contains", currentUser.uid)
      )
    )
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plans = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setUserPlans(plans)
      if (plans.length > 0) setSelectedPlanId((prev) => prev || plans[0].id)
    })
    return () => unsubscribe()
  }, [])

  // Fetch recipes
  useEffect(() => {
    const q = query(collection(db, "recipes"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAvailableRecipes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    })
    return () => unsubscribe()
  }, [])

  // Fetch plan details
  useEffect(() => {
    if (!selectedPlanId) return
    const unsubscribe = onSnapshot(doc(db, "plans", selectedPlanId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        setCurrentPlanData(data)
        const weeks = data.weeks || {}
        const weekKey = Object.keys(weeks).find(k => k == currentWeek.toString())
        setWeekData(weekKey ? weeks[weekKey] : { menuData: {}, servingsData: {}, remarksData: {} })
      }
    })
    return () => unsubscribe()
  }, [selectedPlanId, currentWeek])

  const goToPreviousWeek = () => { if (currentWeek > 1) setCurrentWeek(currentWeek - 1) }
  const goToNextWeek = () => { if (currentWeek < 52) setCurrentWeek(currentWeek + 1) }

  // --- Dynamic Days Logic ---
  const standardDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
  const standardDayIndices = [0, 1, 2, 3, 4, 5, 6];

  const orderedDays = useMemo(() => {
      const startDay = currentPlanData?.startDay || "Lundi";
      const startIndex = standardDays.indexOf(startDay);
      if (startIndex === -1) return { names: standardDays, indices: standardDayIndices };

      const names = [...standardDays.slice(startIndex), ...standardDays.slice(0, startIndex)];
      const indices = [...standardDayIndices.slice(startIndex), ...standardDayIndices.slice(0, startIndex)];
      return { names, indices };
  }, [currentPlanData?.startDay]);

  const mealTypeMap: Record<string, string> = { "Midi": "lunch", "Soir": "dinner" }
  const categoryLabels = ["Entrée", "Plat", "Accomp.", "Dessert", "Remarque"];
  const midiBgColor = "bg-secondary";
  const soirBgColor = "bg-muted/30";

  const handleUpdatePlanSettings = async (field: string, value: any) => {
      if (!selectedPlanId) return;
      try {
          await updateDoc(doc(db, "plans", selectedPlanId), {
              [field]: value,
              lastUpdated: new Date()
          });
      } catch (e) { console.error("Error updating plan settings", e); }
  };

  const handleUpdateSlotServings = async (dayIndex: number, typeKey: string, delta: number) => {
      if (!selectedPlanId) return;
      const slotKey = `${dayIndex}-${typeKey}`;
      const weekKey = currentWeek.toString();
      const currentVal = weekData?.servingsData?.[slotKey] !== undefined ? weekData.servingsData[slotKey] : (currentPlanData?.defaultNumPeople || 1); 
      const defaultVal = currentPlanData?.defaultNumPeople || 1;
      const val = currentVal !== undefined ? currentVal : defaultVal; 
      
      const newVal = Math.max(1, val + delta);
      try {
          await updateDoc(doc(db, "plans", selectedPlanId), { [`weeks.${weekKey}.servingsData.${slotKey}`]: newVal, lastUpdated: new Date() });
      } catch (e) { console.error("Error updating slot servings", e); }
  };

  const handleUpdateSlotRemark = async (dayIndex: number, typeKey: string, newRemark: string) => {
      if (!selectedPlanId) return;
      const slotKey = `${dayIndex}-${typeKey}`;
      const weekKey = currentWeek.toString();
      try {
          await updateDoc(doc(db, "plans", selectedPlanId), { [`weeks.${weekKey}.remarksData.${slotKey}`]: newRemark, lastUpdated: new Date() });
      } catch (e) { console.error("Error updating slot remark", e); }
  };

  const handleRemoveMeal = async (dayIndex: number, typeKey: string, slotIndex: number, meal: any) => {
      if (!selectedPlanId || !window.confirm("Supprimer ce plat du planning ?")) return;
      const slotKey = `${dayIndex}-${typeKey}-${slotIndex}`;
      const weekKey = currentWeek.toString();
      try {
          await updateDoc(doc(db, "plans", selectedPlanId), {
              [`weeks.${weekKey}.menuData.${slotKey}`]: arrayRemove(meal),
              lastUpdated: new Date()
          });
      } catch (e) { console.error("Error removing meal", e); }
  }

  const handleToggleFavorite = async (recipe: any) => {
      if (!recipe || !recipe.id) return;
      try {
          await updateDoc(doc(db, "recipes", recipe.id), { isFavorite: !recipe.isFavorite });
      } catch (e) { console.error("Error toggling favorite", e); }
  }

  const handleRecipeUpdate = async (data: RecipeData) => {
      try {
          if (recipeToEditGlobal?.id) {
              await updateDoc(doc(db, "recipes", recipeToEditGlobal.id), data as any);
          }
          setShowRecipeEditModal(false);
      } catch (e) {
          console.error("Error updating recipe", e);
          alert("Erreur lors de la mise à jour de la recette.");
      }
  };

  const handleOpenAddModal = (dayIndex: number, typeKey: string, mealToEdit: any | null = null, slotIndex?: number) => {
    if (!selectedPlanId) return;
    setSelectedDayIndex(dayIndex);
    setSelectedMealTypeKey(typeKey);
    setMealToEdit(mealToEdit);
    if (slotIndex !== undefined) setSelectedSlotIndex(slotIndex);
    setShowAddEditModal(true);
  };

  const getMealSlotContent = (dayIndex: number, typeKey: string) => {
    const groupedMeals: Record<string, any[]> = {
        "ENTREE": [],
        "PLAT": [],
        "ACCOMPAGNEMENT": [],
        "DESSERT": [],
        "AUTRE": [] 
    };

    if (weekData && weekData.menuData) {
        for (let slot = 0; slot <= 4; slot++) { 
            const key = `${dayIndex}-${typeKey}-${slot}`
            const meals = weekData.menuData[key]
            if (meals && Array.isArray(meals)) {
                meals.forEach((meal: any) => {
                    const recipe = availableRecipes.find(r => r.id === meal.id) || meal;
                    const cat = recipe.category ? recipe.category.toUpperCase() : "AUTRE";
                    if (groupedMeals[cat]) {
                        groupedMeals[cat].push({ ...meal, recipeName: recipe.name, recipeCategory: cat, slotIndex: slot });
                    } else {
                        groupedMeals["AUTRE"].push({ ...meal, recipeName: recipe.name, recipeCategory: cat, slotIndex: slot });
                    }
                });
            }
        }
    }
    
    const slotRemark = weekData?.remarksData?.[`${dayIndex}-${typeKey}`] || "";

    return { groupedMeals, slotRemark };
  }

  const getMealContent = (dayIndex: number, typeKey: string, slotIndex: number) => {
    const key = `${dayIndex}-${typeKey}-${slotIndex}`;
    const meals = weekData?.menuData?.[key];
    
    if (meals && Array.isArray(meals) && meals.length > 0) {
        return meals.map((meal: any, idx: number) => {
            const recipe = availableRecipes.find(r => r.id === meal.id) || meal;
            const fullRecipe = availableRecipes.find(r => r.id === meal.id);

            return (
                <div 
                    key={meal.id + "-" + idx} 
                    className="relative bg-card text-card-foreground border border-border rounded-md p-2 shadow-sm mb-1 last:mb-0 cursor-pointer hover:shadow-md transition-shadow group"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAddModal(dayIndex, typeKey, meal, slotIndex);
                    }}
                >
                    <div className="w-full text-xs font-medium text-foreground truncate px-1" title={recipe.name}>
                        {recipe.name || "Plat sans nom"}
                    </div>
                    
                    {/* Favorite Button: Top right, overflowing */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleFavorite(fullRecipe || recipe); }}
                        className={cn(
                            "absolute -top-2 -right-2 p-1.5 rounded-full bg-background border border-border shadow-sm transition-colors z-10",
                            (fullRecipe?.isFavorite || recipe.isFavorite) ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500"
                        )}
                        title={ (fullRecipe?.isFavorite || recipe.isFavorite) ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                        <Heart className={cn("h-3 w-3 transition-transform active:scale-95", (fullRecipe?.isFavorite || recipe.isFavorite) && "fill-current")} />
                    </button>

                    {/* Remove Button (Cross): Top left, overflowing */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleRemoveMeal(dayIndex, typeKey, slotIndex, meal); }}
                        className="absolute -top-2 -left-2 p-1.5 rounded-full bg-background border border-border shadow-sm text-destructive hover:bg-destructive/10 transition-colors z-10"
                        title="Retirer ce plat du menu"
                    >
                        <Trash2 className="h-3 w-3" />
                    </button>

                    {/* Actions Menu Trigger (MoreHorizontal) */}
                    <div className="absolute top-1 right-1" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 z-50">
                                <DropdownMenuItem onClick={() => { setRecipeToPreview(fullRecipe || recipe); setShowPreviewModal(true); }}>
                                    <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground" /> Voir la fiche
                                </DropdownMenuItem>
                                {fullRecipe && (
                                    <DropdownMenuItem onClick={() => { setRecipeToEditGlobal(fullRecipe); setShowRecipeEditModal(true); }}>
                                        <Pencil className="mr-2 h-3.5 w-3.5 text-blue-500" /> Modifier la recette
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleOpenAddModal(dayIndex, typeKey, meal, slotIndex)}>
                                    <Settings2 className="mr-2 h-3.5 w-3.5 text-orange-500" /> Ajuster ce repas
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleRemoveMeal(dayIndex, typeKey, slotIndex, meal)}>
                                    <Trash2 className="mr-2 h-3.5 w-3.5" /> Retirer du menu
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            );
        });
    }
    return null;
  }

  const renderRowSection = (realDayIndex: number, typeKey: string, bgColorClass: string) => {
      const slotServingsKey = `${realDayIndex}-${typeKey}`;
      const slotServings = weekData?.servingsData?.[slotServingsKey];
      const defaultPlanServings = currentPlanData?.defaultNumPeople || 1;
      const displayServings = slotServings !== undefined ? slotServings : defaultPlanServings;
      const isOverridden = slotServings !== undefined && slotServings !== defaultPlanServings;
      const servingsColClass = isOverridden ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground";

      return (
          <React.Fragment>
            <div className={`flex flex-col items-center justify-center border-r border-border p-1 gap-1 ${servingsColClass}`}>
                <button onClick={() => handleUpdateSlotServings(realDayIndex, typeKey, 1)} className="hover:opacity-75 p-0.5"><Plus className="h-3 w-3" /></button>
                <span className="text-xs font-bold">{displayServings}</span>
                <button onClick={() => handleUpdateSlotServings(realDayIndex, typeKey, -1)} className="hover:opacity-75 p-0.5"><Minus className="h-3 w-3" /></button>
            </div>

            {[0, 1, 2, 3].map(slotIndex => {
                const mealsContent = getMealContent(realDayIndex, typeKey, slotIndex);
                return (
                    <div key={`${typeKey}-${slotIndex}`} className={`p-1 border-r border-border/50 flex flex-col items-center justify-start gap-1 min-h-[80px] group transition-colors ${bgColorClass} hover:bg-black/5 w-full overflow-hidden`}>
                        {mealsContent ? (
                            <div className="w-full flex flex-col gap-1">
                                {mealsContent}
                                <div className="h-5 w-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto mt-1 cursor-pointer hover:bg-primary transition-colors" onClick={() => handleOpenAddModal(realDayIndex, typeKey, null, slotIndex)}>
                                    <Plus className="h-3 w-3" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex-grow w-full flex items-center justify-center">
                                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 shadow-sm transition-transform hover:scale-110" onClick={() => handleOpenAddModal(realDayIndex, typeKey, null, slotIndex)}>
                                    <Plus className="h-4 w-4" />
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            <div className={`p-1 border-r border-border flex flex-col min-h-[80px] ${bgColorClass}`}>
                <textarea 
                    className="w-full h-full text-[10px] bg-card text-card-foreground border border-border focus:border-primary rounded resize-none focus:outline-none p-1 placeholder:text-muted-foreground"
                    placeholder="Remarque..."
                    value={weekData?.remarksData?.[`${realDayIndex}-${typeKey}`] || ""}
                    onChange={(e) => handleUpdateSlotRemark(realDayIndex, typeKey, e.target.value)}
                />
            </div>
          </React.Fragment>
      );
  }

  const gridTemplateCols = "100px 40px repeat(5, minmax(0, 1fr)) 40px repeat(5, minmax(0, 1fr))";

  return (
    <div className="container mx-auto py-8">
      {/* ... Header Controls ... */}
      <div className="flex flex-col xl:flex-row items-start justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Mon Menu</h1>
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {userPlans.length > 0 && (
            <div className="flex items-center gap-2">
                <Select onValueChange={setSelectedPlanId} value={selectedPlanId}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Sélectionner un plan">
                    {userPlans.find(p => p.id === selectedPlanId)?.name || "Sélectionner un plan"}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {userPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
                <Button variant="outline" size="icon" title="Créer un plan"><Plus className="h-4 w-4" /></Button>
            </div>
          )}
          {currentPlanData && (
              <div className="flex items-center gap-4 bg-muted/20 p-2 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="start-day" className="text-xs whitespace-nowrap">Début:</Label>
                      <select id="start-day" className="h-8 w-24 rounded-md border border-input bg-background px-2 text-xs" value={currentPlanData.startDay || "Lundi"} onChange={(e) => handleUpdatePlanSettings("startDay", e.target.value)}>
                          {standardDays.map(day => <option key={day} value={day}>{day}</option>)}
                      </select>
                  </div>
                  <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="default-people" className="text-xs whitespace-nowrap">Pers:</Label>
                      <Input id="default-people" type="number" className="h-8 w-16 text-center text-xs" value={currentPlanData.defaultNumPeople || 1} onChange={(e) => handleUpdatePlanSettings("defaultNumPeople", parseInt(e.target.value) || 1)} min={1} />
                  </div>
              </div>
          )}
        </div>
      </div>

      {selectedPlanId ? (
        <Card className="mb-6 border-none shadow-none bg-transparent">
          <div className="flex flex-row items-center justify-center py-4 gap-4 bg-card rounded-t-xl border border-b-0 border-border">
            <Button variant="outline" size="icon" onClick={goToPreviousWeek} disabled={currentWeek <= 1}><ChevronLeft className="h-4 w-4" /></Button>
            <div className="flex items-center space-x-2">
                <CardTitle className="text-center text-lg md:text-xl font-semibold">Semaine {currentWeek}</CardTitle>
                <Input type="number" className="w-16 h-8 text-center" value={currentWeek} onChange={(e) => setCurrentWeek(parseInt(e.target.value) || 1)} min={1} max={52} />
            </div>
            <Button variant="outline" size="icon" onClick={goToNextWeek} disabled={currentWeek >= 52}><ChevronRight className="h-4 w-4" /></Button>
          </div>
          
          <div className="overflow-x-auto bg-card border border-border rounded-b-xl">
            <div className="min-w-[1400px]">
              {/* --- MAIN HEADERS --- */}
              <div className="grid border-b border-border" style={{ gridTemplateColumns: gridTemplateCols }}>
                <div className="bg-card"></div>
                <div className={`col-span-6 text-center font-bold py-2 bg-orange-50 dark:bg-orange-950/20 border-r border-border text-foreground`}>MIDI</div>
                <div className={`col-span-6 text-center font-bold py-2 bg-slate-100 dark:bg-slate-900/30 text-foreground`}>SOIR</div>
              </div>

              {/* --- SUB HEADERS --- */}
              <div className="grid border-b border-border" style={{ gridTemplateColumns: gridTemplateCols }}>
                <div className="flex justify-center items-center p-2 bg-muted/50 border-r border-border"><Users className="h-4 w-4 text-muted-foreground" /></div>
                <div className={`flex justify-center items-center p-1 border-r border-border bg-orange-50 dark:bg-orange-950/20`}></div>
                {categoryLabels.map((label, i) => (<div key={`m-${i}`} className={cn("text-center text-xs font-semibold text-muted-foreground p-2 border-r border-border/50 bg-orange-50 dark:bg-orange-950/20", i===4 && 'border-r border-border')}>{label}</div>))}
                <div className={`flex justify-center items-center p-1 border-r border-border bg-slate-100 dark:bg-slate-900/30`}></div>
                {categoryLabels.map((label, i) => (<div key={`s-${i}`} className={cn("text-center text-xs font-semibold text-muted-foreground p-2 border-r border-border/50 bg-slate-100 dark:bg-slate-900/30", i===4 && 'border-r-0')}>{label}</div>))}
              </div>

              {/* --- DAY ROWS --- */}
              {orderedDays.names.map((day, idx) => {
                  const realDayIndex = orderedDays.indices[idx];
                  return (
                    <div key={day} className="grid items-stretch border-b border-border last:border-b-0" style={{ gridTemplateColumns: gridTemplateCols }}>
                        <div className="font-bold flex items-center justify-center bg-muted/50 text-foreground text-sm border-r border-border py-4 uppercase">{day}</div>
                        {renderRowSection(realDayIndex, "lunch", "bg-orange-50 dark:bg-orange-950/20")}
                        {renderRowSection(realDayIndex, "dinner", "bg-slate-100 dark:bg-slate-900/30")}
                    </div>
                  );
              })}
            </div>
          </div>
        </Card>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
            Chargement des plans...
        </div>
      )}

      {showAddEditModal && selectedPlanId && selectedDayIndex !== null && selectedMealTypeKey !== null && (
        <AddEditMealModal
          isOpen={showAddEditModal}
          onClose={() => setShowAddEditModal(false)}
          planId={selectedPlanId}
          currentWeek={currentWeek}
          dayIndex={selectedDayIndex}
          mealTypeKey={mealTypeKey}
          existingMeal={mealToEdit}
          existingSlotMeals={weekData?.menuData?.[`${selectedDayIndex}-${mealTypeMap[selectedMealTypeKey]}-${selectedSlotIndex}`] || []}
          defaultServings={weekData?.servingsData?.[`${selectedDayIndex}-${mealTypeMap[selectedMealTypeKey]}`] || currentPlanData?.defaultNumPeople || 1}
          slotIndex={selectedSlotIndex}
        />
      )}

      {/* Global Recipe Edit Modal */}
      <Dialog open={showRecipeEditModal} onOpenChange={setShowRecipeEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Modifier la recette</DialogTitle>
            </DialogHeader>
            {recipeToEditGlobal && (
                <RecipeForm 
                    initialData={recipeToEditGlobal} 
                    onSubmit={handleRecipeUpdate} 
                    onCancel={() => setShowRecipeEditModal(false)}
                />
            )}
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <RecipePreviewModal 
        isOpen={showPreviewModal} 
        onClose={() => setShowPreviewModal(false)} 
        recipe={recipeToPreview}
        onEdit={(recipe) => {
            setRecipeToPreview(recipe);
            setShowPreviewModal(false); 
            setRecipeToEditGlobal(recipe);
            setShowRecipeEditModal(true);
        }}
      />
    </div>
  )
}
