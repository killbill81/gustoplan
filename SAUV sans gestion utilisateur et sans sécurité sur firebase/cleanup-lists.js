// Ce script est à usage unique pour nettoyer les données dans Firebase.
// Il supprime le champ 'people' de tous les documents de la collection 'shopping_lists'.

import { db } from './firebase-config.js';
import { collection, getDocs, doc, updateDoc, deleteField } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function cleanupShoppingLists() {
    console.log("Début du nettoyage de la collection 'shopping_lists'...");

    try {
        const listsCollectionRef = collection(db, 'shopping_lists');
        const querySnapshot = await getDocs(listsCollectionRef);

        if (querySnapshot.empty) {
            console.log("La collection 'shopping_lists' est vide. Aucune action n'est nécessaire.");
            return;
        }

        const promises = [];
        querySnapshot.forEach(documentSnapshot => {
            const docRef = doc(db, 'shopping_lists', documentSnapshot.id);
            promises.push(
                updateDoc(docRef, {
                    people: deleteField()
                })
            );
            console.log(`Suppression du champ 'people' pour la liste : ${documentSnapshot.id}`);
        });

        await Promise.all(promises);

        console.log(`Nettoyage terminé. ${querySnapshot.size} document(s) ont été mis à jour.`);

    } catch (error) {
        console.error("Une erreur est survenue lors du nettoyage :", error);
    }
}

// Pour exécuter le script, ouvrez la console de votre navigateur sur la page de l'application
// et collez le contenu de ce fichier, puis appelez la fonction cleanupShoppingLists().
// Ou, si vous avez un environnement Node.js configuré, vous pouvez l'exécuter avec Node.

// Appel de la fonction pour démarrer le processus.
cleanupShoppingLists();
