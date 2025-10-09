import { db } from './firebase-config.js';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getCurrentUserId } from './auth.js';

export default function init() {
    loadReceivedShares();
    loadSentShares();
}

// --- RECEIVED SHARES --- //

async function loadReceivedShares() {
    const container = document.getElementById('received-shares-container');
    const currentUserId = getCurrentUserId();
    if (!currentUserId || !container) return;

    container.innerHTML = '<p class="text-gray-500">Chargement des partages reçus...</p>';

    try {
        // Query for all plans and lists belonging to the user
        const plansQuery = query(collection(db, "plans"), where("userId", "==", currentUserId));
        const listsQuery = query(collection(db, "shopping_lists"), where("userId", "==", currentUserId));

        const [planSnap, listSnap] = await Promise.all([getDocs(plansQuery), getDocs(listsQuery)]);

        let allItems = [];
        planSnap.forEach(doc => allItems.push({ id: doc.id, type: 'Planification', ...doc.data() }));
        listSnap.forEach(doc => allItems.push({ id: doc.id, type: 'Liste de courses', ...doc.data() }));

        // Filter for items that are actually shared
        const receivedItems = allItems.filter(item => item.isShared === true);

        if (receivedItems.length === 0) {
            container.innerHTML = '<p class="text-gray-500">Vous n\'avez aucun contenu partagé par d\'autres utilisateurs.</p>';
            return;
        }

        receivedItems.sort((a, b) => (b.sharedAt?.seconds || 0) - (a.sharedAt?.seconds || 0));

        container.innerHTML = '';
        for (const item of receivedItems) {
            if (!item.originalOwner) continue; // Safeguard for old data
            const ownerDoc = await getDoc(doc(db, 'users', item.originalOwner));
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
    title.textContent = `${item.type} : ${item.name}`;

    const subtitle = document.createElement('p');
    subtitle.className = 'text-sm text-gray-500';
    const sharedDate = item.sharedAt ? new Date(item.sharedAt.seconds * 1000).toLocaleDateString('fr-FR') : 'date inconnue';
    subtitle.textContent = `Reçu de ${ownerName} le ${sharedDate}`;
    
    infoDiv.appendChild(title);
    infoDiv.appendChild(subtitle);
    card.appendChild(infoDiv);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-ghost text-red-500 btn-sm';
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.title = "Supprimer ce contenu partagé";
    deleteButton.addEventListener('click', () => deleteReceivedItem(item.id, item.type));
    card.appendChild(deleteButton);

    return card;
}

async function deleteReceivedItem(itemId, itemType) {
    if (!confirm(`Voulez-vous vraiment supprimer cette ${itemType.toLowerCase()} partagée ?`)) return;

    try {
        const collectionName = itemType === 'Planification' ? 'plans' : 'shopping_lists';
        await deleteDoc(doc(db, collectionName, itemId));
        loadReceivedShares(); // Refresh the list
    } catch (error) {
        console.error("Erreur de suppression: ", error);
        alert("Une erreur est survenue.");
    }
}


// --- SENT SHARES --- //

async function loadSentShares() {
    const sentContainer = document.getElementById('sent-shares-container');
    const currentUserId = getCurrentUserId();
    if (!currentUserId || !sentContainer) return;

    sentContainer.innerHTML = '<p class="text-gray-500">Chargement des partages envoyés...</p>';

    try {
        const sharesRef = collection(db, 'shares');
        // Remove orderBy from the query to prevent needing a composite index
        const q = query(sharesRef, where('senderId', '==', currentUserId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            sentContainer.innerHTML = '<p class="text-gray-500">Vous n\'avez envoyé aucun partage.</p>';
            return;
        }

        // Sort the documents on the client-side
        const sentShares = querySnapshot.docs.sort((a, b) => 
            (b.data().createdAt?.seconds || 0) - (a.data().createdAt?.seconds || 0)
        );

        sentContainer.innerHTML = '';
        for (const shareDoc of sentShares) {
            const share = shareDoc.data();
            const receiverDoc = await getDoc(doc(db, 'users', share.receiverId));
            if (receiverDoc.exists()) {
                const receiver = receiverDoc.data();
                sentContainer.appendChild(createSentCard(share, receiver.displayName, shareDoc.id));
            }
        }
    } catch (error) {
        console.error("Erreur lors du chargement des partages envoyés : ", error);
        if (sentContainer) {
            sentContainer.innerHTML = '<p class="text-red-500">Une erreur est survenue.</p>';
        }
    }
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
    deleteButton.className = 'btn btn-ghost text-red-500 btn-sm';
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