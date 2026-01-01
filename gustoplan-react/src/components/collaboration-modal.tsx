import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSharing } from "@/hooks/useSharing"
import { Plan } from "@/types/plan"
import { Loader2, UserPlus, Check, Share2, Mail } from "lucide-react"

interface CollaborationModalProps {
    plan: Plan;
    isOpen: boolean;
    onClose: () => void;
}

export default function CollaborationModal({ plan, isOpen, onClose }: CollaborationModalProps) {
    const { friends, invites, sendInvite, isLoading } = useSharing()
    const [sendingInvite, setSendingInvite] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleSendInvite = async (friendId: string) => {
        setSendingInvite(friendId)
        try {
            await sendInvite(plan.id, plan.name, friendId)
            setSuccess(friendId)
            setTimeout(() => setSuccess(null), 3000)
        } catch (err) {
            console.error("Error sending invite", err)
        } finally {
            setSendingInvite(null)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="h-5 w-5 text-primary" /> Partager "{plan.name}"
                    </DialogTitle>
                    <DialogDescription>
                        Invitez vos amis à collaborer sur ce menu en temps réel.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Mes Amis</div>

                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                        {isLoading ? (
                            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                        ) : friends.length === 0 ? (
                            <div className="text-center py-8 bg-muted/20 rounded-xl border border-dashed">
                                <p className="text-sm text-muted-foreground">Aucun ami trouvé.</p>
                                <Button variant="link" size="sm">Chercher des amis</Button>
                            </div>
                        ) : (
                            friends.map(friend => {
                                const isAlreadyCollaborator = plan.collaborators?.includes(friend.uid) || plan.userId === friend.uid
                                const hasPendingInvite = invites.some(i => i.receiverId === friend.uid && i.planId === plan.id)

                                return (
                                    <div key={friend.uid} className="flex items-center justify-between p-3 rounded-xl border bg-card/50">
                                        <div className="flex items-center gap-3">
                                            <img src={friend.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.uid}`} className="h-10 w-10 rounded-full" />
                                            <div>
                                                <p className="text-sm font-bold">{friend.displayName || friend.email}</p>
                                                <p className="text-[10px] text-muted-foreground">{isAlreadyCollaborator ? 'Déjà membre' : hasPendingInvite ? 'Invitation envoyée' : 'Disponible'}</p>
                                            </div>
                                        </div>

                                        {isAlreadyCollaborator ? (
                                            <div className="bg-green-100 text-green-700 p-1.5 rounded-full"><Check className="h-4 w-4" /></div>
                                        ) : success === friend.uid ? (
                                            <div className="text-green-600 font-bold text-xs flex items-center gap-1"><Check className="h-3 w-3" /> Envoyé</div>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleSendInvite(friend.uid)}
                                                disabled={!!sendingInvite || hasPendingInvite}
                                            >
                                                {sendingInvite === friend.uid ? <Loader2 className="h-3 w-3 animate-spin" /> : <UserPlus className="h-3 w-3 mr-1" />}
                                                Inviter
                                            </Button>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-start gap-3">
                    <div className="bg-primary/20 p-2 rounded-lg"><Mail className="h-4 w-4 text-primary" /></div>
                    <div>
                        <p className="text-xs font-bold text-primary">Invitation par email</p>
                        <p className="text-[10px] text-muted-foreground leading-tight mt-1">L'invitation apparaîtra dans les notifications de votre collaborateur sur GustoPlan.</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="w-full">Fermer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
