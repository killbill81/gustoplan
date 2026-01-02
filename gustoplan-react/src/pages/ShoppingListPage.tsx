import { useState, useMemo } from "react"
import { usePlans } from "@/hooks/usePlans"
import { useShoppingList, ShoppingItem } from "@/hooks/useShoppingList"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Loader2,
  Plus,
  ShoppingCart,
  Trash2,
  Undo2,
  Wand2,
  Search,
  Carrot,
  Beef,
  Fish,
  Milk,
  Croissant as Bread,
  Utensils,
  Package,
  ChevronUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ShoppingAIModal } from "@/components/shopping-ai-modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

export default function ShoppingListPage() {
  const { plans, currentPlan, selectPlan } = usePlans()
  const {
    active: shoppingList,
    trashed: deletedItems,
    isLoading,
    toggleCheck,
    removeItem,
    restoreItem,
    addManualItem
  } = useShoppingList(currentPlan?.id)

  const [activeTab, setActiveTab] = useState<string>("")
  const [showTrash, setShowTrash] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [showManual, setShowManual] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")


  // Manual item form state
  const [newItem, setNewItem] = useState({ name: "", quantity: 1, unit: "pièce(s)", category: "Inconnue" })

  // Group items by category
  const groupedList = useMemo(() => {
    const filtered = searchTerm
      ? shoppingList.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : shoppingList

    return filtered.reduce((acc, item) => {
      const cat = item.category || 'Inconnue'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(item)
      return acc
    }, {} as Record<string, ShoppingItem[]>)
  }, [shoppingList, searchTerm])

  const categories = useMemo(() => {
    return Object.keys(groupedList).sort((a, b) => {
      if (a === 'Inconnue') return 1
      if (b === 'Inconnue') return -1
      return a.localeCompare(b)
    })
  }, [groupedList])

  // Scroll spy or simple tab activation
  const onTabClick = (category: string) => {
    const element = document.getElementById(`category-${category}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveTab(category)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-[1200px]">
      {/* Header section with refined styling */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 bg-card/50 p-6 rounded-3xl border border-primary/5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ShoppingCart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Ma Liste</h1>
            <p className="text-sm text-muted-foreground font-medium">Courses • {currentPlan?.name || "Sélectionner un menu"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={currentPlan?.id} onValueChange={selectPlan}>
            <SelectTrigger className="w-full md:w-[240px] h-12 rounded-2xl font-bold bg-background border-primary/10">
              <SelectValue placeholder="Choisir un plan" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {plans.map(p => (
                <SelectItem key={p.id} value={p.id} className="rounded-xl">
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-2xl hover:bg-primary/5 border-primary/10"
            onClick={() => setShowManual(true)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {currentPlan ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Category Navigation */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-3xl border-primary/5 overflow-hidden shadow-lg">
              <CardHeader className="bg-primary/5 border-b border-primary/10 py-4">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" /> Rayons
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <ScrollArea className="h-[400px] lg:h-auto">
                  <div className="space-y-1 p-2">
                    {categories.map(cat => {
                      const Icon = categoryIcons[cat.toLowerCase()] || Package
                      return (
                        <Button
                          key={cat}
                          variant={activeTab === cat ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start gap-3 rounded-xl font-bold h-11 transition-all",
                            activeTab === cat ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-primary/5"
                          )}
                          onClick={() => onTabClick(cat)}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="flex-grow text-left">{cat}</span>
                          <span className="text-[10px] bg-background/20 px-2 py-0.5 rounded-full">{groupedList[cat].length}</span>
                        </Button>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Trash Button */}
            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl gap-3 border-dashed border-2 font-bold hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 transition-all group"
              onClick={() => setShowTrash(true)}
            >
              <Trash2 className="h-5 w-5 group-hover:shake" />
              Corbeille ({deletedItems.length})
            </Button>
          </div>

          {/* Main Shopping List Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search & AI Actions */}
            <div className="flex gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  className="w-full h-14 pl-12 pr-4 bg-card border-primary/10 rounded-2xl font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                className="h-14 px-6 rounded-2xl gap-2 font-black shadow-lg shadow-primary/20"
                onClick={() => setShowAI(true)}
              >
                <Wand2 className="h-5 w-5" />
                <span className="hidden md:inline text-sm">Assistant IA</span>
              </Button>
            </div>

            {/* Categorized List */}
            <div className="space-y-8">
              {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-card rounded-[2rem] border-2 border-dashed gap-4 text-center px-6">
                  <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center">
                    <ShoppingCart className="h-10 w-10 text-primary/30" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Votre liste est vide</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                      {searchTerm
                        ? "Aucun article ne correspond à votre recherche."
                        : "Planifiez des repas pour générer automatiquement votre liste de courses !"}
                    </p>
                  </div>
                  <Button variant="outline" className="rounded-xl mt-4" onClick={() => setSearchTerm("")}>
                    {searchTerm ? "Effacer la recherche" : "Aller au Menu"}
                  </Button>
                </div>
              ) : (
                categories.map(cat => (
                  <div key={cat} id={`category-${cat}`} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                        {(() => {
                          const Icon = categoryIcons[cat.toLowerCase()] || Package
                          return <Icon className="h-5 w-5 text-primary" />
                        })()}
                      </div>
                      <h2 className="text-xl font-black tracking-tight">{cat}</h2>
                      <div className="h-px flex-grow bg-primary/5" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {groupedList[cat].map(item => (
                        <div
                          key={`${item.name}-${item.unit}`}
                          className={cn(
                            "group relative flex items-center p-4 rounded-2xl border transition-all duration-300",
                            item.isChecked
                              ? "bg-muted/30 border-primary/5 grayscale opacity-60"
                              : item.isManual
                                ? "bg-orange-50/30 border-orange-200/50 hover:bg-orange-50/50"
                                : "bg-card border-primary/5 hover:border-primary/20 hover:shadow-md"
                          )}
                        >
                          <Checkbox
                            checked={item.isChecked}
                            onCheckedChange={(checked) => toggleCheck(item.name, item.unit, !!checked)}
                            className="h-6 w-6 rounded-lg mr-4 border-2"
                          />

                          <div className="flex-grow min-w-0 pr-8">
                            <div className="flex items-baseline gap-2">
                              <span className={cn(
                                "text-sm font-black truncate",
                                item.isChecked && "line-through"
                              )}>
                                {item.name}
                              </span>
                              <span className="text-xs font-bold text-primary/60">
                                {item.totalQuantity.toFixed(item.totalQuantity % 1 === 0 ? 0 : 2)} {item.unit}
                              </span>
                            </div>
                            {item.sources && item.sources.length > 0 && !item.isChecked && (
                              <p className="text-[10px] text-muted-foreground font-medium mt-1 truncate">
                                ↳ {item.sources.map(s => s.recipeName).join(', ')}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => removeItem(item.name, item.unit)}
                            className="absolute right-4 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-card/30 rounded-[3rem] border-2 border-dashed gap-6 text-center">
          <div className="h-24 w-24 rounded-[2rem] bg-primary/5 flex items-center justify-center rotate-6">
            <ShoppingCart className="h-12 w-12 text-primary/20" />
          </div>
          <div>
            <h3 className="text-2xl font-black">Aucun menu actif</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2">
              Veuillez sélectionner ou créer un menu pour commencer à générer votre liste de courses.
            </p>
          </div>
        </div>
      )}

      {/* Trash Modal */}
      <Dialog open={showTrash} onOpenChange={setShowTrash}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-black">
              <Trash2 className="h-6 w-6 text-primary" /> Corbeille
            </DialogTitle>
            <DialogDescription className="font-medium">
              Articles retirés de votre liste. Vous pouvez les restaurer si besoin.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-3 py-4">
              {deletedItems.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground italic font-medium">
                  La corbeille est vide.
                </div>
              ) : (
                deletedItems.map(item => (
                  <div key={`${item.name}-${item.unit}`} className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-primary/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-muted-foreground line-through decoration-2">{item.name}</span>
                      <span className="text-[10px] uppercase font-black tracking-widest text-primary/40 mt-1">{item.category}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-xl hover:bg-primary/10 gap-2 h-9 px-4 font-bold"
                      onClick={() => restoreItem(item.name, item.unit)}
                    >
                      <Undo2 className="h-4 w-4" /> Restaurer
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="flex sm:justify-between items-center bg-muted/20 -mx-6 -mb-6 p-6 mt-4">
            <p className="text-xs text-muted-foreground font-medium italic">
              Les articles restaurés réapparaîtront dans votre liste.
            </p>
            <Button onClick={() => setShowTrash(false)} className="rounded-xl font-black">
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Modal */}
      <ShoppingAIModal
        open={showAI}
        onOpenChange={setShowAI}
        onAddItems={(items) => {
          items.forEach(item => addManualItem(item))
        }}
      />

      {/* Manual Add Modal */}
      <Dialog open={showManual} onOpenChange={setShowManual}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Ajouter un article</DialogTitle>
            <DialogDescription className="font-medium">
              Ajoutez manuellement un article à votre liste de courses.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-bold ml-1">Nom de l&apos;article</Label>
              <Input
                id="name"
                className="rounded-xl border-primary/10 h-11"
                placeholder="Ex: Lait, Œufs..."
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="qty" className="font-bold ml-1">Quantité</Label>
                <Input
                  id="qty"
                  type="number"
                  className="rounded-xl border-primary/10 h-11"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit" className="font-bold ml-1">Unité</Label>
                <Input
                  id="unit"
                  className="rounded-xl border-primary/10 h-11"
                  value={newItem.unit}
                  onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cat" className="font-bold ml-1">Rayon</Label>
              <Select value={newItem.category} onValueChange={(val) => setNewItem({ ...newItem, category: val })}>
                <SelectTrigger className="rounded-xl border-primary/10 h-11">
                  <SelectValue placeholder="Choisir un rayon" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {['Fruits & Légumes', 'Boucherie', 'Poissonnerie', 'Produits Laitiers', 'Boulangerie', 'Épicerie', 'Boissons', 'Inconnue'].map(c => (
                    <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full rounded-xl h-12 font-black"
              disabled={!newItem.name}
              onClick={() => {
                addManualItem({
                  name: newItem.name,
                  totalQuantity: newItem.quantity,
                  unit: newItem.unit,
                  category: newItem.category
                })
                setNewItem({ name: "", quantity: 1, unit: "pièce(s)", category: "Inconnue" })
                setShowManual(false)
              }}
            >
              Ajouter à la liste
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Scroll to TOP floating button */}
      <Button
        variant="secondary"
        size="icon"
        className="fixed bottom-8 right-8 h-12 w-12 rounded-2xl shadow-xl shadow-primary/20 border-primary/10 hover:shadow-primary/30 transition-all"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronUp className="h-5 w-5" />
      </Button>
    </div>
  )
}
