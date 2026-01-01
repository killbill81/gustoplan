import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Pencil, Plus, Check, X } from "lucide-react"
import { IngredientCategory } from "@/types/recipe"

interface CategoryManagerProps {
    categories: IngredientCategory[];
    onAdd: (name: string) => Promise<any>;
    onRename: (id: string, oldName: string, newName: string) => Promise<any>;
    onDelete: (id: string, name: string) => Promise<any>;
}

export default function CategoryManager({ categories, onAdd, onRename, onDelete }: CategoryManagerProps) {
    const [newCategoryName, setNewCategoryName] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingName, setEditingName] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newCategoryName.trim()) return
        setIsLoading(true)
        try {
            await onAdd(newCategoryName.trim())
            setNewCategoryName("")
        } finally {
            setIsLoading(false)
        }
    }

    const startEditing = (cat: IngredientCategory) => {
        setEditingId(cat.id)
        setEditingName(cat.name)
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditingName("")
    }

    const handleRename = async (cat: IngredientCategory) => {
        if (!editingName.trim() || editingName === cat.name) return
        setIsLoading(true)
        try {
            await onRename(cat.id, cat.name, editingName.trim())
            setEditingId(null)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6 pt-4">
            <form onSubmit={handleAdd} className="flex gap-2">
                <Input
                    placeholder="Nouvelle catégorie..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !newCategoryName.trim()}>
                    <Plus className="h-4 w-4 mr-2" /> Ajouter
                </Button>
            </form>

            <div className="border rounded-lg divide-y max-h-[40vh] overflow-y-auto">
                {categories.length === 0 && (
                    <p className="p-8 text-center text-muted-foreground italic text-sm">Aucune catégorie personnalisée.</p>
                )}
                {categories.map(cat => (
                    <div key={cat.id} className="p-3 flex items-center justify-between group">
                        {editingId === cat.id ? (
                            <div className="flex-grow flex gap-2">
                                <Input
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="h-8"
                                    autoFocus
                                />
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => handleRename(cat)}>
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={cancelEditing}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <>
                                <span className="font-medium text-sm">{cat.name}</span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={() => startEditing(cat)}>
                                        <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => onDelete(cat.id, cat.name)}>
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <p className="text-[10px] text-muted-foreground bg-muted p-3 rounded italic">
                Note: Renommer ou supprimer une catégorie mettra à jour tous les ingrédients associés.
            </p>
        </div>
    )
}
