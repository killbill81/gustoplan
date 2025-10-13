// Ce script supprime TOUS les documents de la collection 'friend_requests'.
// À utiliser pour repartir de zéro sur les tests d'invitations.

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Utilise le même compte de service que les autres scripts
const serviceAccount = require('./service-account-key.json');

// Initialisation de l'application Firebase avec les droits d'administrateur
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

/**
 * Supprime tous les documents d'une collection donnée.
 * @param {string} collectionPath Le chemin de la collection à vider.
 */
async function deleteCollection(collectionPath) {
  const collectionRef = db.collection(collectionPath);
  const snapshot = await collectionRef.limit(500).get(); // Limite par batch

  if (snapshot.size === 0) {
    console.log(`La collection "${collectionPath}" est déjà vide.`);
    return;
  }

  // Supprime les documents par lots
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  console.log(`✅ ${snapshot.size} documents supprimés de la collection "${collectionPath}".`);

  // S'il reste des documents, on relance la fonction (récursivité)
  if (snapshot.size >= 500) {
    await deleteCollection(collectionPath);
  }
}

/**
 * Fonction principale qui lance le nettoyage.
 */
async function runCleanup() {
    console.log("--- Début du script de nettoyage de la collection 'friend_requests' ---");
    
    const collectionToClean = 'friend_requests';

    await deleteCollection(collectionToClean);

    console.log("--- Fin du script ---");
}

// Lance le script
runCleanup();
