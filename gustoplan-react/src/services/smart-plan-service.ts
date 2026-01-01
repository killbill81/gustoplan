import { httpsCallable } from 'firebase/functions'
import { functions } from '@/lib/firebase'

export async function suggestMenu(planId: string, weekNumber: number) {
    const suggest = httpsCallable(functions, 'suggestMenu')
    try {
        const result = await suggest({ planId, weekNumber })
        return result.data
    } catch (error) {
        console.error("Error calling suggestMenu function:", error)
        throw error
    }
}
