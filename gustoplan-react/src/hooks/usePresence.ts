import { useState, useEffect } from 'react'
import { rtdb, auth } from '@/lib/firebase'
import { ref, onValue, set, onDisconnect, serverTimestamp, remove, update } from 'firebase/database'
import { UserPresence } from '@/types/plan'

export function usePresence(planId: string | undefined) {
    const [presences, setPresences] = useState<Record<string, UserPresence>>({})

    useEffect(() => {
        const user = auth.currentUser
        if (!user || !planId || !rtdb) return

        const presenceRef = ref(rtdb, `plans_presence/${planId}`)
        const myStatusRef = ref(rtdb, `plans_presence/${planId}/${user.uid}`)

        const status = {
            uid: user.uid,
            displayName: user.displayName || user.email,
            photoURL: user.photoURL,
            status: 'idle',
            last_seen: serverTimestamp()
        }

        // Set initial status and configure onDisconnect
        set(myStatusRef, status)
        onDisconnect(myStatusRef).remove()

        // Listen for all presences
        const unsubscribe = onValue(presenceRef, (snapshot) => {
            setPresences(snapshot.val() || {})
        })

        return () => {
            remove(myStatusRef)
            unsubscribe()
        }
    }, [planId])

    const updateStatus = (status: string) => {
        const user = auth.currentUser
        if (!user || !planId || !rtdb) return

        const myStatusRef = ref(rtdb, `plans_presence/${planId}/${user.uid}`)
        update(myStatusRef, {
            status,
            last_seen: serverTimestamp()
        })
    }

    return { presences, updateStatus }
}
