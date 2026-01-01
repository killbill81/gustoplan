import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Plan } from "@/types/plan"

interface PlanFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => Promise<void>;
    plan?: Plan | null;
}

export default function PlanFormModal({ isOpen, onClose, onSubmit, plan }: PlanFormModalProps) {
    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen) {
            setName(plan?.name || "")
            setError(null)
        }
    }, [isOpen, plan])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) {
            setError("Le nom du plan est requis.")
            return
        }
        setIsLoading(true)
        setError(null)
        try {
            await onSubmit(name.trim())
            onClose()
        } catch (err) {
            console.error("Error submitting plan:", err)
            setError("Une erreur est survenue.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{plan ? "Renommer le plan" : "Nouveau plan"}</DialogTitle>
                        <DialogDescription>
                            Donnez un nom à votre menu pour mieux l'organiser.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="plan-name">Nom du plan</Label>
                            <Input
                                id="plan-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="ex: Menu de la semaine, Vacances..."
                                autoFocus
                            />
                            {error && <p className="text-xs text-destructive font-bold">{error}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>Annuler</Button>
                        <Button type="submit" disabled={isLoading || !name.trim()}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {plan ? "Mettre à jour" : "Créer le plan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
