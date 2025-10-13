import { db } from './firebase-config.js';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, arrayUnion, arrayRemove, writeBatch, serverTimestamp, onSnapshot, deleteDoc, addDoc } from "firebase/firestore";
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
    if (!currentUserId || !friendId) {
        console.error("Impossible de supprimer l'ami : ID utilisateur ou ID ami manquant.");
        return;
    }

    if (!confirm("Voulez-vous vraiment retirer cet ami ? Cette action est unilatérale.")) return;

    console.log(`Tentative de suppression de l'ami ${friendId} pour l'utilisateur ${currentUserId}`);
    const userRef = doc(db, "users", currentUserId);

    try {
        await updateDoc(userRef, { 
            friends: arrayRemove(friendId) 
        });
        console.log("Ami supprimé avec succès de la base de données.");
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
        const endTerm = lowerCaseTerm + '\uf8ff';

        // Requête 1 : Recherche par nom
        const nameQuery = query(
            collection(db, "users"), 
            where("displayName_lowercase", ">=", lowerCaseTerm),
            where("displayName_lowercase", "<", endTerm)
        );

        // Requête 2 : Recherche par email
        const emailQuery = query(collection(db, "users"), where("email", "==", lowerCaseTerm));

        // Exécute les deux requêtes en parallèle
        const [nameSnapshot, emailSnapshot] = await Promise.all([getDocs(nameQuery), getDocs(emailQuery)]);

        // Fusionne les résultats sans doublons
        const results = new Map();
        nameSnapshot.forEach(doc => results.set(doc.id, doc.data()));
        emailSnapshot.forEach(doc => results.set(doc.id, doc.data()));

        resultsContainer.innerHTML = '';
        if (results.size === 0) {
            resultsContainer.innerHTML = '<p class="text-gray-500">Aucun utilisateur trouvé.</p>';
            return;
        }

        results.forEach(userData => {
            if (userData.uid === currentUserId) return; // Ne pas s'afficher soi-même

            const card = document.createElement('div');
            card.className = 'bg-gray-50 p-2 rounded-lg flex items-center justify-between';
            card.innerHTML = `
                <div class="flex items-center">
                    <img src="${userData.photoURL || 'https://placehold.co/32'}" class="w-8 h-8 rounded-full mr-2">
                    <span class="font-medium text-sm">${userData.displayName} (${userData.email})</span>
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
    const q1 = query(collection(db, "friend_requests"), 
        where("senderId", "==", senderId), 
        where("receiverId", "==", receiverId)
    );
    const q2 = query(collection(db, "friend_requests"),
        where("senderId", "==", receiverId),
        where("receiverId", "==", senderId)
    );

    const [existingRequest1, existingRequest2] = await Promise.all([getDocs(q1), getDocs(q2)]);

    if (!existingRequest1.empty || !existingRequest2.empty) {
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

export async function acceptFriendRequest(requestId) {
    try {
        const requestRef = doc(db, "friend_requests", requestId);
        // La Cloud Function se chargera de la logique de création d'amitié
        await updateDoc(requestRef, { status: 'accepted' });
    } catch (error) {
        console.error("Erreur lors de l'acceptation de la demande d'ami: ", error);
        throw error;
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