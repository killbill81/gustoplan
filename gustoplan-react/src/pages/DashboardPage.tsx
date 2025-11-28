import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { collection, query, where, onSnapshot, doc, getDoc, or } from "firebase/firestore" // Import 'or'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card" // Import CardDescription
import { Loader2, Utensils, ShoppingBag, ListTodo, Calendar } from "lucide-react" // Import Calendar, ListTodo
import { Link } from "react-router-dom"

// Helper to get week number (same as in MenuPage)
function getWeekNumber(d: Date) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  var weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("Utilisateur")
  const [planCount, setPlanCount] = useState(0)
  const [recipeCount, setRecipeCount] = useState(0)
  const [currentWeekMeals, setCurrentWeekMeals] = useState<any[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  const currentWeek = getWeekNumber(new Date())
  const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
  // Removed mealTypes as it's not directly used for display here

  // Fetch user info
  useEffect(() => {
    const currentUser = auth.currentUser
    if (currentUser) {
      setUserName(currentUser.displayName || currentUser.email || "Utilisateur")
    }
  }, [])

  // Fetch plan count and select default plan
  useEffect(() => {
    const currentUser = auth.currentUser
    if (!currentUser) return

    const q = query(
      collection(db, "plans"),
      or(
        where("userId", "==", currentUser.uid),
        where("collaborators", "array-contains", currentUser.uid)
      )
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plans = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setPlanCount(plans.length)
      if (plans.length > 0 && !selectedPlanId) {
        setSelectedPlanId(plans[0].id) // Select first plan for dashboard overview
      }
    })
    return () => unsubscribe()
  }, [selectedPlanId])

  // Fetch recipe count
  useEffect(() => {
    const q = query(collection(db, "recipes"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecipeCount(snapshot.size)
    })
    return () => unsubscribe()
  }, [])

  // Fetch current week meals for selected plan
  useEffect(() => {
    if (!selectedPlanId) return

    const fetchMeals = async () => {
      const planDoc = await getDoc(doc(db, "plans", selectedPlanId))
      if (planDoc.exists()) {
        const planData = planDoc.data()
        const weekData = planData.weeks?.[currentWeek] || { menuData: {} }
        
        const mealsForDisplay: any[] = [];
        Object.entries(weekData.menuData).forEach(([slotKey, meals]) => {
            if (Array.isArray(meals)) {
                meals.forEach(meal => {
                    mealsForDisplay.push({ ...meal, slotKey });
                });
            }
        });
        setCurrentWeekMeals(mealsForDisplay);
      }
      setLoading(false);
    };
    fetchMeals();
  }, [selectedPlanId, currentWeek])

  // No need for sortedMeals here, it was not used for display
  // Removed sortedMeals

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Bonjour, {userName} !</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plans Actifs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planCount}</div>
            <p className="text-xs text-muted-foreground">
              <Link to="/menu" className="text-primary hover:underline">Voir mes plans</Link>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes Recettes</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recipeCount}</div>
            <p className="text-xs text-muted-foreground">
              <Link to="/recipes" className="text-primary hover:underline">Gérer les recettes</Link>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liste de Courses</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentWeekMeals.length > 0 ? "Générée" : "Vide"}</div>
            <p className="text-xs text-muted-foreground">
              <Link to="/shopping-list" className="text-primary hover:underline">Voir la liste</Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {selectedPlanId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Menu de la Semaine {currentWeek}</CardTitle>
            <CardDescription>Aperçu rapide de votre plan de repas pour la semaine.</CardDescription>
          </CardHeader>
          <CardContent>
            {currentWeekMeals.length === 0 ? (
              <p className="text-muted-foreground">Aucun repas planifié pour cette semaine dans le plan sélectionné.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentWeekMeals.map((meal, index) => {
                  const [dayIndexStr, mealTypeKey] = meal.slotKey.split('-'); // Removed slotIndexStr
                  const dayName = daysOfWeek[parseInt(dayIndexStr, 10)] || "";
                  // Corrected mealTypeKey mapping
                  const mealTypeName = mealTypeKey === 'lunch' ? 'Midi' : (mealTypeKey === 'dinner' ? 'Soir' : mealTypeKey); 

                  return (
                    <Card key={meal.id + index} className="flex flex-row items-center p-4">
                      <ListTodo className="h-5 w-5 text-muted-foreground mr-3" />
                      <div>
                        <p className="font-semibold">{meal.name || "Plat sans nom"}</p>
                        <p className="text-sm text-muted-foreground">{dayName} - {mealTypeName}</p>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}