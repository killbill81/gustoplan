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

    const updateItemQuantity = async (name: string, unit: string, delta: number) => {
        if (!planId || !plan) return

        const manualItems = [...(plan.manualItems || [])]
        const existingIndex = manualItems.findIndex(mi => mi.name === name && mi.unit === unit)

        if (existingIndex >= 0) {
            manualItems[existingIndex] = {
                ...manualItems[existingIndex],
                totalQuantity: (manualItems[existingIndex].totalQuantity || 0) + delta
            }
            // Optional: remove if quantity is 0 AND it was purely manual? 
            // Complexity: If it was originally 0 from recipe and we added 1, now it's 0. 
            // If we remove it, it goes back to 0. Correct.
            // If it was originally 2 from recipe and we added -2, now it's -2. 
            // If we remove it, it goes back to 2. INCORRECT.
            // So we only remove if the manual adjustment becomes 0, effectively resetting the manual override.
            // But here, we store the *total* manual quantity.
            // Wait, my logic before was: total = recipe + manual.
            // So `manualItems` store the *delta*? No, previous logic lines 75-88 imply manual items are treated as distinct items.
            // Combined map accumulates them.
            // So if I have "Sel" 1g from recipe, and I add "Sel" 1g manual. Total is 2g.
            // If I want to "increase" by 1, I find the manual item "Sel".
            // If exists (qty=1), I make it qty=2. Total becomes 3.
            // If not exists, I make it qty=1. Total becomes 2.

            // What if I want to DECREASE?
            // "Sel" 1g from recipe. I want -0.5g.
            // I create manual "Sel" -0.5g. Total 0.5g.

            // Issue: cleanup. If I have manual "Sel" 0g. It adds 0.
            // If I remove it, it adds 0. So removing 0-quantity manual items is safe.
            if (manualItems[existingIndex].totalQuantity === 0) {
                manualItems.splice(existingIndex, 1)
            }
        } else {
            // Create new manual item
            // We need to know the category. We can try to find it from masterIngredients or existing combined list.
            // Since we don't have easy access to combined here (it's in useMemo), we can try to guess or just use "Inconnue".
            // Or better, passed in arguments?
            // Let's rely on backend or just use Inconnue.
            // Ideally we'd lookup category. 
            // Since this function is inside the hook, we have `masterIngredients`.
            const masterIng = masterIngredients.find(mi => mi.name.toLowerCase() === name.toLowerCase())

            manualItems.push({
                name,
                unit,
                totalQuantity: delta,
                category: masterIng?.category || 'Inconnue'
            })
        }

        await updateDoc(doc(db, "plans", planId), {
            manualItems: manualItems,
            lastUpdated: serverTimestamp()
        })
    }

    return {
        ...shoppingData,
        isLoading: isLoadingPlan || recipesLoading || ingredientsLoading,
        toggleCheck,
        addManualItem,
        updateItemQuantity,
        removeItem,
        restoreItem
    }
}
