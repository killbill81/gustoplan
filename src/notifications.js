import { db } from './firebase-config.js';
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc, addDoc, arrayUnion } from "firebase/firestore";
import { getCurrentUserId } from './auth.js';
import { acceptFriendRequest, declineFriendRequest } from './friends.js';
import { addCollaborator } from './plans.js';

// --- State ---
let pendingShares = [];
let pendingFriendRequests = [];
let unsubscribeShares = () => {};
let unsubscribeFriendRequests = () => {};

// --- UI Elements ---
const ui = {
    btn: null,
    btnMobile: null, // Added for mobile button
    badge: null,
    badgeMobile: null,
    dropdown: null,
    list: null,
};

// --- Share Handling Functions ---
async function acceptShare(shareId, shareData, sender) {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;

    try {
        // First, mark the share as accepted
        const shareRef = doc(db, 'shares', shareId);
        await updateDoc(shareRef, { status: 'accepted' });

        // If it's a plan copy, create a new plan for the current user
        if (shareData.plan) {
            const ownerName = sender.displayName || 'Inconnu';
            const newPlanName = `Copie de "${shareData.plan.name}" (de ${ownerName})`;

            const newPlan = {
                ...shareData.plan,
                userId: currentUserId, // The new owner is the current user
                name: newPlanName,
                isShared: true, // Mark it as a copy of a share
                originalOwnerId: shareData.senderId,
                sharedAt: new Date(),
                collaborators: [] // A copied plan has no collaborators
            };
            delete newPlan.id; // Remove original ID to get a new one from Firestore
            await addDoc(collection(db, "plans"), newPlan);
        }

        // The logic for shopping list copy can remain if needed in the future
        if (shareData.shoppingList) {
            await addDoc(collection(db, 'shopping_lists'), {
                name: `${shareData.shoppingList.name} (de ${sender.displayName})`,
                ingredients: shareData.shoppingList.ingredients,
                userId: currentUserId,
                isShared: true,
                originalOwner: sender.uid,
                sharedAt: new Date()
            });
        }
    } catch (error) {
        console.error("Erreur lors de l'acceptation du partage : ", error);
        alert("Une erreur est survenue.");
    }
}

async function acceptCollaborativePlan(shareId, shareData) {
    const currentUserId = getCurrentUserId();
    if (!currentUserId || !shareData || !shareData.planId) return;

    try {
        // Add the user to the plan's collaborators
        await addCollaborator(shareData.planId, currentUserId);

        // Then, mark the share as accepted
        const shareRef = doc(db, 'shares', shareId);
        await updateDoc(shareRef, { status: 'accepted' });

    } catch (error) {
        console.error("Erreur lors de l'acceptation de l'invitation : ", error);
        alert("Une erreur est survenue.");
    }
}

async function declineShare(shareId) {
    try {
        const shareRef = doc(db, 'shares', shareId);
        await updateDoc(shareRef, { status: 'declined' });
    } catch (error) {
        console.error("Erreur lors du refus du partage : ", error);
        alert("Une erreur est survenue.");
    }
}

// --- Friend Request Handling ---
async function handleAcceptFriendRequest(notificationId) {
    try {
        await acceptFriendRequest(notificationId);
    } catch {
        alert("Erreur lors de l'acceptation.");
    }
}

async function handleDeclineFriendRequest(notificationId) {
    try {
        await declineFriendRequest(notificationId);
    }
    catch {
        alert("Erreur lors du refus.");
    }
}

