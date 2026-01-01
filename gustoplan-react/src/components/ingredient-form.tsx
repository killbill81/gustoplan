import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Calendar } from "lucide-react"
import { Ingredient, Season, Month } from "@/types/recipe"
import { SEASONS, MONTHS } from "@/lib/season-utils"

interface IngredientFormProps {
    initialData?: Partial<Ingredient>;
    categories: string[];
    onSubmit: (data: Partial<Ingredient>) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function IngredientForm({
    initialData,
    categories,
    onSubmit,
    onCancel,
    isLoading = false,
}: IngredientFormProps) {
    const [name, setName] = useState(initialData?.name || "")
    const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "")
    const [category, setCategory] = useState(initialData?.category || categories[0] || "AUTRE")
    const [unit, setUnit] = useState(initialData?.unit || "g")
    const [selectedSeasons, setSelectedSeasons] = useState<Season[]>((initialData as any)?.seasons || [])
    const [selectedMonths, setSelectedMonths] = useState<Month[]>((initialData as any)?.months || [])

    const toggleSeason = (season: Season) => {
        setSelectedSeasons(prev =>
            prev.includes(season) ? prev.filter(s => s !== season) : [...prev, season]
        )
    }

    const toggleMonth = (month: Month) => {
        setSelectedMonths(prev =>
            prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
        )
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            ...initialData,
            name,
            imageUrl,
            category,
            unit,
            seasons: selectedSeasons,
            months: selectedMonths,
        } as any)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid gap-4">
                <div>
                    <Label htmlFor="ing-name">Nom de l'ingrédient</Label>
                    <Input id="ing-name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="ing-category">Catégorie</Label>
                        <select
                            id="ing-category"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            disabled={isLoading}
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            {!categories.includes('AUTRE') && <option value="AUTRE">AUTRE</option>}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="ing-unit">Unité par défaut</Label>
                        <Input id="ing-unit" value={unit} onChange={(e) => setUnit(e.target.value)} disabled={isLoading} placeholder="g, ml, unité..." />
                    </div>
                </div>

                <div>
                    <Label htmlFor="ing-imageUrl">URL Image (optionnel)</Label>
                    <Input id="ing-imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} disabled={isLoading} placeholder="https://..." />
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
                                id={`season-ing-${season}`}
                                checked={selectedSeasons.includes(season)}
                                onCheckedChange={() => toggleSeason(season)}
                                disabled={isLoading}
                            />
                            <label htmlFor={`season-ing-${season}`} className="text-sm cursor-pointer">{season}</label>
                        </div>
                    ))}
                </div>

                <div className="pt-2 border-t mt-2">
                    <Label className="text-[10px] text-muted-foreground mb-2 block uppercase font-bold tracking-tight">Mois de disponibilité</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-3 gap-x-2">
                        {MONTHS.map(month => (
                            <div key={month} className="flex items-center space-x-1.5">
                                <Checkbox
                                    id={`month-ing-${month}`}
                                    checked={selectedMonths.includes(month)}
                                    onCheckedChange={() => toggleMonth(month)}
                                    className="h-3.5 w-3.5"
                                    disabled={isLoading}
                                />
                                <label htmlFor={`month-ing-${month}`} className="text-[10px] cursor-pointer whitespace-nowrap leading-none">{month.slice(0, 3)}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
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
