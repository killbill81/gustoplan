import { useState, useEffect } from "react"
import { collection, query, onSnapshot, doc, updateDoc } from "firebase/firestore" // Removed where, arrayUnion, arrayRemove
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// Removed Input import
import { Label } from "@/components/ui/label"
import { Heart, Loader2 } from "lucide-react" 

interface AddEditMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  currentWeek: number;
  dayIndex: number;
  mealTypeKey: string;
  existingMeal?: any;
  existingSlotMeals?: any[];
  defaultServings?: number; 
  slotIndex?: number;
}

interface Recipe {
  id: string;
  name: string;
  servings: number;
  imageUrl?: string;
  category?: string;
  isFavorite?: boolean;
}

export default function AddEditMealModal({
  isOpen,
  onClose,
  planId,
  currentWeek,
  dayIndex,
  mealTypeKey,
  existingMeal,
  existingSlotMeals,
  defaultServings = 1, // defaultServings is still used for initialisation, not as an input
  slotIndex = 1,
}: AddEditMealModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("") 
  const [error, setError] = useState<string>("") 

  // Fetch all recipes
  useEffect(() => {
    const q = query(collection(db, "recipes"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecipes(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Recipe[])
    })
    return () => unsubscribe()
  }, [])

  // Initial values
  useEffect(() => {
    if (isOpen) {
        if (existingMeal) {
            setSelectedRecipeId(existingMeal.id || "")
        } else {
            setSelectedRecipeId("")
        }
        setError("")
    }
  }, [isOpen, existingMeal]) 

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRecipeId || !planId) {
      setError("Veuillez sélectionner une recette.")
      return
    }
    setIsLoading(true)
    setError("")

    try {
      const planRef = doc(db, "plans", planId)
      const weekKey = currentWeek.toString()
      const slotKey = `${dayIndex}-${mealTypeKey}-${slotIndex}`

      const selectedRecipe = recipes.find(r => r.id === selectedRecipeId);
      if (!selectedRecipe) {
          setError("Recette sélectionnée introuvable.");
          setIsLoading(false);
          return;
      }

      const mealToSave = {
          id: selectedRecipe.id,
          name: selectedRecipe.name,
          imageUrl: selectedRecipe.imageUrl || null,
      };

      let newMealsArray = existingSlotMeals ? [...existingSlotMeals] : [];
      
      if (existingMeal) {
          newMealsArray = newMealsArray.map(m => m.id === existingMeal.id ? mealToSave : m);
      } else {
          newMealsArray.push(mealToSave);
      }

      await updateDoc(planRef, {
        [`weeks.${weekKey}.menuData.${slotKey}`]: newMealsArray,
        lastUpdated: new Date(),
      })
      onClose()
    } catch (err) {
      console.error("Error saving meal:", err)
      setError("Erreur lors de l'enregistrement du plat.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!existingMeal || !window.confirm("Voulez-vous vraiment supprimer ce plat du menu ?")) return;
    setIsLoading(true)
    setError("")

    try {
        const planRef = doc(db, "plans", planId);
        const weekKey = currentWeek.toString();
        const slotKey = `${dayIndex}-${mealTypeKey}-${slotIndex}`;

        const newMealsArray = existingSlotMeals ? existingSlotMeals.filter(m => m.id !== existingMeal.id) : [];
        
        if (newMealsArray.length === 0) {
             await updateDoc(planRef, {
                [`weeks.${weekKey}.menuData.${slotKey}`]: [], 
                lastUpdated: new Date(),
            });
        } else {
            await updateDoc(planRef, {
                [`weeks.${weekKey}.menuData.${slotKey}`]: newMealsArray,
                lastUpdated: new Date(),
            });
        }

        onClose();
    } catch (err) {
        console.error("Error deleting meal:", err);
        setError("Erreur lors de la suppression du plat.");
    } finally {
        setIsLoading(false);
    }
  };

  // Determine target category based on slotIndex
  const categoriesMap = ["ENTREE", "PLAT", "ACCOMPAGNEMENT", "DESSERT"];
  const targetCategory = categoriesMap[slotIndex] || "PLAT";

  // Filter recipes by category
  const filteredRecipes = recipes.filter(recipe => {
      if (existingMeal && recipe.id === existingMeal.id) return true;
      
      return recipe.category?.toUpperCase() === targetCategory;
  });

  // Sort recipes: favorites first, then by name
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.name.localeCompare(b.name);
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existingMeal ? "Modifier le plat" : `Ajouter un(e) ${targetCategory.toLowerCase()}`}</DialogTitle>
          <DialogDescription>
            {existingMeal ? "Modifiez les détails de votre plat." : `Ajoutez une nouvelle recette de type ${targetCategory} à votre planning.`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="grid gap-4 py-4">
          {error && <p className="text-destructive text-sm">{error}</p>}
          <div className="grid gap-2">
            <Label htmlFor="recipe">Recette ({targetCategory})</Label>
            <select 
                id="recipe"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedRecipeId}
                onChange={(e) => setSelectedRecipeId(e.target.value)}
                disabled={isLoading}
            >
                <option value="" disabled>Sélectionner une recette</option>
                {sortedRecipes.length === 0 ? (
                    <option disabled>Aucune recette trouvée dans cette catégorie</option>
                ) : (
                    sortedRecipes.map((recipe) => (
                        <option key={recipe.id} value={recipe.id}>
                            {recipe.name} {recipe.isFavorite ? "❤️" : ""}
                        </option>
                    ))
                )}
            </select>
            {filteredRecipes.length === 0 && (
                <p className="text-xs text-muted-foreground">Aucune recette trouvée pour la catégorie {targetCategory}. Ajoutez des recettes dans "Mes Recettes".</p>
            )}
          </div>
          <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-0">
            <div className="flex flex-col sm:flex-row gap-2">
              {existingMeal && (
                <Button variant="destructive" type="button" onClick={handleDelete} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Supprimer"}
                </Button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enregistrer"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
