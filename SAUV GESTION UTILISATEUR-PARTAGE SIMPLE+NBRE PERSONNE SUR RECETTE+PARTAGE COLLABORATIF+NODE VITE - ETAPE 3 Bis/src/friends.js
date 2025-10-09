import { db } from './firebase-config.js';
import { collection, query, where, getDocs, doc, addDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { getCurrentUserId } from './auth.js';

// --- Exported Functions for Friend Request Handling ---

export async function acceptFriendRequest(requestId, senderId) {
    const currentUserId = getCurrentUserId();
    if (!currentUserId || !senderId) return;

    const requestRef = doc(db, 'friend_requests', requestId);
    const currentUserRef = doc(db, 'users', currentUserId);
    const senderUserRef = doc(db, 'users', senderId);

    try {
        await updateDoc(requestRef, { status: 'accepted' });
        await updateDoc(currentUserRef, { friends: arrayUnion(senderId) });
        await updateDoc(senderUserRef, { friends: arrayUnion(currentUserId) });
    } catch (error) {
        console.error("Erreur lors de l'acceptation de l'invitation : ", error);
        throw error; // Re-throw to be handled by the caller
    }
}

export async function declineFriendRequest(requestId) {
    const requestRef = doc(db, 'friend_requests', requestId);
    try {
        await updateDoc(requestRef, { status: 'declined' });
    } catch (error) {
        console.error("Erreur lors du refus de l'invitation : ", error);
        throw error; // Re-throw to be handled by the caller
    }
}


// --- Module Initialization ---

export default function init() {
    const searchInput = document.getElementById('search-friends-input');
    const searchButton = document.getElementById('search-friends-btn');
    const searchResultsContainer = document.getElementById('search-results-container');

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            searchUsers(searchTerm);
        } else {
            searchResultsContainer.innerHTML = '';
        }
    });

    async function searchUsers(searchTerm) {
        const currentUserId = getCurrentUserId();
        if (!currentUserId) return;

        searchResultsContainer.innerHTML = '<p class="text-gray-500">Recherche en cours...</p>';
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        try {
            const usersRef = collection(db, 'users');
            
            const nameQuery = query(usersRef, where('displayName_lowercase', '>=', lowerCaseSearchTerm), where('displayName_lowercase', '<=', lowerCaseSearchTerm + '\uf8ff'));
            const emailQuery = query(usersRef, where('email', '>=', lowerCaseSearchTerm), where('email', '<=', lowerCaseSearchTerm + '\uf8ff'));

            const [nameSnapshot, emailSnapshot] = await Promise.all([getDocs(nameQuery), getDocs(emailQuery)]);

            const users = new Map();
            nameSnapshot.forEach(doc => {
                if (doc.id !== currentUserId) {
                    users.set(doc.id, { id: doc.id, ...doc.data() });
                }
            });
            emailSnapshot.forEach(doc => {
                if (doc.id !== currentUserId && !users.has(doc.id)) {
                    users.set(doc.id, { id: doc.id, ...doc.data() });
                }
            });

            renderSearchResults(Array.from(users.values()));

        } catch (error) {
            console.error("Erreur lors de la recherche d'utilisateurs : ", error);
            searchResultsContainer.innerHTML = '<p class="text-red-500">Une erreur est survenue.</p>';
        }
    }

    function renderSearchResults(results) {
        searchResultsContainer.innerHTML = '';
        if (results.length === 0) {
            searchResultsContainer.innerHTML = '<p class="text-gray-500">Aucun utilisateur trouvé.</p>';
            return;
        }

        results.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'flex items-center justify-between p-2 bg-gray-100 rounded-lg';
            
            const userInfo = document.createElement('div');
            userInfo.className = 'flex items-center';
            
            const userImg = document.createElement('img');
            userImg.src = user.photoURL || 'https://placehold.co/40x40';
            userImg.alt = user.displayName;
            userImg.className = 'w-8 h-8 rounded-full mr-3';
            userInfo.appendChild(userImg);
            
            const userName = document.createElement('span');
            userName.className = 'font-medium';
            userName.textContent = user.displayName || user.email;
            userInfo.appendChild(userName);
            
            userDiv.appendChild(userInfo);

            const addButton = document.createElement('button');
            addButton.className = 'btn btn-primary btn-sm';
            addButton.innerHTML = '<i class="fas fa-user-plus"></i>';
            addButton.title = 'Envoyer une invitation';
            addButton.addEventListener('click', () => sendFriendRequest(user.id, addButton));
            
            userDiv.appendChild(addButton);
            searchResultsContainer.appendChild(userDiv);
        });
    }

    async function loadFriends() {
        const currentUserId = getCurrentUserId();
        if (!currentUserId) return;

        const friendsListContainer = document.getElementById('friends-list-container');
        if (!friendsListContainer) return; // Exit if container not on page
        friendsListContainer.innerHTML = '<p class="text-gray-500">Chargement...</p>';

        try {
            const userDoc = await getDoc(doc(db, 'users', currentUserId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const friendIds = userData.friends || [];

                if (friendIds.length === 0) {
                    friendsListContainer.innerHTML = '<p class="text-gray-500">Vous n\'avez pas encore d\'amis.</p>';
                    return;
                }

                friendsListContainer.innerHTML = '';

                for (const friendId of friendIds) {
                    const friendDoc = await getDoc(doc(db, 'users', friendId));
                    if (friendDoc.exists()) {
                        const friend = friendDoc.data();
                        const friendDiv = document.createElement('div');
                        friendDiv.className = 'flex items-center justify-between p-3 bg-white rounded-lg shadow-sm';

                        const userInfo = document.createElement('div');
                        userInfo.className = 'flex items-center';
                        const userImg = document.createElement('img');
                        userImg.src = friend.photoURL || 'https://placehold.co/40x40';
                        userImg.alt = friend.displayName;
                        userImg.className = 'w-10 h-10 rounded-full mr-4';
                        userInfo.appendChild(userImg);
                        const userName = document.createElement('span');
                        userName.className = 'font-bold text-gray-700';
                        userName.textContent = friend.displayName || friend.email;
                        userInfo.appendChild(userName);
                        friendDiv.appendChild(userInfo);

                        const actionsDiv = document.createElement('div');
                        friendDiv.appendChild(actionsDiv);

                        friendsListContainer.appendChild(friendDiv);
                    }
                }
            }
        } catch (error) {
            console.error("Erreur lors du chargement des amis : ", error);
            friendsListContainer.innerHTML = '<p class="text-red-500">Une erreur est survenue.</p>';
        }
    }

    loadFriends();

    async function sendFriendRequest(receiverId, button) {
        const senderId = getCurrentUserId();
        if (!senderId || !receiverId || senderId === receiverId) return;

        button.disabled = true;
        button.innerHTML = '<i class="fas fa-check"></i>';

        try {
            const requestsRef = collection(db, 'friend_requests');
            const q = query(requestsRef, 
                where('senderId', '==', senderId), 
                where('receiverId', '==', receiverId)
            );
            const q2 = query(requestsRef, 
                where('senderId', '==', receiverId), 
                where('receiverId', '==', senderId)
            );

            const [existingRequest, existingRequest2] = await Promise.all([getDocs(q), getDocs(q2)]);

            if (!existingRequest.empty || !existingRequest2.empty) {
                console.log("Une demande d\'ami existe déjà.");
                return;
            }

            await addDoc(requestsRef, {
                senderId: senderId,
                receiverId: receiverId,
                status: 'pending',
                createdAt: new Date()
            });

        } catch (error) {
            console.error("Erreur lors de l\'envoi de la demande d\'ami : ", error);
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-user-plus"></i>';
        }
    }
}