// --- Rendering ---
function renderAllNotifications() {
    if (!ui.list) return;

    const allNotifications = [...pendingShares, ...pendingFriendRequests];
    allNotifications.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

    // Update badges
    const updateBadge = (badgeElement) => {
        if (badgeElement) {
            if (allNotifications.length > 0) {
                badgeElement.textContent = allNotifications.length;
                badgeElement.classList.remove('hidden');
            } else {
                badgeElement.classList.add('hidden');
            }
        }
    };

    updateBadge(ui.badge);
    updateBadge(ui.badgeMobile);


    // Populate dropdown
    ui.list.innerHTML = '';
    if (allNotifications.length === 0) {
        ui.list.innerHTML = '<p class="text-gray-500 text-center p-4">Aucune nouvelle notification.</p>';
    } else {
        allNotifications.forEach(notification => {
            const notificationDiv = renderNotification(notification);
            ui.list.appendChild(notificationDiv);
        });
    }
}

function renderNotification(notification) {
    const notifDiv = document.createElement('div');
    notifDiv.className = 'p-3 border-b border-gray-100 hover:bg-gray-50';

    const title = document.createElement('p');
    title.className = 'text-sm font-medium text-gray-800';
    
    const info = document.createElement('p');
    info.className = 'text-xs text-gray-500 mb-3';

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'flex space-x-2 justify-end';

    const notificationType = notification.data.type || notification.type;

    if (notificationType === 'collaborative_plan_invite') {
        title.textContent = `Invitation à collaborer`;
        info.textContent = `${notification.sender.displayName} vous invite à modifier son plan "${notification.data.planName}".`;

        const acceptBtn = createButton('Accepter', 'btn-secondary', (e) => {
            e.target.textContent = '...';
            e.target.disabled = true;
            acceptCollaborativePlan(notification.id, notification.data);
        });
        const declineBtn = createButton('Refuser', 'btn-ghost text-red-500', (e) => {
            e.target.disabled = true;
            declineShare(notification.id);
        });
        buttonsDiv.append(acceptBtn, declineBtn);

    } else if (notificationType === 'share') {
        title.textContent = `Partage de ${notification.sender.displayName || notification.sender.email}`;
        let sharedItems = [];
        if (notification.data.plan) sharedItems.push('planification');
        if (notification.data.shoppingList) sharedItems.push('liste de courses');
        info.textContent = `Contenu : ${sharedItems.join(' et ')}`;

        const acceptBtn = createButton('Accepter', 'btn-secondary', (e) => {
            e.target.textContent = '...';
            e.target.disabled = true;
            acceptShare(notification.id, notification.data, notification.sender);
        });
        const declineBtn = createButton('Refuser', 'btn-ghost text-red-500', (e) => {
            e.target.disabled = true;
            declineShare(notification.id);
        });
        buttonsDiv.append(acceptBtn, declineBtn);

    } else if (notificationType === 'friend_request') {
        title.textContent = `Invitation d'ami`;
        info.textContent = `${notification.sender.displayName || notification.sender.email} vous a envoyé une invitation.`;

        const acceptBtn = createButton('Accepter', 'btn-secondary', (e) => {
            e.target.textContent = '...';
            e.target.disabled = true;
            handleAcceptFriendRequest(notification.id);
        });
        const declineBtn = createButton('Refuser', 'btn-ghost text-red-500', (e) => {
            e.target.disabled = true;
            handleDeclineFriendRequest(notification.id);
        });
        buttonsDiv.append(acceptBtn, declineBtn);
    }

    notifDiv.append(title, info, buttonsDiv);
    return notifDiv;
}

function createButton(text, classes, onClick) {
    const button = document.createElement('button');
    button.className = `btn btn-xs ${classes}`;
    button.textContent = text;
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        onClick(e);
    });
    return button;
}

// --- Listeners Setup ---
function listenForShares(userId) {
    const sharesRef = collection(db, 'shares');
    const qShares = query(sharesRef, where('receiverId', '==', userId), where('status', '==', 'pending'));
    
    unsubscribeShares = onSnapshot(qShares, async (snapshot) => {
        const shares = [];
        for (const shareDoc of snapshot.docs) {
            const share = shareDoc.data();
            const senderDoc = await getDoc(doc(db, 'users', share.senderId));
            if (senderDoc.exists()) {
                shares.push({
                    type: share.type || 'share', // Utilise le type du document, avec 'share' comme fallback
                    id: shareDoc.id,
                    data: share,
                    sender: senderDoc.data(),
                    createdAt: share.createdAt
                });
            }
        }
        pendingShares = shares;
        renderAllNotifications();
    }, (error) => {
        console.error("Erreur d'écoute des partages:", error);
    });
}

