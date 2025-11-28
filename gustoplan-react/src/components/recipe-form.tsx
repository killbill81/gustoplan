import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Loader2 } from "lucide-react" // Removed Save
// Removed Select imports

export interface IngredientInput {
  id: string; // Used for existing ingredients, can be Firebase ID or local temp ID
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeData {
  name: string;
  imageUrl: string;
  category: string;
  servings: number;
  prepTime: number;
  difficulty: string;
  ingredients: IngredientInput[];
  steps: string;
  isFavorite?: boolean;
}

interface RecipeFormProps {
  initialData?: RecipeData;
  onSubmit: (data: RecipeData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function RecipeForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: RecipeFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "")
  const [category, setCategory] = useState(initialData?.category || "PLAT")
  const [servings, setServings] = useState(initialData?.servings || 1)
  const [prepTime, setPrepTime] = useState(initialData?.prepTime || 0)
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || "Facile")
  const [ingredients, setIngredients] = useState<IngredientInput[]>(initialData?.ingredients || [])
  const [steps, setSteps] = useState(initialData?.steps || "")
  const [ingredientTempId, setIngredientTempId] = useState(0) // For new ingredients without Firebase ID

  const handleAddIngredient = () => {
    setIngredients(prev => [...prev, { id: `temp-${ingredientTempId}`, name: "", quantity: 0, unit: "" }])
    setIngredientTempId(prev => prev + 1)
  }

  const handleUpdateIngredient = (id: string, field: keyof IngredientInput, value: any) => {
    setIngredients(prev => 
      prev.map(ing => (ing.id === id ? { ...ing, [field]: value } : ing))
    )
  }

  const handleRemoveIngredient = (id: string) => {
    setIngredients(prev => prev.filter(ing => ing.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      imageUrl,
      category,
      servings,
      prepTime,
      difficulty,
      ingredients: ingredients.filter(ing => ing.name && ing.quantity), // Filter out empty ingredients
      steps,
      isFavorite: initialData?.isFavorite || false,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="name">Nom de la recette</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="imageUrl">URL de l'image</Label>
          <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Laisser vide pour une image aléatoire" disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="category">Catégorie</Label>
          <select 
            id="category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isLoading}
            required
          >
            <option value="ENTREE">ENTREE</option>
            <option value="PLAT">PLAT</option>
            <option value="ACCOMPAGNEMENT">ACCOMPAGNEMENT</option>
            <option value="DESSERT">DESSERT</option>
          </select>
        </div>
        <div>
          <Label htmlFor="servings">Nombre de personnes</Label>
          <Input id="servings" type="number" value={servings} onChange={(e) => setServings(parseInt(e.target.value) || 1)} min={1} disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="prepTime">Temps de préparation (min)</Label>
          <Input id="prepTime" type="number" value={prepTime} onChange={(e) => setPrepTime(parseInt(e.target.value) || 0)} min={0} disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="difficulty">Difficulté</Label>
          <select 
            id="difficulty"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={isLoading}
          >
            <option value="Très facile">Très facile</option>
            <option value="Facile">Facile</option>
            <option value="Moyen">Moyen</option>
            <option value="Difficile">Difficile</option>
          </select>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-foreground mb-2">Ingrédients</h4>
        <div className="space-y-2">
          {ingredients.map((ing) => (
            <div key={ing.id} className="flex gap-2 items-end">
              <div className="flex-grow">
                <Label htmlFor={`ing-name-${ing.id}`}>Nom</Label>
                <Input id={`ing-name-${ing.id}`} value={ing.name} onChange={(e) => handleUpdateIngredient(ing.id, "name", e.target.value)} disabled={isLoading} />
              </div>
              <div className="w-24">
                <Label htmlFor={`ing-qty-${ing.id}`}>Quantité</Label>
                <Input id={`ing-qty-${ing.id}`} type="number" value={ing.quantity} onChange={(e) => handleUpdateIngredient(ing.id, "quantity", parseFloat(e.target.value) || 0)} min={0} disabled={isLoading} />
              </div>
              <div className="w-24">
                <Label htmlFor={`ing-unit-${ing.id}`}>Unité</Label>
                <Input id={`ing-unit-${ing.id}`} value={ing.unit} onChange={(e) => handleUpdateIngredient(ing.id, "unit", e.target.value)} disabled={isLoading} />
              </div>
              <Button variant="destructive" size="icon" onClick={() => handleRemoveIngredient(ing.id)} disabled={isLoading}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="mt-4" onClick={handleAddIngredient} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un ingrédient
        </Button>
      </div>

      <div>
        <Label htmlFor="steps">Préparation</Label>
        <textarea 
          id="steps"
          rows={8}
          className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sauvegarder"}
        </Button>
      </div>
    </form>
  )
}