// Ce script supprime TOUTES les listes d'amis de TOUS les utilisateurs.
// Il met à jour chaque document utilisateur pour remplacer le champ 'friends' par un tableau vide.
// À utiliser avec précaution.

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

// Utilise le même compte de service que le script de sauvegarde
const serviceAccount = require('./service-account-key.json');

// Initialisation de l'application Firebase avec les droits d'administrateur
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

/**
 * Fonction principale qui lance le nettoyage des listes d'amis.
 */
async function runCleanup() {
    console.log("--- Début du script de nettoyage des listes d'amis ---");
    
    const usersRef = db.collection('users');
    let totalUsersUpdated = 0;

    try {
        const snapshot = await usersRef.get();
        
        if (snapshot.empty) {
            console.log("Aucun utilisateur trouvé dans la collection.");
            return;
        }

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            console.log(`Préparation de la mise à jour pour l'utilisateur : ${doc.id}`);
            batch.update(doc.ref, { friends: [] });
            totalUsersUpdated++;
        });

        await batch.commit();

        console.log(`\n✅ Nettoyage terminé ! ${totalUsersUpdated} utilisateurs ont vu leur liste d'amis vidée.`);

    } catch (error) {
        console.error("\n❌ Une erreur est survenue lors du nettoyage :", error);
    }

    console.log("--- Fin du script ---");
}

// Lance le script
runCleanup();
