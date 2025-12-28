import { seasonManager } from './season-manager.js';
import { db } from './firebase-config.js';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, arrayRemove, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { getCurrentUser } from './auth.js';

export function initSettingsUI() {
    // Elements
    const modeRadios = document.getElementsByName('season-mode');
    const forcedSeasonSelector = document.getElementById('forced-season-selector');
    const forcedSeasonSelect = document.getElementById('forced-season-select');
    const offSeasonBehaviorSelect = document.getElementById('off-season-behavior');
    const rulePrioritizeSeasonal = document.getElementById('rule-prioritize-seasonal');
    const ruleWarnOffSeason = document.getElementById('rule-warn-off-season');

    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings-modal');
    const headerSettingsBtn = document.getElementById('header-settings-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');

    // Friends Elements
    const friendsListContainer = document.getElementById('settings-friends-list');
    const friendsSearchInput = document.getElementById('settings-friends-search-input');
    const friendsSearchBtn = document.getElementById('settings-friends-search-btn');
    const friendsSearchResults = document.getElementById('settings-friends-search-results');

    // Pending State
    let pendingConfig = {};
    let unsubscribeFriends = null;

    // Open/Close Logic
    function openSettings() {
        if (settingsModal) {
            // Load current config into pending state on open
            pendingConfig = { ...seasonManager.config };
            syncUIToConfig(pendingConfig);
            settingsModal.classList.remove('hidden');
            loadFriends();
        }
    }

    function closeSettings() {
        if (settingsModal) settingsModal.classList.add('hidden');
        if (unsubscribeFriends) {
            unsubscribeFriends();
            unsubscribeFriends = null;
        }
    }

    function saveAndClose() {
        seasonManager.updateConfig(pendingConfig);
        closeSettings();
    }

    // Listeners
    if (headerSettingsBtn) headerSettingsBtn.addEventListener('click', openSettings);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);
    if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveAndClose);

    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettings();
        });
    }

    // Friends Listeners
    if (friendsSearchBtn) {
        friendsSearchBtn.addEventListener('click', () => searchUsers(friendsSearchInput.value));
    }
    if (friendsSearchInput) {
        friendsSearchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') searchUsers(friendsSearchInput.value);
        });
    }

    // --- Friends Logic ---
    async function loadFriends() {
        const currentUserId = getCurrentUser()?.uid;
        if (!currentUserId || !friendsListContainer) return;

        friendsListContainer.innerHTML = '<p class="text-xs text-center text-gray-500 py-4"><i class="fas fa-spinner fa-spin mr-2"></i>Chargement des amis...</p>';

        const userDocRef = doc(db, 'users', currentUserId);
        unsubscribeFriends = onSnapshot(userDocRef, async (docSnap) => {
            if (!docSnap.exists()) return;

            const friendIds = docSnap.data().friends || [];
            friendsListContainer.innerHTML = '';

            if (friendIds.length === 0) {
                friendsListContainer.innerHTML = `
                    <div class="text-center py-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-600">
                        <i class="fas fa-user-friends text-gray-300 text-2xl mb-2 block"></i>
                        <p class="text-xs text-gray-400">Aucun ami pour le moment</p>
                    </div>`;
                return;
            }

            for (const friendId of friendIds) {
                try {
                    const friendDoc = await getDoc(doc(db, 'users', friendId));
                    if (friendDoc.exists()) {
                        friendsListContainer.appendChild(createFriendItem(friendDoc.data()));
                    }
                } catch (e) { console.error("Erreur de chargement d'un ami", e); }
            }
        });
    }

    function createFriendItem(userData) {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm';
        div.innerHTML = `
            <div class="flex items-center">
                <img src="${userData.photoURL || 'https://placehold.co/32'}" class="w-8 h-8 rounded-full mr-2 object-cover">
                <div class="leading-tight">
                    <p class="text-xs font-bold text-gray-800 dark:text-gray-200">${userData.displayName}</p>
                    <p class="text-[10px] text-gray-400">${userData.email}</p>
                </div>
            </div>
        `;
        const removeBtn = document.createElement('button');
        removeBtn.className = 'text-gray-400 hover:text-red-500 p-1.5 transition-colors';
        removeBtn.innerHTML = '<i class="fas fa-user-minus"></i>';
        removeBtn.onclick = () => removeFriend(userData.uid);
        div.appendChild(removeBtn);
        return div;
    }

    async function removeFriend(friendId) {
        const uid = getCurrentUser()?.uid;
        if (!uid || !confirm("Retirer cet ami ?")) return;
        try {
            await updateDoc(doc(db, "users", uid), { friends: arrayRemove(friendId) });
        } catch (e) { alert("Erreur lors de la suppression"); }
    }

    async function searchUsers(term) {
        if (!term || !friendsSearchResults) return;
        const uid = getCurrentUser()?.uid;
        friendsSearchResults.innerHTML = '<p class="text-[10px] text-center text-gray-500"><i class="fas fa-spinner fa-spin mr-1"></i>Recherche...</p>';

        try {
            const lower = term.toLowerCase();
            const q = query(collection(db, "users"), where("email", "==", lower));
            const snap = await getDocs(q);

            friendsSearchResults.innerHTML = '';
            if (snap.empty) {
                friendsSearchResults.innerHTML = '<p class="text-[10px] text-center text-gray-400 italic">Aucun utilisateur trouvé par email</p>';
                return;
            }

            snap.forEach(d => {
                const userData = d.data();
                if (userData.uid === uid) return;

                const card = document.createElement('div');
                card.className = 'flex items-center justify-between p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm';
                card.innerHTML = `
                    <div class="flex items-center">
                        <img src="${userData.photoURL || 'https://placehold.co/24'}" class="w-6 h-6 rounded-full mr-2">
                        <span class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">${userData.displayName}</span>
                    </div>
                `;
                const addBtn = document.createElement('button');
                addBtn.className = 'bg-tomato/10 hover:bg-tomato text-tomato hover:text-white px-2 py-1 rounded text-[10px] font-bold transition-all';
                addBtn.textContent = 'Ajouter';
                addBtn.onclick = () => sendFriendRequest(userData.uid);
                card.appendChild(addBtn);
                friendsSearchResults.appendChild(card);
            });
        } catch (e) {
            friendsSearchResults.innerHTML = '<p class="text-[10px] text-red-500 text-center">Erreur de recherche</p>';
        }
    }

    async function sendFriendRequest(receiverId) {
        const uid = getCurrentUser()?.uid;
        if (!uid) return;
        try {
            // Check existing
            const q = query(collection(db, "friend_requests"), where("senderId", "==", uid), where("receiverId", "==", receiverId));
            const snap = await getDocs(q);
            if (!snap.empty) return alert("Demande déjà envoyée");

            await addDoc(collection(db, "friend_requests"), {
                senderId: uid,
                receiverId: receiverId,
                status: 'pending',
                createdAt: serverTimestamp()
            });
            alert("Demande envoyée !");
            friendsSearchResults.innerHTML = '';
            friendsSearchInput.value = '';
        } catch (e) { alert("Erreur d'envoi"); }
    }

    // --- UI Sync Helper ---
    function syncUIToConfig(config) {
        // Mode
        Array.from(modeRadios).forEach(radio => {
            if (radio.value === config.mode) radio.checked = true;
        });
        updateUIVisibility(config.mode);

        // Forced Season
        if (config.forcedSeason) forcedSeasonSelect.value = config.forcedSeason;

        // Behavior
        if (config.offSeasonBehavior) offSeasonBehaviorSelect.value = config.offSeasonBehavior;

        // Rules
        if (rulePrioritizeSeasonal) rulePrioritizeSeasonal.checked = config.recipeRules?.prioritizeSeasonal || false;
        if (ruleWarnOffSeason) ruleWarnOffSeason.checked = config.recipeRules?.warnOffSeason || false;
    }

    // --- Change Listeners (Update Pending State ONLY) ---

    // Mode
    Array.from(modeRadios).forEach(radio => {
        radio.addEventListener('change', (e) => {
            pendingConfig.mode = e.target.value;
            updateUIVisibility(e.target.value);
        });
    });

    // Forced Season
    forcedSeasonSelect.addEventListener('change', (e) => {
        pendingConfig.forcedSeason = e.target.value;
    });

    // Off-Season Behavior
    offSeasonBehaviorSelect.addEventListener('change', (e) => {
        pendingConfig.offSeasonBehavior = e.target.value;
    });

    // Rules
    if (rulePrioritizeSeasonal) {
        rulePrioritizeSeasonal.addEventListener('change', (e) => {
            pendingConfig.recipeRules = { ...pendingConfig.recipeRules, prioritizeSeasonal: e.target.checked };
        });
    }

    if (ruleWarnOffSeason) {
        ruleWarnOffSeason.addEventListener('change', (e) => {
            pendingConfig.recipeRules = { ...pendingConfig.recipeRules, warnOffSeason: e.target.checked };
        });
    }

    function updateUIVisibility(mode) {
        if (mode === 'forced') {
            forcedSeasonSelector.classList.remove('hidden');
        } else {
            forcedSeasonSelector.classList.add('hidden');
        }
    }
}
