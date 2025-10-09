
import { db } from './firebase-config.js';
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { getCurrentUserId } from './auth.js';

const shareModal = {
    modal: document.getElementById('share-modal'),
    closeBtn: document.getElementById('close-share-modal'),
    title: document.getElementById('share-modal-title'),
    friendsList: document.getElementById('share-friends-list'),
    sharePlanCheckbox: document.getElementById('share-planning-checkbox'),
    shareShoppingListCheckbox: document.getElementById('share-shopping-list-checkbox'),
    confirmBtn: document.getElementById('confirm-share-btn'),
};

let contentToShare = {};

function closeShareModal() {
    shareModal.modal.classList.add('hidden');
}

async function sendShareInvite() {
    const senderId = getCurrentUserId();
    if (!senderId || !contentToShare.plan) return;

    const selectedFriends = Array.from(shareModal.friendsList.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    const shareMode = document.querySelector('input[name="share-mode"]:checked')?.value;

    if (selectedFriends.length === 0) {
        alert("Veuillez sélectionner au moins un ami.");
        return;
    }
    if (!shareMode) {
        alert("Veuillez sélectionner un mode de partage.");
        return;
    }

    shareModal.confirmBtn.disabled = true;
    shareModal.confirmBtn.textContent = 'Envoi en cours...';

    try {
        const sharesRef = collection(db, 'shares');
        let shareData = {};

        if (shareMode === 'collaborate') {
            shareData = {
                senderId: senderId,
                createdAt: new Date(),
                type: 'collaborative_plan_invite',
                planId: contentToShare.plan.id,
                planName: contentToShare.plan.name,
            };
        } else { // mode 'copy'
            shareData = {
                senderId: senderId,
                createdAt: new Date(),
                type: 'share', // The old type for copying
                plan: { // Explicitly build the object to copy
                    name: contentToShare.plan.name,
                    weeks: contentToShare.plan.weeks || {},
                    manualItems: contentToShare.plan.manualItems || [],
                    defaultNumPeople: contentToShare.plan.defaultNumPeople || 1,
                    startDay: contentToShare.plan.startDay || 'Lundi'
                }
            };
        }

        for (const receiverId of selectedFriends) {
            await addDoc(sharesRef, {
                ...shareData,
                receiverId: receiverId,
                status: 'pending'
            });
        }

        closeShareModal();
        alert("Partage envoyé avec succès !");

    } catch (error) {
        console.error("Erreur lors de l'envoi du partage : ", error);
        alert("Une erreur est survenue lors de l'envoi du partage.");
    } finally {
        shareModal.confirmBtn.disabled = false;
        shareModal.confirmBtn.textContent = 'Envoyer le partage';
    }
}

export async function openShareModal(options = {}) {
    const { plan } = options;
    if (!plan) {
        alert("Aucun plan sélectionné à partager.");
        return;
    }
    contentToShare = { plan };

    shareModal.title.textContent = `Partager le plan "${plan.name}"`;
    
    shareModal.friendsList.innerHTML = '<p class="text-gray-500">Chargement des amis...</p>';
    shareModal.modal.classList.remove('hidden');

    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;

    try {
        const userDoc = await getDoc(doc(db, 'users', currentUserId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const friendIds = userData.friends || [];

            if (friendIds.length === 0) {
                shareModal.friendsList.innerHTML = '<p class="text-gray-500">Vous n\'avez pas d\'amis à qui partager.</p>';
                return;
            }

            shareModal.friendsList.innerHTML = '';

            for (const friendId of friendIds) {
                const friendDoc = await getDoc(doc(db, 'users', friendId));
                if (friendDoc.exists()) {
                    const friend = friendDoc.data();
                    const friendLabel = document.createElement('label');
                    friendLabel.className = 'flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer';
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.value = friend.uid;
                    checkbox.className = 'form-checkbox h-5 w-5 text-tomato rounded focus:ring-tomato';
                    friendLabel.appendChild(checkbox);

                    const userImg = document.createElement('img');
                    userImg.src = friend.photoURL || 'https://placehold.co/40x40';
                    userImg.alt = friend.displayName;
                    userImg.className = 'w-8 h-8 rounded-full ml-3 mr-3';
                    friendLabel.appendChild(userImg);

                    const userName = document.createElement('span');
                    userName.className = 'font-medium';
                    userName.textContent = friend.displayName || friend.email;
                    friendLabel.appendChild(userName);

                    shareModal.friendsList.appendChild(friendLabel);
                }
            }
        }
    } catch (error) {
        console.error("Erreur lors du chargement des amis pour le partage : ", error);
        shareModal.friendsList.innerHTML = '<p class="text-red-500">Une erreur est survenue.</p>';
    }
}

shareModal.closeBtn?.addEventListener('click', closeShareModal);
shareModal.modal?.addEventListener('click', (e) => { if (e.target === shareModal.modal) closeShareModal(); });
shareModal.confirmBtn?.addEventListener('click', sendShareInvite);
