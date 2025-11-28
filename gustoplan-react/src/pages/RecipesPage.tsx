import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { Card, CardTitle } from "@/components/ui/card" // Removed CardContent, CardHeader, CardFooter
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog" // Removed DialogDescription
import { Loader2, Plus, Pencil, Trash2, Search, Eye, Heart } from "lucide-react"
// Removed ScrollArea import
import RecipeForm, { RecipeData } from "@/components/recipe-form"
import RecipePreviewModal from "@/components/recipe-preview-modal"
import { cn } from "@/lib/utils"

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeData | undefined>(undefined)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const q = query(collection(db, "recipes"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recipesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      // Sort: Favorites first, then alphabetical
      recipesData.sort((a: any, b: any) => {
          if (a.isFavorite === b.isFavorite) return a.name.localeCompare(b.name);
          return a.isFavorite ? -1 : 1;
      })
      setRecipes(recipesData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const filteredRecipes = recipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddClick = () => {
    setSelectedRecipe(undefined)
    setIsFormModalOpen(true)
  }

  const handleEditClick = (recipe: any) => {
    setSelectedRecipe(recipe)
    setIsFormModalOpen(true)
  }

  const handlePreviewClick = (recipe: any) => {
    setSelectedRecipe(recipe)
    setIsPreviewModalOpen(true)
  }

  const handleDeleteClick = async (recipeId: string, recipeName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la recette "${recipeName}" ?`)) {
        try {
            await deleteDoc(doc(db, "recipes", recipeId));
        } catch (e) {
            console.error("Error deleting recipe", e);
            alert("Erreur lors de la suppression.");
        }
    }
  }

  const handleToggleFavorite = async (recipe: any) => {
      try {
          await updateDoc(doc(db, "recipes", recipe.id), {
              isFavorite: !recipe.isFavorite
          });
      } catch (e) {
          console.error("Error toggling favorite", e);
      }
  }

  const handleFormSubmit = async (data: RecipeData) => {
    setIsSaving(true)
    try {
        if (selectedRecipe?.id) {
            await updateDoc(doc(db, "recipes", selectedRecipe.id), data as any)
        } else {
            await addDoc(collection(db, "recipes"), data)
        }
        setIsFormModalOpen(false)
    } catch (e) {
        console.error("Error saving recipe", e)
        alert("Erreur lors de l'enregistrement.")
    } finally {
        setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Mes Recettes ({recipes.length})</h1>
        <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Rechercher..." 
                    className="pl-8" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button onClick={handleAddClick}>
                <Plus className="h-4 w-4 mr-2" /> Créer
            </Button>
        </div>
      </div>
      
      {filteredRecipes.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
            {searchTerm ? "Aucune recette ne correspond à votre recherche." : "Aucune recette trouvée. Créez-en une !"}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-200">
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {/* Favorite Button Overlay */}
                <button 
                    onClick={(e) => { e.stopPropagation(); handleToggleFavorite(recipe); }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background text-muted-foreground hover:text-destructive transition-colors z-10 shadow-sm"
                    title={recipe.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                    <Heart className={cn("h-5 w-5 transition-transform active:scale-95", recipe.isFavorite && "fill-red-500 text-red-500")} />
                </button>

                {recipe.imageUrl ? (
                    <img 
                    src={recipe.imageUrl} 
                    alt={recipe.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=No+Image";
                    }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                        <span className="text-sm">Pas d'image</span>
                    </div>
                )}
              </div>

              <CardHeader className="p-4 pb-2 flex-grow">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg leading-tight line-clamp-2" title={recipe.name}>{recipe.name}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
                  <span className="bg-muted px-2 py-1 rounded font-medium text-foreground uppercase text-[10px]">{recipe.category || "AUTRE"}</span>
                  {recipe.prepTime > 0 && <span className="bg-muted px-2 py-1 rounded">{recipe.prepTime} min</span>}
                  <span className="bg-muted px-2 py-1 rounded">{recipe.servings || 1} pers.</span>
                </div>
              </CardHeader>

              <div className="p-3 bg-muted/30 border-t border-border flex justify-between items-center gap-2">
                  <Button variant="ghost" size="sm" className="flex-1 text-xs h-8" onClick={() => handlePreviewClick(recipe)}>
                      <Eye className="h-3.5 w-3.5 mr-1.5" /> Voir
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-xs h-8 text-primary hover:text-primary/90 hover:bg-primary/10" onClick={() => handleEditClick(recipe)}>
                      <Pencil className="h-3.5 w-3.5 mr-1.5" /> Éditer
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteClick(recipe.id, recipe.name)}>
                      <Trash2 className="h-4 w-4" />
                  </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{selectedRecipe ? "Modifier la recette" : "Créer une recette"}</DialogTitle>
            </DialogHeader>
            <RecipeForm 
                initialData={selectedRecipe} 
                onSubmit={handleFormSubmit} 
                onCancel={() => setIsFormModalOpen(false)}
                isLoading={isSaving}
            />
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <RecipePreviewModal 
        isOpen={isPreviewModalOpen} 
        onClose={() => setIsPreviewModalOpen(false)} 
        recipe={selectedRecipe}
        onEdit={handleEditClick}
      />
    </div>
  )
}