function listenForFriendRequests(userId) {
    const requestsRef = collection(db, 'friend_requests');
    const qRequests = query(requestsRef, where('receiverId', '==', userId), where('status', '==', 'pending'));

    unsubscribeFriendRequests = onSnapshot(qRequests, async (snapshot) => {
        const requests = [];
        for (const requestDoc of snapshot.docs) {
            const request = requestDoc.data();
            const senderDoc = await getDoc(doc(db, 'users', request.senderId));
            if (senderDoc.exists()) {
                requests.push({
                    type: 'friend_request',
                    id: requestDoc.id,
                    data: request,
                    sender: senderDoc.data(),
                    createdAt: request.createdAt
                });
            }
        }
        pendingFriendRequests = requests;
        renderAllNotifications();
    }, (error) => {
        console.error("Erreur d'écoute des invitations d'amis:", error);
    });
}

// --- Main Initialization ---
export function initNotifications() {
    ui.btn = document.getElementById('notifications-btn');
    ui.btnMobile = document.getElementById('notifications-btn-mobile'); // Get mobile button
    ui.badge = document.getElementById('notifications-badge');
    ui.badgeMobile = document.getElementById('notifications-badge-mobile');
    ui.dropdown = document.getElementById('notifications-dropdown');
    ui.list = document.getElementById('notifications-list');

    if (!ui.btn || !ui.dropdown) return; // Check for dropdown as well

    const currentUserId = getCurrentUserId();
    if (!currentUserId) return;

    // Detach previous listeners if any
    unsubscribeShares();
    unsubscribeFriendRequests();

    // Attach new listeners
    listenForShares(currentUserId);
    listenForFriendRequests(currentUserId);

    const toggleDropdown = (e) => {
        e.stopPropagation();
        const isHidden = ui.dropdown.classList.toggle('hidden');
        
        if (!isHidden) {
            const isMobile = window.innerWidth < 768;
            const button = isMobile ? ui.btnMobile : ui.btn;
            if (!button) return; // Safety check
            
            const btnRect = button.getBoundingClientRect();

            // Positionne le dropdown par rapport au bouton
            ui.dropdown.style.position = 'fixed'; // Use fixed positioning
            if (isMobile) {
                ui.dropdown.style.top = `${btnRect.bottom + 8}px`;
                ui.dropdown.style.left = '50%';
                ui.dropdown.style.transform = 'translateX(-50%)';
                ui.dropdown.style.width = '95vw';
                ui.dropdown.style.right = 'auto';
            } else {
                // Desktop positioning
                ui.dropdown.style.top = `${btnRect.bottom + 8}px`;
                ui.dropdown.style.left = 'auto';
                ui.dropdown.style.right = `${window.innerWidth - btnRect.right}px`;
                ui.dropdown.style.transform = 'none';
                ui.dropdown.style.width = '20rem'; // w-80
            }
        }
    };

    // Setup event listeners for UI
    ui.btn.addEventListener('click', toggleDropdown);
    if (ui.btnMobile) {
        ui.btnMobile.addEventListener('click', toggleDropdown);
    }

    document.addEventListener('click', (event) => {
        if (ui.dropdown && !ui.dropdown.classList.contains('hidden')) {
            const isClickInside = ui.btn.contains(event.target) || 
                                  (ui.btnMobile && ui.btnMobile.contains(event.target)) || 
                                  ui.dropdown.contains(event.target);
            if (!isClickInside) {
                ui.dropdown.classList.add('hidden');
            }
        }
    });
}
