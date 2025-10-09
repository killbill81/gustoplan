// Ce script sert à supprimer toutes les données des collections 'plans', 'shopping_lists' et 'active_shopping_list' dans Firestore.
// ATTENTION : Cette action est irréversible.

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc } = require('firebase/firestore');

// IMPORTANT: Copiez et collez la configuration de votre projet Firebase ici
// Vous la trouverez dans votre fichier src/firebase-config.js
const firebaseConfig = {
    apiKey: "AIzaSyAf2Fmg5SBU6zpZ9r-VP_eTF49r-e1go7Q",
    authDomain: "gustoplan-dev.firebaseapp.com",
    projectId: "gustoplan-dev",
    storageBucket: "gustoplan-dev.firebasestorage.app",
    messagingSenderId: "554162135180",
    appId: "1:554162135180:web:f5addf322a0977ffe31ba9"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Supprime tous les documents d'une collection donnée.
 * @param {string} collectionName Le nom de la collection à vider.
 */
async function clearCollection(collectionName) {
    try {
        console.log(`Nettoyage de la collection : ${collectionName}...`);
        const collectionRef = collection(db, collectionName);
        const querySnapshot = await getDocs(collectionRef);
        
        if (querySnapshot.empty) {
            console.log(`La collection "${collectionName}" est déjà vide.`);
            return;
        }

        const deletePromises = [];
        querySnapshot.forEach((doc) => {
            deletePromises.push(deleteDoc(doc.ref));
        });

        await Promise.all(deletePromises);
        console.log(`✅ La collection "${collectionName}" a été vidée avec succès (${querySnapshot.size} documents supprimés).`);
    } catch (error) {
        console.error(`❌ Erreur lors du nettoyage de la collection "${collectionName}":`, error);
    }
}

/**
 * Fonction principale qui exécute le nettoyage.
 */
async function runCleanup() {
    console.log("--- Début du script de nettoyage Firebase ---");

    // Liste des collections à vider
    const collectionsToClear = ['plans', 'shopping_lists', 'active_shopping_list'];

    for (const name of collectionsToClear) {
        await clearCollection(name);
    }

    console.log("\n--- Nettoyage terminé ---");
    // Le script ne se terminera pas de lui-même à cause de la connexion Firebase.
    // Vous pouvez l'arrêter manuellement (Ctrl+C).
    process.exit(0);
}

// Lance le script
runCleanup();
