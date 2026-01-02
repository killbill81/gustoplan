import { useState, useMemo } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Plus, Pencil, Trash2, Search, Heart, Leaf } from "lucide-react"
import { useRecipes } from "@/hooks/useRecipes"
import RecipeForm from "@/components/recipe-form"
import RecipePreviewModal from "@/components/recipe-preview-modal"
import { cn } from "@/lib/utils"
import { Recipe } from "@/types/recipe"
import { getRecipeSeasonScore } from "@/lib/season-utils"

const CATEGORIES = ['ENTREE', 'PLAT', 'ACCOMPAGNEMENT', 'DESSERT', 'AUTRE'];

export default function RecipesPage() {
  const { recipes, isLoading, createRecipe, updateRecipe, deleteRecipe, toggleFavorite } = useRecipes()
  const [activeCategory, setActiveCategory] = useState('PLAT')
  const [searchTerm, setSearchTerm] = useState("")

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined)
  const [isSaving, setIsSaving] = useState(false)

  // Memoized filtered and sorted recipes
  const filteredRecipes = useMemo(() => {
    let result = recipes

    // 1. Category filter
    if (activeCategory && !searchTerm) {
      result = result.filter(r => (r.category || 'AUTRE').toUpperCase() === activeCategory)
    }

    // 2. Search filter (overrides category display if found in another category)
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      result = result.filter(r => r.name.toLowerCase().includes(lowerSearch))
    }

    // 3. Sorting: Favorites first, then Season Score, then Alphabetical
    return result.sort((a, b) => {
      // Favorites first
      if (a.isFavorite !== b.isFavorite) {
        return a.isFavorite ? -1 : 1
      }

      // Seasonality score
      const scoreA = getRecipeSeasonScore(a)
      const scoreB = getRecipeSeasonScore(b)
      if (scoreA !== scoreB) {
        return scoreB - scoreA
      }

      return a.name.localeCompare(b.name)
    })
  }, [recipes, activeCategory, searchTerm])

  const handleAddClick = () => {
    setSelectedRecipe(undefined)
    setIsFormModalOpen(true)
  }

  const handleEditClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setIsFormModalOpen(true)
  }

  const handlePreviewClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setIsPreviewModalOpen(true)
  }

  const handleDeleteClick = async (recipe: Recipe) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la recette "${recipe.name}" ?`)) {
      try {
        await deleteRecipe(recipe.id);
      } catch (e) {
        console.error("Error deleting recipe", e);
      }
    }
  }

  const handleFormSubmit = async (data: Omit<Recipe, 'id'>) => {
    setIsSaving(true)
    try {
      if (selectedRecipe?.id) {
        await updateRecipe({ id: selectedRecipe.id, ...data })
      } else {
        await createRecipe(data)
      }
      setIsFormModalOpen(false)
    } catch (e) {
      console.error("Error saving recipe", e)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mes Recettes</h1>
          <p className="text-muted-foreground text-sm mt-1">{recipes.length} recettes au total</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une recette..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleAddClick} className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" /> Créer
          </Button>
        </div>
      </div>

      {/* Categories Tabs */}
      {!searchTerm && (
        <div className="flex space-x-1 border-b mb-6 overflow-x-auto scrollbar-none pb-px">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all relative whitespace-nowrap",
                activeCategory === cat
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filteredRecipes.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
          <p className="text-muted-foreground">
            {searchTerm ? "Aucun résultat pour cette recherche." : "Aucune recette dans cette catégorie."}
          </p>
          {searchTerm && (
            <Button variant="link" onClick={() => setSearchTerm("")} className="mt-2">
              Effacer la recherche
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredRecipes.map((recipe) => {
            const isSeasonal = getRecipeSeasonScore(recipe) === 2
            return (
              <Card key={recipe.id} className="flex flex-col overflow-hidden group hover:shadow-lg transition-all border-muted/60 relative">
                <div
                  className="relative aspect-[4/3] w-full overflow-hidden bg-muted cursor-pointer"
                  onClick={() => handlePreviewClick(recipe)}
                >
                  {/* Season Badge */}
                  {isSeasonal && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-md flex items-center">
                      <Leaf className="h-3 w-3 mr-1 fill-white" /> DE SAISON
                    </div>
                  )}

                  {/* Favorite Button Overlay */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(recipe); }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white text-muted-foreground hover:text-destructive transition-all z-10 shadow-sm"
                  >
                    <Heart className={cn("h-4 w-4 transition-transform active:scale-90", recipe.isFavorite && "fill-red-500 text-red-500")} />
                  </button>

                  <img
                    src={recipe.imageUrl || "https://placehold.co/600x400?text=GustoPlan"}
                    alt={recipe.name}
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                      !isSeasonal && "grayscale-[30%] opacity-80"
                    )}
                  />
                </div>

                <CardHeader className="p-4 pb-0 flex-grow">
                  <CardTitle
                    className="text-md leading-tight line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                    title={recipe.name}
                    onClick={() => handlePreviewClick(recipe)}
                  >
                    {recipe.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-1.5 text-[11px] text-muted-foreground mt-3 uppercase tracking-wider font-semibold">
                    {recipe.prepTime > 0 && <span className="bg-muted px-2 py-0.5 rounded-sm">{recipe.prepTime} min</span>}
                    <span className="bg-muted px-2 py-0.5 rounded-sm">{recipe.difficulty || 'Facile'}</span>
                  </div>
                </CardHeader>

                <div className="p-3 mt-2 border-t border-muted/40 flex justify-between items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold px-2" onClick={() => handleEditClick(recipe)}>
                    <Pencil className="h-3 w-3 mr-1" /> ÉDITER
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteClick(recipe)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto p-0">
          <div className="p-6">
            <DialogHeader className="mb-4">
              <DialogTitle>{selectedRecipe ? "Modifier la recette" : "Ajouter une recette"}</DialogTitle>
            </DialogHeader>
            <RecipeForm
              initialData={selectedRecipe}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormModalOpen(false)}
              isLoading={isSaving}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      {selectedRecipe && (
        <RecipePreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          recipe={selectedRecipe as any}
          onEdit={() => handleEditClick(selectedRecipe)}
        />
      )}
    </div>
  )
}