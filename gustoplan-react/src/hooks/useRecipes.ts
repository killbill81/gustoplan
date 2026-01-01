import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/firebase'
import { collection, query, onSnapshot, doc, addDoc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore'
import { Recipe } from '@/types/recipe'
import { useEffect, useState } from 'react'

const RECIPES_COLLECTION = 'recipes'

export function useRecipes() {
    const queryClient = useQueryClient()
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // We use onSnapshot for real-time updates as in the Vanilla JS version
    useEffect(() => {
        const q = query(collection(db, RECIPES_COLLECTION))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Recipe[]
            setRecipes(data)
            setIsLoading(false)
            // Also update the Query cache for other components
            queryClient.setQueryData([RECIPES_COLLECTION], data)
        })
        return () => unsubscribe()
    }, [queryClient])

    const createMutation = useMutation({
        mutationFn: async (newRecipe: Omit<Recipe, 'id'>) => {
            return addDoc(collection(db, RECIPES_COLLECTION), {
                ...newRecipe,
                createdAt: new Date().toISOString()
            })
        }
    })

    const updateMutation = useMutation({
        mutationFn: async ({ id, ...data }: Partial<Recipe> & { id: string }) => {
            const recipeRef = doc(db, RECIPES_COLLECTION, id)
            return updateDoc(recipeRef, {
                ...data,
                updatedAt: new Date().toISOString()
            })
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return deleteDoc(doc(db, RECIPES_COLLECTION, id))
        }
    })

    const toggleFavorite = async (recipe: Recipe) => {
        return updateMutation.mutateAsync({
            id: recipe.id,
            isFavorite: !recipe.isFavorite
        })
    }

    return {
        recipes,
        isLoading,
        createRecipe: createMutation.mutateAsync,
        updateRecipe: updateMutation.mutateAsync,
        deleteRecipe: deleteMutation.mutateAsync,
        toggleFavorite,
        isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
    }
}
