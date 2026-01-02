import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Loader2, Calendar } from "lucide-react"
import { Recipe, Ingredient, Season, Month } from "@/types/recipe"
import { SEASONS, MONTHS } from "@/lib/season-utils"

interface RecipeFormProps {
  initialData?: Partial<Recipe>;
  onSubmit: (data: Omit<Recipe, "id">) => void;
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
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialData?.ingredients || [])
  const [steps, setSteps] = useState(initialData?.steps || "")
  const [selectedSeasons, setSelectedSeasons] = useState<Season[]>(initialData?.seasons || [])
  const [selectedMonths, setSelectedMonths] = useState<Month[]>(initialData?.months || [])

  const handleAddIngredient = () => {
    setIngredients(prev => [...prev, { name: "", quantity: 0, unit: "" }])
  }

  const handleUpdateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    const newIngs = [...ingredients]
    newIngs[index] = { ...newIngs[index], [field]: value }
    setIngredients(newIngs)
  }

  const handleRemoveIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index))
  }

  const toggleSeason = (season: Season) => {
    setSelectedSeasons(prev => {
      if (prev.includes(season)) {
        return prev.filter(s => s !== season)
      } else {
        return [...prev, season]
      }
    })
  }

  const toggleMonth = (month: Month) => {
    setSelectedMonths(prev =>
      prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
    )
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
      ingredients: ingredients.filter(ing => ing.name),
      steps,
      seasons: selectedSeasons,
      months: selectedMonths,
      isFavorite: initialData?.isFavorite || false,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="name">Nom de la recette</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="imageUrl">URL de l&apos;image (optionnel)</Label>
          <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="category">Catégorie</Label>
          <select
            id="category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:opacity-50"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isLoading}
            required
          >
            <option value="ENTREE">ENTREE</option>
            <option value="PLAT">PLAT</option>
            <option value="ACCOMPAGNEMENT">ACCOMPAGNEMENT</option>
            <option value="DESSERT">DESSERT</option>
            <option value="AUTRE">AUTRE</option>
          </select>
        </div>
        <div>
          <Label htmlFor="servings">Personnes</Label>
          <Input id="servings" type="number" value={servings} onChange={(e) => setServings(parseInt(e.target.value) || 1)} min={1} disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="prepTime">Prép. (min)</Label>
          <Input id="prepTime" type="number" value={prepTime} onChange={(e) => setPrepTime(parseInt(e.target.value) || 0)} min={0} disabled={isLoading} />
        </div>
        <div>
          <Label htmlFor="difficulty">Difficulté</Label>
          <select
            id="difficulty"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
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

      <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
        <div className="flex items-center gap-2 font-semibold text-sm mb-2 text-primary">
          <Calendar className="h-4 w-4" /> Saisonnalité
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SEASONS.map(season => (
            <div key={season} className="flex items-center space-x-2">
              <Checkbox
                id={`season-${season}`}
                checked={selectedSeasons.includes(season)}
                onCheckedChange={() => toggleSeason(season)}
                disabled={isLoading}
              />
              <label htmlFor={`season-${season}`} className="text-sm cursor-pointer">{season}</label>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t mt-2">
          <Label className="text-[10px] text-muted-foreground mb-2 block uppercase font-bold tracking-tight">Ou mois spécifiques</Label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-3 gap-x-2">
            {MONTHS.map(month => (
              <div key={month} className="flex items-center space-x-1.5">
                <Checkbox
                  id={`month-${month}`}
                  checked={selectedMonths.includes(month)}
                  onCheckedChange={() => toggleMonth(month)}
                  className="h-3.5 w-3.5"
                  disabled={isLoading}
                />
                <label htmlFor={`month-${month}`} className="text-[10px] cursor-pointer whitespace-nowrap leading-none">{month.slice(0, 3)}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-bold mb-4 flex items-center justify-between">
          <span>Ingrédients</span>
          <Button type="button" variant="outline" size="sm" onClick={handleAddIngredient} disabled={isLoading} className="h-8">
            <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter
          </Button>
        </h4>
        <div className="space-y-3">
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-2 items-center group">
              <div className="flex-grow">
                <Input placeholder="Ex: Poulet" value={ing.name} onChange={(e) => handleUpdateIngredient(idx, "name", e.target.value)} disabled={isLoading} className="h-9" />
              </div>
              <div className="w-16">
                <Input type="number" placeholder="Qté" value={ing.quantity} onChange={(e) => handleUpdateIngredient(idx, "quantity", parseFloat(e.target.value) || 0)} disabled={isLoading} className="h-9" />
              </div>
              <div className="w-16">
                <Input placeholder="Unité" value={ing.unit} onChange={(e) => handleUpdateIngredient(idx, "unit", e.target.value)} disabled={isLoading} className="h-9" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveIngredient(idx)} className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" disabled={isLoading}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {ingredients.length === 0 && (
            <p className="text-center text-xs text-muted-foreground py-4 border border-dashed rounded-lg">Aucun ingrédient ajouté.</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="steps" className="mb-2 block">Préparation</Label>
        <textarea
          id="steps"
          rows={6}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 min-h-[120px]"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          disabled={isLoading}
          placeholder="Décrivez les étapes de la recette..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-background border-t">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sauvegarder"}
        </Button>
      </div>
    </form>
  )
}