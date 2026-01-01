import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { collection, query, where, onSnapshot, doc, getDoc, or } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Utensils, ShoppingBag, ListTodo, Calendar, Apple, Leaf, Zap } from "lucide-react"
import { Link } from "react-router-dom"
import { cn, getWeekNumber } from "@/lib/utils"
import { getRecipeSeasonScore } from "@/lib/season-utils"

// Local week helper removed in favor of utils

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("Utilisateur")
  const [stats, setStats] = useState({
    plans: 0,
    recipes: 0,
    ingredients: 0,
    seasonalCount: 0
  })
  const [currentWeekMeals, setCurrentWeekMeals] = useState<any[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  const currentWeek = getWeekNumber(new Date())
  const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

  useEffect(() => {
    const currentUser = auth.currentUser
    if (currentUser) {
      setUserName(currentUser.displayName || currentUser.email?.split('@')[0] || "Utilisateur")
    }
  }, [])

  // Fetch all counts & stats
  useEffect(() => {
    const currentUser = auth.currentUser
    if (!currentUser) return

    // Plans listener
    const qPlans = query(
      collection(db, "plans"),
      or(
        where("userId", "==", currentUser.uid),
        where("collaborators", "array-contains", currentUser.uid)
      )
    )
    const unsubPlans = onSnapshot(qPlans, (snapshot) => {
      setStats(prev => ({ ...prev, plans: snapshot.size }))
      if (snapshot.size > 0 && !selectedPlanId) {
        setSelectedPlanId(snapshot.docs[0].id)
      }
    })

    // Recipes listener (check seasonality)
    const unsubRecipes = onSnapshot(collection(db, "recipes"), (snapshot) => {
      const recipes = snapshot.docs.map(doc => doc.data())
      const seasonalCount = recipes.filter(r => getRecipeSeasonScore(r as any) === 2).length
      setStats(prev => ({ ...prev, recipes: snapshot.size, seasonalCount }))
    })

    // Ingredients listener
    const unsubIngs = onSnapshot(collection(db, "ingredients"), (snapshot) => {
      setStats(prev => ({ ...prev, ingredients: snapshot.size }))
    })

    return () => {
      unsubPlans()
      unsubRecipes()
      unsubIngs()
    }
  }, [selectedPlanId])

  // Fetch current week meals
  useEffect(() => {
    if (!selectedPlanId) {
      setLoading(false)
      return
    }

    const unsubPlan = onSnapshot(doc(db, "plans", selectedPlanId), (docSnap) => {
      if (docSnap.exists()) {
        const planData = docSnap.data()
        const weekData = planData.weeks?.[currentWeek] || { menuData: {} }

        const mealsForDisplay: any[] = [];
        Object.entries(weekData.menuData || {}).forEach(([slotKey, meals]) => {
          if (Array.isArray(meals)) {
            meals.forEach(meal => {
              mealsForDisplay.push({ ...meal, slotKey });
            });
          }
        });
        setCurrentWeekMeals(mealsForDisplay);
      }
      setLoading(false);
    });

    return () => unsubPlan()
  }, [selectedPlanId, currentWeek])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  const seasonalPercentage = stats.recipes > 0 ? Math.round((stats.seasonalCount / stats.recipes) * 100) : 0

  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Bonjour, {userName} !</h1>
        <p className="text-muted-foreground">Voici l'aperçu de votre semaine GustoPlan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-primary">
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Plans de repas</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{stats.plans}</div>
            <Link to="/menu" className="text-xs font-semibold hover:underline opacity-70">Gérer mes plans</Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Recettes</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{stats.recipes}</div>
            <div className="flex items-center gap-1.5 mt-1">
              <Leaf className="h-3 w-3 text-green-500 fill-green-500" />
              <span className="text-xs font-medium">{seasonalPercentage}% de saison</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Ingrédients</CardTitle>
            <Apple className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{stats.ingredients}</div>
            <Link to="/ingredients" className="text-xs font-semibold text-primary hover:underline">Référentiel</Link>
          </CardContent>
        </Card>

        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-amber-600">
            <CardTitle className="text-sm font-bold uppercase tracking-wider">IA Gusto</CardTitle>
            <Zap className="h-4 w-4 fill-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">Prêt à aider</div>
            <p className="text-[10px] text-amber-700 font-medium">Suggestion intelligente dispo.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-lg bg-card">
          <CardHeader className="bg-muted/30 pb-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-bold">Plan de la Semaine {currentWeek}</CardTitle>
                <CardDescription>Aperçu rapide de vos prochains repas.</CardDescription>
              </div>
              <Button asChild size="sm">
                <Link to="/menu">Ouvrir le menu</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {currentWeekMeals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">Aucun repas planifié pour cette semaine.</p>
                <Button variant="link" asChild>
                  <Link to="/menu">Planifier maintenant</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentWeekMeals.slice(0, 6).map((meal, index) => {
                  const [dayIndexStr, mealTypeKey] = meal.slotKey.split('-');
                  const dayName = daysOfWeek[parseInt(dayIndexStr, 10)] || "";
                  const mealTypeName = mealTypeKey === 'lunch' ? 'Midi' : 'Soir';

                  return (
                    <div key={meal.id + index} className="flex items-center gap-3 p-3 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                        mealTypeKey === 'lunch' ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600"
                      )}>
                        <ListTodo className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{meal.name || "Plat sans nom"}</p>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">
                          {dayName} • <span className={mealTypeKey === 'lunch' ? "text-amber-600" : "text-indigo-600"}>{mealTypeName}</span>
                        </p>
                      </div>
                    </div>
                  )
                })}
                {currentWeekMeals.length > 6 && (
                  <div className="flex items-center justify-center p-3 text-xs font-bold text-muted-foreground">
                    + {currentWeekMeals.length - 6} autres repas...
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <Card className="border-green-500/20 bg-green-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-green-700 flex items-center gap-2">
                <Leaf className="h-4 w-4" /> Analyse de Saison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-black text-green-700">{seasonalPercentage}%</span>
                  <span className="text-[10px] font-bold text-green-600 uppercase">Objectif: 80%</span>
                </div>
                <div className="h-2 w-full bg-green-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${seasonalPercentage}%` }}></div>
                </div>
                <p className="text-[11px] text-green-800 leading-snug italic">
                  {seasonalPercentage > 50
                    ? "Excellent ! Vos recettes respectent bien le cycle de la nature."
                    : "Essayez d'ajouter plus de recettes de saison pour une meilleure santé."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> Liste Rapide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">Votre liste contient {currentWeekMeals.length > 0 ? "les ingrédients de vos repas" : "0 articles"}.</p>
              <Button variant="outline" className="w-full text-xs font-bold h-8" asChild>
                <Link to="/shopping-list">VOIR MES COURSES</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}