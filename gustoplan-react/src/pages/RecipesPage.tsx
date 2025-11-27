import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, onSnapshot } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "recipes"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recipesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      console.log("Recettes chargées:", recipesData) // Pour debug console
      setRecipes(recipesData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Mes Recettes ({recipes.length})</h1>
      
      {recipes.length === 0 ? (
        <p className="text-muted-foreground">Aucune recette trouvée dans la base de données.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-md transition-shadow">
              {recipe.imageUrl && (
                <img 
                  src={recipe.imageUrl} 
                  alt={recipe.name} 
                  className="w-full h-48 object-cover rounded-t-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=No+Image";
                  }}
                />
              )}
              <CardHeader>
                <CardTitle className="text-lg">{recipe.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {recipe.description || "Pas de description"}
                </p>
                <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                  <span className="bg-muted px-2 py-1 rounded">{recipe.category || "Non classé"}</span>
                  {recipe.prepTime && <span className="bg-muted px-2 py-1 rounded">{recipe.prepTime} min</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
