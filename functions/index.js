const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

/**
 * Se déclenche quand un document 'shares' est mis à jour.
 * Si une invitation de plan collaboratif est acceptée, ajoute le destinataire comme collaborateur.
 */
exports.onAcceptCollaborativeInvite = functions.firestore
    .document("shares/{shareId}")
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const oldData = change.before.data();

        if (
            newData.type === "collaborative_plan_invite" &&
            newData.status === "accepted" &&
            oldData.status === "pending"
        ) {
            const planId = newData.planId;
            const receiverId = newData.receiverId;

            if (!planId || !receiverId) {
                console.log("Invitation de plan invalide.");
                return null;
            }

            const planRef = db.collection("plans").doc(planId);
            try {
                await planRef.update({
                    collaborators: admin.firestore.FieldValue.arrayUnion(receiverId),
                });
                return console.log(`Utilisateur ${receiverId} ajouté au plan ${planId}.`);
            } catch (error) {
                return console.error(`Échec de l'ajout au plan ${planId}.`, error);
            }
        }
        return null;
    });

/**
 * Se déclenche quand un document 'friend_requests' est mis à jour.
 * Si une demande d'ami est acceptée, crée la relation d'amitié réciproque.
 */
exports.onAcceptFriendRequest = functions.firestore
    .document("friend_requests/{requestId}")
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const oldData = change.before.data();

        if (newData.status === "accepted" && oldData.status === "pending") {
            const senderId = newData.senderId;
            const receiverId = newData.receiverId;

            if (!senderId || !receiverId) {
                console.log("Demande d'ami invalide.");
                return null;
            }

            const receiverRef = db.collection("users").doc(receiverId);
            const senderRef = db.collection("users").doc(senderId);

            const batch = db.batch();

            // Ajoute chaque utilisateur à la liste d'amis de l'autre
            batch.update(receiverRef, { friends: admin.firestore.FieldValue.arrayUnion(senderId) });
            batch.update(senderRef, { friends: admin.firestore.FieldValue.arrayUnion(receiverId) });

            // Supprime la demande d'ami traitée
            batch.delete(change.after.ref);

            try {
                await batch.commit();
                return console.log(`Amitié créée entre ${senderId} et ${receiverId}.`);
            } catch (error) {
                return console.error("Échec de la création de l'amitié.", error);
            }
        }
        return null;
    });
