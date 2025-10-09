const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

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
                console.log("Invitation invalide.");
                return null;
            }

            const planRef = db.collection("plans").doc(planId);

            try {
                await planRef.update({
                    collaborators: admin.firestore.FieldValue.arrayUnion(receiverId),
                });
                console.log(`Utilisateur ${receiverId} ajouté au plan ${planId}.`);
                return null;
            } catch (error) {
                console.error(`Échec de l'ajout de l'utilisateur au plan.`, error);
                return null;
            }
        }
        return null;
    });