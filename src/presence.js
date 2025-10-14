import { getDatabase, ref, onValue, set, remove, onDisconnect, serverTimestamp, update } from "firebase/database";
import { getCurrentUser } from "./auth.js";
import { rtdb } from "./firebase-config.js";

let currentPlanId = null;
let userStatusRef = null;
let presenceListener = null;

// Fonction pour se connecter au canal de présence d'un plan
export function connectToPresenceChannel(planId, callback) {
    if (!rtdb || !planId) return;

    const user = getCurrentUser();
    if (!user) return;

    currentPlanId = planId;

    // Référence à la liste des utilisateurs présents sur ce plan
    const planPresenceRef = ref(rtdb, `plans_presence/${planId}`);

    // Référence au statut de l'utilisateur actuel
    userStatusRef = ref(rtdb, `plans_presence/${planId}/${user.uid}`);

    // Met à jour le statut de l'utilisateur et gère la déconnexion
    const status = {
        displayName: user.displayName || user.email,
        photoURL: user.photoURL,
        status: 'idle', // idle, { type: 'editing_remark', fieldId: '...' }
        last_seen: serverTimestamp()
    };

    // Gère la déconnexion automatique
    onDisconnect(userStatusRef).remove();

    // Définit le statut initial de l'utilisateur comme étant en ligne
    set(userStatusRef, status);

    // Écoute les changements sur la liste des présents pour ce plan
    if (presenceListener) {
        presenceListener(); // Détache l'ancien listener
    }
    presenceListener = onValue(planPresenceRef, (snapshot) => {
        const presences = snapshot.val() || {};
        // Le callback mettra à jour l'UI (par exemple, les avatars)
        if (typeof callback === 'function') {
            callback(presences);
        }
    });
}

// Fonction pour se déconnecter manuellement d'un canal (en changeant de plan)
export function disconnectFromPresenceChannel() {
    if (userStatusRef) {
        remove(userStatusRef);
        userStatusRef = null;
    }
    if (presenceListener) {
        presenceListener(); // Détache le listener de la RTDB
        presenceListener = null;
    }
    currentPlanId = null;
}

// Met à jour le statut de l'action de l'utilisateur
export function updateUserActivity(newStatus) {
    if (userStatusRef) {
        update(userStatusRef, {
            status: newStatus,
            last_seen: serverTimestamp()
        });
    }
}
