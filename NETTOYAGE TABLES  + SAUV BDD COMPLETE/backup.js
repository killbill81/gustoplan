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

// Liste de toutes les collections à sauvegarder
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

// Lance le script
runBackup();