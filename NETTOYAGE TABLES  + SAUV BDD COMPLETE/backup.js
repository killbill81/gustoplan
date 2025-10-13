// Ce script sauvegarde toutes les collections spécifiées de Firestore dans un fichier backup.json
// Il utilise l'authentification Admin via un compte de service pour contourner les règles de sécurité.

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

// IMPORTANT: Assurez-vous que votre fichier de clé de compte de service est présent
// dans le même dossier et s'appelle "service-account-key.json"
const serviceAccount = require('./service-account-key.json');

// Initialisation de l'application Firebase avec les droits d'administrateur
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// --- Fonctions de Nettoyage ---
async function cleanupFriends() {
    console.log("--- Lancement du nettoyage des listes d'amis ---");
    const usersRef = db.collection('users');
    let totalUsersUpdated = 0;
    try {
        const snapshot = await usersRef.get();
        if (snapshot.empty) {
            console.log("Aucun utilisateur à nettoyer.");
            return;
        }
        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.update(doc.ref, { friends: [] });
            totalUsersUpdated++;
        });
        await batch.commit();
        console.log(`\n✅ ${totalUsersUpdated} utilisateurs ont vu leur liste d'amis vidée.`);
    } catch (error) {
        console.error("\n❌ Erreur lors du nettoyage des amis :", error);
    }
}

// --- Fonctions de Sauvegarde ---
const collectionsToBackup = [
    'active_shopping_list',
    'friend_requests',
    'ingredient_categories',
    'ingredients',
    'plans',
    'recipes',
    'shares',
    'shopping_lists',
    'users'
];

/**
 * Fonction principale qui exécute la sauvegarde.
 */
async function runBackup() {
    console.log("--- Début du script de sauvegarde Firebase (Admin) ---");
    const backupData = {};

    for (const collectionName of collectionsToBackup) {
        try {
            console.log(`Sauvegarde de la collection : ${collectionName}...`);
            const collectionRef = db.collection(collectionName);
            const snapshot = await collectionRef.get();

            const collectionData = {};
            snapshot.forEach((doc) => {
                collectionData[doc.id] = doc.data();
            });

            backupData[collectionName] = collectionData;
            console.log(`✅ Collection "${collectionName}" sauvegardée (${snapshot.size} documents).`);

        } catch (error) {
            console.error(`❌ Erreur lors de la sauvegarde de la collection "${collectionName}":`, error);
        }
    }

    try {
        fs.writeFileSync(path.join(__dirname, 'backup.json'), JSON.stringify(backupData, null, 2));
        console.log("\n✅ Sauvegarde terminée ! Le fichier backup.json a été créé.");
    } catch (error) {
        console.error("\n❌ Erreur lors de l'écriture du fichier backup.json:", error);
    }

    console.log("--- Fin du script ---");
}

// --- Exécution du script ---

const command = process.argv[2]; // Récupère le premier argument après le nom du script

if (command === 'cleanup_friends') {
    cleanupFriends().then(() => console.log("--- Fin du script ---"));
} else {
    runBackup();
}