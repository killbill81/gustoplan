import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/firebase'
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, writeBatch, query, where, getDocs } from 'firebase/firestore'
import { Ingredient, IngredientCategory } from '@/types/recipe'
import { useEffect, useState } from 'react'

const INGREDIENTS_COLLECTION = 'ingredients'
const CATEGORIES_COLLECTION = 'ingredient_categories'

export function useIngredients() {
    const queryClient = useQueryClient()
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [categories, setCategories] = useState<IngredientCategory[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Listen to Ingredients
        const unsubscribeIngs = onSnapshot(collection(db, INGREDIENTS_COLLECTION), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Ingredient[]
            setIngredients(data)
            queryClient.setQueryData([INGREDIENTS_COLLECTION], data)
        })

        // Listen to Categories
        const unsubscribeCats = onSnapshot(collection(db, CATEGORIES_COLLECTION), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as IngredientCategory[]
            setCategories(data.sort((a, b) => a.name.localeCompare(b.name)))
            queryClient.setQueryData([CATEGORIES_COLLECTION], data)
        })

        const checkLoading = () => {
            setIsLoading(false)
        }
        // Simple way to handle initial load state
        const t = setTimeout(checkLoading, 1000)

        return () => {
            unsubscribeIngs()
            unsubscribeCats()
            clearTimeout(t)
        }
    }, [queryClient])

    // --- Category Actions ---
    const addCategory = async (name: string) => {
        return addDoc(collection(db, CATEGORIES_COLLECTION), { name })
    }

    const renameCategory = async (id: string, oldName: string, newName: string) => {
        const batch = writeBatch(db)
        batch.update(doc(db, CATEGORIES_COLLECTION, id), { name: newName })

        // Propagate to ingredients
        const ingsToUpdate = ingredients.filter(i => i.category === oldName)
        ingsToUpdate.forEach(ing => {
            if (ing.id) batch.update(doc(db, INGREDIENTS_COLLECTION, ing.id), { category: newName })
        })

        return batch.commit()
    }

    const deleteCategory = async (id: string, name: string) => {
        const batch = writeBatch(db)
        batch.delete(doc(db, CATEGORIES_COLLECTION, id))

        // Propagate to ingredients (move to 'Inconnue')
        const ingsToUpdate = ingredients.filter(i => i.category === name)
        ingsToUpdate.forEach(ing => {
            if (ing.id) batch.update(doc(db, INGREDIENTS_COLLECTION, ing.id), { category: 'Inconnue' })
        })

        return batch.commit()
    }

    // --- Ingredient Actions ---
    const saveIngredient = async (ingredient: Partial<Ingredient> & { id?: string }) => {
        if (ingredient.id) {
            const { id, ...data } = ingredient
            return updateDoc(doc(db, INGREDIENTS_COLLECTION, id), data)
        } else {
            return addDoc(collection(db, INGREDIENTS_COLLECTION), ingredient)
        }
    }

    const deleteIngredient = async (id: string) => {
        return deleteDoc(doc(db, INGREDIENTS_COLLECTION, id))
    }

    return {
        ingredients,
        categories,
        isLoading,
        addCategory,
        renameCategory,
        deleteCategory,
        saveIngredient,
        deleteIngredient
    }
}
