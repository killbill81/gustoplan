
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
    // Restore share mode visibility
    const shareModeSelection = document.getElementById('share-mode-selection');
    if (shareModeSelection) {
        shareModeSelection.classList.remove('hidden');
    }
    // Restore original button text and listener
    shareModal.confirmBtn.textContent = 'Envoyer le partage';
    const newConfirmBtn = shareModal.confirmBtn.cloneNode(true);
    if (shareModal.confirmBtn.parentNode) {
        shareModal.confirmBtn.parentNode.replaceChild(newConfirmBtn, shareModal.confirmBtn);
        shareModal.confirmBtn = newConfirmBtn;
        newConfirmBtn.addEventListener('click', sendShareInvite);
    }
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

async function sendInvitation(planId) {
    const senderId = getCurrentUserId();
    if (!senderId || !planId) return;

    const selectedFriends = Array.from(shareModal.friendsList.querySelectorAll('input[type="checkbox"]:checked:not(:disabled)'))
        .map(cb => cb.value);

    if (selectedFriends.length === 0) {
        alert("Veuillez sélectionner au moins un ami à inviter.");
        return;
    }

    shareModal.confirmBtn.disabled = true;
    shareModal.confirmBtn.textContent = 'Envoi en cours...';

    try {
        const planDoc = await getDoc(doc(db, 'plans', planId));
        if (!planDoc.exists()) {
            throw new Error("Plan not found");
        }
        const planName = planDoc.data().name;

        const sharesRef = collection(db, 'shares');
        const shareData = {
            senderId: senderId,
            createdAt: new Date(),
            type: 'collaborative_plan_invite',
            planId: planId,
            planName: planName,
        };

        for (const receiverId of selectedFriends) {
            await addDoc(sharesRef, {
                ...shareData,
                receiverId: receiverId,
                status: 'pending'
            });
        }

        closeShareModal();
        alert("Invitation(s) envoyée(s) avec succès !");

    } catch (error) {
        console.error("Erreur lors de l'envoi de l'invitation : ", error);
        alert("Une erreur est survenue lors de l'envoi de l'invitation.");
    } finally {
        shareModal.confirmBtn.disabled = false;
        // The modal close function will reset the button text and event listener
    }
}

export async function openInviteParticipantModal(plan) {
    if (!plan || !plan.id) {
        alert("Plan non valide pour l'invitation.");
        return;
    }
    contentToShare = { plan }; // Use the same global variable

    shareModal.title.textContent = `Inviter à collaborer sur "${plan.name}"`;
    
    // Hide share mode selection, it's always collaborate
    const shareModeSelection = document.getElementById('share-mode-selection');
    if (shareModeSelection) {
        shareModeSelection.classList.add('hidden');
    }

    shareModal.friendsList.innerHTML = '<p class="text-gray-500">Chargement des amis...</p>';
    shareModal.modal.classList.remove('hidden');

    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;

    try {
        const userDoc = await getDoc(doc(db, 'users', currentUserId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const friendIds = userData.friends || [];
            const existingCollaborators = [plan.userId, ...(plan.collaborators || [])];

            if (friendIds.length === 0) {
                shareModal.friendsList.innerHTML = '<p class="text-gray-500">Vous n\'avez pas d\'amis à inviter.</p>';
                return;
            }

            shareModal.friendsList.innerHTML = '';

            for (const friendId of friendIds) {
                const friendDoc = await getDoc(doc(db, 'users', friendId));
                if (friendDoc.exists()) {
                    const friend = friendDoc.data();
                    const isAlreadyCollaborator = existingCollaborators.includes(friend.uid);

                    const friendLabel = document.createElement('label');
                    friendLabel.className = `flex items-center p-2 rounded-lg ${isAlreadyCollaborator ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`;
                    
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.value = friend.uid;
                    checkbox.className = 'form-checkbox h-5 w-5 text-tomato rounded focus:ring-tomato';
                    if (isAlreadyCollaborator) {
                        checkbox.disabled = true;
                        checkbox.checked = true;
                    }
                    friendLabel.appendChild(checkbox);

                    const userImg = document.createElement('img');
                    userImg.src = friend.photoURL || 'https://placehold.co/40x40';
                    userImg.alt = friend.displayName;
                    userImg.className = 'w-8 h-8 rounded-full ml-3 mr-3';
                    friendLabel.appendChild(userImg);

                    const userName = document.createElement('span');
                    userName.className = 'font-medium';
                    userName.textContent = friend.displayName || friend.email;
                    if (isAlreadyCollaborator) {
                        const alreadyMemberSpan = document.createElement('span');
                        alreadyMemberSpan.className = 'text-xs text-gray-400 ml-2';
                        alreadyMemberSpan.textContent = '(déjà membre)';
                        userName.appendChild(alreadyMemberSpan);
                    }
                    friendLabel.appendChild(userName);

                    shareModal.friendsList.appendChild(friendLabel);
                }
            }
        }
    } catch (error) {
        console.error("Erreur lors du chargement des amis pour l'invitation : ", error);
        shareModal.friendsList.innerHTML = '<p class="text-red-500">Une erreur est survenue.</p>';
    }

    // Change button text and action
    shareModal.confirmBtn.textContent = 'Envoyer l\'invitation';
    
    // Clone and replace the button to remove old event listeners
    const newConfirmBtn = shareModal.confirmBtn.cloneNode(true);
    shareModal.confirmBtn.parentNode.replaceChild(newConfirmBtn, shareModal.confirmBtn);
    shareModal.confirmBtn = newConfirmBtn;
    
    newConfirmBtn.addEventListener('click', () => sendInvitation(plan.id));
}

shareModal.closeBtn?.addEventListener('click', closeShareModal);
shareModal.modal?.addEventListener('click', (e) => { if (e.target === shareModal.modal) closeShareModal(); });
shareModal.confirmBtn?.addEventListener('click', sendShareInvite);
