import { useState, useEffect } from "react"
import { auth, db } from "@/lib/firebase"
import { collection, query, where, onSnapshot, doc, or } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

// Helper function to get ISO week number
function getWeekNumber(d: Date) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  var weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
}

export default function MenuPage() {
  const [currentWeek, setCurrentWeek] = useState<number>(getWeekNumber(new Date()))
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  const [userPlans, setUserPlans] = useState<any[]>([])
  const [currentPlanData, setCurrentPlanData] = useState<any>(null)
  const [weekData, setWeekData] = useState<any>(null)
  const [availableRecipes, setAvailableRecipes] = useState<any[]>([]) 

  // Fetch user plans
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
      const plans = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setUserPlans(plans)
      
      if (plans.length > 0) {
        setSelectedPlanId((prev) => prev || plans[0].id)
      }
    })

    return () => unsubscribe()
  }, [])

  // Fetch all available recipes
  useEffect(() => {
    const q = query(collection(db, "recipes"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recipes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setAvailableRecipes(recipes)
    })
    return () => unsubscribe()
  }, [])

  // Fetch selected plan details and week data
  useEffect(() => {
    if (!selectedPlanId) return

    const unsubscribe = onSnapshot(doc(db, "plans", selectedPlanId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        setCurrentPlanData(data)
        
        const weeks = data.weeks || {}
        // Try to match keys regardless of type (string vs number)
        const weekKey = Object.keys(weeks).find(k => k == currentWeek.toString())
        setWeekData(weekKey ? weeks[weekKey] : { menuData: {} })
      }
    })

    return () => unsubscribe()
  }, [selectedPlanId, currentWeek])

  const goToPreviousWeek = () => {
    if (currentWeek > 1) setCurrentWeek(currentWeek - 1)
  }

  const goToNextWeek = () => {
    if (currentWeek < 52) setCurrentWeek(currentWeek + 1)
  }

  const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
  const mealTypes = ["Matin", "Midi", "Soir"]

  // Helper to get meal content for a cell
  const getMealContent = (day: string, type: string) => {
    if (!weekData || !weekData.menuData) return null
    
    const key = `${day}_${type}`
    const meals = weekData.menuData[key]
    
    if (!meals || meals.length === 0) return null

    const mealsArray = Array.isArray(meals) ? meals : [meals];

    return mealsArray.map((mealRef: any, index: number) => {
      // mealRef could be a full object or just an ID
      const recipe = availableRecipes.find(r => r.id === mealRef.id) || mealRef; 
      return (
        <div key={index} className="truncate text-xs font-medium" title={recipe.name}>
          {recipe.name || "Plat sans nom"}
        </div>
      )
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Mon Menu</h1>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          {userPlans.length > 0 && (
            <Select onValueChange={setSelectedPlanId} value={selectedPlanId}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Sélectionner un plan">
                  {userPlans.find(p => p.id === selectedPlanId)?.name || "Sélectionner un plan"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {userPlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {selectedPlanId ? (
        <Card className="mb-6">
          <CardHeader className="flex-row items-center justify-between py-4">
            <Button variant="outline" size="icon" onClick={goToPreviousWeek} disabled={currentWeek <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
                <CardTitle className="text-center text-lg md:text-xl font-semibold">
                Semaine {currentWeek}
                </CardTitle>
                <Input 
                    type="number" 
                    className="w-16 h-8 text-center" 
                    value={currentWeek} 
                    onChange={(e) => setCurrentWeek(parseInt(e.target.value) || 1)}
                    min={1} max={52}
                />
            </div>
            <Button variant="outline" size="icon" onClick={goToNextWeek} disabled={currentWeek >= 52}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row (Days) */}
              <div className="grid grid-cols-8 gap-2 mb-2">
                <div className="col-span-1"></div>
                {daysOfWeek.map((day) => (
                  <div key={day} className="col-span-1 text-center font-semibold text-foreground bg-muted/50 p-2 rounded-md">
                    {day}
                  </div>
                ))}
              </div>

              {/* Rows (Meal Types) */}
              {mealTypes.map((mealType) => (
                <div key={mealType} className="grid grid-cols-8 gap-2 mb-2">
                  <div className="col-span-1 flex items-center justify-end pr-4 font-semibold text-foreground bg-muted/50 rounded-md">
                    {mealType}
                  </div>
                  {daysOfWeek.map((day) => (
                    <div 
                      key={`${day}-${mealType}`} 
                      className="col-span-1 h-24 bg-card hover:bg-muted/30 transition-colors rounded-md border border-border p-2 flex flex-col gap-1 overflow-y-auto cursor-pointer shadow-sm"
                      onClick={() => console.log(`Clicked ${day} ${mealType}`)}
                    >
                       {getMealContent(day, mealType) || (
                         <span className="text-xs text-muted-foreground italic text-center w-full mt-2 opacity-50">+ Ajouter</span>
                       )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
            Chargement des plans...
        </div>
      )}

      {/* DEBUG SECTION */}
      <div className="mt-8 p-4 bg-black text-green-400 rounded-lg text-xs font-mono overflow-auto max-h-64">
        <h3 className="font-bold text-white mb-2">DEBUG INFO</h3>
        <p>Current Week: {currentWeek}</p>
        <p>Available Weeks in Plan: {currentPlanData?.weeks ? Object.keys(currentPlanData.weeks).join(', ') : 'None'}</p>
        <p>Selected Plan ID: {selectedPlanId}</p>
        <p>Available Recipes Count: {availableRecipes.length}</p>
        <p>Week Data (raw keys): {weekData ? Object.keys(weekData).join(', ') : 'null'}</p>
        <p>Menu Data keys: {weekData?.menuData ? Object.keys(weekData.menuData).join(', ') : 'none'}</p>
      </div>
    </div>
  )
}