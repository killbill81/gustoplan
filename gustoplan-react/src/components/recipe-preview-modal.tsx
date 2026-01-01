import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Pencil, Clock, Users, Utensils, Calendar, Leaf } from "lucide-react"
import { Recipe } from "@/types/recipe"
import { getRecipeSeasonScore } from "@/lib/season-utils"
import { cn } from "@/lib/utils"

interface RecipePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipe: Recipe | undefined;
    onEdit?: (recipe: Recipe) => void;
}

export default function RecipePreviewModal({ isOpen, onClose, recipe, onEdit }: RecipePreviewModalProps) {
    if (!recipe) return null;

    const isSeasonal = getRecipeSeasonScore(recipe) === 2

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl">
                <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden">
                    {/* Header Image */}
                    <div className="relative h-64 w-full shrink-0 bg-muted group">
                        {recipe.imageUrl ? (
                            <img
                                src={recipe.imageUrl}
                                alt={recipe.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=GustoPlan"}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/40">
                                <Utensils className="h-16 w-16" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                            <div className="w-full">
                                {isSeasonal && (
                                    <div className="flex items-center gap-1.5 text-green-400 text-xs font-bold mb-2 uppercase tracking-widest bg-green-950/40 w-fit px-3 py-1 rounded-full backdrop-blur-sm border border-green-500/30">
                                        <Leaf className="h-3.5 w-3.5 fill-green-400" /> De saison
                                    </div>
                                )}
                                <h2 className="text-3xl font-extrabold text-white leading-tight">{recipe.name}</h2>
                            </div>
                        </div>
                        {onEdit && (
                            <Button
                                variant="secondary"
                                size="icon"
                                className="absolute top-4 right-4 rounded-full shadow-lg bg-white/90 hover:bg-white text-primary border-none sm:top-6 sm:right-6"
                                onClick={() => { onClose(); onEdit(recipe); }}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <ScrollArea className="flex-grow">
                        <div className="p-8 space-y-8">
                            {/* Meta Info Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-muted/30 p-3 rounded-xl border border-muted/50 flex flex-col items-center justify-center text-center">
                                    <Utensils className="h-4 w-4 text-primary mb-1.5" />
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Catégorie</span>
                                    <span className="text-sm font-semibold">{recipe.category || "Autre"}</span>
                                </div>
                                <div className="bg-muted/30 p-3 rounded-xl border border-muted/50 flex flex-col items-center justify-center text-center">
                                    <Clock className="h-4 w-4 text-primary mb-1.5" />
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Prép.</span>
                                    <span className="text-sm font-semibold">{recipe.prepTime || 0} min</span>
                                </div>
                                <div className="bg-muted/30 p-3 rounded-xl border border-muted/50 flex flex-col items-center justify-center text-center">
                                    <Users className="h-4 w-4 text-primary mb-1.5" />
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Portions</span>
                                    <span className="text-sm font-semibold">{recipe.servings || 1} pers.</span>
                                </div>
                                <div className="bg-muted/30 p-3 rounded-xl border border-muted/50 flex flex-col items-center justify-center text-center">
                                    <Calendar className="h-4 w-4 text-primary mb-1.5" />
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Difficulté</span>
                                    <span className="text-sm font-semibold">{recipe.difficulty || "Facile"}</span>
                                </div>
                            </div>

                            {/* Seasonality Details */}
                            {(recipe.seasons?.length || 0) > 0 && (
                                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                                    <h4 className="text-xs font-bold text-primary flex items-center gap-2 mb-3 uppercase tracking-tighter">
                                        <Calendar className="h-3.5 w-3.5" /> Périodes recommandées
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {recipe.seasons?.map(s => (
                                            <span key={s} className="bg-background px-3 py-1 rounded-full text-xs font-medium border border-primary/20 shadow-sm">{s}</span>
                                        ))}
                                        {recipe.months?.map(m => (
                                            <span key={m} className="bg-background px-3 py-1 rounded-full text-[11px] font-medium border border-muted-foreground/20 text-muted-foreground">{m}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid md:grid-cols-[1fr_1.5fr] gap-12">
                                {/* Ingredients */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold border-b pb-2 flex items-center justify-between">
                                        Ingrédients
                                        <span className="text-xs font-black bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                                            {recipe.ingredients?.length || 0}
                                        </span>
                                    </h3>
                                    <ul className="space-y-3">
                                        {recipe.ingredients && recipe.ingredients.length > 0 ? (
                                            recipe.ingredients.map((ing, idx) => (
                                                <li key={idx} className="flex justify-between items-center group">
                                                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{ing.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="h-px w-8 bg-muted group-hover:bg-primary/20 transition-colors"></span>
                                                        <span className="text-xs font-bold text-muted-foreground bg-muted/20 px-2 py-1 rounded">{ing.quantity} {ing.unit}</span>
                                                    </div>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-muted-foreground italic text-sm py-4 text-center border border-dashed rounded-lg">Aucun ingrédient listé.</li>
                                        )}
                                    </ul>
                                </div>

                                {/* Steps / Description */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold border-b pb-2">Préparation</h3>
                                    <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed prose prose-sm max-w-none">
                                        {recipe.steps || "Aucune instruction fournie pour cette recette."}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="p-6 border-t bg-muted/5 flex justify-end gap-3 sticky bottom-0">
                        <Button variant="outline" onClick={onClose} className="px-8">Fermer</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
