import { db } from './firebase-config.js';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getCurrentUserId } from './auth.js';

export default function init() {
    const acceptedSharesContainer = document.getElementById('accepted-shares-container');

    async function loadAcceptedShares() {
        const currentUserId = getCurrentUserId();
        if (!currentUserId || !acceptedSharesContainer) return;

        acceptedSharesContainer.innerHTML = '<p class="text-gray-500">Chargement de l\'historique...</p>';

        try {
            const sharesRef = collection(db, 'shares');
            const q = query(sharesRef, where('receiverId', '==', currentUserId), where('status', '==', 'accepted'));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                acceptedSharesContainer.innerHTML = '<p class="text-gray-500">Aucun partage accepté dans l\'historique.</p>';
                return;
            }

            acceptedSharesContainer.innerHTML = '';

            for (const shareDoc of querySnapshot.docs) {
                const share = shareDoc.data();
                const senderDoc = await getDoc(doc(db, 'users', share.senderId));
                if (senderDoc.exists()) {
                    const sender = senderDoc.data();
                    const shareDiv = document.createElement('div');
                    shareDiv.className = 'bg-gray-100 rounded-lg p-4 flex justify-between items-center';

                    const infoDiv = document.createElement('div');
                    const title = document.createElement('p');
                    title.className = 'font-bold text-gray-700';
                    let sharedItems = [];
                    if (share.plan) sharedItems.push('planification');
                    if (share.shoppingList) sharedItems.push('liste de courses');
                    title.textContent = sharedItems.join(' et ').charAt(0).toUpperCase() + sharedItems.join(' et ').slice(1);

                    const subtitle = document.createElement('p');
                    subtitle.className = 'text-sm text-gray-500';
                    const sharedDate = new Date(share.createdAt.seconds * 1000).toLocaleDateString('fr-FR');
                    subtitle.textContent = `Partage de ${sender.displayName || sender.email}, accepté le ${sharedDate}`;
                    
                    infoDiv.appendChild(title);
                    infoDiv.appendChild(subtitle);
                    shareDiv.appendChild(infoDiv);

                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'btn btn-ghost text-red-500 btn-sm';
                    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
                    deleteButton.title = "Supprimer cet élément de l'historique et les données associées";
                    deleteButton.addEventListener('click', () => deleteAcceptedShare(shareDoc.id, share));
                    shareDiv.appendChild(deleteButton);

                    acceptedSharesContainer.appendChild(shareDiv);
                }
            }
        } catch (error) {
            console.error("Erreur lors du chargement de l\'historique des partages : ", error);
            if (acceptedSharesContainer) {
                acceptedSharesContainer.innerHTML = '<p class="text-red-500">Une erreur est survenue lors du chargement de l\'historique.</p>';
            }
        }
    }

    async function deleteAcceptedShare(shareId, shareData) {
        const currentUserId = getCurrentUserId();
        if (!currentUserId) return;

        if (!confirm("Voulez-vous vraiment supprimer cet élément de l'historique ? Le plan partagé associé sera aussi supprimé.")) return;

        try {
            // Find and delete the copied plan, if it exists
            if (shareData.plan) {
                const plansRef = collection(db, "plans");
                const q = query(plansRef, 
                    where("userId", "==", currentUserId), 
                    where("isShared", "==", true), 
                    where("originalOwner", "==", shareData.senderId),
                    where("week", "==", shareData.week)
                );
                const planSnap = await getDocs(q);
                if (!planSnap.empty) {
                    for (const docToDelete of planSnap.docs) {
                        await deleteDoc(docToDelete.ref);
                    }
                }
            }
            
            // Note: shopping list deletion is not implemented as the identifier is not reliable.

            // Delete the share document itself to remove from history
            await deleteDoc(doc(db, 'shares', shareId));

            // Refresh the history view
            await loadAcceptedShares();

        } catch (error) {
            console.error("Erreur lors de la suppression du partage accepté: ", error);
            alert("Une erreur est survenue.");
        }
    }

    loadAcceptedShares();
}