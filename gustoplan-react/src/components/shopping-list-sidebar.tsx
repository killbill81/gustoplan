import { useMemo, useState } from "react"
import { useShoppingList } from "@/hooks/useShoppingList"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, ShoppingCart, Trash2, Plus, ChevronDown, ChevronRight, Package, Carrot, Beef, Fish, Milk, Croissant as Bread, Utensils } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const categoryIcons: Record<string, any> = {
    'fruits & légumes': Carrot,
    'boucherie': Beef,
    'poissonnerie': Fish,
    'produits laitiers': Milk,
    'boulangerie': Bread,
    'épicerie': Package,
    'boissons': Utensils,
    'inconnue': Package
}

interface ShoppingListSidebarProps {
    planId: string
}

export function ShoppingListSidebar({ planId }: ShoppingListSidebarProps) {
    const {
        active: shoppingList,
        isLoading,
        toggleCheck,
        removeItem,
        addManualItem
    } = useShoppingList(planId)

    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
    const [showManual, setShowManual] = useState(false)
    const [newItem, setNewItem] = useState({ name: "", quantity: 1, unit: "pièce(s)", category: "Inconnue" })

    const groupedList = useMemo(() => {
        return shoppingList.reduce((acc, item) => {
            const cat = item.category || 'Inconnue'
            if (!acc[cat]) acc[cat] = []
            acc[cat].push(item)
            return acc
        }, {} as Record<string, typeof shoppingList>)
    }, [shoppingList])

    const categories = useMemo(() => {
        return Object.keys(groupedList).sort((a, b) => {
            if (a === 'Inconnue') return 1
            if (b === 'Inconnue') return -1
            return a.localeCompare(b)
        })
    }, [groupedList])

    const toggleBenne = (cat: string) => {
        setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }))
    }

    if (isLoading) {
        return <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
    }

    return (
        <div className="flex flex-col h-full bg-card rounded-xl border shadow-sm">
            <div className="p-4 border-b bg-muted/30 flex items-center justify-between rounded-t-xl">
                <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg">Ma Liste</h3>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setShowManual(true)} className="h-8 w-8 p-0 rounded-full hover:bg-primary/10">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <ScrollArea className="flex-1 p-2">
                <div className="space-y-4 p-2">
                    {categories.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground text-sm">
                            Votre liste est vide. Ajoutez des plats au menu !
                        </div>
                    ) : (
                        categories.map(cat => {
                            const Icon = categoryIcons[cat.toLowerCase()] || Package
                            const isCollapsed = collapsed[cat]

                            return (
                                <div key={cat} className="space-y-1">
                                    <button
                                        onClick={() => toggleBenne(cat)}
                                        className="flex items-center w-full gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors py-1 group"
                                    >
                                        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                        <Icon className="h-4 w-4 text-primary/70" />
                                        <span className="capitalize flex-1 text-left">{cat}</span>
                                        <span className="text-[10px] bg-muted px-1.5 rounded-full">{groupedList[cat].length}</span>
                                    </button>

                                    {!isCollapsed && (
                                        <div className="space-y-1 pl-2">
                                            {groupedList[cat].map(item => (
                                                <div key={`${item.name}-${item.unit}`} className={cn(
                                                    "group flex items-center gap-2 p-2 rounded-lg text-xs transition-all hover:bg-muted/50 border border-transparent hover:border-border",
                                                    item.isChecked ? "opacity-50" : ""
                                                )}>
                                                    <Checkbox
                                                        checked={item.isChecked}
                                                        onCheckedChange={(c) => toggleCheck(item.name, item.unit, !!c)}
                                                        className="h-4 w-4 rounded-[4px] shrink-0"
                                                    />

                                                    {item.imageUrl && (
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            className="h-6 w-6 rounded-full object-cover border bg-background shrink-0"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none'
                                                            }}
                                                        />
                                                    )}

                                                    <div className="flex-1 min-w-0">
                                                        <div className={cn("font-medium truncate", item.isChecked && "line-through decoration-muted-foreground")}>
                                                            {item.name}
                                                        </div>
                                                        <div className="text-[10px] text-muted-foreground">
                                                            {item.totalQuantity % 1 === 0 ? item.totalQuantity : item.totalQuantity.toFixed(2)} {item.unit}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.name, item.unit)}
                                                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    )}
                </div>
            </ScrollArea>

            {/* Manual Add Modal */}
            <Dialog open={showManual} onOpenChange={setShowManual}>
                <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black">Ajout manuel</DialogTitle>
                        <DialogDescription>Ajouter un article à la liste.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="s-name">Nom</Label>
                            <Input id="s-name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="ex: Sel" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor="s-qty">Qté</Label>
                                <Input id="s-qty" type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })} />
                            </div>
                            <div>
                                <Label htmlFor="s-unit">Unité</Label>
                                <Input id="s-unit" value={newItem.unit} onChange={e => setNewItem({ ...newItem, unit: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <Label>Rayon</Label>
                            <Select value={newItem.category} onValueChange={v => setNewItem({ ...newItem, category: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {['Fruits & Légumes', 'Boucherie', 'Poissonnerie', 'Produits Laitiers', 'Boulangerie', 'Épicerie', 'Boissons', 'Inconnue'].map(c => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => {
                            addManualItem({ ...newItem, totalQuantity: newItem.quantity })
                            setNewItem({ name: "", quantity: 1, unit: "pièce(s)", category: "Inconnue" })
                            setShowManual(false)
                        }}>Ajouter</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
