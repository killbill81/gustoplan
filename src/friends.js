import { db } from './firebase-config.js';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, arrayUnion, arrayRemove, writeBatch, serverTimestamp, onSnapshot } from "firebase/firestore";
import { getCurrentUser } from './auth.js';

let unsubscribeFriends = () => {};

export default function init() {
    const searchInput = document.getElementById('search-friends-input');
    const searchBtn = document.getElementById('search-friends-btn');

    searchBtn.addEventListener('click', () => searchUsers(searchInput.value));
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') searchUsers(searchInput.value);
    });

    loadFriends();
    loadSentFriendRequests();

    return () => {
        if (unsubscribeFriends) unsubscribeFriends();
    };
}

async function loadFriends() {
    const container = document.getElementById('friends-list-container');
    const currentUserId = getCurrentUser()?.uid;
    if (!currentUserId || !container) return;

    container.innerHTML = '<p class="text-gray-500">Chargement...</p>';

    const userDocRef = doc(db, 'users', currentUserId);
    unsubscribeFriends = onSnapshot(userDocRef, async (docSnap) => {
        if (!docSnap.exists()) {
            container.innerHTML = '<p class="text-red-500">Erreur: Utilisateur non trouvé.</p>';
            return;
        }

        const friendIds = docSnap.data().friends || [];
        container.innerHTML = '';

        if (friendIds.length === 0) {
            container.innerHTML = '<p class="text-gray-500">Vous n\'avez pas encore d\'amis. Utilisez la recherche pour en ajouter.</p>';
            return;
        }

        for (const friendId of friendIds) {
            try {
                const friendDoc = await getDoc(doc(db, 'users', friendId));
                if (friendDoc.exists()) {
                    container.appendChild(createFriendCard(friendDoc.data()));
                }
            } catch (e) { console.error("Erreur de chargement d'un ami", e); }
        }
    });
}

function createFriendCard(friendData) {
    const card = document.createElement('div');
    card.className = 'bg-white p-3 rounded-lg flex items-center justify-between shadow-sm';

    const userInfo = document.createElement('div');
    userInfo.className = 'flex items-center';
    userInfo.innerHTML = `
        <img src="${friendData.photoURL || 'https://placehold.co/40'}" alt="Avatar" class="w-10 h-10 rounded-full mr-3">
        <div>
            <p class="font-bold">${friendData.displayName}</p>
            <p class="text-sm text-gray-500">${friendData.email}</p>
        </div>
    `;

    const removeButton = document.createElement('button');
    removeButton.className = 'btn btn-ghost text-red-500 btn-sm';
    removeButton.innerHTML = '<i class="fas fa-user-times"></i>';
    removeButton.title = 'Retirer cet ami';
    removeButton.addEventListener('click', () => removeFriend(friendData.uid));

    card.appendChild(userInfo);
    card.appendChild(removeButton);
    return card;
}

async function removeFriend(friendId) {
    const currentUserId = getCurrentUser()?.uid;
    if (!currentUserId || !friendId) return;

    if (!confirm("Voulez-vous vraiment retirer cet ami ?")) return;

    const userRef = doc(db, "users", currentUserId);
    const friendRef = doc(db, "users", friendId);

    const batch = writeBatch(db);
    batch.update(userRef, { friends: arrayRemove(friendId) });
    batch.update(friendRef, { friends: arrayRemove(currentUserId) });

    try {
        await batch.commit();
        // loadFriends() will be called automatically by the onSnapshot listener
    } catch (error) {
        console.error("Erreur lors de la suppression de l'ami: ", error);
        alert("Une erreur est survenue.");
    }
}

