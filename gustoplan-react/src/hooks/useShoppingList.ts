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
    isTrashed?: boolean; // New flag for robust deletion
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
            const existing = combined.get(key)

            if (existing && existing.isManual) {
                // Accumulate manual items (handle duplicates in DB array by summing them)
                // Ensure we treat existing quantity as number
                existing.totalQuantity += Number(item.totalQuantity || 0)
                // If any manual entry marks it as trashed, the item is trashed
                if (item.isTrashed) existing.isTrashed = true
            } else {
                combined.set(key, {
                    ...item,
                    totalQuantity: Number(item.totalQuantity || 0),
                    category: item.category || 'Inconnue',
                    isChecked: !!checkedItems[key],
                    isManual: true,
                    isTrashed: !!item.isTrashed,
                    imageUrl: item.imageUrl || masterIng?.imageUrl
                })
            }
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
            // Skip if hidden forever
            if (hiddenTrashItems.includes(key)) return

            // If explicitly trashed OR quantity is effectively zero/negative
            if (item.isTrashed || item.totalQuantity <= 0.005) {
                // Trashed if it has sources OR is manual
                if ((item.sources && item.sources.length > 0) || item.isManual) {
                    trashed.push(item)
                }
            } else {
                active.push(item)
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

    const updateItemQuantity = async (name: string, unit: string, delta: number, isTrashed: boolean = false) => {
        if (!planId || !plan) return

        const manualItems = [...(plan.manualItems || [])]
        const existingIndex = manualItems.findIndex(mi => mi.name === name && mi.unit === unit)

        if (existingIndex >= 0) {
            const currentObj = manualItems[existingIndex]
            manualItems[existingIndex] = {
                ...currentObj,
                totalQuantity: Number(currentObj.totalQuantity || 0) + delta,
                // Update trash flag if specified (true forces true, false doesn't necessarily clear unless we want it to)
                // For simplicity: if isTrashed passed as TRUE, set it.
                isTrashed: isTrashed ? true : currentObj.isTrashed
            }
        } else {
            const masterIng = masterIngredients.find(mi => mi.name.toLowerCase() === name.toLowerCase())
            manualItems.push({
                name,
                unit,
                totalQuantity: delta,
                category: masterIng?.category || 'Inconnue',
                isTrashed: isTrashed
            })
        }

        await updateDoc(doc(db, "plans", planId), {
            manualItems: manualItems,
            lastUpdated: serverTimestamp()
        })
    }

    const removeItem = async (name: string, unit: string, _currentQuantity: number) => {
        if (!planId || !plan) return
        // Soft delete: Mark as trashed explicitly. Delta 0 (preserve quantity for display in trash)
        // OR better: we keep using subtraction logic for backward compatibility?
        // No, let's just mark it trashed.
        await updateItemQuantity(name, unit, 0, true)
    }

    const restoreItem = async (name: string, unit: string, hasSources: boolean = false) => {
        if (!planId || !plan) return
        const key = sanitizeKey(name, unit)

        // 1. Unhide if hidden
        if (plan.hiddenTrashItems?.includes(key)) {
            const newHidden = plan.hiddenTrashItems.filter(k => k !== key)
            await updateDoc(doc(db, "plans", planId), {
                hiddenTrashItems: newHidden,
                lastUpdated: serverTimestamp()
            })
        }

        // 2. Fix quantity handling (Reset manual logic)
        let manualItems = [...(plan.manualItems || [])]
        const idx = manualItems.findIndex(mi => mi.name === name && mi.unit === unit)

        if (idx >= 0) {
            if (hasSources) {
                // Remove the manual adjustment to reveal the recipe quantity
                manualItems.splice(idx, 1)
            } else {
                // Pure manual. Set to 1 because we don't have a "source" to fallback to.
                // IMPORTANTE: Ensure we clear the trash flag!
                manualItems[idx] = {
                    ...manualItems[idx],
                    totalQuantity: 1,
                    isTrashed: false
                }
            }

            await updateDoc(doc(db, "plans", planId), {
                manualItems: manualItems,
                lastUpdated: serverTimestamp()
            })
        }
    }

    const deleteForever = async (name: string, unit: string) => {
        if (!planId || !plan) return
        const key = sanitizeKey(name, unit)

        // Hide it from everywhere
        await updateDoc(doc(db, "plans", planId), {
            hiddenTrashItems: arrayUnion(key),
            lastUpdated: serverTimestamp()
        })

        // Optimize: Remove manual item if it exists to clean DB?
        // Let's implement it to keep DB clean.
        const isManual = plan.manualItems?.some(mi => mi.name === name && mi.unit === unit)
        if (isManual) {
            const newManualItems = plan.manualItems?.filter(mi => !(mi.name === name && mi.unit === unit)) || []
            await updateDoc(doc(db, "plans", planId), {
                manualItems: newManualItems
            })
        }
    }

    return {
        ...shoppingData,
        isLoading: isLoadingPlan || recipesLoading || ingredientsLoading,
        toggleCheck,
        addManualItem,
        updateItemQuantity,
        removeItem,
        restoreItem,
        deleteForever
    }
}
