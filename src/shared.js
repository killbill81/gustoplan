import { db } from './firebase-config.js';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc, orderBy, onSnapshot } from "firebase/firestore";
import { getCurrentUserId } from './auth.js';

export default function init() {
    const unsubscribeSentShares = loadSentShares();
    loadReceivedShares();

    // Return a cleanup function to be called by the router
    return () => {
        if (typeof unsubscribeSentShares === 'function') {
            unsubscribeSentShares();
        }
    };
}

// --- RECEIVED SHARES --- //

async function loadReceivedShares() {
    const container = document.getElementById('received-shares-container');
    const currentUserId = getCurrentUserId();
    if (!currentUserId || !container) return;

    container.innerHTML = '<p class="text-gray-500">Chargement des partages reçus...</p>';

    try {
        // Query 1: Plans copied to the user
        const qCopied = query(collection(db, "plans"), where("userId", "==", currentUserId), where("isShared", "==", true));
        
        // Query 2: Plans where the user is a collaborator
        const qCollab = query(collection(db, "plans"), where("collaborators", "array-contains", currentUserId));

        const [copiedSnap, collabSnap] = await Promise.all([getDocs(qCopied), getDocs(qCollab)]);

        let receivedItems = [];
        copiedSnap.forEach(doc => receivedItems.push({ id: doc.id, type: 'Planification (Copie)', ...doc.data() }));
        collabSnap.forEach(doc => receivedItems.push({ id: doc.id, type: 'Planification (Collaboratif)', ...doc.data() }));

        if (receivedItems.length === 0) {
            container.innerHTML = '<p class="text-gray-500">Vous n\'avez aucun contenu partagé par d\'autres utilisateurs.</p>';
            return;
        }

        receivedItems.sort((a, b) => (b.sharedAt?.seconds || b.lastUpdated?.seconds || 0) - (a.sharedAt?.seconds || a.lastUpdated?.seconds || 0));

        container.innerHTML = '';
        for (const item of receivedItems) {
            const ownerId = item.originalOwnerId || item.userId;
            if (!ownerId) continue;
            
            const ownerDoc = await getDoc(doc(db, 'users', ownerId));
            const ownerName = ownerDoc.exists() ? ownerDoc.data().displayName : 'Utilisateur inconnu';
            container.appendChild(createReceivedCard(item, ownerName));
        }

    } catch (error) {
        console.error("Erreur lors du chargement des partages reçus : ", error);
        container.innerHTML = '<p class="text-red-500">Une erreur est survenue.</p>';
    }
}

function createReceivedCard(item, ownerName) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg p-4 flex justify-between items-center shadow-sm';

    const infoDiv = document.createElement('div');
    const title = document.createElement('p');
    title.className = 'font-bold text-gray-800';
    
    let typeLabel = '';
    if (item.type.includes('Collaboratif')) {
        typeLabel = ' <span class="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Collab</span>';
    } else if (item.type.includes('Copie')) {
        typeLabel = ' <span class="text-xs font-medium bg-gray-200 text-gray-800 px-2 py-1 rounded-full">Copie</span>';
    }
    title.innerHTML = `${item.name}${typeLabel}`;

    const subtitle = document.createElement('p');
    subtitle.className = 'text-sm text-gray-500 mt-1';
    const sharedDate = item.sharedAt ? new Date(item.sharedAt.seconds * 1000).toLocaleDateString('fr-FR') : (item.lastUpdated ? new Date(item.lastUpdated.seconds * 1000).toLocaleDateString('fr-FR') : 'date inconnue');
    subtitle.textContent = `Partagé par ${ownerName} le ${sharedDate}`;
    
    infoDiv.appendChild(title);
    infoDiv.appendChild(subtitle);
    card.appendChild(infoDiv);

    const deleteButton = document.createElement('button');
deleteButton.className = 'text-red-500 hover:bg-red-50 text-sm px-3 py-1 rounded-md';
    deleteButton.addEventListener('click', () => deleteReceivedItem(item.id, item.type));
    card.appendChild(deleteButton);

    return card;
}

