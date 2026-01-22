
import { collection, getDocs, updateDoc, doc, writeBatch } from "firebase/firestore";
import { db, auth } from "./firebase-config.js";

export async function migrateDataToCurrentUser() {
    const user = auth.currentUser;
    if (!user) {
        alert("Erreur: Vous devez être connecté.");
        return;
    }

    if (!confirm(`La migration va attribuer TOUTES les recettes et ingrédients existants à l'utilisateur :\n${user.displayName} (${user.email}).\n\nConfirmer ?`)) {
        return;
    }

    console.log("Migration started...");
    let updatedCount = 0;
    const batchSize = 450; // Safety margin below 500

    try {
        // 1. Recipes
        const recipesRef = collection(db, "recipes");
        const recipesSnapshot = await getDocs(recipesRef);
        let batch = writeBatch(db);
        let ops = 0;

        for (const docSnapshot of recipesSnapshot.docs) {
            const data = docSnapshot.data();
            if (!data.userId || data.userId === 'unknown') {
                batch.update(doc(db, "recipes", docSnapshot.id), {
                    userId: user.uid,
                    authorName: user.displayName || "Utilisateur"
                });
                ops++;
                updatedCount++;

                if (ops >= batchSize) {
                    await batch.commit();
                    batch = writeBatch(db);
                    ops = 0;
                }
            }
        }
        if (ops > 0) await batch.commit();

        // 2. Ingredients
        const ingredientsRef = collection(db, "ingredients");
        const ingredientSnapshot = await getDocs(ingredientsRef);
        batch = writeBatch(db);
        ops = 0;

        for (const docSnapshot of ingredientSnapshot.docs) {
            const data = docSnapshot.data();
            if (!data.userId || data.userId === 'unknown') {
                batch.update(doc(db, "ingredients", docSnapshot.id), {
                    userId: user.uid
                });
                ops++;
                updatedCount++;

                if (ops >= batchSize) {
                    await batch.commit();
                    batch = writeBatch(db);
                    ops = 0;
                }
            }
        }
        if (ops > 0) await batch.commit();

        alert(`Migration terminée avec succès !\n${updatedCount} éléments mis à jour.`);
        window.location.reload();

    } catch (error) {
        console.error("Erreur migration:", error);
        alert(`Erreur lors de la migration :\n${error.message}\n\n(Avez-vous déployé les règles Firestore ?)`);
    }
}
