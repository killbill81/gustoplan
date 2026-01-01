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
    getDoc,
    arrayUnion,
    serverTimestamp
} from 'firebase/firestore'

export function useSharing() {
    const [friends, setFriends] = useState<any[]>([])
    const [invites, setInvites] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const user = auth.currentUser
        if (!user) return

        // 1. Listen to user document for friends list
        const unsubUser = onSnapshot(doc(db, 'users', user.uid), async (snap) => {
            const userData = snap.data()
            const friendIds = userData?.friends || []

            // In a real app, we'd batch fetch these or use a friends collection. 
            // For parity with legacy, we fetch them one by one or in a small query.
            if (friendIds.length > 0) {
                // Simplified: we'll just set the IDs for now or fetch minimal profiles
                const friendProfiles = await Promise.all(friendIds.map(async (id: string) => {
                    const fSnap = await getDoc(doc(db, 'users', id))
                    return { uid: id, ...fSnap.data() }
                }))
                setFriends(friendProfiles)
            } else {
                setFriends([])
            }
        })

        // 2. Listen to pending invites
        const qInvites = query(
            collection(db, 'shares'),
            where('receiverId', '==', user.uid),
            where('status', '==', 'pending')
        )
        const unsubInvites = onSnapshot(qInvites, (snapshot) => {
            setInvites(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        })

        setIsLoading(false)
        return () => {
            unsubUser()
            unsubInvites()
        }
    }, [])

    const sendInvite = async (planId: string, planName: string, receiverId: string) => {
        const user = auth.currentUser
        if (!user) return

        return addDoc(collection(db, 'shares'), {
            senderId: user.uid,
            senderName: user.displayName || user.email,
            receiverId,
            planId,
            planName,
            status: 'pending',
            type: 'collaborative_plan_invite',
            createdAt: serverTimestamp()
        })
    }

    const acceptInvite = async (inviteId: string, planId: string) => {
        const user = auth.currentUser
        if (!user) return

        // 1. Update invite status
        await updateDoc(doc(db, 'shares', inviteId), { status: 'accepted' })

        // 2. Add user as collaborator to plan
        return updateDoc(doc(db, 'plans', planId), {
            collaborators: arrayUnion(user.uid),
            type: 'collaborative'
        })
    }

    const declineInvite = async (inviteId: string) => {
        return updateDoc(doc(db, 'shares', inviteId), { status: 'declined' })
    }

    return {
        friends,
        invites,
        isLoading,
        sendInvite,
        acceptInvite,
        declineInvite
    }
}
