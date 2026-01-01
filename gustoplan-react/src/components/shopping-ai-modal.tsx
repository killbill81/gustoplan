import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Wand2, Sparkles, Plus, Check, X } from "lucide-react"
import { httpsCallable } from "firebase/functions"
import { functions } from "@/lib/firebase"
import { ShoppingItem } from "@/hooks/useShoppingList"

interface ShoppingAIModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddItems: (items: Partial<ShoppingItem>[]) => void;
}

export function ShoppingAIModal({ open, onOpenChange, onAddItems }: ShoppingAIModalProps) {
    const [prompt, setPrompt] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [suggestions, setSuggestions] = useState<any[] | null>(null)

    const handleAnalyze = async () => {
        if (!prompt.trim()) return
        setIsAnalyzing(true)
        try {
            // We use the auditIngredients function but we need to pre-process the prompt
            // Actually, the current Cloud Functions don't have a direct "parseShoppingText"
            // But we can use the auditIngredients by passing it what we Think are ingredients
            // OR we can just simulate it for now if we don't want to modify Cloud Functions.
            // WAIT, the prompt says "Implement AI Ingredient Parsing".
            // I should check if I can add a new function or if I should reuse auditIngredients.
            // Let's look at auditIngredients again. It takes { ingredients: [...] }.

            // For now, I'll use a simple strategy: split lines and then audit.
            const lines = prompt.split('\n').filter(l => l.trim().length > 0)
            const auditIngredients = httpsCallable(functions, 'auditIngredients')

            const result = await auditIngredients({
                ingredients: lines.map(l => ({ name: l, unit: '', category: '' }))
            })

            const data = result.data as { suggestions: any[] }
            setSuggestions(data.suggestions)
        } catch (error) {
            console.error("AI Analysis failed:", error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleConfirm = () => {
        if (!suggestions) return
        const toAdd = suggestions.map(s => ({
            name: s.name,
            unit: s.unit || 'pièce(s)',
            category: s.cat || 'Inconnue',
            totalQuantity: 1 // Default to 1
        }))
        onAddItems(toAdd)
        setSuggestions(null)
        setPrompt("")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-primary p-8 text-primary-foreground relative overflow-hidden">
                    <Sparkles className="absolute -right-4 -top-4 h-32 w-32 opacity-10 rotate-12" />
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black flex items-center gap-3">
                            <Wand2 className="h-8 w-8" /> Assistant IA
                        </DialogTitle>
                        <DialogDescription className="text-primary-foreground/80 font-medium text-lg mt-2">
                            Tapez votre liste en mode libre, je m'occupe de la classer.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-6">
                    {!suggestions ? (
                        <div className="space-y-4">
                            <Textarea
                                placeholder="Ex: 3 tomates, un pack de lait, du pain et du beurre..."
                                className="min-h-[150px] rounded-2xl border-primary/10 bg-muted/30 focus:ring-primary/20 text-lg font-medium p-6 resize-none"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                            <div className="flex justify-end gap-3">
                                <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">
                                    Annuler
                                </Button>
                                <Button
                                    className="rounded-xl px-8 font-black gap-2 h-12 shadow-lg shadow-primary/20"
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing || !prompt.trim()}
                                >
                                    {isAnalyzing ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Sparkles className="h-5 w-5" />
                                    )}
                                    Analyser ma liste
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center gap-3">
                                <Check className="h-5 w-5 text-green-600" />
                                <p className="text-sm font-bold text-green-800">
                                    J'ai trouvé {suggestions.length} articles. Confirmez-vous l'ajout ?
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2">
                                {suggestions.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-primary/5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{s.name}</span>
                                            <span className="text-[10px] uppercase font-black text-primary/40 tracking-wider">
                                                {s.cat} • {s.unit}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground italic max-w-[150px] text-right">
                                            {s.reason}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t">
                                <Button variant="ghost" onClick={() => setSuggestions(null)} className="rounded-xl font-bold gap-2">
                                    <X className="h-4 w-4" /> Recommencer
                                </Button>
                                <Button className="rounded-xl px-8 font-black h-12 gap-2" onClick={handleConfirm}>
                                    <Plus className="h-5 w-5" /> Ajouter à ma liste
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
