import { useState, useEffect } from 'react'
import { db, auth } from '@/lib/firebase'
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    or,
    serverTimestamp
} from 'firebase/firestore'
import { Plan } from '@/types/plan'
import { useQueryClient } from '@tanstack/react-query'

export function usePlans() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const queryClient = useQueryClient()

    useEffect(() => {
        const user = auth.currentUser
        if (!user) {
            setTimeout(() => {
                setPlans([])
                setIsLoading(false)
            }, 0)
            return
        }

        // Query plans where user is owner OR collaborator
        const q = query(
            collection(db, 'plans'),
            or(
                where('userId', '==', user.uid),
                where('collaborators', 'array-contains', user.uid)
            )
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Plan[]
            const sorted = data.sort((a, b) => a.name.localeCompare(b.name))
            setPlans(sorted)

            // Sync current plan if it's in the list
            if (currentPlan) {
                const updated = sorted.find(p => p.id === currentPlan.id)
                if (updated) setCurrentPlan(updated)
            } else if (sorted.length > 0) {
                // Auto-select first plan if none selected
                setCurrentPlan(sorted[0])
            }

            setIsLoading(false)
            queryClient.setQueryData(['plans'], sorted)
        })

        return () => unsubscribe()
    }, [currentPlan?.id, queryClient])

    const selectPlan = (id: string) => {
        const found = plans.find(p => p.id === id)
        if (found) setCurrentPlan(found)
    }

    const createPlan = async (name: string) => {
        const user = auth.currentUser
        if (!user) return

        const newPlan = {
            userId: user.uid,
            name,
            type: 'personal',
            weeks: {},
            defaultNumPeople: 2,
            startDay: 'Lundi',
            lastUpdated: serverTimestamp(),
            collaborators: [],
            archivedBy: []
        }

        return addDoc(collection(db, 'plans'), newPlan)
    }

    const renamePlan = async (id: string, newName: string) => {
        return updateDoc(doc(db, 'plans', id), { name: newName, lastUpdated: serverTimestamp() })
    }

    const deletePlan = async (id: string) => {
        return deleteDoc(doc(db, 'plans', id))
    }

    const updatePlanWeek = async (planId: string, weekNumber: number, weekData: any) => {
        return updateDoc(doc(db, 'plans', planId), {
            [`weeks.${weekNumber}`]: weekData,
            lastUpdated: serverTimestamp()
        })
    }

    return {
        plans,
        currentPlan,
        isLoading,
        selectPlan,
        createPlan,
        renamePlan,
        deletePlan,
        updatePlanWeek
    }
}
