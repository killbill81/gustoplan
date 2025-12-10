import { useState, useEffect, useMemo } from "react" // Removed useCallback
import { auth, db } from "@/lib/firebase"
import { collection, query, where, onSnapshot, doc, or, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Plus, Trash2, Undo2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface IngredientItem {
  name: string;
  unit: string;
  totalQuantity: number;
  category: string;
  sources?: Array<{ recipeName: string; day: string; time: string; quantity: number }>;
}

interface PlanData {
  id: string;
  name: string;
  userId: string;
  collaborators?: string[];
  weeks?: Record<string, any>; // Complex week data
  manualItems?: IngredientItem[];
  checkedItems?: Record<string, boolean>; // { "item_unit": true/false }
  hiddenTrashItems?: string[]; // Keys of items permanently deleted from trash
  defaultNumPeople?: number;
}

interface RecipeData {
  id: string;
  name: string;
  ingredients: Array<{ id: string; name: string; quantity: number; unit: string }>;
  servings: number;
  // ... other recipe fields
}

interface MasterIngredientData {
  id: string;
  name: string;
  category: string;
  // ... other master ingredient fields
}

// Utility to sanitize keys for Firebase (replaces dots etc.)
const sanitizeForFirebaseKey = (str: string) => {
  if (!str) return '';
  return str.replace(/\./g, '_').replace(/\$/g, '').replace(/\//g, ''); // Firebase doesn't like . $ /
};

// --- Core Logic: Generate Shopping List --- //
const generateShoppingList = (plan: PlanData, availableRecipes: RecipeData[], masterIngredientList: MasterIngredientData[]) => {
  const combinedIngredients = new Map<string, IngredientItem>();
  const manualItems = plan.manualItems || [];

  // 1. Add Manual Items
  manualItems.forEach(item => {
    const key = `${item.name.trim().toLowerCase()}_${item.unit || ''}`;
    combinedIngredients.set(key, {
      name: item.name.trim(),
      totalQuantity: item.totalQuantity,
      unit: item.unit,
      category: item.category || 'Inconnue'
    });
  });

  // 2. Process Weeks from Plan
  const allDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  // const mealTypeMap: Record<string, string> = { "Matin": "breakfast", "Midi": "lunch", "Soir": "dinner" }; // Removed mealTypeMap

  if (plan.weeks) {
    for (const weekNumberStr in plan.weeks) {
      const weekData = plan.weeks[weekNumberStr];
      const menu = weekData.menuData || {};
      const servings = weekData.servingsData || {};

      for (const slotId in menu) {
        const mealsInSlot = menu[slotId];
        if (!Array.isArray(mealsInSlot)) continue;

        const [dayIndexStr, mealTypeKey] = slotId.split('-'); // Removed slotIndexStr
        const servingsKey = `${dayIndexStr}-${mealTypeKey}`;
        const numPeople = parseInt(servings[servingsKey] || plan.defaultNumPeople || 1, 10);

        mealsInSlot.forEach(mealRef => {
          const fullMeal = availableRecipes.find(r => r.id === mealRef.id) || mealRef; // Resolve or use partial obj
          if (!fullMeal || !fullMeal.ingredients) return;

          const baseServings = fullMeal.servings || 1;

          fullMeal.ingredients.forEach((ing: any) => {
            if (!ing.name || !ing.quantity) return;

            const masterIng = masterIngredientList.find(i => i.name.toLowerCase() === ing.name.toLowerCase());
            const category = masterIng ? masterIng.category : 'Inconnue';
            const baseQty = parseFloat(String(ing.quantity).replace(',', '.'));
            if (isNaN(baseQty)) return;

            const qtyPerPerson = baseQty / baseServings;
            const finalQty = qtyPerPerson * numPeople;
            const displayUnit = ing.unit || '';
            const key = `${ing.name.trim().toLowerCase()}_${displayUnit}`;

            if (combinedIngredients.has(key)) {
              const existing = combinedIngredients.get(key)!;
              existing.totalQuantity += finalQty;
              if (!existing.sources) existing.sources = [];
              existing.sources.push({
                recipeName: fullMeal.name,
                day: allDays[parseInt(dayIndexStr, 10)], // Map day index to name
                time: mealTypeKey === 'lunch' ? 'Midi' : (mealTypeKey === 'dinner' ? 'Soir' : 'Matin'), // Map type key to name
                quantity: finalQty
              });
            } else {
              combinedIngredients.set(key, {
                name: ing.name.trim(),
                totalQuantity: finalQty,
                unit: displayUnit,
                category: category,
                sources: [{
                  recipeName: fullMeal.name,
                  day: allDays[parseInt(dayIndexStr, 10)],
                  time: mealTypeKey === 'lunch' ? 'Midi' : (mealTypeKey === 'dinner' ? 'Soir' : 'Matin'),
                  quantity: finalQty
                }]
              });
            }
          });
        });
      }
    }
  }

  const activeList: IngredientItem[] = [];
  const deletedList: IngredientItem[] = [];
  const hiddenTrashItems = plan.hiddenTrashItems || [];

  combinedIngredients.forEach(item => {
    // Item in trash means totalQuantity <= 0 AND has sources AND NOT hidden forever
    const unsanitizedKey = `${item.name}_${item.unit || ''}`;
    const key = sanitizeForFirebaseKey(unsanitizedKey);

    if (item.totalQuantity > 0) {
      activeList.push(item);
    } else if (item.totalQuantity <= 0 && item.sources && item.sources.length > 0) {
      if (!hiddenTrashItems.includes(key)) { // Only add to deleted if not permanently hidden
        deletedList.push(item);
      }
    }
  });

  return { active: activeList, deleted: deletedList };
};

// --- ShoppingListPage Component --- //
export default function ShoppingListPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [userPlans, setUserPlans] = useState<PlanData[]>([]);
  const [currentPlanData, setCurrentPlanData] = useState<PlanData | null>(null);
  const [masterIngredientList, setMasterIngredientList] = useState<MasterIngredientData[]>([]);
  const [availableRecipes, setAvailableRecipes] = useState<RecipeData[]>([]);
  const [shoppingList, setShoppingList] = useState<IngredientItem[]>([]);
  const [deletedItems, setDeletedItems] = useState<IngredientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTrashModal, setShowTrashModal] = useState(false);

  // Fetch user plans
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const q = query(
      collection(db, "plans"),
      or(
        where("userId", "==", currentUser.uid),
        where("collaborators", "array-contains", currentUser.uid)
      )
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plans = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PlanData[];
      setUserPlans(plans);
      if (plans.length > 0) {
        setSelectedPlanId((prev) => prev || plans[0].id);
      } else {
        setSelectedPlanId(""); // No plans available
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch master ingredient list
  useEffect(() => {
    const q = query(collection(db, "ingredients"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ingredients = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MasterIngredientData[];
      setMasterIngredientList(ingredients);
    });
    return () => unsubscribe();
  }, []);

  // Fetch all available recipes
  useEffect(() => {
    const q = query(collection(db, "recipes"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recipes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as RecipeData[];
      setAvailableRecipes(recipes);
    });
    return () => unsubscribe();
  }, []);

  // Fetch selected plan data and regenerate shopping list
  useEffect(() => {
    if (!selectedPlanId || !masterIngredientList.length || !availableRecipes.length) {
      setLoading(true); // Keep loading if critical data is not ready
      setShoppingList([]);
      setDeletedItems([]);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, "plans", selectedPlanId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as PlanData;
        setCurrentPlanData(data);
        const { active, deleted } = generateShoppingList(data, availableRecipes, masterIngredientList);
        setShoppingList(active);
        setDeletedItems(deleted);
      } else {
        setCurrentPlanData(null);
        setShoppingList([]);
        setDeletedItems([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedPlanId, masterIngredientList, availableRecipes]); // Re-run when these change

  // Group active items by category
  const groupedShoppingList = useMemo(() => {
    return shoppingList.reduce((acc, item) => {
      const cat = item.category || 'Inconnue';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {} as Record<string, IngredientItem[]>);
  }, [shoppingList]);

  const categories = useMemo(() => {
    return Object.keys(groupedShoppingList).sort((a, b) => {
      if (a === 'Inconnue') return 1;
      if (b === 'Inconnue') return -1;
      return a.localeCompare(b);
    });
  }, [groupedShoppingList]);

  const handleCheckboxChange = async (item: IngredientItem, isChecked: boolean) => {
    if (!currentPlanData) return;

    const planRef = doc(db, "plans", currentPlanData.id);
    const key = sanitizeForFirebaseKey(`${item.name}_${item.unit || ''}`);
    
    try {
      await updateDoc(planRef, {
        [`checkedItems.${key}`]: isChecked,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error("Error updating checked item:", error);
    }
  };

  const handleRestoreItem = async (item: IngredientItem) => {
    if (!currentPlanData) return;

    const planRef = doc(db, "plans", currentPlanData.id);
    const key = sanitizeForFirebaseKey(`${item.name}_${item.unit || ''}`);
    
    try {
      await updateDoc(planRef, {
        hiddenTrashItems: arrayRemove(key), // Remove from hidden trash
        manualItems: arrayUnion({ ...item, totalQuantity: Math.abs(item.totalQuantity) }), // Restore as manual item (positive qty)
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error("Error restoring item:", error);
    }
  };

  const handlePermanentDelete = async (item: IngredientItem) => {
    if (!currentPlanData) return;
    if (!window.confirm(`Voulez-vous supprimer définitivement '${item.name}' de la corbeille ?`)) return;

    const planRef = doc(db, "plans", currentPlanData.id);
    const key = sanitizeForFirebaseKey(`${item.name}_${item.unit || ''}`);
    
    try {
      await updateDoc(planRef, {
        hiddenTrashItems: arrayUnion(key), // Mark as permanently hidden
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error("Error permanently deleting item:", error);
    }
  };

  const handleEmptyTrash = async () => {
    if (!currentPlanData) return;
    if (!window.confirm("Voulez-vous supprimer définitivement tous les éléments de la corbeille ?")) return;

    const planRef = doc(db, "plans", currentPlanData.id);
    const itemsToHideForever = deletedItems.map(i => sanitizeForFirebaseKey(`${i.name}_${i.unit || ''}`));
    
    try {
      await updateDoc(planRef, {
        hiddenTrashItems: arrayUnion(...itemsToHideForever),
        lastUpdated: new Date(),
      });
      setShowTrashModal(false);
    } catch (error) {
      console.error("Erreur vidage corbeille:", error);
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Liste de Courses</h1>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          {userPlans.length > 0 ? (
            <Select onValueChange={setSelectedPlanId} value={selectedPlanId}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Sélectionner un plan">
                  {userPlans.find(p => p.id === selectedPlanId)?.name || "Sélectionner un plan"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {userPlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-muted-foreground">Aucun plan trouvé.</p>
          )}
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {currentPlanData ? (
        <Card className="mb-6">
          <CardHeader className="flex-row items-center justify-between py-4">
            <CardTitle className="text-lg md:text-xl font-semibold">Articles à acheter</CardTitle>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTrashModal(true)} 
                disabled={deletedItems.length === 0}
                className="relative"
            >
                <Trash2 className="h-5 w-5" />
                {deletedItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {deletedItems.length}
                    </span>
                )}
            </Button>
          </CardHeader>
          <CardContent className="pb-4">
            {shoppingList.length === 0 && categories.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Votre liste est vide pour ce plan. Ajoutez des repas au menu !</p>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold mb-3 border-b pb-2 sticky top-0 bg-card z-10">{category}</h3>
                      <ul className="space-y-3">
                        {groupedShoppingList[category].map((item) => {
                          const isChecked = currentPlanData?.checkedItems?.[sanitizeForFirebaseKey(`${item.name}_${item.unit || ''}`)] || false;
                          const quantityDisplay = Number.isInteger(item.totalQuantity) ? item.totalQuantity : parseFloat(item.totalQuantity.toFixed(2));
                          return (
                            <li key={sanitizeForFirebaseKey(`${item.name}_${item.unit || ''}`)} className={cn(
                              "flex flex-col p-3 rounded-lg transition-colors duration-200 border",
                              isChecked ? "bg-muted/50 border-muted text-muted-foreground line-through" : "bg-card border-border shadow-sm",
                              (!item.sources || item.sources.length === 0) && "bg-orange-100 dark:bg-orange-900" // Added class for manual items
                            )}>
                              <div className="flex items-center w-full">
                                <Checkbox 
                                  checked={isChecked}
                                  onCheckedChange={(checked) => handleCheckboxChange(item, checked as boolean)}
                                  id={sanitizeForFirebaseKey(`${item.name}_${item.unit || ''}`)}
                                />
                                <label htmlFor={sanitizeForFirebaseKey(`${item.name}_${item.unit || ''}`)} className={cn("ml-3 flex-grow cursor-pointer select-none text-base font-medium", isChecked ? "line-through text-muted-foreground" : "text-foreground")}>
                                  {item.name}
                                  <span className={cn("ml-2 font-bold text-base", isChecked ? "text-muted-foreground" : "text-foreground")}>
                                    - {quantityDisplay} {item.unit || ''}
                                  </span>
                                </label>
                              </div>
                              {item.sources && item.sources.length > 0 && (
                                <div className="mt-2 pl-9 text-xs text-muted-foreground space-y-1">
                                  {item.sources.map((source, idx) => (
                                    <div key={idx}>↳ {source.recipeName} ({source.day} {source.time})</div>
                                  ))}
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      ) : (
        <p className="text-center py-12 text-muted-foreground">Veuillez sélectionner un plan pour voir votre liste de courses.</p>
      )}

      {/* Trash Modal */}
      {showTrashModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-11/12 max-w-md max-h-[80vh] flex flex-col shadow-lg">
            <CardHeader className="flex-row items-center justify-between py-4 pr-12">
              <CardTitle className="text-xl font-bold flex items-center gap-2"><Trash2 className="h-5 w-5" /> Corbeille</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleEmptyTrash} disabled={deletedItems.length === 0} className="text-destructive hover:bg-destructive/10">
                Vider tout
              </Button>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto">
              {deletedItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">La corbeille est vide.</p>
              ) : (
                <ScrollArea className="h-[calc(80vh-180px)]">
                  <ul className="space-y-3">
                    {deletedItems.map((item, index) => (
                      <li key={index} className="flex items-center justify-between p-3 rounded-lg bg-card text-muted-foreground shadow-inner border border-border">
                        <span className="font-medium text-base line-through flex-grow pr-2">{item.name}</span>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Button variant="outline" size="sm" onClick={() => handleRestoreItem(item)}>
                            <Undo2 className="h-4 w-4 mr-1" /> Restaurer
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handlePermanentDelete(item)} className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </CardContent>
            <CardFooter className="flex justify-end p-4">
                <Button variant="outline" onClick={() => setShowTrashModal(false)}>Fermer</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}