async function searchUsers(searchTerm) {
    const resultsContainer = document.getElementById('search-results-container');
    const currentUserId = getCurrentUser()?.uid;
    if (!searchTerm || !resultsContainer) return;

    resultsContainer.innerHTML = '<p class="text-gray-500">Recherche en cours...</p>';

    try {
        const lowerCaseTerm = searchTerm.toLowerCase();
        const q = query(collection(db, "users"), where("keywords", "array-contains", lowerCaseTerm));
        const querySnapshot = await getDocs(q);

        resultsContainer.innerHTML = '';
        if (querySnapshot.empty) {
            resultsContainer.innerHTML = '<p class="text-gray-500">Aucun utilisateur trouvé.</p>';
            return;
        }

        querySnapshot.forEach(doc => {
            const userData = doc.data();
            if (userData.uid === currentUserId) return; // Don't show self

            const card = document.createElement('div');
            card.className = 'bg-gray-50 p-2 rounded-lg flex items-center justify-between';
            card.innerHTML = `
                <div class="flex items-center">
                    <img src="${userData.photoURL || 'https://placehold.co/32'}" class="w-8 h-8 rounded-full mr-2">
                    <span class="font-medium text-sm">${userData.displayName}</span>
                </div>
            `;
            const addButton = document.createElement('button');
            addButton.className = 'btn btn-secondary btn-xs';
            addButton.innerHTML = '<i class="fas fa-user-plus"></i>';
            addButton.addEventListener('click', () => sendFriendRequest(userData.uid));
            card.appendChild(addButton);
            resultsContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Erreur de recherche: ", error);
        resultsContainer.innerHTML = '<p class="text-red-500">Erreur de recherche.</p>';
    }
}

async function sendFriendRequest(receiverId) {
    const senderId = getCurrentUser()?.uid;
    if (!senderId || senderId === receiverId) return;

    // Check if a request already exists
    const q = query(collection(db, "friend_requests"), 
        where("senderId", "in", [senderId, receiverId]), 
        where("receiverId", "in", [senderId, receiverId])
    );
    const existingRequest = await getDocs(q);
    if (!existingRequest.empty) {
        return alert("Une demande d'ami existe déjà avec cet utilisateur.");
    }

    // Check if they are already friends
    const userDoc = await getDoc(doc(db, 'users', senderId));
    if (userDoc.data()?.friends?.includes(receiverId)) {
        return alert("Vous êtes déjà ami avec cet utilisateur.");
    }

    try {
        await addDoc(collection(db, "friend_requests"), {
            senderId: senderId,
            receiverId: receiverId,
            status: 'pending',
            createdAt: serverTimestamp()
        });
        alert("Demande d'ami envoyée !");
    } catch (error) {
        console.error("Erreur lors de l'envoi de la demande d'ami: ", error);
        alert("Une erreur est survenue.");
    }
}

async function loadSentFriendRequests() {
    const pendingContainer = document.getElementById('pending-requests-container');
    const declinedContainer = document.getElementById('declined-requests-container');
    const currentUserId = getCurrentUser()?.uid;

    if (!currentUserId || !pendingContainer || !declinedContainer) return;

    pendingContainer.innerHTML = '<p class="text-gray-500">Chargement...</p>';
    declinedContainer.innerHTML = '<p class="text-gray-500">Chargement...</p>';

    try {
        const q = query(collection(db, "friend_requests"), where("senderId", "==", currentUserId));
        const querySnapshot = await getDocs(q);

        const pendingRequests = [];
        const declinedRequests = [];

        for (const docSnap of querySnapshot.docs) {
            const request = { id: docSnap.id, ...docSnap.data() };
            const receiverDoc = await getDoc(doc(db, 'users', request.receiverId));
            if (receiverDoc.exists()) {
                request.receiver = receiverDoc.data();
            }

            if (request.status === 'pending') {
                pendingRequests.push(request);
            } else if (request.status === 'declined') {
                declinedRequests.push(request);
            }
        }

        // Render pending requests
        pendingContainer.innerHTML = '';
        if (pendingRequests.length > 0) {
            pendingRequests.forEach(req => pendingContainer.appendChild(createRequestCard(req)));
        } else {
            pendingContainer.innerHTML = '<p class="text-gray-500">Aucune demande en attente.</p>';
        }

        // Render declined requests
        declinedContainer.innerHTML = '';
        if (declinedRequests.length > 0) {
            declinedRequests.forEach(req => declinedContainer.appendChild(createRequestCard(req)));
        } else {
            declinedContainer.innerHTML = '<p class="text-gray-500">Aucune demande rejetée.</p>';
        }

    } catch (error) {
        console.error("Erreur lors du chargement des demandes envoyées: ", error);
        pendingContainer.innerHTML = '<p class="text-red-500">Erreur de chargement.</p>';
        declinedContainer.innerHTML = '<p class="text-red-500">Erreur de chargement.</p>';
    }
}

function createRequestCard(request) {
    const card = document.createElement('div');
    card.className = 'bg-white p-3 rounded-lg flex items-center justify-between shadow-sm';

    const receiver = request.receiver;
    const userInfo = document.createElement('div');
    userInfo.className = 'flex items-center';
    userInfo.innerHTML = `
        <img src="${receiver?.photoURL || 'https://placehold.co/40'}" alt="Avatar" class="w-10 h-10 rounded-full mr-3">
        <div>
            <p class="font-bold">${receiver?.displayName || 'Utilisateur inconnu'}</p>
            <p class="text-sm text-gray-500">Statut : <span class="font-medium">${request.status}</span></p>
        </div>
    `;

    const cancelButton = document.createElement('button');
    cancelButton.className = 'btn btn-ghost text-red-500 btn-sm';
    cancelButton.innerHTML = '<i class="fas fa-times-circle"></i>';
    cancelButton.title = 'Annuler la demande';
    cancelButton.addEventListener('click', async () => {
        if (confirm("Voulez-vous vraiment annuler cette demande ?")) {
            await deleteDoc(doc(db, 'friend_requests', request.id));
            loadSentFriendRequests(); // Refresh the list
        }
    });

    card.appendChild(userInfo);
    card.appendChild(cancelButton);
    return card;
}

// --- Functions to be called by notifications.js ---

export async function acceptFriendRequest(requestId, senderId) {
    const currentUserId = getCurrentUser()?.uid;
    if (!currentUserId || !senderId) return;

    const userRef = doc(db, "users", currentUserId);
    const senderRef = doc(db, "users", senderId);
    const requestRef = doc(db, "friend_requests", requestId);

    const batch = writeBatch(db);

    // Add each user to the other's friends list
    batch.update(userRef, { friends: arrayUnion(senderId) });
    batch.update(senderRef, { friends: arrayUnion(currentUserId) });

    // Delete the friend request
    batch.delete(requestRef);

    try {
        await batch.commit();
    } catch (error) {
        console.error("Erreur lors de l'acceptation de la demande d'ami: ", error);
        throw error; // Re-throw to be caught by the caller
    }
}

export async function declineFriendRequest(requestId) {
    try {
        const requestRef = doc(db, "friend_requests", requestId);
        await updateDoc(requestRef, { status: 'declined' });
    } catch (error) {
        console.error("Erreur lors du refus de la demande d'ami: ", error);
        throw error; // Re-throw to be caught by the caller
    }
}