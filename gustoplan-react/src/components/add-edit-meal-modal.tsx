import { useState, useEffect } from "react"
import { doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Search } from "lucide-react"
import { useRecipes } from "@/hooks/useRecipes"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AddEditMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  currentWeek: number;
  dayIndex: number;
  mealTypeKey: 'lunch' | 'dinner';
  existingMeal?: any;
  slotIndex: number;
}

export default function AddEditMealModal({
  isOpen,
  onClose,
  planId,
  currentWeek,
  dayIndex,
  mealTypeKey,
  existingMeal,
  slotIndex,
}: AddEditMealModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { recipes, isLoading: loadingRecipes } = useRecipes()
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (isOpen) {
      setSelectedRecipeId(existingMeal?.id || "")
      setSearchQuery("")
      setError("")
    }
  }, [isOpen, existingMeal])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRecipeId) {
      setError("Veuillez sélectionner une recette.")
      return
    }
    setIsLoading(true)

    try {
      const planRef = doc(db, "plans", planId)
      const weekKey = currentWeek.toString()
      const slotKey = `${dayIndex}-${mealTypeKey}-${slotIndex}`

      const selectedRecipe = recipes.find(r => r.id === selectedRecipeId)
      if (!selectedRecipe) throw new Error("Recipe not found")

      const mealToSave = {
        id: selectedRecipe.id,
        name: selectedRecipe.name,
        imageUrl: selectedRecipe.imageUrl || null,
      }

      await updateDoc(planRef, {
        [`weeks.${weekKey}.menuData.${slotKey}`]: [mealToSave],
        lastUpdated: serverTimestamp(),
      })
      onClose()
    } catch (err) {
      console.error("Error saving meal:", err)
      setError("Erreur lors de l'enregistrement.")
    } finally {
      setIsLoading(false)
    }
  }

  const categoriesMap = ["ENTREE", "PLAT", "ACCOMPAGNEMENT", "DESSERT"]
  const targetCategory = categoriesMap[slotIndex] || "PLAT"

  const filteredRecipes = recipes.filter(r => {
    const matchesCategory = r.category?.toUpperCase() === targetCategory
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {existingMeal ? "Modifier le plat" : `Ajouter : ${targetCategory}`}
          </DialogTitle>
          <DialogDescription>
            Choisissez une recette pour ce créneau du planning.
          </DialogDescription>
        </DialogHeader>

        <div className="relative my-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une recette..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto pr-2 grid gap-2 py-2">
          {loadingRecipes ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : filteredRecipes.length === 0 ? (
            <p className="text-center py-8 text-sm text-muted-foreground italic">Aucune recette trouvée.</p>
          ) : (
            filteredRecipes.map(recipe => (
              <button
                key={recipe.id}
                ref={el => {
                  if (selectedRecipeId === recipe.id && el) {
                    el.scrollIntoView({ block: 'center', behavior: 'instant' })
                  }
                }}
                type="button"
                onClick={() => setSelectedRecipeId(recipe.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                  selectedRecipeId === recipe.id
                    ? "bg-primary/10 border-primary ring-1 ring-primary"
                    : "hover:bg-muted border-transparent"
                )}
              >
                <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden shrink-0">
                  {recipe.imageUrl ? (
                    <img src={recipe.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs font-bold bg-primary/5 text-primary">
                      {recipe.name.substring(0, 1)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="font-bold text-sm truncate">{recipe.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{recipe.difficulty || 'Normal'}</p>
                </div>
                {recipe.isFavorite && <div className="text-red-500 text-xs">❤️</div>}
              </button>
            ))
          )}
        </div>

        {error && <p className="text-destructive text-xs font-bold">{error}</p>}

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>Annuler</Button>
          <Button onClick={handleSave} disabled={isLoading || !selectedRecipeId}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {existingMeal ? "Mettre à jour" : "Ajouter au menu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
