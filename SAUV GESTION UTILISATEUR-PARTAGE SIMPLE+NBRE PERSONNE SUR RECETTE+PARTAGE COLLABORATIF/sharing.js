
import { db } from './firebase-config.js';
import { doc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
    if (!senderId) return;

    const selectedFriends = Array.from(shareModal.friendsList.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    
    if (selectedFriends.length === 0) {
        alert("Veuillez sélectionner au moins un ami.");
        return;
    }

    shareModal.confirmBtn.disabled = true;
    shareModal.confirmBtn.textContent = 'Envoi en cours...';

    try {
        const sharesRef = collection(db, 'shares');
        const shareData = {
            senderId: senderId,
            week: contentToShare.plan ? contentToShare.plan.week : null,
            createdAt: new Date(),
            plan: contentToShare.plan || null,
            shoppingList: contentToShare.list || null,
        };

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
    const { plan, list } = options;
    contentToShare = { plan, list };

    let title = 'Partager';
    if (plan) {
        title = `Partager le plan de la semaine ${plan.week}`;
        shareModal.sharePlanCheckbox.parentElement.style.display = 'flex';
        shareModal.sharePlanCheckbox.checked = true;
        shareModal.sharePlanCheckbox.disabled = true;
    } else {
        shareModal.sharePlanCheckbox.parentElement.style.display = 'none';
        shareModal.sharePlanCheckbox.checked = false;
        shareModal.sharePlanCheckbox.disabled = false;
    }

    if (list) {
        title = `Partager la liste "${list.name}"`;
        shareModal.shareShoppingListCheckbox.parentElement.style.display = 'flex';
        shareModal.shareShoppingListCheckbox.checked = true;
        shareModal.shareShoppingListCheckbox.disabled = true;
    } else {
        shareModal.shareShoppingListCheckbox.parentElement.style.display = 'none';
        shareModal.shareShoppingListCheckbox.checked = false;
        shareModal.shareShoppingListCheckbox.disabled = false;
    }
    
    shareModal.title.textContent = title;
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
