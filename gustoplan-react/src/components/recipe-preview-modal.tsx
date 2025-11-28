import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Pencil } from "lucide-react"

interface RecipePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: any;
  onEdit?: (recipe: any) => void;
}

export default function RecipePreviewModal({ isOpen, onClose, recipe, onEdit }: RecipePreviewModalProps) {
  if (!recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col p-0">
        <div className="flex flex-col h-full">
            {/* Header Image */}
            <div className="relative h-48 w-full shrink-0 bg-muted">
                {recipe.imageUrl && (
                    <img 
                        src={recipe.imageUrl} 
                        alt={recipe.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=No+Image"}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <h2 className="text-2xl font-bold text-white shadow-sm">{recipe.name}</h2>
                </div>
                {onEdit && (
                    <Button 
                        variant="secondary" 
                        size="icon" 
                        className="absolute top-4 right-4 rounded-full shadow-md"
                        onClick={() => { onClose(); onEdit(recipe); }}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <ScrollArea className="flex-grow">
                <div className="p-6 space-y-6">
                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-b pb-4">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">Catégorie:</span> {recipe.category || "Autre"}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">Temps:</span> {recipe.prepTime || 0} min
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">Portions:</span> {recipe.servings || 1} pers.
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Ingredients */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                Ingrédients
                                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{recipe.ingredients?.length || 0}</span>
                            </h3>
                            <ul className="space-y-2 text-sm">
                                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                                    recipe.ingredients.map((ing: any, idx: number) => (
                                        <li key={idx} className="flex justify-between border-b border-border/50 pb-1 last:border-0">
                                            <span>{ing.name}</span>
                                            <span className="font-medium text-muted-foreground">{ing.quantity} {ing.unit}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-muted-foreground italic">Aucun ingrédient listé.</li>
                                )}
                            </ul>
                        </div>

                        {/* Steps / Description */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Préparation</h3>
                            <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted/20 p-4 rounded-lg border border-border/50">
                                {recipe.steps || recipe.description || "Aucune instruction fournie."}
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
            
            <div className="p-4 border-t bg-muted/10 flex justify-end">
                <Button variant="outline" onClick={onClose}>Fermer</Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