async function deleteReceivedItem(itemId, itemType) {
    if (!confirm(`Voulez-vous vraiment supprimer cette ${itemType.toLowerCase()} partagée ?`)) return;

    try {
        const collectionName = itemType.startsWith('Planification') ? 'plans' : 'shopping_lists';
        const docRef = doc(db, collectionName, itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().userId === getCurrentUserId()) {
            await deleteDoc(docRef);
            loadReceivedShares(); // Refresh the list
        } else {
            alert("Vous n'avez pas la permission de supprimer cet élément ou il a déjà été supprimé.");
            loadReceivedShares();
        }
    } catch (error) {
        console.error("Erreur de suppression: ", error);
        alert("Une erreur est survenue.");
    }
}


// --- SENT SHARES --- //

async function loadSentShares() {
    const sentContainer = document.getElementById('sent-shares-container');
    const currentUserId = getCurrentUserId();
    if (!currentUserId || !sentContainer) return () => {}; // Return empty cleanup

    sentContainer.innerHTML = '<p class="text-gray-500">Chargement des partages envoyés...</p>';

    const sharesRef = collection(db, 'shares');
    const q = query(sharesRef, where('senderId', '==', currentUserId));

    // Return the unsubscribe function for the router to call
    return onSnapshot(q, async (querySnapshot) => {
        if (querySnapshot.empty) {
            sentContainer.innerHTML = '<p class="text-gray-500">Vous n\'avez envoyé aucun partage.</p>';
            return;
        }

        const sentShares = querySnapshot.docs.sort((a, b) => 
            (b.data().createdAt?.seconds || 0) - (a.data().createdAt?.seconds || 0)
        );

        sentContainer.innerHTML = '';
        for (const shareDoc of sentShares) {
            const share = shareDoc.data();
            try {
                const receiverDoc = await getDoc(doc(db, 'users', share.receiverId));
                if (receiverDoc.exists()) {
                    const receiver = receiverDoc.data();
                    sentContainer.appendChild(createSentCard(share, receiver.displayName, shareDoc.id));
                }
            } catch (e) {
                console.error("Could not load receiver for sent share", e);
            }
        }
    }, (error) => {
        console.error("Erreur lors du chargement des partages envoyés : ", error);
        if (sentContainer) {
            sentContainer.innerHTML = '<p class="text-red-500">Une erreur est survenue.</p>';
        }
    });
}

function createSentCard(share, personName, shareId) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg p-4 flex justify-between items-center shadow-sm';

    const infoDiv = document.createElement('div');
    const title = document.createElement('p');
    title.className = 'font-bold text-gray-800';
    let sharedItems = [];
    if (share.plan) sharedItems.push('Planification');
    if (share.shoppingList) sharedItems.push('Liste de courses');
    title.textContent = sharedItems.join(' et ');

    const subtitle = document.createElement('p');
    subtitle.className = 'text-sm text-gray-500';
    const sharedDate = new Date(share.createdAt.seconds * 1000).toLocaleDateString('fr-FR');
    subtitle.textContent = `Envoyé à ${personName} le ${sharedDate}`;
    
    infoDiv.appendChild(title);
    infoDiv.appendChild(subtitle);
    card.appendChild(infoDiv);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'flex items-center space-x-4';

    const statusBadge = document.createElement('span');
    statusBadge.textContent = share.status;
    let badgeColor = 'bg-gray-200 text-gray-800';
    switch(share.status) {
        case 'accepted': badgeColor = 'bg-green-100 text-green-800'; break;
        case 'declined': badgeColor = 'bg-red-100 text-red-800'; break;
        case 'pending': badgeColor = 'bg-yellow-100 text-yellow-800'; break;
    }
    statusBadge.className = `text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${badgeColor}`;
    actionsDiv.appendChild(statusBadge);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'text-red-500 hover:bg-red-50 text-sm px-3 py-1 rounded-md';
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.title = "Annuler le partage";
    deleteButton.addEventListener('click', () => deleteSentShare(shareId));
    actionsDiv.appendChild(deleteButton);

    card.appendChild(actionsDiv);
    return card;
}

async function deleteSentShare(shareId) {
    if (!confirm("Voulez-vous vraiment annuler ce partage ? L\'autre utilisateur ne le verra plus.")) return;

    try {
        await deleteDoc(doc(db, 'shares', shareId));
        loadSentShares();
    } catch (error) {
        console.error("Erreur lors de la suppression du partage: ", error);
        alert("Une erreur est survenue.");
    }
}