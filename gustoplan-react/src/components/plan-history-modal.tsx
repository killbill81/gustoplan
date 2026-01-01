import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { History } from "lucide-react"
import { Plan } from "@/types/plan"

interface PlanHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: Plan;
}

export default function PlanHistoryModal({ isOpen, onClose, plan }: PlanHistoryModalProps) {
    // In the legacy app, history was a sub-collection or a field. 
    // Usually it's better as a sub-collection for scale.
    // For now, if it's not implemented on backend, we'll show a placeholder
    // or fetch from 'history' collection if it exists.

    const formattedDate = plan.lastUpdated?.toDate
        ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeStyle: 'short' }).format(plan.lastUpdated.toDate())
        : "Inconnue";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" /> Historique : {plan.name}
                    </DialogTitle>
                    <DialogDescription>
                        Consultez les dernières modifications apportées à ce menu.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {/* Placeholder for now as history structure might need backend sub-collection */}
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/20 rounded-2xl border border-dashed">
                        <History className="h-8 w-8 text-muted mb-2" />
                        <p className="text-sm text-muted-foreground">Aucun historique détaillé disponible pour le moment.</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Dernière mise à jour : {formattedDate}</p>
                    </div>

                    {/* Example of how it would look if tracked */}
                    {/* 
                    <div className="flex gap-4 items-start relative">
                        <div className="h-full w-0.5 bg-border absolute left-4 top-8" />
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 z-10">
                            <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Menu mis à jour</p>
                            <p className="text-xs text-muted-foreground">Par Jean • Il y a 2 heures</p>
                        </div>
                    </div>
                    */}
                </div>

                <DialogFooter>
                    <Button onClick={onClose} className="w-full">Fermer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
