import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Plus, Pencil, Trash2, Search, Settings, Apple, Leaf } from "lucide-react"
import { useIngredients } from "@/hooks/useIngredients"
import { cn } from "@/lib/utils"
import { Ingredient } from "@/types/recipe"
import CategoryManager from "@/components/category-manager"
import IngredientForm from "@/components/ingredient-form"
import { getRecipeSeasonScore } from "@/lib/season-utils"

export default function IngredientsPage() {
    const {
        ingredients,
        categories,
        isLoading,
        saveIngredient,
        deleteIngredient,
        addCategory,
        renameCategory,
        deleteCategory
    } = useIngredients()

    const [activeCategory, setActiveCategory] = useState("Légumes")
    const [searchTerm, setSearchTerm] = useState("")

    // Modal States
    const [isIngModalOpen, setIsIngModalOpen] = useState(false)
    const [isCatModalOpen, setIsCatModalOpen] = useState(false)
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | undefined>(undefined)
    const [isSaving, setIsSaving] = useState(false)

    // Memoized Categories List
    const allCategoryNames = useMemo(() => {
        const fromIngs = [...new Set(ingredients.map(i => i.category || 'Inconnue'))]
        const official = categories.map(c => c.name)
        const combined = [...new Set([...official, ...fromIngs])].sort()

        if (combined.includes('Inconnue')) {
            return [...combined.filter(c => c !== 'Inconnue'), 'Inconnue']
        }
        return combined
    }, [ingredients, categories])

    // Set default category
    useMemo(() => {
        if ((!activeCategory || !allCategoryNames.includes(activeCategory)) && allCategoryNames.length > 0) {
            setActiveCategory(allCategoryNames[0])
        }
    }, [allCategoryNames, activeCategory])

    // Filtered ingredients
    const filteredIngredients = useMemo(() => {
        let result = ingredients
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase()
            result = result.filter(i => i.name.toLowerCase().includes(lowerSearch))
        } else if (activeCategory) {
            result = result.filter(i => (i.category || 'Inconnue') === activeCategory)
        }

        return result.sort((a, b) => {
            const scoreA = getRecipeSeasonScore({ ...a, ingredients: [] } as any)
            const scoreB = getRecipeSeasonScore({ ...b, ingredients: [] } as any)
            if (scoreA !== scoreB) return scoreB - scoreA
            return a.name.localeCompare(b.name)
        })
    }, [ingredients, activeCategory, searchTerm])

    const handleSaveIng = async (data: Partial<Ingredient>) => {
        setIsSaving(true)
        try {
            await saveIngredient(data)
            setIsIngModalOpen(false)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteIng = async (ing: Ingredient) => {
        if (ing.id && window.confirm(`Supprimer l'ingrédient "${ing.name}" ?`)) {
            await deleteIngredient(ing.id)
        }
    }

    const handleDeleteCat = async (id: string, name: string) => {
        if (window.confirm(`Supprimer la catégorie "${name}" ? Les ingrédients associés seront déplacés en "Inconnue".`)) {
            await deleteCategory(id, name)
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
                    <h1 className="text-3xl font-bold">Référentiel Ingrédients</h1>
                    <p className="text-muted-foreground text-sm mt-1">{ingredients.length} ingrédients au total</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-grow md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Chercher un ingrédient..."
                            className="pl-9 bg-background"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setIsCatModalOpen(true)} title="Gérer les catégories">
                        <Settings className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => { setSelectedIngredient(undefined); setIsIngModalOpen(true); }}>
                        <Plus className="h-4 w-4 mr-2" /> Ajouter
                    </Button>
                </div>
            </div>

            {!searchTerm && (
                <div className="flex space-x-1 border-b mb-6 overflow-x-auto scrollbar-none pb-px">
                    {allCategoryNames.map(cat => (
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

            {filteredIngredients.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                    <p className="text-muted-foreground">Aucun ingrédient trouvé.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredIngredients.map((ing) => {
                        const isSeasonal = getRecipeSeasonScore({ ...ing, ingredients: [] } as any) === 2
                        return (
                            <Card key={ing.id} className="flex flex-col overflow-hidden group hover:shadow-lg transition-all border-muted/60 relative">
                                <div
                                    className="relative aspect-[4/3] w-full overflow-hidden bg-muted cursor-pointer flex items-center justify-center"
                                    onClick={() => { setSelectedIngredient(ing); setIsIngModalOpen(true); }}
                                >
                                    {/* Season Badge */}
                                    {isSeasonal && (
                                        <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-md flex items-center">
                                            <Leaf className="h-3 w-3 mr-1 fill-white" /> DE SAISON
                                        </div>
                                    )}

                                    {ing.imageUrl ? (
                                        <img
                                            src={ing.imageUrl}
                                            alt={ing.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-primary/30 group-hover:text-primary/50 transition-colors">
                                            <Apple className="h-12 w-12 mb-2" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 pb-0 flex-grow">
                                    <h3
                                        className="font-semibold text-md leading-tight line-clamp-2 cursor-pointer hover:text-primary transition-colors mb-2"
                                        title={ing.name}
                                        onClick={() => { setSelectedIngredient(ing); setIsIngModalOpen(true); }}
                                    >
                                        {ing.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5 text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                                        <span className="bg-muted px-2 py-0.5 rounded-sm">Unité: {ing.unit || 'unité'}</span>
                                    </div>
                                </div>

                                <div className="p-3 mt-4 border-t border-muted/40 flex justify-between items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold px-2" onClick={() => { setSelectedIngredient(ing); setIsIngModalOpen(true); }}>
                                        <Pencil className="h-3 w-3 mr-1" /> ÉDITER
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteIng(ing)}>
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Ingredient Form Modal */}
            <Dialog open={isIngModalOpen} onOpenChange={setIsIngModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{selectedIngredient ? "Modifier l'ingrédient" : "Ajouter un ingrédient"}</DialogTitle>
                    </DialogHeader>
                    <IngredientForm
                        initialData={selectedIngredient}
                        categories={allCategoryNames}
                        onSubmit={handleSaveIng}
                        onCancel={() => setIsIngModalOpen(false)}
                        isLoading={isSaving}
                    />
                </DialogContent>
            </Dialog>

            {/* Category Management Modal */}
            <Dialog open={isCatModalOpen} onOpenChange={setIsCatModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Gérer les catégories</DialogTitle>
                    </DialogHeader>
                    <CategoryManager
                        categories={categories}
                        onAdd={addCategory}
                        onRename={renameCategory}
                        onDelete={handleDeleteCat}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
