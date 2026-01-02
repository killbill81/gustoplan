import { useState, useEffect, useMemo } from "react"
import { db } from "@/lib/firebase"
import { doc, onSnapshot, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore"
import { useRecipes } from "./useRecipes"
import { useIngredients } from "./useIngredients"
import { Plan } from "@/types/plan"

export interface ShoppingItem {
    id?: string;
    name: string;
    totalQuantity: number;
    unit: string;
    category: string;
    isChecked: boolean;
    isManual?: boolean;
    imageUrl?: string;
    sources?: Array<{
        recipeName: string;
        day: string;
        time: string;
        quantity: number;
        servings: number;
    }>;
}

const sanitizeKey = (name: string, unit: string) => {
    return `${name}_${unit || ''}`.replace(/\./g, '_').replace(/\$/g, '').replace(/\//g, '');
};

const ALL_DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

// Helper to get image URL for an ingredient
const getIngredientImage = (ingredients: any[], name: string): string | undefined => {
    const ing = ingredients.find(i => i.name.toLowerCase() === name.toLowerCase())
    return ing?.imageUrl || ing?.image
}

export function useShoppingList(planId: string | undefined) {
    const { recipes, isLoading: recipesLoading } = useRecipes()
    const { ingredients: masterIngredients, isLoading: ingredientsLoading } = useIngredients()
    const [plan, setPlan] = useState<Plan | null>(null)
    const [isLoadingPlan, setIsLoadingPlan] = useState(true)

    useEffect(() => {
        if (!planId) {
            setTimeout(() => {
                setPlan(null)
                setIsLoadingPlan(false)
            }, 0)
            return
        }

        setTimeout(() => setIsLoadingPlan(true), 0)
        const unsubscribe = onSnapshot(doc(db, "plans", planId), (snapshot) => {
            if (snapshot.exists()) {
                setPlan({ id: snapshot.id, ...snapshot.data() } as Plan)
            } else {
                setPlan(null)
            }
            setIsLoadingPlan(false)
        })

        return () => unsubscribe()
    }, [planId])

    const shoppingData = useMemo(() => {
        if (!plan || recipesLoading || ingredientsLoading) return { active: [], trashed: [] }

        const combined = new Map<string, ShoppingItem>()
        const manualItems = plan.manualItems || []
        const checkedItems = plan.checkedItems || {}
        const hiddenTrashItems = plan.hiddenTrashItems || []

        // 1. Add Manual Items
        manualItems.forEach(item => {
            const key = sanitizeKey(item.name, item.unit)
            // Try to find image in master ingredients for manual items too
            const masterIng = masterIngredients.find(mi => mi.name.toLowerCase() === item.name.toLowerCase())

            combined.set(key, {
                ...item,
                totalQuantity: item.totalQuantity || 0,
                category: item.category || 'Inconnue',
                isChecked: !!checkedItems[key],
                isManual: true,
                imageUrl: item.imageUrl || masterIng?.imageUrl
            })
        })

        // 2. Process Plan Weeks
        if (plan.weeks) {
            Object.values(plan.weeks).forEach((weekData) => {
                const menu = weekData.menuData || {}
                const servingsData = weekData.servingsData || {}

                Object.entries(menu).forEach(([slotId, meals]) => {
                    if (!Array.isArray(meals)) return

                    const [dayIdx, mealType] = slotId.split('-')
                    const servingsKey = `${dayIdx}-${mealType}`
                    const numPeople = servingsData[servingsKey] || plan.defaultNumPeople || 4

                    meals.forEach(mealRef => {
                        const recipe = recipes.find(r => r.id === mealRef.id)
                        if (!recipe || !recipe.ingredients) return

                        const baseServings = recipe.servings || 4
                        recipe.ingredients.forEach(ing => {
                            if (!ing.name) return
                            const baseQty = typeof ing.quantity === 'number' ? ing.quantity : parseFloat(String(ing.quantity || '0').replace(',', '.'));
                            if (isNaN(baseQty)) return

                            const qtyPerPerson = baseQty / baseServings
                            const finalQty = qtyPerPerson * numPeople
                            const unit = ing.unit || ''
                            const key = sanitizeKey(ing.name, unit)

                            const existing = combined.get(key)
                            if (existing) {
                                existing.totalQuantity += finalQty
                                existing.sources = existing.sources || []
                                existing.sources.push({
                                    recipeName: recipe.name,
                                    day: ALL_DAYS[parseInt(dayIdx)],
                                    time: mealType === 'lunch' ? 'Midi' : 'Soir',
                                    quantity: finalQty,
                                    servings: numPeople
                                })
                                // If existing doesn't have image, try to set it from this instance
                                if (!existing.imageUrl && ing.imageUrl) {
                                    existing.imageUrl = ing.imageUrl
                                }
                            } else {
                                const masterIng = masterIngredients.find(mi => mi.name.toLowerCase() === ing.name.toLowerCase())
                                combined.set(key, {
                                    name: ing.name,
                                    totalQuantity: finalQty,
                                    unit: unit,
                                    category: masterIng?.category || 'Inconnue',
                                    isChecked: !!checkedItems[key],
                                    // Prefer recipe ingredient image, then master ingredient image
                                    imageUrl: ing.imageUrl || masterIng?.imageUrl,
                                    sources: [{
                                        recipeName: recipe.name,
                                        day: ALL_DAYS[parseInt(dayIdx)],
                                        time: mealType === 'lunch' ? 'Midi' : 'Soir',
                                        quantity: finalQty,
                                        servings: numPeople
                                    }]
                                })
                            }
                        })
                    })
                })
            })
        }

        const active: ShoppingItem[] = []
        const trashed: ShoppingItem[] = []

        combined.forEach((item, key) => {
            if (item.totalQuantity > 0) {
                active.push(item)
            } else if (item.totalQuantity <= 0 && item.sources && item.sources.length > 0) {
                // Legitimate sources but 0 qty (e.g. manual removal or settings)
                // In legacy, we show them in trash if not hidden
                if (!hiddenTrashItems.includes(key)) {
                    trashed.push(item)
                }
            }
        })

        return { active, trashed }
    }, [plan, recipes, masterIngredients, recipesLoading, ingredientsLoading])

    const toggleCheck = async (name: string, unit: string, isChecked: boolean) => {
        if (!planId) return
        const key = sanitizeKey(name, unit)
        await updateDoc(doc(db, "plans", planId), {
            [`checkedItems.${key}`]: isChecked,
            lastUpdated: serverTimestamp()
        })
    }

    const addManualItem = async (item: Partial<ShoppingItem>) => {
        if (!planId || !item.name) return
        const newItem = {
            name: item.name,
            totalQuantity: item.totalQuantity || 1,
            unit: item.unit || 'pièce(s)',
            category: item.category || 'Inconnue',
        }
        await updateDoc(doc(db, "plans", planId), {
            manualItems: arrayUnion(newItem),
            lastUpdated: serverTimestamp()
        })
    }

    const removeItem = async (name: string, unit: string) => {
        if (!planId || !plan) return
        const key = sanitizeKey(name, unit)
        // If it's a manual item, we remove it from manualItems
        const isManual = plan.manualItems?.some(mi => mi.name === name && mi.unit === unit)

        if (isManual) {
            const newManualItems = plan.manualItems?.filter(mi => !(mi.name === name && mi.unit === unit)) || []
            await updateDoc(doc(db, "plans", planId), {
                manualItems: newManualItems,
                lastUpdated: serverTimestamp()
            })
        } else {
            // If it's from a recipe, we "soft delete" it by adding to hiddenTrashItems
            await updateDoc(doc(db, "plans", planId), {
                hiddenTrashItems: arrayUnion(key),
                lastUpdated: serverTimestamp()
            })
        }
    }

    const restoreItem = async (name: string, unit: string) => {
        if (!planId || !plan) return
        const key = sanitizeKey(name, unit)
        const newHidden = plan.hiddenTrashItems?.filter(k => k !== key) || []
        await updateDoc(doc(db, "plans", planId), {
            hiddenTrashItems: newHidden,
            lastUpdated: serverTimestamp()
        })
    }

    return {
        ...shoppingData,
        isLoading: isLoadingPlan || recipesLoading || ingredientsLoading,
        toggleCheck,
        addManualItem,
        removeItem,
        restoreItem
    }
}
